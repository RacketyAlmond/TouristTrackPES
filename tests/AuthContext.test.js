jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  updateProfile: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  setDoc: jest.fn(),
  doc: jest.fn(),
}));
jest.mock('../firebaseConfig.js', () => ({
  auth: {},
  db: {},
}));

const React = require('react');
const renderer = require('react-test-renderer');
const { act } = renderer;
const { AuthProvider, useAuth } = require('../components/atoms/AuthContext.js');
const { auth } = require('../firebaseConfig.js');
const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut: firebaseSignOut,
} = require('firebase/auth');

// TestConsumer para extraer useAuth()
let contextValue;
function TestConsumer() {
  contextValue = useAuth();
  return null;
}

describe('Test AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    contextValue = null;
  });

  test('Given valid email & password then signUp llama a createUserWithEmailAndPassword y devuelve el user', async () => {
    // given
    const fakeUser = { uid: 'abc123' };
    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: fakeUser });

    // when
    await act(async () => {
      renderer.create(
        React.createElement(
          AuthProvider,
          null,
          React.createElement(TestConsumer),
        ),
      );
    });
    const result = await contextValue.signUp('test@correo.com', 'secreto');

    // then
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      'test@correo.com',
      'secreto',
    );
    expect(result).toBe(fakeUser);
  });

  test('Given valid credentials then signIn llama a signInWithEmailAndPassword y devuelve el user', async () => {
    // given
    const fakeUser = { uid: 'user42' };
    signInWithEmailAndPassword.mockResolvedValueOnce({ user: fakeUser });

    // when
    await act(async () => {
      renderer.create(
        React.createElement(
          AuthProvider,
          null,
          React.createElement(TestConsumer),
        ),
      );
    });
    const result = await contextValue.signIn('user@ejemplo.com', '123456');

    // then
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      'user@ejemplo.com',
      '123456',
    );
    expect(result).toBe(fakeUser);
  });

  test('Given logout then llama a signOut y el user queda en null', async () => {
    // given
    firebaseSignOut.mockResolvedValueOnce();

    // when
    await act(async () => {
      renderer.create(
        React.createElement(
          AuthProvider,
          null,
          React.createElement(TestConsumer),
        ),
      );
    });
    await contextValue.logout();

    // then
    expect(firebaseSignOut).toHaveBeenCalledWith(auth);
    expect(contextValue.user).toBeNull();
  });

  test('Given updateProfileData sin user then arroja "No user is signed in"', async () => {
    // given: auth.currentUser undefined por mock de firebaseConfig

    // when / then
    await act(async () => {
      renderer.create(
        React.createElement(
          AuthProvider,
          null,
          React.createElement(TestConsumer),
        ),
      );
    });
    await expect(
      contextValue.updateProfileData('nombre', 'url'),
    ).rejects.toThrow('No user is signed in');
  });
});
