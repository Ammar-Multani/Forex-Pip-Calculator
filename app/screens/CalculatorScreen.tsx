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
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import FlashMessage, { showMessage } from 'react-native-flash-message';

import { COLORS } from '../constants/colors';
import { getCurrencyPairBySymbol } from '../constants/currencies';
import { LOT_SIZES } from '../constants/lotSizes';
import { calculatePipValue, convertLotToUnits } from '../utils/pipCalculator';
import { getExchangeRate } from '../services/api';

import CurrencySelector from '../components/CurrencySelector';
import CurrencyPairSelector from '../components/CurrencyPairSelector';
import LotSizeSelector from '../components/LotSizeSelector';
import PipInput from '../components/PipInput';
import ResultCard from '../components/ResultCard';
import Header from '../components/Header';

interface CalculatorScreenProps {
  navigation: any;
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
  const [refreshing, setRefreshing] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  // Get currency pair details
  const pairDetails = getCurrencyPairBySymbol(currencyPair);
  const quoteCurrency = pairDetails?.quoteCurrency || 'USD';

  // Background and text colors based on theme
  const backgroundColor = isDarkMode ? COLORS.backgroundDark : COLORS.background;
  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const cardColor = isDarkMode ? COLORS.cardDark : COLORS.card;

  // Navigate to info screen
  const navigateToInfo = () => {
    navigation.navigate('Info');
  };

  // Fetch exchange rate
  const fetchExchangeRate = async () => {
    if (!pairDetails) return;
    
    try {
      const { quoteCurrency } = pairDetails;
      if (quoteCurrency === accountCurrency) {
        setExchangeRate(1);
        return;
      }
      
      const rateData = await getExchangeRate(quoteCurrency, accountCurrency);
      setExchangeRate(rateData.rate);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      showMessage({
        message: "Exchange Rate Error",
        description: "Could not fetch current exchange rate. Using estimated values.",
        type: "warning",
      });
    }
  };

  // Calculate pip value when inputs change
  const calculateResults = async () => {
    if (!pairDetails) {
      showMessage({
        message: "Invalid Currency Pair",
        description: "Please select a valid currency pair",
        type: "danger",
      });
      return;
    }

    setIsCalculating(true);

    try {
      // Fetch exchange rate if needed
      if (!exchangeRate) {
        await fetchExchangeRate();
      }
      
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
      
      showMessage({
        message: "Calculation Complete",
        description: "Pip values have been updated",
        type: "success",
      });
    } catch (error) {
      console.error('Calculation error:', error);
      showMessage({
        message: "Calculation Error",
        description: "Failed to calculate pip value. Please try again.",
        type: "danger",
      });
    } finally {
      setIsCalculating(false);
      setRefreshing(false);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    setExchangeRate(null); // Reset exchange rate to force a fresh fetch
    await fetchExchangeRate();
    calculateResults();
  };

  // Fetch exchange rate when currency pair or account currency changes
  useEffect(() => {
    setExchangeRate(null);
    fetchExchangeRate();
  }, [currencyPair, accountCurrency]);

  // Calculate when exchange rate is updated
  useEffect(() => {
    if (exchangeRate !== null) {
      calculateResults();
    }
  }, [exchangeRate]);

  // Update decimal places when currency pair changes
  useEffect(() => {
    if (pairDetails) {
      setDecimalPlaces(pairDetails.pipDecimalPlace);
    }
  }, [currencyPair]);

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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={isDarkMode ? COLORS.primary : COLORS.primary}
            />
          }
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

          <View style={styles.buttonRow}>
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

            <TouchableOpacity
              style={[
                styles.infoButton,
                { backgroundColor: isDarkMode ? COLORS.secondaryDark : COLORS.secondary },
              ]}
              onPress={navigateToInfo}
            >
              <MaterialIcons name="info-outline" size={20} color="#FFFFFF" />
              <Text style={styles.infoButtonText}>Info</Text>
            </TouchableOpacity>
          </View>

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
            <Text style={[styles.footerNote, { color: textColor }]}>
              Pull down to refresh exchange rates
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <FlashMessage position="top" />
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  calculateButton: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  infoButtonText: {
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
    marginBottom: 4,
  },
  footerNote: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default CalculatorScreen;
