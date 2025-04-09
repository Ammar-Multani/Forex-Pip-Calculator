import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './app/context/ThemeContext';
import AppNavigator from './app/navigation/AppNavigator';

// Main app component with theme context
const Main = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <AppNavigator isDarkMode={isDarkMode} onThemeToggle={toggleTheme} />
    </>
  );
};

// Root component that provides theme context
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Main />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}