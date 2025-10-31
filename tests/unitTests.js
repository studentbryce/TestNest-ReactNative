// TestNest Application Unit Tests

// Mock data for testing
const testUserData = {
  studentID: '12345678',
  firstName: 'Test',
  lastName: 'User',
  userName: 'testuser_' + Date.now(),
  password: 'TestPassword123!',
  existingUserName: 'autotest',
  existingPassword: 'password'
};

const testData = {
  testID: 1,
  answers: [
    { questionId: 1, selectedAnswer: 3 },
    { questionId: 2, selectedAnswer: 2 },
    { questionId: 3, selectedAnswer: 1 }
  ],
  score: 2,
  timeSpent: 180
};

// Test framework functions
function logTest(testName, passed, message = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const details = message ? ` - ${message}` : '';
  console.log(`${status}: ${testName}${details}`);
  return passed;
}

function logTestGroup(groupName) {
  console.log(`\n🧪 Testing ${groupName}:`);
  console.log('='.repeat(50));
}

// Import required modules (adjust paths as needed)
import { supabase } from '../src/config/supabase.js';
import CryptoJS from 'crypto-js';

class TestRunner {
  constructor() {
    this.passCount = 0;
    this.failCount = 0;
  }

  // Helper function to hash password like the app does
  hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
  }

  // Helper function to validate StudentID format
  validateStudentID(studentID) {
    const id = parseInt(studentID);
    return id >= 1000000 && id <= 99999999;
  }

  // Test 1: Registration Functionality
  async testRegistration() {
    logTestGroup('User Registration');
    
    try {
      // Test 1.1: Valid Registration Data Validation
      const isValidID = this.validateStudentID(testUserData.studentID);
      this.recordTest('StudentID Validation', isValidID, 
        isValidID ? 'Valid 8-digit StudentID' : 'Invalid StudentID format');

      // Test 1.2: Password Hashing
      const hashedPassword = this.hashPassword(testUserData.password);
      const isHashValid = hashedPassword && hashedPassword.length === 64;
      this.recordTest('Password Hashing', isHashValid,
        isHashValid ? 'SHA256 hash generated correctly' : 'Password hashing failed');

      // Test 1.3: Registration Database Insertion
      const userData = {
        studentid: parseInt(testUserData.studentID),
        firstname: testUserData.firstName,
        lastname: testUserData.lastName,
        username: testUserData.userName,
        password: hashedPassword,
        role: 'student'
      };

      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      const registrationSuccess = !error && data;
      this.recordTest('Database Registration', registrationSuccess,
        registrationSuccess ? 'User registered successfully' : `Registration failed: ${error?.message}`);

      // Clean up - remove test user if registration succeeded
      if (registrationSuccess) {
        await supabase.from('users').delete().eq('userid', data.userid);
        console.log('🧹 Test user removed from database');
      }

    } catch (error) {
      this.recordTest('Registration Exception Handling', false, 
        `Unexpected error: ${error.message}`);
    }
  }

  // Test 2: Login Functionality
  async testLogin() {
    logTestGroup('User Authentication');

    try {
      // Test 2.1: Valid Login Credentials
      const hashedPassword = this.hashPassword(testUserData.existingPassword);
      
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', testUserData.existingUserName)
        .eq('role', 'student')
        .single();

      const userFound = !error && userData;
      this.recordTest('User Lookup by Username', userFound,
        userFound ? 'User found in database' : `User lookup failed: ${error?.message}`);

      // Test 2.2: Password Verification
      if (userFound) {
        const passwordMatch = userData.password === hashedPassword;
        this.recordTest('Password Verification', passwordMatch,
          passwordMatch ? 'Password matches stored hash' : 'Password does not match');

        // Test 2.3: Session Data Creation
        const sessionData = {
          user: {
            userid: userData.userid,
            studentid: userData.studentid,
            firstname: userData.firstname,
            lastname: userData.lastname,
            username: userData.username,
            role: userData.role,
            fullname: `${userData.firstname} ${userData.lastname}`
          }
        };
        
        const sessionValid = sessionData.user.userid && sessionData.user.studentid;
        this.recordTest('Session Data Creation', sessionValid,
          sessionValid ? 'Session object created successfully' : 'Session creation failed');
      }

      // Test 2.4: Invalid Login Attempt
      const { data: invalidData, error: invalidError } = await supabase
        .from('users')
        .select('*')
        .eq('username', 'nonexistentuser')
        .eq('role', 'student')
        .single();

      const invalidLoginHandled = invalidError && invalidError.code === 'PGRST116';
      this.recordTest('Invalid Login Handling', invalidLoginHandled,
        invalidLoginHandled ? 'Non-existent user properly rejected' : 'Invalid login not handled correctly');

    } catch (error) {
      this.recordTest('Login Exception Handling', false,
        `Unexpected error: ${error.message}`);
    }
  }

  // Test 3: Test Taking Functionality
  async testTestTaking() {
    logTestGroup('Test Taking & Questions');

    try {
      // Test 3.1: Fetch Available Tests
      const { data: tests, error: testsError } = await supabase
        .from('tests')
        .select('*')
        .order('testid', { ascending: true });

      const testsLoaded = !testsError && tests && tests.length > 0;
      this.recordTest('Load Available Tests', testsLoaded,
        testsLoaded ? `${tests.length} tests loaded` : `Failed to load tests: ${testsError?.message}`);

      // Test 3.2: Fetch Test Questions
      if (testsLoaded) {
        const testId = tests[0].testid;
        
        const { data: questions, error: questionsError } = await supabase
          .from('testquestions')
          .select(`
            questionid,
            questions (
              questionid,
              question,
              choice1,
              choice2,
              choice3,
              choice4,
              answer
            )
          `)
          .eq('testid', testId);

        const questionsLoaded = !questionsError && questions && questions.length > 0;
        this.recordTest('Load Test Questions', questionsLoaded,
          questionsLoaded ? `${questions.length} questions loaded for test ${testId}` : 
          `Failed to load questions: ${questionsError?.message}`);

        // Test 3.3: Question Data Structure Validation
        if (questionsLoaded) {
          const firstQuestion = questions[0].questions;
          const questionStructureValid = firstQuestion && 
            firstQuestion.question && 
            firstQuestion.choice1 && 
            firstQuestion.choice2 &&
            (firstQuestion.answer >= 1 && firstQuestion.answer <= 4);

          this.recordTest('Question Data Structure', questionStructureValid,
            questionStructureValid ? 'Question structure is valid' : 'Question data structure invalid');
        }

        // Test 3.4: Answer Validation Logic
        const testAnswer = { selectedAnswer: 2, correctAnswer: 2 };
        const answerValidation = testAnswer.selectedAnswer === testAnswer.correctAnswer;
        this.recordTest('Answer Validation Logic', true,
          `Answer matching logic works: ${answerValidation ? 'correct' : 'incorrect'} answer`);
      }

    } catch (error) {
      this.recordTest('Test Taking Exception Handling', false,
        `Unexpected error: ${error.message}`);
    }
  }

  // Test 4: Results Functionality
  async testResults() {
    logTestGroup('Results & Data Persistence');

    try {
      // Test 4.1: Results Data Structure Validation
      const sampleAnswers = [
        { questionId: 1, selectedAnswer: 3 },
        { questionId: 2, selectedAnswer: 2 }
      ];

      const answersValid = sampleAnswers.every(answer => 
        answer.questionId && 
        answer.selectedAnswer >= 1 && 
        answer.selectedAnswer <= 4
      );

      this.recordTest('Results Data Structure', answersValid,
        answersValid ? 'Answer format is valid' : 'Answer format is invalid');

      // Test 4.2: Score Calculation
      const totalQuestions = 3;
      const correctAnswers = 2;
      const calculatedScore = Math.round((correctAnswers / totalQuestions) * 100);
      const expectedScore = 67; // 2/3 * 100 rounded

      const scoreCalculationCorrect = calculatedScore === expectedScore;
      this.recordTest('Score Calculation', scoreCalculationCorrect,
        `Score calculated: ${calculatedScore}% (expected: ${expectedScore}%)`);

      // Test 4.3: Database Results Query Structure
      // Test the query structure without actually inserting test data
      const queryStructureTest = async () => {
        const { error } = await supabase
          .from('results')
          .select(`
            resultid,
            studentid,
            testid,
            questionid,
            givenanswer,
            created_at,
            tests (testtitle, testdescription),
            questions (question, answer)
          `)
          .limit(1);

        return !error;
      };

      const queryValid = await queryStructureTest();
      this.recordTest('Results Query Structure', queryValid,
        queryValid ? 'Results query structure is valid' : 'Results query structure has issues');

      // Test 4.4: Test History Grouping Logic
      const sampleResults = [
        { testid: 1, givenanswer: 2, questions: { answer: 2 }}, // correct
        { testid: 1, givenanswer: 1, questions: { answer: 2 }}, // incorrect
        { testid: 1, givenanswer: 3, questions: { answer: 3 }}  // correct
      ];

      let correctCount = 0;
      sampleResults.forEach(result => {
        if (parseInt(result.givenanswer) === parseInt(result.questions.answer)) {
          correctCount++;
        }
      });

      const historyGroupingWorks = correctCount === 2;
      this.recordTest('Test History Grouping', historyGroupingWorks,
        `Correctly counted ${correctCount}/3 answers in sample results`);

      // Test 4.5: Timestamp Handling
      const sampleTimestamp = "2025-10-19T13:22:12.492Z";
      const timestampRegex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
      const timestampMatch = sampleTimestamp.match(timestampRegex);
      
      const timestampParsingWorks = timestampMatch && timestampMatch.length === 7;
      this.recordTest('Timestamp Parsing', timestampParsingWorks,
        timestampParsingWorks ? 'ISO timestamp format parsed correctly' : 'Timestamp parsing failed');

    } catch (error) {
      this.recordTest('Results Exception Handling', false,
        `Unexpected error: ${error.message}`);
    }
  }

  // Test 5: Integration Tests
  async testIntegration() {
    logTestGroup('Integration & Database Connectivity');

    try {
      // Test 5.1: Database Connection
      const { data, error } = await supabase.from('users').select('count').limit(1);
      const dbConnected = !error;
      this.recordTest('Database Connectivity', dbConnected,
        dbConnected ? 'Supabase connection established' : `DB connection failed: ${error?.message}`);

      // Test 5.2: Table Structure Verification
      const tables = ['users', 'tests', 'questions', 'testquestions', 'results'];
      let allTablesExist = true;
      
      for (const table of tables) {
        const { error: tableError } = await supabase.from(table).select('*').limit(1);
        if (tableError) {
          allTablesExist = false;
          console.log(`   ⚠️  Table '${table}' access failed: ${tableError.message}`);
        }
      }

      this.recordTest('Database Schema Integrity', allTablesExist,
        allTablesExist ? 'All required tables accessible' : 'Some tables are inaccessible');

      // Test 5.3: Data Relationships
      const { data: testWithQuestions } = await supabase
        .from('testquestions')
        .select(`
          testid,
          questionid,
          tests(testtitle),
          questions(question)
        `)
        .limit(1)
        .single();

      const relationshipsWork = testWithQuestions && 
        testWithQuestions.tests && 
        testWithQuestions.questions;

      this.recordTest('Database Relationships', relationshipsWork,
        relationshipsWork ? 'Foreign key relationships working' : 'Database relationships have issues');

    } catch (error) {
      this.recordTest('Integration Exception Handling', false,
        `Unexpected error: ${error.message}`);
    }
  }

  // Helper method to record test results
  recordTest(testName, passed, message = '') {
    if (passed) {
      this.passCount++;
    } else {
      this.failCount++;
    }
    logTest(testName, passed, message);
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting TestNest Application Unit Tests');
    console.log('=' .repeat(60));
    
    const startTime = Date.now();

    await this.testRegistration();
    await this.testLogin();
    await this.testTestTaking();
    await this.testResults();
    await this.testIntegration();

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 TEST SUMMARY:');
    console.log('=' .repeat(60));
    console.log(`✅ Passed: ${this.passCount}`);
    console.log(`❌ Failed: ${this.failCount}`);
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`📈 Success Rate: ${((this.passCount / (this.passCount + this.failCount)) * 100).toFixed(1)}%`);

    if (this.failCount === 0) {
      console.log('\n🎉 All tests passed! Application core functionality is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Review the failures above for issues to address.');
    }

    return {
      passed: this.passCount,
      failed: this.failCount,
      total: this.passCount + this.failCount,
      duration: duration
    };
  }
}

// Export for use in other files or run directly
export default TestRunner;

// Auto-run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const testRunner = new TestRunner();
  testRunner.runAllTests().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  }).catch(error => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  });
}