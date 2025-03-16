import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Map from './components/organisms/map';
import SearchBar from './components/organisms/searchBar';
import InfoLocalidad from './components/organisms/InfoLocalidad';

export default function App() {
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const handleSelectLocality = (locality) => {
    setSelectedLocality(locality);
    setSelectedCity(locality);
  };

  const handleCloseInfoLocalidad = () => {
    setSelectedCity(null);
  };

  return (
    <View style={styles.container}>
      <Map
        selectedLocality={selectedLocality}
        onSelectLocality={handleSelectLocality}
      />
      <SearchBar onSelectLocality={handleSelectLocality} />
      {selectedCity && (
        <InfoLocalidad
          locality={selectedCity}
          onClose={handleCloseInfoLocalidad}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
