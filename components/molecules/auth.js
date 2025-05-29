import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { useAuth } from '../atoms/AuthContext.js';
import map from '../../public/mapa.png';
import * as Google from 'expo-auth-session/providers/google';
import { useTranslation } from 'react-i18next';

const AuthScreen = ({ onAuthenticated }) => {
  const { t, i18n } = useTranslation('auth');
  const { signUp, signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    try {
      setError('');
      if (isSignUp) {
        const user = await signUp(email, password);
        onAuthenticated(user, true);
      } else {
        const user = await signIn(email, password);
        onAuthenticated(user, false);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const [response, promptAsync] = Google.useAuthRequest({
    clientId:
      '***REMOVED***',
    scopes: ['profile', 'email'],
    redirectUri: '***REMOVED***',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;

      (async () => {
        try {
          const user = await signInWithGoogle(authentication.accessToken);
          onAuthenticated(user, true);
        } catch (error) {
          console.error('Google Sign-in failed', error);
        }
      })();
    }
  }, [response]);

  return (
    <ImageBackground source={map} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>{isSignUp ? t('signUp') : t('signIn')}</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          placeholder={t('email')}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder={t('password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>
            {isSignUp ? t('signUp') : t('signIn')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={styles.toggleText}>
            {isSignUp ? t('alreadyAccount') : t('newUser')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => promptAsync()}>
          <Text style={styles.toggleText}>{t('googleID')}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 250,
    paddingBottom: 300,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '80%',
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    width: '80%',
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  toggleText: {
    marginTop: 10,
    color: 'blue',
  },
});

export default AuthScreen;
