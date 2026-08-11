export type AgentGlossaryCategory =
  | "Core Concepts"
  | "Agent Types"
  | "Architecture"
  | "Planning & Reasoning"
  | "Memory"
  | "Tools & Protocols"
  | "Production & Safety"
  | "Evaluation";

export interface PhaseGlossaryTerm {
  term: string;
  meaning: string;
  category: AgentGlossaryCategory;
  /** Extra search keywords (abbreviations, synonyms) */
  aliases?: string[];
}

export const agentFoundationsGlossary: PhaseGlossaryTerm[] = [
  // Core Concepts
  {
    term: "AI Agent",
    category: "Core Concepts",
    meaning:
      "An LLM-powered system that runs in a loop — observe, reason, call tools, update state — until a goal is complete or a limit is hit.",
    aliases: ["agent", "autonomous agent"],
  },
  {
    term: "Agent Loop",
    category: "Core Concepts",
    meaning:
      "The repeating cycle: receive state → LLM decides → execute tool or answer → append observation → repeat until done, timeout, or max steps.",
    aliases: ["orchestration loop", "perception-action loop", "execution loop"],
  },
  {
    term: "Orchestration Loop",
    category: "Core Concepts",
    meaning:
      "Same as the agent loop — the runtime repeatedly perceives state, reasons, acts via tools, and updates memory until the goal is met or a limit triggers.",
    aliases: ["agent loop", "observe reason act"],
  },
  {
    term: "Context Overflow",
    category: "Core Concepts",
    meaning:
      "When conversation history, tool outputs, and prompts exceed the model's context window — causes truncation, forgotten instructions, or API errors. Fix with compression, summarization, or retrieval.",
    aliases: ["context limit", "token overflow", "context window exceeded"],
  },
  {
    term: "Runaway Cost",
    category: "Core Concepts",
    meaning:
      "Uncontrolled API spend from infinite agent loops, excessive retries, or parallel tool fan-out. Prevent with max steps, cost budgets per task, and alerts on spend spikes.",
    aliases: ["cost overrun", "runaway spend", "token budget"],
  },
  {
    term: "Tool",
    category: "Core Concepts",
    meaning:
      "An external capability exposed to the LLM via a JSON schema — e.g. search, SQL, send email, run code. The runtime executes it when the model requests it.",
    aliases: ["function", "tool call"],
  },
  {
    term: "Action",
    category: "Core Concepts",
    meaning:
      "A single tool invocation the LLM chooses — includes tool name and parsed arguments from the model output.",
  },
  {
    term: "Observation",
    category: "Core Concepts",
    meaning:
      "The result returned from a tool execution, fed back into the conversation so the LLM can reason about the next step.",
    aliases: ["tool result"],
  },
  {
    term: "Orchestration",
    category: "Core Concepts",
    meaning:
      "The runtime layer that drives the agent loop: routing, retries, parallel tools, cost limits, tracing, and human-approval gates.",
    aliases: ["agent runtime", "orchestration loop", "orchestrator"],
  },
  {
    term: "Side Effect",
    category: "Core Concepts",
    meaning:
      "Any change in the real world caused by an agent — sending email, updating a database, creating a ticket. Requires guardrails and often HITL.",
  },
  {
    term: "Autonomy",
    category: "Core Concepts",
    meaning:
      "How independently an agent acts without human input per step. Higher autonomy needs stronger evals, limits, and approval gates.",
  },

  // Agent Types
  {
    term: "Reactive Agent",
    category: "Agent Types",
    meaning:
      "Single-turn input → LLM → output. No tools, no persistent loop. Good for classification, routing, or simple Q&A on static knowledge.",
  },
  {
    term: "Conversational Agent",
    category: "Agent Types",
    meaning:
      "Multi-turn chat with a memory buffer so context carries across messages. May use RAG but typically no tool loop.",
    aliases: ["chatbot with memory"],
  },
  {
    term: "Task-Oriented Agent",
    category: "Agent Types",
    meaning:
      "An agent that uses a tool loop (often ReAct) with explicit stop conditions to complete multi-step goals like research or data analysis.",
    aliases: ["task agent"],
  },
  {
    term: "Deliberative Agent",
    category: "Agent Types",
    meaning:
      "Planner first produces a full step list, then an executor runs steps in order. Best when the workflow structure is known upfront.",
    aliases: ["plan-first agent"],
  },
  {
    term: "Multi-Agent System",
    category: "Agent Types",
    meaning:
      "Multiple specialized agents coordinated by a supervisor or message bus — e.g. researcher + writer + critic for large projects.",
    aliases: ["MAS", "multi-agent"],
  },

  // Architecture
  {
    term: "ReAct",
    category: "Architecture",
    meaning:
      "Reason + Act pattern: the LLM interleaves reasoning (Thought), tool selection (Action), and results (Observation) each step until the task is done.",
    aliases: ["reason and act", "thought action observation"],
  },
  {
    term: "Plan-and-Execute",
    category: "Architecture",
    meaning:
      "Two-phase pattern: a planner LLM outputs structured steps, then an executor runs them — with optional re-planning on failure.",
    aliases: ["plan execute", "planner executor"],
  },
  {
    term: "StateGraph",
    category: "Architecture",
    meaning:
      "LangGraph's model for agent workflows: nodes are functions, edges define flow, and a shared typed state object is passed between steps.",
    aliases: ["LangGraph", "agent graph"],
  },
  {
    term: "Supervisor Pattern",
    category: "Architecture",
    meaning:
      "A router LLM reads the task and delegates subtasks to specialist worker agents, then synthesizes their outputs.",
    aliases: ["supervisor agent", "router agent"],
  },
  {
    term: "Pipeline Architecture",
    category: "Architecture",
    meaning:
      "Fixed sequential stages — e.g. retrieve → plan → execute → verify — with less dynamic routing than ReAct.",
  },
  {
    term: "Conditional Routing",
    category: "Architecture",
    meaning:
      "Graph edges that branch based on state — e.g. route to human review when OCR confidence is low, or retry when a tool fails.",
  },

  // Planning & Reasoning
  {
    term: "Planning",
    category: "Planning & Reasoning",
    meaning:
      "Decomposing a user goal into ordered subtasks with tools, dependencies, and expected outputs before or during execution.",
  },
  {
    term: "Re-planning",
    category: "Planning & Reasoning",
    meaning:
      "Revising remaining steps after a tool failure or new information — instead of blindly continuing the original plan.",
  },
  {
    term: "Chain-of-Thought (CoT)",
    category: "Planning & Reasoning",
    meaning:
      "Prompting the LLM to show step-by-step reasoning before answering. Improves logic and tool selection quality.",
    aliases: ["CoT", "chain of thought"],
  },
  {
    term: "Tree-of-Thoughts",
    category: "Planning & Reasoning",
    meaning:
      "Explores multiple reasoning branches, evaluates them, and pursues the most promising path — higher cost, better on hard problems.",
    aliases: ["ToT"],
  },
  {
    term: "Reflection",
    category: "Planning & Reasoning",
    meaning:
      "A review pass where the agent critiques its draft output for completeness, accuracy, and policy compliance before returning to the user.",
    aliases: ["self-critique"],
  },
  {
    term: "Self-Correction",
    category: "Planning & Reasoning",
    meaning:
      "Detecting errors inside the agent loop (tool failure, empty result, schema violation) and retrying with fix context — not just at the end.",
  },
  {
    term: "Reflexion",
    category: "Planning & Reasoning",
    meaning:
      "After failure, the agent writes a verbal lesson to memory so similar future tasks avoid the same mistake.",
  },
  {
    term: "Reasoning Model",
    category: "Planning & Reasoning",
    meaning:
      "Models optimized for extended internal reasoning (e.g. o-series, DeepSeek-R1) — often used for the planning step, not every tool call.",
    aliases: ["o1", "thinking model"],
  },

  // Memory
  {
    term: "Working Memory",
    category: "Memory",
    meaning:
      "Everything currently in the LLM context window — recent messages, tool results, and system prompt for this step.",
    aliases: ["context window"],
  },
  {
    term: "Short-Term Memory",
    category: "Memory",
    meaning:
      "Session-level conversation buffer — persists across turns in one chat but not across sessions.",
    aliases: ["buffer", "session memory"],
  },
  {
    term: "Long-Term Memory",
    category: "Memory",
    meaning:
      "Persistent storage (vector DB, KV store) retrieved at runtime to ground the agent in facts beyond the context window.",
    aliases: ["vector store", "persistent memory"],
  },
  {
    term: "Episodic Memory",
    category: "Memory",
    meaning:
      "Stored lessons from past tasks or episodes — what worked, what failed — used to improve future runs (Reflexion-style learning).",
    aliases: ["episodic", "episode memory", "past task lessons"],
  },
  {
    term: "Semantic Memory",
    category: "Memory",
    meaning:
      "Extracted facts and relationships (often a knowledge graph) separate from raw chat history — durable world knowledge the agent can retrieve.",
    aliases: ["semantic", "fact store", "knowledge graph"],
  },
  {
    term: "Checkpoint",
    category: "Memory",
    meaning:
      "Saved graph or session state so an agent can resume after a crash, human approval pause, or long-running workflow.",
    aliases: ["persistence", "state save"],
  },
  {
    term: "Context Compression",
    category: "Memory",
    meaning:
      "Summarizing or trimming old messages to stay within token limits while preserving task-critical information.",
  },

  // Tools & Protocols
  {
    term: "Tool Registry",
    category: "Tools & Protocols",
    meaning:
      "Central catalog mapping tool names to JSON schemas, handler functions, permissions, and rate limits — the single source of truth for what an agent can call.",
    aliases: ["tool registry", "tool catalog", "function registry"],
  },
  {
    term: "MCP Server",
    category: "Tools & Protocols",
    meaning:
      "A service that exposes tools, resources, or prompts over the Model Context Protocol — e.g. Git, filesystem, Slack, CRM, or database servers that any MCP client agent can connect to.",
    aliases: ["mcp server", "model context protocol server"],
  },
  {
    term: "MCP (Model Context Protocol)",
    category: "Tools & Protocols",
    meaning:
      "Open standard for connecting agents to tools and resources via MCP servers — replaces many custom OAuth integrations with one client/server protocol.",
    aliases: ["model context protocol", "MCP client"],
  },
  {
    term: "Playwright",
    category: "Tools & Protocols",
    meaning:
      "Browser automation library commonly used as an agent tool to navigate pages, click elements, fill forms, and scrape dynamic web apps headlessly.",
    aliases: ["playright", "browser automation", "browser agent tool"],
  },
  {
    term: "Web Scraping",
    category: "Tools & Protocols",
    meaning:
      "Extracting text or data from websites — via Playwright, HTTP fetch, or search APIs. Agents use scrape results as observations for research and monitoring tasks.",
    aliases: ["scrape", "scraping", "web scrape"],
  },
  {
    term: "SerpAPI",
    category: "Tools & Protocols",
    meaning:
      "A search API tool that returns structured Google/Bing results — agents call it instead of hallucinating links or crawling search pages directly.",
    aliases: ["serp api", "search API", "web search tool"],
  },
  {
    term: "Snowflake",
    category: "Tools & Protocols",
    meaning:
      "Cloud data warehouse often wired as an agent SQL tool — the LLM generates queries, the runtime executes against Snowflake, and results ground analytics answers.",
    aliases: ["snowflake SQL", "data warehouse tool"],
  },
  {
    term: "CRM",
    category: "Tools & Protocols",
    meaning:
      "Customer Relationship Management system (e.g. Salesforce, HubSpot) — agents read/update contacts, tickets, and deals via CRM tools or MCP servers.",
    aliases: ["salesforce", "customer relationship management", "hubspot"],
  },
  {
    term: "ERP",
    category: "Tools & Protocols",
    meaning:
      "Enterprise Resource Planning system (e.g. SAP, NetSuite) — agents integrate with inventory, orders, and finance modules through controlled APIs.",
    aliases: ["enterprise resource planning", "SAP", "netsuite"],
  },
  {
    term: "Multimodal Agent",
    category: "Tools & Protocols",
    meaning:
      "An agent that accepts or produces images, audio, PDFs, or video — not just text. Uses vision-capable models and parsers for documents and screenshots.",
    aliases: ["multimodal", "vision agent", "image input agent"],
  },
  {
    term: "Function Calling",
    category: "Tools & Protocols",
    meaning:
      "API pattern where the LLM returns structured tool name + arguments; the runtime validates and executes the handler.",
    aliases: ["tool calling", "tool use"],
  },
  {
    term: "A2A (Agent-to-Agent)",
    category: "Tools & Protocols",
    meaning:
      "Protocol for agents to discover, message, and delegate tasks to other agents across systems.",
    aliases: ["agent to agent"],
  },
  {
    term: "Parallel Tool Execution",
    category: "Tools & Protocols",
    meaning:
      "Running independent tools concurrently (e.g. three web searches) to reduce latency before merging results.",
  },
  {
    term: "Tool Router",
    category: "Tools & Protocols",
    meaning:
      "When many tools exist (50+), a retrieval or routing step narrows candidates before the main LLM selects one.",
    aliases: ["tool retrieval", "two-stage tool selection"],
  },

  // Production & Safety
  {
    term: "Guardrails",
    category: "Production & Safety",
    meaning:
      "Input/output filters and policy checks — block PII leakage, jailbreaks, unsafe tool args, or off-topic requests.",
    aliases: ["safety filters", "policy engine"],
  },
  {
    term: "HITL (Human-in-the-Loop)",
    category: "Production & Safety",
    meaning:
      "Pausing the agent for human approval before destructive or high-stakes actions — send email, delete data, deploy code, or large financial transfers.",
    aliases: ["human in the loop", "human approval", "HITL gate", "approval gate"],
  },
  {
    term: "PII Redaction",
    category: "Production & Safety",
    meaning:
      "Stripping or masking personally identifiable information (names, emails, SSNs) from prompts and logs before they reach the LLM or observability tools.",
    aliases: ["PII masking", "data redaction", "privacy filter"],
  },
  {
    term: "Prompt Injection",
    category: "Production & Safety",
    meaning:
      "An attack where malicious text in user input or retrieved documents tricks the agent into ignoring instructions or calling unsafe tools.",
    aliases: ["injection attack", "jailbreak injection", "indirect injection"],
  },
  {
    term: "Jailbreak",
    category: "Production & Safety",
    meaning:
      "Adversarial prompts designed to bypass safety guardrails — e.g. role-play tricks, encoded instructions, or 'ignore previous rules' attacks.",
    aliases: ["jailbreak injection", "safety bypass", "adversarial prompt"],
  },
  {
    term: "OpenTelemetry",
    category: "Production & Safety",
    meaning:
      "Vendor-neutral observability standard for traces, metrics, and logs — instrument agent runs with spans for each LLM call and tool execution.",
    aliases: ["OTel", "open telemetry", "distributed tracing"],
  },
  {
    term: "Tracing",
    category: "Production & Safety",
    meaning:
      "Logging every step of an agent run — prompts, tool calls, latencies, costs — via LangSmith, Braintrust, or OpenTelemetry.",
    aliases: ["observability", "spans", "LangSmith"],
  },
  {
    term: "Sandbox",
    category: "Production & Safety",
    meaning:
      "Isolated environment for code or tool execution — limited filesystem, network, and permissions.",
  },
  {
    term: "Max Iterations",
    category: "Production & Safety",
    meaning:
      "Hard cap on agent loop steps to prevent infinite loops and runaway API cost. Typical values: 8–15 for demos, tuned in prod.",
    aliases: ["max steps", "step budget"],
  },
  {
    term: "Termination Condition",
    category: "Production & Safety",
    meaning:
      "Why the loop stopped: task done, max steps reached, timeout, unrecoverable error, or human cancellation.",
    aliases: ["stop condition"],
  },
  {
    term: "Grounding",
    category: "Production & Safety",
    meaning:
      "Tying the agent's answer to verifiable sources — tool outputs, retrieved chunks, or citations — to reduce hallucination.",
    aliases: ["citation", "source attribution"],
  },
  {
    term: "Agent Lifecycle",
    category: "Production & Safety",
    meaning:
      "Design → Develop → Evaluate → Deploy → Iterate — the ongoing discipline for keeping agents reliable in production.",
  },
  {
    term: "Canary Rollout",
    category: "Production & Safety",
    meaning:
      "Deploying a new agent version or prompt to a small percentage of traffic first — monitor error rate, cost, and latency before promoting to 100%.",
    aliases: ["canary deploy", "canary release", "gradual rollout"],
  },
  {
    term: "Canary Deploy",
    category: "Production & Safety",
    meaning:
      "Rolling out a new agent or prompt to a small % of traffic first, monitoring errors before full promotion.",
    aliases: ["canary rollout"],
  },

  // Evaluation
  {
    term: "Episode",
    category: "Evaluation",
    meaning:
      "One complete agent task from user request to final response or failure — the unit you debug and score.",
  },
  {
    term: "Trajectory",
    category: "Evaluation",
    meaning:
      "The full ordered log of an episode — every thought, action, observation, and LLM call. Essential for debugging.",
    aliases: ["trace", "run log"],
  },
  {
    term: "Golden Tasks",
    category: "Evaluation",
    meaning:
      "Fixed representative tasks with expected tool calls or answers — the core cases your agent must pass on every change (same idea as a golden set).",
    aliases: ["golden set", "golden dataset", "eval tasks", "benchmark tasks"],
  },
  {
    term: "Golden Set",
    category: "Evaluation",
    meaning:
      "Fixed test cases with expected tool calls or answers — run on every prompt or code change to catch regressions.",
    aliases: ["golden dataset", "eval set", "golden tasks"],
  },
  {
    term: "Trajectory Evaluation",
    category: "Evaluation",
    meaning:
      "Scoring whether the agent took the right steps — not just whether the final answer looks correct.",
    aliases: ["process eval", "step eval"],
  },
  {
    term: "Regression Suite",
    category: "Evaluation",
    meaning:
      "Automated eval tests in CI that fail the build if agent behavior degrades after a change — runs golden tasks on every PR.",
    aliases: ["agent CI", "eval pipeline", "regression tests"],
  },
  {
    term: "Red Teaming",
    category: "Evaluation",
    meaning:
      "Adversarial testing — prompt injection, jailbreaks, tool abuse, data exfiltration — to find safety gaps before production users do.",
    aliases: ["red team", "red teaming", "adversarial eval", "jailbreak testing"],
  },
  {
    term: "Capability Tier (L1–L4)",
    category: "Evaluation",
    meaning:
      "Maturity ladder: L1 single-tool, L2 multi-tool loop, L3 plan-and-recover, L4 multi-agent long-horizon. Match evals to tier.",
    aliases: ["L1", "L2", "L3", "L4"],
  },
  {
    term: "Ground Truth",
    category: "Evaluation",
    meaning:
      "The expected correct answer or tool sequence for an eval case — what you compare the agent output against.",
  },
];

export const agentGlossaryCategories: AgentGlossaryCategory[] = [
  "Core Concepts",
  "Agent Types",
  "Architecture",
  "Planning & Reasoning",
  "Memory",
  "Tools & Protocols",
  "Production & Safety",
  "Evaluation",
];

export function getAgentFoundationsGlossaryByCategory(): Record<
  AgentGlossaryCategory,
  PhaseGlossaryTerm[]
> {
  const grouped = {} as Record<AgentGlossaryCategory, PhaseGlossaryTerm[]>;
  for (const cat of agentGlossaryCategories) {
    grouped[cat] = [];
  }
  for (const term of agentFoundationsGlossary) {
    grouped[term.category].push(term);
  }
  for (const cat of agentGlossaryCategories) {
    grouped[cat].sort((a, b) => a.term.localeCompare(b.term));
  }
  return grouped;
}
