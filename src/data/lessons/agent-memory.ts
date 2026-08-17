import { createLesson, type LessonInput } from "./builder";
import { pastelChart } from "@/lib/mermaid-pastel";

function b(...lines: string[]) {
  return lines.map((l) => `- ${l}`).join("\n");
}

function memoryLesson(input: LessonInput) {
  return createLesson({
    ...input,
    visualFirst: true,
    practiceTask: "",
    code: undefined,
    codeLanguage: undefined,
  });
}

export const agentMemoryLessons: Record<string, ReturnType<typeof createLesson>> = {
  "memory-fundamentals": memoryLesson({
    concept: b(
      "Memory is how an agent keeps facts across turns and sessions",
      "Three tiers: working (now), short-term (session), long-term (store)",
      "What to save, when to fetch, and what to forget are design choices",
      "Memory costs tokens and latency — it is never free"
    ),
    whyItExists:
      "Without memory every chat is a first meeting. Users expect the agent to remember preferences and past work.",
    analogy:
      "A stranger on every call vs a colleague who remembers your last three projects.",
    analogyDiagram: pastelChart(
      `flowchart LR
    None["No memory"] --> Stranger["First meeting<br/>every time"]
    Mem["Memory"] --> Colleague["Knows your<br/>last project"]`,
      `class None,Stranger grp1
    class Mem,Colleague grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Memory])

    subgraph Tiers["Tiers"]
        T1["Working = now"]
        T2["Short-term = session"]
        T3["Long-term = store"]
    end

    subgraph Jobs["Jobs"]
        J1["What to save"]
        J2["When to fetch"]
        J3["What to forget"]
    end

    subgraph Cost["Cost"]
        C1["Tokens"]
        C2["Latency"]
        C3["Stale facts"]
    end

    Hub --> Tiers
    Hub --> Jobs
    Hub --> Cost`,
      `class Hub hub
    class T1,T2,T3 grp1
    class J1,J2,J3 grp2
    class C1,C2,C3 grp3
    style Tiers fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Jobs fill:#ecfdf5,stroke:#6ee7b7,color:#065f46
    style Cost fill:#fee2e2,stroke:#fca5a5,color:#991b1b`
    ),
    workflowDiagrams: [
      {
        title: "Where a fact lives",
        caption: "This turn sits in working memory. The session keeps a buffer. Last month lives in a store.",
        chart: pastelChart(
          `flowchart LR
    Turn["This turn"] --> Session["This session"]
    Session --> Store["Across sessions"]`,
          `class Turn grp1
    class Session grp2
    class Store grp3`
        ),
      },
    ],
    technicalExplanation:
      "Working memory is the context window. Short-term is the session buffer. Long-term is a store you retrieve from. Design all three or the agent will feel new every time.",
    example:
      "A PM agent remembers you like Kanban, sprint 12 slipped, and the team uses Jira — loaded at the start of each session.",
    commandsToRemember: [
      "Working = context window",
      "Short-term = this session",
      "Long-term = persisted store",
      "Memory costs tokens",
    ],
    revisionNotes: {
      cheatSheet: [
        "Three tiers, not one blob",
        "Save / fetch / forget are explicit",
        "Memory is not free",
        "No memory = stranger every turn",
      ],
    },
    glossary: ["Working Memory", "Short-Term Memory", "Long-Term Memory", "Context Window"],
    commonMistakes: [
      "Dumping all history into every prompt",
      "Storing secrets in long-term memory",
      "Never expiring stale facts",
    ],
    learnElsewhere: [
      "Context window limits — Phase 1",
      "Vector stores for retrieval — Phase 3 RAG",
    ],
  }),

  "working-memory": memoryLesson({
    concept: b(
      "Working memory is the agent's RAM — what fits in the context window now",
      "It holds the prompt, recent turns, tool results, and scratch notes",
      "When the window fills, oldest or least useful tokens must go",
      "Watch token count every step of a long task"
    ),
    whyItExists:
      "The model can only see what is in the window. Overflow silently drops the system prompt or the user's goal.",
    analogy: "Your desk: only what is on it is usable. The rest is in a cabinet.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Desk["Desk = window"] --> Now["Prompt + tools"]
    Cabinet["Cabinet"] --> Later["Long-term store"]`,
      `class Desk,Now grp1
    class Cabinet,Later grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Working])

    subgraph Holds["In the window"]
        H1["System prompt"]
        H2["Recent turns"]
        H3["Tool results"]
    end

    subgraph Limits["Limits"]
        L1["Token cap"]
        L2["Cost per token"]
        L3["Dropped prefix"]
    end

    subgraph Moves["When full"]
        M1["Truncate old"]
        M2["Summarize"]
        M3["Slide window"]
    end

    Hub --> Holds
    Hub --> Limits
    Hub --> Moves`,
      `class Hub hub
    class H1,H2,H3 grp1
    class L1,L2,L3 grp2
    class M1,M2,M3 grp3`
    ),
    workflowDiagrams: [
      {
        title: "One reasoning step",
        caption: "Everything the model reads this step is working memory.",
        chart: pastelChart(
          `flowchart LR
    P["Prompt"] --> LLM["Model"]
    T["Tool output"] --> LLM
    LLM --> Next["Next step"]`,
          `class P,T grp1
    class LLM hub
    class Next grp2`
        ),
      },
    ],
    technicalExplanation:
      "Working memory is not a database. It is the messages you send this call. Track tokens. Truncate, summarize, or slide when you approach the cap.",
    example:
      "A 20-step coding agent keeps the current file, last terminal output, and five user messages — not the whole repo.",
    commandsToRemember: [
      "Working memory = this call's tokens",
      "Count tokens every step",
      "Truncate or summarize when full",
      "Never drop the system prompt first",
    ],
    revisionNotes: {
      cheatSheet: [
        "RAM, not a filing cabinet",
        "Prompt + history + tools",
        "Cap is hard",
        "Protect the system prompt",
      ],
    },
    glossary: ["Context Window", "Token Budget", "Scratchpad"],
    commonMistakes: [
      "Appending every tool dump forever",
      "Letting the system prompt fall off the front",
      "Ignoring token counts until the API errors",
    ],
    learnElsewhere: ["Summarization — later in this phase", "Long-term stores — Long-Term Memory"],
  }),

  "short-term-memory": memoryLesson({
    concept: b(
      "Short-term memory lasts for the session, not forever",
      "It is a rolling buffer of this chat, often with a running summary",
      "When the session ends, STM is discarded unless you promote facts",
      "Use it for the current task, not for lifetime preferences"
    ),
    whyItExists:
      "A 40-turn chat will not fit in the window. STM keeps the thread without paying for every old token.",
    analogy: "A notepad for today's meeting — you throw it out unless you file an action item.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Today["Today's pad"] --> Session["This chat"]
    File["File it"] --> LTM["Long-term"]`,
      `class Today,Session grp1
    class File,LTM grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Short-term])

    subgraph Session["This session"]
        S1["Turn buffer"]
        S2["Running summary"]
        S3["Open tasks"]
    end

    subgraph SessEnd["Session end"]
        E1["Discard"]
        E2["Promote facts"]
    end

    Hub --> Session
    Session --> SessEnd`,
      `class Hub hub
    class S1,S2,S3 grp1
    class E1,E2 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Session lifecycle",
        caption: "Buffer during the chat. Promote only what should survive.",
        chart: pastelChart(
          `flowchart LR
    Open["Session start"] --> Buf["Buffer turns"]
    Buf --> Close["Session end"]
    Close --> Keep["Save facts"]
    Close --> Drop["Drop the rest"]`,
          `class Open,Buf grp1
    class Keep grp2
    class Drop grp3`
        ),
      },
    ],
    technicalExplanation:
      "STM is usually a message list plus a summary that updates every N turns. Do not confuse it with a vector store. Promote durable facts on purpose.",
    example:
      "A support agent keeps this ticket's order id and last three replies. Tomorrow that ticket is retrieved from long-term, not from STM.",
    commandsToRemember: [
      "STM = this session only",
      "Buffer + rolling summary",
      "Promote facts on purpose",
      "Discard on session end",
    ],
    revisionNotes: {
      cheatSheet: [
        "Session notepad, not a vault",
        "Summary keeps the thread",
        "Promote or lose it",
        "Wrong place for preferences",
      ],
    },
    glossary: ["Session Buffer", "Rolling Summary"],
    commonMistakes: [
      "Treating STM as forever storage",
      "Never writing a session summary",
      "Saving the whole transcript as long-term by default",
    ],
    learnElsewhere: ["Memory Summarization", "Long-Term Memory"],
  }),

  "long-term-memory": memoryLesson({
    concept: b(
      "Long-term memory survives sessions — preferences, facts, past work",
      "Write on purpose: extract, store, retrieve on the next visit",
      "Stores are vector DBs, key-value, or graphs — pick for the query",
      "Stale LTM is worse than none — version and expire facts"
    ),
    whyItExists:
      "Users come back days later. If nothing persisted, you rebuilt a chatbot, not an assistant.",
    analogy: "A personnel file — not today's notepad. You open it when they walk in.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Visit["New visit"] --> File["Open file"]
    File --> Know["Known prefs"]`,
      `class Visit grp1
    class File,Know grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Long-term])

    subgraph Write["Write"]
        W1["Extract fact"]
        W2["Store with id"]
        W3["Tag user / time"]
    end

    subgraph Read["Read"]
        R1["Query by user"]
        R2["Retrieve top-k"]
        R3["Pack into prompt"]
    end

    Hub --> Write
    Hub --> Read`,
      `class Hub hub
    class W1,W2,W3 grp1
    class R1,R2,R3 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Next session",
        caption: "Load durable facts before the first model call.",
        chart: pastelChart(
          `flowchart LR
    Login["User returns"] --> Fetch["Fetch LTM"]
    Fetch --> Prompt["Add to prompt"]
    Prompt --> Chat["Chat"]`,
          `class Login,Fetch grp1
    class Prompt,Chat grp2`
        ),
      },
    ],
    technicalExplanation:
      "LTM is a store with write, retrieve, and forget. Extract structured facts. Index by user. Retrieve a small set at session start. Expire what is no longer true.",
    example:
      "User said they prefer Python six months ago. LTM returns that fact on login so the agent does not switch to Java.",
    commandsToRemember: [
      "LTM survives sessions",
      "Extract → store → retrieve",
      "Index by user",
      "Expire stale facts",
    ],
    revisionNotes: {
      cheatSheet: [
        "Personnel file, not notepad",
        "Write on purpose",
        "Small retrieve at start",
        "Forget is a feature",
      ],
    },
    glossary: ["Persistence", "Fact Extraction", "Forgetting"],
    commonMistakes: [
      "Saving raw transcripts as LTM",
      "Never expiring old preferences",
      "Retrieving 200 memories into the prompt",
    ],
    learnElsewhere: ["Semantic vs episodic — next modules", "Memory Stores"],
  }),

  "semantic-memory": memoryLesson({
    concept: b(
      "Semantic memory stores facts and meanings, not a play-by-play of events",
      "Typical shape: embeddings in a vector store, or a fact table",
      "Retrieve by similarity: 'what do we know about this user / topic?'",
      "Keep facts atomic so you can update one without rewriting a story"
    ),
    whyItExists:
      "Agents need 'user prefers Kanban' without replaying every chat that mentioned boards.",
    analogy: "A wiki of facts, not a diary of every day you learned them.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Wiki["Wiki = facts"] --> Q["What is true?"]
    Diary["Diary = events"] --> When["What happened?"]`,
      `class Wiki,Q grp1
    class Diary,When grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Semantic])

    subgraph Store["Store"]
        S1["Atomic facts"]
        S2["Embeddings"]
        S3["User tags"]
    end

    subgraph Use["Use"]
        U1["Embed query"]
        U2["Top-k similar"]
        U3["Inject facts"]
    end

    Hub --> Store
    Hub --> Use`,
      `class Hub hub
    class S1,S2,S3 grp1
    class U1,U2,U3 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Fact in, fact out",
        caption: "Extract one claim. Embed it. Later retrieve it by meaning.",
        chart: pastelChart(
          `flowchart LR
    Chat["Chat"] --> Fact["One fact"]
    Fact --> Vec["Embed + store"]
    Vec --> Hit["Retrieve later"]`,
          `class Chat,Fact grp1
    class Vec,Hit grp2`
        ),
      },
    ],
    technicalExplanation:
      "Semantic memory is knowledge: names, prefs, policies. Store small claims with embeddings or keys. Do not store a whole episode here — that is episodic.",
    example:
      "'Prefers Python' and 'team uses Jira' sit in semantic memory. The meeting where they said it sits in episodic memory.",
    commandsToRemember: [
      "Facts, not stories",
      "Atomic claims",
      "Retrieve by similarity",
      "Update one fact at a time",
    ],
    revisionNotes: {
      cheatSheet: [
        "Wiki, not diary",
        "Embeddings or a fact table",
        "Atomic updates",
        "Different from episodes",
      ],
    },
    glossary: ["Fact", "Embedding", "Vector Store"],
    commonMistakes: [
      "Embedding entire transcripts as one 'fact'",
      "Mixing events into the fact store",
      "Never updating a fact when the user changes",
    ],
    learnElsewhere: ["Episodic Memory", "RAG embeddings — Phase 3"],
  }),

  "episodic-memory": memoryLesson({
    concept: b(
      "Episodic memory stores events: what happened, when, with whom",
      "Each episode has a time, a context, and an outcome",
      "Retrieve episodes when the user asks 'last time we…'",
      "Do not treat an episode as a forever fact — extract facts separately"
    ),
    whyItExists:
      "People remember incidents. An agent that cannot recall 'the outage last Tuesday' feels broken.",
    analogy: "A diary of days, not the wiki of truths you distilled from them.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Day["Tuesday outage"] --> Episode["Episode"]
    Truth["API is flaky"] --> Fact["Semantic fact"]`,
      `class Day,Episode grp1
    class Truth,Fact grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Episodic])

    subgraph Episode["One episode"]
        E1["When"]
        E2["What"]
        E3["Outcome"]
    end

    subgraph After["After"]
        A1["Store episode"]
        A2["Maybe extract fact"]
    end

    Hub --> Episode
    Episode --> After`,
      `class Hub hub
    class E1,E2,E3 grp1
    class A1,A2 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Recall last time",
        caption: "Query episodes by time or similarity, then summarize for the prompt.",
        chart: pastelChart(
          `flowchart LR
    Ask["Last time?"] --> Find["Find episode"]
    Find --> Sum["Short recap"]
    Sum --> Reply["Answer"]`,
          `class Ask,Find grp1
    class Sum,Reply grp2`
        ),
      },
    ],
    technicalExplanation:
      "Store episodes with timestamps and a short summary. Retrieve by recency or embedding. Promote stable conclusions into semantic memory; keep the story as an episode.",
    example:
      "User: 'the refund we discussed Friday.' Episodic hit: Friday 4pm, order 4412, promised a callback. Semantic fact: that order is still open.",
    commandsToRemember: [
      "Episodes have a when",
      "Store summary + time",
      "Extract facts separately",
      "Recall by recency or meaning",
    ],
    revisionNotes: {
      cheatSheet: [
        "Diary of events",
        "When + what + outcome",
        "Not a forever fact",
        "Promote facts out",
      ],
    },
    glossary: ["Episode", "Recency", "Event Memory"],
    commonMistakes: [
      "Using episodes as the only memory type",
      "No timestamps on stored chats",
      "Never extracting a fact from a repeating episode",
    ],
    learnElsewhere: ["Semantic Memory", "Memory Retrieval"],
  }),

  "procedural-memory": memoryLesson({
    concept: b(
      "Procedural memory is how-to: skills, playbooks, and saved procedures",
      "It is 'run these steps', not 'this fact is true'",
      "Store as prompts, graphs, or tool sequences the agent can reuse",
      "Version playbooks — a bad saved procedure will repeat forever"
    ),
    whyItExists:
      "Re-deriving 'how we file a Jira bug' every time wastes tokens and drifts from team process.",
    analogy: "Riding a bike: you do not re-read the manual; you run the skill.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Manual["Re-read manual"] --> Slow["Slow + drift"]
    Skill["Saved skill"] --> Fast["Same steps"]`,
      `class Manual,Slow grp1
    class Skill,Fast grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Procedural])

    subgraph What["What it is"]
        W1["Playbook"]
        W2["Tool sequence"]
        W3["Prompt skill"]
    end

    subgraph Care["Care"]
        C1["Version it"]
        C2["Test it"]
        C3["Retire it"]
    end

    Hub --> What
    Hub --> Care`,
      `class Hub hub
    class W1,W2,W3 grp1
    class C1,C2,C3 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Reuse a skill",
        caption: "Match the task to a playbook, then run the saved steps.",
        chart: pastelChart(
          `flowchart LR
    Task["File a bug"] --> Hit["Match playbook"]
    Hit --> Run["Run steps"]
    Run --> Done["Logged ticket"]`,
          `class Task,Hit grp1
    class Run,Done grp2`
        ),
      },
    ],
    technicalExplanation:
      "Procedural memory is reusable how-to. Keep it as a named procedure with inputs. Do not hide it only inside a long system prompt you cannot version.",
    example:
      "Skill `file_jira_bug`: collect repro, severity, component, then call the Jira tool. The agent loads that skill instead of inventing a new process.",
    commandsToRemember: [
      "How-to, not facts",
      "Named playbooks",
      "Version and test",
      "Retire bad skills",
    ],
    revisionNotes: {
      cheatSheet: [
        "Bike skill, not wiki",
        "Saved sequences",
        "Version playbooks",
        "Different from facts",
      ],
    },
    glossary: ["Playbook", "Skill", "Procedure"],
    commonMistakes: [
      "Stuffing all how-to into one giant system prompt",
      "Never versioning a procedure after it fails",
      "Confusing a fact ('we use Jira') with a procedure ('how to file')",
    ],
    learnElsewhere: ["Tool Calling — Phase 7", "Context Engineering — Phase 6", "Agent Design Patterns — Phase 17"],
  }),

  "conversation-memory": memoryLesson({
    concept: b(
      "Conversation memory is the chat thread: roles, turns, and order",
      "Strategies: keep last N, summarize older, or pin key turns",
      "Role tags matter — user vs assistant vs tool must stay intact",
      "A broken thread makes the model invent a past that never happened"
    ),
    whyItExists:
      "Chat is the default UI. If history is messy, the agent contradicts itself mid-thread.",
    analogy: "A meeting transcript with names on each line — not a pile of unmarked quotes.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Named["Named turns"] --> Sense["Coherent chat"]
    Pile["Unmarked quotes"] --> Drift["Invented past"]`,
      `class Named,Sense grp2
    class Pile,Drift grp1`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Conversation])

    subgraph Keep["Keep"]
        K1["Last N turns"]
        K2["Pinned turns"]
        K3["Tool results"]
    end

    subgraph Shrink["Shrink"]
        S1["Summarize old"]
        S2["Drop small talk"]
    end

    Hub --> Keep
    Hub --> Shrink`,
      `class Hub hub
    class K1,K2,K3 grp1
    class S1,S2 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Pack the next call",
        caption: "Pin the goal, keep recent turns, summarize the tail.",
        chart: pastelChart(
          `flowchart LR
    Pin["Pinned goal"] --> Pack["Pack prompt"]
    Recent["Last N"] --> Pack
    Sum["Old summary"] --> Pack`,
          `class Pin,Recent,Sum grp1
    class Pack grp2`
        ),
      },
    ],
    technicalExplanation:
      "Store turns with role and id. Trim from the middle or summarize the oldest block. Never merge user and tool messages into one blob.",
    example:
      "A 60-turn design chat: pin the original brief, keep the last eight turns, replace turns 1–50 with a one-paragraph summary.",
    commandsToRemember: [
      "Keep roles on every turn",
      "Last N + summary",
      "Pin the goal",
      "Do not flatten tools into user text",
    ],
    revisionNotes: {
      cheatSheet: [
        "Thread with names",
        "Last N + summary",
        "Pin what matters",
        "Roles stay intact",
      ],
    },
    glossary: ["Turn", "Role", "Pinned Message"],
    commonMistakes: [
      "Dropping tool messages from history",
      "Summarizing so hard the user's constraint disappears",
      "Sending the entire 200-turn log every time",
    ],
    learnElsewhere: ["Working Memory", "Memory Summarization"],
  }),

  "memory-stores": memoryLesson({
    concept: b(
      "Pick a store for the query: KV for keys, vectors for meaning, graph for links",
      "One product often uses more than one store",
      "The store is not memory policy — it only holds bytes",
      "Latency and tenancy matter as much as recall quality"
    ),
    whyItExists:
      "The wrong store makes 'user.prefers_python' a 200ms vector search instead of a 2ms key lookup.",
    analogy: "A filing cabinet, a search index, and a whiteboard — different jobs, different furniture.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Key["Key lookup"] --> KV["KV store"]
    Mean["By meaning"] --> Vec["Vector DB"]
    Link["By relation"] --> Graph["Graph"]`,
      `class Key,KV grp1
    class Mean,Vec grp2
    class Link,Graph grp3`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Stores])

    subgraph Pick["Pick"]
        P1["KV = ids"]
        P2["Vector = similar"]
        P3["Graph = links"]
    end

    subgraph Ops["Ops"]
        O1["Per-user tenant"]
        O2["Backup"]
        O3["Latency SLO"]
    end

    Hub --> Pick
    Hub --> Ops`,
      `class Hub hub
    class P1,P2,P3 grp1
    class O1,O2,O3 grp2`
    ),
    workflowDiagrams: [
      {
        title: "A write",
        caption: "Policy decides what to save. The store only persists it.",
        chart: pastelChart(
          `flowchart LR
    Policy["What to save"] --> Shape["Fact or episode"]
    Shape --> Store["KV / vector / graph"]`,
          `class Policy,Shape grp1
    class Store grp2`
        ),
      },
    ],
    technicalExplanation:
      "KV for exact ids. Vectors for 'things like this'. Graphs for 'related to'. Isolate tenants. Measure p95 retrieve time. Memory logic lives in your code, not in the database brand.",
    example:
      "User id → Redis prefs. Ticket recap → vector store. Org chart → graph. One agent, three stores.",
    commandsToRemember: [
      "KV for exact keys",
      "Vectors for similarity",
      "Graph for relations",
      "Policy ≠ database",
    ],
    revisionNotes: {
      cheatSheet: [
        "Furniture for the query",
        "Often more than one",
        "Tenant + latency",
        "Policy sits above the store",
      ],
    },
    glossary: ["KV Store", "Vector Database", "Graph Store"],
    commonMistakes: [
      "One vector DB for every kind of memory",
      "No per-user isolation",
      "Letting the DB schema become the memory design",
    ],
    learnElsewhere: ["Vector databases — Phase 3", "Long-Term Memory"],
  }),

  "memory-compression": memoryLesson({
    concept: b(
      "Compression shrinks memory so it still fits the token budget",
      "Drop noise, keep constraints, ids, and decisions",
      "Lossy is fine if the lost bits cannot change the next action",
      "Measure: tokens saved vs answers that got worse"
    ),
    whyItExists:
      "Uncompressed memory will blow the window. Blind delete will drop the one constraint that mattered.",
    analogy: "Packing a suitcase: fold, do not throw the passport.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Suit["Pack"] --> Keep["Passport"]
    Suit --> Drop["Spare socks"]`,
      `class Keep grp2
    class Drop grp1
    class Suit hub`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Compress])

    subgraph Keep["Keep"]
        K1["Ids"]
        K2["Constraints"]
        K3["Decisions"]
    end

    subgraph Drop["Drop"]
        D1["Small talk"]
        D2["Duplicate tools"]
        D3["Raw dumps"]
    end

    Hub --> Keep
    Hub --> Drop`,
      `class Hub hub
    class K1,K2,K3 grp2
    class D1,D2,D3 grp1`
    ),
    workflowDiagrams: [
      {
        title: "Before the next call",
        caption: "Compress the tail, then pack. Never compress the live goal.",
        chart: pastelChart(
          `flowchart LR
    Tail["Old turns"] --> Zip["Compress"]
    Zip --> Pack["Pack window"]
    Goal["Live goal"] --> Pack`,
          `class Tail,Zip grp1
    class Goal,Pack grp2`
        ),
      },
    ],
    technicalExplanation:
      "Compression is lossy reduction: extract ids and rules, drop chatter and huge tool JSON. Pair with summarization. Eval on tasks that depend on a buried constraint.",
    example:
      "A 12k-token tool dump becomes 'query returned 3 rows, ids 18, 22, 41, none overdue' — 40 tokens, same next action.",
    commandsToRemember: [
      "Keep ids and constraints",
      "Drop dumps and chatter",
      "Do not compress the live goal",
      "Eval quality vs tokens",
    ],
    revisionNotes: {
      cheatSheet: [
        "Suitcase, keep the passport",
        "Lossy on purpose",
        "Ids + rules stay",
        "Measure regressions",
      ],
    },
    glossary: ["Token Budget", "Lossy Compression"],
    commonMistakes: [
      "Deleting the user's constraint to save 200 tokens",
      "Compressing the current user message",
      "No eval after turning compression on",
    ],
    learnElsewhere: ["Memory Summarization", "Context Management"],
  }),

  "memory-summarization": memoryLesson({
    concept: b(
      "Summarization rewrites old context into a shorter running note",
      "Update every N turns so the summary does not rot",
      "A bad summary is a false memory — the model will trust it",
      "Keep a pointer to the raw log for audits"
    ),
    whyItExists:
      "You cannot keep 80 turns. A summary is the only way to stay coherent without the full log.",
    analogy: "Meeting minutes — not a recording of every cough.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Rec["Full recording"] --> Huge["Too big"]
    Notes["Minutes"] --> Use["Usable"]`,
      `class Rec,Huge grp1
    class Notes,Use grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Summarize])

    subgraph How["How"]
        H1["Every N turns"]
        H2["Keep ids"]
        H3["Keep open tasks"]
    end

    subgraph Risk["Risk"]
        R1["False memory"]
        R2["Lost constraint"]
    end

    Hub --> How
    Hub --> Risk`,
      `class Hub hub
    class H1,H2,H3 grp1
    class R1,R2 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Rolling summary",
        caption: "Old block → summary. Recent turns stay verbatim.",
        chart: pastelChart(
          `flowchart LR
    Old["Turns 1-40"] --> Sum["Summary"]
    New["Turns 41-48"] --> Prompt["Prompt"]
    Sum --> Prompt`,
          `class Old,Sum grp1
    class New,Prompt grp2`
        ),
      },
    ],
    technicalExplanation:
      "Run a cheaper model to summarize the oldest block. Instruct it to keep ids, decisions, and open questions. Store the summary as a system or developer turn. Keep raw logs off the hot path.",
    example:
      "After 30 turns of a migration chat, the summary is: 'Moving billing to v2. Blocker: tax table. Owner: Priya. Do not drop EU VAT.'",
    commandsToRemember: [
      "Summarize every N turns",
      "Preserve ids and blockers",
      "Keep raw logs for audit",
      "A summary can lie",
    ],
    revisionNotes: {
      cheatSheet: [
        "Minutes, not a tape",
        "Rolling updates",
        "Ids must survive",
        "False memory is a bug",
      ],
    },
    glossary: ["Rolling Summary", "False Memory"],
    commonMistakes: [
      "Summarizing so vaguely that blockers vanish",
      "Using the same huge model for cheap summaries",
      "Throwing away the raw log",
    ],
    learnElsewhere: ["Memory Compression", "Conversation Memory"],
  }),

  "memory-retrieval": memoryLesson({
    concept: b(
      "Retrieval is fetching the few memories that help this turn",
      "Query with the user message plus a bit of session state",
      "Filter by user, time, and type before you rank",
      "Zero hits is valid — do not invent a memory"
    ),
    whyItExists:
      "A store with 10k facts is useless if you inject the wrong 20 — or all 10k.",
    analogy: "Asking the librarian for two books, not dumping the shelves on the desk.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Ask["Ask librarian"] --> Two["Two books"]
    Dump["Dump shelves"] --> Noise["Noise"]`,
      `class Ask,Two grp2
    class Dump,Noise grp1`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Retrieve])

    subgraph Query["Query"]
        Q1["User text"]
        Q2["User id"]
        Q3["Time window"]
    end

    subgraph Out["Out"]
        O1["Top-k"]
        O2["Or none"]
    end

    Hub --> Query
    Query --> Out`,
      `class Hub hub
    class Q1,Q2,Q3 grp1
    class O1,O2 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Retrieve then pack",
        caption: "Filter, retrieve, then pack. Skip if nothing matches.",
        chart: pastelChart(
          `flowchart LR
    Msg["User msg"] --> Filter["Filter store"]
    Filter --> Hit["Top-k"]
    Hit --> Pack["Pack prompt"]`,
          `class Msg,Filter grp1
    class Hit,Pack grp2`
        ),
      },
    ],
    technicalExplanation:
      "Build a query from the latest user text and metadata. Filter tenant and type. Retrieve a small k. If empty, proceed without fake memories. Log what you retrieved for debug.",
    example:
      "User: 'same as last refund.' Filter user=12, type=episode, last 90 days. Hit: refund #4412. Pack that recap only.",
    commandsToRemember: [
      "Query + filter + top-k",
      "Always scope by user",
      "Empty is allowed",
      "Log what you fetched",
    ],
    revisionNotes: {
      cheatSheet: [
        "Librarian, not a dump",
        "Filter then rank",
        "Small k",
        "Do not invent hits",
      ],
    },
    glossary: ["Top-k", "Metadata Filter"],
    commonMistakes: [
      "Global search across all users",
      "k=50 into a 4k window",
      "Hallucinating a memory when retrieval is empty",
    ],
    learnElsewhere: ["Memory Ranking", "RAG retrievers — Phase 3"],
  }),

  "memory-ranking": memoryLesson({
    concept: b(
      "Ranking decides which of the retrieved memories actually enter the prompt",
      "Score by relevance, recency, and importance",
      "A new fact should beat an old contradicting one",
      "Cap how many memories you pack — ranking is how you cap"
    ),
    whyItExists:
      "Retrieval returns candidates. Ranking picks the ones that should change this answer.",
    analogy: "Search results vs the three you actually open.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Hits["20 hits"] --> Rank["Rank"]
    Rank --> Three["Top 3 in prompt"]`,
      `class Hits grp1
    class Rank,Three grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Rank])

    subgraph Score["Score"]
        S1["Relevance"]
        S2["Recency"]
        S3["Importance"]
    end

    subgraph Rule["Rules"]
        R1["New beats old"]
        R2["Cap count"]
    end

    Hub --> Score
    Hub --> Rule`,
      `class Hub hub
    class S1,S2,S3 grp1
    class R1,R2 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Conflict",
        caption: "Two prefs disagree. Recency and source win — not embedding score alone.",
        chart: pastelChart(
          `flowchart LR
    Old["Old: Java"] --> Rank["Rank"]
    New["New: Python"] --> Rank
    Rank --> Keep["Keep Python"]`,
          `class Old grp1
    class New,Keep grp2
    class Rank hub`
        ),
      },
    ],
    technicalExplanation:
      "Combine similarity with recency and a manual importance flag. Deduplicate near-copies. Prefer newer facts when they conflict. Hard-cap the pack list.",
    example:
      "Retrieve 12 prefs. Rank drops duplicates, drops 2023 'likes Java', keeps 2026 'prefers Python' and 'no tabs'. Pack two memories.",
    commandsToRemember: [
      "Relevance + recency + importance",
      "New beats old",
      "Hard cap",
      "Dedupe near copies",
    ],
    revisionNotes: {
      cheatSheet: [
        "Candidates vs packed",
        "Three scores",
        "Conflicts: newer wins",
        "Cap is mandatory",
      ],
    },
    glossary: ["Recency", "Importance", "Dedup"],
    commonMistakes: [
      "Packing every retrieve hit",
      "Letting an old fact outrank a new one",
      "Ranking only on cosine and ignoring time",
    ],
    learnElsewhere: ["Memory Retrieval", "Context Management"],
  }),

  "context-management": memoryLesson({
    concept: b(
      "Context management is the packing plan for one model call",
      "Budget: system, memories, history, tools, user message",
      "If the budget breaks, drop in order — never the live user turn",
      "Treat the window as a product constraint, not an accident"
    ),
    whyItExists:
      "Working, STM, and LTM all compete for the same tokens. Someone has to allocate.",
    analogy: "A flight bag with weight limits — you choose what boards.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Bag["Token bag"] --> Sys["System"]
    Bag --> Mem["Memories"]
    Bag --> Hist["History"]
    Bag --> User["User now"]`,
      `class Bag hub
    class Sys,Mem,Hist,User grp1`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Context])

    subgraph Budget["Budget"]
        B1["System"]
        B2["Memories"]
        B3["History"]
        B4["User turn"]
    end

    subgraph Drop["If over"]
        D1["Shrink history"]
        D2["Fewer memories"]
        D3["Never drop user"]
    end

    Hub --> Budget
    Hub --> Drop`,
      `class Hub hub
    class B1,B2,B3,B4 grp1
    class D1,D2,D3 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Pack order",
        caption: "Reserve the user turn first. Fill the rest from the budget.",
        chart: pastelChart(
          `flowchart LR
    U["Reserve user"] --> S["System"]
    S --> M["Ranked memories"]
    M --> H["Trimmed history"]`,
          `class U grp2
    class S,M,H grp1`
        ),
      },
    ],
    technicalExplanation:
      "Assign token budgets per section. Pack user message and system prompt first. Fill memories from the ranked list. Trim history last. Fail closed if you still overflow.",
    example:
      "8k window: 800 system, 1200 memories, 5000 history, 1000 user. History over? Summarize, do not clip the user.",
    commandsToRemember: [
      "Budget per section",
      "User turn is sacred",
      "Trim history before memories that ranked high",
      "Overflow is a bug you can test",
    ],
    revisionNotes: {
      cheatSheet: [
        "Packing plan",
        "Section budgets",
        "Never drop the user",
        "Test overflow",
      ],
    },
    glossary: ["Token Budget", "Packing", "Overflow"],
    commonMistakes: [
      "Appending until the API 400s",
      "Dropping the current user message to fit a memory",
      "No per-section budget",
    ],
    learnElsewhere: ["Working Memory", "Memory Ranking"],
  }),

  "build-memory-from-scratch": memoryLesson({
    concept: b(
      "Build a tiny memory stack: extract, store, retrieve, pack",
      "Start with one user, one KV for prefs, one vector for notes",
      "Add a session summary before you add a graph",
      "Log every write and retrieve — memory bugs are silent"
    ),
    whyItExists:
      "Reading types of memory does not ship. A small loop teaches write/read/forget.",
    analogy: "A shoebox of index cards before you buy a warehouse.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Box["Shoebox"] --> Cards["Prefs + notes"]
    Wh["Warehouse"] --> Later["Later"]`,
      `class Box,Cards grp2
    class Wh,Later grp1`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Build])

    subgraph Loop["Loop"]
        L1["Extract"]
        L2["Store"]
        L3["Retrieve"]
        L4["Pack"]
    end

    subgraph Start["Start small"]
        S1["KV prefs"]
        S2["Vector notes"]
        S3["Session summary"]
    end

    Hub --> Loop
    Hub --> Start`,
      `class Hub hub
    class L1,L2,L3,L4 grp1
    class S1,S2,S3 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Minimum viable memory",
        caption: "One extract step, one store, retrieve on the next message, pack three facts max.",
        chart: pastelChart(
          `flowchart LR
    Msg["Message"] --> Ext["Extract pref"]
    Ext --> KV["KV put"]
    Next["Next msg"] --> Get["KV get"]
    Get --> Pack["Pack 3 max"]`,
          `class Msg,Ext,KV grp1
    class Next,Get,Pack grp2`
        ),
      },
    ],
    technicalExplanation:
      "Implement extract → put → get → pack on one user. Cap packed memories at three. Add a session summary next. Only then add types (semantic vs episodic). Log writes.",
    example:
      "Afternoon build: Redis `user:12:pref:lang=python`, retrieve on each turn, pack into the system prompt. Tomorrow add a vector of ticket recaps.",
    commandsToRemember: [
      "Extract → store → retrieve → pack",
      "Cap packed memories",
      "Log writes and hits",
      "Graph last, not first",
    ],
    revisionNotes: {
      cheatSheet: [
        "Shoebox first",
        "Four-step loop",
        "Cap at three",
        "Log silent memory",
      ],
    },
    glossary: ["Extract", "Pack", "MVP Memory"],
    commonMistakes: [
      "Starting with a knowledge graph",
      "No log of what was stored",
      "Retrieving everything you ever saved",
    ],
    learnElsewhere: ["This whole phase", "Persistent assistant project"],
  }),
};
