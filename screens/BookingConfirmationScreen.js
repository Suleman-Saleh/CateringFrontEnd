import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useBooking } from './BookingContextScreen'; // adjust the path

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

const BookingSummaryScreen = () => {
  const { booking } = useBooking();
  const navigation = useNavigation();

  const renderStepIndicator = ({ position, stepStatus }) => {
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
      <View
        style={{
          backgroundColor: bgColor,
          width: 30,
          height: 30,
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Icon name={iconName} size={16} color={color} />
      </View>
    );
  };

  const grandTotal = booking.cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price);
    return sum + (isNaN(price) ? 0 : price * item.quantity);
  }, 0);

  const handleProceedToPayment = () => {
    navigation.navigate('PaymentScreen');
  };

  return (
    <View style={styles.container}>
      {/* Step Indicator */}
      <StepIndicator
        customStyles={customStyles}
        currentPosition={2}
        labels={labels}
        stepCount={4}
        renderStepIndicator={renderStepIndicator}
      />

      <Text style={styles.title}>Summary</Text>
      <Text style={styles.subtitle}>Please review all details before proceeding to payment</Text>

      {/* Event Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Event Details</Text>
        <Text>Event Type: {booking.eventType || 'N/A'}</Text>
        <Text>Date: {booking.eventDateTime?.split('T')[0] || 'N/A'}</Text>
        <Text>Time: {booking.eventDateTime?.split('T')[1] || 'N/A'}</Text>
        <Text>Location: {booking.eventLocation || 'N/A'}</Text>
      </View>

      {/* Selected Services */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Selected Services</Text>
        {booking.cartItems.length === 0 ? (
          <Text>No services selected.</Text>
        ) : (
          <FlatList
            data={booking.cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Text>• {item.name}</Text>
            )}
          />
        )}
      </View>

      {/* Total Amount */}
      <View style={styles.totalBox}>
        <Text style={styles.totalText}>Total Amount</Text>
        <Text style={styles.amount}>${grandTotal.toFixed(2)}</Text>
      </View>

      {/* Proceed Button */}
      <View style={{ marginTop: 20 }}>
        <Button title="Proceed to Payment" onPress={handleProceedToPayment} color="#6A1B9A" />
      </View>
    </View>
  );
};

export default BookingSummaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 30,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 1,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 10,
  },
  totalBox: {
    backgroundColor: '#F3E5F5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 16,
    color: '#555',
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6A1B9A',
  },
});
