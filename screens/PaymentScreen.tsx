import React, { useState, useLayoutEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

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
        <Button title="Back" onPress={() => navigation.goBack()} />
      ),
      headerRight: () => (
        <Button
          title="Logout"
          onPress={() => {
            // TODO: Add your logout logic here (clear auth tokens, reset state, etc.)
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }], // adjust to your login screen name
            });
          }}
          color="red"
        />
      ),
    });
  }, [navigation]);

  const handlePayment = () => {
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      Alert.alert('Missing Fields', 'Please enter all payment details.');
      return;
    }

    Alert.alert(
      'Payment Successful',
      'Your payment has been processed.',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('BookingConfirmation', {
              ...route.params,
              paymentInfo: {
                cardHolder,
                last4: cardNumber.slice(-4),
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
        />

        <Text style={styles.label}>Card Holder Name</Text>
        <TextInput
          style={styles.input}
          value={cardHolder}
          onChangeText={setCardHolder}
          placeholder="John Doe"
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
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Pay & Confirm Booking" onPress={handlePayment} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
