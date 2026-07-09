import "./style.css";
import { performSearch } from "./search.ts";
import { formatDate, windDirection, weatherCodeDescription } from "./utils/index.ts";
import type { CityResult, WeatherResult } from "./types/index.ts";

type AppState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; city: CityResult; weather: WeatherResult };

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <header class="search-bar">
    <form id="search-form" class="search-form">
      <input
        id="city-input"
        type="text"
        name="city"
        placeholder="Digite o nome da cidade"
        autocomplete="off"
        required
      />
      <button id="search-button" type="submit">Buscar</button>
    </form>
  </header>

  <div id="state-container"></div>
`;

const form = document.querySelector<HTMLFormElement>("#search-form")!;
const cityInput = document.querySelector<HTMLInputElement>("#city-input")!;
const searchButton = document.querySelector<HTMLButtonElement>("#search-button")!;
const stateContainer = document.querySelector<HTMLDivElement>("#state-container")!;

function renderIdle(): string {
  return `
    <p class="empty-state">Digite o nome de uma cidade para ver o clima atual.</p>
  `;
}

function renderLoading(): string {
  return `
    <div class="loading" role="status">
      <span class="spinner" aria-hidden="true"></span>
      Carregando...
    </div>
  `;
}

function renderError(): string {
  return `
    <div class="error-state" role="alert">
      <p>Não foi possível encontrar essa cidade. Verifique o nome e tente novamente.</p>
    </div>
  `;
}

function renderSuccess(city: CityResult, weather: WeatherResult): string {
  const { current, current_units } = weather;

  const dayNightIcon = current.is_day ? "☀️" : "🌙";
  const dayNightText = current.is_day ? "Dia" : "Noite";

  return `
    <main class="card">
      <aside class="sidebar">
        <p class="temperature">${current.temperature_2m}${current_units.temperature_2m}</p>
        <p class="city-name">${city.name}, ${city.country_code}</p>
        <p class="current-date">${formatDate(city.timezone)}</p>
        <p class="day-night">${dayNightIcon} ${dayNightText}</p>
        <p class="weather-description">${weatherCodeDescription(current.weather_code)}</p>
      </aside>
      <section class="details">
        <div class="detail-item">
          <span class="label">Humidade relativa</span>
          <span class="value">${current.relative_humidity_2m}${current_units.relative_humidity_2m}</span>
        </div>
        <div class="detail-item">
          <span class="label">Sensação térmica</span>
          <span class="value">${current.apparent_temperature}${current_units.apparent_temperature}</span>
        </div>
        <div class="detail-item">
          <span class="label">Probabilidade de chuva</span>
          <span class="value">${current.precipitation_probability}${current_units.precipitation_probability}</span>
        </div>
        <div class="detail-item">
          <span class="label">Vento</span>
          <span class="value">${current.wind_speed_10m}${current_units.wind_speed_10m} ${current.wind_direction_10m}° (${windDirection(current.wind_direction_10m)})</span>
        </div>
      </section>
    </main>
  `;
}

function setState(state: AppState): void {
  searchButton.disabled = state.status === "loading";
  cityInput.disabled = state.status === "loading";

  switch (state.status) {
    case "idle":
      stateContainer.innerHTML = renderIdle();
      break;
    case "loading":
      stateContainer.innerHTML = renderLoading();
      break;
    case "error":
      stateContainer.innerHTML = renderError();
      break;
    case "success":
      stateContainer.innerHTML = renderSuccess(state.city, state.weather);
      break;
  }
}

setState({ status: "idle" });

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const cityName = cityInput.value.trim();
  if (!cityName) {
    return;
  }

  const result = await performSearch(cityName, {
    onLoadingChange: (loading) => {
      if (loading) {
        setState({ status: "loading" });
      }
    },
  });

  if (result.status === "success") {
    setState({ status: "success", city: result.city, weather: result.weather });
  } else {
    setState({ status: "error" });
  }
});
