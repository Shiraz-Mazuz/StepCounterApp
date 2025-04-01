import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import PedometerCircle from './PedometerCircle';
import Buttons from './Buttons';
import { styles } from '../styles/styles';
import Users from './Users';

export default function HomeScreen({ navigation }) {
  const [steps, setSteps] = useState(0);
  const [weeklySteps, setWeeklySteps] = useState(0);
  const weeklyGoal = 10000;
  const dailyGoal = 5000;
  const [coins, setCoins] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [convertedCoins, setConvertedCoins] = useState(0);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [animatedCoins, setAnimatedCoins] = useState([]);
  const [userName, setUserName] = useState("Guest");
  const [userImage, setUserImage] = useState(null);
  const [conversionConfig, setConversionConfig] = useState({
    stepsPerThreshold: 1000,
    coinsPerThreshold: 10,
  });
  const [streakDays, setStreakDays] = useState(0);
  const [dailyStepsHistory, setDailyStepsHistory] = useState([]);
  const [distance, setDistance] = useState(0);

  const stepGoals = [
    { steps: 2000, coins: 3 },
    { steps: 4000, coins: 6 },
    { steps: 7000, coins: 10 },
    { steps: 10000, coins: 15 },
    { steps: 15000, coins: 25 },
  ];

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log("Error saving data:", error);
    }
  };

  useEffect(() => {
    const ConversionConfig = async () => {
      try {
        const response = await fetch('http://192.168.140.1:5000/api/conversion-config');
        const data = await response.json();
        setConversionConfig({
          stepsPerThreshold: data.stepsPerThreshold,
          coinsPerThreshold: data.coinsPerThreshold,
        });
      } catch (error) {
        console.log("Error fetching conversion config:", error);
      }
    };

    ConversionConfig();
  }, []);

  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value != null ? JSON.parse(value) : null;
    } catch (error) {
      console.log("Error reading data:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const savedSteps = await getData('steps');
      const savedWeeklySteps = await getData('weeklySteps');
      const savedCoins = await getData('coins');
      const savedStartDate = await getData('startDate');
      const savedUserName = await getData("userName");
      const savedUserImage = await getData("userImage");
      const savedDailyStepsHistory = await getData("dailyStepsHistory");
      const savedStreakDays = await getData("streakDays");
      const savedLastDate = await getData("lastDate");

      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const lastDate = savedLastDate || today;

      if (lastDate !== today) {
        if (savedSteps > 0) {
          const newHistory = [
            ...(savedDailyStepsHistory || []),
            { date: lastDate, steps: savedSteps },
          ];
          setDailyStepsHistory(newHistory);
          await storeData("dailyStepsHistory", newHistory);
          if (savedSteps >= dailyGoal) {
            const newStreak = (savedStreakDays || 0) + 1;
            setStreakDays(newStreak);
            await storeData("streakDays", newStreak);
          } else {
            setStreakDays(0);
            await storeData("streakDays", 0);
          }
        }
        setSteps(0);
        await storeData("steps", 0);
        await storeData("lastDate", today);
      } else {
        setSteps(savedSteps || 0);
        setDailyStepsHistory(savedDailyStepsHistory || []);
        setStreakDays(savedStreakDays || 0);
      }

      const weekStart = savedStartDate ? new Date(savedStartDate) : now;

      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
      if (savedStartDate && now - weekStart >= oneWeekInMs) {
        setWeeklySteps(0);
        await storeData("weeklySteps", 0);
        await storeData("startDate", now.toISOString());
        setDailyStepsHistory([]);
        await storeData("dailyStepsHistory", []);
        setStreakDays(0);
        await storeData("streakDays", 0);
      } else {
        setWeeklySteps(savedWeeklySteps || 0);
      }
      setCoins(savedCoins || 0);
      setUserName(savedUserName || "Guest");
      setUserImage(savedUserImage || null);
    };

    loadData();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required to access the gallery");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaType: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setUserImage(imageUri);
      await storeData("userImage", imageUri);
    }
  };

  
  useEffect(() => {
    const initializePedometer = async () => {
      const result = await Pedometer.isAvailableAsync();
      if (!result) {
        console.log("The pedometer is not available on this phone.");
        return;
      }

      const { status } = await Pedometer.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("הרשאה נדרשת", "אנחנו צריכים הרשאה לגשת לחיישני התנועה כדי לספור צעדים.");
        return;
      }

      const subscription = Pedometer.watchStepCount(result => {
        setSteps(prevSteps => {
          const newSteps = prevSteps + result.steps;
          storeData("steps", newSteps);
          setWeeklySteps(prevWeeklySteps => {
            const newWeeklySteps = prevWeeklySteps + result.steps;
            storeData("weeklySteps", newWeeklySteps);
            return newWeeklySteps;
          });
          setDistance((newSteps * 0.78) / 1000);
          return newSteps;
        });
      });

      return () => subscription.remove();
    };

    initializePedometer();
  }, []);

  const startCoinsAnimation = () => {
    let newCoins = [];
    for (let i = 0; i < 5; i++) {
      let animatedValue = new Animated.Value(0);
      newCoins.push({ id: i, animatedValue });
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000 + i * 100,
        useNativeDriver: true,
      }).start(() => {
        if (i === 4) setAnimatedCoins([]);
      });
    }
    setAnimatedCoins(newCoins);
  };

  const convertToCoins = async () => {
    if (steps === 0) return;
    const newCoins = Math.floor(steps / 1000) * 10;
    const updatedCoins = coins + newCoins;
    setConvertedCoins(newCoins);
    setCoins(updatedCoins);
    setSteps(0);
    await storeData('coins', updatedCoins);
    await storeData('steps', 0);

    setModalVisible(true);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    startCoinsAnimation();
  };

  

  return (
    <View style={styles.container}>
      <Users
        userName={userName}
        image={userImage}
        onImagePress={pickImage}
      />
      <View style={styles.topLeftContainer}>
        <TouchableOpacity style={styles.coinButton}>
          <Text style={styles.buttonText}>My coins: {coins} 💰</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.topRightContainer}>
        <TouchableOpacity
          style={styles.giftShopButton}
          onPress={() => navigation.navigate('ShopScreen', { coins, setCoins })}
        >
          <Text style={styles.buttonText}>Gift Shop 🎁</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.streakContainer}>
        <Text style={styles.streakText}>
          {streakDays === 0
            ? "התחל את הסטרים שלך! עמוד ביעד היומי"
            : `סטרים: ${streakDays} ימים 🔥`}
        </Text>
        <View style={styles.streakDaysContainer}>
          <View style={streakDays >= 1 ? styles.streakDayActive : styles.streakDay}>
            <Text style={styles.streakDayText}>DAY 1</Text>
            {streakDays >= 1 && <Text style={styles.checkmark}>✔</Text>}
          </View>
          <View style={streakDays >= 2 ? styles.streakDayActive : styles.streakDay}>
            <Text style={styles.streakDayText}>DAY 2</Text>
            {streakDays >= 2 && <Text style={styles.checkmark}>✔</Text>}
          </View>
          <View style={streakDays >= 3 ? styles.streakDayActive : styles.streakDay}>
            <Text style={styles.streakDayText}>DAY 3</Text>
            {streakDays >= 3 && <Text style={styles.checkmark}>✔</Text>}
          </View>
        </View>
      </View>

      <PedometerCircle steps={steps} weeklyGoal={weeklyGoal} stepGoals={stepGoals} />

      <Buttons steps={steps} coins={coins} convertToCoins={convertToCoins} convertedCoins={convertedCoins} />

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>חברים</Text>
          <Text style={styles.statValue}>0 👥</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>מרחק</Text>
          <Text style={styles.statValue}>{distance.toFixed(1)} ק"מ 📍</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>מטבעות שהרווחת</Text>
          <Text style={styles.statValue}>{coins} 💰</Text>
        </View>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <View style={styles.modalTitleBox}>
              <Text style={styles.modalText}>🎉 מזל טוב 🎉</Text>
            </View>
            <Text style={styles.modalText}>
              קיבלת {convertedCoins} מטבעות! 💰
            </Text>
          </Animated.View>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.modalButton}
          >
            <Text style={styles.modalButtonText}>✖</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {animatedCoins.map(({ id, animatedValue }) => (
        <Animated.View
          key={id}
          style={{
            position: "absolute",
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [400, 50],
                }),
              },
              {
                translateX: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [180, 20],
                }),
              },
              {
                scale: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.5],
                }),
              },
            ],
            opacity: animatedValue.interpolate({
              inputRange: [0, 0.8, 1],
              outputRange: [1, 1, 0],
            }),
          }}
        >
          <Text style={{ fontSize: 25 }}>🪙</Text>
        </Animated.View>
      ))}
    </View>
  );
}




{\*pedeometer*\}


import React from "react";
import { View, Text } from "react-native";
import * as Progress from "react-native-progress";
import { styles } from "../styles/styles";

const PedometerCircle = ({ steps, weeklyGoal, stepGoals }) => {
  const progress = steps > weeklyGoal ? 1 : steps / weeklyGoal;
  const progressPercent = Math.round(progress * 100);

  return (
    <>
      <View
        style={{
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          borderRadius: 150,
        }}
      >
        <Progress.Circle
          progress={progress}
          size={300}
          thickness={10}
          color="#4CAF50"
          unfilledColor="#E0E0E0"
          showsText={false}
          borderWidth={0}
        />
        {stepGoals.map((goal, index) => {
          const angle = (index * 72 - 90) * (Math.PI / 180);
          const radius = 150;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          return (
            <View
              key={index}
              style={{
                position: "absolute",
                transform: [{ translateX: x }, { translateY: y }],
                alignItems: "center",
              }}
            >
              <View
                style={[
                  styles.goalMarker,
                  steps >= goal.steps && styles.goalMarkerAchieved,
                ]}
              >
                <Text style={styles.goalMarkerText}>
                  {goal.steps.toLocaleString()}
                </Text>
              </View>
              <View style={styles.goalReward}>
                <Text style={styles.goalRewardText}>💰 {goal.coins}</Text>
              </View>
            </View>
          );
        })}

        <View style={styles.stepsOverlay}>
          <Text style={styles.stepsText}>{steps.toLocaleString()}</Text>
          <Text style={{ fontSize: 60, textAlign: "center" }}>🏃‍♂️‍</Text>
          <Text style={styles.stepsLabel}>צעדים</Text>
          <Text style={styles.levelText}>רמה 1 (0/3 ⭐)</Text>
        </View>
      </View>

      <Text style={styles.progressText}>
        התקדמת: {progressPercent}% מהיעד השבועי
      </Text>
    </>
  );
};

export default PedometerCircle;




style