import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { styles } from '../styles/styles';

const Buttons = ({ steps, coins, convertToCoins }) => {
  
    const convertibleCoins = Math.floor(steps / 1000) * 10;

    return (
    <>
      <Animatable.View animation="pulse" iterationCount="infinite">
        <TouchableOpacity
          style={[styles.button, { backgroundColor: steps > 0 ? '#ff7f00' : '#B0BEC5' }]}
          onPress={convertToCoins}
          disabled={steps === 0}
        >
          <Text style={styles.buttonText}>Convert to currencies ({convertibleCoins}) 🪙</Text>
        </TouchableOpacity>
      </Animatable.View>

    
    </>
  );
};

export default Buttons;