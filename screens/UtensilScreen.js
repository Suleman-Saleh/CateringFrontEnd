import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem,
} from '@react-navigation/drawer';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const Drawer = createDrawerNavigator();

// Utensil categories and items
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

const ItemsListScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const data = utensilItems[category] || [];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ItemCartScreen', { item })}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <Text style={styles.cardName}>{item.name}</Text>
      <Text style={styles.cardStyle}>{item.material}</Text>
      <Text style={styles.cardPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category}</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
n        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        contentContainerStyle={styles.cardList}
      />
    </View>
  );
};

function CustomDrawerContent(props) {
  const categories = Object.keys(utensilItems);
  return (
    <DrawerContentScrollView {...props}>
      {categories.map((cat) => (
        <DrawerItem
          key={cat}
          label={cat}
          onPress={() => props.navigation.navigate('ItemsList', { category: cat })}
        />
      ))}
    </DrawerContentScrollView>
  );
}

export default function UtensilScreen() {
  return (
    <Drawer.Navigator
      initialRouteName="ItemsList"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="ItemsList"
        component={ItemsListScreen}
        initialParams={{ category: 'Cups' }}
        options={{ headerTitle: 'Utensils' }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  cardList: {
    paddingLeft: 20,
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    width: 160,
    marginRight: 15,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: 140,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardStyle: {
    fontSize: 14,
    color: 'gray',
    marginVertical: 2,
  },
  cardPrice: {
    fontSize: 16,
    color: '#333',
  },
});
