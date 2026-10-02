import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "durable-execution",
  instructor:
    "I am a senior engineer sitting next to you. We will start from zero. You do not need to know Temporal or Inngest yet. I will build the idea from a program that dies mid-email, then we will get to checkpoints, replay, and why a deploy should be a resume, not a second personality.",
  promise:
    "By the end you will know why a while-loop in a web request is not an agent runtime, what durable execution means, how a workflow differs from an activity, how Temporal and Inngest share a shape, and how an idempotency key stops a second email after a crash.",
  story: {
    title: "The deploy that sent the email twice",
    body: [
      "A support agent ran as a long web request. The worker pulled a ticket, thought, looked up an order, drafted a reply, and sent an email. Most runs finished in a few seconds. The platform team had just moved deploys to a rolling restart with a short grace period — a polite warning before the process is killed. That number had been chosen for ordinary request-shaped services. Nobody had measured the tail of the agent.",
      "On a Thursday deploy, a run was on step four of six. The lookup had already returned. The model had already decided to mail the customer. The send was in flight when the process received the kill signal. The client disconnected. The job system marked the work failed and started it again on a new machine, the way it did for any failed job. The new run started from scratch. The model took a similar path. The email went out again. The customer got two mails.",
      "The write-up found three ordinary facts. The run's memory lived only inside the process, so a death was amnesia. The retry policy treated an agent like a stateless web handler, so resume meant restart. The mail tool received a fresh random key each try, which is how you defeat the one mechanism that would have saved you. The fix was not only 'give the process more time to die', though they also did that. The fix was to stop treating the loop as a request.",
      "A durable workflow held the notes. Each model turn and each tool became a recorded step. The mail tool took a key derived from the ticket id. A deploy cancelled the worker; the workflow continued on a new worker from the last recorded event. They later used Inngest for a smaller app that did not want to run Temporal. The shape was the same: named steps, a crash a resume. Grace periods are hospitality. Replay is the architecture.",
    ],
    moral:
      "If the process can die between two side effects, and you have not named those effects as durable steps, you have designed a double-send. A longer goodbye is not a runtime.",
  },
  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "The problem: the program forgot it already sent the mail",
      body: [
        "A normal web request lives in a process's memory. A process is a running program. If the machine restarts, the deploy kills the program, or the request times out, that memory is gone. For 'fetch a user and return JSON' that is fine. You try again. Nothing important happened in the middle.",
        "An agent is different. It may have already looked up an order, already charged a card, already sent an email, and still have two steps left. If you start over, you do the side effects again. A side effect is a change in the world: mail sent, money moved, ticket closed.",
        "Think of baking and then getting a phone call that erases your memory. You preheat again. You mix again. If you already put the cake in the oven, you now have two cakes. The grace period on the phone call — 'you have thirty seconds' — only helps if the cake finishes in thirty seconds. It does not help if the real need is to remember the cake is already in.",
        "Without durable execution, teams lengthen timeouts and hope deploys happen at night. Hope is not an architecture. The first long tail, or the first deploy during a slow tool, reprints the email.",
        "At this point you should understand the problem: we must remember finished steps so a crash is a resume, not a new person.",
      ],
      diagrams: [
        {
          title: "Amnesia versus replay",
          caption:
            "Process memory dies with the process. A recorded history can be replayed on a new process.",
          chart: chart(
            `flowchart TD
    Run([Agent run]) --> Mem[Only process memory]
    Mem --> Kill[Deploy or crash]
    Kill --> Again[Start from zero]
    Again --> Dup([Second email])
    Run --> Hist[(Recorded steps)]
    Hist --> Kill2[Deploy or crash]
    Kill2 --> Resume[New process replays]
    Resume --> Once([Same email once])`,
            `class Run,Dup,Once hub
    class Mem,Hist,Resume grp1
    class Kill,Kill2,Again grp2`
          ),
        },
      ],
    },
    {
      id: "what-durable-means",
      level: "beginner",
      title: "What durable execution means, in plain language",
      body: [
        "Durable means the work outlives the process that was running it. The notes are written down as they happen. A new process can read the notes and continue.",
        "A checkpoint is a saved snapshot of 'what has already happened'. After each important step you write a record: we called lookup_order, here is the result. If you die, you do not call lookup_order again. You read the record.",
        "An idempotency key is a stable name for a side effect. If the mail tool sees the same key twice, it sends once. The key should come from the ticket, not from a random value created at send time. A random value is a new cake every time you forget.",
        "They look similar to 'just use a database'. The important difference is the programming model: your function is written as if it runs from the top, and the platform skips work it already recorded. You do not hand-roll every if-already-done yourself, though you still key the writes.",
        "At this point you should know the three words: durable, checkpoint, idempotency key.",
      ],
      diagrams: [
        {
          title: "Write the note, then you may die",
          caption:
            "A checkpoint is the saved step. A key is the name of a side effect. Together they make a resume safe.",
          chart: chart(
            `flowchart LR
    Step[Finish a step] --> Ck[(Checkpoint)]
    Write[Send mail] --> Key[Ticket-derived key]
    Ck --> Resume([New process continues])
    Key --> Once([World changes once])`,
            `class Step,Write,Resume,Once hub
    class Ck,Key grp1`
          ),
        },
      ],
    },
    {
      id: "workflow-vs-activity",
      level: "beginner",
      title: "The simplest split: the plan versus the world",
      body: [
        "A workflow is the durable function that owns the plan: what step is next, what the notes say, when to stop. It must be deterministic. Deterministic means: given the same recorded history, it makes the same decisions. No 'what time is it' and no 'pick a random number' inside the workflow unless the platform records those too.",
        "An activity is a step that may touch the world: call the model, call a tool, send the email. Activities can fail and retry. Their results get written into history. The workflow reads those results as if they were ordinary return values.",
        "Think of a recipe card that must stay stable, and a kitchen that may burn a pan and try again. You do not put 'check Twitter' on the recipe card. You put 'bake until done' and you record that the cake went in.",
        "What are we trying to do? Write a tiny in-memory picture of history so the idea is visible before a framework appears.",
        "Here is the smallest version.",
        "Let's understand what just happened. If a step name is already in history, we return the saved result. If not, we run the function and save. That is checkpointing in a toy. A crash between 'run' and 'save' is still a hole — real platforms write the record as part of finishing the step. The toy is here so you see the habit.",
      ],
      codes: [
        {
          title: "checkpoint.py — do not rerun a named step",
          language: "python",
          code: `History = dict[str, str]


def step(history: History, name: str, fn) -> str:
    if name in history:
        return history[name]
    value = fn()
    history[name] = value
    return value


notes: History = {}
print(step(notes, "lookup", lambda: "order-1"))
print(step(notes, "lookup", lambda: "SHOULD_NOT_RUN"))`,
        },
      ],
    },
    {
      id: "agent-step-is-activity",
      level: "intermediate",
      title: "How we implement it: the agent step is an activity",
      body: [
        "Each model call is an activity. Each tool call is an activity. The while-loop that decides 'do we stop' lives in the workflow, reading recorded results. If you put the whole loop in one activity, a death still loses the inner steps. If you put network calls in the workflow, replay will call the network again while it is trying to remember.",
        "What are we trying to do? Separate a model turn from a write, and give the write a key from the ticket.",
        "Here is the smallest version.",
        "Let's understand what just happened. lookup can retry; it is a read. send_email takes a key the workflow computed from the ticket id. The model turn is its own function. Three names in history, not one blob called 'run_agent'.",
        "Connect this back to the story. The random UUID at send time was the bug inside the activity. Durability without a stable key still double-sends if the mail provider saw two names.",
      ],
      codes: [
        {
          title: "activities.py — model and tools are separate; writes take a key",
          language: "python",
          code: `def model_turn(goal: str, notes: str) -> str:
    return "send_email"


def lookup_order(order_id: str) -> str:
    return f"status:{order_id}"


def send_email(ticket_id: str, body: str) -> str:
    key = f"mail:{ticket_id}"
    return f"sent once for {key}"


print(send_email("8819", "Your refund is in progress"))`,
        },
      ],
      diagrams: [
        {
          title: "What lives in the workflow versus what is an activity",
          caption:
            "The plan stays deterministic. The world lives in named activities whose results are recorded.",
          chart: chart(
            `flowchart TD
    Wf[Workflow loop] --> M[Activity: model turn]
    Wf --> T[Activity: lookup]
    Wf --> S[Activity: send with key]
    M --> Hist[(History)]
    T --> Hist
    S --> Hist
    Hist --> Wf`,
            `class Wf,Hist hub
    class M,T,S grp1`
          ),
        },
      ],
    },
    {
      id: "temporal-shape",
      level: "intermediate",
      title: "When the toy is not enough: Temporal's replay",
      body: [
        "Temporal is a durable-execution system. You write a workflow function. Workers — processes that run workflows and activities — can die. The Temporal service keeps history. A new worker runs the workflow from the top. Replay means: as the function executes, Temporal feeds recorded activity results back in, so the function does not call those activities again. It only runs the activities that do not have a record yet.",
        "That is why the workflow must be deterministic. If replay takes a different branch because you called a clock, history no longer matches the code. You have a new personality wearing an old diary.",
        "What are we trying to do? See the loop as a workflow that awaits activities.",
        "Here is the smallest version. It is runnable in spirit: the awaits are the points history can resume.",
        "Let's understand what just happened. The loop is ordinary Python. Each yield point is an activity. A deploy can happen between them. The email key is ticket-scoped. That is the Thursday fix.",
      ],
      codes: [
        {
          title: "workflow.py — deterministic loop, activities for I/O",
          language: "python",
          code: `# Runnable in spirit: a Temporal workflow looks like this.
# The platform records each execute_activity result.


async def ticket_workflow(ticket_id: str, goal: str):
    notes = ""
    for i in range(6):
        decision = await execute_activity(model_turn, goal, notes)
        if decision == "stop":
            return notes
        if decision == "lookup":
            notes = await execute_activity(lookup_order, ticket_id)
        elif decision == "send_email":
            await execute_activity(send_email, ticket_id, notes)
            return notes
    return notes


async def execute_activity(fn, *args):
    return fn(*args)`,
        },
      ],
      diagrams: [
        {
          title: "Workers die; history does not",
          caption:
            "A new worker replays from the top and only performs activities that are not in history.",
          chart: chart(
            `flowchart LR
    W1[Worker A] --> Die[Killed on deploy]
    Hist[(History service)] --> W2[Worker B]
    Die --> W2
    W2 --> Replay[Replay recorded steps]
    Replay --> Next[Next unrecorded activity]`,
            `class W1,W2,Next hub
    class Hist,Replay grp1
    class Die grp3`
          ),
        },
      ],
    },
    {
      id: "inngest-shape",
      level: "intermediate",
      title: "How the pieces connect: the same shape in Inngest",
      body: [
        "Inngest is another durable-execution product, often used from TypeScript. You write a function with named steps. Each step is memoised — remembered. A crash resumes. You do not have to adopt Temporal's language to get the idea. You have to name the steps.",
        "They look similar because both are 'functions that remember'. The important difference is operations and ecosystem, not the mental model. If you learn one shape, you can read the other.",
        "What are we trying to do? See the same agent as named steps.",
        "Here is the smallest version.",
        "Let's understand what just happened. step.run is the checkpoint. The send uses the ticket id. A second invoke with the same history will not send twice if the provider honours the key and the step is memoised.",
        "At this point you should see one architecture with two skins. Next we look at retries that send the mail again on purpose if you are careless.",
      ],
      codes: [
        {
          title: "agent.ts — each model turn and each tool is a named step",
          language: "typescript",
          code: `// Runnable in spirit: an Inngest function with memoised steps.
export const agent = inngest.createFunction(
  { id: "ticket-agent" },
  { event: "ticket/opened" },
  async ({ event, step }) => {
    const ticketId = event.data.ticketId;
    const notes = await step.run("lookup", () => lookupOrder(ticketId));
    const decision = await step.run("model", () => modelTurn(notes));
    if (decision === "send_email") {
      await step.run("mail", () => sendEmail({ key: "mail:" + ticketId, notes }));
    }
    return { notes };
  },
);`,
        },
      ],
    },
    {
      id: "retries-and-heartbeats",
      level: "advanced",
      title: "How this fails: the retry you did not mean, and the long activity",
      body: [
        "Remember the simple checkpoint. In production, activities retry. A read retry is usually fine. A write retry without a key is the second email. Platforms will also retry after a worker death. That is the feature. It is also the foot-gun if send_email is not idempotent — safe to see twice.",
        "A long activity needs a heartbeat: a periodic 'I am still alive' so the platform does not decide the worker died and start a twin. Two twins sending mail is the story with extra processes.",
        "What are we trying to do? Practice a replay without sending a second mail.",
        "Here is the smallest version.",
        "Let's understand what just happened. The test pretends history already has the mail step. A second run must not call send. That is the Thursday drill, automated. If your test only checks the happy path on a living process, you have not tested durability.",
        "When not to use a heavy platform: a single model call and no side effects. A database write you already key may be enough. Earn Temporal or Inngest when the loop is long or the side effects matter.",
      ],
      codes: [
        {
          title: "test_replay.py — the Thursday drill, automated",
          language: "python",
          code: `def replay(history: dict[str, str]) -> list[str]:
    called: list[str] = []
    if "mail" not in history:
        called.append("send_email")
        history["mail"] = "ok"
    return called


first: dict[str, str] = {}
print("live", replay(first))
print("after crash", replay(dict(first)))`,
        },
      ],
      diagrams: [
        {
          title: "Two windows, two controls",
          caption:
            "Retries need a key. Long work needs a heartbeat. Either miss reprints the email.",
          chart: chart(
            `flowchart TD
    Act[Write activity] --> Key{Stable key}
    Key -->|no| Dup([Duplicate side effect])
    Key -->|yes| Hb{Heartbeat if long}
    Hb -->|no| Twin[Platform starts a twin]
    Twin --> Dup
    Hb -->|yes| Once([At most one send])`,
            `class Act,Dup,Once hub
    class Key,Hb grp2
    class Twin grp3`
          ),
        },
      ],
    },
    {
      id: "debug-replay",
      level: "advanced",
      title: "Production: survive a crash on purpose, and debug without making it worse",
      body: [
        "Debugging a replay feels strange. Logs from 'the start of the function' will appear again. That is replay, not a new customer. Do not 'fix' it by adding a random branch or by sending a debug email from the workflow. Put prints in activities, or use the platform's history view.",
        "Deploys should cancel workers and leave workflows. If your release process kills the workflow too, you have turned durability off for the night. Practice that on a staging ticket.",
        "The professional posture: the agent step is an activity, the workflow is replay-safe, and a crash or a deploy is a resume. Grace periods remain polite. They are not the design.",
        "When you should not cleverly snapshot into Redis by hand and call it Temporal: you will forget a step, or you will retry a write. Use a platform or accept that you are building one.",
        "You should now be able to explain, in an interview, why a while-loop in a request worker is not an agent runtime.",
      ],
    },
  ],
  workedExample: {
    title: "Ticket 8819: six steps, one deploy, one email",
    setup:
      "The agent looks up an order, thinks twice, and may send one email. Deploys kill workers with a short grace. The current code is a while-loop inside a request, with a random id on send.",
    walkthrough: [
      "Step 1 — Understand the problem. Death is amnesia. Retry is a new person. The random id makes every send unique.",
      "Step 2 — Identify the relevant concept. Durable workflow, activities, replay, ticket-derived key.",
      "Step 3 — Build the simplest solution. Name three steps: lookup, model, mail. Save results. Key the mail with the ticket id.",
      "Step 4 — Improve it. Move the loop to Temporal or Inngest so replay is the platform's job. Keep the workflow deterministic.",
      "Step 5 — Handle a failure. Kill a worker on step four in staging. Confirm history resumes and mail is not called again.",
      "Step 6 — Explain the production version. Heartbeat long activities. Retry reads freely. Never retry a write without the same key. Deploys cancel workers, not workflows.",
    ],
    result:
      "Thursday's deploy becomes a resume. The customer gets one mail. The random UUID is gone.",
  },
  practice: {
    title: "Stop the double email without lengthening SIGTERM",
    task:
      "A teammate wants a five-minute grace period so deploys stop double-sending. The agent has four tools including send_email. Design the workflow split, the keys, and the test that proves a kill is a resume. Think about what must stay deterministic. You may describe Temporal or Inngest. Do not rely on a longer goodbye.",
    hint:
      "Grace is hospitality. Expected reasoning: named activities, ticket key, replay test, workers die and history does not.",
    solution:
      "Workflow owns the loop. Each model turn and tool is an activity. send_email's key is derived from the ticket id. A test loads history that already contains mail and asserts send is not called. Deploys kill workers. Why this works: resume is data, not luck. Common wrong approach: longer SIGTERM and a UUID generated at send time.",
  },
  takeaways: [
    "A request worker's memory dies with the process. An agent can have already changed the world.",
    "Durable execution means the run's notes outlive the process.",
    "A workflow is the deterministic plan. An activity touches the world and is recorded.",
    "Replay runs the function from the top and skips work history already holds.",
    "An idempotency key must come from the ticket, not from a random value at send time.",
    "Temporal and Inngest are two skins on the same shape: named steps, a crash a resume.",
  ],
  mistakes: [
    "Lengthening the kill grace period and calling it a fix. Why people make it: the race got rarer. What actually happens: the first slow tool reprints the email. Better approach: recorded steps.",
    "Putting the whole agent loop in one activity. Why people make it: fewer names. What actually happens: a death still loses the inner writes. Better approach: one activity per model turn and tool.",
    "Calling the network from the workflow. Why people make it: it is convenient. What actually happens: replay hits the network again. Better approach: activities only for I/O.",
    "Generating a UUID at send time. Why people make it: unique feels safe. What actually happens: every retry is a new mail. Better approach: key from the ticket id.",
    "Adding time.now or randomness in the workflow. Why people make it: it is ordinary code. What actually happens: replay takes a new branch. Better approach: keep the plan deterministic.",
    "Testing only the live happy path. Why people make it: the demo works. What actually happens: Thursday is the first replay. Better approach: a history fixture that already contains the write.",
  ],
  interviews: [
    {
      question: "Why is a while-loop in a request worker not an agent runtime?",
      difficulty: "easy",
      answer:
        "What they are testing: amnesia. Good answer: the notes live in process memory, so a crash or deploy restarts the person and repeats side effects. Why that is good: it names memory, not a product. Follow-up: what two records would have stopped the double email?",
    },
    {
      question: "What must live in a workflow versus an activity, and why?",
      difficulty: "medium",
      answer:
        "What they are testing: determinism versus the world. Good answer: the plan and stop conditions live in the workflow and must replay the same way. Model calls and tools live in activities whose results are recorded. Why that is good: it explains replay. Follow-up: what goes wrong if the workflow reads the clock?",
    },
    {
      question:
        "Design Temporal or Inngest for an agent that looks up, thinks, and may email, under weekly deploys.",
      difficulty: "hard",
      answer:
        "What they are testing: shape plus keys plus drill. Good answer: workflow loop with a step budget; activities for model, lookup, send; send keyed by ticket id; heartbeat if send can block; deploys cancel workers; a staging drill kills mid-run and checks one mail. Why that is good: it treats Thursday as a requirement. Follow-up: how would you debug a replay without sending a debug email from the workflow?",
    },
  ],
  glossary: [
    {
      term: "Durable execution",
      meaning:
        "Work whose notes outlive the process, so a crash is a resume. Why it matters: agents have side effects in the middle.",
    },
    {
      term: "Checkpoint",
      meaning:
        "A saved record of a finished step. Why it matters: the next process can skip work that already happened.",
    },
    {
      term: "Workflow",
      meaning:
        "The deterministic function that owns the plan. Why it matters: replay runs it from the top.",
    },
    {
      term: "Activity",
      meaning:
        "A recorded step that may call the model or change the world. Why it matters: this is where retries and keys live.",
    },
    {
      term: "Replay",
      meaning:
        "Run the workflow again, feeding recorded results, and only perform new steps. Why it matters: this is how a deploy becomes a resume.",
    },
    {
      term: "Idempotency key",
      meaning:
        "A stable name for a side effect so two tries still change the world once. Why it matters: durability without it still double-sends.",
    },
  ],
};
