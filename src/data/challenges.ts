export const CHALLENGE_PHASE_SLUG = "challenge";

export type ChallengeCategory =
  | "Loop"
  | "Orchestration"
  | "Tools"
  | "Knowledge"
  | "Memory"
  | "Teams"
  | "Control"
  | "Quality"
  | "Safety"
  | "Production"
  | "Frameworks"
  | "SDK"
  | "Models"
  | "Infra";

export interface ChallengeTopic {
  slug: string;
  title: string;
  tagline: string;
  category: ChallengeCategory;
  minutes: number;
  whyToday: string;
}

export const challengeTopics: ChallengeTopic[] = [
  {
    slug: "react-loop",
    title: "ReAct Loop From Scratch",
    tagline: "Think, act, observe — without a framework.",
    category: "Loop",
    minutes: 50,
    whyToday: "Every agent SDK is a dressed-up reason-act loop. If you can write one by hand, you can debug every one you meet.",
  },
  {
    slug: "langgraph-control",
    title: "LangGraph Control Plane",
    tagline: "Graphs, state, and a place to pause.",
    category: "Orchestration",
    minutes: 55,
    whyToday: "A chain is a line. A while-loop cannot sleep. Production agents need branches, cycles, and a checkpoint.",
  },
  {
    slug: "mcp-boundary",
    title: "MCP as a Trust Boundary",
    tagline: "Tools, resources, prompts — not a brain.",
    category: "Tools",
    minutes: 50,
    whyToday: "MCP standardises how an agent reaches the world. It does not decide whether this refund is allowed.",
  },
  {
    slug: "tool-contracts",
    title: "Tool Contracts & Structured Output",
    tagline: "Schemas before clever prompts.",
    category: "Tools",
    minutes: 50,
    whyToday: "Agents fail at the tool boundary: wrong args, silent side effects, no idempotency. Contracts fix more than better wording.",
  },
  {
    slug: "agentic-rag",
    title: "Agentic RAG",
    tagline: "Retrieve, then decide whether to retrieve again.",
    category: "Knowledge",
    minutes: 55,
    whyToday: "Naive RAG dumps chunks once. Agentic RAG treats retrieval as a tool the model can call, rewrite, or refuse.",
  },
  {
    slug: "memory-tiers",
    title: "Working, Episodic, Long-term Memory",
    tagline: "Three drawers. One context window.",
    category: "Memory",
    minutes: 50,
    whyToday: "Dumping chat history is not memory. Production agents keep working state, episode notes, and durable facts apart.",
  },
  {
    slug: "multi-agent-patterns",
    title: "Supervisor, Swarm, Handoff",
    tagline: "When one brain is not enough.",
    category: "Teams",
    minutes: 55,
    whyToday: "Multi-agent is not 'more GPTs'. It is routing, ownership, and who is allowed to talk to the user.",
  },
  {
    slug: "hitl-interrupts",
    title: "Human-in-the-Loop Interrupts",
    tagline: "Pause before the irreversible.",
    category: "Control",
    minutes: 50,
    whyToday: "Refunds, emails, deploys, and deletions need a siding. If you cannot pause overnight, you do not have HITL.",
  },
  {
    slug: "trajectory-evals",
    title: "Trajectory Evaluation",
    tagline: "Judge the path, not only the last token.",
    category: "Quality",
    minutes: 50,
    whyToday: "A correct answer after three wrong tool calls is still a failing agent. Evals must score the trajectory.",
  },
  {
    slug: "guardrails-before-action",
    title: "Guardrails Before Action",
    tagline: "Policy at the tool, not the paragraph.",
    category: "Safety",
    minutes: 50,
    whyToday: "Filtering the reply is too late if the email already sent. Authorization lives in the tool gateway.",
  },
  {
    slug: "context-engineering",
    title: "Context Engineering",
    tagline: "What the model sees is the product.",
    category: "Memory",
    minutes: 55,
    whyToday: "Prompt engineering wrote the instruction. Context engineering selects, budgets, and proves every token in the window.",
  },
  {
    slug: "plan-and-execute",
    title: "Plan-and-Execute & Reflexion",
    tagline: "Think in a list. Critique the run.",
    category: "Loop",
    minutes: 50,
    whyToday: "ReAct is greedy. Planning writes the map first. Reflexion writes a note the next run can use.",
  },
  {
    slug: "observability-cost",
    title: "Traces, Cost, and Latency",
    tagline: "If you cannot replay it, you cannot ship it.",
    category: "Production",
    minutes: 50,
    whyToday: "Demos hide tokens. Production agents leak money in retries, fat context, and tools that never time out.",
  },
  {
    slug: "computer-use",
    title: "Browser & Computer Use",
    tagline: "The world is not an API.",
    category: "Tools",
    minutes: 55,
    whyToday: "Computer-use agents click, type, and get lost. Navigation state, allowlists, and SSRF are the real lesson.",
  },
  {
    slug: "a2a-interop",
    title: "A2A Agent Interop",
    tagline: "Agents talking to agents.",
    category: "Teams",
    minutes: 50,
    whyToday: "MCP is agent-to-tool. A2A is agent-to-agent: discovery, task lifecycle, and artifacts across teams.",
  },
  {
    slug: "agent-harness",
    title: "The Production Agent Harness",
    tagline: "Frameworks are not the product.",
    category: "Production",
    minutes: 55,
    whyToday: "LangGraph, MCP, and SDKs accelerate loops. The harness owns policy, budgets, rollback, and who may act.",
  },
  {
    slug: "crewai-roles",
    title: "CrewAI Role Design",
    tagline: "Jobs, not vibes.",
    category: "Teams",
    minutes: 50,
    whyToday: "A crew fails when two roles own the same decision. Role design is the architecture.",
  },
  {
    slug: "self-improving",
    title: "Self-Improving Agents",
    tagline: "Learn from traces, not vibes.",
    category: "Quality",
    minutes: 50,
    whyToday: "Self-improve is not 'the model rewrites itself'. It is dataset → eval → prompt/tool/graph change → gate.",
  },
  {
    slug: "least-privilege",
    title: "Least Privilege Agents",
    tagline: "The smallest tool that can finish the job.",
    category: "Safety",
    minutes: 50,
    whyToday: "OWASP MCP Top 10 is about over-scoped tools. If one tool can delete production, the prompt cannot save you.",
  },
  {
    slug: "workflows-vs-agents",
    title: "Workflows vs Agents",
    tagline: "Known path vs open-ended path.",
    category: "Orchestration",
    minutes: 50,
    whyToday: "Most 'agents' should be workflows. Autonomy is expensive. Use it only when the path is not known.",
  },
  {
    slug: "autogen-ag2",
    title: "AutoGen / AG2 Conversation Agents",
    tagline: "Agents that talk to agents, with a human in the group chat.",
    category: "Frameworks",
    minutes: 50,
    whyToday: "AutoGen invented the multi-agent group chat. AG2 is the community fork. You need to know what the conversation pattern buys you — and what it hides.",
  },
  {
    slug: "microsoft-agent-framework",
    title: "Microsoft Agent Framework",
    tagline: "Semantic Kernel and AutoGen grew up into one stack.",
    category: "Frameworks",
    minutes: 55,
    whyToday: "Microsoft folded Semantic Kernel and AutoGen into one framework. If you ship on Azure, this is the control plane you will be handed.",
  },
  {
    slug: "pydantic-ai",
    title: "Pydantic AI",
    tagline: "Type-safe agents. The schema is the product.",
    category: "Frameworks",
    minutes: 50,
    whyToday: "Pydantic AI treats the agent like a typed function. If your output is not a model, you do not have a contract.",
  },
  {
    slug: "smolagents",
    title: "Hugging Face SmolAgents",
    tagline: "Code-first agents that write the next action as Python.",
    category: "Frameworks",
    minutes: 50,
    whyToday: "SmolAgents lets the model write code instead of JSON tool calls. That is power and a jail. You need both the sandbox and the budget.",
  },
  {
    slug: "mastra",
    title: "Mastra",
    tagline: "TypeScript agents with workflows, memory, and evals in one box.",
    category: "Frameworks",
    minutes: 50,
    whyToday: "Mastra is the TypeScript-native agent stack. If your product is Next.js, this is the framework you will be asked to compare to LangGraph.",
  },
  {
    slug: "llamaindex-workflows",
    title: "LlamaIndex Workflows",
    tagline: "Event-driven steps, not a chat loop pretending to be a graph.",
    category: "Frameworks",
    minutes: 50,
    whyToday: "LlamaIndex grew from retrieval into an event workflow engine. The sitting is when to use a workflow versus a ReAct loop on top of an index.",
  },
  {
    slug: "deep-agents",
    title: "Deep Agents",
    tagline: "Long-horizon agents that plan, remember, and spawn sub-agents.",
    category: "Frameworks",
    minutes: 55,
    whyToday: "Deep Agents is LangChain's bet on agents that run for hours: a planner, a filesystem, and sub-agents. The lesson is the harness, not the brand.",
  },
  {
    slug: "openai-swarm",
    title: "OpenAI Swarm",
    tagline: "Handoffs, not a mesh of managers.",
    category: "Frameworks",
    minutes: 50,
    whyToday: "Swarm made handoffs look easy. The production question is who owns the user, who owns the tools, and what happens when two agents both think they are done.",
  },
  {
    slug: "openai-agents-sdk",
    title: "OpenAI Agents SDK",
    tagline: "Handoffs, guardrails, and tracing in the first-party SDK.",
    category: "SDK",
    minutes: 55,
    whyToday: "The Agents SDK is Swarm grown up: typed agents, input/output guardrails, and traces. If you ship on OpenAI, this is the loop you will debug.",
  },
  {
    slug: "google-adk",
    title: "Google Agent Development Kit",
    tagline: "Agents, tools, and sessions the Gemini way.",
    category: "SDK",
    minutes: 50,
    whyToday: "ADK is Google's official agent kit: sequential, parallel, and loop agents on Gemini. You need to know the session, the callback, and where the tool actually runs.",
  },
  {
    slug: "vercel-ai-sdk",
    title: "Vercel AI SDK",
    tagline: "Streaming UI is not an agent. Tool calls can make it one.",
    category: "SDK",
    minutes: 50,
    whyToday: "The AI SDK owns the stream, the useChat hook, and the tool loop on the route. Most teams stop at tokens on screen. The sitting is the server-side loop.",
  },
  {
    slug: "copilotkit",
    title: "CopilotKit",
    tagline: "Put the agent in the user's product, not a chat tab.",
    category: "SDK",
    minutes: 50,
    whyToday: "CopilotKit is how an agent shares state with a React app: read the form, write the canvas, ask the human in the UI they already have.",
  },
  {
    slug: "braintrust",
    title: "Braintrust",
    tagline: "Evals, logs, and prompts as a product — not a spreadsheet.",
    category: "Quality",
    minutes: 50,
    whyToday: "Braintrust is where teams put the loop around the loop: score, compare, ship. If you cannot replay a bad trace against a new prompt, you are guessing.",
  },
  {
    slug: "langchain",
    title: "LangChain & LangChain Expression Language",
    tagline: "LCEL is a pipe. An agent is a loop. Do not confuse them.",
    category: "SDK",
    minutes: 50,
    whyToday: "LangChain is still the default import. The sitting is what LCEL is for, what create_agent is for, and when you should leave the library.",
  },
  {
    slug: "dspy",
    title: "DSPy",
    tagline: "Compile the prompt. Stop hand-tuning strings.",
    category: "Quality",
    minutes: 55,
    whyToday: "DSPy treats the LM program as something you compile against a metric. If your prompt is still a Google Doc, this sitting is the way out.",
  },
  {
    slug: "tree-of-thoughts",
    title: "Tree of Thoughts",
    tagline: "Branch, score, prune. Do not hope the next token is wiser.",
    category: "Loop",
    minutes: 50,
    whyToday: "ReAct is a path. Tree of Thoughts is a search. You need a scorer, a budget, and the honesty to kill a branch.",
  },
  {
    slug: "state-machines-checkpointing",
    title: "State Machines & Checkpointing",
    tagline: "If you cannot pause overnight, you do not have a process.",
    category: "Orchestration",
    minutes: 55,
    whyToday: "A while-loop dies with the process. Production agents need a state machine, a checkpoint, and a way to resume after a deploy.",
  },
  {
    slug: "code-executing-agents",
    title: "Code-Executing Agents",
    tagline: "The model writes Python. You write the jail.",
    category: "Tools",
    minutes: 55,
    whyToday: "Code as action is more powerful than JSON tools and more dangerous. Sandbox, filesystem, network, and time are the real lesson.",
  },
  {
    slug: "rag-foundations",
    title: "Retrieval-Augmented Generation",
    tagline: "Chunk, embed, retrieve, cite. Then admit what you missed.",
    category: "Knowledge",
    minutes: 50,
    whyToday: "Naive RAG is still how most products start. If you cannot explain chunking, recall, and citation, you are not ready for agentic RAG.",
  },
  {
    slug: "graphrag",
    title: "GraphRAG",
    tagline: "Entities and edges, not just nearest neighbours.",
    category: "Knowledge",
    minutes: 55,
    whyToday: "Vector search misses 'who reports to whom'. GraphRAG builds a knowledge graph and answers from communities. The sitting is when the graph is worth the build.",
  },
  {
    slug: "long-context-windowing",
    title: "Long-Context Windowing",
    tagline: "A million tokens is not a memory system.",
    category: "Memory",
    minutes: 50,
    whyToday: "Long context made people throw the dump in. Lost-in-the-middle is real. You still select, pin, and prove.",
  },
  {
    slug: "vector-databases",
    title: "Vector Databases",
    tagline: "Milvus, Pinecone, Qdrant, Chroma, Weaviate — pick for the job.",
    category: "Knowledge",
    minutes: 50,
    whyToday: "The index is a product decision: filters, hybrid, tenants, and deletes. A notebook Chroma is not a production retrieval layer.",
  },
  {
    slug: "hybrid-search",
    title: "Semantic & Hybrid Search",
    tagline: "Sparse plus dense. Keywords still win on SKUs.",
    category: "Knowledge",
    minutes: 50,
    whyToday: "Pure embedding search fails on order IDs and error codes. Hybrid search is the default. Learn the fuse, the filter, and the eval.",
  },
  {
    slug: "reasoning-models",
    title: "Reasoning Models",
    tagline: "o1, o3, DeepSeek-R1 — think tokens are a budget, not a vibe.",
    category: "Models",
    minutes: 50,
    whyToday: "Reasoning models spend tokens before they answer. You need to know when that spend pays, when it loops, and how to cap it.",
  },
  {
    slug: "open-sovereign-models",
    title: "Sovereign & Open Models",
    tagline: "Llama, Mistral, Qwen, DeepSeek — weights you can actually run.",
    category: "Models",
    minutes: 50,
    whyToday: "Open weights are a procurement and a security decision. The sitting is how to pick, serve, and evaluate a model you can keep.",
  },
  {
    slug: "frontier-models",
    title: "Frontier Proprietary Models",
    tagline: "GPT, Claude, Gemini — APIs with different failure modes.",
    category: "Models",
    minutes: 50,
    whyToday: "The frontier APIs are not interchangeable. Tool calling, long context, refusal, and price-per-trace differ. You pick per job, not per tweet.",
  },
  {
    slug: "multimodal-vla",
    title: "Multimodal & VLA Agents",
    tagline: "See, say, act. The screenshot is a tool result.",
    category: "Models",
    minutes: 55,
    whyToday: "Vision-language-action models click, type, and drive. The sitting is the observation, the action space, and why pixels are a last resort.",
  },
  {
    slug: "small-language-models",
    title: "Small Language Models",
    tagline: "Phi, Gemma, and the model that fits on the edge.",
    category: "Models",
    minutes: 50,
    whyToday: "Most agent steps do not need a frontier model. SLMs route, extract, and classify. The sitting is what to distill and what to keep large.",
  },
  {
    slug: "mixture-of-experts",
    title: "Mixture of Experts",
    tagline: "Sparse activation. The router is the architecture.",
    category: "Models",
    minutes: 50,
    whyToday: "MoE is how frontier models got cheaper per token. You need to know what a expert is, what the router does, and what breaks at serving time.",
  },
  {
    slug: "llm-red-teaming",
    title: "LLM Security & Red Teaming",
    tagline: "Attack your own agent before a stranger does.",
    category: "Safety",
    minutes: 55,
    whyToday: "Red team is not a prompt. It is a corpus, a severity rubric, and a gate. If you have not attacked your tools, a customer will.",
  },
  {
    slug: "prompt-injection",
    title: "Prompt Injection & Jailbreaking",
    tagline: "The document is an attacker. Treat it like one.",
    category: "Safety",
    minutes: 55,
    whyToday: "Prompt injection is the SQL injection of agents. Indirect injection in a PDF is how refunds, emails, and shells get hijacked.",
  },
  {
    slug: "model-alignment",
    title: "Alignment: RLHF, DPO, GRPO",
    tagline: "Preference data is the product. The loss is a choice.",
    category: "Models",
    minutes: 55,
    whyToday: "Alignment is how a base model becomes a product. RLHF, DPO, and GRPO are different bets on the same preference data. You should be able to say which one you would run.",
  },
  {
    slug: "local-inference",
    title: "Local Inference Runtimes",
    tagline: "Ollama, vLLM, LM Studio, llama.cpp — serve it yourself.",
    category: "Infra",
    minutes: 50,
    whyToday: "Local inference is latency, privacy, and a GPU bill you can see. The sitting is which runtime for a laptop, a box, and a cluster.",
  },
  {
    slug: "durable-execution",
    title: "Durable Execution for Agents",
    tagline: "Temporal and Inngest: the loop that survives a crash.",
    category: "Infra",
    minutes: 55,
    whyToday: "An agent that emails after a deploy killed the process is a bug. Durable execution is the checkpoint you should have built before the first tool.",
  },
];

export function getChallengeBySlug(slug: string): ChallengeTopic | undefined {
  return challengeTopics.find((topic) => topic.slug === slug);
}

export function isChallengeKey(key: string): boolean {
  return key.startsWith(`${CHALLENGE_PHASE_SLUG}/`);
}

export function challengeKey(slug: string): string {
  return `${CHALLENGE_PHASE_SLUG}/${slug}`;
}

export function parseChallengeKey(key: string): string | null {
  if (!isChallengeKey(key)) return null;
  return key.slice(CHALLENGE_PHASE_SLUG.length + 1) || null;
}

export function getCompletedChallengeTopics(completed: Iterable<string>): ChallengeTopic[] {
  const done = new Set(
    [...completed].map(parseChallengeKey).filter((slug): slug is string => Boolean(slug))
  );
  return challengeTopics.filter((topic) => done.has(topic.slug));
}

export function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function getDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getSeededChallenge(seed: string): ChallengeTopic {
  const index = hashString(seed) % challengeTopics.length;
  return challengeTopics[index];
}

export function pickRandomChallenge(excludeSlug?: string): ChallengeTopic {
  const pool = excludeSlug
    ? challengeTopics.filter((topic) => topic.slug !== excludeSlug)
    : challengeTopics;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index] ?? challengeTopics[0];
}
