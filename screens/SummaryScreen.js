import { useNavigation } from '@react-navigation/native';
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
  const { resetBooking } = useBooking();
  const navigation = useNavigation();
  const route = useRoute();

  const {
    bookingId,
    grandTotal,
    date,
    guestCount,
    address,
    services,
    totalPaid,
    paymentMethod,
  } = route.params || {};

  const handleFinish = () => {
    navigation.navigate('Login'); // adjust route name if needed
  };

  return (
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
            <Text style={styles.totalText}>Total Paid: ${grandTotal.toFixed(2)}</Text>
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
  );
};

export default SummaryScreen;

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
    backgroundColor: '#EAF2FA', // light sky blue
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
    color: '#2c3e50',
    textAlign: 'center',
  },
  messageBox: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 10,
    marginBottom: 24,
    alignItems: 'center',
    width: '100%',
  },
  successText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 10,
    textAlign: 'center',
  },
  bookingIdText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  bookingId: {
    fontWeight: '700',
    color: '#388E3C',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#6A1B9A',
  },
  row: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  value: {
    fontWeight: '600',
    color: '#000',
  },
  homeButton: {
    backgroundColor: '#6A1B9A',
    paddingVertical: 16,
    borderRadius: 10,
    width: '100%',
    shadowColor: '#2196F3',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
