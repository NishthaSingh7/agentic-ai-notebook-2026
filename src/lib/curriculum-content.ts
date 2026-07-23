/**
 * Phase 0-style diagrams, commands, and analogy visuals for curriculum phases (1–10).
 */

/** Comprehensive subgraph diagrams — full-topic cheat sheets per module. */
const MODULE_DIAGRAMS: Record<string, string> = {
  "what-is-ai": `flowchart TD
    AI([Artificial Intelligence])

    subgraph Paradigms["AI Paradigms"]
        P1[Rule-based - expert systems]
        P2[Machine Learning - learn from data]
        P3[Deep Learning - neural networks]
        P4[Generative AI - create content]
    end

    subgraph Stack["Modern AI App Stack"]
        S1[User Interface]
        S2[Application Logic]
        S3[LLM API - OpenAI / Anthropic]
        S4[Retrieval Layer - RAG]
        S5[Tools and Actions]
    end

    subgraph Roles["Who Does What"]
        R1[AI Engineer - integrate and ship]
        R2[ML Researcher - train new models]
        R3[Most industry roles = engineering]
    end

    AI --> Paradigms
    AI --> Stack
    AI --> Roles`,

  tokens: `flowchart TD
    TOK([Tokens])

    subgraph Basics["What Tokens Are"]
        B1[Subword pieces of text]
        B2[Not always whole words]
        B3[Common words = 1 token]
        B4[Rare words = multiple tokens]
    end

    subgraph Counting["Token Counting"]
        C1[Input tokens - your prompt]
        C2[Output tokens - model response]
        C3[Context window limit]
        C4[Billable units for APIs]
    end

    subgraph Tools["Libraries"]
        T1[tiktoken - OpenAI models]
        T2[HuggingFace tokenizers]
        T3[Count before sending to API]
    end

    subgraph Cost["Cost Impact"]
        CO1[More tokens = higher cost]
        CO2[Long prompts expensive]
        CO3[Trim history to save]
    end

    TOK --> Basics
    TOK --> Counting
    TOK --> Tools
    TOK --> Cost`,

  embeddings: `flowchart TD
    EMB([Embeddings])

    subgraph What["What They Are"]
        W1[Dense numeric vectors]
        W2[Capture semantic meaning]
        W3[Similar text = close vectors]
    end

    subgraph Models["Embedding Models"]
        M1[text-embedding-3-small]
        M2[text-embedding-3-large]
        M3[Open source - BGE, E5]
    end

    subgraph Uses["Use Cases"]
        U1[Semantic search]
        U2[RAG retrieval]
        U3[Clustering and dedup]
        U4[Recommendation]
    end

    subgraph Math["Similarity"]
        S1[Cosine similarity]
        S2[Dot product]
        S3[Nearest neighbor search]
    end

    EMB --> What
    EMB --> Models
    EMB --> Uses
    EMB --> Math`,

  "prompt-engineering": `flowchart TD
    PE([Prompt Engineering])

    subgraph Roles["Message Roles"]
        R1[system - behavior rules]
        R2[user - the request]
        R3[assistant - prior replies]
    end

    subgraph Techniques["Techniques"]
        T1[Few-shot examples]
        T2[Chain-of-thought]
        T3[Structured output format]
        T4[Role prompting]
    end

    subgraph Params["Generation Params"]
        P1[temperature - creativity]
        P2[top_p - nucleus sampling]
        P3[max_tokens - output limit]
    end

    subgraph Quality["Best Practices"]
        Q1[Be specific and clear]
        Q2[Separate instructions from data]
        Q3[Iterate and evaluate]
    end

    PE --> Roles
    PE --> Techniques
    PE --> Params
    PE --> Quality`,

  rag: `flowchart TD
    RAG([RAG - Retrieval Augmented Generation])

    subgraph Ingest["Document Ingestion"]
        I1[Load PDFs / docs / web]
        I2[Chunk into passages]
        I3[Embed each chunk]
        I4[Store in vector DB]
    end

    subgraph Query["At Query Time"]
        Q1[Embed user question]
        Q2[Similarity search top-K]
        Q3[Optional re-rank]
        Q4[Inject context into prompt]
    end

    subgraph Generate["Generation"]
        G1[LLM reads context + question]
        G2[Grounded answer with citations]
        G3[Reduces hallucination]
    end

    RAG --> Ingest
    RAG --> Query
    RAG --> Generate`,

  attention: `flowchart TD
    ATT([Attention Mechanism])

    subgraph Inputs["Three Vectors"]
        I1[Query - what am I looking for]
        I2[Key - what do I contain]
        I3[Value - what info to pass]
    end

    subgraph Steps["Computation"]
        S1[Score = Q dot K]
        S2[Softmax - normalize weights]
        S3[Weighted sum of Values]
    end

    subgraph Why["Why It Matters"]
        W1[Relates distant tokens]
        W2[Core of transformers]
        W3[Enables parallel training]
        W4[Self-attention = Q,K,V from same input]
    end

    ATT --> Inputs
    ATT --> Steps
    ATT --> Why`,

  "function-calling": `flowchart TD
    FC([Function Calling])

    subgraph Define["Define Tools"]
        D1[JSON schema per function]
        D2[name, description, parameters]
        D3[Pass tools= to API]
    end

    subgraph Flow["Request Flow"]
        F1[User asks question]
        F2[LLM returns tool_call]
        F3[Your code executes function]
        F4[Feed result back to LLM]
        F5[LLM gives final answer]
    end

    subgraph Types["Tool Types"]
        T1[Calculator / datetime]
        T2[Database queries]
        T3[External APIs]
        T4[Code execution]
    end

    FC --> Define
    FC --> Flow
    FC --> Types`,

  react: `flowchart TD
    RE([ReAct Pattern])

    subgraph Loop["Reason + Act Loop"]
        L1[Thought - reason about task]
        L2[Action - call a tool]
        L3[Observation - read tool result]
        L4[Repeat until done]
    end

    subgraph Prompt["Prompt Structure"]
        P1[Question: user goal]
        P2[Thought: reasoning step]
        P3[Action: tool_name args]
        P4[Observation: tool output]
        P5[Answer: final response]
    end

    subgraph When["When to Use"]
        W1[Multi-step tasks]
        W2[Needs external data]
        W3[Transparent reasoning trace]
    end

    RE --> Loop
    RE --> Prompt
    RE --> When`,

  langgraph: `flowchart TD
    LG([LangGraph])

    subgraph Core["Core Concepts"]
        C1[StateGraph - workflow definition]
        C2[Nodes - functions / agents]
        C3[Edges - transitions]
        C4[State - shared data object]
    end

    subgraph Features["Advanced Features"]
        F1[Conditional routing]
        F2[Checkpoints - persistence]
        F3[Human-in-the-loop]
        F4[Subgraphs]
    end

    subgraph Flow["Typical Flow"]
        FL1[START node]
        FL2[retrieve / reason / tool]
        FL3[conditional branch]
        FL4[respond / END]
    end

    LG --> Core
    LG --> Features
    LG --> Flow`,

  mcp: `flowchart TD
    MCP([Model Context Protocol])

    subgraph Parts["Architecture"]
        P1[MCP Client - in your agent]
        P2[MCP Server - exposes capabilities]
        P3[Transport - stdio / HTTP / SSE]
    end

    subgraph Capabilities["What Servers Expose"]
        C1[Tools - callable functions]
        C2[Resources - readable data]
        C3[Prompts - reusable templates]
    end

    subgraph Why["Why MCP"]
        W1[Standard connector protocol]
        W2[One server, many clients]
        W3[GitHub, DB, filesystem plugins]
    end

    MCP --> Parts
    MCP --> Capabilities
    MCP --> Why`,

  chunking: `flowchart TD
    CH([Chunking])

    subgraph Strategies["Strategies"]
        S1[Fixed size - 500 tokens]
        S2[Recursive - by paragraphs]
        S3[Semantic - by meaning shifts]
        S4[Document-aware - headers]
    end

    subgraph Params["Key Parameters"]
        P1[chunk_size - max length]
        P2[chunk_overlap - shared context]
        P3[separators - split points]
    end

    subgraph Tradeoffs["Tradeoffs"]
        T1[Small chunks - precise retrieval]
        T2[Large chunks - more context]
        T3[Overlap - avoid cut sentences]
        T4[Too small = lost meaning]
    end

    CH --> Strategies
    CH --> Params
    CH --> Tradeoffs`,

  "kv-cache": `flowchart TD
    KV([KV Cache])

    subgraph Problem["The Problem"]
        P1[Each token needs all prior K,V]
        P2[Recomputing K,V is wasteful]
        P3[Slow generation without cache]
    end

    subgraph Solution["The Solution"]
        S1[Cache K and V per layer]
        S2[Only compute new token K,V]
        S3[past_key_values in HF]
    end

    subgraph Impact["Impact"]
        I1[10-100x faster inference]
        I2[Uses more GPU memory]
        I3[Essential for production serving]
    end

    KV --> Problem
    KV --> Solution
    KV --> Impact`,

  streaming: `flowchart TD
    ST([Streaming])

    subgraph Why["Why Stream"]
        W1[Lower perceived latency]
        W2[Show tokens as generated]
        W3[Better UX for long answers]
    end

    subgraph How["How It Works"]
        H1[stream=True on API call]
        H2[Iterate over chunks]
        H3[delta.content per chunk]
        H4[Flush to UI immediately]
    end

    subgraph Patterns["Client Patterns"]
        P1[Server-Sent Events - SSE]
        P2[WebSocket for bidirectional]
        P3[Async generators in Python]
    end

    ST --> Why
    ST --> How
    ST --> Patterns`,
};

const PHASE_DIAGRAM_BUILDERS: Record<string, (title: string) => string> = {
  "genai-foundations": (title) => buildTopicDiagram(title, [
    ["Core Concepts", ["Definition", "How it fits GenAI stack", "Key properties", "Common misconceptions"]],
    ["In Practice", ["API usage pattern", "Input / output", "Cost and latency", "Evaluation"]],
    ["Related Topics", ["Tokens", "Embeddings", "Prompting", "RAG"]],
  ]),
  "transformer-foundations": (title) => buildTopicDiagram(title, [
    ["Theory", ["Mathematical intuition", "Forward pass", "Training objective", "Key equations"]],
    ["Architecture", ["Layers and components", "Input / output shapes", "Attention role", "Position encoding"]],
    ["Production", ["Inference optimization", "Memory usage", "Quantization impact", "When it matters for engineers"]],
  ]),
  "llm-engineering": (title) => buildTopicDiagram(title, [
    ["API Setup", ["SDK install", "Authentication", "Model selection", "Error handling"]],
    ["Usage Patterns", ["Sync vs async", "Streaming", "Batch requests", "Retries"]],
    ["Integration", ["Prompt templates", "Output parsing", "Multimodal inputs", "Cost tracking"]],
  ]),
  "rag-engineering": (title) => buildTopicDiagram(title, [
    ["Pipeline Stage", ["Where this step fits", "Input format", "Output format", "Dependencies"]],
    ["Configuration", ["Key parameters", "Tuning knobs", "Default values", "Tradeoffs"]],
    ["Quality", ["Retrieval accuracy", "Latency impact", "Evaluation metrics", "Common failures"]],
  ]),
  "agent-foundations": (title) => buildTopicDiagram(title, [
    ["Agent Concept", ["Definition", "vs plain LLM chat", "Core loop", "State management"]],
    ["Components", ["Planner", "Executor", "Memory", "Tools"]],
    ["Patterns", ["When to use", "Failure modes", "Observability", "Human oversight"]],
  ]),
  "agent-memory": (title) => buildTopicDiagram(title, [
    ["Memory Type", ["Scope and duration", "Storage format", "Retrieval method", "Update strategy"]],
    ["Context", ["What goes in prompt", "Window limits", "Compression", "Ranking"]],
    ["Implementation", ["In-memory vs persistent", "Vector store", "Summarization", "TTL and cleanup"]],
  ]),
  "tool-calling": (title) => buildTopicDiagram(title, [
    ["Tool Definition", ["Schema design", "Parameter validation", "Error responses", "Idempotency"]],
    ["Execution", ["Selection logic", "Parallel vs serial", "Retry and fallback", "Permissions"]],
    ["Safety", ["Input sanitization", "Output validation", "Rate limits", "Audit logging"]],
  ]),
  mcp: (title) => buildTopicDiagram(title, [
    ["MCP Layer", ["Client role", "Server role", "Transport", "Authentication"]],
    ["Capabilities", ["Tools", "Resources", "Prompts", "Subscriptions"]],
    ["Integration", ["Local vs remote", "Agent wiring", "Error handling", "Testing"]],
  ]),
  "agent-frameworks": (title) => buildTopicDiagram(title, [
    ["Framework", ["Core abstraction", "State model", "Graph / workflow", "Tool integration"]],
    ["Features", ["Persistence", "Human-in-loop", "Multi-agent", "Observability"]],
    ["When to Use", ["vs raw API", "Learning curve", "Production readiness", "Ecosystem"]],
  ]),
  "agent-design-patterns": (title) => buildTopicDiagram(title, [
    ["Pattern", ["Problem it solves", "Core loop", "When to apply", "When to avoid"]],
    ["Implementation", ["Prompt structure", "State tracking", "Termination condition", "Error recovery"]],
    ["Comparison", ["vs ReAct", "vs Plan-Execute", "Latency tradeoff", "Reliability"]],
  ]),
};

function buildTopicDiagram(
  title: string,
  sections: [string, string[]][]
): string {
  const lines = [`flowchart TD`, `    TOP([${title.replace(/"/g, "'")}])`, ""];
  sections.forEach(([name, items], i) => {
    const id = `S${i}`;
    lines.push(`    subgraph ${id}["${name}"]`);
    items.forEach((item, j) => {
      lines.push(`        ${id}${j}[${item}]`);
    });
    lines.push(`    end`, "");
    lines.push(`    TOP --> ${id}`);
  });
  return lines.join("\n");
}

/** Phase-specific default commands when module has none. */
const PHASE_DEFAULT_COMMANDS: Record<string, string[]> = {
  "genai-foundations": [
    'pip install openai tiktoken  # install LLM and tokenizer libraries',
    'python -c "import tiktoken; print(len(tiktoken.encoding_for_model(\'gpt-4o-mini\').encode(\'hello\')))"  # count tokens',
    'export OPENAI_API_KEY="sk-..."  # set API key from environment',
  ],
  "transformer-foundations": [
    "pip install torch transformers  # install PyTorch and HuggingFace",
    'python -c "from transformers import AutoTokenizer; t=AutoTokenizer.from_pretrained(\'gpt2\'); print(t.encode(\'hello\'))"  # tokenize text',
    "pip install sentence-transformers  # embedding models for similarity",
  ],
  "llm-engineering": [
    "pip install openai anthropic  # install provider SDKs",
    'curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"  # list available models',
    "ollama run llama3.2  # run a local open-source model",
  ],
  "rag-engineering": [
    "pip install langchain chromadb  # RAG stack libraries",
    "pip install pypdf unstructured  # document loaders",
    "chromadb run --path ./chroma_data  # start local ChromaDB server",
  ],
  "agent-foundations": [
    "pip install openai  # minimal agent = LLM API + Python loop",
    'python agent.py  # run your agent script',
    "pip install python-dotenv  # load API keys from .env",
  ],
  "agent-memory": [
    "pip install chromadb  # vector store for long-term memory",
    "pip install redis  # fast session / working memory",
    "pip install tiktoken  # count tokens before injecting memory",
  ],
  "tool-calling": [
    'client.chat.completions.create(..., tools=[...])  # pass tool schemas to API',
    "json.loads(response.choices[0].message.tool_calls[0].function.arguments)  # parse tool args",
    "pip install pydantic  # validate tool inputs with schemas",
  ],
  mcp: [
    "npx @modelcontextprotocol/inspector  # debug MCP servers interactively",
    "pip install mcp  # Python MCP SDK",
    "uvx mcp-server-filesystem  # run a filesystem MCP server",
  ],
  "agent-frameworks": [
    "pip install langgraph langchain-openai  # LangGraph agent framework",
    "pip install openai-agents  # OpenAI Agents SDK",
    "pip install crewai  # multi-agent CrewAI framework",
  ],
  "agent-design-patterns": [
    "pip install langchain langchain-openai  # patterns work with any LLM SDK",
    'python react_agent.py  # run a ReAct-style agent loop',
    "pip install tenacity  # retry logic for agent steps",
  ],
};

const MODULE_COMMANDS: Record<string, string[]> = {
  tokens: [
    'pip install tiktoken  # OpenAI tokenizer library',
    'enc = tiktoken.encoding_for_model("gpt-4o-mini")  # get encoder for model',
    "len(enc.encode(text))  # count tokens before API call",
    "enc.decode(token_ids)  # convert token IDs back to text",
  ],
  embeddings: [
    'client.embeddings.create(model="text-embedding-3-small", input=text)  # get vector',
    "pip install numpy  # compute cosine similarity between vectors",
    "pip install chromadb  # store and search embeddings",
  ],
  rag: [
    "pip install langchain chromadb openai  # full RAG stack",
    "loader.load()  # load documents from PDF / web",
    "text_splitter.split_documents(docs)  # chunk for retrieval",
    "vectorstore.similarity_search(query, k=4)  # retrieve top chunks",
  ],
  chromadb: [
    "pip install chromadb  # local vector database",
    "client = chromadb.PersistentClient(path='./chroma')  # persist to disk",
    "collection.add(documents=chunks, embeddings=vectors, ids=ids)  # index data",
    "collection.query(query_embeddings=[q_vec], n_results=5)  # search",
  ],
  ollama: [
    "curl -fsSL https://ollama.com/install.sh | sh  # install Ollama",
    "ollama pull llama3.2  # download a model locally",
    "ollama run llama3.2  # chat in terminal",
    'curl http://localhost:11434/api/generate -d \'{"model":"llama3.2","prompt":"hi"}\'  # API call',
  ],
  langgraph: [
    "pip install langgraph langchain-openai  # install LangGraph",
    "graph = StateGraph(AgentState)  # define state schema",
    "graph.add_node('agent', agent_fn)  # add processing node",
    "graph.add_edge('agent', END)  # connect nodes",
    "app = graph.compile()  # build runnable graph",
  ],
  "function-calling": [
    'tools=[{"type":"function","function":{"name":"get_weather","parameters":{...}}}]  # define schema',
    "response.choices[0].message.tool_calls  # read model tool selection",
    "json.loads(tool_call.function.arguments)  # parse arguments",
  ],
};

export function getCurriculumDiagram(
  moduleSlug: string,
  moduleTitle: string,
  phaseSlug: string
): string {
  if (MODULE_DIAGRAMS[moduleSlug]) return MODULE_DIAGRAMS[moduleSlug];
  const builder = PHASE_DIAGRAM_BUILDERS[phaseSlug];
  if (builder) return builder(moduleTitle);
  return buildTopicDiagram(moduleTitle, [
    ["Concept", ["What it is", "Why it matters", "Key terms", "Mental model"]],
    ["How It Works", ["Input", "Processing", "Output", "Data flow"]],
    ["Practice", ["When to use", "Configuration", "Pitfalls", "Evaluation"]],
  ]);
}

export function getCurriculumCommands(
  moduleSlug: string,
  phaseSlug: string,
  cheatSheet: string[],
  existing?: string[]
): string[] {
  if (existing && existing.length > 0) return existing;
  if (MODULE_COMMANDS[moduleSlug]) return MODULE_COMMANDS[moduleSlug];
  const phaseDefaults = PHASE_DEFAULT_COMMANDS[phaseSlug] ?? [];
  if (phaseDefaults.length > 0) return phaseDefaults;

  return cheatSheet.slice(0, 4).map((item, i) => {
    const comment = i === 0 ? "key concept" : "remember this";
    return `${item}  # ${comment}`;
  });
}

export function getCurriculumAnalogyDiagram(moduleTitle: string): string {
  const safe = moduleTitle.replace(/"/g, "'");
  return `flowchart LR
    A[Without ${safe}] --> B[Problem]
    B --> C[With ${safe}]
    C --> D[Better outcome]`;
}
