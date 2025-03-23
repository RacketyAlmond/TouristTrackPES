import React, { useState, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView, StyleSheet } from 'react-native';
import SearchBar from '../molecules/searchBar';
import InfoLocalidad from '../molecules/InfoLocalidad';
import { getCoordinatesFromCity } from '../../utils';
import Area from '../atoms/area';

export default function Map(data) {
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
        {/**data.map((locality) => (
          <Area
            key={locality.municipi}
            municipi={locality.municipi}
            numTuristes={locality.numTuristes}
          />
        ))**/}
        {coords && (
          <>
            <Marker
              coordinate={{
                latitude: parseFloat(coords.lat),
                longitude: parseFloat(coords.lon),
              }}
              title={city}
              onPress={() => setCity(city)}
            />
            <Area municipi={city} numTuristes={1000000000} />
          </>
        )}
      </MapView>
      {city && (
        //TODO: locality es un objeto con los datos de la localidad, no una string
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
