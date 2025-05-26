// __tests__/ForoSearchBar.test.js

import React from 'react';
import { act, create } from 'react-test-renderer';
import { TextInput, TouchableOpacity, View } from 'react-native';

import ForoSearchBar from '../components/molecules/foroSearchBar.js';

// 1) Mock vector icons properly using require inside factory
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    FontAwesome: (props) => React.createElement('FontAwesome', props),
    MaterialIcons: (props) => React.createElement('MaterialIcons', props),
  };
});

// 2) Mock Filter component
jest.mock('../components/molecules/filter.js', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props) => React.createElement('FilterMock', { ...props }),
  };
}); // ajusta la ruta si es necesario

describe('ForoSearchBar component', () => {
  let onSearch;
  let selectedCountries;
  let setSelectedCountries;
  let tree;

  beforeEach(() => {
    onSearch = jest.fn();
    selectedCountries = [];
    setSelectedCountries = jest.fn();
    jest.clearAllMocks();
    tree = create(
      <ForoSearchBar
        onSearch={onSearch}
        availableNationalities={['A']}
        selectedCountries={selectedCountries}
        setSelectedCountries={setSelectedCountries}
      />,
    );
  });

  test('renders placeholder and icons', () => {
    const input = tree.root.findByType(TextInput);
    expect(input.props.placeholder).toBe('Buscar pregunta...');
    // search icon should render as FontAwesome
    const icons = tree.root.findAllByType('FontAwesome');
    expect(icons.length).toBeGreaterThan(0);
  });

  test('calls onSearch and updates input on change', () => {
    const input = tree.root.findByType(TextInput);
    act(() => input.props.onChangeText('hello'));
    expect(onSearch).toHaveBeenCalledWith('hello');
    const updatedInput = tree.root.findByType(TextInput);
    expect(updatedInput.props.value).toBe('hello');
  });

  test('clear button appears and clears input', () => {
    const input = tree.root.findByType(TextInput);
    act(() => input.props.onChangeText('test'));
    // clear button is second TouchableOpacity
    const buttons = tree.root.findAllByType(TouchableOpacity);
    const clearBtn = buttons.find(
      (btn) =>
        btn.props.onPress && btn.props.style && btn.props.style.padding === 8,
    );
    act(() => clearBtn.props.onPress());
    expect(onSearch).toHaveBeenCalledWith('');
    const updatedInput = tree.root.findByType(TextInput);
    expect(updatedInput.props.value).toBe('');
  });

  test('filter toggles Filter component display', () => {
    let mocks = tree.root.findAllByType('FilterMock');
    expect(mocks.length).toBe(0);
    const buttons = tree.root.findAllByType(TouchableOpacity);
    const filterBtn = buttons.find(
      (btn) =>
        btn.props.onPress &&
        btn.props.style &&
        btn.props.style.marginLeft === 8,
    );
    act(() => filterBtn.props.onPress());
    mocks = tree.root.findAllByType('FilterMock');
    expect(mocks.length).toBe(1);
  });
});
