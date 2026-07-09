# Clima

Aplicação web leve para consultar o clima atual de qualquer cidade, construída com Vite + Vanilla + TypeScript. Os dados vêm da API pública [Open-Meteo](https://open-meteo.com/).

🔗 Demo: https://eltonhas.github.io/clima-claude/

## Funcionalidades

- Busca de cidade por nome (via Enter ou botão).
- Geolocalização (latitude, longitude e timezone) e clima atual em duas requisições sequenciais.
- Estados de interface: vazio, carregando, sucesso e erro/não encontrado, com possibilidade de nova tentativa sem recarregar a página.
- Layout responsivo mobile-first, com sidebar (temperatura, cidade, data, dia/noite, condição do tempo) e área principal (humidade, sensação térmica, probabilidade de chuva, vento).
- Interpretação em português do WMO Weather Code.

## Tecnologias

- [Vite](https://vite.dev/)
- TypeScript
- CSS puro (sem framework)
- [Open-Meteo API](https://open-meteo.com/) (geocoding + forecast)

## Estrutura do projeto

```
src/
  services/   # acesso à API OpenMeteo (única camada que faz fetch)
  utils/      # formatação de data, direção do vento e weather code
  types/      # tipos TypeScript dos modelos de dados
  search.ts   # orquestração da busca (searchCity -> getWeather)
  main.ts     # renderização da UI e máquina de estados
  style.css   # estilos da aplicação
```

Documentação de planejamento em [`.plan/`](.plan/prd.md) (PRD e checklist de tarefas).

## Como rodar localmente

Pré-requisitos: Node.js 20+.

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Build de produção

```bash
npm run build
npm run preview
```

## Deploy

O deploy é automático via GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)): a cada push na branch `main`, o projeto é buildado e publicado no GitHub Pages.
