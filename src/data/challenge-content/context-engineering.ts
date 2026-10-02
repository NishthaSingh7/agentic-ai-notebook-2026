import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "context-engineering",
  instructor:
    "I teach this from zero. We start with a simple fact: the model only knows what you put in front of it on this call. Then we learn how to choose that text on purpose.",
  promise:
    "You will go from never having heard of a context window to packing named blocks, giving each a size limit, selecting evidence for this question, keeping another customer's data out, and proving every claim has a source.",

  story: {
    title: "The refund that became 'about forty dollars'",
    body: [
      "A billing team built a helper that drafted refund recommendations. The standing instructions were careful: cite the order, use the remaining amount, do not invent a number. In tests it looked perfect. Testers pasted a short ticket and a six-field order record. The helper quoted 27.00 dollars. Everyone signed off.",
      "In production, real tickets arrived with extras. A forwarded chat thread. A policy PDF. Two older tickets that 'felt similar'. The packer — the bit of code that builds the prompt — stuffed all of it in. The prompt has a size limit. When the pile got too big, the packer cut from the end. The order record, the one place the remaining amount lived as the number 2700 cents, was the piece that fell off.",
      "The model still answered. It had a chat message that said 'we usually do about forty as a goodwill'. It had an old ticket for a different order that refunded 42 dollars. It blended those into 'about forty dollars'. A tired human approved the draft because the number looked familiar. Finance found fourteen rounded recommendations that week. Three of them had already been paid.",
      "The standing instructions were not the bug. The pile of text was the bug. The team rebuilt the packer: named sections, a size budget for each section, a rule that numbers must be copied not rewritten, and a customer key so a similar ticket from another account could never enter. The same model, same instructions, started citing 27.00 again.",
    ],
    moral:
      "The instructions say how to behave. Context engineering decides what evidence is even in the room. If you cannot name why a piece of text is there, it should not be there.",
  },

  stages: [
    {
      id: "model-only-sees-this",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Let's start from zero. A language model does not browse your company while it answers. It does not remember last Tuesday unless you stored that memory and then chose to show it again. On each call, it sees a bundle of text you assembled, and it predicts the next words from that bundle.",
        "That bundle has a name we will use for the rest of the sitting: the context window. Think of it as the desk in front of a person. If the order record is not on the desk, the person cannot honestly quote the remaining amount. They can only guess from whatever else is on the desk.",
        "Why does this exist as a problem? Because teams keep adding sources. The user message. The handbook. The last twenty chat turns. A search result. A tool result. Each source feels useful. Together they crowd the desk. Something important falls on the floor.",
        "What happens without care? The model answers from the loudest leftover. In the story, that leftover was a casual chat message about 'about forty'. The answer looked confident. The number was wrong.",
        "A bigger desk does not fix this by itself. A larger window invites you to stop choosing. The failure changes from 'we truncated the order' to 'the order is in there somewhere and the model attended to the noisy pile instead'.",
        "At this point you should understand: every answer is only as honest as the desk you packed. The rest of the sitting is how to pack it.",
      ],
      diagrams: [
        {
          title: "The desk in front of the model",
          caption:
            "If the order record is not in the window, the model cannot honestly quote it.",
          chart: chart(
            `flowchart LR
    Sources[Tickets docs chat tools] --> Pack[Your packer]
    Pack --> Desk[Context window]
    Desk --> Modelg[Model]
    Modelg --> Out([Answer])`,
            `class Sources,Desk,Out hub
    class Pack,Modelg grp1`
          ),
        },
      ],
    },
    {
      id: "prompt-vs-context",
      level: "beginner",
      title: "Prompt engineering versus context engineering",
      body: [
        "Two phrases sound alike. Let's separate them before we mix them.",
        "Prompt engineering is writing the standing instructions: who the helper is, how it should talk, what it must cite. That text is usually the same from call to call. You edit it like a document.",
        "Context engineering is the runtime job of choosing, for this call, which evidence, memory, history, and tool results sit next to those instructions. That text changes every time. You build it with code.",
        "They look similar because both end up in the same window. The important difference is when they are decided. Instructions are designed. Context is selected under a size budget.",
        "A beautiful prompt in front of a 40,000-token chat dump is a beautiful prompt the model will ignore. Attention is finite. The dump is loud. That is why this sitting is not 'write a better system prompt'.",
        "At this point you should be able to say: the prompt is the standing order. Context is the evidence on this call.",
      ],
      diagrams: [
        {
          title: "Same window, two jobs",
          caption: "Instructions are designed once. Evidence is selected every call.",
          chart: chart(
            `flowchart LR
    Inst[Standing instructions] --> Desk[Window]
    Pick[Select for this question] --> Desk
    Desk --> Modelg[Model]`,
            `class Inst,Pick grp1
    class Desk,Modelg hub`
          ),
        },
      ],
    },
    {
      id: "named-blocks",
      level: "beginner",
      title: "How the simplest version works",
      body: [
        "The simplest useful version is to stop pasting one blob. Give the window named blocks. A block is just a labelled section: goal, policy, evidence, scratchpad, user profile.",
        "Why names? Because you can then say 'the number lives in evidence' and 'the standing rules live in policy'. You can give each block its own size limit. You can log which block was truncated. A blob cannot tell you that.",
        "Here is a tiny example. Goal: 'refund remaining capture on order 88213'. Policy: 'cite the order, never invent a figure'. Evidence: the order row with remaining_cents=2700. Scratchpad: empty. That is a packed window you can read with your eyes.",
        "What happens if you skip names? Retrieval appends. Memory appends. History appends. When the window overflows, a generic trimmer cuts the tail. The tail is often the most specific record, because it was added last.",
        "Connect this back. Stage 1 said the desk must hold the right paper. Named blocks are how you know which paper is which.",
        "At this point you should understand: if you cannot point at a region of the prompt and name the subsystem that produced it, you do not have context engineering yet.",
      ],
      codes: [
        {
          title: "Name the piles before you pack them",
          language: "python",
          code: `def pack(goal: str, policy: str, evidence: str) -> str:
    return (
        f"## goal\\n{goal}\\n\\n"
        f"## policy\\n{policy}\\n\\n"
        f"## evidence\\n{evidence}\\n"
    )`,
        },
      ],
    },
    {
      id: "token-budgets",
      level: "intermediate",
      title: "Every block gets a budget",
      body: [
        "A token is a piece of text the model bills and attends to. You do not need the exact tokenizer to use the idea. Treat a token as roughly a short word. The window has a maximum. Your packer must stay under it.",
        "What are we trying to do? Give each named block a maximum size so one noisy source cannot eat the whole desk.",
        "Here is the smallest version. Policy gets a small budget, because rules should be short. Goal gets a small budget. Evidence gets the largest budget, because that is where the order row lives. History gets what remains, and it is the first thing you shrink.",
        "Let's understand what just happened. Truncation is now a policy, not an accident. If evidence is too long, you shrink evidence with a rule. You do not silently drop it because chat history was glued on the end.",
        "Never summarise a number to save space. 'About forty' is how the story happened. Copy identifiers, amounts, and dates exactly. Summarise only narrative: the chat thread, the long email, the old ticket story.",
        "At this point you should understand: a budget is how you decide who loses when the desk is full. Evidence should lose last.",
      ],
      codes: [
        {
          title: "Cap each block on purpose",
          language: "python",
          code: `BUDGET = {"policy": 800, "goal": 200, "evidence": 3000, "history": 1200}

def clip(name: str, text: str) -> str:
    limit = BUDGET[name]
    if len(text) <= limit:
        return text
    return text[: limit - 16] + "…[truncated]"`,
        },
      ],
      diagrams: [
        {
          title: "Budgets decide who gets cut",
          caption: "History shrinks first. Evidence, especially numbers, is last.",
          chart: chart(
            `flowchart TD
    In[Named blocks] --> Fit{Fits the window}
    Fit -->|yes| Desk[Packed window]
    Fit -->|no| Cut[Shrink history then narrative]
    Cut --> Keep[Keep ids and amounts]
    Keep --> Desk
    Desk --> Modelg[Model]`,
            `class In,Desk hub
    class Fit grp2
    class Cut,Keep,Modelg grp1`
          ),
        },
      ],
    },
    {
      id: "select-then-compress",
      level: "intermediate",
      title: "First choose, then shrink",
      body: [
        "A budget without selection still packs the wrong papers. Selection means: given this goal, which pieces deserve a seat?",
        "Do not retrieve 'everything this customer ever said'. Rank memories and document chunks against the current question. Keep the top few. Leave the rest in storage where the model can ask for them with a tool if needed.",
        "Compression is the second pass. After you have chosen, you may shorten. Structure helps: keep ids, amounts, and decisions as fields. Turn a twelve-page HTML dump into three facts plus a handle you can fetch again.",
        "Tool results rot. The last observation should stay raw so the model can see what just happened. Older tool results can be shortened. If you shorten the latest result, the model will call the tool again because from its point of view it never got an answer.",
        "Pause and check. If you drop the order row to make room for Slack, what will the model quote? Whatever leftover sentence mentions money. That is the story.",
        "At this point you should understand: select against the goal, then compress with rules that protect numbers.",
      ],
      diagrams: [
        {
          title: "Select against this goal, then pack",
          caption:
            "Similarity to 'this customer' is not the same as usefulness for this question.",
          chart: chart(
            `flowchart TD
    Goal([This question]) --> Rank[Rank evidence]
    Pool[Docs memory tools] --> Rank
    Rank --> Top[Keep top few]
    Top --> Comp[Compress narrative]
    Comp --> Desk[Window]
    Desk --> Modelg[Model]`,
            `class Goal,Desk hub
    class Pool,Rank,Top,Comp grp1
    class Modelg grp2`
          ),
        },
      ],
    },
    {
      id: "real-app-packer",
      level: "intermediate",
      title: "How the pieces sit in a real app",
      body: [
        "In a real support product the packer is a function your request handler calls on every turn. It receives the user message, the ticket id, the tenant id — the customer key — and maybe the last tool result. It returns the messages you will send to the model.",
        "Around it sit ordinary engineering pieces. A database of tickets. A retrieval index of help articles. A memory store of user preferences. A log of what was packed, so you can debug a bad answer tomorrow.",
        "Latency and cost live here. Every extra chunk is tokens you pay for and milliseconds the user waits. Caching the policy block is cheap because it rarely changes. Caching 'the last thirty Slack messages' is how you keep shipping a dump.",
        "Failures to expect: retrieval returns nothing, so evidence is empty and the helper must refuse rather than invent. Retrieval returns another tenant's row, which we will treat as a breach in the next stage. The last tool result is 8,000 tokens of HTML, which you must clip before packing.",
        "This is also where prompt engineering and context engineering meet. The standing instructions stay pinned and versioned. The packer never concatenates retrieved text into the system role. Retrieved text goes in an evidence block labelled as data.",
        "At this point you should see the packer as a product component: versioned, logged, and tested on 'did the necessary evidence survive'.",
      ],
    },
    {
      id: "isolate-and-prove",
      level: "advanced",
      title: "Keep tenants apart, and prove every claim",
      body: [
        "Remember the simple packer: named blocks and a budget. That version breaks when 'similar' means 'another customer with a similar ticket'. Vector search will happily return a neighbour. A neighbour in vector space is not a colleague.",
        "Tenant isolation is context engineering, not a later security add-on. Filter by tenant before you rank. If a row has the wrong tenant key, it must never enter the window. Post-filtering after you already stuffed the prompt is how leaks happen.",
        "Provenance means every piece of evidence carries a source id: order-88213, article-441, memory-17. When the model makes a claim, it must point at one of those ids. That is how you cite. It is also how you debug: you can open the exact row the packer included.",
        "A common failure looks like memory. The model 'remembers' a fact you dropped two turns ago and writes it back. That is invention, not memory. If the source id is gone, the claim is not allowed.",
        "Trade-off: strict isolation can hide a useful handbook article that is truly global. Mark global articles as tenant='*' on purpose. Do not treat 'no tenant field' as global. Missing is a bug.",
        "At this point you should understand: a similarity hit without a tenant key is a breach, and a claim without a source id is a guess.",
      ],
      diagrams: [
        {
          title: "Filter tenant first, then rank",
          caption:
            "A missing tenant key is not 'the whole company'. It is an incomplete row.",
          chart: chart(
            `flowchart LR
    Q([Question plus tenant]) --> Pred{Tenant present}
    Pred -->|no| Refuse([Refuse])
    Pred -->|yes| Filt[Keep this tenant only]
    Filt --> Rank[Rank]
    Rank --> Desk[Window with source ids]`,
            `class Q,Refuse,Desk hub
    class Pred grp2
    class Filt,Rank grp1`
          ),
        },
      ],
      codes: [
        {
          title: "Tenant first, then similarity",
          language: "python",
          code: `def retrieve(query: str, tenant: str, store) -> list[dict]:
    if not tenant:
        return []
    rows = store.search(query, where={"tenant": tenant}, k=5)
    return [{"id": r.id, "text": r.text, "source": r.source} for r in rows]`,
        },
      ],
    },
    {
      id: "eval-the-packer",
      level: "advanced",
      title: "Test the packer like it is a product",
      body: [
        "The simple habit is to judge the final paragraph. The better habit is to judge the window. Did the order row survive packing? Did a foreign tenant appear? Was a number rewritten?",
        "Build a tiny suite. Each fixture is a ticket, a pile of candidate evidence, and a list of source ids that must appear. Run the packer without calling a model. Assert the required ids are present and foreign ids are absent.",
        "Then add a second check on the answer: every number in the draft exists in the evidence block as the same digits. That check would have caught 'about forty'.",
        "Operate it. Log packed token counts by block. When cost jumps, you will see that history grew, not that the model 'got worse'. When an answer is wrong, open the packed window first. Half of 'model quality' bugs are packing bugs.",
        "When not to add more context. If the path is a simple lookup, retrieve one row and stop. Extra loops that 'gather more' add latency, cost, and a chance to drown the fact you already had.",
        "At this point you should be able to explain context engineering without the phrase 'paste more': select, budget, isolate, prove.",
      ],
      codes: [
        {
          title: "The number in the draft must exist in evidence",
          language: "python",
          code: `import re

def numbers_are_grounded(draft: str, evidence: str) -> bool:
    found = re.findall(r"\\d+(?:\\.\\d+)?", draft)
    return all(n in evidence for n in found)`,
        },
      ],
    },
  ],

  workedExample: {
    title: "Pack a refund ticket so 27.00 cannot become forty",
    setup:
      "A customer asks for a refund on order 88213. Sources available: the order row, a long Slack export, a policy excerpt, and an old ticket from another account that refunded 42 dollars.",
    walkthrough: [
      "Step 1 — Understand the problem. The model will quote whatever is on the desk. The true amount lives only on the order row.",
      "Step 2 — Identify the relevant concept. Named blocks plus a budget. Tenant isolation. Numbers must be copied.",
      "Step 3 — Build the simplest solution. Blocks: goal, policy, evidence. Evidence is only the order row. Ignore Slack for v1.",
      "Step 4 — Improve it. Allow a short policy excerpt. Rank Slack against the goal and keep at most three messages. Clip narrative, never remaining_cents.",
      "Step 5 — Handle a failure or edge case. The old 42-dollar ticket has a different tenant. The retrieve filter drops it before ranking.",
      "Step 6 — Explain the production version. Log block sizes. A test asserts source id order-88213 is present and remaining_cents 2700 appears unchanged.",
    ],
    result:
      "The packed window cites 27.00 from the order row. The goodwill chat and the foreign ticket never get a vote.",
  },

  practice: {
    title: "A support helper with a fat history",
    task:
      "A support agent currently concatenates the last 40 messages, the top 8 search hits, and the user profile on every turn. Users report answers that quote old prices. Problem: design named blocks, give each a budget, say what you select against, and say what you refuse to summarise. Then name one packing test you would put in CI. Think about: which block is allowed to contain a price, and whether old prices are a selection problem or a 'smarter model' problem.",
    hint:
      "Old prices are usually a selection problem or a missing effective-date field. Ask which block is allowed to contain a price. Expected reasoning: named blocks with budgets; select articles against the current question; never summarise prices; a fixture where history says 19 and policy says 29.",
    solution:
      "Blocks: goal (current user turn), policy (pinned, small), profile (few facts, tenant-keyed), evidence (retrieved articles filtered by product edition and date), history (compressed older turns, last tool result raw). Budgets: policy 800, goal 300, profile 400, evidence 3000, history 1000. Select articles against the current question, not against 'this account'. Never summarise prices, plan names, or dates — copy them. CI test: a fixture whose newest policy says 29 and whose history says 19; the packed evidence must include the 29 row and the draft check fails if 19 appears as the quoted price. Why this works: the packer, not the model, decides which price is even in the room. Common wrong approach: raise the window limit and keep concatenating.",
  },

  takeaways: [
    "The model only sees the text you packed on this call. Missing evidence becomes a confident guess.",
    "Prompt engineering writes standing instructions. Context engineering chooses the evidence under a size limit.",
    "Named blocks beat one dump. You can budget, log, and test each block.",
    "Select against this question, then compress narrative. Copy numbers, ids, and dates exactly.",
    "Filter by tenant before ranking. A similar ticket from another customer is a breach, not a clever retrieve.",
    "Every claim in the window should carry a source id. If the id is gone, the claim is not allowed.",
  ],

  mistakes: [
    "Mistake: paste the whole history every turn. Why people make it: it feels thorough. What actually happens: the real fact is crowded out. Better approach: named blocks and a history budget.",
    "Mistake: summarise amounts to save tokens. Why people make it: summaries are shorter. What actually happens: 27.00 becomes 'about forty'. Better approach: copy figures as fields.",
    "Mistake: retrieve by 'this user' instead of 'this goal'. Why people make it: personalization sounds smart. What actually happens: old tickets outvote the current order. Better approach: rank against the question.",
    "Mistake: treat a larger window as a strategy. Why people make it: truncation hurts. What actually happens: you stop selecting and the model drowns. Better approach: select, then raise the limit only if needed.",
    "Mistake: mix two customers because the tickets look alike. Why people make it: vector search returns neighbours. What actually happens: a privacy incident. Better approach: tenant filter first.",
    "Mistake: judge only the final paragraph. Why people make it: that is what the user sees. What actually happens: packing bugs look like model bugs. Better approach: test that required source ids survived.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "How is context engineering different from prompt engineering?",
      answer:
        "What they are testing: the standing order versus the packed desk. Good answer: prompt engineering writes instructions; context engineering is the runtime system that selects, budgets, isolates, and attributes what sits in the window on each call. Why that is good: it names a system, not a prettier paragraph. Follow-up: what would you log on every call?",
    },
    {
      difficulty: "medium",
      question:
        "A support agent started quoting last quarter's price. The system prompt did not change. Where do you look first?",
      answer:
        "What they are testing: packing as the first suspect. Good answer: open the packed window; check which block contained the price, whether an old article survived selection, and whether a number was summarised. Why that is good: you did not start by rewriting the prompt. Follow-up: how would you stop old prices at retrieve time?",
    },
    {
      difficulty: "hard",
      question:
        "How would you design a packer for a multi-tenant agent that also has long chat history and tools?",
      answer:
        "What they are testing: budgets, isolation, and freshness of tool results. Good answer: named blocks with budgets; tenant filter before rank; last tool result raw; older history compressed; every evidence row has a source id; tests that required ids survive and foreign ids cannot appear. Why that is good: you treated the window as architecture. Follow-up: when would you refuse to answer rather than pack more?",
    },
  ],

  glossary: [
    {
      term: "Context window",
      meaning:
        "The text the model can see on this one call. Why it matters: if a fact is not in the window, the model can only guess.",
    },
    {
      term: "Context engineering",
      meaning:
        "The runtime job of choosing, shrinking, isolating, and proving what goes in the window. Why it matters: instructions cannot rescue a bad pile of evidence.",
    },
    {
      term: "Named block",
      meaning:
        "A labelled section of the prompt, such as goal or evidence. Why it matters: you can budget and test a section; you cannot test a dump.",
    },
    {
      term: "Token budget",
      meaning:
        "A size limit you assign to a block. Why it matters: something must lose when the window is full, and you should choose what loses.",
    },
    {
      term: "Tenant isolation",
      meaning:
        "Keeping one customer's rows out of another customer's window. Why it matters: similarity is not permission.",
    },
    {
      term: "Provenance",
      meaning:
        "A source id attached to a piece of evidence. Why it matters: you can cite, debug, and refuse claims with no source.",
    },
  ],
};
