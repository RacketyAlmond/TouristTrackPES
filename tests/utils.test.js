import { getCoordinatesFromCity, getCountryFlag } from '../utils.js';

describe('Test function that returns the coordinates of a specific city', () => {
  test('Given Barcelona name then returns its coordinates', async () => {
    // given
    const cityName = 'Barcelona';

    // when
    const returnedCoordinates = await getCoordinatesFromCity(cityName);

    // then
    const coordinates = { lat: '41.3828939', lon: '2.1774322' };
    expect(returnedCoordinates).toEqual(coordinates);
  });

  test('Given an invalid city name then returns null', async () => {
    // given
    const cityName = 'InvalidCityName';

    // when
    const returnedCoordinates = await getCoordinatesFromCity(cityName);

    // then
    expect(returnedCoordinates).toBeNull();
  });

  test('Given an empty city name then returns null', async () => {
    // given
    const cityName = '';

    // when
    const returnedCoordinates = await getCoordinatesFromCity(cityName);

    // then
    expect(returnedCoordinates).toBeNull();
  });
});

describe('Test function that returns the flag URL of a specific country', () => {
  test('Given Spain name then returns its flag URL', () => {
    // given
    const countryName = 'España';

    // when
    const flagURL = getCountryFlag(countryName);

    // then
    const expectedURL = 'https://flagcdn.com/w320/es.png';
    expect(flagURL).toBe(expectedURL);
  });

  test('Given an unknown country name then returns null', () => {
    // given
    const countryName = 'Unknown Country';

    // when
    const flagURL = getCountryFlag(countryName);

    // then
    expect(flagURL).toBeNull();
  });
});
