import Title from '../atoms/title';
import {
  View,
  ScrollView,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native';

export default function IndexForos() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        margin: 10,
      }}
    >
      <Title
        style={{
          fontSize: 100,
        }}
        title='Foro'
      />
    </SafeAreaView>
  );
}
