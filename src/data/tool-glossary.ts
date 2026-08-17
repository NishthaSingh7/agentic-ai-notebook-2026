import type { PhaseGlossaryTerm } from "@/data/agent-foundations-glossary";

export type ToolGlossaryCategory = "Core" | "Control" | "Safety" | "Tool types";

export const toolGlossaryCategories: ToolGlossaryCategory[] = [
  "Core",
  "Control",
  "Safety",
  "Tool types",
];

export const toolGlossary: PhaseGlossaryTerm[] = [
  {
    term: "Tool Call",
    category: "Core",
    meaning:
      "The model names a tool and fills JSON arguments. Your runtime executes it and returns the result.",
    aliases: ["function calling", "tool_calls"],
  },
  {
    term: "JSON Schema",
    category: "Core",
    meaning: "The contract for tool args or structured answers: types, required keys, enums.",
    aliases: ["parameters", "structured outputs"],
  },
  {
    term: "JSON Mode",
    category: "Core",
    meaning: "Forces JSON text. Not a schema. Still validate keys and types.",
  },
  {
    term: "Registry",
    category: "Control",
    meaning: "Catalog of tools the agent may see: name, description, schema, handler, permissions.",
    aliases: ["tool catalog", "namespace"],
  },
  {
    term: "Tool Selection",
    category: "Control",
    meaning: "Choosing which tool to call. Fewer, clearer tools beat a dump of 80 vague ones.",
    aliases: ["router", "candidate set"],
  },
  {
    term: "Dynamic Loading",
    category: "Control",
    meaning: "Attach tools mid-run by intent. The model cannot call a tool it has not been shown.",
    aliases: ["lazy load"],
  },
  {
    term: "Permissions",
    category: "Safety",
    meaning: "Runtime ACL: read vs write vs irreversible. HITL for refunds and deletes.",
    aliases: ["scope", "HITL", "least privilege"],
  },
  {
    term: "Validation",
    category: "Safety",
    meaning: "Schema then business rules before the handler. Never interpolate model JSON into SQL or a shell.",
    aliases: ["policy check", "injection"],
  },
  {
    term: "Retry",
    category: "Safety",
    meaning: "Retry idempotent reads. Cap N. Fallback or HITL. Do not retry payments blindly.",
    aliases: ["backoff", "idempotency", "fallback"],
  },
  {
    term: "External API",
    category: "Tool types",
    meaning: "HTTP wrapper with a fixed host and your auth. No open URL from the model.",
    aliases: ["wrapper", "SSRF"],
  },
  {
    term: "Browser Tool",
    category: "Tool types",
    meaning: "Click and read pages when there is no API. Allowlist hosts. Extract fields, do not dump the DOM.",
    aliases: ["Playwright", "sandbox"],
  },
  {
    term: "Python Tool",
    category: "Tool types",
    meaning: "Sandboxed exec for math and transforms. No network, no secrets, resource caps.",
    aliases: ["exec", "sandbox"],
  },
  {
    term: "SQL Tool",
    category: "Tool types",
    meaning: "Parameterized, read-only queries with a row cap. Never concatenate model text into SQL.",
    aliases: ["parameterized query", "read-only"],
  },
  {
    term: "Filesystem Tool",
    category: "Tool types",
    meaning: "Read/write inside a workspace root. Block path escape, secrets, and unattended deletes.",
    aliases: ["workspace root", "path traversal"],
  },
];

export const toolGlossaryPopularTerms = [
  "Tool Call",
  "JSON Schema",
  "Registry",
  "Permissions",
  "Validation",
  "SQL Tool",
];

export function getToolGlossaryByCategory() {
  const grouped: Record<string, PhaseGlossaryTerm[]> = {};
  for (const category of toolGlossaryCategories) grouped[category] = [];
  for (const term of toolGlossary) {
    grouped[term.category] ??= [];
    grouped[term.category].push(term);
  }
  return grouped;
}
