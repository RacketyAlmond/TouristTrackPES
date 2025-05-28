export default {
  preset: 'react-native',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest',
    '^.+\\.cjs$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
      '|@react-native' +
      '|@react-navigation' +
      '|react-native-maps' +
      '|firebase' +
      '|@testing-library/react-native' +
      '|expo' +
      '|expo-app-loading' +
      '|expo-asset' +
      '|expo-constants' +
      '|expo-font' +
      '|expo-linking' +
      '|expo-location' +
      '|expo-modules-core' +
      '|expo-notifications' +
      '|expo-status-bar' +
      '|expo-auth-session' +
      '|expo-web-browser' +
      '|expo-application' +
      '|@expo/vector-icons' +
      '|react-native-vector-icons' +
      '|date-fns)/)',
  ],

  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'mjs',
    'cjs',
    'json',
    'node',
  ],
};
