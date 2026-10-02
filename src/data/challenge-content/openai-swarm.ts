import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "openai-swarm",
  instructor:
    "I am a senior engineer sitting next to you. We start from zero. Don't worry if you have never heard of Swarm. We will build the mental model first — one customer, one voice — and only then look at the tiny teaching library that made handoffs look like function returns.",
  promise:
    "You will be able to explain a handoff in plain English, write a two-helper Swarm-style loop, keep one owner of the customer chat, stop two helpers from bouncing forever, and know why the OpenAI Agents SDK is the grown-up version of the same idea.",
  story: {
    title: "Two replies in one chat bubble",
    body: [
      "A support team wanted their chatbot to feel like a real help desk. Billing questions would go to a billing expert. Shipping questions would go to a shipping expert. They found a small OpenAI sample called Swarm. In the sample, one helper could pass the conversation to another helper. The demo looked like an org chart. They shipped it on a Friday.",
      "On Monday a customer asked about a late order that was also marked final sale. The first helper decided this was a billing problem and passed the chat along. The billing helper wrote: we can refund you 184 dollars. Then it passed the chat to shipping 'just to confirm the delay'. The shipping helper wrote: this order is final sale, no refund. Both sentences appeared in the same chat bubble. The customer screenshot the first sentence and opened a chargeback.",
      "A second bug showed up the same week. The billing helper kept passing to refunds. The refunds helper kept passing back to billing. They went back and forth until the request timed out. Somewhere in that bounce, a refund tool ran once with a made-up confirmation key. When the customer's browser retried, a new empty conversation started, and the refund tool ran again with a different key.",
      "The team did not rewrite the personalities. They made one helper the only one allowed to talk to the customer. Specialists stopped chatting. They returned a small packet of facts: eligible or not, amount, reason. Money-moving code moved out of the helpers and into the server, with a key derived from the ticket id. Later they moved the same design onto the OpenAI Agents SDK. Swarm had taught the pattern. It should not have been the production server.",
    ],
    moral:
      "If two helpers can both speak to the customer, or bounce until a timeout, you do not have a help desk. You have two mouths and no owner.",
  },
  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "The problem: one customer, many jobs",
      body: [
        "Imagine you run a small support inbox. Some messages are about money. Some are about packages. Some are about passwords. A human team handles this by handing a ticket to the right person. The customer still has one conversation. Only one person writes back at a time.",
        "Now replace those humans with AI helpers. You still have the same problem. One model that can do everything sounds convenient, but it also sees every tool: refunds, tracking, password resets. That is a lot of power in one place, and a lot of ways to make the wrong call.",
        "So teams split the work. One helper greets the customer. Another helper looks up billing rules. Another looks up shipping. That split is useful only if someone still owns the conversation. Without an owner, two helpers can both write, or they can keep handing the ticket back and forth.",
        "Here is a tiny concrete example. A customer says: my box is late, please refund me. A billing helper might say yes. A shipping helper might say the item is final sale. Both can be looking at real data. The customer only needs one honest answer. The engineering job is to make sure only one answer is spoken.",
        "At this point you should understand the problem, not the library. We need a way to pass work to a specialist, and a way to make sure the customer still hears one voice. Next we will give that pass a name.",
      ],
      diagrams: [
        {
          title: "One customer, two jobs, one voice",
          caption:
            "The specialist does work. The owner is the only one who writes back.",
          chart: chart(
            `flowchart TD
    Customer([Customer message]) --> Owner[Owner helper]
    Owner --> Job{What kind of job}
    Job -->|money question| Billing[Billing specialist]
    Job -->|box question| Shipping[Shipping specialist]
    Billing --> Packet[Facts only]
    Shipping --> Packet
    Packet --> Owner
    Owner --> Reply([One reply])`,
            `class Customer,Reply hub
    class Owner,Billing,Shipping grp1
    class Job grp2
    class Packet grp3`
          ),
        },
      ],
    },
    {
      id: "what-a-handoff-is",
      level: "beginner",
      title: "What a handoff is, in plain English",
      body: [
        "Think of a receptionist. You walk in and say you have a billing question. The receptionist does not hold a meeting with the billing person while you listen. They walk you to billing, and billing talks next. Or, even better, billing writes a note and the receptionist speaks for the office.",
        "That pass is the idea. One helper is in charge. It decides it cannot finish the job. It passes control to another helper. The second helper now gets the next turn. We call that pass a handoff.",
        "Why the word matters: a handoff is a transfer, not a group chat. In a group chat, everyone can talk. In a transfer, a pointer moves. Only the current helper is active. If you remember nothing else from this sitting, remember that difference.",
        "OpenAI published a tiny teaching library called Swarm to show this pattern. An agent in Swarm is just instructions plus a list of functions it may call. One of those functions is allowed to return another agent. When that happens, the runner makes that other agent current. That is the entire trick.",
        "Swarm was marked experimental. It was a teaching repo, not a production runtime. It has no durable memory, no real server, and no built-in safety rails. We still study it because the idea is clean: a handoff looks like a function return. You can test a function return. You cannot easily test a meeting.",
        "At this point you should be able to say: a handoff moves who is in charge. It does not automatically move who is allowed to talk to the customer. Those are two different decisions, and the story mixed them up.",
      ],
    },
    {
      id: "simplest-swarm",
      level: "beginner",
      title: "The simplest version: two helpers and a return value",
      body: [
        "Let's build the smallest version that still teaches the idea. We need two helpers. One greets the customer. One answers a billing question. The first helper has a function that returns the second helper. That return is the handoff.",
        "What are we trying to do? Show that 'pass to billing' can be a function result, not a speech the model invents.",
        "Here is the smallest version.",
        "Let's understand what just happened. transfer_to_billing does not chat. It does not refund. It returns the billing helper. The runner's only job is: if a function came back with another helper, make that helper current. Everything else is your design.",
        "A beginner instinct is to add five helpers on day one, copied from the sample. Start with two: an owner that talks to the user, and a specialist that does not. Add a third only when you have a real reason — a different permission, or a tool the owner must not see.",
      ],
      codes: [
        {
          title: "two_helpers.py — a handoff is a return value",
          language: "python",
          code: `def transfer_to_billing():
    """Owner calls this when the question is about money."""
    return billing


owner = {"name": "owner", "functions": [transfer_to_billing]}
billing = {"name": "billing", "functions": []}


def step(current, wants_billing: bool):
    if wants_billing:
        current = transfer_to_billing()
    return current["name"]


print(step(owner, True))  # billing`,
        },
      ],
      diagrams: [
        {
          title: "The runner only moves a pointer",
          caption:
            "Swarm is this loop. You still decide who may speak.",
          chart: chart(
            `flowchart TD
    Start([User message]) --> Current[Current helper]
    Current --> Call[Call a function]
    Call --> Result{What came back}
    Result -->|normal data| Speak[Current helper replies]
    Result -->|another helper| Swap[That helper becomes current]
    Swap --> Current
    Speak --> Out([Reply])`,
            `class Start,Out hub
    class Current,Call,Speak,Swap grp1
    class Result grp2`
          ),
        },
      ],
    },
    {
      id: "implement-owner-and-packet",
      level: "intermediate",
      title: "Implement it: one owner, one packet",
      body: [
        "The simple version is enough to move a pointer. It is not enough to keep the customer safe. If the billing helper becomes current and your server streams whatever the current helper says, the customer now has a new mouth. That is how the story got two sentences in one bubble.",
        "What are we trying to do? Keep the owner as the only speaker. The specialist does work and returns facts. Those facts are a packet: a small, typed result such as eligible, amount, and reason.",
        "Here is the smallest version.",
        "Let's understand what just happened. Billing never writes a customer sentence. It returns data. The owner reads the packet and writes one reply. If you cannot do this with Swarm's real runner, you can still do it in your server: buffer specialist tokens and do not flush them to the websocket.",
        "Connect this back to the receptionist. Billing wrote a note. The receptionist spoke. That is the design you want, even if the library implements the note as 'swap the current agent'.",
        "At this point you should understand: a handoff moves control. A packet moves facts. The customer-facing sentence is a third thing, and only the owner should write it.",
      ],
      codes: [
        {
          title: "packet.py — specialists return facts, not chat",
          language: "python",
          code: `from dataclasses import dataclass


@dataclass
class BillingPacket:
    eligible: bool
    amount: int
    reason: str


def decide_refund(order: dict) -> BillingPacket:
    if order.get("final_sale"):
        return BillingPacket(False, 0, "final-sale")
    return BillingPacket(True, order["paid"], "in-policy")


def owner_reply(packet: BillingPacket) -> str:
    if not packet.eligible:
        return f"We cannot refund this order ({packet.reason})."
    return f"A refund of {packet.amount} is allowed."`,
        },
      ],
    },
    {
      id: "when-simple-breaks",
      level: "intermediate",
      title: "When the simple version is not enough",
      body: [
        "The simple owner-plus-packet design breaks in two common ways. Both showed up in the story. Let's name them in everyday language first.",
        "The first failure is two mouths. Two helpers both send text to the customer. They look similar because both are 'the current agent speaking'. The important difference is who is allowed to flush tokens to the chat. Speaking is a product decision. Being current is a runner detail. Split those two variables.",
        "The second failure is a bounce. Helper A passes to helper B. Helper B passes back to A. Nobody is done. The request sits in a loop until a timeout. This happens when each helper's instructions say 'escalate if unsure', and both are unsure.",
        "A third failure hides under the bounce: overlapping tools. If both billing and refunds can call issue_refund, a bounce is not just wasted time. It is money moving twice, often with a fresh confirmation key on retry.",
        "Here is a thought experiment. Imagine the refund tool succeeds on the way through a bounce, then the browser retries. What should happen? The second run must not invent a new key. The server should derive the key from the ticket id, so the ledger sees the same write twice and ignores the second one.",
        "At this point you should understand why 'write better routines' is the wrong fix. A routine in Swarm is just a prompt that describes a procedure. It is not an engine that forces step 3 after step 2. Prompts cannot beat two websockets or two write tools.",
      ],
      diagrams: [
        {
          title: "Two mouths, and a bounce",
          caption:
            "The left path is the chargeback. The right path is the timeout.",
          chart: chart(
            `flowchart TD
    Ticket([Customer ticket]) --> Billing[Billing speaks]
    Ticket --> Shipping[Shipping speaks]
    Billing --> Bubble([Same chat bubble])
    Shipping --> Bubble
    Billing --> Refunds[Pass to refunds]
    Refunds --> Billing`,
            `class Ticket,Bubble hub
    class Billing,Shipping,Refunds grp1`
          ),
        },
      ],
    },
    {
      id: "who-owns-what",
      level: "intermediate",
      title: "How the pieces connect: who owns the user, who owns the tools",
      body: [
        "In a real application the pieces are a route, a runner, a chat channel, and a ledger. Swarm only owns the runner. You own everything else. That is why the library felt finished in a demo and unfinished in production.",
        "Who owns the user? Write it down. My default: the owner never gives away the websocket. Specialists run, return a packet, and hand back. If the runner swaps the current agent internally, your server still treats the owner as the only speaker.",
        "Who owns the tools? Each helper should see only the functions it needs. The owner might have transfer_to_billing and nothing that moves money. Billing might have get_shipment and decide_eligibility. Nobody in the Swarm loop should have issue_refund. The route issues the refund after a packet validates.",
        "They look similar because both are 'functions an agent can call'. The important difference is side effects. A lookup can be retried. A refund cannot. Lookups can live on a specialist. Writes belong in the server, with a key you control.",
        "What are we trying to do? Make tool lists act like permission lists. Here is the smallest version, then we will read it.",
        "Let's understand what just happened. The allow-list is the real security. The prompt that says 'you are a helpful billing specialist' is not. The model cannot call a function that is not on its list.",
      ],
      codes: [
        {
          title: "allowlists.py — tools are permissions",
          language: "python",
          code: `TOOLS = {
    "owner": ["transfer_to_billing"],
    "billing": ["get_shipment", "decide_eligibility"],
}


def can_call(agent: str, tool: str) -> bool:
    return tool in TOOLS.get(agent, [])


def ticket_key(ticket_id: str) -> str:
    return f"refund:{ticket_id}"


assert can_call("owner", "issue_refund") is False
assert ticket_key("88213") == "refund:88213"`,
        },
      ],
      diagrams: [
        {
          title: "A realistic support request",
          caption:
            "The runner swaps helpers. The route owns money. The socket owns the mouth.",
          chart: chart(
            `flowchart LR
    Browser([Browser]) --> Route[HTTP route]
    Route --> Runner[Swarm runner]
    Runner --> Owner[Owner]
    Owner --> Billing[Billing]
    Billing --> Owner
    Owner --> Route
    Route --> Ledger[(Refund ledger)]
    Route --> Socket([Chat socket])`,
            `class Browser,Socket hub
    class Route,Runner grp1
    class Owner,Billing grp2
    class Ledger grp3`
          ),
        },
      ],
    },
    {
      id: "stop-the-bounce",
      level: "advanced",
      title: "Failure modes: bounce loops and a star, not a mesh",
      body: [
        "Remember the simple version: the current helper can return any other helper. That freedom is how a bounce is born. In production we restrict the graph.",
        "The simple version breaks when specialists can transfer to other specialists. Billing to shipping to refunds to billing is a graph you refused to draw. If billing needs shipping facts, billing should call get_shipment. That is a tool. It is not a new mouth.",
        "The advanced technique is a star. The owner may transfer to a specialist. A specialist may transfer only back to the owner. A visited set refuses 'go to billing' a second time in the same ticket. That is not fancy. It is a set and two if-statements.",
        "What are we trying to do? Make illegal handoffs fail in a unit test, before a customer sees them.",
        "Here is the smallest version.",
        "Let's understand what just happened. The star is the topology. The visited set is the memory of this ticket. Together they turn 'escalation theatre' into a closed door. A manager who is also just another Swarm agent is another mouth, not a safety rail.",
      ],
      codes: [
        {
          title: "star.py — only owner to specialist, and back",
          language: "python",
          code: `def may_handoff(current: str, target: str, visited: set[str]) -> bool:
    if current == "owner":
        return target not in visited
    return target == "owner"


visited: set[str] = set()
assert may_handoff("owner", "billing", visited)
visited.add("billing")
assert may_handoff("billing", "owner", visited)
assert may_handoff("billing", "refunds", visited) is False
assert may_handoff("owner", "billing", visited) is False`,
        },
      ],
      diagrams: [
        {
          title: "Star, not mesh",
          caption:
            "Specialist-to-specialist arrows are how Billing and Refunds bounce.",
          chart: chart(
            `flowchart TD
    Owner[Owner] --> Billing[Billing]
    Owner --> Shipping[Shipping]
    Billing --> Owner
    Shipping --> Owner
    Billing -.->|denied| Shipping`,
            `class Owner hub
    class Billing,Shipping grp1`
          ),
        },
      ],
    },
    {
      id: "swarm-then-sdk",
      level: "advanced",
      title: "Production: Swarm taught the pattern, the Agents SDK is the runtime",
      body: [
        "Remember the simple Swarm runner: a current agent, functions, a pointer. That is still the right mental model. The simple version breaks as a server because it has no types on the packet, no input or output checks, no session that survives a retry, and no trace you can open at 2am.",
        "OpenAI's supported descendant is the Agents SDK. The idea is the same: an agent is config, a runner is the loop, a handoff swaps the active agent. What got added is the engineering around the pointer: typed outputs, guardrails, sessions, and traces.",
        "Migrate the ownership model, not the persona count. One owner. Specialists with narrow tool lists. Packets, not chat, from specialists. Writes in the route. If you copy five Swarm personas into five SDK Agent objects and still stream every current agent, you have the same chargeback with nicer class names.",
        "When should you use a handoff at all? When the specialist is a permission boundary: tools the owner must not see, or a different vendor. When should you avoid it? When the path is a known sequence — lookup, decide, pay. That path is a workflow in code. A prompt that lists those steps is not a sequencer. Models skip steps.",
        "At this point you should be able to teach the sitting yourself: Swarm made handoffs look like functions. That was the gift. Production needs one mouth, a star, a ticket key, and a real runtime around the same pointer.",
      ],
    },
  ],
  workedExample: {
    title: "Ticket 88213: late, final-sale, one mouth",
    setup:
      "A customer asks about a late final-sale order. You have an owner and a billing specialist. Shipping facts come from a lookup function, not from a shipping mouth. The chat socket flushes only the owner's final sentence.",
    walkthrough: [
      "Step 1 — Understand the problem. The customer needs one answer: refund or not. Two helpers looking at different facts is fine. Two helpers speaking is not.",
      "Step 2 — Identify the relevant concept. This is a handoff plus a packet. The owner transfers to billing. Billing does not speak.",
      "Step 3 — Build the simplest solution. Owner calls transfer_to_billing. Billing calls get_shipment, then decide_refund, and gets eligible=false, amount=0, reason=final-sale.",
      "Step 4 — Improve it. Billing transfers back to the owner with that packet. The owner writes one sentence. The socket flushes once.",
      "Step 5 — Handle a failure. If billing tries to transfer to shipping, the star rule denies it. If the browser retries, the route uses ticket_key('88213'), so a later credit cannot double-pay.",
      "Step 6 — Explain the production version. The same star later lives in the Agents SDK, with a typed packet, a trace, and an output check that a refund claim must cite a real refund id.",
    ],
    result:
      "One mouth, one packet, no specialist bubble, no mesh. The chargeback class is gone before the SDK migration lands.",
  },
  practice: {
    title: "Keep the handoff, delete the second mouth",
    task:
      "You inherit four Swarm helpers that all stream to the same chat socket. Billing and Refunds bounce on amounts over 100 dollars, and both can call issue_refund. Describe how you would change the system so only one helper can talk to the customer, specialists return packets, writes happen in the route with a ticket key, and Billing cannot transfer to Refunds. Say what you would test first.",
    hint:
      "Think about three separate decisions: who is current, who may flush tokens, and who may call a write tool. Swarm accidentally made the first two the same variable. Also think about a star versus a mesh. A common wrong approach is rewriting the prompts so the helpers 'agree'.",
    solution:
      "Split current from flush: only the owner may send tokens to the customer. Strip issue_refund off every helper; the route issues after a BillingPacket validates, using ticket_key(ticket_id). Restrict handoffs to owner→specialist and specialist→owner, with a visited set so Billing cannot be entered twice in one ticket. Tests: two different names flushing in one turn fails; Billing→Refunds raises; a retry uses the same key. Then sketch the same star on the Agents SDK. Why this works: you removed the two incident classes — two mouths, and a bounce with overlapping writes — without asking the model to be consistent. The common wrong approach is adding 'be consistent with your teammates' to the routines. Consistent prompts cannot beat two websockets.",
  },
  takeaways: [
    "A handoff is a transfer of who is in charge, not a meeting and not automatically a new voice to the customer.",
    "Swarm is a teaching runner: a current agent plus functions that may return another agent. It is not a production control plane.",
    "Specialists should return a small packet of facts. Only one owner should write the customer-facing sentence.",
    "Tool lists are permission lists. Lookups can live on a specialist. Writes belong in the server with a ticket-derived key.",
    "A star — owner to specialist and back — stops bounce loops. Specialist-to-specialist arrows are a mesh you will debug at 2am.",
    "The OpenAI Agents SDK is Swarm grown up. Migrate the ownership model, not the number of personas.",
  ],
  mistakes: [
    "Mistake: streaming every current agent's tokens. Why people make it: the demo does that, and 'current' feels like 'the one who should talk'. What actually happens: two specialists contradict each other in one bubble. Better approach: flush only the owner's final sentence.",
    "Mistake: letting specialists transfer to other specialists. Why people make it: it looks like a real org chart. What actually happens: Billing and Refunds bounce until a timeout. Better approach: a star, plus tools for facts.",
    "Mistake: putting issue_refund on two agents. Why people make it: 'the specialist should be able to finish'. What actually happens: money can move twice, often with a new key on retry. Better approach: the route writes, once, with ticket_key.",
    "Mistake: treating a routine bullet list as a sequencer. Why people make it: the writeup used the word routine. What actually happens: the model skips a step on a money path. Better approach: known procedures live in code.",
    "Mistake: starting a new empty Swarm on every HTTP retry. Why people make it: the runner has no session. What actually happens: the second refund uses a new key. Better approach: session id = ticket id, key from the ticket.",
    "Mistake: shipping the experimental package because the sample looked finished. Why people make it: handoffs demo well. What actually happens: you run a teaching repo against a ledger. Better approach: learn the pattern, run the Agents SDK or another real runtime.",
  ],
  interviews: [
    {
      question: "What is an OpenAI Swarm handoff, in one minute, starting from zero?",
      difficulty: "easy",
      answer:
        "Start with the problem: one customer, more than one job. A handoff is a function that returns another agent. The runner makes that agent current and continues. Swarm existed as a small experimental library to show this without a heavy framework. What the interviewer wants: you can separate the pointer move from the product decision of who speaks. A good follow-up is: who is allowed to send tokens to the user after the handoff? The good answer is: that is a separate decision, and by default only one owner should.",
    },
    {
      question:
        "Customers saw a refund approval and a denial in the same chat turn. How do you fix it?",
      difficulty: "medium",
      answer:
        "Two agents flushed. I make a single owner the only helper allowed to send tokens. Specialists return a packet and must hand back. I remove overlapping write tools and stop specialist-to-specialist handoffs. I add a test that fails if two names flushed in one turn. I do not start by rewriting prompts to 'be consistent'. Follow-up they may ask: where does issue_refund live now? In the route, after the packet validates, with a ticket-derived key.",
    },
    {
      question:
        "When is a handoff the wrong primitive for a support desk that sometimes refunds?",
      difficulty: "hard",
      answer:
        "A handoff is right when the specialist is a permission or context boundary — tools the owner must not see. It is wrong when the path is a known sequence: lookup, decide, approve, pay. Then a prompt routine is pretending to be a sequencer, and models skip steps. For that path I want a workflow in code, and an agent only to phrase the reply. Swarm showed the handoff and nothing else. The Agents SDK keeps the handoff and adds types, guardrails, and traces, but I still have to implement one mouth and a star. A mesh of SDK handoffs plus a manager is a group chat with better branding. Follow-up: how would you migrate? Keep the ownership model, change the runtime.",
    },
  ],
  glossary: [
    {
      term: "Handoff",
      meaning:
        "A transfer of control to another helper, usually by returning that helper from a function. It moves who is in charge. It does not have to move who talks to the customer. That distinction is the whole sitting.",
    },
    {
      term: "Swarm",
      meaning:
        "OpenAI's experimental teaching library: a current agent, functions, and a pointer. Useful for learning handoffs. Not a production server.",
    },
    {
      term: "Owner",
      meaning:
        "The single helper allowed to send words to the customer and to start a transfer to a specialist. Without an owner you get two mouths.",
    },
    {
      term: "Packet",
      meaning:
        "A small typed result from a specialist — eligible, amount, reason — instead of customer-facing prose. Packets can be tested. Chat cannot.",
    },
    {
      term: "Star topology",
      meaning:
        "Owner may transfer to a specialist. A specialist may transfer only back to the owner. Specialist-to-specialist arrows are a mesh and a bounce loop.",
    },
    {
      term: "Routine",
      meaning:
        "A natural-language procedure in an agent's instructions. Teaching vocabulary, not an engine. Known procedures belong in code.",
    },
  ],
};
