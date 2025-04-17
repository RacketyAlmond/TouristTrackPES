import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function NavBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
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
        onPress={() => navigation.navigate('Foro')}
      >
        <Image
          source={require('../../public/foro.png')}
          style={styles.navImage}
          resizeMode='contain'
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Xat')}
      >
        <Image
          source={require('../../public/xat.png')}
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
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navImage: {
    width: 30,
    height: 30,
    tintColor: '#572364',
  },
});
