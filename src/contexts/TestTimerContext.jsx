import React, { createContext, useContext, useRef } from 'react';

const TestTimerContext = createContext();

export const TestTimerProvider = ({ children }) => {
  const activeTimerRef = useRef(null);
  const activeTestIdRef = useRef(null);

  const registerTimer = (testId, timerRef) => {
    console.log('🔄 Registering timer for test:', testId, 'Previous active:', activeTestIdRef.current);
    
    // If there's an existing timer for a different test, clear it
    if (activeTestIdRef.current && activeTestIdRef.current !== testId) {
      console.log('🛑 Clearing previous test timer:', activeTestIdRef.current);
      if (activeTimerRef.current) {
        clearInterval(activeTimerRef.current);
        activeTimerRef.current = null;
      }
    }

    // Register the new timer
    console.log('✅ Registering new test timer:', testId);
    activeTimerRef.current = timerRef;
    activeTestIdRef.current = testId;
  };

  const clearTimer = (testId) => {
    console.log('🧹 Clearing timer for test:', testId, 'Active test:', activeTestIdRef.current);
    
    // Clear the timer interval if it exists
    if (activeTimerRef.current) {
      clearInterval(activeTimerRef.current);
      activeTimerRef.current = null;
      console.log('✅ Timer interval cleared');
    }
    
    // Only clear the active test ID if it matches the test being cleared
    // This prevents clearing the active test when we're just cleaning up
    if (activeTestIdRef.current === testId) {
      console.log('✅ Active test cleared for test:', testId);
      activeTestIdRef.current = null;
    }
  };

  const isActiveTest = (testId) => {
    const isActive = activeTestIdRef.current === testId;
    console.log('🔍 Checking if test is active:', testId, 'Active test:', activeTestIdRef.current, 'Result:', isActive);
    return isActive;
  };

  const setActiveTest = (testId) => {
    console.log('🎯 Setting active test:', testId, 'Previous:', activeTestIdRef.current);
    
    // If there's already an active test that's different, clear it first
    if (activeTestIdRef.current && activeTestIdRef.current !== testId) {
      console.log('🛑 Clearing previous active test:', activeTestIdRef.current, 'before setting new test:', testId);
      
      // Clear the timer for the previous test
      if (activeTimerRef.current) {
        clearInterval(activeTimerRef.current);
        activeTimerRef.current = null;
        console.log('✅ Previous test timer cleared');
      }
    }
    
    // Set the new active test
    activeTestIdRef.current = testId;
    console.log('✅ Active test set to:', testId);
  };

  const clearActiveTest = () => {
    console.log('🧹 Clearing active test:', activeTestIdRef.current);
    if (activeTimerRef.current) {
      clearInterval(activeTimerRef.current);
      activeTimerRef.current = null;
    }
    activeTestIdRef.current = null;
  };

  return (
    <TestTimerContext.Provider value={{
      registerTimer,
      clearTimer,
      isActiveTest,
      setActiveTest,
      clearActiveTest,
      activeTestId: activeTestIdRef.current
    }}>
      {children}
    </TestTimerContext.Provider>
  );
};

export const useTestTimer = () => {
  const context = useContext(TestTimerContext);
  if (!context) {
    throw new Error('useTestTimer must be used within a TestTimerProvider');
  }
  return context;
};