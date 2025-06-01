import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useLayoutEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
//import MapView, { Marker } from 'react-native-maps';

const EventInfoScreen = () => {
  const navigation = useNavigation();

  const [eventType, setEventType] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [eventTypes] = useState([
    { label: 'Birthday', value: 'Birthday' },
    { label: 'Wedding', value: 'Wedding' },
    { label: 'Corporate', value: 'Corporate' },
    { label: 'Other', value: 'Other' },
  ]);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

 // const [selectedLocation, setSelectedLocation] = useState(null);
 // const [mapRegion, setMapRegion] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Logout"
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }}
          color="red"
        />
      ),
    });
  }, [navigation]);

 /* useEffect(() => {
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

  const handleMapPress = (event) => {
    setSelectedLocation(event.nativeEvent.coordinate);
  };*/

  const handleNext = () => {
    if (!eventType/* || !selectedLocation*/) {
      Alert.alert('Missing Fields', 'Please complete all fields and select a location.');
      return;
    }

    navigation.navigate('Decoration', {
      eventType,
      eventDateTime: date.toISOString(),
      //eventLocation: selectedLocation,
    });
  };

  const renderContent = () => (
    <View style={styles.content}>
      <Text style={styles.title}>Event Details</Text>

      <Text style={styles.label}>Event Type</Text>
      <View style={{ zIndex: 1000 }}>
        <DropDownPicker
          open={openDropdown}
          value={eventType}
          items={eventTypes}
          setOpen={setOpenDropdown}
          setValue={setEventType}
          setItems={() => {}}
          placeholder="Select an event type"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={1000}
        />
      </View>

      <Text style={styles.label}>Event Date</Text>
      <Button title={moment(date).format('YYYY-MM-DD')} onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Event Time</Text>
      <Button title={moment(date).format('HH:mm')} onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          is24Hour={true}
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              const newDate = new Date(date);
              newDate.setHours(selectedTime.getHours());
              newDate.setMinutes(selectedTime.getMinutes());
              setDate(newDate);
            }
          }}
        />
      )}

     <Text style={styles.label}>Select Event Location</Text>
     

      <View style={styles.buttonContainer}>
        <Button title="Next: Decoration" onPress={handleNext} />
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
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
    color: '#333',
  },
  dropdown: {
    backgroundColor: '#f9f9f9',
    borderColor: '#aaa',
    marginBottom: 10,
    zIndex: 1000,
  },
  dropdownContainer: {
    backgroundColor: '#f9f9f9',
    borderColor: '#aaa',
    zIndex: 1000,
  },
  map: {
    width: '100%',
    height: 250,
    marginTop: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: 30,
  },
});

 /*{mapRegion && (
        <MapView style={styles.map} region={mapRegion} onPress={handleMapPress}>
          {selectedLocation && <Marker coordinate={selectedLocation} />}
        </MapView>
      )}*/
