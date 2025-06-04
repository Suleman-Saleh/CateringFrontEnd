import React, { useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
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
  const [selectedTab, setSelectedTab] = useState('Decoration');
  const { booking } = useBooking();
  const { visitedDecoration, visitedUtensils, visitedFurniture, cartItems } = booking;

  const canProceed =
    visitedDecoration &&
    visitedUtensils &&
    visitedFurniture &&
    cartItems.length > 0;

  const tabs = [
    { key: 'Decoration', icon: 'balloon-outline' },
    { key: 'Utensils', icon: 'silverware-fork-knife' },
    { key: 'Furniture', icon: 'sofa-outline' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.stepperContainer}>
          <View style={[styles.step, styles.stepCompleted]}>
            <Text style={styles.stepText}>1</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={[styles.step, styles.stepActive]}>
            <Text style={styles.stepText}>2</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.step}>
            <Text style={styles.stepText}>3</Text>
          </View>
        </View>
        <Text style={styles.identifierText}>Step 2 of 3: Choose Essentials</Text>
      </View>

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
              size={24}
              color={selectedTab === key ? '#ffffff' : '#1e293b'}
              style={{ marginBottom: 4 }}
            />
            <Text
              style={[styles.tabText, selectedTab === key && styles.activeTabText]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.progressText}>Step Progress: {[visitedDecoration, visitedUtensils, visitedFurniture].filter(Boolean).length}/3 Completed</Text>

      <View style={styles.contentContainer}>
        {selectedTab === 'Decoration' && <DecorationSection navigation={navigation} />}
        {selectedTab === 'Utensils' && <UtensilScreen navigation={navigation} />}
        {selectedTab === 'Furniture' && <FurnitureScreen navigation={navigation} />}
      </View>

      {canProceed && (
        <TouchableOpacity
          style={styles.proceedButton}
          onPress={() => navigation.navigate('BookingConfirmationScreen')}
        >
          <Text style={styles.proceedText}>Continue to Payment</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  step: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  stepCompleted: {
    backgroundColor: '#4ade80',
    borderColor: '#4ade80',
  },
  stepActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  stepText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  stepLine: {
    height: 2,
    width: 20,
    backgroundColor: '#cbd5e1',
  },
  identifierText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1e40af',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 6,
    backgroundColor: '#f3f4f6',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#e5e7eb',
  },
  activeTab: {
    backgroundColor: '#6366f1',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1e293b',
  },
  activeTabText: {
    color: '#ffffff',
  },
  progressText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
    color: '#334155',
  },
  contentContainer: {
    flex: 1,
  },
  proceedButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#3b82f6',
  },
  proceedText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
