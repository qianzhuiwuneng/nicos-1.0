"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface MobileMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  close: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextValue | null>(null);

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      close,
    }),
    [open, close]
  );

  return <MobileMenuContext.Provider value={value}>{children}</MobileMenuContext.Provider>;
}

export function useMobileMenu(): MobileMenuContextValue {
  const ctx = useContext(MobileMenuContext);
  if (!ctx) {
    throw new Error("useMobileMenu must be used within MobileMenuProvider");
  }
  return ctx;
}
