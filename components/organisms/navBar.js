import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function NavBar() {
  const navigation = useNavigation(); // Hook para acceder al objeto de navegación

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Mapa')}
      >
        <Image
          source={require('../../public/map.png')}
          style={styles.navImage} // Aplica estilos para contener la imagen
          resizeMode='contain' // Asegura que la imagen se ajuste al contenedor
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Foro')}
      >
        <Image
          source={require('../../public/foro.png')}
          style={styles.navImage} // Aplica estilos para contener la imagen
          resizeMode='contain' // Asegura que la imagen se ajuste al contenedor
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Xat')}
      >
        <Image
          source={require('../../public/xat.png')}
          style={styles.navImage} // Aplica estilos para contener la imagen
          resizeMode='contain' // Asegura que la imagen se ajuste al contenedor
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('User')}
      >
        <Image
          source={require('../../public/user.png')}
          style={styles.navImage} // Aplica estilos para contener la imagen
          resizeMode='contain' // Asegura que la imagen se ajuste al contenedor
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
    backgroundColor: '#f0f0f0', // Fondo opcional para la barra
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    color: '#572364',
    fontWeight: 'bold',
  },
  navImage: {
    width: 30, // Ajusta el ancho de la imagen
    height: 30, // Ajusta la altura de la imagen
  },
});
