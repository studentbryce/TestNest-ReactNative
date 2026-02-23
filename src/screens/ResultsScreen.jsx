import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/global';
import { colors } from '../theme';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../services/database';

export default function ResultsScreen({ navigation, route }) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [resultsSaved, setResultsSaved] = useState(false);
  const [previousResults, setPreviousResults] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showQuestionResults, setShowQuestionResults] = useState(false);
  const [expandedHistoryResult, setExpandedHistoryResult] = useState(null);
  const [historicalQuestions, setHistoricalQuestions] = useState({});
  const [loadingHistoricalQuestions, setLoadingHistoricalQuestions] = useState(null);

  // Add safety check for route.params
  const params = route?.params || {};
  const { score = 0, total = 10, timeUsed = 0, totalTime = 600, testData, answers = [] } = params;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  useEffect(() => {
    console.log('📊 ResultsScreen useEffect triggered');
    console.log('Route params:', route?.params);
    console.log('User data:', user);
    console.log('Results already saved:', resultsSaved);
    
    loadPreviousResults();
    
    if (route?.params && user?.studentid && !resultsSaved) {
      console.log('✅ Conditions met - saving test results');
      saveTestResults();
    } else {
      console.log('❌ Conditions not met for saving:', {
        hasParams: !!route?.params,
        hasStudentId: !!user?.studentid,
        alreadySaved: resultsSaved
      });
    }
  }, [route?.params, user]);

  const saveTestResults = async () => {
    if (!testData?.testid || !user?.studentid || resultsSaved) {
      return;
    }

    try {
      setSaving(true);
      
      console.log('💾 Saving test results:', {
        studentid: user.studentid,
        testid: testData.testid,
        answersCount: answers.length,
        score,
        timeUsed
      });
      
      const result = await DatabaseService.submitTestResults(
        user.studentid,
        testData.testid,
        answers,
        score,
        timeUsed
      );

      console.log('✅ Test results saved successfully:', result);
      setResultsSaved(true);
      
      // Show success message
      Alert.alert('Success', 'Your test results have been saved successfully!');
      
      // Reload results after saving
      setTimeout(() => {
        loadPreviousResults();
      }, 1000);

    } catch (error) {
      console.error('❌ Error saving test results:', error);
      Alert.alert(
        'Save Error',
        `Your results could not be saved: ${error.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setSaving(false);
    }
  };

  const loadPreviousResults = async () => {
    if (!user?.studentid) {
      console.log('No user studentid available');
      setLoadingHistory(false);
      return;
    }

    try {
      console.log('Loading results for student:', user.studentid);
      const results = await DatabaseService.getTestResultsByStudent(user.studentid);
      
      console.log('Retrieved results:', results);
      
      if (results && results.length > 0) {
        setPreviousResults(results.slice(0, 10)); // Show last 10 results
      } else {
        setPreviousResults([]);
        console.log('No previous results found');
      }

    } catch (error) {
      console.error('❌ Error loading previous results:', error);
      setPreviousResults([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
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

  const getGradeLevel = () => {
    if (percentage >= 90) return { grade: 'A+', color: colors.success };
    if (percentage >= 80) return { grade: 'A', color: colors.success };
    if (percentage >= 70) return { grade: 'B', color: colors.warning || '#FF9800' };
    if (percentage >= 60) return { grade: 'C', color: colors.warning || '#FF9800' };
    if (percentage >= 50) return { grade: 'D', color: colors.error };
    return { grade: 'F', color: colors.error };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    
    try {
      // Parse the timestamp and extract the time parts directly
      // Format: 2025-10-19T13:22:12.492Z (ISO format)
      const match = dateString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
      if (match) {
        const [, year, month, day, hour, minute] = match;
        const date = new Date(year, month - 1, day, hour, minute);
        
        return date.toLocaleString('en-NZ', {
          month: 'short',
          day: 'numeric', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } else {
        // Fallback to original method
        const date = new Date(dateString);
        return date.toLocaleString('en-NZ', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getGradeEmoji = (score) => {
    const percentage = score || 0;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const getGradeColor = (score) => {
    const percentage = score || 0;
    if (percentage >= 90) return colors.success || '#4CAF50'; // Green for A+
    if (percentage >= 80) return colors.success || '#4CAF50'; // Green for A
    if (percentage >= 70) return colors.warning || '#FF9800'; // Orange for B
    if (percentage >= 60) return colors.warning || '#FF9800'; // Orange for C
    if (percentage >= 50) return colors.error || '#F44336'; // Red for D
    return colors.error || '#F44336'; // Red for F
  };

  // Function to handle clicking on historical results
  const handleHistoricalResultClick = async (result) => {
    // Use unique result ID that includes timestamp
    const resultKey = result.resultid || `${result.testid}_${result.studentid}_${result.CompletedAt}`;
    
    // If already expanded, collapse it
    if (expandedHistoryResult === resultKey) {
      setExpandedHistoryResult(null);
      return;
    }
    
    // If questions are already loaded, just expand
    if (historicalQuestions[resultKey]) {
      setExpandedHistoryResult(resultKey);
      return;
    }
    
    // Load questions for this test
    try {
      setLoadingHistoricalQuestions(resultKey);
      console.log('🔍 Loading questions for historical result:', result.testid);
      const questions = await DatabaseService.getQuestionsByTestId(result.testid);
      
      if (questions && questions.length > 0) {
        setHistoricalQuestions(prev => ({
          ...prev,
          [resultKey]: questions
        }));
        setExpandedHistoryResult(resultKey);
      } else {
        Alert.alert('No Questions', 'Question details are not available for this test.');
      }
    } catch (error) {
      console.error('❌ Error loading historical questions:', error);
      Alert.alert('Error', 'Could not load question details for this test.');
    } finally {
      setLoadingHistoricalQuestions(null);
    }
  };

  const grade = getGradeLevel();

  // Function to render historical question results
  const renderHistoricalQuestionResults = (result) => {
    // Use unique result ID that includes timestamp
    const resultKey = result.resultid || `${result.testid}_${result.studentid}_${result.CompletedAt}`;
    const questions = historicalQuestions[resultKey];
    
    if (!questions || questions.length === 0) {
      return (
        <View style={globalStyles.textCard}>
          <Text style={globalStyles.text}>❌ Question details not available</Text>
        </View>
      );
    }
    
    if (!result.Answers || result.Answers.length === 0) {
      return (
        <View style={globalStyles.textCard}>
          <Text style={globalStyles.text}>❌ Answer data not available for this result</Text>
        </View>
      );
    }
    
    return (
      <View style={[globalStyles.section, { marginTop: 10 }]}>
        <Text style={globalStyles.sectionTitle}>📝 Question Review - {result.Tests?.testtitle}</Text>
        
        {questions.map((question, index) => {
          const answerData = result.Answers.find(a => a.QuestionID === question.questionid);
          const userAnswer = answerData ? answerData.GivenAnswer : null;
          const correctAnswer = question.correctanswer || question.answer;
          const isCorrect = userAnswer === correctAnswer;
          
          // Convert answer index to actual answer text for historical results
          const getAnswerText = (answerIndex, question) => {
            if (answerIndex === null || answerIndex === undefined) return 'No answer recorded';
            
            // Convert to number if it's a string
            const index = parseInt(answerIndex);
            
            // For database questions with choice1, choice2, choice3, choice4 (1-based indexing)
            if (question.choice1 !== undefined) {
              const choices = [question.choice1, question.choice2, question.choice3, question.choice4];
              // Database uses 1-based indexing, so subtract 1 for array access
              const arrayIndex = index - 1;
              return choices[arrayIndex] || `Invalid option (${index})`;
            }
            
            // For demo questions with choices array (0-based indexing)
            if (question.choices && Array.isArray(question.choices)) {
              return question.choices[index] || `Invalid option (${index})`;
            }
            
            // Fallback
            return answerIndex.toString();
          };
          
          const userAnswerText = getAnswerText(userAnswer, question);
          const correctAnswerText = getAnswerText(correctAnswer, question);
          
          return (
            <View 
              key={question.questionid} 
              style={globalStyles.menuCard}
            >
              <View style={globalStyles.menuContent}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={[globalStyles.menuTitle, { flex: 1 }]}>
                    Question {index + 1}
                  </Text>
                  <View style={{
                    backgroundColor: isCorrect ? colors.success + '20' : colors.error + '20',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12
                  }}>
                    <Text style={{
                      color: isCorrect ? colors.success : colors.error,
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}>
                      {isCorrect ? '✅ Correct' : '❌ Incorrect'}
                    </Text>
                  </View>
                </View>

                <Text style={[globalStyles.text, { marginBottom: 10, fontWeight: '500' }]}>
                  {question.questiontext || question.question}
                </Text>

                <View style={{ marginBottom: 8 }}>
                  <Text style={[globalStyles.menuSubtitle, { fontWeight: 'bold' }]}>
                    Your Answer:
                  </Text>
                  <Text style={[
                    globalStyles.text,
                    { 
                      color: isCorrect ? colors.success : colors.error,
                      marginLeft: 10,
                      fontWeight: '500'
                    }
                  ]}>
                    {userAnswerText}
                  </Text>
                </View>

                {!isCorrect && (
                  <View style={{ marginBottom: 8 }}>
                    <Text style={[globalStyles.menuSubtitle, { fontWeight: 'bold' }]}>
                      Correct Answer:
                    </Text>
                    <Text style={[
                      globalStyles.text,
                      { 
                        color: colors.success,
                        marginLeft: 10,
                        fontWeight: '500'
                      }
                    ]}>
                      {correctAnswerText}
                    </Text>
                  </View>
                )}

                {question.explanation && (
                  <View style={{ 
                    marginTop: 10, 
                    padding: 10, 
                    backgroundColor: colors.primary + '10',
                    borderRadius: 8
                  }}>
                    <Text style={[globalStyles.menuSubtitle, { fontWeight: 'bold', marginBottom: 4 }]}>
                      💡 Explanation:
                    </Text>
                    <Text style={[globalStyles.text, { fontSize: 13 }]}>
                      {question.explanation}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        <TouchableOpacity
          style={[globalStyles.selectionButton, { marginTop: 15 }]}
          onPress={() => setExpandedHistoryResult(null)}
        >
          <Text style={globalStyles.selectionText}>📊 Close Review</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Function to render individual question results
  const renderQuestionResults = () => {
    console.log('🔍 Debug - renderQuestionResults data check:');
    console.log('  - answers:', answers);
    console.log('  - answers length:', answers?.length);
    console.log('  - testData:', testData);
    console.log('  - testData.questions:', testData?.questions);
    console.log('  - route.params:', route?.params);
    
    if (!answers || answers.length === 0) {
      return (
        <View style={globalStyles.textCard}>
          <Text style={globalStyles.text}>❌ No answer data available for review</Text>
          <Text style={[globalStyles.text, { fontSize: 12, marginTop: 5 }]}>
            This usually happens with demo tests or if the test wasn't completed properly.
          </Text>
        </View>
      );
    }

    if (!testData?.questions || testData.questions.length === 0) {
      return (
        <View style={globalStyles.textCard}>
          <Text style={globalStyles.text}>❌ Question details not available for review</Text>
          <Text style={[globalStyles.text, { fontSize: 12, marginTop: 5 }]}>
            The question data wasn't saved with this test completion.
          </Text>
          <Text style={[globalStyles.text, { fontSize: 11, marginTop: 10, fontStyle: 'italic' }]}>
            Debug: Available testData keys: {testData ? Object.keys(testData).join(', ') : 'none'}
          </Text>
        </View>
      );
    }

      return (
        <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>📝 Question by Question Review</Text>
        
        {testData.questions.map((question, index) => {
          const userAnswer = answers[index];
          const actualAnswer = typeof userAnswer === 'object' ? userAnswer?.selectedAnswer : userAnswer;
          const isCorrect = actualAnswer === question.correctanswer;
          
          // Convert answer index to actual answer text
          const getAnswerText = (answerIndex, question) => {
            if (answerIndex === null || answerIndex === undefined) return 'No answer selected';
            
            // Convert to number if it's a string
            const index = parseInt(answerIndex);
            
            // For demo questions with choices array (0-based indexing)
            if (question.choices && Array.isArray(question.choices)) {
              return question.choices[index] || `Invalid option (${index})`;
            }
            
            // For database questions with choice1, choice2, choice3, choice4 (1-based indexing)
            if (question.choice1 !== undefined) {
              const choices = [question.choice1, question.choice2, question.choice3, question.choice4];
              // Database uses 1-based indexing, so subtract 1 for array access
              const arrayIndex = index - 1;
              return choices[arrayIndex] || `Invalid option (${index})`;
            }
            
            // Fallback
            return answerIndex.toString();
          };
          
          const userAnswerText = getAnswerText(actualAnswer, question);
          const correctAnswerText = getAnswerText(question.correctanswer, question);          // Debug logging for answer format
          if (index === 0) {
            console.log('🔍 Answer format check:', {
              userAnswer,
              actualAnswer,
              answerType: typeof userAnswer,
              isObject: typeof userAnswer === 'object',
              correctAnswer: question.correctanswer
            });
          }
          
          return (
            <View 
              key={index} 
              style={globalStyles.menuCard}
            >
              <View style={globalStyles.menuContent}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={[globalStyles.menuTitle, { flex: 1 }]}>
                    Question {index + 1}
                  </Text>
                  <View style={{
                    backgroundColor: isCorrect ? colors.success + '20' : colors.error + '20',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12
                  }}>
                    <Text style={{
                      color: isCorrect ? colors.success : colors.error,
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}>
                      {isCorrect ? '✅ Correct' : '❌ Incorrect'}
                    </Text>
                  </View>
                </View>

                <Text style={[globalStyles.text, { marginBottom: 10, fontWeight: '500' }]}>
                  {question.questiontext}
                </Text>

                <View style={{ marginBottom: 8 }}>
                  <Text style={[globalStyles.menuSubtitle, { fontWeight: 'bold' }]}>
                    Your Answer:
                  </Text>
                  <Text style={[
                    globalStyles.text,
                    { 
                      color: isCorrect ? colors.success : colors.error,
                      marginLeft: 10,
                      fontWeight: '500'
                    }
                  ]}>
                    {userAnswerText}
                  </Text>
                </View>

                {!isCorrect && (
                  <View style={{ marginBottom: 8 }}>
                    <Text style={[globalStyles.menuSubtitle, { fontWeight: 'bold' }]}>
                      Correct Answer:
                    </Text>
                    <Text style={[
                      globalStyles.text,
                      { 
                        color: colors.success,
                        marginLeft: 10,
                        fontWeight: '500'
                      }
                    ]}>
                      {correctAnswerText}
                    </Text>
                  </View>
                )}

                {question.explanation && (
                  <View style={{ 
                    marginTop: 10, 
                    padding: 10, 
                    backgroundColor: colors.primary + '10',
                    borderRadius: 8
                  }}>
                    <Text style={[globalStyles.menuSubtitle, { fontWeight: 'bold', marginBottom: 4 }]}>
                      💡 Explanation:
                    </Text>
                    <Text style={[globalStyles.text, { fontSize: 13 }]}>
                      {question.explanation}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        <TouchableOpacity
          style={[globalStyles.selectionButton, { marginTop: 15 }]}
          onPress={() => setShowQuestionResults(false)}
        >
          <Text style={globalStyles.selectionText}>📊 Back to Summary</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Always show the results history view
  return (
    <SafeAreaProvider>
      <SafeAreaView style={globalStyles.container} edges={['bottom']}>
        <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
          <Header navigation={navigation} title="Test Results" />

          {/* Show current test results if available */}
          {route?.params && (
            <>
              {/* Save Status */}
              {saving && (
                <View style={[globalStyles.textCard, { backgroundColor: colors.warning + '20' }]}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={[globalStyles.text, { marginTop: 10 }]}>💾 Saving results...</Text>
                </View>
              )}

              {resultsSaved && (
                <View style={[globalStyles.textCard, { backgroundColor: colors.success + '20' }]}>
                  <Text style={[globalStyles.text, { color: colors.success }]}>
                    ✅ Results saved to your profile!
                  </Text>
                </View>
              )}

              {/* Test Info */}
              {testData && (
                <View style={globalStyles.testInfoCard}>
                  <Text style={globalStyles.testIcon}>{testData.icon || '📝'}</Text>
                  <Text style={globalStyles.testTitle}>{testData.title || testData.testtitle}</Text>
                  <Text style={globalStyles.testCategory}>{testData.category || 'Test'}</Text>
                </View>
              )}

              {/* Score Display - Now Clickable */}
              <TouchableOpacity 
                style={[globalStyles.textCard, { 
                  borderWidth: 2, 
                  borderColor: colors.primary + '30'
                }]}
                onPress={() => setShowQuestionResults(!showQuestionResults)}
                activeOpacity={0.7}
              >
                <Text style={globalStyles.title}>Test Complete! 🎉</Text>

                <View style={globalStyles.scoreContainer}>
                  <View style={[globalStyles.gradeCircle, { borderColor: getGradeLevel().color }]}>
                    <Text style={[globalStyles.gradeText, { color: getGradeLevel().color }]}>{getGradeLevel().grade}</Text>
                  </View>
                </View>

                <Text style={[globalStyles.subtitle, { fontSize: 24, marginVertical: 15 }]}>
                  Your Score: {score}/{total}
                </Text>

                <Text style={[globalStyles.subtitle, { fontSize: 20, color: colors.primary }]}>
                  {percentage}% Correct
                </Text>

                <Text style={globalStyles.text}>
                  {getPerformanceMessage()}
                </Text>

                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginTop: 15,
                  padding: 10,
                  backgroundColor: colors.primary + '10',
                  borderRadius: 8
                }}>
                  <Text style={[globalStyles.text, { 
                    color: colors.primary,
                    fontWeight: '500',
                    marginRight: 5
                  }]}>
                    {showQuestionResults ? '📊 Tap to show summary' : 'Tap to review questions'}
                  </Text>
                  <Text style={[globalStyles.text, { 
                    color: colors.primary,
                    fontSize: 16
                  }]}>
                    {showQuestionResults ? '⬆️' : '⬇️'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Question Results Detail View */}
              {showQuestionResults && renderQuestionResults()}

              {/* Time Statistics */}
              <View style={globalStyles.textCard}>
                <Text style={globalStyles.subtitle}>⏱️ Time Statistics</Text>

                <View style={globalStyles.timeStats}>
                  <View style={globalStyles.timeStat}>
                    <Text style={globalStyles.timeValue}>{formatTime(timeUsed)}</Text>
                    <Text style={globalStyles.timeLabel}>Time Used</Text>
                  </View>

                  <View style={globalStyles.timeStat}>
                    <Text style={globalStyles.timeValue}>{formatTime(totalTime - timeUsed)}</Text>
                    <Text style={globalStyles.timeLabel}>Time Remaining</Text>
                  </View>

                  <View style={globalStyles.timeStat}>
                    <Text style={globalStyles.timeValue}>{timeEfficiency}%</Text>
                    <Text style={globalStyles.timeLabel}>Efficiency</Text>
                  </View>
                </View>

                <Text style={[globalStyles.text, { marginTop: 10 }]}>
                  {getTimeMessage()}
                </Text>
              </View>
            </>
          )}

          {/* Results History Section */}
          <View style={globalStyles.textCard}>
            <Text style={globalStyles.title}>📊 Your Test History</Text>
            <Text style={globalStyles.subtitle}>
              {route?.params ? 'Your recent test results:' : 'View your previous test results and track your progress.'}
            </Text>
          </View>

          {/* Previous Results Section */}
          {loadingHistory ? (
            <View style={globalStyles.textCard}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[globalStyles.text, { marginTop: 10 }]}>Loading your results...</Text>
            </View>
          ) : previousResults.length > 0 ? (
            <View style={globalStyles.section}>
              <Text style={globalStyles.sectionTitle}>Your Test Results ({previousResults.length})</Text>
              {previousResults.map((result, index) => {
                // Use unique result ID that includes timestamp
                const resultKey = result.resultid || `${result.testid}_${result.studentid}_${result.CompletedAt}`;
                const isExpanded = expandedHistoryResult === resultKey;
                
                return (
                  <View key={result.ResultID || index}>
                    <TouchableOpacity 
                      style={[
                        globalStyles.menuCard,
                        {
                          borderWidth: isExpanded ? 2 : 1,
                          borderColor: isExpanded ? colors.primary : 'transparent'
                        }
                      ]}
                      onPress={() => handleHistoricalResultClick(result)}
                      activeOpacity={0.7}
                    >
                      <View style={globalStyles.menuIcon}>
                        <Text style={[globalStyles.menuIconText, {
                          color: getGradeColor(result.Score),
                          fontWeight: 'bold',
                          fontSize: 20
                        }]}
                        >
                          {getGradeEmoji(result.Score)}
                        </Text>
                      </View>
                      <View style={globalStyles.menuContent}>
                        <Text style={globalStyles.menuTitle}>
                          {result.Tests?.testtitle || `Test ${result.TestID}`}
                        </Text>
                        <Text style={globalStyles.menuSubtitle}>
                          📅 {formatDate(result.CompletedAt)} • Score: {result.Score || 0}%
                        </Text>
                        <Text style={[globalStyles.menuSubtitle, { fontSize: 12 }]}>
                          Questions: {result.TotalQuestions || 0} • Correct: {result.CorrectAnswers || 0}
                        </Text>
                        <Text style={[globalStyles.text, { 
                          fontSize: 11, 
                          color: colors.primary,
                          marginTop: 5,
                          fontStyle: 'italic'
                        }]}>
                          {loadingHistoricalQuestions === resultKey 
                            ? '⏳ Loading...' 
                            : isExpanded 
                              ? '� Tap to close review' 
                              : '� Tap to review questions'
                          }
                        </Text>
                      </View>
                      <View style={globalStyles.menuArrow}>
                        <Text style={[globalStyles.menuArrowText, {
                          color: (result.Score || 0) >= 70 ? colors.success : colors.error,
                          fontWeight: 'bold'
                        }]}
                        >
                          {result.Score || 0}%
                        </Text>
                      </View>
                    </TouchableOpacity>
                    
                    {/* Show detailed question results if this result is expanded */}
                    {isExpanded && (
                      loadingHistoricalQuestions === resultKey ? (
                        <View style={[globalStyles.textCard, { marginTop: 10 }]}>
                          <ActivityIndicator size="small" color={colors.primary} />
                          <Text style={[globalStyles.text, { marginTop: 10, textAlign: 'center' }]}>
                            Loading question details...
                          </Text>
                        </View>
                      ) : (
                        renderHistoricalQuestionResults(result)
                      )
                    )}
                  </View>
                );
              })}

              <TouchableOpacity
                style={[globalStyles.selectionButton, { marginTop: 15 }]}
                onPress={() => loadPreviousResults()}
              >
                <Text style={globalStyles.selectionText}>🔄 Refresh Results</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={globalStyles.textCard}>
              <Text style={globalStyles.title}>📚 No Results Yet</Text>
              <Text style={globalStyles.text}>
                {user?.studentid ? 'Take your first test to see results here!' : 'Please log in to view your test results.'}
              </Text>
              {!user?.studentid && (
                <TouchableOpacity
                  style={globalStyles.button}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={globalStyles.buttonText}>Login</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Action Buttons */}
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => navigation.navigate('TestList')}
          >
            <Text style={globalStyles.buttonText}>
              {route?.params ? 'Take Another Test' : 'Browse Tests'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text style={globalStyles.buttonText}>Back to Dashboard</Text>
          </TouchableOpacity>

          <View style={globalStyles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}