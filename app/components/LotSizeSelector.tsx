import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { LOT_SIZE_LABELS } from '../constants/lotSizes';
import { COLORS } from '../constants/colors';

interface LotSizeSelectorProps {
  label: string;
  selectedLotType: string;
  lotCount: number;
  onLotTypeChange: (lotType: string) => void;
  onLotCountChange: (count: number) => void;
  customUnits?: number;
  onCustomUnitsChange?: (units: number) => void;
  isDarkMode?: boolean;
}

const LotSizeSelector: React.FC<LotSizeSelectorProps> = ({
  label,
  selectedLotType,
  lotCount,
  onLotTypeChange,
  onLotCountChange,
  customUnits = 0,
  onCustomUnitsChange,
  isDarkMode = false,
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(
    Object.entries(LOT_SIZE_LABELS).map(([key, value]) => ({
      label: value,
      value: key,
    }))
  );

  const backgroundColor = isDarkMode ? COLORS.cardDark : COLORS.card;
  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const borderColor = isDarkMode ? COLORS.borderDark : COLORS.border;
  const placeholderColor = isDarkMode ? COLORS.disabled : COLORS.placeholder;

  const handleLotCountChange = (text: string) => {
    const count = parseFloat(text) || 0;
    onLotCountChange(count);
  };

  const handleCustomUnitsChange = (text: string) => {
    if (onCustomUnitsChange) {
      const units = parseInt(text, 10) || 0;
      onCustomUnitsChange(units);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <View style={styles.row}>
        <View style={styles.pickerContainer}>
          <DropDownPicker
            open={open}
            value={selectedLotType}
            items={items}
            setOpen={setOpen}
            setValue={(callback) => {
              const newValue = callback(selectedLotType);
              if (typeof newValue === 'string') {
                onLotTypeChange(newValue);
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
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              { backgroundColor, color: textColor, borderColor },
            ]}
            value={lotCount.toString()}
            onChangeText={handleLotCountChange}
            keyboardType="numeric"
            placeholder="Count"
            placeholderTextColor={placeholderColor}
          />
        </View>
      </View>

      {selectedLotType === 'CUSTOM' && onCustomUnitsChange && (
        <View style={styles.customUnitsContainer}>
          <Text style={[styles.subLabel, { color: textColor }]}>
            Custom Units:
          </Text>
          <TextInput
            style={[
              styles.customInput,
              { backgroundColor, color: textColor, borderColor },
            ]}
            value={customUnits.toString()}
            onChangeText={handleCustomUnitsChange}
            keyboardType="numeric"
            placeholder="Enter custom units"
            placeholderTextColor={placeholderColor}
          />
        </View>
      )}
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
    alignItems: 'center',
  },
  pickerContainer: {
    flex: 2,
    marginRight: 8,
    zIndex: 1000,
  },
  inputContainer: {
    flex: 1,
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
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  customUnitsContainer: {
    marginTop: 12,
  },
  customInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});

export default LotSizeSelector;