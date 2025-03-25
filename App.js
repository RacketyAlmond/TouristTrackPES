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
  listYears,
  getTouristMunicipalities,
} from './filters';

export default function App() {
  const [screen, setScreen] = useState(false);
  const [data, setData] = useState([]);
  const [availableNacionalities, setAvailableNacionalities] = useState([]);
  const [topCountries, setTopCountries] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedItemAnos, setSelectedItemAnos] = useState('2019');
  const [sumaTuristas, setSumaTuristas] = useState(0);

  useEffect(() => {
    fetchCSV(
      (data) => {
        console.log(
          getTouristMunicipalities(data, ['Italia', 'Francia', 'Alemania']),
        );
        const municipalityData = getDataOfMunicipality('Santander', data);
        setData(municipalityData);
        console.log(municipalityData);
        console.log('lista');
        const countries = listOriginCountries(municipalityData);
        setAvailableNacionalities(countries);
        console.log(countries);
        const yearOptions = listYears(municipalityData);
        console.log(yearOptions);
        setYears(yearOptions);
        const filteredData = filterData([2019], [], [], municipalityData);
        console.log('filtro');
        console.log(filteredData);
        console.log('suma');
        const totalTourists = sumNumTourists(filteredData);
        setSumaTuristas(totalTourists);
        console.log(totalTourists.toString());
        const top5 = getTopCountries(filteredData, 5);
        console.log(top5);
        setTopCountries(top5);
      }, // Callback de éxito
      (error) => setData('Error cargando el CSV'), // Callback de error
    );
  }, []);

  //console.log(selectedItemAnos);
  const PantallaB = () => (
    <View>
      <Estadisticas
        dataApi={data}
        topPaises={topCountries}
        sumaTuristas={sumaTuristas}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <PantallaB />

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
