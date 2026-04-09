"use client";

import { cn } from "@/lib/utils";
import { MobileMenuProvider } from "@/context/MobileMenuContext";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { WeeklyReviewFooter } from "./WeeklyReviewFooter";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  topbarRight?: React.ReactNode;
  /** Use narrow content width (editorial / Are.na style) */
  narrow?: boolean;
}

export function AppLayout({
  children,
  title,
  description,
  topbarRight,
  narrow = false,
}: AppLayoutProps) {
  return (
    <MobileMenuProvider>
      <Sidebar />
      <MobileNavDrawer />
      <div className="min-h-screen lg:pl-60">
        <Topbar title={title} description={description}>
          {topbarRight}
        </Topbar>
        <main
          className={cn(
            "pb-[calc(5.25rem+env(safe-area-inset-bottom))] pt-6 sm:px-8 sm:pt-8 lg:py-12",
            narrow
              ? "mx-auto max-w-[var(--content-width-wide)] px-5 lg:px-10"
              : "px-5 lg:px-10"
          )}
        >
          {children}
          <WeeklyReviewFooter />
        </main>
      </div>
      <MobileBottomNav />
    </MobileMenuProvider>
  );
}
