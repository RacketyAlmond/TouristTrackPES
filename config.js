import Constants from 'expo-constants';

//environment variable with fallback
export const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000';
