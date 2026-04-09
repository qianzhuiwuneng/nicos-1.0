"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { TasteArchiveSection } from "@/components/archive/TasteArchiveSection";
import { tasteEntries } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

export default function ReadingPage() {
  const { t } = useLanguage();
  const books = tasteEntries.filter((e) => e.type === "Book");

  return (
    <AppLayout title={t("reading.title")} description={t("reading.description")} narrow>
      <TasteArchiveSection entries={books} intro={t("reading.intro")} />
    </AppLayout>
  );
}
