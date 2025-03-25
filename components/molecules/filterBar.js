/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Image,
} from 'react-native';

const normalizeString = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

const FilterBar = ({ countriesWithFlags, onSelect, selectedCountries }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [textColor, setTextColor] = useState('black');

  const handleSearchChange = (text) => {
    setSearchTerm(text);
    if (text.length > 0) {
      const normalizedText = normalizeString(text);
      const filtered = countriesWithFlags.filter(
        (country) =>
          normalizeString(country.name).includes(normalizedText) &&
          !selectedCountries.some(
            (selectedCountry) => selectedCountry.name === country.name,
          ),
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  };

  const handleSelect = (country) => {
    onSelect(country);
    setSearchTerm('');
    setFilteredOptions([]);
  };

  const handleSubmit = () => {
    if (filteredOptions.length > 0) {
      handleSelect(filteredOptions[0]);
    } else {
      setTextColor('#c20303');
      Vibration.vibrate(500);
      setTimeout(() => setTextColor('black'), 500);
    }
  };

  return (
    <View>
      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder='Search country...'
        value={searchTerm}
        onChangeText={handleSearchChange}
        onSubmitEditing={handleSubmit}
      />
      {filteredOptions.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredOptions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelect(item)}
              >
                <Image
                  source={{ uri: item.flag }}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    //sino minWith 80%, pero se ve peor
    width: 200,
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 40,
    backgroundColor: 'white',
  },
  dropdown: {
    //sino minWith 80%, pero se ve peor
    backgroundColor: 'white',
    width: 200,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginTop: 5,
    maxHeight: 150,
  },
  dropdownItem: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
});

export default FilterBar;
