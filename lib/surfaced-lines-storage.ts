import { getWeeklyReviewPrompts } from "@/lib/weekly-review-prompts";
import type { Locale } from "@/lib/i18n";
import type { WeeklyReviewValues } from "@/lib/weekly-review-storage";
import { extractBoldSentences } from "@/lib/weekly-richtext";

const SURFACED_POOL_KEY = "nicos-surfaced-lines-v1";
const SURFACED_LAST_KEY = "nicos-surfaced-line-last-v1";

export type SurfacedLine = {
  id: string;
  text: string;
  week: number;
  month: number;
  sectionTitle: string;
  link: string;
};

function weekToMonth(week: number): number {
  return Math.floor((Math.max(1, week) - 1) / 4) + 1;
}

export function loadSurfacedLinePool(): SurfacedLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SURFACED_POOL_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr.filter((item): item is SurfacedLine => {
      if (!item || typeof item !== "object") return false;
      const v = item as Record<string, unknown>;
      return (
        typeof v.id === "string" &&
        typeof v.text === "string" &&
        typeof v.week === "number" &&
        typeof v.month === "number" &&
        typeof v.sectionTitle === "string" &&
        typeof v.link === "string"
      );
    });
  } catch {
    return [];
  }
}

function saveSurfacedLinePool(pool: SurfacedLine[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SURFACED_POOL_KEY, JSON.stringify(pool));
}

export function getLastSurfacedLineId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(SURFACED_LAST_KEY) ?? "";
}

export function setLastSurfacedLineId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SURFACED_LAST_KEY, id);
}

export function pickRandomSurfacedLine(pool: SurfacedLine[], excludeId?: string): SurfacedLine | null {
  if (pool.length === 0) return null;
  if (pool.length === 1) return pool[0];
  let idx = Math.floor(Math.random() * pool.length);
  if (excludeId && pool[idx]?.id === excludeId) idx = (idx + 1) % pool.length;
  return pool[idx] ?? pool[0];
}

export function updateSurfacedLinesForWeek(
  programWeek: number,
  values: WeeklyReviewValues,
  locale: Locale
): SurfacedLine[] {
  const prompts = getWeeklyReviewPrompts(programWeek, locale);
  const promptMap = new Map(prompts.map((p) => [p.id, p.label]));

  const nextWeekLines: SurfacedLine[] = [];
  for (const [promptId, raw] of Object.entries(values)) {
    const text = (raw ?? "").trim();
    if (!text) continue;
    const sentences = extractBoldSentences(text);
    if (sentences.length === 0) continue;
    const sectionTitle =
      promptMap.get(promptId) ?? (locale === "zh" ? "周复盘条目" : "Weekly reflection section");
    for (const sentence of sentences) {
      nextWeekLines.push({
        id: `w${programWeek}-${promptId}-${sentence.slice(0, 24)}`,
        text: sentence,
        week: programWeek,
        month: weekToMonth(programWeek),
        sectionTitle,
        link: `/weekly/week-${programWeek}`,
      });
    }
  }

  const existing = loadSurfacedLinePool();
  const merged = existing
    .filter((line) => line.week !== programWeek)
    .concat(nextWeekLines);

  saveSurfacedLinePool(merged);
  return merged;
}
