"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { WeeklyReviewDisplay } from "@/components/weekly/WeeklyReviewDisplay";
import { WeeklyCloudSetup } from "@/components/weekly/WeeklyCloudSetup";
import { weeklyReviews } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";
import { useWeek52Nav } from "@/context/Week52Context";
import { formatProgramWeekRangeLabel, getCurrentProgramWeek } from "@/lib/program-week";
import { getWeeklyReviewPrompts } from "@/lib/weekly-review-prompts";
import {
  type WeeklyReviewValues,
  getLocallyCompletedProgramWeeks,
  loadWeeklyReviewValues,
} from "@/lib/weekly-review-storage";
import {
  fetchWeeklyCompletedWeeksCloud,
  fetchWeeklyReviewCloud,
  mergeRemoteAndLocal,
} from "@/lib/weekly-review-cloud";
import { getWeeklyHubContent } from "@/lib/reading-journey";

function parseWeekSlug(slug: string | undefined): number | null {
  if (!slug) return null;
  const m = /^week-(\d{1,2})$/.exec(slug);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  if (Number.isNaN(n)) return null;
  return Math.min(52, Math.max(1, n));
}

export default function WeeklyDetailPage() {
  const { t, locale } = useLanguage();
  const { setFocusWeek } = useWeek52Nav();
  const router = useRouter();
  const params = useParams<{ weekSlug: string }>();
  const weekSlug = Array.isArray(params?.weekSlug) ? params.weekSlug[0] : params?.weekSlug;
  const selectedWeek = parseWeekSlug(weekSlug);

  const [dataRev, setDataRev] = useState(0);
  const [completedWeeks, setCompletedWeeks] = useState<Set<number>>(new Set<number>());
  const [values, setValues] = useState<WeeklyReviewValues>({});

  useEffect(() => {
    if (selectedWeek == null) {
      router.replace(`/weekly/week-${getCurrentProgramWeek()}`);
      return;
    }
    setFocusWeek(selectedWeek);
  }, [router, selectedWeek, setFocusWeek]);

  useEffect(() => {
    const bump = () => setDataRev((v) => v + 1);
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith("nicos-week-review-v3-w")) bump();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("nicos-weekly-review-saved", bump);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("nicos-weekly-review-saved", bump);
    };
  }, []);

  const selected =
    weeklyReviews.find((w) => w.programWeek === selectedWeek) ?? weeklyReviews[0];

  const prompts = useMemo(
    () => getWeeklyReviewPrompts(selected.programWeek, locale),
    [selected.programWeek, locale]
  );
  const weeklyHub = useMemo(() => getWeeklyHubContent(selected.programWeek), [selected.programWeek]);

  useEffect(() => {
    let cancelled = false;
    const ids = prompts.map((p) => p.id);
    const local = loadWeeklyReviewValues(selected.programWeek);
    const localNormalized: WeeklyReviewValues = {};
    for (const p of prompts) localNormalized[p.id] = local[p.id] ?? "";
    setValues(localNormalized);

    (async () => {
      const remote = await fetchWeeklyReviewCloud(selected.programWeek);
      if (cancelled) return;
      setValues(mergeRemoteAndLocal(remote, localNormalized, ids));
    })();

    return () => {
      cancelled = true;
    };
  }, [selected.programWeek, prompts, dataRev]);

  useEffect(() => {
    let cancelled = false;
    const localSet = getLocallyCompletedProgramWeeks(52);
    setCompletedWeeks(localSet);
    (async () => {
      const cloudSet = await fetchWeeklyCompletedWeeksCloud();
      if (cancelled) return;
      const merged = new Set<number>(localSet);
      for (const w of cloudSet) merged.add(w);
      setCompletedWeeks(merged);
    })();
    return () => {
      cancelled = true;
    };
  }, [dataRev]);

  const rangeLabel = formatProgramWeekRangeLabel(selected.weekStart, selected.weekEnd, locale);
  const programLabel = locale === "zh" ? `第 ${selected.programWeek} 周` : `Week ${selected.programWeek}`;

  return (
    <AppLayout title={t("weekly.title")} description={t("weekly.description")}>
      <div className="flex w-full max-w-none flex-col gap-10 lg:flex-row lg:gap-0">
        <aside className="w-full shrink-0 lg:w-[14rem] lg:shrink-0 lg:pr-8">
          <div className="max-h-[min(72vh,32rem)] space-y-0.5 overflow-y-auto rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--card)] p-2 lg:sticky lg:top-4">
            {weeklyReviews.map((w) => {
              const label = formatProgramWeekRangeLabel(w.weekStart, w.weekEnd, locale);
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => {
                    setFocusWeek(w.programWeek);
                    router.push(`/weekly/week-${w.programWeek}`);
                  }}
                  className={`w-full rounded-[var(--radius-sm)] px-3 py-2.5 text-left text-[12px] font-medium leading-snug transition-colors ${
                    selected.programWeek === w.programWeek
                      ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/60 hover:text-[var(--foreground)]"
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="block">{label}</span>
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        completedWeeks.has(w.programWeek)
                          ? "bg-[var(--primary)]"
                          : "bg-[var(--border)]"
                      }`}
                      aria-hidden
                    />
                  </span>
                  <span className="mt-0.5 block text-[10px] font-normal opacity-80">
                    {locale === "zh" ? `第 ${w.programWeek} 周` : `W${w.programWeek}`}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="min-w-0 flex-1 lg:border-l lg:border-[var(--border-subtle)] lg:pl-10 xl:pl-12">
          <WeeklyCloudSetup />
          <header className="mb-10 border-b border-[var(--border-subtle)] pb-8">
            <h2 className="text-[1.375rem] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] sm:text-2xl">
              {rangeLabel}
            </h2>
            <p className="mt-2 text-[13px] font-normal tracking-[-0.01em] text-[var(--muted-foreground)]">
              {programLabel}
            </p>
          </header>

          {prompts.length === 0 ? (
            <p className="max-w-[52rem] text-[13px] leading-[1.78] tracking-[-0.006em] text-[var(--muted-foreground)]">
              {t("weekly.pageNoPrompts")}
            </p>
          ) : (
            <WeeklyReviewDisplay prompts={prompts} values={values} />
          )}

          <section className="mt-12 border-t border-[var(--border-subtle)] pt-8">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
              This Week&apos;s Reading
            </h3>
            {weeklyHub.reading.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {weeklyHub.reading.map((book) => (
                  <article
                    key={book.id}
                    className="rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--card)]/55 p-4"
                  >
                    <div className={`aspect-[3/4] w-full max-w-[10.5rem] border border-[var(--border)] ${book.coverTone}`}>
                      <div className="flex h-full items-center justify-center px-3 text-center">
                        <p className="text-[15px] font-medium leading-snug text-[var(--foreground)]">{book.title}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                      {book.author}
                    </p>
                    <p className="mt-1 text-[14px] font-medium text-[var(--foreground)]">{book.title}</p>
                    <p className="mt-1 text-[12px] text-[var(--muted-foreground)]">{book.tagline}</p>
                    <Link
                      href={`/reading#week-${selected.programWeek}`}
                      className="mt-3 inline-flex text-[12px] font-medium text-[var(--primary)] underline-offset-4 hover:underline"
                    >
                      Open in Reading
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-[13px] text-[var(--muted-foreground)]">
                No linked reading for this week yet.
              </p>
            )}
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
