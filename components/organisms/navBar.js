import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../firebaseConfig.js';

export default function NavBar() {
  const navigation = useNavigation();
  return (
    <View style={[styles.navbar, Platform.OS === 'web' && styles.navbarWeb]}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Mapa')}
      >
        <Image
          source={require('../../public/map.png')}
          style={styles.navImage}
          resizeMode='contain'
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => {
          auth.currentUser != null
            ? navigation.navigate('Foros')
            : navigation.navigate('User');
        }}
      >
        <Image
          source={require('../../public/forum.png')}
          style={styles.navImage}
          resizeMode='contain'
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => {
          auth.currentUser != null
            ? navigation.navigate('Chats')
            : navigation.navigate('User');
        }}
      >
        <Image
          source={require('../../public/chat.png')}
          style={styles.navImage}
          resizeMode='contain'
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('User')}
      >
        <Image
          source={require('../../public/user.png')}
          style={styles.navImage}
          resizeMode='contain'
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#f0f0f0',
  },
  navbarWeb: {
    flexDirection: 'row', // Horizontal en web
    height: 60,
    width: '100%',
    position: 'fixed',
    left: 0,
    bottom: 0, // Posicionado en la parte inferior
    justifyContent: 'space-around',
    padding: 5,
    boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)', // Sombra sutil arriba
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && {
      marginHorizontal: 10, // Espaciado horizontal en vez de vertical
      padding: 5,
    }),
  },
  navImage: { width: 30, height: 30, tintColor: '#572364' },
});
