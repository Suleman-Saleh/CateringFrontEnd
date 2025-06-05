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

import StepIndicator from 'react-native-step-indicator';
import Icon from 'react-native-vector-icons/FontAwesome';

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
          <Icon name="sign-out" size={16} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
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
        </View>
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
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
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
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 20,
    color: '#222',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  payButton: {
    backgroundColor: '#6A1B9A',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#6A1B9A',
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
  logoutButtonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A1B9A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
