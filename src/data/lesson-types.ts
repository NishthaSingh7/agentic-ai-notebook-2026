export interface LessonContent {
  concept: string;
  whyItExists: string;
  analogy: string;
  technicalExplanation: string;
  architecture?: string;
  diagram?: string;
  example: string;
  code?: string;
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
