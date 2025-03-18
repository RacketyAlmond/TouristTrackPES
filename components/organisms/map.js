import React, { useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';

export default function Map({ selectedLocality, onSelectLocality }) {
  const mapRef = useRef(null);

  const cities = [
    {
      name: 'Madrid',
      comarca: 'Comunidad de Madrid',
      latitude: 40.4168,
      longitude: -3.7038,
      color: 'red',
      tourists: 1000000,
      expenses: 500,
      rating: 4.5,
      ratingCount: 200,
    },
    {
      name: 'Barcelona',
      comarca: 'Cataluña',
      latitude: 41.3784,
      longitude: 2.192,
      color: 'blue',
      tourists: 800000,
      expenses: 400,
      rating: 4.2,
      ratingCount: 150,
    },
    {
      name: 'Valencia',
      comarca: 'Comunidad Valenciana',
      latitude: 39.4699,
      longitude: -0.3763,
      color: 'green',
      tourists: 600000,
      expenses: 300,
      rating: 4.0,
      ratingCount: 100,
    },
    {
      name: 'Seville',
      comarca: 'Andalucía',
      latitude: 37.3891,
      longitude: -5.9845,
      color: 'orange',
      tourists: 500000,
      expenses: 250,
      rating: 4.3,
      ratingCount: 120,
    },
    {
      name: 'Zaragoza',
      comarca: 'Aragón',
      latitude: 41.6488,
      longitude: -0.8891,
      color: 'purple',
      tourists: 400000,
      expenses: 200,
      rating: 4.1,
      ratingCount: 80,
    },
  ];

  useEffect(() => {
    if (selectedLocality && mapRef.current) {
      const locality = cities.find(
        (city) => city.name === selectedLocality.name,
      );
      if (locality) {
        mapRef.current.animateToRegion(
          {
            latitude: locality.latitude,
            longitude: locality.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          1000,
        );
      }
    }
  }, [selectedLocality]);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={{
        latitude: 40.0, // Centro aproximado de España
        longitude: -3.5,
        latitudeDelta: 10.0, // Nivel de zoom
        longitudeDelta: 10.0,
      }}
    >
      {cities.map((city, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: city.latitude, longitude: city.longitude }}
          pinColor={city.color}
          onPress={() => onSelectLocality(city)}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});
