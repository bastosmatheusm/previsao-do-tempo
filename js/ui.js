// Exibe uma mensagem de carregamento enquanto aguarda a resposta da API
function renderLoading() {
  const resultSection = document.getElementById('result-section');
  resultSection.innerHTML = `<p>Buscando dados...</p>`;
}

// Exibe uma mensagem de erro no resultado
function renderError(message) {
  const resultSection = document.getElementById('result-section');
  resultSection.innerHTML = `<p class="error">${message}</p>`;
}

// Exibe os dados do clima atual e a previsão dos próximos 7 dias
function renderWeather(data, cityName, countryName) {
  const resultSection = document.getElementById('result-section');

  const current = data.current;
  const daily = data.daily;
  const info = getWeatherInfo(current.weathercode);

  // Gera um card HTML para cada dia da previsão
  const forecastCards = daily.time.map((date, index) => {
    const dayInfo = getWeatherInfo(daily.weathercode[index]);
    const rain = daily.precipitation_sum[index];

    return `
      <div class="forecast-card">
        <p class="forecast-day">${formatDay(date, index)}</p>
        <p class="forecast-icon">${dayInfo.icon}</p>
        <p class="forecast-max">${formatTemp(daily.temperature_2m_max[index])}</p>
        <p class="forecast-min">${formatTemp(daily.temperature_2m_min[index])}</p>
        ${rain > 0 ? `<p class="forecast-rain">💧 ${rain.toFixed(1)} mm</p>` : ''}
      </div>
    `;
  }).join('');

  resultSection.innerHTML = `
    <div id="current-weather">
      <h2>${cityName}, ${countryName}</h2>
      <p class="datetime">${formatDateTime()}</p>
      <p class="current-icon">${info.icon}</p>
      <p class="current-temp">${formatTemp(current.temperature_2m)}</p>
      <p class="current-desc">${info.desc}</p>
      <div class="current-meta">
        <p>Sensação: ${formatTemp(current.apparent_temperature)}</p>
        <p>Humidade: ${current.relative_humidity_2m}%</p>
        <p>Vento: ${Math.round(current.windspeed_10m)} km/h</p>
      </div>
    </div>

    <div id="forecast">
      <h3>Próximos 7 dias</h3>
      <div id="forecast-cards">
        ${forecastCards}
      </div>
    </div>
  `;
}

// Exibe os cards de comparação de múltiplas cidades lado a lado
function renderComparison(results) {
  const resultSection = document.getElementById('result-section');

  // Gera um card resumido para cada cidade
  const cards = results.map(({ city, weatherData }) => {
    const current = weatherData.current;
    const daily = weatherData.daily;
    const info = getWeatherInfo(current.weathercode);

    return `
      <div class="compare-card">
        <h3>${city.name}</h3>
        <p class="compare-country">${city.country}</p>
        <p class="compare-icon">${info.icon}</p>
        <p class="compare-temp">${formatTemp(current.temperature_2m)}</p>
        <p class="compare-desc">${info.desc}</p>
        <div class="compare-meta">
          <p>Sensação: ${formatTemp(current.apparent_temperature)}</p>
          <p>Humidade: ${current.relative_humidity_2m}%</p>
          <p>Vento: ${Math.round(current.windspeed_10m)} km/h</p>
          <p>Máx: ${formatTemp(daily.temperature_2m_max[0])} / Mín: ${formatTemp(daily.temperature_2m_min[0])}</p>
        </div>
      </div>
    `;
  }).join('');

  resultSection.innerHTML = `
    <div id="comparison">
      <h2>Comparação de Cidades</h2>
      <div id="compare-cards">${cards}</div>
    </div>
  `;
}