import { supabase } from '../config/supabase';

export class DatabaseService {
  // Get all tests
  static async getAllTests() {
    try {
      console.log('📝 Getting all tests...');
      
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .order('testid', { ascending: true });
      
      if (error) {
        console.error('❌ Error getting tests:', error);
        throw error;
      }
      
      console.log('✅ Tests loaded:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ DatabaseService.getAllTests error:', error);
      throw error;
    }
  }

  // Get test by ID
  static async getTestById(testId) {
    try {
      console.log('🔍 Getting test by ID:', testId);
      
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .eq('testid', testId)
        .single();
      
      if (error) {
        console.error('❌ Error getting test by ID:', error);
        if (error.code === 'PGRST116') {
          return null; // Test not found
        }
        throw error;
      }
      
      console.log('✅ Test found:', data?.testtitle);
      return data;
    } catch (error) {
      console.error('❌ DatabaseService.getTestById error:', error);
      throw error;
    }
  }

  // Get questions for a test - FIXED to use TestQuestions junction table
  static async getQuestionsByTestId(testId) {
    try {
      console.log('❓ Getting questions for test:', testId);
      
      const { data, error } = await supabase
        .from('testquestions')
        .select(`
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
      
      if (error) {
        console.error('❌ Error getting questions:', error);
        throw error;
      }
      
      // Extract questions from junction table result
      const questions = data?.map(item => item.questions).filter(Boolean) || [];
      console.log('✅ Questions loaded:', questions.length);
      return questions;
    } catch (error) {
      console.error('❌ DatabaseService.getQuestionsByTestId error:', error);
      throw error;
    }
  }

  // Get user by StudentID
  static async getUserByStudentID(studentID) {
    try {
      console.log('🔍 Getting user by StudentID:', studentID);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('studentid', parseInt(studentID))
        .single();
      
      if (error) {
        console.error('❌ Error getting user by StudentID:', error);
        if (error.code === 'PGRST116') {
          return null; // User not found
        }
        throw error;
      }
      
      console.log('✅ User found:', data?.username);
      return data;
    } catch (error) {
      console.error('❌ DatabaseService.getUserByStudentID error:', error);
      throw error;
    }
  }

  // Get user by UserName
  static async getUserByUserName(userName) {
    try {
      console.log('🔍 Getting user by UserName:', userName);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', userName)
        .single();
      
      if (error) {
        console.error('❌ Error getting user by UserName:', error);
        if (error.code === 'PGRST116') {
          return null; // User not found
        }
        throw error;
      }
      
      console.log('✅ User found:', data?.username);
      return data;
    } catch (error) {
      console.error('❌ DatabaseService.getUserByUserName error:', error);
      throw error;
    }
  }

  // Get test results for a student - FIXED for integer answers
  static async getTestResultsByStudent(studentID) {
    try {
      console.log('📈 Getting test results for student:', studentID, 'Type:', typeof studentID);
      
      // Get all individual question results for this student
      const { data: individualResults, error } = await supabase
        .from('results')
        .select(`
          resultid,
          studentid,
          testid,
          questionid,
          givenanswer,
          created_at,
          tests (
            testtitle,
            testdescription
          ),
          questions (
            question,
            answer
          )
        `)
        .eq('studentid', parseInt(studentID))
        .order('testid', { ascending: true });
      
      if (error) {
        console.error('❌ Error getting individual results:', error);
        throw error;
      }
      
      console.log('✅ Individual results loaded:', individualResults?.length || 0);
      
      if (!individualResults || individualResults.length === 0) {
        return [];
      }
      
      // Group results by TestID to create test summaries
      const testGroups = {};
      
      individualResults.forEach(result => {
        const testID = result.testid;
        if (!testGroups[testID]) {
          testGroups[testID] = {
            testid: testID,
            tests: result.tests,
            results: [],
            totalQuestions: 0,
            correctAnswers: 0,
            completedDate: new Date(result.created_at) // Use database created_at timestamp
          };
        }
        
        testGroups[testID].results.push(result);
        testGroups[testID].totalQuestions++;
        
        // Update completion date to the latest record's timestamp for this test
        const recordDate = new Date(result.created_at);
        if (recordDate > testGroups[testID].completedDate) {
          testGroups[testID].completedDate = recordDate;
        }
        
        // Compare integer answers - convert both to integers for comparison
        const givenAnswer = parseInt(result.givenanswer);
        const correctAnswer = parseInt(result.questions?.answer);
        
        console.log(`Question ${result.questionid}: Given=${givenAnswer}, Correct=${correctAnswer}, Match=${givenAnswer === correctAnswer}`);
        
        if (givenAnswer === correctAnswer) {
          testGroups[testID].correctAnswers++;
        }
      });
      
      // Convert grouped results to summary format
      const testSummaries = Object.values(testGroups).map(group => ({
        resultid: `test_${group.testid}_${parseInt(studentID)}`,
        testid: group.testid,
        studentid: parseInt(studentID),
        Tests: group.tests,
        Score: Math.round((group.correctAnswers / group.totalQuestions) * 100),
        TotalQuestions: group.totalQuestions,
        CorrectAnswers: group.correctAnswers,
        CompletedAt: group.completedDate.toISOString(),
        TimeSpent: 300,
        Answers: group.results.map(r => ({
          QuestionID: r.questionid,
          GivenAnswer: parseInt(r.givenanswer),
          CorrectAnswer: parseInt(r.questions?.answer)
        }))
      }));
      
      console.log('✅ Test summaries created:', testSummaries.length);
      return testSummaries.sort((a, b) => b.TestID - a.TestID);
      
    } catch (error) {
      console.error('❌ DatabaseService.getTestResultsByStudent error:', error);
      throw error;
    }
  }

  // Submit test results - FIXED for integer answers
  static async submitTestResults(studentID, testID, answers, score, timeSpent) {
    try {
      console.log('📊 Submitting test results...');
      console.log('Parameters:', {
        studentID: studentID,
        studentIDType: typeof studentID,
        testID: testID,
        testIDType: typeof testID,
        answersCount: answers.length,
        score: score,
        timeSpent: timeSpent
      });
      
      console.log('📝 Sample answer object:', answers[0]);
      
      // Convert answers array to individual result records with integer answers
      // Note: ResultID is auto-generated by the database (Identity column)
      // Only answered questions are included (unanswered questions filtered out in TestScreen)
      const resultRecords = answers.map((answer, index) => {
        // Extract the answer and convert to integer
        let givenAnswer;
        
        if (answer.selectedAnswer !== undefined) {
          givenAnswer = parseInt(answer.selectedAnswer);
        } else if (answer.answer !== undefined) {
          givenAnswer = parseInt(answer.answer);
        } else if (answer.GivenAnswer !== undefined) {
          givenAnswer = parseInt(answer.GivenAnswer);
        } else {
          console.error('❌ Invalid answer format:', answer);
          throw new Error('Invalid answer format');
        }
        
        // Validate answer is within expected range (1-4)
        if (givenAnswer < 1 || givenAnswer > 4) {
          console.error('❌ Invalid answer value:', givenAnswer, 'for question:', answer.questionId || answer.QuestionID);
          throw new Error(`Invalid answer value: ${givenAnswer}. Must be between 1-4.`);
        }
        
        const record = {
          // resultid is auto-generated by database (Identity column)
          studentid: parseInt(studentID),
          testid: parseInt(testID),
          questionid: answer.questionId || answer.QuestionID,
          givenanswer: givenAnswer
        };
        
        console.log('📝 Creating record:', record);
        return record;
      });
      
      console.log('📝 Inserting result records:', resultRecords.length);
      console.log('Sample record:', resultRecords[0]);
      console.log('All question IDs being saved:', resultRecords.map(r => r.questionid));
      
      const { data, error } = await supabase
        .from('results')
        .insert(resultRecords)
        .select();
      
      if (error) {
        console.error('❌ Error submitting test results:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw error;
      }
      
      console.log('✅ Test results submitted successfully:', data?.length, 'records');
      return data;
    } catch (error) {
      console.error('❌ DatabaseService.submitTestResults error:', error);
      throw error;
    }
  }

  // Check if student has already taken a test
  static async hasStudentTakenTest(studentID, testID) {
    try {
      console.log('🔍 Checking if student has taken test...', { studentID, testID });
      
      const { data, error } = await supabase
        .from('results')
        .select('resultid')
        .eq('studentid', parseInt(studentID))
        .eq('testid', parseInt(testID))
        .limit(1);
      
      if (error) {
        console.error('❌ Error checking test completion:', error);
        throw error;
      }
      
      const hasTaken = data && data.length > 0;
      console.log('✅ Has taken test:', hasTaken);
      return hasTaken;
    } catch (error) {
      console.error('❌ DatabaseService.hasStudentTakenTest error:', error);
      throw error;
    }
  }

  // Get test completion details for a student - FIXED for integer answers
  static async getTestCompletionDetails(studentID, testID) {
    try {
      console.log('🔍 Getting test completion details...', { studentID, testID });
      
      const { data, error } = await supabase
        .from('results')
        .select(`
          resultid,
          studentid,
          testid,
          questionid,
          givenanswer,
          questions (
            question,
            answer
          )
        `)
        .eq('studentid', parseInt(studentID))
        .eq('testid', parseInt(testID));
      
      if (error) {
        console.error('❌ Error getting test completion details:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        return null;
      }
      
      // Calculate score using integer comparison
      const correctAnswers = data.filter(result => 
        parseInt(result.givenanswer) === parseInt(result.questions?.answer)
      ).length;
      
      const score = Math.round((correctAnswers / data.length) * 100);
      
      return {
        TestID: parseInt(testID),
        StudentID: parseInt(studentID),
        TotalQuestions: data.length,
        CorrectAnswers: correctAnswers,
        Score: score,
        Answers: data.map(r => ({
          QuestionID: r.questionid,
          GivenAnswer: parseInt(r.givenanswer),
          CorrectAnswer: parseInt(r.questions?.answer),
          IsCorrect: parseInt(r.givenanswer) === parseInt(r.questions?.answer)
        }))
      };
      
    } catch (error) {
      console.error('❌ DatabaseService.getTestCompletionDetails error:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(studentID, updates) {
    try {
      console.log('👤 Updating user profile for StudentID:', studentID);
      
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('studentid', parseInt(studentID))
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error updating user profile:', error);
        throw error;
      }
      
      console.log('✅ User profile updated:', data?.username);
      return data;
    } catch (error) {
      console.error('❌ DatabaseService.updateUserProfile error:', error);
      throw error;
    }
  }

  // Debug method to check Results table content - FIXED
  static async debugResultsTable() {
    try {
      console.log('🔍 DEBUG: Checking Results table content...');
      
      const { data, error } = await supabase
        .from('results')
        .select('resultid, studentid, testid, questionid, givenanswer')
        .limit(20);
      
      if (error) {
        console.error('❌ Error debugging Results table:', error);
        throw error;
      }
      
      console.log('📊 DEBUG - Results table data:', data);
      const uniqueStudentIDs = [...new Set(data?.map(r => r.studentid))];
      const uniqueTestIDs = [...new Set(data?.map(r => r.testid))];
      console.log('👥 DEBUG - Unique StudentIDs found:', uniqueStudentIDs);
      console.log('📝 DEBUG - Unique TestIDs found:', uniqueTestIDs);
      
      // Check data types
      if (data && data.length > 0) {
        console.log('🔍 DEBUG - GivenAnswer types:', data.map(r => ({ 
          ResultID: r.resultid,
          GivenAnswer: r.givenanswer, 
          type: typeof r.givenanswer 
        })));
      }
      
      return { data, uniqueStudentIDs, uniqueTestIDs };
    } catch (error) {
      console.error('❌ DatabaseService.debugResultsTable error:', error);
      throw error;
    }
  }

  // Debug method to check Questions table Answer format
  static async debugAnswerFormat() {
    try {
      console.log('🔍 DEBUG: Checking Answer format in Questions table...');
      
      const { data, error } = await supabase
        .from('questions')
        .select('questionid, question, choice1, choice2, choice3, choice4, answer')
        .limit(5);
      
      if (error) {
        console.error('❌ Error getting question data:', error);
        throw error;
      }
      
      console.log('📊 DEBUG - Sample questions and answers:');
      data?.forEach((question, index) => {
        console.log(`Question ${index + 1}:`);
        console.log(`  ID: ${question.questionid}`);
        console.log(`  Question: ${question.question?.substring(0, 50)}...`);
        console.log(`  Choice1: ${question.choice1}`);
        console.log(`  Choice2: ${question.choice2}`);
        console.log(`  Choice3: ${question.choice3}`);
        console.log(`  Choice4: ${question.choice4}`);
        console.log(`  Answer: ${question.answer} (Type: ${typeof question.answer})`);
        console.log('---');
      });
      
      return { data };
      
    } catch (error) {
      console.error('❌ DatabaseService.debugAnswerFormat error:', error);
      throw error;
    }
  }

  // Test Results table access - FIXED
  static async testResultsTableAccess() {
    try {
      console.log('🧪 Testing Results table access...');
      
      const { data: sampleData, error } = await supabase
        .from('results')
        .select('resultid, studentid, testid, questionid, givenanswer')
        .limit(3);
      
      if (error) {
        console.error('❌ Cannot read Results table:', error);
        return { accessible: false, error: error.message };
      }
      
      console.log('✅ Results table accessible. Sample data:', sampleData);
      
      return {
        accessible: true,
        sampleData: true,
        recordCount: sampleData?.length || 0,
        sampleRecords: sampleData
      };
      
    } catch (error) {
      console.error('❌ Results table test failed:', error);
      return { accessible: false, error: error.message };
    }
  }

  // Test database connection - FIXED count syntax
  static async testConnection() {
    try {
      console.log('🔌 Testing database connection...');
      
      // Use a simple select instead of count(*) to avoid PostgREST parsing issues
      const { data, error } = await supabase
        .from('users')
        .select('studentid')
        .limit(1);
      
      if (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
      }
      
      console.log('✅ Database connection successful');
      return true;
    } catch (error) {
      console.error('❌ DatabaseService.testConnection error:', error);
      throw error;
    }
  }

  // Simple query to check if user has any results - for debugging
  static async checkUserResults(studentID) {
    try {
      console.log('🔍 Simple check for user results:', studentID);
      
      const { data, error } = await supabase
        .from('results')
        .select('resultid, testid, questionid, givenanswer')
        .eq('studentid', parseInt(studentID))
        .limit(10);
      
      if (error) {
        console.error('❌ Error in simple check:', error);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Simple check results:', data?.length || 0, 'records found');
      
      // Log data types for debugging
      if (data && data.length > 0) {
        console.log('🔍 Sample result data types:', {
          GivenAnswer: data[0].givenanswer,
          type: typeof data[0].givenanswer
        });
      }
      
      return { success: true, count: data?.length || 0, data };
      
    } catch (error) {
      console.error('❌ Simple check failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Expose supabase instance for direct queries when needed
  static get supabase() {
    return supabase;
  }
}