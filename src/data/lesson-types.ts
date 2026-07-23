export interface LessonContent {
  concept: string;
  whyItExists: string;
  analogy: string;
  analogyDiagram?: string;
  technicalExplanation: string;
  architecture?: string;
  diagram?: string;
  example: string;
  exampleSolution?: string;
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
