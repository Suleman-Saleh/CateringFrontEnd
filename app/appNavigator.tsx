import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen';
import { BookingProvider } from '../screens/BookingContextScreen';
import DecorationScreen from '../screens/DecorationScreen';
import EventInfoScreen from '../screens/EventInfoScreen';
import FurnitureScreen from '../screens/FurnitureScreen';
import ItemCartScreen from '../screens/ItemCartScreen';
import LoginScreen from '../screens/LoginScreen';
import OptionsScreen from '../screens/OptionsScreen';
import PaymentScreen from '../screens/PaymentScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SummaryScreen from '../screens/SummaryScreen';
import UserDashboardScreen from '../screens/UserDashboardScreen';
import UtensilScreen from '../screens/UtensilScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
   <BookingProvider>
    <Stack.Navigator initialRouteName="AdminDashboardScreen" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="UserDashboardScreen" component={UserDashboardScreen} />
       <Stack.Screen name="OptionsScreen" component={OptionsScreen} />
      <Stack.Screen name="DecorationScreen"  component={DecorationScreen}  options={{ headerShown: false }}/>
      <Stack.Screen name="ItemCartScreen" component={ItemCartScreen} />

      <Stack.Screen name="UtensilScreen" component={UtensilScreen} />
      <Stack.Screen name="FurnitureScreen" component={FurnitureScreen} />
      {<Stack.Screen name="EventInfoScreen" component={EventInfoScreen} /> }
      {<Stack.Screen name="AdminDasboardScreen" component={AdminDashboardScreen} />}
      <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="BookingConfirmationScreen" component={BookingConfirmationScreen} />
      {<Stack.Screen name="AdminDashboardScreen" component={AdminDashboardScreen} /> }
    </Stack.Navigator>
     </BookingProvider>
);

export default AppNavigator;
