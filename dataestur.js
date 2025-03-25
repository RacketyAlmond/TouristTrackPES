import Papa from 'papaparse';
import 'fast-text-encoding';

const decodeISO88591 = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => String.fromCharCode(byte))
    .join('');
};

export const fetchCSV = (callback, errorCallback) => {
  const url =
    'https://dataestur.azure-api.net/API-SEGITTUR-v1/TURISMO_RECEPTOR_MUN_PAIS_DL?CCAA=Todos&Provincia=Cantabria';
  fetch(url)
    .then((resp) => {
      if (!resp.ok) throw new Error(`Error en la solicitud: ${resp.status}`);
      return resp.arrayBuffer();
    })
    .then((data) => {
      const decodedText = decodeISO88591(data);

      const parsedData = Papa.parse(decodedText, { header: true });
      console.log(parsedData.data);

      callback(parsedData.data); // Llamamos al callback con los datos
    })
    .catch((error) => {
      console.error('Error obteniendo el CSV:', error);
      if (errorCallback) errorCallback(error); // Si hay un callback de error, lo llamamos
    });
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
    const country = row.PAIS_ORIGEN;
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
