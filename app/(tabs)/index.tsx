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
  View
} from 'react-native';

const SimpleLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please fill in both fields');
      return;
    }
    console.log('Logging in with:', email, password);
  };

  return (
    <LinearGradient
      colors={['#0F2027', '#203A43', '#2C5364']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.inner}
        >
          {/* App Name */}
          <Text style={styles.appName}>EVENTURES</Text>

          {/* Logo */}
          <Image source={require('../../assets/images/applogo.png')} style={styles.logo} />

          {/* Welcome Heading */}
          <Text style={styles.heading}>Welcome Back</Text>

          {/* Motto / Tagline */}
          <Text style={styles.motto}>Mastering the Art of Celebration</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#aaa" style={styles.icon} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#aaa" style={styles.icon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#aaa"
              style={styles.input}
              secureTextEntry={secure}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.eyeButton}>
              <Ionicons name={secure ? "eye-off" : "eye"} size={20} color="#aaa" />
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Footer Text */}
          <Text style={styles.footerText}>
            Don&apos;t have an account? <Text style={styles.link}>Sign up</Text>
          </Text>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  appName: {
    fontSize: 36,
    color: '#00BFFF',
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 2,
    fontFamily: 'HelveticaNeue-CondensedBold',
  },
  logo: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginBottom: 25,
  },
  heading: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  motto: {
    fontSize: 14,
    color: '#ccc',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 18,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  eyeButton: {
    paddingLeft: 12,
  },
  button: {
    backgroundColor: '#00BFFF',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#00BFFF',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerText: {
    color: '#ccc',
    marginTop: 24,
    textAlign: 'center',
    fontSize: 14,
  },
  link: { 
    color: '#00BFFF', 
    fontWeight: 'bold', 
  },
});

export default SimpleLogin;
