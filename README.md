# Previsão do Tempo 🌤️

Aplicação web de previsão do tempo desenvolvida com HTML, CSS e JavaScript puro, consumindo a API gratuita [Open-Meteo](https://open-meteo.com/).

## Funcionalidades

- Busca de cidade por nome
- Exibição da temperatura atual, sensação térmica, humidade e velocidade do vento
- Descrição e ícone da condição climática atual
- Previsão dos próximos 7 dias com máxima, mínima e precipitação
- Tema diurno e noturno automático com base no horário
- Cache local dos dados por 10 minutos (localStorage)
- Comparação do clima entre até 5 cidades simultaneamente
- Tratamento de erros: cidade não encontrada, falha na API e sem conexão

## Tecnologias

- HTML5
- CSS3
- JavaScript puro (ES6+)
- [Open-Meteo API](https://open-meteo.com/) — previsão do tempo
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) — conversão de cidade em coordenadas
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
├── LICENSE
├── NOTICE.md
└── README.md
```

## Como usar

1. Clone o repositório:
```bash
   git clone https://github.com/seu-usuario/previsao-do-tempo.git
```
2. Abra o arquivo `index.html` diretamente no navegador.
3. Digite o nome de uma cidade e clique em **Buscar**.

### Comparando cidades

1. Digite uma cidade e clique em **+ Comparar**
2. Repita para até 5 cidades
3. Clique em **Comparar cidades**

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

## Privacidade e Segurança

- Esta aplicação **não coleta nem armazena dados pessoais** do usuário em servidores próprios.
- Os nomes de cidades buscados são enviados diretamente à API Open-Meteo para obtenção de dados meteorológicos.
- Os dados retornados pela API são armazenados temporariamente no `localStorage` do navegador por até 10 minutos, apenas para otimizar o desempenho.
- Nenhuma chave de API sensível é utilizada ou exposta no código.
- Toda comunicação com a API é realizada via HTTPS.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.