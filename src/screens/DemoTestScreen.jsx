import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/global';
import { colors } from '../theme';
import Header from '../components/Header';
import { demoQuestions } from '../data/demoQuestions';

export default function DemoTestScreen({ navigation }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [isTimeWarning, setIsTimeWarning] = useState(false);

  const question = demoQuestions[currentQuestionIndex];
  const totalTime = 600; // 10 minutes total

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleTimeUp();
      return;
    }

    // Set warning state when under 2 minutes
    setIsTimeWarning(timeRemaining <= 120);

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleTimeUp = () => {
    Alert.alert(
      "Time's Up! ⏰",
      "Your test time has expired. Submitting your current answers.",
      [{ text: "OK", onPress: submitTest }]
    );
  };

  const submitTest = () => {
    let score = 0;
    answers.forEach((ans, i) => {
      if (ans === demoQuestions[i]?.correctAnswer) {
        score++;
      }
    });

    navigation.navigate('DemoResults', {
      score,
      total: demoQuestions.length,
      timeUsed: totalTime - timeRemaining,
      totalTime
    });
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < demoQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(updatedAnswers[currentQuestionIndex + 1] ?? null);
    } else {
      submitTest();
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = (timeRemaining / totalTime) * 100;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={globalStyles.container} edges={['bottom']}>
        <View style={globalStyles.container}>
          <Header navigation={navigation} title="Python Quiz" />

          {/* Timer Display */}
          <View style={styles.timerContainer}>
            <View style={styles.timerWrapper}>
              <View style={[
                styles.timerCircle,
                { borderColor: isTimeWarning ? '#ff4444' : colors.primary }
              ]}>
                <Text style={[
                  styles.timerText,
                  { color: isTimeWarning ? '#ff4444' : colors.primary }
                ]}>
                  {formatTime(timeRemaining)}
                </Text>
                <Text style={styles.timerLabel}>
                  {isTimeWarning ? '⚠️ TIME!' : 'Time Left'}
                </Text>
              </View>

              {/* Progress Arc */}
              <View style={styles.progressContainer}>
                <View style={[
                  styles.progressBar,
                  {
                    width: `${progressPercentage}%`,
                    backgroundColor: isTimeWarning ? '#ff4444' : colors.accent
                  }
                ]} />
              </View>
            </View>

            <Text style={styles.questionProgress}>
              Question {currentQuestionIndex + 1} of {demoQuestions.length}
            </Text>
          </View>

          {/* Question Content */}
          <View style={styles.questionContainer}>

            <Text style={globalStyles.subtitle}>{question.question}</Text>

            {question.choices.map((choice, index) => {
              const isSelected = selectedOption === index;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    globalStyles.selectionButton,
                    {
                      backgroundColor: colors.accent,
                      borderColor: isSelected ? colors.primary : 'transparent',
                      borderWidth: isSelected ? 3 : 0,
                    }
                  ]}
                  onPress={() => setSelectedOption(index)}
                >
                  <Text style={globalStyles.selectionText}>
                    {String.fromCharCode(65 + index)}: {choice}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[
              globalStyles.button,
              {
                backgroundColor: selectedOption === null ? '#ccc' : colors.primary,
              }
            ]}
            onPress={handleNext}
            disabled={selectedOption === null}
          >
            <Text style={globalStyles.buttonText}>
              {currentQuestionIndex < demoQuestions.length - 1 ? 'Next Question' : 'Submit Test'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = {
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: colors.secondary,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  timerWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  timerCircle: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  timerLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  progressContainer: {
    width: 200,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginTop: 15,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 1s ease-in-out',
  },
  questionProgress: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: '500',
    marginTop: 20,
  },
  questionContainer: {
    flex: 1,
  },
};