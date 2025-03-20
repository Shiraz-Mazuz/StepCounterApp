import { View, Text } from 'react-native';
import * as Progress from 'react-native-progress';
import { styles } from '../styles/styles';


const PedometerCircle = ({ steps, weeklyGoal }) => {
    const progress = steps > weeklyGoal ? 1 : steps / weeklyGoal;
    const progressPercent = Math.round(progress * 100);
  
    return (
      <>
     
        <View style={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
          <Progress.Circle
            progress={progress}
            size={300}
            thickness={10}
            color="#4CAF50"
            unfilledColor="#E0E0E0"
            showsText={false}
            borderWidth={0}


          />
         <View style={styles.stepsOverlay}>
            <Text style={styles.stepsText}> {steps}</Text>
            <Text style={{fontSize: 60, textAlign:'center'}}>🚶‍➡️</Text>
            <Text style={styles.stepsLabel}>steps</Text>
                </View>
             </View>
         
        <Text style={styles.progressText}>You have progressed: {progressPercent}%</Text>
      </>
    );
  };
  
  export default PedometerCircle;


   