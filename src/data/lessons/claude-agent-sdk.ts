import { createLesson } from "./builder";

function L(
  concept: string,
  why: string,
  analogy: string,
  extra: { code?: string; glossary?: string[]; learnElsewhere?: string[]; cheat?: string[] } = {}
) {
  return createLesson({
    concept,
    whyItExists: why,
    analogy,
    technicalExplanation: why,
    example: analogy,
    code: extra.code,
    codeLanguage: extra.code ? "typescript" : undefined,
    glossary: extra.glossary,
    learnElsewhere: extra.learnElsewhere,
    revisionNotes: { cheatSheet: extra.cheat ?? [concept.slice(0, 80)] },
    commandsToRemember: extra.cheat,
  });
}

export const claudeAgentSdkLessons = {
  "claude-agent-sdk": L(
    "The Claude Agent SDK is Anthropic's production runtime for the same agent loop used by Claude Code: tools, permissions, hooks, MCP, subagents, sessions, and context management.",
    "Teams were reverse-engineering Claude Code. The SDK exposes that loop as a product you can ship.",
    "Claude Code is the reference app. The SDK is the engine you drop into your own product.",
    {
      code: `import { query } from "@anthropic-ai/claude-agent-sdk";
for await (const msg of query({ prompt: "Summarize src/auth.ts", options: { allowedTools: ["Read"] } })) {
  console.log(msg);
}`,
      glossary: ["Claude Agent SDK", "Agent loop"],
      cheat: ["Same loop as Claude Code", "Permissions first", "MCP plugs in"],
      learnElsewhere: ["Context Engineering — Phase 6", "Coding Agents — Phase 26"],
    }
  ),
  "claude-agent-loop": L(
    "Observe, infer, maybe tool, observe. The SDK owns retries, context compaction, and stop conditions so you do not write the while-loop.",
    "Raw Messages APIs still need a loop. The SDK is that loop with batteries.",
    "An autopilot that still lets you set the flight plan.",
    { glossary: ["Turn", "Stop condition"], cheat: ["SDK owns the loop", "You own permissions"] }
  ),
  "claude-builtin-tools": L(
    "Built-in tools cover files, shell, and web-shaped work. You add custom tools for your domain. Allow-list them.",
    "Coding agents need a small, boring tool set more than eighty vague plugins.",
    "A kitchen: knife, board, stove. You add a thermometer. You do not add a chainsaw by default.",
    { code: `options: { allowedTools: ["Read", "Grep"], disallowedTools: ["Bash"] }`, glossary: ["allowedTools"] }
  ),
  "claude-permissions": L(
    "Every tool call is gated. Read vs write vs irreversible. HITL for the last class.",
    "A coding agent without permissions is a remote shell as the model.",
    "OS permissions: the model is never root by default.",
    { glossary: ["Permission", "HITL"], learnElsewhere: ["Least Privilege — Phase 20"] }
  ),
  "claude-hooks": L(
    "Hooks run before and after tool calls: log, block, rewrite args, or inject extra context. Policy in code, fail closed.",
    "Policy that lives only in the prompt is ignored under pressure.",
    "Git hooks, but for the agent.",
    { glossary: ["preToolUse", "Fail closed"] }
  ),
  "claude-mcp": L(
    "Claude agents can attach MCP servers as tool sources. Treat third-party servers as untrusted until reviewed.",
    "MCP is how you plug GitHub without a custom tool — and how supply-chain attacks arrive.",
    "USB devices: useful, and you do not plug in a stick from the parking lot.",
    { glossary: ["MCP server", "Allowlist"], learnElsewhere: ["Third-Party MCP — Phase 8"] }
  ),
  "claude-subagents": L(
    "Subagents are specialist loops with their own tools and context. The parent delegates a scoped job.",
    "One giant agent with every tool pollutes context and over-permissions.",
    "A tech lead assigning a well-scoped ticket, not handing over root.",
    { glossary: ["Subagent"] }
  ),
  "claude-context": L(
    "The SDK exposes context management: compaction, pinned rules, trimmed tool results. You still design the budget.",
    "Claude Code survived long sessions because context was engineered, not concatenated.",
    "The SDK is the dishwasher. You still decide what plates go in.",
    { glossary: ["Compaction", "Pin"], learnElsewhere: ["Context Engineering — Phase 6"] }
  ),
  "claude-sessions": L(
    "Sessions persist the thread so you can resume a job. Treat session ids like thread_id in LangGraph.",
    "Coding tasks span hours and process restarts.",
    "A save game.",
    { glossary: ["Session"] }
  ),
  "claude-code-execution": L(
    "Code execution must be sandboxed: no network unless allowlisted, no secrets, CPU and time caps, workspace root.",
    "Unexpected code execution is an OWASP 2026 agentic top risk.",
    "A lab behind glass.",
    { glossary: ["Sandbox", "Workspace root"], learnElsewhere: ["Sandbox Security — Phase 20"] }
  ),
  "build-claude-agent": L(
    "Ship a small Claude coding agent: Read plus test runner, permission policy, one hook, one MCP, a session you can resume. HITL for git push.",
    "The SDK click-tour is not a product. This module is the checklist.",
    "A first PR bot, not a replacement for your entire eng org.",
    { glossary: ["Golden failing test"], learnElsewhere: ["Coding Agents — Phase 26"] }
  ),
};
