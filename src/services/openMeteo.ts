import type { CityResult, WeatherResult } from "../types/index.ts";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const REQUIRED_CURRENT_FIELDS = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "is_day",
  "wind_speed_10m",
  "wind_direction_10m",
  "precipitation_probability",
] as const;

export async function searchCity(name: string): Promise<CityResult | null> {
  if (!name || !name.trim()) {
    return null;
  }

  const url = new URL(GEOCODING_URL);
  url.searchParams.set("name", name.trim());
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "pt");
  url.searchParams.set("format", "json");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const result = data?.results?.[0];
    if (!result) {
      return null;
    }

    const { name: cityName, latitude, longitude, country_code, timezone } = result;
    if (
      typeof cityName !== "string" ||
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      typeof country_code !== "string" ||
      typeof timezone !== "string"
    ) {
      return null;
    }

    return { name: cityName, latitude, longitude, country_code, timezone };
  } catch {
    return null;
  }
}

export async function getWeather(
  latitude: number,
  longitude: number,
  timezone: string,
): Promise<WeatherResult | null> {
  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    Number.isNaN(latitude) ||
    Number.isNaN(longitude) ||
    !timezone
  ) {
    return null;
  }

  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "current",
    "precipitation_probability,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,wind_direction_10m,precipitation,weather_code",
  );
  url.searchParams.set("timezone", timezone);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const current = data?.current;
    const currentUnits = data?.current_units;

    if (!current || !currentUnits) {
      return null;
    }

    const hasAllRequiredFields = REQUIRED_CURRENT_FIELDS.every(
      (field) => current[field] !== undefined && current[field] !== null,
    );
    if (!hasAllRequiredFields) {
      return null;
    }

    return { current, current_units: currentUnits };
  } catch {
    return null;
  }
}
