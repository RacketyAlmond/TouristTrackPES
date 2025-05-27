// Este archivo simplemente re-exporta la implementación correcta según la plataforma
import { Platform } from 'react-native';

let Map;
if (Platform.OS === 'web') {
  // Importación dinámica para web
  Map = require('./map.web').default;
} else {
  // Importación dinámica para plataformas nativas (iOS, Android)
  Map = require('./map.native').default;
}

export default Map;
