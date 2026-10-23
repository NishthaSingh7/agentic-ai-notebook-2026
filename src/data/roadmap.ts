export interface Module {
  slug: string;
  title: string;
  /** One spoken line on the chapter page. */
  description: string;
  /** The question this module answers. Shown on the card that leads here. */
  question: string;
  /** Last module of a chapter: a small build. */
  build?: boolean;
}

export interface Phase {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  modules: Module[];
  projects?: string[];
  /** Kept for older progress math. The learning screens do not show hours. */
  estimatedHours: number;
  /** Pastel fill. Text on it stays charcoal. */
  color: string;
  /** Side shelf. Not part of the main path count. */
  optional?: boolean;
}

function mod(
  slug: string,
  title: string,
  description: string,
  question: string,
  build = false
): Module {
  return { slug, title, description, question, ...(build ? { build: true } : {}) };
}

/**
 * Static 2027 path. The order is how to learn a topic properly.
 * Any card still opens. New market topics go to Notes, not new phases.
 */
export const phases: Phase[] = [
  {
    id: 0,
    slug: "meet-ai",
    title: "Meet AI",
    subtitle: "Chapter 0",
    description: "What AI actually is, and a chat you can try this week.",
    estimatedHours: 4,
    color: "bg-surface",
    modules: [
      mod("what-is-ai", "What is AI", "A plain picture of a machine that guesses the next useful step.", "What is AI, in one sitting?"),
      mod("machine-learning", "Machine learning", "How a program learns from examples instead of a rule for every case.", "What is machine learning?"),
      mod("a-chatbot", "A chatbot", "Why a chat box feels like a person, and what it still is.", "What is a chatbot?"),
      mod("try-a-chat-this-week", "Try a chat this week", "Open ChatGPT, Claude, or Gemini and do three small things.", "How do I use a chat product this week?"),
      mod("when-not-to-trust-it", "When not to trust it", "The moments a confident answer is still a guess.", "When should I not trust an answer?"),
      mod("your-first-small-build", "Your first small build", "A tiny helper you describe on paper, using only this chapter.", "What can I make after chapter 0?", true),
    ],
    projects: ["A one-page helper brief"],
  },
  {
    id: 1,
    slug: "generative-ai",
    title: "Generative AI",
    subtitle: "Chapter 1",
    description: "The one chapter on how a chat model writes, and how you talk to it.",
    estimatedHours: 5,
    color: "bg-surface",
    modules: [
      mod("what-is-an-llm", "What is an LLM", "A model that learned language by guessing the next word, a lot.", "What is an LLM?"),
      mod("tokens", "Tokens", "The small pieces the model actually reads and writes.", "What is a token?"),
      mod("prompts", "Prompts", "The note you hand the model. Clear notes get clearer answers.", "What is a prompt?"),
      mod("hallucinations", "Hallucinations", "When the model invents a fact and sounds sure.", "What is a hallucination?"),
      mod("picking-a-model", "Picking a model", "ChatGPT, Claude, Gemini, and when a smaller model is enough.", "Which model should I open?"),
      mod("temperature-in-plain-words", "Temperature", "A dial for 'stick to the likely words' or 'wander a bit'.", "What does temperature mean?"),
      mod("a-prompt-you-can-reuse", "A prompt you can reuse", "Write one prompt you would actually paste into a project.", "How do I write a prompt I can reuse?", true),
    ],
    projects: ["A reusable prompt"],
  },
  {
    id: 2,
    slug: "how-an-agent-thinks",
    title: "How an agent thinks",
    subtitle: "Chapter 2",
    description: "A chatbot talks. An agent can go and do, then look at what happened.",
    estimatedHours: 5,
    color: "bg-surface",
    modules: [
      mod("chatbot-vs-agent", "Chatbot vs agent", "Talking is not the same as taking a step in the world.", "How is an agent different from a chatbot?"),
      mod("the-loop", "The loop", "Think, act, look, repeat. That is the whole heartbeat.", "What is the agent loop?"),
      mod("planning", "Planning", "A short list of steps before the first action.", "Why would an agent make a plan?"),
      mod("when-to-stop-and-ask", "When to stop and ask", "Some steps should wait for a person.", "When should an agent ask me?"),
      mod("types-of-agents", "Types of agents", "A few shapes you will hear, without a catalog.", "What kinds of agents are people talking about?"),
      mod("one-function-that-starts-it", "The call that starts it", "One function. This is the moment the agent run begins.", "Which function starts an agent?"),
      mod("a-tiny-agent-on-paper", "A tiny agent on paper", "Draw one loop for a job you actually have.", "Can I sketch an agent before I code?", true),
    ],
    projects: ["A paper agent loop"],
  },
  {
    id: 3,
    slug: "tools-and-memory",
    title: "Tools and memory",
    subtitle: "Chapter 3",
    description: "Give the agent hands, and a notebook so it does not start from zero.",
    estimatedHours: 5,
    color: "bg-surface",
    modules: [
      mod("tools", "Tools", "A tool is a button the agent is allowed to press.", "What is a tool?"),
      mod("memory", "Memory", "What the agent keeps after the chat window closes.", "What is agent memory?"),
      mod("context", "Context", "The pages sitting on the desk for this one turn.", "What is context?"),
      mod("mcp", "MCP", "A shared plug so many agents can use the same tools.", "What is MCP?"),
      mod("what-to-remember", "What to remember", "Save the fact. Do not save the whole noisy chat.", "What should an agent remember?"),
      mod("human-approval", "Ask before you act", "Money, mail, and deletes wait for a yes.", "When does a tool need my yes?"),
      mod("a-tool-list-for-a-helper", "A tool list for a helper", "Write the three tools one helper is allowed to use.", "Which tools does my helper need?", true),
    ],
    projects: ["A three-tool list"],
  },
  {
    id: 4,
    slug: "your-own-knowledge",
    title: "Your own knowledge",
    subtitle: "Chapter 4",
    description: "The model has not read your files until you hand it the right pages.",
    estimatedHours: 5,
    color: "bg-surface",
    modules: [
      mod("the-model-does-not-know-your-files", "It does not know your files", "Training ended. Your folder was not in it.", "Why doesn't the model know my files?"),
      mod("chunks", "Chunks", "Cut the document into pieces a model can hold.", "What is a chunk?"),
      mod("embeddings", "Embeddings", "Turn a sentence into a list of numbers so similar ideas sit near each other.", "What is an embedding?"),
      mod("search", "Search", "Find the few chunks that match the question.", "How does search find the right pages?"),
      mod("a-simple-rag-picture", "A simple RAG picture", "Retrieve, then answer. That is RAG.", "What is RAG?"),
      mod("when-rag-is-the-wrong-tool", "When this is the wrong tool", "Some questions need a calculator or a person, not a document search.", "When should I skip RAG?"),
      mod("answer-from-one-doc", "Answer from one doc", "Pick one file and write how a helper would answer from it.", "How do I answer from one document?", true),
    ],
    projects: ["Answer from one document"],
  },
  {
    id: 5,
    slug: "build-with-tools",
    title: "Build with real tools",
    subtitle: "Chapter 5",
    description: "One friendly way to build, and where the other toolkits live.",
    estimatedHours: 5,
    color: "bg-surface",
    modules: [
      mod("pick-one-path", "Pick one path", "Learn one toolkit well. Visit the others later.", "Which toolkit should I learn first?"),
      mod("the-official-quickstart", "The official quickstart", "How to use a docs page without getting lost.", "How do I read a quickstart?"),
      mod("langgraph-and-friends", "LangGraph and friends", "A graph of steps, when the job has a shape.", "What is LangGraph for?"),
      mod("openai-agents", "OpenAI Agents", "OpenAI's own way to hand a model some tools.", "Where do I learn the OpenAI Agents SDK?"),
      mod("claude-and-google", "Claude and Google", "Claude's agent tools, and Google's ADK, on their sites.", "Where are Claude and Google's agent docs?"),
      mod("crewai-and-pydantic", "CrewAI and PydanticAI", "Roles on a crew, and typed results you can trust.", "Where do CrewAI and PydanticAI live?"),
      mod("hello-agent", "Hello, agent", "The one call that starts a run, then you stop and read their docs.", "How do I start one agent run?", true),
    ],
    projects: ["Hello, agent"],
  },
  {
    id: 6,
    slug: "agents-together",
    title: "Agents together",
    subtitle: "Chapter 6",
    description: "More than one helper, still one job.",
    estimatedHours: 4,
    color: "bg-surface",
    modules: [
      mod("why-more-than-one", "Why more than one", "Split the job when one head would mix the tasks.", "When do I want more than one agent?"),
      mod("roles", "Roles", "One researches. One writes. One checks.", "What is a role?"),
      mod("handoff", "Handoff", "Pass the work with a clear note, not a vague 'you do it'.", "What is a handoff?"),
      mod("when-one-is-enough", "When one is enough", "Two agents can just argue. Sometimes one is the whole design.", "When is one agent enough?"),
      mod("a-shared-task", "A shared task", "The job stays one job, even if the helpers change.", "How do agents share one task?"),
      mod("two-helpers-one-job", "Two helpers, one job", "Write a two-role sketch for a job you know.", "Can I sketch two helpers on one job?", true),
    ],
    projects: ["Two helpers, one job"],
  },
  {
    id: 7,
    slug: "trust-and-shipping",
    title: "Trust and shipping",
    subtitle: "Chapter 7",
    description: "How you notice a bad answer, what it costs, and what 'live' means.",
    estimatedHours: 4,
    color: "bg-surface",
    modules: [
      mod("it-can-be-wrong", "It can be wrong", "A fluent answer is not a checked answer.", "Why can a good sentence still be wrong?"),
      mod("checking-answers", "Checking answers", "A small test you can rerun when you change the prompt.", "How do I check an agent's answers?"),
      mod("guardrails", "Guardrails", "Rules that stop a tool before the damage.", "What is a guardrail?"),
      mod("cost", "Cost", "Every extra loop spends tokens, which is money and time.", "What does an agent cost?"),
      mod("what-live-means", "What live means", "A real person can hit it. That is the whole change.", "What does it mean to ship an agent?"),
      mod("a-checklist-before-you-share", "A checklist before you share", "Five lines you read before anyone else uses it.", "What do I check before I share it?", true),
    ],
    projects: ["A before-you-share checklist"],
  },
  {
    id: 8,
    slug: "agents-in-the-wild",
    title: "Agents in the wild",
    subtitle: "Chapter 8",
    description: "Coding, browser, and voice agents, and the products people already use.",
    estimatedHours: 4,
    color: "bg-surface",
    modules: [
      mod("coding-agents", "Coding agents", "A helper that reads a repo and proposes a change.", "What is a coding agent?"),
      mod("browser-agents", "Browser agents", "A helper that clicks through a website.", "What is a browser agent?"),
      mod("voice-agents", "Voice agents", "Talk in, talk out. The loop is still the same loop.", "What is a voice agent?"),
      mod("products-people-use", "Products people use", "Cursor, ChatGPT, Claude, Gemini. Use one before you rebuild it.", "Which agent products should I try?"),
      mod("what-you-still-own", "What you still own", "The product can help. You still decide what 'done' means.", "What do I still have to decide?"),
      mod("a-week-with-one-product", "A week with one product", "Use one agent product on a real task and write what it did.", "How do I try one product for a week?", true),
    ],
    projects: ["A week with one product"],
  },
  {
    id: 9,
    slug: "make-one-thing",
    title: "Make one thing",
    subtitle: "Chapter 9",
    description: "One helper that uses the earlier chapters, not nine unfinished apps.",
    estimatedHours: 6,
    color: "bg-surface",
    modules: [
      mod("the-story-of-the-project", "The story of the project", "A helper that answers from your notes and asks before it sends anything.", "What are we building?"),
      mod("what-it-needs", "What it needs", "A model, a few tools, your notes, and a person in the loop.", "What does this helper need?"),
      mod("the-loop-you-will-use", "The loop you will use", "Think, search your notes, draft, ask, then stop.", "Which loop does this project use?"),
      mod("the-files-it-can-read", "The files it can read", "One folder of notes. Not the whole internet.", "Which files can it read?"),
      mod("the-one-function", "The one function", "The call that starts a run. The rest lives in the toolkit docs.", "Which function starts this helper?"),
      mod("how-you-will-know-it-works", "How you will know it works", "Three questions you ask every time you change it.", "How do I know the helper works?"),
      mod("build-the-helper", "Build the helper", "Put the pieces in order and ship a small version to yourself.", "How do I build the helper?", true),
    ],
    projects: ["Notes helper"],
  },
  {
    id: 10,
    slug: "if-you-need-to-code",
    title: "If you need to code",
    subtitle: "Side shelf",
    optional: true,
    description: "Python, Git, and HTTP, as pointers. The path does not wait on this.",
    estimatedHours: 2,
    color: "bg-surface",
    modules: [
      mod("python", "Python", "Enough Python to read an example, with a place to learn the rest.", "Where do I learn Python?"),
      mod("git", "Git", "Save versions of your work so a mistake is not the end.", "Where do I learn Git?"),
      mod("http", "HTTP", "The web is requests and responses. Agents use that too.", "What is HTTP?"),
    ],
  },
  {
    id: 11,
    slug: "how-models-are-built",
    title: "How models are built",
    subtitle: "Side shelf",
    optional: true,
    description: "Only if you are curious how the model was trained. You can build agents without this.",
    estimatedHours: 2,
    color: "bg-surface",
    modules: [
      mod("training-vs-using", "Training vs using", "Someone else trained it. You are using it.", "Do I need to train a model?"),
      mod("transformers", "Transformers", "The shape inside most chat models, in one picture.", "What is a transformer?"),
      mod("fine-tuning", "Fine-tuning", "A small extra lesson for a model that already knows language.", "What is fine-tuning?"),
    ],
  },
];

export function getPhaseBySlug(slug: string): Phase | undefined {
  return phases.find((p) => p.slug === slug);
}

export function getModule(phaseSlug: string, moduleSlug: string) {
  const phase = getPhaseBySlug(phaseSlug);
  return phase?.modules.find((m) => m.slug === moduleSlug);
}

export function getPhaseIndex(slug: string): number {
  return phases.findIndex((p) => p.slug === slug);
}

export function getAdjacentPhase(slug: string, direction: "prev" | "next"): Phase | undefined {
  const index = getPhaseIndex(slug);
  if (index === -1) return undefined;
  const nextIndex = direction === "prev" ? index - 1 : index + 1;
  return phases[nextIndex];
}

export function isOptionalModuleKey(key: string): boolean {
  if (key.startsWith("challenge/")) return true;
  if (key.startsWith("notes/")) return true;
  const phaseSlug = key.split("/")[0];
  const phase = getPhaseBySlug(phaseSlug);
  return phase?.optional === true;
}

export function countProgressModules(): number {
  return phases.filter((p) => !p.optional).reduce((acc, p) => acc + p.modules.length, 0);
}

export function countProgressPhases(): number {
  return phases.filter((p) => !p.optional).length;
}

export const totalModules = countProgressModules();
export const totalPhases = countProgressPhases();
export const totalHours = phases.reduce((acc, p) => acc + p.estimatedHours, 0);

export function isRoadmapLessonPhase(phase: Phase): boolean {
  return !phase.optional;
}

export function getPhaseLessonHours(phase: Phase): number {
  return isRoadmapLessonPhase(phase) ? phase.estimatedHours : 0;
}

export const totalLessonHours = phases.reduce((acc, phase) => acc + getPhaseLessonHours(phase), 0);

export const mainPhases = phases.filter((phase) => !phase.optional);
export const sidePhases = phases.filter((phase) => phase.optional);

export function getChapterBuilds() {
  return phases.flatMap((phase) =>
    phase.modules
      .filter((mod) => mod.build)
      .map((mod) => ({
        phase,
        module: mod,
        href: `/roadmap/${phase.slug}/${mod.slug}`,
      }))
  );
}

export const roadmapFlow = mainPhases.map((phase) => phase.title);

/** Old 2026 slugs → the closest 2027 chapter, or a site page. */
export const legacyPhaseRedirects: Record<string, string> = {
  "programming-foundations": "/roadmap/if-you-need-to-code",
  "genai-foundations": "/roadmap/generative-ai",
  "transformer-foundations": "/roadmap/how-models-are-built",
  "ai-engineering-foundations": "/roadmap/how-models-are-built",
  "llm-engineering": "/roadmap/generative-ai",
  "rag-engineering": "/roadmap/your-own-knowledge",
  "agent-foundations": "/roadmap/how-an-agent-thinks",
  "agentic-ai": "/roadmap/how-an-agent-thinks",
  "agent-memory": "/roadmap/tools-and-memory",
  "context-engineering": "/roadmap/tools-and-memory",
  "tool-calling": "/roadmap/tools-and-memory",
  mcp: "/roadmap/tools-and-memory",
  "agent-frameworks": "/roadmap/build-with-tools",
  langgraph: "/roadmap/build-with-tools",
  "openai-agents": "/roadmap/build-with-tools",
  "claude-agent-sdk": "/roadmap/build-with-tools",
  crewai: "/roadmap/build-with-tools",
  "pydantic-ai": "/roadmap/build-with-tools",
  autogen: "/roadmap/build-with-tools",
  "google-adk": "/roadmap/build-with-tools",
  "agent-design-patterns": "/roadmap/how-an-agent-thinks",
  "multi-agent-systems": "/roadmap/agents-together",
  "agent-evaluation": "/roadmap/trust-and-shipping",
  "security-guardrails": "/roadmap/trust-and-shipping",
  "production-agents": "/roadmap/trust-and-shipping",
  "production-ai": "/roadmap/trust-and-shipping",
  "ag-ui": "/roadmap/agents-in-the-wild",
  "browser-agents": "/roadmap/agents-in-the-wild",
  "multimodal-agents": "/roadmap/agents-in-the-wild",
  "enterprise-ai": "/roadmap/trust-and-shipping",
  "coding-agents": "/roadmap/agents-in-the-wild",
  "advanced-ai": "/roadmap/how-models-are-built",
  "capstone-projects": "/roadmap/make-one-thing",
  "interview-projects": "/roadmap/make-one-thing",
  "interview-system-design": "/interview",
};
