const CARDINAL_POINTS = [
  "N",
  "NE",
  "L/E",
  "SE",
  "S",
  "SO/SW",
  "O/W",
  "NO/NW",
] as const;

export function windDirection(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 45) % 8;
  return CARDINAL_POINTS[index];
}
