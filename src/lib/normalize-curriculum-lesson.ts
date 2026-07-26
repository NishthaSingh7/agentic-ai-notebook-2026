import type { LessonContent } from "@/data/lesson-types";
import {
  isCodeWalkthroughPhase,
  isFoundationPhase,
  usesCurriculumLayout,
} from "@/lib/curriculum-phases";
import { enhanceLessonCode, generateFallbackCode } from "@/lib/enhance-lesson-code";
import {
  getCurriculumAnalogyDiagram,
  getCurriculumCommands,
  getCurriculumDiagram,
} from "@/lib/curriculum-content";
import {
  generateExampleSolution,
  generatePracticeTask,
} from "@/lib/curriculum-practice";

/** Capstone lessons with hand-crafted diagrams — preserve when present. */
const HAND_CRAFTED_DIAGRAM_SLUGS = new Set([
  "ai-software-engineer",
  "ai-research-assistant",
  "ai-customer-support",
  "ai-resume-reviewer",
  "ai-travel-planner",
  "ai-meeting-assistant",
  "autonomous-browser-agent",
  "multi-agent-coding-assistant",
  "enterprise-knowledge-assistant",
]);

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
 * Normalizes lesson content for all curriculum-layout phases (0–21).
 */
export function normalizeCurriculumLesson(
  lesson: LessonContent,
  phaseSlug: string,
  moduleSlug: string,
  moduleTitle: string,
  phaseTitle: string
): LessonContent {
  if (!usesCurriculumLayout(phaseSlug)) {
    return lesson;
  }

  const cheatSheet = buildCheatSheet(lesson);
  const isPhase0 = isFoundationPhase(phaseSlug);
  const includeCode = isCodeWalkthroughPhase(phaseSlug);

  let code = lesson.code;
  if (includeCode) {
    code = code ? enhanceLessonCode(code, moduleSlug, moduleTitle) : generateFallbackCode(moduleTitle, moduleSlug);
  }

  const keepHandDiagram =
    (isPhase0 || HAND_CRAFTED_DIAGRAM_SLUGS.has(moduleSlug)) && !!lesson.diagram;

  const diagram = keepHandDiagram
    ? lesson.diagram
    : getCurriculumDiagram(
        moduleSlug,
        moduleTitle,
        phaseSlug,
        cheatSheet,
        lesson.commonMistakes
      );

  const commandsToRemember = isPhase0
    ? lesson.commandsToRemember
    : getCurriculumCommands(moduleSlug, phaseSlug, cheatSheet, lesson.commandsToRemember);

  const analogyDiagram =
    lesson.analogyDiagram ??
    (isPhase0 ? undefined : getCurriculumAnalogyDiagram(moduleTitle));

  const example = lesson.example?.trim() || `A production team uses ${moduleTitle} in a real ${phaseTitle} workflow.`;

  const exampleSolution =
    lesson.exampleSolution?.trim() ||
    generateExampleSolution(moduleTitle, example, phaseTitle);

  const practiceTask =
    lesson.practiceTask?.trim() ||
    generatePracticeTask(moduleTitle, moduleSlug, phaseTitle, example, includeCode);

  return {
    ...lesson,
    example,
    exampleSolution,
    practiceTask,
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
