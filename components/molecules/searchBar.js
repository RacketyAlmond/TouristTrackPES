import React, { useState, useMemo, useCallback } from 'react';
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

const LOCALITIES = [
  { name: 'Madrid' },
  { name: 'Barcelona' },
  { name: 'Valencia' },
  { name: 'Seville' },
  { name: 'Zaragoza' },
];

export default function SearchBar({
  onSearch,
  availableNacionalities,
  selectedCountries,
  setSelectedCountries,
}) {
  const [searchText, setSearchText] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  /*const availableNacionalities = [
    'Alemania',
    'Francia',
    'Italia',
    'Portugal',
    'Reino Unido',
    'Suecia',
    'Suiza',
    'Perú',
  ];*/

  const filteredLocalities = useMemo(() => {
    if (!searchText) return [];
    return LOCALITIES.filter((locality) =>
      locality.name.toLowerCase().startsWith(searchText.toLowerCase()),
    );
  }, [searchText]);

  const handleSearch = useCallback((text) => setSearchText(text), []);

  const handleSelectLocality = useCallback(
    (locality) => {
      onSearch(locality.name);
      setSearchText(locality.name);
    },
    [onSearch],
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <FontAwesome name='search' size={20} color='black' />
        <TextInput
          style={styles.input}
          placeholder='Search for a locality in Spain'
          value={searchText}
          onChangeText={handleSearch}
          onSubmitEditing={() =>
            searchText.trim() && onSearch(searchText.trim())
          }
        />
        <TouchableOpacity onPress={() => setFilterVisible(!filterVisible)}>
          <MaterialIcons name='filter-list' size={24} color='blue' />
        </TouchableOpacity>
      </View>
      {filterVisible && (
        <Filter
          countryArray={availableNacionalities}
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
        />
      )}
      {filteredLocalities.length > 0 && (
        <ScrollView style={styles.results}>
          {filteredLocalities.map((locality) => (
            <TouchableOpacity
              key={locality.name}
              style={styles.countryButton}
              onPress={() => handleSelectLocality(locality)}
            >
              <Text style={styles.countryName}>{locality.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
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
