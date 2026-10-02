import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "tree-of-thoughts",
  instructor:
    "I am a senior engineer sitting next to you. We start from zero. If you have only ever asked a model to answer once, that is fine. We will first see why a single path can get stuck, then we will grow a tiny tree of options, score them, throw most away, and learn when that extra work is not worth the bill.",
  promise:
    "You will be able to explain Tree of Thoughts in plain English, write a small branch-score-prune loop in Python, put a budget on width and depth, tell this search from a ReAct path, and refuse a tree that scores its own eloquence.",
  story: {
    title: "The reroute planner that picked the most eloquent illegal plan",
    body: [
      "A logistics team had a late container. The first helper worked like a person with a checklist: look up the ship, check three trains, pick one. That is a single path. It usually finished in four steps. A researcher replaced it with a branching planner they had read about: at each choice, propose several next ideas, score them, keep the best, grow another level. The notebook printed a beautiful indented plan.",
      "On the first live exception the tree grew to dozens of scored ideas. The winning plan sounded like something an executive would clap for: divert through a partner terminal, book a Saturday train, notify the retailer. A second model call had scored it 9.4 out of 10. A dock supervisor would have stopped at sentence two. Saturday trains through that partner were not allowed. The Saturday gate had been closed for months.",
      "The container still missed the window. The bill for the search was hundreds of dollars, because every score stuffed the growing tree back into a prompt. Nobody had capped how wide or how deep the tree could go. The scorer was the same model wearing a judge hat, so pretty language won. The tree had searched sentences, not the world.",
      "The rebuild kept branching only for the rare problem where an early pick is expensive to undo and a cheap check exists. Options had to be real ids from a live inventory tool. The scorer became a function: rules, gate hours, cost. Width three, depth two. The checklist helper stayed the default. The next late container cost pennies of scoring and left on a legal train.",
    ],
    moral:
      "A tree that scores its own eloquence is a more expensive way to be wrong. Branching only earns its keep when you can prune against the world.",
  },
  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "The problem: one path can pick too early",
      body: [
        "Imagine you are choosing a route across a city. If you always take the first street that looks promising, you can walk into a dead end and have to start over. If the dead end is expensive — a train already booked, a container already diverted — you wish you had looked at two streets before committing.",
        "A normal model call is one path. You ask. It answers. A ReAct helper, from an earlier sitting if you have had it, is also one path: think, act, see, repeat. It commits at each step. That is cheap. It is also short-sighted. Sometimes that is fine. Often it is fine.",
        "Some problems punish an early commitment. Puzzles like 'make 24 with these four numbers'. Routes with hard rules. Plans where step one blocks step three. For those, you want to hold several partial answers at once, compare them, and throw most away.",
        "Here is a tiny concrete example. Numbers 4, 8, 3, 3. Path A starts with 4+8. Path B starts with 8-3. A single-path helper picks one and never looks at the other. A tree would keep both for a moment and drop the one that cannot reach 24.",
        "At this point you should understand the problem. We sometimes need alternatives, not a wiser next token. Next we will name the method.",
      ],
      diagrams: [
        {
          title: "A path versus a handful of options",
          caption:
            "One path commits. A tree keeps a few partial answers and pays for the ones it drops.",
          chart: chart(
            `flowchart TD
    Goal([Goal]) --> Choice{Need alternatives}
    Choice -->|no| Path[Single path]
    Path --> Ans([Answer])
    Choice -->|yes| Root[First thought]
    Root --> A[Option A]
    Root --> B[Option B]
    Root --> C[Option C]
    A --> Keep[Keep the best]
    B --> Keep
    C --> Keep`,
            `class Goal,Ans hub
    class Path,Root,A,B,C,Keep grp1
    class Choice grp2`
          ),
        },
      ],
    },
    {
      id: "what-tot-is",
      level: "beginner",
      title: "What Tree of Thoughts is, without the paper's halo",
      body: [
        "Tree of Thoughts is a search. At each step the model proposes several next thoughts. A scorer gives each thought a value. A pruner keeps a small set and discards the rest. You repeat until a finished thought is good enough, or the budget is gone.",
        "Let's use everyday words. Branch means 'write more than one next idea'. Score means 'rate those ideas'. Prune means 'throw the weak ones away'. Those three verbs are the method. There is no mystical inner committee. There is a tree, a scoring function, and a limit.",
        "Hold this against ReAct for a moment. ReAct is a path. Tree of Thoughts is a frontier — the set of partial answers you are still willing to grow. ReAct is cheap and short-sighted. The tree is expensive and, if the scorer is honest, less short-sighted. If you cannot say which property you need, you want the path. Most production work wants the path.",
        "The original paper used puzzles: Game of 24, crosswords, constrained writing. Those share a shape. The options are discrete. A partial answer can be checked cheaply. A wrong first move is expensive. That is the shape the method was built for. 'Reroute this container' looks like that shape until you notice illegal plans can sound wonderful.",
        "At this point you should be able to say: we propose, we score, we throw away. The model proposes. The world should score.",
      ],
      diagrams: [
        {
          title: "Branch, score, prune",
          caption:
            "Three verbs. The model writes options. A function you trust rates them. Most options die. That death is the point.",
          chart: chart(
            `flowchart TD
    Partial[Partial answer] --> Branch[Propose a few next thoughts]
    Branch --> Score[Score each against the world]
    Score --> Prune[Keep a small set]
    Prune --> Deep{Budget left}
    Deep -->|yes| Partial
    Deep -->|no| Best([Best leaf so far])`,
            `class Partial,Best hub
    class Branch,Score,Prune grp1
    class Deep grp2`
          ),
        },
      ],
    },
    {
      id: "simplest-tree",
      level: "beginner",
      title: "The simplest version: two branches, one prune",
      body: [
        "Let's build the smallest tree. We will not call a vendor yet. We will pretend we already have two candidate next steps and a score function that looks at the world.",
        "What are we trying to do? Keep the option with the better legal score, and drop the other.",
        "Here is the smallest version.",
        "Let's understand what just happened. propose returned two plans. score asked about gate hours, not about eloquence. prune kept one. That is one level of a tree. A real Tree of Thoughts repeats this a few times, each surviving plan growing new children.",
        "Beginners ask the model 'how promising is this from 1 to 10?'. That is scoring language with language. Fluency wins. Use a function when you can. If you cannot, treat the model score as a weak hint, not a decision.",
      ],
      codes: [
        {
          title: "prune.py — keep the legal option",
          language: "python",
          code: `def score(plan: dict) -> float:
    if not plan["gate_open"]:
        return -1.0
    return -plan["hours"]


def prune(plans: list[dict], keep: int = 1) -> list[dict]:
    return sorted(plans, key=score, reverse=True)[:keep]


plans = [
    {"name": "saturday-partner", "gate_open": False, "hours": 10},
    {"name": "monday-rail", "gate_open": True, "hours": 30},
]
assert prune(plans)[0]["name"] == "monday-rail"`,
        },
      ],
    },
    {
      id: "build-the-search",
      level: "intermediate",
      title: "Implement a small search with a budget",
      body: [
        "The simple one-level prune is a taste. A real search repeats. Each kept thought becomes a parent. The model proposes children. You score. You keep a frontier of size width. You stop at depth, or when a leaf passes a done check, or when you have spent too many tokens.",
        "What are we trying to do? Grow a tiny tree with width 2 and depth 2, and never more.",
        "Here is the smallest version.",
        "Let's understand what just happened. The budget is three numbers: width, depth, and a max number of score calls. Width is how many options you keep. Depth is how many times you expand. Without those, the notebook from the story grows until the bill does.",
        "Propose should be constrained when you can. If the next step must be a rail id, the model may only pick from ids a tool just returned. Unconstrained prose is how you get a beautiful illegal Saturday.",
      ],
      codes: [
        {
          title: "search.py — width, depth, then stop",
          language: "python",
          code: `def search(root, propose, score, width=2, depth=2):
    frontier = [root]
    for _ in range(depth):
        kids = []
        for node in frontier:
            kids.extend(propose(node))
        kids.sort(key=score, reverse=True)
        frontier = kids[:width]
    return frontier[0]`,
        },
      ],
      diagrams: [
        {
          title: "Expand, score, keep a few",
          caption:
            "The frontier is the set you are still willing to pay for.",
          chart: chart(
            `flowchart TD
    Root[Root] --> P1[Propose children]
    P1 --> S1[Score]
    S1 --> K1[Keep width]
    K1 --> P2[Propose again]
    P2 --> S2[Score]
    S2 --> K2[Keep width]
    K2 --> Leaf([Best leaf])
    Cap[Depth and token cap] -.-> Halt([Halt])`,
            `class Root,Leaf,Halt hub
    class P1,S1,K1,P2,S2,K2 grp1
    class Cap grp3`
          ),
        },
      ],
    },
    {
      id: "scorer-is-the-product",
      level: "intermediate",
      title: "When the simple tree is not enough: the scorer is the product",
      body: [
        "The simple search is only as honest as score(). If score() is a model asked to rate its own plans, you have a popularity contest. That is the story's 9.4.",
        "A good scorer is cheap and external. A function that checks union rules. A unit test. A cost. A tool that asks whether the gate is open. Run hard constraints first. Do not spend a model call on a plan that is already illegal.",
        "They look similar because both return a number. The important difference is what the number means. A function on gate hours means the world. A model vote means taste. Taste is allowed as a weak prior after the world has spoken. It is not allowed to resurrect a closed gate.",
        "Thought experiment. The best-scoring plan needs a Saturday gate that is closed. What should happen? Prune it before a human sees it. Do not ask the model if it is 'pretty sure the gate might be open'. The tool already said no.",
        "At this point you should understand: branching is cheap relative to a bad side effect. Scoring with unconstrained generation is not scoring.",
      ],
      codes: [
        {
          title: "hard_then_soft.py — the world first",
          language: "python",
          code: `def hard_ok(plan: dict) -> bool:
    return bool(plan.get("gate_open") and plan.get("legal"))


def soft_taste(plan: dict) -> float:
    return float(plan.get("preference", 0))


def rank(plans: list[dict]) -> list[dict]:
    legal = [p for p in plans if hard_ok(p)]
    return sorted(legal, key=soft_taste, reverse=True)`,
        },
      ],
    },
    {
      id: "tot-versus-react",
      level: "intermediate",
      title: "How the pieces connect: when a path beats a tree",
      body: [
        "In a real application you pick a control pattern per job. Lookup a refund status? One path. ReAct. Choose among a few legal rail ids with a cheap rule check? A small tree can win. Write marketing copy? One path, plus a human.",
        "Cost is the other connection. Every extra branch is a model call, and every score that stuffs the tree back in is a larger prompt. I have seen a planner spend more on search than the shipment was worth. Write a token budget next to width and depth. When it trips, return the best leaf so far and say you stopped.",
        "Side effects do not belong inside the tree. Propose and score should be reads. The write — book the train — happens after you pick a leaf, once, with a key. If you book while you search, you have branched into the world, and prune cannot unbook.",
        "They look similar because both call a model more than once. The important difference is the shape. ReAct is one path that can use tools. A tree is several partial answers you are still willing to grow. Most production work wants the path.",
        "At this point you should be able to draw both: a ReAct loop as a line, ToT as a frontier, and the write sitting after the choice.",
      ],
      codes: [
        {
          title: "book_once.py — write after the leaf",
          language: "python",
          code: `def book(shipment_id: str, rail_id: str) -> str:
    return f"{shipment_id}:{rail_id}"


leaf = {"rail_id": "monday-rail"}
key = book("box_17", leaf["rail_id"])
assert key == "box_17:monday-rail"`,
        },
      ],
      diagrams: [
        {
          title: "Search, then write once",
          caption:
            "If a branch can book a train, prune cannot save you.",
          chart: chart(
            `flowchart LR
    Search[Branch and score] --> Pick[Pick a leaf]
    Pick --> Write[Book once]
    Write --> Ledger[(Reservation)]
    Search -.->|reads only| World[(Gates and rails)]`,
            `class Pick,Write hub
    class Search grp1
    class World,Ledger grp3`
          ),
        },
      ],
    },
    {
      id: "failure-modes",
      level: "advanced",
      title: "Failure modes: explosion, captured scorers, pretty illegal plans",
      body: [
        "Remember the simple width-2 depth-2 search. The simple version breaks in three ways you will meet.",
        "Explosion: width 4 and depth 4 is hundreds of nodes if you are not careful, and worse if propose returns unconstrained paragraphs. Cap nodes, not just depth. Log the count.",
        "A captured scorer: the actor and the judge share the same blind spots. Both love fluent plans. Split them. The judge should be a function, or at least a model that cannot see the pretty paragraph — only structured fields.",
        "A pretty illegal plan: the tree found language that satisfies a soft score and violates a hard rule you did not encode. Encode the rule. If you cannot encode it, you do not have a scorer, and you should not be using a tree on that job.",
        "Thought experiment. All branches fail the hard rules. What should you do? Halt and tell a human. Do not pick the 'least illegal' eloquent plan. The story did that with a 9.4.",
      ],
      diagrams: [
        {
          title: "Hard rules before taste",
          caption:
            "A closed gate never reaches the model judge.",
          chart: chart(
            `flowchart TD
    Child[Candidate] --> Hard{Gate open and legal}
    Hard -->|no| Drop[Prune now]
    Hard -->|yes| Soft[Optional model taste]
    Soft --> Keep[Frontier]`,
            `class Child,Keep hub
    class Hard grp2
    class Soft,Drop grp3`
          ),
        },
      ],
    },
    {
      id: "when-to-use-tot",
      level: "advanced",
      title: "Production judgment: most jobs should stay a path",
      body: [
        "Remember the simple pitch: look at alternatives before you commit. That remains right for a small discrete space with a cheap external check.",
        "It is the wrong default for everyday agents. Support lookup, refunds, classification — a path with tools is cheaper and easier to stop. Adding a tree because a paper was impressive is how you buy a 400-dollar indent.",
        "When you do use it in production: constrain propose to tool ids, score with functions first, budget width depth and tokens, no writes until a leaf is chosen, traces that record which branch died and why. If you cannot name the scorer in one sentence, you are not ready.",
        "Interview-level honesty: Tree of Thoughts is not 'the model thinks harder'. Thinking harder, if it exists, is more tokens on one path. This method is breadth. You are paying for ideas you will throw away. Pay only when a greedy path systematically misses a better legal branch.",
        "At this point you should be able to teach the sitting: branch, score, prune — and the honesty to kill a branch.",
      ],
    },
  ],
  workedExample: {
    title: "Late container, two legal rails, one closed Saturday",
    setup:
      "A container must move before a chargeback window. Inventory tool returns three ids: saturday-partner (gate closed), monday-rail (open, 30h), tuesday-road (open, 40h). You may book only after you pick.",
    walkthrough: [
      "Step 1 — Understand the problem. An early pick matters, and a cheap check exists: is the gate open?",
      "Step 2 — Identify the relevant concept. A tiny Tree of Thoughts, not ReAct, and not a model self-score.",
      "Step 3 — Build the simplest solution. propose() may only emit the three ids. score() returns -1 if the gate is closed, else -hours.",
      "Step 4 — Improve it. width 3, depth 1 is enough here. Token cap as a backstop.",
      "Step 5 — Handle a failure. saturday-partner is pruned before any booking. If all ids fail, halt to a human.",
      "Step 6 — Production. Book monday-rail once with a shipment-derived key. Traces show the pruned Saturday and the reason gate_closed.",
    ],
    result:
      "The eloquent illegal plan never reaches the dock. The search costs pennies. The write happens once.",
  },
  practice: {
    title: "Stop the self-scored planner without deleting search",
    task:
      "A planner proposes four free-text reroutes, asks the same model to rate them 1–10, has no width or depth cap, and books the top plan inside the search. You must keep a tree, because early commitment is still costly. What do you change?",
    hint:
      "Think about who is allowed to propose, who is allowed to score, when a write may happen, and what happens when every branch is illegal. A common wrong approach is a smarter judge model on the same free text.",
    solution:
      "Constrain propose to ids from an inventory tool. Score with a function on rules, gates, and cost; drop illegal plans before any taste score. Set width, depth, and a token cap. Move book() to after a leaf is chosen, once, with a stable key. If the frontier is empty, halt to a human. Why this works: the tree still searches, but it searches the world. The common wrong approach is a second model vote. Two fluent models still love a closed Saturday.",
  },
  takeaways: [
    "Tree of Thoughts is a search: propose several next thoughts, score them, keep a few, repeat until a budget says stop.",
    "ReAct is a path. ToT is a frontier. Most production jobs want the path.",
    "The scorer is the product. A function on the world beats a model rating its own prose.",
    "Width, depth, and tokens are the budget. Without them the notebook becomes a bill.",
    "Propose from tool ids when you can. Unconstrained paragraphs are how illegal plans sound wise.",
    "Do not write inside the tree. Book once after you pick a leaf. Prune cannot unbook.",
  ],
  mistakes: [
    "Mistake: using a tree because it 'thinks harder'. Why people make it: the paper sounds deep. What actually happens: you pay for breadth you did not need. Better approach: default to a path; tree only when early commit is costly and a check is cheap.",
    "Mistake: scoring with the same model on free text. Why people make it: no function is handy. What actually happens: eloquence wins. Better approach: hard rules first, functions first.",
    "Mistake: no width or depth cap. Why people make it: the notebook was pretty. What actually happens: a 400-dollar indent. Better approach: three numbers, logged.",
    "Mistake: booking while you search. Why people make it: 'finish the job'. What actually happens: pruned branches already moved the world. Better approach: writes after the leaf.",
    "Mistake: unconstrained proposals. Why people make it: the model is creative. What actually happens: a Saturday that does not exist. Better approach: ids from a live tool.",
    "Mistake: picking the least-illegal pretty plan when every branch fails. Why people make it: the tree must return something. What actually happens: the story. Better approach: halt to a human.",
  ],
  interviews: [
    {
      question: "What is Tree of Thoughts, starting from zero? How is it different from ReAct?",
      difficulty: "easy",
      answer:
        "ToT is a search. You propose several next thoughts, score them, keep a few, repeat. ReAct is one path that commits each step. What they want: path versus frontier. Follow-up: which is the default in production? The path, unless early commitment is costly and a cheap check exists.",
    },
    {
      question:
        "A planner billed hundreds of dollars and booked an illegal Saturday train. Walk the post-mortem.",
      difficulty: "medium",
      answer:
        "No budget, a self-scorer, unconstrained prose, and a write inside the search. Fix: ids from inventory, function score on gates, width and depth caps, book once after the leaf. Follow-up: would a better judge model have been enough? No. Two fluent models share the same taste.",
    },
    {
      question: "Design the scorer for a container reroute. What is allowed to be a model call?",
      difficulty: "hard",
      answer:
        "Hard constraints are functions: union calendar, gate hours, inventory existence. Cost is arithmetic. A model may rank remaining legal options on a soft preference, after the functions, and never to override a closed gate. Trade-off: functions are incomplete if a rule is unwritten; then halt, do not guess. Follow-up: where do side effects live? After the chosen leaf, once, with a shipment key.",
    },
  ],
  glossary: [
    {
      term: "Tree of Thoughts",
      meaning:
        "A search that uses a model to propose partial answers, then scores and prunes them. Why it matters: it is breadth, not 'thinking harder'.",
    },
    {
      term: "Branch",
      meaning:
        "Write more than one next idea from a node. Why it matters: this is the cost you pay for alternatives.",
    },
    {
      term: "Score",
      meaning:
        "Assign a value to a partial answer. Why it matters: if this is eloquence, the tree is a contest, not a search.",
    },
    {
      term: "Prune",
      meaning:
        "Throw away weak or illegal branches. Why it matters: honesty here is what keeps Saturday closed.",
    },
    {
      term: "Frontier",
      meaning:
        "The small set of partial answers you are still expanding. Why it matters: width is the size of this set.",
    },
    {
      term: "ReAct path",
      meaning:
        "A single sequence of think-act-observe with no siblings. Why it matters: cheaper, and usually enough.",
    },
  ],
};
