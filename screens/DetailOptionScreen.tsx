import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Button,
    KeyboardAvoidingView, Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const DetailOptionsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const {
    eventType, eventDateTime, eventLocation,
    decoration, utensils, furniture,
  } = route.params;

  // Dropdown states
  const [dropdowns, setDropdowns] = useState({
    spoonType: null,
    tableType: null,
    lighting: null,
    soundSystem: null,
    stage: null,
    photography: null,
    drinks: null,
  });

  const [openDropdown, setOpenDropdown] = useState(null);

  const dropdownOptions = {
    spoonType: [
      { label: 'Plastic', value: 'Plastic' },
      { label: 'Steel', value: 'Steel' },
      { label: 'Wooden', value: 'Wooden' },
      { label: 'None', value: 'None' },
    ],
    tableType: [
      { label: 'Round', value: 'Round' },
      { label: 'Rectangular', value: 'Rectangular' },
      { label: 'Cocktail', value: 'Cocktail' },
      { label: 'None', value: 'None' },
    ],
    lighting: [
      { label: 'Fairy Lights', value: 'Fairy Lights' },
      { label: 'Spotlights', value: 'Spotlights' },
      { label: 'Candle Lighting', value: 'Candle Lighting' },
      { label: 'No Lighting', value: 'No Lighting' },
    ],
    soundSystem: [
      { label: 'DJ Setup', value: 'DJ Setup' },
      { label: 'Basic Speakers', value: 'Basic Speakers' },
      { label: 'No Sound System', value: 'None' },
    ],
    stage: [
      { label: 'Small', value: 'Small' },
      { label: 'Medium', value: 'Medium' },
      { label: 'Large', value: 'Large' },
      { label: 'None', value: 'None' },
    ],
    photography: [
      { label: 'Included', value: 'Included' },
      { label: 'Optional', value: 'Optional' },
      { label: 'Not Required', value: 'Not Required' },
    ],
    drinks: [
      { label: 'Water Only', value: 'Water Only' },
      { label: 'Soft Drinks', value: 'Soft Drinks' },
      { label: 'Mocktails', value: 'Mocktails' },
      { label: 'No Drinks', value: 'No Drinks' },
    ],
  };

  const handleConfirm = () => {
  const values = Object.values(dropdowns);
  if (values.some(val => !val)) {
    alert('Please fill out all dropdowns before proceeding.');
    return;
  }

  // Navigate to the Summary screen instead of Payment
  navigation.navigate('Summary', {
    ...route.params,
    ...dropdowns,
  });
};

  const renderDropdown = (label, key, zIndex) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <DropDownPicker
        open={openDropdown === key}
        value={dropdowns[key]}
        items={dropdownOptions[key]}
        setOpen={() => setOpenDropdown(openDropdown === key ? null : key)}
        setValue={(cb) => setDropdowns(prev => ({ ...prev, [key]: cb(prev[key]) }))}
        placeholder={`Select ${label}`}
        style={styles.dropdown}
        dropDownContainerStyle={{ zIndex }}
        zIndex={zIndex}
      />
    </>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Detail Options</Text>

        <Text style={styles.info}>Event Type: {eventType}</Text>
        <Text style={styles.info}>Date & Time: {eventDateTime}</Text>
        <Text style={styles.info}>Location: Lat {eventLocation?.latitude}, Lng {eventLocation?.longitude}</Text>
        <Text style={styles.info}>Decoration: {decoration}</Text>
        <Text style={styles.info}>Utensils: {utensils}</Text>
        <Text style={styles.info}>Furniture: {furniture}</Text>

        {/* Render dropdowns */}
        {renderDropdown('Spoon Type', 'spoonType', 1000)}
        {renderDropdown('Table Type', 'tableType', 900)}
        {renderDropdown('Lighting', 'lighting', 800)}
        {renderDropdown('Sound System', 'soundSystem', 700)}
        {renderDropdown('Stage Setup', 'stage', 600)}
        {renderDropdown('Photography', 'photography', 500)}
        {renderDropdown('Drinks & Refreshments', 'drinks', 400)}

        <View style={styles.buttonContainer}>
          <Button title="Review Summary" onPress={handleConfirm} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DetailOptionsScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  label: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  dropdown: {
    backgroundColor: '#f2f2f2',
    borderColor: '#ccc',
    marginTop: 6,
    zIndex: 1000,
  },
  buttonContainer: {
    marginTop: 30,
  },
});
