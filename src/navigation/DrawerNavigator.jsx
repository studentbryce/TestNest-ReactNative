// src/navigation/DrawerNavigator.jsx
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import AppStack from './AppStack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AboutScreen from '../screens/AboutScreen';
import HelpScreen from '../screens/HelpScreen';
import DashboardScreen from '../screens/DashboardScreen';
import DemoTestScreen from '../screens/DemoTestScreen';
import DemoResultsScreen from '../screens/DemoResultsScreen';
import TestListScreen from '../screens/TestListScreen';
import TestScreen from '../screens/TestScreen';
import ResultsScreen from '../screens/ResultsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import { globalStyles } from '../styles/global';
import { colors } from '../theme';
import { useAuth } from '../contexts/AuthContext';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { setIsLoggedIn, isLoggedIn, signOut } = useAuth();
  const { navigation } = props;

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              console.log('🚪 Logging out from drawer...');
              // Use signOut from AuthContext if available
              if (signOut) {
                const result = await signOut();
                if (result.success) {
                  // Reset navigation stack to Home
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                  });
                } else {
                  Alert.alert('Error', 'Failed to logout');
                }
              } else {
                // Fallback to setIsLoggedIn
                setIsLoggedIn(false);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                });
              }
            } catch (error) {
              console.error('❌ Drawer logout error:', error);
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props} style={globalStyles.drawerContainer}>
      <View style={globalStyles.drawerHeader}>
        <Text style={globalStyles.drawerHeaderText}>TestNest 🪺</Text>
      </View>

      {/* Regular drawer items */}
      <DrawerItemList {...props} />

      {/* Conditionally show logout button only if logged in */}
      {isLoggedIn && (
        <DrawerItem
          label="Logout"
          onPress={handleLogout}
          labelStyle={globalStyles.drawerLabelStyle}
          style={globalStyles.drawerItemStyle}
        />
      )}
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator({ isLoggedIn }) {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        swipeEnabled: true,
        drawerStyle: globalStyles.drawerStyle,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.primary,
        drawerActiveBackgroundColor: colors.secondary,
        drawerInactiveBackgroundColor: 'transparent',
        drawerLabelStyle: globalStyles.drawerLabelStyle,
        drawerItemStyle: globalStyles.drawerItemStyle,
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen
        name="Login"
        component={LoginScreen}
        options={{ drawerItemStyle: isLoggedIn ? globalStyles.drawerItemHidden : globalStyles.drawerItemStyle }}
      />
      <Drawer.Screen
        name="Register"
        component={RegisterScreen}
        options={{ drawerItemStyle: isLoggedIn ? globalStyles.drawerItemHidden : globalStyles.drawerItemStyle }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{ drawerItemStyle: globalStyles.drawerItemStyle }}
      />
      <Drawer.Screen
        name="Help"
        component={HelpScreen}
        options={{ 
          drawerItemStyle: globalStyles.drawerItemStyle,
          title: 'Help & Support'
        }}
      />
      <Drawer.Screen
        name="DemoTest"
        component={DemoTestScreen}
        options={{ drawerItemStyle: globalStyles.drawerItemHidden }}
      />
      <Drawer.Screen
        name="DemoResults"
        component={DemoResultsScreen}
        options={{ drawerItemStyle: globalStyles.drawerItemHidden }}
      />
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ drawerItemStyle: isLoggedIn ? globalStyles.drawerItemStyle : globalStyles.drawerItemHidden }}
      />
      <Drawer.Screen
        name="TestList"
        component={TestListScreen}
        options={{ drawerItemStyle: isLoggedIn ? globalStyles.drawerItemStyle : globalStyles.drawerItemHidden }}
      />
      <Drawer.Screen
        name="TestScreen"
        component={TestScreen}
        options={{ drawerItemStyle: globalStyles.drawerItemHidden }}
      />
      <Drawer.Screen
        name="Results"
        component={ResultsScreen}
        options={{ drawerItemStyle: isLoggedIn ? globalStyles.drawerItemStyle : globalStyles.drawerItemHidden }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ drawerItemStyle: isLoggedIn ? globalStyles.drawerItemStyle : globalStyles.drawerItemHidden }}
      />
      <Drawer.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ drawerItemStyle: globalStyles.drawerItemHidden }}
      />
      <Drawer.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ drawerItemStyle: globalStyles.drawerItemHidden }}
      />
      <Drawer.Screen
        name="AppStack"
        component={AppStack}
        options={{ drawerItemStyle: globalStyles.drawerItemHidden }}
      />
    </Drawer.Navigator>
  );
}