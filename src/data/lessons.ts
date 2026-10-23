import type { LessonContent } from "./lesson-types";

export type { LessonContent } from "./lesson-types";

/**
 * The live roadmap no longer serves the 2026 lesson registries.
 * Spoken lessons live in spoken-lessons.ts.
 */
export const COMPLETE_PHASES = new Set<string>();

export function getLessonContent(
  _phaseSlug: string,
  _moduleSlug: string
): LessonContent | null {
  return null;
}

export function hasLessonContent(_phaseSlug: string, _moduleSlug: string): boolean {
  return false;
}

export function getLessonReadTime(_phaseSlug: string, _moduleSlug: string): number | null {
  return null;
}

export function isPhaseComplete(_phaseSlug: string): boolean {
  return false;
}
