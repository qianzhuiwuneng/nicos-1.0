"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Heart,
  Shirt,
  Palette,
  CalendarDays,
  Calendar,
  LayoutTemplate,
  Bookmark,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { Program52SidebarSection } from "@/components/program/Program52SidebarSection";

const navKeysTop = [{ href: "/", key: "nav.dashboard", icon: LayoutDashboard }] as const;

const navKeysRest = [
  { href: "/ledger", key: "nav.ledger", icon: BookOpen },
  { href: "/feelings", key: "nav.feelings", icon: Heart },
  { href: "/looks", key: "nav.looks", icon: Shirt },
  { href: "/taste", key: "nav.taste", icon: Palette },
  { href: "/weekly", key: "nav.weekly", icon: CalendarDays },
  { href: "/monthly", key: "nav.monthly", icon: Calendar },
  { href: "/templates", key: "nav.templates", icon: LayoutTemplate },
  { href: "/to-try", key: "nav.toTry", icon: Bookmark },
  { href: "/identity", key: "nav.identity", icon: User },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-52 flex-col bg-[var(--card)]/80 backdrop-blur-[12px]">
      <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-[var(--border-subtle)] px-4">
        <Link
          href="/"
          className="text-[15px] font-medium tracking-[-0.01em] text-[var(--foreground)]"
        >
          Nicos
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
      <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 pb-4 pt-3">
        {navKeysTop.map(({ href, key, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-[13px] transition-colors",
                isActive
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)] font-medium"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/60 hover:text-[var(--foreground)]"
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0 opacity-70" strokeWidth={1.5} />
              {t(key)}
            </Link>
          );
        })}
        <Program52SidebarSection />
        {navKeysRest.map(({ href, key, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-[13px] transition-colors",
                isActive
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)] font-medium"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/60 hover:text-[var(--foreground)]"
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0 opacity-70" strokeWidth={1.5} />
              {t(key)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
