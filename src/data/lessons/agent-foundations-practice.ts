import type { LessonInput } from "./builder";

type AgentLessonCore = Omit<LessonInput, "example" | "exampleSolution" | "practiceTask" | "code">;

/** Module-specific examples, solutions, practice tasks, and code for Phase 4. */
export const AGENT_FOUNDATIONS_PRACTICE: Record<
  string,
  Pick<LessonInput, "example" | "exampleSolution" | "practiceTask" | "code">
> = {
  "what-is-an-ai-agent": {
    example:
      "A sales VP asks: 'Summarize Q3 revenue by region and email the board.' The agent must query Snowflake, build a chart, draft the email, wait for approval, then send via Gmail.",
    exampleSolution:
      "Break the goal into subtasks: (1) call `run_sql` on Snowflake for Q3 regional revenue, (2) pass rows to `create_chart`, (3) draft the email with the chart attached, (4) pause at a human-approval gate because `send_email` is destructive, (5) send and return the message ID. Monitor: tool success rate, steps per task, and approval bypass attempts.",
    practiceTask:
      "Pick one recurring task from your work (weekly report, ticket triage, data pull). Write 5–7 agent loop steps, name the tool for each step, and mark where human approval is required.",
    code: `from openai import OpenAI

client = OpenAI()
tools = [
    {"type": "function", "function": {"name": "run_sql", "parameters": {"type": "object", "properties": {"query": {"type": "string"}}}}},
    {"type": "function", "function": {"name": "send_email", "parameters": {"type": "object", "properties": {"to": {"type": "string"}, "body": {"type": "string"}}}}},
]

messages = [{"role": "user", "content": "Summarize Q3 revenue by region and email the board"}]
MAX_STEPS = 8

for step in range(MAX_STEPS):
    >>> response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        tools=tools,
    )
    msg = response.choices[0].message
    if not msg.tool_calls:
        print("Final:", msg.content)
        break
    # Execute tool, append result, loop again
    messages.append(msg)
    messages.append({"role": "tool", "tool_call_id": msg.tool_calls[0].id, "content": '{"rows": [...]}'})`,
  },

  "why-llms-need-agents": {
    example:
      "Finance asks: 'What were our Q3 APAC sales?' A raw LLM answers '$4.2M' from memory. An agent runs `SELECT SUM(revenue) FROM sales WHERE quarter='Q3' AND region='APAC'` and returns $3.87M with the query cited.",
    exampleSolution:
      "The chatbot hallucinates a plausible number because it has no live data access. The agent selects the SQL tool, executes against Snowflake, and grounds the answer in query output. You would log whether finance answers include a SQL citation and track hallucination reports from users.",
    practiceTask:
      "List three requests your team gets that need live data or side effects (send email, update CRM, run code). For each, explain why a plain LLM chat fails and name the one tool that closes the biggest gap.",
    code: `from openai import OpenAI

client = OpenAI()
question = "What were our Q3 APAC sales in dollars?"

# LLM-only — no tools, will guess from training data
guess = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": question}],
)
print("LLM-only:", guess.choices[0].message.content)

# Agent path — tool returns real warehouse data
def run_sql(query: str) -> str:
    return '{"total_revenue": 3870000, "region": "APAC", "quarter": "Q3"}'

>>> agent = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": question}],
    tools=[{"type": "function", "function": {"name": "run_sql", "parameters": {"type": "object", "properties": {"query": {"type": "string"}}}}}],
)
# Execute tool call, append observation, ask again for grounded answer`,
  },

  "anatomy-of-an-agent": {
    example:
      "Cursor-style coding agent: Brain = Claude with repo rules; Senses = open files + terminal stderr; Hands = `write_file`, `run_tests`, `grep`; Memory = repo index + session buffer; Runtime = 12-step cap, retry on test failure, LangSmith trace.",
    exampleSolution:
      "Brain reads failing test output (Senses) and chooses `write_file` then `run_tests` (Hands). Memory stores the last failing assertion so the retry does not repeat the same edit. Runtime stops at 12 steps or escalates to the user. Monitor: tools per successful fix and invalid file paths suggested by the brain.",
    practiceTask:
      "Pick a non-coding agent (support, research, or ops). Fill a 5-row table — Brain / Senses / Hands / Memory / Runtime — with one concrete item per row for that agent.",
    code: `from typing import TypedDict

class AgentState(TypedDict):
    messages: list          # Brain input (Senses)
    tool_results: list      # Observations from Hands
    repo_index: dict        # Long-term Memory
    step: int               # Runtime counter
    max_steps: int          # Runtime limit

state: AgentState = {
    "messages": [{"role": "user", "content": "Fix the failing auth test"}],
    "tool_results": [],
    "repo_index": {"files": ["auth.py", "test_auth.py"]},
    "step": 0,
    "max_steps": 12,
}

>>> while state["step"] < state["max_steps"]:
    # Brain: LLM picks tool from registry (Hands)
    action = "run_tests"  # e.g. from tool_calls
    observation = {"passed": False, "stderr": "AssertionError: 401"}
    state["tool_results"].append(observation)
    state["step"] += 1`,
  },

  "agent-lifecycle": {
    example:
      "Support agent v2: production traces show 15% SQL tool failures (wrong column names). Team adds schema validation in Develop, 20 golden tickets in Evaluate, canary at 5% traffic, then full Deploy after failure rate drops below 2%.",
    exampleSolution:
      "Iterate from prod failures: add `validate_sql_columns` in Develop, extend the golden set with the 15 failing queries in Evaluate, canary at 5% in Deploy, and promote only when `sql_tool_error_rate < 0.02` for 48 hours. Monitor: regression pass rate on every prompt change.",
    practiceTask:
      "Sketch a one-page lifecycle for an agent you might build: Design success metrics, Develop tracing setup, Evaluate golden tasks (list 3), Deploy canary percentage, Iterate feedback source.",
    code: `golden_cases = [
    {"input": "Refund status for order 8821", "expect_tool": "lookup_order"},
    {"input": "Cancel subscription for user@co.com", "expect_tool": "cancel_sub"},
]

def run_eval(agent_fn):
    passed = 0
    for case in golden_cases:
        trace = agent_fn(case["input"])
        if trace.get("tool") == case["expect_tool"]:
            passed += 1
    return passed / len(golden_cases)

>>> score = run_eval(my_support_agent)
print(f"Eval score: {score:.0%} — deploy only if >= 0.9 and canary stable"`,
  },

  "core-concepts": {
    example:
      "EU AI Act research brief: supervisor routes to a web-scraper worker, then a summarizer, then pauses at HITL before publishing to Notion.",
    exampleSolution:
      "Perception-action: scraper observes URLs, supervisor decides the next worker. Plan-and-execute: upfront outline (search → summarize → cite → publish). HITL blocks the Notion write until legal reviews. Monitor: routing accuracy and unauthorized publish attempts.",
    practiceTask:
      "For the EU AI Act brief, label each step as ReAct, plan-and-execute, supervisor routing, or HITL. Write one sentence on why HITL sits where it does.",
    code: `SYSTEM = "You are a ReAct agent. Reply with Thought, then Action, then wait for Observation."

messages = [
    {"role": "system", "content": SYSTEM},
    {"role": "user", "content": "Find 3 official EU AI Act sources and summarize obligations"},
]

# One ReAct iteration
>>> thought_action = llm(messages)  # "Thought: search official sources\\nAction: web_search({'q': 'EU AI Act official'})"
observation = web_search("EU AI Act site:europa.eu")
messages.append({"role": "assistant", "content": thought_action})
messages.append({"role": "user", "content": f"Observation: {observation}"})`,
  },

  "agent-capabilities": {
    example:
      "L2 data analyst agent: NL→SQL, matplotlib chart, Slack post. It does not auto-deploy models or open PRs — that is L4 multi-agent scope.",
    exampleSolution:
      "Capability map: L2 = multi-tool loop (SQL → chart → Slack). It lacks L3 re-planning when SQL returns zero rows and lacks L4 code-review agents. Evaluate with 10 analyst questions and task-completion rate, not SWE-bench.",
    practiceTask:
      "Rate your capstone idea L1–L4 using the tier ladder in the diagram. List the one tier you must nail before climbing to the next.",
    code: `CAPABILITY_TIERS = {
    "L1": ["calculator", "weather"],
    "L2": ["run_sql", "create_chart", "slack_post"],
    "L3": ["planner", "run_sql", "create_chart", "replan_on_empty"],
    "L4": ["supervisor", "analyst_agent", "reviewer_agent"],
}

def tools_for_tier(tier: str) -> list[str]:
    return CAPABILITY_TIERS[tier]

>>> analyst_tools = tools_for_tier("L2")
print("L2 analyst gets:", analyst_tools)  # not L4 deploy/PR tools`,
  },

  "types-of-agents": {
    example:
      "Internal HR policy FAQ = conversational (buffer memory, no tools). CI PR reviewer = task-oriented ReAct (read diff → run linter → post comment). Quarterly board pack = deliberative (plan all sections, then execute).",
    exampleSolution:
      "HR FAQ: wrong to use a supervisor graph — static RAG + chat memory is enough. PR reviewer: task loop stops when the comment is posted. Board pack: deliberative because steps are known and sequential. Monitor: p95 latency on simple FAQs (signals over-engineering).",
    practiceTask:
      "Classify three features on your backlog as reactive, conversational, task-oriented, deliberative, or multi-agent. Justify each in one sentence.",
    code: `def pick_agent_type(task: dict) -> str:
    if task.get("single_turn") and not task.get("tools"):
        return "reactive"
    if not task.get("tools"):
        return "conversational"
    if task.get("known_steps"):
        return "deliberative"
    if task.get("scope") == "large":
        return "multi-agent"
    return "task-oriented"

>>> print(pick_agent_type({"tools": True, "known_steps": True}))  # deliberative
print(pick_agent_type({"tools": True, "single_turn": False}))       # task-oriented`,
  },

  "agent-architectures": {
    example:
      "Employee onboarding in LangGraph: nodes `verify_id` → `parse_docs` → `create_account` → `send_welcome`. Conditional edge from `parse_docs` routes to human review when OCR confidence < 0.8.",
    exampleSolution:
      "ReAct works for a demo, but LangGraph adds checkpoints (resume after human review), conditional routing on confidence, and per-node metrics. Use `interrupt_before=['create_account']` for HITL. Monitor: node latency and retry count per node.",
    practiceTask:
      "Redraw the onboarding flow as four LangGraph nodes. Add one conditional edge and one `interrupt_before` gate. Label what state each node reads and writes.",
    code: `from typing import TypedDict
from langgraph.graph import StateGraph, END

class OnboardingState(TypedDict):
    docs: list
    confidence: float
    account_id: str | None

graph = StateGraph(OnboardingState)
graph.add_node("verify_id", verify_id_fn)
graph.add_node("parse_docs", parse_docs_fn)
graph.add_node("create_account", create_account_fn)
graph.add_node("send_welcome", send_welcome_fn)

>>> graph.add_conditional_edges("parse_docs", route_by_confidence)
graph.add_edge("verify_id", "parse_docs")
graph.add_edge("create_account", "send_welcome")
app = graph.compile(interrupt_before=["create_account"])`,
  },

  "agent-terminology": {
    example:
      "Incident P0: Episode `ticket-8821` had trajectory [search×3 failed → cache fallback → answer]. Termination reason was `max_steps`, not `done`.",
    exampleSolution:
      "Episode = one support ticket end-to-end. Trajectory = ordered action/observation log. Three failed search actions mean the agent never grounded on live data. Termination `max_steps` = budget exhausted without success. Add a golden eval for triple-search failure and document the cache fallback policy.",
    practiceTask:
      "Write a fake 5-line trajectory for a refund lookup. Label: episode ID, each action, each observation, and the termination reason.",
    code: `from dataclasses import dataclass, field

@dataclass
class TrajectoryStep:
    action: str
    observation: str

@dataclass
class Episode:
    episode_id: str
    steps: list[TrajectoryStep] = field(default_factory=list)
    termination: str = "running"

ep = Episode(episode_id="ticket-8821")
>>> ep.steps.append(TrajectoryStep("web_search", "0 results"))
ep.steps.append(TrajectoryStep("web_search", "0 results"))
ep.termination = "max_steps"
print(ep.episode_id, len(ep.steps), ep.termination)`,
  },

  "current-agent-landscape": {
    example:
      "Series A startup: Cursor for engineering, LangGraph + custom tools for support, MCP servers for Salesforce and Zendesk instead of two bespoke OAuth integrations.",
    exampleSolution:
      "Build vs buy: buy Cursor (IDE agent), build the support workflow (domain prompts + evals). MCP replaces custom adapters with standard tool servers. Monitor: MCP server uptime and time-to-add a new integration.",
    practiceTask:
      "For your org, decide build vs buy for coding, customer support, and internal search. Name one framework and one protocol you would standardize on and why.",
    code: `# MCP client — list tools from a CRM server (landscape: protocol over custom SDKs)
from mcp import ClientSession

async def list_crm_tools():
    async with ClientSession("salesforce-mcp") as session:
        >>> tools = await session.list_tools()
        return [t.name for t in tools.tools]

# Agent picks from standardized tool list instead of hard-coded REST wrappers`,
  },

  planning: {
    example:
      "Goal: 'Board deck by Friday.' Plan: (1) SQL revenue by region, (2) chart, (3) competitor bullets via web search, (4) draft slides, (5) PDF export, (6) email board — step 3 can run in parallel after step 1.",
    exampleSolution:
      "Planner emits JSON steps with `depends_on`. Validate that `run_sql`, `web_search`, and `export_pdf` exist before execution. Human approves before step 6 (external email). If step 3 fails, re-plan steps 3–6 only. Monitor: plan adherence (% steps run in dependency order).",
    practiceTask:
      "Write a 5-step JSON plan for the board deck goal. Include `tool`, `depends_on`, and `expected_output` for each step.",
    code: `PLAN = [
    {"step": 1, "tool": "run_sql", "task": "Q3 revenue by region", "depends_on": []},
    {"step": 2, "tool": "create_chart", "task": "bar chart", "depends_on": [1]},
    {"step": 3, "tool": "web_search", "task": "competitor news", "depends_on": [1]},
    {"step": 4, "tool": "draft_slides", "task": "merge chart + bullets", "depends_on": [2, 3]},
]

REGISTERED_TOOLS = {"run_sql", "create_chart", "web_search", "draft_slides"}

>>> assert all(s["tool"] in REGISTERED_TOOLS for s in PLAN)
for step in sorted(PLAN, key=lambda s: s["step"]):
    print(f"Execute step {step['step']}: {step['tool']}")`,
  },

  reflection: {
    example:
      "Report agent drafts a Q3 summary; critique flags a missing APAC breakdown and an uncited revenue total. Agent re-queries SQL for APAC, adds citations, then returns.",
    exampleSolution:
      "Self-critique checks: date range ✓, all regions ✓, citations ✗. Revise triggers a second SQL call with `region='APAC'`. Cap at 2 critique rounds; use a cheaper model for critique. Monitor: critique-trigger rate and added cost per task.",
    practiceTask:
      "Write a 6-item reflection checklist for customer-facing emails. Apply it mentally to a one-paragraph draft you invent — note what would fail.",
    code: `CRITIQUE_PROMPT = "Review the draft. List: missing sections, uncited numbers, policy risks."

draft = "Q3 revenue was strong across regions..."
>>> critique = llm([{"role": "user", "content": f"{CRITIQUE_PROMPT}\\n\\n{draft}"}])

if "uncited" in critique.lower():
    revised = llm([{"role": "user", "content": f"Fix these issues:\\n{critique}\\n\\n{draft}"}])
    draft = revised`,
  },

  "multi-tool": {
    example:
      "Research workflow: `web_search` (×3 parallel queries) → `summarize` → `notion_create_page` → `send_email` — searches are independent; later steps are sequential.",
    exampleSolution:
      "Registry holds four tools with JSON schemas. Steps 1a–1c run in parallel. Step 2 needs merged search results — must be sequential. Validate Notion page ID before email. Monitor: parallel fan-out latency vs an all-sequential baseline.",
    practiceTask:
      "List the tool order for the research workflow. Mark which steps can run in parallel and which must wait for prior output.",
    code: `import asyncio

TOOLS = {
    "web_search": search_fn,
    "summarize": summarize_fn,
    "notion_create_page": notion_fn,
    "send_email": email_fn,
}

async def research_workflow(queries: list[str]):
    >>> search_results = await asyncio.gather(*[TOOLS["web_search"](q) for q in queries])
    summary = TOOLS["summarize"]("\\n".join(search_results))
    page_id = TOOLS["notion_create_page"](summary)
    return TOOLS["send_email"](to="team@co.com", body=f"Page: {page_id}")`,
  },

  "self-correction": {
    example:
      "SQL agent receives `column 'revinue' does not exist` — the error is appended to context, the LLM fixes the typo to `revenue`, and the query succeeds on retry 2.",
    exampleSolution:
      "Detection: programmatic DB error in the observation. Fix: re-prompt with the exact error string. Cap retries at 3; escalate if the same error appears twice. Log every correction for the eval suite. Monitor: retry success rate and mean retries per task.",
    practiceTask:
      "Write three error→fix pairs (schema typo, empty result set, tool timeout). For each, write the exact sentence you would append to the LLM context.",
    code: `MAX_RETRIES = 3
retries = 0
last_error = None

while retries < MAX_RETRIES:
    try:
        >>> result = run_sql(llm_generated_query)
        break
    except DatabaseError as e:
        retries += 1
        if str(e) == last_error:
            raise  # same error twice — escalate
        last_error = str(e)
        llm_generated_query = fix_query_with_error(llm_generated_query, str(e))`,
  },

  "build-first-ai-agent": {
    example:
      "Build an 80-line Python agent with `web_search` and `calculator` tools that answers: 'What is Japan's GDP per capita times 2?'",
    exampleSolution:
      "Loop: user goal → LLM with tool schemas → if tool_calls, execute and append observation → repeat until text answer or max 10 steps. Log every iteration. Test on 5 questions mixing search and math. Monitor: steps used and tool selection accuracy.",
    practiceTask:
      "Build the 2-tool agent with max 10 steps. Log every iteration to the console. Run it on 5 queries (mix search + math) and note where it fails.",
    code: `from openai import OpenAI

client = OpenAI()
tools = [
    {"type": "function", "function": {"name": "web_search", "parameters": {"type": "object", "properties": {"query": {"type": "string"}}}}},
    {"type": "function", "function": {"name": "calculator", "parameters": {"type": "object", "properties": {"expression": {"type": "string"}}}}},
]

def run_agent(goal: str, max_steps: int = 10) -> str:
    messages = [{"role": "user", "content": goal}]
    for step in range(max_steps):
        >>> resp = client.chat.completions.create(model="gpt-4o-mini", messages=messages, tools=tools)
        msg = resp.choices[0].message
        print(f"Step {step + 1}:", msg.tool_calls or msg.content)
        if not msg.tool_calls:
            return msg.content or ""
        messages.append(msg)
        # execute tool, append {"role": "tool", ...}, continue loop
    return "max steps reached"

>>> print(run_agent("Japan GDP per capita times 2 — show sources"))`,
  },
};

export function withAgentPractice(slug: string, input: AgentLessonCore): LessonInput {
  const practice = AGENT_FOUNDATIONS_PRACTICE[slug];
  if (!practice) {
    throw new Error(`Missing Phase 4 practice content for module: ${slug}`);
  }
  return { ...input, ...practice };
}
