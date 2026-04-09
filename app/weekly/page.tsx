"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentProgramWeek } from "@/lib/program-week";

export default function WeeklyPage() {
  const router = useRouter();

  useEffect(() => {
    const currentWeek = getCurrentProgramWeek();
    router.replace(`/weekly/week-${currentWeek}`);
  }, [router]);

  return null;
}
