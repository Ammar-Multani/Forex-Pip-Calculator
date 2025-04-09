// Major currencies
export const MAJOR_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
];

// Common currency pairs
export const CURRENCY_PAIRS = [
  { symbol: 'EUR/USD', baseCurrency: 'EUR', quoteCurrency: 'USD', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'GBP/USD', baseCurrency: 'GBP', quoteCurrency: 'USD', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'USD/JPY', baseCurrency: 'USD', quoteCurrency: 'JPY', pipDecimalPlace: 2, pipValue: 0.01 },
  { symbol: 'USD/CHF', baseCurrency: 'USD', quoteCurrency: 'CHF', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'USD/CAD', baseCurrency: 'USD', quoteCurrency: 'CAD', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'AUD/USD', baseCurrency: 'AUD', quoteCurrency: 'USD', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'NZD/USD', baseCurrency: 'NZD', quoteCurrency: 'USD', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'EUR/GBP', baseCurrency: 'EUR', quoteCurrency: 'GBP', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'EUR/JPY', baseCurrency: 'EUR', quoteCurrency: 'JPY', pipDecimalPlace: 2, pipValue: 0.01 },
  { symbol: 'GBP/JPY', baseCurrency: 'GBP', quoteCurrency: 'JPY', pipDecimalPlace: 2, pipValue: 0.01 },
  { symbol: 'AUD/JPY', baseCurrency: 'AUD', quoteCurrency: 'JPY', pipDecimalPlace: 2, pipValue: 0.01 },
  { symbol: 'EUR/AUD', baseCurrency: 'EUR', quoteCurrency: 'AUD', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'GBP/AUD', baseCurrency: 'GBP', quoteCurrency: 'AUD', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'AUD/CAD', baseCurrency: 'AUD', quoteCurrency: 'CAD', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'AUD/CHF', baseCurrency: 'AUD', quoteCurrency: 'CHF', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'AUD/NZD', baseCurrency: 'AUD', quoteCurrency: 'NZD', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'CAD/CHF', baseCurrency: 'CAD', quoteCurrency: 'CHF', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'CAD/JPY', baseCurrency: 'CAD', quoteCurrency: 'JPY', pipDecimalPlace: 2, pipValue: 0.01 },
  { symbol: 'CHF/JPY', baseCurrency: 'CHF', quoteCurrency: 'JPY', pipDecimalPlace: 2, pipValue: 0.01 },
  { symbol: 'EUR/CAD', baseCurrency: 'EUR', quoteCurrency: 'CAD', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'EUR/CHF', baseCurrency: 'EUR', quoteCurrency: 'CHF', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'EUR/NZD', baseCurrency: 'EUR', quoteCurrency: 'NZD', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'GBP/CAD', baseCurrency: 'GBP', quoteCurrency: 'CAD', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'GBP/CHF', baseCurrency: 'GBP', quoteCurrency: 'CHF', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'GBP/NZD', baseCurrency: 'GBP', quoteCurrency: 'NZD', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'NZD/CAD', baseCurrency: 'NZD', quoteCurrency: 'CAD', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'NZD/CHF', baseCurrency: 'NZD', quoteCurrency: 'CHF', pipDecimalPlace: 4, pipValue: 0.0001 },
  { symbol: 'NZD/JPY', baseCurrency: 'NZD', quoteCurrency: 'JPY', pipDecimalPlace: 2, pipValue: 0.01 },
];

// Get currency by code
export const getCurrencyByCode = (code: string) => {
  return MAJOR_CURRENCIES.find(currency => currency.code === code);
};

// Get currency pair by symbol
export const getCurrencyPairBySymbol = (symbol: string) => {
  return CURRENCY_PAIRS.find(pair => pair.symbol === symbol);
};

// Get all currency codes
export const getAllCurrencyCodes = () => {
  return MAJOR_CURRENCIES.map(currency => currency.code);
};