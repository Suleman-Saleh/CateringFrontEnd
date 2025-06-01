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

// Furniture categories and items for events
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

const ItemsListScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const data = furnitureItems[category] || [];

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
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        contentContainerStyle={styles.cardList}
      />
    </View>
  );
};

function CustomDrawerContent(props) {
  const categories = Object.keys(furnitureItems);
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

export default function FurnitureScreen() {
  return (
    <Drawer.Navigator
      initialRouteName="ItemsList"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="ItemsList"
        component={ItemsListScreen}
        initialParams={{ category: 'Chairs' }}
        options={{ headerTitle: 'Event Furniture' }}
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
