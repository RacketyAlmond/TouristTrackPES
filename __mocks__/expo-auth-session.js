// __mocks__/expo-auth-session.js
export const providers = {
  google: () => ({ promptAsync: jest.fn() }),
};

export const startAsync = jest.fn();
