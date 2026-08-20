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

export const crewaiLessons: Record<string, ReturnType<typeof createLesson>> = {
  crewai: visual({
    concept: b(
      "CrewAI is a Python framework for agentic apps — especially multi-agent collaboration plus workflow control",
      "A Crew is a team of autonomous role-based agents. A Flow is the controlled application around them",
      "Do not think CrewAI = multi-agent wrapper. Think Agents + Tasks + Crews + Flows + Tools + Memory + Knowledge",
      "Under every role is the same agent loop: reason, tool, observe, reason again"
    ),
    whyItExists:
      "A single helpful assistant cannot own research, implementation, and review. CrewAI exists so you can assign roles, give each a loop and tools, then orchestrate the team with a Crew or wrap the whole product in a Flow.",
    analogy:
      "A film set: the crew (camera, script, edit) collaborates. The shooting schedule (the Flow) decides what happens when it rains.",
    analogyDiagram: stack("CrewAI", "Crews — autonomous team", "Flows — controlled workflow"),
    diagram: pastelChart(
      `flowchart TD
    User([User]) --> Flow
    Flow --> Route[Routing + State]
    Route --> Crew
    Crew --> A1[Researcher]
    Crew --> A2[Developer]
    Crew --> A3[Reviewer]
    A1 --> Tools
    A2 --> Tools
    A3 --> Memory
    Tools --> Tasks
    Memory --> Tasks
    Tasks --> Result[Results]
    Result --> Flow
    Flow --> User`,
      `class User,Flow hub
    class Route,Crew grp1
    class A1,A2,A3 grp2
    class Tools,Memory,Tasks,Result grp3`
    ),
    workflowDiagrams: [
      {
        title: "Crew vs Flow",
        caption: "Flow controls the application. Crew handles autonomous collaboration inside it.",
        chart: pastelChart(
          `flowchart TD
    subgraph CrewSide["Crew"]
        C1["High autonomy"]
        C2["Roles + tasks"]
        C3["Collaboration"]
    end
    subgraph FlowSide["Flow"]
        F1["Explicit state"]
        F2["Start / listen / router"]
        F3["Can contain a Crew"]
    end
    CrewSide -.->|"inside"| FlowSide`,
          `class C1,C2,C3 grp1
    class F1,F2,F3 grp2`
        ),
      },
    ],
    technicalExplanation:
      "CrewAI implements agentic concepts you already know: Agent = autonomous loop, Tool = tool calling, Task = goal/work unit, Process = orchestration, Memory = agent memory, Flow = stateful workflow, Guardrail = output validation, Delegation = multi-agent coordination. Learn the concept, then the CrewAI class that implements it.",
    example:
      "User asks for a bug fix. Flow classifies. Simple → one agent. Complex → Researcher + Developer + Reviewer crew, then Flow reviews and returns.",
    commandsToRemember: [
      "Crew = autonomous team",
      "Flow = application control",
      "Flow can contain a Crew",
      "Ask: which agentic concept is this class?",
    ],
    revisionNotes: {
      cheatSheet: ["Crews + Flows", "Roles are not just prompts", "Loop underneath", "Concept before syntax"],
    },
    glossary: ["CrewAI", "Crew", "Flow", "Agent loop"],
    learnElsewhere: ["Agent loop — Phase 4", "LangGraph — Phase 10", "Build a Research Crew"],
    furtherReading: [
      { title: "CrewAI documentation", url: "https://docs.crewai.com/" },
      { title: "crewAIInc/crewAI", url: "https://github.com/crewAIInc/crewAI" },
    ],
  }),

  "crewai-architecture": visual({
    concept: b(
      "The building blocks are Agent, Task, Crew, Process, Flow, Tool, Memory, Knowledge, and LLM",
      "An Agent owns a role, a goal, a backstory, tools, an LLM, and optional memory/knowledge",
      "A Crew binds agents + tasks + a process. A Flow binds Python methods + state + events",
      "Process is how the crew runs. Flow is how the application runs"
    ),
    whyItExists:
      "If you only memorize decorators, you cannot debug a stuck crew. The architecture is the map: who reasons, who executes, what state is shared, and who decides the next step.",
    analogy:
      "Org chart plus calendar. Agents are people. Tasks are tickets. Crew is the team. Process is standup rules. Flow is the product roadmap.",
    diagram: pastelChart(
      `flowchart TD
    CrewAI([CrewAI])
    CrewAI --> Crews
    CrewAI --> Flows
    Crews --> Agents
    Crews --> Tasks
    Crews --> Tools
    Agents --> Role
    Agents --> Goal
    Agents --> Backstory
    Agents --> LLM
    Agents --> Memory
    Agents --> Knowledge
    Flows --> Start
    Flows --> Listen
    Flows --> Router`,
      `class CrewAI hub
    class Crews,Agents,Tasks,Tools grp1
    class Role,Goal,Backstory,LLM,Memory,Knowledge grp2
    class Flows,Start,Listen,Router grp3`
    ),
    workflowDiagrams: [
      {
        title: "The loop under an Agent",
        caption: "CrewAI organizes loops into teams and workflows. The loop itself is still reason → tool → observe.",
        chart: pastelChart(
          `flowchart TD
    LLM --> Reason
    Reason --> Tool
    Tool --> Observe
    Observe --> Reason
    Reason --> Done[Task complete]`,
          `class LLM,Reason hub
    class Tool,Observe grp1
    class Done grp2`
        ),
      },
    ],
    technicalExplanation:
      "Kickoff starts a Crew: each Task is given to its Agent; the Agent's LLM runs a tool loop until expected_output is met or max iterations fire. Hierarchical process inserts a manager who assigns work. A Flow is a different runtime: @start / @listen / @router methods with typed state, and a Crew is something you call inside a method.",
    example:
      "A research product: Flow receives the topic. State holds topic and draft. A Crew researches then writes. Flow returns the report.",
    commandsToRemember: [
      "Nine building blocks",
      "Process ≠ Flow",
      "Memory ≠ Knowledge",
      "Crew kickoff vs Flow kickoff",
    ],
    revisionNotes: {
      cheatSheet: ["Blocks first", "Crew vs Flow runtime", "Loop still exists", "State lives on Flow"],
    },
    glossary: ["Agent", "Task", "Crew", "Process", "Flow", "Knowledge"],
    learnElsewhere: ["Tool Calling — Phase 7", "Agent Memory — Phase 5"],
  }),

  "crewai-agents-roles": visual({
    concept: b(
      "A CrewAI Agent is a role contract: who you are, what you must accomplish, and what expertise you bring",
      "Role, goal, and backstory are not flavor text — they change tool choice and refusal behavior",
      "Give tools only to the role that should use them. Overlapping jobs make crews fight",
      "allow_delegation stays false unless this agent is a manager"
    ),
    whyItExists:
      "Multi-agent demos die when every agent is 'a helpful assistant'. Roles are the API of the team.",
    analogy:
      "A newsroom: reporter, editor, fact-checker. Nobody is 'generic writer'.",
    diagram: pastelChart(
      `flowchart TD
    Agent([Agent])
    Agent --> Role["Who are you?"]
    Agent --> Goal["What must you finish?"]
    Agent --> Story["What expertise do you have?"]
    Agent --> Tools
    Agent --> LLM`,
      `class Agent hub
    class Role,Goal,Story grp1
    class Tools,LLM grp2`
    ),
    technicalExplanation:
      "Agent(role, goal, backstory, tools, llm, allow_delegation, memory, knowledge). Role and goal are injected into the system prompt every turn. Backstory supplies constraints. Tools attach to this agent only. Cap max_iter so a confused role cannot loop forever.",
    example:
      "Researcher has search. Writer has no search. Writer cannot silently google and invent sources.",
    commandsToRemember: [
      "role + goal + backstory",
      "Tools belong to one role",
      "No overlapping jobs",
      "Delegation is for managers",
    ],
    revisionNotes: {
      cheatSheet: ["Roles are contracts", "Split tools", "Manager delegates", "Writer does not search"],
    },
    glossary: ["Role", "Goal", "Backstory", "Delegation"],
    learnElsewhere: ["Tasks", "Agent Delegation", "Tool Calling — Phase 7"],
  }),

  "crewai-tasks-process": visual({
    concept: b(
      "A Task is a unit of work: description, expected output, assigned agent, optional context",
      "expected_output is the definition of done — write it like a schema, not be helpful",
      "context from a prior task forwards the previous result so the next agent does not start from zero",
      "Tasks also support structured output, output files, guardrails, and human review"
    ),
    whyItExists:
      "Without tasks, a crew is a group chat. Tasks make output inspectable and order explicit.",
    analogy:
      "A sprint ticket: owner, description, definition of done. Context is the linked ticket below it.",
    diagram: pastelChart(
      `flowchart TD
    T1["Task: Research"] --> A1[Researcher]
    A1 -->|"context"| T2["Task: Write"]
    T2 --> A2[Writer]
    A2 --> Out["expected_output / file"]`,
      `class T1,T2 grp1
    class A1,A2 grp2
    class Out hub`
    ),
    technicalExplanation:
      "A task names the work, the DoD, and the owner. Placeholders like {topic} are filled from kickoff inputs. Chain tasks with context so the writer sees the research. output_file writes the result to disk when the task completes.",
    example:
      "Research → write. Expected output: markdown with headings + sources, not a nice summary.",
    commandsToRemember: [
      "Task has expected_output",
      "Chain with context",
      "Placeholders from kickoff inputs",
      "output_file for artifacts",
    ],
    revisionNotes: {
      cheatSheet: ["Tasks not vibes", "Chain with context", "Schema the output", "One owner per task"],
    },
    glossary: ["Task", "expected_output", "context", "output_file"],
    learnElsewhere: ["Processes", "Build a Research Crew"],
  }),

  "crewai-tools": visual({
    concept: b(
      "An LLM alone returns text. An agent with tools can search, read files, hit APIs, and come back with observations",
      "Built-in tools cover search, web, files. Custom tools are Python functions the loop may call",
      "The loop is: reason → choose tool → execute → observe → reason again",
      "This is where a crew stops being conversational and starts being useful"
    ),
    whyItExists:
      "Role prompts without tools are theater. Production crews earn trust by calling real systems and showing the observation.",
    analogy:
      "A mechanic with a toolbox vs a mechanic who only describes engines. The tool is the wrench.",
    diagram: pastelChart(
      `flowchart TD
    User --> Agent
    Agent --> Reason
    Reason --> Choose[Choose tool]
    Choose --> Exec[Execute]
    Exec --> World[(Web / API / files)]
    World --> Observe
    Observe --> Reason
    Reason --> Done[Answer]`,
      `class User,Agent,Reason hub
    class Choose,Exec,Observe grp1
    class World,Done grp2`
    ),
    technicalExplanation:
      "Attach a tool only to the agent that should have that permission. The docstring is what the model reads. Return short observations — do not dump HTML. Fail closed on secrets and writes.",
    example:
      "Researcher: I need current information → search_web() → observation → reason → research complete.",
    commandsToRemember: [
      "Tools make agents useful",
      "Docstring is the schema",
      "Observe then reason",
      "Least privilege per role",
    ],
    revisionNotes: {
      cheatSheet: ["Think-act-observe", "Short observations", "Split tools by role", "Not every agent searches"],
    },
    glossary: ["Tool", "Observation", "Agent loop"],
    learnElsewhere: ["Tool Calling — Phase 7", "Least Privilege — Phase 20"],
  }),

  "crewai-processes": visual({
    concept: b(
      "Process is how a Crew orchestrates its tasks — not how your whole product is orchestrated (that is Flow)",
      "Sequential: Agent A / Task A then Agent B / Task B. Predictable pipelines",
      "Hierarchical: a manager agent coordinates, delegates, and validates worker output",
      "Pick sequential when the ticket order is known. Pick hierarchical when the manager must decide who works"
    ),
    whyItExists:
      "Three agents without a process is a group chat. Process is the standup rule that stops them talking forever.",
    analogy:
      "Sequential is a factory line. Hierarchical is a tech lead assigning tickets at standup.",
    diagram: pastelChart(
      `flowchart TD
    subgraph Seq["Sequential"]
        A[Agent A] --> TA[Task A]
        TA --> B[Agent B]
        B --> TB[Task B]
    end
    subgraph Hier["Hierarchical"]
        M[Manager] --> R[Researcher]
        M --> D[Developer]
        R --> M
        D --> M
    end`,
      `class A,TA,B,TB grp1
    class M hub
    class R,D grp2`
    ),
    technicalExplanation:
      "Sequential runs the tasks list in order. Hierarchical requires a manager who plans and delegates. Hierarchical costs more tokens. Do not use it for a two-step research → write pipeline.",
    example:
      "Content brief: sequential researcher → writer. Incident response: hierarchical manager who decides whether to research or hotfix.",
    commandsToRemember: [
      "Process = crew orchestration",
      "Sequential = known order",
      "Hierarchical = manager delegates",
      "Flow is a different layer",
    ],
    revisionNotes: {
      cheatSheet: ["Process ≠ Flow", "Line vs lead", "Hierarchical needs a manager", "Eval each step"],
    },
    glossary: ["Process.sequential", "Process.hierarchical", "Manager"],
    learnElsewhere: ["Agent Delegation", "Flows"],
  }),

  "crewai-delegation": visual({
    concept: b(
      "Delegation is a manager handing a scoped job to a specialist, then taking the result back",
      "User → Manager → Researcher / Developer / Reviewer — not User → one god-agent → every tool",
      "allow_delegation belongs on the manager. Workers stay narrow",
      "This is multi-agent coordination, not a fancier prompt"
    ),
    whyItExists:
      "The manager does not know everything. It should ask the researcher, then ask the developer to implement.",
    analogy:
      "A tech lead who cannot do everything, and should not. They write the ticket, not the patch.",
    diagram: pastelChart(
      `flowchart TD
    User --> Manager
    Manager --> Research[Research agent]
    Research --> Search[Search tool]
    Search --> Research
    Research --> Manager
    Manager --> Writer[Writer agent]`,
      `class User,Manager hub
    class Research,Writer grp1
    class Search grp2`
    ),
    technicalExplanation:
      "Hierarchical process plus delegation on the manager. Scope the brief: goal, constraints, tools the worker already has. Cap rounds so manager and worker cannot ping-pong. Prefer sequential when the handoff order is already known.",
    example:
      "Manager asks research for Stripe API changes, then asks the writer for a migration note. Manager never searches or writes the doc itself.",
    commandsToRemember: [
      "Manager delegates",
      "Workers do not delegate",
      "Scope the brief",
      "Cap the ping-pong",
    ],
    revisionNotes: {
      cheatSheet: ["Lead assigns", "Specialists execute", "No god-agent", "Log the handoff"],
    },
    glossary: ["Delegation", "allow_delegation", "Manager agent"],
    learnElsewhere: ["Processes", "Multi-agent — Phase 18"],
  }),

  "crewai-memory": visual({
    concept: b(
      "Memory is what the crew retains. Knowledge is what you retrieve from documents. They are not the same",
      "Short-term memory is this run. Long-term memory persists across kickoffs. Entity memory is facts about people and things",
      "Flows can remember and recall across runs",
      "Turning memory on is not a memory design"
    ),
    whyItExists:
      "An agent that forgets the last finding will re-research the same topic. Memory is how crews improve across a session and across days.",
    analogy:
      "Scratch paper (short-term), a notebook you keep (long-term), and a CRM card per customer (entity). RAG is the library you walk to — not the notebook.",
    diagram: pastelChart(
      `flowchart TD
    Run[This kickoff] --> STM[Short-term]
    STM --> LTM[Long-term]
    LTM --> Next[Next kickoff]
    Entity[Entity memory] --> Agent
    STM --> Agent
    LTM --> Agent
    Docs[Documents] -.->|"not memory"| Knowledge`,
      `class Run,Agent hub
    class STM,LTM,Entity grp1
    class Docs,Knowledge,Next grp2`
    ),
    technicalExplanation:
      "Crew memory covers this execution and, if enabled, stored facts for later kickoffs. Scope memories so one topic or user does not leak into another. Memory is not stuffing the window — you still budget context.",
    example:
      "A research crew remembers that last week's brief already covered MCP sampling, so the next run starts from the gap.",
    commandsToRemember: [
      "Memory ≠ RAG",
      "Short / long / entity",
      "Scope by user or run",
      "Still budget context",
    ],
    revisionNotes: {
      cheatSheet: ["Notebook vs library", "Scope memories", "Not embed-all-PDFs", "TTL stale facts"],
    },
    glossary: ["Short-term memory", "Long-term memory", "Entity memory"],
    learnElsewhere: ["Agent Memory — Phase 5", "Context Engineering — Phase 6", "Knowledge and RAG"],
  }),

  "crewai-knowledge": visual({
    concept: b(
      "Knowledge is external information you attach so an agent can retrieve it — docs, PDFs, site dumps",
      "The interesting question is when the agent should retrieve, not always retrieve",
      "Chunk, embed, store, retrieve, then pack into the agent — this is RAG you already know",
      "Knowledge is a complement to memory, not a replacement"
    ),
    whyItExists:
      "Crews that 'know the docs' without retrieval hallucinate. Knowledge is how an agent actually reads the contract.",
    analogy:
      "Memory is your notes. Knowledge is the company wiki you search when the notes are not enough.",
    diagram: pastelChart(
      `flowchart TD
    Docs[Documents] --> Chunk
    Chunk --> Embed
    Embed --> VS[(Vector store)]
    VS --> Retrieve
    Retrieve --> Agent
    Agent -->|"only if needed"| Retrieve`,
      `class Docs,Chunk,Embed,VS grp1
    class Retrieve,Agent hub`
    ),
    technicalExplanation:
      "Attach a knowledge source to an Agent or Crew. Gate retrieval: a rename-the-variable task does not need the design doc. Filter by metadata. Compress hits before they enter the task context.",
    example:
      "Writer retrieves only the research notes for this topic, not the entire knowledge base.",
    commandsToRemember: [
      "Knowledge = retrieved docs",
      "Retrieve when needed",
      "Filter by metadata",
      "Compress before packing",
    ],
    revisionNotes: {
      cheatSheet: ["Wiki ≠ notebook", "Gate retrieval", "Reuse RAG skills", "Cite the chunk"],
    },
    glossary: ["Knowledge", "Knowledge source", "RAG"],
    learnElsewhere: ["RAG — Phase 3", "Context Engineering — Phase 6", "Memory"],
  }),

  "crewai-flows": visual({
    concept: b(
      "A Flow is controlled, event-driven application workflow: explicit state, start, listen, router",
      "If you only learn Crew, you know the beginner side of CrewAI",
      "Modern production CrewAI uses Flows as the orchestration layer around agents and crews",
      "Routers return a label; listen methods take the branch"
    ),
    whyItExists:
      "Crews are great at role pipelines. They are weak at product branching, retries across the whole job, and resume-after-crash. Flows add that control.",
    analogy:
      "Crews are the film crew on set. Flows are the shooting schedule with weather delays and pickup days.",
    diagram: pastelChart(
      `flowchart TD
    Start([START]) --> Validate
    Validate --> Router
    Router -->|"simple"| Agent
    Router -->|"complex"| Crew
    Crew --> Review
    Agent --> Review
    Review --> End([END])`,
      `class Start,End hub
    class Validate,Router grp1
    class Agent,Crew,Review grp2`
    ),
    technicalExplanation:
      "A Flow is a Python class with typed state. Start is the entry. Listen runs after. Router returns a string label that later listen methods bind to. You may kick off a Crew inside a method — the Flow does not replace the Crew, it calls it.",
    example:
      "Start → classify topic → router: short FAQ is one agent; deep brief kicks a research+write crew → end.",
    commandsToRemember: [
      "Start then listen",
      "Router returns a label",
      "Typed flow state",
      "Crew kickoff inside a step",
    ],
    revisionNotes: {
      cheatSheet: ["Flows = control", "Crews = collaboration", "Router labels", "Persist long jobs"],
    },
    glossary: ["Flow", "@start", "@listen", "@router", "Flow state"],
    learnElsewhere: ["LangGraph — Phase 10", "Crew + Flow Hybrid", "Durable Execution — Phase 21"],
  }),

  "crewai-hybrid": visual({
    concept: b(
      "The architecture to memorize: Flow provides control, Crew provides autonomous collaboration",
      "User request → Flow classifier → simple path is one Agent, complex path is a Crew",
      "Researcher / Writer live inside the complex branch, then Flow reviews and ends",
      "Do not think Crew OR Flow"
    ),
    whyItExists:
      "Real products have easy tickets and hard tickets. A crew on every one-line question wastes money. A single agent on a multi-source brief misses review.",
    analogy:
      "ER triage. Nurse (Flow) routes. A specialist (Agent) for a sprain. A trauma team (Crew) for a crash.",
    diagram: pastelChart(
      `flowchart TD
    User([User request]) --> Flow
    Flow --> Classify
    Classify --> Simple
    Classify --> Complex
    Simple --> One[Single agent]
    Complex --> Crew
    Crew --> Res[Researcher]
    Crew --> Wri[Writer]
    One --> Review
    Wri --> Review
    Review --> Flow
    Flow --> End([END])`,
      `class User,Flow,End hub
    class Classify,Simple,Complex,Review grp1
    class One,Crew,Res,Wri grp2`
    ),
    technicalExplanation:
      "Keep the Flow skinny: classify, route, persist, respond. Keep the Crew fat with roles. After the crew, the Flow — not another agent — decides pass/fail, retry, or return. That boundary is what you draw in interviews.",
    example:
      "FAQ about a term → simple agent. 'Write a 2026 agent-framework comparison' → research + write crew, then Flow saves report.md.",
    commandsToRemember: [
      "Flow controls, Crew collaborates",
      "Classify then route",
      "Do not crew a one-liner",
      "Flow owns pass/fail",
    ],
    revisionNotes: {
      cheatSheet: ["Hybrid is the product", "Cheap path / expensive path", "Crew inside a step", "Flow is the boss"],
    },
    glossary: ["Crew + Flow", "Classifier", "Router"],
    learnElsewhere: ["Flows", "Build a Research Crew", "Agent Design Patterns — Phase 17"],
  }),

  "crewai-production": visual({
    concept: b(
      "A demo crew is not an engineered application. Production adds guardrails, retries, HITL, cost, and eval",
      "Guardrail: validate output → yes continue / no retry. Policy lives in code",
      "Tool failures need recovery. Sensitive actions need human approval before execute",
      "Log, trace, and evaluate task success — not just the crew returned text"
    ),
    whyItExists:
      "Crews fail loudly (loops, bad tools) and quietly (plausible wrong reports). Production patterns separate a notebook from a service.",
    analogy:
      "A kitchen with tickets, a pass, and a manager who can kill a dish. Not a potluck.",
    diagram: pastelChart(
      `flowchart TD
    Out[Agent output] --> Val[Validation]
    Val -->|yes| Next[Continue]
    Val -->|no| Retry
    Retry --> Out
    Sensitive[Sensitive action] --> Human[Human approval]
    Human -->|approve| Exec[Execute]
    Human -->|reject| Stop`,
      `class Out,Val,Next hub
    class Retry,Stop grp1
    class Sensitive,Human,Exec grp2`
    ),
    technicalExplanation:
      "Validate structured output and retry. Cap iterations and timeouts. Budget tokens per kickoff. Pause for a human on irreversible work. Trace each task. Eval: did the report match the expected sections, not did it look good.",
    example:
      "Research crew: expected sections must exist, timeout 120s, log cost per topic, human review before publishing.",
    commandsToRemember: [
      "Validate then retry",
      "HITL on irreversible",
      "Timeout + max iterations",
      "Eval task success",
    ],
    revisionNotes: {
      cheatSheet: ["Guardrail in code", "HITL for publishes", "Budget the run", "Eval like a product"],
    },
    glossary: ["Guardrail", "HITL", "max_iter"],
    learnElsewhere: ["Eval Engineering — Phase 19", "Security — Phase 20", "Production — Phase 21"],
  }),

  "crewai-deployment": visual({
    concept: b(
      "Ship CrewAI like any Python service: FastAPI in front, Flow or Crew behind, tools below, a database beside",
      "kickoff is often too slow for the request thread — run it as a background job and poll status",
      "Docker, env vars, persistence, and monitoring are the deploy checklist",
      "The frontend talks to your API, not to CrewAI"
    ),
    whyItExists:
      "A notebook kickoff is not a product. Users need auth, a job id, progress, and a place the logs go.",
    analogy:
      "A restaurant: the dining room never walks into the kitchen. A ticket rail sits in between.",
    diagram: pastelChart(
      `flowchart TD
    FE[Frontend] --> API[FastAPI]
    API --> Job[Background job]
    Job --> Flow
    Flow --> Crew
    Crew --> Tools
    Tools --> World[(Web / files)]
    Flow --> Mon[Logs / traces]`,
      `class FE,API,Job hub
    class Flow,Crew,Tools grp1
    class World,Mon grp2`
    ),
    technicalExplanation:
      "POST /jobs starts the crew on a worker. Persist job id. Secrets only in env. One Docker image. CrewAI is a library inside the worker, not a server you expose.",
    example:
      "User types a topic in the app → API enqueues a research crew → UI shows researcher then writer → report.md when the job succeeds.",
    commandsToRemember: [
      "API in front",
      "Crew on a worker",
      "Persist job state",
      "Do not expose CrewAI",
    ],
    revisionNotes: {
      cheatSheet: ["BFF + worker", "Env secrets", "Job id", "Monitor the run"],
    },
    glossary: ["kickoff", "Background job"],
    learnElsewhere: ["AG-UI — Phase 22", "Production — Phase 21", "Build a Research Crew"],
  }),

  "build-crewai-crew": createLesson({
    visualFirst: false,
    practiceTask: "",
    concept: b(
      "This is the only CrewAI module you run on your machine — follow the steps in order",
      "Install tools, create the project, then answer the CLI questions about agents and tasks",
      "AI Research Crew: you type a topic → Researcher investigates → Writer writes report.md",
      "Do not skip the create-wizard questions. Those answers become the agents and tasks"
    ),
    whyItExists:
      "Pasting every file at once does not teach you how to build. This module walks install → create → the CLI questions for agents and tasks → folder → each file → run, in the order you should actually do it.",
    analogy:
      "A two-person newsroom: one reporter gathers facts, one writer files the story. You are the editor who sets up the desk, then hits run.",
    analogyDiagram: pastelChart(
      `flowchart TD
    User([YOU type a topic]) --> R[Researcher agent]
    R --> Data[Research notes]
    Data --> W[Writer agent]
    W --> Report[report.md]`,
      `class User hub
    class R,W grp1
    class Data,Report grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    subgraph Root["WHERE: folder ai_research_crew/"]
        ENV[".env — API key"]
        SRC["src/ai_research_crew/"]
        SRC --> MAIN["main.py — entry"]
        SRC --> CREW["crew.py — wires the crew"]
        SRC --> AG["config/agents.yaml"]
        SRC --> TK["config/tasks.yaml"]
    end`,
      `class Root hub
    class ENV grp1
    class SRC,MAIN,CREW,AG,TK grp2`
    ),
    technicalExplanation:
      "Work in your Mac Terminal. Install Python check, then uv (once on the machine), then the CrewAI CLI (once on the machine). When you run crewai create crew, the CLI stops and asks questions: LLM provider, then how many agents, each agent's role / goal / backstory, then each task's description / expected output. Type the answers in this module — do not press Enter on empty prompts. After the wizard finishes, every later command runs inside ai_research_crew/. Confirm YAML, then crew.py, then main.py. Run last.",
    example:
      "When the app asks Enter a topic to research, type Agentic AI. Researcher fills notes, Writer writes a Markdown report, and report.md appears in the project folder.",
    exampleSolution:
      "If it fails: check python --version is 3.10–3.13, you ran crewai install inside ai_research_crew, and .env has OPENAI_API_KEY. If report.md is missing, writing_task needs output_file: report.md.",
    buildSteps: [
      {
        title: "Check Python is installed",
        where: "Your Mac Terminal — any folder. Do this first, before anything else.",
        body: "CrewAI needs Python 3.10, 3.11, 3.12, or 3.13. Prefer 3.11 or 3.12. If this command fails or shows 3.9, install a newer Python before you continue.",
        command: "python3 --version",
      },
      {
        title: "Install uv (package runner)",
        where: "Same Terminal, still any folder. Install once on this Mac — not inside the project yet.",
        body: "uv is how the official CrewAI setup installs tools. After it finishes, close the terminal tab and open a new one so crewai is on your PATH.",
        command: "curl -LsSf https://astral.sh/uv/install.sh | sh",
      },
      {
        title: "Confirm uv works",
        where: "A fresh Terminal window, any folder.",
        body: "You should see a version number. If 'command not found', the new PATH did not load — open a new terminal and try again.",
        command: "uv --version",
      },
      {
        title: "Install the CrewAI CLI",
        where: "Same Terminal, any folder. Still not inside a project. This installs the crewai command for your user.",
        body: "This is the CrewAI command-line tool. You install it now so the next step can scaffold the folder structure for you.",
        command: "uv tool install crewai",
      },
      {
        title: "Confirm CrewAI CLI works",
        where: "Same Terminal, any folder.",
        body: "You should see a CrewAI version. If this fails, repeat the uv install and open a new terminal.",
        command: "crewai version",
      },
      {
        title: "Create the project folder",
        where: "Pick a parent folder first, for example Documents. cd there, then run create. Stop after this command — do not paste extra lines yet.",
        body: "This command does not finish instantly. The CLI creates the folder, then pauses and asks questions. Stay in this terminal. Do not type cd ai_research_crew until every question is answered, or those extra lines will be used as answers.",
        command: "cd ~/Documents\ncrewai create crew ai_research_crew",
      },
      {
        title: "Answer the LLM provider questions",
        where: "Same Terminal, still inside the create wizard. These questions come first on most CrewAI versions.",
        body: "Pick OpenAI for this project. gpt-4o-mini is enough. You can paste your API key now, or press Enter to skip and add it in .env later. If a question is not shown, skip this step.",
        prompts: [
          {
            ask: "Select a provider to set up (openai, anthropic, gemini, groq, ollama, other)",
            type: "openai",
          },
          {
            ask: "Select a model to use for openai",
            type: "gpt-4o-mini",
          },
        ],
      },
      {
        title: "Answer how many agents, then Agent 1",
        where: "Same Terminal, still in the create wizard. If it never asks about agents, skip ahead — your version scaffolds default YAML instead.",
        body: "This project needs two agents. Agent 1 is the researcher. Role = who they are. Goal = what they try to achieve. Backstory = experience that shapes how they think. Include {topic} so the run prompt can fill it later. Press Enter after each answer.",
        prompts: [
          { ask: "How many agents do you want to create?", type: "2" },
          { ask: "Agent 1 — name (used in YAML / code)", type: "researcher" },
          { ask: "Agent 1 — role", type: "Senior AI Researcher" },
          {
            ask: "Agent 1 — goal",
            type: "Research {topic} and identify the most important, accurate, and useful information about it.",
          },
          {
            ask: "Agent 1 — backstory",
            type: "You are an experienced AI researcher who specializes in analyzing emerging technologies and extracting reliable information from multiple sources.",
          },
        ],
      },
      {
        title: "Answer Agent 2 — the writer",
        where: "Same Terminal, still in the create wizard. This is the second of the two agents.",
        body: "Do not give the writer the same role as the researcher. The writer only turns research notes into a report. If it also asks for tools, LLM, or allow_delegation, leave those blank / default and press Enter.",
        prompts: [
          { ask: "Agent 2 — name", type: "writer" },
          { ask: "Agent 2 — role", type: "Technical Report Writer" },
          {
            ask: "Agent 2 — goal",
            type: "Transform the research findings about {topic} into a clear, structured and useful technical report.",
          },
          {
            ask: "Agent 2 — backstory",
            type: "You are an expert technical writer who can transform complex technical information into concise, understandable documentation.",
          },
        ],
      },
      {
        title: "Answer how many tasks, then Task 1",
        where: "Same Terminal, still in the create wizard. Tasks come after agents.",
        body: "Two tasks, one per agent. Description = what to do. Expected output = what 'done' looks like. Assign Task 1 to researcher. Keep {topic} in the description.",
        prompts: [
          { ask: "How many tasks do you want to create?", type: "2" },
          { ask: "Task 1 — name", type: "research_task" },
          {
            ask: "Task 1 — description",
            type: "Research the topic: {topic}. Investigate the most important concepts, current developments, practical applications, advantages, limitations, and important considerations. Focus on useful and accurate information.",
          },
          {
            ask: "Task 1 — expected output",
            type: "A detailed research document containing: key concepts, important developments, practical applications, advantages, limitations, and important considerations.",
          },
          { ask: "Task 1 — which agent should do this?", type: "researcher" },
        ],
      },
      {
        title: "Answer Task 2 — the report",
        where: "Same Terminal, last questions in the create wizard. After these, the CLI finishes and the folder exists.",
        body: "Assign this task to writer. If it asks for an output file, type report.md — that is how the Markdown file appears after a successful run. If it asks for process, pick sequential.",
        prompts: [
          { ask: "Task 2 — name", type: "writing_task" },
          {
            ask: "Task 2 — description",
            type: "Using the research produced by the researcher, create a comprehensive technical report about {topic}. Organize the report with clear headings and concise explanations.",
          },
          {
            ask: "Task 2 — expected output",
            type: "A polished Markdown report about {topic} containing: Introduction, Key concepts, Current developments, Applications, Advantages, Limitations, and Conclusion.",
          },
          { ask: "Task 2 — which agent should do this?", type: "writer" },
          { ask: "Task 2 — output file (if asked)", type: "report.md" },
          { ask: "Process (if asked): sequential or hierarchical?", type: "sequential" },
        ],
      },
      {
        title: "Enter the project folder",
        where: "Only after the create wizard prints that the project was created and returns you to a normal prompt.",
        body: "Now it is safe to cd. If you cd'd during the questions, the extra text became an agent name or task description — delete that folder and run create again.",
        command: "cd ~/Documents/ai_research_crew",
      },
      {
        title: "Look at the files the CLI created",
        where: "Inside ai_research_crew/ (you should already have cd'd here).",
        body: "You should see .env, pyproject.toml, and src/ai_research_crew/ with main.py, crew.py, config/agents.yaml, config/tasks.yaml, and tools/. Newer CLI versions may create agents/*.jsonc and crew.jsonc instead. Either way, the next steps make the files match this research crew — do not create a second project.",
        command: "ls -la && ls src/ai_research_crew && ls src/ai_research_crew/config",
      },
      {
        title: "Install project dependencies",
        where: "MUST be inside ai_research_crew/ — the folder that contains pyproject.toml. Not your home folder.",
        body: "This downloads the Python packages this crew needs. If you run it in the wrong directory, imports will fail later.",
        command: "crewai install",
      },
      {
        title: "Add your OpenAI API key",
        where: "File: ai_research_crew/.env  (project root, next to pyproject.toml). Never commit this file.",
        body: "Open .env in Cursor. Put your real key on the right of the equals sign. No quotes. Save the file. The crew reads this when it starts — you do not paste the key into Python.",
        file: ".env",
        codeLanguage: "bash",
        code: "OPENAI_API_KEY=sk-your-real-key-here",
      },
      {
        title: "Write the two agents",
        where: "File: src/ai_research_crew/config/agents.yaml — open it and make it match this exactly.",
        body: "If you typed the wizard answers above, this file should already be close. Open it anyway. Role, goal, and backstory must match. {topic} is filled later from main.py. Researcher finds facts. Writer turns facts into a report. Do not give both agents the same role. If the file looks different, replace the whole file.",
        file: "src/ai_research_crew/config/agents.yaml",
        codeLanguage: "yaml",
        code: `researcher:
  role: >
    Senior AI Researcher
  goal: >
    Research {topic} and identify the most important,
    accurate, and useful information about it.
  backstory: >
    You are an experienced AI researcher who specializes
    in analyzing emerging technologies and extracting
    reliable information from multiple sources.

writer:
  role: >
    Technical Report Writer
  goal: >
    Transform the research findings about {topic}
    into a clear, structured and useful technical report.
  backstory: >
    You are an expert technical writer who can transform
    complex technical information into concise,
    understandable documentation.`,
      },
      {
        title: "Write the two tasks",
        where: "File: src/ai_research_crew/config/tasks.yaml — open it and make it match this exactly.",
        body: "If the create wizard asked for task description and expected output, those answers landed here. Confirm agent: researcher and agent: writer match the names in agents.yaml. output_file: report.md is why a Markdown file appears after a successful run. Sequential process will run research_task first, then writing_task. If anything is missing, replace the whole file.",
        file: "src/ai_research_crew/config/tasks.yaml",
        codeLanguage: "yaml",
        code: `research_task:
  description: >
    Research the topic: {topic}.

    Investigate the most important concepts, current
    developments, practical applications, advantages,
    limitations, and important considerations.

    Focus on useful and accurate information.
  expected_output: >
    A detailed research document containing:
    - Key concepts
    - Important developments
    - Practical applications
    - Advantages
    - Limitations
    - Important considerations
  agent: researcher

writing_task:
  description: >
    Using the research produced by the researcher,
    create a comprehensive technical report about {topic}.

    Organize the report with clear headings and concise
    explanations.
  expected_output: >
    A polished Markdown report about {topic} containing:
    - Introduction
    - Key concepts
    - Current developments
    - Applications
    - Advantages
    - Limitations
    - Conclusion
  agent: writer
  output_file: report.md`,
      },
      {
        title: "Wire the crew in Python",
        where: "File: src/ai_research_crew/crew.py — replace the whole file.",
        body: "Do this after YAML, not before. @CrewBase loads those YAML files. Process.sequential means Researcher finishes, then Writer starts with that research. verbose=True prints the loop so you can see it think.",
        file: "src/ai_research_crew/crew.py",
        codeLanguage: "python",
        code: `from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task


@CrewBase
class AiResearchCrew:
    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def researcher(self) -> Agent:
        return Agent(
            config=self.agents_config["researcher"],
            verbose=True,
        )

    @agent
    def writer(self) -> Agent:
        return Agent(
            config=self.agents_config["writer"],
            verbose=True,
        )

    @task
    def research_task(self) -> Task:
        return Task(
            config=self.tasks_config["research_task"],
        )

    @task
    def writing_task(self) -> Task:
        return Task(
            config=self.tasks_config["writing_task"],
        )

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )`,
      },
      {
        title: "Create the entry point",
        where: "File: src/ai_research_crew/main.py — replace the whole file.",
        body: "This is what starts when you run the crew. It asks you for a topic, puts it in inputs['topic'] (that fills {topic} in YAML), then kickoff() runs Researcher then Writer.",
        file: "src/ai_research_crew/main.py",
        codeLanguage: "python",
        code: `from ai_research_crew.crew import AiResearchCrew


def run():
    topic = input("Enter a topic to research: ")

    inputs = {
        "topic": topic
    }

    result = AiResearchCrew().crew().kickoff(inputs=inputs)

    print("\\n\\n==============================")
    print("FINAL RESULT")
    print("==============================\\n")
    print(result)


if __name__ == "__main__":
    run()`,
      },
      {
        title: "Run the crew",
        where: "Terminal, inside ai_research_crew/ (the folder with pyproject.toml). After every file above is saved.",
        body: "Use the official CLI. When it asks, type a topic such as Agentic AI and press Enter. First run can take a minute while models load. Watch Researcher, then Writer.",
        command: "crewai run",
      },
      {
        title: "If the CLI run fails, run main.py directly",
        where: "Still inside ai_research_crew/.",
        body: "Same crew, different starter. You should still be prompted for a topic.",
        command: "python src/ai_research_crew/main.py",
      },
      {
        title: "Find the report",
        where: "Project root ai_research_crew/ — same folder you ran the command from.",
        body: "Because writing_task has output_file: report.md, a Markdown file should appear after the writer finishes. Open it in Cursor. That is the finished sequential crew: topic in, report out.",
        command: "ls -la report.md && head -20 report.md",
      },
      {
        title: "Optional next — give the researcher a tool",
        where: "Same project, after the basic crew already runs. Do not start here.",
        body: "The version you just ran is multi-agent orchestration. To make the researcher actually agentic, attach a web search tool so the loop becomes think → search_web() → observe → think again. Add that only after report.md is working.",
      },
    ],
    commandsToRemember: [
      "python3 --version  # do this first, anywhere",
      "uv tool install crewai  # once on this Mac",
      "cd ~/Documents && crewai create crew ai_research_crew  # then answer the wizard — do not cd yet",
      "cd ~/Documents/ai_research_crew  # only after the create questions finish",
      "crewai install  # inside the project folder only",
      "crewai run  # inside the project folder, after files are saved",
    ],
    commonMistakes: [
      "Running crewai install from your home folder instead of ai_research_crew/",
      "Pasting cd ai_research_crew while the create wizard is still asking questions — those lines become agent/task answers",
      "Skipping the create-wizard questions for agent role, goal, backstory, and task description",
      "Editing YAML before the project exists — always create crew first, answer the questions, then edit",
      "Python 3.9 or 3.14+",
      "Committing .env with the API key",
      "Forgetting process=Process.sequential so the writer never sees the research",
      "No output_file on writing_task, so report.md never appears",
    ],
    revisionNotes: {
      cheatSheet: [
        "Install uv + crewai on the Mac first",
        "Then create the project folder",
        "Then answer provider + 2 agents + 2 tasks in the wizard",
        "Then cd into the folder",
        "Then crewai install inside it",
        "Then .env, then YAML, then crew.py, then main.py",
        "Then crewai run → report.md",
      ],
    },
    glossary: ["CrewBase", "kickoff", "Process.sequential", "output_file", "uv", "role", "goal", "backstory"],
    learnElsewhere: ["What is CrewAI", "Tasks", "Tools", "Processes"],
    furtherReading: [
      { title: "CrewAI documentation", url: "https://docs.crewai.com/" },
      { title: "crewAIInc/crewAI", url: "https://github.com/crewAIInc/crewAI" },
    ],
  }),
};
