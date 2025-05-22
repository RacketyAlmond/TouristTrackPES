// utils/api.js
import Constants from 'expo-constants';

const getBaseURL = () => {
  const debuggerHost = Constants.manifest?.debuggerHost;
  if (!debuggerHost) return 'http://localhost:3001'; // fallback

  //let ip = debuggerHost.split(':')[0];
  const ip = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  console.log(debuggerHost);

  return `http://${ip}:3001`;
};

export const API_BASE_URL = getBaseURL();
