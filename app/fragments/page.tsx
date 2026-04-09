"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useLanguage } from "@/context/LanguageContext";
import { fragmentEntries } from "@/lib/fragments";

export default function FragmentsPage() {
  const { t } = useLanguage();

  return (
    <AppLayout title={t("fragments.title")} description={t("fragments.description")} narrow>
      {fragmentEntries.length === 0 ? (
        <p className="max-w-xl text-[15px] leading-relaxed text-[var(--muted-foreground)]">
          {t("fragments.empty")}
        </p>
      ) : (
        <ul className="max-w-xl space-y-6">
          {fragmentEntries.map((f) => (
            <li key={f.id} className="border-b border-[var(--border-subtle)] pb-6 text-[15px] leading-relaxed">
              <p className="text-[11px] text-[var(--muted-foreground)]">{f.createdAt}</p>
              <p className="mt-2 text-[var(--foreground)]">{f.body}</p>
            </li>
          ))}
        </ul>
      )}
    </AppLayout>
  );
}
