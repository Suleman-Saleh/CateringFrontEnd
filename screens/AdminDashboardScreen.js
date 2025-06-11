import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const recentEvents = [
  { id: '1', title: 'Wedding Ceremony', date: 'Jul 12, 2024', status: 'Confirmed' },
  { id: '2', title: 'Birthday Bash', date: 'Jun 28, 2024', status: 'Pending' },
  { id: '3', title: 'Baby Shower', date: 'Jun 15, 2024', status: 'Confirmed' },
];

const AdminDashboardScreen = () => {
  const navigation = useNavigation();

  const navigateTo = (screen) => () => navigation.navigate(screen);

  const renderEventItem = ({ item }) => (
    <View style={styles.eventCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>{item.date}</Text>
        <Text style={[styles.status, item.status === 'Confirmed' ? styles.confirmed : styles.pending]}>
          {item.status}
        </Text>
      </View>
      <View style={styles.eventActions}>
        <TouchableOpacity style={styles.editBtn}><Text style={styles.editText}>Edit</Text></TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn}><Text style={styles.deleteText}>Delete</Text></TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Admin Panel</Text>
      <Text style={styles.subHeader}>Welcome, Admin!</Text>

      {/* Statistics */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}><Text style={styles.statNumber}>12</Text><Text style={styles.statLabel}>Events</Text></View>
        <View style={styles.statCard}><Text style={styles.statNumber}>38</Text><Text style={styles.statLabel}>Products</Text></View>
        <View style={styles.statCard}><Text style={styles.statNumber}>3</Text><Text style={styles.statLabel}>Categories</Text></View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={navigateTo('EventFormScreen')}><Text style={styles.btnText}>+ New Event</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={navigateTo('ManageProductsScreen')}><Text style={styles.btnText}>Manage Products</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={navigateTo('ManageCategoriesScreen')}><Text style={styles.btnText}>Manage Categories</Text></TouchableOpacity>
      </View>

      {/* Recent Events */}
      <Text style={styles.sectionTitle}>Recent Events</Text>
      <FlatList
        data={recentEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEventItem}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  subHeader: { fontSize: 16, color: '#6B7280', marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCard: { flex: 1, marginHorizontal: 4, backgroundColor: '#FFF', padding: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
  statNumber: { fontSize: 20, fontWeight: '700', color: '#4B5563' },
  statLabel: { fontSize: 14, color: '#6B7280' },
  actionsRow: { marginBottom: 24 },
  actionBtn: { backgroundColor: '#4F46E5', padding: 14, borderRadius: 12, marginBottom: 12, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#1F2937' },
  eventCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 1 },
  eventTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  eventDate: { fontSize: 13, color: '#6B7280' },
  status: { marginTop: 4, fontSize: 12, fontWeight: '500' },
  confirmed: { color: '#047857' },
  pending: { color: '#B45309' },
  eventActions: { flexDirection: 'row' },
  editBtn: { marginRight: 12 },
  editText: { color: '#2563EB' },
  deleteBtn: {},
  deleteText: { color: '#DC2626' },
});

export default AdminDashboardScreen;
