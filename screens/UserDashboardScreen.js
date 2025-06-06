import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const events = [
  { id: '1', title: 'Birthday Party', date: 'June 15, 2024', status: 'Confirmed' },
  { id: '2', title: 'Wedding Reception', date: 'July 20, 2024', status: 'Pending' },
];

const DashboardScreen = () => {
  const navigation = useNavigation();

  const handleNewEvent = () => {
    navigation.navigate('EventInfoScreen');
  };

  const renderEvent = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDate}>{item.date}</Text>
      <View style={[styles.statusBadge, item.status === 'Confirmed' ? styles.statusConfirmed : styles.statusPending]}>
        <Text style={item.status === 'Confirmed' ? styles.statusTextConfirmed : styles.statusTextPending}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  const stats = {
    total: events.length,
    confirmed: events.filter(e => e.status === 'Confirmed').length,
    pending: events.filter(e => e.status === 'Pending').length,
  };

  return (
    <FlatList
      data={events}
      renderItem={renderEvent}
      keyExtractor={item => item.id}
      ListHeaderComponent={
        <>
          <Text style={styles.header}>Dashboard</Text>

          {/* Quick Actions */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity onPress={handleNewEvent} style={[styles.actionButton, styles.primaryAction]}>
              <Text style={styles.primaryActionText}>+ New Event</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.secondaryActionText}>View Events</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.secondaryActionText}>Settings</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Recent Events</Text>
        </>
      }
      ListFooterComponent={
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <Text style={styles.statText}>Total Events: {stats.total}</Text>
          <Text style={[styles.statText, styles.confirmedText]}>Confirmed: {stats.confirmed}</Text>
          <Text style={[styles.statText, styles.pendingText]}>Pending: {stats.pending}</Text>
        </View>
      }
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  primaryAction: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  secondaryActionText: {
    color: '#1F2937',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  confirmedText: {
    color: '#047857',
  },
  pendingText: {
    color: '#B45309',
  },
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
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  eventDate: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  statusConfirmed: {
    backgroundColor: '#D1FAE5',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusTextConfirmed: {
    fontSize: 12,
    fontWeight: '500',
    color: '#065F46',
  },
  statusTextPending: {
    fontSize: 12,
    fontWeight: '500',
    color: '#92400E',
  },
});

export default DashboardScreen;
