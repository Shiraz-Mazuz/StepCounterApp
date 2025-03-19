import { View, Text } from 'react-native';
import * as Progress from 'react-native-progress';
import { styles } from '../styles/styles';


const PedometerCircle = ({ steps, weeklyGoal }) => {
    const progress = steps > weeklyGoal ? 1 : steps / weeklyGoal;
    const progressPercent = Math.round(progress * 100);
  
    return (
      <>
        <View style={styles.circleContainer}>
          <Progress.Circle
            progress={progress}
            size={300}
            thickness={10}
            color="#4CAF50"
            unfilledColor="#E0E0E0"
            showsText={false}
          >
            <Text style={styles.stepsText}>{steps} 👟</Text>
          </Progress.Circle>
        </View>
        <Text style={styles.progressText}>You have progressed: {progressPercent}%</Text>
      </>
    );
  };
  
  export default PedometerCircle;