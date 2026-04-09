"use client";

import { useLayoutEffect } from "react";
import { layoutLgMediaQuery } from "@/lib/layout-breakpoint";

/**
 * On viewports below `lg`, `#week-N` in the URL scrolls to the mobile reading card
 * (`data-reading-week`). Desktop cards keep real `id="week-N"` for the same hash.
 */
export function useReadingWeekHashScroll() {
  useLayoutEffect(() => {
    const mq = window.matchMedia(layoutLgMediaQuery);

    const scrollMobileTarget = () => {
      if (mq.matches) return;
      const m = /^#week-(\d+)$/.exec(window.location.hash);
      if (!m) return;
      const el = document.querySelector(`[data-reading-week="${m[1]}"]`);
      el?.scrollIntoView({ block: "start", behavior: "instant" });
    };

    scrollMobileTarget();
    window.addEventListener("hashchange", scrollMobileTarget);
    mq.addEventListener("change", scrollMobileTarget);
    return () => {
      window.removeEventListener("hashchange", scrollMobileTarget);
      mq.removeEventListener("change", scrollMobileTarget);
    };
  }, []);
}
