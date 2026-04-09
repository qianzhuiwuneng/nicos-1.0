"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, ReactNode } from "react";
import {
  BookMarked,
  BookOpen,
  Bookmark,
  Calendar,
  CalendarClock,
  CircleDot,
  Clapperboard,
  Compass,
  Heart,
  History,
  LayoutTemplate,
  Layers,
  LineChart,
  MessageCircle,
  Route,
  Shirt,
  Sparkles,
  Sun,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

type NavIcon = ComponentType<{ className?: string; strokeWidth?: number }>;

function NavGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-5 first:mt-0">
      <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]/85">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  pathname,
}: {
  href: string;
  label: string;
  icon: NavIcon;
  pathname: string;
}) {
  const isActive =
    href === "/"
      ? pathname === "/"
      : href === "/monthly"
        ? pathname === "/monthly"
        : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-[13px] transition-colors",
        isActive
          ? "bg-[var(--accent)] font-medium text-[var(--accent-foreground)] shadow-[inset_0_0_0_1px_var(--border-subtle)]"
          : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50 hover:text-[var(--foreground)]"
      )}
    >
      <Icon className="h-[17px] w-[17px] shrink-0 opacity-75" strokeWidth={1.5} />
      <span className="leading-snug">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-[var(--border-subtle)] bg-[var(--sidebar-bg)] backdrop-blur-md">
      <div className="flex h-[4.25rem] shrink-0 items-center justify-between gap-2 px-4">
        <Link
          href="/"
          className="text-[15px] font-medium tracking-[0.01em] text-[var(--foreground)]/92"
        >
          Nicos
        </Link>
        <div className="flex items-center gap-0.5">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto px-2.5 pb-10 pt-2">
        <NavGroup label={t("nav.layerDirection")}>
          <NavLink href="/" label={t("nav.home")} icon={CircleDot} pathname={pathname} />
          <NavLink href="/identity" label={t("nav.identity")} icon={User} pathname={pathname} />
          <NavLink href="/becoming" label={t("nav.becoming")} icon={Compass} pathname={pathname} />
          <NavLink href="/year-theme" label={t("nav.yearTheme")} icon={Sun} pathname={pathname} />
        </NavGroup>
        <NavGroup label={t("nav.layerPractice")}>
          <NavLink href="/journey" label={t("nav.yearJourney")} icon={Route} pathname={pathname} />
          <NavLink href="/this-week" label={t("nav.thisWeek")} icon={CalendarClock} pathname={pathname} />
          <NavLink href="/monthly" label={t("nav.thisMonth")} icon={Calendar} pathname={pathname} />
        </NavGroup>
        <NavGroup label={t("nav.layerArchive")}>
          <NavLink href="/feelings" label={t("nav.feelings")} icon={Heart} pathname={pathname} />
          <NavLink href="/looks" label={t("nav.looks")} icon={Shirt} pathname={pathname} />
          <NavLink href="/ledger" label={t("nav.ledger")} icon={BookOpen} pathname={pathname} />
          <NavLink href="/reading" label={t("nav.reading")} icon={BookMarked} pathname={pathname} />
          <NavLink href="/watching" label={t("nav.watching")} icon={Clapperboard} pathname={pathname} />
          <NavLink href="/fragments" label={t("nav.fragments")} icon={Sparkles} pathname={pathname} />
          <NavLink href="/to-try" label={t("nav.toTry")} icon={Bookmark} pathname={pathname} />
          <NavLink href="/templates" label={t("nav.templates")} icon={LayoutTemplate} pathname={pathname} />
        </NavGroup>
        <NavGroup label={t("nav.layerInsights")}>
          <NavLink href="/weekly" label={t("nav.weeklyInsights")} icon={LineChart} pathname={pathname} />
          <NavLink href="/monthly" label={t("nav.monthlyPatterns")} icon={Layers} pathname={pathname} />
          <NavLink href="/insights/memory" label={t("nav.memorySurface")} icon={History} pathname={pathname} />
          <NavLink href="/insights/mirror" label={t("nav.mirrorCoach")} icon={MessageCircle} pathname={pathname} />
        </NavGroup>
      </nav>
    </aside>
  );
}
