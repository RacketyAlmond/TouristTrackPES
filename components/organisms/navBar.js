import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function NavBar() {
  const navigation = useNavigation(); // Hook para acceder al objeto de navegación

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Mapa')}
      >
        <Text style={styles.navText}>Mapa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Foro')}
      >
        <Text style={styles.navText}>Foro</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Xat')}
      >
        <Text style={styles.navText}>Xat</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('User')}
      >
        <Text style={styles.navText}>User</Text>
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
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    color: '#572364',
    fontWeight: 'bold',
  },
});
