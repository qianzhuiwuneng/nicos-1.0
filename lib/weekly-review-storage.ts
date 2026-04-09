const STORAGE_PREFIX = "nicos-week-review-v3-w";

export type WeeklyReviewValues = Record<string, string>;

export function weeklyReviewStorageKey(programWeek: number): string {
  return STORAGE_PREFIX + programWeek;
}

export function loadWeeklyReviewValues(programWeek: number): WeeklyReviewValues {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(weeklyReviewStorageKey(programWeek));
    if (!raw) return {};
    const p = JSON.parse(raw) as { values?: Record<string, unknown> };
    if (!p?.values || typeof p.values !== "object") return {};
    const out: WeeklyReviewValues = {};
    for (const [k, v] of Object.entries(p.values)) {
      if (typeof v === "string") out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export function saveWeeklyReviewValues(programWeek: number, values: WeeklyReviewValues): void {
  localStorage.setItem(
    weeklyReviewStorageKey(programWeek),
    JSON.stringify({ version: 3, values })
  );
}

export function hasAnyValue(values: WeeklyReviewValues, promptIds: string[]): boolean {
  return promptIds.some((id) => (values[id] ?? "").trim().length > 0);
}

export function hasAnyStoredValue(values: WeeklyReviewValues): boolean {
  return Object.values(values).some((v) => v.trim().length > 0);
}

export function getLocallyCompletedProgramWeeks(maxWeek = 52): Set<number> {
  if (typeof window === "undefined") return new Set<number>();
  const out = new Set<number>();
  for (let week = 1; week <= maxWeek; week += 1) {
    const values = loadWeeklyReviewValues(week);
    if (hasAnyStoredValue(values)) out.add(week);
  }
  return out;
}
