import Estadisticas from './components/organisms/estadisticas';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Button,
} from 'react-native';
import Filtro from './components/organisms/filtro';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  fetchCSV,
  filterData,
  getDataOfMunicipality,
  listOriginCountries,
  sumNumTourists,
  getTopCountries,
} from './filters';

export default function App() {
  const [screen, setScreen] = useState(false);
  const [data, setData] = useState('');
  const [availableNacionalities, setAvailableNacionalities] = useState([]);
  const [topCountries, setTopCountries] = useState([]);

  useEffect(() => {
    fetchCSV(
      (data) => {
        const municipalityData = getDataOfMunicipality('Santander', data);
        console.log(municipalityData);
        console.log('lista');
        const countries = listOriginCountries(municipalityData);
        setAvailableNacionalities(countries);
        console.log(countries);
        const filteredData = filterData([2024], [], [], municipalityData);
        console.log('filtro');
        console.log(filteredData);
        console.log('suma');
        const totalTourists = sumNumTourists(filteredData);
        console.log(totalTourists.toString());
        setData(totalTourists.toString());
        const top5 = getTopCountries(filteredData, 5);
        console.log(top5);
        setTopCountries(top5);
      }, // Callback de éxito
      (error) => setData('Error cargando el CSV'), // Callback de error
    );
  }, []);

  const PantallaA = () => (
    <View style={styles.container}>
      <Text>
        {data
          ? `La suma de turistas es: ${data}`
          : 'se esta haciendo fetch de la API...'}
      </Text>
      <StatusBar style='auto' />
      <Filtro countryArray={availableNacionalities} />
    </View>
  );

  const PantallaB = () => (
    <View>
      <Estadisticas topPaises={topCountries} />
    </View>
  );

  return (
    <View style={styles.container}>
      {screen ? <PantallaA /> : <PantallaB />}

      <Button title='Cambiar Pantalla' onPress={() => setScreen(!screen)} />
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
