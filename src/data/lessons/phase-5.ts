import type { LessonContent } from "../lesson-types";
import { createLesson, iq } from "./builder";

export const phase5Lessons: Record<string, LessonContent> = {
  "what-are-agents": createLesson({
    concept:
      "AI agents are autonomous systems powered by LLMs that perceive their environment through tools and memory, reason about goals, take actions, and iterate until a task is complete — going far beyond single-turn text generation.",
    whyItExists:
      "LLMs alone can only produce text. Real work requires calling APIs, querying databases, browsing the web, writing files, and coordinating multi-step workflows. Agents wrap LLMs in an execution loop with tools and memory, turning a chatbot into a system that actually gets things done.",
    analogy:
      "A chatbot is a consultant who gives advice from a chair. An agent is a consultant who gets up, logs into your systems, pulls the data, drafts the report, sends it for review, and follows up — reporting back at each step.",
    technicalExplanation:
      "An agent has five core components: (1) LLM as the reasoning engine — decides what to do next. (2) Tools/functions — typed interfaces to external systems (search, SQL, email, code execution). (3) Memory — short-term (conversation history) and long-term (vector store, knowledge graph). (4) Planning — optional module that decomposes goals into steps. (5) Orchestration loop — the runtime that executes observe→reason→act cycles until termination. Production agents add: guardrails (input/output validation), observability (tracing every step), cost controls (token budgets, max iterations), human-in-the-loop approval gates, and sandboxed tool execution.",
    architecture:
      "User Goal → Agent Runtime → [Perception (tools + memory) → LLM Reasoning → Action Selection → Tool Execution → State Update] × N iterations → Final Output. The loop is bounded by max_iterations, timeout, and cost budget.",
    diagram: `flowchart TD
    U[User Goal] --> R[Agent Runtime]
    R --> P[Perceive: Tools + Memory]
    P --> LLM[LLM Reasoning Engine]
    LLM --> D{Action or Done?}
    D -->|Action| T[Execute Tool]
    T --> S[Update State + Memory]
    S --> P
    D -->|Done| O[Final Response]
    G[Guardrails] -.-> LLM
    H[Human Approval] -.-> T`,
    example:
      "User: 'Analyze our Q3 sales data and email the summary to the leadership team.' Agent: queries SQL database → aggregates results → generates chart → drafts email → requests human approval → sends via email API → confirms completion.",
    code: `from openai import OpenAI

client = OpenAI()

tools = [
    {"type": "function", "function": {
        "name": "query_database",
        "description": "Run a SQL query on the sales database",
        "parameters": {"type": "object", "properties": {
            "sql": {"type": "string"}
        }, "required": ["sql"]}
    }},
    {"type": "function", "function": {
        "name": "send_email",
        "description": "Send an email to recipients",
        "parameters": {"type": "object", "properties": {
            "to": {"type": "string"}, "subject": {"type": "string"}, "body": {"type": "string"}
        }, "required": ["to", "subject", "body"]}
    }},
]

messages = [{"role": "user", "content": "Analyze Q3 sales and email leadership"}]
# Agent loop: call LLM → if tool_calls → execute → append result → repeat`,
    project:
      "Build a personal assistant agent with 3 tools (web search, calculator, note-taking). Implement the full agent loop with max 10 iterations, logging every step, and a final summary of actions taken.",
    interviewQuestions: [
      iq("What distinguishes an agent from a chatbot?", "Agents have an autonomous loop: they decide which tools to call, execute them, observe results, and iterate until the goal is met. Chatbots respond once per turn with text only.", "easy"),
      iq("What are the five core components of an agent?", "LLM reasoning engine, tools/functions, memory (short + long term), planning module, and orchestration loop. Production adds guardrails, observability, and cost controls.", "medium"),
      iq("How do you prevent agents from causing harm in production?", "Sandboxed tool execution, human-in-the-loop for destructive actions, max iteration limits, input/output guardrails, allowlisted tools, audit logging, and cost/token budgets.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["Agent = LLM + Tools + Memory + Loop", "Observe → Reason → Act → Repeat", "Bounded by max iterations + cost budget", "Production needs guardrails + observability"],
      fifteenMin: ["Five components: LLM, tools, memory, planning, loop", "Tools = typed interfaces to external systems", "Short-term memory = conversation history", "Long-term memory = vector store / knowledge graph", "Human-in-the-loop for destructive actions", "Trace every step for debugging"],
      oneHour: ["Build agent with 3+ tools", "Implement bounded agent loop", "Add step-by-step logging/tracing", "Human approval gate for sensitive tools", "Cost tracking per agent run", "Compare single-agent vs multi-agent for same task"],
      cheatSheet: ["Agent = LLM + Tools + Memory + Loop", "Max iterations prevent runaway", "Sandbox tool execution", "Human approval for writes/deletes", "Trace every step", "Cost budget per run"],
    },
    glossary: ["Agent", "Tool Calling", "Orchestration Loop", "Guardrails", "Human-in-the-Loop", "Agent Runtime"],
    commonMistakes: [
      "No iteration limit — agent runs forever on impossible tasks",
      "Giving agents unrestricted tool access without sandboxing",
      "No observability — impossible to debug agent failures",
      "Treating agents as chatbots with one extra API call",
      "No human approval for destructive actions (delete, send, pay)",
    ],
  }),

  "agent-loop": createLesson({
    concept:
      "The agent loop is the core execution pattern — a continuous cycle of observing state, reasoning about the next action, executing tools, and updating memory until the task is complete or a termination condition is met.",
    whyItExists:
      "Single LLM calls can't handle multi-step tasks. The loop enables sequential decision-making: each iteration sees the results of previous actions and adapts. Without a well-designed loop, agents either stop too early or run indefinitely.",
    analogy:
      "The agent loop is like a GPS navigation system — it shows your current location (observe), plans the next turn (reason), you drive (act), then it recalculates based on where you actually ended up (update state).",
    technicalExplanation:
      "Loop anatomy: (1) Observe — gather current state (tool results, memory, user message). (2) Reason — LLM decides next action or declares completion. (3) Act — execute selected tool with parsed arguments. (4) Update — append tool result to message history, update memory, increment step counter. Termination conditions: LLM returns final answer (no tool call), max_iterations reached, timeout exceeded, cost budget depleted, or unrecoverable error. Production patterns: structured tool call parsing (JSON), retry with backoff on tool failures, parallel tool execution when independent, and streaming intermediate steps to the user.",
    architecture:
      "while not done and step < max_steps: messages = build_context(memory, tool_results) → response = llm(messages, tools) → if tool_calls: execute_all → append_results(messages) → else: return final_answer. Error handler catches tool failures and feeds them back to LLM.",
    diagram: `flowchart TD
    Start([Start]) --> Obs[Observe State]
    Obs --> Build[Build Context Window]
    Build --> LLM[LLM Call with Tools]
    LLM --> Check{Tool Call?}
    Check -->|Yes| Exec[Execute Tool]
    Exec --> Err{Success?}
    Err -->|No| Retry[Feed Error to LLM]
    Retry --> Obs
    Err -->|Yes| Update[Append Result to History]
    Update --> Step{step < max?}
    Step -->|Yes| Obs
    Step -->|No| Timeout[Return Best Effort]
    Check -->|No| Done([Return Final Answer])`,
    example:
      "Task: 'Book a flight to Tokyo next Friday.' Step 1: search_flights('Tokyo', 'next Friday') → 3 options. Step 2: LLM picks cheapest → book_flight(id='JL408') → confirmation. Step 3: LLM returns booking confirmation to user. 3 iterations, done.",
    code: `def agent_loop(client, messages: list, tools: list, max_steps: int = 10) -> str:
    for step in range(max_steps):
        response = client.chat.completions.create(
            model="gpt-4o", messages=messages, tools=tools,
        )
        msg = response.choices[0].message
        if not msg.tool_calls:
            return msg.content or ""
        messages.append(msg)
        for tool_call in msg.tool_calls:
            fn_name = tool_call.function.name
            args = json.loads(tool_call.function.arguments)
            try:
                result = TOOL_REGISTRY[fn_name](**args)
            except Exception as e:
                result = f"Error: {e}"
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": str(result),
            })
    return "Max iterations reached"`,
    project:
      "Implement a production-grade agent loop with: max iterations, timeout, cost tracking, tool error handling, parallel independent tool calls, and step-by-step streaming to the UI.",
    interviewQuestions: [
      iq("What termination conditions should every agent loop have?", "Max iterations (10-25), wall-clock timeout (60-120s), token/cost budget, unrecoverable error (3 consecutive tool failures), and LLM declaring task complete (no tool call).", "medium"),
      iq("How do you handle tool execution failures in the loop?", "Catch exception, append error as tool result message, let LLM decide retry/alternative/abort. Never crash the loop — the LLM can often recover with a different approach.", "easy"),
      iq("When should tools execute in parallel vs sequentially?", "Parallel when independent (search web + query DB simultaneously). Sequential when output of tool A is input to tool B, or when rate limits apply. Most frameworks default to sequential.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["Loop: Observe → Reason → Act → Update → Repeat", "Terminate: no tool call, max steps, timeout, budget", "Feed tool errors back to LLM for recovery", "Stream intermediate steps to user"],
      fifteenMin: ["Build context from memory + tool results each iteration", "Structured JSON tool call parsing", "Retry with backoff on transient failures", "Parallel execution for independent tools", "Cost tracking: tokens × price per step", "Log every iteration for debugging"],
      oneHour: ["Full agent loop implementation", "Error handling and recovery", "Parallel tool execution", "Streaming step updates to UI", "Cost and latency dashboard", "Eval loop on 20 multi-step tasks"],
      cheatSheet: ["while not done: observe→reason→act", "max_steps=10-25", "Feed errors back to LLM", "Parallel independent tools", "Stream steps to user", "Log every iteration"],
    },
    glossary: ["Agent Loop", "Termination Condition", "Tool Execution", "Context Window", "Step Counter", "Streaming"],
    commonMistakes: [
      "No max iteration limit",
      "Crashing on tool errors instead of feeding back to LLM",
      "Not streaming progress — user sees nothing for 30 seconds",
      "Sequential execution of independent tools",
      "No cost tracking — surprise API bills",
    ],
  }),

  planning: createLesson({
    concept:
      "Planning is the agent capability to decompose a complex goal into ordered sub-tasks before execution — creating a roadmap that guides the agent loop and prevents aimless wandering.",
    whyItExists:
      "Without planning, agents react step-by-step with no global view — they backtrack, repeat work, and miss dependencies. Planning front-loads reasoning: 'To book a trip, I need flights first, then hotel, then car rental.' This reduces wasted tool calls and improves success rate on multi-step tasks.",
    analogy:
      "Planning is the difference between a tourist wandering a city randomly versus following a curated itinerary — both might see sights, but the planner hits every must-see efficiently.",
    technicalExplanation:
      "Planning approaches: (1) LLM plan generation — single call produces numbered steps. (2) Hierarchical planning — high-level plan → sub-plans per step. (3) Re-planning — after each step, evaluate if plan still valid, adjust. (4) Plan-and-Execute — separate planner and executor LLMs. Plan format: ordered list of {step, tool, expected_output}. Production: validate plan before execution (are tools available? are steps feasible?), allow human review of plan for high-stakes tasks, and track plan vs actual execution for eval.",
    architecture:
      "Goal → Planner LLM → Plan [Step₁, Step₂, ..., Stepₙ] → Executor Loop (for each step: select tool → execute → verify → next) → Re-planner (on failure) → Final Result.",
    diagram: `flowchart TD
    G[User Goal] --> P[Planner LLM]
    P --> Plan[Step 1: Search flights\\nStep 2: Book hotel\\nStep 3: Send confirmation]
    Plan --> E1[Execute Step 1]
    E1 --> V1{Success?}
    V1 -->|Yes| E2[Execute Step 2]
    V1 -->|No| RP[Re-plan]
    RP --> Plan
    E2 --> E3[Execute Step 3]
    E3 --> Done([Complete])`,
    example:
      "Goal: 'Prepare quarterly board report.' Plan: (1) Query sales DB for Q3 metrics, (2) Generate charts from data, (3) Draft executive summary, (4) Format as PDF, (5) Email to board@company.com. Executor runs each step sequentially, re-plans if Q3 data is incomplete.",
    code: `PLANNER_PROMPT = """Create a step-by-step plan to accomplish this goal.
Return JSON: {"steps": [{"id": 1, "description": "...", "tool": "tool_name", "depends_on": []}]}

Goal: {goal}
Available tools: {tools}"""

def create_plan(goal: str, tools: list) -> list[dict]:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": PLANNER_PROMPT.format(goal=goal, tools=tools)}],
        response_format={"type": "json_object"},
        temperature=0,
    )
    return json.loads(response.choices[0].message.content)["steps"]

def execute_plan(plan: list[dict], tools: dict) -> str:
    results = {}
    for step in plan:
        deps = [results[d] for d in step.get("depends_on", [])]
        result = tools[step["tool"]](step["description"], *deps)
        results[step["id"]] = result
    return results`,
    project:
      "Build a Plan-and-Execute agent: planner generates a 5-step plan, executor runs each step, re-planner adjusts on failure. Compare success rate vs a pure ReAct agent on 10 multi-step tasks.",
    interviewQuestions: [
      iq("Plan-and-Execute vs ReAct — when to use each?", "Plan-and-Execute: well-defined multi-step workflows with known tool sequence (report generation, data pipelines). ReAct: exploratory tasks where next step depends on unexpected results (research, debugging).", "medium"),
      iq("What is re-planning and why is it necessary?", "After a step fails or returns unexpected data, the planner revises remaining steps. Without re-planning, agents blindly follow stale plans. Trigger re-plan on tool failure, timeout, or output mismatch.", "hard"),
      iq("How do you validate a plan before execution?", "Check: all referenced tools exist, no circular dependencies, steps are feasible given current state, and estimated cost/steps within budget. Optionally show plan to human for approval.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["Planning = decompose goal into ordered steps", "Plan-and-Execute: separate planner + executor", "Re-plan when steps fail or surprise results", "Validate plan before execution"],
      fifteenMin: ["LLM generates JSON plan with steps + tools", "Hierarchical: high-level → sub-plans", "Re-planning on failure is critical", "Human review for high-stakes plans", "Track plan vs actual for evaluation", "Dependencies between steps"],
      oneHour: ["Plan-and-Execute agent implementation", "Re-planning on tool failure", "Plan validation before execution", "Compare vs ReAct on 10 tasks", "Human-in-the-loop plan approval", "Hierarchical planning for complex goals"],
      cheatSheet: ["Plan first, execute second", "JSON plan: steps + tools + deps", "Re-plan on failure", "Validate before execute", "ReAct for exploratory tasks", "Human approve high-stakes plans"],
    },
    glossary: ["Planning", "Plan-and-Execute", "Re-Planning", "Hierarchical Planning", "Task Decomposition", "Dependency Graph"],
    commonMistakes: [
      "Rigid plan with no re-planning on failure",
      "Over-planning simple tasks — adds latency for no benefit",
      "Not validating plan feasibility before execution",
      "Plans with circular dependencies",
      "Planner and executor sharing no context about failures",
    ],
  }),

  reasoning: createLesson({
    concept:
      "Reasoning is the agent's ability to think through problems step-by-step before acting — using chain-of-thought, decomposition, and logical inference to make better decisions in the agent loop.",
    whyItExists:
      "Without explicit reasoning, agents jump to tool calls based on surface patterns — calling the wrong API, misinterpreting results, or skipping necessary steps. Reasoning forces the LLM to articulate its logic, dramatically improving accuracy on complex, multi-hop tasks.",
    analogy:
      "Reasoning is the agent showing its work on a math test — the final answer matters, but the step-by-step logic is what prevents careless errors and makes mistakes debuggable.",
    technicalExplanation:
      "Reasoning techniques in agents: (1) Chain-of-Thought (CoT) — 'think step by step' in the agent prompt. (2) Structured reasoning — force Thought/Action/Observation format (ReAct). (3) Self-ask — agent generates sub-questions and answers them before acting. (4) Tree-of-Thoughts — explore multiple reasoning branches. (5) Reasoning models — o1, o3, DeepSeek-R1 trained for extended thinking. Production: allocate reasoning budget (tokens/time), log reasoning traces for debugging, and use reasoning models for planning while faster models handle execution.",
    architecture:
      "Query → Reasoning Module (CoT / ToT / Reasoning Model) → Reasoning Trace → Action Selector → Tool Execution. Reasoning trace stored in memory for reflection and debugging.",
    diagram: `flowchart TD
    Q[Complex Query] --> R[Reasoning Engine]
    R --> T1[Thought: Need sales data first]
    T1 --> T2[Thought: Q3 = Jul-Sep, query accordingly]
    T2 --> T3[Thought: Then compare to Q2 for trend]
    T3 --> A[Action: query_database]
    A --> O[Observation: Results]
    O --> R2[Re-reason with new data]
    R2 --> Final[Final Answer]`,
    example:
      "Question: 'Is our AWS spend trending up or down compared to last quarter?' Agent reasons: need current quarter spend → need last quarter spend → calculate delta → check if increase is across all services or one outlier → then answer with evidence.",
    code: `REASONING_PROMPT = """Solve this task step by step.

Before each action, write your reasoning:
Thought: [analyze current state, what you know, what you need]
Action: [tool_name]
Action Input: [parameters]

After seeing results:
Observation: [what you learned]
Thought: [updated reasoning]

Task: {task}"""

messages = [
    {"role": "system", "content": REASONING_PROMPT.format(task=user_task)},
    {"role": "user", "content": user_task},
]`,
    project:
      "Compare agent performance with and without explicit chain-of-thought reasoning on 15 multi-hop questions. Measure accuracy, number of tool calls, and total tokens used.",
    interviewQuestions: [
      iq("How does chain-of-thought improve agent performance?", "Forces LLM to articulate intermediate logic before acting. Reduces impulsive wrong tool calls. Makes failures debuggable via reasoning trace. Improves accuracy 20-40% on multi-step tasks.", "easy"),
      iq("Reasoning models (o1, o3) vs CoT prompting — tradeoffs?", "Reasoning models: built-in extended thinking, higher quality, slower, more expensive. CoT prompting: works with any model, cheaper, less reliable on hardest problems. Use reasoning models for planning; fast models for execution.", "hard"),
      iq("How do you prevent reasoning from consuming the entire context window?", "Set reasoning token budget, summarize reasoning traces before storing in memory, use structured format (not free-form rambling), and truncate old reasoning when context fills up.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["Reasoning = think before acting", "CoT: 'think step by step' in agent prompt", "Structured: Thought → Action → Observation", "Reasoning traces enable debugging"],
      fifteenMin: ["CoT improves multi-step accuracy 20-40%", "ReAct embeds reasoning in the loop", "Self-ask: generate sub-questions first", "Reasoning models (o1/o3) for hard problems", "Budget reasoning tokens to save context", "Log traces for failure analysis"],
      oneHour: ["CoT vs no-CoT benchmark", "Structured reasoning prompt design", "Reasoning model for planning step", "Token budget for reasoning traces", "Self-ask implementation", "Reasoning trace visualization"],
      cheatSheet: ["Think before acting", "Thought → Action → Observation", "CoT in system prompt", "o1/o3 for hard reasoning", "Budget reasoning tokens", "Log all reasoning traces"],
    },
    glossary: ["Chain-of-Thought", "Reasoning Trace", "Self-Ask", "Reasoning Model", "Multi-Hop Reasoning", "Tree-of-Thoughts"],
    commonMistakes: [
      "No reasoning step — agent jumps to wrong tool calls",
      "Unbounded reasoning consuming entire context window",
      "Not logging reasoning traces — failures are opaque",
      "Using expensive reasoning models for simple tool selection",
      "Free-form reasoning without structured format",
    ],
  }),

  reflection: createLesson({
    concept:
      "Reflection is the agent's ability to evaluate its own outputs and actions — critiquing results, identifying errors, and deciding whether to retry, adjust strategy, or accept the answer.",
    whyItExists:
      "Agents make mistakes: wrong tool arguments, misinterpreted results, incomplete answers. Without reflection, these errors propagate to the final output. Reflection adds a self-correction loop — the agent reviews its work before returning to the user.",
    analogy:
      "Reflection is like a writer reviewing their draft before submitting — catching typos, logical gaps, and unclear sections that seemed fine during writing.",
    technicalExplanation:
      "Reflection patterns: (1) Self-critique — after generating answer, LLM evaluates: 'Is this correct? What's missing?' (2) Verifier agent — separate LLM judges the primary agent's output. (3) Reflexion — store reflections in memory to avoid repeating mistakes. (4) Checklist validation — programmatic checks (did tool return data? is answer formatted correctly?). Production: reflection adds 1-2 LLM calls per task — use for high-stakes outputs, skip for simple lookups. Store reflection insights in long-term memory.",
    architecture:
      "Agent Loop → Draft Answer → Reflection Module (Self-Critique / Verifier) → {Accept | Revise → Re-enter Loop} → Final Answer. Reflection insights stored in episodic memory.",
    diagram: `flowchart TD
    A[Agent Produces Draft] --> R[Reflection Module]
    R --> C{Quality Check}
    C -->|Pass| F[Final Answer]
    C -->|Fail| I[Identify Issues]
    I --> M[Store in Memory]
    M --> L[Re-enter Agent Loop]
    L --> A`,
    example:
      "Agent drafts email to client. Reflection: 'The email mentions Q3 revenue but I never queried the database for Q3 data — I hallucinated the number.' Agent re-enters loop, queries DB, drafts corrected email.",
    code: `REFLECTION_PROMPT = """Review this agent output for errors:

Task: {task}
Agent actions: {actions}
Draft answer: {draft}

Check:
1. Is every claim supported by tool results?
2. Are there hallucinated facts?
3. Is the task fully completed?
4. What should be improved?

Return JSON: {"pass": bool, "issues": [...], "suggestion": "..."}"""

def reflect(task, actions, draft) -> dict:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": REFLECTION_PROMPT.format(
            task=task, actions=actions, draft=draft)}],
        response_format={"type": "json_object"},
        temperature=0,
    )
    return json.loads(response.choices[0].message.content)`,
    project:
      "Add a reflection step to your agent: after draft answer, self-critique and re-enter loop if issues found. Measure accuracy improvement on 20 tasks where the base agent makes errors.",
    interviewQuestions: [
      iq("Self-critique vs verifier agent — tradeoffs?", "Self-critique: same LLM, cheaper, may share blind spots. Verifier: separate LLM, catches more errors, doubles cost. Use verifier for high-stakes; self-critique for routine tasks.", "medium"),
      iq("When should you skip reflection to save latency?", "Simple lookups (weather, single DB query), tasks with programmatic validation, and low-stakes responses. Always reflect on: financial data, external communications, multi-step analysis.", "easy"),
      iq("How does reflection connect to long-term memory?", "Failed reflections generate insights stored in episodic memory: 'When querying sales data, always specify the date range.' Future tasks retrieve these lessons, preventing repeated mistakes.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["Reflection = agent reviews its own output", "Self-critique or separate verifier agent", "Re-enter loop if issues found", "Store insights in long-term memory"],
      fifteenMin: ["Check: claims supported? hallucinations? task complete?", "Self-critique = cheap, verifier = thorough", "Skip reflection for simple lookups", "Reflection adds 1-2 LLM calls", "Reflexion stores lessons in memory", "Programmatic checks + LLM critique"],
      oneHour: ["Self-critique reflection module", "Verifier agent for high-stakes tasks", "Re-enter loop on failure", "Store reflection insights in memory", "Benchmark accuracy with/without reflection", "Selective reflection based on task type"],
      cheatSheet: ["Review before returning", "Self-critique = same LLM", "Verifier = separate LLM", "Skip for simple tasks", "Store lessons in memory", "Re-enter loop on fail"],
    },
    glossary: ["Reflection", "Self-Critique", "Verifier Agent", "Reflexion", "Episodic Memory", "Self-Evaluation"],
    commonMistakes: [
      "Reflection on every task — unnecessary latency and cost",
      "Self-critique only — misses errors the same model makes",
      "Not storing reflection insights for future tasks",
      "Infinite reflection loops — need max retry limit",
      "Reflecting on format but not factual accuracy",
    ],
  }),

  memory: createLesson({
    concept:
      "Agent memory is the persistence layer that lets agents remember past interactions, learned facts, and task context across sessions — transforming stateless LLM calls into agents that learn and adapt over time.",
    whyItExists:
      "Without memory, every agent interaction starts from zero — the agent doesn't know your preferences, past tasks, or lessons learned. Memory enables personalization, continuity, multi-session workflows, and learning from mistakes.",
    analogy:
      "Memory is the difference between a doctor who reads your chart before every visit versus one who has amnesia each time — same skill, vastly different effectiveness.",
    technicalExplanation:
      "Memory tiers: (1) Working memory — current conversation messages in the context window. (2) Short-term memory — recent session history, summarized when context fills. (3) Long-term memory — vector store of facts, preferences, past task outcomes. (4) Episodic memory — specific past experiences with outcomes (Reflexion). (5) Semantic memory — distilled knowledge extracted from episodes. Retrieval: embed current query → search memory store → inject relevant memories into prompt. Production: memory write policies (what to remember?), decay/TTL for stale memories, privacy controls, and memory consolidation (summarize old sessions).",
    architecture:
      "Agent Loop ↔ Working Memory (context window) ↔ Short-Term Store (session) ↔ Long-Term Store (vector DB). Memory Manager: write (extract facts from conversation), read (retrieve relevant memories), consolidate (summarize old sessions).",
    diagram: `flowchart TD
    A[Agent Loop] --> WM[Working Memory\\nContext Window]
    WM --> STM[Short-Term Memory\\nSession History]
    STM --> LTM[Long-Term Memory\\nVector Store]
    LTM --> MR[Memory Retrieval]
    MR --> A
    A --> MW[Memory Write\\nExtract Facts]
    MW --> LTM
    STM --> MC[Consolidation\\nSummarize Old Sessions]
    MC --> LTM`,
    example:
      "User told agent last week: 'I prefer Python over JavaScript.' Today: 'Write me a script to parse CSV.' Agent retrieves preference from long-term memory, generates Python code without asking.",
    code: `class AgentMemory:
    def __init__(self, vector_store):
        self.working = []  # current conversation
        self.vector_store = vector_store

    def remember(self, fact: str, metadata: dict = {}):
        embedding = embed(fact)
        self.vector_store.add(embedding, {"text": fact, **metadata})

    def recall(self, query: str, k: int = 5) -> list[str]:
        results = self.vector_store.search(embed(query), k=k)
        return [r.metadata["text"] for r in results]

    def build_context(self, query: str) -> list[dict]:
        memories = self.recall(query)
        memory_msg = {"role": "system", "content": f"Relevant memories:\\n" + "\\n".join(memories)}
        return [memory_msg] + self.working`,
    project:
      "Build a memory system with working, short-term, and long-term tiers. Agent remembers user preferences across sessions. Test: tell it a preference, start new session, verify it recalls.",
    interviewQuestions: [
      iq("What are the memory tiers in a production agent?", "Working (context window), short-term (session history), long-term (vector store of facts/preferences), episodic (past task experiences), semantic (distilled knowledge). Each tier has different retention and retrieval patterns.", "medium"),
      iq("How do you decide what to store in long-term memory?", "Extract declarative facts (preferences, names, decisions), task outcomes (what worked/failed), and user corrections. Don't store: transient data, full conversation logs, or sensitive info without consent.", "hard"),
      iq("How does memory retrieval work in the agent loop?", "Embed current query/task → search memory vector store → inject top-k relevant memories into system prompt before LLM call. Memory context helps agent personalize and avoid past mistakes.", "easy"),
    ],
    revisionNotes: {
      fiveMin: ["Memory tiers: working → short-term → long-term", "Retrieve relevant memories before each LLM call", "Store facts, preferences, task outcomes", "Consolidate old sessions into summaries"],
      fifteenMin: ["Working memory = context window messages", "Short-term = session, summarized when full", "Long-term = vector store of extracted facts", "Episodic = specific past experiences", "Memory write: extract facts after each task", "Privacy: user controls what's remembered"],
      oneHour: ["Three-tier memory implementation", "Fact extraction from conversations", "Memory retrieval in agent loop", "Session consolidation pipeline", "Cross-session preference recall test", "Memory decay and TTL policies"],
      cheatSheet: ["Working → Short-term → Long-term", "Embed query → retrieve memories", "Extract facts, not full logs", "Consolidate old sessions", "Privacy controls required", "Episodic for Reflexion"],
    },
    glossary: ["Working Memory", "Short-Term Memory", "Long-Term Memory", "Episodic Memory", "Memory Consolidation", "Memory Retrieval"],
    commonMistakes: [
      "Storing entire conversation logs in long-term memory — noisy retrieval",
      "No memory consolidation — context window fills with old messages",
      "Not retrieving memories before LLM calls",
      "No privacy controls on stored personal data",
      "Memory without decay — stale facts persist forever",
    ],
  }),

  "tool-calling": createLesson({
    concept:
      "Tool calling is the mechanism by which agents invoke external functions — the LLM outputs structured JSON specifying which tool to call and with what arguments, and the runtime executes it and returns results.",
    whyItExists:
      "LLMs can't access the internet, databases, or filesystems natively. Tool calling is the bridge — it gives the LLM a typed API to the real world. Every production agent is only as capable as its tool set.",
    analogy:
      "Tool calling is like giving a remote worker a set of authorized system logins — they can't physically touch the servers, but they can operate them through defined interfaces.",
    technicalExplanation:
      "Tool definition: JSON schema with name, description, and parameters (type, required fields, enums). LLM receives tool schemas in the API call and returns tool_calls with function name + arguments. Runtime validates arguments (Pydantic), executes function, returns result as tool message. Best practices: clear descriptions (the LLM chooses tools based on descriptions), minimal parameter sets, idempotent tools when possible, timeout per tool, and sandboxed execution. OpenAI, Anthropic, and Google all support native tool/function calling. MCP standardizes tool interfaces across providers.",
    architecture:
      "Tool Registry (name → function + schema) → LLM API (messages + tools) → Tool Call Parser → Argument Validator → Executor (with timeout + sandbox) → Result → Tool Message → back to LLM.",
    diagram: `flowchart LR
    A[Tool Registry] --> B[LLM API Call]
    B --> C{tool_calls?}
    C -->|Yes| D[Parse Arguments]
    D --> E[Validate Schema]
    E --> F[Execute Tool]
    F --> G[Tool Result Message]
    G --> B
    C -->|No| H[Final Response]`,
    example:
      "Agent needs weather data. LLM returns: tool_call(name='get_weather', args={city: 'Tokyo'}). Runtime calls the weather API, returns {temp: 28, condition: 'sunny'}. LLM uses this to answer the user.",
    code: `from pydantic import BaseModel, Field

class WeatherInput(BaseModel):
    city: str = Field(description="City name")

def get_weather(city: str) -> dict:
    # calls weather API
    return {"temp": 28, "condition": "sunny", "city": city}

tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "parameters": WeatherInput.model_json_schema(),
    }
}]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Weather in Tokyo?"}],
    tools=tools,
)
# Parse: response.choices[0].message.tool_calls[0].function`,
    project:
      "Build a tool registry with 5 tools (search, calculator, file read/write, database query, email). Implement schema validation, timeout, and error handling for each.",
    interviewQuestions: [
      iq("Why are tool descriptions critical?", "The LLM selects tools based solely on name and description — no code access. Vague descriptions cause wrong tool selection. Write descriptions as if explaining to a new employee.", "easy"),
      iq("How do you secure tool execution in production?", "Sandboxed execution, allowlisted tools per agent role, argument validation (Pydantic), timeout per call, no shell access, audit logging, and human approval for destructive operations.", "hard"),
      iq("Native tool calling vs prompt-based (ReAct text)?", "Native: structured JSON, reliable parsing, supported by all major APIs. Prompt-based: works with any model, fragile parsing, legacy approach. Always prefer native tool calling in production.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["Tool calling = LLM outputs structured function calls", "JSON schema defines tool name + parameters", "Runtime validates, executes, returns result", "Clear descriptions = correct tool selection"],
      fifteenMin: ["Pydantic models for argument validation", "Timeout and sandbox per tool execution", "Idempotent tools are safer for retries", "Native tool calling > prompt-based ReAct", "MCP standardizes tool interfaces", "Audit log every tool invocation"],
      oneHour: ["Tool registry with 5+ tools", "Pydantic validation pipeline", "Sandboxed execution environment", "Timeout and retry per tool", "Human approval for destructive tools", "MCP server for tool exposure"],
      cheatSheet: ["JSON schema per tool", "Description = tool selection key", "Pydantic validates args", "Sandbox + timeout", "Native > prompt-based", "Audit every call"],
    },
    glossary: ["Tool Calling", "Function Schema", "Tool Registry", "Sandboxed Execution", "MCP", "Argument Validation"],
    commonMistakes: [
      "Vague tool descriptions causing wrong tool selection",
      "No argument validation — injection and type errors",
      "Unrestricted shell/code execution tools",
      "No timeout — hung tools block the agent loop",
      "Prompt-based tool parsing instead of native calling",
    ],
  }),

  "multi-tool": createLesson({
    concept:
      "Multi-tool orchestration is the agent's ability to select, combine, and chain multiple tools within a single task — calling the right tool at the right time and passing outputs between tools.",
    whyItExists:
      "Real tasks require multiple capabilities: search the web, then query a database, then format results, then send an email. Multi-tool orchestration is what separates a demo agent (one tool) from a production agent (coordinated tool suite).",
    analogy:
      "Multi-tool orchestration is like a chef using knife, stove, and oven in sequence — not just having tools available, but knowing which to use when and how outputs flow between them.",
    technicalExplanation:
      "Patterns: (1) Sequential chaining — tool A output → tool B input. (2) Parallel execution — independent tools run simultaneously. (3) Conditional branching — if search returns nothing, try database. (4) Tool selection via LLM — model picks from registry based on task. (5) Tool composition — wrapper tools that call sub-tools. Production: tool dependency graph, parallel execution with asyncio, fallback tools (search → cache → ask user), and tool usage analytics (which tools are used most, which fail).",
    architecture:
      "Task → Tool Selector (LLM) → Tool DAG (dependency graph) → [Parallel Executor | Sequential Executor] → Result Aggregator → LLM Synthesis.",
    diagram: `flowchart TD
    T[Task] --> S[Tool Selector LLM]
    S --> D{Dependencies?}
    D -->|Independent| P[Parallel Execute]
    D -->|Sequential| SEQ[Chain Execute]
    P --> A[Result Aggregator]
    SEQ --> A
    A --> LLM[Synthesize Final Answer]
    F[Fallback Tools] -.-> S`,
    example:
      "Task: 'Find our top customer this month and draft a thank-you email.' Step 1: query_database('top customer Q4') → {name: 'Acme Corp'}. Step 2: search_web('Acme Corp recent news') → news summary. Step 3: draft_email(name, news) → email draft. Three tools, sequential chain.",
    code: `import asyncio

async def execute_tools_parallel(tool_calls: list) -> list:
    async def run_one(tc):
        fn = TOOL_REGISTRY[tc.function.name]
        args = json.loads(tc.function.arguments)
        return await asyncio.to_thread(fn, **args)
    return await asyncio.gather(*[run_one(tc) for tc in tool_calls])

async def execute_tools_sequential(steps: list[dict]) -> list:
    results = []
    for step in steps:
        context = {"previous_results": results}
        result = await asyncio.to_thread(
            TOOL_REGISTRY[step["tool"]], **step["args"], **context
        )
        results.append(result)
    return results`,
    project:
      "Build a multi-tool agent that chains 4+ tools for a research report task. Implement parallel execution for independent tools and sequential chaining for dependent ones.",
    interviewQuestions: [
      iq("How do you decide parallel vs sequential tool execution?", "Parallel: tools are independent (search + DB query). Sequential: output of A is input to B (query → format → send). LLM can request multiple tool_calls in one turn for parallel execution.", "medium"),
      iq("What is a tool fallback strategy?", "If primary tool fails or returns empty: try alternative (web search → database → ask user). Define fallback chains per tool type. Prevents agent from getting stuck on one failed tool.", "easy"),
      iq("How many tools should an agent have?", "Start with 3-5 essential tools. Add more as needed. Too many tools confuse the LLM (tool selection accuracy drops). Group related tools or use a router agent for large tool sets (>15).", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["Multi-tool = chain and combine tools per task", "Sequential when output feeds next tool", "Parallel when tools are independent", "Fallback chains prevent getting stuck"],
      fifteenMin: ["LLM selects tools from registry per step", "asyncio.gather for parallel execution", "Tool dependency graph for sequencing", "Fallback: primary → alternative → ask user", "3-5 tools optimal, >15 needs routing", "Analytics on tool usage and failure rates"],
      oneHour: ["4-tool sequential chain agent", "Parallel execution with asyncio", "Fallback tool chains", "Tool usage analytics dashboard", "Router agent for 15+ tools", "Error handling across tool chain"],
      cheatSheet: ["Independent = parallel", "Dependent = sequential", "3-5 tools per agent", "Fallback chains per tool", ">15 tools = router agent", "Track usage + failures"],
    },
    glossary: ["Multi-Tool Orchestration", "Tool Chaining", "Parallel Execution", "Fallback Strategy", "Tool Registry", "Tool Router"],
    commonMistakes: [
      "Too many tools — LLM selects wrong ones",
      "Sequential execution of independent tools — wasted latency",
      "No fallback when primary tool fails",
      "Not passing context between chained tools",
      "No analytics on which tools fail most",
    ],
  }),

  "long-term-memory": createLesson({
    concept:
      "Long-term memory gives agents persistent recall across sessions — storing user preferences, learned facts, task outcomes, and domain knowledge in durable storage that survives context window resets.",
    whyItExists:
      "Context windows are finite and sessions end. Without long-term memory, agents forget everything — user preferences, past decisions, lessons from failures. Long-term memory makes agents personal, continuous, and improving over time.",
    analogy:
      "Long-term memory is the agent's notebook that persists after each workday — unlike sticky notes on the desk (context window) that get thrown away when you leave.",
    technicalExplanation:
      "Storage options: vector store (semantic search over memories), knowledge graph (entity relationships), key-value store (structured facts), and SQL database (queryable history). Write pipeline: after each interaction, LLM extracts memorable facts → deduplicate against existing → store with metadata (timestamp, source, confidence). Read pipeline: embed current query → retrieve top-k relevant memories → inject into prompt. Advanced: memory consolidation (merge related facts), decay (reduce weight of old memories), and user-controlled deletion (GDPR). Frameworks: Mem0, Zep, LangMem.",
    architecture:
      "Conversation End → Fact Extractor (LLM) → Deduplication → Vector Store / Knowledge Graph. New Session → Query Embedder → Memory Retrieval → Context Injection → Agent Loop.",
    diagram: `flowchart TD
    C[Conversation] --> E[Fact Extractor LLM]
    E --> D[Deduplication Check]
    D --> VS[(Vector Store)]
    D --> KG[(Knowledge Graph)]
    NS[New Session] --> Q[Embed Query]
    Q --> R[Retrieve Top-K Memories]
    R --> VS
    R --> I[Inject into Agent Prompt]
    I --> AL[Agent Loop]`,
    example:
      "Over 3 months, user tells agent: preferred language (Python), team size (12), current project (payment migration). Months later, new session: 'Write a migration plan.' Agent recalls all context without re-asking.",
    code: `from mem0 import Memory

memory = Memory()

# Store after interaction
memory.add(
    "User prefers Python and works on payment migration project",
    user_id="user_123",
    metadata={"source": "conversation", "confidence": 0.9},
)

# Retrieve in new session
relevant = memory.search(
    query="Write a migration plan",
    user_id="user_123",
    limit=5,
)

context = "\\n".join([m["memory"] for m in relevant["results"]])
messages = [
    {"role": "system", "content": f"User context:\\n{context}"},
    {"role": "user", "content": "Write a migration plan"},
]`,
    project:
      "Implement long-term memory with fact extraction, vector storage, and cross-session recall. Test: 5 sessions over 'days', verify agent remembers cumulative context.",
    interviewQuestions: [
      iq("Vector store vs knowledge graph for agent memory?", "Vector store: flexible, semantic search, good for unstructured facts. Knowledge graph: explicit relationships (user→works_on→project), better for structured queries. Use both: vectors for recall, graph for reasoning.", "hard"),
      iq("How do you prevent memory from growing unbounded?", "Consolidation (merge related facts), decay (reduce relevance of old memories), TTL expiration, max memories per user, and periodic summarization of old sessions into compact facts.", "medium"),
      iq("What facts should agents extract and store?", "User preferences, project context, decisions made, corrections ('no, I meant X'), task outcomes (success/failure), and domain facts. Not: passwords, transient data, or info user didn't intend to persist.", "easy"),
    ],
    revisionNotes: {
      fiveMin: ["Long-term memory persists across sessions", "Extract facts → store in vector DB", "Retrieve relevant memories per query", "User controls what's remembered"],
      fifteenMin: ["Vector store for semantic memory recall", "Knowledge graph for entity relationships", "Fact extraction LLM after each session", "Deduplication before storing", "Consolidation + decay for bounded growth", "GDPR: user can view and delete memories"],
      oneHour: ["Fact extraction pipeline", "Vector store memory with Mem0/Zep", "Cross-session recall test", "Memory consolidation job", "Decay and TTL policies", "User memory management UI"],
      cheatSheet: ["Extract facts, not full logs", "Vector store + optional graph", "Deduplicate before store", "Consolidate + decay", "GDPR delete support", "Mem0/Zep for production"],
    },
    glossary: ["Long-Term Memory", "Fact Extraction", "Memory Consolidation", "Mem0", "Knowledge Graph", "Memory Decay"],
    commonMistakes: [
      "Storing full conversation transcripts — noisy and expensive",
      "No deduplication — same fact stored 50 times",
      "Unbounded memory growth without consolidation",
      "No user control over stored personal data",
      "Retrieving too many memories — pollutes context",
    ],
  }),

  "short-term-memory": createLesson({
    concept:
      "Short-term memory manages the agent's current session context — conversation history, recent tool results, and intermediate state — within the finite context window of the LLM.",
    whyItExists:
      "The context window is the agent's working desk — limited space that fills up during long tasks. Short-term memory management ensures the most relevant information stays in context while older, less relevant content gets summarized or archived to long-term memory.",
    analogy:
      "Short-term memory is your desk during a work session — you keep active documents visible, push completed ones to the filing cabinet (long-term memory), and clear space for new work.",
    technicalExplanation:
      "Strategies: (1) Sliding window — keep last N messages. (2) Summarization — when context fills, LLM summarizes older messages into a compact summary message. (3) Token budgeting — allocate fixed tokens per section (system prompt, memory, tools, history, query). (4) Selective retention — always keep tool results from last 3 steps, summarize older ones. (5) Checkpointing — save full state at key points for recovery. Production: monitor context utilization, trigger summarization at 70% capacity, and preserve critical messages (user instructions, error states).",
    architecture:
      "Messages → Token Counter → {Under Budget: pass through | Over Budget: Summarize oldest → Replace with summary → Archive to long-term}. Critical messages pinned (never summarized).",
    diagram: `flowchart TD
    M[New Message] --> TC[Token Counter]
    TC --> B{Under 70% Budget?}
    B -->|Yes| CW[Add to Context Window]
    B -->|No| SUM[Summarize Oldest Messages]
    SUM --> ARC[Archive to Long-Term Memory]
    SUM --> REP[Replace with Summary]
    REP --> CW
    CW --> LLM[LLM Call]`,
    example:
      "Agent runs 15-step research task. By step 10, context is 80% full. Summarizer compresses steps 1-5 into: 'Researched AI frameworks: LangGraph, CrewAI, AutoGen. Key finding: LangGraph best for stateful workflows.' Steps 6-10 kept in full detail.",
    code: `def manage_context(messages: list, max_tokens: int = 120000) -> list:
    total = count_tokens(messages)
    if total < max_tokens * 0.7:
        return messages

    # Keep system prompt + last 5 messages + summarize the rest
    pinned = [messages[0]]  # system prompt
    recent = messages[-5:]
    to_summarize = messages[1:-5]

    if to_summarize:
        summary = summarize_messages(to_summarize)
        pinned.append({"role": "system", "content": f"Earlier context: {summary}"})

    return pinned + recent`,
    project:
      "Implement context window management with token counting, automatic summarization at 70% capacity, and archiving to long-term memory. Test on a 20-step agent task.",
    interviewQuestions: [
      iq("When should you summarize vs drop old messages?", "Summarize when older messages contain task-relevant context the agent might need. Drop (sliding window) when messages are truly obsolete (greetings, completed sub-tasks). Never drop user instructions or recent tool results.", "medium"),
      iq("How do you allocate tokens across context sections?", "Typical budget: system prompt (10%), retrieved memories (15%), tool schemas (10%), conversation history (50%), current query (15%). Adjust based on task — tool-heavy agents need more schema tokens.", "hard"),
      iq("What messages should never be summarized or dropped?", "Original user goal/instructions, safety guardrails, recent tool results (last 3 steps), and error messages. Losing the original goal causes agent drift.", "easy"),
    ],
    revisionNotes: {
      fiveMin: ["Short-term memory = current session context window", "Summarize at 70% capacity", "Never drop user goal or recent tool results", "Archive summaries to long-term memory"],
      fifteenMin: ["Sliding window for simple sessions", "LLM summarization for long tasks", "Token budget per context section", "Pin critical messages (goal, errors)", "Checkpointing for recovery", "Monitor context utilization"],
      oneHour: ["Token counting implementation", "Auto-summarization at 70%", "Token budget allocation", "Pinned message logic", "Archive to long-term memory", "20-step task without context overflow"],
      cheatSheet: ["Summarize at 70% full", "Pin: goal + last 3 tool results", "Token budget per section", "Archive summaries to LTM", "Sliding window for simple tasks", "Never drop user instructions"],
    },
    glossary: ["Short-Term Memory", "Context Window", "Summarization", "Token Budget", "Sliding Window", "Checkpointing"],
    commonMistakes: [
      "No summarization — context overflow crashes the agent",
      "Summarizing recent tool results — agent loses current state",
      "Dropping the original user goal during long tasks",
      "No token counting — flying blind on context usage",
      "Not archiving summaries to long-term memory",
    ],
  }),

  react: createLesson({
    concept:
      "ReAct (Reasoning + Acting) is the foundational agent pattern that interleaves explicit reasoning thoughts with tool actions in a single loop — the agent thinks, acts, observes, and thinks again.",
    whyItExists:
      "Pure planning can't adapt to surprises. Pure acting without thinking leads to errors. ReAct combines both in every step — the most widely used agent pattern because it's simple, interpretable, and handles unexpected tool results gracefully.",
    analogy:
      "ReAct is a detective at a crime scene: 'The window is broken (observation). Likely forced entry (thought). Let me check for fingerprints (action).' Each step builds on the last.",
    technicalExplanation:
      "ReAct trace format: Thought → Action → Action Input → Observation → Thought → ... → Final Answer. The LLM generates Thoughts (reasoning), selects Actions (tool + args), and processes Observations (tool results). With native tool calling, Thoughts go in the message content and Actions are structured tool_calls. Production: log full ReAct traces for debugging, set max steps (10-15), handle tool errors as Observations, and use few-shot examples in the system prompt for consistent formatting.",
    architecture:
      "User Query → ReAct Loop: [Thought (LLM reasoning) → Action (tool call) → Observation (tool result)] × N → Final Answer. Full trace stored for observability.",
    diagram: `flowchart TD
    Q[Question] --> T1[Thought: I need to find the population]
    T1 --> A1[Action: search\\nInput: Eiffel Tower location]
    A1 --> O1[Observation: Paris, France]
    O1 --> T2[Thought: Now find France population]
    T2 --> A2[Action: search\\nInput: France population 2024]
    A2 --> O2[Observation: 68 million]
    O2 --> T3[Thought: I have the answer]
    T3 --> FA[Final Answer: 68 million]`,
    example:
      "Q: 'What is the stock price of the company that makes the iPhone?' Thought: iPhone is made by Apple. Action: get_stock_price('AAPL'). Observation: $178.50. Final Answer: $178.50.",
    code: `REACT_SYSTEM = """You are a helpful agent. For each step:
1. Thought: reason about what to do
2. Action: call a tool
3. After seeing the result, continue reasoning

Repeat until you can give a Final Answer."""

def react_agent(query: str, tools: list, max_steps: int = 10) -> str:
    messages = [
        {"role": "system", "content": REACT_SYSTEM},
        {"role": "user", "content": query},
    ]
    for step in range(max_steps):
        response = client.chat.completions.create(
            model="gpt-4o", messages=messages, tools=tools,
        )
        msg = response.choices[0].message
        if not msg.tool_calls:
            return msg.content
        messages.append(msg)
        for tc in msg.tool_calls:
            result = execute_tool(tc)
            messages.append({"role": "tool", "tool_call_id": tc.id, "content": str(result)})
    return "Max steps reached"`,
    project:
      "Implement a ReAct agent from scratch with web search and calculator tools. Log full Thought/Action/Observation traces. Test on 10 multi-hop questions.",
    interviewQuestions: [
      iq("Why is ReAct the default agent pattern?", "Simple to implement, interpretable traces, adapts to unexpected results mid-task, works with native tool calling, and proven effective across diverse tasks. Good baseline before trying complex patterns.", "easy"),
      iq("ReAct vs Plan-and-Execute — when to switch?", "Stay with ReAct for exploratory/unknown tasks. Switch to Plan-and-Execute when tasks are repetitive, well-defined, and have predictable tool sequences (e.g., daily report generation).", "medium"),
      iq("How do you debug a failing ReAct agent?", "Read the Thought/Action/Observation trace. Common failures: wrong tool selected (fix description), wrong arguments (improve schema), gave up too early (increase max steps), or hallucinated observation (didn't actually call tool).", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["ReAct = Reasoning + Acting interleaved", "Thought → Action → Observation loop", "Adapts to unexpected tool results", "Default agent pattern — start here"],
      fifteenMin: ["Thought: LLM reasons about current state", "Action: structured tool call", "Observation: tool result fed back", "Full trace logged for debugging", "Max 10-15 steps", "Few-shot examples improve consistency"],
      oneHour: ["ReAct agent from scratch", "Full trace logging", "10 multi-hop question benchmark", "Debug common failure patterns", "Compare with Plan-and-Execute", "Production error handling in loop"],
      cheatSheet: ["Thought → Action → Observation", "Default agent pattern", "Log full traces", "max_steps=10-15", "Native tool calling", "Debug via trace reading"],
    },
    glossary: ["ReAct", "Thought", "Action", "Observation", "Agent Trace", "Interleaved Reasoning"],
    commonMistakes: [
      "No Thought step — agent acts without reasoning",
      "Not logging traces — impossible to debug",
      "Max steps too low — agent gives up on valid tasks",
      "Hallucinated observations — LLM fakes tool results",
      "Using ReAct for predictable repetitive workflows",
    ],
  }),

  "plan-execute": createLesson({
    concept:
      "Plan-and-Execute is an agent architecture with separate planner and executor components — the planner creates a full task plan upfront, and the executor carries out each step, with optional re-planning on failure.",
    whyItExists:
      "ReAct decides one step at a time — efficient for exploration but wasteful for predictable workflows. Plan-and-Execute front-loads the thinking: create a complete plan, then execute efficiently. Better for structured, repeatable tasks where the tool sequence is known.",
    analogy:
      "Plan-and-Execute is like a contractor who draws blueprints before building — more upfront planning, but construction proceeds smoothly without constant redesign.",
    technicalExplanation:
      "Components: (1) Planner — LLM generates ordered steps with tool assignments. (2) Executor — runs each step, passing outputs forward. (3) Re-planner — triggered on step failure, revises remaining plan. (4) Joiner — synthesizes step results into final answer. Variants: LLMCompiler (DAG-based parallel execution), BabyAGI (dynamic task generation). Production: validate plans before execution, human approval for high-stakes plans, track plan adherence metrics, and use faster/cheaper models for execution while reserving capable models for planning.",
    architecture:
      "Goal → Planner LLM → Plan [S1, S2, S3] → Executor(S1) → Executor(S2) → ... → Joiner → Final Answer. Re-planner activates on step failure.",
    diagram: `flowchart TD
    G[Goal] --> PL[Planner LLM]
    PL --> P[Plan: S1→S2→S3→S4]
    P --> E1[Executor: Step 1]
    E1 --> E2[Executor: Step 2]
    E2 --> E3[Executor: Step 3]
    E3 --> J[Joiner LLM]
    J --> A[Final Answer]
    E2 -->|Fail| RP[Re-Planner]
    RP --> P`,
    example:
      "Goal: 'Generate weekly sales report.' Plan: (1) Query DB for weekly sales, (2) Calculate WoW change, (3) Generate chart, (4) Write summary, (5) Save PDF. Executor runs each step. Joiner compiles into final report.",
    code: `def plan_and_execute(goal: str, tools: dict) -> str:
    plan = planner_llm(goal, list(tools.keys()))
    results = {}

    for step in plan["steps"]:
        try:
            result = tools[step["tool"]](**step["args"], context=results)
            results[step["id"]] = result
        except Exception as e:
            remaining = [s for s in plan["steps"] if s["id"] >= step["id"]]
            plan = replanner_llm(goal, remaining, error=str(e))
            continue

    return joiner_llm(goal, results)`,
    project:
      "Build a Plan-and-Execute agent for automated report generation. Compare total tool calls and success rate vs ReAct on 5 structured tasks.",
    interviewQuestions: [
      iq("What tasks are best suited for Plan-and-Execute?", "Structured, repeatable workflows: report generation, data pipelines, onboarding sequences, ETL tasks. Tasks where the tool sequence is predictable and steps have clear dependencies.", "easy"),
      iq("How does re-planning work in Plan-and-Execute?", "When a step fails, the re-planner receives: original goal, completed steps + results, failed step + error, and remaining steps. It generates a revised plan for remaining work. Critical for production reliability.", "medium"),
      iq("Plan-and-Execute vs LLMCompiler?", "Plan-and-Execute: sequential steps, simple. LLMCompiler: builds a DAG, executes independent steps in parallel, more efficient for complex tasks with parallelizable sub-tasks.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["Plan first, execute second", "Separate planner and executor LLMs", "Re-plan on step failure", "Best for structured, repeatable tasks"],
      fifteenMin: ["Planner generates ordered steps + tools", "Executor runs steps sequentially", "Re-planner revises on failure", "Joiner synthesizes final answer", "Validate plan before execution", "Faster model for execution, smarter for planning"],
      oneHour: ["Plan-and-Execute implementation", "Re-planning on failure", "Plan validation logic", "Compare vs ReAct benchmark", "LLMCompiler DAG variant", "Human plan approval gate"],
      cheatSheet: ["Plan → Execute → Join", "Re-plan on failure", "Structured tasks only", "Validate before execute", "Smart planner + fast executor", "LLMCompiler for parallel steps"],
    },
    glossary: ["Plan-and-Execute", "Planner", "Executor", "Re-Planner", "Joiner", "LLMCompiler"],
    commonMistakes: [
      "Using Plan-and-Execute for exploratory tasks — too rigid",
      "No re-planning — stale plan after first failure",
      "Same expensive model for planning and execution",
      "Not validating plan feasibility before execution",
      "Plans without dependency awareness",
    ],
  }),

  "tree-of-thoughts": createLesson({
    concept:
      "Tree of Thoughts (ToT) is an agent reasoning pattern that explores multiple solution paths simultaneously — branching, evaluating, and pruning thoughts like a search tree to find the best approach.",
    whyItExists:
      "ReAct follows a single reasoning path — if the first approach is wrong, it may waste many steps backtracking. ToT explores alternatives in parallel, evaluates each branch, and commits to the most promising — dramatically improving success on complex reasoning tasks.",
    analogy:
      "ToT is like a chess player considering multiple moves ahead — not just playing the first reasonable move, but evaluating several lines of play before choosing the best one.",
    technicalExplanation:
      "ToT algorithm: (1) Generate k candidate thoughts at each step. (2) Evaluate each thought (LLM scores or votes). (3) Prune low-scoring branches. (4) Expand top-b branches. (5) Repeat until solution found or depth limit. Search strategies: BFS (breadth-first, explore all at each level), DFS (depth-first, go deep on best branch). Production: ToT is expensive (k×b LLM calls per level) — use for high-stakes decisions, not routine tasks. Limit depth to 3-4 levels and k to 3-5 candidates.",
    architecture:
      "Problem → Thought Generator (k candidates) → Thought Evaluator (score each) → Prune → Expand top-b → Repeat → Best Path → Execute.",
    diagram: `flowchart TD
    P[Problem] --> T1[Thought A: Query DB]
    P --> T2[Thought B: Search Web]
    P --> T3[Thought C: Check Cache]
    T1 --> E1[Score: 0.8]
    T2 --> E2[Score: 0.6]
    T3 --> E3[Score: 0.3]
    E1 --> T1A[Thought A1: Filter Q3]
    E1 --> T1B[Thought A2: Filter Q4]
    E3 -.->|Pruned| X[Discarded]`,
    example:
      "Task: 'Debug why API latency spiked.' Branch A: check server logs. Branch B: check database queries. Branch C: check network. Evaluator scores A highest (recent deploy correlates). Expands A: check deploy diff → finds memory leak.",
    code: `def tree_of_thoughts(problem: str, k: int = 3, depth: int = 3) -> str:
    def generate_thoughts(state: str, k: int) -> list[str]:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": f"Generate {k} different approaches for: {state}"}],
            temperature=0.7,
        )
        return response.choices[0].message.content.split("\\n")

    def evaluate(state: str, thought: str) -> float:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": f"Score 0-1 how promising: {thought} for {state}"}],
            temperature=0,
        )
        return float(response.choices[0].message.content.strip())

    best_path = search(problem, k, depth, generate_thoughts, evaluate)
    return execute_path(best_path)`,
    project:
      "Implement ToT with BFS search for a puzzle-solving agent. Compare success rate and cost vs ReAct on 10 complex reasoning tasks.",
    interviewQuestions: [
      iq("When is ToT worth the extra cost?", "Complex reasoning with multiple valid approaches: debugging, strategy planning, creative problem-solving. Not worth it for simple lookups or well-defined tool chains. Budget 5-10× more LLM calls than ReAct.", "medium"),
      iq("BFS vs DFS in Tree of Thoughts?", "BFS: explore all branches at each level, pick best globally — better quality, more expensive. DFS: follow most promising branch deep — cheaper, may miss better alternatives. BFS for critical decisions, DFS for cost-sensitive.", "hard"),
      iq("How do you evaluate thoughts in ToT?", "LLM self-evaluation (score 0-1), voting (generate multiple evaluations, majority wins), or heuristic (does this thought lead to a tool call?). Self-evaluation is simplest but can be miscalibrated.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["ToT explores multiple reasoning paths", "Generate k thoughts → evaluate → prune → expand", "5-10× more LLM calls than ReAct", "Use for complex, high-stakes reasoning"],
      fifteenMin: ["BFS: explore all branches per level", "DFS: go deep on best branch", "k=3-5 candidates, depth=3-4 max", "LLM evaluates thought quality", "Prune low-scoring branches early", "Reserve for tasks where ReAct fails"],
      oneHour: ["ToT BFS implementation", "Thought generation + evaluation", "Compare vs ReAct on 10 tasks", "Cost analysis: ToT vs ReAct", "DFS variant for cost savings", "Integration with agent tool execution"],
      cheatSheet: ["k candidates per level", "Evaluate + prune + expand", "BFS = quality, DFS = cost", "depth=3-4 max", "5-10× ReAct cost", "High-stakes only"],
    },
    glossary: ["Tree of Thoughts", "BFS", "DFS", "Thought Evaluation", "Branch Pruning", "Search Strategy"],
    commonMistakes: [
      "Using ToT for simple tasks — massive cost overhead",
      "Too many candidates (k>5) — exponential cost growth",
      "No depth limit — infinite branching",
      "Unreliable thought evaluation — pruning good branches",
      "Not comparing cost/benefit vs simpler ReAct",
    ],
  }),

  reflexion: createLesson({
    concept:
      "Reflexion is an agent learning pattern where the agent reflects on task failures, stores the lessons in memory, and applies them to future attempts — enabling improvement across trials without model retraining.",
    whyItExists:
      "Standard agents repeat the same mistakes every time. Reflexion adds a learning loop: try → fail → reflect on why → store lesson → retry with lesson in context. Agents get better at specific tasks through experience, not weight updates.",
    analogy:
      "Reflexion is like a student who keeps a mistake journal — after each failed test, they write what went wrong and review the journal before the next attempt.",
    technicalExplanation:
      "Reflexion loop: (1) Attempt task. (2) Evaluate outcome (success/failure + score). (3) Generate verbal reflection ('I failed because I didn't specify the date range in the SQL query'). (4) Store reflection in episodic memory. (5) Retry with reflections from past attempts in context. Typically converges in 2-3 trials. Production: reflection storage in vector memory, max trials limit (3-5), evaluator can be LLM or programmatic, and reflections are per-task-type (not global).",
    architecture:
      "Task → Attempt → Evaluator → {Success: Done | Failure: Reflector → Episodic Memory → Retry with Reflections} × max_trials.",
    diagram: `flowchart TD
    T[Task] --> A[Attempt]
    A --> E{Evaluator}
    E -->|Success| D[Done]
    E -->|Fail| R[Generate Reflection]
    R --> M[(Episodic Memory)]
    M --> RT[Retry with Past Reflections]
    RT --> A
    RT -->|Max Trials| F[Best Effort Answer]`,
    example:
      "Trial 1: Agent queries 'sales data' without date filter → wrong results. Reflection: 'Always specify date range for sales queries.' Trial 2: Agent queries 'Q3 2024 sales' → correct results. Lesson stored for future sales tasks.",
    code: `def reflexion_agent(task: str, max_trials: int = 3) -> str:
    reflections = []

    for trial in range(max_trials):
        context = ""
        if reflections:
            context = "Lessons from past attempts:\\n" + "\\n".join(reflections)

        result = agent_attempt(task, context)
        score = evaluate(result, task)

        if score >= 0.9:
            return result

        reflection = generate_reflection(task, result, score)
        reflections.append(reflection)
        store_in_memory(task, reflection)

    return result`,
    project:
      "Implement Reflexion on a coding agent: it writes code, runs tests, reflects on failures, and retries. Measure pass rate improvement across 3 trials on 10 problems.",
    interviewQuestions: [
      iq("Reflexion vs fine-tuning — when to use each?", "Reflexion: immediate, no training data, per-task learning, works with any model. Fine-tuning: permanent weight changes, needs training data, generalizes broadly. Use Reflexion for agent self-improvement; fine-tune for domain knowledge.", "medium"),
      iq("How many trials does Reflexion typically need?", "2-3 trials for most tasks. Diminishing returns after 3 — if still failing, the task may be beyond capability or needs different tools. Set max_trials=3-5 with best-effort fallback.", "easy"),
      iq("What makes a good reflection?", "Specific and actionable: 'I used the wrong API endpoint' not 'I made a mistake.' References the exact error and proposes a concrete fix. Stored reflections should be retrievable by similar future tasks.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["Reflexion = learn from failures via verbal reflection", "Try → fail → reflect → store → retry", "Converges in 2-3 trials", "No model retraining needed"],
      fifteenMin: ["Episodic memory stores reflections", "Evaluator: LLM or programmatic", "Reflections injected into retry context", "Max 3-5 trials before fallback", "Specific, actionable reflections", "Per-task-type learning"],
      oneHour: ["Reflexion loop implementation", "Reflection generation prompt", "Episodic memory storage", "Coding agent with test evaluation", "Pass rate across trials benchmark", "Reflection quality analysis"],
      cheatSheet: ["Try → reflect → retry", "2-3 trials typical", "Specific reflections", "Episodic memory store", "max_trials=3-5", "No retraining needed"],
    },
    glossary: ["Reflexion", "Episodic Memory", "Verbal Reinforcement", "Trial", "Evaluator", "Self-Improvement"],
    commonMistakes: [
      "Vague reflections — 'it didn't work' teaches nothing",
      "Too many trials — wasted cost after 3 failures",
      "Not storing reflections for future similar tasks",
      "Same reflection repeated across trials — no learning",
      "No evaluator — agent doesn't know it failed",
    ],
  }),

  "self-correction": createLesson({
    concept:
      "Self-correction is the agent's ability to detect and fix its own errors during execution — validating outputs, catching mistakes, and retrying with corrections before returning results to the user.",
    whyItExists:
      "Agents produce errors: wrong calculations, hallucinated facts, malformed outputs, incomplete task execution. Self-correction catches these before the user sees them — the difference between a reliable production agent and a demo that works 60% of the time.",
    analogy:
      "Self-correction is spell-check for agent outputs — catching errors automatically before anyone else sees them, and suggesting fixes.",
    technicalExplanation:
      "Correction strategies: (1) Output validation — programmatic checks (JSON schema, regex, range checks). (2) Self-consistency — generate N answers, pick majority. (3) Critic-actor — actor generates, critic evaluates, actor revises. (4) Tool result verification — cross-check LLM claims against actual tool outputs. (5) Constraint checking — verify answer meets user requirements. Production: layer corrections (fast programmatic first, LLM critic for complex), max 2-3 correction attempts, and track correction rate as a quality metric.",
    architecture:
      "Agent Output → Validator (programmatic) → {Pass | Fail → Corrector LLM → Re-validate} → Critic LLM (optional) → {Accept | Revise} → Final Output.",
    diagram: `flowchart TD
    A[Agent Output] --> V[Programmatic Validator]
    V -->|Pass| C[Critic LLM]
    V -->|Fail| CR[Corrector LLM]
    CR --> V
    C -->|Accept| F[Final Output]
    C -->|Reject| CR
    CR -->|Max Retries| W[Best Effort + Warning]`,
    example:
      "Agent calculates '15% of $2,400 = $360.' Validator: 2400 × 0.15 = 360 ✓. Critic: 'Answer is correct but user asked for monthly, not total — $360 is annual.' Corrector revises: '$30/month ($360/year).'",
    code: `def self_correcting_agent(task: str, max_corrections: int = 2) -> str:
    result = agent_run(task)

    for attempt in range(max_corrections + 1):
        validation = programmatic_check(result, task)
        if not validation["pass"]:
            result = corrector_llm(task, result, validation["issues"])
            continue

        critique = critic_llm(task, result)
        if critique["accept"]:
            return result

        result = corrector_llm(task, result, critique["issues"])

    return result  # best effort after max corrections`,
    project:
      "Add self-correction to your agent: programmatic validation + critic LLM. Measure error rate before and after on 20 tasks with known failure modes.",
    interviewQuestions: [
      iq("Programmatic validation vs LLM critic — when to use each?", "Programmatic: fast, reliable for structured outputs (JSON, numbers, formats). LLM critic: catches semantic errors, missing requirements, subtle hallucinations. Layer both: programmatic first, critic for complex.", "medium"),
      iq("What is self-consistency and how does it help?", "Generate N responses (temperature > 0), pick the most common answer (majority vote). Reduces random errors. Expensive (N× cost) — use for high-stakes factual questions, not every task.", "hard"),
      iq("How many correction attempts before giving up?", "Max 2-3 corrections. If still failing, return best effort with a warning to the user. More attempts rarely help and waste tokens. Track correction rate — high rate signals systemic issues.", "easy"),
    ],
    revisionNotes: {
      fiveMin: ["Self-correction catches errors before user sees them", "Programmatic validation first, LLM critic second", "Max 2-3 correction attempts", "Track correction rate as quality metric"],
      fifteenMin: ["JSON schema, regex, range checks", "Self-consistency: N answers, majority vote", "Critic-actor pattern for revision", "Cross-check claims vs tool results", "Constraint checking against requirements", "Best effort + warning after max retries"],
      oneHour: ["Programmatic validator implementation", "Critic-actor correction loop", "Self-consistency for factual tasks", "Error rate before/after benchmark", "Correction rate dashboard", "Layered validation pipeline"],
      cheatSheet: ["Validate → correct → re-validate", "Programmatic first, LLM second", "max_corrections=2-3", "Self-consistency for facts", "Cross-check tool results", "Track correction rate"],
    },
    glossary: ["Self-Correction", "Output Validation", "Self-Consistency", "Critic-Actor", "Constraint Checking", "Correction Rate"],
    commonMistakes: [
      "No validation — errors reach the user",
      "Only LLM critic — slow and expensive for simple checks",
      "Infinite correction loops — need max attempts",
      "Not cross-checking claims against tool results",
      "High correction rate ignored — signals systemic prompt issues",
    ],
  }),

  autonomy: createLesson({
    concept:
      "Autonomy defines how independently an agent operates — from fully human-supervised (approve every action) to fully autonomous (complete tasks without intervention) — and how to calibrate the right level for each use case.",
    whyItExists:
      "Too little autonomy (approve every click) makes agents useless. Too much autonomy (unsupervised financial transactions) is dangerous. Production agents need calibrated autonomy levels that match task risk, user trust, and regulatory requirements.",
    analogy:
      "Autonomy levels are like a driver's license progression — learner's permit (supervised), independent driver (most tasks), commercial license (high-stakes operations with extra checks).",
    technicalExplanation:
      "Autonomy spectrum: (1) Suggest-only — agent proposes actions, human executes. (2) Confirm — agent acts after human approval per step. (3) Supervised — agent acts autonomously, human reviews results. (4) Autonomous — agent completes tasks independently, human reviews periodically. (5) Fully autonomous — no human in loop. Calibration factors: action reversibility (delete vs read), financial impact, data sensitivity, regulatory requirements, and user preference. Production: autonomy policies per tool (read=autonomous, write=confirm, delete=supervised), escalation on uncertainty, and audit trail for all actions.",
    architecture:
      "Task → Risk Classifier → Autonomy Policy Engine → {Suggest | Confirm | Execute} → Action → Audit Log. Escalation triggers: high-risk action, low confidence, repeated failures, budget exceeded.",
    diagram: `flowchart TD
    T[Task] --> RC[Risk Classifier]
    RC --> AP{Autonomy Policy}
    AP -->|Low Risk| AUTO[Execute Autonomously]
    AP -->|Medium Risk| CONF[Request Confirmation]
    AP -->|High Risk| SUP[Supervised Mode]
    CONF --> H{Human Approves?}
    H -->|Yes| AUTO
    H -->|No| REJ[Reject + Explain]
    AUTO --> AL[Audit Log]
    SUP --> AL`,
    example:
      "Email agent: reading inbox = autonomous. Drafting reply = confirm (show draft, user approves). Sending to external contacts = supervised (manager reviews). Deleting emails = blocked (not in allowlist).",
    code: `AUTONOMY_POLICIES = {
    "read_email": "autonomous",
    "draft_email": "confirm",
    "send_email": "supervised",
    "delete_email": "blocked",
    "query_database": "autonomous",
    "update_database": "confirm",
    "transfer_funds": "blocked",
}

def execute_with_autonomy(tool_name: str, args: dict, user_id: str) -> dict:
    policy = AUTONOMY_POLICIES.get(tool_name, "confirm")

    if policy == "blocked":
        return {"status": "blocked", "reason": f"{tool_name} is not permitted"}

    if policy == "confirm":
        approval = request_human_approval(user_id, tool_name, args)
        if not approval:
            return {"status": "rejected"}

    result = execute_tool(tool_name, args)
    audit_log(user_id, tool_name, args, result)
    return {"status": "success", "result": result}`,
    project:
      "Build an autonomy policy engine: classify 10 tools by risk level, implement confirm/supervised/autonomous modes, and create an audit log dashboard showing all agent actions.",
    interviewQuestions: [
      iq("How do you determine the right autonomy level for a tool?", "Assess: reversibility (can you undo?), impact (financial, data, reputation), regulatory requirements, and user trust. Read operations = autonomous. Write = confirm. Financial/delete = supervised or blocked.", "medium"),
      iq("What is human-in-the-loop and when is it required?", "Human approves agent actions before execution. Required for: irreversible actions, financial transactions, external communications, data deletion, and any action exceeding confidence threshold.", "easy"),
      iq("How do you increase autonomy safely over time?", "Start supervised, track success rate per tool, promote tools to autonomous after N successful supervised executions, maintain audit trail, and allow users to override autonomy levels.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["Autonomy = how independently agent acts", "Spectrum: suggest → confirm → supervised → autonomous", "Risk-based policies per tool", "Audit log every action"],
      fifteenMin: ["Read=autonomous, write=confirm, delete=blocked", "Human-in-the-loop for irreversible actions", "Escalation on low confidence or failures", "Start supervised, promote with track record", "User-configurable autonomy preferences", "Regulatory compliance drives minimum supervision"],
      oneHour: ["Autonomy policy engine", "Risk classifier per tool", "Human approval workflow", "Audit log dashboard", "Gradual autonomy promotion", "User autonomy preference settings"],
      cheatSheet: ["Risk-based per tool", "Read=auto, write=confirm, delete=block", "Audit everything", "Start supervised", "Promote with track record", "Human-in-loop for irreversible"],
    },
    glossary: ["Autonomy", "Human-in-the-Loop", "Autonomy Policy", "Risk Classification", "Audit Trail", "Escalation"],
    commonMistakes: [
      "Full autonomy on all tools — dangerous in production",
      "Requiring approval for every action — agent is useless",
      "No audit trail — can't investigate incidents",
      "Static autonomy levels — not adapting to agent track record",
      "Ignoring regulatory requirements for human oversight",
    ],
  }),
};
