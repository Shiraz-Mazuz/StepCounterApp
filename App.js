import React from 'react';
import { SafeAreaView } from 'react-native';
import { AppProvider } from './components/AppContext';
import Navigation from './components/Navigation'; 

export default function App() {
  return (
    <AppProvider>
      <SafeAreaView style={{ flex: 1}}>
        <Navigation />
      </SafeAreaView>
    </AppProvider>
  );
}

          
            
     