import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MAJOR_CURRENCIES } from '../constants/currencies';
import { COLORS } from '../constants/colors';
import CurrencyModal from './CurrencyModal';

interface CurrencySelectorProps {
  label: string;
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  isDarkMode?: boolean;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  label,
  selectedCurrency,
  onCurrencyChange,
  isDarkMode = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Get selected currency details
  const selectedCurrencyDetails = MAJOR_CURRENCIES.find(
    (currency) => currency.code === selectedCurrency
  );

  // Colors based on theme
  const backgroundColor = isDarkMode ? COLORS.cardDark : COLORS.card;
  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const borderColor = isDarkMode ? COLORS.borderDark : COLORS.border;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      
      <TouchableOpacity
        style={[styles.selector, { backgroundColor, borderColor }]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.currencyInfo}>
          <Text style={[styles.currencyCode, { color: textColor }]}>
            {selectedCurrencyDetails?.code || selectedCurrency}
          </Text>
          <Text style={[styles.currencyName, { color: textColor }]}>
            {selectedCurrencyDetails?.name || ''}
          </Text>
        </View>
        
        <View style={styles.rightContainer}>
          <Text style={[styles.currencySymbol, { color: textColor }]}>
            {selectedCurrencyDetails?.symbol || ''}
          </Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            color={textColor}
          />
        </View>
      </TouchableOpacity>

      <CurrencyModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={onCurrencyChange}
        currencies={MAJOR_CURRENCIES}
        selectedCurrency={selectedCurrency}
        title="Select Account Currency"
        isDarkMode={isDarkMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  selector: {
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '500',
  },
  currencyName: {
    fontSize: 14,
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 18,
    marginRight: 8,
  },
});

export default CurrencySelector;
