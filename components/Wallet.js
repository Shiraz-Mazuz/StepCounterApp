import {React, useContext, useState} from "react";
import { View, Text, StylesSheet, TouchableOpacity, Modal, Animated,TextInput, ScrollView, SafeAreaView, Alert, StatusBar } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from '../styles/styles';
import { AppContext } from "./AppContext";
import NavigationBar from "./NavigationBar";

const Wallet = () =>{
   const {coins, setCoins} = useContext(AppContext);
   const [modalVisible, setModalVisible] = useState(false);
   const [selectedReward, setSelectedReward] = useState(null);
   const [ email, setEmail] = useState("");
   const [pickerModalVisible, setPickerModalVisible] = useState(false);
   const [selectedMethod, setSelectedMethod] = useState("paypal");
   const fadeAnim = useState(new Animated.Value(0))[0];

   const rewards= [
    { amount: "$0.01", coins: 10000 },
    { amount: "$0.10", coins: 100000 },
    { amount: "$0.30", coins: 300000 },
    { amount: "$0.50", coins: 500000 },
    { amount: "$1.00", coins: 1000000 },
    { amount: "$5.00", coins: 5000000 },
    { amount: "$7.00", coins: 7000000 },
    { amount: "$9.00", coins: 9000000 },
    { amount: "$10.00", coins: 10000000 },
    { amount: "$12.00", coins: 12000000 },

   ];

   const redemptionOptions =[
    {id:"paypal", label: "PayPal"},
    {id:"googlepay", label: "Google Pay"},
   ];

   const handleRedeemPress = () => {
    setPickerModalVisible(true);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
        toValue: 1,
        during: 500,
        useNativeDriver: true
    }).start();
   }

   const handleSelectedMethod = () => {
    setPickerModalVisible(false);
   }

   const handleRewardPress = (reward) =>{
    if (coins < reward.coins) {
        Alert.alert("You don't have enough coins to redeem this reward!")
     return;
    }
    setSelectedReward(reward);
    setModalVisible(true);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
    }).start();
   }

   const handleConfirm = () =>{
    if(!email) {
        Alert.alert("Please enter your PayPal email");
        return;
    }
    if (selectedReward){
        setCoins(coins - selectedReward.coins);
        Alert.alert(`Successfully redeemed ${selectedReward.amount} to ${email}`);
        setModalVisible(false);
        setEmail("");
        setSelectedReward(null);
    }
   }
   const selectedOption = redemptionOptions.find(option => option.id === selectedMethod);
   const selectedLabel = selectedOption ? selectedOption.label : "PayPal";

    return (
       <SafeAreaView style={styles.areaContainer}>
        <StatusBar backgroundColor="#ba55d3" barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <NavigationBar />
            <View style={styles.rewardsContainer}>
                <TouchableOpacity style={styles.redeemButton} onPress={handleRedeemPress}>
                <Text style={styles.redeemButtonText}>⬇️       Redeem to {selectedLabel}</Text>
                </TouchableOpacity>

                <View style={styles.rewardsGrid}>
                    {rewards.map((reward, index) => (
               <TouchableOpacity
                        key={index}
                        style={styles.rewardCard}
                        onPress={() => handleRewardPress(reward)}
                      >
                  
                      <Text style={styles.rewardText}>A GIFT FOR YOU</Text>
                      <Text style={styles.amountText}>{reward.amount}</Text>
                      <View style={styles.coinsContainer}>
                        <Text style={styles.coinsText}>
                            {reward.coins.toLocaleString()} 💰
                        </Text>
                      </View>
                 </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>

            <Modal visible ={pickerModalVisible} transparent animationType="none" >
                <View style={styles.modalContainer}>
                    <Animated.View style={[styles.pickerModalContent, { opacity: fadeAnim }]}>
                        <Text style={styles.modalTitle}> Select Redemption Method </Text>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={selectedMethod}
                             onValueChange={(itemValue) => setSelectedMethod(itemValue)}
                             style={styles.picker}
                             >
                                {redemptionOptions.map((option) =>(
                                    <Picker.Item key={option.id} label={option.label} value={option.id} />
                                ))}
                            </Picker>
                        </View>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleSelectedMethod}>
                            <Text style={styles.confirmButtonText}> SELECT </Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setPickerModalVisible(false)}
                    >
            <Text style={styles.closeButtonText}>✖</Text>
          </TouchableOpacity>
                </View>
            </Modal>

        <Modal visible={modalVisible} transparent animationType="none">
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Redeem to {selectedLabel}
              </Text>
              <Text style={styles.modalAmount}>
                {selectedReward?.amount}
              </Text>
            </View>
            <TextInput
              style={styles.emailInput}
              placeholder="PayPal Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.whyLink}
              onPress={() => Alert.alert("",`We need your ${selectedLabel} email to send the reward to your account.`)}
            >
              <Text style={styles.whyLinkText}>Why do we ask for this data?</Text>
            </TouchableOpacity>
            <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.closeButtonText}>✖</Text>
                  </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>✖</Text>
          </TouchableOpacity>
        </View>
     </Modal>

     </SafeAreaView>
    )
}

export default Wallet;