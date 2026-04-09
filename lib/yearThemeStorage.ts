const KEY = "nicos-year-theme";

export function loadYearTheme(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(KEY) ?? "";
}

export function saveYearTheme(value: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, value.trim());
}
