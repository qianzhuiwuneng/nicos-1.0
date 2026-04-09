"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLanguage } from "@/context/LanguageContext";
import { useWeek52Nav } from "@/context/Week52Context";
import { getWeek52Entry } from "@/lib/week52-data";
import { loadYearTheme } from "@/lib/yearThemeStorage";
import { feelingEntries, lookEntries, ledgerEntries } from "@/lib/data";

export default function DashboardPage() {
  const { t, locale } = useLanguage();
  const { focusWeek } = useWeek52Nav();
  const [yearTheme, setYearTheme] = useState("");

  useEffect(() => {
    setYearTheme(loadYearTheme());
  }, []);

  const currentWeek = getWeek52Entry(focusWeek);
  const thisWeekTitle = currentWeek
    ? locale === "zh"
      ? currentWeek.titleZh
      : currentWeek.titleEn
    : "";

  const gentleSnapshot = useMemo(() => {
    const latestFeeling = feelingEntries[0]?.title ?? "—";
    const latestLook = lookEntries[0]?.title ?? "—";
    const latestLedger = ledgerEntries[0]?.title ?? "—";
    return { latestFeeling, latestLook, latestLedger };
  }, []);

  return (
    <AppLayout title={t("home.title")} description={t("home.description")} narrow>
      <div className="mx-auto max-w-[var(--content-width)] pb-12">
        <p className="max-w-2xl text-[16px] leading-[var(--line-height-relaxed)] text-[var(--foreground)]/90">
          {t("home.opener")}
        </p>

        <div className="mt-10 rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--card)] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            {t("home.yearThemeLine")}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--foreground)]">
            {yearTheme || t("home.yearThemeUnset")}
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <section className="rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--card)] p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
              {t("home.thisWeekLabel")}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--foreground)]">
              {locale === "zh" ? `第 ${focusWeek} 周` : `Week ${focusWeek}`}
              {thisWeekTitle && (
                <>
                  <span className="text-[var(--muted-foreground)]"> · </span>
                  {thisWeekTitle}
                </>
              )}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/this-week"
                className="text-[13px] font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
              >
                {t("home.openThisWeek")}
              </Link>
              <Link
                href={`/journey?week=${focusWeek}`}
                className="text-[13px] font-medium text-[var(--muted-foreground)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
              >
                {t("home.openJourney")}
              </Link>
            </div>
          </section>

          <section className="rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--card)] p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
              {t("home.archiveHint")}
            </p>
            <ul className="mt-3 space-y-2 text-[14px] text-[var(--foreground)]/88">
              <li>{gentleSnapshot.latestFeeling}</li>
              <li>{gentleSnapshot.latestLook}</li>
              <li>{gentleSnapshot.latestLedger}</li>
            </ul>
          </section>
        </div>

        <section className="mt-10 rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--card)] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            {t("home.insightsHint")}
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            <Link
              href="/weekly"
              className="text-[13px] font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
            >
              {t("nav.weeklyInsights")}
            </Link>
            <Link
              href="/monthly"
              className="text-[13px] font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
            >
              {t("nav.monthlyPatterns")}
            </Link>
            <Link
              href="/insights/memory"
              className="text-[13px] font-medium text-[var(--muted-foreground)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
            >
              {t("nav.memorySurface")}
            </Link>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
