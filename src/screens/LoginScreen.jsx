import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/global';
import { colors } from '../theme';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const { signIn, loading } = useAuth();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!userName || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const result = await signIn(userName, password);
    
    if (result.success) {
      Alert.alert('Success', 'Logged in successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Dashboard') }
      ]);
    } else {
      Alert.alert('Login Failed', result.error || 'An error occurred during login');
    }
  };

  if (loading) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[globalStyles.text, { marginTop: 20 }]}>Authenticating...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header navigation={navigation} title="Login" />

      <View style={globalStyles.textCard}>
        <Text style={globalStyles.title}>Welcome Back! 👋</Text>
        <Text style={globalStyles.subtitle}>Sign in to access your tests</Text>
      </View>

      <TextInput
        placeholder="Username or student ID"
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

      <TouchableOpacity 
        style={[globalStyles.button, { opacity: loading ? 0.7 : 1 }]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.secondary} />
        ) : (
          <Text style={globalStyles.buttonText}>Log in 🚀</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={globalStyles.linkButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={globalStyles.linkButtonText}>
          Don't have an account? Register here
        </Text>
      </TouchableOpacity>

      <View style={globalStyles.bottomSpacing} />
    </View>
  );
}