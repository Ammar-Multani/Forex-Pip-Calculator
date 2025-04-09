import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { COLORS } from '../constants/colors';

interface PipInputProps {
  label: string;
  pipValue: number;
  onPipValueChange: (value: number) => void;
  decimalPlaces: number;
  onDecimalPlacesChange: (places: number) => void;
  isDarkMode?: boolean;
}

const PipInput: React.FC<PipInputProps> = ({
  label,
  pipValue,
  onPipValueChange,
  decimalPlaces,
  onDecimalPlacesChange,
  isDarkMode = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState([
    { label: '0 (1)', value: 0 },
    { label: '1 (0.1)', value: 1 },
    { label: '2 (0.01)', value: 2 },
    { label: '3 (0.001)', value: 3 },
    { label: '4 (0.0001)', value: 4 },
    { label: '5 (0.00001)', value: 5 },
  ]);

  const backgroundColor = isDarkMode ? COLORS.cardDark : COLORS.card;
  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const borderColor = isDarkMode ? COLORS.borderDark : COLORS.border;
  const placeholderColor = isDarkMode ? COLORS.disabled : COLORS.placeholder;

  const handlePipValueChange = (text: string) => {
    const value = parseFloat(text) || 0;
    onPipValueChange(value);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              { backgroundColor, color: textColor, borderColor },
            ]}
            value={pipValue.toString()}
            onChangeText={handlePipValueChange}
            keyboardType="numeric"
            placeholder="Enter pip value"
            placeholderTextColor={placeholderColor}
          />
        </View>
        <View style={styles.pickerContainer}>
          <Text style={[styles.subLabel, { color: textColor }]}>
            Decimal Place:
          </Text>
          <DropDownPicker
            open={open}
            value={decimalPlaces}
            items={items}
            setOpen={setOpen}
            setValue={(callback) => {
              const newValue = callback(decimalPlaces);
              if (typeof newValue === 'number') {
                onDecimalPlacesChange(newValue);
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
            zIndex={1000}
          />
        </View>
      </View>
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
  subLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputContainer: {
    flex: 1,
    marginRight: 12,
  },
  pickerContainer: {
    flex: 1,
    zIndex: 1000,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
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
});

export default PipInput;