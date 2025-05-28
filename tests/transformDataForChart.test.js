import { transformDataForChart } from '../components/molecules/transformDataForChart'; // ajusta esta ruta

describe('transformDataForChart', () => {
  it('devuelve etiquetas y datos correctamente ordenados', () => {
    const input = [
      { AÑO: '2023', MES: '2', TURISTAS: '1500' },
      { AÑO: '2023', MES: '1', TURISTAS: '1000' },
    ];

    const result = transformDataForChart(input);

    expect(result.labels).toEqual(['2023M01', '2023M02']);
    expect(result.datasets[0].data).toEqual([1000, 1500]);
  });

  it('rellena con 0 si TURISTAS no es un número válido', () => {
    const input = [
      { AÑO: '2023', MES: '1', TURISTAS: 'abc' },
      { AÑO: '2023', MES: '2', TURISTAS: '2000' },
    ];

    const result = transformDataForChart(input);

    expect(result.labels).toEqual(['2023M01', '2023M02']);
    expect(result.datasets[0].data).toEqual([0, 2000]);
  });

  it('devuelve arrays vacíos si el input es null', () => {
    const result = transformDataForChart(null);
    expect(result.labels).toEqual([]);
    expect(result.datasets[0].data).toEqual([]);
  });

  it('devuelve arrays vacíos si el input está vacío', () => {
    const result = transformDataForChart([]);
    expect(result.labels).toEqual([]);
    expect(result.datasets[0].data).toEqual([]);
  });

  it('funciona aunque MES sea número en vez de string', () => {
    const input = [{ AÑO: '2023', MES: 3, TURISTAS: '5000' }];

    const result = transformDataForChart(input);
    expect(result.labels).toEqual(['2023M03']);
    expect(result.datasets[0].data).toEqual([5000]);
  });
});
