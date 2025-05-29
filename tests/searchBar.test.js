// __tests__/SearchBar.test.js

// 1) Mocks de iconos y Filter antes de importar el componente
// 2) Imports después de los mocks
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { TextInput, TouchableOpacity, ScrollView, Text } from 'react-native';
import SearchBar from '../components/molecules/searchBar.js';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      if (key === 'search.placeholder') return 'Search for a locality in Spain';
      return key;
    },
  }),
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    FontAwesome: (props) => React.createElement('FontAwesome', props),
    MaterialIcons: (props) => React.createElement('MaterialIcons', props),
  };
});

jest.mock('../components/molecules/filter.js', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props) => React.createElement('FilterMock', props),
  };
});

// Datos de prueba constantes
const AVAILABLE = ['ES', 'FR'];

describe('SearchBar component', () => {
  let onSearch;
  let selectedCountries;
  let setSelectedCountries;
  let tree;

  beforeEach(() => {
    onSearch = jest.fn();
    selectedCountries = [];
    setSelectedCountries = jest.fn();
    jest.clearAllMocks();
    tree = renderer.create(
      <SearchBar
        onSearch={onSearch}
        availableNacionalities={AVAILABLE}
        selectedCountries={selectedCountries}
        setSelectedCountries={setSelectedCountries}
      />,
    );
  });

  it('renders placeholder and icons', () => {
    const input = tree.root.findByType(TextInput);
    expect(input.props.placeholder).toBe('Search for a locality in Spain');
    expect(tree.root.findAllByType('FontAwesome').length).toBe(1);
    expect(tree.root.findAllByType('MaterialIcons').length).toBe(1);
  });

  it('toggles FilterMock display when pressing filter icon', () => {
    let mocks = tree.root.findAllByType('FilterMock');
    expect(mocks.length).toBe(0);
    const filterBtn = tree.root.findAllByType(TouchableOpacity)[0];
    act(() => filterBtn.props.onPress());
    mocks = tree.root.findAllByType('FilterMock');
    expect(mocks.length).toBe(1);
  });

  it('filters LOCALITIES based on input and shows results', () => {
    const input = tree.root.findByType(TextInput);
    act(() => input.props.onChangeText('b'));

    const scrolls = tree.root.findAllByType(ScrollView);
    expect(scrolls.length).toBe(1);

    const buttons = tree.root.findAllByType(TouchableOpacity).slice(1); // skip filter btn
    const names = buttons.map((btn) => btn.findByType(Text).props.children);
    expect(names).toContain('Barcelona');
  });

  it('selecting a locality calls onSearch and updates input value', () => {
    const input = tree.root.findByType(TextInput);
    act(() => input.props.onChangeText('ma'));

    const buttons = tree.root.findAllByType(TouchableOpacity).slice(1);
    const madridBtn = buttons.find(
      (btn) => btn.findByType(Text).props.children === 'Madrid',
    );

    act(() => madridBtn.props.onPress());

    expect(onSearch).toHaveBeenCalledWith('Madrid');
    const updated = tree.root.findByType(TextInput);
    expect(updated.props.value).toBe('Madrid');
  });
});
