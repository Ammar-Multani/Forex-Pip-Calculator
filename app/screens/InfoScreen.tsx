import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import Header from '../components/Header';

interface InfoScreenProps {
  navigation: any;
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
}

const InfoScreen: React.FC<InfoScreenProps> = ({
  navigation,
  isDarkMode = false,
  onThemeToggle,
}) => {
  const backgroundColor = isDarkMode ? COLORS.backgroundDark : COLORS.background;
  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const cardColor = isDarkMode ? COLORS.cardDark : COLORS.card;

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Header
        title="Forex Pip Information"
        isDarkMode={isDarkMode}
        onThemeToggle={onThemeToggle}
        showBackButton
        onBackPress={goBack}
      />

      <ScrollView style={styles.scrollView}>
        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            What is a Pip?
          </Text>
          <Text style={[styles.text, { color: textColor }]}>
            A pip (percentage in point) is the smallest price movement in a trading instrument. For most currency pairs, a pip is a movement in the fourth decimal place (0.0001). For currency pairs involving the Japanese yen, a pip is a movement in the second decimal place (0.01).
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Pip Value Calculation
          </Text>
          <Text style={[styles.text, { color: textColor }]}>
            The pip value is calculated based on:
          </Text>
          <View style={styles.bulletPoint}>
            <MaterialIcons name="arrow-right" size={16} color={textColor} />
            <Text style={[styles.bulletText, { color: textColor }]}>
              The currency pair being traded
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <MaterialIcons name="arrow-right" size={16} color={textColor} />
            <Text style={[styles.bulletText, { color: textColor }]}>
              The size of your position (lot size)
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <MaterialIcons name="arrow-right" size={16} color={textColor} />
            <Text style={[styles.bulletText, { color: textColor }]}>
              The exchange rate between the quote currency and your account currency
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Lot Sizes
          </Text>
          <View style={styles.bulletPoint}>
            <MaterialIcons name="arrow-right" size={16} color={textColor} />
            <Text style={[styles.bulletText, { color: textColor }]}>
              Standard Lot = 100,000 units of the base currency
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <MaterialIcons name="arrow-right" size={16} color={textColor} />
            <Text style={[styles.bulletText, { color: textColor }]}>
              Mini Lot = 10,000 units of the base currency
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <MaterialIcons name="arrow-right" size={16} color={textColor} />
            <Text style={[styles.bulletText, { color: textColor }]}>
              Micro Lot = 1,000 units of the base currency
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <MaterialIcons name="arrow-right" size={16} color={textColor} />
            <Text style={[styles.bulletText, { color: textColor }]}>
              Nano Lot = 100 units of the base currency
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Formula
          </Text>
          <Text style={[styles.text, { color: textColor }]}>
            For currency pairs where USD is the quote currency:
          </Text>
          <Text style={[styles.formula, { color: textColor }]}>
            Pip Value = (Pip Size × Position Size)
          </Text>
          <Text style={[styles.text, { color: textColor, marginTop: 12 }]}>
            For other currency pairs:
          </Text>
          <Text style={[styles.formula, { color: textColor }]}>
            Pip Value = (Pip Size × Position Size) / Exchange Rate
          </Text>
          <Text style={[styles.text, { color: textColor, marginTop: 12 }]}>
            If your account currency differs from the quote currency, the pip value is converted using the current exchange rate.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Example
          </Text>
          <Text style={[styles.text, { color: textColor }]}>
            Trading 1 standard lot (100,000 units) of EUR/USD:
          </Text>
          <Text style={[styles.text, { color: textColor, marginTop: 8 }]}>
            • 1 pip = 0.0001
          </Text>
          <Text style={[styles.text, { color: textColor }]}>
            • Pip value = 0.0001 × 100,000 = $10 per pip
          </Text>
          <Text style={[styles.text, { color: textColor, marginTop: 8 }]}>
            If your account is in EUR and EUR/USD is 1.18:
          </Text>
          <Text style={[styles.text, { color: textColor }]}>
            • Pip value in EUR = $10 / 1.18 = €8.47 per pip
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
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
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 8,
    flex: 1,
  },
  formula: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 8,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
  },
});

export default InfoScreen;