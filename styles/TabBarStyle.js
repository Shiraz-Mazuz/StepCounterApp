import { StyleSheet } from 'react-native';

export const tabBarOptions = StyleSheet.create({
   
      tabBarStyle: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        height: 70,
        marginHorizontal: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        paddingBottom: 10,
        paddingTop: 10,
        alignSelf: 'center',
        justifyContent: 'center',
      },
      tabBarActiveTintColor: '#4CAF50',
      tabBarInactiveTintColor: '#666',
    
  })