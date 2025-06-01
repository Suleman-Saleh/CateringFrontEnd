import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ItemCartScreen({ route }) {
  const { item } = route.params;
  const [quantity, setQuantity] = useState('1');

  const qty = Math.max(0, parseInt(quantity) || 0);
  const price = Number(item.price) || 0;
  const totalPrice = (qty * price).toFixed(2);

  const handleAddToCart = () => {
    if (qty <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a quantity greater than zero.');
      return;
    }
    Alert.alert('Added to Cart', `${qty} x ${item.name} added to cart!\nTotal: $${totalPrice}`);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>Price: ${price.toFixed(2)}</Text>

      <View style={styles.quantityContainer}>
        <Text style={styles.label}>Enter Quantity:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={quantity}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) setQuantity(text);
          }}
          placeholder="1"
        />
      </View>

      <Text style={styles.total}>Total Price: ${totalPrice}</Text>

      <TouchableOpacity
        style={[styles.button, qty <= 0 && styles.buttonDisabled]}
        onPress={handleAddToCart}
        disabled={qty <= 0}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 12,
    marginBottom: 25,
    backgroundColor: '#f2f2f2',
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
    marginBottom: 30,
  },
  quantityContainer: {
    width: '60%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    textAlign: 'center',
    color: '#222',
    backgroundColor: '#fafafa',
  },
  total: {
    fontSize: 22,
    fontWeight: '600',
    color: '#222',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#a0cfff',
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});
