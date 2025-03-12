import React from 'react';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';

export default function Map() {
  const cities = [
    { latitude: 40.4168, longitude: -3.7038, color: 'red' }, // Madrid
    { latitude: 41.3784, longitude: 2.192, color: 'blue' }, // Barcelona
    { latitude: 39.4699, longitude: -0.3763, color: 'green' }, // Valencia
  ];
  return (
    <MapView
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
          keyr={index}
          coordinate={{ latitude: city.latitude, longitude: city.longitude }}
          pinColor={city.color}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
