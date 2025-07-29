// screens/LoginScreen.js
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator
} from 'react-native';
import bcrypt from 'bcryptjs';

const STRAPI_URL = 'http://localhost:1337';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log('--- handleLogin called ---');
    console.log('Login attempt with Email:', email, 'Password:', password);

    if (!email || !password) {
      console.log('Validation failed: Missing email or password.');
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    console.log('Loading state set to true.');

    try {
      console.log(`Fetching credential for email: ${email}`);
      const credentialResponse = await fetch(`${STRAPI_URL}/api/credentials?filters[Email][$eq]=${email}&populate=RoleID`);
      console.log('Credential response received. Status:', credentialResponse.status);

      if (!credentialResponse.ok) {
        const errorText = await credentialResponse.text();
        console.error("Credential fetch failed (not OK response):", credentialResponse.status, errorText);
        throw new Error(`Authentication failed: ${credentialResponse.status} - ${errorText}`);
      }

      const credentialData = await credentialResponse.json();
      console.log('Credential data received:', JSON.stringify(credentialData, null, 2));


      if (credentialData.data && credentialData.data.length > 0) {
        console.log('Credential found for email.');
        const userCredential = credentialData.data[0];
        const storedHashedPassword = userCredential.Password;
        const roleName = userCredential.RoleID?.RoleName;

        console.log('Stored Hashed Password:', storedHashedPassword);
        console.log('User Role Name:', roleName);

        console.log('Attempting to compare passwords...');
        const passwordMatch = bcrypt.compareSync(password, storedHashedPassword);
        console.log('Password Match Result:', passwordMatch);

        if (passwordMatch) {
          console.log('Password matched!');
          if (roleName) {
            // Convert roleName to lowercase for consistent comparison
            const lowerCaseRoleName = roleName.toLowerCase(); 
            console.log(`Login successful for ${lowerCaseRoleName}.`);

            Alert.alert('Success', `Welcome, ${email}!`);
            
            // Check lowercase role names
            if (lowerCaseRoleName === 'customer') {
              navigation.navigate('UserDashboardScreen');
            } else if (lowerCaseRoleName === 'admin') {
              navigation.navigate('AdminDashboardScreen');
            } else {
              console.log('Unknown user role detected.');
              Alert.alert('Login Failed', 'Unknown user role. Please contact support.');
            }
          } else {
            console.log('User role not found for this account.');
            Alert.alert('Login Failed', 'User role not found for this account. Please contact support.');
          }
        } else {
          console.log('Invalid password entered.');
          Alert.alert('Login Failed', 'Invalid email or password.');
        }
      } else {
        console.log('No credential found for the provided email.');
        Alert.alert('Login Failed', 'Invalid email or password.');
      }

    } catch (error) {
      console.error('--- Caught Login Error ---', error);
      Alert.alert('Login Failed', error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
      console.log('Loading state set to false (finally block).');
    }
  };

  return (
    <LinearGradient colors={['#0F2027', '#203A43', '#2C5364']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inner}>
          <Text style={styles.appName}>EVENTURES</Text>
          <Image source={require('../assets/images/applogo.png')} style={styles.logo} />
          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.motto}>Mastering the Art of Celebration</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#aaa" style={styles.icon} />
            <TextInput placeholder="Email" placeholderTextColor="#aaa" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} editable={!loading} />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#aaa" style={styles.icon} />
            <TextInput placeholder="Password" placeholderTextColor="#aaa" style={styles.input} secureTextEntry={secure} value={password} onChangeText={setPassword} autoCapitalize="none" autoCorrect={false} editable={!loading} />
            <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.eyeButton} disabled={loading}>
              <Ionicons name={secure ? "eye-off" : "eye"} size={20} color="#aaa" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
            {loading ? (<ActivityIndicator color="#fff" />) : (<Text style={styles.buttonText}>Sign In</Text>)}
          </TouchableOpacity>
          <Text style={styles.footerText}>
            Don&apos;t have an account?{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('Register')} disabled={loading}>
              Sign up
            </Text>
          </Text>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 30 },
  appName: { fontSize: 36, color: '#00BFFF', fontWeight: '900', textAlign: 'center', marginBottom: 10, letterSpacing: 2 },
  logo: { width: 90, height: 90, alignSelf: 'center', marginBottom: 25 },
  heading: { fontSize: 28, color: '#fff', fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
  motto: { fontSize: 14, color: '#ccc', fontStyle: 'italic', textAlign: 'center', marginBottom: 30 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, marginBottom: 18 },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#fff' },
  eyeButton: { paddingLeft: 12 },
  button: { backgroundColor: '#00BFFF', paddingVertical: 16, borderRadius: 12, marginTop: 12, shadowColor: '#00BFFF', shadowOpacity: 0.5, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  buttonDisabled: { backgroundColor: '#66a3ff', shadowOpacity: 0.2, elevation: 2 },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  footerText: { color: '#ccc', marginTop: 24, textAlign: 'center', fontSize: 14 },
  link: { color: '#00BFFF', fontWeight: 'bold' },
});

export default LoginScreen;