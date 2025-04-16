export const transformDataForChart = (filteredData, dataApi = []) => {
  if (!filteredData || filteredData.length === 0) {
    console.warn('No hay datos disponibles para la gráfica.');
    console.warn('filteredData');
    console.warn(dataApi);
    return {
      labels: [],
      datasets: [{ data: [] }],
    };
  }

  const sortedData = [...filteredData].sort(
    (a, b) => parseInt(a.MES) - parseInt(b.MES),
  );

  return {
    labels: sortedData.map(
      (item) => `${item.AÑO}M${item.MES.padStart(2, '0')}`,
    ),
    datasets: [
      {
        data: sortedData.map((item) => {
          const turistas = parseInt(item.TURISTAS, 10);
          return isNaN(turistas) ? 0 : turistas;
        }),
      },
    ],
  };
};
