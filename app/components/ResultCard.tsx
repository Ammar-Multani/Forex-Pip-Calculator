import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { formatCurrency, formatNumber } from '../utils/pipCalculator';

interface ResultCardProps {
  title: string;
  pipValueInQuoteCurrency: number;
  pipValueInAccountCurrency: number;
  totalValueInQuoteCurrency: number;
  totalValueInAccountCurrency: number;
  quoteCurrency: string;
  accountCurrency: string;
  exchangeRate: number;
  isDarkMode?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({
  title,
  pipValueInQuoteCurrency,
  pipValueInAccountCurrency,
  totalValueInQuoteCurrency,
  totalValueInAccountCurrency,
  quoteCurrency,
  accountCurrency,
  exchangeRate,
  isDarkMode = false,
}) => {
  const gradientColors = isDarkMode
    ? [COLORS.primaryDark, COLORS.secondaryDark]
    : [COLORS.primary, COLORS.secondary];

  const textColor = COLORS.textDark;
  const cardBgColor = isDarkMode ? COLORS.cardDark : COLORS.card;

  return (
    <View style={[styles.container, { backgroundColor: cardBgColor }]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: isDarkMode ? COLORS.textDark : COLORS.text }]}>
            Pip Value ({quoteCurrency}):
          </Text>
          <Text style={[styles.value, { color: isDarkMode ? COLORS.textDark : COLORS.text }]}>
            {formatCurrency(pipValueInQuoteCurrency, quoteCurrency, 4)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: isDarkMode ? COLORS.textDark : COLORS.text }]}>
            Pip Value ({accountCurrency}):
          </Text>
          <Text style={[styles.value, { color: isDarkMode ? COLORS.textDark : COLORS.text }]}>
            {formatCurrency(pipValueInAccountCurrency, accountCurrency, 4)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={[styles.label, { color: isDarkMode ? COLORS.textDark : COLORS.text }]}>
            Total Value ({quoteCurrency}):
          </Text>
          <Text style={[styles.value, { color: isDarkMode ? COLORS.textDark : COLORS.text }]}>
            {formatCurrency(totalValueInQuoteCurrency, quoteCurrency, 2)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: isDarkMode ? COLORS.textDark : COLORS.text }]}>
            Total Value ({accountCurrency}):
          </Text>
          <Text style={[styles.valueHighlight, { color: isDarkMode ? COLORS.primary : COLORS.primaryDark }]}>
            {formatCurrency(totalValueInAccountCurrency, accountCurrency, 2)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={[styles.label, { color: isDarkMode ? COLORS.textDark : COLORS.text }]}>
            Exchange Rate:
          </Text>
          <Text style={[styles.value, { color: isDarkMode ? COLORS.textDark : COLORS.text }]}>
            1 {quoteCurrency} = {formatNumber(exchangeRate, 4)} {accountCurrency}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: isDarkMode ? COLORS.textDark : COLORS.text }]}>
            Last Updated:
          </Text>
          <Text style={[styles.value, { color: isDarkMode ? COLORS.textDark : COLORS.text }]}>
            {new Date().toLocaleTimeString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
  },
  valueHighlight: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
});

export default ResultCard;