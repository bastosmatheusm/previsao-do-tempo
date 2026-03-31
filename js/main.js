// Ponto de entrada da aplicação — orquestra as chamadas de api.js e ui.js

// Tempo máximo de validade do cache em milissegundos (10 minutos)
const CACHE_DURATION_MS = 10 * 60 * 1000;

/**
 * Salva os dados do clima no localStorage com timestamp.
 * @param {string} cityName - Nome da cidade.
 * @param {Object} data - Dados meteorológicos retornados pela API.
 */
function saveCache(cityName, data) {
  const cache = {
    timestamp: Date.now(),
    data
  };
  localStorage.setItem(`weather_${cityName.toLowerCase()}`, JSON.stringify(cache));
}

/**
 * Recupera os dados do cache se ainda estiverem válidos.
 * @param {string} cityName - Nome da cidade.
 * @returns {Object|null} Dados meteorológicos ou null se expirado/inexistente.
 */
function loadCache(cityName) {
  const raw = localStorage.getItem(`weather_${cityName.toLowerCase()}`);
  if (!raw) return null;

  const cache = JSON.parse(raw);
  const isExpired = Date.now() - cache.timestamp > CACHE_DURATION_MS;

  if (isExpired) {
    localStorage.removeItem(`weather_${cityName.toLowerCase()}`);
    return null;
  }

  return cache.data;
}

async function handleSearch() {
  const input = document.getElementById('city-input');
  const cityName = input.value.trim();

  if (!cityName) {
    renderError('Por favor, digite o nome de uma cidade.');
    return;
  }

  renderLoading();

  // Atualiza o tema após o loading, antes de qualquer requisição
  document.body.classList.replace('day', getTimeOfDay());
  document.body.classList.replace('night', getTimeOfDay());

  try {
    // Verifica se há dados em cache antes de buscar na API
    const cached = loadCache(cityName);

    if (cached) {
      renderWeather(cached.weatherData, cached.city.name, cached.city.country);
      return;
    }

    // Busca as coordenadas da cidade informada
    const city = await fetchCoordinates(cityName);

    // Usa as coordenadas para buscar os dados do clima
    const weatherData = await fetchWeather(city.latitude, city.longitude);

    // Salva no cache para próximas consultas
    saveCache(cityName, { city, weatherData });

    renderWeather(weatherData, city.name, city.country);
  } catch (error) {
    renderError(error.message);
  }
}

// Associa o botão de busca à função principal
document.getElementById('search-btn').addEventListener('click', handleSearch);

// Permite buscar pressionando Enter no input
document.getElementById('city-input').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') handleSearch();
});

// Aplica o tema diurno ou noturno com base no horário atual
document.body.classList.add(getTimeOfDay());