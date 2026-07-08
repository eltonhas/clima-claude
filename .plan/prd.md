# PRD - Clima

## Visão Geral

O projeto Clima é uma aplicação web leve feita em Vite + Vanilla + TypeScript. Ele permite que o usuário pesquise uma cidade e obtenha as informações de clima da localização usando a API Open-Meteo.

O fluxo do usuário é simples:
- inserir o nome da cidade;
- o app busca latitude, longitude e timezone da cidade;
- com esses dados, o app solicita as condições atuais de clima;
- exibe os dados em uma interface centralizada com estado vazio e loading.

## Objetivos do Produto

- fornecer clima atual para qualquer cidade pesquisada;
- manter a interface limpa, centralizada e responsiva;
- tratar erros de forma amigável para cidades ou dados não encontrados;
- separar a lógica de acesso à API em funções reutilizáveis.

## Requisitos Funcionais

1. Busca de cidade
   - O usuário digita o nome da cidade em um campo de pesquisa.
   - A busca também pode ser iniciada pressionando Enter.
   - O projeto faz uma única ação para o usuário, mas internamente realiza duas requisições:
     - geocoding para latitude, longitude e timezone;
     - forecast para dados de clima.
   - Enquanto a busca está em andamento, deve haver um indicador de loading.

2. Consulta de geolocalização
   - Consumir o endpoint:
     `https://geocoding-api.open-meteo.com/v1/search?name={NOME_DA_CIDADE}&count=1&language=pt&format=json`
   - Do retorno, usar apenas:
     - `name`
     - `latitude`
     - `longitude`
     - `country_code`
     - `timezone`
   - `country_code` deve ser exibido como código do país (por exemplo, `BR`).
   - Caso `results` seja vazio ou falhe, exibir estado de "não encontrado".

3. Consulta de clima
   - Consumir o endpoint:
     `https://api.open-meteo.com/v1/forecast?latitude={LATITUDE}&longitude={LONGITUDE}&current=precipitation_probability,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,wind_direction_10m,precipitation,weather_code&timezone={TIMEZONE}`
   - Do retorno, usar:
     - `current_units` para as unidades de medida;
     - `current` para os valores reais.
   - Propriedades obrigatórias:
     - `temperature_2m`
     - `relative_humidity_2m`
     - `apparent_temperature`
     - `is_day`
     - `wind_speed_10m`
     - `wind_direction_10m`
     - `precipitation_probability`
   - Caso falhe ou falte algum dado esperado, considerar como "não encontrado".

4. Funções OpenMeteo
   - Deve existir um arquivo de funções responsáveis por acessar a API OpenMeteo.
   - O projeto não deve fazer requisições diretas à API fora dessas funções.
   - As funções devem validar a presença dos parâmetros antes de executar a requisição.
   - Se parâmetros estiverem ausentes, devem retornar resultado equivalente a "não encontrado".

5. Estados da interface
   - Empty state inicial, com campo de busca centralizado.
   - Loading state enquanto a busca ocorre.
   - Resultado exibido quando o clima for carregado com sucesso.
   - Error / not found state quando a cidade ou clima não puder ser obtido.

## Requisitos de Sistema

- Frontend em Vite + Vanilla + TypeScript.
- Uso de fetch ou API equivalente para requisições HTTP.
- CSS sem framework; estilos escritos manualmente.
- Arquivo separado para lógica OpenMeteo.
- Tratamento de estados de UI: vazio, carregando, sucesso e erro.
- Compatibilidade básica com navegadores modernos.
- Não há necessidade de autenticação ou backend adicional.
- Organização de pastas em:
  - `services/` para chamadas de API e integração com OpenMeteo;
  - `utils/` para helpers e formatação de data, vento e weather code;
  - `types/` para definições TypeScript de modelos de dados.

## Detalhes Técnicos

### Arquitetura de dados

1. Geocoding:
   - `searchCity(name: string)` -> retorna `{ name, latitude, longitude, country_code, timezone }` ou `null`.

2. Forecast:
   - `getWeather(latitude: number, longitude: number, timezone: string)` -> retorna objeto com:
     - `current_units`
     - `current`
   - Validar as propriedades obrigatórias antes de considerar a resposta válida.

### Fluxo de execução

1. Usuário envia o nome da cidade.
2. Chamadas sequenciais:
   - `searchCity(name)`;
   - se sucesso, `getWeather(latitude, longitude, timezone)`.
3. Atualizar UI de acordo com o resultado.

### Tratamento de falhas

- Se `searchCity` retornar `null` ou lista vazia, mostrar mensagem de cidade não encontrada.
- Se `getWeather` retornar `null`, mostrar mensagem de dados de clima não encontrados.
- O loading deve ser encerrado em qualquer um desses casos.
- O app não deve exibir dados parciais: se qualquer valor obrigatório estiver ausente, trata como erro.

### Mapeamento de Weather Code

Utilizar interpretação do WMO Weather Code para exibir o significado de `weather_code`:
- 0: Céu limpo
- 1, 2, 3: Parcialmente nublado / nublado
- 45, 48: Névoa / nevoeiro
- 51, 53, 55: Chuvisco: intensidade leve, moderada e densa
- 56, 57: Chuvisco congelante: leve e denso
- 61, 63, 65: Chuva: fraca, moderada e forte
- 66, 67: Chuva congelante: leve e forte
- 71, 73, 75: Neve: fraca, moderada e forte
- 77: Grãos de neve
- 80, 81, 82: Pancadas de chuva: fraca, moderada e intensa
- 85, 86: Pancadas de neve fracas e fortes
- 95: Trovoada: fraca ou moderada
- 96, 99: Trovoada com granizo

## Instruções Visuais

### Layout

- Página com fundo cinza escuro.
- Conteúdo centralizado com largura máxima de 800px.
- Área principal com borda bem arredondada e fundo branco.
- Campo de busca em uma área superior centralizada.
- Layout mobile-first:
  - em telas pequenas, o sidebar aparece em cima e a área principal abaixo;
  - em telas maiores, o sidebar fica à esquerda e a área principal à direita.
- Layout dividido em:
  - sidebar;
  - área principal.

### Sidebar (informações principais)

- Temperatura atual.
- Nome da cidade e código do país (`country_code`).
- Dia atual formatado em português com o fuso horário da cidade. Exemplo: `quinta-feira, 02 de julho de 2026`.
- Indicador de dia/noite baseado em `is_day`, exibido com ícone de sol ou lua e texto.
- Weather code e interpretação em português.

### Área principal (detalhes adicionais)

- Humidade relativa.
- Temperatura aparente.
- Probabilidade de precipitação.
- Velocidade do vento e direção, exibindo grau e cardeal.

### Estado vazio

- Deve exibir apenas o campo de busca em destaque.
- Instrução clara para digitar o nome da cidade.

### Loading

- Mostrar um indicador de carregamento enquanto as chamadas estão pendentes.

### Erro / não encontrado

- Mensagem clara e simples: não encontrado ou erro ao buscar os dados.
- Permitir nova tentativa sem recarregar a página.

## Critérios de Aceitação

- [ ] Busca com duas requisições sequenciais funcionando.
- [ ] Validação de parâmetros nas funções OpenMeteo.
- [ ] UI com estados vazio, loading, sucesso e erro.
- [ ] Layout centralizado com card branco e bordas arredondadas.
- [ ] Exibição dos dados obrigatórios e interpretação do weather code.
- [ ] Comportamento de "não encontrado" quando a cidade ou o clima não puder ser carregado.
