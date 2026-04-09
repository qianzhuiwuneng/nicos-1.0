import { getProgramWeekBounds } from "@/lib/program-week";

export type ReadingJourneyBook = {
  id: string;
  author: string;
  title: string;
  publisherYear: string;
  tagline: string;
  coverTone: string;
  week: number;
  month: number;
  reflectionWeek?: number;
  reflectionPromptId?: string;
};

export const readingJourneyBooks: ReadingJourneyBook[] = [
  {
    id: "lot-1",
    author: "Stefanie Stahl",
    title: "突围原生家庭",
    publisherYear: "北京联合出版公司 · 2019",
    tagline: "How to rebuild the self after early wounds",
    coverTone: "bg-[#d7d4cf]",
    week: 1,
    month: 1,
    reflectionPromptId: "w1-book",
  },
  {
    id: "lot-2",
    author: "Krishnananda & Amana",
    title: "拥抱你的内在小孩",
    publisherYear: "漓江出版社 · 2011",
    tagline: "Inner child / fear / repair through love",
    coverTone: "bg-[#dcd9d3]",
    week: 2,
    month: 1,
    reflectionPromptId: "w2-inner-child",
  },
  {
    id: "lot-3",
    author: "Lindsay C. Gibson",
    title: "不被父母控制的人生",
    publisherYear: "机械工业出版社 · 2021",
    tagline: "Boundaries / emotional independence / family detachment",
    coverTone: "bg-[#d2d8dd]",
    week: 3,
    month: 1,
    reflectionWeek: 4,
    reflectionPromptId: "w4-book-parents",
  },
  {
    id: "lot-4",
    author: "Ichiro Kishimi & Fumitake Koga",
    title: "被讨厌的勇气",
    publisherYear: "机械工业出版社 · 2021",
    tagline: "Adler / freedom / separation of tasks",
    coverTone: "bg-[#d9d5dc]",
    week: 5,
    month: 2,
  },
  {
    id: "lot-5",
    author: "Alfred Adler",
    title: "自卑与超越",
    publisherYear: "江苏凤凰文艺出版社 · 2017",
    tagline: "Inferiority / meaning / becoming through effort",
    coverTone: "bg-[#d7d7d2]",
    week: 6,
    month: 2,
  },
];

export function getReadingForWeek(week: number): ReadingJourneyBook[] {
  return readingJourneyBooks.filter((book) => book.week === week);
}

export function getReadingMonthSections() {
  const grouped = readingJourneyBooks.reduce<Record<number, ReadingJourneyBook[]>>((acc, lot) => {
    if (!acc[lot.month]) acc[lot.month] = [];
    acc[lot.month].push(lot);
    return acc;
  }, {});

  return Object.keys(grouped)
    .map((month) => Number(month))
    .sort((a, b) => a - b)
    .map((month) => {
      const lots = grouped[month].slice().sort((a, b) => a.week - b.week);
      const weekList = lots.map((book) => book.week);
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

export function getReadingWeekSections() {
  const grouped = readingJourneyBooks.reduce<Record<number, ReadingJourneyBook[]>>((acc, lot) => {
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

export function getWeeklyHubContent(week: number) {
  return {
    week,
    reading: getReadingForWeek(week),
    reflections: [], // reserved for linking week-tagged reflection entries
    feelings: [], // reserved for linking week-tagged feeling entries
    notes: [], // reserved for linking week-tagged notes/fragments
    insights: [], // reserved for linking week-tagged insight summaries
  };
}
