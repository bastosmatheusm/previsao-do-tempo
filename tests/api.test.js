const { fetchCoordinates, fetchWeather } = require('../js/api');

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── fetchCoordinates ─────────────────────────────────────────────────────────
describe('fetchCoordinates', () => {

  test('cidade válida retorna coordenadas', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [{ name: 'São Paulo', latitude: -23.55, longitude: -46.63, country: 'Brasil' }]
      })
    });

    const result = await fetchCoordinates('São Paulo');
    expect(result).toMatchObject({ name: 'São Paulo', latitude: -23.55, longitude: -46.63 });
  });

  test('cidade inexistente lança exceção', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] })
    });

    await expect(fetchCoordinates('cidadeinexistente123')).rejects.toThrow('Cidade não encontrada');
  });

  test('resposta JSON com formato inesperado lança exceção', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ dados: [] }) // sem a chave "results"
    });

    await expect(fetchCoordinates('São Paulo')).rejects.toThrow('Cidade não encontrada');
  });

  test('erro de servidor lança exceção', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(fetchCoordinates('São Paulo')).rejects.toThrow('Erro ao buscar coordenadas');
  });

  test('erro de rede lança exceção de conexão', async () => {
    fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(fetchCoordinates('São Paulo')).rejects.toThrow('Sem conexão com a internet');
  });

});

// ─── fetchWeather ─────────────────────────────────────────────────────────────
describe('fetchWeather', () => {

  test('coordenadas válidas retornam dados meteorológicos', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        current: { temperature_2m: 25, weathercode: 0 },
        daily: {
          time: [],
          temperature_2m_max: [],
          temperature_2m_min: [],
          weathercode: [],
          precipitation_sum: []
        }
      })
    });

    const result = await fetchWeather(-23.55, -46.63);
    expect(result).toBeDefined();
    expect(result.current.temperature_2m).toBe(25);
  });

  test('erro de servidor lança exceção', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(fetchWeather(-23.55, -46.63)).rejects.toThrow('Erro ao buscar dados meteorológicos');
  });

  test('erro de rede lança exceção de conexão', async () => {
    fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(fetchWeather(-23.55, -46.63)).rejects.toThrow('Sem conexão com a internet');
  });

});