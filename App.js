import { StyleSheet, View } from 'react-native';
import SearchBar from './components/organisms/searchBar';
import React, { useState } from 'react';
import Map from './components/organisms/map';

export default function App() {
  const [selectedLocality, setSelectedLocality] = useState(null);

  const handleSelectLocality = (locality) => {
    setSelectedLocality(locality);
  };

  return (
    <View style={styles.container}>
      <Map selectedLocality={selectedLocality} />
      <SearchBar onSelectLocality={handleSelectLocality} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
