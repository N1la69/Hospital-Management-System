export function formatInstantToLocalTime(iso: string): string {
  const d = new Date(iso);

  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getLocalDateStringFromInstant(iso: string): string {
  const d = new Date(iso);

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}
