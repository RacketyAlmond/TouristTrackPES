import React, { useState, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import {
  SafeAreaView,
  View,
  Button,
  StyleSheet,
  TextInput,
} from 'react-native';

export default function Map() {
  const [city, setCity] = useState('');
  const [coords, setCoords] = useState(null);
  const mapRef = useRef(null);

  const buscarCiudad = async () => {
    const result = await getCoordinatesFromCity(city);
    if (result) {
      setCoords(result);
      mapRef.current.animateToRegion(
        {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          latitudeDelta: 1.5,
          longitudeDelta: 1.5,
        },
        1000,
      );
    }
  };

  const getCoordinatesFromCity = async (cityName) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`,
        {
          headers: {
            'User-Agent':
              'TourisTrack/1.0 (sergi.font.jane@estudiantat.upc.edu)',
          },
        },
      );
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const { lat, lon } = data[0];
        return { lat, lon };
      } else {
        console.log('No se encontraron resultados.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener las coordenadas:', error);
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder='Introduce una ciudad'
          value={city}
          onChangeText={setCity}
          style={styles.input}
        />
        <Button title='Buscar' onPress={buscarCiudad} />
      </View>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 40.0,
          longitude: -3.5,
          latitudeDelta: 5.0,
          longitudeDelta: 5.0,
        }}
      >
        {coords && (
          <Marker
            coordinate={{
              latitude: parseFloat(coords.lat),
              longitude: parseFloat(coords.lon),
            }}
            title={city}
          />
        )}
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  map: {
    flex: 1,
    width: '100%',
  },
});
