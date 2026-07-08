import "./style.css";
import { performSearch } from "./search.ts";

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

  <main id="result-card" class="card">
    <aside class="sidebar">
      <p class="temperature" id="temperature">—</p>
      <p class="city-name" id="city-name">—</p>
      <p class="current-date" id="current-date">—</p>
      <p class="day-night" id="day-night">—</p>
      <p class="weather-description" id="weather-description">—</p>
    </aside>
    <section class="details">
      <div class="detail-item">
        <span class="label">Humidade relativa</span>
        <span class="value" id="humidity">—</span>
      </div>
      <div class="detail-item">
        <span class="label">Sensação térmica</span>
        <span class="value" id="apparent-temperature">—</span>
      </div>
      <div class="detail-item">
        <span class="label">Probabilidade de chuva</span>
        <span class="value" id="precipitation-probability">—</span>
      </div>
      <div class="detail-item">
        <span class="label">Vento</span>
        <span class="value" id="wind">—</span>
      </div>
    </section>
  </main>
`;

const form = document.querySelector<HTMLFormElement>("#search-form")!;
const cityInput = document.querySelector<HTMLInputElement>("#city-input")!;
const searchButton = document.querySelector<HTMLButtonElement>("#search-button")!;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const cityName = cityInput.value.trim();
  if (!cityName) {
    return;
  }

  const result = await performSearch(cityName, {
    onLoadingChange: (loading) => {
      searchButton.disabled = loading;
    },
  });

  console.log(result);
});
