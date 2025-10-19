// Header.jsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

export default function Header({ navigation, title }) {
  const nav = useNavigation();
  const { isLoggedIn } = useAuth();
  
  const handleOpenDrawer = () => {
    nav.dispatch(DrawerActions.openDrawer());
  };

  const handleProfilePress = () => {
    if (isLoggedIn) {
      // Navigate to AppStack and then to Profile screen
      navigation.navigate('AppStack', { screen: 'Profile' });
    } else {
      // If not logged in, navigate to Login screen
      navigation.navigate('Login');
    }
  };

  return (
    <View style={globalStyles.header}>
      <TouchableOpacity onPress={handleOpenDrawer}>
        <Ionicons name="menu" size={38} color="black" />
      </TouchableOpacity>
      <Text style={globalStyles.headerTitle}>{title}</Text>
      <TouchableOpacity onPress={handleProfilePress}>
        <Ionicons name="person" size={38} color="black" />
      </TouchableOpacity>
    </View>
  );
}