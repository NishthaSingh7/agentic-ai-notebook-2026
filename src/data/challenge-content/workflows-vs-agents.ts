import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "workflows-vs-agents",
  instructor:
    "I am a senior engineer who builds AI products. I still start this topic from zero every time I teach it, because the idea is simple and the failures are not.",
  promise:
    "You will go from never having heard of a workflow versus an agent to being able to tell them apart, write a tiny fixed path, and say when a small loop inside one step is worth the extra cost.",

  story: {
    title: "The signup check that never ran",
    body: [
      "A fintech built what the roadmap called an onboarding agent. A new business applied. The helper was supposed to read the form, check the company registry, screen the directors against a sanctions list, score the risk, and either approve, ask for more documents, or escalate. Seven tools. A loop. A prompt that listed the steps in careful order.",
      "For months it looked wonderful. Onboarding dropped from two days to a few minutes. Then an internal audit sampled approved applications. In eleven of them, the sanctions screening tool had never been called. Not failed — never called. The registry lookup had looked clean, the model had written a confident paragraph, and it had moved on to scoring.",
      "One of those eleven had a director on a sanctions list. The procedure was in the prompt. The model had simply decided it already had enough information.",
      "The team pulled six months of traces. Ninety-four percent of runs were the same five calls in the same order. They turned that majority into a fixed path, where screening is a box you cannot walk around. The rare messy-document cases stayed as a small loop inside one box, with a tiny budget. Cost fell. The skip-shaped bug became structurally impossible.",
    ],
    moral:
      "Autonomy is how you handle a path you cannot write down in advance. When the path is known, autonomy is a way of making a required step optional.",
  },

  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Think about baking bread from a printed recipe. Step three is 'add yeast'. If you skip it, you do not have bread. The recipe does not let you skip it because you feel confident about the flour.",
        "Now think about a skilled cook with no recipe, only a pantry. They taste, decide, and act. That flexibility is useful when dinner is leftovers and you do not know the path. It is dangerous when dinner is a legal checklist.",
        "Many AI products are legal checklists wearing a demo of a skilled cook. Someone writes the steps in a prompt. The model is free to take them in any order, or to skip one. Most days it behaves. On the day it feels done early, a required control disappears.",
        "That is the problem this lesson solves. We need a word for 'the path is written in code' and a word for 'the model chooses the next action'. We will define both slowly. We will not start with a framework.",
        "Pause and check. Who is allowed to decide what happens next — you, before the run, or the model, during the run? Hold that question. Everything else in this sitting is a way of answering it.",
        "At this point you should feel the problem in your body: a required step that lives only in a sentence can become optional.",
      ],
      diagrams: [
        {
          title: "Recipe versus pantry",
          caption: "Same oven. Different control. Only one of these can skip yeast.",
          chart: chart(
            `flowchart LR
    Recipe[Printed recipe] --> Yeast[Must add yeast]
    Yeast --> Loaf([Bread])
    Pantry[Cook with a pantry] --> Maybe{Feeling done?}
    Maybe -->|yes| Early([Skipped yeast])
    Maybe -->|no| Loaf`,
            `class Loaf,Early hub
    class Recipe,Yeast grp1
    class Pantry,Maybe grp2`
          ),
        },
      ],
    },
    {
      id: "name-the-two",
      level: "beginner",
      title: "Name the two shapes: workflow and agent",
      body: [
        "A workflow is a predetermined path. You wrote the boxes and the arrows. A language model may work inside a box — extract a name, draft a paragraph — but it does not choose the next box. Control flow is code. It is the same on every run.",
        "An agent is a loop. You give the model a goal and a toolbox. On each turn it decides whether to call a tool or to stop. The sequence can change from run to run, because it depends on the model's judgement.",
        "They look similar because both can use a powerful model. The important difference is not intelligence. A workflow can contain a frontier model in four boxes and still be a workflow. An agent can be a small model with two tools and still be an agent. The difference is who owns the order of operations.",
        "Why does order matter? Because requirements live in order. 'Screen against sanctions before you approve' is an ordering rule. In a workflow it is an arrow. In an agent it is a sentence. An arrow cannot be skipped. A sentence can.",
        "Here is a tiny concrete example. Workflow: extract → registry → sanctions → score. Agent: a loop that may call those four tools in any order, or skip one if it feels finished. Same tools. Different guarantee.",
      ],
      codes: [
        {
          title: "Same four verbs. Only the left one is a recipe.",
          language: "python",
          code: `STEPS = ["extract", "registry", "sanctions", "score"]

def workflow(app):
    state = app
    for name in STEPS:          # you chose the order
        state = run_box(name, state)
    return state

def agent(app, tools, budget=8):
    notes = [app]
    for _ in range(budget):     # the model chooses the order
        pick = model_choose(notes, tools)
        if pick == "done":
            return notes[-1]
        notes.append(run_box(pick, notes))
    return {"status": "escalate"}`,
        },
      ],
    },
    {
      id: "middle-shape",
      level: "beginner",
      title: "How the simplest version works: four shapes, not two",
      body: [
        "There is a useful shape that lacks a fancy name: a workflow with branches you listed in advance. Classify the input, then take path A, B, or C. Each path is still a recipe. You can draw every arrow. You can write a test for every path.",
        "People call this an agent because behaviour changes with the input. Changing with the input is not a loop. A vending machine that gives chips or soda is not improvising. It is a branched recipe.",
        "A fourth shape appears later: a small loop living inside one workflow box. The outer path is still fixed. Only the messy box is allowed to think. That is how the onboarding team kept the rare blurry-scan cases without letting screening become optional.",
        "So the vocabulary for the rest of this sitting: fixed workflow, routed workflow, contained agent, open agent. 'We are building an agent' is not a design. It does not say which of the four you mean.",
        "Pause and check. If you can write the steps on a napkin, including the branches, you do not need an open loop. You need a workflow. Autonomy is expensive. Buy it only when the napkin stays blank.",
        "At this point you should understand the simplest version: pick a shape by who chooses the next box, not by how smart the model is.",
      ],
      diagrams: [
        {
          title: "Four shapes, not two",
          caption: "Most shipped 'agents' are routed workflows. Ask who chooses the next box.",
          chart: chart(
            `flowchart TB
    subgraph FixedPath["Fixed workflow"]
      W1[Extract] --> W2[Registry] --> W3[Sanctions] --> W4[Score]
    end
    subgraph RoutedPath["Routed workflow"]
      R0[Classify] --> R1[Path A]
      R0 --> R2[Path B]
    end
    subgraph HeldLoop["Contained loop"]
      C0[One box] --> C1[Think]
      C1 --> C2[Tool]
      C2 --> C1
    end
    subgraph OpenLoop["Open agent"]
      O1[Think] --> O2[Any tool]
      O2 --> O1
    end`,
            `class W1,W2,W3,W4 grp1
    class R0,R1,R2 grp3
    class C0,C1,C2 grp2
    class O1,O2 hub`
          ),
        },
      ],
    },
    {
      id: "build-a-workflow",
      level: "intermediate",
      title: "Build the simplest workflow",
      body: [
        "What are we trying to do? Encode 'never skip sanctions' so the runtime enforces it. Here is the smallest version: four functions and three arrows. No toolbox. No while-loop. The model only fills fields inside a box.",
        "Let's understand what happened. extract_fields is a model call that returns a typed object. The next line always calls screen_sanctions with those fields. There is no branch that goes to approve without that call. A unit test can assert the call happened even if you stub the model.",
        "This is boring on purpose. Boring is how required controls survive a confident paragraph. If ninety-four percent of your traces already look like this, you are not losing product magic by writing it down. You are deleting a skip.",
        "When would you add a model inside a box? When the work inside that box is language-shaped: reading a blurry scan, extracting a name, drafting the escalation note. The box still returns a typed result. The next arrow does not care how the box felt.",
        "Connect this back to the story. The team did not fire the model. They stopped letting the model own the arrows.",
      ],
      diagrams: [
        {
          title: "The model fills a box. Code owns the arrows.",
          caption: "A frontier model inside extract does not make this an agent.",
          chart: chart(
            `flowchart LR
    App([Application]) --> Ext[Extract box]
    Ext --> Reg[Registry box]
    Reg --> San[Sanctions box]
    San --> Score[Score box]
    Score --> Out([Decision])
    Mdl[Model] -.-> Ext`,
            `class App,Out hub
    class Ext,Reg,San,Score grp1
    class Mdl grp2`
          ),
        },
      ],
      codes: [
        {
          title: "Smallest onboarding path. Screening is a line of code.",
          language: "python",
          code: `def onboard(application: dict) -> dict:
    fields = extract_fields(application)          # model fills a form
    registry = check_registry(fields.company_id)  # always runs
    screen = screen_sanctions(fields.directors)   # always runs
    if screen.hit:
        return {"status": "escalate", "reason": screen.reason}
    score = score_risk(fields, registry)
    return {"status": "approve" if score.ok else "ask_docs", "score": score.n}`,
        },
      ],
    },
    {
      id: "when-recipe-fails",
      level: "intermediate",
      title: "When the simple recipe is not enough",
      body: [
        "The simple workflow breaks when you cannot list the steps. A customer writes a paragraph that might be a refund, a shipping delay, a fraud report, or three of those at once. You do not have a napkin. That is a fair reason to buy a loop.",
        "Even then, buy the smallest loop. Give it three tools, not twenty. Give it a step budget — a hard maximum number of turns — so it cannot think forever. If it exhausts the budget, hand the ticket to a person. That is a contained agent: a loop with walls.",
        "A common failure: teams keep the open loop for the whole product because two percent of cases are messy. They pay agent cost on the ninety-eight percent, and they re-introduce the skip on the required cases. Put the loop inside the one messy box. Keep the required boxes as arrows.",
        "Another failure: calling a branched workflow an agent in the design review. Then nobody writes the tests the branches deserve, because 'agents are hard to test'. If you can enumerate the paths, you can test them. Do not hide a recipe behind a glamorous word.",
        "At this point you should understand the upgrade rule. Start with a workflow. Promote a box to a loop only when traces show that box needs judgement. Do not start with a loop and hope to add structure later.",
      ],
      codes: [
        {
          title: "A loop that is allowed to live in one box only.",
          language: "python",
          code: `def messy_document_box(scan: bytes, budget: int = 4) -> dict:
    notes = []
    for step in range(budget):
        action = model_choose(scan, notes)  # model picks a tool or 'done'
        if action["tool"] is None:
            return action["result"]
        notes.append(run_tool(action["tool"], action["args"]))
    return {"status": "escalate", "reason": "budget"}`,
        },
      ],
    },
    {
      id: "hybrid-app",
      level: "intermediate",
      title: "How the pieces sit in a real application",
      body: [
        "In a real app, a request hits a route. The route should pick a door: workflow or agent. Checkout, onboarding, and payroll are doors that should open onto a workflow. 'Help me debug this error' may open onto an agent.",
        "The workflow runs boxes. Some boxes call APIs. Some boxes call a model. One box may run a tiny loop. Every box writes a typed result into a record you can store: the application id, the screen result, the score. That record is the ledger. The chat transcript is not the ledger.",
        "If you use a transcript as the ledger, 'we already screened' is a sentence someone may or may not read. If you use a record, 'we already screened' is a field. The next box looks at the field. This is the same lesson as a shopping cart: you do not store 'I think I added milk' as a paragraph. You store a line item.",
        "Evaluation follows the shape. A workflow is tested per box, like ordinary functions. An agent needs examples of whole paths, including paths that should refuse. That extra eval cost is one reason you do not want an open loop on a known path.",
        "Why an engineer should care on a Tuesday: the KYC skip was not a model bug. It was a shape bug. Changing the prompt would have lowered the skip rate. Changing the arrows made the skip rate zero.",
      ],
      diagrams: [
        {
          title: "Request picks a door",
          caption: "Known path, workflow. Unknown path, small loop. A record, not a chat, is the ledger.",
          chart: chart(
            `flowchart TD
    Req([User request]) --> Door{Path known?}
    Door -->|yes| Wf[Workflow boxes]
    Door -->|no| Ag[Small loop]
    Wf --> Rec[(Typed record)]
    Ag --> Rec
    Rec --> User([Answer or escalate])`,
            `class Req,User hub
    class Wf,Ag grp1
    class Door grp2
    class Rec grp3`
          ),
        },
      ],
    },
    {
      id: "four-bills",
      level: "advanced",
      title: "What autonomy costs once you understand the simple system",
      body: [
        "Remember the simple workflow: four calls, fixed order, predictable bill. An open loop spends four budgets at once. Name them before you buy.",
        "Tokens: each loop turn re-reads the growing notes. Cost climbs faster than 'number of steps'. The onboarding loop was many times more expensive than the workflow that replaced it, mostly from re-reading.",
        "Latency: workflow boxes that do not depend on each other can run together. A loop is one step after another. Users feel the slow tail, not the median. A four-minute wait with a twelve-second median is still a four-minute product.",
        "Evaluation and security: you must test paths you do not control, and every tool is reachable on every step, including steps after a hostile document. In a workflow, the sanctions tool is called by box three with arguments your code supplied. There is no prompt-injection path to skip it.",
        "None of this means loops are bad. It means they are expensive. The reason to pay is always the same: you cannot write the path down. If you can, you are paying to make a required step optional.",
      ],
    },
    {
      id: "production-promote",
      level: "advanced",
      title: "Production: measure traces, then promote them back",
      body: [
        "Once a loop is in production, treat traces as a map of what the path actually is. If a sequence appears in ninety percent of successful runs, that sequence wants to become a workflow. This is not a demotion. It is how you stop paying autonomy tax on a path you have now learned.",
        "Keep a budget on any remaining loop: steps, tokens, wall-clock, and side-effecting calls. When any counter trips, halt honestly. Do not return a confident paragraph that pretends the work finished.",
        "Sell the constraint without marketing language. A stakeholder who asked for 'full autonomy' asked for flexibility. Show them the skip, the cost, and the two-percent messy box you still left as a loop. You are not taking the AI away. You are putting the AI where judgement exists.",
        "When not to promote: the path is still spreading. New tools keep appearing. The traces do not cluster. Then you still have an open problem, and a loop may be honest. Revisit in a month. Do not declare 'we are an agent company' as a reason to skip the napkin.",
        "You should now be able to sit in a design review and ask one question: can we draw the arrows? If yes, draw them. If no, contain the loop. If someone answers 'the prompt has the arrows', that is the onboarding incident.",
      ],
      codes: [
        {
          title: "A skip becomes a test, not a prompt hope.",
          language: "python",
          code: `def test_sanctions_always_runs(monkeypatch):
    called = {"n": 0}
    monkeypatch.setattr(
        "screen_sanctions",
        lambda d: called.__setitem__("n", 1) or type("S", (), {"hit": False})(),
    )
    onboard({"company_id": "x", "directors": ["a"]})
    assert called["n"] == 1`,
        },
      ],
      diagrams: [
        {
          title: "Traces become arrows",
          caption: "A repeated sequence is a workflow you have not typed yet.",
          chart: chart(
            `flowchart LR
    Runs[Many loop traces] --> Cluster{Same sequence?}
    Cluster -->|yes| Promo[Write a workflow]
    Cluster -->|no| Keep[Keep a small loop]
    Promo --> Fixed([Required steps as arrows])
    Keep --> Walls[Budget plus few tools]`,
            `class Fixed,Runs hub
    class Promo,Keep grp1
    class Cluster grp2
    class Walls grp3`
          ),
        },
      ],
    },
  ],

  workedExample: {
    title: "Turn the onboarding helper into a path you can defend",
    setup:
      "Seven tools, one open loop, a prompt that lists screening. Eleven approved applications never called the sanctions tool. Ninety-four percent of traces are the same five calls.",
    walkthrough: [
      "Step 1 — Understand the problem. The required control lives in a sentence. The model can skip a sentence. Audit found it did.",
      "Step 2 — Identify the relevant concept. This is a known path wearing an agent. Order of operations must be code, not inclination.",
      "Step 3 — Build the simplest solution. Write extract → registry → sanctions → score as functions. Approval cannot run unless sanctions returned a result.",
      "Step 4 — Improve it. Pull the two-percent blurry-scan cases into one box with a four-step loop and three tools. Everything else stays arrows.",
      "Step 5 — Handle a failure. If sanctions is down, the workflow stops and escalates. It does not 'continue with best effort'. That continue is how skips return.",
      "Step 6 — Production version. Store each box result on the application record. Alert if a record reaches approve with a null screen. Review traces monthly for new clusters to promote.",
    ],
    result:
      "Screening is an arrow. The messy box still has a small loop. Cost and wait time drop. The class of bug where a compliance step is skipped is no longer a prompt-quality problem.",
  },

  practice: {
    title: "Pick a shape for password reset",
    task:
      "A product manager wants an 'autonomous password-reset agent'. The real steps are: identify the user, send a code, check the code, rotate the password, email a confirmation. Two percent of users have a locked account and need a specialist. Think about who must own the order, and where a loop is actually justified. Draw the shape you would ship.",
    hint:
      "Ask whether you can write the steps on a napkin. Then ask which single box is messy. Do not start with a toolbox of five tools in one loop. Expected reasoning: known path is a workflow; only the locked-account box might loop.",
    solution:
      "Ship a workflow: identify → send code → check code → rotate → email. Put a contained loop only on the locked-account box, or just escalate that box to a human. Why this works: rotating without a verified code becomes structurally impossible, and you still have a place for the two percent. Common wrong approach: one agent with all five tools and a prompt that says 'always verify the code before rotating'.",
  },

  takeaways: [
    "A workflow is a path you wrote. An agent is a loop where the model chooses the next action. The difference is control, not intelligence.",
    "Requirements live in order. An arrow cannot skip sanctions. A prompt sentence can.",
    "A branched recipe is still a workflow. Changing with input is not the same as improvising.",
    "Start with a workflow. Promote one box to a loop only when traces show that box needs judgement.",
    "Autonomy costs tokens, latency, evaluation, and attack surface at the same time. Pay that bill only when the napkin is blank.",
    "Repeated traces are a workflow you have not typed yet. Promote them. Keep a budget on whatever loop remains.",
  ],

  mistakes: [
    "Mistake: calling anything with a model an agent. Why people make it: the word is fashionable. What actually happens: nobody writes the tests a recipe deserves. Better approach: name the four shapes and pick one.",
    "Mistake: putting a known checklist in a prompt and a toolbox. Why people make it: the demo is fast. What actually happens: a required step becomes optional. Better approach: write the arrows in code.",
    "Mistake: using an open loop because two percent of cases are messy. Why people make it: one design feels simpler. What actually happens: you pay agent cost on ninety-eight percent and re-introduce skips. Better approach: contain the loop in one box.",
    "Mistake: treating the transcript as the ledger. Why people make it: the chat is right there. What actually happens: 'we already screened' is a sentence. Better approach: store typed results on the business record.",
    "Mistake: strengthening the prompt after a skip. Why people make it: it is a one-line change. What actually happens: the skip rate drops, then returns. Better approach: make the step an arrow.",
    "Mistake: refusing to promote a stable loop back to a workflow. Why people make it: autonomy feels like progress. What actually happens: you keep paying for a path you already know. Better approach: measure clusters and type them in.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "In one minute, what is the difference between a workflow and an agent?",
      answer:
        "What they are testing: the control-flow definition, not a brand. Good answer: a workflow's next step is chosen by code you wrote; an agent's next step is chosen by the model from a toolbox. Same model can live in both. Why that is good: it refuses the 'smarter / dumber' trap. Follow-up: is a classifier that routes to three fixed paths an agent?",
    },
    {
      difficulty: "medium",
      question: "An audit found an agent skipped a required compliance tool. What do you change first?",
      answer:
        "What they are testing: shape over prompt. Good answer: pull traces, see if the happy path is stable, rewrite that path as a workflow so the tool is an arrow, and keep a small loop only for the truly messy cases. Why that is good: it matches how the skip happened and how you make it impossible. Follow-up: how would you prove in a test that the tool cannot be skipped?",
    },
    {
      difficulty: "hard",
      question: "When is an open agent the right product, and how do you keep it from eating a workflow you could have drawn?",
      answer:
        "What they are testing: judgement and cost. Good answer: use an open loop when you cannot predetermine the path and you are willing to pay tokens, latency, eval, and a larger attack surface. Contain it with budgets and a small toolbox. Review traces and promote stable sequences back to workflows. Why that is good: it treats autonomy as a budget, not a destination. Follow-up: which of the four costs would make you say no even if the path is unknown?",
    },
  ],

  glossary: [
    {
      term: "Workflow",
      meaning:
        "A path whose boxes and arrows you wrote in advance. Why it matters: required steps live on arrows, so they cannot be skipped.",
    },
    {
      term: "Agent",
      meaning:
        "A loop where the model chooses the next tool or a final answer. Why it matters: useful when the path is unknown, expensive when it is known.",
    },
    {
      term: "Routed workflow",
      meaning:
        "A recipe with branches you listed. Why it matters: varying with input is not the same as improvising.",
    },
    {
      term: "Contained agent",
      meaning:
        "A small loop living inside one workflow box, with a budget. Why it matters: you keep judgement where the napkin is blank.",
    },
    {
      term: "Control flow",
      meaning:
        "Who decides what happens next. Why it matters: this is the whole difference between the two shapes.",
    },
    {
      term: "Autonomy budget",
      meaning:
        "Limits on steps, tokens, time, and side effects for a loop. Why it matters: a loop with no door is an outage with a personality.",
    },
  ],
};
