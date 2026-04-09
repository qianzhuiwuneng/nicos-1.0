"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, ListOrdered } from "lucide-react";
import { WEEK52_ENTRIES, WEEK52_PHASES } from "@/lib/week52-data";
import { useLanguage } from "@/context/LanguageContext";
import { useWeek52Nav } from "@/context/Week52Context";
import { cn } from "@/lib/utils";

const OPEN_KEY = "nicos-program52-sidebar-open";

function readOpen(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(OPEN_KEY) === "1";
}

/** Keeps focus week in sync with ?week= when on /program (mounted even when list is collapsed). */
function Week52UrlSyncInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setFocusWeek } = useWeek52Nav();

  useEffect(() => {
    if (pathname !== "/program") return;
    const w = parseInt(searchParams.get("week") ?? "", 10);
    if (!Number.isNaN(w) && w >= 1 && w <= 52) {
      setFocusWeek(w);
    }
  }, [pathname, searchParams, setFocusWeek]);

  return null;
}

function Week52UrlSync() {
  return (
    <Suspense fallback={null}>
      <Week52UrlSyncInner />
    </Suspense>
  );
}

function Week52WeekListInner() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { focusWeek, setFocusWeek } = useWeek52Nav();

  const urlWeek = parseInt(searchParams.get("week") ?? "", 10);
  const resolvedHighlightWeek =
    pathname === "/program"
      ? !Number.isNaN(urlWeek) && urlWeek >= 1 && urlWeek <= 52
        ? urlWeek
        : focusWeek
      : focusWeek;

  const goWeek = (week: number) => {
    setFocusWeek(week);
    router.push(`/program?week=${week}`);
  };

  const entriesByPhase = WEEK52_PHASES.map((phase) => ({
    phase,
    weeks: WEEK52_ENTRIES.filter((e) => e.phaseId === phase.id),
  }));

  return (
    <nav
      className="max-h-[min(52vh,28rem)] overflow-y-auto overflow-x-hidden pr-0.5"
      aria-label={t("program.railLabel")}
    >
      {entriesByPhase.map(({ phase, weeks }) => (
        <div key={phase.id} className="mb-2 last:mb-0">
          <p className="sticky top-0 z-[1] bg-[var(--sidebar-bg)] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
            {locale === "zh" ? phase.nameZh : phase.nameEn}
          </p>
          <ul className="space-y-px">
            {weeks.map((entry) => {
              const active = resolvedHighlightWeek === entry.week;
              const label = locale === "zh" ? entry.titleZh : entry.titleEn;
              return (
                <li key={entry.week}>
                  <button
                    type="button"
                    onClick={() => goWeek(entry.week)}
                    className={cn(
                      "flex w-full items-start gap-1.5 rounded-[var(--radius-sm)] px-2 py-1 text-left text-[11px] leading-snug transition-colors",
                      active
                        ? "bg-[var(--card)] font-medium text-[var(--foreground)] shadow-[var(--shadow-card)]"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 shrink-0 tabular-nums text-[9px] font-semibold",
                        active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
                      )}
                    >
                      {entry.week}
                    </span>
                    <span className="min-w-0 break-words">{label}</span>
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

function Week52WeekList() {
  const { t } = useLanguage();
  return (
    <Suspense
      fallback={
        <p className="px-2 py-2 text-[11px] text-[var(--muted-foreground)]">{t("program.loading")}</p>
      }
    >
      <Week52WeekListInner />
    </Suspense>
  );
}

export function Program52SidebarSection() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [open, setOpenState] = useState(false);

  useEffect(() => {
    setOpenState(readOpen());
  }, []);

  useEffect(() => {
    if (!pathname.startsWith("/program")) return;
    setOpenState(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(OPEN_KEY, "1");
    }
  }, [pathname]);

  const setOpen = useCallback((next: boolean) => {
    setOpenState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(OPEN_KEY, next ? "1" : "0");
    }
  }, []);

  const isProgramActive = pathname.startsWith("/program");

  return (
    <div className="space-y-px">
      <Week52UrlSync />
      <div
        className={cn(
          "flex items-stretch gap-0.5 rounded-[var(--radius-sm)] transition-colors",
          isProgramActive && !open && "bg-[var(--accent)]"
        )}
      >
        <Link
          href="/program"
          className={cn(
            "flex min-w-0 flex-1 items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-[13px] transition-colors",
            isProgramActive
              ? "font-medium text-[var(--accent-foreground)]"
              : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/60 hover:text-[var(--foreground)]"
          )}
        >
          <ListOrdered className="h-[18px] w-[18px] shrink-0 opacity-70" strokeWidth={1.5} />
          <span className="truncate">{t("nav.program52")}</span>
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-label={t("program.toggleWeekListAria")}
          onClick={(e) => {
            e.preventDefault();
            setOpen(!open);
          }}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-[var(--radius-sm)] px-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]/60 hover:text-[var(--foreground)]",
            open && "text-[var(--foreground)]"
          )}
        >
          <ChevronRight
            className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-90")}
            strokeWidth={1.5}
          />
        </button>
      </div>
      {open && (
        <div className="mt-1 border-l border-[var(--border-subtle)] pl-2">
          <p className="px-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
            {t("program.railTitle")}
          </p>
          <p className="px-2 pb-2 text-[11px] leading-snug text-[var(--muted-foreground)]">
            {t("program.railHint")}
          </p>
          <Week52WeekList />
        </div>
      )}
    </div>
  );
}
