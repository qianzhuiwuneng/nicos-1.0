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

function renderNavLink(
  href: string,
  key: string,
  Icon: (typeof navKeysTop)[number]["icon"],
  pathname: string,
  t: (k: string) => string
) {
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-[14px] transition-colors",
        isActive
          ? "bg-[var(--card)] font-medium text-[var(--foreground)] shadow-[var(--shadow-card)]"
          : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
      )}
    >
      <Icon className="h-[17px] w-[17px] shrink-0 opacity-80" strokeWidth={1.75} />
      {t(key)}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-52 flex-col bg-[var(--sidebar-bg)]">
      <div className="flex h-14 shrink-0 items-center justify-between gap-2 px-3">
        <Link
          href="/"
          className="truncate px-2 text-[14px] font-semibold tracking-tight text-[var(--foreground)]"
        >
          Nicos
        </Link>
        <div className="flex shrink-0 items-center gap-0.5">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
      <nav className="min-h-0 flex-1 space-y-px overflow-y-auto px-2 pb-4 pt-1">
        {navKeysTop.map(({ href, key, icon: Icon }) => (
          <div key={href}>{renderNavLink(href, key, Icon, pathname, t)}</div>
        ))}
        <Program52SidebarSection />
        {navKeysRest.map(({ href, key, icon: Icon }) => (
          <div key={href}>{renderNavLink(href, key, Icon, pathname, t)}</div>
        ))}
      </nav>
    </aside>
  );
}
