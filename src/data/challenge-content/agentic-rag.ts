import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "agentic-rag",
  instructor:
    "I am a senior engineer who has shipped search-plus-answer systems that looked right in demos and wrong in production. I start from 'why the model does not know your policy'.",
  promise:
    "You will go from never having heard of RAG to seeing why one dump of documents is not enough, and how to let a helper search again, cite, or refuse.",

  story: {
    title: "The policy answer that was two years out of date",
    body: [
      "An insurance team built a helper that answered coverage questions. They split the handbook into pieces, stored those pieces, and on every question they grabbed the nearest five and pasted them into the model. Demos used the new handbook. The answers sounded careful and specific.",
      "A customer asked whether flood damage from a broken city water main was covered under policy CP-2024. The helper said yes, citing a paragraph. The paragraph was from 2022. The 2024 handbook had narrowed that case. The old piece was still in the store because nothing had marked it as replaced. The nearest-five search liked it: the words flood and water were a close match.",
      "The customer filed a claim on the strength of that chat. The claim was denied. The screenshot of the helper's yes became a complaint. The model had not invented the rule. It had been handed the wrong page and asked to sound helpful.",
      "The one-shot search could not say 'this piece is old' or 'I should search again with the year in the query' or 'I do not have a 2024 paragraph, so I will not answer'. It always retrieved, always pasted, always answered. The rebuild treated search as a tool the helper could call, grade, or refuse — and every piece carried a date and a 'replaced by' field.",
    ],
    moral:
      "Pasting the nearest pages is not the same as knowing. A helper that cannot search again, or refuse, will answer from the wrong page with a confident voice.",
  },

  stages: [
    {
      id: "why-outside-knowledge",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "A language model is trained on a snapshot of public text. It does not have your 2024 handbook, your tickets, or today's prices inside its head. If you ask it anyway, it will guess in the style of a handbook. That guess is the problem this lesson exists to stop.",
        "There is another approach people mention: teach the model your handbook by training it again. That is slow, expensive, and stale the week the handbook changes. For questions about documents that move, you want the documents at question time, not baked into the model.",
        "So we retrieve. Retrieval means: find a few relevant pieces of text, then let the model write an answer using those pieces. The everyday picture is an open-book test. The model may only use the pages you put on the desk.",
        "Here is a tiny example. Question: 'What is the refund window?' You find the paragraph that says 30 days. You paste that paragraph. The model answers 30 days and points at the paragraph. If the paragraph is missing, the honest move is 'I do not know', not a remembered 14 days from some other shop.",
        "We will name this pattern. RAG means Retrieval-Augmented Generation: retrieve first, then generate. The words are just the open-book test in engineering clothes.",
        "At this point you should understand the problem: the model needs your documents at answer time. Next we will see why grabbing the nearest five pages is not the end of the story.",
      ],
      diagrams: [
        {
          title: "Closed book versus open book",
          caption:
            "Without retrieval, the model guesses. With retrieval, it can use a page you fetched — if you fetched the right one.",
          chart: chart(
            `flowchart TD
    Q([User question]) --> Guess[Model answers from memory]
    Guess --> Risk([Confident guess])
    Q --> Find[Find a few pages]
    Find --> Desk[Put pages on the desk]
    Desk --> Write[Model writes using those pages]
    Write --> Cited([Answer with a source])`,
            `class Q,Risk,Cited hub
    class Guess grp1
    class Find,Desk,Write grp2`
          ),
        },
      ],
    },
    {
      id: "naive-rag",
      level: "beginner",
      title: "The simple version, and where it snaps",
      body: [
        "The simple system has two times. At ingest time you cut documents into chunks — small passages, maybe a few hundred words — and store them. At question time you turn the question into the same kind of representation, find nearby chunks, and paste them.",
        "A chunk is just a slice of a document. Too big and the search is muddy. Too small and a sentence loses the heading that said '2024, commercial policy'. That heading is metadata: extra fields stored with the chunk, like date, policy id, tenant, and 'this replaces chunk X'.",
        "An embedding is a list of numbers that stands for the meaning of a piece of text. A vector store is a database that can find numbers close to other numbers. The analogy is a bookshelf that finds similar ideas, not exact titles. The technical fact: it is math on numbers, not a human sense of meaning.",
        "Naive RAG always does the same thing: embed the question, take top five, generate. It snaps when the question needs two searches ('flood' and 'CP-2024'), when an old chunk is closer than a new one, when the top five are the wrong tenant, or when nothing relevant exists and the model answers anyway.",
        "They look similar, RAG and 'just prompt the handbook in'. The important difference is scale and freshness. You cannot paste a thousand-page handbook every time. You also cannot fine-tune every week. Retrieval is the middle path — and it is only as good as the pieces you stored and the decision to use them.",
        "Pause and check. If retrieval returns nothing useful, should the model speak? In a coverage question, no. That refusal is already the seed of agentic RAG.",
      ],
      diagrams: [
        {
          title: "Naive RAG with the snap points marked",
          caption:
            "One retrieve, one paste, one answer. Each arrow is a place the wrong page can get through.",
          chart: chart(
            `flowchart TD
    Docs([Handbook]) --> Cut[Cut into chunks]
    Cut --> Store[(Vector store)]
    Q([Question]) --> Embed[Embed the question]
    Embed --> Top[Nearest five]
    Store --> Top
    Top --> Paste[Paste into the model]
    Paste --> Ans([Answer])
    Old[Old chunk still stored] -.-> Top
    Empty[Nothing relevant] -.-> Paste`,
            `class Docs,Q,Ans hub
    class Cut,Embed,Paste grp1
    class Store,Top grp2
    class Old,Empty grp3`
          ),
        },
      ],
    },
    {
      id: "retrieve-as-tool",
      level: "beginner",
      title: "Search as a tool the helper can call again",
      body: [
        "Agentic RAG means retrieval is a tool, not a reflex. The helper may search, read what came back, and decide to search again with a better query, to fetch a named document, or to refuse.",
        "Why a tool? Because the first query is often a bad query. 'Is flood from a city main covered under CP-2024?' may need two looks: one for flood and water main, one for CP-2024 and the year 2024. A reflex that always uses the raw user sentence cannot do that.",
        "The helper should also grade the result. Grading here means a simple check: do these passages actually mention the policy and the year? If not, rewrite the query. If they still do not, stop. Do not decorate a no with a yes.",
        "This is still the ReAct idea from an earlier lesson. Thought: 'I need the 2024 CP paragraph.' Action: search. Observation: five chunks from 2022. Thought: 'wrong year, search again with year=2024'. Or: 'I still do not have it — I will not answer.'",
        "What are we trying to do? A retrieve tool the loop can call. Here is the smallest version.",
        "Let's understand what just happened. The model did not get pages glued to the question. It chose to search, saw a miss, and could choose again. A budget — say two rewrites — keeps this from becoming an endless hunt.",
      ],
      codes: [
        {
          title: "Retrieval as a tool, not a reflex",
          language: "python",
          code: `def retrieve(query: str, *, year: int | None, policy_id: str | None) -> list[str]:
    filters = {}
    if year:
        filters["year"] = year
    if policy_id:
        filters["policy_id"] = policy_id
    hits = store.search(query, k=5, filters=filters)
    return [h.text for h in hits]

# The loop may call retrieve, read hits, call again, or refuse.`,
        },
      ],
    },
    {
      id: "hybrid-and-filters",
      level: "intermediate",
      title: "When 'nearest meaning' is not enough",
      body: [
        "Embeddings are good at 'these sentences are about the same idea'. They are weak at exact tokens: a policy id, a year, a product code. CP-2024 may be 'near' CP-2022 in number-space. That is how the story's old paragraph won.",
        "Hybrid search means you also use ordinary keyword search — the kind that finds the exact string CP-2024 — and then you combine the two lists. A common combine step is: if a chunk ranks well on either list, it rises. You do not need the formula name yet. You need the idea: meaning plus exact words.",
        "Reranking is a second, slower pass on a short list. A small model (or a dedicated reranker) reads the question and each remaining chunk and scores 'does this actually answer?'. Use it on ten chunks, not ten thousand. It is accuracy you buy with a little latency.",
        "Filters belong before similarity, not after. If the user is tenant Acme, you must not search the whole store and then drop other tenants. A near miss from another tenant should never enter the model. The tenant key is a door, not a preference.",
        "Remember this: metadata you did not store at ingest cannot be filtered at query time. Dates, policy ids, 'replaced_by', tenant — if they are not fields on the chunk, they are not doors. Chunking is where your ceiling is set.",
      ],
      diagrams: [
        {
          title: "Filter, recall, then look carefully",
          caption:
            "Tenant and year first. Broad fetch next. A short rerank last. Never the other way around.",
          chart: chart(
            `flowchart TD
    Q([Question plus session]) --> Filter[Filter tenant, year, policy]
    Filter --> Key[Keyword hits]
    Filter --> Sem[Similar-meaning hits]
    Key --> Fuse[Combine lists]
    Sem --> Fuse
    Fuse --> Rerank[Score the short list]
    Rerank --> Desk[Pages on the desk]`,
            `class Q,Desk hub
    class Filter grp3
    class Key,Sem,Fuse grp1
    class Rerank grp2`
          ),
        },
      ],
      codes: [
        {
          title: "Filter first, then search",
          language: "python",
          code: `def search(query: str, session, k: int = 20) -> list:
    where = {"tenant_id": session.tenant_id, "superseded": False}
    keyword_hits = keyword_index.find(query, where=where, k=k)
    near_hits = vector_index.find(query, where=where, k=k)
    merged = fuse(keyword_hits, near_hits)
    return rerank(query, merged)[:5]`,
        },
      ],
    },
    {
      id: "cite-or-refuse",
      level: "intermediate",
      title: "Cite the page, or refuse to speak",
      body: [
        "An answer without a source is a guess wearing a suit. Ask the model to return claims plus the chunk ids it used. Then your code checks: does that chunk id exist in the retrieved set? If the model cites a page you never fetched, drop the claim.",
        "Groundedness is the name for 'this sentence is supported by a retrieved page'. You do not need a philosophy of truth. You need a check you can run. No supporting chunk: do not show the sentence.",
        "Refusal is a first-class result. 'I do not have a current CP-2024 paragraph on city water mains' is a correct system. A yes with a 2022 cite is an incorrect system that looks better on a demo score.",
        "What are we trying to do? Structure the answer so a check can pass or fail. Here is the smallest version.",
        "Let's understand what just happened. The model proposed a claim and a chunk id. Your code verified the id. That is not the model checking itself. That is you checking the model. Keep that order.",
      ],
      codes: [
        {
          title: "Claims you can check",
          language: "python",
          code: `def grounded(answer: dict, retrieved_ids: set[str]) -> str | None:
    for claim in answer["claims"]:
        if claim["chunk_id"] not in retrieved_ids:
            return None  # refuse this draft
        if not overlap(claim["text"], chunks[claim["chunk_id"]]):
            return None
    return answer["prose"]`,
        },
      ],
    },
    {
      id: "real-path",
      level: "intermediate",
      title: "How the pieces connect in a real question",
      body: [
        "A coverage question hits your API. You already know the tenant from the session. You do not start by embedding. You start by asking: is this a retrieval question at all? 'Hello' is not. 'What is a deductible?' might be a glossary. 'Is this flood covered under CP-2024?' is retrieval.",
        "If it is retrieval, the helper may call the retrieve tool with filters. It grades hits. It may rewrite once. It drafts claims. You verify cites. You return prose plus links, or a refusal that names what was missing.",
        "Ingest is a product surface. When a new handbook ships, you mark old chunks superseded. You do not hope similarity prefers the new file. A superseded flag is a filter, and filters beat vibes.",
        "Connect this back to tool contracts. retrieve is a read. It can be cached for a short time. It must require the session tenant. It should return small passages, not whole chapters, or you will spend the context window on one chatty hit.",
        "At this point you should be able to draw: ingest with metadata, retrieve as a tool, grade, cite or refuse. That is agentic RAG without a brand name.",
      ],
      diagrams: [
        {
          title: "Not every question is a search question",
          caption:
            "Route first. Retrieval is for questions whose answer should come from your documents.",
          chart: chart(
            `flowchart TD
    Q([User question]) --> Route{Kind?}
    Route -->|chitchat| Talk[Answer without search]
    Route -->|lookup| Retriever[Retrieve tool]
    Retriever --> Grade{Hits good enough?}
    Grade -->|no, budget left| Rewrite[Rewrite query]
    Rewrite --> Retriever
    Grade -->|no, budget gone| Refuse([Refuse])
    Grade -->|yes| Cite[Draft with cites]
    Cite --> Check{Cites real?}
    Check -->|no| Refuse
    Check -->|yes| Reply([Grounded answer])`,
            `class Q,Refuse,Reply hub
    class Route,Grade,Check grp1
    class Retriever,Rewrite,Cite,Talk grp2`
          ),
        },
      ],
    },
    {
      id: "drift-and-evals",
      level: "advanced",
      title: "When the rewrite loop wanders",
      body: [
        "The simple agentic version can get lost. Each rewrite drifts a little: flood, then water, then plumbing, then a boiler paragraph that has nothing to do with the policy. That is query drift. It feels like progress because new chunks appear.",
        "Cap rewrites. Two is plenty for most desks. Also require that a new query stay close to the user's words or to the policy id. If the rewrite drops CP-2024, reject the rewrite. The budget is a door, like the ReAct step budget.",
        "Evaluate retrieval separately from answering. A beautiful sentence can sit on a wrong page. A clunky sentence can sit on the right page. Score: did we fetch a chunk that a human marked as relevant? Then score: did the final prose stay inside those chunks? If you only score the final sentence against a reference answer, you will ship the story again — the words matched a yes, the page was 2022.",
        "Four failures, four fixes. Wrong tenant: filter first. Stale chunk: superseded flag. Missed exact id: hybrid search. Invented cite: verify ids. None of those are 'get a bigger model'.",
        "Imagine the tool returns nothing here. What should the agent do? Refuse, and log the query so you can see a hole in the handbook. A hole you can see is a documentation bug. A hole you paper over is a legal event.",
      ],
      diagrams: [
        {
          title: "A rewrite that wandered, and the doors that stop it",
          caption:
            "Two rewrites, keep the policy id, then refuse. Drift is not research.",
          chart: chart(
            `flowchart TD
    Q1[User: flood plus CP-2024] --> R1[Search]
    R1 --> G1{Hits have year and id?}
    G1 -->|no| R2[Rewrite, must keep CP-2024]
    R2 --> R1
    G1 -->|yes| Cite2[Cite]
    R2 --> Cap{Rewrite count at two?}
    Cap -->|yes| Stop([Refuse and log the hole])`,
            `class Q1,Cite2,Stop hub
    class R1,R2 grp1
    class G1,Cap grp2`
          ),
        },
      ],
      codes: [
        {
          title: "Keep the id, cap the rewrites",
          language: "python",
          code: `def allow_rewrite(original: str, next_q: str, n: int) -> bool:
    if n >= 2:
        return False
    return "CP-2024" in original and "CP-2024" in next_q`,
        },
      ],
    },
    {
      id: "operate-or-skip",
      level: "advanced",
      title: "Running this, and when not to build it",
      body: [
        "Operations means: you watch empty retrievals, refused answers, and cite failures as first-class metrics. You re-ingest on handbook release. You have a way to kill a poisoned document — one that was uploaded to steer answers — without waiting for similarity to forget it.",
        "Trade-offs. Agentic RAG spends extra model calls for rewrites and grading. It is useful when questions are messy and documents conflict. Naive RAG is cheaper when queries are uniform and the corpus is small and clean. Fine-tuning is for style and skills, not for next week's policy PDF.",
        "You might avoid retrieval entirely when the source of truth is a database row, not a paragraph. 'What is this account's plan?' should be a billing tool, not a search over old emails. Search is for prose. Rows are for rows.",
        "Cost sits in tokens. Every chunk you paste you pay for. Five tight passages beat twenty overlapping ones. The cheapest retrieval win is often a better chunk and a filter, not a second agent.",
        "The person who can teach this now says: RAG is an open-book test. Agentic RAG lets the student ask for another book, or decline to answer. The librarian — your filters, dates, and cites — still runs the library.",
      ],
    },
  ],

  workedExample: {
    title: "Is flood from a city main covered under CP-2024?",
    setup:
      "The store still has a 2022 yes and a 2024 narrower paragraph. The user is tenant Acme. The helper must not answer from 2022.",
    walkthrough: [
      "Step 1 — Understand the problem. A nearest-five paste prefers the old 'flood' wording. The year and policy id are the real keys.",
      "Step 2 — Identify the relevant concept. Agentic RAG: retrieve as a tool, with filters, hybrid search, cite or refuse.",
      "Step 3 — Build the simplest search. retrieve('flood city main CP-2024') with tenant=Acme. Still might return 2022.",
      "Step 4 — Improve it. Filter superseded=false and year=2024. Keyword search for CP-2024. Rerank the short list.",
      "Step 5 — Handle a failure. If 2024 hits are empty, refuse: no current paragraph. Do not fall back to 2022 because it is 'close'.",
      "Step 6 — Production. Ingest marks 2022 replaced_by 2024. Claims must cite a fetched id. Empty retrievals page the docs team.",
    ],
    result:
      "The user either gets the 2024 rule with a cite, or an honest 'we do not have that paragraph'. They do not get a 2022 yes.",
  },

  practice: {
    title: "Make a retrieval system that refuses correctly",
    task:
      "A helper answers HR questions from a handbook. A user asks about parental leave in Sweden. You have a US handbook only. Problem: design retrieve + answer so the helper cannot invent a Swedish policy. Think about: filters, rewrite budget, and what refusal says.",
    hint:
      "Country is metadata. A rewrite that drops 'Sweden' is illegal. Zero good hits must refuse. Expected reasoning: filter country=SE returns empty; do not broaden to US and hope.",
    solution:
      "Chunks carry country. retrieve requires country from the question or a slot the user filled. If empty, one rewrite that keeps 'Sweden'. If still empty, refuse: 'I only have the US handbook.' Why this works: closeness to 'leave' is not permission to speak. Common wrong approach: always take top five global chunks — the US parental-leave page will look relevant and be wrong.",
  },

  takeaways: [
    "A model does not contain your latest documents. Retrieval puts a few pages on the desk at answer time.",
    "Naive RAG always searches once and always answers. That is how an old page becomes a confident yes.",
    "Agentic RAG treats search as a tool: the helper can rewrite, fetch again, or refuse.",
    "Filters (tenant, year, superseded) run before similarity. Metadata you did not store cannot save you later.",
    "Hybrid search helps exact ids and years. Embeddings alone blur CP-2024 into CP-2022.",
    "Cite chunks you actually retrieved, or refuse. A fluent sentence on a missing page is still a miss.",
  ],

  mistakes: [
    "Mistake: always paste top five and answer. Why people make it: the tutorial ends there. What actually happens: stale or irrelevant pages get a voice. Better approach: grade hits and allow refusal.",
    "Mistake: no dates or replaced_by on chunks. Why people make it: ingest is a weekend script. What actually happens: 2022 wins on wording. Better approach: metadata and a superseded filter.",
    "Mistake: filter tenant after search. Why people make it: easier query. What actually happens: another tenant's chunk can leak into the prompt. Better approach: filter first, always.",
    "Mistake: rely only on embeddings for ids and years. Why people make it: one index feels clean. What actually happens: nearby numbers beat exact tokens. Better approach: hybrid search.",
    "Mistake: let rewrites wander forever. Why people make it: 'the agent is researching'. What actually happens: query drift, extra cost, random pages. Better approach: a rewrite budget and a similarity floor to the original question.",
    "Mistake: score only the final sentence. Why people make it: it matches a golden answer. What actually happens: you ship grounded-looking ungrounded systems. Better approach: score retrieval and groundedness separately.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "What is RAG, in everyday language?",
      answer:
        "What they are testing: the open-book picture. Good answer: find a few relevant passages, then let the model answer using those passages. Why that is good: no brand names required. Follow-up: why not put the whole handbook in the prompt?",
    },
    {
      difficulty: "medium",
      question: "Why might agentic RAG beat one-shot retrieval on a policy question?",
      answer:
        "What they are testing: rewrite, filters, refuse. Good answer: the first query may miss the year or id; a tool can search again or refuse if the right page is not there. Why that is good: it names decisions, not magic. Follow-up: what stops the rewrite loop?",
    },
    {
      difficulty: "hard",
      question: "When would you not use RAG at all?",
      answer:
        "What they are testing: judgment. Good answer: when the answer is a database row (plan, balance, order status), call that tool; when the corpus is tiny and static, paste it; when you need a new skill rather than new facts, consider training. Why that is good: RAG is for prose that changes. Follow-up: how would you combine a billing tool and RAG in one helper?",
    },
  ],

  glossary: [
    {
      term: "RAG",
      meaning:
        "Retrieval-Augmented Generation: fetch relevant text, then generate an answer with it. Why it matters: it is how you give a model your documents at question time.",
    },
    {
      term: "Chunk",
      meaning:
        "A small slice of a document stored for search. Why it matters: bad slices lose headings and dates, and search cannot recover them.",
    },
    {
      term: "Embedding",
      meaning:
        "A list of numbers that stands in for a piece of text so similar ideas land nearby. Why it matters: this is 'meaning search', and it is weak on exact codes.",
    },
    {
      term: "Agentic RAG",
      meaning:
        "Retrieval used as a tool the helper can call, rewrite, or skip. Why it matters: one reflex search cannot handle messy questions or missing pages.",
    },
    {
      term: "Hybrid search",
      meaning:
        "Combining keyword search with meaning search. Why it matters: policy ids and years need exact tokens, not only nearby numbers.",
    },
    {
      term: "Groundedness",
      meaning:
        "Each claim in the answer is supported by a retrieved passage. Why it matters: it is how you catch a fluent lie.",
    },
  ],
};
