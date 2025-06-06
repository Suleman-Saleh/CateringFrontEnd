import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useBooking } from './BookingContextScreen';

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

  const eventDate = booking.eventDateTime ? new Date(booking.eventDateTime) : null;

  const locationText =
    booking.locationName
      ? booking.locationName
      : booking.eventLocation
      ? `${booking.eventLocation.latitude.toFixed(4)}, ${booking.eventLocation.longitude.toFixed(4)}`
      : 'N/A';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <StepIndicator
        customStyles={customStyles}
        currentPosition={2}
        labels={labels}
        stepCount={4}
        renderStepIndicator={renderStepIndicator}
      />

      <Text style={styles.title}>Summary</Text>
      <Text style={styles.subtitle}>
        Please review all details before proceeding to payment
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Event Details</Text>
        <Text>Event Type: {booking.eventType || 'N/A'}</Text>
        <Text>Date: {eventDate ? eventDate.toLocaleDateString() : 'N/A'}</Text>
        <Text>Time: {eventDate ? eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</Text>
        <Text>Location: {locationText}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Selected Services</Text>
        {booking.cartItems.length === 0 ? (
          <Text>No services selected.</Text>
        ) : (
          booking.cartItems.map((item) => (
            <Text key={item.id}>• {item.name}</Text>
          ))
        )}
      </View>

      <View style={styles.totalBox}>
        <Text style={styles.totalText}>Total Amount</Text>
        <Text style={styles.amount}>${grandTotal.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleProceedToPayment}>
        <Text style={styles.buttonText}>Proceed to Payment</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default BookingSummaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 25,
    paddingBottom: 50,
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
  button: {
    marginTop: 20,
    backgroundColor: '#6A1B9A',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
