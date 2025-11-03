import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/global';
import { colors } from '../theme';
import Header from '../components/Header';
import CircularProgress from '../components/CircularProgress';
import { useAuth } from '../contexts/AuthContext';
import { useTestTimer } from '../contexts/TestTimerContext';
import { DatabaseService } from '../services/database';

export default function TestScreen({ navigation, route }) {
    const { user } = useAuth();
    const { registerTimer, clearTimer, isActiveTest, setActiveTest, clearActiveTest, activeTestId } = useTestTimer();
    const { test } = route?.params || {};
    
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isTimeWarning, setIsTimeWarning] = useState(false);
    const [testStartTime] = useState(Date.now());
    const [timerActive, setTimerActive] = useState(false);

    // Use ref to store timer ID for cleanup
    const timerRef = useRef(null);
    const componentMountedRef = useRef(true);

    const totalTime = test?.timelimit ? test.timelimit * 60 : 600;

    // Calculate remaining time percentage for circular progress
    const timeRemainingPercentage = totalTime > 0 ? (timeRemaining / totalTime) * 100 : 0;

    // Ensure component mounted ref is properly set on mount
    useEffect(() => {
        console.log('🏗️ TestScreen mounting for test:', test?.testid);
        componentMountedRef.current = true;
    }, [test?.testid]);

    // Memoize the handleTimeUp function to prevent unnecessary re-renders
    const handleTimeUp = useCallback(() => {
        console.log('⏰ Time is up! Auto-submitting test...');
        setTimerActive(false);
        
        Alert.alert(
            "Time's Up! ⏰",
            "Your test time has expired. Submitting your current answers.",
            [{ text: "OK", onPress: () => submitTest() }]
        );
    }, []);

    // MAIN TIMER RESET - This is triggered when "Start Test" button is pressed
    useEffect(() => {
        if (test?.testid) {
            console.log('� START TEST BUTTON PRESSED - Resetting everything for test:', test.testid);
            console.log('🔍 Full test object:', test);
            console.log('🔍 Test properties - ID:', test.testid, 'Title:', test.testtitle, 'Time:', test.timelimit);
            
            // IMMEDIATE AND COMPLETE TIMER RESET FOR NEW TEST START
            console.log('🛑 FORCE CLEARING ALL PREVIOUS TESTS AND TIMERS');
            clearActiveTest();
            
            // Clear any existing timer immediately
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
                console.log('✅ Cleared existing timer interval');
            }
            
            // Reset all timer state immediately
            setTimeRemaining(0);
            setTimerActive(false);
            console.log('✅ Reset timer state to 0 and inactive');
            
            // Set this test as the active test
            console.log('🎯 Setting test as active:', test.testid);
            setActiveTest(test.testid);
            
            // Reset all test state including timer
            resetTestState();
            
            // Force reset timer state for new test
            console.log('🔄 Forcing timer reset for new test. Total time should be:', totalTime);
            setTimeRemaining(0); // Start with 0 so initialization effect can catch it
            setTimerActive(false);
            
            // Timer will be initialized by the useEffect once questions load
            
            loadTestQuestions();
        } else {
            console.log('❌ No valid test object found. Test object:', test);
        }

        // Cleanup on unmount
        return () => {
            console.log('🧹 TestScreen unmounting for test:', test?.testid);
            componentMountedRef.current = false;
            
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            
            if (test?.testid && isActiveTest(test.testid)) {
                clearActiveTest();
            }
        };
    }, [test?.testid]); // Removed functions from dependencies

    // Initialize timer once questions are loaded
    useEffect(() => {
        if (questions.length > 0 && componentMountedRef.current && test?.testid && totalTime > 0) {
            console.log('🔄 Initializing timer for new test:', test.testid);
            console.log('� Timer state check:', {
                questionsCount: questions.length,
                timeRemaining,
                timerActive,
                totalTime,
                isActive: isActiveTest(test.testid)
            });
            
            // CRITICAL: Only initialize timer if this test is actually the active test
            if (!isActiveTest(test.testid)) {
                console.log('❌ NOT starting timer - test', test.testid, 'is not active. Active test is:', activeTestId);
                return;
            }
            
            // Initialize and activate timer if needed - PREVENT CONSTANT RESETS
            if ((timeRemaining === 0 || !timerActive) && totalTime > 0) {
                console.log('✅ Initializing/activating timer with total time:', totalTime, 'for active test:', test.testid);
                setTimeRemaining(totalTime);
                setTimerActive(true);
            } else {
                console.log('⏭️ Timer already initialized and active - skipping. Time:', timeRemaining, 'Active:', timerActive);
            }
        }
    }, [questions.length, test?.testid]); // REMOVED problematic dependencies that cause loops

    // Force timer reset ONLY when test ID changes - SIMPLIFIED TO PREVENT LOOPS
    useEffect(() => {
        if (test?.testid && componentMountedRef.current && isActiveTest(test.testid)) {
            console.log('🔄 Test ID changed - checking timer state for:', test.testid);
            
            // Initialize with current time remaining state, but don't auto-start timer
            // Let "Start Test" button be the primary trigger for fresh timer
            if (timeRemaining === 0 && totalTime > 0) {
                console.log('🔥 Setting initial time (inactive) to', totalTime);
                setTimeRemaining(totalTime);
                // Don't auto-activate timer - wait for user to click "Start Test"
            }
        }
    }, [test?.testid]); // ONLY depend on testid to prevent constant re-runs

    // Timer effect with global management - SIMPLIFIED
    useEffect(() => {
        // Don't run if no test ID or component unmounted
        if (!test?.testid || !componentMountedRef.current) {
            return;
        }

        // Check if this is the active test - CRITICAL FOR PREVENTING MULTIPLE TIMERS
        if (!isActiveTest(test.testid)) {
            console.log('⚠️ Timer stopped - test', test.testid, 'is not active. Active test:', activeTestId);
            // Clear timer for inactive test
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
                console.log('🛑 Cleared timer for inactive test:', test.testid);
            }
            return;
        }

        // Clear any existing timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        // Don't start timer if not active or no time remaining
        if (!timerActive || timeRemaining <= 0) {
            if (timeRemaining <= 0 && questions.length > 0 && timerActive) {
                handleTimeUp();
            }
            return;
        }

        // Set warning state when under 2 minutes
        setIsTimeWarning(timeRemaining <= 120);

        console.log('🚀 Starting new timer for test:', test.testid, 'Time remaining:', timeRemaining);
        
        // Start new timer
        timerRef.current = setInterval(() => {
            // Double-check we're still the active test and component is mounted
            if (!componentMountedRef.current || !isActiveTest(test.testid)) {
                console.log('⚠️ Timer stopped - test no longer active or component unmounted');
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
                return;
            }

            setTimeRemaining(prev => {
                const newTime = prev - 1;
                if (newTime <= 0) {
                    setTimerActive(false);
                    return 0;
                }
                return newTime;
            });
        }, 1000);

        // Register this timer globally
        registerTimer(test.testid, timerRef.current);

        // Cleanup function
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [timeRemaining, timerActive, test?.TestID]); // Simplified dependencies

    const resetTestState = () => {
        console.log('🔄 COMPLETE TEST STATE RESET for test:', test?.testid);
        
        // Force clear timer first - CRITICAL
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            console.log('✅ Timer interval forcibly cleared');
        }
        
        // Reset ALL test state
        setQuestions([]);
        setLoading(true);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setAnswers([]);
        setTimeRemaining(0); // RESET TO ZERO - will be set to totalTime when questions load
        setIsTimeWarning(false);
        setTimerActive(false); // TIMER INACTIVE until proper initialization
        
        console.log('✅ COMPLETE test state reset finished for test:', test?.testid);
    };

    const loadTestQuestions = async () => {
        try {
            setLoading(true);
            console.log('🔍 Loading questions for test:', test.testid);

            const testQuestions = await DatabaseService.getQuestionsByTestId(test.testid);

            if (testQuestions && testQuestions.length > 0) {
                console.log('✅ Questions loaded:', testQuestions.length);
                console.log('📝 First question sample:', testQuestions[0]);
                setQuestions(testQuestions);
                setAnswers(new Array(testQuestions.length).fill(null));
            } else {
                console.log('❌ No questions found. Test questions result:', testQuestions);
                throw new Error('No questions found for this test');
            }
        } catch (error) {
            console.error('❌ Error loading test questions:', error);
            Alert.alert(
                'Error Loading Test',
                'Unable to load test questions. Please try again.',
                [{ text: 'Back to Tests', onPress: () => navigation.navigate('TestList') }]
            );
        } finally {
            setLoading(false);
        }
    };

    const submitTest = async () => {
        submitTestWithAnswers(answers);
    };

    const submitTestWithAnswers = async (answersToSubmit) => {
        try {
            console.log('📊 Submitting test results...');
            console.log('📊 Answers being processed:', answersToSubmit);
            console.log('📊 Total questions:', questions.length);
            console.log('📊 Total answers received:', answersToSubmit.length);
            
            // Stop timer immediately
            setTimerActive(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            
            // Clear from global timer manager
            clearActiveTest();
            
            // Calculate score
            let score = 0;
            const submissionAnswers = [];

            answersToSubmit.forEach((selectedAnswer, index) => {
                const question = questions[index];
                if (question) {
                    // Handle both answered and unanswered questions
                    const givenAnswer = selectedAnswer !== null ? selectedAnswer + 1 : 0; // 0 for unanswered
                    const correctAnswer = parseInt(question.answer);
                    
                    // Only count as correct if actually answered correctly
                    if (selectedAnswer !== null && givenAnswer === correctAnswer) {
                        score++;
                    }

                    // Only include answered questions in submission (skip unanswered ones)
                    if (selectedAnswer !== null) {
                        submissionAnswers.push({
                            questionId: question.questionid,
                            selectedAnswer: givenAnswer
                        });
                    }
                }
            });

            const timeUsed = totalTime - timeRemaining;
            
            console.log('📈 Test results:', {
                score,
                total: questions.length,
                timeUsed,
                totalTime,
                answeredQuestions: submissionAnswers.length,
                totalQuestions: questions.length,
                unansweredQuestions: questions.length - submissionAnswers.length
            });
            
            // Debug: Log answered vs unanswered questions
            console.log('✅ Answered questions:', submissionAnswers.map(a => `Q${a.questionId}: ${a.selectedAnswer}`));
            const answeredIds = submissionAnswers.map(a => a.questionId);
            const unansweredIds = questions.filter(q => !answeredIds.includes(q.questionid)).map(q => q.questionid);
            if (unansweredIds.length > 0) {
                console.log('⏭️ Unanswered questions:', unansweredIds);
            }
            console.log('📊 Total questions in test:', questions.length);
            console.log('📊 Questions with answers:', submissionAnswers.length);

            // Reset test state before navigation
            resetTestState();

            // Navigate to results
            navigation.navigate('Results', {
                score,
                total: questions.length,
                timeUsed,
                totalTime,
                testData: { 
                    ...test, 
                    questions: questions  // Include the questions in testData
                },
                answers: submissionAnswers
            });

        } catch (error) {
            console.error('❌ Error submitting test:', error);
            Alert.alert(
                'Submission Error', 
                'There was an error submitting your test. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const handleNext = () => {
        if (selectedOption === null) return;

        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestionIndex] = selectedOption;
        setAnswers(updatedAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(updatedAnswers[currentQuestionIndex + 1] ?? null);
        } else {
            // For the last question, pass the updated answers directly to submitTest
            // to avoid timing issues with setState
            submitTestWithAnswers(updatedAnswers);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setSelectedOption(answers[currentQuestionIndex - 1] ?? null);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle navigation away from test with global timer check
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (timerActive && isActiveTest(test?.testid)) {
                e.preventDefault();

                Alert.alert(
                    'Leave Test?',
                    'Are you sure you want to leave? Your progress will be lost.',
                    [
                        { text: "Don't leave", style: 'cancel' },
                        {
                            text: 'Leave',
                            style: 'destructive',
                            onPress: () => {
                                setTimerActive(false);
                                if (timerRef.current) {
                                    clearInterval(timerRef.current);
                                    timerRef.current = null;
                                }
                                clearActiveTest();
                                resetTestState();
                                navigation.dispatch(e.data.action);
                            },
                        },
                    ]
                );
            }
        });

        return unsubscribe;
    }, [navigation, timerActive, test?.testid]);

    // Debug logging - only when test is active
    if (__DEV__ && test?.testid) {
        console.log('⏱️ Timer Debug:', {
            testId: test.testid,
            activeTest: isActiveTest(test.testid),
            totalTime,
            timeRemaining,
            timerActive,
            componentMounted: componentMountedRef.current,
            questionsLoaded: questions.length
        });
    }

    if (!test) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={globalStyles.container} edges={['bottom']}>
                    <Header navigation={navigation} title="Test" />
                    <View style={globalStyles.textCard}>
                        <Text style={globalStyles.title}>⚠️ No Test Selected</Text>
                        <Text style={globalStyles.text}>Please select a test from the test list.</Text>
                    </View>
                    <TouchableOpacity
                        style={globalStyles.button}
                        onPress={() => navigation.navigate('TestList')}
                    >
                        <Text style={globalStyles.buttonText}>Back to Test List</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    if (loading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={globalStyles.container} edges={['bottom']}>
                    <Header navigation={navigation} title={test.testtitle || 'Test'} />
                    <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={[globalStyles.text, { marginTop: 20 }]}>
                            🔄 Loading test questions...
                        </Text>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    if (questions.length === 0) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={globalStyles.container} edges={['bottom']}>
                    <Header navigation={navigation} title={test.testtitle || 'Test'} />
                    <View style={globalStyles.textCard}>
                        <Text style={globalStyles.title}>❌ No Questions Available</Text>
                        <Text style={globalStyles.text}>This test has no questions available.</Text>
                    </View>
                    <TouchableOpacity
                        style={globalStyles.button}
                        onPress={() => navigation.navigate('TestList')}
                    >
                        <Text style={globalStyles.buttonText}>Back to Test List</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    // Safety check for currentQuestion
    if (!currentQuestion) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={globalStyles.container} edges={['bottom']}>
                    <Header navigation={navigation} title={test?.testtitle || 'Test'} />
                    <View style={globalStyles.textCard}>
                        <Text style={globalStyles.title}>⚠️ Question Not Available</Text>
                        <Text style={globalStyles.text}>Unable to load the current question.</Text>
                    </View>
                    <TouchableOpacity
                        style={globalStyles.button}
                        onPress={() => navigation.navigate('TestList')}
                    >
                        <Text style={globalStyles.buttonText}>Back to Test List</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
            <SafeAreaProvider>
            <SafeAreaView style={globalStyles.container} edges={['bottom']}>
                <View style={styles.mainContainer}>
                    <Header navigation={navigation} title={String(test?.testtitle || 'Test')} />                    <ScrollView 
                        style={styles.scrollContainer}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={true}
                        bounces={false}
                    >
                        {/* Circular Timer Display */}
                        <View style={globalStyles.timerContainer}>
                            <View style={globalStyles.timerWrapper}>
                                <View style={globalStyles.timerCircle}>
                                    <Text style={[
                                        globalStyles.timerText,
                                        { color: isTimeWarning ? '#ff4444' : colors.primary }
                                    ]}>
                                        {formatTime(timeRemaining)}
                                    </Text>
                                    <Text style={globalStyles.timerLabel}>
                                        {isTimeWarning ? '⚠️ TIME!' : 'Time Left'}
                                    </Text>
                                </View>
                                
                                <CircularProgress
                                    size={100}
                                    strokeWidth={8}
                                    progress={timeRemainingPercentage}
                                    backgroundColor="#e0e0e0"
                                    progressColor={colors.primary}
                                    warningColor="#ff4444"
                                />
                            </View>

                            <Text style={globalStyles.questionProgress}>
                                Question {(currentQuestionIndex || 0) + 1} of {questions?.length || 0}
                            </Text>
                        </View>

                        <View style={[globalStyles.questionContainer, styles.questionWrapper]}>
                            <Text style={globalStyles.subtitle}>{currentQuestion?.question || 'Loading question...'}</Text>

                            {[
                                currentQuestion.choice1,
                                currentQuestion.choice2,
                                currentQuestion.choice3,
                                currentQuestion.choice4
                            ].map((choice, index) => {
                                // Skip rendering if choice is null or undefined
                                if (!choice) return null;
                                
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
                                            {String.fromCharCode(65 + index)}: {choice ? String(choice) : 'No text'}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }).filter(Boolean)}
                        </View>
                    </ScrollView>

                    <View style={styles.navigationContainer}>
                        {currentQuestionIndex > 0 && (
                            <TouchableOpacity
                                style={styles.navigationButton}
                                onPress={handlePrevious}
                            >
                                <Text style={styles.navigationButtonText}>← Previous</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.navigationButton,
                                styles.nextButton,
                                {
                                    backgroundColor: selectedOption === null ? '#ccc' : colors.primary,
                                    flex: currentQuestionIndex > 0 ? 1 : 2,
                                }
                            ]}
                            onPress={handleNext}
                            disabled={selectedOption === null}
                        >
                            <Text style={[styles.navigationButtonText, { color: colors.secondary }]}>
                                {(currentQuestionIndex || 0) < (questions?.length || 1) - 1 ? 'Next Question' : 'Submit Test'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = {
    mainContainer: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 10,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20, // Add padding at bottom for better scrolling experience
    },
    questionWrapper: {
        paddingBottom: 20, // Space between questions and navigation
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 15,
        gap: 15, // Add space between buttons
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.accent + '30', // Light border to separate from content
    },
    navigationButton: {
        backgroundColor: colors.accent,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        minHeight: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    nextButton: {
        backgroundColor: colors.primary,
    },
    navigationButtonText: {
        color: colors.text,
        fontSize: 16,
        fontFamily: 'System',
        fontWeight: '600',
        textAlign: 'center',
    },
};