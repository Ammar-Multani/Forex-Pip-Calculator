
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

interface CurrencyPair {
  symbol: string;
  baseCurrency: string;
  quoteCurrency: string;
  pipDecimalPlace: number;
  pipValue: number;
}

interface CurrencyPairModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (pairSymbol: string) => void;
  pairs: CurrencyPair[];
  selectedPair: string;
  title: string;
  isDarkMode?: boolean;
}

const { height } = Dimensions.get('window');

const CurrencyPairModal: React.FC<CurrencyPairModalProps> = ({
  isVisible,
  onClose,
  onSelect,
  pairs,
  selectedPair,
  title,
  isDarkMode = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPairs, setFilteredPairs] = useState<CurrencyPair[]>(pairs);
  const [loading, setLoading] = useState(false);
  const [groupedPairs, setGroupedPairs] = useState<Record<string, CurrencyPair[]>>({});
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  // Group pairs by base currency
  useEffect(() => {
    const grouped: Record<string, CurrencyPair[]> = {};
    
    // Major groups
    grouped['Major'] = pairs.filter(pair => 
      ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'USD/CAD', 'AUD/USD', 'NZD/USD'].includes(pair.symbol)
    );
    
    // Group by base currency
    pairs.forEach(pair => {
      if (!grouped[pair.baseCurrency]) {
        grouped[pair.baseCurrency] = [];
      }
      
      // Only add if not already in Major group
      if (!grouped['Major'].some(p => p.symbol === pair.symbol)) {
        grouped[pair.baseCurrency].push(pair);
      }
    });
    
    // Remove empty groups
    Object.keys(grouped).forEach(key => {
      if (grouped[key].length === 0) {
        delete grouped[key];
      }
    });
    
    setGroupedPairs(grouped);
    setActiveGroup('Major');
  }, [pairs]);

  // Filter pairs based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPairs(pairs);
      setActiveGroup(null);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = pairs.filter(
      (pair) =>
        pair.symbol.toLowerCase().includes(query) ||
        pair.baseCurrency.toLowerCase().includes(query) ||
        pair.quoteCurrency.toLowerCase().includes(query)
    );
    setFilteredPairs(filtered);
    setActiveGroup(null);
  }, [searchQuery, pairs]);

  // Reset search when modal closes
  useEffect(() => {
    if (!isVisible) {
      setSearchQuery('');
      setActiveGroup('Major');
    }
  }, [isVisible]);

  // Handle pair selection
  const handleSelect = (pairSymbol: string) => {
    setLoading(true);
    setTimeout(() => {
      onSelect(pairSymbol);
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

  // Render currency pair item
  const renderPairItem = ({ item }: { item: CurrencyPair }) => {
    const isSelected = item.symbol === selectedPair;
    return (
      <TouchableOpacity
        style={[
          styles.pairItem,
          {
            backgroundColor: isSelected
              ? isDarkMode
                ? COLORS.primaryDark
                : COLORS.primary
              : 'transparent',
          },
        ]}
        onPress={() => handleSelect(item.symbol)}
      >
        <View style={styles.pairInfo}>
          <Text
            style={[
              styles.pairSymbol,
              {
                color: isSelected ? '#FFFFFF' : textColor,
                fontWeight: isSelected ? 'bold' : 'normal',
              },
            ]}
          >
            {item.symbol}
          </Text>
          <Text
            style={[
              styles.pairDetail,
              { color: isSelected ? '#FFFFFF' : textColor },
            ]}
          >
            {`Pip: ${item.pipValue} (${item.pipDecimalPlace} decimals)`}
          </Text>
        </View>
        {isSelected && (
          <MaterialIcons name="check" size={20} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    );
  };

  // Render group tabs
  const renderGroupTabs = () => {
    if (searchQuery.trim() !== '' || !activeGroup) return null;
    
    return (
      <View style={styles.groupTabsContainer}>
        <ScrollableGroupTabs 
          groups={Object.keys(groupedPairs)}
          activeGroup={activeGroup}
          onSelectGroup={setActiveGroup}
          isDarkMode={isDarkMode}
        />
      </View>
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
            placeholder="Search currency pair..."
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

        {renderGroupTabs()}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={isDarkMode ? COLORS.primary : COLORS.primary}
            />
          </View>
        ) : (
          <FlatList
            data={searchQuery.trim() !== '' 
              ? filteredPairs 
              : activeGroup ? groupedPairs[activeGroup] : pairs}
            renderItem={renderPairItem}
            keyExtractor={(item) => item.symbol}
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
                  No currency pairs found
                </Text>
              </View>
            }
          />
        )}
      </View>
    </Modal>
  );
};

// Scrollable tabs for currency pair groups
const ScrollableGroupTabs = ({ 
  groups, 
  activeGroup, 
  onSelectGroup,
  isDarkMode
}: { 
  groups: string[], 
  activeGroup: string | null,
  onSelectGroup: (group: string) => void,
  isDarkMode: boolean
}) => {
  return (
    <FlatList
      data={groups}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item}
      contentContainerStyle={styles.groupTabsList}
      renderItem={({ item }) => {
        const isActive = item === activeGroup;
        return (
          <TouchableOpacity
            style={[
              styles.groupTab,
              {
                backgroundColor: isActive
                  ? isDarkMode
                    ? COLORS.primaryDark
                    : COLORS.primary
                  : isDarkMode
                  ? COLORS.backgroundDark
                  : COLORS.background,
                borderColor: isActive
                  ? isDarkMode
                    ? COLORS.primaryDark
                    : COLORS.primary
                  : isDarkMode
                  ? COLORS.borderDark
                  : COLORS.border,
              },
            ]}
            onPress={() => onSelectGroup(item)}
          >
            <Text
              style={[
                styles.groupTabText,
                {
                  color: isActive
                    ? '#FFFFFF'
                    : isDarkMode
                    ? COLORS.textDark
                    : COLORS.text,
                  fontWeight: isActive ? 'bold' : 'normal',
                },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
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
  groupTabsContainer: {
    marginBottom: 8,
  },
  groupTabsList: {
    paddingHorizontal: 16,
  },
  groupTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  groupTabText: {
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  pairItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  pairInfo: {
    flex: 1,
  },
  pairSymbol: {
    fontSize: 16,
    marginBottom: 4,
  },
  pairDetail: {
    fontSize: 14,
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

export default CurrencyPairModal;
