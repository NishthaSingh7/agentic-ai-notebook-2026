import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "plan-and-execute",
  instructor:
    "I teach this from zero. We start with a familiar habit: jumping to the next step because the last thing you saw was interesting. Then we learn when a written list is better, and when the list is wasted money.",
  promise:
    "You will go from never having written a plan for an agent to storing a short list in state, walking it without inventing extra goals, writing a tiny lesson for the next run, and saying when you should not plan at all.",

  story: {
    title: "The briefing helper that emailed the CEO a first draft",
    body: [
      "A strategy team asked for a helper that could write a short briefing. A human would do this in phases: find sources, outline, draft, add citations, send to the analyst who asked. The first version did not write those phases down. It used a loop that picks the next tool from the last result. The tools were search, fetch, write_doc, and send_email.",
      "In demos it looked busy and useful. It searched. It read. It wrote. On the third real brief it found a spicy paragraph, decided that paragraph already felt like a draft, and emailed the CEO. send_email was available. The last page was interesting. There was no place in the loop that said 'we are still in research'.",
      "Version two added a planner. The planner wrote nine tasks for a job that needed four, including 'also notify the exec team' — a goal nobody asked for. The worker ran them in order because the team had said the plan was sacred. Someone got a message about a brief they were not on. The team had replaced wandering with a second kind of wandering that looked official because it was numbered.",
      "Version three treated the plan as a small form in memory: a list of steps with an id, an intent, an expected tool, and a done flag. The worker could mark a step done or report a typed failure. It could not append 'also email the CEO'. After a failed run, a short structured note was stored for the next attempt. The CEO has not been mailed since. Simple lookups were later taken off the planner entirely, because a one-tool job does not need a map.",
    ],
    moral:
      "A plan is a list you store, not a vibe in the prompt. The worker marks steps done. It does not invent a new goal because the last page was interesting.",
  },

  stages: [
    {
      id: "jumping-vs-listing",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Let's start from zero. Imagine you are cooking. One way is to look at the pan, decide the next action, look again, decide again. That can work for toast. It works less well for a three-course meal, because you can start plating dessert while the pasta water is still cold.",
        "Many AI helpers work the first way. They look at the latest result, pick a tool, look at the new result, pick again. That pattern has a name you may hear: ReAct, which just means 'think, then act, then look, then think again'. We will use 'the greedy loop' in this sitting so the idea stays plain.",
        "Greedy here is not an insult. It means: choose the next action from what you just saw, without a written map of the whole job. That is often correct for a single lookup. 'What is the status of order 88213?' does not need a five-step plan.",
        "The problem appears when the job has phases a human would name. Research, then outline, then draft, then send. If send is available while you are still in research, the greedy loop can send. The story is that failure.",
        "What happens without a list? The phases live only in someone's head, or in a paragraph of instructions the loop cannot enforce. Instructions are a request. A list in state is data the worker must walk.",
        "At this point you should understand: jumping is fine for short lookup. A written list exists because some jobs have ordered phases the loop will otherwise skip.",
      ],
      diagrams: [
        {
          title: "Greedy next step versus a written list",
          caption: "The list is where 'we are still in research' actually lives.",
          chart: chart(
            `flowchart TD
    Goal([Goal]) --> Greedy[Look then act]
    Greedy --> ToolA[Some tool]
    ToolA --> Greedy
    Goal --> Plan[Write a list]
    Plan --> Walk[Do the next undone step]
    Walk --> ToolB[Expected tool]
    ToolB --> Walk`,
            `class Goal hub
    class Greedy,ToolA grp1
    class Plan,Walk,ToolB grp2`
          ),
        },
      ],
    },
    {
      id: "what-a-plan-is",
      level: "beginner",
      title: "What a plan is, and what it is not",
      body: [
        "A plan, in this sitting, is a short list of steps the helper intends to take. Each step names an intent in plain language, such as 'find three sources' or 'draft 400 words with citations'.",
        "It is not a novel. It is not a strategy memo. It is not a second personality. If a step cannot be checked as done or not done, it is too vague to be a step.",
        "Why write it down? Because then the worker has a current position. After two steps, you can say 'outline is done, draft is not'. The greedy loop cannot say that. It only knows the last observation.",
        "The simplest example is a shopping list. Milk, eggs, bread. You cross off milk. You do not add 'also buy a boat' because the dairy aisle was interesting. That extra item is how the CEO got mailed.",
        "Plan-and-execute is the technical name for this shape: one part writes the list, another part walks it. You can do both jobs with the same model. You still store the list outside the model's head, in your state.",
        "At this point you should be able to say: a plan is a checklist the worker is not free to rewrite in secret.",
      ],
      diagrams: [
        {
          title: "A checklist is data",
          caption: "If a step cannot be marked done, it is not a step yet.",
          chart: chart(
            `flowchart LR
    S1[Find sources] --> S2[Outline]
    S2 --> S3[Draft]
    S3 --> S4[Send to requester]`,
            `class S1,S2,S3 grp1
    class S4 hub`
          ),
        },
      ],
    },
    {
      id: "smallest-checklist",
      level: "beginner",
      title: "How the simplest version works",
      body: [
        "What are we trying to do? Represent the job as data a program can walk.",
        "Here is the smallest version. A step has an id, a sentence of intent, and a done flag. 'Next step' means the first item that is not done. When the worker finishes that item, it marks done and asks for the next.",
        "Let's understand what just happened. The list is now the source of truth. The model can still write the first list. After that, progress is a boolean, not a vibe.",
        "Add one more field when you are ready: the tool family this step expects, such as search or write_doc. That makes later checks cheap. If the worker calls send_email during a research step, you can refuse without a debate.",
        "Keep the list short. Four to six steps is plenty for most briefings. A nine-step plan is how version two invented extra recipients.",
        "At this point you should understand: if you cannot write the job as a short checklist, you are not ready to automate the phases.",
      ],
      codes: [
        {
          title: "A list you can walk",
          language: "python",
          code: `from pydantic import BaseModel

class Step(BaseModel):
    id: int
    intent: str
    tool: str
    done: bool = False

def next_step(plan: list[Step]) -> Step | None:
    return next((s for s in plan if not s.done), None)`,
        },
      ],
    },
    {
      id: "plan-lives-in-state",
      level: "intermediate",
      title: "Keep the plan in state, not only in the prompt",
      body: [
        "State is the memory of this run: the fields your program stores between model calls. The plan belongs there as a list of objects, not as a paragraph the model might paraphrase.",
        "The worker's job is narrow. Read the next undone step. Call a matching tool. Attach the result. Mark done, or return a failure with a type. It does not append a new step because it had a fun idea.",
        "They look similar: a plan in the prompt and a plan in state are both text the model can see. The important difference is who may edit it. Prompt text is suggestions. State is your data, and your code decides the legal edits.",
        "Show the plan to a human when the job is long or outward-facing. People can reject 'also notify the exec team' before a worker runs it. That review is cheap compared with an accidental email.",
        "If you use a framework, this is still the idea. Graph state, a JSON column, a scratch object — the product is the typed list, not the library.",
        "At this point you should understand: the executor marks done. It does not quietly change the goal.",
      ],
      codes: [
        {
          title: "The only legal edit is done",
          language: "python",
          code: `def mark_done(plan: list, step_id: int) -> list:
    for step in plan:
        if step.id == step_id:
            step.done = True
    return plan`,
        },
      ],
      diagrams: [
        {
          title: "Planner writes. Worker walks. State holds the list.",
          caption:
            "New steps are a re-plan event, not a side effect of a tool result.",
          chart: chart(
            `flowchart TD
    Goal([Goal]) --> Planner[Planner]
    Planner --> List[(Step list in state)]
    List --> Worker[Worker]
    Worker --> Tool[Tool]
    Tool --> Worker
    Worker --> List
    Worker --> Done([Result])`,
            `class Goal,Done hub
    class Planner,Worker,Tool grp1
    class List grp2`
          ),
        },
      ],
    },
    {
      id: "replan-on-failure",
      level: "intermediate",
      title: "Re-plan only when a step actually fails",
      body: [
        "The simple walker breaks when a step cannot finish. Search returns nothing. A fetch is denied. A source is missing. If you freeze the old list, the worker spins on a dead step. If you let it freestyle, you are back to the greedy loop.",
        "So you allow a re-plan, but only on a typed failure. Useful types: blocked, missing_evidence, policy_deny. Not useful: 'I am bored', 'this paragraph is spicy', 'maybe the CEO should see it'.",
        "What are we trying to do? Replace the remaining undone steps, keep the ones already done, and write down why the old tail was thrown away.",
        "Cap how often you re-plan. Twice is plenty for a briefing. A worker that re-plans every turn is a greedy loop wearing a checklist costume.",
        "Pause and check. The spicy paragraph in the story is not a typed failure. It is a temptation. The plan should hold.",
        "At this point you should understand: re-plan is a controlled door, not a mood.",
      ],
      codes: [
        {
          title: "Only these failures may rewrite the tail",
          language: "python",
          code: `ALLOWED = {"blocked", "missing_evidence", "policy_deny"}

def may_replan(reason: str, times_used: int) -> bool:
    return reason in ALLOWED and times_used < 2`,
        },
      ],
    },
    {
      id: "reflexion-note",
      level: "intermediate",
      title: "After the run: a short lesson, not a diary",
      body: [
        "Sometimes the same job will be tried again. A human retries. An eval retries. The next attempt should not repeat a known mistake.",
        "Reflexion is a name for a simple extra beat: after the run, write a short critique, store it, and load it the next time. The idea is 'remember what went wrong' — but only as structured data.",
        "A useful lesson looks like this: trigger, forbidden tool or missing step, reason. Example: trigger='briefing', forbidden_tool='send_email before citations', reason='recipient was not the requester'.",
        "A novel in memory is a new prompt-injection surface. Long free text can carry leftover document sentences into the next run. Keep fields short. Treat the lesson as untrusted data if any untrusted document was in the failed run.",
        "This is not the model rewriting its own weights. It is a note in a store. The next run reads the note as a constraint. A fuller improvement loop lives in the self-improving sitting. Here, one structured note is enough.",
        "At this point you should understand: Reflexion is a typed sticky note for the next attempt, not a memoir.",
      ],
      diagrams: [
        {
          title: "Plan, walk, then write a tiny lesson",
          caption:
            "The lesson is fields, not a paragraph the next model might obey as a new goal.",
          chart: chart(
            `flowchart LR
    Plan[Planner] --> Walk[Worker]
    Walk --> Review[Write lesson]
    Review --> Note[(Structured note)]
    Note --> Plan`,
            `class Plan,Walk,Review grp1
    class Note hub`
          ),
        },
      ],
    },
    {
      id: "when-not-to-plan",
      level: "advanced",
      title: "When the right plan is no plan",
      body: [
        "Remember the simple story: phases need a list. The advanced honesty is that many jobs do not have phases. A single lookup pays two model calls if you add a planner — one to write 'step 1: look up the order', one to do it. That is cost and latency for no control.",
        "Use the greedy loop when the next tool is obvious and the blast radius is small. Use a plan when you must show phases to a human, when send or pay is in the toolbox, or when you keep skipping a required step in traces.",
        "Long plans go stale. The world changes while you walk. Cap the list at five to eight steps and force a checkpoint: after step four, look at the goal again and re-plan only if a typed failure says so.",
        "Frameworks will offer planners as a default. Defaults are not a diagnosis. If ninety percent of runs call the same three tools in the same order, promote that path to a fixed workflow and stop paying for a planner.",
        "Trade-off: a plan adds control and an extra failure mode — the planner invents work. A greedy loop is cheaper and can wander. Pick from the job, not from a blog post.",
        "At this point you should be able to defend both 'we need a list' and 'this lookup should not plan'.",
      ],
      codes: [
        {
          title: "Do not plan a one-tool job",
          language: "python",
          code: `def needs_plan(goal: str, tools: list[str]) -> bool:
    has_send = "send_email" in tools
    has_phases = any(w in goal.lower() for w in ("brief", "report", "cite"))
    return has_send or has_phases`,
        },
      ],
    },
    {
      id: "eval-the-list",
      level: "advanced",
      title: "Check the list, not only the final memo",
      body: [
        "If you only read the final briefing, you will hire lucky workers. Look at the path. Did research run before send? Did the worker call a tool outside the current step's family? Did a re-plan happen for a typed reason?",
        "These checks are cheap because the plan is data. You do not need a judge model to see that send_email ran while step 1 was still 'find sources'.",
        "In production, store the plan next to the trace. When a human asks 'why did this go to the CEO', you show step 4 changing, or you show that there was no list at all.",
        "A good interview answer names the default: greedy loop for short lookup, plan-and-execute for ordered phases, Reflexion for retries across runs. None of them replaces a tool gateway. A plan that says send_email is still a proposal.",
        "When the list keeps looking the same across hundreds of tickets, delete the planner. A workflow is a plan you wrote once. That is a feature.",
        "At this point you can teach the sitting: map first when phases matter, store the map, re-plan on typed failure, write a tiny lesson, and skip the map when the job is one tool.",
      ],
      diagrams: [
        {
          title: "Three cheap path checks",
          caption:
            "The plan makes these checks mechanical. A final paragraph cannot.",
          chart: chart(
            `flowchart TD
    Run([Finished run]) --> Ord{Research before send}
    Run --> Fam{Tool matches step}
    Run --> Why{Re-plan had a type}
    Ord --> Score[Path score]
    Fam --> Score
    Why --> Score`,
            `class Run,Score hub
    class Ord,Fam,Why grp2`
          ),
        },
      ],
    },
  ],

  workedExample: {
    title: "Turn the briefing helper into a list the worker cannot rewrite",
    setup:
      "Same job as the story: sources, outline, draft, citations, send to the requesting analyst. Tools include send_email.",
    walkthrough: [
      "Step 1 — Understand the problem. Send is available too early. The greedy loop has no 'still in research' flag.",
      "Step 2 — Identify the relevant concept. A typed plan in state. The worker may mark done or fail. It may not add recipients.",
      "Step 3 — Build the simplest solution. Four steps, each with an expected tool family. send_email is legal only on the last step.",
      "Step 4 — Improve it. Show the list to the analyst before walking. Reject invented 'notify exec team' steps.",
      "Step 5 — Handle a failure or edge case. If fetch is denied, return missing_evidence and re-plan the remaining research steps once.",
      "Step 6 — Explain the production version. After a bad send, store a Reflexion note forbidding send_email before citations. Lookups without 'brief' in the goal skip the planner.",
    ],
    result:
      "The worker can still write a briefing. It cannot mail the CEO from a research observation. One-tool lookups no longer pay for a planner.",
  },

  practice: {
    title: "A helper that researches, drafts, and posts",
    task:
      "You have tools search, retrieve, write_doc, and publish_url. The job is a weekly internal note. Problem: design the plan as a list of steps. Say what the worker is forbidden to do. Say when you would skip the planner. Then write one Reflexion note you would store if publish ran before citations. Think about: which step is allowed to hold publish, and what typed failure is allowed to rewrite the list.",
    hint:
      "Publish is the send_email of this problem. Expected reasoning: four checkable steps, one publisher, typed re-plan only, skip the planner for a one-page lookup.",
    solution:
      "Steps: (1) search internal sources, tool search; (2) retrieve the three cited pages, tool retrieve; (3) draft 400 words with source ids, tool write_doc; (4) publish only after citations exist, tool publish_url. Worker may mark done or return blocked / missing_evidence / policy_deny. It may not append extra channels. Skip the planner for 'what is the status of page X'. Reflexion note: trigger='weekly note', forbidden='publish_url before all sentences have source ids', reason='publish ran from a draft observation'. Why this works: publish is illegal until the last step, and the note is fields, not a diary. Common wrong approach: a system prompt that says 'please publish last' with publish available on every turn.",
  },

  takeaways: [
    "A greedy loop picks the next tool from the last result. That is enough for a short lookup.",
    "A plan exists because some jobs have phases the loop will otherwise skip, especially send and pay.",
    "Store the plan as a list in state. The worker marks done. It does not secretly add a goal.",
    "Re-plan only on a typed failure, and only a few times. Boredom is not a type.",
    "Reflexion is a structured note for the next attempt, not a diary and not new model weights.",
    "If the job is one tool, a planner is an extra bill. If the path is stable, write it once as a workflow.",
  ],

  mistakes: [
    "Mistake: plan a one-tool lookup. Why people make it: planning sounds more serious. What actually happens: you pay two model calls. Better approach: call the tool.",
    "Mistake: let the worker append steps. Why people make it: flexibility feels robust. What actually happens: 'also email the CEO'. Better approach: legal edits are done, fail, or typed re-plan.",
    "Mistake: keep the plan only in the prompt. Why people make it: it is visible to the model. What actually happens: the model paraphrases it away. Better approach: typed state.",
    "Mistake: re-plan whenever the last page is interesting. Why people make it: the worker looks stuck. What actually happens: you are back to greedy. Better approach: typed failure reasons.",
    "Mistake: store a long reflection essay. Why people make it: more text feels like more learning. What actually happens: leftover document text becomes a new instruction. Better approach: three short fields.",
    "Mistake: keep a planner after every run looks the same. Why people make it: the diagram is pretty. What actually happens: cost without control. Better approach: promote the path to a workflow.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question:
        "When would you use a written plan instead of a greedy think-act loop?",
      answer:
        "What they are testing: phases versus lookup. Good answer: use a plan when the job has ordered phases or a dangerous tool such as send; use the greedy loop for a short lookup. Why that is good: you picked from the job, not from fashion. Follow-up: where does the plan live?",
    },
    {
      difficulty: "medium",
      question: "How do you stop an executor from inventing extra work?",
      answer:
        "What they are testing: plan as data. Good answer: store steps with ids and done flags; only mark done or return a typed failure; re-plan is a separate door with a cap. Why that is good: the worker has no legal way to append 'also notify execs'. Follow-up: what failure types are allowed to re-plan?",
    },
    {
      difficulty: "hard",
      question:
        "ReAct, plan-and-execute, and Reflexion — how do you choose a default?",
      answer:
        "What they are testing: trade-offs, not trivia. Good answer: ReAct for short tool-heavy lookup; plan-and-execute when phases must be shown or enforced; Reflexion as a cross-run note, not a replacement for either loop. Why that is good: you said when not to use each. Follow-up: how would you know it is time to drop the planner?",
    },
  ],

  glossary: [
    {
      term: "Greedy loop",
      meaning:
        "Pick the next action from the latest result, with no written map. Why it matters: cheap and useful for lookup, risky when send is on the table.",
    },
    {
      term: "Plan",
      meaning:
        "A short list of steps stored as data. Why it matters: that is where 'we are still in research' lives.",
    },
    {
      term: "Plan-and-execute",
      meaning:
        "One part writes the list, another part walks it. Why it matters: walking without a stored list is just a greedy loop again.",
    },
    {
      term: "Typed failure",
      meaning:
        "A named reason a step could not finish, such as missing_evidence. Why it matters: only these reasons should be allowed to rewrite the remaining steps.",
    },
    {
      term: "Reflexion",
      meaning:
        "After a run, store a short structured lesson for the next attempt. Why it matters: a diary is noisy and can carry untrusted text.",
    },
    {
      term: "State",
      meaning:
        "The fields your program remembers between model calls. Why it matters: the plan belongs here so your code, not the model, owns legal edits.",
    },
  ],
};
