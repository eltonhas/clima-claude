const WEATHER_CODE_DESCRIPTIONS: Record<number, string> = {
  0: "Céu limpo",
  1: "Parcialmente nublado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Névoa",
  48: "Nevoeiro",
  51: "Chuvisco: intensidade leve",
  53: "Chuvisco: intensidade moderada",
  55: "Chuvisco: intensidade densa",
  56: "Chuvisco congelante: leve",
  57: "Chuvisco congelante: denso",
  61: "Chuva: fraca",
  63: "Chuva: moderada",
  65: "Chuva: forte",
  66: "Chuva congelante: leve",
  67: "Chuva congelante: forte",
  71: "Neve: fraca",
  73: "Neve: moderada",
  75: "Neve: forte",
  77: "Grãos de neve",
  80: "Pancadas de chuva: fraca",
  81: "Pancadas de chuva: moderada",
  82: "Pancadas de chuva: intensa",
  85: "Pancadas de neve fracas",
  86: "Pancadas de neve fortes",
  95: "Trovoada: fraca ou moderada",
  96: "Trovoada com granizo",
  99: "Trovoada com granizo",
};

const DEFAULT_DESCRIPTION = "Desconhecido";

export function weatherCodeDescription(weatherCode: number): string {
  return WEATHER_CODE_DESCRIPTIONS[weatherCode] ?? DEFAULT_DESCRIPTION;
}
