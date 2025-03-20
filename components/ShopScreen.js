import react from "react";
import { View, Text, StylesSheet } from "react-native";
import { styles } from '../styles/styles';

const ShopScreen = ({ route }) =>{
    const {coins} = route.params;

    return (
        <View style={styles.containershop}>
            <Text style={styles.titleshop}> Shop gift 🛒 </Text>
            <Text style={styles.subtitleshop}>Welcome to the store! Here you can buy gifts with the coins you have accumulated</Text>
            <Text style={styles.titleshop}> You hove: {coins} 💰 </Text>
        </View>
    )
}

export default ShopScreen;