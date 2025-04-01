import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from '../styles/styles';

const Users = ({userName, image, coins, onImagePress}) =>{
    const [userImage, setUserImage] = useState(image || null)

    return (
    <View style={styles.userContainer}>
        <View style={styles.textContainer}>
         <Text style={styles.helloText}>Hello {userName || "Guest"}</Text>
         </View>
       <TouchableOpacity>
            {userImage ? (
                <Image source={{uri: userImage}} style={styles.userImage}/> 
            ) : (
                <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}> Add a photo  </Text>
                </View>
            )}
       </TouchableOpacity>
    </View>
    )
}

export default Users;
