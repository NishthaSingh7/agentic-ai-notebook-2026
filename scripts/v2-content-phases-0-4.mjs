/**
 * Topic-specific educational content for v2 lessons (Phases 0–4).
 * Keyed by module slug. Used by generate-v2-lessons.mjs.
 */
export const topics = {
  // ─── Phase 0: GenAI Foundations ───────────────────────────────────────────

  "llm-basics": {
    concept:
      "Large Language Models (LLMs) are neural networks trained on vast text corpora to predict the next token, enabling them to generate coherent language, answer questions, and follow instructions. Models like GPT-4o, Claude, and Gemini differ in size, context window, and fine-tuning.",
    why: "LLMs are the reasoning engine behind every modern AI agent. Understanding tokens, context windows, and model behavior is prerequisite to building reliable systems instead of fragile prompt hacks.",
    analogy:
      "An LLM is like a well-read colleague who has memorized patterns from millions of documents but cannot browse the web or run code unless you give them tools.",
    technical:
      "LLMs consume text as tokens (subword units), process them through transformer layers with self-attention, and output a probability distribution over the next token. Key parameters: temperature (randomness), max_tokens (output length), and context window (max input + output tokens, often 128K–1M in 2026).",
    example:
      "A customer-support bot receives 'My order #4821 hasn't arrived.' The LLM reads the message, identifies intent (shipping inquiry), and drafts a reply — but cannot look up order status without a tool.",
    code: `from openai import OpenAI
client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Explain transformers in one sentence."}],
    temperature=0.3,
    max_tokens=100,
)
print(response.choices[0].message.content)`,
    glossary: ["Tokens", "Context Window", "Transformer"],
  },

  "prompt-engineering": {
    concept:
      "Prompt engineering is the practice of crafting inputs — system messages, few-shot examples, and output format instructions — to steer LLM behavior without changing model weights.",
    why: "The same model can be brilliant or useless depending on how you ask. Good prompts reduce hallucinations, enforce structure, and cut token cost by eliminating back-and-forth.",
    analogy:
      "Prompting is like writing a clear job brief for a contractor: vague specs produce vague results; precise constraints produce exactly what you need.",
    technical:
      "Core techniques: system prompts (role + rules), few-shot examples (input-output pairs in context), chain-of-thought ('think step by step'), and output formatting (JSON schema, XML tags). Evaluate prompts with held-out test cases, not vibes.",
    example:
      "Instead of 'Summarize this ticket,' use: 'You are a support triage agent. Classify urgency (low/medium/high) and extract the product name. Return JSON: {urgency, product, summary}.'",
    code: `messages = [
    {"role": "system", "content": "Classify support tickets. Return JSON only."},
    {"role": "user", "content": "Ticket: Payment failed twice. Product: Pro Plan."},
]
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages,
    response_format={"type": "json_object"},
)`,
    glossary: ["Few-Shot", "System Prompt", "Chain-of-Thought"],
  },

  embeddings: {
    concept:
      "Embeddings are dense numerical vectors that represent text (or images) in a high-dimensional space where semantically similar items are close together.",
    why: "LLMs cannot search millions of documents at query time. Embeddings let you pre-index content and retrieve only the most relevant pieces for RAG and recommendation.",
    analogy:
      "Embeddings are GPS coordinates for meaning — 'refund policy' and 'money back guarantee' land near each other even though the words differ.",
    technical:
      "An embedding model (e.g., text-embedding-3-small, voyage-3) maps text to a fixed-length float array (often 384–3072 dimensions). Similarity is measured via cosine distance or dot product. Same model must be used at index and query time.",
    example:
      "Embed 10,000 product descriptions, store vectors in a database, then find the 5 products most similar to a user's natural-language search query.",
    code: `from openai import OpenAI
client = OpenAI()
response = client.embeddings.create(
    model="text-embedding-3-small",
    input=["refund policy", "return merchandise within 30 days"],
)
vec_a, vec_b = response.data[0].embedding, response.data[1].embedding
# cosine similarity ≈ 0.85 for related phrases`,
    glossary: ["Vector", "Cosine Similarity", "Semantic Search"],
  },

  "vector-databases": {
    concept:
      "Vector databases are specialized stores optimized for storing embeddings and performing fast approximate nearest-neighbor (ANN) search at scale.",
    why: "A flat list of embeddings in memory breaks at millions of vectors. Vector DBs add indexing (HNSW, IVF), metadata filtering, and persistence for production RAG.",
    analogy:
      "A vector database is a library catalog sorted by topic similarity instead of Dewey decimal — you ask for 'books like this one' and get instant recommendations.",
    technical:
      "Popular options: Pinecone (managed), Weaviate, Qdrant, Milvus, pgvector (Postgres extension). They support upsert, hybrid search (vector + keyword), metadata filters, and batch ingestion. Tune index type and ef/search params for recall vs latency tradeoffs.",
    example:
      "A legal-tech startup indexes 2M contract clauses in Qdrant; lawyers query 'indemnification limits' and get the top 10 semantically matching clauses in under 50ms.",
    code: `from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance

client = QdrantClient(url="http://localhost:6333")
client.create_collection("docs", vectors_config=VectorParams(size=1536, distance=Distance.COSINE))
client.upsert("docs", points=[{"id": 1, "vector": embedding, "payload": {"source": "handbook.pdf"}}])
hits = client.search("docs", query_vector=query_emb, limit=5)`,
    glossary: ["ANN Search", "HNSW", "Metadata Filtering"],
  },

  "rag-basics": {
    concept:
      "Retrieval-Augmented Generation (RAG) grounds LLM responses by fetching relevant documents at query time and injecting them into the prompt as context.",
    why: "LLMs hallucinate facts and have knowledge cutoffs. RAG connects models to your private, up-to-date data without expensive fine-tuning.",
    analogy:
      "RAG is an open-book exam — the LLM is smart, but you hand it the right textbook pages before it answers.",
    technical:
      "Pipeline: ingest documents → chunk (500–1000 tokens) → embed → store in vector DB → at query time embed question → retrieve top-k chunks → stuff into prompt → LLM generates answer citing context. Watch for chunk overlap, reranking, and citation accuracy.",
    example:
      "An HR chatbot retrieves the company's PTO policy section, feeds it to GPT-4o, and answers 'How many sick days do I get?' with a grounded, citable response.",
    code: `def rag_query(question, retriever, llm):
    chunks = retriever.invoke(question)
    context = "\\n\\n".join(c.page_content for c in chunks)
    prompt = f"Answer using only this context:\\n{context}\\n\\nQuestion: {question}"
    return llm.invoke(prompt).content`,
    glossary: ["Chunking", "Retrieval", "Grounding"],
  },

  "langchain-basics": {
    concept:
      "LangChain is a Python/JS framework for composing LLM applications — chains, retrievers, tools, and agents with standardized interfaces.",
    why: "Raw API calls don't scale to complex apps. LangChain provides abstractions for prompts, memory, retrieval, and tool routing so you ship faster.",
    analogy:
      "LangChain is like React for LLM apps — reusable components (prompts, parsers, retrievers) you wire together instead of reinventing plumbing.",
    technical:
      "Core pieces: Chat models (OpenAI, Anthropic wrappers), prompt templates, output parsers, document loaders, text splitters, embeddings, vector stores, retrievers, and LCEL for declarative pipelines. In 2026, use LangChain for integrations but prefer LangGraph for agent control flow.",
    example:
      "Build a RAG chain: load PDF → split → embed → store in Chroma → retrieve top-k chunks → pass to LLM with a prompt template.",
    code: `from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter

llm = ChatOpenAI(model="gpt-4o-mini")
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
docs = splitter.split_text(open("handbook.txt").read())
vectorstore = Chroma.from_texts(docs, OpenAIEmbeddings())
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
context = "\\n".join(d.page_content for d in retriever.invoke("PTO policy"))
print(llm.invoke(f"Answer using context:\\n{context}\\nQ: How many PTO days?").content)`,
    glossary: ["LCEL", "Retrievers", "Vector Stores"],
  },

  chromadb: {
    concept:
      "ChromaDB is an open-source embedding database for storing and querying vector representations of text for RAG and semantic search.",
    why: "LLMs need relevant context at query time. Chroma persists embeddings locally or in client-server mode with minimal setup.",
    analogy:
      "Chroma is a filing cabinet sorted by meaning, not alphabet — you ask 'documents about refunds' and it finds semantically similar files.",
    technical:
      "Collections hold documents + embeddings + metadata. Supports cosine similarity search, filtering by metadata, persistent storage, and Python/JS clients. Integrates with LangChain and LlamaIndex as a vector store backend.",
    example:
      "Index 500 support tickets, then retrieve the 5 most similar tickets when a new customer asks about billing errors.",
    code: `import chromadb
client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection("tickets")
collection.add(documents=["billing issue", "login failed"], ids=["1", "2"], metadatas=[{"team": "billing"}, {"team": "auth"}])
results = collection.query(query_texts=["payment declined"], n_results=2)
print(results["documents"])`,
    glossary: ["Embeddings", "Metadata Filtering", "Cosine Similarity"],
  },

  streamlit: {
    concept:
      "Streamlit turns Python scripts into interactive web apps — ideal for prototyping RAG chatbots and agent demos without frontend code.",
    why: "Stakeholders need to try AI features before production. Streamlit lets engineers demo LLM apps in hours, not weeks.",
    analogy:
      "Streamlit is the PowerPoint of AI prototypes — paste Python, get a shareable UI instantly.",
    technical:
      "Uses st.chat_message, st.session_state for conversation history, st.sidebar for config, and reruns the script top-to-bottom on interaction. Pair with LangChain or direct API calls. Not for high-scale production — use FastAPI + React for that.",
    example:
      "A 50-line Streamlit app with a chat input, message history, and OpenAI API call becomes a demoable RAG assistant.",
    code: `import streamlit as st
from openai import OpenAI
client = OpenAI()
st.title("RAG Demo")
if "messages" not in st.session_state:
    st.session_state.messages = []
for msg in st.session_state.messages:
    st.chat_message(msg["role"]).write(msg["content"])
if prompt := st.chat_input("Ask something"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    reply = client.chat.completions.create(model="gpt-4o-mini", messages=st.session_state.messages)
    answer = reply.choices[0].message.content
    st.session_state.messages.append({"role": "assistant", "content": answer})
    st.chat_message("assistant").write(answer)`,
    glossary: ["Session State", "Prototyping", "Chat UI"],
  },

  "google-gemini": {
    concept:
      "Google Gemini is a family of multimodal LLMs (text, image, audio, video) accessible via the Gemini API and Vertex AI, with native tool-use and long context windows.",
    why: "Gemini offers competitive pricing, strong multimodal capabilities, and tight integration with Google Cloud — a practical choice for agents that need vision or Google Workspace data.",
    analogy:
      "Gemini is Google's all-in-one AI assistant brain — one model that can read a screenshot, hear audio, and write code in the same conversation.",
    technical:
      "Access via google-genai SDK or Vertex AI. Models: gemini-2.0-flash (fast/cheap), gemini-2.5-pro (reasoning). Supports function calling, JSON mode, grounding with Google Search, and context up to 1M tokens on some variants.",
    example:
      "An agent receives a photo of a broken appliance, sends it to Gemini 2.0 Flash with a parts-lookup tool, and returns the correct replacement SKU.",
    code: `from google import genai
client = genai.Client(api_key="YOUR_KEY")
response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Summarize the key risks in a microservices migration.",
)
print(response.text)`,
    glossary: ["Multimodal", "Vertex AI", "Function Calling"],
  },

  "basic-tool-calling": {
    concept:
      "Tool calling lets an LLM request execution of external functions — search, calculators, APIs — by emitting structured JSON that your code runs and feeds back as observations.",
    why: "LLMs alone cannot fetch live data, run code, or take actions. Tool calling is the bridge from text generation to real-world agency.",
    analogy:
      "Tool calling is giving the LLM a phone with speed-dial buttons — it decides who to call, but you own the phone lines.",
    technical:
      "Define tools as JSON schemas (name, description, parameters). The model returns a tool_calls array with function name and arguments. Your runtime executes the function, appends a tool result message, and re-prompts the model for the final answer.",
    example:
      "User asks 'What's the weather in Tokyo?' The LLM calls get_weather(city='Tokyo'), your code hits a weather API, and the model synthesizes 'It's 24°C and sunny.'",
    code: `tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "parameters": {"type": "object", "properties": {"city": {"type": "string"}}, "required": ["city"]},
    },
}]
response = client.chat.completions.create(model="gpt-4o-mini", messages=messages, tools=tools)
if response.choices[0].message.tool_calls:
    args = json.loads(response.choices[0].message.tool_calls[0].function.arguments)
    result = get_weather(**args)`,
    glossary: ["Function Schema", "Tool Result", "Agent Loop"],
  },

  // ─── Phase 1: Agent Foundations ───────────────────────────────────────────

  "evolution-of-ai": {
    concept:
      "AI has progressed from rule-based expert systems (1980s) through statistical ML and deep learning to today's generative, agentic systems that plan, use tools, and maintain memory.",
    why: "Understanding this arc explains why 2026 agents look nothing like 2015 chatbots — and why certain problems (reasoning, tool use) required new architectures, not just bigger datasets.",
    analogy:
      "AI evolution is like transportation: horses → cars → self-driving vehicles. Each leap changed what 'driving' meant, not just how fast you went.",
    technical:
      "Milestones: symbolic AI → ML (SVMs, random forests) → deep learning (CNNs, RNNs) → transformers (2017) → LLMs (GPT-3, 2020) → instruction tuning + RLHF → tool use + RAG → autonomous agents + multi-agent systems. The shift from prediction to generation to action defines the current era.",
    example:
      "A 1990s expert system needed hand-coded rules for every tax scenario; a 2026 tax agent reads regulations via RAG, calculates with a Python tool, and explains results in plain English.",
    glossary: ["Expert Systems", "Transformers", "Agentic AI"],
  },

  "what-is-an-ai-agent": {
    concept:
      "An AI agent is a system that uses an LLM as its reasoning core, perceives goals via natural language, plans steps, executes tools, observes results, and iterates until the task is done.",
    why: "Chatbots answer one question at a time. Agents complete multi-step workflows — research, code, book meetings — with minimal human intervention.",
    analogy:
      "A chatbot is a librarian who answers questions at the desk; an agent is a research assistant who goes to the stacks, photocopies sources, and writes the report.",
    technical:
      "Minimal agent loop: receive goal → LLM plans → select tool → execute → append observation to context → repeat or return final answer. Key components: planner (LLM), tool registry, memory, and guardrails. Frameworks: LangGraph, CrewAI, OpenAI Agents SDK, Cursor.",
    example:
      "User says 'Prepare a competitive analysis of Acme Corp.' The agent searches the web, reads filings, summarizes findings in a doc, and emails a draft — autonomously across 8 tool calls.",
    glossary: ["Agent Loop", "Planner", "Autonomy"],
  },

  "why-llms-need-agents": {
    concept:
      "LLMs are stateless text predictors with frozen knowledge, no persistent memory, and no ability to act in the world — agents wrap them with tools, memory, and control loops to overcome these limits.",
    why: "Production tasks require live data, multi-step reasoning, and side effects (send email, update DB). Pure prompting cannot deliver these reliably.",
    analogy:
      "An LLM alone is a brilliant strategist locked in a room with no phone — an agent gives them a phone, a notebook, and permission to act.",
    technical:
      "Gaps agents fill: knowledge cutoff (RAG/tools), arithmetic errors (calculator tool), hallucinated citations (retrieval), no side effects (API tools), context limits (memory compression), and single-turn bias (ReAct/planning loops).",
    example:
      "Ask an LLM 'What are our Q3 sales?' and it guesses. An agent queries your Snowflake warehouse via SQL tool and returns exact figures with a chart.",
    glossary: ["Knowledge Cutoff", "ReAct", "Grounding"],
  },

  "anatomy-of-an-agent": {
    concept:
      "Every production agent has five layers: a brain (LLM), senses (input parsing), hands (tools), memory (short + long term), and a nervous system (orchestration/runtime).",
    why: "Teams that treat agents as 'just a prompt' miss critical infrastructure — tool routing, error recovery, and observability — and ship demos that break in production.",
    analogy:
      "An agent is like a human employee: brain (judgment), eyes/ears (inputs), hands (tools), notebook (memory), and manager (orchestrator setting policies).",
    technical:
      "Brain: LLM with system prompt and planning strategy. Senses: message parsing, file uploads, webhooks. Hands: tool registry with schemas. Memory: conversation buffer + vector store. Nervous system: LangGraph state machine or similar, handling retries, parallelism, and human-in-the-loop.",
    example:
      "A coding agent's brain is Claude, senses are the IDE diff view, hands are file-write and terminal tools, memory is the repo index, and the nervous system is Cursor's agent runtime.",
    glossary: ["Orchestrator", "Tool Registry", "State Machine"],
  },

  "agent-lifecycle": {
    concept:
      "The agent lifecycle spans design (define goals + tools), development (prompts + integrations), evaluation (benchmarks + red-teaming), deployment (monitoring + scaling), and iteration (feedback loops).",
    why: "Agents degrade silently — model updates, API changes, and prompt drift cause regressions. A lifecycle discipline keeps them reliable over months, not days.",
    analogy:
      "Building an agent is like launching a satellite: design, build, test, launch, then continuously monitor telemetry and push patches from orbit.",
    technical:
      "Phases: (1) spec user stories + success metrics, (2) prototype with tracing (LangSmith, Braintrust), (3) eval suite with golden datasets, (4) staging with canary deploys, (5) production observability (latency, cost, tool failure rate), (6) continuous improvement from user feedback and failure logs.",
    example:
      "After deploying a support agent, the team notices 15% of SQL tool calls fail on malformed queries — they add validation, update the eval set, and redeploy without changing the LLM.",
    glossary: ["Eval Suite", "Observability", "Canary Deploy"],
  },

  "core-concepts": {
    concept:
      "Core agent concepts include the perception-action loop, planning (ReAct, plan-and-execute), tool use, memory tiers, multi-agent collaboration, and human-in-the-loop checkpoints.",
    why: "These concepts form a shared vocabulary across frameworks. Mastering them lets you evaluate any agent architecture critically instead of following hype.",
    analogy:
      "Core concepts are the chess pieces — once you know how each piece moves, you can play on any board, whether LangGraph or CrewAI.",
    technical:
      "Perception-action: observe → think → act → observe. Planning: ReAct interleaves reasoning and tool calls; plan-and-execute generates a full plan first. Memory: working (context window), episodic (past interactions), semantic (facts). Multi-agent: supervisor delegates to specialists. HITL: pause for human approval on high-stakes actions.",
    example:
      "A research agent uses plan-and-execute to outline 5 search queries, delegates web scraping to a sub-agent, and pauses for human approval before publishing findings.",
    glossary: ["ReAct", "Plan-and-Execute", "Human-in-the-Loop"],
  },

  "agent-capabilities": {
    concept:
      "Agent capabilities describe what an agent can do: reasoning, retrieval, code execution, web browsing, file manipulation, API integration, multimodal perception, and multi-step planning.",
    why: "Capability mapping prevents over-promising. You design tool sets and evals around concrete abilities, not vague 'AI magic.'",
    analogy:
      "Agent capabilities are like a job description's skill section — list what the hire can actually do, not what you hope they'll figure out.",
    technical:
      "Capability tiers: L1 (single tool, single turn), L2 (multi-tool, multi-turn), L3 (autonomous planning + recovery), L4 (multi-agent + long-horizon tasks). Each capability needs dedicated tools, prompts, eval cases, and failure handling. Benchmark with SWE-bench, WebArena, or custom task suites.",
    example:
      "A data analyst agent's capabilities: natural-language-to-SQL, chart generation, and Slack reporting — but not code deployment or infra changes.",
    glossary: ["Tool Use", "Multi-Step Planning", "Capability Tiers"],
  },

  "types-of-agents": {
    concept:
      "Agents vary by autonomy and specialization: reactive (single response), deliberative (plan first), reflexive (rule-triggered), conversational (chat-focused), task-oriented (workflow), and multi-agent swarms.",
    why: "Choosing the wrong agent type wastes engineering effort. A simple RAG chatbot doesn't need a 12-node LangGraph; a coding agent does.",
    analogy:
      "Agent types are like vehicles: a bicycle (chatbot) for short trips, a truck (workflow agent) for hauling, a fleet (multi-agent) for logistics.",
    technical:
      "Reactive: input → LLM → output (no tools). Conversational: + memory buffer. Task-oriented: + tool loop with stop conditions. Deliberative: planner node → executor nodes. Multi-agent: supervisor routes to coder, researcher, reviewer sub-agents. Hybrid architectures are common in production.",
    example:
      "A Slack bot that answers HR FAQs is conversational. A CI agent that reads PRs, runs tests, and posts reviews is task-oriented with deliberative planning.",
    glossary: ["Deliberative Agent", "Multi-Agent", "Task-Oriented"],
  },

  "agent-architectures": {
    concept:
      "Agent architectures define how components connect: single-loop (ReAct), graph-based (LangGraph nodes/edges), hierarchical (supervisor + workers), and pipeline (sequential stages).",
    why: "Architecture determines debuggability, parallelism, and cost. A tangled monolith agent is harder to fix than a graph with explicit state transitions.",
    analogy:
      "Agent architecture is the floor plan — open studio (single loop) vs. office with departments (hierarchical) vs. assembly line (pipeline).",
    technical:
      "ReAct loop: simplest, one LLM call per step. LangGraph: stateful graph with conditional edges, checkpoints, and parallel branches. Supervisor: a router LLM delegates to specialist agents. Pipeline: retrieve → plan → execute → verify as fixed stages. Choose based on task complexity and need for human checkpoints.",
    example:
      "A customer-onboarding agent uses a LangGraph with nodes for identity verification, document parsing, account creation, and welcome email — each node is independently testable.",
    code: `from langgraph.graph import StateGraph, END

def plan(state): ...
def execute(state): ...
def verify(state): ...

graph = StateGraph(AgentState)
graph.add_node("plan", plan)
graph.add_node("execute", execute)
graph.add_node("verify", verify)
graph.add_edge("plan", "execute")
graph.add_edge("execute", "verify")
graph.add_edge("verify", END)
app = graph.compile()`,
    glossary: ["LangGraph", "Supervisor Pattern", "State Graph"],
  },

  "agent-terminology": {
    concept:
      "Agent terminology includes: agent, tool, action, observation, plan, trajectory, episode, grounding, hallucination, guardrails, eval, and human-in-the-loop (HITL).",
    why: "Precise terminology prevents miscommunication in teams and helps you read papers, docs, and incident reports without confusion.",
    analogy:
      "Agent terminology is the vocabulary of a new profession — like learning 'repo,' 'PR,' and 'CI' before contributing to a codebase.",
    technical:
      "Agent: autonomous system with LLM + tools. Tool/function: external capability the LLM invokes. Action: a tool call. Observation: tool result fed back. Trajectory: full sequence of thoughts, actions, observations. Episode: one task from start to finish. Guardrails: input/output filters. Eval: automated test of agent behavior on fixed tasks.",
    example:
      "In an incident report: 'The agent's trajectory showed 3 failed search actions before the observation triggered a fallback to cached data.'",
    glossary: ["Trajectory", "Observation", "Guardrails"],
  },

  "current-agent-landscape": {
    concept:
      "The 2026 agent landscape includes coding agents (Cursor, Devin), enterprise copilots (Microsoft Copilot, Google Agentspace), open-source frameworks (LangGraph, CrewAI, AutoGen), and protocol standards like MCP.",
    why: "Knowing the landscape helps you pick build-vs-buy, avoid reinventing solved problems, and stay interoperable as standards emerge.",
    analogy:
      "The agent landscape today is like the early cloud era — AWS, Azure, GCP, and Kubernetes all coexist; standards (MCP) are the new containers.",
    technical:
      "Categories: IDE agents (code edit + terminal), vertical SaaS agents (sales, support), general-purpose platforms (OpenAI Assistants API, Vertex AI Agent Builder), and orchestration frameworks. Trends: MCP for tool standardization, eval-driven development, smaller specialist models for tool routing, and on-device agents.",
    example:
      "A startup builds their support agent on LangGraph + MCP servers for CRM and ticketing, instead of custom API wrappers for each integration.",
    glossary: ["MCP", "LangGraph", "Coding Agents"],
  },

  "build-first-ai-agent": {
    concept:
      "Your first agent should be a minimal ReAct loop: one LLM, two tools (search + calculator), a system prompt, and console logging — completable in an afternoon.",
    why: "Hands-on building reveals failure modes that reading cannot — tool argument errors, infinite loops, context overflow — before you add complexity.",
    analogy:
      "Building your first agent is like writing 'Hello World' — small, ugly, and the foundation for everything after.",
    technical:
      "Steps: (1) define a goal ('answer questions about our docs'), (2) write system prompt with rules, (3) register 2–3 tools with JSON schemas, (4) implement the while-loop: call LLM → if tool_call, execute and append result → else return answer, (5) add max-iteration guard and logging.",
    example:
      "A 80-line Python script with OpenAI function calling, a web search tool, and a math tool that answers 'What is the GDP of Japan times 2?'",
    code: `def run_agent(goal, tools, max_steps=10):
    messages = [{"role": "system", "content": "You are a helpful agent."}, {"role": "user", "content": goal}]
    for _ in range(max_steps):
        resp = client.chat.completions.create(model="gpt-4o-mini", messages=messages, tools=tools)
        msg = resp.choices[0].message
        if not msg.tool_calls:
            return msg.content
        messages.append(msg)
        for tc in msg.tool_calls:
            result = TOOL_MAP[tc.function.name](**json.loads(tc.function.arguments))
            messages.append({"role": "tool", "tool_call_id": tc.id, "content": str(result)})
    return "Max steps reached."`,
    glossary: ["ReAct Loop", "Tool Schema", "Max Iterations"],
  },

  // ─── Phase 2: Agent Memory ──────────────────────────────────────────────────

  "memory-fundamentals": {
    concept:
      "Agent memory is how systems retain and recall information across turns and sessions — from the current conversation buffer to persistent vector stores of facts and experiences.",
    why: "Without memory, every message is a first meeting. Users expect agents to remember preferences, past decisions, and project context.",
    analogy:
      "Memory is the difference between talking to a stranger on every call versus a colleague who remembers your last three projects.",
    technical:
      "Memory tiers: working (in-context messages), short-term (session buffer with summarization), long-term (vector DB or key-value store). Design choices: what to store, when to retrieve, how to compress, and what to forget. Memory is not free — it consumes tokens and adds latency.",
    example:
      "A project-management agent remembers you prefer Kanban boards, that sprint 12 slipped, and that your team uses Jira — retrieved at the start of each session.",
    glossary: ["Working Memory", "Long-Term Memory", "Context Window"],
  },

  "working-memory": {
    concept:
      "Working memory is the information actively held in the LLM's context window during a single reasoning episode — the current messages, tool results, and scratchpad thoughts.",
    why: "The context window is the agent's RAM: finite, expensive, and shared across prompts, tools, and memory. Managing it is critical for long tasks.",
    analogy:
      "Working memory is your desk surface — only what fits there is immediately usable; everything else is in a filing cabinet (long-term memory).",
    technical:
      "Contents: system prompt, conversation history, retrieved documents, tool outputs, and chain-of-thought. Limits: 128K–1M tokens depending on model. Strategies: truncate oldest messages, summarize mid-conversation, or use sliding windows. Monitor token count per step.",
    example:
      "During a 20-step coding task, the agent's working memory holds the current file contents, recent terminal output, and the last 5 user messages.",
    glossary: ["Context Window", "Token Budget", "Scratchpad"],
  },

  "short-term-memory": {
    concept:
      "Short-term memory persists across turns within a session but is typically discarded when the session ends — often implemented as a message buffer with optional summarization.",
    why: "Multi-turn conversations need continuity without paying to re-send the entire history every call or permanently storing trivial chitchat.",
    analogy:
      "Short-term memory is a whiteboard in a meeting room — useful for the session, erased when everyone leaves.",
    technical:
      "Implementations: full message list in session state (Streamlit, Redis), ConversationBufferMemory in LangChain, or a rolling summary updated every N turns. Tune buffer size vs. summarization frequency based on task length and cost.",
    example:
      "A travel-planning chat remembers you said 'budget under $2000' and 'prefer direct flights' across 10 messages, then clears when you close the tab.",
    code: `class ShortTermMemory:
    def __init__(self, max_messages=20):
        self.messages = []
        self.max_messages = max_messages
    def add(self, role, content):
        self.messages.append({"role": role, "content": content})
        if len(self.messages) > self.max_messages:
            self.messages = self.messages[-self.max_messages:]
    def get_context(self):
        return self.messages`,
    glossary: ["Message Buffer", "Session State", "Summarization"],
  },

  "long-term-memory": {
    concept:
      "Long-term memory stores information across sessions — user preferences, learned facts, past task outcomes — in persistent databases retrieved at conversation start or on demand.",
    why: "Short-term memory resets. Long-term memory makes agents feel personal and competent over weeks of interaction.",
    analogy:
      "Long-term memory is a CRM record on every customer — the agent 'knows' you even if the current chat just started.",
    technical:
      "Stores: vector DB (semantic recall), SQL/NoSQL (structured facts), or file-based (JSON user profiles). Retrieval: embed the current query and fetch relevant memories, or use a dedicated 'memory extraction' LLM call after each session to update the store.",
    example:
      "After three sessions, the agent recalls you use Python 3.12, deploy on AWS, and dislike verbose logging — injected into the system prompt automatically.",
    code: `def recall_memories(user_id, query, vector_store, k=5):
    results = vector_store.similarity_search(
        query,
        k=k,
        filter={"user_id": user_id},
    )
    return "\\n".join(r.page_content for r in results)`,
    glossary: ["Persistent Store", "Memory Extraction", "User Profile"],
  },

  "semantic-memory": {
    concept:
      "Semantic memory stores general facts and knowledge — 'the user prefers metric units,' 'Project X deadline is March 15' — independent of when or how they were learned.",
    why: "Agents need a fact layer separate from conversation logs. Semantic memory answers 'what do I know about X?' without replaying entire chat histories.",
    analogy:
      "Semantic memory is an encyclopedia entry about you — facts without the story of when you mentioned them.",
    technical:
      "Extract facts via LLM post-processing ('Given this conversation, list new facts about the user'). Store as key-value pairs or embedded statements in a vector DB. Deduplicate and reconcile conflicting facts. Retrieve by entity + embedding similarity.",
    example:
      "Semantic memory holds: {user: 'Alice', stack: 'TypeScript', team_size: 8, preferred_linter: 'eslint'} — retrieved when Alice asks about CI setup.",
    glossary: ["Fact Extraction", "Knowledge Base", "Entity Memory"],
  },

  "episodic-memory": {
    concept:
      "Episodic memory records specific past events and interactions — 'on Tuesday the agent debugged a race condition in auth.ts' — enabling recall of how similar problems were solved before.",
    why: "Facts alone don't capture experience. Episodic memory lets agents learn from past trajectories, not just static knowledge.",
    analogy:
      "Episodic memory is a diary of what happened and how — 'last time the server crashed, we restarted Redis first.'",
    technical:
      "Store episode summaries: (timestamp, task, actions taken, outcome, lessons). Embed summaries for retrieval. On new tasks, fetch similar past episodes and inject as few-shot context. Frameworks: MemGPT, Zep, custom vector stores with episode metadata.",
    example:
      "When asked to fix a flaky test, the agent retrieves an episode from last month where the same timeout issue was solved by increasing the jest timeout.",
    glossary: ["Episode", "Experience Replay", "Trajectory Summary"],
  },

  "procedural-memory": {
    concept:
      "Procedural memory encodes how to perform tasks — workflows, tool sequences, and learned skills — rather than declarative facts about the world.",
    why: "Repeating the same multi-step process from scratch wastes tokens and introduces variance. Procedural memory captures proven playbooks.",
    analogy:
      "Procedural memory is muscle memory — you don't think about each finger movement when typing; you just type.",
    technical:
      "Representations: saved prompt templates, few-shot trajectories, skill libraries (Voyager-style), or fine-tuned small models for routing. Store successful tool-call sequences and replay or adapt them for similar tasks. Update when eval scores improve.",
    example:
      "The agent has a stored procedure for 'deploy to staging': run tests → build Docker image → push to ECR → update k8s manifest → verify health endpoint.",
    glossary: ["Skill Library", "Workflow", "Playbook"],
  },

  "conversation-memory": {
    concept:
      "Conversation memory manages the dialogue history — what was said, by whom, in what order — and decides how much of it fits in context at each turn.",
    why: "Raw chat logs grow unbounded. Conversation memory balances fidelity (don't lose important details) with efficiency (don't blow the token budget).",
    analogy:
      "Conversation memory is meeting minutes — not a verbatim transcript, but enough to continue where you left off.",
    technical:
      "Patterns: full buffer, windowed buffer (last K messages), summary buffer (LLM compresses older turns), or entity-centric (track mentioned entities across turns). LangChain offers ConversationSummaryBufferMemory and similar abstractions.",
    example:
      "After 30 turns of debugging, conversation memory summarizes turns 1–25 into 3 paragraphs and keeps turns 26–30 verbatim.",
    code: `from langchain.memory import ConversationSummaryBufferMemory
from langchain_openai import ChatOpenAI

memory = ConversationSummaryBufferMemory(
    llm=ChatOpenAI(model="gpt-4o-mini"),
    max_token_limit=2000,
    return_messages=True,
)
memory.save_context({"input": "I'm building a RAG app"}, {"output": "Great! What vector DB?"})`,
    glossary: ["Summary Buffer", "Dialogue History", "Token Limit"],
  },

  "memory-stores": {
    concept:
      "Memory stores are the backends that persist agent memory: in-memory dicts, Redis, SQLite, Postgres (pgvector), dedicated services (Zep, Mem0), and vector databases.",
    why: "The store choice affects latency, scalability, query patterns, and cost. Pick based on retention needs, not hype.",
    analogy:
      "Memory stores are filing systems — sticky notes (in-memory) for demos, a warehouse (Postgres + pgvector) for production.",
    technical:
      "In-memory: fast, lost on restart. Redis: session-scoped, TTL support. SQLite: local persistence, single-user. Postgres + pgvector: relational + semantic queries. Zep/Mem0: managed memory APIs with automatic extraction. Match store to access pattern: key lookup vs. semantic search vs. time-range queries.",
    example:
      "A B2B SaaS agent uses Postgres for user profiles (structured) and Qdrant for semantic memory (unstructured facts and episodes).",
    glossary: ["pgvector", "Redis", "Mem0"],
  },

  "memory-compression": {
    concept:
      "Memory compression reduces stored or in-context information while preserving decision-relevant details — via summarization, entity extraction, or embedding distillation.",
    why: "Uncompressed memory hits context limits and increases cost. Compression is mandatory for agents running 50+ step tasks.",
    analogy:
      "Memory compression is packing for a trip — bring essentials, leave the 'just in case' items that never get used.",
    technical:
      "Techniques: LLM summarization of old turns, extractive compression (keep salient sentences), learned compression (train a model to compress context), and tool-output truncation (keep last N lines of logs). Measure compression ratio vs. task success rate on eval sets.",
    example:
      "A 50KB API response is compressed to 'Endpoint returned 200 with 3 users: Alice, Bob, Carol (IDs 1,2,3)' before entering context.",
    glossary: ["Summarization", "Token Budget", "Distillation"],
  },

  "memory-summarization": {
    concept:
      "Memory summarization uses an LLM to condense conversation history or documents into shorter representations that capture key facts, decisions, and open questions.",
    why: "Summarization is the most practical compression technique — cheap with small models and effective for conversational memory.",
    analogy:
      "Summarization is a journalist's lede — the whole story in two paragraphs so the reader can decide if they need details.",
    technical:
      "Trigger: every N turns, when token count exceeds threshold, or at session end. Prompt: 'Summarize preserving user preferences, decisions, and unresolved tasks.' Store summary separately and prepend to new sessions. Avoid recursive summarization loss — keep raw logs in cold storage.",
    example:
      "After a 40-message planning session, summarization produces: 'Team chose React, deadline April 1, open question: auth provider (Auth0 vs Clerk).'",
    code: `def summarize_history(messages, llm):
    transcript = "\\n".join(f"{m['role']}: {m['content']}" for m in messages)
    prompt = f"Summarize this conversation. Keep facts, decisions, open questions:\\n{transcript}"
    return llm.invoke(prompt).content`,
    glossary: ["Rolling Summary", "Cold Storage", "Context Pruning"],
  },

  "memory-retrieval": {
    concept:
      "Memory retrieval fetches relevant stored memories at query time using keyword search, embedding similarity, metadata filters, or hybrid approaches.",
    why: "Storing memory is useless if the agent can't find the right piece at the right moment. Retrieval quality directly impacts answer accuracy.",
    analogy:
      "Memory retrieval is a librarian fetching the right shelf — not dumping the entire library on your desk.",
    technical:
      "Pipeline: embed current query → search vector store with top-k + metadata filters (user_id, date range) → optional reranker (cross-encoder) → inject into prompt. Advanced: query expansion, multi-query retrieval, and graph-based traversal for linked entities.",
    example:
      "User asks 'What did we decide about the database?' Retrieval fetches the semantic memory entry from last week's architecture discussion, not unrelated chat about lunch.",
    code: `def retrieve(query, store, user_id, k=5):
    return store.similarity_search(
        query,
        k=k,
        filter={"user_id": user_id},
        score_threshold=0.7,
    )`,
    glossary: ["Top-K Retrieval", "Reranking", "Hybrid Search"],
  },

  "memory-ranking": {
    concept:
      "Memory ranking orders retrieved memories by relevance, recency, importance, or a learned score before injecting them into the agent's context.",
    why: "Top-k vector search returns plausible but not always best results. Ranking ensures the most useful memories win the limited token budget.",
    analogy:
      "Memory ranking is a search engine's second page — vector search is the crawl; ranking is the algorithm that puts the best answer first.",
    technical:
      "Methods: cross-encoder reranking (ms-marco-MiniLM), recency decay (score × e^(-λt)), importance scores (LLM-rated at storage time), and MMR (maximal marginal relevance) for diversity. Combine scores: final = α·relevance + β·recency + γ·importance.",
    example:
      "Five memories match 'deployment.' Ranking boosts the one from yesterday about the staging deploy over a six-month-old note about deployment theory.",
    glossary: ["Cross-Encoder", "MMR", "Recency Decay"],
  },

  "context-management": {
    concept:
      "Context management is the holistic discipline of allocating the finite context window across system prompt, memory, retrieved docs, tool outputs, and the current query.",
    why: "Poor context management causes 'lost in the middle' failures, runaway costs, and truncated tool results that break agent reasoning.",
    analogy:
      "Context management is air traffic control for tokens — every piece of information needs a slot, or the system crashes.",
    technical:
      "Budget allocation: e.g., 2K system, 4K memory, 8K retrieval, 4K tools, 4K user query + response. Techniques: priority queues (drop low-priority chunks first), observation masking (hide old tool outputs), and context caching (Anthropic/OpenAI cache prefixes). Instrument token usage per component.",
    example:
      "A coding agent allocates 60% of context to current file + recent edits, 20% to retrieved docs, 10% to memory, 10% to system prompt — adjusting dynamically as files grow.",
    glossary: ["Token Budget", "Lost in the Middle", "Context Caching"],
  },

  "build-memory-from-scratch": {
    concept:
      "Building memory from scratch means implementing extract → store → retrieve → inject as a pipeline without relying on a black-box memory framework.",
    why: "Framework abstractions hide failure modes. Building once teaches you exactly what gets stored, how retrieval works, and where latency hides.",
    analogy:
      "Building memory from scratch is like writing your own ORM once — painful, but you never misunderstand what the database is doing.",
    technical:
      "Minimal pipeline: (1) after each turn, LLM extracts facts → (2) embed and upsert to Chroma with user_id metadata → (3) at session start, embed user message and retrieve top-5 → (4) prepend to system prompt. Add summarization and ranking as phase 2.",
    example:
      "A 100-line Python module that remembers user preferences across Streamlit sessions using Chroma and OpenAI embeddings.",
    code: `def update_memory(user_id, conversation, llm, store):
    facts = llm.invoke(f"Extract new facts as bullet points:\\n{conversation}").content
    for fact in facts.split("\\n"):
        if fact.strip():
            store.add(texts=[fact], metadatas=[{"user_id": user_id}], ids=[str(uuid4())])

def inject_memory(user_id, query, store):
    hits = store.similarity_search(query, k=5, filter={"user_id": user_id})
    return "\\n".join(h.page_content for h in hits)`,
    glossary: ["Extract-Store-Retrieve", "Chroma", "User Scoping"],
  },

  // ─── Phase 3: Tool Calling ──────────────────────────────────────────────────

  "tool-calling": {
    concept:
      "Tool calling is the mechanism by which an LLM selects and invokes external functions during a conversation, receiving structured results to inform its next response.",
    why: "Tool calling transforms LLMs from text generators into systems that can query databases, run code, and interact with APIs — the foundation of agency.",
    analogy:
      "Tool calling is a universal remote — the LLM points it at the right device (tool) and presses the right button (arguments).",
    technical:
      "Flow: register tools with JSON Schema descriptions → LLM emits tool_calls in response → runtime validates args → executes function → appends tool message → LLM continues. Supports parallel tool calls, streaming, and provider-specific formats (OpenAI, Anthropic, Gemini).",
    example:
      "An agent handling 'Book a flight to NYC Friday' calls search_flights, then book_flight, then send_confirmation_email across three tool invocations.",
    code: `async def agent_loop(messages, tools):
    while True:
        response = await llm.create(messages=messages, tools=tools)
        if response.tool_calls:
            for call in response.tool_calls:
                result = await execute_tool(call.name, call.arguments)
                messages.append(tool_result(call.id, result))
        else:
            return response.content`,
    glossary: ["Tool Schema", "Parallel Tool Calls", "Agent Loop"],
  },

  "function-calling": {
    concept:
      "Function calling is OpenAI's original term for tool calling — the model returns a structured function name and JSON arguments instead of plain text when it needs external data or actions.",
    why: "Function calling was the first widely adopted standard for LLM-tool integration. Most frameworks and providers now use compatible schemas.",
    analogy:
      "Function calling is placing an order at a deli counter — you specify the item (function) and modifications (arguments); the kitchen (runtime) prepares it.",
    technical:
      "OpenAI format: tools array with type='function', function={name, description, parameters}. Response includes tool_calls[{id, function: {name, arguments}}]. Set tool_choice='auto'|'required'|{specific function}. Anthropic uses tool_use blocks; Gemini uses function_declarations — converging on JSON Schema.",
    example:
      "GPT-4o receives a weather tool definition and responds with tool_calls: [{function: {name: 'get_weather', arguments: '{\"city\": \"Berlin\"}'}}].",
    code: `response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Weather in Berlin?"}],
    tools=[{"type": "function", "function": WEATHER_FN}],
    tool_choice="auto",
)`,
    glossary: ["JSON Schema", "tool_choice", "Tool Message"],
  },

  "json-mode": {
    concept:
      "JSON mode constrains the LLM to output valid JSON, ensuring parseable structured responses for downstream code without regex extraction.",
    why: "Agents pipeline LLM output into APIs, databases, and UI components. Invalid JSON breaks the chain; JSON mode prevents that class of failure.",
    analogy:
      "JSON mode is a fill-in-the-blank form — the model must use the right format, not write a free-form essay you have to parse.",
    technical:
      "OpenAI: response_format={type: 'json_object'} plus prompt instruction to output JSON. Structured Outputs (strict mode) enforces a JSON Schema. Anthropic: tool_use or prefill with '{'. Always validate with json.loads() and handle edge cases (truncated JSON on max_tokens).",
    example:
      "An extraction agent returns {\"entities\": [{\"name\": \"Acme\", \"type\": \"company\"}], \"sentiment\": \"positive\"} — parsed directly into a database insert.",
    code: `response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Extract entities as JSON."}],
    response_format={"type": "json_object"},
)
data = json.loads(response.choices[0].message.content)`,
    glossary: ["Structured Output", "JSON Schema", "response_format"],
  },

  "structured-outputs": {
    concept:
      "Structured outputs go beyond JSON mode by enforcing a specific schema — field names, types, and required fields — so the model's response is guaranteed to match your data model.",
    why: "Loose JSON mode can return wrong keys or missing fields. Schema enforcement eliminates an entire class of validation bugs in agent pipelines.",
    analogy:
      "Structured outputs are a customs form with fixed boxes — name here, date there — not a blank page labeled 'JSON please.'",
    technical:
      "OpenAI Structured Outputs: response_format={type: 'json_schema', json_schema: {name, strict: true, schema}}. Pydantic integration via instructor or LangChain output parsers. Use for classification, extraction, and tool argument generation. Fallback: retry with error message on validation failure.",
    example:
      "A ticket classifier must return {priority: 'high'|'medium'|'low', category: string, summary: string} — strict schema ensures no missing priority field.",
    code: `from pydantic import BaseModel
class Ticket(BaseModel):
    priority: str
    category: str
    summary: str

response = client.beta.chat.completions.parse(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": ticket_text}],
    response_format=Ticket,
)
ticket = response.choices[0].message.parsed`,
    glossary: ["Pydantic", "Strict Schema", "Output Parser"],
  },

  "tool-registry": {
    concept:
      "A tool registry is a centralized catalog of available tools — their names, descriptions, schemas, and handler functions — that the agent runtime queries when building the LLM's tool list.",
    why: "Hardcoding tools in every agent file doesn't scale. A registry enables dynamic registration, discovery, versioning, and permission control.",
    analogy:
      "A tool registry is a hardware store inventory system — every tool has a SKU, description, and location, and the clerk (agent) looks up what to fetch.",
    technical:
      "Pattern: dict or class mapping tool_name → {schema, handler, permissions, version}. Register at startup or load from config/MCP. Filter by agent role before passing to LLM. Include rich descriptions — the LLM chooses tools based on descriptions, not code.",
    example:
      "A registry holds 20 tools but the 'read-only analyst' agent only receives search_docs, run_sql_query (SELECT only), and generate_chart.",
    code: `class ToolRegistry:
    def __init__(self):
        self._tools = {}
    def register(self, name, schema, handler, roles=None):
        self._tools[name] = {"schema": schema, "handler": handler, "roles": roles or ["*"]}
    def get_schemas(self, role="*"):
        return [t["schema"] for t in self._tools.values() if role in t["roles"]]
    async def execute(self, name, args):
        return await self._tools[name]["handler"](**args)`,
    glossary: ["Tool Discovery", "Handler", "Role Filtering"],
  },

  "tool-selection": {
    concept:
      "Tool selection is how an agent decides which tool(s) to invoke for a given task — typically the LLM chooses via function calling, sometimes preceded by a routing model or classifier.",
    why: "Too many tools confuse the LLM (tool overload). Too few limit capability. Smart selection balances coverage with precision.",
    analogy:
      "Tool selection is a chef choosing knives — the right tool for the task, not every knife on the rack for slicing a tomato.",
    technical:
      "Strategies: (1) LLM auto-select via descriptions, (2) embedding-based tool retrieval (embed query, find top-5 similar tool descriptions), (3) hierarchical routing (supervisor picks category, then specific tool), (4) fine-tuned router model. Limit active tools to 10–15 per call.",
    example:
      "Given 50 registered tools, an embedding router selects the 8 most relevant for 'generate a sales report from our CRM' before the LLM call.",
    glossary: ["Tool Overload", "Router Model", "Embedding Retrieval"],
  },

  "dynamic-tool-loading": {
    concept:
      "Dynamic tool loading registers and exposes tools at runtime based on context — user permissions, connected integrations, or the current task — rather than shipping a static list.",
    why: "Enterprise agents connect to different SaaS tools per customer. Dynamic loading prevents prompt bloat and enforces per-tenant access control.",
    analogy:
      "Dynamic tool loading is a toolbox that materializes only the tools you have permission to use for today's job site.",
    technical:
      "Patterns: load tool manifests from MCP servers at session start, filter by OAuth scopes, lazy-load tool modules on first mention, and hot-swap when user connects a new integration. Cache loaded schemas per session. Unload tools when context window is tight.",
    example:
      "When a user connects their Salesforce account via OAuth, the agent dynamically loads create_lead, search_opportunities, and update_contact tools for that session only.",
    glossary: ["Lazy Loading", "OAuth Scopes", "MCP Discovery"],
  },

  "tool-permissions": {
    concept:
      "Tool permissions control which agents, users, or roles can invoke which tools — preventing unauthorized database writes, file deletions, or API calls.",
    why: "An agent with unrestricted tools is a security incident waiting to happen. Permissions enforce least-privilege at the tool level.",
    analogy:
      "Tool permissions are key cards — the intern's card opens the lobby; only the admin's opens the server room.",
    technical:
      "Implement: role-based access control (RBAC) on the tool registry, per-user OAuth tokens for external APIs, read-only vs. write tool separation, and approval gates for destructive actions. Log every tool invocation with user_id, args, and result for audit trails.",
    example:
      "A 'support agent' can search_tickets and refund_order (max $50); only an 'admin agent' can delete_user or modify_billing.",
    glossary: ["RBAC", "Least Privilege", "Audit Trail"],
  },

  "tool-validation": {
    concept:
      "Tool validation checks LLM-generated tool arguments against schemas, business rules, and safety constraints before execution.",
    why: "LLMs produce malformed JSON, wrong types, and dangerous inputs. Validation is the last gate before a tool touches production systems.",
    analogy:
      "Tool validation is airport security — even if you have a ticket (tool call), your bag (arguments) gets scanned before boarding.",
    technical:
      "Layers: (1) JSON Schema validation (types, required fields, enums), (2) business rules (date in future, amount < limit), (3) sandbox checks (file path within allowed directory), (4) SQL allowlist (SELECT only). Return validation errors to the LLM for self-correction.",
    example:
      "The LLM calls delete_file(path='/etc/passwd'). Validation rejects: path outside allowed /workspace directory.",
    code: `def validate_and_run(tool_name, args, registry):
    schema = registry.get_schema(tool_name)
    errors = jsonschema.validate(args, schema)
    if errors:
        return {"error": f"Invalid args: {errors}"}
    if tool_name == "delete_file" and not args["path"].startswith("/workspace/"):
        return {"error": "Path not allowed"}
    return registry.execute(tool_name, args)`,
    glossary: ["JSON Schema", "Sandboxing", "Allowlist"],
  },

  "retry-and-fallback": {
    concept:
      "Retry and fallback strategies handle tool failures gracefully — retrying transient errors, switching to alternative tools, or returning partial results instead of crashing the agent.",
    why: "APIs timeout, rate-limit, and change schemas. Production agents must degrade gracefully, not halt on the first 500 error.",
    analogy:
      "Retry and fallback is GPS rerouting — 'road closed, taking alternate route' instead of stopping the car.",
    technical:
      "Patterns: exponential backoff (1s, 2s, 4s) for transient failures, circuit breaker (stop calling a failing API after N errors), fallback tools (primary search → cached search → 'I don't know'), and LLM self-correction (feed error message back, ask to fix args). Set max_retries per tool.",
    example:
      "Weather API times out → retry once → fall back to cached weather → if still failing, tell user 'Weather data temporarily unavailable' and continue the task.",
    code: `async def call_with_retry(fn, args, max_retries=3):
    for attempt in range(max_retries):
        try:
            return await fn(**args)
        except TransientError as e:
            if attempt == max_retries - 1:
                raise
            await asyncio.sleep(2 ** attempt)`,
    glossary: ["Exponential Backoff", "Circuit Breaker", "Graceful Degradation"],
  },

  "external-apis": {
    concept:
      "External API tools let agents call third-party services — REST, GraphQL, webhooks — to fetch live data or trigger actions in CRMs, payment systems, and cloud platforms.",
    why: "Real-world agent tasks require live data from Stripe, Salesforce, GitHub, and hundreds of other services. API tools are the integration layer.",
    analogy:
      "External API tools are the agent's phone book and dialer — connecting to any business in the world that has an API.",
    technical:
      "Wrap APIs as tools with clear descriptions and typed parameters. Handle auth (API keys, OAuth refresh tokens), rate limits, pagination, and error responses. Use OpenAPI specs to auto-generate tool schemas. Never expose raw API responses — summarize for context efficiency.",
    example:
      "A sales agent calls the HubSpot API to create a contact, the Stripe API to check subscription status, and Slack to notify the account owner.",
    code: `def create_hubspot_contact_tool(api_key):
  def create_contact(email, name):
      resp = requests.post(
          "https://api.hubapi.com/crm/v3/objects/contacts",
          headers={"Authorization": f"Bearer {api_key}"},
          json={"properties": {"email": email, "firstname": name}},
      )
      resp.raise_for_status()
      return resp.json()
  return {
      "name": "create_hubspot_contact",
      "handler": create_contact,
      "schema": {...},
  }`,
    glossary: ["OAuth", "Rate Limiting", "OpenAPI"],
  },

  "browser-tool": {
    concept:
      "A browser tool gives agents the ability to navigate websites, click elements, fill forms, and extract content — via headless browsers or accessibility-tree APIs.",
    why: "Many tasks require interacting with web UIs that have no API — booking forms, admin dashboards, legacy portals. Browser tools bridge that gap.",
    analogy:
      "A browser tool is a remote intern with a mouse and keyboard who can use any website on your behalf.",
    technical:
      "Implementations: Playwright/Puppeteer (full browser control), accessibility-tree snapshots (faster, less visual), and specialized APIs (Browserbase, Steel). Provide actions: navigate, click, type, screenshot, extract_text. Handle CAPTCHAs, login flows, and dynamic JS rendering.",
    example:
      "An agent uses a browser tool to log into a vendor portal, download last month's invoice PDF, and attach it to an expense report.",
    code: `from playwright.async_api import async_playwright

async def browse(url, action, selector=None, text=None):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(url)
        if action == "click":
            await page.click(selector)
        elif action == "extract":
            return await page.inner_text(selector)
        await browser.close()`,
    glossary: ["Playwright", "Headless Browser", "Accessibility Tree"],
  },

  "python-tool": {
    concept:
      "A Python tool lets agents write and execute Python code in a sandboxed environment — for data analysis, calculations, file processing, and algorithmic tasks.",
    why: "LLMs are unreliable at arithmetic and data manipulation. A Python tool offloads precise computation to an interpreter the agent controls.",
    analogy:
      "A Python tool is a calculator and spreadsheet rolled into one — the agent writes the formula, Python computes the answer.",
    technical:
      "Sandbox options: Docker containers, E2B, Modal, or restricted exec with allowlisted imports. Capture stdout/stderr as tool result. Timeout execution (30s default). Block network access and filesystem outside /workspace. Jupyter-style persistent kernels enable multi-step analysis.",
    example:
      "User uploads a CSV. The agent writes Python with pandas to compute monthly revenue trends and returns a matplotlib chart as base64.",
    code: `def run_python(code, timeout=30):
    import subprocess, tempfile
    with tempfile.NamedTemporaryFile(suffix=".py", mode="w") as f:
        f.write(code)
        f.flush()
        result = subprocess.run(
            ["python", f.name], capture_output=True, text=True, timeout=timeout
        )
    return {"stdout": result.stdout, "stderr": result.stderr, "exit_code": result.returncode}`,
    glossary: ["Sandbox", "E2B", "Code Interpreter"],
  },

  "sql-tool": {
    concept:
      "A SQL tool lets agents query relational databases by generating and executing SQL statements, enabling natural-language access to structured business data.",
    why: "Business data lives in warehouses and OLTP databases. A SQL tool lets agents answer 'What were Q3 sales by region?' with real numbers, not guesses.",
    analogy:
      "A SQL tool is a translator who speaks both English and database — you ask a question, they write the query, and read you the answer.",
    technical:
      "Safety: read-only connections, SELECT-only allowlists, query timeouts, row limits (LIMIT 100), and schema injection (provide table/column descriptions in the tool prompt). Use text-to-SQL with schema context. Log all queries for audit. Consider parameterized queries to prevent injection.",
    example:
      "The agent generates SELECT region, SUM(revenue) FROM sales WHERE quarter='Q3' GROUP BY region and returns a formatted table.",
    code: `def run_sql(query, connection):
    if not query.strip().upper().startswith("SELECT"):
        raise ValueError("Only SELECT queries allowed")
    with connection.cursor() as cur:
        cur.execute(query)
        columns = [d[0] for d in cur.description]
        rows = cur.fetchmany(100)
    return {"columns": columns, "rows": rows}`,
    glossary: ["Text-to-SQL", "Read-Only", "Schema Context"],
  },

  "filesystem-tool": {
    concept:
      "A filesystem tool lets agents read, write, search, and organize files within a controlled directory — essential for coding agents and document workflows.",
    why: "Many agent tasks involve manipulating files: editing code, reading configs, generating reports. Filesystem tools provide structured file access.",
    analogy:
      "A filesystem tool is giving the agent a desk with labeled folders — they can open, edit, and save documents, but not leave the office.",
    technical:
      "Operations: read_file, write_file, list_dir, search (grep/glob), delete (with confirmation). Sandbox to a root directory (chroot or virtual FS). Block symlinks escaping sandbox. Return file contents with line numbers for code editing. Integrate with git for version control.",
    example:
      "A coding agent reads src/auth.ts, applies a fix for the bug, writes the updated file, and runs tests via a terminal tool.",
    code: `import os

WORKSPACE = "/workspace"

def read_file(path):
    full = os.path.join(WORKSPACE, os.path.normpath(path).lstrip("/"))
    if not full.startswith(WORKSPACE):
        raise PermissionError("Path outside workspace")
    with open(full) as f:
        return f.read()

def write_file(path, content):
    full = os.path.join(WORKSPACE, os.path.normpath(path).lstrip("/"))
    if not full.startswith(WORKSPACE):
        raise PermissionError("Path outside workspace")
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w") as f:
        f.write(content)`,
    glossary: ["Sandbox", "Workspace Root", "Grep"],
  },

  // ─── Phase 4: MCP ───────────────────────────────────────────────────────────

  "why-mcp": {
    concept:
      "Model Context Protocol (MCP) is an open standard that lets AI applications connect to data sources and tools through a unified interface, replacing bespoke integrations per app.",
    why: "Before MCP, every agent framework reinvented tool wiring. MCP provides one protocol for Slack, GitHub, databases, and custom APIs — build once, connect everywhere.",
    analogy:
      "MCP is USB-C for AI tools — one port, many devices, instead of a different cable for every gadget.",
    technical:
      "MCP defines client-server communication over stdio or HTTP/SSE. Servers expose tools, resources (readable data), and prompts (templates). Clients (Cursor, Claude Desktop, custom agents) discover and invoke capabilities dynamically. Created by Anthropic, adopted across the ecosystem in 2025–2026.",
    example:
      "Instead of writing custom GitHub integration for your agent, Cursor, and a CLI tool separately, you deploy one MCP server that all three clients use.",
    glossary: ["MCP", "Interoperability", "Client-Server"],
  },

  "mcp-architecture": {
    concept:
      "MCP architecture consists of hosts (AI apps like Cursor), clients (protocol connectors inside hosts), and servers (programs exposing tools, resources, and prompts).",
    why: "Understanding the three-layer architecture clarifies where auth, transport, and capability logic live — critical for debugging connection issues.",
    analogy:
      "MCP architecture is a restaurant: host (dining room), client (waiter), server (kitchen) — each has a clear role in getting food (data/tools) to the customer (LLM).",
    technical:
      "Host: the AI application (Cursor IDE). Client: 1:1 connection manager per server, handles JSON-RPC messages. Server: exposes capabilities via list_tools, call_tool, list_resources, read_resource, list_prompts, get_prompt. Lifecycle: initialize → negotiate capabilities → operate → shutdown.",
    example:
      "Cursor (host) spawns an MCP client that connects to a Postgres MCP server (server) over stdio, discovering query and schema tools at startup.",
    glossary: ["Host", "JSON-RPC", "Capability Negotiation"],
  },

  "mcp-client": {
    concept:
      "An MCP client is the component inside an AI host that maintains a connection to an MCP server, discovers its capabilities, and routes tool/resource requests.",
    why: "If you're building a custom agent app, you implement or use an MCP client to consume any compliant server without custom integration code.",
    analogy:
      "An MCP client is a universal remote control that pairs with any MCP-compatible device after a one-time setup.",
    technical:
      "Client responsibilities: spawn server process (stdio) or connect (HTTP), send initialize request, call list_tools/list_resources, invoke call_tool with arguments, handle errors and reconnection. SDKs: @modelcontextprotocol/sdk (TypeScript), mcp (Python). One client instance per server connection.",
    example:
      "Your custom agent app's MCP client connects to three servers at startup — filesystem, GitHub, and Postgres — and merges their tool lists for the LLM.",
    code: `from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

server_params = StdioServerParameters(command="npx", args=["-y", "@modelcontextprotocol/server-filesystem", "/workspace"])
async with stdio_client(server_params) as (read, write):
    async with ClientSession(read, write) as session:
        await session.initialize()
        tools = await session.list_tools()
        result = await session.call_tool("read_file", {"path": "README.md"})`,
    glossary: ["ClientSession", "stdio", "list_tools"],
  },

  "mcp-server": {
    concept:
      "An MCP server is a program that exposes tools, resources, and prompts to MCP clients via the protocol — wrapping any API, database, or filesystem behind a standard interface.",
    why: "Building an MCP server once lets every MCP-compatible client (Cursor, Claude Desktop, custom agents) use your integration without per-app code.",
    analogy:
      "An MCP server is a power adapter — it converts your service's native API into the standard MCP plug that any client can use.",
    technical:
      "Implement handlers: list_tools → tool definitions, call_tool → execute and return content, list_resources → URIs, read_resource → data payloads. Use MCP SDK decorators (@server.list_tools, @server.call_tool). Transport: stdio for local, Streamable HTTP for remote. Return TextContent or ImageContent.",
    example:
      "A Jira MCP server exposes create_ticket, search_issues, and add_comment tools, plus a resource for reading project configs.",
    code: `from mcp.server import Server
from mcp.types import Tool, TextContent

server = Server("my-server")

@server.list_tools()
async def list_tools():
    return [Tool(name="greet", description="Greet a user", inputSchema={
        "type": "object", "properties": {"name": {"type": "string"}}, "required": ["name"]
    })]

@server.call_tool()
async def call_tool(name, arguments):
    if name == "greet":
        return [TextContent(type="text", text=f"Hello, {arguments['name']}!")]`,
    glossary: ["Server SDK", "call_tool", "TextContent"],
  },

  resources: {
    concept:
      "MCP resources are readable data exposed by servers — files, database schemas, API documentation — identified by URIs and fetched by clients without tool-call overhead.",
    why: "Not everything should be a tool. Resources provide passive context (config files, schemas) that clients can preload or reference, reducing LLM tool-call churn.",
    analogy:
      "MCP resources are reference books on the shelf — the agent can open them anytime, unlike tools which are actions you perform.",
    technical:
      "URI schemes: file://, db://, custom (jira://project/KEY). Server implements list_resources (metadata: uri, name, mimeType) and read_resource (returns text or blob). Clients may subscribe to resource updates. Use for schemas, configs, and static docs; use tools for actions.",
    example:
      "A Postgres MCP server exposes db://schema/public as a resource listing all table definitions, preloaded into the agent's context at session start.",
    glossary: ["URI", "read_resource", "list_resources"],
  },

  tools: {
    concept:
      "MCP tools are executable capabilities exposed by servers — the MCP equivalent of function calling, with standardized discovery and invocation across all MCP clients.",
    why: "MCP tools replace per-framework tool definitions. Write one tool schema on the server; every MCP client discovers and calls it identically.",
    analogy:
      "MCP tools are standardized power outlets — any MCP client can plug in, regardless of who manufactured the server.",
    technical:
      "Tool definition: name, description, inputSchema (JSON Schema). Invocation: client sends call_tool(name, arguments) → server executes → returns CallToolResult with content array. Supports progress notifications for long-running tools. Map tool descriptions carefully — the LLM relies on them for selection.",
    example:
      "A GitHub MCP server exposes tools: create_issue, search_code, get_pull_request. Cursor's agent calls search_code to find relevant files in a repo.",
    glossary: ["inputSchema", "CallToolResult", "Tool Discovery"],
  },

  prompts: {
    concept:
      "MCP prompts are reusable prompt templates exposed by servers — parameterized workflows that clients can fetch and inject into conversations.",
    why: "Prompts encode domain expertise (code review checklist, incident response playbook) in the server, ensuring consistent agent behavior across clients.",
    analogy:
      "MCP prompts are recipe cards in a shared kitchen — every chef (client) follows the same steps for 'how to review a PR.'",
    technical:
      "Server implements list_prompts (name, description, arguments) and get_prompt (name, args) → returns PromptMessage array. Arguments are typed (string, number). Clients render as slash commands or auto-suggestions. Use for multi-step workflows with embedded context from resources.",
    example:
      "A security MCP server exposes a 'threat-model' prompt that takes a system_description argument and returns a structured threat analysis template.",
    glossary: ["PromptMessage", "get_prompt", "Template"],
  },

  "local-mcp": {
    concept:
      "Local MCP servers run on the user's machine, communicating with clients via stdio (standard input/output) — ideal for filesystem access, local databases, and dev tools.",
    why: "Local servers access resources that should never leave the machine (source code, env files, local DBs) with minimal latency and no network exposure.",
    analogy:
      "Local MCP is a home workshop — tools are right there on your bench, no shipping delay.",
    technical:
      "Client spawns server as child process: command + args in MCP config (e.g., cursor mcp.json). Communication over stdin/stdout using JSON-RPC. Examples: @modelcontextprotocol/server-filesystem, server-sqlite, server-git. No auth needed — OS-level permissions apply.",
    example:
      "Cursor spawns a filesystem MCP server pointing at your project root, giving the agent read/write access to local files via MCP tools.",
    code: `// .cursor/mcp.json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/dev/myproject"]
    }
  }
}`,
    glossary: ["stdio", "Child Process", "mcp.json"],
  },

  "remote-mcp": {
    concept:
      "Remote MCP servers run on remote infrastructure and communicate over HTTP/SSE or Streamable HTTP — enabling shared, managed integrations for teams.",
    why: "Local servers don't scale for team-wide tools (shared CRM, company wiki). Remote MCP centralizes auth, rate limiting, and updates.",
    analogy:
      "Remote MCP is cloud software vs. desktop software — same interface, but hosted, managed, and accessible from anywhere.",
    technical:
      "Transport: Streamable HTTP (2025+ spec) or SSE with HTTP POST. Requires authentication (OAuth 2.1, API keys). Deploy on Cloudflare Workers, Fly.io, or internal infra. Handle session management, reconnection, and TLS. Clients configure with URL + auth headers in mcp.json.",
    example:
      "Your company deploys a remote Slack MCP server on Cloudflare. Every engineer's Cursor connects to the same endpoint with their OAuth token.",
    glossary: ["Streamable HTTP", "SSE", "OAuth 2.1"],
  },

  authentication: {
    concept:
      "MCP authentication secures remote server connections using OAuth 2.1, API keys, or mTLS — ensuring only authorized clients and users access tools and resources.",
    why: "Remote MCP servers expose powerful capabilities over the network. Without auth, anyone with the URL could query your database or send Slack messages.",
    analogy:
      "MCP authentication is the bouncer at a club — your credentials get you in, and the bouncer knows which VIP sections (tools) you can access.",
    technical:
      "OAuth 2.1 flow: client redirects user to authorization server → user grants scopes → client receives token → includes in MCP requests. API keys for service-to-service. mTLS for enterprise. MCP spec defines authorization discovery via .well-known endpoints. Scope tools by permission level.",
    example:
      "A GitHub MCP server requires OAuth with repo:read scope. Users who haven't authorized get a prompt; authorized users can call search_code and read_file tools.",
    glossary: ["OAuth 2.1", "API Key", "Scopes"],
  },

  transport: {
    concept:
      "MCP transport is the communication layer between clients and servers — stdio for local processes, Streamable HTTP and SSE for remote connections.",
    why: "Choosing the right transport affects latency, deployment model, and security. Local dev uses stdio; production team servers use HTTP.",
    analogy:
      "MCP transport is the road type — driveway (stdio) for home, highway (HTTP) for long-distance travel.",
    technical:
      "stdio: JSON-RPC over stdin/stdout, one message per line. Streamable HTTP: single endpoint, bidirectional streaming, replaces SSE in 2025 spec. SSE (legacy): server-sent events for server→client, HTTP POST for client→server. All transports carry the same JSON-RPC messages (initialize, tools/call, resources/read).",
    example:
      "A local filesystem server uses stdio. A company-wide Notion MCP server uses Streamable HTTP behind an API gateway with OAuth.",
    glossary: ["stdio", "Streamable HTTP", "JSON-RPC"],
  },

  "build-mcp-server": {
    concept:
      "Building an MCP server means implementing tool, resource, and/or prompt handlers using the MCP SDK, then configuring transport and deploying for client discovery.",
    why: "Once you can build MCP servers, you can expose any internal system — ticketing, monitoring, deployment — to every MCP-compatible agent in your org.",
    analogy:
      "Building an MCP server is creating an API, but one that every AI client already knows how to speak.",
    technical:
      "Steps: (1) choose SDK (Python mcp or TypeScript @modelcontextprotocol/sdk), (2) define tools with JSON schemas, (3) implement handlers, (4) choose transport (stdio or HTTP), (5) test with MCP Inspector, (6) add to client config. Package for npm/PyPI for distribution.",
    example:
      "You build a Datadog MCP server exposing query_metrics and list_alerts tools, deploy it internally, and every team's agent can monitor production.",
    code: `# server.py — minimal MCP server
from mcp.server import Server
from mcp.server.stdio import stdio_server
import asyncio

app = Server("datadog-mcp")

@app.list_tools()
async def tools():
    return [...]

@app.call_tool()
async def call(name, args):
    ...

async def main():
    async with stdio_server() as (r, w):
        await app.run(r, w, app.create_initialization_options())

asyncio.run(main())`,
    glossary: ["MCP SDK", "MCP Inspector", "stdio_server"],
  },

  "integrate-mcp-with-agent": {
    concept:
      "Integrating MCP with an agent means connecting MCP clients to servers at startup, merging discovered tools into the agent's tool registry, and routing LLM tool calls through MCP.",
    why: "MCP integration lets your custom agent leverage the growing ecosystem of pre-built servers instead of writing every integration from scratch.",
    analogy:
      "Integrating MCP is adding USB ports to your device — suddenly it works with every compatible accessory.",
    technical:
      "Flow: (1) load MCP server configs, (2) spawn clients and call initialize + list_tools, (3) convert MCP tool schemas to your LLM provider's format, (4) on tool_call, route to the correct MCP client by tool name prefix, (5) convert CallToolResult to tool message. Handle multiple servers with namespacing (github/search_code vs jira/search_issues).",
    example:
      "Your LangGraph agent connects to filesystem, GitHub, and Postgres MCP servers at startup, giving the LLM 15 tools from three servers in one unified registry.",
    code: `async def load_mcp_tools(server_configs):
    all_tools = []
    clients = {}
    for cfg in server_configs:
        client = await connect_mcp_client(cfg)
        tools = await client.list_tools()
        for t in tools:
            all_tools.append(mcp_to_openai_tool(t, prefix=cfg.name))
        clients[cfg.name] = client
    return all_tools, clients

async def route_tool_call(tool_name, args, clients):
    prefix, name = tool_name.split("/", 1)
    return await clients[prefix].call_tool(name, args)`,
    glossary: ["Tool Registry", "Namespacing", "Tool Routing"],
  },
};
