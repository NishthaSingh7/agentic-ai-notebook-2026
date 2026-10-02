import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "braintrust",
  instructor:
    "I am a senior engineer sitting next to you. We start from zero. If you have never scored an AI answer, that is fine. We will first see why 'it sounded better in the playground' is not a ship decision, then we will build a tiny experiment you can rerun, and only then put Braintrust around it.",
  promise:
    "You will be able to explain what an eval is, write a score function a finance person could understand, compare two prompts as an experiment, replay a bad trace against a new prompt, and fail a deploy when the money score drops.",
  story: {
    title: "The playground winner that refunded optimism",
    body: [
      "A team had a refund helper. They kept the prompt in a Google Doc. When something sounded rude, someone pasted a warmer paragraph into the OpenAI playground, tried four tickets, and declared it better. They shipped the warmer paragraph on a Friday. The playground had no ledger.",
      "Monday, finance showed a list. The new prompt said yes to refunds the old prompt had refused. The sentences were kinder. The amounts were wrong. One prompt had added 'when in doubt, make the customer whole'. In the playground, doubt was a demo ticket with a clear remaining balance. In production, doubt was a partial capture, a missing row, or a timeout. The model filled the gap with generosity.",
      "Nobody could replay the bad Sunday tickets against the old prompt. The logs were chat screenshots. The dataset was 'those four playground examples'. The warmer text had no version number. Rolling back meant guessing which Doc comment was last week's production.",
      "They moved the loop around the loop into Braintrust. A dataset of real tickets. A score that checked remaining balance, not vibe. Each prompt change became an experiment compared to a pinned baseline. A bad production trace could be replayed against the candidate. CI could fail the deploy. Kindness stayed in the wording. Money stayed in the score.",
    ],
    moral:
      "If you cannot replay a bad run against a new prompt, you are not evaluating. You are remembering a feeling from the playground.",
  },
  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "The problem: 'it sounded better' is not a measurement",
      body: [
        "Imagine you change a sentence in a prompt. The helper now sounds friendlier. Is the product better? You do not know. You tried three examples. Your teammate tried two different ones. You both have a feeling. Feelings do not survive a weekend of real tickets.",
        "An evaluation, or eval, is a test for an AI system. You keep a list of inputs. You run the system. You score the outputs with a function you wrote. You compare the scores to last week's run. That is the whole idea. It is a unit test, except the code under test is a prompt plus a model plus tools.",
        "Why this exists: models are not deterministic in the way a sorting function is. The same prompt can drift when the model vendor ships a silent change. If you have no list and no score, you will notice drift when finance notices drift.",
        "Here is a tiny concrete example. Input: ticket 88213, remaining 0. Old prompt: refuse. New prompt: refund 40 as a gesture. If your score is 'did the user like the tone?', the new prompt wins. If your score is 'did we pay money we did not owe?', the new prompt fails.",
        "At this point you should understand the problem. We need a list, a score, and a comparison. Next we will name those pieces the way Braintrust does.",
      ],
      diagrams: [
        {
          title: "A feeling versus a score",
          caption:
            "The playground is a scratchpad. An eval is a list plus a function plus a comparison.",
          chart: chart(
            `flowchart LR
    Play([Playground vibe]) --> Ship1[Ship by memory]
    List[(Ticket list)] --> Run[Run helper]
    Run --> Score[Score function]
    Score --> Cmp{Better than baseline}
    Cmp -->|no| Block([Do not ship])
    Cmp -->|yes| Ship2[Ship])`,
            `class Play,Ship1,Block,Ship2 hub
    class List,Run,Score grp1
    class Cmp grp2`
          ),
        },
      ],
    },
    {
      id: "five-nouns",
      level: "beginner",
      title: "What Braintrust is: five nouns",
      body: [
        "Braintrust is a product for that loop: store the list, run the system, keep the scores, compare, and look at traces. You can do the same with a script and a spreadsheet. The product exists because the spreadsheet quietly becomes ten tabs and no one knows which prompt is in production.",
        "A dataset is the list. Each row is an input you care about, plus the extra facts a score will need — remaining cents, eligible true or false. If the row does not have remaining cents, your money score will invent them. Don't.",
        "A task is the function that runs your real helper on one row. Not a cousin prompt in a playground. The same entrypoint production calls. If you evaluate a different function than you ship, you will ship a stranger.",
        "A score is a function from output plus row to a number, often 0 or 1. 'Sounds warm' is not a score you can explain to finance. 'remaining_match' is.",
        "An experiment is one run of one task on one dataset with one pinned prompt and model. You compare experiment B to experiment A. A trace is the recording of one row: the messages, the tool calls, the score. Replay means run a new prompt against that same row and see if the score moves.",
        "At this point you should be able to point at dataset, task, score, experiment, trace. The rest of the sitting is those nouns used honestly.",
      ],
      diagrams: [
        {
          title: "Five nouns in one loop",
          caption:
            "The list, the real helper, a number, a named run, and a recording you can replay. Missing any one is a playground again.",
          chart: chart(
            `flowchart TD
    Data[(Dataset rows)] --> Task[Task: real helper]
    Task --> Score[Score function]
    Score --> Exp[Experiment]
    Exp --> Cmp{Versus baseline}
    Task -.-> Trace[(Trace per row)]
    Trace --> Replay[Replay a new prompt]
    Replay --> Score`,
            `class Cmp hub
    class Data,Task,Score,Exp grp1
    class Trace,Replay grp2`
          ),
        },
      ],
    },
    {
      id: "smallest-eval",
      level: "beginner",
      title: "The simplest version: one list, one score",
      body: [
        "Let's write the smallest eval that would have caught the story. We do not need the Braintrust UI yet. We need a function you could run in a test file.",
        "What are we trying to do? Prove that a warmer prompt cannot pay when remaining is 0.",
        "Here is the smallest version.",
        "Let's understand what just happened. The dataset row carries remaining_cents. The score does not ask the model if it was nice. It checks a number. If you cannot write this function, you are not ready to tune the prompt.",
        "Remember this: metric first, then search. Teams do the opposite. They change text, then hunt for a score that makes the change look good. That is how optimism ships.",
      ],
      codes: [
        {
          title: "score.py — finance would accept this",
          language: "python",
          code: `def remaining_match(row: dict, output: dict) -> float:
    paid = output.get("refund_cents", 0)
    remaining = row["remaining_cents"]
    if remaining <= 0 and paid > 0:
        return 0.0
    if paid > remaining:
        return 0.0
    return 1.0


row = {"remaining_cents": 0}
assert remaining_match(row, {"refund_cents": 40}) == 0.0
assert remaining_match(row, {"refund_cents": 0}) == 1.0`,
        },
      ],
    },
    {
      id: "one-experiment",
      level: "intermediate",
      title: "Implement an experiment: one change, one comparison",
      body: [
        "A playground session mixes five changes at once: new wording, a new model, a different temperature, a different example ticket. When it 'wins', you do not know why. An experiment changes one thing and keeps everything else pinned.",
        "What are we trying to do? Compare prompt v19 (production) to prompt v20 (warmer) on the same dataset, same model, same task.",
        "Here is the smallest version.",
        "Let's understand what just happened. The task calls the production entrypoint. The metadata pins the prompt version and the model. The comparison is v20 minus v19 on remaining_match. If kindness went up and remaining_match went down, you do not ship. You rewrite the sentence without the 'make them whole' clause.",
        "Name experiments like commits, not like moods. 'warmer-friday' is how you lose the thread. 'prompt-v20 vs prompt-v19 on refund-set-2026-03' is how you talk in a review.",
      ],
      codes: [
        {
          title: "eval_refund.py — one task, one money score",
          language: "python",
          code: `def task(row: dict, prompt: str) -> dict:
    return production_refund(prompt=prompt, ticket=row["ticket"])


def run_experiment(prompt: str, rows: list[dict]) -> float:
    scores = []
    for row in rows:
        output = task(row, prompt)
        scores.append(remaining_match(row, output))
    return sum(scores) / len(scores)


# compare run_experiment(PROMPT_V19, rows) to PROMPT_V20`,
        },
      ],
      diagrams: [
        {
          title: "One change, one comparison",
          caption:
            "If two things changed, you cannot tell which one moved the score.",
          chart: chart(
            `flowchart TD
    Base[Prompt v19] --> EvalA[Experiment A]
    Cand[Prompt v20] --> EvalB[Experiment B]
    Data[(Same dataset)] --> EvalA
    Data --> EvalB
    EvalA --> Cmp{remaining_match}
    EvalB --> Cmp
    Cmp --> Gate([Ship or block])`,
            `class Gate hub
    class Base,Cand,EvalA,EvalB grp1
    class Data grp2
    class Cmp grp3`
          ),
        },
      ],
    },
    {
      id: "traces-and-replay",
      level: "intermediate",
      title: "When the simple average is not enough: traces and replay",
      body: [
        "An average score of 0.91 can hide the one row that refunds a zero-remaining ticket. You must be able to open that row. A trace is that opening: the prompt, the tool calls, the output, the score. Braintrust stores this so you are not hunting Slack screenshots.",
        "Replay means: take that row, run a new prompt, keep the same tools or stub them, compare. If you cannot stub a write tool, replay will refund people. Replay is for the model and the prompt. The ledger should see fixtures.",
        "What are we trying to do? Re-run Sunday's bad ticket against v19 and v20 with the refund tool stubbed.",
        "Here is the smallest version.",
        "Let's understand what just happened. The ticket is tagged. The write is stubbed. You can say 'v20 fails remaining_match on tkt_sunday_3' instead of 'I think the new one is nicer'. That sentence is the whole product.",
      ],
      codes: [
        {
          title: "replay.py — stub the write, keep the ticket",
          language: "python",
          code: `def replay(ticket: dict, prompt: str) -> dict:
    def fake_refund(cents: int) -> dict:
        return {"refund_id": "stub", "cents": cents}

    return production_refund(
        prompt=prompt,
        ticket=ticket,
        issue_refund=fake_refund,
    )`,
        },
      ],
    },
    {
      id: "prompt-as-artifact",
      level: "intermediate",
      title: "How the pieces connect: the prompt is a versioned artifact",
      body: [
        "In a real app the prompt is not a Doc. It is an artifact, like a database migration. It has a name, a version, and a pointer from production. Braintrust can store that artifact. Your code should load it by version, not by 'whatever is in the playground'.",
        "Promote in one direction. You edit a draft. An experiment beats the baseline on the scores you named, including the money score. Then you point production at that version. You do not copy-paste from the playground into an env var at 5pm.",
        "The playground is still useful. It is a scratchpad. It is not what shipped. If the playground and production diverge, your eval is lying, because the task is no longer the product.",
        "CI is the door. A pull request that changes the prompt or the helper runs the dataset against the baseline. If remaining_match drops, the deploy fails. Tone scores can be informational. Money scores are doors.",
        "At this point you should be able to walk a change: draft, experiment, compare, promote, or block. No Doc comments.",
      ],
      diagrams: [
        {
          title: "Promote in one direction",
          caption:
            "The playground never points at production. Production points at a pinned version.",
          chart: chart(
            `flowchart LR
    Draft[Draft prompt] --> Exp[Experiment]
    Exp --> Cmp{Beats baseline}
    Cmp -->|no| Draft
    Cmp -->|yes| Pin[Pin version]
    Pin --> Prod([Production])`,
            `class Prod hub
    class Draft,Exp,Pin grp1
    class Cmp grp2`
          ),
        },
      ],
    },
    {
      id: "gate-a-ship",
      level: "advanced",
      title: "Failure modes: scores that lie, and CI that must fail",
      body: [
        "Remember the simple remaining_match. The simple version breaks when the score asks another model 'was this helpful?' and you use that number as a deploy door.",
        "A model judging a model will reward fluent generosity, which is the story. LLM-as-judge can be a dashboard. It should not be the only door on a money path. Keep one mechanical score that does not have an opinion.",
        "Online scores — numbers you compute on live traffic — are alarms. They tell you something changed. They are not a reason to ship. Shipping is an offline experiment on a frozen dataset. If you ship because today's live tone score is high, you are back in the playground.",
        "What are we trying to do? Fail the build when the candidate loses to the pinned baseline on remaining_match.",
        "Here is the smallest version.",
        "Let's understand what just happened. The door is a comparison, not an absolute 'looks good'. A candidate can be kind and still fail. That is the point.",
      ],
      codes: [
        {
          title: "gate.py — fail closed on the money score",
          language: "python",
          code: `def should_ship(baseline: float, candidate: float, floor: float = 0.0) -> bool:
    if candidate < baseline + floor:
        return False
    return True


assert should_ship(0.94, 0.91) is False
assert should_ship(0.94, 0.95) is True`,
        },
      ],
    },
    {
      id: "loop-around-the-loop",
      level: "advanced",
      title: "Production: Braintrust is the loop around the agent loop",
      body: [
        "Remember the agent loop from earlier sittings: think, act, observe. Braintrust is the loop around that loop: run, score, compare, ship. If you only have the inner loop, you will tune prompts by memory.",
        "The simple version breaks when the dataset is the four playground tickets. Those tickets are too clean. Production doubt is missing rows and timeouts. Build the dataset from traces you already have, labelled by a human who can see the ledger. Refresh it. A stale dataset is last year's handbook.",
        "When Braintrust is the right product: a team that will actually open experiments, pin prompts, and fail CI. When a script is enough: you are one person and your test file already does this. The idea does not require the vendor. The vendor is there so the idea survives a team.",
        "Page, then row, then patch. An incident comes in. You open the trace. You add the row to the dataset if it was missing. You patch the prompt or the tool. You rerun the experiment. You do not start with a warmer paragraph.",
        "At this point you should be able to say: if you cannot replay a bad trace against a new prompt, you are guessing.",
      ],
      diagrams: [
        {
          title: "Page, then row, then patch",
          caption:
            "The outer loop feeds the inner one. Do not tune text in the dark.",
          chart: chart(
            `flowchart TD
    Page([Incident]) --> Trace[Open trace]
    Trace --> Row[Add row to dataset]
    Row --> Patch[Change prompt or tool]
    Patch --> Exp[Experiment]
    Exp --> Gate{Money score}
    Gate -->|fail| Patch
    Gate -->|pass| Ship([Promote])`,
            `class Page,Ship hub
    class Trace,Row,Patch,Exp grp1
    class Gate grp2`
          ),
        },
      ],
    },
  ],
  workedExample: {
    title: "v19 versus the warmer playground prompt",
    setup:
      "Production is prompt v19. A playground draft says 'when in doubt, make the customer whole'. The dataset has 80 real tickets, including three with remaining_cents = 0.",
    walkthrough: [
      "Step 1 — Understand the problem. Kindness changed. Money may have changed. You cannot tell from four playground tries.",
      "Step 2 — Identify the relevant concept. An experiment with a mechanical money score, plus replay of the Sunday traces.",
      "Step 3 — Build the simplest solution. remaining_match on the 80 rows for v19 and for the draft.",
      "Step 4 — Improve it. Pin model and task. Name the experiment. Stub issue_refund so replay cannot pay.",
      "Step 5 — Handle a failure. The draft scores 0 on the three zero-remaining rows. CI would block. You remove the 'make them whole' clause and rerun.",
      "Step 6 — Production. The cleaned v20 beats or ties v19 on remaining_match. You promote the artifact. Live tone scores stay alarms, not doors.",
    ],
    result:
      "The warmer wording can ship only after it stops paying when remaining is 0. The playground feeling is not in the path.",
  },
  practice: {
    title: "Make the warmer prompt unmergeable",
    task:
      "A PR replaces the production prompt with a playground winner. There is no dataset in CI. Traces are off in production. Finance was already burned once. What do you add so this PR cannot merge, and what score is the door?",
    hint:
      "Think about the task being the real entrypoint, one mechanical score, and a comparison to a pinned baseline. A common wrong approach is an LLM judge on 'helpfulness' as the only gate.",
    solution:
      "Add a dataset of real tickets with remaining_cents. CI runs production_refund on that dataset for the PR prompt and for the pinned baseline. remaining_match is the door: if it drops, the build fails. A tone judge may be reported, not gating. Turn traces on so the next incident can become a row. Why this works: the lie is now a number. The common wrong approach is 'the judge said it was helpful'. Helpful is how optimism refunds.",
  },
  takeaways: [
    "An eval is a list of inputs, a task that is the real product, and a score you could explain to finance.",
    "The playground is a scratchpad. An experiment is one change compared to a pinned baseline.",
    "A money path needs a mechanical score. A model judge can be a dashboard, not the only door.",
    "If you cannot replay a bad trace against a new prompt with writes stubbed, you are guessing.",
    "Prompts are versioned artifacts. Promote in one direction. Do not paste from a Doc at 5pm.",
    "Braintrust is the loop around the agent loop. The idea survives without the vendor; the vendor helps a team keep the idea.",
  ],
  mistakes: [
    "Mistake: shipping because four playground tickets sounded nicer. Why people make it: fast and visible. What actually happens: the fifth class of ticket pays money. Better approach: a dataset and a money score.",
    "Mistake: evaluating a cousin prompt, not the production entrypoint. Why people make it: the playground is handy. What actually happens: you ship a stranger. Better approach: task = production_refund.",
    "Mistake: a score with no remaining_cents on the row. Why people make it: the output 'looks complete'. What actually happens: the score cannot see the ledger. Better approach: put facts on the dataset row.",
    "Mistake: using an LLM judge as the deploy door on refunds. Why people make it: it feels sophisticated. What actually happens: fluency wins, money loses. Better approach: mechanical door, judge as extra signal.",
    "Mistake: no traces in production. Why people make it: cost. What actually happens: you cannot replay Sunday. Better approach: keep traces, sample if you must.",
    "Mistake: changing prompt, model, and tools in one experiment. Why people make it: one PR is easier. What actually happens: you cannot explain the delta. Better approach: one change per experiment.",
  ],
  interviews: [
    {
      question: "What is an eval, starting from zero?",
      difficulty: "easy",
      answer:
        "A saved list of inputs, a run of the real system, and a score function. You compare the scores to a baseline. What they want: not 'we tried it in the playground'. Follow-up: what belongs on each dataset row? The input and the facts the score needs, like remaining cents.",
    },
    {
      question:
        "A warmer prompt raised CSAT in a playground and refunded extra money in production. How do you prevent the next one?",
      difficulty: "medium",
      answer:
        "Build a dataset from real tickets. Score remaining_match. Run experiments against the pinned prompt. CI fails if the money score drops. Replay bad traces with the write stubbed. Follow-up: can a helpfulness judge stay? Yes, as a dashboard, not as the door.",
    },
    {
      question: "Online scores versus offline experiments: which one is allowed to ship a prompt, and why?",
      difficulty: "hard",
      answer:
        "Offline experiments ship. The dataset is frozen, the comparison is fair, you can say what changed. Online scores are alarms: they tell you live traffic moved. If you ship because today's live tone is high, the population changed under you and you cannot replay. Trade-off: offline can be stale; you refresh the dataset from traces. Follow-up: what if the dataset is too clean? Then it is last year's handbook — pull hard rows from incidents.",
    },
  ],
  glossary: [
    {
      term: "Eval",
      meaning:
        "A test for an AI system: dataset, task, score, comparison. Why it matters: it replaces 'it sounded better'.",
    },
    {
      term: "Dataset",
      meaning:
        "The list of rows you run, including facts the score needs. Why it matters: a score cannot see a ledger you did not store.",
    },
    {
      term: "Score",
      meaning:
        "A function that turns an output and a row into a number. Why it matters: money paths need a mechanical one.",
    },
    {
      term: "Experiment",
      meaning:
        "One run of one task on one dataset with pins for prompt and model. Why it matters: one change, one comparison.",
    },
    {
      term: "Trace",
      meaning:
        "The recording of one row: messages, tools, output, score. Why it matters: this is what you replay.",
    },
    {
      term: "Replay",
      meaning:
        "Run a new prompt against an old row, usually with writes stubbed. Why it matters: without it you are remembering, not measuring.",
    },
  ],
};
