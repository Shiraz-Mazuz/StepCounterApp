import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { styles } from '../styles/styles';
import { AppContext } from './AppContext';

const NavigationBar = ()=> {
    const {steps, coins} = useContext(AppContext);

  return (
    <View style={styles.navBarContainer}>
    <View style={styles.statWrapper}>
      <View style={styles.iconWrapper}>
        <Text style={styles.iconNav}>💰</Text>
      </View>
      <View style={styles.navBarItem}>
        <Text style={styles.navBarText}>{coins}</Text>
      </View>
    </View>
  
    <View style={styles.statWrapper}>
      <View style={styles.iconWrapper}>
        <Text style={styles.iconNav}>💎</Text>
      </View>
      <View style={styles.navBarItem}>
        <Text style={styles.navBarText}>456</Text>
      </View>
    </View>
  
    <View style={styles.statWrapper}>
      <View style={styles.iconWrapper}>
        <Text style={styles.iconNav}>👣</Text>
      </View>
      <View style={styles.navBarItem}>
        <Text style={styles.navBarText}>{steps}</Text>
      </View>
    </View>
  </View>
);
};


export default NavigationBar;

