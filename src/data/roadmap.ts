export interface Module {
  slug: string;
  title: string;
  description?: string;
}

export interface Phase {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  modules: Module[];
  projects?: string[];
  /** Hours to study this phase's lessons. Does not include standalone projects or glossary reading. */
  estimatedHours: number;
  color: string;
  /** Optional branch — excluded from overall progress % */
  optional?: boolean;
}

function mod(slug: string, title: string): Module {
  return { slug, title };
}

/**
 * Hybrid v1 + v2 roadmap — unique topics only, no duplicates.
 * Phase/module slugs are stable so saved progress and highlights keep matching.
 */
export const phases: Phase[] = [
  {
    id: 0,
    slug: "programming-foundations",
    title: "Programming Foundations",
    subtitle: "Phase 0",
    description:
      "Python, Git, Linux, CLI, networking, HTTP, REST APIs, Docker, SQL, testing, and CI/CD — the engineering base every AI builder needs.",
    estimatedHours: 40,
    color: "from-slate-500 to-slate-700",
    modules: [
      mod("start-here", "Start Here"),
      mod("python", "Python"),
      mod("git", "Git"),
      mod("linux", "Linux"),
      mod("cli", "CLI"),
      mod("networking", "Networking"),
      mod("http", "HTTP"),
      mod("rest-apis", "REST APIs"),
      mod("json", "JSON"),
      mod("docker", "Docker"),
      mod("sql", "SQL"),
      mod("nosql", "NoSQL"),
      mod("testing", "Testing"),
      mod("ci-cd", "CI/CD"),
    ],
    projects: ["REST API", "Dockerize App", "Git Workflow"],
  },
  {
    id: 1,
    slug: "genai-foundations",
    title: "Generative AI Foundations",
    subtitle: "Phase 1",
    description:
      "What GenAI is, how LLMs work, tokens, embeddings, prompt engineering, and core concepts — without repeating RAG or tool-calling deep dives.",
    estimatedHours: 35,
    color: "from-orange-500 to-orange-700",
    modules: [
      mod("what-is-ai", "What is AI"),
      mod("ml-vs-dl-vs-genai", "ML vs DL vs GenAI"),
      mod("llms", "LLMs"),
      mod("transformers", "Transformers"),
      mod("tokens", "Tokens"),
      mod("tokenization", "Tokenization"),
      mod("embeddings", "Embeddings"),
      mod("similarity-search", "Similarity Search"),
      mod("prompt-engineering", "Prompt Engineering"),
      mod("temperature", "Temperature"),
      mod("top-p", "Top P"),
      mod("context-window", "Context Window"),
      mod("hallucination", "Hallucination"),
      mod("model-providers", "Model Providers"),
      mod("open-vs-closed-models", "Open vs Closed Models"),
    ],
  },
  {
    id: 1.1,
    slug: "transformer-foundations",
    title: "Transformer & ML Foundations",
    subtitle: "Phase 1.1 · Optional",
    optional: true,
    description:
      "Neural networks, attention, encoders/decoders, BERT, GPT, KV cache, RoPE, MoE, and quantization — interview-depth ML intuition. Skip if you are focused on building agents, not training models.",
    estimatedHours: 50,
    color: "from-violet-600 to-violet-900",
    modules: [
      mod("neural-networks", "Neural Networks"),
      mod("gradient-descent", "Gradient Descent"),
      mod("backpropagation", "Backpropagation"),
      mod("activation-functions", "Activation Functions"),
      mod("loss-functions", "Loss Functions"),
      mod("optimizers", "Optimizers"),
      mod("attention", "Attention"),
      mod("self-attention", "Self Attention"),
      mod("multi-head-attention", "Multi Head Attention"),
      mod("encoder", "Encoder"),
      mod("decoder", "Decoder"),
      mod("positional-encoding", "Positional Encoding"),
      mod("transformer-architecture", "Transformer Architecture"),
      mod("word2vec", "Word2Vec"),
      mod("bert", "BERT"),
      mod("gpt", "GPT"),
      mod("inference", "Inference"),
      mod("kv-cache", "KV Cache"),
      mod("rope", "RoPE"),
      mod("moe", "MoE"),
      mod("quantization", "Quantization"),
    ],
  },
  {
    id: 2,
    slug: "llm-engineering",
    title: "LLM Engineering & APIs",
    subtitle: "Phase 2",
    description:
      "Hands-on with OpenAI, Claude, Gemini, Ollama, open-source models, streaming, and multimodal APIs.",
    estimatedHours: 40,
    color: "from-amber-500 to-amber-700",
    modules: [
      mod("openai-apis", "OpenAI APIs"),
      mod("gemini", "Gemini"),
      mod("claude", "Claude"),
      mod("ollama", "Ollama"),
      mod("open-source-models", "Open Source Models"),
      mod("prompt-templates", "Prompt Templates"),
      mod("output-parsers", "Output Parsers"),
      mod("streaming", "Streaming"),
      mod("image-models", "Image Models"),
      mod("vision-models", "Vision Models"),
      mod("audio-models", "Audio Models"),
      mod("multimodal", "Multimodal"),
    ],
    projects: ["AI Resume Reviewer", "PDF Chat", "AI Email Assistant"],
  },
  {
    id: 3,
    slug: "rag-engineering",
    title: "RAG Engineering",
    subtitle: "Phase 3",
    description:
      "Document loaders, chunking, vector DBs, hybrid search, re-ranking, LangChain, ChromaDB, and Streamlit demos.",
    estimatedHours: 35,
    color: "from-rose-500 to-rose-700",
    modules: [
      mod("document-loaders", "Document Loaders"),
      mod("chunking", "Chunking"),
      mod("embedding-models", "Embedding Models"),
      mod("vector-databases", "Vector Databases"),
      mod("metadata", "Metadata"),
      mod("retrievers", "Retrievers"),
      mod("hybrid-search", "Hybrid Search"),
      mod("bm25", "BM25"),
      mod("cross-encoder", "Cross Encoder"),
      mod("re-ranking", "Re-ranking"),
      mod("query-expansion", "Query Expansion"),
      mod("compression", "Compression"),
      mod("caching", "Caching"),
      mod("rag", "RAG"),
      mod("langchain-basics", "LangChain Basics"),
      mod("chromadb", "ChromaDB"),
      mod("streamlit", "Streamlit"),
      mod("evaluation", "RAG Evaluation"),
      mod("knowledge-graphs", "Knowledge Graphs"),
      mod("graph-rag", "Graph RAG"),
      mod("entity-resolution", "Entity Resolution"),
      mod("graph-retrieval", "Graph Retrieval"),
    ],
    projects: ["Enterprise Chatbot", "RAG Chat App", "Legal Assistant"],
  },
  {
    id: 4,
    slug: "agent-foundations",
    title: "Agent Foundations",
    subtitle: "Phase 4",
    description:
      "What agents are, how they work, planning, reasoning, reflection, and building your first agent without frameworks.",
    estimatedHours: 35,
    color: "from-violet-600 to-violet-900",
    modules: [
      mod("what-is-an-ai-agent", "What is an AI Agent?"),
      mod("why-llms-need-agents", "Why LLMs Need Agents"),
      mod("anatomy-of-an-agent", "Anatomy of an Agent"),
      mod("agent-lifecycle", "Agent Lifecycle"),
      mod("core-concepts", "Core Concepts"),
      mod("agent-capabilities", "Agent Capabilities"),
      mod("types-of-agents", "Types of Agents"),
      mod("agent-architectures", "Agent Architectures"),
      mod("agent-terminology", "Agent Terminology"),
      mod("current-agent-landscape", "Current Agent Landscape"),
      mod("planning", "Planning"),
      mod("reflection", "Reflection"),
      mod("multi-tool", "Multi Tool"),
      mod("self-correction", "Self Correction"),
      mod("build-first-ai-agent", "Build First AI Agent"),
    ],
    projects: ["No-Framework Agent (Python + LLM API)"],
  },
  {
    id: 5,
    slug: "agent-memory",
    title: "Agent Memory",
    subtitle: "Phase 5",
    description:
      "Working, short-term, long-term, semantic, and episodic memory — one of the biggest interview topics for production agents.",
    estimatedHours: 20,
    color: "from-amber-500 to-amber-700",
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
    id: 6,
    slug: "context-engineering",
    title: "Context Engineering",
    subtitle: "Phase 6",
    description:
      "How an agent builds the next model call: assemble, select, compress, isolate, route, and budget context from instructions, memory, retrieval, tools, and state — not just a static prompt.",
    estimatedHours: 18,
    color: "from-teal-500 to-teal-800",
    modules: [
      mod("context-vs-prompt", "Context vs Prompt Engineering"),
      mod("context-assembly", "Context Assembly"),
      mod("context-selection", "Context Selection"),
      mod("context-compression", "Context Compression"),
      mod("context-compaction", "Context Compaction"),
      mod("context-isolation", "Context Isolation"),
      mod("context-routing", "Context Routing"),
      mod("context-windows", "Context Windows"),
      mod("context-budgeting", "Context Budgeting"),
      mod("tool-result-management", "Tool Result Management"),
      mod("memory-context-pipeline", "Memory → Context Pipeline"),
      mod("long-running-context", "Long-Running Context"),
      mod("context-pollution", "Context Pollution"),
      mod("context-freshness", "Context Freshness"),
      mod("context-prioritization", "Context Prioritization"),
    ],
  },
  {
    id: 7,
    slug: "tool-calling",
    title: "Tool Calling & Function Calling",
    subtitle: "Phase 7",
    description:
      "Function calling, JSON mode, structured outputs, tool registries, permissions, and building a tool-using assistant.",
    estimatedHours: 22,
    color: "from-fuchsia-500 to-fuchsia-800",
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
    id: 8,
    slug: "mcp",
    title: "Model Context Protocol",
    subtitle: "Phase 8",
    description:
      "MCP as the agent ↔ tools/data protocol: host/client/server, tools/resources/prompts, sampling/roots/elicitation, local stdio vs streamable HTTP, authorization, and how to securely consume third-party servers.",
    estimatedHours: 22,
    color: "from-rose-500 to-rose-700",
    modules: [
      mod("why-mcp", "Why MCP"),
      mod("mcp-architecture", "MCP Architecture"),
      mod("mcp-client", "MCP Client"),
      mod("mcp-server", "MCP Server"),
      mod("resources", "Resources"),
      mod("tools", "Tools"),
      mod("prompts", "Prompts"),
      mod("sampling", "Sampling"),
      mod("roots", "Roots"),
      mod("elicitation", "Elicitation"),
      mod("capability-negotiation", "Capability Negotiation"),
      mod("mcp-progress", "Progress & Cancellation"),
      mod("mcp-tasks", "Tasks & Long-Running Ops"),
      mod("local-mcp", "Local MCP"),
      mod("remote-mcp", "Remote MCP"),
      mod("streamable-http", "Streamable HTTP"),
      mod("authentication", "Authentication"),
      mod("oauth-21", "OAuth 2.1 & Scopes"),
      mod("transport", "Transport"),
      mod("mcp-security", "MCP Security"),
      mod("tool-poisoning", "Tool Poisoning"),
      mod("third-party-mcp", "Third-Party MCP Servers"),
      mod("build-mcp-server", "Build MCP Server"),
      mod("build-mcp-client", "Build MCP Client"),
      mod("integrate-mcp-with-agent", "Integrate MCP with Agent"),
    ],
    projects: ["Custom MCP Server", "Agent + MCP Integration"],
  },
  {
    id: 9,
    slug: "agent-frameworks",
    title: "Agent Framework Landscape",
    subtitle: "Phase 9",
    description:
      "Why frameworks exist, how to pick one, and awareness of the rest of the landscape. AutoGen and Semantic Kernel are legacy/migration. Deep dives follow as their own phases. Protocol stack: MCP ↔ tools, A2A ↔ agents, AG-UI ↔ users.",
    estimatedHours: 16,
    color: "from-violet-600 to-violet-900",
    modules: [
      mod("why-frameworks", "Why Frameworks"),
      mod("choosing-a-framework", "Choosing a Framework"),
      mod("agent-protocol-stack", "Agent Protocol Stack"),
      mod("llamaindex-workflows", "LlamaIndex Workflows"),
      mod("semantic-kernel", "Semantic Kernel (Legacy)"),
      mod("mastra", "Mastra"),
      mod("smolagents", "smolagents"),
      mod("agno", "Agno"),
      mod("haystack-agents", "Haystack Agents"),
      mod("aws-strands", "AWS Strands"),
    ],
  },
  {
    id: 10,
    slug: "langgraph",
    title: "LangGraph",
    subtitle: "Phase 10",
    description:
      "The production graph runtime: StateGraph, durable execution, checkpoints, interrupts, streaming, time-travel, subgraphs, LangGraph Platform, and Deep Agents awareness.",
    estimatedHours: 24,
    color: "from-rose-500 to-rose-800",
    modules: [
      mod("langgraph", "LangGraph"),
      mod("langgraph-nodes-edges", "Nodes & Edges"),
      mod("langgraph-stategraph", "StateGraph"),
      mod("langgraph-conditional-routing", "Conditional Routing"),
      mod("langgraph-checkpoints", "Checkpoints & Persistence"),
      mod("langgraph-human-in-the-loop", "Human-in-the-Loop"),
      mod("langgraph-subgraphs", "Subgraphs"),
      mod("langgraph-durable-execution", "Durable Execution"),
      mod("langgraph-streaming", "Streaming"),
      mod("langgraph-time-travel", "Time Travel & Replay"),
      mod("langgraph-platform", "LangGraph Platform"),
      mod("deep-agents", "Deep Agents"),
      mod("build-langgraph-agent", "Build a LangGraph Agent"),
    ],
    projects: ["LangGraph Support Agent"],
  },
  {
    id: 11,
    slug: "openai-agents",
    title: "OpenAI Agents SDK",
    subtitle: "Phase 11",
    description:
      "OpenAI's official agent runtime: agents, tools, sessions, handoffs, guardrails, tracing, and a shipped assistant.",
    estimatedHours: 12,
    color: "from-emerald-500 to-emerald-800",
    modules: [
      mod("openai-agents-sdk", "OpenAI Agents SDK"),
      mod("openai-sessions-handoffs", "Sessions & Handoffs"),
      mod("openai-guardrails-tracing", "Guardrails & Tracing"),
      mod("build-openai-agent", "Build an OpenAI Agent"),
    ],
    projects: ["OpenAI Triage Desk"],
  },
  {
    id: 12,
    slug: "claude-agent-sdk",
    title: "Claude Agent SDK",
    subtitle: "Phase 12",
    description:
      "Anthropic's production agent SDK: the same loop and context-management ideas behind Claude Code — tools, permissions, hooks, MCP, subagents, sessions, sandboxing, and a coding agent.",
    estimatedHours: 14,
    color: "from-stone-500 to-orange-800",
    modules: [
      mod("claude-agent-sdk", "Claude Agent SDK"),
      mod("claude-agent-loop", "Agent Loop"),
      mod("claude-builtin-tools", "Built-in Tools"),
      mod("claude-permissions", "Permissions"),
      mod("claude-hooks", "Hooks"),
      mod("claude-mcp", "MCP in Claude Agents"),
      mod("claude-subagents", "Subagents"),
      mod("claude-context", "Context Management"),
      mod("claude-sessions", "Sessions"),
      mod("claude-code-execution", "Code Execution & Sandboxing"),
      mod("build-claude-agent", "Build a Claude Coding Agent"),
    ],
    projects: ["Claude Code-style Agent"],
  },
  {
    id: 13,
    slug: "crewai",
    title: "CrewAI",
    subtitle: "Phase 13",
    description:
      "Role-based multi-agent crews: agents, tasks, process, tools, memory, Flows, and a working crew.",
    estimatedHours: 14,
    color: "from-orange-500 to-orange-800",
    modules: [
      mod("crewai", "CrewAI"),
      mod("crewai-agents-roles", "Agents & Roles"),
      mod("crewai-tasks-process", "Tasks & Process"),
      mod("crewai-flows", "CrewAI Flows"),
      mod("build-crewai-crew", "Build a Crew"),
    ],
    projects: ["Research Crew"],
  },
  {
    id: 14,
    slug: "pydantic-ai",
    title: "PydanticAI",
    subtitle: "Phase 14",
    description:
      "Type-safe Python agents: model-agnostic runtime, typed tools, dependencies, structured results, and a small production agent.",
    estimatedHours: 12,
    color: "from-pink-500 to-pink-800",
    modules: [
      mod("pydantic-ai", "PydanticAI"),
      mod("pydantic-ai-tools", "Typed Tools"),
      mod("pydantic-ai-deps", "Dependencies"),
      mod("pydantic-ai-results", "Structured Results"),
      mod("build-pydantic-ai-agent", "Build a PydanticAI Agent"),
    ],
    projects: ["Typed Support Agent"],
  },
  {
    id: 15,
    slug: "autogen",
    title: "Microsoft Agent Framework",
    subtitle: "Phase 15",
    description:
      "Microsoft Agent Framework is the successor to AutoGen and Semantic Kernel. Learn agents, workflows, durable execution, HITL, MCP, and A2A. AutoGen remains as legacy/migration awareness (same module slugs, so existing progress is kept).",
    estimatedHours: 16,
    color: "from-sky-500 to-sky-800",
    modules: [
      mod("microsoft-agent-framework", "Microsoft Agent Framework"),
      mod("maf-agents-tools", "Agents & Tools"),
      mod("maf-sessions-state", "Sessions & State"),
      mod("maf-middleware", "Middleware"),
      mod("maf-workflows", "Workflows & Executors"),
      mod("maf-durable-execution", "Durable Execution & HITL"),
      mod("maf-telemetry", "Telemetry"),
      mod("maf-hosting", "Hosting"),
      mod("autogen", "AutoGen (Legacy / Migration)"),
      mod("autogen-group-chat", "Group Chat (Legacy)"),
      mod("build-autogen-team", "Build a Microsoft Agent"),
    ],
    projects: ["Microsoft Agent Workflow"],
  },
  {
    id: 16,
    slug: "google-adk",
    title: "Google ADK",
    subtitle: "Phase 16",
    description:
      "Google's Agent Development Kit 2.x: agents, graph-based workflows, dynamic delegation, A2A, sub-agents, and a Gemini-backed agent you can run locally.",
    estimatedHours: 12,
    color: "from-amber-500 to-amber-800",
    modules: [
      mod("google-adk", "Google ADK"),
      mod("google-adk-workflows", "ADK Workflows & Sub-Agents"),
      mod("adk-graph-runtime", "Graph Runtime"),
      mod("adk-dynamic-delegation", "Dynamic Delegation"),
      mod("adk-a2a", "ADK & A2A"),
      mod("build-google-adk-agent", "Build an ADK Agent"),
    ],
    projects: ["Gemini ADK Agent"],
  },
  {
    id: 17,
    slug: "agent-design-patterns",
    title: "Agent Design Patterns",
    subtitle: "Phase 17",
    description:
      "ReAct, Plan & Execute, Reflexion, Tree of Thoughts — learned after building agents, not before.",
    estimatedHours: 18,
    color: "from-purple-500 to-purple-800",
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
    id: 18,
    slug: "multi-agent-systems",
    title: "Multi-Agent Systems",
    subtitle: "Phase 18",
    description:
      "A2A as agent ↔ agent interoperability, supervisor/worker patterns, coordination, and trust between agents.",
    estimatedHours: 26,
    color: "from-orange-500 to-orange-700",
    modules: [
      mod("a2a-protocol", "A2A Protocol"),
      mod("a2a-trust", "A2A Trust"),
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
    id: 19,
    slug: "agent-evaluation",
    title: "Eval Engineering & Observability",
    subtitle: "Phase 19",
    description:
      "How to prove an agent works: datasets, LLM-as-judge, online/offline eval, benchmarks, agent-specific OpenTelemetry, and regression suites.",
    estimatedHours: 26,
    color: "from-fuchsia-500 to-fuchsia-800",
    modules: [
      mod("observability", "Observability"),
      mod("langsmith", "LangSmith"),
      mod("phoenix", "Phoenix"),
      mod("opentelemetry", "OpenTelemetry"),
      mod("otel-genai", "GenAI Semantic Conventions"),
      mod("agent-metrics", "Agent Metrics"),
      mod("wandb", "W&B"),
      mod("llm-evaluation", "LLM Evaluation"),
      mod("agent-evaluation", "Agent Evaluation"),
      mod("tool-evaluation", "Tool Evaluation"),
      mod("trajectory-evaluation", "Trajectory Evaluation"),
      mod("eval-datasets", "Eval Datasets"),
      mod("llm-as-judge", "LLM-as-Judge"),
      mod("online-offline-eval", "Online vs Offline Eval"),
      mod("eval-driven-development", "Eval-Driven Development"),
      mod("agent-benchmarks", "Agent Benchmarks"),
      mod("hallucination-detection", "Hallucination Detection"),
      mod("regression-testing", "Regression Testing"),
    ],
  },
  {
    id: 20,
    slug: "security-guardrails",
    title: "Agent Security & Governance",
    subtitle: "Phase 20",
    description:
      "OWASP 2026 agentic threats: goal hijacking, tool misuse, identity/privilege abuse, supply chain, memory poisoning, sandbox escape — plus identity, least privilege, and governance.",
    estimatedHours: 22,
    color: "from-amber-500 to-amber-700",
    modules: [
      mod("guardrails", "Guardrails"),
      mod("agent-threat-modeling", "Agent Threat Modeling"),
      mod("prompt-injection", "Prompt Injection"),
      mod("jailbreaks", "Jailbreaks"),
      mod("goal-hijacking", "Goal Hijacking"),
      mod("tool-misuse", "Tool Misuse"),
      mod("memory-poisoning", "Memory Poisoning"),
      mod("agent-identity", "Agent Identity"),
      mod("delegated-authorization", "Delegated Authorization"),
      mod("least-privilege", "Least Privilege"),
      mod("secrets-management", "Secrets Management"),
      mod("agent-supply-chain", "Agent Supply Chain"),
      mod("a2a-security", "A2A Security"),
      mod("data-exfiltration", "Data Exfiltration"),
      mod("sandbox-security", "Sandbox Security"),
      mod("pii-detection", "PII Detection"),
      mod("content-safety", "Content Safety"),
      mod("tool-restrictions", "Tool Restrictions"),
      mod("policy-engine", "Policy Engine"),
      mod("human-approval", "Human Approval"),
      mod("agent-governance", "Agent Governance"),
    ],
  },
  {
    id: 21,
    slug: "production-agents",
    title: "Agent Runtime & Production",
    subtitle: "Phase 21",
    description:
      "The runtime that makes an agent operable: durable execution, sandboxing, state, cancellation, model routing, versioning, and the usual serving stack.",
    estimatedHours: 42,
    color: "from-violet-600 to-violet-900",
    modules: [
      mod("fastapi", "FastAPI"),
      mod("kubernetes", "Kubernetes"),
      mod("agent-runtime", "Agent Runtime"),
      mod("durable-execution", "Durable Execution"),
      mod("agent-state-management", "Agent State Management"),
      mod("long-running-agents", "Long-Running Agents"),
      mod("sandboxed-execution", "Sandboxed Execution"),
      mod("async-agents", "Async Agents"),
      mod("event-driven-agents", "Event-Driven Agents"),
      mod("queues", "Queues"),
      mod("workers", "Workers"),
      mod("webhooks", "Webhooks"),
      mod("idempotency", "Idempotency"),
      mod("circuit-breakers", "Circuit Breakers"),
      mod("scaling", "Scaling"),
      mod("monitoring", "Monitoring"),
      mod("cost-optimization", "Cost Optimization"),
      mod("model-routing", "Model Routing"),
      mod("fallback-models", "Fallback Models"),
      mod("prompt-caching", "Prompt Caching"),
      mod("tracing", "Tracing"),
      mod("prompt-versioning", "Prompt Versioning"),
      mod("agent-versioning", "Agent Versioning"),
      mod("canary-deployments", "Canary Deployments"),
      mod("cost-budgets", "Cost & Token Budgets"),
      mod("latency", "Latency"),
      mod("rate-limits", "Rate Limits"),
      mod("deployments", "Deployments"),
      mod("gpu", "GPU"),
      mod("vllm", "vLLM"),
    ],
    projects: ["Production AI Platform", "AI Gateway"],
  },
  {
    id: 22,
    slug: "ag-ui",
    title: "AG-UI & Agent UX",
    subtitle: "Phase 22",
    description:
      "Agent ↔ user protocol: streaming events, shared state, tool-call UI, HITL approvals, generative UI, and frontend integration. MCP is tools, A2A is agents, AG-UI is the human.",
    estimatedHours: 14,
    color: "from-cyan-500 to-cyan-800",
    modules: [
      mod("ag-ui", "AG-UI"),
      mod("agent-event-streaming", "Agent Event Streaming"),
      mod("agent-state-ui", "Agent State → UI"),
      mod("tool-calls-ui", "Tool Calls → UI"),
      mod("hitl-ui", "Human-in-the-Loop UI"),
      mod("agent-progress-ui", "Progress UI"),
      mod("generative-ui", "Generative UI"),
      mod("shared-state", "Shared State"),
      mod("frontend-agent-integration", "Frontend Integration"),
      mod("agent-ux", "Agent UX"),
    ],
    projects: ["Agent Chat with HITL"],
  },
  {
    id: 23,
    slug: "browser-agents",
    title: "Browser & Computer Use Agents",
    subtitle: "Phase 23",
    description:
      "Playwright, browser automation, computer use, form filling, and web navigation agents.",
    estimatedHours: 15,
    color: "from-orange-500 to-orange-700",
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
    id: 24,
    slug: "multimodal-agents",
    title: "Voice & Multimodal Agents",
    subtitle: "Phase 24",
    description:
      "STT, TTS, realtime voice, and agents that understand images, audio, video, PDFs, and screens.",
    estimatedHours: 18,
    color: "from-fuchsia-500 to-fuchsia-800",
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
    id: 25,
    slug: "enterprise-ai",
    title: "Enterprise AI",
    subtitle: "Phase 25",
    description:
      "Enterprise RAG, knowledge bases, RBAC, compliance, identity, audit logs, data lineage, and human approval at scale.",
    estimatedHours: 22,
    color: "from-amber-500 to-amber-700",
    modules: [
      mod("enterprise-rag", "Enterprise RAG"),
      mod("knowledge-bases", "Knowledge Bases"),
      mod("rbac", "RBAC"),
      mod("compliance", "Compliance"),
      mod("identity", "Identity"),
      mod("audit-logs", "Audit Logs"),
      mod("data-lineage", "Data Lineage"),
      mod("data-freshness", "Data Freshness"),
      mod("enterprise-human-approval", "Human Approval"),
    ],
    projects: ["Enterprise Knowledge Assistant"],
  },
  {
    id: 26,
    slug: "coding-agents",
    title: "Coding Agents",
    subtitle: "Phase 26",
    description:
      "Repository understanding, sandboxed shell, patches, tests, git/PR workflows, AGENTS.md, and coding-agent evaluation.",
    estimatedHours: 28,
    color: "from-violet-600 to-violet-900",
    modules: [
      mod("github-agent", "GitHub Agent"),
      mod("repository-understanding", "Repository Understanding"),
      mod("codebase-context", "Codebase Context"),
      mod("agents-md", "AGENTS.md"),
      mod("terminal-agent", "Terminal Agent"),
      mod("sandboxed-coding", "Sandboxed Coding"),
      mod("patch-generation", "Patch Generation"),
      mod("test-execution", "Test Execution"),
      mod("git-operations", "Git Operations"),
      mod("pr-review-agent", "PR Review Agent"),
      mod("pr-generation", "PR Generation"),
      mod("issue-pr-workflow", "Issue → PR Workflow"),
      mod("bug-fix-agent", "Bug Fix Agent"),
      mod("documentation-agent", "Documentation Agent"),
      mod("cicd-agent", "CI/CD Agent"),
      mod("coding-agent-evaluation", "Coding Agent Evaluation"),
    ],
    projects: ["Multi-Agent Coding Assistant"],
  },
  {
    id: 27,
    slug: "advanced-ai",
    title: "Model Engineering (Awareness)",
    subtitle: "Phase 27",
    description:
      "Enough model engineering to operate agents: fine-tuning awareness, LoRA/QLoRA, distillation, inference optimization, serving. Image/video/research stay for completeness — this is not an ML-researcher track.",
    estimatedHours: 28,
    color: "from-purple-500 to-purple-800",
    modules: [
      mod("fine-tuning", "Fine Tuning"),
      mod("lora", "LoRA"),
      mod("qlora", "QLoRA"),
      mod("peft", "PEFT"),
      mod("inference-optimization", "Inference Optimization"),
      mod("distillation", "Distillation"),
      mod("model-serving", "Model Serving"),
      mod("image-generation", "Image Generation"),
      mod("video-models", "Video Models"),
      mod("research-papers", "Research Papers"),
    ],
  },
  {
    id: 28,
    slug: "capstone-projects",
    title: "Capstone Projects",
    subtitle: "Phase 28",
    description:
      "Production-ready portfolio projects — AI software engineer, research assistant, customer support, and more.",
    estimatedHours: 80,
    color: "from-rose-500 to-rose-700",
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
    id: 29,
    slug: "interview-system-design",
    title: "Interview & System Design",
    subtitle: "Phase 29",
    description:
      "Agent system design, LangGraph, MCP, multi-agent, memory, context, runtime, AG-UI, production debugging, and mock interviews.",
    estimatedHours: 28,
    color: "from-fuchsia-500 to-fuchsia-800",
    modules: [
      mod("agent-system-design", "Agent System Design"),
      mod("langgraph-coding", "LangGraph Coding"),
      mod("mcp-design", "MCP Design"),
      mod("multi-agent-design", "Multi-Agent Design"),
      mod("memory-design", "Memory Design"),
      mod("context-engineering-design", "Context Engineering Design"),
      mod("agent-runtime-design", "Agent Runtime Design"),
      mod("ag-ui-design", "AG-UI Design"),
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

export function getPhaseIndex(slug: string): number {
  return phases.findIndex((p) => p.slug === slug);
}

export function getAdjacentPhase(
  slug: string,
  direction: "prev" | "next"
): Phase | undefined {
  const index = getPhaseIndex(slug);
  if (index === -1) return undefined;
  const nextIndex = direction === "prev" ? index - 1 : index + 1;
  return phases[nextIndex];
}

export function isOptionalModuleKey(key: string): boolean {
  const phaseSlug = key.split("/")[0];
  const phase = getPhaseBySlug(phaseSlug);
  return phase?.optional === true;
}

export function countProgressModules(): number {
  return phases
    .filter((p) => !p.optional)
    .reduce((acc, p) => acc + p.modules.length, 0);
}

export function countProgressPhases(): number {
  return phases.filter((p) => !p.optional).length;
}

export const totalModules = countProgressModules();
export const totalPhases = countProgressPhases();
export const totalHours = phases.reduce((acc, p) => acc + p.estimatedHours, 0);

/** Capstone is project-build time, not lesson coverage. Optional ML is a side branch. */
export function isRoadmapLessonPhase(phase: Phase): boolean {
  return !phase.optional && phase.slug !== "capstone-projects";
}

/** Hours to cover this phase's modules — lessons only. */
export function getPhaseLessonHours(phase: Phase): number {
  return isRoadmapLessonPhase(phase) ? phase.estimatedHours : 0;
}

export const totalLessonHours = phases.reduce(
  (acc, phase) => acc + getPhaseLessonHours(phase),
  0
);

export const roadmapFlow = [
  "Code",
  "GenAI",
  "ML (optional)",
  "LLM APIs",
  "RAG",
  "Agents",
  "Memory",
  "Context",
  "Tools",
  "MCP",
  "Frameworks",
  "LangGraph",
  "OpenAI Agents",
  "Claude Agents",
  "CrewAI",
  "PydanticAI",
  "Microsoft AF",
  "Google ADK",
  "Patterns",
  "Multi-Agent",
  "Eval",
  "Security",
  "Runtime",
  "AG-UI",
  "Browser",
  "Voice",
  "Enterprise",
  "Coding",
  "Models",
  "Capstone",
  "Interview",
];

/** Old slugs → new hybrid phase (for redirects) */
export const legacyPhaseRedirects: Record<string, string> = {
  "ai-engineering-foundations": "transformer-foundations",
  "agentic-ai": "agent-foundations",
  "production-ai": "production-agents",
  "interview-projects": "capstone-projects",
};
