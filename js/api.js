// api.js
// Responsabilidade: fazer as requisições HTTP à Open-Meteo

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

// Converte o nome da cidade em latitude e longitude
async function fetchCoordinates(cityName) {
  const url = `${GEO_URL}?name=${encodeURIComponent(cityName)}&count=1&language=pt&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Erro ao buscar coordenadas da cidade.');
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('Cidade não encontrada.');
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

  const url = `${WEATHER_URL}?${params}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Erro ao buscar dados meteorológicos.');
  }

  return await response.json();
}