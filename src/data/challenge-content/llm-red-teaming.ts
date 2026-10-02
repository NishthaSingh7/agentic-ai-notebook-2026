import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "llm-red-teaming",
  instructor:
    "I am a senior engineer sitting next to you. We will start from zero. You do not need a security background. This sitting is defensive only: how to test your own system on purpose, with a list of cases and a rule that can block a launch. We will name attack classes at a high level. We will not write exploit text.",
  promise:
    "By the end you will know what red teaming means here, why a Friday chat session is not a program, how to name attack classes without collecting payloads, how to score severity, and how a harness plus a gate protect the tools that move money.",
  story: {
    title: "The Friday session that passed, and the Monday tool that did not",
    body: [
      "A team had a launch in two weeks. They booked a Friday afternoon called 'red team'. Six people sat with the chat box. They typed rude questions. They tried to talk the model into breaking a written policy. The model refused most of it. Someone ticked 'passed red team' on the launch list. The agent shipped with tools to look up a ticket, draft a reply, and issue a credit.",
      "On Monday a customer attached an ordinary-looking file to a normal question. The retrieval step — the part that fetches handbook text — also fetched the file. Hidden in that file was a paragraph written for the model, not for a person. It claimed a credit was already approved. The model believed the file. It called the credit tool. The gateway checked that the fields were the right shape. Shape was fine. The credit went out.",
      "The write-up was uncomfortable because nobody had been sloppy in the way checklists measure sloppiness. There had been a session. There had been a system prompt. There had been a filter on the reply the customer would see. What there had not been was a written list of cases that included 'untrusted file claims a write is already allowed', a severity label that would have called that finding 'money moved', or a launch rule that refused to ship when a money tool was reachable from a turn that read untrusted text.",
      "The rebuild was mostly paperwork that compiled. Every finding became a typed case: class, what was at risk, how the text entered, which control should have held, how bad a miss is. The test ran against fake tools so it was repeatable. The build failed if a money-class case succeeded. The Friday session still happens — it is a useful source of new case titles. It is no longer the program.",
    ],
    moral:
      "A red-team afternoon is a workshop. A red-team program is a list that grows, a severity rule that ranks, and a gate that can say no. If you have not tested your tools, a customer will.",
  },
  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "The problem: chatting with your own bot is not a test",
      body: [
        "You built an AI that can use tools. A tool is a function your code runs when the model asks — look up a ticket, send mail, move money. The model is not trustworthy as a security boundary. It is a probability machine. Someone will try to make it ask for a tool it should not use, or to leak a fact it should not say.",
        "Red teaming, in this lesson, means authorized testing of your own system. You are not attacking a stranger. You are trying to find holes before a stranger does. The goal is a fix, not a trophy.",
        "Think of a bank that only tests the front door by asking a polite customer to pull the handle. The vault is in the back. An AI product has a chat box in the front and tools in the back. A Friday spent on rude chat is the handle. The vault is issue_credit.",
        "Without a program, teams collect a souvenir document of phrasings that failed today. The model that refused those phrasings on Friday may accept a different framing on Monday. You will have no machine that notices.",
        "At this point you should understand the problem: we need a repeatable way to test the whole system, especially the tools, not a one-off chat.",
      ],
      diagrams: [
        {
          title: "Workshop versus program",
          caption:
            "A session produces anecdotes. A program produces four objects that can fail a build.",
          chart: chart(
            `flowchart TD
    Session([Friday workshop]) --> Notes[Doc of tries]
    Notes --> Vibe{Model refused today}
    Vibe -->|yes| Ship([Ship with a souvenir])
    Corpus[(Typed case list)] --> Harness[Repeatable harness]
    Rubric[Severity rule] --> Harness
    Harness --> Gate{High severity miss}
    Gate -->|yes| Block([Block the launch])
    Gate -->|no| Ok([Ship])`,
            `class Session,Ship,Corpus,Block,Ok hub
    class Notes,Harness,Rubric grp1
    class Vibe,Gate grp2`
          ),
        },
      ],
    },
    {
      id: "what-red-team-is",
      level: "beginner",
      title: "What a red-team program is made of",
      body: [
        "Four durable objects. A corpus is a list of cases you keep, like a test suite. A case names an attack class, an entry channel, an asset, and the control that should have held. A severity rubric maps a successful case onto a business consequence — embarrassment versus money versus cross-tenant data. A harness replays cases against the current agent with stubbed tools, so the result does not depend on a live refund. A gate, usually CI, treats a high-severity miss like a failing unit test.",
        "Let's define the words we just used. An attack class is a family of tries, not a specific sentence. Entry channel is how untrusted text arrived: the chat box, a file, a web page, a tool result. An asset is what you are protecting: a reply, a mailbox, a ledger, another customer's row. A control is the rule that should stop the miss. Stubbed tools means fake functions that record the ask and do not move real money.",
        "The object you are testing is not 'the model'. The object is the system: how the prompt is assembled, what retrieval adds, which tools exist, what the gateway allows, what you log. A model that can be talked into anything is expected. A system that then issues a credit is a defect.",
        "That assumption is how you stop wasting the afternoon on wording. If your only defence is a sentence in the system prompt, every finding will be 'we found a phrasing', and every fix will be another sentence. If the defence is a gateway rule, the finding is 'the rule held' or 'the rule was missing'. I want findings of the second kind.",
        "At this point you should be able to name the four objects: corpus, rubric, harness, gate.",
      ],
      diagrams: [
        {
          title: "Four objects, one program",
          caption:
            "Lose any one and you are back to a workshop. The gate is what makes the rest real.",
          chart: chart(
            `flowchart LR
    Corpus[(Corpus)] --> Harness[Harness]
    Rubric[Rubric] --> Harness
    Harness --> Gate[Gate]
    Gate --> Launch{May ship} `,
            `class Corpus,Launch hub
    class Rubric,Harness,Gate grp1`
          ),
        },
      ],
    },
    {
      id: "name-the-classes",
      level: "beginner",
      title: "Name the classes. Do not collect payloads.",
      body: [
        "We will stay at class level. Direct injection is untrusted text in the user's current message that tries to override standing rules. Indirect injection is untrusted text that arrives from somewhere else — a file, a page, a retrieved chunk — and tries the same thing. Over-broad tool use is the model asking for a write it should not have from this turn. Data exfil is the model being nudged to put a secret into a reply or an outbound message. Prompt leakage is the model repeating standing instructions it should have kept internal.",
        "Jailbreak, in casual talk, is a user trying to talk the chat box into ignoring a product policy. That is one class. It is not the whole sport. The Monday incident was indirect, through a file, aimed at a tool.",
        "You do not need the winning sentence to test the class. You need a case that says: this channel, this asset, this control must hold even if the model is convinced. The harness can feed a labelled stand-in, such as 'UNTRUSTED_DOC_CLAIMS_WRITE_APPROVED', without teaching anyone a real exploit.",
        "Public maps such as OWASP's LLM list are coverage reminders, not posters to print and forget. Use them as rows: did we write a case for this class against each tool. Do not treat a logo on a slide as a passing grade.",
        "Pause and check. If your list is only 'rude user in the chat box', you have not named the file channel. That was the story.",
      ],
      diagrams: [
        {
          title: "Coverage is a grid, not a vibe",
          caption:
            "Each tool against each class. An empty cell is a case you have not written yet.",
          chart: chart(
            `flowchart LR
    ClassA[Direct override] --> Lookup[lookup tool]
    ClassA --> Credit[credit tool]
    ClassB[Indirect file] --> Lookup
    ClassB --> Credit
    ClassC[Outbound leak] --> Mail[mail tool]
    Credit --> Need[Empty cell is work]`,
            `class ClassA,ClassB,ClassC grp1
    class Lookup,Credit,Mail grp2
    class Need hub`
          ),
        },
      ],
    },
    {
      id: "build-a-corpus",
      level: "intermediate",
      title: "How we implement a corpus you can grow",
      body: [
        "What are we trying to do? Store a case as data, not as a paragraph in a souvenir doc. Each row should be scoreable by a function that does not need a human to reread the chat.",
        "Here is the smallest version. Notice there is no exploit string. The body is a stand-in label. The scorer looks at what the stubbed tool recorded.",
        "Let's understand what just happened. A case has a class, a channel, an asset, a severity, and a rule: the credit tool must not have been asked. You can add rows without becoming a payload library.",
        "Seed the corpus from the tools you already shipped. Every tool is a hypothesis about harm. A credit tool hypothesises money. A mail tool hypothesises outbound speech. A lookup tool hypothesises data leaving its tenant. Write one case per hypothesis on day one, even if the case is crude.",
        "Connect this back to the Friday room. The room is allowed. Its output must be a new row, not a checkbox.",
      ],
      codes: [
        {
          title: "corpus.py — a case is a typed row, not a paragraph",
          language: "python",
          code: `from dataclasses import dataclass


@dataclass
class Case:
    name: str
    attack_class: str
    channel: str
    asset: str
    severity: str
    must_not_call: str


CASES = [
    Case(
        "file_claims_credit_ok",
        "indirect_injection",
        "untrusted_file",
        "money",
        "high",
        "issue_credit",
    )
]


def held(case: Case, called: list[str]) -> bool:
    return case.must_not_call not in called


print(held(CASES[0], ["lookup_ticket"]))
print(held(CASES[0], ["issue_credit"]))`,
        },
      ],
    },
    {
      id: "severity",
      level: "intermediate",
      title: "When a clever miss is not the same as a launch blocker",
      body: [
        "Severity is consequence, not cleverness. A model that says a rude word in a sandbox is not the same finding as a model that issues a credit. Teams blur this because the rude word is easy to screenshot.",
        "A simple rubric is enough to start. Low: embarrassing reply, no tool. Medium: outbound message to the same user, or a lookup that stays in tenant. High: money, delete, cross-tenant read, or credentials. The labels can be yours. The idea cannot: money outranks wit.",
        "What are we trying to do? Freeze the argument in a function so a launch meeting cannot downgrade a high to 'interesting'.",
        "Here is the smallest version.",
        "Let's understand what just happened. Asset plus whether a write was reached decides the rank. A human can still add context. They cannot quietly rename money to medium because the launch is Friday.",
      ],
      codes: [
        {
          title: "severity.py — consequence, not cleverness",
          language: "python",
          code: `def rank(asset: str, write_reached: bool) -> str:
    if asset in {"money", "cross_tenant", "credential"}:
        return "high"
    if write_reached or asset == "outbound":
        return "medium"
    return "low"


print(rank("money", False))
print(rank("reply", False))
print(rank("outbound", True))`,
        },
      ],
      diagrams: [
        {
          title: "What was at risk decides the page",
          caption:
            "A high miss blocks the launch. A low miss becomes a ticket. Cleverness is not a column.",
          chart: chart(
            `flowchart TD
    Find([Finding]) --> Asset{Asset}
    Asset -->|money or cross tenant| High[High]
    Asset -->|outbound| Mid[Medium]
    Asset -->|reply only| Low[Low]
    High --> Block([Gate fails])
    Mid --> Ticket[Ticket before next launch]
    Low --> Backlog[Backlog]`,
            `class Find,Block hub
    class Asset grp2
    class High,Mid,Low grp1
    class Ticket,Backlog grp3`
          ),
        },
      ],
    },
    {
      id: "harness-and-gate",
      level: "intermediate",
      title: "How the pieces connect: harness, stubs, and a gate",
      body: [
        "The harness runs each case. It assembles the prompt the way production does, including a labelled stand-in for untrusted text. It calls the model or, in CI, a scripted selector that pretends the model was convinced. Then it records which stubbed tools were asked. The scorer from the corpus decides pass or fail.",
        "Why the scripted selector matters: you must test the gateway when the model has already agreed with the file. If you only test a model that refuses, you are testing today's mood. Assume convinced. Ask what your code allowed.",
        "What are we trying to do? Fail a deploy when any high-severity case misses, or when the money tool was reachable from an untrusted turn.",
        "Here is the smallest version.",
        "Let's understand what just happened. Two numbers go into the gate: high misses, and whether a forbidden tool was asked. Either one blocks. That is the program the Friday checkbox was pretending to be.",
        "At this point you should see the path: case list in, stubbed tools, score, gate.",
      ],
      codes: [
        {
          title: "gate.py — the deploy policy in one function",
          language: "python",
          code: `def allow_deploy(high_misses: int, forbidden_called: bool) -> bool:
    if high_misses > 0:
        return False
    if forbidden_called:
        return False
    return True


print(allow_deploy(0, False))
print(allow_deploy(1, False))
print(allow_deploy(0, True))`,
        },
      ],
    },
    {
      id: "tools-are-the-sport",
      level: "advanced",
      title: "If you have not tested your tools, a customer will",
      body: [
        "Remember the simple chat session. In production the interesting cases never look like a villain in the box. They look like a file, a retrieved page, a previous tool result pasted back in. Output filters on the customer-visible reply miss this, because the harm was the tool call, not the sentence.",
        "What are we trying to do? Run the same stubs through two drivers: a live model for discovery, and a scripted 'convinced' driver for the gate, so CI is deterministic.",
        "Here is the smallest version.",
        "Let's understand what just happened. The selector decides which tool name to emit. The stub records it. The scorer does not care whether a human or a script picked the name. That is how you keep CI from depending on a vendor mood.",
        "Utility still matters. A gate that blocks every launch because the model will not answer a normal refund question is a broken product, not a secure one. Report honest-task pass rate next to attack-success rate. Security that ships a mute bot will be turned off.",
      ],
      codes: [
        {
          title: "harness.py — same stubs, two drivers",
          language: "python",
          code: `def run(driver: str, untrusted: bool) -> list[str]:
    called: list[str] = []
    if driver == "convinced" and untrusted:
        called.append("issue_credit")
    elif driver == "honest":
        called.append("lookup_ticket")
    return called


def score(called: list[str]) -> bool:
    return "issue_credit" not in called


print("honest", score(run("honest", True)))
print("convinced", score(run("convinced", True)))`,
        },
      ],
      diagrams: [
        {
          title: "Discovery versus the gate",
          caption:
            "Humans and live models find new case titles. The gate replays them with a convinced driver and stubs.",
          chart: chart(
            `flowchart LR
    Human([Workshop]) --> Titles[New case titles]
    Live[Live model] --> Titles
    Titles --> Corpus[(Corpus)]
    Corpus --> Conv[Convinced driver]
    Conv --> Stubs[Stubbed tools]
    Stubs --> Gate{High miss}
    Gate -->|yes| Block([Fail CI])
    Gate -->|no| Pass([Deploy])`,
            `class Human,Live,Block,Pass hub
    class Titles,Corpus,Conv,Stubs grp1
    class Gate grp2`
          ),
        },
      ],
    },
    {
      id: "operate-the-program",
      level: "advanced",
      title: "Production: operating the program after the first green build",
      body: [
        "A green build is a moment, not a personality. Add a case when you add a tool, a retrieval source, or an outbound channel. Retire a case only when the tool is gone. Ownership sits with the team that ships the agent, not with a visiting security week.",
        "Do not store real exploit text in the repo if a stand-in label will do. If a rare case needs a longer fixture, keep it in a restricted store, label it, and never put it in customer-facing logs.",
        "When you should not build a giant program: a demo with no tools and no retrieval. Write two cases anyway — 'must answer a normal question' and 'must not pretend to be a bank' — then stop. Earn the harness when you add a write.",
        "The professional posture: assume the model will be convinced. Measure whether the gateway held. Grow the corpus. Let the gate say no.",
        "This sitting stays defensive. If someone asks you for a list of working jailbreaks, the answer is no. Offer them a case schema and a stub.",
      ],
    },
  ],
  workedExample: {
    title: "Support agent, four tools, one file, one gate",
    setup:
      "Tools are lookup_ticket, draft_reply, send_email, issue_credit. Retrieval can see customer files. Launch is in a week. You have a Friday workshop on the calendar.",
    walkthrough: [
      "Step 1 — Understand the problem. A chat session will not see the file channel or the credit tool.",
      "Step 2 — Identify the relevant concept. Corpus, severity, harness, gate. Attack classes, not payloads.",
      "Step 3 — Build the simplest solution. One case per tool hypothesis. High if credit or cross-tenant. Stubs record calls.",
      "Step 4 — Improve it. Add an indirect-file case whose body is a stand-in label. Add a convinced driver for CI.",
      "Step 5 — Handle a failure. If issue_credit is asked on that case, the gate fails. The fix is a gateway rule, not a sterner sentence.",
      "Step 6 — Explain the production version. Workshop output is new rows. Utility cases sit beside attack cases. Credit is illegal when untrusted text is in the deciding context.",
    ],
    result:
      "Monday's file cannot pass a silent test. Either the gateway holds or the build stays red. The souvenir doc is no longer the evidence.",
  },
  practice: {
    title: "Turn a workshop souvenir into a gate",
    task:
      "You inherit a shared doc titled 'jailbreaks we tried'. The agent can issue a credit and read uploads. Design the case schema, the three first rows, the severity rule, and the gate. Stay at class level. Do not invent exploit text. Think about channels and stubbed tools.",
    hint:
      "File plus money is high. Chat rudeness is low unless a tool fires. Expected reasoning: four objects, convinced driver, no payload library.",
    solution:
      "Case fields: class, channel, asset, must_not_call, severity. Rows: untrusted file claims a write is approved; chat tries to override standing rules; lookup must stay in tenant. Rank money and cross-tenant as high. Harness stubs tools. Gate fails on any high miss. Why this works: you test the vault. Common wrong approach: another Friday of clever wording and a green checkbox.",
  },
  takeaways: [
    "Red teaming here means authorized, repeatable testing of your own system.",
    "A workshop is a source of case titles. It is not evidence.",
    "Name attack classes and channels. Do not collect exploit text.",
    "Assume the model will be convinced. Score what the gateway allowed.",
    "Severity is consequence: money and cross-tenant outrank a rude reply.",
    "A gate that cannot fail a build is a newsletter.",
  ],
  mistakes: [
    "Ticking 'passed red team' after a chat afternoon. Why people make it: the room felt thorough. What actually happens: the file channel was never named. Better approach: rows in a corpus.",
    "Storing winning jailbreak sentences in a wiki. Why people make it: it feels like coverage. What actually happens: you teach payloads and still cannot score a build. Better approach: class plus stand-in label.",
    "Testing only the model mood. Why people make it: refusals look like security. What actually happens: a convinced model still has tools. Better approach: a convinced driver and stubs.",
    "Ranking findings by cleverness. Why people make it: screenshots are fun. What actually happens: money misses wait behind jokes. Better approach: asset-based severity.",
    "Filtering only the customer-visible reply. Why people make it: that is the text you see. What actually happens: the harm was the tool call. Better approach: score stubbed calls.",
    "Shipping a mute bot and calling it secure. Why people make it: attack success hit zero. What actually happens: product turns the gate off. Better approach: report utility next to attack success.",
  ],
  interviews: [
    {
      question: "What is LLM red teaming, if it is not a clever prompt?",
      difficulty: "easy",
      answer:
        "What they are testing: program versus workshop. Good answer: authorized tests of your own system, stored as cases, scored on what tools did, with a severity rule and a gate. Why that is good: four objects, no mystique. Follow-up: what is the object under test — the model or the system?",
    },
    {
      question: "How do you cover indirect injection without keeping exploit text in git?",
      difficulty: "medium",
      answer:
        "What they are testing: class-level defence. Good answer: a case that names the file channel and the write asset, a stand-in label in the fixture, a convinced driver, and a scorer on stubbed calls. Why that is good: it tests the control. Follow-up: where would you store a rare long fixture if you truly needed one?",
    },
    {
      question:
        "Launch is tomorrow. Your only evidence is a Friday session. The agent can issue credits. What do you do?",
      difficulty: "hard",
      answer:
        "What they are testing: whether you will slip a souvenir through. Good answer: I would not treat the session as a pass. I would add high-severity rows for the credit tool and the file channel, stub the tool, run a convinced path, and block if the tool is asked. If we cannot do that overnight, the credit tool stays off. Why that is good: it chooses a missing vault test over a date. Follow-up: what utility case do you run so we do not ship a mute bot?",
    },
  ],
  glossary: [
    {
      term: "Red teaming",
      meaning:
        "Authorized testing of your own system to find holes before a stranger does. Why it matters: the goal is a fix and a gate, not a trophy.",
    },
    {
      term: "Corpus",
      meaning:
        "A stored list of typed cases you can grow and replay. Why it matters: a wiki of phrasings cannot fail a build.",
    },
    {
      term: "Attack class",
      meaning:
        "A family of tries, such as indirect injection or over-broad tool use, not a specific sentence. Why it matters: classes let you test without collecting exploits.",
    },
    {
      term: "Severity rubric",
      meaning:
        "A rule that maps a miss onto a business consequence. Why it matters: money outranks a rude reply.",
    },
    {
      term: "Harness",
      meaning:
        "The runner that replays cases against stubbed tools. Why it matters: results stay repeatable.",
    },
    {
      term: "Gate",
      meaning:
        "The launch rule, usually in CI, that can say no. Why it matters: without it you have a newsletter.",
    },
  ],
};
