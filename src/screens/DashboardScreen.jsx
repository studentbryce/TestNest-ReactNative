// DashboardScreen.jsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { globalStyles } from '../styles/global';
import { colors } from '../theme';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardScreen({ navigation }) {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            const result = await signOut();
            if (result.success) {
              navigation.navigate('Home');
            } else {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  const navigateToAppStack = (screenName) => {
    navigation.navigate('AppStack', { screen: screenName });
  };

  const menuItems = [
    {
      title: 'My Profile',
      subtitle: 'View and edit your information',
      icon: '👤',
      onPress: () => navigateToAppStack('Profile'),
      color: colors.primary
    },
    {
      title: 'Available Tests',
      subtitle: 'Take new tests and assessments',
      icon: '📝',
      onPress: () => navigateToAppStack('TestList'),
      color: colors.success
    },
    {
      title: 'My Results',
      subtitle: 'View your test scores and history',
      icon: '📊',
      onPress: () => navigateToAppStack('Results'),
      color: colors.warning
    }
  ];

  return (
    <View style={globalStyles.container}>
      <Header 
        navigation={navigation} 
        title="Dashboard" 
        showLogout={true}
        onLogout={handleLogout}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={globalStyles.textCard}>
          <Text style={globalStyles.title}>Welcome back, {user?.firstname || 'Student'}!</Text>
        </View>

        {/* User Info Section */}
        <View style={globalStyles.infoCard}>
          <Text style={globalStyles.infoTitle}>Your Details</Text>
          <View style={globalStyles.infoRow}>
            <Text style={globalStyles.infoLabel}>Student ID:</Text>
            <Text style={globalStyles.infoValue}>{user?.studentid}</Text>
          </View>
          <View style={globalStyles.infoRow}>
            <Text style={globalStyles.infoLabel}>Username:</Text>
            <Text style={globalStyles.infoValue}>{user?.username}</Text>
          </View>
          <View style={globalStyles.infoRow}>
            <Text style={globalStyles.infoLabel}>Full Name:</Text>
            <Text style={globalStyles.infoValue}>{user?.firstname} {user?.lastname}</Text>
          </View>
        </View>

        {/* Quick Actions Menu */}
        <View style={globalStyles.section}>
          <Text style={globalStyles.sectionTitle}>Quick Actions</Text>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[globalStyles.menuCard, { borderLeftColor: item.color }]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={globalStyles.menuIcon}>
                <Text style={globalStyles.menuIconText}>{item.icon}</Text>
              </View>
              <View style={globalStyles.menuContent}>
                <Text style={globalStyles.menuTitle}>{item.title}</Text>
                <Text style={globalStyles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <View style={globalStyles.menuArrow}>
                <Text style={globalStyles.menuArrowText}></Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={globalStyles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}