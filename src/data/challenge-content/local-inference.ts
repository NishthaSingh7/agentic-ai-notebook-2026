import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "local-inference",
  instructor:
    "I am a senior engineer sitting next to you. We will start from zero. You do not need to know what a runtime is yet. I will build the idea from 'the model runs on someone else's computer', then we will get to laptops, a single box, and a cluster — and why a demo that phones home is not local.",
  promise:
    "By the end you will know what inference means, why you would run a model yourself, what quantization is in plain language, which runtime fits a laptop versus a busy box, and how an agent should fail when the local server is sick.",
  story: {
    title: "The air-gapped demo that phoned home",
    body: [
      "A hospital team wanted a discharge-summary helper that would never send patient text to a public API. Legal said the laptop demo could stay in the building. An engineer installed a friendly app, pulled a model file, and showed a working chat on stage. The room applauded. Someone used the word air-gapped — meaning the machine was not supposed to talk to the outside internet.",
      "A week later a network log showed outbound calls during the demo. The chat app had a 'download extras' path and a crash-report toggle still on. The model file was local. The product around the file was not. Privacy was a slide. The data path was a phone line.",
      "The second surprise was quality. To fit the laptop they had picked a heavily compressed copy of the model. Short demos looked fluent. Real summaries dropped medication names. Nobody had written down which file they used, or what 'compressed' meant for this job. The next laptop downloaded a different file with a similar name. The eval moved and nobody knew why.",
      "They rebuilt it as a serving contract. One named file, one runtime, one pin. The laptop stayed a lab. A box in the building ran the same pin for the app. The client looked like a normal chat API, but it pointed at their address. Crash reports stayed off. A missing pin or a truncated answer failed closed. The demo GIF looked less magical. The data path finally matched the slide.",
    ],
    moral:
      "Local inference is a data path and a pin, not a brand name on a laptop. If any leftover setting can phone home, you are not local. If you cannot name the file, you are not pinned.",
  },
  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "The problem: the model runs somewhere, and somewhere might be the wrong place",
      body: [
        "Inference means running an already-trained model to get an answer. Training is how the model learned. Inference is using it. When you call a hosted frontier API, inference happens on the vendor's computers. Your text leaves the building.",
        "Sometimes that is fine. Sometimes it is not: patient notes, source code that cannot travel, a factory with no reliable internet, a bill you want to see as electricity instead of tokens, a latency target a round trip cannot meet.",
        "Local inference means you run the model on hardware you control: a laptop, a tower under a desk, a rack in your room. You still did not train the model. You are serving someone else's trained file, on your box, under your network rules.",
        "Think of a coffee machine. A cafe across town can make the drink and you can pay per cup. Or you can put a machine in your kitchen. The recipe file is the model. The machine is the runtime — the program that knows how to run the file. The kitchen is your network.",
        "At this point you should understand the problem: we need answers without sending the text out, or without paying per-cup forever, and that means we must serve the file ourselves.",
      ],
      diagrams: [
        {
          title: "Three placements, one job",
          caption:
            "Laptop lab, one box, or a cluster. The job is the same: tokens in, tokens out, on hardware you can name.",
          chart: chart(
            `flowchart LR
    App([Your app]) --> Where{Where inference runs}
    Where -->|vendor| Cloud[Hosted API]
    Where -->|desk| Lap[Laptop runtime]
    Where -->|building| Box[One server]
    Where -->|many users| Cluster[vLLM cluster]
    Cloud --> Out([Text leaves])
    Lap --> Stay([Text stays])
    Box --> Stay
    Cluster --> Stay`,
            `class App,Out,Stay hub
    class Where grp2
    class Cloud,Lap,Box,Cluster grp1`
          ),
        },
      ],
    },
    {
      id: "what-a-runtime-is",
      level: "beginner",
      title: "What a runtime is, and the names you will hear",
      body: [
        "A runtime is the engine that loads the model file and produces tokens. The file alone does not serve HTTP. The engine does.",
        "llama.cpp is a widely used engine, especially on laptops and small boxes. Many friendly apps are a skin over it. Ollama is a convenient local server and model manager. LM Studio is a desktop app with a similar 'run a file, get a chat' job. vLLM is a high-throughput server for when several people are waiting on GPUs. They look similar because they all complete text. The important difference is where they fit and what they optimise.",
        "A pin here is the exact file plus the engine settings that change answers: which compression, which context length, which sampling. 'Latest llama in Ollama' is not a pin. It is how the second laptop in the story drifted.",
        "When not to go local: you have no hardware, no privacy constraint, and a hosted pin already passes the job. A local stack is a second on-call. Earn it.",
        "At this point you should be able to say: runtime equals engine, file equals weights, pin equals both plus settings.",
      ],
      diagrams: [
        {
          title: "File, engine, door",
          caption:
            "Weights sit on disk. The runtime loads them. Your app knocks on a local HTTP door.",
          chart: chart(
            `flowchart LR
    File[(Model file)] --> Eng[Runtime engine]
    Eng --> Door[Local HTTP]
    App([Your app]) --> Door`,
            `class File,App hub
    class Eng,Door grp1`
          ),
        },
      ],
    },
    {
      id: "quantization",
      level: "beginner",
      title: "The simplest hard choice: making the file fit",
      body: [
        "A full-quality model file can be larger than your machine's memory. Quantization means storing the model's numbers with less precision so the file shrinks and fits. Think of compressing a photo. The picture still looks like the picture until you zoom in on the medication name.",
        "You pick the smallest compression that still passes your job eval. Fit first — if it does not load, nothing else matters. Then quality. Then a written exception if you must ship a worse file for a demo.",
        "What are we trying to do? Refuse a file that does not fit, and refuse a compression you have not scored.",
        "Here is the smallest version.",
        "Let's understand what just happened. We compared file size to memory, then required an eval flag. 'It looked fluent on stage' is not an eval flag. That is the hospital demo.",
        "Pause and check. If two files share a marketing name and differ by compression, they are different pins. Name the file hash if you can.",
      ],
      codes: [
        {
          title: "quant_choice.py — fit, then quality, then a written exception",
          language: "python",
          code: `def choose(file_gb: float, ram_gb: float, eval_pass: bool, demo: bool) -> str:
    if file_gb > ram_gb:
        return "will_not_load"
    if eval_pass:
        return "pin_it"
    if demo:
        return "lab_only_write_the_exception"
    return "do_not_serve"


print(choose(8, 16, True, False))
print(choose(8, 16, False, True))
print(choose(32, 16, False, False))`,
        },
      ],
    },
    {
      id: "laptop-path",
      level: "intermediate",
      title: "How we implement the laptop path",
      body: [
        "LM Studio and Ollama are good labs. You download a file, you chat, you point an OpenAI-shaped client at localhost. Localhost means this machine. That is enough to prove a prompt and to keep text off a public API during development.",
        "They are not enough to be the production data path unless you can name the pin, turn off every outbound extra, and accept one user at a time. A laptop lid is a power button. A demo on battery is not an SLA.",
        "What are we trying to do? Boot only if the file we expected is the file we got.",
        "Here is the smallest version.",
        "Let's understand what just happened. We compared a hash. Wrong file, no boot. Friendly names can wait. The engine under many friendly names is still one pin you must own.",
        "Connect this back to the story. The crash-report toggle is part of the runtime review, next to the hash.",
      ],
      codes: [
        {
          title: "serve_pin.py — refuse to boot on the wrong file",
          language: "python",
          code: `def boot(expected: str, actual: str) -> str:
    if expected != actual:
        return "refuse_wrong_file"
    return "serve"


print(boot("phi4-q4-aaa", "phi4-q4-aaa"))
print(boot("phi4-q4-aaa", "phi4-q8-bbb"))`,
        },
      ],
      diagrams: [
        {
          title: "Friendly names, one engine, one pin",
          caption:
            "Desktop apps are a skin. The pin is the file and the settings. Notes from a laptop wait for a box you can name.",
          chart: chart(
            `flowchart TD
    AppUi[Ollama or LM Studio] --> Eng[Engine such as llama.cpp]
    File[(Named file plus hash)] --> Eng
    Eng --> Lab([Laptop lab])
    Lab --> Notes[Write the pin down]
    Notes --> Box[Same pin on a box]`,
            `class File,Lab,Box hub
    class AppUi,Eng,Notes grp1`
          ),
        },
      ],
    },
    {
      id: "box-and-vllm",
      level: "intermediate",
      title: "When the laptop is not enough: one box, then a busy box",
      body: [
        "A box is a machine that stays on: one daemon, one queue, one pin. A daemon is a program that keeps running in the background. Several app servers can call it. You still may have only one GPU. That is fine for a team.",
        "When several people are waiting, a naive server runs one request after another. vLLM exists because it can batch work across waiting requests on a GPU. Batching is a product decision: a bit more latency for one person, a lot more answers per minute for the group. Copying laptop flags onto vLLM is how you get neither.",
        "What are we trying to do? Keep one client shape so the app does not care which engine is behind the address.",
        "Here is the smallest version.",
        "Let's understand what just happened. The client always talks OpenAI-shaped HTTP. The host and the pin live in config. Laptop, box, and cluster become addresses. Runtime differences stay out of the agent loop.",
      ],
      codes: [
        {
          title: "client.py — one client shape, runtime stays in config",
          language: "python",
          code: `from openai import OpenAI


def client(base_url: str, api_key: str) -> OpenAI:
    return OpenAI(base_url=base_url, api_key=api_key)


lab = client("http://127.0.0.1:11434/v1", "ollama")
box = client("http://gpu-box:8000/v1", "local")
print(lab.base_url)
print(box.base_url)`,
        },
      ],
      diagrams: [
        {
          title: "Batching is a product decision",
          caption:
            "One-at-a-time is simple. A busy GPU wants a server that can share the chip across waiters.",
          chart: chart(
            `flowchart LR
    U1([User A]) --> Q[Queue]
    U2([User B]) --> Q
    Q --> Naive{One at a time}
    Q --> Batch{Batched server}
    Naive --> Slow([Long wait under load])
    Batch --> Shared([Higher answers per minute])`,
            `class U1,U2,Slow,Shared hub
    class Q grp1
    class Naive,Batch grp2`
          ),
        },
      ],
    },
    {
      id: "privacy-path",
      level: "intermediate",
      title: "How the pieces connect: privacy is a data path",
      body: [
        "Privacy is not the logo on the runtime. It is every hop the bytes take. Model file on disk, engine in process, logs, crash reports, plugin stores, a 'helpful' cloud fallback when the GPU is busy. Any one hop undoes the slide.",
        "Air-gapped means no path out. That is a network fact you can test. It is not a checkbox in an installer. If the installer can download extras, you test with the cable pulled and you watch for failures that try the cable.",
        "Logs are a hop people forget. If the runtime writes prompts to a file that a sync agent uploads, the patient text left. Same for a debugger that pastes a failing turn into a public gist. Draw logs on the same whiteboard as the model file.",
        "What are we trying to do? Prove the path with the cable pulled, then name every hop that still exists.",
        "At this point you should see the application: a pin, an address inside the building, a client, and a network story you can draw. Next we make the agent honest when the box is sick.",
      ],
      diagrams: [
        {
          title: "The data path is the privacy feature",
          caption:
            "A leftover outbound hop makes the local file irrelevant. Draw every hop or you are guessing.",
          chart: chart(
            `flowchart TD
    Text([Patient text]) --> Appc[Your app]
    Appc --> Local[Local runtime]
    Local --> Disk[(Pinned file)]
    Appc --> Logs[Logs]
    Appc --> Crash[Crash reporter]
    Crash --> Out([Outside])
    Logs --> Stay{Stays in building} `,
            `class Text,Out hub
    class Appc,Local,Disk,Logs grp1
    class Crash,Stay grp2`
          ),
        },
      ],
    },
    {
      id: "serving-contract",
      level: "advanced",
      title: "The serving contract an agent actually needs",
      body: [
        "Remember the simple localhost chat. An agent also needs: the pin echoed back, enough context that answers are not silently cut off, a timeout, and a typed sick signal. Truncation means the model ran out of room and the sentence stopped. If you treat a truncated tool call as real, you will parse half a form.",
        "What are we trying to do? Fail closed on truncation, a wrong pin, or a sick runtime.",
        "Here is the smallest version.",
        "Let's understand what just happened. Any bad flag refuses the turn. The agent can escalate or tell a human. It must not invent the rest of a cut-off JSON tool call.",
        "OOM means out of memory: the file or the context did not fit. That is a pin and a length problem, not a retry storm. Retrying an OOM is how you knock the box over twice.",
      ],
      codes: [
        {
          title: "contract.py — fail closed on truncation, pin, and a sick runtime",
          language: "python",
          code: `def accept(pin_ok: bool, truncated: bool, healthy: bool) -> str:
    if not healthy:
        return "runtime_sick"
    if not pin_ok:
        return "wrong_pin"
    if truncated:
        return "truncated"
    return "ok"


print(accept(True, False, True))
print(accept(True, True, True))
print(accept(False, False, True))`,
        },
      ],
    },
    {
      id: "choose-and-move",
      level: "advanced",
      title: "Production: choosing a runtime, and moving without folklore",
      body: [
        "Laptop plus Ollama or LM Studio for a lab. llama.cpp or the same pin on a quiet box for a small team. vLLM when many waiters share GPUs. A hosted API when privacy allows and you do not want the on-call. Write the reason down next to the pin.",
        "Moving is a client URL change plus an eval, not a rewrite of the agent. If your loop imported an Ollama-only SDK everywhere, you married a lab tool. Keep the OpenAI-shaped client.",
        "When you should not cluster: one team, one GPU, one job class. vLLM is extra moving parts. When you should not laptop-prod: anyone else's notes, an SLA, or a lid.",
        "The professional posture: name the file, draw the hops, fail closed, and let the laptop stay a lab.",
      ],
    },
  ],
  workedExample: {
    title: "Discharge-summary agent: laptop demo to a rack, same client",
    setup:
      "Legal requires patient text to stay in the building. A laptop Ollama demo exists. Medication names must not drop. The app already speaks OpenAI-shaped HTTP.",
    walkthrough: [
      "Step 1 — Understand the problem. The demo is not a data path. Outbound extras and an unnamed file are the incident.",
      "Step 2 — Identify the relevant concept. Pin the file, pick a compression that passes eval, serve inside the building.",
      "Step 3 — Build the simplest solution. Hash the file. Turn outbound off. Point the existing client at localhost for the lab only.",
      "Step 4 — Improve it. Put the same pin on a box. Config changes the URL. Eval medication recall, not fluency.",
      "Step 5 — Handle a failure. Truncation and wrong pin fail closed. OOM does not retry. A busy hour is a queue, not a cloud fallback.",
      "Step 6 — Explain the production version. If the team grows, consider vLLM on the same pin. Crash reports stay off. The laptop remains a lab.",
    ],
    result:
      "The slide and the network log finally agree. The agent uses one client. The pin is a file you can name in a review.",
  },
  practice: {
    title: "Replace a laptop demo with a pin you would put in a review",
    task:
      "A PM wants the stage laptop to be production because 'it is already local'. List the pin, the hops you will draw, the runtime choice for ten concurrent clinicians, and the fail-closed rules. Think about quantization, truncation, and cloud fallbacks. No need to install a runtime.",
    hint:
      "Local is a path. Expected reasoning: hash, no outbound, box or vLLM, same client, fail closed, no silent cloud.",
    solution:
      "Pin equals file hash plus compression plus context length. Draw app, runtime, disk, logs, and prove no outbound. Ten concurrent users want a box with a batched server, not a laptop lid. Client stays OpenAI-shaped. Refuse wrong pin, truncation, and sick health. No cloud fallback on GPU busy. Why this works: the contract matches legal. Common wrong approach: leave crash reports on and download 'the same model' by friendly name on the next machine.",
  },
  takeaways: [
    "Inference is running a trained model. Local means that run happens on hardware you control.",
    "A runtime is the engine. A pin is the exact file plus the settings that change answers.",
    "Quantization makes a file fit. It can also drop the medication name. Score the job.",
    "Ollama and LM Studio are labs. A box with one pin is a product. vLLM is for waiters sharing GPUs.",
    "Privacy is every hop, including logs and crash reports.",
    "Agents must fail closed on truncation, a wrong pin, and a sick runtime — never silently finish a cut-off tool call.",
  ],
  mistakes: [
    "Calling a laptop demo air-gapped. Why people make it: the file is on disk. What actually happens: extras phone home. Better approach: draw hops and pull the cable.",
    "Pinning a friendly name like 'latest phi'. Why people make it: it is easy to type. What actually happens: the next download is a different file. Better approach: hash plus settings.",
    "Picking the smallest quantized file to win a demo. Why people make it: it loads. What actually happens: names and numbers drop. Better approach: fit, then eval.",
    "Retrying an out-of-memory error. Why people make it: retries fix HTTP. What actually happens: you knock the box over again. Better approach: shrink context or change the pin.",
    "Falling back to a public API when the GPU is busy. Why people make it: users are waiting. What actually happens: the sensitive text leaves. Better approach: queue or degrade inside the building.",
    "Parsing a truncated tool call. Why people make it: some JSON is present. What actually happens: half a form becomes an action. Better approach: fail closed on truncation.",
  ],
  interviews: [
    {
      question: "What is local inference, and why would a team bother?",
      difficulty: "easy",
      answer:
        "What they are testing: data path, not a brand. Good answer: running a trained model on hardware we control, so text can stay in the building, latency stays short, or the bill becomes electricity. Why that is good: it names reasons. Follow-up: why is a local file not enough to claim privacy?",
    },
    {
      question: "How do you choose among Ollama, llama.cpp, and vLLM?",
      difficulty: "medium",
      answer:
        "What they are testing: placement. Good answer: Ollama or LM Studio for a lab; llama.cpp or the same pin on a quiet box; vLLM when many requests must share GPUs. The app keeps one client shape. Why that is good: job first, logo second. Follow-up: what belongs in the pin besides the engine name?",
    },
    {
      question:
        "Legal says notes cannot leave the building. Your GPU box is overloaded. What do you do, and what do you refuse?",
      difficulty: "hard",
      answer:
        "What they are testing: no silent cloud. Good answer: queue, shed load, or degrade to a smaller local pin that still passes eval. I refuse a public fallback. I refuse a laptop lid as capacity. I fail closed on truncation. Why that is good: it keeps the path honest under pressure. Follow-up: how would you prove the path in a review?",
    },
  ],
  glossary: [
    {
      term: "Inference",
      meaning:
        "Running a trained model to produce an answer. Why it matters: this is the step whose location decides privacy and cost.",
    },
    {
      term: "Runtime",
      meaning:
        "The engine that loads a model file and serves tokens. Why it matters: the file alone does not answer HTTP.",
    },
    {
      term: "Quantization",
      meaning:
        "Storing model numbers with less precision so the file fits in memory. Why it matters: fit can cost quality on the fields you care about.",
    },
    {
      term: "Pin",
      meaning:
        "The exact file, hash, and settings you evaluated. Why it matters: friendly names drift.",
    },
    {
      term: "vLLM",
      meaning:
        "A server built to batch many waiting requests on GPUs. Why it matters: a busy box is a different job than a laptop chat.",
    },
    {
      term: "Truncation",
      meaning:
        "The model ran out of room and the output stopped early. Why it matters: a cut-off tool call is not a tool call.",
    },
  ],
};
