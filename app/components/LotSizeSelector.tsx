import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LOT_SIZE_LABELS, LOT_SIZES, getLotUnits, updateLotSize } from '../constants/lotSizes';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [lotSizeModalVisible, setLotSizeModalVisible] = useState(false);
  const [editingLotType, setEditingLotType] = useState<string | null>(null);
  const [editingLotValue, setEditingLotValue] = useState<string>('');
  
  const backgroundColor = isDarkMode ? COLORS.cardDark : COLORS.card;
  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const borderColor = isDarkMode ? COLORS.borderDark : COLORS.border;
  const placeholderColor = isDarkMode ? COLORS.disabled : COLORS.placeholder;
  const secondaryColor = isDarkMode ? COLORS.secondaryDark : COLORS.secondary;
  const modalBackgroundColor = isDarkMode ? COLORS.backgroundDark : COLORS.background;

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

  const handleLotTypeSelect = (type: string) => {
    onLotTypeChange(type);
    setModalVisible(false);
  };

  const openLotSizeEditor = (lotType: string) => {
    if (lotType !== 'CUSTOM') {
      setEditingLotType(lotType);
      setEditingLotValue(LOT_SIZES[lotType as keyof typeof LOT_SIZES].toString());
      setLotSizeModalVisible(true);
    }
  };

  const saveLotSizeValue = () => {
    if (editingLotType) {
      const value = parseInt(editingLotValue, 10) || 0;
      updateLotSize(editingLotType as keyof typeof LOT_SIZES, value);
      setLotSizeModalVisible(false);
      setEditingLotType(null);
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
          <TouchableOpacity
            style={[styles.picker, { backgroundColor, borderColor }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ color: textColor }}>
              {LOT_SIZE_LABELS[selectedLotType as keyof typeof LOT_SIZE_LABELS]}
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color={textColor} />
          </TouchableOpacity>
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

      {selectedLotType !== 'CUSTOM' && (
        <View style={styles.lotSizeInfoContainer}>
          <Text style={[styles.lotSizeInfoText, { color: textColor }]}>
            1 {LOT_SIZE_LABELS[selectedLotType as keyof typeof LOT_SIZE_LABELS]} = 
            {' '}{LOT_SIZES[selectedLotType as keyof typeof LOT_SIZES].toLocaleString()} units
          </Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => openLotSizeEditor(selectedLotType)}
          >
            <MaterialIcons name="edit" size={16} color={isDarkMode ? COLORS.primaryDark : COLORS.primary} />
            <Text style={[styles.editButtonText, { color: isDarkMode ? COLORS.primaryDark : COLORS.primary }]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
      )}

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

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: modalBackgroundColor }]}>
            <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
              <Text style={[styles.modalTitle, { color: textColor }]}>Select Lot Type</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              {Object.entries(LOT_SIZE_LABELS).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.modalItem,
                    {
                      backgroundColor: key === selectedLotType 
                        ? isDarkMode ? COLORS.primaryDark : COLORS.primary 
                        : 'transparent',
                    },
                  ]}
                  onPress={() => handleLotTypeSelect(key)}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      {
                        color: key === selectedLotType ? '#FFFFFF' : textColor,
                        fontWeight: key === selectedLotType ? 'bold' : 'normal',
                      },
                    ]}
                  >
                    {value}
                  </Text>
                  {key !== 'CUSTOM' && (
                    <Text
                      style={[
                        styles.modalItemDetail,
                        { color: key === selectedLotType ? '#FFFFFF' : textColor },
                      ]}
                    >
                      {LOT_SIZES[key as keyof typeof LOT_SIZES]?.toLocaleString()} units
                    </Text>
                  )}
                  {key === selectedLotType && (
                    <MaterialIcons name="check" size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={lotSizeModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLotSizeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.editorModalContent, { backgroundColor: modalBackgroundColor }]}>
            <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
              <Text style={[styles.modalTitle, { color: textColor }]}>
                Edit {editingLotType ? LOT_SIZE_LABELS[editingLotType as keyof typeof LOT_SIZE_LABELS] : ''} Lot Size
              </Text>
              <TouchableOpacity onPress={() => setLotSizeModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
            <View style={styles.editorContent}>
              <Text style={[styles.editorLabel, { color: textColor }]}>
                Units per lot:
              </Text>
              <TextInput
                style={[
                  styles.editorInput,
                  { backgroundColor, color: textColor, borderColor },
                ]}
                value={editingLotValue}
                onChangeText={setEditingLotValue}
                keyboardType="numeric"
                placeholder="Enter units"
                placeholderTextColor={placeholderColor}
              />
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  { backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primary },
                ]}
                onPress={saveLotSizeValue}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
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
  },
  pickerContainer: {
    flex: 2,
    marginRight: 8,
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
  inputContainer: {
    flex: 1,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  lotSizeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 4,
  },
  lotSizeInfoText: {
    fontSize: 14,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  editButtonText: {
    fontSize: 14,
    marginLeft: 4,
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
  editorModalContent: {
    width: '80%',
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
  modalItemDetail: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    textAlign: 'right',
    marginRight: 8,
  },
  editorContent: {
    padding: 16,
  },
  editorLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  editorInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  saveButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LotSizeSelector;
