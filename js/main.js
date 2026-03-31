// Ponto de entrada da aplicação — orquestra as chamadas de api.js e ui.js

// Tempo máximo de validade do cache em milissegundos (10 minutos)
const CACHE_DURATION_MS = 10 * 60 * 1000;

// Lista de cidades para comparação
const citiesToCompare = [];

// Lista de cidades retornadas pelo autocomplete
let autocompleteResults = [];
let autocompleteTimer;

/**
 * Salva os dados do clima no localStorage com timestamp.
 * @param {string} cityName - Nome da cidade.
 * @param {Object} data - Dados meteorológicos retornados pela API.
 */
function saveCache(cityName, data) {
  const cache = { timestamp: Date.now(), data };
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

// Atualiza a lista visual de cidades para comparação
function updateCityList() {
  const cityList = document.getElementById('city-list');
  const compareSection = document.getElementById('compare-section');

  if (citiesToCompare.length === 0) {
    compareSection.style.display = 'none';
    return;
  }

  compareSection.style.display = 'block';
  cityList.innerHTML = citiesToCompare.map((name, index) => `
    <li>
      ${name}
      <button class="remove-btn" data-index="${index}">✕</button>
    </li>
  `).join('');
}

// Busca o clima individual de uma cidade com suporte a cache
async function fetchCityWeather(cityName) {
  const cached = loadCache(cityName);
  if (cached) return cached;

  const city = await fetchCoordinates(cityName);
  const weatherData = await fetchWeather(city.latitude, city.longitude);
  saveCache(cityName, { city, weatherData });

  return { city, weatherData };
}

// Busca e exibe o clima de uma cidade a partir de um objeto city
async function loadWeatherForCity(city) {
  renderLoading();
  document.body.classList.replace('day', getTimeOfDay());
  document.body.classList.replace('night', getTimeOfDay());

  try {
    const cached = loadCache(city.name);
    if (cached) {
      renderWeather(cached.weatherData, cached.city.name, cached.city.admin1, cached.city.country);
      return;
    }

    const weatherData = await fetchWeather(city.latitude, city.longitude);
    saveCache(city.name, { city, weatherData });
    renderWeather(weatherData, city.name, city.admin1, city.country);
  } catch (error) {
    renderError(error.message);
  }
}

// Busca e exibe o clima de uma única cidade pelo input
async function handleSearch() {
  const input = document.getElementById('city-input');
  const cityName = input.value.trim();

  if (!cityName) {
    renderError('Por favor, digite o nome de uma cidade.');
    return;
  }

  hideSuggestions();

  renderLoading();
  document.body.classList.replace('day', getTimeOfDay());
  document.body.classList.replace('night', getTimeOfDay());

  try {
    const { city, weatherData } = await fetchCityWeather(cityName);
    renderWeather(weatherData, city.name, city.admin1, city.country);
  } catch (error) {
    renderError(error.message);
  }
}

// Adiciona uma cidade à lista de comparação
async function handleAddCity() {
  const input = document.getElementById('city-input');
  const cityName = input.value.trim();

  if (!cityName) {
    renderError('Por favor, digite o nome de uma cidade.');
    return;
  }

  if (citiesToCompare.length >= 5) {
    renderError('Limite de 5 cidades para comparação atingido.');
    return;
  }

  if (citiesToCompare.includes(cityName)) {
    renderError(`"${cityName}" já está na lista de comparação.`);
    return;
  }

  citiesToCompare.push(cityName);
  input.value = '';
  hideSuggestions();
  updateCityList();
}

// Busca e compara o clima de todas as cidades da lista
async function handleCompare() {
  if (citiesToCompare.length < 2) {
    renderError('Adicione pelo menos 2 cidades para comparar.');
    return;
  }

  renderLoading();

  try {
    const results = await Promise.all(citiesToCompare.map(fetchCityWeather));
    renderComparison(results);
  } catch (error) {
    renderError(error.message);
  }
}

// Limpa a lista de comparação
function handleClear() {
  citiesToCompare.length = 0;
  updateCityList();
  document.getElementById('result-section').innerHTML = '';
}

// ─── Autocomplete ─────────────────────────────────────────────────────────────
const cityInput = document.getElementById('city-input');

// Busca sugestões conforme o usuário digita com debounce de 350ms
cityInput.addEventListener('input', () => {
  clearTimeout(autocompleteTimer);
  const val = cityInput.value.trim();

  if (val.length < 2) { hideSuggestions(); return; }

  autocompleteTimer = setTimeout(async () => {
    const cities = await searchCities(val);
    autocompleteResults = cities;
    renderSuggestions(cities);
  }, 350);
});

// Ao clicar em uma sugestão, carrega o clima daquela cidade
document.getElementById('search-section').addEventListener('click', (e) => {
  const item = e.target.closest('.suggestion-item');
  if (!item) return;
  const index = parseInt(item.dataset.index);
  const city = autocompleteResults[index];
  cityInput.value = city.name;
  hideSuggestions();
  loadWeatherForCity(city);
});

// Esconde sugestões ao clicar fora da seção de busca
document.addEventListener('click', (e) => {
  if (!e.target.closest('#search-section')) hideSuggestions();
});

// ─── Event Listeners ──────────────────────────────────────────────────────────
document.getElementById('search-btn').addEventListener('click', handleSearch);
document.getElementById('add-btn').addEventListener('click', handleAddCity);
document.getElementById('compare-btn').addEventListener('click', handleCompare);
document.getElementById('clear-btn').addEventListener('click', handleClear);

cityInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') handleSearch();
});

// Remove cidade da lista ao clicar no botão ✕
document.getElementById('city-list').addEventListener('click', function (event) {
  const btn = event.target.closest('.remove-btn');
  if (!btn) return;
  const index = parseInt(btn.dataset.index);
  citiesToCompare.splice(index, 1);
  updateCityList();
});

// Aplica o tema diurno ou noturno com base no horário atual
document.body.classList.add(getTimeOfDay());