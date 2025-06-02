import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import SearchBar from '../molecules/searchBar';
import InfoLocalidad from '../molecules/InfoLocalidad';
import {
  listOriginCountries,
  getSummaryData,
  getTotalTouristsOfMunicipality,
} from '../../dataestur';
import { getCoordinatesFromCity } from '../../utils';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { API_BASE_URL } from '../../config';

const AreaComponent = ({ coords, numTuristes }) => {
  if (!coords) return null;

  return (
    <Circle
      center={[coords.lat, coords.lon]}
      radius={numTuristes ? Math.min(numTuristes * 50, 5000) : 2000}
      pathOptions={{
        fillColor: '#572364',
        fillOpacity: 0.2,
        color: '#572364',
        weight: 1,
      }}
    />
  );
};

// Componente para actualizar la vista del mapa cuando cambian las coordenadas
const MapUpdater = ({ coords, city, location, goToUserLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lon], 13);
    }
  }, [coords, map]);

  useEffect(() => {
    if (goToUserLocation && location) {
      map.flyTo([location.latitude, location.longitude], 15);
    }
  }, [goToUserLocation, location, map]);

  return null;
};

export default function Map() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [city, setCity] = useState('');
  const [coords, setCoords] = useState(null);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [listCountries, setListCountries] = useState([]);
  const [data, setData] = useState([]);
  const [cityId, setCityId] = useState(null);
  const [location, setLocation] = useState(null);
  const [goToUserLocation, setGoToUserLocation] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setErrorMsg(null);
        },
        (error) => {
          console.error('Error obteniendo ubicación: ', error);
          setErrorMsg('Error al obtener la ubicación.');
          setLocation(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    }
  }, []);

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

  const totalTourists = getTotalTouristsOfMunicipality(city, data);

  const searchCity = async (name) => {
    try {
      const result = await getCoordinatesFromCity(name);
      if (result) {
        setCoords(result);
        setCity(result.name);
      }
    } catch (err) {
      console.error('Error al buscar ciudad:', err);
    }
  };

  const handleGoToMyLocation = () => {
    if (location) {
      setGoToUserLocation((prev) => !prev);
    }
  };

  const handleCloseInfoLocalidad = () => {
    setCity('');
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

      <View style={styles.mapContainer}>
        <MapContainer
          center={[40.416775, -3.70379]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Marcador de ubicación del usuario */}
          {location && (
            <Marker position={[location.latitude, location.longitude]}>
              <Popup>Mi ubicación</Popup>
            </Marker>
          )}

          {/* Marcador de la ciudad buscada */}
          {coords && (
            <>
              {/* Círculo de área similar al componente Area nativo */}
              <AreaComponent coords={coords} numTuristes={totalTourists} />
            </>
          )}

          {/* Componente que actualiza la vista del mapa */}
          <MapUpdater
            coords={coords}
            city={city}
            location={location}
            goToUserLocation={goToUserLocation}
          />
        </MapContainer>
      </View>

      {/* Botón para ir a mi ubicación (similar al nativo) */}
      <div style={styles.locationButtonContainer}>
        <TouchableOpacity
          style={[
            styles.myLocationButton,
            !location ? styles.locationUnavailable : styles.locationAvailable,
          ]}
          onPress={handleGoToMyLocation}
          disabled={!location}
        >
          <Text style={styles.buttonIcon}>📍</Text>
        </TouchableOpacity>
      </div>

      {/* Panel de información de la ciudad */}
      {city && (
        <div style={styles.infoLocalidadContainer}>
          <InfoLocalidad
            city={city}
            id={cityId}
            numTourists={totalTourists}
            onClose={handleCloseInfoLocalidad}
          />
        </div>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  cityInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#572364',
  },
  cityText: {
    fontSize: 14,
    marginBottom: 10,
  },
  cityButton: {
    backgroundColor: '#572364',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 1000,
  },
  myLocationButton: {
    backgroundColor: 'white',
    width: 45,
    height: 45,
    borderRadius: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  },
  locationAvailable: {
    opacity: 1,
  },
  locationUnavailable: {
    opacity: 0.5,
  },
  buttonIcon: {
    color: '#572364',
    fontSize: 20,
  },
  locationButtonText: {
    fontSize: 20,
  },
  infoLocalidadContainer: {
    position: 'absolute',
    top: 600,
    left: '50%',
    width: '80%',
    maxWidth: 400,
    zIndex: 1100,
    backgroundColor: 'white',
    borderRadius: 10,
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    padding: 10,
    transform: 'translateX(50%)',
    scale: 0.9,
  },
});
