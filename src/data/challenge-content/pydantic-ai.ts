import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "pydantic-ai",
  instructor:
    "I am a senior engineer who builds AI products. I still start this topic from zero every time I teach it, because the idea is simple and the failures are not.",
  promise:
    "You will go from never having heard of typed agents to being able to explain a result type, write a small function-shaped helper, put retries on a leash, and inject per-request data instead of reading globals.",

  story: {
    title: "The extractor that never stopped trying",
    body: [
      "A billing team built a helper that read invoice PDFs and was supposed to return a date, a currency, and a list of line amounts. The demo PDF — one page, four lines, US dollars — came back perfect. The type checker was green.",
      "Monday they pointed it at the real mailbox. A vendor wrote amounts as '1.234,56' and a date as '05.04.26'. The program checked the result against a form and rejected it. The helper asked the model to try again. And again. Each try re-sent the whole PDF plus the error. By the time someone opened the cost dashboard, one mailbox had spent the night arguing with decimal commas.",
      "They 'fixed' it by loosening the form until almost every field was an optional string. Validation passed. The ledger service expected a number of cents and a tax region code. Poetry landed in a numeric column. Finance spent a night with them.",
      "A third bug was quieter. Tools were reading a global 'current customer' that a worker forgot to reset. One run attached another customer's invoice numbers to a draft. The model did not leak. The process did. They passed a small bag of per-request data into every run — tenant connection, mailbox id — and the tools stopped knowing how to see anyone else. Retries dropped to two. Amounts became a careful number field. Cost fell hard.",
    ],
    moral:
      "The form is the product. If validation can loop forever, or if success is 'any string', you have a typed-looking pipe that still dumps garbage — only more expensively.",
  },

  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "A language model likes to write paragraphs. A billing system likes to receive a date, a currency, and a list of line amounts. Those are different jobs. If you take the paragraph and hope, your next service will crash or, worse, store the wrong number quietly.",
        "People then write a second step: 'please return JSON'. JSON is a way to write structured data in text. The model often returns almost-JSON. A trailing comma. A comment. An extra sentence before the brace. Now you are parsing with hope again.",
        "The idea we need is a schema: a description of the shape a value must have. 'There is a field called total_cents, and it is an integer.' If the value does not fit, we reject it. Humans fill paper forms. Programs fill schemas.",
        "That check is the whole sitting. The model tries to fill a form. The program checks. Your application receives an object or an error. A chatbot can be wrong in English. An extractor can be wrong in a type that compiles. We want the second kind of wrong to be impossible to ignore.",
        "Pause and check. If the model writes 'about twelve dollars' into a money field, should the ledger store it? No. The form should fail, and your code should see the failure.",
        "At this point you should understand the fear: a paragraph is not something a program can add. A filled form is.",
      ],
      diagrams: [
        {
          title: "Paragraph versus form",
          caption: "The ledger cannot add a paragraph. It can add an Invoice object.",
          chart: chart(
            `flowchart LR
    Pdf([PDF text]) --> Model[Language model]
    Model --> Prose[A paragraph]
    Prose --> Crash([Ledger breaks])
    Model --> Form[Invoice schema]
    Form --> Obj([Invoice object])`,
            `class Pdf,Crash,Obj hub
    class Model grp1
    class Prose,Form grp2`
          ),
        },
      ],
    },
    {
      id: "agent-as-function",
      level: "beginner",
      title: "Treat the helper like a function",
      body: [
        "In ordinary code you write def extract_invoice(text) -> Invoice. Callers know what comes back. Tests can assert a field. A web route can return the same object.",
        "The bet of a typed agent is that a helper should look like that function. You still have a model in the middle. Callers should not have to read a chat log to know what happened.",
        "You construct the helper with a model name, optional instructions, a result type, and optional dependencies. You call run with the text and those dependencies. You get a result whose output is an instance of the result type.",
        "If you cannot say what type comes back, you do not have an agent you can compose. You have a chatbot you can demo. Beginners leave the result type as a string, then parse the string in the route. That is paying for a library and then doing its job by hand.",
        "When not to use a typed helper as the whole runtime: you need a days-long graph with human pauses, or a five-seat room. You can still use it as the typed node inside those systems. The node returns a model. The graph stores the model.",
      ],
      diagrams: [
        {
          title: "Callers see a function",
          caption: "The chat still happens. It is not the API.",
          chart: chart(
            `flowchart LR
    Route([Web route]) --> Fn[extract_invoice]
    Fn --> Obj([Invoice])
    Fn -.-> Chat[Hidden chat]`,
            `class Route,Obj hub
    class Fn grp1
    class Chat grp2`
          ),
        },
      ],
    },
    {
      id: "schema-is-the-form",
      level: "beginner",
      title: "How the simplest version works: the result type is a form",
      body: [
        "A result type is usually a class that lists fields and their types. Required fields are required. Closed lists become enums — a short list of allowed words, such as currency codes. Money is a number of cents or a decimal, not 'a string that looks like money'.",
        "Field descriptions are tiny prompts. Use them to say what the field is and what it is not. 'total_cents is the grand total in integer cents, not a formatted price.' That sentence prevents a surprising amount of mush.",
        "Unions are for genuine alternatives: Refund or Denial. They are not for laziness: Invoice or str. If you need an escape hatch, add a reason field with an enum, not a parallel universe where the agent can just talk.",
        "Here is a tiny concrete example. Invoice has invoice_date, currency, and lines. If the model omits currency, the form fails. Failure is good. It is a signal, not a personal attack on the model.",
        "Remember this: loosening every field to optional string makes the form always succeed and the ledger always guess. That is how the 'fix' became the second incident.",
        "At this point you should understand the simplest version: write the form as if a stranger will store it, then ask the model to fill that form.",
      ],
      codes: [
        {
          title: "The smallest form a ledger could store.",
          language: "python",
          code: `from decimal import Decimal
from pydantic import BaseModel, Field

class Line(BaseModel):
    description: str = Field(max_length=200)
    amount: Decimal

class Invoice(BaseModel):
    currency: str = Field(pattern=r"^[A-Z]{3}$")
    total: Decimal
    lines: list[Line] = Field(max_length=50)`,
        },
      ],
    },
    {
      id: "run-and-tools",
      level: "intermediate",
      title: "Run the agent — now the library has a name",
      body: [
        "What are we trying to do? Call the helper like a function and get an Invoice. Here is the smallest version. We pass the PDF text in. We get .output back.",
        "Pydantic is a widely used Python library for those forms. You write a class with types. It checks data and gives you a real object — or an error. Pydantic AI puts a model in front of that check: the model tries to fill the form, the library checks, and your application receives an object or an exception.",
        "A tool is an ordinary Python function you register. The model may call it to fetch page text or a vendor default currency. The function should return a small, typed object, not a 40-page dump.",
        "Let's understand the flow. The library asks the model to fill Invoice. If the model needs a tool, the tool runs, the observation comes back, and the model tries the form again. When the object fits, your code proceeds. When it does not, you get an error you can catch.",
        "Do not hide extra behaviour in globals inside tools. If a tool reads DATABASE_URL and a process-wide 'current tenant', two requests on one worker can mix customers. That is the third incident.",
      ],
      codes: [
        {
          title: "Smallest agent: form out, no global tenant.",
          language: "python",
          code: `from dataclasses import dataclass
from pydantic_ai import Agent

@dataclass
class Deps:
    tenant_id: str
    mailbox_id: str

agent = Agent("openai:gpt-4.1-mini", output_type=Invoice, deps_type=Deps)

async def extract(text: str, deps: Deps) -> Invoice:
    result = await agent.run(text, deps=deps)
    return result.output`,
        },
      ],
      diagrams: [
        {
          title: "A function with a model in the middle",
          caption: "Callers see types. The chat log is an implementation detail.",
          chart: chart(
            `flowchart LR
    App([App code]) --> In[Text plus Deps]
    In --> Ag[Agent run]
    Ag --> Tools[Tools]
    Ag --> Val{Form ok?}
    Val -->|no| Retry[Retry]
    Val -->|yes| Out([Invoice])
    Retry --> Cap{Tries left?}
    Cap -->|yes| Ag
    Cap -->|no| Err([Error])`,
            `class App,Out,Err hub
    class In,Ag,Tools grp1
    class Val,Cap grp2
    class Retry grp3`
          ),
        },
      ],
    },
    {
      id: "deps-not-globals",
      level: "intermediate",
      title: "Dependencies are the request, not the process",
      body: [
        "Dependencies, often called deps, are the extra objects a run needs: a database connection for one tenant, a mailbox id, a clock. You pass them into run. Tools receive them through a run context the library provides.",
        "This is ordinary dependency injection — a long name for 'do not hide inputs in globals'. It matters more with models because a worker process stays up and handles many customers. A forgotten context variable is a cross-tenant bug.",
        "Write Deps as a small dataclass. Include only what tools need. If a tool does not need the raw PDF bytes, do not put bytes on Deps. Smaller deps are easier to test: you pass a fake connection.",
        "The run context is how a tool asks 'who am I serving?' without asking the model. The model never types the tenant id. You already learned this as confused-deputy prevention. Here it is a typed argument.",
        "At this point you should understand why the library asks for deps_type. It is not ceremony. It is how the form of the world around the model stays as strict as the form of the answer.",
      ],
      codes: [
        {
          title: "A tool reads deps, not a global.",
          language: "python",
          code: `from pydantic_ai import RunContext

@agent.tool
async def vendor_currency(ctx: RunContext[Deps], vendor_id: str) -> str:
    row = await ctx.deps.db.fetch_vendor(ctx.deps.tenant_id, vendor_id)
    return row.currency`,
        },
      ],
    },
    {
      id: "retries-leash",
      level: "intermediate",
      title: "How the pieces connect: validation retries need a leash",
      body: [
        "When the form fails, feeding the error back to the model is often enough. A message like 'total is not a number: 1.234,56' teaches the next try. A message like 'invalid' does not.",
        "Write your field validators as if the model will read the error, because it will. Say what you got and what you needed. Convert European decimals in a before-validator if that is a known input, rather than asking the model to invent a new format ten times.",
        "Cap retries. The mailbox incident was a default loop meeting a whole mailbox of foreign invoices. Two retries is plenty for a format fix. After that, store the document as needs_human and stop spending.",
        "How this sits in an app: a queue worker calls extract. On success it writes Invoice to the ledger. On ValidationError after the cap it writes a review row. It never leaves the agent running overnight on one PDF.",
        "Why an engineer should care: retries multiply tokens by the size of the input. A PDF in the prompt plus five retries is five PDFs billed. The form is only cheap if failure is rare or failure is short.",
      ],
      codes: [
        {
          title: "Two tries, then a human row. Not a night.",
          language: "python",
          code: `async def extract_or_queue(text: str, deps: Deps) -> Invoice | str:
    try:
        result = await agent.run(text, deps=deps)
        return result.output
    except Exception as err:
        queue.put({"mailbox": deps.mailbox_id, "error": str(err)[:300]})
        return "needs_human"`,
        },
      ],
      diagrams: [
        {
          title: "Retries are a short leash",
          caption: "Each retry re-sends the document. Cap them.",
          chart: chart(
            `flowchart LR
    Try1[Try 1] --> Ok1{Fit?}
    Ok1 -->|yes| Inv([Invoice])
    Ok1 -->|no| Try2[Try 2]
    Try2 --> Ok2{Fit?}
    Ok2 -->|yes| Inv
    Ok2 -->|no| Human([Review queue])`,
            `class Inv,Human hub
    class Try1,Try2 grp1
    class Ok1,Ok2 grp2`
          ),
        },
      ],
    },
    {
      id: "failure-modes",
      level: "advanced",
      title: "How the simple function fails in real traffic",
      body: [
        "Remember the simple version: one form, two retries, deps on the call. Real traffic adds bad dates, scanned images, and workers that reset nothing.",
        "Failure one: infinite or huge retry loops. The advanced move is a budget that includes validation attempts, not only model 'steps'. Log the last error. Do not delete it. You will want it in the review queue.",
        "Failure two: a form that always passes. Optional strings, extra='allow', and a catch-all notes field will absorb every PDF and push the crash downstream. Keep a second, even stricter model for the database if you must, but do not let the agent target the wide one.",
        "Failure three: tools that return novels. The model then copies a sentence into a number field. Return a few fields. Cap lists. The max_length on lines exists because a model asked for 'line items' will invent forty.",
        "Failure four: using this library as a giant multi-agent room. It will let you call other agents. That does not make it a durable graph. If you need pauses across days, put this agent inside that graph as a typed node.",
      ],
      diagrams: [
        {
          title: "Success is an object, failure is a short stop",
          caption: "A review row is a product outcome. A night of retries is a hole in the budget.",
          chart: chart(
            `flowchart TD
    Pdf([Mailbox PDF]) --> Run[Agent run]
    Run --> Ok{Form ok?}
    Ok -->|yes| Led[(Ledger)]
    Ok -->|no| Tries{Retries left?}
    Tries -->|yes| Run
    Tries -->|no| Rev([Human review])`,
            `class Pdf,Rev hub
    class Run,Led grp1
    class Ok,Tries grp2`
          ),
        },
      ],
    },
    {
      id: "production-compose",
      level: "advanced",
      title: "Production: compose, log objects, keep the form honest",
      body: [
        "Log the validated object, not the inner thoughts. Thoughts belong in a restricted trace. The object is what operations will replay. If you cannot rebuild the ledger write from output plus deps, the form is missing a field.",
        "Pin the model name. A quiet model upgrade can start answering from memory instead of calling your vendor tool. Evals on a folder of real PDFs make a swap a decision. No evals, no swap.",
        "Stream text to a UI if you want a friendly progress line. Persist only the object. A streamed 'looks like $12' is not a write. The cousin of the mailbox incident is a UI that says done while the form never passed.",
        "Trade-off: a strict form plus two retries is slower on ugly PDFs and cheaper on the fleet. A loose form is faster to 'succeed' and more expensive in finance time. Pick the first unless the document is truly free-form notes a human will edit anyway.",
        "You should now be able to teach this: write the form as if a stranger will store it, pass deps on every run, leash retries, and never call a string a contract.",
      ],
    },
  ],

  workedExample: {
    title: "Make the invoice extractor a function a ledger can call",
    setup:
      "Agent returns almost-JSON. Defaults retry until money hurts. Tools read a global tenant. Downstream expects cents.",
    walkthrough: [
      "Step 1 — Understand the problem. The application wants an object. The model wants to talk. Retries have no leash. Identity lives in a global.",
      "Step 2 — Identify the relevant concept. A schema is the API. Deps are the request. Validation errors are prompts, but only a few times.",
      "Step 3 — Build the simplest solution. Invoice model with currency and totals. agent.run(text, deps=deps). Catch the error after two tries.",
      "Step 4 — Improve it. Add a before-validator that understands 1.234,56. Put tenant on Deps. Tools use RunContext.",
      "Step 5 — Handle a failure. After the cap, write needs_human with the last validation error. Do not widen fields to optional strings.",
      "Step 6 — Production version. Eval a folder of real PDFs. Log result.output. Pin the model. Never persist streamed prose.",
    ],
    result:
      "A good PDF becomes an Invoice the ledger accepts. A bad PDF becomes a review row after two tries. Workers cannot see another tenant. Cost no longer tracks mailbox size overnight.",
  },

  practice: {
    title: "Design the form for a refund decision",
    task:
      "A helper must decide refund, deny, or escalate. It may look up an order. Think about the result type, the deps, the tool, and what happens when the model returns a reason but no amount. Write the shapes, not a full app.",
    hint:
      "A union of three models is clearer than one model with every field optional. Amount belongs only on refund. Expected reasoning: typed variants, tenant on deps, two retries then escalate.",
    solution:
      "Result: a union Refund | Deny | Escalate, where Refund requires amount_cents and a reason enum, Deny requires a reason, Escalate requires a queue name. Deps: tenant_id, ticket_id, db. Tool: get_order(order_id) using tenant from context. Two validation retries, then escalate. Why this works: callers can match on type, and a refund without an amount cannot pass. Common wrong approach: result_type=str and a second parser, or one model with all optional fields.",
  },

  takeaways: [
    "Pydantic AI treats an agent as a function: inputs in, a typed object out, failures you can catch.",
    "The result type is the API. If success is a string, you do not have a contract.",
    "Field descriptions and validators are prompts the model will read. Write them specifically.",
    "Pass dependencies on every run. Globals on a worker are how tenants mix.",
    "Validation retries help once or twice. Unleashed, they bill the entire document on every try.",
    "Use this as a typed node inside a larger graph if you need long pauses. Do not loosen the form to fake reliability.",
  ],

  mistakes: [
    "Mistake: leaving the result as a string and parsing later. Why people make it: it feels faster. What actually happens: you rebuild the library in the route. Better approach: set the result type.",
    "Mistake: widening every field to optional string. Why people make it: validation errors hurt. What actually happens: the ledger receives poetry. Better approach: keep the form strict and add a human queue.",
    "Mistake: unlimited validation retries. Why people make it: defaults seem fine. What actually happens: one mailbox spends the night. Better approach: two tries, then stop.",
    "Mistake: tools that read a process-wide tenant. Why people make it: context variables are handy. What actually happens: customer A sees customer B. Better approach: Deps on the call.",
    "Mistake: validator errors that say 'invalid'. Why people make it: they were written for humans. What actually happens: the model cannot fix the field. Better approach: say what you got and what you needed.",
    "Mistake: using the agent as a multi-day workflow engine. Why people make it: you can call agents from agents. What actually happens: you miss durable pauses. Better approach: typed node inside a real graph.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "Why would you give an agent a result type instead of asking it for JSON in the prompt?",
      answer:
        "What they are testing: schema as contract. Good answer: the library checks the object, callers share the type, failures are exceptions, and you stop writing a second parser. A prompt that says 'return JSON' still returns almost-JSON. Why that is good: it is practical, not religious. Follow-up: what belongs in a field description?",
    },
    {
      difficulty: "medium",
      question: "Validation retries burned a mailbox overnight. What do you change in the agent and in the form?",
      answer:
        "What they are testing: leash plus honest fields. Good answer: cap retries, write specific errors, parse known formats in validators, and send failures to a human queue. Do not optional-string the form. Why that is good: it keeps the contract and stops the bleed. Follow-up: how do you test this without spending production tokens?",
    },
    {
      difficulty: "hard",
      question: "How do you keep a Pydantic AI tool from acting as a confused deputy across tenants?",
      answer:
        "What they are testing: deps versus model args. Good answer: deps_type carries tenant and connection; tools read RunContext; the model cannot pass tenant_id; workers do not use globals. Why that is good: it connects types to a security story. Follow-up: where would you still use a workflow instead of this agent?",
    },
  ],

  glossary: [
    {
      term: "Schema",
      meaning:
        "A description of the shape a value must have. Why it matters: programs can check it; paragraphs cannot.",
    },
    {
      term: "Result type",
      meaning:
        "The Pydantic model (or similar) an agent must return. Why it matters: this is the API your app actually calls.",
    },
    {
      term: "Pydantic",
      meaning:
        "A Python library that checks data against types and gives you objects or errors. Why it matters: Pydantic AI is that check with a model in front.",
    },
    {
      term: "Deps",
      meaning:
        "Per-run dependencies such as tenant and database. Why it matters: they replace globals that mix customers.",
    },
    {
      term: "Validation retry",
      meaning:
        "Asking the model again with the form error. Why it matters: useful twice, ruinous overnight.",
    },
    {
      term: "Run context",
      meaning:
        "The object tools use to read deps and run metadata. Why it matters: identity stays out of model arguments.",
    },
  ],
};
