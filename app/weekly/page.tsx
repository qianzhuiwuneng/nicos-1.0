import { redirect } from "next/navigation";
import { getCurrentProgramWeek } from "@/lib/program-week";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function WeeklyPage() {
  const currentWeek = getCurrentProgramWeek();
  redirect(`/weekly/week-${currentWeek}`);
}
