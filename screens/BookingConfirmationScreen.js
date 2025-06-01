import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

const BookingConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    eventType,
    eventDateTime,
    eventLocation,
    decoration,
    utensils,
    furniture,
    spoonType,
    tableType,
    lighting,
    soundSystem,
    stage,
    photography,
    drinks,
    paymentInfo,
  } = route.params;

  const handleBackToHome = () => {
    navigation.popToTop(); // or navigation.navigate('Home') if you have a home screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎉 Booking Confirmed!</Text>
      <Text style={styles.subtitle}>Your event has been successfully booked.</Text>

      <Text style={styles.sectionTitle}>Event Summary</Text>

      <View style={styles.detailBox}>
        <Text style={styles.label}>Event Type:</Text>
        <Text>{eventType}</Text>

        <Text style={styles.label}>Date & Time:</Text>
        <Text>{eventDateTime}</Text>

        <Text style={styles.label}>Location:</Text>
        <Text>Lat: {eventLocation?.latitude}, Lng: {eventLocation?.longitude}</Text>

        <Text style={styles.label}>Decoration:</Text>
        <Text>{decoration}</Text>

        <Text style={styles.label}>Utensils:</Text>
        <Text>{utensils}</Text>

        <Text style={styles.label}>Furniture:</Text>
        <Text>{furniture}</Text>

        <Text style={styles.label}>Spoon Type:</Text>
        <Text>{spoonType}</Text>

        <Text style={styles.label}>Table Type:</Text>
        <Text>{tableType}</Text>

        <Text style={styles.label}>Lighting:</Text>
        <Text>{lighting}</Text>

        <Text style={styles.label}>Sound System:</Text>
        <Text>{soundSystem}</Text>

        <Text style={styles.label}>Stage Setup:</Text>
        <Text>{stage}</Text>

        <Text style={styles.label}>Photography:</Text>
        <Text>{photography}</Text>

        <Text style={styles.label}>Drinks:</Text>
        <Text>{drinks}</Text>

        <Text style={styles.label}>Payment Info:</Text>
        <Text>Card ending in **** {paymentInfo?.last4}</Text>
        <Text>Card Holder: {paymentInfo?.cardHolder}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Back to Home" onPress={handleBackToHome} />
      </View>
    </ScrollView>
  );
};

export default BookingConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fefefe',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 4,
    borderColor: '#ccc',
  },
  detailBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 30,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
});
