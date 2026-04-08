"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function SetHtmlLang() {
  const { locale } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-Hans" : "en";
  }, [locale]);

  return null;
}
