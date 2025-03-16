import React, { useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';

export default function Map({ selectedLocality }) {
  const mapRef = useRef(null);

  const cities = [
    { name: 'Madrid', latitude: 40.4168, longitude: -3.7038, color: 'red' },
    { name: 'Barcelona', latitude: 41.3784, longitude: 2.192, color: 'blue' },
    { name: 'Valencia', latitude: 39.4699, longitude: -0.3763, color: 'green' },
    { name: 'Seville', latitude: 37.3891, longitude: -5.9845, color: 'orange' },
    {
      name: 'Zaragoza',
      latitude: 41.6488,
      longitude: -0.8891,
      color: 'purple',
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
