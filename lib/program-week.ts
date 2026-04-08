import type { Locale } from "@/lib/i18n";

/** 52 周方案第 1 周起始日（含）：2026-03-02，每周 7 天。 */
const WEEK_ONE_START = new Date(2026, 2, 2);

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function getProgramWeekBounds(programWeek: number): { weekStart: string; weekEnd: string } {
  const w = Math.min(52, Math.max(1, programWeek));
  const start = new Date(WEEK_ONE_START);
  start.setDate(WEEK_ONE_START.getDate() + (w - 1) * 7);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { weekStart: toISODate(start), weekEnd: toISODate(end) };
}

/** 例如 zh：`2026.3.2–2026.3.8`；en：`Mar 2 – Mar 8, 2026` */
export function formatProgramWeekRangeLabel(weekStart: string, weekEnd: string, locale: Locale): string {
  const s = new Date(weekStart + "T12:00:00");
  const e = new Date(weekEnd + "T12:00:00");
  if (locale === "zh") {
    return `${s.getFullYear()}.${s.getMonth() + 1}.${s.getDate()}–${e.getFullYear()}.${e.getMonth() + 1}.${e.getDate()}`;
  }
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${fmt.format(s)} – ${fmt.format(e)}`;
}
