// __tests__/Grafica.test.js

// 1) Mock LineChart from react-native-chart-kit
import React from 'react';
import { act, create } from 'react-test-renderer';
import Grafica from '../components/molecules/grafica.js'; // ajusta la ruta si hace falta
import { Dimensions, Text, View } from 'react-native';

jest.mock('react-native-chart-kit', () => {
  const React = require('react');
  return {
    LineChart: (props) => React.createElement('LineChart', props),
  };
});

// No necesitamos mockear Dimensions.get porque screenWidth se calcula en el módulo

describe('Grafica component', () => {
  const sampleData = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{ data: [10, 20, 30] }],
  };
  const title = 'Ventas Mensuales';

  let tree;

  beforeEach(() => {
    jest.clearAllMocks();
    tree = create(<Grafica data={sampleData} title={title} />);
  });

  test('renders title inside a Text component', () => {
    const textNodes = tree.root.findAllByType(Text);
    expect(textNodes.length).toBeGreaterThan(0);
    const titleNode = textNodes[0];
    expect(titleNode.props.children).toBe(title);
    const style = titleNode.props.style;
    expect(style.textAlign).toBe('center');
    expect(style.fontSize).toBe(18);
  });

  test('renders LineChart with correct props', () => {
    const chart = tree.root.findByType('LineChart');
    // Compute expected width based on actual Dimensions
    const expectedWidth = Dimensions.get('window').width - 40;
    expect(chart.props.width).toBe(expectedWidth);
    expect(chart.props.height).toBe(220);
    expect(chart.props.data).toBe(sampleData);
    expect(chart.props.bezier).toBe(true);
    expect(chart.props.yAxisLabel).toBe('$');
    expect(chart.props.style).toEqual({
      alignSelf: 'center',
      borderRadius: 10,
    });
  });

  test('chartConfig properties behave as expected', () => {
    const chart = tree.root.findByType('LineChart');
    const config = chart.props.chartConfig;
    expect(config.decimalPlaces).toBe(0);
    expect(config.color(0.5)).toBe('rgba(75, 192, 192, 0.5)');
    expect(config.labelColor(1)).toBe('rgba(0, 0, 0, 1)');
    expect(config.propsForDots).toMatchObject({
      r: '4',
      strokeWidth: '2',
      stroke: '#4bc0c0',
    });
    expect(config.propsForLabels).toMatchObject({
      fontSize: 10,
      rotation: -45,
      textAnchor: 'middle',
    });
  });
});
