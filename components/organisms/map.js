import { Platform } from 'react-native';

let Map;
if (Platform.OS === 'web') {
  Map = require('./map.web').default;
} else {
  Map = require('./map.native').default;
}

export default Map;
