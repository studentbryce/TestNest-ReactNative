// ResultsScreen.jsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global';
import { colors } from '../theme';
import Header from '../components/Header';

export default function ResultsScreen({ navigation, route }) {
  const { score, total, timeUsed = 0, totalTime = 600 } = route.params;
  const percentage = Math.round((score / total) * 100);
  
  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate time efficiency
  const timeEfficiency = totalTime > 0 ? Math.round(((totalTime - timeUsed) / totalTime) * 100) : 0;

  const getPerformanceMessage = () => {
    if (percentage >= 80) return "🌟 Excellent work!";
    if (percentage >= 60) return "👍 Good job!";
    if (percentage >= 40) return "📈 Keep practicing!";
    return "💪 Don't give up!";
  };

  const getTimeMessage = () => {
    if (timeEfficiency >= 50) return "⚡ Great time management!";
    if (timeEfficiency >= 25) return "⏰ Good pacing!";
    return "🐌 Consider working faster next time.";
  };

  return (
    <View style={globalStyles.container}>
      <Header navigation={navigation} title="Test Results" />
      
      <View style={globalStyles.textCard}>
        <Text style={globalStyles.title}>Demo Test Complete!</Text>
        
        <Text style={[globalStyles.subtitle, { fontSize: 24, marginVertical: 15 }]}>
          Your Score: {score}/{total}
        </Text>
        
        <Text style={[globalStyles.subtitle, { fontSize: 20, color: colors.primary }]}>
          {percentage}% Correct
        </Text>
        
        <Text style={globalStyles.text}>
          {getPerformanceMessage()}
        </Text>
      </View>

      {/* Time Statistics */}
      <View style={globalStyles.textCard}>
        <Text style={globalStyles.subtitle}>⏱️ Time Statistics</Text>
        
        <View style={styles.timeStats}>
          <View style={styles.timeStat} padding={10}>
            <Text style={styles.timeValue}>{formatTime(timeUsed)}</Text>
            <Text style={styles.timeLabel}>Time Used</Text>
          </View>
          
          <View style={styles.timeStat} padding={10}>
            <Text style={styles.timeValue}>{formatTime(totalTime - timeUsed)}</Text>
            <Text style={styles.timeLabel}>Time Remaining</Text>
          </View>
          
          <View style={styles.timeStat} padding={10}>
            <Text style={styles.timeValue}>{timeEfficiency}%</Text>
            <Text style={styles.timeLabel}>Efficiency</Text>
          </View>
        </View>
        
        <Text style={[globalStyles.text, { marginTop: 10 }]}>
          {getTimeMessage()}
        </Text>
      </View>

      <TouchableOpacity 
        style={globalStyles.button} 
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={globalStyles.buttonText}>Back to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={globalStyles.selectionButton} 
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={globalStyles.selectionText}>Sign Up for Full Access</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  timeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  timeStat: {
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  timeLabel: {
    fontSize: 12,
    color: colors.textDark,
    marginTop: 5,
  },
};