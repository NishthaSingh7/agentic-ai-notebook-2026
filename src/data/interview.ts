export interface InterviewTopic {
  slug: string;
  title: string;
  category: "theory" | "coding" | "system-design" | "architecture";
  questionCount: number;
  phase: number;
}

export const interviewTopics: InterviewTopic[] = [
  { slug: "llm-fundamentals", title: "LLM Fundamentals", category: "theory", questionCount: 20, phase: 1 },
  { slug: "prompt-engineering", title: "Prompt Engineering", category: "theory", questionCount: 20, phase: 1 },
  { slug: "transformers", title: "Transformers & Attention", category: "theory", questionCount: 20, phase: 2 },
  { slug: "neural-networks", title: "Neural Networks", category: "theory", questionCount: 20, phase: 2 },
  { slug: "llm-apis", title: "LLM APIs & Integration", category: "coding", questionCount: 20, phase: 3 },
  { slug: "rag-system-design", title: "RAG System Design", category: "system-design", questionCount: 20, phase: 4 },
  { slug: "vector-search", title: "Vector Search & Embeddings", category: "theory", questionCount: 20, phase: 4 },
  { slug: "agent-architecture", title: "Agent Architecture", category: "architecture", questionCount: 20, phase: 5 },
  { slug: "react-pattern", title: "ReAct & Agent Patterns", category: "theory", questionCount: 20, phase: 5 },
  { slug: "langgraph", title: "LangGraph", category: "coding", questionCount: 20, phase: 6 },
  { slug: "mcp-design", title: "MCP System Design", category: "system-design", questionCount: 20, phase: 7 },
  { slug: "production-ai", title: "Production AI Systems", category: "system-design", questionCount: 20, phase: 8 },
  { slug: "ai-observability", title: "AI Observability", category: "architecture", questionCount: 20, phase: 8 },
  { slug: "fine-tuning", title: "Fine Tuning", category: "theory", questionCount: 20, phase: 9 },
];

export interface InterviewQuestion {
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
}

export const sampleQuestions: Record<string, InterviewQuestion[]> = {
  "llm-fundamentals": [
    {
      question: "What is the difference between a token and a word?",
      answer:
        "A token is the basic unit an LLM processes — it can be a word, subword, or character fragment. One word may map to multiple tokens (e.g., 'unhappiness' → ['un', 'happiness']). Token count determines API cost and context window usage.",
      difficulty: "easy",
      tags: ["tokens", "tokenization"],
    },
    {
      question: "Explain the transformer architecture at a high level.",
      answer:
        "Transformers use self-attention to process all tokens in parallel. Key components: embedding layer, positional encoding, multi-head self-attention, feed-forward networks, layer normalization, and residual connections. Decoder-only variants (GPT) use masked attention for autoregressive generation.",
      difficulty: "medium",
      tags: ["transformers", "attention"],
    },
    {
      question: "What causes LLM hallucinations and how do you mitigate them?",
      answer:
        "Hallucinations arise from: training data gaps, probabilistic generation, lack of grounding. Mitigations: RAG for factual grounding, confidence thresholds, structured outputs, evaluation pipelines, human-in-the-loop review, and prompt engineering with explicit uncertainty instructions.",
      difficulty: "hard",
      tags: ["hallucination", "rag", "evaluation"],
    },
  ],
  "agent-architecture": [
    {
      question: "What is the agent loop?",
      answer:
        "The agent loop: (1) Observe current state/environment, (2) Reason about next action using LLM, (3) Select and invoke a tool, (4) Process tool result, (5) Update state/memory, (6) Repeat until task complete or max iterations reached.",
      difficulty: "easy",
      tags: ["agents", "tool-calling"],
    },
    {
      question: "Compare ReAct vs Plan-and-Execute agent patterns.",
      answer:
        "ReAct interleaves reasoning and acting step-by-step (think → act → observe → think). Plan-and-Execute first creates a full plan, then executes steps sequentially. ReAct is more adaptive to surprises; Plan-and-Execute is better for complex multi-step tasks with clear structure.",
      difficulty: "medium",
      tags: ["react", "planning", "agents"],
    },
    {
      question: "How would you design agent memory for a long-running customer support agent?",
      answer:
        "Use tiered memory: short-term (conversation buffer in context window), working memory (summarized recent interactions), long-term (vector store of past conversations + user preferences). Implement memory consolidation to compress old conversations. Use metadata filtering for user-specific retrieval.",
      difficulty: "hard",
      tags: ["memory", "agents", "system-design"],
    },
  ],
  "rag-system-design": [
    {
      question: "Design a RAG system for a 1M document enterprise knowledge base.",
      answer:
        "Pipeline: document ingestion (loaders + OCR) → chunking (512 tokens, 50 overlap) → embedding (text-embedding-3-small) → vector store (Pinecone with metadata) → hybrid search (BM25 + dense) → cross-encoder re-ranking → LLM generation with citations → evaluation (RAGAS metrics). Add caching, monitoring, and feedback loop.",
      difficulty: "hard",
      tags: ["rag", "system-design", "vector-db"],
    },
    {
      question: "What chunking strategies exist and when do you use each?",
      answer:
        "Fixed-size (simple, fast), semantic (split on meaning boundaries), recursive (hierarchical by headers), document-structure (respect sections). Use semantic/recursive for structured docs, fixed-size for uniform text. Always include overlap (10-20%) to preserve context across boundaries.",
      difficulty: "medium",
      tags: ["chunking", "rag"],
    },
  ],
};

export const categoryLabels: Record<InterviewTopic["category"], string> = {
  theory: "Theory",
  coding: "Coding",
  "system-design": "System Design",
  architecture: "Architecture",
};

export const categoryColors: Record<InterviewTopic["category"], string> = {
  theory: "bg-green-500/10 text-green-400",
  coding: "bg-blue-600/10 text-blue-400",
  "system-design": "bg-emerald-500/10 text-emerald-400",
  architecture: "bg-blue-500/10 text-blue-300",
};
