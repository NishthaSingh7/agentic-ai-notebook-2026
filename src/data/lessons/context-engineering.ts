import { createLesson, type LessonInput } from "./builder";
import { pastelChart } from "@/lib/mermaid-pastel";

function b(...lines: string[]) {
  return lines.map((l) => `- ${l}`).join("\n");
}

function visual(input: LessonInput) {
  return createLesson({
    ...input,
    visualFirst: true,
    practiceTask: "",
    code: undefined,
    codeLanguage: undefined,
  });
}

function trio(hub: string, a: string, b: string, c: string) {
  return pastelChart(
    `flowchart TD
    Hub([${hub}])
    A["${a}"]
    B["${b}"]
    C["${c}"]
    Hub --> A
    Hub --> B
    Hub --> C`,
    `class Hub hub
    class A grp1
    class B grp2
    class C grp3`
  );
}

function pack(
  slug: string,
  hub: string,
  lines: [string, string, string, string],
  why: string,
  analogy: string,
  extra: Partial<LessonInput> = {}
) {
  return [
    slug,
    visual({
      concept: b(...lines),
      whyItExists: why,
      analogy,
      analogyDiagram: trio(hub, lines[1].slice(0, 42), lines[2].slice(0, 42), lines[3].slice(0, 42)),
      diagram: trio(hub, "Include", "Drop", "Isolate"),
      workflowDiagrams: [
        {
          title: "This turn",
          caption: analogy,
          chart: trio("Turn", hub, "Pack", "Model"),
        },
      ],
      technicalExplanation: why,
      example: extra.example ?? `${hub}: pack only what this turn needs.`,
      commandsToRemember: extra.commandsToRemember ?? [lines[0], lines[1], lines[2], lines[3]],
      revisionNotes: { cheatSheet: extra.revisionNotes?.cheatSheet ?? [hub, "Budget", "Don't dump"] },
      glossary: extra.glossary ?? [hub],
      learnElsewhere: extra.learnElsewhere,
    }),
  ] as const;
}

export const contextEngineeringLessons: Record<string, ReturnType<typeof createLesson>> = Object.fromEntries([
  pack(
    "context-vs-prompt",
    "Context packet",
    [
      "Prompt engineering writes the instruction. Context engineering builds the packet the model sees this turn",
      "The packet is instructions + user + memory + retrieval + tools + state — assembled on purpose",
      "A great prompt in a polluted window still fails",
      "This is the discipline between memory and tool calling",
    ],
    "Agents do not send a static prompt. They construct a budgeted window every turn.",
    "Prompting is the recipe card. Context is packing the mise en place onto one cutting board.",
    {
      glossary: ["Context Engineering", "Context Packet"],
      learnElsewhere: ["Agent Memory — Phase 5", "Tool Calling — Phase 7"],
    }
  ),
  pack(
    "context-assembly",
    "Assembly",
    [
      "Assembly is the ordered packing of sections into one window",
      "Typical order: system, tool schemas, retrieved facts, memory, recent turns, live user",
      "Never drop the live user turn to save tokens",
      "Each section should have a hard cap",
    ],
    "Without an assembly plan, teams concatenate strings until the API errors.",
    "A bento box: compartments, not a blender."
  ),
  pack(
    "context-selection",
    "Selection",
    [
      "Selection chooses which memories and chunks are even candidates",
      "Filter by metadata, recency, and permission before you rank",
      "Empty selection is allowed — do not invent hits",
      "Fewer, better pieces beat a dump of forty maybe-relevant rows",
    ],
    "Ranking garbage still packs garbage.",
    "A librarian pulling three books, not wheeling the whole stack to your desk."
  ),
  pack(
    "context-compression",
    "Compression",
    [
      "Compression shrinks text to fit the budget while keeping ids, constraints, and decisions",
      "Lossy is fine for dumps; lossless for policy and identifiers",
      "Tool dumps are the first thing to compress",
      "Measure tokens before and after",
    ],
    "Windows are finite. Uncompressed traces push out the actual question.",
    "Highlighting a textbook vs photocopying every page."
  ),
  pack(
    "context-compaction",
    "Compaction",
    [
      "Compaction rewrites an old thread into a shorter running state",
      "It is summarization plus structured fields — not a vague paragraph",
      "A bad compaction is a false memory",
      "Keep a pointer to the raw log",
    ],
    "Long sessions cannot stay as raw turns. Compaction is how agents survive hour-long jobs.",
    "Meeting minutes with action items, not a transcript."
  ),
  pack(
    "context-isolation",
    "Isolation",
    [
      "Untrusted text must be fenced so it cannot override system rules",
      "Tool results, retrieved docs, and web pages are untrusted",
      "Use delimiters, roles, and treat that block as data not instructions",
      "Never concatenate untrusted text into the system prompt",
    ],
    "Prompt injection rides in retrieved content and tool output.",
    "A quarantine bag for mail. You read it; you do not let it rewrite the law.",
    { learnElsewhere: ["Prompt Injection — Phase 20"] }
  ),
  pack(
    "context-routing",
    "Routing",
    [
      "Routing sends different tasks to different context packs or models",
      "A refund pack is not a search pack",
      "Cheap model for classify, expensive model for the hard step",
      "Wrong pack is a silent failure",
    ],
    "One mega-context for every intent wastes tokens and leaks the wrong tools.",
    "Different briefings for legal vs support. Same company, different folders.",
    { learnElsewhere: ["Model Routing — Phase 21"] }
  ),
  pack(
    "context-windows",
    "Window",
    [
      "The window is a hard cap in tokens, not characters",
      "Models differ: know the limit of the model you actually call",
      "Reserve output tokens; input plus output must fit",
      "Overflow is a product decision, not a surprise 400",
    ],
    "Teams still count words and then hit context_length_exceeded.",
    "A suitcase with a weight limit. You weigh it before the airport."
  ),
  pack(
    "context-budgeting",
    "Budget",
    [
      "A budget assigns a token quota to each section",
      "Budgets change by task: coding vs support",
      "Track spend per section in logs",
      "When over, cut the lowest-priority section first",
    ],
    "Without a budget, conversation history eats retrieval, or tools eat the user question.",
    "A monthly envelope budget. Groceries cannot steal rent."
  ),
  pack(
    "tool-result-management",
    "Tool results",
    [
      "Tool results are data, often huge, and often hostile",
      "Parse, validate, trim, then pack a short observation",
      "Keep the raw result in a store keyed by call id",
      "Never paste a fifty-page HTML response into the next prompt",
    ],
    "Most context explosions are tool dumps, not user chat.",
    "A lab printout: pin the number on the board and file the forty pages.",
    { learnElsewhere: ["Tool Calling — Phase 7"] }
  ),
  pack(
    "memory-context-pipeline",
    "Pipeline",
    [
      "Memory is the store. Context is the pack for this call. They are two jobs",
      "Retrieve, rank, budget, assemble. Do not retrieve the whole store",
      "Write-back happens after the turn, not by stuffing the window",
      "Working memory is the pack itself",
    ],
    "Having a vector DB is not the same as the model seeing the right fact.",
    "Warehouse vs the shopping basket you carry to the counter.",
    { learnElsewhere: ["Agent Memory — Phase 5"] }
  ),
  pack(
    "long-running-context",
    "Long jobs",
    [
      "Jobs that last hours need checkpoints of context, not one giant prompt",
      "Each resume loads compacted state plus the next slice of work",
      "Durable runtimes store that state; you still design what is in it",
      "Do not replay the entire history on every resume",
    ],
    "Coding agents and research agents outlive a single HTTP request.",
    "A bookmark and a sticky note, not rereading the novel every morning.",
    { learnElsewhere: ["Durable Execution — Phase 21"] }
  ),
  pack(
    "context-pollution",
    "Pollution",
    [
      "Pollution is leftover, contradictory, or injected text that changes behavior",
      "Symptoms: ignored tools, sudden policy changes, looping",
      "Causes: unfenced RAG, huge traces, stale summaries, duplicate memories",
      "Fix by isolating, compacting, and dropping duplicates",
    ],
    "Quality bugs that look like the model got dumber are often a dirty window.",
    "A desk piled with last week's mail. You miss the invoice."
  ),
  pack(
    "context-freshness",
    "Freshness",
    [
      "Stale facts in the pack are worse than missing facts",
      "TTL, updated_at, and source version belong on every memory and chunk",
      "Prefer a tool refresh over a three-week-old embedding",
      "Say when a fact might be stale",
    ],
    "Agents quote last month's price with confidence.",
    "Milk in the fridge. Check the date before you pour."
  ),
  pack(
    "context-prioritization",
    "Priority",
    [
      "When the budget is tight, priority decides who stays",
      "Typical rank: live user, system policy, required tools, current task ids, then memory, then RAG, then traces",
      "Write the rank as config so it is reviewable",
      "Do not let recency of chat outrank a hard constraint",
    ],
    "Without an explicit rank, the last noisy tool result wins.",
    "Evacuating a plane: crew instructions, then passengers, then magazines."
  ),
]);
