"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useLanguage } from "@/context/LanguageContext";

export default function BecomingPage() {
  const { t } = useLanguage();

  return (
    <AppLayout title={t("becoming.title")} description={t("becoming.description")} narrow>
      <p className="max-w-xl text-[15px] leading-[var(--line-height-relaxed)] text-[var(--foreground)]/90">
        {t("becoming.body")}
      </p>
    </AppLayout>
  );
}
