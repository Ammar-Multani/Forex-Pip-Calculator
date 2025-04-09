import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { LOT_SIZE_LABELS, LOT_SIZES, getLotUnits } from '../constants/lotSizes';
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
  const secondaryColor = isDarkMode ? COLORS.secondaryDark : COLORS.secondary;

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

  const calculateTotalUnits = (): number => {
    if (selectedLotType === 'CUSTOM') {
      return customUnits;
    }
    return getLotUnits(selectedLotType as keyof typeof LOT_SIZES) * lotCount;
  };

  const totalUnits = calculateTotalUnits();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      
      <View style={styles.infoContainer}>
        <Text style={[styles.infoText, { color: textColor }]}>
          Select the lot type and quantity. The calculator will convert this to units.
        </Text>
      </View>
      
      <View style={styles.row}>
        <View style={styles.pickerContainer}>
          <Text style={[styles.subLabel, { color: textColor }]}>Lot Type</Text>
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
            zIndex={1000}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.subLabel, { color: textColor }]}>Quantity</Text>
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
            Custom Units
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
      
      <View style={[styles.totalUnitsContainer, { backgroundColor: secondaryColor }]}>
        <Text style={styles.totalUnitsText}>
          Total Units: {totalUnits.toLocaleString()}
        </Text>
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
  infoContainer: {
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  subLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    zIndex: 1000,
  },
  pickerContainer: {
    flex: 2,
    marginRight: 8,
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
    zIndex: 900,
  },
  customInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  totalUnitsContainer: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  totalUnitsText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default LotSizeSelector;
