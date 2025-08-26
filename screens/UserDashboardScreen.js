import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const quickActions = [
  { id: '1', label: '+ New Event', type: 'primary', action: 'newEvent' },
  { id: '2', label: 'View Events', type: 'secondary', action: 'viewEvents' },
  { id: '3', label: 'Settings', type: 'secondary', action: 'settings' },
];

const events = [
  { id: '1', title: 'Birthday Party', date: 'June 15, 2024', status: 'Confirmed' },
  { id: '2', title: 'Wedding Reception', date: 'July 20, 2024', status: 'Pending' },
];

const UserDashboardScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userEmail } = route.params || {};
  const [userName, setUserName] = useState('');

  const scaleAnimRefs = useRef(quickActions.map(() => new Animated.Value(1)));
  const eventAnimRefs = useRef(
    events.map(() => ({
      fade: new Animated.Value(0),
      translateY: new Animated.Value(30),
    }))
  );

  useEffect(() => {
    if (userEmail) {
      const safeEmail = userEmail.trim().toLowerCase();
      fetch(
        `http://localhost:1337/api/customers?filters[Email][$eq]=${safeEmail}&publicationState=live`
      )
        .then(res => res.json())
        .then(data => {
          if (data.data && data.data.length > 0) {
            setUserName(data.data[0].Name);
          } else {
            console.log('No customer found with email:', safeEmail);
          }
        })
        .catch(err => console.log('Fetch error:', err));
    }

    eventAnimRefs.current.forEach((anim, index) => {
      Animated.parallel([
        Animated.timing(anim.fade, {
          toValue: 1,
          duration: 500 + index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: 500 + index * 100,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [userEmail]);

  const handlePressAction = (index, action) => {
    Animated.sequence([
      Animated.timing(scaleAnimRefs.current[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimRefs.current[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (action.action === 'newEvent') navigation.navigate('EventInfoScreen');
      else if (action.action === 'viewEvents') alert('View Events clicked');
      else if (action.action === 'settings') alert('Settings clicked');
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
        <TouchableOpacity
          onPress={() => handlePressAction(index, action)}
          activeOpacity={0.8}
        >
          <Text
            style={
              action.type === 'primary'
                ? styles.primaryActionText
                : styles.secondaryActionText
            }
          >
            {action.label}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEvent = ({ item, index }) => {
    const anim = eventAnimRefs.current[index];
    return (
      <Animated.View
        style={[
          styles.eventCard,
          { opacity: anim.fade, transform: [{ translateY: anim.translateY }] },
        ]}
      >
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>{item.date}</Text>
        <View
          style={[
            styles.statusBadge,
            item.status === 'Confirmed'
              ? styles.statusConfirmed
              : styles.statusPending,
          ]}
        >
          <Text
            style={
              item.status === 'Confirmed'
                ? styles.statusTextConfirmed
                : styles.statusTextPending
            }
          >
            {item.status}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const stats = {
    total: events.length,
    confirmed: events.filter(e => e.status === 'Confirmed').length,
    pending: events.filter(e => e.status === 'Pending').length,
  };

  return (
    <LinearGradient
      colors={['#4A90E2', '#2C3E50']}// same as SummaryScreen gradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.headerCard}>
              <Text style={styles.headerTitle}>
                Welcome{userName ? `, ${userName}` : ''}
              </Text>
            </View>

            <View style={styles.quickActionsRow}>
              {quickActions.map((action, index) =>
                renderQuickAction(action, index)
              )}
            </View>

            <Text style={styles.sectionTitle}>Recent Events</Text>
          </>
        }
        ListFooterComponent={
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitleDark}>Statistics</Text>
            <Text style={styles.statText}>Total Events: {stats.total}</Text>
            <Text style={[styles.statText, styles.confirmedText]}>
              Confirmed: {stats.confirmed}
            </Text>
            <Text style={[styles.statText, styles.pendingText]}>
              Pending: {stats.pending}
            </Text>
          </View>
        }
        contentContainerStyle={styles.contentContainer}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  contentContainer: { padding: 16, paddingBottom: 50 },
  headerCard: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#EAF2FA', // updated soft light card background
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionTile: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#EAF2FA', // updated soft light card background
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryActionTile: {
    backgroundColor: '#1565C0', // strong blue for primary
  },
  primaryActionText: { color: '#FFFFFF', fontWeight: '600' },
  secondaryActionText: { color: '#1F2937', fontWeight: '500' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  sectionTitleDark: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  eventCard: {
    backgroundColor: '#EAF2FA', // updated soft light card background
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  eventTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  eventDate: { fontSize: 13, color: '#1F2937', marginTop: 2 },
  statusBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  statusConfirmed: { backgroundColor: '#D1FAE5' },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusTextConfirmed: { fontSize: 12, fontWeight: '500', color: '#065F46' },
  statusTextPending: { fontSize: 12, fontWeight: '500', color: '#92400E' },
  statsContainer: {
    backgroundColor: '#EAF2FA', // updated soft light card background
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 16,
  },
  statText: { fontSize: 14, color: '#111827', marginBottom: 8 },
  confirmedText: { color: '#047857' },
  pendingText: { color: '#B45309' },
});

export default UserDashboardScreen;
