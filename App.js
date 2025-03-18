import { StyleSheet, View, SafeAreaView } from 'react-native';
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
    <SafeAreaView style={styles.container}>
      <Map />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
