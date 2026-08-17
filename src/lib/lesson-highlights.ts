export const HIGHLIGHTS_STORAGE_KEY = "agentic-ai-highlights";
export const HIGHLIGHTS_META_KEY = "agentic-ai-highlights-meta";
export const HIGHLIGHTS_UPDATED_EVENT = "agentic-ai-highlights-updated";
/** Browser-local hour when dirty highlights are written to MongoDB. */
export const HIGHLIGHT_SYNC_HOUR = 23;

export const HIGHLIGHT_COLORS = ["yellow", "green", "orange", "blue", "red"] as const;
export type HighlightColor = (typeof HIGHLIGHT_COLORS)[number];
export const DEFAULT_HIGHLIGHT_COLOR: HighlightColor = "yellow";

export function isHighlightColor(value: unknown): value is HighlightColor {
  return typeof value === "string" && (HIGHLIGHT_COLORS as readonly string[]).includes(value);
}

export interface ModuleHighlight {
  id: string;
  text: string;
  color: HighlightColor;
}

export type HighlightsMap = Record<string, ModuleHighlight[]>;

/** color → highlighted strings for one module */
export type ColorTextDict = Partial<Record<HighlightColor, string[]>>;
/** Per-user DB shape: highlightedText[phaseSlug][moduleSlug][color] = texts */
export type HighlightedText = Record<string, Record<string, ColorTextDict>>;

export interface HighlightsMeta {
  dirty: boolean;
  lastModifiedAt: number | null;
  lastSyncedAt: number | null;
}

function isStorageSlug(value: string): boolean {
  return /^[a-z0-9-]+$/.test(value) && value.length > 0 && value.length <= 120;
}

export function highlightKey(phaseSlug: string, moduleSlug: string): string {
  return `${phaseSlug}/${moduleSlug}`;
}

export function sanitizeHighlights(raw: unknown): ModuleHighlight[] {
  if (!Array.isArray(raw)) return [];

  const seen = new Set<string>();
  const result: ModuleHighlight[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const record = item as { id?: unknown; text?: unknown; color?: unknown };
    const text = typeof record.text === "string" ? normalizeHighlightText(record.text) : "";
    if (text.length < 3 || text.length > 400) continue;
    if (seen.has(text)) continue;
    seen.add(text);
    const id =
      typeof record.id === "string" && record.id.trim().length > 0
        ? record.id.trim()
        : createHighlightId();
    result.push({
      id,
      text,
      color: isHighlightColor(record.color) ? record.color : DEFAULT_HIGHLIGHT_COLOR,
    });
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
    if (typeof window === "undefined") return {};
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

export function notifyHighlightsUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(HIGHLIGHTS_UPDATED_EVENT));
}

export function persistModuleHighlights(
  phaseSlug: string,
  moduleSlug: string,
  highlights: ModuleHighlight[]
) {
  writeLocalHighlights({
    ...readLocalHighlights(),
    [highlightKey(phaseSlug, moduleSlug)]: highlights,
  });
  markHighlightsDirty();
}

function defaultHighlightsMeta(): HighlightsMeta {
  return { dirty: false, lastModifiedAt: null, lastSyncedAt: null };
}

export function readHighlightsMeta(): HighlightsMeta {
  try {
    if (typeof window === "undefined") return defaultHighlightsMeta();
    const stored = localStorage.getItem(HIGHLIGHTS_META_KEY);
    if (!stored) return defaultHighlightsMeta();
    const parsed = JSON.parse(stored) as Partial<HighlightsMeta>;
    return {
      dirty: parsed.dirty === true,
      lastModifiedAt: typeof parsed.lastModifiedAt === "number" ? parsed.lastModifiedAt : null,
      lastSyncedAt: typeof parsed.lastSyncedAt === "number" ? parsed.lastSyncedAt : null,
    };
  } catch {
    return defaultHighlightsMeta();
  }
}

export function writeHighlightsMeta(meta: HighlightsMeta) {
  localStorage.setItem(HIGHLIGHTS_META_KEY, JSON.stringify(meta));
}

export function markHighlightsDirty() {
  writeHighlightsMeta({
    ...readHighlightsMeta(),
    dirty: true,
    lastModifiedAt: Date.now(),
  });
}

export function markHighlightsSynced() {
  writeHighlightsMeta({
    dirty: false,
    lastModifiedAt: readHighlightsMeta().lastModifiedAt,
    lastSyncedAt: Date.now(),
  });
}

export function hasLocalHighlightContent(map: HighlightsMap = readLocalHighlights()): boolean {
  return Object.values(map).some((items) => items.length > 0);
}

/** Treat leftover local highlights (from before meta existed) as needing a later sync. */
export function ensureHighlightsMetaForLocalContent() {
  const meta = readHighlightsMeta();
  if (meta.dirty || meta.lastSyncedAt) return;
  if (!hasLocalHighlightContent()) return;
  markHighlightsDirty();
}

/** First 11 PM after a change, or the next midnight if they highlighted after 11. */
export function nextHighlightSyncAt(modifiedAt: number, now = new Date(modifiedAt)): number {
  const boundary = new Date(now);
  boundary.setHours(HIGHLIGHT_SYNC_HOUR, 0, 0, 0);
  if (now.getTime() < boundary.getTime()) {
    return boundary.getTime();
  }
  const nextDay = new Date(now);
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(0, 0, 0, 0);
  return nextDay.getTime();
}

export function shouldSyncHighlightsNow(
  meta: HighlightsMeta = readHighlightsMeta(),
  now = Date.now()
): boolean {
  if (!meta.dirty || meta.lastModifiedAt == null) return false;
  const dueAt = nextHighlightSyncAt(meta.lastModifiedAt);
  return now >= dueAt && (meta.lastSyncedAt ?? 0) < dueAt;
}

function textsFromColorValue(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function highlightsToColorDict(highlights: ModuleHighlight[]): ColorTextDict {
  const dict: ColorTextDict = {};
  for (const highlight of sanitizeHighlights(highlights)) {
    const list = dict[highlight.color] ?? [];
    list.push(highlight.text);
    dict[highlight.color] = list;
  }
  return dict;
}

export function colorDictToHighlights(dict: unknown): ModuleHighlight[] {
  if (!dict || typeof dict !== "object" || Array.isArray(dict)) return [];
  const raw: ModuleHighlight[] = [];
  for (const color of HIGHLIGHT_COLORS) {
    const texts = textsFromColorValue((dict as Record<string, unknown>)[color]);
    for (const text of texts) {
      raw.push({ id: createHighlightId(), text, color });
    }
  }
  return sanitizeHighlights(raw);
}

export function highlightsMapToHighlightedText(map: HighlightsMap): HighlightedText {
  const tree: HighlightedText = {};
  for (const [key, highlights] of Object.entries(map)) {
    const idx = key.indexOf("/");
    if (idx <= 0) continue;
    const phaseSlug = key.slice(0, idx);
    const moduleSlug = key.slice(idx + 1);
    if (!isStorageSlug(phaseSlug) || !isStorageSlug(moduleSlug)) continue;
    tree[phaseSlug] ??= {};
    tree[phaseSlug][moduleSlug] = highlightsToColorDict(highlights);
  }
  return tree;
}

export function highlightedTextToHighlightsMap(tree: unknown): HighlightsMap {
  if (!tree || typeof tree !== "object") return {};
  const map: HighlightsMap = {};
  for (const [phaseSlug, modules] of Object.entries(tree as Record<string, unknown>)) {
    if (!isStorageSlug(phaseSlug) || !modules || typeof modules !== "object") continue;
    for (const [moduleSlug, dict] of Object.entries(modules as Record<string, unknown>)) {
      if (!isStorageSlug(moduleSlug)) continue;
      map[highlightKey(phaseSlug, moduleSlug)] = colorDictToHighlights(dict);
    }
  }
  return map;
}

export function sanitizeHighlightedText(raw: unknown): HighlightedText {
  return highlightsMapToHighlightedText(highlightedTextToHighlightsMap(raw));
}

export function mergeHighlightedText(base: HighlightedText, incoming: HighlightedText): HighlightedText {
  const out: HighlightedText = structuredClone(base);
  for (const [phaseSlug, modules] of Object.entries(incoming)) {
    out[phaseSlug] ??= {};
    for (const [moduleSlug, dict] of Object.entries(modules)) {
      const hasText = HIGHLIGHT_COLORS.some((color) => (dict[color]?.length ?? 0) > 0);
      if (!hasText) {
        delete out[phaseSlug][moduleSlug];
      } else {
        out[phaseSlug][moduleSlug] = dict;
      }
    }
    if (Object.keys(out[phaseSlug]).length === 0) {
      delete out[phaseSlug];
    }
  }
  return out;
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

function wrapMatchInTextNode(node: Text, search: string, id: string, color: HighlightColor): boolean {
  const idx = node.data.indexOf(search);
  if (idx === -1) return false;
  const range = document.createRange();
  range.setStart(node, idx);
  range.setEnd(node, idx + search.length);
  const mark = document.createElement("mark");
  mark.className = `lesson-highlight lesson-highlight-${color}`;
  mark.dataset.highlightId = id;
  mark.dataset.highlightColor = color;
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
    const color = isHighlightColor(highlight.color) ? highlight.color : DEFAULT_HIGHLIGHT_COLOR;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: acceptTextNode,
    });

    let node = walker.nextNode() as Text | null;
    while (node) {
      if (
        wrapMatchInTextNode(node, search, highlight.id, color) ||
        wrapMatchInTextNode(node, highlight.text, highlight.id, color)
      ) {
        break;
      }
      node = walker.nextNode() as Text | null;
    }
  }
}
