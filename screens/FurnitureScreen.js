
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
  View
} from 'react-native';
import { useBooking } from './BookingContextScreen'; // adjust import path

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
    // Mark Decoration as visited when this screen mounts
    updateBooking({ visitedFurniture: true });
  }, []);
  const [selectedCategory, setSelectedCategory] = useState('Chairs');
  const categories = Object.keys(furnitureItems);
   const navigation = useNavigation();
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 48) / 2; // 16px padding + 16px between cards

 return (
   <View style={styles.furnitureContainer}>
     {/* Category Tabs */}
     <ScrollView
       horizontal={true}
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
       data={furnitureItems[selectedCategory]}
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
 furnitureContainer: {
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
