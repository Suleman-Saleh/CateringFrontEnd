// screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import bcrypt from 'bcryptjs'; // Make sure this is 'bcryptjs' (no hyphen)

const STRAPI_URL = 'http://localhost:1337';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    console.log('--- handleRegister called ---');
    console.log('Name:', name, 'Phone:', phone, 'Email:', email, 'Password:', password);

    // Basic validation
    if (!name || !phone || !email || !password) {
      console.log('Validation failed: Missing fields.');
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      console.log('Validation failed: Password too short.');
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true); // Start loading indicator
    console.log('Loading state set to true.');

    try {
      console.log('Attempting to hash password...');
      // Hash the password using bcrypt
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      console.log('Password hashed successfully.'); // DO NOT log hashedPassword in production!

      // 1. Find the 'customer' RoleID from Strapi
      console.log('Fetching customer role...');
      const roleResponse = await fetch(`${STRAPI_URL}/api/user-roles?filters[RoleName][$eq]=customer`);
      console.log('Role response received. Status:', roleResponse.status);
      if (!roleResponse.ok) {
        const errorText = await roleResponse.text(); // Get raw text for more info
        console.error('Role fetch failed:', roleResponse.status, errorText);
        throw new new Error(`Failed to fetch user role from Strapi: ${roleResponse.status} - ${errorText}`);
      }
      const roleData = await roleResponse.json();
      const customerRole = roleData.data[0];

      if (!customerRole) {
        console.log('Customer role not found in Strapi.');
        Alert.alert('Error', 'Customer role not found in Strapi. Please ensure a "customer" entry exists in your UserRole collection.');
        setLoading(false);
        return;
      }

      const customerRoleId = customerRole.id;
      console.log('Customer Role ID found:', customerRoleId);

      // 2. Create Customer entry in Strapi
      console.log('Creating customer entry...');
      const customerResponse = await fetch(`${STRAPI_URL}/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            Name: name,
            PhoneNumber: phone,
            Email: email,
          },
        }),
      });
      console.log('Customer response received. Status:', customerResponse.status);

      if (!customerResponse.ok) {
        const errorData = await customerResponse.json();
        console.error("Customer creation error:", errorData);
        if (errorData.error?.message?.includes('duplicate key error') && errorData.error?.message?.includes('email')) {
            throw new Error('An account with this email already exists.');
        }
        throw new Error(errorData.error?.message || 'Failed to create customer record.');
      }
      // const newCustomer = await customerResponse.json();

      // 3. Create Credential entry with the HASHED password
      console.log('Creating credential entry...');
      const credentialResponse = await fetch(`${STRAPI_URL}/api/credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            Email: email,
            Password: hashedPassword,
            RoleID: customerRoleId,
          },
        }),
      });
      console.log('Credential response received. Status:', credentialResponse.status);

      if (!credentialResponse.ok) {
        const errorData = await credentialResponse.json();
        console.error("Credential creation error:", errorData);
        if (errorData.error?.message?.includes('duplicate key error') && errorData.error?.message?.includes('email')) {
            throw new Error('An account with this email already exists in credentials.');
        }
        throw new Error(errorData.error?.message || 'Failed to create credentials.');
      }

      console.log('Registration successful!');
      Alert.alert('Success', 'Registration successful! Please login.');
      navigation.navigate('Login');

    } catch (error) {
      console.error('--- Caught Registration Error ---', error);
      Alert.alert('Registration Failed', error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false); // Stop loading indicator
      console.log('Loading state set to false (finally block).');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} editable={!loading} />
      <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" editable={!loading} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!loading} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry editable={!loading} />
      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading} activeOpacity={0.8}>
        {loading ? (<ActivityIndicator color="#fff" />) : (<Text style={styles.buttonText}>Register</Text>)}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, marginBottom: 15, borderRadius: 8, backgroundColor: '#fff', fontSize: 16, color: '#333' },
  button: { backgroundColor: '#6A1B9A', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  buttonDisabled: { backgroundColor: '#b39ddb' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 20, textAlign: 'center', color: '#6A1B9A', textDecorationLine: 'underline', fontSize: 16 },
});