import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "smolagents",
  instructor:
    "I am a senior engineer who builds AI products. I still start this topic from zero every time I teach it, because the idea is simple and the failures are not.",
  promise:
    "You will go from never having heard of code-as-action to being able to explain two mouths, wrap a small tool, see why one step can trigger many writes, and say when JSON calls are the safer mouth.",

  story: {
    title: "The script that refunded nineteen times",
    body: [
      "A data team loved a demo where a model wrote six lines of Python that called their functions like ordinary code. No JSON forms. They put that helper in front of lookup_order, list_charges, and issue_refund. They allowed a few extra imports. They set a high step limit because the tutorial's six felt tight. The Python runner lived in the same process as the API, because a container 'would slow the demo'.",
      "A customer wrote: 'refund every duplicate charge on account 441'. The model wrote a reasonable script: list the charges, keep the ones marked duplicate, refund each. A warehouse job had labelled retries as duplicates. Nineteen refunds, one step, one observation that said ok nineteen times. The step budget never saw nineteen steps. There was no write budget. The tool had no idempotency key.",
      "While they rolled that back, a research helper in the same process was asked to summarise environment issues. Someone had allowed the os module so a tool could read a path. The script printed environment variables. That text went back to a hosted model, then into an email, including a database URL.",
      "They did three things that ended the class of bug. issue_refund required one id and a key from the ticket, and refused a second call. The research helper lost network, os, and secrets, and ran in a tight container. Support writes moved to one-call-at-a-time tool forms, so 'refund every' became nineteen visible calls a policy layer could deny as a batch.",
    ],
    moral:
      "Letting the model write the next action as code is powerful inside a jail with a budget. Without both, you have given a language model a promptable interpreter on your box.",
  },

  stages: [
    {
      id: "two-mouths",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Until now, many agents take an action as a small form: a tool name and some arguments. Your code runs that one function and comes back. You can count the calls. You can refuse a single write.",
        "There is another style. You tell the model: you have these functions, write a short Python program that uses them, I will run it and show you what it printed. One turn can filter a list, branch, and call three tools. That is why the demo feels like a promotion.",
        "It is also why one turn can issue nineteen refunds. A step budget that counts model turns will not see those nineteen calls. They happened inside the script.",
        "Hold both mouths on the table. A form is one call. A script is a program. Scripts are wonderful at glue. Forms are wonderful at policy. We will keep both words for the rest of the sitting.",
        "Pause and check. If a script loops over a list and calls issue_refund nineteen times, how many steps did the loop count? One. That is the whole problem.",
        "At this point you should feel the trade. We need a way to let the model write glue, and a way to see each write when money moves.",
      ],
      diagrams: [
        {
          title: "A form is one call. A script is a program.",
          caption: "Policy can see the left. The right needs a jail and a write counter.",
          chart: chart(
            `flowchart LR
    Form[Tool name plus args] --> One[One function]
    Script[Python snippet] --> Many[Many functions]
    One --> Obs1[One result]
    Many --> Obs2[One printout]`,
            `class Form,Script hub
    class One,Many grp1
    class Obs1,Obs2 grp3`
          ),
        },
      ],
    },
    {
      id: "code-as-action",
      level: "beginner",
      title: "What 'code as action' means",
      body: [
        "Hold three roles. The model is a programmer for one snippet. The tools are the only functions that can touch the outside world. The executor is the program that runs the snippet.",
        "The transcript is still a scratchpad: goal, snippet, printout, next snippet. Stop conditions are still your job. Writing Python does not remove the need for a budget. It changes the shape of a step from 'one function' to 'a script'.",
        "Child-level: the helper writes a recipe in Python. Engineer-level: you exec a model-generated program against an allowlisted set of functions. Production-level: that exec happens in a jail with CPU, time, output, and write caps.",
        "This shape wins on research-shaped work. 'Keep rows where year is 2024, fetch two PDFs, return titles' is ugly as a chain of JSON calls and natural as a dozen lines of Python. You pay fewer model turns for the same glue.",
        "This shape loses when each write must be counted. Static reading of the script helps a little. It does not tell you that a list-comprehension will fire nineteen times. If you need to see each write, do not let the write live inside a program the model wrote.",
      ],
      codes: [
        {
          title: "One step, many calls — that is the point and the risk.",
          language: "python",
          code: `# model-written snippet, one step
charges = list_charges("441")
dups = [c for c in charges if c["dup"]]
[issue_refund(c["id"]) for c in dups]  # 19 writes, one observation`,
        },
      ],
    },
    {
      id: "the-jail",
      level: "beginner",
      title: "How the simplest version works: the executor is a jail",
      body: [
        "A jail, in this lesson, is a place that runs untrusted code with tight limits. Untrusted means you did not write it. The model did. Limits mean: only these imports, only these functions, this much time, this much printed text, no secrets in the environment.",
        "The tutorial executor often runs in the same process as your API. That is your laptop, not a jail. If the model is allowed to import os, it can read environment variables. If it can open a network socket, it can send those variables away.",
        "An allowlist is the list of imports you permit. It grows under pressure. Someone adds os 'so a tool can read a path'. Someone adds requests 'for a quick fetch'. The allowlist starts to look like a development machine. That is how the database URL left the building.",
        "Tools should be wrappers, not raw SDKs. The snippet can call issue_refund(id). It cannot import your payments SDK and invent a new method. If the function is not in the wrapper table, it does not exist.",
        "Pause and check. If the snippet prints a secret, that print becomes an observation, and observations go back to the model — often a hosted model. The jail must cap stdout, not only deny imports.",
        "At this point you should understand the simplest version: a script mouth, a tiny import list, wrappers not SDKs, and a budget that counts more than model turns.",
      ],
      diagrams: [
        {
          title: "A step is a script inside a jail",
          caption: "The budget must count more than model turns.",
          chart: chart(
            `flowchart TD
    Goal([User goal]) --> Think[Model writes Python]
    Think --> Jail[Executor jail]
    Jail --> Tools[Wrapped tools]
    Tools --> Out[Capped printout]
    Out --> Think
    Caps[Steps, writes, CPU] -.-> Think
    Caps -.-> Jail
    Think --> Final([Final answer])`,
            `class Goal,Final hub
    class Think,Tools,Out grp1
    class Jail,Caps grp2`
          ),
        },
      ],
    },
    {
      id: "choose-mouth",
      level: "intermediate",
      title: "Two mouths — now the library has a name",
      body: [
        "What are we trying to do? Pick the mouth before the run, from the ticket type, not after the model surprises you.",
        "SmolAgents, from Hugging Face, is a thin library that ships both mouths. CodeAgent uses the script style. ToolCallingAgent uses the form style. Thin is a compliment. It also means the jail and the budget are not extras. They are the product.",
        "ToolCallingAgent emits one name and one argument object. Your gateway can inspect it. Use it when writes exist, when auditors want a list of actions, or when the model is small and writes broken Python.",
        "CodeAgent emits a snippet. Use it when tools are reads, the data needs glue, and you trust the jail. A system can have both, sharing the same read-tool implementations. Do not register write tools on the CodeAgent. Registration is the allowlist. A prompt that says 'please do not loop refunds' is not an allowlist.",
        "A small model may fail CodeAgent and pass ToolCallingAgent, because a JSON schema constrains it and Python does not. Measure both on your examples. Do not assume the script mouth is 'better'.",
      ],
      codes: [
        {
          title: "Same reads, writes only on the form mouth.",
          language: "python",
          code: `from smolagents import CodeAgent, ToolCallingAgent, tool

@tool
def lookup_order(order_id: str) -> dict:
    """Return one order. Read only."""
    return orders.get(order_id)


def make_agent(kind: str):
    tools = [lookup_order]
    if kind == "research":
        return CodeAgent(tools=tools, max_steps=6)
    return ToolCallingAgent(tools=tools + [issue_refund], max_steps=8)`,
        },
      ],
    },
    {
      id: "smallest-code-agent",
      level: "intermediate",
      title: "The smallest CodeAgent, with a wrapper",
      body: [
        "Here is the smallest version. Two read tools, a low step cap, no extra imports, no write. The model may write Python that calls those two names. The executor should refuse everything else.",
        "Let's understand the wrapper. @tool turns a function into something the prompt can describe. The docstring is the menu text. Keep it short. Name the refusal: 'returns one order, never a list of all customers'.",
        "If you later add a write, put a key inside the wrapper the snippet cannot see: derive it from the ticket sitting on your server, check a ledger, then call payments. The script can ask nineteen times. The ledger says no after one.",
        "Hugging Face's Hub can hand you community tools by name. Treat that like installing a package into your payments process. Read the source. Pin the revision. Run it in the jail. Never hand it a write credential.",
        "Connect this back to least privilege. The script mouth makes a god tool easier to hide, because a language is the point. Your wrappers must stay named capabilities.",
      ],
      codes: [
        {
          title: "A write the script cannot spam.",
          language: "python",
          code: `def issue_refund(charge_id: str) -> str:
    key = f"{ticket_id}:{charge_id}"
    if ledger.seen(key) or ledger.writes_this_run() >= 1:
        return "denied"
    ledger.record(key)
    payments.refund(charge_id, idempotency_key=key)
    return "ok"`,
        },
      ],
    },
    {
      id: "count-writes",
      level: "intermediate",
      title: "How the pieces connect: count more than steps",
      body: [
        "In a real app a route receives a ticket. It chooses the mouth. It starts an executor with an import allowlist, a CPU cap, a two-second timer, and a short stdout cap. It passes wrappers, not SDKs. It stores a run id.",
        "Budgets: model steps, tool writes, milliseconds, printed characters. Any one of them trips a halt. Report the reason. A script that prints a megabyte of JSON is not 'being thorough'. It is blowing the observation back into a hosted model.",
        "Observations go to whoever hosts the model. If that is a vendor, treat stdout as leaving the building. Redact. Cap. Do not print environment variables 'for debugging' inside a snippet the model wrote.",
        "Why an engineer should care: the nineteen refunds were one step. If your dashboard only charts steps, the incident looks quiet. Chart writes.",
        "At this point you should understand the upgrade from the tutorial. The tutorial shows intelligence. Production shows a jail, a ledger, and two mouths.",
      ],
      diagrams: [
        {
          title: "The route picks a mouth",
          caption: "Research gets a jail and read tools. Money gets one visible call at a time.",
          chart: chart(
            `flowchart TD
    Ticket([Ticket]) --> Kind{Writes needed?}
    Kind -->|no| Code[CodeAgent in jail]
    Kind -->|yes| Json[ToolCallingAgent]
    Code --> Reads[Read tools]
    Json --> Writes[Write tools plus ledger]
    Reads --> Out([Answer])
    Writes --> Out`,
            `class Ticket,Out hub
    class Code,Json grp1
    class Kind grp2
    class Reads,Writes grp3`
          ),
        },
      ],
    },
    {
      id: "jail-breaks",
      level: "advanced",
      title: "How the simple jail fails",
      body: [
        "Remember the simple version: two read tools, no extra imports, a step cap. It fails when the allowlist grows, when the executor shares the API process, when Hub tools arrive with their own network calls, and when a write is registered 'just this once'.",
        "In-process execution shares memory. A snippet that can reach os.environ can reach your database URL. A container or a specialised sandbox is the advanced technique. It exists because process memory is a shared house.",
        "Import allowlists fail closed. A missing module should be an error the model can see, not a silent fallback to the host's Python. If you need datetime, add datetime, not *.",
        "Hub tools fail like any dependency. Pin them. Review them. Run them with no write credentials. A community 'search' tool that can also post is a god tool you did not write.",
        "When Python is worse than JSON: weak models, regulated writes, auditors who need one row per action, or a jail you do not yet trust. Use the script mouth when the work is glue on reads and the jail is real.",
      ],
      codes: [
        {
          title: "A jail setting is part of the product.",
          language: "python",
          code: `jail = {
    "imports": ["json", "datetime"],
    "cpu_seconds": 2,
    "stdout_chars": 2000,
    "env": {},          # no secrets
    "network": False,
}`,
        },
      ],
      diagrams: [
        {
          title: "Allowlist versus a laptop",
          caption: "os plus a hosted model is how a URL leaves.",
          chart: chart(
            `flowchart LR
    Snip[Snippet] --> Jail{Import allowed?}
    Jail -->|os| Env[Print environ]
    Env --> Host([Hosted model])
    Jail -->|json only| Ok([Capped printout])`,
            `class Host,Ok hub
    class Snip,Env grp1
    class Jail grp2`
          ),
        },
      ],
    },
    {
      id: "production-split",
      level: "advanced",
      title: "Production: split research from money",
      body: [
        "The production pattern is two agents, one set of read implementations. Research: CodeAgent, Docker or equivalent, 2-second CPU, tiny stdout, no credentials that can write. Support writes: ToolCallingAgent, policy per call, ledger keys.",
        "Do not let the research agent 'just print the env to debug'. Give it a status tool that returns a boolean. The observation is 'db_ok true', not a URL.",
        "Eval both mouths on the same tickets. Watch write counts, not only answer quality. A script that solves a task with one hidden batch of writes is a failing eval even if the user liked the paragraph.",
        "SmolAgents will not feel heavy. Your wrappers should. If a reviewer cannot see the jail settings and the write cap in the pull request, the PR is not done.",
        "You should now be able to teach this: code as action is a script in a jail; forms are for counted writes; never confuse a step budget with a write budget.",
      ],
      diagrams: [
        {
          title: "Two constructors, one service",
          caption: "Research never receives the refund wrapper.",
          chart: chart(
            `flowchart TD
    Svc([API service]) --> Res[Research CodeAgent]
    Svc --> Pay[Support ToolCallingAgent]
    Res --> Jail[Container jail]
    Pay --> Led[(Write ledger)]`,
            `class Svc hub
    class Res,Pay grp1
    class Jail,Led grp3`
          ),
        },
      ],
    },
  ],

  workedExample: {
    title: "Stop 'refund every' from being one quiet step",
    setup:
      "CodeAgent with list_charges and issue_refund, in-process executor, extra imports including os, max_steps 20, no write ledger.",
    walkthrough: [
      "Step 1 — Understand the problem. One snippet can loop writes. The step cap cannot see inside the loop. The process is not a jail.",
      "Step 2 — Identify the relevant concept. Code as action needs a jail and a write budget. The form mouth makes each write visible.",
      "Step 3 — Build the simplest solution. Remove issue_refund from CodeAgent. Keep it only on ToolCallingAgent.",
      "Step 4 — Improve it. issue_refund uses a ticket-plus-charge key and a per-run write cap of 1 or a small number you can defend.",
      "Step 5 — Handle a failure. Drop os and network from the research agent. Run in a container. Cap stdout. Add a boolean status tool instead of printing the environment.",
      "Step 6 — Production version. Route by ticket type. Chart writes. Pin any Hub tool. Never share write credentials with the script mouth.",
    ],
    result:
      "'Refund every' becomes many visible calls or a denial. Research can still write glue Python. Secrets stay out of observations.",
  },

  practice: {
    title: "Pick a mouth for 'summarise these three PDFs'",
    task:
      "A researcher wants a helper that fetches three PDFs, keeps pages that mention 2024, and returns titles. A second helper on the same service can issue refunds. Think about mouths, tool registration, and the executor. What do you ship for the research request?",
    hint:
      "Glue on reads loves a script. The presence of a refund helper on the same service is a registration problem, not a prompt problem. Expected reasoning: CodeAgent with read tools only; refund on a separate form-mouth constructor.",
    solution:
      "CodeAgent with fetch_pdf and a jail: no os, no network except the fetch wrapper, short stdout, low CPU. Do not register issue_refund. The refund helper is a separate ToolCallingAgent constructed only on refund tickets. Why this works: the script cannot name a write that was never registered, and glue stays cheap. Common wrong approach: one CodeAgent with every tool and a prompt that says not to refund.",
  },

  takeaways: [
    "SmolAgents lets the model write the next action as Python, or as an ordinary tool form. That choice is policy, not fashion.",
    "A script can do many tool calls in one step. A step budget alone cannot see those calls.",
    "The executor is a jail only if imports, time, CPU, stdout, and secrets are limited. In-process with os is your laptop.",
    "Register write tools only on ToolCallingAgent when each write must be counted or denied.",
    "Wrappers, not raw SDKs. Hub tools are dependencies: pin, review, no write credentials.",
    "Split research and money. Shared read implementations are fine. Shared write registration is not.",
  ],

  mistakes: [
    "Mistake: treating max_steps as a write cap. Why people make it: the tutorial talks in steps. What actually happens: nineteen refunds in one step. Better approach: a ledger the wrapper owns.",
    "Mistake: LocalPythonExecutor in the API process with a growing import list. Why people make it: Docker feels slow. What actually happens: env vars become observations. Better approach: a real sandbox and a tiny allowlist.",
    "Mistake: one CodeAgent with every tool. Why people make it: one object is simpler. What actually happens: research tickets can pay. Better approach: construct the mouth from the ticket type.",
    "Mistake: asking the prompt not to loop. Why people make it: it is one sentence. What actually happens: a list-comprehension pays anyway. Better approach: do not register the write.",
    "Mistake: printing os.environ to 'debug'. Why people make it: it is familiar. What actually happens: a hosted model and an email see the URL. Better approach: a boolean status tool.",
    "Mistake: pulling a Hub tool and handing it the payments credential. Why people make it: convenience. What actually happens: you installed a stranger into payouts. Better approach: pin, review, read-only creds.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "What is the difference between CodeAgent and ToolCallingAgent?",
      answer:
        "What they are testing: mouth versus policy. Good answer: CodeAgent writes a Python snippet that may call several tools; ToolCallingAgent emits one structured call at a time. Scripts win on glue; forms win on audit and writes. Why that is good: no hype, a usable rule. Follow-up: which mouth for a refund ticket, and why?",
    },
    {
      difficulty: "medium",
      question: "A CodeAgent refunded nineteen charges in one step. What broke, and what do you change?",
      answer:
        "What they are testing: step versus write. Good answer: the script looped a write; the step budget could not see it; the tool lacked a key and a write cap. Move writes to ToolCallingAgent or wrap them in a ledger the executor cannot bypass. Why that is good: it names the counting bug. Follow-up: what else must the jail cap besides steps?",
    },
    {
      difficulty: "hard",
      question: "How would you run SmolAgents in production next to a payments API?",
      answer:
        "What they are testing: isolation. Good answer: two constructors, shared read wrappers, writes only on JSON calling, container executor, import allowlist, stdout cap, no secrets in the sandbox, Hub tools pinned and read-only, dashboards on write counts. Why that is good: it is a harness, not a demo. Follow-up: when would you drop SmolAgents and write a plain ReAct loop?",
    },
  ],

  glossary: [
    {
      term: "Code as action",
      meaning:
        "The model writes a short program that calls tools, instead of one JSON call. Why it matters: one step can do a lot — including a lot of damage.",
    },
    {
      term: "CodeAgent",
      meaning:
        "SmolAgents' script-shaped runner. Why it matters: best for read-side glue inside a jail.",
    },
    {
      term: "ToolCallingAgent",
      meaning:
        "SmolAgents' form-shaped runner: one name, one argument object. Why it matters: policy can see each write.",
    },
    {
      term: "Executor",
      meaning:
        "The component that runs the generated Python. Why it matters: it is either a jail or your laptop.",
    },
    {
      term: "Import allowlist",
      meaning:
        "The modules a snippet may import. Why it matters: os and network are how secrets leak.",
    },
    {
      term: "Write budget",
      meaning:
        "A cap on side-effecting tool calls, separate from model steps. Why it matters: scripts hide loops inside one step.",
    },
  ],
};
