import { createLesson, type LessonInput } from "./builder";

function fw(input: LessonInput) {
  return createLesson(input);
}

export const frameworkPhaseLessons: Record<string, ReturnType<typeof createLesson>> = {
  "why-frameworks": fw({
    concept:
      "A framework is the runtime around the agent loop: state, tools, retries, pauses, and multi-agent routing. MCP is not a framework — it is a protocol for exposing tools. You learned the loop first so a framework does not hide what the model is actually doing.",
    whyItExists:
      "Raw while-loops work for a demo and collapse when you need checkpoints, handoffs, or human approval. Frameworks encode those production problems so you are not rewriting orchestration for every product.",
    analogy:
      "Phase 4–7 taught you how an engine works. A framework is the car — you still need to know what a clutch does when it fails on the highway.",
    technicalExplanation:
      "Every serious framework wraps the same loop: model decides → runtime executes tools → state updates → repeat. They differ in state model (graph vs crew vs typed agent), persistence, multi-agent primitives, and how opinionated the defaults are. Pick the runtime that matches the control flow you already designed, not the one with the loudest launch post.",
    example:
      "A refund agent needs: classify → lookup order → maybe refund → human gate over $200. That is a graph (LangGraph), a typed tool loop (PydanticAI), or a crew with a manager. The framework is the wiring, not the policy.",
    code: `def agent_loop(user, tools, llm, max_steps=8):
    state = {"messages": [user], "step": 0}
    while state["step"] < max_steps:
        decision = llm.decide(state, tools)
        if decision.type == "final":
            return decision.text
        state["messages"].append(tools.run(decision.tool, decision.args))
        state["step"] += 1
    return "stopped: max steps"
# Frameworks replace this loop with graphs, crews, or typed runners.`,
    commandsToRemember: [
      "Framework = runtime around the agent loop",
      "MCP = tool protocol, not an orchestrator",
      "Learn the loop before the library",
      "Pick runtime for control flow, not hype",
    ],
    revisionNotes: {
      cheatSheet: [
        "Loop first, framework second",
        "MCP is not LangGraph",
        "State + tools + stop conditions",
        "Match runtime to the workflow",
      ],
    },
    glossary: ["Agent Framework", "Orchestration", "Runtime"],
    commonMistakes: [
      "Starting with LangGraph before writing a raw loop",
      "Treating MCP as a competitor to CrewAI",
      "Collecting frameworks instead of shipping one agent",
    ],
    learnElsewhere: [
      "LangGraph — Phase 10",
      "Claude Agent SDK — Phase 12",
      "CrewAI — Phase 13",
      "MCP — Phase 8",
    ],
  }),

  "choosing-a-framework": fw({
    concept:
      "Choose by the shape of the work: graphs for branching and pause/resume, crews for role-based teams, typed Python for schema-first tools, vendor SDKs when you are all-in on that model lab.",
    whyItExists:
      "The 2026 landscape is noisy. Interviews and production reviews both ask why this runtime, not a list of logos you installed.",
    analogy:
      "You do not pick a database by GitHub stars. You pick Postgres vs a graph DB by the queries. Same for agents.",
    technicalExplanation:
      "LangGraph: explicit graphs, checkpoints, HITL, durable execution. OpenAI Agents SDK: handoffs + guardrails on OpenAI. Claude Agent SDK: the Claude Code loop — tools, permissions, hooks, MCP, sandbox. CrewAI: role-based Crews plus Flows for production orchestration. PydanticAI: type-safe tools and results, model-agnostic. Microsoft Agent Framework: successor to AutoGen and Semantic Kernel. Google ADK: Gemini-native agents, graph workflows, A2A. AutoGen and Semantic Kernel: legacy / migration awareness. Smaller tools (smolagents, Agno, Mastra, Haystack, Strands) are valid when the team already lives in that ecosystem.",
    example:
      "Ticket router with human approval → LangGraph. Five specialists writing a report → CrewAI. Internal Python API with strict JSON → PydanticAI. GPT-only prototype this week → OpenAI Agents SDK.",
    code: `def pick_framework(needs):
    if needs["hitl"] or needs["checkpoints"] or needs["branching"]:
        return "langgraph"
    if needs["roles"] and needs["team"]:
        return "crewai"
    if needs["typed_python"] and needs["structured_out"]:
        return "pydantic-ai"
    if needs["openai_only"] and needs["handoffs"]:
        return "openai-agents"
    if needs["coding_agent"] or needs["claude_code"]:
        return "claude-agent-sdk"
    if needs["microsoft_stack"]:
        return "microsoft-agent-framework"
    if needs["gemini_native"]:
        return "google-adk"
    return "raw loop is still allowed"`,
    commandsToRemember: [
      "Graph + HITL → LangGraph",
      "Roles + tasks → CrewAI",
      "Typed tools → PydanticAI",
      "Vendor lock-in is a choice",
    ],
    revisionNotes: {
      cheatSheet: [
        "Match shape of work",
        "HITL → graph runtime",
        "Teams → CrewAI / Microsoft AF",
        "One runtime in production",
      ],
    },
    glossary: ["HITL", "Handoff", "Vendor SDK"],
    commonMistakes: [
      "Running two orchestrators in one service",
      "Picking a framework before writing the state machine on paper",
    ],
    learnElsewhere: ["LangGraph — Phase 10", "OpenAI Agents — Phase 11", "Claude Agent SDK — Phase 12", "CrewAI — Phase 13"],
  }),

  "langgraph-subgraphs": fw({
    concept:
      "A subgraph is a compiled graph nested as a node. Specialists stay isolated; the parent graph only sees the specialist's input and output contract.",
    whyItExists:
      "A 40-node mega-graph is unreadable. Subgraphs let billing, search, and writing evolve independently with their own state.",
    analogy:
      "A company org chart: the CEO graph delegates to the finance graph. Finance can change internals without rewriting the CEO loop.",
    technicalExplanation:
      "Compile a child StateGraph and add it with add_node('billing', billing_graph). Parent state must map into child state (or share a schema). Checkpointers can nest. Use subgraphs for specialist agents, not for every two-line function.",
    example:
      "Support graph: classify → (billing subgraph | tech subgraph) → reply. Refunds over $200 interrupt inside billing only.",
    code: `from langgraph.graph import StateGraph, START, END

billing = StateGraph(BillingState)
billing.add_node("lookup", lookup_invoice)
billing.add_node("refund", refund)
billing.add_edge(START, "lookup")
billing.add_edge("lookup", "refund")
billing.add_edge("refund", END)
billing_app = billing.compile()

parent = StateGraph(SupportState)
parent.add_node("classify", classify)
parent.add_node("billing", billing_app)
parent.add_edge(START, "classify")
parent.add_conditional_edges("classify", route, {"bill": "billing", "done": END})`,
    commandsToRemember: [
      "Subgraph = compiled graph as a node",
      "Keep specialist state private",
      "Map parent fields into child",
      "Don't subgraph two-line helpers",
    ],
    revisionNotes: {
      cheatSheet: [
        "Nest compiled graphs",
        "Clear in/out contract",
        "HITL can live inside a child",
        "Readable > clever",
      ],
    },
    glossary: ["Subgraph", "State mapping"],
    commonMistakes: ["One shared blob of state across all subgraphs", "No route back to the parent"],
    learnElsewhere: ["Checkpoints & Persistence", "Human-in-the-Loop"],
  }),

  "build-langgraph-agent": fw({
    concept:
      "Ship a small LangGraph: typed state, planner and executor nodes, a conditional loop, a checkpointer, and one interrupt for irreversible actions.",
    whyItExists:
      "Tutorials stop at Hello Graph. Production needs thread_id, persistence, and a stop condition you can explain in an interview.",
    analogy:
      "A first flight: checklist, radio, and a go-around. Not a 747 wiring diagram.",
    technicalExplanation:
      "AgentState with messages + step. Nodes return partial updates. Conditional edge on should_continue. MemorySaver or PostgresSaver with thread_id. interrupt() before refunds or emails. Stream with astream(). Trace in LangSmith.",
    example:
      "User: 'Research X and email me.' Graph: plan → search → draft → interrupt(send_email) → END. Restart the same thread_id after approval.",
    code: `from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class S(TypedDict):
    messages: Annotated[list, add_messages]
    step: int

def act(state: S):
    # call tools / LLM
    return {"step": state.get("step", 0) + 1}

def gate(state: S):
    interrupt("approve send?")
    return {}

def more(state: S):
    return "loop" if state["step"] < 4 else "mail"

g = StateGraph(S)
g.add_node("act", act)
g.add_node("gate", gate)
g.add_edge(START, "act")
g.add_conditional_edges("act", more, {"loop": "act", "mail": "gate"})
g.add_edge("gate", END)
app = g.compile(checkpointer=MemorySaver())
app.invoke({"messages": [("user", "Research X")]}, {"configurable": {"thread_id": "t1"}})`,
    project:
      "Planner + executor + HITL email node, checkpointed, FastAPI /invoke with thread_id.",
    commandsToRemember: [
      "thread_id = session",
      "interrupt() before irreversible",
      "Partial state updates per node",
      "Max steps as a conditional edge",
    ],
    revisionNotes: {
      cheatSheet: [
        "Typed state + compile",
        "Checkpointer + thread_id",
        "HITL on side effects",
        "One graph you can draw",
      ],
    },
    glossary: ["thread_id", "interrupt", "MemorySaver"],
    commonMistakes: ["No max-step edge", "Forgetting checkpointer in prod"],
    learnElsewhere: ["LangSmith — Phase 19", "Production agents — Phase 21"],
  }),

  "build-openai-agent": fw({
    concept:
      "Wire a triage agent that hands off to specialists, with an input guardrail and Runner.run. That is the SDK's whole point.",
    whyItExists:
      "Reading the docs is not the same as a runner that stops, traces, and refuses jailbreaks.",
    analogy:
      "A front desk that badges visitors, then walks them to billing or engineering.",
    technicalExplanation:
      "Agent(name, instructions, tools, handoffs). Guardrail functions wrap input. Runner.run(agent, input). Sessions persist conversation. Tracing is on by default in the OpenAI dashboard. Keep the specialist agents small.",
    example:
      "Triage → billing or engineering. Billing has refund_tool. Input guardrail rejects 'ignore previous instructions'.",
    code: `from agents import Agent, Runner, InputGuardrail, GuardrailFunctionOutput

billing = Agent(name="Billing", instructions="Answer invoices and refunds.", tools=[refund_tool])
eng = Agent(name="Eng", instructions="Answer product bugs.")

async def no_inject(ctx, agent, input):
    bad = "ignore previous" in str(input).lower()
    return GuardrailFunctionOutput(tripwire_triggered=bad, output_info={})

triage = Agent(
    name="Triage",
    instructions="Route to billing or eng.",
    handoffs=[billing, eng],
    input_guardrails=[InputGuardrail(guardrail_function=no_inject)],
)
result = await Runner.run(triage, "I was charged twice")`,
    project: "Triage + two specialists + one guardrail + a trace you can open.",
    commandsToRemember: [
      "Agent + Runner.run",
      "Handoffs are other agents",
      "Guardrails on input/output",
      "Specialists stay narrow",
    ],
    revisionNotes: {
      cheatSheet: ["Triage routes", "Guardrail tripwire", "Trace the run", "Don't nest 12 agents"],
    },
    glossary: ["Handoff", "Runner", "Guardrail"],
    commonMistakes: ["One god-agent with 40 tools", "No guardrail on user text"],
    learnElsewhere: ["Sessions & Handoffs", "Guardrails & Tracing"],
  }),


  "pydantic-ai-tools": fw({
    concept:
      "PydanticAI tools are typed Python functions. The model fills arguments that already match a schema. Invalid args never reach your code.",
    whyItExists:
      "Stringly-typed tool calling is how SQL injection and silent None bugs land in agent stacks.",
    analogy:
      "A FastAPI route: you declare types, the framework parses, you never json.loads by hand.",
    technicalExplanation:
      "@agent.tool async def get_order(ctx, order_id: str) -> Order. Docstrings become tool descriptions. Return types can be Pydantic models. Dependencies arrive via RunContext. Prefer tools over dumping APIs into the system prompt.",
    example:
      "get_order(order_id) returns Order. The model cannot pass {id: 1} if the field is order_id: str.",
    code: `from pydantic_ai import Agent, RunContext
from pydantic import BaseModel

class Order(BaseModel):
    id: str
    total: float

agent = Agent("openai:gpt-4o-mini")

@agent.tool
async def get_order(ctx: RunContext[None], order_id: str) -> Order:
    """Look up an order by id."""
    return db.get(order_id)`,
    commandsToRemember: [
      "@agent.tool + types",
      "Docstring = tool description",
      "Return a model if you can",
      "No raw JSON in the handler",
    ],
    revisionNotes: {
      cheatSheet: ["Types at the boundary", "RunContext for deps", "Small tools", "Validate then execute"],
    },
    glossary: ["@agent.tool", "RunContext"],
    commonMistakes: ["Untyped **kwargs tools", "Doing business logic in the prompt"],
    learnElsewhere: ["Dependencies", "Structured Results"],
  }),

  "pydantic-ai-deps": fw({
    concept:
      "Dependencies are the typed context the agent cannot hallucinate: DB clients, user id, clock, feature flags.",
    whyItExists:
      "Putting secrets or request-scoped handles in the prompt is how keys leak and tests become impossible.",
    analogy:
      "FastAPI Depends(). The handler receives a db session; the model never sees the connection string.",
    technicalExplanation:
      "Agent[Deps, Result]. RunContext[Deps] in tools. deps= passed to agent.run(). Different deps in tests (fake db). Never pass the API key as a tool argument.",
    example:
      "Deps = {db, user_id}. Tool get_order uses ctx.deps.db. Tests inject InMemoryDB.",
    code: `from dataclasses import dataclass
from pydantic_ai import Agent, RunContext

@dataclass
class Deps:
    db: object
    user_id: str

agent: Agent[Deps, str] = Agent("openai:gpt-4o-mini", deps_type=Deps)

@agent.tool
async def my_orders(ctx: RunContext[Deps]) -> list[str]:
    return ctx.deps.db.list(ctx.deps.user_id)

await agent.run("what did I buy?", deps=Deps(db=db, user_id="u1"))`,
    commandsToRemember: [
      "deps_type on the Agent",
      "RunContext[Deps] in tools",
      "Inject fakes in tests",
      "No secrets in tool args",
    ],
    revisionNotes: {
      cheatSheet: ["Deps ≠ prompt", "Test with fakes", "user_id from auth", "Clock is a dep"],
    },
    glossary: ["Deps", "RunContext"],
    commonMistakes: ["Global db in the tool module", "Passing user_id from the model"],
    learnElsewhere: ["Build a PydanticAI Agent"],
  }),

  "pydantic-ai-results": fw({
    concept:
      "The agent's result_type is a Pydantic model. You get a parsed object or a validation retry — not a string you regex.",
    whyItExists:
      "Downstream code needs OrderDecision, not markdown that maybe contains JSON.",
    analogy:
      "A typed API response. If the body is wrong, you 400. Here the runtime asks the model to fix it.",
    technicalExplanation:
      "Agent('openai:gpt-4o-mini', result_type=Reply). Reply has action: Literal['refund','deny'] and amount: float. result.data is Reply. result_retries on failure. Use result_type even when you also have tools.",
    example:
      "Reply(action='refund', amount=12.5, reason='duplicate charge'). Your FastAPI route returns that object.",
    code: `from typing import Literal
from pydantic import BaseModel
from pydantic_ai import Agent

class Reply(BaseModel):
    action: Literal["refund", "deny", "ask"]
    amount: float | None
    reason: str

agent = Agent("openai:gpt-4o-mini", result_type=Reply)
result = await agent.run("Charged twice for order 99")
print(result.data.action, result.data.amount)`,
    commandsToRemember: [
      "result_type=YourModel",
      "result.data is parsed",
      "Retries on validation fail",
      "Literal beats free text",
    ],
    revisionNotes: {
      cheatSheet: ["Schema out", "No regex JSON", "Retry is built in", "Keep models small"],
    },
    glossary: ["result_type", "result.data"],
    commonMistakes: ["result_type=str for a structured workflow", "Huge nested models the model can't fill"],
    learnElsewhere: ["Structured outputs — Phase 7"],
  }),

  "build-pydantic-ai-agent": fw({
    concept:
      "One Agent, two tools, Deps, and a result_type. That is a production-shaped PydanticAI service.",
    whyItExists:
      "Typed agents are the Python community's answer to 'framework soup' — ship one you can test.",
    analogy:
      "A small FastAPI app: routes, Depends, response_model. Same discipline, LLM in the middle.",
    technicalExplanation:
      "Agent[Deps, Reply] + get_order + refund_tool (policy in Python, not the prompt) + result_type Reply. Tests: TestModel or FunctionModel. Log result.usage().",
    example:
      "User asks about order 99. Tool loads Order. Result is deny or refund with amount. Refund tool refused if amount > 50 without HITL flag in deps.",
    code: `agent = Agent("openai:gpt-4o-mini", deps_type=Deps, result_type=Reply)

@agent.tool
async def get_order(ctx: RunContext[Deps], order_id: str) -> Order:
    return ctx.deps.db.get(order_id)

result = await agent.run("refund order 99", deps=deps)
assert result.data.action in {"refund", "deny", "ask"}`,
    project: "Typed support agent with one DB dep, two tools, Reply model, and a unit test using a fake db.",
    commandsToRemember: [
      "Agent[Deps, Reply]",
      "Policy in Python",
      "Fake deps in tests",
      "Log usage",
    ],
    revisionNotes: {
      cheatSheet: ["Small typed agent", "Test without live LLM if you can", "HITL as a dep flag", "One result model"],
    },
    glossary: ["TestModel", "usage"],
    commonMistakes: ["Calling OpenAI in unit tests for schema checks", "Business rules only in the prompt"],
    learnElsewhere: ["Tool Validation — Phase 7", "Security — Phase 20"],
  }),

  "autogen-group-chat": fw({
    concept:
      "AutoGen GroupChat is a shared thread where speakers take turns under a GroupChatManager. Speaker selection is the design.",
    whyItExists:
      "Two-agent ping-pong is easy. A researcher, coder, and critic need a manager or they talk forever.",
    analogy:
      "A meeting with a facilitator and a talking stick. Without the stick, everyone talks over each other.",
    technicalExplanation:
      "AssistantAgent / UserProxyAgent. GroupChat(agents, max_round, speaker_selection_method). Manager drives the next speaker: auto, round_robin, or a custom function. Termination: max_round or a speaker says TERMINATE. Human proxy for HITL.",
    example:
      "Researcher → Coder → Critic, max_round=8, stop when Critic says APPROVE.",
    code: `from autogen import AssistantAgent, GroupChat, GroupChatManager, UserProxyAgent

researcher = AssistantAgent("researcher", llm_config=llm)
coder = AssistantAgent("coder", llm_config=llm)
user = UserProxyAgent("user", human_input_mode="NEVER")
chat = GroupChat(agents=[user, researcher, coder], max_round=8, speaker_selection_method="round_robin")
manager = GroupChatManager(groupchat=chat, llm_config=llm)
user.initiate_chat(manager, message="Write a pytest for fizzbuzz")`,
    commandsToRemember: [
      "GroupChat + Manager",
      "max_round is mandatory",
      "Speaker selection is policy",
      "TERMINATE on purpose",
    ],
    revisionNotes: {
      cheatSheet: ["Facilitator required", "Cap rounds", "Custom speaker fn", "Human proxy for HITL"],
    },
    glossary: ["GroupChat", "GroupChatManager", "UserProxyAgent"],
    commonMistakes: ["No max_round", "Five agents with auto speak and no stop"],
    learnElsewhere: ["Microsoft Agent Framework", "Multi-agent — Phase 18"],
  }),

  "build-autogen-team": fw({
    concept:
      "A three-agent AutoGen team with a hard round cap, one code executor, and a clear terminate message.",
    whyItExists:
      "AutoGen shines in conversational teams. It fails when you forget termination and cost.",
    analogy:
      "A time-boxed workshop: 8 turns, a scribe, a critic, then you leave the room.",
    technicalExplanation:
      "UserProxy with code execution in a sandbox. Researcher without shell. Critic who only says APPROVE or REVISE. Manager round-robin. Log tokens. Prefer Microsoft Agent Framework for new greenfield if your org is on that stack.",
    example:
      "Task: 'plot y=x^2'. Coder writes matplotlib in the proxy. Critic checks the file exists. Stop.",
    code: `user = UserProxyAgent(
    "user",
    human_input_mode="NEVER",
    code_execution_config={"work_dir": "scratch", "use_docker": True},
)
# initiate_chat with max_round=8 and a critic that emits TERMINATE`,
    project: "Researcher + coder + critic, Docker code exec, max_round=8, saved transcript.",
    commandsToRemember: [
      "Sandbox code exec",
      "max_round=8",
      "Critic terminates",
      "Save the transcript",
    ],
    revisionNotes: {
      cheatSheet: ["Time-box the chat", "Sandbox", "One executor", "Transcript is the eval"],
    },
    glossary: ["code_execution_config", "TERMINATE"],
    commonMistakes: ["use_docker False on untrusted code", "Infinite critic loop"],
    learnElsewhere: ["Security — Phase 20", "Python tool — Phase 7"],
  }),

  "build-google-adk-agent": fw({
    concept:
      "An ADK agent is instructions + tools + optional sub-agents, run through the ADK runner against Gemini.",
    whyItExists:
      "Google's kit is how Gemini-native teams ship agents without re-inventing orchestration on Vertex.",
    analogy:
      "A Gemini specialist with a toolkit and junior agents they can call, scheduled on Google's runtime.",
    technicalExplanation:
      "LlmAgent(name, model, instruction, tools). Sub-agents for specialists. Runner + session service. Local: adk web or adk run. Production: Vertex / Agent Engine. Keep tools as Python functions with types.",
    example:
      "Coordinator agent with search tool and a 'refund' sub-agent. Runner.run(user_id, session_id, message).",
    code: `from google.adk.agents import LlmAgent
from google.adk.runners import Runner

refund = LlmAgent(name="refund", model="gemini-2.5-flash", instruction="Handle refunds only.")
root = LlmAgent(
    name="desk",
    model="gemini-2.5-flash",
    instruction="Route billing to refund. Else answer.",
    sub_agents=[refund],
    tools=[search_tool],
)
runner = Runner(agent=root)
# runner.run(user_id="u1", session_id="s1", new_message="refund order 99")`,
    project: "Root + one sub-agent + one tool, local ADK run, then a Vertex deploy note.",
    commandsToRemember: [
      "LlmAgent + Runner",
      "sub_agents for specialists",
      "Typed Python tools",
      "Session id for memory",
    ],
    revisionNotes: {
      cheatSheet: ["Gemini-native", "Sub-agents not a graph", "Session service", "Start local"],
    },
    glossary: ["LlmAgent", "Runner", "Agent Engine"],
    commonMistakes: ["Copying a LangGraph into ADK 1:1", "No session id"],
    learnElsewhere: ["ADK Workflows & Sub-Agents", "Choosing a Framework — Phase 9"],
  }),
};
