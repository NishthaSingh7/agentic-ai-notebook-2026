export type ProjectDifficulty = "beginner" | "intermediate" | "advanced" | "production";

export interface ProjectTimePhase {
  phase: string;
  hours: number;
  tasks: string[];
}

export interface ProjectSlide {
  title: string;
  subtitle?: string;
  bullets?: string[];
  diagram?: string;
  caption?: string;
}

export interface ProjectInterviewQ {
  question: string;
  answer: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  difficulty: ProjectDifficulty;
  phase: number;
  techStack: string[];
  features: string[];
  estimatedHours: number;
  resumePoints: string[];
  prerequisites: string[];
  setupSteps: string[];
  architectureExplanation: string;
  architectureDiagram: string;
  timeBreakdown: ProjectTimePhase[];
  expectedOutcome: string;
  slides: ProjectSlide[];
  interviewQuestions: ProjectInterviewQ[];
}
