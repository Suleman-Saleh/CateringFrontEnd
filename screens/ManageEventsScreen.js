import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ManageEventsScreen = () => {
  const [activeTab, setActiveTab] = useState('all'); // default tab
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (activeTab === 'all') {
      fetchEvents();
    }
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Replace with your Strapi backend URL
      const res = await fetch('http://192.168.1.107:1337/api/events'); 
      const data = await res.json();

      // Strapi v4 returns data inside "data"
      setEvents(data.data || []);
    } catch (err) {
      console.log('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderEventItem = ({ item }) => {
    const event = item.attributes; // Strapi stores fields in attributes
    return (
      <View style={styles.eventCard}>
        <Text style={styles.eventTitle}>{event?.name || 'Untitled Event'}</Text>
        <Text style={styles.eventDetails}>{event?.date || 'No Date'}</Text>
        <Text style={styles.eventDetails}>{event?.location || 'No Location'}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Manage Events</Text>

      {/* Tab Switch */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All Events
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'add' && styles.activeTab]}
          onPress={() => {
            setActiveTab('add');
            navigation.navigate('EventInfoScreen'); // make sure this matches your route
          }}
        >
          <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>
            Add New Event
          </Text>
        </TouchableOpacity>
      </View>

      {/* Body */}
      {activeTab === 'all' ? (
        loading ? (
          <ActivityIndicator size="large" color="#7B1FA2" style={{ marginTop: 20 }} />
        ) : events.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#6B7280' }}>
            No events available
          </Text>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEventItem}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        )
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#4A148C' },
  tabContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeTab: { backgroundColor: '#7B1FA2' },
  tabText: { fontSize: 16, fontWeight: '600', color: '#374151' },
  activeTabText: { color: '#FFFFFF' },
  eventCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  eventTitle: { fontSize: 18, fontWeight: '600', marginBottom: 6, color: '#1F2937' },
  eventDetails: { fontSize: 14, color: '#6B7280' },
});

export default ManageEventsScreen;
