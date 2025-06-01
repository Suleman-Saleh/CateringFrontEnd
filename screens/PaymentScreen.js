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
  View
} from 'react-native';

const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
          activeOpacity={0.7}
        >
          <Text style={[styles.headerButtonText, { color: '#007AFF' }]}>Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // TODO: Add your logout logic here
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }}
          style={styles.headerButton}
          activeOpacity={0.7}
        >
          <Text style={[styles.headerButtonText, { color: 'red' }]}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

 const handlePayment = () => {
  if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
    Alert.alert('Missing Fields', 'Please enter all payment details.');
    return;
  }

  // Optional: you can show a success alert, then navigate to SummaryScreen
  Alert.alert(
  'Payment Successful',
  'Your payment has been processed.',
  [
    {
      text: 'OK',

      onPress: () => {
        console.log('Navigating to SummaryScreen...');
          navigation.navigate('SummaryScreen', {
          ...(route.params || {}),
          paymentInfo: {
            cardHolder,
            last4: cardNumber.slice(-4),
            expiryDate,
          },
        });
      },
    },
  ],
  { cancelable: false }
);

};


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Payment Details</Text>

        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          maxLength={16}
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholder="1234 5678 9012 3456"
          placeholderTextColor="#bbb"
        />

        <Text style={styles.label}>Card Holder Name</Text>
        <TextInput
          style={styles.input}
          value={cardHolder}
          onChangeText={setCardHolder}
          placeholder="John Doe"
          placeholderTextColor="#bbb"
        />

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Expiry Date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              value={expiryDate}
              onChangeText={setExpiryDate}
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
        >
          <Text style={styles.payButtonText}>Pay & Confirm Booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  container: {
    flexGrow: 1,
    padding: 25,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 32,
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
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 20,
    color: '#222',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  payButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 30,
    shadowColor: '#007AFF',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
