"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { identityNotes } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";
import type { IdentitySectionType } from "@/lib/types";

const sectionKeyMap: Record<IdentitySectionType, string> = {
  woman_i_want_to_become: "identity.womanIWantToBecome",
  first_glance: "identity.firstGlance",
  my_elegance: "identity.myElegance",
  no_longer_want: "identity.noLongerWant",
  style_keywords: "identity.styleKeywords",
  notes: "identity.notesOnBeauty",
};

export default function IdentityPage() {
  const { t } = useLanguage();

  return (
    <AppLayout
      title={t("identity.title")}
      description={t("identity.description")}
      narrow
    >
      <div className="prose-width mx-auto">
        <div className="space-y-12">
          {identityNotes.map((note) => (
            <article key={note.id} className="border-b border-[var(--border-subtle)] pb-12 last:border-0">
              <h2 className="text-[15px] font-medium tracking-[-0.02em] text-[var(--foreground)]">
                {t(sectionKeyMap[note.section])}
              </h2>
              {note.updatedAt.trim() ? (
                <p className="mt-1 text-[12px] text-[var(--muted-foreground)]">
                  {t("identity.updated")} {note.updatedAt}
                </p>
              ) : null}
              {note.content.trim() ? (
                <div
                  className="mt-6 whitespace-pre-wrap text-[14px] leading-[var(--line-height-relaxed)] text-[var(--foreground)]/90"
                  style={{ fontFeatureSettings: "normal" }}
                >
                  {note.content}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
