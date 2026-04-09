import type { Locale } from "@/lib/i18n";

export type WeeklyReviewPrompt = { id: string; label: string };

/** 每周复盘条目由上一周说明后填入；未配置的周返回空数组。 */
export function getWeeklyReviewPrompts(programWeek: number, locale: Locale): WeeklyReviewPrompt[] {
  if (programWeek === 1) {
    if (locale === "zh") {
      return [
        { id: "w1-movie", label: "《心动的感觉》电影观后感" },
        { id: "w1-book", label: "《突围原生家庭》感受与触动" },
        { id: "w1-shopping", label: "关于逛街对审美的一个初步认知" },
      ];
    }
    return [
      { id: "w1-movie", label: "Film reflections — The Feeling of the Heart (《心动的感觉》)" },
      { id: "w1-book", label: "Breaking Free from the Family of Origin — what moved you" },
      { id: "w1-shopping", label: "First notes on aesthetics from shopping / window-shopping" },
    ];
  }
  if (programWeek === 2) {
    if (locale === "zh") {
      return [
        { id: "w2-spring", label: "《春天的故事》电影观后感" },
        { id: "w2-inner-child", label: "《拥抱内在小孩》感受与触动" },
        { id: "w2-outfit", label: "穿搭感受" },
        { id: "w2-breakfast-yoga", label: "一周抗炎早餐➕瑜伽的感受" },
      ];
    }
    return [
      { id: "w2-spring", label: "Film reflections — The Story of Spring (《春天的故事》)" },
      { id: "w2-inner-child", label: "Embracing Your Inner Child — feelings & what touched you" },
      { id: "w2-outfit", label: "Outfits — how they felt" },
      {
        id: "w2-breakfast-yoga",
        label: "One week of anti-inflammatory breakfast + yoga — how it felt",
      },
    ];
  }
  if (programWeek === 4) {
    if (locale === "zh") {
      return [
        { id: "w4-designer-brands", label: "鉴赏、理解一些国内设计师品牌" },
        { id: "w4-annie-hall", label: "《安妮霍尔》电影观后感" },
        { id: "w4-book-parents", label: "书籍《不被父母控制的人生》感受与触动" },
      ];
    }
    return [
      {
        id: "w4-designer-brands",
        label: "Appreciating and understanding some Chinese designer brands",
      },
      { id: "w4-annie-hall", label: "Film reflections — Annie Hall (《安妮霍尔》)" },
      {
        id: "w4-book-parents",
        label: "Book: A Life Not Controlled by Parents (《不被父母控制的人生》) — feelings & what touched you",
      },
    ];
  }
  return [];
}
