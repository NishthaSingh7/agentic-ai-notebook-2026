import type { LessonContent } from "@/data/lesson-types";
import { isCurriculumPhase, isFoundationPhase } from "@/lib/curriculum-phases";
import { enhanceLessonCode, generateFallbackCode } from "@/lib/enhance-lesson-code";
import {
  getCurriculumAnalogyDiagram,
  getCurriculumCommands,
  getCurriculumDiagram,
} from "@/lib/curriculum-content";

function buildCheatSheet(lesson: LessonContent): string[] {
  const primary = lesson.revisionNotes.cheatSheet.filter(Boolean);
  const fallback = [
    ...lesson.revisionNotes.fiveMin,
    ...lesson.revisionNotes.fifteenMin,
  ].filter(Boolean);

  const merged = primary.length > 0 ? primary : fallback;
  const unique = [...new Set(merged)];
  return unique.slice(0, 8);
}

/**
 * Normalizes lesson content for Phase 0 and curriculum phases (1–10).
 */
export function normalizeCurriculumLesson(
  lesson: LessonContent,
  phaseSlug: string,
  moduleSlug: string,
  moduleTitle: string
): LessonContent {
  if (!isFoundationPhase(phaseSlug) && !isCurriculumPhase(phaseSlug)) {
    return lesson;
  }

  const cheatSheet = buildCheatSheet(lesson);
  const includeCode = isCurriculumPhase(phaseSlug);
  const isPhase0 = isFoundationPhase(phaseSlug);

  let code = lesson.code;
  if (includeCode) {
    code = code ? enhanceLessonCode(code, moduleSlug, moduleTitle) : generateFallbackCode(moduleTitle, moduleSlug);
  }

  const diagram = isPhase0
    ? lesson.diagram
    : getCurriculumDiagram(moduleSlug, moduleTitle, phaseSlug);
  const commandsToRemember = isPhase0
    ? lesson.commandsToRemember
    : getCurriculumCommands(moduleSlug, phaseSlug, cheatSheet, lesson.commandsToRemember);
  const analogyDiagram = isPhase0
    ? lesson.analogyDiagram
    : (lesson.analogyDiagram ?? getCurriculumAnalogyDiagram(moduleTitle));

  return {
    ...lesson,
    diagram,
    analogyDiagram,
    commandsToRemember,
    code: includeCode ? code : undefined,
    interviewQuestions: [],
    project: undefined,
    revisionNotes: {
      fiveMin: [],
      fifteenMin: [],
      oneHour: [],
      cheatSheet,
    },
  };
}
