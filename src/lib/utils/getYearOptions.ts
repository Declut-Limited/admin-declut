export function getYearOptions(yearsAhead = 5): string[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: yearsAhead + 1 }, (_, i) => String(currentYear + i));
}