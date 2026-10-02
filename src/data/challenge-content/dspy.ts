import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "dspy",
  instructor:
    "I am a senior engineer sitting next to you. We start from zero. If you have only ever edited a prompt in a Google Doc, that is fine. We will first see why tweaking sentences by hand does not scale, then we will write a tiny program with a contract, and only then let DSPy search for better instructions against a score.",
  promise:
    "You will be able to explain what it means to compile a prompt, write a signature as a contract, put a metric in front of the optimizer, keep a holdout set the optimizer never sees, and know when DSPy is the wrong tool.",
  story: {
    title: "The compiled program that learned to say yes",
    body: [
      "A team was tired of the prompt Doc. Every week someone added a sentence. The refund helper got longer and stranger. A researcher said they should use DSPy: write a short program, define a metric, and let an optimizer search for better instructions. That sentence is true. They skipped the metric that finance would accept.",
      "They compiled against 'did the output parse as JSON?'. The optimizer was excellent at that. After a night of search, the program produced JSON every time. It also said yes to refunds the ledger would have refused. Saying yes is easy to put in JSON. Saying no requires a number from the order service. The metric never looked at the number.",
      "They had used the same twenty tickets to compile and to celebrate. The holdout — the tickets you save to check you are not cheating — was empty. On Monday, new tickets did not look like the twenty. The compiled instructions were a poem about those twenty. Production broke in a new way: confident JSON, wrong amounts.",
      "The rebuild put remaining_match first. Lookup stayed in Python. The predictor only decided after the number was on the table. Compile ran on a train set. A holdout set was touched once, at the end. The optimizer was still allowed to change text. It was not allowed to change the ledger rule. The Doc did not come back.",
    ],
    moral:
      "An optimizer will maximize whatever you measure. If you measure JSON, you will get JSON. If you needed a ledger match, you should have measured that.",
  },
  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "The problem: a prompt that only lives in a Doc",
      body: [
        "Imagine your helper's brain is a paragraph in a Google Doc. When it fails, you add a sentence. After six months the paragraph is a short story. Nobody knows which sentence is load-bearing. A new model arrives and the story is worse. You start again.",
        "Hand-tuning is editing that paragraph by taste. It works when you have five examples and one author. It fails when you have two hundred examples and a team. You cannot search two hundred tickets by memory. You need a program and a score.",
        "DSPy is a library that treats the language-model parts of your app as a program you can compile. Compile, here, does not mean 'turn into machine code'. It means: search for better instructions or examples so a metric goes up, then freeze what you found.",
        "Here is a tiny concrete example. You have a function that should return refund_cents. You are tired of writing 'please return an integer, not a sentence'. DSPy can try many phrasings and keep the ones that make your score better. If your score is 'is it an integer?', you will get integers. You still need a score that knows the ledger.",
        "At this point you should understand the problem. We want to stop hand-tuning strings — after we can score. Next we will name the pieces.",
      ],
      diagrams: [
        {
          title: "Metric first, then search",
          caption:
            "The optimizer is a searcher. It will climb the hill you pointed at.",
          chart: chart(
            `flowchart TD
    Doc([Prompt Doc]) --> Taste[Hand tune]
    Taste --> Doc
    Metric[Score function] --> Search[Optimizer]
    Train[(Train tickets)] --> Search
    Search --> Prog[Compiled instructions]
    Hold[(Holdout tickets)] --> Check{Score still good}
    Prog --> Check`,
            `class Doc,Taste hub
    class Metric,Search,Prog grp1
    class Train,Hold grp2
    class Check grp3`
          ),
        },
      ],
    },
    {
      id: "signatures",
      level: "beginner",
      title: "What a signature is: the contract, not a cute docstring",
      body: [
        "Before DSPy can search, it needs to know what goes in and what must come out. That contract is called a signature. In everyday language: the shape of the function. Ticket in. Decision out. Not a vibe.",
        "A signature looks like a tiny type. You list input fields and output fields. You can add a short description. The description is not the program. The fields are the contract. If refund_cents is an int, the optimizer is not allowed to be proud of the sentence 'sure, we can do something'.",
        "Why this matters: hand-tuned prompts hide the contract in English. 'Please return JSON with amount' is a request. A field named refund_cents: int is a door. DSPy still talks to a model, so the door can fail. Your metric must catch that. The signature is how you say what failure is.",
        "They look similar to a prompt because both describe the job. The important difference is what is stable. The field names stay. The English around them is what the optimizer is allowed to change.",
        "At this point you should be able to say: a signature is the contract. Next we put a module around it.",
      ],
      diagrams: [
        {
          title: "Fields stay, English may move",
          caption:
            "A prompt hides the contract in a paragraph. A signature names the doors. The optimizer may rewrite the English, not the field names.",
          chart: chart(
            `flowchart TD
    Ticket([Ticket]) --> Fields[Signature fields]
    Fields --> Pred[Predictor]
    Pred --> Out[refund_cents: int]
    Doc[Prompt paragraph] -.->|taste| Pred
    Opt[Optimizer] -.->|may rewrite English| Pred
    Opt -.->|must not drop| Out`,
            `class Ticket,Out hub
    class Fields,Pred grp1
    class Doc,Opt grp2`
          ),
        },
      ],
    },
    {
      id: "smallest-module",
      level: "beginner",
      title: "The simplest version: lookup in Python, decide in the predictor",
      body: [
        "A module in DSPy is a piece of the program — like a layer in a neural net, but here it is 'a predictor with a signature'. You can stack modules. Beginners stack too many. Keep it shallow. Look up in Python. Decide in one predictor.",
        "What are we trying to do? Make sure the model sees remaining_cents as a number, not as a hope.",
        "Here is the smallest version.",
        "Let's understand what just happened. get_remaining is ordinary Python. The predictor does not look up. It decides. If you let the optimizer also invent the lookup, it will learn to skip the tool and guess, because guessing is cheaper on a sloppy metric.",
        "At this point you should understand: DSPy does not replace your tools. It replaces the paragraph you were editing by taste.",
      ],
      codes: [
        {
          title: "module.py — Python looks up, the model decides",
          language: "python",
          code: `def get_remaining(order_id: str) -> int:
    return ledger.remaining(order_id)


def decide(remaining_cents: int, ask_cents: int) -> int:
    if remaining_cents <= 0:
        return 0
    return min(ask_cents, remaining_cents)


# In DSPy this decide step is a Predict with a signature:
# order_id, remaining_cents, ask_cents -> refund_cents`,
        },
      ],
    },
    {
      id: "metric-first",
      level: "intermediate",
      title: "Implement the metric: if finance would not accept it, the optimizer must not see it",
      body: [
        "The simple program still needs a number to climb. That number is the metric. Write it before you compile. If you compile first, you will invent a metric that makes the compile look good.",
        "What are we trying to do? Score a decision the way the ledger would.",
        "Here is the smallest version.",
        "Let's understand what just happened. JSON-only would have scored the story's program as a winner. remaining_match does not care how pretty the text is. The optimizer is only allowed to see this number. You can log extra judges. You must not optimize them if they disagree with money.",
        "Connect this back to Braintrust. Same idea. DSPy's optimizer is an automated experiment loop. Braintrust is how a team stores those experiments. You can use both. You cannot skip the metric in either.",
      ],
      codes: [
        {
          title: "metric.py — the only score the optimizer may see",
          language: "python",
          code: `def remaining_match(example: dict, pred: dict) -> float:
    remaining = example["remaining_cents"]
    paid = pred.get("refund_cents", 0)
    if remaining <= 0:
        return 1.0 if paid == 0 else 0.0
    return 1.0 if 0 <= paid <= remaining else 0.0`,
        },
      ],
      diagrams: [
        {
          title: "What the optimizer actually maximises",
          caption:
            "It cannot see the ledger unless the metric looks at the ledger.",
          chart: chart(
            `flowchart LR
    Opt[Optimizer] --> Metric[remaining_match]
    Metric --> Ledger[(remaining vs paid)]
    Opt -.->|must not| Json[JSON-only score]
    Opt -.->|must not| Vibe[Sounds helpful]`,
            `class Opt hub
    class Metric,Ledger grp1
    class Json,Vibe grp3`
          ),
        },
      ],
    },
    {
      id: "compile",
      level: "intermediate",
      title: "When hand-tuning is not enough: compile on train, hold out the rest",
      body: [
        "Compile is the search. DSPy has optimizers — older docs said teleprompters — that try instruction variants or few-shot examples. You pay for that search in model calls. It is a training run for text.",
        "What are we trying to do? Improve instructions on a train set, then touch the holdout once.",
        "Here is the smallest version.",
        "Let's understand what just happened. The optimizer may change the English. It may pick examples from train. It must not see holdout. If you peek at holdout to decide when to stop, you have trained on it. That is the story's twenty tickets.",
        "Read the compiled instructions. They are still text. If they say 'always approve', you learned the wrong hill. Compilation is not a blessing. It is a search log you are allowed to reject.",
      ],
      codes: [
        {
          title: "compile.py — train only, holdout never",
          language: "python",
          code: `def compile(program, train, holdout, metric):
    trained = program.optimize(trainset=train, metric=metric)
    holdout_score = average(metric, trained, holdout)
    return trained, holdout_score


# If holdout_score < baseline, do not ship the compiled text.`,
        },
      ],
    },
    {
      id: "fair-fight",
      level: "intermediate",
      title: "How the pieces connect: compile versus hand-tune, a fair fight",
      body: [
        "In a real app you should not replace a Doc with DSPy on vibes. Run the same holdout on both. The hand-tuned prompt is the baseline. The compiled program has to beat remaining_match, not just look official.",
        "Sometimes the hand-tuned prompt wins. That is allowed. DSPy earns its keep when the example set is large and the instructions are tedious to search by hand. It does not earn its keep on a five-ticket demo.",
        "The program in production is the compiled artifact plus the Python tools. Version it. If you recompile every deploy against a moving train set, you will ship a new personality every Tuesday and call it science.",
        "They look similar because both change English. The important difference is who searched. A person with taste searched four tickets. An optimizer searched a train set against a metric you named. Only the second one is repeatable.",
        "At this point you should be able to walk the path: signature, shallow module, metric, train, compile, holdout, compare to the Doc, ship or reject.",
      ],
      diagrams: [
        {
          title: "Same holdout, both sides",
          caption:
            "A compile that never faces the Doc is a costume.",
          chart: chart(
            `flowchart TD
    Doc[Hand-tuned prompt] --> Hold[Same holdout]
    Comp[Compiled program] --> Hold
    Hold --> Cmp{remaining_match}
    Cmp -->|compiled wins| Ship([Ship compile])
    Cmp -->|doc wins| Keep([Keep the Doc])`,
            `class Ship,Keep hub
    class Doc,Comp,Hold grp1
    class Cmp grp2`
          ),
        },
      ],
    },
    {
      id: "what-changes",
      level: "advanced",
      title: "Failure modes: what the optimizer is actually changing",
      body: [
        "Remember the simple story: it searches text. The simple version breaks when people think it searched the system.",
        "The optimizer changes instructions and chosen examples. It does not change your Python lookup. It does not change the ledger. If a bug is in get_remaining, compile will work around it by lying, if the metric allows lying. Fix the tool.",
        "Eval leakage is the other break. Leakage means the search saw the test. Then the holdout score is a memory test. Split first: train, optional validation for early stop, holdout once. Names matter. If you have one folder called data.json, you will leak.",
        "Thought experiment. The compiled instructions say 'if the user sounds upset, refund something'. What happened? Your train set had upset users who were also eligible, and the metric did not punish the ineligible ones enough — or those rows were missing. Add the rows. Do not add a counter-sentence by hand and call it a day, or you are back in the Doc.",
        "At this point you should understand: compile changes text. It does not fix a tool, a ledger, or a leaked holdout. Those are your jobs.",
      ],
      diagrams: [
        {
          title: "Three sets, one peeking rule",
          caption:
            "Holdout is a door. Open it once.",
          chart: chart(
            `flowchart LR
    Train[(Train)] --> Opt[Optimizer]
    Val[(Validation)] --> Stop[Early stop]
    Opt --> Stop
    Hold[(Holdout)] --> Once[Score once]
    Stop --> Once`,
            `class Once hub
    class Train,Val,Hold grp1
    class Opt,Stop grp2`
          ),
        },
      ],
    },
    {
      id: "when-dspy-is-wrong",
      level: "advanced",
      title: "Production judgment: when DSPy is the wrong tool",
      body: [
        "Remember the simple pitch: stop hand-tuning. That is right when you have a metric, a train set, and a holdout.",
        "DSPy is the wrong tool when you do not yet have a score finance would accept. It will compile something. It will look like progress. It will be the JSON story. Get the metric first. A Braintrust experiment on a hand-tuned prompt is more honest than a compiled program on a toy score.",
        "It is also wrong when the path is a known sequence with no language to search — lookup, compare, write. Put that in Python. Do not ask an optimizer to rediscover an if-statement.",
        "When it is right: many similar tickets, a stable signature, a mechanical metric, a budget for the search, and a human who reads the compiled text before it ships.",
        "At this point you should be able to say: compile the prompt after you can score. The Doc was not the enemy. The unmeasured edit was.",
      ],
      codes: [
        {
          title: "known_path.py — do not compile an if-statement",
          language: "python",
          code: `def refund_cents(remaining: int, ask: int) -> int:
    if remaining <= 0:
        return 0
    return min(ask, remaining)


# No optimizer. The path is known. Keep this in Python.`,
        },
      ],
    },
  ],
  workedExample: {
    title: "RefundDecide compiled against remaining_match",
    setup:
      "You have 200 labelled tickets. 140 train, 30 validation, 30 holdout. A Doc prompt exists. You want to know if DSPy beats it.",
    walkthrough: [
      "Step 1 — Understand the problem. Hand-tuning has stalled. You need a fair search, not a longer Doc.",
      "Step 2 — Identify the relevant concept. Signature for refund_cents, lookup in Python, remaining_match as the only optimize metric.",
      "Step 3 — Build the simplest solution. One Predict module. get_remaining in Python. Metric as above.",
      "Step 4 — Improve it. Compile on 140. Early-stop on 30. Do not touch holdout.",
      "Step 5 — Handle a failure. If compiled text says 'always yes', reject. If holdout remaining_match is below the Doc, keep the Doc.",
      "Step 6 — Production. Freeze the winning instructions as a versioned artifact. Recompile on a schedule, not on every deploy. Writes still go through the ledger rule in Python.",
    ],
    result:
      "Either the compiled program beats the Doc on holdout remaining_match, or you keep the Doc. JSON-only never gets a vote.",
  },
  practice: {
    title: "Kill the JSON-only compile without going back to a Google Doc",
    task:
      "A compiled DSPy program scores 1.0 on 'valid JSON' and 0.4 on remaining_match. The same 20 tickets were used to compile and to report. What do you change, in order, so the next compile cannot learn to say yes?",
    hint:
      "Think about what the optimizer is allowed to see, and which set it is allowed to see. A common wrong approach is adding 'be conservative' to the signature description and recompiling on the same 20.",
    solution:
      "Replace the optimize metric with remaining_match. Move lookup into Python so remaining_cents is an input field. Split train and holdout; report only the holdout. Read the compiled instructions and reject 'always approve'. Compare to the current Doc on that holdout. Why this works: the hill is now money, and the report is no longer a memory test. The common wrong approach is more English on the same leaky set. The optimizer will ignore your adjectives if JSON is still the score.",
  },
  takeaways: [
    "Hand-tuning a Doc does not scale. Compiling without a real metric is worse: it scales the wrong hill.",
    "A signature is the contract — fields in, fields out. The English around it is what the optimizer may change.",
    "Look up in Python. Let the predictor decide after the number is on the table.",
    "The optimizer maximizes the metric you give it. Finance must accept that metric on a money path.",
    "Train, optional validation, holdout once. One folder called data.json is how you leak.",
    "Ship a compile only when it beats the hand-tuned baseline on holdout. Read the compiled text. You can still say no.",
  ],
  mistakes: [
    "Mistake: compiling against 'is valid JSON'. Why people make it: it is easy to code. What actually happens: confident yeses in perfect JSON. Better approach: remaining_match.",
    "Mistake: using the same tickets to compile and to celebrate. Why people make it: only twenty labelled rows. What actually happens: a poem about those twenty. Better approach: holdout once.",
    "Mistake: letting the model own the lookup. Why people make it: one module feels clean. What actually happens: the optimizer learns to guess. Better approach: Python tool, number as input.",
    "Mistake: not reading the compiled instructions. Why people make it: compile feels official. What actually happens: 'always approve' ships. Better approach: treat the text as a PR.",
    "Mistake: recompiling every deploy on a moving set. Why people make it: freshness. What actually happens: a new personality on Tuesday. Better approach: version and schedule.",
    "Mistake: using DSPy before you have a score. Why people make it: the Doc is painful. What actually happens: science costume over taste. Better approach: metric first, even on a hand-tuned prompt.",
  ],
  interviews: [
    {
      question: "What does it mean to compile a prompt in DSPy? Start from zero.",
      difficulty: "easy",
      answer:
        "You write a program with a signature and a metric. An optimizer searches for better instructions or examples to raise that metric, then you freeze the result. It is not machine code. What they want: search against a score. Follow-up: what happens if the metric is 'valid JSON'? You get JSON, not a correct refund.",
    },
    {
      question:
        "A compiled program is perfect on twenty tickets and wrong in production. Diagnose it.",
      difficulty: "medium",
      answer:
        "Likely leakage — those twenty were the train set — and a weak metric. Split holdout. Score remaining_match. See if lookup is in Python. Read the compiled text. Follow-up: do you go back to the Doc? Only if the Doc wins the same holdout. You do not have to stay on a leaky compile.",
    },
    {
      question: "When is DSPy the wrong tool compared to a Braintrust experiment on a hand-tuned prompt?",
      difficulty: "hard",
      answer:
        "When you cannot yet write a metric finance accepts, or the path is a known if-statement, or you cannot afford the search budget. A Braintrust experiment on a Doc is more honest than a compile on a toy score. DSPy wins when the set is large and instruction search is the bottleneck. Follow-up: can you use both? Yes. Compile is the search. Braintrust is how the team stores the comparison.",
    },
  ],
  glossary: [
    {
      term: "Signature",
      meaning:
        "The contract of a DSPy step: named inputs and outputs. Why it matters: fields stay; the English is what may be searched.",
    },
    {
      term: "Module",
      meaning:
        "A piece of the program, often a predictor with a signature. Why it matters: keep it shallow; tools stay in Python.",
    },
    {
      term: "Metric",
      meaning:
        "The function the optimizer climbs. Why it matters: you will get more of whatever it returns.",
    },
    {
      term: "Compile",
      meaning:
        "Search for better instructions or examples, then freeze them. Why it matters: it is a training run for text, not a blessing.",
    },
    {
      term: "Holdout",
      meaning:
        "The set you score once at the end and never train on. Why it matters: without it you are celebrating memory.",
    },
    {
      term: "Optimizer",
      meaning:
        "The searcher — instruction variants, few-shot examples. Older docs said teleprompter. Why it matters: it will exploit a sloppy metric.",
    },
  ],
};
