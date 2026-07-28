export interface WorkflowDiagram {
  title: string;
  chart: string;
  caption?: string;
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
