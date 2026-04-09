"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLanguage } from "@/context/LanguageContext";
import { useWeek52Nav } from "@/context/Week52Context";
import { getWeek52Entry } from "@/lib/week52-data";
import { loadYearTheme } from "@/lib/yearThemeStorage";
import { surfaceLineCandidates } from "@/lib/surface-lines";
import { getWeeklyReviewPrompts } from "@/lib/weekly-review-prompts";
import { loadWeeklyReviewValues, type WeeklyReviewValues } from "@/lib/weekly-review-storage";
import { fetchWeeklyReviewCloud } from "@/lib/weekly-review-cloud";

type SurfacedLine = {
  id: string;
  text: string;
  week: number;
  month: number;
  sectionTitle: string;
  link: string;
};

function mergeValues(remote: WeeklyReviewValues, local: WeeklyReviewValues): WeeklyReviewValues {
  const out: WeeklyReviewValues = { ...local };
  for (const [k, v] of Object.entries(remote)) {
    if (typeof v === "string" && v.trim().length > 0) out[k] = v;
  }
  return out;
}

function pickExcerpt(source: string, max = 110): string {
  const compact = source.replace(/\s+/g, " ").trim();
  if (compact.length <= max) return compact;
  return `${compact.slice(0, max).trimEnd()}…`;
}

function randomPick<T>(list: T[], excludeIndex?: number): { value: T; index: number } | null {
  if (list.length === 0) return null;
  if (list.length === 1) return { value: list[0], index: 0 };
  let idx = Math.floor(Math.random() * list.length);
  if (excludeIndex != null && idx === excludeIndex) idx = (idx + 1) % list.length;
  return { value: list[idx], index: idx };
}

export default function DashboardPage() {
  const { t, locale } = useLanguage();
  const { focusWeek } = useWeek52Nav();
  const [yearTheme, setYearTheme] = useState("");
  const [linePool, setLinePool] = useState<SurfacedLine[]>([]);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);

  useEffect(() => {
    setYearTheme(loadYearTheme());
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const byWeek = new Map<number, WeeklyReviewValues>();
      for (const c of surfaceLineCandidates) {
        if (!byWeek.has(c.week)) {
          const local = loadWeeklyReviewValues(c.week);
          const remote = await fetchWeeklyReviewCloud(c.week);
          byWeek.set(c.week, mergeValues(remote, local));
        }
      }

      const built: SurfacedLine[] = [];
      for (const candidate of surfaceLineCandidates) {
        if (!candidate.surfaceable) continue;
        const values = byWeek.get(candidate.week) ?? {};
        const full = (values[candidate.promptId] ?? "").trim();
        if (!full) continue;
        const prompts = getWeeklyReviewPrompts(candidate.week, locale);
        const sectionTitle =
          prompts.find((p) => p.id === candidate.promptId)?.label ??
          (locale === "zh" ? "周复盘条目" : "Weekly reflection section");
        built.push({
          id: candidate.id,
          text: pickExcerpt(full),
          week: candidate.week,
          month: candidate.month,
          sectionTitle,
          link: `/weekly/week-${candidate.week}`,
        });
      }

      if (!cancelled) {
        setLinePool(built);
        const picked = randomPick(built);
        setActiveLineIndex(picked?.index ?? null);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const activeLine = useMemo(
    () => (activeLineIndex == null ? null : (linePool[activeLineIndex] ?? null)),
    [activeLineIndex, linePool]
  );

  const onRefreshLine = () => {
    const picked = randomPick(linePool, activeLineIndex ?? undefined);
    if (picked) setActiveLineIndex(picked.index);
  };

  const currentWeek = getWeek52Entry(focusWeek);
  const thisWeekTitle = currentWeek
    ? locale === "zh"
      ? currentWeek.titleZh
      : currentWeek.titleEn
    : "";

  return (
    <AppLayout title={t("home.title")} description={t("home.description")} narrow>
      <div className="mx-auto max-w-[42rem] pb-20 pt-2">
        <p className="max-w-xl text-[15px] leading-[1.9] text-[var(--foreground)]/88">
          {t("home.opener")}
        </p>

        <section className="mt-16 border-t border-[var(--border-subtle)] pt-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--muted-foreground)]">
            {t("home.yearThemeLine")}
          </p>
          <p className="mt-3 text-[15px] leading-[1.85] text-[var(--foreground)]/90">
            {yearTheme || t("home.yearThemeUnset")}
          </p>
        </section>

        <section className="mt-12 border-t border-[var(--border-subtle)] pt-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--muted-foreground)]">
            {t("home.thisWeekLabel")}
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--foreground)]/90">
            {locale === "zh" ? `第 ${focusWeek} 周` : `Week ${focusWeek}`}
            {thisWeekTitle && (
              <>
                <span className="text-[var(--muted-foreground)]"> · </span>
                {thisWeekTitle}
              </>
            )}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/this-week"
              className="text-[13px] font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
            >
              {t("home.openThisWeek")}
            </Link>
            <Link
              href={`/journey?week=${focusWeek}`}
              className="text-[13px] font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
            >
              {t("home.openJourney")}
            </Link>
            <Link
              href="/insights/memory"
              className="text-[13px] font-medium text-[var(--muted-foreground)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
            >
              {t("nav.memorySurface")}
            </Link>
          </div>
        </section>

        <section className="mt-12 border-t border-[var(--border-subtle)] pt-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--muted-foreground)]">
            {t("home.archiveHint")}
          </p>
          <p className="mt-3 max-w-xl text-[14px] leading-[1.9] text-[var(--muted-foreground)]">
            {locale === "zh"
              ? "回到感受、穿搭、账本、阅读与观影。让已经发生的事慢慢变得更清楚。"
              : "Return to feelings, looks, ledger, reading, and watching. Let what already happened become clearer over time."}
          </p>
        </section>

        <section className="mt-12 border-t border-[var(--border-subtle)] pt-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--muted-foreground)]">
            {locale === "zh" ? "此刻一句" : "A Line for Now"}
          </p>
          {activeLine ? (
            <>
              <p className="mt-4 text-[15px] leading-[1.9] text-[var(--foreground)]/92">“{activeLine.text}”</p>
              <p className="mt-3 text-[12px] text-[var(--muted-foreground)]">
                {locale === "zh"
                  ? `来自第 ${activeLine.week} 周 · ${activeLine.sectionTitle}`
                  : `From Week ${activeLine.week} · ${activeLine.sectionTitle}`}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                <button
                  type="button"
                  onClick={onRefreshLine}
                  className="text-[13px] font-medium text-[var(--muted-foreground)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
                >
                  {locale === "zh" ? "换一句" : "Refresh"}
                </button>
                <Link
                  href={activeLine.link}
                  className="text-[13px] font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
                >
                  {locale === "zh" ? "打开来源" : "Open Source"}
                </Link>
              </div>
            </>
          ) : (
            <p className="mt-4 text-[13px] text-[var(--muted-foreground)]">
              {locale === "zh"
                ? "还没有可浮现的句子。先在周复盘里保存阅读感悟。"
                : "No surfaceable line yet. Save reflection lines in weekly notes first."}
            </p>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
