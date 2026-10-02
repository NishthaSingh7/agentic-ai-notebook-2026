import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "autogen-ag2",
  instructor:
    "I am a senior engineer who builds AI products. I still start this topic from zero every time I teach it, because the idea is simple and the failures are not.",
  promise:
    "You will go from never having heard of conversation agents to being able to explain a room, stand up two seats, say who may write, and recognise when the room is hiding a missing recipe.",

  story: {
    title: "The meeting that refunded three times",
    body: [
      "A support team copied a tutorial for helpers that talk to each other. Five seats in one room: triage, billing, shipping, a writer, and a 'user proxy' from the quickstart. A model picked who spoke next. The room was allowed twenty turns. The user proxy had a local shell so the helpers could 'calculate things'. The demo tickets ended with a polite paragraph.",
      "A real ticket arrived: a late order that was also a final-sale item. Billing said it was refundable. Shipping said it was not. The room argued for many turns. The writer drafted two opposite emails. Nobody owned the customer channel, so both drafts sat in the log as if they were decisions.",
      "Then billing said it would compute the amount in Python. The user proxy treated the code block as something to run. The snippet called the refund API. The room treated the printout as proof. Shipping disagreed. The proxy ran a second snippet. A third refund landed when the turn limit finally killed the meeting.",
      "The models were not broken. The room had no written rule for who speaks, who may move money, or what 'done' means. The tutorial default did that. Any library that ships a group chat will run the same default if you ask it to.",
    ],
    moral:
      "A group chat is a room with a microphone, not a workflow. If you cannot draw who speaks, who writes, and what stops the room, you have a meeting that can move money.",
  },

  stages: [
    {
      id: "why-talk",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Sometimes a job has two kinds of knowledge that fight if you stuff them into one prompt. Billing policy says one thing. Shipping policy says another. A single helper with both policies in one block will blend them, or pick the louder one.",
        "A simple idea: give each policy its own seat. Each seat is a program that can send a message and receive messages. They take turns. A manager decides whose turn it is. That is all 'helpers that talk' means at the start. No magic. No extra intelligence. Extra mailboxes.",
        "Why would this exist? Isolation. A billing seat does not need shipping tools. A writer seat does not need the refund API. If you do it well, each seat has a smaller toolbox — the least-privilege lesson, applied to people-shaped prompts.",
        "Why can this go wrong? A conversation is easy to demo because humans already understand rooms. A room is a bad place to keep a rule like 'refund at most once'. That rule belongs in a ledger. In a chat log it is a sentence the next speaker may ignore.",
        "Pause and check. If billing and shipping disagree, should they keep talking until someone refunds? No. Disagreement is a reason to escalate, not a reason to add a fifth seat.",
        "At this point you should understand the hope and the risk. Hope: split a hard job into seats with clear jobs. Risk: the seats argue, and a side door runs code while they argue.",
      ],
      diagrams: [
        {
          title: "One hat versus two seats",
          caption: "Splitting prompts is not the same as coordinating work.",
          chart: chart(
            `flowchart TD
    One[One helper, two policies] --> Blend([Blended answer])
    Bill[Billing seat] --> Room[Shared log]
    Ship[Shipping seat] --> Room
    Room --> Voice[One writer]`,
            `class Blend,Voice hub
    class One,Bill,Ship grp1
    class Room grp2`
          ),
        },
      ],
    },
    {
      id: "mailbox",
      level: "beginner",
      title: "What a conversation seat is",
      body: [
        "Hold a picture of a mailbox. A letter arrives. Someone reads it and writes a reply. That is a conversation seat: a mailbox plus a reply function. When a message arrives, the reply function runs and a new message goes out.",
        "Three common fillings for that reply function. An assistant seat fills it with a model call: read the log, write the next paragraph. A human seat fills it with a person. A manager seat fills it with 'pick who speaks next'.",
        "There is a fourth filling that tutorials love: a seat that runs code the model wrote. That seat is not a human. It is a tool host wearing a friendly name. We will come back to why that mix is dangerous.",
        "Talking is not coordinating. Two seats exchanging paragraphs can look like a handoff and be a disagreement. Until you add a structured result — a decision object, a ticket field — the only thing the system produces is more conversation.",
        "One beginner correction. This is not 'multi-agent intelligence'. It is message passing with an optional model picking the next speaker. You could write the same pattern in a short file. The library's value is the reply loop and the human seat. Its cost is that the defaults look like architecture.",
      ],
      codes: [
        {
          title: "A seat is a mailbox plus a reply function.",
          language: "python",
          code: `def reply(log: list[str], job: str) -> str:
    # assistant seat: a model reads the log
    return ask_model(job + "\\n" + "\\n".join(log))

def human_reply(log: list[str]) -> str:
    return input("Your note: ")  # no shell`,
        },
      ],
    },
    {
      id: "microphone",
      level: "beginner",
      title: "How the simplest room works",
      body: [
        "A group chat is a list of seats, a message log, and a rule for who speaks next. A manager runs the loop: pick a speaker, let them reply, append the reply, check whether to stop.",
        "Only one seat speaks at a time. Everyone else is silent but still present, because the default is to stuff the whole log into the next speaker's prompt. Every extra seat is extra instructions and extra tokens on every turn. Five seats with long backstories is how a cheap ticket becomes an expensive meeting.",
        "Name each seat like an on-call rotation: a job and a refusal. 'Billing decides eligibility. Never emails the customer. Never touches shipping tools.' If two seats can do the same write, you already have the duplicate-refund bug, before anyone has spoken.",
        "Keep one mouth. Only the writer talks to the customer. Everyone else returns short notes into the log. If specialists talk in the clear, the customer can see 'yes, refund' and 'no, final sale' in the same thread.",
        "Start with two seats plus a manager, not five. If you cannot justify the third seat with a permission boundary, you wanted a function call, not a colleague.",
        "At this point you should understand the simplest version: two mailboxes, a shared log, a picker you can draw, and one mouth to the customer.",
      ],
      diagrams: [
        {
          title: "The room",
          caption: "Four roles. If you cannot point at the manager, the write door, and the stop, do not add a fifth personality.",
          chart: chart(
            `flowchart TD
    Ticket([User ticket]) --> Mgr[Manager]
    Mgr --> Pick{Who speaks}
    Pick --> Seat[Chosen seat replies]
    Seat --> Log[Append to log]
    Log --> Halt{Stop?}
    Halt -->|no| Mgr
    Halt -->|yes| Done([Final message])
    Seat --> Door[Tool or shell]
    Door --> World([Outside world])`,
            `class Ticket,Done,World hub
    class Mgr,Seat,Log grp1
    class Pick,Halt grp2
    class Door grp3`
          ),
        },
      ],
    },
    {
      id: "two-seats",
      level: "intermediate",
      title: "Build the smallest room — now the library has a name",
      body: [
        "What are we trying to do? Two seats, one mouth, no shell on the proxy. Billing decides. Writer talks. A human sits in a third seat only if we need a real person, and that seat does not run code.",
        "The library that made this shape famous is AutoGen. The community continuation of the same conversation idea is called AG2. For this sitting, the objects are the same: assistant, user proxy, group chat, manager. The brand is an implementation. The room is the idea.",
        "Here is the smallest version. We give each assistant a job string. We set speaker selection to a function we wrote, or to round-robin, not to 'auto'. We set a stop that looks at a structured phrase or a field, not only at a max turn count. Max turns is a fuse, not a done condition.",
        "Let's understand the code. The user proxy in tutorials often has code execution turned on and human input turned off, so the demo does not pause. That combination is how a model-written snippet becomes a refund. In production, a proxy that can run code is a tool host. It is not a human.",
        "Connect this back to least privilege. The writer has no refund tool. Billing has a refund tool that requires an idempotency key from the ticket id. The proxy has neither.",
      ],
      codes: [
        {
          title: "Smallest room. Two jobs, one mouth, no shell.",
          language: "python",
          code: `from autogen import AssistantAgent, GroupChat, GroupChatManager

billing = AssistantAgent(
    name="billing",
    system_message="Decide refund eligibility. Never email the customer.",
)
writer = AssistantAgent(
    name="writer",
    system_message="Write one customer reply from billing's decision. No tools.",
)
room = GroupChat(agents=[billing, writer], speaker_selection_method="round_robin")
manager = GroupChatManager(groupchat=room)
writer.initiate_chat(manager, message="Ticket 441: late plus final sale")`,
        },
      ],
    },
    {
      id: "who-speaks",
      level: "intermediate",
      title: "When 'who speaks next' is the whole bug",
      body: [
        "Speaker selection is a hidden state machine. Round-robin passes the microphone left. Random is a coin. Auto asks a model to read the log and name a seat. Custom is a function you wrote.",
        "Auto feels smart and fails like the onboarding skip. The picker can bounce two specialists until the turn fuse blows. It can also skip the writer, so the customer never gets a single voice. If you cannot draw the allowed speaker sequence, do not let a model invent one.",
        "Write the picker as code when the path is known: after billing speaks, writer speaks; if billing says 'need shipping', shipping speaks once; then writer. That picker is a routed workflow wearing a group-chat coat.",
        "Termination must be a condition, not a hope. 'Someone said TERMINATE' is fragile. Prefer: a decision object is valid, or a human pressed send, or the budget tripped. When the budget trips, say so. Do not send the last argumentative paragraph as if it were the answer.",
        "Pause and check. If billing and shipping disagree, who wins? If the answer is 'they keep talking', you do not have a product. You have a meeting. Escalate. Do not add more seats.",
      ],
      diagrams: [
        {
          title: "A picker you can draw",
          caption: "Known sequence in code. Auto is a model in the chair you should have sat in.",
          chart: chart(
            `flowchart TD
    Start([Ticket]) --> Bill[Billing]
    Bill --> Need{Need shipping?}
    Need -->|yes| Ship[Shipping once]
    Need -->|no| Write[Writer]
    Ship --> Write
    Write --> Done([One customer message])`,
            `class Start,Done hub
    class Bill,Ship,Write grp1
    class Need grp2`
          ),
        },
      ],
    },
    {
      id: "human-and-tools",
      level: "intermediate",
      title: "How the pieces connect: humans, tools, and the side door",
      body: [
        "A human in the room is a gift if that seat is only a human. They approve a draft. They type a clarification. They do not silently execute model-written Python.",
        "Tools should sit on the seat that is allowed to use them, and they should be named functions, not a shell. If the room can run arbitrary code, every speaker can eventually talk the proxy into running it, because the log is shared.",
        "Idempotency belongs in the tool, not in the conversation. The refund function derives a key from the ticket id and refuses a second execute. Then eighteen rounds of argument cannot create three refunds. The room can still be sloppy. The ledger cannot.",
        "How this fits a real app: the HTTP route creates a ticket record first. The room may attach notes to that record. The customer channel sends only the writer's final object, and only after a stop condition. The transcript is for traces. The record is for truth.",
        "AG2 versus the old AutoGen name: you will see both. The conversation objects remain the thing to learn. Microsoft's newer Agent Framework is a different sitting. Do not find-and-replace a GroupChat into that stack and expect the same room.",
      ],
      codes: [
        {
          title: "The write sits behind a key the room cannot invent twice.",
          language: "python",
          code: `def issue_refund(ticket_id: str, amount_cents: int) -> str:
    key = f"refund:{ticket_id}"
    if ledger.seen(key):
        return "already_refunded"
    ledger.write(key, amount_cents)
    payments.refund(amount_cents, idempotency_key=key)
    return "ok"`,
        },
      ],
    },
    {
      id: "hidden-machine",
      level: "advanced",
      title: "When the conversation is hiding a missing recipe",
      body: [
        "Remember the simple room: two seats, a drawn picker, a ledgered write. The advanced failure is using more conversation to paper over a path you could have written as a workflow.",
        "If ninety percent of tickets are 'billing then writer', that is a two-box workflow. The group chat is an expensive way to hop those two boxes. Promote it. Keep a room only when seats must isolate context or permissions, and even then prefer an explicit graph if the sequence is stable.",
        "Debugging a room is reading the speaker sequence out loud. Print who spoke, which tool ran, and whether the stop fired. If you cannot explain a turn, the picker is too implicit. 'The agents were confused' is not a root cause. 'Auto selected billing four times after a terminal no' is.",
        "Token cost hides in the shared log. Every extra paragraph is re-sent to every next speaker. Summaries help and also erase decisions. Prefer a short structured note per seat — eligibility, amount, reason — over novels in the transcript.",
        "When not to use this pattern: money, permissions, or any write that needs a single owner. Use a workflow when you can draw the arrows. Use one agent when you do not need isolation. Use a room when isolation is real and the picker is yours.",
      ],
      diagrams: [
        {
          title: "Conversation versus a stored fact",
          caption: "A sentence in the log is not a refund row.",
          chart: chart(
            `flowchart LR
    Talk[Shared log] --> Maybe[Maybe refunded]
    Row[(Ledger row)] --> Once([Refunded once])`,
            `class Maybe,Once hub
    class Talk grp1
    class Row grp3`
          ),
        },
      ],
      codes: [
        {
          title: "A picker you can read is a tiny state machine.",
          language: "python",
          code: `def pick(last: str | None, need_shipping: bool) -> str:
    if last is None:
        return "billing"
    if last == "billing" and need_shipping:
        return "shipping"
    if last in {"billing", "shipping"}:
        return "writer"
    return "stop"`,
        },
      ],
    },
    {
      id: "production-room",
      level: "advanced",
      title: "Production rooms, and when to leave them",
      body: [
        "In production, treat the manager like a server. Give it a turn budget, a token budget, and a wall-clock. Persist the log under the ticket id so a retry does not start a second meeting. Do not hold write credentials on the proxy 'so demos work'.",
        "Put authorization in the tool layer. A seat name in a prompt is not a role in your identity system. If billing is not allowed to email, the email function must be unregistered on that seat, not merely discouraged.",
        "Microsoft folded a lot of this world into a newer framework. AG2 remains the conversation-shaped community line. If your operators already live on Azure identity and Azure monitors, you may be handed the newer stack. The lesson travels: mailbox, picker, stop, write door. The class names will change.",
        "The interview-level judgement is this. Conversation is a way to pass a microphone. A state machine is a way to pass a fact. When the fact is 'refunded', you need the machine. You can still generate the customer paragraph with a writer seat after the fact is stored.",
        "You should now be able to open any AutoGen or AG2 sample and ask: who is the manager, who holds the write, what stops the room, and is this actually a workflow in costume?",
      ],
      codes: [
        {
          title: "Stop is a condition. Max turns is only a fuse.",
          language: "python",
          code: `def should_stop(log: list[dict], turns: int, max_turns: int = 6) -> str | None:
    if turns >= max_turns:
        return "fuse"
    if any(m.get("decision") for m in log):
        return "decided"
    return None`,
        },
      ],
      diagrams: [
        {
          title: "Leave the room when the path is a recipe",
          caption: "Keep conversation for isolation. Move known sequences to arrows.",
          chart: chart(
            `flowchart TD
    Ticket([Ticket]) --> Shape{Sequence known?}
    Shape -->|yes| Wf[Workflow: billing then writer]
    Shape -->|no| Room[Small room, custom picker]
    Wf --> Ledger[(Refund ledger)]
    Room --> Ledger
    Ledger --> Mail([One customer message])`,
            `class Ticket,Mail hub
    class Wf,Room grp1
    class Shape grp2
    class Ledger grp3`
          ),
        },
      ],
    },
  ],

  workedExample: {
    title: "Rebuild the refund room so it can only speak once and pay once",
    setup:
      "Five seats, auto speaker selection, a user proxy with a shell, max turns as the only stop. Three refunds, two emails.",
    walkthrough: [
      "Step 1 — Understand the problem. The room argued. The shell executed. The log was the ledger. Nothing owned 'done'.",
      "Step 2 — Identify the relevant concept. You need a mailbox pattern with an explicit picker, one mouth, and a write that cannot run twice.",
      "Step 3 — Build the simplest solution. Two seats: billing and writer. Round-robin or a two-step custom picker. No shell.",
      "Step 4 — Improve it. Put issue_refund only on billing, with a key from the ticket id. Writer has zero tools. Customer channel sends only writer's final object.",
      "Step 5 — Handle disagreement. If billing and shipping would conflict, do not add a debate. Escalate to a human seat that cannot execute code.",
      "Step 6 — Production version. Persist the log on the ticket id. Budget turns and tokens. If traces are 'billing then writer' for a month, replace the room with a two-box workflow.",
    ],
    result:
      "A ticket produces one eligibility note, at most one refund row, and one customer message. Argument is no longer a payment mechanism.",
  },

  practice: {
    title: "Design seats for a late-order ticket",
    task:
      "You are asked for a 'team of agents' for late orders. Available skills: policy lookup, carrier tracking, refund, customer email. Think about how many seats you actually need, who holds the refund, who talks to the customer, and whether this is a room or a workflow. Sketch the picker.",
    hint:
      "Start with two seats. A third seat needs a permission or context reason. A shell is not a seat. Expected reasoning: prefer a workflow; if a room, two seats and a drawn picker.",
    solution:
      "Prefer a workflow: track → policy → refund-or-not → email. If you must use a room, two seats: specialist (track + policy + refund with a ticket key) and writer (email only). Custom picker: specialist once, writer once, stop. Why this works: one writer, one write owner, a stop you can draw. Common wrong approach: five personas, auto selection, shared refund tool, user proxy with code execution.",
  },

  takeaways: [
    "A conversation agent is a mailbox plus a reply function. Multi-agent here means extra mailboxes, not extra intelligence.",
    "A group chat passes a microphone around a shared log. Every extra seat is extra tokens and extra chances to contradict.",
    "Name a job and a refusal for each seat. Two seats that can do the same write are a duplicate-refund bug.",
    "Speaker selection is a state machine. If you cannot draw it, do not let a model invent it.",
    "A user proxy with a shell is a tool host, not a human. Writes belong in named functions with idempotency keys.",
    "When the speaker sequence is stable, the room is a workflow in costume. Promote it.",
  ],

  mistakes: [
    "Mistake: copying five tutorial personas. Why people make it: the screenshot looks like a staff. What actually happens: a long, expensive argument. Better approach: two seats or a workflow.",
    "Mistake: speaker_selection='auto' in production. Why people make it: it feels smart. What actually happens: ping-pong and skipped mouths. Better approach: a picker you can draw.",
    "Mistake: human_input NEVER plus a local shell. Why people make it: demos must not pause. What actually happens: model-written code moves money. Better approach: no shell on the proxy; named tools with keys.",
    "Mistake: treating the transcript as the payment ledger. Why people make it: the printout said ok. What actually happens: three refunds. Better approach: a store keyed by ticket id.",
    "Mistake: every seat can email the customer. Why people make it: helpfulness. What actually happens: two opposite emails. Better approach: one writer seat.",
    "Mistake: using max_round as 'done'. Why people make it: it is one number. What actually happens: the last argument is shipped as the answer. Better approach: a structured stop, with the number as a fuse.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "What problem does a group chat solve, and what does it not solve?",
      answer:
        "What they are testing: mailbox versus coordination. Good answer: it isolates prompts and tools into seats that take turns. It does not give you a ledger, a stop condition, or a guarantee that a required seat will speak. Why that is good: it is humble about the abstraction. Follow-up: when would one agent be enough?",
    },
    {
      difficulty: "medium",
      question: "A UserProxyAgent in a sample has code execution on and human input off. What do you change before production?",
      answer:
        "What they are testing: whether you see the side door. Good answer: remove the shell; if code is required, run it in a jail with an allowlist; keep the human seat for approvals only; put writes on named tools with idempotency. Why that is good: it separates 'human' from 'executor'. Follow-up: where does the refund key come from?",
    },
    {
      difficulty: "hard",
      question: "How do you decide between AutoGen/AG2, a single agent, and a workflow?",
      answer:
        "What they are testing: shape judgement. Good answer: workflow when the sequence is known; single agent when one toolbox is enough; a room when you need isolation and you will write the picker and the stop. Mention AG2 as the conversation fork, not as a reason by itself. Why that is good: framework last, control first. Follow-up: what metric would make you dissolve the room?",
    },
  ],

  glossary: [
    {
      term: "Conversation agent",
      meaning:
        "A mailbox plus a function that replies. Why it matters: this is the whole AutoGen/AG2 ontology.",
    },
    {
      term: "Group chat",
      meaning:
        "A shared log, a list of seats, and a rule for who speaks next. Why it matters: it is a meeting primitive, not a workflow engine.",
    },
    {
      term: "Speaker selection",
      meaning:
        "The rule that chooses the next seat. Why it matters: auto selection is a hidden state machine.",
    },
    {
      term: "User proxy",
      meaning:
        "A seat whose reply may be a human, a code runner, or both. Why it matters: the tutorial mix is how shells appear in production.",
    },
    {
      term: "AG2",
      meaning:
        "The community fork of AutoGen's conversation stack. Why it matters: same room idea; different home from Microsoft's newer framework.",
    },
    {
      term: "Termination condition",
      meaning:
        "The rule that closes the room. Why it matters: a turn cap is a fuse, not a definition of done.",
    },
  ],
};
