import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import PlayFabClient from 'playfab-sdk/PlayFabClient';
import PedometerCircle from './PedometerCircle';
import Buttons from './Buttons';
import { styles } from '../styles/styles';
import Users from './Users';



export default function HomeScreen({ navigation }) {
  const [playFabId, setPlayFabId] = useState(null);
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
    { steps: 0, coins: 1 },
    { steps: 4000, coins: 3 },
    { steps: 6000, coins: 6 },
    { steps: 8000, coins: 9 },
    { steps: 10000, coins: 12 },
  ];

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log("Error saving data:", error);
    }
  };

  useEffect(() => {
    const ConvertConfig = async () => {
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

    ConvertConfig();
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
    const newCoins = Math.floor(steps / conversionConfig.stepsPerThreshold) * conversionConfig.coinsPerThreshold;
    const updatedCoins = coins + newCoins;
    setConvertedCoins(newCoins);
    setCoins(updatedCoins);
    setSteps(0);
    await storeData('coins', updatedCoins);
    await storeData('steps', 0);
try{
const PlayFabId =  "607AC";
const response = await fetch('http://192.168.140.1:5000/updateCoins', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    PlayFabId: playFabId,
      coins: newCoins,
  }),
})
const data = await response.json();
if(data.success){
  console.log("Coins synced with PlayFab:", data);
}else {
  console.log("Error syncing coins:", data.error);
}
} catch (error) {
console.log("Error syncing coins with PlayFab:", error);
}
    setModalVisible(true);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    startCoinsAnimation();
  };

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

      console.log("Loading data - Saved steps:", savedSteps, "Saved weekly steps:", savedWeeklySteps);

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

  
  useEffect(() => {
    let intervalId = null;
  
    const initializePedometer = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      console.log("Is Pedometer available?", isAvailable);
      if (!isAvailable) {
        console.log("The pedometer is not available on this phone.");
        return;
      }
      const { status } = await Pedometer.requestPermissionsAsync();
      console.log(" Permission status:", status);
      if (status !== 'granted') {
        Alert.alert("Permission required", "We need permission to access motion sensors to count steps.");
        return;
      }
      let lastSteps = (await getData("lastSteps")) || 0;
      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      try {
        const initialResult = await Pedometer.getStepCountAsync(start, end);
        const initialSteps = initialResult.steps;
        setSteps(initialSteps);
        storeData("steps", initialSteps);
        setWeeklySteps(prevWeeklySteps => {
          const newWeeklySteps = prevWeeklySteps + (initialSteps - lastSteps);
          storeData("weeklySteps", newWeeklySteps);
          return newWeeklySteps;
        });
        setDistance((initialSteps * 0.78) / 1000);
  
        lastSteps = initialSteps;
        await storeData("lastSteps", initialSteps);
      } catch (error) {
        console.log("Initial check error:", error);
        }
      intervalId = setInterval(async () => {
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        try {
          const result = await Pedometer.getStepCountAsync(start, end);
          const dailySteps = result.steps;
          const stepDifference = dailySteps - lastSteps;
          if (stepDifference > 0) {
            setSteps(dailySteps);
            console.log("Updating - Setting steps to:", dailySteps);
            storeData("steps", dailySteps);
            setWeeklySteps(prevWeeklySteps => {
              const newWeeklySteps = prevWeeklySteps + stepDifference;
              storeData("weeklySteps", newWeeklySteps);
              return newWeeklySteps;
            });
            setDistance((dailySteps * 0.78) / 1000);
            lastSteps = dailySteps;
            await storeData("lastSteps", dailySteps);
            console.log("Updated lastSteps to:", lastSteps);
          }
        } catch (error) {
          console.log("Error in setInterval:", error);
        }
      }, 10000);
    };
    initializePedometer();
  
    return () => {
      if (intervalId) {
        console.log("Cleaning up interval...");
        clearInterval(intervalId);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Users
        userName={userName}
        image={userImage}
        onImagePress={pickImage}
      />

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
            ? "Start your streams! Meet your Daily Goal"
            : `strem: ${streakDays} days 🔥`}
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

      <Buttons steps={steps} coins={coins} convertToCoins={convertToCoins} convertedCoins={convertedCoins} conversionConfig={conversionConfig} />

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Freinds</Text>
          <Text style={styles.statValue}>0 👥</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>{distance.toFixed(1)} km📍</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>My Coins</Text>
          <Text style={styles.statValue}> {coins.toLocaleString()} 💰</Text>
        </View>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <View style={styles.modalTitleBox}>
              <Text style={styles.modalText}>🎉 congratulations 🎉</Text>
            </View>
            <Text style={styles.modalText}>
              You received {convertedCoins} coins! 💰
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
