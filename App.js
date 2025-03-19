import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Pedometer } from 'expo-sensors';
import * as Progress from 'react-native-progress'; 

export default function App() {
  const [steps, setSteps] = useState(0); 
  const weeklyGoal = 10000; 
  const [coins, setCoins] = useState(0); 

  useEffect(() => {
    let subscription;
    Pedometer.isAvailableAsync().then(result => {
        if (!result) { 
          console.log("The pedometer is not available on this phone.");
          return;
        }
        subscription = Pedometer.watchStepCount(result => {
          setSteps(result.steps); 
        });
      })
      .catch(error => {
        console.log("Pedometer test error:", error);
      });

    return () => subscription && subscription.remove();
  }, []);

  const convertToCoins = () => {
    if (steps === 0) return;
    const newCoins = Math.floor(steps / 1000) * 10; 
    setCoins(prevCoins => prevCoins + newCoins); 
    setSteps(0)
  };

  const progress = steps > weeklyGoal ? 1 : steps / weeklyGoal; 
  const progressPercent = Math.round(progress * 100);

  const buttonStyle = {
    backgroundColor: steps > 0 ? '#77d4d4' : '#B0BEC5',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  };


  return (
    <View style={styles.container}>
            <Text style={styles.goalText}>Weekly target: {weeklyGoal} steps</Text>

      <Progress.Circle
        progress={progress} 
        size={300} 
        thickness={10} 
        color="#4CAF50" 
        unfilledColor="#E0E0E0"
        showsText={false} 
      >
        <Text style={styles.stepsText}>{steps}</Text>
      </Progress.Circle>

      <Text style={styles.progressText}>You have progressed: {progressPercent}%</Text>

      <TouchableOpacity style={buttonStyle} onPress={convertToCoins} disabled={steps === 0}>
        <Text style={styles.buttonText}>Convert to currencies  ({coins})</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.coinButton}>
        <Text style={styles.buttonText}> my coins: {coins}</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  stepsText: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  goalText: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 50,
  },
  progressText: {
    fontSize: 16,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  coinButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});