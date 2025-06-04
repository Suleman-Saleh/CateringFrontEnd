import React, { useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  useColorScheme,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useBooking } from './BookingContextScreen';
import DecorationSection from './DecorationScreen';
import FurnitureScreen from './FurnitureScreen';
import UtensilScreen from './UtensilScreen';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function OptionsScreen({ navigation }) {
  // Get visited flags and booking from context correctly
  const [selectedTab, setSelectedTab] = useState('Decoration');
const { booking } = useBooking();

const { visitedDecoration, visitedUtensils, visitedFurniture, cartItems } = booking;
const canProceed =
  visitedDecoration &&
  visitedUtensils &&
  visitedFurniture &&
  cartItems.length > 0;


  // Proceed only if all categories visited AND cart is not empty

  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const tabs = [
    { key: 'Decoration', icon: 'balloon' },
    { key: 'Utensils', icon: 'silverware-fork-knife' },
    { key: 'Furniture', icon: 'sofa' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5' }]}>
      <View style={styles.tabsContainer}>
        {tabs.map(({ key, icon }) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, selectedTab === key && styles.activeTab]}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setSelectedTab(key);
            }}
          >
            <Icon
              name={icon}
              size={20}
              color={selectedTab === key ? '#fff' : isDark ? '#ccc' : '#333'}
              style={{ marginBottom: 4 }}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === key && styles.activeTabText,
                { color: isDark ? '#ccc' : '#333' },
              ]}
            >
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.progressText, { color: isDark ? '#aaa' : '#444' }]}>
        {`Progress: ${
          [visitedDecoration, visitedUtensils, visitedFurniture].filter(Boolean).length
        }/3 completed`}
      </Text>

      <View style={styles.contentContainer}>
        {selectedTab === 'Decoration' && <DecorationSection navigation={navigation} />}
        {selectedTab === 'Utensils' && <UtensilScreen navigation={navigation} />}
        {selectedTab === 'Furniture' && <FurnitureScreen navigation={navigation} />}
      </View>

      {canProceed && (
        <TouchableOpacity
          style={[styles.proceedButton, { backgroundColor: isDark ? '#3b82f6' : '#2e86de' }]}
          onPress={() => navigation.navigate('BookingConfirmationScreen')}
        >
          <Text style={styles.proceedText}>Proceed to Payment</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    marginBottom: 8,
  },
  tab: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#d1d5db',
    flex: 1,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#6366f1',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  progressText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
  },
  proceedButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  proceedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
