import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Map from './components/organisms/map';
import Estadisticas from './components/organisms/estadisticas';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Mapa'
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name='Mapa'>{() => <Map />}</Stack.Screen>
        <Stack.Screen name='Estadisticas' component={Estadisticas} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
