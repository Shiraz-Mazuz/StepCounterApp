import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PedometerCircle from './components/PedometerCircle';
import Buttons from './components/Buttons';
import { styles } from './styles/styles';

export default function App() {
  const [steps, setSteps] = useState(0);
  const weeklyGoal = 10000;
  const [coins, setCoins] = useState(0);
  const [startDate, setStartDate] = useState(null);

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log("  Error saving data:", error);
    }
  };

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
      const savedCoins = await getData('coins');
      const savedStartDate = await getData('startDate');

      const now = new Date();
      let weekStart = savedStartDate ? new Date(savedStartDate) : now;

      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
      if (savedStartDate && now - weekStart >= oneWeekInMs) {
        setSteps(0);
        setStartDate(now);
        storeData('steps', 0);
        storeData('startDate', now.toISOString());
      } else {
        setSteps(savedSteps || 0);
        setCoins(savedCoins || 0);
        setStartDate(weekStart);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let lastSteps = 0; 
    Pedometer.isAvailableAsync()
      .then(result => {
        if (!result) {
          console.log("The pedometer is not available on this phone.");
          return;
        }

        const interval = setInterval(() => {
          const end = new Date();
          const start = new Date();
          start.setHours(0, 0, 0, 0);

          Pedometer.getStepCountAsync(start, end).then(async result => {
            const dailySteps = result.steps; 
            const stepDifference = dailySteps - lastSteps; 

            if (stepDifference > 0) {
              setSteps(prevSteps => prevSteps + stepDifference);
              storeData('steps', prevSteps => prevSteps + stepDifference);
            }

            lastSteps = dailySteps; 
          }).catch(error => {
            console.log("Error receiving steps:", error);
          });
        }, 1000);

        return () => clearInterval(interval);
      })
      .catch(error => {
        console.log("Pedometer test error:", error);
  });
},[]);

  const convertToCoins = async () => {
    if (steps === 0) return;
    const newCoins = Math.floor(steps / 1000) * 10;
    const updatedCoins = coins + newCoins;
    setCoins(updatedCoins);
    setSteps(0);
    await storeData('coins', updatedCoins);
    await storeData('steps', 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topLeftContainer}>
        <TouchableOpacity style={styles.coinButton}>
          <Text style={styles.buttonText}>My coins: {coins} 💰</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.topRightContainer}>
        <TouchableOpacity
          style={styles.giftShopButton}
          onPress={() => navigation.navigate('Shop')}
        >
          <Text style={styles.buttonText}>Gift Shop 🎁</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.goalContainer}>
        <Text style={styles.goalText}>Weekly target: {weeklyGoal} steps</Text>
      </View>

      <PedometerCircle steps={steps} weeklyGoal={weeklyGoal} />

      <Buttons steps={steps} coins={coins} convertToCoins={convertToCoins} />
    </View>
  );
}