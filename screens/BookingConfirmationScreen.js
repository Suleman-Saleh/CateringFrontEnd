import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useBooking } from './BookingContextScreen';

const labels = ['Event Info', 'Services', 'Summary', 'Payment'];
const icons = ['calendar', 'paint-brush', 'list-alt', 'credit-card'];

// Updated Step Indicator styles to match login blue theme
const customStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#4A90E2',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#4A90E2',
  stepStrokeUnFinishedColor: '#B0C4DE',
  separatorFinishedColor: '#4A90E2',
  separatorUnFinishedColor: '#B0C4DE',
  stepIndicatorFinishedColor: '#4A90E2',
  stepIndicatorUnFinishedColor: '#FFFFFF',
  stepIndicatorCurrentColor: '#FFFFFF',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#4A90E2',
  stepIndicatorLabelFinishedColor: '#FFFFFF',
  stepIndicatorLabelUnFinishedColor: '#B0C4DE',
  labelColor: '#666',
  labelSize: 13,
  currentStepLabelColor: '#2C3E50',
};

const BookingConfirmationScreen = () => {
  const { booking } = useBooking();
  const navigation = useNavigation();

  const renderStepIndicator = ({ position, stepStatus }) => {
    const iconName = icons[position];
    const color =
      stepStatus === 'current'
        ? '#4A90E2'
        : stepStatus === 'finished'
        ? '#fff'
        : '#B0C4DE';
    const bgColor =
      stepStatus === 'current'
        ? '#fff'
        : stepStatus === 'finished'
        ? '#4A90E2'
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
  console.log("--- Starting handlePayment function ---");
  console.log("Booking object:", booking);

  const {
    customerId,
    eventTypeId,
    locationId,
    guestCount,
    eventDateTime,
    locationName,
    eventLocation
  } = booking;

  // Handle booking location address
  let bookingLocationAddress = "";
  if (locationName) {
    bookingLocationAddress = locationName;
  } else if (eventLocation && typeof eventLocation === "object") {
    bookingLocationAddress = `${eventLocation.latitude}, ${eventLocation.longitude}`;
  }

  console.log("Derived bookingLocationAddress:", bookingLocationAddress);
  console.log("Type of bookingLocationAddress:", typeof bookingLocationAddress);

  // Log individual checks
  console.log("customerId valid?", customerId != null);
  console.log("eventTypeId valid?", eventTypeId != null);
  console.log("locationId valid?", locationId != null);
  console.log("guestCount valid?", guestCount != null);
  console.log("eventDateTime valid?", eventDateTime != null);
  console.log("bookingLocationAddress valid?", bookingLocationAddress.trim() !== "");

  // Proper null/undefined check
  if (
    customerId == null ||
    eventTypeId == null ||
    locationId == null ||
    guestCount == null ||
    eventDateTime == null ||
    !bookingLocationAddress.trim()
  ) {
    Alert.alert(
      'Missing Information',
      'Some booking details are missing. Please go back and fill them out.'
    );

    console.error("❌ Missing required booking details:", {
      customerId,
      eventTypeId,
      locationId,
      guestCount,
      eventDateTime,
      bookingLocationAddress
    });
    return;
  }

  console.log("--- All required fields present. Navigating to PaymentScreen ---");

  navigation.navigate('PaymentScreen', {
    customerId,
    eventTypeId,
    locationId,
    guestCount,
    bookingDate: eventDateTime,
    bookingAddress: bookingLocationAddress,
  });
};

  const eventDate = booking.eventDateTime ? new Date(booking.eventDateTime) : null;

  const locationText = typeof booking.eventLocation === 'object' && booking.eventLocation
    ? `${booking.eventLocation.latitude.toFixed(4)}, ${booking.eventLocation.longitude.toFixed(4)}`
    : booking.eventLocation || booking.locationName || 'N/A';

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
        <Text>
          Time:{" "}
          {eventDate
            ? eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'N/A'}
        </Text>
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

export default BookingConfirmationScreen;

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
    color: '#2C3E50', // dark blue for title
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
    color: '#2C3E50', // consistent dark blue
  },
  totalBox: {
    backgroundColor: '#EAF3FC',
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
    color: '#4A90E2', // login blue
  },
  button: {
    marginTop: 20,
    backgroundColor: '#4A90E2', // login/register blue
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
