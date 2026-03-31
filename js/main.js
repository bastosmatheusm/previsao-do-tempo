// Ponto de entrada da aplicação — orquestra as chamadas de api.js e ui.js

async function handleSearch() {
  const input = document.getElementById('city-input');
  const cityName = input.value.trim();

  if (!cityName) {
    renderError('Por favor, digite o nome de uma cidade.');
    return;
  }

  renderLoading();

  try {
    // Busca as coordenadas da cidade informada
    const city = await fetchCoordinates(cityName);

    // Usa as coordenadas para buscar os dados do clima
    const weatherData = await fetchWeather(city.latitude, city.longitude);

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