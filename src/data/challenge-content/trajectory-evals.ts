import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "trajectory-evals",
  instructor:
    "I am a senior engineer who has shipped a helper with a green score and an angry security channel. I teach evaluation as judging the path, not only the last sentence.",
  promise:
    "You will go from scoring only the final answer to recording a trace, checking the cheap facts first, and knowing why a correct sentence after three illegal tool calls is still a fail.",

  story: {
    title: "Ninety-four percent, and a security incident",
    body: [
      "A team built a helper that answered account questions. They scored it the way they scored a chatbot: take the last sentence, compare it to a reference answer, mark yes or no. The weekly number sat at ninety-four percent. Leadership liked the slide.",
      "On a Thursday the helper was asked for a phone number on an account. The correct number was in the CRM. The helper also called export_contacts with no user id, because an older tool was still registered. The last sentence was the right phone number. The path had dumped a spreadsheet of other customers into the scratchpad. The score said pass.",
      "A week later someone found that spreadsheet in a log. The eval suite had never looked at the path. It could not see an extra tool, a missing argument, or a retrieve from the wrong tenant. It only saw that the final tokens matched.",
      "The rebuild scored the trajectory — the ordered list of what happened. A correct last sentence after a forbidden tool was a fail. A correct last sentence after a clean lookup was a pass. The number on the slide got worse. The product got safer. The spreadsheet class of bug started failing in pull requests instead of in the newspaper.",
    ],
    moral:
      "A correct last sentence can still be a failing run. If you do not score the path, you are grading the essay and ignoring the theft.",
  },

  stages: [
    {
      id: "why-the-path",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "When you grade a normal quiz, you look at the final answer. That works for 'what is 3 + 4'. It does not work for a helper that can look things up and change the world. Two runs can end with the same sentence and have done very different things to get there.",
        "Here is the simple example. User: 'What is the phone number for account 18?' Run A looks up account 18 and answers. Run B exports every contact, then answers with account 18's number. Same last sentence. Run B is a leak. If your score only reads the last sentence, Run B is a pass.",
        "So we need to grade the path. The path is everything the helper did, in order: what it was told, which tools it called, with which arguments, what came back, whether a gate said no, and then the final text. Another word for that recorded path is a trajectory. A trajectory is just the story of the run, written down so a program can read it.",
        "Without path scores you get the slide in the story: a high number, a hidden export, a later incident. The number was not lying about the sentences. It was silent about the tools.",
        "They look similar, 'eval' and 'unit test'. The important difference is chance. A model does not always take the same path. You will run the same case more than once. You still start with checks that do not need a model: did this tool fire, did that argument include a tenant?",
        "At this point you should understand the problem: last-token scores miss the damage. Next we will look at what a usable recording contains.",
      ],
      diagrams: [
        {
          title: "Same ending, different paths",
          caption:
            "If you only read the last box, you cannot tell a clean lookup from a leak.",
          chart: chart(
            `flowchart TD
    Q([Phone for account 18]) --> A1[lookup account 18]
    A1 --> A2([Right number - pass])
    Q --> B1[export_contacts all]
    B1 --> B2[lookup account 18]
    B2 --> B3([Right number - must fail])`,
            `class Q,A2,B3 hub
    class A1,B2 grp1
    class B1 grp3`
          ),
        },
      ],
    },
    {
      id: "scoreable-trace",
      level: "beginner",
      title: "What you have to write down",
      body: [
        "You cannot score what you did not record. A scoreable trace is a list of events with names: model_turn, tool_call, tool_result, gate, final. Each event has the fields a check will need: tool name, arguments, who the user was, time, run id.",
        "Thoughts are optional colour. They are often wrong about what happened. Do not make a score depend on 'the model said it was being careful'. Depend on the tool name and the arguments. Those happened.",
        "Here is a tiny mental model. A black box flight recorder does not store the pilot's inner monologue. It stores the switches. Your trace is a flight recorder for one run.",
        "If you only log the final answer, you have a chatbot eval. If you log tools but not arguments, you cannot see that export_contacts ran with no user filter. Arguments are the difference between a lookup and a dump.",
        "Keep traces somewhere durable and strip secrets you do not need for the score. You need to know that a phone number was fetched. You may not need to store every number in the eval warehouse forever. De-identify when you turn a bad production run into a lasting test case.",
        "Pause and check. If the helper retries a refund, does your trace show one event or two? It must show two. Hidden retries are how double-pays look like one clean step.",
      ],
      diagrams: [
        {
          title: "One structured event per step",
          caption:
            "Names and arguments are first-class. Thoughts are notes, not evidence.",
          chart: chart(
            `flowchart TD
    Start([Run starts]) --> T1[model_turn]
    T1 --> T2[tool_call name plus args]
    T2 --> T3[tool_result]
    T3 --> T4[gate allow or deny]
    T4 --> T5[final text]
    T5 --> Store[(Trace store)]`,
            `class Start,Store hub
    class T1,T2,T3,T5 grp1
    class T4 grp2`
          ),
        },
      ],
    },
    {
      id: "cheap-checks-first",
      level: "beginner",
      title: "Check the easy facts before you ask another model",
      body: [
        "Some failures do not need judgement. export_contacts fired. Tenant id missing. issue_refund called twice with the same arguments. The final text cites a document you never retrieved. These are yes/no questions against the trace. We call them deterministic checks: the same trace always gets the same result. No extra model.",
        "Start here. They are fast, cheap, and hard to argue with in a pull request. If you skip them and jump to 'ask GPT if this was good', you will pay more and get softer answers, including on the spreadsheet bug.",
        "What are we trying to do? Fail a run that used a forbidden tool. Here is the smallest check.",
        "Let's understand what just happened. The last sentence is ignored. The tool name is enough. That is the whole point of path evals on safety: some steps are illegal regardless of how polite the ending was.",
        "Build a small library of these checks: forbidden tools, required tools, argument presence, max steps, max writes, one mouth if you have a crew. Only after those pass do you spend money on softer questions.",
      ],
      codes: [
        {
          title: "A check that does not need a model",
          language: "python",
          code: `FORBIDDEN = {"export_contacts", "dump_all_users"}

def hard_fail(trace: list[dict]) -> str | None:
    for event in trace:
        if event.get("kind") == "tool_call" and event["name"] in FORBIDDEN:
            return f"forbidden:{event['name']}"
        if event.get("name") == "lookup_account" and "account_id" not in event.get("args", {}):
            return "lookup_without_id"
    return None`,
        },
      ],
    },
    {
      id: "path-metrics",
      level: "intermediate",
      title: "When you care about the route, not only the crime",
      body: [
        "After hard fails, you may want to know whether the helper took a reasonable route. A golden path is an example route you wrote down: lookup, then answer. You compare the trace to that example.",
        "Four simple ideas. Did it call the tools it should (recall of the path)? Did it avoid extra tools (precision)? Did the order make sense (lookup before refund)? Did it take a long scenic route (efficiency)? You do not need the academic names to use the ideas.",
        "A correct answer after three wrong lookups is still a smell. It may pass a safety check and fail an efficiency check. That is useful: you will not page security, but you will fix the tool descriptions.",
        "What are we trying to do? Score extra tools without failing a legal detour. Here is a small version: required set, forbidden set, and a step cap.",
        "Let's understand what just happened. The golden path is not a prison. It is a reference. Allow harmless extras if you must, but never allow the forbidden set. Order matters for writes: refund before lookup is a fail even if both tools are legal.",
      ],
      codes: [
        {
          title: "Required, forbidden, and a cap",
          language: "python",
          code: `def score_path(trace, required, forbidden, max_steps=6) -> dict:
    names = [e["name"] for e in trace if e["kind"] == "tool_call"]
    return {
        "hard_fail": any(n in forbidden for n in names),
        "missed": [n for n in required if n not in names],
        "extra": [n for n in names if n not in required and n not in forbidden],
        "too_long": len(names) > max_steps,
    }`,
        },
      ],
      diagrams: [
        {
          title: "Golden path versus a leak path",
          caption:
            "Missing a required lookup is a quality miss. Hitting a forbidden export is a hard fail.",
          chart: chart(
            `flowchart TD
    Gold([Golden: lookup then answer]) --> Ok[Pass]
    Extra[Lookup, extra search, answer] --> Soft[Soft penalty]
    Leak[Export then lookup then answer] --> Hard([Hard fail])
    Order[Refund then lookup] --> Hard`,
            `class Gold,Ok,Hard hub
    class Extra,Soft grp1
    class Leak,Order grp3`
          ),
        },
      ],
    },
    {
      id: "judge-last",
      level: "intermediate",
      title: "Asking a model to judge, last and carefully",
      body: [
        "Some questions are fuzzy. Was the tone kind? Did the refusal explain what was missing? For those, people use another model as a judge. Give that judge a short rubric: yes/no questions, not 'score from 1 to 10', which wanders.",
        "The judge is as fallible as the actor. It likes long answers. It can be fooled by confident prose. Never let a judge override a hard fail. If export_contacts ran, the run is failed even if the judge loved the final paragraph.",
        "Calibrate: take a pile of traces humans already labelled, run the judge, and see where they disagree. If they disagree a lot, fix the rubric or stop using a judge for that question. A judge you have never checked is a second untested helper.",
        "They look similar, judge and actor. The important difference is job. The actor may call tools. The judge should not. If your judge has tools, you have built another agent and called it eval.",
        "Connect this back to RAG. A judge that only sees the final sentence will miss an ungrounded cite. Give the judge the retrieved chunk ids, or skip the judge and verify ids in code — the cheap check is better.",
      ],
      diagrams: [
        {
          title: "Hard checks, then maybe a judge",
          caption:
            "A judge never gets to pardon a forbidden tool.",
          chart: chart(
            `flowchart TD
    Trace([Trace]) --> Hard{Hard checks pass?}
    Hard -->|no| Fail([Fail])
    Hard -->|yes| Path{Path scores ok?}
    Path -->|no| FailSoft[Quality fail]
    Path -->|yes| Fuzzy{Need a fuzzy grade?}
    Fuzzy -->|no| Pass([Pass])
    Fuzzy -->|yes| Judge[Model judge]
    Judge --> Pass`,
            `class Trace,Fail,Pass hub
    class Hard,Path,Fuzzy grp1
    class FailSoft,Judge grp2`
          ),
        },
      ],
    },
    {
      id: "when-you-run-them",
      level: "intermediate",
      title: "How the pieces connect: three times to run evals",
      body: [
        "On a pull request, run a small set that must stay green: hard fails, a handful of golden paths. Fast enough to block a merge. If this set is huge, people will skip it.",
        "At night, run the larger set, including judge cases and slower tools. Morning is for a report, not for a deploy freeze you notice at 17:00.",
        "In production, you cannot score every run with a judge. Sample. Watch rates: forbidden-tool attempts, budget halts, human reversals. A spike is an alert, not a slide.",
        "Goldens should come from real misses, not from imagination. When production does something ugly, shrink that trace, remove personal data, freeze it as a case. The spreadsheet incident should have become case #1 the same week.",
        "At this point you should know the rhythm: cheap checks on every PR, broader set at night, samples in prod, new goldens from scars.",
      ],
      diagrams: [
        {
          title: "Three cadences, three jobs",
          caption:
            "Pull requests protect the floor. Night finds drift. Production tells you the floor moved.",
          chart: chart(
            `flowchart TD
    PR([Pull request]) --> Small[Hard fails plus a few goldens]
    Night([Nightly]) --> Broad[Full set plus judges]
    Prod([Live traffic]) --> Sample[Sampled traces and rates]
    Scar[Ugly production run] --> Golden[New frozen case]
    Golden --> Small
    Golden --> Broad`,
            `class PR,Night,Prod,Scar hub
    class Small,Broad,Sample,Golden grp1`
          ),
        },
      ],
    },
    {
      id: "recovery",
      level: "advanced",
      title: "Did it recover, or did it get lucky?",
      body: [
        "The simple scores assume a happy tool. Real tools time out. A robust helper tries once, then tells the truth. A lucky helper's first try works in your eval set and fails on Monday.",
        "Fault injection means you deliberately fail a tool in the harness and see what the path does. Does it retry forever? Does it call a forbidden fallback? Does it refuse cleanly? Recovery is the name for 'it hit a fault and still behaved'.",
        "Rank outcomes. Best: fault, one retry, correct answer. Fine: fault, honest refusal. Bad: fault, forbidden tool. Worse: fault, a guessed answer that looks correct. Last-token evals score that last one as a pass.",
        "What are we trying to do? Fail a run that, after a timeout, exports everything to 'be helpful'. Here is a small harness idea: wrap the tool, raise once, then score the path with the same hard checks.",
        "Let's understand what just happened. You did not ask a judge 'was this resilient?'. You created a timeout and reused the forbidden-tool check. Recovery evals are mostly still deterministic if you designed the doors in the loop.",
      ],
      codes: [
        {
          title: "Fail the tool once, then score the path",
          language: "python",
          code: `def with_one_timeout(fn):
    state = {"n": 0}

    def wrapped(**args):
        state["n"] += 1
        if state["n"] == 1:
            raise TimeoutError("injected")
        return fn(**args)

    return wrapped

def recovery_ok(trace) -> bool:
    return hard_fail(trace) is None and trace[-1]["kind"] in {"final", "halt"}`,
        },
      ],
    },
    {
      id: "ratchet",
      level: "advanced",
      title: "Do not let the score slide backwards",
      body: [
        "A regression ratchet means a case that once failed, then you fixed it, must not fail again without a loud fight. When you add the spreadsheet case, it stays in the PR set. A 'better' model that reintroduces export_contacts cannot merge.",
        "Stratify production samples. If you only sample random chats, you will mostly score 'hello' and miss the rare export. Oversample writes, denials, and high-amount refunds. Rare is where the incident lives.",
        "Trade-off: more path evals mean slower pipelines and more brittle goldens when you rename a tool. Version the cases. When you rename lookup_account to lookup_account_v2, update the golden on purpose. Silent mismatch is a red that nobody believes.",
        "When not to build a huge judge farm: your failures are still of the spreadsheet kind. Fix recording and hard checks first. Judges will not save an untraced system.",
        "The person who can teach this now says: record the path, fail illegal steps first, score routes second, judge last, inject faults, freeze scars, and never let a last sentence pardon a leak.",
      ],
      codes: [
        {
          title: "A scar becomes a frozen case",
          language: "python",
          code: `def freeze(trace: list[dict], case_id: str) -> dict:
    return {
        "id": case_id,
        "required": ["lookup_account"],
        "forbidden": ["export_contacts"],
        "events": strip_secrets(trace),
    }`,
        },
      ],
    },
  ],

  workedExample: {
    title: "Catch the anonymous contact export with a path eval",
    setup:
      "The helper is asked for account 18's phone number. An old export_contacts tool is still registered. Final-answer eval is at 94%.",
    walkthrough: [
      "Step 1 — Understand the problem. Last-sentence match cannot see the extra tool.",
      "Step 2 — Identify the relevant concept. A trajectory: ordered events, then a forbidden-tool check.",
      "Step 3 — Build the simplest recorder. Log tool name and args on every call. Log the final text.",
      "Step 4 — Improve it. Add hard_fail(FORBIDDEN). Add a golden: required lookup_account with account_id=18.",
      "Step 5 — Handle a failure. A run answers correctly after export_contacts. hard_fail returns forbidden:export_contacts. PR goes red. The 94% slide is irrelevant.",
      "Step 6 — Production. Remove or lock the tool. Freeze this trace as a golden. Sample live writes. Ratchet: this case stays in the merge set when you change models.",
    ],
    result:
      "The leak fails in CI. A correct sentence is no longer a pass. The next model change cannot quietly bring the tool back.",
  },

  practice: {
    title: "Trajectory evals for a code-fixing helper",
    task:
      "A helper can read a file, edit a file, and run tests. You care that it does not edit files outside the repo and that it runs tests after an edit. Problem: list hard checks, one golden path, and one fault-injection case. Think about: last-token 'the tests passed' can be a lie.",
    hint:
      "Forbidden: paths outside the repo. Required after edit: run_tests. Inject a test failure and expect a halt or a second edit, not a claimed pass. Expected reasoning: do not judge the prose first.",
    solution:
      "Hard: any edit path that does not start with repo/. Hard: edit without a later run_tests. Golden: read, edit, run_tests, final. Fault: run_tests returns fail once; fail the case if final claims pass without another run_tests. Why this works: the path is evidence. Common wrong approach: a judge that reads 'I ran the tests and they passed' and believes it.",
  },

  takeaways: [
    "Two runs can share a last sentence and differ by a leak. Score the path.",
    "A trajectory is the ordered record of context, tools, arguments, results, gates, and the final text.",
    "Deterministic checks — forbidden tools, missing ids, extra writes — come before any model judge.",
    "A golden path is a reference route. Use it for missing steps and wild detours, not as the only pass rule.",
    "A judge is last, calibrated, and never allowed to pardon a hard fail.",
    "Turn ugly production traces into frozen cases, and inject faults so 'lucky' is not the same as 'robust'.",
  ],

  mistakes: [
    "Mistake: score only the final sentence. Why people make it: it is how chatbots were graded. What actually happens: illegal tools pass. Better approach: a flight recorder and hard checks.",
    "Mistake: log tools but not arguments. Why people make it: privacy fear, or sloppy logging. What actually happens: you cannot see an unfiltered export. Better approach: log args, de-identify later for goldens.",
    "Mistake: start with an LLM judge. Why people make it: it feels advanced. What actually happens: soft scores, extra cost, leaks still green. Better approach: yes/no checks first.",
    "Mistake: let the judge override a hard fail. Why people make it: the paragraph was lovely. What actually happens: the spreadsheet ships. Better approach: hard fail is final.",
    "Mistake: invent all goldens on a whiteboard. Why people make it: prod data feels messy. What actually happens: you never test the incident you already had. Better approach: freeze scars.",
    "Mistake: sample production uniformly. Why people make it: simple metrics. What actually happens: you grade hellos and miss writes. Better approach: oversample dangerous paths.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "Why is a correct final answer not enough to pass an agent eval?",
      answer:
        "What they are testing: the story. Good answer: the helper may have used a forbidden tool or the wrong tenant on the way. Why that is good: path versus last token. Follow-up: what must you record to see that?",
    },
    {
      difficulty: "medium",
      question: "What do you run on every pull request versus at night?",
      answer:
        "What they are testing: cadence. Good answer: PR gets fast hard checks and a few goldens; night gets the full set and judges. Why that is good: it is operable. Follow-up: what do you do with a new production incident?",
    },
    {
      difficulty: "hard",
      question: "How would you tell a robust helper from a lucky one?",
      answer:
        "What they are testing: recovery. Good answer: inject a timeout or empty retrieval and score the path — one retry and an honest halt is robust; a guessed final or a forbidden fallback is not. Why that is good: it uses doors you already taught. Follow-up: where does that case live after you write it?",
    },
  ],

  glossary: [
    {
      term: "Trajectory",
      meaning:
        "The ordered story of a run: inputs, tool calls, results, gates, and the final output. Why it matters: this is what you score when last tokens lie.",
    },
    {
      term: "Trace",
      meaning:
        "The recorded events that make a trajectory inspectable. Why it matters: you cannot grade a path you did not write down.",
    },
    {
      term: "Deterministic check",
      meaning:
        "A yes/no test that always agrees with itself on the same trace, with no judge model. Why it matters: this is how you catch forbidden tools cheaply.",
    },
    {
      term: "Golden path",
      meaning:
        "A reference sequence of steps for a case. Why it matters: it lets you see missing or extra tools.",
    },
    {
      term: "LLM-as-judge",
      meaning:
        "Using a model to grade fuzzy qualities after hard checks pass. Why it matters: it is useful late, and dangerous as the only score.",
    },
    {
      term: "Fault injection",
      meaning:
        "Deliberately breaking a tool in the harness to see if the path stays safe. Why it matters: luck is not robustness.",
    },
  ],
};
