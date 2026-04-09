"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useLanguage } from "@/context/LanguageContext";

export default function MirrorCoachPage() {
  const { t } = useLanguage();

  return (
    <AppLayout title={t("insightsMirror.title")} description={t("insightsMirror.description")} narrow>
      <p className="max-w-xl text-[15px] leading-relaxed text-[var(--muted-foreground)]">
        {t("insightsMirror.soon")}
      </p>
      <p className="mt-6 text-[12px] uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
        {t("common.comingSoon")}
      </p>
    </AppLayout>
  );
}
