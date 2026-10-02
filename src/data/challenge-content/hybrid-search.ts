import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "hybrid-search",
  instructor:
    "I teach this from zero. If you have never heard sparse, dense, or hybrid search, that is fine. We will start with two ways to find a page — matching words and matching meaning — then why you usually need both.",
  promise:
    "You will leave knowing why meaning search misses order IDs, why word search misses a paraphrase, how to fuse two ranked lists, and how to measure whether the fuse helped.",

  story: {
    title: "The ticket that would not embed",
    body: [
      "A support assistant used only meaning search. A customer pasted 'we keep getting ERR-4419 on order ORD-88213'. The embedding model turned that message into a list of numbers about 'failed checkout' and 'shipping delays'. It returned three thoughtful articles on failed payments. The article whose title was exactly 'ERR-4419: card declined after 3-D Secure' sat just outside the top five, because the number itself is a weak signal in meaning space.",
      "A second customer wrote, 'why did my card bounce after the extra check from my bank?' — no error code at all. Word search over the same help center missed ERR-4419 because none of those words appear in the article. Meaning search found it. Each engine saved one customer and failed the other.",
      "The team argued about which engine to keep. They kept both. They ran two searches, fused the ranks, and filtered to the customer's product. ERR-4419 rose for the first user because word search is stubborn about tokens. The paraphrase rose for the second user because meaning search is stubborn about ideas. A later reranker cleaned the last mistakes. The fuse, not the reranker, was the turning point.",
      "They also added an evaluation set that included SKUs, error codes, and paraphrases. If a change helped poetry and hurt SKUs, it did not ship. The wiki line we left: embeddings are bad at inventory. Keywords are bad at language. Hybrid is the default until a labelled set says otherwise.",
    ],
    moral:
      "Meaning search and word search fail in opposite ways. Hybrid search is not a fancy extra. It is how you stop choosing which customer to disappoint.",
  },

  stages: [
    {
      id: "two-ways-to-find",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Let us start from zero. When you look for a page, you can match the words or you can match the idea. Matching words is what a Ctrl-F does. If the page contains ERR-4419, you find it. If the user never typed those characters, you do not.",
        "Matching the idea is what embeddings do. The user says 'card bounce after the extra bank check' and you still find the 3-D Secure article. If the user types a unique code that barely appears in the training of the embedding model, the idea search can wander off to 'generally unhappy checkout' pages.",
        "What happens if you pick only one? You choose a failure mode. Code-heavy users lose with only meaning. Plain-language users lose with only words. Real traffic is both.",
        "Here is a tiny picture. A library catalog that only knows ISBNs will miss 'the blue book about foxes'. A librarian who only remembers plots will miss ISBN 978-… when that is all you have. You want both desks.",
        "At this point you should understand the problem: one question, two kinds of clues, two incomplete engines.",
      ],
      diagrams: [
        {
          title: "Each engine disappoints a different customer",
          caption:
            "A unique code is a word clue. A paraphrase is a meaning clue. Real tickets mix both.",
          chart: chart(
            `flowchart TD
    Code([ERR-4419 on ORD-88213]) --> Words[Word search]
    Code --> Mean[Meaning search]
    Para([card bounce after bank check]) --> Words
    Para --> Mean
    Words --> HitCode[ERR article]
    Mean --> MissCode[Generic checkout]
    Words --> MissPara[No shared words]
    Mean --> HitPara[ERR article]`,
            `class Code,Para hub
    class Words,HitCode,MissPara grp1
    class Mean,MissCode,HitPara grp2`
          ),
        },
      ],
    },
    {
      id: "sparse-and-dense",
      level: "beginner",
      title: "What sparse and dense search are",
      body: [
        "Word search, in this sitting, is sparse search. Sparse means most of the numbers in the representation are zero. A page is a long checklist of 'does this word appear, and how special is it?'. BM25 is a common scoring recipe for that checklist. You do not need the formula yet. You need: rare words count more than the word 'the'.",
        "Meaning search is dense search. Dense means the embedding vector is a short list of numbers, almost all of them used, none of them a single word. Nearness in that list is 'about the same topic'.",
        "They look similar because both return a ranked list of pages. The important difference is the clue. Sparse clings to tokens — SKUs, error codes, names. Dense clings to paraphrases.",
        "Semantic search is another name you will hear for dense search. Hybrid search means: run both, then combine the two ranked lists into one. Combining is called fusion.",
        "Why do the names matter? Because a vendor will say 'we have hybrid' and mean three different things: two indexes, one index with two scores, or a reranker on top of one engine. Ask which two lists you get to see.",
      ],
      diagrams: [
        {
          title: "Two engines, one question",
          caption:
            "Each engine produces a ranked list. Hybrid is what you do with both lists, not a third kind of magic.",
          chart: chart(
            `flowchart LR
    Q([Question]) --> Sparse[Sparse / words]
    Q --> Dense[Dense / meaning]
    Sparse --> L1[Ranked list A]
    Dense --> L2[Ranked list B]
    L1 --> Fuse[Fuse]
    L2 --> Fuse
    Fuse --> Out([One list])`,
            `class Q,Out hub
    class Sparse,L1 grp1
    class Dense,L2 grp2
    class Fuse grp3`
          ),
        },
      ],
    },
    {
      id: "simplest-hybrid",
      level: "beginner",
      title: "The simplest fuse: give points for rank",
      body: [
        "What are we trying to do? Combine two ranked lists without arguing about whether a BM25 score of 12 is 'better' than a cosine of 0.81. Those numbers are not on the same scale. Comparing them directly is mixing meters and feet.",
        "Here is the smallest version. Reciprocal rank fusion, often shortened to RRF. Each list gives a page points of 1 / (k + rank). Rank 1 is worth more than rank 10. You add the points from both lists. You do not add the raw scores.",
        "Let's understand what just happened. A page that is first on words and missing from meaning still gets a solid word score. A page that is first on meaning and missing from words still gets a solid meaning score. A page that is decent on both rises to the top. That is the whole trick.",
        "k here is a constant, often 60, that keeps lower ranks from being worthless. You can leave it at 60 until a labelled set tells you to change it.",
        "At this point you should understand the simplest hybrid: two lists, points for rank, add. Next we put filters around both engines.",
      ],
      codes: [
        {
          title: "rrf.py — combine two ranked lists",
          language: "python",
          code: `def rrf(word_ids: list[str], meaning_ids: list[str], k: int = 60) -> list[str]:
    points: dict[str, float] = {}
    for rank, doc_id in enumerate(word_ids, start=1):
        points[doc_id] = points.get(doc_id, 0) + 1 / (k + rank)
    for rank, doc_id in enumerate(meaning_ids, start=1):
        points[doc_id] = points.get(doc_id, 0) + 1 / (k + rank)
    return [doc_id for doc_id, _ in sorted(points.items(), key=lambda kv: kv[1], reverse=True)]`,
        },
      ],
    },
    {
      id: "filters-then-fuse",
      level: "intermediate",
      title: "How we implement it in an app",
      body: [
        "Both engines must see the same filter. If word search is limited to product = checkout and meaning search is not, the fuse will reintroduce the neighbor you just excluded. Filters wrap both lists, then you fuse.",
        "What are we trying to do? One query object: text, tenant, product, locale. Two retrieve calls. One fuse. Then the RAG sitting takes the fused ids.",
        "Here is the smallest application version. You already have a word index — many teams already run Elasticsearch or a similar engine. You already have a vector store from the last sitting. Hybrid is the glue, not a third database you must buy on day one.",
        "Let's understand tokenisation for sparse search. Error codes should stay whole. If your word engine splits ERR-4419 into err and 4419, you have thrown away the clue. Configure the analyzer so SKUs and codes are one token.",
        "Connect this back to RAG. Hybrid changes retrieve. It does not replace cite. A fused wrong neighbor still needs a join before it becomes a footnote.",
      ],
      codes: [
        {
          title: "hybrid.py — same filter, then fuse",
          language: "python",
          code: `def retrieve(question: str, filt: dict, words, dense, k: int = 20) -> list[str]:
    w = words(question, filt, k)
    d = dense(question, filt, k)
    return rrf(w, d)[:k]`,
        },
      ],
      diagrams: [
        {
          title: "Filters wrap both engines",
          caption:
            "A fuse must not be a back door around the plan or product filter.",
          chart: chart(
            `flowchart TD
    Q([Question plus filter]) --> W[Word retrieve]
    Q --> D[Meaning retrieve]
    W --> F[Fuse by rank]
    D --> F
    F --> Rag[Cite as usual]`,
            `class Q hub
    class W grp1
    class D grp2
    class F,Rag grp3`
          ),
        },
      ],
    },
    {
      id: "when-rrf-is-not-enough",
      level: "intermediate",
      title: "When a simple fuse is not enough",
      body: [
        "RRF treats the two engines as equals. Sometimes one engine is consistently better on a slice. You can give that engine more weight — multiply its points — after a labelled slice says so. Do not weight from a hunch after one ticket.",
        "A reranker is a second, slower model that looks at the question and a candidate page and scores how well they match. You run it on the fused top 20, not on the whole corpus. It can clean leftover mistakes. It cannot rescue a retrieve that never saw the ERR article.",
        "They look similar — weight and rerank — because both change order. The important difference is cost and job. Weights are cheap and global. A reranker is spendy and local to the last few.",
        "Another break: empty sparse hits on a paraphrase-only query. That is fine. RRF still returns the dense list. Empty dense hits on a code-only query should still return the sparse list. A fuse that requires both lists to be non-empty will fail the customers you meant to save.",
        "Pause and check. If you add a reranker and SKU recall drops, what happened? The reranker prefers fluent articles. Keep the SKU slice on the scoreboard. Do not let prose quality hide inventory misses.",
      ],
      codes: [
        {
          title: "weight.py — only after a slice says so",
          language: "python",
          code: `def weighted_rrf(word_ids, meaning_ids, word_w=1.0, meaning_w=1.0, k=60):
    points = {}
    for rank, doc_id in enumerate(word_ids, start=1):
        points[doc_id] = points.get(doc_id, 0) + word_w / (k + rank)
    for rank, doc_id in enumerate(meaning_ids, start=1):
        points[doc_id] = points.get(doc_id, 0) + meaning_w / (k + rank)
    return sorted(points, key=points.get, reverse=True)`,
        },
      ],
    },
    {
      id: "eval-the-fuse",
      level: "intermediate",
      title: "How the pieces connect: evaluate the fuse",
      body: [
        "Put three rows on one scoreboard: words only, meaning only, hybrid. Split the questions into slices: codes and SKUs, paraphrases, mixed. Ship a change only if hybrid wins overall and does not collapse a slice.",
        "Recall@k is the main retrieve number: did the right article appear in the top k. You can look at answer quality later. If the article never arrived, the model cannot honestly cite it.",
        "Connect this back to the story. The first customer is the SKU slice. The second is the paraphrase slice. An average that hides one slice is how a team 'improves' search and angers half of support.",
        "Log which engine first found the winning id. Over a week you will see whether words or meaning is doing the work on each slice. That log is how you decide weights, not a blog post about RRF constants.",
        "At this point you should be able to explain hybrid as two lists plus a fuse plus a scoreboard — not as a brand feature.",
      ],
      diagrams: [
        {
          title: "Three rows on one scoreboard",
          caption:
            "A win on paraphrases that collapses SKUs does not ship.",
          chart: chart(
            `flowchart LR
    Set[Labelled questions] --> W[Words only]
    Set --> D[Meaning only]
    Set --> H[Hybrid]
    W --> Board[Recall by slice]
    D --> Board
    H --> Board
    Board --> Ship{SKU slice safe?}
    Ship -->|no| Stop([Do not ship])
    Ship -->|yes| Go([Ship])`,
            `class Set,Stop,Go hub
    class W grp1
    class D grp2
    class H,Board,Ship grp3`
          ),
        },
      ],
    },
    {
      id: "how-hybrid-fails",
      level: "advanced",
      title: "How hybrid fails",
      body: [
        "Now that you understand the simple fuse, look at failures. The first is score mixing. Someone adds cosine to BM25 and calls it hybrid. The larger-looking number always wins. Use ranks or calibrated scores, not raw mixes.",
        "The second is a filter on only one engine. The fuse becomes a leak. Same filter object, both calls.",
        "The third is an analyzer that splits SKUs. Sparse search cannot save you if it never saw ERR-4419 as one token. This looks like an embedding failure and is a tokenizer setting.",
        "The fourth is reranking away the code hit because the article is short and ugly. Ugly is not irrelevant. Protect the SKU slice.",
        "The fifth is widening k forever instead of fixing retrieve. A reranker on 200 junk pages is a polish on a miss. If the article is not in the fused 20, go back to indexes and analyzers.",
      ],
      diagrams: [
        {
          title: "Widen retrieve before you polish",
          caption:
            "A reranker can only reorder what retrieve already found.",
          chart: chart(
            `flowchart TD
    Miss([Right article absent]) --> In20{In fused top 20?}
    In20 -->|no| Retr[Fix analyzer, index, or k]
    In20 -->|yes| Rank[Then rerank]
    Retr --> Fuse[Fuse again]
    Rank --> Cite[Cite as usual]`,
            `class Miss hub
    class In20 grp2
    class Retr,Fuse grp1
    class Rank,Cite grp3`
          ),
        },
      ],
    },
    {
      id: "production-default",
      level: "advanced",
      title: "Production: hybrid as the default",
      body: [
        "This approach is useful for any corpus that mixes identifiers and language: help centers, catalogs, tickets, code plus docs. You might avoid it when the corpus is only narrative prose with no SKUs — dense search may be enough, and a second index is cost. You might also avoid a heavy reranker on a cheap FAQ where RRF already hits.",
        "Trade-offs: two indexes mean two writes, two failures, two bills. The payoff is not choosing a customer to disappoint. Start with RRF. Add weights after slices. Add a reranker after the fused 20 is already right most of the time.",
        "Some stores offer hybrid in one product. That can be fine. You still need the same filter on both scores, a SKU-safe analyzer, and a scoreboard with slices. A checkbox named hybrid does not replace those.",
        "The reason we do this is so ERR-4419 and 'card bounce after the extra bank check' land on the same article. One engine will always have a favorite failure.",
        "The learner who can teach this now says: sparse for tokens, dense for paraphrases, fuse by rank, evaluate by slice. Hybrid is the default until the scoreboard says otherwise.",
      ],
      codes: [
        {
          title: "eval_slices.py — do not hide a SKU collapse",
          language: "python",
          code: `def ship(hybrid: dict[str, float], words: dict[str, float], dense: dict[str, float]) -> bool:
    """Each dict is recall@10 by slice name."""
    if hybrid["sku"] + 0.02 < words["sku"]:
        return False
    if hybrid["paraphrase"] + 0.02 < dense["paraphrase"]:
        return False
    return hybrid["all"] >= max(words["all"], dense["all"])`,
        },
      ],
    },
  ],

  workedExample: {
    title: "ERR-4419 versus a paraphrase",
    setup:
      "Article A is titled ERR-4419. Customer 1 pastes the code and an order id. Customer 2 describes 3-D Secure in everyday words. Dense-only misses customer 1. Sparse-only misses customer 2.",
    walkthrough: [
      "Step 1 — Understand the problem. Two clues, two opposite misses.",
      "Step 2 — Identify the relevant concept. Sparse plus dense, fused by rank.",
      "Step 3 — Build the simplest solution. Top 20 from each engine, RRF, take top 10. Article A rises for both customers.",
      "Step 4 — Improve it. Same product filter on both engines. Keep ERR-4419 as one token in the word analyzer.",
      "Step 5 — Handle a failure. A reranker drops the short ERR article. The SKU slice on the scoreboard blocks the ship. You pin identifier titles or skip the reranker on that slice.",
      "Step 6 — Production version. Three-row scoreboard. Log which engine first found the winner. Weights only after a week of slices.",
    ],
    result:
      "Both customers get article A. A later reranker is allowed only if the SKU slice stays up.",
  },

  practice: {
    title: "Do not pick a side",
    task:
      "Your team wants to turn off word search because 'embeddings are the future'. Half of tickets contain SKUs. Design the smallest hybrid you would ship this month and the scoreboard that would be allowed to turn an engine off later.",
    hint:
      "Name the two lists. Ask how you fuse without mixing raw scores. Ask what slices must not drop.",
    solution:
      "Expected reasoning: opposite failure modes, so default is both.\n\nSolution: BM25 or equivalent plus vector search, same filters, RRF. Scoreboard: sku, paraphrase, mixed, all. You may turn an engine off only if that slice stays within a small gap on a labelled set. Analyzer keeps SKUs whole.\n\nWhy it works: a future story has to beat a slice, not a slogan.\n\nCommon wrong approach: mix cosine and BM25, or delete sparse because a demo paraphrase looked good.",
  },

  takeaways: [
    "Sparse search matches words and rare tokens. Dense search matches meaning. Each fails the other customer.",
    "Hybrid search runs both engines and fuses the ranked lists. It is how you stop choosing a failure mode.",
    "Do not add raw BM25 to raw cosine. Those numbers are not on the same scale. Fuse ranks, as in RRF.",
    "The same filter must wrap both engines. A fuse must not reopen a tenant or product door.",
    "Evaluate by slice: SKUs, paraphrases, mixed. An average can hide a collapse.",
    "A reranker polishes the last few. It cannot find an article retrieve never returned.",
  ],

  mistakes: [
    "Mistake: keep only embeddings. Why people make it: paraphrases look impressive. What actually happens: error codes fall out of the top five. Better approach: hybrid by default.",
    "Mistake: keep only keywords. Why people make it: SKUs work. What actually happens: everyday language misses. Better approach: hybrid by default.",
    "Mistake: add the raw scores together. Why people make it: one number feels fused. What actually happens: the larger scale always wins. Better approach: RRF or calibrated scores.",
    "Mistake: filter one engine. Why people make it: the other API is awkward. What actually happens: the fuse leaks. Better approach: one filter object, two calls.",
    "Mistake: split SKUs in the analyzer. Why people make it: default tokenizers look fine on English. What actually happens: sparse search never sees the code. Better approach: keep identifiers whole.",
    "Mistake: ship a reranker that helps prose and hurts SKUs. Why people make it: overall score ticked up. Better approach: slice gates on the scoreboard.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "Why would embedding search miss an error code?",
      answer:
        "What they are testing: token versus meaning.\n\nGood answer: a unique code is a weak meaning signal. The embedding wanders toward generally related topics. Sparse search clings to the token.\n\nWhy that is good: it names the failure.\n\nFollow-up: when does word search miss instead?",
    },
    {
      difficulty: "medium",
      question: "How do you combine BM25 and cosine without mixing units?",
      answer:
        "What they are testing: fusion.\n\nGood answer: I do not add the raw scores. I fuse ranks with RRF, or I calibrate. Same filters on both lists. Then I measure recall by slice.\n\nWhy that is good: it avoids the meters-and-feet bug.\n\nFollow-up: when would you add a reranker?",
    },
    {
      difficulty: "hard",
      question: "When would you turn hybrid off?",
      answer:
        "What they are testing: judgment.\n\nGood answer: when a labelled set shows one engine wins every slice and the second index costs more than it saves — for example a prose-only corpus with no identifiers. I would not turn it off because a vendor said dense is enough. I keep slice gates so a later change cannot quietly collapse SKUs.\n\nWhy that is good: the scoreboard can fire the extra engine.\n\nFollow-up: where should hybrid live, in the store or in the app?",
    },
  ],

  glossary: [
    {
      term: "Sparse search",
      meaning:
        "Word-based retrieve, often BM25, where most features are zero. Why it matters: it clings to SKUs and error codes.",
    },
    {
      term: "Dense search",
      meaning:
        "Embedding-based retrieve, where nearness is meaning. Why it matters: it finds paraphrases that share no words.",
    },
    {
      term: "Hybrid search",
      meaning:
        "Running sparse and dense retrieve and fusing the lists. Why it matters: each engine's miss is the other's hit.",
    },
    {
      term: "RRF",
      meaning:
        "Reciprocal rank fusion: points of 1 / (k + rank) from each list, then add. Why it matters: it fuses without mixing raw score units.",
    },
    {
      term: "Fusion",
      meaning:
        "Combining two ranked lists into one. Why it matters: this is the hybrid step; two indexes without fusion are just two searches.",
    },
    {
      term: "Reranker",
      meaning:
        "A slower model that reorders a small candidate list. Why it matters: it polishes; it cannot invent a miss retrieve never returned.",
    },
  ],
};
