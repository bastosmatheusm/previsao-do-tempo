// Responsabilidade: fazer as requisições HTTP à Open-Meteo

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

// Converte o nome da cidade em latitude e longitude
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

// Busca os dados do clima com base em latitude e longitude
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

// Exporta as funções para uso no Node.js (Jest)
// No navegador, esse bloco é ignorado
if (typeof module !== 'undefined') {
  module.exports = { fetchCoordinates, fetchWeather };
}