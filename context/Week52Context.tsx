"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "nicos-focus-week";

function readStoredWeek(): number {
  if (typeof window === "undefined") return 1;
  const raw = localStorage.getItem(STORAGE_KEY);
  const n = parseInt(raw ?? "1", 10);
  if (Number.isNaN(n) || n < 1) return 1;
  if (n > 52) return 52;
  return n;
}

interface Week52ContextValue {
  focusWeek: number;
  setFocusWeek: (week: number) => void;
}

const Week52Context = createContext<Week52ContextValue | null>(null);

export function Week52Provider({ children }: { children: React.ReactNode }) {
  const [focusWeek, setFocusWeekState] = useState(1);

  useEffect(() => {
    setFocusWeekState(readStoredWeek());
  }, []);

  const setFocusWeek = useCallback((week: number) => {
    const w = Math.min(52, Math.max(1, week));
    setFocusWeekState(w);
    localStorage.setItem(STORAGE_KEY, String(w));
  }, []);

  return (
    <Week52Context.Provider value={{ focusWeek, setFocusWeek }}>
      {children}
    </Week52Context.Provider>
  );
}

export function useWeek52Nav(): Week52ContextValue {
  const ctx = useContext(Week52Context);
  if (!ctx) throw new Error("useWeek52Nav must be used within Week52Provider");
  return ctx;
}
