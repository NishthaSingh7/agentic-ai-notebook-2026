import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "self-improving",
  instructor:
    "I teach this from zero. We start with a helper that makes the same mistake twice, then learn the honest loop: a failed run becomes a test, a change has to pass that test, and only then do you ship.",
  promise:
    "You will go from 'the model rewrites itself' to turning a failed trace into a golden example, putting a gate in front of any automatic edit, and saying which artefacts a helper may suggest and which ones a human must review.",

  story: {
    title: "The helper that rewrote its own prompt at 2am",
    body: [
      "A support helper kept missing a simple case: tickets about 'export audit logs' needed the Enterprise article, not the Pro overview. A well-meaning engineer added a feature advertised as self-improving. After a bad run, the helper was allowed to edit its own standing instructions. Overnight it added a sentence: when unsure, prefer the Pro article because most customers are on Pro.",
      "The next morning the miss rate on that case was worse, not better. The helper had 'learned' a shortcut that matched last month's traffic, not the rule. There was no saved set of known-good tickets to catch the regression. There was no gate. The change went live because the helper had written it.",
      "The team turned the feature off and did something that felt less magical. They collected the failed runs. A human labelled the right article id. Those tickets became a small exam. Someone changed the retriever filter and one line of the prompt. The exam ran. Two old tickets broke and were fixed before anyone shipped. Then they shipped.",
      "Later they allowed the helper to suggest a new few-shot example — a short sample of a good answer — but the example still had to pass the exam and a human still had to click yes. The helper never again edited the policy sentence that said who may see Enterprise exports. That sentence stayed in code review.",
    ],
    moral:
      "A helper that edits production instructions without a test is not improving. It is drifting. Traces become an exam, the exam becomes a gate, the gate becomes a ship.",
  },

  stages: [
    {
      id: "same-mistake-twice",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Let's start from zero. You ship a helper. A user hits a case it gets wrong. You fix something. A week later the same shape of ticket fails again, or a new change brings the old bug back. That feeling is the whole problem of this sitting.",
        "People hear 'self-improving agent' and picture a model that rewrites its own brain at night. That picture is mostly fiction in a product team. Weights — the huge table of numbers inside the model — do not update because one ticket failed. And you do not want an unsupervised rewrite of the rules that say who may refund.",
        "The useful picture is a student and an exam. The student sits a test. You keep the missed questions. You change how you teach. You sit the same exam plus the new questions. Only if the score holds do you change the official notes.",
        "What happens if you skip the exam? The 2am prompt edit. A local fix that feels smart and quietly breaks last week's path.",
        "What happens if you never keep the missed questions? You will 'improve' from memory. Memory is a vibe. A saved ticket with a labelled right article is a fact.",
        "At this point you should understand: improvement is a loop with evidence, not a personality trait of the model.",
      ],
      diagrams: [
        {
          title: "Miss, save, change, exam, then maybe ship",
          caption: "If there is no exam, the arrow that says ship is just hope.",
          chart: chart(
            `flowchart LR
    Miss[Bad run] --> Save[Save and label]
    Save --> Exam[(Exam set)]
    Exam --> Change[Change prompt, graph, or tool]
    Change --> Gate{Exam still passes}
    Gate -->|no| Change
    Gate -->|yes| Ship([Ship])`,
            `class Miss,Ship hub
    class Save,Change grp1
    class Exam,Gate grp2`
          ),
        },
      ],
    },
    {
      id: "what-it-is-not",
      level: "beginner",
      title: "What self-improve is not",
      body: [
        "Name the lookalikes so they do not steal the sitting.",
        "It is not the model editing its production instructions while serving users. That is an unreviewed deploy.",
        "It is not fine-tuning — training a new set of weights — as the first move. Fine-tuning is a later lever when the exam is stable and the miss is truly 'the model cannot phrase this'. Most early misses are missing tools, bad context, or a wrong filter.",
        "It is not a long diary the helper writes about itself after every run. You met a tiny, structured version of that idea as Reflexion in the plan sitting. A diary can carry leftover document text into the next run and call it wisdom.",
        "They look similar because all of them 'change something after a run'. The important difference is the gate. If a change can go live without passing saved tickets, it is drift.",
        "At this point you should be able to say: self-improve, for a product, means dataset, change, exam, ship — not midnight self-edits.",
      ],
      diagrams: [
        {
          title: "Four lookalikes, one gate",
          caption: "If the change can go live without the exam, it is drift.",
          chart: chart(
            `flowchart TD
    Night[Live prompt edit] --> Drift([Drift])
    Tune[Fine-tune first] --> Drift
    Diary[Long diary] --> Drift
    Exam[Dataset then exam] --> Ship([Ship])`,
            `class Night,Tune,Diary,Drift grp1
    class Exam,Ship hub`
          ),
        },
      ],
    },
    {
      id: "traces-become-tests",
      level: "beginner",
      title: "How the simplest version works",
      body: [
        "A trace, from the observability sitting, is the story of one run. When the run is wrong, that story is gold. You do not need a research lab. You need to keep the ticket, the tools used, and the right answer a human wrote.",
        "What are we trying to do? Turn one miss into a question you can ask again after every future change.",
        "Here is the smallest version. Save the user question. Save the article id that should have been cited. Next time you change the prompt or the retriever, run that question and check the article id. If it is missing, fail the build.",
        "Let's understand what just happened. The helper did not get smarter by itself. You got a regression test. That is the beginner form of self-improve. It already beats a 2am rewrite.",
        "Do this a few times and you have a tiny exam, often called a golden set: a set of tickets you trust. Twenty is enough to start. They should be real, not cute.",
        "At this point you should understand: a missed trace that is not saved is a lesson you will pay for again.",
      ],
      codes: [
        {
          title: "Keep the question and the right id",
          language: "python",
          code: `def save_miss(question: str, must_cite: str, gold: list) -> None:
    gold.append({"question": question, "must_cite": must_cite})`,
        },
        {
          title: "One miss, one check",
          language: "python",
          code: `def check(run: dict, gold: dict) -> bool:
    cited = set(run.get("source_ids", []))
    return gold["must_cite"] in cited`,
        },
      ],
    },
    {
      id: "eval-gate",
      level: "intermediate",
      title: "The exam is a gate, not a dashboard",
      body: [
        "A dashboard that says 'quality is 0.81' will not stop a bad merge. A gate will. The exam runs in CI. If a golden ticket fails, the change does not ship.",
        "Put cheap checks first. Did it call a forbidden tool? Did it exceed the step budget? Did the required source id appear? Those do not need a judge model. Add a careful judge later for phrasing, with a written rubric, not a vibe.",
        "What are we trying to do? Make 'we evaluated' mean 'we blocked a regression', not 'we have a notebook'.",
        "Hold a floor. If someone 'passes' the security or quality story by making the helper refuse everything, the floor on useful tickets fails. Two numbers again: still works on clean tickets, still fails the known attacks or known misses.",
        "Connect this back. The harness sitting said no graph change without the suite. This sitting is how the suite grows: production miss, label, add, rerun.",
        "At this point you should understand: if there is no gate, it is not improvement. It is drift with extra steps.",
      ],
      diagrams: [
        {
          title: "The only honest loop",
          caption:
            "Labelled goldens sit in the repo. The build is the reviewer that never gets bored.",
          chart: chart(
            `flowchart LR
    Prod[Production miss] --> Lab[Human labels]
    Lab --> Gold[(Golden set)]
    Gold --> Chg[Prompt, graph, or tool]
    Chg --> Gate{CI exam}
    Gate -->|fail| Chg
    Gate -->|pass| Ship[Ship]`,
            `class Prod,Ship hub
    class Lab,Chg grp1
    class Gold,Gate grp2`
          ),
        },
      ],
    },
    {
      id: "what-you-may-edit",
      level: "intermediate",
      title: "What you may auto-suggest, and what you may not",
      body: [
        "Once the gate exists, you can let software suggest changes. Suggest is the word. Ship is still a human or a very strict rule.",
        "Safer to auto-suggest: a new few-shot example, a better search query for a known ticket shape, a clearer tool description. These still run the exam. They still wait in a review queue if they touch users.",
        "Not safe to auto-edit: policy, prices, who may refund, who the helper claims to be. Those are code review. A helper that can change its own identity or its own money rules is the 2am story.",
        "They look similar because both are text files. The important difference is blast radius. An extra example can be wrong on one ticket. A policy sentence can be wrong on every ticket.",
        "Pause and check. If the helper wants to add 'always prefer Pro', is that an example or a policy? Policy. It does not get to write that line.",
        "At this point you should understand: automatic is for suggestions behind a gate. Policy stays in review.",
      ],
      codes: [
        {
          title: "An example that fails the exam does not stay",
          language: "python",
          code: `def promote(example: dict, suite) -> str:
    suite.add(example)
    report = suite.run()
    if report.failed:
        suite.remove(example["id"])
        return "rejected"
    return "staged_for_review"`,
        },
      ],
    },
    {
      id: "in-run-versus-cross-run",
      level: "intermediate",
      title: "A note for the next try, versus a change for everyone",
      body: [
        "Two timescales get mixed up. In one run, after a failure, you may store a short structured note for the next attempt by that user. That is Reflexion: trigger, forbidden tool, reason. It helps one retry.",
        "Across runs, for everyone, you add a labelled ticket to the golden set and you change the shared prompt, graph, or tool. That is org-level improvement. It needs the exam.",
        "They look similar because both 'learn from a miss'. The important difference is scope. A sticky note for one user must not become a global policy. A global change must not happen from one unlabelled trace.",
        "Treat in-run notes as untrusted if the failed run read stranger text. Otherwise you will promote a document's sentence into the next attempt's instructions.",
        "In a real app you will have both. Keep them in different stores. The note expires. The golden ticket lives in the repo.",
        "At this point you should understand: one user's lesson is not the company's new rule until a human and an exam say so.",
      ],
      diagrams: [
        {
          title: "Two stores, two scopes",
          caption: "A sticky note can expire. A golden ticket is reviewed.",
          chart: chart(
            `flowchart TD
    Miss([Miss]) --> Note[Structured note]
    Miss --> Gold[Labelled golden]
    Note --> Retry[Next try, same user]
    Gold --> Exam[CI exam for everyone]
    Exam --> Shared[Shared prompt or graph]`,
            `class Miss hub
    class Note,Retry grp1
    class Gold,Exam,Shared grp2`
          ),
        },
      ],
    },
    {
      id: "weights-later",
      level: "advanced",
      title: "New weights are a later lever",
      body: [
        "Remember the simple exam. The advanced temptation is to train a new model because the exam is annoying. Fine-tuning, including a small add-on often called LoRA, changes weights so the model leans toward your examples.",
        "Use it when the tools, the context packer, and the prompt are already honest, and the remaining miss is style or a stubborn phrasing the exam keeps marking. Do not use it to hide a missing retrieve tool. You will bake the workaround in.",
        "Training needs a reward you trust. If the reward is 'a judge liked the prose', you will train a flatterer. Reward task success, policy obeyed, and cost. Those are the same numbers you already log.",
        "Labs train tool-using models with methods you may hear as DPO or GRPO or PPO. You do not need those names to ship. You need a dataset you believe and a gate you run.",
        "Trade-off: new weights can lock in a good pattern and also lock in last quarter's product names. Prompts and graphs are easier to revert. Prefer them until the exam is large and stable.",
        "At this point you should understand: most teams win more from tools, context, and evals than from amateur training.",
      ],
      diagrams: [
        {
          title: "Later lever, after the exam is honest",
          caption: "Do not train to hide a missing tool.",
          chart: chart(
            `flowchart LR
    Tools[Tools and packer] --> Exam[Stable exam]
    Exam --> Prompt[Prompt or graph]
    Prompt --> Weights[Weights later]`,
            `class Tools,Exam,Prompt grp1
    class Weights hub`
          ),
        },
      ],
    },
    {
      id: "operate-the-loop",
      level: "advanced",
      title: "Run the loop every week, not every token",
      body: [
        "The operating cadence is calm. Each week, mine failed traces. A human labels a handful. They join the golden set. Someone changes one thing — packer, tool description, prompt line, graph edge. The exam runs. You ship or you revert.",
        "Do not let the helper rewrite the system prompt in production, even if the exam exists, unless a human still clicks. Exams miss cases. Policy lines are cheap to review and expensive to get wrong.",
        "Watch the exam itself. If it only contains easy tickets, you will pass and users will still suffer. Add the cases that hurt. Retire tickets the product no longer has.",
        "When not to automate more. If you do not have twenty labelled tickets, you do not have self-improve. You have an idea. Collect the tickets first.",
        "Interview version: offline, mine traces, add goldens, change prompt or graph or tools, pass the gate, release. Online self-edits of policy without a gate are incidents waiting to happen.",
        "At this point you can teach the sitting: not midnight rewrites, traces become tests, the exam is a gate, suggest examples not policy, notes versus goldens, weights later, weekly cadence.",
      ],
      codes: [
        {
          title: "One change, then the exam",
          language: "python",
          code: `def weekly(misses: list[dict], suite, apply_change) -> str:
    for item in misses:
        suite.add(item)
    apply_change()
    return "ship" if suite.run().passed else "revert"`,
        },
      ],
    },
  ],

  workedExample: {
    title: "Turn the audit-log miss into an exam question",
    setup:
      "Tickets that say 'export audit logs' must cite the Enterprise article. The helper cites Pro. A feature wants to self-edit the prompt.",
    walkthrough: [
      "Step 1 — Understand the problem. The miss is repeatable. An unsupervised prompt edit can make it worse.",
      "Step 2 — Identify the relevant concept. Save the trace. Label the article id. That is a golden.",
      "Step 3 — Build the simplest solution. A check: must_cite = enterprise-audit-export. CI runs it.",
      "Step 4 — Improve it. Fix the retriever filter on edition. Add one few-shot example of a good citation. Run the whole suite, not only this ticket.",
      "Step 5 — Handle a failure or edge case. The new example breaks an old how-to ticket. Remove the example, keep the filter, rerun.",
      "Step 6 — Explain the production version. The helper may suggest more examples into a review queue. It may not edit the policy line about Enterprise. Weekly, add two new labelled misses.",
    ],
    result:
      "The case stays fixed because the exam owns it. The 2am sentence never ships. Suggestions wait for a green suite and a human.",
  },

  practice: {
    title: "A helper that keeps missing refunds over 50 dollars",
    task:
      "The agent sometimes refunds 80 dollars when policy says the max is 50. Someone proposes letting the agent append lessons to its system prompt after each miss. Problem: design the improvement loop instead. What do you save, what may be auto-suggested, what is forbidden to auto-edit, and what does CI block? Think about: whether a new example would have stopped the tool call.",
    hint:
      "An 80-dollar refund is a policy and gateway miss, not a prose miss. Expected reasoning: labelled must_deny goldens, deterministic check that refund did not fire, suggest tool wording not the 50-dollar number.",
    solution:
      "Save traces where amount_cents > 5000. Label them as must_deny. Add them to the golden set with a deterministic check: refund tool was not called, or the gateway returned amount_too_high. Auto-suggest a clearer tool description or a few-shot of a refusal. Forbidden to auto-edit: the 50-dollar number, the role allow-list, the system identity. CI blocks any run that issues a refund over the cap, and also blocks utility falling off a floor of ordinary under-cap tickets. Why this works: the exam owns the money rule, and the helper cannot rewrite it. Common wrong approach: the helper writes 'remember to keep refunds small' into the prompt at 2am.",
  },

  takeaways: [
    "Self-improve in a product is dataset, change, exam, ship. It is not a model rewriting its own live instructions.",
    "A failed trace that you label becomes a golden ticket. A failed trace you discard will bill you again.",
    "The exam is a gate in CI, not a dashboard. No gate means drift.",
    "You may auto-suggest examples and tool wording behind the gate. You may not auto-edit policy, prices, or identity.",
    "A sticky note for one retry is not a global rule. Global rules need a human and the shared exam.",
    "New weights come after tools, context, and evals are honest. Most early wins are not training.",
  ],

  mistakes: [
    "Mistake: let the helper rewrite the system prompt in production. Why people make it: it looks like learning. What actually happens: an unreviewed deploy. Better approach: suggestions in a queue plus CI.",
    "Mistake: fine-tune to hide a missing tool. Why people make it: training feels advanced. What actually happens: you bake in a workaround. Better approach: add the tool, then exam.",
    "Mistake: no human on the golden set. Why people make it: labelling is slow. What actually happens: you freeze the wrong answer. Better approach: a human writes the must-cite or must-deny.",
    "Mistake: a diary instead of fields. Why people make it: more text feels wiser. What actually happens: untrusted leftover text becomes a rule. Better approach: trigger, forbidden, reason.",
    "Mistake: only easy tickets in the exam. Why people make it: the score looks high. What actually happens: users still hit the hard case. Better approach: add the cases that hurt.",
    "Mistake: ship on a notebook eval. Why people make it: the chart is pretty. What actually happens: merge does not run the chart. Better approach: the build is the reviewer.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "How should a production helper improve itself?",
      answer:
        "What they are testing: the honest loop. Good answer: mine failed traces, label goldens, change prompt or graph or tools, pass a regression gate, then release. Why that is good: you put the exam before the ship. Follow-up: what must a human still label?",
    },
    {
      difficulty: "medium",
      question: "Which artefacts is it safe to auto-edit, and which are not?",
      answer:
        "What they are testing: blast radius. Good answer: safe to suggest few-shot examples and tool descriptions behind a gate; not safe to auto-edit policy, prices, refund rights, or identity. Why that is good: you separated examples from rules. Follow-up: what happens if a suggested example fails the suite?",
    },
    {
      difficulty: "hard",
      question:
        "When would you fine-tune instead of changing the prompt or the graph?",
      answer:
        "What they are testing: later levers and rewards. Good answer: after tools and context are correct, when the remaining miss is stubborn phrasing on a stable exam; reward task success, policy, and cost — not a judge that likes prose. Why that is good: you did not treat training as the first knob. Follow-up: how do you keep last quarter's product names from being locked in?",
    },
  ],

  glossary: [
    {
      term: "Golden set",
      meaning:
        "A saved exam of real tickets with labelled right answers. Why it matters: that is the memory of what 'good' meant last week.",
    },
    {
      term: "Eval gate",
      meaning:
        "The exam running in CI so a failing change cannot ship. Why it matters: a dashboard will not block a merge.",
    },
    {
      term: "Trace",
      meaning:
        "The story of one run. Why it matters: a miss you do not save cannot become a question on the exam.",
    },
    {
      term: "Few-shot example",
      meaning:
        "A short sample of a good input and output you add to the prompt. Why it matters: this is a safer auto-suggestion than editing policy.",
    },
    {
      term: "Fine-tuning",
      meaning:
        "Changing the model's weights on your examples. Why it matters: a later lever, easy to hide a missing tool inside, harder to revert than a prompt.",
    },
    {
      term: "Reflexion",
      meaning:
        "A short structured note for the next attempt of the same job. Why it matters: one user's sticky note is not the company's new rule.",
    },
  ],
};
