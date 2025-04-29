/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chats from './components/organisms/generalChat';
import Map from './components/organisms/map';
import Estadisticas from './components/organisms/estadisticas';
import NavBar from './components/organisms/navBar';
import User from './components/organisms/userProva';
import Foro from './components/organisms/foroProva';
import AddChat from './components/organisms/addChat';
import { fetchCSV } from './dataestur';
import PersonalChat from './components/organisms/personalChat';

const Stack = createNativeStackNavigator();

export default function App() {
  const [data, setData] = useState([]);

  const currentUser = {
    "id": "0",
    "name": "Yo",
    "avatar": "https://i.pinimg.com/474x/24/0d/b3/asdsaeeedsseed.jpg",
    "about": "hi"
  }

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
        <Stack.Screen name='Chats'>{() => <Chats currentUser={currentUser} />}</Stack.Screen>
        <Stack.Screen name='Mapa'>{() => <Map data={data} />}</Stack.Screen>
        <Stack.Screen name='Estadisticas' component={Estadisticas} />
        <Stack.Screen name='User' component={User} />
        <Stack.Screen name='Foro' component={Foro} />
        <Stack.Screen name='PersonalChat' component={PersonalChat} />
        <Stack.Screen name='AddChat' component={AddChat} />
      </Stack.Navigator>
      <NavBar />
    </NavigationContainer>
  );
}
