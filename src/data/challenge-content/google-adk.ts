import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "google-adk",
  instructor:
    "I am a senior engineer sitting next to you. We start from zero. If you have never used Gemini or Google Cloud, that is fine. We will first understand three everyday ideas — a helper, a tool, and a saved conversation — and only then see how Google's Agent Development Kit names them.",
  promise:
    "You will be able to explain what ADK is for, write a small Gemini helper with one tool, save a conversation in a session, tell a sequence from a loop, put a policy check in a callback, and know where the tool actually runs.",
  story: {
    title: "The policy bot that quoted last year's handbook",
    body: [
      "An HR team built a helper for visa questions. People asked things like 'can I work from Berlin for a month?'. The helper was supposed to read the current employee handbook and answer with a citation. The team used Google's Agent Development Kit because they were already on Gemini. The first demo, run on one laptop, was perfect.",
      "Two weeks later a new hire in Berlin got an answer with a tidy quote from the handbook — the 2024 handbook. The 2025 policy had changed. The helper had not gone to the open web. It had used a search tool pointed at a folder that nobody had re-indexed after the January update. The conversation also hopped between two Cloud Run instances, and the second instance had no memory of the first turn, so the helper asked for the same employee id again and then answered from the stale folder anyway.",
      "A 'critic' helper was supposed to catch this. It sat in a loop and was told to reject answers that lacked a current citation. It never approved anything, because last year's quotes were all it ever saw, and the loop had no maximum. The request sat there until the load balancer timed out. The employee refreshed. A new conversation started. Same stale folder.",
      "The fix was not a smarter Gemini model. They pinned the search tool to a dated corpus and refused to answer if the document date was older than the policy's effective date. They stored the conversation outside the web process, under a session id. They gave the critic a budget of two passes. ADK had given them agents, tools, and sessions. They had treated those nouns as decorations on a demo.",
    ],
    moral:
      "A helper is only as current as the folder its tool can see, and only as continuous as the session you actually saved. Gemini cannot fix a stale index or a forgotten conversation.",
  },
  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "The problem: a Gemini call is not an application",
      body: [
        "Imagine you can send Gemini a question and get a paragraph back. That is one call. It is useful. It is not an application. An application also needs tools — ways to look things up — and a memory of the conversation when the user asks a follow-up.",
        "Without a tool, Gemini can only use what it already learned during training. It does not have your handbook. It will guess. Without a saved conversation, a follow-up like 'what about my spouse?' starts from nothing, because the next request may hit a different server.",
        "Teams on Google Cloud want those pieces in one kit: a helper, tools it may call, a saved conversation, and a way to run helpers in a fixed order. That is the problem Google's Agent Development Kit, or ADK, is trying to solve.",
        "Here is a tiny concrete example. User: can I work from Berlin? The helper should search the handbook, read a paragraph, and answer with that paragraph's date. If the search hits last year's file, a correct-sounding quote is still a wrong answer.",
        "At this point you should understand the problem. We need a helper, a tool that reads a real folder, and a conversation that survives more than one HTTP request. Next we will name those pieces the way ADK does.",
      ],
      diagrams: [
        {
          title: "One call versus an application",
          caption:
            "Gemini writes text. Tools read the world. A session remembers the last turn.",
          chart: chart(
            `flowchart LR
    User([User question]) --> Helper[Helper]
    Helper --> Model[Gemini]
    Helper --> Tool[Search handbook]
    Tool --> Folder[(Current folder)]
    Helper --> Memory[(Saved conversation)]
    Model --> User
    Tool --> Helper`,
            `class User hub
    class Helper,Model grp1
    class Tool,Folder grp2
    class Memory grp3`
          ),
        },
      ],
    },
    {
      id: "adk-nouns",
      level: "beginner",
      title: "What ADK is: agent, tool, session, runner",
      body: [
        "Let's use everyday words first. A helper is a job description plus a model plus the tools it may use. ADK calls this an agent. The common kind is an LlmAgent: an agent whose next step is decided by Gemini.",
        "A tool is a function the helper is allowed to call. In ADK you wrap a Python function and give it a description. Gemini does not run your function inside the model. Your process does. That matters: credentials, the folder path, and timeouts live in your code.",
        "A session is the saved conversation. Think of it as a thread id plus the messages so far plus any small notes you stored, such as employee_id. If you do not persist the session, the next request is a stranger.",
        "A runner is the thing that actually executes an agent against a session. Same idea as the OpenAI Runner: the agent is the recipe, the runner is the cook. You will grep these four nouns at 2am — agent, tool, session, runner — so learn them as a set.",
        "ADK is not a new kind of intelligence. It is Gemini's control plane: the objects around the model call. If you remember that, you will not expect ADK to make a stale handbook current.",
        "At this point you should be able to say: the agent decides, the tool reads, the session remembers, the runner drives. Next we build the smallest agent.",
      ],
      diagrams: [
        {
          title: "Four nouns around Gemini",
          caption:
            "Gemini writes text. Your process runs the tool. The session is a saved thread. The runner is the cook.",
          chart: chart(
            `flowchart TD
    User([User message]) --> Cook[Runner]
    Cook --> Recipe[Agent]
    Recipe --> Model[Gemini]
    Recipe --> Tool[Tool in your process]
    Tool --> Folder[(Pinned folder)]
    Cook --> Thread[(Session)]
    Thread --> Cook
    Model --> Cook
    Tool --> Cook
    Cook --> Reply([Reply])`,
            `class User,Reply hub
    class Cook,Recipe,Model grp1
    class Tool,Folder grp2
    class Thread grp3`
          ),
        },
      ],
    },
    {
      id: "simplest-llmagent",
      level: "beginner",
      title: "The simplest version: one LlmAgent, one search tool",
      body: [
        "Let's build the smallest honest helper. It answers handbook questions. It may search one folder. It may not open the public web. We pin the folder on purpose, because 'search' without a place to search is how last year's file sneaks back in.",
        "What are we trying to do? Make the tool tell the truth about what it found, including the document date.",
        "Here is the smallest version.",
        "Let's understand what just happened. LlmAgent is the recipe. the search function is the tool. The return value includes text and a date, because a quote without a date is how the story happened. The model can phrase the answer. It cannot invent a folder.",
        "Beginners often add a web-search tool 'just in case'. On an internal policy question that is a leak and a stale-data source at the same time. If the handbook does not contain the answer, the honest result is 'I could not find it', not a blog post from 2019.",
      ],
      codes: [
        {
          title: "handbook_agent.py — one job, one folder",
          language: "python",
          code: `from dataclasses import dataclass


@dataclass
class Hit:
    text: str
    doc_date: str


def search_handbook(query: str) -> Hit:
    # Your process runs this, not Gemini.
    return Hit("Berlin remote work needs approval.", "2025-01-12")


handbook_agent = {
    "name": "handbook",
    "model": "gemini",
    "tools": [search_handbook],
    "instruction": "Answer only from search_handbook hits. Cite doc_date.",
}`,
        },
      ],
    },
    {
      id: "session-is-memory",
      level: "intermediate",
      title: "Implement the session: memory you actually save",
      body: [
        "The simple agent works for one question on one laptop. It fails when the user says 'what about my spouse?' and the next request hits a different server. That server has no list of previous messages. The helper asks for the employee id again, or worse, guesses.",
        "A session is the saved thread. You give it an id — often the user id plus the ticket id. The runner loads that session, runs the agent, and writes the new messages back. If that write is only in the process memory of one Cloud Run instance, the next instance is empty.",
        "What are we trying to do? Make follow-ups possible after the process restarts.",
        "Here is the smallest version.",
        "Let's understand what just happened. The dict is standing in for a real session store. In ADK you use a session service — in memory for tests, a database for production. The rule is the same: the web process is not the system of record.",
        "Thought experiment. The process crashes after the tool ran but before the session was saved. What should happen on retry? The user may resend. The session should still have the first turn, or you need an idempotency key on any write tool. Reads can be repeated. Writes cannot.",
      ],
      codes: [
        {
          title: "session.py — the thread lives outside the process",
          language: "python",
          code: `SESSIONS: dict[str, list[dict]] = {}


def load(session_id: str) -> list[dict]:
    return list(SESSIONS.get(session_id, []))


def save(session_id: str, messages: list[dict]) -> None:
    SESSIONS[session_id] = messages


sid = "emp17:visa"
save(sid, [{"role": "user", "text": "Berlin for a month?"}])
assert load(sid)[0]["text"].startswith("Berlin")`,
        },
      ],
      diagrams: [
        {
          title: "Session id is the thread",
          caption:
            "Two Cloud Run instances, one store. Without the store, turn two is a stranger.",
          chart: chart(
            `flowchart LR
    Req1([Request 1]) --> InstA[Instance A]
    Req2([Request 2]) --> InstB[Instance B]
    InstA --> Store[(Session store)]
    InstB --> Store
    Store --> InstB`,
            `class Req1,Req2 hub
    class InstA,InstB grp1
    class Store grp3`
          ),
        },
      ],
    },
    {
      id: "workflow-agents",
      level: "intermediate",
      title: "When one helper is not enough: sequence, parallel, loop",
      body: [
        "Sometimes you do not want Gemini to choose the next step. You want a fixed order: search, then draft, then check. ADK has workflow agents for that. They are schedulers, not thinkers. Remember that sentence. It will save you a week.",
        "A sequential agent runs children in order. Search, then draft. A parallel agent runs children at the same time and joins the results — for example, search the handbook and search the visa FAQ together. A loop agent repeats a child until a stop condition, or until it should have a stop condition.",
        "They look similar to an LlmAgent because they are all called agents. The important difference is who decides the next step. In an LlmAgent, Gemini decides. In a sequential agent, you already decided. If the path is known, do not ask the model to rediscover it.",
        "What are we trying to do? Retrieve, then write, then do a bounded check.",
        "Here is the smallest version.",
        "Let's understand what just happened. The critic may run at most twice. That is the budget the story was missing. A loop with no maximum and a critic that never approves is not quality control. It is a timeout.",
      ],
      codes: [
        {
          title: "workflows.py — schedulers, not thinkers",
          language: "python",
          code: `def sequential(*steps):
    def run(state):
        for step in steps:
            state = step(state)
        return state
    return run


def bounded_loop(step, max_passes: int):
    def run(state):
        for _ in range(max_passes):
            state = step(state)
            if state.get("ok"):
                return state
        state["halt"] = "critic-budget"
        return state
    return run`,
        },
      ],
      diagrams: [
        {
          title: "Three schedulers",
          caption:
            "You pick the shape. Gemini does not get to invent a fourth.",
          chart: chart(
            `flowchart TD
    Seq[Sequential] --> S1[Search]
    S1 --> S2[Draft]
    Par[Parallel] --> P1[Handbook]
    Par --> P2[Visa FAQ]
    Loop[Loop] --> C[Critic]
    C -->|not ok and budget left| Loop
    C -->|ok or budget gone| Done([Stop])`,
            `class Done hub
    class Seq,Par,Loop grp1
    class S1,S2,P1,P2,C grp2`
          ),
        },
      ],
    },
    {
      id: "callbacks-are-policy",
      level: "intermediate",
      title: "How the pieces connect: callbacks as policy",
      body: [
        "In a real ADK app the request hits a runner, the runner loads a session, the agent (or workflow) runs, tools fire, and you need a place for rules the model must not vote on. ADK's place for that is a callback: a function you register to run before a model call, before a tool call, or after.",
        "A callback is not a prompt. It is your code. Example: if the question is about an internal policy, deny any tool that hits the open web. Example: if a tool is about to write, require a human flag on the session. This is the same idea as a guardrail in the OpenAI SDK, with a different name.",
        "What are we trying to do? Block the web on handbook questions, in code.",
        "Here is the smallest version.",
        "Let's understand what just happened. The model can ask for web_search. The callback still says no. Policy lives here, not in 'please do not search the web' inside the instruction string.",
        "Where does the tool actually run? In your runner process — Cloud Run, your laptop, or Agent Engine — not 'inside Gemini'. If you need a secret to read the folder, that secret stays in the process. Do not send it to the model.",
      ],
      codes: [
        {
          title: "callbacks.py — deny the web on internal questions",
          language: "python",
          code: `INTERNAL = ("handbook", "visa", "policy")


def before_tool(question: str, tool: str) -> str:
    internal = any(word in question.lower() for word in INTERNAL)
    if internal and tool == "web_search":
        return "deny"
    return "allow"


assert before_tool("Berlin visa policy", "web_search") == "deny"
assert before_tool("Berlin visa policy", "search_handbook") == "allow"`,
        },
      ],
    },
    {
      id: "stale-and-hidden-loops",
      level: "advanced",
      title: "Failure modes: stale corpora and hidden loops",
      body: [
        "Remember the simple search tool. It returns text and a date. The simple version breaks when the folder is stale, or when a loop agent hides a second loop you cannot see.",
        "Stale data first. Gemini grounding and 'search the web' feel like features. They are indexes. An index is only as fresh as the last time you built it. Pin the corpus. Refuse to answer if doc_date is older than the policy's effective date. That refusal is an output check, not a vibe.",
        "Hidden loops next. An LlmAgent already loops: model, tool, model. If you wrap that LlmAgent in a LoopAgent, you have a loop inside a loop. The story's critic never approved, and the outer loop had no budget, so the inner model kept spending turns until the load balancer gave up.",
        "Count the inner turns. If a workflow can start an LlmAgent, that child's max turns times the parent's max passes is your real budget. Write the number down. If you cannot, you do not have a budget.",
        "Thought experiment. The critic never sets ok=true. What should happen? After two passes, halt and tell the user you could not verify the answer. Do not sit on the request. Do not start a new session on refresh without saying the first run failed.",
      ],
      diagrams: [
        {
          title: "Count the inner turns",
          caption:
            "A loop of a looping agent is a budget you must multiply, not hope.",
          chart: chart(
            `flowchart TD
    Outer[Loop agent] --> Child[LlmAgent]
    Child --> Inner[Model or tool turn]
    Inner --> Child
    Child --> Outer
    Cap[Outer passes times inner max] -.-> Halt([Halt])`,
            `class Halt hub
    class Outer,Child,Inner grp1
    class Cap grp3`
          ),
        },
      ],
    },
    {
      id: "deploy-judgment",
      level: "advanced",
      title: "Production: Cloud Run is a process, Agent Engine is a product",
      body: [
        "Remember the simple laptop demo. The simple version breaks the moment you have two instances and a write tool. Deployment is where session and tool location become real.",
        "Cloud Run gives you a process. You wrap the runner in an HTTP handler. You must put sessions in a store those instances share. You must put secrets in the process environment. You must give the request a deadline that is larger than your worst honest run and smaller than 'forever'.",
        "Vertex AI Agent Engine is a managed place to host the same ADK app. It does not change the nouns. It may change who restarts the process and who stores the session. Read that part of the docs for the project you are on. Do not assume memory is free.",
        "When is ADK the right kit? You are on Gemini, you want first-party agents and workflows, and your tools can run in your Google cloud process. When should you avoid it? You are not on Gemini, or your product is a React UI that needs to share form state — that sitting is CopilotKit — or you need a portable graph with a checkpointer.",
        "At this point you should be able to debug an ADK failure without blaming Gemini first. Ask: which agent ran, which tool ran, which folder did it read, which session id was loaded, which callback fired, and how many inner turns were left.",
      ],
    },
  ],
  workedExample: {
    title: "Berlin visa question against the 2025 handbook",
    setup:
      "An employee asks if they can work from Berlin for a month. The 2025 handbook is in one folder. The 2024 handbook is still on disk. A critic may review the draft twice.",
    walkthrough: [
      "Step 1 — Understand the problem. The answer must come from the current policy, and a follow-up must remember the employee id.",
      "Step 2 — Identify the relevant concept. LlmAgent plus a pinned search tool plus a session plus a bounded critic.",
      "Step 3 — Build the simplest solution. search_handbook returns text and doc_date from the 2025 folder only.",
      "Step 4 — Improve it. Sequential: search, then draft. Session id is emp17:visa, stored outside Cloud Run.",
      "Step 5 — Handle a failure. If doc_date is before 2025-01-01, refuse. If the critic never approves, halt after two passes with an honest message.",
      "Step 6 — Production. A before-tool callback denies web_search. Tracing shows the tool path, not just the final sentence.",
    ],
    result:
      "The employee gets a dated citation or a refusal. Last year's quote cannot leave the runner. A refresh does not invent a new empty thread if the session id is reused.",
  },
  practice: {
    title: "Bind a critic that never approves",
    task:
      "Your ADK app is Sequential(search, draft, Loop(critic)). The critic never sets ok. Users hit a 60-second timeout and refresh. The handbook folder is still 2024. What do you change first, and how do you prove it in a test?",
    hint:
      "There are two bugs: a loop without a budget, and a tool pointed at the wrong folder. A common wrong approach is a longer critic prompt.",
    solution:
      "Give the loop a max of two passes and a halt reason the user can see. Point search at the dated 2025 corpus and refuse if doc_date is stale. Persist the session so a refresh is the same thread. Test: a critic that always rejects ends with halt=critic-budget in bounded time; a 2024 hit cannot produce an answer. Why this works: you fixed the scheduler and the folder, which are your code. The common wrong approach is asking Gemini to 'only use current policy'. The model cannot see which folder you mounted.",
  },
  takeaways: [
    "ADK is Gemini's control plane: agent, tool, session, runner. It is not a new kind of intelligence.",
    "A tool runs in your process. The folder it reads is your responsibility, including the date on the file.",
    "A session is the conversation you actually saved. Process memory is not a session store.",
    "Sequential, parallel, and loop agents are schedulers. Use them when you already know the order.",
    "Callbacks are policy the model does not vote on. Instructions are suggestions.",
    "A loop around an LlmAgent is a multiplied budget. Write the number down or you do not have one.",
  ],
  mistakes: [
    "Mistake: pointing a search tool at a folder you never re-index. Why people make it: the demo folder worked. What actually happens: last year's quote looks authoritative. Better approach: pin a dated corpus and refuse stale hits.",
    "Mistake: keeping the session in one Cloud Run instance. Why people make it: in-memory is the default. What actually happens: follow-ups start from zero. Better approach: a shared session store keyed by a stable id.",
    "Mistake: wrapping an LlmAgent in an unbounded LoopAgent. Why people make it: 'a critic will catch it'. What actually happens: the request times out. Better approach: max passes times max inner turns, then halt.",
    "Mistake: adding web search for internal policy. Why people make it: completeness. What actually happens: leaks and 2019 blog posts. Better approach: deny that tool in a callback.",
    "Mistake: blaming Gemini first. Why people make it: the sentence looks wrong. What actually happens: you miss the stale index or empty session. Better approach: tool, folder, session, callback, budget — then the model.",
    "Mistake: treating a sequential workflow as if Gemini still chooses the path. Why people make it: everything is named agent. What actually happens: you fight the scheduler with prompts. Better approach: if the path is known, keep it in the workflow.",
  ],
  interviews: [
    {
      question: "What is a session in Google ADK, starting from zero?",
      difficulty: "easy",
      answer:
        "A session is the saved conversation: an id, the messages, and small notes like employee_id. The runner loads it, runs the agent, and writes it back. What they want: you know the process is not the memory. Follow-up: what happens if two Cloud Run instances do not share a store? Turn two is a stranger.",
    },
    {
      question: "A policy helper cited last year's handbook. How do you debug it?",
      difficulty: "medium",
      answer:
        "Do not start with the prompt. See which tool ran and which folder it read. Check doc_date against the policy effective date. Check the session id so you know you are looking at the right thread. Fix the corpus and refuse stale hits in code. Follow-up: where does that refusal live? In the tool result or a callback or an output check — not in the instruction string alone.",
    },
    {
      question:
        "Compare an LlmAgent, a Sequential agent, and a Loop agent. When is each the wrong choice?",
      difficulty: "hard",
      answer:
        "LlmAgent: Gemini chooses tools each turn. Wrong when the path is already known — you will pay for rediscovery and skip risk. Sequential: you chose the order. Wrong when the next step truly depends on an unpredictable tool result. Loop: repeat until a condition. Wrong without a budget, or when the child is already a looping LlmAgent and you have not multiplied the turns. Follow-up: where should policy live? In callbacks, because the model does not vote.",
    },
  ],
  glossary: [
    {
      term: "LlmAgent",
      meaning:
        "An ADK helper whose next action is chosen by Gemini: call a tool or answer. Why it matters: it already contains a loop.",
    },
    {
      term: "Tool",
      meaning:
        "A function your process runs when the agent asks. Why it matters: the folder, the secrets, and the date on the file live here.",
    },
    {
      term: "Session",
      meaning:
        "The saved thread for one conversation. Why it matters: without a shared store, the next request has no past.",
    },
    {
      term: "Runner",
      meaning:
        "The object that executes an agent against a session. Why it matters: this is the cook; the agent is the recipe.",
    },
    {
      term: "Workflow agent",
      meaning:
        "A scheduler — sequential, parallel, or loop — that does not think. Why it matters: use it when you already know the shape of the work.",
    },
    {
      term: "Callback",
      meaning:
        "Your function that runs before or after a model or tool call. Why it matters: this is policy the model cannot override.",
    },
  ],
};
