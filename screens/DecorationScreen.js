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

import { useNavigation } from '@react-navigation/native';


const defaultItems = {
  Light: [
    {
      id: 'l1',
      name: 'LED Lights',
      style: 'Modern',
      price: '$10',
      image: 'https://images.unsplash.com/photo-1582719478250-04a6f016fd9c',
    },
    {
      id: 'l2',
      name: 'Spotlights',
      style: 'Vintage',
      price: '$15',
      image: 'https://images.unsplash.com/photo-1599491143532-6b78e7a2bb3c',
    },
    {
      id: 'l3',
      name: 'Fairy Lights',
      style: 'Cozy',
      price: '$8',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
    },
    {
      id: 'l4',
      name: 'Chandeliers',
      style: 'Elegant',
      price: '$55',
      image: 'https://images.unsplash.com/photo-1582719478250-04a6f016fd9c',
    },
    {
      id: 'l5',
      name: 'Stage Lights',
      style: 'Pro',
      price: '$35',
      image: 'https://images.unsplash.com/photo-1610972010079-99f06b3b2e1f',
    },
    {
      id: 'l6',
      name: 'Wall Lamps',
      style: 'Classic',
      price: '$20',
      image: 'https://images.unsplash.com/photo-1601979031925-4046bd1dc5b1',
    },
    {
      id: 'l7',
      name: 'Lanterns',
      style: 'Rustic',
      price: '$12',
      image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce',
    },
    {
      id: 'l8',
      name: 'Flood Lights',
      style: 'Industrial',
      price: '$25',
      image: 'https://images.unsplash.com/photo-1614283247215-2cf34dcdbd0c',
    },
    {
      id: 'l9',
      name: 'Floor Lamps',
      style: 'Minimalist',
      price: '$22',
      image: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
    },
    {
      id: 'l10',
      name: 'Neon Signs',
      style: 'Trendy',
      price: '$30',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
    },
  ],
  SoundSystem: [
    {
      id: 's1',
      name: 'Speakers',
      style: 'Loud',
      price: '$50',
      image: 'https://images.unsplash.com/photo-1570824104453-d2afbcdfda5b',
    },
    {
      id: 's2',
      name: 'Microphones',
      style: 'Wireless',
      price: '$20',
      image: 'https://images.unsplash.com/photo-1544511916-0148ccdeb877',
    },
    {
      id: 's3',
      name: 'Mixers',
      style: '8-Channel',
      price: '$75',
      image: 'https://images.unsplash.com/photo-1585392095623-90c3fddbe5ad',
    },
    {
      id: 's4',
      name: 'Soundbar',
      style: 'Compact',
      price: '$60',
      image: 'https://images.unsplash.com/photo-1610621406041-8f83e59c537d',
    },
    {
      id: 's5',
      name: 'Subwoofers',
      style: 'Deep Bass',
      price: '$90',
      image: 'https://images.unsplash.com/photo-1607758471579-347b60be3c49',
    },
    {
      id: 's6',
      name: 'DJ Console',
      style: 'Advanced',
      price: '$150',
      image: 'https://images.unsplash.com/photo-1612731486604-2fd1dffef445',
    },
    {
      id: 's7',
      name: 'PA System',
      style: 'Portable',
      price: '$120',
      image: 'https://images.unsplash.com/photo-1575116460701-e6e147ae9b66',
    },
    {
      id: 's8',
      name: 'Bluetooth Mic',
      style: 'Handheld',
      price: '$18',
      image: 'https://images.unsplash.com/photo-1599507593361-3b2eeb3c2117',
    },
    {
      id: 's9',
      name: 'Ceiling Speakers',
      style: 'Flush',
      price: '$40',
      image: 'https://images.unsplash.com/photo-1589621316559-84b6b001b4e2',
    },
    {
      id: 's10',
      name: 'Monitor Speakers',
      style: 'Studio',
      price: '$65',
      image: 'https://images.unsplash.com/photo-1555617980-d68ebf4c13d6',
    },
  ],
  Stage: [
    {
      id: 'st1',
      name: 'Main Stage',
      style: 'Grand',
      price: '$500',
      image: 'https://images.unsplash.com/photo-1612797283916-53a2ac5b64eb',
    },
    {
      id: 'st2',
      name: 'Podium',
      style: 'Wooden',
      price: '$100',
      image: 'https://images.unsplash.com/photo-1573164574511-73c3f7d1be32',
    },
    {
      id: 'st3',
      name: 'Backdrop',
      style: 'Custom Printed',
      price: '$150',
      image: 'https://images.unsplash.com/photo-1599351433273-fc32447f7964',
    },
    {
      id: 'st4',
      name: 'LED Walls',
      style: 'Dynamic',
      price: '$1000',
      image: 'https://images.unsplash.com/photo-1621939515954-16d7e4a82db5',
    },
    {
      id: 'st5',
      name: 'Stage Truss',
      style: 'Aluminum',
      price: '$200',
      image: 'https://images.unsplash.com/photo-1610509528010-e160c2cc4796',
    },
    {
      id: 'st6',
      name: 'Smoke Machine',
      style: 'Electric',
      price: '$80',
      image: 'https://images.unsplash.com/photo-1607290817806-e763dff87d3e',
    },
    {
      id: 'st7',
      name: 'Stage Carpet',
      style: 'Red',
      price: '$70',
      image: 'https://images.unsplash.com/photo-1601313959462-6e4e0b6575ac',
    },
    {
      id: 'st8',
      name: 'Podium Lights',
      style: 'Adjustable',
      price: '$30',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1b8e917',
    },
    {
      id: 'st9',
      name: 'Side Wings',
      style: 'Foldable',
      price: '$60',
      image: 'https://images.unsplash.com/photo-1626938746656-92e700bdfaa3',
    },
    {
      id: 'st10',
      name: 'Curtain System',
      style: 'Motorized',
      price: '$250',
      image: 'https://images.unsplash.com/photo-1590602847861-df2bdc2c204f',
    },
  ],
  Flowers: [
    {
      id: 'f1',
      name: 'Roses',
      style: 'Red Bunch',
      price: '$12',
      image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49b',
    },
    {
      id: 'f2',
      name: 'Lilies',
      style: 'White',
      price: '$15',
      image: 'https://images.unsplash.com/photo-1508780709619-79562169bc64',
    },
    {
      id: 'f3',
      name: 'Orchids',
      style: 'Purple',
      price: '$20',
      image: 'https://images.unsplash.com/photo-1602407294553-6f7d0c2173b7',
    },
    {
      id: 'f4',
      name: 'Tulips',
      style: 'Mixed',
      price: '$18',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    },
    {
      id: 'f5',
      name: 'Marigold',
      style: 'Orange',
      price: '$10',
      image: 'https://images.unsplash.com/photo-1585155775092-35857aa193a9',
    },
    {
      id: 'f6',
      name: 'Sunflowers',
      style: 'Bright',
      price: '$14',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    },
    {
      id: 'f7',
      name: 'Daisies',
      style: 'White',
      price: '$8',
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',
    },
    {
      id: 'f8',
      name: 'Carnations',
      style: 'Pink',
      price: '$9',
      image: 'https://images.unsplash.com/photo-1543872084-c7bd3822856f',
    },
    {
      id: 'f9',
      name: 'Jasmine',
      style: 'White',
      price: '$11',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
    },
    {
      id: 'f10',
      name: 'Gardenias',
      style: 'Fragrant',
      price: '$25',
      image: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6',
    },
  ],
};

export default function DecorationSection() {
  const { updateBooking } = useBooking();

  useEffect(() => {
    // Mark Decoration as visited when this screen mounts
    updateBooking({ visitedDecoration: true });
  }, []);
  const [selectedCategory, setSelectedCategory] = useState('Light');
  const categories = Object.keys(defaultItems);
  const navigation = useNavigation();

  const { width } = Dimensions.get('window');
  const cardWidth = (width - 16 * 3) / 2;

 return (
   <View style={styles.decorationContainer}>
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
       data={defaultItems[selectedCategory]}
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
  decorationContainer: {
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
