import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
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

  const handlePressAction = (index, action) => {
    Animated.sequence([
      Animated.timing(scaleAnimRefs.current[index], { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnimRefs.current[index], { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      if (action.action === 'manageEvents') {
        navigation.navigate('ManageEventsScreen');
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
    <LinearGradient colors={['#4A90E2', '#2C3E50']} style={styles.gradientBackground}>
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>

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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionTile: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#EAF2FA', // updated card color
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryActionTile: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryActionText: {
    color: '#2C3E50',
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  statsContainer: {
    backgroundColor: '#EAF2FA', // updated card color
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 16,
  },
  statText: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 10,
    fontWeight: '500',
  },
});

export default AdminDashboardScreen;
