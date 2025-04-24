import React, { useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { BarChart} from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { styles } from '../styles/styles';
import { AppContext } from './AppContext';
import NavigationBar from './NavigationBar';
import homeScreenStyle from '../styles/homeScreenStyle';

const ActivimentScreen = () =>{
  const {
    steps, 
    distance,
    weeklySteps,
    dailyStepsHistory,
  } = useContext(AppContext);

  const caloriesToday = (steps * 0.04).toFixed(1);
  const wekeklyCalories = (weeklySteps * 0.04).toFixed(1);

  const today = new Date().toISOString().split('T')[0];
  const last7Days = [];
  for (let i = 6; i >=0; i--){
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    last7Days.push({date: dateStr, steps: 0});
  }

  dailyStepsHistory.forEach((entry) => {
    const index = last7Days.findIndex((day) => day.date === entry.date);
    if (index !== -1) {
      last7Days[index].steps = entry.steps;
    }
  });

  const todayIndex = last7Days.findIndex((day) => day.date === today);
  if (todayIndex !== -1) {
    last7Days[todayIndex].steps = steps;
  }

  const chartData = {
    labels: last7Days.map((day) => {
      const date = new Date(day.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        data: last7Days.map((day) => day.steps),
      },
    ],
  };

  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 14);
  const monthlySteps = dailyStepsHistory
    .filter((entry) => new Date(entry.date) >= oneMonthAgo)
    .reduce((sum, entry) => sum + entry.steps, steps);
  const monthlyDistance = (monthlySteps * 0.78 / 1000).toFixed(1);
  const monthlyCalories = (monthlySteps * 0.04).toFixed(1);

  const screenWidth = Dimensions.get('window').width;



  return (
  <ScrollView style={{ flex: 1, backgroundColor: '#f5fffa ' }}>
    <View style={styles.container}>
      <NavigationBar />
      <Text style={[homeScreenStyle.sectionTitle, {marginTop: 20, alignItems: 'center'}]}>
        Your Activiment
      </Text>
    <View style={homeScreenStyle.statsContainer}>
        <View style={homeScreenStyle.statItem}>
          <Text style={homeScreenStyle.statLabel}> Steps today </Text>
          <Text style={homeScreenStyle.statValue}> {steps.toLocaleString()} 🏃 </Text>
        </View>
      <View style={homeScreenStyle.statItem}>
        <Text style={homeScreenStyle.statLabel}> Distance</Text>
        <Text style={homeScreenStyle.statValue}>📍 {distance.toFixed(1)} km </Text>
      </View>
      <View style={homeScreenStyle.statItem}>
        <Text style={homeScreenStyle.statLabel}> Calories</Text>
        <Text style={homeScreenStyle.statValue}> {caloriesToday}🔥 </Text>
      </View>
   </View>
    <View style={homeScreenStyle.sectionContainer}>
      <Text style={homeScreenStyle.sectionTitle}> Weekly steps</Text>
      <BarChart 
      data={chartData}
      width={screenWidth - 40}
      height={220}
      yAxisSuffix=""
      yAxisLabel=""
      chartConfig={{
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, 
        labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: '6',
          strokeWidth: '2',
          stroke: '#ffa726',
        },
      }}
      style={{
        marginVertical: 8,
        borderRadius: 16,
        padding: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
      }}
      />
    </View>
 <View style={styles.activimentContainer}>
  <Text style={styles.actTitle}> The last 7 days </Text>
  <View style={styles.actContainer}>
    <View style={styles.actItem}>
      <Text style={styles.actLabel}>Total steps </Text>
      <Text style={styles.actValue}> {weeklySteps.toLocaleString()} 🏃</Text>
    </View>
    <View style={styles.actItem}>
      <Text style={styles.actLabel}>Total distance </Text>
      <Text style={styles.actValue}> 📍{(weeklySteps * 0.78/ 1000).toFixed(1)}  km</Text>
    </View>
    <View style={styles.actItem}>
      <Text style={styles.actLabel}>Total Calories </Text>
      <Text style={styles.actValue}> {wekeklyCalories} 🔥 cal</Text>
    </View>
  </View>
 </View>

</View>
    <View style={styles.activimentContainer}>
  <Text style={styles.actTitle}> The last month </Text>
  <View style={styles.actContainer}>
    <View style={styles.actItem}>
      <Text style={styles.actLabel}>Total steps </Text>
      <Text style={styles.actValue}> {monthlySteps.toLocaleString()} 🏃</Text>
    </View>
    <View style={styles.actItem}>
      <Text style={styles.actLabel}>Total distance </Text>
      <Text style={styles.actValue}> 📍{monthlyDistance}  km </Text>
    </View>
    <View style={styles.actItem}>
      <Text style={styles.actLabel}>Total Calories </Text>
      <Text style={styles.actValue}> {monthlyCalories} 🔥 cal</Text>
    </View>
  </View>
 </View>

    
  </ScrollView>
  );
};

export default ActivimentScreen;