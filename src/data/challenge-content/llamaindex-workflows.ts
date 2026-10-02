import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "llamaindex-workflows",
  instructor:
    "I am a senior engineer who builds AI products. I still start this topic from zero every time I teach it, because the idea is simple and the failures are not.",
  promise:
    "You will go from never having heard of event workflows to being able to explain retrieval as a choice, write a small event path, refuse citations the path did not keep, and say when a loop on an index is the wrong shape.",

  story: {
    title: "The handbook bot that cited a page it never chose",
    body: [
      "An HR team put the employee handbook into a search index and stuck a loop on top because the example was three lines. The helper had a retrieve tool that returned the top forty chunks. The prompt said 'always cite sources'. Vacation-policy demos were perfect.",
      "A manager asked about parental leave stacking with short-term disability. The retrieve tool dumped forty overlapping chunks: leave, disability, payroll, and an outdated 2019 PDF someone had forgotten to delete. The loop thought for several steps and wrote a confident answer that stacked the two benefits in a way the 2024 policy forbids. The citation list included a heading from 2019. That heading had been in the dump. The model did not have to retrieve it on purpose. It only had to see it.",
      "Legal caught it because a real employee was granted the stacked leave in writing. The post-mortem was not 'search is dead'. It was that retrieval had been treated as a firehose and reasoning as a loop over the firehose.",
      "They rewrote it as a path of steps. A retrieve step kept eight nodes. A rerank step kept three and dropped 2019 by a metadata filter. A draft step could ask for one extra retrieve if a required heading was missing. A cite step refused any sentence not in the kept three. The loop on the index was deleted.",
    ],
    moral:
      "An index is not an agent, and a dump is not retrieval. If the model can see a page, it can cite it, so the workflow must choose what the model is allowed to see.",
  },

  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "A language model does not contain your employee handbook. If you want an answer from that handbook, you must find the relevant pages and show them to the model. Finding those pages is called retrieval. The usual method is: split documents into chunks, store them, and pick the chunks closest to the question.",
        "A few lines can give you an index and a 'query engine' that retrieves and answers. Easy hides the steps. When the answer is wrong you cannot say whether find, filter, or draft failed.",
        "A common extra is a loop: the model may call retrieve again if it is unsure. If retrieve returns forty chunks each time, the model is swimming in pages. It will cite what it can see. Outdated pages in the dump become outdated citations.",
        "The idea we need: retrieval is a step with a budget, not a dump. A step can enforce how many chunks, which filters, and which ones survive a second ranking. A dump can only hope.",
        "Pause and check. If retrieve returns a chunk, and you never drop it, the model is allowed to believe it. Dropping is a feature.",
        "At this point you should understand the handbook incident as a visibility incident. The 2019 PDF was not a clever jailbreak. It was in the room.",
      ],
      diagrams: [
        {
          title: "A dump versus a choice",
          caption: "Whatever reaches the model can be quoted. Choose on purpose.",
          chart: chart(
            `flowchart LR
    Q([Question]) --> Dump[Top 40 chunks]
    Dump --> Model[Model]
    Model --> Bad([Cites 2019])
    Q --> Keep[Keep 3 filtered chunks]
    Keep --> Model2[Model]
    Model2 --> Good([Cites 2024 only])`,
            `class Q,Bad,Good hub
    class Dump,Keep grp1
    class Model,Model2 grp2`
          ),
        },
      ],
    },
    {
      id: "events-and-steps",
      level: "beginner",
      title: "Events and steps, in plain English",
      body: [
        "An event workflow is a relay race. An event is a typed message: 'the question arrived', 'we retrieved eight nodes', 'we kept three', 'we are done'. A step is a function that waits for one kind of event, does work, and may send another.",
        "Each runner holds a baton with a label. The retrieve runner only starts when they get the start baton. They hand a 'retrieved' baton to the rank runner. Nobody improvises a fifth runner mid-race unless you wrote that runner.",
        "A start event is how a run begins. A stop event is how it ends. You add your own events in between, named after a fact that happened: Retrieved, Reranked, Drafted. Do not name events after personalities. Do not send a generic Message with a blob of prose.",
        "Context is the per-run bag a step can read and write, plus the right to send an event. The index — the search store — is a resource a retrieve step calls. It is not the object the user 'chats with'.",
        "When not to use a workflow: one retrieve of four chunks and one generate, no branches. That is a function. Write the function. Add a workflow when you have a second retrieve, a filter, a human, a timeout, or a refuse path you want to test without a model.",
      ],
      diagrams: [
        {
          title: "A relay of labelled batons",
          caption: "Each step starts only when its event arrives.",
          chart: chart(
            `flowchart LR
    StartE([Start event]) --> Ret[retrieve]
    Ret --> RetrE([Retrieved])
    RetrE --> Rank[rerank]
    Rank --> KeepE([Reranked])
    KeepE --> Draft[draft]`,
            `class StartE,RetrE,KeepE hub
    class Ret,Rank,Draft grp1`
          ),
        },
      ],
    },
    {
      id: "index-is-input",
      level: "beginner",
      title: "How the simplest version works: the index is an input",
      body: [
        "Hold the objects. Event: a typed payload. Step: an async handler for an event type. Context: per-run state. Workflow: the collection of steps plus a timeout. That is enough to draw any handbook path I would approve.",
        "Metadata on each chunk matters before any model runs. Region, year, document type. A filter that drops year < 2024 is a lock. Hoping the model 'prefers recent policy' is a sentence.",
        "Citation is a join between a sentence and a chunk id the workflow kept. If you cannot write a function that checks 'this quote is in one of the kept chunks', you cannot ship this to someone who will act on it.",
        "Do not put whole files on the baton. Put handles: ids and short texts. Fetch bytes only in the step that needs them. A baton that carries a PDF will be logged, replayed, and billed as a book.",
        "Pause and check. If you cannot name the event that means 'we kept three current chunks', you do not have a cite step yet. You have a hope.",
        "At this point you should understand the simplest version: retrieve with a small k and a filter, rerank to three, draft, then cite-or-refuse.",
      ],
    },
    {
      id: "first-workflow",
      level: "intermediate",
      title: "Build retrieve → keep → draft → cite — now the library has a name",
      body: [
        "What are we trying to do? Make 'the model only sees three current chunks' a property of the runtime. Here is the smallest version in spirit: four steps, four events.",
        "LlamaIndex started as 'put documents in a search index and ask a question'. It grew an event engine called Workflows. The old query engine still exists and is fine for a demo. The grown-up piece is the workflow. The index sits behind a retrieve step.",
        "Retrieve uses the question and a region from the start event. It asks the index for k=8 with a year filter. It sends a Retrieved event with ids, short texts, and scores — not whole files.",
        "Rerank keeps three. Draft writes an answer using only those three. Cite checks every factual sentence against the kept texts. If a sentence is not supported, send a stop event with a refuse reason, not a decorated maybe.",
        "Connect this back to the story. The 2019 heading never reaches draft, so it cannot reach cite. The model cannot quote a page that is not in the room.",
      ],
      codes: [
        {
          title: "Smallest retrieve step. k is a number, not a vibe.",
          language: "python",
          code: `from llama_index.core.workflow import Event, StartEvent, step

class Retrieved(Event):
    texts: list[str]
    ids: list[str]

class Handbook(Workflow):
    @step
    async def retrieve(self, ev: StartEvent) -> Retrieved:
        nodes = index.retrieve(ev.question, k=8, filters={"year": 2024})
        return Retrieved(
            ids=[n.id_ for n in nodes],
            texts=[n.text[:500] for n in nodes],
        )`,
        },
      ],
      diagrams: [
        {
          title: "The index sits behind a step",
          caption: "The model never sees the store. It sees what retrieve and rerank kept.",
          chart: chart(
            `flowchart TD
    Q([Question plus region]) --> Ret[retrieve]
    Ret --> Idx[(Index)]
    Idx --> Nodes[8 nodes]
    Nodes --> Rank[rerank]
    Rank --> Keep[3 nodes]
    Keep --> Draft[draft]
    Draft --> Cite{Spans in keep?}
    Cite -->|no| Refuse([Refuse])
    Cite -->|yes| Ans([Answer plus cites])`,
            `class Q,Ans,Refuse hub
    class Ret,Rank,Draft,Keep grp1
    class Cite grp2
    class Idx,Nodes grp3`
          ),
        },
      ],
    },
    {
      id: "send-and-collect",
      level: "intermediate",
      title: "When one step must wait for several events",
      body: [
        "Sometimes retrieve fans out: one step per source. Then a gather step must wait until all 'Retrieved' events arrive. The engine lets a step send events and collect them. That is not a chat. It is a countdown.",
        "Name the gather. If you collect 'any message', you will mix a retrieve from handbook with a retrieve from payroll and call it done. Collect a specific event type, with a count you set.",
        "NeedMore is a fair second retrieve: the draft step notices a required heading is missing and sends one more retrieve request. Cap it at one. An uncapped NeedMore is a ReAct loop wearing event clothes, and you will pay to re-read the same nodes.",
        "StopEvent is your return value. Put the answer and the cite list on it. Early halt — no nodes, policy deny — is also a StopEvent with a reason. Exceptions are for broken code. Halt is a product outcome.",
        "At this point you should understand send and collect as wiring, not as intelligence. The intelligence, if any, lives inside draft. The wiring decides what draft is allowed to read.",
      ],
      codes: [
        {
          title: "Cite refuses a span the workflow did not keep.",
          language: "python",
          code: `def supported(sentence: str, kept: list[str]) -> bool:
    return any(sentence.lower() in chunk.lower() or chunk.lower() in sentence.lower()
               for chunk in kept)

def cite_or_refuse(draft: str, kept: list[str]) -> dict:
    sentences = [s.strip() for s in draft.split(".") if s.strip()]
    if not all(supported(s, kept) for s in sentences):
        return {"status": "refuse", "reason": "unsupported_span"}
    return {"status": "ok", "answer": draft, "sources": kept}`,
        },
      ],
    },
    {
      id: "versus-react-index",
      level: "intermediate",
      title: "How the pieces connect, versus a loop on an index",
      body: [
        "In a real app the route sends a start event with the question and the employee's region. The workflow times out as a whole. Each I/O inside a step has its own timeout. A hung embedder should not hold the load balancer until it drops the request.",
        "A ReAct loop on a raw index is tempting because it is one object. One object hides the steps. The model will call retrieve again when unsure. You will pay to re-read forty nodes. You will cite a neighbour.",
        "Use the loop only when the question truly needs tools beyond retrieval — 'open a ticket', 'look up the employee's own leave balance in HRIS'. Even then, retrieval can remain a workflow box that returns three chunks, and the loop is not allowed to dump the index.",
        "Why an engineer should care: legal will not accept 'the model usually cites the latest policy'. They will accept 'the year filter is in the retrieve step and cite refuses foreign spans'. Those are tests you can run without a model.",
        "Connect this back to workflows versus agents. A handbook Q&A is a known path. The open loop was autonomy tax plus a visibility leak.",
      ],
      codes: [
        {
          title: "The route starts a workflow, not a chat with the index.",
          language: "python",
          code: `async def ask(question: str, region: str) -> dict:
    wf = Handbook(timeout=20)
    ev = await wf.run(question=question, region=region)
    return ev.model_dump()`,
        },
      ],
    },
    {
      id: "replay-and-timeouts",
      level: "advanced",
      title: "What breaks when the simple race is long",
      body: [
        "Remember the simple four steps in memory. They break when a worker restarts mid-run, when you checkpoint events, or when a step has a side effect such as logging the question to an analytics table.",
        "If you checkpoint, events become a schema product. Adding a required field next quarter will break resumed runs. Version the event. Put handles, not bytes, on the event so a replay is cheap.",
        "Keep steps idempotent if replay is possible. retrieve(question, region) with a cache key should return the same node ids. If you write an audit row, key it by run id so a restart does not double-log private questions.",
        "Timeouts belong on the workflow and on the I/O. Fail retrieve, send StopEvent(reason='retrieve_timeout'), tell the user the handbook is temporarily unsearchable. A loop in the same situation will try another tool and maybe another dump.",
        "The advanced refuse is still the same idea as cite-or-refuse. You are not being unhelpful. You are refusing to invent a policy the kept chunks do not support.",
      ],
      diagrams: [
        {
          title: "Restart must not double-log a private question",
          caption: "Run id on the audit write. Handles on the event. Timeout on retrieve.",
          chart: chart(
            `flowchart TD
    Start([Start event]) --> Ret[retrieve]
    Ret --> Time{Timeout?}
    Time -->|yes| StopT([Stop: timeout])
    Time -->|no| Rank[rerank]
    Rank --> Draft[draft]
    Draft --> Cite[cite]
    Cite --> StopA([Stop: answer or refuse])
    Ret --> Audit[(Audit keyed by run)]`,
            `class Start,StopT,StopA hub
    class Ret,Rank,Draft,Cite grp1
    class Time grp2
    class Audit grp3`
          ),
        },
      ],
    },
    {
      id: "production-rag",
      level: "advanced",
      title: "Production handbook, and a clean no to the firehose",
      body: [
        "Filters live in the index and in the retrieve step. Deleting the 2019 PDF is still required. A filter is a seatbelt, not a reason to keep stale files forever.",
        "Measure retrieve on a labelled set: questions with the document ids that should come back. Change one thing at a time — k, filter, rerank — so you know what helped. Do not add an agent because recall is low until you have tried a heading-path chunker and a year filter.",
        "When not to use a workflow: the path is one function and you have no pause. When not to use ReAct on an index: the path is retrieve-rerank-draft-cite. That is this sitting.",
        "LlamaIndex still has query engines. They are fine behind a step. They are not fine as the whole product when citations must be honest.",
        "You should now be able to teach this: the model only sees what the steps kept; a citation is a join; a dump is how 2019 gets into 2024 answers.",
      ],
      codes: [
        {
          title: "A filter is a lock. A prompt is a sentence.",
          language: "python",
          code: `def retrieve(question: str, region: str):
    return index.retrieve(
        question,
        k=8,
        filters={"year": 2024, "region": region},
    )`,
        },
      ],
      diagrams: [
        {
          title: "Loop on an index versus arrows",
          caption: "The firehose lives on the left. The choice lives on the right.",
          chart: chart(
            `flowchart LR
    Loop[ReAct on index] --> Dump[k equals 40]
    Dump --> CiteAny([Any page cited])
    Arrows[Workflow] --> Three[k equals 3 kept]
    Three --> CiteKept([Only kept pages])`,
            `class CiteAny,CiteKept hub
    class Loop,Arrows grp1
    class Dump,Three grp3`
          ),
        },
      ],
    },
  ],

  workedExample: {
    title: "Replace the handbook firehose with four steps",
    setup:
      "Vector index plus a ReAct query engine. retrieve returns 40 nodes. Citations include a 2019 PDF. Legal is involved.",
    walkthrough: [
      "Step 1 — Understand the problem. Visibility is uncontrolled. The loop can see stale pages and therefore quote them.",
      "Step 2 — Identify the relevant concept. Retrieval is a step with k, a filter, and a rerank. Cite is a join.",
      "Step 3 — Build the simplest solution. Workflow: retrieve 8 with year=2024 → rerank 3 → draft → cite-or-refuse.",
      "Step 4 — Improve it. Carry region on the start event. Drop bytes from events. One optional NeedMore, capped.",
      "Step 5 — Handle a failure. Empty retrieve. StopEvent refuse, 'no current policy found', no invented stacking rule.",
      "Step 6 — Production version. Timeout the workflow. Audit questions by run id. Labelled recall set. Delete the 2019 file for real.",
    ],
    result:
      "The model cannot cite a page the workflow did not keep. Stacking answers either match 2024 chunks or refuse. The ReAct engine is gone.",
  },

  practice: {
    title: "Design events for a benefits question",
    task:
      "Employees ask about benefits. Sources: current handbook, an HRIS leave-balance API, and a stale wiki you do not trust. Think about events, which source the model may see, and when you refuse. Sketch the steps.",
    hint:
      "The wiki is a dump waiting to happen. The HRIS is a tool with a person id from the session, not from the model. Expected reasoning: no wiki step, session id, cite-or-refuse.",
    solution:
      "Start event carries question plus employee id from the session. retrieve_handbook with year filter. lookup_balance as its own step using the session id. No wiki step. Draft sees three handbook chunks plus a small balance object. Cite checks handbook sentences; numbers must match the balance object. Refuse if handbook retrieve is empty. Why this works: stale wiki never enters the room, and the person id is not a model argument. Common wrong approach: one ReAct agent with retrieve(k=40) including the wiki.",
  },

  takeaways: [
    "Retrieval is choosing what the model may see. A dump is not retrieval.",
    "A LlamaIndex Workflow is events plus steps. The index is a resource a retrieve step calls, not a chatbot.",
    "Name events after facts. Put handles on events, not whole files.",
    "Cite is a join to kept chunks. If you cannot check it with a function, you cannot ship the citation.",
    "A ReAct loop on a raw index re-reads a firehose and cites neighbours. Prefer arrows when the path is retrieve-rerank-draft-cite.",
    "Timeouts, idempotent steps, and filters are how this survives restarts and stale PDFs.",
  ],

  mistakes: [
    "Mistake: retrieve(k=40) so the model can 'be thorough'. Why people make it: fear of missing a clause. What actually happens: stale pages get cited. Better approach: small k, filter, rerank, optional one more retrieve.",
    "Mistake: chatting with the query engine as the product. Why people make it: three lines. What actually happens: you cannot tell which step failed. Better approach: steps you can test.",
    "Mistake: putting Document bytes on every event. Why people make it: convenience. What actually happens: huge shuttles and accidental logs. Better approach: ids and short texts.",
    "Mistake: uncapped NeedMore. Why people make it: it feels careful. What actually happens: a hidden ReAct loop. Better approach: one extra retrieve, then refuse.",
    "Mistake: citations as a list of links at the bottom. Why people make it: the UI looks official. What actually happens: a sentence joins the wrong URL. Better approach: claim-to-chunk join.",
    "Mistake: leaving the 2019 PDF in the index because a filter exists. Why people make it: filters feel enough. What actually happens: the next missing filter cites it. Better approach: delete stale files and filter.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "Why not let a ReAct agent call retrieve on an index until it feels done?",
      answer:
        "What they are testing: dump versus step. Good answer: each call can pour dozens of chunks into context; the model cites what it sees, including stale neighbours; you pay to re-read. A retrieve step with k and a filter is cheaper and safer. Why that is good: it is the handbook story. Follow-up: what is a citation, precisely?",
    },
    {
      difficulty: "medium",
      question: "Walk through the events in a retrieve-rerank-draft-cite workflow.",
      answer:
        "What they are testing: event naming and refuse. Good answer: StartEvent → Retrieved → Reranked → Drafted → StopEvent, or StopEvent refuse if spans are unsupported or retrieve is empty. Events carry ids and short texts. Why that is good: it is a drawable runtime. Follow-up: when would you send a second retrieve?",
    },
    {
      difficulty: "hard",
      question: "How do you make this workflow safe to checkpoint and replay?",
      answer:
        "What they are testing: durability. Good answer: version events, store handles not bytes, idempotent retrieve with a cache key, audit writes keyed by run id, timeouts on I/O and on the workflow, refuse as StopEvent not an unhandled exception. Why that is good: it treats events as a schema product. Follow-up: when is a workflow overkill versus a function?",
    },
  ],

  glossary: [
    {
      term: "Retrieval",
      meaning:
        "Choosing a few relevant chunks to show the model. Why it matters: whatever you show, the model can quote.",
    },
    {
      term: "Chunk",
      meaning:
        "A slice of a document stored for search. Why it matters: it is the unit you retrieve, cite, and filter.",
    },
    {
      term: "Event",
      meaning:
        "A typed message a workflow step sends or receives. Why it matters: wiring is explicit, not a chat blob.",
    },
    {
      term: "Step",
      meaning:
        "A function that handles one event type and may send another. Why it matters: you can test retrieve without drafting.",
    },
    {
      term: "Rerank",
      meaning:
        "A second pass that keeps the best few of the retrieved chunks. Why it matters: it is how forty becomes three.",
    },
    {
      term: "Cite-or-refuse",
      meaning:
        "Answer with pointers to kept chunks, or say you cannot support the claim. Why it matters: it is the honest contract for policy text.",
    },
  ],
};
