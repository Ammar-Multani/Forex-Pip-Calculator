import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { MAJOR_CURRENCIES } from '../constants/currencies';
import { COLORS } from '../constants/colors';

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
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(
    MAJOR_CURRENCIES.map((currency) => ({
      label: `${currency.code} (${currency.symbol}) - ${currency.name}`,
      value: currency.code,
      icon: () => (
        <Text style={styles.currencySymbol}>{currency.symbol}</Text>
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
        value={selectedCurrency}
        items={items}
        setOpen={setOpen}
        setValue={(callback) => {
          const newValue = callback(selectedCurrency);
          if (typeof newValue === 'string') {
            onCurrencyChange(newValue);
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
  currencySymbol: {
    fontSize: 16,
    marginRight: 8,
  },
});

export default CurrencySelector;