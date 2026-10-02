import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "langgraph-control",
  instructor:
    "I am a senior engineer who has moved agents onto graphs, and sometimes back off them. I teach the picture first: stations, a train, and a log of where the train was.",
  promise:
    "You will go from never having used LangGraph to being able to draw a small graph, keep state without losing data, pause for a person, and say what a graph does not guarantee.",

  story: {
    title: "The approval that vanished at 11:40pm",
    body: [
      "A team built an internal helper that drafted wire-transfer instructions. The flow was easy to draw: understand the request, gather the details, draft the instruction, wait for a person to approve, then submit. They chose a graph library because of that wait. The demo looked perfect.",
      "The first real approval came at 11:40 at night. An operations lead clicked approve on four drafts. Three went through. The fourth showed an error. When she reloaded, that draft was gone — not rejected, not waiting, just missing. Treasury spent the next morning checking by hand, afraid a wire had gone out with no record.",
      "It had not. The 'save my place' feature was the in-memory one from the tutorial. Tests run in one process, so they never saw the problem. The live service had four copies behind a load balancer. Her approve click landed on a different copy. That copy had never seen the draft, so it treated the work as brand new. The three that worked were luck: those clicks happened to hit the same machine.",
      "There was a second, quieter bug. The id that said 'this is the same piece of work' was generated per web request, not from the wire-request number. Even a real database save would have started a fresh run on the second click. And the pause before submit was only a pause. Anyone who knew the id could resume it. The real check — is this person allowed to approve this amount — had to live in the submit step itself.",
    ],
    moral:
      "A graph can save your place and wake up later. It does not, by itself, decide who is allowed to move money.",
  },

  stages: [
    {
      id: "why-a-graph",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "You already know a simple agent can be a while-loop. Ask the model, maybe call a tool, write the result, repeat. That loop lives in one running program. If the program stops, the loop dies. If you need to wait six hours for a person, you cannot leave a while-loop sitting in memory and hope.",
        "That is the problem. Some jobs need a pause. Some need a branch: 'if this is a lookup, go left; if this is a payment, go right.' Some need two lookups at once, then a merge. A while-loop can fake these things, but the control flow lives in the Python call stack. A call stack cannot be saved to a database and resumed tomorrow on a different machine.",
        "Here is a concrete picture. A wire helper must draft an instruction, wait overnight for a human, then submit. The wait is the whole point. If you cannot sleep and come back, you do not have that product.",
        "A graph is a drawing of that job. Boxes are steps. Arrows say what happens next. Shared data rides along from box to box. Once the drawing is saved as data, a program can run one box, write down the data, and stop. Later, another program can load the data and run the next box.",
        "We will use LangGraph as the example library. LangGraph is one way to write that drawing in Python. The idea is older than the library: it is a state machine with a log. If you do not need a pause, a branch that you will replay, or a crash-safe resume, you may not need a graph at all.",
        "At this point you should understand the problem: a loop is fine until you must stop in the middle and continue later. A graph exists to make that stop and continue possible.",
      ],
      diagrams: [
        {
          title: "A line versus a drawing with a pause",
          caption:
            "A while-loop finishes in one sitting. A graph can stop at a station and start again later.",
          chart: chart(
            `flowchart TD
    Ask([User request]) --> Loop[While-loop in one process]
    Loop --> Gone([Process dies, work is gone])
    Ask --> Draft[Draft the action]
    Draft --> Wait[Pause for a person]
    Wait --> Submit[Submit later]
    Submit --> Finish([Done])`,
            `class Ask,Gone,Finish hub
    class Loop grp1
    class Draft,Wait,Submit grp2`
          ),
        },
      ],
    },
    {
      id: "stations-and-train",
      level: "beginner",
      title: "The mental model: stations, a train, and a log",
      body: [
        "Think of a train moving through stations. The train carries bags: the user request, notes so far, a draft, a yes-or-no from a human. Each station may add a bag or replace one. The tracks decide which station is next. A dispatcher writes down the bags at every station so you can ask later where the train was.",
        "That picture maps to the library. The bags are state — one typed object the whole graph shares. Stations are nodes — ordinary functions that receive state and return a small update. Tracks are edges — either 'always go here' or 'ask a function which way'. The dispatcher's log is a checkpointer — a save after each station.",
        "The important inversion: a node does not call the next node. It returns an update and stops. The graph decides what runs next. Because the next step is data, not a Python call, the framework can save, pause, replay, or show you the pending step.",
        "LangGraph's pieces are small. You declare the state shape. You add nodes. You add edges. You compile that description into something you can run. Optionally you attach a checkpointer so each step is saved.",
        "The analogy is not the implementation. There is no physical train. There is an object, functions, and a row in a store. The analogy is only there so the API stops feeling like a foreign language.",
        "Pause and check. If two stations both want to add a message to the same list, and the default rule is 'the last write wins', what happens to the first message? It disappears. That is the next idea: how updates merge.",
      ],
      diagrams: [
        {
          title: "Stations, switches, and the train",
          caption:
            "Nodes return updates and finish. Edges choose the next node. If you cannot draw it, you are not ready to compile it.",
          chart: chart(
            `flowchart TD
    Begin([START]) --> Classify[Classify request]
    Classify --> Route{Lookup or action?}
    Route -->|lookup| Retrieve[Retrieve facts]
    Route -->|action| Draft[Draft action]
    Retrieve --> Answer[Compose answer]
    Draft --> Pause[Pause for approval]
    Pause --> Submit[Submit action]
    Answer --> Finish([END])
    Submit --> Finish
    Log[Checkpointer] -.->|saves state after each node| Classify
    Log -.-> Pause`,
            `class Begin,Finish hub
    class Classify,Retrieve,Draft,Answer,Submit grp1
    class Route,Pause grp2
    class Log grp3`
          ),
        },
      ],
    },
    {
      id: "state-merges",
      level: "beginner",
      title: "How the simplest graph keeps state",
      body: [
        "State is a typed bag of fields: the messages so far, a label like 'refund' or 'lookup', a retry count. Every node receives the whole bag and returns only the fields it wants to change.",
        "The default merge is last write wins for each field. That is correct for a label or a number you meant to replace. It is wrong for a list you meant to grow. If a node returns one new message and you have no special merge rule, the whole conversation becomes that one message. The graph still runs. It just has amnesia.",
        "A reducer is the name for a merge rule on one field. You attach a function that says how to combine the old value with the update. The one you will see everywhere appends messages instead of replacing them. Retrieved documents want append-and-dedupe. A cost counter wants addition.",
        "What are we trying to do? Keep a list of messages across nodes without the second node wiping the first. Here is the smallest version: mark that field with a reducer that adds.",
        "Let's understand what just happened. add_messages is not magic memory. It is a function that concatenates lists. Without it, last-write-wins deletes history. With it, history grows. That is the whole trick.",
        "Keep state small enough to save. Everything in state is written after every node. A 300-page document in state is paid for on every step. Store an id, fetch the body when a node needs it. Also keep state serialisable: no open database connections in the bag. Those cannot be written to Postgres.",
      ],
      codes: [
        {
          title: "A field that appends, not replaces",
          language: "python",
          code: `from typing import Annotated, TypedDict
from langgraph.graph import add_messages

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]  # append
    kind: str                                 # replace
    cost_cents: Annotated[int, lambda old, new: old + new]`,
        },
      ],
    },
    {
      id: "nodes-and-edges",
      level: "intermediate",
      title: "Nodes, edges, and the compile step",
      body: [
        "A node is a function. In goes state. Out goes a partial update. You do not call other nodes from inside it. You do your work and return. That discipline is what makes pause and replay possible.",
        "An edge is the next hop. A fixed edge always goes to the same node. A conditional edge calls a small function that looks at state and returns the name of the next node. That function is the switch in the train picture.",
        "Compile turns your drawing into a runnable object. After compile you can invoke it with an input and, if you attached a checkpointer, a thread id — a name for this piece of work so later calls resume the same train, not a new one.",
        "What are we trying to do? A tiny tool loop with an explicit router and a maximum number of times we may cycle. Here is the smallest version.",
        "Let's understand what just happened. START and the finish node are the two ends of the drawing. The router is not the model. It is your function that reads the last model output and picks 'tool', 'answer', or 'finish'. A recursion limit is a budget: how many times the graph may visit nodes before it refuses to continue. Pick that number on purpose.",
      ],
      codes: [
        {
          title: "A tiny graph with a router",
          language: "python",
          code: `from langgraph.graph import END, START, StateGraph

def route(state):
    last = state["messages"][-1]
    if last.get("final"):
        return "finish"
    if last.get("tool"):
        return "tools"
    return "model"

g = StateGraph(AgentState)
g.add_node("model", call_model)
g.add_node("tools", run_tools)
g.add_edge(START, "model")
g.add_conditional_edges("model", route, {"tools": "tools", "finish": END})
g.add_edge("tools", "model")
app = g.compile()  # add a checkpointer before production`,
        },
      ],
      diagrams: [
        {
          title: "What compile assembles",
          caption:
            "You draw nodes and edges. Compile makes a runner. A checkpointer is optional in the tutorial and required if you pause.",
          chart: chart(
            `flowchart TD
    Draw[Nodes and edges] --> Build[Compile]
    Build --> Run[Runnable graph]
    Saver[Checkpointer] --> Run
    Run --> Step[One node, then save]
    Step --> Next{More nodes?}
    Next -->|yes| Step
    Next -->|no| Finish([Done])`,
            `class Draw,Finish hub
    class Build,Run,Step grp1
    class Saver,Next grp2`
          ),
        },
      ],
    },
    {
      id: "cycles-and-fanout",
      level: "intermediate",
      title: "When the simple line is not enough",
      body: [
        "The simple graph is a line plus one cycle: model, tools, model. Cycles are normal. What is not normal is a cycle with only one exit, controlled by the model. Give the cycle two doors: the model may finish, and your router may send the run to a halt node when a step count in state is too high.",
        "Sometimes you need two lookups at once. The library can fan work out to several nodes in the same step, then merge. Merge only works if the fields they write have reducers. If two nodes write the same field and there is no reducer, the library errors rather than picking a winner. That error is a gift. It is telling you your merge rule is missing.",
        "The design rule: any field two nodes might write must have a reducer whose result does not depend on which update arrives first. Append-and-dedupe by id is safe. A plain append that cares about order is not, unless you sort by a field you control.",
        "Remember this: parallelism is a performance choice, not a safety feature. Two write nodes in the same step are two side effects you must reason about together. Fan out reads. Keep writes on a single path unless you are sure.",
        "Connect this back to ReAct. A graph can implement a ReAct loop as two nodes and a conditional edge. The graph does not replace the loop's stop rules. It gives you a place to put them.",
      ],
      diagrams: [
        {
          title: "Two doors out of a cycle",
          caption:
            "The model may finish. Your counter may halt. A cycle with one door is the refund bot in a new costume.",
          chart: chart(
            `flowchart TD
    Model[Model node] --> Switch{Router}
    Switch -->|tool| Tools[Tool node]
    Tools --> Model
    Switch -->|answer| Finish([END])
    Switch -->|too many steps| Halt([Halt node])
    Halt --> Finish`,
            `class Model,Tools grp1
    class Switch grp2
    class Finish,Halt hub`
          ),
        },
      ],
    },
    {
      id: "threads-and-pauses",
      level: "intermediate",
      title: "How pause and resume work in a real app",
      body: [
        "A thread id is a name for one piece of business work. It should come from something that already exists: a wire-request id, a ticket id. If you mint a random id per HTTP request, the approve click is a different piece of work from the draft. That is the second bug in the story.",
        "A checkpointer writes state after each node to a store you choose. The tutorial store lives in memory. That is fine for a notebook. It is not fine for four replicas. If the approve request hits a different machine, the memory on that machine is empty. Use a real store — Postgres is the common choice — so every replica reads the same save.",
        "An interrupt is a planned pause. You mark a node: stop before (or after) this work and wait. The graph saves state and returns control to your server. You do not hold a web request open for six hours. The human sees a draft. Later, your server resumes the same thread id with their decision.",
        "Resume is not authorisation. Anyone who can post the thread id and a resume command can continue the graph. The submit node must check, again, who this person is and whether this amount is allowed. The graph has no idea who is talking to it.",
        "At this point you should understand the production shape: one thread id per business object, a durable checkpointer, an interrupt at the risky step, and a second check inside the acting node.",
      ],
      diagrams: [
        {
          title: "One thread, many machines",
          caption:
            "If the save lives in one process, the next click can land on a machine that has never seen the work.",
          chart: chart(
            `flowchart TD
    Draft([Draft request]) --> PodA[Replica A saves in memory]
    Approve([Approve click]) --> Balancer[Load balancer]
    Balancer -->|lucky| PodA
    Balancer -->|unlucky| PodB[Replica B has no save]
    PodB --> Missing([Looks like a new thread])
    Shared[(Postgres checkpointer)] --> PodA
    Shared --> PodB`,
            `class Draft,Approve,Missing hub
    class PodA,PodB grp1
    class Balancer grp2
    class Shared grp3`
          ),
        },
      ],
    },
    {
      id: "not-policy",
      level: "advanced",
      title: "What a graph is not",
      body: [
        "The simple version feels like safety because you can draw a pause box. That is the trap. A pause is a workflow feature. Policy is a different layer: identity, roles, amounts, tenants. LangGraph will run whatever resume you send it, if the thread exists.",
        "Put policy in the acting node, or in a gateway in front of the tool. Re-read the identity token. Re-read the amount from state. Do not trust a boolean that was set six hours ago by a different request. Things change overnight: the user is fired, the limit is lowered, the counterparty is flagged.",
        "The graph is also not your product analytics, your eval suite, or your prompt. It is a control plane: it decides which function runs and it can save between functions. Teams that treat 'we used LangGraph' as a safety claim ship the incident in the story.",
        "Trade-off: a graph adds serialisation, a schema for state, and operational work for the checkpointer. That cost is worth it when you need pause, replay, or branching you will operate for months. It is not worth it for A then B then C in one request.",
        "Imagine the process crashes here, between draft and submit. What should happen? The checkpointer should have the draft. On restart, resume the thread. The submit node should still verify approval. If you cannot say those sentences, the graph is decoration.",
      ],
      diagrams: [
        {
          title: "Where the graph sits",
          caption:
            "The graph routes work. Identity, tools, and stores sit around it. None of those jobs move into the drawing.",
          chart: chart(
            `flowchart TD
    User([User or approver]) --> Api[Your API]
    Api --> Ident[Identity check]
    Ident --> Graph[LangGraph runner]
    Graph --> Tools[Tool gateway]
    Graph --> Save[(Checkpointer)]
    Tools --> World[(Billing, email, wires)]`,
            `class User,World hub
    class Api,Graph grp1
    class Ident,Tools grp2
    class Save grp3`
          ),
        },
      ],
    },
    {
      id: "operate-or-delete",
      level: "advanced",
      title: "Operating a graph, and when to delete it",
      body: [
        "Once you have a durable log, you can replay. Replay means: load a past save and run forward again. That is wonderful for debugging a classify node. It is dangerous if replay re-submits a wire. Guard side-effecting nodes: if this step already succeeded in the log, skip it. Idempotency keys are the same idea you met in the ReAct lesson.",
        "Time travel — forking a thread from an old save — is a support tool, not a feature you expose to every user. Version your state schema. A field you add next month must have a default so old saves still load.",
        "Subgraphs are graphs you nest when a chunk of the drawing is its own product: its own evals, its own team. Do not nest for decoration. Each boundary is a place state must be translated and a place a timeout can hide.",
        "When should you not use this? If the flow is a straight line with no pause, a function that calls three functions is clearer. If the flow is a short tool loop that always finishes in one request, a while-loop with a step budget is less code. I have replaced a large graph with a short function when the pause requirement was cancelled and nobody removed the machinery.",
        "The person who can teach this now says: a graph is a saved drawing of control flow. Reducers keep lists alive. Thread ids name business work. Checkpointers must be shared. Interrupts pause; they do not authorise. Delete the graph when the drawing is a straight line.",
      ],
      codes: [
        {
          title: "Name the work from the business, not the request",
          language: "python",
          code: `def thread_id(wire_request_id: str) -> str:
    return f"wire:{wire_request_id}"

app.invoke(draft, config={"configurable": {"thread_id": thread_id("WR-7781")}})
# later, any replica:
app.invoke(None, config={"configurable": {"thread_id": thread_id("WR-7781")}})`,
        },
        {
          title: "Skip a write that already succeeded",
          language: "python",
          code: `def submit(state, *, caller):
    if state.get("confirmation_id"):
        return {}  # already sent; replay must not wire again
    if not caller.can_approve(state["amount_cents"]):
        return {"halted": "not_authorised"}
    cid = wires.send(state["draft"], idempotency_key=state["request_id"])
    return {"confirmation_id": cid}`,
        },
      ],
    },
  ],

  workedExample: {
    title: "Wire request WR-7781, paused overnight, resumed on another machine",
    setup:
      "An 18,000 dollar wire to a new counterparty is drafted at 16:00. Approval arrives at 00:10 from a phone. The service has three replicas. You must not lose the draft, and you must not submit without a real authorisation check.",
    walkthrough: [
      "Step 1 — Understand the problem. A while-loop cannot sleep for eight hours across a deploy. You need a pause that survives process death.",
      "Step 2 — Identify the relevant concept. A graph with durable checkpoints, a thread id from WR-7781, and an interrupt before submit.",
      "Step 3 — Build the simplest solution. Nodes: classify, draft, interrupt, submit. State holds the draft and the request id. Compile with a memory saver so you can see the path in one process.",
      "Step 4 — Improve it. Swap the memory saver for Postgres. Set thread_id to wr-7781, not a random uuid. After each node the draft is in the shared store.",
      "Step 5 — Handle a failure. The approve click hits replica B. B loads wr-7781 from Postgres and resumes. The submit node checks the approver's role and the amount again. If the token is missing, it does not submit.",
      "Step 6 — Production version. Side-effect guard: if submit already wrote a confirmation id into state, skip. Schema version on the checkpoint. An alert if interrupts sit more than 24 hours.",
    ],
    result:
      "The draft is still there at midnight on any replica. The wire goes out once, after a fresh authorisation check. A missing draft is no longer possible because of a tutorial saver.",
  },

  practice: {
    title: "Survive a deploy mid-approval",
    task:
      "A graph drafts a blog post, interrupts for an editor, then publishes. During the wait you deploy a new version and the old process dies. Problem: list the exact pieces that must exist so the editor's click still publishes the same draft, not a blank post. Think about: where state lives, how you name the work, and what publish must check.",
    hint:
      "MemorySaver will lose the draft. A random thread id per page load will start a new graph. Publish must not trust the interrupt alone. Expected reasoning: durable checkpointer, stable thread id from the post id, re-check the editor's permission in the publish node.",
    solution:
      "Use a Postgres checkpointer. thread_id = post_id. Interrupt before publish. On resume, the publish node verifies the editor is still allowed and the draft text still matches what they saw. Why this works: the train's bags survive the deploy, and the last station does not trust a six-hour-old yes. Common wrong approach: session affinity to 'the same pod' instead of a shared store — the next deploy still kills the pod.",
  },

  takeaways: [
    "A while-loop dies when the process dies. A graph can save state after each step and continue later.",
    "Nodes return updates and stop. Edges decide what runs next. That inversion is what makes pause and replay possible.",
    "Without a reducer, a list field is last-write-wins and the graph quietly forgets earlier messages.",
    "A thread id should come from a business id. A random id per request makes approve a different piece of work from draft.",
    "The tutorial in-memory saver is not a production checkpointer. Shared machines need a shared store.",
    "An interrupt is a pause, not a permission check. The acting node must verify identity and limits again.",
  ],

  mistakes: [
    "Mistake: ship MemorySaver. Why people make it: the tutorial works. What actually happens: another replica has no state and the approval vanishes. Better approach: a database checkpointer every replica can read.",
    "Mistake: new thread id on every HTTP request. Why people make it: it is the default in a handler. What actually happens: resume cannot find the draft. Better approach: derive the id from the ticket or request number.",
    "Mistake: no reducer on a messages list. Why people make it: last-write-wins looks fine for one node. What actually happens: the second node wipes history. Better approach: annotate accumulating fields with a merge function.",
    "Mistake: treat interrupt as authorisation. Why people make it: the drawing has a box that says approve. What actually happens: anyone who can resume the thread can submit. Better approach: check identity inside the acting node.",
    "Mistake: put huge documents in state. Why people make it: convenient. What actually happens: every checkpoint writes the novel again. Better approach: store an id, fetch the body when needed.",
    "Mistake: use a graph for a straight line with no pause. Why people make it: the team wants the modern stack. What actually happens: extra machinery, slower debugging. Better approach: a function, until you have a real reason.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "Why would you use a graph instead of a while-loop?",
      answer:
        "What they are testing: the problem, not the brand. Good answer: when you must pause, resume after a crash, or branch in a way you will save and replay. A loop's call stack cannot be written to a database. Why that is good: it starts from the problem. Follow-up: when would you stay with a loop?",
    },
    {
      difficulty: "medium",
      question: "An approver clicks resume and the draft is gone. What do you inspect first?",
      answer:
        "What they are testing: checkpointer and thread id. Good answer: is the saver in-memory, and is thread_id stable across draft and approve? Those two bugs explain almost every vanishing pause. Why that is good: it is operational, not theoretical. Follow-up: why must submit still check the user?",
    },
    {
      difficulty: "hard",
      question: "Does a pause-before-submit node make your wire system safe?",
      answer:
        "What they are testing: graph versus policy. Good answer: no. The graph will resume for anyone who can call it. Safety is identity, amount limits, and idempotency in the submit path. The pause is for humans to look, not for enforcement. Why that is good: it separates control flow from authorisation. Follow-up: where would you put a limit that changed overnight?",
    },
  ],

  glossary: [
    {
      term: "State",
      meaning:
        "The shared bag of fields that travels from node to node. Why it matters: it is the only data the next node sees unless it fetches more.",
    },
    {
      term: "Node",
      meaning:
        "A function that reads state and returns a partial update. Why it matters: nodes do not call each other, so the graph can stop between them.",
    },
    {
      term: "Edge",
      meaning:
        "The rule for what runs next — always the same node, or a choice based on state. Why it matters: this is the track in the train picture.",
    },
    {
      term: "Reducer",
      meaning:
        "A merge function for one field, such as append instead of replace. Why it matters: without it, lists quietly lose earlier writes.",
    },
    {
      term: "Checkpointer",
      meaning:
        "The save after each node so a run can pause or survive a crash. Why it matters: an in-memory save is invisible to the next machine.",
    },
    {
      term: "Interrupt",
      meaning:
        "A planned pause at a node until your code resumes the same thread. Why it matters: it is how a human can approve hours later — and it is not a permission system.",
    },
  ],
};
