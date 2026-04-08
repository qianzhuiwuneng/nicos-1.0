"use client";

import Link from "next/link";
import { CalendarDays, Calendar, LayoutTemplate, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const linkKeys = [
  { href: "/weekly", key: "dashboard.weeklyReview", icon: CalendarDays },
  { href: "/monthly", key: "dashboard.monthlyReflection", icon: Calendar },
  { href: "/templates", key: "dashboard.stableTemplates", icon: LayoutTemplate },
  { href: "/identity", key: "dashboard.identityNotes", icon: User },
] as const;

export function QuickLinks() {
  const { t } = useLanguage();

  return (
    <section>
      <h2 className="mb-4 text-[12px] font-medium uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
        {t("dashboard.quickLinks")}
      </h2>
      <div className="flex flex-wrap gap-2">
        {linkKeys.map(({ href, key, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--border-subtle)] bg-[var(--card)] px-4 py-2 text-[13px] font-medium text-[var(--foreground)] shadow-[var(--shadow-card)] transition-all hover:border-[var(--border)] hover:shadow-[var(--shadow-float)]"
          >
            <Icon className="h-4 w-4 text-[var(--muted-foreground)]" strokeWidth={1.5} />
            {t(key)}
          </Link>
        ))}
      </div>
    </section>
  );
}
