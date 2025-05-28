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
import { useState, useEffect } from 'react';
import Grafica from '../molecules/grafica';
import { useRoute } from '@react-navigation/native';
import {
  getTopCountries,
  getDataOfMunicipality,
  filterData,
  listYearsOfMunicipality,
  listOriginCountriesOfMunicipality,
} from '../../dataestur';
import { useTranslation } from 'react-i18next';
import { getCountryFlag } from '../../utils';
import SelectorPlataforma from '../molecules/selectorPlataforma';
import { transformDataForChart } from '../molecules/transformDataForChart';

export default function Estadisticas() {
  const route = useRoute();
  const { locality } = route.params;
  const { t } = useTranslation('estadisticas');

  const [dataMunicipality, setDataMunicipality] = useState([]);

  useEffect(() => {
    const loadDataMunicipality = async () => {
      try {
        console.log('loadDataMunicipality...');
        const municipality = locality.name;
        console.log('locality: ', municipality);
        const data = await getDataOfMunicipality(municipality);
        setDataMunicipality(data);
      } catch (err) {
        console.error('Error al cargar los datos:', err);
      }
    };

    loadDataMunicipality();
  }, [locality]);

  console.log('top.... ');
  const topPaises = getTopCountries(dataMunicipality);

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

  const filteredData = dataMunicipality
    ? filterData(
        [parseInt(selectedItemAnos)],
        [],
        [selectedItemPaises],
        dataMunicipality,
      )
    : [];

  console.log('filteredData2.... ');
  const filteredData2 = dataMunicipality
    ? filterData(
        [parseInt(selectedItemAnos2)],
        [],
        [selectedItemPaises2],
        dataMunicipality,
      )
    : [];

  const opcionesAnos = dataMunicipality
    ? listYearsOfMunicipality(dataMunicipality)
    : ['2021'];

  const opcionesPaises = dataMunicipality
    ? listOriginCountriesOfMunicipality(dataMunicipality)
    : ['Italia'];

  //const filteredData = filterData([2019], [], ['Italia'], dataMunicipality); //selectedItemPaises pot ser tots, per tant s'ha de mirar el codi del marc per veure que passa

  console.log('transformData.... ');
  const data = transformDataForChart(filteredData);
  const data2 = transformDataForChart(filteredData2);

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.safe_container}>
        <StatusBar barStyle='dark-content' backgroundColor='white' />
        <View style={styles.main_container}>
          {/*estadisticas*/}
          <View style={styles.cabecera}>
            <Text style={styles.textoCabecera}>{t('header')}</Text>
          </View>

          {/*ciudad*/}
          <View style={styles.sub_container}>
            <Text style={styles.titulos_morados}>{locality.name}</Text>
            <Text style={styles.subtitulo}>{locality.comunidad}</Text>
          </View>

          {/*nº turistas*/}
          <View style={styles.numeroTuristas_container}>
            <Text style={styles.titulos_morados}>{t('tourists')}</Text>
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
              <Grafica data={data} title={t('numTourists')} />
            ) : (
              <></>
            )}
          </View>

          {/*top paises*/}
          <View style={styles.sub_container}>
            <Text style={styles.titulos_morados}>{t('top')}</Text>
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
