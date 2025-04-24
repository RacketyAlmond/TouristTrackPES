import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Map from './components/organisms/map';
import Forum from './components/organisms/forum';
import IndexForos from './components/organisms/indexForos';
import Estadisticas from './components/organisms/estadisticas';
import NavBar from './components/organisms/navBar';
import Xat from './components/organisms/xatProva';
import User from './components/organisms/userProva';
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
        initialRouteName='Mapa' // Establecer el mapa como pantalla inicial
        screenOptions={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name='Foros'
          component={IndexForos}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Forum'
          component={Forum}
          options={{
            headerShown: false, // Ocultar el header
            gestureEnabled: true, // Habilitar gestos
            gestureDirection: 'horizontal', // Dirección del gesto
            animation: 'slide_from_right', // Animación al navegar
          }}
        />
        <Stack.Screen name='Mapa'>{() => <Map data={data} />}</Stack.Screen>
        <Stack.Screen name='Estadisticas' component={Estadisticas} />
        <Stack.Screen name='Xat' component={Xat} />
        <Stack.Screen name='User' component={User} />
      </Stack.Navigator>
      <NavBar />
    </NavigationContainer>
  );
}
