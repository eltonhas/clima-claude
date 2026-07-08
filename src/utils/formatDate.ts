export function formatDate(timezone: string, date: Date = new Date()): string {
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: timezone,
  }).format(date);

  return formatted.replace(/^(\p{L})/u, (letter) => letter.toLowerCase());
}
