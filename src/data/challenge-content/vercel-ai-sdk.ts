import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "vercel-ai-sdk",
  instructor:
    "I am a senior engineer sitting next to you. We start from zero. If you have never streamed text into a React page, that is fine. We will first watch words appear on the screen, then see why that stream is not an agent, and only then put a tool loop on the server route.",
  promise:
    "You will be able to explain the difference between a stream and an agent, wire useChat to a route that calls streamText, put a tool on the server, stop a double-click from refunding twice, and know when the loop should leave the POST handler.",
  story: {
    title: "The Send button that refunded twice",
    body: [
      "A support console was a React page. The team added a chat box with Vercel's AI SDK. Words streamed in, the cursor blinked, and everyone smiled. The route called streamText. The page used useChat. It felt finished. Then they added a refund tool so the helper could 'just handle it'.",
      "A support rep asked the helper to refund ticket 4471 and clicked Send. The network was slow. The button stayed enabled. They clicked again. Two POST requests left the browser. Each request started its own model loop. Each loop called issue_refund. The ledger was not keyed on the ticket. Two refunds went out. The stream on the first tab still looked like one polite sentence.",
      "A third request happened when the rep hit Stop, then Send again. Stop aborted the browser's read of the stream. It did not abort the server loop unless the route was listening for that abort. The first loop kept running in the background and refunded a third time after the second loop had already finished.",
      "The fix was not a prettier chat bubble. Send disabled while a request was open. The ticket id became the refund key. The tool ran only on the server, with the logged-in user's credentials, not with a key shipped to the browser. The route honored the abort signal and set a step budget. The stream was still the product. The loop was finally treated as a server process.",
    ],
    moral:
      "Streaming words onto the screen is a speaker. An agent is a loop that is allowed to act. If you put the loop on the route and leave the button enabled, you have two agents and one ledger.",
  },
  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "The problem: words on the screen, work on the server",
      body: [
        "Imagine a chat box. The user types. Words appear one by one, like someone is typing back. That one-by-one appearance is a stream. A stream is just data arriving over time instead of all at once.",
        "Why streams exist: people will not wait three seconds for a blank box. Showing tokens as they are born makes the product feel alive. That is a user-interface problem. It is a real problem. It is not the same problem as 'the AI may call a refund tool'.",
        "If all you do is stream a model's text, you have a speaker. The world has not changed. No database row was written. The moment the model is allowed to call a tool, you have a loop that can change the world. That loop has to live somewhere. In this stack it usually lives on a server route, not in the React component.",
        "Here is a tiny concrete example. User types 'hello'. The route asks the model for a reply and streams 'hi, how can I help'. No tool. One request. Safe. User types 'refund 4471'. If a tool runs, money moves. Two clicks means two requests unless you stop that.",
        "At this point you should understand the problem. We need a stream for the eyes, and a single controlled loop for the actions. Next we will name the pieces the AI SDK gives you.",
      ],
      diagrams: [
        {
          title: "A speaker versus a loop",
          caption:
            "The page reads the stream. The route is the only place a tool should run.",
          chart: chart(
            `flowchart LR
    Page([React page]) --> Route[Server route]
    Route --> Model[Model]
    Model --> Stream[Token stream]
    Stream --> Page
    Route --> Tool[Refund tool]
    Tool --> Ledger[(Ledger)]`,
            `class Page hub
    class Route,Model,Stream grp1
    class Tool,Ledger grp3`
          ),
        },
      ],
    },
    {
      id: "two-pieces",
      level: "beginner",
      title: "What the AI SDK is: a stream on the page, a call on the route",
      body: [
        "The SDK has two sides that beginners mix up. Let's keep them apart.",
        "On the page you use a hook called useChat. A hook is a React function that holds state for you. useChat holds the message list, the input box, and whether a reply is currently streaming. It is a subscriber. It reads the stream. It is not the agent.",
        "On the server you have a route — often app/api/chat/route.ts. A route is the function that runs when the browser POSTs. That route calls streamText, which talks to the model and writes a stream back. If you pass tools into streamText, this is also where the tool loop runs.",
        "They look similar because both have the word chat. The important difference is trust. The browser is the user's machine. It can be clicked twice. It can be modified. Credentials and refunds do not belong there. The route is your process. Tools belong there.",
        "At this point you should be able to say: useChat is a speaker's remote control. streamText is the engine. Next we build the smallest pair.",
      ],
    },
    {
      id: "smallest-pair",
      level: "beginner",
      title: "The simplest version: useChat talks to streamText",
      body: [
        "Let's wire the smallest path that still streams. No tools yet. We want to see the split: the page sends messages, the route calls the model, the page reads tokens.",
        "What are we trying to do? Get words on the screen without pretending we have an agent.",
        "Here is the smallest version. TypeScript is the natural language here, because this kit lives in Next.js and React.",
        "Let's understand what just happened. The page does not have the API key. The route does. toUIMessageStreamResponse is how the SDK turns the model stream into something useChat already knows how to read. If you stop here, you have a chatbot. That is allowed. Do not add a tool until you have a reason.",
        "At this point you should understand: nothing in the browser is the loop. The loop, when we add it, will sit next to streamText.",
      ],
      codes: [
        {
          title: "app/api/chat/route.ts — words only",
          language: "typescript",
          code: `import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: openai("gpt-4.1-mini"),
    messages,
  });
  return result.toUIMessageStreamResponse();
}`,
        },
      ],
    },
    {
      id: "tools-on-the-route",
      level: "intermediate",
      title: "Implement a tool on the route, not in the browser",
      body: [
        "Now we let the model take an action. A tool is a named function with a description and arguments. The model can ask for it. Your route runs it. The result goes back into the stream, and the model continues.",
        "What are we trying to do? Refund a ticket on the server, with a key we control.",
        "Here is the smallest version.",
        "Let's understand what just happened. execute runs in your process. The browser never sees the ledger client. The key is derived from the ticket id so two loops that somehow start still hit the same ledger row. Small results, not a 50-page JSON dump — the model has to read this on the next turn.",
        "If you put execute in the browser so the demo is 'simpler', you have shipped credentials and a write button to anyone who can open DevTools. Don't.",
      ],
      codes: [
        {
          title: "refund-tool.ts — execute on the server",
          language: "typescript",
          code: `import { tool } from "ai";
import { z } from "zod";

export const issueRefund = tool({
  description: "Refund one ticket. Call at most once.",
  inputSchema: z.object({ ticketId: z.string() }),
  execute: async ({ ticketId }) => {
    const key = "refund:" + ticketId;
    const row = await ledger.refundOnce(key);
    return { refundId: row.id, cents: row.cents };
  },
});`,
        },
      ],
    },
    {
      id: "server-loop",
      level: "intermediate",
      title: "When the simple stream is not enough: the server loop",
      body: [
        "A single model call that then wants a tool is not done. The route must call the model again with the tool result. That repeat is the agent loop. The AI SDK will run it for you if you pass tools and a stop condition.",
        "stopWhen is the door you control. A common setting is 'stop after a few steps' so a confused model cannot spin. This is the same idea as max_turns in the OpenAI Agents SDK. Name the number. When it trips, the user should see that the helper stopped, not a fake finished answer.",
        "maxDuration on a Next.js route is how long the HTTP function may live. It is not a step budget. A loop can burn twenty tool calls in ten seconds and still be inside maxDuration. Budget steps and tokens separately.",
        "What are we trying to do? Allow a tool loop, but only a short one, on this POST.",
        "Here is the smallest version.",
        "Let's understand what just happened. The loop is on the route. The page still only reads a stream. If you feel tempted to run tools in useChat callbacks, you are moving the loop to a machine you do not trust.",
      ],
      codes: [
        {
          title: "route.ts — a budgeted loop",
          language: "typescript",
          code: `const result = streamText({
  model: openai("gpt-4.1-mini"),
  messages,
  tools: { issueRefund },
  stopWhen: stepCountIs(6),
  abortSignal: req.signal,
});`,
        },
      ],
      diagrams: [
        {
          title: "One request, one budgeted loop",
          caption:
            "The browser is a subscriber. Steps are counted on the server.",
          chart: chart(
            `flowchart TD
    Post([POST /api/chat]) --> Loop[streamText loop]
    Loop --> Model[Model]
    Model --> Need{Tool or text}
    Need -->|tool| Exec[execute on server]
    Exec --> Loop
    Need -->|text| Stream[UI stream]
    Steps[Step budget] -.->|exhausted| Halt([Halt])
    Abort[req.signal] -.->|client stopped| Halt`,
            `class Post,Halt hub
    class Loop,Model,Exec,Stream grp1
    class Need grp2
    class Steps,Abort grp3`
          ),
        },
      ],
    },
    {
      id: "button-and-stream",
      level: "intermediate",
      title: "How the pieces connect: the button, the stream, the ledger",
      body: [
        "In the real page, three things must agree. The Send button is disabled while status is submitted or streaming, so a double-click is one request. The Stop button aborts the fetch, and the route listens to req.signal so the loop dies too. The ticket id is sent as data, not hoped for inside the model's prose, so the tool key is stable.",
        "What the client is allowed to see is a second channel. Tool results can be huge or secret. Stream a small status to the UI — 'refunded, 89 dollars' — not the raw database row. The execute function already ran. The UI is not the source of truth.",
        "Auth happens on the route before streamText. If you build tools first and 'add auth later', you have a public refund endpoint with a streaming personality.",
        "They look similar because both travel over the same POST. The important difference is trust. The stream is for eyes. The execute is for the ledger. Mixing those channels is how a raw customer row ends up in a chat bubble.",
        "At this point you should be able to walk a click: disable button, POST with ticket id, auth, budgeted loop, execute once under ticket key, stream a receipt, abort kills the loop.",
      ],
      codes: [
        {
          title: "support-chat.tsx — disable Send, pass the ticket",
          language: "typescript",
          code: `const { messages, sendMessage, status, stop } = useChat();
const busy = status === "submitted" || status === "streaming";

return (
  <>
    <button disabled={busy} onClick={() => sendMessage({ text, data: { ticketId } })}>
      Send
    </button>
    <button onClick={stop}>Stop</button>
  </>
);`,
        },
      ],
      diagrams: [
        {
          title: "Two channels, one execute",
          caption:
            "The ledger sees a key. The UI sees a receipt. The browser never sees the client.",
          chart: chart(
            `flowchart TD
    Click([Send]) --> Gate{Busy}
    Gate -->|yes| Ignore[Ignore click]
    Gate -->|no| Post[POST with ticket id]
    Post --> Auth{Logged in}
    Auth -->|no| Deny([401])
    Auth -->|yes| Exec[issueRefund once]
    Exec --> Ledger[(ledger.refundOnce)]
    Exec --> Ui[Receipt on the stream]`,
            `class Click,Deny hub
    class Post,Exec,Ui grp1
    class Gate,Auth grp2
    class Ledger grp3`
          ),
        },
      ],
    },
    {
      id: "double-agent",
      level: "advanced",
      title: "Failure modes: two POSTs are two agents",
      body: [
        "Remember the simple happy path: one click, one loop, one refund. The simple version breaks when the page treats the stream as the only state that matters.",
        "Two POSTs are two agents. They do not share a step counter. They do not share a memory of the first refund unless the ledger key is the ticket. Disable the button, yes, but also make the write safe if the button fails. Idempotency is the backstop, not the UI.",
        "Stop without abortSignal is a costume. The user thinks the helper died. The route is still calling issue_refund. Listen to req.signal and pass it into streamText. Then prove it with a test: abort, and the ledger still has one row.",
        "A streamed tool payload can also leak. If execute returns the whole customer record and you forward that into the UI stream, you have built an export button for anyone on that page. Return the four fields the model needs. Render a receipt card from those fields.",
        "Thought experiment. The user sends the same ticket from two tabs. What should happen? Two loops may start. The ledger still has one key. The second execute returns the first refund id. The model should report that, not try a new key.",
      ],
      diagrams: [
        {
          title: "Two POSTs, one ticket key",
          caption:
            "The button is a courtesy. The ledger key is the door. Without the key, Stop-then-Send is a third agent.",
          chart: chart(
            `flowchart TD
    Click1([First Send]) --> Post1[POST loop]
    Click2([Second Send]) --> Post2[POST loop]
    Post1 --> Exec1[issue_refund]
    Post2 --> Exec2[issue_refund]
    Exec1 --> Key{Same ticket key}
    Exec2 --> Key
    Key -->|yes| One[(One ledger row)]
    Key -->|no| Two[(Two refunds)]`,
            `class Click1,Click2,One,Two hub
    class Post1,Post2,Exec1,Exec2 grp1
    class Key grp2`
          ),
        },
      ],
    },
    {
      id: "when-post-is-wrong",
      level: "advanced",
      title: "Production: when the loop should not live in a POST",
      body: [
        "Remember the simple design: the loop lives in the route because the request is short. That is the right default for support chat.",
        "The simple version breaks when the work outlives the HTTP request — a human approval tomorrow, a batch that takes four minutes, a deploy in the middle. maxDuration is not a workflow engine. Move the loop to a job with a stored state, and let the page subscribe to progress.",
        "It also breaks when you need the same loop from a non-React client. The route can stay. useChat is optional. Do not wed the ledger to a hook.",
        "When this kit is right: a Next.js app, streaming UI, tools that finish in one request, server-side execute. When to avoid it: you thought useChat was the agent, or you need a durable graph. Stay on the route until you cannot. Then take the same rules with you — one key, one budget, abort, auth first.",
        "At this point you should be able to say: the AI SDK owns the stream. You own the loop's doors. Most teams stop at tokens on the screen. This sitting was the server.",
      ],
      diagrams: [
        {
          title: "Stay on the route until you cannot",
          caption:
            "A long job needs a store. A short tool loop does not.",
          chart: chart(
            `flowchart TD
    Job{Does work fit in one POST}
    Job -->|yes| Route[Route loop]
    Job -->|no| Queue[Background job]
    Route --> Stream[useChat stream]
    Queue --> Store[(Job state)]
    Store --> Stream`,
            `class Stream hub
    class Route,Queue grp1
    class Job grp2
    class Store grp3`
          ),
        },
      ],
    },
  ],
  workedExample: {
    title: "Ticket tkt_4471 from the support console",
    setup:
      "A logged-in rep asks to refund ticket 4471. The page uses useChat. The route has issueRefund. The ledger has refundOnce(key).",
    walkthrough: [
      "Step 1 — Understand the problem. The rep wants money moved. The stream is how they watch. The ledger is the truth.",
      "Step 2 — Identify the relevant concept. Server-side tool loop plus an idempotency key plus a disabled Send.",
      "Step 3 — Build the simplest solution. POST messages and ticketId. streamText with issueRefund. execute calls refundOnce('refund:tkt_4471').",
      "Step 4 — Improve it. stopWhen stepCountIs(6). Disable Send while busy. Pass req.signal.",
      "Step 5 — Handle a failure. Two clicks or two tabs: second execute returns the same refund id. Abort: loop stops, still one row.",
      "Step 6 — Production. Auth on the route. Stream a receipt, not the raw row. Tests fire two POSTs and expect one ledger row.",
    ],
    result:
      "One ticket, one key, one row. The stream can be pretty. The ledger does not care.",
  },
  practice: {
    title: "Close the leak without breaking the receipt",
    task:
      "execute currently returns the full customer record, and the UI stream forwards it. The Send button is also still enabled during streaming. A rep double-clicked last Tuesday. Fix both problems and say what you would test. You may not move execute to the browser.",
    hint:
      "Think about two channels — what the model needs versus what the page needs — and about two POSTs being two loops. A common wrong approach is hiding the extra fields in CSS.",
    solution:
      "Return only refundId and cents from execute. Render a receipt card from those fields. Disable Send while status is submitted or streaming. Keep refundOnce(ticketId) as the backstop. Test: two parallel POSTs create one ledger row; the streamed payload does not contain email or card last-four. Why this works: you shrank the channel and made the write safe. The common wrong approach is CSS-hiding fields that already went to the browser, or asking the model to 'only refund once'.",
  },
  takeaways: [
    "A stream shows words over time. An agent is a loop that may call tools. Do not confuse the speaker with the loop.",
    "useChat is a subscriber. streamText on the route is the engine. Tools execute in your process.",
    "Two POSTs are two agents. Disable Send, and still key the ledger on the ticket.",
    "Stop must abort the server loop, not just the browser's read of the stream.",
    "Auth first, then tools. A public streaming route with issueRefund is a public refund API.",
    "Keep the loop on the POST until the work no longer fits in a request. Then move the state, not the credentials, to a job.",
  ],
  mistakes: [
    "Mistake: thinking useChat is the agent. Why people make it: the hook is the first thing the docs show. What actually happens: tools and keys drift into the browser. Better approach: the route owns execute.",
    "Mistake: leaving Send enabled. Why people make it: the demo never lagged. What actually happens: two POSTs, two refunds. Better approach: disable on busy, key the ledger.",
    "Mistake: Stop that only closes the reader. Why people make it: the UI looks cancelled. What actually happens: the loop keeps writing. Better approach: pass req.signal into streamText.",
    "Mistake: streaming the raw tool payload. Why people make it: faster to wire. What actually happens: you leak a customer record. Better approach: return a receipt shape.",
    "Mistake: treating maxDuration as a step budget. Why people make it: one timeout feels enough. What actually happens: many cheap tool calls still run. Better approach: stopWhen plus a wall clock.",
    "Mistake: putting the API key in client code so streamText can run in the browser. Why people make it: fewer files. What actually happens: the key is public. Better approach: the route is the only caller.",
  ],
  interviews: [
    {
      question: "Is streaming UI an agent? Start from zero.",
      difficulty: "easy",
      answer:
        "No. Streaming means tokens arrive over time so the page can render them. An agent is a loop that may call tools and change the world. What they want: you separate speaker from loop. Follow-up: where should the loop live in the AI SDK? On the server route, inside streamText.",
    },
    {
      question: "A rep double-clicked Send and the customer was refunded twice. Fix it.",
      difficulty: "medium",
      answer:
        "Disable Send while submitted or streaming. Make issueRefund idempotent on ticket id so two POSTs still write one row. Pass abortSignal so Stop kills the loop. Test two parallel POSTs. Follow-up: is the button enough by itself? No. The button is a courtesy. The key is the guarantee.",
    },
    {
      question: "When should the tool loop leave the Next.js POST handler?",
      difficulty: "hard",
      answer:
        "When the work cannot finish inside one request: human approval later, a long job, a deploy mid-flight. maxDuration is not a workflow engine. Move state to a job store and let the page subscribe. Trade-off: more moving parts versus a request that dies and retries unsafely. Follow-up: what stays the same after you move? Auth, server-side execute, one ledger key, one budget.",
    },
  ],
  glossary: [
    {
      term: "Stream",
      meaning:
        "Data that arrives over time, here model tokens the page can render as they are born. Why it matters: it is a UI feature, not an agent.",
    },
    {
      term: "useChat",
      meaning:
        "A React hook that holds messages and reads the UI stream. Why it matters: it is a subscriber, not the loop.",
    },
    {
      term: "streamText",
      meaning:
        "The server function that calls the model, optionally runs tools, and writes the stream. Why it matters: this is where the agent loop lives.",
    },
    {
      term: "execute",
      meaning:
        "The server-side body of a tool. Why it matters: credentials and writes belong here, not in the browser.",
    },
    {
      term: "stopWhen",
      meaning:
        "The step budget for the server loop. Why it matters: maxDuration is not a substitute.",
    },
    {
      term: "abortSignal",
      meaning:
        "The signal that the client gave up. Why it matters: without it, Stop is only a UI costume.",
    },
  ],
};
