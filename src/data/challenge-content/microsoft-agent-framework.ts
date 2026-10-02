import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "microsoft-agent-framework",
  instructor:
    "I am a senior engineer who builds AI products. I still start this topic from zero every time I teach it, because the idea is simple and the failures are not.",
  promise:
    "You will go from never having heard of this stack to being able to name four objects, resume a chat safely, put a check in the hallway, and say when a workflow belongs here instead of a conversation.",

  story: {
    title: "The approval that approved itself twice",
    body: [
      "A treasury team rewrote a wire-transfer helper as a chat that could pause for a human. A conversation per request. A pause for someone to approve. Logging into the company's existing monitors. The demo on one server was clean.",
      "The first production night, an operations lead approved four transfers. Three went out. The fourth came back as a new draft with a new conversation id. She approved that too, because the queue said pending. Two submissions: the original draft, which had been sitting in memory on a server that later restarted, and the new draft.",
      "A second finding sat underneath. The pause-for-approval step was being treated as the security check. A repair job could resume a paused run using a service identity that was allowed to talk to the helper, but not allowed to approve wires in the real identity system. The workflow asked only 'has someone resumed?' It did not ask 'is this person allowed to approve this amount?'",
      "The fix was design, not a smarter model. The conversation id became a function of the wire-request id, so every server resumes the same talk. State moved to a store that survives a restart. The submit step re-checked the caller's role, because a bookmark is not a gate.",
    ],
    moral:
      "Supported machinery — threads, hallways, pauses — will happily resume the wrong person on the wrong server. A pause is not permission.",
  },

  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "A chat helper that lives only in one web request has amnesia. The user clicks again. A different server answers. The old conversation is gone. If money was waiting for an approval, you now have two drafts of the same transfer.",
        "That is not an AI problem. That is a 'where does the conversation live?' problem. Ordinary web apps already know this: a shopping cart has an id, and every server looks up the same cart. An AI chat that can pause, resume, and call tools needs the same kind of folder.",
        "A second problem sits next to it. Before a model runs, and before a tool runs, you want checks: is this the right customer? Is there budget left? Should we redact account numbers from the log? If those checks live in the prompt, they are suggestions. If they live in each tool, you will forget one tool.",
        "The idea we need is a control panel: a helper that can chat, a folder that remembers the talk, a recipe when the path is known, and a hallway around every call for the checks. We will name those objects slowly. We will not start with a brand.",
        "Pause and check. If two retries run at once, do they open the same folder? If the answer is no, you have already designed the duplicate-wire incident.",
        "At this point you should understand the fear: a conversation treated as a disposable web request will invent a second approval the first night you have two servers.",
      ],
      diagrams: [
        {
          title: "A new folder per click",
          caption: "Retries and extra servers must resume the same talk, not invent one.",
          chart: chart(
            `flowchart TD
    Click([User clicks approve]) --> New[New conversation id]
    New --> Draft2[Second draft]
    Same([Same wire request]) --> Folder[One saved conversation]
    Folder --> One([One approval])`,
            `class Click,Same,One hub
    class New,Draft2 grp1
    class Folder grp3`
          ),
        },
      ],
    },
    {
      id: "four-objects",
      level: "beginner",
      title: "Four objects, named slowly",
      body: [
        "An agent is a model plus instructions plus tools. You already know those words. It answers, and it may call a function.",
        "A thread is the saved conversation those messages belong to. Not the HTTP request. Not 'whatever is in memory on this server'. A named log you can load again tomorrow. If you make a new thread every time someone clicks, the helper has amnesia. If you make a new thread on every retry, you get two approvals.",
        "A workflow is the recipe shape from the workflows-versus-agents sitting: boxes and arrows you wrote. Use it when the path is known. A wire transfer with 'draft → approve → submit' is a workflow, even if a model drafts the memo.",
        "Middleware is a hallway around a call. Before the model runs, after the model runs, before a tool runs — your code can log, redact, check identity, or stop. This is where production checks belong. They do not belong in the prompt.",
        "If you can point at those four, the rest of any SDK is spelling. Cloud adjectives attach to them. They do not replace them.",
      ],
      codes: [
        {
          title: "Four objects as ordinary data.",
          language: "python",
          code: `agent = {"model": "hosted-gpt", "instructions": "Draft only", "tools": ["lookup"]}
thread = {"id": "thr_from_wire_883", "messages": []}
workflow = ["draft", "approve", "submit"]
middleware = ["check_tenant", "check_budget", "redact"]`,
        },
      ],
    },
    {
      id: "thread-is-a-thing",
      level: "beginner",
      title: "How the simplest version works: a thread is a folder",
      body: [
        "Imagine a paper folder on a desk. The folder is labeled with the wire-request number. Every note, every approval, every retry goes in that folder. If the office moves to another building overnight, the folder is still there in the cabinet.",
        "That folder is the thread. The label must come from the business thing you already have: ticket id, wire-request id, user-plus-session id. Do not generate a random label per click. Random labels are how the operations lead approved the same transfer twice.",
        "Threads are how you survive more than one server. Cloud apps run on several machines. Memory on machine three dies when that machine is replaced. A durable store — a database you already know how to back up — is the cabinet. Tutorials use memory. Production cannot.",
        "Do not stuff huge files into the folder. Put identifiers and short extracts in the thread. Put the PDF in object storage. Every hallway that logs the thread will otherwise log a book, and you will spend a week scrubbing it.",
        "At this point you should understand the simplest version: one agent, one thread key derived from the business id, and a store that survives a restart.",
      ],
      diagrams: [
        {
          title: "Same business id, same thread",
          caption: "Retries and extra servers must resume the folder, not invent one.",
          chart: chart(
            `flowchart TD
    Wire([Wire request 883]) --> Key[Thread id from 883]
    Key --> Store[(Durable thread store)]
    SrvA[Server A] --> Store
    SrvB[Server B] --> Store
    Retry[Retry job] --> Store`,
            `class Wire hub
    class Key,SrvA,SrvB,Retry grp1
    class Store grp3`
          ),
        },
      ],
    },
    {
      id: "first-agent",
      level: "intermediate",
      title: "The smallest chat agent — now the library has a name",
      body: [
        "What are we trying to do? One agent, one thread key, one tool, no meeting. The framework will wrap a model call. You wrap the identity of the conversation.",
        "Microsoft Agent Framework is the control panel that ships these four objects together. It is the successor of two older Microsoft libraries: Semantic Kernel, which was about plugins and plans, and AutoGen, which was about rooms. Successor means 'this is where new work should go', not 'rename your old files'.",
        "Here is the smallest version in spirit. You create an agent with instructions and a tool. You open a thread with an id you computed. You run the agent against that thread. A second run with the same id continues the same log.",
        "Let's understand what happened. The model never saw the wire-request id as a suggestion it could replace. Your code derived the thread id. The tool, when it submits, will look up that same id. The chat is a transport. The request record is the product.",
        "When not to start here: your app is already a LangGraph or Mastra shop, and nobody is asking you to land on Azure. Switching for a brochure adds retraining. When to start here: your logins are already Microsoft identity, your models are already Azure-hosted, and the person on call lives in Azure Monitor.",
      ],
      codes: [
        {
          title: "Thread id from the business, not from the request clock.",
          language: "python",
          code: `import hashlib

def thread_id(tenant_id: str, wire_id: str) -> str:
    raw = f"{tenant_id}:wire:{wire_id}"
    return "thr_" + hashlib.sha256(raw.encode()).hexdigest()[:24]

# later
# agent = ChatAgent(name="treasury", instructions="Draft only. Do not submit.")
# thread = store.get_or_create(thread_id(tenant, wire_id))
# result = await agent.run(user_text, thread=thread)`,
        },
      ],
    },
    {
      id: "hallway",
      level: "intermediate",
      title: "Middleware: the hallway around every call",
      body: [
        "Once you have an agent, you will want logging, redaction, budgets, and permission checks. If you put those in the prompt, they are suggestions. If you put them in each tool, you will forget one tool. Middleware is the hallway every call walks through.",
        "A typical hallway: receive the caller identity from the web session, refuse if the tenant does not match the thread, log a redacted prompt, enforce a token budget, then let the model or tool run. On the way out, log cost and outcome.",
        "This is the production version of 'do not trust the model with tenant_id'. The hallway already knows the caller. Tools read that context. They do not accept a tenant argument from the model.",
        "Keep the hallway mechanical. Do not ask a second model 'was this a good idea?' on every turn. That doubles cost and still guesses. Identity, budget, and redaction are if-statements. Quality judgement belongs after the run, or in an eval suite.",
        "Connect this back to the story. The repair job walked around the human UI and resumed a pause. If submit had lived behind hallway code that re-read the caller's role, the service identity would have been denied even though the bookmark was open.",
      ],
      codes: [
        {
          title: "Smallest hallway: bind caller to thread, then run.",
          language: "python",
          code: `def before_run(ctx):
    if ctx.thread.tenant_id != ctx.caller.tenant_id:
        raise PermissionError("wrong tenant")
    if ctx.caller.role not in ctx.thread.allowed_roles:
        raise PermissionError("wrong role")
    ctx.budget.check()
    log.redacted(ctx.thread.id, ctx.caller.id)`,
        },
      ],
      diagrams: [
        {
          title: "Every call walks the hallway",
          caption: "Identity and budget are doors. The model sits after them.",
          chart: chart(
            `flowchart TD
    Caller([Caller]) --> Mid[Middleware]
    Mid --> Ident{Tenant and role ok?}
    Ident -->|no| Deny([Deny])
    Ident -->|yes| Bud{Budget left?}
    Bud -->|no| Deny
    Bud -->|yes| Agent[Agent or workflow]
    Agent --> Tool[Tools]
    Agent --> Thread[Thread store]`,
            `class Caller,Deny hub
    class Mid,Agent,Tool grp1
    class Ident,Bud grp2
    class Thread grp3`
          ),
        },
      ],
    },
    {
      id: "workflow-door",
      level: "intermediate",
      title: "How the pieces connect: chat is the wrong shape for money",
      body: [
        "A chat agent is a loop. A wire with draft → approve → submit is a known path. Put it in a workflow so approve cannot be skipped by a confident draft. This is the same lesson as onboarding, in Microsoft clothes.",
        "A pause, often called an interrupt, is a bookmark. The run stops, stores the thread, and waits. A person (or a job) later resumes. Resume means 'continue from the bookmark'. It does not mean 'the person was allowed'. Check permission again on the submit box.",
        "Why check twice? Because the person who drafted may not be the person who approves. Because a retry job may resume with a robot identity. Because time passed and the amount may now exceed the caller's limit. A bookmark has no memory of your HR policy.",
        "How the pieces sit in an app: the route finds or creates the thread by wire id, the workflow runs, middleware stamps identity, the approve box pauses, the UI posts a resume, submit re-reads role and amount, the bank API is called once with an idempotency key.",
        "At this point you should be able to tell a VP: we use a chat agent for questions; we use a workflow for money; we use middleware for identity; we use a thread so a restart does not invent a second approval.",
      ],
      codes: [
        {
          title: "Resume is not permission. Check again.",
          language: "python",
          code: `def submit(thread, caller, amount):
    if caller.role != "treasury-approver":
        return "deny"
    if amount > caller.limit:
        return "deny"
    return bank.send(thread.wire_id, amount, key=thread.id)`,
        },
      ],
      diagrams: [
        {
          title: "Chat for questions. Workflow for money.",
          caption: "The framework has both doors. Pick with the path, not the brand.",
          chart: chart(
            `flowchart TD
    Job([Incoming job]) --> Kind{Path known?}
    Kind -->|yes| Wf[Workflow]
    Kind -->|no| Chat[Chat agent]
    Wf --> Thr[Same thread id]
    Chat --> Thr`,
            `class Job hub
    class Wf,Chat grp1
    class Kind grp2
    class Thr grp3`
          ),
        },
      ],
    },
    {
      id: "durable-identity",
      level: "advanced",
      title: "What breaks when the simple server becomes a fleet",
      body: [
        "The simple version is one process and an in-memory thread. That version breaks the first night you have two replicas or a restart. The advanced technique is not a new idea. It is taking the folder metaphor seriously: durable store, deterministic id, one writer for submit.",
        "Identity is a second fleet problem. Entra — Microsoft's login system — already knows the person. Your submit box must ask that system, or ask a service that wraps it. 'The interrupt was resumed' is a transport fact. 'This principal may approve $4m' is an authorization fact. They look similar in a sequence diagram. They are not.",
        "Migration from Semantic Kernel plugins is usually 'these functions become tools'. Migration from AutoGen rooms is usually 'this meeting should become a workflow'. Do not port speaker-auto into the new stack. You will only add supported telemetry to the old outage.",
        "Trade-off versus LangGraph: both can graph, pause, and store state. LangGraph is a low-level graph runtime with a large Python ecosystem. This framework is built to be the agent control panel for Azure-shaped organisations. Pick with your operators and your identity system, not with a social post.",
        "When the simple hallway is not enough: you need per-tool authorization, not only per-run. A reader role may draft. Only treasury-approver may submit. Register tools per role, or check inside the hallway with the tool name in hand.",
      ],
    },
    {
      id: "production-azure",
      level: "advanced",
      title: "Production on Azure, and a clean no",
      body: [
        "Pin the model name. Send traces to the monitor you already page on. Treat cost as a budget in middleware, not a dashboard surprise. Encrypt thread contents if they hold counterparty data. Do not log raw prompts that contain account numbers.",
        "Human pauses should expire. A bookmark that lives forever will be resumed by the wrong person in a hurry. Expiry plus a re-check of role and amount is the pair.",
        "Say no when the path is a five-step recipe and someone wants five agents 'because we have the framework'. The framework includes workflows for that reason. Say no when you have no Azure constraint and a healthy graph runtime already. Retraining is a real cost.",
        "Say yes when the company will not let models live anywhere else, and the 2am owner already thinks in subscriptions, Foundry projects, and Entra groups. Then this grain is a gift.",
        "You should now be able to teach the four objects, derive a thread id, put a check in the hallway, and refuse to treat resume as approval.",
      ],
      diagrams: [
        {
          title: "Pause is a bookmark, submit is a gate",
          caption: "The repair job can open the bookmark. Only the identity check can open the bank.",
          chart: chart(
            `flowchart TD
    Draft[Draft box] --> Pause[Bookmark]
    Pause --> Resume[Resume from UI or job]
    Resume --> Gate{Role and amount ok?}
    Gate -->|no| Hold([Stay paused or deny])
    Gate -->|yes| Submit[Submit once]
    Submit --> Bank([Bank API])`,
            `class Hold,Bank hub
    class Draft,Pause,Resume,Submit grp1
    class Gate grp2`
          ),
        },
      ],
    },
  ],

  workedExample: {
    title: "Give the wire helper one folder and one gate",
    setup:
      "Chat agent, new thread per HTTP request, in-memory store, pause treated as approval. Two submits after a server recycle. A repair job can resume.",
    walkthrough: [
      "Step 1 — Understand the problem. The conversation is not tied to the wire. Restart invents a second folder. Resume is not a role check.",
      "Step 2 — Identify the relevant concept. Thread as a business object, middleware as a hallway, workflow arrows for draft → approve → submit.",
      "Step 3 — Build the simplest solution. thread_id(tenant, wire_id). One workflow. Submit calls the bank with that id as the idempotency key.",
      "Step 4 — Improve it. Move the thread to a durable store. Put tenant and role checks in middleware. Re-check on submit.",
      "Step 5 — Handle a failure. If the repair job resumes, middleware sees a service principal and denies submit. The bookmark stays a bookmark.",
      "Step 6 — Production version. Expire pauses. Redact account numbers in logs. Alert if two submit attempts share a wire id.",
    ],
    result:
      "Every replica opens the same folder. A recycle does not mint a new approval. A robot identity cannot complete a human gate. The bank sees one key.",
  },

  practice: {
    title: "Place the four objects on an expense-report helper",
    task:
      "Employees chat to file an expense. Policy must run before payout. A manager approves amounts over $200. Think about which object is the chat, which is the recipe, what the thread id is, and where the manager check lives. Sketch the run.",
    hint:
      "The thread key should survive the employee closing the tab. The manager check should survive a resume from a batch job. Expected reasoning: agent extracts, workflow pays, thread from expense id, gate on resume.",
    solution:
      "Agent: the chat that extracts line items. Workflow: validate policy → maybe pause for manager → payout. Thread id: tenant + expense-report id. Middleware: bind employee tenant, budget, redaction. Manager gate re-checks role and amount on resume, not only 'paused flag is clear'. Why this works: the recipe cannot skip policy, and the folder cannot duplicate. Common wrong approach: one ChatAgent with an approve tool and a new thread per message.",
  },

  takeaways: [
    "Microsoft Agent Framework is a successor control panel, not AutoGen with a new logo. Learn agents, threads, workflows, and middleware.",
    "A thread is a folder for a business object. Its id must come from that object, and it must live outside process memory.",
    "Middleware is the hallway for identity, budget, and redaction. Those checks are if-statements, not prompt sentences.",
    "A pause is a bookmark. Authorization is a separate question you ask again when money moves.",
    "Use a workflow when the path is known. Do not migrate an old meeting into a supported meeting.",
    "Pick this stack when your operators and identity already live on Azure. Otherwise the brochure is a retraining bill.",
  ],

  mistakes: [
    "Mistake: new thread per HTTP request. Why people make it: it matches request scope. What actually happens: amnesia and duplicate approvals. Better approach: id from the business record.",
    "Mistake: in-memory threads in production. Why people make it: the sample does it. What actually happens: a recycle invents a second draft. Better approach: a durable store.",
    "Mistake: treating interrupt resume as approval. Why people make it: the diagram looks like a gate. What actually happens: a repair job submits. Better approach: re-check role and amount.",
    "Mistake: porting a five-seat room unchanged. Why people make it: migration pressure. What actually happens: the old meeting with new telemetry. Better approach: a workflow, or fewer agents for real isolation.",
    "Mistake: putting tenant_id in the prompt. Why people make it: it is visible. What actually happens: the model continues the wrong folder. Better approach: middleware binds the caller.",
    "Mistake: switching from a healthy LangGraph shop 'because Microsoft'. Why people make it: enterprise branding. What actually happens: a year of retraining. Better approach: follow operators and identity, not the brochure.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "Name the four objects in Microsoft Agent Framework and what each is for.",
      answer:
        "What they are testing: the mental model without Azure trivia. Good answer: agent = model + instructions + tools; thread = durable conversation for a business id; workflow = arrows you wrote; middleware = hallway for checks and logs. Why that is good: it is teachable in one breath. Follow-up: which object would you use for a three-step payout?",
    },
    {
      difficulty: "medium",
      question: "A human-approval pause was resumed twice after a deploy. How do you design the thread?",
      answer:
        "What they are testing: deterministic ids and durable state. Good answer: thread id is a hash of tenant plus entity id; store is durable; retries resume the same id; submit is idempotent on that id. Why that is good: it attacks the duplicate, not the model. Follow-up: where do you put the role check?",
    },
    {
      difficulty: "hard",
      question: "When would you choose this framework over LangGraph, and when is that the wrong trade?",
      answer:
        "What they are testing: operators, not features. Good answer: choose it when Entra, Azure OpenAI, and Azure Monitor are already the grain of the company. Choose LangGraph when you already have a graph runtime and no Azure constraint. A pause in either stack is still not authorization. Why that is good: it refuses a feature checklist war. Follow-up: how would you migrate an AutoGen room without copying the outage?",
    },
  ],

  glossary: [
    {
      term: "Agent",
      meaning:
        "A model plus instructions plus tools. Why it matters: this is the chat-shaped entry point, not the whole product.",
    },
    {
      term: "Thread",
      meaning:
        "The saved conversation for one business object. Why it matters: retries and extra servers must open the same folder.",
    },
    {
      term: "Middleware",
      meaning:
        "Code that runs around model and tool calls. Why it matters: identity and budgets belong here, not in the prompt.",
    },
    {
      term: "Workflow",
      meaning:
        "A path of boxes and arrows you wrote. Why it matters: required steps such as approve cannot be skipped.",
    },
    {
      term: "Interrupt",
      meaning:
        "A bookmark that pauses a run until something resumes it. Why it matters: resume is not permission.",
    },
    {
      term: "Entra",
      meaning:
        "Microsoft's identity system for people and services. Why it matters: submit must ask it, or a wrapper, who the caller is.",
    },
  ],
};
