export type ProjectDifficulty = "beginner" | "intermediate" | "advanced" | "production";

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
}

export const projects: Project[] = [
  {
    slug: "ai-resume-reviewer",
    title: "AI Resume Reviewer",
    description:
      "Build an AI-powered resume analyzer that scores resumes, suggests improvements, and tailors feedback for specific job descriptions.",
    difficulty: "beginner",
    phase: 3,
    techStack: ["Python", "OpenAI API", "FastAPI", "React"],
    features: [
      "PDF resume parsing",
      "ATS score calculation",
      "Job description matching",
      "Improvement suggestions",
    ],
    estimatedHours: 8,
    resumePoints: [
      "Built an AI resume reviewer using GPT-4 with structured output parsing",
      "Implemented PDF extraction pipeline processing 50+ resume formats",
    ],
  },
  {
    slug: "pdf-chat",
    title: "PDF Chat",
    description:
      "Upload PDFs and chat with their contents using RAG — the quintessential LLM engineering project.",
    difficulty: "beginner",
    phase: 3,
    techStack: ["Python", "LangChain", "ChromaDB", "Streamlit"],
    features: ["PDF upload", "Chunking pipeline", "Semantic search", "Streaming chat"],
    estimatedHours: 6,
    resumePoints: [
      "Developed a RAG-based PDF chat application with ChromaDB vector store",
      "Optimized chunking strategy improving answer relevance by 40%",
    ],
  },
  {
    slug: "enterprise-chatbot",
    title: "Enterprise Chatbot",
    description:
      "Production-grade RAG chatbot with hybrid search, re-ranking, and evaluation metrics for enterprise knowledge bases.",
    difficulty: "intermediate",
    phase: 4,
    techStack: ["Python", "LangChain", "Pinecone", "FastAPI", "React"],
    features: [
      "Hybrid search (BM25 + vector)",
      "Cross-encoder re-ranking",
      "Citation tracking",
      "Evaluation dashboard",
    ],
    estimatedHours: 20,
    resumePoints: [
      "Architected enterprise RAG chatbot serving 10K+ documents with hybrid search",
      "Implemented re-ranking pipeline improving retrieval precision by 35%",
    ],
  },
  {
    slug: "ai-coding-agent",
    title: "AI Coding Agent",
    description:
      "An autonomous coding agent that reads codebases, plans changes, writes code, runs tests, and self-corrects.",
    difficulty: "advanced",
    phase: 5,
    techStack: ["Python", "LangGraph", "OpenAI", "Docker", "Git"],
    features: [
      "Codebase analysis",
      "Multi-step planning",
      "Test execution",
      "Self-correction loop",
    ],
    estimatedHours: 40,
    resumePoints: [
      "Built autonomous coding agent with ReAct loop and self-correction",
      "Integrated tool calling for file I/O, terminal, and git operations",
    ],
  },
  {
    slug: "github-mcp",
    title: "GitHub MCP Server",
    description:
      "Build an MCP server that exposes GitHub repositories, issues, and PRs as tools for AI agents.",
    difficulty: "intermediate",
    phase: 7,
    techStack: ["TypeScript", "MCP SDK", "GitHub API"],
    features: [
      "Repository browsing",
      "Issue management",
      "PR review tools",
      "Code search",
    ],
    estimatedHours: 12,
    resumePoints: [
      "Developed MCP server exposing GitHub API as agent tools",
      "Implemented secure authentication and rate limiting",
    ],
  },
  {
    slug: "production-ai-platform",
    title: "Production AI Platform",
    description:
      "Full observability stack for AI applications — tracing, evaluation, prompt versioning, and cost monitoring.",
    difficulty: "production",
    phase: 8,
    techStack: ["Python", "LangSmith", "Prometheus", "Grafana", "Kubernetes"],
    features: [
      "Distributed tracing",
      "Prompt versioning",
      "Cost dashboards",
      "A/B testing",
      "Auto-scaling",
    ],
    estimatedHours: 60,
    resumePoints: [
      "Built production AI observability platform monitoring 1M+ LLM calls/month",
      "Reduced inference costs by 45% through caching and model routing",
    ],
  },
  {
    slug: "ai-customer-support",
    title: "AI Customer Support",
    description:
      "Multi-agent customer support system with escalation, sentiment analysis, and knowledge base integration.",
    difficulty: "advanced",
    phase: 10,
    techStack: ["Python", "CrewAI", "LangGraph", "PostgreSQL", "Redis"],
    features: [
      "Multi-agent orchestration",
      "Sentiment detection",
      "Human escalation",
      "Conversation memory",
    ],
    estimatedHours: 50,
    resumePoints: [
      "Architected multi-agent customer support reducing ticket resolution time by 60%",
      "Implemented agent memory and escalation workflows",
    ],
  },
  {
    slug: "ai-interview-coach",
    title: "AI Interview Coach",
    description:
      "Voice-enabled interview practice agent with real-time feedback, scoring, and personalized improvement plans.",
    difficulty: "advanced",
    phase: 10,
    techStack: ["Python", "OpenAI Realtime API", "Whisper", "React"],
    features: [
      "Voice interaction",
      "Real-time feedback",
      "Score tracking",
      "Personalized coaching",
    ],
    estimatedHours: 35,
    resumePoints: [
      "Built voice-enabled AI interview coach with real-time speech processing",
      "Designed evaluation rubric with automated scoring across 5 dimensions",
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const difficultyColors: Record<ProjectDifficulty, string> = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-blue-600/10 text-blue-400 border-blue-600/20",
  advanced: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  production: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};
