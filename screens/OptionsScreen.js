import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const OptionsScreen = ({ navigation, route }) => {
  const { eventType, eventDateTime, eventLocation } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Category</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.categoryButton, styles.decorationButton]}
          onPress={() => navigation.navigate('DecorationScreen', { eventType, eventDateTime, eventLocation })}
        >
          <Text style={styles.buttonText}>Decoration</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.categoryButton, styles.utensilsButton]}
          onPress={() => navigation.navigate('UtensilScreen', { eventType, eventDateTime, eventLocation })}
        >
          <Text style={styles.buttonText}>Utensils</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.categoryButton, styles.furnitureButton]}
          onPress={() => navigation.navigate('FurnitureScreen', { eventType, eventDateTime, eventLocation })}
        >
          <Text style={styles.buttonText}>Furniture</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OptionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 20,
  },
  categoryButton: {
    backgroundColor: '#fff',
    paddingVertical: 25,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  decorationButton: {
    backgroundColor: '#FFB74D', // warm orange
  },
  utensilsButton: {
    backgroundColor: '#4FC3F7', // soft blue
  },
  furnitureButton: {
    backgroundColor: '#81C784', // soft green
  },
  buttonText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
  },
});
