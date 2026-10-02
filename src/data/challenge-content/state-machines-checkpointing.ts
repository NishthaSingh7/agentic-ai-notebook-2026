import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "state-machines-checkpointing",
  instructor:
    "I teach this from zero. If you have never heard 'state machine' or 'checkpoint', that is fine. We will name the problem first, then the idea, then a tiny piece of code you can hold in your head.",
  promise:
    "You will leave knowing why a while-loop forgets everything when a program dies, what a named state is, what a checkpoint saves, how to resume work without doing the same customer-facing action twice, and when a simple loop is still enough.",

  story: {
    title: "The invoice we paid twice",
    body: [
      "A finance team built a helper that walked vendor invoices through approval. The helper was a loop inside a worker process. It asked a manager to approve, waited, booked the payment, and emailed the vendor. All of that progress lived in a Python list in memory. In testing the whole dance finished inside one running program, so nobody asked what would happen if the program vanished halfway through.",
      "On a Thursday they shipped a prompt tweak. The servers restarted. Nine invoices had already been approved. The payment call had not yet returned. Those nine programs died. The new programs woke up with an empty list. From their point of view, no one had approved anything.",
      "A nightly sweeper saw 'stale' invoices and started them again from the first step. Nine managers got a second approval email. Four of them approved again because the first email was already buried. Two vendors received a second payment. Finance saw a double pay. Engineering saw a restart bug. Both were looking at the same fact: the loop had no name for 'this invoice is already approved' and no record of that fact outside the dying program.",
      "The rebuild gave each invoice a named place, like 'waiting for approval' or 'booking payment', and wrote that place down in a database before doing anything a human could see. A restart no longer meant 'start over'. It meant 'load the last saved place and continue'. The payment call got a unique key so even a buggy resume could not move money twice.",
    ],
    moral:
      "A loop keeps its place in memory, and memory dies with the program. If work must survive a restart, that place needs a name, a saved row, and a rule for what is allowed to happen twice.",
  },

  stages: [
    {
      id: "the-problem-forgetting",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Let us start from zero. A computer program is a list of steps. While it is running, it can remember things — a list of actions, a flag that says 'we already paid', the last file a user uploaded. That memory lives inside the running program. People call this RAM, which just means the computer's short-term memory. When the program stops, that short-term memory is gone.",
        "A lot of AI helpers are written as a while-loop. A while-loop means: keep doing the next step until you are finished. That is a fine design when the work starts and finishes in one sitting. A chatbot that answers one question in two seconds is like that. The program never needs to remember anything after it replies.",
        "The trouble starts when the work has to wait. Wait for a human to approve. Wait for another service to reply. Wait overnight. Wait through a deploy, which is when engineers ship a new version and the old program is shut down on purpose. The loop is still 'in the middle', but the program that held the middle is gone.",
        "Here is a tiny picture. You are filling a form at a desk. Someone turns the lights off and clears the desk. In the morning a new person sits down and starts the form from page one. That is what a restart does to a loop that only remembered things in RAM.",
        "Pause and check. If the payment already went out and the program dies, should the new program pay again? No. It should be able to see that the payment already happened. That already tells you the next idea: the place you are in must live somewhere the restart cannot wipe.",
        "At this point you should understand the problem: some AI work outlives the program that started it. If we do not save progress somewhere else, a restart looks like a brand new job, and brand new jobs repeat work the customer already did.",
      ],
      diagrams: [
        {
          title: "The program dies; the work is still unfinished",
          caption:
            "Everything after the red X was only in memory. The sweeper has no choice but to start from zero.",
          chart: chart(
            `flowchart LR
    User([Manager approves]) --> Loop[Loop in worker]
    Loop --> Ram[Progress in memory]
    Ram --> Wait[Waiting for payment]
    Kill[Restart or crash] -.->|stops| Loop
    Wait -.->|lost| Blank[No saved place]
    Blank --> Sweep[Job starts over]
    Sweep --> Dup([Second payment])`,
            `class User,Dup hub
    class Loop,Ram,Wait grp1
    class Kill,Blank grp2
    class Sweep grp3`
          ),
        },
      ],
    },
    {
      id: "what-a-state-machine-is",
      level: "beginner",
      title: "What a state machine is",
      body: [
        "Imagine a board game with a token on a path of named squares: Draft, Waiting for approval, Booking payment, Needs a human, Paid, Rejected. The token can only sit on one square at a time. Moving from one square to another is a move with a name. You can look at the board and say where the game is.",
        "That board is the everyday picture. The engineering idea is a state machine. A state is a named place the work can be in. A transition is a legal move from one state to another. A machine is the full set of states plus the rules for which moves are allowed.",
        "Why does this exist? Because 'a list of steps in memory' does not give you a name you can ask about. Support cannot query a Python list on a dead server. A row that says state = awaiting_approval since 14:03 is something a human and a program can both read.",
        "What happens without it? You get the story. The only two options after a crash are 'pretend we finished' or 'start from zero'. Both are wrong if the manager already approved and money may already have moved.",
        "The simplest example is a door. Closed and Open are states. Push and Pull are events. Closed plus Push becomes Open. You would not write a loop that remembers 'I was halfway through opening' only in your head. You would look at the door.",
        "At this point you should be able to say: a state machine is a set of named places and legal moves. It is not a smarter model. It is a way to make progress visible and durable.",
      ],
      diagrams: [
        {
          title: "Named places, legal moves",
          caption:
            "The token sits on exactly one square. Every arrow is a move you chose on purpose.",
          chart: chart(
            `flowchart TD
    Draft[draft] --> Await[awaiting approval]
    Await --> Book[booking payment]
    Book --> Human[needs a human]
    Book --> Paid[paid]
    Await --> Rejected[rejected]
    Human --> Book`,
            `class Draft,Await,Book grp1
    class Human grp2
    class Paid,Rejected hub`
          ),
        },
      ],
    },
    {
      id: "what-a-checkpoint-is",
      level: "beginner",
      title: "What a checkpoint is",
      body: [
        "A named state is only useful if it survives the program dying. Saving that named place — plus the few facts you need to continue — is a checkpoint. Think of a video game: you reach a save point, the game writes your location and inventory to disk, and if you quit you can continue from there instead of the opening cutscene.",
        "In an AI workflow the checkpoint is usually one row in a database. A database is just a program that stores rows on disk so they survive restarts. The row might say: invoice INV-4419 is in state booking_payment, we already have approval A-19, last event was webhook W-992, schema version 4.",
        "The order matters. Write the checkpoint first, then do the thing the outside world can see. If you send the payment and then crash before saving, a later resume will send the payment again. If you save 'payment sent' and then the send fails, you have a different problem — you will skip a send — but that is easier to detect and retry on purpose.",
        "Here is the key idea: the worker becomes a simple function. Load the last checkpoint. Run the handler for that state. Write the next checkpoint. Stop. The next event — an approval, a timer, a human decision — loads the row again. The program that handles Thursday does not need to be the program that started Monday.",
        "Pause and check. If the process dies after the checkpoint write and before the payment, what should resume do? It should see 'payment not sent yet' and send it. If it dies after both, resume should see 'payment sent' and not send. That is why the checkpoint has to record the side effect, not just the state name.",
      ],
    },
    {
      id: "smallest-machine",
      level: "intermediate",
      title: "The smallest state machine you can write",
      body: [
        "What are we trying to do? Give an invoice a named state and a function that takes the current state plus an event and returns the next state. No framework. No AI yet. If this feels too small, that is the point. The model is not the machine. The machine is the board the model plays on.",
        "Here is the smallest version. Two ideas only: a list of allowed states, and one function that decides the next one. We will store the current state on an object so we can print it after every event.",
        "Let's understand what just happened. STATES is the board. Event is something that arrived from the outside world — an approval, a pass, a fail. reduce is the rulebook. Nothing in this file talks to a model. That is deliberate. If you cannot move the token without a model, you do not have a machine. You have a prompt with extra steps.",
        "Connect this back to the story. The old loop had no reduce. The next line of Python was 'whatever the model said'. After a crash there was no token to pick up. With a named state, a new worker can load 'awaiting_approval' and wait for the next event instead of emailing again.",
        "At this point you should understand: the machine is data plus a function. You can test it with a list of events and never call a language model.",
      ],
      codes: [
        {
          title: "machine.py — named states and one reduce function",
          language: "python",
          code: `from dataclasses import dataclass

STATES = (
    "draft",
    "awaiting_approval",
    "booking_payment",
    "needs_human",
    "paid",
    "rejected",
)


@dataclass
class Invoice:
    id: str
    state: str = "draft"
    seen_events: tuple[str, ...] = ()


def reduce(inv: Invoice, event: str, event_id: str | None = None) -> Invoice:
    """Return the next invoice. Never change the old one in place."""
    if inv.state == "draft" and event == "submit":
        return Invoice(inv.id, "awaiting_approval", inv.seen_events)
    if inv.state == "awaiting_approval" and event == "approved" and event_id:
        seen = inv.seen_events + (event_id,)
        return Invoice(inv.id, "booking_payment", seen)
    if inv.state == "booking_payment" and event == "paid_ok":
        return Invoice(inv.id, "paid", inv.seen_events)
    if inv.state == "booking_payment" and event == "paid_unclear":
        return Invoice(inv.id, "needs_human", inv.seen_events)
    raise ValueError(f"illegal move: {inv.state} + {event}")`,
        },
      ],
    },
    {
      id: "save-then-act",
      level: "intermediate",
      title: "When the simple version is not enough: save, then act",
      body: [
        "The tiny machine forgets again the moment the process dies, because Invoice still lives in RAM. The next step is to write it down. This is the checkpoint.",
        "What are we trying to do? After every legal move, save the whole Invoice to disk. On startup, load it. If there is no row, start at draft. That is enough to survive a restart without repeating the whole flow.",
        "Here is the smallest version. A JSON file stands in for a real database so you can read it with your eyes. In production this is a row in Postgres, which is a common database. The idea is the same: the source of truth is the file, not the running program.",
        "Let's understand what just happened. save writes the named state and the event ids we already saw. load reads them back. The worker no longer owns the truth. It borrows it for one move.",
        "One more rule, and it is the one that stops the second payment: do not send mail, charge a card, or call a bank until the checkpoint that says you are about to do it is on disk. Then record that you did it. If you cannot tell those two moments apart, resume will guess, and guessing repeats customer-visible work.",
      ],
      codes: [
        {
          title: "checkpoint.py — save the token before you act",
          language: "python",
          code: `import json
from pathlib import Path

from machine import Invoice


def save(inv: Invoice, path: Path) -> None:
    path.write_text(
        json.dumps(
            {
                "id": inv.id,
                "state": inv.state,
                "seen_events": list(inv.seen_events),
            }
        )
    )


def load(invoice_id: str, path: Path) -> Invoice:
    if not path.exists():
        return Invoice(invoice_id)
    raw = json.loads(path.read_text())
    return Invoice(raw["id"], raw["state"], tuple(raw["seen_events"]))`,
        },
      ],
      diagrams: [
        {
          title: "One move, then a saved row",
          caption:
            "The database holds the token. The worker only holds it for the length of one event.",
          chart: chart(
            `flowchart TD
    Event([Approval arrives]) --> Load[Load checkpoint]
    Load --> Reduce[Reduce to next state]
    Reduce --> Write[Write next checkpoint]
    Write --> Act[Pay or email]
    Act --> Idle([Worker can die])`,
            `class Event,Idle hub
    class Load,Reduce,Write grp1
    class Act grp2`
          ),
        },
      ],
    },
    {
      id: "resume-without-repeats",
      level: "intermediate",
      title: "How the pieces connect: resume without repeating work",
      body: [
        "Remember this: a side effect is anything the outside world can notice. An email is a side effect. A payment is a side effect. Writing a row that only your system reads is not. Resume is allowed to rewrite a row. It is not allowed to pay the same vendor twice unless you meant to.",
        "The usual tool is an idempotency key. That phrase means 'a unique label for this exact action'. If the payment service sees the same key twice, it pays once. You derive the key from things that do not change: invoice id plus 'vendor payment'. Then even a confused worker cannot create a second transfer.",
        "In a real app the pieces look like this. A queue delivers events — approvals, timers, human decisions. A worker loads the checkpoint, reduces, writes, then calls tools. A model may sit inside one state, for example 'is this invoice line readable?', but the model does not choose the next state name. Your code does, after looking at a structured result.",
        "Why keep the model out of the state name? Because models are not reliable clerks. If the model can invent a new state called kinda_paid, your board has a square nobody drew. Give the model a small job with a small output. Let reduce stay a plain function you can test.",
        "At this point you should understand how a production invoice actually moves: event in, checkpoint out, side effects after the write, keys on anything a human can see.",
      ],
      diagrams: [
        {
          title: "A real invoice, one event at a time",
          caption:
            "The model answers a question inside a state. It does not own the board.",
          chart: chart(
            `flowchart LR
    Queue([Events]) --> Worker[Worker]
    Worker --> DB[(Checkpoint row)]
    Worker --> Model[Model: is line readable]
    Worker --> Pay[Payment tool]
    Pay --> Key[Idempotency key]`,
            `class Queue hub
    class Worker,DB grp1
    class Model grp2
    class Pay,Key grp3`
          ),
        },
      ],
      codes: [
        {
          title: "resume.py — one event, then stop",
          language: "python",
          code: `from pathlib import Path

from checkpoint import load, save
from machine import reduce


def handle_approval(invoice_id: str, event_id: str, already_paid: set[str]) -> str:
    path = Path(f"{invoice_id}.json")
    inv = load(invoice_id, path)
    inv = reduce(inv, "approved", event_id)
    save(inv, path)

    key = f"{invoice_id}:vendor-pay"
    if key not in already_paid:
        # pay_vendor(...) would go here in a real service
        already_paid.add(key)
    return inv.state`,
        },
      ],
    },
    {
      id: "how-this-fails",
      level: "advanced",
      title: "How this fails: twins, half-writes, and replay",
      body: [
        "Now that you understand the simple system, let's see what happens when real engineering problems appear. The simple version assumes one worker, one file, one event at a time. Production does not promise that.",
        "The first failure is a twin. Two workers load the same checkpoint, both think they should send the payment, both send. The checkpoint did not lie. Two programs read it before either wrote. The fix is a lock: only one worker may handle a given invoice at a time. Databases offer this as a row lock, which means 'this row is mine until I finish'.",
        "The second failure is a half-write. You crash between 'write state = booking_payment' and 'record that approval A-19 is seen'. Resume then pays an invoice it does not know is approved, or asks for an approval it already has. Write the whole checkpoint in one shot. If your database supports transactions — a group of writes that all land or none do — put the state and the event ids in the same transaction.",
        "The third failure is replay. Queues deliver the same event twice. Your reduce must treat a second 'approved A-19' as 'already have it', not as a new move. That is why seen_events lives on the checkpoint. Pause and check: if the same webhook arrives three times, how many times should the vendor be paid? Once.",
        "A fourth failure shows up after you ship new states. Old rows still say booking_payment. New code expects a state called needs_human_v2. Version the machine. A schema version on the row tells resume which rulebook to use, or that this row must be migrated before anyone touches it.",
      ],
      diagrams: [
        {
          title: "Two workers, one row, one lock",
          caption:
            "Without the lock, both workers pay. With it, the second one waits and then sees the new state.",
          chart: chart(
            `flowchart TD
    E1([Same approval twice]) --> W1[Worker A]
    E1 --> W2[Worker B]
    W1 --> Lock[Row lock]
    W2 --> Lock
    Lock --> Winner[One reduce and write]
    Winner --> Skip[The other loads the new row]`,
            `class E1 hub
    class W1,W2 grp1
    class Lock,Winner grp2
    class Skip grp3`
          ),
        },
      ],
    },
    {
      id: "production-shape",
      level: "advanced",
      title: "Production shape and when a loop is still enough",
      body: [
        "In production the checkpoint is a row with a primary key — a unique id — plus state, payload, schema version, and an updated-at time. The worker is a reducer you can run in tests with a recorded list of events. Side-effecting tools take an idempotency key. A sweeper looks for rows that have been sitting too long and either nudges them or pages a human.",
        "Frameworks such as LangGraph exist because this pattern is common. They give you a graph of states and a checkpointer that writes to a database. Use them after you can draw the board yourself. If you cannot name the states without the library, the library is hiding a design you still own.",
        "This approach is useful when a run waits, when a deploy can land mid-flight, when a human must approve a step, or when a side effect must not happen twice. You might avoid it when the whole job is one request and one response, under a few seconds, with no customer-visible action in the middle. A support bot that only searches docs and answers can stay a loop.",
        "Trade-offs are real. A state machine is more code than a while-loop. You will spend time naming states and writing migrations. You gain a row you can query, a resume story you can explain, and a place to put a human. That is the exchange.",
        "The reason we do this is not elegance. It is so a Thursday deploy does not pay nine vendors twice.",
      ],
      codes: [
        {
          title: "lock.py — one worker, one invoice, one move",
          language: "python",
          code: `def with_lock(db, invoice_id: str, handle) -> None:
    """Pretend db.lock holds the row until handle returns."""
    with db.lock(invoice_id):
        row = db.load(invoice_id)
        next_row, effects = handle(row)
        db.write(next_row)
        for effect in effects:
            effect.run()  # each effect already has an idempotency key`,
        },
      ],
    },
    {
      id: "judgment",
      level: "advanced",
      title: "Engineering judgment: version, interrupt, prove resume",
      body: [
        "Two more ideas show up once the machine is real. The first is a human interrupt. A state named needs_human means the machine stops and waits. The checkpoint holds everything a reviewer needs. When the human decides, that decision is just another event. Do not keep a web request open for four hours hoping the human is fast.",
        "The second is proving resume. Write a test that saves a checkpoint, throws away the object, loads it, and continues. Then write one that delivers the same event twice. If either test fails, you do not have a process. You have a demo that works on a lucky afternoon.",
        "When you add a state, bump the schema version and write a migration for old rows. When you remove a state, decide what happens to invoices still sitting there. 'We will never have old rows' is how Thursday's deploy became a double payment.",
        "If someone asks 'why not just make the model remember?', the honest answer is: the model sees a prompt you build now. It does not see last week's RAM. Memory for a long-running process is a row, not a paragraph in a system prompt.",
        "At this point you should be able to teach this sitting to a teammate with one board, one row, and one failure mode: the twin worker that pays the invoice twice.",
      ],
    },
  ],

  workedExample: {
    title: "Resume an invoice after a deploy",
    setup:
      "Invoice INV-17 is waiting for a manager. The manager has approved it. The worker has not yet booked the payment. A deploy kills the worker.",
    walkthrough: [
      "Step 1 — Understand the problem. If we start over, the manager gets a second approval email and the vendor may be paid twice. If we do nothing, the invoice sits forever. We need to continue from 'we already have the approval'.",
      "Step 2 — Identify the relevant concept. The invoice needs a named state and a checkpoint that already lists approval A-19.",
      "Step 3 — Build the simplest solution. Before the deploy, the last successful write was state = booking_payment, seen_events = (A-19,). A new worker loads that row.",
      "Step 4 — Improve it. The pay handler calls the bank with an idempotency key, gets paid_ok or paid_unclear, and reduce moves the token. No approval email is sent from booking_payment.",
      "Step 5 — Handle a failure. The approval webhook arrives again because the queue replayed it. seen_events already has A-19, so reduce does not move, and the payment key already exists.",
      "Step 6 — Production version. The row lives in Postgres, a lock stops two workers, the payment key is invoice_id + vendor_pay, and the sweeper resumes booking_payment instead of restarting from draft.",
    ],
    result:
      "The manager is not emailed again. The vendor is paid once. A deploy becomes a pause, not a reset.",
  },

  practice: {
    title: "Stop the second payment",
    task:
      "A loop agent asks for approval, waits, and pays the vendor. Progress lives in a list on the worker. Deploys restart workers. Write the smallest design that survives a restart without paying twice. Say what is in the checkpoint, when you write it, and what key you put on the payment. Do not pick a framework yet.",
    hint:
      "Name the states out loud. Ask which facts must be on disk before the send. Ask what would happen if the same approval event arrived twice.",
    solution:
      "Expected reasoning: the loop dies with RAM, so the named place and the approvals already seen must live outside the process. The payment is a side effect and needs a key.\n\nSolution: states such as draft, awaiting_approval, booking_payment, needs_human, paid, rejected. Checkpoint fields: invoice id, state, seen event ids, last event id, schema version. Write the checkpoint, then pay, with key invoice_id + vendor_pay. Replay of the same approval does not pay again.\n\nWhy it works: a new worker loads 'already have A-19' and continues. The payment service deduplicates on the key.\n\nCommon wrong approach: restart from the first user message and 'just add idempotency later', or store progress in the model's chat history and hope a new process can reconstruct it.",
  },

  takeaways: [
    "A while-loop remembers in RAM. RAM dies with the program. Long-running agent work needs a saved place.",
    "A state is a named place the work can be in. If you cannot query it, you cannot support it.",
    "A checkpoint is the saved place plus the facts you need to continue. Write it before customer-visible actions.",
    "Resume is not restart. Restart repeats work. Resume loads the last row and continues.",
    "Anything a human can see needs an idempotency key so two workers or a replay cannot do it twice.",
    "A loop is still enough when the job is one short request with no wait and no mid-flight side effect.",
  ],

  mistakes: [
    "Mistake: keep progress in a Python list on the worker. Why people make it: tutorials finish in one process. What actually happens: a deploy erases the list and a sweeper starts over. Better approach: one checkpoint row per run.",
    "Mistake: send the payment, then save state. Why people make it: it matches the order you think in. What actually happens: a crash after send looks like 'never sent' on resume, or the opposite if you save first and never record the send. Better approach: write the intent, send with a key, record the result.",
    "Mistake: let the model invent the next state name. Why people make it: it feels flexible. What actually happens: you get states nobody can query. Better approach: the model answers a small question; reduce picks a known state.",
    "Mistake: two workers, no lock. Why people make it: the queue 'probably' delivers once. What actually happens: twin payments. Better approach: lock the row for the length of one event.",
    "Mistake: add states and forget old rows. Why people make it: the new diagram looks clean. What actually happens: resume crashes on a name it does not know. Better approach: schema version plus a migration.",
    "Mistake: build a graph framework for a bot that answers in two seconds. Why people make it: production talk sounds safer. What actually happens: extra moving parts and no extra safety. Better approach: use a loop until you wait, interrupt, or persist.",
  ],

  interviews: [
    {
      question: "In one minute, what is a state machine doing in an agent, and what is a checkpoint?",
      difficulty: "easy",
      answer:
        "What they are testing: whether you can explain the idea without framework names.\n\nGood answer: the machine is a set of named places and legal moves. The checkpoint is the saved place plus the facts you need to continue after the process dies. The worker loads, reduces, writes, then acts.\n\nWhy that is good: it separates the board from the model and from the database.\n\nFollow-up: when would you still use a while-loop?",
    },
    {
      question:
        "A payments worker restarts mid-approval. Vendors receive a second payment. What do you inspect first?",
      difficulty: "medium",
      answer:
        "What they are testing: debugging order, not slogans.\n\nGood answer: I look for a durable row. If there is none, resume is restart. If there is a row, I check whether it recorded the approval already seen, whether the payment had an idempotency key, and whether a sweeper starts from state one. I also check for two workers handling the same invoice.\n\nWhy that is good: it treats the incident as missing or ignored state, not as a 'bad model'.\n\nFollow-up: how would you prove the fix in a test?",
    },
    {
      question:
        "When do you replace a loop with a checkpointed machine, and what do you refuse to put in the checkpoint?",
      difficulty: "hard",
      answer:
        "What they are testing: trade-offs and judgment.\n\nGood answer: I replace the loop when the run waits, survives deploys, needs a human, or must not repeat a side effect. I keep the checkpoint small: state name, ids already seen, last event id, schema version. I do not dump full model transcripts or raw files into the row if I can store handles. I refuse a framework until I can draw the states. I refuse to let the model invent state names.\n\nWhy that is good: it shows when the extra machinery pays and what must stay small.\n\nFollow-up: how do you migrate rows when you add a state next quarter?",
    },
  ],

  glossary: [
    {
      term: "State",
      meaning:
        "A named place the work can be in, such as awaiting_approval. Why it matters: people and programs can ask 'where is this invoice?'",
    },
    {
      term: "State machine",
      meaning:
        "The set of states plus the rules for moving between them. Why it matters: it turns a hidden loop into a board you can test and query.",
    },
    {
      term: "Checkpoint",
      meaning:
        "The saved state plus the facts needed to continue after a crash. Why it matters: it is the difference between resume and restart.",
    },
    {
      term: "Side effect",
      meaning:
        "An action the outside world can notice, like an email or a payment. Why it matters: resume must not repeat these by accident.",
    },
    {
      term: "Idempotency key",
      meaning:
        "A unique label for one exact action so doing it twice still has one result. Why it matters: twins and replays become safe.",
    },
    {
      term: "Resume",
      meaning:
        "Load the last checkpoint and continue, instead of starting from the first step. Why it matters: customers should not redo work they already finished.",
    },
  ],
};
