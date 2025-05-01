import 'fast-text-encoding';

export const getSummaryData = async (countries = []) => {
  try {
    const baseUrl = 'http://192.168.1.102:3001/tourism/municipalities';

    // Si se pasa un array, lo convertimos a string tipo query
    const url =
      countries.length > 0
        ? `${baseUrl}?countries=${encodeURIComponent(countries.join(','))}`
        : baseUrl;

    console.log('url: ', url);
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Error en la solicitud: ${resp.status}`);
    const data = await resp.json();
    console.log('✅ Datos recibidos del backend');
    return data;
  } catch (error) {
    throw error;
  }
};

export const getDataOfMunicipality = async (municipality) => {
  try {
    const baseUrl = 'http://192.168.1.102:3001/tourism/municipality';

    // Si se pasa un array, lo convertimos a string tipo query
    const url = `${baseUrl}/${encodeURIComponent(municipality)}`;

    console.log('url: ', url);
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Error en la solicitud: ${resp.status}`);
    const data = await resp.json();
    console.log('✅ Datos recibidos del backend');
    return data;
  } catch (error) {
    throw error;
  }
};

export const listOriginCountries = async () => {
  try {
    const resp = await fetch(
      'http://192.168.1.102:3001/tourism/originCountries',
    );
    if (!resp.ok) throw new Error(`Error en la solicitud: ${resp.status}`);
    const data = await resp.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const listYearsOfMunicipality = (data) => {
  const yearList = [];
  data.forEach((row) => {
    const year = row.AÑO;
    if (!yearList.includes(year)) {
      yearList.push(year);
    }
  });
  return yearList;
};

export const listOriginCountriesOfMunicipality = (data) => {
  const countryList = [];
  data.forEach((row) => {
    const country = row.PAIS_ORIGEN;
    if (!countryList.includes(country)) {
      countryList.push(country);
    }
  });
  return countryList;
};

export const filterData = (years, months, originCountry, data) => {
  const filteredData = data.filter((row) => {
    const year = parseInt(row.AÑO);
    const month = parseInt(row.MES);
    return (
      (years.length === 0 || years.includes(year)) &&
      (originCountry.length === 0 || originCountry.includes(row.PAIS_ORIGEN)) &&
      (months.length === 0 || months.includes(month))
    );
  });
  return filteredData;
};

export const getTopCountries = (data, topN = 5) => {
  const countryTouristsMap = {};
  if (!data) return [];

  data.forEach((row) => {
    const country = row.PAIS_ORIGEN?.trim();
    const tourists = parseInt(row.TURISTAS) || 0;
    if (!country || country.startsWith('Total')) return;

    if (!countryTouristsMap[country]) {
      countryTouristsMap[country] = 0;
    }

    countryTouristsMap[country] += tourists;
  });

  // Convertir el objeto en un array de pares [país, total_turistas], ordenarlo y tomar los 5 primeros
  const topCountries = Object.entries(countryTouristsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([country]) => country);

  return topCountries;
};

export const getTotalTouristsOfMunicipality = (municipality, data) => {
  const result = data.find(
    (row) => row.MUNICIPIO_DESTINO.toLowerCase() === municipality.toLowerCase(),
  );
  return result ? result.total : 0;
};
