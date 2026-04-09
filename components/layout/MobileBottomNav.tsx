"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, CalendarClock, CircleDot, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { isNavActive } from "@/lib/nav-active";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { useLanguage } from "@/context/LanguageContext";

const BOTTOM_LINKS = [
  { href: "/", labelKey: "mobile.bottomNow", icon: CircleDot },
  { href: "/this-week", labelKey: "mobile.bottomWeek", icon: CalendarClock },
  { href: "/reading", labelKey: "mobile.bottomRead", icon: BookMarked },
  { href: "/insights/memory", labelKey: "mobile.bottomMemory", icon: History },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { open: menuOpen } = useMobileMenu();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border-subtle)] bg-[var(--background)]/92 backdrop-blur-md transition-opacity duration-200 lg:hidden",
        menuOpen && "pointer-events-none opacity-0"
      )}
      aria-label={t("mobile.bottomNavAria")}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1">
        {BOTTOM_LINKS.map(({ href, labelKey, icon: Icon }) => {
          const active = isNavActive(href, pathname);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-[3.25rem] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-[var(--radius-sm)] px-1 py-1.5 text-[11px] font-medium tracking-[-0.01em] transition-colors",
                active
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              <Icon
                className={cn("h-[22px] w-[22px] shrink-0", active ? "opacity-95" : "opacity-65")}
                strokeWidth={1.5}
                aria-hidden
              />
              <span className="max-w-full truncate px-0.5 text-center leading-tight">{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
