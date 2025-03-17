import React from 'react';
import MapView, { Circle } from 'react-native-maps';
import { StyleSheet } from 'react-native';

export default function Area({ municipi, numTuristes }) {
  // Calcular opacidad basándonos en el número de turistas.
  // Asegúrate de normalizar `numTuristes` a un rango entre 0 y 1.
  // Si numTuristes es grande, la opacidad será baja, si es pequeño, la opacidad será alta.
  const maxTuristes = 1000000; // Maximo valor de turistas para calcular la opacidad
  const opacity = Math.min(numTuristes / maxTuristes, 1); // Limitamos la opacidad al rango [0, 1]

  // Definimos el color con opacidad dinámica
  const fillColor = `rgba(250, 185, 140, ${opacity})`;
  //const fillColor = `rgba(95, 50, 110, ${opacity})`;

  return (
    <Circle
      center={{ latitude: 40.4168, longitude: -3.7038 }}
      radius={5000} // Radio de 5 km
      strokeWidth={0}
      fillColor={fillColor} // Aplicamos el color con opacidad dinámica
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
