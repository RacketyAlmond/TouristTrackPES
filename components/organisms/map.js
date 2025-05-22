// components/organisms/map.js

import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import SearchBar from '../molecules/searchBar';
import InfoLocalidad from '../molecules/InfoLocalidad';
import Area from '../atoms/area';
import { getCoordinatesFromCity } from '../../utils';
import {
  listOriginCountries,
  getTotalTouristsOfMunicipality,
  getSummaryData,
} from '../../dataestur';

export default function Map() {
  const { t } = useTranslation(); // usa el namespace por defecto
  const navigation = useNavigation(); // para actualizar el título dinámicamente

  const [city, setCity] = useState('');
  const [coords, setCoords] = useState(null);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [listCountries, setListCountries] = useState([]);
  const [data, setData] = useState([]);
  const mapRef = useRef(null);

  // Actualiza el título del header cada vez que cambia el idioma
  useEffect(() => {
    navigation.setOptions({ title: t('header') });
  }, [t, navigation]);

  // Carga inicial de datos (lista de países y resumen global)
  useEffect(() => {
    (async () => {
      try {
        const [list, summary] = await Promise.all([
          listOriginCountries(),
          getSummaryData(),
        ]);
        setListCountries(list);
        setData(summary);
      } catch (err) {
        console.error('Error al cargar datos iniciales:', err);
      }
    })();
  }, []);

  // Actualiza el resumen cuando cambian los países seleccionados
  useEffect(() => {
    (async () => {
      try {
        const names = selectedCountries.map((c) => c.name);
        const summary = await getSummaryData(names);
        setData(summary);
      } catch (err) {
        console.error('Error al actualizar resumen:', err);
      }
    })();
  }, [selectedCountries]);

  // Total de turistas para la localidad actual
  const totalTourists = getTotalTouristsOfMunicipality(city, data);

  // Función para buscar y centrar la ciudad en el mapa
  const searchCity = async (name) => {
    try {
      const result = await getCoordinatesFromCity(name);
      if (result) {
        setCoords(result);
        setCity(result.name);
        mapRef.current.animateToRegion(
          {
            latitude: +result.lat,
            longitude: +result.lon,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          },
          1000,
        );
      }
    } catch (err) {
      console.error('Error al buscar ciudad:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        onSearch={searchCity}
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
        {coords && (
          <>
            <Marker
              coordinate={{
                latitude: +coords.lat,
                longitude: +coords.lon,
              }}
              title={t('header')}
              description={`${t('filter.open')}: ${totalTourists}`}
              onPress={() => setCity(city)}
            />
            <Area municipi={city} numTuristes={totalTourists} />
          </>
        )}
      </MapView>

      {city && (
        <InfoLocalidad
          city={city}
          numTourists={totalTourists}
          onClose={() => setCity('')}
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
