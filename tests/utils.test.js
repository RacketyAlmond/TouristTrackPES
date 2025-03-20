import { getCoordinatesFromCity } from '../utils';

describe('Test function that returns the coordinates of an especific city', () => {
  test('Given Barcelona name then returns its coordinates', async () => {
    // given
    const cityName = 'Barcelona';
    // when
    const returnedCoordinates = await getCoordinatesFromCity(cityName);

    // then
    const coordinates = { lat: '41.3828939', lon: '2.1774322' };
    expect(returnedCoordinates).toEqual(coordinates);
  });
});
