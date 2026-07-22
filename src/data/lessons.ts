import { calculateLessonReadMinutes } from "@/lib/lesson-read-time";
import { phase0Lessons } from "./lessons/phase-0";
import { phase1Lessons } from "./lessons/phase-1";
import { phase2Lessons } from "./lessons/phase-2";
import { phase3Lessons } from "./lessons/phase-3";
import { phase4Lessons } from "./lessons/phase-4";
import { phase5Lessons } from "./lessons/phase-5";
import { phase6Lessons } from "./lessons/phase-6";
import type { LessonContent } from "./lesson-types";

export type { LessonContent } from "./lesson-types";

const phaseLessonMaps: Record<string, Record<string, LessonContent>> = {
  "programming-foundations": phase0Lessons,
  "genai-foundations": phase1Lessons,
  "ai-engineering-foundations": phase2Lessons,
  "llm-engineering": phase3Lessons,
  "rag-engineering": phase4Lessons,
  "agentic-ai": phase5Lessons,
  "agent-frameworks": phase6Lessons,
};

/** Phases 0–6 have full lesson content; phases 7–10 remain draft. */
export const COMPLETE_PHASES = new Set(Object.keys(phaseLessonMaps));

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
    concept: `This lesson on ${moduleTitle} is part of ${phaseTitle} and is currently being written.`,
    whyItExists:
      "Phases 7–10 are being developed incrementally. Full lessons for Phases 0–6 are available now — explore those while we finish this content.",
    analogy:
      "Think of this as a chapter not yet published in the curriculum. The structure is planned; detailed content is on the way.",
    technicalExplanation:
      "This module is scheduled for a future release. Use the Glossary and Interview Prep sections for related concepts in the meantime.",
    example:
      "A worked example will be added when this lesson is complete.",
    interviewQuestions: [],
    revisionNotes: {
      fiveMin: [`${moduleTitle} — coming in a future update`],
      fifteenMin: [`${moduleTitle} lesson is planned for Phase 7+`],
      oneHour: [`Study related modules in Phases 0–6`],
      cheatSheet: [`${moduleTitle} — draft`],
    },
    glossary: [],
  };
}
