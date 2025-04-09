import { getCurrencyPairBySymbol } from '../constants/currencies';
import { getLotUnits } from '../constants/lotSizes';
import { getExchangeRate, getMockExchangeRate } from '../services/api';

// Types
export interface PipCalculationResult {
  pipValueInQuoteCurrency: number;
  pipValueInAccountCurrency: number;
  totalValueInQuoteCurrency: number;
  totalValueInAccountCurrency: number;
  exchangeRate: number;
}

/**
 * Calculate pip value for a given currency pair and position size
 */
export const calculatePipValue = async (
  currencyPairSymbol: string,
  positionSize: number,
  pipAmount: number,
  accountCurrency: string
): Promise<PipCalculationResult> => {
  // Get currency pair details
  const currencyPair = getCurrencyPairBySymbol(currencyPairSymbol);
  
  if (!currencyPair) {
    throw new Error(`Currency pair ${currencyPairSymbol} not found`);
  }
  
  const { baseCurrency, quoteCurrency, pipValue } = currencyPair;
  
  // Calculate pip value in quote currency
  const pipValueInQuoteCurrency = positionSize * pipValue;
  const totalValueInQuoteCurrency = pipValueInQuoteCurrency * pipAmount;
  
  // If account currency is the same as quote currency, no conversion needed
  if (accountCurrency === quoteCurrency) {
    return {
      pipValueInQuoteCurrency,
      pipValueInAccountCurrency: pipValueInQuoteCurrency,
      totalValueInQuoteCurrency,
      totalValueInAccountCurrency: totalValueInQuoteCurrency,
      exchangeRate: 1,
    };
  }
  
  // Get exchange rate from quote currency to account currency
  let exchangeRate = 1;
  try {
    const rateData = await getExchangeRate(quoteCurrency, accountCurrency);
    exchangeRate = rateData.rate;
  } catch (error) {
    console.error('Error fetching exchange rate, using mock data:', error);
    const mockRate = getMockExchangeRate(quoteCurrency, accountCurrency);
    exchangeRate = mockRate.rate;
  }
  
  // Calculate pip value in account currency
  const pipValueInAccountCurrency = pipValueInQuoteCurrency * exchangeRate;
  const totalValueInAccountCurrency = totalValueInQuoteCurrency * exchangeRate;
  
  return {
    pipValueInQuoteCurrency,
    pipValueInAccountCurrency,
    totalValueInQuoteCurrency,
    totalValueInAccountCurrency,
    exchangeRate,
  };
};

/**
 * Calculate position size based on risk parameters
 */
export const calculatePositionSize = (
  accountBalance: number,
  riskPercentage: number,
  stopLossPips: number,
  pipValue: number
): number => {
  // Calculate risk amount in account currency
  const riskAmount = accountBalance * (riskPercentage / 100);
  
  // Calculate position size
  const positionSize = riskAmount / (stopLossPips * pipValue);
  
  return positionSize;
};

/**
 * Format currency value for display
 */
export const formatCurrency = (
  value: number,
  currencyCode: string,
  decimals: number = 2
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format number with commas
 */
export const formatNumber = (
  value: number,
  decimals: number = 2
): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Get pip decimal place for a currency pair
 */
export const getPipDecimalPlace = (currencyPairSymbol: string): number => {
  const pair = getCurrencyPairBySymbol(currencyPairSymbol);
  return pair ? pair.pipDecimalPlace : 4;
};

/**
 * Convert lot type and count to units
 */
export const convertLotToUnits = (
  lotType: keyof typeof import('../constants/lotSizes').LOT_SIZES,
  lotCount: number
): number => {
  const unitPerLot = getLotUnits(lotType);
  return unitPerLot * lotCount;
};