import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
    alignItems: 'center',
    paddingBottom: 20,
  },
  circleContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  stepsOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepsText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 50,
  },
  stepsLabel: {
    fontSize:20,
    color: '#666', 
    textAlign: 'center',
    marginTop: 5,
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 80,
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
    position: 'absolute', 
    top: 40, 
    left: 20, 
  },
  topRightContainer: {
  position: 'absolute',
  top: 40,
  right: 20,
},
  containershop: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
    alignItems: 'center',
  },
  titleshop: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitleshop: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    width: 300,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
},
modalTitleBox:{
backgroundColor: '#ffff69',
fontSize: 30,
borderRadius:5,
marginBottom:30,

},
modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
},
modalButton: {
    marginTop: 10,
    backgroundColor: '#fafafa',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
},
modalButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
},
});