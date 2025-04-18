import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Filter from './filter';

export default function ForoSearchBar({
  onSearch,
  availableNationalities,
  selectedCountries,
  setSelectedCountries,
}) {
  const [searchText, setSearchText] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const handleSearch = useCallback(
    (text) => {
      setSearchText(text);
      onSearch(text);
    },
    [onSearch],
  );

  const clearSearch = useCallback(() => {
    setSearchText('');
    onSearch('');
  }, [onSearch]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <FontAwesome name='search' size={20} color='#333' />
        <TextInput
          style={styles.input}
          placeholder='Buscar mensajes...'
          value={searchText}
          onChangeText={handleSearch}
        />
        {searchText ? (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <FontAwesome name='times-circle' size={18} color='#888' />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={() => setFilterVisible(!filterVisible)}
          style={styles.filterButton}
        >
          <MaterialIcons
            name='filter-list'
            size={24}
            color={selectedCountries.length > 0 ? '#0066cc' : '#888'}
          />
        </TouchableOpacity>
      </View>

      {filterVisible && (
        <Filter
          countryArray={availableNationalities}
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 20 : 10,
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
    paddingVertical: 5,
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
    marginTop: 5,
  },
  clearButton: {
    padding: 8,
  },
  filterButton: {
    marginLeft: 8,
    padding: 5,
  },
});
