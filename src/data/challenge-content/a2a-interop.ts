import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "a2a-interop",
  instructor:
    "I teach this from zero. We start with two helpers that need to work together, then learn when that is just a function call and when you need a real task that can wait overnight in another team's system.",
  promise:
    "You will go from 'the agents should talk' to telling a tool from another agent, explaining MCP versus A2A in plain language, walking a task through submitted-working-done, and saying when a protocol is extra costume inside one repo.",

  story: {
    title: "The refund that waited in a hallway that did not exist",
    body: [
      "A support helper could answer product questions. Refunds lived in another team's billing helper. The support team wanted 'the agents to talk'. They wired a web call that sent a paragraph: please refund order 88213. There was no ticket number for the job, no way to ask a question back, and no timeout. The billing helper ran in its own process and sometimes waited for a human until Monday.",
      "On Friday a customer asked for a refund. Support sent the paragraph and told the customer it was done. Billing was still waiting for an approver. The customer saw 'refunded' in chat and 'pending' in the bank. On Monday the approver rejected the amount. Nobody had a shared id to find the same job in both systems. The two traces did not know each other.",
      "A second attempt used a tool protocol the team already knew: expose refund as a function the support helper could call. That worked for a same-second lookup. It did not work for a job that needed to pause, send a PDF, and ask for a missing receipt. A function call wants an answer now. A long job wants a lifecycle.",
      "The rebuild named the work as a task with states: submitted, working, input required, completed, failed. Each side kept the task id. Billing could return 'need the receipt' without support pretending the refund had finished. Identity came from the logged-in customer, not from 'the billing agent said so'. The hallway became a real corridor with doors and a clock.",
    ],
    moral:
      "A tool answers now. Another agent may own a job that waits. If you only send a paragraph, you have a hallway with no doors.",
  },

  stages: [
    {
      id: "two-helpers",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Let's start from zero. Sometimes one helper is not enough. Support knows the ticket. Billing knows how to pay. Research knows the web. Writing knows the outline. You want them to cooperate.",
        "There are two very different kinds of 'ask the other thing'. The first is using a tool: a database, a search, a calculator. The other thing does not have goals of its own. You call it, it returns data or it performs a small action, and you continue.",
        "The second is asking another agent: a program that also thinks, may wait for a human, may send you a file later, and may ask you a question back. It owns a job, not just a function.",
        "Why does the difference matter? Because a tool call is usually short. Another agent may still be working on Monday. If you treat the second like the first, you will tell the user 'done' while the other team is still waiting.",
        "The simplest picture is a shop. Asking the price computer is a tool. Asking the warehouse, which might email you tomorrow, is another team. You would not pretend the warehouse already shipped because you sent a sentence down the hall.",
        "At this point you should understand: 'talking to another agent' is not the same as 'calling a function'. The rest of the sitting is when you need a real protocol for the first, and when you do not.",
      ],
      diagrams: [
        {
          title: "A tool versus another agent",
          caption: "One returns now. The other may own a job that lasts.",
          chart: chart(
            `flowchart LR
    You[Your helper] --> Tool[A tool]
    Tool --> Data[(Data or small action)]
    You --> Other[Their helper]
    Other --> Job[(A job that can wait)]`,
            `class You,Other hub
    class Tool,Data grp1
    class Job grp2`
          ),
        },
      ],
    },
    {
      id: "mcp-vs-a2a",
      level: "beginner",
      title: "Two names you will hear: MCP and A2A",
      body: [
        "We can name the two shapes now that you can see them.",
        "MCP, short for Model Context Protocol, is a common way for a helper to use tools and read files from a server. Think of it as a plug for tools and documents. Your helper is still the one doing the job. The server is a toolbox.",
        "A2A, short for agent-to-agent, is a common way for one helper to hand a job to another helper. Think of it as a shared ticket format: here is a task, here is its state, here are files we produced, here is a question I need you to answer.",
        "They look similar because both are 'protocols between programs'. The important difference is the object. MCP's object is a tool or a document. A2A's object is a task that lives across turns and maybe across companies.",
        "You do not need to memorise the specs today. You need the jobs: MCP when you need a database or a repo. A2A when another agent must own a long piece of work.",
        "At this point you should be able to say: tools versus tasks. Plug versus ticket.",
      ],
      diagrams: [
        {
          title: "Plug versus ticket",
          caption: "MCP fills a toolbox. A2A shares a job record.",
          chart: chart(
            `flowchart LR
    Helper[Your helper] --> Mcp[MCP plug]
    Mcp --> Box[(Tools and files)]
    Helper --> A2a[A2A ticket]
    A2a --> Them[Their helper]`,
            `class Helper,Them hub
    class Mcp,A2a grp2
    class Box grp1`
          ),
        },
      ],
    },
    {
      id: "function-call-enough",
      level: "beginner",
      title: "How the simplest version works",
      body: [
        "If both 'agents' are functions in your own repo, running in the same process, you do not need a network protocol to look modern. A function call with a small data packet is enough.",
        "A packet is just a structured note: the goal, the evidence so far, what 'done' means. That is the beginner version of a handoff. You will see the same idea in other multi-helper sittings.",
        "What happens if you still add A2A inside one process? You add states, timeouts, and discovery for a hallway that is actually a function. You will debug the protocol instead of the refund.",
        "Use a protocol when the other helper lives in another team's service, another company, or another process that must survive overnight. Protocols earn their keep at boundaries.",
        "Connect this back. Stage 1 said the warehouse may email tomorrow. If the warehouse is a function on the next line, it cannot email tomorrow unless you built waiting yourself. Be honest about which world you are in.",
        "At this point you should understand: same repo, same process, same lifetime — function call. Different owner or a job that sleeps — consider A2A.",
      ],
      codes: [
        {
          title: "A packet, not a paragraph, inside one process",
          language: "python",
          code: `from pydantic import BaseModel

class Packet(BaseModel):
    goal: str
    evidence: list[str]
    done_when: str
    owner: str

def handoff(packet: Packet, nxt: str) -> Packet:
    return packet.model_copy(update={"owner": nxt})`,
        },
      ],
    },
    {
      id: "task-lifecycle",
      level: "intermediate",
      title: "A task is a job with a life story",
      body: [
        "When the other helper can wait, you need a task. A task is a job record with an id and a state. The states you will see most often: submitted (we received it), working (we are on it), input required (we need something from you), completed, failed.",
        "Why so many states? Because 'I sent a paragraph' is not a status. The Friday incident told the customer 'completed' while billing was still 'input required' in disguise — a human approval that nobody had named.",
        "What are we trying to do? Allow only legal moves. You can go from working to input required. You cannot go from failed to completed without a new task. That is a state machine: a map of allowed next states.",
        "The task id is the shared ticket number. Support's trace and billing's trace both store it. Monday's approver can find the same job.",
        "Artifacts are the files the job produces: a PDF receipt, a CSV, a draft. They hang off the task. They are not random attachments in a chat that nobody can find later.",
        "At this point you should understand: A2A is heavier than MCP because a task has a life. That life is the point.",
      ],
      codes: [
        {
          title: "Only some next states are legal",
          language: "python",
          code: `LEGAL = {
    "submitted": {"working", "failed"},
    "working": {"input_required", "completed", "failed"},
    "input_required": {"working", "failed"},
}

def can_move(cur: str, nxt: str) -> bool:
    return nxt in LEGAL.get(cur, set())`,
        },
      ],
      diagrams: [
        {
          title: "The life of a task",
          caption:
            "input_required is a real door. Pretending the job is done is how Friday happened.",
          chart: chart(
            `flowchart TD
    Sub[submitted] --> Work[working]
    Work --> Need[input_required]
    Need --> Work
    Work --> Done([completed])
    Work --> Fail([failed])
    Sub --> Fail
    Need --> Fail`,
            `class Sub,Work,Need grp1
    class Done,Fail hub`
          ),
        },
      ],
    },
    {
      id: "agent-cards",
      level: "intermediate",
      title: "How helpers introduce themselves",
      body: [
        "If the other helper is another team's service, you need to discover what it can do. An agent card is a small public description: name, the jobs it accepts, maybe the formats it returns. Think of it as a menu, not as a permission slip.",
        "They look similar: a card and an allow-list both list capabilities. The important difference is who is trusted. A card is advertisement. Your policy still decides whether this user, on this ticket, may start that job.",
        "Do not treat 'the billing agent said it can refund' as authorization. Your gateway still runs. Amounts still have limits. Identity still comes from the logged-in customer.",
        "Cache cards, and pin versions when you can. A menu that changes under you is how a helper starts a job the other side no longer offers.",
        "Pause and check. If a stranger publishes a card that says they can refund, should your support helper call them? No. Discovery is not trust.",
        "At this point you should understand: cards are catalogues. Policy is still yours.",
      ],
      diagrams: [
        {
          title: "A menu is not a key",
          caption: "Read the card, then still run your own policy.",
          chart: chart(
            `flowchart LR
    Card[Agent card] --> Menu[What they claim]
    Menu --> Pol{Your policy}
    Pol -->|no| Deny([Do not start the task])
    Pol -->|yes| Task[Create task]
    Task --> Them[Their helper]`,
            `class Card,Deny hub
    class Menu,Task,Them grp1
    class Pol grp2`
          ),
        },
      ],
    },
    {
      id: "identity-hops",
      level: "intermediate",
      title: "Who is actually asking, across the hop",
      body: [
        "When a job crosses a team, identity must cross too. Identity means: which customer, which tenant, which human approver. 'The support helper asked' is not a person.",
        "Pass a signed or already-authenticated actor, not a sentence in the task description. Billing should refund the logged-in customer's order, not an order id the model copied from a chat.",
        "This is the same bind-the-argument idea as the guardrails sitting. The other agent is a powerful tool. The target of the job is still bound to the session.",
        "Log the delegation. Who started the task, who owns it now, when it expires. If something goes wrong, you need that chain. 'The other agent did it' is not an audit trail.",
        "In a real company this meets ordinary auth: tokens, service accounts, tenant keys. The protocol does not replace those. It carries a reference to them.",
        "At this point you should understand: the hop is a trust boundary. Names on a card do not log anyone in.",
      ],
      codes: [
        {
          title: "The customer crosses the hop, not 'support said so'",
          language: "python",
          code: `def task_actor(session: dict) -> dict:
    return {
        "tenant": session["tenant"],
        "user_id": session["user_id"],
        "order_id": session["ticket_order_id"],
    }`,
        },
      ],
    },
    {
      id: "timeouts-and-trust",
      level: "advanced",
      title: "Waiting needs a clock, and trust needs a cap",
      body: [
        "Remember the simple task states. The advanced failure is getting stuck in input_required. The other helper asked for a receipt. Nobody answered. The customer still thinks you are working.",
        "Every wait needs a clock. When the clock rings, you fail the task or escalate to a human. Silent forever is how Friday's 'pending' became a support pile-up.",
        "Cap what the remote helper may do in your name. A billing task can refund this order up to this amount until this time. It cannot become a general key to the customer's account.",
        "Expire tasks. A leftover 'working' from last month should not suddenly complete and email the customer. Old tickets die.",
        "Trade-off: A2A adds lifecycle you would otherwise invent yourself. It also adds a seam another team can fail. You pay that cost when they own the process. You refuse that cost when they are a function in your repo.",
        "At this point you should understand: a task without a timeout is a hallway with no clock. A remote agent without a cap is a key you handed over.",
      ],
      diagrams: [
        {
          title: "Wait, but not forever",
          caption:
            "input_required without a timer is the Friday incident with extra steps.",
          chart: chart(
            `flowchart TD
    Work[working] --> Need[input_required]
    Need --> Clock{Timer}
    Clock -->|answer arrives| Work
    Clock -->|rings| Esc([Escalate or fail])
    Work --> Done([completed])`,
            `class Work,Need grp1
    class Clock grp2
    class Esc,Done hub`
          ),
        },
      ],
    },
    {
      id: "when-not-a2a",
      level: "advanced",
      title: "Do not implement A2A to look modern",
      body: [
        "MCP can fake coordination if you store extra application state: a row that says 'billing is thinking'. That is fine when you own both sides. A2A puts that lifecycle in the protocol because the other side is not your row.",
        "Pick based on who owns the process. If billing is another team's service, a task protocol earns its keep. If billing is a function you deploy, a packet and a queue you already have may be enough.",
        "Interop is not a substitute for a product owner. Someone still decides the sentence the customer sees. Two helpers that both 'own the user' will send two emails. One mouth, even when two systems work the ticket.",
        "Evaluate the pair, not each helper in a vacuum. A perfect billing agent plus a support helper that marks completed too early is a failing system. The Friday incident was an eval miss as much as a protocol miss.",
        "When not to add more agents. If you can write the steps this quarter, a workflow plus one tool call will beat a pair of helpers that need discovery and cards.",
        "At this point you can teach the sitting: tool versus agent, MCP versus A2A, function calls inside a process, tasks with states, cards as menus, identity across the hop, clocks and caps.",
      ],
      codes: [
        {
          title: "Protocol only at a real boundary",
          language: "python",
          code: `def use_a2a(other_owns_process: bool, job_can_wait: bool) -> bool:
    return other_owns_process and job_can_wait`,
        },
      ],
    },
  ],

  workedExample: {
    title: "Hand a refund to billing without lying to the customer",
    setup:
      "Support helper talks to the user. Billing helper, owned by another team, can refund after a human approval that may wait until Monday.",
    walkthrough: [
      "Step 1 — Understand the problem. A paragraph plus 'done' is a lie if billing is still waiting.",
      "Step 2 — Identify the relevant concept. This is a task, not a tool. The other team owns a job that can pause.",
      "Step 3 — Build the simplest solution. Create a task id. States: submitted, working, input_required, completed, failed. Show the customer the real state.",
      "Step 4 — Improve it. Bind the order id to the logged-in ticket. Attach the receipt as an artifact. Put the task id on both traces.",
      "Step 5 — Handle a failure or edge case. If approval does not arrive in 48 hours, the timer fails the task and support tells the customer the truth.",
      "Step 6 — Explain the production version. Agent card for discovery, your policy still caps amount, expired tasks cannot complete, one mouth to the user.",
    ],
    result:
      "Friday's customer sees 'waiting on approval', not 'refunded'. Monday's approver finds the same task id in both systems.",
  },

  practice: {
    title: "Research helper plus legal helper",
    task:
      "Your research agent gathers sources. Legal, another team's service, must review anything that will be published. Sometimes legal asks for a missing citation and waits two days. Problem: design the boundary. When would you use a function call, MCP, or A2A? What states does the job need? What identity crosses the hop? Think about: who owns the waiting.",
    hint:
      "If legal is a function in your process, you are inventing A2A theatre. If legal is their service, the wait is their process. Expected reasoning: search tools are MCP; review is A2A; input_required plus a two-day timer; publishing user identity crosses.",
    solution:
      "Research's search and retrieve tools are MCP or ordinary APIs. The review is A2A because another team owns a pausing job. Task states: submitted, working, input_required (missing citation), completed, failed, with a two-day timer. Identity: the publishing user and tenant, not 'research said so'. Artifacts: the draft and the citation list. One mouth to the author. Why this works: the wait has a name and a clock, and the user hears the real state. Common wrong approach: research calls a legal tool and treats a timeout as approved, or both agents email the author.",
  },

  takeaways: [
    "A tool returns data or a small action now. Another agent may own a job that waits.",
    "MCP is a plug for tools and documents. A2A is a shared ticket for a task between helpers.",
    "If both sides are functions in one process, a structured packet is enough. Protocols earn their keep at team boundaries.",
    "A task has states and an id both sides can find. 'I sent a paragraph' is not a status.",
    "An agent card is a menu, not a key. Your policy and the logged-in identity still decide.",
    "Every wait needs a clock. Every remote job needs a cap and an expiry.",
  ],

  mistakes: [
    "Mistake: implement A2A inside one process for the resume. Why people make it: the blog post used it. What actually happens: you debug a protocol instead of the job. Better approach: a function and a packet.",
    "Mistake: treat a remote agent card as authorization. Why people make it: the menu lists refund. What actually happens: anyone with a card gets a refund path. Better approach: your policy plus session identity.",
    "Mistake: no timeout on input_required. Why people make it: someone will answer. What actually happens: Friday's pending pile. Better approach: a clock and an escalation.",
    "Mistake: tell the user 'done' when you only submitted. Why people make it: the send felt final. What actually happens: two truths in two systems. Better approach: show the real state.",
    "Mistake: no shared task id. Why people make it: each side has its own logs. What actually happens: Monday cannot find the job. Better approach: one id on both traces.",
    "Mistake: two mouths to the user. Why people make it: both helpers are 'helpful'. What actually happens: two emails. Better approach: one owner of the customer sentence.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "When do you use A2A instead of MCP?",
      answer:
        "What they are testing: tools versus tasks. Good answer: MCP when your helper needs tools or documents; A2A when another agent must own a stateful, multi-turn job with artifacts and pauses. Why that is good: you named the object. Follow-up: what if both agents are in one repo?",
    },
    {
      difficulty: "medium",
      question:
        "A job may wait until Monday for a human. What must the protocol give you?",
      answer:
        "What they are testing: lifecycle. Good answer: a task id, states including input_required, artifacts, a timeout, and identity that crosses the hop. Why that is good: you can tell the user the truth on Friday. Follow-up: what is a legal state move from working?",
    },
    {
      difficulty: "hard",
      question:
        "How do you decide between A2A, MCP plus your own table, and a plain function?",
      answer:
        "What they are testing: ownership and cost. Good answer: function if same process; your own table plus MCP tools if you own the wait; A2A if the other team owns the process and the job can pause. Why that is good: you picked from ownership, not fashion. Follow-up: how do you keep one mouth to the user?",
    },
  ],

  glossary: [
    {
      term: "Tool",
      meaning:
        "A function that returns data or does a small action now. Why it matters: this is not another helper with its own job.",
    },
    {
      term: "MCP",
      meaning:
        "A common plug for tools and documents. Why it matters: it is agent-to-toolbox, not agent-to-agent.",
    },
    {
      term: "A2A",
      meaning:
        "A common way to hand a task to another agent. Why it matters: the object is a job that can wait, not a single function result.",
    },
    {
      term: "Task",
      meaning:
        "A job record with an id and a state. Why it matters: both sides can find the same work on Monday.",
    },
    {
      term: "Agent card",
      meaning:
        "A published menu of what a helper claims it can do. Why it matters: a menu is not permission.",
    },
    {
      term: "input_required",
      meaning:
        "A task state that means 'we need something from you'. Why it matters: this is a pause, not a completion.",
    },
  ],
};
