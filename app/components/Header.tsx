import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface HeaderProps {
  title: string;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  onThemeToggle,
  isDarkMode = false,
  showBackButton = false,
  onBackPress,
}) => {
  const backgroundColor = isDarkMode ? COLORS.backgroundDark : COLORS.background;
  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.leftContainer}>
        {showBackButton && onBackPress && (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.title, { color: textColor }]}>{title}</Text>

      <View style={styles.rightContainer}>
        {onThemeToggle && (
          <TouchableOpacity style={styles.themeButton} onPress={onThemeToggle}>
            <MaterialIcons
              name={isDarkMode ? 'light-mode' : 'dark-mode'}
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leftContainer: {
    width: 40,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 4,
  },
  themeButton: {
    padding: 4,
  },
});

export default Header;