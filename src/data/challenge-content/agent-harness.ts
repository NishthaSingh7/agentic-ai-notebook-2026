import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "agent-harness",
  instructor:
    "I teach this from zero. We start with a demo that works on stage and fails as a product. Then we name the boring parts around the model that make a helper safe to run on Monday.",
  promise:
    "You will go from 'we used an SDK' to writing a tiny task ticket, putting policy outside the model, pausing a run you can resume, saying what you roll back when a tool succeeded and the next step failed, and gating a change with a small exam.",

  story: {
    title: "The refund demo that had no owner on Monday",
    body: [
      "A team showed a refund helper in a Friday demo. They had picked a popular agent SDK — a kit that makes the loop faster to write. The loop was real: look up the order, propose a refund, send a confirmation. The recording looked like a product. The repository was a notebook, a system prompt, and three tools pointed at live APIs.",
      "Monday a real ticket arrived. The helper refunded, then crashed before it wrote the confirmation. The customer was refunded and received no email. A second click from the confused customer ran the helper again. The refund tool was not idempotent — it did not recognise 'I already did this' — so a second refund went out. Nobody could pause the graph overnight. Nobody could say which policy had allowed the amount. The SDK had done its job. It had run a loop.",
      "The post-mortem list was boring, which is the point. There was no written ticket of the job: objective, limits, budget, risk. Policy was a sentence in the prompt. Tools were called from inside the loop with no gateway. There was no saved snapshot of the run, so a human could not resume. There was no test that this path still worked after a prompt edit. There was no check of the order status in the real system after the tool — only the model's summary.",
      "They kept the SDK. They built a harness around it: a task form, a policy table, a tool door, a snapshot of state, a small eval suite that must pass before a change ships, and a last step that reads the order instead of trusting the model's 'I refunded'. The loop stayed clever. The product became operable.",
    ],
    moral:
      "A framework runs the loop. A harness decides whether this actor may change the world, how far, how you rewind, and how you know it worked.",
  },

  stages: [
    {
      id: "demo-is-not-product",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Let's start from zero. You can make a helper in an afternoon. Pick a library. Give it a prompt. Give it two tools. Call invoke. On stage, it looks alive. That library is an SDK: a kit that makes the loop faster to write.",
        "A product has to survive a bad Tuesday. Someone will click twice. A tool will succeed and the next line will crash. A new teammate will add a tool and forget a limit. The model will be wrong with confidence. The SDK does not own those problems. Your system around the SDK does.",
        "Why say this out loud? Because teams point at the library name as if it were the architecture. 'We use LangGraph' or 'we use the OpenAI Agents SDK' answers how the loop is written. It does not answer who may refund, how you undo a half-finished run, or how you know a prompt change is safe.",
        "What happens without the around-the-model parts? The Friday story. A clever loop, a double refund, and no owner.",
        "The everyday picture is a power drill versus a workshop. The drill is useful. The workshop has the fence, the goggles, the inventory, and the rule that you do not drill into a live wall. Shipping the drill and calling it a workshop is the demo.",
        "At this point you should understand: the SDK is the drill. We are going to build the workshop, and we will give that workshop a name in the next stage.",
      ],
      diagrams: [
        {
          title: "The model is one box",
          caption:
            "The library speeds up the loop. The rest is why production takes longer than the demo.",
          chart: chart(
            `flowchart TD
    Userq([User]) --> App[Your app]
    App --> Loop[SDK loop]
    Loop --> Modelg[Model]
    Loop --> Tools[Tools]
    Tools --> World([World])`,
            `class Userq,World hub
    class App,Loop grp1
    class Modelg,Tools grp2`
          ),
        },
      ],
    },
    {
      id: "what-a-harness-is",
      level: "beginner",
      title: "What a harness is, in plain language",
      body: [
        "A harness is the set of boring parts around the model that make a helper safe to run. The word comes from 'something you strap on so the animal cannot bolt'. Here the animal is a loop that can call tools.",
        "You can hold six parts in your head. A ticket for the job. A policy that can say no. A door in front of tools. A memory of this run that can be saved. A way to see cost and errors. A test gate before you ship a change. Rollback — how you undo a half-done run — sits next to memory.",
        "Why these? Because each one answers a Monday question. What was this helper trying to do? Was it allowed? Which tool ran? Can we resume? What did it cost? Did we break last week's path? What if the write already happened?",
        "They look similar: the SDK and the harness both 'run the agent'. The important difference is who owns the rules. The SDK owns the loop mechanics. The harness owns permission, limits, and truth.",
        "A tool plug, if you use one, is still not the harness. A plug does not decide whether this user may refund.",
        "At this point you should be able to say: harness equals ticket, policy, tool door, saved state, visibility, tests, and a way to rewind.",
      ],
      diagrams: [
        {
          title: "Six parts you can name",
          caption:
            "If you cannot point at a part in your repo, you do not have it yet.",
          chart: chart(
            `flowchart TD
    Ticket[Ticket] --> Pol[Policy]
    Pol --> Door[Tool door]
    Door --> Snap[Saved state]
    Snap --> See[Traces]
    See --> Test[Exam gate]`,
            `class Ticket hub
    class Pol,Door,Snap,See,Test grp1`
          ),
        },
      ],
    },
    {
      id: "task-ticket",
      level: "beginner",
      title: "How the simplest version works",
      body: [
        "What are we trying to do? Stop starting a loop with only a free-text sentence. A sentence cannot carry limits.",
        "Here is the smallest ticket. Objective: what success looks like. Constraints: what must not happen. Budget: how much money or how many steps. Risk: low, money, or outbound message. Tenant and actor: who this is for.",
        "Let's understand what just happened. The loop now receives a form. Policy can read the risk field without parsing a paragraph. The tracer can attach the ticket id. A human can see what they are approving.",
        "This is not paperwork for its own sake. It is how you keep 'refund remaining capture on order 88213, max 50 dollars, for tenant acme' from turning into 'help the user' with every tool attached.",
        "If a framework wants a string goal, you still keep the form in your code and render a sentence for the model. The form is the source of truth.",
        "At this point you should understand: a typed ticket is the first piece of the harness. Everything else hangs off it.",
      ],
      codes: [
        {
          title: "A ticket, not a vibe",
          language: "python",
          code: `from pydantic import BaseModel
from typing import Literal

class Task(BaseModel):
    objective: str
    constraints: list[str]
    budget_usd: float
    risk: Literal["low", "money", "external_message"]
    tenant: str
    actor: str`,
        },
      ],
    },
    {
      id: "policy-outside",
      level: "intermediate",
      title: "Policy lives outside the model",
      body: [
        "The model is a proposer. It can suggest a tool call. It cannot be the thing that allows the tool call. That sentence is the whole intermediate idea.",
        "Policy is a table or a small engine your code runs: this role, this risk, this amount, this tenant. You already met the tiny version in the guardrails sitting. In the harness, that function is a named organ, not a helper you might forget.",
        "Why outside the prompt? Because a prompt is a request. Requests fail when the document argues back. A table in a pull request can be tested. 'Never refund over 50 dollars' in a prompt cannot.",
        "Keep the SDK loop thin. It thinks, it proposes, it writes scratch notes. Before any tool, it calls your policy, then your gateway. If you hide those inside a lambda in the library, Monday cannot find them.",
        "Pause and check. If the model says the user is a lead, does that change the allow-list? No. The actor field on the ticket came from login. The model does not get to promote itself.",
        "At this point you should understand: policy is code next to the loop, not a paragraph inside it.",
      ],
      codes: [
        {
          title: "The actor comes from login",
          language: "python",
          code: `def may_refund(actor: dict, amount: int) -> bool:
    if actor.get("role") != "lead":
        return False
    return amount <= 50_00`,
        },
      ],
      diagrams: [
        {
          title: "Propose, then ask policy, then maybe run",
          caption:
            "The SDK can sit in the propose box. It should not sit in the policy box.",
          chart: chart(
            `flowchart LR
    Ticket[Task ticket] --> Loop[Loop proposes]
    Loop --> Pol{Policy}
    Pol -->|no| Stop([Deny])
    Pol -->|yes| Gw[Tool gateway]
    Gw --> World([World])`,
            `class Ticket,Stop,World hub
    class Loop,Gw grp1
    class Pol grp2`
          ),
        },
      ],
    },
    {
      id: "gateway-and-memory",
      level: "intermediate",
      title: "The tool door, and a run you can pause",
      body: [
        "The gateway is the one door. You have seen it before. In a harness it is mandatory: every SDK tool, every tool server, every home-grown HTTP call walks through it. No 'just this debug tool' beside the door.",
        "Memory here means the state of this run: the ticket, the plan if you have one, the tool results, the pause flag. Save it so a crash or a human wait does not erase the morning. A checkpointer is just a saved snapshot with a thread id, like saving a game.",
        "They look similar: logs and snapshots both 'remember'. The important difference is that a snapshot can resume. A log can only explain.",
        "Idempotency belongs on write tools. If the run retries, the same refund key must not pay twice. The harness derives the key from the ticket id plus the step, and the gateway enforces it.",
        "In a real app this is often a web server plus a worker plus a database row for the snapshot. That is enough. You do not need a platform brand to own the door and the snapshot.",
        "At this point you should understand: the door prevents bad writes. The snapshot lets you continue after a crash or a human pause.",
      ],
      codes: [
        {
          title: "A snapshot is a saved game",
          language: "python",
          code: `def save(thread_id: str, state: dict, store: dict) -> None:
    store[thread_id] = state

def load(thread_id: str, store: dict) -> dict | None:
    return store.get(thread_id)`,
        },
      ],
    },
    {
      id: "rollback",
      level: "intermediate",
      title: "What if the write already happened?",
      body: [
        "The simple happy path is: tool succeeds, next step succeeds, you are done. The Monday story was: tool succeeded, next step crashed. Now the world is half-changed.",
        "Rollback means you have a planned undo or a planned human. For email, you may not undo; you send a correction or you stop and tell someone. For money, you need a compensating action: a void, a reverse, or a ticket to finance. Hoping the model will 'notice' is not a plan.",
        "What are we trying to do? After each write, record what would undo it, or record that it is irreversible and a human must look.",
        "Read the world after a write. Ask the order service for the status. Do not trust the model's sentence 'I refunded'. The model is a storyteller. The order service is the ground.",
        "Connect this back. Budgets and traces from the observability sitting live here too. If you cannot see the write span, you cannot know what to undo.",
        "At this point you should understand: a harness that cannot rewind a partial write will double-charge the next click.",
      ],
      diagrams: [
        {
          title: "Write, then check the world, then maybe undo",
          caption: "The model's summary is not the order status.",
          chart: chart(
            `flowchart TD
    Write[Write tool] --> World[System of record]
    World --> Read[Read status]
    Read --> Ok{Matches ticket}
    Ok -->|yes| Next[Next step]
    Ok -->|no| Comp[Compensate or human]`,
            `class Write,Comp hub
    class World,Read,Next grp1
    class Ok grp2`
          ),
        },
      ],
    },
    {
      id: "eval-gate",
      level: "advanced",
      title: "No change ships without the small suite",
      body: [
        "Remember the simple ticket. The advanced leak is a prompt or graph edit that feels local and brings last week's bug back. The harness answer is a gate: a set of golden tickets that must still pass.",
        "Golden tickets are fixtures. Each has a goal, allowed tools, forbidden tools, and a must-check on the world. Run them in CI. Fast checks first: did it call refund on a lookup ticket? Did it exceed the budget?",
        "The SDK will not refuse your merge because you broke refunds. Your pipeline must. That is the harness talking, not theatre.",
        "Keep the suite small enough that people run it. Twenty tickets that fail loudly beat two hundred that nobody executes.",
        "Trade-off: a gate slows the first week and saves the third month. Skip it only if the helper cannot act. If it can mail or pay, the gate is part of the product.",
        "At this point you should understand: improvement without a gate is drift. A fuller loop lives in the self-improving sitting.",
      ],
      codes: [
        {
          title: "A tiny path check",
          language: "python",
          code: `def path_ok(tools_used: list[str], spec: dict) -> bool:
    allowed = set(spec["allowed"])
    forbidden = set(spec["forbidden"])
    return set(tools_used) <= allowed and forbidden.isdisjoint(tools_used)`,
        },
      ],
    },
    {
      id: "operate-it",
      level: "advanced",
      title: "Own the door and the traces first",
      body: [
        "Most teams still deploy an ordinary service and a worker. That is fine. Own the ticket, the policy, the gateway, the snapshot, and the traces before you shop for a 'platform'.",
        "Complexity is earned. A workflow with two tools beats a harness nobody can draw. Add a planner when phases appear. Add a second agent when another team owns a waiting job. Do not add them because a slide had more boxes.",
        "Ground truth from the environment stays the last habit. After tools, read the world. After a release, watch budget-halt rate and double-write rate. Those numbers are how you operate, not how you market.",
        "Frameworks implement the loop. You can delete a framework if the harness is yours. You cannot delete the harness and keep the framework's logo as a safety story.",
        "When not to build a big harness. A search-only helper with no writes needs a budget, a trace, and a tenant filter. It does not need rollback theatre.",
        "At this point you can teach the sitting: demo versus product, six organs, ticket, policy outside, door, snapshot, rewind, gate, read the world.",
      ],
      diagrams: [
        {
          title: "The workshop around the drill",
          caption: "Draw this before you add another library.",
          chart: chart(
            `flowchart TD
    App([App]) --> Ticket[Task ticket]
    Ticket --> Loop[SDK loop]
    Loop --> Pol[Policy]
    Pol --> Gw[Tool gateway]
    Gw --> Apis[Tools or APIs]
    Loop --> Mem[Saved state]
    Loop --> Llm[Model]
    Gw --> Audit[(Audit)]
    Eval[Eval gate] -.-> Loop`,
            `class App,Llm hub
    class Ticket,Loop,Mem grp1
    class Pol,Gw,Eval grp2
    class Apis,Audit grp3`
          ),
        },
      ],
    },
  ],

  workedExample: {
    title: "Put a harness around the Friday refund demo",
    setup:
      "Same SDK loop. Tools: lookup_order, issue_refund, send_email. Live APIs. No ticket form, no gateway, no snapshot.",
    walkthrough: [
      "Step 1 — Understand the problem. A crash after refund plus a second click becomes a double pay. The SDK did not prevent that.",
      "Step 2 — Identify the relevant concept. Harness parts: ticket, policy, gateway, snapshot, eval, rewind.",
      "Step 3 — Build the simplest solution. A Task form. Policy denies refund over 50 dollars and for visitors. Gateway is the only caller of issue_refund.",
      "Step 4 — Improve it. Idempotency key from ticket id plus step. Snapshot after each step so a human can resume the email.",
      "Step 5 — Handle a failure or edge case. If email send fails after a refund, record a compensating 'send correction' task and do not rerun refund.",
      "Step 6 — Explain the production version. After refund, read order status from the payments API. CI runs a golden ticket that forbids a second refund on the same key.",
    ],
    result:
      "The loop is still the SDK. Monday can name the policy, resume the email, and prove the double-pay path is closed.",
  },

  practice: {
    title: "A helper that can mail and edit a wiki",
    task:
      "You are asked to 'just use' an agent SDK for an internal helper that can search the wiki, edit a page, and email a team. Problem: list the harness parts you would add before production. Write the Task fields. Say what you check after an edit. Say what the eval gate forbids. Think about: what a second click does, and what the model's 'I edited it' is worth.",
    hint:
      "Edit and email are writes and outbound messages. Expected reasoning: ticket, policy, gateway, snapshot, traces, gate, read-back after edit; send and page id bound; no prompt-only policy.",
    solution:
      "Parts: Task ticket, policy by role, gateway, snapshot with thread id, traces and a budget, eval gate, rollback or human for a bad edit. Task fields: objective, constraints, budget, risk (external_message or write), tenant, actor. After edit, read the page back and compare to the intended patch; do not trust the summary. Gate forbids emailing an address outside the team, editing without a page id from the ticket, and running without a budget. Why this works: a second click cannot invent a destination, and a crash can resume. Common wrong approach: a stronger system prompt and the SDK's default retry around the whole run.",
  },

  takeaways: [
    "An SDK makes the loop fast to write. It does not own refund policy, tenant keys, or a release gate.",
    "A harness is the workshop around the model: ticket, policy, tool door, saved state, visibility, tests, rewind.",
    "Write the job as a form. A sentence cannot carry limits the way fields can.",
    "The model proposes. Policy and the gateway decide. The actor comes from login.",
    "If a write succeeded and the next step failed, you need a planned undo or a human. Read the world, do not trust the summary.",
    "No graph or prompt change ships without a small golden suite. Complexity is earned.",
  ],

  mistakes: [
    "Mistake: call the SDK 'the platform'. Why people make it: the demo was fast. What actually happens: Monday has no owner. Better approach: name the harness parts in your repo.",
    "Mistake: policy only in the system prompt. Why people make it: it is one file. What actually happens: a document argues and wins. Better approach: a table outside the model.",
    "Mistake: call a tool plug the harness. Why people make it: it is another serious acronym. What actually happens: you have a plug and no permission slip. Better approach: gateway plus policy.",
    "Mistake: no snapshot. Why people make it: the run is short in the demo. What actually happens: a crash or a human wait loses the thread. Better approach: save state with a thread id.",
    "Mistake: no compensating action after a partial write. Why people make it: the happy path is clean. What actually happens: a second click double-pays. Better approach: idempotency keys and an undo plan.",
    "Mistake: ship prompt edits without the suite. Why people make it: the new wording looks nicer. What actually happens: last week's refund path returns. Better approach: a CI gate.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "What is an agent harness?",
      answer:
        "What they are testing: the around-the-model system. Good answer: the production control around an agent — task tickets, policy, a tool gateway, durable state, observability, eval gates, and rollback. Frameworks implement the loop. Why that is good: you did not name a vendor. Follow-up: what is not the harness?",
    },
    {
      difficulty: "medium",
      question:
        "A refund tool succeeded and the next step crashed. What should the harness have done?",
      answer:
        "What they are testing: partial writes. Good answer: an idempotency key so a retry does not pay twice, a snapshot so you can resume the next step, a read of order status, and a compensating path or a human. Why that is good: you did not trust the model's story. Follow-up: where does the key come from?",
    },
    {
      difficulty: "hard",
      question: "How do you keep a harness small and still production-ready?",
      answer:
        "What they are testing: earned complexity. Good answer: start with ticket, policy, gateway, traces, and a tiny suite; add snapshots when you need a human pause or crash resume; add planners or extra agents only when the path forces them; read the world after writes. Why that is good: you can draw it. Follow-up: when is a workflow enough instead of an agent?",
    },
  ],

  glossary: [
    {
      term: "SDK",
      meaning:
        "A library that helps you write the model loop faster. Why it matters: speed of writing is not the same as permission to act.",
    },
    {
      term: "Harness",
      meaning:
        "The boring system around the loop: ticket, policy, door, state, visibility, tests, rewind. Why it matters: that is what makes Monday operable.",
    },
    {
      term: "Task ticket",
      meaning:
        "A structured form for one job: goal, limits, budget, risk, tenant, actor. Why it matters: a sentence cannot carry those fields reliably.",
    },
    {
      term: "Gateway",
      meaning:
        "The one door every tool call walks through. Why it matters: a side path makes policy optional.",
    },
    {
      term: "Checkpoint",
      meaning:
        "A saved snapshot of the run you can resume. Why it matters: crashes and human waits need a saved game, not only a log.",
    },
    {
      term: "Compensating action",
      meaning:
        "The planned undo after a write that should not stand alone. Why it matters: the next click will otherwise double the write.",
    },
  ],
};
