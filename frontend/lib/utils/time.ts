export function formatInstantToLocalTime(iso: string): string {
  const date = new Date(iso);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // use true if you want AM/PM
  });
}
