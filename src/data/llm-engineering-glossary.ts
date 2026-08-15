import type { PhaseGlossaryTerm } from "@/data/agent-foundations-glossary";

export type LlmGlossaryCategory =
  | "Providers & Models"
  | "APIs & Parameters"
  | "Prompting"
  | "Structured Output"
  | "Streaming"
  | "Local & Open Source"
  | "Multimodal"
  | "Cost & Production";

export const llmEngineeringGlossary: PhaseGlossaryTerm[] = [
  {
    term: "Chat Completions",
    category: "APIs & Parameters",
    meaning:
      "The standard LLM API shape: you send a list of messages (system, user, assistant) and get back an assistant message. Used by OpenAI, Groq, and OpenAI-compatible local servers.",
    aliases: ["chat api", "completions", "messages api"],
  },
  {
    term: "System Message",
    category: "Prompting",
    meaning:
      "The highest-priority instruction that sets persona, rules, and output format. Not shown to the end user. Claude uses a dedicated `system` parameter instead of a system role message.",
    aliases: ["system prompt", "developer message"],
  },
  {
    term: "Token",
    category: "APIs & Parameters",
    meaning:
      "The billing and context unit for LLMs — a subword piece of text. Input and output tokens are often priced separately. Count with tiktoken (OpenAI) before you send a request.",
    aliases: ["tokens", "tokenization"],
  },
  {
    term: "Context Window",
    category: "APIs & Parameters",
    meaning:
      "Maximum tokens the model can see at once (prompt + history + output). Exceeding it truncates or errors. Claude ~200K, Gemini 1.5 Pro up to 2M, typical GPT-4o ~128K.",
    aliases: ["context length", "max context"],
  },
  {
    term: "Temperature",
    category: "APIs & Parameters",
    meaning:
      "Sampling randomness. 0 is near-deterministic (facts, JSON, classification). Higher values (~0.7–1.0) increase variety for brainstorming and creative writing.",
    aliases: ["sampling temperature"],
  },
  {
    term: "Top-p",
    category: "APIs & Parameters",
    meaning:
      "Nucleus sampling: the model only samples from the smallest set of tokens whose probabilities sum to p (e.g. 0.9). Often left at default; prefer tuning temperature first.",
    aliases: ["nucleus sampling", "top p"],
  },
  {
    term: "Max Tokens",
    category: "APIs & Parameters",
    meaning:
      "Hard cap on generated output length. Anthropic requires `max_tokens`. Too low cuts answers off; too high can waste budget if the model rambles.",
    aliases: ["max_tokens", "output limit"],
  },
  {
    term: "Rate Limit",
    category: "Cost & Production",
    meaning:
      "Provider cap on requests or tokens per minute (RPM / TPM), usually by billing tier. Hitting it returns HTTP 429 — retry with backoff, queue, or upgrade the tier.",
    aliases: ["429", "RPM", "TPM"],
  },
  {
    term: "GPT-4o",
    category: "Providers & Models",
    meaning:
      "OpenAI flagship multimodal chat model (text, vision, audio). Use for hard reasoning and multimodal; use gpt-4o-mini for high-volume cheap tasks.",
    aliases: ["gpt4o", "4o"],
  },
  {
    term: "GPT-4o-mini",
    category: "Providers & Models",
    meaning:
      "Faster, cheaper OpenAI chat model. Default for classification, extraction, simple generation, and high-QPS features where flagship quality is overkill.",
    aliases: ["4o-mini", "mini"],
  },
  {
    term: "Embeddings",
    category: "APIs & Parameters",
    meaning:
      "Dense vectors that represent meaning. Similar text is close in vector space. Used for search, RAG, clustering. OpenAI: text-embedding-3-small / large.",
    aliases: ["embedding", "vector embedding"],
  },
  {
    term: "Gemini",
    category: "Providers & Models",
    meaning:
      "Google's multimodal LLM family. Flash is fast/cheap; Pro is stronger. Native text, image, audio, and (on some versions) video. Access via AI Studio or Vertex AI.",
    aliases: ["google gemini", "gemini flash", "gemini pro"],
  },
  {
    term: "Vertex AI",
    category: "Providers & Models",
    meaning:
      "Google Cloud's enterprise ML platform — IAM, VPC, monitoring, batch, and fine-tuning around Gemini. Use instead of AI Studio when you need cloud governance.",
    aliases: ["google vertex"],
  },
  {
    term: "Grounding",
    category: "Providers & Models",
    meaning:
      "Connecting model output to live sources (e.g. Google Search) so answers cite current facts instead of training-data guesses. Gemini exposes Search grounding as a tool.",
    aliases: ["search grounding", "grounded generation"],
  },
  {
    term: "Context Caching",
    category: "Cost & Production",
    meaning:
      "Gemini feature: cache a large prompt prefix (docs, system prompt) and reuse it across requests at a discounted token rate. Ideal for RAG with a stable knowledge blob.",
    aliases: ["gemini cache", "cached content"],
  },
  {
    term: "Claude",
    category: "Providers & Models",
    meaning:
      "Anthropic's LLM family: Haiku (fast), Sonnet (best default value), Opus (hardest tasks). Strong at long docs, coding, and precise instruction following. 200K context.",
    aliases: ["anthropic", "claude sonnet", "claude opus", "claude haiku"],
  },
  {
    term: "Prompt Caching",
    category: "Cost & Production",
    meaning:
      "Anthropic: mark a repeated prefix (system prompt, style guide, large doc) with cache_control. Cached tokens are billed at a steep discount on later turns.",
    aliases: ["anthropic cache", "cache_control"],
  },
  {
    term: "Constitutional AI",
    category: "Providers & Models",
    meaning:
      "Anthropic's training approach: the model critiques and revises itself against a written constitution of principles (helpful, honest, harmless) rather than only RLHF labels.",
    aliases: ["CAI"],
  },
  {
    term: "Ollama",
    category: "Local & Open Source",
    meaning:
      "Local LLM runtime: `ollama pull` / `ollama run`, REST API on localhost:11434. OpenAI-SDK compatible via base_url. Privacy, zero token cost, needs RAM/VRAM.",
    aliases: ["ollama serve", "local ollama"],
  },
  {
    term: "Modelfile",
    category: "Local & Open Source",
    meaning:
      "Ollama's recipe file — base model, system prompt, temperature, stop tokens — to create a named custom model (`ollama create`).",
    aliases: ["ollama modelfile"],
  },
  {
    term: "llama.cpp",
    category: "Local & Open Source",
    meaning:
      "C/C++ inference engine behind Ollama and many GGUF runners. Runs quantized LLMs on CPU or GPU without a Python serving stack.",
    aliases: ["llamacpp"],
  },
  {
    term: "Quantization",
    category: "Local & Open Source",
    meaning:
      "Storing weights in fewer bits (e.g. Q4_K_M GGUF) so models fit on consumer hardware. 8B Q4 ≈ 5GB RAM. Slight quality tradeoff vs full precision.",
    aliases: ["GGUF", "Q4", "GPTQ", "bitsandbytes"],
  },
  {
    term: "Open-Source Model",
    category: "Local & Open Source",
    meaning:
      "Weights you can download (Llama, Mistral, Qwen, Gemma, Phi). You host, fine-tune, and pay GPU — not per-token API rent. Always read the license before commercial use.",
    aliases: ["open weights", "llama", "mistral", "qwen"],
  },
  {
    term: "HuggingFace Hub",
    category: "Local & Open Source",
    meaning:
      "The default registry for open model weights, tokenizers, and datasets. Download, version, and share checkpoints; check the model card for license and intended use.",
    aliases: ["HF hub", "huggingface"],
  },
  {
    term: "LoRA",
    category: "Local & Open Source",
    meaning:
      "Low-Rank Adaptation: fine-tune a small adapter instead of all weights. Cheap domain specialization. QLoRA does it on 4-bit quantized bases.",
    aliases: ["QLoRA", "fine-tune adapter"],
  },
  {
    term: "vLLM",
    category: "Local & Open Source",
    meaning:
      "High-throughput GPU server for open models (PagedAttention, continuous batching). Use in production instead of Ollama when you need many concurrent requests.",
    aliases: ["vllm serve"],
  },
  {
    term: "Prompt Template",
    category: "Prompting",
    meaning:
      "Reusable prompt with `{variables}` filled at runtime. Keeps prompt text out of business logic so you can version, A/B test, and swap wording without code changes.",
    aliases: ["ChatPromptTemplate", "jinja prompt"],
  },
  {
    term: "Chat Template",
    category: "Prompting",
    meaning:
      "Model-specific formatting (Llama [INST], ChatML, special tokens). `tokenizer.apply_chat_template()` converts role messages into the string the model was trained on.",
    aliases: ["apply_chat_template", "chatml"],
  },
  {
    term: "Few-shot Prompting",
    category: "Prompting",
    meaning:
      "Putting input→output examples in the prompt so the model copies the pattern. Stronger than instructions alone for format and edge cases.",
    aliases: ["few shot", "in-context examples"],
  },
  {
    term: "Output Parser",
    category: "Structured Output",
    meaning:
      "Turns raw LLM text into a typed object (Pydantic, JSON, list). Inject format instructions into the prompt; retry with the error if parse fails.",
    aliases: ["PydanticOutputParser", "JSON parser"],
  },
  {
    term: "Format Instructions",
    category: "Structured Output",
    meaning:
      "Schema text appended to the prompt telling the model exactly how to shape the reply (JSON fields, types). Better instructions → higher parse success.",
    aliases: ["get_format_instructions"],
  },
  {
    term: "Structured Outputs",
    category: "Structured Output",
    meaning:
      "Provider-enforced JSON schema (OpenAI `response_format` + strict mode). Constrained decoding masks invalid tokens — far more reliable than 'please return JSON'.",
    aliases: ["json_schema", "strict mode", "json mode"],
  },
  {
    term: "JSON Mode",
    category: "Structured Output",
    meaning:
      "Guarantees valid JSON but not a specific schema. Prefer strict structured outputs when you need required fields, enums, and nested objects.",
    aliases: ["response_format json_object"],
  },
  {
    term: "Constrained Decoding",
    category: "Structured Output",
    meaning:
      "At each step, invalid next-tokens (ones that would break the JSON schema) are masked. The model can only emit schema-legal output.",
    aliases: ["grammar decoding", "logit masking"],
  },
  {
    term: "Function Calling",
    category: "Structured Output",
    meaning:
      "You pass JSON tool schemas; the model returns a tool name + arguments instead of (or before) a final answer. Your code runs the function and sends the result back.",
    aliases: ["tool calling", "tools", "tool_calls"],
  },
  {
    term: "Parallel Tool Calls",
    category: "Structured Output",
    meaning:
      "The model requests several tools in one response (e.g. weather in three cities). Execute them concurrently, then return all results in one follow-up.",
    aliases: ["parallel function calling"],
  },
  {
    term: "Streaming",
    category: "Streaming",
    meaning:
      "`stream=True` delivers tokens as they generate via SSE instead of waiting for the full reply. First token often appears in ~300ms — much better perceived latency.",
    aliases: ["stream", "token streaming"],
  },
  {
    term: "SSE",
    category: "Streaming",
    meaning:
      "Server-Sent Events: HTTP server-to-client push used by LLM APIs for streaming. Simpler than WebSockets when you only need one-way token chunks.",
    aliases: ["server-sent events", "text/event-stream"],
  },
  {
    term: "TTFT",
    category: "Streaming",
    meaning:
      "Time to first token — how long until the user sees the start of the answer. The metric streaming is meant to improve (often ~200–400ms vs many seconds for a full wait).",
    aliases: ["time to first token", "first token latency"],
  },
  {
    term: "Delta",
    category: "Streaming",
    meaning:
      "The incremental piece in each stream chunk (`choices[0].delta.content`). Concatenate deltas to rebuild the full message; render each one to the UI.",
    aliases: ["chunk delta", "stream delta"],
  },
  {
    term: "DALL-E",
    category: "Multimodal",
    meaning:
      "OpenAI image generation API. Text prompt → image URL/base64. Easy and high quality; billed per image. Contrast with local Stable Diffusion.",
    aliases: ["dall-e 3", "dalle"],
  },
  {
    term: "Stable Diffusion",
    category: "Multimodal",
    meaning:
      "Open image model: start from noise, denoise toward the prompt (CLIP-guided). Runs locally, supports LoRA styles and ControlNet. Needs a GPU for comfort.",
    aliases: ["SD", "diffusers"],
  },
  {
    term: "Diffusion Model",
    category: "Multimodal",
    meaning:
      "Generative architecture that iteratively removes noise from random pixels until an image appears, steered by a text embedding.",
    aliases: ["denoising diffusion"],
  },
  {
    term: "CLIP",
    category: "Multimodal",
    meaning:
      "Contrastive vision-language model: embeds images and text in one space. Powers prompt-to-image guidance and multimodal search.",
    aliases: ["contrastive language-image pretraining"],
  },
  {
    term: "Vision Model",
    category: "Multimodal",
    meaning:
      "An LLM that accepts images (URL or base64) plus a question — OCR, charts, screenshots, receipts. Native on GPT-4o, Gemini, Claude; LLaVA is the open stack.",
    aliases: ["GPT-4V", "image understanding", "LLaVA"],
  },
  {
    term: "Whisper",
    category: "Multimodal",
    meaning:
      "OpenAI speech-to-text: audio file → transcript, optional timestamps, auto language detect. Robust to accents and noise. Also available as open weights.",
    aliases: ["whisper-1", "STT", "speech to text"],
  },
  {
    term: "TTS",
    category: "Multimodal",
    meaning:
      "Text-to-speech. OpenAI tts-1 / tts-1-hd with named voices (nova, alloy, …). Stream audio for voice agents; ElevenLabs if you need cloning / higher naturalness.",
    aliases: ["text to speech", "speech synthesis"],
  },
  {
    term: "STT",
    category: "Multimodal",
    meaning:
      "Speech-to-text — the input half of a voice agent. Streaming STT gives partial transcripts so the LLM can start before the user finishes speaking.",
    aliases: ["speech to text", "transcription"],
  },
  {
    term: "Multimodal",
    category: "Multimodal",
    meaning:
      "One model that reads mixed inputs (text, images, audio, video) in a shared token space. Native (GPT-4o, Gemini) beats bolted-on pipelines like OCR → LLM.",
    aliases: ["native multimodal", "natively multimodal"],
  },
  {
    term: "Multimodal RAG",
    category: "Multimodal",
    meaning:
      "Index both text chunks and images (CLIP + text embeddings), retrieve across modalities, then let a multimodal LLM answer from mixed context.",
    aliases: ["visual rag"],
  },
  {
    term: "Prompt Caching vs Context Caching",
    category: "Cost & Production",
    meaning:
      "Same idea, different vendors: Anthropic prompt caching vs Gemini context caching. Both discount repeated long prefixes. Use for stable system prompts and large docs.",
    aliases: ["cache prefix"],
  },
  {
    term: "Input vs Output Pricing",
    category: "Cost & Production",
    meaning:
      "Most APIs charge output tokens more than input. Long generations dominate cost; caching, mini models, and shorter max_tokens cut the bill.",
    aliases: ["token pricing", "per-token cost"],
  },
  {
    term: "OpenAI-Compatible API",
    category: "APIs & Parameters",
    meaning:
      "Same `/v1/chat/completions` schema as OpenAI. Point the SDK at another `base_url` (Ollama, vLLM, Groq, Azure) without rewriting call sites.",
    aliases: ["base_url", "openai compatible"],
  },
  {
    term: "Instructor",
    category: "Structured Output",
    meaning:
      "Library that wraps OpenAI/Anthropic with Pydantic models so you get typed objects back, with retries, instead of hand-rolling parsers.",
    aliases: ["instructor library"],
  },
];

export const llmGlossaryCategories: LlmGlossaryCategory[] = [
  "Providers & Models",
  "APIs & Parameters",
  "Prompting",
  "Structured Output",
  "Streaming",
  "Local & Open Source",
  "Multimodal",
  "Cost & Production",
];

export const llmGlossaryPopularTerms = [
  "Token",
  "Streaming",
  "Temperature",
  "Ollama",
  "Structured Outputs",
  "Function Calling",
  "Whisper",
  "Prompt Caching",
];

export function getLlmEngineeringGlossaryByCategory(): Record<string, PhaseGlossaryTerm[]> {
  const grouped: Record<string, PhaseGlossaryTerm[]> = {};
  for (const cat of llmGlossaryCategories) {
    grouped[cat] = [];
  }
  for (const term of llmEngineeringGlossary) {
    grouped[term.category] ??= [];
    grouped[term.category].push(term);
  }
  for (const cat of llmGlossaryCategories) {
    grouped[cat].sort((a, b) => a.term.localeCompare(b.term));
  }
  return grouped;
}
