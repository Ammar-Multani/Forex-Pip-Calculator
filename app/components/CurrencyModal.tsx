
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface CurrencyItem {
  code: string;
  name: string;
  symbol: string;
}

interface CurrencyModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (currencyCode: string) => void;
  currencies: CurrencyItem[];
  selectedCurrency: string;
  title: string;
  isDarkMode?: boolean;
}

const { height } = Dimensions.get('window');

const CurrencyModal: React.FC<CurrencyModalProps> = ({
  isVisible,
  onClose,
  onSelect,
  currencies,
  selectedCurrency,
  title,
  isDarkMode = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCurrencies, setFilteredCurrencies] = useState<CurrencyItem[]>(currencies);
  const [loading, setLoading] = useState(false);

  // Filter currencies based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCurrencies(currencies);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = currencies.filter(
      (currency) =>
        currency.code.toLowerCase().includes(query) ||
        currency.name.toLowerCase().includes(query)
    );
    setFilteredCurrencies(filtered);
  }, [searchQuery, currencies]);

  // Reset search when modal closes
  useEffect(() => {
    if (!isVisible) {
      setSearchQuery('');
    }
  }, [isVisible]);

  // Handle currency selection
  const handleSelect = (currencyCode: string) => {
    setLoading(true);
    setTimeout(() => {
      onSelect(currencyCode);
      setLoading(false);
      onClose();
    }, 300);
  };

  // Colors based on theme
  const backgroundColor = isDarkMode ? COLORS.backgroundDark : COLORS.background;
  const cardColor = isDarkMode ? COLORS.cardDark : COLORS.card;
  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const borderColor = isDarkMode ? COLORS.borderDark : COLORS.border;
  const placeholderColor = isDarkMode ? COLORS.disabled : COLORS.placeholder;

  // Render currency item
  const renderCurrencyItem = ({ item }: { item: CurrencyItem }) => {
    const isSelected = item.code === selectedCurrency;
    return (
      <TouchableOpacity
        style={[
          styles.currencyItem,
          {
            backgroundColor: isSelected
              ? isDarkMode
                ? COLORS.primaryDark
                : COLORS.primary
              : 'transparent',
          },
        ]}
        onPress={() => handleSelect(item.code)}
      >
        <View style={styles.currencyInfo}>
          <Text
            style={[
              styles.currencyCode,
              {
                color: isSelected ? '#FFFFFF' : textColor,
                fontWeight: isSelected ? 'bold' : 'normal',
              },
            ]}
          >
            {item.code}
          </Text>
          <Text
            style={[
              styles.currencyName,
              { color: isSelected ? '#FFFFFF' : textColor },
            ]}
          >
            {item.name}
          </Text>
        </View>
        <Text
          style={[
            styles.currencySymbol,
            { color: isSelected ? '#FFFFFF' : textColor },
          ]}
        >
          {item.symbol}
        </Text>
        {isSelected && (
          <MaterialIcons name="check" size={20} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal}
      propagateSwipe
    >
      <View style={[styles.container, { backgroundColor: cardColor }]}>
        <View style={[styles.header, { borderBottomColor: borderColor }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={[styles.searchContainer, { backgroundColor, borderColor }]}>
          <MaterialIcons name="search" size={20} color={placeholderColor} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search currency..."
            placeholderTextColor={placeholderColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="clear" size={20} color={placeholderColor} />
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={isDarkMode ? COLORS.primary : COLORS.primary}
            />
          </View>
        ) : (
          <FlatList
            data={filteredCurrencies}
            renderItem={renderCurrencyItem}
            keyExtractor={(item) => item.code}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={15}
            maxToRenderPerBatch={20}
            windowSize={10}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialIcons
                  name="search-off"
                  size={48}
                  color={placeholderColor}
                />
                <Text style={[styles.emptyText, { color: textColor }]}>
                  No currencies found
                </Text>
              </View>
            }
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    maxHeight: height * 0.8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    marginBottom: 4,
  },
  currencyName: {
    fontSize: 14,
  },
  currencySymbol: {
    fontSize: 18,
    marginHorizontal: 16,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
});

export default CurrencyModal;
