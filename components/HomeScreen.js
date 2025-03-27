import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import PedometerCircle from './PedometerCircle';
import Buttons from './Buttons';
import { styles } from '../styles/styles';



export default function HomeScreen({navigation}) {
    const [steps, setSteps] = useState(0);
    const weeklyGoal = 10000;
    const [coins, setCoins] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [convertedCoins, setConvertedCoins] = useState(0);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const [animatedCoins, setAnimatedCoins] = useState([]);
    const [conversionConfig, setConversionConfig] = useState({
        stepsPerThreshold: 1000, 
        coinsPerThreshold: 10,   
      });
   
  
    const storeData = async (key, value) => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.log("  Error saving data:", error);
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
        const savedCoins = await getData('coins');
        const savedStartDate = await getData('startDate');
  
        const now = new Date();
        let weekStart = savedStartDate ? new Date(savedStartDate) : now;
  
        const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
        if (savedStartDate && now - weekStart >= oneWeekInMs) {
          setSteps(0);
          storeData('steps', 0);
          storeData('startDate', now.toISOString());
        } else {
          setSteps(savedSteps || 0);
          setCoins(savedCoins || 0);
         
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
      setConvertedCoins(newCoins)
      setCoins(updatedCoins);
      setSteps(0);
      await storeData('coins', updatedCoins);
      await storeData('steps', 0);

      setModalVisible(true);
      startCoinsAnimation()
    };

    fadeAnim.setValue(0);
    Animated.timing(fadeAnim,{
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
    }).start()
  
const startCoinsAnimation = () => {
let newCoins =[];
for (let i = 0; i< 5; i++){
    let animatedValue = new Animated.Value(0)
    newCoins.push({ id: i, animatedValue})
    Animated.timing(animatedValue,{
        toValue: 1,
        duration: 1000 + i * 100,
        useNativeDriver: true,
    }).start(()=>{
        if (i === 4) setAnimatedCoins([])
    })
}
setAnimatedCoins(newCoins)
}

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
            onPress={() => navigation.navigate('ShopScreen', {coins, setCoins})}>
            <Text style={styles.buttonText}>Gift Shop 🎁</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.goalContainer}>
          <Text style={styles.goalText}>Weekly target: {weeklyGoal} steps</Text>
        </View>
  
        <PedometerCircle steps={steps} weeklyGoal={weeklyGoal} />
  
        <Buttons steps={steps} coins={coins} convertToCoins={convertToCoins} />
       
        <Modal visible={modalVisible} transparent animationType="fade">
             <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <View style={styles.modalTitleBox}>
                <Text style={styles.modalText}> 🎉 congratulations 🎉</Text>
            </View>
             <Text style={styles.modalText}> You received {convertedCoins} coins! 💰 </Text>
           <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
             <Text style={styles.modalButtonText}>✖</Text>
            </TouchableOpacity>
        </Animated.View>
    </View>
</Modal>
{animatedCoins.map(({ id, animatedValue }) => (
    <Animated.View
        key={id}
        style={{
            position: 'absolute',
            transform: [
                {
                    translateY: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [400, 50] // תנועה מלמטה למעלה
                    }),
                },
                {
                    translateX: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [180, 20] // תנועה מצד לצד
                    }),
                },
                {
                    scale: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.5] // המטבע קטן כשהוא מתקרב ליעד
                    }),
                },
            ],
            opacity: animatedValue.interpolate({
                inputRange: [0, 0.8, 1],
                outputRange: [1, 1, 0] // המטבע נעלם בסוף האנימציה
            }),
        }}>
        <Text style={{ fontSize: 25 }}>🪙</Text> 
    </Animated.View>
))}

      </View>
    );
  }