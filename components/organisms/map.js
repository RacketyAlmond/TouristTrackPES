import React, { useState, useRef, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import SearchBar from '../molecules/searchBar';
import InfoLocalidad from '../molecules/InfoLocalidad';
import { getCoordinatesFromCity } from '../../utils';
import Area from '../atoms/area';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
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

  const [errorMsg, setErrorMsg] = useState(null);
  const [location, setLocation] = useState(null);
  const [cityId, setCityId] = useState(null);

  const getIdCity = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/forums/localidad/${city}`,
      );
      const json = await response.json();
      if (json.success) {
        console.log(1);
        // Busca la ciudad que coincida con el nombre almacenado en `city`
        const cityData = json.forums.find((forum) => forum.Localidad === city);

        if (cityData) {
          console.log(`ID de la ciudad "${city}":`, cityData.id);
          return cityData.id; // Devuelve la ID de la ciudad
        } else {
          console.log(`No se encontró la ciudad "${city}" en los datos.`);
          return null; // Si no se encuentra, devuelve null
        }
      }
    } catch (error) {
      console.log(error);
      console.error('Error al obtener la ID de la ciudad:', error);
    }
  };

  useEffect(() => {
    const fetchCityId = async () => {
      if (city) {
        const id = await getIdCity();
        console.log(`ID de la ciudad "${city}":`, id);
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
        setLocation(null); // Limpia la ubicación si los servicios están desactivados
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLocation(null); // Limpia la ubicación si no hay permisos
        return;
      }

      // Observa los cambios en la ubicación
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Actualiza cada 1 segundo
          distanceInterval: 1, // Actualiza si el usuario se mueve al menos 1 metro
        },
        (newLocation) => {
          setLocation(newLocation.coords); // Actualiza el estado con la nueva ubicación
        },
      );
    };

    const checkLocationServices = async () => {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setErrorMsg('Location services are disabled');
        setLocation(null); // Limpia la ubicación si los servicios están desactivados
      } else {
        setErrorMsg(null); // Limpia el mensaje de error si los servicios están habilitados
      }
    };

    startWatchingLocation();

    // Verifica periódicamente si los servicios de ubicación están habilitados
    interval = setInterval(checkLocationServices, 5000); // Verifica cada 5 segundos

    // Limpia la suscripción y el intervalo cuando el componente se desmonte
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

      {/* Botón fuera del MapView pero superpuesto */}
      <TouchableOpacity
        style={[styles.button]}
        onPress={handleGoToMyLocation}
        disabled={!location} // Deshabilitar si no hay ubicación
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
    backgroundColor: '#4CAF50', // Verde si la ubicación está disponible
  },
  locationUnavailable: {
    backgroundColor: '#D32F2F', // Rojo si la ubicación no está disponible
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
