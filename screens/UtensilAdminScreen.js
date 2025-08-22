import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useBooking } from './BookingContextScreen';

const STRAPI_URL = 'http://localhost:1337'; // Your Strapi URL

export default function UtensilScreen() {
  const { updateBooking, booking } = useBooking();
  const navigation = useNavigation();
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 48) / 2;

  const [utensilItemsFromApi, setUtensilItemsFromApi] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For CRUD forms
  const [newCategory, setNewCategory] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  useEffect(() => {
    if (!booking.visitedUtensils) {
      updateBooking({ visitedUtensils: true });
    }
  }, [booking.visitedUtensils, updateBooking]);

  // Fetch utensils
  const fetchUtensilItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${STRAPI_URL}/api/utensil-items?populate=UtensilImage`);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

      const apiResponse = await response.json();
      const groupedItems = apiResponse.data.reduce((acc, entry) => {
        const item = entry.attributes;
        const category = item.Category;
        if (!category) return acc;

        if (!acc[category]) acc[category] = [];

        acc[category].push({
          id: entry.id.toString(),
          name: item.Name,
          material: item.Style,
          price: item.PricePerGuest,
          category: item.Category,
          image: item.UtensilImage?.data?.[0]?.attributes?.url
            ? `${STRAPI_URL}${item.UtensilImage.data[0].attributes.url}`
            : 'https://via.placeholder.com/150',
        });

        return acc;
      }, {});

      setUtensilItemsFromApi(groupedItems);
      if (Object.keys(groupedItems).length > 0 && !selectedCategory) {
        setSelectedCategory(Object.keys(groupedItems)[0]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
      Alert.alert('Error', `Failed to load utensils: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUtensilItems();
  }, []);

  const categories = Object.keys(utensilItemsFromApi);

  // ==== CRUD ====
  const addCategory = () => {
    if (!newCategory.trim()) return Alert.alert("Error", "Enter category name");
    setUtensilItemsFromApi(prev => ({ ...prev, [newCategory]: [] }));
    setSelectedCategory(newCategory);
    setNewCategory('');
  };

  const deleteCategory = (category) => {
    Alert.alert("Delete", `Delete category "${category}" and all its products?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => {
        setUtensilItemsFromApi(prev => {
          const copy = { ...prev };
          delete copy[category];
          return copy;
        });
        if (selectedCategory === category) setSelectedCategory('');
      }}
    ]);
  };

  const addProduct = () => {
    if (!newProductName.trim() || !newProductPrice.trim()) return Alert.alert("Error", "Enter product details");
    const product = {
      id: Date.now().toString(),
      name: newProductName,
      material: "Default",
      price: newProductPrice,
      category: selectedCategory,
      image: "https://via.placeholder.com/150"
    };
    setUtensilItemsFromApi(prev => ({
      ...prev,
      [selectedCategory]: [...(prev[selectedCategory] || []), product]
    }));
    setNewProductName('');
    setNewProductPrice('');
  };

  const deleteProduct = (id) => {
    setUtensilItemsFromApi(prev => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory].filter(p => p.id !== id)
    }));
  };

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

  return (
    <View style={styles.container}>
      {/* Category CRUD */}
      <View style={{ flexDirection: 'row', margin: 10 }}>
        <TextInput
          style={styles.input}
          placeholder="New Category"
          value={newCategory}
          onChangeText={setNewCategory}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addCategory}>
          <Text style={{ color: '#fff' }}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
        {categories.map((category) => (
          <View key={category} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => setSelectedCategory(category)}
              style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
            >
              <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteCategory(category)}>
              <Text style={{ color: 'red', marginLeft: 5 }}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Product CRUD */}
      {selectedCategory ? (
        <View style={{ marginVertical: 10 }}>
          <TextInput
            style={styles.input}
            placeholder="New Product Name"
            value={newProductName}
            onChangeText={setNewProductName}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={newProductPrice}
            onChangeText={setNewProductPrice}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.addBtn} onPress={addProduct}>
            <Text style={{ color: '#fff' }}>Add Product</Text>
          </TouchableOpacity>
        </View>
      ) : null}

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
              onLongPress={() => deleteProduct(item.id)}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.title}>{item.name}</Text>
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
  container: { flex: 1, backgroundColor: '#d6b0eeff', paddingHorizontal: 10, padding: 5, borderRadius: 40 },
  cardsContainer: { flex: '90%' },
  categoryScroll: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 20, marginBottom: 4 },
  categoryButton: { paddingHorizontal: 24, paddingVertical: 10, backgroundColor: '#e5e7eb', borderRadius: 30, marginRight: 12 },
  categoryButtonActive: { backgroundColor: '#6A1B9A' },
  categoryText: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  categoryTextActive: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: 'white', borderRadius: 16, maxWidth: 320, height: 250, margin: 8, alignItems: 'center' },
  image: { width: 300, height: 160, margin: 10, borderRadius: 15 },
  title: { fontSize: 15, fontWeight: '700', color: '#6A1B9A' },
  subtitle: { fontSize: 13, color: '#6A1B9A', marginTop: 4 },
  price: { fontSize: 15, color: '#6A1B9A', fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#aaa', padding: 8, borderRadius: 8, margin: 5, backgroundColor: '#fff' },
  addBtn: { backgroundColor: '#6A1B9A', padding: 10, borderRadius: 8, margin: 5, alignItems: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#333' }
});
