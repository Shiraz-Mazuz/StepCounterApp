import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import ShopScreen from './components/ShopScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Step App " }} />
        <Stack.Screen name="ShopScreen" component={ShopScreen} options={{ title: "Gift Shop 🎁" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}