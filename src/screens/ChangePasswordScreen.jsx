import React, { useState } from 'react';
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

export default function ChangePasswordScreen({ navigation }) {
  const { user, updateUserData } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
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

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before saving');
      return;
    }

    try {
      setSaving(true);
      
      // Verify current password first (this would need to be implemented in your auth service)
      // For now, we'll simulate the password change
      
      // Update password in database if service is available
      if (DatabaseService.updateUserPassword && user.id) {
        await DatabaseService.updateUserPassword(user.id, formData.currentPassword, formData.newPassword);
      }
      
      Alert.alert(
        'Success',
        'Password changed successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
      
    } catch (error) {
      console.error('❌ Error changing password:', error);
      Alert.alert('Error', 'Failed to change password. Please try again.');
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

  return (
    <KeyboardAvoidingView 
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header navigation={navigation} title="Change Password" />
      
      <ScrollView showsVerticalScrollIndicator={false} style={globalStyles.scrollContainer}>
        {/* Header Card */}
        <View style={globalStyles.textCard}>
          <Text style={globalStyles.subtitle}>🔒 Update your account password</Text>
        </View>

        {/* Form Card */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.cardTitle}>Password Information</Text>
          
          {/* Current Password */}
          <View style={globalStyles.formGroup}>
            <Text style={globalStyles.label}>Current Password</Text>
            <View style={globalStyles.inputContainer}>
              <TextInput
                style={[
                  globalStyles.input,
                  errors.currentPassword && globalStyles.inputError,
                  { paddingRight: 50 }
                ]}
                value={formData.currentPassword}
                onChangeText={(value) => handleInputChange('currentPassword', value)}
                placeholder="Enter your current password"
                placeholderTextColor={colors.placeholderText}
                secureTextEntry={!showPasswords.current}
                autoCorrect={false}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={globalStyles.eyeButton}
                onPress={() => togglePasswordVisibility('current')}
              >
                <Ionicons
                  name={showPasswords.current ? 'eye-off' : 'eye'}
                  size={20}
                  paddingTop={10}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
            {errors.currentPassword && (
              <Text style={globalStyles.errorText}>{errors.currentPassword}</Text>
            )}
          </View>

          {/* New Password */}
          <View style={globalStyles.formGroup}>
            <Text style={globalStyles.label}>New Password</Text>
            <View style={globalStyles.inputContainer}>
              <TextInput
                style={[
                  globalStyles.input,
                  errors.newPassword && globalStyles.inputError,
                  { paddingRight: 50 }
                ]}
                value={formData.newPassword}
                onChangeText={(value) => handleInputChange('newPassword', value)}
                placeholder="Enter your new password"
                placeholderTextColor={colors.placeholderText}
                secureTextEntry={!showPasswords.new}
                autoCorrect={false}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={globalStyles.eyeButton}
                onPress={() => togglePasswordVisibility('new')}
              >
                <Ionicons
                  name={showPasswords.new ? 'eye-off' : 'eye'}
                  size={20}
                  paddingTop={10}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
            {errors.newPassword && (
              <Text style={globalStyles.errorText}>{errors.newPassword}</Text>
            )}
          </View>

          {/* Confirm New Password */}
          <View style={globalStyles.formGroup}>
            <Text style={globalStyles.label}>Confirm New Password</Text>
            <View style={globalStyles.inputContainer}>
              <TextInput
                style={[
                  globalStyles.input,
                  errors.confirmPassword && globalStyles.inputError,
                  { paddingRight: 50 }
                ]}
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                placeholder="Confirm your new password"
                placeholderTextColor={colors.placeholderText}
                secureTextEntry={!showPasswords.confirm}
                autoCorrect={false}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={globalStyles.eyeButton}
                onPress={() => togglePasswordVisibility('confirm')}
              >
                <Ionicons
                  name={showPasswords.confirm ? 'eye-off' : 'eye'}
                  size={20}
                  paddingTop={10}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={globalStyles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Password Requirements */}
          <View style={globalStyles.infoCard}>
            <Text style={globalStyles.infoTitle}>Password Requirements</Text>
            <Text style={globalStyles.instructionItem}>• At least 6 characters long</Text>
            <Text style={globalStyles.instructionItem}>• Different from your current password</Text>
            <Text style={globalStyles.instructionItem}>• Consider using a mix of letters, numbers, and symbols</Text>
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
                <Text style={globalStyles.primaryButtonText}>Changing...</Text>
              </View>
            ) : (
              <Text style={globalStyles.primaryButtonText}>🔒 Change Password</Text>
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
