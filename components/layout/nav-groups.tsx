"use client";

import type { LucideIcon } from "lucide-react";
import {
  BookMarked,
  Bookmark,
  Calendar,
  CalendarClock,
  CircleDot,
  Clapperboard,
  Compass,
  History,
  LayoutTemplate,
  Layers,
  LineChart,
  MessageCircle,
  Route,
  Sparkles,
  Sun,
  User,
} from "lucide-react";

export type NavItemDef = { href: string; labelKey: string; icon: LucideIcon };

export type NavGroupDef = { labelKey: string; items: NavItemDef[] };

export const NAV_GROUP_DEFS: NavGroupDef[] = [
  {
    labelKey: "nav.layerDirection",
    items: [
      { href: "/", labelKey: "nav.home", icon: CircleDot },
      { href: "/identity", labelKey: "nav.identity", icon: User },
      { href: "/becoming", labelKey: "nav.becoming", icon: Compass },
      { href: "/year-theme", labelKey: "nav.yearTheme", icon: Sun },
    ],
  },
  {
    labelKey: "nav.layerPractice",
    items: [
      { href: "/journey", labelKey: "nav.yearJourney", icon: Route },
      { href: "/this-week", labelKey: "nav.thisWeek", icon: CalendarClock },
      { href: "/monthly", labelKey: "nav.thisMonth", icon: Calendar },
    ],
  },
  {
    labelKey: "nav.layerArchive",
    items: [
      { href: "/reading", labelKey: "nav.reading", icon: BookMarked },
      { href: "/watching", labelKey: "nav.watching", icon: Clapperboard },
      { href: "/fragments", labelKey: "nav.fragments", icon: Sparkles },
      { href: "/to-try", labelKey: "nav.toTry", icon: Bookmark },
      { href: "/templates", labelKey: "nav.templates", icon: LayoutTemplate },
    ],
  },
  {
    labelKey: "nav.layerInsights",
    items: [
      { href: "/weekly", labelKey: "nav.weeklyInsights", icon: LineChart },
      { href: "/monthly", labelKey: "nav.monthlyPatterns", icon: Layers },
      { href: "/insights/memory", labelKey: "nav.memorySurface", icon: History },
      { href: "/insights/mirror", labelKey: "nav.mirrorCoach", icon: MessageCircle },
    ],
  },
];
