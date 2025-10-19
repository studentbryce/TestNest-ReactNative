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
      
      let userData = user;
      
      // Try to get fresh data from database if available
      if (user?.studentid && DatabaseService.getUserByStudentID) {
        const freshData = await DatabaseService.getUserByStudentID(user.studentid);
        if (freshData) {
          userData = freshData;
        }
      }
      
      setFormData({
        firstname: userData.firstname || '',
        lastname: userData.lastname || '',
        username: userData.username || '',
        studentid: userData.studentid || ''
      });
    } catch (error) {
      console.error('❌ Error loading user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First name is required';
    }
    
    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.studentid.trim()) {
      newErrors.studentid = 'Student ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before saving');
      return;
    }

    try {
      setSaving(true);
      
      const updatedData = {
        ...formData,
        fullname: `${formData.firstname} ${formData.lastname}`
      };
      
      // Update in database if service is available
      if (DatabaseService.updateUser && user.id) {
        await DatabaseService.updateUser(user.id, updatedData);
      }
      
      // Update in auth context
      if (updateUserData) {
        await updateUserData(updatedData);
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
            onPress={handleSave}
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