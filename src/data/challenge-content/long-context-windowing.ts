import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "long-context-windowing",
  instructor:
    "I teach this from zero. If you have never heard 'context window' or 'lost in the middle', that is fine. We will start with what the model can see in one call, then why dumping everything in still hides the sentence you needed.",
  promise:
    "You will leave knowing what a context window is, why a million tokens is not a memory system, what lost-in-the-middle feels like, how to pack a prompt on purpose, and when to retrieve instead of paste.",

  story: {
    title: "The apology that lived in the middle",
    body: [
      "A finance team built a dispute assistant that was supposed to 'have the whole case'. They pasted every ticket, every call summary, and every letter into one prompt. The new model advertised a very large context window — room for a huge amount of text in a single call. The average case almost filled that room. They deleted their search step. A short demo case looked like magic. They shipped.",
      "A regulator asked whether the bank had admitted fault on case D-902. The assistant said no. The first ticket was a standard denial. The last email asked for payment. Both sat at the beginning and the end of the prompt. In the middle of the pile, in a letter the customer had uploaded, a junior officer had written 'we should not have charged this fee and I apologise'. The model did not use it.",
      "After the incident they hid a test sentence in a long dump and moved it around. The model found it near the start and the end. It missed it in the middle most of the time. The legal team had treated the window like a filing cabinet. It was more like a spotlight: bright at the edges, dim in the centre.",
      "They put search back, but they did not go back to blind top-five. They pinned the case header and the legal question, selected the few pages that mattered, and made every sentence point at a span they could open. The 180,000-token dump became a few thousand chosen tokens. The apology ranked. The answer flipped.",
    ],
    moral:
      "A large window is a larger buffer, not a brain. If you hide a fact in the middle of a dump, you did not 'provide' it. You buried it and then blamed the model for not digging.",
  },

  stages: [
    {
      id: "what-context-is",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Let us start from zero. When you send a question to a model, you do not only send the question. You also send instructions, earlier turns, and any files you pasted. All of that text is the context: the pile of words the model is allowed to look at while it writes the next answer.",
        "The context window is the size of that pile, measured in tokens. A token is a chunk of text the model reads, often a short word or part of a word. 'Audit' might be one token. A long number might be several. You do not need the exact rules. You need the idea: the window is finite. If you go past it, something is cut.",
        "Here is a tiny picture. A desk has room for ten pages. If you dump a two-hundred-page case on the desk, pages fall on the floor. Even if the desk is upgraded to hold two hundred pages, the reader still has a habit of looking at the cover and the last page first.",
        "What happens without a plan for the desk? Teams paste everything, hit the limit, or stay under the limit and still miss the middle. Cost and slowness go up either way, because you pay for every token you send, not only the ones the model used.",
        "At this point you should understand the problem: the model only sees what you packed, and packing is a design, not a dump.",
      ],
      diagrams: [
        {
          title: "The desk has a size",
          caption:
            "Tokens you send all count. Tokens the model ignores still appear on the bill.",
          chart: chart(
            `flowchart LR
    Instr[Instructions] --> Desk[One model call]
    Hist[Earlier turns] --> Desk
    Files[Pasted files] --> Desk
    Q([Question]) --> Desk
    Desk --> Cut{Over the window?}
    Cut -->|yes| Drop([Something is dropped])
    Cut -->|no| Reply([An answer])`,
            `class Q,Drop,Reply hub
    class Instr,Hist,Files grp1
    class Desk,Cut grp2`
          ),
        },
      ],
    },
    {
      id: "window-is-not-memory",
      level: "beginner",
      title: "A long window is not a memory system",
      body: [
        "People hear 'this model takes a million tokens' and think the product now remembers everything. Memory, in a product, is something you can query later: a database row, a case file, a search index. A context window is only the pages on the desk for this one call.",
        "They look similar because both 'hold text'. The important difference is lifetime. When the call ends, the window is gone. The next call starts with whatever you pack again. If you do not store the case outside the prompt, you do not have memory. You have a habit of pasting.",
        "A million tokens is also not attention. Attention is how the model decides which tokens matter for the next word. That process is uneven. Extra room lets you include more candidates. It does not guarantee the model will use the one you cared about.",
        "Here is the key idea. Long context is a bigger buffer you can fill on purpose. It is useful for a long contract you already selected, or a thread you are still in. It is a poor substitute for retrieval, for a database, or for a checkpoint from the state-machine sitting.",
        "At this point you should be able to say: window size is capacity. Memory is a store. Do not spend the sitting arguing about marketing numbers. Spend it on what you put in the window.",
      ],
      diagrams: [
        {
          title: "Capacity versus a store",
          caption:
            "The window dies with the call. A store is what you read on the next call.",
          chart: chart(
            `flowchart TD
    Call1[Call one: packed pages] --> Gone[Call ends]
    Gone --> Empty[Window is empty]
    Store[(Case store)] --> Call2[Call two: pack again]
    Empty -.->|does not feed| Call2`,
            `class Call1,Call2 hub
    class Gone,Empty grp3
    class Store grp1`
          ),
        },
      ],
    },
    {
      id: "lost-in-the-middle",
      level: "beginner",
      title: "The simplest failure: lost in the middle",
      body: [
        "Researchers put a fact in a long prompt and moved it. Models used it more often when it sat at the start or the end. They used it less when it sat in the middle. That pattern is called lost-in-the-middle. You do not need the paper to use the idea. You need a test.",
        "The everyday picture is a stack of mail. People read the top letter and the last letter. The middle of the pile is where things hide. A large desk still has a middle.",
        "What are we trying to do? Prove whether your packing works. Hide a canary sentence — a unique line that answers a question — at the start, the middle, and the end of a realistic dump. Ask the question. Record whether the answer uses the canary.",
        "Let's understand what the story did wrong. They provided the apology. Providing is not the same as placing. The denial and the payment ask sat on the bright edges. The apology sat in the dim middle.",
        "At this point you should understand the simplest failure: a fact can be inside the window and still be unused. Next we pack on purpose.",
      ],
      codes: [
        {
          title: "canary.py — move a sentence and see if it is used",
          language: "python",
          code: `CANARY = "CANARY-NOTE: fee reversed on 12 March."


def pack(pages: list[str], where: str) -> str:
    body = list(pages)
    if where == "start":
        body = [CANARY, *body]
    elif where == "finish":
        body = [*body, CANARY]
    else:
        mid = len(body) // 2
        body = [*body[:mid], CANARY, *body[mid:]]
    return "\\n\\n".join(body)


def used(answer: str) -> bool:
    return "12 March" in answer or "CANARY-NOTE" in answer`,
        },
      ],
    },
    {
      id: "pin-select-prove",
      level: "intermediate",
      title: "How we pack: pin, select, prove",
      body: [
        "Packing has three verbs. Pin: some lines always sit at the bright edges — the case id, the legal question, the instruction 'quote or say you do not know'. Select: choose a few pages that matter, do not paste the warehouse. Prove: every factual sentence points at a span you can open, the same join as RAG.",
        "What are we trying to do? Build a prompt that has a header, a small selected body, and a footer. The header and footer are pinned. The body is retrieved or picked by a human rule, not by 'everything in the folder'.",
        "Here is the smallest version. Header: case D-902, question about admission of fault. Body: the top few letters that mention fault, fee, or apology. Footer: 'answer from the spans below; name the span id'. The dump never enters.",
        "Let's understand why this is still 'long context'. You may still send thousands of tokens. You are just refusing to send the useless ones. A 200k window is a budget. Spend it on selected pages, not on proving you can fill it.",
        "Windowing, in this sitting, means choosing which slice of a long thing is on the desk. It is not a special model feature. It is your packing code.",
      ],
      codes: [
        {
          title: "pack.py — header, selected body, footer",
          language: "python",
          code: `def pack_case(case_id: str, question: str, spans: list[tuple[str, str]]) -> str:
    header = f"Case {case_id}. Question: {question}\\nUse only the spans."
    body = "\\n\\n".join(f"[{sid}]\\n{text}" for sid, text in spans)
    footer = "Name the span id for every factual sentence. If none apply, say you do not know."
    return f"{header}\\n\\n{body}\\n\\n{footer}"`,
        },
      ],
      diagrams: [
        {
          title: "Pin the edges, select the middle",
          caption:
            "The bright edges hold the question and the rule. The middle holds only pages you chose.",
          chart: chart(
            `flowchart TD
    Pin[Pinned header: case and question] --> Desk[Prompt]
    Sel[Selected spans] --> Desk
    Rule[Pinned footer: cite or refuse] --> Desk
    Desk --> Ans([Answer])`,
            `class Ans hub
    class Pin,Rule grp1
    class Sel,Desk grp2`
          ),
        },
      ],
    },
    {
      id: "when-dump-tempts",
      level: "intermediate",
      title: "When the simple pack is not enough",
      body: [
        "Sometimes the selected top five still miss. The apology used a wording your search did not know. Then you widen: more spans, a second query, a keyword search for 'apologis' and 'fault'. You do not widen by pasting the rest of the case 'just in case'. That puts the dim middle back.",
        "Another break is conversation history. A long chat will fill the window by itself. You cannot pin a case header if last week's small talk ate the budget. Summarize old turns into a short note, or drop them, and keep the pinned lines. History is not sacred. The question is.",
        "Streaming files have the same shape. A 400-page PDF is not one object you must honor. It is a list of pages you can select from. If a vendor says 'just upload the PDF', they are selling a dump. You still window.",
        "They look similar — long context and RAG — because both put text in the prompt. The important difference is how text is chosen. RAG is search. Long context is capacity. Good products use capacity to hold the search results, not to skip search.",
        "Pause and check. If you must include a 50-page contract, where do you put the clause you already know matters? At an edge, or repeated at both edges, not buried between schedules and signatures.",
      ],
    },
    {
      id: "how-it-fits",
      level: "intermediate",
      title: "How packing fits in a real application",
      body: [
        "Put the pieces on one path. The case lives in a store. A retrieve step selects spans. A packer pins header and footer and fills the middle until a token budget. The model writes. A checker joins claims to span ids. If the canary test starts failing after a prompt change, you packed worse, even if the window got larger.",
        "Count tokens on the way in. If the selected body is still huge, you are not selecting. Tighten the query. If the user uploaded a novel, tell them you will work from the pages that match the question, not from page 1 through 400.",
        "Cost is part of packing. A 200k prompt that misses the middle is more expensive than a 4k prompt that hits. Latency follows the same curve. Long context is not free attention. It is a larger bill for a dimmer middle.",
        "Connect this back to RAG. The retrieve sitting taught you to find pieces. This sitting taught you that stuffing those pieces carelessly can still hide them. Pin, select, prove is how the two sittings meet.",
        "At this point you should be able to draw your prompt as three bands and say what is allowed in each band.",
      ],
      diagrams: [
        {
          title: "Store, select, pack, check",
          caption:
            "The window is the last mile. The store and the selector do the memory work.",
          chart: chart(
            `flowchart LR
    Store[(Case store)] --> Sel[Select spans]
    Sel --> Pack[Pin and pack]
    Pack --> Model[Model writes]
    Model --> Check[Join to span ids]
    Check --> Out([Published answer])`,
            `class Out hub
    class Store,Sel grp1
    class Pack,Model grp2
    class Check grp3`
          ),
        },
      ],
    },
    {
      id: "how-windows-fail",
      level: "advanced",
      title: "How long context fails in production",
      body: [
        "Now that you understand packing, look at the failures. The first is silent truncation. The provider cuts the start or the end of your prompt when you overflow. If they cut the footer, you lose the cite-or-refuse rule. If they cut the header, you lose the question. Know which side your provider cuts. Pack so the pinned lines are in the side that survives, or refuse to send an oversized prompt.",
        "The second is lost-in-the-middle after a 'successful' send. The canary test is how you see it. Do not argue with a blog post that says the new model 'solved' it. Measure on your dumps.",
        "The third is history blow-up. A helpful chat keeps every tool printout. By turn twenty the room is a novel. Compact printouts. Keep the fact that a tool ran. Drop the 4,000-word body or store it behind a handle.",
        "The fourth is treating the window as a compliance archive. Legal asked 'did the model see the apology?' Seeing means used, not merely present. If you need proof, you need a citation to a span, not a token count.",
        "When you debug, ask: what was pinned, what was selected, where did the missing sentence sit, and did we overflow? Those four answers beat 'try a bigger model'.",
      ],
      codes: [
        {
          title: "compact.py — keep the fact a tool ran, drop the novel",
          language: "python",
          code: `def compact_turn(tool: str, body: str, handle: str) -> str:
    if len(body) < 400:
        return f"{tool} -> {body}"
    return f"{tool} -> ok, stored as {handle}; ask to fetch if you need the full text"`,
        },
      ],
    },
    {
      id: "production-judgment",
      level: "advanced",
      title: "Production judgment: when to widen, when to retrieve",
      body: [
        "This approach — a larger window — is useful when the working set is already small and ordered: a single contract, a short thread, a selected packet. You might avoid it as the only strategy when the corpus is a company. That is a search problem wearing a context-size sticker.",
        "Trade-offs are plain. Wider windows reduce engineering for small packets and raise cost, latency, and middle-dimness for large ones. Retrieval adds a job and a failure mode (wrong spans) and fixes the dump. Most production systems want both: retrieve first, then use as much window as the selected packet needs.",
        "Do not delete RAG because a vendor raised the advertised number. Do not refuse long context when you already have twenty relevant pages. Use the window to hold what you chose.",
        "A good interview answer names the canary test, the three verbs, and the difference between capacity and memory. The learner who can teach this now says: I pack a desk. I do not rent a warehouse and call it thinking.",
        "Remember this: a million tokens is not a memory system. You still select, pin, and prove.",
      ],
      codes: [
        {
          title: "budget.py — refuse an oversized dump",
          language: "python",
          code: `def fit(header: str, spans: list[str], footer: str, limit: int, count) -> list[str]:
    kept: list[str] = []
    used = count(header) + count(footer)
    for span in spans:
        n = count(span)
        if used + n > limit:
            break
        kept.append(span)
        used += n
    if not kept:
        raise ValueError("nothing fits; refuse the dump")
    return kept`,
        },
      ],
      diagrams: [
        {
          title: "Widen only after select fails",
          caption:
            "A bigger window is one fix. A better span is usually cheaper.",
          chart: chart(
            `flowchart TD
    Miss([Missed fact]) --> Where{Where was it?}
    Where -->|not selected| Retr[Fix retrieve]
    Where -->|middle of dump| Pack[Pin and shrink]
    Where -->|truncated| Limit[Refuse overflow]
    Where -->|true need more pages| Wide[Then widen the window]`,
            `class Miss hub
    class Where grp2
    class Retr,Pack,Limit grp1
    class Wide grp3`
          ),
        },
      ],
    },
  ],

  workedExample: {
    title: "Did we admit fault on case D-902?",
    setup:
      "The case file is 180,000 tokens. The denial is first. The payment ask is last. An apology letter sits near page 80. The assistant said no admission exists.",
    walkthrough: [
      "Step 1 — Understand the problem. The fact is in the file and unused. A dump is not a briefing.",
      "Step 2 — Identify the relevant concept. Lost-in-the-middle, plus packing: pin, select, prove.",
      "Step 3 — Build the simplest solution. Pin the question at the start and the cite-or-refuse rule at the end. Select letters that mention fault, fee, or apology.",
      "Step 4 — Improve it. Give each span an id. Require the answer to name a span. Hide a canary and move it to confirm the packer.",
      "Step 5 — Handle a failure. If select misses the apology wording, add a keyword query. Do not paste the other 170,000 tokens.",
      "Step 6 — Production version. The case stays in a store. Each call packs a budgeted packet. Overflow is a refusal, not a silent cut. Legal sees span links, not a token count.",
    ],
    result:
      "The assistant quotes the apology with a span id. The dump is gone. A larger advertised window was not the fix.",
  },

  practice: {
    title: "Stop treating the window like a filing cabinet",
    task:
      "A team wants to delete search because the new model 'handles a million tokens'. Their average packet is 200,000 tokens of mixed tickets. Design the packing rules you would require before launch. Include a test they must pass.",
    hint:
      "Name the three verbs. Ask where a canary would sit. Ask what happens on overflow.",
    solution:
      "Expected reasoning: capacity is not memory and not attention.\n\nSolution: pin header and footer. Select spans with search. Prove claims with span ids. Canary test at start, middle, and end of a realistic packet. Overflow refuses or is packed to a known surviving side — never a silent cut of the rule. History is compacted.\n\nWhy it works: the model is briefed, not buried.\n\nCommon wrong approach: upload the folder and add 'please read carefully' to the system prompt.",
  },

  takeaways: [
    "The context window is the finite pile of tokens the model can see in one call. It is capacity, not a brain.",
    "A long window is not a memory system. Memory is a store you can read on the next call.",
    "Lost-in-the-middle means a fact can sit inside the window and still be unused, especially in a dump.",
    "Pack with three verbs: pin the question and the rule, select the pages, prove each claim with a span.",
    "You pay for every token you send. A huge unused middle is a bill for dim attention.",
    "Use long context to hold what you chose. Use retrieval to choose. Do not delete search because a number got bigger.",
  ],

  mistakes: [
    "Mistake: paste the whole case because the window is large. Why people make it: the demo with a short case worked. What actually happens: the needed sentence sits in the dim middle. Better approach: select, then pack.",
    "Mistake: call the window 'memory'. Why people make it: the marketing sentence sounds like storage. What actually happens: the next call starts empty unless you pack again. Better approach: store the case outside the prompt.",
    "Mistake: ignore overflow. Why people make it: the average case fits. What actually happens: a large case loses the footer rule or the question. Better approach: count tokens and refuse or trim on purpose.",
    "Mistake: keep every chat turn forever. Why people make it: dropping history feels rude. What actually happens: small talk evicts the pinned header. Better approach: compact old turns.",
    "Mistake: treat 'present in the prompt' as 'the model used it'. Why people make it: legal asked if it was provided. What actually happens: you cannot prove the apology was used. Better approach: cite a span.",
    "Mistake: delete RAG when the context number rises. Why people make it: one less system. What actually happens: you rebuild the dump. Better approach: retrieve first, then use the window you need.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "What is a context window, in plain language?",
      answer:
        "What they are testing: capacity versus magic.\n\nGood answer: it is the finite amount of text the model can see in one call, measured in tokens. If you send more, something is cut. Seeing is not the same as using.\n\nWhy that is good: it names the limit.\n\nFollow-up: why is that not memory?",
    },
    {
      difficulty: "medium",
      question: "A fact was in a 100k prompt and the model missed it. What do you do first?",
      answer:
        "What they are testing: lost-in-the-middle and packing.\n\nGood answer: I check where the fact sat, whether we overflowed, and whether we selected or dumped. I pin the question, shrink the middle, and run a canary at start, middle, and end. I do not start by buying a larger window.\n\nWhy that is good: it treats placement as the bug.\n\nFollow-up: how do you prove a packer change helped?",
    },
    {
      difficulty: "hard",
      question: "When would you still send tens of thousands of tokens on purpose?",
      answer:
        "What they are testing: judgment, not a ban on long context.\n\nGood answer: when I already selected a working set that is inherently long — a contract packet, a statute plus the clauses I need — and I pin the question and cite spans. I would not send tens of thousands as a substitute for search over a company corpus.\n\nWhy that is good: it uses capacity after choice.\n\nFollow-up: how do you mix retrieval and a large window in one design?",
    },
  ],

  glossary: [
    {
      term: "Context",
      meaning:
        "The text packed into one model call: instructions, history, files, and the question. Why it matters: the model can only use what you sent.",
    },
    {
      term: "Context window",
      meaning:
        "The maximum size of that text, in tokens. Why it matters: overflow cuts something, and even a fit dump can hide the middle.",
    },
    {
      term: "Token",
      meaning:
        "A chunk of text the model reads, often a short word or part of a word. Why it matters: you pay and pack in tokens, not pages.",
    },
    {
      term: "Lost-in-the-middle",
      meaning:
        "The pattern that models use facts at the start and end of a long prompt more than facts in the middle. Why it matters: providing a sentence is not placing it.",
    },
    {
      term: "Pinning",
      meaning:
        "Forcing the question and the rules to sit at the bright edges of the prompt. Why it matters: those lines must survive both attention and truncation.",
    },
    {
      term: "Windowing",
      meaning:
        "Choosing which slice of a long source sits on the desk for this call. Why it matters: it is packing, not a special model switch.",
    },
  ],
};
