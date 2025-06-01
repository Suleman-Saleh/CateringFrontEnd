
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

export default function FurnitureScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('Chairs');
  const categories = Object.keys(furnitureItems);

  const { width } = Dimensions.get('window');
  const cardWidth = (width - 48) / 2; // 16px padding + 16px between cards

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
        data={furnitureItems[selectedCategory]}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.itemCard, { width: cardWidth }]}
            onPress={() => navigation.navigate('ItemCartScreen', { item })}
          >
            <Image
              source={{ uri: item.image }}
              style={[styles.image, { width: cardWidth - 20, height: cardWidth - 20 }]}
            />
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
    textAlign: 'center',
    marginBottom: 16,
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

