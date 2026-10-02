import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "observability-cost",
  instructor:
    "I teach this from zero. We start with a feeling you already know: something is slow or expensive, and you cannot see why. Then we learn to write a story of one run you can replay.",
  promise:
    "You will go from a single 'completed' log line to a replayable trace, a money and time budget, a cap on retries, a view of which prompt block ate tokens, and a store that does not leak secrets.",

  story: {
    title: "The helper that was 'a bit slow' and a four-hundred-dollar morning",
    body: [
      "A support team shipped a ticket helper. In the demo it answered in four seconds and cost a fraction of a cent. The first real Monday it felt 'a bit slow'. Nobody had a picture of a single run. They had a log line that said 'completed' and a cloud bill that said otherwise.",
      "When someone finally printed the raw calls, one ticket had done this: the model planned, a search timed out, the helper retried the search, the outer web framework retried the whole helper, and each attempt stuffed the last thirty Slack messages into the prompt. Three times three. Nine visits to a dying search service. The last model call was huge because the prompt had grown on every retry.",
      "The team had asked 'is the model getting worse?' The model was the same. The missing piece was a story of the run: which steps happened, how long each took, how many tokens each used, and which one failed. Without that story, the bill was a mystery and the user just saw a spinner.",
      "They added a trace id on every ticket, a span for each model call and tool call, a hard money and time budget, a cap on retries, and a log of tokens by section of the prompt. The next outage was a search timeout they could point at in one click. The invoice stopped being a surprise.",
    ],
    moral:
      "If you cannot replay a run as a sequence of steps with time and cost on each step, you are hoping, not operating. The story of the run is the product.",
  },

  stages: [
    {
      id: "cannot-see-why",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Let's start from zero. When a normal web page is slow, you open a log. You look for the database query or the HTTP call that took two seconds. You can point at a line. That is ordinary software.",
        "An AI helper hides several of those calls inside one user click. The model may run twice. A search tool may run three times. A retry wrapper may run the whole thing again. The user still sees one spinner. Your log still says one 'completed'.",
        "Cost is the same shape. You are billed per piece of text the model reads and writes, often called tokens, and per second a tool spends waiting. If you only look at the monthly invoice, you cannot say which ticket, which step, or which retry paid the most.",
        "The problem we are solving is visibility. Not a prettier dashboard for its own sake. A way to answer three questions after any bad run: what happened, in what order, and what did each step cost in time and money.",
        "What happens without it? Teams debate the prompt. They upgrade the model. They guess. The actual leak is often a retry loop or a huge pasted history. You cannot fix a leak you cannot see.",
        "At this point you should understand: one user request can contain many hidden calls. We need a story of those calls.",
      ],
      diagrams: [
        {
          title: "One click, many hidden calls",
          caption: "The user sees one spinner. The bill is the sum of the boxes.",
          chart: chart(
            `flowchart TD
    Click([User ticket]) --> Plan[Model plans]
    Plan --> Search[Search tool]
    Search --> Retry[Search again]
    Retry --> Answer[Model answers]
    Click --> Bill([Time and money])
    Plan --> Bill
    Search --> Bill
    Retry --> Bill
    Answer --> Bill`,
            `class Click,Bill hub
    class Plan,Search,Retry,Answer grp1`
          ),
        },
      ],
    },
    {
      id: "trace-is-a-story",
      level: "beginner",
      title: "A trace is the story of one run",
      body: [
        "Give that story a name: a trace. A trace is the record of one run of the helper, from the user's question to the final answer or the halt.",
        "Every trace has an id, like a ticket number for the run. You put that id on every log line and every later step. When someone pastes the id, you can reconstruct the morning.",
        "Why an id? Because two users can click at the same time. Without an id, their steps mix in the log and you debug a ghost.",
        "The simplest example is a receipt. Dinner was 40, tax was 3, tip was 8. You can add. A helper run is the same: plan call, search call, answer call. If any line is missing, the total will surprise you.",
        "Connect this back. Stage 1 said the spinner hides many calls. The trace is how you unhide them without sitting on the process with a debugger.",
        "At this point you should be able to say: a trace is one run's story, and it starts with an id you chose.",
      ],
      diagrams: [
        {
          title: "One id holds the receipt together",
          caption: "Two users can click at once. Without an id, their steps mix.",
          chart: chart(
            `flowchart LR
    Tid([trace_id]) --> L1[Log line]
    Tid --> L2[Model span]
    Tid --> L3[Tool span]`,
            `class Tid hub
    class L1,L2,L3 grp1`
          ),
        },
      ],
    },
    {
      id: "span-anatomy",
      level: "beginner",
      title: "How the simplest version works",
      body: [
        "Inside a trace, each interesting step is a span. Think of a span as one line on the receipt: a name, a start time, an end time, and a few notes.",
        "For this sitting, you need two kinds of spans at minimum. A model span: which model, how many tokens in, how many tokens out, how many milliseconds, whether it failed. A tool span: which tool, which arguments (with secrets removed), which result size, how long, whether it failed.",
        "What are we trying to do? Write down enough that tomorrow's engineer can replay the argument without guessing.",
        "Here is the smallest version. When a step starts, record the name and the clock. When it ends, record the clock, the token counts or the error, and attach it to the trace id.",
        "Let's understand what just happened. You can now answer 'which tool burned eight seconds?' by sorting spans. If you cannot answer that, you are not observing yet. You are hoping.",
        "At this point you should understand: traces contain spans. Cost and latency live on the spans. Sum them or you will miss the retry.",
      ],
      codes: [
        {
          title: "One step on the receipt",
          language: "python",
          code: `from dataclasses import dataclass

@dataclass
class Span:
    trace_id: str
    name: str
    ms: int
    tokens_in: int = 0
    tokens_out: int = 0
    usd: float = 0.0
    error: str | None = None`,
        },
      ],
      diagrams: [
        {
          title: "Spans inside one trace",
          caption:
            "If you omit the retry span, the total will not match the invoice.",
          chart: chart(
            `flowchart TD
    Run([trace_id]) --> S1[Model plan]
    Run --> S2[Search]
    Run --> S3[Search retry]
    Run --> S4[Model answer]
    S1 --> C1[tokens and ms]
    S2 --> C2[ms]
    S3 --> C3[ms]
    S4 --> C4[tokens and ms]`,
            `class Run hub
    class S1,S2,S3,S4 grp1
    class C1,C2,C3,C4 grp2`
          ),
        },
      ],
    },
    {
      id: "budgets",
      level: "intermediate",
      title: "Budgets are product features, not afterthoughts",
      body: [
        "Seeing the bill is not enough. You also need a stop. A budget is a limit you set before the run: this ticket may spend at most N cents and M milliseconds. When either limit trips, the helper stops with an honest message.",
        "Why before a prettier model? Because an unbounded loop plus a confused model is an invoice. The user would rather hear 'I ran out of budget' than wait a minute for a guess.",
        "What are we trying to do? Keep two counters on the run and add to them after every span.",
        "Pick numbers from real traces, then add a little room. A lookup helper might allow eight cents and eight seconds. A research helper might allow more. The number matters less than the halt being loud and logged.",
        "Do not hide a budget halt as a normal answer. That trains everyone to distrust the product. Say you stopped, and keep the trace marked budget_exceeded.",
        "At this point you should understand: a budget is a door you control. The model does not get to spend forever because it is still 'thinking'.",
      ],
      codes: [
        {
          title: "Stop when money or time runs out",
          language: "python",
          code: `class Budget:
    def __init__(self, max_usd: float, max_ms: int):
        self.max_usd = max_usd
        self.max_ms = max_ms
        self.usd = 0.0
        self.ms = 0

    def add(self, usd: float, ms: int) -> None:
        self.usd += usd
        self.ms += ms
        if self.usd > self.max_usd or self.ms > self.max_ms:
            raise RuntimeError("budget_exceeded")`,
        },
      ],
    },
    {
      id: "retries-multiply",
      level: "intermediate",
      title: "Retries multiply the bill",
      body: [
        "Normal software retries a failed HTTP call. That is often right. An agent makes it dangerous, because you may have two retry layers: the tool retries, and the outer request retries the whole agent.",
        "Three inner retries times three outer retries is nine paid visits. The story on Monday was this shape. Each visit also re-paid the fat prompt.",
        "The rule: one retry policy, as close to the failing call as possible, with a small cap. Retry a timeout or a 'try again later' response. Do not retry a conflict that means 'this refund cannot happen'. Do not wrap the entire agent in a generic retry.",
        "Cache also belongs here. If you already called search with the same query in this run, reuse the result. Identical tool calls are a common way loops burn money while looking busy.",
        "Pause and check. If search is down, should the helper keep paying for the same call? No. It should record the error on a span, count it against the budget, and halt or escalate.",
        "At this point you should understand: retries are a cost feature. Cap them, name them on the trace, and never nest two unnamed policies.",
      ],
      diagrams: [
        {
          title: "Two retry wrappers, one surprise bill",
          caption:
            "Put one policy on the failing call. Do not retry the whole agent around it.",
          chart: chart(
            `flowchart LR
    Req[HTTP request] --> Outer{Outer retry}
    Outer --> Agent[Whole agent]
    Agent --> Inner{Tool retry}
    Inner --> Search[Search]
    Search --> Bill([Paid again])`,
            `class Req,Bill hub
    class Outer,Inner grp2
    class Agent,Search grp1`
          ),
        },
      ],
    },
    {
      id: "fat-context-tax",
      level: "intermediate",
      title: "Fat context is the silent tax",
      body: [
        "Tokens in the prompt are the quiet line on the receipt. A tool that returns 8,000 tokens of HTML, or a packer that pastes thirty Slack messages, will dominate cost even when the step count looks fine.",
        "So log tokens by block: policy, goal, evidence, history, last tool result. When the bill jumps, you will see which block grew. That is context engineering meeting observability.",
        "They look similar: 'the run used 12,000 tokens' versus 'history used 9,000'. The important difference is action. The first number makes you shrug. The second number tells you what to cut.",
        "Latency follows the same split. A model span that takes six seconds may be a slow model, or it may be a 20,000-token prompt. Read tokens_in before you switch providers.",
        "In a real app this sits next to the packer. The packer already named the blocks. The tracer just records their sizes. You do not need a new vendor to start.",
        "At this point you should understand: if you cannot name which block ate the tokens, you will 'optimise the model' and miss the dump.",
      ],
      codes: [
        {
          title: "Count tokens where you packed them",
          language: "python",
          code: `def block_sizes(blocks: dict[str, str]) -> dict[str, int]:
    return {name: len(text) for name, text in blocks.items()}`,
        },
      ],
    },
    {
      id: "redact-and-alert",
      level: "advanced",
      title: "Hide secrets, then alert on drift",
      body: [
        "Remember the simple receipt. The advanced problem is that the receipt contains other people's data. Emails, invoice ids, API keys the model echoed, the body of a ticket. A trace store is a second production database. Treat it that way.",
        "Redact before you store. Replace tokens that look like keys. Hash emails if you do not need the raw address to debug. Keep tool arguments, but drop known secret fields. If a vendor UI is convenient and unredacted, that convenience is the incident.",
        "Alerts should be boring and numeric. Tool-error rate, mean steps per ticket, cost per successful ticket, budget-halt rate. Do not alert on 'the model felt off'. People will mute that.",
        "Pick one backend and learn it. Vendors exist. You can also export spans yourself. The product is nested spans you can click, not the logo. You can change vendors if you keep the same fields.",
        "Trade-off: more detail helps debug and raises leak risk. Default to enough to replay the argument, not enough to reconstruct a customer's entire mailbox.",
        "At this point you should understand: observability without redaction is just copying production into another disk.",
      ],
      diagrams: [
        {
          title: "Record, redact, then you may store",
          caption:
            "The convenient vendor UI is still a database of customer text.",
          chart: chart(
            `flowchart LR
    Span[Raw span] --> Red[Redact secrets]
    Red --> Store[(Trace store)]
    Store --> View[Debug UI]
    Store --> Alert[Numeric alerts]`,
            `class Span,Store hub
    class Red,View,Alert grp1`
          ),
        },
      ],
    },
    {
      id: "otel-and-replay",
      level: "advanced",
      title: "Common field names, and replay instead of guess",
      body: [
        "OpenTelemetry is a common way to name and export spans so you are not locked to one vendor's UI. You do not need to memorise the spec. You need to know that model calls and tool calls have standard fields: tokens, model name, errors. Use them.",
        "Replay means: take a stored run and feed the same recorded tool results back into the loop. You can then change the prompt or the packer and see what the model would have done, without charging the card again or hitting live APIs.",
        "Replay requires the structured spans from stage 3. If you only stored the final paragraph, you cannot replay. If you stored arguments and observations, you can.",
        "When the helper is 'slow and expensive', look at the trace first. Which spans dominate time? Did retries nest? Which prompt block ate tokens? Add a budget and a cache after you can see. Prompt tweaks come last.",
        "When not to add more instrumentation. A span on every internal function call will drown you. Span the model, the tools, the packer, and the budget halt. That is enough to run the product.",
        "At this point you can teach the sitting: id the run, span the steps, budget the run, cap retries, log blocks, redact, alert on numbers, replay before you guess.",
      ],
      codes: [
        {
          title: "A toy token bill so the idea is concrete",
          language: "python",
          code: `PRICE_IN = 0.000001
PRICE_OUT = 0.000002

def usd(tokens_in: int, tokens_out: int) -> float:
    return tokens_in * PRICE_IN + tokens_out * PRICE_OUT`,
        },
      ],
    },
  ],

  workedExample: {
    title: "Turn 'a bit slow' into a receipt you can click",
    setup:
      "The Monday helper from the story. Search times out. An outer retry wraps the agent. The prompt includes thirty Slack messages.",
    walkthrough: [
      "Step 1 — Understand the problem. One spinner hides many calls. The invoice does not name the ticket.",
      "Step 2 — Identify the relevant concept. A trace id, spans on model and tool, a budget.",
      "Step 3 — Build the simplest solution. Log start and end of each call with the ticket id, milliseconds, and token counts.",
      "Step 4 — Improve it. Add a 10-second and 10-cent budget. Cap tool retries at two. Remove the outer retry around the whole agent.",
      "Step 5 — Handle a failure or edge case. Search timeout records error on the span, trips the time budget, returns 'I ran out of budget' instead of a guessed answer.",
      "Step 6 — Explain the production version. Log tokens by prompt block. Redact emails. Alert if cost per successful ticket doubles week over week.",
    ],
    result:
      "The next timeout is a search span you can open. The Slack dump shows up as a history-block size, not as a mysterious model regression.",
  },

  practice: {
    title: "A research helper with a surprise invoice",
    task:
      "A research agent has no budgets. It retries failed fetches up to five times. The HTTP gateway also retries the whole request twice. Prompts include raw HTML from the last three fetches. Users say it is slow. Finance says the bill doubled. Problem: what do you measure first, what limits do you add, and what do you stop retrying? Think about: nested retries on paper, and which span would be the tallest if you had a trace.",
    hint:
      "Draw the nested retries before you change the prompt. Expected reasoning: one real run with a trace id; spans on each model call and fetch; tokens by block; one retry policy; no outer retry; no raw HTML.",
    solution:
      "Measure first: one real run with a trace id; spans on each model call and fetch; tokens by block. You will likely see HTML in the prompt and 5×3 fetches. Limits: a dollar and latency budget per request; fetch retries of two on timeout only; delete the outer retry. Stop stuffing raw HTML — keep a short extract plus a handle. Redact URLs with credentials. Why this works: you can see the tall span and the nested retries before you touch the model. Common wrong approach: switch to a cheaper model before looking at a single trace.",
  },

  takeaways: [
    "One user click can hide many model and tool calls. You need a story of the run, not a single 'completed' line.",
    "A trace is that story. A span is one line on the receipt: time, tokens, error.",
    "A money and time budget is a product feature. Stop with an honest message when it trips.",
    "Retries multiply cost. One named policy near the failing call. Never retry the whole agent around a tool retry.",
    "Log tokens by prompt block. Fat history is the silent tax.",
    "Redact before you store. A trace backend is a second copy of production data.",
  ],

  mistakes: [
    "Mistake: log only the final answer. Why people make it: that is what the user saw. What actually happens: you cannot see the retry or the fat prompt. Better approach: span every model and tool call.",
    "Mistake: no retry cap. Why people make it: retries feel resilient. What actually happens: nested wrappers turn one timeout into nine paid calls. Better approach: one policy, small cap, named on the trace.",
    "Mistake: no budget. Why people make it: you do not want to cut off a 'nearly done' run. What actually happens: a surprise invoice. Better approach: hard limits and a loud halt.",
    "Mistake: ship traces with secrets. Why people make it: raw text is easier to debug. What actually happens: a second unredacted database. Better approach: redact, then store.",
    "Mistake: alert on vibes. Why people make it: quality is hard to phrase. What actually happens: people mute the channel. Better approach: error rate, steps, cost per success.",
    "Mistake: tune the prompt before opening the trace. Why people make it: prompts feel like the job. What actually happens: you miss the dump and the nested retry. Better approach: look at spans first.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "What is a trace in an agent system, and why do you need one?",
      answer:
        "What they are testing: the story of a run. Good answer: a trace is the record of one run, with an id and a span per model or tool call so you can see order, time, and cost. Why that is good: you can replay the argument. Follow-up: what fields belong on a model span?",
    },
    {
      difficulty: "medium",
      question: "An agent is 'slow and expensive'. What do you look at first?",
      answer:
        "What they are testing: debug order. Good answer: the trace — tall latency spans, nested retries, token counts by prompt block — then add a budget and a cache. Prompt changes come after you can see the bill. Why that is good: you did not start with a model swap. Follow-up: how would nested retries show up?",
    },
    {
      difficulty: "hard",
      question:
        "How would you design budgets and observability for a multi-tenant support agent?",
      answer:
        "What they are testing: production judgment. Good answer: per-request money and time budgets, one retry policy, tokens logged by block, redaction before export, alerts on cost per successful ticket and budget-halt rate, common field names so you can change vendors. Why that is good: you treated traces as customer data and as an operations tool. Follow-up: what would you not put a span on?",
    },
  ],

  glossary: [
    {
      term: "Trace",
      meaning:
        "The story of one run, held together by an id. Why it matters: without it, many hidden calls look like one spinner.",
    },
    {
      term: "Span",
      meaning:
        "One step in that story, with time, tokens, and error. Why it matters: cost and slowness live on steps, not on the final sentence.",
    },
    {
      term: "Token",
      meaning:
        "A piece of text the model reads or writes and that you pay for. Why it matters: fat prompts are a bill even when step count looks fine.",
    },
    {
      term: "Budget",
      meaning:
        "A hard limit on money or time for one run. Why it matters: the model will not stop on its own just because the invoice is growing.",
    },
    {
      term: "Redaction",
      meaning:
        "Removing secrets and extra personal data before you store a trace. Why it matters: the debug store is still production data.",
    },
    {
      term: "Replay",
      meaning:
        "Re-running a stored trace with recorded tool results. Why it matters: you can test a prompt change without hitting live APIs again.",
    },
  ],
};
