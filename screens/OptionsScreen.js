import React, { useState } from 'react';
import {
  Dimensions,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useBooking } from './BookingContextScreen';
import DecorationScreen from './DecorationScreen';
import FurnitureScreen from './FurnitureScreen';
import UtensilScreen from './UtensilScreen';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

export default function OptionsScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('Decoration');
  const { updateBooking, booking } = useBooking();
  const { visitedDecoration, visitedUtensils, visitedFurniture, cartItems } = booking;

  const canProceed =
    visitedDecoration && visitedUtensils && visitedFurniture && cartItems.length > 0;

  const tabs = [
    { key: 'Decoration', icon: 'paint-brush' },
    { key: 'Utensils', icon: 'cutlery' },
    { key: 'Furniture', icon: 'bed' },
  ];

  const labels = ['Event Info', 'Services', 'Summary', 'Payment'];
  const icons = ['calendar', 'paint-brush', 'list-alt', 'credit-card'];





  const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 5,
    stepStrokeCurrentColor: '#8852a9ff',
    stepStrokeWidth: 5,
    stepStrokeFinishedColor: 'white',
    stepStrokeUnFinishedColor: 'grey',
    separatorFinishedColor: 'white',
    separatorUnFinishedColor: '#D1C4E9',
    stepIndicatorFinishedColor: '#6A1B9A',
    stepIndicatorUnFinishedColor: '#FFFFFF',
    stepIndicatorCurrentColor: '#FFFFFF',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#6A1B9A',
    stepIndicatorLabelFinishedColor: '#FFFFFF',
    stepIndicatorLabelUnFinishedColor: '#D1C4E9',
    labelColor: 'grey',
    labelSize: 14,
    finishedStepLabelColor: 'white',
    currentStepLabelColor: 'white',
  };

  const handleTabPress = (key) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedTab(key);

    if (key === 'Decoration' && !visitedDecoration) updateBooking({ visitedDecoration: true });
    else if (key === 'Utensils' && !visitedUtensils) updateBooking({ visitedUtensils: true });
    else if (key === 'Furniture' && !visitedFurniture) updateBooking({ visitedFurniture: true });
  };

  const renderCurrentTab = () => {
    switch (selectedTab) {
      case 'Decoration':
        return <DecorationScreen navigation={navigation} />;
      case 'Utensils':
        return <UtensilScreen navigation={navigation} />;
      case 'Furniture':
        return <FurnitureScreen navigation={navigation} />;
      default:
        return null;
    }
  };

  // Compact category tabs
  const PillTabs = ({ categories, selected, onSelect }) => (
    <View style={styles.pillContainer}>
      {categories.map((cat) => {
        const isSelected = selected === cat.key;
        return (
          <TouchableOpacity
            key={cat.key}
            onPress={() => onSelect(cat.key)}
            style={[styles.pillTab, isSelected && styles.activePill]}
          >
            <Icon
              name={cat.icon}
              size={18} // slightly smaller
              color={isSelected ? '#fff' : '#6B7280'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.pillText, isSelected && styles.activePillText]}>
              {cat.key}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Step Indicator */}
      <View style={styles.stepWrapper}>
        <StepIndicator
          customStyles={customStyles}
          currentPosition={1}
          labels={labels}
          stepCount={4}
          renderStepIndicator={({ position, stepStatus }) => {
            const iconName = icons[position];
            const color =
              stepStatus === 'current'
                ? '#6A1B9A'
                : stepStatus === 'finished'
                ? '#fff'
                : '#D1C4E9';
            const bgColor =
              stepStatus === 'current'
                ? '#fff'
                : stepStatus === 'finished'
                ? '#6A1B9A'
                : '#fff';
            return (
              <View style={[styles.stepIndicator, { backgroundColor: bgColor }]}>
                <Icon name={iconName} size={16} color={color} />
              </View>
            );
          }}
        />
      </View>

      {/* Category Tabs */}
      <PillTabs categories={tabs} selected={selectedTab} onSelect={handleTabPress} />

      {/* Progress Text */}
      <Text style={styles.progressText}>
        Step Progress:{' '}
        {[visitedDecoration, visitedUtensils, visitedFurniture].filter(Boolean).length}/3 Completed
      </Text>

      {/* Tab Content */}
      <ScrollView style={styles.contentContainer}>
        {renderCurrentTab()}
      </ScrollView>

      {/* Continue Button */}
      {canProceed && (
        <TouchableOpacity
          style={styles.proceedButton}
          onPress={() => navigation.navigate('BookingConfirmationScreen')}
        >
          <Text style={styles.proceedText}>Continue to Summary</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 5 },
  stepWrapper: {
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#6A1B9A',
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    margin: 8, // smaller gap
  },
  pillTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14, // smaller pill width
    paddingVertical: 10,    // smaller pill height
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
  },
  activePill: {
    backgroundColor: '#6A1B9A',
  },
  pillText: {
    color: '#374151',
    fontWeight: '500',
    fontSize: 14, // lighter text size
  },
  activePillText: {
    color: '#fff',
  },
  progressText: { textAlign: 'center', marginVertical: 8, fontSize: 13, color: '#374151' },
  contentContainer: { flex: 1, marginHorizontal: 16, marginBottom: 80 },
  proceedButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#6A1B9A',
    shadowColor: '#6A1B9A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  proceedText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
