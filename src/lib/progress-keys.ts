import { getModule } from "@/data/roadmap";
import { notes } from "@/data/notes";

export const PROGRESS_STORAGE_KEY = "agentic-ai-progress";
/** Set after this browser has replaced Mongo with the cleaned local list once. */
export const PROGRESS_MIGRATION_KEY = "agentic-ai-progress-migrated";
/** Local calendar date (YYYY-MM-DD) of the last successful noon sync. */
export const PROGRESS_NOON_SYNC_KEY = "agentic-ai-progress-noon-sync";

/**
 * A key we still keep: a current roadmap card, including side-shelf cards,
 * or a current note card. Old curriculum slugs and challenge keys are not.
 */
export function isCurrentProgressKey(key: string): boolean {
  if (typeof key !== "string" || key.length === 0) return false;

  if (key.startsWith("notes/")) {
    const rest = key.slice("notes/".length);
    const slash = rest.indexOf("/");
    if (slash <= 0 || slash !== rest.lastIndexOf("/")) return false;
    const noteSlug = rest.slice(0, slash);
    const cardSlug = rest.slice(slash + 1);
    const note = notes.find((item) => item.slug === noteSlug);
    if (!note) return false;
    if (note.cards && note.cards.length > 0) {
      return note.cards.some((card) => card.slug === cardSlug);
    }
    return cardSlug === "note";
  }

  if (key.startsWith("challenge/")) return false;

  const slash = key.indexOf("/");
  if (slash <= 0 || slash !== key.lastIndexOf("/")) return false;
  return Boolean(getModule(key.slice(0, slash), key.slice(slash + 1)));
}

export function sanitizeProgressKeys(keys: Iterable<string>): string[] {
  const kept: string[] = [];
  const seen = new Set<string>();
  for (const key of keys) {
    if (!isCurrentProgressKey(key) || seen.has(key)) continue;
    seen.add(key);
    kept.push(key);
  }
  return kept;
}

/** Calendar date in the user's local timezone. */
export function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Today's noon has passed, and this browser has not yet saved for that noon.
 * Before 12:00 local time this is false, even if yesterday's sync is missing.
 */
export function isNoonSyncDue(lastSyncDate: string | null, now = new Date()): boolean {
  const noon = new Date(now);
  noon.setHours(12, 0, 0, 0);
  if (now < noon) return false;
  return lastSyncDate !== localDateKey(now);
}

/** Milliseconds until the next local noon, today if it is still morning, otherwise tomorrow. */
export function msUntilFollowingNoon(now = new Date()): number {
  const noon = new Date(now);
  noon.setHours(12, 0, 0, 0);
  if (now < noon) return noon.getTime() - now.getTime();
  const tomorrow = new Date(noon);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.getTime() - now.getTime();
}
