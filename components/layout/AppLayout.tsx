"use client";

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
    <>
      <Sidebar />
      <div className="min-h-screen pl-52">
        <Topbar title={title} description={description}>
          {topbarRight}
        </Topbar>
        <main
          className={narrow ? "mx-auto max-w-[var(--content-width-wide)] px-8 py-10" : "px-8 py-10"}
        >
          {children}
          <WeeklyReviewFooter />
        </main>
      </div>
    </>
  );
}
