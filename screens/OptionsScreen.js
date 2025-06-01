import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBooking } from './BookingContextScreen';

const OptionsScreen = ({ navigation, route }) => {
  const { eventType, eventDateTime, eventLocation } = route.params || {};
  const { booking, updateBooking } = useBooking();

  // Check if all three categories have been visited
  const allVisited =
    booking.visitedFurniture &&
    booking.visitedUtensils &&
    booking.visitedDecoration;

  const handleNavigate = (screenName, visitedKey) => {
    updateBooking({ [visitedKey]: true });
    navigation.navigate(screenName, { eventType, eventDateTime, eventLocation });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Category</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.categoryButton, styles.decorationButton]}
          onPress={() => handleNavigate('DecorationScreen', 'visitedDecoration')}
        >
          <Text style={styles.buttonText}>
            Decoration {booking.visitedDecoration ? '✓' : ''}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.categoryButton, styles.utensilsButton]}
          onPress={() => handleNavigate('UtensilScreen', 'visitedUtensils')}
        >
          <Text style={styles.buttonText}>
            Utensils {booking.visitedUtensils ? '✓' : ''}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.categoryButton, styles.furnitureButton]}
          onPress={() => handleNavigate('FurnitureScreen', 'visitedFurniture')}
        >
          <Text style={styles.buttonText}>
            Furniture {booking.visitedFurniture ? '✓' : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {allVisited && (
  <TouchableOpacity
    onPress={() => {
      console.log('Navigating...');
      navigation.navigate('BookingConfirmationScreen');
    }}
    style={{
      backgroundColor: '#007AFF',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 40,
      alignSelf: 'center',
      width: '60%',
    }}
  >
    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
      Booking Confirmation
    </Text>
  </TouchableOpacity>
)}

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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  decorationButton: {
    backgroundColor: '#FFB74D',
  },
  utensilsButton: {
    backgroundColor: '#4FC3F7',
  },
  furnitureButton: {
    backgroundColor: '#81C784',
  },
  buttonText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
  },
  proceedButtonContainer: {
    marginTop: 40,
    alignSelf: 'center',
    width: '60%',
  },
});
