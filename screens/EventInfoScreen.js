import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import moment from 'moment';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import MapView, { Marker } from 'react-native-maps';
import StepIndicator from 'react-native-step-indicator';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useBooking } from './BookingContextScreen';

const eventTypes = [
  { label: '🎂 Birthday', value: '🎂 Birthday' },
  { label: '💍 Wedding', value: '💍 Wedding' },
  { label: '🏢 Corporate', value: '🏢 Corporate' },
  { label: '🎉 Other', value: '🎉 Other' },
];

const locationTypes = [
  { label: 'Home', value: 'Home' },
  { label: 'Hall', value: 'Hall' },
  { label: 'Office', value: 'Office' },
  { label: 'Outdoor', value: 'Outdoor' },
  { label: 'Other', value: 'Other' },
];

const EventInfoScreen = () => {
  const navigation = useNavigation();
  const { updateBooking } = useBooking();

  const [eventType, setEventType] = useState('');
  const [customEventName, setCustomEventName] = useState('');
  const [date, setDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  const [locationType, setLocationType] = useState(null);
  const [customLocationName, setCustomLocationName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [locationItems, setLocationItems] = useState(locationTypes);

  const labels = ['Event Info', 'Services','Summary', 'Payment'];
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

  const renderStepIndicator = ({ position, stepStatus }) => (
    <Icon
      name={icons[position]}
      color={stepStatus === 'finished' ? '#FFFFFF' : '#6A1B9A'}
      size={15}
    />
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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required to use the map.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const handleMapPress = async (event) => {
    const coords = event.nativeEvent.coordinate;
    setSelectedLocation(coords);

    try {
      const geocode = await Location.reverseGeocodeAsync(coords);
      if (geocode.length > 0) {
        const address = geocode[0];
        const formatted = `${address.name || ''} ${address.street || ''}, ${address.city || ''}, ${address.region || ''}, ${address.country || ''}`;
        setSelectedAddress(formatted.trim());
      } else {
        setSelectedAddress('Address not found');
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      setSelectedAddress('Unable to fetch address');
    }
  };

  const handleNext = () => {
  if (!eventType || !selectedLocation || !locationType) {
    Alert.alert('Missing Fields', 'Please complete all fields and select a location.');
    return;
  }

  const finalEventType = eventType === '🎉 Other' ? customEventName : eventType;
  const finalLocationName = locationType === 'Other' ? customLocationName : locationType;

  updateBooking({
    eventType: finalEventType,
    eventDateTime: date.toISOString(),
    eventLocation: selectedLocation,
    locationName: finalLocationName,
  });

  navigation.navigate('OptionsScreen');
};


  const renderContent = () => (
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
        {eventTypes.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[styles.tile, eventType === item.value && styles.selectedTile]}
            onPress={() => setEventType(item.value)}
          >
            <Text style={[styles.tileText, eventType === item.value && styles.selectedTileText]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {eventType === '🎉 Other' && (
        <TextInput
          style={styles.input}
          placeholder="Enter event name"
          value={customEventName}
          onChangeText={setCustomEventName}
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
      <TouchableOpacity style={styles.dateButton} onPress={() => setOpenTime(true)}>
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
        value={locationType}
        items={locationItems.map((item, index) => ({ ...item, key: item.value || index }))}
        setOpen={setLocationDropdownOpen}
        setValue={(callback) => setLocationType(callback(locationType))}
        setItems={setLocationItems}
        placeholder="Select location type"
        containerStyle={{ marginBottom: locationType === 'Other' ? 0 : 20 }}
        style={{ marginBottom: locationType === 'Other' ? 0 : 20 }}
      />

      {locationType === 'Other' && (
        <TextInput
          style={styles.input}
          placeholder="Enter location name"
          value={customLocationName}
          onChangeText={setCustomLocationName}
        />
      )}

      <Text style={styles.label}>Event Location</Text>
      {mapRegion && (
        <MapView style={styles.map} region={mapRegion} onPress={handleMapPress}>
          {selectedLocation && <Marker coordinate={selectedLocation} />}
        </MapView>
      )}

      {selectedAddress !== '' && (
        <Text style={{ marginTop: 10, color: '#4A148C', fontSize: 14 }}>
          Selected Address: {selectedAddress}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Proceed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={renderContent}
        keyboardShouldPersistTaps="handled"
      />
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
    padding: 20,
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
  },
  map: {
    width: '100%',
    height: 250,
    marginTop: 10,
    borderRadius: 10,
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