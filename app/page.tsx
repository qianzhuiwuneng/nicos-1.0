"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLanguage } from "@/context/LanguageContext";
import { useWeek52Nav } from "@/context/Week52Context";
import { getWeek52Entry } from "@/lib/week52-data";
import { loadYearTheme } from "@/lib/yearThemeStorage";
import {
  getLastSurfacedLineId,
  loadSurfacedLinePool,
  pickRandomSurfacedLine,
  setLastSurfacedLineId,
  type SurfacedLine,
} from "@/lib/surfaced-lines-storage";

const useSafeLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function DashboardPage() {
  const { t, locale } = useLanguage();
  const { focusWeek } = useWeek52Nav();
  const [yearTheme, setYearTheme] = useState("");
  const [linePool, setLinePool] = useState<SurfacedLine[]>([]);
  const [activeLine, setActiveLine] = useState<SurfacedLine | null>(null);

  useSafeLayoutEffect(() => {
    setYearTheme(loadYearTheme());
  }, []);

  useSafeLayoutEffect(() => {
    const pool = loadSurfacedLinePool();
    setLinePool(pool);
    const lastId = getLastSurfacedLineId();
    const preferred = (lastId ? pool.find((line) => line.id === lastId) : undefined) ?? pool[0] ?? null;
    setActiveLine(preferred);
    if (preferred) setLastSurfacedLineId(preferred.id);
  }, [locale]);

  const onRefreshLine = () => {
    const picked = pickRandomSurfacedLine(linePool, activeLine?.id);
    if (!picked) return;
    setActiveLine(picked);
    setLastSurfacedLineId(picked.id);
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
              <p className="mt-4 text-[15px] leading-[1.9] text-[var(--foreground)]/92">{activeLine.text}</p>
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
