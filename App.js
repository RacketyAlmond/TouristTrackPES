/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chats from './components/organisms/chats';
import Map from './components/organisms/map';
import Estadisticas from './components/organisms/estadisticas';
import { fetchCSV } from './dataestur';
import PersonalChat from './components/organisms/personalChat';

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
        initialRouteName='Chats'
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name='Chats'>{() => <Chats data={data} />}</Stack.Screen>
        <Stack.Screen name='Chats' component={Chats} />
        <Stack.Screen name='Mapa'>{() => <Map data={data} />}</Stack.Screen>
        <Stack.Screen name='Estadisticas' component={Estadisticas} />
        <Stack.Screen name='PersonalChat' component={PersonalChat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
