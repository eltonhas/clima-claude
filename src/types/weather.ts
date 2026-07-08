export type CityResult = {
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  timezone: string;
};

export type CurrentUnits = {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  is_day: string;
  precipitation: string;
  precipitation_probability: string;
  weather_code: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
};

export type CurrentWeather = {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: 0 | 1;
  precipitation: number;
  precipitation_probability: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
};

export type WeatherResult = {
  current_units: CurrentUnits;
  current: CurrentWeather;
};
