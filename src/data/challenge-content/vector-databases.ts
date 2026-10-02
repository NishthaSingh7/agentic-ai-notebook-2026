import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "vector-databases",
  instructor:
    "I teach this from zero. If you have never seen a vector or a vector database, that is fine. We will start with 'find things that mean something similar', then what must be stored besides the numbers, then how to pick a product for a real job.",
  promise:
    "You will leave knowing what a vector is, why a special store exists, what filters and deletes have to do with search, and how to choose among common products for the job you have — not for the logo in a notebook.",

  story: {
    title: "The price list that survived the delete",
    body: [
      "A billing assistant looked up plan prices from a vector store — a database built to search by meaning. The team picked a library they had seen in a getting-started notebook. The corpus was only a few thousand pieces. When prices changed, a job was supposed to remove the old article and insert the new one. In the admin site, the old article was gone. In the assistant, three customers in a week were quoted last quarter's price.",
      "The delete had been a hidden flag in one code path and a real remove in another. The search path did not read the flag. Nobody owned cleanup. A second bug sat under it: there was no tenant field on the rows. Tenant just means 'which customer's data is this'. A staging re-index had pointed at the production collection 'just to compare'. Staging pages were still in the top results for a live pricing question. The assistant cited a staging URL that led to a missing page, then guessed from an old blog post.",
      "The post-mortem wanted a better embedding model. The store wanted to be treated like a database. They moved the corpus to a product that could filter on labels at search time, keep each tenant in a place they could drop, and make deletes disappear from search before the next request. They also wrote down why not the other logos: one was a hosted service they did not want outside their network, one was heavy operations for a tiny corpus, one had features they planned to build in the app anyway.",
      "The old price left the index on a measured delete. Staging got its own collection. A missing tenant filter became an error, not 'search everything'. The lesson I still give: a vector database is often the first database an ML team has to operate, and they operate it like a cache. A cache that forgets to forget becomes the system of record for prices.",
    ],
    moral:
      "Pick the store for filters, tenants, and deletes. Similarity is the easy part. A tutorial database will keep returning the row you thought you removed.",
  },

  stages: [
    {
      id: "why-a-special-store",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Let us start from zero. A normal database is great when you know the exact key. 'Give me article 8821.' A normal search box is great when you know a word. 'Find pages that contain the letters SKU-44.' Neither is great when the user says 'what does it cost to add a second workspace' and the article title is 'Seat and workspace pricing'.",
        "You need a way to find pieces that mean something close, even when the words differ. That is the problem a vector store exists to solve. It is not magic understanding. It is math on lists of numbers.",
        "Here is a tiny picture. A title catalog is a bookshelf labelled by spine. A vector store is a bookshelf that tries to put similar topics near each other. You still have to label the books — who owns them, whether they are for sale, whether they were withdrawn — or you will hand a customer a withdrawn price list that 'felt similar'.",
        "What happens without those labels? The story. Search by meaning happily returns last quarter's price because last quarter's price is about pricing.",
        "At this point you should understand the why: we need a store that can search by nearness and still behave like a database when we filter, delete, and separate customers.",
      ],
      diagrams: [
        {
          title: "Title search versus meaning search",
          caption:
            "Nearness finds similar topics. Labels decide whether a neighbor is allowed to be seen.",
          chart: chart(
            `flowchart TD
    Q([What does a second workspace cost]) --> Title[Match the title]
    Q --> Mean[Find nearby meaning]
    Title --> Miss([No exact title])
    Mean --> Hit[Pricing article]
    Hit --> Label{Withdrawn?}
    Label -->|yes| Old([Last quarter's price])
    Label -->|no| Ok([Current price])`,
            `class Q,Miss,Old,Ok hub
    class Title,Mean,Hit grp1
    class Label grp2`
          ),
        },
      ],
    },
    {
      id: "what-a-vector-is",
      level: "beginner",
      title: "What a vector is, and what the database stores",
      body: [
        "A vector is just a list of numbers. Everyday picture: a recipe card with 1,536 tiny ratings, one per hidden 'flavor'. Two cards with similar numbers are treated as similar in meaning. The embedding model writes those numbers. The database stores them.",
        "They look similar — 'vector' and 'embedding' — because people swap the words. The important difference is the job. An embedding is the act of turning text into that list. A vector is the list. The vector database is the shelf that holds many lists and finds the nearest ones quickly.",
        "A row is more than the list. It also holds the text, an id, and metadata — extra labels such as tenant, plan, language, and 'is this deleted'. Search that cannot filter on metadata will return a neighbor you were not allowed to show.",
        "Why a special database? Comparing one question to a million lists by brute force is slow. These stores use an index: a structure that makes nearest-neighbor search fast enough for a request. Approximate nearest neighbor means 'close enough, quickly', not 'perfect, eventually'.",
        "At this point you should be able to say: the store holds vectors plus labels, and it answers 'what is near this query vector, after my filters'.",
      ],
      diagrams: [
        {
          title: "A row is more than a list of numbers",
          caption:
            "If you only store the vector, you can find neighbors and still not know who may see them.",
          chart: chart(
            `flowchart LR
    Text[Chunk text] --> Emb[Embedding model]
    Emb --> Vec[Vector]
    Vec --> Row[Row]
    Meta[id, tenant, plan] --> Row
    Row --> Store[(Vector store)]`,
            `class Store hub
    class Text,Emb,Vec grp1
    class Meta,Row grp2`
          ),
        },
      ],
    },
    {
      id: "simplest-store",
      level: "beginner",
      title: "The simplest version: a list in Python",
      body: [
        "What are we trying to do? Keep a few rows in memory, score them by a simple nearness, and apply a filter. No vendor. You should see that the product later is this idea with a faster index.",
        "Here is the smallest version. Each row has an id, a tiny vector, a tenant, and text. A query comes in with its own vector and a tenant. We skip other tenants, score the rest, and return the top hits.",
        "Let's understand what just happened. The filter ran first. Nearness never saw another tenant's row. That order is the lesson. If you search first and filter later on a huge set, you waste work and you can leak a neighbor that almost made the cut.",
        "This toy will not survive a million rows. That is why products exist. The verbs stay the same: upsert, search, delete, filter.",
        "At this point you should understand the simplest store: rows, a score, a filter. Next we implement the verbs as if a teammate will operate them.",
      ],
      codes: [
        {
          title: "toy_store.py — nearest neighbor with a filter",
          language: "python",
          code: `from dataclasses import dataclass


@dataclass
class Row:
    id: str
    tenant: str
    vector: tuple[float, ...]
    text: str


def nearness(a: tuple[float, ...], b: tuple[float, ...]) -> float:
    return sum(x * y for x, y in zip(a, b))


def search(rows: list[Row], query: tuple[float, ...], tenant: str, k: int = 3) -> list[Row]:
    allowed = [r for r in rows if r.tenant == tenant]
    ranked = sorted(allowed, key=lambda r: nearness(query, r.vector), reverse=True)
    return ranked[:k]`,
        },
      ],
    },
    {
      id: "real-verbs",
      level: "intermediate",
      title: "How we implement it: the verbs that matter",
      body: [
        "Upsert means insert or replace. When a price changes, you upsert the new chunk ids. You do not append a second copy and hope rank prefers the new one. Two copies of a price is how last quarter survives.",
        "Delete means the next search must not return that id. A hidden flag the query forgets to read is not a delete. After you delete, prove it: search for a unique phrase from that chunk and expect zero hits.",
        "Search takes a query vector, a k, and a filter. The filter is part of the query, not a later if-statement in the app if the store can do it. Stores that cannot filter well push you to build a second system.",
        "What are we trying to do? Make tenant a required argument. If it is missing, refuse. 'Search everything' is how staging leaked into production in the story.",
        "Let's understand namespaces. Some products give you collections or namespaces — separate shelves. Use them for environments and for tenants if the product's filter story is weak. Do not share one shelf 'to compare' and forget to split it again.",
      ],
      codes: [
        {
          title: "ops.py — upsert, search, delete, refuse a missing tenant",
          language: "python",
          code: `class Store:
    def __init__(self) -> None:
        self.rows: dict[str, Row] = {}

    def upsert(self, row: Row) -> None:
        self.rows[row.id] = row

    def delete(self, row_id: str) -> None:
        self.rows.pop(row_id, None)

    def search(self, query, tenant: str | None, k: int = 5) -> list[Row]:
        if not tenant:
            raise ValueError("tenant is required")
        return search(list(self.rows.values()), query, tenant, k)`,
        },
      ],
      diagrams: [
        {
          title: "Filter first, then nearness",
          caption:
            "A missing tenant is an error. It is not a wider, friendlier search.",
          chart: chart(
            `flowchart TD
    Q([Query vector]) --> Ten{Tenant present?}
    Ten -->|no| Stop([Refuse])
    Ten -->|yes| Filt[Keep that tenant]
    Filt --> Near[Nearest k]
    Near --> Hits([Hits])`,
            `class Q,Stop,Hits hub
    class Ten,Filt grp2
    class Near grp1`
          ),
        },
      ],
    },
    {
      id: "pick-for-the-job",
      level: "intermediate",
      title: "When the toy store is not enough: pick for the job",
      body: [
        "Now the logos. Chroma is a library many notebooks start with. It is useful on a laptop and in small apps. It is a poor default when you need multi-tenant filters, serious deletes, and an on-call rotation. The story started here.",
        "Pinecone is a hosted service: they run the index, you call an API. Useful when you want less operations. You might avoid it when data must not leave your network, or when price-at-scale is the constraint.",
        "Qdrant, Weaviate, and Milvus are stores you can run yourself or take as a service. Qdrant is often chosen for filter-heavy queries. Weaviate is often chosen when you want a store plus a graph-ish or hybrid story in one product. Milvus is often chosen when the corpus is huge and you will operate a cluster. None of those sentences is 'best'. They are 'useful when'.",
        "The job questions are: must it stay in our network? How many vectors? Do we filter on many labels? Do we delete and immediately search? Do we need hybrid search in the store or in the app? Who is on call at 2am?",
        "Remember this: the embedding model is a separate choice. If you change the model, old vectors are in a different number-space. You must re-embed. Mixing two models in one collection is how neighbors become nonsense.",
      ],
    },
    {
      id: "how-it-fits",
      level: "intermediate",
      title: "How the store fits in an application",
      body: [
        "Documents stay in your database. The vector store is derived. A job reads new or changed documents, chunks them, embeds them with a named model version, and upserts. A delete in the document database must schedule a delete in the index. If those two stores disagree, the index wins in the user-visible answer — which is the wrong winner.",
        "At query time you embed the question with the same model version, apply tenant and plan filters, retrieve, then hand chunks to the RAG sitting you already know.",
        "Version the embedding. Put model name and dimension on the collection. Refuse to upsert a vector with the wrong length. That one check prevents a quiet mix after someone 'just tried' a new model in production.",
        "Connect this back to the story. Staging needed its own collection. Production deletes needed a prove step. Tenant had to be required. None of those are embedding-quality problems.",
        "At this point you should be able to draw 'documents in, index derived, query filtered' without naming a vendor.",
      ],
      diagrams: [
        {
          title: "Documents stay yours; the index is derived",
          caption:
            "If the index still has a price the document store deleted, the assistant will quote the ghost.",
          chart: chart(
            `flowchart LR
    Docs[(Documents)] --> Job[Chunk and embed]
    Job --> Idx[(Vector index)]
    Docs --> Del[Delete in docs]
    Del --> Drop[Delete in index]
    Q([Question]) --> Idx
    Idx --> Rag[RAG prompt]`,
            `class Q hub
    class Docs,Del grp1
    class Job,Idx,Drop grp2
    class Rag grp3`
          ),
        },
      ],
      codes: [
        {
          title: "version.py — do not mix embedding models",
          language: "python",
          code: `def upsert_checked(store, row: Row, expected_model: str, expected_dim: int, model: str) -> None:
    if model != expected_model:
        raise ValueError("wrong embedding model")
    if len(row.vector) != expected_dim:
        raise ValueError("wrong vector length")
    store.upsert(row)`,
        },
      ],
    },
    {
      id: "how-stores-fail",
      level: "advanced",
      title: "How vector stores fail",
      body: [
        "Now that you understand the simple store, look at failures. The first is a ghost delete. The id is gone from the admin UI and still in the index, or a soft flag is ignored. Prove deletes with a canary chunk you insert, delete, and search for.",
        "The second is a tenant leak. A missing filter, a shared collection, or a staging pointer. Treat a missing tenant as an error. Test with two tenants that each own a unique phrase.",
        "The third is stale embeddings after a model change. Half the collection was re-embedded. Search became noise. Migrate as a new collection, switch reads, then drop the old one.",
        "The fourth is treating the index as the system of record. Teams start editing text only in the vector store. Then nobody knows how to rebuild. Rebuilds must be possible from documents you own.",
        "The fifth is approximate search being a little wrong on a tiny corpus. ANN is a speed trade. On a few thousand rows, exact search may be simpler and more predictable. Do not take a cluster tax you do not need.",
      ],
      codes: [
        {
          title: "canary.py — prove a delete is gone",
          language: "python",
          code: `def prove_delete(store, embed, tenant: str) -> None:
    row = Row("canary-1", tenant, embed("UNIQUE-CANARY-PHRASE"), "UNIQUE-CANARY-PHRASE")
    store.upsert(row)
    assert store.search(row.vector, tenant, k=1)[0].id == "canary-1"
    store.delete("canary-1")
    hits = store.search(row.vector, tenant, k=5)
    assert all(h.id != "canary-1" for h in hits)`,
        },
      ],
    },
    {
      id: "production-choice",
      level: "advanced",
      title: "Production choice and operations",
      body: [
        "This approach is useful when you retrieve by meaning at request time and the corpus is larger than a folder you can scan. You might avoid a dedicated store when you have a few hundred chunks — a SQL table plus a linear scan, or a library in-process, can be enough until filters and deletes get serious.",
        "Trade-offs: hosted versus self-hosted is control versus operations. Filter-rich stores cost more to run and save you from building a second filter system. Hybrid search in the store can help; hybrid in the next sitting can also live in the app.",
        "Operate it like a database. Backups, rebuilds, on-call, rate limits, and a runbook for 'delete did not take'. Measure recall on a labelled set after every migration. A new logo is not an improvement until the scoreboard moves.",
        "Pick for the job in one sentence you can defend: 'We chose Qdrant because we filter on tenant and plan and we will run it in our network.' If you cannot write that sentence, you chose a tutorial.",
        "The learner who can teach this now says: a vector database stores lists of numbers plus labels so you can find neighbors fast — and it must still delete, isolate tenants, and rebuild from documents you own.",
      ],
      diagrams: [
        {
          title: "A delete you can measure",
          caption:
            "Insert, see it, delete, miss it. If the last step fails, you do not have a store. You have a cache of ghosts.",
          chart: chart(
            `flowchart TD
    Ins[Insert canary] --> See[Search finds it]
    See --> Drop[Delete]
    Drop --> Miss{Search still finds it?}
    Miss -->|yes| Bug([Ghost row])
    Miss -->|no| Ok([Delete works])`,
            `class Bug,Ok hub
    class Ins,See,Drop grp1
    class Miss grp2`
          ),
        },
      ],
    },
  ],

  workedExample: {
    title: "Stop quoting last quarter's price",
    setup:
      "The admin UI deleted article P-12. Three customers still get last quarter's price. Staging chunks are in the same collection. There is no tenant field.",
    walkthrough: [
      "Step 1 — Understand the problem. Meaning search is doing its job on a row that should not exist, plus rows that belong to another environment.",
      "Step 2 — Identify the relevant concept. The store must filter, delete for real, and isolate tenants or environments.",
      "Step 3 — Build the simplest solution. Add tenant. Require it on search. Move staging to another collection.",
      "Step 4 — Improve it. Upsert new prices by the same chunk ids. Hard-delete old ids. Prove with a canary.",
      "Step 5 — Handle a failure. If a soft flag remains, the query still returns the ghost. Remove the flag path. Delete is a remove.",
      "Step 6 — Production version. Documents remain the source. A job rebuilds the index. Embedding model version is pinned. The pick-for-the-job sentence names filters and deletes, not a notebook logo.",
    ],
    result:
      "Last quarter's price is gone on the next search. Staging cannot appear. A missing tenant errors out.",
  },

  practice: {
    title: "Choose a store for multi-tenant prices",
    task:
      "You are indexing 2 million price chunks for 400 tenants. Deletes must vanish before the next request. Data must stay in your network. Write the job questions you would ask, a tentative pick, and what you refuse to do with a notebook library.",
    hint:
      "Ask about network, filters, deletes, and who is on call. Do not start with brand preference.",
    solution:
      "Expected reasoning: similarity is assumed; operations decide.\n\nSolution: questions — in-network, filter on tenant and plan, immediate delete, corpus size, on-call. A reasonable pick is self-hosted Qdrant or Milvus with tenant required on every query and a canary delete in CI. Refuse Chroma-in-a-notebook as production. Refuse mixing embedding models in one collection. Refuse a shared staging/production shelf.\n\nWhy it works: the sentence names the job.\n\nCommon wrong approach: copy the logo from a tutorial and add tenant 'later'.",
  },

  takeaways: [
    "A vector is a list of numbers that stands in for meaning. A vector database stores many lists and finds neighbors quickly.",
    "A row is the vector plus ids and labels. Without labels you will return a neighbor nobody should see.",
    "The verbs that matter are upsert, search, delete, and filter — not the logo on the box.",
    "A missing tenant is an error, not a wider search.",
    "Deletes must be proven. A UI that hides a row is not a delete if search still returns it.",
    "Pick a store for network, filters, deletes, and operations. The notebook default is a starting point, not a production layer.",
  ],

  mistakes: [
    "Mistake: treat the vector store as the system of record. Why people make it: it is where search happens. What actually happens: you cannot rebuild and ghosts win. Better approach: documents you own, index derived.",
    "Mistake: soft-delete with a flag the query ignores. Why people make it: undo is easier. What actually happens: last quarter's price ranks again. Better approach: remove the id and prove it.",
    "Mistake: share one collection across staging and production. Why people make it: faster comparison. What actually happens: staging URLs in live answers. Better approach: separate shelves.",
    "Mistake: mix embedding models in one index. Why people make it: a quick A/B. What actually happens: nearness becomes noise. Better approach: new collection, switch reads, drop the old.",
    "Mistake: pick the store from a getting-started notebook. Why people make it: it worked on 2,000 rows. What actually happens: filters and deletes are weak when you need them. Better approach: write a one-sentence job pick.",
    "Mistake: search all tenants when the field is missing. Why people make it: fewer errors in testing. What actually happens: a leak. Better approach: refuse the query.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "What does a vector database store, besides the numbers?",
      answer:
        "What they are testing: the row, not the math.\n\nGood answer: the text or a pointer to it, a stable id, and metadata such as tenant, plan, and language — plus an index that makes nearest-neighbor search fast.\n\nWhy that is good: it names labels.\n\nFollow-up: what happens if you skip tenant?",
    },
    {
      difficulty: "medium",
      question: "Users still see an article you deleted. How do you debug?",
      answer:
        "What they are testing: ghosts and derived indexes.\n\nGood answer: I search the index for that id and a unique phrase. If it is there, delete did not take or a flag was ignored. I check whether the document store and the index disagree, and whether a second copy was upserted under a new id.\n\nWhy that is good: it treats the index as a database.\n\nFollow-up: how would you prevent this in CI?",
    },
    {
      difficulty: "hard",
      question: "How do you choose among Milvus, Pinecone, Qdrant, Chroma, and Weaviate?",
      answer:
        "What they are testing: job-based choice.\n\nGood answer: I ask whether data must stay in-network, how large the corpus is, whether filters and fast deletes matter, and who operates it. Chroma for local and small. Pinecone when I want hosted and can send data out. Qdrant when filters are the job. Milvus when I will run a large cluster. Weaviate when I want more than vectors in one product. I can defend one sentence.\n\nWhy that is good: no universal winner.\n\nFollow-up: when would you skip a dedicated vector database entirely?",
    },
  ],

  glossary: [
    {
      term: "Vector",
      meaning:
        "A list of numbers that stands in for a piece of text. Why it matters: nearness between lists is how meaning search works.",
    },
    {
      term: "Embedding",
      meaning:
        "The act of turning text into a vector with a specific model. Why it matters: mixing models mixes number-spaces.",
    },
    {
      term: "Metadata",
      meaning:
        "Labels on a row, such as tenant or plan, used to filter. Why it matters: nearness without labels returns the wrong neighbor.",
    },
    {
      term: "Upsert",
      meaning:
        "Insert a row or replace the one with the same id. Why it matters: it is how a price change does not become a second copy.",
    },
    {
      term: "Approximate nearest neighbor",
      meaning:
        "A fast search that returns close vectors, not a perfect scan of every row. Why it matters: it is a speed trade you may not need on a tiny corpus.",
    },
    {
      term: "Tenant",
      meaning:
        "Which customer's data a row belongs to. Why it matters: a missing tenant filter is a leak.",
    },
  ],
};
