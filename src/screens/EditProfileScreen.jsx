// EditProfileScreen.jsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/global';
import { colors } from '../theme';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../services/database';

export default function EditProfileScreen({ navigation }) {
  const { user, updateUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    studentid: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      console.log('📋 Loading user data...');
      console.log('👤 Current user from context:', user);
      
      let userData = user;
      
      // Try to get fresh data from database if available
      if (user?.studentid && DatabaseService.getUserByStudentID) {
        console.log('🔄 Fetching fresh data from database for student:', user.studentid);
        const freshData = await DatabaseService.getUserByStudentID(user.studentid);
        if (freshData) {
          console.log('✅ Fresh data retrieved:', freshData);
          userData = freshData;
        }
      }
      
      const formDataToSet = {
        firstname: userData.firstname || '',
        lastname: userData.lastname || '',
        username: userData.username || '',
        studentid: userData.studentid ? userData.studentid.toString() : ''
      };
      
      console.log('📋 Setting form data to:', formDataToSet);
      setFormData(formDataToSet);
    } catch (error) {
      console.error('❌ Error loading user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    console.log('🔍 Validating form with data:', formData);
    const newErrors = {};
    
    if (!formData.firstname || !formData.firstname.toString().trim()) {
      newErrors.firstname = 'First name is required';
      console.log('❌ First name validation failed');
    }
    
    if (!formData.lastname || !formData.lastname.toString().trim()) {
      newErrors.lastname = 'Last name is required';
      console.log('❌ Last name validation failed');
    }
    
    if (!formData.username || !formData.username.toString().trim()) {
      newErrors.username = 'Username is required';
      console.log('❌ Username validation failed');
    } else if (formData.username.toString().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      console.log('❌ Username too short');
    }
    
    if (!formData.studentid || !formData.studentid.toString().trim()) {
      newErrors.studentid = 'Student ID is required';
      console.log('❌ Student ID validation failed');
    }
    
    console.log('📋 Validation errors:', newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('✅ Form is valid:', isValid);
    return isValid;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleSave = async () => {
    console.log('🔄 Save button pressed!');
    console.log('📋 Current form data:', formData);
    console.log('👤 Current user:', user);
    
    // Check if form data is empty (might indicate loading issue)
    const hasFormData = formData.firstname || formData.lastname || formData.username || formData.studentid;
    if (!hasFormData) {
      console.log('❌ Form data appears to be empty');
      Alert.alert('Error', 'Form data is empty. Please try refreshing the screen.');
      return;
    }
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      Alert.alert('Validation Error', 'Please fix the errors before saving');
      return;
    }

    console.log('✅ Form validation passed');
    try {
      setSaving(true);
      
      const updatedData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        username: formData.username,
        // Don't include fullname as it's not a database column
        // Don't include studentid in updates as it's the identifier
      };
      
      // Update in database using studentid
      if (DatabaseService.updateUserProfile && user.studentid) {
        console.log('🔄 Updating profile in database for student:', user.studentid);
        const dbResult = await DatabaseService.updateUserProfile(user.studentid, updatedData);
        console.log('✅ Database update result:', dbResult);
        
        // Update in auth context (this will also update AsyncStorage)
        // Add fullname for local context (not saved to database)
        if (updateUserData) {
          const contextUpdateData = {
            ...updatedData,
            fullname: `${updatedData.firstname} ${updatedData.lastname}`
          };
          await updateUserData(contextUpdateData);
        }
        
      } else {
        console.error('❌ Missing database service or student ID:', {
          hasService: !!DatabaseService.updateUserProfile,
          studentId: user.studentid
        });
        throw new Error('Unable to update profile - missing service or student ID');
      }
      
      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
      
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Changes',
      'Are you sure you want to cancel? Your changes will be lost.',
      [
        { text: 'Continue Editing', style: 'cancel' },
        { text: 'Discard Changes', onPress: () => navigation.goBack() }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[globalStyles.text, { marginTop: 20 }]}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header navigation={navigation} title="Edit Profile" />
      
      <ScrollView showsVerticalScrollIndicator={false} style={globalStyles.scrollContainer}>
        {/* Header Card */}
        <View style={globalStyles.textCard}>
          <Text style={globalStyles.subtitle}>✏️ Update your personal information</Text>
        </View>

        {/* Form Card */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.cardTitle}>Personal Information</Text>
          
          {/* First Name */}
          <View style={globalStyles.formGroup}>
            <Text style={globalStyles.label}>First Name</Text>
            <View style={globalStyles.inputContainer}>
              <TextInput
                style={[
                  globalStyles.input,
                  errors.firstname && globalStyles.inputError
                ]}
                value={formData.firstname}
                onChangeText={(value) => handleInputChange('firstname', value)}
                placeholder="Enter your first name"
                placeholderTextColor={colors.textSecondary}
                autoCorrect={false}
              />
            </View>
            {errors.firstname && (
              <Text style={globalStyles.errorText}>{errors.firstname}</Text>
            )}
          </View>

          {/* Last Name */}
          <View style={globalStyles.formGroup}>
            <Text style={globalStyles.label}>Last Name</Text>
            <View style={globalStyles.inputContainer}>
              <TextInput
                style={[
                  globalStyles.input,
                  errors.lastname && globalStyles.inputError
                ]}
                value={formData.lastname}
                onChangeText={(value) => handleInputChange('lastname', value)}
                placeholder="Enter your last name"
                placeholderTextColor={colors.textSecondary}
                autoCorrect={false}
              />
            </View>
            {errors.lastname && (
              <Text style={globalStyles.errorText}>{errors.lastname}</Text>
            )}
          </View>

          {/* Username */}
          <View style={globalStyles.formGroup}>
            <Text style={globalStyles.label}>Username</Text>
            <View style={globalStyles.inputContainer}>
              <TextInput
                style={[
                  globalStyles.input,
                  errors.username && globalStyles.inputError
                ]}
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                placeholder="Enter your username"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.username && (
              <Text style={globalStyles.errorText}>{errors.username}</Text>
            )}
          </View>

          {/* Student ID */}
          <View style={globalStyles.formGroup}>
            <Text style={globalStyles.label}>Student ID</Text>
            <View style={globalStyles.inputContainer}>
              <TextInput
                style={[
                  globalStyles.input,
                  errors.studentid && globalStyles.inputError
                ]}
                value={formData.studentid}
                onChangeText={(value) => handleInputChange('studentid', value)}
                placeholder="Enter your student ID"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.studentid && (
              <Text style={globalStyles.errorText}>{errors.studentid}</Text>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={globalStyles.buttonContainer}>
          <TouchableOpacity 
            style={[
              globalStyles.primaryButton,
              saving && globalStyles.buttonDisabled
            ]}
            onPress={() => {
              console.log('🎯 Save button touched!');
              console.log('📋 Form data at button press:', formData);
              console.log('👤 User data at button press:', user);
              console.log('🔍 Save button disabled?', saving);
              
              // Simple test - call handleSave directly
              handleSave();
            }}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <View style={globalStyles.buttonContent}>
                <ActivityIndicator size="small" color={colors.white} style={{ marginRight: 10 }} />
                <Text style={globalStyles.primaryButtonText}>Saving...</Text>
              </View>
            ) : (
              <Text style={globalStyles.primaryButtonText}>💾 Save Changes</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={globalStyles.secondaryButton}
            onPress={handleCancel}
            activeOpacity={0.8}
          >
            <Text style={globalStyles.secondaryButtonText}>❌ Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={globalStyles.bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}