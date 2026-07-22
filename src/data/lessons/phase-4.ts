import type { LessonContent } from "../lesson-types";
import { createLesson, iq } from "./builder";

export const phase4Lessons: Record<string, LessonContent> = {
  "document-loaders": createLesson({
    concept:
      "Document loaders are the ingestion layer of RAG — they read raw data from files, APIs, databases, and SaaS tools and convert it into a standardized document format (text + metadata) that downstream chunking and embedding pipelines can process.",
    whyItExists:
      "Enterprise knowledge lives in PDFs, Confluence pages, Slack threads, S3 buckets, and SQL databases. Without loaders, every RAG project reimplements parsing logic. Loaders abstract format differences so your pipeline stays consistent whether the source is a 200-page legal PDF or a live Notion export.",
    analogy:
      "Document loaders are like airport baggage scanners — every suitcase (file format) looks different on the outside, but the scanner normalizes everything into a standard package the rest of the system can route.",
    technicalExplanation:
      "Production loaders must handle: format parsing (PDF, DOCX, HTML, Markdown, CSV), encoding detection, OCR for scanned documents, table extraction, incremental sync (only load changed docs), and metadata preservation (source URL, author, timestamp, ACLs). LangChain's BaseLoader interface returns Document objects with page_content and metadata. For scale, loaders run as async workers in an ingestion queue — fetch → parse → validate → emit to chunking service. Critical production concerns: PII detection before indexing, rate limiting on API sources, idempotent ingestion (dedupe by content hash), and failure isolation (one corrupt PDF shouldn't block the batch).",
    architecture:
      "Source Connectors (S3, GDrive, SharePoint, APIs) → Loader Workers → Document Normalizer → Validation Layer (schema, PII scan) → Chunking Queue. Each loader implements: load() for batch, lazy_load() for streaming large corpora. Metadata schema is standardized across all sources.",
    diagram: `flowchart LR
    A[PDF / DOCX / HTML] --> B[Document Loader]
    C[API / Database] --> B
    D[SaaS Connector] --> B
    B --> E[Normalize Text + Metadata]
    E --> F[PII / Quality Check]
    F --> G[Chunking Pipeline]`,
    example:
      "A legal firm's RAG system ingests 50,000 PDF contracts from S3. PyMuPDFLoader extracts text per page, attaches metadata {source, page, doc_id, client_id}, and streams documents to the chunker. When a contract is updated, an event triggers re-ingestion of only that document.",
    code: `from langchain_community.document_loaders import (
    PyMuPDFLoader, UnstructuredHTMLLoader, S3DirectoryLoader
)
from langchain_core.documents import Document
from hashlib import sha256

def load_pdf_with_metadata(path: str, doc_id: str) -> list[Document]:
    loader = PyMuPDFLoader(path)
    pages = loader.load()
    for i, doc in enumerate(pages):
        doc.metadata.update({
            "doc_id": doc_id,
            "page": i + 1,
            "source": path,
            "content_hash": sha256(doc.page_content.encode()).hexdigest()[:16],
        })
    return pages

def load_s3_corpus(bucket: str, prefix: str) -> list[Document]:
    loader = S3DirectoryLoader(bucket, prefix=prefix)
    return loader.load()`,
    project:
      "Build a multi-format ingestion service: accept PDF, Markdown, and HTML uploads via API, normalize to Document objects with consistent metadata schema, and write to a staging queue for chunking.",
    interviewQuestions: [
      iq("What metadata should every document carry in a production RAG system?", "At minimum: source URI, document ID, ingestion timestamp, content hash for deduplication. Add domain-specific fields: tenant_id, ACL/permissions, section title, page number, language, and version for incremental updates.", "medium"),
      iq("How do you handle scanned PDFs in document loaders?", "Use OCR (Tesseract, AWS Textract, or unstructured.io) with layout detection. Preserve page boundaries in metadata. Flag low-confidence OCR pages for human review. Never silently index garbled text — quality gates reject documents below confidence threshold.", "hard"),
      iq("Why use lazy_load() instead of load() for large corpora?", "load() loads everything into memory — fails on million-document corpora. lazy_load() yields documents one at a time, enabling streaming to chunkers and backpressure control in queue-based architectures.", "easy"),
    ],
    revisionNotes: {
      fiveMin: ["Loaders convert raw sources → standardized Document objects", "Preserve metadata: source, page, doc_id, ACLs", "Use lazy_load for large corpora", "Idempotent ingestion via content hashing"],
      fifteenMin: ["Support PDF, HTML, Markdown, API, DB sources", "OCR pipeline for scanned documents", "Incremental sync: only re-ingest changed docs", "PII scanning before indexing", "Standardized metadata schema across all loaders", "Failure isolation: one bad doc doesn't block batch"],
      oneHour: ["Build multi-format loader with unified metadata", "S3 event-driven re-ingestion", "OCR fallback for scanned PDFs", "Content hash deduplication", "Rate-limited API source loader", "PII detection gate before chunking"],
      cheatSheet: ["Document = page_content + metadata", "lazy_load() for streaming", "Hash for dedup + idempotency", "OCR for scanned PDFs", "Metadata: source, page, doc_id, tenant_id", "Never index without ACL metadata"],
    },
    glossary: ["Document Loader", "OCR", "Incremental Sync", "Idempotent Ingestion", "Metadata Schema", "Lazy Loading"],
    commonMistakes: [
      "Stripping all metadata — makes filtered retrieval and citations impossible",
      "Loading entire corpus into memory instead of streaming",
      "Ignoring document permissions — indexing content users shouldn't access",
      "No content hashing — duplicate ingestion on every pipeline run",
      "Treating OCR output as ground truth without confidence checks",
    ],
  }),

  chunking: createLesson({
    concept:
      "Chunking splits documents into retrieval-sized segments that fit embedding models and LLM context windows while preserving enough semantic context for accurate answers.",
    whyItExists:
      "LLMs and embedding models have token limits. A 200-page manual can't be embedded or retrieved as one unit. Chunking is the highest-leverage RAG decision — bad chunking causes missed answers, fragmented context, and hallucinations even with perfect retrieval infrastructure.",
    analogy:
      "Chunking is like cutting a textbook into flashcards. Cut too big and each card is overwhelming; cut too small and you lose the sentence that explains what 'it' refers to.",
    technicalExplanation:
      "Chunking strategies: (1) Fixed-size — simple, fast, breaks mid-sentence. (2) Recursive character — splits on paragraph → sentence → word boundaries. (3) Semantic — embed sentences, merge until similarity drops. (4) Structure-aware — respect headers, tables, code blocks. Production parameters: chunk_size 256–1024 tokens, overlap 10–20% to preserve boundary context. Parent-child chunking stores small chunks for retrieval but returns larger parent context to the LLM. Document-type matters: code uses AST-aware splitting, legal docs use section boundaries, chat logs use turn-based chunks.",
    architecture:
      "Document → Structure Parser → Chunking Strategy Selector → Text Splitter → Chunk Validator (min/max size, empty check) → Metadata Enrichment (chunk_index, parent_id) → Embedding Queue.",
    diagram: `flowchart TD
    A[Full Document] --> B{Document Type?}
    B -->|PDF/Legal| C[Section-Aware Split]
    B -->|Code| D[AST-Aware Split]
    B -->|General| E[Recursive Character Split]
    C --> F[Chunks + Overlap]
    D --> F
    E --> F
    F --> G[Parent-Child Index]
    G --> H[Embedding Pipeline]`,
    example:
      "An HR policy handbook uses header-based chunking: each section (e.g., 'Remote Work Policy §3.2') becomes one chunk with metadata {section_title, page}. Overlap of 50 tokens ensures questions spanning section boundaries still retrieve relevant context.",
    code: `from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,
    chunk_overlap=64,
    separators=["\\n\\n", "\\n", ". ", " ", ""],
    length_function=len,
)

chunks = splitter.split_documents(documents)

# Parent-child pattern
parent_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=200)
child_splitter = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=50)

parents = parent_splitter.split_documents(documents)
children = []
for i, parent in enumerate(parents):
    for j, child in enumerate(child_splitter.split_documents([parent])):
        child.metadata["parent_id"] = f"parent_{i}"
        child.metadata["chunk_index"] = j
        children.append(child)`,
    project:
      "Benchmark three chunking strategies (fixed, recursive, semantic) on a 50-question eval set. Measure retrieval recall@5 and answer faithfulness. Document optimal settings per document type.",
    interviewQuestions: [
      iq("How do you choose chunk size for a production RAG system?", "Start with 512 tokens, 10-20% overlap. Evaluate retrieval recall on your eval set. Smaller chunks (256) for precise fact lookup; larger (1024) for narrative docs. Match chunk size to typical answer span in your domain.", "medium"),
      iq("What is parent-child chunking and when do you use it?", "Retrieve small child chunks (high precision) but pass the larger parent chunk to the LLM (full context). Use when answers need surrounding paragraphs — legal clauses, technical procedures, multi-step instructions.", "hard"),
      iq("Why does overlap matter?", "Questions often sit at chunk boundaries. Overlap ensures the relevant sentence appears in at least one chunk. 10-20% overlap is standard; more overlap increases storage cost and duplicate retrieval.", "easy"),
    ],
    revisionNotes: {
      fiveMin: ["Chunking = highest-leverage RAG decision", "512 tokens, 10-20% overlap is a starting point", "Recursive splitting respects sentence boundaries", "Parent-child: small retrieve, large generate"],
      fifteenMin: ["Fixed vs recursive vs semantic vs structure-aware", "Match strategy to document type", "Overlap prevents boundary misses", "Parent-child for context-heavy domains", "Always benchmark on your eval set", "Chunk metadata: index, parent_id, section"],
      oneHour: ["Implement all four chunking strategies", "Parent-child indexing pipeline", "Benchmark recall@k across strategies", "Structure-aware splitting for Markdown/HTML", "Semantic chunking with embedding similarity", "Production chunk validator (empty, too small)"],
      cheatSheet: ["Default: 512 tokens, 64 overlap", "RecursiveCharacterTextSplitter = go-to", "Parent-child: retrieve small, generate large", "Structure-aware for legal/technical docs", "Benchmark before deploying", "Bad chunking ≠ fixable by better embeddings"],
    },
    glossary: ["Chunk Size", "Chunk Overlap", "Recursive Splitting", "Semantic Chunking", "Parent-Child Chunking", "Structure-Aware Splitting"],
    commonMistakes: [
      "Using default 1000-char chunks without domain evaluation",
      "Zero overlap — misses boundary-spanning queries",
      "Splitting tables and code blocks mid-structure",
      "Ignoring document hierarchy (headers, sections)",
      "Same chunking strategy for all document types",
    ],
  }),

  "embedding-models": createLesson({
    concept:
      "Embedding models convert text into dense numerical vectors where semantically similar content maps to nearby points in vector space — enabling similarity search as the core retrieval mechanism in RAG.",
    whyItExists:
      "Keyword search misses paraphrases ('refund policy' vs 'money back guarantee'). Embeddings capture meaning, not just tokens. The embedding model is the lens through which your entire knowledge base becomes searchable — a weak model means weak retrieval regardless of infrastructure.",
    analogy:
      "Embeddings are like GPS coordinates for meaning. Two restaurants described differently ('Italian bistro downtown' vs 'pasta place near Main St') get nearby coordinates if they mean the same thing.",
    technicalExplanation:
      "Embedding models are transformer encoders trained with contrastive loss (similar pairs close, dissimilar pairs far). Key decisions: model choice (OpenAI text-embedding-3-small/large, Cohere embed-v3, BGE, E5), dimensionality (trade storage/latency vs quality), same model for indexing and querying (mandatory), batch size for throughput, and normalization (cosine similarity assumes unit vectors). Production: embed at ingestion time (batch, async), cache query embeddings, monitor embedding drift when swapping models (requires full re-index), and consider domain-specific fine-tuned embedders for specialized corpora (medical, legal).",
    architecture:
      "Text Chunk → Embedding API / Local Model → Float Vector (e.g., 1536-dim) → Vector DB. Query path: User Query → Same Embedding Model → Query Vector → ANN Search. Never mix embedding models between index and query.",
    diagram: `flowchart LR
    A[Text Chunk] --> B[Embedding Model]
    C[User Query] --> B
    B --> D[Vector 1536-dim]
    D --> E[Vector DB Index]
    D --> F[Similarity Search]
    F --> G[Top-K Results]`,
    example:
      "A support bot uses text-embedding-3-small (1536 dims). 'How do I cancel my subscription?' retrieves chunks about cancellation even when docs say 'terminate your plan' — semantic match that BM25 alone would miss.",
    code: `from openai import OpenAI
import numpy as np

client = OpenAI()

def embed_texts(texts: list[str], model: str = "text-embedding-3-small") -> list[list[float]]:
    response = client.embeddings.create(input=texts, model=model)
    return [item.embedding for item in response.data]

def cosine_similarity(a: list[float], b: list[float]) -> float:
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

query_vec = embed_texts(["refund policy"])[0]
doc_vecs = embed_texts(["money back guarantee", "shipping times"])
scores = [cosine_similarity(query_vec, d) for d in doc_vecs]`,
    project:
      "Compare three embedding models on your corpus: measure retrieval recall@10, latency p95, and cost per 1M tokens. Build a model selection matrix for your use case.",
    interviewQuestions: [
      iq("Can you use different embedding models for indexing and querying?", "No. Vectors from different models live in incompatible spaces — similarity scores are meaningless. Swapping models requires full re-embedding and re-indexing of the entire corpus.", "easy"),
      iq("How do you handle embedding model upgrades in production?", "Blue-green index: build new index with new model, A/B test retrieval quality, switch traffic, deprecate old index. Track recall and latency metrics during migration. Never hot-swap without re-indexing.", "hard"),
      iq("OpenAI embeddings vs open-source (BGE, E5)?", "OpenAI: best general quality, API cost, no GPU ops. Open-source: self-hosted, no per-token cost, fine-tunable, but you manage infra. Choose based on data sensitivity, scale, and budget.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["Embeddings = dense vectors capturing semantic meaning", "Same model for index AND query — always", "Cosine similarity for nearest-neighbor search", "Model swap = full re-index required"],
      fifteenMin: ["text-embedding-3-small vs large tradeoff", "Batch embedding at ingestion for throughput", "Normalize vectors for cosine similarity", "Domain-specific models for specialized corpora", "Monitor embedding API latency and cost", "dimensions parameter reduces storage (Matryoshka)"],
      oneHour: ["Embedding pipeline with batching and retry", "Benchmark 3 models on eval set", "Blue-green re-indexing migration", "Local BGE deployment with GPU", "Query embedding cache (Redis)", "Cost analysis: API vs self-hosted at scale"],
      cheatSheet: ["Index + query = same model", "text-embedding-3-small = cost-effective default", "Cosine similarity on normalized vectors", "Batch embed at ingestion", "Re-index on model change", "Matryoshka: lower dims = less storage"],
    },
    glossary: ["Embedding", "Vector Space", "Cosine Similarity", "Contrastive Learning", "Matryoshka Embeddings", "ANN Search"],
    commonMistakes: [
      "Mixing embedding models between index and query",
      "Not batching embedding requests — kills throughput and inflates cost",
      "Skipping re-index when upgrading embedding model",
      "Using oversized models when small ones pass eval thresholds",
      "Ignoring embedding API rate limits in ingestion pipelines",
    ],
  }),

  "vector-db": createLesson({
    concept:
      "Vector databases store embedding vectors and perform approximate nearest neighbor (ANN) search at scale — returning the most semantically similar chunks to a query vector in milliseconds across millions of documents.",
    whyItExists:
      "Brute-force cosine similarity over 10M vectors is O(n) and too slow for production. Vector DBs use indexes (HNSW, IVF) for sub-linear search, plus metadata filtering, multi-tenancy, and persistence. They're the retrieval engine at the heart of every production RAG system.",
    analogy:
      "A vector DB is like a library catalog sorted by meaning instead of alphabet — you hum a tune (query embedding) and it finds the closest matching songs (document chunks) instantly, even in a million-track collection.",
    technicalExplanation:
      "Key capabilities: ANN indexes (HNSW for speed/recall tradeoff, IVF for billion-scale), metadata filtering (tenant_id, date range, doc_type), hybrid search (vector + BM25 in one query), persistence and replication, and multi-tenancy. Popular choices: Pinecone (managed, serverless), Qdrant (self-hosted, rich filtering), Weaviate (hybrid native), Chroma (dev/prototype), pgvector (Postgres extension). Production decisions: index type, ef_construction/M parameters, shard strategy, backup/restore, and monitoring recall@k on production queries.",
    architecture:
      "Embedding Pipeline → Vector DB (HNSW Index + Metadata Store) ← Query Service (ANN Search + Filters) → Retriever → LLM. Separate collections per tenant or namespace. Backup embeddings separately from vectors for disaster recovery.",
    diagram: `flowchart TD
    A[Ingestion] --> B[Vector DB]
    B --> C[HNSW Index]
    B --> D[Metadata Store]
    E[Query Embedding] --> F[ANN Search]
    F --> C
    G[Filters tenant/date] --> D
    C --> H[Top-K Chunks]
    D --> H`,
    example:
      "A SaaS product indexes 5M support articles in Qdrant with payload filters {tenant_id, product_version}. A query embeds the question, searches HNSW index with tenant filter, returns top-10 chunks in 30ms p95.",
    code: `from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue

client = QdrantClient(url="http://localhost:6333")

client.create_collection(
    collection_name="docs",
    vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
)

client.upsert(
    collection_name="docs",
    points=[PointStruct(id=1, vector=embedding, payload={"text": chunk, "tenant_id": "acme"})],
)

results = client.search(
    collection_name="docs",
    query_vector=query_embedding,
    query_filter=Filter(must=[FieldCondition(key="tenant_id", match=MatchValue(value="acme"))]),
    limit=10,
)`,
    project:
      "Deploy Qdrant or pgvector, index 10K chunks with metadata filters, benchmark search latency at 1K/10K/100K scale, and implement tenant-isolated collections.",
    interviewQuestions: [
      iq("HNSW vs IVF — when to use each?", "HNSW: default for most production RAG, excellent recall-speed tradeoff up to tens of millions of vectors. IVF: better for billion-scale when you can tolerate slightly lower recall and need memory efficiency.", "medium"),
      iq("How do you implement multi-tenancy in vector DBs?", "Options: separate collections per tenant (isolation, simpler ACLs), shared collection with tenant_id metadata filter (cost-efficient), or namespace partitioning. Always filter by tenant at query time — never rely on app-layer filtering alone.", "hard"),
      iq("When would you use pgvector instead of a dedicated vector DB?", "When you already run Postgres, dataset is <1M vectors, and you need transactional consistency between vectors and relational data. Dedicated vector DBs win on scale, ANN tuning, and hybrid search features.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["Vector DB = ANN search at scale", "HNSW is the default index type", "Always filter by tenant/metadata at DB level", "Pinecone/Qdrant/Weaviate/pgvector options"],
      fifteenMin: ["HNSW parameters: ef_construction, M", "Metadata filtering combined with vector search", "Multi-tenancy: collections vs payload filters", "Backup strategy: vectors + metadata + source docs", "Monitor p95 latency and recall@k", "Hybrid search built into Weaviate/Qdrant"],
      oneHour: ["Deploy Qdrant with HNSW index", "Tenant-isolated collections", "Benchmark latency at 10K/100K/1M vectors", "pgvector vs Qdrant comparison", "Disaster recovery: re-embed from source", "Production monitoring dashboard"],
      cheatSheet: ["ANN = approximate nearest neighbor", "HNSW = default index", "Filter at DB, not app layer", "Cosine distance for normalized embeddings", "Re-index on embedding model change", "pgvector for Postgres-native stacks"],
    },
    glossary: ["Vector Database", "HNSW", "IVF", "ANN Search", "Metadata Filtering", "Multi-Tenancy"],
    commonMistakes: [
      "No metadata filtering — cross-tenant data leakage",
      "Brute-force search instead of ANN index at scale",
      "Not tuning HNSW parameters for recall requirements",
      "Storing only vectors without retrievable text payload",
      "Single collection for all tenants without access controls",
    ],
  }),

  metadata: createLesson({
    concept:
      "Metadata is structured information attached to each chunk — enabling filtered retrieval, source citations, access control, and debugging — turning a dumb vector search into a precise, context-aware retrieval system.",
    whyItExists:
      "Pure semantic search returns the most similar text regardless of whether it's from the right document, tenant, time period, or access level. Metadata filters narrow the search space and ensure retrieved chunks are relevant, authorized, and citable.",
    analogy:
      "Metadata is like the labels on filing cabinet folders — without them, you might find a similar document, but from the wrong year, wrong department, or wrong client's folder.",
    technicalExplanation:
      "Essential metadata fields: source_uri, doc_id, chunk_index, title, section, page, created_at, updated_at, tenant_id, user_acl, language, content_type. Use metadata for: pre-filtering (search only 2024 policies), post-filtering (re-rank by recency), citation generation (page + section in answers), and debugging (which doc failed retrieval). Design a metadata schema upfront — retrofitting is painful. Index metadata fields in your vector DB for fast filtering. Keep payload size reasonable — store full text in payload, not in metadata.",
    architecture:
      "Ingestion assigns metadata at load → chunking enriches (chunk_index, parent_id) → embedding stores vector + metadata payload → query applies filters before/during ANN search → LLM receives chunks with citation metadata.",
    diagram: `flowchart LR
    A[Document] --> B[Loader Metadata]
    B --> C[Chunk Metadata]
    C --> D[Vector DB Payload]
    E[User Query] --> F[Filter: tenant + date + type]
    F --> D
    D --> G[Filtered Top-K]
    G --> H[Citations in Answer]`,
    example:
      "User asks 'What changed in the Q3 security policy?' System filters metadata {doc_type: 'policy', department: 'security', updated_at: > '2024-07-01'} before vector search, ensuring only recent security policies are retrieved.",
    code: `from qdrant_client.models import Filter, FieldCondition, MatchValue, Range

tenant_filter = Filter(must=[
    FieldCondition(key="tenant_id", match=MatchValue(value="acme")),
    FieldCondition(key="doc_type", match=MatchValue(value="policy")),
    FieldCondition(key="updated_at", range=Range(gte="2024-07-01")),
])

# Attach metadata at chunk time
chunk.metadata.update({
    "doc_id": "pol-2024-q3",
    "section": "Access Control",
    "page": 14,
    "tenant_id": "acme",
    "doc_type": "policy",
    "updated_at": "2024-09-15",
})`,
    project:
      "Design a metadata schema for a multi-tenant legal RAG system. Implement filtered retrieval by client, practice area, and document date. Generate citations with page numbers in LLM responses.",
    interviewQuestions: [
      iq("What metadata fields are essential for production RAG?", "source_uri, doc_id, chunk_index, tenant_id, created_at/updated_at, and ACL fields. Add domain fields: section, page, doc_type, language. Enough to filter, cite, and debug.", "easy"),
      iq("Pre-filter vs post-filter metadata — tradeoffs?", "Pre-filter (during ANN search): faster, respects access control, but wrong filters exclude relevant docs. Post-filter: more flexible but wastes ANN compute on filtered-out results. Use pre-filter for ACLs and tenant isolation; post-filter for soft ranking signals.", "hard"),
      iq("How do metadata filters improve citation quality?", "Each retrieved chunk carries source_uri, page, and section — the LLM cites exact locations. Users verify answers against original documents. Without metadata, answers are unverifiable.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["Metadata enables filtered retrieval + citations", "Always include: source, doc_id, tenant_id", "Pre-filter for ACLs and tenant isolation", "Design schema upfront — hard to retrofit"],
      fifteenMin: ["Essential fields: source, page, section, dates, ACL", "Pre-filter during ANN vs post-filter after", "Citation generation from metadata", "Tenant isolation via metadata filters", "Keep payload lean — text in payload, not metadata", "Version metadata for incremental updates"],
      oneHour: ["Design multi-tenant metadata schema", "Implement pre-filtered vector search", "Citation pipeline with page numbers", "Metadata-driven recency boosting", "Debug dashboard: which docs retrieved", "ACL enforcement at retrieval layer"],
      cheatSheet: ["tenant_id filter = mandatory in SaaS", "source + page = citations", "Pre-filter ACLs at DB level", "Schema design before ingestion", "updated_at for recency filtering", "chunk_index for ordering"],
    },
    glossary: ["Metadata Schema", "Pre-Filtering", "Post-Filtering", "Citation", "ACL", "Payload"],
    commonMistakes: [
      "No tenant_id — cross-tenant data leakage",
      "Metadata schema designed after ingestion started",
      "Storing full document text in metadata instead of payload",
      "No citation fields — unverifiable answers",
      "App-layer filtering instead of DB-level filters",
    ],
  }),

  "hybrid-search": createLesson({
    concept:
      "Hybrid search combines dense vector retrieval (semantic similarity) with sparse keyword retrieval (BM25) and fuses results — capturing both meaning-based matches and exact keyword/symbol matches that embeddings miss.",
    whyItExists:
      "Vector search fails on exact matches: product SKUs, error codes, legal citations, person names, and rare technical terms. BM25 fails on paraphrases. Hybrid search gives the best of both — the default architecture for production RAG in 2024+.",
    analogy:
      "Hybrid search is like finding a restaurant using both 'similar cuisine' recommendations (semantic) and 'exactly named on the sign' lookup (keyword) — together you never miss the right place.",
    technicalExplanation:
      "Pipeline: run vector search (top-k₁) and BM25 search (top-k₂) in parallel → fusion algorithm combines scores → optional re-ranker refines top results. Fusion methods: Reciprocal Rank Fusion (RRF, most popular — rank-based, no score normalization needed), weighted linear combination (requires score normalization), and convex combination. RRF score = Σ 1/(k + rank_i) where k=60 typically. Production: tune k₁ and k₂ independently, A/B test hybrid vs pure vector on your eval set, and monitor which leg contributes to final results.",
    architecture:
      "Query → [Vector Search (ANN) + BM25 Search (Inverted Index)] → Fusion (RRF) → Re-ranker (optional) → Top-K → LLM Context.",
    diagram: `flowchart TD
    Q[User Query] --> V[Vector Search Top-20]
    Q --> B[BM25 Search Top-20]
    V --> F[Reciprocal Rank Fusion]
    B --> F
    F --> R[Cross-Encoder Re-rank]
    R --> L[Top-5 to LLM]`,
    example:
      "Query: 'error ECONNREFUSED in payment service'. BM25 matches the exact error code in logs. Vector search finds semantically related troubleshooting docs. RRF fusion surfaces both — neither alone would rank the combined result set optimally.",
    code: `def reciprocal_rank_fusion(results_lists: list[list[str]], k: int = 60) -> list[tuple[str, float]]:
  scores: dict[str, float] = {}
  for results in results_lists:
    for rank, doc_id in enumerate(results):
      scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank + 1)
  return sorted(scores.items(), key=lambda x: x[1], reverse=True)

vector_ids = ["doc_a", "doc_c", "doc_b"]  # from ANN search
bm25_ids = ["doc_b", "doc_d", "doc_a"]   # from BM25
fused = reciprocal_rank_fusion([vector_ids, bm25_ids])
# doc_a and doc_b score highest (appear in both lists)`,
    project:
      "Implement hybrid search with vector + BM25 + RRF fusion. Benchmark on 100 queries where 30% need exact keyword match. Compare pure vector, pure BM25, and hybrid recall@10.",
    interviewQuestions: [
      iq("Why is RRF preferred over weighted score combination?", "RRF uses ranks, not raw scores — vector cosine scores and BM25 scores aren't comparable scales. RRF is parameter-light (just k=60), robust, and consistently outperforms naive weighted averaging.", "medium"),
      iq("When does hybrid search NOT help?", "Homogeneous corpora with consistent vocabulary where paraphrase is the only variation — pure vector may suffice. Also when latency budget can't afford two searches (mitigate with caching).", "easy"),
      iq("How do you tune k values for each search leg?", "Start with k=20 each, fuse to top-10. Evaluate recall@10 on eval set. Increase BM25 k for keyword-heavy domains (support logs, legal). Increase vector k for narrative docs.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["Hybrid = vector (semantic) + BM25 (keyword)", "RRF fusion = rank-based, no score normalization", "Default: top-20 each leg, fuse to top-10", "Hybrid is production default for RAG"],
      fifteenMin: ["Vector fails on SKUs, error codes, names", "BM25 fails on paraphrases", "RRF: score = Σ 1/(60 + rank)", "Run both searches in parallel", "A/B test hybrid vs pure vector", "Add re-ranker after fusion for precision"],
      oneHour: ["Implement vector + BM25 + RRF pipeline", "Benchmark on keyword-heavy queries", "Tune k per search leg", "Parallel search with async", "Monitor which leg wins per query type", "Weaviate/Qdrant native hybrid search"],
      cheatSheet: ["RRF k=60 default", "Parallel vector + BM25", "Vector=meaning, BM25=exact", "Fuse top-20 → return top-10", "Re-rank after fusion", "A/B test before deploying"],
    },
    glossary: ["Hybrid Search", "Reciprocal Rank Fusion", "BM25", "Dense Retrieval", "Sparse Retrieval", "Score Fusion"],
    commonMistakes: [
      "Averaging incomparable scores from vector and BM25 directly",
      "Only using vector search for technical/support corpora",
      "Not running searches in parallel — doubles latency unnecessarily",
      "Skipping eval on keyword-heavy query subset",
      "Fusing too many candidates without re-ranking — noise in context",
    ],
  }),

  bm25: createLesson({
    concept:
      "BM25 (Best Matching 25) is a probabilistic keyword ranking algorithm that scores documents by term frequency and inverse document frequency — the sparse retrieval backbone of hybrid search systems.",
    whyItExists:
      "Embeddings smooth over rare tokens — 'CVE-2024-1234' and 'JIRA-4521' get lost in semantic space. BM25 excels at exact term matching, rare word sensitivity, and interpretability. It's fast, well-understood, and requires no GPU.",
    analogy:
      "BM25 is like a library index card system — it finds books containing the exact words you searched for, weighted by how rare and important those words are in the collection.",
    technicalExplanation:
      "BM25 score = Σ IDF(qi) × (f(qi,D) × (k1+1)) / (f(qi,D) + k1×(1-b+b×|D|/avgdl)). Parameters: k1 (term saturation, default 1.2), b (length normalization, default 0.75). IDF downweights common terms ('the', 'is') and boosts rare terms. Implementations: Elasticsearch, OpenSearch, rank_bm25 (Python), and built into Weaviate/Qdrant. Production: tokenize consistently with index, handle stemming carefully (can hurt SKUs), and rebuild index on corpus updates.",
    architecture:
      "Corpus → Tokenizer → Inverted Index (term → doc frequencies) → BM25 Scorer. At query time: tokenize query → lookup postings → score all matching docs → return top-k.",
    diagram: `flowchart LR
    A[Document Corpus] --> B[Tokenizer]
    B --> C[Inverted Index]
    D[Query] --> E[Tokenize Query]
    E --> F[BM25 Scorer]
    C --> F
    F --> G[Ranked Doc IDs]`,
    example:
      "Query 'PTO policy section 4.2' — BM25 matches exact section reference in the employee handbook. Vector search might return general PTO content but miss the specific section. BM25 pinpoints it.",
    code: `from rank_bm25 import BM25Okapi

corpus = [doc.page_content for doc in chunks]
tokenized = [doc.lower().split() for doc in corpus]
bm25 = BM25Okapi(tokenized)

query_tokens = "PTO policy section 4.2".lower().split()
scores = bm25.get_scores(query_tokens)
top_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:10]
results = [chunks[i] for i in top_indices]`,
    project:
      "Build a BM25 index over your document corpus. Identify 20 queries where BM25 outperforms vector search. Integrate as the sparse leg of a hybrid pipeline.",
    interviewQuestions: [
      iq("What are k1 and b in BM25?", "k1 controls term frequency saturation (higher = more weight on repeated terms, default 1.2). b controls document length normalization (0 = ignore length, 1 = full normalization, default 0.75).", "medium"),
      iq("Why does BM25 beat vector search on error codes and IDs?", "Embeddings treat rare tokens as noise — they have weak representations for unseen IDs. BM25 treats exact token matches as strong signals, especially for rare terms with high IDF.", "easy"),
      iq("How do you keep BM25 index in sync with vector index?", "Event-driven updates: on document change, update both indexes atomically or use eventual consistency with version checks. Periodic full rebuild for small corpora. Monitor index lag.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["BM25 = keyword ranking via TF-IDF variant", "Excels at exact matches, SKUs, error codes", "Sparse leg of hybrid search", "k1=1.2, b=0.75 defaults"],
      fifteenMin: ["IDF downweights common terms", "Term frequency saturates (not linear)", "Length normalization via parameter b", "rank_bm25 for Python, Elasticsearch at scale", "Stemming can break SKUs — be careful", "Keep BM25 index synced with vector index"],
      oneHour: ["Build BM25 index with rank_bm25", "Compare BM25 vs vector on 50 queries", "Integrate into hybrid pipeline with RRF", "Elasticsearch BM25 for production scale", "Tokenization strategy for technical docs", "Index sync on document updates"],
      cheatSheet: ["BM25 = sparse/keyword retrieval", "IDF boosts rare terms", "k1=1.2, b=0.75", "Exact match > semantic for IDs", "Hybrid with vector via RRF", "Elasticsearch for production scale"],
    },
    glossary: ["BM25", "TF-IDF", "Inverted Index", "IDF", "Sparse Retrieval", "Term Frequency"],
    commonMistakes: [
      "Aggressive stemming breaking product codes and IDs",
      "Not updating BM25 index when documents change",
      "Using BM25 alone for paraphrase-heavy queries",
      "Inconsistent tokenization between index and query",
      "Ignoring BM25 in favor of pure vector search",
    ],
  }),

  "cross-encoder": createLesson({
    concept:
      "A cross-encoder is a transformer model that jointly encodes a query-document pair and outputs a relevance score — far more accurate than bi-encoder similarity but too slow for first-stage retrieval over millions of docs.",
    whyItExists:
      "Bi-encoder embeddings compare pre-computed vectors — fast but shallow (no cross-attention between query and document). Cross-encoders see query and document together, enabling deep interaction understanding. They're the precision layer applied to a small candidate set after fast retrieval.",
    analogy:
      "Bi-encoder is like comparing two dating profiles from a distance. Cross-encoder is like sitting across the table on a date — you see the full interaction and judge compatibility much more accurately.",
    technicalExplanation:
      "Cross-encoder architecture: concatenate [CLS] query [SEP] document [SEP], pass through transformer, classify relevance from [CLS] token. Models: ms-marco-MiniLM-L-6-v2 (fast), bge-reranker-large (accurate). Latency: ~50-100ms per pair. Production pattern: retrieve top-50 with bi-encoder/BM25 → re-rank top-50 with cross-encoder → pass top-5 to LLM. Never use cross-encoder as first-stage retriever at scale.",
    architecture:
      "Query + Top-50 Candidates → Cross-Encoder Scoring (query-doc pairs) → Sort by Score → Top-5 → LLM. Runs on GPU for throughput. Batch pairs for efficiency.",
    diagram: `flowchart LR
    A[Query] --> B[Bi-Encoder Top-50]
    B --> C[Cross-Encoder]
    A --> C
    C --> D[Relevance Scores]
    D --> E[Top-5 to LLM]`,
    example:
      "Query: 'How to reset MFA for SSO users?' Bi-encoder retrieves 50 chunks about MFA, SSO, and password reset. Cross-encoder scores each pair and promotes the chunk specifically about 'SSO MFA reset procedure' to rank 1.",
    code: `from sentence_transformers import CrossEncoder

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

query = "How to reset MFA for SSO users?"
candidates = [chunk.page_content for chunk in retrieved_chunks]

pairs = [[query, doc] for doc in candidates]
scores = reranker.predict(pairs)

ranked = sorted(zip(retrieved_chunks, scores), key=lambda x: x[1], reverse=True)
top_5 = [chunk for chunk, score in ranked[:5]]`,
    project:
      "Add a cross-encoder re-ranking step to your RAG pipeline. Measure precision@5 before and after re-ranking on 50 eval queries.",
    interviewQuestions: [
      iq("Bi-encoder vs cross-encoder — when to use each?", "Bi-encoder: first-stage retrieval over millions of docs (fast, pre-computed). Cross-encoder: re-ranking top-50 candidates (slow, accurate). Always use both in production — never cross-encoder alone at scale.", "medium"),
      iq("Why can't you use a cross-encoder for full corpus search?", "Must encode every query-document pair at query time — O(n) model forward passes. 1M docs × 100ms = 27 hours. Bi-encoder pre-computes doc vectors; cross-encoder only runs on ~50 candidates.", "easy"),
      iq("How do you batch cross-encoder inference for latency?", "Batch all query-doc pairs in one forward pass. Use GPU. Typical: 50 pairs batched = ~200ms total vs 5 seconds sequential. Consider ONNX optimization for production.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["Cross-encoder = query+doc joint scoring", "Too slow for full corpus — re-rank top-50 only", "Bi-encoder retrieves, cross-encoder refines", "ms-marco-MiniLM for speed, bge-reranker for accuracy"],
      fifteenMin: ["Cross-attention between query and document", "50-100ms per pair — batch on GPU", "Retrieve 50 → re-rank → top 5 to LLM", "Major precision improvement over bi-encoder alone", "Never skip re-ranking in production RAG", "ONNX export for inference optimization"],
      oneHour: ["Implement cross-encoder re-ranking step", "Benchmark precision@5 before/after", "GPU batching for 50 pairs", "Compare MiniLM vs bge-reranker-large", "Latency budget: retrieval + re-rank + LLM", "Fallback when re-ranker unavailable"],
      cheatSheet: ["Retrieve 50 → re-rank → top 5", "Cross-encoder = slow + accurate", "Bi-encoder = fast + approximate", "Batch pairs on GPU", "ms-marco-MiniLM-L-6-v2 = fast default", "Never cross-encoder on full corpus"],
    },
    glossary: ["Cross-Encoder", "Bi-Encoder", "Re-Ranking", "MS MARCO", "Cross-Attention", "Relevance Score"],
    commonMistakes: [
      "Using cross-encoder as first-stage retriever",
      "Re-ranking too many candidates (>100) — latency explosion",
      "Not batching pairs — sequential inference kills throughput",
      "Skipping re-ranking to save latency — precision drops significantly",
      "Re-ranking without evaluating precision improvement",
    ],
  }),

  "re-ranking": createLesson({
    concept:
      "Re-ranking is the second-stage refinement step in retrieval — taking a broad candidate set from fast retrievers and reordering by deep relevance signals before passing the best chunks to the LLM.",
    whyItExists:
      "First-stage retrievers (vector, BM25) optimize for recall — cast a wide net. But top-k from ANN search includes false positives. Re-ranking optimizes precision — ensuring the 5 chunks the LLM sees are truly the most relevant. This directly reduces hallucination and improves answer quality.",
    analogy:
      "Re-ranking is like a hiring funnel: recruiters (first-stage retrievers) send 50 resumes, but the hiring manager (re-ranker) personally interviews the best candidates before making a final shortlist of 5.",
    technicalExplanation:
      "Re-ranking pipeline: retrieve k=50-100 candidates → score with cross-encoder, LLM-based reranker (Cohere Rerank, Jina), or learning-to-rank model → return top-n=5. Multi-stage: hybrid fusion → cross-encoder → optional LLM rerank for high-stakes queries. Monitor: precision@n, nDCG, and latency contribution. Cohere Rerank API handles batching and scaling. For cost-sensitive apps, cross-encoder on GPU is cheaper at scale than LLM reranking.",
    architecture:
      "Hybrid Retrieval (top-50) → Cross-Encoder Re-rank (top-10) → [Optional LLM Re-rank (top-5)] → Context Assembly → LLM Generation.",
    diagram: `flowchart TD
    A[Hybrid Top-50] --> B[Cross-Encoder Re-rank]
    B --> C[Top-10]
    C --> D{High Stakes?}
    D -->|Yes| E[LLM Re-rank Top-5]
    D -->|No| F[Top-5 to LLM]
    E --> F`,
    example:
      "Enterprise support bot retrieves 50 chunks via hybrid search, re-ranks with Cohere Rerank v3 to top-5. Precision@5 improves from 0.6 to 0.85. Answer faithfulness on eval set jumps 20%.",
    code: `import cohere

co = cohere.Client()

query = "How do I configure SAML SSO?"
doc_texts = [c.page_content for c in candidates]

response = co.rerank(
    model="rerank-english-v3.0",
    query=query,
    documents=doc_texts,
    top_n=5,
)

reranked = [candidates[r.index] for r in response.results]`,
    project:
      "Add re-ranking to your RAG pipeline using both a local cross-encoder and Cohere Rerank API. Compare precision@5, latency, and cost. Document when each is appropriate.",
    interviewQuestions: [
      iq("How many candidates should you retrieve before re-ranking?", "Retrieve 50-100, re-rank to 5-10. Too few candidates misses relevant docs (low recall). Too many adds latency without precision gain. Tune on your eval set.", "medium"),
      iq("Cross-encoder vs LLM-based re-ranking?", "Cross-encoder: faster, cheaper, self-hosted, good for most cases. LLM reranker (Cohere, GPT): better on complex queries, API cost, higher latency. Use LLM rerank for high-stakes; cross-encoder for volume.", "hard"),
      iq("What metrics measure re-ranker quality?", "precision@k, nDCG@k, MRR (mean reciprocal rank). Evaluate on labeled query-document relevance pairs. A/B test answer faithfulness end-to-end, not just retrieval metrics.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["Re-ranking = precision layer after broad retrieval", "Retrieve 50 → re-rank → top 5", "Cross-encoder or Cohere Rerank", "Directly improves answer quality"],
      fifteenMin: ["First stage = recall, re-rank = precision", "Cross-encoder for self-hosted", "Cohere Rerank for managed API", "Optional LLM rerank for high-stakes", "Measure precision@5 and nDCG", "Latency budget: ~200ms for re-ranking"],
      oneHour: ["Two-stage retrieval pipeline", "Cross-encoder + Cohere comparison", "Eval precision@5 before/after", "Multi-stage: hybrid → cross-encoder → LLM", "Cost analysis at 10K queries/day", "Fallback when re-ranker times out"],
      cheatSheet: ["Retrieve wide, re-rank narrow", "50 candidates → top 5", "precision@5 is key metric", "Cross-encoder = self-hosted", "Cohere Rerank = managed", "Always measure end-to-end faithfulness"],
    },
    glossary: ["Re-Ranking", "Precision@K", "nDCG", "MRR", "Learning to Rank", "Two-Stage Retrieval"],
    commonMistakes: [
      "Passing top-5 from ANN directly to LLM without re-ranking",
      "Re-ranking too few candidates — recall suffers",
      "Optimizing retrieval metrics without measuring answer quality",
      "No latency budget for re-ranking step",
      "Using expensive LLM reranking when cross-encoder suffices",
    ],
  }),

  "query-expansion": createLesson({
    concept:
      "Query expansion rewrites, enriches, or decomposes user queries before retrieval — generating multiple search queries from one user question to improve recall across varied document phrasings.",
    whyItExists:
      "Users ask vague, abbreviated, or differently-phrased questions than documents use. 'PTO' vs 'paid time off', 'k8s' vs 'Kubernetes'. Query expansion bridges the vocabulary gap between user language and document language, reducing missed retrievals.",
    analogy:
      "Query expansion is like a librarian who hears 'books about the war' and also searches for 'WWII', 'World War 2', '1940s conflict', and 'European theatre' — covering all ways the topic might be cataloged.",
    technicalExplanation:
      "Techniques: (1) LLM query rewriting — GPT generates 3-5 alternative phrasings. (2) HyDE (Hypothetical Document Embeddings) — LLM generates a hypothetical answer, embed that instead of the query. (3) Multi-query — decompose complex questions into sub-queries. (4) Synonym expansion — domain thesaurus. (5) Step-back prompting — generate a broader question first. Production: run expanded queries in parallel, fuse results with RRF, cap total latency. Cache expanded queries for common patterns.",
    architecture:
      "User Query → Query Expander (LLM / HyDE / Synonyms) → [Query₁, Query₂, Query₃] → Parallel Retrieval → RRF Fusion → Re-rank → LLM.",
    diagram: `flowchart TD
    Q[User Query] --> E[Query Expander]
    E --> Q1[Rewritten Query 1]
    E --> Q2[Rewritten Query 2]
    E --> Q3[HyDE Document]
    Q1 --> R[Parallel Retrieval]
    Q2 --> R
    Q3 --> R
    R --> F[RRF Fusion]
    F --> L[LLM]`,
    example:
      "User asks 'k8s pod crash'. Expander generates: 'Kubernetes pod crash troubleshooting', 'container restart loop debugging', 'pod OOMKilled resolution'. Three parallel retrievals fuse to surface docs using any of these phrasings.",
    code: `from openai import OpenAI

client = OpenAI()

def expand_query(query: str) -> list[str]:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": f"""Generate 3 alternative search queries for: "{query}"
            Return as JSON list of strings."""
        }],
        response_format={"type": "json_object"},
        temperature=0.3,
    )
    import json
    return json.loads(response.choices[0].message.content)["queries"]

def hyde_query(query: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": f"Write a short paragraph that would answer: {query}"
        }],
        temperature=0,
    )
    return response.choices[0].message.content`,
    project:
      "Implement LLM query expansion and HyDE for your RAG system. Measure recall@10 improvement on 50 queries with vocabulary mismatches.",
    interviewQuestions: [
      iq("What is HyDE and when does it help?", "Hypothetical Document Embeddings: LLM generates a fake answer, you embed that instead of the query. Helps when queries are short/vague and documents are long/detailed. Risk: hypothetical doc may hallucinate off-topic content.", "medium"),
      iq("How do you prevent query expansion from hurting latency?", "Run expanded queries in parallel (asyncio), cap at 3 variants, cache common expansions, skip expansion for exact-match queries (detect IDs, codes). Budget: expansion adds ~200ms for LLM call.", "hard"),
      iq("Query expansion vs fine-tuning embeddings?", "Query expansion is cheaper, immediate, no re-indexing. Fine-tuning embeddings learns domain vocabulary permanently. Use expansion first; fine-tune if expansion insufficient and you have training pairs.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["Query expansion bridges user ↔ document vocabulary", "LLM rewriting, HyDE, multi-query techniques", "Run expanded queries in parallel", "Fuse results with RRF"],
      fifteenMin: ["HyDE: embed hypothetical answer, not query", "Multi-query for complex questions", "Cap at 3 variants for latency", "Cache common expansions", "Skip expansion for exact-match queries", "Measure recall improvement on eval set"],
      oneHour: ["LLM query rewriting pipeline", "HyDE implementation", "Parallel retrieval + RRF fusion", "Latency budget analysis", "Compare expansion vs fine-tuned embeddings", "A/B test in production"],
      cheatSheet: ["Expand before retrieve", "HyDE = embed fake answer", "3 variants max", "Parallel search + RRF", "Cache expansions", "Skip for exact IDs/codes"],
    },
    glossary: ["Query Expansion", "HyDE", "Multi-Query Retrieval", "Query Rewriting", "Step-Back Prompting", "RRF Fusion"],
    commonMistakes: [
      "Generating too many variants — latency and cost explosion",
      "Sequential instead of parallel expanded retrieval",
      "HyDE hallucinating off-topic hypothetical documents",
      "Expanding queries that are already precise (SKUs, IDs)",
      "Not measuring whether expansion actually improves recall",
    ],
  }),

  compression: createLesson({
    concept:
      "Context compression reduces retrieved chunks to only the sentences relevant to the query before passing them to the LLM — fitting more information into limited context windows while reducing noise and cost.",
    whyItExists:
      "Retrieved chunks contain irrelevant sentences. Passing 5 full chunks (2500 tokens) to the LLM wastes context window, increases cost, and adds noise that causes hallucination. Compression extracts query-relevant excerpts — often reducing context by 60-80% with no quality loss.",
    analogy:
      "Compression is like highlighting only the relevant paragraphs in five textbook chapters before an exam — you keep the signal, ditch the filler.",
    technicalExplanation:
      "Techniques: (1) LLMLingua / LongLLMLingua — prompt compression via token pruning. (2) Extractive compression — embed sentences, keep top-k most similar to query. (3) Abstractive — LLM summarizes each chunk relative to query. (4) Contextual compression retriever (LangChain) — wraps retriever with compression step. Production: compress after re-ranking (don't waste compute on discarded chunks), target 30-50% of original token count, and validate answer quality doesn't drop on eval set.",
    architecture:
      "Retrieved Chunks (top-5) → Sentence Splitter → Relevance Scorer (embedding similarity to query) → Keep Top Sentences → Assembled Context → LLM.",
    diagram: `flowchart LR
    A[Top-5 Chunks] --> B[Split Sentences]
    B --> C[Score vs Query]
    C --> D[Keep Top Sentences]
    D --> E[Compressed Context]
    E --> F[LLM Generation]`,
    example:
      "Five 500-token policy chunks retrieved. Compression extracts 15 most query-relevant sentences (400 tokens total). LLM receives focused context, generates accurate answer at 40% lower input token cost.",
    code: `from langchain.retrievers.document_compressors import EmbeddingsFilter
from langchain.retrievers import ContextualCompressionRetriever

compressor = EmbeddingsFilter(embeddings=embeddings, similarity_threshold=0.76)
compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=vectorstore.as_retriever(search_kwargs={"k": 10}),
)

compressed_docs = compression_retriever.invoke("What is the refund window?")`,
    project:
      "Add extractive compression to your RAG pipeline. Measure token reduction, cost savings, and answer faithfulness before/after compression on 30 queries.",
    interviewQuestions: [
      iq("When should you NOT compress context?", "When chunks are already small and focused (<200 tokens). When exact wording matters (legal quotes, code). When compression latency exceeds savings. Always validate on eval set.", "medium"),
      iq("Extractive vs abstractive compression?", "Extractive: keeps original sentences (faithful, fast, no hallucination risk). Abstractive: LLM rewrites (more compact, risk of altering meaning). Prefer extractive for factual RAG.", "easy"),
      iq("How does compression interact with citations?", "Extractive compression preserves original sentences — citations still valid. Abstractive may paraphrase — citations become unreliable. Track which sentences came from which chunk for citation mapping.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["Compression = keep only query-relevant sentences", "Reduces tokens 60-80%, cuts cost and noise", "Extractive > abstractive for factual RAG", "Compress after re-ranking, not before"],
      fifteenMin: ["EmbeddingsFilter for extractive compression", "LLMLingua for prompt-level compression", "ContextualCompressionRetriever in LangChain", "Target 30-50% of original tokens", "Validate faithfulness on eval set", "Preserve citations with extractive approach"],
      oneHour: ["Extractive compression pipeline", "Token reduction measurement", "Cost savings calculation", "Faithfulness before/after comparison", "LLMLingua integration", "Compression + citation tracking"],
      cheatSheet: ["Compress after re-rank", "Extractive = safe for facts", "similarity_threshold=0.76 start", "Measure token reduction + quality", "Skip for small chunks", "ContextualCompressionRetriever"],
    },
    glossary: ["Context Compression", "Extractive Compression", "LLMLingua", "EmbeddingsFilter", "Token Reduction", "Contextual Compression"],
    commonMistakes: [
      "Abstractive compression altering factual content",
      "Compressing before re-ranking — wastes compute",
      "Over-compressing — removing critical context",
      "Not measuring faithfulness after compression",
      "Breaking citation mapping with abstractive summaries",
    ],
  }),

  caching: createLesson({
    concept:
      "Caching in RAG stores and reuses expensive computation results — query embeddings, retrieval results, and LLM responses — to reduce latency, cost, and load on downstream services.",
    whyItExists:
      "RAG pipelines make 3-5 expensive calls per query: embed query, vector search, re-rank, LLM generate. Many queries repeat ('What is our refund policy?'). Without caching, you pay full cost every time. Caching can cut p95 latency by 80% and API costs by 50%+ for support and FAQ use cases.",
    analogy:
      "Caching is like a restaurant keeping popular dishes pre-made — the first customer waits 20 minutes, but the next fifty get served in 2 minutes because the kitchen already has it ready.",
    technicalExplanation:
      "Cache layers: (1) Query embedding cache — hash query text → stored vector. (2) Retrieval cache — hash(query + filters) → top-k doc IDs. (3) Semantic cache — embed query, find similar cached queries above threshold (GPTCache). (4) LLM response cache — exact or semantic match returns stored answer. (5) Prompt cache (OpenAI/Anthropic) — cache static system prompt prefix. Invalidation: TTL-based, event-driven on document update, version-keyed on pipeline changes. Production: Redis for hot cache, cache hit rate monitoring, and graceful degradation on cache miss.",
    architecture:
      "Query → [Embedding Cache → Retrieval Cache → Semantic Response Cache] → on miss: full pipeline → store results. Document update event → invalidate affected cache keys.",
    diagram: `flowchart TD
    Q[Query] --> E{Embedding Cache?}
    E -->|Hit| R{Retrieval Cache?}
    E -->|Miss| EM[Embed Query]
    EM --> R
    R -->|Hit| C{Response Cache?}
    R -->|Miss| RET[Full Retrieval]
    RET --> C
    C -->|Hit| A[Return Cached Answer]
    C -->|Miss| LLM[LLM Generate]
    LLM --> S[Store in Cache]
    S --> A`,
    example:
      "Support bot sees 'how to reset password' 500 times/day. Semantic cache (threshold 0.95) matches 85% to cached responses. Average latency drops from 2.1s to 180ms. Monthly LLM cost reduced 60%.",
    code: `import hashlib
import json
import redis

cache = redis.Redis()

def cache_key(prefix: str, query: str, filters: dict) -> str:
    raw = f"{query}:{json.dumps(filters, sort_keys=True)}"
    return f"{prefix}:{hashlib.sha256(raw.encode()).hexdigest()}"

def get_cached_retrieval(query: str, filters: dict) -> list | None:
    key = cache_key("retrieval", query, filters)
    data = cache.get(key)
    return json.loads(data) if data else None

def set_cached_retrieval(query: str, filters: dict, results: list, ttl: int = 3600):
    key = cache_key("retrieval", query, filters)
    cache.setex(key, ttl, json.dumps(results))`,
    project:
      "Implement a two-layer cache (embedding + retrieval) with Redis. Measure hit rate, latency improvement, and cost savings over 1000 simulated queries with 30% repetition.",
    interviewQuestions: [
      iq("Semantic cache vs exact cache — tradeoffs?", "Exact: hash match only, fast, no false positives. Semantic: matches paraphrased queries, higher hit rate, but risk of returning wrong answer for similar-but-different questions. Use high similarity threshold (0.95+) for semantic.", "medium"),
      iq("How do you invalidate cache when documents update?", "Event-driven: on doc update, invalidate retrieval cache keys containing that doc_id. TTL as safety net. Version-key caches with corpus version number — bump version on re-index to invalidate all.", "hard"),
      iq("What is prompt caching from OpenAI/Anthropic?", "Provider caches the static prefix of your prompt (system prompt + retrieved docs) across requests. 50-90% discount on cached input tokens. Structure prompts with static content first, dynamic query last.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["Cache embeddings, retrieval, and responses", "Redis for hot cache layer", "Semantic cache matches paraphrased queries", "Invalidate on document updates"],
      fifteenMin: ["Embedding cache: hash query → vector", "Retrieval cache: hash query+filters → doc IDs", "GPTCache for semantic response matching", "OpenAI prompt caching for static prefixes", "TTL + event-driven invalidation", "Monitor hit rate and cost savings"],
      oneHour: ["Redis embedding + retrieval cache", "Semantic cache with similarity threshold", "Cache invalidation on doc update", "Hit rate and latency dashboard", "Cost savings analysis", "Provider prompt caching optimization"],
      cheatSheet: ["Cache at every expensive step", "Redis = hot cache", "Semantic threshold ≥ 0.95", "Invalidate on doc update", "Prompt cache: static first", "Monitor hit rate"],
    },
    glossary: ["Semantic Cache", "GPTCache", "Cache Invalidation", "TTL", "Prompt Caching", "Hit Rate"],
    commonMistakes: [
      "No cache invalidation — stale answers after doc updates",
      "Semantic cache threshold too low — wrong answers returned",
      "Caching before evaluation pipeline is stable",
      "Not monitoring cache hit rate",
      "Ignoring provider-level prompt caching discounts",
    ],
  }),

  evaluation: createLesson({
    concept:
      "RAG evaluation systematically measures retrieval quality, answer faithfulness, and end-to-end system performance using labeled datasets and automated metrics — the only way to know if your pipeline actually works.",
    whyItExists:
      "Without evaluation, you're flying blind — tweaking chunk size, swapping models, and adding re-rankers with no idea if changes help or hurt. Production RAG degrades silently as documents change, queries shift, and models update. Evaluation is the feedback loop that keeps quality high.",
    analogy:
      "RAG evaluation is like a restaurant health inspection — you can't judge food safety by how the kitchen looks. You need standardized tests (metrics) run regularly to catch problems before customers do.",
    technicalExplanation:
      "Evaluation layers: (1) Retrieval metrics — precision@k, recall@k, MRR, nDCG. (2) Generation metrics — faithfulness (answer grounded in context?), relevance (answers the question?), correctness (matches ground truth). (3) End-to-end — LLM-as-judge, human evaluation. Frameworks: RAGAS (faithfulness, answer_relevancy, context_precision), DeepEval, custom eval sets. Build a golden dataset: 100-500 question-answer pairs with expected source documents. Run eval on every pipeline change. Track metrics over time in a dashboard.",
    architecture:
      "Golden Dataset (Q, A, Source Docs) → RAG Pipeline → Predictions → Metrics Engine (RAGAS/Custom) → Dashboard → CI/CD Gate (block deploy if metrics drop).",
    diagram: `flowchart TD
    A[Golden Dataset] --> B[RAG Pipeline]
    B --> C[Predictions]
    C --> D[RAGAS Metrics]
    D --> E[Faithfulness]
    D --> F[Context Precision]
    D --> G[Answer Relevancy]
    E --> H[Dashboard]
    F --> H
    G --> H
    H --> I{Pass Threshold?}
    I -->|Yes| J[Deploy]
    I -->|No| K[Block + Alert]`,
    example:
      "Team changes chunk size from 512 to 1024. Eval suite runs: context_precision drops 8%, faithfulness unchanged, answer_relevancy up 3%. Decision: keep 512 — precision drop outweighs relevancy gain for their factual Q&A use case.",
    code: `from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision
from datasets import Dataset

eval_data = Dataset.from_dict({
    "question": ["What is the refund policy?", "How do I reset MFA?"],
    "answer": ["30-day refund window...", "Go to Settings > Security..."],
    "contexts": [["chunk1 text", "chunk2 text"], ["chunk3 text"]],
    "ground_truth": ["30 days", "Settings > Security > Reset MFA"],
})

results = evaluate(
    eval_data,
    metrics=[faithfulness, answer_relevancy, context_precision],
)
print(results)`,
    project:
      "Build a 100-question golden eval set for your RAG system. Integrate RAGAS metrics into a CI pipeline that blocks deployment if faithfulness drops below 0.85.",
    interviewQuestions: [
      iq("What RAGAS metrics matter most?", "faithfulness (is answer grounded in retrieved context?), context_precision (are retrieved chunks relevant?), answer_relevancy (does answer address the question?). Start with these three.", "medium"),
      iq("How do you build a golden evaluation dataset?", "Collect real user queries, have domain experts write ground-truth answers, annotate expected source documents. Start with 100 pairs, grow to 500. Include edge cases, adversarial queries, and multi-hop questions.", "hard"),
      iq("Retrieval eval vs end-to-end eval — what to optimize first?", "Retrieval first — if wrong chunks are retrieved, no amount of prompt engineering fixes generation. Optimize context_precision and recall@k before faithfulness. Then tune generation.", "easy"),
    ],
    revisionNotes: {
      fiveMin: ["Eval = only way to know if RAG works", "RAGAS: faithfulness, context_precision, answer_relevancy", "Golden dataset: 100+ Q&A pairs with source docs", "Run eval on every pipeline change"],
      fifteenMin: ["Retrieval metrics: precision@k, recall@k, MRR", "Generation metrics: faithfulness, relevance", "RAGAS framework for automated eval", "LLM-as-judge for scalability", "CI/CD gate: block deploy on metric drop", "Track metrics over time in dashboard"],
      oneHour: ["Build 100-question golden dataset", "RAGAS eval pipeline", "Retrieval vs generation metric analysis", "CI integration with threshold gates", "A/B test pipeline changes with eval", "Human eval for high-stakes validation"],
      cheatSheet: ["RAGAS: faithfulness + precision + relevancy", "Golden set: Q + A + source docs", "Fix retrieval before generation", "Eval on every change", "CI gate on faithfulness ≥ 0.85", "500 pairs for production confidence"],
    },
    glossary: ["RAGAS", "Faithfulness", "Context Precision", "Answer Relevancy", "Golden Dataset", "nDCG"],
    commonMistakes: [
      "No eval dataset — tuning based on gut feel",
      "Only measuring answer quality, not retrieval quality",
      "Eval set too small (<50 pairs) — noisy metrics",
      "Not running eval in CI on pipeline changes",
      "Optimizing generation when retrieval is the bottleneck",
    ],
  }),
};
