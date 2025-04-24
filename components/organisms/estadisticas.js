//import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import Grafica from '../molecules/grafica';
import { filterData, listOriginCountries, listYears } from '../../filters';
import { useRoute } from '@react-navigation/native';
import { getTopCountries } from '../../dataestur';
import { getCountryFlag } from '../../utils';

export default function Estadisticas() {
  const route = useRoute();
  const { locality, dataApi } = route.params;
  const topPaises = getTopCountries(dataApi);
  //primer desplegable nº turistas (años)
  //const [selectedItemAnos, setSelectedItemAnos] = useState('1 año');
  //const opcionesAnos = ['20, '2 años', '3 años', '4 años', '5 años'];

  //segundo desplegable nº turistas (paises)
  const [selectedItemPaises, setSelectedItemPaises] = useState('Italia');
  //const [opcionesAnos, setOpcionesAnos] = useState(['2021', '2019', '2020']);

  const [selectedItemAnos, setSelectedItemAnos] = useState('2021');

  /*const opcionesPaises = [
    'Todos los países',
    'España',
    'Italia',
    'Francia',
    'Alemania',
    'Suiza',
  ];*/

  //funcion para obtener la bandera en .png

  //primer desplegable gasto (años)
  const [selectedItemAnos2, setSelectedItemAnos2] = useState('1 año');

  //segundo desplegable gasto (paises)
  const [selectedItemPaises2, setSelectedItemPaises2] =
    useState('Todos los países');

  //tercer desplegable gasto (gastos)
  const [selectedItemGasto, setSelectedItemGasto] = useState('Alimentación');

  //opciones gastos
  const opcionesGastos = [
    'Alimentación',
    'Transporte',
    'Alojamiento',
    'Compras',
  ];

  const filteredData = dataApi
    ? filterData(
        [parseInt(selectedItemAnos)],
        [],
        [selectedItemPaises],
        dataApi,
      )
    : [];

  const opcionesAnos = dataApi ? listYears(dataApi) : ['2021'];

  const opcionesPaises = dataApi ? listOriginCountries(dataApi) : ['Italia'];

  //const filteredData = filterData([2019], [], ['Italia'], dataApi); //selectedItemPaises pot ser tots, per tant s'ha de mirar el codi del marc per veure que passa

  const transformDataForChart = (filteredData) => {
    if (!filteredData || filteredData.length === 0) {
      console.warn('No hay datos disponibles para la gráfica.');
      console.warn('filteredData');
      console.warn(dataApi);
      return {
        labels: [],
        datasets: [{ data: [] }],
      };
    }
    // Ordenar los datos por MES (para que aparezcan en orden en la gráfica)
    const sortedData = [...filteredData].sort(
      (a, b) => parseInt(a.MES) - parseInt(b.MES),
    );

    return {
      labels: sortedData.map(
        (item) => `${item.AÑO}M${item.MES.padStart(2, '0')}`,
      ), // YYYYMmm
      datasets: [
        {
          data: sortedData.map((item) => {
            const turistas = parseInt(item.TURISTAS, 10);
            return isNaN(turistas) ? 0 : turistas;
          }),
        },
      ],
    };
  };

  const data = transformDataForChart(filteredData);

  return (
    <SafeAreaView style={styles.safe_container}>
      <StatusBar barStyle='dark-content' backgroundColor='white' />
      <View style={styles.main_container}>
        {/*estadisticas*/}
        <View style={styles.cabecera}>
          <Text style={styles.textoCabecera}>Estadísticas</Text>
        </View>

        {/*ciudad*/}
        <View style={styles.sub_container}>
          <Text style={styles.titulos_morados}>{locality.name}</Text>
          <Text style={styles.subtitulo}>{locality.comunidad}</Text>
        </View>

        {/*nº turistas*/}
        <View style={styles.numeroTuristas_container}>
          <Text style={styles.titulos_morados}>Nº de turistas</Text>
          <Text style={styles.titulos_morados}>{locality.tourists}</Text>
        </View>
        <View style={styles.select_container}>
          <Picker
            selectedValue={selectedItemAnos}
            onValueChange={(itemValue) => setSelectedItemAnos(itemValue)}
            style={styles.pickerAno}
          >
            {opcionesAnos.map((opcionAno) => (
              <Picker.Item
                key={opcionAno}
                label={opcionAno}
                value={opcionAno}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedItemPaises}
            onValueChange={(itemValue) => setSelectedItemPaises(itemValue)}
            style={styles.pickerPais}
          >
            {opcionesPaises.map((opcionPais) => (
              <Picker.Item
                key={opcionPais}
                label={opcionPais}
                value={opcionPais}
              />
            ))}
          </Picker>
        </View>
        <View>
          {filteredData.length > 0 ? (
            <Grafica data={data} title='Número Turistas' />
          ) : (
            <></>
          )}
        </View>

        {/*top paises*/}
        <View style={styles.sub_container}>
          <Text style={styles.titulos_morados}>
            Top países de los visitantes
          </Text>
          {topPaises.map((topPais, index) => (
            <View key={index} style={styles.pais_container}>
              <Text style={styles.pais}>
                {index + 1}. {topPais}
              </Text>
              <Image
                source={{ uri: getCountryFlag(topPais) }}
                style={styles.banderaPais}
              />
            </View>
          ))}
        </View>

        {/*gasto*/}
        <View style={styles.numeroTuristas_container}>
          <Text style={styles.titulos_morados}>Gasto</Text>
          <Picker
            selectedValue={selectedItemAnos2}
            onValueChange={(itemValue) => setSelectedItemAnos2(itemValue)}
            style={styles.pickerAno}
          >
            {opcionesAnos.map((opcionAno) => (
              <Picker.Item
                key={opcionAno}
                label={opcionAno}
                value={opcionAno}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedItemPaises2}
            onValueChange={(itemValue) => setSelectedItemPaises2(itemValue)}
            style={styles.pickerPais}
          >
            {opcionesPaises.map((opcionPais) => (
              <Picker.Item
                key={opcionPais}
                label={opcionPais}
                value={opcionPais}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedItemGasto}
            onValueChange={(itemValue) => setSelectedItemGasto(itemValue)}
            style={styles.pickerPais}
          >
            {opcionesGastos.map((opcionGasto) => (
              <Picker.Item
                key={opcionGasto}
                label={opcionGasto}
                value={opcionGasto}
              />
            ))}
          </Picker>
        </View>
        {/*<StatusBar style='auto' />*/}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe_container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop:
      Platform.OS === 'android'
        ? Math.min(StatusBar.currentHeight || 30, 5)
        : 0,
  },
  main_container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    //position: 'absolute',
  },
  sub_container: {
    padding: 10,
  },
  numeroTuristas_container: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    //alignItems: 'center',
    gap: 10,
  },
  select_container: {
    padding: 0,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  cabecera: {
    alignItems: 'center',
  },
  textoCabecera: {
    fontSize: 24,
    fontWeight: 'bold',
    alignContent: 'center',
  },
  titulos_morados: {
    fontSize: 18,
    alignItems: 'flex-start',
    color: '#572364',
    fontWeight: 'bold',
  },
  subtitulo: {
    color: '#666666',
    fontSize: 12,
  },
  pickerAno: {
    flex: 1, //new
    //width: 65,
    minWidth: 65, //new
    backgroundColor: '#dddddd',
    borderRadius: 5,
  },
  pickerPais: {
    flex: 1, //new
    //width: 125,
    minWidth: 125, //new
    backgroundColor: '#dddddd',
    borderRadius: 5,
  },
  pais_container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pais: {
    fontSize: 18,
    alignItems: 'flex-start',
    fontWeight: 'bold',
  },
  banderaPais: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
