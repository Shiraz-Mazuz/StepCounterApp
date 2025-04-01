import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { styles } from '../styles/styles';

const Buttons = ({ steps, coins, convertToCoins, conversionConfig }) => {
    const convertibleCoins = Math.floor(steps / conversionConfig.stepsPerThreshold) * conversionConfig.coinsPerThreshold;

    return (
    
      <Animatable.View animation={steps > 0 ? "pulse" : null} iterationCount="infinite">
        <TouchableOpacity
          style={[styles.buttonConvert, { backgroundColor: steps > 0 ? '#ff7f00' : '#B0BEC5' }]}
          onPress={convertToCoins}
          disabled={steps === 0}
        >
          <Text style={styles.buttonConvertText}>Convert to currencies {steps > 0 ? convertibleCoins : 0}🪙</Text>
        </TouchableOpacity>
      </Animatable.View>

    
   
  );
};

export default Buttons;



