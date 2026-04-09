import type { WeeklyReviewValues } from "@/lib/weekly-review-storage";

const CLOUD_KEY_STORAGE = "nicos-weekly-cloud-edit-key";

export type CloudSaveResult =
  | { ok: true }
  | { ok: false; code: "disabled" | "no_key" | "bad_key" | "failed"; message?: string };

function isCloudEnabled(): boolean {
  return process.env.NEXT_PUBLIC_WEEKLY_REVIEW_CLOUD === "true";
}

export function getCloudEnabled(): boolean {
  return isCloudEnabled();
}

export function getWeeklyCloudEditKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(CLOUD_KEY_STORAGE) ?? "";
}

export function setWeeklyCloudEditKey(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CLOUD_KEY_STORAGE, key.trim());
}

export function clearWeeklyCloudEditKey(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CLOUD_KEY_STORAGE);
}

export async function fetchWeeklyReviewCloud(programWeek: number): Promise<WeeklyReviewValues> {
  if (!isCloudEnabled()) return {};

  try {
    const res = await fetch(`/api/weekly-review?week=${programWeek}`, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) return {};
    const json = (await res.json()) as { values?: Record<string, unknown> };
    const src = json?.values;
    if (!src || typeof src !== "object") return {};
    const out: WeeklyReviewValues = {};
    for (const [k, v] of Object.entries(src)) {
      if (typeof v === "string") out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export async function saveWeeklyReviewCloud(
  programWeek: number,
  values: WeeklyReviewValues,
  key: string
): Promise<CloudSaveResult> {
  if (!isCloudEnabled()) return { ok: false, code: "disabled" };
  const trimmed = key.trim();
  if (!trimmed) return { ok: false, code: "no_key" };

  try {
    const res = await fetch("/api/weekly-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programWeek, values, key: trimmed }),
    });
    if (res.ok) return { ok: true };
    if (res.status === 401) return { ok: false, code: "bad_key" };
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    return { ok: false, code: "failed", message: data?.error };
  } catch {
    return { ok: false, code: "failed" };
  }
}

/** Cloud-first merge: remote > local for prompt IDs */
export function mergeRemoteAndLocal(
  remote: WeeklyReviewValues,
  local: WeeklyReviewValues,
  promptIds: string[]
): WeeklyReviewValues {
  const out: WeeklyReviewValues = {};
  for (const id of promptIds) {
    const rv = remote[id];
    const lv = local[id];
    out[id] = typeof rv === "string" && rv.length > 0 ? rv : lv ?? "";
  }
  return out;
}
