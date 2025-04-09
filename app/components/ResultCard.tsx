import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
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
  const contentTextColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const highlightColor = isDarkMode ? COLORS.primary : COLORS.primaryDark;
  const dividerColor = isDarkMode ? COLORS.borderDark : COLORS.border;

  return (
    <View style={[styles.container, { backgroundColor: cardBgColor }]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <FontAwesome5 name="chart-bar" size={20} color="#FFFFFF" style={styles.headerIcon} />
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: contentTextColor }]}>
            Single Pip Value
          </Text>
          
          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <FontAwesome5 name="money-bill-wave" size={14} color={contentTextColor} style={styles.rowIcon} />
              <Text style={[styles.label, { color: contentTextColor }]}>
                In {quoteCurrency}:
              </Text>
            </View>
            <Text style={[styles.value, { color: contentTextColor }]}>
              {formatCurrency(pipValueInQuoteCurrency, quoteCurrency, 4)}
            </Text>
          </View>

          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <FontAwesome5 name="money-bill-wave" size={14} color={contentTextColor} style={styles.rowIcon} />
              <Text style={[styles.label, { color: contentTextColor }]}>
                In {accountCurrency}:
              </Text>
            </View>
            <Text style={[styles.value, { color: contentTextColor }]}>
              {formatCurrency(pipValueInAccountCurrency, accountCurrency, 4)}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: dividerColor }]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: contentTextColor }]}>
            Total Value
          </Text>
          
          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <FontAwesome5 name="coins" size={14} color={contentTextColor} style={styles.rowIcon} />
              <Text style={[styles.label, { color: contentTextColor }]}>
                In {quoteCurrency}:
              </Text>
            </View>
            <Text style={[styles.value, { color: contentTextColor }]}>
              {formatCurrency(totalValueInQuoteCurrency, quoteCurrency, 2)}
            </Text>
          </View>

          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <FontAwesome5 name="coins" size={14} color={highlightColor} style={styles.rowIcon} />
              <Text style={[styles.label, { color: highlightColor, fontWeight: 'bold' }]}>
                In {accountCurrency}:
              </Text>
            </View>
            <Text style={[styles.valueHighlight, { color: highlightColor }]}>
              {formatCurrency(totalValueInAccountCurrency, accountCurrency, 2)}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: dividerColor }]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: contentTextColor }]}>
            Exchange Information
          </Text>
          
          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <FontAwesome5 name="exchange-alt" size={14} color={contentTextColor} style={styles.rowIcon} />
              <Text style={[styles.label, { color: contentTextColor }]}>
                Rate:
              </Text>
            </View>
            <Text style={[styles.value, { color: contentTextColor }]}>
              1 {quoteCurrency} = {formatNumber(exchangeRate, 4)} {accountCurrency}
            </Text>
          </View>

          <View style={styles.row}>
            <View style={styles.labelContainer}>
              <FontAwesome5 name="clock" size={14} color={contentTextColor} style={styles.rowIcon} />
              <Text style={[styles.label, { color: contentTextColor }]}>
                Updated:
              </Text>
            </View>
            <Text style={[styles.value, { color: contentTextColor }]}>
              {new Date().toLocaleTimeString()}
            </Text>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: 8,
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
    marginVertical: 12,
  },
});

export default ResultCard;
