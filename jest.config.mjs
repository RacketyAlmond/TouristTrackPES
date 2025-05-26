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
      '|@react-navigation' + // ⬅️ añade esto
      '|react-native-maps' +
      '|firebase' +
      '|@testing-library/react-native' +
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
