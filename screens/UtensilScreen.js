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

export default function UtensilScreen() {
  const { updateBooking } = useBooking();

  useEffect(() => {
    // Mark Decoration as visited when this screen mounts
    updateBooking({ visitedUtensils: true });
  }, []);
  const [selectedCategory, setSelectedCategory] = useState('Cups');
  const categories = Object.keys(utensilItems);
  const navigation = useNavigation();

  const { width } = Dimensions.get('window');
  const cardWidth = (width - 16 * 3) / 2;

 return (
   <View style={styles.utensilContainer}>
     {/* Category Tabs */}
     <ScrollView
       horizontal ={true}
       showsHorizontalScrollIndicator={false}
       contentContainerStyle={styles.categoryTabsContainer}
     >
       {categories.map((category) => (
         <TouchableOpacity
           key={category}
           onPress={() => setSelectedCategory(category)}
           style={[
             styles.categoryButton,
             selectedCategory === category && styles.selectedCategoryButton,
           ]}
         >
           <Text
             style={[
               styles.categoryText,
               selectedCategory === category && styles.selectedCategoryText,
             ]}
           >
             {category}
           </Text>
         </TouchableOpacity>
       ))}
     </ScrollView>
 
     {/* Item List */}
     <FlatList
       data={utensilItems[selectedCategory]}
       keyExtractor={(item) => item.id}
       numColumns={2}
       contentContainerStyle={styles.flatListContainer}
       renderItem={({ item }) => (
        <TouchableOpacity
                    style={[styles.itemCard, { width: cardWidth }]}
                    onPress={() => navigation.navigate('ItemCartScreen', { item })}
                  >
           <Image source={{ uri: item.image }} style={styles.cardImage} />
           <Text style={styles.cardTitle}>{item.name}</Text>
           <Text style={styles.cardSubtitle}>{item.style}</Text>
           <Text style={styles.cardPrice}>{item.price}</Text>
         </TouchableOpacity>
       )}
     />
   </View>
 );
 }
 
const styles = StyleSheet.create({
  utensilContainer:   {
    flex: 1,
    backgroundColor: '#f9fafb', // soft off-white
    paddingHorizontal: 16,
    paddingTop: 5,
    paddingBottom: 20,
  },

  categoryTabsContainer: {
    flexDirection: 'row',
    paddingVertical: 1,
    paddingHorizontal: 5,
    marginBottom: 80,
  },

  categoryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#e0e7ff', // soft periwinkle
    marginRight: 12,
    maxWidth: 130,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#a0a7ff', // subtle shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },

  selectedCategoryButton: {
    backgroundColor: '#4f46e5', // vibrant indigo
    shadowColor: '#4f46e5',
    shadowOpacity: 0.5,
    elevation: 6,
  },

  categoryText: {
    fontSize: 15,
    color: '#3b4252',
    fontWeight: '600',
    textAlign: 'center',
    flexShrink: 1,
  },

  selectedCategoryText: {
    color: '#fff',
    fontWeight: '700',
  },

  flatListContainer: {
    paddingTop: 0,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },

  cardImage: {
    width: '100%',
    height: 140,
    borderRadius: 14,
    resizeMode: 'cover',
  },

  cardTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#1f2937',
    marginTop: 12,
  },

  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280', // cool gray
    marginTop: 4,
  },

  cardPrice: {
    fontSize: 16,
    color: '#10b981', // emerald green
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 12,
  },
});
