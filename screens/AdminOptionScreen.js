import { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import DecorationAdminScreen from "./DecorationAdminScreen";
import FurnitureAdminScreen from "./FurnitureAdminScreen";
import UtensilAdminScreen from "./UtensilAdminScreen";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AdminOptionScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState("Decoration");

  const tabs = [
    { key: "Decoration", icon: "paint-brush" },
    { key: "Utensils", icon: "cutlery" },
    { key: "Furniture", icon: "bed" },
    { key: "Events", icon: "calendar" }, // add event types later
  ];

  const handleTabPress = (key) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedTab(key);
  };

  const renderCurrentTab = () => {
    switch (selectedTab) {
      case "Decoration":
        return <DecorationAdminScreen navigation={navigation} />;
      case "Utensils":
        return <UtensilAdminScreen navigation={navigation} />;
      case "Furniture":
        return <FurnitureAdminScreen navigation={navigation} />;
      case "Events":
        return (
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 16, color: "#2C3E50" }}>
              Event Types CRUD Coming Soon...
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  const PillTabs = ({ categories, selected, onSelect }) => (
    <View style={styles.pillContainer}>
      {categories.map((cat) => {
        const isSelected = selected === cat.key;
        return (
          <TouchableOpacity
            key={cat.key}
            onPress={() => onSelect(cat.key)}
            style={[styles.pillTab, isSelected && styles.activePill]}
          >
            <Icon
              name={cat.icon}
              size={18}
              color={isSelected ? "#fff" : "#2C3E50"}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.pillText, isSelected && styles.activePillText]}>
              {cat.key}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Inventory</Text>

      {/* Category Tabs */}
      <PillTabs categories={tabs} selected={selectedTab} onSelect={handleTabPress} />

      {/* Tab Content */}
      <ScrollView style={styles.contentContainer}>{renderCurrentTab()}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 10 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#2C3E50", // dark blue for headings
  },
  pillContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 8,
  },
  pillTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
  },
  activePill: {
    backgroundColor: "#4A90E2", // login/register blue
  },
  pillText: {
    color: "#2C3E50",
    fontWeight: "500",
    fontSize: 14,
  },
  activePillText: {
    color: "#fff",
  },
  contentContainer: { flex: 1, marginHorizontal: 10, marginTop: 10 },
});
