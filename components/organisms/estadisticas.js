import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import cca2countries from 'i18n-iso-countries';

cca2countries.registerLocale(require('i18n-iso-countries/langs/es.json'));

export default function Estadisticas() {
  //primer desplegable nº turistas (años)
  const [selectedItemAnos, setSelectedItemAnos] = useState('1 año');
  const opcionesAnos = [
    { label: '1 año', value: '1 año' },
    { label: '2 años', value: '2 años' },
    { label: '3 años', value: '3 años' },
    { label: '4 años', value: '4 años' },
    { label: '5 años', value: '5 años' },
  ];

  //segundo desplegable nº turistas (paises)
  const [selectedItemPaises, setSelectedItemPaises] =
    useState('Todos los países');
  const opcionesPaises = [
    { label: 'Todos los países', value: 'Todos los países' },
    { label: 'España', value: 'España' },
    { label: 'Italia', value: 'Italia' },
    { label: 'Francia', value: 'Francia' },
    { label: 'Alemania', value: 'Alemania' },
    { label: 'Suiza', value: 'Suiza' },
  ];

  //top paises
  const topPaises = ['España', 'Italia', 'Francia', 'Alemania', 'Suiza'];

  //funcion para obtener la bandera en .png
  const getCountryFlag = (countryName) => {
    const cca2 = cca2countries.getAlpha2Code(countryName, 'es');
    if (!cca2) {
      console.warn(`No se encontró la bandera de ${countryName}`);
      return null;
    }
    return `https://flagcdn.com/w320/${cca2.toLowerCase()}.png`;
  };

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

  return (
    <View style={styles.main_container}>
      {/*estadisticas*/}
      <View style={styles.cabecera}>
        <Text style={styles.textoCabecera}>Estadísticas</Text>
      </View>

      {/*ciudad*/}
      <View style={styles.sub_container}>
        <Text style={styles.titulos_morados}>Barcelona</Text>
        <Text style={styles.subtitulo}>Cataluña</Text>
      </View>

      {/*nº turistas*/}
      <View style={styles.numeroTuristas_container}>
        <Text style={styles.titulos_morados}>Nº de turistas</Text>
        <Picker
          selectedValue={selectedItemAnos}
          onValueChange={(itemValue) => setSelectedItemAnos(itemValue)}
          style={styles.pickerAno}
        >
          {opcionesAnos.map((opcionAno) => (
            <Picker.Item
              key={opcionAno.value}
              label={opcionAno.label}
              value={opcionAno.value}
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
              key={opcionPais.value}
              label={opcionPais.label}
              value={opcionPais.value}
            />
          ))}
        </Picker>
      </View>

      {/*top paises*/}
      <View style={styles.sub_container}>
        <Text style={styles.titulos_morados}>Top países de los visitantes</Text>
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
              key={opcionAno.value}
              label={opcionAno.label}
              value={opcionAno.value}
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
              key={opcionPais.value}
              label={opcionPais.label}
              value={opcionPais.value}
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
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    position: 'absolute',
  },
  sub_container: {
    padding: 10,
  },
  numeroTuristas_container: {
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
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
    width: 65,
    backgroundColor: '#dddddd',
    borderRadius: 5,
  },
  pickerPais: {
    width: 125,
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
