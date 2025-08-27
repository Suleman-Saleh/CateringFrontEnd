import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
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
    resetBooking();
    navigation.navigate('UserDashboardScreen');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* ✅ Header */}
          <Text style={styles.title}>Booking Confirmed 🎉</Text>
          <Text style={styles.subtitle}>Your Booking Receipt</Text>

          {/* ✅ Booking Details */}
          <View style={styles.receiptBox}>
            <Text style={styles.sectionHeader}>📌 Booking Details</Text>
            <Text style={styles.row}>
              Booking ID: <Text style={styles.value}>{bookingId || 'N/A'}</Text>
            </Text>
            <Text style={styles.row}>
              Date & Time: <Text style={styles.value}>{date || 'N/A'}</Text>
            </Text>
            <Text style={styles.row}>
              Guests: <Text style={styles.value}>{guestCount || 'N/A'}</Text>
            </Text>
            <Text style={styles.row}>
              Address: <Text style={styles.value}>{address || 'N/A'}</Text>
            </Text>
          </View>

          {/* ✅ Services */}
          <View style={styles.receiptBox}>
            <Text style={styles.sectionHeader}>🛠 Services Summary</Text>
            {services && services.length > 0 ? (
              services.map((s, idx) => (
                <Text key={idx} style={styles.row}>• {s}</Text>
              ))
            ) : (
              <Text style={styles.row}>No services listed.</Text>
            )}
          </View>

          {/* ✅ Payment Info */}
          <View style={styles.receiptBox}>
            <Text style={styles.sectionHeader}>💳 Payment</Text>
            <Text style={styles.row}>
              Total Paid:{' '}
              <Text style={styles.value}>
                ${totalPaid ? totalPaid.toFixed(2) : '0.00'}
              </Text>
            </Text>
            <Text style={styles.row}>
              Payment Method:{' '}
              <Text style={styles.value}>{paymentMethod || 'N/A'}</Text>
            </Text>
          </View>

          {/* ✅ Button */}
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
  flex: { flex: 1, backgroundColor: '#f6f8fa' },
  scrollContainer: { flexGrow: 1, padding: 16 },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
    color: '#2c3e50',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  receiptBox: {
    backgroundColor: '#F9F9F9',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    shadowColor: '#6A1B9A',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    marginTop: 10,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
