   import React from "react";
   import { View, Text } from "react-native";
   import * as Progress from "react-native-progress";
   import { styles } from "../styles/styles";
   
   const PedometerCircle = ({ steps, weeklyGoal, stepGoals }) => {
     const progress = steps > weeklyGoal ? 1 : steps / weeklyGoal;
     const progressPercent = Math.round(progress * 100);
   
     return (
       <>
         <View
           style={{
             position: "relative",
             justifyContent: "center",
             alignItems: "center",
             backgroundColor: "#FFFFFF",
             borderRadius: 150,
           }}
         >
           <Progress.Circle
             progress={progress}
             size={300}
             thickness={10}
             color="#4CAF50"
             unfilledColor="#E0E0E0"
             showsText={false}
             borderWidth={0}
           />
           {stepGoals.map((goal, index) => {
             const angle = (index * 72 - 90) * (Math.PI / 180);
             const radius = 150;
             const x = radius * Math.cos(angle);
             const y = radius * Math.sin(angle);
   
             return (
               <View
                 key={index}
                 style={{
                   position: "absolute",
                   transform: [{ translateX: x }, { translateY: y }],
                   alignItems: "center",
                 }}
               >
                 <View
                   style={[
                     styles.goalMarker,
                     steps >= goal.steps && styles.goalMarkerAchieved,
                   ]}
                 >
                   <Text style={styles.goalMarkerText}>
                     {goal.steps.toLocaleString()}
                   </Text>
                 </View>
                 <View style={styles.goalReward}>
                   <Text style={styles.goalRewardText}>💰 {goal.coins}</Text>
                 </View>
               </View>
             );
           })}
   
           <View style={styles.stepsOverlay}>
             <Text style={styles.stepsText}>{steps.toLocaleString()}</Text>
             <Text style={{ fontSize: 60, textAlign: "center" }}>🏃‍♂️‍</Text>
             <Text style={styles.stepsLabel}>Steps</Text>
             <Text style={styles.levelText}>Level 1 (0/3 ⭐)</Text>
           </View>
         </View>
   
         <Text style={styles.progressText}>
         Progress: {progressPercent}% from the weekly target
         </Text>
       </>
     );
   };
   
   export default PedometerCircle;