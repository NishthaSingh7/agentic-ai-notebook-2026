import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "copilotkit",
  instructor:
    "I am a senior engineer sitting next to you. We start from zero. If you have never put an AI next to a form, that is fine. We will first see why a chat tab cannot see the page, then we will let the helper read the form, write into the same fields the user sees, and ask the human using the button they already have.",
  promise:
    "You will be able to explain why an agent belongs in the product, share a small view of page state with the model, let the helper propose a change to the canvas, wait for the real Send button, and know what must stay on the server.",
  story: {
    title: "The quote the copilot sent while the rep was still typing",
    body: [
      "A sales team had a quote page: line items, discount, customer email, a big Send button. They added a chat sidebar so a helper could 'clean up the quote'. The helper lived in a separate tab of the app. It could not see the form. The rep pasted numbers into the chat. The helper pasted a new table back. The rep copied it into the form by hand. Nobody loved it, but it was honest.",
      "Then the team wired CopilotKit so the helper could read the form and write line items. That part was correct. They also let the helper call sendQuote, because finishing the job felt like the point. A rep said 'remove the two stale add-ons and send it'. The helper cleared the lines — good — and called sendQuote while the rep was still editing the discount. The email went to the customer with a 0% discount the rep had not meant to send.",
      "The form on screen still showed the half-typed 15. The email showed 0. Two sources of truth. The sidebar had its own 'Confirm send?' popup, which the helper auto-accepted because the instructions said 'be proactive'. The real Send button on the toolbar never moved.",
      "The rebuild kept the helper on the page. It could read a safe view of the quote. It could propose line-item edits through the same setter the form already used. Send stayed a human click on the toolbar. The helper could ask, in that toolbar, 'ready to send?'. It could not fire the email. The page became the system of record again.",
    ],
    moral:
      "If the helper writes to a different place than the user is looking, or presses Send for them, you do not have a copilot. You have a second, faster intern with the company stamp.",
  },
  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "The problem: the chat tab cannot see the form",
      body: [
        "Imagine a quote page. The user is looking at a table. A chat tab on the other side of the app cannot see that table. The helper is guessing, or the user is copy-pasting. That is slow and it goes stale the moment someone edits a cell.",
        "The product already has state. State means the current values on the page: the lines, the discount, the email. React keeps that state in memory and draws the form from it. The user trusts the form. Whatever they see is what they think will be sent.",
        "So the real problem is not 'add a chatbot'. The problem is: let a helper read the same state the form is drawn from, and write through the same functions the form already uses. Then the user and the helper are looking at one canvas.",
        "Here is a tiny concrete example. The form shows three line items. The helper says it removed two. If it only said that in the sidebar, the form still has three. If it called the same removeLine function the trash icon calls, the form shows one. That second world is the one you want.",
        "At this point you should understand the problem. The agent belongs in the page, not in a chat tab. Next we will see how CopilotKit names the read and the write.",
      ],
      diagrams: [
        {
          title: "The page is the system of record",
          caption:
            "Chat that cannot see the form is a side channel. Shared state is one canvas.",
          chart: chart(
            `flowchart TD
    User([User]) --> Form[Quote form]
    Form --> State[(Page state)]
    Helper[Helper] --> State
    State --> Form
    State --> Helper
    Form --> Send([Toolbar Send])
    Helper -.->|must not| Email[(Outbound email)]`,
            `class User,Send hub
    class Form,Helper grp1
    class State grp2
    class Email grp3`
          ),
        },
      ],
    },
    {
      id: "readable-and-action",
      level: "beginner",
      title: "What CopilotKit is: read the page, write the page",
      body: [
        "CopilotKit is a set of React hooks for putting a helper inside a product. A hook, again, is a function that ties your component to some behavior. Two hooks matter first.",
        "The first is 'let the helper read something'. The library calls this useCopilotReadable. You pass a name and a value. That value is included in what the model can see. It is not console.log. It is a contract: you are choosing a view of the page to show an untrusted model.",
        "The second is 'let the helper do something to the page'. The library calls this useCopilotAction. You pass a name, a description, and a handler. When the model asks for that action, your handler runs. If the handler calls the same setState the form uses, the canvas updates in front of the user.",
        "They look similar because both share state with an AI. The important difference is direction. Readable is out: page to model. Action is in: model to page. Reads should be small and safe. Writes should go through the functions you already trust.",
        "At this point you should be able to say: the helper is a guest on the page. It may look at a view you chose. It may call writes you registered. It should not have a private copy of the quote.",
      ],
      diagrams: [
        {
          title: "Read out, write in",
          caption:
            "Readable is a view you chose. Action is a write you registered. The form stays the thing the user trusts.",
          chart: chart(
            `flowchart LR
    Form[Quote form] --> View[Safe view]
    View --> Model[Model]
    Model --> Action[Registered action]
    Action --> Setter[Same setter the form uses]
    Setter --> Form
    Model -.->|must not| Private[(Private copy)]`,
            `class Form hub
    class View,Model,Action,Setter grp1
    class Private grp3`
          ),
        },
      ],
    },
    {
      id: "smallest-readable",
      level: "beginner",
      title: "The simplest version: share a view, not the whole store",
      body: [
        "Let's share the smallest useful view. The helper needs to see line names and prices, not the customer's card last-four, not internal cost, not the sales-rep notes field.",
        "What are we trying to do? Give the model enough to edit lines, and nothing extra to leak into a sentence.",
        "Here is the smallest version.",
        "Let's understand what just happened. We did not pass the whole quote object. We passed a list the model can name. If you dump the entire store 'to be safe', you have put secrets in the prompt. Readable is a view. Design it like an API response for a stranger.",
        "At this point you should understand: sharing state is a product decision about what the model is allowed to know. Next we let it write.",
      ],
      codes: [
        {
          title: "quote-readable.tsx — a view, not the store",
          language: "typescript",
          code: `useCopilotReadable({
  description: "Open quote lines the user can see",
  value: lines.map((line) => ({
    id: line.id,
    name: line.name,
    cents: line.cents,
  })),
});`,
        },
      ],
    },
    {
      id: "actions-write-canvas",
      level: "intermediate",
      title: "Implement a write: the same setter the form uses",
      body: [
        "Reading is not enough. The helper said 'remove the two stale add-ons'. If it only types that in the sidebar, the user still has to click. If it calls removeLine — the same function the trash icon calls — the table updates. That is the point of an in-product helper.",
        "What are we trying to do? Register an action that edits the canvas, not a side channel.",
        "Here is the smallest version.",
        "Let's understand what just happened. The handler calls removeLine. The form re-renders. The user sees the change. There is no second table in the sidebar that can drift. If you invent a parallel quote object for the helper, you will recreate the 0% versus 15% incident.",
        "Actions that only chat — 'tell the user what you would change' — are fine for suggestions. Actions that change money fields should be visible. If a cell changes and the user cannot see it, you hid a write.",
      ],
      codes: [
        {
          title: "quote-actions.tsx — same setter the form uses",
          language: "typescript",
          code: `useCopilotAction({
  name: "removeLine",
  description: "Remove one line the user can already delete",
  parameters: [{ name: "lineId", type: "string", required: true }],
  handler: async ({ lineId }) => {
    removeLine(lineId);
    return { ok: true, lineId };
  },
});`,
        },
      ],
    },
    {
      id: "human-in-the-toolbar",
      level: "intermediate",
      title: "When the simple write is not enough: the human stays on the real button",
      body: [
        "The simple removeLine action is safe because it is reversible and visible. sendQuote is not. Sending an email is a side effect the user cannot undo from the table. The simple version breaks the moment you register sendQuote as just another action.",
        "Human in the loop, here, does not mean a second confirm popup in the sidebar. It means the helper may propose, and the user presses the Send they already know. That button already has auth, validation, and an audit line. Reuse it.",
        "What are we trying to do? Let the helper ask 'ready to send?' without being able to send.",
        "Here is the smallest version.",
        "Let's understand what just happened. The helper can open the existing modal. It cannot skip the click. 'Be proactive' in the instructions is how the story auto-accepted a sidebar confirm. If the only path to the mail server is the toolbar handler, the helper cannot auto-accept its way through.",
      ],
      codes: [
        {
          title: "send-action.tsx — open the toolbar, do not send",
          language: "typescript",
          code: `useCopilotAction({
  name: "askToSend",
  description: "Open the existing Send modal. Never send mail.",
  handler: async () => {
    setModal("send");
    return { ok: true, waiting: "human" };
  },
});

// The toolbar button, not the helper, calls sendQuote(quoteId).`,
        },
      ],
      diagrams: [
        {
          title: "Propose, wait, use the real button",
          caption:
            "The helper can edit the canvas. The human still owns Send.",
          chart: chart(
            `flowchart TD
    Helper[Helper] --> Edit[removeLine]
    Edit --> Form[Form updates]
    Helper --> Ask[askToSend]
    Ask --> Modal[Existing modal]
    Modal --> Human[Human clicks Send]
    Human --> Mail[(Email)]`,
            `class Human,Mail hub
    class Helper,Edit,Ask,Form,Modal grp1`
          ),
        },
      ],
    },
    {
      id: "shared-state-hygiene",
      level: "intermediate",
      title: "How the pieces connect: versions, races, and the half-typed cell",
      body: [
        "In a real page the user and the helper can write at the same time. The user is typing 15 in the discount box. The helper sends a quote with 0 because it read state a moment earlier. That is a race: two writers, one field, no agreement about who won.",
        "A simple fix is a revision number. Every time the form changes, revision goes up. An action that writes must include the revision it thought it had. If the number does not match, the write is rejected and the helper re-reads. This is the same idea as 'your document changed, reload' in a collaborative editor.",
        "Do not share half-typed cells. Readable should expose committed values — on blur, or after the user stops typing — not every keystroke. Otherwise the model sees '1' while the user is on the way to '15'.",
        "Under the hooks, CopilotKit speaks a protocol of events between the page and a runtime. You do not need the protocol name to use the hooks. You do need to know that the runtime is a server. Server tools can look up prices. They must not send the email if the product rule is 'human Send only'.",
        "At this point you should be able to walk a turn: page shares a view, helper proposes a write, handler checks revision, form updates, Send stays human.",
      ],
      diagrams: [
        {
          title: "Revision is the race detector",
          caption:
            "A stale helper write must fail, not overwrite the half-typed 15.",
          chart: chart(
            `flowchart TD
    UserType[User types 15] --> Rev[revision 8]
    HelperWrite[Helper write at revision 7] --> Check{Same revision}
    Rev --> Check
    Check -->|no| Reject[Reject and reread]
    Check -->|yes| Apply[Apply write]`,
            `class UserType,Apply hub
    class HelperWrite,Rev grp1
    class Check grp2
    class Reject grp3`
          ),
        },
      ],
    },
    {
      id: "runtime-vs-react",
      level: "advanced",
      title: "Failure modes: what stays on the runtime, what stays in React",
      body: [
        "Remember the simple pair: Readable in React, Action in React. The simple version breaks when a write needs a secret or must be trusted.",
        "Lookups that need a price list or a CRM token belong on the runtime — the server CopilotKit talks to. The page asks. The server returns a number. The page setter still applies it, so the form remains the canvas.",
        "Sends that need the company mail credential also belong on the server — but only after the human click. If you put sendQuote on the runtime as a tool the model can call, you have rebuilt the story, just with a nicer backend. The model proposed. The server mailed. The toolbar never moved.",
        "Thought experiment. The helper wants to apply a 40% discount your policy forbids. Where do you stop it? Not in the instruction string. In the same validation the form already runs when a human types 40. Shared writes must share validators.",
        "If the page is not the job — a headless batch, a ticket queue with no canvas — CopilotKit is the wrong shape. Use a server agent. The hooks earn their keep when the user is looking at the thing being changed.",
      ],
      codes: [
        {
          title: "runtime.ts — server tools propose, they do not send",
          language: "typescript",
          code: `actions: {
  lookupPrice: async ({ sku }) => {
    return { cents: await prices.get(sku) };
  },
  // sendQuote is not registered here.
  // The toolbar route sends after a human click.
}`,
        },
      ],
    },
    {
      id: "when-copilotkit-is-wrong",
      level: "advanced",
      title: "Production judgment: keep the hooks only if the page is the job",
      body: [
        "Remember the simple pitch: put the agent in the product. That remains the right default for a quote page, a canvas, a form the user is mid-edit.",
        "The simple version is the wrong default for a long-running back-office job, or for a chat that does not share state with anything else. Then you are paying for React bindings you do not use. Use a server loop. Stream a status if you want.",
        "It is also wrong if you cannot name the system of record. If the sidebar, the form, and the CRM can all disagree, adding a helper makes three liars. Pick the page or pick the server. Make the others derive.",
        "Production checklist: readable is a designed view, actions use existing setters, revision checks on writes, Send is a human path, server tools do not mail, validators are shared with the form.",
        "At this point you should be able to teach this sitting: the helper is a guest on the canvas. Guests do not stamp the letter.",
      ],
      diagrams: [
        {
          title: "Keep the hooks only if the page is the job",
          caption:
            "No canvas means no CopilotKit. A canvas means one system of record.",
          chart: chart(
            `flowchart TD
    Q{Is the user looking at the thing}
    Q -->|yes| Page[CopilotKit on the page]
    Q -->|no| Server[Server agent]
    Page --> One[(One form state)]
    Server --> Job[(Job state)]`,
            `class One,Job hub
    class Page,Server grp1
    class Q grp2`
          ),
        },
      ],
    },
  ],
  workedExample: {
    title: "Clean up lines from the email, do not send",
    setup:
      "A quote has four lines. Two are stale add-ons. The rep says 'remove the stale add-ons'. They are still typing a 15% discount. They have not clicked Send.",
    walkthrough: [
      "Step 1 — Understand the problem. The helper should change the table the rep is looking at, and must not email the customer.",
      "Step 2 — Identify the relevant concept. Readable for the lines, an action that calls removeLine, Send stays on the toolbar.",
      "Step 3 — Build the simplest solution. Share id/name/cents. Register removeLine. The helper calls it twice. The table shows two lines.",
      "Step 4 — Improve it. Actions carry the revision. A write with a stale revision is rejected while the discount box is mid-keystroke.",
      "Step 5 — Handle a failure. If the helper tries sendQuote, that action does not exist. It may call askToSend, which only opens the modal.",
      "Step 6 — Production. Price lookup can live on the runtime. Mail still waits for the toolbar. The audit log records the human click.",
    ],
    result:
      "The canvas matches the helper's work. The email does not exist until a person presses Send. The half-typed 15 is not overwritten.",
  },
  practice: {
    title: "Stop the copilot from sending without the toolbar",
    task:
      "You inherit a quote page where useCopilotAction('sendQuote') calls the mail API from the browser, and useCopilotReadable passes the entire quote store including cost and card last-four. The sidebar has its own confirm that the helper can accept. What do you change, in order?",
    hint:
      "Think about the view, the write path, and the one button that is allowed to stamp the letter. A common wrong approach is a longer instruction that says 'ask first'.",
    solution:
      "Shrink readable to the fields the user can already see. Delete sendQuote as a helper action. Add askToSend that only opens the existing modal. Move mail to the toolbar route after a human click. Share the form's validators and a revision on writes. Why this works: the helper cannot reach the mail API, and the model no longer sees secrets. The common wrong approach is 'please confirm with the user' in the prompt. The story's helper auto-accepted its own popup.",
  },
  takeaways: [
    "An in-product helper must share the canvas the user is looking at. A chat tab is a side channel.",
    "useCopilotReadable is a designed view for an untrusted model, not a dump of the store.",
    "useCopilotAction should call the same setters the form already uses, so there is one table.",
    "Irreversible actions stay on the human button you already have. A sidebar confirm is not that button.",
    "User and helper can race. A revision number makes a stale write fail instead of overwrite.",
    "Server tools may look up. They must not send, unless the product rule says the human already clicked.",
  ],
  mistakes: [
    "Mistake: keeping the helper in a chat tab that cannot see the form. Why people make it: chat is the demo. What actually happens: copy-paste and drift. Better approach: share a view of page state.",
    "Mistake: passing the whole store to readable. Why people make it: completeness. What actually happens: secrets land in the prompt. Better approach: map a public view.",
    "Mistake: a second quote object for the helper. Why people make it: easier than using setState. What actually happens: the form shows 15 and the email shows 0. Better approach: one setter.",
    "Mistake: registering sendQuote as an action. Why people make it: 'finish the job'. What actually happens: mail goes out while the user is typing. Better approach: askToSend opens the toolbar modal.",
    "Mistake: sharing every keystroke. Why people make it: live feels clever. What actually happens: the model reads '1' on the way to '15'. Better approach: share committed values.",
    "Mistake: putting mail on the runtime as a model-callable tool. Why people make it: the server feels safer. What actually happens: the model still fires it. Better approach: the toolbar route is the only sender.",
  ],
  interviews: [
    {
      question: "Why put an agent in the page instead of a chat tab? Start from zero.",
      difficulty: "easy",
      answer:
        "The page already has the state the user trusts. A chat tab cannot see it, so people copy-paste and the two views drift. CopilotKit lets the helper read a view and write through the same setters. What they want: system of record. Follow-up: what should the helper not do? Press Send.",
    },
    {
      question:
        "A copilot emailed a quote while the rep was still typing a discount. How do you fix it?",
      difficulty: "medium",
      answer:
        "Remove sendQuote from helper actions. The helper may edit lines and may open the existing Send modal. Only the toolbar handler mails. Add a revision so a write during typing is rejected. Follow-up: is a sidebar 'are you sure?' enough? No. The story's helper accepted its own popup.",
    },
    {
      question: "What belongs in React, what belongs on the CopilotKit runtime, and why?",
      difficulty: "hard",
      answer:
        "React: the canvas, readable views, actions that call local setters, the human Send. Runtime: lookups that need secrets, validation you do not want to ship twice. Mail after a human click can be a normal route, not a model-callable runtime tool. Trade-off: more server tools feel 'safer' but become a bypass if the model can invoke them. Follow-up: when would you drop CopilotKit? When there is no canvas.",
    },
  ],
  glossary: [
    {
      term: "Canvas",
      meaning:
        "The page the user is looking at — the form, the table, the quote. Why it matters: this is the system of record the helper must share.",
    },
    {
      term: "useCopilotReadable",
      meaning:
        "A hook that shares a chosen view of page state with the model. Why it matters: it is a contract, not a dump.",
    },
    {
      term: "useCopilotAction",
      meaning:
        "A hook that lets the model call a handler you registered. Why it matters: the handler should use the same setter as the UI.",
    },
    {
      term: "Runtime",
      meaning:
        "The server CopilotKit talks to for tools that need secrets. Why it matters: lookups can live here; Send still should not, unless a human already clicked.",
    },
    {
      term: "Revision",
      meaning:
        "A number that goes up on each committed edit. Why it matters: stale helper writes can be rejected instead of overwriting.",
    },
    {
      term: "Human in the existing UI",
      meaning:
        "The helper asks using the button or modal the product already has. Why it matters: a new sidebar confirm is a second, weaker door.",
    },
  ],
};
