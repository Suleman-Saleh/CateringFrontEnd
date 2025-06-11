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
import { useBooking } from './BookingContextScreen'; // adjust import path

const utensilItems = {
  Cups: [
    { id: 'c1', name: 'Ceramic Cup', material: 'Ceramic', price: 5, image: 'https://images.unsplash.com/photo-1556912167-f556f1f39f5b' },
    { id: 'c2', name: 'Glass Cup', material: 'Glass', price: 4, image: 'https://images.unsplash.com/photo-1609515152060-cf5f8577e06d' },
    { id: 'c3', name: 'Travel Mug', material: 'Stainless Steel', price: 12, image: 'https://images.unsplash.com/photo-1598515213690-dab758b40b7c' },
    { id: 'c4', name: 'Espresso Cup', material: 'Porcelain', price: 6, image: 'https://images.unsplash.com/photo-1544739313-e9e8c5ee0fa4' },
  ],
  Spoons: [
    { id: 's1', name: 'Teaspoon', material: 'Silver', price: 3, image: 'https://images.unsplash.com/photo-1598515213690-dab758b40b7c' },
    { id: 's2', name: 'Soup Spoon', material: 'Stainless Steel', price: 4, image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7' },
    { id: 's3', name: 'Serving Spoon', material: 'Wooden', price: 5, image: 'https://images.unsplash.com/photo-1579710758512-3b6a6c3e5f28' },
  ],
  Forks: [
    { id: 'f1', name: 'Dinner Fork', material: 'Stainless Steel', price: 4, image: 'https://images.unsplash.com/photo-1572441710224-53455fa38e17' },
    { id: 'f2', name: 'Salad Fork', material: 'Silver', price: 3, image: 'https://images.unsplash.com/photo-1572441710224-53455fa38e17' },
    { id: 'f3', name: 'Dessert Fork', material: 'Stainless Steel', price: 4, image: 'https://images.unsplash.com/photo-1545226584-59670107400d' },
  ],
  Bowls: [
    { id: 'b1', name: 'Soup Bowl', material: 'Ceramic', price: 7, image: 'https://images.unsplash.com/photo-1575330396789-89f6d82ad645' },
    { id: 'b2', name: 'Salad Bowl', material: 'Wooden', price: 10, image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352' },
    { id: 'b3', name: 'Mixing Bowl', material: 'Stainless Steel', price: 8, image: 'https://images.unsplash.com/photo-1561047029-3000eacb3f5d' },
  ],
  Plates: [
    { id: 'p1', name: 'Dinner Plate', material: 'Porcelain', price: 9, image: 'https://images.unsplash.com/photo-1627480393967-f24f4f88ef5b' },
    { id: 'p2', name: 'Side Plate', material: 'Ceramic', price: 6, image: 'https://images.unsplash.com/photo-1601297159644-50b1e0efef4d' },
    { id: 'p3', name: 'Charging Plate', material: 'Glass', price: 12, image: 'https://images.unsplash.com/photo-1594940837626-c9b104046793' },
  ],
};

export default function UtensilScreen() {
  const { updateBooking } = useBooking();
  useEffect(() => {
    updateBooking({ visitedFurniture: true });
  }, []);

  const [selectedCategory, setSelectedCategory] = useState('Cups');
  const categories = Object.keys(utensilItems);
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
        data={utensilItems[selectedCategory]}
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
