import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBooking } from './BookingContextScreen'; // adjust import path

export default function ItemCartScreen({ route, navigation }) {
  const { item } = route.params;
  const [quantity, setQuantity] = useState('1');
  const { addToCart } = useBooking();

  const qty = Math.max(0, parseInt(quantity) || 0);
  const price = Number(item.price) || 0;
  const totalPrice = (qty * price).toFixed(2);

  const handleAddToCart = () => {
    if (qty <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a quantity greater than zero.');
      return;
    }
    addToCart({ ...item, quantity: qty });

    Alert.alert('Added to Cart', `${qty} x ${item.name} added to cart!\nTotal: $${totalPrice}`);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>Price: ${price.toFixed(2)}</Text>

          <View style={styles.inputBlock}>
            <Text style={styles.label}>Enter Quantity</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={quantity}
              onChangeText={(text) => {
                if (/^\d*$/.test(text)) setQuantity(text);
              }}
              placeholder="1"
              maxLength={3}
            />
          </View>

          <Text style={styles.total}>Total: ${totalPrice}</Text>

          <TouchableOpacity
            style={[styles.button, qty <= 0 && styles.buttonDisabled]}
            onPress={handleAddToCart}
            disabled={qty <= 0}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 5,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    marginBottom: 25,
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 20,
  },
  inputBlock: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    textAlign: 'center',
    color: '#222',
    backgroundColor: '#fafafa',
  },
  total: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#6A1B9A',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 10,
    shadowColor: '#6A1B9A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#caa8e8',
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
