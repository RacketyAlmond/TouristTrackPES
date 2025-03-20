import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Filter from './filter';

const localities = [
  { name: 'Madrid' },
  { name: 'Barcelona' },
  { name: 'Valencia' },
  { name: 'Seville' },
  { name: 'Zaragoza' },
  // Agrega más localidades según sea necesario
];

export default function SearchBar({ onSearch }) {
  const [searchText, setSearchText] = useState('');
  const [filteredLocalities, setFilteredLocalities] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [filterDescriptionVisible, setFilterDescriptionVisible] =
    useState(false);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = localities.filter((locality) =>
        locality.name.toLowerCase().startsWith(text.toLowerCase()),
      );
      setFilteredLocalities(filtered);
    } else {
      setFilteredLocalities([]);
    }
  };

  const handleSelectLocality = (locality) => {
    onSearch(locality.name);
    setSearchText(locality.name);
    setFilteredLocalities([]);
  };

  const handleSubmitEditing = () => {
    if (searchText.trim() !== '') {
      onSearch(searchText.trim());
      setFilteredLocalities([]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <FontAwesome name='search' size={20} color='black' />
        <TextInput
          style={styles.input}
          placeholder='Search for a locality in Spain'
          value={searchText}
          onChangeText={handleSearch}
          onSubmitEditing={handleSubmitEditing}
        />
        <TouchableOpacity
          onPress={() => setFilterDescriptionVisible(!filterDescriptionVisible)}
        >
          <MaterialIcons name='filter-list' size={24} color='blue' />
        </TouchableOpacity>
      </View>
      {filteredLocalities.length > 0 && (
        <ScrollView vertical style={styles.results}>
          {filteredLocalities.map((locality, index) => (
            <TouchableOpacity
              key={index}
              style={styles.countryButton}
              onPress={() => handleSelectLocality(locality)}
            >
              <Text style={styles.countryName}>{locality.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <Filter
        selectedCountries={selectedCountries}
        setSelectedCountries={setSelectedCountries}
        filterDescriptionVisible={filterDescriptionVisible}
        setFilterDescriptionVisible={setFilterDescriptionVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    width: '100%',
    alignItems: 'center',
    zIndex: 1, //muestra encima del mapa
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    outlineStyle: 'none',
  },
  results: {
    marginTop: 20,
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  countryName: {
    fontSize: 16,
  },
});
