// components/molecules/filterBar.js

import React, { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';
// 1️⃣ Importa useTranslation
import { useTranslation } from 'react-i18next';

export default function FilterBar({
  countriesWithFlags,
  onSelect,
  selectedCountries,
}) {
  // 2️⃣ Obtén t() sin namespace (usa el por defecto)
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return countriesWithFlags;
    return countriesWithFlags.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, countriesWithFlags]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        // 3️⃣ Sustituye el texto fijo por t('filter.open')
        placeholder={t('filter.open')}
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelect(item)} style={styles.item}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 10,
  },
  input: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  list: {
    maxHeight: 150,
  },
  item: {
    padding: 10,
  },
});
