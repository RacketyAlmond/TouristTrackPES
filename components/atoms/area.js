import React, { useEffect, useState } from 'react';
import { Circle } from 'react-native-maps';
import { getCoordinatesFromCity } from '../../utils';

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
