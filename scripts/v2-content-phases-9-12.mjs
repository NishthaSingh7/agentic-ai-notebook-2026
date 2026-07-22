/**
 * Topic-specific lesson content for roadmap phases 9–12.
 * Imported by scripts/generate-v2-lessons.mjs
 */
export const topics = {
  // ── Phase 9: Production Agent Engineering ──────────────────────────

  fastapi: {
    concept:
      "FastAPI is a modern Python web framework for building high-performance HTTP APIs with automatic OpenAPI docs, Pydantic validation, and native async support — the standard way to expose agent endpoints in production.",
    why: "Agents need a reliable HTTP layer for chat, tool calls, webhooks, and health checks. FastAPI gives you typed request/response models, dependency injection, and async I/O so one process can handle many concurrent agent sessions without blocking on LLM latency.",
    analogy:
      "FastAPI is the reception desk for your agent — it validates who is asking, routes requests to the right handler, and returns structured responses while the agent works in the back office.",
    technical:
      "Define routes with `@app.post('/chat')`, use Pydantic models for input validation, inject services via `Depends()`, and run async handlers with `await` for LLM and DB calls. Mount streaming endpoints with `StreamingResponse` for token-by-token output. Use lifespan events for startup/shutdown (load models, close pools). Deploy behind Uvicorn/Gunicorn with multiple workers; add middleware for auth, CORS, rate limiting, and request IDs for tracing.",
    example:
      "A support agent API: POST /chat accepts `{session_id, message}`, loads conversation history from Redis, runs the LangGraph agent, streams tokens back via SSE, and persists the final turn to Postgres.",
    code: `from fastapi import FastAPI, Depends
from pydantic import BaseModel
from fastapi.responses import StreamingResponse

app = FastAPI(title="Agent API")

class ChatRequest(BaseModel):
    session_id: str
    message: str

@app.post("/chat")
async def chat(req: ChatRequest, agent=Depends(get_agent)):
    history = await load_history(req.session_id)
    async def token_stream():
        async for chunk in agent.astream(req.message, history):
            yield chunk
    return StreamingResponse(token_stream(), media_type="text/event-stream")`,
    glossary: ["Pydantic", "Dependency Injection", "SSE", "Uvicorn"],
  },

  docker: {
    concept:
      "Docker packages your agent application — code, dependencies, and runtime — into immutable containers that run identically on every machine, from laptop to cloud.",
    why: "Agent stacks are fragile: Python version mismatches, system libraries for Playwright, pinned LLM SDK versions. Docker eliminates 'works on my machine' and gives you reproducible builds, isolated environments, and a standard deploy artifact for Kubernetes or any cloud.",
    analogy:
      "Docker is a shipping container for software — whatever you pack inside arrives intact at any port, without the recipient installing your exact toolbox.",
    technical:
      "Write a multi-stage Dockerfile: builder stage installs deps with `pip install`, runtime stage copies only what's needed. Use `.dockerignore` to exclude `.git`, `__pycache__`, and secrets. Set `ENV` for non-secret config; inject API keys at runtime via env vars or secrets managers. For Playwright/browser agents, use official base images with preinstalled browsers. Health-check with `HEALTHCHECK CMD curl -f http://localhost:8000/health`. Tag images with git SHA, not `latest`.",
    example:
      "Containerize a FastAPI agent: Dockerfile installs requirements, copies `app/`, exposes port 8000, runs Uvicorn. CI builds the image, pushes to ECR, and Kubernetes pulls the tagged image on deploy.",
    code: `# Dockerfile (multi-stage)
FROM python:3.12-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY app/ ./app/
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`,
    glossary: ["Container", "Image", "Multi-stage Build", "HEALTHCHECK"],
  },

  kubernetes: {
    concept:
      "Kubernetes (K8s) orchestrates containerized workloads — scheduling, scaling, networking, and self-healing — so agent services stay available under load and recover from failures automatically.",
    why: "A single Docker container can't survive node crashes, roll out zero-downtime updates, or scale to 50 replicas during a product launch. K8s manages the lifecycle of agent pods, load balances traffic, and integrates with secrets, config maps, and autoscaling.",
    analogy:
      "Kubernetes is an air-traffic control tower for containers — it decides which runway (node) each plane (pod) uses, reroutes when one goes down, and adds more gates when passenger volume spikes.",
    technical:
      "Core objects: Deployment (desired replica count + rolling updates), Service (stable internal DNS + load balancing), Ingress (external HTTPS routing), ConfigMap/Secret (env config), HPA (horizontal pod autoscaler on CPU or custom metrics like queue depth). Use liveness/readiness probes so K8s restarts unhealthy pods and stops sending traffic until the agent is ready. For GPU workloads, use node selectors or taints/tolerations. Consider KEDA for queue-driven scaling of agent workers.",
    example:
      "Deploy an agent API as a Deployment with 3 replicas, expose via ClusterIP Service, route `api.example.com/agent` through Ingress with TLS, and HPA scales 3→20 pods when p95 latency exceeds 2s.",
    code: `# deployment.yaml (excerpt)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agent-api
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: agent
          image: myregistry/agent-api:v1.2.0
          ports:
            - containerPort: 8000
          readinessProbe:
            httpGet:
              path: /health
              port: 8000
          envFrom:
            - secretRef:
                name: openai-key`,
    glossary: ["Pod", "Deployment", "HPA", "Ingress"],
  },

  "async-agents": {
    concept:
      "Async agents use non-blocking I/O (async/await) so a single process can juggle many concurrent agent runs — waiting on LLM APIs, databases, and tools without tying up a thread per request.",
    why: "LLM calls take 2–30 seconds. Blocking synchronous code means one request = one thread = poor resource utilization. Async lets you serve hundreds of concurrent sessions on modest hardware, which is essential for chat APIs and webhook-driven agents.",
    analogy:
      "A synchronous agent is a waiter who stands at one table until the kitchen finishes. An async agent takes new orders while others cook, checking back when each dish is ready.",
    technical:
      "Use `async def` handlers in FastAPI, `await client.chat.completions.create()` with async OpenAI/Anthropic SDKs, and `asyncio.gather()` for parallel tool calls. LangGraph and LangChain support `astream`/`ainvoke`. Watch for blocking calls inside async code — wrap CPU-bound or sync-only libraries with `asyncio.to_thread()`. Use connection pools for async DB drivers (asyncpg, aioredis). Set timeouts on every external call to prevent hung coroutines.",
    example:
      "An agent receives 200 concurrent chat requests. Each awaits the LLM without blocking others; parallel tool calls (web search + DB lookup) run via `asyncio.gather`, cutting latency from 8s to 4s.",
    code: `import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI()

async def run_agent(user_msg: str) -> str:
    # Parallel tool calls
    search, db = await asyncio.gather(
        web_search(user_msg),
        fetch_user_context(user_msg),
    )
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": f"{search}\\n{db}\\n{user_msg}"}],
    )
    return response.choices[0].message.content`,
    glossary: ["async/await", "asyncio.gather", "Non-blocking I/O", "Connection Pool"],
  },

  queues: {
    concept:
      "Message queues decouple agent request producers (API, webhooks, schedulers) from consumers (worker processes), buffering work and enabling reliable, retryable background agent execution.",
    why: "Long-running agent tasks (research reports, batch evals, multi-step workflows) shouldn't block HTTP responses. Queues absorb traffic spikes, survive consumer crashes via message persistence, and let you scale workers independently of the API tier.",
    analogy:
      "A queue is a ticket counter at a deli — customers take a number and leave; staff call numbers when ready. No one crowds the counter, and orders aren't lost if a cook steps out.",
    technical:
      "Popular choices: Redis (BullMQ, RQ), RabbitMQ, AWS SQS, Google Pub/Sub. Messages carry job payload + metadata (idempotency key, retry count, priority). Workers pull messages, process, then ack or nack. Use dead-letter queues (DLQ) for poison messages. Set visibility timeout > max job duration. For agent jobs, include `trace_id` in every message for end-to-end observability. Idempotency keys prevent duplicate side effects on retry.",
    example:
      "User submits 'generate quarterly report' via API → API enqueues job `{job_id, user_id, query}` → returns 202 Accepted → worker picks up job, runs 5-minute agent pipeline, stores result in S3, notifies user via webhook.",
    code: `import json
import redis

r = redis.Redis()

def enqueue_agent_job(job_id: str, payload: dict) -> None:
    r.lpush("agent:jobs", json.dumps({"job_id": job_id, **payload}))

def worker_loop():
    while True:
        _, raw = r.brpop("agent:jobs", timeout=5)
        job = json.loads(raw)
        try:
            result = run_agent_pipeline(job)
            store_result(job["job_id"], result)
        except Exception:
            r.lpush("agent:dlq", raw)  # dead-letter queue`,
    glossary: ["Dead-Letter Queue", "Idempotency Key", "Visibility Timeout", "Ack/Nack"],
  },

  workers: {
    concept:
      "Workers are background processes that pull jobs from a queue and execute agent logic — tool calls, LLM chains, file processing — outside the request/response cycle of your API.",
    why: "Separating API from compute lets you scale each independently, retry failed agent runs without the user waiting, and run resource-heavy tasks (browser automation, large PDF parsing) on machines tuned for that workload.",
    analogy:
      "Workers are kitchen staff behind the counter — the front desk (API) takes orders fast; the kitchen (workers) does the slow cooking without making customers stand at the register.",
    technical:
      "Run workers as separate processes or containers (Celery, RQ, BullMQ, custom poll loops). Each worker should be stateless — all state in DB/Redis/S3. Implement graceful shutdown (finish current job before exit). Concurrency per worker: 1 for GPU-bound, N for I/O-bound async workers. Use heartbeats and job timeouts. Scale worker count based on queue depth (KEDA, custom autoscaler). Log `job_id` and `trace_id` on every line.",
    example:
      "Three Celery workers consume from `agent.tasks` queue. Each runs a LangGraph agent for document summarization. On failure, Celery retries 3× with exponential backoff, then moves to DLQ for manual review.",
    code: `from celery import Celery

app = Celery("agent", broker="redis://localhost:6379/0")

@app.task(bind=True, max_retries=3, default_retry_delay=60)
def summarize_document(self, doc_id: str) -> dict:
    try:
        text = fetch_document(doc_id)
        summary = run_summarization_agent(text)
        save_summary(doc_id, summary)
        return {"doc_id": doc_id, "status": "done"}
    except TransientError as exc:
        raise self.retry(exc=exc)`,
    glossary: ["Celery", "Graceful Shutdown", "Stateless Worker", "Retry Backoff"],
  },

  streaming: {
    concept:
      "Streaming sends agent output incrementally — token by token or event by event — so users see progress in real time instead of waiting for the full response to complete.",
    why: "LLM responses can take 10+ seconds. Streaming cuts perceived latency dramatically, lets users cancel mid-generation, and enables progressive UI (typing indicators, partial tool results). It's now expected in production chat interfaces.",
    analogy:
      "Streaming is like watching a live sports broadcast instead of waiting for the full match recording — you see action as it happens.",
    technical:
      "Server-Sent Events (SSE) over HTTP: `data: {\"token\": \"Hello\"}\n\n`. WebSockets for bidirectional (voice, collaborative editing). In FastAPI: `StreamingResponse(generator, media_type='text/event-stream')`. OpenAI/Anthropic SDKs expose `stream=True` with async iterators. LangGraph `astream_events` emits node-level events (tool start, tool end, LLM chunk). Buffer and flush carefully; set proxy timeouts (nginx `proxy_read_timeout`). Handle client disconnect to stop token generation and save cost.",
    example:
      "Chat UI opens SSE connection to `/chat/stream`. As the agent reasons, tokens appear word-by-word. When a tool runs, UI shows 'Searching web…' from a `tool_start` event, then injects results into the stream.",
    code: `from openai import AsyncOpenAI

client = AsyncOpenAI()

async def stream_chat(messages: list):
    stream = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        stream=True,
    )
    async for chunk in stream:
        token = chunk.choices[0].delta.content
        if token:
            yield f"data: {json.dumps({'token': token})}\\n\\n"`,
    glossary: ["SSE", "WebSocket", "astream", "Perceived Latency"],
  },

  scaling: {
    concept:
      "Scaling agent systems means adding capacity — more API replicas, more workers, bigger models, or smarter routing — so throughput and latency stay acceptable as users and workload complexity grow.",
    why: "A demo handling 5 users breaks at 500. Agent workloads are spiky (product launches, batch jobs) and expensive (LLM tokens, GPU). Without a scaling strategy, you get timeouts, runaway bills, or both.",
    analogy:
      "Scaling is adding lanes to a highway before rush hour — you expand capacity before traffic jams form, not after cars are stuck for miles.",
    technical:
      "Horizontal scaling: more stateless API pods behind a load balancer; more queue workers. Vertical scaling: larger instances for GPU inference. Caching: semantic cache for repeated queries, prompt cache for system prompts. Model routing: cheap model for simple queries, expensive model for hard ones. Rate limiting per user/API key. Autoscaling triggers: CPU, request rate, queue depth, p95 latency. Shard by tenant for multi-tenant isolation. Pre-warm replicas before known traffic events.",
    example:
      "Router classifies queries: 70% go to gpt-4o-mini (fast/cheap), 25% to gpt-4o, 5% to o1 for reasoning. API autoscales 3→15 pods at 1000 RPM. Workers scale 5→50 on queue depth > 100.",
    glossary: ["Horizontal Scaling", "Semantic Cache", "Model Routing", "Autoscaling"],
  },

  monitoring: {
    concept:
      "Monitoring for agent systems tracks health, latency, errors, token usage, and tool-call outcomes across the full request lifecycle — so you detect problems before users report them.",
    why: "Agents fail silently: hallucinated answers look like success, tool timeouts return empty strings, costs spike from runaway loops. Without observability, you're flying blind in production.",
    analogy:
      "Monitoring is the instrument panel in a cockpit — altitude, fuel, engine warnings. You don't wait for passengers to scream before checking the gauges.",
    technical:
      "Three pillars: metrics (Prometheus/Datadog — request rate, p50/p95 latency, error rate, tokens/request, cost/request), logs (structured JSON with trace_id, session_id, model, tool names), traces (OpenTelemetry/LangSmith/Langfuse — span per LLM call, tool invocation, retrieval step). Alert on: error rate > 1%, p95 > 10s, cost/hour anomaly, DLQ depth. Dashboards per agent version. SLOs: 99% of chats respond first token < 3s.",
    example:
      "Langfuse trace shows a 45s request: 30s spent in a retried web-scrape tool. Alert fires on p95 > 15s. Engineer adds timeout + fallback, latency drops to 6s.",
    code: `from opentelemetry import trace
from opentelemetry.trace import Status, StatusCode

tracer = trace.get_tracer("agent")

async def call_llm(prompt: str) -> str:
    with tracer.start_as_current_span("llm.call") as span:
        span.set_attribute("model", "gpt-4o-mini")
        span.set_attribute("prompt.length", len(prompt))
        try:
            result = await llm.invoke(prompt)
            span.set_attribute("tokens.output", result.usage.completion_tokens)
            return result.content
        except Exception as e:
            span.set_status(Status(StatusCode.ERROR, str(e)))
            raise`,
    glossary: ["OpenTelemetry", "Langfuse", "SLO", "Dead-Letter Queue"],
  },

  "cost-optimization": {
    concept:
      "Cost optimization reduces the dollar spend of running agents — LLM tokens, compute, storage, and third-party APIs — without sacrificing acceptable quality for each use case.",
    why: "Agent costs scale with usage, not seats. A runaway agent loop or unbounded context window can burn thousands of dollars overnight. Production teams need deliberate strategies to control spend while maintaining user experience.",
    analogy:
      "Cost optimization is meal planning for a restaurant — you buy ingredients in bulk, portion carefully, and use cheaper substitutes where diners won't notice the difference.",
    technical:
      "Tactics: model routing (mini for drafts, flagship for final), prompt compression (summarize history instead of sending full transcript), semantic caching (return cached answer for similar queries), set `max_tokens` and turn limits, batch API for non-real-time jobs (50% cheaper), use smaller embeddings, truncate retrieval to top-3 chunks, monitor cost per session/user/feature. Budget alerts in cloud billing. A/B test quality vs cost tradeoffs with eval suites.",
    example:
      "Support agent caches answers for top 200 FAQs (semantic similarity > 0.95) — 40% of queries hit cache at $0. Summarizes conversation every 10 turns instead of sending full history — token usage drops 60%.",
    code: `def route_model(query: str, history_len: int) -> str:
    if is_faq(query) and cache_hit(query):
        return "cached"  # $0
    if len(query) < 100 and history_len < 3:
        return "gpt-4o-mini"  # cheap
    if requires_reasoning(query):
        return "o1-mini"
    return "gpt-4o-mini"`,
    glossary: ["Semantic Cache", "Model Routing", "Token Budget", "Batch API"],
  },

  // ── Phase 10: Agent Design Patterns ────────────────────────────────

  react: {
    concept:
      "ReAct (Reason + Act) is an agent pattern where the LLM alternates between reasoning steps (Thought) and executing tools (Action), observing results (Observation) in a loop until it can answer.",
    why: "Pure chain-of-thought can't use external data. ReAct grounds the agent in real tool outputs — search results, DB rows, API responses — reducing hallucination and enabling multi-step problem solving.",
    analogy:
      "ReAct is a detective who thinks aloud ('I should check the alibi'), then acts ('interview the witness'), then updates their theory based on what they learn — repeating until the case is solved.",
    technical:
      "Prompt format: Thought → Action → Action Input → Observation (repeat) → Final Answer. Implement with LangChain `create_react_agent` or LangGraph ReAct node. Parser extracts tool name + args from LLM output; executor runs tool and appends observation to context. Set max iterations (5–15) to prevent infinite loops. Use structured tool schemas (JSON) instead of free-text when possible for reliability.",
    example:
      "User asks 'What's the weather in Tokyo and should I pack an umbrella?' Agent thinks → calls weather API → observes 'rain expected' → thinks → answers 'Yes, bring an umbrella.'",
    code: `# ReAct loop (simplified)
for step in range(MAX_STEPS):
    response = llm.invoke(messages)
    if "Final Answer:" in response:
        break
    action, args = parse_action(response)
    observation = tools[action].run(**args)
    messages.append({"role": "assistant", "content": response})
    messages.append({"role": "user", "content": f"Observation: {observation}"})`,
    glossary: ["Thought-Action-Observation", "Tool Parser", "Max Iterations", "Grounding"],
  },

  "plan-execute": {
    concept:
      "Plan & Execute separates planning from execution: a planner LLM decomposes the goal into steps, then an executor (often a cheaper/faster model) carries out each step with tools.",
    why: "ReAct interleaves thinking and acting, which can be wasteful for complex tasks. Separating planning lets you use a strong model once for the plan and a fast model for execution, improving reliability and cost efficiency on multi-step workflows.",
    analogy:
      "Plan & Execute is a contractor who draws blueprints first, then sends specialized crews (electrician, plumber) to execute each phase — instead of figuring out wiring while already tiling the bathroom.",
    technical:
      "Phase 1 — Planner: given goal + tool list, output structured plan `[{step, tool, args}]`. Phase 2 — Executor: iterate steps, call tools, pass results forward. Re-plan on failure (dynamic replanning). LangGraph: `plan_node → execute_node → (replan|end)`. Store plan in state for observability. Validate plan schema before execution.",
    example:
      "Goal: 'Summarize competitor pricing from these 3 URLs.' Planner outputs: 1) scrape URL A, 2) scrape B, 3) scrape C, 4) compare and summarize. Executor runs each scrape, then synthesis step.",
    code: `plan = planner.invoke(f"Goal: {goal}\\nTools: {tool_descriptions}")
for step in plan.steps:
    result = executor.invoke(f"Execute: {step.description}\\nContext: {context}")
    context[step.id] = result
final = synthesizer.invoke(f"Goal: {goal}\\nResults: {context}")`,
    glossary: ["Planner", "Executor", "Replanning", "Structured Plan"],
  },

  reflexion: {
    concept:
      "Reflexion is a pattern where the agent critiques its own output, stores lessons in memory, and retries with improved strategies — learning from failure without model fine-tuning.",
    why: "One-shot generation often produces wrong code, bad plans, or hallucinated facts. Reflexion adds a self-correction loop that dramatically improves success rates on coding and reasoning benchmarks.",
    analogy:
      "Reflexion is a student who checks their homework against the answer key, writes 'I forgot to carry the tens' in a notebook, and does the next problem correctly — without needing a new teacher.",
    technical:
      "Loop: generate → evaluate (heuristic, test runner, or critic LLM) → if fail, reflect ('what went wrong?') → append reflection to memory → retry with reflection in context. Memory can be episodic (this session) or persistent (vector store of past reflections). Cap retries at 3–5. Use execution feedback (unit test results, compiler errors) as the strongest signal.",
    example:
      "Agent writes Python function → test fails with TypeError → reflects 'didn't handle None input' → rewrites with guard clause → tests pass.",
    code: `for attempt in range(MAX_RETRIES):
    code = generator.invoke(task + "\\n" + "\\n".join(reflections))
    result = run_tests(code)
    if result.passed:
        break
    reflection = critic.invoke(f"Task: {task}\\nCode: {code}\\nError: {result.error}")
    reflections.append(reflection)`,
    glossary: ["Self-Critique", "Episodic Memory", "Execution Feedback", "Retry Loop"],
  },

  "tree-of-thoughts": {
    concept:
      "Tree of Thoughts (ToT) explores multiple reasoning paths in parallel, evaluates each branch, and expands the most promising ones — like a search tree over LLM-generated thoughts.",
    why: "Greedy single-path reasoning (standard CoT) gets stuck on hard problems. ToT explores alternatives ('approach A vs B'), backtracks from dead ends, and finds better solutions for puzzles, math, and planning tasks.",
    analogy:
      "ToT is a chess player considering several moves deep, evaluating each position, and pruning bad lines — instead of playing the first move that looks okay.",
    technical:
      "Generate k candidate thoughts per step. Evaluate each with a value function (LLM scorer or heuristic). Select top-b branches to expand. Repeat until solution found or depth limit. Implement BFS or DFS over thought nodes. Cost is high (many LLM calls) — use for hard problems only. LangGraph can model this as a conditional graph with eval nodes.",
    example:
      "Math problem: generate 3 solution approaches → score each → expand top 2 → one branch reaches correct answer → return it.",
    code: `frontier = [initial_state]
for depth in range(MAX_DEPTH):
    candidates = []
    for state in frontier:
        thoughts = generate_thoughts(state, k=3)
        for t in thoughts:
            score = evaluate(t)
            candidates.append((score, t))
    frontier = [t for _, t in sorted(candidates, reverse=True)[:2]]
    if any(is_solution(s) for s in frontier):
        break`,
    glossary: ["Branching Factor", "Value Function", "BFS/DFS", "Pruning"],
  },

  "graph-of-thoughts": {
    concept:
      "Graph of Thoughts (GoT) generalizes Tree of Thoughts by allowing thoughts to merge, split, and reference each other in a DAG — not just a tree — enabling synthesis of multiple reasoning paths.",
    why: "Real problem-solving combines insights from different approaches. GoT lets an agent explore parallel ideas and then merge compatible partial solutions, outperforming ToT on tasks requiring integration of multiple perspectives.",
    analogy:
      "GoT is a research team where members work on different angles, then merge findings into a unified report — rather than one person following a single outline.",
    technical:
      "Nodes = thoughts (partial solutions, sub-answers). Edges = dependencies (thought B builds on thought A) or aggregation (thought D merges A + C). Operations: Generate, Aggregate, Refine, Score. Scheduler picks which node to expand next based on scores. More flexible than ToT but harder to implement — use LangGraph with explicit state graph. Best for complex synthesis tasks.",
    example:
      "Write a business plan: branch A researches market, branch B researches competitors, branch C drafts financials. Aggregate node merges all three into a coherent document.",
    glossary: ["DAG", "Aggregation", "Thought Node", "Scheduler"],
  },

  "router-pattern": {
    concept:
      "The Router Pattern uses a classifier (LLM or rules) to direct incoming requests to specialized sub-agents, tools, or models based on intent, complexity, or domain.",
    why: "One monolithic agent handling everything is slow, expensive, and mediocre at each task. Routers send simple FAQs to a cheap bot, code questions to a coding agent, and billing issues to a RAG pipeline with CRM access.",
    analogy:
      "A router is a hospital triage nurse — they don't treat you; they send you to the right department based on your symptoms.",
    technical:
      "Implementation options: LLM classification ('choose: billing | technical | general'), embedding similarity to route examples, or keyword rules for high-confidence cases. Return route + confidence score; fall back to general agent if confidence < threshold. LangGraph: `router_node → conditional_edges → specialist_nodes`. Log routing decisions for eval. Watch for misroutes — they're silent failures.",
    example:
      "Incoming chat: router classifies as 'refund_request' (0.92 confidence) → routes to refund agent with Stripe tool access. 'How do I reset password?' → routes to auth FAQ agent.",
    code: `route = router.invoke(f"Classify: {user_message}\\nOptions: billing, technical, general")
if route.confidence > 0.8:
    agent = specialists[route.intent]
else:
    agent = general_agent
response = await agent.run(user_message)`,
    glossary: ["Intent Classification", "Confidence Threshold", "Specialist Agent", "Triage"],
  },

  "planner-pattern": {
    concept:
      "The Planner Pattern dedicates an LLM call (or node) to producing a structured, step-by-step plan before any tools are invoked — making complex agent behavior predictable and debuggable.",
    why: "Ad-hoc ReAct loops are hard to debug ('why did it call that tool?'). An explicit plan gives users visibility, enables human approval gates, and lets you validate feasibility before spending tokens on execution.",
    analogy:
      "A planner is an architect's blueprint — everyone agrees on the design before construction starts, avoiding costly rework mid-build.",
    technical:
      "Planner receives: goal, available tools (with schemas), constraints. Outputs: ordered list of steps with tool assignments and dependencies. Validate plan against tool schemas. Optional: human-in-the-loop approval. Executor follows plan; monitor can compare actual execution to plan for drift. Re-plan if a step fails. Store plans for audit and training data.",
    example:
      "User: 'Onboard new employee Jane.' Planner outputs: 1) Create Google account, 2) Add to Slack, 3) Assign laptop from inventory, 4) Send welcome email. Manager approves → executor runs each step.",
    code: `plan = planner.invoke({
    "goal": user_request,
    "tools": [t.schema for t in tools],
    "constraints": "Must complete within 10 minutes",
})
if require_approval:
    await wait_for_approval(plan)
for step in plan.steps:
    result = execute_step(step)
    if result.failed:
        plan = replanner.invoke(goal, completed_steps, error=result.error)`,
    glossary: ["Structured Plan", "Human-in-the-Loop", "Replanning", "Tool Schema"],
  },

  "reflection-loop": {
    concept:
      "A Reflection Loop adds a post-generation critique step where the agent (or a separate critic model) evaluates its output against criteria and revises before returning to the user.",
    why: "First-draft LLM outputs often miss requirements, contain errors, or violate style guides. A reflection loop catches these before users see them — cheaper than human review for many use cases.",
    analogy:
      "A reflection loop is an editor reviewing a journalist's article before publication — checking facts, tone, and completeness.",
    technical:
      "Pattern: generate → reflect (critic prompt with rubric) → if issues found, revise → repeat 1–2 times. Critic can be same model with different system prompt or a cheaper model. Rubric examples: factual accuracy, completeness, format compliance, safety. Stop when critic says 'PASS' or max iterations reached. LangGraph: `generate → reflect → (revise | end)`.",
    example:
      "Agent drafts email → critic flags 'missing deadline mention and too informal' → agent revises → critic passes → email sent.",
    code: `draft = generator.invoke(task)
for _ in range(2):
    critique = critic.invoke(f"Task: {task}\\nDraft: {draft}\\nRubric: {rubric}")
    if "PASS" in critique:
        break
    draft = generator.invoke(f"Revise based on: {critique}\\nDraft: {draft}")`,
    glossary: ["Critic Model", "Rubric", "Revision", "Quality Gate"],
  },

  "supervisor-pattern": {
    concept:
      "The Supervisor Pattern uses a central orchestrator LLM that delegates subtasks to specialized worker agents, collects their results, and synthesizes the final response.",
    why: "Complex workflows need coordination — who scrapes the web, who writes code, who checks compliance? A supervisor maintains global context and decides which worker to invoke next, enabling multi-agent systems without chaos.",
    analogy:
      "A supervisor is a project manager who assigns tasks to team members, reviews deliverables, and compiles the final presentation — without doing every job themselves.",
    technical:
      "LangGraph/LangChain multi-agent: supervisor node has tools = `[call_researcher, call_coder, call_writer]`. Each worker is a sub-graph with its own tools and prompt. Supervisor sees conversation history + worker outputs. Set max delegations. Workers return structured results. Alternative: hierarchical supervisors for large orgs. Watch for supervisor bottlenecks — all context flows through one node.",
    example:
      "User: 'Build a landing page for our new product.' Supervisor → researcher (gathers product info) → designer agent (layout suggestions) → coder agent (generates HTML) → supervisor reviews and returns final page.",
    code: `from langgraph.prebuilt import create_react_agent

researcher = create_react_agent(llm, [web_search, scrape])
coder = create_react_agent(llm, [write_file, run_code])

def supervisor(state):
    decision = llm.invoke(f"Delegate next step. Workers: researcher, coder\\n{state}")
    if decision.worker == "researcher":
        return researcher.invoke(state)
    return coder.invoke(state)`,
    glossary: ["Orchestrator", "Worker Agent", "Delegation", "Multi-Agent"],
  },

  "swarm-pattern": {
    concept:
      "The Swarm Pattern deploys multiple lightweight agents that collaborate peer-to-peer — handing off tasks to each other based on expertise — without a central supervisor.",
    why: "Supervisor bottlenecks limit scale. Swarms let agents self-organize: a triage agent hands off to a specialist, who hands off to a validator. OpenAI's Swarm and similar frameworks formalize this handoff model.",
    analogy:
      "A swarm is a relay race — each runner does their leg and passes the baton to the next specialist, without a coach micromanaging every step.",
    technical:
      "Each agent has: name, instructions, tools, and `handoff` functions to other agents. No central router — agents decide when to transfer based on context. State passes via shared message history. Implement with OpenAI Swarm, LangGraph handoff edges, or custom. Good for customer support tiers, coding pipelines. Risk: runaway handoffs — set max transfers (5–10).",
    example:
      "Triage agent receives question → realizes it's a billing issue → hands off to Billing Agent → Billing Agent resolves → hands off to Satisfaction Agent for follow-up.",
    code: `from swarm import Swarm, Agent

triage = Agent(name="Triage", instructions="Route or answer.", functions=[transfer_to_billing])
billing = Agent(name="Billing", instructions="Handle refunds.", functions=[transfer_to_triage])

client = Swarm()
response = client.run(agent=triage, messages=[{"role": "user", "content": "I want a refund"}])`,
    glossary: ["Handoff", "Peer-to-Peer", "Agent Transfer", "OpenAI Swarm"],
  },

  // ── Phase 11: Browser & Computer Use Agents ────────────────────────

  playwright: {
    concept:
      "Playwright is a browser automation library (Python, JS, Java) that controls Chromium, Firefox, and WebKit with a unified API — the foundation for reliable browser agents.",
    why: "Agents that interact with the web need programmatic control over navigation, clicks, form fills, and screenshots. Playwright is faster and more reliable than Selenium, with auto-waiting, network interception, and headless/headed modes.",
    analogy:
      "Playwright is a remote control for a web browser — your agent presses buttons, reads screens, and navigates pages as if a human were sitting at the computer.",
    technical:
      "Core API: `browser = await playwright.chromium.launch()`, `page = await browser.new_page()`, `await page.goto(url)`, `await page.click(selector)`, `await page.fill(selector, text)`, `await page.screenshot()`. Use `page.locator()` with role/text selectors over brittle CSS. `page.wait_for_selector()` for dynamic content. Run headless in production; headed for debugging. Docker: use `mcr.microsoft.com/playwright` image. Integrate with LangChain `PlaywrightBrowserToolkit`.",
    example:
      "Agent navigates to a SaaS dashboard, logs in with stored credentials, clicks 'Export CSV', waits for download, and parses the file for analysis.",
    code: `from playwright.async_api import async_playwright

async def scrape_pricing(url: str) -> str:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(url)
        await page.wait_for_selector("[data-testid='price']")
        price = await page.locator("[data-testid='price']").text_content()
        await browser.close()
        return price`,
    glossary: ["Headless Browser", "Locator", "Auto-wait", "Network Interception"],
  },

  "browser-automation": {
    concept:
      "Browser automation is the practice of having software control a web browser to perform tasks — navigation, data extraction, form submission, testing — on behalf of users or agents.",
    why: "Many business workflows live behind web UIs with no API. Browser automation lets agents interact with legacy systems, internal tools, and third-party SaaS products that weren't built for programmatic access.",
    analogy:
      "Browser automation is hiring a temp worker to use websites for you — they log in, click through menus, and copy data into a spreadsheet.",
    technical:
      "Architecture: agent decides action → automation layer translates to browser commands → observe page state (DOM, screenshot, accessibility tree) → feed back to agent. Challenges: dynamic SPAs, CAPTCHAs, login flows, iframes, rate limiting. Mitigations: session cookies, stealth plugins, retry with backoff, respect robots.txt. Always run in isolated containers with no access to user's real browser profile.",
    example:
      "Procurement agent logs into vendor portal, searches for SKU, adds to cart, fills PO form, screenshots confirmation — triggered by a Slack message.",
    glossary: ["DOM", "Accessibility Tree", "Session Cookie", "SPA"],
  },

  "computer-use": {
    concept:
      "Computer use agents control a full desktop environment — mouse, keyboard, screen — not just a browser, enabling interaction with any GUI application.",
    why: "Many enterprise tools (ERP, legacy desktop apps, design software) have no API and no web UI. Computer use agents can operate these systems the way a human would, unlocking automation for the long tail of GUI-only software.",
    analogy:
      "Computer use is a robot sitting at a desk — it sees the monitor, moves the mouse, types on the keyboard, and clicks icons in any application.",
    technical:
      "Anthropic's computer use API and OpenAI's computer-using agent provide screenshot → model → action (click, type, scroll) loops. Actions are coordinate-based or element-based. Safety: sandbox VM, no internet access to sensitive networks, action allowlists, human approval for destructive ops. Latency is high (screenshot + inference per step). Combine with OCR and accessibility APIs where available for better grounding.",
    example:
      "Agent opens Excel, imports CSV from Downloads, runs a pivot table, exports PDF, and emails it — all via GUI interaction because the company ERP has no API.",
    code: `# Computer use loop (conceptual)
while not task_complete:
    screenshot = capture_screen()
    action = agent.decide(screenshot, task, history)
  # action: {"type": "click", "x": 450, "y": 320}
    execute(action)
    history.append(action)`,
    glossary: ["Screenshot Loop", "GUI Automation", "Sandbox VM", "Action Allowlist"],
  },

  "form-filling": {
    concept:
      "Form-filling agents identify input fields on web pages or PDFs, map user-provided data to the correct fields, and submit forms accurately — handling validation, dropdowns, and multi-step wizards.",
    why: "Manual form filling is tedious and error-prone — job applications, government filings, insurance claims. Agents can automate this at scale while adapting to varying form layouts.",
    analogy:
      "A form-filling agent is a meticulous office clerk who reads your paperwork and transcribes every field into the correct box on a government form.",
    technical:
      "Pipeline: detect form fields (DOM analysis, accessibility labels, or vision model on screenshot) → map data keys to fields (name → `#first-name`) → fill (text, select, checkbox, date picker, file upload) → validate client-side errors → submit. Handle multi-page wizards with state tracking. Use few-shot examples for unusual field labels. Always confirm before submitting irreversible forms.",
    example:
      "User provides JSON with personal details. Agent navigates to visa application site, fills 40 fields across 3 pages, uploads passport scan, and pauses for user review before final submit.",
    code: `field_map = {
    "first_name": 'input[name="givenName"]',
    "last_name": 'input[name="familyName"]',
    "dob": 'input[type="date"]',
}
for key, selector in field_map.items():
    await page.fill(selector, user_data[key])
await page.click('button[type="submit"]')`,
    glossary: ["Field Mapping", "Multi-step Wizard", "Accessibility Label", "Validation"],
  },

  "web-navigation": {
    concept:
      "Web navigation agents plan and execute sequences of browser actions — follow links, use search, handle pagination, manage tabs — to find information or complete multi-page workflows.",
    why: "Real web tasks aren't single-page interactions. Research, shopping comparison, and compliance checks require navigating across sites, handling redirects, and maintaining context across pages.",
    analogy:
      "A web navigation agent is a research assistant who clicks through Google results, opens promising links, skims pages, and bookmarks the best sources.",
    technical:
      "Agent maintains navigation state: current URL, visited URLs (avoid loops), extracted data, goal progress. Actions: goto, click, back, new_tab, close_tab, search. Use URL allowlists to prevent SSRF. Set max pages visited (20–50). Extract structured data at each step. Screenshot + DOM snapshot for grounding. Handle popups, cookie banners, and infinite scroll. Log full navigation trace for debugging.",
    example:
      "Agent task: 'Find the cheapest direct flight NYC→London next Friday.' Navigates to 3 comparison sites, handles cookie banners, extracts prices, compares, returns best option with booking link.",
    glossary: ["Navigation State", "URL Allowlist", "SSRF", "Pagination"],
  },

  // ── Phase 12: Voice & Multimodal Agents ──────────────────────────

  stt: {
    concept:
      "Speech-to-Text (STT) converts spoken audio into written text — the input layer that lets voice agents understand what users say.",
    why: "Voice is the most natural interface for hands-free scenarios — driving, cooking, customer support calls. STT bridges human speech and LLM text processing.",
    analogy:
      "STT is a court stenographer — they listen to spoken words and type them out in real time for the record.",
    technical:
      "Options: OpenAI Whisper (open-source, batch), Deepgram, AssemblyAI, Google Speech-to-Text, Azure Speech. Key metrics: WER (word error rate), latency (streaming vs batch), language support. Streaming STT emits partial transcripts for low-latency UX. Handle noise, accents, and domain vocabulary with custom vocab lists. Post-process with punctuation restoration. Feed transcript to LLM agent pipeline.",
    example:
      "User speaks into mobile app → streaming STT converts to text in 300ms → text sent to support agent → agent responds → TTS plays answer.",
    code: `from openai import OpenAI

client = OpenAI()

def transcribe(audio_file_path: str) -> str:
    with open(audio_file_path, "rb") as f:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=f,
            response_format="text",
        )
    return transcript`,
    glossary: ["WER", "Whisper", "Streaming STT", "Custom Vocabulary"],
  },

  tts: {
    concept:
      "Text-to-Speech (TTS) converts written text into natural-sounding audio — the output layer that gives voice agents a spoken voice.",
    why: "Reading agent responses on screen isn't always possible or desirable. TTS enables phone agents, accessibility features, and conversational experiences that feel human.",
    analogy:
      "TTS is an audiobook narrator — it reads written text aloud with appropriate pacing, emphasis, and tone.",
    technical:
      "Providers: OpenAI TTS, ElevenLabs, Google Cloud TTS, Azure Neural TTS, Cartesia. Parameters: voice ID, speed, stability, SSML for prosody control. Output formats: MP3, PCM, Opus. Streaming TTS starts playback before full audio is generated. Cache common phrases ('Let me look that up'). Watch latency budget: STT + LLM + TTS must stay under 2s for natural conversation.",
    example:
      "Agent generates answer text → TTS converts to audio stream → played through phone system IVR. Voice: 'professional female, en-US'.",
    code: `from openai import OpenAI

client = OpenAI()

def speak(text: str, output_path: str = "response.mp3") -> str:
    response = client.audio.speech.create(
        model="tts-1",
        voice="nova",
        input=text,
    )
    response.stream_to_file(output_path)
    return output_path`,
    glossary: ["Neural TTS", "SSML", "Voice ID", "Streaming Audio"],
  },

  "realtime-voice": {
    concept:
      "Realtime voice agents maintain full-duplex spoken conversations — listening and speaking simultaneously with low latency — using models like OpenAI Realtime API or similar streaming speech systems.",
    why: "Turn-based STT→LLM→TTS has 3–5s latency and can't handle interruptions. Realtime APIs enable natural conversations with barge-in, emotional tone, and sub-second response times.",
    analogy:
      "Realtime voice is a phone call with a friend — you can interrupt, overlap, and respond instantly. Turn-based voice is exchanging voicemails.",
    technical:
      "OpenAI Realtime API: WebSocket connection, audio in/out as PCM chunks, model handles STT+reasoning+TTS in one pipeline. Events: `input_audio_buffer.speech_started`, `response.audio.delta`. Handle VAD (voice activity detection) for turn-taking. Function calling works mid-conversation. Latency target: < 500ms to first audio byte. Fallback to turn-based for complex tool-heavy tasks.",
    example:
      "Customer calls support line → realtime agent listens, understands issue, queries order DB via function call, speaks empathetic response with order status — all in natural conversation with interruptions.",
    code: `import websockets, json

async def voice_session():
    async with websockets.connect(REALTIME_URL, headers=headers) as ws:
        await ws.send(json.dumps({"type": "session.update", "session": {"modalities": ["audio", "text"]}}))
        async for msg in ws:
            event = json.loads(msg)
            if event["type"] == "response.audio.delta":
                play_audio_chunk(event["delta"])`,
    glossary: ["Full-Duplex", "VAD", "WebSocket", "Barge-in"],
  },

  "image-agents": {
    concept:
      "Image agents use vision-capable LLMs (GPT-4o, Claude, Gemini) to understand, analyze, and act on visual input — photos, screenshots, diagrams, and UI elements.",
    why: "Much of the world's information is visual — product photos, charts, medical scans, UI screenshots. Image agents let you build workflows that see and reason about pictures, not just text.",
    analogy:
      "An image agent is a visual inspector who examines photos and tells you what's wrong with a product, what a chart means, or what's on a screen.",
    technical:
      "Pass images as base64 or URL in multimodal messages: `{role: 'user', content: [{type: 'image_url', ...}, {type: 'text', text: 'What defect?'}]}`. Use for: OCR alternative, chart reading, UI understanding, visual QA. Preprocess: resize to model limits, compress for cost. Combine with object detection models for precise localization. Cache image embeddings for repeated analysis.",
    example:
      "Quality control agent receives factory camera photo → vision model identifies scratch on surface → logs defect with bounding box → triggers rework ticket.",
    code: `response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{
        "role": "user",
        "content": [
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
            {"type": "text", "text": "List any visible defects."},
        ],
    }],
)`,
    glossary: ["Vision LLM", "Multimodal Message", "Bounding Box", "Visual QA"],
  },

  "audio-agents": {
    concept:
      "Audio agents process non-speech audio — music, environmental sounds, calls, podcasts — to classify, transcribe, summarize, or extract insights beyond what STT alone provides.",
    why: "Not all audio is speech. Meeting recordings have tone and pauses, factory floors have machine sounds, call centers have hold music and background noise. Audio agents understand the full sonic context.",
    analogy:
      "An audio agent is a sound engineer who listens to a recording and tells you not just what was said, but who spoke, the mood, and background events.",
    technical:
      "Pipeline options: STT for speech → LLM for analysis; audio embedding models (CLAP, Whisper encoder) for classification; diarization (who spoke when) via pyannote. Tasks: meeting summarization, sentiment from tone, podcast chapter detection, anomaly detection in industrial audio. Handle long audio by chunking with overlap. Store transcripts + speaker labels + timestamps.",
    example:
      "Sales call agent transcribes 30-min call, diarizes rep vs customer, extracts objections and action items, scores sentiment per segment, logs CRM note.",
    glossary: ["Diarization", "Audio Embedding", "Speaker Labels", "Chunking"],
  },

  "video-agents": {
    concept:
      "Video agents analyze video content — frame extraction, scene understanding, action recognition, and temporal reasoning — to answer questions or automate workflows involving moving images.",
    why: "Video contains temporal information text and images can't capture — tutorials, surveillance, sports analysis, user testing recordings. Video agents unlock automation over this rich medium.",
    analogy:
      "A video agent is a sports analyst who watches game footage, identifies key plays, and explains what happened and why.",
    technical:
      "Approaches: extract keyframes → vision LLM per frame + temporal synthesis; native video models (Gemini 1.5 Pro, GPT-4o video); scene detection then per-scene analysis. Challenges: cost (many frames), context length, real-time processing. Sample 1 fps for long videos; higher for action-heavy content. Combine with audio track transcription. Output: timestamped events, summaries, Q&A.",
    example:
      "UX researcher uploads 20 user testing sessions → video agent extracts moments where users struggle, timestamps them, categorizes issues, generates highlight reel.",
    glossary: ["Keyframe Extraction", "Scene Detection", "Temporal Reasoning", "Native Video Model"],
  },

  "pdf-agents": {
    concept:
      "PDF agents extract, understand, and act on content from PDF documents — text, tables, images, and forms — enabling automated document processing workflows.",
    why: "PDFs are the universal format for contracts, invoices, research papers, and reports. Agents that read PDFs unlock RAG over document libraries, automated data entry, and compliance review.",
    analogy:
      "A PDF agent is a paralegal who reads stacks of contracts, highlights key clauses, and fills in summary spreadsheets.",
    technical:
      "Extraction: PyMuPDF, pdfplumber, Unstructured.io, or vision models for scanned PDFs. Pipeline: extract text/tables → chunk → embed for RAG, or pass pages as images to vision LLM. Handle: multi-column layouts, footnotes, embedded images, password-protected files. For forms: detect fields, map data, generate filled PDF (pdftk, PyPDF2). Validate extracted numbers against source.",
    example:
      "Invoice processing agent: receives PDF invoice → extracts vendor, line items, total → validates against PO in ERP → flags discrepancies → routes for approval.",
    code: `import pymupdf

def extract_pdf_text(path: str) -> list[str]:
    doc = pymupdf.open(path)
    pages = []
    for page in doc:
        pages.append(page.get_text())
    return pages

# Then: chunk → embed → RAG, or send to vision LLM`,
    glossary: ["PyMuPDF", "OCR", "Table Extraction", "Document RAG"],
  },

  "screen-understanding": {
    concept:
      "Screen understanding agents interpret what's displayed on a screen — desktop, mobile, or browser — using screenshots and accessibility trees to decide what actions to take.",
    why: "Computer use and browser agents need to 'see' the UI before clicking. Screen understanding bridges raw pixels (or DOM) and agent reasoning, grounding actions in what's actually visible.",
    analogy:
      "Screen understanding is reading a restaurant menu before ordering — you look at what's available, then decide what to ask for.",
    technical:
      "Inputs: screenshot (PNG), accessibility tree (AX tree on macOS, UI Automation on Windows), or DOM (web). Vision LLM describes screen state; accessibility tree provides structured element list with roles, labels, bounds. Combine both for reliability. Set-of-Mark (SOM) overlays numbered labels on screenshot for precise click targets. Handle resolution scaling, dark mode, and overlapping windows.",
    example:
      "Agent receives screenshot of settings page → identifies 'Privacy' section at coordinates (320, 450) → clicks it → reads new screen → toggles 'Share analytics' off.",
    code: `# Set-of-Mark approach
annotated = overlay_element_numbers(screenshot, accessibility_tree)
response = vision_llm.invoke([
    {"type": "image_url", "image_url": {"url": annotated_url}},
    {"type": "text", "text": "Click the element to disable analytics. Return element number."},
])
element_id = parse_element_number(response)
click(accessibility_tree[element_id].bounds)`,
    glossary: ["Accessibility Tree", "Set-of-Mark", "UI Grounding", "AX Tree"],
  },

  tracing: {
    concept: "Tracing records the full path of an agent request — every LLM call, tool invocation, and retrieval step — as linked spans for debugging.",
    why: "Agents chain many steps; without tracing you cannot see which step failed or slowed down. Essential for production debugging and interview system design.",
    analogy: "Tracing is a package tracking number that shows every warehouse and truck stop — not just 'delivered' or 'lost.'",
    technical: "Use OpenTelemetry or LangSmith to create a trace per user request with child spans for LLM, tools, retrieval. Propagate trace_id across async workers. Log inputs/outputs with PII redaction.",
    example: "User asks for refund status. Trace shows retrieval returned wrong policy doc — root cause found in 2 minutes instead of hours.",
    glossary: ["OpenTelemetry", "Span", "Trace ID", "LangSmith"],
  },

  "prompt-versioning": {
    concept: "Prompt versioning tracks changes to system prompts and templates over time, like git for prompts — enabling rollback and A/B tests.",
    why: "Prompt tweaks silently break production. Versioning lets you compare v3 vs v4 on eval sets before full rollout.",
    analogy: "Recipe versioning in a restaurant — when a dish changes, you keep the old recipe card in case customers complain.",
    technical: "Store prompts in a registry (LangSmith, PromptLayer, or git-backed YAML). Tag versions, link to eval results, deploy via feature flags. Never edit prompts inline in production code without version bumps.",
    example: "Support bot quality drops after deploy. Roll back prompt from v7 to v6 in one config change while investigating.",
    glossary: ["Prompt Registry", "A/B Test", "Feature Flag", "Rollback"],
  },

  latency: {
    concept: "Latency is end-to-end response time for agent requests — dominated by LLM inference, retrieval, and sequential tool calls.",
    why: "Users abandon slow agents. Interviewers ask how you'd hit p95 < 3s for chat and < 30s for complex tasks.",
    analogy: "Latency is wait time at a restaurant — even great food loses customers if every course takes an hour.",
    technical: "Reduce: parallel tool calls, smaller/faster models for routing, streaming UI, KV cache, edge deployment, async queues for long tasks. Measure p50/p95/p99, not just averages.",
    example: "RAG bot p95 was 8s. Parallel retrieval + gpt-4o-mini for simple queries + streaming cuts p95 to 2.1s.",
    glossary: ["p95 Latency", "Streaming", "Parallel Tools", "TTFT"],
  },

  "rate-limits": {
    concept: "Rate limits cap API requests per minute/token — providers enforce them to prevent abuse and manage capacity.",
    why: "Agents burst many LLM + embedding calls. Hitting rate limits causes cascading failures without backoff and queuing.",
    analogy: "Rate limits are highway toll booths — too many cars at once and everyone waits; spread traffic or use express lanes.",
    technical: "Implement exponential backoff, request queuing, token bucket limiters, and multi-key rotation (carefully). Cache embeddings and frequent queries. Monitor 429 errors in dashboards.",
    example: "Batch indexing job hits OpenAI 429s. Add semaphore (10 concurrent), exponential backoff, and resume from checkpoint.",
    glossary: ["429 Error", "Exponential Backoff", "Token Bucket", "Semaphore"],
  },

  deployments: {
    concept: "Deployments package and release agent applications to production — containers, CI/CD pipelines, blue-green or canary releases.",
    why: "Local demos ≠ production. Deployment covers env vars, secrets, health checks, rollbacks, and zero-downtime updates.",
    analogy: "Deployment is moving from cooking at home to opening a restaurant — same recipe, but health inspections, staff, and supply chains matter.",
    technical: "Pattern: Docker image → registry → K8s/ECS/Cloud Run. CI runs tests + eval gates. Use secrets managers, health endpoints, and staged rollouts. Pin model versions in config.",
    example: "Merge to main triggers GitHub Actions: test → build image → deploy to staging → run eval suite → promote to prod.",
    glossary: ["CI/CD", "Blue-Green", "Canary", "Health Check"],
  },

  gpu: {
    concept: "GPUs accelerate matrix math for LLM inference and training — far faster than CPUs for neural network workloads.",
    why: "Self-hosting models or fine-tuning requires GPU knowledge. Interviewers ask when GPU beats API and cost tradeoffs.",
    analogy: "GPU is a freight train for parallel cargo — overkill for one package, essential for moving a warehouse.",
    technical: "NVIDIA CUDA, VRAM sizing (7B needs ~14GB FP16, less with quantization), multi-GPU tensor parallel. Cloud: A100, H100, L4 instances. For inference: vLLM, TGI, Ollama on GPU.",
    example: "Fine-tune 7B model on 1x A100 with QLoRA in 4 hours vs impossible on CPU.",
    glossary: ["CUDA", "VRAM", "A100", "Tensor Parallel"],
  },

  vllm: {
    concept: "vLLM is a high-throughput LLM inference engine using PagedAttention for efficient GPU memory and continuous batching.",
    why: "Serving open-source models at scale needs optimized inference. vLLM is the default for production self-hosted LLMs.",
    analogy: "vLLM is a smart valet parking system — fits more cars (requests) in the same lot (GPU memory) without waste.",
    technical: "PagedAttention manages KV cache like virtual memory. Continuous batching processes new requests without waiting for batch completion. OpenAI-compatible API. Deploy with Docker on GPU nodes.",
    example: "Serve Llama 3 8B on 1x L4 with vLLM — 3x higher throughput than naive HuggingFace generate loop.",
    code: `python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-8B-Instruct \\
  --port 8000`,
    glossary: ["PagedAttention", "Continuous Batching", "KV Cache", "Self-Hosted"],
  },

  lora: {
    concept: "LoRA (Low-Rank Adaptation) fine-tunes large models by training small adapter matrices instead of all weights — cheap and fast.",
    why: "Full fine-tuning is expensive. LoRA lets you specialize models for your domain on consumer GPUs.",
    analogy: "LoRA is adding a small specialist module to a generalist brain — you don't retrain the whole brain.",
    technical: "Freeze base model weights, inject trainable low-rank matrices into attention layers. Rank r controls adapter size. Merge adapters at inference or keep separate. Libraries: PEFT, HuggingFace Trainer.",
    example: "LoRA fine-tune Llama 3 on 5K support tickets in 2 hours on 1 GPU — matches task quality of full fine-tune at 1% cost.",
    glossary: ["LoRA", "PEFT", "Adapter", "Rank"],
  },

  qlora: {
    concept: "QLoRA combines LoRA with 4-bit quantization — fine-tuning huge models on a single consumer GPU.",
    why: "70B models don't fit in GPU memory. QLoRA makes fine-tuning accessible without a GPU cluster.",
    analogy: "QLoRA is compressing a textbook to pocket size but still being able to add your own notes in the margins.",
    technical: "Quantize base model to 4-bit (NF4), train LoRA adapters in higher precision. Uses bitsandbytes. Tradeoff: slight quality loss vs massive memory savings.",
    example: "QLoRA fine-tune Mistral 7B on legal docs using 1x RTX 4090 — 24GB VRAM sufficient.",
    glossary: ["QLoRA", "4-bit Quantization", "NF4", "bitsandbytes"],
  },

  peft: {
    concept: "PEFT (Parameter-Efficient Fine-Tuning) is HuggingFace's library for LoRA, prefix tuning, and other adapter methods.",
    why: "Standardizes fine-tuning workflows. One API for LoRA, QLoRA, and adapter management across models.",
    analogy: "PEFT is a universal adapter kit — fits different appliance brands with the same installation process.",
    technical: "LoraConfig defines rank, alpha, target modules. get_peft_model wraps base model. Train with Trainer, save adapters separately, load with PeftModel.from_pretrained for inference.",
    example: "Swap customer-support LoRA adapter for sales LoRA adapter on same base model — no redeploy of full weights.",
    glossary: ["PEFT", "LoraConfig", "Adapter Swap", "HuggingFace"],
  },

  "image-generation": {
    concept: "Image generation models (DALL-E, Stable Diffusion, Midjourney) create images from text prompts using diffusion or autoregressive architectures.",
    why: "Multimodal agents may need to generate diagrams, mockups, or visual content — not just analyze images.",
    analogy: "Image generation is describing a painting to an artist who paints it instantly — quality depends on how specific your description is.",
    technical: "Diffusion: noise → denoise iteratively. Control: img2img, inpainting, ControlNet for structure. APIs: OpenAI images.generate, Replicate, local SD. Watch copyright and safety filters.",
    example: "Marketing agent generates 3 ad banner variants from product description, user picks one for campaign.",
    glossary: ["Diffusion", "Stable Diffusion", "ControlNet", "img2img"],
  },

  "inference-optimization": {
    concept: "Inference optimization speeds up model serving — quantization, batching, caching, speculative decoding, and hardware tuning.",
    why: "Slow inference kills UX and inflates costs. Critical for self-hosted and high-volume API applications.",
    analogy: "Inference optimization is tuning a car engine — same destination, less fuel, faster arrival.",
    technical: "Techniques: INT8/FP8 quantization, continuous batching (vLLM), KV cache reuse, speculative decoding, model distillation, ONNX/TensorRT. Profile with torch.profiler or Nsight.",
    example: "Quantize 13B model to INT8 — 2x throughput, 40% memory reduction, <1% quality drop on eval set.",
    glossary: ["Quantization", "Speculative Decoding", "TensorRT", "Throughput"],
  },

  distillation: {
    concept: "Knowledge distillation trains a smaller student model to mimic a larger teacher model's outputs — compressing capability into faster models.",
    why: "Deploy smaller models for latency/cost while preserving quality. Common in production model routing.",
    analogy: "Distillation is a master chef teaching an apprentice the signature dishes — apprentice is faster but learned the essentials.",
    technical: "Teacher generates soft labels on dataset; student trained to match logits or outputs. Variants: task-specific distillation, chain-of-thought distillation. Evaluate student vs teacher on held-out set.",
    example: "Distill GPT-4o routing decisions into a 3B classifier — 90% routing accuracy at 1/100th inference cost.",
    glossary: ["Teacher Model", "Student Model", "Soft Labels", "Model Compression"],
  },

  "research-papers": {
    concept: "Reading AI research papers — especially transformers, RLHF, RAG, and agents — keeps engineers current and interview-ready.",
    why: "Interviewers reference Attention Is All You Need, ReAct, RAG paper. Reading papers builds depth beyond tutorials.",
    analogy: "Research papers are the original recipes — blog posts are someone else's summary that may miss nuance.",
    technical: "Start with: Attention Is All You Need, BERT, GPT-3, RAG (Lewis et al), ReAct, Toolformer, LoRA. Use arXiv, Papers With Code. Skim abstract → figures → conclusion → methods if needed.",
    example: "Before LangGraph interview, read ReAct and Reflexion papers to explain design choices with citations.",
    glossary: ["arXiv", "RLHF", "ReAct Paper", "RAG Paper"],
  },
};
