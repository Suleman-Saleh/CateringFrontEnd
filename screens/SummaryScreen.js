import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useBooking } from './BookingContextScreen'; // adjust path

const SummaryScreen = () => { 
  const { booking } = useBooking(); 
  const navigation = useNavigation(); 

  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    // Generate an 8-character uppercase alphanumeric booking ID
    const id = Math.random().toString(36).substring(2, 10).toUpperCase();
    setBookingId(id);
  }, []);

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

  const handleFinish = () => {
    // Navigate to Home or any other screen
    navigation.navigate('Home'); // adjust route name as needed
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Booking Summary</Text>

      <View style={styles.confirmationBox}>
        <Text style={styles.confirmationText}>
          🎉 Your order has been placed successfully!
        </Text>
        <Text style={styles.bookingIdText}>
          Booking ID: <Text style={styles.bookingId}>{bookingId}</Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Event Details</Text>
        <Text>Type: {booking.eventType || 'N/A'}</Text>
        <Text>Date & Time: {booking.eventDateTime || 'N/A'}</Text>
        <Text>
          Location:{' '}
          {booking.eventLocation
            ? `Latitude: ${booking.eventLocation.latitude.toFixed(4)}, Longitude: ${booking.eventLocation.longitude.toFixed(4)}`
            : 'N/A'}
        </Text>
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
        <Button title="Back to Home" onPress={handleFinish} />
      </View>
    </View>
  );
};

export default SummaryScreen;

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
  confirmationBox: {
    backgroundColor: '#e0ffe0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
  },
  bookingIdText: {
    fontSize: 16,
    fontWeight: '500',
  },
  bookingId: {
    fontWeight: '700',
    color: '#388e3c',
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
