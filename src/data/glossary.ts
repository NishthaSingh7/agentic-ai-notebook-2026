export interface GlossaryEntry {
  term: string;
  slug: string;
  simpleDefinition: string;
  technicalDefinition: string;
  analogy: string;
  whereUsed: string;
  relatedConcepts: string[];
  interviewTip: string;
}

export const glossary: GlossaryEntry[] = [
  {
    term: "Agent",
    slug: "agent",
    simpleDefinition: "An AI system that can perceive, reason, and act autonomously to achieve goals.",
    technicalDefinition:
      "A software entity powered by an LLM that operates in a loop: observe environment → reason → select tools → execute actions → update state, until the task is complete.",
    analogy: "Like a personal assistant who reads your email, checks your calendar, books meetings, and reports back — without you micromanaging each step.",
    whereUsed: "Customer support bots, coding assistants, research agents, autonomous workflows.",
    relatedConcepts: ["Agent Loop", "Tool Calling", "ReAct", "Memory"],
    interviewTip: "Emphasize the loop (perceive → plan → act → observe) and how you handle failures and hallucinations in agent systems.",
  },
  {
    term: "Agent Loop",
    slug: "agent-loop",
    simpleDefinition: "The repeating cycle an AI agent follows: think, act, observe results, and repeat until done.",
    technicalDefinition:
      "An iterative control flow where the LLM receives state (user input, tool outputs, memory), produces a decision (text or tool call), the runtime executes actions, appends observations to context, and continues until a termination condition is met.",
    analogy: "Like a detective who gathers clues, forms a theory, tests it, and repeats until the case is solved.",
    whereUsed: "Autonomous agents, coding assistants, workflow automation, multi-step research tools.",
    relatedConcepts: ["Agent", "ReAct", "Tool Calling", "Reflection"],
    interviewTip: "Draw the loop diagram and explain termination conditions, max iterations, and error recovery strategies.",
  },
  {
    term: "Attention",
    slug: "attention",
    simpleDefinition: "A mechanism that lets models focus on the most relevant parts of input when making predictions.",
    technicalDefinition:
      "A weighted sum over value vectors, where weights are computed from query-key dot products, allowing dynamic focus on different input positions.",
    analogy: "Like highlighting the important sentences in a long document before answering a question about it.",
    whereUsed: "Transformers, translation, summarization, all modern LLMs.",
    relatedConcepts: ["Transformer", "KV Cache", "RoPE", "Context Window"],
    interviewTip: "Know the Q, K, V intuition and why attention solves the long-range dependency problem in RNNs.",
  },
  {
    term: "AutoGen",
    slug: "autogen",
    simpleDefinition: "A Microsoft framework for building multi-agent conversations where AI agents collaborate on tasks.",
    technicalDefinition:
      "An open-source framework providing agent abstractions, conversation patterns (group chat, sequential), and tool integration for orchestrating multiple LLM-powered agents with human-in-the-loop support.",
    analogy: "Like a conference room where several specialists discuss a problem until they reach a solution.",
    whereUsed: "Multi-agent research, code generation pipelines, collaborative problem-solving workflows.",
    relatedConcepts: ["Agent", "CrewAI", "LangGraph", "Tool Calling"],
    interviewTip: "Compare AutoGen's conversational multi-agent model with LangGraph's graph-based orchestration.",
  },
  {
    term: "BM25",
    slug: "bm25",
    simpleDefinition: "A classic keyword-based ranking algorithm used to find the most relevant documents for a search query.",
    technicalDefinition:
      "A probabilistic retrieval function based on term frequency, inverse document frequency, and document length normalization (Okapi BM25), scoring documents by lexical overlap with the query.",
    analogy: "Like a librarian who finds books by matching exact words and phrases, not just meaning.",
    whereUsed: "Hybrid search, RAG retrieval baselines, Elasticsearch, traditional search engines.",
    relatedConcepts: ["Hybrid Search", "Retriever", "Re-ranking", "Semantic Search"],
    interviewTip: "Explain when BM25 beats embeddings (exact matches, rare terms) and why hybrid search combines both.",
  },
  {
    term: "Caching",
    slug: "caching",
    simpleDefinition: "Storing previously computed results so they can be reused instead of recalculated.",
    technicalDefinition:
      "In LLM systems, caching spans prompt caching (reusing prefix KV states), embedding cache (storing vector lookups), semantic cache (returning prior answers for similar queries), and response cache at the API layer.",
    analogy: "Like keeping answers to frequently asked questions on a sticky note instead of looking them up every time.",
    whereUsed: "Production LLM APIs, RAG pipelines, cost optimization, latency reduction.",
    relatedConcepts: ["KV Cache", "Latency", "Inference", "Rate Limiting"],
    interviewTip: "Distinguish KV cache (inference), semantic cache (application), and prompt caching (provider feature) — each solves different problems.",
  },
  {
    term: "Chain-of-Thought",
    slug: "chain-of-thought",
    simpleDefinition: "Prompting a model to show its step-by-step reasoning before giving a final answer.",
    technicalDefinition:
      "A prompting technique where the model generates intermediate reasoning steps (explicit or via 'let's think step by step') before producing a conclusion, improving performance on complex reasoning tasks.",
    analogy: "Like showing your work on a math test — the steps help you and the grader catch mistakes.",
    whereUsed: "Math problems, logical reasoning, complex Q&A, agent planning.",
    relatedConcepts: ["Prompt Engineering", "Few-shot", "ReAct", "Reflection"],
    interviewTip: "Mention CoT prompting vs fine-tuned reasoning models (o1-style) and when explicit reasoning helps vs adds latency.",
  },
  {
    term: "Chunking",
    slug: "chunking",
    simpleDefinition: "Breaking large documents into smaller pieces for processing and retrieval.",
    technicalDefinition:
      "The process of splitting documents into segments (fixed-size, semantic, or recursive) with optional overlap, balancing retrieval granularity against context window limits and embedding quality.",
    analogy: "Like cutting a textbook into index cards — each card covers one topic so you can find the right page quickly.",
    whereUsed: "RAG ingestion pipelines, long document Q&A, knowledge base indexing.",
    relatedConcepts: ["RAG", "Embedding", "Context Window", "Document Loader"],
    interviewTip: "Discuss chunk size tradeoffs: too small loses context, too large dilutes relevance. Mention overlap and semantic chunking.",
  },
  {
    term: "Context Window",
    slug: "context-window",
    simpleDefinition: "The maximum amount of text (in tokens) a model can process in a single request.",
    technicalDefinition:
      "The fixed-size input buffer (measured in tokens) that the model's attention mechanism can attend to during a single forward pass.",
    analogy: "Like working memory — you can only hold so much information in your head at once before older details fade.",
    whereUsed: "Long document Q&A, chat history management, RAG chunk selection.",
    relatedConcepts: ["Token", "KV Cache", "RAG", "Chunking"],
    interviewTip: "Discuss strategies for handling documents larger than the context window: chunking, summarization, RAG.",
  },
  {
    term: "Cosine Similarity",
    slug: "cosine-similarity",
    simpleDefinition: "A measure of how similar two vectors are based on the angle between them.",
    technicalDefinition:
      "The cosine of the angle between two vectors: cos(θ) = (A·B) / (||A|| × ||B||), ranging from -1 to 1, commonly used for comparing embedding vectors regardless of magnitude.",
    analogy: "Like comparing the direction two arrows point — similar meanings point the same way, even if one arrow is longer.",
    whereUsed: "Vector search, RAG retrieval, recommendation systems, clustering.",
    relatedConcepts: ["Embedding", "Vector Search", "Semantic Search", "HNSW"],
    interviewTip: "Explain why cosine similarity is preferred over Euclidean distance for normalized embeddings.",
  },
  {
    term: "CrewAI",
    slug: "crewai",
    simpleDefinition: "A framework for orchestrating teams of AI agents with defined roles working together on tasks.",
    technicalDefinition:
      "A Python framework modeling agent crews with role-based agents, task delegation, sequential/hierarchical processes, and tool integration for collaborative multi-agent workflows.",
    analogy: "Like assembling a project team — a researcher, writer, and editor each doing their part toward one deliverable.",
    whereUsed: "Content pipelines, research automation, multi-role business workflows.",
    relatedConcepts: ["Agent", "AutoGen", "LangGraph", "Tool Calling"],
    interviewTip: "Describe role-based agent design: how you define goals, backstories, and delegation between crew members.",
  },
  {
    term: "Cross Encoder",
    slug: "cross-encoder",
    simpleDefinition: "A model that scores how relevant a query-document pair is by processing them together.",
    technicalDefinition:
      "A transformer model that jointly encodes query and document in a single forward pass, producing a relevance score via cross-attention — more accurate than bi-encoder similarity but slower.",
    analogy: "Like reading a question and answer side-by-side to judge fit, instead of comparing two separate summaries.",
    whereUsed: "Re-ranking in RAG, search result refinement, relevance scoring.",
    relatedConcepts: ["Re-ranking", "Retriever", "Embedding", "Hybrid Search"],
    interviewTip: "Contrast bi-encoder (fast retrieval) vs cross-encoder (accurate re-ranking) — use both in a two-stage pipeline.",
  },
  {
    term: "Distillation",
    slug: "distillation",
    simpleDefinition: "Training a smaller model to mimic the behavior of a larger, more capable model.",
    technicalDefinition:
      "Knowledge distillation transfers knowledge from a teacher model to a student model using soft labels (probability distributions) rather than hard labels, compressing capability into smaller architectures.",
    analogy: "Like a master chef teaching an apprentice — the apprentice learns techniques without years of independent experimentation.",
    whereUsed: "Model compression, edge deployment, cost reduction, faster inference.",
    relatedConcepts: ["Quantization", "Inference", "Fine Tuning", "Latency"],
    interviewTip: "Explain teacher-student training and when distillation preserves vs loses capability.",
  },
  {
    term: "Document Loader",
    slug: "document-loader",
    simpleDefinition: "A component that reads and parses documents from various sources into processable text.",
    technicalDefinition:
      "An ingestion utility that extracts text and metadata from files (PDF, DOCX, HTML, etc.), APIs, or databases, handling encoding, layout parsing, and format-specific extraction.",
    analogy: "Like a scanner that digitizes paper documents so a computer can read them.",
    whereUsed: "RAG ingestion pipelines, knowledge base setup, data preprocessing.",
    relatedConcepts: ["Chunking", "RAG", "Embedding", "Semantic Search"],
    interviewTip: "Mention challenges with PDFs (tables, images), and tools like Unstructured, LlamaParse, or custom parsers.",
  },
  {
    term: "Embedding",
    slug: "embedding",
    simpleDefinition: "A numerical vector representation of text, images, or other data that captures semantic meaning.",
    technicalDefinition:
      "A dense, fixed-dimensional vector in ℝⁿ produced by an encoder model, where semantically similar inputs map to nearby points in vector space.",
    analogy: "Like GPS coordinates for meaning — words with similar meanings end up close together on the map.",
    whereUsed: "Semantic search, RAG, recommendation systems, clustering.",
    relatedConcepts: ["Embeddings Model", "Vector DB", "Cosine Similarity", "RAG"],
    interviewTip: "Explain cosine similarity and why embedding model choice dramatically affects RAG quality.",
  },
  {
    term: "Embeddings Model",
    slug: "embeddings-model",
    simpleDefinition: "A specialized model trained to convert text into meaningful vector representations.",
    technicalDefinition:
      "An encoder model (e.g., text-embedding-3, BGE, E5) trained with contrastive or dual-encoder objectives to produce dense vectors optimized for semantic similarity and retrieval tasks.",
    analogy: "Like a translator that converts sentences into a universal 'meaning language' computers can compare.",
    whereUsed: "RAG indexing, semantic search, clustering, deduplication.",
    relatedConcepts: ["Embedding", "Vector DB", "Retriever", "Cosine Similarity"],
    interviewTip: "Know how to evaluate embedding models: MTEB benchmarks, domain fit, dimension size vs quality tradeoffs.",
  },
  {
    term: "Evaluation",
    slug: "evaluation",
    simpleDefinition: "Systematically measuring how well an AI system performs on defined criteria.",
    technicalDefinition:
      "The process of assessing LLM outputs using automated metrics (BLEU, ROUGE, faithfulness), LLM-as-judge, human evaluation, and domain-specific benchmarks across accuracy, relevance, safety, and latency.",
    analogy: "Like grading an exam with a rubric — you need clear criteria to know if the student actually learned.",
    whereUsed: "RAG pipelines, agent systems, fine-tuning validation, production monitoring.",
    relatedConcepts: ["RAGAS", "Tracing", "Hallucination", "Observability"],
    interviewTip: "Describe an eval pipeline: golden datasets, automated metrics, human review, and continuous monitoring in production.",
  },
  {
    term: "Few-shot",
    slug: "few-shot",
    simpleDefinition: "Providing a few examples in the prompt to teach the model the desired output format or behavior.",
    technicalDefinition:
      "An in-context learning technique where 1-10 input-output examples are prepended to the prompt, enabling task adaptation without weight updates by leveraging the model's pattern-matching capabilities.",
    analogy: "Like showing someone two solved examples before asking them to solve a similar problem.",
    whereUsed: "Classification, formatting, style matching, quick prototyping without fine-tuning.",
    relatedConcepts: ["Prompt Engineering", "Chain-of-Thought", "System Prompt", "Fine Tuning"],
    interviewTip: "Contrast few-shot prompting vs fine-tuning: few-shot is fast but limited by context window and example quality.",
  },
  {
    term: "Fine Tuning",
    slug: "fine-tuning",
    simpleDefinition: "Adapting a pre-trained model to perform better on a specific task or domain.",
    technicalDefinition:
      "Continued training of a base model on task-specific data, adjusting weights (full fine-tune) or adapter layers (LoRA/QLoRA) to specialize behavior.",
    analogy: "A general doctor specializing in cardiology — same medical foundation, but deep expertise in one area.",
    whereUsed: "Domain-specific chatbots, style transfer, classification, custom assistants.",
    relatedConcepts: ["LoRA", "QLoRA", "PEFT", "SFT"],
    interviewTip: "Know when to fine-tune vs RAG vs prompt engineering — fine-tuning changes behavior, RAG adds knowledge.",
  },
  {
    term: "Function Calling",
    slug: "function-calling",
    simpleDefinition: "An API feature where models output structured requests to invoke predefined functions.",
    technicalDefinition:
      "A provider-specific implementation of tool calling where the model receives function schemas in the API request and returns structured JSON specifying which function to call with what arguments.",
    analogy: "Like a remote control with labeled buttons — the model presses the right button instead of doing the work itself.",
    whereUsed: "OpenAI/Anthropic APIs, agent frameworks, API integrations.",
    relatedConcepts: ["Tool Calling", "Structured Outputs", "MCP", "Agent"],
    interviewTip: "Function calling and tool calling are often used interchangeably — know your provider's specific API format.",
  },
  {
    term: "Grounding",
    slug: "grounding",
    simpleDefinition: "Connecting AI responses to verified external sources or facts to improve accuracy.",
    technicalDefinition:
      "The practice of anchoring model outputs to retrieved documents, knowledge bases, or tool results, with citations and faithfulness checks to reduce hallucination and enable verification.",
    analogy: "Like a journalist citing sources — claims are only as trustworthy as the evidence behind them.",
    whereUsed: "RAG systems, enterprise chatbots, legal/medical AI, search-augmented generation.",
    relatedConcepts: ["RAG", "Hallucination", "Evaluation", "RAGAS"],
    interviewTip: "Distinguish grounding (data source) from guardrails (behavior constraints) — both reduce risk but address different failure modes.",
  },
  {
    term: "Guardrails",
    slug: "guardrails",
    simpleDefinition: "Safety controls that prevent AI systems from producing harmful, off-topic, or non-compliant outputs.",
    technicalDefinition:
      "Input/output validation layers using classifiers, rule engines, or LLM judges to filter toxic content, PII, off-topic responses, and policy violations before or after generation.",
    analogy: "Like guardrails on a highway — they keep the car on the road without dictating the destination.",
    whereUsed: "Production chatbots, enterprise AI, regulated industries, customer-facing apps.",
    relatedConcepts: ["Prompt Injection", "Hallucination", "Evaluation", "Observability"],
    interviewTip: "Layer defenses: input validation, system prompt constraints, output filtering, and human review for high-stakes decisions.",
  },
  {
    term: "Hallucination",
    slug: "hallucination",
    simpleDefinition: "When an AI model generates confident but factually incorrect information.",
    technicalDefinition:
      "A generation artifact where the model produces plausible-sounding but ungrounded outputs, often due to training data gaps, overconfidence in next-token prediction, or lack of retrieval grounding.",
    analogy: "Like a student who didn't study but writes a very convincing essay with made-up citations.",
    whereUsed: "Any LLM application — especially critical in medical, legal, and financial domains.",
    relatedConcepts: ["RAG", "Grounding", "Guardrails", "Evaluation"],
    interviewTip: "List mitigation strategies: RAG, grounding, confidence scoring, human-in-the-loop, evaluation pipelines.",
  },
  {
    term: "HNSW",
    slug: "hnsw",
    simpleDefinition: "A fast algorithm for finding similar vectors in large databases.",
    technicalDefinition:
      "Hierarchical Navigable Small World graphs — a multi-layer graph index for approximate nearest neighbor search with O(log n) query complexity, balancing recall and speed for high-dimensional vectors.",
    analogy: "Like a highway system with express lanes — you skip most roads and jump to the right neighborhood quickly.",
    whereUsed: "Vector databases (Pinecone, Qdrant, Weaviate), large-scale semantic search.",
    relatedConcepts: ["Vector DB", "Vector Search", "Embedding", "Cosine Similarity"],
    interviewTip: "Know HNSW parameters: ef_construction, M, ef_search — they trade build time, memory, and recall.",
  },
  {
    term: "Hybrid Search",
    slug: "hybrid-search",
    simpleDefinition: "Combining keyword search and semantic vector search for better retrieval results.",
    technicalDefinition:
      "A retrieval strategy merging sparse (BM25/TF-IDF) and dense (embedding) scores, often via reciprocal rank fusion (RRF) or weighted combination, to capture both lexical and semantic relevance.",
    analogy: "Like searching a library by both the catalog keywords and browsing shelves by topic.",
    whereUsed: "RAG pipelines, enterprise search, e-commerce, legal document retrieval.",
    relatedConcepts: ["BM25", "Semantic Search", "Re-ranking", "Retriever"],
    interviewTip: "Explain why hybrid beats either alone: BM25 catches exact terms, embeddings catch paraphrases.",
  },
  {
    term: "Inference",
    slug: "inference",
    simpleDefinition: "Running a trained AI model to generate predictions or responses.",
    technicalDefinition:
      "The forward pass of a neural network at serving time: tokenization → model computation (attention, FFN) → sampling → detokenization, optimized via batching, KV caching, and quantization.",
    analogy: "Like a chef cooking from a recipe — the recipe (training) is done, now they're making the actual dish.",
    whereUsed: "All LLM deployments, API serving, edge devices, batch processing.",
    relatedConcepts: ["Latency", "Throughput", "KV Cache", "Quantization"],
    interviewTip: "Distinguish training vs inference costs and optimizations — inference is where production economics matter.",
  },
  {
    term: "KV Cache",
    slug: "kv-cache",
    simpleDefinition: "A performance optimization that stores previous attention computations during text generation.",
    technicalDefinition:
      "Cached key and value tensors from prior tokens' attention computations, avoiding recomputation during autoregressive decoding and reducing latency from O(n²) to O(n) per step.",
    analogy: "Keeping your notes from earlier chapters instead of re-reading the entire book for each new sentence.",
    whereUsed: "LLM inference, streaming, production deployments.",
    relatedConcepts: ["Inference", "Transformer", "RoPE", "Caching"],
    interviewTip: "Explain memory tradeoff: KV cache speeds up generation but increases GPU memory usage linearly with sequence length.",
  },
  {
    term: "LangGraph",
    slug: "langgraph",
    simpleDefinition: "A framework for building stateful, multi-step AI workflows as directed graphs.",
    technicalDefinition:
      "A LangChain library modeling agent workflows as graphs with nodes (functions/LLM calls), edges (conditional routing), and shared state, supporting cycles, persistence, and human-in-the-loop checkpoints.",
    analogy: "Like a flowchart for your AI app — each box is a step, arrows show what happens next, and you can loop back.",
    whereUsed: "Complex agent workflows, multi-step pipelines, production agent orchestration.",
    relatedConcepts: ["Agent Loop", "ReAct", "CrewAI", "Tracing"],
    interviewTip: "Contrast LangGraph's explicit state machine model with simpler chain-based approaches for complex agents.",
  },
  {
    term: "Latency",
    slug: "latency",
    simpleDefinition: "The time it takes for an AI system to respond after receiving a request.",
    technicalDefinition:
      "End-to-end response time measured as time-to-first-token (TTFT) and time-to-last-token (TTLT), affected by model size, batching, network, retrieval steps, and hardware.",
    analogy: "Like how long you wait on hold before someone picks up the phone.",
    whereUsed: "Production SLAs, user experience optimization, real-time applications.",
    relatedConcepts: ["Throughput", "Inference", "Streaming", "Caching"],
    interviewTip: "Break down latency budget: retrieval + LLM TTFT + generation + tool calls. Know what to optimize first.",
  },
  {
    term: "LoRA",
    slug: "lora",
    simpleDefinition: "A lightweight fine-tuning method that trains small adapter matrices instead of the full model.",
    technicalDefinition:
      "Low-Rank Adaptation injects trainable rank-decomposition matrices (A×B) into attention layers, freezing base weights and training only ~0.1-1% of parameters for efficient task specialization.",
    analogy: "Like adding a small plugin to an app instead of rewriting the entire codebase.",
    whereUsed: "Domain fine-tuning, style adaptation, multi-adapter serving, resource-constrained training.",
    relatedConcepts: ["QLoRA", "PEFT", "Fine Tuning", "Quantization"],
    interviewTip: "Explain rank selection tradeoff: higher rank = more capacity but more memory. LoRA is the default PEFT method.",
  },
  {
    term: "MCP",
    slug: "mcp",
    simpleDefinition: "Model Context Protocol — a standard for connecting AI models to external tools and data sources.",
    technicalDefinition:
      "An open protocol defining how LLM clients discover and invoke tools, access resources, and use prompts from MCP servers via standardized JSON-RPC transport.",
    analogy: "USB-C for AI — one standard port to connect any tool or data source to any AI model.",
    whereUsed: "IDE integrations, agent tool ecosystems, enterprise AI platforms.",
    relatedConcepts: ["Tool Calling", "Agent", "Function Calling", "Observability"],
    interviewTip: "Explain the client-server architecture and how MCP differs from ad-hoc function calling.",
  },
  {
    term: "Memory",
    slug: "memory",
    simpleDefinition: "How AI agents store and recall information across conversations or tasks.",
    technicalDefinition:
      "Persistent state mechanisms including short-term (conversation buffer/summary), long-term (vector store of past interactions), and entity memory (structured facts about users), enabling context beyond the context window.",
    analogy: "Like a colleague who takes notes during meetings and remembers your preferences from last month.",
    whereUsed: "Chatbots, personal assistants, multi-session agents, customer support.",
    relatedConcepts: ["Agent", "Context Window", "Embedding", "RAG"],
    interviewTip: "Describe memory types and tradeoffs: buffer vs summary vs vector retrieval. Mention when to use external DB vs in-context.",
  },
  {
    term: "MoE",
    slug: "moe",
    simpleDefinition: "Mixture of Experts — a model architecture where only some neural network parts activate per input.",
    technicalDefinition:
      "A sparse architecture with multiple expert FFN sub-networks and a gating/router network that selects top-k experts per token, enabling larger total parameters with lower active compute per forward pass.",
    analogy: "Like a hospital where each patient sees only the relevant specialists, not every doctor in the building.",
    whereUsed: "Mixtral, GPT-4 (rumored), large-scale efficient models.",
    relatedConcepts: ["Transformer", "Inference", "Throughput", "Distillation"],
    interviewTip: "Explain the efficiency tradeoff: more total params but only fraction active — great for scaling with controlled inference cost.",
  },
  {
    term: "Multimodal",
    slug: "multimodal",
    simpleDefinition: "AI models that can process and generate multiple types of data — text, images, audio, video.",
    technicalDefinition:
      "Models with unified encoders or cross-modal attention processing heterogeneous inputs (vision + language), enabling tasks like image captioning, visual Q&A, and document understanding with charts.",
    analogy: "Like a person who can read, look at pictures, and listen to speech — not just one sense.",
    whereUsed: "GPT-4V, Gemini, Claude vision, document AI, content moderation.",
    relatedConcepts: ["Embedding", "Transformer", "RAG", "Inference"],
    interviewTip: "Know multimodal RAG: how to embed and retrieve images, tables, and text in unified pipelines.",
  },
  {
    term: "Observability",
    slug: "observability",
    simpleDefinition: "The ability to understand what's happening inside a running AI system through logs, metrics, and traces.",
    technicalDefinition:
      "Comprehensive monitoring of LLM applications including request tracing, token/cost tracking, latency histograms, retrieval quality, error rates, and drift detection via platforms like LangSmith, Arize, or Datadog.",
    analogy: "Like a car dashboard showing speed, fuel, and engine warnings — you need visibility to drive safely.",
    whereUsed: "Production AI deployments, SRE for ML, cost management, debugging.",
    relatedConcepts: ["Tracing", "Evaluation", "Latency", "Rate Limiting"],
    interviewTip: "Go beyond logging — explain the three pillars: metrics, logs, traces, and what to alert on in LLM apps.",
  },
  {
    term: "Ollama",
    slug: "ollama",
    simpleDefinition: "A tool for running open-source LLMs locally on your machine.",
    technicalDefinition:
      "A local inference runtime that packages and serves quantized open-weight models (Llama, Mistral, etc.) with a simple CLI and REST API, handling model downloads, GPU/CPU routing, and context management.",
    analogy: "Like having a private AI assistant on your laptop instead of calling a cloud service.",
    whereUsed: "Local development, privacy-sensitive apps, offline inference, prototyping.",
    relatedConcepts: ["Inference", "Quantization", "vLLM", "Latency"],
    interviewTip: "Know when local inference makes sense: privacy, cost at scale, latency — vs cloud for latest models and scale.",
  },
  {
    term: "PEFT",
    slug: "peft",
    simpleDefinition: "Parameter-Efficient Fine-Tuning — methods to adapt large models by training only a small subset of parameters.",
    technicalDefinition:
      "A family of techniques (LoRA, QLoRA, prefix tuning, adapters) that freeze most base model weights and train lightweight modules, reducing memory, storage, and training time.",
    analogy: "Like customizing a car with aftermarket parts instead of rebuilding the engine.",
    whereUsed: "Fine-tuning on limited hardware, multi-task serving, rapid experimentation.",
    relatedConcepts: ["LoRA", "QLoRA", "Fine Tuning", "Quantization"],
    interviewTip: "PEFT is the umbrella term — name specific methods (LoRA most common) and when each applies.",
  },
  {
    term: "Plan Execute",
    slug: "plan-execute",
    simpleDefinition: "An agent pattern that first creates a full plan, then executes each step sequentially.",
    technicalDefinition:
      "A two-phase agent architecture: a planner LLM decomposes the task into steps, then an executor agent carries out each step (with optional re-planning on failure), separating strategic planning from tactical execution.",
    analogy: "Like writing a recipe before cooking — you think through all steps first, then follow them one by one.",
    whereUsed: "Complex multi-step tasks, research agents, workflow automation.",
    relatedConcepts: ["ReAct", "Agent Loop", "LangGraph", "Chain-of-Thought"],
    interviewTip: "Compare Plan-Execute vs ReAct: planning upfront vs interleaved reasoning-action. Plan-Execute is better for structured tasks.",
  },
  {
    term: "Prompt Engineering",
    slug: "prompt-engineering",
    simpleDefinition: "The practice of crafting effective inputs to get better outputs from AI models.",
    technicalDefinition:
      "The systematic design of prompts including system instructions, few-shot examples, output format constraints, chain-of-thought triggers, and iterative refinement to maximize task performance without model changes.",
    analogy: "Like learning to ask good questions — the same expert gives better answers to well-framed questions.",
    whereUsed: "All LLM applications, prototyping, production prompt templates.",
    relatedConcepts: ["System Prompt", "Few-shot", "Chain-of-Thought", "Temperature"],
    interviewTip: "Show a before/after prompt improvement. Mention versioning, A/B testing, and prompt templates in production.",
  },
  {
    term: "Prompt Injection",
    slug: "prompt-injection",
    simpleDefinition: "An attack where malicious input manipulates an AI system to ignore its instructions.",
    technicalDefinition:
      "A security vulnerability where adversarial text in user input or retrieved documents overrides system prompts, causing unintended model behavior or data exfiltration.",
    analogy: "Someone slipping a note into your assistant's inbox saying 'ignore all previous instructions.'",
    whereUsed: "Any LLM application accepting user input — especially RAG and agent systems.",
    relatedConcepts: ["Guardrails", "Hallucination", "RAG", "Evaluation"],
    interviewTip: "Discuss defense layers: input sanitization, output filtering, privilege separation, prompt isolation.",
  },
  {
    term: "PydanticAI",
    slug: "pydanticai",
    simpleDefinition: "A Python framework for building type-safe AI agents with structured outputs.",
    technicalDefinition:
      "A framework by the Pydantic team combining LLM calls with Pydantic model validation, dependency injection, tool registration, and structured output parsing for reliable agent development.",
    analogy: "Like building with LEGO blocks that only fit together the right way — type safety catches mistakes early.",
    whereUsed: "Production Python agents, APIs requiring validated outputs, type-safe tool calling.",
    relatedConcepts: ["Structured Outputs", "Agent", "Function Calling", "Tool Calling"],
    interviewTip: "Highlight PydanticAI's strength: validated structured outputs and Python-native developer experience.",
  },
  {
    term: "QLoRA",
    slug: "qlora",
    simpleDefinition: "Fine-tuning large models on a single GPU by combining quantization with LoRA adapters.",
    technicalDefinition:
      "Quantized Low-Rank Adaptation: base model weights stored in 4-bit NF4 quantization, with LoRA adapters trained in higher precision, enabling fine-tuning 65B+ models on consumer GPUs.",
    analogy: "Like compressing a textbook to fit in your bag, then adding sticky notes with your own annotations.",
    whereUsed: "Fine-tuning on limited hardware, open-source model customization, research.",
    relatedConcepts: ["LoRA", "PEFT", "Quantization", "Fine Tuning"],
    interviewTip: "QLoRA made fine-tuning accessible — explain 4-bit NF4 + double quantization + LoRA stack.",
  },
  {
    term: "Quantization",
    slug: "quantization",
    simpleDefinition: "Reducing model precision to make models smaller and faster with minimal quality loss.",
    technicalDefinition:
      "Converting model weights from FP32/FP16 to lower bit-width representations (INT8, INT4, NF4), reducing memory footprint and increasing inference throughput via optimized kernels.",
    analogy: "Like converting a high-res photo to a smaller file — slightly less detail, but much faster to share.",
    whereUsed: "Edge deployment, cost reduction, local inference (Ollama), production serving.",
    relatedConcepts: ["Inference", "QLoRA", "Distillation", "vLLM"],
    interviewTip: "Know quantization formats: GPTQ, AWQ, GGUF. Explain accuracy vs speed tradeoff at different bit levels.",
  },
  {
    term: "RAG",
    slug: "rag",
    simpleDefinition: "Retrieval-Augmented Generation — enhancing LLM responses with relevant external knowledge.",
    technicalDefinition:
      "A pipeline that retrieves relevant documents from a knowledge base using embedding similarity, injects them into the prompt context, and generates grounded responses.",
    analogy: "An open-book exam — the model can look up answers in reference materials before responding.",
    whereUsed: "Enterprise chatbots, document Q&A, knowledge bases, customer support.",
    relatedConcepts: ["Embedding", "Vector DB", "Chunking", "Re-ranking"],
    interviewTip: "Walk through the full pipeline: ingest → chunk → embed → store → retrieve → rerank → generate → evaluate.",
  },
  {
    term: "RAGAS",
    slug: "ragas",
    simpleDefinition: "A framework for automatically evaluating the quality of RAG systems.",
    technicalDefinition:
      "Retrieval-Augmented Generation Assessment: an open-source library computing metrics like faithfulness, answer relevancy, context precision, and context recall using LLM-based evaluators.",
    analogy: "Like a quality inspector checking if a student's open-book answers actually used the textbook correctly.",
    whereUsed: "RAG pipeline evaluation, CI/CD for AI, benchmarking retrieval strategies.",
    relatedConcepts: ["Evaluation", "RAG", "Grounding", "Hallucination"],
    interviewTip: "Name key RAGAS metrics: faithfulness (grounded in context?), answer relevancy, context precision/recall.",
  },
  {
    term: "Rate Limiting",
    slug: "rate-limiting",
    simpleDefinition: "Controlling how many requests a user or system can make in a given time period.",
    technicalDefinition:
      "Throttling mechanisms (token bucket, sliding window) applied at API gateway, provider, or application level to manage cost, prevent abuse, and ensure fair resource allocation across tenants.",
    analogy: "Like a bouncer at a club letting in 100 people per hour — keeps things manageable.",
    whereUsed: "Production API serving, multi-tenant SaaS, cost control, DDoS prevention.",
    relatedConcepts: ["Latency", "Throughput", "Caching", "Observability"],
    interviewTip: "Discuss rate limiting at multiple levels: provider quotas, app-level per-user limits, and queue-based backpressure.",
  },
  {
    term: "Re-ranking",
    slug: "re-ranking",
    simpleDefinition: "Re-scoring retrieved documents with a more accurate model to improve result ordering.",
    technicalDefinition:
      "A second-stage retrieval step applying a cross-encoder or LLM-based scorer to the top-k candidates from initial retrieval, reordering by relevance before context injection.",
    analogy: "Like a hiring manager reviewing the top 10 resumes more carefully after HR does an initial screen.",
    whereUsed: "RAG pipelines, search engines, recommendation systems.",
    relatedConcepts: ["Cross Encoder", "Retriever", "Hybrid Search", "RAG"],
    interviewTip: "Two-stage retrieval is standard: fast bi-encoder for recall, cross-encoder for precision. Know the latency cost.",
  },
  {
    term: "ReAct",
    slug: "react",
    simpleDefinition: "An agent pattern where the model alternates between reasoning and taking actions.",
    technicalDefinition:
      "Reasoning + Acting: the LLM generates interleaved Thought → Action → Observation steps, using natural language reasoning to decide which tools to invoke and updating plans based on results.",
    analogy: "Like a mechanic who thinks aloud ('the engine sounds rough'), tries a fix, checks the result, and adjusts.",
    whereUsed: "Tool-using agents, question answering with search, multi-step problem solving.",
    relatedConcepts: ["Agent Loop", "Tool Calling", "Chain-of-Thought", "Plan Execute"],
    interviewTip: "ReAct is the foundational agent pattern — explain the Thought/Action/Observation trace format.",
  },
  {
    term: "Reflection",
    slug: "reflection",
    simpleDefinition: "An agent technique where the AI critiques and improves its own outputs before finalizing.",
    technicalDefinition:
      "A self-correction loop where the model evaluates its draft output against criteria, identifies errors or gaps, and regenerates improved responses — often implemented as a critic-reflector agent pair.",
    analogy: "Like proofreading your email before sending — you catch mistakes you'd miss if you hit send immediately.",
    whereUsed: "Code generation, writing assistants, complex reasoning agents, quality improvement.",
    relatedConcepts: ["Agent Loop", "Chain-of-Thought", "Evaluation", "ReAct"],
    interviewTip: "Reflection adds latency but improves quality — know when the tradeoff is worth it (high-stakes outputs).",
  },
  {
    term: "Retriever",
    slug: "retriever",
    simpleDefinition: "The component in a RAG system that finds relevant documents for a given query.",
    technicalDefinition:
      "A retrieval module executing similarity search (dense, sparse, or hybrid) over an indexed corpus, returning top-k document chunks with scores for downstream re-ranking and generation.",
    analogy: "Like a research librarian who quickly finds the most relevant books for your question.",
    whereUsed: "RAG pipelines, search systems, knowledge management.",
    relatedConcepts: ["Embedding", "BM25", "Hybrid Search", "Re-ranking"],
    interviewTip: "Discuss retriever design choices: embedding model, top-k size, metadata filters, and hybrid strategies.",
  },
  {
    term: "RLHF",
    slug: "rlhf",
    simpleDefinition: "Training AI models using human feedback to align outputs with human preferences.",
    technicalDefinition:
      "Reinforcement Learning from Human Feedback: collect human preference rankings, train a reward model, then optimize the LLM policy via PPO or similar RL to maximize reward while staying close to the base model.",
    analogy: "Like training a dog with treats — good behavior gets rewarded until it becomes habit.",
    whereUsed: "ChatGPT alignment, instruction-following models, safety tuning.",
    relatedConcepts: ["SFT", "Fine Tuning", "Evaluation", "Guardrails"],
    interviewTip: "Know the RLHF pipeline: SFT → reward model → RL optimization. Mention alternatives like DPO and constitutional AI.",
  },
  {
    term: "RoPE",
    slug: "rope",
    simpleDefinition: "A technique that helps transformers understand the position of words in a sequence.",
    technicalDefinition:
      "Rotary Position Embedding applies rotation matrices to query and key vectors based on token position, encoding relative positional information in attention without explicit positional embeddings.",
    analogy: "Like numbered seats in a theater — everyone knows their position relative to others.",
    whereUsed: "Llama, Mistral, GPT-NeoX, most modern LLMs.",
    relatedConcepts: ["Attention", "Transformer", "KV Cache", "Context Window"],
    interviewTip: "RoPE enables better length extrapolation than absolute positional embeddings — know why it matters for long context.",
  },
  {
    term: "Semantic Kernel",
    slug: "semantic-kernel",
    simpleDefinition: "Microsoft's SDK for integrating AI services into applications with plugins and planners.",
    technicalDefinition:
      "An open-source orchestration SDK providing abstractions for prompts, plugins (tools), memory, and planners that decompose goals into steps across .NET, Python, and Java applications.",
    analogy: "Like a Swiss Army knife for AI — standardized pieces you snap together for any application.",
    whereUsed: "Enterprise .NET/Python apps, Microsoft ecosystem integrations, plugin-based agents.",
    relatedConcepts: ["Agent", "Tool Calling", "Memory", "Plan Execute"],
    interviewTip: "Semantic Kernel's plugin model is its core abstraction — compare with LangChain's tool ecosystem.",
  },
  {
    term: "Semantic Search",
    slug: "semantic-search",
    simpleDefinition: "Search that finds results by meaning rather than exact keyword matches.",
    technicalDefinition:
      "Retrieval using dense vector embeddings to match queries and documents in semantic space, capturing synonyms, paraphrases, and conceptual similarity beyond lexical overlap.",
    analogy: "Like asking a librarian for 'books about feeling sad' and getting results about grief and melancholy too.",
    whereUsed: "RAG, enterprise search, content discovery, Q&A systems.",
    relatedConcepts: ["Embedding", "Vector Search", "Hybrid Search", "Cosine Similarity"],
    interviewTip: "Semantic search fails on exact matches (SKUs, error codes) — that's why hybrid search exists.",
  },
  {
    term: "SFT",
    slug: "sft",
    simpleDefinition: "Supervised Fine-Tuning — training a model on labeled input-output examples.",
    technicalDefinition:
      "The first stage of alignment: fine-tuning a base model on curated instruction-response pairs using standard supervised learning (cross-entropy loss) to teach instruction-following behavior.",
    analogy: "Like teaching with a textbook of worked examples — the student learns the expected format and style.",
    whereUsed: "Instruction tuning, chat model training, domain adaptation, RLHF pipeline first stage.",
    relatedConcepts: ["Fine Tuning", "RLHF", "Few-shot", "PEFT"],
    interviewTip: "SFT is step 1 before RLHF. Know data quality requirements: diverse, high-quality instruction-response pairs.",
  },
  {
    term: "Streaming",
    slug: "streaming",
    simpleDefinition: "Sending AI responses token-by-token as they're generated instead of waiting for the complete answer.",
    technicalDefinition:
      "Server-sent events or WebSocket delivery of autoregressively generated tokens, reducing perceived latency (TTFT) and enabling real-time UI updates during long generations.",
    analogy: "Like watching a live sports broadcast instead of waiting for the full replay.",
    whereUsed: "Chat UIs, voice assistants, real-time applications, long-form generation.",
    relatedConcepts: ["Inference", "Latency", "KV Cache", "Observability"],
    interviewTip: "Streaming improves UX but complicates error handling and token counting — mention both sides.",
  },
  {
    term: "Structured Outputs",
    slug: "structured-outputs",
    simpleDefinition: "Forcing AI models to respond in a specific, machine-readable format like JSON.",
    technicalDefinition:
      "Constraining model generation to valid JSON/XML/schema via constrained decoding, grammar-based sampling, or post-processing validation, ensuring parseable outputs for downstream systems.",
    analogy: "Like filling out a form with specific fields instead of writing a free-form essay.",
    whereUsed: "API integrations, data extraction, agent tool calls, form filling.",
    relatedConcepts: ["Function Calling", "Tool Calling", "PydanticAI", "Prompt Engineering"],
    interviewTip: "Know approaches: JSON mode, function calling schemas, constrained decoding, and Pydantic validation as fallback.",
  },
  {
    term: "System Prompt",
    slug: "system-prompt",
    simpleDefinition: "Instructions that define the AI's role, behavior, and constraints for a conversation.",
    technicalDefinition:
      "A persistent message (system role) prepended to the conversation that sets persona, capabilities, output format, safety guidelines, and tool usage rules, processed with higher priority than user messages.",
    analogy: "Like an employee handbook — it defines how the assistant should behave in every interaction.",
    whereUsed: "All production chatbots, agents, API integrations.",
    relatedConcepts: ["Prompt Engineering", "Guardrails", "Few-shot", "Prompt Injection"],
    interviewTip: "System prompts are your first line of defense — discuss layering: system prompt + guardrails + output validation.",
  },
  {
    term: "Temperature",
    slug: "temperature",
    simpleDefinition: "A setting that controls how random or deterministic an AI model's responses are.",
    technicalDefinition:
      "A scaling factor applied to logits before softmax: T→0 makes output deterministic (argmax), T→1 uses raw distribution, T>1 increases entropy and randomness.",
    analogy: "A creativity dial — low temperature gives predictable answers, high temperature gives creative surprises.",
    whereUsed: "All LLM API calls — tune per use case (0 for code, 0.7 for creative writing).",
    relatedConcepts: ["Top P", "Inference", "Prompt Engineering"],
    interviewTip: "Know practical defaults: 0 for extraction/classification, 0.3-0.7 for chat, 0.8+ for creative tasks.",
  },
  {
    term: "Throughput",
    slug: "throughput",
    simpleDefinition: "How many requests or tokens an AI system can process per unit of time.",
    technicalDefinition:
      "Serving capacity measured in requests/sec or tokens/sec, optimized via batching, continuous batching (vLLM), model parallelism, and hardware scaling.",
    analogy: "Like how many customers a restaurant can serve per hour — not just how fast one meal is cooked.",
    whereUsed: "Production capacity planning, cost modeling, SLA design.",
    relatedConcepts: ["Latency", "Inference", "vLLM", "Quantization"],
    interviewTip: "Throughput vs latency tradeoff: batching increases throughput but may increase individual request latency.",
  },
  {
    term: "Token",
    slug: "token",
    simpleDefinition: "The basic unit of text that AI models process — roughly a word or part of a word.",
    technicalDefinition:
      "A subword unit from a tokenizer vocabulary (BPE, SentencePiece) that models consume as input/output, with typical English text averaging ~0.75 words per token.",
    analogy: "Like syllables or word fragments — 'unbelievable' might be 3 tokens: 'un', 'believ', 'able'.",
    whereUsed: "All LLM APIs, billing, context window limits, chunking strategies.",
    relatedConcepts: ["Tokenization", "Context Window", "Inference", "Latency"],
    interviewTip: "Tokens drive cost and context limits — know how to estimate token counts and why they matter for pricing.",
  },
  {
    term: "Tokenization",
    slug: "tokenization",
    simpleDefinition: "The process of breaking text into tokens that a model can understand.",
    technicalDefinition:
      "Converting raw text to integer token IDs using subword algorithms (BPE, WordPiece, SentencePiece), handling whitespace, special tokens, and vocabulary mapping for model input.",
    analogy: "Like cutting a sentence into puzzle pieces that the model's dictionary recognizes.",
    whereUsed: "All LLM preprocessing, embedding pipelines, context window management.",
    relatedConcepts: ["Token", "Context Window", "Embedding", "Inference"],
    interviewTip: "Different models use different tokenizers — same text can have different token counts across models.",
  },
  {
    term: "Tool Calling",
    slug: "tool-calling",
    simpleDefinition: "When an LLM decides to invoke external functions or APIs to complete a task.",
    technicalDefinition:
      "A structured output pattern where the model generates a JSON schema specifying a function name and arguments, which the runtime executes and returns results to the model.",
    analogy: "A manager who doesn't do everything themselves — they delegate tasks to specialists and use the results.",
    whereUsed: "Agents, API integrations, database queries, code execution.",
    relatedConcepts: ["Agent", "Function Calling", "MCP", "Structured Outputs"],
    interviewTip: "Describe the loop: model requests tool → runtime executes → result fed back → model continues.",
  },
  {
    term: "Top P",
    slug: "top-p",
    simpleDefinition: "A sampling setting that limits choices to the most likely tokens whose combined probability reaches P.",
    technicalDefinition:
      "Nucleus sampling: at each step, select the smallest set of tokens whose cumulative probability ≥ p (e.g., 0.9), then sample from that set, dynamically adjusting candidate pool size.",
    analogy: "Like only considering the top candidates who together have 90% of the votes, ignoring long-shot options.",
    whereUsed: "Text generation, creative writing, chat applications alongside temperature.",
    relatedConcepts: ["Temperature", "Inference", "Prompt Engineering"],
    interviewTip: "Top-p and temperature are often used together. Top-p prevents sampling from the long tail of unlikely tokens.",
  },
  {
    term: "Tracing",
    slug: "tracing",
    simpleDefinition: "Recording the full execution path of an AI application for debugging and monitoring.",
    technicalDefinition:
      "Distributed tracing of LLM calls, retrievals, tool invocations, and latencies using tools like LangSmith, Phoenix, or OpenTelemetry spans.",
    analogy: "A flight recorder for your AI app — see exactly what happened when something went wrong.",
    whereUsed: "Production AI systems, agent debugging, cost monitoring.",
    relatedConcepts: ["Observability", "Evaluation", "Latency", "Agent Loop"],
    interviewTip: "Mention key metrics to trace: token usage, latency per step, retrieval relevance scores, error rates.",
  },
  {
    term: "Transformer",
    slug: "transformer",
    simpleDefinition: "The neural network architecture that powers virtually all modern LLMs.",
    technicalDefinition:
      "An encoder-decoder (or decoder-only) architecture using multi-head self-attention and feed-forward layers, with positional encoding, enabling parallel processing of sequences.",
    analogy: "A team of experts who each read the entire document simultaneously and share notes about what's important.",
    whereUsed: "GPT, BERT, Claude, Gemini, and all frontier models.",
    relatedConcepts: ["Attention", "RoPE", "MoE", "KV Cache"],
    interviewTip: "Draw the encoder-decoder diagram and explain why transformers replaced RNNs for NLP.",
  },
  {
    term: "Vector DB",
    slug: "vector-db",
    simpleDefinition: "A database optimized for storing and searching high-dimensional vector embeddings.",
    technicalDefinition:
      "A specialized datastore using approximate nearest neighbor (ANN) algorithms (HNSW, IVF) for sub-linear similarity search over dense vector collections with metadata filtering.",
    analogy: "A library organized by meaning instead of alphabetical order — you find books on similar topics instantly.",
    whereUsed: "RAG pipelines, semantic search, recommendation engines.",
    relatedConcepts: ["Embedding", "HNSW", "Vector Search", "RAG"],
    interviewTip: "Compare Pinecone, Weaviate, Qdrant, Chroma — know tradeoffs between managed vs self-hosted.",
  },
  {
    term: "Vector Search",
    slug: "vector-search",
    simpleDefinition: "Finding similar items by comparing their vector representations.",
    technicalDefinition:
      "Nearest neighbor search over embedding vectors using distance metrics (cosine, dot product, L2) with ANN indexes (HNSW, IVF-PQ) for scalable similarity retrieval.",
    analogy: "Like finding your neighbors on a map by GPS coordinates instead of street names.",
    whereUsed: "RAG retrieval, recommendation systems, deduplication, image search.",
    relatedConcepts: ["Vector DB", "Embedding", "Cosine Similarity", "HNSW"],
    interviewTip: "Vector search is the retrieval engine behind RAG — know index types and when to rebuild indexes.",
  },
  {
    term: "vLLM",
    slug: "vllm",
    simpleDefinition: "A high-performance library for serving large language models in production.",
    technicalDefinition:
      "An inference engine featuring PagedAttention for efficient KV cache memory management, continuous batching, tensor parallelism, and OpenAI-compatible API serving for high-throughput LLM deployment.",
    analogy: "Like an express highway system for AI — moves many requests efficiently instead of one at a time.",
    whereUsed: "Production LLM serving, self-hosted deployments, high-throughput APIs.",
    relatedConcepts: ["Inference", "Throughput", "KV Cache", "Quantization"],
    interviewTip: "vLLM's PagedAttention is the key innovation — explain how it reduces KV cache memory fragmentation.",
  },
];

export function getGlossaryBySlug(slug: string): GlossaryEntry | undefined {
  return glossary.find((g) => g.slug === slug);
}

export function getGlossaryByLetter(): Record<string, GlossaryEntry[]> {
  return glossary.reduce(
    (acc, entry) => {
      const letter = entry.term[0].toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(entry);
      return acc;
    },
    {} as Record<string, GlossaryEntry[]>
  );
}
