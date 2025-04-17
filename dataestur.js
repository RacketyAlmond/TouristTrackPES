import Papa from 'papaparse';
import * as FileSystem from 'expo-file-system';
import 'fast-text-encoding';

const FILE_URI = FileSystem.documentDirectory + 'turismo_data.json';
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

const decodeISO88591 = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => String.fromCharCode(byte))
    .join('');
};

export const fetchCSV = async (callback, errorCallback) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(FILE_URI);

    if (fileInfo.exists) {
      const modifiedTime = new Date(fileInfo.modificationTime * 1000).getTime(); // seconds → ms
      const now = Date.now();

      if (now - modifiedTime < ONE_WEEK) {
        const content = await FileSystem.readAsStringAsync(FILE_URI);
        const parsed = JSON.parse(content);
        console.log('Usando datos guardados en archivo');
        callback(parsed);
        return;
      }
    }

    const url =
      'https://dataestur.azure-api.net/API-SEGITTUR-v1/TURISMO_RECEPTOR_MUN_PAIS_DL?CCAA=Todos&Provincia=Soria';

    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Error en la solicitud: ${resp.status}`);

    const buffer = await resp.arrayBuffer();
    const decodedText = decodeISO88591(buffer);
    const parsedData = Papa.parse(decodedText, { header: true }).data;

    await FileSystem.writeAsStringAsync(FILE_URI, JSON.stringify(parsedData), {
      encoding: FileSystem.EncodingType.UTF8,
    });

    console.log('Datos guardados en archivo');
    callback(parsedData);
  } catch (error) {
    console.error('Error obteniendo el CSV:', error);
    if (errorCallback) errorCallback(error);
  }
};

export const getDataOfMunicipality = (municipality, data) => {
  const filteredData = data.filter(
    (row) => row.MUNICIPIO_DESTINO === municipality,
  );
  return filteredData;
};

export const listOriginCountries = (data) => {
  const countryList = [];
  data.forEach((row) => {
    let country = row.PAIS_ORIGEN;
    if (
      country === 'Palestina. Estado Observador, no miembro de Naciones Unidas'
    )
      country = 'Palestina';
    if (
      country &&
      !countryList.includes(country) &&
      !country.includes('Total')
    ) {
      countryList.push(country);
    }
  });
  return countryList;
};

export const listMunicipalities = (data) => {
  const municipalityList = [];
  data.forEach((row) => {
    const municipality = row.MUNICIPIO_DESTINO;
    if (!municipalityList.includes(municipality)) {
      municipalityList.push(municipality);
    }
  });
  return municipalityList;
};

export const listYears = (data) => {
  const yearList = [];
  data.forEach((row) => {
    const year = row.AÑO;
    if (!yearList.includes(year)) {
      yearList.push(year);
    }
  });
  return yearList;
};

export const sumNumTourists = (data) => {
  const totalNum = data.reduce((total, row) => {
    const tourists = parseInt(row.TURISTAS);
    return total + tourists;
  }, 0);
  return totalNum;
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

export const getTouristMunicipalities = (data, countries) => {
  // Devuelve un objeto con los municipios y el número de turistas total de los países indicados

  const municipalityTourists = {};
  if (!data) return municipalityTourists;
  data.forEach((row) => {
    const municipality = row.MUNICIPIO_DESTINO;
    const country = row.PAIS_ORIGEN;
    const tourists = parseInt(row.TURISTAS);

    if (!municipality || !country || tourists === 0) return;
    if (!countries.includes(country)) return;

    if (!municipalityTourists[municipality]) {
      municipalityTourists[municipality] = 0;
    }

    municipalityTourists[municipality] += tourists;
  });

  return municipalityTourists;
};

export const getTotalTouristsOfMunicipality = (municipality, data) => {
  const filteredData = data.filter(
    (row) => row.MUNICIPIO_DESTINO === municipality,
  );
  const totalNum = filteredData.reduce((total, row) => {
    const tourists = parseInt(row.TURISTAS);
    return total + tourists;
  }, 0);
  return totalNum;
};

export const getTouristMunicipality = (municipality, data, countries) => {
  // Devuelve un objeto con los municipios y el número de turistas total de los países indicados
  if (!data) return 0;
  const filteredData = data.filter(
    (row) =>
      row.MUNICIPIO_DESTINO === municipality &&
      countries.includes(row.PAIS_ORIGEN),
  );
  const totalNum = filteredData.reduce((total, row) => {
    const tourists = parseInt(row.TURISTAS);
    return total + tourists;
  }, 0);
  return totalNum;
};
