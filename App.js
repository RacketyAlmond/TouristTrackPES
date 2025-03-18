import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Filtro from './components/organisms/filtro';
import React, { useEffect, useState } from 'react';
import {
  fetchCSV,
  filterData,
  getDataOfMunicipality,
  listOriginCountries,
  sumNumTourists,
} from './filters';

export default function App() {
  const [data, setData] = useState('');
  const[availableNacionalities, setAvailableNacionalities] = useState([]);


  useEffect(() => {
    fetchCSV(
      (data) => {
        const municipalityData = getDataOfMunicipality('Santander', data);
        console.log(municipalityData);
        console.log('lista');
        const countries = listOriginCountries(municipalityData);
        setAvailableNacionalities(countries);
        console.log(countries);
        const filteredData = filterData(
          [2024],
          [5, 6, 7],
          ['Italia', 'Francia'],
          municipalityData,
        );
        console.log('filtro');
        console.log(filteredData);
        console.log('suma');
        const totalTourists = sumNumTourists(filteredData);
        console.log(totalTourists.toString());
        setData(totalTourists.toString());
      }, // Callback de éxito
      (error) => setData('Error cargando el CSV'), // Callback de error
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text>
        {data
          ? `La suma de turistas es: ${data}`
          : 'se esta haciendo fetch de la API...'}
      </Text>
      <StatusBar style='auto' />
      <Filtro countryArray= {availableNacionalities}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
