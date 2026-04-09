"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { isNavActive } from "@/lib/nav-active";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { NAV_GROUP_DEFS } from "./nav-groups";

export function MobileNavDrawer() {
  const { open, close } = useMobileMenu();
  const pathname = usePathname();
  const { t } = useLanguage();

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label={t("mobile.menuTitle")}>
      <button
        type="button"
        className="absolute inset-0 bg-[var(--foreground)]/20 backdrop-blur-[2px]"
        aria-label={t("common.close")}
        onClick={close}
      />
      <div className="absolute left-0 top-0 flex h-full w-[min(22rem,100%)] flex-col border-r border-[var(--border-subtle)] bg-[var(--sidebar-bg)] shadow-[var(--shadow-float)]">
        <div className="flex h-[3.75rem] shrink-0 items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-4">
          <span className="text-[16px] font-medium tracking-[0.01em] text-[var(--foreground)]/92">NicOS</span>
          <button
            type="button"
            onClick={close}
            className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]/60 hover:text-[var(--foreground)]"
            aria-label={t("common.close")}
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-8 pt-4">
          {NAV_GROUP_DEFS.map((group) => (
            <div key={group.labelKey} className="mt-6 first:mt-0">
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]/88">
                {t(group.labelKey)}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isNavActive(item.href, pathname);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href + item.labelKey}
                      href={item.href}
                      onClick={close}
                      className={cn(
                        "flex min-h-12 items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-[15px] leading-snug transition-colors",
                        active
                          ? "bg-[var(--accent)] font-medium text-[var(--accent-foreground)] shadow-[inset_0_0_0_1px_var(--border-subtle)]"
                          : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50 hover:text-[var(--foreground)]"
                      )}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0 opacity-80" strokeWidth={1.5} />
                      <span>{t(item.labelKey)}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-[var(--border-subtle)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
