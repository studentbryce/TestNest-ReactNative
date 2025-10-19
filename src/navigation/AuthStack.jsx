// navigation/AuthStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AboutScreen from '../screens/AboutScreen';
import DemoTestScreen from '../screens/DemoTestScreen';
import DemoResultsScreen from '../screens/DemoResultsScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="DemoTest" component={DemoTestScreen} />
      <Stack.Screen name="DemoResults" component={DemoResultsScreen} />
    </Stack.Navigator>
  );
}
