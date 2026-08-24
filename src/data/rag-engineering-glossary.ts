import type { PhaseGlossaryTerm } from "@/data/agent-foundations-glossary";

export type RagGlossaryCategory =
  | "Pipeline"
  | "Ingestion"
  | "Chunking & Embeddings"
  | "Vector Stores"
  | "Retrieval"
  | "Ranking"
  | "Graph RAG"
  | "Frameworks & Demos"
  | "Evaluation & Production";

export const ragEngineeringGlossary: PhaseGlossaryTerm[] = [
  {
    term: "RAG",
    category: "Pipeline",
    meaning:
      "Retrieval-Augmented Generation: fetch relevant documents at query time and generate an answer grounded in that context instead of relying only on the model's training data.",
    aliases: ["retrieval augmented generation", "retrieve then generate"],
  },
  {
    term: "Naive RAG",
    category: "Pipeline",
    meaning:
      "The basic pipeline: embed query → top-k vector search → stuff chunks into a prompt → generate. No rewrite, hybrid search, or re-ranking.",
    aliases: ["basic rag", "vanilla rag"],
  },
  {
    term: "Grounding",
    category: "Pipeline",
    meaning:
      "Forcing the answer to come from retrieved context. Prompts say 'answer only from the provided sources' so the model cites evidence instead of inventing facts.",
    aliases: ["grounded generation", "context-grounded"],
  },
  {
    term: "Citation",
    category: "Pipeline",
    meaning:
      "A pointer back to the chunk that supported a claim — file, page, section, or URL stored in metadata. Users should be able to open the source.",
    aliases: ["source", "attribution"],
  },
  {
    term: "Document Loader",
    category: "Ingestion",
    meaning:
      "The ingestion adapter that turns PDFs, HTML, APIs, or SaaS exports into a standard Document (text + metadata) the rest of the pipeline can chunk.",
    aliases: ["loader", "ingester"],
  },
  {
    term: "OCR",
    category: "Ingestion",
    meaning:
      "Optical character recognition for scanned PDFs and images. Low-confidence OCR should be flagged, not silently indexed as if it were clean text.",
    aliases: ["scanned pdf", "textract"],
  },
  {
    term: "Incremental Sync",
    category: "Ingestion",
    meaning:
      "Re-ingest only documents that changed, using events or content hashes, instead of rebuilding the whole index on every run.",
    aliases: ["delta ingest", "incremental ingestion"],
  },
  {
    term: "Idempotent Ingestion",
    category: "Ingestion",
    meaning:
      "Running the loader twice does not duplicate vectors. Upsert by stable document id and skip unchanged content hashes.",
    aliases: ["dedupe", "content hash"],
  },
  {
    term: "Document",
    category: "Ingestion",
    meaning:
      "The unit loaders emit: page_content plus metadata (source, page, doc_id, ACLs). Chunkers split Documents, not raw bytes.",
    aliases: ["langchain document"],
  },
  {
    term: "Chunking",
    category: "Chunking & Embeddings",
    meaning:
      "Splitting a document into retrieval-sized pieces. The highest-leverage RAG choice — bad splits cause missed answers even with a perfect vector DB.",
    aliases: ["text splitting", "chunk split"],
  },
  {
    term: "Chunk Size",
    category: "Chunking & Embeddings",
    meaning:
      "How large each piece is, usually in tokens. Start around 256–1024. Smaller helps fact lookup; larger helps narrative context. Benchmark on your eval set.",
    aliases: ["chunk_size"],
  },
  {
    term: "Chunk Overlap",
    category: "Chunking & Embeddings",
    meaning:
      "Repeated tokens at chunk boundaries so a question that sits on a split still retrieves the needed sentence. Typical: 10–20%.",
    aliases: ["overlap"],
  },
  {
    term: "Recursive Splitting",
    category: "Chunking & Embeddings",
    meaning:
      "Split on paragraph, then sentence, then word, instead of cutting mid-sentence. LangChain RecursiveCharacterTextSplitter is the usual default.",
    aliases: ["recursive character splitter"],
  },
  {
    term: "Semantic Chunking",
    category: "Chunking & Embeddings",
    meaning:
      "Merge neighboring sentences until embedding similarity drops. More expensive than recursive splitting; useful when structure is messy.",
    aliases: ["similarity chunking"],
  },
  {
    term: "Parent-Child Chunking",
    category: "Chunking & Embeddings",
    meaning:
      "Index small child chunks for precise search, but pass the larger parent section to the LLM so it has surrounding context.",
    aliases: ["parent document retriever", "small-to-big"],
  },
  {
    term: "Embedding Model",
    category: "Chunking & Embeddings",
    meaning:
      "The model that maps text to a dense vector. Index and query must use the same model. Swapping models means a full re-index.",
    aliases: ["embedder", "text-embedding-3-small"],
  },
  {
    term: "Cosine Similarity",
    category: "Chunking & Embeddings",
    meaning:
      "The usual distance for normalized embeddings: 1 is identical direction, 0 is orthogonal. Vector DBs often store cosine or L2.",
    aliases: ["cosine", "similarity score"],
  },
  {
    term: "Dimensionality",
    category: "Chunking & Embeddings",
    meaning:
      "Length of the embedding vector (e.g. 1536). The vector DB collection must match. Higher dims can help quality and cost more storage.",
    aliases: ["embedding dim", "vector size"],
  },
  {
    term: "Vector Database",
    category: "Vector Stores",
    meaning:
      "A store optimized for approximate nearest-neighbor search over embeddings, plus metadata filters. Examples: Chroma, Qdrant, Pinecone, pgvector.",
    aliases: ["vector db", "vector store"],
  },
  {
    term: "ANN",
    category: "Vector Stores",
    meaning:
      "Approximate nearest neighbor: fast search that trades a little recall for milliseconds at millions of vectors. Opposite of brute-force scan.",
    aliases: ["approximate nearest neighbor"],
  },
  {
    term: "HNSW",
    category: "Vector Stores",
    meaning:
      "Hierarchical Navigable Small World — a graph ANN index. Search walks from coarse layers to fine. Standard production default.",
    aliases: ["hnsw index"],
  },
  {
    term: "IVF",
    category: "Vector Stores",
    meaning:
      "Inverted file index: cluster vectors, search only nearby clusters. Another ANN family; tune nprobe for recall vs latency.",
    aliases: ["ivfflat", "inverted file"],
  },
  {
    term: "pgvector",
    category: "Vector Stores",
    meaning:
      "Postgres extension for vectors. Fine for modest scale when you already have Postgres. Dedicated vector DBs win at huge scale and specialized ops.",
    aliases: ["postgres vectors"],
  },
  {
    term: "ChromaDB",
    category: "Vector Stores",
    meaning:
      "Open-source embedding database with a simple Python API. PersistentClient on disk is the usual local RAG learning setup.",
    aliases: ["chroma", "chromadb collection"],
  },
  {
    term: "Collection",
    category: "Vector Stores",
    meaning:
      "A named bucket of ids, documents, embeddings, and metadatas in Chroma (or similar). One corpus / one embedding model per collection is safest.",
    aliases: ["chroma collection"],
  },
  {
    term: "Upsert",
    category: "Vector Stores",
    meaning:
      "Insert or overwrite by id. How you update a changed document without duplicating vectors.",
    aliases: ["update insert"],
  },
  {
    term: "Metadata",
    category: "Vector Stores",
    meaning:
      "Fields stored beside the vector: source, page, tenant, ACL, section. Used for filters, citations, and permission checks — not optional in production.",
    aliases: ["payload", "metadata filter"],
  },
  {
    term: "Metadata Filter",
    category: "Vector Stores",
    meaning:
      "A where-clause on payload fields before or during ANN, e.g. tenant_id = X. Prevents leaking another team's documents.",
    aliases: ["where filter", "pre-filter"],
  },
  {
    term: "Retriever",
    category: "Retrieval",
    meaning:
      "The component that turns a question into a list of Documents. Can wrap vector search, BM25, hybrid, multi-query, or parent-document logic.",
    aliases: ["the R in RAG"],
  },
  {
    term: "top-k",
    category: "Retrieval",
    meaning:
      "How many chunks to return. Too small misses evidence; too large wastes context and confuses the model. Tune with precision@k and recall@k.",
    aliases: ["k", "n_results"],
  },
  {
    term: "Multi-Query Retriever",
    category: "Retrieval",
    meaning:
      "An LLM writes several search phrasings from one question, searches all, then dedupes. Raises recall when users and docs use different words.",
    aliases: ["query variants"],
  },
  {
    term: "Hybrid Search",
    category: "Retrieval",
    meaning:
      "Combine dense vector search (meaning) with sparse keyword search (exact tokens). Best for SKUs, names, error codes, and paraphrases together.",
    aliases: ["dense plus sparse", "vector + keyword"],
  },
  {
    term: "Reciprocal Rank Fusion",
    category: "Retrieval",
    meaning:
      "A way to merge two ranked lists: score = 1 / (k + rank). Lets BM25 and vectors vote without mixing incompatible raw scores.",
    aliases: ["RRF"],
  },
  {
    term: "BM25",
    category: "Retrieval",
    meaning:
      "Classic sparse ranking: term frequency, inverse document frequency, length normalization. Strong on exact tokens; weak on synonyms.",
    aliases: ["Okapi BM25", "keyword search"],
  },
  {
    term: "Sparse Retrieval",
    category: "Retrieval",
    meaning:
      "Search over term weights (BM25 / TF-IDF / learned sparse) instead of dense embeddings. Complementary to vector search.",
    aliases: ["lexical search", "inverted index"],
  },
  {
    term: "Query Expansion",
    category: "Retrieval",
    meaning:
      "Rewrite or grow the query (synonyms, LLM variants, HyDE) so retrieval matches how the documents are actually written.",
    aliases: ["query rewrite"],
  },
  {
    term: "HyDE",
    category: "Retrieval",
    meaning:
      "Hypothetical Document Embeddings: the LLM drafts a fake answer, you embed that passage, and search near it. Helps short or vague queries.",
    aliases: ["hypothetical document embeddings"],
  },
  {
    term: "Contextual Compression",
    category: "Retrieval",
    meaning:
      "After retrieval, drop sentences that are irrelevant to the query so the LLM sees a shorter, cleaner context.",
    aliases: ["compression", "context compressor"],
  },
  {
    term: "Semantic Cache",
    category: "Evaluation & Production",
    meaning:
      "Reuse an answer when a new question is close in embedding space to a previous one. Must key by tenant and corpus version.",
    aliases: ["near-duplicate cache"],
  },
  {
    term: "Embedding Cache",
    category: "Evaluation & Production",
    meaning:
      "Store chunk vectors at ingest so unchanged text is not re-embedded. Separate from caching final answers.",
    aliases: ["vector cache"],
  },
  {
    term: "Bi-Encoder",
    category: "Ranking",
    meaning:
      "Embed query and document separately, then compare vectors. Fast enough to search millions of chunks. Less precise than a cross-encoder.",
    aliases: ["dual encoder", "two-tower"],
  },
  {
    term: "Cross Encoder",
    category: "Ranking",
    meaning:
      "Feeds query and document together through a transformer and outputs one relevance score. Accurate, too slow for the full corpus — use as a re-ranker.",
    aliases: ["cross-encoder"],
  },
  {
    term: "Re-ranking",
    category: "Ranking",
    meaning:
      "Second stage: take the first-stage top-20–50, score with a cross-encoder or rerank API, keep the best few for the LLM.",
    aliases: ["rerank", "reranker"],
  },
  {
    term: "Cohere Rerank",
    category: "Ranking",
    meaning:
      "A hosted rerank API. Send query + candidate passages, get a new order. Same two-stage pattern as a local cross-encoder.",
    aliases: ["cohere rerank api"],
  },
  {
    term: "Knowledge Graph",
    category: "Graph RAG",
    meaning:
      "Entities as nodes and relations as edges (often triples). Captures who-relates-to-whom across documents, not just similar paragraphs.",
    aliases: ["KG", "property graph"],
  },
  {
    term: "Triple",
    category: "Graph RAG",
    meaning:
      "A fact as (subject, relation, object), e.g. Acme —acquired→ BetaCorp. The atomic write unit when extracting a graph from text.",
    aliases: ["spo", "edge fact"],
  },
  {
    term: "Ontology",
    category: "Graph RAG",
    meaning:
      "The allowed types of entities and relations (Person, Company, acquired, reports_to). A schema so extraction stays consistent.",
    aliases: ["schema", "graph schema"],
  },
  {
    term: "Graph RAG",
    category: "Graph RAG",
    meaning:
      "Retrieve a subgraph (and often text chunks), then generate. Wins on multi-hop / relational questions that a single paragraph never states.",
    aliases: ["graphrag", "graph-augmented generation"],
  },
  {
    term: "Entity Resolution",
    category: "Graph RAG",
    meaning:
      "Deciding that 'Acme Inc' and 'ACME' are the same real-world entity and merging them to one canonical id. Without it, graph hops break.",
    aliases: ["ER", "entity matching", "canonicalization"],
  },
  {
    term: "Canonical Entity",
    category: "Graph RAG",
    meaning:
      "The single merged node after resolution, with aliases listed on it. All facts attach here, not to every spelling variant.",
    aliases: ["canonical id", "golden record"],
  },
  {
    term: "Graph Retrieval",
    category: "Graph RAG",
    meaning:
      "Starting from seed entities in the question, walk a bounded neighborhood (k-hop, typed edges) and serialize those paths as LLM context.",
    aliases: ["subgraph retrieval", "k-hop"],
  },
  {
    term: "Multi-hop Retrieval",
    category: "Graph RAG",
    meaning:
      "Answering a question that needs two or more facts chained together (A acquired B, B located in C). Graphs help; single-chunk vector search often fails.",
    aliases: ["multi hop", "compositional question"],
  },
  {
    term: "LangChain",
    category: "Frameworks & Demos",
    meaning:
      "A Python/JS toolkit of loaders, splitters, vector stores, retrievers, and LCEL pipes. Strong for RAG plumbing; prefer LangGraph later for agent loops.",
    aliases: ["langchain rag"],
  },
  {
    term: "LCEL",
    category: "Frameworks & Demos",
    meaning:
      "LangChain Expression Language: declarative pipes (retriever | prompt | llm) with streaming and retries. Composition, not an agent runtime.",
    aliases: ["langchain expression language"],
  },
  {
    term: "Streamlit",
    category: "Frameworks & Demos",
    meaning:
      "Python library that turns a script into a clickable demo (chat_input, session_state). For RAG prototypes, not high-QPS production UIs.",
    aliases: ["st.chat_input", "streamlit chat"],
  },
  {
    term: "Session State",
    category: "Frameworks & Demos",
    meaning:
      "Streamlit's per-user dict that survives reruns. Store chat history here or the demo forgets every message.",
    aliases: ["st.session_state"],
  },
  {
    term: "Faithfulness",
    category: "Evaluation & Production",
    meaning:
      "Eval metric: is the answer supported by the retrieved context? Low faithfulness means hallucination even if the prose sounds confident.",
    aliases: ["groundedness"],
  },
  {
    term: "Context Precision",
    category: "Evaluation & Production",
    meaning:
      "Of the chunks you retrieved, how many were actually relevant? Low precision means noise in the prompt.",
    aliases: ["retrieval precision"],
  },
  {
    term: "Recall@k",
    category: "Evaluation & Production",
    meaning:
      "Of the documents that should have been found, what fraction appear in the top-k? Low recall means the answer never had a chance.",
    aliases: ["retrieval recall"],
  },
  {
    term: "Answer Relevancy",
    category: "Evaluation & Production",
    meaning:
      "Does the generated text actually address the question? Separate from whether it is faithful to sources.",
    aliases: ["answer_relevancy"],
  },
  {
    term: "RAGAS",
    category: "Evaluation & Production",
    meaning:
      "A common Python eval library for RAG: faithfulness, context precision, answer relevancy, and related scores on a dataset of questions.",
    aliases: ["ragas metrics"],
  },
  {
    term: "Golden Dataset",
    category: "Evaluation & Production",
    meaning:
      "Labeled questions with ground-truth answers and expected source docs. The only honest way to know if a pipeline change helped.",
    aliases: ["eval set", "gold q&a"],
  },
  {
    term: "nDCG",
    category: "Evaluation & Production",
    meaning:
      "Normalized Discounted Cumulative Gain — a ranking metric that rewards putting the right documents near the top.",
    aliases: ["ndcg"],
  },
  {
    term: "MRR",
    category: "Evaluation & Production",
    meaning:
      "Mean Reciprocal Rank: 1 / rank of the first relevant document, averaged. Sensitive to whether the right chunk is #1 vs #10.",
    aliases: ["mean reciprocal rank"],
  },
];

export const ragGlossaryCategories: RagGlossaryCategory[] = [
  "Pipeline",
  "Ingestion",
  "Chunking & Embeddings",
  "Vector Stores",
  "Retrieval",
  "Ranking",
  "Graph RAG",
  "Frameworks & Demos",
  "Evaluation & Production",
];

export const ragGlossaryPopularTerms = [
  "RAG",
  "Chunking",
  "HNSW",
  "Hybrid Search",
  "Re-ranking",
  "Faithfulness",
  "Graph RAG",
  "ChromaDB",
];

export function getRagEngineeringGlossaryByCategory(): Record<string, PhaseGlossaryTerm[]> {
  const grouped: Record<string, PhaseGlossaryTerm[]> = {};
  for (const cat of ragGlossaryCategories) {
    grouped[cat] = [];
  }
  for (const term of ragEngineeringGlossary) {
    grouped[term.category] ??= [];
    grouped[term.category].push(term);
  }
  for (const cat of ragGlossaryCategories) {
    grouped[cat].sort((a, b) => a.term.localeCompare(b.term));
  }
  return grouped;
}
