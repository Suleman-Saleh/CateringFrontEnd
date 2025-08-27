import React, { useLayoutEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';

import StepIndicator from 'react-native-step-indicator';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useBooking } from './BookingContextScreen';

// ⚠️ CHANGE THIS to your machine’s local IP (not localhost)
const STRAPI_URL = 'http://localhost:1337';
// const STRAPI_URL = "http://192.168.1.73:1337";

const labels = ['Event Info', 'Services', 'Summary', 'Payment'];
const icons = ['calendar', 'paint-brush', 'list-alt', 'credit-card'];

  const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 5,
    stepStrokeCurrentColor: '#8852a9ff',
    stepStrokeWidth: 5,
    stepStrokeFinishedColor: 'white',
    stepStrokeUnFinishedColor: 'grey',
    separatorFinishedColor: 'white',
    separatorUnFinishedColor: '#D1C4E9',
    stepIndicatorFinishedColor: '#6A1B9A',
    stepIndicatorUnFinishedColor: '#FFFFFF',
    stepIndicatorCurrentColor: '#FFFFFF',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#6A1B9A',
    stepIndicatorLabelFinishedColor: '#FFFFFF',
    stepIndicatorLabelUnFinishedColor: '#D1C4E9',
    labelColor: 'grey',
    labelSize: 14,
    finishedStepLabelColor: 'white',
    currentStepLabelColor: 'white',
  };

const PaymentScreen = () => {
  const route = useRoute();
  // Destructure params directly from the route object
  const { customerId, eventTypeId, locationId, guestCount, bookingDate, bookingAddress } = route.params || {};

  const navigation = useNavigation();
  const { booking, resetBooking } = useBooking();

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
          activeOpacity={0.7}
        >
          <Text style={[styles.headerButtonText, { color: '#4A90E2' }]}>
            Back
          </Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Logout', 'Are you sure you want to logout?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Logout',
                style: 'destructive',
                onPress: () => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
                },
              },
            ]);
          }}
          style={styles.logoutButtonHeader}
          activeOpacity={0.8}
        >
          <Icon
            name="sign-out"
            size={16}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const calculateTotalAmount = () => {
    if (!booking || !booking.cartItems) return 0;
    return booking.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
const handlePayment = async () => {
  console.log("--- Starting handlePayment function ---");
  console.log("Received params:", { customerId, eventTypeId, locationId, guestCount, bookingDate, bookingAddress });

  // ✅ Proper null/undefined check instead of falsy check
  if (
    customerId == null ||
    eventTypeId == null ||
    locationId == null ||
    guestCount == null ||
    bookingDate == null ||
    !bookingAddress || bookingAddress.trim() === ""
  ) {
    Alert.alert("Error", "Missing booking details. Please go back and provide all required information.");
    console.error("❌ Missing required booking details:", { customerId, eventTypeId, locationId, guestCount, bookingDate, bookingAddress });
    return;
  }

  setIsProcessing(true);

  try {
    const bookingPayload = {
      GuestCount: parseInt(guestCount, 10),
      BookingDate: new Date(bookingDate).toISOString(),
      BookingLocationAddress: bookingAddress,
      customer: parseInt(customerId, 10),
      event_type: parseInt(eventTypeId, 10),
      location: parseInt(locationId, 10),
    };

    console.log("Sending booking payload:", JSON.stringify({ data: bookingPayload }, null, 2));

    // Step 1: Create Booking
    const bookingResponse = await fetch(`${STRAPI_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: bookingPayload }),
    });

    const bookingResult = await bookingResponse.json();
    console.log("Received booking response:", bookingResult);

    if (!bookingResponse.ok) {
      throw new Error(bookingResult?.error?.message || "Booking creation failed");
    }

    const newBookingId = bookingResult.data.id;
    console.log("✅ Booking created successfully with ID:", newBookingId);

    // Step 2: Create Payment
    const paymentPayload = {
      PaymentStatus: "Paid",
      Amount: calculateTotalAmount(),
      PaymentDate: new Date().toISOString(),
      booking: parseInt(newBookingId, 10),
    };

    console.log("Sending payment payload:", JSON.stringify({ data: paymentPayload }, null, 2));

    const paymentResponse = await fetch(`${STRAPI_URL}/api/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: paymentPayload }),
    });

    const paymentResult = await paymentResponse.json();
    console.log("Received payment response:", paymentResult);

    if (!paymentResponse.ok) {
      throw new Error(paymentResult?.error?.message || "Payment creation failed");
    }

    console.log("✅ Payment created successfully:", paymentResult.data.id);
    Alert.alert("Success", "Booking and payment processed successfully!");
    resetBooking?.(); // Clear booking context
navigation.navigate("SummaryScreen", {
  bookingId: newBookingId,
  date: bookingDate,
  guestCount: guestCount,
  address: bookingAddress,
  services: booking?.services || [], // if you have services array
  totalPaid: calculateTotalAmount(),
  paymentMethod: "Credit Card", // or dynamic
});  } catch (error) {
    console.error("❌ handlePayment error:", error.message);
    Alert.alert("Payment Failed", error.message || "An unexpected error occurred. Please try again.");
  } finally {
    setIsProcessing(false);
    console.log("--- Finished handlePayment function ---");
  }
};




  return (
    <LinearGradient
          colors={['#4A90E2', '#2C3E50']}
          start={{ x: 0, y: 0 }}   // left side
      end={{ x: 1, y: 0 }} // 🔵 unified blue gradient
          style={styles.container}
        >
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <StepIndicator
          customStyles={customStyles}
          currentPosition={3}
          labels={labels}
          stepCount={4}
          renderStepIndicator={({ position, stepStatus }) => {
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
                key={position}
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
          }}
        />

        <View style={styles.container}>
          <Text style={styles.title}>Payment Details</Text>

          <Text style={styles.label}>Card Number</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            maxLength={19}
            value={cardNumber}
            onChangeText={(text) => {
              const cleaned = text.replace(/\D+/g, '').slice(0, 16);
              const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || '';
              setCardNumber(formatted);
            }}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor="#bbb"
          />

          <Text style={styles.label}>Card Holder Name</Text>
          <TextInput
            style={styles.input}
            value={cardHolder}
            onChangeText={setCardHolder}
            placeholder="Muhammad Suleman"
            placeholderTextColor="#bbb"
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                placeholder="MM/YY"
                value={expiryDate}
                onChangeText={(text) => {
                  const cleaned = text.replace(/\D+/g, '').slice(0, 4);
                  let formatted = cleaned;
                  if (cleaned.length >= 3) {
                    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
                  }
                  setExpiryDate(formatted);
                }}
                maxLength={5}
                placeholderTextColor="#bbb"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="number-pad"
                maxLength={3}
                placeholderTextColor="#bbb"
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handlePayment}
            style={styles.payButton}
            activeOpacity={0.8}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payButtonText}>Pay & Confirm Booking</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#222',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1E3F8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F3F7FC',
    marginBottom: 20,
    color: '#2C3E50',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { flex: 0.48 },
  payButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#4A90E2',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  payButtonText: { color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'center' },
  headerButton: { paddingHorizontal: 12, paddingVertical: 6 },
  headerButtonText: { fontSize: 16, fontWeight: '600' },
  logoutButtonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  logoutButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
