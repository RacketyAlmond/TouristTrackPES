import React, { useEffect, useState } from 'react';
import { Circle } from 'react-native-maps';
import { getCoordinatesFromCity } from '../../utils';

export default function Area({ municipi, numTuristes }) {
  const [coordinates, setCoordinates] = useState(null);

  const minOpacity = 0.5;
  const maxOpacity = 0.85;
  const minRadius = 20;
  const maxRadius = 80;
  const maxTuristes = 100000000;

  function scaleLog(value, min, max) {
    value = Math.max(value, 1);
    min = Math.max(min, 1);
    const logMin = Math.log(min);
    const logMax = Math.log(max);
    const logValue = Math.log(value);
    return (logValue - logMin) / (logMax - logMin);
  }

  function interpolate(a, b, t) {
    const ah = a.replace('#', '');
    const bh = b.replace('#', '');
    const ar = parseInt(ah.substring(0, 2), 16),
      ag = parseInt(ah.substring(2, 4), 16),
      ab = parseInt(ah.substring(4, 6), 16);
    const br = parseInt(bh.substring(0, 2), 16),
      bg = parseInt(bh.substring(2, 4), 16),
      bb = parseInt(bh.substring(4, 6), 16);
    const rr = Math.round(ar + (br - ar) * t);
    const rg = Math.round(ag + (bg - ag) * t);
    const rb = Math.round(ab + (bb - ab) * t);
    return `rgb(${rr},${rg},${rb})`;
  }

  function interpolateColor(value, min, max) {
    const t = scaleLog(value, min, max);
    if (t < 0.33) {
      const ratio = t / 0.33;
      return interpolate('#3DD598', '#F7B801', ratio);
    } else if (t < 0.66) {
      const ratio = (t - 0.33) / 0.33;
      return interpolate('#F7B801', '#FA8B14', ratio);
    } else {
      const ratio = (t - 0.66) / 0.34;
      return interpolate('#FA8B14', '#FF0000', ratio);
    }
  }

  const t = scaleLog(numTuristes, 1, maxTuristes);
  const opacity = minOpacity + t * (maxOpacity - minOpacity);
  const fillColor = interpolateColor(numTuristes, 1, maxTuristes);
  const r = minRadius + t * (maxRadius - minRadius);

  useEffect(() => {
    const buscarCiudad = async (cityName) => {
      const result = await getCoordinatesFromCity(cityName);
      if (result) {
        setCoordinates({
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
        });
      }
    };

    if (municipi) {
      buscarCiudad(municipi);
    }
  }, [municipi]); // Se ejecuta cuando cambia 'municipi'

  // Mientras se cargan las coordenadas, no renderizamos el círculo
  if (!coordinates || !numTuristes) {
    return null;
  }

  return (
    <Circle
      center={coordinates}
      radius={5000}
      strokeWidth={0}
      fillColor={`rgba(${fillColor.match(/\d+/g).join(',')},${opacity})`}
    />
  );
}
