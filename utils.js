export const getCoordinatesFromCity = async (cityName) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`,
      {
        headers: {
          'User-Agent': 'TourisTrack/1.0 (sergi.font.jane@estudiantat.upc.edu)',
        },
      },
    );
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      const { lat, lon } = data[0];
      return { lat, lon };
    } else {
      console.log('No se encontraron resultados.');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener las coordenadas:', error);
    return null;
  }
};
