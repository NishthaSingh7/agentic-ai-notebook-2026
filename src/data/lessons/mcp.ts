import { createLesson, type LessonInput } from "./builder";
import { pastelChart } from "@/lib/mermaid-pastel";

/** Short highlight-friendly takeaways (each line must stay 30+ chars). */
function b(...lines: string[]) {
  return lines.map((l) => `- ${l}`).join("\n");
}

function mcpLesson(input: LessonInput) {
  return createLesson({
    ...input,
    visualFirst: true,
    practiceTask: "",
    code: undefined,
    codeLanguage: undefined,
  });
}

export const mcpLessons: Record<string, ReturnType<typeof createLesson>> = {
  "why-mcp": mcpLesson({
    concept: b(
      "MCP is a shared USB-C port for AI tools — one protocol, many apps",
      "Before MCP, every agent rewrote Slack, GitHub, and database wiring",
      "Build one MCP server and Cursor, Claude, and your agent can all use it",
      "MCP is not a model — it is the plug between the model and the world"
    ),
    whyItExists:
      "Custom tool glue does not scale. MCP gives every AI app the same way to discover tools, read data, and run actions.",
    analogy:
      "Before USB-C you carried a bag of chargers. MCP is one cable that fits the laptop, the phone, and the agent.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Old["Old way"] --> Chaos["Rewrite per app"]
    New["MCP plug"] --> Share["One server<br/>many clients"]`,
      `class Old,Chaos grp1
    class New,Share grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    MCP([Why MCP?])

    subgraph Pain["Without MCP"]
        P1["Custom GitHub tool"]
        P2["Rewrite for each app"]
        P3["Private formats"]
    end

    subgraph Gain["With MCP"]
        G1["One GitHub server"]
        G2["Cursor connects"]
        G3["Any agent connects"]
    end

    subgraph Remember["Remember"]
        R1["Protocol, not a model"]
        R2["Server exposes tools"]
        R3["Client discovers them"]
    end

    MCP --> Pain
    MCP --> Gain
    MCP --> Remember`,
      `class MCP hub
    class P1,P2,P3 grp1
    class G1,G2,G3 grp2
    class R1,R2,R3 grp3
    style Pain fill:#fee2e2,stroke:#fca5a5,color:#991b1b
    style Gain fill:#ecfdf5,stroke:#6ee7b7,color:#065f46
    style Remember fill:#eff6ff,stroke:#93c5fd,color:#1e40af`
    ),
    workflowDiagrams: [
      {
        title: "The one-sentence flow",
        caption: "Host app → MCP client → MCP server → real system (files, GitHub, database).",
        chart: pastelChart(
          `flowchart LR
    Host["AI app"] --> Client["MCP client"]
    Client --> Server["MCP server"]
    Server --> World["GitHub / files / DB"]`,
          `class Host,Client grp1
    class Server grp2
    class World grp3`
        ),
      },
    ],
    technicalExplanation:
      "MCP is an open client-server protocol. The host is the AI app. The client is the connector inside that app. The server wraps a real system and speaks MCP.",
    example:
      "You deploy one GitHub MCP server. Cursor uses it to search code. Your weekend agent uses the same server to open issues. You did not write two GitHub integrations.",
    practiceTask:
      "Write three lines: one custom integration you would hate rewriting, one MCP server that would replace it, and which two apps could share it.",
    commandsToRemember: [
      "MCP = Model Context Protocol — USB-C for AI tools",
      "Host = the AI app (Cursor, Claude Desktop, your agent)",
      "Client = connector inside the host",
      "Server = wrapper around files, APIs, or a database",
    ],
    revisionNotes: {
      cheatSheet: [
        "MCP = one protocol for tools and data",
        "Build the server once, reuse in many apps",
        "Host / client / server are three different jobs",
        "MCP is not the LLM itself",
      ],
    },
    glossary: ["MCP", "Host", "Client", "Server", "Interoperability"],
    commonMistakes: [
      "Thinking MCP is a new language model",
      "Writing a new GitHub tool per agent instead of one server",
      "Skipping the host vs client vs server distinction",
    ],
    learnElsewhere: [
      "JSON-RPC message internals — covered in Transport",
      "OAuth for remote servers — covered in Authentication",
    ],
  }),

  "mcp-architecture": mcpLesson({
    concept: b(
      "Three layers: Host (the app), Client (the connector), Server (the capabilities)",
      "One client talks to one server — add more servers, add more clients",
      "Startup handshake: initialize, then list tools, resources, and prompts",
      "JSON-RPC carries every request and response on the chosen transport"
    ),
    whyItExists:
      "When a connection fails, you need to know which layer broke: the app, the connector, or the server process.",
    analogy:
      "A restaurant: the dining room is the host, the waiter is the client, the kitchen is the server.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Host["Host<br/>dining room"] --> Client["Client<br/>waiter"]
    Client --> Server["Server<br/>kitchen"]
    Server --> Food["Tools and data"]`,
      `class Host grp1
    class Client grp2
    class Server,Food grp3`
    ),
    diagram: pastelChart(
      `flowchart TD
    Arch([Architecture])

    subgraph Layers["Three layers"]
        H["Host = the app"]
        C["Client = connector"]
        S["Server = tools"]
    end

    subgraph Life["Lifecycle"]
        L1["initialize"]
        L2["list tools"]
        L3["call / read"]
        L4["shutdown"]
    end

    subgraph Messages["Messages"]
        M1["JSON-RPC"]
        M2["Tool results"]
        M3["Resource reads"]
    end

    Arch --> Layers
    Arch --> Life
    Arch --> Messages
    H --> C --> S`,
      `class Arch hub
    class H,C,S grp1
    class L1,L2,L3,L4 grp2
    class M1,M2,M3 grp3
    style Layers fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Life fill:#ecfdf5,stroke:#6ee7b7,color:#065f46
    style Messages fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6`
    ),
    workflowDiagrams: [
      {
        title: "First connection",
        caption: "Nothing works until initialize succeeds and the client learns what the server can do.",
        chart: pastelChart(
          `flowchart TD
    Start["Host starts"] --> Spawn["Client connects"]
    Spawn --> Init["initialize"]
    Init --> List["list_tools"]
    List --> Ready["LLM can pick"]`,
          `class Start,Spawn grp1
    class Init,List grp2
    class Ready grp3`
        ),
      },
    ],
    technicalExplanation:
      "The host owns the user session. Each client is a 1:1 session with one server. The server answers list_tools, call_tool, list_resources, and read_resource.",
    example:
      "Cursor (host) starts a client that spawns a Postgres MCP server. After initialize, the agent sees query and schema tools.",
    practiceTask:
      "Label three boxes on paper: Host, Client, Server. Put Cursor, the connector, and a filesystem server in the right boxes.",
    commandsToRemember: [
      "Host = app the human uses",
      "Client = one connection to one server",
      "Server = exposes tools, resources, prompts",
      "initialize must succeed before any tool call",
    ],
    revisionNotes: {
      cheatSheet: [
        "Host / Client / Server",
        "One client per server connection",
        "initialize → list → operate",
        "JSON-RPC is the message format",
      ],
    },
    glossary: ["Host", "Client", "Server", "JSON-RPC", "Capability Negotiation"],
    commonMistakes: [
      "Calling the host the server",
      "Sharing one client across many servers",
      "Calling tools before initialize finishes",
    ],
    learnElsewhere: [
      "stdio vs HTTP — covered in Transport",
      "How to implement handlers — covered in MCP Server",
    ],
  }),

  "mcp-client": mcpLesson({
    concept: b(
      "The client lives inside the host and talks to exactly one server",
      "It starts the process (or HTTP session), then calls initialize",
      "It asks list_tools and list_resources so the LLM can choose",
      "When the LLM picks a tool, the client sends call_tool and waits"
    ),
    whyItExists:
      "If you build your own agent, you need a client so any MCP server can plug in without custom GitHub or Slack code.",
    analogy:
      "The client is a universal remote. Pair it once, then it can press any button the device exposes.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Remote["MCP client"] --> TV["Filesystem"]
    Remote --> Radio["GitHub"]
    Remote --> Lamp["Postgres"]`,
      `class Remote hub
    class TV grp1
    class Radio grp2
    class Lamp grp3`
    ),
    diagram: pastelChart(
      `flowchart TD
    CL([Client jobs])

    subgraph Connect["Connect"]
        C1["Start process"]
        C2["Or open HTTP"]
        C3["initialize"]
    end

    subgraph Discover["Discover"]
        D1["list_tools"]
        D2["list_resources"]
        D3["list_prompts"]
    end

    subgraph Run["Run"]
        R1["call_tool"]
        R2["read_resource"]
        R3["Handle errors"]
    end

    CL --> Connect
    CL --> Discover
    CL --> Run`,
      `class CL hub
    class C1,C2,C3 grp1
    class D1,D2,D3 grp2
    class R1,R2,R3 grp3
    style Connect fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Discover fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6
    style Run fill:#ecfdf5,stroke:#6ee7b7,color:#065f46`
    ),
    workflowDiagrams: [
      {
        title: "Client call order",
        caption: "initialize → list_tools → call_tool. Same shape in TypeScript and Python.",
        chart: pastelChart(
          `flowchart LR
    Params["Server command"] --> Session["ClientSession"]
    Session --> Init["initialize"]
    Init --> Tools["list_tools"]
    Tools --> Call["call_tool"]`,
          `class Params,Session grp1
    class Init,Tools grp2
    class Call grp3`
        ),
      },
    ],
    technicalExplanation:
      "Use the official SDK: mcp in Python or @modelcontextprotocol/sdk in TypeScript. One ClientSession per server. Merge tools from several clients in the host, not inside one session.",
    example:
      "Your agent starts three clients at boot: filesystem, GitHub, and Postgres. The LLM sees a combined tool list and the host routes each call to the right client.",
    code: `from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

params = StdioServerParameters(
    command="npx",
    args=["-y", "@modelcontextprotocol/server-filesystem", "/workspace"],
)

async def read_readme():
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools = await session.list_tools()
            return await session.call_tool("read_file", {"path": "README.md"})
`,
    codeLanguage: "python",
    practiceTask:
      "In comments, list the four client calls in order: connect, initialize, list_tools, call_tool.",
    commandsToRemember: [
      "pip install mcp",
      "ClientSession + stdio_client for local servers",
      "await session.initialize() before anything else",
      "One client instance per server",
    ],
    revisionNotes: {
      cheatSheet: [
        "Client = connector inside the host",
        "initialize then list then call",
        "One session per server",
        "Host merges tools from many clients",
      ],
    },
    glossary: ["ClientSession", "stdio", "list_tools", "call_tool"],
    commonMistakes: [
      "Forgetting initialize before list_tools",
      "Putting three servers on one ClientSession",
      "Swallowing server stderr so you cannot debug startup",
    ],
    learnElsewhere: [
      "Writing the server handlers — next module",
      "mcp.json config — Local MCP",
    ],
  }),

  "mcp-server": mcpLesson({
    concept: b(
      "A server wraps a real system and speaks MCP to any client",
      "It advertises tools with name, description, and JSON Schema",
      "call_tool runs your code and returns text (or images) as content",
      "Write the server once — Cursor and your agent both consume it"
    ),
    whyItExists:
      "The value of MCP is on the server side: one wrapper around Jira, Datadog, or your internal API.",
    analogy:
      "The server is a power adapter. Your service has a weird plug. MCP is the standard outlet every client already knows.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Native["Jira API"] --> Adapter["MCP server"]
    Adapter --> Plug["MCP tools"]
    Plug --> Any["Any client"]`,
      `class Native grp1
    class Adapter hub
    class Plug,Any grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    SV([MCP Server])

    subgraph Handlers["Handlers"]
        H1["list_tools"]
        H2["call_tool"]
        H3["list_resources"]
        H4["read_resource"]
    end

    subgraph Returns["Return"]
        T1["TextContent"]
        T2["ImageContent"]
        T3["Error result"]
    end

    subgraph Ship["How to find it"]
        S1["stdio local"]
        S2["HTTP remote"]
        S3["mcp.json"]
    end

    SV --> Handlers
    SV --> Returns
    SV --> Ship`,
      `class SV hub
    class H1,H2,H3,H4 grp1
    class T1,T2,T3 grp2
    class S1,S2,S3 grp3
    style Handlers fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Returns fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6
    style Ship fill:#ecfdf5,stroke:#6ee7b7,color:#065f46`
    ),
    workflowDiagrams: [
      {
        title: "One tool call",
        caption: "The LLM never talks to Jira directly. It talks to the MCP server.",
        chart: pastelChart(
          `flowchart LR
    LLM["LLM picks greet"] --> Client["MCP client"]
    Client --> Server["call_tool"]
    Server --> API["Your function"]
    API --> Out["Hello text"]`,
          `class LLM,Client grp1
    class Server,API grp2
    class Out grp3`
        ),
      },
    ],
    technicalExplanation:
      "Keep tool descriptions honest — the LLM chooses tools from those sentences. Validate arguments against the schema before you hit an external API.",
    example:
      "A Jira server exposes create_ticket, search_issues, and add_comment. Cursor and a support agent both use it without knowing Jira's REST shape.",
    code: `from mcp.server import Server
from mcp.types import Tool, TextContent

server = Server("greeter")

@server.list_tools()
async def list_tools():
    return [Tool(
        name="greet",
        description="Say hello to a person by name",
        inputSchema={
            "type": "object",
            "properties": {"name": {"type": "string"}},
            "required": ["name"],
        },
    )]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name != "greet":
        raise ValueError(f"unknown tool: {name}")
    who = arguments["name"]
    return [TextContent(type="text", text=f"Hello, {who}!")]
`,
    codeLanguage: "python",
    practiceTask:
      "Write a list_tools entry for a tool named search_docs with one required string argument called query.",
    commandsToRemember: [
      "list_tools advertises JSON Schema",
      "call_tool runs your function",
      "Return TextContent, do not print to stdout",
      "stdio servers must keep stdout clean for JSON-RPC",
    ],
    revisionNotes: {
      cheatSheet: [
        "Server = wrapper + MCP handlers",
        "name + description + inputSchema",
        "call_tool returns content, not prints",
        "Descriptions are how the LLM picks tools",
      ],
    },
    glossary: ["Server", "inputSchema", "call_tool", "TextContent"],
    commonMistakes: [
      "Printing debug logs to stdout on a stdio server",
      "Vague tool descriptions so the LLM picks the wrong tool",
      "Crashing the process instead of returning a tool error",
    ],
    learnElsewhere: [
      "Full build steps — Build MCP Server",
      "Resources vs tools — next two modules",
    ],
  }),

  resources: mcpLesson({
    concept: b(
      "Resources are readable data — files, schemas, docs — not actions",
      "Each resource has a URI, a name, and usually a mime type",
      "Clients call list_resources then read_resource when they need context",
      "Use a resource for lookup; use a tool when something must change"
    ),
    whyItExists:
      "Not everything should be a tool call. Dumping a schema through a tool wastes a round trip. Resources are the shelf of reference books.",
    analogy:
      "Tools are verbs. Resources are nouns. You open a cookbook (resource). You cook the meal (tool).",
    analogyDiagram: pastelChart(
      `flowchart LR
    Shelf["Resources<br/>nouns"] --> Read["read_resource"]
    Bench["Tools<br/>verbs"] --> Act["call_tool"]`,
      `class Shelf,Read grp1
    class Bench,Act grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    RS([Resources])

    subgraph Shape["Shape"]
        S1["uri"]
        S2["name"]
        S3["mimeType"]
    end

    subgraph When["Use when"]
        W1["Static schema"]
        W2["Preload context"]
        W3["Read, not write"]
    end

    subgraph Avoid["Avoid when"]
        N1["Create a ticket"]
        N2["Query with args"]
        N3["Data changes fast"]
    end

    RS --> Shape
    RS --> When
    RS --> Avoid`,
      `class RS hub
    class S1,S2,S3 grp1
    class W1,W2,W3 grp2
    class N1,N2,N3 grp3
    style Shape fill:#eff6ff,stroke:#93c5fd,color:#1e40af
    style When fill:#ecfdf5,stroke:#6ee7b7,color:#065f46
    style Avoid fill:#fee2e2,stroke:#fca5a5,color:#991b1b`
    ),
    workflowDiagrams: [
      {
        title: "Preload a schema",
        caption: "A Postgres server can expose db://schema/public so the agent knows tables before it queries.",
        chart: pastelChart(
          `flowchart LR
    List["list_resources"] --> Pick["Pick schema URI"]
    Pick --> Read["read_resource"]
    Read --> Ctx["In the prompt"]`,
          `class List,Pick grp1
    class Read,Ctx grp2`
        ),
      },
    ],
    technicalExplanation:
      "URI schemes can be file://, db://, or your own (jira://project/KEY). Keep resources small enough to fit in context. Huge dumps belong behind a search tool instead.",
    example:
      "A Postgres MCP server lists db://schema/public. At session start the client reads it once, so later SQL tools are aimed at real table names.",
    practiceTask:
      "Name one thing in your project that should be a resource (read-only) and one that must stay a tool (an action).",
    commandsToRemember: [
      "list_resources → metadata",
      "read_resource(uri) → text or blob",
      "Resources = read; tools = do",
      "Keep resource payloads small",
    ],
    revisionNotes: {
      cheatSheet: [
        "Resource = readable URI",
        "list_resources then read_resource",
        "Nouns vs verbs (tools)",
        "Do not stuff huge files into context",
      ],
    },
    glossary: ["URI", "list_resources", "read_resource", "mimeType"],
    commonMistakes: [
      "Making a write action a resource",
      "Returning a 10 MB file as a resource",
      "Forgetting a stable URI so the client cannot reload",
    ],
    learnElsewhere: [
      "Tool schemas — next module",
      "Prompt templates — Prompts",
    ],
  }),

  tools: mcpLesson({
    concept: b(
      "MCP tools are actions with a name, description, and JSON Schema",
      "The LLM picks a tool from the description, not from your Python name",
      "call_tool sends arguments; the server returns CallToolResult content",
      "One MCP tool works in Cursor, Claude Desktop, and your custom agent"
    ),
    whyItExists:
      "Function calling was reinvented in every framework. MCP tools are the same idea, with one discovery story for every client.",
    analogy:
      "A tool is a labeled button on a machine. The label (description) is what the operator reads before pressing it.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Label["Clear description"] --> Pick["LLM chooses"]
    Pick --> Press["call_tool"]
    Press --> Result["Observation"]`,
      `class Label,Pick grp1
    class Press,Result grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    TL([MCP Tools])

    subgraph Def["Definition"]
        D1["name"]
        D2["description"]
        D3["inputSchema"]
    end

    subgraph Call["Call"]
        I1["Send arguments"]
        I2["Server runs it"]
        I3["Return content"]
    end

    subgraph Quality["Quality"]
        Q1["One job per tool"]
        Q2["Required fields"]
        Q3["Name side effects"]
    end

    TL --> Def
    TL --> Call
    TL --> Quality`,
      `class TL hub
    class D1,D2,D3 grp1
    class I1,I2,I3 grp2
    class Q1,Q2,Q3 grp3
    style Def fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Call fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6
    style Quality fill:#ecfdf5,stroke:#6ee7b7,color:#065f46`
    ),
    workflowDiagrams: [
      {
        title: "GitHub example",
        caption: "search_code is a tool. The repo README would be a resource.",
        chart: pastelChart(
          `flowchart LR
    User["Find the bug"] --> LLM["Picks search_code"]
    LLM --> MCP["GitHub server"]
    MCP --> GH["GitHub API"]
    GH --> Obs["Snippets back"]`,
          `class User,LLM grp1
    class MCP,GH grp2
    class Obs grp3`
        ),
      },
    ],
    technicalExplanation:
      "Treat descriptions as UI copy for the model. If two tools sound the same, the model will flip a coin. Namespace tools when you attach several servers (github/search_code).",
    example:
      "A GitHub MCP server exposes create_issue, search_code, and get_pull_request. Cursor's agent calls search_code, then opens an issue with create_issue.",
    practiceTask:
      "Write a one-sentence description for a send_email tool that makes the side effect obvious (it actually sends mail).",
    commandsToRemember: [
      "Tool = name + description + inputSchema",
      "call_tool(name, arguments)",
      "Description is the LLM's instruction manual",
      "Namespace tools when many servers overlap",
    ],
    revisionNotes: {
      cheatSheet: [
        "Tools are verbs / actions",
        "JSON Schema for arguments",
        "Honest descriptions prevent wrong calls",
        "Return errors as results, keep the process up",
      ],
    },
    glossary: ["inputSchema", "CallToolResult", "Tool Discovery", "call_tool"],
    commonMistakes: [
      "Two tools with almost the same description",
      "Optional arguments that are actually required",
      "A mega-tool that does five unrelated jobs",
    ],
    learnElsewhere: [
      "Resources vs tools — previous module",
      "Routing tools in an agent — Integrate MCP with Agent",
    ],
  }),

  prompts: mcpLesson({
    concept: b(
      "MCP prompts are reusable recipes stored on the server, not in the app",
      "list_prompts shows names; get_prompt fills arguments and returns messages",
      "Use them for checklists: code review, incident response, threat modeling",
      "Clients often surface them as slash commands or starter templates"
    ),
    whyItExists:
      "Domain know-how should live next to the tools. A security server can ship a threat-model prompt that every client runs the same way.",
    analogy:
      "Prompts are recipe cards in a shared kitchen. Every chef (client) follows the same steps for 'how to review a PR.'",
    analogyDiagram: pastelChart(
      `flowchart LR
    Card["Prompt template"] --> Fill["Fill arguments"]
    Fill --> Messages["Ready messages"]
    Messages --> Chat["Into the chat"]`,
      `class Card grp1
    class Fill,Messages grp2
    class Chat grp3`
    ),
    diagram: pastelChart(
      `flowchart TD
    PR([Prompts])

    subgraph Api["API"]
        A1["list_prompts"]
        A2["get_prompt"]
        A3["PromptMessage"]
    end

    subgraph Good["Good uses"]
        G1["Code review"]
        G2["Incident playbook"]
        G3["Threat model"]
    end

    subgraph Vs["Not the same as"]
        V1["Host system prompt"]
        V2["A write tool"]
        V3["A raw resource"]
    end

    PR --> Api
    PR --> Good
    PR --> Vs`,
      `class PR hub
    class A1,A2,A3 grp1
    class G1,G2,G3 grp2
    class V1,V2,V3 grp3
    style Api fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Good fill:#ecfdf5,stroke:#6ee7b7,color:#065f46
    style Vs fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6`
    ),
    workflowDiagrams: [
      {
        title: "Fill then inject",
        caption: "The server owns the wording. The client only supplies arguments.",
        chart: pastelChart(
          `flowchart LR
    User["Slash command"] --> Get["get_prompt"]
    Get --> Args["Fill args"]
    Args --> Msgs["Messages"]
    Msgs --> LLM["LLM starts"]`,
          `class User,Get grp1
    class Args,Msgs grp2
    class LLM grp3`
        ),
      },
    ],
    technicalExplanation:
      "Prompt arguments are typed (usually strings). Keep templates short. Pull live facts with a resource or tool, then let the prompt tell the model how to think.",
    example:
      "A security MCP server exposes a threat-model prompt. You pass a system_description and get a structured analysis template back, the same in every client.",
    practiceTask:
      "Sketch a prompt named review_pr with one argument: diff. Write the first instruction the template should include.",
    commandsToRemember: [
      "list_prompts / get_prompt",
      "Prompts = recipes, tools = actions",
      "Arguments fill holes in the template",
      "Clients may show prompts as slash commands",
    ],
    revisionNotes: {
      cheatSheet: [
        "Prompt = parameterized message pack",
        "get_prompt(name, args)",
        "Store expertise on the server",
        "Not a replacement for tools",
      ],
    },
    glossary: ["PromptMessage", "get_prompt", "list_prompts", "Template"],
    commonMistakes: [
      "Hiding a dangerous action inside a prompt instead of a tool",
      "Huge prompts that blow the context window",
      "Prompts that assume data the client never fetched",
    ],
    learnElsewhere: [
      "Tools vs resources vs prompts — this trio is the whole MCP surface",
      "Local vs remote delivery — next modules",
    ],
  }),

  "local-mcp": mcpLesson({
    concept: b(
      "Local MCP runs on your machine as a child process over stdio",
      "The client starts a command from mcp.json and talks on stdin/stdout",
      "Best for source code, .env files, and local databases that must not leave",
      "No OAuth needed — your OS user permissions are the security boundary"
    ),
    whyItExists:
      "Some data should never go to a cloud MCP server. Local stdio keeps files on disk and latency near zero.",
    analogy:
      "Local MCP is a home workshop. The tools are on your bench. Nothing is shipped to a warehouse.",
    analogyDiagram: pastelChart(
      `flowchart LR
    IDE["Cursor"] --> Spawn["Child process"]
    Spawn --> Stdio["stdio JSON-RPC"]
    Stdio --> Files["Project folder"]`,
      `class IDE,Spawn grp1
    class Stdio grp2
    class Files grp3`
    ),
    diagram: pastelChart(
      `flowchart TD
    Loc([Local MCP])

    subgraph Config["mcp.json"]
        C1["command"]
        C2["args"]
        C3["env"]
    end

    subgraph Fit["Good local"]
        F1["Filesystem"]
        F2["Git"]
        F3["SQLite"]
    end

    subgraph Care["Watch-outs"]
        W1["No logs on stdout"]
        W2["Scope the folder"]
        W3["Crash hides tools"]
    end

    Loc --> Config
    Loc --> Fit
    Loc --> Care`,
      `class Loc hub
    class C1,C2,C3 grp1
    class F1,F2,F3 grp2
    class W1,W2,W3 grp3
    style Config fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Fit fill:#ecfdf5,stroke:#6ee7b7,color:#065f46
    style Care fill:#fee2e2,stroke:#fca5a5,color:#991b1b`
    ),
    workflowDiagrams: [
      {
        title: "How Cursor attaches a local server",
        caption: "The host owns the child process. If the process dies, reconnect or restart the host.",
        chart: pastelChart(
          `flowchart TD
    Json["Read mcp.json"] --> Exec["Spawn command"]
    Exec --> Init["initialize"]
    Init --> Ready["Tools appear"]`,
          `class Json,Exec grp1
    class Init,Ready grp2`
        ),
      },
    ],
    technicalExplanation:
      "stdio means one JSON-RPC message per line. Logs belong on stderr. Point filesystem servers at a project folder, never the whole home directory, unless you truly mean that.",
    example:
      "Cursor spawns @modelcontextprotocol/server-filesystem on your repo root. The agent can read and write project files without a network round trip.",
    code: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/dev/myproject"]
    }
  }
}`,
    codeLanguage: "json",
    practiceTask:
      "Write an mcp.json snippet that starts a filesystem server on a folder you actually use, not on /.",
    commandsToRemember: [
      "npx -y @modelcontextprotocol/server-filesystem <folder>",
      "Logs go to stderr, never stdout",
      "Scope the directory tightly",
      "stdio = local child process",
    ],
    revisionNotes: {
      cheatSheet: [
        "Local = stdio child process",
        "Configured in mcp.json",
        "Great for files and local DBs",
        "OS permissions are your auth",
      ],
    },
    glossary: ["stdio", "Child Process", "mcp.json"],
    commonMistakes: [
      "Pointing the filesystem server at the entire disk",
      "console.log on stdout breaking JSON-RPC",
      "Assuming local MCP is reachable from another computer",
    ],
    learnElsewhere: [
      "Remote HTTP servers — next module",
      "OAuth — Authentication",
    ],
  }),

  "remote-mcp": mcpLesson({
    concept: b(
      "Remote MCP runs on a URL and talks over Streamable HTTP (or SSE)",
      "Teams share one server — CRM, wiki, Slack — instead of 40 local copies",
      "You must add auth, TLS, and rate limits because it is on the network",
      "Clients store a URL plus headers in mcp.json instead of a command"
    ),
    whyItExists:
      "A local Slack server on every laptop does not scale. Remote MCP is the shared, updated, audited copy.",
    analogy:
      "Local MCP is desktop software. Remote MCP is the same app in the cloud — same buttons, hosted for the team.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Laptop["Your Cursor"] --> URL["Company URL"]
    Teammate["Teammate"] --> URL
    URL --> Slack["Shared Slack"]`,
      `class Laptop,Teammate grp1
    class URL hub
    class Slack grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Rem([Remote MCP])

    subgraph Why["Why remote"]
        Y1["One shared server"]
        Y2["Central auth"]
        Y3["Update once"]
    end

    subgraph Need["Must add"]
        N1["HTTPS"]
        N2["OAuth / API key"]
        N3["Rate limits"]
    end

    subgraph Vs["Keep local"]
        V1["Source on disk"]
        V2["Secrets in env"]
        V3["Local SQLite"]
    end

    Rem --> Why
    Rem --> Need
    Rem --> Vs`,
      `class Rem hub
    class Y1,Y2,Y3 grp1
    class N1,N2,N3 grp2
    class V1,V2,V3 grp3
    style Why fill:#ecfdf5,stroke:#6ee7b7,color:#065f46
    style Need fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Vs fill:#eff6ff,stroke:#93c5fd,color:#1e40af`
    ),
    workflowDiagrams: [
      {
        title: "Client config shape",
        caption: "URL + auth header. No child process on the laptop.",
        chart: pastelChart(
          `flowchart LR
    Cfg["mcp.json URL"] --> HTTP["Streamable HTTP"]
    HTTP --> Auth["Bearer token"]
    Auth --> Svc["Company server"]`,
          `class Cfg,HTTP grp1
    class Auth,Svc grp2`
        ),
      },
    ],
    technicalExplanation:
      "The 2025+ spec prefers Streamable HTTP. Older SSE setups still exist. Session reconnect and idle timeouts are your problem now — local stdio did not have them.",
    example:
      "The company deploys a Slack MCP server on Cloudflare. Every engineer’s Cursor points at the same URL with their own OAuth token.",
    practiceTask:
      "Write two bullets: one capability that should stay local, and one that should be a remote team server. Say why.",
    commandsToRemember: [
      "Remote = URL, not a spawned command",
      "Streamable HTTP is the current transport",
      "Auth is required on the public internet",
      "Local still wins for private files",
    ],
    revisionNotes: {
      cheatSheet: [
        "Remote MCP = shared HTTP server",
        "Auth + TLS + rate limits",
        "Update once for the whole team",
        "Do not remote your .env files",
      ],
    },
    glossary: ["Streamable HTTP", "SSE", "OAuth 2.1", "Remote MCP"],
    commonMistakes: [
      "Exposing a remote server with no auth",
      "Putting local secrets behind a public URL",
      "Forgetting timeouts so a hung tool blocks the agent",
    ],
    learnElsewhere: [
      "OAuth details — Authentication",
      "stdio vs HTTP comparison — Transport",
    ],
  }),

  authentication: mcpLesson({
    concept: b(
      "Local stdio servers usually skip network auth — the OS user is the gate",
      "Remote servers need OAuth 2.1, API keys, or mTLS before any tool runs",
      "Scopes limit which tools a token may call (read vs write)",
      "Never put long-lived secrets in the prompt; put them on the server"
    ),
    whyItExists:
      "A remote MCP URL without auth is an open admin panel. Anyone who finds it can query your database or send Slack messages.",
    analogy:
      "Auth is the bouncer. A wristband (token) gets you in. VIP sections (write tools) need a different stamp (scope).",
    analogyDiagram: pastelChart(
      `flowchart LR
    User["Human"] --> Login["OAuth login"]
    Login --> Token["Access token"]
    Token --> Bouncer["Check scopes"]
    Bouncer --> Tools["Allowed tools"]`,
      `class User,Login grp1
    class Token,Bouncer grp2
    class Tools grp3`
    ),
    diagram: pastelChart(
      `flowchart TD
    Auth([Auth])

    subgraph Local["Local stdio"]
        L1["OS permissions"]
        L2["Folder allowlist"]
        L3["No OAuth"]
    end

    subgraph Remote["Remote HTTP"]
        R1["OAuth 2.1"]
        R2["API keys"]
        R3["mTLS"]
    end

    subgraph Rules["Rules"]
        U1["Least privilege"]
        U2["Short-lived tokens"]
        U3["Secrets on server"]
    end

    Auth --> Local
    Auth --> Remote
    Auth --> Rules`,
      `class Auth hub
    class L1,L2,L3 grp1
    class R1,R2,R3 grp2
    class U1,U2,U3 grp3
    style Local fill:#ecfdf5,stroke:#6ee7b7,color:#065f46
    style Remote fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Rules fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6`
    ),
    workflowDiagrams: [
      {
        title: "OAuth in one pass",
        caption: "The human grants scopes. The client stores a token. Every MCP request carries it.",
        chart: pastelChart(
          `flowchart TD
    Ask["Need GitHub read"] --> Browser["User signs in"]
    Browser --> Grant["Grant scope"]
    Grant --> Token["Store token"]
    Token --> Call["call_tool"]`,
          `class Ask,Browser grp1
    class Grant,Token grp2
    class Call grp3`
        ),
      },
    ],
    technicalExplanation:
      "MCP can advertise authorization via .well-known endpoints. Map scopes onto tools: search_code might need repo:read; create_issue needs repo:write. Fail closed if the token is missing.",
    example:
      "A GitHub MCP server asks for OAuth with repo:read. Until the user authorizes, search_code is hidden or returns 401 instead of leaking private code.",
    practiceTask:
      "For a Slack MCP server, list one read scope tool and one write scope tool. Say which one needs extra confirmation.",
    commandsToRemember: [
      "Local = OS permissions",
      "Remote = OAuth / API key / mTLS",
      "Scopes map to tools",
      "Secrets never belong in the LLM prompt",
    ],
    revisionNotes: {
      cheatSheet: [
        "No auth on a public URL is a breach",
        "OAuth 2.1 for user-facing remote MCP",
        "Least privilege scopes",
        "Keep tokens off the prompt",
      ],
    },
    glossary: ["OAuth 2.1", "API Key", "Scopes", "mTLS"],
    commonMistakes: [
      "Shipping a remote MCP URL with no login",
      "One token that can do every write tool",
      "Pasting API keys into the system prompt",
    ],
    learnElsewhere: [
      "How HTTP carries the messages — Transport",
      "Human approval for destructive tools — agent guardrails (other phases)",
    ],
  }),

  transport: mcpLesson({
    concept: b(
      "Transport is the road — the JSON-RPC messages on top stay the same",
      "stdio is a driveway: local process, stdin and stdout, one line per message",
      "Streamable HTTP is the highway: one URL, remote, needs TLS and auth",
      "Pick stdio for files on disk; pick HTTP when the team shares a server"
    ),
    whyItExists:
      "The same list_tools call can travel on stdio or HTTP. Choosing the road changes latency, security, and who can connect.",
    analogy:
      "stdio is walking to your kitchen. HTTP is ordering delivery. The meal (JSON-RPC) is the same; the path is not.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Msg([JSON-RPC])
    Msg --> Drive["stdio local"]
    Msg --> Hwy["HTTP remote"]`,
      `class Msg hub
    class Drive grp1
    class Hwy grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    TR([Transport])

    subgraph Stdio["stdio"]
        S1["Child process"]
        S2["No network"]
        S3["Logs on stderr"]
    end

    subgraph Http["HTTP"]
        H1["URL endpoint"]
        H2["Auth headers"]
        H3["Timeouts"]
    end

    subgraph Same["Same messages"]
        U1["initialize"]
        U2["tools/call"]
        U3["resources/read"]
    end

    TR --> Stdio
    TR --> Http
    TR --> Same`,
      `class TR hub
    class S1,S2,S3 grp1
    class H1,H2,H3 grp2
    class U1,U2,U3 grp3
    style Stdio fill:#ecfdf5,stroke:#6ee7b7,color:#065f46
    style Http fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Same fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6`
    ),
    workflowDiagrams: [
      {
        title: "Decision",
        caption: "If only your laptop should see it, stdio. If the team should share it, HTTP.",
        chart: pastelChart(
          `flowchart TD
    Q([Who needs it?])
    Q -->|Only me| L["stdio"]
    Q -->|Whole team| R["HTTP"]`,
          `class Q hub
    class L grp1
    class R grp2`
        ),
      },
    ],
    technicalExplanation:
      "Older remote setups used SSE (server-sent events) plus HTTP POST. New servers should use Streamable HTTP. Do not mix: a stdio server is not reachable at a URL unless you add a gateway.",
    example:
      "Filesystem MCP uses stdio. A company Notion server uses Streamable HTTP behind an API gateway with OAuth.",
    practiceTask:
      "For each of these, pick stdio or HTTP: (1) read local git status, (2) company wiki search, (3) query a laptop-only SQLite file.",
    commandsToRemember: [
      "stdio = local, one JSON-RPC line",
      "Streamable HTTP = remote URL",
      "SSE is the older remote option",
      "Messages are JSON-RPC either way",
    ],
    revisionNotes: {
      cheatSheet: [
        "Transport ≠ protocol features",
        "stdio for local, HTTP for shared",
        "stdout is sacred on stdio",
        "HTTP needs auth and timeouts",
      ],
    },
    glossary: ["stdio", "Streamable HTTP", "SSE", "JSON-RPC"],
    commonMistakes: [
      "Expecting a stdio server to have a public URL",
      "Using stdout for logs on stdio",
      "Treating SSE and Streamable HTTP as the same code path",
    ],
    learnElsewhere: [
      "Building and testing a server — next module",
      "OAuth on HTTP — previous module",
    ],
  }),

  "build-mcp-server": mcpLesson({
    concept: b(
      "Pick an SDK: Python mcp or TypeScript @modelcontextprotocol/sdk",
      "Define 1–3 tools with tight schemas, then implement call_tool",
      "Run locally on stdio first; test with MCP Inspector before any host",
      "Only then add the server to mcp.json and try it inside Cursor"
    ),
    whyItExists:
      "Once you can ship a tiny server, any internal system — tickets, metrics, deploys — can show up as tools in every MCP client.",
    analogy:
      "Building an MCP server is writing an API that every AI app already knows how to call.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Idea["Wrap Datadog"] --> SDK["MCP SDK"]
    SDK --> Inspect["Inspector"]
    Inspect --> Cursor["mcp.json"]`,
      `class Idea,SDK grp1
    class Inspect grp2
    class Cursor grp3`
    ),
    diagram: pastelChart(
      `flowchart TD
    Build([Build a server])

    subgraph Steps["Steps"]
        T1["1 Choose SDK"]
        T2["2 Define tools"]
        T3["3 Handlers"]
        T4["4 stdio first"]
        T5["5 Inspector"]
        T6["6 mcp.json"]
    end

    subgraph Test["Inspector"]
        I1["initialize"]
        I2["list_tools"]
        I3["call_tool"]
    end

    subgraph Later["Later"]
        L1["Optional HTTP"]
        L2["Add auth"]
        L3["Share with team"]
    end

    Build --> Steps
    Build --> Test
    Build --> Later`,
      `class Build hub
    class T1,T2,T3,T4,T5,T6 grp1
    class I1,I2,I3 grp2
    class L1,L2,L3 grp3
    style Steps fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Test fill:#ecfdf5,stroke:#6ee7b7,color:#065f46
    style Later fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6`
    ),
    workflowDiagrams: [
      {
        title: "Do not skip Inspector",
        caption: "If Inspector fails, Cursor will fail too — with a worse error.",
        chart: pastelChart(
          `flowchart TD
    Code["Write one tool"] --> Ins["Inspector"]
    Ins -->|broken| Fix["Fix schema"]
    Ins -->|ok| Cfg["mcp.json"]
    Cfg --> Host["Use in agent"]`,
          `class Code,Ins grp1
    class Fix grp2
    class Cfg,Host grp3`
        ),
      },
    ],
    technicalExplanation:
      "Start with one tool. A server that greets you is enough to prove initialize, schemas, and stdio. Add real APIs only after Inspector is green.",
    example:
      "You wrap two Datadog tools — query_metrics and list_alerts — test them in Inspector, then every team agent can watch production.",
    code: `from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent
import asyncio

app = Server("notes")

@app.list_tools()
async def tools():
    return [Tool(
        name="add_note",
        description="Save a short note on this machine",
        inputSchema={
            "type": "object",
            "properties": {"text": {"type": "string"}},
            "required": ["text"],
        },
    )]

@app.call_tool()
async def call(name: str, arguments: dict):
    if name != "add_note":
        raise ValueError(name)
    return [TextContent(type="text", text=f"saved: {arguments['text']}")]

async def main():
    async with stdio_server() as (read, write):
        await app.run(read, write, app.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())
`,
    codeLanguage: "python",
    practiceTask:
      "Clone the notes server idea: one tool, one required string, Inspector before Cursor. Write the tool description first.",
    commandsToRemember: [
      "pip install mcp",
      "npx @modelcontextprotocol/inspector",
      "stdio_server() for local first",
      "Add to mcp.json only after Inspector passes",
    ],
    revisionNotes: {
      cheatSheet: [
        "SDK → tools → Inspector → mcp.json",
        "One tool is a complete first server",
        "stdout stays JSON-RPC only",
        "HTTP and auth come after local works",
      ],
    },
    glossary: ["MCP SDK", "MCP Inspector", "stdio_server", "inputSchema"],
    commonMistakes: [
      "Jumping to Cursor before Inspector works",
      "Five tools on day one",
      "Blocking the event loop with sync HTTP calls",
    ],
    learnElsewhere: [
      "Wiring discovered tools into an agent loop — last module",
      "Remote deploy — Remote MCP",
    ],
  }),

  "integrate-mcp-with-agent": mcpLesson({
    concept: b(
      "At startup, connect clients, initialize, and list_tools from each server",
      "Convert MCP schemas into the LLM provider's tool format",
      "Namespace names so github/search_code never collides with jira/search",
      "When the LLM calls a tool, route by prefix to the right MCP client"
    ),
    whyItExists:
      "MCP only helps if the agent loop actually uses it. Integration is the last mile: discovery in, observations back out.",
    analogy:
      "You added USB ports to the laptop. Integration is plugging the devices in at boot and sending each click to the right gadget.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Boot["Agent starts"] --> Plug["Connect servers"]
    Plug --> Menu["Merged tools"]
    Menu --> LLM["LLM picks tool"]
    LLM --> Route["Right client"]`,
      `class Boot,Plug grp1
    class Menu,LLM grp2
    class Route grp3`
    ),
    diagram: pastelChart(
      `flowchart TD
    Int([Agent + MCP])

    subgraph Boot["Startup"]
        B1["Read configs"]
        B2["initialize"]
        B3["Merge tools"]
    end

    subgraph Loop["Each step"]
        L1["LLM tool call"]
        L2["Split prefix"]
        L3["call_tool"]
        L4["Observation"]
    end

    subgraph Safety["Safety"]
        S1["Timeouts"]
        S2["Max steps"]
        S3["Approve writes"]
    end

    Int --> Boot
    Int --> Loop
    Int --> Safety`,
      `class Int hub
    class B1,B2,B3 grp1
    class L1,L2,L3,L4 grp2
    class S1,S2,S3 grp3
    style Boot fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Loop fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6
    style Safety fill:#fee2e2,stroke:#fca5a5,color:#991b1b`
    ),
    workflowDiagrams: [
      {
        title: "Namespacing",
        caption: "Two servers can both expose search. The prefix is how you tell them apart.",
        chart: pastelChart(
          `flowchart LR
    LLM["github/search"] --> Split["prefix github"]
    Split --> Client["GitHub client"]
    Client --> Result["Observation"]`,
          `class LLM,Split grp1
    class Client,Result grp2`
        ),
      },
    ],
    technicalExplanation:
      "Treat MCP like a tool backend, not like a second brain. The agent loop, memory, and guardrails stay in your runtime. MCP only supplies capabilities.",
    example:
      "A LangGraph node loads filesystem, GitHub, and Postgres MCP servers at start. Fifteen tools land in one registry. Destructive tools still pass a human gate.",
    code: `async def load_mcp_tools(server_configs):
    all_tools = []
    clients = {}
    for cfg in server_configs:
        client = await connect_mcp_client(cfg)
        await client.initialize()
        for tool in await client.list_tools():
            all_tools.append(mcp_to_openai_tool(tool, prefix=cfg.name))
        clients[cfg.name] = client
    return all_tools, clients

async def route_tool_call(tool_name: str, args: dict, clients):
    prefix, name = tool_name.split("/", 1)
    return await clients[prefix].call_tool(name, args)
`,
    codeLanguage: "python",
    practiceTask:
      "Write the namespaced names for filesystem/read_file and github/search_code. Then write which client each one should hit.",
    commandsToRemember: [
      "initialize + list_tools at boot",
      "prefix/name for routing",
      "Convert MCP schema → provider tools",
      "MCP is the plug, the loop is still yours",
    ],
    revisionNotes: {
      cheatSheet: [
        "Discover at startup, call in the loop",
        "Namespace to avoid collisions",
        "Route by prefix to the client",
        "Keep timeouts and HITL in the agent",
      ],
    },
    glossary: ["Tool Registry", "Namespacing", "Tool Routing", "MCP Client"],
    commonMistakes: [
      "Dumping every server tool into the prompt with no prefix",
      "Letting write tools run without a human gate",
      "Re-listing tools on every agent step instead of caching at boot",
    ],
    learnElsewhere: [
      "Agent loop design — Phase 4 Agent Foundations",
      "LangGraph orchestration — Phase 10",
    ],
  }),
};
