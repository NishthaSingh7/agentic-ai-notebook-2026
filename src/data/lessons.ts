import { calculateLessonReadMinutes } from "@/lib/lesson-read-time";
import type { LessonContent } from "./lesson-types";
import { phases } from "./roadmap";
import { generatedLessonMaps } from "./lessons/v2-generated";
import {
  buildUnifiedLessonMaps,
  getUnifiedLesson,
} from "./lessons/unified-registry";
import { enrichLesson } from "./lessons/enrich-lessons";

export type { LessonContent } from "./lesson-types";

const rawLessonMaps = buildUnifiedLessonMaps(phases.map((p) => p.slug));

// Fill any remaining gaps from v2 generated (cross-phase lookup)
for (const phase of phases) {
  for (const mod of phase.modules) {
    if (!rawLessonMaps[phase.slug]?.[mod.slug]) {
      const lesson = getUnifiedLesson(phase.slug, mod.slug, rawLessonMaps);
      if (lesson) {
        rawLessonMaps[phase.slug] ??= {};
        rawLessonMaps[phase.slug][mod.slug] = lesson;
      } else {
        for (const genPhase of Object.values(generatedLessonMaps)) {
          if (genPhase[mod.slug]) {
            rawLessonMaps[phase.slug] ??= {};
            rawLessonMaps[phase.slug][mod.slug] = genPhase[mod.slug];
            break;
          }
        }
      }
    }
  }
}

// Enrich all lessons with diagrams + concrete examples
const phaseLessonMaps: Record<string, Record<string, LessonContent>> = {};
for (const phase of phases) {
  phaseLessonMaps[phase.slug] = {};
  for (const mod of phase.modules) {
    const raw =
      rawLessonMaps[phase.slug]?.[mod.slug] ??
      getDefaultLesson(mod.title, phase.title);
    phaseLessonMaps[phase.slug][mod.slug] = enrichLesson(
      raw,
      mod.slug,
      mod.title,
      phase.slug,
      phase.title
    );
  }
}

export const COMPLETE_PHASES = new Set(phases.map((p) => p.slug));

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
    concept: `${moduleTitle} is a key topic in ${phaseTitle} for building production AI agent systems.`,
    whyItExists: `Understanding ${moduleTitle} helps you build reliable, scalable agent applications instead of fragile demos.`,
    analogy: `Think of ${moduleTitle} as a specialized capability in your ${phaseTitle} engineering toolkit.`,
    technicalExplanation: `${moduleTitle} covers the concepts, patterns, and implementation details you need in ${phaseTitle}. Focus on inputs, outputs, failure modes, latency, and cost.`,
    example: `A production team in ${phaseTitle} uses ${moduleTitle} to handle a real user request — reducing manual work and improving response quality with proper validation and logging.`,
    interviewQuestions: [],
    revisionNotes: {
      fiveMin: [`${moduleTitle} — core idea`, `When to use vs alternatives`, `Key failure modes`],
      fifteenMin: [`Practice ${moduleTitle} hands-on`, `Review related glossary terms`, `Trace one request end-to-end`],
      oneHour: [`Build a mini demo with ${moduleTitle}`, `Add logging and one eval test`, `Document tradeoffs`],
      cheatSheet: [moduleTitle, phaseTitle],
    },
    glossary: [moduleTitle],
  };
}
