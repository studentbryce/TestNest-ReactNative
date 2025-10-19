// src/navigation/RootNavigator.jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import DrawerNavigator from './DrawerNavigator';

function AppContent() {
  const { isLoggedIn } = useAuth();

  return (
    <DrawerNavigator isLoggedIn={isLoggedIn} />
  );
}

export default function RootNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}
