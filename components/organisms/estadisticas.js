import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import Grafica from '../molecules/grafica';
import { filterData, listOriginCountries, listYears } from '../../filters';
import { useRoute } from '@react-navigation/native';
import { getTopCountries } from '../../dataestur';
import { getCountryFlag } from '../../utils';
import SelectorPlataforma from '../molecules/selectorPlataforma';
import { transformDataForChart } from '../molecules/transformDataForChart';

export default function Estadisticas() {
  const route = useRoute();
  const { locality, dataApi } = route.params;
  const topPaises = getTopCountries(dataApi);

  //segundo desplegable nº turistas (paises)
  const [selectedItemPaises, setSelectedItemPaises] = useState('Italia');
  //const [opcionesAnos, setOpcionesAnos] = useState(['2021', '2019', '2020']);

  const [selectedItemAnos, setSelectedItemAnos] = useState('2021');

  //primer desplegable gasto (años)
  const [selectedItemAnos2, setSelectedItemAnos2] = useState('2021');

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

  /*const dataApiDurum = [
    {
      AÑO: '2019',
      CONTINENTE_ORIGEN: 'total',
      MES: '7',
      MUNICIPIO_DESTION: 'reinosa',
      PAIS_ORIGEN: 'españa',
      TURISTAS: '145',
    },
    {
      AÑO: '2019',
      CONTINENTE_ORIGEN: 'europa',
      MES: '8',
      MUNICIPIO_DESTION: 'reinosa',
      PAIS_ORIGEN: 'españa',
      TURISTAS: '250',
    },
  ];
  */

  const filteredData = dataApi
    ? filterData(
        [parseInt(selectedItemAnos)],
        [],
        [selectedItemPaises],
        dataApi,
      )
    : [];

  const filteredData2 = dataApi
    ? filterData(
        [parseInt(selectedItemAnos2)],
        [],
        [selectedItemPaises2],
        dataApi,
      )
    : [];

  const opcionesAnos = dataApi ? listYears(dataApi) : ['2021'];

  const opcionesPaises = dataApi ? listOriginCountries(dataApi) : ['Italia'];

  //const filteredData = filterData([2019], [], ['Italia'], dataApi); //selectedItemPaises pot ser tots, per tant s'ha de mirar el codi del marc per veure que passa

  const data = transformDataForChart(filteredData, dataApi);
  const data2 = transformDataForChart(filteredData2, dataApi);

  return (
    <ScrollView style={styles.container}>
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
            <Text style={styles.titulos_morados}>Nº de turistas:</Text>
            <Text style={styles.titulos_morados}>{locality.tourists}</Text>
          </View>
          <View style={styles.select_container}>
            <SelectorPlataforma
              selectedValue={selectedItemAnos}
              onValueChange={(item) => setSelectedItemAnos(item)}
              options={opcionesAnos}
              style={styles.pickerAno}
            />

            <SelectorPlataforma
              selectedValue={selectedItemPaises}
              onValueChange={(item) => setSelectedItemPaises(item)}
              options={opcionesPaises}
              style={styles.pickerPais}
            />
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
          </View>
          <View style={styles.numeroTuristas_container}>
            <SelectorPlataforma
              selectedValue={selectedItemAnos2}
              onValueChange={(item) => setSelectedItemAnos2(item)}
              options={opcionesAnos}
              style={styles.pickerAno}
            />

            <SelectorPlataforma
              selectedValue={selectedItemPaises2}
              onValueChange={(item) => setSelectedItemPaises2(item)}
              options={opcionesPaises}
              style={styles.pickerPais}
            />

            <SelectorPlataforma
              selectedValue={selectedItemGasto}
              onValueChange={(item) => setSelectedItemGasto(item)}
              options={opcionesGastos}
              style={styles.pickerPais}
            />
          </View>
          <View>
            {filteredData.length > 0 ? (
              <Grafica data={data} title='Gasto Turistas' />
            ) : (
              <></>
            )}
          </View>
          {/*<StatusBar style='auto' />*/}
        </View>
      </SafeAreaView>
    </ScrollView>
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
    justifyContent: 'flex-start',
    //alignItems: 'center',
    gap: 10,
    //paddingRight: 10,
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
    minWidth: 100, //new
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
