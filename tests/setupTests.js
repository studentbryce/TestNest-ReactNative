// Setup file for React Native Testing Library tests
import 'react-native-gesture-handler/jestSetup';

// Mock react-native-reanimated
require('react-native-reanimated').setUpTests();

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Mock Supabase client
jest.mock('../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
          order: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        order: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: jest.fn(() => Promise.resolve({ data: [], error: null })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    })),
  },
}));

// Mock AuthContext
jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    isLoggedIn: false,
    user: null,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    loading: false,
  }),
  AuthProvider: ({ children }) => children,
}));

// Mock TestTimerContext
jest.mock('../src/contexts/TestTimerContext', () => ({
  useTestTimer: () => ({
    registerTimer: jest.fn(),
    clearTimer: jest.fn(),
    isActiveTest: jest.fn(() => true),
    setActiveTest: jest.fn(),
    clearActiveTest: jest.fn(),
  }),
  TestTimerProvider: ({ children }) => children,
}));

// Mock Expo Vector Icons to prevent act() warnings
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  
  return {
    Ionicons: React.forwardRef((props, ref) => 
      React.createElement(Text, { 
        testID: 'mock-ionicon', 
        ref,
        ...props 
      }, props.name || '📱')
    ),
    MaterialIcons: React.forwardRef((props, ref) => 
      React.createElement(Text, { 
        testID: 'mock-material-icon', 
        ref,
        ...props 
      }, props.name || '🔧')
    ),
    FontAwesome: React.forwardRef((props, ref) => 
      React.createElement(Text, { 
        testID: 'mock-fontawesome-icon', 
        ref,
        ...props 
      }, props.name || '⭐')
    ),
  };
});

// Mock vector icons (legacy)
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Console log configuration for better test output
const originalConsoleLog = console.log;
console.log = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('[TEST]')) {
    originalConsoleLog(...args);
  }
};

// Global test timeout
jest.setTimeout(10000);