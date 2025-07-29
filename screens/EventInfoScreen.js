import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useLayoutEffect, useState, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import StepIndicator from 'react-native-step-indicator';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useBooking } from './BookingContextScreen';

// IMPORTANT: Replace with your Strapi server IP and port
const STRAPI_URL = 'http://localhost:1337';

const EventInfoScreen = () => {
  const navigation = useNavigation();
  const { updateBooking } = useBooking();

  // --- States for Event Details ---
  const [eventTypesFromApi, setEventTypesFromApi] = useState([]);
  const [selectedEventTypeId, setSelectedEventTypeId] = useState(null);
  const [customEventName, setCustomEventName] = useState('');
  const [date, setDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  // --- States for Location Details ---
  const [locationTypesFromApi, setLocationTypesFromApi] = useState([]);
  const [selectedLocationTypeId, setSelectedLocationTypeId] = useState(null);
  const [addressInput, setAddressInput] = useState('');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  // --- Loading State ---
  const [isLoading, setIsLoading] = useState(false);

  // --- Ref for TextInput (optional) ---
  const addressInputRef = useRef(null);

  // Step indicator labels and icons for the progress bar
  const labels = ['Event Info', 'Services', 'Summary', 'Payment'];
  const icons = ['calendar', 'paint-brush', 'list-alt', 'credit-card'];

  const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#6A1B9A',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#6A1B9A',
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
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#6A1B9A',
  };

  const renderStepIndicator = useCallback(
    ({ position, stepStatus }) => (
      <Icon
        name={icons[position]}
        color={stepStatus === 'finished' ? '#FFFFFF' : '#6A1B9A'}
        size={15}
      />
    ),
    []
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }}
          style={{ marginRight: 15 }}
        >
          <Text style={{ color: '#8E24AA', fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // --- Fetch Event Types ---
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await fetch(`${STRAPI_URL}/api/event-types`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedEventTypes = data.data.map(item => ({
          label: item.EventName,
          value: item.id,
        }));
        setEventTypesFromApi([...formattedEventTypes, { label: '🎉 Other', value: 'other_custom' }]);
      } catch (error) {
        console.error('Error fetching event types:', error.message);
        Alert.alert('Error', 'Failed to load event types. Please check your network and Strapi server.');
      }
    };
    fetchEventTypes();
  }, []);

  // --- Fetch Location Types ---
  useEffect(() => {
    const fetchLocationTypes = async () => {
      try {
        const response = await fetch(`${STRAPI_URL}/api/locations`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedLocationTypes = data.data.map(item => ({
          label: item.LocationType,
          value: item.id,
        }));
        setLocationTypesFromApi(formattedLocationTypes);
      } catch (error) {
        console.error('Error fetching location types:', error.message);
        Alert.alert('Error', 'Failed to load location types. Please check your network and Strapi server.');
      }
    };
    fetchLocationTypes();
  }, []);

  // --- Modified handleNext ---
  // Inside EventInfoScreen component
  const handleNext = useCallback(async () => {
    // --- Start Validation Debugging ---
    console.log('--- Starting handleNext Validation ---');
    console.log('selectedEventTypeId:', selectedEventTypeId);
    console.log('customEventName (if "Other"):', customEventName);
    console.log('date:', date);
    console.log('selectedLocationTypeId:', selectedLocationTypeId);
    console.log('addressInput:', addressInput);
    console.log('--- End handleNext Validation ---');

    if (
      !selectedEventTypeId ||
      !date ||
      !selectedLocationTypeId ||
      !addressInput ||
      (selectedEventTypeId === 'other_custom' && !customEventName)
    ) {
      Alert.alert('Missing Fields', 'Please complete all required fields.');
      // Add specific logs to help identify the exact missing field
      if (!selectedEventTypeId) console.log('Validation: Event Type is missing.');
      if (!date) console.log('Validation: Date is missing.'); // Should rarely be null as it defaults to new Date()
      if (!selectedLocationTypeId) console.log('Validation: Location Type is missing.');
      if (!addressInput) console.log('Validation: Address is missing.');
      if (selectedEventTypeId === 'other_custom' && !customEventName) console.log('Validation: Custom Event Name is missing.');

      return; // Stop execution here if validation fails
    }
    // --- End Validation Debugging ---

    setIsLoading(true);

    try {
      let finalEventId = selectedEventTypeId;
      let finalEventLabel = eventTypesFromApi.find(et => et.value === selectedEventTypeId)?.label || '';

      if (selectedEventTypeId === 'other_custom') {
        console.log('Attempting to create custom event type:', customEventName);
        const res = await fetch(`${STRAPI_URL}/api/event-types`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { EventName: customEventName } }),
        });
        if (!res.ok) {
          const errData = await res.json();
          console.error('Failed to create custom event type API error:', errData); // Log specific error
          throw new Error(errData.error?.message || 'Failed to create custom event type');
        }
        const newEvent = await res.json();
        finalEventId = newEvent.data.id;
        finalEventLabel = customEventName;
        console.log('Custom event type created:', newEvent);
      }

      // Create booking on backend
      const bookingData = {
        event_type: finalEventId,
        location: selectedLocationTypeId,
        BookingLocationAddress: addressInput,
        BookingDate: date.toISOString(),
      };

      console.log('Attempting to create booking with data:', bookingData); // Log data being sent
      const resBooking = await fetch(`${STRAPI_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: bookingData }),
      });

      if (!resBooking.ok) {
        const errData = await resBooking.json();
        console.error('Failed to create booking API error:', errData); // Log specific error
        throw new Error(errData.error?.message || 'Failed to create booking');
      }
      const bookingResult = await resBooking.json();
      console.log('Booking created successfully:', bookingResult); // Confirm success and see response

      const locationLabel =
        locationTypesFromApi.find(lt => lt.value === selectedLocationTypeId)?.label || '';

      updateBooking({
        eventType: finalEventLabel,
        eventDateTime: date.toISOString(),
        eventAddress: addressInput,
        locationName: locationLabel,
        bookingId: bookingResult.data.id,
      });

      console.log('Navigating to OptionsScreen...'); // Log before navigation
      navigation.navigate('OptionsScreen');

    } catch (error) {
      console.error('Caught an error during booking process:', error); // Catch all errors in try block
      Alert.alert('Error', `Failed to create booking. ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedEventTypeId,
    customEventName,
    date,
    selectedLocationTypeId,
    addressInput,
    eventTypesFromApi,
    locationTypesFromApi,
    updateBooking,
    navigation,
  ]);

  const renderContent = useCallback(() => (
    <View style={styles.content}>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={0}
        labels={labels}
        renderStepIndicator={renderStepIndicator}
      />

      <Text style={styles.title}>Event Details</Text>

      <Text style={styles.label}>Select Event Type</Text>
      <View style={styles.tileContainer}>
        {eventTypesFromApi.map(item => (
          <TouchableOpacity
            key={item.value}
            style={[styles.tile, selectedEventTypeId === item.value && styles.selectedTile]}
            onPress={() => setSelectedEventTypeId(item.value)}
            disabled={isLoading}
          >
            <Text style={[styles.tileText, selectedEventTypeId === item.value && styles.selectedTileText]}>
              {item.label}
            </Text>
          </TouchableOpacity>
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
      <TouchableOpacity style={styles.dateButton} onPress={() => setOpenDate(true)} disabled={isLoading}>
        <Text style={styles.dateButtonText}>{moment(date).format('YYYY-MM-DD')}</Text>
      </TouchableOpacity>
      {openDate && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setOpenDate(false);
            if (selectedDate) {
              const updatedDate = new Date(date);
              updatedDate.setFullYear(selectedDate.getFullYear());
              updatedDate.setMonth(selectedDate.getMonth());
              updatedDate.setDate(selectedDate.getDate());
              setDate(updatedDate);
            }
          }}
        />
      )}

      <Text style={styles.label}>Event Time</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setOpenTime(true)} disabled={isLoading}>
        <Text style={styles.dateButtonText}>{moment(date).format('HH:mm')}</Text>
      </TouchableOpacity>
      {openTime && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setOpenTime(false);
            if (selectedTime) {
              const updatedDate = new Date(date);
              updatedDate.setHours(selectedTime.getHours());
              updatedDate.setMinutes(selectedTime.getMinutes());
              setDate(updatedDate);
            }
          }}
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
        style={{ marginBottom: 0 }}
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
        onChangeText={text => setAddressInput(text)}
        multiline
        editable={!isLoading}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.nextButtonText}>Proceed</Text>}
        </TouchableOpacity>
      </View>
    </View>
  ), [
    selectedEventTypeId,
    customEventName,
    date,
    openDate,
    openTime,
    locationDropdownOpen,
    selectedLocationTypeId,
    addressInput,
    isLoading,
    eventTypesFromApi,
    locationTypesFromApi,
    handleNext,
    renderStepIndicator,
  ]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20 }}>
        {renderContent()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EventInfoScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    // padding provided by ScrollView
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333333',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
    color: '#333333',
  },
  tileContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tile: {
    backgroundColor: '#F0F0F0',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
  },
  selectedTile: {
    backgroundColor: '#6A1B9A',
    borderColor: '#6A1B9A',
  },
  tileText: {
    fontSize: 16,
    color: '#333333',
  },
  selectedTileText: {
    color: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    textAlignVertical: 'top', // Android multiline fix
  },
  dateButton: {
    backgroundColor: '#6A1B9A',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 30,
  },
  nextButton: {
    backgroundColor: '#4A148C',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
