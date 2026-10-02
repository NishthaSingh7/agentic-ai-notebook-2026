import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "mastra",
  instructor:
    "I am a senior engineer who builds AI products. I still start this topic from zero every time I teach it, because the idea is simple and the failures are not.",
  promise:
    "You will go from never having heard of a TypeScript agent box to being able to pick a door, stand up a small helper and a small recipe, give memory a real user id, and say when this box is a better fit than a Python graph.",

  story: {
    title: "The checkout that skipped tax, twice",
    body: [
      "A TypeScript shop already had a website written in Next.js — a common way to build web apps with JavaScript and TypeScript. They wanted an AI helper for checkout. The getting-started used a chat helper whose instructions listed five steps: cart, address, tax, pay, email. Tools for all five sat on that helper. On a laptop, the model was polite and did them in order.",
      "On a busy Friday a cart with a warehouse in one state and a customer in another made the tax lookup return an error. The helper retried pay() with a key the model had invented. The key collided with another customer because memory had been told the whole website was one person — the playground's default id. Pay succeeded. Tax never ran. Finance spent a weekend on missing sales tax.",
      "The same memory store served the support helper. Last Thursday's customer could be retrieved as working memory for this Thursday's customer. A support reply cited another person's order number.",
      "The fix was the other door. Checkout became a workflow: cart → address → tax → pay → email, with tax required and a server-issued payment key. Support stayed a chat helper, but memory's user id became the logged-in user, and the thread id became the ticket id. Evals started asserting that tax ran before pay.",
    ],
    moral:
      "A TypeScript box will happily be a chat kit or a workflow engine. If the path is known, open the workflow door. Never let memory think your entire website is a single user.",
  },

  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "If your product is a website written in TypeScript, you already have routes, forms, and a database. Adding an AI helper means those routes must call a model, maybe call tools, maybe remember last week, and maybe follow a fixed checkout path. Wiring four different libraries for that is tiring.",
        "The idea we need is one box with two doors. An agent door is the loop you already know: a model plus tools plus, optionally, memory. Use it when the next tool is not known. 'Help me debug this TypeScript error' is that shape.",
        "A workflow door is the recipe you already know: steps you wrote, with types on the way in and out. Use it when the next step is known. Checkout is that shape. Putting checkout behind a chat helper because the getting-started used a chat helper is the tax incident.",
        "Relief is not an architecture. Convenience will pick the agent door for you unless you slow down. Hold that sentence. The rest of this sitting is how you slow down.",
        "Pause and check. If tax returns an error, should pay still run? In a recipe, no. In a loop whose prompt lists tax before pay, maybe. That maybe is how Friday happened.",
        "At this point you should understand the problem: an AI feature inside a TypeScript app still has to choose a door per feature.",
      ],
      diagrams: [
        {
          title: "Two doors, one deployment",
          caption: "Known path, workflow. Unknown path, agent. Memory and evals sit behind both.",
          chart: chart(
            `flowchart TD
    Req([Next.js route]) --> Door{Path known?}
    Door -->|yes| Wf[Workflow steps]
    Door -->|no| Ag[Agent plus tools]
    Wf --> Mem[Memory store]
    Ag --> Mem
    Wf --> Ev[Evals]
    Ag --> Ev
    Wf --> Out([Typed result])
    Ag --> Out`,
            `class Req,Out hub
    class Wf,Ag grp1
    class Door grp2
    class Mem,Ev grp3`
          ),
        },
      ],
    },
    {
      id: "zod-forms",
      level: "beginner",
      title: "Tools and results are forms, in TypeScript",
      body: [
        "In the Pydantic sitting we used a Python form. In TypeScript the common form library is Zod. You describe the shape of an object. Tool inputs and, when you ask, the helper's final answer use those descriptions.",
        "The schema is the menu. Describe the negative case. Cap strings. Use a short list of allowed words when the set is closed. 'amount is integer cents, not a formatted price' belongs on the field, not only in the instructions.",
        "Do not invent a second, looser type for the helper 'so it can be free'. The same form should travel from the route to the workflow step to the eval. That is the actual advantage of a TypeScript control plane for this product: one language, one schema.",
        "Instructions should name the refusal, not a novel backstory. 'You look up orders for the signed-in user. You never pay. You never invent an order number.' That is a job.",
        "Remember this: a streamed sentence in the browser is not the object you store. The UI can show 'working on tax…'. The database stores the workflow result after tax has a value.",
      ],
    },
    {
      id: "playground-trap",
      level: "beginner",
      title: "How the simplest version works: memory is who plus which",
      body: [
        "Memory is stored notes and messages the helper may see on the next turn. Without a who, it is a shared diary. Without a which, every ticket for that person is one pile.",
        "A local playground — a UI where you chat as a generic user — is a good way to see tools fire. It is a bad identity model. If you do not set ids in the real route, you may ship the playground's idea of a person: one id for the whole website.",
        "That is how last Thursday's order number appeared in this Thursday's reply. The store did what it was told. You told it the website was one person.",
        "Resource id is the who: the authenticated user id, or the org id if the helper is truly org-scoped. Thread id is the which: the ticket id, the cart id, the support conversation id. Set both in the route from your session, not from the model.",
        "Pause and check. If two customers talk at once, do their memories share a key? If you have to think, the key is wrong.",
        "At this point you should understand the simplest version: two doors, one schema language, and memory keys that come from the logged-in session.",
      ],
      diagrams: [
        {
          title: "Who plus which",
          caption: "One website is not one person. One person is not one ticket.",
          chart: chart(
            `flowchart LR
    UserA([User A]) --> T1[Ticket 1]
    UserA --> T2[Ticket 2]
    UserB([User B]) --> T3[Ticket 3]
    T1 --> M1[(memory A/1)]
    T2 --> M2[(memory A/2)]
    T3 --> M3[(memory B/3)]`,
            `class UserA,UserB hub
    class T1,T2,T3 grp1
    class M1,M2,M3 grp3`
          ),
        },
      ],
    },
    {
      id: "small-agent",
      level: "intermediate",
      title: "Build the smallest support agent — now the library has a name",
      body: [
        "What are we trying to do? A support helper that can look up one order and draft a note. No pay tool. A Zod object out.",
        "Mastra is the TypeScript library that offers those pieces together: agents, workflows, memory, and evals. The box is convenient. You still have to choose a door per feature.",
        "Here is the smallest version. Instructions name the refusal. One tool. A model string you pin. Memory keys will be passed at run time from the route, not baked into the agent as 'web'.",
        "Let's understand the tool. The Zod input is the argument form. The description is the menu text. The function uses the signed-in user from your server, not a user id the model typed.",
        "Keep one agent small. If you need twenty tools, you need two agents or a workflow, not a longer instruction block. Do not register pay on a support agent. The tool list is the allowlist.",
      ],
      codes: [
        {
          title: "Small support agent. One lookup. A form out.",
          language: "typescript",
          code: `import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const Note = z.object({
  summary: z.string().max(500),
  orderId: z.string().optional(),
});

export const supportAgent = new Agent({
  name: "support",
  instructions: "Look up the signed-in user's order. Never pay. Never invent ids.",
  model: openai("gpt-4.1-mini"),
  tools: { getOrder },
});`,
        },
      ],
    },
    {
      id: "checkout-workflow",
      level: "intermediate",
      title: "Build the checkout as a recipe",
      body: [
        "The simple agent is the wrong door for checkout. What are we trying to do? Make tax a box you cannot walk around.",
        "A Mastra workflow is a list of steps with typed input and output. You can suspend a step — pause and come back — if tax returns an error that a person must fix. You do not let the model invent a payment key. The server issues the key from the cart id.",
        "Let's understand the gain. The demo model will often run tax before pay. Production traffic will not always. An arrow does not care about a 422 from tax. It will not call pay until tax has a result or a human has resumed.",
        "Evals belong next to this recipe. An eval is a test for model-shaped behaviour. Write one that loads a fixture cart and asserts the tax tool (or tax step) ran before pay. The docs' default 'faithfulness' example does not catch a skipped tax step.",
        "Connect this back to workflows versus agents. You are not anti-AI. You are putting the model in the boxes that need language, and putting money on arrows.",
      ],
      codes: [
        {
          title: "Tax is a step. Pay cannot start without its output.",
          language: "typescript",
          code: `import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const tax = createStep({
  id: "tax",
  inputSchema: z.object({ cartId: z.string() }),
  outputSchema: z.object({ taxCents: z.number() }),
  execute: async ({ inputData }) => ({ taxCents: await lookupTax(inputData.cartId) }),
});

const pay = createStep({
  id: "pay",
  inputSchema: z.object({ cartId: z.string(), taxCents: z.number() }),
  outputSchema: z.object({ ok: z.boolean() }),
  execute: async ({ inputData }) => ({ ok: await charge(inputData) }),
});

export const checkout = createWorkflow({ id: "checkout" }).then(tax).then(pay).commit();`,
        },
      ],
      diagrams: [
        {
          title: "Checkout arrows",
          caption: "A 422 in tax suspends. It does not jump to pay.",
          chart: chart(
            `flowchart TD
    Cart([Cart id]) --> Tax[Tax step]
    Tax --> Ok{Tax ok?}
    Ok -->|no| Wait[Suspend for a form]
    Wait --> Tax
    Ok -->|yes| Pay[Pay with server key]
    Pay --> Mail[Email]
    Mail --> Done([Done])`,
            `class Cart,Done hub
    class Tax,Pay,Mail grp1
    class Ok,Wait grp2`
          ),
        },
      ],
    },
    {
      id: "memory-ids",
      level: "intermediate",
      title: "How the pieces connect: ids come from the session",
      body: [
        "Working memory — short facts the helper keeps — should be small and typed when you can. A free-text blob will happily hold another customer's order number if the who was 'web'.",
        "How this sits in Next.js: the route reads the session, refuses if there is no user, then calls agent.generate or the workflow with resourceId and threadId set. The playground can keep its generic user. Production cannot.",
        "Treat any pull request that does not show how ids are assigned in the route as incomplete, even if the agent answers beautifully in the UI. The route is where the logged-in user exists. The playground does not have that user.",
        "Model-invented idempotency keys are the cousin of the playground id. The tool asked for a string. The model typed one. Two carts collided. The server should issue the key from the cart id.",
        "At this point you should understand the second Friday bug as a keying bug, not a model bug. The citation was accurate for someone. It was the wrong someone.",
      ],
      codes: [
        {
          title: "Ids come from the session, in the route.",
          language: "typescript",
          code: `export async function POST(req: Request) {
  const session = await auth();
  if (!session?.userId) return new Response("unauthorized", { status: 401 });
  const { ticketId, text } = await req.json();
  const result = await supportAgent.generate(text, {
    memory: { resource: session.userId, thread: ticketId },
  });
  return Response.json(result);
}`,
        },
      ],
    },
    {
      id: "stream-eval-fail",
      level: "advanced",
      title: "What breaks after the simple route works",
      body: [
        "Remember the simple version: support agent, checkout workflow, ids from the session. Real users want tokens streamed to the browser. Real teams want to swap models. Real checkouts need a pause when tax fails.",
        "Streaming is a channel to the UI. Persistence is a channel to the database. Validate the object you persist even if the stream already said 'Payment complete!'. That cousin of the tax incident is a UI lie.",
        "Suspend and resume on a workflow is a bookmark, same as in the Microsoft sitting. Resume from the logged-in manager or from the customer fixing an address, not from a generic playground user. Re-check who they are.",
        "Evals in the repo next to the prompts are how a model bump stays honest. No evals, no swap. A newer default model may 'helpfully' skip a tool and answer from memory.",
        "When not to pick Mastra: your control plane is already LangGraph in Python, your operators live there, and you would be adding a second write ledger in Node. When to pick it: the app is Next.js, the team writes TypeScript, and you want both doors in one deployment.",
      ],
      codes: [
        {
          title: "Persist the object, even if the stream already talked.",
          language: "typescript",
          code: `const streamed = await checkout.stream({ cartId });
// UI may show tokens. Storage waits for the typed end.
const result = await streamed.result;
if (!result.taxCents && result.taxCents !== 0) {
  throw new Error("tax missing — do not mark paid");
}
await db.saveCheckout(cartId, result);`,
        },
      ],
      diagrams: [
        {
          title: "Stream versus store",
          caption: "A friendly sentence is not a ledger row.",
          chart: chart(
            `flowchart LR
    Run[Workflow run] --> Ui[Browser stream]
    Run --> Obj[Typed result]
    Obj --> Db[(Database)]
    Ui --> Maybe([Looks done])`,
            `class Maybe hub
    class Run,Ui,Obj grp1
    class Db grp3`
          ),
        },
      ],
    },
    {
      id: "production-ts",
      level: "advanced",
      title: "Production judgement in a TypeScript shop",
      body: [
        "Pin the model. Put evals in CI for the paths that move money. Log the typed workflow result, not only the chat. Give memory a store you can back up — the sample file database is not a plan.",
        "Least privilege still applies. The support agent's tool list is an IAM policy. A pay tool 'for emergencies' will be used on a quiet Tuesday.",
        "Compare to LangGraph only on grain. LangGraph is a powerful graph runtime, often in Python. Mastra is a TypeScript box that also has graphs. If your product and your on-call are Node, one box is a 2am argument. If your product is already a Python graph, a second box is a second outage.",
        "The one-box story is good. Using only the agent half of the box is how you skip tax. Using a 15-step workflow with optional edges for a freeform desk is a group chat in Zod clothing.",
        "You should now be able to open a Mastra PR and ask: which door, which ids, where is the eval that would have caught Friday?",
      ],
      diagrams: [
        {
          title: "Route, session, door",
          caption: "If the PR cannot show this picture, it is not ready.",
          chart: chart(
            `flowchart TD
    Sess([Logged-in session]) --> Route[Next.js route]
    Route --> Ids[resourceId plus threadId]
    Route --> Door{Known path?}
    Door -->|yes| Wf[Workflow]
    Door -->|no| Ag[Agent]
    Ids --> Wf
    Ids --> Ag
    Wf --> Store[(Memory plus records)]
    Ag --> Store`,
            `class Sess hub
    class Route,Wf,Ag grp1
    class Door grp2
    class Ids,Store grp3`
          ),
        },
      ],
    },
  ],

  workedExample: {
    title: "Split checkout and support the way the library intended",
    setup:
      "One Agent runs checkout. Memory resourceId is 'web'. Evals folder still has the docs example. Tax can be skipped. Support cites the wrong order.",
    walkthrough: [
      "Step 1 — Understand the problem. A known path is in a loop. Memory thinks the site is one person. No eval watches order of operations.",
      "Step 2 — Identify the relevant concept. Two doors. resourceId is who. threadId is which. Evals assert arrows.",
      "Step 3 — Build the simplest solution. Workflow for cart → tax → pay. Agent for support with getOrder only.",
      "Step 4 — Improve it. Server-issued payment key from cart id. Session user as resourceId. Ticket id as threadId.",
      "Step 5 — Handle a failure. Tax returns 422. Suspend the workflow and show a form. Do not call pay.",
      "Step 6 — Production version. Eval fixture: tax before pay. Pin the model. Back the memory store. Refuse routes without a session.",
    ],
    result:
      "Checkout cannot skip tax. Support cannot see another user's diary. Friday looks like a workflow trace, not a lucky model.",
  },

  practice: {
    title: "Place doors on a 'cancel subscription' feature",
    task:
      "A PM wants an agent that cancels subscriptions in chat. Real steps: identify plan, check refund window, cancel at the provider, email confirmation. Ten percent of chats are 'why is my bill high?' instead. Think about doors, ids, and tools. Sketch the route.",
    hint:
      "One of these is a recipe. One is an open question. They should not share a pay-or-cancel tool list. Expected reasoning: workflow for cancel, agent for bill questions, session ids.",
    solution:
      "Workflow for cancel: identify → window → cancel → email, with a server-side customer id from the session. Agent for bill questions with read-only invoice tools. resourceId is user id; threadId is the billing ticket. Why this works: cancel cannot skip the window check, and a curious chat cannot cancel. Common wrong approach: one agent with cancel and invoice tools and memory resource 'web'.",
  },

  takeaways: [
    "Mastra is one TypeScript box with two doors: an agent loop and a typed workflow. Convenience will pick the agent unless you do not let it.",
    "Zod schemas are the forms. Use the same form in the route, the step, and the eval.",
    "The playground's user is not a production identity. Set resourceId and threadId from the session in the route.",
    "Known money paths belong on arrows. Streamed UI text is not a persisted result.",
    "Evals that assert order of operations catch skipped tax. Generic faithfulness examples do not.",
    "Pick Mastra when the app and the on-call are TypeScript. Do not add it as a second control plane next to a healthy Python graph.",
  ],

  mistakes: [
    "Mistake: putting a five-step checkout in an Agent. Why people make it: the getting-started did. What actually happens: tax is skipped under error. Better approach: a workflow with tax as a required step.",
    "Mistake: memory.resourceId = 'web'. Why people make it: the playground works. What actually happens: customers share a diary. Better approach: authenticated user id.",
    "Mistake: model-invented idempotency keys. Why people make it: the tool asked for a string. What actually happens: key collision and double charge. Better approach: server key from cart id.",
    "Mistake: registering pay on the support agent. Why people make it: emergencies. What actually happens: a Tuesday chat pays. Better approach: tool lists as allowlists.",
    "Mistake: trusting a streamed 'done' as persistence. Why people make it: the UI looks finished. What actually happens: pay never ran. Better approach: persist the typed workflow output.",
    "Mistake: swapping models with no eval on order. Why people make it: the router makes it easy. What actually happens: a helpful model skips a tool. Better approach: CI evals on fixture carts.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "When do you use a Mastra agent versus a Mastra workflow?",
      answer:
        "What they are testing: the two doors. Good answer: agent when the next tool is unknown; workflow when the next step is known. Checkout is a workflow even if a model drafts the email. Why that is good: it is the tax story in one rule. Follow-up: where do evals sit?",
    },
    {
      difficulty: "medium",
      question: "Support cited another customer's order. Memory is on. What do you inspect first?",
      answer:
        "What they are testing: resourceId and threadId. Good answer: who is resourceId in the route, is it the playground default, what is threadId, and did two users share a key. Why that is good: it treats memory as a store with keys, not as magic. Follow-up: how would you write an eval for this leak?",
    },
    {
      difficulty: "hard",
      question: "Your team already runs LangGraph in Python. When is Mastra still justified?",
      answer:
        "What they are testing: grain versus fashion. Good answer: when the product and on-call are Next.js and you would otherwise glue four TS libraries; not when you would run two write ledgers. Mention shared lessons: doors, ids, evals. Why that is good: it refuses a holy war. Follow-up: what would you refuse to port?",
    },
  ],

  glossary: [
    {
      term: "Mastra",
      meaning:
        "A TypeScript library that bundles agents, workflows, memory, and evals. Why it matters: one box, two doors, easy to use only one door.",
    },
    {
      term: "Zod",
      meaning:
        "A TypeScript schema library. Why it matters: tool inputs and step outputs are forms the runtime can check.",
    },
    {
      term: "Resource id",
      meaning:
        "The who in memory — usually the logged-in user. Why it matters: the wrong who is a cross-customer diary.",
    },
    {
      term: "Thread id",
      meaning:
        "The which conversation in memory. Why it matters: tickets and carts must not share one pile.",
    },
    {
      term: "Workflow step",
      meaning:
        "A typed box in a Mastra recipe. Why it matters: required work such as tax lives here, not in a prompt list.",
    },
    {
      term: "Eval",
      meaning:
        "An automated check of model-shaped behaviour. Why it matters: it is how you know tax still runs after a model bump.",
    },
  ],
};
