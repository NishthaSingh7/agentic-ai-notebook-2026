import type { LessonContent } from "../lesson-types";
import { createLesson, iq } from "./builder";

export const phase6Lessons: Record<string, LessonContent> = {
  langgraph: createLesson({
    concept:
      "LangGraph is a low-level orchestration framework for building stateful, multi-actor agent applications as directed graphs — where nodes are functions, edges define control flow, and shared state persists across steps.",
    whyItExists:
      "Simple agent loops break down for complex workflows: branching logic, parallel execution, human approval gates, persistent state, and multi-agent coordination. LangGraph provides graph-based orchestration with cycles, conditional routing, checkpointing, and first-class state management — the production backbone for serious agent systems.",
    analogy:
      "LangGraph is like a flowchart engine for agents — instead of a single while-loop, you draw the decision tree: 'if search succeeds, go to summarize; if it fails, go to fallback; always checkpoint before sending email.'",
    technicalExplanation:
      "Core concepts: (1) StateGraph — typed state object passed between nodes. (2) Nodes — Python functions that read/write state. (3) Edges — fixed or conditional transitions between nodes. (4) Checkpointer — persists state to SQLite/Postgres for crash recovery and human-in-the-loop. (5) Subgraphs — nested graphs for modular agents. (6) Send API — dynamic fan-out to parallel nodes. Production patterns: supervisor agent routes to specialist subgraphs, human-in-the-loop via interrupt(), streaming with astream(), and LangSmith integration for tracing. LangGraph is the orchestration layer; LangChain provides tools and integrations.",
    architecture:
      "StateGraph(AgentState) → add_node('planner', plan) → add_node('executor', execute) → add_node('reviewer', review) → add_conditional_edges('executor', should_continue) → compile(checkpointer=MemorySaver()) → invoke/astream.",
    diagram: `flowchart TD
    START([Start]) --> P[Planner Node]
    P --> E[Executor Node]
    E --> C{should_continue?}
    C -->|Yes| E
    C -->|Review| R[Reviewer Node]
    C -->|Done| END([End])
    R -->|Approve| END
    R -->|Revise| E
  subgraph State["Shared AgentState"]
    S1[messages]
    S2[plan]
    S3[tool_results]
  end
    P -.-> State
    E -.-> State
    R -.-> State`,
    example:
      "Customer support agent: classify ticket → route to billing/technical subgraph → execute tools → human review for refunds > $500 → send response. LangGraph manages state across all nodes with checkpoint recovery if the server restarts mid-ticket.",
    code: `from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    plan: list[str]
    iteration: int

def planner(state: AgentState) -> dict:
    # generate plan steps
    return {"plan": ["search", "summarize", "respond"], "iteration": 0}

def executor(state: AgentState) -> dict:
    step = state["plan"][state["iteration"]]
    # execute current step
    return {"iteration": state["iteration"] + 1}

def should_continue(state: AgentState) -> str:
    if state["iteration"] >= len(state["plan"]):
        return "done"
    return "continue"

graph = StateGraph(AgentState)
graph.add_node("planner", planner)
graph.add_node("executor", executor)
graph.add_conditional_edges("executor", should_continue, {"continue": "executor", "done": END})
graph.add_edge(START, "planner")
graph.add_edge("planner", "executor")

app = graph.compile(checkpointer=MemorySaver())
result = app.invoke({"messages": [("user", "Research AI trends")]}, config={"configurable": {"thread_id": "1"}})`,
    project:
      "Build a multi-node LangGraph agent with planner, executor, and human-review nodes. Add checkpointing, conditional routing, and streaming. Deploy with a FastAPI endpoint.",
    interviewQuestions: [
      iq("LangGraph vs a simple agent while-loop — when to use LangGraph?", "Use LangGraph when you need: branching logic, parallel nodes, human-in-the-loop interrupts, persistent state across sessions, multi-agent coordination, or crash recovery via checkpointing. Simple loops suffice for basic tool-calling agents.", "medium"),
      iq("What is checkpointing in LangGraph?", "Saves graph state after each node execution to SQLite/Postgres. Enables: crash recovery (resume mid-workflow), human-in-the-loop (pause, wait for approval, resume), and time-travel debugging (replay from any checkpoint).", "hard"),
      iq("How does conditional routing work?", "add_conditional_edges(node, routing_function, path_map) — routing function reads state and returns the next node name. Enables dynamic branching: route to different specialists based on query type, or loop back on failure.", "easy"),
    ],
    revisionNotes: {
      fiveMin: ["LangGraph = stateful agent orchestration as graphs", "Nodes=functions, Edges=transitions, State=shared data", "Checkpointing for crash recovery + human-in-loop", "Conditional edges for dynamic routing"],
      fifteenMin: ["StateGraph with typed AgentState", "add_node, add_edge, add_conditional_edges", "MemorySaver/PostgresSaver for checkpointing", "interrupt() for human approval gates", "Subgraphs for modular multi-agent systems", "astream() for real-time step streaming"],
      oneHour: ["Multi-node graph with planner+executor+reviewer", "Conditional routing based on state", "Checkpointing with thread_id", "Human-in-the-loop interrupt pattern", "Subgraph for specialist agents", "FastAPI deployment with streaming"],
      cheatSheet: ["StateGraph + typed state", "Conditional edges for branching", "Checkpointer = crash recovery", "interrupt() = human approval", "thread_id = session persistence", "LangSmith for tracing"],
    },
    glossary: ["LangGraph", "StateGraph", "Checkpointing", "Conditional Edge", "Subgraph", "Human-in-the-Loop"],
    commonMistakes: [
      "Using LangGraph for simple single-loop agents — over-engineering",
      "Untyped state — bugs from missing fields",
      "No checkpointing in production — lose state on crash",
      "Monolithic graph instead of subgraphs for complex systems",
      "Not using thread_id — can't resume sessions",
    ],
  }),

  "openai-agents-sdk": createLesson({
    concept:
      "The OpenAI Agents SDK is OpenAI's official framework for building multi-agent workflows with agents, handoffs, guardrails, and tracing — designed for production agent systems on OpenAI models.",
    whyItExists:
      "Building agents on raw chat completions requires manual loop management, tool routing, and guardrails. The Agents SDK provides primitives — Agent, Runner, Handoff, Guardrail — that handle orchestration, letting developers focus on agent logic and tool design.",
    analogy:
      "The Agents SDK is like a call center management system — it routes calls between departments (handoffs), enforces scripts (guardrails), and logs every interaction (tracing), while agents focus on solving problems.",
    technicalExplanation:
      "Core primitives: (1) Agent — LLM + instructions + tools + handoffs. (2) Runner — executes agent loop with max_turns. (3) Handoff — transfer control to another agent with context. (4) Guardrail — input/output validation functions. (5) Tracing — built-in OpenAI dashboard integration. Patterns: triage agent routes to specialists, pipeline of agents (research → write → review), and guardrails for PII/safety. Production: async Runner.run(), structured outputs via Pydantic, MCP tool integration, and streaming with Runner.run_streamed().",
    architecture:
      "Triage Agent → Handoff → [Research Agent | Writing Agent | Code Agent] → Guardrails (input/output) → Runner orchestrates turns → Tracing logs all steps.",
    diagram: `flowchart TD
    U[User Input] --> G1[Input Guardrail]
    G1 --> T[Triage Agent]
    T -->|Technical| TA[Tech Support Agent]
    T -->|Billing| BA[Billing Agent]
    T -->|General| GA[General Agent]
    TA --> G2[Output Guardrail]
    BA --> G2
    GA --> G2
    G2 --> R[Response]
  subgraph Tracing
    TR[OpenAI Traces Dashboard]
  end
    T -.-> Tracing
    TA -.-> Tracing`,
    example:
      "Customer service system: triage agent classifies query → handoffs to billing agent (has payment tools) or tech agent (has diagnostic tools). Input guardrail blocks PII. Output guardrail ensures professional tone. All steps traced in OpenAI dashboard.",
    code: `from agents import Agent, Runner, handoff, GuardrailFunctionOutput
from agents import input_guardrail, output_guardrail

@input_guardrail
async def pii_guardrail(ctx, agent, input):
    if contains_pii(input):
        return GuardrailFunctionOutput(tripwire_triggered=True, output_info="PII detected")
    return GuardrailFunctionOutput(tripwire_triggered=False)

billing_agent = Agent(
    name="Billing Agent",
    instructions="Handle billing inquiries. Use payment tools.",
    tools=[check_balance, process_refund],
)

tech_agent = Agent(
    name="Tech Agent",
    instructions="Diagnose technical issues. Use diagnostic tools.",
    tools=[run_diagnostic, check_status],
)

triage_agent = Agent(
    name="Triage",
    instructions="Classify the query and hand off to the right specialist.",
    handoffs=[billing_agent, tech_agent],
    input_guardrails=[pii_guardrail],
)

result = await Runner.run(triage_agent, "I was charged twice for my subscription")`,
    project:
      "Build a 3-agent system with triage, specialist, and review agents. Add input/output guardrails, handoffs, and trace all interactions in the OpenAI dashboard.",
    interviewQuestions: [
      iq("What is a handoff in the OpenAI Agents SDK?", "Transferring control from one agent to another with full conversation context. The receiving agent gets the history and continues the task with its own tools and instructions. Enables specialist agent architectures.", "easy"),
      iq("How do guardrails work in the SDK?", "Functions that run before (input) or after (output) agent execution. Return tripwire_triggered=True to block the request. Use for PII detection, content safety, output format validation, and policy enforcement.", "medium"),
      iq("OpenAI Agents SDK vs LangGraph — when to use each?", "Agents SDK: simpler, OpenAI-native, great for handoff-based multi-agent. LangGraph: more control, graph-based routing, checkpointing, provider-agnostic. Use Agents SDK for OpenAI-only; LangGraph for complex stateful workflows.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["Agents SDK: Agent + Runner + Handoff + Guardrail", "Handoff = transfer to specialist agent", "Guardrails validate input/output", "Built-in tracing in OpenAI dashboard"],
      fifteenMin: ["Agent = instructions + tools + handoffs", "Runner.run() with max_turns", "Input guardrails block bad requests", "Output guardrails validate responses", "Triage → specialist pattern", "Async execution with Runner.run()"],
      oneHour: ["3-agent system with handoffs", "Input/output guardrail implementation", "Triage routing to specialists", "Tracing dashboard walkthrough", "MCP tool integration", "Streaming with run_streamed()"],
      cheatSheet: ["Agent + Runner + Handoff", "Guardrails = input/output validation", "Triage → specialist pattern", "max_turns on Runner", "Built-in tracing", "Pydantic structured outputs"],
    },
    glossary: ["OpenAI Agents SDK", "Handoff", "Guardrail", "Runner", "Triage Agent", "Tracing"],
    commonMistakes: [
      "Too many handoffs — latency and context loss",
      "No guardrails on production agents",
      "Not using tracing — can't debug multi-agent flows",
      "Monolithic agent instead of specialist handoffs",
      "Ignoring max_turns — runaway agent loops",
    ],
  }),

  "google-adk": createLesson({
    concept:
      "Google's Agent Development Kit (ADK) is a framework for building, evaluating, and deploying AI agents on Google Cloud — with native Gemini integration, built-in tools, and Vertex AI deployment.",
    whyItExists:
      "Teams on Google Cloud need agent frameworks that integrate with Vertex AI, BigQuery, Cloud Run, and Gemini models natively. ADK provides the scaffolding — agent definitions, tool bindings, evaluation, and deployment — optimized for the Google ecosystem.",
    analogy:
      "Google ADK is like Android for agents — if you're already in the Google ecosystem (Gemini, Vertex, GCP), it provides the native SDK that integrates seamlessly with your existing infrastructure.",
    technicalExplanation:
      "ADK components: (1) Agent — Gemini-powered with system instructions and tool declarations. (2) Tools — built-in (Google Search, Code Execution, Vertex AI Search) and custom function tools. (3) Session — manages conversation state across turns. (4) Runner — executes agent loop. (5) Evaluation — built-in eval framework for agent quality. (6) Deployment — Cloud Run, Vertex AI Agent Engine. Patterns: single agent with Google tools, multi-agent with agent transfer, and RAG agents with Vertex AI Search grounding.",
    architecture:
      "User → ADK Agent (Gemini) → Tool Layer [Google Search | Vertex AI Search | Custom Functions | Code Execution] → Session State → Response. Deployed on Vertex AI Agent Engine or Cloud Run.",
    diagram: `flowchart TD
    U[User] --> A[ADK Agent\\nGemini Model]
    A --> T{Tool Selection}
    T --> GS[Google Search]
    T --> VS[Vertex AI Search]
    T --> CE[Code Execution]
    T --> CT[Custom Tools]
    GS --> S[Session State]
    VS --> S
    CE --> S
    CT --> S
    S --> A
    A --> R[Response]
  subgraph GCP["Google Cloud"]
    VE[Vertex AI Agent Engine]
    CR[Cloud Run]
  end
    A -.-> GCP`,
    example:
      "Enterprise knowledge agent on ADK: user asks about company policy → agent uses Vertex AI Search (grounded on internal docs) → Gemini generates answer with citations → deployed on Vertex AI Agent Engine with auto-scaling.",
    code: `from google.adk.agents import Agent
from google.adk.tools import google_search, vertex_ai_search
from google.adk.runners import Runner

agent = Agent(
    name="enterprise_assistant",
    model="gemini-2.0-flash",
    instruction="You are an enterprise assistant. Use Vertex AI Search for company docs.",
    tools=[vertex_ai_search, google_search],
)

runner = Runner(agent=agent)
response = runner.run(
    session_id="user-123",
    message="What is our remote work policy?",
)`,
    project:
      "Build an ADK agent with Vertex AI Search grounding on your document corpus. Deploy to Cloud Run and evaluate answer quality with the built-in eval framework.",
    interviewQuestions: [
      iq("What advantages does ADK have for Google Cloud users?", "Native Gemini integration, built-in Google Search and Vertex AI Search tools, Vertex AI Agent Engine deployment, BigQuery tool access, and unified GCP billing/monitoring.", "medium"),
      iq("How does Vertex AI Search grounding work in ADK?", "Agent calls Vertex AI Search tool → retrieves relevant enterprise documents → Gemini generates answer grounded in retrieved context with citations. Built-in RAG without custom pipeline.", "easy"),
      iq("ADK vs LangGraph for Google Cloud deployments?", "ADK: simpler, Gemini-native, built-in Google tools, Vertex deployment. LangGraph: more flexible orchestration, provider-agnostic, complex graph workflows. Use ADK for Gemini-first GCP apps; LangGraph for complex multi-provider orchestration.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["ADK = Google's agent framework for Gemini + GCP", "Built-in tools: Google Search, Vertex AI Search", "Session state across turns", "Deploy on Vertex AI Agent Engine"],
      fifteenMin: ["Agent = Gemini + instructions + tools", "Vertex AI Search for enterprise RAG", "Built-in evaluation framework", "Cloud Run or Agent Engine deployment", "Multi-agent with agent transfer", "Code execution tool for data analysis"],
      oneHour: ["ADK agent with Vertex AI Search", "Custom tool integration", "Session management across turns", "Built-in eval framework run", "Cloud Run deployment", "Multi-agent transfer pattern"],
      cheatSheet: ["Gemini-native agent framework", "Vertex AI Search = built-in RAG", "Session state management", "Agent Engine deployment", "Built-in eval framework", "Google Search tool included"],
    },
    glossary: ["Google ADK", "Vertex AI Search", "Gemini", "Agent Engine", "Grounding", "Session State"],
    commonMistakes: [
      "Using ADK outside Google Cloud — ecosystem lock-in",
      "Not leveraging Vertex AI Search for enterprise RAG",
      "Ignoring built-in evaluation framework",
      "No session management — stateless agent calls",
      "Over-customizing when built-in tools suffice",
    ],
  }),

  crewai: createLesson({
    concept:
      "CrewAI is a multi-agent orchestration framework where you define autonomous AI agents with roles, goals, and tools — then organize them into a Crew that collaborates on complex tasks through sequential or hierarchical processes.",
    whyItExists:
      "Complex tasks need specialized expertise — a researcher, writer, and editor working together. CrewAI makes multi-agent collaboration declarative: define agents by role, assign tasks, and let the crew execute with built-in delegation, memory, and process management.",
    analogy:
      "CrewAI is like assembling a film crew — director (manager), cinematographer (researcher), screenwriter (writer) — each with a defined role, collaborating to produce the final movie.",
    technicalExplanation:
      "Core concepts: (1) Agent — role, goal, backstory, tools, LLM. (2) Task — description, expected output, assigned agent. (3) Crew — agents + tasks + process (sequential/hierarchical). (4) Process — sequential (tasks in order) or hierarchical (manager delegates). (5) Memory — short-term, long-term, entity memory built-in. Production: async kickoff, output parsing (Pydantic), callbacks for monitoring, and CrewAI+ for enterprise features. Agents can delegate sub-tasks to each other within hierarchical process.",
    architecture:
      "Crew(agents=[researcher, writer, editor], tasks=[research_task, write_task, edit_task], process=sequential) → kickoff() → each agent executes its task → context flows between tasks → final output.",
    diagram: `flowchart TD
    subgraph Crew["Crew: Content Pipeline"]
      R[Researcher Agent\\nTools: search, scrape]
      W[Writer Agent\\nTools: none]
      E[Editor Agent\\nTools: grammar_check]
    end
    T1[Task: Research topic] --> R
    R -->|context| T2[Task: Write article]
    T2 --> W
    W -->|context| T3[Task: Edit and polish]
    T3 --> E
    E --> OUT[Final Article]
  subgraph Memory
    STM[Short-Term]
    LTM[Long-Term]
    EM[Entity]
  end
    R -.-> Memory`,
    example:
      "Content crew: Researcher agent searches and summarizes AI trends → Writer agent drafts a blog post using research → Editor agent polishes grammar and tone. Sequential process, each task receives prior task output as context.",
    code: `from crewai import Agent, Task, Crew, Process

researcher = Agent(
    role="Senior Researcher",
    goal="Find comprehensive information on AI trends",
    backstory="Expert researcher with 10 years in tech journalism",
    tools=[search_tool, scrape_tool],
    verbose=True,
)

writer = Agent(
    role="Content Writer",
    goal="Write engaging, accurate blog posts",
    backstory="Award-winning tech blogger",
    verbose=True,
)

research_task = Task(
    description="Research the top 5 AI trends in 2025",
    expected_output="Detailed research report with sources",
    agent=researcher,
)

write_task = Task(
    description="Write a 1000-word blog post based on the research",
    expected_output="Polished blog post in markdown",
    agent=writer,
    context=[research_task],
)

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential,
    memory=True,
)

result = crew.kickoff()`,
    project:
      "Build a 3-agent Crew (researcher, analyst, presenter) that produces a market analysis report. Use sequential process, task context passing, and built-in memory.",
    interviewQuestions: [
      iq("Sequential vs hierarchical process in CrewAI?", "Sequential: tasks execute in order, each gets prior output as context. Hierarchical: manager agent delegates tasks to workers dynamically. Sequential for pipelines; hierarchical for complex delegation.", "medium"),
      iq("How does task context work?", "context=[previous_task] passes the output of previous tasks to the current task's agent. Builds cumulative knowledge through the crew pipeline without manual state management.", "easy"),
      iq("CrewAI vs LangGraph for multi-agent systems?", "CrewAI: role-based, declarative, fast to prototype, built-in memory. LangGraph: graph-based, more control, checkpointing, provider-agnostic. CrewAI for role-based teams; LangGraph for complex conditional workflows.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["CrewAI = role-based multi-agent collaboration", "Agent = role + goal + backstory + tools", "Crew = agents + tasks + process", "Sequential or hierarchical execution"],
      fifteenMin: ["Task context passes output between agents", "Process.sequential for pipelines", "Process.hierarchical for delegation", "Built-in short/long/entity memory", "Pydantic output parsing", "Async kickoff for production"],
      oneHour: ["3-agent crew with sequential process", "Task context chaining", "Hierarchical process with manager", "Built-in memory across sessions", "Output parsing with Pydantic", "Monitoring callbacks"],
      cheatSheet: ["Agent = role + goal + tools", "Task = description + expected_output", "context=[prev_task]", "Process.sequential | hierarchical", "memory=True", "crew.kickoff()"],
    },
    glossary: ["CrewAI", "Crew", "Agent Role", "Task Context", "Hierarchical Process", "Delegation"],
    commonMistakes: [
      "Too many agents for simple tasks — coordination overhead",
      "Not using task context — agents lack prior work",
      "Vague expected_output — agents produce inconsistent results",
      "Hierarchical process when sequential suffices",
      "No output parsing — unstructured agent outputs",
    ],
  }),

  autogen: createLesson({
    concept:
      "AutoGen is Microsoft's framework for building multi-agent conversational systems — where agents communicate through message passing to collaboratively solve tasks, with support for code execution, human proxies, and group chat orchestration.",
    whyItExists:
      "Some problems are best solved through agent conversation — a coder and reviewer discussing solutions, or a team debating approaches. AutoGen models agents as conversable entities that exchange messages, enabling emergent collaboration patterns beyond rigid pipelines.",
    analogy:
      "AutoGen is like a group chat where each participant is an AI specialist — they discuss, debate, and build on each other's messages until the problem is solved.",
    technicalExplanation:
      "Core concepts: (1) ConversableAgent — base class with send/receive message. (2) AssistantAgent — LLM-powered agent. (3) UserProxyAgent — represents human or executes code. (4) GroupChat — multiple agents in a shared conversation with a manager. (5) Code execution — agents write and run code in sandboxed environments. AutoGen v0.4 (AG2) restructured around async, event-driven architecture. Patterns: two-agent coding (assistant + executor), group chat brainstorming, and sequential chat with handoff.",
    architecture:
      "UserProxy → GroupChatManager → [Agent₁ ↔ Agent₂ ↔ Agent₃] → message passing → termination condition → final result. Code execution via UserProxyAgent with Docker sandbox.",
    diagram: `flowchart TD
    U[UserProxyAgent] --> GC[GroupChatManager]
    GC --> A1[Coder Agent]
    GC --> A2[Reviewer Agent]
    GC --> A3[Tester Agent]
    A1 -->|message| A2
    A2 -->|feedback| A1
    A1 -->|code| UP[Code Execution\\nDocker Sandbox]
    UP -->|output| A3
    A3 -->|test results| GC
    GC -->|terminate| R[Final Solution]`,
    example:
      "Coding task: UserProxy sends 'build a REST API for todos.' Coder agent writes code → UserProxy executes in Docker → Tester agent writes tests → Reviewer agent checks quality → iterate until tests pass.",
    code: `from autogen import AssistantAgent, UserProxyAgent, GroupChat, GroupChatManager

coder = AssistantAgent(
    name="coder",
    system_message="You are a Python developer. Write clean, tested code.",
    llm_config={"model": "gpt-4o"},
)

reviewer = AssistantAgent(
    name="reviewer",
    system_message="You review code for bugs, security, and best practices.",
    llm_config={"model": "gpt-4o"},
)

user_proxy = UserProxyAgent(
    name="user",
    human_input_mode="NEVER",
    code_execution_config={"work_dir": "output", "use_docker": True},
)

group_chat = GroupChat(agents=[coder, reviewer, user_proxy], messages=[], max_round=10)
manager = GroupChatManager(groupchat=group_chat, llm_config={"model": "gpt-4o"})

user_proxy.initiate_chat(manager, message="Build a FastAPI todo app with tests")`,
    project:
      "Build a 3-agent AutoGen group chat (coder, reviewer, tester) that collaboratively builds and tests a Python module. Use Docker sandbox for code execution.",
    interviewQuestions: [
      iq("What is a UserProxyAgent?", "An agent that can represent the human (requesting input) or execute code on behalf of other agents. Bridges the gap between LLM agents and the real world — running code, calling APIs, getting human approval.", "easy"),
      iq("GroupChat vs sequential agent pipeline?", "GroupChat: agents converse freely, manager decides who speaks next — emergent collaboration. Sequential: fixed order, predictable. GroupChat for creative/brainstorming; sequential for production pipelines.", "medium"),
      iq("How does code execution work in AutoGen?", "UserProxyAgent runs code in a Docker sandbox (or local work_dir). Coder agent writes code in messages → UserProxy extracts and executes → returns output to the group. Isolated execution prevents system damage.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["AutoGen = multi-agent conversation framework", "Agents communicate via message passing", "UserProxyAgent executes code + represents human", "GroupChat for collaborative problem-solving"],
      fifteenMin: ["ConversableAgent base class", "AssistantAgent = LLM-powered", "GroupChatManager selects next speaker", "Docker sandbox for code execution", "max_round limits conversation length", "AG2 (v0.4) = async event-driven"],
      oneHour: ["3-agent group chat for coding", "Docker code execution sandbox", "Coder + reviewer collaboration", "GroupChatManager orchestration", "Termination conditions", "AG2 async migration patterns"],
      cheatSheet: ["ConversableAgent + message passing", "UserProxyAgent = code execution", "GroupChat + Manager", "Docker sandbox required", "max_round = termination", "AG2 for async production"],
    },
    glossary: ["AutoGen", "ConversableAgent", "UserProxyAgent", "GroupChat", "Code Execution", "AG2"],
    commonMistakes: [
      "No max_round — agents converse indefinitely",
      "Code execution without Docker sandbox",
      "GroupChat for simple sequential tasks — overkill",
      "Not defining clear system messages per agent",
      "Ignoring AG2 migration for new projects",
    ],
  }),

  "pydantic-ai": createLesson({
    concept:
      "PydanticAI is a Python agent framework built by the Pydantic team — combining type-safe agent definitions, structured outputs, dependency injection, and model-agnostic LLM support in a clean, Pythonic API.",
    whyItExists:
      "Most agent frameworks treat type safety as an afterthought. PydanticAI brings Pydantic's validation philosophy to agents — typed dependencies, structured results, and compile-time-like safety that catches errors before runtime. Built for developers who want robust, testable agent code.",
    analogy:
      "PydanticAI is like TypeScript for agents — you define exactly what goes in and what comes out, and the framework catches mismatches before they become production bugs.",
    technicalExplanation:
      "Core features: (1) Agent — generic over dependency and output types. (2) Dependencies — typed deps injected via RunContext (database, API clients, config). (3) Structured output — Pydantic models as return types. (4) Tools — @agent.tool decorated functions with typed params. (5) Model-agnostic — OpenAI, Anthropic, Gemini, Ollama. (6) Testing — TestModel and FunctionModel for unit tests without API calls. Production: async-first, streaming, retry logic, and usage tracking built-in.",
    architecture:
      "Agent(deps_type=MyDeps, output_type=MyResult) → @agent.tool functions access RunContext[MyDeps] → agent.run(prompt, deps=deps) → validated MyResult.",
    diagram: `flowchart TD
    U[User Prompt] --> A[PydanticAI Agent]
    D[Dependencies\\nDB, Config, APIs] --> A
    A --> LLM[Model Agnostic LLM]
    LLM --> TC{Tool Call?}
    TC -->|Yes| T["@agent.tool\\nTyped Params"]
    T -->|RunContext deps| A
    TC -->|No| OV[Output Validator\\nPydantic Model]
    OV --> R[Typed Result]`,
    example:
      "Support agent with typed deps (database, config) returns a structured SupportResponse (answer, confidence, suggested_actions). Tools access the database via RunContext. Tests use FunctionModel — no API calls needed.",
    code: `from pydantic_ai import Agent, RunContext
from pydantic import BaseModel
from dataclasses import dataclass

@dataclass
class SupportDeps:
    db: DatabaseConn
    customer_id: str

class SupportResponse(BaseModel):
    answer: str
    confidence: float
    suggested_actions: list[str]

agent = Agent(
    "openai:gpt-4o",
    deps_type=SupportDeps,
    output_type=SupportResponse,
    system_prompt="You are a helpful support agent.",
)

@agent.tool
async def lookup_order(ctx: RunContext[SupportDeps], order_id: str) -> dict:
    return await ctx.deps.db.get_order(ctx.deps.customer_id, order_id)

result = await agent.run(
    "Where is my order #12345?",
    deps=SupportDeps(db=db, customer_id="cust_1"),
)
print(result.output.answer)  # typed SupportResponse`,
    project:
      "Build a type-safe agent with PydanticAI: typed dependencies (database), structured output (Pydantic model), 3 tools, and unit tests using FunctionModel — no API calls in tests.",
    interviewQuestions: [
      iq("What advantage does PydanticAI's type system provide?", "Dependencies, tool params, and outputs are all typed. IDE autocomplete, static analysis, and runtime validation catch errors early. Tests use mock models without API calls.", "easy"),
      iq("How does dependency injection work?", "Define a deps dataclass (db, config, etc.). Pass to agent.run(deps=...). Tools access via RunContext[DepsType].deps. Clean separation of agent logic from infrastructure.", "medium"),
      iq("PydanticAI vs LangChain/LangGraph?", "PydanticAI: type-safe, lightweight, great for single agents with structured outputs. LangGraph: complex multi-agent orchestration, graph workflows. Use PydanticAI for typed, testable agents; LangGraph for complex orchestration.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["PydanticAI = type-safe agent framework", "Typed deps, tools, and outputs", "Model-agnostic: OpenAI, Anthropic, Gemini", "FunctionModel for testing without API calls"],
      fifteenMin: ["Agent(deps_type, output_type)", "RunContext[Deps] in tools", "Pydantic models as structured output", "@agent.tool decorator", "async-first design", "TestModel/FunctionModel for unit tests"],
      oneHour: ["Typed agent with deps + output model", "3 tools with RunContext access", "Unit tests with FunctionModel", "Streaming responses", "Multi-model support (OpenAI + Anthropic)", "Error handling and retry logic"],
      cheatSheet: ["deps_type + output_type", "RunContext[Deps].deps", "@agent.tool decorator", "Pydantic output models", "FunctionModel for tests", "Model string: 'openai:gpt-4o'"],
    },
    glossary: ["PydanticAI", "RunContext", "Dependency Injection", "Structured Output", "FunctionModel", "Type Safety"],
    commonMistakes: [
      "Untyped deps — loses the main benefit",
      "Not using structured output — parsing strings manually",
      "Testing against real APIs instead of FunctionModel",
      "Using PydanticAI for complex multi-agent orchestration",
      "Ignoring async — framework is async-first",
    ],
  }),

  "semantic-kernel": createLesson({
    concept:
      "Semantic Kernel is Microsoft's open-source SDK for integrating LLMs into applications — providing plugins, planners, memory, and connectors in a model-agnostic framework optimized for enterprise .NET and Python deployments.",
    whyItExists:
      "Enterprise teams need a production-grade framework that integrates with existing Microsoft ecosystems (Azure OpenAI, Cosmos DB, Entra ID) while supporting multiple languages (.NET, Python, Java). Semantic Kernel provides the plugin architecture, planning, and memory abstractions for enterprise agent development.",
    analogy:
      "Semantic Kernel is like an enterprise service bus for AI — it connects LLMs to your existing systems through standardized plugins, with the governance and integration patterns enterprises require.",
    technicalExplanation:
      "Core concepts: (1) Kernel — central orchestrator connecting AI services, plugins, and memory. (2) Plugins — reusable functions (native code + semantic prompts) that agents invoke. (3) Planners — automatic function selection and sequencing (Handlebars, Stepwise). (4) Memory — volatile and persistent memory stores with semantic recall. (5) Connectors — OpenAI, Azure OpenAI, Hugging Face, local models. (6) Filters — middleware for logging, safety, and authorization. Enterprise features: Entra ID auth, responsible AI filters, telemetry via Application Insights, and Process Framework for long-running workflows.",
    architecture:
      "Kernel → [AI Service | Plugins (native + prompt) | Memory | Planners] → Filter Pipeline (auth, logging, safety) → Response. Process Framework for durable multi-step workflows with external events.",
    diagram: `flowchart TD
    U[User Request] --> K[Semantic Kernel]
    K --> P[Planner\\nHandlebars/Stepwise]
    P --> PL[Plugin Selection]
    PL --> NP[Native Plugins\\nC# / Python functions]
    PL --> SP[Semantic Plugins\\nPrompt templates]
    NP --> M[Memory Store\\nCosmos DB / Volatile]
    SP --> M
    K --> F[Filter Pipeline]
    F --> AI[AI Service\\nAzure OpenAI]
    AI --> R[Response]
  subgraph Enterprise
    AUTH[Entra ID Auth]
    RAI[Responsible AI Filters]
    TELE[App Insights Telemetry]
  end
    F -.-> Enterprise`,
    example:
      "Enterprise HR bot on Semantic Kernel: user asks about benefits → planner selects BenefitsPlugin → native function queries HR database → semantic plugin formats response → responsible AI filter checks output → Entra ID validates user access → response with telemetry logged.",
    code: `from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion
from semantic_kernel.functions import kernel_function
from semantic_kernel.planning import HandlebarsPlanner

kernel = Kernel()
kernel.add_service(AzureChatCompletion(
    deployment_name="gpt-4o",
    endpoint="https://your-endpoint.openai.azure.com",
))

class HRPlugin:
    @kernel_function(name="get_benefits", description="Get employee benefits info")
    def get_benefits(self, employee_id: str) -> str:
        return hr_database.query(employee_id)

kernel.add_plugin(HRPlugin(), plugin_name="hr")

planner = HandlebarsPlanner(service_id="gpt-4o")
plan = await planner.create_plan("What are my health benefits?", kernel)
result = await plan.invoke(kernel)`,
    project:
      "Build a Semantic Kernel agent with 3 plugins (native + semantic), Handlebars planner, memory store, and responsible AI filter. Deploy on Azure with Entra ID authentication.",
    interviewQuestions: [
      iq("Native plugins vs semantic plugins?", "Native: C#/Python functions with @kernel_function — call APIs, databases, business logic. Semantic: prompt templates that use LLM directly. Combine both: native for data access, semantic for language tasks.", "easy"),
      iq("What is the Process Framework?", "Durable workflow engine for long-running, event-driven agent processes. Steps can wait for external events (human approval, API callback). Built on Durable Task Framework — survives restarts.", "hard"),
      iq("Semantic Kernel vs LangGraph?", "Semantic Kernel: enterprise Microsoft ecosystem, plugin architecture, .NET + Python, Azure integration. LangGraph: graph-based orchestration, Python-first, provider-agnostic. SK for Azure enterprise; LangGraph for flexible Python orchestration.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["Semantic Kernel = enterprise AI orchestration SDK", "Kernel connects AI + plugins + memory + planners", "Native plugins (code) + semantic plugins (prompts)", "Azure OpenAI + Entra ID integration"],
      fifteenMin: ["@kernel_function for native plugins", "HandlebarsPlanner for automatic planning", "Memory: volatile + persistent (Cosmos DB)", "Filter pipeline: auth, logging, safety", "Process Framework for durable workflows", "Multi-language: .NET, Python, Java"],
      oneHour: ["Kernel with Azure OpenAI setup", "3 plugins (native + semantic)", "Handlebars planner integration", "Memory store with semantic recall", "Responsible AI filter", "Entra ID auth + App Insights telemetry"],
      cheatSheet: ["Kernel = central orchestrator", "Native + semantic plugins", "HandlebarsPlanner", "Process Framework = durable", "Entra ID + RAI filters", ".NET + Python support"],
    },
    glossary: ["Semantic Kernel", "Kernel", "Plugin", "HandlebarsPlanner", "Process Framework", "Responsible AI"],
    commonMistakes: [
      "Only semantic plugins — missing native code integration",
      "No responsible AI filters in production",
      "Ignoring Process Framework for long-running tasks",
      "Not leveraging Entra ID for enterprise auth",
      "Using SK without Azure integration — loses key benefits",
    ],
  }),
};
