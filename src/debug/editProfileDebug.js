// Debug helper to test edit profile functionality
// This can be imported in EditProfileScreen for debugging

export const debugEditProfile = {
  testButtonPress: () => {
    console.log('🧪 Button press test');
    alert('Button is working!');
  },
  
  testFormData: (formData) => {
    console.log('🧪 Form data test:', formData);
    const isEmpty = !formData.firstname && !formData.lastname && !formData.username && !formData.studentid;
    alert(`Form data empty: ${isEmpty}\nData: ${JSON.stringify(formData)}`);
  },
  
  testUserData: (user) => {
    console.log('🧪 User data test:', user);
    alert(`User exists: ${!!user}\nStudent ID: ${user?.studentid}`);
  },
  
  testDatabaseService: async () => {
    console.log('🧪 Database service test');
    try {
      const hasUpdateMethod = typeof DatabaseService.updateUserProfile === 'function';
      alert(`Database service available: ${hasUpdateMethod}`);
    } catch (error) {
      alert(`Database error: ${error.message}`);
    }
  },
  
  simpleProfileUpdate: async (studentId, updateData) => {
    try {
      console.log('🧪 Simple profile update test');
      const result = await DatabaseService.updateUserProfile(studentId, updateData);
      alert(`Update successful: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      console.error('🧪 Update failed:', error);
      alert(`Update failed: ${error.message}`);
      throw error;
    }
  }
};

// Test validation function
export const testValidation = (formData) => {
  const errors = {};
  
  if (!formData.firstname?.trim()) {
    errors.firstname = 'First name required';
  }
  
  if (!formData.lastname?.trim()) {
    errors.lastname = 'Last name required';
  }
  
  if (!formData.username?.trim()) {
    errors.username = 'Username required';
  }
  
  if (!formData.studentid?.trim()) {
    errors.studentid = 'Student ID required';
  }
  
  console.log('🧪 Validation test:', { formData, errors });
  alert(`Validation errors: ${JSON.stringify(errors, null, 2)}`);
  
  return Object.keys(errors).length === 0;
};