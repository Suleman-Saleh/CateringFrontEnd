import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useBooking } from './BookingContextScreen'; // adjust path

const BookingConfirmationScreen = () => {
  const { booking } = useBooking();
  const navigation = useNavigation();

  const renderCartItem = ({ item }) => {
    const price = parseFloat(item.price);
    const total = price * item.quantity;

    return (
      <View style={styles.cartItem}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text>Price: ${!isNaN(price) ? price.toFixed(2) : '0.00'}</Text>
          <Text>Quantity: {item.quantity}</Text>
          <Text style={styles.itemTotal}>Total: ${!isNaN(total) ? total.toFixed(2) : '0.00'}</Text>
        </View>
      </View>
    );
  };

  const grandTotal = booking.cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price);
    return sum + (isNaN(price) ? 0 : price * item.quantity);
  }, 0);

  const handleProceedToPayment = () => {
    navigation.navigate('PaymentScreen'); // Ensure this route name matches your stack
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Booking Confirmation</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Event Details</Text>
        <Text>Type: {booking.eventType || 'N/A'}</Text>
        <Text>Date & Time: {booking.eventDateTime || 'N/A'}</Text>
        <Text>Location: {booking.eventLocation || 'N/A'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cart Items</Text>
        {booking.cartItems.length === 0 ? (
          <Text>No items added to cart.</Text>
        ) : (
          <FlatList
            data={booking.cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCartItem}
            style={{ maxHeight: 300 }}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.grandTotal}>Grand Total: ${grandTotal.toFixed(2)}</Text>
      </View>

      <View style={styles.section}>
        <Button title="Proceed to Payment" onPress={handleProceedToPayment} />
      </View>
    </View>
  );
};

export default BookingConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#222',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 10,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  itemName: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },
  itemTotal: {
    marginTop: 5,
    fontWeight: '600',
    color: '#007AFF',
  },
  grandTotal: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'right',
  },
});
