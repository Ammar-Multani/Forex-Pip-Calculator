import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CURRENCY_PAIRS, getCurrencyPairBySymbol } from '../constants/currencies';
import { COLORS } from '../constants/colors';
import CurrencyPairModal from './CurrencyPairModal';

interface CurrencyPairSelectorProps {
  label: string;
  selectedPair: string;
  onPairChange: (pair: string) => void;
  isDarkMode?: boolean;
}

const CurrencyPairSelector: React.FC<CurrencyPairSelectorProps> = ({
  label,
  selectedPair,
  onPairChange,
  isDarkMode = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Get selected pair details
  const selectedPairDetails = getCurrencyPairBySymbol(selectedPair);

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
        <View style={styles.pairInfo}>
          <Text style={[styles.pairSymbol, { color: textColor }]}>
            {selectedPair}
          </Text>
          {selectedPairDetails && (
            <Text style={[styles.pairDetail, { color: textColor }]}>
              {`Base: ${selectedPairDetails.baseCurrency} / Quote: ${selectedPairDetails.quoteCurrency}`}
            </Text>
          )}
        </View>
        
        <MaterialIcons
          name="keyboard-arrow-down"
          size={24}
          color={textColor}
        />
      </TouchableOpacity>

      <CurrencyPairModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={onPairChange}
        pairs={CURRENCY_PAIRS}
        selectedPair={selectedPair}
        title="Select Currency Pair"
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
  pairInfo: {
    flex: 1,
  },
  pairSymbol: {
    fontSize: 16,
    fontWeight: '500',
  },
  pairDetail: {
    fontSize: 14,
    marginTop: 2,
  },
});

export default CurrencyPairSelector;
