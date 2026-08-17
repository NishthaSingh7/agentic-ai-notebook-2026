import { createLesson } from "./builder";
import { pastelChart } from "@/lib/mermaid-pastel";

function b(...lines: string[]) {
  return lines.map((l) => `- ${l}`).join("\n");
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

function v(
  concept: string[],
  why: string,
  analogy: string,
  hub: string,
  extra: { glossary?: string[]; learnElsewhere?: string[]; cheat?: string[] } = {}
) {
  return createLesson({
    visualFirst: true,
    practiceTask: "",
    concept: b(...concept),
    whyItExists: why,
    analogy,
    analogyDiagram: trio(hub, "Stream", "State", "HITL"),
    diagram: trio(hub, "MCP tools", "A2A agents", "AG-UI users"),
    workflowDiagrams: [
      {
        title: "This turn",
        caption: analogy,
        chart: trio("User", hub, "Events", "UI"),
      },
    ],
    technicalExplanation: why,
    example: analogy,
    glossary: extra.glossary,
    learnElsewhere: extra.learnElsewhere,
    revisionNotes: { cheatSheet: extra.cheat ?? concept.slice(0, 3) },
    commandsToRemember: extra.cheat,
  });
}

export const agUiLessons = {
  "ag-ui": v(
    [
      "AG-UI is the agent to user protocol: events from the backend to the frontend",
      "MCP is tools and data. A2A is agents. AG-UI is humans",
      "Streaming, shared state, tool cards, and HITL live here",
      "A spinner plus a chat box is not an agent UI",
    ],
    "Full-stack agent products need a contract between the runtime and the UI, not ad-hoc websockets per app.",
    "USB-C for the human side of the agent. MCP was USB-C for tools.",
    "AG-UI",
    { glossary: ["AG-UI", "Event"], cheat: ["Events not spinners", "MCP ≠ AG-UI", "HITL is an event"] }
  ),
  "agent-event-streaming": v(
    [
      "Stream tokens, tool spans, and status — do not wait for the final JSON",
      "Users forgive latency they can see",
      "Backpressure and cancel must be first-class",
      "Event names matter more than SSE vs websocket",
    ],
    "A twelve-second mute spinner feels broken even when the agent is working.",
    "Airport boards. You want boarding group 3, not a blank screen.",
    "Stream",
    { glossary: ["text-delta", "Abort"] }
  ),
  "agent-state-ui": v(
    [
      "The UI binds to a documented agent state object, not to hidden server memory",
      "Patch events update the object",
      "Optimistic UI still needs a source of truth after resume",
      "Version the state schema",
    ],
    "Refresh should restore the same tickets, drafts, and pending approvals.",
    "A shared Google Doc, not a private notepad the projector sometimes shows.",
    "State",
    { glossary: ["Shared state", "JSON patch"] }
  ),
  "tool-calls-ui": v(
    [
      "Show what the agent is calling, with args the user is allowed to see",
      "Redact secrets. Show status and duration",
      "Click through to the observation, not a wall of JSON",
      "Failed tools need a retry and error state",
    ],
    "Trust dies when tools are invisible. Trust also dies when you dump raw args with tokens.",
    "A restaurant ticket rail: order, station, done — not the chef's tax ID.",
    "Tool card",
    { glossary: ["Tool card"] }
  ),
  "hitl-ui": v(
    [
      "Human-in-the-loop is a first-class event: approve, edit, reject, with a timeout",
      "The run pauses in the runtime, not only in the browser",
      "Show what will happen if they approve",
      "Record who approved",
    ],
    "A confirm() in React is not durable. The agent must pause server-side.",
    "A bank approval queue, not an OK dialog that vanishes on refresh.",
    "HITL",
    { glossary: ["HITL event", "Interrupt"], learnElsewhere: ["Human Approval — Phase 20"] }
  ),
  "agent-progress-ui": v(
    [
      "Long jobs need stages, checklists, and honest ETAs",
      "Map graph nodes or crew tasks to steps the human understands",
      "If a step is silent, say it is stalled",
      "Do not fake 100 percent then fail",
    ],
    "Background agents feel dead without progress.",
    "A delivery tracker, not a mystery van.",
    "Progress",
    { glossary: ["Heartbeat", "Stage"] }
  ),
  "generative-ui": v(
    [
      "The agent can emit UI specs (cards, tables, forms), not only markdown",
      "Whitelist components. Never eval model HTML as script",
      "Generative UI is data plus component name, not a string of React",
      "Fall back to markdown",
    ],
    "Chat walls do not scale for approvals, tables, and diffs.",
    "A waiter bringing a plated dish from a menu, not raw ingredients and a blender.",
    "Gen UI",
    { glossary: ["Generative UI", "Allowlist"] }
  ),
  "shared-state": v(
    [
      "Shared state is the contract both UI and agent write",
      "Last-write-wins is usually wrong for approvals",
      "Isolate per user and per run",
      "Do not put secrets in shared state",
    ],
    "Two tabs and a resume should not double-refund.",
    "A lock on the filing cabinet plus a paper trail.",
    "Shared",
    { glossary: ["Compare-and-swap", "Run id"] }
  ),
  "frontend-agent-integration": v(
    [
      "Wire the app through a BFF: auth, events, HITL replies",
      "The agent backend is a service, not a browser call with your API key",
      "Cookies to the BFF, BFF to the runtime",
      "Cancel and resume from the UI",
    ],
    "Putting a model API key in the browser is how you get billed by strangers.",
    "A ticket booth. The public never walks into the kitchen.",
    "BFF",
    { glossary: ["BFF", "EventSource"] }
  ),
  "agent-ux": v(
    [
      "Agent UX is empty states, errors, retries, citations, artifacts, and handoff to a human",
      "Citations beat confidence theater",
      "Errors should say what failed and what the user can do",
      "Handoff keeps the transcript",
    ],
    "Production agents are products. Products need UX, not just a model score.",
    "Airline app: delays, receipts, talk to an agent — not a blinking cursor.",
    "UX",
    { glossary: ["Handoff", "Artifact"] }
  ),
};
