import { redirect } from "next/navigation";
import { getCurrentProgramWeek } from "@/lib/program-week";

export default function WeeklyPage() {
  const currentWeek = getCurrentProgramWeek();
  redirect(`/weekly/week-${currentWeek}`);
}
