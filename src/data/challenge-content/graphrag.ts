import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "graphrag",
  instructor:
    "I teach this from zero. If you have never used a graph or heard GraphRAG, that is fine. We will start with a question that nearest-document search cannot answer, then build the smallest map of people and links that can.",
  promise:
    "You will leave knowing when 'find similar paragraphs' is the wrong tool, what a node and an edge are, how to walk a tiny knowledge graph to answer a who-owns-what question, and when a graph is not worth building over a help center that simple RAG already serves.",

  story: {
    title: "The VP who did not live in one paragraph",
    body: [
      "After a Saturday outage, someone asked an internal assistant: who owns the payments platform, and were they in the incident review for OUT-4419? The company had put wiki pages, docs, and exported chat into a normal RAG system. The assistant returned three executive bios, a strategy memo that said 'payments' a lot, and a post-mortem that felt similar because both mentioned Saturday and latency. None of the five pieces contained the join the question asked for.",
      "The facts existed. An org chart said Mira Chen, VP Platform, owned payments. An incident table listed Mira Chen as an attendee. They were two documents, two chunks, no shared paragraph. Search that looks for 'nearby meaning' has no idea that two names are the same person sitting on two different lists.",
      "A platform engineer built a small map over a weekend. People, teams, services, and incidents became dots. 'owns', 'reports to', and 'attended' became lines. Extraction was messy — 'Mira C.' and 'Mira Chen' had to be treated as one person — but the question became a walk: payments service to owner, OUT-4419 to attendees, intersect. The answer was one name and two pointers. The model only wrote the sentence.",
      "They did not throw away document search. Ordinary questions still used RAG. The map was for questions whose answer is a path. The rule they left on the wiki is the one I still use: if the question is a join, build a join, not a bigger pile of paragraphs.",
    ],
    moral:
      "Paragraph search finds neighbors. A graph finds paths. When the answer is 'the person who stands on two lines', similar bios are not relevance. They are a near miss.",
  },

  stages: [
    {
      id: "when-paragraphs-fail",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Let us start from zero. In the last sitting, RAG found pieces of text that were about the question and asked a model to write. That works when the answer lives in one place: a price, a policy sentence, a how-to step.",
        "It fails when the question is a relationship. Who owns this service? Who reports to whom? Which person sat in two meetings? Those facts are often stored as lists and trees, not as a single helpful paragraph. Search that looks for similar wording will bring you biographies that 'feel like' leadership, not the join.",
        "Here is a tiny picture. You want to know which friend went to both the picnic and the concert. You do not need the friend who talks the most about music. You need the name that appears on both guest lists. That is a walk across two lists, not a hunt for a similar essay.",
        "What happens if you only have RAG? The model blends nearby bios and says 'it is likely one of the payment leads'. A human who already knows the answer stops trusting the assistant. Trust dies faster than accuracy scores.",
        "At this point you should understand the problem: some questions need a map of things and links, because the answer is a path.",
      ],
      diagrams: [
        {
          title: "A paragraph hunt misses a join",
          caption:
            "Two true facts in two documents will not meet if you only search for similar wording.",
          chart: chart(
            `flowchart TD
    Q([Who owns payments and attended OUT-4419]) --> Rag[Nearest paragraphs]
    Rag --> Bios[Executive bios]
    Org[Org chart: Mira owns payments] -.->|never joined| Bios
    Inc[Incident table: Mira attended] -.->|never joined| Bios
    Bios --> Miss([A confident near miss])`,
            `class Q,Miss hub
    class Rag,Bios grp1
    class Org,Inc grp2`
          ),
        },
      ],
    },
    {
      id: "what-a-graph-is",
      level: "beginner",
      title: "What a graph is: dots and lines",
      body: [
        "Everyday picture: a subway map. Stations are dots. Tracks are lines. You answer 'can I get from A to B?' by walking the lines, not by reading a poem about both stations.",
        "In engineering, a graph is that map. A node is a thing you care about — a person, a service, an incident. An edge is a named link between two nodes — owns, reports_to, attended. The pair (Mira, owns, payments) is one edge.",
        "Why does this exist? Because a paragraph stores words in order. A graph stores relationships you can follow. 'Who owns payments?' is one hop. 'Who owns payments and attended this review?' is two hops and an intersection.",
        "They look similar to a table because both hold facts. The important difference is the question you ask. A table is great at 'give me row 12'. A graph is great at 'follow owns, then follow attended, then meet'.",
        "GraphRAG is the name people use when retrieval walks this map — and sometimes summarizes neighborhoods on the map — instead of only fetching nearby paragraphs. The model still writes the sentence. The walk is what found the facts.",
      ],
      diagrams: [
        {
          title: "Two facts, one person",
          caption:
            "The answer is the node that sits on both lines. You do not need a paragraph that mentions both facts.",
          chart: chart(
            `flowchart LR
    Pay[payments] -->|owns| Mira[Mira Chen]
    Out[OUT-4419] -->|attended| Mira
    Mira -->|reports to| Ceo[CEO]`,
            `class Mira hub
    class Pay,Out grp1
    class Ceo grp2`
          ),
        },
      ],
    },
    {
      id: "simplest-walk",
      level: "beginner",
      title: "The simplest version: a walk on a tiny map",
      body: [
        "What are we trying to do? Store a few nodes and edges in memory, then answer a join by walking, not by prompting. No extraction yet. You should be able to trace the walk with a finger.",
        "Here is the smallest version. Two dictionaries: one from a service to its owner, one from an incident to its attendees. Intersect the two sets. If one name remains, that is the answer. The model can turn that name into a sentence. The model did not find the name.",
        "Let's understand what just happened. The 'retrieval' was set intersection. That is not a metaphor. A lot of GraphRAG in the small is exactly this: follow edges, collect node ids, intersect or filter, then write.",
        "What happens without the walk? You stuff both documents into a prompt and hope the model notices the same name. Sometimes it does. Sometimes it prefers a more famous VP. Hope is not a join.",
        "At this point you should understand the simplest GraphRAG: a map, a walk, a sentence. The map is the product. The sentence is decoration on top of a set.",
      ],
      codes: [
        {
          title: "tiny_graph.py — edges you can walk",
          language: "python",
          code: `owns = {"payments": "mira-chen", "search": "devon-park"}
attended = {"OUT-4419": {"mira-chen", "sam-ortiz"}, "OUT-4400": {"devon-park"}}
names = {"mira-chen": "Mira Chen", "devon-park": "Devon Park", "sam-ortiz": "Sam Ortiz"}


def who_owns_and_attended(service: str, incident: str) -> str | None:
    owner = owns.get(service)
    people = attended.get(incident, set())
    if owner and owner in people:
        return names[owner]
    return None`,
        },
      ],
    },
    {
      id: "extract-and-resolve",
      level: "intermediate",
      title: "How we implement it: extract, then resolve names",
      body: [
        "Real documents do not arrive as two dictionaries. They arrive as sentences: 'Mira C. owns Payments' and 'Attendees: Mira Chen, Sam Ortiz'. Extraction means: read a sentence and write down nodes and edges. A model can help with that. Your code still stores the result as data, not as another paragraph.",
        "The next problem is names. 'Mira C.', 'Mira Chen', and 'M. Chen, VP Platform' are one person if your org says so. Entity resolution is the job of collapsing mentions into one node id. Without it, the walk never meets. The picnic list says Mira C. The concert list says Mira Chen. You conclude nobody went to both.",
        "What are we trying to do? For each mention, look up a directory — email, employee id, service catalog id — and store the edge with those ids. If you cannot resolve, store the mention as unresolved and do not invent a merge.",
        "Let's understand the danger of a sloppy merge. If you collapse two different people named Alex, your graph will report that one Alex owns two unrelated orgs. False merges are worse than missed edges. A missed edge is a 'I do not know'. A false merge is a lie with a diagram.",
        "Connect this back to RAG. Extraction can use RAG to find candidate sentences. The graph is what you build after. Do not skip the directory lookup because the model 'seems sure' two strings are the same person.",
      ],
      codes: [
        {
          title: "resolve.py — mentions become one id",
          language: "python",
          code: `DIRECTORY = {
    "mira chen": "mira-chen",
    "mira c.": "mira-chen",
    "m. chen": "mira-chen",
    "sam ortiz": "sam-ortiz",
}


def resolve(mention: str) -> str | None:
    key = mention.strip().lower()
    return DIRECTORY.get(key)


def add_edge(edges: list, src: str, rel: str, mention: str) -> None:
    dst = resolve(mention)
    if dst is None:
        return  # unresolved: do not invent a node
    edges.append((src, rel, dst))`,
        },
      ],
      diagrams: [
        {
          title: "From a sentence to a walkable edge",
          caption:
            "The model may propose a mention. The directory decides the id. The edge is stored as data.",
          chart: chart(
            `flowchart LR
    Sent[Sentence] --> Ext[Extract mention]
    Ext --> Dir{In directory?}
    Dir -->|no| Skip[Leave unresolved]
    Dir -->|yes| Edge[Store src, rel, id]
    Edge --> Walk[Later walks use the id]`,
            `class Sent,Walk hub
    class Ext,Edge grp1
    class Dir,Skip grp2`
          ),
        },
      ],
    },
    {
      id: "when-walk-is-not-enough",
      level: "intermediate",
      title: "When a single walk is not enough",
      body: [
        "Some questions are not two hops. 'Summarize how the payments org talks about reliability after Saturday incidents' is a neighborhood question. You need many nodes around payments, plus the documents those nodes came from.",
        "One pattern is community summaries. A community is a cluster of tightly linked nodes — a team and its services, for example. Offline, you write a short summary of that cluster from the source documents. At question time you retrieve a few summaries, then maybe a few exact edges. This is the idea behind several GraphRAG systems you will read about.",
        "Here is the key idea. A summary is a convenience. It is not a proof. If the question is a factual join, walk the edges and cite the source rows. If the question is a theme, a summary can help. Do not answer 'who attended' from a poetic paragraph about the incident.",
        "Another pattern is mixing indexes. A router looks at the question. 'What is the refund window?' goes to paragraph RAG. 'Who owns X and sat in Y?' goes to the graph. They look similar because both retrieve. The important difference is the shape of the answer: a passage versus a path.",
        "You might avoid community summaries when the graph is small and the questions are joins. Building clusters and summaries is extra jobs, extra staleness, extra ways to sound sure. Walk first.",
      ],
    },
    {
      id: "how-it-fits",
      level: "intermediate",
      title: "How the pieces connect in an application",
      body: [
        "Put the pieces on one path. Source systems you already trust — org chart, service catalog, incident table — load nodes and edges on a schedule. Unstructured docs contribute candidate mentions that must resolve against those systems. A question hits a router. Join questions walk. Passage questions use RAG. The model writes from structured results plus optional snippets.",
        "The graph is derived, like a vector index. The org chart remains the system of record for 'who reports to whom'. If Mira changes teams, the next load must rewrite the owns edges. A pretty graph that nobody refreshes becomes a rumor mill.",
        "Cite the walk. The user should see 'Mira Chen owns payments (org chart, 2026-03-02) and attended OUT-4419 (incident table)'. That is the same join rule as RAG, with edge ids instead of chunk ids.",
        "Connect this back to the story. The bios were not wrong. They were the wrong index. A router would have never sent that question to nearest paragraphs.",
        "At this point you should be able to say which of your product questions are passages and which are paths, before you buy a graph product.",
      ],
      diagrams: [
        {
          title: "Router, then the right index",
          caption:
            "One assistant, two retrieve paths. The model is the last step on both.",
          chart: chart(
            `flowchart TD
    Q([Question]) --> R{Join or passage?}
    R -->|passage| Rag[Chunk retrieve]
    R -->|join| Walk[Walk edges]
    Rag --> Write[Model writes]
    Walk --> Write
    Write --> Out([Answer plus pointers])`,
            `class Q,Out hub
    class R grp2
    class Rag,Walk grp1
    class Write grp3`
          ),
        },
      ],
      codes: [
        {
          title: "router.py — pick a walk or a paragraph search",
          language: "python",
          code: `JOIN_HINTS = ("who owns", "who reports", "who attended", "and also")


def route(question: str) -> str:
    q = question.lower()
    if any(h in q for h in JOIN_HINTS):
        return "graph"
    return "rag"


def answer(question: str, walk, rag) -> str:
    if route(question) == "graph":
        hit = walk(question)
        return hit or "I do not know from the map."
    return rag(question)`,
        },
      ],
    },
    {
      id: "how-graphs-fail",
      level: "advanced",
      title: "How graphs fail: bad merges, stale edges, pretty summaries",
      body: [
        "Now that you understand the simple map, look at what breaks it. The first failure is a bad merge. Two people become one node. Every later walk is confident and wrong. Resolution must prefer official ids. When unsure, leave two nodes and say you are unsure.",
        "The second failure is a stale edge. Mira left payments last month. The graph still says owns. Paragraph RAG can be stale too, but a graph looks more official because it is a diagram. Load times and source versions belong on every answer.",
        "The third failure is answering a join from a community summary. The summary said 'platform leadership was in the review'. That is not 'Mira attended'. Pretty text hid a missing edge.",
        "The fourth failure is extracting edges from gossip. Chat logs say 'I think Devon owns search'. If the service catalog says otherwise, the catalog wins. Unstructured extraction is a suggestion. Structured sources are the spine.",
        "Pause and check. If the walk returns empty, should the model fall back to bios? Only if you label that fallback as a guess. Silent fallback is how the original incident returns.",
      ],
    },
    {
      id: "when-worth-the-build",
      level: "advanced",
      title: "When the graph is worth the build",
      body: [
        "This approach is useful when your questions are paths: ownership, reporting, attendance, dependencies between services. You might avoid it when the corpus is a help center of how-to pages. Simple RAG already answers those, and a graph would be a second index nobody will refresh.",
        "Trade-offs are real. You will spend time on directories, loads, and resolution. You gain questions that paragraph search cannot meet. You also gain a new way to be wrong: a clean diagram of a bad merge.",
        "Microsoft's GraphRAG papers popularized community summaries over a document graph. That family is useful for theme questions over a large corpus. It is not required for a 200-row org chart. Start with edges you already have in tables. Add extraction later.",
        "Prove the walk before you buy summaries. Take twenty real join questions. If set intersection on trusted tables already answers them, ship that. If the misses are missing edges in the tables, fix the tables. If the misses are facts that only live in prose, then extraction has a job.",
        "The learner who can teach this now says: GraphRAG is retrieval by walking relationships. Use it when the answer is a path. Do not use it as a fancier bookshelf for questions a paragraph already holds.",
      ],
      codes: [
        {
          title: "intersect.py — the join is a set, not a prompt",
          language: "python",
          code: `def prove(service: str, incident: str, owns: dict, attended: dict) -> dict:
    owner = owns.get(service)
    people = attended.get(incident, set())
    hit = owner if owner in people else None
    return {
        "owner": owner,
        "attendees": sorted(people),
        "join": hit,
        "sources": ["org_chart.owns", "incidents.attendees"],
    }`,
        },
      ],
      diagrams: [
        {
          title: "Prove the walk before you buy summaries",
          caption:
            "Tables you already have may be the whole graph. Summaries are a later convenience.",
          chart: chart(
            `flowchart TD
    Qs([Join questions]) --> Tables{Trusted tables enough?}
    Tables -->|yes| Ship[Ship the walk]
    Tables -->|missing rows| Fix[Fix the source]
    Tables -->|facts only in prose| Ext[Then extract]
    Ext --> Sum{Need themes too?}
    Sum -->|no| Ship
    Sum -->|yes| Comm[Community summaries]`,
            `class Qs,Ship hub
    class Tables,Sum grp2
    class Fix,Ext,Comm grp1`
          ),
        },
      ],
    },
  ],

  workedExample: {
    title: "Who owns payments and attended OUT-4419?",
    setup:
      "Org chart: Mira Chen owns payments. Incident table: Mira Chen and Sam Ortiz attended OUT-4419. Wiki bios mention several VPs and Saturday latency. A RAG helper returned bios.",
    walkthrough: [
      "Step 1 — Understand the problem. The answer is a person who sits on two lists. No single paragraph has both facts.",
      "Step 2 — Identify the relevant concept. A graph walk: owns, attended, intersect.",
      "Step 3 — Build the simplest solution. Two dictionaries. Intersection returns mira-chen. The model writes one sentence.",
      "Step 4 — Improve it. Resolve 'Mira C.' through the employee directory so both sources share an id. Attach source names to the answer.",
      "Step 5 — Handle a failure. If the incident table is a day late, the walk returns empty. Do not silently fall back to bios. Say the map does not have the join yet.",
      "Step 6 — Production version. A scheduled load from org chart and incidents. A router sends join questions to the walk. Community summaries stay off this path.",
    ],
    result:
      "The assistant names Mira Chen with two pointers. Bios are never used as proof of attendance.",
  },

  practice: {
    title: "Answer a join without stuffing more docs",
    task:
      "Users ask 'which engineering manager owns checkout and was on-call during INC-88?' RAG returns manager bios. You have an org table and an on-call calendar. Design the smallest system that can answer. Do not add community summaries unless you can say why.",
    hint:
      "Name the nodes and edges. Ask how names become ids. Ask what you do when the walk is empty.",
    solution:
      "Expected reasoning: this is a path, not a passage.\n\nSolution: nodes for people, services, incidents. Edges owns and on_call. Resolve names through the employee directory. Walk checkout → owner, INC-88 → on-call, intersect. Cite both tables. Empty walk returns 'I do not know from the map', not a bio.\n\nWhy it works: the join lives in data you can test.\n\nCommon wrong approach: embed more bios or ask an agent to hop documents until a name feels right.",
  },

  takeaways: [
    "Paragraph search finds neighbors. A graph finds paths. Some questions are paths.",
    "A node is a thing. An edge is a named link. GraphRAG retrieves by walking those links.",
    "Entity resolution collapses mentions into one id. Without it, two lists never meet.",
    "A false merge is worse than a missed edge. When unsure, leave two nodes.",
    "Cite the walk with source tables and dates. A diagram is not proof if the edge is stale.",
    "Build a graph when you have join questions. Do not build one as decoration on a help center RAG already serves.",
  ],

  mistakes: [
    "Mistake: stuff more documents into RAG when the question is a join. Why people make it: RAG already exists. What actually happens: similar bios, no intersection. Better approach: walk edges from trusted tables.",
    "Mistake: merge names because they look alike. Why people make it: extraction is noisy. What actually happens: one node owns two lives. Better approach: official ids, unresolved otherwise.",
    "Mistake: answer attendance from a community summary. Why people make it: the paragraph sounds complete. What actually happens: a theme is treated as a fact. Better approach: factual joins walk edges.",
    "Mistake: let unstructured chat override the org chart. Why people make it: the model extracted it confidently. What actually happens: gossip becomes a diagram. Better approach: structured sources are the spine.",
    "Mistake: never refresh the graph. Why people make it: the first load looked right. What actually happens: stale owns edges look official. Better approach: scheduled loads and versions on answers.",
    "Mistake: build GraphRAG for a how-to help center. Why people make it: the paper was impressive. What actually happens: a second stale index. Better approach: keep paragraph RAG until you have path questions.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "When does ordinary RAG fail in a way a graph can fix?",
      answer:
        "What they are testing: the problem, not a product name.\n\nGood answer: when the answer is a relationship spread across lists — who owns, who attended — and no single paragraph contains the join. Similar bios are a near miss.\n\nWhy that is good: it names the join.\n\nFollow-up: what is a node and an edge in that example?",
    },
    {
      difficulty: "medium",
      question: "Your graph says two different people are the same node. What do you inspect?",
      answer:
        "What they are testing: resolution discipline.\n\nGood answer: I look at how mentions became ids. If the merge was string similarity, I split them and require a directory id. I would rather leave a mention unresolved than publish a false owns edge.\n\nWhy that is good: it treats false merges as the serious failure.\n\nFollow-up: how do you prevent unstructured extraction from overriding the org chart?",
    },
    {
      difficulty: "hard",
      question: "When is GraphRAG not worth the build?",
      answer:
        "What they are testing: judgment.\n\nGood answer: when questions are single-hop how-tos over a curated help center, paragraph RAG is enough. I also delay community summaries until a walk on trusted tables fails for reasons that live only in prose. A graph that nobody refreshes is a rumor mill.\n\nWhy that is good: it prices the extra index.\n\nFollow-up: how would you prove a walk is enough with twenty questions?",
    },
  ],

  glossary: [
    {
      term: "Graph",
      meaning:
        "A map of nodes (things) and edges (named links). Why it matters: you can walk relationships instead of hoping they share a paragraph.",
    },
    {
      term: "Node",
      meaning:
        "One thing on the map, such as a person or a service, with a stable id. Why it matters: walks meet only when both lists use that id.",
    },
    {
      term: "Edge",
      meaning:
        "A named link between two nodes, such as owns or attended. Why it matters: the link is the fact you retrieve.",
    },
    {
      term: "Entity resolution",
      meaning:
        "Collapsing different mentions of the same thing into one id. Why it matters: without it, joins silently fail.",
    },
    {
      term: "GraphRAG",
      meaning:
        "Retrieval that uses a knowledge graph — walks, and sometimes neighborhood summaries — to ground an answer. Why it matters: it is for path questions, not a replacement for all RAG.",
    },
    {
      term: "Community summary",
      meaning:
        "A prewritten paragraph about a cluster of linked nodes. Why it matters: useful for themes; unsafe as proof of a specific join.",
    },
  ],
};
