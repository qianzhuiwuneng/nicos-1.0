"use client";

import { Heart, DollarSign, Shirt, Sparkles } from "lucide-react";
import { QuickActionButton } from "@/components/shared/QuickActionButton";
import { useLanguage } from "@/context/LanguageContext";

export function QuickActions() {
  const { t } = useLanguage();

  const showComingSoon = () => {
    if (typeof window !== "undefined") {
      const el = document.createElement("div");
      el.textContent = t("common.comingSoon");
      el.className =
        "fixed bottom-8 right-8 z-50 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-[13px] text-[var(--foreground)] shadow-lg";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2000);
    }
  };

  return (
    <section className="mb-12">
      <h2 className="mb-4 text-[12px] font-medium uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
        {t("dashboard.quickActions")}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickActionButton
          tint="peach"
          label={t("dashboard.addFeeling")}
          icon={<Heart className="h-4 w-4" strokeWidth={1.5} />}
          onClick={showComingSoon}
        />
        <QuickActionButton
          tint="mint"
          label={t("dashboard.addSpending")}
          icon={<DollarSign className="h-4 w-4" strokeWidth={1.5} />}
          onClick={showComingSoon}
        />
        <QuickActionButton
          tint="sky"
          label={t("dashboard.addLook")}
          icon={<Shirt className="h-4 w-4" strokeWidth={1.5} />}
          onClick={showComingSoon}
        />
        <QuickActionButton
          tint="peach"
          label={t("dashboard.addInspiration")}
          icon={<Sparkles className="h-4 w-4" strokeWidth={1.5} />}
          onClick={showComingSoon}
        />
      </div>
    </section>
  );
}
