// Importa as funções a serem testadas
const { fetchCoordinates, fetchWeather } = require('../js/api');

// Mock global do fetch — substitui o fetch real por uma função simulada
global.fetch = jest.fn();

// Limpa os mocks antes de cada teste
beforeEach(() => {
  jest.clearAllMocks();
});

// ─── Testes de fetchCoordinates ───────────────────────────────────────────────
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

  test('falha na API lança exceção de servidor', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(fetchCoordinates('São Paulo')).rejects.toThrow('Erro ao buscar coordenadas');
  });

  test('erro de rede lança exceção de conexão', async () => {
    fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(fetchCoordinates('São Paulo')).rejects.toThrow('Sem conexão com a internet');
  });

  test('limite de requisições excedido lança exceção de servidor', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 429 });

    await expect(fetchCoordinates('São Paulo')).rejects.toThrow('Erro ao buscar coordenadas');
  });

  test('resposta JSON com formato inesperado lança exceção', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ dados: [] }) // formato errado — sem "results"
    });

    await expect(fetchCoordinates('São Paulo')).rejects.toThrow('Cidade não encontrada');
  });

});

// ─── Testes de fetchWeather ───────────────────────────────────────────────────
describe('fetchWeather', () => {

  test('coordenadas válidas retornam dados meteorológicos', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        current: { temperature_2m: 25, weathercode: 0 },
        daily: { time: [], temperature_2m_max: [], temperature_2m_min: [], weathercode: [], precipitation_sum: [] }
      })
    });

    const result = await fetchWeather(-23.55, -46.63);

    expect(result).toBeDefined();
    expect(result.current).toBeDefined();
    expect(result.current.temperature_2m).toBe(25);
  });

  test('falha na API lança exceção de servidor', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(fetchWeather(-23.55, -46.63)).rejects.toThrow('Erro ao buscar dados meteorológicos');
  });

  test('erro de rede lança exceção de conexão', async () => {
    fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(fetchWeather(-23.55, -46.63)).rejects.toThrow('Sem conexão com a internet');
  });

});