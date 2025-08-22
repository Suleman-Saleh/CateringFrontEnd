import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
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

const STRAPI_URL = 'http://localhost:1337';

export default function DecorationAdminScreen() {
  const { updateBooking, booking } = useBooking();
  const navigation = useNavigation();
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 48) / 2;

  const [decorationItemsFromApi, setDecorationItemsFromApi] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!booking.visitedDecoration) {
      updateBooking({ visitedDecoration: true });
    }
  }, [booking.visitedDecoration, updateBooking]);

  useEffect(() => {
    const fetchDecorationItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${STRAPI_URL}/api/decoration-items?populate=DecorationImage`
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Strapi API Error Response:", errorData);
          throw new Error(
            errorData.error?.message ||
              `Failed to fetch decoration items: ${response.status} ${response.statusText}`
          );
        }

        const apiResponse = await response.json();
        console.log("Fetched decoration items raw data:", JSON.stringify(apiResponse.data, null, 2));

        const groupedItems = apiResponse.data.reduce((acc, item) => {
          const attrs = item.attributes || {};
          const category = attrs.Category;
          const name = attrs.Name;
          const style = attrs.Style;
          const price = attrs.PricePerItem;

          const images = attrs.DecorationImage?.data || [];
          let imageUrl = 'https://via.placeholder.com/150';

          if (images.length > 0 && images[0].attributes?.url) {
            imageUrl = `${STRAPI_URL}${images[0].attributes.url}`;
          } else {
            console.warn(`No valid image for item ${item.id}, Name: ${name}`);
          }

          if (!category) {
            console.warn(`Item ${item.id} missing category, skipping`);
            return acc;
          }

          if (!acc[category]) acc[category] = [];

          acc[category].push({
            id: item.id.toString(),
            name,
            style,
            price,
            category,
            image: imageUrl,
          });
          return acc;
        }, {});

        setDecorationItemsFromApi(groupedItems);

        if (Object.keys(groupedItems).length > 0 && !selectedCategory) {
          setSelectedCategory(Object.keys(groupedItems)[0]);
        }
      } catch (err) {
        console.error("Error fetching decoration items:", err);
        setError(err.message);
        Alert.alert('Error', `Failed to load decoration items: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDecorationItems();
  }, [selectedCategory]);

  const categories = Object.keys(decorationItemsFromApi);

  const handleItemPress = useCallback(
    (item) => {
      navigation.navigate('ItemCartScreen', {
        itemDetails: item,
        itemCategory: 'decoration',
      });
    },
    [navigation]
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6A1B9A" />
        <Text style={styles.loadingText}>Loading Decoration Items...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setSelectedCategory('')}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (categories.length === 0 && !loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noDataText}>
          No decoration items found. Please add items in Strapi.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.cardsContainer}>
        <FlatList
          data={decorationItemsFromApi[selectedCategory] || []}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { width: cardWidth }]}
              onPress={() => handleItemPress(item)}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.subtitle}>{item.style}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d6b0eeff',
    paddingHorizontal: 10,
    padding: 5,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsContainer: {
    flex: 1,
    width: '100%',
  },
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
    backgroundColor: '#6A1B9A',
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
  listContainer: {
    paddingBottom: 8,
    paddingTop: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    maxWidth: 320,
    height: 250,
    margin: 8,
    alignItems: 'center',
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
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6A1B9A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#6A1B9A',
    marginTop: 4,
    textAlign: 'center',
  },
  price: {
    fontSize: 15,
    color: '#6A1B9A',
    fontWeight: '700',
    marginTop: 1,
    textAlign: 'center',
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
    color: 'red',
    textAlign: 'center',
    marginHorizontal: 10,
  },
});
