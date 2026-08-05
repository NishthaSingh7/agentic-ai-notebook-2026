import type { Project } from "./project-types";
import { createProject, archDiagram, slide } from "./project-builder";

export const projectCatalog: Project[] = [
  createProject({
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
    prerequisites: [
      "Python 3.11+ and basic FastAPI routing",
      "OpenAI API key with structured output (JSON mode)",
      "Understanding of PDF text extraction (PyMuPDF or pdfplumber)",
      "Familiarity with React forms and file upload",
      "Basic knowledge of hiring rubrics and ATS concepts",
    ],
    setupSteps: [
      "Create a virtualenv and install FastAPI, PyMuPDF, openai, and pydantic",
      "Scaffold FastAPI with /upload-resume and /score endpoints",
      "Add a React frontend with drag-and-drop PDF upload",
      "Configure OpenAI with a JSON schema for rubric scores",
      "Seed 3 sample resumes and 2 job descriptions for local testing",
      "Run uvicorn and verify end-to-end upload → score flow",
    ],
    architectureExplanation:
      "Resumes and job descriptions enter separate parsing pipelines that extract sections, skills, and requirements. An alignment engine compares extracted entities via embedding similarity and keyword rules, then a rubric scorer produces five dimension scores before the LLM generates bullet rewrites filtered for bias.",
    architectureDiagram: archDiagram(
      `flowchart TD
    A[Resume PDF] --> B[Section Parser]
    C[Job Description] --> D[Requirement Extractor]
    B --> E[Skill Extractor]
    D --> F[Alignment Engine]
    E --> F
    F --> G[Rubric Scorer]
    G --> H[LLM Rewrite Suggestions]
    H --> I[Bias Filter]
    I --> J[Report UI]`,
      `class A,C grp1
    class B,D,E grp2
    class F,G grp3
    class H,I,J grp4`
    ),
    timeBreakdown: [
      {
        phase: "Parser & upload API",
        hours: 2,
        tasks: [
          "PDF/DOCX text extraction with section detection",
          "FastAPI upload endpoint with file validation",
          "Store parsed sections in session state",
        ],
      },
      {
        phase: "JD alignment & scoring",
        hours: 2,
        tasks: [
          "Extract requirements from pasted JD text",
          "Compute skill-match scores across 5 rubric dimensions",
          "Return structured JSON with per-dimension explanations",
        ],
      },
      {
        phase: "LLM feedback generation",
        hours: 2,
        tasks: [
          "Prompt for bullet rewrites with quantified impact",
          "Apply bias filter stripping protected-attribute signals",
          "Add audit log for recruiter review",
        ],
      },
      {
        phase: "React UI & polish",
        hours: 2,
        tasks: [
          "Heatmap UI for skill match per dimension",
          "Side-by-side original vs suggested bullets",
          "Error handling for malformed PDFs",
        ],
      },
    ],
    expectedOutcome:
      "Demo uploading a resume PDF and a job description, then show a scored report with ATS-style heatmap, gap analysis, and 3–5 rewritten bullet suggestions — all with explainable per-dimension scores.",
    slides: [
      slide("Project Goal", {
        subtitle: "Score resumes against job descriptions with explainable, bias-aware feedback.",
        bullets: [
          "Parse PDF resumes into structured sections",
          "Align skills to JD requirements with rubric scoring",
          "Generate actionable bullet rewrites",
          "Deliver results via a clean React dashboard",
        ],
      }),
      slide("Setup & Prerequisites", {
        bullets: [
          "Python 3.11+, FastAPI, PyMuPDF, OpenAI SDK",
          "OpenAI API key with JSON structured output",
          "React app with file upload component",
          "3 sample resumes + 2 JDs for calibration",
          "No ML training — pure LLM + rules pipeline",
        ],
      }),
      slide("Architecture", {
        subtitle: "Dual ingestion paths converge at an alignment engine before scoring.",
        diagram: archDiagram(
          `flowchart TD
    A[Resume PDF] --> B[Section Parser]
    C[Job Description] --> D[Requirement Extractor]
    B --> E[Skill Extractor]
    D --> F[Alignment Engine]
    E --> F
    F --> G[Rubric Scorer]
    G --> H[Report UI]`,
          `class A,C grp1
    class B,D,E grp2
    class F,G grp3
    class H grp4`
        ),
        caption: "Parse → Align → Score → Suggest",
      }),
      slide("Build Phases (8 hours)", {
        bullets: [
          "2h — PDF parser + FastAPI upload endpoints",
          "2h — JD requirement extraction + rubric scorer",
          "2h — LLM rewrite suggestions + bias filter",
          "2h — React heatmap UI + error handling",
        ],
      }),
      slide("Expected Result", {
        bullets: [
          "Upload resume + paste JD → get scores in <30s",
          "5-dimension rubric with cited resume lines",
          "3–5 rewritten bullets with quantified impact",
          "Bias filter blocks demographic-based scoring",
        ],
      }),
      slide("Resume & Interview Tips", {
        bullets: [
          "Highlight structured JSON output and rubric design",
          "Mention bias mitigation and audit logging",
          "Be ready to explain why section-aware parsing beats fixed chunks",
          "Quantify: 'calibrated on 20 resume/JD pairs'",
        ],
      }),
    ],
    interviewQuestions: [
      {
        question: "How do you mitigate hiring bias in resume AI?",
        answer:
          "Exclude protected-attribute features from scoring, use transparent rubric dimensions tied to job requirements, audit score distributions on synthetic test sets, and keep humans in the loop for final hiring decisions.",
      },
      {
        question: "Why use structured JSON output instead of free-text scores?",
        answer:
          "Structured output enables consistent UI rendering, downstream ATS integration, and automated evaluation against gold rubric labels — free text is harder to parse and compare across sessions.",
      },
      {
        question: "How would you handle a PDF that fails to parse?",
        answer:
          "Fall back to OCR for scanned PDFs, return a clear error with supported formats, and allow plain-text paste as an alternative input path.",
      },
    ],
  }),

  createProject({
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
    prerequisites: [
      "Python 3.11+ with pip or uv",
      "OpenAI API key for embeddings and chat",
      "Basic understanding of RAG (retrieval-augmented generation)",
      "Familiarity with LangChain document loaders and vector stores",
      "Streamlit basics for rapid UI prototyping",
    ],
    setupSteps: [
      "Install langchain, chromadb, streamlit, and pypdf",
      "Create a Streamlit app with PDF file uploader",
      "Configure ChromaDB persistent directory for local storage",
      "Set embedding model (text-embedding-3-small) and chat model",
      "Add a sample PDF (e.g., course syllabus) for smoke testing",
      "Run streamlit run app.py and verify Q&A works",
    ],
    architectureExplanation:
      "Uploaded PDFs are split into overlapping chunks, embedded, and stored in ChromaDB. User questions trigger a similarity search to retrieve top-k chunks, which are injected into the LLM prompt as context for a grounded, streaming answer.",
    architectureDiagram: archDiagram(
      `flowchart LR
    A[PDF Upload] --> B[Text Extractor]
    B --> C[Chunker]
    C --> D[Embedder]
    D --> E[(ChromaDB)]
    F[User Question] --> G[Query Embedder]
    G --> H[Similarity Search]
    E --> H
    H --> I[LLM with Context]
    I --> J[Streamed Answer]`,
      `class A,F grp1
    class B,C grp2
    class D,G,H grp3
    class E,I,J grp4`
    ),
    timeBreakdown: [
      {
        phase: "Upload & extraction",
        hours: 1,
        tasks: [
          "Streamlit file uploader with multi-PDF support",
          "PyPDF text extraction with page metadata",
        ],
      },
      {
        phase: "Chunking & embedding",
        hours: 2,
        tasks: [
          "RecursiveCharacterTextSplitter with 500-token chunks, 50 overlap",
          "Batch embed and persist to ChromaDB collection",
          "Re-index on new upload without duplicating",
        ],
      },
      {
        phase: "RAG retrieval pipeline",
        hours: 2,
        tasks: [
          "Top-k retrieval with similarity threshold",
          "Prompt template with source citations",
          "Streaming response via LangChain callback",
        ],
      },
      {
        phase: "UI polish",
        hours: 1,
        tasks: [
          "Chat history sidebar",
          "Show retrieved chunk previews",
          "Loading spinner during indexing",
        ],
      },
    ],
    expectedOutcome:
      "Upload a 20-page PDF, ask 3 questions about its contents, and receive streaming answers with cited page numbers — demonstrating grounded retrieval with no hallucinated facts outside the document.",
    slides: [
      slide("Project Goal", {
        subtitle: "The canonical RAG project — chat with any PDF using semantic search.",
        bullets: [
          "Upload PDFs and index them locally",
          "Chunk, embed, and store in ChromaDB",
          "Answer questions with retrieved context",
          "Stream responses in a Streamlit chat UI",
        ],
      }),
      slide("Setup & Prerequisites", {
        bullets: [
          "Python 3.11+, LangChain, ChromaDB, Streamlit",
          "OpenAI API key for embeddings + chat",
          "Understand chunk size vs retrieval quality tradeoff",
          "One sample PDF for testing",
        ],
      }),
      slide("Architecture", {
        subtitle: "Ingest once, query many — classic retrieval-augmented generation.",
        diagram: archDiagram(
          `flowchart LR
    A[PDF] --> B[Chunker]
    B --> C[Embedder]
    C --> D[(ChromaDB)]
    E[Question] --> F[Search]
    D --> F
    F --> G[LLM Answer]`,
          `class A,E grp1
    class B grp2
    class C,F grp3
    class D,G grp4`
        ),
        caption: "Index → Retrieve → Generate",
      }),
      slide("Build Phases (6 hours)", {
        bullets: [
          "1h — PDF upload and text extraction",
          "2h — Chunking pipeline + ChromaDB persistence",
          "2h — RAG chain with streaming and citations",
          "1h — Streamlit chat UI with history",
        ],
      }),
      slide("Expected Result", {
        bullets: [
          "Index a PDF in under 15 seconds",
          "Accurate answers citing page numbers",
          "Streaming chat with conversation memory",
          "Graceful 'I don't know' when context is insufficient",
        ],
      }),
      slide("Resume & Production Tips", {
        bullets: [
          "Mention chunk size tuning and overlap strategy",
          "Note similarity threshold to reduce irrelevant retrieval",
          "Production upgrade: swap ChromaDB for Pinecone + add eval set",
          "Interview talking point: chunking improved relevance by 40%",
        ],
      }),
    ],
    interviewQuestions: [
      {
        question: "How do you choose chunk size for PDF RAG?",
        answer:
          "Balance context window limits with retrieval precision — 300–800 tokens with 10–20% overlap works for most docs. Evaluate on a golden Q&A set and tune until faithfulness scores plateau.",
      },
      {
        question: "What happens when retrieval returns irrelevant chunks?",
        answer:
          "Add a similarity score threshold, increase top-k then re-rank, or use hybrid search (BM25 + vectors). Prompt the LLM to say 'not found in document' when context doesn't support an answer.",
      },
    ],
  }),

  createProject({
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
    prerequisites: [
      "Completed a basic RAG project (PDF chat or equivalent)",
      "Pinecone account and API key",
      "Understanding of BM25 vs dense retrieval tradeoffs",
      "FastAPI + React full-stack experience",
      "Familiarity with RAG evaluation metrics (precision, faithfulness)",
    ],
    setupSteps: [
      "Provision Pinecone index with 1536-dim vectors and metadata filters",
      "Set up FastAPI backend with document ingestion worker",
      "Install rank_bm25, sentence-transformers for cross-encoder reranking",
      "Scaffold React chat UI with citation sidebar",
      "Prepare 50+ enterprise docs (wikis, policies) for ingestion",
      "Create a golden eval set of 30 Q&A pairs with expected citations",
    ],
    architectureExplanation:
      "Documents are ingested with metadata (source, ACL, timestamp) into Pinecone while a parallel BM25 index enables keyword recall. Queries run hybrid retrieval, cross-encoder re-ranking narrows to top passages, and the LLM generates answers with mandatory inline citations validated post-generation.",
    architectureDiagram: archDiagram(
      `flowchart TD
    A[Document Ingestion] --> B[Chunk + Metadata]
    B --> C[(Pinecone Vectors)]
    B --> D[BM25 Index]
    E[User Query] --> F[Hybrid Retriever]
    C --> F
    D --> F
    F --> G[Cross-Encoder Reranker]
    G --> H[LLM Generation]
    H --> I[Citation Validator]
    I --> J[React Chat UI]
    K[Eval Dashboard] --> F`,
      `class A,E grp1
    class B,D grp2
    class C,F,G grp3
    class H,I,J,K grp4`
    ),
    timeBreakdown: [
      {
        phase: "Ingestion pipeline",
        hours: 4,
        tasks: [
          "Async worker for PDF/Markdown/HTML parsing",
          "Chunk with metadata: source, page, ACL tags",
          "Dual-write to Pinecone and BM25 index",
        ],
      },
      {
        phase: "Hybrid search",
        hours: 5,
        tasks: [
          "Reciprocal rank fusion of BM25 + vector results",
          "Metadata filters for tenant and document type",
          "Configurable top-k and score thresholds",
        ],
      },
      {
        phase: "Re-ranking & citations",
        hours: 5,
        tasks: [
          "Cross-encoder rerank top-20 to top-5",
          "Prompt with citation format [source:page]",
          "Post-validator rejects uncited claims",
        ],
      },
      {
        phase: "Evaluation dashboard",
        hours: 4,
        tasks: [
          "Run golden Q&A set nightly",
          "Track precision@5, faithfulness, latency",
          "Regression alerts on metric drops",
        ],
      },
      {
        phase: "API & React UI",
        hours: 2,
        tasks: [
          "Streaming SSE chat endpoint",
          "Citation sidebar with source previews",
          "Admin panel for re-indexing",
        ],
      },
    ],
    expectedOutcome:
      "Demo querying a 10K-chunk knowledge base with hybrid search, showing reranked citations in the answer sidebar, and an eval dashboard reporting precision@5 above 0.8 on your golden set.",
    slides: [
      slide("Project Goal", {
        subtitle: "Enterprise RAG with hybrid search, reranking, and measurable quality.",
        bullets: [
          "Ingest 10K+ documents with ACL metadata",
          "Hybrid BM25 + vector retrieval with reranking",
          "Citation-enforced answers",
          "Evaluation dashboard with regression tracking",
        ],
      }),
      slide("Setup & Prerequisites", {
        bullets: [
          "Pinecone index + OpenAI embeddings",
          "50+ enterprise docs and 30 golden Q&A pairs",
          "FastAPI backend + React frontend",
          "sentence-transformers for cross-encoder reranker",
          "Prior RAG experience recommended",
        ],
      }),
      slide("Architecture", {
        subtitle: "Hybrid retrieval → rerank → generate with citation validation.",
        diagram: archDiagram(
          `flowchart TD
    A[Docs] --> B[Chunk + Embed]
    B --> C[(Pinecone)]
    B --> D[BM25]
    E[Query] --> F[Hybrid Search]
    C --> F
    D --> F
    F --> G[Reranker]
    G --> H[LLM + Citations]`,
          `class A,E grp1
    class B,D grp2
    class C,F,G grp3
    class H grp4`
        ),
        caption: "Retrieve broadly, rerank precisely, cite everything",
      }),
      slide("Build Phases (20 hours)", {
        bullets: [
          "4h — Async ingestion with dual Pinecone + BM25 write",
          "5h — Hybrid search with RRF fusion and ACL filters",
          "5h — Cross-encoder reranking + citation validator",
          "4h — Eval dashboard with golden set runner",
          "2h — Streaming React chat UI",
        ],
      }),
      slide("Expected Result", {
        bullets: [
          "Sub-3s answers on 10K+ chunk corpus",
          "Every claim linked to source document + page",
          "Eval dashboard showing precision@5 ≥ 0.8",
          "Regression alert when faithfulness drops 5%",
        ],
      }),
      slide("Resume & Production Tips", {
        bullets: [
          "Quantify: '35% precision improvement from reranking'",
          "Discuss ACL-aware retrieval for multi-team KBs",
          "Production: add caching, rate limits, and audit logs",
          "Interview: explain RRF vs weighted hybrid fusion",
        ],
      }),
    ],
    interviewQuestions: [
      {
        question: "Why use hybrid search instead of vectors alone?",
        answer:
          "Vectors miss exact keyword matches (SKUs, error codes, acronyms) while BM25 misses semantic paraphrases. Reciprocal rank fusion combines both recall profiles for enterprise docs with mixed content types.",
      },
      {
        question: "How do you evaluate a RAG chatbot in production?",
        answer:
          "Maintain a golden Q&A set with expected citations, track precision@k, answer faithfulness (LLM-judge or human), latency p95, and citation accuracy. Run nightly regression and alert on drops.",
      },
      {
        question: "What does the cross-encoder reranker add over bi-encoder retrieval?",
        answer:
          "Bi-encoders embed query and doc separately (fast but shallow). Cross-encoders score query-doc pairs jointly (slower but more accurate), ideal for reranking top-20 candidates before LLM generation.",
      },
    ],
  }),

  createProject({
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
    prerequisites: [
      "Strong Python and Git fundamentals",
      "LangGraph state machines and checkpointing",
      "Docker for sandboxed test execution",
      "Understanding of ReAct / tool-calling agent patterns",
      "Experience reading and modifying medium-sized codebases",
    ],
    setupSteps: [
      "Clone a small open-source Python repo (e.g., FastAPI tutorial app)",
      "Scaffold LangGraph orchestrator with AgentState TypedDict",
      "Build tools: read_file, search_repo, apply_patch, run_terminal",
      "Create Docker sandbox image with pytest and ruff pre-installed",
      "Configure OpenAI function calling for planner and coder nodes",
      "Seed 5 small bug-fix tasks from SWE-bench-lite for eval",
    ],
    architectureExplanation:
      "A LangGraph orchestrator receives tasks via CLI or webhook, builds a repo map, and routes through planner → coder → sandbox test nodes. Failed tests trigger a debugger node that reads stderr and retries with capped attempts before opening a PR for human review.",
    architectureDiagram: archDiagram(
      `flowchart TD
    A[Task / GitHub Issue] --> B[Repo Indexer]
    B --> C[Planner Agent]
    C --> D{Coder Agent}
    D --> E[Apply Patch]
    E --> F[Docker Sandbox]
    F -->|Fail| G[Debugger Agent]
    G --> D
    F -->|Pass| H[Reviewer Node]
    H --> I[Open Pull Request]
    I --> J[Human Merge]`,
      `class A,J grp1
    class B,C grp2
    class D,E,F,G grp3
    class H,I grp4`
    ),
    timeBreakdown: [
      {
        phase: "Repo indexer & tools",
        hours: 8,
        tasks: [
          "Tree walk with file size and language detection",
          "read_file, search_repo (ripgrep), list_dir tools",
          "Path allowlist and .env blocklist guardrails",
        ],
      },
      {
        phase: "Planner agent",
        hours: 8,
        tasks: [
          "Decompose task into ordered file-level steps",
          "Human approval gate for plans >5 files",
          "Persist plan in LangGraph checkpoint",
        ],
      },
      {
        phase: "Coder & patch apply",
        hours: 10,
        tasks: [
          "Unified diff generation via apply_patch tool",
          "Max 20 files per task enforcement",
          "Structured output for patch format validation",
        ],
      },
      {
        phase: "Docker sandbox & tests",
        hours: 8,
        tasks: [
          "Clone repo, apply diff, run pytest + ruff",
          "Capture stderr for debugger node input",
          "Max 3 retry loops on test failure",
        ],
      },
      {
        phase: "PR integration & eval",
        hours: 6,
        tasks: [
          "GitHub API: create branch, commit, open PR",
          "LangSmith traces for every agent step",
          "Eval on 10 SWE-bench-lite tasks, track pass rate",
        ],
      },
    ],
    expectedOutcome:
      "Give the agent a GitHub issue like 'Add rate limiting to POST /login', watch it plan, patch, pass tests in Docker, and open a PR with a summary — demonstrating the full plan→code→test→review loop.",
    slides: [
      slide("Project Goal", {
        subtitle: "Autonomous agent that plans, codes, tests, and opens PRs.",
        bullets: [
          "Explore codebases with read/search tools",
          "Multi-step planning with human approval",
          "Apply patches and run tests in Docker sandbox",
          "Self-correct on test failures, then open PR",
        ],
      }),
      slide("Setup & Prerequisites", {
        bullets: [
          "LangGraph + OpenAI function calling",
          "Docker for isolated pytest execution",
          "GitHub token for PR creation",
          "Small Python repo with existing test suite",
          "5–10 bug-fix tasks for evaluation",
        ],
      }),
      slide("Architecture", {
        subtitle: "Plan → Code → Test → PR with self-correction on failure.",
        diagram: archDiagram(
          `flowchart TD
    A[Issue] --> B[Planner]
    B --> C[Coder]
    C --> D[Sandbox Tests]
    D -->|Fail| E[Debugger]
    E --> C
    D -->|Pass| F[Open PR]`,
          `class A grp1
    class B grp2
    class C,D,E grp3
    class F grp4`
        ),
        caption: "Sandbox is mandatory — never trust LLM claims of success",
      }),
      slide("Build Phases (40 hours)", {
        bullets: [
          "8h — Repo indexer + file I/O tools with guardrails",
          "8h — Planner agent with human approval gate",
          "10h — Coder with unified diff apply_patch",
          "8h — Docker sandbox: pytest + ruff + retry loop",
          "6h — GitHub PR integration + SWE-bench eval",
        ],
      }),
      slide("Expected Result", {
        bullets: [
          "Agent fixes 5+ bugs from eval set autonomously",
          "All patches pass pytest before PR is opened",
          "LangSmith trace shows every tool call",
          "Human reviews and merges PR",
        ],
      }),
      slide("Resume & Production Tips", {
        bullets: [
          "Emphasize guardrails: allowlist, max files, no .env reads",
          "Quote eval pass rate on SWE-bench-lite subset",
          "Production: add cost caps, concurrency limits, audit trail",
          "Interview: explain why sandbox beats trusting LLM output",
        ],
      }),
    ],
    interviewQuestions: [
      {
        question: "How do you prevent an AI coding agent from editing the wrong files?",
        answer:
          "Repo map + path allowlist, planner must cite target paths, max files per task, diff review before apply, and human approval on large changesets.",
      },
      {
        question: "What happens when tests fail after a patch?",
        answer:
          "Route to a debugger node with stderr and failed test names. Retry with capped attempts (e.g., 3). Escalate to human if still failing.",
      },
      {
        question: "Why sandbox tests instead of trusting the LLM?",
        answer:
          "LLMs hallucinate success. Only executed tests prove correctness. Sandbox also isolates destructive commands and network access.",
      },
    ],
  }),

  createProject({
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
    prerequisites: [
      "TypeScript and Node.js 20+",
      "GitHub personal access token with repo scope",
      "Understanding of MCP (Model Context Protocol) tool schema",
      "@modelcontextprotocol/sdk basics",
      "Familiarity with GitHub REST API endpoints",
    ],
    setupSteps: [
      "Initialize TypeScript project with @modelcontextprotocol/sdk",
      "Create GitHub PAT with repo, read:org, and read:user scopes",
      "Scaffold MCP server with stdio transport",
      "Implement Octokit client with token auth and rate-limit headers",
      "Register tools: list_repos, get_file, search_code, create_issue",
      "Test with Cursor or Claude Desktop MCP config",
    ],
    architectureExplanation:
      "The MCP server registers GitHub API operations as typed tools that AI clients discover at connection time. An Octokit wrapper handles authentication, pagination, and rate-limit backoff, while input validation ensures agents cannot access repos outside the configured allowlist.",
    architectureDiagram: archDiagram(
      `flowchart LR
    A[AI Client Cursor/Claude] --> B[MCP Server stdio]
    B --> C[Tool Router]
    C --> D[Repo Browser]
    C --> E[Issue Manager]
    C --> F[PR Reviewer]
    C --> G[Code Search]
    D --> H[GitHub REST API]
    E --> H
    F --> H
    G --> H
    I[Auth + Rate Limiter] --> H`,
      `class A grp1
    class B,C grp2
    class D,E,F,G grp3
    class H,I grp4`
    ),
    timeBreakdown: [
      {
        phase: "MCP scaffold & auth",
        hours: 3,
        tasks: [
          "TypeScript MCP server with stdio transport",
          "Octokit client with PAT from env var",
          "Rate-limit detection and exponential backoff",
        ],
      },
      {
        phase: "Repo & search tools",
        hours: 3,
        tasks: [
          "list_repos, get_file_contents, list_branches",
          "search_code with query syntax validation",
          "Repo allowlist enforcement",
        ],
      },
      {
        phase: "Issue & PR tools",
        hours: 3,
        tasks: [
          "create_issue, list_issues, add_comment",
          "get_pull_request, list_pr_files, create_review_comment",
          "Structured error messages for 404/403",
        ],
      },
      {
        phase: "Testing & packaging",
        hours: 3,
        tasks: [
          "Integration tests with mocked GitHub API",
          "README with Cursor MCP config JSON",
          "npm publish or local npx entry point",
        ],
      },
    ],
    expectedOutcome:
      "Connect the MCP server to Cursor, ask the agent to 'list open issues in my repo and summarize the top 3', and watch it call your tools to fetch real GitHub data and respond with accurate issue summaries.",
    slides: [
      slide("Project Goal", {
        subtitle: "Expose GitHub as agent-callable tools via the Model Context Protocol.",
        bullets: [
          "Build MCP server in TypeScript",
          "Register repo, issue, PR, and search tools",
          "Secure auth with PAT and repo allowlist",
          "Use from Cursor or Claude Desktop",
        ],
      }),
      slide("Setup & Prerequisites", {
        bullets: [
          "Node.js 20+, TypeScript, @modelcontextprotocol/sdk",
          "GitHub PAT with repo scope",
          "Understand MCP tool schema (name, description, inputSchema)",
          "Octokit for typed GitHub API calls",
        ],
      }),
      slide("Architecture", {
        subtitle: "MCP server translates agent tool calls into GitHub REST requests.",
        diagram: archDiagram(
          `flowchart LR
    A[AI Client] --> B[MCP Server]
    B --> C[Tool Router]
    C --> D[Octokit Client]
    D --> E[GitHub API]`,
          `class A grp1
    class B,C grp2
    class D grp3
    class E grp4`
        ),
        caption: "Agents discover tools at connect time via MCP handshake",
      }),
      slide("Build Phases (12 hours)", {
        bullets: [
          "3h — MCP scaffold, Octokit auth, rate limiting",
          "3h — Repo browsing and code search tools",
          "3h — Issue and PR management tools",
          "3h — Integration tests + Cursor config docs",
        ],
      }),
      slide("Expected Result", {
        bullets: [
          "Agent lists repos and reads file contents via tools",
          "Creates issues and PR review comments",
          "Rate limits handled gracefully with retry",
          "Works in Cursor MCP panel out of the box",
        ],
      }),
      slide("Resume & Production Tips", {
        bullets: [
          "Highlight MCP as the emerging agent-tool standard",
          "Mention allowlist, rate limiting, and scoped PATs",
          "Extend: add GraphQL for faster bulk queries",
          "Interview: explain MCP vs custom function calling",
        ],
      }),
    ],
    interviewQuestions: [
      {
        question: "What is MCP and why build a GitHub MCP server?",
        answer:
          "Model Context Protocol standardizes how AI clients discover and invoke external tools. A GitHub MCP server lets any MCP-compatible agent browse repos, manage issues, and review PRs without custom integrations per client.",
      },
      {
        question: "How do you handle GitHub API rate limits in an MCP server?",
        answer:
          "Read X-RateLimit-Remaining headers, implement exponential backoff, cache read-heavy responses, and use conditional requests (ETag). Surface clear errors to the agent when limits are hit.",
      },
      {
        question: "How do you secure an MCP server with broad repo access?",
        answer:
          "Scope PAT to minimum permissions, enforce repo allowlist in tool handlers, never log tokens, run server locally (stdio), and validate all agent inputs before forwarding to GitHub API.",
      },
    ],
  }),

  createProject({
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
    prerequisites: [
      "Production Python service experience (FastAPI or similar)",
      "LangSmith or OpenTelemetry tracing fundamentals",
      "Prometheus + Grafana dashboard basics",
      "Kubernetes deployment with Helm",
      "Understanding of LLM cost drivers (tokens, model tier)",
    ],
    setupSteps: [
      "Deploy a sample LLM microservice with LangSmith tracing enabled",
      "Install Prometheus operator and Grafana in a local K8s cluster (minikube)",
      "Create custom metrics: token_count, latency_histogram, cost_usd",
      "Set up prompt registry with versioned templates in Postgres",
      "Configure A/B test router splitting traffic between prompt versions",
      "Build Grafana dashboards for cost, latency, and eval scores",
    ],
    architectureExplanation:
      "LLM services emit traces and custom metrics to LangSmith and Prometheus. A prompt registry stores versioned templates with rollback capability, while an A/B router splits traffic to compare versions. Grafana dashboards aggregate cost, latency, and eval scores, and HPA scales pods on request queue depth.",
    architectureDiagram: archDiagram(
      `flowchart TD
    A[LLM Microservices] --> B[LangSmith Tracing]
    A --> C[Prometheus Metrics]
    D[Prompt Registry] --> A
    E[A/B Router] --> A
    C --> F[Grafana Dashboards]
    B --> G[Eval Pipeline]
    G --> F
    H[Kubernetes HPA] --> A
    I[Cost Aggregator] --> F`,
      `class A grp1
    class B,C grp2
    class D,E grp3
    class F,G,H,I grp4`
    ),
    timeBreakdown: [
      {
        phase: "Distributed tracing",
        hours: 12,
        tasks: [
          "Instrument all LLM calls with LangSmith spans",
          "Propagate trace_id across microservices",
          "Trace viewer integration in admin UI",
        ],
      },
      {
        phase: "Prompt versioning",
        hours: 10,
        tasks: [
          "Postgres-backed prompt registry with semver tags",
          "Hot-reload prompts without redeploy",
          "Diff view and one-click rollback",
        ],
      },
      {
        phase: "Cost & eval dashboards",
        hours: 12,
        tasks: [
          "Custom Prometheus metrics: tokens, cost, latency p95",
          "Grafana panels for per-model cost breakdown",
          "Nightly eval job writing scores to Prometheus",
        ],
      },
      {
        phase: "A/B testing framework",
        hours: 10,
        tasks: [
          "Traffic splitter by user_id hash",
          "Statistical significance calculator for eval metrics",
          "Auto-promote winner after threshold",
        ],
      },
      {
        phase: "K8s deployment & auto-scaling",
        hours: 16,
        tasks: [
          "Helm charts for all platform components",
          "HPA on CPU and custom queue_depth metric",
          "Alerting rules for cost spikes and latency SLO breaches",
        ],
      },
    ],
    expectedOutcome:
      "Show a live Grafana dashboard tracking 1M+ monthly LLM calls with per-model cost breakdown, p95 latency, eval faithfulness scores, and an active A/B test comparing two prompt versions with statistical significance.",
    slides: [
      slide("Project Goal", {
        subtitle: "Production observability platform for LLM applications at scale.",
        bullets: [
          "Distributed tracing across all LLM calls",
          "Versioned prompt registry with rollback",
          "Cost, latency, and eval dashboards",
          "A/B testing and Kubernetes auto-scaling",
        ],
      }),
      slide("Setup & Prerequisites", {
        bullets: [
          "LangSmith account + Prometheus/Grafana stack",
          "Local K8s cluster (minikube or kind)",
          "Sample LLM microservice to instrument",
          "Postgres for prompt registry",
          "Understanding of token-based billing",
        ],
      }),
      slide("Architecture", {
        subtitle: "Instrument → aggregate → visualize → scale.",
        diagram: archDiagram(
          `flowchart TD
    A[LLM Services] --> B[Tracing]
    A --> C[Metrics]
    D[Prompt Registry] --> A
    C --> E[Grafana]
    B --> E
    F[HPA] --> A`,
          `class A grp1
    class B,C grp2
    class D grp3
    class E,F grp4`
        ),
        caption: "Every LLM call is traced, metered, and evaluable",
      }),
      slide("Build Phases (60 hours)", {
        bullets: [
          "12h — LangSmith tracing with cross-service propagation",
          "10h — Prompt registry with semver and hot-reload",
          "12h — Prometheus metrics + Grafana cost/latency panels",
          "10h — A/B router with significance testing",
          "16h — Helm deploy, HPA, and alerting rules",
        ],
      }),
      slide("Expected Result", {
        bullets: [
          "Grafana shows real-time cost per model and endpoint",
          "Prompt rollback in <1 minute without redeploy",
          "A/B test comparing v1 vs v2 with p-value",
          "HPA scales pods on queue depth automatically",
        ],
      }),
      slide("Resume & Production Tips", {
        bullets: [
          "Quantify: '45% cost reduction via caching + routing'",
          "Mention SLOs: p95 latency <2s, 99.9% uptime",
          "Discuss alert fatigue — only page on SLO breaches",
          "Interview: trace_id propagation in microservices",
        ],
      }),
    ],
    interviewQuestions: [
      {
        question: "How do you monitor LLM costs in production?",
        answer:
          "Emit per-request token counts and model ID to Prometheus, aggregate cost_usd by endpoint and tenant, set budget alerts, and use caching/routing to reduce spend on repeated or simple queries.",
      },
      {
        question: "Why version prompts separately from code?",
        answer:
          "Prompts change far more often than application logic. A registry enables hot-reload, A/B testing, rollback without redeploy, and audit trails for compliance.",
      },
      {
        question: "What metrics matter most for LLM SLOs?",
        answer:
          "Latency p95/p99, error rate, token cost per request, eval faithfulness score, and cache hit rate. Alert on SLO breaches, not every anomaly.",
      },
    ],
  }),

  createProject({
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
    prerequisites: [
      "RAG chatbot experience with tool calling",
      "LangGraph or CrewAI multi-agent patterns",
      "PostgreSQL for conversation and ticket storage",
      "Redis for session state and rate limiting",
      "Understanding of customer support workflows and SLAs",
    ],
    setupSteps: [
      "Set up PostgreSQL schema for tickets, conversations, and KB articles",
      "Ingest 30 support KB articles with tenant ACL metadata",
      "Build mock order API returning order status and refund eligibility",
      "Configure LangGraph router for intent classification",
      "Create policy engine JSON for refund thresholds",
      "Wire Zendesk-style webhook simulator for inbound messages",
    ],
    architectureExplanation:
      "An intent and sentiment router classifies each message and dispatches to specialized agents: a KB RAG agent for FAQs, an order lookup agent with API tools, and a refund agent gated by a policy engine. Negative sentiment or policy violations trigger human escalation with full conversation context.",
    architectureDiagram: archDiagram(
      `flowchart TD
    A[Customer Message] --> B[Intent + Sentiment Router]
    B -->|Angry/Legal| H[Human Inbox]
    B -->|FAQ| C[KB RAG Agent]
    B -->|Order| D[Order Lookup Tool]
    B -->|Refund| E[Policy Engine]
    C --> F[Response Composer]
    D --> F
    E -->|Under limit| G[Refund Tool]
    E -->|Over limit| H
    G --> F
    F --> I[Reply + Trace Log]
    J[(PostgreSQL Memory)] --> B`,
      `class A grp1
    class B grp2
    class C,D,E,G grp3
    class F,H,I,J grp4`
    ),
    timeBreakdown: [
      {
        phase: "Intent router & KB RAG",
        hours: 12,
        tasks: [
          "Intent classifier: order_status, refund, FAQ, angry",
          "RAG over 30 KB articles with ACL filters",
          "Sentiment score threshold for escalation",
        ],
      },
      {
        phase: "Order/refund tools & policy",
        hours: 12,
        tasks: [
          "lookup_order(user_id) and create_refund(order_id) tools",
          "Policy engine: auto-refund under $50, escalate above",
          "Auth check before any order data access",
        ],
      },
      {
        phase: "Multi-agent orchestration",
        hours: 12,
        tasks: [
          "LangGraph state machine for agent handoffs",
          "CrewAI specialist agents for complex multi-step tickets",
          "Shared conversation memory in PostgreSQL",
        ],
      },
      {
        phase: "Escalation & memory",
        hours: 8,
        tasks: [
          "Human inbox UI with full agent trace",
          "Redis session cache for active conversations",
          "Escalation includes sentiment log and tool history",
        ],
      },
      {
        phase: "Eval harness & dashboards",
        hours: 6,
        tasks: [
          "500-ticket eval set with resolution labels",
          "Track resolution rate, escalation rate, hallucination",
          "Datadog-style dashboard for ops team",
        ],
      },
    ],
    expectedOutcome:
      "Simulate a support conversation: customer asks order status (agent looks it up), requests a refund (policy auto-approves or escalates), then gets angry (routed to human inbox with full context and trace log).",
    slides: [
      slide("Project Goal", {
        subtitle: "Multi-agent support with RAG, tools, policy gates, and escalation.",
        bullets: [
          "Route intents to specialized agents",
          "Answer FAQs from knowledge base with citations",
          "Look up orders and process refunds within policy",
          "Escalate angry or high-value cases to humans",
        ],
      }),
      slide("Setup & Prerequisites", {
        bullets: [
          "PostgreSQL + Redis + LangGraph/CrewAI",
          "30 KB articles and mock order API",
          "Policy rules JSON for refund thresholds",
          "Webhook simulator for inbound tickets",
          "500-ticket eval set (can be synthetic)",
        ],
      }),
      slide("Architecture", {
        subtitle: "Router dispatches to RAG, tools, or human based on intent and sentiment.",
        diagram: archDiagram(
          `flowchart TD
    A[Message] --> B[Router]
    B -->|FAQ| C[RAG Agent]
    B -->|Order| D[Tools]
    B -->|Angry| E[Human]
    C --> F[Reply]
    D --> F`,
          `class A grp1
    class B grp2
    class C,D grp3
    class E,F grp4`
        ),
        caption: "Never invent policy — retrieve or escalate",
      }),
      slide("Build Phases (50 hours)", {
        bullets: [
          "12h — Intent router + KB RAG with ACL",
          "12h — Order/refund tools + policy engine",
          "12h — Multi-agent orchestration with memory",
          "8h — Human escalation inbox + Redis sessions",
          "6h — Eval harness on 500 tickets",
        ],
      }),
      slide("Expected Result", {
        bullets: [
          "80%+ resolution on tier-1 FAQ without escalation",
          "Refunds auto-processed under policy threshold",
          "Angry customers routed to human in <2 turns",
          "Every tool call logged with trace_id",
        ],
      }),
      slide("Resume & Production Tips", {
        bullets: [
          "Quantify: '60% faster ticket resolution'",
          "Emphasize policy engine — never hallucinate refund rules",
          "Production: add PII redaction and SOC2 audit logs",
          "Interview: when to escalate vs auto-reply",
        ],
      }),
    ],
    interviewQuestions: [
      {
        question: "When must you escalate instead of auto-replying?",
        answer:
          "High negative sentiment, legal keywords, refund over threshold, low retrieval confidence, repeated failed resolution attempts, or any action the policy engine cannot authorize.",
      },
      {
        question: "How do you evaluate a support agent?",
        answer:
          "Measure resolution rate, escalation appropriateness, KB citation accuracy, tool call correctness, and CSAT proxy on a labeled ticket set. Track hallucinated policy claims as a hard failure.",
      },
      {
        question: "Why use multi-agent instead of a single LLM?",
        answer:
          "Specialized agents with focused tools and prompts reduce hallucination, simplify eval per capability, and allow independent scaling and policy enforcement per domain (orders vs refunds vs FAQs).",
      },
    ],
  }),

  createProject({
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
    prerequisites: [
      "OpenAI Realtime API access and WebSocket fundamentals",
      "React with audio recording (MediaRecorder API)",
      "Understanding of speech-to-text and text-to-speech pipelines",
      "Experience designing evaluation rubrics",
      "Basic WebSocket proxy patterns in Python (FastAPI)",
    ],
    setupSteps: [
      "Create FastAPI WebSocket proxy to OpenAI Realtime API",
      "Build React UI with microphone capture and audio playback",
      "Define interview rubric: clarity, structure, depth, relevance, confidence",
      "Seed 10 behavioral and 10 technical question banks by role",
      "Store session transcripts and scores in SQLite or Postgres",
      "Test end-to-end voice loop with <500ms perceived latency",
    ],
    architectureExplanation:
      "The React client streams audio via WebSocket to a FastAPI proxy that forwards to OpenAI Realtime API for low-latency speech-to-speech interaction. After each answer, a scoring service evaluates the transcript against a 5-dimension rubric and generates targeted feedback and a personalized improvement plan.",
    architectureDiagram: archDiagram(
      `flowchart LR
    A[User Microphone] --> B[React Client]
    B --> C[FastAPI WebSocket Proxy]
    C --> D[OpenAI Realtime API]
    D --> C
    C --> B
    B --> E[Audio Playback]
    C --> F[Transcript Logger]
    F --> G[Rubric Scorer]
    G --> H[Feedback Generator]
    H --> I[Coaching Plan DB]`,
      `class A,B grp1
    class C grp2
    class D,E grp3
    class F,G,H,I grp4`
    ),
    timeBreakdown: [
      {
        phase: "Voice pipeline setup",
        hours: 8,
        tasks: [
          "WebSocket proxy with auth and session management",
          "Audio codec handling (PCM 24kHz)",
          "Latency monitoring and reconnect logic",
        ],
      },
      {
        phase: "Interview flow & prompts",
        hours: 8,
        tasks: [
          "Role-based question bank (behavioral + technical)",
          "Interviewer persona system prompt",
          "Follow-up question generation based on answer depth",
        ],
      },
      {
        phase: "Scoring rubric & feedback",
        hours: 8,
        tasks: [
          "5-dimension rubric with structured JSON scores",
          "Per-answer feedback with specific improvement tips",
          "Aggregate session score and percentile tracking",
        ],
      },
      {
        phase: "React UI & session storage",
        hours: 6,
        tasks: [
          "Voice activity indicator and recording controls",
          "Live transcript display",
          "Session history with score trends",
        ],
      },
      {
        phase: "Coaching plan generator",
        hours: 5,
        tasks: [
          "Identify weakest rubric dimensions across sessions",
          "Generate weekly practice plan with targeted questions",
          "Export PDF summary for user review",
        ],
      },
    ],
    expectedOutcome:
      "Conduct a 5-question mock interview via voice, receive real-time follow-ups, then view a scored report across 5 dimensions with specific feedback and a personalized 1-week improvement plan.",
    slides: [
      slide("Project Goal", {
        subtitle: "Voice-first interview practice with real-time AI and rubric scoring.",
        bullets: [
          "Natural voice conversation via Realtime API",
          "Behavioral and technical question banks",
          "5-dimension automated scoring",
          "Personalized coaching plans across sessions",
        ],
      }),
      slide("Setup & Prerequisites", {
        bullets: [
          "OpenAI Realtime API key + WebSocket proxy",
          "React with MediaRecorder for mic capture",
          "20+ questions per target role (SWE, PM, etc.)",
          "Scoring rubric defined before building UI",
          "SQLite/Postgres for session persistence",
        ],
      }),
      slide("Architecture", {
        subtitle: "Low-latency voice loop with post-answer rubric scoring.",
        diagram: archDiagram(
          `flowchart LR
    A[Mic] --> B[React]
    B --> C[WS Proxy]
    C --> D[Realtime API]
    D --> C
    C --> B
    B --> E[Speaker]
    C --> F[Scorer]`,
          `class A,B,E grp1
    class C grp2
    class D grp3
    class F grp4`
        ),
        caption: "Speech-to-speech for natural interview flow",
      }),
      slide("Build Phases (35 hours)", {
        bullets: [
          "8h — WebSocket proxy + audio codec handling",
          "8h — Interview flow, question banks, follow-ups",
          "8h — 5-dimension rubric scorer + feedback",
          "6h — React UI with transcript and history",
          "5h — Coaching plan generator + PDF export",
        ],
      }),
      slide("Expected Result", {
        bullets: [
          "5-question voice interview with <500ms latency",
          "Per-answer scores across clarity, structure, depth",
          "Session trend chart showing improvement over time",
          "1-week coaching plan targeting weakest dimensions",
        ],
      }),
      slide("Resume & Production Tips", {
        bullets: [
          "Highlight Realtime API integration and latency tuning",
          "Discuss rubric design and calibration with human scores",
          "Production: add consent for recording, PII redaction",
          "Interview: WebSocket proxy vs direct client-to-API",
        ],
      }),
    ],
    interviewQuestions: [
      {
        question: "Why use OpenAI Realtime API instead of Whisper + TTS separately?",
        answer:
          "Realtime API provides sub-second speech-to-speech with natural turn-taking and interruption handling. Separate STT→LLM→TTS adds 2–4s latency per turn, breaking conversational flow.",
      },
      {
        question: "How do you design a fair interview scoring rubric?",
        answer:
          "Define explicit dimensions (clarity, structure, depth, relevance, confidence), use structured JSON scores, calibrate against human-labeled sessions, and avoid scoring on accent or speaking speed.",
      },
      {
        question: "How would you handle a user with a poor microphone?",
        answer:
          "Detect low audio quality via SNR metrics, prompt user to check mic settings, offer text-input fallback, and use noise suppression preprocessing before sending to the API.",
      },
    ],
  }),

  createProject({
    slug: "ai-gateway-router",
    title: "AI Gateway Router",
    description:
      "Production LLM gateway with intelligent routing, semantic caching, rate limiting, and fallback chains across multiple model providers.",
    difficulty: "production",
    phase: 8,
    techStack: ["Python", "FastAPI", "Redis", "OpenAI", "Anthropic", "Prometheus"],
    features: [
      "Multi-provider routing",
      "Semantic response caching",
      "Per-tenant rate limits",
      "Fallback chains",
      "Cost-aware model selection",
    ],
    estimatedHours: 45,
    resumePoints: [
      "Built production LLM gateway routing 500K+ requests/month across providers",
      "Reduced inference costs by 50% via semantic caching and model tiering",
    ],
    prerequisites: [
      "FastAPI production patterns (middleware, dependency injection)",
      "Redis for caching and rate-limit counters",
      "Multiple LLM provider API keys (OpenAI, Anthropic)",
      "Understanding of token-based billing and model tiers",
      "Prometheus metrics and basic load testing (locust or k6)",
    ],
    setupSteps: [
      "Scaffold FastAPI gateway with unified /v1/chat/completions endpoint",
      "Configure Redis cluster for cache and rate-limit state",
      "Add provider adapters for OpenAI and Anthropic with normalized response format",
      "Implement semantic cache using embedding similarity on prompt hash",
      "Define routing rules: simple queries → cheap model, complex → flagship",
      "Deploy behind nginx and run k6 load test at 100 RPS",
    ],
    architectureExplanation:
      "All LLM traffic flows through a single gateway that checks a semantic cache, enforces per-tenant rate limits, and routes to the optimal provider and model tier based on query complexity. Failed requests cascade through a fallback chain while Prometheus tracks latency, cache hit rate, and cost per route.",
    architectureDiagram: archDiagram(
      `flowchart TD
    A[Client Apps] --> B[API Gateway]
    B --> C[Rate Limiter]
    C --> D{Semantic Cache Hit?}
    D -->|Yes| E[Cached Response]
    D -->|No| F[Router]
    F --> G[OpenAI Adapter]
    F --> H[Anthropic Adapter]
    G --> I[Response Normalizer]
    H --> I
    I --> J[Cache Writer]
    J --> K[Client Response]
    F -->|Fail| L[Fallback Chain]
    L --> G
    M[Prometheus] --> B`,
      `class A,K grp1
    class B,C grp2
    class D,F,L grp3
    class G,H,I,J,M grp4
    class E grp5`
    ),
    timeBreakdown: [
      {
        phase: "Gateway scaffold & routing",
        hours: 10,
        tasks: [
          "Unified OpenAI-compatible API surface",
          "Provider adapters with normalized request/response",
          "Complexity classifier for model tier selection",
        ],
      },
      {
        phase: "Semantic caching layer",
        hours: 8,
        tasks: [
          "Embed incoming prompts, lookup similar cached responses",
          "TTL and invalidation policies per endpoint",
          "Cache hit rate metric and bypass for streaming",
        ],
      },
      {
        phase: "Rate limiting & quotas",
        hours: 8,
        tasks: [
          "Token bucket per API key and tenant",
          "Daily/monthly quota enforcement with 429 responses",
          "Admin API for quota management",
        ],
      },
      {
        phase: "Observability & fallback",
        hours: 10,
        tasks: [
          "Fallback chain: primary → secondary → tertiary provider",
          "Prometheus: latency, error rate, cost, cache hits",
          "Structured logging with request_id propagation",
        ],
      },
      {
        phase: "Load testing & deployment",
        hours: 9,
        tasks: [
          "k6 load test at 100 RPS with p95 < 2s",
          "Docker Compose for local stack",
          "Runbook for provider outage scenarios",
        ],
      },
    ],
    expectedOutcome:
      "Route 100 RPS through the gateway, demonstrate 40%+ cache hit rate on repeated queries, show automatic fallback when a provider is down, and display a Grafana panel with per-model cost and latency breakdown.",
    slides: [
      slide("Project Goal", {
        subtitle: "Central LLM gateway with caching, routing, rate limits, and fallbacks.",
        bullets: [
          "Single API for multiple LLM providers",
          "Semantic cache to cut costs on repeated queries",
          "Per-tenant rate limits and quotas",
          "Automatic fallback when providers fail",
        ],
      }),
      slide("Setup & Prerequisites", {
        bullets: [
          "FastAPI + Redis + Prometheus",
          "API keys for OpenAI and Anthropic",
          "OpenAI-compatible client for testing",
          "k6 or locust for load testing",
          "Understanding of token bucket rate limiting",
        ],
      }),
      slide("Architecture", {
        subtitle: "Cache → rate limit → route → normalize → respond.",
        diagram: archDiagram(
          `flowchart TD
    A[Client] --> B[Gateway]
    B --> C[Rate Limit]
    C --> D{Cache?}
    D -->|Hit| E[Response]
    D -->|Miss| F[Router]
    F --> G[Providers]
    G --> E`,
          `class A grp1
    class B,C grp2
    class D,F grp3
    class G,E grp4`
        ),
        caption: "One gateway to rule all LLM traffic",
      }),
      slide("Build Phases (45 hours)", {
        bullets: [
          "10h — Gateway API + provider adapters + routing rules",
          "8h — Semantic cache with embedding similarity",
          "8h — Rate limiting and per-tenant quotas",
          "10h — Fallback chains + Prometheus metrics",
          "9h — Load testing at 100 RPS + deployment",
        ],
      }),
      slide("Expected Result", {
        bullets: [
          "40%+ cache hit rate on repeated prompt patterns",
          "p95 latency < 2s at 100 RPS",
          "Automatic failover when primary provider is down",
          "Per-model cost dashboard in Grafana",
        ],
      }),
      slide("Resume & Production Tips", {
        bullets: [
          "Quantify: '50% cost reduction via caching + tiering'",
          "Discuss cache invalidation for time-sensitive prompts",
          "Production: add API key rotation and audit logs",
          "Interview: semantic vs exact-match caching tradeoffs",
        ],
      }),
    ],
    interviewQuestions: [
      {
        question: "How does semantic caching differ from exact-match caching?",
        answer:
          "Exact-match caches on prompt hash — only identical prompts hit. Semantic caching embeds the prompt and returns cached responses for similar queries (cosine similarity above threshold), dramatically increasing hit rates for paraphrased questions.",
      },
      {
        question: "How do you design a fallback chain for LLM providers?",
        answer:
          "Define priority order by cost, latency, and capability. On timeout or 5xx, retry on next provider with circuit breaker. Normalize responses so clients see a consistent format regardless of backend.",
      },
      {
        question: "What routing strategy minimizes cost without hurting quality?",
        answer:
          "Classify query complexity (token count, task type, user tier). Route simple/classification tasks to cheap models (GPT-4o-mini), complex reasoning to flagship models. Track quality metrics per route to validate tiering.",
      },
    ],
  }),

  createProject({
    slug: "rag-eval-ci-pipeline",
    title: "RAG Eval CI Pipeline",
    description:
      "RAG application with golden evaluation datasets integrated into CI/CD — block merges when retrieval or answer quality regresses.",
    difficulty: "production",
    phase: 4,
    techStack: ["Python", "LangChain", "RAGAS", "GitHub Actions", "Pinecone"],
    features: [
      "Golden eval dataset",
      "CI/CD quality gates",
      "RAGAS metrics",
      "Regression alerts",
      "Chunking A/B comparison",
    ],
    estimatedHours: 35,
    resumePoints: [
      "Integrated RAG evaluation into CI/CD blocking merges on quality regression",
      "Built golden dataset of 100 Q&A pairs with automated RAGAS scoring",
    ],
    prerequisites: [
      "Working RAG pipeline (ingestion, retrieval, generation)",
      "RAGAS or DeepEval library familiarity",
      "GitHub Actions CI/CD experience",
      "Understanding of faithfulness, relevance, and context precision metrics",
      "Pinecone or ChromaDB vector store",
    ],
    setupSteps: [
      "Build or reuse a RAG app with configurable chunk size and top-k",
      "Create golden eval set: 100 Q&A pairs with expected answers and source docs",
      "Install RAGAS and write eval script outputting JSON metrics",
      "Add GitHub Actions workflow running eval on every PR",
      "Set quality gates: faithfulness ≥ 0.85, context precision ≥ 0.75",
      "Configure Slack/email alert on main branch regression",
    ],
    architectureExplanation:
      "A RAG application serves production queries while a parallel eval runner executes the golden dataset on every PR. RAGAS computes faithfulness, answer relevance, and context precision; CI blocks merges when any metric drops below thresholds, and nightly runs on main detect slow regressions.",
    architectureDiagram: archDiagram(
      `flowchart TD
    A[Developer PR] --> B[GitHub Actions]
    B --> C[Build RAG App]
    C --> D[Eval Runner]
    D --> E[(Golden Dataset 100 Q&A)]
    D --> F[RAGAS Metrics]
    F --> G{Quality Gates}
    G -->|Pass| H[Merge Allowed]
    G -->|Fail| I[Block + Report]
    J[Main Branch Nightly] --> D
    F --> K[Metrics History DB]
    K --> L[Regression Alert]`,
      `class A,H grp1
    class B,C grp2
    class D,E,F grp3
    class G,I,J,K,L grp4`
    ),
    timeBreakdown: [
      {
        phase: "RAG pipeline setup",
        hours: 8,
        tasks: [
          "Configurable chunk size, overlap, and top-k via env vars",
          "Ingestion script for eval corpus (50 docs)",
          "Baseline retrieval + generation chain",
        ],
      },
      {
        phase: "Golden eval dataset",
        hours: 6,
        tasks: [
          "Curate 100 Q&A pairs with gold answers and source citations",
          "Human review of 20% for label quality",
          "Version dataset in repo with changelog",
        ],
      },
      {
        phase: "CI/CD integration",
        hours: 8,
        tasks: [
          "GitHub Actions workflow: lint → eval → gate",
          "Eval script outputs JSON with per-metric scores",
          "PR comment bot posting eval results table",
        ],
      },
      {
        phase: "Metrics & thresholds",
        hours: 7,
        tasks: [
          "RAGAS: faithfulness, answer_relevancy, context_precision",
          "Configurable thresholds in eval config YAML",
          "Per-question failure report for debugging",
        ],
      },
      {
        phase: "Regression alerts & docs",
        hours: 6,
        tasks: [
          "Nightly eval on main, store metrics in SQLite/Postgres",
          "Alert when 7-day rolling average drops 5%",
          "README documenting how to add eval cases and tune thresholds",
        ],
      },
    ],
    expectedOutcome:
      "Open a PR that changes chunk size, watch CI run the 100-case eval suite, see RAGAS scores posted as a PR comment, and demonstrate a merge blocked because faithfulness dropped below 0.85.",
    slides: [
      slide("Project Goal", {
        subtitle: "Treat RAG quality like code coverage — test it in CI.",
        bullets: [
          "Golden dataset of 100 Q&A pairs with gold answers",
          "RAGAS metrics on every pull request",
          "Block merges when quality regresses",
          "Track metric trends over time",
        ],
      }),
      slide("Setup & Prerequisites", {
        bullets: [
          "Working RAG app with configurable retrieval params",
          "RAGAS library + GitHub Actions",
          "50-doc corpus for eval ingestion",
          "100 curated Q&A pairs (start with 30, grow to 100)",
          "Slack webhook for regression alerts (optional)",
        ],
      }),
      slide("Architecture", {
        subtitle: "Every PR runs the golden set through RAGAS before merge.",
        diagram: archDiagram(
          `flowchart TD
    A[PR] --> B[CI Pipeline]
    B --> C[Eval Runner]
    C --> D[Golden Dataset]
    C --> E[RAGAS]
    E --> F{Gates}
    F -->|Pass| G[Merge]
    F -->|Fail| H[Block]`,
          `class A,G grp1
    class B grp2
    class C,D,E grp3
    class F,H grp4`
        ),
        caption: "No merge without passing eval gates",
      }),
      slide("Build Phases (35 hours)", {
        bullets: [
          "8h — Configurable RAG pipeline + eval corpus ingestion",
          "6h — Golden dataset curation and versioning",
          "8h — GitHub Actions CI with PR comment bot",
          "7h — RAGAS metrics + configurable thresholds",
          "6h — Nightly regression tracking + alerts",
        ],
      }),
      slide("Expected Result", {
        bullets: [
          "CI runs 100 eval cases in <10 minutes",
          "PR comment shows faithfulness, relevance, precision",
          "Merge blocked when any metric below threshold",
          "7-day trend chart detecting slow regressions",
        ],
      }),
      slide("Resume & Production Tips", {
        bullets: [
          "This is a differentiator — most teams skip RAG eval in CI",
          "Discuss dataset versioning and label quality audits",
          "Production: add canary eval on live traffic samples",
          "Interview: which RAGAS metric matters most and why",
        ],
      }),
    ],
    interviewQuestions: [
      {
        question: "Which RAGAS metrics should gate a CI merge?",
        answer:
          "Faithfulness (is the answer grounded in retrieved context?) is the most critical gate. Add context_precision (are retrieved chunks relevant?) and answer_relevancy (does it address the question?). Set thresholds based on baseline + acceptable regression margin.",
      },
      {
        question: "How do you build a golden eval dataset for RAG?",
        answer:
          "Curate real user questions, have domain experts write gold answers with source citations, cover edge cases (no answer in docs, ambiguous queries), version the dataset in git, and audit 20% of labels regularly.",
      },
      {
        question: "What if CI eval is too slow for every PR?",
        answer:
          "Run full 100-case suite nightly and a 20-case smoke subset on every PR. Cache embeddings, parallelize eval runs, and use smaller models for RAGAS judge where possible.",
      },
    ],
  }),

  createProject({
    slug: "multi-tenant-ai-backend",
    title: "Multi-Tenant AI Backend",
    description:
      "SaaS AI backend with strict tenant isolation for vector stores, databases, API keys, and per-tenant configuration.",
    difficulty: "production",
    phase: 8,
    techStack: ["Python", "FastAPI", "PostgreSQL", "Pinecone", "Redis", "Stripe"],
    features: [
      "Tenant isolation",
      "Per-tenant vector namespaces",
      "API key management",
      "Usage metering",
      "Row-level security",
    ],
    estimatedHours: 50,
    resumePoints: [
      "Architected multi-tenant AI SaaS backend with strict data isolation for 100+ tenants",
      "Implemented row-level security and per-tenant vector namespaces",
    ],
    prerequisites: [
      "PostgreSQL row-level security (RLS) concepts",
      "Multi-tenancy patterns: shared DB vs schema-per-tenant",
      "FastAPI middleware and dependency injection",
      "Pinecone namespaces or metadata filtering",
      "API key hashing and rotation best practices",
    ],
    setupSteps: [
      "Design tenant schema: tenants, users, api_keys, usage_logs tables",
      "Enable PostgreSQL RLS policies scoped to tenant_id",
      "Configure Pinecone with per-tenant namespaces",
      "Build tenant provisioning API (create tenant → namespace + RLS role)",
      "Add API key auth middleware extracting tenant context",
      "Integrate Stripe for usage-based billing webhooks",
    ],
    architectureExplanation:
      "Every request is authenticated via API key, which resolves to a tenant context injected into all downstream queries. PostgreSQL RLS enforces row isolation, Pinecone namespaces separate vector data, and a usage meter tracks tokens per tenant for billing and quota enforcement.",
    architectureDiagram: archDiagram(
      `flowchart TD
    A[Client Request] --> B[API Key Auth]
    B --> C[Tenant Context]
    C --> D[FastAPI Router]
    D --> E[RAG Service]
    E --> F[(Pinecone Namespace)]
    D --> G[(PostgreSQL RLS)]
    D --> H[Usage Meter]
    H --> I[(Redis Counters)]
    H --> J[Stripe Billing]
    K[Admin Portal] --> L[Tenant Provisioner]
    L --> F
    L --> G`,
      `class A grp1
    class B,C grp2
    class D,E grp3
    class F,G,H,I,J,K,L grp4`
    ),
    timeBreakdown: [
      {
        phase: "Tenant model & auth",
        hours: 10,
        tasks: [
          "Tenant, user, api_key tables with bcrypt-hashed keys",
          "Auth middleware: key → tenant_id → request.state",
          "Tenant signup and API key rotation endpoints",
        ],
      },
      {
        phase: "Data isolation",
        hours: 12,
        tasks: [
          "PostgreSQL RLS policies on all tenant-scoped tables",
          "Pinecone namespace per tenant for vector data",
          "Integration tests proving cross-tenant access fails",
        ],
      },
      {
        phase: "Per-tenant config & billing",
        hours: 10,
        tasks: [
          "Tenant config: model preference, chunk size, quota limits",
          "Usage meter: tokens in/out per request → Redis counters",
          "Stripe webhook for usage-based invoicing",
        ],
      },
      {
        phase: "API gateway & quotas",
        hours: 10,
        tasks: [
          "Per-tenant rate limits and monthly token quotas",
          "429 responses with upgrade CTA when quota exceeded",
          "Admin API for tenant management and usage reports",
        ],
      },
      {
        phase: "Security audit & tests",
        hours: 8,
        tasks: [
          "Pen-test: attempt cross-tenant data access (must fail)",
          "Audit log for all admin actions",
          "Load test 50 concurrent tenants",
        ],
      },
    ],
    expectedOutcome:
      "Provision two tenants, ingest different document sets for each, demonstrate that Tenant A cannot retrieve Tenant B's data even with a crafted query, and show per-tenant usage dashboards with token counts and billing status.",
    slides: [
      slide("Project Goal", {
        subtitle: "SaaS AI backend where tenant data never leaks across boundaries.",
        bullets: [
          "API key auth resolving to tenant context",
          "PostgreSQL RLS + Pinecone namespaces",
          "Per-tenant config, quotas, and usage metering",
          "Stripe integration for usage-based billing",
        ],
      }),
      slide("Setup & Prerequisites", {
        bullets: [
          "PostgreSQL with RLS enabled",
          "Pinecone with namespace support",
          "FastAPI middleware patterns",
          "Stripe test mode for billing webhooks",
          "Understanding of shared-DB multi-tenancy",
        ],
      }),
      slide("Architecture", {
        subtitle: "Auth → tenant context → isolated data paths for every request.",
        diagram: archDiagram(
          `flowchart TD
    A[Request] --> B[API Key Auth]
    B --> C[Tenant Context]
    C --> D[RAG Service]
    D --> E[(Tenant Namespace)]
    C --> F[(RLS Database)]
    D --> G[Usage Meter]`,
          `class A grp1
    class B,C grp2
    class D grp3
    class E,F,G grp4`
        ),
        caption: "Every query scoped to exactly one tenant",
      }),
      slide("Build Phases (50 hours)", {
        bullets: [
          "10h — Tenant model, API key auth, provisioning API",
          "12h — PostgreSQL RLS + Pinecone namespace isolation",
          "10h — Per-tenant config + Stripe usage billing",
          "10h — Rate limits, quotas, admin dashboard",
          "8h — Cross-tenant security tests + audit logging",
        ],
      }),
      slide("Expected Result", {
        bullets: [
          "Two tenants with fully isolated document stores",
          "Cross-tenant access attempts return 403",
          "Per-tenant usage dashboard with token counts",
          "Quota enforcement blocks over-limit requests",
        ],
      }),
      slide("Resume & Production Tips", {
        bullets: [
          "Emphasize RLS + namespace isolation — not just app-level checks",
          "Discuss tradeoff: shared DB vs schema-per-tenant",
          "Production: add SOC2 audit logs and key rotation",
          "Interview: how to prevent tenant_id injection attacks",
        ],
      }),
    ],
    interviewQuestions: [
      {
        question: "How do you enforce tenant isolation in a shared-database architecture?",
        answer:
          "PostgreSQL row-level security policies filter every query by tenant_id from auth context. Combine with Pinecone namespaces, never trust client-supplied tenant_id, and integration-test cross-tenant access attempts.",
      },
      {
        question: "Shared DB vs schema-per-tenant — when to choose each?",
        answer:
          "Shared DB with RLS scales to thousands of small tenants with lower ops overhead. Schema-per-tenant suits enterprise customers needing physical isolation, custom schemas, or regulatory compliance requiring dedicated resources.",
      },
      {
        question: "How do you meter and bill AI usage per tenant?",
        answer:
          "Count input/output tokens per request, aggregate in Redis counters flushed to Postgres, enforce quotas at request time, and sync usage to Stripe via webhooks for usage-based invoicing.",
      },
    ],
  }),

  createProject({
    slug: "k8s-agent-deployment",
    title: "K8s Agent Deployment",
    description:
      "Deploy AI agents on Kubernetes with Helm charts, horizontal pod autoscaling, health probes, and zero-downtime rollouts.",
    difficulty: "production",
    phase: 9,
    techStack: ["Python", "Kubernetes", "Helm", "Docker", "Prometheus", "LangGraph"],
    features: [
      "Containerized agents",
      "Helm charts",
      "HPA autoscaling",
      "Liveness/readiness probes",
      "Secrets management",
    ],
    estimatedHours: 40,
    resumePoints: [
      "Deployed production AI agents on Kubernetes with HPA scaling to 50 pods",
      "Built Helm charts enabling zero-downtime agent rollouts",
    ],
    prerequisites: [
      "Docker multi-stage builds for Python apps",
      "Kubernetes fundamentals: Deployments, Services, ConfigMaps, Secrets",
      "Helm chart templating",
      "LangGraph or similar agent framework packaged as a service",
      "Local K8s cluster (minikube, kind, or k3d)",
    ],
    setupSteps: [
      "Containerize a LangGraph agent with multi-stage Dockerfile",
      "Write Helm chart: Deployment, Service, HPA, ConfigMap, Secret templates",
      "Configure liveness (agent health) and readiness (model loaded) probes",
      "Set HPA on custom metric: agent_queue_depth from Prometheus adapter",
      "Store API keys in K8s Secrets, mount via env vars",
      "Deploy to local cluster and run load test triggering scale-up",
    ],
    architectureExplanation:
      "Agent services run as Kubernetes Deployments behind a ClusterIP Service, with HPA scaling replicas based on queue depth.custom metrics. Secrets mount LLM API keys, ConfigMaps hold prompt templates, and rolling updates with readiness probes ensure zero-downtime deploys.",
    architectureDiagram: archDiagram(
      `flowchart TD
    A[Ingress / Load Balancer] --> B[K8s Service]
    B --> C[Agent Pod 1]
    B --> D[Agent Pod 2]
    B --> E[Agent Pod N]
    F[HPA Controller] --> C
    F --> D
    F --> E
    G[Prometheus Adapter] --> F
    H[(Redis Queue)] --> C
    H --> D
    H --> E
    I[ConfigMap Prompts] --> C
    J[Secrets API Keys] --> C
    K[Helm Release] --> B`,
      `class A grp1
    class B,K grp2
    class C,D,E grp3
    class F,G,H,I,J grp4`
    ),
    timeBreakdown: [
      {
        phase: "Agent containerization",
        hours: 8,
        tasks: [
          "Multi-stage Dockerfile: builder + slim runtime",
          "Health endpoint: /health (liveness) and /ready (model loaded)",
          "Non-root user and read-only filesystem",
        ],
      },
      {
        phase: "Helm charts & manifests",
        hours: 8,
        tasks: [
          "Helm chart with values.yaml for dev/staging/prod",
          "Deployment, Service, ConfigMap, Secret templates",
          "Resource requests/limits: 512Mi RAM, 500m CPU per pod",
        ],
      },
      {
        phase: "HPA & resource tuning",
        hours: 8,
        tasks: [
          "Custom metric: agent_queue_depth via Prometheus adapter",
          "HPA: min 2, max 50 replicas, target queue depth 10",
          "Load test validating scale-up in <60s",
        ],
      },
      {
        phase: "Ingress & secrets",
        hours: 8,
        tasks: [
          "Ingress with TLS termination",
          "K8s Secrets for OpenAI/Anthropic API keys",
          "External Secrets Operator for production key rotation",
        ],
      },
      {
        phase: "Monitoring & rollout",
        hours: 8,
        tasks: [
          "Prometheus ServiceMonitor scraping agent metrics",
          "Grafana dashboard: queue depth, pod count, latency",
          "Rolling update with maxUnavailable=0, verify zero downtime",
        ],
      },
    ],
    expectedOutcome:
      "Deploy the agent via Helm, run a load test that triggers HPA scale-up from 2 to 10+ pods, perform a rolling update with zero failed requests, and show Grafana panels for queue depth and pod count.",
    slides: [
      slide("Project Goal", {
        subtitle: "Production-grade agent deployment on Kubernetes with autoscaling.",
        bullets: [
          "Containerize LangGraph agent as a stateless service",
          "Helm charts for reproducible deploys",
          "HPA scaling on queue depth custom metric",
          "Zero-downtime rolling updates",
        ],
      }),
      slide("Setup & Prerequisites", {
        bullets: [
          "Docker + local K8s (minikube/kind) + Helm 3",
          "LangGraph agent packaged as FastAPI service",
          "Redis for agent task queue",
          "Prometheus operator for custom metrics",
          "Basic kubectl and helm CLI fluency",
        ],
      }),
      slide("Architecture", {
        subtitle: "Ingress → Service → Agent pods, scaled by HPA on queue depth.",
        diagram: archDiagram(
          `flowchart TD
    A[Ingress] --> B[Service]
    B --> C[Agent Pods]
    D[HPA] --> C
    E[Prometheus] --> D
    F[Redis Queue] --> C
    G[Helm] --> B`,
          `class A grp1
    class B,G grp2
    class C grp3
    class D,E,F grp4`
        ),
        caption: "Scale agents like any other microservice",
      }),
      slide("Build Phases (40 hours)", {
        bullets: [
          "8h — Dockerfile + health/readiness endpoints",
          "8h — Helm chart with all K8s resources",
          "8h — HPA on custom queue_depth metric",
          "8h — Ingress, TLS, and Secrets management",
          "8h — Prometheus monitoring + zero-downtime rollout test",
        ],
      }),
      slide("Expected Result", {
        bullets: [
          "helm install deploys agent in <2 minutes",
          "HPA scales 2 → 10+ pods under load in <60s",
          "Rolling update with 0 failed requests",
          "Grafana shows queue depth and pod count correlation",
        ],
      }),
      slide("Resume & Production Tips", {
        bullets: [
          "Quantify: 'HPA scales to 50 pods under peak load'",
          "Discuss readiness vs liveness for model-loading agents",
          "Production: pod disruption budgets, node affinity for GPU",
          "Interview: why queue depth beats CPU for agent HPA",
        ],
      }),
    ],
    interviewQuestions: [
      {
        question: "Why scale agents on queue depth instead of CPU?",
        answer:
          "LLM agents are I/O-bound waiting on API responses — CPU stays low while queue backs up. Queue depth directly measures pending work and triggers scaling before latency degrades.",
      },
      {
        question: "How do you achieve zero-downtime deploys for agent pods?",
        answer:
          "Rolling update with maxUnavailable=0, readiness probe confirming model is loaded before receiving traffic, and preStop hook draining in-flight requests before pod termination.",
      },
      {
        question: "How do you manage LLM API keys in Kubernetes?",
        answer:
          "Store in K8s Secrets or External Secrets Operator synced from Vault/AWS SM. Mount as env vars, never in images or ConfigMaps. Rotate via secret update + rolling restart.",
      },
    ],
  }),
];
