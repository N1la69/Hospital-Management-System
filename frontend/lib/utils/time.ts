export function formatInstantToLocalTime(iso: string): string {
  const date = new Date(iso);

  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  ).toDateString();
}
