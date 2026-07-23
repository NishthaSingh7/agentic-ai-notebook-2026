const FOCUS_LINE = ">>> ";

/** Module-specific patterns — lines matching these get highlighted in code. */
const FOCUS_PATTERNS: Record<string, RegExp[]> = {
  "what-is-ai": [/\.create\(/, /messages=/, /chat\.completions/],
  "ml-vs-dl-vs-genai": [/LogisticRegression/, /\.embed/, /chat\.completions/],
  llms: [/chat\.completions/, /messages=/, /model=/],
  transformers: [/AutoModel/, /attention/i, /transformer/i],
  tokens: [/\.encode\(/, /token/i, /tiktoken/i, /detoken/i],
  tokenization: [/tokenizer/i, /\.encode\(/, /\.decode\(/, /AutoTokenizer/i],
  embeddings: [/\.embed/, /embedding/i, /cosine_similarity/i],
  "similarity-search": [/similarity/i, /nearest/i, /top_k/i, /search/i, /query/i],
  "prompt-engineering": [/messages=/, /system.*content/i, /role.*user/i, /content:/],
  temperature: [/temperature/i],
  "top-p": [/top_p/i, /nucleus/i],
  "context-window": [/max_tokens/i, /context/i, /trim_history/i, /truncate/i],
  hallucination: [/temperature=0/, /ground/i, /citation/i, /verify/i],
  "model-providers": [/OpenAI\(|Anthropic\(|genai\./],
  "open-vs-closed-models": [/ollama/i, /openai/i, /huggingface/i],
  attention: [/attention/i, /softmax/i, /query/i, /key/i, /value/i],
  "self-attention": [/attention/i, /softmax/i, /matmul/i],
  "multi-head-attention": [/num_heads/i, /MultiHeadAttention/i, /attention/i],
  "kv-cache": [/cache/i, /past_key_values/i, /use_cache/i],
  "openai-apis": [/OpenAI\(/, /\.create\(/, /chat\.completions/],
  gemini: [/genai\./, /generate_content/],
  claude: [/Anthropic\(/, /messages\.create/],
  ollama: [/ollama/i, /localhost:11434/],
  streaming: [/stream=True/, /for chunk in/, /delta/],
  chunking: [/chunk/i, /split/i, /RecursiveCharacter/],
  rag: [/retriev/i, /embed/i, /similarity/i, /context/i, /vectorstore/i],
  chromadb: [/chromadb/i, /collection\./, /add\(/, /query\(/],
  "function-calling": [/tools=/, /tool_calls/i, /function/i],
  "tool-calling": [/tools=/, /tool_calls/i],
  react: [/thought/i, /action/i, /observation/i, /Thought:/i],
  langgraph: [/StateGraph/i, /add_node/i, /add_edge/i, /compile\(/i],
  mcp: [/mcp/i, /server/i, /client/i, /list_tools/],
  "plan-execute": [/plan/i, /execute/i, /steps/i],
  reflexion: [/reflect/i, /critique/i, /improve/i],
  "tree-of-thoughts": [/branch/i, /thought/i, /evaluate/i],
  "short-term-memory": [/buffer/i, /history/i, /messages/i],
  "long-term-memory": [/store/i, /retrieve/i, /memory/i, /vector/i],
  planning: [/plan/i, /steps/i, /decompose/i],
  reflection: [/reflect/i, /critique/i, /revise/i],
};

/** Module-specific comment overrides for focus lines. */
const FOCUS_COMMENTS: Record<string, [RegExp, string][]> = {
  tokens: [
    [/\.encode\(/, "text → token IDs — this is where tokenization happens"],
    [/tiktoken/, "load the tokenizer for your model"],
    [/\.decode\(/, "token IDs → text (reverse of encode)"],
    [/len\(.*encode/, "count tokens before sending to API"],
  ],
  embeddings: [
    [/embeddings\.create/, "call embedding model — text becomes a vector"],
    [/cosine_similarity/, "measure how similar two vectors are (0 to 1)"],
    [/\.embedding/, "the numeric vector representing meaning"],
  ],
  rag: [
    [/similarity_search/, "retrieve top-K relevant chunks from vector DB"],
    [/split_documents/, "break documents into searchable chunks"],
    [/add_documents/, "index chunks with embeddings into vector store"],
  ],
  "function-calling": [
    [/tools=/, "pass tool schemas so the LLM can call functions"],
    [/tool_calls/, "LLM chose a tool — read name and arguments here"],
    [/function\.arguments/, "parse JSON arguments the model generated"],
  ],
  react: [
    [/Thought:/i, "agent reasons about what to do next"],
    [/Action:/i, "agent picks a tool to call"],
    [/Observation:/i, "result from the tool feeds back into reasoning"],
  ],
  langgraph: [
    [/StateGraph/, "define workflow with shared state object"],
    [/add_node/, "register a processing step"],
    [/add_edge/, "connect steps in the workflow"],
    [/compile\(/, "build the runnable graph"],
  ],
  streaming: [
    [/stream=True/, "enable token-by-token streaming"],
    [/for chunk in/, "iterate over streamed response chunks"],
    [/delta\.content/, "each chunk contains partial text"],
  ],
  temperature: [
    [/temperature/, "0 = deterministic, higher = more creative/random"],
  ],
  "top-p": [
    [/top_p/, "nucleus sampling — only sample from top probability mass"],
  ],
};

function getFocusPatterns(moduleSlug: string): RegExp[] {
  if (FOCUS_PATTERNS[moduleSlug]) return FOCUS_PATTERNS[moduleSlug];
  const words = moduleSlug.split("-").filter((w) => w.length > 3);
  return words.map((w) => new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
}

function lineHasComment(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.startsWith("#")) return true;
  const hash = line.indexOf(" # ");
  return hash > 0;
}

function getFocusComment(line: string, moduleSlug: string, moduleTitle: string): string | null {
  const overrides = FOCUS_COMMENTS[moduleSlug];
  if (overrides) {
    for (const [pattern, comment] of overrides) {
      if (pattern.test(line)) return comment;
    }
  }
  return null;
}

function inferComment(line: string, moduleSlug: string, moduleTitle: string, isFocus: boolean): string {
  const focusComment = isFocus ? getFocusComment(line, moduleSlug, moduleTitle) : null;
  if (focusComment) return focusComment;

  const t = line.replace(FOCUS_LINE, "").trim();
  if (/^#/.test(t) && t.length > 3) return ""; // already a full-line comment
  if (/^import |^from /.test(t)) return "import dependencies";
  if (/^def /.test(t)) return "define a reusable function";
  if (/^class /.test(t)) return "define a data structure or component";
  if (/= OpenAI\(|= Anthropic\(/.test(t)) return "create API client";
  if (/\.create\(/.test(t)) return isFocus ? `core API call for ${moduleTitle}` : "call the API";
  if (/return /.test(t)) return "return the result";
  if (/print\(/.test(t)) return "show output for debugging";
  if (isFocus) return `key line for ${moduleTitle}`;
  return "";
}

function markFocusLine(line: string): string {
  const match = line.match(/^(\s*)(.*)$/);
  if (!match) return line;
  const [, indent, rest] = match;
  if (rest.startsWith(FOCUS_LINE)) return line;
  return `${indent}${FOCUS_LINE}${rest}`;
}

/**
 * Adds focus markers (>>>) and inline comments to lesson code for curriculum phases.
 * If the source already has >>> markers, only those lines are highlighted.
 */
export function enhanceLessonCode(
  code: string,
  moduleSlug: string,
  moduleTitle: string
): string {
  const patterns = getFocusPatterns(moduleSlug);
  const lines = code.split("\n");
  const hasExplicitFocus = lines.some((l) => l.trim().startsWith(FOCUS_LINE));

  return lines
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return line;

      const alreadyFocused = trimmed.startsWith(FOCUS_LINE);
      if (alreadyFocused) {
        if (!lineHasComment(line)) {
          const comment = inferComment(line, moduleSlug, moduleTitle, true);
          if (comment) return `${line}  # ${comment}`;
        }
        return line;
      }

      // Don't auto-highlight imports, prints, or full-line comments
      const skipAutoFocus =
        hasExplicitFocus ||
        trimmed.startsWith("#") ||
        /^import |^from /.test(trimmed) ||
        /^print\(/.test(trimmed);

      const isFocus = !skipAutoFocus && patterns.some((p) => p.test(line));
      let result = line;

      if (isFocus) {
        result = markFocusLine(result);
      }

      if (!lineHasComment(result)) {
        const comment = inferComment(result, moduleSlug, moduleTitle, isFocus);
        if (comment) {
          result = `${result}  # ${comment}`;
        }
      }

      return result;
    })
    .join("\n");
}

export function stripFocusMarker(line: string): { content: string; focused: boolean } {
  const match = line.match(/^(\s*)>>>\s?(.*)$/);
  if (match) {
    return { content: `${match[1]}${match[2]}`, focused: true };
  }
  return { content: line, focused: false };
}

export function generateFallbackCode(moduleTitle: string, moduleSlug: string): string {
  const topic = moduleTitle.toLowerCase();
  return `# ${moduleTitle} — minimal example
from openai import OpenAI

client = OpenAI()  # create API client

# Ask the model to explain this topic
>>> response = client.chat.completions.create(  # core API call for ${moduleTitle}
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You explain ${topic} clearly."},
        {"role": "user", "content": f"What is ${topic}?"},
    ],
    temperature=0,
)
print(response.choices[0].message.content)  # show output for debugging`;
}
