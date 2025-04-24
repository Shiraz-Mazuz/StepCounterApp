import React , {useContext , useState, useEffect} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, Animated } from 'react-native';
import * as Font from 'expo-font'; 

import { AppContext } from './AppContext';
import NavigationBar from './NavigationBar';
import missionsStyle from '../styles/missionsStyle';


import eggImage from '../assets/golden-egg.png'; 
import eggBrokenImage from '../assets/brokeEgg2.png'; 
import hammerImage from '../assets/hammer.png'; 
import giftOneImage from '../assets/giftone.png';
import giftTwoImage from '../assets/giftone.png';
import giftThreeImage from '../assets/giftone.png';



const MissionScreen = () => {
  const {
    goldenEggHammers,
    goldenEggFragments,
    goldenEggRewards,
    isEggBroken,
    watchVideoForHammer,
    confirmHammerReward,
    videosWatchedForHammer,
    setVideosWatchedForHammer,
    crackGoldenEgg,
    resetEgg,
  } = useContext(AppContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [wonReward, setWonReward] = useState(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [ hammerModalVisible, setHammerModalVisible] = useState(false);
  const [crackModalVisible, setCrackModalVisible] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [fadeAnimWholeEgg] = useState(new Animated.Value(1)); 
  const [fadeAnimBrokenEgg] = useState(new Animated.Value(0)); 

  const rewardImages = {
    gift1: giftOneImage,
    gift2: giftTwoImage,
    gift3: giftThreeImage,
  };

   
   useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        'Bungee-Regular': require('../assets/fonts/Bungee-Regular.ttf'),
      });
      setFontLoaded(true);
    }
    loadFont();
  }, []);

  const startCrackAnimation = () => {
    Animated.sequence([
      Animated.timing(fadeAnimWholeEgg, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimBrokenEgg, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      crackGoldenEgg();
      setVideosWatchedForHammer(0);
      setTimeout(() => {
        setCrackModalVisible(false);
        fadeAnimWholeEgg.setValue(1);
        fadeAnimBrokenEgg.setValue(0);
      }, 500); 
    });
  };
  const handleEggPress = () => {
    if (goldenEggHammers === 0) {
      return; 
    }
    setCrackModalVisible(true);
    startCrackAnimation();
  };

const handleWatchVideo = () => {
  setVideoModalVisible(true);
  setVideoProgress(0);
  const interval = setInterval(() => {
    setVideoProgress((prev) => {
      if (prev >= 100) {
        clearInterval(interval);
        setVideoModalVisible(false);
        const canProceed = watchVideoForHammer();
        if (canProceed && videosWatchedForHammer + 1 >= 2) {
          setHammerModalVisible(true);
        }
        return 100
      }
      return prev + 2;
    })
  }, 100)
};

const confirmHammer = () => {
  confirmHammerReward();
  setHammerModalVisible(false);
};
  
useEffect(() => {
    const checkForReward = () => {
      const newReward = goldenEggRewards?.find(
        (reward) => goldenEggFragments >= reward.fragmentsRequired && reward.collected < reward.fragmentsRequired
      );
      if (newReward) {
        setWonReward(newReward);
        setModalVisible(true);
      }
    };
    if (isEggBroken) {
      checkForReward();
    }
  }, [goldenEggFragments, isEggBroken, goldenEggRewards]);
 
const closeModal = () => {
    setModalVisible(false);
    setWonReward(null);
    resetEgg(); 
};


  return (
    <ScrollView style={missionsStyle.container}>
      <NavigationBar />

      <View style={missionsStyle.missionContainer}>
        <Text style={missionsStyle.missionTitle}>Golden Egg </Text>
        <View style={missionsStyle.totalContainer}>
          <Text style={missionsStyle.totalText}>Total: {goldenEggFragments}</Text>
        </View>

        <View style={missionsStyle.eggContainer}>
        <TouchableOpacity onPress={handleEggPress} disabled={goldenEggHammers === 0}>
            <Image
              source={isEggBroken ? eggBrokenImage : eggImage}
              style={missionsStyle.eggImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[missionsStyle.crackButton, goldenEggHammers === 0 && missionsStyle.disabledButton]}
            onPress={handleEggPress}
            disabled={goldenEggHammers === 0}
          >
            <Text style={missionsStyle.crackButtonText}>Crack It</Text>
            <Text style={missionsStyle.hammerCount}>Hammer: {goldenEggHammers}</Text>
          </TouchableOpacity>
        </View>

        <View style={missionsStyle.watchContainer}>
          <Image source={hammerImage} style={missionsStyle.hammerIcon} />
          <Text style={missionsStyle.watchText}> Watch 2 videos and get 1 hammer ({videosWatchedForHammer}\2)</Text>
          <TouchableOpacity style={missionsStyle.watchButton} onPress={handleWatchVideo}>
            <Text style={missionsStyle.watchButtonText}>Watch 🎬 </Text>
          </TouchableOpacity>
        </View>

       
        <View style={missionsStyle.rewardsContainer}>
          {goldenEggRewards && goldenEggRewards.length > 0 ? (
            goldenEggRewards.map((reward) => (
              <View key={reward.id} style={missionsStyle.rewardCard}>
                <Image
                  source={rewardImages[reward.id] || hammerImage}
                  style={missionsStyle.rewardImage}
                />
                <Text style={missionsStyle.rewardName}>{reward.name}</Text>
                <Text style={missionsStyle.progressText}>
                  {reward.collected}/{reward.fragmentsRequired}
                </Text>
                <View style={missionsStyle.progressBar}>
                  <View
                    style={{
                      width: `${(reward.collected / reward.fragmentsRequired) * 100}%`,
                      height: '100%',
                      backgroundColor: '#FFD700',
                    }}
                  />
                </View>
              </View>
            ))
          ) : (
            <Text style={missionsStyle.noRewardsText}> No prizes available at this time.</Text>
          )}
        </View>
      </View>

     
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={missionsStyle.modalContainer}>
          <View style={missionsStyle.modalContent}>
            <Text style={missionsStyle.modalTitle}>🎉 congratulations! 🎉</Text>
            <Text style={missionsStyle.modalText}>
            You won the {wonReward?.name}!
            </Text>
            <TouchableOpacity style={missionsStyle.modalButton} onPress={closeModal}>
              <Text style={missionsStyle.modalButtonText}>Keep earning! </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={videoModalVisible} transparent animationType="fade">
        <View style={missionsStyle.modalContainer}>
          <View style={missionsStyle.modalContent}>
            <Text style={missionsStyle.modalTitle}>Watching the video </Text>
            <View style={missionsStyle.videoPlaceholder}>
              <Text style={missionsStyle.videoText}> Sample video (5 secounds)</Text>
            </View>
            <View style={missionsStyle.progressBar}>
              <View
                style={{
                  width: `${videoProgress}%`,
                  height: '100%',
                  backgroundColor: '#FF6347',
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={hammerModalVisible} transparent animationType="fade">
        <View style={missionsStyle.modalContainer}>
          <View style={missionsStyle.modalContent}>
            <Text style={missionsStyle.modalTitle}>🎉 congratulations! 🎉</Text>
            <Text style={missionsStyle.modalText}> You watched 2 videos! Get your hammer</Text>
            <TouchableOpacity style={missionsStyle.modalButton} onPress={confirmHammer}>
              <Text style={missionsStyle.modalButtonText}> Get a hammer 🔨</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={crackModalVisible} transparent animationType="fade">
        <View style={missionsStyle.modalContainer}>
          <View style={missionsStyle.modalContent}>
            <Text style={missionsStyle.modalTitle}>  Break the egg.! 🥚</Text>
            <View style={{ position: 'relative', width: 150, height: 150 }}>
              <Animated.View style={{ opacity: fadeAnimWholeEgg, position: 'absolute' }}>
                <Image source={eggImage} style={missionsStyle.eggImage} />
              </Animated.View>
              <Animated.View style={{ opacity: fadeAnimBrokenEgg, position: 'absolute' }}>
                <Image source={eggBrokenImage} style={missionsStyle.eggImage} />
              </Animated.View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default MissionScreen;