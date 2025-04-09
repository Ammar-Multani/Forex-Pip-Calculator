import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
  const [modalVisible, setModalVisible] = useState(false);
  
  const decimalOptions = [
    { label: '0 (1)', value: 0 },
    { label: '1 (0.1)', value: 1 },
    { label: '2 (0.01)', value: 2 },
    { label: '3 (0.001)', value: 3 },
    { label: '4 (0.0001)', value: 4 },
    { label: '5 (0.00001)', value: 5 },
  ];

  const backgroundColor = isDarkMode ? COLORS.cardDark : COLORS.card;
  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const borderColor = isDarkMode ? COLORS.borderDark : COLORS.border;
  const placeholderColor = isDarkMode ? COLORS.disabled : COLORS.placeholder;
  const modalBackgroundColor = isDarkMode ? COLORS.backgroundDark : COLORS.background;

  const handlePipValueChange = (text: string) => {
    const value = parseFloat(text) || 0;
    onPipValueChange(value);
  };

  const handleDecimalPlaceSelect = (value: number) => {
    onDecimalPlacesChange(value);
    setModalVisible(false);
  };

  // Get the label for the current decimal place
  const getDecimalPlaceLabel = () => {
    const option = decimalOptions.find(opt => opt.value === decimalPlaces);
    return option ? option.label : decimalPlaces.toString();
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
          <TouchableOpacity
            style={[styles.picker, { backgroundColor, borderColor }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ color: textColor }}>
              {getDecimalPlaceLabel()}
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color={textColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Decimal Place Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: modalBackgroundColor }]}>
            <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
              <Text style={[styles.modalTitle, { color: textColor }]}>Select Decimal Place</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              {decimalOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalItem,
                    {
                      backgroundColor: option.value === decimalPlaces 
                        ? isDarkMode ? COLORS.primaryDark : COLORS.primary 
                        : 'transparent',
                    },
                  ]}
                  onPress={() => handleDecimalPlaceSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      {
                        color: option.value === decimalPlaces ? '#FFFFFF' : textColor,
                        fontWeight: option.value === decimalPlaces ? 'bold' : 'normal',
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option.value === decimalPlaces && (
                    <MaterialIcons name="check" size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  picker: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalScrollView: {
    padding: 16,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  modalItemText: {
    fontSize: 16,
  },
});

export default PipInput;
