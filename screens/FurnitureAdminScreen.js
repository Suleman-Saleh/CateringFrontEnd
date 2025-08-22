import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const STRAPI_URL = 'http://localhost:1337';

export default function FurnitureAdminScreen() {
  const navigation = useNavigation();
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 48) / 2;

  const [itemsByCategory, setItemsByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state for CRUD
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ name: '', style: '', price: '', category: '' });

  // Fetch items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${STRAPI_URL}/api/furniture-items?populate=FurnitureImage`);
      const data = await response.json();

      const grouped = data.data.reduce((acc, item) => {
        const category = item.Category;
        if (!category) return acc;

        if (!acc[category]) acc[category] = [];

        const firstImage = item.FurnitureImage?.[0];
        const imageUrl = firstImage?.url ? `${STRAPI_URL}${firstImage.url}` : 'https://via.placeholder.com/150';

        acc[category].push({
          id: item.id,
          name: item.Name,
          material: item.Style,
          price: item.PricePerUnit,
          category,
          image: imageUrl,
        });
        return acc;
      }, {});

      setItemsByCategory(grouped);
      if (!selectedCategory && Object.keys(grouped).length > 0) {
        setSelectedCategory(Object.keys(grouped)[0]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // CRUD actions
  const handleSave = async () => {
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem
        ? `${STRAPI_URL}/api/furniture-items/${editingItem.id}`
        : `${STRAPI_URL}/api/furniture-items`;

      const body = {
        data: {
          Name: form.name,
          Style: form.style,
          PricePerUnit: parseFloat(form.price),
          Category: form.category,
        },
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Failed to ${editingItem ? 'update' : 'create'} item`);
      setModalVisible(false);
      setEditingItem(null);
      setForm({ name: '', style: '', price: '', category: '' });
      fetchItems();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${STRAPI_URL}/api/furniture-items/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete item');
      fetchItems();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const categories = Object.keys(itemsByCategory);

  if (loading) return <ActivityIndicator size="large" color="#6A1B9A" />;

  return (
    <View style={styles.container}>
      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[styles.categoryButton, selectedCategory === cat && styles.categoryButtonActive]}
          >
            <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add New Item Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditingItem(null);
          setForm({ name: '', style: '', price: '', category: selectedCategory || '' });
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Add Item</Text>
      </TouchableOpacity>

      {/* Items List */}
      <FlatList
        data={itemsByCategory[selectedCategory] || []}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={[styles.card, { width: cardWidth }]}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.material}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => {
                setEditingItem(item);
                setForm({ name: item.name, style: item.material, price: item.price.toString(), category: item.category });
                setModalVisible(true);
              }}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* CRUD Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <TextInput placeholder="Name" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} style={styles.input} />
            <TextInput placeholder="Style" value={form.style} onChangeText={(t) => setForm({ ...form, style: t })} style={styles.input} />
            <TextInput placeholder="Price" value={form.price} keyboardType="numeric" onChangeText={(t) => setForm({ ...form, price: t })} style={styles.input} />
            <TextInput placeholder="Category" value={form.category} onChangeText={(t) => setForm({ ...form, category: t })} style={styles.input} />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={handleSave}><Text style={styles.save}>Save</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={styles.cancel}>Cancel</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  categoryScroll: { flexDirection: 'row', marginBottom: 10 },
  categoryButton: { padding: 10, backgroundColor: '#ddd', borderRadius: 20, marginRight: 10 },
  categoryButtonActive: { backgroundColor: '#6A1B9A' },
  categoryText: { color: '#000' },
  categoryTextActive: { color: '#fff' },
  addButton: { backgroundColor: '#6A1B9A', padding: 12, borderRadius: 10, marginVertical: 10 },
  addButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  card: { backgroundColor: '#f9f9f9', borderRadius: 12, margin: 8, padding: 10, alignItems: 'center' },
  image: { width: 100, height: 100, borderRadius: 10 },
  title: { fontWeight: 'bold', marginTop: 5 },
  subtitle: { color: '#666' },
  price: { color: '#6A1B9A', fontWeight: 'bold' },
  actions: { flexDirection: 'row', marginTop: 5, gap: 10 },
  edit: { color: 'blue' },
  delete: { color: 'red' },
  modal: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: { backgroundColor: '#fff', padding: 20, margin: 20, borderRadius: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8, marginVertical: 5 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  save: { color: 'green', fontWeight: 'bold' },
  cancel: { color: 'red', fontWeight: 'bold' },
});
