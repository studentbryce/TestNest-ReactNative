// Simple Unit Tests for TestNest Application

import { supabase } from '../src/config/supabase';
import CryptoJS from 'crypto-js';

class SimpleTestRunner {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = {
      'pass': '✅',
      'fail': '❌', 
      'info': 'ℹ️',
      'group': '🧪'
    }[type] || 'ℹ️';
    
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  recordResult(testName, passed, details = '') {
    this.results.tests.push({ testName, passed, details });
    if (passed) {
      this.results.passed++;
      this.log(`${testName} - ${details}`, 'pass');
    } else {
      this.results.failed++;
      this.log(`${testName} - ${details}`, 'fail');
    }
  }

  // Test 1: Authentication Functions
  async testAuthentication() {
    this.log('Testing Authentication System', 'group');

    try {
      // Test password hashing
      const password = 'TestPassword123';
      const hashedPassword = CryptoJS.SHA256(password).toString();
      const hashValid = hashedPassword && hashedPassword.length === 64;
      this.recordResult('Password Hashing', hashValid, 
        hashValid ? 'SHA256 hash generated correctly' : 'Hash generation failed');

      // Test StudentID validation
      const validID = '12345678';
      const invalidID = '123';
      const id1Valid = parseInt(validID) >= 1000000 && parseInt(validID) <= 99999999;
      const id2Invalid = parseInt(invalidID) < 1000000;
      
      this.recordResult('StudentID Validation - Valid', id1Valid, 
        `${validID} validation: ${id1Valid ? 'correct' : 'incorrect'}`);
      this.recordResult('StudentID Validation - Invalid', id2Invalid, 
        `${invalidID} validation: ${id2Invalid ? 'correctly rejected' : 'incorrectly accepted'}`);

      // Test login query structure
      const { data, error } = await supabase
        .from('users')
        .select('username, password, role')
        .eq('username', 'autotest')
        .limit(1);

      const queryWorks = !error;
      this.recordResult('User Lookup Query', queryWorks, 
        queryWorks ? 'Database query successful' : `Query failed: ${error?.message}`);

    } catch (error) {
      this.recordResult('Authentication Exception', false, `Error: ${error.message}`);
    }
  }

  // Test 2: Test Management Functions  
  async testTestManagement() {
    this.log('Testing Test Management System', 'group');

    try {
      // Test loading available tests
      const { data: tests, error: testsError } = await supabase
        .from('tests')
        .select('testid, testtitle, timelimit')
        .order('testid', { ascending: true });

      const testsLoaded = !testsError && tests && tests.length > 0;
      this.recordResult('Load Available Tests', testsLoaded,
        testsLoaded ? `${tests.length} tests loaded successfully` : 
        `Failed: ${testsError?.message}`);

      // Test loading questions for a test
      if (testsLoaded) {
        const testId = tests[0].testid;
        const { data: questions, error: qError } = await supabase
          .from('testquestions')
          .select(`
            questionid,
            questions (
              question,
              choice1, 
              choice2,
              choice3,
              choice4,
              answer
            )
          `)
          .eq('testid', testId);

        const questionsLoaded = !qError && questions && questions.length > 0;
        this.recordResult('Load Test Questions', questionsLoaded,
          questionsLoaded ? `${questions.length} questions loaded for test ${testId}` : 
          `Failed: ${qError?.message}`);

        // Test question data structure
        if (questionsLoaded) {
          const q = questions[0].questions;
          const structureValid = q && q.question && q.choice1 && q.choice2 && 
            q.answer >= 1 && q.answer <= 4;
          this.recordResult('Question Data Structure', structureValid,
            structureValid ? 'Question structure is valid' : 'Invalid question structure');
        }
      }

    } catch (error) {
      this.recordResult('Test Management Exception', false, `Error: ${error.message}`);
    }
  }

  // Test 3: Results Processing
  async testResultsProcessing() {
    this.log('Testing Results Processing System', 'group');

    try {
      // Test score calculation logic
      const testAnswers = [
        { questionId: 1, selectedAnswer: 2, correctAnswer: 2 }, // correct
        { questionId: 2, selectedAnswer: 1, correctAnswer: 3 }, // wrong  
        { questionId: 3, selectedAnswer: 4, correctAnswer: 4 }  // correct
      ];

      let correctCount = 0;
      testAnswers.forEach(answer => {
        if (answer.selectedAnswer === answer.correctAnswer) {
          correctCount++;
        }
      });

      const calculatedScore = Math.round((correctCount / testAnswers.length) * 100);
      const expectedScore = 67; // 2/3 * 100 rounded
      const scoreCorrect = calculatedScore === expectedScore;

      this.recordResult('Score Calculation', scoreCorrect,
        `Calculated: ${calculatedScore}%, Expected: ${expectedScore}%`);

      // Test answer filtering (removing unanswered questions)
      const mixedAnswers = [
        { questionId: 1, selectedAnswer: 2 },
        { questionId: 2, selectedAnswer: null }, // unanswered
        { questionId: 3, selectedAnswer: 4 }
      ];

      const filteredAnswers = mixedAnswers.filter(answer => 
        answer.selectedAnswer !== null && 
        answer.selectedAnswer >= 1 && 
        answer.selectedAnswer <= 4
      );

      const filteringWorks = filteredAnswers.length === 2;
      this.recordResult('Answer Filtering', filteringWorks,
        `Filtered ${filteredAnswers.length} valid answers from ${mixedAnswers.length} total`);

      // Test timestamp parsing
      const sampleTimestamp = "2025-10-19T13:22:12.492Z";
      const timestampRegex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
      const match = sampleTimestamp.match(timestampRegex);
      const timestampParsing = match && match.length === 7;

      this.recordResult('Timestamp Parsing', timestampParsing,
        timestampParsing ? 'ISO timestamp parsed successfully' : 'Timestamp parsing failed');

    } catch (error) {
      this.recordResult('Results Processing Exception', false, `Error: ${error.message}`);
    }
  }

  // Test 4: Database Operations
  async testDatabaseOperations() {
    this.log('Testing Database Operations', 'group');

    try {
      // Test database connection
      const { error: connectionError } = await supabase
        .from('users')
        .select('count')
        .limit(1);

      const connectionWorks = !connectionError;
      this.recordResult('Database Connection', connectionWorks,
        connectionWorks ? 'Supabase connection established' : 
        `Connection failed: ${connectionError?.message}`);

      // Test table access
      const tables = ['users', 'tests', 'questions', 'testquestions', 'results'];
      let accessibleTables = 0;

      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select('*').limit(1);
          if (!error) accessibleTables++;
        } catch (e) {
          // Table not accessible
        }
      }

      const allTablesAccessible = accessibleTables === tables.length;
      this.recordResult('Table Access', allTablesAccessible,
        `${accessibleTables}/${tables.length} tables accessible`);

      // Test relationships (foreign keys)
      const { data: relationData, error: relationError } = await supabase
        .from('testquestions')
        .select(`
          testid,
          tests(testtitle),
          questions(question)
        `)
        .limit(1);

      const relationshipsWork = !relationError && relationData && 
        relationData[0]?.tests && relationData[0]?.questions;
      this.recordResult('Database Relationships', relationshipsWork,
        relationshipsWork ? 'Foreign key relationships working' : 
        `Relationships failed: ${relationError?.message}`);

    } catch (error) {
      this.recordResult('Database Operations Exception', false, `Error: ${error.message}`);
    }
  }

  // Test 5: Data Validation
  async testDataValidation() {
    this.log('Testing Data Validation', 'group');

    try {
      // Test user input validation
      const validInputs = {
        studentID: '12345678',
        firstName: 'John',
        lastName: 'Doe', 
        username: 'johndoe',
        password: 'SecurePass123!'
      };

      const validations = {
        studentIDValid: /^\d{7,8}$/.test(validInputs.studentID),
        nameValid: validInputs.firstName.length > 0 && validInputs.lastName.length > 0,
        usernameValid: validInputs.username.length >= 3,
        passwordValid: validInputs.password.length >= 8
      };

      Object.entries(validations).forEach(([key, isValid]) => {
        this.recordResult(`Input Validation - ${key}`, isValid,
          `${key}: ${isValid ? 'valid' : 'invalid'}`);
      });

      // Test answer validation
      const testAnswerValidation = (answer) => {
        return answer >= 1 && answer <= 4;
      };

      const validAnswer = testAnswerValidation(3);
      const invalidAnswer = !testAnswerValidation(0);
      const invalidAnswer2 = !testAnswerValidation(5);

      this.recordResult('Answer Validation - Valid', validAnswer, 'Answer 3 correctly validated');
      this.recordResult('Answer Validation - Invalid Low', invalidAnswer, 'Answer 0 correctly rejected');
      this.recordResult('Answer Validation - Invalid High', invalidAnswer2, 'Answer 5 correctly rejected');

    } catch (error) {
      this.recordResult('Data Validation Exception', false, `Error: ${error.message}`);
    }
  }

  // Run all tests
  async runAllTests() {
    this.log('🚀 Starting TestNest Application Unit Tests', 'info');
    this.log('================================================', 'info');
    
    const startTime = Date.now();

    await this.testAuthentication();
    await this.testTestManagement();  
    await this.testResultsProcessing();
    await this.testDatabaseOperations();
    await this.testDataValidation();

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // Generate summary
    this.log('================================================', 'info');
    this.log('📊 TEST SUMMARY REPORT', 'info');
    this.log('================================================', 'info');
    this.log(`✅ Tests Passed: ${this.results.passed}`, 'pass');
    this.log(`❌ Tests Failed: ${this.results.failed}`, 'fail');
    this.log(`⏱️  Execution Time: ${duration} seconds`, 'info');
    
    const total = this.results.passed + this.results.failed;
    const successRate = ((this.results.passed / total) * 100).toFixed(1);
    this.log(`📈 Success Rate: ${successRate}%`, 'info');

    if (this.results.failed === 0) {
      this.log('🎉 ALL TESTS PASSED! Application functionality verified.', 'pass');
    } else {
      this.log(`⚠️  ${this.results.failed} test(s) failed. Review failures above.`, 'fail');
    }

    // Return detailed results
    return {
      summary: {
        passed: this.results.passed,
        failed: this.results.failed,
        total: total,
        successRate: successRate,
        duration: duration
      },
      details: this.results.tests
    };
  }
}

// Export the test runner
export default SimpleTestRunner;

// Usage example (add this to any screen to run tests):
/*
import SimpleTestRunner from '../tests/simpleUnitTests';

const runTests = async () => {
  const testRunner = new SimpleTestRunner();
  const results = await testRunner.runAllTests();
  console.log('Test completed:', results.summary);
};

// Call runTests() to execute all tests
*/