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

  const grade = getGradeLevel();

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

              {/* Score Display */}
              <View style={globalStyles.textCard}>
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
              </View>

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
              {previousResults.map((result, index) => (
                <View key={result.ResultID || index} style={globalStyles.menuCard}>
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
                      Score: {result.Score || 0}% • {formatDate(result.CompletedAt)}
                    </Text>
                    <Text style={[globalStyles.menuSubtitle, { fontSize: 12 }]}>
                      Questions: {result.TotalQuestions || 0} • Correct: {result.CorrectAnswers || 0}
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
                </View>
              ))}

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