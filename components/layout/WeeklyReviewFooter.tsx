"use client";

import { usePathname } from "next/navigation";
import { useWeek52Nav } from "@/context/Week52Context";
import { WeeklyReviewEditor } from "@/components/weekly/WeeklyReviewEditor";

const WEEKLY_FOOTER_PATHS = new Set<string>(["/journey"]);

export function WeeklyReviewFooter() {
  const pathname = usePathname();
  const { focusWeek } = useWeek52Nav();

  if (pathname === "/weekly") return null;
  if (!WEEKLY_FOOTER_PATHS.has(pathname)) return null;

  return (
    <section
      className="mt-20 border-t border-[var(--border-subtle)] pt-12"
      aria-labelledby="weekly-review-footer-heading"
    >
      <WeeklyReviewEditor programWeek={focusWeek} headingId="weekly-review-footer-heading" />
    </section>
  );
}
