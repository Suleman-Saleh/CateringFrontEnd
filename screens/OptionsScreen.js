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

export default function OptionsScreen({ navigation, route }) {
  // Get customerId from the navigation route params.
  const { customerId } = route.params || {};

  const [selectedTab, setSelectedTab] = useState('Decoration');
  const { updateBooking, booking } = useBooking();
  const { visitedDecoration, visitedUtensils, visitedFurniture, cartItems } = booking;

  // ✅ FIX: Removed 'booking' from the dependency array to prevent the infinite loop.
  // The hook now only runs when customerId or updateBooking change, which they won't on every render.
  useEffect(() => {
  if (customerId) {
    updateBooking({ customerId });
    console.log("Booking object updated with customerId:", customerId);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [customerId]);


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
              size={18}
              color={isSelected ? '#fff' : '#2C3E50'}
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
    <LinearGradient
      colors={['#4A90E2', '#2C3E50']}
      start={{ x: 0, y: 0 }}   // left side
  end={{ x: 1, y: 0 }} // 🔵 unified blue gradient
      style={styles.container}
    >
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
                ? '#4A90E2'
                : stepStatus === 'finished'
                ? '#fff'
                : '#90A4AE';
            const bgColor =
              stepStatus === 'current'
                ? '#fff'
                : stepStatus === 'finished'
                ? '#4A90E2'
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
          onPress={() => navigation.navigate('BookingConfirmationScreen', { customerId })}
        >
          <Text style={styles.proceedText}>Continue to Summary</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 5 },
  stepWrapper: {
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
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
    margin: 8,
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
    backgroundColor: '#4A90E2',
  },
  pillText: {
    color: '#2C3E50',
    fontWeight: '500',
    fontSize: 14,
  },
  activePillText: {
    color: '#fff',
  },
  progressText: { textAlign: 'center', marginVertical: 8, fontSize: 13, color: '#fff' },
  contentContainer: { flex: 1, marginHorizontal: 16, marginBottom: 80 },
  proceedButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  proceedText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
