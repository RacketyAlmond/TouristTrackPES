// __tests__/Filter.test.js

// 1) Mock vector icons y utilidades antes de importar el componente
import React from 'react';
import { act, create } from 'react-test-renderer';
import { TouchableOpacity } from 'react-native';
import Filter from '../components/molecules/filter';

jest.mock('react-native-vector-icons/MaterialIcons', () => {
  const React = require('react');
  return (props) => React.createElement('MaterialIcons', props);
});
jest.mock('@expo/vector-icons', () => ({
  AntDesign: (props) => {
    const React = require('react');
    return React.createElement('AntDesign', props);
  },
}));
jest.mock('../utils', () => ({
  getCountryFlag: (country) => `flag://${country}`,
}));
// Mock minimal de FilterBar que llama onSelect al montar
jest.mock('../components/molecules/filterBar', () => {
  const React = require('react');
  return (props) => {
    React.useEffect(() => {
      if (props.countriesWithFlags.length) {
        props.onSelect(props.countriesWithFlags[0]);
      }
    }, [props.countriesWithFlags]);
    return React.createElement('FilterBarMock');
  };
});

describe('Filter component (minimal test)', () => {
  it('Given countryArray then applyFilters añade el país y cierra modal', () => {
    // given
    const countryArray = ['Spain'];
    let selected = [];
    const setSelected = jest.fn((newSel) => {
      selected = newSel;
    });

    // mount
    let tree;
    act(() => {
      tree = create(
        <Filter
          countryArray={countryArray}
          selectedCountries={selected}
          setSelectedCountries={setSelected}
        />,
      );
    });

    // find all TouchableOpacity instances
    const buttons = tree.root.findAllByType(TouchableOpacity);
    expect(buttons.length).toBeGreaterThan(0);

    const [addFilterBtn, ...rest] = buttons;

    // when: abrir modal
    act(() => addFilterBtn.props.onPress());

    // then: apply button es el último TouchOpac
    const allButtons = tree.root.findAllByType(TouchableOpacity);
    const applyBtn = allButtons[allButtons.length - 1];
    act(() => applyBtn.props.onPress());

    // finally: setSelectedCountries fue llamado con el país mockeado
    expect(setSelected).toHaveBeenCalledWith([
      { name: 'Spain', flag: 'flag://Spain' },
    ]);
  });
});
