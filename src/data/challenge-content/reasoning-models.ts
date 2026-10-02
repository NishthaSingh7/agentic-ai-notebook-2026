import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "reasoning-models",
  instructor:
    "I teach this from zero. If you have never heard o1, o3, or 'thinking tokens', that is fine. We will start with a model that answers immediately, then a model that spends tokens on scratch work, then when that spend is worth money and time.",
  promise:
    "You will leave knowing what a reasoning model is doing with those extra tokens, when the spend pays, when it loops, how to cap it, and when a cheaper ordinary model is the better tool.",

  story: {
    title: "The refund that thought for four minutes",
    body: [
      "A support team swapped their ordinary chat model for a new 'reasoning' model on every ticket. The vendor said it would think before it answered. The first hard tickets looked better. Someone turned it on for everything, including 'what is my order status', which is a single lookup.",
      "On a busy Saturday the queue froze. Average time to first token — the wait before the user sees any words — jumped from two seconds to almost a minute. One refund ticket sat for four minutes while the model wrote a long private scratchpad about tax law in a country the order never touched. The lookup tool had already returned a clear 'already refunded' at second three. The model kept thinking anyway.",
      "Cost followed latency. Thinking tokens are still tokens. A weekend of status questions billed like a weekend of research memos. A few tickets did improve: multi-step policy exceptions where the old model jumped to a wrong yes. Those were a minority. The rest was a slow, expensive lookup bot.",
      "They split the path. Lookups and greetings went back to a fast model with a tool. Policy exceptions and messy math went to the reasoning model with a hard cap on thinking tokens and a wall clock. If the cap hit, they showed a partial and offered a human. The queue moved. The hard tickets kept the extra think.",
    ],
    moral:
      "Thinking tokens are a budget, not a personality upgrade. Spend them on problems that need scratch work. Do not spend them on a lookup you already finished.",
  },

  stages: [
    {
      id: "two-kinds-of-answer",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Let us start from zero. Most chat models you have used work like this: they read the prompt and start writing the answer. That is fast. It works for 'translate this' or 'summarize this email'. It is weaker when the question needs several silent steps, like a tricky tax exception or a proof.",
        "Ordinary people reach for scratch paper on those questions. They jot a plan, check a step, cross something out, then write the clean answer. A reasoning model is a model trained to spend extra tokens on that scratch work before it shows you the final text.",
        "Those extra tokens are often called thinking tokens or reasoning tokens. They are still pieces of text the model produces. You usually do not show the whole scratchpad to the user. You still pay for it. You still wait for it.",
        "What happens if you ignore the difference and use a thinking model for every sentence? The story. Lookups get a research-sized bill. Users stare at a spinner. A few hard tickets get better and hide the damage in an average quality score.",
        "At this point you should understand the problem: scratch work helps some jobs and wastes time on others. The rest of the sitting is how to tell them apart and how to cap the spend.",
      ],
      diagrams: [
        {
          title: "Answer now versus scratch first",
          caption:
            "Both paths end in an answer. Only one pays for a private draft you never wanted on a lookup.",
          chart: chart(
            `flowchart LR
    Q([Question]) --> Fast[Ordinary model]
    Q --> Think[Reasoning model]
    Fast --> A1([Answer soon])
    Think --> Scratch[Private scratch tokens]
    Scratch --> A2([Answer later])`,
            `class Q,A1,A2 hub
    class Fast grp1
    class Think,Scratch grp2`
          ),
        },
      ],
    },
    {
      id: "what-reasoning-models-are",
      level: "beginner",
      title: "What a reasoning model is",
      body: [
        "Names you will hear — o1, o3, DeepSeek-R1, and others — are products in this family. The family trait is not a logo. It is: extra tokens spent on intermediate work, then a final answer. Some APIs hide the scratch. Some show a summary. The bill still includes it.",
        "Everyday picture: two students. One writes the answer in the margin immediately. The other fills a notebook, then copies a clean last page. The notebook can catch a mistake. The notebook also takes the whole exam period on a question that was 'what is 2+2'.",
        "They look similar to chain-of-thought, which is when you ask an ordinary model to 'think step by step' in the same output. The important difference is training and control. A reasoning model is trained to use a think phase. APIs often let you cap that phase. A prompt that says 'think step by step' is a request, not a budget.",
        "Why the term matters: teams say 'we upgraded to a reasoning model' when they mean 'we made every call slower'. The upgrade is a tool for hard items. It is not a new default personality.",
        "At this point you should be able to say: a reasoning model buys scratch paper with tokens. Next we call it with a cap.",
      ],
      diagrams: [
        {
          title: "Scratch first, answer second",
          caption:
            "The user waits through the scratch. The meter runs through the scratch.",
          chart: chart(
            `flowchart TD
    In([Prompt]) --> Think[Think phase]
    Think --> Cap{Cap hit?}
    Cap -->|yes| Halt([Stop or partial])
    Cap -->|no| Final[Final answer]
    Final --> Out([User sees the answer])`,
            `class In,Halt,Out hub
    class Think,Final grp1
    class Cap grp2`
          ),
        },
      ],
    },
    {
      id: "smallest-cap",
      level: "beginner",
      title: "The simplest version: call it with a cap",
      body: [
        "What are we trying to do? Send easy questions to a fast model. Send hard questions to a reasoning model with a maximum number of thinking tokens and a time limit. Never make 'always think' the default.",
        "Here is the smallest version. A router looks at the job type. Lookup and greetings go fast. Policy and messy math go to think, with a cap. If the provider offers a reasoning budget parameter, set it. If they do not, set a wall-clock timeout on the request.",
        "Let's understand what just happened. The model does not own the budget. You do. A four-minute think on 'already refunded' is a missing cap, not a thoughtful agent.",
        "You still need tools. A reasoning model that cannot look up the order will think about an order it cannot see. Scratch paper does not replace retrieve or a database. It sits on top of facts you already fetched — or it should.",
        "At this point you should understand the simplest use: route, cap, and keep lookups cheap.",
      ],
      codes: [
        {
          title: "route.py — scratch paper is a choice",
          language: "python",
          code: `FAST = {"status", "greeting", "lookup"}
SLOW = {"policy", "tax", "proof"}


def route(kind: str) -> str:
    if kind in FAST:
        return "fast"
    if kind in SLOW:
        return "reason"
    return "fast"


def call(kind: str, prompt: str, fast, reason) -> str:
    if route(kind) == "fast":
        return fast(prompt)
    return reason(prompt, think_tokens=2048, seconds=30)`,
        },
      ],
    },
    {
      id: "when-spend-pays",
      level: "intermediate",
      title: "How we use it: when the spend pays",
      body: [
        "The spend pays when the ordinary model fails in a way extra scratch can fix: multi-step policy, math that must not drop a digit, a proof, a plan with several constraints. It pays less on classification, extraction, and greetings. It pays almost nothing on a tool result that already is the answer.",
        "A practical pattern is escalate, do not default. Try the fast path. If a cheap checker says the answer is incomplete — missing a required field, failed a unit test, failed a policy regex — then call the reasoning model with the same facts. Most tickets never escalate.",
        "What are we trying to do? Spend thinking tokens on the miss, not on the whole stream. The story's Saturday freeze was a missing escalate.",
        "Let's understand latency. Time to first token is what the user feels. A reasoning call may sit silent while it thinks. If you must use one, stream a status ('working on the policy exception') or escalate only after the fast path already replied 'I need a moment'. A silent spinner for four minutes is a product bug.",
        "Connect this back to agents. A ReAct loop that uses a reasoning model on every turn multiplies spend. Prefer a fast model in the hot loop. Escalate one node — 'decide this exception' — not every lookup.",
      ],
      diagrams: [
        {
          title: "Escalate, do not default",
          caption:
            "The expensive think is a second try after a cheap miss, not the front door.",
          chart: chart(
            `flowchart TD
    Job([Ticket]) --> Fast[Fast model plus tools]
    Fast --> Ok{Good enough?}
    Ok -->|yes| Done([Answer])
    Ok -->|no| Think[Reasoning model with cap]
    Think --> Done`,
            `class Job,Done hub
    class Fast grp1
    class Ok,Think grp2`
          ),
        },
      ],
      codes: [
        {
          title: "escalate.py — think only after a cheap miss",
          language: "python",
          code: `def answer(ticket, fast, reason, ok) -> str:
    draft = fast(ticket)
    if ok(draft):
        return draft
    return reason(ticket, think_tokens=4096, seconds=45)`,
        },
      ],
    },
    {
      id: "loops-and-caps",
      level: "intermediate",
      title: "When thinking is not enough: loops and caps",
      body: [
        "Reasoning models can loop. They restate the problem, try a plan, discard it, try it again. That looks like work. It is often stalling. A cap is the door. When think tokens or seconds run out, you stop. You do not raise the cap 'a little' forever.",
        "Give the think phase a way to finish. If the job needs a tool, the tool should be available during think, or you should fetch first and then think. A model that thinks about a missing fact will invent one. Fetch, then think, is cheaper than think, then guess, then fetch.",
        "Here is the key idea. More think is not the fix for a missing tool result. The Saturday refund already had 'already refunded' in the trace. Extra scratch about tax law was the model refusing to stop.",
        "You can also stop with a terminal tool: 'submit_answer' or 'hand_to_human'. If the model calls it, you end the think. If it never calls it, the cap ends the think. Two doors, same as the ReAct sitting.",
        "Pause and check. If the cap hits, should you retry the same prompt with a higher cap? Once, maybe, on a known-hard class. Not on a lookup. Not in a loop.",
      ],
      codes: [
        {
          title: "stop_think.py — a terminal tool ends the think",
          language: "python",
          code: `def run_reason(prompt: str, reason_turn, max_think: int) -> str:
    used = 0
    notes = prompt
    while used < max_think:
        move, spent = reason_turn(notes)
        used += spent
        if move.get("final"):
            return move["final"]
        if move.get("hand_off"):
            return "handed to a human"
        notes += move.get("scratch", "")
    return "stopped: think budget"`,
        },
      ],
      diagrams: [
        {
          title: "More think is not the fix",
          caption:
            "If the fact is already in the trace, extra scratch is stalling. If the fact is missing, fetch first.",
          chart: chart(
            `flowchart TD
    Start[Need an answer] --> Have{Fact in hand?}
    Have -->|no| Fetch[Fetch first]
    Fetch --> Start
    Have -->|yes| Think[Think with a cap]
    Think --> Door{Final, handoff, or cap?}
    Door --> Out([Stop])`,
            `class Start,Out hub
    class Have,Door grp2
    class Fetch,Think grp1`
          ),
        },
      ],
    },
    {
      id: "how-it-fits",
      level: "intermediate",
      title: "How reasoning models fit in an application",
      body: [
        "Put two meters on every call: thinking tokens and wall-clock seconds. Log both. A dashboard that only shows 'answer quality' will hide the Saturday freeze.",
        "The application shape is a router plus an escalate. Fast model for the hot path. Reasoning model for labelled hard kinds, or for failures of a checker. Humans for cap-hits on money and policy.",
        "Do not stream raw scratch to customers. It can leak tool names, internal policy, and wrong turns that you then have to unsay. If the vendor offers a safe summary of think, treat it as optional UI, not as evidence.",
        "Connect this back to cost. Thinking tokens often cost more per token than fast tokens, and you use more of them. A 10× quality win on 5% of tickets can still lose money if you also 50× the other 95%. Price the mix.",
        "At this point you should be able to point at a design and say where think is allowed, what the cap is, and what the user sees when the cap opens.",
      ],
      diagrams: [
        {
          title: "Two meters on every call",
          caption:
            "Either meter can halt. Quality without meters is how a queue freezes.",
          chart: chart(
            `flowchart LR
    Call[Reasoning call] --> Tok[Think tokens]
    Call --> Time[Wall clock]
    Tok --> Halt{Either maxed?}
    Time --> Halt
    Halt -->|yes| Stop([Named halt])
    Halt -->|no| Ans([Final answer])`,
            `class Call,Stop,Ans hub
    class Tok,Time grp1
    class Halt grp2`
          ),
        },
      ],
    },
    {
      id: "how-they-fail",
      level: "advanced",
      title: "How reasoning models fail",
      body: [
        "Now that you understand the simple split, look at failures. The first is thinking after the tool already answered. Detect it: if the last observation is a complete lookup, the next move should be a final answer from the fast path. Do not escalate.",
        "The second is a silent long think. Users refresh and send a second ticket. Now you have two thinks and maybe two writes. Show a wait state. Deduplicate the ticket id.",
        "The third is using think to paper over missing tools. The model will produce a plausible policy from training. That is a hallucination with extra latency. Add the tool or retrieve the policy. Then think if you still need to.",
        "The fourth is averaging quality across easy and hard tickets. The easy ones got worse (slower, costlier) and the hard ones got better. Split the eval. You are not allowed to buy hard-ticket gains with easy-ticket pain unless you meant to.",
        "The fifth is uncapped retries. Cap hit, retry, cap hit, retry. One named halt, then a human. The model will not 'almost' finish if you give it one more minute forever.",
      ],
    },
    {
      id: "production-judgment",
      level: "advanced",
      title: "Production judgment: budget the think",
      body: [
        "This approach is useful when a slice of work is multi-step and the fast model fails that slice on a labelled set. You might avoid it as a default for chat, retrieve-and-answer, and classification. Those jobs want a fast model and good tools.",
        "Trade-offs: quality on hard items versus latency, cost, and operational complexity. Hosted reasoning APIs also change: hidden scratch, different tool-calling, different refusal behavior. Test the product you will call, not a blog about the family.",
        "o1, o3, DeepSeek-R1 and the rest are not interchangeable. They differ on how much scratch they use, whether you can see it, how they call tools, and price. Pick per job, with a cap, on your eval set.",
        "A good production rule: fast by default, reason by route or escalate, cap always, human on money when the cap hits. That rule would have kept Saturday's queue moving and kept the policy exceptions.",
        "The learner who can teach this now says: thinking tokens are a budget. I spend them where scratch paper helps. I do not spend them on a lookup I already finished.",
      ],
      codes: [
        {
          title: "cap.py — any meter can halt",
          language: "python",
          code: `def guarded(prompt: str, reason, think_limit: int, seconds: int) -> str:
    out = reason(prompt, think_tokens=think_limit, seconds=seconds)
    if out.get("halt") == "think_budget":
        return "could not finish in budget; a human will take this"
    return out["final"]`,
        },
      ],
    },
  ],

  workedExample: {
    title: "Order status versus a policy exception",
    setup:
      "Ticket A: 'Has order 88213 shipped?' Tool returns shipped on Tuesday. Ticket B: a refund that collides with two policies and a partial prior refund. A team pointed both at a reasoning model with no cap.",
    walkthrough: [
      "Step 1 — Understand the problem. A is a lookup. B needs scratch. One model for both froze the queue.",
      "Step 2 — Identify the relevant concept. Route and cap. Thinking tokens are a budget.",
      "Step 3 — Build the simplest solution. A goes to a fast model plus lookup. B goes to a reasoning model with 2k think tokens and 30 seconds.",
      "Step 4 — Improve it. Escalate: try fast on B, checker fails, then reason. Most B-like tickets may still be fast if the policy is a table lookup.",
      "Step 5 — Handle a failure. If B hits the cap, hand to a human. Do not retry with 8k tokens in a loop.",
      "Step 6 — Production version. Two meters in logs. Eval split by ticket kind. Raw scratch never shown. Deduplicate if the user refreshes.",
    ],
    result:
      "Status tickets answer in seconds. Policy exceptions may think, with a named halt. Saturday no longer bills like a research lab.",
  },

  practice: {
    title: "Stop thinking about a lookup",
    task:
      "Every support ticket currently goes to a reasoning model. p50 latency is 40 seconds. Half the tickets are order status. Design the routing and caps. Say what the user sees when a hard ticket hits the cap.",
    hint:
      "Name the fast path. Ask when escalate is better than default think. Ask which two meters you log.",
    solution:
      "Expected reasoning: lookups should not buy scratch paper.\n\nSolution: route status and greetings to a fast model with tools. Policy and math go to reason with a think-token cap and a wall clock, or escalate after a checker fails. Cap-hit on money goes to a human with an honest message. Log think tokens and seconds. Do not stream scratch.\n\nWhy it works: spend follows difficulty.\n\nCommon wrong approach: raise the cap globally because a few hard tickets timed out.",
  },

  takeaways: [
    "A reasoning model spends extra tokens on scratch work before it answers. Those tokens cost time and money.",
    "Scratch paper helps multi-step problems. It does not help a lookup whose tool result is already the answer.",
    "You own the budget: thinking-token caps and wall-clock limits. The model will not always volunteer to stop.",
    "Escalate after a cheap miss. Do not default every ticket to think.",
    "Fetch facts first, then think. Thinking about a missing fact invents one, slowly.",
    "Split eval by easy versus hard. An average can hide a frozen queue.",
  ],

  mistakes: [
    "Mistake: put a reasoning model on every ticket. Why people make it: hard tickets got better in a demo. What actually happens: lookups freeze the queue. Better approach: route or escalate.",
    "Mistake: no cap on think tokens. Why people make it: maybe it will finish. What actually happens: four minutes of tax law on a closed refund. Better approach: a hard cap and a named halt.",
    "Mistake: treat 'think step by step' on a fast model as the same thing. Why people make it: both show steps. What actually happens: you have no budget knob and a weaker think phase. Better approach: know which product you called.",
    "Mistake: think before fetch. Why people make it: the model 'should figure it out'. What actually happens: a slow hallucination. Better approach: tools first, then think.",
    "Mistake: stream raw scratch to users. Why people make it: it feels transparent. What actually happens: you leak internals and wrong turns. Better approach: final answer, internal traces.",
    "Mistake: retry cap-hits with a bigger budget forever. Why people make it: one more minute. What actually happens: a loop of spend. Better approach: one halt, then a human on money.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "What is a reasoning model doing with the extra tokens?",
      answer:
        "What they are testing: scratch versus magic.\n\nGood answer: it spends tokens on intermediate work — a private draft — then writes a final answer. You pay and wait for those tokens even if the user never sees them.\n\nWhy that is good: it names the budget.\n\nFollow-up: when would you not use one?",
    },
    {
      difficulty: "medium",
      question: "A reasoning model thought for four minutes after a lookup returned 'already refunded'. What do you change?",
      answer:
        "What they are testing: route, cap, and fetch-first.\n\nGood answer: that ticket should never have thought. Route lookups to a fast model. If a reasoning path remains, cap think tokens and time, and stop when the last observation is already the answer.\n\nWhy that is good: it treats extra think as a bug.\n\nFollow-up: how do you stop a refresh from starting a second think?",
    },
    {
      difficulty: "hard",
      question: "How do you decide whether a reasoning model is worth it on a product?",
      answer:
        "What they are testing: trade-offs.\n\nGood answer: I split an eval into easy and hard. I measure quality, think tokens, latency, and cost on each. I use reason only where the fast model fails enough to pay. I cap every call. I refuse a default swap of the whole fleet.\n\nWhy that is good: the mix is a price, not a vibe.\n\nFollow-up: how would you use one inside an agent loop without multiplying spend?",
    },
  ],

  glossary: [
    {
      term: "Reasoning model",
      meaning:
        "A model trained to spend extra tokens on intermediate work before the final answer. Why it matters: that spend is a budget you must route and cap.",
    },
    {
      term: "Thinking tokens",
      meaning:
        "The tokens used in the scratch phase. Why it matters: you pay for them and wait for them even when they are hidden.",
    },
    {
      term: "Time to first token",
      meaning:
        "How long the user waits before any answer text appears. Why it matters: a long think is silence unless you design a wait state.",
    },
    {
      term: "Escalate",
      meaning:
        "Call the reasoning model only after a fast path fails a check. Why it matters: most tickets never need scratch paper.",
    },
    {
      term: "Think cap",
      meaning:
        "A maximum on thinking tokens or seconds. Why it matters: the model will not always stop on its own.",
    },
    {
      term: "Chain-of-thought",
      meaning:
        "Asking a model to write steps in its output. Why it matters: it is a prompt request, not the same as a trained, capped think phase.",
    },
  ],
};
