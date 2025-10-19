// App.js
import React, { useState, useRef } from 'react';
import 'react-native-gesture-handler';

import RootNavigator from './src/navigation/RootNavigator';
import { ActivityIndicator, View } from 'react-native';

// Font imports
import { useFonts, Quicksand_600SemiBold } from '@expo-google-fonts/quicksand';
import { Fredoka_500Medium } from '@expo-google-fonts/fredoka';
import { Inter_300Light } from '@expo-google-fonts/inter';

import { TestTimerProvider } from './src/contexts/TestTimerContext';

export default function App() {
  // Load fonts
  const [fontsLoaded] = useFonts({
    Quicksand_600SemiBold,
    Fredoka_500Medium,
    Inter_300Light,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF9E5' }}>
        <ActivityIndicator size="large" color="#513521" />
      </View>
    );
  }

  return (
    <TestTimerProvider>
      <RootNavigator />
    </TestTimerProvider>
  );
}

