// components/molecules/SearchBar.js

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Platform,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Filter from './filter';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const filteredLocalities = useMemo(() => {
    if (!searchText) return [];
    return LOCALITIES.filter((l) =>
      l.name.toLowerCase().startsWith(searchText.toLowerCase()),
    );
  }, [searchText]);

  const handleSearch = useCallback((text) => {
    setSearchText(text);
  }, []);

  const handleSelectLocality = useCallback(
    (loc) => {
      onSearch(loc.name);
      setSearchText(loc.name);
    },
    [onSearch],
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <FontAwesome name='search' size={20} color='black' />
        <TextInput
          style={styles.input}
          placeholder={t('search.placeholder')}
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
          {filteredLocalities.map((l) => (
            <TouchableOpacity
              key={l.name}
              style={styles.countryButton}
              onPress={() => handleSelectLocality(l)}
            >
              <Text style={styles.countryName}>{l.name}</Text>
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
    top: Platform.OS === 'ios' ? 80 : 40,
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
  },
  results: {
    marginTop: 5,
    width: '90%',
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  countryName: {
    fontSize: 16,
  },
});
