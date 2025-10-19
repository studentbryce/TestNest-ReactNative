import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/global';
import { colors } from '../theme';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { signUp, loading } = useAuth();
  const [studentID, setStudentID] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!studentID || !firstName || !lastName || !userName || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    // Validate StudentID format
    const id = parseInt(studentID);
    if (isNaN(id) || id < 1000000 || id > 99999999) {
      Alert.alert('Error', 'Student ID must be 7-8 digits');
      return;
    }

    const result = await signUp(studentID, firstName, lastName, userName, password);
    
    if (result.success) {
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } else {
      Alert.alert('Registration Failed', result.error || 'An error occurred during registration');
    }
  };

  if (loading) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[globalStyles.text, { marginTop: 20 }]}>Creating account...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={globalStyles.container}>
        <Header navigation={navigation} title="Register" />
        
        <ScrollView 
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={globalStyles.textCard}>
            <Text style={globalStyles.title}>Join TestNest! 🪺</Text>
            <Text style={globalStyles.subtitle}>Create your account to get started</Text>
          </View>

          <TextInput
            placeholder="Student ID (7-8 digits)"
            placeholderTextColor={colors.placeholderText}
            style={globalStyles.input}
            value={studentID}
            onChangeText={setStudentID}
            keyboardType="numeric"
            maxLength={8}
          />

          <TextInput
            placeholder="First Name"
            placeholderTextColor={colors.placeholderText}
            style={globalStyles.input}
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />

          <TextInput
            placeholder="Last Name"
            placeholderTextColor={colors.placeholderText}
            style={globalStyles.input}
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />

          <TextInput
            placeholder="Username"
            placeholderTextColor={colors.placeholderText}
            style={globalStyles.input}
            value={userName}
            onChangeText={setUserName}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={globalStyles.passwordInputContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.placeholderText}
              style={[globalStyles.input, globalStyles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={globalStyles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor={colors.placeholderText}
            style={globalStyles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />

          <TouchableOpacity 
            style={[globalStyles.button, { opacity: loading ? 0.7 : 1 }]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.secondary} />
            ) : (
              <Text style={globalStyles.buttonText}>Create Account 🚀</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={globalStyles.linkButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={globalStyles.linkButtonText}>
              Already have an account? Login here
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}