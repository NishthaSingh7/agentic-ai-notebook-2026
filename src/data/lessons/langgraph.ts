import { createLesson, type LessonInput } from "./builder";
import { pastelChart } from "@/lib/mermaid-pastel";

function b(...lines: string[]) {
  return lines.map((l) => `- ${l}`).join("\n");
}

function visual(input: LessonInput) {
  return createLesson({
    ...input,
    visualFirst: true,
    practiceTask: "",
    code: undefined,
    codeLanguage: undefined,
  });
}

function stack(hub: string, left: string, right: string) {
  return pastelChart(
    `flowchart LR
    Hub([${hub}])
    L["${left}"]
    R["${right}"]
    Hub --> L
    Hub --> R`,
    `class Hub hub
    class L grp1
    class R grp2`
  );
}

export const langgraphLessons: Record<string, ReturnType<typeof createLesson>> = {
  langgraph: visual({
    concept: b(
      "LangGraph is the orchestration runtime: you draw the control flow as a graph, then the runtime walks it with durable state",
      "A chain is a straight line. An agent loop is a while-loop you cannot pause. A graph is both — branches, cycles, and a place to stop",
      "LangChain gives models and tools. LangGraph gives nodes, edges, checkpoints, interrupts, and streaming",
      "Deep Agents is a harness built on LangGraph, not LangGraph itself — skip it until this chapter is yours"
    ),
    whyItExists:
      "Production agents need more than a prompt loop. They branch, wait for a human, survive a crash, and resume the same ticket tomorrow. LangGraph exists to make that control flow explicit.",
    analogy:
      "A subway map, not a taxi. The lines (edges) are fixed. Stations (nodes) do work. The train (state) carries passengers from station to station — and can wait on a siding.",
    analogyDiagram: stack("LangGraph", "Graph = control flow", "State = the train"),
    diagram: pastelChart(
      `flowchart TD
    User([User]) --> Graph
    Graph --> N1[Node does work]
    N1 --> E{Edge decides next}
    E -->|fixed| N2[Next node]
    E -->|condition| N3[Other node]
    N2 --> State[(Shared state)]
    N3 --> State
    State --> Graph`,
      `class User,Graph hub
    class N1,N2,N3 grp1
    class E grp2
    class State grp3`
    ),
    workflowDiagrams: [
      {
        title: "Chain vs loop vs graph",
        caption: "Pick a graph when you need branches, cycles, or a pause. Not for a one-shot prompt.",
        chart: pastelChart(
          `flowchart LR
    subgraph Chain["Chain"]
        C1[A] --> C2[B] --> C3[C]
    end
    subgraph Loop["Agent loop"]
        L1[Think] --> L2[Act] --> L1
    end
    subgraph GraphView["LangGraph"]
        G1[Node] --> G2{Route}
        G2 -->|tool| G1
        G2 -->|wait| G3[Human]
        G2 -->|done| G4[Finish]
    end`,
          `class C1,C2,C3 grp1
    class L1,L2 grp2
    class G1,G2,G3,G4 grp3`
        ),
      },
      {
        title: "Where LangGraph sits",
        caption: "You still use an LLM and tools. LangGraph is the runtime that owns the steps between them.",
        chart: pastelChart(
          `flowchart TD
    App([Your app]) --> LG[LangGraph runtime]
    LG --> Model[LLM]
    LG --> Tools
    LG --> Saver[Checkpointer]
    LG --> Human[Interrupt]`,
          `class App,LG hub
    class Model,Tools grp1
    class Saver,Human grp2`
        ),
      },
    ],
    technicalExplanation:
      "LangGraph compiles a StateGraph into a runnable. Each super-step runs one or more nodes, then writes a checkpoint if a checkpointer is attached. You invoke with a thread_id so the same conversation can resume. The Functional API exists; this course uses the Graph API because you can draw it.",
    example:
      "A support bot: classify the ticket, maybe call a billing tool, pause before a refund, then reply. A while-loop cannot pause overnight. A graph with a checkpointer can.",
    exampleSolution:
      "Draw the stations first: classify → assistant → tools → refund gate → reply. Only then install packages. The last module is that drawing as a running file.",
    commandsToRemember: [
      "pip install -U langgraph langchain-openai langchain-core",
      "python3 --version  # 3.10+",
      "LangGraph = runtime, LangChain = models and tools",
      "Draw the graph before you write a node",
    ],
    commonMistakes: [
      "Treating LangGraph as 'LangChain with extra steps' — it is the control plane",
      "Starting from Deep Agents or Platform before you can draw nodes and state",
      "Building a 20-node graph on day one instead of START → one node → Finish",
    ],
    revisionNotes: {
      cheatSheet: ["Graph = flow", "State = memory of the run", "LangChain ≠ LangGraph", "Draw first"],
    },
    glossary: ["LangGraph", "StateGraph", "super-step", "Graph API", "thread"],
    learnElsewhere: ["Deep Agents harness — not this phase", "LangChain models — Phase 2", "Tool calling — Phase 7"],
    furtherReading: [
      { title: "LangGraph overview", url: "https://docs.langchain.com/oss/python/langgraph/overview" },
      { title: "langchain-ai/langgraph", url: "https://github.com/langchain-ai/langgraph" },
    ],
  }),

  "langgraph-nodes-edges": visual({
    concept: b(
      "A node is a function: it reads the current state, does one job, and returns a partial update",
      "An edge is the next step: a fixed edge always goes A to B; a missing edge is a dead end",
      "START is the entry arrow. Finish is the exit. You never write a node named start — you point START at the first real node",
      "One node, one job. Classify is not also refund. Mixing jobs makes routing impossible later"
    ),
    whyItExists:
      "If work is a blob of Python, you cannot pause in the middle, retry one step, or stream 'the tool just ran'. Nodes are the units the runtime can see.",
    analogy:
      "Kitchen stations: prep, grill, plate. Food (state) moves on tickets. The pass (edges) says where a ticket goes next — not the chef yelling across the room.",
    analogyDiagram: stack("Graph primitives", "Node = station", "Edge = the pass"),
    diagram: pastelChart(
      `flowchart TD
    Start([START]) --> Classify[Node: classify]
    Classify --> Assist[Node: assistant]
    Assist --> Finish([Finish])`,
      `class Start,Finish hub
    class Classify,Assist grp1`
    ),
    workflowDiagrams: [
      {
        title: "What a node returns",
        caption: "Return only the fields you changed. The runtime merges them into shared state.",
        chart: pastelChart(
          `flowchart LR
    In[State in] --> Node
    Node --> Out["Partial update"]
    Out --> Merge[Runtime merges]
    Merge --> Next[Next node sees full state]`,
          `class In,Next grp1
    class Node hub
    class Out,Merge grp2`
        ),
      },
      {
        title: "Fixed edge vs no edge",
        caption: "A fixed edge is a promise: after A, always B. If you forget the edge, the run stops after A.",
        chart: pastelChart(
          `flowchart TD
    A[Node A] -->|add_edge| B[Node B]
    C[Node C] -.->|missing edge| X[Run dies here]`,
          `class A,B grp1
    class C,X grp2`
        ),
      },
    ],
    technicalExplanation:
      "add_node(name, fn) registers the station. add_edge(a, b) is a fixed transition. START and the graph end are sentinels, not your functions. Nodes should be idempotent-ish: if a checkpoint retries the node, side effects may run again — keep them small.",
    example:
      "Ticket comes in. classify writes ticket_type. assistant writes a reply. Two nodes, one edge between them. Tomorrow you insert a tools node without rewriting classify.",
    exampleSolution:
      "Name nodes after verbs you can say out loud: classify, search, refund_gate, reply. If you cannot say the job in one word, split the node.",
    commandsToRemember: [
      "add_node(name, function)  # one job per name",
      "add_edge(A, B)  # always A then B",
      "START points at the first node",
      "Return a dict of changed fields only",
    ],
    commonMistakes: [
      "Putting the whole agent inside one node — then you cannot route, pause, or retry a step",
      "Forgetting the edge from the last node to Finish, so invoke hangs or returns half-state",
      "Mutating a global variable instead of returning a state update",
    ],
    revisionNotes: {
      cheatSheet: ["Node = function", "Edge = next step", "START / Finish", "Partial updates"],
    },
    glossary: ["node", "edge", "START", "partial update"],
    learnElsewhere: ["StateGraph — next module", "Conditional Routing"],
  }),

  "langgraph-stategraph": visual({
    concept: b(
      "StateGraph is the canvas: you declare the shape of state, then hang nodes and edges on it",
      "State is a TypedDict or Pydantic model every node shares — messages, ticket_type, step count",
      "A reducer (Annotated + add_messages) says how to merge: append messages, do not overwrite the whole list",
      "compile() freezes the drawing into a runnable. After compile you invoke, you do not add more nodes"
    ),
    whyItExists:
      "Without a typed shared state, each node invents its own dict and the next node guesses keys. StateGraph makes the contract one schema.",
    analogy:
      "A shared whiteboard the whole team writes on. Reducers are the rules: 'append to the message list, never erase history unless told'.",
    analogyDiagram: stack("StateGraph", "Schema = columns", "Reducer = merge rule"),
    diagram: pastelChart(
      `flowchart TD
    Schema[State schema] --> Graph[StateGraph]
    Graph --> Nodes[add_node]
    Graph --> Edges[add_edge]
    Nodes --> Comp[compile]
    Edges --> Comp
    Comp --> Run([invoke / stream])`,
      `class Schema,Graph hub
    class Nodes,Edges grp1
    class Comp,Run grp2`
    ),
    workflowDiagrams: [
      {
        title: "What lives in state",
        caption: "Short-term working memory for this thread. Not your SQL database. Not a secret key.",
        chart: pastelChart(
          `flowchart LR
    subgraph State["Agent state"]
        M[messages + reducer]
        T[ticket_type]
        S[step]
    end
    Classify --> T
    Assist --> M`,
          `class M,T,S grp1
    class Classify,Assist grp2`
        ),
      },
      {
        title: "Overwrite vs append",
        caption: "Plain fields replace. messages with add_messages append. Pick the reducer on purpose.",
        chart: pastelChart(
          `flowchart TD
    Old["messages = [hi]"] --> Node
    Node --> Bad[Overwrite would drop hi]
    Node --> Good[Reducer appends the reply]`,
          `class Old hub
    class Bad grp2
    class Good grp4`
        ),
      },
    ],
    technicalExplanation:
      "StateGraph(State) types every update. Channels are state keys. Reducers define merge at each super-step. compile(checkpointer=...) is how persistence attaches — next modules. Until then, compile() with no checkpointer is a stateless run: every invoke starts blank.",
    example:
      "State has messages and ticket_type. classify returns {ticket_type: 'billing'}. assistant returns {messages: [ai_reply]}. The reducer keeps both user and AI messages.",
    exampleSolution:
      "List the keys on paper first: what must survive from node to node? Those keys are the schema. Extra junk in state is how prompts bloat.",
    commandsToRemember: [
      "StateGraph(State)  # schema first",
      "Annotated[list, add_messages]  # append, do not replace",
      "graph.compile()  # freeze before invoke",
      "Keep secrets out of state",
    ],
    commonMistakes: [
      "No reducer on messages, so each node wipes the chat history",
      "Stuffing the database, the user object, and the API key into state",
      "Adding nodes after compile — that object is already frozen",
    ],
    revisionNotes: {
      cheatSheet: ["Schema first", "Reducers merge", "compile then invoke", "State is not the DB"],
    },
    glossary: ["StateGraph", "reducer", "add_messages", "compile", "channel"],
    learnElsewhere: ["Checkpoints — persistence of this state", "Nodes & Edges"],
  }),

  "langgraph-conditional-routing": visual({
    concept: b(
      "A conditional edge is a function that reads state and returns the name of the next node",
      "This is how graphs loop: assistant → tools → assistant until the model stops calling tools",
      "Command can update state and choose the next node in one return — use it when the node already knows the destination",
      "Send fans one state out to many workers (map-reduce). Do not fake fan-out with a for-loop inside a node"
    ),
    whyItExists:
      "Fixed edges cannot say 'if billing, go to refund; if done, finish'. Conditional routing is the if/else of the graph — visible, testable, and checkpointed between hops.",
    analogy:
      "A station switch: the dispatcher reads the ticket color and throws the track. The train does not decide the map.",
    analogyDiagram: stack("Routing", "Fixed edge = always", "Conditional = switch"),
    diagram: pastelChart(
      `flowchart TD
    Assist[assistant] --> Route{route}
    Route -->|tools| Tools[tools]
    Route -->|refund| Gate[refund_gate]
    Route -->|done| Finish([Finish])
    Tools --> Assist`,
      `class Assist hub
    class Route grp2
    class Tools,Gate grp1
    class Finish grp4`
    ),
    workflowDiagrams: [
      {
        title: "The agent loop as a graph",
        caption: "This is ReAct, drawn. The loop is an edge back, not a Python while True you cannot pause.",
        chart: pastelChart(
          `flowchart LR
    Model[assistant] -->|tool calls| Tools
    Tools --> Model
    Model -->|no tools| Finish([Finish])`,
          `class Model hub
    class Tools grp1
    class Finish grp4`
        ),
      },
      {
        title: "Fan-out with Send",
        caption: "One planner, many parallel workers, then join. Each worker is a node run with its own payload.",
        chart: pastelChart(
          `flowchart TD
    Plan[planner] --> S[Send to workers]
    S --> W1[worker]
    S --> W2[worker]
    S --> W3[worker]
    W1 --> Join[join]
    W2 --> Join
    W3 --> Join`,
          `class Plan,S hub
    class W1,W2,W3 grp1
    class Join grp3`
        ),
      },
    ],
    technicalExplanation:
      "add_conditional_edges(source, path_fn, path_map) maps return values to node names. path_fn must be deterministic from state. Always give a max-step or 'done' path so the loop cannot run forever. tools_condition is the prebuilt path_fn from an assistant that may emit tool calls.",
    example:
      "After classify, ticket_type is billing or tech. path_fn returns 'billing' or 'tech'. Those strings must match node names in the path map.",
    exampleSolution:
      "Write the route function so it only returns known labels. Unknown label = bug, not a silent Finish. Cap loops with a step counter in state.",
    commandsToRemember: [
      "add_conditional_edges(node, path_fn, path_map)",
      "path_fn reads state, returns a node name",
      "Always include a done path",
      "Send = fan-out, not a for-loop inside a node",
    ],
    commonMistakes: [
      "Returning a node name that does not exist in the path map",
      "An agent loop with no max steps or done condition",
      "Hiding branching inside one giant node so you cannot checkpoint between cases",
    ],
    revisionNotes: {
      cheatSheet: ["path_fn → node name", "Loops are edges back", "Done path required", "Send for parallel"],
    },
    glossary: ["conditional edge", "path map", "Command", "Send", "tools_condition"],
    learnElsewhere: ["Tools in the Graph — next", "Human-in-the-Loop"],
  }),

  "langgraph-tools": visual({
    concept: b(
      "A tool is a typed function the model may call. ToolNode is the prebuilt node that actually runs those functions",
      "The assistant node binds tools to the LLM. It does not execute them. Execution is a different station",
      "tools_condition looks at the last AI message: tool calls → ToolNode, otherwise Finish",
      "Give each tool a tight schema. A tool named do_anything is how agents wander"
    ),
    whyItExists:
      "If the model both 'decides' and 'executes' inside one node, you cannot interrupt before a refund or retry a failed HTTP call. Split think and act.",
    analogy:
      "A doctor writes a prescription (assistant). The pharmacy fills it (ToolNode). They are not the same room — and you can stop the prescription before it is filled.",
    analogyDiagram: stack("Tools in the graph", "Assistant = decide", "ToolNode = do"),
    diagram: pastelChart(
      `flowchart TD
    User([User]) --> Assist[assistant + bound tools]
    Assist --> Cond{tools_condition}
    Cond -->|tool calls| TN[ToolNode]
    TN --> Assist
    Cond -->|text reply| Finish([Finish])`,
      `class User,Assist hub
    class Cond grp2
    class TN grp1
    class Finish grp4`
    ),
    workflowDiagrams: [
      {
        title: "One tool call, one observation",
        caption: "ToolNode writes tool messages into state. The assistant sees them on the next turn.",
        chart: pastelChart(
          `flowchart LR
    AI[AI tool_call] --> TN[ToolNode]
    TN --> Obs[tool message]
    Obs --> AI2[assistant again]`,
          `class AI,AI2 hub
    class TN,Obs grp1`
        ),
      },
      {
        title: "Which tools belong here",
        caption: "Lookup and refund are tools. 'Be helpful' is not a tool. Prompt text is not a tool.",
        chart: pastelChart(
          `flowchart TD
    Good[lookup_order] --> TN[ToolNode]
    Good2[create_refund] --> TN
    Bad[giant do_everything] -.-> X[Do not bind]`,
          `class Good,Good2,TN grp4
    class Bad,X grp2`
        ),
      },
    ],
    technicalExplanation:
      "Bind tools on the chat model, then add_node('tools', ToolNode(tools)). Route with tools_condition. Tool args should be validated (Pydantic). Side-effect tools (email, refund) belong behind a human gate in the next modules — not free-fire from ToolNode.",
    example:
      "User: 'Refund order 4411.' Assistant emits create_refund(order_id=4411). ToolNode would hit finance — unless you insert an interrupt before that tool. That interrupt is the next chapter's cousin (HITL).",
    exampleSolution:
      "Start with one read-only tool (lookup_order). Add write tools only after checkpoints and interrupts exist in your head.",
    commandsToRemember: [
      "ToolNode(tools)  # execute, do not decide",
      "model.bind_tools(tools)  # assistant may request calls",
      "tools_condition  # tool calls vs Finish",
      "Read-only tools first, write tools behind a gate",
    ],
    commonMistakes: [
      "Executing tools inside the assistant node so you cannot pause before a side effect",
      "One mega-tool instead of lookup vs refund",
      "No schema on arguments, so the model passes garbage",
    ],
    revisionNotes: {
      cheatSheet: ["Bind on the model", "Execute in ToolNode", "Route with tools_condition", "Gate writes"],
    },
    glossary: ["ToolNode", "bind_tools", "tools_condition", "tool message"],
    learnElsewhere: ["Tool Calling — Phase 7", "Human-in-the-Loop"],
  }),

  "langgraph-checkpoints": visual({
    concept: b(
      "A checkpointer snapshots state after each super-step so the same thread can resume later",
      "thread_id is the name of that story. Same id = same ticket. New id = a blank run",
      "Durable execution is not a second feature — it is this: crash, restart, invoke the same thread, continue",
      "MemorySaver is for local learning. PostgresSaver (or similar) is for production. Pick one at compile time"
    ),
    whyItExists:
      "Without a snapshot, a refund that paused overnight is gone. Checkpoints are how graphs survive deploys, crashes, and humans who come back tomorrow.",
    analogy:
      "A save file in a game. You do not replay the whole dungeon. You load the last checkpoint and keep going.",
    analogyDiagram: stack("Persistence", "thread_id = save slot", "Checkpoint = save file"),
    diagram: pastelChart(
      `flowchart TD
    Invoke[invoke with thread_id] --> Step[Node runs]
    Step --> Snap[(Checkpoint)]
    Snap --> Step2[Next node]
    Crash([Process dies]) --> Snap
    Snap --> Resume[invoke same thread_id]`,
      `class Invoke,Resume hub
    class Step,Step2 grp1
    class Snap grp3
    class Crash grp2`
    ),
    workflowDiagrams: [
      {
        title: "Short-term vs long-term",
        caption: "Checkpointer = this thread's working memory. Store = facts across threads (user prefs). Different tools.",
        chart: pastelChart(
          `flowchart LR
    Thread[This ticket] --> CP[Checkpointer]
    User[This user forever] --> Store[Store / memory]`,
          `class Thread,CP grp1
    class User,Store grp3`
        ),
      },
      {
        title: "Why nodes should be safe to retry",
        caption: "Resume re-runs the node that was in flight. Side effects before the pause can fire twice — make them idempotent.",
        chart: pastelChart(
          `flowchart TD
    N[Node starts] --> FX[HTTP refund]
    FX --> Pause[Crash / interrupt]
    Pause --> N`,
          `class N hub
    class FX grp2
    class Pause grp3`
        ),
      },
    ],
    technicalExplanation:
      "compile(checkpointer=MemorySaver()) then config={'configurable': {'thread_id': 'ticket-4411'}}. Every invoke/stream with that config loads the latest checkpoint first. Durable execution in the docs is this mechanism plus retries. Time travel (later) reads the checkpoint history. HITL (next) requires a checkpointer or the pause has nowhere to sit.",
    example:
      "Server dies after classify, before the assistant. Restart. Same thread_id. Graph loads ticket_type and continues at assistant. The user does not start over.",
    exampleSolution:
      "One thread_id per conversation or ticket. Never reuse a thread for a different customer. In production, put checkpoints in Postgres, not process memory.",
    commandsToRemember: [
      "compile(checkpointer=MemorySaver())  # local",
      "pip install langgraph-checkpoint-postgres  # production",
      "config = {configurable: {thread_id: '...'}}",
      "Same thread_id resumes, new thread_id starts blank",
    ],
    commonMistakes: [
      "Invoking without thread_id while a checkpointer is attached — or the opposite, expecting resume with no checkpointer",
      "MemorySaver in production (RAM dies with the process)",
      "Non-idempotent refunds inside a node that can be retried",
    ],
    revisionNotes: {
      cheatSheet: ["Checkpointer saves", "thread_id is the slot", "Durable = resume", "Postgres in prod"],
    },
    glossary: ["checkpointer", "thread_id", "durable execution", "MemorySaver", "Store"],
    learnElsewhere: ["Time Travel & Replay", "Human-in-the-Loop"],
  }),

  "langgraph-human-in-the-loop": visual({
    concept: b(
      "interrupt() pauses the graph inside a node and waits for a human value",
      "You resume with Command(resume=value) on the same thread_id — that value becomes what interrupt() returns",
      "Use it before irreversible acts: refunds, emails, deletions, anything you cannot cheaply undo",
      "A checkpointer is required. A pause with nowhere to save is just a crash"
    ),
    whyItExists:
      "Some steps must not be autonomous. HITL is not a UI library — it is a first-class pause in the runtime so the graph can wait days.",
    analogy:
      "A manager sign-off stamp on a purchase order. Work stops at the stamp. When the manager signs, the same order continues — it does not start a new order.",
    analogyDiagram: stack("HITL", "interrupt = stamp", "resume = signed"),
    diagram: pastelChart(
      `flowchart TD
    Assist[assistant] --> Gate[refund_gate]
    Gate --> Int[interrupt]
    Int --> Wait[(Checkpoint waiting)]
    Human([Human approves]) --> Resume[Command resume]
    Resume --> Wait
    Wait --> Pay[create_refund]
    Pay --> Reply[reply]`,
      `class Assist,Gate hub
    class Int,Wait grp3
    class Human,Resume grp2
    class Pay,Reply grp4`
    ),
    workflowDiagrams: [
      {
        title: "What to interrupt",
        caption: "Interrupt writes and money. Do not interrupt every token — that is streaming, not HITL.",
        chart: pastelChart(
          `flowchart LR
    Read[lookup_order] --> Auto[No interrupt]
    Write[create_refund] --> Gate[interrupt first]`,
          `class Read,Auto grp4
    class Write,Gate grp2`
        ),
      },
      {
        title: "Approve, edit, or reject",
        caption: "resume can be a boolean, edited state, or a reject that routes to Finish.",
        chart: pastelChart(
          `flowchart TD
    Wait[Paused] --> A{Human}
    A -->|approve| Go[Continue]
    A -->|edit state| Fix[update then continue]
    A -->|reject| Stop([Finish])`,
          `class Wait,A hub
    class Go,Fix grp4
    class Stop grp2`
        ),
      },
    ],
    technicalExplanation:
      "Call interrupt(payload) inside the gate node. The payload is what your UI shows. Resume with the same config thread_id and Command(resume=...). After resume, the node re-runs with determinism rules — keep the interrupt at a stable place in the function. Static breakpoints exist too; interrupt() is the one you will actually ship.",
    example:
      "Refund $480. Graph pauses with {amount: 480, order: 4411}. Agent shows a card. You click approve. Command(resume=True). create_refund runs once.",
    exampleSolution:
      "Put interrupt in its own node (refund_gate), not buried in ToolNode. Show the payload in your UI. Never auto-resume in production for money.",
    commandsToRemember: [
      "interrupt(payload)  # pause this thread",
      "Command(resume=value)  # same thread_id",
      "Checkpointer is mandatory for HITL",
      "Gate money and email, not every token",
    ],
    commonMistakes: [
      "Calling interrupt without a checkpointer",
      "Resuming on a new thread_id, which starts a blank graph",
      "Interrupting inside a messy node so resume re-sends the email twice",
    ],
    revisionNotes: {
      cheatSheet: ["interrupt pauses", "Command resumes", "Same thread_id", "Gate side effects"],
    },
    glossary: ["interrupt", "Command", "HITL", "breakpoint"],
    learnElsewhere: ["AG-UI — Phase 22", "Checkpoints"],
  }),

  "langgraph-streaming": visual({
    concept: b(
      "stream / astream emits the graph as it runs so the UI is not a blank spinner",
      "Mode values: the full state after a step. Mode updates: only what that node changed. Mode messages: tokens and tool messages",
      "Custom mode is for your own progress events (Searching tickets...). Debug mode is for you, not for users",
      "Streaming is orthogonal to checkpoints: you can stream a durable thread"
    ),
    whyItExists:
      "A 20-second tool call with no tokens looks like a hang. Streaming is how you show 'still working' and partial answers.",
    analogy:
      "A live sports ticker vs waiting for the newspaper. Same game. Different when you learn the score.",
    analogyDiagram: stack("Streaming", "Spinner = invoke only", "Ticker = stream"),
    diagram: pastelChart(
      `flowchart TD
    Run[graph.stream] --> U[updates per node]
    Run --> M[messages / tokens]
    Run --> V[values full state]
    U --> UI[UI cards]
    M --> UI
    V --> UI`,
      `class Run hub
    class U,M,V grp1
    class UI grp3`
    ),
    workflowDiagrams: [
      {
        title: "What the user should see",
        caption: "Tokens for the reply. A card when a tool starts. A HITL card when interrupt fires. Not raw debug dumps.",
        chart: pastelChart(
          `flowchart LR
    Tok[tokens] --> Bubble[Chat bubble]
    Tool[tool start] --> Card[Tool card]
    Hit[interrupt] --> Approve[Approve button]`,
          `class Tok,Bubble grp1
    class Tool,Card grp3
    class Hit,Approve grp2`
        ),
      },
      {
        title: "invoke vs stream",
        caption: "invoke waits for Finish. stream yields along the way. Same graph, different consumption.",
        chart: pastelChart(
          `flowchart TD
    Inv[invoke] --> Done[One blob at the end]
    St[stream] --> S1[classify]
    St --> S2[assistant]
    St --> S3[tools]`,
          `class Inv,Done grp1
    class St,S1,S2,S3 grp3`
        ),
      },
    ],
    technicalExplanation:
      "graph.stream(input, config, stream_mode='updates') is the usual learning mode — you see which node just ran. messages mode is for token UIs. You can pass a list of modes. Subgraphs can be included or hidden. Pair with AG-UI later; this module is the runtime events.",
    example:
      "User asks a long research question. UI shows 'searching' when the search node updates, then tokens as the reply node streams, then done.",
    exampleSolution:
      "Start with stream_mode='updates' in a terminal so you learn the shape. Then wire messages mode into the chat bubble. Do not start with debug in production logs of user text.",
    commandsToRemember: [
      "graph.stream(input, config, stream_mode='updates')",
      "stream_mode='messages'  # tokens for the bubble",
      "invoke = wait, stream = ticker",
      "Same thread_id as checkpoints",
    ],
    commonMistakes: [
      "Only using invoke, then wondering why the UI spins for 30 seconds",
      "Dumping debug streams to the end user",
      "Streaming without a thread_id when you also need HITL",
    ],
    revisionNotes: {
      cheatSheet: ["stream not only invoke", "updates vs messages", "Custom for progress", "Works with threads"],
    },
    glossary: ["stream", "astream", "stream_mode", "updates", "messages"],
    learnElsewhere: ["AG-UI — Phase 22", "LangGraph Platform"],
  }),

  "langgraph-time-travel": visual({
    concept: b(
      "Time travel reads checkpoint history for a thread: every super-step is a frame you can inspect",
      "get_state shows now. get_state_history lists the past. update_state writes a fork and continues from there",
      "This is how you debug 'why did it refund' without re-running the whole ticket from scratch",
      "It is not git. It is an audit log of state. Treat it as sensitive — it contains user messages"
    ),
    whyItExists:
      "Graphs fail in the middle. Time travel lets you see the state at that node, patch a field, and replay — the production debugger.",
    analogy:
      "CCTV plus a rewind button. You do not rebuild the store. You scrub to 14:02 and watch the door.",
    analogyDiagram: stack("Time travel", "History = CCTV", "update_state = fork"),
    diagram: pastelChart(
      `flowchart LR
    H1[Checkpoint 1] --> H2[Checkpoint 2]
    H2 --> H3[Checkpoint 3 now]
    H2 --> Fork[update_state]
    Fork --> H4[New future]`,
      `class H1,H2,H3 grp1
    class Fork,H4 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Debug a bad route",
        caption: "If classify tagged tech instead of billing, fork from that checkpoint with the right label and replay.",
        chart: pastelChart(
          `flowchart TD
    Bad[ticket_type = tech] --> See[get_state]
    See --> Fix[update_state billing]
    Fix --> Replay[continue]`,
          `class Bad grp2
    class See,Fix,Replay grp4`
        ),
      },
      {
        title: "What you do not time-travel",
        caption: "Do not rewind a refund that already hit the bank. Time travel is for state, not for undoing the world.",
        chart: pastelChart(
          `flowchart LR
    State[Graph state] --> OK[Safe to fork]
    Bank[Money already moved] --> No[Compensate, do not rewind]`,
          `class State,OK grp4
    class Bank,No grp2`
        ),
      },
    ],
    technicalExplanation:
      "graph.get_state(config) returns the current snapshot. get_state_history(config) walks checkpoints. update_state(config, values, as_node=...) creates a new checkpoint as if that node had returned those values. Replay by invoking with the checkpoint's id. Needs the same checkpointer you used to run.",
    example:
      "Thread ticket-4411 classified as tech. You inspect history, set ticket_type to billing, resume. The billing subgraph runs. The user is still on the same ticket id.",
    exampleSolution:
      "In the last module you will print get_state after a pause. Get used to reading the snapshot before you ever fork production threads.",
    commandsToRemember: [
      "graph.get_state(config)  # now",
      "graph.get_state_history(config)  # frames",
      "graph.update_state(config, values)  # fork",
      "Do not rewind side effects that already happened",
    ],
    commonMistakes: [
      "Trying time travel without a checkpointer",
      "Forking production threads as a habit instead of fixing the route function",
      "Logging full history (PII) to a shared Slack channel",
    ],
    revisionNotes: {
      cheatSheet: ["History is checkpoints", "get_state / history", "update_state forks", "Not an undo for money"],
    },
    glossary: ["get_state", "get_state_history", "update_state", "checkpoint id"],
    learnElsewhere: ["Checkpoints", "Eval engineering — Phase 19"],
  }),

  "langgraph-subgraphs": visual({
    concept: b(
      "A subgraph is a compiled graph used as a node in a parent graph",
      "Specialists keep their own state contract. The parent only maps the fields it must pass in and take out",
      "This is how multi-agent LangGraph is supposed to look: not 40 nodes in one file, but billing and tech as child graphs",
      "HITL and checkpoints can live inside the child. The parent still owns the thread_id unless you give the child its own"
    ),
    whyItExists:
      "A mega-graph is unreadable and untestable. Subgraphs let a team own billing without touching classify.",
    analogy:
      "A company org chart. The CEO graph delegates to Finance. Finance can redo internals without rewriting the CEO loop.",
    analogyDiagram: stack("Subgraphs", "Parent = org chart", "Child = department"),
    diagram: pastelChart(
      `flowchart TD
    Start([START]) --> Classify
    Classify --> R{route}
    R -->|bill| Billing[billing subgraph]
    R -->|tech| Tech[tech subgraph]
    Billing --> Reply
    Tech --> Reply
    Reply --> Finish([Finish])`,
      `class Start,Finish hub
    class Classify,R grp1
    class Billing,Tech grp2
    class Reply grp3`
    ),
    workflowDiagrams: [
      {
        title: "Map parent fields into the child",
        caption: "Do not share one giant state blob. Pass ticket_id in, take result out.",
        chart: pastelChart(
          `flowchart LR
    P[Parent state] --> Map[map]
    Map --> C[Child state]
    C --> Out[result]
    Out --> P2[Parent state]`,
          `class P,P2 hub
    class Map,C,Out grp1`
        ),
      },
      {
        title: "When not to subgraph",
        caption: "Two-line helpers stay as nodes. Subgraph when the child has its own loop, tools, or HITL.",
        chart: pastelChart(
          `flowchart TD
    Tiny[format_date] --> Node[Keep as a node]
    Big[billing tools + refund gate] --> Sub[Make a subgraph]`,
          `class Tiny,Node grp1
    class Big,Sub grp2`
        ),
      },
    ],
    technicalExplanation:
      "Compile the child, add_node('billing', child). Shared schema or explicit input/output mapping. Command(graph=Command.PARENT) can jump back to a parent node. Test the child with its own invokes before wiring the parent.",
    example:
      "Support parent: classify → billing subgraph or tech subgraph → reply. Refund interrupt lives only inside billing. Tech never sees refund tools.",
    exampleSolution:
      "Draw two boxes. List the two fields that cross the boundary. If you need twelve fields, the contract is wrong — shrink it.",
    commandsToRemember: [
      "Child = compiled graph passed to add_node",
      "Map in / map out — do not share a junk drawer",
      "HITL can live inside the child",
      "Test the child alone first",
    ],
    commonMistakes: [
      "One shared state object with 40 keys for every specialist",
      "Subgraphing a function that is two lines long",
      "No route back to the parent, so the child Finish ends the whole ticket",
    ],
    revisionNotes: {
      cheatSheet: ["Compiled graph as a node", "Thin contract", "Test child first", "Specialists isolate tools"],
    },
    glossary: ["subgraph", "state mapping", "parent graph"],
    learnElsewhere: ["Multi-agent systems — Phase 18", "Build a LangGraph Agent"],
  }),

  "langgraph-platform": visual({
    concept: b(
      "LangGraph Platform is how you run the compiled graph as a server: threads, assistants, streaming, HITL over HTTP",
      "langgraph.json points at your graph. langgraph dev is the local server plus Studio",
      "Studio is the visual debugger for threads — you watch nodes light up, you resume interrupts",
      "Production is LangSmith deployment (hosted) or your own LangGraph Server. Same thread model you already learned"
    ),
    whyItExists:
      "A Python file on your laptop is not a product. Platform wraps invoke, stream, and resume so a web app can talk to one durable graph.",
    analogy:
      "Your graph is the kitchen. Platform is the restaurant: tickets (threads), a pass (API), and a window where the chef watches orders (Studio).",
    analogyDiagram: stack("Platform", "Graph = kitchen", "Server = restaurant"),
    diagram: pastelChart(
      `flowchart TD
    UI[Your app] --> API[LangGraph Server]
    API --> Graph[Compiled graph]
    API --> Threads[(thread_id + checkpoints)]
    Studio[LangGraph Studio] --> API`,
      `class UI,API hub
    class Graph,Threads grp1
    class Studio grp3`
    ),
    workflowDiagrams: [
      {
        title: "Local loop with Studio",
        caption: "dev server first. Click a thread. See the same checkpoints you printed in the terminal.",
        chart: pastelChart(
          `flowchart LR
    Json[langgraph.json] --> Dev[langgraph dev]
    Dev --> Studio
    Dev --> App[localhost API]`,
          `class Json,Dev hub
    class Studio,App grp1`
        ),
      },
      {
        title: "What you deploy",
        caption: "You deploy a compiled graph plus a checkpointer backend. Not a notebook. Not MemorySaver.",
        chart: pastelChart(
          `flowchart TD
    G[graph.py] --> Svc[LangGraph Server]
    PG[(Postgres)] --> Svc
    Svc --> Prod[Prod threads]`,
          `class G,Svc hub
    class PG,Prod grp3`
        ),
      },
    ],
    technicalExplanation:
      "A langgraph.json file names the graph export. langgraph dev runs an in-memory or configured server and opens Studio. Production: attach Postgres, env secrets, and a real thread store. LangSmith traces still sit beside this — Platform is the runtime host, LangSmith is observability.",
    example:
      "Same support graph from the last module, served locally. The UI posts to /threads/{id}/runs. You approve a refund in Studio. The thread continues.",
    exampleSolution:
      "Do not start Platform on day one. After the last module's graph.py runs in a terminal, wrap it. If Studio is confusing, your graph is confusing — simplify nodes first.",
    commandsToRemember: [
      'pip install -U "langgraph-cli[inmem]"',
      "langgraph dev  # local server + Studio",
      "langgraph.json names the graph to serve",
      "Postgres checkpointer in production, not MemorySaver",
    ],
    commonMistakes: [
      "Deploying MemorySaver",
      "Skipping thread_id in the client so every click is a new conversation",
      "Opening Platform before you can explain your own nodes",
    ],
    revisionNotes: {
      cheatSheet: ["Server hosts the graph", "Studio debugs threads", "langgraph.json", "Prod needs Postgres"],
    },
    glossary: ["LangGraph Platform", "LangGraph Studio", "langgraph.json", "assistant", "thread"],
    learnElsewhere: ["Production agents — Phase 21", "LangSmith — Phase 19"],
    furtherReading: [
      { title: "LangGraph Platform", url: "https://docs.langchain.com/langsmith/agent-server" },
    ],
  }),

  "build-langgraph-agent": createLesson({
    visualFirst: true,
    practiceTask: "",
    concept: b(
      "This is the only LangGraph module you run on your machine — follow the steps in order",
      "You will build one support graph that uses every idea from this phase: state, nodes, edges, routing, tools, checkpoints, HITL, streaming, time travel, a billing subgraph",
      "Work in Terminal first, then paste files, then run, then resume the interrupt, then stream, then inspect state",
      "Do not skip the interrupt. If it never pauses, you did not build the graph we drew"
    ),
    whyItExists:
      "Reading twelve modules without a file that actually pauses is how people think they know LangGraph. This file is the test.",
    analogy:
      "A tiny clinic: front desk classifies, a doctor talks, a pharmacy looks up the order, a manager signs refunds, then the desk replies. You are wiring that clinic.",
    analogyDiagram: pastelChart(
      `flowchart TD
    User([YOU type a ticket]) --> Classify
    Classify --> Assist[assistant]
    Assist --> Tools[ToolNode]
    Tools --> Assist
    Assist --> Gate[refund_gate interrupt]
    Gate --> Billing[billing subgraph]
    Billing --> Reply`,
      `class User hub
    class Classify,Assist,Tools grp1
    class Gate,Billing grp2
    class Reply grp4`
    ),
    diagram: pastelChart(
      `flowchart TD
    subgraph Root["WHERE: folder support_graph/"]
        ENV[".env — API key"]
        PY["graph.py — the whole clinic"]
    end
    Root --> Run[python graph.py]
    Run --> Pause[waits on refund]
    Pause --> Resume[python graph.py --resume]
    Resume --> Done[reply printed]`,
      `class Root hub
    class ENV,PY grp1
    class Run,Pause,Resume,Done grp2`
    ),
    technicalExplanation:
      "One folder. One venv. One graph.py. SqliteSaver writes checkpoints.db so a new terminal can resume the same thread_id. The first run classifies, may call lookup_order, then interrupt()s before create_refund. The second command resumes ticket-1. Then you stream and print get_state so time travel is not abstract.",
    example:
      "Type: Refund order 4411, it is damaged. The graph should pause. After you resume with approve, it should print that the refund ran.",
    exampleSolution:
      "If it never pauses, refund_gate is not on the path — check tools_condition vs the gate edge. If resume starts over, thread_id changed. If import errors, you are not in the venv.",
    buildSteps: [
      {
        title: "Check Python",
        where: "Your Mac Terminal — any folder.",
        body: "Need Python 3.10+. Prefer 3.11 or 3.12.",
        command: "python3 --version",
      },
      {
        title: "Create the folder and venv",
        where: "Documents is fine. This is a new folder, not inside another project.",
        body: "venv keeps LangGraph off your system Python. Activate it before every later command in this module.",
        command:
          "mkdir -p ~/Documents/support_graph && cd ~/Documents/support_graph && python3 -m venv .venv && source .venv/bin/activate",
      },
      {
        title: "Install packages",
        where: "MUST be inside support_graph/ with the venv activated (your prompt should show .venv).",
        body: "LangGraph runtime, a SQLite checkpointer so resume works in a new terminal, OpenAI chat model, dotenv for the key.",
        command: "pip install -U langgraph langgraph-checkpoint-sqlite langchain-openai langchain-core python-dotenv",
      },
      {
        title: "Add your OpenAI API key",
        where: "File: support_graph/.env — never commit this file.",
        body: "No quotes. Save. The script loads it. You do not paste the key into Python.",
        file: ".env",
        codeLanguage: "bash",
        code: "OPENAI_API_KEY=sk-your-real-key-here",
      },
      {
        title: "Write the graph — every module in one file",
        where: "File: support_graph/graph.py — create it and paste the whole file.",
        body: "Read the comments. They map to the modules you just finished: state, nodes, edges, routing, tools, checkpoints, interrupt, subgraph, stream, get_state.",
        file: "graph.py",
        codeLanguage: "python",
        code: `import argparse
import os
import sqlite3
from typing import Annotated, Literal, TypedDict

from dotenv import load_dotenv
from langchain_core.messages import AnyMessage, HumanMessage
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from langgraph.types import Command, interrupt

load_dotenv()

THREAD = {"configurable": {"thread_id": "ticket-1"}}
DB = "checkpoints.db"


class AgentState(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]
    ticket_type: str
    refund_approved: bool


@tool
def lookup_order(order_id: str) -> str:
    """Look up a fake order. Read-only."""
    return f"Order {order_id}: status=delivered, total=480, item=headphones"


@tool
def create_refund(order_id: str, amount: int) -> str:
    """Create a fake refund. Write — only call after a human approved."""
    return f"Refunded {amount} for order {order_id}"


tools = [lookup_order, create_refund]
model = ChatOpenAI(model="gpt-4o-mini").bind_tools(tools)


def classify(state: AgentState) -> dict:
    text = state["messages"][-1].content.lower()
    ticket_type = "billing" if "refund" in text or "charge" in text else "tech"
    return {"ticket_type": ticket_type}


def assistant(state: AgentState) -> dict:
    sys = (
        f"You are support. ticket_type={state.get('ticket_type')}. "
        "Use lookup_order before you promise facts. "
        "If the user wants a refund, call create_refund only after approval is mentioned in tools."
    )
    reply = model.invoke([{"role": "system", "content": sys}, *state["messages"]])
    return {"messages": [reply]}


def refund_gate(state: AgentState) -> dict:
    decision = interrupt(
        {
            "question": "Approve this refund?",
            "ticket_type": state.get("ticket_type"),
        }
    )
    return {"refund_approved": bool(decision)}


def reply(state: AgentState) -> dict:
    status = "approved" if state.get("refund_approved") else "closed"
    return {"messages": [HumanMessage(content=f"(desk) Ticket {status}.")]}


billing = StateGraph(AgentState)
billing.add_node("pay", ToolNode([create_refund]))
billing.add_edge(START, "pay")
billing.add_edge("pay", END)
billing_graph = billing.compile()


def route_after_assistant(state: AgentState) -> Literal["tools", "refund_gate", "reply"]:
    last = state["messages"][-1]
    if getattr(last, "tool_calls", None):
        names = [c["name"] for c in last.tool_calls]
        if "create_refund" in names:
            return "refund_gate"
        return "tools"
    return "reply"


def build():
    g = StateGraph(AgentState)
    g.add_node("classify", classify)
    g.add_node("assistant", assistant)
    g.add_node("tools", ToolNode([lookup_order]))
    g.add_node("refund_gate", refund_gate)
    g.add_node("billing", billing_graph)
    g.add_node("reply", reply)
    g.add_edge(START, "classify")
    g.add_edge("classify", "assistant")
    g.add_conditional_edges(
        "assistant",
        route_after_assistant,
        {"tools": "tools", "refund_gate": "refund_gate", "reply": "reply"},
    )
    g.add_edge("tools", "assistant")
    g.add_edge("refund_gate", "billing")
    g.add_edge("billing", "reply")
    g.add_edge("reply", END)
    conn = sqlite3.connect(DB, check_same_thread=False)
    return g.compile(checkpointer=SqliteSaver(conn))


def run_new(graph):
    try:
        result = graph.invoke(
            {"messages": [HumanMessage(content="Refund order 4411, it is damaged")]},
            THREAD,
        )
        print(result)
        if isinstance(result, dict) and result.get("__interrupt__"):
            print("Paused for HITL. Next: python graph.py --resume")
    except Exception as exc:
        print("Paused for HITL (this is expected):", exc)
        print("Next: python graph.py --resume")


def run_resume(graph):
    result = graph.invoke(Command(resume=True), THREAD)
    print(result)


def run_stream(graph):
    for event in graph.stream(
        {"messages": [HumanMessage(content="Where is order 4411?")]},
        {"configurable": {"thread_id": "ticket-2"}},
        stream_mode="updates",
    ):
        print(event)


def run_inspect(graph):
    snap = graph.get_state(THREAD)
    print(snap.values)
    print("--- history ---")
    for frame in graph.get_state_history(THREAD):
        print(frame.config, frame.next)


if __name__ == "__main__":
    if not os.getenv("OPENAI_API_KEY"):
        raise SystemExit("Set OPENAI_API_KEY in .env")
    p = argparse.ArgumentParser()
    p.add_argument("--resume", action="store_true")
    p.add_argument("--stream", action="store_true")
    p.add_argument("--inspect", action="store_true")
    args = p.parse_args()
    app = build()
    if args.resume:
        run_resume(app)
    elif args.stream:
        run_stream(app)
    elif args.inspect:
        run_inspect(app)
    else:
        run_new(app)`,
      },
      {
        title: "Run until the interrupt",
        where: "Terminal, inside support_graph/, venv still activated.",
        body: "First run should pause on refund_gate. That pause is success — you may see an interrupt payload or a GraphInterrupt message. Do not delete checkpoints.db. Then run --resume. If it prints a full reply and exits without pausing, the gate was skipped.",
        command: "cd ~/Documents/support_graph && source .venv/bin/activate && python graph.py",
      },
      {
        title: "Resume the same thread",
        where: "Same Terminal, same folder, same venv. Do not change thread_id.",
        body: "This is HITL + checkpoints. Command(resume=True) unblocks interrupt() using checkpoints.db. You should see create_refund run inside the billing subgraph, then the desk reply. If it starts a brand new ticket, you are in the wrong folder.",
        command: "python graph.py --resume",
      },
      {
        title: "Stream a different ticket",
        where: "Same folder. This uses ticket-2 so you do not collide with the paused/resumed thread.",
        body: "Streaming module: each printed dict is a node update. You should see classify, then assistant, then maybe tools.",
        command: "python graph.py --stream",
      },
      {
        title: "Inspect checkpoints (time travel)",
        where: "Same folder. Looks at ticket-1, the thread you refunded.",
        body: "get_state is now. get_state_history is the CCTV. If history is empty, checkpoints.db was not written — you ran from a different folder or skipped the first invoke.",
        command: "python graph.py --inspect",
      },
    ],
    code: undefined,
    commandsToRemember: [
      "cd ~/Documents/support_graph && source .venv/bin/activate",
      "pip install -U langgraph langgraph-checkpoint-sqlite langchain-openai langchain-core python-dotenv",
      "python graph.py  # runs until interrupt",
      "python graph.py --resume  # same thread_id",
      "python graph.py --stream",
      "python graph.py --inspect",
    ],
    commonMistakes: [
      "Running python graph.py without activating the venv",
      "Starting a new thread on resume by editing THREAD",
      "Skipping the first run and only using --resume",
      "Committing .env",
      "Deleting checkpoints.db and then running --resume — there is nothing to resume",
    ],
    revisionNotes: {
      cheatSheet: [
        "venv + pip first",
        "graph.py is the whole clinic",
        "First run pauses",
        "python graph.py --resume uses checkpoints.db",
        "--stream and --inspect after",
      ],
    },
    glossary: ["thread_id", "interrupt", "ToolNode", "subgraph", "MemorySaver", "stream_mode"],
    learnElsewhere: ["LangGraph Platform — Studio for the same graph", "AG-UI"],
    furtherReading: [
      { title: "LangGraph graph API", url: "https://docs.langchain.com/oss/python/langgraph/graph-api" },
    ],
  }),
};
