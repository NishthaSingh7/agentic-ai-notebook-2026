export interface WorkflowDiagram {
  title: string;
  chart: string;
  caption?: string;
}

/** One CLI question the learner should expect, with the exact answer to type. */
export interface BuildPrompt {
  ask: string;
  type: string;
}

/** Numbered local-build walkthrough (used by the last module of a phase). */
export interface BuildStep {
  title: string;
  /** Where to run or edit: terminal vs project folder vs specific file. */
  where?: string;
  body: string;
  command?: string;
  /** Interactive CLI questions that appear after a command. */
  prompts?: BuildPrompt[];
  file?: string;
  code?: string;
  codeLanguage?: string;
}

export interface LessonContent {
  concept: string;
  whyItExists: string;
  analogy: string;
  analogyDiagram?: string;
  technicalExplanation: string;
  architecture?: string;
  diagram?: string;
  workflowDiagrams?: WorkflowDiagram[];
  /** Visual-first layout: diagrams up top, minimal text */
  visualFirst?: boolean;
  example: string;
  exampleSolution?: string;
  practiceTask?: string;
  learnElsewhere?: string[];
  code?: string;
  codeLanguage?: string;
  /** Ordered install / file / run steps. Prefer this over a single dumped code block. */
  buildSteps?: BuildStep[];
  commandsToRemember?: string[];
  project?: string;
  interviewQuestions: { question: string; answer: string; difficulty: "easy" | "medium" | "hard" }[];
  revisionNotes: {
    fiveMin: string[];
    fifteenMin: string[];
    oneHour: string[];
    cheatSheet: string[];
  };
  glossary: string[];
  furtherReading?: { title: string; url: string }[];
  commonMistakes?: string[];
}
