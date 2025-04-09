import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CalculatorScreen from '../screens/CalculatorScreen';
import InfoScreen from '../screens/InfoScreen';

const Stack = createNativeStackNavigator();

interface AppNavigatorProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({
  isDarkMode,
  onThemeToggle,
}) => {
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
              onThemeToggle={onThemeToggle}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Info">
          {(props) => (
            <InfoScreen
              {...props}
              isDarkMode={isDarkMode}
              onThemeToggle={onThemeToggle}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
