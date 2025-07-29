import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert
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
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchUtensilItems()}>
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
  categoryContainer: {
    paddingVertical: 1,
    backgroundColor: '#ffffff',
    paddingBottom: 3,
  },
  cardsContainer: {
    flex: 1,
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
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#6A1B9A',
  },
  categoryButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#e5e7eb',
    borderRadius: 30,
    marginRight: 12,
    minWidth: 120,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 16,
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
    backgroundColor: '#6A1B9A',
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
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});