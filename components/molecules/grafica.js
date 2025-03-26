import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, Text } from 'react-native';

const screenWidth = Dimensions.get('window').width - 40;

const Grafica = ({ data, title }) => {
  return (
    <View style={{ marginVertical: 10, alignItems: 'center' }}>
      <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 10 }}>
        {title}
      </Text>

      <LineChart
        data={data}
        width={screenWidth}
        height={220}
        yAxisLabel='$'
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: { r: '4', strokeWidth: '2', stroke: '#4bc0c0' },
          propsForLabels: { fontSize: 10, rotation: -45, textAnchor: 'start' }, // Ajusta la inclinación
        }}
        bezier
        style={{ marginHorizontal: 20, borderRadius: 10 }}
      />
    </View>
  );
};

export default Grafica;
