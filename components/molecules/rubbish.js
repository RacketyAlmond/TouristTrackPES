import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';

export default function BuscarCiudad() {
  const [city, setCity] = useState('');
  const [coords, setCoords] = useState(null);

  const buscarCiudad = async () => {
    const result = await getCoordinatesFromCity(city);
    setCoords(result);
  };

  const getCoordinatesFromCity = async (cityName) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`,
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { lat, lon };
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder='Introduce una ciudad'
        value={city}
        onChangeText={setCity}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title='Buscar' onPress={buscarCiudad} />
      {coords && (
        <Text style={{ marginTop: 20 }}>
          Latitud: {coords.lat}, Longitud: {coords.lon}
        </Text>
      )}
    </View>
  );
}
