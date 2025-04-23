import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Map from './components/organisms/map';
import Estadisticas from './components/organisms/estadisticas';
import NavBar from './components/organisms/navBar';
import Xat from './components/organisms/xatProva';
import User from './components/organisms/userProva';
import Foro from './components/organisms/foroProva';
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
      <Stack.Navigator
        initialRouteName='Mapa'
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name='Mapa'>{() => <Map data={data} />}</Stack.Screen>
        <Stack.Screen name='Estadisticas' component={Estadisticas} />
        <Stack.Screen name='Xat' component={Xat} />
        <Stack.Screen name='User' component={User} />
        <Stack.Screen name='Foro' component={Foro} />
      </Stack.Navigator>
      <NavBar />
    </NavigationContainer>
  );
}
