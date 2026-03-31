const WMO_CODES = {
  0:  { icon: '☀️',  desc: 'Céu limpo' },
  1:  { icon: '🌤️', desc: 'Predominantemente limpo' },
  2:  { icon: '⛅',  desc: 'Parcialmente nublado' },
  3:  { icon: '☁️',  desc: 'Nublado' },
  45: { icon: '🌫️', desc: 'Neblina' },
  48: { icon: '🌫️', desc: 'Neblina com geada' },
  51: { icon: '🌦️', desc: 'Chuvisco leve' },
  53: { icon: '🌦️', desc: 'Chuvisco moderado' },
  55: { icon: '🌧️', desc: 'Chuvisco intenso' },
  61: { icon: '🌧️', desc: 'Chuva leve' },
  63: { icon: '🌧️', desc: 'Chuva moderada' },
  65: { icon: '🌧️', desc: 'Chuva intensa' },
  71: { icon: '❄️',  desc: 'Neve leve' },
  73: { icon: '❄️',  desc: 'Neve moderada' },
  75: { icon: '❄️',  desc: 'Neve intensa' },
  80: { icon: '🌦️', desc: 'Pancadas leves' },
  81: { icon: '🌧️', desc: 'Pancadas moderadas' },
  82: { icon: '⛈️',  desc: 'Pancadas fortes' },
  95: { icon: '⛈️',  desc: 'Tempestade' },
  96: { icon: '⛈️',  desc: 'Tempestade com granizo' },
  99: { icon: '⛈️',  desc: 'Tempestade forte' },
};

function getWeatherInfo(code) {
  return WMO_CODES[code] ?? { icon: '🌡️', desc: 'Desconhecido' };
}

function formatTemp(temp) {
  return `${Math.round(temp)}°C`;
}

function formatDay(dateStr, index) {
  if (index === 0) return 'Hoje';
  if (index === 1) return 'Amanhã';
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('pt-BR', { weekday: 'long' });
}

function formatDateTime() {
  return new Date().toLocaleString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  });
}