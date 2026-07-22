import { calculateLessonReadMinutes } from "@/lib/lesson-read-time";
import type { LessonContent } from "./lesson-types";

export type { LessonContent } from "./lesson-types";

/**
 * v2 lesson content maps — populated as modules are written.
 * Legacy v1 lesson files remain in src/data/lessons/ for reference during migration.
 */
const phaseLessonMaps: Record<string, Record<string, LessonContent>> = {};

export const COMPLETE_PHASES = new Set<string>();

export function getLessonContent(
  phaseSlug: string,
  moduleSlug: string
): LessonContent | null {
  return phaseLessonMaps[phaseSlug]?.[moduleSlug] ?? null;
}

export function hasLessonContent(phaseSlug: string, moduleSlug: string): boolean {
  return getLessonContent(phaseSlug, moduleSlug) !== null;
}

export function getLessonReadTime(phaseSlug: string, moduleSlug: string): number | null {
  const content = getLessonContent(phaseSlug, moduleSlug);
  if (!content) return null;
  return calculateLessonReadMinutes(content);
}

export function isPhaseComplete(phaseSlug: string): boolean {
  return COMPLETE_PHASES.has(phaseSlug);
}

export function getDefaultLesson(
  moduleTitle: string,
  phaseTitle: string
): LessonContent {
  return {
    concept: `This lesson on ${moduleTitle} is part of ${phaseTitle} and is being migrated to the v2 curriculum.`,
    whyItExists:
      "The roadmap was restructured in 2026 (v2) for better pacing. Lesson content for this module is scheduled next — Phase 0–1 were taught live and will be published module by module.",
    analogy:
      "Think of this as a chapter being transcribed from live teaching into the notebook format.",
    technicalExplanation:
      "This module is planned in the v2 roadmap. Explore the Glossary and Interview Prep sections for related concepts while we finish writing this lesson.",
    example:
      "A worked example will be added when this lesson is published.",
    interviewQuestions: [],
    revisionNotes: {
      fiveMin: [`${moduleTitle} — coming soon in v2`],
      fifteenMin: [`${moduleTitle} — follow the v2 roadmap order`],
      oneHour: [`Review completed Phase 0–1 modules on the roadmap`],
      cheatSheet: [`${moduleTitle} — draft`],
    },
    glossary: [],
  };
}
