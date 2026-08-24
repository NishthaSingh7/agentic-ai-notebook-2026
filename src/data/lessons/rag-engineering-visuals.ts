import type { WorkflowDiagram } from "../lesson-types";
import { pastelChart } from "@/lib/mermaid-pastel";

export interface Phase3Visuals {
  diagram: string;
  analogyDiagram: string;
  workflowDiagrams: WorkflowDiagram[];
  commandsToRemember: string[];
}

const SUBGRAPH_STYLE = [
  "fill:#fff7ed,stroke:#fdba74,color:#9a3412",
  "fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6",
  "fill:#eff6ff,stroke:#93c5fd,color:#1e40af",
  "fill:#ecfdf5,stroke:#6ee7b7,color:#065f46",
];

function cheat(hub: string, groups: { title: string; items: string[] }[]): string {
  const letters = ["A", "B", "C", "D"];
  const subgraphs = groups
    .map((g, i) => {
      const id = letters[i];
      const nodes = g.items.map((item, j) => `        ${id}${j + 1}["${item}"]`).join("\n");
      return `    subgraph G${id}["${g.title}"]\n${nodes}\n    end`;
    })
    .join("\n\n");
  const links = groups.map((_, i) => `    H --> G${letters[i]}`).join("\n");
  const classNodes = groups
    .map((g, i) => {
      const ids = g.items.map((_, j) => `${letters[i]}${j + 1}`).join(",");
      return `    class ${ids} grp${i + 1}`;
    })
    .join("\n");
  const styles = groups
    .map((_, i) => `    style G${letters[i]} ${SUBGRAPH_STYLE[i]}`)
    .join("\n");

  return pastelChart(
    `flowchart TD
    H([${hub}])

${subgraphs}

${links}`,
    `    class H hub
${classNodes}
${styles}`
  );
}

function analogy(left: string, hub: string, right: string): string {
  return pastelChart(
    `flowchart LR
    L["${left}"] --> H["${hub}"]
    H --> R["${right}"]`,
    `    class L grp1
    class H hub
    class R grp2`
  );
}

function flow(
  title: string,
  caption: string,
  steps: string[],
  direction: "LR" | "TD" = "LR"
): WorkflowDiagram {
  const nodes = steps.map((s, i) => `    N${i}["${s}"]`).join("\n");
  const links = steps.slice(1).map((_, i) => `    N${i} --> N${i + 1}`).join("\n");
  const classes = steps
    .map((_, i) => `    class N${i} grp${(i % 4) + 1}`)
    .join("\n");
  return {
    title,
    caption,
    chart: pastelChart(
      `flowchart ${direction}\n${nodes}\n${links}`,
      classes
    ),
  };
}

export const RAG_ENGINEERING_VISUALS: Record<string, Phase3Visuals> = {
  "document-loaders": {
    analogyDiagram: analogy(
      "PDF / Notion / Slack / S3",
      "Loader = baggage scanner",
      "Standard Document + metadata"
    ),
    diagram: cheat("Document Loaders", [
      {
        title: "Sources",
        items: ["PDF DOCX HTML Markdown", "S3 / Drive / SharePoint", "APIs and databases", "SaaS connectors"],
      },
      {
        title: "Must Handle",
        items: ["Parse + encoding", "OCR for scans", "Tables and layout", "Incremental sync"],
      },
      {
        title: "Output",
        items: ["page_content", "source URI + page", "doc_id + content hash", "ACLs / tenant_id"],
      },
    ]),
    workflowDiagrams: [
      flow("Ingestion path", "Every format becomes the same Document object before chunking.", [
        "Raw file or API",
        "Loader worker",
        "Normalize text + metadata",
        "PII / quality gate",
        "Chunking queue",
      ]),
      flow("When a doc updates", "Re-ingest only the changed id. Hash makes it idempotent.", [
        "Source event",
        "Load that doc only",
        "Hash content",
        "Upsert by doc_id",
      ]),
    ],
    commandsToRemember: [
      "from langchain_community.document_loaders import PyMuPDFLoader  # PDF pages",
      "loader.load()  # all into memory",
      "loader.lazy_load()  # stream large corpora",
      "doc.metadata['content_hash'] = sha256(text).hexdigest()[:16]  # dedupe",
    ],
  },

  chunking: {
    analogyDiagram: analogy(
      "200-page manual",
      "Chunking = flashcards",
      "Too big loses precision / too small loses 'it'"
    ),
    diagram: cheat("Chunking", [
      {
        title: "Strategies",
        items: ["Fixed size", "Recursive character", "Semantic merge", "Structure-aware"],
      },
      {
        title: "Defaults",
        items: ["256 to 1024 tokens", "10-20 percent overlap", "Respect headers", "Do not split tables"],
      },
      {
        title: "Parent-Child",
        items: ["Retrieve small child", "Return large parent", "Legal / procedures", "Best of both"],
      },
    ]),
    workflowDiagrams: [
      flow("Pick a splitter", "Document type decides the strategy. Defaults are a start, not a finish.", [
        "Detect doc type",
        "Legal: section split",
        "Code: AST split",
        "General: recursive",
        "Add overlap + parent_id",
      ]),
      {
        title: "Why overlap exists",
        caption: "Questions sit on boundaries. Overlap puts the needed sentence in at least one chunk.",
        chart: pastelChart(
          `flowchart LR
    C1["Chunk 1"] --> O["Overlap 10-20 percent"]
    C2["Chunk 2"] --> O
    O --> Q["Query still hits"]`,
          `    class C1,C2 grp1
    class O hub
    class Q grp4`
        ),
      },
    ],
    commandsToRemember: [
      "RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=64)",
      "separators=['\\n\\n', '\\n', '. ', ' ', '']  # paragraph then sentence",
      "child.metadata['parent_id'] = f'parent_{i}'  # parent-child pattern",
      "Bad chunking is not fixed by a better embedding model",
    ],
  },

  "embedding-models": {
    analogyDiagram: analogy(
      "Italian bistro downtown",
      "GPS for meaning",
      "Pasta place near Main St — nearby vectors"
    ),
    diagram: cheat("Embedding Models", [
      {
        title: "What they do",
        items: ["Text to dense vector", "Similar meaning = close", "Lens for the whole KB"],
      },
      {
        title: "Choices",
        items: ["text-embedding-3-small", "Cohere embed-v3", "BGE / E5 local", "Same model index + query"],
      },
      {
        title: "Production",
        items: ["Batch at ingest", "Cache query vectors", "Swap model = re-index", "Domain fine-tune if needed"],
      },
    ]),
    workflowDiagrams: [
      flow("Index and query must match", "Never mix models. A new embedder means a full re-index.", [
        "Chunk text",
        "Embed with model M",
        "Store vector",
        "Query uses model M too",
        "ANN search",
      ]),
      flow("When quality is weak", "Infrastructure cannot save a weak embedder.", [
        "Paraphrase misses",
        "Try a stronger model",
        "Or domain fine-tune",
        "Then re-embed everything",
      ]),
    ],
    commandsToRemember: [
      "client.embeddings.create(model='text-embedding-3-small', input=chunk)",
      "len(emb.data[0].embedding)  # must match vector DB dimension",
      "Use the same model for indexing and querying — always",
      "Changing the model requires a full re-index",
    ],
  },

  "vector-databases": {
    analogyDiagram: analogy(
      "Millions of embeddings",
      "Library by topic proximity",
      "Millisecond ANN, not brute force"
    ),
    diagram: cheat("Vector Databases", [
      {
        title: "Options",
        items: ["ChromaDB - local", "Qdrant / Weaviate", "Pinecone - managed", "pgvector - Postgres"],
      },
      {
        title: "Indexes",
        items: ["HNSW - graph ANN", "IVF - cluster then scan", "Recall vs latency knobs", "Cosine or L2"],
      },
      {
        title: "Must have",
        items: ["Upsert by id", "Metadata filters", "Hybrid vector + keyword", "Persist and backup"],
      },
    ]),
    workflowDiagrams: [
      flow("Write path", "Chunk, embed, upsert with metadata. Id is how you update later.", [
        "Chunk + embed",
        "Upsert id + vector + payload",
        "ANN index updates",
      ]),
      flow("Read path", "Filter first when you can. ANN is approximate — measure recall.", [
        "Embed query",
        "Optional metadata filter",
        "ANN top-k",
        "Return chunks to LLM",
      ]),
    ],
    commandsToRemember: [
      "pip install chromadb qdrant-client  # local vs server",
      "collection.add(documents=..., ids=..., metadatas=...)",
      "collection.query(query_texts=[q], n_results=5, where={...})",
      "pgvector for small scale; dedicated DB past ~1M vectors",
    ],
  },

  metadata: {
    analogyDiagram: analogy(
      "Right meaning, wrong tenant",
      "Metadata = library stamps",
      "Filter before the LLM sees it"
    ),
    diagram: cheat("Metadata", [
      {
        title: "Always store",
        items: ["source URI", "doc_id + page", "ingested_at + hash", "tenant_id + ACLs"],
      },
      {
        title: "Often store",
        items: ["section title", "language", "version", "product / region"],
      },
      {
        title: "Used for",
        items: ["Pre-filters", "Citations", "Permission checks", "Recency"],
      },
    ]),
    workflowDiagrams: [
      flow("Filter then rank", "Do not retrieve another team's docs and hope the prompt ignores them.", [
        "User + tenant",
        "where tenant_id = X",
        "ANN inside that slice",
        "Cite source + page",
      ]),
      {
        title: "No metadata = no production RAG",
        caption: "Citations, ACLs, and incremental updates all need fields on every chunk.",
        chart: pastelChart(
          `flowchart TD
    Bad["No metadata"] --> Leak["Wrong tenant / no citation"]
    Good["Rich metadata"] --> Safe["Filter + cite + re-ingest"]`,
          `    class Bad,Leak grp1
    class Good,Safe grp4`
        ),
      },
    ],
    commandsToRemember: [
      "doc.metadata = {source, page, doc_id, tenant_id, ingested_at}",
      "collection.query(..., where={'tenant_id': user.tenant})",
      "Never index without ACL fields if users have different access",
      "Citations come from metadata — not from the model guessing",
    ],
  },

  retrievers: {
    analogyDiagram: analogy(
      "Raw nearest-neighbor",
      "Retriever = research assistant",
      "Transform, search, filter, format"
    ),
    diagram: cheat("Retrievers", [
      {
        title: "Types",
        items: ["Vector similarity", "Keyword BM25", "Hybrid", "Multi-query"],
      },
      {
        title: "Smarter",
        items: ["Parent-document", "Self-query filters", "Ensemble", "Compression"],
      },
      {
        title: "Knobs",
        items: ["top_k", "score_threshold", "search_type", "metadata filters"],
      },
    ]),
    workflowDiagrams: [
      flow("Retriever vs raw search", "The retriever is the R in RAG. Measure it without the LLM first.", [
        "User query",
        "Optional rewrite",
        "Search index",
        "Filter + rank",
        "Document list",
      ]),
      flow("Multi-query recall", "One phrasing misses docs. Generate variants, search all, dedupe.", [
        "How do I deploy?",
        "LLM writes 3 queries",
        "Search each",
        "Merge unique chunks",
      ]),
    ],
    commandsToRemember: [
      "vectorstore.as_retriever(search_kwargs={'k': 5})",
      "MultiQueryRetriever.from_llm(retriever, llm)  # paraphrase search",
      "Evaluate precision@k on the retriever alone",
      "Wrong chunks cannot be saved by a better prompt",
    ],
  },

  "hybrid-search": {
    analogyDiagram: analogy(
      "Vectors miss SKU-123",
      "Hybrid = meaning + exact words",
      "BM25 catches IDs, names, errors"
    ),
    diagram: cheat("Hybrid Search", [
      {
        title: "Why both",
        items: ["Dense: paraphrases", "Sparse: IDs and typos", "Together beat either"],
      },
      {
        title: "How to fuse",
        items: ["Reciprocal Rank Fusion", "Weighted sum", "Normalize scores first"],
      },
      {
        title: "When",
        items: ["Product SKUs", "Error codes", "Names / jargon", "Legal citations"],
      },
    ]),
    workflowDiagrams: [
      flow("Two indexes, one list", "Run dense and sparse in parallel, then fuse ranks.", [
        "Query",
        "Vector top-k",
        "BM25 top-k",
        "RRF fuse",
        "Unified ranking",
      ]),
      {
        title: "RRF idea",
        caption: "Rank matters more than raw scores. 1 / (k + rank) lets both lists vote.",
        chart: pastelChart(
          `flowchart LR
    V["Vector ranks"] --> RRF["RRF"]
    B["BM25 ranks"] --> RRF
    RRF --> Out["Fused top-k"]`,
          `    class V grp1
    class B grp2
    class RRF hub
    class Out grp4`
        ),
      },
    ],
    commandsToRemember: [
      "Hybrid = vector search + BM25, then Reciprocal Rank Fusion",
      "score = 1 / (60 + rank)  # typical RRF k",
      "Do not add raw cosine to raw BM25 without normalizing",
      "Use hybrid when queries contain IDs, names, or error codes",
    ],
  },

  bm25: {
    analogyDiagram: analogy(
      "refund vs money back",
      "BM25 = keyword librarian",
      "Great for exact tokens, weak on paraphrase"
    ),
    diagram: cheat("BM25", [
      {
        title: "What it scores",
        items: ["Term frequency", "Inverse doc frequency", "Document length norm"],
      },
      {
        title: "Strengths",
        items: ["IDs and codes", "No embed cost", "Explainable hits", "Sparse index"],
      },
      {
        title: "Limits",
        items: ["Synonyms miss", "Needs tokenizer", "Not semantic", "Pair with dense"],
      },
    ]),
    workflowDiagrams: [
      flow("Sparse retrieval", "Tokenize query, look up inverted index, score BM25, take top-k.", [
        "Tokenize query",
        "Inverted index",
        "BM25 score",
        "Top-k docs",
      ]),
      flow("Where it belongs", "Not a replacement for embeddings — a teammate.", [
        "Exact match need",
        "Run BM25",
        "Fuse with vectors",
        "Then re-rank if needed",
      ]),
    ],
    commandsToRemember: [
      "from rank_bm25 import BM25Okapi  # classic sparse retriever",
      "bm25.get_scores(query_tokens)  # one score per document",
      "BM25 does not understand synonyms — pair it with embeddings",
      "Tokenize the same way at index time and query time",
    ],
  },

  "cross-encoder": {
    analogyDiagram: analogy(
      "Bi-encoder: two photos, compare GPS",
      "Cross-encoder: look at both together",
      "Slower, much more precise"
    ),
    diagram: cheat("Cross Encoder", [
      {
        title: "Bi vs Cross",
        items: ["Bi: embed once each", "Cross: query+doc together", "Cross = one relevance score"],
      },
      {
        title: "Use as",
        items: ["Re-ranker not first search", "Score 20-50 candidates", "Too slow for millions"],
      },
      {
        title: "Models",
        items: ["ms-marco MiniLM", "bge-reranker", "Cohere Rerank API"],
      },
    ]),
    workflowDiagrams: [
      flow("Two-stage search", "Cast a wide net with bi-encoder, then precision with cross-encoder.", [
        "Bi-encoder top-20",
        "Pair query with each doc",
        "Cross-encoder score",
        "Keep top-5 for LLM",
      ]),
      {
        title: "Cost trade",
        caption: "Cross-encoders do a full forward pass per pair. Never run them on the whole corpus.",
        chart: pastelChart(
          `flowchart TD
    All["Million docs"] --> Fast["Bi-encoder ANN"]
    Fast --> Few["20-50 docs"]
    Few --> Slow["Cross-encoder"]
    Slow --> Best["Top 5"]`,
          `    class All,Fast grp1
    class Few,Slow grp2
    class Best grp4`
        ),
      },
    ],
    commandsToRemember: [
      "Cross-encoder input is (query, document) as one sequence",
      "Use it to re-rank, never to search the full corpus",
      "Cohere Rerank or HuggingFace cross-encoder/ms-marco-MiniLM",
      "Latency grows linearly with candidate count",
    ],
  },

  "re-ranking": {
    analogyDiagram: analogy(
      "HR screens 100 resumes",
      "Re-rank = hiring manager",
      "Send only the best 5 to the LLM"
    ),
    diagram: cheat("Re-ranking", [
      {
        title: "Why",
        items: ["First-stage is recall", "LLM context is scarce", "Better order = better answers"],
      },
      {
        title: "How",
        items: ["Retrieve 20-50", "Score with reranker", "Keep 3-8 chunks"],
      },
      {
        title: "Watch",
        items: ["Extra latency", "Extra cost", "Eval before/after", "Do not re-rank 1000"],
      },
    ]),
    workflowDiagrams: [
      flow("Classic RAG + rerank", "Retrieve broadly, score precisely, generate from the shortlist.", [
        "Query",
        "Retriever top-20",
        "Reranker scores",
        "Top-5 context",
        "LLM answer",
      ]),
      flow("Did it help?", "Measure context_precision and faithfulness, not vibes.", [
        "Golden questions",
        "Run with/without rerank",
        "Compare precision@5",
        "Keep only if recall stays",
      ]),
    ],
    commandsToRemember: [
      "Retrieve k=20 then rerank down to k=5  # typical pattern",
      "from sentence_transformers import CrossEncoder",
      "reranker.predict([(query, doc) for doc in candidates])",
      "If first-stage recall is bad, reranking cannot invent missing docs",
    ],
  },

  "query-expansion": {
    analogyDiagram: analogy(
      "User: PTO",
      "Expand to paid time off / leave policy",
      "Search the words the docs actually use"
    ),
    diagram: cheat("Query Expansion", [
      {
        title: "Techniques",
        items: ["Synonym lists", "LLM rewrite", "Multi-query", "HyDE"],
      },
      {
        title: "HyDE",
        items: ["LLM writes a fake answer", "Embed that passage", "Search near it", "Helps short queries"],
      },
      {
        title: "Risks",
        items: ["Topic drift", "Extra LLM cost", "Keep original query", "Eval recall vs precision"],
      },
    ]),
    workflowDiagrams: [
      flow("Multi-query", "One user sentence becomes several searches.", [
        "User query",
        "LLM writes variants",
        "Search each",
        "Dedupe hits",
      ]),
      flow("HyDE", "Embed a hypothetical answer when the query is too short to match docs.", [
        "Short query",
        "LLM drafts fake answer",
        "Embed the draft",
        "ANN against corpus",
      ]),
    ],
    commandsToRemember: [
      "Multi-query: LLM generates 3 search strings from one question",
      "HyDE: embed a hypothetical answer, not the raw query",
      "Always also search the original query to limit drift",
      "Measure recall@k — expansion can add noise",
    ],
  },

  compression: {
    analogyDiagram: analogy(
      "Retrieved 8 fat chunks",
      "Compression = highlighter",
      "Only the sentences that answer go to the LLM"
    ),
    diagram: cheat("Compression", [
      {
        title: "What",
        items: ["Drop irrelevant sentences", "Keep evidence", "Shrink context tokens"],
      },
      {
        title: "How",
        items: ["LLM extractor", "Embedding filter", "ContextualCompressionRetriever"],
      },
      {
        title: "Why",
        items: ["Cheaper generation", "Less distraction", "Fits the window", "Can drop needed lines — eval"],
      },
    ]),
    workflowDiagrams: [
      flow("Retrieve then squeeze", "Broad retrieval, then keep only query-relevant spans.", [
        "Retrieve top-k",
        "Score sentences vs query",
        "Keep relevant spans",
        "Shorter prompt",
      ]),
      {
        title: "Token budget",
        caption: "Compression is a context-engineering tool: spend tokens on evidence, not filler.",
        chart: pastelChart(
          `flowchart LR
    Fat["8 full chunks"] --> Filter["Keep relevant sentences"]
    Filter --> Thin["Fits window, cheaper"]`,
          `    class Fat grp1
    class Filter hub
    class Thin grp4`
        ),
      },
    ],
    commandsToRemember: [
      "ContextualCompressionRetriever(base_retriever, compressor)",
      "Compress after retrieval, not instead of retrieval",
      "Eval faithfulness — aggressive compression drops citations",
      "Savings show up in prompt tokens, not in the vector DB",
    ],
  },

  caching: {
    analogyDiagram: analogy(
      "Same FAQ asked 400 times",
      "Cache = sticky note",
      "Skip embed + retrieve + generate"
    ),
    diagram: cheat("Caching", [
      {
        title: "Layers",
        items: ["Exact string cache", "Semantic near-query", "Embedding cache", "Prompt cache at provider"],
      },
      {
        title: "When to hit",
        items: ["Identical FAQ", "Near-duplicate questions", "Repeated chunk embeds"],
      },
      {
        title: "When to miss",
        items: ["Live data changed", "User-specific ACLs", "Stale TTL", "Invalidate on re-index"],
      },
    ]),
    workflowDiagrams: [
      flow("Lookup before spend", "Check cache first. Only miss pays for embed + LLM.", [
        "Incoming query",
        "Exact or semantic lookup",
        "Hit: return stored answer",
        "Miss: full RAG then store",
      ]),
      flow("Invalidation", "A new handbook version must bust cached answers.", [
        "Docs change",
        "Bump corpus version",
        "Drop answer cache",
        "Keep embed cache if model same",
      ]),
    ],
    commandsToRemember: [
      "Cache exact queries and near-duplicate queries separately",
      "Cache embeddings of chunks at ingest — do not re-embed unchanged text",
      "Key caches by tenant_id + corpus_version",
      "Never serve a cached answer across ACL boundaries",
    ],
  },

  rag: {
    analogyDiagram: analogy(
      "Closed-book exam = hallucination",
      "RAG = open-book exam",
      "Look up pages, then write the answer"
    ),
    diagram: cheat("RAG", [
      {
        title: "Offline",
        items: ["Load docs", "Chunk", "Embed", "Store in vector DB"],
      },
      {
        title: "Online",
        items: ["Embed query", "Retrieve top-k", "Build prompt", "Generate + cite"],
      },
      {
        title: "Levels",
        items: ["Naive retrieve+gen", "Advanced: rewrite rerank", "Modular: tune each stage"],
      },
    ]),
    workflowDiagrams: [
      flow(
        "End-to-end RAG",
        "Private knowledge enters at retrieve time. The LLM should answer from context, not from memory.",
        [
          "Documents",
          "Chunk + embed",
          "Vector DB",
          "Query retrieve",
          "LLM + citations",
        ]
      ),
      {
        title: "What RAG fixes",
        caption: "Cutoff, private data, and citations. It does not fix bad chunks or a weak retriever.",
        chart: pastelChart(
          `flowchart TD
    Cut["Knowledge cutoff"] --> RAG["Retrieve then generate"]
    Priv["Private docs"] --> RAG
    Hall["Hallucinated facts"] --> RAG
    RAG --> Ground["Answer + sources"]`,
          `    class Cut,Priv,Hall grp1
    class RAG hub
    class Ground grp4`
        ),
      },
    ],
    commandsToRemember: [
      "RAG = retrieve relevant chunks, then generate from that context",
      "System: Answer only using the provided context. Cite sources.",
      "temperature=0 for factual RAG",
      "If retrieval is wrong, generation cannot be faithful",
    ],
  },

  "langchain-basics": {
    analogyDiagram: analogy(
      "Raw SDK calls",
      "LangChain = React for LLM apps",
      "Loaders, splitters, stores, retrievers"
    ),
    diagram: cheat("LangChain Basics", [
      {
        title: "RAG pieces",
        items: ["Document loaders", "Text splitters", "Embeddings", "Vector stores"],
      },
      {
        title: "Then",
        items: ["Retrievers", "Prompt templates", "Chat models", "LCEL pipes"],
      },
      {
        title: "2026 note",
        items: ["Great for integrations", "LangGraph for agent graphs", "Do not hide eval inside chains"],
      },
    ]),
    workflowDiagrams: [
      flow("Minimal LCEL RAG", "Each box is swappable. Keep the interfaces, change the backends.", [
        "Load",
        "Split",
        "Embed + store",
        "Retrieve",
        "Prompt + LLM",
      ]),
      {
        title: "Where it stops",
        caption: "LangChain wires RAG. LangGraph (later phase) owns loops, retries, and HITL.",
        chart: pastelChart(
          `flowchart LR
    LC["LangChain RAG chain"] --> Answer["One-shot answer"]
    LG["LangGraph"] --> Loop["Multi-step agent"]`,
          `    class LC,Answer grp1
    class LG,Loop grp2`
        ),
      },
    ],
    commandsToRemember: [
      "pip install langchain langchain-openai langchain-chroma langchain-text-splitters",
      "RecursiveCharacterTextSplitter → Chroma.from_texts → as_retriever",
      "retriever.invoke(question)  # list of Documents",
      "Use LangChain for RAG plumbing; LangGraph later for agent control",
    ],
  },

  chromadb: {
    analogyDiagram: analogy(
      "Need a vector cabinet today",
      "Chroma = local filing by meaning",
      "No cluster required to learn RAG"
    ),
    diagram: cheat("ChromaDB", [
      {
        title: "Modes",
        items: ["In-memory Client", "PersistentClient path", "HttpClient server"],
      },
      {
        title: "Collection",
        items: ["documents", "embeddings", "metadatas", "ids"],
      },
      {
        title: "Query",
        items: ["query_texts or query_embeddings", "n_results", "where filters", "include distances"],
      },
    ]),
    workflowDiagrams: [
      flow("Local RAG store", "Persist to disk so you do not re-embed every demo restart.", [
        "PersistentClient",
        "get_or_create_collection",
        "add docs + ids + metadata",
        "query_texts",
      ]),
      {
        title: "When to leave Chroma",
        caption: "Great for learning and small apps. Dedicated DBs when you need HA, tenancy, and huge scale.",
        chart: pastelChart(
          `flowchart TD
    Learn["Learn + prototype"] --> Chroma["ChromaDB"]
    Prod["Multi-tenant millions"] --> Other["Qdrant / Pinecone / pgvector"]`,
          `    class Learn,Chroma grp4
    class Prod,Other grp2`
        ),
      },
    ],
    commandsToRemember: [
      "pip install chromadb",
      "client = chromadb.PersistentClient(path='./chroma')",
      "collection.add(documents=..., ids=..., metadatas=...)",
      "collection.query(query_texts=[question], n_results=5, where={...})",
    ],
  },

  streamlit: {
    analogyDiagram: analogy(
      "Stakeholders want to click",
      "Streamlit = PowerPoint of AI demos",
      "Python in, chat UI out"
    ),
    diagram: cheat("Streamlit", [
      {
        title: "Chat UI",
        items: ["st.chat_input", "st.chat_message", "st.session_state", "Rerun on each click"],
      },
      {
        title: "RAG demo",
        items: ["Sidebar: k, model", "Upload PDF", "Show sources", "Stream tokens"],
      },
      {
        title: "Not for",
        items: ["High QPS production", "Auth-heavy apps", "Use FastAPI + React later"],
      },
    ]),
    workflowDiagrams: [
      flow("Demo loop", "Script reruns top to bottom. History lives in session_state.", [
        "User types",
        "Append to session_state",
        "Retrieve + LLM",
        "Write assistant bubble",
      ]),
      flow("Show your work", "A RAG demo without sources is just a chatbot.", [
        "Answer",
        "Expander: chunks",
        "Metadata: page + file",
      ]),
    ],
    commandsToRemember: [
      "pip install streamlit && streamlit run app.py",
      "st.session_state.messages = []  # conversation memory",
      "st.chat_input('Ask the handbook')",
      "Prototype in Streamlit; production UI is FastAPI + a real frontend",
    ],
  },

  evaluation: {
    analogyDiagram: analogy(
      "Kitchen looks clean",
      "Eval = health inspection",
      "Metrics on a golden set, every change"
    ),
    diagram: cheat("RAG Evaluation", [
      {
        title: "Retrieval",
        items: ["precision@k", "recall@k", "MRR / nDCG", "context_precision"],
      },
      {
        title: "Generation",
        items: ["Faithfulness", "Answer relevancy", "Correctness", "Citations present"],
      },
      {
        title: "Practice",
        items: ["Golden Q + A + sources", "RAGAS / DeepEval", "CI gate", "Fix retrieval first"],
      },
    ]),
    workflowDiagrams: [
      flow("Eval in the loop", "No deploy if faithfulness drops. Gut feel is not a metric.", [
        "Golden dataset",
        "Run pipeline",
        "RAGAS scores",
        "Pass threshold?",
        "Deploy or block",
      ]),
      {
        title: "Order of debugging",
        caption: "Wrong chunks cause unfaithful answers. Tune retrieval before prompts.",
        chart: pastelChart(
          `flowchart TD
    Bad["Bad answers"] --> R{"Chunks relevant?"}
    R -->|No| FixR["Fix chunking / retriever"]
    R -->|Yes| FixG["Fix prompt / model"]`,
          `    class Bad hub
    class R grp2
    class FixR grp1
    class FixG grp4`
        ),
      },
    ],
    commandsToRemember: [
      "from ragas.metrics import faithfulness, answer_relevancy, context_precision",
      "Golden set: question + ground_truth + expected source docs",
      "Optimize retrieval metrics before generation metrics",
      "Block CI if faithfulness drops below your threshold",
    ],
  },

  "knowledge-graphs": {
    analogyDiagram: analogy(
      "Chunks are sticky notes",
      "Graph = map of who relates to whom",
      "Entities as nodes, relations as edges"
    ),
    diagram: cheat("Knowledge Graphs", [
      {
        title: "Pieces",
        items: ["Entities - nodes", "Relations - edges", "Properties", "Ontology / schema"],
      },
      {
        title: "Why for RAG",
        items: ["Multi-hop facts", "Stable identities", "Join across docs", "Explainable paths"],
      },
      {
        title: "Stores",
        items: ["Neo4j", "FalkorDB", "RDF / SPARQL", "Often plus a vector index"],
      },
    ]),
    workflowDiagrams: [
      flow("Build a graph from docs", "Extract triples, resolve entities, then store.", [
        "Documents",
        "Extract entities + relations",
        "Entity resolution",
        "Write graph",
      ]),
      flow("Ask a graph", "Traversal answers 'who owns what' better than cosine on a paragraph.", [
        "Question",
        "Identify entities",
        "Walk neighbors",
        "Verbalize path for LLM",
      ]),
    ],
    commandsToRemember: [
      "Triple: (subject, relation, object)  # Acme -acquired-> BetaCorp",
      "Graphs shine when the answer hops across documents",
      "You still need entity resolution or the graph fragments",
      "Many teams keep vectors for text AND a graph for relations",
    ],
  },

  "graph-rag": {
    analogyDiagram: analogy(
      "Vector RAG: similar paragraphs",
      "Graph RAG: follow the relationships",
      "Who reports to whom, what acquired what"
    ),
    diagram: cheat("Graph RAG", [
      {
        title: "When it wins",
        items: ["Multi-hop questions", "Org / legal structure", "Communities of topics", "Global summaries"],
      },
      {
        title: "Pattern",
        items: ["Extract graph from corpus", "Retrieve subgraph", "Optionally vector too", "LLM reads paths + text"],
      },
      {
        title: "Cost",
        items: ["Extraction is expensive", "Needs ER", "Harder eval", "Not for every FAQ"],
      },
    ]),
    workflowDiagrams: [
      flow("Microsoft-style GraphRAG idea", "Build communities, summarize, then retrieve a subgraph plus text.", [
        "Corpus",
        "Entities + edges",
        "Communities",
        "Query subgraph",
        "Generate",
      ]),
      {
        title: "Hybrid is common",
        caption: "Vectors find the paragraph. The graph finds the hop the paragraph never states.",
        chart: pastelChart(
          `flowchart LR
    Q["Question"] --> V["Vector chunks"]
    Q --> G["Graph neighbors"]
    V --> LLM["LLM"]
    G --> LLM`,
          `    class Q hub
    class V grp1
    class G grp2
    class LLM grp4`
        ),
      },
    ],
    commandsToRemember: [
      "Graph RAG = retrieve a subgraph (and often chunks), then generate",
      "Use it for multi-hop / relational questions, not every FAQ",
      "Extraction + entity resolution quality bounds the whole system",
      "Eval needs multi-hop questions, not only single-paragraph facts",
    ],
  },

  "entity-resolution": {
    analogyDiagram: analogy(
      "Acme Inc / ACME / Acme Corporation",
      "ER = same real-world thing",
      "One canonical node, many surface names"
    ),
    diagram: cheat("Entity Resolution", [
      {
        title: "Problem",
        items: ["Duplicate nodes", "Broken hops", "Split facts", "Noisy extraction"],
      },
      {
        title: "How",
        items: ["Normalize strings", "Blocking candidates", "Similarity + LLM judge", "Canonical id"],
      },
      {
        title: "Output",
        items: ["entity_id", "Aliases list", "Merged properties", "Traceable sources"],
      },
    ]),
    workflowDiagrams: [
      flow("Resolve then link", "Do not build Graph RAG on raw strings. Merge first.", [
        "Extract mentions",
        "Block likely matches",
        "Decide same entity?",
        "Assign canonical id",
      ]),
      {
        title: "If you skip ER",
        caption: "The graph thinks Acme and ACME are strangers. Multi-hop dies.",
        chart: pastelChart(
          `flowchart TD
    A["Acme Inc"] -.-> Miss["No edge"]
    B["ACME"] -.-> Miss
    C["Canonical Acme"] --> Edge["acquired Beta"]`,
          `    class A,B,Miss grp1
    class C,Edge grp4`
        ),
      },
    ],
    commandsToRemember: [
      "Normalize: case, legal suffixes Inc/LLC, punctuation",
      "Blocking: only compare likely pairs, not N-squared",
      "Store aliases on the canonical entity",
      "Without ER, Graph RAG retrieves fragments of the same company",
    ],
  },

  "graph-retrieval": {
    analogyDiagram: analogy(
      "Start at Acme",
      "Walk 1-2 hops",
      "Return the path + neighboring facts"
    ),
    diagram: cheat("Graph Retrieval", [
      {
        title: "Moves",
        items: ["Seed entity from query", "k-hop neighbors", "Typed edge filters", "Shortest path"],
      },
      {
        title: "Mix with vectors",
        items: ["Vector finds seed chunk", "Graph expands", "Or Cypher from LLM", "Cap hop depth"],
      },
      {
        title: "Safety",
        items: ["Max hops / max nodes", "Edge allowlist", "Tenant subgraph", "Cite node sources"],
      },
    ]),
    workflowDiagrams: [
      flow("Typical retrieve", "Identify entities in the question, walk a bounded neighborhood, verbalize.", [
        "Parse entities",
        "Match canonical nodes",
        "k-hop expand",
        "Serialize paths",
        "LLM answers",
      ]),
      flow("Bound the walk", "Unbounded traversal explodes tokens and leaks tenants.", [
        "Max 2 hops",
        "Filter edge types",
        "Tenant subgraph",
        "Hard node cap",
      ]),
    ],
    commandsToRemember: [
      "Seed entity → k-hop neighbors → serialize as context",
      "Cap hops and node count or the prompt explodes",
      "Filter by edge type: acquired, reports_to, located_in",
      "Always retrieve inside the user's tenant subgraph",
    ],
  },
};
