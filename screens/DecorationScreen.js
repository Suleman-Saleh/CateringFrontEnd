import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem,
} from '@react-navigation/drawer';
import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const Drawer = createDrawerNavigator();

const defaultItems = {
  Light: [
    { id: 'l1', name: 'LED Lights', style: 'Modern', price: '$10', image: 'https://images.unsplash.com/photo-1582719478250-04a6f016fd9c' },
    { id: 'l2', name: 'Spotlights', style: 'Vintage', price: '$15', image: 'https://images.unsplash.com/photo-1599491143532-6b78e7a2bb3c' },
    { id: 'l3', name: 'Fairy Lights', style: 'Cozy', price: '$8', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750' },
    { id: 'l4', name: 'Chandeliers', style: 'Elegant', price: '$55', image: 'https://images.unsplash.com/photo-1582719478250-04a6f016fd9c' },
    { id: 'l5', name: 'Stage Lights', style: 'Pro', price: '$35', image: 'https://images.unsplash.com/photo-1610972010079-99f06b3b2e1f' },
    { id: 'l6', name: 'Wall Lamps', style: 'Classic', price: '$20', image: 'https://images.unsplash.com/photo-1601979031925-4046bd1dc5b1' },
    { id: 'l7', name: 'Lanterns', style: 'Rustic', price: '$12', image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce' },
    { id: 'l8', name: 'Flood Lights', style: 'Industrial', price: '$25', image: 'https://images.unsplash.com/photo-1614283247215-2cf34dcdbd0c' },
    { id: 'l9', name: 'Floor Lamps', style: 'Minimalist', price: '$22', image: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6' },
    { id: 'l10', name: 'Neon Signs', style: 'Trendy', price: '$30', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c' },
  ],
  SoundSystem: [
    { id: 's1', name: 'Speakers', style: 'Loud', price: '$50', image: 'https://images.unsplash.com/photo-1570824104453-d2afbcdfda5b' },
    { id: 's2', name: 'Microphones', style: 'Wireless', price: '$20', image: 'https://images.unsplash.com/photo-1544511916-0148ccdeb877' },
    { id: 's3', name: 'Mixers', style: '8-Channel', price: '$75', image: 'https://images.unsplash.com/photo-1585392095623-90c3fddbe5ad' },
    { id: 's4', name: 'Soundbar', style: 'Compact', price: '$60', image: 'https://images.unsplash.com/photo-1610621406041-8f83e59c537d' },
    { id: 's5', name: 'Subwoofers', style: 'Deep Bass', price: '$90', image: 'https://images.unsplash.com/photo-1607758471579-347b60be3c49' },
    { id: 's6', name: 'DJ Console', style: 'Advanced', price: '$150', image: 'https://images.unsplash.com/photo-1612731486604-2fd1dffef445' },
    { id: 's7', name: 'PA System', style: 'Portable', price: '$120', image: 'https://images.unsplash.com/photo-1575116460701-e6e147ae9b66' },
    { id: 's8', name: 'Bluetooth Mic', style: 'Handheld', price: '$18', image: 'https://images.unsplash.com/photo-1599507593361-3b2eeb3c2117' },
    { id: 's9', name: 'Ceiling Speakers', style: 'Flush', price: '$40', image: 'https://images.unsplash.com/photo-1589621316559-84b6b001b4e2' },
    { id: 's10', name: 'Monitor Speakers', style: 'Studio', price: '$65', image: 'https://images.unsplash.com/photo-1555617980-d68ebf4c13d6' },
  ],
  Stage: [
    { id: 'st1', name: 'Main Stage', style: 'Grand', price: '$500', image: 'https://images.unsplash.com/photo-1612797283916-53a2ac5b64eb' },
    { id: 'st2', name: 'Podium', style: 'Wooden', price: '$100', image: 'https://images.unsplash.com/photo-1573164574511-73c3f7d1be32' },
    { id: 'st3', name: 'Backdrop', style: 'Custom Printed', price: '$150', image: 'https://images.unsplash.com/photo-1599351433273-fc32447f7964' },
    { id: 'st4', name: 'LED Walls', style: 'Dynamic', price: '$1000', image: 'https://images.unsplash.com/photo-1621939515954-16d7e4a82db5' },
    { id: 'st5', name: 'Stage Truss', style: 'Aluminum', price: '$200', image: 'https://images.unsplash.com/photo-1610509528010-e160c2cc4796' },
    { id: 'st6', name: 'Smoke Machine', style: 'Electric', price: '$80', image: 'https://images.unsplash.com/photo-1607290817806-e763dff87d3e' },
    { id: 'st7', name: 'Stage Carpet', style: 'Red', price: '$70', image: 'https://images.unsplash.com/photo-1601313959462-6e4e0b6575ac' },
    { id: 'st8', name: 'Podium Lights', style: 'Adjustable', price: '$30', image: 'https://images.unsplash.com/photo-1583337130417-3346a1b8e917' },
    { id: 'st9', name: 'Side Wings', style: 'Foldable', price: '$60', image: 'https://images.unsplash.com/photo-1626938746656-92e700bdfaa3' },
    { id: 'st10', name: 'Curtain System', style: 'Motorized', price: '$250', image: 'https://images.unsplash.com/photo-1590602847861-df2bdc2c204f' },
  ],
  Flowers: [
    { id: 'f1', name: 'Roses', style: 'Red Bunch', price: '$12', image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49b' },
    { id: 'f2', name: 'Lilies', style: 'White', price: '$15', image: 'https://images.unsplash.com/photo-1508780709619-79562169bc64' },
    { id: 'f3', name: 'Orchids', style: 'Purple', price: '$20', image: 'https://images.unsplash.com/photo-1602407294553-6f7d0c2173b7' },
    { id: 'f4', name: 'Tulips', style: 'Mixed', price: '$18', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba' },
    { id: 'f5', name: 'Marigold', style: 'Orange', price: '$10', image: 'https://images.unsplash.com/photo-1585155775092-35857aa4a660' },
    { id: 'f6', name: 'Hydrangea', style: 'Blue', price: '$14', image: 'https://images.unsplash.com/photo-1547586696-05cb04cbb286' },
    { id: 'f7', name: 'Carnations', style: 'Pink', price: '$11', image: 'https://images.unsplash.com/photo-1584110722545-4b53a1c1a9c2' },
    { id: 'f8', name: 'Sunflowers', style: 'Bright', price: '$13', image: 'https://images.unsplash.com/photo-1599796974311-67160ba1e026' },
    { id: 'f9', name: 'Peonies', style: 'Romantic', price: '$16', image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786' },
    { id: 'f10', name: 'Baby’s Breath', style: 'Filler', price: '$9', image: 'https://images.unsplash.com/photo-1616514574857-055b0b06f7df' },
  ],
  Carpets: [
    { id: 'c1', name: 'Red Carpet', style: 'Classic', price: '$50', image: 'https://images.unsplash.com/photo-1567443027486-d13628b98ecb' },
    { id: 'c2', name: 'Green Carpet', style: 'Fresh', price: '$45', image: 'https://images.unsplash.com/photo-1503952620401-7f2b7d636bc2' },
    { id: 'c3', name: 'Designer Carpet', style: 'Patterned', price: '$80', image: 'https://images.unsplash.com/photo-1618213522397-0c8b41cb9842' },
    { id: 'c4', name: 'Silk Carpet', style: 'Luxury', price: '$100', image: 'https://images.unsplash.com/photo-1610534923039-b5f1a2cdd8a6' },
    { id: 'c5', name: 'Round Carpet', style: 'Modern', price: '$65', image: 'https://images.unsplash.com/photo-1600566753193-b1bc88f2eb2d' },
    { id: 'c6', name: 'Hallway Runner', style: 'Narrow', price: '$40', image: 'https://images.unsplash.com/photo-1618220525956-2a19104c676d' },
    { id: 'c7', name: 'Floral Carpet', style: 'Decorative', price: '$70', image: 'https://images.unsplash.com/photo-1580927752452-b7b980028e42' },
    { id: 'c8', name: 'Velvet Carpet', style: 'Soft', price: '$60', image: 'https://images.unsplash.com/photo-1571687949929-8eb4afaa80ed' },
    { id: 'c9', name: 'Plain Beige', style: 'Neutral', price: '$35', image: 'https://images.unsplash.com/photo-1620626022493-514681d002f5' },
    { id: 'c10', name: 'Geometric Carpet', style: 'Bold', price: '$90', image: 'https://images.unsplash.com/photo-1557682260-967aeef2e66c' },
  ],
  Curtains: [
    { id: 'cu1', name: 'Silk Curtains', style: 'Shiny', price: '$40', image: 'https://images.unsplash.com/photo-1617807081304-407821a837e2' },
    { id: 'cu2', name: 'Velvet Curtains', style: 'Luxury', price: '$55', image: 'https://images.unsplash.com/photo-1564540581180-cb0f5dfe8d3a' },
    { id: 'cu3', name: 'Sheer Curtains', style: 'Light', price: '$30', image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a' },
    { id: 'cu4', name: 'Printed Curtains', style: 'Floral', price: '$45', image: 'https://images.unsplash.com/photo-1617807397875-9d7061c016ed' },
    { id: 'cu5', name: 'Blackout Curtains', style: 'Dark', price: '$50', image: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4d' },
    { id: 'cu6', name: 'Lace Curtains', style: 'Vintage', price: '$35', image: 'https://images.unsplash.com/photo-1573817780548-b8f469d30358' },
    { id: 'cu7', name: 'Cotton Curtains', style: 'Simple', price: '$25', image: 'https://images.unsplash.com/photo-1582821368355-4e202f7f3d37' },
    { id: 'cu8', name: 'Striped Curtains', style: 'Bold', price: '$38', image: 'https://images.unsplash.com/photo-1573472708996-743d352be3f5' },
    { id: 'cu9', name: 'Embroidered Curtains', style: 'Decorative', price: '$60', image: 'https://images.unsplash.com/photo-1581381179977-111d4c2cf9ee' },
    { id: 'cu10', name: 'Dual Tone Curtains', style: 'Elegant', price: '$48', image: 'https://images.unsplash.com/photo-1528977695562-b0c6f1cf1cb5' },
  ],
};

const ItemsListScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const items = defaultItems[category] || [];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{ padding: 10, borderBottomWidth: 1 }}
      onPress={() => navigation.navigate('ItemCartScreen', { item })}
    >
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardStyle}>{item.style}</Text>
        <Text style={styles.cardPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category} Items</Text>
      <FlatList
        data={items}
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
  const categories = Object.keys(defaultItems);
  return (
    <DrawerContentScrollView {...props}>
      {categories.map((category) => (
        <DrawerItem
          key={category}
          label={category}
          onPress={() => {
            props.navigation.navigate('ItemsList', { category });
          }}
        />
      ))}
    </DrawerContentScrollView>
  );
}

export default function DecorationScreen() {
  return (
    <Drawer.Navigator
      initialRouteName="ItemsList"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="ItemsList"
        component={ItemsListScreen}
        initialParams={{ category: 'Light' }}
        options={{ headerTitle: 'Decoration Items' }}
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
    width: 180,
    marginRight: 15,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardName: {
    fontSize: 18,
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











