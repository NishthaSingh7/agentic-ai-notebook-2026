import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "deep-agents",
  instructor:
    "I am a senior engineer who builds AI products. I still start this topic from zero every time I teach it, because the idea is simple and the failures are not.",
  promise:
    "You will go from never having heard of a long-horizon harness to being able to give a helper a todo list and a folder per run, isolate child helpers, and say when a workflow you could draw in fifteen minutes is the better tool.",

  story: {
    title: "The overnight report that rewrote itself",
    body: [
      "A strategy team wanted a competitive report 'like a junior analyst who can work overnight'. They pointed a long-running helper at web search and a tool that posted to Notion. The step limit was high because the point was a long job. The folder lived in memory. It shipped as an internal analyst.",
      "Friday at 6pm someone asked for a thorough report on four competitors. The planner wrote a handsome todo list. It spawned a helper per competitor. All four shared the same folder and the same Notion token, because the parent had those tools and the sample copied tools downward. By 11pm two helpers were both writing report.md. Notion received six versions.",
      "At 1am the process restarted. The in-memory folder vanished. The planner woke on an empty disk, decided nothing had been done, and spawned four more helpers. Search vendors were called again. At 8am a human opened the latest doc: competitor A's revenue was two numbers on two pages. The bill was a few hundred dollars. Nobody could resume the first run. There was no run id.",
      "The harness was not the villain. The missing walls were. They persisted the folder by run id, gave each child its own directory and no Notion token, reserved publish for the parent after a schema check, and capped fan-out and wall-clock. The next report cost a little and had one revenue number per competitor.",
    ],
    moral:
      "Long work is a harness problem. If the todo list, the disk, and the children share a credential and an address space, you have not built an analyst. You have built a fork bomb with a research budget.",
  },

  stages: [
    {
      id: "hours-not-smarter",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "A normal agent loop is good for a short job: look up an order, answer, stop. The scratchpad holds the whole story. If the job is 'research four companies and write a ten-page brief', the scratchpad becomes a novel, the model forgets page one, and you cannot pause overnight.",
        "People hear 'deep' and think 'smarter'. In this sitting, deep means longer and more structured. The model is the same kind of model. What changes is the equipment around it: a list of tasks, a place to put unfinished work down, and sometimes a helper that does one slice.",
        "That equipment is a harness. Child-level: a worker with a notebook and a checklist, who may ask a colleague to research one company. Engineer-level: a parent run with a todo list, a filesystem, and child runs. Production-level: each of those has a run id, a clock, a dollar cap, and a publish door only the parent holds.",
        "When not to use this: you can draw the path. Four competitors with a known outline is a workflow that fans out two retrievals at a time and then combines. The harness will still run it, and it will still wander.",
        "Pause and check. After a restart, can you find the run id, the folder, and the todos? If any of those is 'in memory', you will pay for the research twice.",
        "At this point you should understand the problem: work that does not fit in one chat needs a place to put work down, not a bigger brain.",
      ],
      diagrams: [
        {
          title: "Short loop versus a harness",
          caption: "Depth here is duration and structure, not a bigger brain.",
          chart: chart(
            `flowchart LR
    Short[Short chat loop] --> Ans([One answer])
    Long[Planner plus folder plus children] --> Files[Notes on disk]
    Files --> Report([One report])`,
            `class Ans,Report hub
    class Short,Long grp1
    class Files grp3`
          ),
        },
      ],
    },
    {
      id: "three-objects",
      level: "beginner",
      title: "Three objects: list, folder, helper",
      body: [
        "The planner is a todo list the helper can write and update: a title, a status, maybe a path where the finished file should land. If a todo has no path, it is a meeting. Meetings are how a helper stays alive without producing.",
        "The filesystem is a folder of files the helper can read and write. It is usually virtual: your code stores the bytes, the model sees paths. It must belong to a run id. A folder in memory dies when the process dies. That is the 1am empty disk.",
        "A sub-agent is a child run with a narrower goal. It should have its own context, its own subdirectory, and fewer tools. The parent orchestrates. The parent is the only mouth to Notion, to the user, to money.",
        "They look similar to 'just give the model more tools' because the parent still has tools. The important difference is inspection. You can read the list and the folder without trusting the model's last paragraph. If you do not inspect them, you have given the model a notebook and looked away for three hours.",
        "At this point you should be able to point at the three objects on a napkin. If a design has only a high max_steps, it is not deep. It is a long loop.",
      ],
      diagrams: [
        {
          title: "List, folder, helper",
          caption: "Inspect the list and the folder. Do not trust the last paragraph alone.",
          chart: chart(
            `flowchart TD
    List[Todo list] --> Parent[Parent run]
    Folder[Folder per run] --> Parent
    Helper[Child helper] --> Folder
    Parent --> Pub([Parent publishes])`,
            `class Pub hub
    class List,Folder,Helper,Parent grp1`
          ),
        },
      ],
    },
    {
      id: "batch-job",
      level: "beginner",
      title: "How the simplest version works: a batch job that contains a model",
      body: [
        "A batch job is work that runs for a while in the background: nightly invoices, a big import. You give it an id, a clock, a place on a dashboard. You do not leave it only in a chat window.",
        "A long-horizon helper is that job. Give it a run id, a wall-clock, a dollar cap, a write cap, and a dashboard row next to the other jobs. If it lives only in a chat window, you will not notice it is still alive at 1am.",
        "Show the list to a human before expensive children if the brief is ambiguous. 'Four competitors, thorough' is ambiguous. A list that names the four, the required files, and a rubric is a contract. Use the pause as intake, not only as failure.",
        "Do not put side effects in the planner. The planner writes lists. Children write files. The parent publishes. If writing a todo can also hit Notion, you have collapsed the harness into a single agent with extra steps.",
        "Pause and check. After a restart, can you find the run id, the folder, and the todos? If any of those is 'in memory', you will pay for the research twice.",
        "At this point you should understand the simplest version: a short todo list with paths, a folder per run, two children, and a parent that publishes once.",
      ],
    },
    {
      id: "todo-contract",
      level: "intermediate",
      title: "The todo list is a contract — now the library has a name",
      body: [
        "What are we trying to do? Make 'done' mean 'the file exists and passes a check', not 'the model felt thorough'.",
        "Deep Agents is LangChain's opinionated harness for that longer work. Underneath you will meet LangGraph, which is how it can save progress and pause. That is not trivia. Saving progress is the difference between a report and a 1am amnesia. The brand is an implementation. The harness is the idea.",
        "Here is the smallest version. Each todo has an id, a title, a status, and an artifact path. The parent refuses to spawn work that is not on the list. The parent refuses to mark complete unless the path exists and validates.",
        "Cap the list. A planner rewarded for thoroughness will emit twenty todos. Eight is plenty. Returning 'I should stop' from a replan is a feature. A planner that never empties the list is a process that never dies.",
        "Let's understand the Friday bug. After the restart, files were gone, todos were gone or unmarked, and the planner honestly believed nothing had been done. Persistence is part of the contract, not an ops extra.",
      ],
      codes: [
        {
          title: "A todo that cannot complete on an empty path.",
          language: "python",
          code: `from dataclasses import dataclass
from typing import Literal

@dataclass
class Todo:
    id: str
    title: str
    path: str
    status: Literal["todo", "doing", "done"] = "todo"

def mark_done(todo: Todo, fs) -> Todo:
    if not fs.exists(todo.path):
        raise ValueError("artifact missing")
    if not fs.valid(todo.path):
        raise ValueError("artifact failed check")
    return Todo(todo.id, todo.title, todo.path, "done")`,
        },
      ],
      diagrams: [
        {
          title: "The harness, not the soul",
          caption: "Planner, disk, children. The parent is the only lasting door outside.",
          chart: chart(
            `flowchart TD
    Brief([User brief]) --> Plan[write todos]
    Plan --> Disk[Folder per run]
    Plan --> Child[Sub-agent]
    Child --> SubDir[Child directory]
    SubDir --> Disk
    Disk --> Reduce[Parent combine]
    Reduce --> Mouth[publish]
    Mouth --> World([Notion, email, user])
    Clock[Clock and dollar cap] -.-> Plan
    Clock -.-> Child`,
            `class Brief,World hub
    class Plan,Child,Reduce,Mouth grp1
    class Disk,SubDir grp2
    class Clock grp3`
          ),
        },
      ],
    },
    {
      id: "folder-per-run",
      level: "intermediate",
      title: "A folder that belongs to one run",
      body: [
        "The virtual filesystem is working memory you can open in a file browser. Drafts live there. Raw sources live there. The final report lives there until the parent publishes a copy.",
        "Bind the root to a run id: runs/2026-10-02/r_88/. Persist it on a real disk or object store. The in-memory default is a tutorial. After a restart, the parent should see the same paths.",
        "Give each child a subdirectory it cannot leave. The parent can read all. Children cannot write each other's drafts. Two helpers editing report.md is how you get two revenues. Two helpers writing a.md and b.md, with the parent combining, is a reduce step — a word that just means 'combine parts'.",
        "Do not give children the publish tool. They can finish a file. Only the parent, after a schema check — 'one revenue number per competitor' — may post to Notion. Registration is the allowlist, again.",
        "Connect this back to least privilege. Shared Notion token plus shared folder is one toolbox for four writers. That is the overnight bill.",
      ],
      codes: [
        {
          title: "Children write under their own prefix.",
          language: "python",
          code: `class RunFS:
    def __init__(self, run_id: str, role: str):
        self.root = f"runs/{run_id}/{role}/"

    def write(self, path: str, text: str) -> None:
        if ".." in path or path.startswith("/"):
            raise ValueError("path escapes the folder")
        store.put(self.root + path, text)`,
        },
      ],
    },
    {
      id: "children",
      level: "intermediate",
      title: "How the pieces connect: children are isolated helpers",
      body: [
        "A child gets a narrow goal: 'research competitor A, write a.md with these headings'. It gets read tools and its own folder. It does not get the parent's Notion token. It does not get the sibling's path.",
        "Cap fan-out. Four children at once is four bills and four chances to collide. Two at a time is usually enough. The parent waits, reduces, then starts the next pair.",
        "The parent is the only speaker to the user. Children returning paragraphs into a shared chat is a group meeting. Children returning files is a factory.",
        "How this sits in an app: a route creates a run record, stores the brief, maybe pauses for the human to accept the todo list, then starts the job. The UI shows todos and files. Publish is a parent step after reduce. The chat window is a viewer, not the process.",
        "At this point you should understand why max_steps is not a time budget. A child can burn money inside one parent step. Wall-clock and dollars are first-class counters.",
      ],
      codes: [
        {
          title: "A child gets a goal and a prefix, not Notion.",
          language: "python",
          code: `def spawn_child(run_id: str, todo: Todo) -> dict:
    return {
        "goal": todo.title,
        "fs": RunFS(run_id, role=todo.id),
        "tools": ["search", "write_file"],
        # not included: publish_to_notion
    }`,
        },
      ],
    },
    {
      id: "restart-and-collide",
      level: "advanced",
      title: "How the simple harness fails",
      body: [
        "Remember the simple version: a short todo list, a folder per run, two children, parent publishes. It fails when the folder is memory-only, when tools are copied downward, when 'thorough' has no rubric, and when restart looks like a new job.",
        "The advanced technique is resume. Load todos and files by run id. Do not spawn work that is already done. If a child's file validates, mark the todo done. If the parent died during reduce, reduce again. That only works if reduce is idempotent — running it twice does not post twice.",
        "Collision is a locking problem. If two children can write the same path, you will get the last writer. Prevent it with directories, or with a lock the filesystem enforces. Do not prevent it with a prompt that says 'please do not overwrite'.",
        "Budgets must survive the process. Store spent dollars and elapsed time on the run record. A restart that resets the clock is how a 40-minute cap becomes an all-nighter.",
        "When this harness is worse than a workflow: you already know the outline and the four sources. Draw the arrows. Fan-out with a fixed reduce. You will still get a report, with one revenue number, for less money.",
      ],
      diagrams: [
        {
          title: "Restart should resume, not redo",
          caption: "Run record holds todos, spent dollars, and the folder root.",
          chart: chart(
            `flowchart TD
    Wake([Process wakes]) --> Load[Load run id]
    Load --> Disk{Folder exists?}
    Disk -->|no| Fresh[Create folder]
    Disk -->|yes| Todos[Read todos]
    Todos --> Skip[Skip completed artifacts]
    Skip --> Work[Spawn missing children]
    Fresh --> Work
    Work --> Cap{Clock or dollars?}
    Cap -->|over| Halt([Halt honestly])
    Cap -->|ok| Reduce[Parent reduce]`,
            `class Wake,Halt hub
    class Load,Fresh,Todos,Skip,Work,Reduce grp1
    class Disk,Cap grp2`
          ),
        },
      ],
    },
    {
      id: "production-harness",
      level: "advanced",
      title: "Production judgement: harness versus recipe",
      body: [
        "Operate it next to other batch jobs. Alerts on wall-clock, on dollar cap, on publish without a passing schema, on fan-out above two. A chat product that can start a three-hour job without a run id is an incident template.",
        "The rubric is the schema of the report: required files, one number per competitor, source urls. 'Thorough' is not a rubric. A reduce step that fails the rubric should not publish. It should replan once or stop.",
        "Deep Agents will keep changing its brand clothes. The lesson that travels is the harness: list, disk, isolated children, parent mouth, budgets that persist. If you can build that in a smaller loop plus a workflow, do that.",
        "Say no when the brief is a known outline and a known set of sources. Say yes when the outline itself is the work — you do not know the headings until you have read the first sources — and you are willing to operate a long job.",
        "You should now be able to teach this: deep means hours plus structure; a todo without a path is a meeting; children do not inherit Notion; restart resumes the run id.",
      ],
      codes: [
        {
          title: "Budgets live on the run record, not only in process memory.",
          language: "python",
          code: `def can_continue(run: dict) -> str | None:
    if run["elapsed_min"] >= 40:
        return "clock"
    if run["spent_usd"] >= 20:
        return "dollars"
    if run["children_alive"] >= 2:
        return "fanout"
    return None`,
        },
      ],
      diagrams: [
        {
          title: "Known outline? Skip the harness.",
          caption: "Four named competitors with a template is a workflow.",
          chart: chart(
            `flowchart TD
    Brief([Brief]) --> Known{Outline known?}
    Known -->|yes| Wf[Fan-out workflow]
    Known -->|no| Har[Deep harness]
    Wf --> One([One report])
    Har --> One`,
            `class Brief,One hub
    class Wf,Har grp1
    class Known grp2`
          ),
        },
      ],
    },
  ],

  workedExample: {
    title: "Turn the overnight analyst into a job you can resume",
    setup:
      "Deep Agents sample, in-memory folder, children inherit Notion and write_file on the same tree, max_steps high, brief says 'thorough', no run id.",
    walkthrough: [
      "Step 1 — Understand the problem. Long work with shared writes and no disk. Restart looks like a new job. Publish has many mouths.",
      "Step 2 — Identify the relevant concept. Harness: todos with paths, folder per run, isolated children, parent-only publish, persistent budgets.",
      "Step 3 — Build the simplest solution. Create run_id. Persist the folder. Cap todos at four, one per competitor, each with a path.",
      "Step 4 — Improve it. Each child writes only under its prefix. Parent reduce builds report.md. Schema: one revenue field per competitor.",
      "Step 5 — Handle a failure. Restart. Load the run. Skip todos whose files validate. Do not reset the dollar counter.",
      "Step 6 — Production version. Fan-out two. Wall-clock 40 minutes. Human intake on the todo list. Notion token only on the parent publish tool.",
    ],
    result:
      "A restart continues the same folder. Two helpers cannot overwrite one file. Notion sees one report that passed a schema. The bill matches a batch job, not an all-nighter.",
  },

  practice: {
    title: "Design a harness for a weekly incident digest",
    task:
      "You want a Sunday job that reads a week of incident tickets, writes one digest, and posts to Slack. Some weeks have three tickets, some have eighty. Think about todos, folders, children, and whether this is even a deep agent. Sketch the job.",
    hint:
      "If the outline is always 'group by service, then severity, then post', you can draw arrows. Deep is for when the outline is the work. Expected reasoning: prefer a workflow; if a harness, isolate Slack on the parent.",
    solution:
      "Prefer a workflow: fetch tickets → group → draft sections → human optional pause → Slack. If volume varies wildly and grouping rules are not known, a small harness can spawn at most two children per service group, each writing a file, parent reduces to digest.md, Slack token only on the parent. Persist by week-id. Why this works: publish has one mouth, and a known weekly outline does not need a three-hour wander. Common wrong approach: one deep agent, children inherit Slack, in-memory files, 'be thorough' as the only stop.",
  },

  takeaways: [
    "Deep means long and structured, not smarter. The harness is a list, a folder, and optional children.",
    "A todo without an artifact path is a meeting. Done means the path exists and passes a check.",
    "The folder belongs to a run id and must survive a restart. Memory-only disk is how you pay twice.",
    "Children get a subdirectory and fewer tools. They do not inherit the publish credential.",
    "Budgets are wall-clock and dollars on the run record, not only max_steps on a loop.",
    "If you can draw the outline, use a workflow. Use this harness when the outline itself is the work and you will operate a batch job.",
  ],

  mistakes: [
    "Mistake: hearing 'deep' as 'smarter model'. Why people make it: the name. What actually happens: you ship a long loop with no disk. Better approach: list, folder, children, budgets.",
    "Mistake: in-memory filesystem. Why people make it: the default. What actually happens: 1am empty disk and a second bill. Better approach: persist by run id.",
    "Mistake: copying all parent tools onto children. Why people make it: the sample does. What actually happens: four Notion posts and colliding files. Better approach: isolate directories and credentials.",
    "Mistake: 'thorough' as a stop condition. Why people make it: it sounds like quality. What actually happens: the job never wants to die. Better approach: a rubric of required files and a clock.",
    "Mistake: treating max_steps as time. Why people make it: it is one number. What actually happens: a child spends the budget inside one step. Better approach: wall-clock and dollar counters on the run.",
    "Mistake: using the harness for a path you can draw. Why people make it: the brand is exciting. What actually happens: wander and cost on a known outline. Better approach: a workflow with a fixed reduce.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "What does 'deep' mean in Deep Agents, if it does not mean a smarter model?",
      answer:
        "What they are testing: harness versus intelligence. Good answer: longer work with a planner, a filesystem, and optional sub-agents, plus the need to persist and budget that work. Why that is good: it deflates the name. Follow-up: name one case where you would refuse this harness.",
    },
    {
      difficulty: "medium",
      question: "After a restart your deep agent redoed all research. What was missing?",
      answer:
        "What they are testing: run id and disk. Good answer: no durable folder, no persisted todos, budgets reset, parent treated empty disk as a new job. Resume should skip validated artifacts. Why that is good: it is the overnight story. Follow-up: where should the Notion token live?",
    },
    {
      difficulty: "hard",
      question: "How do you decide between Deep Agents and a fan-out workflow?",
      answer:
        "What they are testing: outline-known versus outline-is-the-work. Good answer: workflow when headings and sources are known; harness when the next heading depends on what you just read, and you will operate a batch job with intake, isolation, and a rubric. Why that is good: it is judgement, not loyalty to a package. Follow-up: what rubric would you require before publish?",
    },
  ],

  glossary: [
    {
      term: "Harness",
      meaning:
        "The equipment around a model: lists, folders, budgets, child runs. Why it matters: long work fails as a harness problem, not a prompt problem.",
    },
    {
      term: "Long horizon",
      meaning:
        "A job that lasts many steps or many minutes, too long for one scratchpad. Why it matters: you need a place to put work down.",
    },
    {
      term: "Todo list",
      meaning:
        "A structured plan with statuses and artifact paths. Why it matters: done becomes a check, not a feeling.",
    },
    {
      term: "Virtual filesystem",
      meaning:
        "A folder the helper reads and writes, stored by your code. Why it matters: it must be bound to a run id or a restart wipes the job.",
    },
    {
      term: "Sub-agent",
      meaning:
        "A child run with a narrower goal and fewer tools. Why it matters: isolation is the point; inherited credentials undo it.",
    },
    {
      term: "Reduce",
      meaning:
        "The parent step that combines child files into one result. Why it matters: publish should happen once, after a schema check.",
    },
  ],
};
