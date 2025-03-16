import { StyleSheet, View } from 'react-native';
import SearchBar from './components/organisms/searchBar';

export default function App() {
  const handleSelectCountry = (country) => {
    console.log(`Selected country: ${country.name}`);
  };

  return (
    <View style={styles.container}>
      <SearchBar onSelectCountry={handleSelectCountry} />
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
