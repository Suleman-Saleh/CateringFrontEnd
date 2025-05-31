import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const SummaryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const {
    eventType,
    eventDateTime,
    eventLocation,
    decoration,
    utensils,
    furniture,
    additionalDetails,
    spoonType,
    tableType,
    music,
    lighting,
    photography,
  } = route.params;

  const handleProceedToPayment = () => {
    navigation.navigate('Payment', {
      // pass everything to PaymentScreen
      ...route.params
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Booking Summary</Text>

      <Text style={styles.label}>Event Type: <Text style={styles.value}>{eventType}</Text></Text>
      <Text style={styles.label}>Date & Time: <Text style={styles.value}>{eventDateTime}</Text></Text>
      <Text style={styles.label}>Location:</Text>
      <Text style={styles.value}>
        Latitude: {eventLocation.latitude.toFixed(4)}, Longitude: {eventLocation.longitude.toFixed(4)}
      </Text>

      <Text style={styles.label}>Decoration: <Text style={styles.value}>{decoration}</Text></Text>
      <Text style={styles.label}>Utensils: <Text style={styles.value}>{utensils}</Text></Text>
      <Text style={styles.label}>Furniture: <Text style={styles.value}>{furniture}</Text></Text>
      <Text style={styles.label}>Spoon Type: <Text style={styles.value}>{spoonType}</Text></Text>
      <Text style={styles.label}>Table Type: <Text style={styles.value}>{tableType}</Text></Text>
      <Text style={styles.label}>Music: <Text style={styles.value}>{music}</Text></Text>
      <Text style={styles.label}>Lighting: <Text style={styles.value}>{lighting}</Text></Text>
      <Text style={styles.label}>Photography: <Text style={styles.value}>{photography}</Text></Text>

      <Text style={styles.label}>Additional Notes:</Text>
      <Text style={styles.value}>{additionalDetails || 'None'}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Proceed to Payment" onPress={handleProceedToPayment} />
      </View>
    </ScrollView>
  );
};

export default SummaryScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  value: {
    fontWeight: '400',
    color: '#333',
  },
  buttonContainer: {
    marginTop: 30,
  },
});
