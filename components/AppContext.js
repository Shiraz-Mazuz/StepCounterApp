import React, { createContext, useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Image } from 'react-native';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
  handleNotification: async () =>({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export const AppContext = createContext();

export const AppProvider = ({children}) =>{
    const [steps, setSteps] = useState(0);
    const [coins, setCoins] = useState(0);
    const [weeklySteps, setWeeklySteps] = useState(0);
    const [conversionConfig, setConversionConfig] = useState({
        stepsPerThreshold: 1000,
        coinsPerThreshold: 10,
    })
    const [streakDays, setStreakDays] = useState(0);
    const [dailyStepsHistory, setDailyStepsHistory] = useState([]);
    const [distance, setDistance] = useState(0);

    const [goldenEggHammers, setGoldenEggHammers] = useState(0);
    const [goldenEggFragments, setGoldenEggFragments] = useState(0);
    const [goldenEggRewards, setGoldenEggRewards] = useState([
      { id: 'gift1', name: 'Gift One', fragmentsRequired: 10, collected: 0 },
      { id: 'gift2', name: 'Gift Two', fragmentsRequired: 30, collected: 0 },
      { id: 'gift3', name: 'Gift Three', fragmentsRequired: 20, collected: 0 },
    ]);
    const [isEggBroken, setIsEggBroken] = useState(false);
    const [videosWatchedToday, setVideosWatchedToday] = useState(0);
    const [lastVideoDate, setLastVideoDate] = useState(null);
    const [videosWatchedForHammer, setVideosWatchedForHammer] = useState(0);

    const [tasks, setTasks] = useState([
      {id: 'refer-friend', title: 'Refer a Friend', reward: 50, completed: false},
      {id: 'watch-and-spin', title: 'Watch and Spin', reward: 10000, spins: 3, completed: false},
      {id: 'games&surveys', title: 'Games & Surveys', reward: 2000 , completed: false},
    ]);
    const weeklyGoal = 50000;
    const dailyGoal = 10000; 

    const requestNotificationPermissions = async () =>{
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Notification permissions', 'Please allow notifications to receive updates on your progress')
      }
    };
    const scheduleNotification = async (title, body, trigger = null) => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
        },
        trigger,
      });
    };

    const checkVideoLimit = () => {
      const today = new Date().toISOString().split('T')[0];
      if (videosWatchedToday >= 2) {
        Alert.alert('Video limit', 'You have already watched 2 videos today. Try again tomorrow!');
        return false;
      };
      if (lastVideoDate !== today) {
        setVideosWatchedToday(0);
        setLastVideoDate(today);
        storeData('videosWatchedToday', 0);
        storeData('lastVideoDate', today);
        return true;
      }
      
      return true;
    };


    const watchVideoForHammer = () => {
      if (!checkVideoLimit()) 
        return false;
      setVideosWatchedToday((prev) => {
        const newCount = prev + 1;
        storeData('videosWatchedToday', newCount);
        return newCount;
      });
      setVideosWatchedForHammer((prev) => {
        const newCount = prev + 1;
        if (newCount >= 2) {
          return 0;
        }
        return newCount
      })
      return true;
    };

    const confirmHammerReward = () => {
      setGoldenEggHammers((prev) => prev + 1);
      setVideosWatchedForHammer(0);
      scheduleNotification('New hammer! 🔨', 'You watched the video and earned a hammer for the Golden Egg mission!');
    }
    
    const crackGoldenEgg = () => {
      if (goldenEggHammers > 0) {
        setGoldenEggHammers((prev) => prev - 1);
        setGoldenEggFragments((prev) => prev + 1);
        setIsEggBroken(true); 
        scheduleNotification('A broken egg 🥚', 'You collected another part in the Golden Egg!');
       
        const updatedRewards = goldenEggRewards.map((reward) => {
          if (goldenEggFragments + 1 >= reward.fragmentsRequired && reward.collected < reward.fragmentsRequired) {
            scheduleNotification(' New award! 🎁', ` You won the ${reward.name}!`);
            return { ...reward, collected: reward.fragmentsRequired };
          }
          return reward;
        });
        setGoldenEggRewards(updatedRewards);
      } else {
        Alert.alert('No hammers!', 'Watch videos to earn more hammers.');
      }
    };
    const resetEgg = () => {
      setIsEggBroken(false);
    };
  


    const storeData = async (key, value) => {
        try {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.log("Error saving data:", error);
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

    const completeTask = (taskId) => {
        setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? {...task, completed: true} : task
        )
      );
      const task = tasks.find((t) => t.id === taskId)
      if (task && task.reward && typeof task.reward === 'number'){
        setCoins((prevCoins) => {
          const newCoins = prevCoins + task.reward; 
          storeData('coins', newCoins);
          scheduleNotification(
            'Task completed! 🎉', 
            `You received ${task.reward} coins for the ${task.title}`
          );
          return newCoins;
        });
      }
    };
   const resetTasks = () =>{
      setTasks((prevTasks) => 
      prevTasks.map((task) => ({... task, completed: false}))
      );
     scheduleNotification(
     'New tasks available! 🚀', 'Check your taskss to earn more coins!'
     )
    }

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

    useEffect(() => {
          const loadData = async () => {
            const savedSteps = await getData('steps');
            const savedWeeklySteps = await getData('weeklySteps');
            const savedCoins = await getData('coins');
            const savedStartDate = await getData('startDate');
            const savedDailyStepsHistory = await getData("dailyStepsHistory");
            const savedStreakDays = await getData("streakDays");
            const savedLastDate = await getData("lastDate");
            const savedTaks = await getData('tasks');
            const savedHammers = await getData('goldenEggHammers');
            const savedFragments = await getData('goldenEggFragments');
            const savedRewards = await getData('goldenEggRewards');
            const savedEggState = await getData('isEggBroken');
            const savedVideosWatchedToday = await getData('videosWatchedToday');
            const savedLastVideoDate = await getData('lastVideoDate');
            const savedVideosForHammer = await getData('videosWatchedForHammer');
      
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
              resetTasks();
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
              resetTasks();
            } else {
              setWeeklySteps(savedWeeklySteps || 0);
            }
            setCoins(savedCoins || 0);
            if (savedTaks){
              setTasks(savedTaks);
            }
            setGoldenEggHammers(savedHammers || 0);
            setGoldenEggFragments(savedFragments || 0);
            if (savedRewards) {
              setGoldenEggRewards(savedRewards);
            }
            setIsEggBroken(savedEggState || false);
            setVideosWatchedToday(savedVideosWatchedToday || 0);
            setLastVideoDate(savedLastVideoDate || today);
            setVideosWatchedForHammer(savedVideosForHammer || 0);

           requestNotificationPermissions();
          };
      
          loadData();
        }, []); 

     useEffect(()=>{
          storeData('tasks',tasks);
          storeData('goldenEggHammers', goldenEggHammers);
          storeData('goldenEggFragments', goldenEggFragments);
          storeData('goldenEggRewards', goldenEggRewards);
          storeData('isEggBroken', isEggBroken);
          storeData('videosWatchedToday', videosWatchedToday);
          storeData('lastVideoDate', lastVideoDate);
          storeData('videosWatchedForHammer', videosWatchedForHammer);

      }, [tasks,
          goldenEggHammers,
          goldenEggFragments,
          goldenEggRewards,
          isEggBroken,
          videosWatchedToday, 
          lastVideoDate,
          videosWatchedForHammer,
      ]);

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
                    if (dailySteps >= dailyGoal * 0.9 && dailySteps < dailyGoal) {
                      scheduleNotification(
                        'Almost there! 💪' ,
                         `You've reached ${dailySteps} steps, just a little more and you'll get your daily goal of ${dailyGoal}!`
                      )
                    }
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
            }, [dailyGoal]);

            useEffect(() => {
              const scheduleDailReminder = async () => {
                await Notifications.cancelAllScheduledNotificationsAsync();
                await scheduleNotification(
                  'Time to walk! 🚶',
                  'Go for a walk today and reach your daily goal!',
                  {
                    hour: 10,
                    minute: 0,
                    repeats: true,
                  }
                );
              };
              scheduleDailReminder();
            }, [])

            const value = {
                steps, setSteps,
                coins, setCoins,
                weeklySteps, setWeeklySteps,
                conversionConfig, setConversionConfig,
                streakDays, setStreakDays,
                dailyStepsHistory, setDailyStepsHistory,
                distance, setDistance,
                weeklyGoal,
                dailyGoal,
                tasks, setTasks, completeTask, resetTasks,
                goldenEggHammers, setGoldenEggHammers,
                goldenEggFragments, setGoldenEggFragments,
                goldenEggRewards, setGoldenEggRewards,
                isEggBroken, setIsEggBroken,
                watchVideoForHammer, 
                videosWatchedForHammer,setVideosWatchedForHammer,
                confirmHammerReward,
                crackGoldenEgg,
                resetEgg,
              };

          return(
                <AppContext.Provider value={value}>
                     {children}
                </AppContext.Provider>
             )
}