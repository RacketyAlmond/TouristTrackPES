/* eslint-disable prettier/prettier */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chats from './components/organisms/generalChat';
import Map from './components/organisms/map';
import Forum from './components/organisms/forum';
import IndexForos from './components/organisms/indexForos';
import Estadisticas from './components/organisms/estadisticas';
import NavBar from './components/organisms/navBar';

import AddChat from './components/organisms/addChat';
import PersonalChat from './components/organisms/personalChat';
import UserStack from './components/navigation/UserStack'; // NUEVO

import { AuthProvider } from './components/contexts/AuthContext'; // NUEVO
import { UserProvider } from './components/contexts/UserContext'; // NUEVO

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <AuthProvider>
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
            <Stack.Screen name='Mapa'>{() => <Map/>}</Stack.Screen>
            <Stack.Screen name='Estadisticas' component={Estadisticas} />
            <Stack.Screen name='Chats' component={Chats} />
            <Stack.Screen name='PersonalChat' component={PersonalChat} />
            <Stack.Screen name='AddChat' component={AddChat} />
            <Stack.Screen
              name='User'
              component={UserStack}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
          <NavBar />
        </NavigationContainer>
      </AuthProvider>
    </UserProvider>
  );
}
