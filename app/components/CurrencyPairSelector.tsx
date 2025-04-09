import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { CURRENCY_PAIRS } from '../constants/currencies';
import { COLORS } from '../constants/colors';

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
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(
    CURRENCY_PAIRS.map((pair) => ({
      label: pair.symbol,
      value: pair.symbol,
      icon: () => (
        <Text style={styles.pairSymbol}>
          {pair.baseCurrency}/{pair.quoteCurrency}
        </Text>
      ),
    }))
  );

  const backgroundColor = isDarkMode ? COLORS.cardDark : COLORS.card;
  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const borderColor = isDarkMode ? COLORS.borderDark : COLORS.border;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <DropDownPicker
        open={open}
        value={selectedPair}
        items={items}
        setOpen={setOpen}
        setValue={(callback) => {
          const newValue = callback(selectedPair);
          if (typeof newValue === 'string') {
            onPairChange(newValue);
          }
        }}
        setItems={setItems}
        style={[styles.picker, { backgroundColor, borderColor }]}
        textStyle={{ color: textColor }}
        dropDownContainerStyle={[
          styles.dropDownContainer,
          { backgroundColor, borderColor },
        ]}
        ArrowDownIconComponent={() => (
          <MaterialIcons name="keyboard-arrow-down" size={24} color={textColor} />
        )}
        ArrowUpIconComponent={() => (
          <MaterialIcons name="keyboard-arrow-up" size={24} color={textColor} />
        )}
        TickIconComponent={() => (
          <MaterialIcons name="check" size={18} color={COLORS.primary} />
        )}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
        searchable={true}
        searchPlaceholder="Search currency pair..."
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
  picker: {
    borderRadius: 8,
    borderWidth: 1,
  },
  dropDownContainer: {
    borderRadius: 8,
    borderWidth: 1,
    elevation: 5,
  },
  pairSymbol: {
    fontSize: 16,
    marginRight: 8,
  },
});

export default CurrencyPairSelector;