import { tool, type SpokenLesson } from "../spoken-types";

export const middleLessons: Record<string, SpokenLesson> = {
  "how-an-agent-thinks/chatbot-vs-agent": {
    picture: `flowchart LR
  chat[Chatbot] --> words[Words only]
  agent[Agent] --> step[A step in the world]
  step --> look[Look at what happened]`,
    pictureCaption: "Talk stays in the chat. An agent is allowed to take a step, then look.",
    story:
      "You can ask a friend for directions. That is a chat. You can hand them the keys and say 'please move the car to the shade, then tell me where it is.' That is an errand. An agent is the errand version.",
    plain:
      "A chatbot returns language. An agent uses a model to decide on an action, takes that action with a tool, and reads the result before it talks again. The model is still guessing. The new part is the permission to do something. In a project, you add that permission one tool at a time. You do not start by letting it touch everything.",
    example:
      "'Draft a reply to this email' is a chatbot job. 'Draft a reply, and if I say yes, send it' is an agent job, because sending is a step in the world.",
    tryThis:
      "Write two lines for a job you have: the line that is only talk, and the line that would be an action. Circle the action. That is the part that needs a tool and a check.",
    tools: [
      tool(
        "ChatGPT",
        "Use it as the talk half. Notice it does not send your email.",
        "https://chatgpt.com",
        "Ask it to draft a short reply you might send.",
        "Stop before you paste the draft anywhere real."
      ),
    ],
    remember: "Remember it as: the model can talk. The agent can go and do.",
  },
  "how-an-agent-thinks/the-loop": {
    picture: `flowchart LR
  think[Think] --> act[Act]
  act --> look[Look]
  look --> think`,
    pictureCaption: "Think, act, look, then think again. Stop when the job is done or a person should take it.",
    story:
      "You cook pasta by tasting, not by a single guess at the start. Salt, taste, salt, taste. The loop is the tasting. An agent that only thinks once is a person who salts the pot and walks away.",
    plain:
      "The loop is the heartbeat. The model looks at the goal and what it knows, picks a next action, a tool does that action, and the result comes back as new information. Then it goes again. People call a simple version of this ReAct: reason, then act. In a project, write the loop in one sentence before you pick a framework. If you cannot say when it stops, it will wander.",
    example:
      "Goal: find the refund rule in a handbook. Think: I need the handbook. Act: search. Look: the chunk says 14 days. Think: I can answer now. Stop.",
    tryThis:
      "Take yesterday's 'draft an email' idea. Write four boxes: think, act, look, stop. Put one real action in Act.",
    tools: [
      tool(
        "Anthropic's agent overview",
        "A plain official page on what an agent loop is.",
        "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview",
        "Read the opening section on tool use.",
        "Stop before any SDK install. You only need the picture."
      ),
    ],
    remember: "Remember it as: think, act, look, repeat, then stop.",
  },
  "how-an-agent-thinks/planning": {
    picture: `flowchart LR
  goal[Goal] --> list[A short list]
  list --> first[Do the first step]
  first --> check[Check the list]`,
    pictureCaption: "A plan is a short list you can throw away when the world disagrees.",
    story:
      "A grocery list helps. A grocery list that forbids you from buying milk when you see you are out of milk is a bad boss. Plans are lists, not laws.",
    plain:
      "Planning means the model writes the steps before it spends tools on them. That helps when the job has an order: read, then draft, then ask. It hurts when the world changes and the list is treated as holy. In a project, show the plan to a person when the steps are expensive. Let the loop rewrite a step when the look-back says the step was wrong.",
    example:
      "A research helper plans: search the policy, quote the line, draft the answer, ask you before emailing. Step four exists because email is not a draft.",
    tryThis:
      "Write a four-step plan for one job. Mark the step that should wait for you.",
    tools: [
      tool(
        "ChatGPT or Claude",
        "Ask it to plan, and do not let it act.",
        "https://claude.ai",
        "Say 'only list steps, do not browse.'",
        "Stop when you have a list you can edit with a pen."
      ),
    ],
    remember: "Remember it as: a plan is a list you are allowed to change.",
  },
  "how-an-agent-thinks/when-to-stop-and-ask": {
    picture: `flowchart LR
  step[Next step] --> risky{"Hard to undo?"}
  risky -->|Yes| ask[Ask a person]
  risky -->|No| go[Go ahead]`,
    pictureCaption: "If you cannot undo it easily, the loop waits.",
    story:
      "A good house-sitter will water the plants. They will not sell the couch because the room 'felt crowded.' Selling is hard to undo. Watering is not.",
    plain:
      "Stop and ask when the step spends money, sends a message, deletes something, or touches a person who did not ask. This is often called human in the loop. In a project, the ask is a real pause with the draft visible, not a log line nobody reads. The agent should say what it wants to do, and wait.",
    example:
      "The helper drafts a refund email and shows you the amount. You tap yes. Only then does send exist. If it sends first and apologizes after, the pause was fake.",
    tryThis:
      "List three actions in your life a helper must not take without a yes. Keep that list. It becomes the rule later.",
    tools: [
      tool(
        "Claude",
        "Practice the pause in chat. Ask it to draft, not to send.",
        "https://claude.ai",
        "Paste a fake email and say 'draft only.'",
        "Stop when the draft is on screen and nothing has been sent."
      ),
    ],
    remember: "Remember it as: hard to undo means stop and ask.",
  },
  "how-an-agent-thinks/types-of-agents": {
    picture: `flowchart LR
  one[One helper] --> tools[With tools]
  tools --> many[Or a small team]
  many --> product[Or a product you already use]`,
    pictureCaption: "Most 'types' are the same loop with a different costume.",
    story:
      "People name bicycles: road, city, cargo. They all have two wheels and a rider. The name tells you the job, not a new law of physics.",
    plain:
      "You will hear planner, researcher, coder, voice, browser, multi-agent. Under the name it is still a model, some tools, a loop, and a stop. A workflow is the stricter cousin: the steps are fixed, like a checklist, and the model only fills boxes. Use a workflow when the order never changes. Use an agent when the next step depends on what just happened. In a project, pick the boring shape that fits the job.",
    example:
      "Every refund follows the same three checks. That is a workflow. A helper that pokes around a new bug in a repo, and does not know the steps yet, is an agent.",
    tryThis:
      "Name one job in your week that is a checklist, and one that depends on what you find. The checklist does not need an agent.",
    tools: [
      tool(
        "ChatGPT",
        "Ask it to explain one type you heard, then check the explanation against this page.",
        "https://chatgpt.com",
        "Ask 'what is a workflow versus an agent, in plain words?'",
        "Stop after the answer. Compare it to the checklist idea above."
      ),
    ],
    remember: "Remember it as: the names change. The loop stays.",
  },
  "how-an-agent-thinks/one-function-that-starts-it": {
    picture: `flowchart LR
  you[You] --> startRun[One call]
  startRun --> theRun[The run]
  theRun --> result[A result]`,
    pictureCaption: "Somewhere in the program, one call starts the run. The rest is the loop.",
    story:
      "A race starts with a whistle, not with a lecture about shoes. You can spend all day on shoes. The whistle is the moment it begins.",
    plain:
      "Toolkits hide the loop behind a function. You pass the goal, the tools, and sometimes a model name. The function runs until it stops or needs you. You do not memorize every line around it. You remember the call that starts the run, and you read the rest on the toolkit's site when you need it. In a project, that call is the line you log, time, and wrap with a 'ask me first' check.",
    example:
      "A tiny Python sketch with OpenAI's Agents SDK. The names move. The idea is: here is the agent, here is the input, run it.",
    tryThis:
      "Do not install anything yet. Read the function below out loud. Say what you would pass in for a helper that only drafts email.",
    tools: [
      tool(
        "OpenAI Agents SDK quickstart",
        "The official page for this kind of call.",
        "https://openai.github.io/openai-agents-python/",
        "Open Quickstart. Find the run call.",
        "Stop when you can point at the line that starts the run. Do not copy the whole page into a project."
      ),
    ],
    oneFunction: {
      title: "The call that starts a run",
      why: "This is the whistle. Runner.run starts the loop with your agent and the user's words. You change the agent and the input. You do not rewrite the runner.",
      language: "python",
      code: `from agents import Agent, Runner

agent = Agent(name="Drafter", instructions="Draft only. Never send.")
result = Runner.run_sync(agent, "Draft a short reply: thanks, I'll look tomorrow.")
print(result.final_output)`,
    },
    remember: "Remember it as: one call starts the run. The docs hold the rest.",
  },
  "how-an-agent-thinks/a-tiny-agent-on-paper": {
    picture: `flowchart LR
  goal[Goal] --> loop[Think act look]
  loop --> stop[Stop or ask]`,
    pictureCaption: "If the paper loop is confusing, the code will be worse.",
    story:
      "Architects sketch the room before they buy bricks. A crooked sketch is cheap. A crooked wall is not.",
    plain:
      "Draw one agent for a job you have. Name the goal, the single tool it may use, the moment it must ask you, and the sentence that means 'done.' This is the chapter build. In a project, this sketch is the design review. If a teammate cannot tell when it stops, do not write the function yet.",
    example:
      "Goal: pull the due date from a syllabus note. Tool: read that one note. Ask me: never, it cannot email anyone. Done: one date, or 'I don't see a date.'",
    tryThis:
      "On paper, four labels: goal, tool, ask-me moment, done. Fill them for a job from this week. If the tool list grows past one, cut it back.",
    tools: [
      tool(
        "A note app you already have",
        "The build lives in notes. No new framework.",
        "https://keep.google.com",
        "Make one note with the four labels.",
        "Stop when a friend could follow the sketch."
      ),
    ],
    remember: "Remember it as: if you cannot draw the stop, do not build the run.",
  },
  "tools-and-memory/tools": {
    picture: `flowchart LR
  agent[Agent] --> button[A named tool]
  button --> world[A small action]
  world --> agent`,
    pictureCaption: "A tool is a named action with a clear input and a clear result.",
    story:
      "A kitchen has a kettle and a knife. Guests do not get the knife drawer key just because they can boil water. Tools are the drawers you choose to unlock.",
    plain:
      "A tool is a function the model is allowed to call: search these notes, get the weather, create a draft. You describe what it does in plain language so the model can pick it. The tool itself should be boring and narrow. In a project, each tool has a name, the inputs it accepts, and what it returns. If you cannot say that in a sentence, the tool is two tools in a coat.",
    example:
      "'send_email' is a wide, sharp tool. 'draft_email' returns text and sends nothing. Start with the draft.",
    tryThis:
      "Rename one chore you wish a helper did so it sounds like a button: verb plus object. Write what it must not do.",
    tools: [
      tool(
        "OpenAI function calling guide",
        "The official idea of a tool the model can call.",
        "https://platform.openai.com/docs/guides/function-calling",
        "Read the introduction until you see a tool described with a name.",
        "Stop before you create an API key."
      ),
    ],
    remember: "Remember it as: a tool is a button you agreed to install.",
  },
  "tools-and-memory/memory": {
    picture: `flowchart LR
  chat[This chat] --> maybe[Save a fact]
  maybe --> later[A later chat]
  later --> chat2[The helper remembers the fact]`,
    pictureCaption: "Memory is what you choose to keep after this window closes.",
    story:
      "A barista who writes 'oat milk' on your cup is using memory. A barista who replays your entire life story every morning would be unhinged, and also slow. You save the fact, not the novel.",
    plain:
      "Memory is storage outside this one turn. It might be a note, a row in a database, or a short profile. The chat window is not memory. Close it and the words are gone, unless you saved them. In a project, decide the few facts worth keeping: name, preference, the decision you already made. Forgetting on purpose is a feature.",
    example:
      "The helper remembers you like short answers. It does not remember every draft it threw away last Tuesday.",
    tryThis:
      "Write three facts a helper should remember about you, and three it should forget. The second list matters more.",
    tools: [
      tool(
        "ChatGPT memory settings",
        "See a product version of 'what it kept.'",
        "https://help.openai.com/en/articles/8590148-memory-faq",
        "Read what memory is, in their words.",
        "Stop before you change your own settings, unless you want to."
      ),
    ],
    remember: "Remember it as: save the fact. Let the rest go.",
  },
  "tools-and-memory/context": {
    picture: `flowchart LR
  desk[This turn's desk] --> question[The question]
  desk --> notes[The notes you put there]
  desk --> tools[Tool results]`,
    pictureCaption: "Context is whatever is on the desk for this one turn.",
    story:
      "You can be brilliant and still blank if someone asks you a question while hiding the page. Context is the page on the desk. Memory is the notebook in the drawer. They are not the same.",
    plain:
      "Context is the text the model can see right now: the question, the instructions, and any notes or tool results you placed there. It lives inside the context window, the token limit from chapter 1. When the desk is crowded, the model misses the line you cared about. In a project, you pack the desk on purpose. You do not dump the whole drive.",
    example:
      "You want a summary of one meeting. You put that meeting's notes on the desk. You leave last year's notes in the drawer.",
    tryThis:
      "For a question you asked a chat recently, write what should have been on the desk. If the answer was wrong, the missing page is often why.",
    tools: [
      tool(
        "Anthropic on context windows",
        "A clear official note on how much fits.",
        "https://docs.anthropic.com/en/docs/build-with-claude/context-windows",
        "Read the first explanation of the window.",
        "Stop before prompt-caching details."
      ),
    ],
    remember: "Remember it as: context is the desk. Memory is the drawer.",
  },
  "tools-and-memory/mcp": {
    picture: `flowchart LR
  agent[Any agent] --> plug[MCP]
  plug --> tools[The same tools]`,
    pictureCaption: "MCP is a shared plug. The agent and the tool do not have to be from the same company.",
    story:
      "Every hotel used to have a different phone charger. A shared plug means your phone works in the next hotel without a new brick. MCP, the Model Context Protocol, is that shared plug for tools.",
    plain:
      "MCP is a way for an agent to discover and call tools that live in their own little servers: files, a browser, a database. You do not rebuild the tool for every framework. In a project, you use MCP when the tool already exists as a server. You still decide which plug the agent is allowed to touch. A shared standard is not a permission slip.",
    example:
      "A file tool speaks MCP. Claude can use it. Another app can use the same file tool tomorrow, without you rewriting the file reader.",
    tryThis:
      "Open the docs link. Find one sentence that says what connects to what. Write it in your own words.",
    tools: [
      tool(
        "MCP introduction",
        "The official short version of the shared plug.",
        "https://modelcontextprotocol.io/introduction",
        "Read the introduction.",
        "Stop before you install a server. The picture is the goal today."
      ),
    ],
    remember: "Remember it as: MCP is a shared plug for tools.",
  },
  "tools-and-memory/what-to-remember": {
    picture: `flowchart LR
  noisy[A long chat] --> pick[Pick a fact]
  pick --> save[Save that]
  noisy --> drop[Let the rest go]`,
    pictureCaption: "Most of a chat is noise. Memory is the sentence you would write on a card.",
    story:
      "You do not file every grocery receipt in the family album. You file the one that proves you bought the gift. The album stays something you can open.",
    plain:
      "Good memory is small and specific: a decision, a preference, an id, a date you already confirmed. Bad memory is the raw transcript, because next time the model may treat a joke as a rule. In a project, write a save step that stores one card, and a read step that puts that card on the desk only when it matters.",
    example:
      "Save: 'Refund approved for order 184, 14 dollars, by Sam on Tuesday.' Do not save the ten messages where Sam was annoyed.",
    tryThis:
      "Take a chat you had this week. Write the one card worth keeping. Throw the rest away on paper.",
    tools: [
      tool(
        "A notes app",
        "Practice the card before you buy a database.",
        "https://keep.google.com",
        "Make one card with a single fact.",
        "Stop when the card would still make sense next month."
      ),
    ],
    remember: "Remember it as: one card, not the whole chat.",
  },
  "tools-and-memory/human-approval": {
    picture: `flowchart LR
  draft[Draft] --> person[A person]
  person -->|Yes| act[The sharp tool]
  person -->|No| stop[Stop]`,
    pictureCaption: "The sharp tool sits behind a yes.",
    story:
      "A trainee can write the letter. They do not get the company stamp until someone reads it. The stamp is the tool. The reading is the approval.",
    plain:
      "Human approval means the loop pauses and a person sees the exact action: the email, the amount, the file to delete. A checkbox buried in settings is not approval. In a project, the sharp tools — send, pay, delete, merge — call a person. The dull tools — search, draft, summarize — can run.",
    example:
      "The helper prepares a calendar invite and shows the time. You tap yes. The calendar tool runs with that time, not with a time the model invents after you looked away.",
    tryThis:
      "Split a helper's buttons into dull and sharp. Sharp ones get a yes. Write the sentence the person should see.",
    tools: [
      tool(
        "Claude",
        "Practice showing a draft before any send.",
        "https://claude.ai",
        "Ask for a draft of a message you will not send.",
        "Stop at the draft."
      ),
    ],
    remember: "Remember it as: dull tools can run. Sharp tools wait for a yes.",
  },
  "tools-and-memory/a-tool-list-for-a-helper": {
    picture: `flowchart LR
  helper[One helper] --> dull1[Read notes]
  helper --> dull2[Draft]
  helper --> sharp[Send, only after yes]`,
    pictureCaption: "Three tools. Two dull. One sharp, and it waits.",
    story:
      "A pocket knife with forty blades is a catalog. A knife with a blade and a spoon is something you can hand to a friend. They will know which end to hold.",
    plain:
      "This chapter's build is a tool list, not an install. Pick one helper. Give it at most three tools. For each, write the name, what it reads, what it returns, and whether a person must say yes. Mention memory as one card, and context as what goes on the desk. In a project, this list is the permission review.",
    example:
      "Study helper. read_notes returns a paragraph. draft_answer returns text. send_to_group is sharp and waits. Memory card: 'user wants short answers.'",
    tryThis:
      "Write the three tools on a page. If you want a fourth, delete one. Then say which card of memory you would save.",
    tools: [
      tool(
        "MCP introduction",
        "Only if one of your tools already exists as a plug.",
        "https://modelcontextprotocol.io/introduction",
        "Skim to see if your tool sounds like a server.",
        "Stop if you are still inventing the tool. A paper list is enough."
      ),
    ],
    remember: "Remember it as: three tools, named, and the sharp one waits.",
  },
};
