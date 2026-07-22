export interface Module {
  slug: string;
  title: string;
  description?: string;
  estimatedMinutes?: number;
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
}

export const phases: Phase[] = [
  {
    id: 0,
    slug: "programming-foundations",
    title: "Programming Foundations",
    subtitle: "Phase 0",
    description:
      "Build the software engineering foundation every AI engineer needs — Python, Git, Docker, APIs, and more.",
    estimatedHours: 40,
    color: "from-slate-500 to-slate-700",
    modules: [
      { slug: "python", title: "Python", estimatedMinutes: 180 },
      { slug: "git", title: "Git", estimatedMinutes: 60 },
      { slug: "linux", title: "Linux", estimatedMinutes: 90 },
      { slug: "networking", title: "Networking", estimatedMinutes: 60 },
      { slug: "http", title: "HTTP", estimatedMinutes: 45 },
      { slug: "rest-apis", title: "REST APIs", estimatedMinutes: 90 },
      { slug: "json", title: "JSON", estimatedMinutes: 30 },
      { slug: "cli", title: "CLI", estimatedMinutes: 45 },
      { slug: "docker", title: "Docker", estimatedMinutes: 120 },
      { slug: "sql", title: "SQL", estimatedMinutes: 120 },
      { slug: "nosql", title: "NoSQL", estimatedMinutes: 90 },
      { slug: "testing", title: "Testing", estimatedMinutes: 90 },
      { slug: "ci-cd", title: "CI/CD", estimatedMinutes: 90 },
    ],
    projects: ["REST API", "Dockerize App", "Git Workflow"],
  },
  {
    id: 1,
    slug: "genai-foundations",
    title: "Generative AI Foundations",
    subtitle: "Phase 1",
    description:
      "Understand what GenAI is, how LLMs work, and the core concepts behind modern AI applications.",
    estimatedHours: 60,
    color: "from-green-500 to-emerald-700",
    modules: [
      { slug: "what-is-ai", title: "What is AI", estimatedMinutes: 30 },
      { slug: "ml-vs-dl-vs-genai", title: "ML vs DL vs GenAI", estimatedMinutes: 45 },
      { slug: "llms", title: "LLMs", estimatedMinutes: 60 },
      { slug: "transformers", title: "Transformers", estimatedMinutes: 60 },
      { slug: "tokens", title: "Tokens", estimatedMinutes: 30 },
      { slug: "tokenization", title: "Tokenization", estimatedMinutes: 45 },
      { slug: "embeddings", title: "Embeddings", estimatedMinutes: 60 },
      { slug: "vector-databases", title: "Vector Databases", estimatedMinutes: 60 },
      { slug: "similarity-search", title: "Similarity Search", estimatedMinutes: 45 },
      { slug: "prompt-engineering", title: "Prompt Engineering", estimatedMinutes: 90 },
      { slug: "temperature", title: "Temperature", estimatedMinutes: 30 },
      { slug: "top-p", title: "Top P", estimatedMinutes: 30 },
      { slug: "context-window", title: "Context Window", estimatedMinutes: 30 },
      { slug: "hallucination", title: "Hallucination", estimatedMinutes: 45 },
      { slug: "fine-tuning", title: "Fine Tuning", estimatedMinutes: 60 },
      { slug: "rag", title: "RAG", estimatedMinutes: 90 },
      { slug: "chunking", title: "Chunking", estimatedMinutes: 45 },
      { slug: "retrievers", title: "Retrievers", estimatedMinutes: 60 },
      { slug: "re-ranking", title: "Re-ranking", estimatedMinutes: 45 },
      { slug: "hybrid-search", title: "Hybrid Search", estimatedMinutes: 45 },
      { slug: "streaming", title: "Streaming", estimatedMinutes: 30 },
      { slug: "function-calling", title: "Function Calling", estimatedMinutes: 60 },
      { slug: "structured-outputs", title: "Structured Outputs", estimatedMinutes: 45 },
      { slug: "guardrails", title: "Guardrails", estimatedMinutes: 45 },
      { slug: "prompt-injection", title: "Prompt Injection", estimatedMinutes: 45 },
      { slug: "evaluation", title: "Evaluation", estimatedMinutes: 60 },
      { slug: "model-providers", title: "Model Providers", estimatedMinutes: 45 },
      { slug: "open-vs-closed-models", title: "Open vs Closed Models", estimatedMinutes: 30 },
    ],
  },
  {
    id: 2,
    slug: "ai-engineering-foundations",
    title: "AI Engineering Foundations",
    subtitle: "Phase 2",
    description:
      "Deep intuition into neural networks, attention, and transformer architecture — enough depth for engineering interviews.",
    estimatedHours: 50,
    color: "from-blue-600 to-blue-900",
    modules: [
      { slug: "neural-networks", title: "Neural Networks", estimatedMinutes: 90 },
      { slug: "gradient-descent", title: "Gradient Descent", estimatedMinutes: 60 },
      { slug: "backpropagation", title: "Backpropagation", estimatedMinutes: 60 },
      { slug: "activation-functions", title: "Activation Functions", estimatedMinutes: 45 },
      { slug: "loss-functions", title: "Loss Functions", estimatedMinutes: 45 },
      { slug: "optimizers", title: "Optimizers", estimatedMinutes: 45 },
      { slug: "attention", title: "Attention", estimatedMinutes: 60 },
      { slug: "self-attention", title: "Self Attention", estimatedMinutes: 60 },
      { slug: "multi-head-attention", title: "Multi Head Attention", estimatedMinutes: 45 },
      { slug: "encoder", title: "Encoder", estimatedMinutes: 45 },
      { slug: "decoder", title: "Decoder", estimatedMinutes: 45 },
      { slug: "positional-encoding", title: "Positional Encoding", estimatedMinutes: 45 },
      { slug: "transformer-architecture", title: "Transformer Architecture", estimatedMinutes: 90 },
      { slug: "word2vec", title: "Word2Vec", estimatedMinutes: 45 },
      { slug: "bert", title: "BERT", estimatedMinutes: 60 },
      { slug: "gpt", title: "GPT", estimatedMinutes: 60 },
      { slug: "inference", title: "Inference", estimatedMinutes: 60 },
      { slug: "kv-cache", title: "KV Cache", estimatedMinutes: 45 },
      { slug: "rope", title: "RoPE", estimatedMinutes: 45 },
      { slug: "moe", title: "MoE", estimatedMinutes: 45 },
      { slug: "quantization", title: "Quantization", estimatedMinutes: 60 },
    ],
  },
  {
    id: 3,
    slug: "llm-engineering",
    title: "LLM Engineering",
    subtitle: "Phase 3",
    description:
      "Hands-on engineering with OpenAI, Claude, Gemini, and open-source models — build real applications.",
    estimatedHours: 45,
    color: "from-green-400 to-green-700",
    modules: [
      { slug: "openai-apis", title: "OpenAI APIs", estimatedMinutes: 90 },
      { slug: "gemini", title: "Gemini", estimatedMinutes: 60 },
      { slug: "claude", title: "Claude", estimatedMinutes: 60 },
      { slug: "ollama", title: "Ollama", estimatedMinutes: 45 },
      { slug: "open-source-models", title: "Open Source Models", estimatedMinutes: 60 },
      { slug: "prompt-templates", title: "Prompt Templates", estimatedMinutes: 45 },
      { slug: "output-parsers", title: "Output Parsers", estimatedMinutes: 45 },
      { slug: "streaming", title: "Streaming", estimatedMinutes: 45 },
      { slug: "structured-outputs", title: "Structured Outputs", estimatedMinutes: 45 },
      { slug: "function-calling", title: "Function Calling", estimatedMinutes: 60 },
      { slug: "image-models", title: "Image Models", estimatedMinutes: 45 },
      { slug: "vision-models", title: "Vision Models", estimatedMinutes: 60 },
      { slug: "audio-models", title: "Audio Models", estimatedMinutes: 45 },
      { slug: "multimodal", title: "Multimodal", estimatedMinutes: 60 },
      { slug: "evaluation", title: "Evaluation", estimatedMinutes: 60 },
    ],
    projects: ["AI Resume Reviewer", "PDF Chat", "AI Email Assistant", "AI Code Reviewer"],
  },
  {
    id: 4,
    slug: "rag-engineering",
    title: "RAG Engineering",
    subtitle: "Phase 4",
    description:
      "Master retrieval-augmented generation — from document loaders to hybrid search and production evaluation.",
    estimatedHours: 40,
    color: "from-emerald-500 to-green-700",
    modules: [
      { slug: "document-loaders", title: "Document Loaders", estimatedMinutes: 45 },
      { slug: "chunking", title: "Chunking", estimatedMinutes: 60 },
      { slug: "embedding-models", title: "Embedding Models", estimatedMinutes: 60 },
      { slug: "vector-db", title: "Vector DB", estimatedMinutes: 60 },
      { slug: "metadata", title: "Metadata", estimatedMinutes: 45 },
      { slug: "hybrid-search", title: "Hybrid Search", estimatedMinutes: 60 },
      { slug: "bm25", title: "BM25", estimatedMinutes: 45 },
      { slug: "cross-encoder", title: "Cross Encoder", estimatedMinutes: 45 },
      { slug: "re-ranking", title: "Re-ranking", estimatedMinutes: 45 },
      { slug: "query-expansion", title: "Query Expansion", estimatedMinutes: 45 },
      { slug: "compression", title: "Compression", estimatedMinutes: 45 },
      { slug: "caching", title: "Caching", estimatedMinutes: 45 },
      { slug: "evaluation", title: "Evaluation", estimatedMinutes: 60 },
    ],
    projects: ["Enterprise Chatbot", "Legal Assistant", "Medical Assistant", "Research Assistant"],
  },
  {
    id: 5,
    slug: "agentic-ai",
    title: "Agentic AI",
    subtitle: "Phase 5",
    description:
      "The flagship phase — understand agents, planning, reasoning, memory, and autonomous AI systems.",
    estimatedHours: 35,
    color: "from-amber-500 to-orange-700",
    modules: [
      { slug: "what-are-agents", title: "What are Agents", estimatedMinutes: 45 },
      { slug: "agent-loop", title: "Agent Loop", estimatedMinutes: 60 },
      { slug: "planning", title: "Planning", estimatedMinutes: 60 },
      { slug: "reasoning", title: "Reasoning", estimatedMinutes: 60 },
      { slug: "reflection", title: "Reflection", estimatedMinutes: 45 },
      { slug: "memory", title: "Memory", estimatedMinutes: 60 },
      { slug: "tool-calling", title: "Tool Calling", estimatedMinutes: 60 },
      { slug: "multi-tool", title: "Multi Tool", estimatedMinutes: 45 },
      { slug: "long-term-memory", title: "Long Term Memory", estimatedMinutes: 60 },
      { slug: "short-term-memory", title: "Short Term Memory", estimatedMinutes: 45 },
      { slug: "react", title: "ReAct", estimatedMinutes: 60 },
      { slug: "plan-execute", title: "Plan Execute", estimatedMinutes: 60 },
      { slug: "tree-of-thoughts", title: "Tree of Thoughts", estimatedMinutes: 45 },
      { slug: "reflexion", title: "Reflexion", estimatedMinutes: 45 },
      { slug: "self-correction", title: "Self Correction", estimatedMinutes: 45 },
      { slug: "autonomy", title: "Autonomy", estimatedMinutes: 45 },
    ],
  },
  {
    id: 6,
    slug: "agent-frameworks",
    title: "Agent Frameworks",
    subtitle: "Phase 6",
    description:
      "Build production agents with LangGraph, OpenAI Agents SDK, CrewAI, and other leading frameworks.",
    estimatedHours: 50,
    color: "from-blue-600 to-blue-900",
    modules: [
      { slug: "langgraph", title: "LangGraph", estimatedMinutes: 120 },
      { slug: "openai-agents-sdk", title: "OpenAI Agents SDK", estimatedMinutes: 90 },
      { slug: "google-adk", title: "Google ADK", estimatedMinutes: 90 },
      { slug: "crewai", title: "CrewAI", estimatedMinutes: 90 },
      { slug: "autogen", title: "AutoGen", estimatedMinutes: 90 },
      { slug: "pydantic-ai", title: "PydanticAI", estimatedMinutes: 60 },
      { slug: "semantic-kernel", title: "Semantic Kernel", estimatedMinutes: 90 },
    ],
  },
  {
    id: 7,
    slug: "mcp",
    title: "Model Context Protocol",
    subtitle: "Phase 7",
    description:
      "Learn MCP architecture, build servers and clients, and integrate tools with AI agents securely.",
    estimatedHours: 25,
    color: "from-blue-500 to-blue-800",
    modules: [
      { slug: "model-context-protocol", title: "Model Context Protocol", estimatedMinutes: 45 },
      { slug: "architecture", title: "Architecture", estimatedMinutes: 60 },
      { slug: "transport", title: "Transport", estimatedMinutes: 45 },
      { slug: "resources", title: "Resources", estimatedMinutes: 45 },
      { slug: "tools", title: "Tools", estimatedMinutes: 60 },
      { slug: "prompts", title: "Prompts", estimatedMinutes: 45 },
      { slug: "clients", title: "Clients", estimatedMinutes: 60 },
      { slug: "servers", title: "Servers", estimatedMinutes: 60 },
      { slug: "security", title: "Security", estimatedMinutes: 45 },
      { slug: "authentication", title: "Authentication", estimatedMinutes: 45 },
    ],
    projects: ["GitHub MCP", "Filesystem MCP", "Database MCP", "Slack MCP"],
  },
  {
    id: 8,
    slug: "production-ai",
    title: "Production AI",
    subtitle: "Phase 8",
    description:
      "Deploy, monitor, and scale AI systems — observability, cost optimization, and enterprise deployment.",
    estimatedHours: 40,
    color: "from-red-500 to-rose-700",
    modules: [
      { slug: "observability", title: "Observability", estimatedMinutes: 60 },
      { slug: "evaluation", title: "Evaluation", estimatedMinutes: 60 },
      { slug: "tracing", title: "Tracing", estimatedMinutes: 45 },
      { slug: "prompt-versioning", title: "Prompt Versioning", estimatedMinutes: 45 },
      { slug: "caching", title: "Caching", estimatedMinutes: 45 },
      { slug: "latency", title: "Latency", estimatedMinutes: 45 },
      { slug: "cost-optimization", title: "Cost Optimization", estimatedMinutes: 60 },
      { slug: "rate-limits", title: "Rate Limits", estimatedMinutes: 30 },
      { slug: "scaling", title: "Scaling", estimatedMinutes: 60 },
      { slug: "deployments", title: "Deployments", estimatedMinutes: 60 },
      { slug: "gpu", title: "GPU", estimatedMinutes: 45 },
      { slug: "vllm", title: "vLLM", estimatedMinutes: 60 },
      { slug: "ollama", title: "Ollama", estimatedMinutes: 45 },
      { slug: "docker", title: "Docker", estimatedMinutes: 45 },
      { slug: "kubernetes", title: "Kubernetes", estimatedMinutes: 90 },
      { slug: "monitoring", title: "Monitoring", estimatedMinutes: 60 },
    ],
    projects: ["Production AI Platform", "AI Gateway", "Enterprise Deployment"],
  },
  {
    id: 9,
    slug: "advanced-ai",
    title: "Advanced AI",
    subtitle: "Phase 9",
    description:
      "Fine-tuning, multimodal models, inference optimization, and staying current with research.",
    estimatedHours: 35,
    color: "from-emerald-500 to-blue-800",
    modules: [
      { slug: "fine-tuning", title: "Fine Tuning", estimatedMinutes: 90 },
      { slug: "lora", title: "LoRA", estimatedMinutes: 60 },
      { slug: "qlora", title: "QLoRA", estimatedMinutes: 60 },
      { slug: "peft", title: "PEFT", estimatedMinutes: 45 },
      { slug: "multimodal", title: "Multimodal", estimatedMinutes: 60 },
      { slug: "speech", title: "Speech", estimatedMinutes: 45 },
      { slug: "vision", title: "Vision", estimatedMinutes: 60 },
      { slug: "image-generation", title: "Image Generation", estimatedMinutes: 45 },
      { slug: "video-models", title: "Video Models", estimatedMinutes: 45 },
      { slug: "inference-optimization", title: "Inference Optimization", estimatedMinutes: 60 },
      { slug: "distillation", title: "Distillation", estimatedMinutes: 45 },
      { slug: "research-papers", title: "Research Papers", estimatedMinutes: 60 },
    ],
  },
  {
    id: 10,
    slug: "interview-projects",
    title: "Interview Projects",
    subtitle: "Phase 10",
    description:
      "Portfolio projects designed for interviews — beginner to production, with architecture, resume points, and talking points.",
    estimatedHours: 80,
    color: "from-yellow-500 to-amber-700",
    modules: [
      { slug: "beginner", title: "Beginner Projects", estimatedMinutes: 600 },
      { slug: "intermediate", title: "Intermediate Projects", estimatedMinutes: 900 },
      { slug: "advanced", title: "Advanced Projects", estimatedMinutes: 1200 },
      { slug: "production", title: "Production Projects", estimatedMinutes: 1800 },
    ],
    projects: [
      "AI Resume Assistant",
      "AI Interview Coach",
      "AI Customer Support",
      "AI Research Assistant",
      "AI Coding Agent",
      "AI Travel Planner",
      "AI Voice Assistant",
      "AI Meeting Assistant",
      "AI IDE",
      "AI CRM",
      "AI Sales Agent",
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
  "Programming",
  "GenAI",
  "LLMs",
  "RAG",
  "Agents",
  "Frameworks",
  "MCP",
  "Production",
  "Advanced",
  "Interview Projects",
];
