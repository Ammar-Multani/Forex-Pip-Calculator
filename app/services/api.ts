import axios from 'axios';
import { CURRENCY_PAIRS } from '../constants/currencies';

// Base URL for forex API
const API_URL = 'https://api.exchangerate.host';

// API key (replace with your actual API key if needed)
const API_KEY = '';

// Types
export interface ExchangeRate {
  base: string;
  target: string;
  rate: number;
  timestamp: number;
  date: string;
}

export interface ForexData {
  rates: Record<string, number>;
  base: string;
  timestamp: number;
}

// Get current exchange rates for a base currency
export const getExchangeRates = async (baseCurrency: string): Promise<ForexData> => {
  try {
    const response = await axios.get(`${API_URL}/latest`, {
      params: {
        base: baseCurrency,
        access_key: API_KEY,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Return mock data if API fails
    return getMockExchangeRates(baseCurrency);
  }
};

// Get specific exchange rate between two currencies
export const getExchangeRate = async (
  baseCurrency: string,
  targetCurrency: string
): Promise<ExchangeRate> => {
  try {
    const response = await axios.get(`${API_URL}/convert`, {
      params: {
        from: baseCurrency,
        to: targetCurrency,
        access_key: API_KEY,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    // Return mock data if API fails
    return getMockExchangeRate(baseCurrency, targetCurrency);
  }
};

// Mock data for development or when API fails
export const getMockExchangeRates = (baseCurrency: string): ForexData => {
  const mockRates: Record<string, number> = {
    USD: 1.0,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.33,
    AUD: 1.35,
    CAD: 1.25,
    CHF: 0.92,
    NZD: 1.42,
  };
  
  // Adjust rates based on the base currency
  if (baseCurrency !== 'USD') {
    const baseRate = mockRates[baseCurrency] || 1;
    
    Object.keys(mockRates).forEach(currency => {
      if (currency !== baseCurrency) {
        mockRates[currency] = mockRates[currency] / baseRate;
      }
    });
    
    mockRates[baseCurrency] = 1;
  }
  
  return {
    rates: mockRates,
    base: baseCurrency,
    timestamp: Date.now() / 1000,
  };
};

// Mock exchange rate for development or when API fails
export const getMockExchangeRate = (
  baseCurrency: string,
  targetCurrency: string
): ExchangeRate => {
  const mockRates = getMockExchangeRates(baseCurrency);
  
  return {
    base: baseCurrency,
    target: targetCurrency,
    rate: mockRates.rates[targetCurrency] || 1,
    timestamp: mockRates.timestamp,
    date: new Date().toISOString().split('T')[0],
  };
};

// Get live rates for all currency pairs
export const getLiveCurrencyPairRates = async (): Promise<Record<string, number>> => {
  try {
    // Get USD rates as base for calculations
    const usdRates = await getExchangeRates('USD');
    const pairRates: Record<string, number> = {};
    
    // Calculate rates for all currency pairs
    CURRENCY_PAIRS.forEach(pair => {
      const { baseCurrency, quoteCurrency } = pair;
      
      if (baseCurrency === 'USD') {
        pairRates[pair.symbol] = usdRates.rates[quoteCurrency] || 1;
      } else if (quoteCurrency === 'USD') {
        pairRates[pair.symbol] = 1 / (usdRates.rates[baseCurrency] || 1);
      } else {
        const baseRate = usdRates.rates[baseCurrency] || 1;
        const quoteRate = usdRates.rates[quoteCurrency] || 1;
        pairRates[pair.symbol] = quoteRate / baseRate;
      }
    });
    
    return pairRates;
  } catch (error) {
    console.error('Error fetching live currency pair rates:', error);
    // Return mock data if API fails
    return getMockCurrencyPairRates();
  }
};

// Mock currency pair rates
export const getMockCurrencyPairRates = (): Record<string, number> => {
  const pairRates: Record<string, number> = {
    'EUR/USD': 1.18,
    'GBP/USD': 1.38,
    'USD/JPY': 110.5,
    'USD/CHF': 0.92,
    'USD/CAD': 1.25,
    'AUD/USD': 0.74,
    'NZD/USD': 0.70,
    'EUR/GBP': 0.85,
    'EUR/JPY': 130.5,
    'GBP/JPY': 152.5,
    'AUD/JPY': 82.0,
    'EUR/AUD': 1.59,
    'GBP/AUD': 1.86,
    'AUD/CAD': 0.93,
    'AUD/CHF': 0.68,
    'AUD/NZD': 1.06,
    'CAD/CHF': 0.73,
    'CAD/JPY': 88.4,
    'CHF/JPY': 120.1,
    'EUR/CAD': 1.48,
    'EUR/CHF': 1.08,
    'EUR/NZD': 1.69,
    'GBP/CAD': 1.73,
    'GBP/CHF': 1.27,
    'GBP/NZD': 1.97,
    'NZD/CAD': 0.88,
    'NZD/CHF': 0.64,
    'NZD/JPY': 77.4,
  };
  
  return pairRates;
};