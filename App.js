import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Map from './components/organisms/map';
import Forum from './components/organisms/forum';
import Estadisticas from './components/organisms/estadisticas';
import { fetchCSV } from './dataestur';

const Stack = createNativeStackNavigator();

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchCSV(
      (fetchedData) => setData(fetchedData),
      (error) => console.error('Error al obtener los datos:', error),
    );
  }, []);

  return (
    <NavigationContainer>
      <Forum></Forum>
    </NavigationContainer>
  );
}
