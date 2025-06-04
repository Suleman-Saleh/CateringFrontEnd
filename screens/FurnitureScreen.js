import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBooking } from './BookingContextScreen';

const furnitureItems = {
  Chairs: [
    { id: 'ch1', name: 'Folding Chair', material: 'Metal', price: '$10', image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4' },
    { id: 'ch2', name: 'Banquet Chair', material: 'Plastic', price: '$12', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc' },
    { id: 'ch3', name: 'Lounge Chair', material: 'Leather', price: '$30', image: 'https://images.unsplash.com/photo-1505692794403-82ed43c318f7' },
  ],
  Tables: [
    { id: 'tb1', name: 'Round Table', material: 'Wood', price: '$50', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36' },
    { id: 'tb2', name: 'Banquet Table', material: 'Plastic', price: '$40', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d' },
    { id: 'tb3', name: 'Cocktail Table', material: 'Metal', price: '$45', image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4' },
  ],
  Lounging: [
    { id: 'lg1', name: 'Sofa', material: 'Fabric', price: '$100', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36' },
    { id: 'lg2', name: 'Ottoman', material: 'Leather', price: '$60', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d' },
  ],
  StageFurniture: [
    { id: 'st1', name: 'Podium', material: 'Wood', price: '$150', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8' },
    { id: 'st2', name: 'Stage Platform', material: 'Metal/Wood', price: '$300', image: 'https://images.unsplash.com/photo-1505692794403-82ed43c318f7' },
  ],
};

export default function FurnitureScreen() {
  const { updateBooking } = useBooking();
  useEffect(() => {
    updateBooking({ visitedFurniture: true });
  }, []);

  const [selectedCategory, setSelectedCategory] = useState('Chairs');
  const categories = Object.keys(furnitureItems);
  const navigation = useNavigation();
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 48) / 2;

  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}></View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.cardsContainer}>
      <FlatList
        data={furnitureItems[selectedCategory]}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { width: cardWidth }]}
            onPress={() => navigation.navigate('ItemCartScreen', { item })}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.material}</Text>
            <Text style={styles.price}>{item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
  paddingVertical: 1,
  backgroundColor: '#ffffff',
  paddingBottom: 3, // Reduced to fit more space for FlatList
},

cardsContainer: {
  flex: 75,
  paddingHorizontal: 1,
},

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 2,
    paddingTop: 10,
  },
  categoryScroll: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 8, // Reduced to fit more space for FlatList
  },

  categoryButtonActive: {
    backgroundColor: '#6A1B9A',
  },
categoryButton: {
  paddingHorizontal: 24, // increased from 20
  paddingVertical: 14,   // increased from 10
  backgroundColor: '#e5e7eb',
  borderRadius: 30,      // increased from 25
  marginRight: 12,       // slightly increased spacing
  minWidth: 120, 
  minHeight: 50,        // increased from 100
  alignItems: 'center',
},
categoryText: {
  fontSize: 16,          // increased from 14
  fontWeight: '600',
  color: '#1f2937',
},

  categoryTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  listContainer: {
    paddingBottom: 30,
    paddingTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    margin: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 130,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  price: {
    fontSize: 15,
    color: '#10b981',
    fontWeight: '700',
    marginTop: 6,
  },
});
