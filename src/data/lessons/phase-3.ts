import type { LessonContent } from "../lesson-types";
import { createLesson, iq } from "./builder";

export const phase3Lessons: Record<string, LessonContent> = {
  "openai-apis": createLesson({
    concept:
      "OpenAI APIs provide production-ready access to GPT models, embeddings, image generation, and speech — the most widely used LLM platform for building AI applications.",
    whyItExists:
      "Training and hosting LLMs requires massive GPU infrastructure. OpenAI APIs abstract this away — developers call a REST endpoint and get state-of-the-art model capabilities without managing infrastructure.",
    analogy:
      "OpenAI API is like electricity from the grid — you don't build your own power plant. You plug in, pay per use, and get reliable power (intelligence) on demand.",
    technicalExplanation:
      "Core APIs: Chat Completions (GPT-4o, GPT-4o-mini) for text generation with message-based interface. Embeddings (text-embedding-3-small/large) for vector representations. Images (DALL-E 3) for generation. Audio (Whisper for STT, TTS for speech). Key parameters: model, messages (system/user/assistant roles), temperature, max_tokens, top_p, stream, tools (function calling), response_format (JSON mode). Pricing per token (input + output priced separately). Rate limits by tier. SDK: openai Python/JS package with sync and async clients.",
    architecture:
      "Client App → OpenAI SDK → HTTPS API → Load Balancer → Model Server (GPU cluster) → Response. For agents: your app orchestrates multiple API calls (LLM + tools + embeddings).",
    diagram: `flowchart LR
    A[Your Application] --> B[OpenAI SDK]
    B --> C[Chat Completions API]
    B --> D[Embeddings API]
    B --> E[Images API]
    B --> F[Audio API]
    C --> G[GPT-4o Model]
    D --> H[Embedding Model]
    E --> I[DALL-E 3]
    F --> J[Whisper / TTS]`,
    example:
      "Building a support chatbot: system message defines persona, user messages are customer queries, assistant messages maintain history. GPT-4o generates responses. Embeddings API indexes FAQ docs. Function calling checks order status from your database.",
    code: `from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Chat completion
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful coding assistant."},
        {"role": "user", "content": "Write a Python function to reverse a string."},
    ],
    temperature=0,
    max_tokens=200,
)
print(response.choices[0].message.content)

# Embeddings
emb = client.embeddings.create(
    model="text-embedding-3-small",
    input="OpenAI embeddings for semantic search",
)
print(f"Embedding dim: {len(emb.data[0].embedding)}")`,
    project:
      "Build a multi-feature AI app: chat endpoint (GPT-4o-mini), document search (embeddings + cosine similarity), and image generation (DALL-E) — all behind a FastAPI server.",
    interviewQuestions: [
      iq("What is the difference between gpt-4o and gpt-4o-mini?", "gpt-4o is the flagship multimodal model (text, vision, audio). gpt-4o-mini is cheaper and faster with slightly lower capability — ideal for high-volume tasks like classification and simple generation.", "easy"),
      iq("How does OpenAI pricing work?", "Per-token pricing: separate rates for input and output tokens. gpt-4o-mini: ~$0.15/1M input, $0.60/1M output. Embeddings priced per input token. Images per generation. Costs scale linearly with usage.", "medium"),
      iq("What are system, user, and assistant message roles?", "System: sets behavior/persona (highest priority instructions). User: end-user input. Assistant: model's previous responses. Together they form conversation context the model conditions on.", "easy"),
    ],
    revisionNotes: {
      fiveMin: [
        "OpenAI API: Chat, Embeddings, Images, Audio",
        "Messages: system, user, assistant roles",
        "Key params: model, temperature, max_tokens",
        "Pay per token — input and output priced separately",
      ],
      fifteenMin: [
        "gpt-4o: flagship multimodal model",
        "gpt-4o-mini: fast, cheap for high volume",
        "text-embedding-3-small/large for vectors",
        "stream=True for real-time token delivery",
        "tools parameter enables function calling",
        "Rate limits by usage tier",
      ],
      oneHour: [
        "Build FastAPI app with OpenAI integration",
        "Implement chat with conversation history",
        "Add embeddings-based document search",
        "Use function calling for tool integration",
        "Add streaming responses to frontend",
        "Calculate and optimize token costs",
      ],
      cheatSheet: [
        "client.chat.completions.create()",
        "model: gpt-4o-mini, gpt-4o",
        "messages: [{role, content}]",
        "temperature: 0 for factual",
        "stream=True for streaming",
        "embeddings: text-embedding-3-small",
      ],
    },
    glossary: ["Chat Completions", "Token", "System Message", "Rate Limit"],
    commonMistakes: [
      "Hardcoding API keys instead of environment variables",
      "Not tracking token usage — surprise bills",
      "Using gpt-4o for simple tasks — overpaying",
      "Ignoring rate limits in production — 429 errors",
    ],
  }),

  gemini: createLesson({
    concept:
      "Google Gemini is a family of multimodal LLMs natively trained on text, images, audio, and video — offering competitive alternatives to GPT-4 with strong integration into Google Cloud.",
    whyItExists:
      "Enterprises need model diversity beyond OpenAI — for cost optimization, vendor redundancy, and Google Cloud integration. Gemini provides native multimodality and competitive performance at lower price points.",
    analogy:
      "If OpenAI is iOS, Gemini is Android — a capable alternative with different strengths, native integration with Google's ecosystem (Cloud, Search, Workspace), and competitive pricing.",
    technicalExplanation:
      "Gemini family: Gemini 2.0 Flash (fast, cheap), Gemini 2.0 Pro (capable), Gemini 1.5 Pro (long context up to 2M tokens). Native multimodal: accepts text, images, audio, video in a single prompt. API via Google AI Studio (free tier) or Vertex AI (enterprise). SDK: google-generativeai Python package. Features: function calling, JSON mode, grounding with Google Search, code execution. Context caching for repeated long prompts. Safety settings configurable per request.",
    architecture:
      "Client → google-generativeai SDK → Gemini API (AI Studio or Vertex AI) → Gemini Model. Vertex AI adds: IAM, VPC, monitoring, batch prediction, fine-tuning.",
    diagram: `flowchart TD
    A[Application] --> B{Access Method}
    B -->|Developer| C[Google AI Studio]
    B -->|Enterprise| D[Vertex AI]
    C --> E[Gemini API]
    D --> E
    E --> F[Gemini 2.0 Flash]
    E --> G[Gemini 2.0 Pro]
    E --> H[Gemini 1.5 Pro 2M context]`,
    example:
      "Analyzing a product demo video: send video file + prompt 'Summarize key features and identify UI issues' to Gemini 1.5 Pro. Model processes video natively (no frame extraction needed) and returns structured analysis.",
    code: `import google.generativeai as genai

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

# Text generation
response = model.generate_content("Explain RAG in 2 sentences.")
print(response.text)

# Multimodal: image + text
import PIL.Image
img = PIL.Image.open("diagram.png")
response = model.generate_content(["Describe this architecture diagram:", img])
print(response.text)`,
    project:
      "Build a document analyzer that accepts PDFs and images via Gemini's multimodal API. Extract key information and return structured JSON. Compare quality and cost vs GPT-4o on the same inputs.",
    interviewQuestions: [
      iq("What makes Gemini natively multimodal?", "Gemini was trained on interleaved text, images, audio, and video from the start — not bolted on later. This means better cross-modal understanding than models with separate vision encoders.", "medium"),
      iq("When would you choose Gemini over OpenAI?", "Long context needs (2M tokens), Google Cloud integration, multimodal inputs (video), cost optimization (Flash is very cheap), or vendor diversification for production reliability.", "easy"),
      iq("What is Gemini context caching?", "Cache a large prompt prefix (e.g., 100K token document) and reuse it across requests. Pay reduced rate for cached tokens. Ideal for RAG with large knowledge bases.", "hard"),
    ],
    revisionNotes: {
      fiveMin: [
        "Gemini: Google's multimodal LLM family",
        "Flash = fast/cheap, Pro = capable",
        "Native text, image, audio, video input",
        "AI Studio (dev) or Vertex AI (enterprise)",
      ],
      fifteenMin: [
        "Gemini 1.5 Pro: up to 2M token context",
        "google-generativeai Python SDK",
        "Grounding with Google Search",
        "Context caching for repeated long prompts",
        "Safety settings per request",
        "Function calling and JSON mode supported",
      ],
      oneHour: [
        "Set up Gemini via AI Studio",
        "Build multimodal analyzer (image + text)",
        "Compare Gemini Flash vs GPT-4o-mini cost",
        "Use context caching for RAG pipeline",
        "Implement function calling with Gemini",
        "Deploy on Vertex AI with monitoring",
      ],
      cheatSheet: [
        "genai.GenerativeModel('gemini-2.0-flash')",
        "generate_content([text, image])",
        "1.5 Pro: 2M context window",
        "AI Studio: free dev tier",
        "Vertex AI: enterprise GCP",
        "Context caching for long prompts",
      ],
    },
    glossary: ["Gemini Flash", "Vertex AI", "Context Caching", "Grounding"],
    commonMistakes: [
      "Using Vertex AI complexity when AI Studio suffices for prototyping",
      "Not configuring safety settings — unexpected content blocks",
      "Ignoring context caching for repeated large prompts — overpaying",
      "Assuming Gemini API is identical to OpenAI — different SDK patterns",
    ],
  }),

  claude: createLesson({
    concept:
      "Claude by Anthropic is an LLM family known for strong reasoning, long context (200K tokens), safety focus, and excellent coding capabilities — a top choice for complex agentic workflows.",
    whyItExists:
      "The market needs capable, safety-focused alternatives to GPT. Claude excels at long-document analysis, nuanced instruction following, code generation, and agentic tool use — with Constitutional AI training for helpful, harmless, honest behavior.",
    analogy:
      "If GPT is a versatile generalist, Claude is the careful, thorough analyst — excels at reading long documents, following complex instructions precisely, and writing clean code with strong reasoning.",
    technicalExplanation:
      "Claude family: Haiku (fast, cheap), Sonnet (balanced — best value), Opus (most capable). API via Anthropic SDK. Key features: 200K context window, vision (image input), tool use (function calling), prompt caching (cache system prompts and documents), computer use (beta). Messages API with system parameter. XML-style thinking in responses. Strong at: code review, document analysis, agent orchestration, structured extraction. Pricing competitive with GPT-4o.",
    architecture:
      "Client → Anthropic SDK → Messages API → Claude Model. Prompt caching layer stores repeated prefixes. Tool use loop: model requests tool → client executes → returns result → model continues.",
    diagram: `flowchart LR
    A[Application] --> B[Anthropic SDK]
    B --> C[Messages API]
    C --> D{Model Tier}
    D --> E[Haiku: Fast]
    D --> F[Sonnet: Balanced]
    D --> G[Opus: Capable]
    C --> H[Prompt Cache]
    C --> I[Tool Use Loop]`,
    example:
      "Code review agent: send 50K token codebase as cached context + 'Review for security vulnerabilities'. Claude Sonnet analyzes entire codebase in one pass, returns structured findings with file:line references.",
    code: `import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    system="You are a senior code reviewer. Be thorough and specific.",
    messages=[
        {"role": "user", "content": "Review this function for bugs:\\n\\ndef divide(a, b):\\n    return a / b"}
    ],
)

print(message.content[0].text)

# With tool use
tools = [{
    "name": "get_weather",
    "description": "Get weather for a city",
    "input_schema": {
        "type": "object",
        "properties": {"city": {"type": "string"}},
        "required": ["city"],
    },
}]`,
    project:
      "Build a code review agent using Claude Sonnet with prompt caching. Cache a style guide as system prompt, send PR diffs as user messages, get structured review comments with severity levels.",
    interviewQuestions: [
      iq("What is Claude's prompt caching and when is it useful?", "Cache repeated prompt prefixes (system prompts, documents) across requests. Cached tokens billed at 90% discount. Ideal for agents with fixed instructions and large reference documents.", "medium"),
      iq("How does Claude's tool use differ from OpenAI function calling?", "Conceptually similar — model requests tool execution, client runs it, returns result. Claude uses tool_use content blocks in messages. Both enable agentic workflows. API shapes differ slightly.", "medium"),
      iq("When would you choose Claude Sonnet over GPT-4o?", "Long document analysis (200K context), code generation/review, complex instruction following, agentic workflows with many tools, or when Constitutional AI safety alignment matters for your use case.", "easy"),
    ],
    revisionNotes: {
      fiveMin: [
        "Claude: Anthropic's LLM family",
        "Haiku/Sonnet/Opus tiers",
        "200K context, strong coding ability",
        "Prompt caching for cost savings",
      ],
      fifteenMin: [
        "Sonnet: best value for most tasks",
        "Messages API with system parameter",
        "Tool use for agentic workflows",
        "Prompt caching: 90% discount on cached tokens",
        "Vision: image input support",
        "Constitutional AI training approach",
      ],
      oneHour: [
        "Build agent with Claude tool use",
        "Implement prompt caching for RAG",
        "Compare Sonnet vs GPT-4o on coding tasks",
        "Long document analysis (100K+ tokens)",
        "Structured extraction with Claude",
        "Cost optimization with Haiku for simple tasks",
      ],
      cheatSheet: [
        "client.messages.create()",
        "model: claude-sonnet-4-20250514",
        "system= for instructions",
        "max_tokens required",
        "cache_control for prompt caching",
        "tools= for function calling",
      ],
    },
    glossary: ["Claude Sonnet", "Prompt Caching", "Tool Use", "Constitutional AI"],
    commonMistakes: [
      "Not using prompt caching for repeated system prompts — wasting money",
      "Using Opus for simple tasks — Sonnet is sufficient and cheaper",
      "Forgetting max_tokens parameter — required by Anthropic API",
      "Not handling tool_use stop reason in agent loops",
    ],
  }),

  ollama: createLesson({
    concept:
      "Ollama is a local LLM runtime that makes it easy to download, run, and interact with open-source models on your own hardware — essential for privacy, offline use, and development without API costs.",
    whyItExists:
      "Cloud APIs send data to third parties, cost money per token, and require internet. Ollama lets developers run Llama, Mistral, Gemma, and other models locally with a simple CLI and API — zero cost, full privacy, offline capable.",
    analogy:
      "Ollama is like Spotify offline mode vs streaming — you download the model once, then use it anytime without internet or per-use fees. Trade-off: you need the 'device' (GPU/RAM) to run it.",
    technicalExplanation:
      "Ollama wraps llama.cpp and other inference engines. Models stored locally in ~/.ollama/models. CLI: ollama pull, ollama run, ollama list. REST API on localhost:11434 — compatible with OpenAI SDK via base_url override. Modelfiles customize system prompts, parameters, and templates. Supports: Llama 3, Mistral, Gemma, Phi, Qwen, and more in quantized formats (Q4_K_M default). Hardware: needs sufficient RAM/VRAM — 8B model ~5GB, 70B model ~40GB quantized.",
    architecture:
      "ollama serve (background daemon) → REST API :11434 → Model Runner (llama.cpp) → Local GPU/CPU. Client apps call localhost API same as cloud APIs.",
    diagram: `flowchart TD
    A[ollama pull llama3] --> B[Download Quantized Model]
    B --> C[ollama serve Daemon]
    C --> D[REST API localhost:11434]
    D --> E[Your App / CLI / OpenAI SDK]
    C --> F[llama.cpp Inference Engine]
    F --> G[Local GPU or CPU]`,
    example:
      "Development workflow: ollama pull llama3.2 → ollama run llama3.2 for interactive chat → point your app's OpenAI client to http://localhost:11434/v1 → develop and test agents locally for free before deploying with cloud APIs.",
    code: `# CLI usage
# ollama pull llama3.2
# ollama run llama3.2 "Explain transformers"

# Python with OpenAI SDK pointed at Ollama
from openai import OpenAI

client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

response = client.chat.completions.create(
    model="llama3.2",
    messages=[{"role": "user", "content": "What is RAG?"}],
)
print(response.choices[0].message.content)

# Direct Ollama API
import requests
resp = requests.post("http://localhost:11434/api/chat", json={
    "model": "llama3.2",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": False,
})
print(resp.json()["message"]["content"])`,
    project:
      "Set up Ollama with Llama 3.2 and Mistral. Build a local chat app with conversation history. Benchmark tokens/sec on your hardware. Create a custom Modelfile with a specialized system prompt for code review.",
    interviewQuestions: [
      iq("When should you use Ollama vs cloud APIs?", "Ollama: development, privacy-sensitive data, offline use, cost-free iteration, prototyping. Cloud APIs: production scale, latest models (GPT-4o), no hardware management, guaranteed uptime.", "easy"),
      iq("How does Ollama achieve OpenAI API compatibility?", "Ollama exposes /v1/chat/completions endpoint matching OpenAI's schema. Point OpenAI SDK to localhost:11434/v1 — same code works with local and cloud models by changing base_url.", "medium"),
      iq("What hardware do you need to run local LLMs?", "8B Q4 model: ~5GB RAM, runs on M1 Mac or 16GB PC. 70B Q4: ~40GB, needs high-end GPU or Apple Silicon Ultra. CPU inference works but 10-50× slower than GPU.", "medium"),
    ],
    revisionNotes: {
      fiveMin: [
        "Ollama: run LLMs locally, free, private",
        "ollama pull + ollama run workflow",
        "REST API on localhost:11434",
        "OpenAI SDK compatible via base_url",
      ],
      fifteenMin: [
        "Models in ~/.ollama/models",
        "Quantized by default (Q4_K_M)",
        "Modelfile for custom system prompts",
        "8B model needs ~5GB RAM",
        "Swap cloud/local by changing base_url",
        "llama.cpp engine under the hood",
      ],
      oneHour: [
        "Install Ollama and pull 3 models",
        "Build local chat app with history",
        "Create custom Modelfile",
        "Benchmark tokens/sec on your hardware",
        "Point existing OpenAI code to Ollama",
        "Compare local vs cloud model quality",
      ],
      cheatSheet: [
        "ollama pull llama3.2",
        "ollama run llama3.2",
        "API: localhost:11434",
        "OpenAI SDK: base_url=localhost:11434/v1",
        "8B Q4 ≈ 5GB RAM",
        "Modelfile for customization",
      ],
    },
    glossary: ["Ollama", "Modelfile", "llama.cpp", "Local Inference"],
    commonMistakes: [
      "Trying to run 70B models on 16GB RAM — out of memory",
      "Using local models for production without latency testing",
      "Not quantizing — full FP16 models too large for consumer hardware",
      "Forgetting ollama serve must be running for API access",
    ],
  }),

  "open-source-models": createLesson({
    concept:
      "Open-source LLMs (Llama, Mistral, Qwen, Gemma) are publicly available models you can download, fine-tune, and deploy on your own infrastructure — offering transparency, customization, and cost control.",
    whyItExists:
      "Closed APIs create vendor lock-in, data privacy concerns, and unpredictable pricing. Open-source models let organizations own their AI stack, fine-tune for domain-specific tasks, and deploy without per-token costs.",
    analogy:
      "Closed models are like renting a furnished apartment — convenient but you can't renovate. Open-source is like buying a house — more work upfront, but you own it, customize it, and no monthly rent per token.",
    technicalExplanation:
      "Major families: Meta Llama 3 (8B-70B, strong general), Mistral/Mixtral (efficient, MoE), Qwen (Alibaba, multilingual, strong coding), Gemma (Google, compact), Phi (Microsoft, small but capable). Hosted on HuggingFace Hub. License matters: Llama Community License (commercial OK with limits), Apache 2.0 (fully open). Fine-tuning: LoRA/QLoRA for efficient adaptation. Deployment: Ollama (local), vLLM (production GPU), TGI (HuggingFace). Benchmark against closed models on your specific tasks — open models often match GPT-3.5 level.",
    architecture:
      "HuggingFace Hub → Download weights → Fine-tune (optional, LoRA) → Quantize (GGUF/GPTQ) → Deploy (Ollama/vLLM/TGI) → Your Application.",
    diagram: `flowchart TD
    A[HuggingFace Hub] --> B[Download Model Weights]
    B --> C{Customize?}
    C -->|Yes| D[LoRA Fine-tuning]
    C -->|No| E[Use Base Model]
    D --> F[Quantize INT4]
    E --> F
    F --> G{Deploy Where}
    G -->|Local| H[Ollama]
    G -->|Production| I[vLLM / TGI]
    G -->|Edge| J[llama.cpp]`,
    example:
      "Healthcare startup fine-tunes Llama-3-8B on medical Q&A with QLoRA (4-bit training on single GPU). Deploys on vLLM with HIPAA-compliant infrastructure. Matches GPT-3.5 on medical benchmarks at zero per-token cost.",
    code: `from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model_name = "meta-llama/Llama-3.1-8B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map="auto",
)

messages = [{"role": "user", "content": "Explain open-source LLMs briefly."}]
input_ids = tokenizer.apply_chat_template(messages, return_tensors="pt").to(model.device)

with torch.no_grad():
    output = model.generate(input_ids, max_new_tokens=100, temperature=0.7)
print(tokenizer.decode(output[0], skip_special_tokens=True))`,
    project:
      "Compare Llama-3-8B, Mistral-7B, and Qwen-2.5-7B on your task (summarization, coding, QA). Score each with a simple eval set and document quality/speed/cost tradeoffs.",
    interviewQuestions: [
      iq("What are the tradeoffs of open-source vs closed LLMs?", "Open: free inference, fine-tunable, private, no vendor lock-in. Closed: more capable (frontier), no infra management, latest features. Open models catch up fast — Llama 3 rivals GPT-3.5.", "easy"),
      iq("What is LoRA and why is it used for fine-tuning?", "Low-Rank Adaptation: train small adapter matrices instead of full weights. Reduces trainable params by 99%+, fits on consumer GPUs. QLoRA adds 4-bit quantization during training.", "medium"),
      iq("How do you choose between Llama, Mistral, and Qwen?", "Llama: best ecosystem, most fine-tunes available. Mistral/Mixtral: efficient, good MoE option. Qwen: strong multilingual and coding. Benchmark on YOUR task — general benchmarks don't tell the full story.", "medium"),
    ],
    revisionNotes: {
      fiveMin: [
        "Open-source: download, fine-tune, self-host",
        "Llama, Mistral, Qwen, Gemma families",
        "HuggingFace Hub for model weights",
        "LoRA for efficient fine-tuning",
      ],
      fifteenMin: [
        "Llama 3: Meta, strong general purpose",
        "Mixtral: MoE, efficient at scale",
        "License matters: Apache 2.0 vs Community",
        "QLoRA: fine-tune on single GPU",
        "Deploy: Ollama, vLLM, TGI",
        "Often matches GPT-3.5 level",
      ],
      oneHour: [
        "Download and run 3 open models locally",
        "Fine-tune with LoRA on custom dataset",
        "Compare quality on domain-specific eval",
        "Deploy fine-tuned model with vLLM",
        "Understand license implications",
        "Build model selection decision matrix",
      ],
      cheatSheet: [
        "Llama 3.1: meta-llama/Llama-3.1-8B-Instruct",
        "Mistral: mistralai/Mistral-7B-Instruct",
        "LoRA: train adapters, not full weights",
        "QLoRA: 4-bit training",
        "HuggingFace: model hub + transformers",
        "vLLM for production serving",
      ],
    },
    glossary: ["LoRA", "HuggingFace Hub", "Model License", "QLoRA"],
    commonMistakes: [
      "Ignoring model license restrictions for commercial use",
      "Fine-tuning without eval set — can't measure improvement",
      "Deploying FP16 70B model without quantization — OOM",
      "Choosing model by benchmark alone — test on your data",
    ],
  }),

  "prompt-templates": createLesson({
    concept:
      "Prompt templates are reusable, parameterized structures for LLM inputs — separating prompt engineering from application code and enabling consistent, maintainable AI interactions.",
    whyItExists:
      "Hardcoding prompts as strings scattered across code is unmaintainable. Templates let you version, test, and swap prompts independently — like SQL parameterized queries but for LLM instructions.",
    analogy:
      "A mail merge template: 'Dear {name}, your order {order_id} ships on {date}.' The structure stays fixed; variables change per request. Prompt templates work the same way for LLM inputs.",
    technicalExplanation:
      "Template structure: system message (persona/rules) + user message (task with {variables}). Tools: LangChain PromptTemplate, Jinja2 strings, LangSmith prompt hub. Best practices: separate system from user prompts, use few-shot examples as template sections, version prompts in git, A/B test variants. Chat templates: models expect specific formats (Llama [INST], ChatML, etc.) — use tokenizer.apply_chat_template(). Variables: {context}, {question}, {format_instructions}. Composition: chain templates for multi-step pipelines.",
    architecture:
      "Template Store (git/LangSmith) → Template Engine (Jinja2/LangChain) → Fill Variables → Formatted Prompt → LLM API → Response.",
    diagram: `flowchart LR
    A[Template Definition] --> B[Variable Injection]
    B --> C[Formatted Prompt]
    C --> D[LLM API Call]
    D --> E[Response]
    F[Prompt Version Control] --> A
    G[A/B Test Variants] --> A`,
    example:
      "RAG template: system='Answer based only on context. Cite sources.' user='Context: {context}\\n\\nQuestion: {question}'. Code fills context from vector DB and question from user input. Swap template to change behavior without code changes.",
    code: `from langchain_core.prompts import ChatPromptTemplate

# Define reusable template
rag_template = ChatPromptTemplate.from_messages([
    ("system", "Answer using ONLY the provided context. If unsure, say 'I don't know'."),
    ("human", "Context:\\n{context}\\n\\nQuestion: {question}"),
])

# Fill variables at runtime
prompt = rag_template.invoke({
    "context": "Paris is the capital of France. Population: 2.1M.",
    "question": "What is the population of Paris?",
})

# Use with any LLM
# response = llm.invoke(prompt)

# Jinja2 alternative
from jinja2 import Template
tpl = Template("Summarize in {{ style }} style:\\n\\n{{ text }}")
rendered = tpl.render(style="bullet-point", text="Long article here...")`,
    project:
      "Create a prompt template library for your app: classification, summarization, extraction, and RAG templates. Version in git, add A/B test variants, and measure quality differences with an eval set.",
    interviewQuestions: [
      iq("Why use prompt templates instead of f-strings?", "Templates separate prompt logic from code, enable versioning/A/B testing, support few-shot example injection, and allow non-engineers to iterate on prompts without code changes.", "easy"),
      iq("What is a chat template and why does it matter?", "Each model expects specific formatting (special tokens, role markers). apply_chat_template() converts messages to the model's expected format. Wrong format = degraded performance.", "medium"),
      iq("How do you version and test prompts in production?", "Store in git or LangSmith hub. Tag versions. A/B test variants with eval metrics. Roll back bad prompts. Track which template version produced each response for debugging.", "medium"),
    ],
    revisionNotes: {
      fiveMin: [
        "Templates: reusable prompts with {variables}",
        "Separate system and user message templates",
        "Version prompts in git, not hardcoded",
        "Chat templates match model format",
      ],
      fifteenMin: [
        "LangChain ChatPromptTemplate",
        "Jinja2 for string templating",
        "Few-shot examples as template sections",
        "apply_chat_template() for model format",
        "A/B test prompt variants with evals",
        "Composition: chain templates for pipelines",
      ],
      oneHour: [
        "Build template library for 4 task types",
        "Version prompts in git with tags",
        "A/B test two RAG prompt variants",
        "Use chat templates for Llama and GPT",
        "Add few-shot examples to templates",
        "Integrate with LangSmith for tracking",
      ],
      cheatSheet: [
        "ChatPromptTemplate.from_messages()",
        "{variable} injection at runtime",
        "System + human message pairs",
        "apply_chat_template() for formatting",
        "Version prompts in git",
        "A/B test with eval metrics",
      ],
    },
    glossary: ["PromptTemplate", "Chat Template", "Few-shot Prompting", "Jinja2"],
    commonMistakes: [
      "Hardcoding prompts in business logic — hard to iterate",
      "Not using chat templates — wrong format for model",
      "No versioning — can't roll back bad prompt changes",
      "Overly complex templates — hard to debug filled output",
    ],
  }),

  "output-parsers": createLesson({
    concept:
      "Output parsers convert raw LLM text responses into structured Python objects — handling the gap between free-form generation and typed application code.",
    whyItExists:
      "LLMs generate text, but applications need JSON, Pydantic models, lists, or enums. Parsers extract structured data from LLM output, with retry logic when the model doesn't format correctly.",
    analogy:
      "A translator converting a chef's verbal recipe (free text) into a printed recipe card with labeled sections (structured format). The parser is the translator that extracts ingredients, steps, and timing.",
    technicalExplanation:
      "Parser types: PydanticOutputParser (parse into Pydantic models), JSONOutputParser, StructuredOutputParser (with schema), CommaSeparatedListOutputParser. Flow: parser.get_format_instructions() → inject into prompt → LLM generates → parser.parse(response). Retry: if parsing fails, re-prompt with error message. Modern alternative: native structured outputs (OpenAI response_format, tool calling) are more reliable than parse-from-text. When to use parsers: legacy models, complex nested structures, or when structured output API isn't available.",
    architecture:
      "Prompt + Format Instructions → LLM → Raw Text Response → Output Parser → Typed Python Object. On failure: Retry with error feedback (up to N attempts).",
    diagram: `flowchart TD
    A[Prompt + Format Instructions] --> B[LLM Generation]
    B --> C[Raw Text Response]
    C --> D{Parser}
    D -->|Success| E[Typed Python Object]
    D -->|Failure| F[Retry with Error Message]
    F --> B`,
    example:
      "Extract meeting info: prompt asks for title, date, attendees. LLM returns JSON string. PydanticOutputParser validates into Meeting(title=str, date=datetime, attendees=list[str]). If date format wrong, parser raises error → retry with 'date must be YYYY-MM-DD'.",
    code: `from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field

class MovieReview(BaseModel):
    title: str = Field(description="Movie title")
    rating: int = Field(description="Rating 1-10")
    summary: str = Field(description="One sentence summary")

parser = PydanticOutputParser(pydantic_object=MovieReview)

format_instructions = parser.get_format_instructions()
# Inject into prompt: f"\\n{format_instructions}"

# Simulate LLM response
llm_output = '{"title": "Inception", "rating": 9, "summary": "Mind-bending thriller about dreams."}'
review = parser.parse(llm_output)
print(review.title, review.rating)`,
    project:
      "Build an extraction pipeline: prompt + PydanticOutputParser for structured data from unstructured text (emails, invoices, resumes). Add retry logic with error feedback for robust parsing.",
    interviewQuestions: [
      iq("When should you use output parsers vs structured outputs API?", "Structured outputs API (OpenAI JSON mode) is more reliable — use when available. Output parsers for: older models, complex nested schemas, or frameworks like LangChain that abstract across providers.", "medium"),
      iq("How do you handle LLM output that fails to parse?", "Retry loop: catch parse error, re-prompt with original input + error message + format instructions. Limit retries (2-3). Log failures for prompt improvement. Consider structured outputs API for reliability.", "easy"),
      iq("What is the role of format instructions in parsing?", "Format instructions tell the LLM exactly what structure to output (JSON schema, field descriptions). Prepended/appended to prompt. Better instructions = higher parse success rate.", "medium"),
    ],
    revisionNotes: {
      fiveMin: [
        "Parsers: LLM text → typed Python objects",
        "PydanticOutputParser most common",
        "Inject format instructions into prompt",
        "Retry on parse failure with error feedback",
      ],
      fifteenMin: [
        "get_format_instructions() for prompt",
        "Pydantic models define output schema",
        "JSONOutputParser for simple JSON",
        "Structured outputs API more reliable",
        "Retry loop: 2-3 attempts typical",
        "Log parse failures for prompt tuning",
      ],
      oneHour: [
        "Build extraction pipeline with parser",
        "Add retry logic with error feedback",
        "Compare parser vs structured outputs reliability",
        "Parse nested Pydantic models",
        "Handle partial/malformed JSON gracefully",
        "Measure parse success rate across prompts",
      ],
      cheatSheet: [
        "PydanticOutputParser(pydantic_object=Model)",
        "parser.get_format_instructions()",
        "parser.parse(llm_output)",
        "Retry on ValidationError",
        "Prefer structured outputs API when available",
        "Field(description=) guides LLM",
      ],
    },
    glossary: ["Output Parser", "Format Instructions", "Pydantic", "Retry Logic"],
    commonMistakes: [
      "Not including format instructions in prompt — low parse success",
      "No retry logic — single parse failure breaks pipeline",
      "Using text parsing when structured outputs API available",
      "Overly complex schemas — LLM struggles with deep nesting",
    ],
  }),

  streaming: createLesson({
    concept:
      "Streaming delivers LLM tokens as they're generated rather than waiting for the complete response — dramatically improving perceived latency and enabling real-time user experiences.",
    whyItExists:
      "A 500-token response might take 10 seconds to fully generate. Without streaming, users stare at a blank screen for 10 seconds. Streaming shows the first token in ~300ms, keeping users engaged.",
    analogy:
      "Streaming is like watching a live sports broadcast vs waiting for the full match recording. You see the action as it happens, not after it's over.",
    technicalExplanation:
      "Server-Sent Events (SSE) deliver tokens incrementally. OpenAI: stream=True returns iterator of chunks, each containing a delta (partial token). Client accumulates deltas into full response. Frontend: update UI on each chunk. Async streaming for concurrent requests. LangChain: .stream() and .astream() methods. Considerations: can't parse structured output until complete (stream for display, parse at end), token counting during stream, error handling mid-stream, cancellation via abort signal.",
    architecture:
      "Client Request (stream=true) → API Server → Model generates token → SSE chunk → Client → Append to UI → Repeat until done signal.",
    diagram: `flowchart LR
    A[Client Request stream=true] --> B[LLM Server]
    B --> C[Token 1 via SSE]
    C --> D[Update UI]
    B --> E[Token 2 via SSE]
    E --> D
    B --> F[Token N via SSE]
    F --> D
    D --> G[Complete Response]`,
    example:
      "ChatGPT's typing effect: your prompt hits the API with stream=True. First token appears in ~300ms. Tokens arrive at ~50/sec, each appended to the chat bubble. User reads while generation continues.",
    code: `from openai import OpenAI

client = OpenAI()

# Sync streaming
stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Write a haiku about coding."}],
    stream=True,
)

full_response = ""
for chunk in stream:
    delta = chunk.choices[0].delta.content or ""
    print(delta, end="", flush=True)
    full_response += delta

# Async streaming
import asyncio
from openai import AsyncOpenAI

async def stream_chat():
    client = AsyncOpenAI()
    stream = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Count to 5"}],
        stream=True,
    )
    async for chunk in stream:
        print(chunk.choices[0].delta.content or "", end="")`,
    project:
      "Build a streaming chat UI with FastAPI backend (SSE endpoint) and a simple frontend that renders tokens as they arrive. Add a 'stop generation' button that cancels the stream.",
    interviewQuestions: [
      iq("How does streaming improve user experience?", "First token appears in ~300ms (TTFT) vs waiting 5-10s for full response. Users start reading immediately. Perceived latency drops dramatically even though total time is similar.", "easy"),
      iq("What is SSE and how does it relate to LLM streaming?", "Server-Sent Events: HTTP protocol for server-to-client push. LLM APIs use SSE to send each token as a chunk. Client reads event stream and appends tokens. Simpler than WebSockets for one-way streaming.", "medium"),
      iq("Can you parse structured output from a stream?", "Not incrementally — JSON is invalid until complete. Pattern: stream tokens to UI for display, accumulate full response, parse structured output when stream ends. Or use non-streaming for structured data.", "medium"),
    ],
    revisionNotes: {
      fiveMin: [
        "Streaming: tokens arrive incrementally",
        "stream=True in OpenAI API",
        "SSE delivers chunks to client",
        "Dramatically improves perceived latency",
      ],
      fifteenMin: [
        "TTFT: time to first token ~300ms",
        "delta.content in each chunk",
        "Accumulate deltas for full response",
        "Async streaming for concurrent requests",
        "Can't parse JSON until stream complete",
        "Abort signal for cancel generation",
      ],
      oneHour: [
        "Build SSE streaming endpoint in FastAPI",
        "Create frontend with live token rendering",
        "Implement stop/cancel button",
        "Compare perceived latency stream vs no-stream",
        "Async streaming with multiple concurrent chats",
        "Handle errors mid-stream gracefully",
      ],
      cheatSheet: [
        "stream=True in API call",
        "chunk.choices[0].delta.content",
        "SSE for server-to-client push",
        "Accumulate for full response",
        "astream() for async",
        "Parse structured output after stream ends",
      ],
    },
    glossary: ["Server-Sent Events", "TTFT", "Delta", "Stream Cancellation"],
    commonMistakes: [
      "Not flushing output buffer — tokens appear in batches not individually",
      "Trying to parse JSON mid-stream — wait for completion",
      "Forgetting to handle stream errors/disconnections",
      "Using streaming for batch processing — unnecessary overhead",
    ],
  }),

  "structured-outputs": createLesson({
    concept:
      "Structured outputs constrain LLM responses to a specific JSON schema — guaranteeing valid, parseable data every time without fragile text parsing or retry loops.",
    whyItExists:
      "Applications need reliable typed data (JSON, enums, nested objects). Asking LLMs to 'return JSON' works ~80% of the time. Structured outputs enforce schema compliance at generation time — 99.9%+ reliability.",
    analogy:
      "A multiple-choice exam vs open-ended essay. Structured outputs force the LLM into a multiple-choice format — it can only fill in predefined fields, eliminating format errors.",
    technicalExplanation:
      "OpenAI: response_format={type: 'json_schema', json_schema: {...}} with strict mode. Constrained decoding: model's token generation is restricted to tokens that produce valid JSON matching schema. Pydantic integration: model_to_json_schema() auto-generates schema. Alternatives: function calling (tools parameter returns structured args), Instructor library (wraps OpenAI/Anthropic with Pydantic), outlines library (local models). Use for: data extraction, classification, API response generation, agent state management.",
    architecture:
      "Pydantic Model → JSON Schema → API (response_format) → Constrained Generation → Valid JSON → Pydantic Validation → Typed Object.",
    diagram: `flowchart TD
    A[Pydantic Model Definition] --> B[Generate JSON Schema]
    B --> C[API response_format Parameter]
    C --> D[Constrained Token Generation]
    D --> E[Valid JSON Output]
    E --> F[Pydantic Validation]
    F --> G[Typed Python Object]`,
    example:
      "Extract invoice data: schema defines vendor, amount, date, line_items[]. LLM receives invoice text + schema. Returns guaranteed-valid JSON: {\"vendor\": \"Acme\", \"amount\": 1500.00, \"date\": \"2024-01-15\", \"line_items\": [...]}. No parsing failures.",
    code: `from openai import OpenAI
from pydantic import BaseModel

class Invoice(BaseModel):
    vendor: str
    amount: float
    date: str
    line_items: list[str]

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "Extract invoice data from the text."},
        {"role": "user", "content": "Invoice from Acme Corp, dated Jan 15 2024. Total: $1,500. Items: Widget A, Widget B."},
    ],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "invoice",
            "strict": True,
            "schema": Invoice.model_json_schema(),
        },
    },
)

import json
invoice = Invoice(**json.loads(response.choices[0].message.content))
print(invoice.vendor, invoice.amount)`,
    project:
      "Build a document extraction API: accept PDF text, return structured Pydantic objects (invoice, resume, or contract) using OpenAI structured outputs. Handle 3 document types with different schemas.",
    interviewQuestions: [
      iq("How do structured outputs differ from JSON mode?", "JSON mode guarantees valid JSON but not schema compliance. Structured outputs (strict mode) enforce exact schema — required fields, types, enums. Much higher reliability for production.", "medium"),
      iq("When should you use structured outputs vs function calling?", "Structured outputs: when you want data as the response. Function calling: when the model should decide whether to call a tool. For extraction/classification, structured outputs. For agents, function calling.", "medium"),
      iq("What is constrained decoding?", "During generation, invalid tokens (that would break JSON schema) are masked out. Model can only produce tokens leading to valid schema-compliant output. Implemented via grammar-based logit masking.", "hard"),
    ],
    revisionNotes: {
      fiveMin: [
        "Structured outputs: guaranteed schema-compliant JSON",
        "response_format with json_schema in OpenAI",
        "strict=True enforces exact schema",
        "Replaces fragile parse-and-retry patterns",
      ],
      fifteenMin: [
        "Pydantic model → JSON schema → API",
        "Constrained decoding masks invalid tokens",
        "99.9%+ reliability vs ~80% JSON mode",
        "Function calling alternative for agents",
        "Instructor library simplifies integration",
        "Use for extraction, classification, APIs",
      ],
      oneHour: [
        "Build extraction API with 3 schemas",
        "Compare structured outputs vs parser reliability",
        "Use Instructor library with Pydantic",
        "Handle nested objects and enums",
        "Integrate with agent state management",
        "Measure parse success rate improvement",
      ],
      cheatSheet: [
        "response_format: json_schema",
        "strict: True for enforcement",
        "Pydantic.model_json_schema()",
        "Instructor library for easy integration",
        "Function calling for agent tools",
        "Constrained decoding = grammar masking",
      ],
    },
    glossary: ["Constrained Decoding", "JSON Schema", "Strict Mode", "Instructor"],
    commonMistakes: [
      "Using JSON mode when structured outputs available — lower reliability",
      "Overly complex nested schemas — model struggles even with constraints",
      "Not validating with Pydantic after receiving response",
      "Using structured outputs for free-form creative tasks — constrains quality",
    ],
  }),

  "function-calling": createLesson({
    concept:
      "Function calling (tool use) lets LLMs request execution of external functions — enabling agents to search the web, query databases, run code, and interact with the real world.",
    whyItExists:
      "LLMs alone can only generate text from training data. Function calling bridges LLMs to live data and actions — the foundation of AI agents, copilots, and tool-augmented applications.",
    analogy:
      "An executive who doesn't do everything themselves but knows exactly who to call. 'Get me Q3 sales' → calls the database team. 'Schedule a meeting' → calls the calendar system. The LLM is the executive; functions are the specialists.",
    technicalExplanation:
      "Define tools as JSON schemas: name, description, parameters (JSON Schema). Send tools array with API request. Model decides: respond with text OR request a tool call (name + arguments). Client executes function, returns result as tool message. Model continues with result context. Agent loop: repeat until model gives final text response. Parallel tool calls: model can request multiple tools simultaneously. OpenAI, Anthropic, Gemini all support tool use with slightly different APIs.",
    architecture:
      "User Message → LLM (with tools) → Tool Call Decision → Execute Function → Tool Result → LLM → Final Response. Agent loop wraps this cycle.",
    diagram: `flowchart TD
    A[User Query] --> B[LLM with Tool Definitions]
    B --> C{Tool Needed?}
    C -->|No| D[Text Response]
    C -->|Yes| E[Tool Call: name + args]
    E --> F[Execute Function]
    F --> G[Return Tool Result]
    G --> B`,
    example:
      "Weather agent: user asks 'What's the weather in Paris and London?' → LLM calls get_weather(city='Paris') and get_weather(city='London') in parallel → client executes both API calls → returns results → LLM synthesizes: 'Paris is 18°C sunny, London is 14°C cloudy.'",
    code: `from openai import OpenAI
import json

client = OpenAI()

tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "City name"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
            },
            "required": ["city"],
        },
    },
}]

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Weather in Tokyo?"}],
    tools=tools,
)

# Handle tool call
msg = response.choices[0].message
if msg.tool_calls:
    call = msg.tool_calls[0]
    args = json.loads(call.function.arguments)
    # result = get_weather(**args)  # your implementation
    result = '{"temp": 22, "condition": "sunny"}'`,
    project:
      "Build a research agent with 3 tools: web_search, read_url, summarize. Agent loop: LLM decides which tools to call, executes them, synthesizes findings into a report.",
    interviewQuestions: [
      iq("What is the agent loop in function calling?", "Repeat: send messages + tools → LLM responds (text or tool call) → if tool call, execute and append result → send back to LLM → until LLM gives final text response without tool calls.", "easy"),
      iq("How do you write good tool descriptions?", "Be specific about when to use the tool, what each parameter means, and what the tool returns. The description is the model's only guide for tool selection — vague descriptions cause wrong tool choices.", "medium"),
      iq("What are parallel tool calls?", "Model can request multiple tools in one response (e.g., weather for 3 cities). Client executes all in parallel, returns all results. Reduces latency vs sequential calls.", "medium"),
    ],
    revisionNotes: {
      fiveMin: [
        "Function calling: LLM requests external tool execution",
        "Define tools as JSON schemas",
        "Agent loop: call → execute → return → repeat",
        "Foundation of AI agents",
      ],
      fifteenMin: [
        "Tool schema: name, description, parameters",
        "Model decides: text response or tool call",
        "tool_calls in response message",
        "Append tool result as tool role message",
        "Parallel tool calls for efficiency",
        "Good descriptions critical for tool selection",
      ],
      oneHour: [
        "Build agent with 3+ tools",
        "Implement full agent loop with max iterations",
        "Handle parallel tool calls",
        "Add error handling for failed tool executions",
        "Compare OpenAI vs Anthropic tool use APIs",
        "Build research agent with web search",
      ],
      cheatSheet: [
        "tools=[{type:function, function:{...}}]",
        "msg.tool_calls for call requests",
        "role: tool for results",
        "Agent loop until no tool_calls",
        "Parallel: multiple tool_calls per response",
        "Description quality = tool selection quality",
      ],
    },
    glossary: ["Tool Use", "Agent Loop", "JSON Schema", "Parallel Tool Calls"],
    commonMistakes: [
      "Vague tool descriptions — model picks wrong tools",
      "No max iteration limit on agent loop — infinite loops",
      "Not handling tool execution errors gracefully",
      "Forgetting to append tool results before next LLM call",
    ],
  }),

  "image-models": createLesson({
    concept:
      "Image generation models (DALL-E 3, Stable Diffusion, Midjourney) create images from text descriptions — enabling AI-powered design, illustration, and visual content creation.",
    whyItExists:
      "Visual content creation is expensive and slow. Image models generate custom illustrations, product mockups, marketing assets, and UI concepts in seconds from text prompts — democratizing visual design.",
    analogy:
      "A skilled illustrator who can draw anything you describe in words — 'a cat wearing a spacesuit on Mars, watercolor style' — and delivers in 10 seconds instead of 10 hours.",
    technicalExplanation:
      "Architectures: Diffusion models (Stable Diffusion — iterative denoising from noise to image) and autoregressive (DALL-E — generates image tokens). DALL-E 3 via OpenAI API: prompt → image URL/base64. Stable Diffusion: open-source, runs locally, customizable with LoRA styles. Key parameters: prompt (description), size (1024x1024), quality (standard/hd), style (vivid/natural). Prompt engineering matters: be specific about style, composition, lighting. Negative prompts (SD): what to exclude. ControlNet (SD): guide generation with edge maps, poses.",
    architecture:
      "Text Prompt → Text Encoder (CLIP) → Latent Space → Diffusion/Generation Process → Image Decoder → Output Image.",
    diagram: `flowchart LR
    A[Text Prompt] --> B[Text Encoder CLIP]
    B --> C[Latent Representation]
    C --> D[Diffusion Process]
    D --> E[Denoise Step 1]
    E --> F[... Steps]
    F --> G[Final Image]`,
    example:
      "Marketing team needs a blog header: 'Minimalist illustration of a robot and human shaking hands, blue and white color scheme, flat design'. DALL-E 3 generates 1024x1024 image in ~15 seconds. No designer needed.",
    code: `from openai import OpenAI

client = OpenAI()

response = client.images.generate(
    model="dall-e-3",
    prompt="A minimalist flat illustration of an AI brain connected to code, blue and purple gradient, white background",
    size="1024x1024",
    quality="hd",
    n=1,
)

image_url = response.data[0].url
print(f"Generated image: {image_url}")

# Stable Diffusion via diffusers (local)
# from diffusers import StableDiffusionPipeline
# pipe = StableDiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-2-1")
# image = pipe("a cat in space, watercolor").images[0]`,
    project:
      "Build an image generation API: accept text prompt + style parameter, generate with DALL-E 3, store image, return URL. Add prompt enhancement using GPT-4o to improve user prompts before generation.",
    interviewQuestions: [
      iq("What is the difference between DALL-E and Stable Diffusion?", "DALL-E 3: closed API, high quality, easy to use, per-image pricing. Stable Diffusion: open-source, runs locally, customizable (LoRA, ControlNet), free inference but needs GPU.", "easy"),
      iq("How do diffusion models generate images?", "Start with random noise, iteratively denoise using a trained U-Net guided by text embedding. Each step removes noise, revealing structure. 20-50 steps typical. Text prompt conditions the denoising direction.", "medium"),
      iq("What makes a good image generation prompt?", "Be specific: subject, style, composition, lighting, colors, medium (photo/illustration/3D). 'A red apple on a wooden table, soft natural lighting, photorealistic' beats 'an apple'.", "medium"),
    ],
    revisionNotes: {
      fiveMin: [
        "Image models: text prompt → generated image",
        "DALL-E 3: API, high quality",
        "Stable Diffusion: open-source, local",
        "Diffusion: noise → denoise → image",
      ],
      fifteenMin: [
        "DALL-E 3 via OpenAI images API",
        "Stable Diffusion: diffusers library",
        "Prompt specificity = image quality",
        "LoRA for custom styles (SD)",
        "ControlNet for pose/edge guidance",
        "Sizes: 1024x1024, 1792x1024",
      ],
      oneHour: [
        "Build image generation API with DALL-E",
        "Run Stable Diffusion locally",
        "Experiment with prompt engineering",
        "Add GPT prompt enhancement layer",
        "Try LoRA styles with Stable Diffusion",
        "Compare DALL-E vs SD quality on same prompts",
      ],
      cheatSheet: [
        "client.images.generate()",
        "model: dall-e-3",
        "size: 1024x1024",
        "quality: standard or hd",
        "SD: diffusers pipeline",
        "Specific prompts = better images",
      ],
    },
    glossary: ["Diffusion Model", "DALL-E", "Stable Diffusion", "CLIP"],
    commonMistakes: [
      "Vague prompts — 'a dog' instead of specific description",
      "Not specifying style — unpredictable artistic choices",
      "Ignoring content policy filters — prompts get rejected",
      "Using DALL-E for high-volume generation — cost adds up",
    ],
  }),

  "vision-models": createLesson({
    concept:
      "Vision models enable LLMs to understand images — analyzing photos, diagrams, screenshots, and documents visually, powering applications from receipt scanning to UI testing.",
    whyItExists:
      "Much of the world's information is visual — charts, screenshots, handwritten notes, product photos. Vision-capable LLMs bridge the text-only gap, enabling multimodal understanding and analysis.",
    analogy:
      "Before vision models, LLMs were like a person who could only read descriptions of photos. Vision models give them eyes — they can look at the actual image and describe, analyze, and reason about what they see.",
    technicalExplanation:
      "Approach: GPT-4o/Gemini/Claude accept images directly in messages (native multimodal). Alternative: separate vision encoder (CLIP) → projection layer → LLM (LLaVA architecture). Use cases: image captioning, OCR/document analysis, chart interpretation, UI screenshot analysis, visual QA. Image input: URL, base64, or file upload. Resolution matters: higher res = better detail but more tokens. GPT-4o processes images at multiple scales. Tips: ask specific questions, reference regions, combine with text context.",
    architecture:
      "Image Input → Vision Encoder (or native processing) → Visual Tokens → Combined with Text Tokens → LLM → Text Response about image.",
    diagram: `flowchart LR
    A[Image Input] --> B[Vision Encoder]
    C[Text Prompt] --> D[Text Tokenizer]
    B --> E[Visual Tokens]
    D --> F[Text Tokens]
    E --> G[Combined Sequence]
    F --> G
    G --> H[LLM Processing]
    H --> I[Text Response]`,
    example:
      "Receipt scanning: photograph receipt → send to GPT-4o with 'Extract vendor, date, items, and total as JSON' → model reads the image, returns structured data. No separate OCR pipeline needed.",
    code: `from openai import OpenAI
import base64

client = OpenAI()

def encode_image(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Describe this image and extract any text you see."},
            {"type": "image_url", "image_url": {
                "url": f"data:image/png;base64,{encode_image('screenshot.png')}"
            }},
        ],
    }],
    max_tokens=500,
)
print(response.choices[0].message.content)`,
    project:
      "Build a document analyzer: upload photo of invoice/receipt/form, extract structured data using GPT-4o vision. Compare accuracy with traditional OCR (Tesseract) pipeline.",
    interviewQuestions: [
      iq("How do vision-capable LLMs process images?", "Native multimodal (GPT-4o, Gemini): images processed directly in unified architecture. Alternative (LLaVA): CLIP vision encoder converts image to tokens, projected into LLM embedding space.", "medium"),
      iq("What are common use cases for vision LLMs?", "Document OCR/extraction, chart/diagram analysis, UI screenshot testing, product image description, medical image triage, visual QA, accessibility (image descriptions).", "easy"),
      iq("How does image resolution affect vision model performance?", "Higher resolution captures fine details (small text, chart labels) but costs more tokens. GPT-4o uses multi-scale processing. Balance: high enough for detail, low enough for cost.", "medium"),
    ],
    revisionNotes: {
      fiveMin: [
        "Vision models: LLMs that understand images",
        "Send images in API messages (base64/URL)",
        "GPT-4o, Gemini, Claude support vision",
        "Use for OCR, analysis, visual QA",
      ],
      fifteenMin: [
        "Image in content array with type:image_url",
        "Base64 encoding for local images",
        "Native multimodal vs CLIP+projection",
        "Resolution affects detail and cost",
        "Combine image + text in same message",
        "Structured extraction from documents",
      ],
      oneHour: [
        "Build receipt scanner with GPT-4o vision",
        "Compare vision LLM vs Tesseract OCR",
        "Analyze charts and diagrams",
        "UI screenshot testing agent",
        "Optimize image resolution for cost",
        "Multi-image analysis in single prompt",
      ],
      cheatSheet: [
        "type: image_url in content",
        "base64 encode local images",
        "model: gpt-4o for vision",
        "High res = more tokens = more cost",
        "Ask specific questions about images",
        "LLaVA for open-source vision",
      ],
    },
    glossary: ["Vision Encoder", "Multimodal", "OCR", "CLIP"],
    commonMistakes: [
      "Sending unnecessarily high-resolution images — wasting tokens",
      "Vague questions about images — 'what is this?' vs specific asks",
      "Assuming perfect OCR — always validate extracted data",
      "Not handling image format/size API limits",
    ],
  }),

  "audio-models": createLesson({
    concept:
      "Audio models handle speech-to-text (transcription), text-to-speech (synthesis), and audio understanding — enabling voice interfaces, meeting transcription, and accessible AI applications.",
    whyItExists:
      "Voice is the most natural human interface. Audio models let applications accept spoken input, generate spoken output, and analyze audio content — critical for accessibility, hands-free use, and processing podcasts/meetings/calls.",
    analogy:
      "A universal translator earpiece: hears any language and converts to text (STT), reads any text aloud naturally (TTS), and understands what's being discussed (audio understanding).",
    technicalExplanation:
      "Speech-to-Text: OpenAI Whisper (open-source, multilingual, robust). API: audio file → text transcript with timestamps. Text-to-Speech: OpenAI TTS (natural voices, multiple styles), ElevenLabs (high quality cloning). API: text → audio stream. Audio understanding: GPT-4o audio (process audio directly, understand tone/emotion). Key specs: sample rate (16kHz typical), formats (mp3, wav, webm), language detection (Whisper auto-detects 99 languages). Real-time: streaming STT for live transcription.",
    architecture:
      "STT: Audio File → Whisper Model → Text Transcript. TTS: Text → TTS Model → Audio Stream. Audio Understanding: Audio → GPT-4o Audio → Text Analysis.",
    diagram: `flowchart LR
    A[Audio Input] --> B[Whisper STT]
    B --> C[Text Transcript]
    C --> D[LLM Processing]
    D --> E[Response Text]
    E --> F[TTS Engine]
    F --> G[Audio Output]`,
    example:
      "Meeting transcription pipeline: upload 1-hour meeting recording → Whisper transcribes with speaker timestamps → GPT-4o summarizes key decisions and action items → TTS generates audio summary for team members who missed the meeting.",
    code: `from openai import OpenAI

client = OpenAI()

# Speech-to-Text with Whisper
with open("meeting.mp3", "rb") as audio_file:
    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
        response_format="verbose_json",
        timestamp_granularities=["segment"],
    )
print(transcript.text)

# Text-to-Speech
response = client.audio.speech.create(
    model="tts-1",
    voice="nova",
    input="Hello! This is an AI-generated voice.",
)
response.stream_to_file("output.mp3")`,
    project:
      "Build a voice note app: record audio → Whisper transcription → GPT-4o summarization → TTS audio summary. Deploy as a web app with microphone input and audio playback.",
    interviewQuestions: [
      iq("What makes Whisper robust for transcription?", "Trained on 680K hours of multilingual data. Handles accents, background noise, and technical vocabulary. Open-source with multiple model sizes (tiny to large). Auto-detects language.", "easy"),
      iq("What are the tradeoffs between TTS providers?", "OpenAI TTS: good quality, 6 voices, API pricing. ElevenLabs: best naturalness, voice cloning, higher cost. Open-source (Coqui, Bark): free, self-hosted, lower quality.", "medium"),
      iq("How would you build a real-time voice agent?", "Streaming STT (partial transcripts) → LLM with streaming → streaming TTS. Pipeline latency target: <1s per turn. Challenges: interruption handling, turn detection, latency optimization.", "hard"),
    ],
    revisionNotes: {
      fiveMin: [
        "Whisper: speech-to-text, multilingual",
        "TTS: text-to-speech synthesis",
        "OpenAI audio API for both",
        "Voice interfaces need STT + LLM + TTS",
      ],
      fifteenMin: [
        "Whisper: auto language detection",
        "TTS voices: alloy, echo, fable, nova, onyx",
        "tts-1 (fast) vs tts-1-hd (quality)",
        "Verbose JSON for timestamps",
        "GPT-4o: native audio understanding",
        "16kHz sample rate typical",
      ],
      oneHour: [
        "Build transcription pipeline with Whisper",
        "Create TTS audio from LLM responses",
        "Build voice note summarizer app",
        "Implement streaming STT for live captions",
        "Compare TTS voice quality options",
        "Design voice agent architecture",
      ],
      cheatSheet: [
        "audio.transcriptions.create()",
        "model: whisper-1",
        "audio.speech.create()",
        "voices: nova, alloy, echo, fable",
        "tts-1-hd for quality",
        "verbose_json for timestamps",
      ],
    },
    glossary: ["Whisper", "TTS", "STT", "Voice Agent"],
    commonMistakes: [
      "Sending wrong audio format — check API supported formats",
      "Not handling long audio files — split into chunks",
      "Ignoring transcription errors — always validate output",
      "High TTS latency in voice agents — need streaming pipeline",
    ],
  }),

  multimodal: createLesson({
    concept:
      "Multimodal AI processes and generates across text, images, audio, and video in unified models — enabling rich applications that mirror how humans perceive the world through multiple senses.",
    whyItExists:
      "Real-world tasks involve multiple data types: analyze a chart in a PDF, describe a video, answer questions about a photo. Multimodal models handle all inputs in one model, eliminating brittle multi-model pipelines.",
    analogy:
      "A doctor who can listen to symptoms (audio), read lab results (text), examine X-rays (images), and watch patient movement (video) — all integrated into one diagnosis, not four separate specialists.",
    technicalExplanation:
      "Native multimodal: GPT-4o, Gemini 2.0, Claude (vision) — trained on interleaved modalities from start. Architecture: unified token space where image patches, audio frames, and text tokens flow through same transformer. Use cases: document analysis (text+images), video understanding, visual QA, multimodal RAG (index images+text), accessibility. API pattern: content array with mixed type entries (text, image_url, input_audio). Multimodal RAG: embed images and text in shared vector space, retrieve across modalities.",
    architecture:
      "Mixed Input (text + images + audio) → Unified Tokenization → Shared Transformer → Multimodal Understanding → Text/Audio/Image Output.",
    diagram: `flowchart TD
    A[Text Input] --> D[Unified Tokenizer]
    B[Image Input] --> D
    C[Audio Input] --> D
    D --> E[Shared Transformer]
    E --> F{Output Type}
    F --> G[Text Response]
    F --> H[Image Generation]
    F --> I[Audio Synthesis]`,
    example:
      "Product support agent: customer sends screenshot of error + describes problem in text. GPT-4o analyzes screenshot (reads error message, identifies UI state) combined with text description → provides targeted fix. Single model, no separate OCR + LLM pipeline.",
    code: `from openai import OpenAI
import base64

client = OpenAI()

# Multimodal: text + image + structured request
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Analyze this dashboard screenshot. What trends do you see? Any anomalies?"},
            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{base64.b64encode(open('dashboard.png','rb').read()).decode()}"}},
        ],
    }],
)

# Gemini multimodal: text + video
# import google.generativeai as genai
# model = genai.GenerativeModel("gemini-2.0-flash")
# response = model.generate_content(["Summarize this video:", video_file])`,
    project:
      "Build a multimodal RAG system: index PDFs with embedded images and text. Query with text questions that require understanding both text and visual content. Compare with text-only RAG.",
    interviewQuestions: [
      iq("What does 'natively multimodal' mean?", "Model trained on interleaved text, images, audio, video from the start — not separate models bolted together. Better cross-modal understanding than pipeline approaches (OCR → LLM).", "medium"),
      iq("How do you build multimodal RAG?", "Extract text and images from documents. Embed both in shared vector space (CLIP for images, text embeddings for text). Query retrieves relevant chunks of either modality. LLM synthesizes answer from mixed context.", "hard"),
      iq("What are the cost implications of multimodal inputs?", "Images consume significant tokens (GPT-4o: ~765 tokens for 1024x1024 image). Audio similarly tokenized. Multimodal queries cost more than text-only. Optimize: resize images, extract text when possible.", "medium"),
    ],
    revisionNotes: {
      fiveMin: [
        "Multimodal: text + image + audio + video in one model",
        "GPT-4o, Gemini natively multimodal",
        "Content array with mixed type entries",
        "Real-world tasks need multiple modalities",
      ],
      fifteenMin: [
        "Unified token space for all modalities",
        "Native vs pipeline multimodal approaches",
        "Images cost ~765 tokens in GPT-4o",
        "Multimodal RAG: embed text + images",
        "Video understanding in Gemini",
        "Accessibility: describe images for blind users",
      ],
      oneHour: [
        "Build multimodal chat (text + images)",
        "Create multimodal RAG pipeline",
        "Compare native vs OCR+LLM pipeline",
        "Analyze video content with Gemini",
        "Calculate multimodal token costs",
        "Design product support multimodal agent",
      ],
      cheatSheet: [
        "content: [{type:text}, {type:image_url}]",
        "GPT-4o: text + image + audio",
        "Gemini: + video natively",
        "Images ≈ 765 tokens each",
        "Multimodal RAG: CLIP + text embeddings",
        "Resize images to reduce cost",
      ],
    },
    glossary: ["Native Multimodal", "Unified Token Space", "Multimodal RAG", "Cross-Modal"],
    commonMistakes: [
      "Using separate OCR + LLM when native multimodal suffices",
      "Sending full-resolution images — expensive and unnecessary",
      "Not accounting for multimodal token costs in pricing",
      "Assuming all models handle all modalities equally",
    ],
  }),

  evaluation: createLesson({
    concept:
      "LLM evaluation measures model and application quality systematically — using automated metrics, human judgment, and LLM-as-judge to ensure AI systems work reliably before and after deployment.",
    whyItExists:
      "LLM outputs are non-deterministic and subjective. Without evaluation, you can't know if prompt changes help or hurt, if fine-tuning worked, or if production quality is degrading. Evaluation is the feedback loop for AI engineering.",
    analogy:
      "A restaurant health inspection: you don't just hope the food is good — you measure temperature, check ingredients, and taste-test. LLM evaluation is the inspection for AI applications.",
    technicalExplanation:
      "Evaluation levels: (1) Model benchmarks (MMLU, HumanEval, MT-Bench) — compare models. (2) Application evals — test YOUR pipeline on YOUR data. Methods: exact match, BLEU/ROUGE (text similarity), LLM-as-judge (GPT-4 scores responses), human evaluation (gold standard). Frameworks: LangSmith (tracing + eval), RAGAS (RAG-specific: faithfulness, relevance, context precision), promptfoo (prompt A/B testing). Build eval set: 50-200 examples with expected outputs. Track metrics over time. Regression testing: new prompt/model must not degrade existing scores.",
    architecture:
      "Eval Dataset (input, expected_output) → Run Pipeline → Collect Outputs → Score (automated + LLM-judge + human) → Dashboard → Iterate.",
    diagram: `flowchart TD
    A[Eval Dataset] --> B[Run LLM Pipeline]
    B --> C[Collect Outputs]
    C --> D{Scoring Method}
    D --> E[Exact Match / F1]
    D --> F[LLM-as-Judge]
    D --> G[Human Review]
    E --> H[Metrics Dashboard]
    F --> H
    G --> H
    H --> I{Pass Threshold?}
    I -->|No| J[Iterate Prompt/Model]
    J --> B
    I -->|Yes| K[Deploy]`,
    example:
      "RAG eval: 100 question-answer pairs from company docs. Run RAG pipeline on each. Score with RAGAS: context_precision (retrieved chunks relevant?), faithfulness (answer grounded in context?), answer_relevancy (answers the question?). Track scores across prompt versions.",
    code: `from langsmith import Client
from langsmith.evaluation import evaluate

client = Client()

# Define eval dataset
examples = [
    {"input": "What is our refund policy?", "expected": "30-day money back guarantee"},
    {"input": "How do I reset my password?", "expected": "Go to Settings > Security > Reset Password"},
]

# Custom evaluator
def correctness(run, example):
    prediction = run.outputs.get("answer", "")
    expected = example.outputs.get("expected", "")
    score = 1.0 if expected.lower() in prediction.lower() else 0.0
    return {"key": "correctness", "score": score}

# Run evaluation
# results = evaluate(
#     my_rag_pipeline,
#     data=examples,
#     evaluators=[correctness],
#     experiment_prefix="rag-v2",
# )`,
    project:
      "Build an eval suite for your RAG or chatbot app: 50 test cases, 3 automated metrics (correctness, relevance, latency), LLM-as-judge scoring, and a simple dashboard showing scores across prompt versions.",
    interviewQuestions: [
      iq("What is LLM-as-judge evaluation?", "Use a strong LLM (GPT-4) to score another model's outputs on criteria like correctness, helpfulness, relevance. Correlates well with human judgment at scale. Cheaper and faster than human eval.", "medium"),
      iq("What metrics does RAGAS provide for RAG evaluation?", "Faithfulness: is answer grounded in retrieved context? Answer relevancy: does it address the question? Context precision: are retrieved chunks relevant? Context recall: did retrieval find all needed info?", "medium"),
      iq("How do you build a good eval dataset?", "50-200 examples from real user queries. Include edge cases, adversarial inputs, and common failure modes. Expected outputs verified by domain experts. Update regularly as product evolves.", "easy"),
    ],
    revisionNotes: {
      fiveMin: [
        "Eval: systematic quality measurement for LLM apps",
        "Build eval set: 50-200 real examples",
        "LLM-as-judge: GPT-4 scores outputs",
        "Track metrics across prompt/model changes",
      ],
      fifteenMin: [
        "RAGAS: faithfulness, relevancy, precision",
        "LangSmith: tracing + evaluation platform",
        "promptfoo: prompt A/B testing",
        "Regression testing before deployment",
        "Human eval = gold standard, expensive",
        "Exact match, F1, BLEU for structured tasks",
      ],
      oneHour: [
        "Build 50-example eval dataset",
        "Implement 3 automated evaluators",
        "Set up LLM-as-judge scoring",
        "A/B test two prompt versions with evals",
        "Create eval dashboard with LangSmith",
        "Define pass/fail thresholds for deployment",
      ],
      cheatSheet: [
        "Eval set: 50-200 (input, expected) pairs",
        "RAGAS: faithfulness, relevancy, precision",
        "LLM-as-judge: GPT-4 scores output",
        "LangSmith evaluate() API",
        "Regression test before deploy",
        "Track metrics over time",
      ],
    },
    glossary: ["LLM-as-Judge", "RAGAS", "Faithfulness", "Regression Testing"],
    commonMistakes: [
      "No eval set — flying blind on prompt/model changes",
      "Eval set too small (<20 examples) — unreliable metrics",
      "Only testing happy path — missing edge cases",
      "Not running evals before deploying prompt changes",
    ],
  }),
};
