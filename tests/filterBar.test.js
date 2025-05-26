// __tests__/FilterBar.test.js

import React from 'react';
import { act, create } from 'react-test-renderer';
import { TextInput, FlatList, Vibration } from 'react-native';
import FilterBar from '../components/molecules/filterBar.js'; // ajusta la ruta si hace falta

// Suppress vibration
jest.spyOn(Vibration, 'vibrate').mockImplementation(() => {});

describe('FilterBar component', () => {
  const countriesWithFlags = [
    { name: 'Spain', flag: 'url-spain' },
    { name: 'France', flag: 'url-france' },
    { name: 'Germany', flag: 'url-germany' },
  ];

  let mockOnSelect;

  beforeEach(() => {
    mockOnSelect = jest.fn();
    jest.clearAllMocks();
  });

  test('Given searchTerm then FlatList.data is filtered excluding selectedCountries', () => {
    let tree;
    act(() => {
      tree = create(
        <FilterBar
          countriesWithFlags={countriesWithFlags}
          selectedCountries={[]}
          onSelect={mockOnSelect}
        />,
      );
    });

    // simula escribir "fr" → debería filtrar solo "France"
    const input = tree.root.findByType(TextInput);
    act(() => input.props.onChangeText('fr'));

    const flatList = tree.root.findByType(FlatList);
    expect(flatList.props.data).toEqual([
      { name: 'France', flag: 'url-france' },
    ]);
  });

  test('Given submitEditing with matches then onSelect is called and input & dropdown clear', () => {
    let tree;
    act(() => {
      tree = create(
        <FilterBar
          countriesWithFlags={countriesWithFlags}
          selectedCountries={[{ name: 'Germany', flag: 'url-germany' }]}
          onSelect={mockOnSelect}
        />,
      );
    });

    const input = tree.root.findByType(TextInput);
    // filtrar "s" → "Spain"
    act(() => input.props.onChangeText('s'));

    // verifica dropdown presence
    let allFlat = tree.root.findAllByType(FlatList);
    expect(allFlat).toHaveLength(1);
    expect(allFlat[0].props.data).toEqual([
      { name: 'Spain', flag: 'url-spain' },
    ]);

    // onSubmitEditing → should select first and clear
    act(() => input.props.onSubmitEditing());
    expect(mockOnSelect).toHaveBeenCalledWith({
      name: 'Spain',
      flag: 'url-spain',
    });
    expect(tree.root.findByType(TextInput).props.value).toBe('');

    // after submit, no dropdown
    allFlat = tree.root.findAllByType(FlatList);
    expect(allFlat).toHaveLength(0);
  });

  test('Given submitEditing with no matches then vibrate and textColor flashes', () => {
    jest.useFakeTimers();

    let tree;
    act(() => {
      tree = create(
        <FilterBar
          countriesWithFlags={countriesWithFlags}
          selectedCountries={[]}
          onSelect={mockOnSelect}
        />,
      );
    });

    const input = tree.root.findByType(TextInput);
    // filtrar sin coincidencias
    act(() => input.props.onChangeText('xyz'));
    expect(tree.root.findAllByType(FlatList)).toHaveLength(0);

    // onSubmitEditing → vibrate y color rojo
    act(() => input.props.onSubmitEditing());
    expect(Vibration.vibrate).toHaveBeenCalledWith(500);

    let style = tree.root.findByType(TextInput).props.style;
    style = Array.isArray(style) ? Object.assign({}, ...style) : style;
    expect(style.color).toBe('#c20303');

    // avanza 500ms
    act(() => jest.advanceTimersByTime(500));
    style = tree.root.findByType(TextInput).props.style;
    style = Array.isArray(style) ? Object.assign({}, ...style) : style;
    expect(style.color).toBe('black');
  });
});
