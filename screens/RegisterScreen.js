// screens/RegisterScreen.js
import bcrypt from 'bcryptjs';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

const STRAPI_URL = 'http://localhost:1337';
const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRegister = async () => {
    if (!name || !phone || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

      // 1. Get 'customer' role
      const roleResponse = await fetch(`${STRAPI_URL}/api/user-roles?filters[RoleName][$eq]=customer`);
      if (!roleResponse.ok) throw new Error('Failed to fetch customer role.');
      const roleData = await roleResponse.json();
      const customerRole = roleData.data[0];
      if (!customerRole) throw new Error('Customer role not found.');
      const customerRoleId = customerRole.id;

      // 2. Create customer
      const customerResponse = await fetch(`${STRAPI_URL}/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { Name: name, PhoneNumber: phone, Email: email } }),
      });
      if (!customerResponse.ok) throw new Error('Failed to create customer.');

      // 3. Create credential
      const credentialResponse = await fetch(`${STRAPI_URL}/api/credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { Email: email, Password: hashedPassword, RoleID: customerRoleId } }),
      });
      if (!credentialResponse.ok) throw new Error('Failed to create credentials.');

      Alert.alert('Success', 'Registration successful! Please login.');
      navigation.navigate('Login');

    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient colors={['#7B1FA2', '#9C27B0']} style={styles.gradientHeader}>
        <Image source={require('../assets/delivery.png')} style={styles.logo} />
        <Text style={styles.title}>EVENTURES</Text>
        <Text style={styles.subtitle}>Create your account</Text>
      </LinearGradient>

      {/* Animated Form Card */}
      <Animated.View
        style={[
          styles.formCard,
          {
            opacity: cardAnim,
            transform: [{
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            }],
          },
        ]}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
            <Text style={styles.link}>Already have an account? Login</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  gradientHeader: {
    height: height * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: { width: width * 0.25, height: height * 0.12, resizeMode: 'contain', marginBottom: 10 },
  title: { fontSize: 32, fontWeight: '900', color: 'white', letterSpacing: 6, textAlign: 'center' },
  subtitle: { fontSize: 16, color: 'white', fontWeight: '600', textAlign: 'center', marginTop: 5 },

  formCard: {
    flex: 1,
    marginTop: -40,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#7B1FA2',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#7B1FA2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: { backgroundColor: '#b39ddb' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 20, textAlign: 'center', color: '#7B1FA2', textDecorationLine: 'underline', fontSize: 16 },
});
