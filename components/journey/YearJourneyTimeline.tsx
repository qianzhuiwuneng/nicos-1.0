"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { WEEK52_ENTRIES, WEEK52_PHASES } from "@/lib/week52-data";
import { useLanguage } from "@/context/LanguageContext";
import { useWeek52Nav } from "@/context/Week52Context";
import { cn } from "@/lib/utils";
import { getLocallyCompletedProgramWeeks } from "@/lib/weekly-review-storage";
import { fetchWeeklyCompletedWeeksCloud } from "@/lib/weekly-review-cloud";

function Week52UrlSyncInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setFocusWeek } = useWeek52Nav();

  useEffect(() => {
    if (pathname !== "/journey") return;
    const w = parseInt(searchParams.get("week") ?? "", 10);
    if (!Number.isNaN(w) && w >= 1 && w <= 52) {
      setFocusWeek(w);
    }
  }, [pathname, searchParams, setFocusWeek]);

  return null;
}

export function YearJourneyUrlSync() {
  return (
    <Suspense fallback={null}>
      <Week52UrlSyncInner />
    </Suspense>
  );
}

function WeekListInner() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { focusWeek, setFocusWeek } = useWeek52Nav();
  const [completedWeeks, setCompletedWeeks] = useState<Set<number>>(new Set<number>());

  const urlWeek = parseInt(searchParams.get("week") ?? "", 10);
  const resolvedHighlightWeek =
    pathname === "/journey"
      ? !Number.isNaN(urlWeek) && urlWeek >= 1 && urlWeek <= 52
        ? urlWeek
        : focusWeek
      : focusWeek;

  const goWeek = (week: number) => {
    setFocusWeek(week);
    router.push(`/journey?week=${week}`);
  };

  useEffect(() => {
    let cancelled = false;

    const syncCompleted = async () => {
      const localSet = getLocallyCompletedProgramWeeks(52);
      const cloudSet = await fetchWeeklyCompletedWeeksCloud();
      if (cancelled) return;

      const merged = new Set<number>(localSet);
      for (const w of cloudSet) merged.add(w);
      setCompletedWeeks(merged);
    };

    void syncCompleted();

    const bump = () => {
      void syncCompleted();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith("nicos-week-review-v3-w")) bump();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("nicos-weekly-review-saved", bump);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("nicos-weekly-review-saved", bump);
    };
  }, []);

  const entriesByPhase = WEEK52_PHASES.map((phase) => ({
    phase,
    weeks: WEEK52_ENTRIES.filter((e) => e.phaseId === phase.id),
  }));

  return (
    <nav
      className="max-h-[min(70vh,36rem)] overflow-y-auto overflow-x-hidden pr-1"
      aria-label={t("program.railLabel")}
    >
      {entriesByPhase.map(({ phase, weeks }) => (
        <div key={phase.id} className="mb-4 last:mb-0">
          <p className="sticky top-0 z-[1] bg-[var(--background)] px-1 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
            {locale === "zh" ? phase.nameZh : phase.nameEn}
          </p>
          <ul className="space-y-0.5">
            {weeks.map((entry) => {
              const active = resolvedHighlightWeek === entry.week;
              const label = locale === "zh" ? entry.titleZh : entry.titleEn;
              return (
                <li key={entry.week}>
                  <button
                    type="button"
                    onClick={() => goWeek(entry.week)}
                    className={cn(
                      "flex w-full items-start gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-left text-[12px] leading-snug transition-colors",
                      active
                        ? "bg-[var(--accent)] font-medium text-[var(--accent-foreground)]"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50 hover:text-[var(--foreground)]"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 shrink-0 tabular-nums text-[10px] font-semibold",
                        active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
                      )}
                    >
                      {entry.week}
                    </span>
                    <span className="min-w-0 break-words">{label}</span>
                    <span
                      className={cn(
                        "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                        completedWeeks.has(entry.week) ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                      )}
                      aria-hidden
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function YearJourneyTimeline() {
  const { t } = useLanguage();
  return (
    <Suspense
      fallback={
        <p className="py-4 text-[12px] text-[var(--muted-foreground)]">{t("program.loading")}</p>
      }
    >
      <WeekListInner />
    </Suspense>
  );
}
