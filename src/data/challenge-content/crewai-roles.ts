import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "crewai-roles",
  instructor:
    "I teach this from zero. We start with a group of helpers talking at once, then learn how to give each one a real job, one owner for the final artifact, and tools that match the job — not a group chat with fancy titles.",
  promise:
    "You will go from naming five personalities to writing a role as a job description, picking an assembly line or a manager on purpose, treating a task as a ticket with a checkable output, and saying when this shape is the wrong tool.",

  story: {
    title: "Two publishers, one blog post",
    body: [
      "A growth team built a content crew. They named five helpers: Researcher, Writer, Editor, SEO Specialist, and Publisher. Each had a poetic backstory. The process was 'hierarchical', which here just meant a manager helper assigned work. The Publisher tool was wired to the real website. So was a second copy of that tool, given to the Editor 'so the pipeline does not block'.",
      "The first real run took a long time and cost more than an intern's hour for one short post. The Editor rewrote the Writer's draft, because 'edit this' with no checklist is the same as 'write a better one'. The SEO helper then rewrote the rewrite to add keywords and dropped two citations. The Writer put the original phrasing back. The manager asked the Writer to try again. Two full laps.",
      "Then both the Editor and the Publisher pressed publish. The site had two near-duplicate posts. The one that ranked had no citations.",
      "The fix was not a better backstory. They deleted the extra SEO helper and put keywords into the Writer's expected output. The Editor became a judge: approve or reject with reasons, no edit, no publish tool. The Writer owned the draft. Only Publisher held publish, behind a check. Five jobs became three. The duplicate-post bug became structurally impossible, because two people no longer owned the same button.",
    ],
    moral:
      "A crew is an org chart. Org charts fail when two people think they own the same decision. Design the jobs and the one publisher, not the personalities.",
  },

  stages: [
    {
      id: "group-chat-problem",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Let's start from zero. You can put several models in a room and let them talk. That feels like a team. Often it is a group chat. Nobody knows who is allowed to press publish. Everyone can rewrite everyone else. The user gets two emails or two blog posts.",
        "A real team has jobs. One person finds sources. One person writes. One person says yes or no. One person, and only one, may publish. The jobs exist even if the people are friendly. Friendship is not ownership.",
        "CrewAI is a library that makes it easy to name those jobs and run them as a small company of helpers. The library is not the lesson. The lesson is the jobs. You could draw the same org chart and implement it with another tool.",
        "What happens without jobs? The story. Two publish buttons. A rewrite war. A long, expensive trace that looks busy.",
        "The everyday picture is a kitchen. If everyone is 'helping with dinner' and two people plate dessert, you get two desserts. If one person is chef de partie for dessert, you get one.",
        "At this point you should understand: extra helpers are extra cost and extra owners. Start by naming the jobs, not by picking a headcount.",
      ],
      diagrams: [
        {
          title: "A group chat versus a kitchen with stations",
          caption: "If two stations can plate, you will plate twice.",
          chart: chart(
            `flowchart TD
    Chat[Group chat] --> A[Helper A]
    Chat --> B[Helper B]
    A --> Pub1[Publish]
    B --> Pub2[Publish]
    Line[Stations] --> Res[Research]
    Res --> Wri[Write]
    Wri --> Rev[Review]
    Rev --> Pub3[One publish]`,
            `class Chat,Line hub
    class A,B,Res,Wri,Rev grp1
    class Pub1,Pub2,Pub3 grp2`
          ),
        },
      ],
    },
    {
      id: "role-is-a-job",
      level: "beginner",
      title: "A role is a job description",
      body: [
        "A role, in this sitting, is a job: a name, a goal, and the tools that job is allowed to hold. 'Seasoned editor with twenty years at a magazine' is flavour. Flavour is optional. The job is not.",
        "The goal should be something you can check. 'Find three citable sources' can be checked. 'Help with the blog' cannot.",
        "Tools match the job. The researcher may search. The reviewer should not get publish. The writer may not need any tools if the research packet is already on the desk.",
        "Why so strict? Because a helper will use a tool it can see. If the reviewer can publish, it will eventually publish. That is not a moral failing. It is a loop with a button.",
        "CrewAI will ask you for a backstory. Use it to constrain tone if you want. Do not use it as the place where you hide the real rules. Rules belong in the expected output and in the tools you attach.",
        "At this point you should be able to say: a role is a job plus a toolbox, not a personality.",
      ],
      diagrams: [
        {
          title: "Job, goal, toolbox",
          caption: "Flavour is optional. The missing tool is the wall.",
          chart: chart(
            `flowchart LR
    Job[Job name] --> Goal[Checkable goal]
    Job --> Box[Tools for that job only]`,
            `class Job hub
    class Goal,Box grp1`
          ),
        },
      ],
    },
    {
      id: "line-vs-manager",
      level: "beginner",
      title: "How the simplest version works",
      body: [
        "There are two common ways to connect the jobs. You should pick one on purpose.",
        "An assembly line, often called a sequential process, is A then B then C. Research finishes. Writing starts. Review starts. This is the right default when you can name the order.",
        "A manager, often called a hierarchical process, is a helper that assigns work to others. Use this when the next job really depends on a choice you cannot write down in advance: this ticket needs research, that ticket needs only a rewrite.",
        "They look similar because both have several named helpers. The important difference is who decides the next job. The line decides in your code. The manager decides at runtime, and that costs extra model calls.",
        "The story used a manager and still needed a line. Most blog-shaped work is a line. A manager on top of a line is how you pay for laps.",
        "At this point you should understand: if you can draw the order this week, use a line. A manager is for unknown next jobs, not for prestige.",
      ],
      diagrams: [
        {
          title: "Line versus manager",
          caption: "Pick one owner for the user-facing artifact either way.",
          chart: chart(
            `flowchart LR
    R1[Research] --> W1[Write]
    W1 --> V1[Review]
    Mgr[Manager] --> R2[Research]
    Mgr --> W2[Write]`,
            `class Mgr,V1 hub
    class R1,W1,R2,W2 grp1`
          ),
        },
      ],
    },
    {
      id: "tasks-are-tickets",
      level: "intermediate",
      title: "A task is a ticket, not 'help with the blog'",
      body: [
        "CrewAI calls a unit of work a Task. You should treat it like a ticket: a description, an expected output, and one agent who owns it.",
        "What are we trying to do? Make 'done' checkable. If the expected output is 'a good draft', nobody can reject it for a reason you can automate.",
        "Here is the smallest version. Researcher task: return three sources with urls. Writer task: 400 words, each factual sentence has a source id. Reviewer task: a verdict, approve or reject, plus a list of missing source ids.",
        "Let's understand what just happened. The reviewer now has something to reject. The writer now knows the shape. The researcher cannot 'help' by writing the post.",
        "Share a short packet between tasks, not the entire researcher dump. The writer's window is a desk with a budget. A dump drowns the outline. That is the context sitting, applied to a crew.",
        "At this point you should understand: tasks have owners and checkable outputs. A vibe is not a task.",
      ],
      codes: [
        {
          title: "Jobs, not poetry",
          language: "python",
          code: `researcher = {"role": "Researcher", "goal": "Find 3 citable sources", "tools": ["search"]}
writer = {"role": "Writer", "goal": "Draft 400 words with source ids", "tools": []}
reviewer = {"role": "Reviewer", "goal": "Approve only if every claim has a source id", "tools": []}`,
        },
      ],
    },
    {
      id: "expected-output",
      level: "intermediate",
      title: "Expected output you can check, and tools that match",
      body: [
        "Turn the expected output into a small form when you can. Outline with three bullets. Draft with a list of {sentence, source_id}. Verdict with {ok, missing_ids}. Forms beat essays because the next job can read fields.",
        "Tool isolation is the other half. The researcher gets search and retrieve. The writer gets nothing, or only a cite checker. The reviewer gets nothing that changes the world. Publisher, if you even automate it, is a later step behind policy.",
        "They look similar: a tool description and a goal both 'tell the helper what to do'. The important difference is enforcement. A goal is a request. A missing tool is a wall.",
        "If two roles can both finalise, they will fight. Finalise means publish, send, or merge. Give that verb to one role. Everyone else returns work products.",
        "Pause and check. If you deleted the Editor's publish tool, could the duplicate post in the story still happen? No. That is the test of a good org chart.",
        "At this point you should understand: schemas make review possible, and tool isolation makes double-publish impossible.",
      ],
      codes: [
        {
          title: "A review is a form",
          language: "python",
          code: `from pydantic import BaseModel

class Verdict(BaseModel):
    ok: bool
    missing_ids: list[str]

def accept(v: Verdict) -> bool:
    return v.ok and not v.missing_ids`,
        },
      ],
      diagrams: [
        {
          title: "One artifact, one publisher",
          caption: "Review returns a verdict. Only one later step may ship.",
          chart: chart(
            `flowchart TD
    Res[Research packet] --> Wri[Draft]
    Wri --> Rev[Verdict]
    Rev -->|reject| Wri
    Rev -->|approve| Pub[Publisher]
    Pub --> Site([Live page])`,
            `class Res,Wri,Rev grp1
    class Pub,Site hub`
          ),
        },
      ],
    },
    {
      id: "one-publisher",
      level: "intermediate",
      title: "One mouth, one artifact owner",
      body: [
        "The first design rule for any multi-helper system: one helper owns the user-facing result. In a crew, that is the draft owner and, separately, the one publisher. Those might be different jobs. They must not be two publishers.",
        "The reviewer returns a verdict. If you let the reviewer edit, you have two writers. If you let the reviewer publish, you have two publishers. Both were in the story.",
        "Context passing is part of ownership. The writer should see the research packet and the verdict, not the SEO helper's private monologue. Extra voices in the window create extra rewrites.",
        "Cost follows headcount. Each role is model calls. Five roles on a four-hundred-word post is how a run costs more than the post is worth. Three honest jobs beat five titles.",
        "This is the same 'one mouth' rule as other multi-agent sittings. CrewAI does not suspend the rule because the file says Crew.",
        "At this point you should understand: ownership is the architecture. Titles are labels on top.",
      ],
      codes: [
        {
          title: "One publisher",
          language: "python",
          code: `def holders(roles: dict) -> list[str]:
    return [name for name, spec in roles.items() if "publish" in spec["tools"]]`,
        },
      ],
    },
    {
      id: "when-not-crewai",
      level: "advanced",
      title: "When this shape is the wrong tool",
      body: [
        "Remember the simple crew: jobs, a line, one publisher. That shape breaks when you need a pause until Monday, a fine-grained branch, or a snapshot you resume after a crash. Those are control-plane problems. A graph with checkpoints is built for that. CrewAI is a role runtime.",
        "They look similar because both can run several helpers. The important difference is what you can draw and pause. A crew shines when you can name jobs the way a company would. A graph shines when the next edge is a rule, an interrupt, or a wait.",
        "Do not start a crew because you cannot name the jobs. If you cannot name them, you want a single helper or a graph, not five backstories.",
        "Do not put money tools on a crew 'member' without the gateway from the harness sitting. A role name is not a policy.",
        "Trade-off: CrewAI is fast when the org chart is real. It is the wrong costume when you need durable threads and interrupts. Pick the shape, then the library.",
        "At this point you should be able to say out loud when you would not use CrewAI, with reasons that are about control, not about brand.",
      ],
      diagrams: [
        {
          title: "Jobs versus a control plane",
          caption:
            "If you need a siding until Monday, you need a graph, not a longer backstory.",
          chart: chart(
            `flowchart TD
    Need([Need]) --> Jobs{Can you name jobs}
    Jobs -->|yes, known order| Crew[Crew line]
    Jobs -->|yes, unknown next| CrewM[Crew plus manager]
    Jobs -->|pause, branch, resume| Graph[Graph with snapshots]
    Jobs -->|one job| Single[One helper]`,
            `class Need,Single hub
    class Jobs grp2
    class Crew,CrewM,Graph grp1`
          ),
        },
      ],
    },
    {
      id: "evaluate-the-crew",
      level: "advanced",
      title: "Score the crew, not the star researcher",
      body: [
        "A brilliant researcher plus a writer who ignores the packet is a failed crew. Evaluate the system: did the published artifact meet the expected form, were citations present, did anyone but Publisher ship, how many laps, how much cost.",
        "Put those checks in CI the way the harness sitting taught. A fixture that gives the Editor a publish tool must fail the build. A fixture with a missing source id must produce a reject, not a live page.",
        "Traces should name the role on each span. When a run is expensive, you will see the rewrite war as four Writer spans, not as 'the model was slow'.",
        "Promote a stable line to a workflow if every run is research-write-review. You can keep the job names and drop the manager. That is a win.",
        "When not to add another role. If you are adding a helper to fix a missing field, add the field to the expected output instead. Headcount is a poor schema.",
        "At this point you can teach the sitting: jobs not vibes, line versus manager, tickets with forms, one publisher, CrewAI versus a graph, score the system.",
      ],
      codes: [
        {
          title: "The crew passed only if the system passed",
          language: "python",
          code: `def crew_ok(published: int, missing_ids: list[str], laps: int) -> bool:
    return published == 1 and not missing_ids and laps <= 2`,
        },
      ],
    },
  ],

  workedExample: {
    title: "Rebuild the content crew so only one post ships",
    setup:
      "Same five titles as the story, and publish_post pointed at the real CMS.",
    walkthrough: [
      "Step 1 — Understand the problem. Two publish tools and a rewrite war. The artifact has no single owner.",
      "Step 2 — Identify the relevant concept. Roles as jobs. A line. Expected outputs as forms. One publisher.",
      "Step 3 — Build the simplest solution. Three jobs: research, write, review. Sequential. Only a later human publishes.",
      "Step 4 — Improve it. Writer expected output requires source ids. Reviewer returns Verdict. Keywords live in the writer form, so the extra SEO role can go.",
      "Step 5 — Handle a failure or edge case. Reject loops back to the writer once. A second reject escalates to a human. Nobody else holds publish.",
      "Step 6 — Explain the production version. If you automate publish, one role holds it behind policy. CI forbids a second publish tool and scores citation completeness.",
    ],
    result:
      "One draft owner, one judge, one publisher. Duplicate posts are not a prompt problem any more. They are a missing tool on the judge.",
  },

  practice: {
    title: "A support crew that must not double-email",
    task:
      "A team wants Researcher, Writer, Empathy Editor, QA, and Sender for support replies. Problem: design the jobs you would keep, the process shape, the expected outputs, and who may hold send_email. Then say when you would throw this away and use a graph instead. Think about: who owns the text and who owns the send button. Waiting for a human approver is a graph clue.",
    hint:
      "Empathy and QA both want to 'improve the reply'. Expected reasoning: three jobs, sequential line, verdict-only review, one sender, graph if overnight approval.",
    solution:
      "Keep three jobs: gather facts (retrieve only), draft the reply (no send), review (verdict only). Sequential line. Expected outputs: fact packet with ticket ids; draft with citations; verdict. Only a later policy-gated Sender — or a human — holds send_email. Drop Empathy as a separate role; put tone in the writer form. Use a graph if the reply must pause overnight for approval or branch on refund versus howto. Why this works: two people cannot own send, and tone is a field not a headcount. Common wrong approach: five backstories and send_email on QA 'so it can fix typos and ship'.",
  },

  takeaways: [
    "A role is a job with a goal and a toolbox, not a personality paragraph.",
    "If you can name the order, use an assembly line. A manager costs extra calls and is for unknown next jobs.",
    "A task is a ticket with a checkable expected output. 'Help with the blog' is not a task.",
    "One owner for the artifact. One holder of publish or send. Review returns a verdict.",
    "Tools match the job. A reviewer with publish is a second publisher.",
    "CrewAI is a role runtime. If you need pauses, fine edges, and snapshots, you want a graph.",
  ],

  mistakes: [
    "Mistake: five helpers, one vague goal. Why people make it: more agents feel capable. What actually happens: rewrite wars and a large bill. Better approach: three jobs you can check.",
    "Mistake: every role gets every tool. Why people make it: then nothing blocks. What actually happens: two publishes. Better approach: tools match the job.",
    "Mistake: no reviewer criteria. Why people make it: 'edit this' sounds clear. What actually happens: a second writer. Better approach: a verdict form.",
    "Mistake: a manager on a known assembly line. Why people make it: hierarchical sounds senior. What actually happens: extra laps. Better approach: sequential.",
    "Mistake: hide rules in the backstory. Why people make it: the field is there. What actually happens: rules are untestable. Better approach: expected output plus missing tools.",
    "Mistake: pick CrewAI when you need Monday pauses. Why people make it: you already named roles. What actually happens: you cannot honestly sleep the run. Better approach: a graph with checkpoints.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "What is a CrewAI role, if you strip the flavour text?",
      answer:
        "What they are testing: job versus personality. Good answer: a job description — goal, constraints, and the tools that job may hold. Why that is good: you can test it. Follow-up: why shouldn't the reviewer get publish?",
    },
    {
      difficulty: "medium",
      question: "How do you stop a crew from shipping unsourced claims?",
      answer:
        "What they are testing: outputs and tool isolation. Good answer: researcher has retrieve only; writer expected output requires source ids; reviewer rejects with a list and has no publish tool; only a later gated step may ship. Why that is good: the failure is structural. Follow-up: what do you share between tasks?",
    },
    {
      difficulty: "hard",
      question: "When is CrewAI the wrong shape compared with a graph?",
      answer:
        "What they are testing: control plane versus role runtime. Good answer: use a graph when you need interrupts, durable threads, or fine edges; use a crew when you can name jobs like a company and walk them in a line or a simple manager. Why that is good: you picked from the job. Follow-up: how do you evaluate the crew as a system?",
    },
  ],

  glossary: [
    {
      term: "Role",
      meaning:
        "A job with a goal and a toolbox. Why it matters: flavour text cannot stop a publish.",
    },
    {
      term: "Task",
      meaning:
        "A ticket: description, expected output, one owner. Why it matters: 'help with the blog' cannot be checked.",
    },
    {
      term: "Sequential process",
      meaning:
        "An assembly line: A then B then C. Why it matters: this is the default when the order is known.",
    },
    {
      term: "Hierarchical process",
      meaning:
        "A manager helper assigns work. Why it matters: useful only when the next job is truly unknown.",
    },
    {
      term: "Expected output",
      meaning:
        "The checkable shape of 'done', preferably a small form. Why it matters: a reviewer cannot reject a vibe.",
    },
    {
      term: "Publisher",
      meaning:
        "The one job allowed to ship. Why it matters: two publishers are how you get two posts.",
    },
  ],
};
