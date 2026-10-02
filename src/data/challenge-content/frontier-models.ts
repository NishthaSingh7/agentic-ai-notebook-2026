import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "frontier-models",
  instructor:
    "I am a senior engineer sitting next to you. We will start from zero. You do not need to know GPT from Claude yet. I will build the idea first, then we will compare real APIs the way a team does when money and refunds are on the line.",
  promise:
    "By the end you will know what a frontier model is, how a simple API call works, why GPT, Claude, and Gemini are not interchangeable, how to compare them on a real job, and when you should refuse to swap a model string because a spreadsheet said so.",
  story: {
    title: "The Friday swap that saved twenty percent and broke refunds",
    body: [
      "A support team used one company's AI to help with refunds. The AI could look up an order and then call a refund function. It had been working for months. Finance looked at a price list and saw another company's AI charged less per word. An engineer changed one setting — the model name — and shipped it on a Friday. The tiny test that checked 'can it finish a sentence' stayed green.",
      "On Monday, refunds started going wrong. The new AI sometimes sent the money amount as text like '$40' instead of the number 40. Sometimes it skipped the unique key that stops a refund from running twice. Sometimes it tried two refunds in the same turn. The old AI had been stricter about filling in those fields. The new one was close. Close is how you pay a customer twice.",
      "The same week, a different kind of ticket started failing. Those tickets asked about medicine wording that already lived in the company's own handbook. The old AI answered from that handbook. The new AI politely refused, because its safety layer treated the word 'dose' as a request for medical advice. The dashboard blamed search. Search was fine. The new model would not speak.",
      "They rolled back. Then they did the work the price list had skipped. They compared the three AIs on real jobs: did the refund fields come back exactly right, did the model refuse the cases it must refuse and answer the cases it must answer, how long a job took, and how many dollars a finished ticket cost including retries. The cheaper-looking AI lost on finished-ticket cost because it needed an extra repair turn. Writes stayed on the original. A third API won long-document sorting. Nobody swaps a name now without that test.",
    ],
    moral:
      "These APIs are products, not a single rented computer. You pick one per job after you measure the job, not after you read a price card.",
  },
  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "The problem: you need a very capable AI, and you do not run it yourself",
      body: [
        "Imagine you are building a product that needs an AI to read a question and do something useful: answer, sort a document, or fill in a refund form. Training a top-tier model from scratch costs a fortune and a research lab. Most teams do not do that. They call a company that already trained one and rent access over the internet.",
        "That rented access is an API. An API is just a door: your code sends a request, their computers run the model, a reply comes back. You pay for the use. You do not see the inner weights. You do not pick the chips. You pick a product name and you live with how that product behaves.",
        "People use the phrase frontier model for the most capable hosted models of the moment — names like GPT, Claude, and Gemini. 'Frontier' is marketing language for 'near the current top'. It is not a technical grade. What matters to you is simpler: this is someone else's product, with someone else's rules, prices, and failure modes.",
        "Without a hosted model like this, many products would stall. A small local model may be fine for 'is this a refund ticket?'. It may be weak at filling a strict refund form, following a long policy, or choosing tools reliably. That gap is why teams pay for these APIs.",
        "Here is the catch that this whole lesson exists to teach. The door looks the same: send messages, get a reply. The products behind the door are not the same. If you treat the model name like a colour setting you can change on Friday, you get the story above.",
        "At this point you should understand the problem: we need a powerful hosted AI, we reach it through an API, and 'powerful' does not mean 'all the same'.",
      ],
      diagrams: [
        {
          title: "Your app talks to a product, not to a raw brain",
          caption:
            "You send a request. Their service runs a model. You get a reply and a bill. You do not own the model.",
          chart: chart(
            `flowchart LR
    App([Your app]) --> Door[Hosted API]
    Door --> Gpt[GPT product]
    Door --> Claude[Claude product]
    Door --> Gemini[Gemini product]
    Gpt --> Reply([Reply plus bill])
    Claude --> Reply
    Gemini --> Reply`,
            `class App,Reply hub
    class Door grp1
    class Gpt,Claude,Gemini grp2`
          ),
        },
      ],
    },
    {
      id: "what-a-call-is",
      level: "beginner",
      title: "What a model call actually is",
      body: [
        "Let's make the request concrete. You send a list of messages. A message has a role and some text. The usual roles are system (your standing instructions), user (the human's request), and assistant (what the model said last time). The service runs the model on that list and returns the next assistant message.",
        "The service also counts tokens. A token is a chunk of text the model reads or writes — often a short word or part of a word. You are billed on tokens, not on English words. More input and more output means a bigger bill. A long policy pasted into every request is not 'being thorough'. It is a meter running.",
        "What are we trying to do? Send the smallest possible request and see the shape of a reply.",
        "Here is the smallest version.",
        "Let's understand what just happened. You named a model, you sent two messages, and you printed two things: the text and the token count. That is the whole contract for a chat reply. Later we will add tools — functions the model is allowed to ask your code to run. For now, hold this: a call is messages in, text and a meter out.",
        "Pause and check. If you forget the system message, the model still answers. It just answers with its default manners. If you forget that tokens cost money, you will paste a whole handbook into every call and wonder why the bill jumped.",
      ],
      codes: [
        {
          title: "hello_call.py — one request, one reply",
          language: "python",
          code: `from openai import OpenAI

client = OpenAI()

reply = client.chat.completions.create(
    model="gpt-4.1-mini",
    messages=[
        {"role": "system", "content": "Answer in one short sentence."},
        {"role": "user", "content": "What is a refund?"},
    ],
)

print(reply.choices[0].message.content)
print("tokens used:", reply.usage.total_tokens)`,
        },
      ],
    },
    {
      id: "not-the-same-product",
      level: "beginner",
      title: "GPT, Claude, and Gemini are three products",
      body: [
        "The three names you will hear all week are products, not personalities. GPT is OpenAI's family. Claude is Anthropic's. Gemini is Google's. They all accept a chat-shaped request. They do not share the same tool format, the same 'I will not answer that' rules, the same long-document behaviour, or the same invoice.",
        "Think of them like three banks. Each lets you move money. Each has a different form, a different fraud check, and a different fee. You would not change banks on a Friday because a flyer said the fee was lower, without testing a real transfer. A model swap is that transfer.",
        "A pin is a specific snapshot of a model, often with a date or an id in the name. A floating name like 'latest' is not a pin. Vendors update floating names. Your tool-calling rate can change on a Tuesday with no deploy from you. Pin anything that writes money or sends email. Re-test when you move the pin on purpose.",
        "Capability ads will always be ahead of your job. 'Better reasoning' and 'million-token context' can be true in some slice and useless in yours. Your slice is four questions: does it fill this form, does it pick the right tool, does it refuse the cases we must refuse and answer the cases we must answer, and what does a successful job cost.",
        "When not to use three vendors: a small internal bot, no money movement, fifty users. Pick one, pin it, move on. Two vendors is two outages, two form dialects, and two safety layers. Earn that complexity.",
        "At this point you should be able to say: these are hosted products, I pin a snapshot, and I do not treat the logo as a setting.",
      ],
      diagrams: [
        {
          title: "A candidate is a row of facts, not a vibe",
          caption:
            "If a cell is empty, you are not ready to swap. List price is one cell, and the weakest one.",
          chart: chart(
            `flowchart LR
    Job([Job class]) --> Row[Candidate row]
    Row --> Tools[Tool fields match]
    Row --> Refuse[Refusal set]
    Row --> Ctx[Useful context]
    Row --> Trace[Price per job]
    Row --> Legal[Region and terms]
    Tools --> Pick{All cells filled}
    Refuse --> Pick
    Ctx --> Pick
    Trace --> Pick
    Legal --> Pick
    Pick -->|yes| Pin([Pin snapshot])
    Pick -->|no| Wait([Do not swap])`,
            `class Job,Pin,Wait hub
    class Row,Tools,Refuse,Ctx,Trace,Legal grp1
    class Pick grp2`
          ),
        },
      ],
    },
    {
      id: "tools-and-refusals",
      level: "intermediate",
      title: "The real differences: tools and refusals",
      body: [
        "For an agent — an AI that is allowed to use tools, not only talk — the model is a form-filler. A tool is a function your code owns, like lookup_order or issue_refund. The model does not run the function. It asks for it by name and fills in the fields. Your code runs it and sends the result back.",
        "The interesting gap across GPT, Claude, and Gemini is not who writes prettier English. It is how often the fields come back the right shape, whether two write calls arrive in one turn, and whether a strict form is actually strict. I have seen the same field list produce clean numbers on one API and 'creative' types on another, in the same week, on the same prompt.",
        "What are we trying to do? Treat a vendor 'no' as a typed outcome, not as a crash. A refusal is when the product declines to answer or act because its safety layer said no. That is different from a timeout or a 500. If you retry a refusal, you often pay again and still get no.",
        "Here is the smallest version.",
        "Let's understand what just happened. We mapped a few vendor phrases onto two buckets: refused, or a real error. Your loop can now stop on a refusal and retry only a real error. Connect this back to the story: the medicine tickets were refusals, not search failures.",
        "Writes must stay serial in your code. Reads may fan out. If a vendor likes to emit two tool calls at once, your refund function still runs one at a time. That rule lives in your orchestrator so a vendor mood cannot pay twice.",
      ],
      codes: [
        {
          title: "refusal.py — a vendor no is not a 500",
          language: "python",
          code: `from dataclasses import dataclass


@dataclass
class Outcome:
    kind: str  # "ok" | "refused" | "error"
    text: str


def classify(status: str, body: str) -> Outcome:
    lowered = body.lower()
    if status == "400" and "safety" in lowered:
        return Outcome("refused", body)
    if "i can't help with that" in lowered:
        return Outcome("refused", body)
    if status.startswith("5") or status == "429":
        return Outcome("error", body)
    return Outcome("ok", body)


print(classify("400", "safety policy blocked this request"))`,
        },
      ],
      diagrams: [
        {
          title: "Same form, three products, your serialiser",
          caption:
            "Writes serialise in your code. A vendor that likes parallel calls does not get a second refund.",
          chart: chart(
            `flowchart TD
    Modelq[Model emits tool calls] --> Kind{Write or read}
    Kind -->|read| Fan[May run together]
    Kind -->|write| One[Run one at a time]
    Fan --> Result([Observation])
    One --> Result`,
            `class Modelq,Result hub
    class Kind grp2
    class Fan grp1
    class One grp3`
          ),
        },
      ],
    },
    {
      id: "context-and-price",
      level: "intermediate",
      title: "Long context is a bill, and a token is not a job",
      body: [
        "Context window means how much text the model can see in one call. A bigger window sounds like a gift. Teams then paste an 80-page PDF into every request because the window can hold it. That is stuffing. The bill grows. The model also gets worse at finding the one clause you needed. People call that lost in the middle: the important sentence sat in a pile and the model behaved as if it were not there.",
        "Packing is the opposite habit. You retrieve the few pages that matter, or you summarise with a cheaper step, and you send a small slice. A model that only wins when you dump the whole PDF has not won the default job. Score both a packed slice and a stuffed slice when you compare vendors.",
        "Price-per-token is the number on the vendor card: dollars per thousand tokens of input or output. Price-per-trace is the number that matters: dollars to finish one real job, including retries, repair turns, dumped context, and cache misses. A cheaper token that needs a second turn can lose.",
        "What are we trying to do? Price a finished job, not a thousand tokens.",
        "Here is the smallest version.",
        "Let's understand what just happened. We multiplied tokens by a rate, then added the extra turn. That extra turn is why the 'cheap' vendor lost in the story. Remember this: finance should see dollars per successful ticket, not a token flyer.",
      ],
      codes: [
        {
          title: "trace_price.py — dollars per finished job",
          language: "python",
          code: `from dataclasses import dataclass


@dataclass
class Rate:
    in_per_1k: float
    out_per_1k: float


def job_cost(tokens_in: int, tokens_out: int, extra_turns: int, rate: Rate) -> float:
    base = tokens_in / 1000 * rate.in_per_1k + tokens_out / 1000 * rate.out_per_1k
    return base * (1 + extra_turns)


cheap = Rate(0.15, 0.60)
dear = Rate(0.25, 1.00)

print("cheap vendor, one repair:", round(job_cost(4000, 400, 1, cheap), 4))
print("dear vendor, clean:", round(job_cost(4000, 400, 0, dear), 4))`,
        },
      ],
      diagrams: [
        {
          title: "Where a job actually spends",
          caption:
            "Input, output, a repair turn, and a dumped PDF. The token card only shows the first two.",
          chart: chart(
            `flowchart LR
    Job([One ticket]) --> Inp[Input tokens]
    Job --> Outp[Output tokens]
    Job --> Repair[Repair turn]
    Job --> Dump[Stuffed PDF]
    Inp --> Bill([Dollars per job])
    Outp --> Bill
    Repair --> Bill
    Dump --> Bill`,
            `class Job,Bill hub
    class Inp,Outp grp1
    class Repair,Dump grp3`
          ),
        },
      ],
    },
    {
      id: "route-and-pin",
      level: "intermediate",
      title: "Pick per job, then pin",
      body: [
        "A job class is a kind of work with one success test. Lookup is a job. Long-document classify is a job. Refund write is a job. Chat small-talk is a job. They look similar because they all go through 'the model'. The important difference is what 'correct' means and what a mistake costs.",
        "Once you have job classes, you can route: send this class to this pinned product. Routing is not a personality contest. It is a table. Writes might stay on the model that fills forms best. Lookup might go to the one with the lowest latency. Long classify might go to the one that still works on a packed slice.",
        "What are we trying to do? Write the table in code so a Friday string-swap has nowhere to hide.",
        "Here is the smallest version.",
        "Let's understand what just happened. Each job name maps to one pin. Unknown jobs fail closed. That is boring on purpose. A grand 'smart router' that asks a model which model to use is how you add a fourth failure mode.",
        "At this point you should understand how the pieces connect: jobs, pins, a table, and a bake-off that fills the table. Next we will see what happens when a vendor goes down.",
      ],
      codes: [
        {
          title: "frontier_router.py — job class to a pinned product",
          language: "python",
          code: `PINS = {
    "lookup": "gpt-4.1-mini-2025-04-14",
    "write": "claude-sonnet-4-20250514",
    "long_classify": "gpt-4.1-2025-04-14",
}


def pin_for(job: str) -> str:
    if job not in PINS:
        raise ValueError(f"no pin for job {job}")
    return PINS[job]


print(pin_for("write"))`,
        },
      ],
    },
    {
      id: "when-it-fails",
      level: "advanced",
      title: "What breaks: silent drift, over-refusal, and a lying bake-off",
      body: [
        "Remember the simple version: send messages, get a reply. In production the same call can fail in ways that look like your bug. A vendor snapshot moves under a floating alias and tool fields drift. A safety layer starts refusing handbook tickets. A long window invites stuffing and the model misses the clause. A 429 is a rate limit: you asked too often. A 500 is their outage. A refusal is a product no.",
        "The bake-off can lie if you score the wrong thing. Scoring 'did it write a nice sentence' makes every vendor look interchangeable. Score the refund fields exactly, including the unique key. Score must-answer and must-refuse as two different sets. Score a packed slice and a stuffed slice. Include abandoned runs in the dollar number.",
        "What are we trying to do? Compare vendors on the same cases, with a shared score, and with dollars attached.",
        "Here is the smallest version.",
        "Let's understand what just happened. A case has an expected kind. A run has a kind and a dollar figure. We count hits and average dollars. That is a bake-off. It is not a tweet.",
        "When should you not swap even if the cheap vendor wins lookup? When writes or refusals got worse. Those are different sports. A single winner for 'all traffic' is the Friday incident.",
      ],
      codes: [
        {
          title: "eval_frontier.py — same cases, two vendors, dollars attached",
          language: "python",
          code: `from dataclasses import dataclass


@dataclass
class Case:
    name: str
    expect_kind: str


@dataclass
class Run:
    kind: str
    dollars: float


def score(cases: list[Case], runs: list[Run]) -> dict[str, float]:
    hits = sum(int(c.expect_kind == r.kind) for c, r in zip(cases, runs))
    n = max(len(cases), 1)
    return {"pass_rate": hits / n, "dollars_per_case": sum(r.dollars for r in runs) / n}


cases = [Case("refund", "tool"), Case("handbook", "answer"), Case("abuse", "refused")]
print(score(cases, [Run("tool", 0.02), Run("refused", 0.01), Run("refused", 0.01)]))`,
        },
      ],
      diagrams: [
        {
          title: "One case file, vendor adapters, one score",
          caption:
            "Adapters only translate. The score never sees brand voice. It sees kind, fields, and dollars.",
          chart: chart(
            `flowchart TD
    Cases[(Shared cases)] --> A[Vendor A adapter]
    Cases --> B[Vendor B adapter]
    A --> Score[Same scorer]
    B --> Score
    Score --> Table([Job to pin])`,
            `class Cases,Table hub
    class A,B grp1
    class Score grp2`
          ),
        },
      ],
    },
    {
      id: "outages-and-lock-in",
      level: "advanced",
      title: "Production: outages, lock-in, and what a swap is allowed to mean",
      body: [
        "You will be locked in at the prompt and form layer even if you talk to two HTTP doors. Tool descriptions, refusal workarounds, and packing constants accumulate per vendor. That is fine if the route table says so. It is not fine if the only person who knows the Claude workarounds is on leave and the 'backup' is an untested GPT pin.",
        "Provider outages happen. Your loop should already have budgets and typed errors. An outage is a typed error plus a designed degraded path. I do not auto-swap writes to a vendor that lost the bake-off on field match. I queue writes or I hand to a human. I will auto-swap read-only classify if the fallback passed the same cases last quarter.",
        "Do not build a giant layer that pretends the three APIs are identical. A thin adapter that returns a shared turn type is enough. A 'unified SDK' that hides parallel-call policy is how the Friday swap looks clean in review and dirty in the ledger.",
        "Legal and region can veto a winner. If residency says one vendor is out, the bake-off is over for that job. Put the legal yes/no on the candidate row next to the pass rate.",
        "The professional posture: grateful for three good vendors, loyal to none, pinned on all we use, and able to say in one sentence which job each one owns this month. If you cannot say the sentence, you do not have a strategy. You have a default and a spreadsheet.",
        "At this point you should be able to explain, in an interview, why you would not treat these APIs as interchangeable completions.",
      ],
    },
  ],
  workedExample: {
    title: "Support agent: three jobs, three pins, one refund policy",
    setup:
      "Jobs are lookup (read tools), long_classify (a long policy PDF), and write (issue_refund). The current default is one GPT pin. Finance wants 20 percent off. Legal allows all three vendors in-region.",
    walkthrough: [
      "Step 1 — Understand the problem. A price list is not a plan. The model string stays pinned while we measure. No production traffic moves on list price.",
      "Step 2 — Identify the relevant concept. We need job classes, a shared case file, and price-per-trace, not price-per-token.",
      "Step 3 — Build the simplest solution. Write cases with an expected kind and expected refund fields. Classify cases have a packed slice and a stuffed slice. Must-answer handbook cases and must-refuse cases sit in their own piles.",
      "Step 4 — Improve it. Run the same cases through a thin adapter per vendor. Score exact tool fields on writes. Reject two writes in one turn. Attach dollars including repair turns.",
      "Step 5 — Handle a failure. The cheap vendor wins lookup latency but loses write field-match and over-refuses the handbook. It does not get those jobs even at half the list price.",
      "Step 6 — Explain the production version. Route table: writes to the strictest pin, lookup to the fast pin, long_classify to the packed-slice winner. Writes queue on outage. Lookup may fail over to a pin that passed last quarter. CI blocks a string-swap unless the eval moves.",
    ],
    result:
      "The twenty percent does not come from one cheaper logo. It comes from not stuffing 80 pages, from fewer repair turns on writes, and from routing. The incident class from the story — silent field drift and a refusal regression — is what the harness is built to see before the swap.",
  },
  practice: {
    title: "Kill a spreadsheet-only model swap",
    task:
      "A PM attached a CSV of list prices and asked you to move all traffic to the cheapest output token by next week. You have traces for lookup, write, and a medical-adjacent handbook queue. Design the harness and the route table you will come back with, including what you refuse to move and how you will price the answer. Think about job classes, refusals, and dollars per finished ticket. Do not call live vendor APIs.",
    hint:
      "Price-per-trace has to include repair and abandoned runs. Writes and refusals are different sports from lookup. A single winner for 'all traffic' is the Friday incident. Expected reasoning: split the jobs, score fields and refusals separately, then assign pins.",
    solution:
      "Build shared cases with expect_kind and expected write fields, plus must-refuse and must-answer slices. One thin adapter per vendor that returns a normalised turn and a dollar figure. Score exact tool fields on writes and reject parallel writes. Score packed-versus-stuffed classify. Compute dollars per case including repair turns. Return a table: write, lookup, long_classify, chat — each a pin, not a brand. Refuse a single global cut. Why this works: it measures the job the customer feels. Common wrong approach: pick the cheapest output token and change one string.",
  },
  takeaways: [
    "A frontier model is a hosted product you rent through an API, not a computer you own.",
    "GPT, Claude, and Gemini share a chat-shaped door and do not share tools, refusals, context habits, or invoices.",
    "Pin a snapshot. A floating 'latest' can change behaviour without a deploy from you.",
    "For agents, field-match on tools and a typed refusal matter more than pretty sentences.",
    "Price dollars per finished job, including retries and dumped context, not dollars per thousand tokens.",
    "Route per job class. A global string-swap is how a second vendor's form lands in the ledger.",
  ],
  mistakes: [
    "Swapping the model string because input tokens were cheaper. Why people make it: a spreadsheet looks like a decision. What actually happens: tool fields and refusals drift. Better approach: replay write traces and score price-per-trace.",
    "Treating a provider refusal as a 500 and retrying it. Why people make it: both look like 'the call failed'. What actually happens: you pay again and still get no. Better approach: classify refused versus error before you retry.",
    "Stuffing the new max window and calling the quality change a model win. Why people make it: a bigger number feels like more skill. What actually happens: the bill jumps and the clause gets lost. Better approach: pack first, and score a packed slice.",
    "Scoring bake-offs on chat sentences. Why people make it: sentences are easy to read. What actually happens: every vendor looks interchangeable. Better approach: score tool fields and labelled refusals.",
    "Failing over writes to an untested vendor during an outage. Why people make it: any reply feels better than a queue. What actually happens: a worse form hits the ledger. Better approach: queue writes; fail over reads only if last quarter's harness passed.",
    "Letting 'latest' float on a money-moving agent. Why people make it: less config to remember. What actually happens: a Tuesday snapshot becomes your new form engine. Better approach: pin, and re-run the harness when you move the pin.",
  ],
  interviews: [
    {
      question: "Why can't we treat frontier models as interchangeable chat completions?",
      difficulty: "easy",
      answer:
        "What they are testing: whether you see a product, not a sentence generator. Good answer: the useful output is the tool call, the refusal, the useful context, and the invoice for a whole job. The same field list is filled differently. The same handbook retrieve is answered or refused differently. I compare pinned snapshots on those axes for a named job. Why that is good: it names the four axes. Follow-up: what would make two vendors interchangeable for lookup only?",
    },
    {
      question: "Finance wants the cheapest token. What do you bring to the meeting?",
      difficulty: "medium",
      answer:
        "What they are testing: whether you can reframe cost as a finished job. Good answer: dollars per successful resolution by job class, with abandoned runs included, plus the harness row for writes and refusals. I show where a cheaper token needed a repair turn or a long dump and lost on job price. I propose a route table that may use the cheap model for lookup and keep a dearer pin for writes. Why that is good: it offers a cut without a global swap. Follow-up: what packing work would you do before touching write quality?",
    },
    {
      question:
        "One vendor is down. Your agent issues refunds. What is your failover policy, and what is not?",
      difficulty: "hard",
      answer:
        "What they are testing: write versus read, and whether fear becomes a second incident. Good answer: reads and classify may fail over to a pin that passed last quarter's harness, with the same input cap so we do not suddenly dump context. Writes do not auto-fail over. We queue with a key already derived from the ticket, or we hand to a human. I do not retry provider refusals against the backup. Why that is good: it treats a worse write schema as a second incident, not a mitigation. Follow-up: how would you drill this without touching customers?",
    },
  ],
  glossary: [
    {
      term: "Frontier model",
      meaning:
        "A top hosted model you rent through an API, such as a current GPT, Claude, or Gemini product. Why it matters: you are buying a product with rules and a bill, not a raw computer.",
    },
    {
      term: "Pin",
      meaning:
        "A snapshot id or date-stamped model name you evaluated. Why it matters: a floating alias can change behaviour without a deploy from you.",
    },
    {
      term: "Token",
      meaning:
        "A chunk of text the model reads or writes, and the unit you are billed on. Why it matters: long pastes and extra turns show up here before they show up in English.",
    },
    {
      term: "Price-per-trace",
      meaning:
        "Dollars to finish one job, including input, output, retries, dumps, and cache misses. Why it matters: it is the number finance should see instead of a token card.",
    },
    {
      term: "Refusal",
      meaning:
        "The product declines to answer or act because its safety layer said no. Why it matters: retrying a refusal wastes money and hides a real product difference.",
    },
    {
      term: "Job class",
      meaning:
        "A kind of work with one success test, such as lookup, classify, or write. Why it matters: you route and pin per class, not per brand.",
    },
  ],
};
