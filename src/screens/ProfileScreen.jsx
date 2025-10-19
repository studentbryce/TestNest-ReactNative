// ProfileScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/global';
import { colors } from '../theme';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../services/database';

export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 User object from context:', user);
      
      // Check if user exists and has database methods available
      if (user?.studentid && DatabaseService.getUserByStudentID) {
        console.log('📱 Loading fresh user data from database...');
        const userData = await DatabaseService.getUserByStudentID(user.studentid);
        if (userData) {
          // Add computed full name if not present
          const enhancedUserData = {
            ...userData,
            fullname: userData.fullname || `${userData.firstname} ${userData.lastname}`
          };
          setUserDetails(enhancedUserData);
          console.log('✅ Profile loaded from database:', enhancedUserData);
        } else {
          console.log('⚠️ User not found in database, using context data');
          setUserDetails(user);
        }
      } else {
        console.log('📱 Using context user data');
        // Fallback to context user data with computed full name
        const enhancedUser = {
          ...user,
          fullname: user.fullname || `${user.firstname} ${user.lastname}`
        };
        setUserDetails(enhancedUser);
        console.log('📱 Using enhanced context user data:', enhancedUser);
      }
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      Alert.alert('Error', 'Failed to load profile data. Using cached information.');
      // Fallback to context user data
      const enhancedUser = {
        ...user,
        fullname: user.fullname || `${user.firstname} ${user.lastname}`
      };
      setUserDetails(enhancedUser);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            console.log('🚪 Logging out user...');
            try {
              // Clear any stored authentication data
              const result = await signOut();
              if (result.success) {
                // Clear user details from local state
                setUserDetails(null);
                // Navigate to Home screen
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                });
              } else {
                Alert.alert('Error', 'Failed to logout');
              }
            } catch (error) {
              console.error('❌ Logout error:', error);
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
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

  if (!userDetails) {
    return (
      <View style={globalStyles.container}>
        <Header navigation={navigation} title="Profile" />
        <View style={globalStyles.textCard}>
          <Text style={globalStyles.title}>Error Loading Profile</Text>
          <Text style={globalStyles.subtitle}>Unable to load user profile data.</Text>
          <Text style={globalStyles.text}>Debug: User from context: {JSON.stringify(user)}</Text>
          <TouchableOpacity style={globalStyles.button} onPress={loadUserProfile}>
            <Text style={globalStyles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const displayPassword = showPassword ? '••••••••' : '••••••••'; // Don't show actual password for security

  return (
    <View style={globalStyles.container}>
      <Header navigation={navigation} title="My Profile" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={globalStyles.textCard}>
          <Text style={globalStyles.title}>👤 Profile Information</Text>
          <Text style={globalStyles.subtitle}>
            Welcome, {userDetails.firstname}!
          </Text>
        </View>

        {/* User Details Card */}
        <View style={globalStyles.infoCard}>
          <Text style={globalStyles.infoTitle}>Account Details</Text>
          
          <View style={globalStyles.infoRow}>
            <Text style={globalStyles.infoLabel}>Student ID:</Text>
            <Text style={globalStyles.infoValue}>{userDetails.studentid}</Text>
          </View>
          
          <View style={globalStyles.infoRow}>
            <Text style={globalStyles.infoLabel}>Username:</Text>
            <Text style={globalStyles.infoValue}>{userDetails.username}</Text>
          </View>
          
          <View style={globalStyles.infoRow}>
            <Text style={globalStyles.infoLabel}>Full Name:</Text>
            <Text style={globalStyles.infoValue}>{userDetails.fullname}</Text>
          </View>
          
          {/* Password field with eye toggle */}
          <View style={globalStyles.infoRow}>
            <Text style={globalStyles.infoLabel}>Password:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={globalStyles.infoValue}>{displayPassword}</Text>
              <TouchableOpacity onPress={togglePasswordVisibility} style={{ marginLeft: 10 }}>
                <Ionicons 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={16} 
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={globalStyles.section}>
          <Text style={globalStyles.sectionTitle}>Account Actions</Text>
          
          <TouchableOpacity 
            style={[globalStyles.menuCard, { borderLeftColor: colors.primary }]} 
            onPress={handleEditProfile}
            activeOpacity={0.7}
          >
            <View style={globalStyles.menuIcon}>
              <Text style={globalStyles.menuIconText}>✏️</Text>
            </View>
            <View style={globalStyles.menuContent}>
              <Text style={globalStyles.menuTitle}>Edit Profile</Text>
              <Text style={globalStyles.menuSubtitle}>Update your personal information</Text>
            </View>
            <View style={globalStyles.menuArrow}>
              <Text style={globalStyles.menuArrowText}>→</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[globalStyles.menuCard, { borderLeftColor: colors.warning }]} 
            onPress={handleChangePassword}
            activeOpacity={0.7}
          >
            <View style={globalStyles.menuIcon}>
              <Text style={globalStyles.menuIconText}>🔒</Text>
            </View>
            <View style={globalStyles.menuContent}>
              <Text style={globalStyles.menuTitle}>Change Password</Text>
              <Text style={globalStyles.menuSubtitle}>Update your account password</Text>
            </View>
            <View style={globalStyles.menuArrow}>
              <Text style={globalStyles.menuArrowText}>→</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[globalStyles.menuCard, { borderLeftColor: colors.success }]} 
            onPress={() => navigation.navigate('Dashboard')}
            activeOpacity={0.7}
          >
            <View style={globalStyles.menuIcon}>
              <Text style={globalStyles.menuIconText}>🏠</Text>
            </View>
            <View style={globalStyles.menuContent}>
              <Text style={globalStyles.menuTitle}>Back to Dashboard</Text>
              <Text style={globalStyles.menuSubtitle}>Return to main dashboard</Text>
            </View>
            <View style={globalStyles.menuArrow}>
              <Text style={globalStyles.menuArrowText}>→</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[globalStyles.menuCard, { borderLeftColor: colors.error }]} 
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={globalStyles.menuIcon}>
              <Text style={globalStyles.menuIconText}>🚪</Text>
            </View>
            <View style={globalStyles.menuContent}>
              <Text style={globalStyles.menuTitle}>Logout</Text>
              <Text style={globalStyles.menuSubtitle}>Sign out of your account</Text>
            </View>
            <View style={globalStyles.menuArrow}>
              <Text style={globalStyles.menuArrowText}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={globalStyles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}