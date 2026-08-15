export const HIGHLIGHTS_STORAGE_KEY = "agentic-ai-highlights";

export interface ModuleHighlight {
  id: string;
  text: string;
}

export type HighlightsMap = Record<string, ModuleHighlight[]>;

export function highlightKey(phaseSlug: string, moduleSlug: string): string {
  return `${phaseSlug}/${moduleSlug}`;
}

export function sanitizeHighlights(raw: unknown): ModuleHighlight[] {
  if (!Array.isArray(raw)) return [];

  const seen = new Set<string>();
  const result: ModuleHighlight[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const record = item as { id?: unknown; text?: unknown };
    const text = typeof record.text === "string" ? normalizeHighlightText(record.text) : "";
    if (text.length < 3 || text.length > 400) continue;
    if (seen.has(text)) continue;
    seen.add(text);
    const id =
      typeof record.id === "string" && record.id.trim().length > 0
        ? record.id.trim()
        : createHighlightId();
    result.push({ id, text });
    if (result.length >= 50) break;
  }

  return result;
}

export function normalizeHighlightText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function createHighlightId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `hl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function readLocalHighlights(): HighlightsMap {
  try {
    const stored = localStorage.getItem(HIGHLIGHTS_STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const map: HighlightsMap = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      map[key] = sanitizeHighlights(value);
    }
    return map;
  } catch {
    return {};
  }
}

export function writeLocalHighlights(map: HighlightsMap) {
  localStorage.setItem(HIGHLIGHTS_STORAGE_KEY, JSON.stringify(map));
}

export function mergeHighlights(a: ModuleHighlight[], b: ModuleHighlight[]): ModuleHighlight[] {
  return sanitizeHighlights([...a, ...b]);
}

const SKIP_SELECTOR =
  "pre, code, svg, button, a, nav, textarea, input, [data-no-highlight], .mermaid-sketch";

function acceptTextNode(node: Node): number {
  const el = node.parentElement;
  if (!el) return NodeFilter.FILTER_REJECT;
  if (el.closest(SKIP_SELECTOR)) return NodeFilter.FILTER_REJECT;
  if (el.closest("mark.lesson-highlight")) return NodeFilter.FILTER_REJECT;
  if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
  return NodeFilter.FILTER_ACCEPT;
}

export function unwrapLessonHighlights(root: HTMLElement) {
  root.querySelectorAll("mark.lesson-highlight").forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    while (mark.firstChild) {
      parent.insertBefore(mark.firstChild, mark);
    }
    parent.removeChild(mark);
    parent.normalize();
  });
}

function wrapMatchInTextNode(node: Text, search: string, id: string): boolean {
  const idx = node.data.indexOf(search);
  if (idx === -1) return false;
  const range = document.createRange();
  range.setStart(node, idx);
  range.setEnd(node, idx + search.length);
  const mark = document.createElement("mark");
  mark.className = "lesson-highlight";
  mark.dataset.highlightId = id;
  mark.title = "Highlighted while studying";
  try {
    range.surroundContents(mark);
    return true;
  } catch {
    return false;
  }
}

export function applyLessonHighlights(root: HTMLElement, highlights: ModuleHighlight[]) {
  unwrapLessonHighlights(root);

  for (const highlight of highlights) {
    const search = normalizeHighlightText(highlight.text);
    if (search.length < 3) continue;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: acceptTextNode,
    });

    let node = walker.nextNode() as Text | null;
    while (node) {
      if (wrapMatchInTextNode(node, search, highlight.id) || wrapMatchInTextNode(node, highlight.text, highlight.id)) {
        break;
      }
      node = walker.nextNode() as Text | null;
    }
  }
}
