// tests/UserContext.test.js

// 1) Suprime logs y errores globalmente
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

// 2) Mocks de firebaseConfig y firestore
jest.mock('../firebaseConfig.js', () => ({
  auth: { currentUser: { uid: 'user1' } },
  db: {},
}));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

const React = require('react');
const renderer = require('react-test-renderer');
const { act } = renderer;
const { UserProvider, useUser } = require('../components/atoms/UserContext.js');
let contextValue;
function TestConsumer() {
  contextValue = useUser();
  return null;
}

describe('Test UserContext que gestiona datos de usuario en Firestore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // asegura un usuario antes de cada test
    const { auth } = require('../firebaseConfig.js');
    auth.currentUser = { uid: 'user1' };
  });

  test('Given no user signed in then createUserData throws error', async () => {
    // given: sin usuario
    const firebaseConfig = require('../firebaseConfig.js');
    firebaseConfig.auth.currentUser = null;

    // mount
    await act(async () => {
      renderer.create(
        React.createElement(
          UserProvider,
          null,
          React.createElement(TestConsumer),
        ),
      );
    });

    // when / then
    await expect(
      contextValue.createUserData('John', '1990', 'NY', 'About me', 10),
    ).rejects.toThrow('No user is signed in');
  });

  test('Given valid user then createUserData sets userData from Firestore', async () => {
    // given: firestore devuelve datos y doc siempre retorna mismo ref
    const mockData = {
      firstName: 'Jane',
      birthday: '1985',
      userLocation: 'LA',
      about: 'Hello',
      points: 42,
    };
    const { doc, setDoc, getDoc } = require('firebase/firestore');
    doc.mockReturnValue('docRef1');
    setDoc.mockResolvedValue();
    getDoc.mockResolvedValue({ exists: () => true, data: () => mockData });

    // mount
    await act(async () => {
      renderer.create(
        React.createElement(
          UserProvider,
          null,
          React.createElement(TestConsumer),
        ),
      );
    });

    // when
    await act(async () => {
      await contextValue.createUserData(
        mockData.firstName,
        mockData.birthday,
        mockData.userLocation,
        mockData.about,
        mockData.points,
      );
    });

    // then
    expect(doc).toHaveBeenCalledWith(
      require('../firebaseConfig.js').db,
      'Users',
      'user1',
    );
    expect(setDoc).toHaveBeenCalledWith('docRef1', mockData);
    expect(getDoc).toHaveBeenCalledWith('docRef1');
    expect(contextValue.userData).toEqual(mockData);
  });

  test('Given valid user then updateUserData updates and sets userData', async () => {
    // given
    const updatedData = {
      firstName: 'Jake',
      birthday: '1992',
      userLocation: 'SF',
      about: 'Updated',
      points: 7,
    };
    const { doc, updateDoc, getDoc } = require('firebase/firestore');
    doc.mockReturnValue('docRef2');
    updateDoc.mockResolvedValue();
    getDoc.mockResolvedValue({ exists: () => true, data: () => updatedData });

    // mount
    await act(async () => {
      renderer.create(
        React.createElement(
          UserProvider,
          null,
          React.createElement(TestConsumer),
        ),
      );
    });

    // when
    await act(async () => {
      await contextValue.updateUserData(
        updatedData.firstName,
        updatedData.birthday,
        updatedData.userLocation,
        updatedData.about,
        updatedData.points,
      );
    });

    // then
    expect(doc).toHaveBeenCalledWith(
      require('../firebaseConfig.js').db,
      'Users',
      'user1',
    );
    expect(updateDoc).toHaveBeenCalledWith('docRef2', updatedData);
    expect(getDoc).toHaveBeenCalledWith('docRef2');
    expect(contextValue.userData).toEqual(updatedData);
  });

  test('Given valid user then getUserData fetches and sets userData', async () => {
    // given
    const fetchedData = { foo: 'bar' };
    const { doc, getDoc } = require('firebase/firestore');
    doc.mockReturnValue('docRef3');
    getDoc.mockResolvedValue({ exists: () => true, data: () => fetchedData });

    // mount
    await act(async () => {
      renderer.create(
        React.createElement(
          UserProvider,
          null,
          React.createElement(TestConsumer),
        ),
      );
    });

    // when
    await act(async () => {
      await contextValue.getUserData();
    });

    // then
    expect(doc).toHaveBeenCalledWith(
      require('../firebaseConfig.js').db,
      'Users',
      'user1',
    );
    expect(getDoc).toHaveBeenCalledWith('docRef3');
    expect(contextValue.userData).toEqual(fetchedData);
  });

  test('Given valid user then getUserPoints returns points', async () => {
    // given
    const pointData = { points: 99 };
    const { doc, getDoc } = require('firebase/firestore');
    doc.mockReturnValue('docRef4');
    getDoc.mockResolvedValue({ exists: () => true, data: () => pointData });

    // mount
    await act(async () => {
      renderer.create(
        React.createElement(
          UserProvider,
          null,
          React.createElement(TestConsumer),
        ),
      );
    });

    // when
    const points = await contextValue.getUserPoints();

    // then
    expect(doc).toHaveBeenCalledWith(
      require('../firebaseConfig.js').db,
      'Users',
      'user1',
    );
    expect(getDoc).toHaveBeenCalledWith('docRef4');
    expect(points).toBe(99);
  });

  test('Given no user signed in then getUserPoints throws error', async () => {
    // given: sin usuario
    const firebaseConfig = require('../firebaseConfig.js');
    firebaseConfig.auth.currentUser = null;

    // mount
    await act(async () => {
      renderer.create(
        React.createElement(
          UserProvider,
          null,
          React.createElement(TestConsumer),
        ),
      );
    });

    // when / then
    await expect(contextValue.getUserPoints()).rejects.toThrow(
      'No user is signed in',
    );
  });
});
