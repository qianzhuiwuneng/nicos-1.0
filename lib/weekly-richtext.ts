const SENTENCE_END_RE = /[。！？.!?]["'”’）)]?$/;

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function isProbablyHtml(value: string): boolean {
  return /<[^>]+>/.test(value);
}

export function toEditorHtml(value: string): string {
  if (!value.trim()) return "<p></p>";
  if (isProbablyHtml(value)) return value;
  return `<p>${escapeHtml(value).replace(/\n/g, "<br>")}</p>`;
}

export function toDisplayHtml(value: string): string {
  if (!value.trim()) return "—";
  if (isProbablyHtml(value)) return value;
  return escapeHtml(value).replace(/\n/g, "<br>");
}

export function sanitizeRichHtml(raw: string): string {
  return raw
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .trim();
}

function isFullSentence(text: string): boolean {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length < 8) return false;
  if (!SENTENCE_END_RE.test(cleaned)) return false;
  const zhCount = (cleaned.match(/[\u4e00-\u9fff]/g) ?? []).length;
  if (zhCount > 0) return zhCount >= 8;
  const words = cleaned.split(/\s+/).filter(Boolean);
  return words.length >= 4;
}

export function extractBoldSentences(value: string): string[] {
  if (typeof window === "undefined") return [];
  if (!value.trim() || !isProbablyHtml(value)) return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(value, "text/html");
  const nodes = Array.from(doc.querySelectorAll("strong, b"));
  const out: string[] = [];
  const seen = new Set<string>();

  for (const node of nodes) {
    if (node.closest("h1,h2,h3,h4,h5,h6")) continue;
    const text = (node.textContent ?? "").replace(/\s+/g, " ").trim();
    if (!isFullSentence(text) || seen.has(text)) continue;
    seen.add(text);
    out.push(text);
  }
  return out;
}
