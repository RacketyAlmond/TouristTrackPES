// components/organisms/map.js

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import SearchBar from '../molecules/searchBar';
import InfoLocalidad from '../molecules/InfoLocalidad';
import Area from '../atoms/area';
import { getCoordinatesFromCity } from '../../utils';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  listOriginCountries,
  getTotalTouristsOfMunicipality,
  getSummaryData,
} from '../../dataestur';
import { API_BASE_URL } from '../../config';

export default function Map() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [city, setCity] = useState('');
  const [coords, setCoords] = useState(null);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [listCountries, setListCountries] = useState([]);
  const [data, setData] = useState([]);
  const mapRef = useRef(null);

  const [errorMsg, setErrorMsg] = useState(null);
  const [location, setLocation] = useState(null);
  const [cityId, setCityId] = useState(null);

  const getIdCity = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/forums/localidad/${city}`,
      );
      const json = await response.json();

      if (json.success) {
        const cityData = json.forum;
        if (cityData && cityData.id) {
          return cityData.id;
        }
      }

      const response2 = await fetch(`${API_BASE_URL}/forums`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Localidad: city }),
      });
      const json2 = await response2.json();
      if (json2.success) {
        return json2.forumId;
      } else {
        console.error(`Error al crear el foro para la ciudad "${city}".`);
      }

      return null;
    } catch (error) {
      console.error('Error al obtener o crear la ID de la ciudad:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchCityId = async () => {
      if (city) {
        const id = await getIdCity();
        setCityId(id);
      } else {
        setCityId(null);
      }
    };

    fetchCityId();
  }, [city]);

  useEffect(() => {
    let subscription;
    let interval;

    const startWatchingLocation = async () => {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setErrorMsg('Location services are disabled');
        setLocation(null);
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLocation(null);
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation.coords);
        },
      );
    };

    const checkLocationServices = async () => {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setErrorMsg('Location services are disabled');
        setLocation(null);
      } else {
        setErrorMsg(null);
      }
    };

    startWatchingLocation();

    interval = setInterval(checkLocationServices, 5000);

    return () => {
      if (subscription) {
        subscription.remove();
      }
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  if (errorMsg) {
    console.log('Error: ', errorMsg);
  }

  if (!location) {
    console.log('Loading location...');
  }

  useEffect(() => {
    navigation.setOptions({ title: t('header') });
  }, [t, navigation]);

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

  const totalTourists = getTotalTouristsOfMunicipality(city, data);

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

  const handleCloseInfoLocalidad = () => {
    setCity('');
  };

  const handleGoToMyLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        },
        1000,
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        onSearch={(cityName) => {
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
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title='Mi ubicación'
            description='Ubicación actual'
            pinColor='#572364'
          />
        )}
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

      {/* Botón fuera del MapView pero superpuesto */}
      <TouchableOpacity
        style={[styles.button]}
        onPress={handleGoToMyLocation}
        disabled={!location}
      >
        <Icon
          name={!location ? 'location-searching' : 'my-location'}
          size={24}
          color='#572364'
        />
      </TouchableOpacity>

      {city && (
        <InfoLocalidad
          city={city}
          id={cityId}
          numTourists={totalTourists}
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
  myLocationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationAvailable: {
    backgroundColor: '#4CAF50',
  },
  locationUnavailable: {
    backgroundColor: '#D32F2F',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 12,
    elevation: 5,
  },
});
