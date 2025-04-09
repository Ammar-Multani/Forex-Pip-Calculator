import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';

import CalculatorScreen from '../screens/CalculatorScreen';
import InfoScreen from '../screens/InfoScreen';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Calculator"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Calculator">
          {(props) => (
            <CalculatorScreen
              {...props}
              isDarkMode={isDarkMode}
              onThemeToggle={toggleTheme}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Info">
          {(props) => (
            <InfoScreen
              {...props}
              isDarkMode={isDarkMode}
              onThemeToggle={toggleTheme}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;