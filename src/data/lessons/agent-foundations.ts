import { createLesson, iq } from "./builder";
import { withAgentPractice } from "./agent-foundations-practice";
import { pastelChart } from "@/lib/mermaid-pastel";

/** Short bullet lines for visual-first Key Takeaways */
function b(...lines: string[]) {
  return lines.map((l) => `- ${l}`).join("\n");
}

export const agentFoundationsLessons: Record<string, ReturnType<typeof createLesson>> = {
  "what-is-an-ai-agent": createLesson(withAgentPractice("what-is-an-ai-agent", {
    visualFirst: true,
    concept: b(
      "Agent = LLM reasoning + tools + memory + loop until goal is done",
      "Chatbots answer once; agents observe, act, and iterate",
      "Five components: brain, tools, memory, planning, orchestration",
      "Production needs limits, guardrails, tracing, and human approval"
    ),
    whyItExists:
      "LLMs alone only generate text. Agents complete multi-step workflows by calling APIs, databases, and external systems.",
    analogy:
      "A chatbot advises from a chair; an agent logs in, pulls data, drafts the report, and sends it for review.",
    analogyDiagram: pastelChart(
      `flowchart LR
    CB[Chatbot - advises from chair] --> AG[Agent - logs in pulls data acts]
    AG --> DONE[Task completed with side effects]`,
      `class CB grp1
    class AG grp2
    class DONE grp3`
    ),
    diagram: pastelChart(
      `flowchart TD
    AG([What is an AI Agent? - Full Topic Map])

    subgraph Components["Five Core Components"]
        C1[LLM - reasoning engine decides next step]
        C2[Tools - typed APIs to external systems]
        C3[Memory - short-term history and long-term store]
        C4[Planning - decompose goals into steps]
        C5[Orchestration loop - observe reason act repeat]
    end

    subgraph ToolTypes["Common Tool Categories"]
        T1[Search - web Bing Google SerpAPI]
        T2[Data - SQL Snowflake Postgres APIs]
        T3[Code - Python sandbox terminal]
        T4[Comms - email Slack SMS]
        T5[Files - read write upload download]
        T6[Browser - Playwright scrape click]
        T7[Custom - CRM ERP internal APIs]
    end

    subgraph MemoryTypes["Memory Types"]
        M1[Working - current context window]
        M2[Short-term - session message buffer]
        M3[Long-term - vector store retrieval]
        M4[Episodic - lessons from past tasks]
        M5[Semantic - extracted facts graph]
    end

    subgraph VsChatbot["Agent vs Chatbot"]
        V1[Chatbot - single turn text only]
        V2[Agent - multi-step autonomous loop]
        V3[Chatbot - no side effects in world]
        V4[Agent - calls APIs DB email code]
        V5[Chatbot - no tool selection]
        V6[Agent - selects tools each iteration]
        V7[Chatbot - stateless per request]
        V8[Agent - persistent state across steps]
    end

    subgraph Loop["Execution Loop - Step by Step"]
        L1[Observe - user message tool results memory]
        L2[Reason - LLM picks action or done]
        L3[Act - execute tool with parsed args]
        L4[Update - append results increment step]
        L5[Terminate - answer max steps timeout budget]
        L1 --> L2 --> L3 --> L4 --> L1
    end

    subgraph Production["Production Requirements"]
        P1[Max iterations - prevent runaway 10-25]
        P2[Guardrails - input and output validation]
        P3[Observability - LangSmith OpenTelemetry trace]
        P4[Cost budget - tokens per run]
        P5[Human approval - destructive actions]
        P6[Sandboxed tool execution]
        P7[Allowlisted tools per user role]
        P8[Audit log every action taken]
    end

    subgraph Failures["Common Failure Modes"]
        F1[Infinite loop - no max_steps]
        F2[Wrong tool args - bad JSON parsing]
        F3[Context overflow - history too long]
        F4[Runaway cost - no token budget]
        F5[Unsafe action - no HITL gate]
    end

    AG --> Components
    AG --> ToolTypes
    AG --> MemoryTypes
    AG --> VsChatbot
    AG --> Loop
    AG --> Production
    AG --> Failures
    C2 --> ToolTypes
    C3 --> MemoryTypes`,
      `class AG hub
    class C1,C2,C3,C4,C5 grp1
    class T1,T2,T3,T4,T5,T6,T7 grp2
    class M1,M2,M3,M4,M5 grp3
    class V1,V2,V3,V4,V5,V6,V7,V8 grp4
    class L1,L2,L3,L4,L5 grp5
    class P1,P2,P3,P4,P5,P6,P7,P8 grp6
    class F1,F2,F3,F4,F5 grp7
    style Components fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style ToolTypes fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6
    style MemoryTypes fill:#eff6ff,stroke:#93c5fd,color:#1e40af
    style VsChatbot fill:#fdf2f8,stroke:#f9a8d4,color:#9d174d
    style Loop fill:#ecfdf5,stroke:#6ee7b7,color:#065f46
    style Production fill:#fef3c7,stroke:#fcd34d,color:#92400e
    style Failures fill:#fee2e2,stroke:#fca5a5,color:#991b1b`
    ),
    workflowDiagrams: [
      {
        title: "End-to-End Agent Runtime",
        caption: "User goal through bounded loop to final output — with guardrails and HITL.",
        chart: pastelChart(
          `flowchart TD
    U[User Goal] --> R[Agent Runtime]
    R --> P[Perceive - tools plus memory]
    P --> LLM[LLM Reasoning Engine]
    LLM --> D{Action or Done?}
    D -->|Action| H{Destructive?}
    H -->|yes| AP[Human Approval Gate]
    H -->|no| T[Execute Tool in Sandbox]
    AP -->|approved| T
    AP -->|rejected| P
    T --> S[Update State and Memory]
    S --> R
    D -->|Done| O[Final Response]
    G[Guardrails] -.-> LLM
    G -.-> O`,
          `class U hub
    class R,P,T,S grp1
    class LLM grp2
    class O grp3
    class G grp4`
        ),
      },
      {
        title: "Five Components Working Together",
        caption: "How brain tools memory planning and loop connect in one run.",
        chart: pastelChart(
          `flowchart LR
    subgraph Brain
        LLM[LLM plus System Prompt]
        PL[Planning Module]
    end
    subgraph Tools
        REG[Tool Registry]
        EX[Execute Handler]
    end
    subgraph Memory
        ST[Short-term Buffer]
        LT[Long-term Vector Store]
    end
    LOOP[Orchestration Loop]
    LLM --> LOOP
    PL --> LLM
    LOOP --> REG
    REG --> EX
    EX --> ST
    ST --> LT
    LT --> LLM`,
          `class LOOP hub
    class LLM,PL grp1
    class REG,EX grp2
    class ST,LT grp3`
        ),
      },
    ],
    revisionNotes: {
      cheatSheet: [
        "Agent = LLM + Tools + Memory + Loop",
        "Observe → Reason → Act → Update → Repeat",
        "max_iterations + cost budget required",
        "Trace every step for debugging",
        "Human approval for writes and deletes",
        "Sandbox tool execution in production",
      ],
    },
    commonMistakes: [
      "No iteration limit on the agent loop",
      "Unrestricted tool access without sandboxing",
      "Treating agents as single-turn chatbots",
    ],
  })),

  "why-llms-need-agents": createLesson(withAgentPractice("why-llms-need-agents", {
    visualFirst: true,
    concept: b(
      "LLMs are stateless predictors with frozen training knowledge",
      "Agents add tools for live data and real-world actions",
      "Loops enable multi-step tasks pure prompting cannot solve",
      "Memory and RAG ground answers in facts"
    ),
    whyItExists:
      "Production needs live data, accurate math, citations, and side effects — not guesses from training data.",
    analogy:
      "An LLM alone is a strategist locked in a room with no phone. An agent gives them tools and permission to act.",
    diagram: pastelChart(
      `flowchart TD
    W([Why LLMs Need Agents - Full Map])

    subgraph Limits["LLM Fundamental Limits"]
        L1[Knowledge cutoff - no events after training]
        L2[No side effects - cannot send email or update DB]
        L3[Single-turn bias - no persistent action loop]
        L4[Math and logic errors without tools]
        L5[Hallucinated facts and fake citations]
        L6[No access to private or live data]
        L7[Cannot verify claims against sources]
        L8[No persistent state across sessions]
    end

    subgraph Solutions["What Agents Add - Limit to Fix"]
        S1[RAG and search - fixes L1 L6 L7]
        S2[API and SQL tools - fixes L2 L6]
        S3[Agent loop - fixes L3 L8]
        S4[Calculator and code - fixes L4]
        S5[Memory tiers - fixes L8]
        S6[Grounding and citations - fixes L5 L7]
        S7[HITL approval - fixes unsafe L2 actions]
    end

    subgraph UseCases["When You Need an Agent"]
        U1[Research across multiple sources]
        U2[Data analysis with SQL and charts]
        U3[Workflow automation - email CRM tickets]
        U4[Code generation with test execution]
        U5[Customer support with tool access]
        U6[DevOps - deploy monitor rollback]
        U7[Sales ops - CRM update and outreach]
    end

    subgraph ChatbotOK["When Chatbot is Enough"]
        C1[Simple FAQ with static answers]
        C2[Creative writing without actions]
        C3[Brainstorming with no external data]
        C4[Single-turn classification or routing]
    end

    subgraph AntiPatterns["Anti-Patterns - Do Not Agentize"]
        A1[Simple lookup - weather time conversion]
        A2[Static content - company policy PDF]
        A3[Low stakes creative - poem ideas]
        A4[When latency cost exceeds value]
    end

    subgraph Decision["Build Decision Checklist"]
        D1[Need live or private data?]
        D2[Need multi-step actions?]
        D3[Need side effects in systems?]
        D4[Need verification or citations?]
        D5[If 2+ yes - build an agent]
    end

    W --> Limits
    W --> Solutions
    W --> UseCases
    W --> ChatbotOK
    W --> AntiPatterns
    W --> Decision
    L1 -.-> S1
    L2 -.-> S2
    L3 -.-> S3
    L4 -.-> S4
    L5 -.-> S6`,
      `class W hub
    class L1,L2,L3,L4,L5,L6,L7,L8 grp1
    class S1,S2,S3,S4,S5,S6,S7 grp2
    class U1,U2,U3,U4,U5,U6,U7 grp3
    class C1,C2,C3,C4 grp4
    class A1,A2,A3,A4 grp5
    class D1,D2,D3,D4,D5 grp6`
    ),
    workflowDiagrams: [
      {
        title: "Agent vs Chatbot Decision",
        caption: "Use this flow when scoping a new AI feature.",
        chart: pastelChart(
          `flowchart TD
    Start[New AI Feature Request] --> Q1{Needs live or private data?}
    Q1 -->|no| Q2{Needs multi-step actions?}
    Q1 -->|yes| AG[Build Agent with tools]
    Q2 -->|no| Q3{Needs side effects?}
    Q2 -->|yes| AG
    Q3 -->|no| CB[Chatbot or RAG only]
    Q3 -->|yes| AG
    AG --> RAG[Add RAG if knowledge-heavy]
    AG --> LOOP[Add bounded agent loop]`,
          `class Start hub
    class AG grp1
    class CB grp2`
        ),
      },
    ],
    revisionNotes: {
      cheatSheet: [
        "LLM alone cannot act on the world",
        "Tools = live data and side effects",
        "Loops = multi-step reasoning",
        "RAG = reduce hallucinations",
        "Use chatbot when no tools needed",
      ],
    },
  })),

  "anatomy-of-an-agent": createLesson(withAgentPractice("anatomy-of-an-agent", {
    visualFirst: true,
    concept: b(
      "Brain = LLM plus system prompt and planning strategy",
      "Senses = inputs from user, files, webhooks",
      "Hands = tool registry with schemas and permissions",
      "Memory = working buffer plus vector long-term store",
      "Nervous system = runtime, retries, routing, HITL"
    ),
    whyItExists:
      "Treating agents as just a prompt misses tool routing, recovery, and observability — demos break in production.",
    analogy:
      "Brain judges, senses perceive, hands act, notebook remembers, manager orchestrates policy.",
    diagram: pastelChart(
      `flowchart TD
    AN([Anatomy of an Agent - Full Layer Map])

    subgraph Brain["Brain - LLM Layer"]
        B1[System prompt - behavior rules persona]
        B2[Reasoning - CoT ReAct planning ToT]
        B3[Model selection - fast vs reasoning o1]
        B4[Token budget per step]
        B5[Structured output - JSON tool calls]
        B6[Temperature and sampling controls]
    end

    subgraph Senses["Senses - Input Layer"]
        S1[User messages and chat history]
        S2[File uploads PDF images code]
        S3[Webhooks and event triggers]
        S4[Tool results as observations]
        S5[Environment state - DB row counts]
        S6[Multimodal - vision audio input]
    end

    subgraph Hands["Hands - Tool Layer"]
        H1[Tool registry - name schema handler]
        H2[Function calling - JSON arguments]
        H3[Permissions - allowlist per tool]
        H4[Validation - schema check before run]
        H5[External APIs DB search browser code]
        H6[MCP servers - standardized tool protocol]
        H7[Parallel vs sequential execution]
    end

    subgraph Memory["Memory Layer"]
        M1[Working - current context window]
        M2[Short-term - session buffer]
        M3[Long-term - vector DB or KV store]
        M4[Episodic - past task reflections]
        M5[Compression - summarize old history]
        M6[Retrieval - RAG at each step]
    end

    subgraph Runtime["Nervous System - Runtime"]
        R1[Orchestration loop controller]
        R2[Retry and backoff on failures]
        R3[Parallel vs sequential tools]
        R4[Human-in-the-loop gates]
        R5[Tracing LangSmith OpenTelemetry]
        R6[Cost and latency tracking]
        R7[Streaming steps to user UI]
    end

    subgraph State["Shared State Object"]
        ST1[messages array - conversation]
        ST2[tool_results - latest observations]
        ST3[plan - current step list]
        ST4[metadata - user id session id]
        ST5[checkpoints - resume after crash]
    end

    AN --> Brain
    AN --> Senses
    AN --> Hands
    AN --> Memory
    AN --> Runtime
    AN --> State
    Senses --> Brain
    Brain --> Hands
    Hands --> Memory
    Memory --> Brain
    Runtime --> Brain`,
      `class AN hub
    class B1,B2,B3,B4,B5,B6 grp1
    class S1,S2,S3,S4,S5,S6 grp2
    class H1,H2,H3,H4,H5,H6,H7 grp3
    class M1,M2,M3,M4,M5,M6 grp4
    class R1,R2,R3,R4,R5,R6,R7 grp5
    class ST1,ST2,ST3,ST4,ST5 grp6`
    ),
    workflowDiagrams: [
      {
        title: "Data Flow Through Layers",
        caption: "One iteration: senses feed brain, brain selects hands, hands update memory.",
        chart: pastelChart(
          `flowchart LR
    IN[User plus Tool Results] --> S[Senses Layer]
    S --> B[Brain - LLM Reasoning]
    B --> H[Hands - Tool Execution]
    H --> M[Memory Update]
    M --> RT[Runtime - step counter trace]
    RT --> B`,
          `class IN hub
    class S,B,H,M,RT grp1`
        ),
      },
    ],
    revisionNotes: {
      cheatSheet: [
        "5 layers: brain senses hands memory runtime",
        "Each layer independently testable",
        "Tool registry = schemas + permissions",
        "Memory tiers: working short long episodic",
        "Runtime handles retries and HITL",
      ],
    },
  })),

  "agent-lifecycle": createLesson(withAgentPractice("agent-lifecycle", {
    visualFirst: true,
    concept: b(
      "Design: goals, tools, metrics, success criteria",
      "Develop: prompts, integrations, tracing",
      "Evaluate: golden sets, red-teaming, regression",
      "Deploy: monitoring, canaries, scaling",
      "Iterate: feedback, drift detection, improvements"
    ),
    whyItExists:
      "Agents degrade from model updates and prompt drift — lifecycle discipline keeps them reliable over months.",
    analogy:
      "Like a satellite: design, build, test, launch, monitor telemetry, patch from orbit.",
    diagram: pastelChart(
      `flowchart TD
    LC([Agent Lifecycle - Full Map])

    subgraph Design["1. Design Phase"]
        D1[Define user stories and goals]
        D2[Select tools and data sources]
        D3[Set success metrics and eval criteria]
        D4[Architecture - ReAct vs LangGraph vs supervisor]
        D5[Risk assessment - HITL requirements]
        D6[Define failure modes and fallbacks]
        D7[Cost and latency budgets per task]
    end

    subgraph Develop["2. Develop Phase"]
        DEV1[System prompt engineering]
        DEV2[Tool integration and JSON schemas]
        DEV3[Memory and retrieval setup]
        DEV4[Tracing - LangSmith Braintrust]
        DEV5[Prototype on golden tasks]
        DEV6[Local dev with mock tools]
        DEV7[Version control prompts in Git]
    end

    subgraph Evaluate["3. Evaluate Phase"]
        E1[Golden dataset - fixed test cases]
        E2[Trajectory evaluation - right steps?]
        E3[Red-teaming - jailbreak injection]
        E4[Regression suite on every change]
        E5[Cost and latency benchmarks]
        E6[Human eval rubric for quality]
        E7[A/B test prompt variants]
    end

    subgraph Deploy["4. Deploy Phase"]
        DEP1[Staging environment testing]
        DEP2[Canary rollout - small traffic percent]
        DEP3[Production monitoring dashboards]
        DEP4[Alert on tool failure rate spikes]
        DEP5[Version prompts and tool configs]
        DEP6[Feature flags for new tools]
        DEP7[Rollback plan documented]
    end

    subgraph Iterate["5. Iterate Phase"]
        I1[Collect user feedback and failures]
        I2[Analyze failure logs and traces]
        I3[Update eval set with new edge cases]
        I4[Prompt and tool improvements]
        I5[Re-deploy with regression pass]
    end

    LC --> Design
    Design --> Develop
    Develop --> Evaluate
    Evaluate --> Deploy
    Deploy --> Iterate
    Iterate -.-> Develop`,
      `class LC hub
    class D1,D2,D3,D4,D5,D6,D7 grp1
    class DEV1,DEV2,DEV3,DEV4,DEV5,DEV6,DEV7 grp2
    class E1,E2,E3,E4,E5,E6,E7 grp3
    class DEP1,DEP2,DEP3,DEP4,DEP5,DEP6,DEP7 grp4
    class I1,I2,I3,I4,I5 grp5`
    ),
    workflowDiagrams: [
      {
        title: "Lifecycle Flow",
        caption: "Linear path with feedback loop from production failures back to develop.",
        chart: pastelChart(
          `flowchart LR
    D[Design] --> DV[Develop]
    DV --> EV[Evaluate]
    EV --> DP[Deploy]
    DP --> IT[Iterate]
    IT -->|failures found| DV`,
          `class D hub
    class DV,EV,DP,IT grp1`
        ),
      },
    ],
    revisionNotes: {
      cheatSheet: [
        "Design metrics before building",
        "Trace from day one in develop",
        "Eval suite before production",
        "Canary deploy then full rollout",
        "Iterate from failure logs",
      ],
    },
  })),

  "core-concepts": createLesson(withAgentPractice("core-concepts", {
    visualFirst: true,
    concept: b(
      "Perception-action: observe think act repeat",
      "Planning: ReAct interleaved or plan-and-execute upfront",
      "Memory: working episodic semantic tiers",
      "Multi-agent: supervisor delegates to workers",
      "HITL: human approval on high-stakes actions"
    ),
    whyItExists:
      "Shared vocabulary lets you evaluate any framework critically instead of following hype.",
    analogy:
      "Core concepts are chess pieces — once you know how each moves, you can play on any board.",
    diagram: pastelChart(
      `flowchart TD
    CC([Core Agent Concepts])

    subgraph Loop["Perception-Action Loop"]
        LP1[Observe - gather current state]
        LP2[Think - LLM reasons about next step]
        LP3[Act - call tool or respond]
        LP4[Observe result - tool output]
        LP5[Repeat until goal or limit]
    end

    subgraph Planning["Planning Patterns"]
        PL1[ReAct - interleave thought and action]
        PL2[Plan-and-Execute - plan first then run]
        PL3[Hierarchical - sub-plans per step]
        PL4[Re-planning - adjust on failure]
        PL5[Router - pick specialist per step]
    end

    subgraph Memory["Memory Tiers"]
        ME1[Working - in context window now]
        ME2[Short-term - session conversation]
        ME3[Long-term - vector store facts]
        ME4[Episodic - past task experiences]
        ME5[Semantic - extracted knowledge graph]
    end

    subgraph MultiAgent["Multi-Agent Patterns"]
        MA1[Supervisor routes to workers]
        MA2[Specialist agents per domain]
        MA3[Shared memory or message bus]
        MA4[Parallel workers on subtasks]
    end

    subgraph Safety["Safety and Control"]
        SA1[Human-in-the-loop approval gates]
        SA2[Guardrails - input output filters]
        SA3[Tool allowlists and sandboxes]
        SA4[Max steps timeout cost limits]
        SA5[PII redaction before LLM call]
        SA6[Audit log all tool invocations]
    end

    subgraph Reasoning["Reasoning Techniques"]
        RE1[Chain-of-Thought - think step by step]
        RE2[ReAct - Thought Action Observation]
        RE3[Self-ask - sub-questions before act]
        RE4[Tree-of-Thoughts - branch exploration]
        RE5[Reasoning models - o1 o3 DeepSeek-R1]
        RE6[Budget tokens for reasoning traces]
    end

    CC --> Loop
    CC --> Planning
    CC --> Memory
    CC --> MultiAgent
    CC --> Safety
    CC --> Reasoning`,
      `class CC hub
    class LP1,LP2,LP3,LP4,LP5 grp1
    class PL1,PL2,PL3,PL4,PL5 grp2
    class ME1,ME2,ME3,ME4,ME5 grp3
    class MA1,MA2,MA3,MA4 grp4
    class SA1,SA2,SA3,SA4,SA5,SA6 grp5
    class RE1,RE2,RE3,RE4,RE5,RE6 grp6`
    ),
    workflowDiagrams: [
      {
        title: "Perception-Action Loop",
        caption: "The fundamental cycle every agent architecture implements.",
        chart: pastelChart(
          `flowchart TD
    O[Observe State] --> T[Think - LLM Reason]
    T --> A[Act - Tool or Answer]
    A --> OB[Observe Result]
    OB --> T
    T -->|done| F[Final Output]`,
          `class O hub
    class T,A,OB grp1
    class F grp2`
        ),
      },
    ],
    revisionNotes: {
      cheatSheet: [
        "ReAct = think + act each step",
        "Plan-execute = plan upfront",
        "Memory tiers serve different horizons",
        "Supervisor = router to specialists",
        "HITL for destructive actions",
      ],
    },
  })),

  "agent-capabilities": createLesson(withAgentPractice("agent-capabilities", {
    visualFirst: true,
    concept: b(
      "Capabilities = concrete skills not vague AI magic",
      "L1 single tool single turn",
      "L2 multi-tool multi-turn loop",
      "L3 autonomous planning with recovery",
      "L4 multi-agent long-horizon tasks"
    ),
    whyItExists:
      "Capability mapping prevents over-promising and guides tool design and evaluation.",
    analogy:
      "Capabilities are the job description skill section — list what the hire can actually do.",
    diagram: pastelChart(
      `flowchart TD
    CAP([Agent Capabilities Map])

    subgraph Types["Capability Types"]
        T1[Reasoning - CoT decomposition logic]
        T2[Retrieval - RAG search embeddings]
        T3[Code execution - run scripts safely]
        T4[Web browsing - Playwright scrape]
        T5[API integration - REST GraphQL]
        T6[Multimodal - images PDFs audio]
        T7[Planning - multi-step roadmaps]
    end

    subgraph L1["L1 - Basic"]
        A1[Single tool single turn]
        A2[Example: calculator or weather lookup]
        A3[No loop required]
    end

    subgraph L2["L2 - Intermediate"]
        B1[Multi-tool agent loop]
        B2[Example: search then summarize]
        B3[Stop conditions and max steps]
    end

    subgraph L3["L3 - Advanced"]
        C1[Autonomous planning and recovery]
        C2[Re-plan on tool failure]
        C3[Example: research report generation]
    end

    subgraph L4["L4 - Expert"]
        D1[Multi-agent coordination]
        D2[Long-horizon tasks hours or days]
        D3[Example: software engineering agent]
        D4[Swarm and debate patterns]
    end

    subgraph Eval["Evaluation Per Tier"]
        EV1[L1 - tool call accuracy single shot]
        EV2[L2 - task completion rate multi-step]
        EV3[L3 - plan adherence and recovery]
        EV4[L4 - end-to-end project success]
        EV5[Trajectory match - right steps taken?]
        EV6[Cost per successful task]
    end

    CAP --> Types
    CAP --> L1
    CAP --> L2
    CAP --> L3
    CAP --> L4
    CAP --> Eval`,
      `class CAP hub
    class T1,T2,T3,T4,T5,T6,T7 grp1
    class A1,A2,A3 grp2
    class B1,B2,B3 grp3
    class C1,C2,C3 grp4
    class D1,D2,D3,D4 grp5
    class EV1,EV2,EV3,EV4,EV5,EV6 grp6`
    ),
    workflowDiagrams: [
      {
        title: "Capability Tier Ladder",
        caption: "Start at L1 and only climb when evals prove reliability at each level.",
        chart: pastelChart(
          `flowchart BT
    L1[L1 Single Tool] --> L2[L2 Multi-Tool Loop]
    L2 --> L3[L3 Plan and Recover]
    L3 --> L4[L4 Multi-Agent]`,
          `class L1 hub
    class L2,L3,L4 grp1`
        ),
      },
    ],
    revisionNotes: {
      cheatSheet: [
        "Map capabilities before building",
        "Match evals to each tier",
        "L1 = one shot tool",
        "L3 = plan and recover",
        "L4 = multi-agent horizon",
      ],
    },
  })),

  "types-of-agents": createLesson(withAgentPractice("types-of-agents", {
    visualFirst: true,
    concept: b(
      "Reactive: input LLM output no tools",
      "Conversational: chat plus memory buffer",
      "Task-oriented: tool loop with stop rules",
      "Deliberative: planner then executor",
      "Multi-agent: supervisor plus workers"
    ),
    whyItExists:
      "Wrong agent type wastes effort — a FAQ bot does not need a 12-node LangGraph.",
    analogy:
      "Bicycle for short trips, truck for hauling, fleet for logistics.",
    diagram: pastelChart(
      `flowchart TD
    TA([Types of Agents])

    subgraph Reactive["Reactive Agents"]
        R1[Input to LLM to output]
        R2[No tools no memory persistence]
        R3[Use: classification routing simple Q and A]
    end

    subgraph Conversational["Conversational Agents"]
        C1[Chat with memory buffer]
        C2[Multi-turn context maintained]
        C3[Use: support FAQ coaching bots]
    end

    subgraph Task["Task-Oriented Agents"]
        T1[Tool loop with stop conditions]
        T2[ReAct or function calling]
        T3[Use: research booking data tasks]
    end

    subgraph Deliberative["Deliberative Agents"]
        D1[Planner generates full plan first]
        D2[Executor runs steps sequentially]
        D3[Use: reports pipelines workflows]
    end

    subgraph Multi["Multi-Agent Systems"]
        M1[Supervisor routes to specialists]
        M2[Coder researcher reviewer roles]
        M3[Use: complex projects SWE research]
        M4[CrewAI role-based crews]
        M5[Debate - agents argue then synthesize]
    end

    subgraph Hybrid["Hybrid Patterns in Production"]
        HY1[Chat plus tools - FAQ escalates to agent]
        HY2[Planner plus ReAct executor]
        HY3[Router picks agent type per query]
        HY4[Human takeover mid-loop]
    end

    subgraph Pick["How to Choose"]
        P1[Simple lookup - reactive or chat]
        P2[Multi-step known tools - task agent]
        P3[Complex dependencies - deliberative]
        P4[Large scope - multi-agent]
        P5[Start simple upgrade when evals fail]
    end

    TA --> Reactive
    TA --> Conversational
    TA --> Task
    TA --> Deliberative
    TA --> Multi
    TA --> Hybrid
    TA --> Pick`,
      `class TA hub
    class R1,R2,R3 grp1
    class C1,C2,C3 grp2
    class T1,T2,T3 grp3
    class D1,D2,D3 grp4
    class M1,M2,M3,M4,M5 grp5
    class HY1,HY2,HY3,HY4 grp6
    class P1,P2,P3,P4,P5 grp1`
    ),
    workflowDiagrams: [
      {
        title: "Agent Type Selection",
        caption: "Match complexity to agent type — avoid over-engineering.",
        chart: pastelChart(
          `flowchart TD
    Q[Task Complexity] --> R{Single turn?}
    R -->|yes| RE[Reactive Agent]
    R -->|no| T{Needs tools?}
    T -->|no| CO[Conversational plus Memory]
    T -->|yes| P{Known step sequence?}
    P -->|yes| DE[Deliberative Plan-Execute]
    P -->|no| TA[Task-Oriented ReAct]
    TA --> M{Scope too large?}
    M -->|yes| MA[Multi-Agent Supervisor]`,
          `class Q hub
    class RE,CO,DE,TA,MA grp1`
        ),
      },
    ],
    revisionNotes: {
      cheatSheet: [
        "Match type to task complexity",
        "Reactive = no tools",
        "Task-oriented = tool loop",
        "Deliberative = plan first",
        "Hybrid architectures common",
      ],
    },
  })),

  "agent-architectures": createLesson(withAgentPractice("agent-architectures", {
    visualFirst: true,
    concept: b(
      "ReAct: simplest loop one LLM call per step",
      "LangGraph: stateful graph conditional edges checkpoints",
      "Supervisor: router LLM delegates to specialists",
      "Pipeline: fixed stages retrieve plan execute verify"
    ),
    whyItExists:
      "Architecture drives debuggability, parallelism, and cost — tangled monoliths are hard to fix.",
    analogy:
      "Open studio vs office with departments vs assembly line — floor plan matters.",
    diagram: pastelChart(
      `flowchart TD
    AR([Agent Architectures])

    subgraph ReAct["ReAct Loop"]
        RE1[Thought - LLM reasoning step]
        RE2[Action - tool call selection]
        RE3[Observation - tool result]
        RE4[Repeat until final answer]
        RE5[Best for exploratory tasks]
    end

    subgraph LangGraph["LangGraph StateGraph"]
        LG1[Nodes - processing functions]
        LG2[Edges - fixed or conditional routes]
        LG3[State - shared data across nodes]
        LG4[Checkpoints - persist and resume]
        LG5[Human-in-the-loop interrupt points]
    end

    subgraph Supervisor["Supervisor Pattern"]
        SU1[Router LLM reads task]
        SU2[Delegates to worker agents]
        SU3[Workers: coder researcher critic]
        SU4[Supervisor synthesizes results]
    end

    subgraph Pipeline["Pipeline Pattern"]
        PI1[Stage 1 - retrieve context]
        PI2[Stage 2 - plan steps]
        PI3[Stage 3 - execute tools]
        PI4[Stage 4 - verify output]
        PI5[Fixed order predictable flow]
        PI6[ETL and report generation pipelines]
    end

    subgraph Other["Other Architectures"]
        OT1[Plan-and-Execute - planner plus executor]
        OT2[LLMCompiler - DAG parallel steps]
        OT3[BabyAGI - dynamic task queue]
        OT4[CrewAI - role-based agent crews]
        OT5[AutoGPT - goal-driven autonomous loop]
    end

    subgraph Choose["When to Use"]
        CH1[ReAct - debugging research unknown path]
        CH2[LangGraph - complex branching HITL]
        CH3[Supervisor - multi-domain tasks]
        CH4[Pipeline - ETL reports known flow]
        CH5[Plan-Execute - board reports workflows]
        CH6[LLMCompiler - parallel independent steps]
    end

    AR --> ReAct
    AR --> LangGraph
    AR --> Supervisor
    AR --> Pipeline
    AR --> Other
    AR --> Choose`,
      `class AR hub
    class RE1,RE2,RE3,RE4,RE5 grp1
    class LG1,LG2,LG3,LG4,LG5 grp2
    class SU1,SU2,SU3,SU4 grp3
    class PI1,PI2,PI3,PI4,PI5,PI6 grp4
    class OT1,OT2,OT3,OT4,OT5 grp5
    class CH1,CH2,CH3,CH4,CH5,CH6 grp6`
    ),
    workflowDiagrams: [
      {
        title: "ReAct Loop Detail",
        caption: "Thought Action Observation repeated until final answer.",
        chart: pastelChart(
          `flowchart TD
    Q[Query] --> TH[Thought - reason about state]
    TH --> AC[Action - select tool]
    AC --> OB[Observation - tool result]
    OB --> TH
    TH -->|done| AN[Final Answer]`,
          `class Q hub
    class TH,AC,OB grp1
    class AN grp2`
        ),
      },
      {
        title: "LangGraph State Machine",
        caption: "Nodes edges state and checkpoints for complex branching.",
        chart: pastelChart(
          `flowchart LR
    START --> plan[plan node]
    plan --> execute[execute node]
    execute --> route{route_fn}
    route -->|continue| execute
    route -->|human| hitl[HITL interrupt]
    hitl --> execute
    route -->|done| END`,
          `class START hub
    class plan,execute grp1
    class hitl grp2`
        ),
      },
    ],
    revisionNotes: {
      cheatSheet: [
        "ReAct = simple interpretable loop",
        "LangGraph = explicit state machine",
        "Supervisor = delegation pattern",
        "Pipeline = fixed stage order",
        "Pick based on task structure",
      ],
    },
  })),

  "agent-terminology": createLesson(withAgentPractice("agent-terminology", {
    visualFirst: true,
    concept: b(
      "Agent: LLM plus tools in autonomous loop",
      "Trajectory: full thought-action-observation sequence",
      "Episode: one task from start to finish",
      "Guardrails: safety filters on input and output"
    ),
    whyItExists:
      "Precise terms prevent miscommunication in teams, docs, and incident reports.",
    analogy:
      "Like learning repo, PR, and CI before contributing to a codebase.",
    diagram: pastelChart(
      `flowchart TD
    TM([Agent Terminology Map])

    subgraph Core["Core Terms"]
        C1[Agent - autonomous LLM plus tools]
        C2[Tool - external function with schema]
        C3[Action - tool invocation by LLM]
        C4[Observation - result returned to LLM]
        C5[Plan - ordered steps before execution]
    end

    subgraph LoopTerms["Loop and Trace Terms"]
        L1[Trajectory - full run log of steps]
        L2[Episode - single task start to end]
        L3[Step - one LLM call in loop]
        L4[Termination - done max steps error]
        L5[Grounding - answer tied to sources]
    end

    subgraph Production["Production Terms"]
        P1[Guardrails - input output safety]
        P2[HITL - human in the loop approval]
        P3[Eval - automated behavior tests]
        P4[Tracing - LangSmith OpenTelemetry]
        P5[Sandbox - isolated tool execution]
    end

    subgraph MemoryTerms["Memory Terms"]
        M1[Context window - working memory]
        M2[Buffer - short-term history]
        M3[Vector store - long-term retrieval]
        M4[Episodic - past interaction lessons]
        M5[RAG - retrieve augment generate]
        M6[Checkpoint - save resume state]
    end

    subgraph ArchTerms["Architecture Terms"]
        AT1[ReAct - reason and act interleaved]
        AT2[Plan-and-Execute - planner executor]
        AT3[Supervisor - router to workers]
        AT4[StateGraph - LangGraph nodes edges]
        AT5[MCP - Model Context Protocol]
        AT6[A2A - agent to agent protocol]
    end

    subgraph EvalTerms["Eval and Quality Terms"]
        ET1[Golden set - fixed test cases]
        ET2[Trajectory eval - step correctness]
        ET3[Red team - adversarial testing]
        ET4[Regression suite - CI for agents]
        ET5[Ground truth - expected answer]
    end

    TM --> Core
    TM --> LoopTerms
    TM --> Production
    TM --> MemoryTerms
    TM --> ArchTerms
    TM --> EvalTerms`,
      `class TM hub
    class C1,C2,C3,C4,C5 grp1
    class L1,L2,L3,L4,L5 grp2
    class P1,P2,P3,P4,P5 grp3
    class M1,M2,M3,M4,M5,M6 grp4
    class AT1,AT2,AT3,AT4,AT5,AT6 grp5
    class ET1,ET2,ET3,ET4,ET5 grp6`
    ),
    workflowDiagrams: [
      {
        title: "Agent Loop Vocabulary",
        caption: "Terms you will see in traces logs and incident reports.",
        chart: pastelChart(
          `flowchart LR
    EP[Episode] --> TR[Trajectory]
    TR --> ST[Step]
    ST --> AC[Action]
    AC --> OB[Observation]
    OB --> ST
    ST --> TE[Termination]`,
          `class EP hub
    class TR,ST,AC,OB,TE grp1`
        ),
      },
    ],
    revisionNotes: {
      cheatSheet: [
        "Trajectory = full debug log",
        "Episode = one complete task",
        "Observation = tool result",
        "Grounding = cite sources",
        "Eval = regression test suite",
      ],
    },
  })),

  "current-agent-landscape": createLesson(withAgentPractice("current-agent-landscape", {
    visualFirst: true,
    concept: b(
      "IDE agents: Cursor Devin — code and terminal",
      "Enterprise: Copilot Agentspace custom platforms",
      "Frameworks: LangGraph CrewAI OpenAI SDK",
      "Protocols: MCP for tools A2A for agents"
    ),
    whyItExists:
      "Knowing the landscape helps pick build vs buy and stay interoperable.",
    analogy:
      "Early cloud — AWS Azure GCP coexist; MCP is containers for tools.",
    diagram: pastelChart(
      `flowchart TD
    LS([2026 Agent Landscape])

    subgraph IDE["IDE and Coding Agents"]
        I1[Cursor - AI pair programmer]
        I2[Devin - autonomous SWE agent]
        I3[GitHub Copilot Workspace]
        I4[Windsurf Codeium agents]
    end

    subgraph Enterprise["Enterprise Platforms"]
        E1[Microsoft Copilot Studio]
        E2[Google Agentspace and ADK]
        E3[OpenAI Assistants API]
        E4[Salesforce Service Agent]
        E5[Custom internal agent platforms]
    end

    subgraph Frameworks["Open-Source Frameworks"]
        F1[LangGraph - stateful agent graphs]
        F2[CrewAI - role-based crews]
        F3[Microsoft Agent Framework]
        F4[OpenAI Agents SDK]
        F5[Claude Agent SDK]
        F6[PydanticAI smolagents Agno]
    end

    subgraph Protocols["Protocols and Standards"]
        P1[MCP - Agent to tools and data]
        P2[A2A - Agent to agent]
        P3[AG-UI - Agent to user]
        P4[OpenTelemetry - observability]
    end

    subgraph Trends["2026 Trends"]
        T1[Eval-driven development standard]
        T2[Smaller models for tool routing]
        T3[MCP adoption for integrations]
        T4[On-device and edge agents growing]
        T5[Reasoning models for planning step]
        T6[Agent marketplaces and tool stores]
    end

    subgraph BuildBuy["Build vs Buy Decision"]
        BB1[Buy - Copilot Cursor for coding]
        BB2[Buy - enterprise Copilot Studio]
        BB3[Build - custom domain workflows]
        BB4[Build - proprietary data and tools]
        BB5[Hybrid - framework plus custom tools]
    end

    subgraph MCPEco["MCP Ecosystem"]
        MC1[MCP server - exposes tools]
        MC2[MCP client - agent or IDE]
        MC3[Filesystem Git Slack DB servers]
        MC4[Standard replaces N custom integrations]
    end

    LS --> IDE
    LS --> Enterprise
    LS --> Frameworks
    LS --> Protocols
    LS --> Trends
    LS --> BuildBuy
    LS --> MCPEco`,
      `class LS hub
    class I1,I2,I3,I4 grp1
    class E1,E2,E3,E4,E5 grp2
    class F1,F2,F3,F4,F5,F6 grp3
    class P1,P2,P3,P4 grp4
    class T1,T2,T3,T4,T5,T6 grp5
    class BB1,BB2,BB3,BB4,BB5 grp6
    class MC1,MC2,MC3,MC4 grp7`
    ),
    workflowDiagrams: [
      {
        title: "MCP Tool Integration",
        caption: "How MCP standardizes tool access across agents and IDEs.",
        chart: pastelChart(
          `flowchart LR
    AG[Agent or IDE] --> CL[MCP Client]
    CL --> S1[CRM MCP Server]
    CL --> S2[Git MCP Server]
    CL --> S3[DB MCP Server]
    S1 --> API1[External API]
    S2 --> API2[GitHub API]
    S3 --> API3[Postgres]`,
          `class AG hub
    class CL grp1
    class S1,S2,S3 grp2`
        ),
      },
    ],
    revisionNotes: {
      cheatSheet: [
        "MCP = standard tool layer",
        "LangGraph = graph orchestration",
        "Eval before every deploy",
        "Build vs buy per use case",
        "Watch protocol standards",
      ],
    },
  })),

  planning: createLesson(withAgentPractice("planning", {
    visualFirst: true,
    concept: b(
      "Planning decomposes goals into ordered steps before acting",
      "Approaches: LLM plan hierarchical re-plan plan-and-execute",
      "Plan format: step tool dependencies expected output",
      "Validate plans and allow human review for risky tasks"
    ),
    whyItExists:
      "Without planning, agents wander, repeat work, and miss step dependencies.",
    analogy:
      "Trip planning: flights first, then hotel, then car — not random bookings.",
    diagram: pastelChart(
      `flowchart TD
    PL([Planning - Full Map])

    subgraph Approaches["Planning Approaches"]
        A1[LLM single-call plan generation]
        A2[Hierarchical - high level then sub-plans]
        A3[Re-planning - revise after each failure]
        A4[Plan-and-Execute - separate planner executor]
        A5[ReAct - plan implicitly each step]
        A6[LLMCompiler - DAG parallel execution]
        A7[BabyAGI - dynamic task queue generation]
    end

    subgraph PlanFormat["Plan Structure - JSON Schema"]
        F1[step id and description]
        F2[tool assignment per step]
        F3[depends_on - dependency graph]
        F4[expected_output per step]
        F5[estimated cost and duration]
        F6[status - pending running done failed]
    end

    subgraph Validation["Plan Validation Before Execute"]
        V1[All referenced tools exist?]
        V2[No circular dependencies?]
        V3[Steps feasible given current state?]
        V4[Cost and step count within budget?]
        V5[Human review for high-stakes plans?]
    end

    subgraph Execution["Execution Flow"]
        E1[Validate plan - tools exist feasible]
        E2[Optional human approval gate]
        E3[Execute steps in dependency order]
        E4[Verify output matches expectation]
        E5[Re-plan remaining steps on failure]
        E6[Joiner synthesizes step results]
    end

    subgraph Compare["Plan vs ReAct"]
        C1[Plan - known multi-step workflows]
        C2[ReAct - exploratory unknown path]
        C3[Plan - report generation pipelines]
        C4[ReAct - debugging research tasks]
        C5[Hybrid - plan outline plus ReAct execute]
    end

    PL --> Approaches
    PL --> PlanFormat
    PL --> Validation
    PL --> Execution
    PL --> Compare
    Validation --> Execution`,
      `class PL hub
    class A1,A2,A3,A4,A5,A6,A7 grp1
    class F1,F2,F3,F4,F5,F6 grp2
    class V1,V2,V3,V4,V5 grp3
    class E1,E2,E3,E4,E5,E6 grp4
    class C1,C2,C3,C4,C5 grp5`
    ),
    workflowDiagrams: [
      {
        title: "Plan-Execute-Replan Loop",
        caption: "How planning interacts with execution and failure recovery.",
        chart: pastelChart(
          `flowchart TD
    G[User Goal] --> P[Planner LLM]
    P --> Plan[Numbered Step Plan]
    Plan --> V{Valid plan?}
    V -->|yes| H{Human approve?}
    H -->|yes| E[Execute Step N]
    H -->|no| P
    V -->|no| P
    E --> OK{Step success?}
    OK -->|yes| More{More steps?}
    More -->|yes| E
    More -->|no| J[Joiner - Final Answer]
    OK -->|no| RP[Re-plan remaining steps]
    RP --> E`,
          `class G hub
    class P,Plan,RP grp1
    class E,J grp2`
        ),
      },
      {
        title: "Hierarchical Planning",
        caption: "High-level plan decomposes into sub-plans per major step.",
        chart: pastelChart(
          `flowchart TD
    GOAL[Complex Goal] --> HP[High-Level Plan]
    HP --> S1[Step 1 Sub-Plan]
    HP --> S2[Step 2 Sub-Plan]
    HP --> S3[Step 3 Sub-Plan]
    S1 --> E1[Execute sub-steps]
    S2 --> E2[Execute sub-steps]
    S3 --> E3[Execute sub-steps]
    E1 --> DONE[Merge Results]
    E2 --> DONE
    E3 --> DONE`,
          `class GOAL hub
    class HP grp1
    class S1,S2,S3,E1,E2,E3 grp2
    class DONE grp3`
        ),
      },
    ],
    revisionNotes: {
      cheatSheet: [
        "Plan first for known workflows",
        "JSON plan with steps and tools",
        "Re-plan on failure always",
        "Human approve high-stakes plans",
        "ReAct for exploratory tasks",
      ],
    },
    commonMistakes: [
      "Rigid plan with no re-planning",
      "Over-planning simple one-step tasks",
      "No plan validation before execution",
    ],
  })),

  reflection: createLesson(withAgentPractice("reflection", {
    visualFirst: true,
    concept: b(
      "Reflection = agent reviews output before returning",
      "Self-critique: LLM checks quality and completeness",
      "Verifier: separate model judges primary output",
      "Reflexion: store lessons in memory for future tasks"
    ),
    whyItExists:
      "Agents make wrong tool args and incomplete answers — reflection catches errors early.",
    analogy:
      "Proofreading before send — catch mistakes while they are still cheap to fix.",
    diagram: pastelChart(
      `flowchart TD
    RF([Reflection - Full Map])

    subgraph Patterns["Reflection Patterns"]
        P1[Self-critique - same LLM reviews draft]
        P2[Verifier agent - separate judge model]
        P3[Reflexion - verbal lessons in memory]
        P4[Checklist validation - programmatic rules]
        P5[Multi-pass - draft refine finalize]
        P6[Self-consistency - multiple samples vote]
        P7[LATS - tree search with reflection]
    end

    subgraph Checks["What to Check"]
        C1[Claims supported by tool results?]
        C2[Hallucinations or invented facts?]
        C3[Task fully complete?]
        C4[Format and constraints met?]
        C5[Safety policy violations?]
        C6[Sources cited where required?]
        C7[Numeric accuracy verified?]
    end

    subgraph When["When to Reflect"]
        W1[Always - financial legal external comms]
        W2[Sometimes - analysis reports code]
        W3[Skip - simple lookups weather time]
        W4[Trigger on low confidence score]
    end

    subgraph Production["Production Notes"]
        PR1[Adds 1-2 LLM calls per task]
        PR2[Max retry limit after failed critique]
        PR3[Store insights in episodic memory]
        PR4[Log critique reasoning for debug]
        PR5[Use cheaper model for critique step]
        PR6[Separate verifier for high stakes]
    end

    subgraph VsCorrect["Reflection vs Self-Correction"]
        VC1[Reflection - review before return]
        VC2[Correction - fix during agent loop]
        VC3[Use both in production pipelines]
    end

    RF --> Patterns
    RF --> Checks
    RF --> When
    RF --> Production
    RF --> VsCorrect`,
      `class RF hub
    class P1,P2,P3,P4,P5,P6,P7 grp1
    class C1,C2,C3,C4,C5,C6,C7 grp2
    class W1,W2,W3,W4 grp3
    class PR1,PR2,PR3,PR4,PR5,PR6 grp4
    class VC1,VC2,VC3 grp5`
    ),
    workflowDiagrams: [
      {
        title: "Self-Critique Loop",
        caption: "Draft critique revise until quality passes or max retries.",
        chart: pastelChart(
          `flowchart TD
    D[Draft Answer] --> C[Critique LLM]
    C --> Q{Quality OK?}
    Q -->|no| R[Revise with feedback]
    R --> D
    Q -->|yes| OUT[Return to User]
    C -->|max retries| ESC[Escalate or Best Effort]`,
          `class D hub
    class C,R grp1
    class OUT,ESC grp2`
        ),
      },
    ],
    revisionNotes: {
      cheatSheet: [
        "Reflect on high-stakes outputs",
        "Self-critique vs verifier agent",
        "Skip for simple lookups",
        "Max retry after failed critique",
        "Reflexion stores lessons",
      ],
    },
  })),

  "multi-tool": createLesson(withAgentPractice("multi-tool", {
    visualFirst: true,
    concept: b(
      "Real tasks need search SQL email code in one workflow",
      "Tool registry holds schemas handlers permissions",
      "Router LLM selects tool per step",
      "Run independent tools in parallel when possible"
    ),
    whyItExists:
      "Single-tool agents cannot complete real workflows that span systems.",
    analogy:
      "Swiss Army knife — one agent, many specialized blades for different jobs.",
    diagram: pastelChart(
      `flowchart TD
    MT([Multi-Tool Orchestration])

    subgraph Registry["Tool Registry"]
        R1[Register name description schema]
        R2[Handler function or API client]
        R3[Permissions - who can call what]
        R4[Rate limits per tool]
        R5[Version and deprecation tracking]
        R6[OpenAI function vs Anthropic tool format]
    end

    subgraph Selection["Tool Selection"]
        S1[LLM reads tool descriptions]
        S2[Function calling API returns choice]
        S3[Router pattern for many tools 50+]
        S4[Dynamic load tools per task type]
        S5[Embedding-based tool retrieval]
        S6[Two-stage - retrieve then select]
    end

    subgraph Execution["Execution Modes"]
        E1[Sequential - output feeds next tool]
        E2[Parallel - independent tools at once]
        E3[Conditional - if search fails try cache]
        E4[Fan-out fan-in - map reduce pattern]
        E5[MCP server - standardized tool host]
    end

    subgraph Errors["Error Handling"]
        ER1[Validate JSON args before call]
        ER2[Catch exceptions feed back to LLM]
        ER3[Retry with backoff on transient fail]
        ER4[Fallback tool or cached data]
        ER5[Timeout per tool invocation]
    end

    subgraph Examples["Real Multi-Tool Workflows"]
        EX1[Research - search summarize save email]
        EX2[Support - CRM lookup ticket update reply]
        EX3[Data - SQL chart Slack notify]
        EX4[Dev - read file run tests commit push]
    end

    MT --> Registry
    MT --> Selection
    MT --> Execution
    MT --> Errors
    MT --> Examples`,
      `class MT hub
    class R1,R2,R3,R4,R5,R6 grp1
    class S1,S2,S3,S4,S5,S6 grp2
    class E1,E2,E3,E4,E5 grp3
    class ER1,ER2,ER3,ER4,ER5 grp4
    class EX1,EX2,EX3,EX4 grp5`
    ),
    workflowDiagrams: [
      {
        title: "Parallel vs Sequential Tools",
        caption: "Run independent tools in parallel to cut latency.",
        chart: pastelChart(
          `flowchart TD
    LLM[LLM selects tools] --> IND{Independent?}
    IND -->|yes| PAR[Parallel Execute]
    IND -->|no| SEQ[Sequential Execute]
    PAR --> MERGE[Merge Results]
    SEQ --> NEXT[Next depends on output]
    MERGE --> LLM
    NEXT --> LLM`,
          `class LLM hub
    class PAR,SEQ,MERGE,NEXT grp1`
        ),
      },
    ],
    revisionNotes: {
      cheatSheet: [
        "Registry = schema + handler + permissions",
        "Parallel when tools independent",
        "Feed errors back to LLM",
        "Validate args before execute",
        "Rate limit expensive tools",
      ],
    },
  })),

  "self-correction": createLesson(withAgentPractice("self-correction", {
    visualFirst: true,
    concept: b(
      "Self-correction detects and fixes errors inside the loop",
      "Programmatic checks: empty results bad format",
      "LLM critique: answer complete and grounded?",
      "Retry with fix context max 3-5 attempts"
    ),
    whyItExists:
      "First attempts often fail — correction improves reliability without humans.",
    analogy:
      "Spell-check while typing — fix before the message ships.",
    diagram: pastelChart(
      `flowchart TD
    SC([Self-Correction Map])

    subgraph Detect["Error Detection"]
        D1[Tool returned error or empty]
        D2[Output fails schema validation]
        D3[LLM flags low confidence answer]
        D4[Programmatic fact check failed]
        D5[User constraint violated]
        D6[Assertion on expected fields]
        D7[Regex or JSON schema validator]
    end

    subgraph Fix["Correction Strategies"]
        F1[Re-prompt with error message]
        F2[Try alternative tool or params]
        F3[Simplify subtask and retry]
        F4[Ask clarifying question to user]
        F5[Escalate to human after max retries]
        F6[Switch model for retry attempt]
    end

    subgraph Loop["Correction Inside Agent Loop"]
        L1[Execute tool]
        L2[Check result]
        L3{Error detected?}
        L3 -->|yes| L4[Append error to messages]
        L4 --> L5[LLM picks fix strategy]
        L5 --> L1
        L3 -->|no| L6[Continue loop]
    end

    subgraph VsReflect["Correction vs Reflection"]
        V1[Correction - fix during loop]
        V2[Reflection - review before return]
        V3[Both used together in production]
    end

    subgraph Limits["Safety Limits"]
        LIM1[Max retries - typically 3 to 5]
        LIM2[Cost cap on correction attempts]
        LIM3[Log every correction for eval]
        LIM4[Do not infinite loop on same error]
        LIM5[Same-error counter triggers escalate]
    end

    SC --> Detect
    SC --> Fix
    SC --> Loop
    SC --> VsReflect
    SC --> Limits`,
      `class SC hub
    class D1,D2,D3,D4,D5,D6,D7 grp1
    class F1,F2,F3,F4,F5,F6 grp2
    class L1,L2,L3,L4,L5,L6 grp3
    class V1,V2,V3 grp4
    class LIM1,LIM2,LIM3,LIM4,LIM5 grp5`
    ),
    workflowDiagrams: [
      {
        title: "Self-Correction Loop",
        caption: "Detect error feed back to LLM retry with fix context.",
        chart: pastelChart(
          `flowchart TD
    ACT[Execute Action] --> RES[Tool Result]
    RES --> CHK{Valid result?}
    CHK -->|no| ERR[Append Error to Context]
    ERR --> LLM[LLM Diagnoses Fix]
    LLM --> RETRY{Retries left?}
    RETRY -->|yes| ACT
    RETRY -->|no| ESC[Escalate to Human]
    CHK -->|yes| NEXT[Continue Agent Loop]`,
          `class ACT hub
    class ERR,LLM grp1
    class NEXT,ESC grp2`
        ),
      },
    ],
    revisionNotes: {
      cheatSheet: [
        "Detect → diagnose → retry",
        "Cap retries at 3-5",
        "Feed error text back to LLM",
        "Log every correction attempt",
        "Escalate when stuck",
      ],
    },
  })),

  "build-first-ai-agent": createLesson(withAgentPractice("build-first-ai-agent", {
    visualFirst: true,
    concept: b(
      "Minimal agent: one LLM two tools while-loop logs",
      "Steps: goal prompt schemas loop max steps",
      "Learn failure modes before using frameworks",
      "Completable in one afternoon with OpenAI API"
    ),
    whyItExists:
      "Building reveals infinite loops, bad args, and context overflow that reading cannot teach.",
    analogy:
      "Hello World for agents — small, ugly, foundation for everything after.",
    diagram: pastelChart(
      `flowchart TD
    BF([Build Your First Agent])

    subgraph Prereq["Prerequisites"]
        PR1[Python 3.10+ and venv]
        PR2[OpenAI or Anthropic API key in .env]
        PR3[Basic HTTP and JSON knowledge]
        PR4[pip install openai python-dotenv]
    end

    subgraph Steps["Build Steps"]
        S1[1 - Define goal and success criteria]
        S2[2 - Write system prompt with rules]
        S3[3 - Define 2-3 tools with JSON schema]
        S4[4 - Implement tool handler functions]
        S5[5 - Build while-loop agent runner]
        S6[6 - Append tool results to messages]
        S7[7 - Add max_steps and logging]
        S8[8 - Test on 5 example queries]
    end

    subgraph Tools["Starter Tools"]
        T1[web_search - query returns snippets]
        T2[calculator - safe math eval]
        T3[optional: read_file or get_time]
    end

    subgraph Failures["Failures You Will Hit"]
        F1[Infinite loop - fix with max_steps]
        F2[Bad tool JSON args - add validation]
        F3[Context overflow - trim old messages]
        F4[Wrong tool selected - improve descriptions]
        F5[API rate limits - add retry backoff]
        F6[Tool timeout - set per-tool limits]
        F7[Hallucinated tool names - strict registry]
    end

    subgraph Project["Project Structure"]
        PJ1[agent.py - main loop runner]
        PJ2[tools.py - tool definitions handlers]
        PJ3[prompts.py - system prompt templates]
        PJ4[config.py - max_steps model name]
        PJ5[.env - API keys never commit]
        PJ6[tests/ - golden query test cases]
    end

    BF --> Prereq
    BF --> Steps
    BF --> Tools
    BF --> Failures
    BF --> Project`,
      `class BF hub
    class PR1,PR2,PR3,PR4 grp1
    class S1,S2,S3,S4,S5,S6,S7,S8 grp2
    class T1,T2,T3 grp3
    class F1,F2,F3,F4,F5,F6,F7 grp4
    class PJ1,PJ2,PJ3,PJ4,PJ5,PJ6 grp5`
    ),
    workflowDiagrams: [
      {
        title: "Minimal Agent Loop",
        caption: "The while-loop every framework implements under the hood.",
        chart: pastelChart(
          `flowchart TD
    Start[User Goal] --> Init[Init messages and tools]
    Init --> Loop{step less than max?}
    Loop -->|yes| LLM[Call LLM with tools]
    LLM --> TC{Tool calls?}
    TC -->|yes| Run[Execute each tool]
    Run --> Append[Append results to messages]
    Append --> Inc[step plus 1]
    Inc --> Loop
    TC -->|no| Return[Return final answer]
    Loop -->|no| Stop[Return max steps reached]`,
          `class Start hub
    class LLM,Run,Append grp1
    class Return,Stop grp2`
        ),
      },
      {
        title: "File Layout",
        caption: "Recommended project structure for your first no-framework agent.",
        chart: pastelChart(
          `flowchart TD
    ROOT[project/] --> A[agent.py - loop]
    ROOT --> T[tools.py - handlers]
    ROOT --> P[prompts.py]
    ROOT --> C[config.py]
    ROOT --> E[.env]
    ROOT --> TS[tests/test_agent.py]`,
          `class ROOT hub
    class A,T,P,C,E,TS grp1`
        ),
      },
    ],
    revisionNotes: {
      cheatSheet: [
        "2-3 tools max at first",
        "max_steps=10 always",
        "Log every iteration",
        "Validate tool JSON args",
        "No framework until loop works",
        "API key in .env never in code",
      ],
    },
    interviewQuestions: [
      iq("What belongs in a minimal first agent?", "LLM, 2-3 tools with schemas, while-loop, max iterations, logging.", "easy"),
    ],
  })),
};
