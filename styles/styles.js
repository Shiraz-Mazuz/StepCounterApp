import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  circleContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepsText: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  goalText: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 50,
  },
  progressText: {
    fontSize: 16,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  button: {
    padding: 25,
    borderRadius: 10,
    marginTop: 20,
  },
  coinButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  giftShopButton: {
    backgroundColor: '#FF69B4',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  topLeftContainer: {
    position: 'absolute', // ממקם את הכפתור ביחס ל-View הראשי
    top: 40, // מרחק מהחלק העליון של המסך
    left: 20, // מרחק מהצד השמאלי של המסך
  },
});