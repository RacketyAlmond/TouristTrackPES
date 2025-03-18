import Papa from 'papaparse';

export const fetchCSV = (callback, errorCallback) => {
  const url =
    'https://dataestur.azure-api.net/API-SEGITTUR-v1/TURISMO_RECEPTOR_MUN_PAIS_DL?CCAA=Todos&Provincia=Cantabria';
  fetch(url)
    .then((resp) => {
      if (!resp.ok) throw new Error(`Error en la solicitud: ${resp.status}`);
      return resp.text();
    })
    .then((data) => {
      const parsedData = Papa.parse(data, { header: true });
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
    if (!countryList.includes(country)) {
      countryList.push(country);
    }
  });
  return countryList;
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
    const firstKey = Object.keys(row)[0]; // Obtener la primera columna (AÑO)
    const year = parseInt(row[firstKey]);
    const month = parseInt(row.MES);
    return (
      (years.length === 0 || years.includes(year)) &&
      (originCountry.length === 0 || originCountry.includes(row.PAIS_ORIGEN)) &&
      (months.length === 0 || months.includes(month))
    );
  });

  return filteredData;
};
