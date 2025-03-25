import { StyleSheet, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Map from './components/organisms/map';
import { fetchCSV } from './dataestur';

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchCSV(
      (fetchedData) => {
        console.log('Datos obtenidos:', fetchedData);
        setData(fetchedData);
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
      },
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Map data={data} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
