import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBooking } from './BookingContextScreen'; // adjust path

const SummaryScreen = () => {
  const { booking } = useBooking();
  const navigation = useNavigation();

  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    const id = Math.random().toString(36).substring(2, 10).toUpperCase();
    setBookingId(id);
  }, []);

  const handleFinish = () => {
    navigation.navigate('Login'); // adjust route if needed
  };

  const grandTotal = booking.cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price);
    return sum + (isNaN(price) ? 0 : price * item.quantity);
  }, 0);

  return (
    <LinearGradient
       colors={['#4A90E2', '#2C3E50']} // Blue gradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Thank You!</Text>

            <View style={styles.messageBox}>
              <Text style={styles.successText}>
                🎉 Your booking was successful!
              </Text>
              <Text style={styles.bookingIdText}>
                Booking ID: <Text style={styles.bookingId}>{bookingId}</Text>
              </Text>
              <Text style={styles.totalText}>
                Total Paid: ${grandTotal.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleFinish}
              style={styles.homeButton}
              activeOpacity={0.8}
            >
              <Text style={styles.homeButtonText}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default SummaryScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  flex: {
    flex: 1,

  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#EAF2FA', // light sky blue
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: '#222',
    textAlign: 'center',
  },
  messageBox: {
    backgroundColor: '#E3F2FD', // light blue instead of green
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
    width: '100%',
  },
  successText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1565C0', // deep blue for success text
    marginBottom: 10,
    textAlign: 'center',
  },
  bookingIdText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  bookingId: {
    fontWeight: '700',
    color: '#1976D2', // deep blue for ID
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  homeButton: {
    backgroundColor: '#2196F3', // blue button
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#2196F3',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
