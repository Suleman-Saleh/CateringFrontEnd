// screens/LoginScreen.js
import { Ionicons } from '@expo/vector-icons';
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
  TouchableOpacity,
  View,
} from 'react-native';

const STRAPI_URL = 'http://localhost:1337'; // <-- replace with your machine IP
const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  // Animation refs
  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(300, [
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${STRAPI_URL}/api/credentials?filters[Email][$eq]=${email}&populate=RoleID`
      );

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.data && data.data.length > 0) {
        const userCredential = data.data[0];
        const storedHashedPassword = userCredential.Password;
        const roleName = userCredential.RoleID?.RoleName;

        // Compare passwords
        const passwordMatch = bcrypt.compareSync(password, storedHashedPassword);

        if (passwordMatch) {
          if (roleName) {
            const lowerCaseRole = roleName.toLowerCase();
            if (lowerCaseRole === 'customer') {
              navigation.navigate('UserDashboardScreen', { userEmail: email });
            } else if (lowerCaseRole === 'admin') {
              navigation.navigate('AdminDashboardScreen');
            } else {
              Alert.alert('Login Failed', 'Unknown role. Please contact support.');
            }
          } else {
            Alert.alert('Login Failed', 'User role not found.');
          }
        } else {
          Alert.alert('Login Failed', 'Invalid email or password.');
        }
      } else {
        Alert.alert('Login Failed', 'Invalid email or password.');
      }
    } catch (err) {
      Alert.alert('Login Failed', err.message || 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4A90E2', '#2C3E50']}
        style={styles.gradientContainer}
      >
        <Animated.View
          style={{
            opacity: logoAnim,
            transform: [
              {
                translateY: logoAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
            alignItems: 'center',
          }}
        >
          <Image source={require('../assets/delivery.png')} style={styles.logo} />
          <Text style={styles.title}>EVENTURES</Text>
          <Text style={styles.subtitle}>Mastering the Art of Celebration</Text>
        </Animated.View>
      </LinearGradient>

      <Animated.View
        style={[
          styles.formCard,
          {
            opacity: formAnim,
            transform: [
              {
                translateY: formAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ width: '100%' }}
        >
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#4A90E2" style={{ marginRight: 12 }} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#4A90E2"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#4A90E2" style={{ marginRight: 12 }} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#4A90E2"
              style={styles.input}
              secureTextEntry={secure}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setSecure(!secure)} disabled={loading}>
              <Ionicons name={secure ? 'eye-off' : 'eye'} size={20} color="#4A90E2" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonPressed]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Sign In</Text>}
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Don&apos;t have an account?{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
              Sign Up
            </Text>
          </Text>
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  gradientContainer: {
    height: height * 0.55,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: { width: width * 0.3, height: height * 0.15, resizeMode: 'contain', marginBottom: 10 },
  title: { fontSize: 36, fontWeight: '900', color: 'white', letterSpacing: 6, textAlign: 'center' },
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 18,
    backgroundColor: 'rgba(74,144,226,0.05)',
  },
  input: { flex: 1, fontSize: 16, color: '#2C3E50' },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonPressed: { transform: [{ scale: 0.95 }], shadowOpacity: 0.6 },
  buttonText: { color: 'white', fontWeight: '900', fontSize: 21, letterSpacing: 1.5 },
  footerText: { textAlign: 'center', marginTop: 20, color: '#2C3E50' },
  link: { fontWeight: '900', textDecorationLine: 'underline', color: '#4A90E2' },
});

export default LoginScreen;
