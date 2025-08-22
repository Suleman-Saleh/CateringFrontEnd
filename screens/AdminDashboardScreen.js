import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const quickActions = [
  { id: '1', label: '📅 Manage Events', type: 'primary', action: 'manageEvents' },
  { id: '2', label: '📦 Manage Inventory', type: 'secondary', action: 'manageInventory' },
  { id: '3', label: '👤 Manage Users', type: 'secondary', action: 'manageUsers' },
  { id: '4', label: '⚙ Settings', type: 'secondary', action: 'settings' },
];

const stats = {
  events: 120,
  inventory: 340,
  users: 50,
};

const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  const scaleAnimRefs = useRef(quickActions.map(() => new Animated.Value(1)));

  useEffect(() => {
    // fetch admin stats if needed
  }, []);

  const handlePressAction = (index, action) => {
    Animated.sequence([
      Animated.timing(scaleAnimRefs.current[index], { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnimRefs.current[index], { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      if (action.action === 'manageEvents') {
        navigation.navigate('ManageEventsScreen'); // 👉 go directly to ManageEvents screen
      } else if (action.action === 'manageInventory') {
        navigation.navigate('AdminOptionScreen');
      } else if (action.action === 'manageUsers') {
        navigation.navigate('ManageUsersScreen');
      } else if (action.action === 'settings') {
        alert('Settings clicked');
      }
    });
  };

  const renderQuickAction = (action, index) => {
    const scaleAnim = scaleAnimRefs.current[index];
    return (
      <Animated.View
        key={action.id}
        style={[
          styles.actionTile,
          action.type === 'primary' && styles.primaryActionTile,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <TouchableOpacity onPress={() => handlePressAction(index, action)} activeOpacity={0.8}>
          <Text style={action.type === 'primary' ? styles.primaryActionText : styles.secondaryActionText}>
            {action.label}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <FlatList
      data={[]} // no list, only header + footer
      renderItem={null}
      ListHeaderComponent={
        <>
          <LinearGradient colors={['#7B1FA2', '#4A148C']} style={styles.headerGradient}>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
          </LinearGradient>

          <View style={styles.quickActionsRow}>
            {quickActions.map((action, index) => renderQuickAction(action, index))}
          </View>

          <Text style={styles.sectionTitle}>System Statistics</Text>
        </>
      }
      ListFooterComponent={
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>📅 Total Events: {stats.events}</Text>
          <Text style={styles.statText}>📦 Inventory Items: {stats.inventory}</Text>
          <Text style={styles.statText}>👤 Total Users: {stats.users}</Text>
        </View>
      }
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: { padding: 16, backgroundColor: '#F9FAFB', paddingBottom: 50 },
  headerGradient: { height: 150, justifyContent: 'center', alignItems: 'center', borderRadius: 12, marginBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  quickActionsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  actionTile: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryActionTile: { backgroundColor: '#7B1FA2', borderColor: '#7B1FA2' },
  primaryActionText: { color: '#FFFFFF', fontWeight: '600', textAlign: 'center' },
  secondaryActionText: { color: '#1F2937', fontWeight: '500', textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 16 },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    marginTop: 16,
  },
  statText: { fontSize: 16, color: '#374151', marginBottom: 10, fontWeight: '500' },
});

export default AdminDashboardScreen;
