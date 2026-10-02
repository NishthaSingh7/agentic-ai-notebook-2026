import { createLesson, type LessonInput } from "./builder";
import { pastelChart } from "@/lib/mermaid-pastel";

function b(...lines: string[]) {
  return lines.map((l) => `- ${l}`).join("\n");
}

function lesson(input: LessonInput) {
  return createLesson({
    ...input,
    visualFirst: true,
    practiceTask: "",
    code: undefined,
    codeLanguage: undefined,
    furtherReading: input.furtherReading ?? [
      {
        title: "What is Context Engineering? — Simplilearn",
        url: "https://www.youtube.com/watch?v=IJoP_Z0LpDs",
      },
    ],
  });
}

export const contextEngineeringLessons: Record<string, ReturnType<typeof createLesson>> = {
  "what-is-context-engineering": lesson({
    concept: b(
      "Context engineering is how you set up everything a model needs before it starts work",
      "That setup is rules, data, memory, tools, and the output you want back",
      "The goal is to make a hard task something the model can actually solve",
      "Without that setup, the model guesses. With it, the model can reason"
    ),
    whyItExists:
      "A model only knows what you put in front of it. A vague request leaves it to invent the rest.",
    analogy:
      "Asking a chef to make dinner is a guess. Giving the pantry, the allergies, the guest count, and the plating style is a brief.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Vague["Make dinner"] --> Guess["A random meal"]
    Brief["Pantry, diet, guests"] --> Fit["A meal that fits"]`,
      `class Vague,Guess grp1
    class Brief,Fit grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Context])

    subgraph Formula["The formula"]
        R["Rules"]
        D["Data"]
        M["Memory"]
        T["Tools"]
        O["Output shape"]
    end

    subgraph Goal["Why you do it"]
        G1["Hard task"]
        G2["Becomes solvable"]
        G3["Less guessing"]
    end

    Hub --> Formula
    Hub --> Goal`,
      `class Hub hub
    class R,D,M,T,O grp1
    class G1,G2,G3 grp2
    style Formula fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Goal fill:#ecfdf5,stroke:#6ee7b7,color:#065f46`
    ),
    workflowDiagrams: [
      {
        title: "The picky chef",
        caption: "Same request. The second kitchen has the facts the chef needs.",
        chart: pastelChart(
          `flowchart TD
    Ask["Make dinner"] --> No["No rules, no pantry"]
    No --> Random["Unpredictable plate"]
    Ask --> Yes["Diet, guests, history"]
    Yes --> Tailored["A plate that fits"]`,
          `class Ask hub
    class No,Random grp1
    class Yes,Tailored grp2`
        ),
      },
    ],
    technicalExplanation: "",
    example:
      "You ask for a website launch plan and get generic phases. The model never heard your deadline, your team size, or that you need a checklist.",
    exampleSolution:
      "Write the brief before you ask. Name the rules, the facts you already have, what the model should remember, which tools it may use, and the shape of the answer you want.",
    commandsToRemember: [
      "Context = rules + data + memory + tools + output",
      "A vague ask invites a guess",
      "Make the task solvable on purpose",
      "The model cannot see what you left out",
    ],
    revisionNotes: {
      cheatSheet: [
        "Rules + data + memory + tools + output",
        "Chef needs the pantry, not just 'make dinner'",
        "Goal: a hard task becomes solvable",
        "Guessing is what you get with no brief",
      ],
    },
    glossary: ["Context Engineering", "Prompt", "Context Window"],
    commonMistakes: [
      "Treating a one-line request as a complete brief",
      "Assuming the model already knows your rules",
      "Skipping the output shape, then blaming the format",
    ],
    learnElsewhere: [
      "Agent Memory — Phase 5",
      "Tool Calling — Phase 7",
      "Walkthrough: Simplilearn, What is Context Engineering?",
    ],
  }),

  "vibe-coding": lesson({
    concept: b(
      "Vibe coding is asking for a whole app with a vague sentence and no plan",
      "It showed up in early 2024: 'build me a to-do app' or 'make a landing page'",
      "It fails when the work has to last: invented APIs, messy files, and weak tests",
      "A gut feeling does not scale. A plan, a structure, and clear rules do"
    ),
    whyItExists:
      "A short prompt can produce a demo. The same prompt falls apart when the app has to be trusted, tested, and extended.",
    analogy: "Sketching a house on a napkin is not the same as handing over the blueprints.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Napkin["Napkin sketch"] --> Demo["A demo"]
    Plans["Blueprints"] --> Build["A build you can extend"]`,
      `class Napkin,Demo grp1
    class Plans,Build grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Vibe coding])

    subgraph Ask["The ask"]
        A1["Build a to-do app"]
        A2["No architecture"]
        A3["No rules"]
    end

    subgraph Breaks["Where it breaks"]
        B1["Invented APIs"]
        B2["One giant file"]
        B3["Missing tests"]
        B4["Low trust"]
    end

    Hub --> Ask
    Hub --> Breaks`,
      `class Hub hub
    class A1,A2,A3 grp1
    class B1,B2,B3,B4 grp2
    style Ask fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Breaks fill:#fee2e2,stroke:#fca5a5,color:#991b1b`
    ),
    workflowDiagrams: [
      {
        title: "Guesswork vs a brief",
        caption: "Vibe coding is the model plus a guess. Context engineering is the model plus a plan.",
        chart: pastelChart(
          `flowchart LR
    Vibe["Vague prompt"] --> Guess["AI plus guesswork"]
    Brief["Plan and rules"] --> Clear["AI plus structure"]`,
          `class Vibe,Guess grp1
    class Brief,Clear grp2`
        ),
      },
    ],
    technicalExplanation: "",
    example:
      "'Build me a to-do app' often invents a library that does not exist, puts everything in one file, and skips the empty-list case.",
    exampleSolution:
      "Replace the vibe with a brief: language, folder layout, the real API you use, the tests that must pass, and the output shape. Then review the result. A Codeium report on AI code quality found that 76 percent of developers do not trust AI-written code without a human review.",
    commandsToRemember: [
      "Vibe coding = AI plus guesswork",
      "Context engineering = AI plus a plan",
      "Name the API, the files, and the tests",
      "Review before you trust it",
    ],
    revisionNotes: {
      cheatSheet: [
        "A gut feeling does not scale",
        "Invented APIs are a vibe-coding smell",
        "One file and no tests will not last",
        "Structure is the fix, not a longer vibe",
      ],
    },
    glossary: ["Context Engineering", "Hallucination"],
    commonMistakes: [
      "Shipping the first generated app without reading it",
      "Asking for 'clean code' without saying what clean means",
      "Skipping tests because the demo looked fine",
    ],
  }),

  "prompt-vs-context": lesson({
    concept: b(
      "Prompt engineering is how you phrase one request",
      "Context engineering is the binder you hand over so the job can be done again",
      "A prompt aims at one acceptable answer. Context aims at repeatable work",
      "Casual chat can live on a prompt. A product needs the binder"
    ),
    whyItExists:
      "People keep rewriting the same clever sentence. The missing piece is usually the environment, not a better adjective.",
    analogy: "A prompt is asking for a favor in one sentence. Context is handing over the reference binder.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Favor["One sentence"] --> Once["One reply"]
    Binder["The binder"] --> Again["The same job, again"]`,
      `class Favor,Once grp1
    class Binder,Again grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Two jobs])

    subgraph Prompt["Prompt engineering"]
        P1["How you phrase it"]
        P2["One to three lines"]
        P3["One good reply"]
        P4["Chat and brainstorms"]
    end

    subgraph Context["Context engineering"]
        C1["The whole environment"]
        C2["Rules, files, examples"]
        C3["Repeatable steps"]
        C4["Apps and agents"]
    end

    Hub --> Prompt
    Hub --> Context`,
      `class Hub hub
    class P1,P2,P3,P4 grp1
    class C1,C2,C3,C4 grp2
    style Prompt fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Context fill:#ecfdf5,stroke:#6ee7b7,color:#065f46`
    ),
    workflowDiagrams: [
      {
        title: "Same to-do app, two briefs",
        caption: "The short line hopes for clean code. The binder says which language, which API, and which JSON to return.",
        chart: pastelChart(
          `flowchart LR
    Short["Write a to-do app"] --> Hope["Hit or miss"]
    Long["Rules plus API docs"] --> Steady["Predictable output"]`,
          `class Short,Hope grp1
    class Long,Steady grp2`
        ),
      },
    ],
    technicalExplanation: "",
    example:
      "'Write a clean Python to-do app' might return a script, a tutorial, or a half app. A binder that says TypeScript, the real API, and a JSON schema returns the same kind of result each time.",
    exampleSolution:
      "Keep the sentence if you want. Then add the binder: system rules, the language, the API docs, two examples, and the JSON shape. Use a prompt for a one-off chat. Use the binder when the job must be repeatable.",
    commandsToRemember: [
      "Prompt = the sentence",
      "Context = the binder",
      "One reply vs a system you can rerun",
      "Chat can be a prompt. A product cannot",
    ],
    revisionNotes: {
      cheatSheet: [
        "Favor vs reference binder",
        "Phrasing vs environment",
        "One-off vs repeatable",
        "Hit-or-miss vs predictable",
      ],
    },
    glossary: ["Prompt", "Context Engineering", "System Prompt"],
    commonMistakes: [
      "Rewriting the sentence when the binder is empty",
      "Using a chat prompt as the spec for a product",
      "Calling every instruction 'context' when it is still one line",
    ],
  }),

  "context-ingredients": lesson({
    concept: b(
      "Good context has six ingredients, and each one has a job",
      "Rules and the user's ask tell the model how to behave and what to do now",
      "Short-term memory is this chat. Long-term memory is what should survive it",
      "Docs and the current step stop the model from inventing facts or skipping ahead"
    ),
    whyItExists:
      "If one ingredient is missing, the model fills the gap. That fill is where wrong APIs and skipped steps come from.",
    analogy: "A recipe card is not the pantry, the guests, or the timer. You need all of them.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Card["Recipe card"] --> Miss["Missing pantry"]
    All["Card plus pantry"] --> Dish["The dish"]`,
      `class Card,Miss grp1
    class All,Dish grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Six ingredients])

    subgraph Now["This request"]
        I1["1. System rules"]
        I2["2. User ask"]
    end

    subgraph Remember["What it remembers"]
        I3["3. This chat"]
        I4["4. Saved prefs"]
    end

    subgraph Outside["Outside the chat"]
        I5["5. Docs and APIs"]
        I6["6. Current step"]
    end

    Hub --> Now
    Hub --> Remember
    Hub --> Outside`,
      `class Hub hub
    class I1,I2 grp1
    class I3,I4 grp2
    class I5,I6 grp3
    style Now fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Remember fill:#eff6ff,stroke:#93c5fd,color:#1e40af
    style Outside fill:#ecfdf5,stroke:#6ee7b7,color:#065f46`
    ),
    workflowDiagrams: [
      {
        title: "One call, six slots",
        caption: "Fill the slots you have. Leave a slot empty on purpose, not by accident.",
        chart: pastelChart(
          `flowchart LR
    Rules["Rules"] --> Call["This call"]
    Ask["User ask"] --> Call
    Chat["This chat"] --> Call
    Prefs["Saved prefs"] --> Call
    Docs["Docs"] --> Call
    Step["Current step"] --> Call`,
          `class Rules,Ask grp1
    class Chat,Prefs grp2
    class Docs,Step grp3
    class Call hub`
        ),
      },
      {
        title: "What each slot is for",
        caption: "Rules apply every time. The ask is this task. Memory is history. Docs are facts. The step says where you are.",
        chart: pastelChart(
          `flowchart TD
    I1["Rules: tone and format"] --> Keep["Keep every time"]
    I2["Ask: summarize this"] --> Once["This turn only"]
    I3["Chat: recent turns"] --> Session["This session"]
    I4["Prefs: across chats"] --> Store["The store"]
    I5["Docs: PDFs and APIs"] --> Facts["Outside facts"]
    I6["Step: plan, then code"] --> Gate["Do not skip ahead"]`,
          `class I1,Keep grp1
    class I2,Once hub
    class I3,I4,Session,Store grp2
    class I5,I6,Facts,Gate grp3`
        ),
      },
    ],
    technicalExplanation: "",
    example:
      "A coding agent jumps from 'plan the login fix' straight into editing files because nobody told it the current step is still planning.",
    exampleSolution:
      "Label the six slots. Put 'always use TypeScript' in the rules. Put the task in the user ask. Keep this thread as short-term memory and seat preference as long-term memory. Attach the API doc. Write 'Step 1 of 3: planning' so it does not start coding yet.",
    commandsToRemember: [
      "Rules, ask, this chat, saved prefs, docs, current step",
      "Rules apply to every request",
      "Docs are facts. They are not new rules",
      "Name the step so it cannot skip ahead",
    ],
    revisionNotes: {
      cheatSheet: [
        "Six slots, each with a job",
        "This chat is not long-term memory",
        "Docs and APIs are the knowledge base",
        "Workflow state stops skipped steps",
      ],
    },
    glossary: ["System Prompt", "Short-Term Memory", "Long-Term Memory", "Retrieval"],
    commonMistakes: [
      "Stuffing preferences into the system rules until they contradict",
      "Treating this chat as if it will still be there next week",
      "Forgetting to say which step the work is on",
    ],
    learnElsewhere: ["Agent Memory — Phase 5", "RAG — Phase 3"],
  }),

  "context-window-challenges": lesson({
    concept: b(
      "The window is a size limit. Too much text makes the model drop earlier facts",
      "A huge unstructured dump is overload. Headings and bullets keep attention on the point",
      "Important rules buried in the middle get ignored. Put them at the start or the end",
      "When sources disagree, rank them. When memory is messy, split it into labeled blocks"
    ),
    whyItExists:
      "Adding more context can make the answer worse. The window is finite, and the middle of a long page is easy to skip.",
    analogy: "A suitcase has a weight limit. A speech is remembered at the opening and the close, not the ramble in between.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Heavy["Overstuffed bag"] --> Drop["Something falls out"]
    Packed["Labeled sections"] --> Fit["It fits"]`,
      `class Heavy,Drop grp1
    class Packed,Fit grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Five problems])

    subgraph Problem["What goes wrong"]
        P1["Too many tokens"]
        P2["Unstructured dump"]
        P3["Lost in the middle"]
        P4["Sources disagree"]
        P5["Messy memory"]
    end

    subgraph Fix["What to do"]
        F1["Summarize old turns"]
        F2["Use headings"]
        F3["Rules at the edges"]
        F4["Rank the sources"]
        F5["Split into blocks"]
    end

    P1 --> F1
    P2 --> F2
    P3 --> F3
    P4 --> F4
    P5 --> F5
    Hub --> Problem
    Hub --> Fix`,
      `class Hub hub
    class P1,P2,P3,P4,P5 grp1
    class F1,F2,F3,F4,F5 grp2
    style Problem fill:#fee2e2,stroke:#fca5a5,color:#991b1b
    style Fix fill:#ecfdf5,stroke:#6ee7b7,color:#065f46`
    ),
    workflowDiagrams: [
      {
        title: "Where to put the rules",
        caption: "The start and the end of the page are remembered. The middle is where details hide.",
        chart: pastelChart(
          `flowchart TD
    Top["Start: the rules"] --> Mid["Middle: the details"]
    Mid --> Bottom["End: the question"]
    Top -.->|keep| Bottom`,
          `class Top,Bottom hub
    class Mid grp1`
        ),
      },
      {
        title: "When two docs disagree",
        caption: "Say which source wins. Do not leave the model to pick a favorite.",
        chart: pastelChart(
          `flowchart LR
    Policy["Policy: rank 1"] --> Answer["The answer"]
    Notes["Old notes: rank 2"] --> Answer
    Policy -.->|wins| Notes`,
          `class Policy hub
    class Notes grp1
    class Answer grp2`
        ),
      },
    ],
    technicalExplanation: "",
    example:
      "You paste three API docs and a long chat. The model follows an old note in the middle and ignores the rule you buried between them.",
    exampleSolution:
      "Summarize the old chat. Turn the docs into headed sections. Put the rule at the top and repeat the question at the bottom. Mark the current API spec as the source that wins. Split memory into blocks such as user rules and current state.",
    commandsToRemember: [
      "Too long: summarize",
      "A dump: add headings",
      "Buried rule: move it to the start or the end",
      "Clash: rank the source. Mess: split the blocks",
    ],
    revisionNotes: {
      cheatSheet: [
        "More text can make the answer worse",
        "Summarize, do not paste forever",
        "Rules at the edges, details in the middle",
        "Rank sources. Label memory blocks",
      ],
    },
    glossary: ["Context Window", "Token", "Lost in the Middle"],
    commonMistakes: [
      "Pasting every document because more feels safer",
      "Hiding the rule in the middle of a long page",
      "Leaving two specs in the brief with no winner",
    ],
  }),

  "custom-instructions-demo": lesson({
    concept: b(
      "A plain prompt for a website plan returns generic phases and no owners",
      "Custom instructions are the system rules that apply before the ask",
      "A role, a deadline rule, and an output shape change the plan you get",
      "You can try this in ChatGPT custom instructions without writing code"
    ),
    whyItExists:
      "The same question produces a different plan once the model already knows who it is and what 'done' looks like.",
    analogy: "Hiring 'someone' versus hiring a senior project manager with a template.",
    analogyDiagram: pastelChart(
      `flowchart LR
    Someone["Someone"] --> Vague["A vague plan"]
    PM["A senior PM"] --> Plan["Phases, tasks, dates"]`,
      `class Someone,Vague grp1
    class PM,Plan grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    Hub([Same question])

    subgraph Weak["No custom instructions"]
        W1["Make a website plan"]
        W2["Generic phases"]
        W3["No dates"]
        W4["No owners"]
    end

    subgraph Strong["With a brief"]
        S1["You are a senior PM"]
        S2["Numbered phases"]
        S3["Tasks and durations"]
        S4["Milestone checks"]
    end

    Hub --> Weak
    Hub --> Strong`,
      `class Hub hub
    class W1,W2,W3,W4 grp1
    class S1,S2,S3,S4 grp2
    style Weak fill:#fee2e2,stroke:#fca5a5,color:#991b1b
    style Strong fill:#ecfdf5,stroke:#6ee7b7,color:#065f46`
    ),
    workflowDiagrams: [
      {
        title: "What to type where",
        caption: "The persona and the rules live in custom instructions. The website launch is the user ask.",
        chart: pastelChart(
          `flowchart TD
    Rules["Custom instructions"] --> Model["The model"]
    Ask["Launch a website"] --> Model
    Model --> Out["Phased plan"]
    Rules --- R1["Senior PM"]
    Rules --- R2["Deadlines required"]
    Out --- O1["Tasks"]
    Out --- O2["Durations"]
    Out --- O3["Milestones"]`,
          `class Rules,R1,R2 grp1
    class Ask hub
    class Model,Out,O1,O2,O3 grp2`
        ),
      },
    ],
    technicalExplanation: "",
    example:
      "The prompt 'Create a project plan for launching a new website' returns phase names and little else. No day counts, no tasks, no way to tell when a phase is done.",
    exampleSolution:
      "Set custom instructions first: you are a senior project manager for website launches, and every phase needs a deadline. Then ask for the plan. Expect numbered phases, a task under each phase, a duration, and a check that says the milestone is done. Compare it with a fresh chat that has no custom instructions.",
    commandsToRemember: [
      "Same question, two setups",
      "Put the role in custom instructions",
      "Require deadlines and milestone checks",
      "Compare the generic plan with the briefed plan",
    ],
    revisionNotes: {
      cheatSheet: [
        "Custom instructions are the rules slot",
        "The ask stays short",
        "A role plus an output shape changes the plan",
        "Generic phases mean the brief was empty",
      ],
    },
    glossary: ["System Prompt", "Custom Instructions"],
    commonMistakes: [
      "Putting the whole project into the one-line ask and leaving instructions empty",
      "Asking for 'detailed' without saying what a detail is",
      "Judging the model on a chat that has no rules saved",
    ],
    learnElsewhere: ["What Is Context Engineering? — this phase"],
  }),
};
