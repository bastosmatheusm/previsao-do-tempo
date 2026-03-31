/**
 * @fileoverview Módulo responsável pelas requisições HTTP à API Open-Meteo.
 */

/**
 * @constant {string} GEO_URL - Endpoint da API de geocodificação do Open-Meteo.
 */
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * @constant {string} WEATHER_URL - Endpoint da API de previsão do tempo do Open-Meteo.
 */
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Converte o nome de uma cidade em coordenadas geográficas (latitude e longitude).
 *
 * @async
 * @param {string} cityName - Nome da cidade a ser buscada.
 * @returns {Promise<Object>} Objeto com os dados da cidade, incluindo latitude, longitude e nome.
 * @throws {Error} Se não houver conexão com a internet.
 * @throws {Error} Se a API retornar um erro de servidor.
 * @throws {Error} Se a cidade não for encontrada na base de dados.
 *
 * @example
 * const city = await fetchCoordinates('São Paulo');
 * console.log(city.latitude, city.longitude); // -23.5505, -46.6333
 */
async function fetchCoordinates(cityName) {
  let response;

  // Tenta fazer a requisição — captura erros de rede (sem internet, timeout, etc.)
  try {
    response = await fetch(`${GEO_URL}?name=${encodeURIComponent(cityName)}&count=1&language=pt&format=json`);
  } catch {
    throw new Error('Sem conexão com a internet. Verifique sua rede e tente novamente.');
  }

  // Captura erros do servidor (ex: API fora do ar)
  if (!response.ok) {
    throw new Error('Erro ao buscar coordenadas. Tente novamente mais tarde.');
  }

  const data = await response.json();

  // Captura quando a cidade não é encontrada na base de dados
  if (!data.results || data.results.length === 0) {
    throw new Error('Cidade não encontrada. Verifique o nome e tente novamente.');
  }

  return data.results[0];
}

/**
 * Busca os dados meteorológicos atuais e a previsão dos próximos 7 dias
 * com base em coordenadas geográficas.
 *
 * @async
 * @param {number} latitude - Latitude da localização.
 * @param {number} longitude - Longitude da localização.
 * @returns {Promise<Object>} Objeto com dados meteorológicos atuais e previsão diária.
 * @throws {Error} Se não houver conexão com a internet.
 * @throws {Error} Se a API retornar um erro de servidor.
 *
 * @example
 * const weather = await fetchWeather(-23.55, -46.63);
 * console.log(weather.current.temperature_2m); // 24.5
 */
async function fetchWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,apparent_temperature,weathercode,windspeed_10m,relative_humidity_2m',
    daily: 'temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum',
    timezone: 'auto',
    forecast_days: 7,
    wind_speed_unit: 'kmh'
  });

  let response;

  // Tenta fazer a requisição — captura erros de rede
  try {
    response = await fetch(`${WEATHER_URL}?${params}`);
  } catch {
    throw new Error('Sem conexão com a internet. Verifique sua rede e tente novamente.');
  }

  // Captura erros do servidor
  if (!response.ok) {
    throw new Error('Erro ao buscar dados meteorológicos. Tente novamente mais tarde.');
  }

  return await response.json();
}

/**
 * Busca sugestões de cidades pelo nome para o autocomplete.
 * @param {string} query - Texto digitado pelo usuário.
 * @returns {Promise<Array>} Lista de cidades encontradas.
 */
async function searchCities(query) {
  if (query.length < 2) return [];

  let response;

  try {
    response = await fetch(`${GEO_URL}?name=${encodeURIComponent(query)}&count=5&language=pt&format=json`);
  } catch {
    return [];
  }

  if (!response.ok) return [];

  const data = await response.json();
  return data.results ?? [];
}

// Exporta as funções para uso no Node.js (Jest)
// No navegador, esse bloco é ignorado pois "module" não está definido
if (typeof module !== 'undefined') {
  module.exports = { fetchCoordinates, fetchWeather, searchCities };
}