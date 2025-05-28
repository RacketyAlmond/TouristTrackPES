// tests/area.test.js
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import Area from '../components/atoms/area.js';
import { getCoordinatesFromCity } from '../utils.js';
import { Circle } from 'react-native-maps';

// mock de react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  return {
    Circle: ({ center, radius, strokeWidth, fillColor }) =>
      React.createElement('Circle', { center, radius, strokeWidth, fillColor }),
  };
});

// mock de la utilidad
jest.mock('../utils.js', () => ({
  getCoordinatesFromCity: jest.fn(),
}));

describe('Test component Area que renderiza un Circle según municipi y numTuristes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given municipi y numTuristes válidos then renderiza Circle con las props correctas', async () => {
    // given
    getCoordinatesFromCity.mockResolvedValueOnce({
      lat: '41.3828939',
      lon: '2.1774322',
    });
    const municipi = 'Barcelona';
    const numTuristes = 500000;

    let tree;
    // when
    await act(async () => {
      tree = renderer.create(
        <Area municipi={municipi} numTuristes={numTuristes} />,
      );
      // espera la siguiente actualización del hook useEffect
      await Promise.resolve();
    });

    // then
    const circle = tree.root.findByType(Circle);
    expect(getCoordinatesFromCity).toHaveBeenCalledWith(municipi);
    expect(circle.props.center).toEqual({
      latitude: 41.3828939,
      longitude: 2.1774322,
    });
    const expectedOpacity = numTuristes / 1000000;
    expect(circle.props.fillColor).toBe(
      `rgba(250, 185, 140, ${expectedOpacity})`,
    );
    expect(circle.props.radius).toBe(5000);
    expect(circle.props.strokeWidth).toBe(0);
  });

  test('Given municipi inválido then no renderiza Circle', async () => {
    // given
    getCoordinatesFromCity.mockResolvedValueOnce(null);
    const municipi = 'CiudadDesconocida';
    const numTuristes = 1000;

    let tree;
    // when
    await act(async () => {
      tree = renderer.create(
        <Area municipi={municipi} numTuristes={numTuristes} />,
      );
      await Promise.resolve();
    });

    // then
    expect(() => tree.root.findByType(Circle)).toThrow();
  });

  test('Given municipi vacío then no llama a fetch ni renderiza Circle', () => {
    // given
    const municipi = '';
    const numTuristes = 2000;

    // when
    const tree = renderer.create(
      <Area municipi={municipi} numTuristes={numTuristes} />,
    );

    // then
    expect(getCoordinatesFromCity).not.toHaveBeenCalled();
    expect(() => tree.root.findByType(Circle)).toThrow();
  });

  test('Given numTuristes mayor que el máximo then la opacidad se limita a 1', async () => {
    // given
    getCoordinatesFromCity.mockResolvedValueOnce({ lat: '0', lon: '0' });
    const municipi = 'TestCity';
    const numTuristes = 2000000;

    let tree;
    // when
    await act(async () => {
      tree = renderer.create(
        <Area municipi={municipi} numTuristes={numTuristes} />,
      );
      await Promise.resolve();
    });

    // then
    const circle = tree.root.findByType(Circle);
    expect(circle.props.fillColor).toBe('rgba(250, 185, 140, 1)');
  });
});
