// Test script to verify profile update functionality
import { DatabaseService } from './src/services/database.js';

async function testProfileUpdate() {
  try {
    console.log('🧪 Testing profile update functionality...');
    
    // Test getting user by student ID
    const testStudentId = '12345678'; // Replace with a real student ID from your database
    console.log('📋 Testing getUserByStudentID...');
    const user = await DatabaseService.getUserByStudentID(testStudentId);
    console.log('👤 User found:', user);
    
    if (user) {
      // Test updating user profile
      console.log('📋 Testing updateUserProfile...');
      const updatedData = {
        firstname: 'Updated First',
        lastname: 'Updated Last', 
        fullname: 'Updated First Updated Last'
      };
      
      const result = await DatabaseService.updateUserProfile(testStudentId, updatedData);
      console.log('✅ Profile update result:', result);
      
      // Test password update
      console.log('📋 Testing updateUserPassword...');
      try {
        await DatabaseService.updateUserPassword(testStudentId, 'oldpassword', 'newpassword123');
        console.log('✅ Password update successful');
      } catch (passwordError) {
        console.log('⚠️ Password update failed (expected if old password is wrong):', passwordError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testProfileUpdate();