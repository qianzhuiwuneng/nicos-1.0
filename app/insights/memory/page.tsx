"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLanguage } from "@/context/LanguageContext";

export default function MemorySurfacePage() {
  const { t } = useLanguage();

  const links = [
    { href: "/feelings", label: t("insightsMemory.linkFeelings") },
    { href: "/looks", label: t("insightsMemory.linkLooks") },
    { href: "/reading", label: t("insightsMemory.linkReading") },
    { href: "/watching", label: t("insightsMemory.linkWatching") },
  ] as const;

  return (
    <AppLayout title={t("insightsMemory.title")} description={t("insightsMemory.description")} narrow>
      <p className="max-w-xl text-[15px] leading-[var(--line-height-relaxed)] text-[var(--muted-foreground)]">
        {t("insightsMemory.hint")}
      </p>
      <ul className="mt-10 space-y-3">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-[15px] font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </AppLayout>
  );
}
