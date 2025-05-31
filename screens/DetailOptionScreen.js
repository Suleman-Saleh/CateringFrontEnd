import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const DetailOptionsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const {
    eventType, eventDateTime, eventLocation,
    decoration, utensils, furniture,
  } = route.params;

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

  const dropdownKeys = [
    'spoonType',
    'tableType',
    'lighting',
    'soundSystem',
    'stage',
    'photography',
    'drinks',
  ];

  const handleConfirm = () => {
    const values = Object.values(dropdowns);
    if (values.some(val => !val)) {
      alert('Please fill out all dropdowns before proceeding.');
      return;
    }

    navigation.navigate('Summary', {
      ...route.params,
      ...dropdowns,
    });
  };

  const renderDropdownItem = ({ item, index }) => {
    const key = item;
    const label = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());

    return (
      <View style={{ zIndex: 1000 - index * 100 }}>
        <Text style={styles.label}>{label}</Text>
        <DropDownPicker
          open={openDropdown === key}
          value={dropdowns[key]}
          items={dropdownOptions[key]}
          setOpen={() => setOpenDropdown(openDropdown === key ? null : key)}
          setValue={(cb) =>
            setDropdowns((prev) => ({ ...prev, [key]: cb(prev[key]) }))
          }
          placeholder={`Select ${label}`}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <FlatList
        ListHeaderComponent={
          <View style={styles.container}>
            {/* <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>← Back to Decoration</Text>
            </TouchableOpacity> */}

            <Text style={styles.title}>Detail Options</Text>

            <Text style={styles.info}>Event Type: {eventType}</Text>
            <Text style={styles.info}>Date & Time: {eventDateTime}</Text>
            <Text style={styles.info}>
              Location: Lat {eventLocation?.latitude}, Lng {eventLocation?.longitude}
            </Text>
            <Text style={styles.info}>Decoration: {decoration}</Text>
            <Text style={styles.info}>Utensils: {utensils}</Text>
            <Text style={styles.info}>Furniture: {furniture}</Text>
          </View>
        }
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        data={dropdownKeys}
        keyExtractor={(item) => item}
        renderItem={renderDropdownItem}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={
          <View style={styles.buttonContainer}>
            <Button title="Review Summary" onPress={handleConfirm} />
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
};

export default DetailOptionsScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  backButton: {
    color: '#007AFF',
    fontSize: 16,
    marginBottom: 10,
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
  },
  dropdownContainer: {
    borderColor: '#ccc',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 40,
  },
});
