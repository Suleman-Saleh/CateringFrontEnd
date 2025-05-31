import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import EventInfoScreen from '../screens/EventInfoScreen';
import DecorationScreen from '../screens/DecorationScreen';
import DetailOptionScreen from '../screens/DetailOptionScreen';
import SummaryScreen from '../screens/SummaryScreen';
import PaymentScreen from '../screens/PaymentScreen';
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen';
// import AdminDashboardScreen from './screens/AdminDashboardScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
    <Stack.Navigator initialRouteName="EventInfo" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="EventInfo" component={EventInfoScreen} />
      <Stack.Screen name="Decoration" component={DecorationScreen} />
      <Stack.Screen name="DetailOptions" component={DetailOptionScreen} />
      <Stack.Screen name="Summary" component={SummaryScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
      {/* <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} /> */}
    </Stack.Navigator>
);

export default AppNavigator;
