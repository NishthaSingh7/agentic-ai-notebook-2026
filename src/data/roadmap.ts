export type PhaseStatus = "completed" | "in-progress" | "upcoming";

export interface Module {
  slug: string;
  title: string;
  description?: string;
  status?: "completed" | "next" | "upcoming";
}

export interface Phase {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  modules: Module[];
  projects?: string[];
  estimatedHours: number;
  color: string;
  status: PhaseStatus;
}

function mod(slug: string, title: string, status?: Module["status"]): Module {
  return status ? { slug, title, status } : { slug, title };
}

export const phases: Phase[] = [
  {
    id: 0,
    slug: "genai-foundations",
    title: "GenAI Foundations",
    subtitle: "Phase 0",
    description:
      "LLM basics, prompt engineering, embeddings, vector databases, RAG, LangChain, ChromaDB, and your first tool-calling patterns.",
    estimatedHours: 25,
    color: "from-green-500 to-emerald-700",
    status: "completed",
    modules: [
      mod("llm-basics", "LLM Basics", "completed"),
      mod("prompt-engineering", "Prompt Engineering", "completed"),
      mod("embeddings", "Embeddings", "completed"),
      mod("vector-databases", "Vector Databases", "completed"),
      mod("rag-basics", "RAG Basics", "completed"),
      mod("langchain-basics", "LangChain Basics", "completed"),
      mod("chromadb", "ChromaDB", "completed"),
      mod("streamlit", "Streamlit", "completed"),
      mod("google-gemini", "Google Gemini", "completed"),
      mod("basic-tool-calling", "Basic Tool Calling", "completed"),
    ],
    projects: ["RAG Chat App", "Gemini Tool Assistant"],
  },
  {
    id: 1,
    slug: "agent-foundations",
    title: "Agent Foundations",
    subtitle: "Phase 1",
    description:
      "What agents are, how they work, core terminology, architectures, and the current landscape — before touching frameworks.",
    estimatedHours: 30,
    color: "from-blue-600 to-blue-900",
    status: "in-progress",
    modules: [
      mod("evolution-of-ai", "Evolution of AI", "completed"),
      mod("what-is-an-ai-agent", "What is an AI Agent?", "completed"),
      mod("why-llms-need-agents", "Why LLMs Need Agents", "completed"),
      mod("anatomy-of-an-agent", "Anatomy of an Agent", "completed"),
      mod("agent-lifecycle", "Agent Lifecycle", "completed"),
      mod("core-concepts", "Core Concepts", "completed"),
      mod("agent-capabilities", "Agent Capabilities", "completed"),
      mod("types-of-agents", "Types of Agents", "completed"),
      mod("agent-architectures", "Agent Architectures", "completed"),
      mod("agent-terminology", "Agent Terminology", "completed"),
      mod("current-agent-landscape", "Current Agent Landscape", "completed"),
      mod("build-first-ai-agent", "Build First AI Agent", "next"),
    ],
    projects: ["No-Framework Agent (Python + LLM API)"],
  },
  {
    id: 2,
    slug: "agent-memory",
    title: "Agent Memory",
    subtitle: "Phase 2",
    description:
      "One of the biggest interview topics — working, short-term, long-term, semantic, and episodic memory for production agents.",
    estimatedHours: 20,
    color: "from-green-400 to-green-700",
    status: "upcoming",
    modules: [
      mod("memory-fundamentals", "Memory Fundamentals"),
      mod("working-memory", "Working Memory"),
      mod("short-term-memory", "Short-Term Memory"),
      mod("long-term-memory", "Long-Term Memory"),
      mod("semantic-memory", "Semantic Memory"),
      mod("episodic-memory", "Episodic Memory"),
      mod("procedural-memory", "Procedural Memory"),
      mod("conversation-memory", "Conversation Memory"),
      mod("memory-stores", "Memory Stores"),
      mod("memory-compression", "Memory Compression"),
      mod("memory-summarization", "Memory Summarization"),
      mod("memory-retrieval", "Memory Retrieval"),
      mod("memory-ranking", "Memory Ranking"),
      mod("context-management", "Context Management"),
      mod("build-memory-from-scratch", "Build Memory from Scratch"),
    ],
    projects: ["Persistent AI Assistant"],
  },
  {
    id: 3,
    slug: "tool-calling",
    title: "Tool Calling & Function Calling",
    subtitle: "Phase 3",
    description:
      "Tool registries, structured outputs, dynamic tool loading, permissions, and building a tool-using assistant.",
    estimatedHours: 22,
    color: "from-blue-500 to-blue-800",
    status: "upcoming",
    modules: [
      mod("tool-calling", "Tool Calling"),
      mod("function-calling", "Function Calling"),
      mod("json-mode", "JSON Mode"),
      mod("structured-outputs", "Structured Outputs"),
      mod("tool-registry", "Tool Registry"),
      mod("tool-selection", "Tool Selection"),
      mod("dynamic-tool-loading", "Dynamic Tool Loading"),
      mod("tool-permissions", "Tool Permissions"),
      mod("tool-validation", "Tool Validation"),
      mod("retry-and-fallback", "Retry & Fallback"),
      mod("external-apis", "External APIs"),
      mod("browser-tool", "Browser Tool"),
      mod("python-tool", "Python Tool"),
      mod("sql-tool", "SQL Tool"),
      mod("filesystem-tool", "Filesystem Tool"),
    ],
    projects: ["AI Tool-Using Assistant"],
  },
  {
    id: 4,
    slug: "mcp",
    title: "Model Context Protocol",
    subtitle: "Phase 4",
    description:
      "MCP architecture, clients, servers, resources, tools, prompts, transport, and integrating MCP with agents.",
    estimatedHours: 18,
    color: "from-emerald-500 to-green-700",
    status: "upcoming",
    modules: [
      mod("why-mcp", "Why MCP"),
      mod("mcp-architecture", "MCP Architecture"),
      mod("mcp-client", "MCP Client"),
      mod("mcp-server", "MCP Server"),
      mod("resources", "Resources"),
      mod("tools", "Tools"),
      mod("prompts", "Prompts"),
      mod("local-mcp", "Local MCP"),
      mod("remote-mcp", "Remote MCP"),
      mod("authentication", "Authentication"),
      mod("transport", "Transport"),
      mod("build-mcp-server", "Build MCP Server"),
      mod("integrate-mcp-with-agent", "Integrate MCP with Agent"),
    ],
    projects: ["Custom MCP Server", "Agent + MCP Integration"],
  },
  {
    id: 5,
    slug: "agent-frameworks",
    title: "Agent Frameworks",
    subtitle: "Phase 5",
    description:
      "Master LangGraph, OpenAI Agents SDK, and Google ADK. Learn CrewAI and LlamaIndex well. Stay aware of the emerging framework landscape.",
    estimatedHours: 45,
    color: "from-blue-600 to-blue-900",
    status: "upcoming",
    modules: [
      mod("langgraph", "LangGraph"),
      mod("langgraph-nodes-edges", "Nodes & Edges"),
      mod("langgraph-stategraph", "StateGraph"),
      mod("langgraph-conditional-routing", "Conditional Routing"),
      mod("langgraph-checkpoints", "Checkpoints & Persistence"),
      mod("langgraph-human-in-the-loop", "Human-in-the-Loop"),
      mod("openai-agents-sdk", "OpenAI Agents SDK"),
      mod("openai-sessions-handoffs", "Sessions & Handoffs"),
      mod("openai-guardrails-tracing", "Guardrails & Tracing"),
      mod("google-adk", "Google ADK"),
      mod("google-adk-workflows", "ADK Workflows & Sub-Agents"),
      mod("crewai", "CrewAI"),
      mod("llamaindex-workflows", "LlamaIndex Workflows"),
      mod("microsoft-agent-framework", "Microsoft Agent Framework"),
      mod("mastra", "Mastra"),
      mod("pydantic-ai", "PydanticAI"),
      mod("smolagents", "smolagents"),
      mod("agno", "Agno"),
      mod("haystack-agents", "Haystack Agents"),
      mod("aws-strands", "AWS Strands"),
    ],
  },
  {
    id: 6,
    slug: "multi-agent-systems",
    title: "Multi-Agent Systems",
    subtitle: "Phase 6",
    description:
      "A2A protocol, supervisor/worker patterns, swarm intelligence, coordination, and multi-agent projects.",
    estimatedHours: 25,
    color: "from-green-500 to-emerald-700",
    status: "upcoming",
    modules: [
      mod("a2a-protocol", "A2A Protocol"),
      mod("supervisor-agent", "Supervisor Agent"),
      mod("worker-agent", "Worker Agent"),
      mod("planner-agent", "Planner Agent"),
      mod("research-agent", "Research Agent"),
      mod("critic-agent", "Critic Agent"),
      mod("reviewer-agent", "Reviewer Agent"),
      mod("swarm-intelligence", "Swarm Intelligence"),
      mod("agent-coordination", "Agent Coordination"),
      mod("task-delegation", "Task Delegation"),
      mod("shared-memory", "Shared Memory"),
      mod("parallel-execution", "Parallel Execution"),
    ],
    projects: ["Multi-Agent Research System"],
  },
  {
    id: 7,
    slug: "agent-evaluation",
    title: "Agent Evaluation & Observability",
    subtitle: "Phase 7",
    description:
      "LangSmith, Phoenix, OpenTelemetry, trajectory evaluation, hallucination detection, and regression testing.",
    estimatedHours: 20,
    color: "from-blue-500 to-blue-800",
    status: "upcoming",
    modules: [
      mod("observability", "Observability"),
      mod("langsmith", "LangSmith"),
      mod("phoenix", "Phoenix"),
      mod("opentelemetry", "OpenTelemetry"),
      mod("wandb", "W&B"),
      mod("llm-evaluation", "LLM Evaluation"),
      mod("agent-evaluation", "Agent Evaluation"),
      mod("tool-evaluation", "Tool Evaluation"),
      mod("trajectory-evaluation", "Trajectory Evaluation"),
      mod("hallucination-detection", "Hallucination Detection"),
      mod("regression-testing", "Regression Testing"),
    ],
  },
  {
    id: 8,
    slug: "security-guardrails",
    title: "Security & Guardrails",
    subtitle: "Phase 8",
    description:
      "Prompt injection, jailbreaks, PII detection, content safety, tool restrictions, and human approval flows.",
    estimatedHours: 15,
    color: "from-green-400 to-green-700",
    status: "upcoming",
    modules: [
      mod("prompt-injection", "Prompt Injection"),
      mod("jailbreaks", "Jailbreaks"),
      mod("pii-detection", "PII Detection"),
      mod("content-safety", "Content Safety"),
      mod("tool-restrictions", "Tool Restrictions"),
      mod("policy-engine", "Policy Engine"),
      mod("human-approval", "Human Approval"),
    ],
  },
  {
    id: 9,
    slug: "production-agents",
    title: "Production Agent Engineering",
    subtitle: "Phase 9",
    description:
      "FastAPI, Docker, Kubernetes, async agents, queues, streaming, scaling, monitoring, and cost optimization.",
    estimatedHours: 30,
    color: "from-blue-600 to-blue-900",
    status: "upcoming",
    modules: [
      mod("fastapi", "FastAPI"),
      mod("docker", "Docker"),
      mod("kubernetes", "Kubernetes"),
      mod("async-agents", "Async Agents"),
      mod("queues", "Queues"),
      mod("workers", "Workers"),
      mod("streaming", "Streaming"),
      mod("scaling", "Scaling"),
      mod("monitoring", "Monitoring"),
      mod("cost-optimization", "Cost Optimization"),
    ],
  },
  {
    id: 10,
    slug: "agent-design-patterns",
    title: "Agent Design Patterns",
    subtitle: "Phase 10",
    description:
      "ReAct, Plan & Execute, Reflexion, Tree of Thoughts — learned after building agents, not before.",
    estimatedHours: 18,
    color: "from-emerald-500 to-blue-800",
    status: "upcoming",
    modules: [
      mod("react", "ReAct"),
      mod("plan-execute", "Plan & Execute"),
      mod("reflexion", "Reflexion"),
      mod("tree-of-thoughts", "Tree of Thoughts"),
      mod("graph-of-thoughts", "Graph of Thoughts"),
      mod("router-pattern", "Router Pattern"),
      mod("planner-pattern", "Planner Pattern"),
      mod("reflection-loop", "Reflection Loop"),
      mod("supervisor-pattern", "Supervisor Pattern"),
      mod("swarm-pattern", "Swarm Pattern"),
    ],
  },
  {
    id: 11,
    slug: "browser-agents",
    title: "Browser & Computer Use Agents",
    subtitle: "Phase 11",
    description:
      "Playwright, browser automation, computer use, form filling, and web navigation agents.",
    estimatedHours: 15,
    color: "from-green-500 to-emerald-700",
    status: "upcoming",
    modules: [
      mod("playwright", "Playwright"),
      mod("browser-automation", "Browser Automation"),
      mod("computer-use", "Computer Use"),
      mod("form-filling", "Form Filling"),
      mod("web-navigation", "Web Navigation"),
    ],
    projects: ["Autonomous Browser Agent"],
  },
  {
    id: 12,
    slug: "multimodal-agents",
    title: "Voice & Multimodal Agents",
    subtitle: "Phase 12",
    description:
      "STT, TTS, realtime voice, and agents that understand images, audio, video, PDFs, and screens.",
    estimatedHours: 18,
    color: "from-blue-500 to-blue-800",
    status: "upcoming",
    modules: [
      mod("stt", "STT"),
      mod("tts", "TTS"),
      mod("realtime-voice", "Realtime Voice"),
      mod("image-agents", "Image Agents"),
      mod("audio-agents", "Audio Agents"),
      mod("video-agents", "Video Agents"),
      mod("pdf-agents", "PDF Agents"),
      mod("screen-understanding", "Screen Understanding"),
    ],
  },
  {
    id: 13,
    slug: "enterprise-ai",
    title: "Enterprise AI",
    subtitle: "Phase 13",
    description:
      "Enterprise RAG, knowledge bases, RBAC, compliance, identity, audit logs, and human approval at scale.",
    estimatedHours: 20,
    color: "from-green-400 to-green-700",
    status: "upcoming",
    modules: [
      mod("enterprise-rag", "Enterprise RAG"),
      mod("knowledge-bases", "Knowledge Bases"),
      mod("rbac", "RBAC"),
      mod("compliance", "Compliance"),
      mod("identity", "Identity"),
      mod("audit-logs", "Audit Logs"),
      mod("enterprise-human-approval", "Human Approval"),
    ],
    projects: ["Enterprise Knowledge Assistant"],
  },
  {
    id: 14,
    slug: "coding-agents",
    title: "Coding Agents",
    subtitle: "Phase 14",
    description:
      "GitHub agents, PR review, bug fix, documentation, CI/CD, and terminal agents.",
    estimatedHours: 22,
    color: "from-blue-600 to-blue-900",
    status: "upcoming",
    modules: [
      mod("github-agent", "GitHub Agent"),
      mod("pr-review-agent", "PR Review Agent"),
      mod("bug-fix-agent", "Bug Fix Agent"),
      mod("documentation-agent", "Documentation Agent"),
      mod("cicd-agent", "CI/CD Agent"),
      mod("terminal-agent", "Terminal Agent"),
    ],
    projects: ["Multi-Agent Coding Assistant"],
  },
  {
    id: 15,
    slug: "capstone-projects",
    title: "Capstone Projects",
    subtitle: "Phase 15",
    description:
      "Production-ready portfolio projects — AI software engineer, research assistant, customer support, and more.",
    estimatedHours: 80,
    color: "from-emerald-500 to-green-700",
    status: "upcoming",
    modules: [
      mod("ai-software-engineer", "AI Software Engineer"),
      mod("ai-research-assistant", "AI Research Assistant"),
      mod("ai-customer-support", "AI Customer Support Agent"),
      mod("ai-resume-reviewer", "AI Resume Reviewer"),
      mod("ai-travel-planner", "AI Travel Planner"),
      mod("ai-meeting-assistant", "AI Meeting Assistant"),
      mod("autonomous-browser-agent", "Autonomous Browser Agent"),
      mod("multi-agent-coding-assistant", "Multi-Agent Coding Assistant"),
      mod("enterprise-knowledge-assistant", "Enterprise Knowledge Assistant"),
    ],
  },
  {
    id: 16,
    slug: "interview-system-design",
    title: "Interview & System Design",
    subtitle: "Phase 16",
    description:
      "Agent system design, LangGraph coding, MCP design, multi-agent design, memory design, and mock interviews.",
    estimatedHours: 25,
    color: "from-blue-500 to-blue-800",
    status: "upcoming",
    modules: [
      mod("agent-system-design", "Agent System Design"),
      mod("langgraph-coding", "LangGraph Coding"),
      mod("mcp-design", "MCP Design"),
      mod("multi-agent-design", "Multi-Agent Design"),
      mod("memory-design", "Memory Design"),
      mod("production-debugging", "Production Debugging"),
      mod("cost-optimization-interview", "Cost Optimization"),
      mod("mock-interviews", "Mock Interviews"),
    ],
  },
];

export function getPhaseBySlug(slug: string): Phase | undefined {
  return phases.find((p) => p.slug === slug);
}

export function getModule(phaseSlug: string, moduleSlug: string) {
  const phase = getPhaseBySlug(phaseSlug);
  return phase?.modules.find((m) => m.slug === moduleSlug);
}

export const totalModules = phases.reduce((acc, p) => acc + p.modules.length, 0);
export const totalHours = phases.reduce((acc, p) => acc + p.estimatedHours, 0);

export const roadmapFlow = [
  "GenAI",
  "Agents",
  "Memory",
  "Tools",
  "MCP",
  "Frameworks",
  "Multi-Agent",
  "Eval",
  "Security",
  "Production",
  "Patterns",
  "Browser",
  "Voice",
  "Enterprise",
  "Coding",
  "Capstone",
  "Interview",
];

/** Legacy v1 phase slugs → v2 redirects handled in netlify.toml */
export const legacyPhaseRedirects: Record<string, string> = {
  "programming-foundations": "genai-foundations",
  "ai-engineering-foundations": "agent-foundations",
  "llm-engineering": "genai-foundations",
  "rag-engineering": "genai-foundations",
  "agentic-ai": "agent-foundations",
  "production-ai": "production-agents",
  "advanced-ai": "multimodal-agents",
  "interview-projects": "capstone-projects",
};
