export type ChallengeLevel = "beginner" | "intermediate" | "advanced";

export interface ChallengeDiagram {
  title: string;
  caption?: string;
  chart: string;
}

export interface ChallengeCode {
  title: string;
  language: string;
  code: string;
}

export interface ChallengeStage {
  id: string;
  level: ChallengeLevel;
  title: string;
  body: string[];
  diagrams?: ChallengeDiagram[];
  codes?: ChallengeCode[];
}

export interface ChallengeWorkedExample {
  title: string;
  setup: string;
  walkthrough: string[];
  result: string;
}

export interface ChallengePractice {
  title: string;
  task: string;
  hint: string;
  solution: string;
}

export interface ChallengeInterview {
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface ChallengeGlossaryItem {
  term: string;
  meaning: string;
}

export interface ChallengeLesson {
  slug: string;
  instructor: string;
  promise: string;
  story: {
    title: string;
    body: string[];
    moral: string;
  };
  stages: ChallengeStage[];
  workedExample: ChallengeWorkedExample;
  practice: ChallengePractice;
  takeaways: string[];
  mistakes: string[];
  interviews: ChallengeInterview[];
  glossary: ChallengeGlossaryItem[];
}
