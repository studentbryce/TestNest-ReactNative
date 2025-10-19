import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/global';
import { colors } from '../theme';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../services/database';

export default function TestListScreen({ navigation }) {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading tests from database...');
      const availableTests = await DatabaseService.getAllTests();
      console.log('✅ Tests loaded:', availableTests);
      console.log('📊 Number of tests:', availableTests?.length || 0);
      setTests(availableTests);
    } catch (error) {
      console.error('❌ Error loading tests:', error);
      Alert.alert('Error', 'Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTests();
    setRefreshing(false);
  };

  const startTest = (test) => {
    Alert.alert(
      `Start Test`,
      `Are you ready to start "${test.testtitle}"?\n\n` +
      `📝 Description: ${test.testdescription}\n\n` +
      `⏰ Time Limit: ${test.timelimit} minutes\n\n` +
      `🔗 Make sure you have a stable internet connection and won't be interrupted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `🚀 Start Test`,
          style: 'default',
          onPress: () => navigation.navigate('TestScreen', { test })
        }
      ]
    );
  };

  const getTestDifficulty = (timeLimit) => {
    if (timeLimit <= 30) return { label: '⚡ Quick', color: colors.success };
    if (timeLimit <= 60) return { label: '🎯 Standard', color: colors.warning || '#FF9800' };
    return { label: '🔥 Extended', color: colors.error };
  };

  if (loading) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[globalStyles.text, { marginTop: 20 }]}>🔄 Loading available tests...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={globalStyles.container} edges={['bottom']}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <Header navigation={navigation} title="Available Tests" />

          {/* Header Section */}
          <View style={globalStyles.textCard}>
            <Text style={globalStyles.title}>Choose Your Test 🎯</Text>
            <Text style={globalStyles.subtitle}>
              Select a test below
            </Text>
          </View>

          {/* Instructions Card */}
          <View style={globalStyles.instructionsCard}>
            <Text style={globalStyles.instructionsTitle}>📖 Test Instructions 🎯</Text>
            <View style={globalStyles.instructionsList}>
              <Text style={globalStyles.instructionItem}>🧠 • Read each question carefully</Text>
              <Text style={globalStyles.instructionItem}>🔄 • You can navigate between questions</Text>
              <Text style={globalStyles.instructionItem}>⏰ • Submit before time runs out</Text>
              <Text style={globalStyles.instructionItem}>🔗 • Ensure stable internet connection</Text>
              <Text style={globalStyles.instructionItem}>💪 • Stay focused and do your best!</Text>
            </View>
          </View>

          {/* Tests List */}
          <View style={globalStyles.section}>
            
            {!tests || tests.length === 0 ? (
              <View style={globalStyles.emptyState}>
                <Text style={globalStyles.emptyStateIcon}>📚</Text>
                <Text style={globalStyles.emptyStateTitle}>🤔 No Tests Available</Text>
                <Text style={globalStyles.emptyStateText}>
                  🔍 There are no tests available at the moment. Please check back later or contact your instructor! 📞
                </Text>
                <Text style={[globalStyles.emptyStateText, { fontSize: 12, marginTop: 10 }]}>
                  Debug: Tests array: {JSON.stringify(tests)}
                </Text>
              </View>
            ) : (
              tests.map((test) => {
                const difficulty = getTestDifficulty(test.timelimit);
                return (
                  <View
                    key={test.testid}
                    style={globalStyles.testCard}
                  >
                    {/* Test Header */}
                    <View style={globalStyles.testCardHeader}>
                      <View style={globalStyles.testTitleContainer}>
                        <Text style={globalStyles.testIcon}></Text>
                        <Text style={globalStyles.testTitle}>{test.testtitle}</Text>
                      </View>
                      <View style={[globalStyles.testTimeBadge, { backgroundColor: difficulty.color }]}>
                        <Text style={globalStyles.testTimeBadgeText}>
                          ⏱️ {test.timelimit}min
                        </Text>
                      </View>
                    </View>

                    {/* Test Description */}
                    <Text style={globalStyles.testDescription}>
                      📖 {test.testdescription || 'No description available'}
                    </Text>

                    {/* Test Footer */}
                    <View style={globalStyles.testCardFooter}>
                      <Text style={globalStyles.testType}>🔘 Multiple Choice</Text>
                      <TouchableOpacity
                        style={globalStyles.startTestButton}
                        onPress={() => startTest(test)}
                        activeOpacity={0.8}
                      >
                        <Text style={globalStyles.startTestButtonText}>🚀 Start Test</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          <View style={globalStyles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}