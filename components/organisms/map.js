import React, { useState, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView, StyleSheet } from 'react-native';
import SearchBar from '../molecules/searchBar';
import InfoLocalidad from '../molecules/InfoLocalidad';

export default function Map() {
  const [city, setCity] = useState('');
  const [coords, setCoords] = useState(null);
  const mapRef = useRef(null);

  const buscarCiudad = async (cityName) => {
    const result = await getCoordinatesFromCity(cityName);
    if (result) {
      setCoords(result);
      mapRef.current.animateToRegion(
        {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
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

  const handleCloseInfoLocalidad = () => {
    setCity('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        onSearch={(cityName) => {
          setCity(cityName);
          buscarCiudad(cityName);
        }}
      />
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 40.0,
          longitude: -3.5,
          latitudeDelta: 5.5,
          longitudeDelta: 5.5,
        }}
      >
        {coords && (
          <Marker
            coordinate={{
              latitude: parseFloat(coords.lat),
              longitude: parseFloat(coords.lon),
            }}
            title={city}
            onPress={() => setCity(city)}
          />
        )}
      </MapView>
      {city && (
        <InfoLocalidad locality={city} onClose={handleCloseInfoLocalidad} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: '100%',
  },
});
