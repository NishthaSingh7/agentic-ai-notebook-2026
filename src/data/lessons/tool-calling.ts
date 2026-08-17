import { createLesson, type LessonInput } from "./builder";
import { pastelChart } from "@/lib/mermaid-pastel";

function b(...lines: string[]) {
  return lines.map((l) => `- ${l}`).join("\n");
}

function toolLesson(input: LessonInput) {
  return createLesson({
    ...input,
    visualFirst: true,
    practiceTask: "",
    code: undefined,
    codeLanguage: undefined,
  });
}

export const toolCallingLessons: Record<string, ReturnType<typeof createLesson>> = {
  "tool-calling": toolLesson({
    concept: b(
      "Tool calling is how the model reaches outside the prompt — APIs, DBs, code",
      "Loop: model picks a tool → runtime runs it → result goes back in",
      "No tools = a text generator. Tools = an agent that can act",
      "The model never executes the tool — your runtime does"
    ),
    whyItExists:
      "Language alone cannot book a flight or read a database. Tools are the hands.",
    analogy: "A universal remote: pick the device, press the button, read the screen.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Pick["Pick device"] --> Press["Press button"]
    Press --> Screen["Read result"]`,
      `class Pick,Press grp1
    class Screen grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Tool call])

    subgraph Loop["Loop"]
        L1["Model chooses"]
        L2["Runtime runs"]
        L3["Result back"]
    end

    subgraph Who["Who does what"]
        W1["Model = pick"]
        W2["You = execute"]
    end

    Hub --> Loop
    Hub --> Who`,
      `class Hub hub
    class L1,L2,L3 grp1
    class W1,W2 grp2`
    ),
    workflowDiagrams: [
      {
        title: "One turn with a tool",
        caption: "If there is no tool call, the model is done. If there is, you run it and call again.",
        chart: pastelChart(
          `flowchart LR
    User["User"] --> LLM["Model"]
    LLM --> Tool["Runtime"]
    Tool --> LLM`,
          `class User,LLM grp1
    class Tool grp2`
        ),
      },
    ],
    technicalExplanation:
      "Register tools with a name, description, and JSON schema. The model emits a tool call. You validate, execute, and append the result. Repeat until the model answers in text.",
    example:
      "'Book NYC Friday' → search_flights → book_flight → send_email. Three calls, one user sentence.",
    commandsToRemember: [
      "Model picks, runtime runs",
      "Schema in, JSON args out",
      "Append the tool result",
      "Loop until text",
    ],
    revisionNotes: {
      cheatSheet: [
        "Hands of the agent",
        "Pick → run → return",
        "You execute, not the LLM",
        "No tools = no agency",
      ],
    },
    glossary: ["Tool Call", "Runtime", "Agent Loop"],
    commonMistakes: [
      "Letting the model 'execute' by writing fake JSON in prose",
      "Skipping the second model call after the tool result",
      "Registering tools with empty descriptions",
    ],
    learnElsewhere: ["Function Calling", "Agent loop — Phase 4"],
  }),

  "function-calling": toolLesson({
    concept: b(
      "Function calling is the original name for tool calling — same idea, OpenAI shape",
      "You send tools[]; the model returns name + JSON arguments",
      "tool_choice can be auto, required, or one named function",
      "Anthropic and Gemini use different blocks — same JSON Schema idea"
    ),
    whyItExists:
      "Before this, models wrote pretend function calls in prose. Now the API returns a structured call.",
    analogy: "Deli ticket: item name plus extras, not a paragraph about a sandwich.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Ticket["Name + extras"] --> Kitchen["Runtime"]
    Kitchen --> Food["Result"]`,
      `class Ticket grp1
    class Kitchen,Food grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Function])

    subgraph Send["You send"]
        S1["name"]
        S2["description"]
        S3["parameters"]
    end

    subgraph Get["Model returns"]
        G1["function name"]
        G2["JSON args"]
        G3["call id"]
    end

    Hub --> Send
    Hub --> Get`,
      `class Hub hub
    class S1,S2,S3 grp1
    class G1,G2,G3 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Weather call",
        caption: "The model does not fetch weather. It names get_weather and fills city.",
        chart: pastelChart(
          `flowchart LR
    Q["Berlin weather?"] --> Call["get_weather"]
    Call --> Run["Your HTTP"]
    Run --> Ans["Answer"]`,
          `class Q,Call grp1
    class Run,Ans grp2`
        ),
      },
    ],
    technicalExplanation:
      "OpenAI: tools with type function, parameters as JSON Schema. Response: tool_calls[]. tool_choice steers whether a call is optional. Other providers differ in envelope, not in the idea.",
    example:
      "GPT returns get_weather with {\"city\":\"Berlin\"}. Your code hits the API. Next turn the model speaks the forecast.",
    commandsToRemember: [
      "tools[] + JSON Schema",
      "name + arguments",
      "tool_choice = auto | required",
      "Same idea across providers",
    ],
    revisionNotes: {
      cheatSheet: [
        "Structured call, not prose",
        "Schema describes args",
        "You still run the function",
        "Providers differ in envelope",
      ],
    },
    glossary: ["JSON Schema", "tool_choice", "tool_calls"],
    commonMistakes: [
      "Parsing prose instead of the tool_calls field",
      "Omitting parameter types in the schema",
      "Assuming every provider uses the OpenAI envelope",
    ],
    learnElsewhere: ["Tool Calling", "Structured Outputs"],
  }),

  "json-mode": toolLesson({
    concept: b(
      "JSON mode forces the model to emit a JSON object, not markdown",
      "It is a format lock — not a schema lock",
      "Still validate. JSON mode can emit extra keys or wrong types",
      "Use it for APIs that must parse; use structured outputs when you need a schema"
    ),
    whyItExists:
      "Downstream code cannot parse 'sure, here is your data…' with a fenced block.",
    analogy: "A form that only accepts a filled sheet — not a handwritten letter.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Letter["Prose"] --> Fail["Parser breaks"]
    Form["JSON only"] --> Ok["Parser works"]`,
      `class Letter,Fail grp1
    class Form,Ok grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([JSON mode])

    subgraph Does["Does"]
        D1["Object output"]
        D2["No markdown"]
    end

    subgraph Not["Does not"]
        N1["Check types"]
        N2["Check required keys"]
    end

    Hub --> Does
    Hub --> Not`,
      `class Hub hub
    class D1,D2 grp2
    class N1,N2 grp1`
    ),
    workflowDiagrams: [
      {
        title: "Still validate",
        caption: "Parse JSON, then check the shape you actually need.",
        chart: pastelChart(
          `flowchart LR
    Out["JSON string"] --> Parse["json.loads"]
    Parse --> Val["Check keys"]
    Val --> Use["Use"]`,
          `class Out,Parse grp1
    class Val,Use grp2`
        ),
      },
    ],
    technicalExplanation:
      "JSON mode constrains tokens toward valid JSON. It does not enforce your schema. Prefer structured outputs or a grammar when fields must match. Always parse-and-validate.",
    example:
      "Classifier returns {\"label\":\"refund\",\"confidence\":0.81}. JSON mode kept it parseable. You still reject missing label.",
    commandsToRemember: [
      "JSON, not markdown",
      "Not a schema",
      "Validate after parse",
      "Prefer structured outputs for strict fields",
    ],
    revisionNotes: {
      cheatSheet: [
        "Format lock only",
        "Parser-friendly",
        "Types still your job",
        "Step below structured outputs",
      ],
    },
    glossary: ["JSON Mode", "Response Format"],
    commonMistakes: [
      "Trusting JSON mode as schema validation",
      "Not handling extra keys",
      "Using JSON mode when you needed an enum field",
    ],
    learnElsewhere: ["Structured Outputs"],
  }),

  "structured-outputs": toolLesson({
    concept: b(
      "Structured outputs constrain the reply to a JSON Schema you define",
      "Enums, required fields, and nested objects can be guaranteed",
      "Use this when code will crash on a wrong shape",
      "Tool args are a schema too — same idea, different slot"
    ),
    whyItExists:
      "JSON mode still drifts. Production parsers need required keys and enums, not 'almost JSON'.",
    analogy: "A typed form with dropdowns, not a blank page labeled JSON.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Blank["Blank JSON"] --> Maybe["Maybe valid"]
    Typed["Schema"] --> Sure["Matches fields"]`,
      `class Blank,Maybe grp1
    class Typed,Sure grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Schema])

    subgraph Lock["Lock"]
        L1["Required keys"]
        L2["Enums"]
        L3["Nested objects"]
    end

    subgraph Where["Where"]
        W1["Final answer"]
        W2["Tool arguments"]
    end

    Hub --> Lock
    Hub --> Where`,
      `class Hub hub
    class L1,L2,L3 grp1
    class W1,W2 grp2`
    ),
    workflowDiagrams: [
      {
        title: "From schema to object",
        caption: "You declare the shape. The API returns an object that fits.",
        chart: pastelChart(
          `flowchart LR
    Sch["JSON Schema"] --> API["Model API"]
    API --> Obj["Typed object"]`,
          `class Sch,API grp1
    class Obj grp2`
        ),
      },
    ],
    technicalExplanation:
      "Pass a schema (or a Pydantic/Zod model) as the response format. The provider constrains decoding. Still handle refusals. Tool parameters use the same schema idea.",
    example:
      "Schema requires status: enum[open,closed] and ticket_id: string. The model cannot return 'kinda open'.",
    commandsToRemember: [
      "Schema = contract",
      "Required + enums",
      "Works for answers and tool args",
      "Handle refusals",
    ],
    revisionNotes: {
      cheatSheet: [
        "Typed form",
        "Stronger than JSON mode",
        "Same idea as tool params",
        "Still handle refuse",
      ],
    },
    glossary: ["JSON Schema", "Structured Output", "Enum"],
    commonMistakes: [
      "A schema so huge the model refuses",
      "Skipping a fallback when the provider cannot constrain",
      "Confusing JSON mode with structured outputs",
    ],
    learnElsewhere: ["JSON Mode", "Tool Validation"],
  }),

  "tool-registry": toolLesson({
    concept: b(
      "A registry is the catalog of tools the agent is allowed to see",
      "Each entry: name, description, schema, handler, permissions",
      "The model only chooses among what you registered",
      "Namespace names so search_code and github.search_code do not collide"
    ),
    whyItExists:
      "A hardcoded if/else of tools does not scale. A registry is how you add, disable, and audit tools.",
    analogy: "A restaurant menu — the kitchen will not cook what is not listed.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Menu["Menu"] --> Cook["Kitchen"]
    Off["Not listed"] --> No["Not cooked"]`,
      `class Menu,Cook grp2
    class Off,No grp1`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Registry])

    subgraph Entry["One tool"]
        E1["Name"]
        E2["Description"]
        E3["Schema"]
        E4["Handler"]
    end

    subgraph Ops["Ops"]
        O1["Enable / disable"]
        O2["Namespace"]
        O3["Audit log"]
    end

    Hub --> Entry
    Hub --> Ops`,
      `class Hub hub
    class E1,E2,E3,E4 grp1
    class O1,O2,O3 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Boot",
        caption: "Load the registry once. Send that list to the model. Do not rebuild it every token.",
        chart: pastelChart(
          `flowchart LR
    Boot["Start"] --> Load["Load registry"]
    Load --> LLM["Send tool list"]`,
          `class Boot,Load grp1
    class LLM grp2`
        ),
      },
    ],
    technicalExplanation:
      "A dict or table: name → {description, schema, fn, scopes}. Filter by permission before the model sees the list. Prefix names when many servers contribute tools.",
    example:
      "Registry has search, refund, and lookup_order. Refund is disabled for interns. The intern's model never sees refund.",
    commandsToRemember: [
      "Name + schema + handler",
      "Filter before the model",
      "Namespace collisions",
      "Enable/disable without deploys if you can",
    ],
    revisionNotes: {
      cheatSheet: [
        "The menu",
        "Model only sees listed tools",
        "Namespace names",
        "Permissions live here",
      ],
    },
    glossary: ["Registry", "Namespace", "Handler"],
    commonMistakes: [
      "Duplicate tool names from two plugins",
      "Showing every tool to every user",
      "Rebuilding the list on every agent step",
    ],
    learnElsewhere: ["Tool Permissions", "Dynamic Tool Loading"],
  }),

  "tool-selection": toolLesson({
    concept: b(
      "Selection is choosing which tool to call — or none",
      "Good descriptions beat extra tools; too many tools confuse the model",
      "Route cheap: small model or rules can pick the tool, big model fills args",
      "Wrong tool is often a prompt/schema problem, not a smarter model"
    ),
    whyItExists:
      "Twenty tools in one list makes the model pick search when it needed sql_query.",
    analogy: "A toolbox: the right wrench, not every wrench on the bolt.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Few["3 clear tools"] --> Hit["Right pick"]
    Many["30 vague tools"] --> Miss["Wrong pick"]`,
      `class Few,Hit grp2
    class Many,Miss grp1`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Select])

    subgraph Help["Help the model"]
        H1["Clear names"]
        H2["Clear descriptions"]
        H3["Fewer tools"]
    end

    subgraph Route["Route"]
        R1["Rules"]
        R2["Small model"]
        R3["Then fill args"]
    end

    Hub --> Help
    Hub --> Route`,
      `class Hub hub
    class H1,H2,H3 grp1
    class R1,R2,R3 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Two-stage pick",
        caption: "Optionally pick the tool first, then ask for arguments.",
        chart: pastelChart(
          `flowchart LR
    Intent["Intent"] --> Pick["Pick tool"]
    Pick --> Args["Fill args"]
    Args --> Run["Run"]`,
          `class Intent,Pick grp1
    class Args,Run grp2`
        ),
      },
    ],
    technicalExplanation:
      "Limit the visible set. Write descriptions that say when not to use the tool. For large catalogs, retrieve candidate tools or use a router. Log wrong picks as eval cases.",
    example:
      "Catalog of 80 tools. Router keeps 4 candidates for 'invoice status'. The main model only sees those 4.",
    commandsToRemember: [
      "Fewer, clearer tools",
      "Describe when not to use",
      "Router for large catalogs",
      "Log wrong picks",
    ],
    revisionNotes: {
      cheatSheet: [
        "Right wrench",
        "Descriptions matter",
        "Too many tools hurt",
        "Route then fill",
      ],
    },
    glossary: ["Tool Router", "Candidate Set"],
    commonMistakes: [
      "Dumping 100 tools into every call",
      "Names like do_stuff and handle_it",
      "No eval set of 'which tool for this question'",
    ],
    learnElsewhere: ["Tool Registry", "Dynamic Tool Loading"],
  }),

  "dynamic-tool-loading": toolLesson({
    concept: b(
      "Dynamic loading adds tools mid-run instead of sending the full catalog",
      "Load by intent, user, or a search over tool descriptions",
      "Unload tools you no longer need to save tokens",
      "The model cannot call a tool it has not been shown"
    ),
    whyItExists:
      "A 200-tool platform cannot put every schema in the prompt. Load what this task needs.",
    analogy: "Apps on a phone — install what you need, do not ship every app in RAM.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Need["This task"] --> Load["Load 3 tools"]
    All["All 200"] --> Fat["Prompt too fat"]`,
      `class Need,Load grp2
    class All,Fat grp1`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Dynamic])

    subgraph When["When"]
        W1["By intent"]
        W2["By role"]
        W3["By search"]
    end

    subgraph Care["Care"]
        C1["Show before call"]
        C2["Unload after"]
    end

    Hub --> When
    Hub --> Care`,
      `class Hub hub
    class W1,W2,W3 grp1
    class C1,C2 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Load then call",
        caption: "Discover, attach to the next request, then the model can call it.",
        chart: pastelChart(
          `flowchart LR
    Find["Find tools"] --> Attach["Attach schemas"]
    Attach --> Call["Model may call"]`,
          `class Find,Attach grp1
    class Call grp2`
        ),
      },
    ],
    technicalExplanation:
      "Keep a large catalog off-prompt. Retrieve a subset (embedding search over descriptions, or a router). Attach those schemas to the next completion. Never expect a call to an unseen tool.",
    example:
      "User mentions Stripe. Loader attaches stripe.refund and stripe.balance. GitHub tools stay unloaded.",
    commandsToRemember: [
      "Catalog off-prompt",
      "Attach before the call",
      "Unload when done",
      "Unseen = uncallable",
    ],
    revisionNotes: {
      cheatSheet: [
        "Install for this task",
        "Search the catalog",
        "Must be visible to call",
        "Saves tokens",
      ],
    },
    glossary: ["Tool Catalog", "Lazy Load"],
    commonMistakes: [
      "Expecting a call to a tool you never sent",
      "Loading the whole catalog 'just in case'",
      "Forgetting to unload write tools after the task",
    ],
    learnElsewhere: ["Tool Selection", "Tool Registry"],
  }),

  "tool-permissions": toolLesson({
    concept: b(
      "Permissions decide who may run which tool — not the model",
      "Read vs write vs irreversible (refund, delete, email)",
      "Check permission in the runtime even if the model asked",
      "Human-in-the-loop for high-impact writes"
    ),
    whyItExists:
      "A clever prompt is not an access-control list. The model will try refund if it can see the tool.",
    analogy: "Badge access to rooms. The intern's badge does not open the vault.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Badge["Badge"] --> Read["Read room"]
    Badge --> No["Vault locked"]`,
      `class Badge,Read grp2
    class No grp1`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Perms])

    subgraph Levels["Levels"]
        L1["Read"]
        L2["Write"]
        L3["Irreversible"]
    end

    subgraph Gate["Gate"]
        G1["Runtime check"]
        G2["HITL"]
        G3["Deny log"]
    end

    Hub --> Levels
    Hub --> Gate`,
      `class Hub hub
    class L1,L2,L3 grp1
    class G1,G2,G3 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Call attempt",
        caption: "Model asked. Runtime still decides.",
        chart: pastelChart(
          `flowchart LR
    Ask["Model asks refund"] --> Check["Perm check"]
    Check --> Run["Run"]
    Check --> Deny["Deny + log"]`,
          `class Ask,Check grp1
    class Run grp2
    class Deny grp3`
        ),
      },
    ],
    technicalExplanation:
      "Scopes on each tool. Filter the registry per user. Re-check at execution. Irreversible actions need HITL. Log denials. Never trust the model as the only gate.",
    example:
      "Support intern can lookup_order. Only leads can refund. The model emits refund; runtime returns a permission error, not a chargeback.",
    commandsToRemember: [
      "Runtime is the gate",
      "Read vs write vs irreversible",
      "HITL for blast radius",
      "Log denials",
    ],
    revisionNotes: {
      cheatSheet: [
        "ACL, not a prompt",
        "Check at execute",
        "HITL for writes",
        "Hide tools you deny",
      ],
    },
    glossary: ["Scope", "HITL", "Least Privilege"],
    commonMistakes: [
      "Hiding a tool in the prompt but leaving the handler open",
      "No HITL on refunds",
      "Same tool list for admin and intern",
    ],
    learnElsewhere: ["Tool Validation", "Security — Phase 20"],
  }),

  "tool-validation": toolLesson({
    concept: b(
      "Validate arguments before the handler runs",
      "Schema first, then business rules (ids exist, amounts in range)",
      "Reject with a short error the model can fix",
      "Never pass raw model JSON straight into SQL or a shell"
    ),
    whyItExists:
      "Models emit wrong types, extra keys, and prompt-injected strings. The handler must not trust them.",
    analogy: "Airport security before the gate — ticket looks real, still scan it.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Ticket["Looks fine"] --> Scan["Validate"]
    Scan --> Fly["Handler"]
    Scan --> Stop["Reject"]`,
      `class Ticket,Scan grp1
    class Fly grp2
    class Stop grp3`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Validate])

    subgraph Checks["Checks"]
        C1["Types"]
        C2["Required"]
        C3["Business rules"]
    end

    subgraph Fail["On fail"]
        F1["Short error"]
        F2["Let model retry"]
    end

    Hub --> Checks
    Hub --> Fail`,
      `class Hub hub
    class C1,C2,C3 grp1
    class F1,F2 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Before the API",
        caption: "Parse, schema-check, then policy-check, then call.",
        chart: pastelChart(
          `flowchart LR
    Args["JSON args"] --> Sch["Schema"]
    Sch --> Pol["Policy"]
    Pol --> API["Handler"]`,
          `class Args,Sch,Pol grp1
    class API grp2`
        ),
      },
    ],
    technicalExplanation:
      "Parse JSON. Validate against JSON Schema. Then apply policy (tenant, max amount). Return a crisp error string. Do not interpolate args into SQL or bash.",
    example:
      "refund amount: -5 and user_id: '1 OR 1=1'. Schema fails the amount. Policy would have failed the id. Handler never runs.",
    commandsToRemember: [
      "Schema then policy",
      "No raw SQL/shell",
      "Short errors for retry",
      "Never trust model JSON",
    ],
    revisionNotes: {
      cheatSheet: [
        "Scan before the gate",
        "Types + business rules",
        "Crisp errors",
        "No interpolation",
      ],
    },
    glossary: ["JSON Schema", "Policy Check", "Injection"],
    commonMistakes: [
      "json.loads and go",
      "Putting args into f-string SQL",
      "Returning a stack trace to the model",
    ],
    learnElsewhere: ["Structured Outputs", "SQL Tool"],
  }),

  "retry-and-fallback": toolLesson({
    concept: b(
      "Tools fail: timeouts, 429s, empty data, downstream bugs",
      "Retry only what is safe — GET yes, refund maybe not",
      "Fallback: another tool, a cached answer, or a human",
      "Cap retries. Infinite loops burn money and anger users"
    ),
    whyItExists:
      "Demos assume every API is up. Production is 429s and 500s.",
    analogy: "A backup route when the bridge is closed — not driving into the river twice.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Bridge["Bridge down"] --> Retry["Wait + retry"]
    Retry --> Alt["Other road"]
    Alt --> Human["Call a human"]`,
      `class Bridge grp1
    class Retry,Alt,Human grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Retry])

    subgraph Safe["Retry if"]
        S1["Timeout"]
        S2["429"]
        S3["GET"]
    end

    subgraph Stop["Do not blindly"]
        N1["Payments"]
        N2["Emails"]
        N3["Infinite loop"]
    end

    Hub --> Safe
    Hub --> Stop`,
      `class Hub hub
    class S1,S2,S3 grp2
    class N1,N2,N3 grp1`
    ),
    workflowDiagrams: [
      {
        title: "Failure path",
        caption: "Retry once with backoff, then fallback, then HITL.",
        chart: pastelChart(
          `flowchart LR
    Fail["Tool fail"] --> Back["Backoff"]
    Back --> Again["Retry"]
    Again --> Alt["Fallback"]
    Alt --> HITL["Human"]`,
          `class Fail,Back,Again grp1
    class Alt,HITL grp2`
        ),
      },
    ],
    technicalExplanation:
      "Classify errors. Idempotent reads can retry with jitter. Writes need idempotency keys. After N failures, switch tool or escalate. Tell the model the error was transient vs permanent.",
    example:
      "search_web 429s. Retry once after 400ms. Still failing → cached results from an hour ago, labeled stale, plus a note to the user.",
    commandsToRemember: [
      "Retry idempotent reads",
      "Idempotency keys on writes",
      "Cap N",
      "Fallback then HITL",
    ],
    revisionNotes: {
      cheatSheet: [
        "Tools will fail",
        "Safe vs unsafe retry",
        "Backoff + cap",
        "Human last",
      ],
    },
    glossary: ["Backoff", "Idempotency", "Fallback"],
    commonMistakes: [
      "Retrying a refund three times",
      "No cap on the agent loop",
      "Swallowing errors so the model invents success",
    ],
    learnElsewhere: ["Tool Permissions", "Production agents — Phase 21"],
  }),

  "external-apis": toolLesson({
    concept: b(
      "Most tools are HTTP: your code calls someone else's API",
      "Wrap one capability per tool — not a giant 'call_any_url'",
      "Timeouts, auth, and error mapping live in the wrapper",
      "Never let the model supply the full URL and headers"
    ),
    whyItExists:
      "Agency is useless if every action is a free-form HTTP request the model can point at your metadata service.",
    analogy: "A labeled button on the wall, not a raw wiring closet.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Button["weather.city"] --> Wrap["Your wrapper"]
    Wrap --> HTTP["Vendor API"]
    Raw["Any URL"] --> Danger["SSRF"]`,
      `class Button,Wrap,HTTP grp2
    class Raw,Danger grp1`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([HTTP tools])

    subgraph Wrap["Wrapper"]
        W1["Fixed URL"]
        W2["Your auth"]
        W3["Timeout"]
    end

    subgraph Model["Model sees"]
        M1["Name"]
        M2["A few args"]
    end

    Hub --> Wrap
    Hub --> Model`,
      `class Hub hub
    class W1,W2,W3 grp1
    class M1,M2 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Safe weather tool",
        caption: "Model sends city. You attach the API key and hit a fixed host.",
        chart: pastelChart(
          `flowchart LR
    City["city=Berlin"] --> Wrap["Wrapper"]
    Wrap --> Vendor["api.weather"]`,
          `class City grp1
    class Wrap,Vendor grp2`
        ),
      },
    ],
    technicalExplanation:
      "One tool = one vendor operation. Secrets stay in env. Timeouts and retries in the wrapper. Map HTTP errors to short strings. Ban open URL tools unless sandboxed.",
    example:
      "get_weather(city) hits api.weather.com with your key. There is no fetch(url) tool on this agent.",
    commandsToRemember: [
      "One capability per tool",
      "Fixed host, your auth",
      "Timeouts in the wrapper",
      "No open URL from the model",
    ],
    revisionNotes: {
      cheatSheet: [
        "Labeled button",
        "Secrets stay server-side",
        "Map errors",
        "SSRF if you allow any URL",
      ],
    },
    glossary: ["Wrapper", "SSRF", "Timeout"],
    commonMistakes: [
      "A generic http_request tool in production",
      "Putting API keys in the schema 'for convenience'",
      "No timeout so one vendor hangs the agent",
    ],
    learnElsewhere: ["Tool Validation", "Retry & Fallback"],
  }),

  "browser-tool": toolLesson({
    concept: b(
      "A browser tool lets the agent click, type, and read pages",
      "It is slow, brittle, and powerful — use APIs when they exist",
      "Sandbox the browser: allowlist hosts, no file downloads to prod disks",
      "Prefer structured extract over dumping the whole DOM"
    ),
    whyItExists:
      "Some systems have no API. The web UI is the only door. Treat it as a last-resort tool.",
    analogy: "A intern with a laptop — they can use the site, they can also click Delete.",
    analogyDiagram: pastelChart(
      `flowchart LR
    API["Real API"] --> First["Prefer this"]
    UI["Only a UI"] --> Browser["Browser tool"]`,
      `class API,First grp2
    class UI,Browser grp1`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Browser])

    subgraph Can["Can"]
        C1["Open URL"]
        C2["Click / type"]
        C3["Read text"]
    end

    subgraph Guard["Guard"]
        G1["Host allowlist"]
        G2["Timeouts"]
        G3["No raw DOM dump"]
    end

    Hub --> Can
    Hub --> Guard`,
      `class Hub hub
    class C1,C2,C3 grp1
    class G1,G2,G3 grp2`
    ),
    workflowDiagrams: [
      {
        title: "Extract, do not dump",
        caption: "Navigate, then return the field you need.",
        chart: pastelChart(
          `flowchart LR
    Open["Open page"] --> Find["Find field"]
    Find --> Return["Return value"]`,
          `class Open,Find grp1
    class Return grp2`
        ),
      },
    ],
    technicalExplanation:
      "Playwright/Puppeteer in a sandbox. Allowlist domains. Cap step count. Return extracted text or screenshots, not 2MB of HTML. HITL for logins and purchases.",
    example:
      "Vendor portal has no API. Browser tool opens the invoice page and returns due date + amount. It cannot visit arbitrary URLs.",
    commandsToRemember: [
      "Last resort vs an API",
      "Allowlist hosts",
      "Extract fields",
      "HITL for money and login",
    ],
    revisionNotes: {
      cheatSheet: [
        "UI when there is no API",
        "Slow and brittle",
        "Sandbox + allowlist",
        "Do not dump the DOM",
      ],
    },
    glossary: ["Playwright", "Allowlist", "Sandbox"],
    commonMistakes: [
      "Giving the agent the whole internet",
      "Pasting full HTML into the context window",
      "No timeout on page.goto",
    ],
    learnElsewhere: ["Browser agents — Phase 23", "Tool Permissions"],
  }),

  "python-tool": toolLesson({
    concept: b(
      "A Python tool runs code the model wrote — calculate, transform, plot",
      "Sandbox it: no network, no secrets, time and memory caps",
      "Return stdout and a short error, not a traceback novel",
      "Prefer a calculator tool over free exec when you only need math"
    ),
    whyItExists:
      "The model is bad at long arithmetic and data wrangling. A kernel is good — and dangerous.",
    analogy: "A lab bench behind glass. Useful. Not the keys to production.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Glass["Sandbox"] --> Run["Exec"]
    Prod["Prod keys"] --> No["Never"]`,
      `class Glass,Run grp2
    class Prod,No grp1`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Python])

    subgraph Ok["Ok"]
        O1["Math"]
        O2["Transform data"]
        O3["Plots"]
    end

    subgraph No["No"]
        N1["Network"]
        N2["Secrets"]
        N3["Unbounded CPU"]
    end

    Hub --> Ok
    Hub --> No`,
      `class Hub hub
    class O1,O2,O3 grp2
    class N1,N2,N3 grp1`
    ),
    workflowDiagrams: [
      {
        title: "Exec path",
        caption: "Validate, run in sandbox, return a small result.",
        chart: pastelChart(
          `flowchart LR
    Code["Model code"] --> Sand["Sandbox"]
    Sand --> Out["stdout / error"]`,
          `class Code grp1
    class Sand,Out grp2`
        ),
      },
    ],
    technicalExplanation:
      "Restricted runtime (no socket, no fs except a temp dir). Time and memory limits. Strip traces. If the task is arithmetic, a calc tool is safer than exec.",
    example:
      "Model writes a pandas snippet to average 20 numbers. Sandbox returns 14.2. It cannot import requests.",
    commandsToRemember: [
      "Sandbox or do not ship",
      "No network, no secrets",
      "Caps on time/memory",
      "Calc tool if you only need math",
    ],
    revisionNotes: {
      cheatSheet: [
        "Lab behind glass",
        "Exec is power",
        "Lock network",
        "Small outputs",
      ],
    },
    glossary: ["Sandbox", "Exec", "Resource Cap"],
    commonMistakes: [
      "eval() in the API process",
      "Allowing pip install from the tool",
      "Returning a 400-line traceback to the model",
    ],
    learnElsewhere: ["Tool Permissions", "Tool Validation"],
  }),

  "sql-tool": toolLesson({
    concept: b(
      "A SQL tool lets the agent query data you already trust",
      "Prefer parameterized, read-only queries on a view",
      "Never concatenate model text into SQL",
      "Cap rows and time; return a compact table, not 100k rows"
    ),
    whyItExists:
      "Warehouse truth beats hallucinated numbers. An open SQL prompt also drops tables.",
    analogy: "A teller window into the vault — not handing over the master key.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Window["Read view"] --> Safe["Safe"]
    Key["Raw SQL string"] --> Drop["DROP"]`,
      `class Window,Safe grp2
    class Key,Drop grp1`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([SQL])

    subgraph Safe["Safe"]
        S1["Read-only role"]
        S2["Bound params"]
        S3["Row cap"]
    end

    subgraph Ban["Ban"]
        B1["String concat"]
        B2["DDL"]
        B3["Unbounded SELECT"]
    end

    Hub --> Safe
    Hub --> Ban`,
      `class Hub hub
    class S1,S2,S3 grp2
    class B1,B2,B3 grp1`
    ),
    workflowDiagrams: [
      {
        title: "Ask then query",
        caption: "Model fills parameters. You run a template.",
        chart: pastelChart(
          `flowchart LR
    Args["order_id"] --> Tpl["Fixed SQL"]
    Tpl --> Rows["Capped rows"]`,
          `class Args grp1
    class Tpl,Rows grp2`
        ),
      },
    ],
    technicalExplanation:
      "Templates or a schema-limited query builder. DB user is SELECT-only. Bind parameters. LIMIT. Timeout. Summarize wide results. HITL for any write.",
    example:
      "lookup_order(id) runs SELECT … WHERE id = $1 LIMIT 1. The model never sees a string it can turn into OR 1=1.",
    commandsToRemember: [
      "Read-only role",
      "Bound parameters",
      "LIMIT + timeout",
      "No concat",
    ],
    revisionNotes: {
      cheatSheet: [
        "Teller window",
        "Templates > free SQL",
        "Cap rows",
        "Writes need HITL",
      ],
    },
    glossary: ["Parameterized Query", "Read-Only Role", "Injection"],
    commonMistakes: [
      "f\"SELECT * FROM {table}\"",
      "Admin DB credentials on the agent",
      "Returning 50k rows into the prompt",
    ],
    learnElsewhere: ["Tool Validation", "External APIs"],
  }),

  "filesystem-tool": toolLesson({
    concept: b(
      "A filesystem tool reads and writes files the agent is allowed to touch",
      "Root the tool at a project folder — never the whole disk",
      "Separate read vs write vs delete permissions",
      "Log every path; block .. and symlinks that escape the root"
    ),
    whyItExists:
      "Coding and RAG agents need files. An unbounded fs tool will read .env and write /etc.",
    analogy: "A locked office drawer, not the building master key.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Drawer["Project folder"] --> Ok["Read / write"]
    Master["Whole disk"] --> Leak[".env / etc"]`,
      `class Drawer,Ok grp2
    class Master,Leak grp1`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Filesystem])

    subgraph Allow["Allow"]
        A1["Root folder"]
        A2["Read"]
        A3["Write if scoped"]
    end

    subgraph Block["Block"]
        B1["Path escape"]
        B2["Secrets"]
        B3["Delete by default"]
    end

    Hub --> Allow
    Hub --> Block`,
      `class Hub hub
    class A1,A2,A3 grp2
    class B1,B2,B3 grp1`
    ),
    workflowDiagrams: [
      {
        title: "Resolve then open",
        caption: "Join to root, resolve, reject if it leaves the root.",
        chart: pastelChart(
          `flowchart LR
    Rel["rel path"] --> Join["Join root"]
    Join --> Check["Still in root?"]
    Check --> Open["Open"]`,
          `class Rel,Join,Check grp1
    class Open grp2`
        ),
      },
    ],
    technicalExplanation:
      "Chroot mentally: all paths relative to a workspace. Resolve and verify the prefix. .env and key files denylisted. Writes are a permission. Deletes are HITL. Log path + user.",
    example:
      "Agent may read src/** and write to tmp/patches/. It cannot read ~/.ssh or ../../../etc/passwd.",
    commandsToRemember: [
      "Root to a folder",
      "Resolve + prefix check",
      "Denylist secrets",
      "Delete is HITL",
    ],
    revisionNotes: {
      cheatSheet: [
        "Locked drawer",
        "No disk-wide access",
        "Read ≠ write ≠ delete",
        "Log paths",
      ],
    },
    glossary: ["Workspace Root", "Path Traversal", "Denylist"],
    commonMistakes: [
      "Passing user paths to open() with no root",
      "Allowing delete without HITL",
      "Reading .env because 'the agent needed config'",
    ],
    learnElsewhere: ["Tool Permissions", "MCP filesystem servers — Phase 8"],
  }),
};
