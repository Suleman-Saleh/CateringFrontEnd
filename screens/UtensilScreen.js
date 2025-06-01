import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const utensilItems = {
  Cups: [
    { id: 'c1', name: 'Ceramic Cup', material: 'Ceramic', price: '$5', image: 'https://images.unsplash.com/photo-1556912167-f556f1f39f5b' },
    { id: 'c2', name: 'Glass Cup', material: 'Glass', price: '$4', image: 'https://images.unsplash.com/photo-1609515152060-cf5f8577e06d' },
    { id: 'c3', name: 'Travel Mug', material: 'Stainless Steel', price: '$12', image: 'https://images.unsplash.com/photo-1598515213690-dab758b40b7c' },
    { id: 'c4', name: 'Espresso Cup', material: 'Porcelain', price: '$6', image: 'https://images.unsplash.com/photo-1544739313-e9e8c5ee0fa4' },
  ],
  Spoons: [
    { id: 's1', name: 'Teaspoon', material: 'Silver', price: '$3', image: 'https://images.unsplash.com/photo-1598515213690-dab758b40b7c' },
    { id: 's2', name: 'Soup Spoon', material: 'Stainless Steel', price: '$4', image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7' },
    { id: 's3', name: 'Serving Spoon', material: 'Wooden', price: '$5', image: 'https://images.unsplash.com/photo-1579710758512-3b6a6c3e5f28' },
  ],
  Forks: [
    { id: 'f1', name: 'Dinner Fork', material: 'Stainless Steel', price: '$4', image: 'https://images.unsplash.com/photo-1572441710224-53455fa38e17' },
    { id: 'f2', name: 'Salad Fork', material: 'Silver', price: '$3', image: 'https://images.unsplash.com/photo-1572441710224-53455fa38e17' },
    { id: 'f3', name: 'Dessert Fork', material: 'Stainless Steel', price: '$4', image: 'https://images.unsplash.com/photo-1545226584-59670107400d' },
  ],
  Bowls: [
    { id: 'b1', name: 'Soup Bowl', material: 'Ceramic', price: '$7', image: 'https://images.unsplash.com/photo-1575330396789-89f6d82ad645' },
    { id: 'b2', name: 'Salad Bowl', material: 'Wooden', price: '$10', image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352' },
    { id: 'b3', name: 'Mixing Bowl', material: 'Stainless Steel', price: '$8', image: 'https://images.unsplash.com/photo-1561047029-3000eacb3f5d' },
  ],
  Plates: [
    { id: 'p1', name: 'Dinner Plate', material: 'Porcelain', price: '$9', image: 'https://images.unsplash.com/photo-1627480393967-f24f4f88ef5b' },
    { id: 'p2', name: 'Side Plate', material: 'Ceramic', price: '$6', image: 'https://images.unsplash.com/photo-1601297159644-50b1e0efef4d' },
    { id: 'p3', name: 'Charging Plate', material: 'Glass', price: '$12', image: 'https://images.unsplash.com/photo-1594940837626-c9b104046793' },
  ],
};

export default function UtensilScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('Cups');
  const categories = Object.keys(utensilItems);

  // calculate two-column card width
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 16 * 3) / 2; // 16px padding each side + between

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Select a Category</Text>
      <View style={styles.categoryContainer}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.categoryButtonSelected,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextSelected,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={utensilItems[selectedCategory]}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.itemCard, { width: cardWidth }]}
            onPress={() => navigation.navigate('ItemCartScreen', { item })}
          >
            <Image source={{ uri: item.image }} style={[styles.image, { width: cardWidth - 20, height: cardWidth - 20 }]} />
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemStyle}>{item.material}</Text>
            <Text style={styles.itemPrice}>{item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#777',
    backgroundColor: '#f0f0f0',
  },
  categoryButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  categoryText: {
    fontSize: 16,
    color: '#444',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 40,
  },
  itemCard: {
    backgroundColor: '#fafafa',
    margin: 8,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  image: {
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  itemName: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  itemStyle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  itemPrice: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#007bff',
  },
  backButton: {
  marginTop: 40,
  marginLeft: 16,
  marginBottom: 8,
  padding: 8,
  backgroundColor: '#eee',
  borderRadius: 8,
  alignSelf: 'flex-start',
},
backButtonText: {
  fontSize: 16,
  color: '#333',
}
});
