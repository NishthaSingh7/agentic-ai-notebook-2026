import type { PhaseGlossaryTerm } from "@/data/agent-foundations-glossary";

export type MemoryGlossaryCategory = "Tiers" | "Kinds" | "Ops";

export const memoryGlossaryCategories: MemoryGlossaryCategory[] = [
  "Tiers",
  "Kinds",
  "Ops",
];

export const memoryGlossary: PhaseGlossaryTerm[] = [
  {
    term: "Working Memory",
    category: "Tiers",
    meaning: "What the model can see this call — the context window. RAM, not a database.",
    aliases: ["context window", "scratchpad"],
  },
  {
    term: "Short-Term Memory",
    category: "Tiers",
    meaning: "This session's buffer and rolling summary. Discarded unless you promote facts.",
    aliases: ["session buffer", "STM"],
  },
  {
    term: "Long-Term Memory",
    category: "Tiers",
    meaning: "Facts and episodes that survive sessions. Write, retrieve, and expire on purpose.",
    aliases: ["LTM", "persistence"],
  },
  {
    term: "Semantic Memory",
    category: "Kinds",
    meaning: "Atomic facts and meanings — a wiki, not a diary. Retrieve by similarity or key.",
    aliases: ["facts", "embeddings"],
  },
  {
    term: "Episodic Memory",
    category: "Kinds",
    meaning: "Events with a when, what, and outcome. Promote stable conclusions into facts.",
    aliases: ["episode", "event memory"],
  },
  {
    term: "Procedural Memory",
    category: "Kinds",
    meaning: "How-to: named playbooks and tool sequences. Version them or bad skills repeat.",
    aliases: ["playbook", "skill"],
  },
  {
    term: "Conversation Memory",
    category: "Kinds",
    meaning: "The chat thread with roles intact. Last N turns plus a summary of the rest.",
    aliases: ["turn", "thread"],
  },
  {
    term: "Memory Store",
    category: "Ops",
    meaning: "KV for keys, vectors for meaning, graph for links. Policy sits above the database.",
    aliases: ["KV", "vector database"],
  },
  {
    term: "Compression",
    category: "Ops",
    meaning: "Shrink memory to fit the token budget. Keep ids and constraints; drop dumps.",
    aliases: ["lossy compression", "token budget"],
  },
  {
    term: "Summarization",
    category: "Ops",
    meaning: "Rewrite old turns into minutes. A bad summary is a false memory.",
    aliases: ["rolling summary"],
  },
  {
    term: "Retrieval",
    category: "Ops",
    meaning: "Fetch a small set of memories for this turn. Empty is allowed; do not invent hits.",
    aliases: ["top-k", "metadata filter"],
  },
  {
    term: "Ranking",
    category: "Ops",
    meaning: "Score retrieved memories by relevance, recency, and importance. Cap what you pack.",
    aliases: ["recency", "dedup"],
  },
  {
    term: "Context Management",
    category: "Ops",
    meaning: "The packing plan for one call. Budget sections. Never drop the live user turn.",
    aliases: ["packing", "overflow"],
  },
];

export const memoryGlossaryPopularTerms = [
  "Working Memory",
  "Long-Term Memory",
  "Semantic Memory",
  "Episodic Memory",
  "Retrieval",
  "Context Management",
];

export function getMemoryGlossaryByCategory() {
  const grouped: Record<string, PhaseGlossaryTerm[]> = {};
  for (const category of memoryGlossaryCategories) grouped[category] = [];
  for (const term of memoryGlossary) {
    grouped[term.category] ??= [];
    grouped[term.category].push(term);
  }
  return grouped;
}
