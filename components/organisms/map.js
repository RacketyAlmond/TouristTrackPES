import React, { useState, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView, StyleSheet } from 'react-native';
import SearchBar from '../molecules/searchBar';
import InfoLocalidad from '../molecules/InfoLocalidad';
import { getCoordinatesFromCity } from '../../utils';
import Area from '../atoms/area';
import {
  listOriginCountries,
  getTotalTouristsOfMunicipality,
  getTouristMunicipality,
  getDataOfMunicipality,
} from '../../dataestur';

export default function Map({ data }) {
  const [city, setCity] = useState('');
  const [coords, setCoords] = useState(null);
  const [selectedCountries, setSelectedCountries] = useState([]);

  const mapRef = useRef(null);
  const dataMunicipality = data ? getDataOfMunicipality(city, data) : [];

  const listCountries = data ? listOriginCountries(data) : [];
  const totalTouristsOfMunicipality =
    selectedCountries.length > 0
      ? getTouristMunicipality(
          city,
          data,
          selectedCountries.map((country) => country.name),
        )
      : getTotalTouristsOfMunicipality(city, data);

  const searchCity = async (cityName) => {
    const result = await getCoordinatesFromCity(cityName);
    if (result) {
      setCoords(result);
      setCity(result.name);
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
          //setCity(cityName);
          searchCity(cityName);
        }}
        availableNacionalities={listCountries}
        selectedCountries={selectedCountries}
        setSelectedCountries={setSelectedCountries}
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
            <Area municipi={city} numTuristes={totalTouristsOfMunicipality} />
          </>
        )}
      </MapView>
      {city && (
        //TODO: locality es un objeto con los datos de la localidad, no una string
        <InfoLocalidad
          city={city}
          numTourists={totalTouristsOfMunicipality}
          onClose={handleCloseInfoLocalidad}
          data={dataMunicipality}
        />
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
