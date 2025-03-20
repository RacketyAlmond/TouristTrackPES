import React, { useEffect, useState } from 'react';
import MapView, { Circle } from 'react-native-maps';
import { StyleSheet } from 'react-native';

export default function Area({ municipi, numTuristes }) {
  const [coordinates, setCoordinates] = useState(null);

  // Calcular opacidad basada en el número de turistas
  const maxTuristes = 1000000; // Máximo valor de turistas para calcular la opacidad
  const opacity = Math.min(numTuristes / maxTuristes, 1); // Limitamos la opacidad al rango [0, 1]
  const fillColor = `rgba(250, 185, 140, ${opacity})`;

  useEffect(() => {
    const buscarCiudad = async (cityName) => {
      const result = await getCoordinatesFromCity(cityName);
      if (result) {
        setCoordinates({
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
        });
      }
    };

    if (municipi) {
      buscarCiudad(municipi);
    }
  }, [municipi]); // Se ejecuta cuando cambia 'municipi'

  const getCoordinatesFromCity = async (cityName) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`,
        {
          headers: {
            'User-Agent':
              'TourisTrack/1.0 (sergi.font.jane@estudiantat.upc.edu)',
          },
        },
      );
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return { lat: data[0].lat, lon: data[0].lon };
      } else {
        console.log('No se encontraron resultados.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener las coordenadas:', error);
      return null;
    }
  };

  // Mientras se cargan las coordenadas, no renderizamos el círculo
  if (!coordinates) {
    return null;
  }

  return (
    <Circle
      center={coordinates}
      radius={5000}
      strokeWidth={0}
      fillColor={fillColor}
    />
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
