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
import {
  listOriginCountries,
  getSummaryData,
  getTotalTouristsOfMunicipality,
} from '../../dataestur';
import { getCoordinatesFromCity } from '../../utils';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Componente para actualizar la vista del mapa cuando cambian las coordenadas
const MapUpdater = ({ coords, city }) => {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lon], 13);
    }
  }, [coords, map]);

  return null;
};

// Versión web del componente Map
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

  useEffect(() => {
    navigation.setOptions({ title: t('header') });
  }, [t, navigation]);

  // Carga inicial de datos
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

  // Solicitar ubicación del usuario (web)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error obteniendo ubicación: ', error);
        },
      );
    }
  }, []);

  const getIdCity = async () => {
    try {
      const response = await fetch(
        `***REMOVED***/forums/localidad/${city}`,
      );
      const json = await response.json();

      if (json.success) {
        const cityData = json.forum;
        if (cityData && cityData.id) {
          console.log(`ID de la ciudad "${city}":`, cityData.id);
          return cityData.id;
        }
      }

      console.log(`No se encontró la ciudad "${city}". Creando el foro...`);
      const response2 = await fetch(`***REMOVED***/forums`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Localidad: city }),
      });
      const json2 = await response2.json();
      if (json2.success) {
        console.log(`Foro creado para la ciudad "${city}". ID:`, json2.forumId);
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
        console.log(`ID de la ciudad "${city}":`, id);
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

  // Cambiar a componente WebMap para la versión web
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
          center={[40.416775, -3.70379]} // Madrid, España como centro inicial
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
            <Marker position={[coords.lat, coords.lon]}>
              <Popup>
                <strong>{city}</strong>
                <br />
                Turistas: {totalTourists || 'No disponible'}
              </Popup>
            </Marker>
          )}

          {/* Componente que actualiza la vista del mapa */}
          <MapUpdater coords={coords} city={city} />
        </MapContainer>
      </View>

      {city && (
        <View style={styles.cityInfo}>
          <Text style={styles.cityTitle}>{city}</Text>
          <Text style={styles.cityText}>
            Turistas: {totalTourists || 'No disponible'}
          </Text>
          <TouchableOpacity
            style={styles.cityButton}
            onPress={() => {
              if (cityId) {
                navigation.navigate('Forum', {
                  forumId: cityId,
                  localityName: city,
                });
              }
            }}
          >
            <Text style={styles.buttonText}>Ver foro</Text>
          </TouchableOpacity>
        </View>
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
});
