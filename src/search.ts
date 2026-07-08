import { searchCity, getWeather } from "./services/openMeteo.ts";
import type { CityResult, WeatherResult } from "./types/index.ts";

export type SearchResult =
  | { status: "success"; city: CityResult; weather: WeatherResult }
  | { status: "not-found" };

export type SearchCallbacks = {
  onLoadingChange: (loading: boolean) => void;
};

export async function performSearch(
  cityName: string,
  callbacks: SearchCallbacks,
): Promise<SearchResult> {
  callbacks.onLoadingChange(true);

  try {
    const city = await searchCity(cityName);
    if (!city) {
      return { status: "not-found" };
    }

    const weather = await getWeather(city.latitude, city.longitude, city.timezone);
    if (!weather) {
      return { status: "not-found" };
    }

    return { status: "success", city, weather };
  } finally {
    callbacks.onLoadingChange(false);
  }
}
