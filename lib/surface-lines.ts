export type SurfaceLineCandidate = {
  id: string;
  week: number;
  month: number;
  promptId: string;
  surfaceable: true;
};

/**
 * Curated pool only. A line can surface only if explicitly listed here.
 * Text is always reused from weekly reflection content by promptId.
 */
export const surfaceLineCandidates: SurfaceLineCandidate[] = [
  { id: "line-w1-book", week: 1, month: 1, promptId: "w1-book", surfaceable: true },
  { id: "line-w2-inner-child", week: 2, month: 1, promptId: "w2-inner-child", surfaceable: true },
  { id: "line-w4-book-parents", week: 4, month: 1, promptId: "w4-book-parents", surfaceable: true },
];
