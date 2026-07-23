import type { LessonContent } from "../lesson-types";

export interface LessonInput {
  concept: string;
  whyItExists: string;
  analogy: string;
  analogyDiagram?: string;
  technicalExplanation?: string;
  architecture?: string;
  diagram?: string;
  example: string;
  exampleSolution?: string;
  code?: string;
  codeLanguage?: string;
  commandsToRemember?: string[];
  project?: string;
  interviewQuestions?: { question: string; answer: string; difficulty: "easy" | "medium" | "hard" }[];
  revisionNotes?: Partial<LessonContent["revisionNotes"]>;
  glossary?: string[];
  furtherReading?: { title: string; url: string }[];
  commonMistakes?: string[];
}

export function createLesson(input: LessonInput): LessonContent {
  return {
    concept: input.concept,
    whyItExists: input.whyItExists,
    analogy: input.analogy,
    analogyDiagram: input.analogyDiagram,
    technicalExplanation: input.technicalExplanation ?? "",
    architecture: input.architecture,
    diagram: input.diagram,
    example: input.example,
    exampleSolution: input.exampleSolution,
    code: input.code,
    codeLanguage: input.codeLanguage,
    commandsToRemember: input.commandsToRemember,
    project: input.project,
    interviewQuestions: input.interviewQuestions ?? [],
    revisionNotes: {
      fiveMin: input.revisionNotes?.fiveMin ?? [input.concept.split(".")[0]],
      fifteenMin: input.revisionNotes?.fifteenMin ?? [input.technicalExplanation?.split(".")[0] ?? input.concept.split(".")[0]],
      oneHour: input.revisionNotes?.oneHour ?? [input.example],
      cheatSheet: input.revisionNotes?.cheatSheet ?? [input.concept.split(".")[0]],
    },
    glossary: input.glossary ?? [],
    furtherReading: input.furtherReading,
    commonMistakes: input.commonMistakes,
  };
}

export function iq(
  question: string,
  answer: string,
  difficulty: "easy" | "medium" | "hard" = "medium"
) {
  return { question, answer, difficulty };
}
