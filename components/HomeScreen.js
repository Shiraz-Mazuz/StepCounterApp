import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Alert, Image, ScrollView, SafeAreaView, ImageBackground } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PedometerCircle from './PedometerCircle';
import Buttons from './Buttons';
import { styles } from '../styles/styles';
import homeScreenStyle from '../styles/homeScreenStyle';
import { AppContext } from './AppContext';
import NavigationBar from './NavigationBar';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

 import referralbackground from '../assets/referralbackground.jpg';
 import wheeloffortune from '../assets/wheeloffortune.jpg';
 import gamesandsurveys from '../assets/gamesandsurveys.jpg';

 const taskBackgrounds = {
  'refer-friend': referralbackground,
  'watch-and-spin': wheeloffortune,
  'games&surveys':gamesandsurveys,
  default: referralbackground,
 };

export default function HomeScreen({ navigation }) {
  const {
    steps,setSteps,
    coins,setCoins,
    weeklySteps,
    conversionConfig,
    setConversionConfig,
    streakDays,setStreakDays,
    dailyStepsHistory, setDailyStepsHistory,
    distance, setDistance,
    weeklyGoal,
    dailyGoal,
    tasks, completeTask,
   } = useContext(AppContext);
 
const navigationHook = useNavigation()

  const [modalVisible, setModalVisible] = useState(false);
  const [convertedCoins, setConvertedCoins] = useState(0);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [animatedCoins, setAnimatedCoins] = useState([]);
  const [goalAchievedNotified, setGoalAchievedNotified] = useState(false);

  const stepGoals = [
    { steps: 0, coins: 1 },
    { steps: 2000, coins: 2 },
    { steps: 4000, coins: 4 },
    { steps: 7000, coins: 7 },
    { steps: 10000, coins: 10 },
  ];

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log("Error saving data:", error);
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

    setModalVisible(true);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    startCoinsAnimation();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'New coins! 💰',
        body: `Converted ${newCoins} coins for ${steps} steps!`,
        sound: 'defult',
      },
      trigger: null,
    });
  };
  
  const handleTaskPress = (task) => {
    if (task.completed) {
      Alert.alert('Task Completed', 'You have already completed this task!');
      return;
    }
    switch (task.id) {
      case 'refer-friend':
        navigationHook.navigate('Referral');
                completeTask(task.id);
        break;
        case 'watch-and-spin':
        Alert.alert('Watch and Spin', 'Watch a video to spin the wheel and win up to 10,000 coins!');
        completeTask(task.id);
        break;
      case 'games-surveys':
        Alert.alert('Games & Surveys', 'Complete this activity to earn 20% extra coins!');
        completeTask(task.id);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (steps >= dailyGoal && !goalAchievedNotified) {
      setGoalAchievedNotified(true);
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Well done! 🎉',
          body: `You have reached ${steps} steps and completed your daily goal of ${dailyGoal}!`,
          sound: 'default',
        },
        trigger: null,
      });
    }
    if (steps < dailyGoal) {
      setGoalAchievedNotified(false); 
    }
  }, [steps, dailyGoal, goalAchievedNotified]);


  return (
    <SafeAreaView style ={{flex: 1, backgroundColor: '#e0f5ff'}}>
       <ScrollView 
         style={homeScreenStyle.scrollViewContainer}
         contentContainerStyle={homeScreenStyle.scrollViewContent}>
   <NavigationBar/>

      <View style={homeScreenStyle.streakContainer}>
        <Text style={homeScreenStyle.streakText}>
          {streakDays === 0
            ? "Start your streams! Get your Daily Goal"
            : `strem: ${streakDays} days 🔥`}
        </Text>
      <View style={homeScreenStyle.streakDaysContainer}>
         <View style={streakDays >= 1 ? homeScreenStyle.streakDayActive : homeScreenStyle.streakDay}>
            <Text style={homeScreenStyle.streakDayText}>DAY 1</Text>
            {streakDays >= 1 && <Text style={homeScreenStyle.checkmark}>✔</Text>}
         </View>
         <View style={streakDays >= 2 ? homeScreenStyle.streakDayActive : homeScreenStyle.streakDay}>
            <Text style={homeScreenStyle.streakDayText}>DAY 2</Text>
            {streakDays >= 2 && <Text style={homeScreenStyle.checkmark}>✔</Text>}
          </View>
          <View style={streakDays >= 3 ? homeScreenStyle.streakDayActive : homeScreenStyle.streakDay}>
            <Text style={homeScreenStyle.streakDayText}>DAY 3</Text>
            {streakDays >= 3 && <Text style={homeScreenStyle.checkmark}>✔</Text>}
          </View>
        </View>
      </View>

      <PedometerCircle steps={steps} weeklyGoal={weeklyGoal} stepGoals={stepGoals} />

      <Buttons steps={steps} coins={coins} convertToCoins={convertToCoins} convertedCoins={convertedCoins} conversionConfig={conversionConfig} />

      <View style={homeScreenStyle.statsContainer}>
        <View style={homeScreenStyle.statItem}>
          <Text style={homeScreenStyle.statLabel}>Friends</Text>
          <Text style={homeScreenStyle.statValue}>0 👥</Text>
        </View>
        <View style={homeScreenStyle.statItem}>
          <Text style={homeScreenStyle.statLabel}>Distance</Text>
          <Text style={homeScreenStyle.statValue}>{distance.toFixed(1)} km📍</Text>
        </View>
        <View style={homeScreenStyle.statItem}>
          <Text style={homeScreenStyle.statLabel}>My Coins</Text>
          <Text style={homeScreenStyle.statValue}> {coins.toLocaleString()} 💰</Text>
        </View>
      </View>

      <View style={homeScreenStyle.sectionContainer}>
        <Text style={homeScreenStyle.sectionTitle}>Bonus Wards & Free Offers</Text>
        <View style={homeScreenStyle.taskContainer}>
          {tasks.map((task) => (
            <View key={task.id} style={homeScreenStyle.taskCard}>
             <TouchableOpacity
              onPress={() => handleTaskPress(task)}
              style={{ width: '100%'}}
            >
            <ImageBackground
              source={taskBackgrounds[task.id] || taskBackgrounds.default}
              style={homeScreenStyle.taskImage}
              imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
              resizeMode="cover"
            >
          
              <View style={homeScreenStyle.rewardContainer}>
              <Text style={homeScreenStyle.taskReward}>
                {typeof task.reward === 'number' ? `+${task.reward} 🪙` : task.reward}
              </Text>
              </View>
             
            </ImageBackground>
            
         <View style={homeScreenStyle.taskTextContainer}>
          <Text style={homeScreenStyle.taskTitle}>{task.title}</Text>
          {task.id === 'watch-and-spin' && (
            <Text style={homeScreenStyle.taskSpins}>{task.spins} spins available</Text>
          )}
          {task.completed && (
            <Text style={homeScreenStyle.taskCompleted}>✔ Completed</Text>
          )}
          
        </View> 
        </TouchableOpacity>
            </View>
            
          ))}
        </View>
      </View>
      </ScrollView>
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={homeScreenStyle.modalContainer}>
          <Animated.View style={[homeScreenStyle.modalContent, { opacity: fadeAnim }]}>
            <View style={homeScreenStyle.modalTitleBox}>
              <Text style={homeScreenStyle.modalText}>🎉 congratulations 🎉</Text>
            </View>
            <Text style={homeScreenStyle.modalText}>
              You received {convertedCoins} coins! 💰
            </Text>
          </Animated.View>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={homeScreenStyle.modalButton}
          >
            <Text style={homeScreenStyle.modalButtonText}>✖</Text>
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
    </SafeAreaView>
  );
}
