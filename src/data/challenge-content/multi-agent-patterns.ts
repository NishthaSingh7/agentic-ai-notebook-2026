import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "multi-agent-patterns",
  instructor:
    "I am a senior engineer who has removed more agents than I have added. I teach teams as ownership, not as a crowd of chatbots.",
  promise:
    "You will go from 'more agents means smarter' to knowing when a second agent is justified, who is allowed to talk to the user, and how they hand work to each other without leaking tools.",

  story: {
    title: "The day two helpers answered the same customer",
    body: [
      "An online shop built what the diagram called a crew: a triager, an orders helper, a refunds helper, a shipping helper, and a writer. Every one of them could write to the customer, because the framework made that the default and the demo looked lively. You could watch specialists 'collaborate' in real time.",
      "A customer asked about a refund on a late order. The refunds helper looked at the dates, saw it was inside thirty days, and wrote: good news, 184 dollars is approved. Four hundred milliseconds later the orders helper, looking at the same order, wrote: this item is final sale and cannot be refunded. Both lines sat in the chat. The customer saved a screenshot of the first one.",
      "That screenshot became a chargeback and an exception finance had to honour, because it was in writing. Two quieter problems were worse. The helpers forwarded each other the entire chat plus their thoughts, so by the fourth hop the prompt was a pile of agents quoting agents. And every helper had every tool, so the shipping helper — whose job was tracking numbers — had issued refunds eleven times that month after a confused handoff.",
      "The fix was not a new framework. They cut it to two. One helper owns the customer chat. A refunds specialist is a callable unit with three tools, no stream, and a small form in and out: order id, yes or no, clause, amount. Cost dropped. Two voices became impossible. Shipping could not move money because it no longer had the tool.",
    ],
    moral:
      "A second agent is an ownership choice. One mouth, small packets, narrow tools — and prove you needed the second one before you add it.",
  },

  stages: [
    {
      id: "do-you-need-two",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "One helper with a clear goal and a short tool list can do a surprising amount of work. Most 'crews' I am asked to look at are that helper, copied five times, with extra places to fail. The default answer to 'should this be multi-agent?' is no.",
        "A second agent is another program that can choose its own next step, often with its own tools and its own context. It is not a second personality in a prompt. If you only split a prompt into five named voices that share one tool bag and one chat, you have theatre. You do not have a team.",
        "Here is a case that does need a split. The program that can read customer emails must not be the program that can post on the public status page. Two processes, two keys. That is a permission boundary. One model with both keys is one leak away from a public post.",
        "Here is a case that does not. 'It will feel more capable if a researcher, a writer, and a critic talk.' You just bought three model calls, three chances to rewrite the user's request, and a harder debug log. Measure the single helper first.",
        "The problem this lesson solves: when one brain is not enough, how do we split work without two mouths, without forwarding novels, and without giving every specialist the refund button.",
        "At this point you should be suspicious of a crew that exists because a tutorial had five boxes. Suspicion is the right starting place.",
      ],
      diagrams: [
        {
          title: "Prove the boundary first",
          caption:
            "Five honest reasons to split. 'It sounds smarter' is not one of them.",
          chart: chart(
            `flowchart TD
    Idea([Want a second agent]) --> Perm{Different keys or permissions?}
    Perm -->|yes| Split[Split]
    Perm -->|no| Tools{Too many tools, bad picks?}
    Tools -->|yes| Split
    Tools -->|no| Ctx{Subtask needs its own huge desk?}
    Ctx -->|yes| Split
    Ctx -->|no| Life{Different team and release?}
    Life -->|yes| Split
    Life -->|no| Single[One helper, better tools]`,
            `class Idea,Split,Single hub
    class Perm,Tools,Ctx,Life grp1`
          ),
        },
      ],
    },
    {
      id: "one-mouth",
      level: "beginner",
      title: "One mouth talks to the user",
      body: [
        "Exactly one agent owns the user channel. It is the only one that writes to the customer, asks questions, or makes promises. Everyone else returns data to that mouth. This rule would have stopped the 184-dollar screenshot.",
        "Why? Because a sentence in a support chat is a commitment. Two writers can make two commitments. Users forgive a slow yes. They do not forgive a yes and a no in the same minute.",
        "Progress still matters. Specialists can emit a small event: 'checking refund rules'. The mouth decides how to say that, or whether to say it. The shipping helper must not have a handle to the chat stream. If it does not have the handle, it cannot speak. Invariants beat conventions.",
        "Clarifying questions are the hard case. The specialist is stuck without an address. The wrong fix is letting it ask. The right fix is a result that says need_input, the mouth asks, and the specialist is called again with the answer filled in. One extra hop. One owner of the conversation.",
        "Child level: one person at the counter, specialists in the back. Engineer level: one component holds the socket. Production level: a test that a specialist emit to the user raises an error.",
        "Connect this back to the story. Two mouths were the default. Changing the default was the fix. Prompts that said 'do not contradict each other' were not.",
      ],
      diagrams: [
        {
          title: "One mouth, many hands",
          caption:
            "Specialists return forms. Only the mouth can reach the user.",
          chart: chart(
            `flowchart TD
    User([Customer]) --> Mouth[User-facing agent]
    Mouth --> Refunds[Refunds specialist]
    Mouth --> Ships[Shipping specialist]
    Refunds -->|form: eligible, amount, clause| Mouth
    Ships -->|form: tracking, eta| Mouth
    Mouth --> User
    Refunds -.->|no stream| Block[Cannot talk to user]
    Ships -.-> Block`,
            `class User,Mouth hub
    class Refunds,Ships grp1
    class Block grp3`
          ),
        },
      ],
    },
    {
      id: "three-shapes",
      level: "beginner",
      title: "Three shapes: supervisor, swarm, handoff",
      body: [
        "Once you truly need more than one, you will meet three common shapes. Learn them as pictures, then we will name them.",
        "Picture one: a manager who never does the job. They read the request, pick one specialist, wait for a form back, then speak to the user or pick again. That manager is a supervisor. Useful when routing is the hard part and specialists are deep.",
        "Picture two: peers that pass a token. Whoever holds the token may act. When they are done, they pass it. That is a swarm or a handoff ring. It feels collaborative. It is easy to ping-pong: A passes to B, B passes to A, nobody finishes.",
        "Picture three: a hard handoff. Ownership moves. After the transfer, the first agent must not keep acting. Think of transferring a phone call. If both stay on the line, you are back to two mouths.",
        "They look similar because several models are involved. The important difference is who may speak and who owns the next turn. Draw that before you pick a framework name.",
        "At this point you should be able to point at a diagram and say: this one has a manager, this one passes a token, this one transfers the call. Next we will put a form on the arrows.",
      ],
      diagrams: [
        {
          title: "Supervisor, token-pass, transfer",
          caption:
            "Same specialists. Different ownership of the next turn.",
          chart: chart(
            `flowchart TD
    Sup([Supervisor]) --> A1[Specialist A]
    Sup --> B1[Specialist B]
    A1 --> Sup
    B1 --> Sup
    Tok([Token holder]) --> A2[A acts]
    A2 --> B2[B acts]
    B2 --> A2
    Own([Owner A]) --> Cut[Transfer]
    Cut --> OwnB([Owner B only])`,
            `class Sup,Tok,Own,OwnB hub
    class A1,B1,A2,B2 grp1
    class Cut grp2`
          ),
        },
      ],
    },
    {
      id: "packets",
      level: "intermediate",
      title: "Hand a form, not a novel",
      body: [
        "When one agent talks to another, do not forward the whole chat plus hidden thoughts. That pile grows, cost grows, and the goal gets paraphrased until the last tool call is about something else.",
        "A packet is a small typed object: what we need, the ids we already know, the question for the specialist, the fields we expect back. It is the same idea as a tool contract, applied to a teammate.",
        "What are we trying to do? Make the refunds specialist callable like a function. Here is the smallest packet.",
        "Let's understand what just happened. The specialist never sees the customer's jokes or the manager's doubts. It sees an order id and a question. It returns eligibility, a clause, and an amount. The mouth turns that into English. If the form is invalid, the call failed — you do not parse a paragraph for a maybe.",
        "Packets also make tests possible. You can write: given this order, the specialist returns eligible false and clause final_sale. You cannot write that test against a 40,000-token transcript of agents chatting.",
      ],
      codes: [
        {
          title: "A packet in, a packet out",
          language: "python",
          code: `from dataclasses import dataclass

@dataclass
class RefundAsk:
    order_id: str
    question: str  # "eligible for refund?"

@dataclass
class RefundReply:
    eligible: bool
    clause: str
    amount_cents: int | None
    need_input: str | None = None

def refunds_specialist(ask: RefundAsk) -> RefundReply:
    order = db.order(ask.order_id)
    if order.final_sale:
        return RefundReply(False, "final_sale", None)
    return RefundReply(True, "30_day", order.amount_cents)`,
        },
      ],
    },
    {
      id: "tool-isolation",
      level: "intermediate",
      title: "The shipping helper must not move money",
      body: [
        "Give each agent an allow-list of tools. Enforce it in the gateway you already know from the tool-contracts lesson. The model asking is not enough. The registry must refuse.",
        "Credentials split the same way. The refunds specialist's key can write credits. The shipping specialist's key can read a carrier API. If they share a key, the allow-list is a comment.",
        "Log denials. A specialist reaching for a tool it should not have is a design smell: the packet was too vague, or you should not have split. Silent denials look like model stupidity.",
        "What are we trying to do? Make the wrong tool un-callable. Here is the smallest check.",
        "Let's understand what just happened. Shipping plus issue_refund is a deny, recorded. In the story, that deny did not exist, so eleven refunds did.",
      ],
      codes: [
        {
          title: "Allow-lists at the gateway",
          language: "python",
          code: `ALLOW = {
    "mouth": {"talk_to_user", "call_refunds", "call_shipping"},
    "refunds": {"lookup_order", "issue_refund", "lookup_policy"},
    "shipping": {"lookup_tracking"},
}

def run_tool(agent: str, name: str, args: dict, session) -> dict:
    if name not in ALLOW[agent]:
        log.deny(agent, name)
        return {"ok": False, "code": "denied", "retryable": False}
    return gateway(name, args, session)`,
        },
      ],
      diagrams: [
        {
          title: "Tools stop at the role",
          caption:
            "A denied call is a successful safety check, not a failed model.",
          chart: chart(
            `flowchart TD
    Ship[Shipping specialist] --> Want[Wants issue_refund]
    Want --> Gate{On shipping allow-list?}
    Gate -->|no| Deny([Deny and log])
    Gate -->|yes| Run[Would run]
    Ref[Refunds specialist] --> Ok[issue_refund allowed]
    Ok --> Money[(Ledger)]`,
            `class Ship,Ref,Deny hub
    class Want,Ok grp1
    class Gate grp2
    class Money grp3`
          ),
        },
      ],
    },
    {
      id: "supervisor-budget",
      level: "intermediate",
      title: "A manager who can stop",
      body: [
        "A supervisor is a loop. Pick a specialist, wait, read the form, pick again or answer the user. That loop needs the same doors as ReAct: a step budget, a no-progress stop, and a final answer.",
        "Routing should be a closed set. The manager picks refunds, shipping, or done — not a free string that might invent a new teammate. Unknown names are errors, not opportunities.",
        "Ping-pong is the multi-agent version of no progress. If the last three packets are the same ask bouncing between two specialists, halt. Nudging 'please coordinate' burns money proving they will not.",
        "Keep a global budget for the whole crew, not a generous budget per agent. Five agents with eight steps each is a forty-step bill and a latency you cannot sell.",
        "At this point you should see the crew as one system: one mouth, packet arrows, allow-lists, one budget. If you cannot draw that, you are not ready to add a sixth agent.",
      ],
      diagrams: [
        {
          title: "Supervisor loop with a global budget",
          caption:
            "The manager may route or finish. Arithmetic may halt. Specialists never speak to the user.",
          chart: chart(
            `flowchart TD
    User([User]) --> Mouth[Supervisor mouth]
    Mouth --> Pick{Pick from a closed list}
    Pick -->|refunds| R[Refunds]
    Pick -->|shipping| S[Shipping]
    Pick -->|done| Answer([Answer])
    R --> Mouth
    S --> Mouth
    Mouth --> Budget{Crew budget left?}
    Budget -->|no| Halt([Halt])
    Budget -->|yes| Pick`,
            `class User,Answer,Halt hub
    class Mouth,R,S grp1
    class Pick,Budget grp2`
          ),
        },
      ],
    },
    {
      id: "handoff-and-a2a",
      level: "advanced",
      title: "When ownership moves, and when you need a network protocol",
      body: [
        "Handoff means the owner changes. Do it like a transaction: there is one owner at a time, you record the transfer, and the old owner cannot act after. An epoch number — a counter that bumps on each transfer — lets you ignore late messages from the previous owner.",
        "If both agents still have the user stream, you did not hand off. You conference-called. That is the story again.",
        "Most teams do not need a network protocol between agents. In-process function calls with packets are enough when one team owns the whole crew. A protocol like A2A starts to matter when the other agent is another company's product: different trust, different uptime, different identity. Until then, a function is a better teammate than a socket.",
        "They look similar because both 'call an agent'. The important difference is the counterparty. Inside your process you share a request id and a debugger. Across companies you share a contract and an incident channel.",
        "Imagine the refunds specialist hangs here. What should the supervisor do? Time out, take the budget hit, tell the user you could not finish. Do not let shipping 'help' by calling issue_refund.",
      ],
      codes: [
        {
          title: "One owner at a time",
          language: "python",
          code: `def handoff(run, to_agent: str) -> None:
    run.epoch += 1
    run.owner = to_agent
    run.stream_handle = None if to_agent != "mouth" else run.stream_handle

def may_act(run, agent: str, epoch: int) -> bool:
    return agent == run.owner and epoch == run.epoch`,
        },
      ],
    },
    {
      id: "eval-the-system",
      level: "advanced",
      title: "The agents passed and the system failed",
      body: [
        "You can unit-test refunds and shipping and still ship two mouths. System evals read the whole trace: who spoke, who called which tool, whether packets were valid, whether the user heard one story.",
        "Assert on seams. Exactly one agent emitted user text. Shipping never called issue_refund. The supervisor did not exceed N hops. The final sentence matches the refunds packet, not a leftover orders opinion.",
        "This is the preview of trajectory evals: judge the path, not only the last token. Multi-agent systems fail on the path even when the last token is unlucky-correct.",
        "When not to go multi-agent: you cannot name the boundary in one paragraph. You cannot name the mouth. You cannot name the packets. Stay at one helper. Add tools. Add memory tiers. Add a graph if you need a pause. Add a second brain last.",
        "The person who can teach this now says: split for permissions, tool count, context, or lifecycle. One mouth. Packets. Allow-lists. One budget. Evaluate the crew, not the personas.",
      ],
      codes: [
        {
          title: "Seam checks on a recorded trace",
          language: "python",
          code: `def check_crew(trace: list[dict]) -> list[str]:
    fails = []
    mouths = {e["agent"] for e in trace if e["kind"] == "user_text"}
    if mouths != {"mouth"}:
        fails.append(f"speakers={mouths}")
    if any(e["agent"] == "shipping" and e["tool"] == "issue_refund" for e in trace):
        fails.append("shipping moved money")
    return fails`,
        },
      ],
    },
  ],

  workedExample: {
    title: "Rebuild the refund crew from five agents to two",
    setup:
      "Triage, orders, refunds, shipping, and writer all can talk. Cost is high. Customers get two answers. Shipping can refund.",
    walkthrough: [
      "Step 1 — Understand the problem. Two mouths and shared tools, not 'not enough specialists'.",
      "Step 2 — Identify the relevant concept. One mouth, a refunds specialist behind a packet, shipping as a read-only specialist if you still need it.",
      "Step 3 — Build the simplest two-agent version. Mouth has talk + call_refunds. Refunds has lookup_order, lookup_policy, issue_refund.",
      "Step 4 — Improve it. Typed RefundAsk / RefundReply. Shipping, if kept, has lookup_tracking only. Global hop budget of six.",
      "Step 5 — Handle a failure. Final-sale packet says eligible false. Mouth says no. There is no second speaker to say yes. A ping-pong of empty packets hits no-progress and halts.",
      "Step 6 — Production. Gateway allow-lists, system evals on traces, no A2A because one team owns both processes — a function call is enough.",
    ],
    result:
      "One voice. Shipping cannot refund. Cost falls below the original single-agent baseline because the novel-forwarding hops are gone.",
  },

  practice: {
    title: "Topology for an incident-response helper",
    task:
      "On-call wants a helper that can read logs, draft a public status sentence, and page a human. Problem: how many agents, who is the mouth, who has which tools. Think about: a public post is a different permission from reading logs.",
    hint:
      "Reading logs and paging may share a trusted internal agent. Public status is a different key. Expected reasoning: two agents or one agent plus a human gate on the public post — not five personas.",
    solution:
      "One mouth for the on-call chat. It can read logs and draft. A separate publisher process (or a human-in-the-loop gate) holds the status-page key. Packets: draft text in, publish receipt out. Why this works: a confused log-reader cannot post. Common wrong approach: researcher, writer, critic, publisher all streaming to Slack — two of them will post.",
  },

  takeaways: [
    "A second agent is justified by a boundary — keys, tool count, context size, or lifecycle — not by a vibe of intelligence.",
    "Exactly one agent speaks to the user. Specialists return forms.",
    "Supervisor, swarm, and handoff differ in who owns the next turn. Draw ownership before you pick a framework.",
    "Packets are typed asks and replies. Forwarding the whole transcript is how goals rot and bills grow.",
    "Tool allow-lists and separate credentials are what stop the shipping helper from issuing refunds.",
    "Evaluate the crew: speakers, hops, and illegal tools. Passing specialist unit tests is not enough.",
  ],

  mistakes: [
    "Mistake: five agents because the tutorial had five. Why people make it: it demos as collaboration. What actually happens: extra hops, rewritten goals, two mouths. Better approach: one helper until you can name the boundary.",
    "Mistake: every agent can stream to the user. Why people make it: default in the framework. What actually happens: two promises, one screenshot. Better approach: one channel handle, tested.",
    "Mistake: forward the full chat between agents. Why people make it: context feels safer. What actually happens: token piles and lost intent. Better approach: a packet with ids and expected fields.",
    "Mistake: one key for the whole crew. Why people make it: simpler secrets. What actually happens: the weakest specialist can do the strongest thing. Better approach: per-role credentials and allow-lists.",
    "Mistake: no global hop budget. Why people make it: each agent has its own small limit. What actually happens: ping-pong until the bill lands. Better approach: one crew budget and a no-progress stop.",
    "Mistake: add a network protocol between two functions in one repo. Why people make it: 'we might scale out'. What actually happens: distributed failure for no counterparty. Better approach: a function call until another organisation owns the other agent.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "When is a second agent justified?",
      answer:
        "What they are testing: the gate. Good answer: different permissions, too many tools, a subtask that needs its own huge context, or a separate lifecycle — and you can name the single-agent failure the split fixes. Why that is good: it is a paragraph, not a diagram. Follow-up: give a bad reason.",
    },
    {
      difficulty: "medium",
      question: "How do you stop two specialists from both messaging the customer?",
      answer:
        "What they are testing: one mouth. Good answer: only the mouth has the channel; specialists return packets; a test fails if another agent emits user text. Why that is good: structural, not a prompt. Follow-up: how does a specialist ask a clarifying question?",
    },
    {
      difficulty: "hard",
      question: "Your specialists all pass unit tests and customers still get contradictions. What are you missing?",
      answer:
        "What they are testing: system evals. Good answer: traces that assert one speaker, legal tools, packet agreement with the final sentence, and hop limits. Why that is good: the failure is at the seams. Follow-up: what packet field would have prevented the 184-dollar yes?",
    },
  ],

  glossary: [
    {
      term: "Supervisor",
      meaning:
        "An agent that routes work to specialists and talks to the user. Why it matters: routing is centralised, so one mouth is easy to enforce.",
    },
    {
      term: "Handoff",
      meaning:
        "A transfer of ownership so only the new owner may act. Why it matters: without it, two agents stay on the line.",
    },
    {
      term: "Packet",
      meaning:
        "A small typed message between agents. Why it matters: it replaces forwarding the whole transcript.",
    },
    {
      term: "Tool isolation",
      meaning:
        "Each agent may call only its allow-listed tools, with its own credentials. Why it matters: this is how shipping loses the refund button.",
    },
    {
      term: "One mouth",
      meaning:
        "The rule that a single agent owns user-visible text. Why it matters: two speakers can make two promises.",
    },
    {
      term: "Ping-pong",
      meaning:
        "Two agents passing the same unfinished work back and forth. Why it matters: it is the multi-agent form of a loop with no progress.",
    },
  ],
};
