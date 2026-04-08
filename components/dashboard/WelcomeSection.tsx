"use client";

import { useLanguage } from "@/context/LanguageContext";

export function WelcomeSection() {
  const { t } = useLanguage();

  return (
    <section className="welcome-whimsy mb-12 max-w-xl">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--foreground)] leading-tight">
        {t("dashboard.brand")}
        <span className="welcome-emoji" aria-hidden>
          ✦
        </span>
      </h1>
      <p className="mt-2 text-[14px] text-[var(--muted-foreground)] leading-[var(--line-height-relaxed)]">
        {t("dashboard.subtitle")}
      </p>
      <p className="mt-5 text-[14px] leading-[var(--line-height-relaxed)] text-[var(--foreground)]/90">
        {t("dashboard.welcome")}
      </p>
    </section>
  );
}
