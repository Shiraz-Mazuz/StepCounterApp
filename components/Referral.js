import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Referral() {
  const navigation = useNavigation();

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Join me on Step App and earn rewards! Use this link to sign up: ',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared via:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.log('Error sharing:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>⬅ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Refer a Friend</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>
          Invite your friends to join Step App and earn 50 coins for each friend who signs up using your link!
        </Text>
        <Text style={styles.link}>
          Your Referral Link: 
        </Text>
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Text style={styles.shareButtonText}>Share Link</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F0FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    fontSize: 18,
    color: '#007AFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  link: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});