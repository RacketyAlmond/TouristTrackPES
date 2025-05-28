/* eslint-disable prettier/prettier */
// BirthdateScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import { useUser } from '../atoms/UserContext.js';
import { auth } from '../../firebaseConfig.js';
import map from '../../public/mapa.png';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const BirthdateScreen = ({ onComplete }) => {
  const { createUserData } = useUser();
  const [fname, setFname] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [token, setToken] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const points = useRef(10);
  const profileImage = useRef('');
  let authStatus = false;

  useEffect(() => {
    async function getToken() {
      try {
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        });
        setToken(tokenData.data);
        console.log('Push token:', tokenData.data);
      } catch (error) {
        console.error('Error getting push token:', error);
        setToken('Error getting token: ' + error.message);
      }
    }

    getToken();
  }, []);

  const saveTokenToBackend = async (userId) => {
    try {
      const userIdToUse = userId;

      const saveTokenUrl = `***REMOVED***/users/${userIdToUse}/push-token`;
      const response = await fetch(saveTokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pushToken: token,
        }),
      });

      if (response.ok) {
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to save token: ${errorText}`);
      }
    } catch (error) {
      console.error('Error saving token:', error);
      Alert.alert('Error', `Could not save token: ${error.message}`);
    }
  };

  const handleSend = async () => {
    try {
      const about = "Hi! I'm using TouristTrack";
      const profileImageUrl = typeof profileImage === 'object' && profileImage?.uri
          ? profileImage.uri
          : profileImage;
      await createUserData(
          fname,
          birthdate.toDateString(),
          userLocation,
          about,
          points,
          profileImageUrl,
      );
      authStatus = true;

      onComplete(authStatus);
      const currentUser = auth.currentUser;

      saveTokenToBackend(currentUser.uid);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <ImageBackground source={map} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.overlay2} />
      <View style={styles.overlay3} />
      <View style={styles.overlay4} />

      <View style={styles.container}>
        <Text style={styles.title}>Tell us more about yourself</Text>
        <View style={styles.inputContainer}>
          {open && (
            <DateTimePicker
              value={birthdate}
              mode='date'
              display='default'
              onChange={(event, selectedDate) => {
                setOpen(false);
                if (selectedDate) setBirthdate(selectedDate);
              }}
            />
          )}

          <Text style={styles.text}>First name</Text>

          <TextInput
            placeholder='First name'
            value={fname}
            onChangeText={setFname}
            style={styles.input}
          />
          <Text style={styles.text}>Date of birth</Text>

          <TouchableOpacity onPress={() => setOpen(true)} style={styles.input}>
            <Text>{birthdate.toDateString()}</Text>
          </TouchableOpacity>

          <Text style={styles.text}>Where are you from</Text>

          <TextInput
            placeholder='Location'
            value={userLocation}
            onChangeText={setUserLocation}
            style={styles.input}
          />
          {fname.length > 2 && userLocation.length > 2 ? (
            <TouchableOpacity style={styles.button} onPress={handleSend}>
              <Text style={styles.buttonText}>Save Data</Text>
            </TouchableOpacity>
          ) : (
            ''
          )}
        </View>
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
    bottom: '20%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  overlay2: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  overlay3: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  overlay4: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: 'rgba(230, 230, 230, 0.5)',
    borderRadius: 20,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop:250,
    paddingBottom: 300,

  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  text: { width: '80%' },

  input: {
    width: '80%',
    padding: 10,
    margin: 15,
    marginTop: 9,
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#a020f0',
    padding: 10,
    width: '80%',
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16 },
});

export default BirthdateScreen;
