import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { COLORS } from '../constants/colors';
import { getCurrencyPairBySymbol } from '../constants/currencies';
import { LOT_SIZES } from '../constants/lotSizes';
import { calculatePipValue, convertLotToUnits } from '../utils/pipCalculator';

import CurrencySelector from '../components/CurrencySelector';
import CurrencyPairSelector from '../components/CurrencyPairSelector';
import LotSizeSelector from '../components/LotSizeSelector';
import PipInput from '../components/PipInput';
import ResultCard from '../components/ResultCard';
import Header from '../components/Header';

interface CalculatorScreenProps {
  navigation?: any;
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
}

const CalculatorScreen: React.FC<CalculatorScreenProps> = ({
  navigation,
  isDarkMode = false,
  onThemeToggle,
}) => {
  // State for calculator inputs
  const [accountCurrency, setAccountCurrency] = useState('USD');
  const [currencyPair, setCurrencyPair] = useState('EUR/USD');
  const [lotType, setLotType] = useState('STANDARD');
  const [lotCount, setLotCount] = useState(1);
  const [customUnits, setCustomUnits] = useState(1000);
  const [pipValue, setPipValue] = useState(10);
  const [decimalPlaces, setDecimalPlaces] = useState(4);

  // State for calculation results
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Get currency pair details
  const pairDetails = getCurrencyPairBySymbol(currencyPair);
  const quoteCurrency = pairDetails?.quoteCurrency || 'USD';

  // Background and text colors based on theme
  const backgroundColor = isDarkMode ? COLORS.backgroundDark : COLORS.background;
  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const cardColor = isDarkMode ? COLORS.cardDark : COLORS.card;

  // Calculate pip value when inputs change
  const calculateResults = async () => {
    if (!pairDetails) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Currency Pair',
        text2: 'Please select a valid currency pair',
      });
      return;
    }

    setIsCalculating(true);

    try {
      // Calculate position size based on lot type and count
      let positionSize = lotCount;
      
      if (lotType === 'CUSTOM') {
        positionSize = customUnits;
      } else {
        positionSize = convertLotToUnits(lotType as keyof typeof LOT_SIZES, lotCount);
      }

      // Calculate pip value
      const result = await calculatePipValue(
        currencyPair,
        positionSize,
        pipValue,
        accountCurrency
      );

      setCalculationResult(result);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Calculation error:', error);
      Toast.show({
        type: 'error',
        text1: 'Calculation Error',
        text2: 'Failed to calculate pip value',
      });
    } finally {
      setIsCalculating(false);
    }
  };

  // Calculate on initial load
  useEffect(() => {
    calculateResults();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Header
        title="Forex Pip Calculator"
        isDarkMode={isDarkMode}
        onThemeToggle={onThemeToggle}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Account Settings
            </Text>
            <CurrencySelector
              label="Account Currency"
              selectedCurrency={accountCurrency}
              onCurrencyChange={setAccountCurrency}
              isDarkMode={isDarkMode}
            />
          </View>

          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Instrument Selection
            </Text>
            <CurrencyPairSelector
              label="Currency Pair"
              selectedPair={currencyPair}
              onPairChange={setCurrencyPair}
              isDarkMode={isDarkMode}
            />
          </View>

          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Position Size
            </Text>
            <LotSizeSelector
              label="Lot Size"
              selectedLotType={lotType}
              lotCount={lotCount}
              onLotTypeChange={setLotType}
              onLotCountChange={setLotCount}
              customUnits={customUnits}
              onCustomUnitsChange={setCustomUnits}
              isDarkMode={isDarkMode}
            />
          </View>

          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Pip Settings
            </Text>
            <PipInput
              label="Number of Pips"
              pipValue={pipValue}
              onPipValueChange={setPipValue}
              decimalPlaces={decimalPlaces}
              onDecimalPlacesChange={setDecimalPlaces}
              isDarkMode={isDarkMode}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.calculateButton,
              { backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primary },
            ]}
            onPress={calculateResults}
            disabled={isCalculating}
          >
            {isCalculating ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <MaterialIcons name="calculate" size={20} color="#FFFFFF" />
                <Text style={styles.calculateButtonText}>Calculate</Text>
              </>
            )}
          </TouchableOpacity>

          {calculationResult && (
            <ResultCard
              title="Calculation Results"
              pipValueInQuoteCurrency={calculationResult.pipValueInQuoteCurrency}
              pipValueInAccountCurrency={calculationResult.pipValueInAccountCurrency}
              totalValueInQuoteCurrency={calculationResult.totalValueInQuoteCurrency}
              totalValueInAccountCurrency={calculationResult.totalValueInAccountCurrency}
              quoteCurrency={quoteCurrency}
              accountCurrency={accountCurrency}
              exchangeRate={calculationResult.exchangeRate}
              isDarkMode={isDarkMode}
            />
          )}

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: textColor }]}>
              Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 12,
  },
});

export default CalculatorScreen;