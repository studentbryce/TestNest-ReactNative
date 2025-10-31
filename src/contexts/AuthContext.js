import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';
import CryptoJS from 'crypto-js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      console.log('🔍 Checking auth state...');
      const storedSession = await AsyncStorage.getItem('userSession');
      
      if (storedSession) {
        const session = JSON.parse(storedSession);
        console.log('📱 Found stored session:', session.user?.username);
        setUser(session.user);
        setIsLoggedIn(true);
      } else {
        console.log('❌ No stored session found');
      }
    } catch (error) {
      console.error('❌ Error checking auth state:', error);
      await AsyncStorage.removeItem('userSession');
    } finally {
      setLoading(false);
    }
  };

  // Hash password using SHA256
  const hashPassword = (password) => {
    return CryptoJS.SHA256(password).toString();
  };

  // Validate StudentID format (7-8 digits)
  const validateStudentID = (studentID) => {
    const id = parseInt(studentID);
    return id >= 1000000 && id <= 99999999;
  };

  const signUp = async (studentID, firstName, lastName, userName, password) => {
    try {
      setLoading(true);
      console.log('📝 Starting registration for:', userName);

      if (!validateStudentID(studentID)) {
        throw new Error('Student ID must be 7-8 digits');
      }

      const hashedPassword = hashPassword(password);
      
      const userData = {
        studentid: parseInt(studentID),
        firstname: firstName,
        lastname: lastName,
        username: userName,
        password: hashedPassword,
        role: 'student'
      };

      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        console.error('❌ Registration error:', error);
        if (error.code === '23505') {
          if (error.message.includes('username')) {
            throw new Error('Username already exists');
          } else if (error.message.includes('studentid')) {
            throw new Error('Student ID already exists');
          }
        }
        throw error;
      }

      console.log('✅ Registration successful:', data);
      return { success: true, user: data };
    } catch (error) {
      console.error('❌ Sign up error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (loginInput, password) => {
    try {
      setLoading(true);
      console.log('🔐 Starting login process for:', loginInput);

      const hashedPassword = hashPassword(password);
      const isStudentID = !isNaN(loginInput) && loginInput.length >= 7;
      
      let userData;
      if (isStudentID) {
        console.log('🔍 Looking for user by StudentID:', loginInput);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('studentid', parseInt(loginInput))
          .eq('role', 'student')
          .single();
        
        if (error) {
          console.error('❌ StudentID lookup error:', error);
          if (error.code === 'PGRST116') {
            throw new Error('Student ID not found');
          }
          throw new Error('Database error during user lookup');
        }
        userData = data;
      } else {
        console.log('🔍 Looking for user by UserName:', loginInput);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', loginInput)
          .eq('role', 'student')
          .single();
        
        if (error) {
          console.error('❌ UserName lookup error:', error);
          if (error.code === 'PGRST116') {
            throw new Error('Username not found');
          }
          throw new Error('Database error during user lookup');
        }
        userData = data;
      }

      if (!userData) {
        throw new Error('User not found');
      }

      if (userData.password !== hashedPassword) {
        throw new Error('Invalid password');
      }

      const userSession = {
        user: {
          userid: userData.userid,
          studentid: userData.studentid,
          firstname: userData.firstname,
          lastname: userData.lastname,
          username: userData.username,
          role: userData.role,
          fullname: `${userData.firstname} ${userData.lastname}`
        }
      };

      setUser(userSession.user);
      setIsLoggedIn(true);
      
      await AsyncStorage.setItem('userSession', JSON.stringify(userSession));
      console.log('✅ Login successful, session stored');
      
      return { success: true };
    } catch (error) {
      console.error('❌ Sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (updatedData) => {
    try {
      console.log('🔄 Updating user data in AuthContext:', updatedData);
      
      // Update user state
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      
      // Update stored session
      await AsyncStorage.setItem('userSession', JSON.stringify({ 
        user: updatedUser, 
        timestamp: Date.now() 
      }));
      
      console.log('✅ User data updated in AuthContext and storage');
      return { success: true };
    } catch (error) {
      console.error('❌ Update user data error:', error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('🚪 Starting logout process...');
      
      // Clear user state
      setUser(null);
      setIsLoggedIn(false);
      
      // Remove all stored data
      await AsyncStorage.multiRemove(['userSession', 'userPreferences', 'tempData']);
      console.log('✅ Logout successful, all data cleared');
      
      return { success: true };
    } catch (error) {
      console.error('❌ Sign out error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isLoggedIn,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserData,
    setIsLoggedIn, // Keep for backward compatibility but prefer signOut()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};