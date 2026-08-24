import { createLesson } from "./builder";

/**
 * Hand-crafted Phase 3 modules that were generated stubs or missing entirely.
 * Existing phase-4 / phase-1 RAG lessons stay as-is; visuals overlay them.
 */
export const ragEngineeringLessons: Record<string, ReturnType<typeof createLesson>> = {
  "langchain-basics": createLesson({
    concept:
      "LangChain is a toolkit for composing RAG pieces — loaders, splitters, embeddings, vector stores, retrievers, prompts, and chat models — behind one set of interfaces.",
    whyItExists:
      "Raw SDK calls do not scale past a demo. You need swappable loaders and stores without rewriting the app. LangChain is the plumbing. LangGraph (a later phase) is the control loop for agents.",
    analogy:
      "LangChain is like React for LLM apps: reusable components you wire together instead of rewriting fetch-and-prompt for every project.",
    technicalExplanation:
      "Core RAG objects: Document loaders, RecursiveCharacterTextSplitter, embeddings wrappers, vector stores (Chroma, Pinecone, etc.), retrievers, ChatPromptTemplate, and chat models. LCEL lets you pipe retriever | prompt | llm with streaming. In 2026 use LangChain for integrations and retrieval; do not hide evaluation inside an opaque chain — log retrieved docs. Prefer LangGraph when you need retries, branching, or human-in-the-loop.",
    example:
      "Handbook RAG: load a PDF, split to 512-token chunks, store in Chroma, retrieve top-4, and ask gpt-4o-mini to answer only from that context with citations.",
    codeLanguage: "python",
    code: `from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=64)
chunks = splitter.split_text(open("handbook.txt").read())
store = Chroma.from_texts(chunks, OpenAIEmbeddings())
retriever = store.as_retriever(search_kwargs={"k": 4})

question = "How many PTO days do we get?"
docs = retriever.invoke(question)
context = "\\n\\n".join(d.page_content for d in docs)
print(llm.invoke(f"Answer using only this context:\\n{context}\\n\\nQ: {question}").content)`,
    commonMistakes: [
      "Treating LangChain as an agent framework — that is LangGraph",
      "Never logging which chunks were retrieved",
      "One giant chain you cannot eval stage by stage",
    ],
    glossary: ["LangChain", "LCEL", "Retriever", "Vector Store"],
    revisionNotes: {
      cheatSheet: [
        "LangChain = RAG plumbing",
        "Loader → splitter → store → retriever → LLM",
        "LCEL pipes, not hidden magic",
        "LangGraph later for agent loops",
      ],
    },
  }),

  chromadb: createLesson({
    concept:
      "ChromaDB is a local-first embedding database: collections of documents, vectors, and metadata you can query by meaning in a few lines of Python.",
    whyItExists:
      "You need somewhere to put embeddings on day one without standing up a cluster. Chroma is the learning and prototype store. Move to Qdrant, Pinecone, or pgvector when you need HA, multi-tenant scale, or ops you do not want to own.",
    analogy:
      "Chroma is a filing cabinet sorted by meaning, not alphabet — ask for refunds and it returns semantically nearby files.",
    technicalExplanation:
      "Use PersistentClient(path=...) so restarts do not wipe the index. A collection holds ids, documents, embeddings, and metadatas. add() upserts. query() takes query_texts or query_embeddings, n_results, and where filters. You can let Chroma embed or pass your own vectors. One collection per embedding model. Include distances when debugging retrieval.",
    example:
      "Index support tickets with team metadata, then query 'payment declined' filtered to team=billing so auth tickets never leak into the answer.",
    codeLanguage: "python",
    code: `import chromadb

client = chromadb.PersistentClient(path="./chroma_db")
tickets = client.get_or_create_collection("tickets")
tickets.add(
    documents=["billing issue on invoice 88", "login failed after reset"],
    ids=["t1", "t2"],
    metadatas=[{"team": "billing"}, {"team": "auth"}],
)
hits = tickets.query(
    query_texts=["payment declined"],
    n_results=2,
    where={"team": "billing"},
)
print(hits["documents"], hits["ids"])`,
    commonMistakes: [
      "In-memory Client() — index vanishes on restart",
      "Mixing embedding models in one collection",
      "No metadata — cannot filter tenant or cite sources",
    ],
    glossary: ["ChromaDB", "Collection", "Metadata Filter", "PersistentClient"],
    revisionNotes: {
      cheatSheet: [
        "PersistentClient(path=...)",
        "collection.add(docs, ids, metadatas)",
        "query_texts + where filters",
        "Prototype here, dedicated DB at scale",
      ],
    },
  }),

  streamlit: createLesson({
    concept:
      "Streamlit turns a Python script into a clickable RAG demo — chat input, message history, sidebar knobs — without writing a frontend.",
    whyItExists:
      "Stakeholders need to try retrieval before you build FastAPI + React. A Streamlit chat that shows source chunks sells the pipeline and catches bad retrieval early. It is not a production web stack.",
    analogy:
      "Streamlit is the PowerPoint of AI prototypes: paste Python, get a shareable UI in an afternoon.",
    technicalExplanation:
      "The script reruns top-to-bottom on every interaction. Put chat history in st.session_state or it resets. Use st.chat_input / st.chat_message for the transcript, st.sidebar for k and model, st.expander for retrieved chunks. Pair with Chroma + an LLM. For production: FastAPI, auth, and a real UI. Streamlit is the demo layer of this phase.",
    example:
      "A 60-line app: upload a PDF, index it, chat against it, and expand 'Sources' under each answer so reviewers see which pages were used.",
    codeLanguage: "python",
    code: `import streamlit as st
from openai import OpenAI

client = OpenAI()
st.title("Handbook RAG demo")
if "messages" not in st.session_state:
    st.session_state.messages = []
for msg in st.session_state.messages:
    st.chat_message(msg["role"]).write(msg["content"])
if prompt := st.chat_input("Ask the handbook"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    reply = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=st.session_state.messages,
        temperature=0,
    )
    answer = reply.choices[0].message.content
    st.session_state.messages.append({"role": "assistant", "content": answer})
    st.chat_message("assistant").write(answer)`,
    commonMistakes: [
      "Shipping Streamlit as the production app",
      "Forgetting session_state — chat wipes every click",
      "Hiding sources — then nobody can debug retrieval",
    ],
    glossary: ["Streamlit", "Session State", "Chat UI"],
    revisionNotes: {
      cheatSheet: [
        "streamlit run app.py",
        "session_state holds history",
        "Show retrieved chunks in an expander",
        "Prototype only — FastAPI later",
      ],
    },
  }),

  "knowledge-graphs": createLesson({
    concept:
      "A knowledge graph stores entities as nodes and relationships as edges — usually triples like Acme —acquired→ Beta — so facts that live across documents can be joined.",
    whyItExists:
      "Vector RAG finds similar paragraphs. It struggles when the answer is a chain: who owns whom, who reports to whom, which clause modifies which contract. A graph is the map of those links.",
    analogy:
      "Chunks are sticky notes. A knowledge graph is the org-chart on the wall — you can see how people and companies connect, not just which notes mention similar words.",
    technicalExplanation:
      "Extract entities and relations from text (LLM or NER), store them in Neo4j, FalkorDB, or RDF. Give the graph a simple ontology (Person, Company, acquired, reports_to) so extraction stays consistent. Properties sit on nodes and edges (date, source doc). Graphs do not replace embeddings — many systems keep both: vectors for prose, graph for structure.",
    example:
      "Ten press releases mention acquisitions with different spellings. The graph links Acme → Beta → Gamma so 'who did Acme buy in Europe?' can walk instead of hoping one chunk lists the whole chain.",
    commonMistakes: [
      "Dumping raw strings as nodes — duplicates everywhere",
      "No ontology — every extract invents new relation names",
      "Replacing vector RAG entirely when most questions are still paragraph lookup",
    ],
    glossary: ["Knowledge Graph", "Triple", "Ontology", "Entity"],
    revisionNotes: {
      cheatSheet: [
        "Nodes = entities, edges = relations",
        "Triple: subject, relation, object",
        "Ontology keeps types consistent",
        "Graph + vectors is the usual mix",
      ],
    },
  }),

  "graph-rag": createLesson({
    concept:
      "Graph RAG retrieves a subgraph (and often text chunks) then generates. It is for multi-hop and relational questions, not a default replacement for vector RAG.",
    whyItExists:
      "Some questions are never answered in a single similar paragraph. Graph RAG walks relationships the documents imply but never state together. Extraction and entity resolution cost more than naive RAG — use it when hops matter.",
    analogy:
      "Vector RAG is 'find pages like this question.' Graph RAG is 'start at this company and follow acquired-by until you hit a country.'",
    technicalExplanation:
      "Typical flow: extract a graph from the corpus, resolve entities, optionally cluster communities and summarize (Microsoft GraphRAG-style). At query time, identify seed entities, pull a bounded subgraph plus related text, and prompt the LLM with both. Hybrid is common: vectors find the seed passage, the graph expands. Eval needs multi-hop questions, not only single-fact FAQs.",
    example:
      "'Which products of companies Acme acquired in 2024 mention GDPR?' needs acquisition edges and then document text — neither store alone is enough.",
    commonMistakes: [
      "Running Graph RAG on every FAQ — expensive and slower",
      "Skipping entity resolution so hops never connect",
      "Unbounded traversal that dumps the whole graph into the prompt",
    ],
    glossary: ["Graph RAG", "Multi-hop Retrieval", "Community Summary", "Hybrid Graph + Vector"],
    revisionNotes: {
      cheatSheet: [
        "Retrieve subgraph + text, then generate",
        "For multi-hop / relational questions",
        "Extraction quality bounds the system",
        "Eval with hop questions, not only FAQs",
      ],
    },
  }),

  "entity-resolution": createLesson({
    concept:
      "Entity resolution decides that Acme Inc, ACME, and Acme Corporation are the same real-world thing and merges them to one canonical id.",
    whyItExists:
      "Extractors emit surface strings. Without merging, the graph thinks those names are strangers and multi-hop retrieval dies. ER is the unglamorous step that makes Graph RAG work.",
    analogy:
      "ER is the office assigning one employee number even if badges say Nishtha S., N. Singh, and Nishtha Singh.",
    technicalExplanation:
      "Normalize strings (case, Inc/LLC, punctuation). Block likely pairs so you do not compare every entity to every other. Score with similarity and optionally an LLM judge. Write a canonical node with an aliases list and attach all facts there. Keep provenance: which mentions merged, from which documents.",
    example:
      "Legal docs say 'Beta Corp.' and emails say 'Beta'. After ER, one node owns both aliases, so 'who acquired Beta?' hits the same company Acme bought.",
    commonMistakes: [
      "Matching only exact strings",
      "Merging different companies that share a common name",
      "No alias list — you cannot explain why two mentions joined",
    ],
    glossary: ["Entity Resolution", "Canonical Entity", "Blocking", "Alias"],
    revisionNotes: {
      cheatSheet: [
        "Same real-world thing → one id",
        "Normalize, block, then match",
        "Store aliases on the canonical node",
        "Skip ER and Graph RAG fragments",
      ],
    },
  }),

  "graph-retrieval": createLesson({
    concept:
      "Graph retrieval starts from entities in the question, walks a bounded neighborhood (k-hop, typed edges), and serializes those paths as context for the LLM.",
    whyItExists:
      "A graph you never query is a museum. Retrieval has to be bounded: unbounded walks explode tokens and can leak another tenant's subgraph. Mix with vector search when the seed entity is unclear.",
    analogy:
      "You do not photocopy the whole org chart. You start at Acme and walk one or two boxes over — then hand those boxes to the writer.",
    technicalExplanation:
      "Parse or link entities in the query to canonical nodes. Expand along allowed edge types (acquired, reports_to, located_in) with max hops and a hard node cap. Filter to the user's tenant subgraph. Serialize as readable triples or a short path list, plus optional source snippets. LLM-generated Cypher is powerful and dangerous — constrain it. Always cite which nodes and source docs you used.",
    example:
      "'Who is the manager of the person who owns Project Orion?' Seed Project Orion, hop to owner, hop to manager, return that path — not the entire company graph.",
    commonMistakes: [
      "No hop or node cap — prompt overflow",
      "Walking the global graph without tenant filters",
      "Returning raw IDs the LLM cannot verbalize",
    ],
    glossary: ["Graph Retrieval", "k-hop", "Seed Entity", "Edge Type Filter"],
    revisionNotes: {
      cheatSheet: [
        "Seed entity → k-hop → serialize",
        "Cap hops and node count",
        "Filter edge types + tenant",
        "Cite node sources",
      ],
    },
  }),
};
