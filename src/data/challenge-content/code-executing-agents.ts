import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "code-executing-agents",
  instructor:
    "I teach this from zero. If you have never seen a model write Python, that is fine. We will start with why a fixed list of tools runs out of road, then what 'run the model's code' means, then why that code must sit in a locked room you designed.",
  promise:
    "You will leave knowing when it helps to let a model write code, how a tiny executor works, what a sandbox is protecting you from, and why network, files, and time are the real lesson — not a fancier prompt.",

  story: {
    title: "The notebook that reached the warehouse",
    body: [
      "An analytics team built an 'ask your data' helper. Instead of offering three fixed buttons — sum this column, filter that date — they let the model write Python, the same language their analysts already used. The pitch was reasonable. A new chart should not need a new button. In testing they used a small spreadsheet already sitting on the worker. The answers looked great.",
      "A vice president asked, in chat, to 'pull the latest numbers from the warehouse and compare last week's groups to the board deck'. The model wrote a short script. The script imported a library that can make web requests and called an internal address it had seen in a comment. The worker had permission to read that address. The answer came back in twelve seconds and went into a slide.",
      "The same afternoon an engineer said 'you can use the system if you need to'. The model generated a command that reached the public internet from the same worker. A later review found many outbound requests this helper had been allowed to make, including one that returned cloud credentials the worker already had in its environment. Nobody had asked the model to steal anything. The room had simply been left open.",
      "The rebuild kept code execution and closed the room. Each run got a fresh locked-down environment: no network, a read-only folder of files someone had already chosen, a short time limit, and a small memory cap. The model could still write table code. It could not wander. A separate, reviewed tool was the only way to fetch a bounded extract into that folder first.",
    ],
    moral:
      "Letting a model write code is inviting a stranger to run a program. The model may compute. It must not roam. Network, files, and time are the jail, not extras you add later.",
  },

  stages: [
    {
      id: "why-code-at-all",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Let us start from zero. A lot of AI helpers work by offering the model a menu of tools. A tool is a named action the program already knows how to do, such as 'look up an order' or 'search the docs'. The model picks a name and fills in a few fields. That is safe and clear when the action is one you planned for.",
        "It fails when the user asks for a calculation you did not put on the menu. 'Show me conversion by week for users who signed up on a Tuesday and refunded once.' You can keep adding tools forever, or you can let the model write the ten lines an analyst would have written.",
        "That is the problem this sitting solves: some questions are programs, not button clicks. If you only offer buttons, you either refuse the question or you pretend the model can do the arithmetic in English. Models drop digits in English. They are much better at writing `converted / sent` and letting a computer run it.",
        "Here is a tiny picture. A calculator app with four buttons is easy to trust. A calculator that also accepts a blank page of instructions is more powerful and much easier to misuse. Code-executing agents are the blank page.",
        "At this point you should understand the why: we let the model write code when the work is computation over data we already decided it may see — not because code sounds smarter than tools.",
      ],
      diagrams: [
        {
          title: "A menu versus a blank page",
          caption:
            "Named tools are buttons you designed. Code execution is a page the model fills in.",
          chart: chart(
            `flowchart LR
    Q([Question]) --> Menu[Named tools]
    Q --> Page[Model writes a program]
    Menu --> Safe[Only actions you listed]
    Page --> Power[Any computation the room allows]`,
            `class Q hub
    class Menu,Safe grp1
    class Page,Power grp2`
          ),
        },
      ],
    },
    {
      id: "what-code-execution-means",
      level: "beginner",
      title: "What it means for a model to write code",
      body: [
        "Everyday picture: you ask a colleague to total a spreadsheet. They do not recite the sum from memory. They type a short program, run it, and read the printout. The program is the work. The printout is the answer.",
        "A code-executing agent does the same thing. The model writes a snippet. Your program runs that snippet in a place you control. The snippet prints text. The model reads the text and then either writes more code or answers the user. Write, run, read. That is the whole cycle.",
        "This is different from tool calling. They look similar because both 'do something'. The important difference is who invented the action. With a named tool, you invented it. With code execution, the model invents the steps, and your job is to decide which steps are even possible.",
        "The simplest example is three numbers. User: 'average 4, 8, 15'. The model writes `print((4+8+15)/3)`. Your runner prints `9.0`. The model says '9'. Nobody needed a custom `average` tool.",
        "Why does the term matter? Because teams say 'the model can run code' when they mean 'we passed a string to eval on the web worker'. Running is the easy half. The room the code runs in is the product.",
      ],
      diagrams: [
        {
          title: "Write, run, read the printout",
          caption:
            "The model never 'does math in its head' for the hard part. A computer runs the snippet and returns text.",
          chart: chart(
            `flowchart TD
    Ask([User question]) --> Write[Model writes a snippet]
    Write --> Run[Your runner executes it]
    Run --> Print[Printed text]
    Print --> Decide[Model reads the printout]
    Decide -->|need more| Write
    Decide -->|enough| Reply([Answer])`,
            `class Ask,Reply hub
    class Write,Decide grp1
    class Run,Print grp2`
          ),
        },
      ],
    },
    {
      id: "simplest-executor",
      level: "beginner",
      title: "The simplest version: run a tiny snippet",
      body: [
        "What are we trying to do? Take a short string of Python, run it, and return whatever it printed. No files. No network. A clock that stops the run if it takes too long.",
        "Here is the smallest version. We write the snippet to a temp file, start a new Python process, wait a few seconds, and collect stdout — the text the program printed. If the clock runs out, we kill the process and tell the model the run was stopped.",
        "Let's understand what just happened. The model did not run anything. Your process did. That split is the first safety rule. If the model's text is the same process as your web server, a bad snippet can take the server down with it. A child process you can kill is already a better room.",
        "This tiny runner is enough for `print(2+2)` and already dangerous for anything else. It still shares the same machine, the same files, and the same network as the parent unless you close those doors. We have not closed them yet. We have only shown the cycle.",
        "At this point you should understand the simplest version: a string in, a printout out, a time limit. Next we lock the room.",
      ],
      codes: [
        {
          title: "tiny_exec.py — run a string, get text back",
          language: "python",
          code: `import subprocess, tempfile, textwrap
from pathlib import Path


def run_snippet(src: str, seconds: int = 3) -> str:
    with tempfile.TemporaryDirectory() as tmp:
        file = Path(tmp) / "snippet.py"
        file.write_text(textwrap.dedent(src))
        try:
            done = subprocess.run(
                ["python", str(file)],
                capture_output=True,
                text=True,
                timeout=seconds,
            )
        except subprocess.TimeoutExpired:
            return "stopped: time limit"
        out = (done.stdout or "") + (done.stderr or "")
        return out[:4000]`,
        },
      ],
    },
    {
      id: "jail-the-room",
      level: "intermediate",
      title: "How we implement the locked room",
      body: [
        "The tiny runner shares the house with your product. The next idea is a sandbox: a room with only the doors you opened. Everyday picture: a guest can use the kitchen table and the mixing bowl. They cannot open the front door, rummage the filing cabinet, or stay all night.",
        "What are we trying to do? Default deny. No outbound network. No writes outside a disposable folder. No extra programs. A memory cap. A time cap. A list of files you copied in on purpose. Everything else is closed.",
        "Here is a defensive checklist, not an attack catalog. Before you start the process, decide the four doors: network, filesystem, time, and memory. If a door is not required for this question, leave it closed. The model does not get a vote.",
        "Let's understand why a word filter is not a jail. Blocking the letters `import os` in the snippet is a hope. The model can write the same idea another way, or you will miss a library you did not think of. A real jail is enforced by the operating system and the container, not by searching the source for scary words.",
        "Connect this back to the story. The warehouse call was a network door left open. The credentials leak was an environment door left open. Closing those doors would have kept the computation and dropped the roam.",
      ],
      codes: [
        {
          title: "jail.py — close doors, then run",
          language: "python",
          code: `ALLOWED_IMPORTS = {"math", "statistics", "json", "csv"}


def review_imports(src: str) -> str | None:
    """Refuse unknown imports. This is a seatbelt, not the jail."""
    for line in src.splitlines():
        stripped = line.strip()
        if stripped.startswith("import ") or stripped.startswith("from "):
            name = stripped.split()[1].split(".")[0]
            if name not in ALLOWED_IMPORTS:
                return f"blocked import: {name}"
    return None


def policy(src: str) -> str | None:
    if "open(" in src and "data/" not in src:
        return "blocked: only files under data/ are in the room"
    return review_imports(src)`,
        },
      ],
      diagrams: [
        {
          title: "Compute versus roam",
          caption:
            "The model may use the table you set. The front door, the filing cabinet, and the clock are yours.",
          chart: chart(
            `flowchart TD
    Snip([Model snippet]) --> Check{Doors you allow}
    Check -->|closed| Refuse([Refuse and tell the model])
    Check -->|open| Room[Disposable room]
    Room --> Net[Network: off]
    Room --> Files[Files: chosen folder only]
    Room --> Clock[Time and memory caps]
    Files --> Out([Printout or timeout])
    Clock --> Out`,
            `class Snip,Refuse,Out hub
    class Check,Room grp1
    class Net,Files,Clock grp2`
          ),
        },
      ],
    },
    {
      id: "when-simple-fails",
      level: "intermediate",
      title: "When the simple jail is not enough",
      body: [
        "The simple jail still fails if the data in the room is too wide. If you copy the whole warehouse extract into the folder 'just in case', the model can print columns you never meant a chat user to see. The room is only as tight as the files you put on the table.",
        "Here is the key idea. Fetching data is a separate, reviewed tool. That tool takes a query you already approved a shape for — a date range, a team id — and writes a small file into the room. The model then computes on that file. The model does not fetch.",
        "They look similar because both 'get numbers'. The important difference is who decides the bounds. A fetch tool has a schema and an audit log. A snippet that can reach any address has neither.",
        "Another break: a hung loop. `while True: pass` is not clever. It is a spinner. The time cap is the door. When it opens, you return 'stopped: time limit' and you do not retry the same snippet. One retry with a shorter snippet is a product choice. Infinite retries are the warehouse story in a new costume.",
        "Pause and check. If the snippet prints a stack trace that includes file paths from your machine, should you send that text back to the model and the user? No. Return a short, redacted error. The printout is also an information channel.",
      ],
    },
    {
      id: "how-it-fits",
      level: "intermediate",
      title: "How the pieces connect in a real product",
      body: [
        "Put the pieces on one path. The user asks a question. A planner model decides: named tool, or code in the room. If code, a fetch tool may first place a bounded file in the room. Then the executor runs a snippet with the four doors closed. The printout goes back to the model. The model either writes another snippet or answers the user.",
        "Budget the cycle. Three write-run turns is plenty for a table question. After that, stop and say you could not finish. A code agent that never answers is a worker burning CPU in a locked room — still a cost, still a wait.",
        "Show the user the answer and, if you must, a short description of the computation. Do not show raw snippets that include internal paths. Keep a trace for yourself: which files were in the room, how long the run took, whether the policy refused an import, which door opened.",
        "Connect this back to named tools. Reads of approved data and writes that change the world still belong on the menu. Code execution is for arithmetic, reshaping, and charts over data already in the room. If you can write the action as a one-line tool, prefer the tool.",
        "At this point you should be able to point at any 'code interpreter' product and find the same parts: a planner, a disposable room, a fetch door you own, and a narrator that reads printouts.",
      ],
      diagrams: [
        {
          title: "Planner, room, narrator",
          caption:
            "The model never fetches. A reviewed tool places a file. The room only computes.",
          chart: chart(
            `flowchart TD
    Q([Question]) --> Plan[Planner]
    Plan -->|named tool| Tools[Existing tools]
    Plan -->|code| Fetch[Reviewed fetch into folder]
    Fetch --> Room[Locked room]
    Room --> Print[Printout]
    Print --> Talk[Model answers or writes again]
    Tools --> Talk
    Talk --> A([User sees an answer])`,
            `class Q,A hub
    class Plan,Talk grp1
    class Tools,Fetch grp2
    class Room,Print grp3`
          ),
        },
      ],
      codes: [
        {
          title: "loop.py — write, run, stop",
          language: "python",
          code: `def ask_with_code(question: str, plan, execute, max_turns: int = 3) -> str:
    notes = [question]
    for _ in range(max_turns):
        move = plan(notes)  # {"kind": "final"|"code", "text": "..."}
        if move["kind"] == "final":
            return move["text"]
        blocked = policy(move["text"])
        if blocked:
            notes.append(blocked)
            continue
        notes.append(execute(move["text"]))
    return "stopped: too many code turns"`,
        },
      ],
    },
    {
      id: "failure-modes",
      level: "advanced",
      title: "How this fails: wrong numbers, open doors, hung runs",
      body: [
        "Now that you understand the simple system, look at what breaks it. The common failure is not 'the model wrote ugly Python'. It is 'the room was wider than the question'. Read the file list that was copied in. If a column the user should not see was on the table, the snippet did not need to be clever.",
        "Imagine the run fails here. What should the agent do? It cannot continue as if the printout succeeded. If the policy refused an import, tell the model in one line and let it rewrite once. If the time cap opened, do not rerun the same loop. If the fetch tool failed, do not let the model invent a second fetch through code.",
        "Wrong numbers are a different failure. The jail can be perfect and the average still wrong because the snippet filtered the wrong week. That is why you keep the snippet and the printout in the trace. Debug is: what file was in the room, what did the code actually do, what did it print. The model's English summary is not evidence.",
        "Quiet open doors are the incident class from the story. A default-on network, a shared home directory, secrets in environment variables the child can read — none of those require a malicious user. They require a curious snippet and a room you did not lock. Treat environment variables as files. If the snippet does not need them, do not pass them in.",
        "When you debug, ask four questions. What files were in the room? Which doors were open? What did the process print? Which cap fired? Those four answers are the post-mortem. The model version is rarely the interesting one.",
      ],
      diagrams: [
        {
          title: "Kill the run, keep the room disposable",
          caption:
            "Any cap can end the run. A silent hang that looks like thinking is worse than a named stop.",
          chart: chart(
            `flowchart TD
    Start[Start of run] --> Time{Time left?}
    Time -->|no| HaltTime([Halt: time])
    Time -->|yes| Mem{Memory left?}
    Mem -->|no| HaltMem([Halt: memory])
    Mem -->|yes| Net{Needs network?}
    Net -->|yes| HaltNet([Halt: network denied])
    Net -->|no| Work[Run snippet]
    Work --> Start`,
            `class Start,Work hub
    class Time,Mem,Net grp1
    class HaltTime,HaltMem,HaltNet grp3`
          ),
        },
      ],
    },
    {
      id: "production-jail",
      level: "advanced",
      title: "Production: the locked room is the product",
      body: [
        "The simple runner becomes a production runner when each run is a fresh container or VM, the filesystem is a throwaway disk, the network is off unless a named proxy is required, and secrets never enter the child. You measure time, memory, and whether policy refused the snippet. You throw the room away at the end, even on success.",
        "This approach is useful when the user question is a computation over a bounded table you already trust: summaries, joins, charts, unit conversions. You might avoid it when the action is one you can name — refund, email, delete — because a named tool has a schema, a policy check, and an idempotency key. Code is a poor place to hide a write.",
        "Trade-offs are real. A locked room is more work than `eval`. You will spend time on images, caps, and file plumbing. You gain a computation the model cannot fake in English, and a boundary you can describe in a security review. That is the exchange.",
        "Do not teach or build this as a contest against the jail. The engineering job is defensive: shrink the room, name the doors, log the refusals, and keep writes on reviewed tools. If a researcher later finds a hole, you patch the room. You do not publish the hole as a feature.",
        "The learner who can teach this now says: the model writes a program; you run it in a room you designed; the printout is the observation; network, files, time, and memory are closed unless a human opened them.",
      ],
      codes: [
        {
          title: "policy.py — doors you can name in a review",
          language: "python",
          code: `from dataclasses import dataclass


@dataclass
class Room:
    network: bool = False
    writable_paths: tuple[str, ...] = ()
    seconds: int = 3
    memory_mb: int = 256
    inherit_env: bool = False


def room_for_table_question() -> Room:
    return Room(writable_paths=("/tmp/run",), seconds=5)


def room_for_fetch_is_not_code() -> None:
    """Fetching is a named tool, never a Room with network=True."""
    raise RuntimeError("do not open network on the code room")`,
        },
      ],
    },
  ],

  workedExample: {
    title: "Answer 'weekly conversion for Tuesday signups'",
    setup:
      "A product manager asks for conversion by week for users who signed up on a Tuesday. The warehouse is large. The chat helper used to open a worker with full network and the analyst laptop's libraries.",
    walkthrough: [
      "Step 1 — Understand the problem. The question is a program over a table, not a named button. Letting the model invent a warehouse call is how the slide got unreviewed data.",
      "Step 2 — Identify the relevant concept. Code execution in a locked room, plus a separate fetch tool that writes a bounded file.",
      "Step 3 — Build the simplest solution. Fetch last 90 days of signup and conversion rows for one product into /data/extract.csv. Run a snippet that filters weekday == Tuesday and groups by week.",
      "Step 4 — Improve it. Close network, drop environment secrets, cap time at five seconds, refuse unknown imports. Return only the printed table.",
      "Step 5 — Handle a failure. If the snippet loops, the time cap opens and the user sees 'could not finish'. If the snippet asks for network, policy refuses and the model must work with the file already in the room.",
      "Step 6 — Production version. Each run is a fresh container. The fetch tool is audited. The room is destroyed after the printout. Writes such as 'email this chart to the board' stay on named tools.",
    ],
    result:
      "The manager gets a weekly table computed from an extract someone scoped. The warehouse is not a playground. Credentials never enter the child process.",
  },

  practice: {
    title: "Keep the computation, close the warehouse door",
    task:
      "You have a helper that lets the model write Python against 'whatever it needs'. A user asks for a chart of refunds. The first snippet tries to reach an internal address. Design the smallest room that can still answer. Say which doors are closed, what file is on the table, and what happens if the snippet needs more data.",
    hint:
      "Separate fetch from compute. Name the four doors. Do not try to catch every dangerous string. Think about what the user should see if you stop.",
    solution:
      "Expected reasoning: the model may compute; it must not fetch. The room is default-deny.\n\nSolution: a reviewed fetch tool writes a bounded refunds extract into a disposable folder. Room: network off, no inherited environment, time 5s, memory 256MB, writes only under that folder. Policy refuses unknown imports as a seatbelt. If more columns are needed, the fetch tool runs again with a tighter schema — the snippet does not grow a network call. If time expires, reply 'could not finish' and do not send a guessed chart.\n\nWhy it works: the computation still happens on a real table; the roam is gone.\n\nCommon wrong approach: block a few import names in the prompt and leave the worker on the company network.",
  },

  takeaways: [
    "A named tool is a button you designed. Code execution is a blank page the model fills in.",
    "The cycle is write, run, read the printout. The model does not 'do the math in its head' for the hard part.",
    "A sandbox is a room with only the doors you opened: network, files, time, and memory.",
    "Fetching data is a reviewed tool. Computing on a file already in the room is what the snippet is for.",
    "A word filter is a seatbelt. The operating system and the container are the jail.",
    "Use code execution for bounded computation. Keep world-changing writes on named tools with keys.",
  ],

  mistakes: [
    "Mistake: run the snippet in the same process as the web server. Why people make it: one function is faster to demo. What actually happens: a hang or crash takes the product down. Better approach: a child process or container you can kill.",
    "Mistake: leave network on 'in case the model needs it'. Why people make it: fewer refusals in testing. What actually happens: the snippet wanders to addresses you did not review. Better approach: default deny; fetch is a named tool.",
    "Mistake: copy the whole warehouse into the room. Why people make it: you do not want to fetch twice. What actually happens: the printout can include columns the chat user should not see. Better approach: a bounded extract with a schema.",
    "Mistake: treat import-name filters as the jail. Why people make it: they are easy to write. What actually happens: the same idea arrives in another shape. Better approach: OS and container limits, plus a small allow-list as a seatbelt.",
    "Mistake: retry a timed-out snippet forever. Why people make it: maybe it will finish. What actually happens: a loop burns the budget all night. Better approach: one named halt, then stop.",
    "Mistake: hide a refund or email inside generated code. Why people make it: one room for everything. What actually happens: writes skip policy and idempotency keys. Better approach: world-changing actions stay on named tools.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "In one or two sentences, why would you let a model write code instead of adding another tool?",
      answer:
        "What they are testing: the problem, not a brand name.\n\nGood answer: some questions are programs over a table you already trust. A named tool cannot cover every grouping. The model writes the computation; a locked room runs it and returns the printout.\n\nWhy that is good: it names the job and the boundary.\n\nFollow-up: what should still stay a named tool?",
    },
    {
      difficulty: "medium",
      question: "A code-executing helper reached an internal warehouse address. What do you change first?",
      answer:
        "What they are testing: defensive order, not a prompt tweak.\n\nGood answer: close the network door on the room. Move fetch to a reviewed tool that writes a bounded file. Drop inherited environment variables. Keep the computation. Do not try to list every dangerous import as the main fix.\n\nWhy that is good: it treats the incident as an open door.\n\nFollow-up: how do you prove a new snippet cannot reach the warehouse?",
    },
    {
      difficulty: "hard",
      question: "When do you refuse code execution and insist on a named tool?",
      answer:
        "What they are testing: trade-offs.\n\nGood answer: I refuse it for actions that change the world — pay, email, delete — because those need a schema, a policy check, and an idempotency key. I also refuse it when the data cannot be bounded into a file the user is allowed to see. Code execution is for arithmetic and reshaping inside a room I can describe in a review.\n\nWhy that is good: it shows judgment, not a ban on the pattern.\n\nFollow-up: how would you mix both on one question, a fetch tool plus a snippet?",
    },
  ],

  glossary: [
    {
      term: "Code-executing agent",
      meaning:
        "A helper that lets the model write a program, runs that program, and reads the printout. Why it matters: the action is invented at run time, so the room must be designed.",
    },
    {
      term: "Sandbox",
      meaning:
        "A locked room with only the doors you opened. Why it matters: it is what turns 'run this string' into a product you can review.",
    },
    {
      term: "Default deny",
      meaning:
        "Every door starts closed unless a human opened it for this job. Why it matters: open-by-default is how an analytics snippet becomes a network client.",
    },
    {
      term: "Fetch tool",
      meaning:
        "A reviewed, named action that places a bounded file into the room. Why it matters: the model computes; it does not wander to data.",
    },
    {
      term: "Time cap",
      meaning:
        "A limit on how long a snippet may run before you kill it. Why it matters: a loop is not thinking; it is a hang.",
    },
    {
      term: "Printout",
      meaning:
        "The text the snippet wrote to standard output, which becomes the model's observation. Why it matters: this is the evidence, not the model's later summary.",
    },
  ],
};
