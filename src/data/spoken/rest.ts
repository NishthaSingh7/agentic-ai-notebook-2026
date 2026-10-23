import { tool, type SpokenLesson } from "../spoken-types";

export const restLessons: Record<string, SpokenLesson> = {
  "agents-together/why-more-than-one": {
    picture: `flowchart LR
  job[One job] --> split{"Mixed tasks?"}
  split -->|Yes| two[Two helpers]
  split -->|No| one[One helper]`,
    pictureCaption: "Add a second helper when one head would mix two jobs.",
    story:
      "One person can cook and also answer the door. At some point the soup burns because the conversation was interesting. A second person at the door saves the soup.",
    plain:
      "More than one agent helps when the jobs pull in different directions: research versus a careful rewrite, or a draft versus a check that is allowed to say no. It does not help because a diagram looked impressive. In a project, start with one. Split when you can name the second job in a sentence that is not the first job.",
    example:
      "One helper reads the notes. Another helper checks that the answer only uses those notes. Those are different jobs. One helper doing both tends to defend its own draft.",
    tryThis:
      "Look at your paper agent. If every step is the same kind of work, stay at one. If 'check' is a different mood from 'draft,' you have a reason.",
    tools: [
      tool(
        "CrewAI introduction",
        "A toolkit that starts from roles. Read it as a picture, not as homework.",
        "https://docs.crewai.com/introduction",
        "Read how they describe a crew.",
        "Stop before you install, unless chapter 5 was your gym and you chose them."
      ),
    ],
    remember: "Remember it as: a second agent needs a second job.",
  },
  "agents-together/roles": {
    picture: `flowchart LR
  research[Research] --> write[Write]
  write --> check[Check]`,
    pictureCaption: "A role is a job description short enough to say out loud.",
    story:
      "On a group project, 'everyone does everything' means nobody brings the slides. Roles are how you stop stepping on the same sentence.",
    plain:
      "A role is a short instruction: what this helper is for, what it is not for, and what it hands to the next one. Researcher does not email. Checker does not add new facts. In a project, if two roles share the same instruction, you have one role with a nickname.",
    example:
      "Researcher: 'Find three lines in the notes. Do not write the email.' Writer: 'Use only those lines. Draft the email. Do not send it.'",
    tryThis:
      "Write two roles in one sentence each. Include the 'do not.'",
    tools: [
      tool(
        "Claude",
        "Ask it to play one role at a time so you can hear the difference.",
        "https://claude.ai",
        "Paste one role and a tiny note.",
        "Stop after one reply. Then paste the other role in a fresh chat."
      ),
    ],
    remember: "Remember it as: a role is a job plus a do-not.",
  },
  "agents-together/handoff": {
    picture: `flowchart LR
  a[Helper A] --> note[A clear note]
  note --> b[Helper B]`,
    pictureCaption: "A handoff is a note, not a vibe.",
    story:
      "You would not tap a coworker and say 'you know, the thing.' You would say 'the refund line is 14 days, please draft two sentences.' The second version is a handoff.",
    plain:
      "A handoff is the package one agent passes to the next: the facts, the draft, and what is still open. If the package is the entire chat, the next agent drowns. In a project, the handoff is a small card with fields, closer to memory's one card than to a transcript.",
    example:
      "Researcher passes: quote, page, 'draft a reply that mentions the 14 days and nothing else.' Writer does not get the search junk.",
    tryThis:
      "Write the card that would move between your two roles. If it is longer than a sticky note, cut it.",
    tools: [
      tool(
        "A notes app",
        "Design the handoff before any framework's handoff feature.",
        "https://keep.google.com",
        "One note, four lines max.",
        "Stop when the second role could work from that note alone."
      ),
    ],
    remember: "Remember it as: pass a card, not the whole chat.",
  },
  "agents-together/when-one-is-enough": {
    picture: `flowchart LR
  fancy[Two agents arguing] --> mess[A slower mess]
  simple[One agent] --> done[A finished draft]`,
    pictureCaption: "Two helpers can spend the afternoon talking to each other.",
    story:
      "Two people moving a couch sometimes lift the same end. The couch does not get prouder. It gets stuck in the doorway.",
    plain:
      "Stay with one agent when the job is a single draft, a single lookup, or a checklist. Add a second only for a real split you already named. In a project, the failure mode of a crowd is cost and blame: each one sounds sure, and you cannot tell who added the fake date.",
    example:
      "A meeting summarizer does not need a 'creative agent' and a 'serious agent.' It needs the notes and a length.",
    tryThis:
      "Cross out a second role if you cannot say what mistake it prevents. If you can, keep it.",
    tools: [
      tool(
        "ChatGPT",
        "Notice that one chat already handles a simple job.",
        "https://chatgpt.com",
        "Give it a one-step task.",
        "Stop when you see it finish without a team."
      ),
    ],
    remember: "Remember it as: a crowd is not a design.",
  },
  "agents-together/a-shared-task": {
    picture: `flowchart LR
  task[One task] --> a[Helper A]
  task --> b[Helper B]
  a --> task
  b --> task`,
    pictureCaption: "The task stays the thing you show a person. Helpers are staff.",
    story:
      "A birthday party is the event. The person on balloons and the person on cake are not two parties. If you plan two parties, you will buy two cakes and still miss the guest of honor.",
    plain:
      "Write the shared task in one sentence a user would recognize. Helpers serve that sentence. They do not each invent a new goal. In a project, log the task id once. Both helpers write onto it. You read the task, not a pile of side chats.",
    example:
      "Task: 'Answer Sam about the refund, using the policy, and wait for me before sending.' Researcher and writer both serve that sentence.",
    tryThis:
      "Write the one sentence. If a helper's work does not fit inside it, that work is a different project.",
    tools: [
      tool(
        "Your notes",
        "The sentence is the spec.",
        "https://keep.google.com",
        "One sentence at the top of the page.",
        "Stop when every role fits under it."
      ),
    ],
    remember: "Remember it as: one task. Helpers are staff.",
  },
  "agents-together/two-helpers-one-job": {
    picture: `flowchart LR
  task[The sentence] --> roleA[Role A]
  roleA --> card[Handoff card]
  card --> roleB[Role B]
  roleB --> you[You]`,
    pictureCaption: "The chapter build is the sentence, two roles, and the card between them.",
    story:
      "A relay race is won by the baton, not by two people sprinting in circles. Draw the baton.",
    plain:
      "Build on paper: one task sentence, two roles with a do-not each, a handoff card, and the moment it comes back to you. No install. In a project, this page is what you build next, or what you throw away because one role was enough.",
    example:
      "Task: explain a policy line to a teammate. Role A finds the line and must not paraphrase loosely. Role B writes four sentences and must not add a second policy. You read it before it is posted.",
    tryThis:
      "Fill those four boxes. Read them out loud. If you stumble, the design is not ready.",
    tools: [
      tool(
        "Claude or ChatGPT",
        "Optional: run role A in one chat and paste only the card into a fresh chat for role B.",
        "https://claude.ai",
        "Use two separate chats so they cannot see each other's mess.",
        "Stop when the second reply stays inside the card."
      ),
    ],
    remember: "Remember it as: sentence, two roles, one baton, then you.",
  },
  "trust-and-shipping/it-can-be-wrong": {
    picture: `flowchart LR
  smooth[A smooth paragraph] --> still[Still a guess]
  still --> check[Check the costly bits]`,
    pictureCaption: "Style is not evidence.",
    story:
      "A neatly wrapped box can be empty. You learn that once, and then you shake the box.",
    plain:
      "Agents sound finished even when a tool failed, a chunk was missing, or the model filled a gap. Shipping means someone else might trust that voice. In a project, assume a wrong answer will happen. Decide which wrong answers you can survive, and which ones need a person.",
    example:
      "The helper says the meeting is at 3. The note said 3, but the timezone was yours, not the guest's. The sentence was smooth. The guest is early or late.",
    tryThis:
      "Write one wrong answer that would embarrass you if a helper sent it. That line is what you design the check around.",
    tools: [
      tool(
        "A chat you use",
        "Ask a question you know and watch it be smoothly wrong, or smoothly right.",
        "https://chatgpt.com",
        "One fact you can verify.",
        "Stop after you verify it."
      ),
    ],
    remember: "Remember it as: shake the box. Smooth is not full.",
  },
  "trust-and-shipping/checking-answers": {
    picture: `flowchart LR
  change[You change the prompt] --> tests[The same three questions]
  tests --> look[Look at pass or fail]`,
    pictureCaption: "A check is a question you can ask again after you change something.",
    story:
      "You do not retune a guitar by feeling alone if you have a tuner. You play the same note. A test is the same note.",
    plain:
      "Pick a few questions whose right answer you can point at. Run them when you change the prompt, the chunks, or the model. This is a tiny evaluation, an eval. You do not need a platform on day one. A note with three questions and the expected line is an eval. In a project, if all three pass and a real user still fails, add their question to the list.",
    example:
      "Question: refund window. Expected: 14 days, from the policy chunk. If the answer says 30, the run fails, even if the prose is kind.",
    tryThis:
      "Write three questions and the line you expect. Run them once in a chat with the source pasted in.",
    tools: [
      tool(
        "Your notes",
        "Three questions beat a dashboard you will not open.",
        "https://keep.google.com",
        "Make a list: question, expected line.",
        "Stop at three."
      ),
    ],
    remember: "Remember it as: same three questions, every time you change it.",
  },
  "trust-and-shipping/guardrails": {
    picture: `flowchart LR
  idea[The model wants to act] --> rail[A rule]
  rail -->|Allowed| tool[The tool]
  rail -->|Not allowed| no[No]`,
    pictureCaption: "A guardrail stops the action. It does not argue with the paragraph.",
    story:
      "A railing on a stair does not convince you to be careful. It stops the fall. You still want to be careful. You also want the railing.",
    plain:
      "A guardrail is a check outside the model's good intentions: this tool cannot be called with an amount over 50, this file path must stay in one folder, this email must wait for a yes. Prompt instructions help. They are not the railing, because the model can ignore them. In a project, the railing lives in the tool, in code you can read.",
    example:
      "The prompt says 'never refund more than the order.' The tool also refuses if the number is larger than the order total. The second line is the railing.",
    tryThis:
      "Pick one sharp tool from chapter 3. Write one rule the code should enforce even if the model begs.",
    tools: [
      tool(
        "OpenAI safety best practices",
        "A vendor page on not trusting the model alone.",
        "https://platform.openai.com/docs/guides/safety-best-practices",
        "Skim the section on keeping a human in the loop for risky actions.",
        "Stop before policy legalese. Take one concrete rule home."
      ),
    ],
    remember: "Remember it as: the railing is in the tool, not only in the prompt.",
  },
  "trust-and-shipping/cost": {
    picture: `flowchart LR
  loop[Another loop] --> tokens[More tokens]
  tokens --> bill[Time and money]`,
    pictureCaption: "Every extra think-act-look spends tokens.",
    story:
      "A taxi meter runs while you chat with the driver about which street feels nicer. The conversation can be lovely. The meter does not care.",
    plain:
      "Agents cost more than a single chat reply because the loop sends the growing desk back to the model, and tools add waiting. Tokens are the meter. A context window stuffed with junk is a faster meter. In a project, cap the number of steps, keep tools few, and look at one real run's token count before you invite a crowd of agents.",
    example:
      "A helper that 'thinks' eight times about a two-line email costs more than the email was worth. A cap of three steps would have stopped it.",
    tryThis:
      "If a product you use shows usage, open it and look at one day's number. If it does not, write a step cap you would be willing to pay for: 3, or 5, not 40.",
    tools: [
      tool(
        "OpenAI pricing",
        "See that tokens are the unit, even if you will not buy anything.",
        "https://openai.com/api/pricing/",
        "Look at the table long enough to see input and output are priced.",
        "Stop. Do not compare every model."
      ),
    ],
    remember: "Remember it as: the loop is a meter. Cap the steps.",
  },
  "trust-and-shipping/what-live-means": {
    picture: `flowchart LR
  you[Only you] --> friend[A friend]
  friend --> stranger[Someone who did not build it]`,
    pictureCaption: "Live means a person who did not build it can bump into it.",
    story:
      "Dinner for yourself can be experimental. Dinner for a guest means you tasted it first, and you know where the fire extinguisher is. The recipe did not become a different species. The guest did.",
    plain:
      "Shipping means someone else can use it while you are not watching the terminal. They need a way to undo, a way to reach a person, and an answer when a tool fails. Logs help you. They do not help the guest unless you also show a plain error. In a project, 'it worked on my laptop' is the step before live, not the definition of live.",
    example:
      "You share the notes helper with one teammate. The first day, a search fails. They see 'I could not read the notes,' not a stack trace. You can still read the trace.",
    tryThis:
      "Name the first person who is not you. Write the one sentence they should see when it fails.",
    tools: [
      tool(
        "A friend",
        "The cheapest staging environment is one person who will be honest.",
        "https://chatgpt.com",
        "You do not need this link. Ask the friend to try the paper version.",
        "Stop when they are confused. That confusion is the bug."
      ),
    ],
    remember: "Remember it as: live means a guest, not a demo.",
  },
  "trust-and-shipping/a-checklist-before-you-share": {
    picture: `flowchart LR
  tests[Three checks] --> rails[One railing]
  rails --> cap[A step cap]
  cap --> guest[The failure sentence]
  guest --> share[Then share]`,
    pictureCaption: "Five lines. Then you may show it to one person.",
    story:
      "Pilots use a boring list because memory is worse when you are excited to fly. Excitement is not a checklist.",
    plain:
      "This chapter's build is five lines: the wrong answer you fear, three test questions, the railing on the sharp tool, the step cap, and the sentence a guest sees on failure. In a project, you do not share the helper until those lines exist, even if the demo looked cute.",
    example:
      "Fear: a fake refund date. Tests: three policy questions. Railing: cannot send. Cap: 4 steps. Guest sentence: 'I could not check the policy. Ask Sam.'",
    tryThis:
      "Write the five lines for the helper you have been sketching. Share the paper with one person before you share a link.",
    tools: [
      tool(
        "Your notes",
        "The checklist is the build.",
        "https://keep.google.com",
        "Five headings, one line each.",
        "Stop when a teammate can read it without you in the room."
      ),
    ],
    remember: "Remember it as: five lines, then a guest.",
  },
  "agents-in-the-wild/coding-agents": {
    picture: `flowchart LR
  repo[A repository] --> read[Read]
  read --> patch[A proposed change]
  patch --> you[You review]`,
    pictureCaption: "A coding agent reads the project and proposes a change. You still merge.",
    story:
      "A junior teammate can open a pull request. You still read the diff. The junior being fast does not make the diff optional.",
    plain:
      "A coding agent uses the loop on a codebase: read files, run a command, propose a patch. Cursor and similar products are this, with a person at the keyboard. In a project of your own, the agent does not decide that the tests passing means the behavior is what you wanted. You do.",
    example:
      "It edits a function and the tests pass, but it also changed an error message your users rely on. The tests never mentioned that message. You catch it in the diff.",
    tryThis:
      "If you use Cursor or a similar tool, ask it for a tiny change and read every line it touched. If you do not, read one public demo and stop.",
    tools: [
      tool(
        "Cursor",
        "A coding agent product. Using it is the lesson.",
        "https://cursor.com",
        "Look at the product page, or open the app if you have it.",
        "Stop after you can say what it is allowed to change."
      ),
    ],
    remember: "Remember it as: it can write the diff. You still read the diff.",
  },
  "agents-in-the-wild/browser-agents": {
    picture: `flowchart LR
  goal[A goal] --> pageClicks[Clicks]
  pageClicks --> page[A page]
  page --> goal`,
    pictureCaption: "A browser agent drives a site the way a person would, which means it can click the wrong thing.",
    story:
      "You can ask someone to order groceries online. They might grab the wrong size because the button was big and red. The store did not care that they were helpful.",
    plain:
      "A browser agent, sometimes called computer use, looks at a page and clicks, types, and scrolls. It is powerful and easy to point at the wrong button. In a project, give it a logged-out demo or a fake account first. Never start with your bank.",
    example:
      "You ask it to find a library's hours. It does. You ask it to pay a bill. It should not have the password, and a person should confirm the amount.",
    tryThis:
      "Write one browser task that is safe if the click is wrong, and one that is not. Only the safe one is a toy.",
    tools: [
      tool(
        "Anthropic computer use",
        "Their description of an agent that uses a screen.",
        "https://docs.anthropic.com/en/docs/agents-and-tools/computer-use",
        "Read the overview and the warning tone.",
        "Stop before any setup. Notice what they tell you not to do."
      ),
    ],
    remember: "Remember it as: clicks are actions. Start where a wrong click is cheap.",
  },
  "agents-in-the-wild/voice-agents": {
    picture: `flowchart LR
  talk[You talk] --> text[Text]
  text --> loop[The same loop]
  loop --> voice[A voice replies]`,
    pictureCaption: "Voice is a doorway. Behind it, the loop is unchanged.",
    story:
      "A phone call feels more human than an email, which is why a wrong answer on a phone call feels ruder. The words did not become wiser because they were spoken.",
    plain:
      "A voice agent turns speech into text, runs the same kind of loop, and speaks the reply. Speech-to-text and text-to-speech are the doorways. In a project, the risks you already know get louder: a hallucination spoken with confidence, a tool fired because the caller sounded sure. Keep sharp tools behind a person.",
    example:
      "A clinic bot can read hours out loud. It should not book a procedure because the caller described symptoms with confidence.",
    tryThis:
      "If your phone has a voice assistant, ask it something harmless. Notice the pause before it acts. That pause is where a check would live.",
    tools: [
      tool(
        "OpenAI realtime docs",
        "One official door into voice, if you are curious.",
        "https://platform.openai.com/docs/guides/realtime",
        "Read the first overview.",
        "Stop before you wire a microphone."
      ),
    ],
    remember: "Remember it as: voice is a door. The loop is still the loop.",
  },
  "agents-in-the-wild/products-people-use": {
    picture: `flowchart LR
  use[Use one] --> notice[Notice the loop]
  notice --> build[Then build, if you still need to]`,
    pictureCaption: "Use a product before you rebuild it.",
    story:
      "You ride in a car before you design an engine. The ride teaches you what 'works' feels like. The engine class is less abstract after that.",
    plain:
      "ChatGPT, Claude, Gemini, and Cursor are the products people mean when they say agents in 2026 and 2027. Spend a real task in one of them. Notice where it searched, where it asked you, and where it guessed. In a project, copy the behavior you liked — the pause, the citation — not the whole product.",
    example:
      "You use a coding agent to rename a variable. It shows a diff and waits. That wait is the pattern you will want in your own helper.",
    tryThis:
      "Pick one product. Do one real task this week. Write three notes: what it did, where it asked, where you did not trust it.",
    tools: [
      tool("ChatGPT", "A chat product with agent-style tools in places.", "https://chatgpt.com", "Start a chat and give it one real task.", "Stop after the task, and write the three notes."),
      tool("Claude", "Another place to feel a careful draft.", "https://claude.ai", "One real task.", "Stop and write what you trusted."),
      tool("Gemini", "Google's chat, useful if your work is already there.", "https://gemini.google.com", "One real task.", "Stop and compare the feeling to the others only if you have time."),
      tool("Cursor", "A coding agent, if you write code.", "https://cursor.com", "One tiny code change.", "Stop and read the diff."),
    ],
    remember: "Remember it as: ride first. Design the engine after.",
  },
  "agents-in-the-wild/what-you-still-own": {
    picture: `flowchart LR
  product[The product] --> help[Help]
  you[You] --> done[What done means]
  you --> risk[What must not happen]`,
    pictureCaption: "The product can help. Done is still your sentence.",
    story:
      "A taxi gets you across town. It does not decide that you have arrived at the right party. You look at the door.",
    plain:
      "You still own the goal, the sources, the sharp-tool rules, and the meaning of done. A product that is 'agentic' did not take that from you. In a project, write those four lines even when the product is someone else's. Otherwise you cannot tell a success from a busy screen.",
    example:
      "Cursor edited the file. Done, for you, means the tests you care about pass and the public error text did not change. The product will not know that unless you do.",
    tryThis:
      "Under the three notes from the last module, add one line: 'Done means ___.'",
    tools: [
      tool(
        "Your notes",
        "Ownership is a sentence, not a setting.",
        "https://keep.google.com",
        "Write the done line.",
        "Stop when it is specific enough to fail."
      ),
    ],
    remember: "Remember it as: they drive. You know the address.",
  },
  "agents-in-the-wild/a-week-with-one-product": {
    picture: `flowchart LR
  day[One real task] --> notes[What it did]
  notes --> trust[What you did not trust]
  trust --> done[Your done line]`,
    pictureCaption: "A week means one honest task, not seven new accounts.",
    story:
      "A food diary works when you write Tuesday's lunch, not when you plan a personality. One true page beats a blank week of intentions.",
    plain:
      "This chapter's build: use one product on one real task. Record what it did, where it asked, where you did not trust it, and your done line. In a project, this note is user research on yourself. It tells you which pause to copy.",
    example:
      "Task: summarize a meeting note in ChatGPT. It added an action item nobody said. You did not trust that line. Done means every bullet appears in the note.",
    tryThis:
      "Do the task. Write the four lines. Keep them. Chapter 9 will want this honesty.",
    tools: [
      tool("ChatGPT", "A fine choice for the week.", "https://chatgpt.com", "One real task.", "Stop and write the four lines."),
      tool("Cursor", "A fine choice if the task is code.", "https://cursor.com", "One small change.", "Stop and write whether the diff matched your done line."),
    ],
    remember: "Remember it as: one task, four honest lines.",
  },
  "make-one-thing/the-story-of-the-project": {
    picture: `flowchart LR
  notes[Your notes] --> helper[A helper]
  helper --> draft[A draft]
  draft --> you[You, before anything is sent]`,
    pictureCaption: "A helper that answers from your notes and asks before it sends.",
    story:
      "You have a folder of notes and a friend who keeps asking what you decided. You want a helper that reads the folder, answers in your voice, and never hits send on its own. That is the whole story. We are not building a company.",
    plain:
      "The project is a notes helper. It answers questions from one folder. It quotes the line it used. It drafts a message only when you ask. It does not send. This uses the path you walked: chat, prompt, loop, tools, RAG, a yes before sharp actions. In a project, a story this small is how you finish.",
    example:
      "A classmate asks 'when is the draft due?' The helper quotes the syllabus line and stops. It does not email the classmate.",
    tryThis:
      "Say the story out loud in two sentences. If you add a second product, cross it out.",
    tools: [
      tool(
        "Your notes folder",
        "Pick the folder now. A small one.",
        "https://keep.google.com",
        "Choose notes you are allowed to experiment with.",
        "Stop when the folder has a few real pages, not your whole life."
      ),
    ],
    remember: "Remember it as: answers from your notes, and never sends alone.",
  },
  "make-one-thing/what-it-needs": {
    picture: `flowchart LR
  model[A model] --> helper[Helper]
  tools[A few tools] --> helper
  notes[Your notes] --> helper
  you[You] --> helper`,
    pictureCaption: "Four ingredients. Not a platform.",
    story:
      "Tea needs water, leaves, a cup, and someone to say when it is strong enough. A fifth gadget does not make it tea.",
    plain:
      "You need a model you can open, a read-notes tool, a draft tool, your folder, and you as the person who says yes before any send. Memory is optional: one card, like 'keep answers short.' Context is the question plus the retrieved lines, not the whole folder. In a project, if a new ingredient does not serve the story, it waits.",
    example:
      "ChatGPT or the hello-world from chapter 5 is the model. The folder is three markdown notes. You are the approval.",
    tryThis:
      "Write the four ingredients in a list. Leave send off the list.",
    tools: [
      tool(
        "OpenAI Agents quickstart",
        "Only if chapter 5's hello-world is how you will run it.",
        "https://openai.github.io/openai-agents-python/quickstart/",
        "Confirm you still know the run line.",
        "Stop. Do not add tools on their page yet."
      ),
    ],
    remember: "Remember it as: model, read, draft, you.",
  },
  "make-one-thing/the-loop-you-will-use": {
    picture: `flowchart LR
  think[Think] --> search[Search notes]
  search --> draft[Draft]
  draft --> ask[Ask you]
  ask --> stop[Stop]`,
    pictureCaption: "Think, search, draft, ask, stop. No mystery step.",
    story:
      "A sandwich has an order. Bread, filling, bread. If you invent a flambé step, you are no longer making lunch.",
    plain:
      "The loop is fixed enough to draw. Think about the question. Search the notes. Draft from the chunks, with a quote. If the user asked to send, stop and show the draft. Otherwise stop after the answer. Cap it at four steps so the meter stays kind. In a project, this drawing is the one you pin above the code.",
    example:
      "Question about a due date: search finds the line, draft quotes it, no send was asked, stop. Two steps and done.",
    tryThis:
      "Copy the picture onto paper. Add your step cap: 4.",
    tools: [
      tool(
        "Your paper sketch from chapter 2",
        "Reuse it. Do not draw a new religion.",
        "https://keep.google.com",
        "Open the old goal, tool, ask, done note.",
        "Stop when this project's loop fits on that page."
      ),
    ],
    remember: "Remember it as: search, draft, ask, stop.",
  },
  "make-one-thing/the-files-it-can-read": {
    picture: `flowchart LR
  folder[One folder] --> allowed[Allowed]
  rest[Everything else] --> no[Not allowed]`,
    pictureCaption: "One folder. The rest of the computer is not the project.",
    story:
      "You lend a friend one shelf, not the house key. They can still be helpful. They cannot redecorate the bedroom.",
    plain:
      "Choose a folder that contains only notes you are willing to show a model. The read tool may open files in that folder and nowhere else. That limit is a guardrail in the tool, not a sentence in the prompt. In a project, this is how a notes helper stays a notes helper.",
    example:
      "The folder is 'course-notes.' A question about your email is out of scope. The tool cannot open mail, so the model cannot get creative with it.",
    tryThis:
      "Name the folder. List the file names. If a file feels too private, move it out before any tool exists.",
    tools: [
      tool(
        "The folder on your computer",
        "The real ingredient.",
        "https://keep.google.com",
        "If your notes are online, export or copy a few into one place.",
        "Stop at a handful of files."
      ),
    ],
    remember: "Remember it as: one shelf, not the house key.",
  },
  "make-one-thing/the-one-function": {
    picture: `flowchart LR
  you[You] --> run[run]
  run --> helper[The helper]`,
    pictureCaption: "The same kind of call as chapter 2. The instructions are now your story.",
    story:
      "The whistle did not change. The race did. You still start it with one sound.",
    plain:
      "The function that starts this helper is the run call you already saw. What changed is the instruction: answer from the notes, quote the line, never send. Tools get added in the toolkit's way, on their docs, when you are ready. In a project, you keep this call boring so the interesting part stays in the instructions and the folder rule.",
    example:
      "You pass 'When is the draft due?' The run returns a quote from the syllabus note. If you pass 'email the class,' the instructions say to stop and show a draft instead.",
    tryThis:
      "Read the snippet. Replace the question with one from your folder. Do not add a send tool.",
    tools: [
      tool(
        "OpenAI Agents quickstart",
        "If you need the import and the install, it is here.",
        "https://openai.github.io/openai-agents-python/quickstart/",
        "Match their import to the snippet.",
        "Stop when the call makes sense. Add tools only from their docs, one at a time."
      ),
    ],
    oneFunction: {
      title: "Start the notes helper",
      why: "Runner.run_sync starts the run. The instructions carry the story: quote the notes, never send.",
      language: "python",
      code: `from agents import Agent, Runner

agent = Agent(
    name="Notes helper",
    instructions=(
        "Answer only from the notes I provide. "
        "Quote the line you used. "
        "If it is not in the notes, say you do not see it. "
        "Never send messages."
    ),
)
result = Runner.run_sync(agent, "When is the draft due? Notes: The draft is due March 3.")
print(result.final_output)`,
    },
    remember: "Remember it as: same whistle, your instructions.",
  },
  "make-one-thing/how-you-will-know-it-works": {
    picture: `flowchart LR
  q1[A question in the notes] --> pass1[Quotes the line]
  q2[A question not in the notes] --> pass2[Says it does not see it]
  q3[Please send this] --> pass3[Shows a draft and waits]`,
    pictureCaption: "Three questions. They are the eval for this helper.",
    story:
      "You taste the soup for salt, for heat, and for whether you would serve it. Three tastes. Then you know.",
    plain:
      "It works when three things are true. A question that is in the notes gets a quote. A question that is not in the notes gets 'I don't see that,' not a guess. A request to send becomes a draft that waits for you. In a project, run these three whenever you change the instructions or the folder.",
    example:
      "You add a new file and the helper starts answering from memory of the old prompt instead of the file. Question two fails. You fix retrieval before you add features.",
    tryThis:
      "Write your three questions using real lines from your folder. Include one answer that must be 'I don't see that.'",
    tools: [
      tool(
        "Your checklist from chapter 7",
        "These three questions are that checklist, made specific.",
        "https://keep.google.com",
        "Put the three questions under the fear line.",
        "Stop at three."
      ),
    ],
    remember: "Remember it as: quote, admit, wait.",
  },
  "make-one-thing/build-the-helper": {
    picture: `flowchart LR
  story[Story] --> folder[Folder]
  folder --> loop[Loop]
  loop --> tests[Three tests]
  tests --> guest[One guest]`,
    pictureCaption: "Put the pieces in the order you learned them. Then one person tries it.",
    story:
      "You have been packing a bag all along. This is zipping it. You do not buy a second suitcase at the zipper.",
    plain:
      "Build the small version. Put the folder aside. Write the loop. Use the run call with your instructions, and add a read tool only by following the quickstart you trust. Run the three tests. Fix the first failure before you add anything. Then let one guest ask a question. In a project, this is version one. Extra topics you study later belong in Notes, not in this bag.",
    example:
      "Version one answers from three files in chat-paste form if a tool is still too much. Quoting still counts. Sending still does not exist.",
    tryThis:
      "Walk the picture from left to right. Stop at the first missing piece and fill only that. When the three tests pass, ask one person to try a question.",
    tools: [
      tool(
        "OpenAI Agents quickstart",
        "The place to add a tool, if you are on that path.",
        "https://openai.github.io/openai-agents-python/quickstart/",
        "Add one tool using their example, aimed at your folder.",
        "Stop when the three tests pass. Do not add send."
      ),
      tool(
        "Claude or ChatGPT",
        "A valid version one: paste the notes yourself.",
        "https://claude.ai",
        "Paste the folder text and your instructions.",
        "Stop when quote, admit, and wait all happen."
      ),
    ],
    remember: "Remember it as: zip the bag you already packed.",
  },
  "if-you-need-to-code/python": {
    picture: `flowchart LR
  read[Read an example] --> change[Change one line]
  change --> run[Run it]`,
    pictureCaption: "You need enough Python to read a quickstart, not enough to write a language.",
    story:
      "You can follow a recipe in a kitchen whose labels you only half know. You learn the words the recipe uses. You do not pause to study the history of ovens.",
    plain:
      "The snippets on this path are Python because many agent docs are. You need variables, a function call, and how to run a file. You do not need this shelf to understand the ideas. In a project, learn the line the error points at, then come back.",
    example:
      "An error says Agent is not defined. That means the import line did not run. You fix that line. You do not rewrite the agent.",
    tryThis:
      "If the words in a snippet feel like noise, do a short Python intro, then return. If you can read the run call, skip this shelf.",
    tools: [
      tool(
        "Python intro",
        "The official starting point.",
        "https://docs.python.org/3/tutorial/introduction.html",
        "Read the introduction and try the first examples.",
        "Stop when a function call looks like English. Come back to the path."
      ),
    ],
    remember: "Remember it as: learn the line the docs use. Then come back.",
  },
  "if-you-need-to-code/git": {
    picture: `flowchart LR
  work[Your work] --> save[A commit]
  save --> history[History you can return to]`,
    pictureCaption: "Git is a save button with a history.",
    story:
      "You would not paint a room without a photo of the color you liked. A commit is that photo. If the next color is awful, you can go back.",
    plain:
      "Git keeps versions of your files. You need it when the hello-world starts to grow, so a broken experiment is not the only copy. In a project, commit the version that passed your three tests before you try a new idea.",
    example:
      "The helper quoted the right line. You commit. The next edit invents facts. You return to the commit that quoted.",
    tryThis:
      "If you have never committed, follow the first page of a Git tutorial until you make one commit of a text file. Then stop.",
    tools: [
      tool(
        "Git handbook",
        "The short official start.",
        "https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control",
        "Read about version control, then the install chapter if you need it.",
        "Stop after you understand commit. Skip branching for now."
      ),
    ],
    remember: "Remember it as: commit the version that worked.",
  },
  "if-you-need-to-code/http": {
    picture: `flowchart LR
  ask[A request] --> server[A server]
  server --> answer[A response]`,
    pictureCaption: "The web is a request and a response. APIs are that, with data.",
    story:
      "You order at a counter. You say the item. They hand you a tray or they say they are out. HTTP is the counter.",
    plain:
      "HTTP is how a program asks another computer for something. A request goes out. A response comes back, sometimes with JSON, which is just structured text. Model APIs work this way. In a project, when the docs say 'POST,' they mean a request that carries your question to the model.",
    example:
      "Your run call, under the hood, sends your instructions to a server and gets text back. You do not hand-write that request until the docs tell you to.",
    tryThis:
      "Read one short HTTP overview. Find the words request and response. That is enough for this path.",
    tools: [
      tool(
        "MDN HTTP overview",
        "A clear public explanation.",
        "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
        "Read the overview.",
        "Stop before caching and cookies."
      ),
    ],
    remember: "Remember it as: you ask, a server answers.",
  },
  "how-models-are-built/training-vs-using": {
    picture: `flowchart LR
  train[Someone trains] --> model[A model]
  model --> you[You use it]`,
    pictureCaption: "Training already happened. Using it is your job.",
    story:
      "You did not mill the flour in the bread you toast. You can still make breakfast. Knowing mills exist is optional curiosity.",
    plain:
      "Training is the long, expensive process that built the habit. Using the model is what this path is about. You can ship a helper without training anything. In a project, reach for a better prompt, better pages on the desk, or a better check before you reach for training.",
    example:
      "The notes helper fails question two. The fix is the retrieval, not a new model trained on your syllabus.",
    tryThis:
      "If you felt you must train a model to be serious, write down the actual failure. See if it is a prompt, a page, or a check.",
    tools: [
      tool(
        "ChatGPT, Claude, or Gemini",
        "Using a model is opening the chat.",
        "https://chatgpt.com",
        "Ask one question.",
        "Stop. You have used a model."
      ),
    ],
    remember: "Remember it as: they trained it. You use it.",
  },
  "how-models-are-built/transformers": {
    picture: `flowchart LR
  words[Words in] --> attention[Attention]
  attention --> next[A next word]`,
    pictureCaption: "A transformer pays attention to the words that matter, then guesses what comes next.",
    story:
      "In a noisy room you still hear your name. You did not process every sound equally. Attention is that tilt toward what matters. Transformers are built from that tilt, stacked many times.",
    plain:
      "A transformer is the architecture inside most LLMs. Attention lets each word look at the other words before the model guesses what comes next. You do not need to implement one to build an agent. In a project, this shelf is for the day someone says 'attention' and you want a picture, not a course.",
    example:
      "In 'the bank by the river,' attention leans on river so bank means shore, not money. That is the flavor of the idea.",
    tryThis:
      "Read one illustrated explanation. Stop when the picture matches 'words look at each other.'",
    tools: [
      tool(
        "Jay Alammar, The Illustrated Transformer",
        "A famous picture-led explanation.",
        "https://jalammar.github.io/illustrated-transformer/",
        "Read until the first attention picture.",
        "Stop before you implement anything."
      ),
    ],
    remember: "Remember it as: words look at each other, then the model guesses.",
  },
  "how-models-are-built/fine-tuning": {
    picture: `flowchart LR
  model[A model that already talks] --> extra[A small extra lesson]
  extra --> same[The same model, a bit more yours]`,
    pictureCaption: "Fine-tuning is an extra lesson, not a new education.",
    story:
      "A fluent speaker can learn your shop's phrases in an afternoon. They do not relearn English. The afternoon is fine-tuning. Most shops do not need it. A better script at the counter is enough.",
    plain:
      "Fine-tuning continues training a little, on your examples, so the style or the format sticks. It does not upload new facts as reliably as putting the page on the desk. LoRA is a cheaper way to do that extra lesson. In a project, try RAG and a clear prompt first. Fine-tune when you have many examples of the exact shape you need and the prompt will not hold it.",
    example:
      "You want every answer as three labeled fields. A typed result or a prompt may be enough. Fine-tuning is the later, heavier option.",
    tryThis:
      "Do not fine-tune the notes helper. Write why RAG is the better drawer for it.",
    tools: [
      tool(
        "OpenAI fine-tuning guide",
        "So you know the door exists.",
        "https://platform.openai.com/docs/guides/fine-tuning",
        "Read when they say to use it.",
        "Stop before you upload a dataset."
      ),
    ],
    remember: "Remember it as: an extra lesson. The page on the desk comes first.",
  },
};
