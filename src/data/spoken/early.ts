import { tool, type SpokenLesson } from "../spoken-types";

const chat = tool(
  "ChatGPT",
  "A chat box you can open in the browser. Good for a first try.",
  "https://chatgpt.com",
  "Open a new chat. Ignore the model picker for now.",
  "Stop after you have asked one question and read the answer."
);
const claude = tool(
  "Claude",
  "Another chat box. The feel is a little different. That is useful to notice.",
  "https://claude.ai",
  "Open a new chat.",
  "Stop after one question. You are comparing the feeling, not studying the company."
);
const gemini = tool(
  "Gemini",
  "Google's chat. Handy if you already live in Google's tools.",
  "https://gemini.google.com",
  "Open a new chat.",
  "Stop after one question."
);

export const earlyLessons: Record<string, SpokenLesson> = {
  "meet-ai/what-is-ai": {
    picture: `flowchart LR
  you[You] --> ask[A question]
  ask --> guess[A guess]
  guess --> you`,
    pictureCaption: "You ask. It guesses a useful next step. You decide if the guess is good.",
    story:
      "Picture a friend who has read a ridiculous number of books, but they were not in the room when your life happened. You ask them what to cook. They suggest pasta. Sometimes the pasta idea is great. Sometimes you are out of pasta and they did not know.",
    plain:
      "AI, here, means a computer program that looks at what you gave it and guesses a useful next piece. It is not a person, and it does not 'know' you. Machine learning is the family of programs that got good by seeing many examples, instead of a human writing a rule for every case. In a project, you use that guess as a draft. You still check it before it touches a customer, a file, or an email.",
    example:
      "You type 'turn these messy notes into three bullets.' The program has seen a lot of notes and bullets. It drafts three. You delete the one that invented a deadline you never wrote.",
    tryThis:
      "Open any chat you already have. Ask it to turn one sentence from your day into three bullets. Notice what it kept, and what it added that you did not say.",
    tools: [chat, claude, gemini],
    remember: "Remember it as: AI guesses a useful next step. You still decide.",
  },
  "meet-ai/machine-learning": {
    picture: `flowchart LR
  examples[Many examples] --> practice[Practice]
  practice --> habit[A habit]
  habit --> newCase[A new case]`,
    pictureCaption: "Show it many examples. It picks up a habit. Then it tries that habit on something new.",
    story:
      "A child learns 'dog' by seeing dogs, not by reading a law about ears and tails. After a while, a new dog still looks like a dog. A cat does not. They will still call a fox a dog once. That mistake is part of learning from examples.",
    plain:
      "Machine learning is how a program gets a habit from examples. Deep learning is the same idea with a bigger, layered habit, which is why chat models can handle language. You do not need to train one to use one. In a project, you are usually the person who brings the question and checks the habit, not the person who builds the habit from scratch.",
    example:
      "A photo app has seen a million pictures labeled 'receipt.' You point your camera at a receipt. It finds the total. It has never seen your kitchen. It has seen lots of receipts.",
    tryThis:
      "Think of one thing you got good at by examples, not by a written rule. Cooking rice. Spotting a spam text. That feeling is machine learning.",
    tools: [
      tool(
        "Google's ML crash course intro",
        "A short public intro if the word still feels foggy.",
        "https://developers.google.com/machine-learning/crash-course",
        "Read the first 'Introduction to ML' page only.",
        "Stop before any math exercise. Come back to the chat."
      ),
    ],
    remember: "Remember it as: examples in, a habit out, a new case next.",
  },
  "meet-ai/a-chatbot": {
    picture: `flowchart LR
  you[You] --> box[Chat box]
  box --> reply[A reply]
  reply --> you`,
    pictureCaption: "A chatbot stays in the conversation. It does not go open your files unless you built that in.",
    story:
      "A receptionist can sound warm and still only be allowed to answer questions. They do not walk into the office and file your taxes. A chatbot is that receptionist. Friendly. Stuck at the desk.",
    plain:
      "A chatbot is a chat window on top of a language model. You type. It replies. The reply can be helpful and still be only words. An agent, later, is what you get when those words are allowed to take a step: search, click, write. In a project, start with a chatbot when the job is 'talk this through.' Add actions only when talk is not enough.",
    example:
      "You ask a support chat 'where is my order?' If it only explains the tracking page, it is a chatbot. If it looks up your order and shows the status, someone gave it a tool.",
    tryThis:
      "In a chat product, ask 'what can you do from this window?' Read the answer as a list of talk, not a list of chores it will run for you.",
    tools: [chat, claude],
    remember: "Remember it as: a chatbot talks. It does not run errands yet.",
  },
  "meet-ai/try-a-chat-this-week": {
    picture: `flowchart LR
  open[Open a chat] --> ask[Ask three things]
  ask --> notice[Notice what it added]`,
    pictureCaption: "Three small asks. Then you stop. This week is about using it, not building it.",
    story:
      "The first time you use a new kitchen, you boil water. You do not cater a wedding. Boiling water tells you the stove works, and how hot 'hot' feels.",
    plain:
      "ChatGPT, Claude, and Gemini are places to talk to a model today. You do not need an API key for this. Pick one. Ask it to explain a word you pretend a younger cousin asked. Ask it to rewrite a text you might really send. Ask it something you know the answer to, so you can catch a made-up bit. In a project later, this same habit — check the answer against something you know — is how you keep the helper honest.",
    example:
      "You know your city has a Tuesday market. You ask 'what day is the market?' If it invents a Thursday market with a confident tone, you have just met a hallucination. We name that properly in the next chapter. For now, notice the feeling.",
    tryThis:
      "This week, one chat, three prompts: explain a word, rewrite a message, and ask a fact you already know. Write down one thing it added that you did not say.",
    tools: [chat, claude, gemini],
    remember: "Remember it as: use the chat before you try to build one.",
  },
  "meet-ai/when-not-to-trust-it": {
    picture: `flowchart LR
  answer[A fluent answer] --> check{"Do you know a source?"}
  check -->|No| pause[Pause]
  check -->|Yes| use[Use it as a draft]`,
    pictureCaption: "Smooth writing is not the same as a source you can point to.",
    story:
      "A tour guide can describe a street they have not walked this year. The story is lovely. The bakery moved. You only find out when you are standing there hungry.",
    plain:
      "Do not trust a chat with numbers you have not checked, medical or legal decisions, or anything you would be ashamed to have sent. It will sound sure. Sure is a style it learned. In a project, treat the reply as a draft. If the cost of being wrong is high, a person looks before it goes out.",
    example:
      "You ask for a citation. It names a paper with a real-sounding title. You search the title. Nothing. The sentence was a guess wearing a lab coat.",
    tryThis:
      "Ask a chat for the source of a fact you can search in ten seconds. Open the source. If it is missing or different, that is the lesson.",
    tools: [
      chat,
      tool(
        "A normal search box",
        "Use search to check one claim. The chat is not the source.",
        "https://www.google.com",
        "Paste one claim from the chat.",
        "Stop when you have either found it or not."
      ),
    ],
    remember: "Remember it as: fluent is not the same as true.",
  },
  "meet-ai/your-first-small-build": {
    picture: `flowchart LR
  who[Who it helps] --> job[The job]
  job --> check[How you will check it]`,
    pictureCaption: "A build can be a page of paper. Name the person, the job, and the check.",
    story:
      "Before anyone wires a kitchen, someone says who is eating and what dinner is. The pipes come later. If you skip dinner, you get a beautiful kitchen that cooks nothing you wanted.",
    plain:
      "Your first build is a short brief, not an app. Write who the helper is for, what they will ask it, what it is allowed to say, and how you will know an answer is wrong. Use words from this chapter: it guesses, it talks, you check. In a real project this brief is the thing you show a teammate before anyone opens a code editor.",
    example:
      "For a study group: 'This helper explains a term in plain English. It does not invent page numbers from our textbook. If it is unsure, it says so. I check one claim each time.'",
    tryThis:
      "Write six lines: who, what they ask, what good looks like, what it must not do, how you will check, which chat you will use to try the first question.",
    tools: [chat],
    remember: "Remember it as: name the job and the check before you name the tool.",
  },
  "generative-ai/what-is-an-llm": {
    picture: `flowchart LR
  words[A mountain of text] --> habit[Guess the next word]
  habit --> reply[Your reply]`,
    pictureCaption: "A large language model got good at guessing the next piece of language.",
    story:
      "Finish this: 'peanut butter and ___.' You said jelly, or maybe banana. You were not casting a spell. You have seen that pair a lot. A large language model, an LLM, is that habit at a huge scale.",
    plain:
      "An LLM is a model trained to continue text. Chat products wrap that habit in a conversation: your message in, a reply out. Generative AI is the wider name for models that make something new — words, pictures, sound — instead of only labeling a photo 'cat.' This is the only chapter we spend on that family. In a project, the LLM is the voice. The project still needs your rules, your files, and your check.",
    example:
      "You paste a messy paragraph and say 'make this kinder and shorter.' The model continues in the direction 'kinder and shorter' because that pattern was in its practice, and your instruction is sitting in front of it.",
    tryThis:
      "In ChatGPT, Claude, or Gemini, give it the first half of a sentence you finish every day. See what it guesses. That guess is the habit.",
    tools: [chat, claude, gemini],
    remember: "Remember it as: an LLM guesses the next bit of language.",
  },
  "generative-ai/tokens": {
    picture: `flowchart LR
  sentence[Your sentence] --> pieces[Small pieces]
  pieces --> model[The model]`,
    pictureCaption: "The model does not see words the way you do. It sees tokens, little pieces.",
    story:
      "You think 'sunshine' is one word. A printer might break it into 'sun' and 'shine' if that is how its letters are stored. The model has its own way of snapping language into pieces. Those pieces are tokens.",
    plain:
      "A token is a chunk of text the model counts. Sometimes it is a word. Sometimes it is part of a word. You pay, and you hit limits, in tokens, not in words. A context window is how many tokens fit on the desk for one turn: your note, plus the reply, plus anything else you attached. In a project, long pastes cost more and can push the important line off the desk.",
    example:
      "You paste a 40-page PDF into chat and wonder why it 'forgot' page 1. The desk was full. The early pages fell off.",
    tryThis:
      "Paste a short paragraph into a chat and ask 'about how many tokens is this?' Treat the number as a rough feel, not a bill.",
    tools: [
      tool(
        "OpenAI tokenizer",
        "A page that shows text broken into tokens. Seeing it once is enough.",
        "https://platform.openai.com/tokenizer",
        "Paste one sentence you wrote.",
        "Stop when you can point at a word that split into more than one piece."
      ),
    ],
    remember: "Remember it as: tokens are the pieces, and the desk is only so big.",
  },
  "generative-ai/prompts": {
    picture: `flowchart LR
  job[The job] --> note[Your prompt]
  note --> reply[The reply]`,
    pictureCaption: "A prompt is the note you hand over. The reply follows that note.",
    story:
      "You text a friend 'get the thing.' They bring a charger, or a cake, or a chair. 'Get the blue notebook on my desk' gets the notebook. The second text is a prompt. The first one is a shrug.",
    plain:
      "A prompt is the instruction plus the material you want used. Say the job, who it is for, what to include, and what to leave out. Prompt engineering is just the practice of writing that note on purpose. In a project, save the prompt next to the code. When the answers drift, you change the note, not the whole app.",
    example:
      "'Summarize' gives you a random length. 'Summarize in four bullets for a tired teammate. Do not add facts that are not in the note.' gives you something you can use in a standup.",
    tryThis:
      "Take a vague prompt you have used. Add who it is for, how long, and one thing it must not invent. Run both. Keep the clearer one.",
    tools: [chat, claude],
    remember: "Remember it as: a prompt is a clear note, not a magic spell.",
  },
  "generative-ai/hallucinations": {
    picture: `flowchart LR
  gap[A gap in the note] --> guess[A confident guess]
  guess --> you[You check]`,
    pictureCaption: "If the answer is not in the note, the model may fill the hole and sound sure.",
    story:
      "Ask someone for a quote they half remember. They will often finish it in the right voice, with the wrong words. They are not lying for fun. They are completing the pattern.",
    plain:
      "A hallucination is a made-up detail served with a steady voice. The model is continuing text, not looking up a file, unless you built that lookup. In a project, you lower the chance by giving the source, asking it to say 'I don't see that' when the source is silent, and checking anything a person would be hurt by.",
    example:
      "You ask for three customer quotes from a doc that has one. It writes three. Two customers do not exist. The pattern 'three quotes' won over the page you gave it.",
    tryThis:
      "Give a chat a five-line note and ask for a date that is not in the note. See if it invents one or admits the gap.",
    tools: [chat],
    remember: "Remember it as: a gap plus confidence is a hallucination.",
  },
  "generative-ai/picking-a-model": {
    picture: `flowchart LR
  job[Your job] --> kind{"Need the fancy one?"}
  kind -->|Chat and drafts| everyday[An everyday chat]
  kind -->|A harder read| stronger[A stronger model]`,
    pictureCaption: "Start with the chat you already have. Move up when the job is actually harder.",
    story:
      "You do not hire a moving truck to carry a book. You also do not carry a sofa on a bicycle and then blame the bicycle.",
    plain:
      "ChatGPT, Claude, and Gemini can all do the early work in this path. Open models, the ones you can run more privately, matter later if your notes cannot leave the building. Closed models are the ones you reach through a company's app or API. In a project, pick the one your team can open today. Switch when you have a reason: length, price, or a test the current one keeps failing.",
    example:
      "Rewriting a text message does not need the most expensive model. Reading a long contract and listing risks might. You notice that by trying the cheap one first.",
    tryThis:
      "Ask the same question in two chats you can open. Keep the reply that was easier to check, not the one that was longer.",
    tools: [chat, claude, gemini],
    remember: "Remember it as: start with a chat you can open. Upgrade for a reason.",
  },
  "generative-ai/temperature-in-plain-words": {
    picture: `flowchart LR
  low[Low temperature] --> steady[The likely words]
  high[Higher temperature] --> wander[A wider guess]`,
    pictureCaption: "Low stays near the obvious next word. Higher is willing to wander.",
    story:
      "Ask a careful cook for dinner and you get the dish they always make. Ask a playful cook and you might get a strange sandwich. Both are still cooking. The dial is how playful.",
    plain:
      "Temperature is a dial on how tightly the model sticks to the most likely next token. Low is steadier, which you want for forms, extracts, and anything you will parse. Higher wanders, which can help a brainstorm and hurt a fact. Top-p is a cousin dial that limits how far down the list of likely words it may reach. In a project, leave the dial alone until the prompt is clear. Then lower it if the answers will not sit still.",
    example:
      "You ask for a JSON list of names from a paragraph. At a high temperature it sometimes adds a name, or breaks the shape. Lower, it copies what is there.",
    tryThis:
      "If your chat shows a temperature or 'creativity' control, run one factual question at the calm end and one at the playful end. If you cannot see the dial, skip it. The prompt matters more today.",
    tools: [
      tool(
        "OpenAI temperature note",
        "A short official description of the dial, if you want the source.",
        "https://platform.openai.com/docs/api-reference/chat/create",
        "Search the page for temperature.",
        "Stop after that one field. Do not build a request yet."
      ),
    ],
    remember: "Remember it as: low temperature stays put. High temperature wanders.",
  },
  "generative-ai/a-prompt-you-can-reuse": {
    picture: `flowchart LR
  role[Who it is] --> job[The job]
  job --> limits[What it must not do]
  limits --> save[Save the note]`,
    pictureCaption: "A prompt you can reuse has a job, a reader, and a limit.",
    story:
      "A recipe card on the fridge beats a story you retell differently every Sunday. The card is a bit boring. Dinner happens.",
    plain:
      "Write a prompt you could paste next month and still trust. Include the role, the input, the output shape, and a line that says not to add facts that are not in the input. This is the build for the chapter. In a project, this card is what you version. When the helper gets worse, you diff the card.",
    example:
      "'You explain terms to a beginner. I will paste a term. Reply in four short sentences. Use one everyday picture. If you are unsure, say so. Do not invent a source.'",
    tryThis:
      "Write that card for a job you really have. Paste it into ChatGPT, Claude, or Gemini with one real input. Save the prompt, not just the answer.",
    tools: [chat, claude, gemini],
    remember: "Remember it as: save the prompt like a recipe card.",
  },
};
