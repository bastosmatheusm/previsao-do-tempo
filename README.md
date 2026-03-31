# Previsão do Tempo 🌤️

Aplicação web de previsão do tempo desenvolvida com HTML, CSS e JavaScript puro, consumindo a API gratuita [Open-Meteo](https://open-meteo.com/).

## Funcionalidades

- Busca de cidade por nome
- Exibição da temperatura atual, sensação térmica, humidade e velocidade do vento
- Descrição e ícone da condição climática atual
- Previsão dos próximos 7 dias com máxima, mínima e precipitação
- Tema diurno e noturno automático com base no horário
- Tratamento de erros: cidade não encontrada, falha na API e sem conexão

## Tecnologias

- HTML5
- CSS3
- JavaScript puro (ES6+)
- [Open-Meteo API](https://open-meteo.com/) — previsão do tempo
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) — conversão de nome de cidade em coordenadas
- [Jest](https://jestjs.io/) — testes unitários

## Estrutura do Projeto
```
previsao-do-tempo/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── api.js
│   ├── ui.js
│   └── helpers.js
├── tests/
│   └── api.test.js
└── README.md
```

## Como usar

1. Clone o repositório:
```bash
   git clone https://github.com/seu-usuario/previsao-do-tempo.git
```
2. Abra o arquivo `index.html` diretamente no navegador.
3. Digite o nome de uma cidade e clique em **Buscar**.

## Testes

Para executar os testes unitários:
```bash
npm install
npm test
```

## APIs utilizadas

| API | Descrição |
|---|---|
| `api.open-meteo.com/v1/forecast` | Dados meteorológicos atuais e previsão |
| `geocoding-api.open-meteo.com/v1/search` | Conversão de cidade em coordenadas |

## Licença

Este projeto foi desenvolvido para fins educacionais.