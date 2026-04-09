import { getProgramWeekBounds } from "@/lib/program-week";

export type WatchingJourneyFilm = {
  id: string;
  /** Director or primary credit line */
  director: string;
  title: string;
  /** e.g. country · year */
  yearLine: string;
  tagline: string;
  taglineZh: string;
  coverImage: string;
  coverTone: string;
  week: number;
  month: number;
  /** Weekly reflection prompt id (movie section) */
  reflectionPromptId: string;
  /** If the note lives under a different program week than `week` */
  reflectionWeek?: number;
};

export const watchingJourneyFilms: WatchingJourneyFilm[] = [
  {
    id: "film-w1",
    director: "Claude Pinoteau",
    title: "心动的感觉",
    yearLine: "法国 / 意大利 · 1988",
    tagline:
      "L'Étudiante (The Student) — Sophie Marceau; exams, snow, and love on a tight schedule.",
    taglineZh: "《心动的感觉》/ L'Étudiante：苏菲·玛索，备考、滑雪与恋爱挤在同一季。",
    coverImage: "/films/letudiante.png",
    coverTone: "bg-[#d8d5d0]",
    week: 1,
    month: 1,
    reflectionPromptId: "w1-movie",
  },
  {
    id: "film-w2",
    director: "Éric Rohmer",
    title: "春天的故事",
    yearLine: "法国 · 1990",
    tagline: "Conte de printemps — clarity through conversation, seasons as form.",
    taglineZh: "《人间四季》之一：对话里的清明，季节即结构。",
    coverImage: "/films/conte-de-printemps.png",
    coverTone: "bg-[#dcd8d2]",
    week: 2,
    month: 1,
    reflectionPromptId: "w2-spring",
  },
  {
    id: "film-w3",
    director: "Hal Hartley",
    title: "难以置信的事实",
    yearLine: "美国 · 1989",
    tagline: "The Unbelievable Truth — deadpan gravity, love and doom in one breath.",
    taglineZh: "《难以置信的事实》：冷面语气里，爱与命运并排而行。",
    coverImage: "/films/unbelievable-truth.png",
    coverTone: "bg-[#d4d6da]",
    week: 3,
    month: 1,
    reflectionPromptId: "w3-film",
  },
  {
    id: "film-w4",
    director: "Woody Allen",
    title: "安妮·霍尔",
    yearLine: "美国 · 1977",
    tagline: "Annie Hall — memory, wit, and the tenderness of a fragment.",
    taglineZh: "《安妮·霍尔》：记忆、机智与片段式的温柔。",
    coverImage: "/films/annie-hall.png",
    coverTone: "bg-[#ddd9d4]",
    week: 4,
    month: 1,
    reflectionPromptId: "w4-annie-hall",
  },
  {
    id: "film-w5",
    director: "Éric Rohmer",
    title: "飞行员的妻子",
    yearLine: "法国 · 1981",
    tagline: "La Femme de l'aviateur — watching, guessing, the city as feeling.",
    taglineZh: "《飞行员的妻子》：观看与揣测，城市像一种心情。",
    coverImage: "/films/femme-aviateur.png",
    coverTone: "bg-[#d6d8dc]",
    week: 5,
    month: 2,
    reflectionPromptId: "w5-film",
  },
  {
    id: "film-w6",
    director: "Francesco Laudadio",
    title: "情事",
    yearLine: "意大利 · 1991",
    tagline: "La riffa (The Raffle) — Monica Bellucci’s debut; beauty, debt, and a cruel bargain.",
    taglineZh: "《情事》/ La riffa：莫妮卡·贝鲁奇银幕首秀，债务、抽奖与尊严的拉扯。",
    coverImage: "/films/la-riffa.png",
    coverTone: "bg-[#d0d2d5]",
    week: 6,
    month: 2,
    reflectionPromptId: "w6-film",
  },
];

export function getWatchingForWeek(week: number): WatchingJourneyFilm[] {
  return watchingJourneyFilms.filter((f) => f.week === week);
}

export function getWatchingFilmById(id: string): WatchingJourneyFilm | undefined {
  return watchingJourneyFilms.find((f) => f.id === id);
}

export function getWatchingMonthSections() {
  const grouped = watchingJourneyFilms.reduce<Record<number, WatchingJourneyFilm[]>>((acc, lot) => {
    if (!acc[lot.month]) acc[lot.month] = [];
    acc[lot.month].push(lot);
    return acc;
  }, {});

  return Object.keys(grouped)
    .map((month) => Number(month))
    .sort((a, b) => a - b)
    .map((month) => {
      const lots = grouped[month].slice().sort((a, b) => a.week - b.week);
      const weekList = lots.map((f) => f.week);
      const firstWeek = weekList[0];
      const lastWeek = weekList[weekList.length - 1];
      return {
        month,
        lots,
        firstWeek,
        lastWeek,
      };
    });
}

export function getWatchingWeekSections() {
  const grouped = watchingJourneyFilms.reduce<Record<number, WatchingJourneyFilm[]>>((acc, lot) => {
    if (!acc[lot.week]) acc[lot.week] = [];
    acc[lot.week].push(lot);
    return acc;
  }, {});

  return Object.keys(grouped)
    .map((week) => Number(week))
    .sort((a, b) => a - b)
    .map((week) => {
      const lots = grouped[week];
      const { weekStart, weekEnd } = getProgramWeekBounds(week);
      return {
        week,
        month: lots[0]?.month ?? 1,
        weekStart,
        weekEnd,
        lots,
      };
    });
}
