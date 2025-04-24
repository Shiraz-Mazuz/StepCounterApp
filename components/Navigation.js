import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../components/HomeScreen';
import Wallet from '../components/Wallet';
import MissionsScreen from '../components/MissionsScreen';
import ActivityScreen from '../components/ActivityScreen'
import Referral from '../components/Referral';
import { tabBarOptions } from '../styles/TabBarStyle';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🏠</Text>
          ),
          headerTitle: "Step App",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={{
          tabBarLabel: 'Wallet',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>💳</Text>
          ),
          headerTitle: "Wallet",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="MissionsScreen"
        component={MissionsScreen}
        options={{
          tabBarLabel: 'Mission',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🏆</Text>
          ),
          headerTitle: "Missions",
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{
          tabBarLabel: 'Activiment',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🏃‍♂️‍➡️</Text>
          ),
          headerTitle: "Activiment",
          headerShown: true,
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Referral"
          component={Referral}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}