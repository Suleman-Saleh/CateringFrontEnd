import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, TouchableOpacity, FlatList
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

const DecorationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { eventType, eventDateTime, eventLocation } = route.params;

  const [decorationOpen, setDecorationOpen] = useState(false);
  const [utensilsOpen, setUtensilsOpen] = useState(false);
  const [furnitureOpen, setFurnitureOpen] = useState(false);

  const [decoration, setDecoration] = useState(null);
  const [utensils, setUtensils] = useState(null);
  const [furniture, setFurniture] = useState(null);
  const [additionalDetails, setAdditionalDetails] = useState('');

  const [decorationItems, setDecorationItems] = useState([
    { label: 'Floral', value: 'Floral' },
    { label: 'Modern', value: 'Modern' },
    { label: 'Rustic', value: 'Rustic' },
    { label: 'Classic', value: 'Classic' },
  ]);

  const [utensilsItems, setUtensilsItems] = useState([
    { label: 'Plastic', value: 'Plastic' },
    { label: 'Steel', value: 'Steel' },
    { label: 'Porcelain', value: 'Porcelain' },
    { label: 'Eco-Friendly', value: 'Eco-Friendly' },
  ]);

  const [furnitureItems, setFurnitureItems] = useState([
    { label: 'Chairs & Tables', value: 'Chairs & Tables' },
    { label: 'Sofas & Lounges', value: 'Sofas & Lounges' },
    { label: 'Outdoor Setup', value: 'Outdoor Setup' },
    { label: 'None', value: 'None' },
  ]);

  const onDecorationOpen = useCallback(() => {
    setUtensilsOpen(false);
    setFurnitureOpen(false);
  }, []);

  const onUtensilsOpen = useCallback(() => {
    setDecorationOpen(false);
    setFurnitureOpen(false);
  }, []);

  const onFurnitureOpen = useCallback(() => {
    setDecorationOpen(false);
    setUtensilsOpen(false);
  }, []);

  const handleNext = () => {
    if (!decoration || !utensils || !furniture) {
      Alert.alert('Missing Fields', 'Please select Decoration, Utensils, and Furniture.');
      return;
    }

    navigation.navigate('DetailOptions', {
      eventType,
      eventDateTime,
      eventLocation,
      decoration,
      utensils,
      furniture,
      additionalDetails,
    });
  };

  const renderContent = () => (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>← Back to Event Info</Text>
      </TouchableOpacity> */}

      <Text style={styles.title}>Decoration and Other Options</Text>

      <Text style={styles.label}>Decoration</Text>
      <DropDownPicker
        open={decorationOpen}
        value={decoration}
        items={decorationItems}
        setOpen={setDecorationOpen}
        setValue={setDecoration}
        setItems={setDecorationItems}
        placeholder="Select Decoration"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        onOpen={onDecorationOpen}
      />

      <Text style={styles.label}>Utensils</Text>
      <DropDownPicker
        open={utensilsOpen}
        value={utensils}
        items={utensilsItems}
        setOpen={setUtensilsOpen}
        setValue={setUtensils}
        setItems={setUtensilsItems}
        placeholder="Select Utensils"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        onOpen={onUtensilsOpen}
      />

      <Text style={styles.label}>Furniture</Text>
      <DropDownPicker
        open={furnitureOpen}
        value={furniture}
        items={furnitureItems}
        setOpen={setFurnitureOpen}
        setValue={setFurniture}
        setItems={setFurnitureItems}
        placeholder="Select Furniture"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        onOpen={onFurnitureOpen}
      />

      <Text style={styles.label}>Additional Details (e.g., Spoon Types, Table Types)</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Specify any special details here"
        multiline
        value={additionalDetails}
        onChangeText={setAdditionalDetails}
      />

      <View style={styles.buttonContainer}>
        <Button title="Next: Detail Options" onPress={handleNext} />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={renderContent}
        keyboardShouldPersistTaps="handled"
      />
    </KeyboardAvoidingView>
  );
};

export default DecorationScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    color: '#007AFF',
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
    color: '#333',
  },
  dropdown: {
    borderColor: '#ccc',
    marginBottom: 8,
    borderRadius: 6,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    borderRadius: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginTop: 6,
  },
  buttonContainer: {
    marginTop: 30,
  },
});
