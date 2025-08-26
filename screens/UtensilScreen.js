import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useBooking } from './BookingContextScreen';

const STRAPI_URL = 'http://localhost:1337'; // Ensure this matches your Strapi URL

export default function UtensilScreen() {
  const { updateBooking, booking } = useBooking();
  const navigation = useNavigation();
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 48) / 2;

  const [utensilItemsFromApi, setUtensilItemsFromApi] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Assuming you have `visitedUtensils` in your BookingContextScreen
    // This marks that the utensil selection screen has been visited.
    if (!booking.visitedUtensils) {
      updateBooking({ visitedUtensils: true });
    }
  }, [booking.visitedUtensils, updateBooking]);

  useEffect(() => {
    const fetchUtensilItems = async () => {
      try {
        setLoading(true);
        setError(null);
        // Correct API endpoint and populate parameter for 'UtensilImage'
        const response = await fetch(`${STRAPI_URL}/api/utensil-items?populate=UtensilImage`);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Strapi API Error Response:", errorData);
          throw new Error(errorData.error?.message || `Failed to fetch utensil items: ${response.status} ${response.statusText}`);
        }
        const apiResponse = await response.json();
        console.log("Fetched utensil items raw data:", JSON.stringify(apiResponse.data, null, 2));

        const groupedItems = apiResponse.data.reduce((acc, item) => {
          // Access fields directly from 'item' using their exact Strapi names (case-sensitive)
          const category = item.Category; // Directly from Strapi data
          const name = item.Name; // Directly from Strapi data
          const style = item.Style; // Directly from Strapi data
          const price = item.PricePerGuest; // Directly from Strapi data, now PricePerGuest
          const utensilImage = item.UtensilImage; // Directly from Strapi data

          if (!category) {
            console.warn(`Item ${item.id} is missing a category field. Skipping this item.`);
            return acc;
          }

          if (!acc[category]) {
            acc[category] = [];
          }

          let imageUrl = 'https://via.placeholder.com/150'; // Default placeholder

          // Handle 'Multiple Media' field: take the first image if available
          const firstImage = utensilImage?.[0]; // Access the first object in the array if it exists

          if (firstImage && firstImage.url) {
            imageUrl = `${STRAPI_URL}${firstImage.url}`;
          } else {
            console.warn(`No valid image URL found for item ID: ${item.id}, Name: ${name}. UtensilImage data:`, utensilImage);
          }

          acc[category].push({
            id: item.id.toString(), // Ensure ID is a string for keyExtractor
            name: name,
            material: style, // Map Strapi's 'Style' to 'material' for consistency with subtitle display
            price: price,
            category: category,
            image: imageUrl,
          });
          return acc;
        }, {});

        setUtensilItemsFromApi(groupedItems);

        // Set initial selected category after data is fetched
        if (Object.keys(groupedItems).length > 0 && !selectedCategory) {
          setSelectedCategory(Object.keys(groupedItems)[0]);
        }
      } catch (err) {
        console.error("Error fetching utensil items:", err);
        setError(err.message);
        Alert.alert('Error', `Failed to load utensil items: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUtensilItems();
  }, [selectedCategory]);

  const categories = Object.keys(utensilItemsFromApi);

  const handleItemPress = useCallback((item) => {
    navigation.navigate('ItemCartScreen', { itemDetails: item, itemCategory: 'utensil' });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6A1B9A" />
        <Text style={styles.loadingText}>Loading Utensil Items...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={("Furniture Button is Pressed") }>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (categories.length === 0 && !loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noDataText}>No utensil items found. Please add items in Strapi.</Text>
      </View>
    );
  }

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
          data={utensilItemsFromApi[selectedCategory] || []}
          keyExtractor={(item) => item.id}
                     showsVerticalScrollIndicator={false} 
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { width: cardWidth }]}
              onPress={() => handleItemPress(item)}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.title}>{item.name}</Text>
              {/* This will now display the 'Style' value from Strapi, mapped to 'material' */}
              <Text style={styles.subtitle}>{item.material}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  // ==== Containers ====
  container: {
    flex: 1,
    backgroundColor: '#EAF2FA', // ✅ plain white (no gradient)
    paddingHorizontal: 10,
    padding: 5,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.5,
  },
  categoryContainer: {
    paddingVertical: 0,
    backgroundColor: 'white',
    paddingBottom: 0,
  },
  cardsContainer: {
    flex: '90%',
  },

  // ==== Category Scroll & Buttons ====
  categoryScroll: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  categoryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 30,
    marginRight: 12,
    maxWidth: 150,
    maxHeight: 55,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  categoryButtonActive: {
    backgroundColor: '#4A90E2', // ✅ active blue
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  categoryTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },

  // ==== Product List & Cards ====
  listContainer: {
    paddingBottom: 8,
    paddingTop: 4,
  },
  card: {
    backgroundColor: '#87CEFA', // ✅ light sky blue card
    borderRadius: 16,
    maxWidth: 320,
    height: 250,
    elevation: 2,
    margin: 8,
    shadowColor: '#000000',
    alignItems: 'center',
    resizeMode: 'contain',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  image: {
    width: 300,
    height: 160,
    margin: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#004080', // ✅ darker blue for text
    marginTop: 0,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#2C3E50', // ✅ secondary dark blue
    marginTop: 4,
    textAlign: 'center',
  },
  price: {
    fontSize: 15,
    color: '#004080', // ✅ darker blue price
    fontWeight: '700',
    marginTop: 1,
    textAlign: 'center',
  },

  // ==== Loading & Error States ====
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4A90E2', // ✅ blue retry
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginHorizontal: 10,
  },
});
