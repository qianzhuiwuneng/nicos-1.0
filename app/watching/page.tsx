"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { TasteArchiveSection } from "@/components/archive/TasteArchiveSection";
import { tasteEntries } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

export default function WatchingPage() {
  const { t } = useLanguage();
  const films = tasteEntries.filter((e) => e.type === "Movie");

  return (
    <AppLayout title={t("watching.title")} description={t("watching.description")} narrow>
      <TasteArchiveSection entries={films} intro={t("watching.intro")} />
    </AppLayout>
  );
}
