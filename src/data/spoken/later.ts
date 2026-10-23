import { tool, type SpokenLesson } from "../spoken-types";

export const laterLessons: Record<string, SpokenLesson> = {
  "your-own-knowledge/the-model-does-not-know-your-files": {
    picture: `flowchart LR
  training[Training, already over] --> model[The model]
  files[Your files] --> nowhere[Not in there]
  files --> you[You have to hand them over]`,
    pictureCaption: "Your folder was not in the training set. You bring the pages.",
    story:
      "A new coworker can be brilliant and still not know where you keep the spare keys. You do not yell at them for missing the keys. You show them the drawer.",
    plain:
      "The model learned from data that stopped at some point, and your private files were not in that pile. Asking nicer does not upload the folder. If you want answers from your notes, you put the relevant pages on the desk, or you give it a tool that fetches them. In a project, this is the moment you stop blaming the chat and start deciding which documents are allowed in.",
    example:
      "You ask 'what did we decide in Tuesday's meeting?' The model invents a decision. The notes are in your drive. It has never seen them.",
    tryThis:
      "Ask a chat a question that is only answered by a file on your computer. When it guesses, that is the lesson. Do not paste the whole file yet.",
    tools: [
      tool(
        "ChatGPT",
        "See the gap with a question only your files can answer.",
        "https://chatgpt.com",
        "Ask one private question without uploading anything.",
        "Stop when you see it guess or admit it cannot know."
      ),
    ],
    remember: "Remember it as: if it was not shown the page, it does not know the page.",
  },
  "your-own-knowledge/chunks": {
    picture: `flowchart LR
  doc[A long doc] --> pieces[Small pieces]
  pieces --> pick[Pick a few]`,
    pictureCaption: "You cut the document so the desk can hold the part that matters.",
    story:
      "You do not hand someone a novel when they asked for the recipe on page 40. You hand them that page, maybe the page before it. Those pages are chunks.",
    plain:
      "A chunk is a slice of a document: a heading plus the paragraph under it, or a fixed size with a little overlap so a sentence is not cut in half. You slice because the context window cannot hold every file, and because a smaller slice is easier to search. In a project, chunk by sections people already wrote, not by a random number, when the doc has headings.",
    example:
      "A policy PDF becomes one chunk per heading. The question 'how many days for a refund?' retrieves the refund heading, not the parking policy.",
    tryThis:
      "Take one page you wrote. Draw lines where you would cut it so each piece can answer one kind of question.",
    tools: [
      tool(
        "LangChain text splitter docs",
        "See how a popular library talks about cutting text.",
        "https://python.langchain.com/docs/concepts/text_splitters/",
        "Read the concept page.",
        "Stop before you install LangChain."
      ),
    ],
    remember: "Remember it as: a chunk is a page you can hand over.",
  },
  "your-own-knowledge/embeddings": {
    picture: `flowchart LR
  sentence[A sentence] --> numbers[A list of numbers]
  numbers --> nearby[Similar ideas sit nearby]`,
    pictureCaption: "An embedding is a list of numbers that puts similar meanings near each other.",
    story:
      "You can arrange spices so the sweet ones share a shelf, even if the jars look nothing alike. The shelf is not the flavor. It is a way to stand near what you are like. An embedding is that shelf, as numbers.",
    plain:
      "An embedding model turns text into a list of numbers called a vector. Sentences with a similar meaning get lists that point a similar way. Search can then find 'money back' when the document says 'refund,' because the numbers sit near each other. In a project, you embed the chunks once, and you embed the question when someone asks.",
    example:
      "The question 'can I get my money back?' lands near the chunk that says 'refunds within 14 days,' even though the words do not match.",
    tryThis:
      "Write two phrases that mean the same thing with different words, and one phrase that does not. That trio is what embeddings are trying to separate.",
    tools: [
      tool(
        "OpenAI embeddings guide",
        "The short official picture of turning text into numbers.",
        "https://platform.openai.com/docs/guides/embeddings",
        "Read the opening. Look at one example request.",
        "Stop before you create a key or run a batch."
      ),
    ],
    remember: "Remember it as: embeddings put similar meanings on the same shelf.",
  },
  "your-own-knowledge/search": {
    picture: `flowchart LR
  question[Question] --> shelf[The number shelf]
  shelf --> few[A few chunks]
  few --> desk[Onto the desk]`,
    pictureCaption: "Search does not answer. It fetches the pages the answer should come from.",
    story:
      "A librarian does not recite the book from memory. They walk you to the shelf. Search is the walk. The model is the person who then reads the page out loud.",
    plain:
      "Search here means: take the question, find the closest chunks, return those chunks. Keyword search matches words. Vector search matches the number shelf. Hybrid search uses both. In a project, look at the chunks before you look at the final paragraph. If the wrong pages came back, a prettier prompt will not save you.",
    example:
      "You ask about parking. Search returns the parking chunk and, wrongly, the party chunk because both say 'Friday.' You see that and fix the chunks. You do not blame the model yet.",
    tryThis:
      "For one real question, write the three sentences you would hope search returns. If you cannot, the documents are not ready.",
    tools: [
      tool(
        "Chroma getting started",
        "A small vector database people use to store chunks.",
        "https://docs.trychroma.com/docs/overview/getting-started",
        "Read the overview.",
        "Stop before a full app tutorial."
      ),
    ],
    remember: "Remember it as: search fetches pages. It does not answer yet.",
  },
  "your-own-knowledge/a-simple-rag-picture": {
    picture: `flowchart LR
  ask[Ask] --> retrieve[Retrieve chunks]
  retrieve --> answer[Answer from those chunks]`,
    pictureCaption: "RAG is retrieve, then generate. Two beats, in that order.",
    story:
      "An open-book test: you find the page, then you write the answer in your own words. If you write first and wave a book you never opened, that is the usual chat. RAG is the open book.",
    plain:
      "RAG means retrieval-augmented generation. You retrieve chunks, you put them on the desk, and the model generates an answer from them. Say in the prompt: only use these pages, and say if they do not contain the answer. In a project, save the chunks next to the answer so a person can see where it came from.",
    example:
      "A team handbook bot retrieves the vacation chunk and says '15 days, from the PTO page.' If the chunk is silent, it says 'I don't see that,' instead of inventing 20.",
    tryThis:
      "In a chat, paste one short policy you wrote and ask a question. Tell it to answer only from what you pasted. That paste is a handmade RAG.",
    tools: [
      tool(
        "ChatGPT, Claude, or Gemini",
        "Handmade RAG: you paste the page yourself.",
        "https://claude.ai",
        "Paste a short note, then ask one question about it.",
        "Stop after you see it stick to the note, or wander off it."
      ),
    ],
    remember: "Remember it as: find the page, then answer from the page.",
  },
  "your-own-knowledge/when-rag-is-the-wrong-tool": {
    picture: `flowchart LR
  question[Question] --> kind{"What kind?"}
  kind -->|A fact in a doc| rag[RAG]
  kind -->|Math or a live system| tool[A tool]
  kind -->|A judgment| person[A person]`,
    pictureCaption: "Not every question is hiding in a document.",
    story:
      "You do not look up 'what is 2 + 2' in the employee handbook. You also do not let a handbook fire someone. Different questions want different drawers.",
    plain:
      "Use RAG when the answer is written down in your files. Use a tool when the answer lives in a calculator, a database, or today's calendar. Use a person when the cost of being wrong is a relationship, a law, or money you cannot undo. In a project, label the question before you pick the drawer.",
    example:
      "'What is our refund window?' is RAG. 'What is the customer's balance right now?' is a database tool. 'Should we make an exception?' is a person.",
    tryThis:
      "Take five questions you wish a helper answered. Mark each one doc, tool, or person.",
    tools: [
      tool(
        "Your own notes",
        "The build is a sorting exercise.",
        "https://keep.google.com",
        "Make three headings: doc, tool, person.",
        "Stop when five real questions are sorted."
      ),
    ],
    remember: "Remember it as: documents, live tools, and people are different drawers.",
  },
  "your-own-knowledge/answer-from-one-doc": {
    picture: `flowchart LR
  doc[One doc] --> chunks[A few chunks]
  chunks --> answer[An answer with a quote]
  answer --> check[You check the quote]`,
    pictureCaption: "One document. An answer that points at the line it used.",
    story:
      "A student who shows their work can be corrected in a second. A student who only circles the grade makes you re-read the whole chapter. Show the line.",
    plain:
      "This chapter's build: pick one real document. Cut it into a few chunks on paper. Write one question. Write which chunk should be retrieved. Write the answer in two sentences and quote the line it came from. Say what the helper should reply if the line is missing. In a project, that quote is how you trust it.",
    example:
      "Doc: a one-page syllabus. Question: when is the draft due? Chunk: the dates section. Answer: 'The draft is due March 3,' plus that sentence quoted.",
    tryThis:
      "Do it with a doc you can hold. If you cannot point at the line, the helper should say it does not see the answer.",
    tools: [
      tool(
        "Claude or ChatGPT",
        "Optional: paste the one chunk and compare your answer to its draft.",
        "https://chatgpt.com",
        "Paste only the chunk you chose.",
        "Stop when you have checked its words against your quote."
      ),
    ],
    remember: "Remember it as: no quote, no answer.",
  },
  "build-with-tools/pick-one-path": {
    picture: `flowchart LR
  many[Many toolkits] --> one[Learn one]
  one --> visit[Visit the others later]`,
    pictureCaption: "One path you can walk. The other names are doors, not homework.",
    story:
      "A city has twelve gyms. You get strong at the one you actually go to. Collecting membership cards does not build the habit.",
    plain:
      "LangGraph, the OpenAI Agents SDK, Claude's agent tools, Google's ADK, CrewAI, and PydanticAI can all run a loop. They are not different sciences. Pick one official quickstart and finish its hello-world later in this chapter. In a project, the second toolkit is a reason, not a hobby: your team already uses it, or the first one cannot do a step you measured.",
    example:
      "You like Python and you already have an OpenAI key for class. You walk the OpenAI quickstart. You do not also install four others tonight.",
    tryThis:
      "Write the one toolkit name you will open this chapter, and the reason. 'It was on a list' does not count. 'I can open its docs' does.",
    tools: [
      tool(
        "OpenAI Agents SDK",
        "A reasonable first path if you want a small Python hello-world.",
        "https://openai.github.io/openai-agents-python/quickstart/",
        "Open the quickstart. Read the first screen.",
        "Stop before you install. The next module is about how to read the page."
      ),
    ],
    remember: "Remember it as: one gym. Go to it.",
  },
  "build-with-tools/the-official-quickstart": {
    picture: `flowchart LR
  page[Docs page] --> hello[The hello example]
  hello --> stop[Stop]
  stop --> yourJob[Then your job]`,
    pictureCaption: "Find the first example. Run or read it. Leave before the advanced chapter.",
    story:
      "Ikea instructions work if you build the first shelf before you invent a loft. Docs are the same. The first example is the shelf.",
    plain:
      "On a toolkit site, open Quickstart. Find the smallest example that runs an agent. Note the install line, the one function that starts the run, and what a result looks like. Ignore multi-agent galleries. In a project, you return to this page when a name in an error matches a heading. You do not read it like a novel.",
    example:
      "The quickstart shows Runner.run_sync. You already met that whistle. You are confirming the import and where the instructions go.",
    tryThis:
      "Open the quickstart you picked. Copy, onto paper, only: the install command, the start-the-run line, and one sentence on what it prints.",
    tools: [
      tool(
        "OpenAI Agents quickstart",
        "Use this if you did not pick another.",
        "https://openai.github.io/openai-agents-python/quickstart/",
        "Find the first complete example.",
        "Stop at the end of that example. Do not open 'advanced' yet."
      ),
    ],
    remember: "Remember it as: quickstart, first example, then stop.",
  },
  "build-with-tools/langgraph-and-friends": {
    picture: `flowchart LR
  stepA[Step A] --> stepB[Step B]
  stepB --> stepA
  stepB --> done[Done]`,
    pictureCaption: "LangGraph shines when the job is a picture of steps, including a step that repeats.",
    story:
      "A board game has squares and rules for which square you may enter next. LangGraph is that board for an agent. You draw the squares.",
    plain:
      "LangGraph is a way to build the loop as a graph: nodes that do work, edges that say what happens next. Use it when the path has a shape you want to see, or a step that must repeat until a check passes. LangChain is the wider toolbox around it. In a project, do not start here if a single run call is enough. Come here when the paper sketch has branches.",
    example:
      "Draft, then check, then draft again if the check fails, then ask a person. That picture is a graph.",
    tryThis:
      "If your paper agent from chapter 2 is a straight line, leave LangGraph for later. If it has a loop back, open their overview and find the picture.",
    tools: [
      tool(
        "LangGraph overview",
        "Their own picture of nodes and edges.",
        "https://langchain-ai.github.io/langgraph/",
        "Read the overview on the home docs.",
        "Stop before a full tutorial install, unless this is the one gym you picked."
      ),
    ],
    remember: "Remember it as: LangGraph is the board game version of the loop.",
  },
  "build-with-tools/openai-agents": {
    picture: `flowchart LR
  agent[Agent] --> run[Runner.run]
  run --> output[final_output]`,
    pictureCaption: "OpenAI's SDK: describe the agent, call run, read the output.",
    story:
      "Some kitchens label the pans in English. If you already buy their ingredients, their labels are the least confusing.",
    plain:
      "The OpenAI Agents SDK lets you define an agent with instructions and tools, then start a run. It is a good first path if your model is already OpenAI's. In a project, keep your instructions in a file you can diff, and keep tools narrow. The SDK will not supply your judgment.",
    example:
      "An agent named Drafter with instructions 'draft only' and no send tool. The run prints a paragraph. That is a success.",
    tryThis:
      "On their quickstart, point at the Agent(...) line and the run line. Those two are the whole hello-world.",
    tools: [
      tool(
        "OpenAI Agents quickstart",
        "The page with the hello-world.",
        "https://openai.github.io/openai-agents-python/quickstart/",
        "Find Agent and Runner.",
        "Stop after the first example."
      ),
    ],
    remember: "Remember it as: an Agent, then a run, then the output.",
  },
  "build-with-tools/claude-and-google": {
    picture: `flowchart LR
  claude[Claude docs] --> idea[The same loop]
  google[Google ADK] --> idea`,
    pictureCaption: "Different front doors. The loop inside is the one you already know.",
    story:
      "Two cafes. Both sell coffee. The menu words change. You still know what coffee is, so you can order without learning a new plant.",
    plain:
      "Anthropic's docs show tool use and agent patterns for Claude. Google's Agent Development Kit, ADK, is their toolkit for agents on their models. Read them when your team is already on Claude or Gemini. In a project, translate their hello-world back into your paper sketch: goal, tools, stop. If you cannot, you are copying a demo.",
    example:
      "Their sample has three tools and a web UI. You only needed a draft. You close the tab and keep the one idea that matched your sketch.",
    tryThis:
      "Open one of the two links. Write one sentence: 'their hello-world is our ___ step.'",
    tools: [
      tool(
        "Claude tool use",
        "Anthropic's front door for tools.",
        "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview",
        "Read the overview.",
        "Stop before a long cookbook."
      ),
      tool(
        "Google ADK",
        "Google's agent toolkit, on their docs.",
        "https://google.github.io/adk-docs/",
        "Open Get started and read the first page.",
        "Stop before you download a sample app."
      ),
    ],
    remember: "Remember it as: new menu, same coffee.",
  },
  "build-with-tools/crewai-and-pydantic": {
    picture: `flowchart LR
  crew[Roles on a crew] --> job[One job]
  typed[A typed result] --> job`,
    pictureCaption: "CrewAI thinks in roles. PydanticAI thinks in results that have a shape.",
    story:
      "A film set has a sound person and a camera person. A kitchen ticket has boxes that must be filled. Roles are the film set. A typed result is the ticket.",
    plain:
      "CrewAI is a toolkit where you give agents roles and let them work a task together. PydanticAI pushes the model to return data in a shape you defined, which is lovely when the next step is code, not a paragraph. In a project, use roles when the paper sketch has two jobs. Use a typed result when a person or a database must read fields, not prose.",
    example:
      "You need {date, amount} from a receipt photo's text. A typed result beats a charming paragraph you then have to parse.",
    tryThis:
      "Decide which you need this month: two roles, or a result with fields. Open only that site's intro.",
    tools: [
      tool(
        "CrewAI docs",
        "Roles and tasks, in their words.",
        "https://docs.crewai.com/introduction",
        "Read the introduction.",
        "Stop before a full crew example if you only have one role."
      ),
      tool(
        "PydanticAI",
        "Agents that return a shape.",
        "https://ai.pydantic.dev/",
        "Read the overview on the home page.",
        "Stop at the first mention of a result type."
      ),
    ],
    remember: "Remember it as: roles for a crew, fields when the answer must be data.",
  },
  "build-with-tools/hello-agent": {
    picture: `flowchart LR
  install[Their install] --> startRun[The one call]
  startRun --> output[Read the output]
  output --> doneNode[Stop]`,
    pictureCaption: "Hello-world is a success when you can point at the output. Then you stop.",
    story:
      "The first time the kettle boils, you do not renovate the kitchen. You smile, pour the water, and sit down.",
    plain:
      "This chapter's build: follow the quickstart you picked until one run prints a draft. Use the function below if your path is OpenAI's. If you picked another toolkit, use their start-the-run line instead, and ignore this snippet. In a project, commit the hello-world before you add a second tool. A green hello is the baseline you can return to.",
    example:
      "The program prints a two-sentence reply. You did not add email, files, or a second agent. You are done for today.",
    tryThis:
      "Run their first example, or read it line by line if you cannot install yet. Write what the output was. Stop.",
    tools: [
      tool(
        "OpenAI Agents quickstart",
        "The install and the first run, if this is your gym.",
        "https://openai.github.io/openai-agents-python/quickstart/",
        "Follow the quickstart until the first result prints.",
        "Stop. Do not add tools tonight."
      ),
    ],
    oneFunction: {
      title: "Hello, agent",
      why: "Runner.run_sync is the start. The instructions keep it dull on purpose: draft only.",
      language: "python",
      code: `from agents import Agent, Runner

agent = Agent(
    name="Hello",
    instructions="Reply in two short sentences. Do not use tools.",
)
result = Runner.run_sync(agent, "Say hello and tell me you are only a draft.")
print(result.final_output)`,
    },
    remember: "Remember it as: one run that prints. Then stop.",
  },
};
