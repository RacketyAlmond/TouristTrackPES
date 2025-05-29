import cca2countries from 'i18n-iso-countries';
cca2countries.registerLocale(require('i18n-iso-countries/langs/es.json'));

export const getCoordinatesFromCity = async (cityName) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&countrycodes=es`,
      {
        headers: {
          'User-Agent': 'TourisTrack/1.0 (sergi.font.jane@estudiantat.upc.edu)',
        },
      },
    );
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      const { lat, lon, name } = data[0];
      return { lat, lon, name };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener las coordenadas:', error);
    return null;
  }
};

export const getCountryFlag = (countryName) => {
  let cca2 = cca2countries.getAlpha2Code(countryName, 'es');
  if (countryName === 'Estados Unidos de América') cca2 = 'US';
  else if (countryName === 'República Eslovaca') cca2 = 'SK';
  else if (countryName === 'Corea') cca2 = 'KR';
  else if (countryName === 'Arabia Saudí') cca2 = 'SA';
  else if (countryName === 'Bahréin') cca2 = 'BH';
  else if (countryName === 'Kazajstán') cca2 = 'KZ';
  else if (countryName === 'Qatar') cca2 = 'QA';
  else if (countryName === 'Belarús') cca2 = 'BY';
  else if (countryName === 'Mali') cca2 = 'ML';
  else if (countryName === 'Siria') cca2 = 'SY';
  else if (countryName === 'Swazilandia') cca2 = 'SZ';
  else if (countryName === 'República Democrática del Congo') cca2 = 'CG';
  else if (countryName === 'Zimbabwe') cca2 = 'ZW';
  else if (countryName === 'Malawi') cca2 = 'MW';
  else if (countryName === 'Papúa Nueva Guinea') cca2 = 'PG';
  else if (countryName === 'Guinea-Bissau') cca2 = 'GW';
  else if (countryName === 'Surinam') cca2 = 'SR';
  if (!cca2) {
    console.warn(`No se encontró la bandera de ${countryName}`);
    return null;
  }
  return `https://flagcdn.com/w320/${cca2.toLowerCase()}.png`;
};
