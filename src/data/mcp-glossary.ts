import type { PhaseGlossaryTerm } from "@/data/agent-foundations-glossary";

export type McpGlossaryCategory =
  | "Core"
  | "Architecture"
  | "Capabilities"
  | "Transport & Auth"
  | "Build";

export const mcpGlossary: PhaseGlossaryTerm[] = [
  {
    term: "MCP",
    category: "Core",
    meaning:
      "Model Context Protocol — an open standard so AI apps can discover tools, read data, and run actions the same way. USB-C for AI tools.",
    aliases: ["model context protocol"],
  },
  {
    term: "Host",
    category: "Architecture",
    meaning:
      "The AI application the human uses — Cursor, Claude Desktop, or your custom agent UI. It owns the session and starts clients.",
    aliases: ["mcp host"],
  },
  {
    term: "Client",
    category: "Architecture",
    meaning:
      "The connector inside the host. One client talks to one server: initialize, list tools, call tools, read resources.",
    aliases: ["MCP client", "ClientSession"],
  },
  {
    term: "Server",
    category: "Architecture",
    meaning:
      "A program that wraps files, APIs, or a database and exposes them as MCP tools, resources, and prompts.",
    aliases: ["MCP server"],
  },
  {
    term: "JSON-RPC",
    category: "Architecture",
    meaning:
      "The message format MCP uses on every transport. Same requests (initialize, tools/call) whether you use stdio or HTTP.",
  },
  {
    term: "initialize",
    category: "Architecture",
    meaning:
      "The first handshake. Nothing else works until the client and server agree they speak MCP.",
    aliases: ["handshake", "capability negotiation"],
  },
  {
    term: "Tools",
    category: "Capabilities",
    meaning:
      "Actions the server can run — verbs. Each has a name, a description for the LLM, and a JSON Schema for arguments.",
    aliases: ["call_tool", "MCP tools"],
  },
  {
    term: "Resources",
    category: "Capabilities",
    meaning:
      "Readable data identified by a URI — nouns. Schemas, configs, docs. Use read_resource; do not use them for writes.",
    aliases: ["list_resources", "read_resource", "URI"],
  },
  {
    term: "Prompts",
    category: "Capabilities",
    meaning:
      "Reusable recipe templates stored on the server. get_prompt fills arguments and returns messages for the chat.",
    aliases: ["get_prompt", "list_prompts", "PromptMessage"],
  },
  {
    term: "inputSchema",
    category: "Capabilities",
    meaning:
      "JSON Schema that describes a tool's arguments. The LLM fills it; the server should still validate before calling an API.",
    aliases: ["JSON Schema"],
  },
  {
    term: "stdio",
    category: "Transport & Auth",
    meaning:
      "Local transport: the client starts a child process and talks JSON-RPC on stdin/stdout. Logs belong on stderr.",
    aliases: ["standard input output", "child process"],
  },
  {
    term: "Streamable HTTP",
    category: "Transport & Auth",
    meaning:
      "Remote transport: one HTTPS URL. Use this for team-shared servers. Needs auth, TLS, and timeouts.",
    aliases: ["HTTP", "remote MCP"],
  },
  {
    term: "SSE",
    category: "Transport & Auth",
    meaning:
      "Older remote transport using server-sent events. Prefer Streamable HTTP for new servers.",
    aliases: ["server-sent events"],
  },
  {
    term: "mcp.json",
    category: "Transport & Auth",
    meaning:
      "Client config that lists servers: a command + args for local stdio, or a URL + headers for remote HTTP.",
    aliases: ["mcp config"],
  },
  {
    term: "OAuth 2.1",
    category: "Transport & Auth",
    meaning:
      "Login flow for remote MCP. The human grants scopes; the client sends a token on each request.",
    aliases: ["OAuth", "scopes"],
  },
  {
    term: "MCP Inspector",
    category: "Build",
    meaning:
      "Official tester. Prove initialize, list_tools, and call_tool here before you add the server to Cursor.",
    aliases: ["inspector"],
  },
  {
    term: "Namespacing",
    category: "Build",
    meaning:
      "Prefix tool names with the server id (github/search_code) so two servers can both expose search without colliding.",
    aliases: ["tool prefix", "tool routing"],
  },
];

export const mcpGlossaryCategories: McpGlossaryCategory[] = [
  "Core",
  "Architecture",
  "Capabilities",
  "Transport & Auth",
  "Build",
];

export const mcpGlossaryPopularTerms = [
  "MCP",
  "Host",
  "stdio",
  "Tools",
  "Resources",
  "OAuth 2.1",
  "mcp.json",
  "MCP Inspector",
];

export function getMcpGlossaryByCategory(): Record<string, PhaseGlossaryTerm[]> {
  const grouped: Record<string, PhaseGlossaryTerm[]> = {};
  for (const cat of mcpGlossaryCategories) grouped[cat] = [];
  for (const term of mcpGlossary) {
    grouped[term.category] ??= [];
    grouped[term.category].push(term);
  }
  for (const cat of mcpGlossaryCategories) {
    grouped[cat].sort((a, b) => a.term.localeCompare(b.term));
  }
  return grouped;
}
