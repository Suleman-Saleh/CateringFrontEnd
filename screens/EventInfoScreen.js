import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import StepIndicator from 'react-native-step-indicator';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useBooking } from './BookingContextScreen';

const STRAPI_URL = 'http://localhost:1337';
const { height } = Dimensions.get('window');

// --- Animated Tile Component ---
const EventTile = ({ item, isSelected, onPress, isLoading }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    onPress(item.value);
  };

  return (
    <Animated.View
      style={[styles.tile, isSelected && styles.selectedTile, animatedStyle]}
    >
      <TouchableOpacity onPress={handlePress} disabled={isLoading}>
        <Text style={[styles.tileText, isSelected && styles.selectedTileText]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const EventInfoScreen = ({ navigation, route }) => {
  const { customerId } = route.params || {};
  const { updateBooking, booking } = useBooking();

  // --- States ---
  const [eventTypesFromApi, setEventTypesFromApi] = useState([]);
  const [selectedEventTypeId, setSelectedEventTypeId] = useState(null);
  const [customEventName, setCustomEventName] = useState('');
  const [date, setDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [locationTypesFromApi, setLocationTypesFromApi] = useState([]);
  const [selectedLocationTypeId, setSelectedLocationTypeId] = useState(null);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addressInputRef = useRef(null);

  // --- StepIndicator config ---
  const labels = ['Event Info', 'Services', 'Summary', 'Payment'];
  const icons = ['calendar', 'paint-brush', 'list-alt', 'credit-card'];
  const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 5,
    stepStrokeCurrentColor: '#8852a9ff',
    stepStrokeWidth: 5,
    stepStrokeFinishedColor: '#8852a9ff',
    stepStrokeUnFinishedColor: '#D1C4E9',
    separatorFinishedColor: '#6A1B9A',
    separatorUnFinishedColor: '#D1C4E9',
    stepIndicatorFinishedColor: '#6A1B9A',
    stepIndicatorUnFinishedColor: '#FFFFFF',
    stepIndicatorCurrentColor: '#FFFFFF',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#6A1B9A',
    stepIndicatorLabelFinishedColor: '#FFFFFF',
    stepIndicatorLabelUnFinishedColor: '#D1C4E9',
    labelColor: 'grey',
    labelSize: 14,
    currentStepLabelColor: 'white',
  };

  const renderStepIndicator = useCallback(({ position, stepStatus }) => (
    <Icon
      name={icons[position]}
      color={stepStatus === 'finished' ? '#FFFFFF' : '#4A90E2'}
      size={15}
    />
  ), [icons]);

  // --- Header Logout ---
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
          style={{ marginRight: 15 }}
        >
          <Text style={{ color: '#8E24AA', fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // --- Fetch Event Types ---
  useEffect(() => {
    fetch(`${STRAPI_URL}/api/event-types`)
      .then(res => res.json())
      .then(data => {
        const formattedEventTypes = data.data.map(item => ({ label: item.EventName, value: item.id }));
        setEventTypesFromApi([...formattedEventTypes, { label: '🎉 Other', value: 'other_custom' }]);
      })
      .catch(err => console.log('Event Types fetch error:', err));
  }, []);

  // --- Fetch Location Types ---
  useEffect(() => {
    fetch(`${STRAPI_URL}/api/locations`)
      .then(res => res.json())
      .then(data => {
        const formattedLocationTypes = data.data.map(item => ({ label: item.LocationType, value: item.id }));
        setLocationTypesFromApi(formattedLocationTypes);
      })
      .catch(err => console.log('Location Types fetch error:', err));
  }, []);

  // --- Handle Next ---
  const handleNext = useCallback(async () => {
    // Trim the address input to handle empty spaces
    const trimmedAddress = addressInput.trim();

    if (!selectedEventTypeId || !date || !selectedLocationTypeId || !trimmedAddress || !guestCount ||
      (selectedEventTypeId === 'other_custom' && !customEventName)) {
      Alert.alert('Missing Information', 'Please complete all fields.');
      return;
    }

    setIsLoading(true);
    try {
      let finalEventId = selectedEventTypeId;
      let finalEventLabel = eventTypesFromApi.find(et => et.value === selectedEventTypeId)?.label || '';

      if (selectedEventTypeId === 'other_custom') {
        const res = await fetch(`${STRAPI_URL}/api/event-types`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { EventName: customEventName } }),
        });
        const newEvent = await res.json();
        finalEventId = newEvent.data.id;
        finalEventLabel = customEventName;
      }

      const resBooking = await fetch(`${STRAPI_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            event_type: finalEventId,
            location: selectedLocationTypeId,
            BookingLocationAddress: trimmedAddress, // Use the trimmed address
            BookingDate: date.toISOString(),
            GuestCount: Number(guestCount),
          }
        }),
      });
      const bookingResult = await resBooking.json();

      const locationLabel = locationTypesFromApi.find(lt => lt.value === selectedLocationTypeId)?.label || '';

      // ✅ FIXED: Update the booking context with the correct property names.
      updateBooking({
        eventType: finalEventLabel,
        eventTypeId: finalEventId,
        eventDateTime: date.toISOString(),
        eventLocation: trimmedAddress, // Store the trimmed address
        locationName: locationLabel,
        locationId: selectedLocationTypeId,
        guestCount: Number(guestCount),
        bookingId: bookingResult.data.id,
        // Also save the customerId here for consistency
        customerId: customerId,
      });

      console.log("Updated Booking Object after EventInfoScreen:", booking);

      // ✅ FIX: Pass customerId correctly from the route params to the next screen
      navigation.navigate('OptionsScreen', { customerId });
    } catch (err) {
      console.log(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedEventTypeId, customEventName, date, selectedLocationTypeId, addressInput, guestCount, eventTypesFromApi, locationTypesFromApi, updateBooking, navigation, customerId]);

  return (
    <View style={styles.container}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <LinearGradient colors={['#white', '#7B1FA2']} style={styles.gradientHeader}>
          <StepIndicator
            customStyles={customStyles}
            currentPosition={0}
            labels={labels}
            stepCount={labels.length}
            renderStepIndicator={renderStepIndicator}
          />
        </LinearGradient>

          <View style={styles.contentCard}>
            <Text style={styles.title}>Event Details</Text>

            <Text style={styles.label}>Select Event Type</Text>
            <View style={styles.tileContainer}>
              {eventTypesFromApi.map(item => (
                <EventTile
                  key={item.value}
                  item={item}
                  isSelected={selectedEventTypeId === item.value}
                  onPress={setSelectedEventTypeId}
                  isLoading={isLoading}
                />
              ))}
            </View>

            {selectedEventTypeId === 'other_custom' && (
              <TextInput
                style={styles.input}
                placeholder="Enter custom event name"
                value={customEventName}
                onChangeText={setCustomEventName}
                editable={!isLoading}
              />
            )}

            <Text style={styles.label}>Event Date</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setOpenDate(true)}>
              <Text style={styles.dateButtonText}>{moment(date).format('YYYY-MM-DD')}</Text>
            </TouchableOpacity>
            {openDate && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => { setOpenDate(false); selectedDate && setDate(selectedDate); }}
              />
            )}

            <Text style={styles.label}>Event Time</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setOpenTime(true)}>
              <Text style={styles.dateButtonText}>{moment(date).format('HH:mm')}</Text>
            </TouchableOpacity>
            {openTime && (
              <DateTimePicker
                value={date}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => { setOpenTime(false); selectedTime && setDate(selectedTime); }}
              />
            )}

            <Text style={styles.label}>Select Location Type</Text>
            <DropDownPicker
              open={locationDropdownOpen}
              value={selectedLocationTypeId}
              items={locationTypesFromApi}
              setOpen={setLocationDropdownOpen}
              setValue={setSelectedLocationTypeId}
              placeholder="Select location type"
              containerStyle={{ marginBottom: 20 }}
              zIndex={3000}
              zIndexInverse={1000}
              disabled={isLoading}
            />

            <Text style={styles.label}>Event Address</Text>
            <TextInput
              ref={addressInputRef}
              style={[styles.input, { height: 80 }]}
              placeholder="Enter event address"
              value={addressInput}
              onChangeText={setAddressInput}
              multiline
              editable={!isLoading}
            />

            <Text style={styles.label}>Number of Guests</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter number of guests"
              keyboardType="numeric"
              value={guestCount}
              onChangeText={setGuestCount}
              editable={!isLoading}
            />

          <TouchableOpacity style={styles.nextButton} onPress={handleNext} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.nextButtonText}>Proceed</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </View>
  );
};

export default EventInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
   
  },
  gradientHeader: {
    height: height * 0.2,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#2C3E50',
  },
  contentCard: {
    flex: 1,
    marginTop: -30,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2C3E50',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
    color: '#4A90E2',
  },
  tileContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tile: {
    backgroundColor: 'rgba(74,144,226,0.08)',
    borderColor: '#4A90E2',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
  },
  selectedTile: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  tileText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  selectedTileText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'rgba(74,144,226,0.08)',
    color: '#2C3E50',
  },
  dateButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  dateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#2C3E50',
    paddingVertical: 14,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1,
  },
});

