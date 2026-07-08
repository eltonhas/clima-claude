# Tasks - Clima

Este documento divide a implementação descrita em [prd.md](./prd.md) em tarefas menores.
Consulte o PRD para detalhes de endpoints, campos, layout e regras de negócio — aqui apenas
referenciamos as seções relevantes, sem duplicar o conteúdo.

Marque `[x]` quando a tarefa estiver concluída e o critério de aprovação verificado.

---

## 1. Estrutura de pastas e tipos base

- [x] **1.1 Criar estrutura de pastas `services/`, `utils/` e `types/` em `src/`**
  Ver PRD § "Requisitos de Sistema" (organização de pastas).
  **Critério de aprovação:** as três pastas existem dentro de `src/` (podem estar vazias ou com um `index` inicial).

- [x] **1.2 Definir tipos TypeScript dos modelos de dados**
  Ver PRD § "Arquitetura de dados" (retorno de `searchCity` e `getWeather`).
  Criar em `src/types/` interfaces para: resultado de geocoding (`CityResult`), unidades (`CurrentUnits`), dados atuais de clima (`CurrentWeather`) e o resultado combinado de `getWeather`.
  **Critério de aprovação:** os tipos cobrem todos os campos obrigatórios listados no PRD § "Requisitos Funcionais" (itens 2 e 3), e o projeto compila (`tsc --noEmit`) sem erros usando esses tipos.

---

## 2. Camada de serviços (OpenMeteo)

- [x] **2.1 Implementar `searchCity(name: string)` em `src/services/`**
  Ver PRD § "Requisitos Funcionais" (item 2) e § "Arquitetura de dados" (item 1).
  Deve consumir o endpoint de geocoding, extrair apenas os campos necessários e retornar `null` quando `results` for vazio ou a requisição falhar.
  **Critério de aprovação:** chamando `searchCity("São Paulo")` retorna um objeto com `name`, `latitude`, `longitude`, `country_code`, `timezone`; chamando com uma cidade inexistente (ex: `"asdkjaksjdkajsd"`) retorna `null`.

- [x] **2.2 Implementar `getWeather(latitude, longitude, timezone)` em `src/services/`**
  Ver PRD § "Requisitos Funcionais" (item 3) e § "Arquitetura de dados" (item 2).
  Deve consumir o endpoint de forecast, validar a presença de todas as propriedades obrigatórias em `current`, e retornar `null` se algo estiver ausente ou a requisição falhar.
  **Critério de aprovação:** chamando `getWeather` com coordenadas válidas retorna objeto com `current_units` e `current` contendo todas as propriedades obrigatórias listadas no PRD; se a resposta da API estiver sem algum campo obrigatório, a função retorna `null`.

- [x] **2.3 Validar parâmetros de entrada antes de requisitar**
  Ver PRD § "Requisitos Funcionais" (item 4).
  `searchCity` e `getWeather` devem checar se os parâmetros necessários foram informados (não vazios/undefined) antes de fazer o `fetch`.
  **Critério de aprovação:** chamando as funções com parâmetros ausentes ou inválidos (ex: string vazia, `NaN`) retorna `null` (ou equivalente de "não encontrado") **sem** disparar nenhuma requisição de rede (verificável via mock/spy de `fetch`).

- [x] **2.4 Garantir que não há requisições fora da camada de serviços**
  Ver PRD § "Requisitos Funcionais" (item 4).
  **Critério de aprovação:** busca no código-fonte (`grep`) por `fetch(` mostra ocorrências apenas dentro de `src/services/`.

---

## 3. Utilitários (`utils/`)

- [x] **3.1 Utilitário de formatação de data em português**
  Ver PRD § "Sidebar" (formato `quinta-feira, 02 de julho de 2026`) e § "Detalhes Técnicos".
  Deve considerar o timezone retornado pelo geocoding.
  **Critério de aprovação:** dado um timezone e uma data conhecida, a função retorna a string no formato `dia-da-semana, DD de mês de AAAA` em português.

- [x] **3.2 Utilitário de direção do vento (grau → cardeal)**
  Ver PRD § "Área principal" (velocidade e direção do vento, grau e cardeal).
  **Critério de aprovação:** função recebe `wind_direction_10m` (graus) e retorna o ponto cardeal correspondente (ex: `0` → `N`, `90` → `L/E`, `180` → `S`, `270` → `O/W`), cobrindo pelo menos os 8 pontos cardeais principais.

- [x] **3.3 Utilitário de interpretação do WMO Weather Code**
  Ver PRD § "Mapeamento de Weather Code" (tabela completa de códigos).
  **Critério de aprovação:** função recebe um `weather_code` numérico e retorna a descrição em português correspondente à tabela do PRD; código não mapeado tem um retorno padrão definido (ex: "Desconhecido").

---

## 4. Estado e orquestração da busca

- [x] **4.1 Implementar o fluxo de busca (orquestração `searchCity` → `getWeather`)**
  Ver PRD § "Fluxo de execução" e § "Tratamento de falhas".
  Deve chamar `searchCity`, e só chamar `getWeather` se o primeiro tiver sucesso; deve encerrar o loading em qualquer caminho (sucesso ou falha).
  **Critério de aprovação:** simulando cidade inexistente, o fluxo para após `searchCity` e exibe estado de erro sem chamar `getWeather`; simulando falha em `getWeather`, o fluxo exibe erro mesmo com `searchCity` bem-sucedido; em ambos os casos o loading é desativado ao final.

- [x] **4.2 Garantir que não há exibição de dados parciais**
  Ver PRD § "Tratamento de falhas".
  **Critério de aprovação:** se qualquer campo obrigatório estiver ausente na resposta, a UI cai no estado de erro/não encontrado, nunca renderizando o card de resultado com campos faltando.

---

## 5. Interface — estrutura e layout

- [ ] **5.1 Montar layout base (fundo, card centralizado, sidebar + área principal)**
  Ver PRD § "Instruções Visuais" > "Layout".
  **Critério de aprovação:** página tem fundo cinza escuro, conteúdo centralizado com largura máxima de 800px, card branco com bordas bem arredondadas, dividido visualmente em sidebar e área principal.

- [ ] **5.2 Layout responsivo mobile-first**
  Ver PRD § "Layout" (mobile-first, sidebar em cima em telas pequenas, à esquerda em telas maiores).
  **Critério de aprovação:** em viewport estreito (ex: 375px) o sidebar aparece acima da área principal; em viewport largo (ex: 1280px) o sidebar aparece à esquerda da área principal.

- [ ] **5.3 Campo de busca com submit por botão e por Enter**
  Ver PRD § "Requisitos Funcionais" (item 1).
  **Critério de aprovação:** digitar uma cidade e pressionar Enter dispara a busca; digitar uma cidade e clicar no botão de busca também dispara a busca.

---

## 6. Interface — estados

- [ ] **6.1 Estado vazio (empty state)**
  Ver PRD § "Estado vazio".
  **Critério de aprovação:** ao carregar a aplicação pela primeira vez (sem busca realizada), só o campo de busca é exibido em destaque, com instrução clara para digitar o nome da cidade.

- [ ] **6.2 Estado de loading**
  Ver PRD § "Loading" e § "Requisitos Funcionais" (item 1).
  **Critério de aprovação:** entre o disparo da busca e a resposta (geocoding + forecast), um indicador visual de carregamento é exibido; ele desaparece assim que o resultado (sucesso ou erro) é exibido.

- [ ] **6.3 Estado de erro / não encontrado com nova tentativa**
  Ver PRD § "Erro / não encontrado" e § "Tratamento de falhas".
  **Critério de aprovação:** ao buscar cidade inexistente ou ao falhar a consulta de clima, é exibida mensagem clara de erro; o usuário consegue fazer uma nova busca em seguida sem recarregar a página.

- [ ] **6.4 Estado de sucesso — Sidebar**
  Ver PRD § "Sidebar (informações principais)".
  **Critério de aprovação:** ao buscar uma cidade válida, a sidebar exibe: temperatura atual, nome da cidade + `country_code`, data atual formatada em português no timezone da cidade, indicador de dia/noite (ícone sol/lua + texto) baseado em `is_day`, e a interpretação em português do `weather_code`.

- [ ] **6.5 Estado de sucesso — Área principal**
  Ver PRD § "Área principal (detalhes adicionais)".
  **Critério de aprovação:** a área principal exibe: humidade relativa, temperatura aparente, probabilidade de precipitação, e velocidade do vento com direção (grau + cardeal) — todos com as unidades vindas de `current_units`.

---

## 7. Validação final

- [ ] **7.1 Revisar todos os Critérios de Aceitação do PRD**
  Ver PRD § "Critérios de Aceitação".
  **Critério de aprovação:** cada item da checklist de aceitação do PRD foi manualmente verificado e pode ser marcado como concluído.

- [ ] **7.2 Teste manual cross-device (mobile e desktop)**
  Ver PRD § "Layout" (mobile-first) e § "Requisitos de Sistema" (compatibilidade com navegadores modernos).
  **Critério de aprovação:** fluxo completo (busca → loading → sucesso/erro) testado e funcional em pelo menos uma viewport mobile e uma desktop, em um navegador moderno.
