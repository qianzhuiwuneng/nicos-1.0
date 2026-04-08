"use client";

import { Card, CardContent } from "@/components/ui/card";
import { weeklyFocus } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

export function WeeklyFocus() {
  const { t } = useLanguage();
  const { theme, microAdjustments, keywords } = weeklyFocus;

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-[12px] font-medium uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
          {t("dashboard.weeklyFocus")}
        </h2>
        <p className="mt-3 text-[15px] font-medium text-[var(--foreground)] leading-snug">
          {theme}
        </p>
        <ul className="mt-4 space-y-2 text-[14px] text-[var(--foreground)]/90 leading-[var(--line-height-relaxed)]">
          {microAdjustments.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[var(--muted-foreground)]">{i + 1}.</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          {keywords.map((k, i) => {
            const bg =
              i % 3 === 0
                ? "bg-[var(--whimsy-peach)]"
                : i % 3 === 1
                  ? "bg-[var(--whimsy-sky)]"
                  : "bg-[var(--whimsy-mint)]";
            return (
              <span
                key={k}
                className={`rounded-[var(--radius-pill)] px-3 py-1 text-[12px] font-medium text-[var(--foreground)] ${bg}`}
              >
                {k}
              </span>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
