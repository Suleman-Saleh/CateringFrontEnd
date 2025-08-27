import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminOptionScreen from '../screens/AdminOptionScreen';
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen';
import { BookingProvider } from '../screens/BookingContextScreen';
import DecorationScreen from '../screens/DecorationScreen';
import EventInfoScreen from '../screens/EventInfoScreen';
import FurnitureAdminScreen from '../screens/FurnitureAdminScreen';
import FurnitureScreen from '../screens/FurnitureScreen';
import ItemCartScreen from '../screens/ItemCartScreen';
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import ManageEventsScreen from '../screens/ManageEventsScreen';
import OptionsScreen from '../screens/OptionsScreen';
import PaymentScreen from '../screens/PaymentScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SummaryScreen from '../screens/SummaryScreen';
import UserDashboardScreen from '../screens/UserDashboardScreen';
import UtensilScreen from '../screens/UtensilScreen';
const Stack = createNativeStackNavigator();

const AppNavigator = () => (
   <BookingProvider>
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="UserDashboardScreen" component={UserDashboardScreen} />
       <Stack.Screen name="OptionsScreen" component={OptionsScreen} />
      <Stack.Screen name="DecorationScreen"  component={DecorationScreen}  options={{ headerShown: false }}/>
      <Stack.Screen name="ItemCartScreen" component={ItemCartScreen} />
      <Stack.Screen name="UtensilScreen" component={UtensilScreen} />
      <Stack.Screen name="FurnitureScreen" component={FurnitureScreen} />
      {<Stack.Screen name="EventInfoScreen" component={EventInfoScreen} /> }
      {<Stack.Screen name="Admin" component={AdminDashboardScreen} />}
      <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="BookingConfirmationScreen" component={BookingConfirmationScreen} />
      {<Stack.Screen name="AdminDashboardScreen" component={AdminDashboardScreen} /> }
      <Stack.Screen name="ManageEventsScreen" component={ManageEventsScreen} />
      <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AdminOptionScreen" component={AdminOptionScreen} />
      <Stack.Screen name="FurnitureAdminScreen" component={FurnitureAdminScreen} />
      <Stack.Screen name="DecorationAdminScreen" component={DecorationScreen} />
      <Stack.Screen name="UtensilAdminScreen" component={UtensilScreen} />
      
    </Stack.Navigator>
     </BookingProvider>
);

export default AppNavigator;
