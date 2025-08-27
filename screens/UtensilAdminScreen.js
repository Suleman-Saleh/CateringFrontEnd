import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
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

const STRAPI_URL = 'http://localhost:1337';

export default function UtensilScreen() {
  const { updateBooking, booking } = useBooking();
  const navigation = useNavigation();
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 48) / 2;

  const [utensilItemsFromApi, setUtensilItemsFromApi] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // CRUD forms
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
    Alert.alert("Delete", `Delete category "${category}"?`, [
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
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading Utensils...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#4A90E2', '#2C3E50']} style={styles.gradientBackground}>
      {/* Category CRUD */}
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="New Category"
          value={newCategory}
          onChangeText={setNewCategory}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addCategory}>
          <Text style={styles.btnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
        {categories.map((category) => (
          <View key={category} style={styles.categoryRow}>
            <TouchableOpacity
              onPress={() => setSelectedCategory(category)}
              style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
            >
              <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteCategory(category)}>
              <Text style={styles.deleteText}>X</Text>
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
            <Text style={styles.btnText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Products */}
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: { flex: 1, padding: 12 },
  row: { flexDirection: 'row', margin: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, backgroundColor: '#fff' },
  addBtn: { backgroundColor: '#2C3E50', padding: 10, borderRadius: 8, marginLeft: 8, justifyContent: 'center' },
  btnText: { color: '#fff', textAlign: 'center' },
  categoryScroll: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 10 },
  categoryRow: { flexDirection: 'row', alignItems: 'center' },
  categoryButton: { paddingHorizontal: 18, paddingVertical: 8, backgroundColor: '#EAF2FA', borderRadius: 20, marginRight: 8 },
  categoryButtonActive: { backgroundColor: '#4A90E2' },
  categoryText: { fontSize: 14, color: '#2C3E50' },
  categoryTextActive: { color: '#fff' },
  deleteText: { color: 'red', marginLeft: 4 },
  cardsContainer: { flex: 1 },
  listContainer: { paddingBottom: 80 },
  card: { backgroundColor: '#EAF2FA', borderRadius: 16, height: 220, margin: 8, alignItems: 'center', padding: 8 },
  image: { width: '100%', height: 120, borderRadius: 12 },
  title: { fontSize: 14, color: '#2C3E50', marginTop: 6 },
  subtitle: { fontSize: 12, color: '#555' },
  price: { fontSize: 14, color: '#4A90E2', marginTop: 4 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 14, color: '#fff' },
});
