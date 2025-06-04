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

import StepIndicator from 'react-native-step-indicator';
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

  const labels = ['Event Info', 'Services', 'Summary', 'Payment'];
  const icons = ['calendar', 'paint-brush', 'list-alt', 'credit-card'];

  const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#6A1B9A',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#6A1B9A',
    stepStrokeUnFinishedColor: '#D1C4E9',
    separatorFinishedColor: '#6A1B9A',
    separatorUnFinishedColor: '#D1C4E9',
    stepIndicatorFinishedColor: '#6A1B9A',
    stepIndicatorUnFinishedColor: '#FFFFFF',
    stepIndicatorCurrentColor: '#FFFFFF',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#6A1B9A',
    stepIndicatorLabelFinishedColor: '#FFFFFF',
    stepIndicatorLabelUnFinishedColor: '#D1C4E9',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#6A1B9A',
  };

  return (
    <View style={styles.container}>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={1}
        labels={labels}
        stepCount={4}
      />

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
    backgroundColor: '#6A1B9A',
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
    backgroundColor: '#6A1B9A',
  },
  proceedText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
