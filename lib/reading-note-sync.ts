import { getWeeklyReviewPrompts, type WeeklyReviewPrompt } from "@/lib/weekly-review-prompts";
import { fetchWeeklyReviewCloud, mergeRemoteAndLocal } from "@/lib/weekly-review-cloud";
import { loadWeeklyReviewValues, type WeeklyReviewValues } from "@/lib/weekly-review-storage";
import type { ReadingJourneyBook } from "@/lib/reading-journey";

export type SyncedReadingNote = {
  sectionTitle: string;
  excerpt: string;
  fullText: string;
  sourceWeek: number;
};

function normalizeLabel(source: string): string {
  return source.replace(/[《》\s"'“”‘’:：—\-]/g, "").toLowerCase();
}

function extractExcerpt(text: string, maxChars = 120): string {
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= maxChars) return compact;
  return `${compact.slice(0, maxChars).trimEnd()}…`;
}

function mergeWeeklyValues(remote: WeeklyReviewValues, local: WeeklyReviewValues): WeeklyReviewValues {
  const out: WeeklyReviewValues = { ...local };
  for (const [k, v] of Object.entries(remote)) {
    if (typeof v === "string" && v.trim().length > 0) out[k] = v;
  }
  return out;
}

function pickPromptForBook(book: ReadingJourneyBook, prompts: WeeklyReviewPrompt[]): WeeklyReviewPrompt | undefined {
  if (book.reflectionPromptId) {
    const exact = prompts.find((p) => p.id === book.reflectionPromptId);
    if (exact) return exact;
  }
  const normalizedTitle = normalizeLabel(book.title);
  return prompts.find((p) => normalizeLabel(p.label).includes(normalizedTitle));
}

export async function buildSyncedReadingNotes(
  books: ReadingJourneyBook[]
): Promise<Record<string, SyncedReadingNote>> {
  const weeks = Array.from(new Set(books.map((book) => book.reflectionWeek ?? book.week)));
  const weekValues = new Map<number, WeeklyReviewValues>();
  const weekPrompts = new Map<number, WeeklyReviewPrompt[]>();

  for (const week of weeks) {
    const prompts = getWeeklyReviewPrompts(week, "zh");
    weekPrompts.set(week, prompts);
    const local = loadWeeklyReviewValues(week);
    const remote = await fetchWeeklyReviewCloud(week);
    const promptIds = prompts.map((p) => p.id);
    const promptMerged = prompts.length > 0 ? mergeRemoteAndLocal(remote, local, promptIds) : {};
    weekValues.set(week, { ...mergeWeeklyValues(remote, local), ...promptMerged });
  }

  const out: Record<string, SyncedReadingNote> = {};
  for (const book of books) {
    const sourceWeek = book.reflectionWeek ?? book.week;
    const prompts = weekPrompts.get(sourceWeek) ?? [];
    const values = weekValues.get(sourceWeek) ?? {};
    const prompt = pickPromptForBook(book, prompts);
    const promptId = prompt?.id ?? book.reflectionPromptId;
    if (!promptId) continue;
    const fullText = (values[promptId] ?? "").trim();
    if (!fullText) continue;
    out[book.id] = {
      sectionTitle: prompt?.label ?? `${book.title} 感受与触动`,
      excerpt: extractExcerpt(fullText),
      fullText,
      sourceWeek,
    };
  }

  return out;
}
