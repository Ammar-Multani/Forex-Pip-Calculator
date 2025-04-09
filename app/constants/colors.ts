// App color scheme
export const COLORS = {
  primary: '#1E88E5',
  primaryDark: '#1565C0',
  secondary: '#26A69A',
  secondaryDark: '#00897B',
  background: '#F5F7FA',
  backgroundDark: '#121212',
  card: '#FFFFFF',
  cardDark: '#1E1E1E',
  text: '#333333',
  textDark: '#F5F5F5',
  border: '#E0E0E0',
  borderDark: '#333333',
  error: '#D32F2F',
  success: '#388E3C',
  warning: '#FFA000',
  info: '#1976D2',
  disabled: '#9E9E9E',
  placeholder: '#BDBDBD',
};

// Theme-aware color getter
export const getColor = (colorName: keyof typeof COLORS, isDark: boolean = false): string => {
  if (colorName.endsWith('Dark') && isDark) {
    return COLORS[colorName];
  }
  
  const darkVariant = `${colorName}Dark` as keyof typeof COLORS;
  
  if (isDark && COLORS[darkVariant]) {
    return COLORS[darkVariant];
  }
  
  return COLORS[colorName];
};