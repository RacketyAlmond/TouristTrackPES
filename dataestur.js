import Papa from 'papaparse';
import * as FileSystem from 'expo-file-system';
import 'fast-text-encoding';

const FILE_URI = FileSystem.documentDirectory + 'turismo_data.csv';
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

const decodeISO88591 = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => String.fromCharCode(byte))
    .join('');
};

export const fetchCSV = async (callback, errorCallback) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(FILE_URI);
    console.log('Tamaño en bytes:', fileInfo.size);

    if (fileInfo.exists) {
      const modifiedTime = new Date(fileInfo.modificationTime * 1000); // Ahora es un objeto Date
      const now = new Date(); // También un objeto Date

      const modifiedTimeCalc = new Date(
        fileInfo.modificationTime * 1000,
      ).getTime(); // en ms
      const nowCalc = Date.now(); // también en ms

      console.log('Fecha de modificación:', modifiedTime.toLocaleString());
      console.log('Ahora:', now.toLocaleString());

      console.log('modifiedTime.getDate(): ', modifiedTimeCalc);
      console.log('Date.now():', nowCalc);

      //si ha pasaado mas de una semana desde la última modificación, actualiza el archivo
      if (nowCalc - modifiedTimeCalc > ONE_WEEK) {
        console.log(
          'Date.now() - modifiedTime.getDate(): ',
          nowCalc - modifiedTimeCalc,
        );
        console.log('ONE_WEEK: ', ONE_WEEK);

        const url =
          'https://dataestur.azure-api.net/API-SEGITTUR-v1/TURISMO_RECEPTOR_MUN_PAIS_DL?CCAA=Todos&Provincia=Todos';

        console.log('fetching...');
        const resp = await fetch(url);
        //console.log('textowww: ', resp.text());
        if (!resp.ok) throw new Error(`Error en la solicitud: ${resp.status}`);

        console.log(resp);
        const buffer = await resp.arrayBuffer();
        //console.log('decoding...');
        const decodedText = decodeISO88591(buffer);
        console.log('writing............');

        await FileSystem.writeAsStringAsync(FILE_URI, decodedText, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        console.log('Datos guardados en archivo');

        console.log('parsing...');
        const parsedData = Papa.parse(decodedText, { header: true }).data;

        console.log('normalizando...');
        const normalizedData = normalizarMunicipios(parsedData);

        callback(normalizedData);
      } else {
        console.log('Leyendo archivo local...');
        const content = await FileSystem.readAsStringAsync(FILE_URI);

        console.log('parsing...');
        const parsedData = Papa.parse(content, { header: true }).data;

        console.log('normalizando...');
        const normalizedData = normalizarMunicipios(parsedData);

        callback(normalizedData);
      }
    }
  } catch (error) {
    console.error('Error obteniendo el CSV:', error);
    if (errorCallback) errorCallback(error);
  }
};

export const getDataOfMunicipality = (municipality, data) => {
  const filteredData = data.filter(
    (row) => row.MUNICIPIO_DESTINO.toLowerCase() === municipality.toLowerCase(),
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
    (row) => row.MUNICIPIO_DESTINO.toLowerCase() === municipality.toLowerCase(),
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
      row.MUNICIPIO_DESTINO.toLowerCase() === municipality.toLowerCase() &&
      countries.includes(row.PAIS_ORIGEN),
  );
  const totalNum = filteredData.reduce((total, row) => {
    const tourists = parseInt(row.TURISTAS);
    return total + tourists;
  }, 0);
  return totalNum;
};

const formatearMunicipio = (nombre) => {
  if (!nombre) return '';
  if (nombre.includes(',')) {
    const [principal, articulo] = nombre.split(',').map((s) => s.trim());
    return `${articulo} ${principal}`;
  }
  return nombre;
};

const normalizarMunicipios = (data) => {
  return data.map((item) => ({
    ...item,
    MUNICIPIO_DESTINO: formatearMunicipio(item.MUNICIPIO_DESTINO),
  }));
};
