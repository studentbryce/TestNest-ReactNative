// Quick test script for edit profile functionality
// Run with: node test-edit-profile.js

import { DatabaseService } from './src/services/database.js';

async function testEditProfile() {
  console.log('🧪 Testing Edit Profile Database Functionality');
  console.log('===============================================');
  
  try {
    // Test 1: Check if updateUserProfile method exists
    console.log('📋 Test 1: Check updateUserProfile method exists');
    console.log('Method exists:', typeof DatabaseService.updateUserProfile === 'function');
    
    // Test 2: Try to get a user (you may need to replace with a real student ID)
    console.log('\n📋 Test 2: Get user by student ID');
    try {
      const testUser = await DatabaseService.getUserByStudentID('12345678');
      console.log('User found:', !!testUser);
      if (testUser) {
        console.log('User data:', {
          firstname: testUser.firstname,
          lastname: testUser.lastname,
          username: testUser.username,
          studentid: testUser.studentid
        });
        
        // Test 3: Try profile update
        console.log('\n📋 Test 3: Try profile update');
        const updateData = {
          firstname: testUser.firstname + '_updated',
          lastname: testUser.lastname + '_updated'
        };
        
        const result = await DatabaseService.updateUserProfile(testUser.studentid, updateData);
        console.log('Update result:', result);
        
        // Test 4: Restore original data
        console.log('\n📋 Test 4: Restore original data');
        const restoreData = {
          firstname: testUser.firstname,
          lastname: testUser.lastname
        };
        
        await DatabaseService.updateUserProfile(testUser.studentid, restoreData);
        console.log('✅ Data restored');
      }
    } catch (userError) {
      console.log('❌ User test failed (might be expected if no user exists):', userError.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testEditProfile();