import React, { useState, useRef, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView, StyleSheet } from 'react-native';
import SearchBar from '../molecules/searchBar';
import InfoLocalidad from '../molecules/InfoLocalidad';
import { getCoordinatesFromCity } from '../../utils';
import Area from '../atoms/area';
import {
  listOriginCountries,
  getTotalTouristsOfMunicipality,
  getSummaryData,
} from '../../dataestur';

export default function Map() {
  const [city, setCity] = useState('');
  const [coords, setCoords] = useState(null);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [listCountries, setListCountries] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        console.log('listOriginCountries|getSummaryData...');
        const [list, data] = await Promise.all([
          listOriginCountries(),
          getSummaryData(),
        ]);
        setListCountries(list);
        setData(data);
      } catch (err) {
        console.error('Error al cargar los datos:', err);
      }
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    const cargarDatosResumen = async () => {
      try {
        const countryNames = selectedCountries.map((c) => c.name);
        console.log('getSummaryData:', countryNames);
        const data = await getSummaryData(countryNames);
        setData(data);
      } catch (err) {
        console.error('Error al cargar los datos:', err);
      }
    };

    cargarDatosResumen();
  }, [selectedCountries]); // cada vez que cambia

  const mapRef = useRef(null);
  console.log('getDataOf...');

  console.log('getTourists of: ', city);
  const totalTouristsOfMunicipality = getTotalTouristsOfMunicipality(
    city,
    data,
  );

  console.log('done............');

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
