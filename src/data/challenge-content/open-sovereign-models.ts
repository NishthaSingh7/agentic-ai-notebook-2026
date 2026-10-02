import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "open-sovereign-models",
  instructor:
    "I teach this from zero. If you have never run a model on your own machine, that is fine. We will start with the difference between calling a company's API and running weights you can keep, then how to pick, serve, and evaluate a model you actually control.",
  promise:
    "You will leave knowing what open weights are, what 'sovereign' is trying to say, how a local model is served, how to pick among families such as Llama, Mistral, Qwen, and DeepSeek, and what you still must evaluate yourself.",

  story: {
    title: "The weekend the API terms changed",
    body: [
      "A health-tech team built a note helper on a hosted frontier API. It was fast to ship. Prompts, examples, and fragments of de-identified notes lived in the vendor's logs because the default settings said so. On a Friday the vendor emailed a terms change: a new region, a new retention clause, a new price for the model they had standardized on. Legal wanted a week. The product needed Monday.",
      "They could not 'just switch' to another API by Friday. The prompts were tuned to one model's quirks. Worse, a hospital customer had already asked a question they could not answer well: can we run this with no notes leaving our network? The honest answer was no. The architecture had never included that door.",
      "Over the next quarter they did not abandon hosted models. They added a second path. They picked an open-weight model they could download, ran it on machines they controlled, and put a small evaluation set in front of both paths: medical entities, refusal on diagnosis, latency, and whether a note fragment ever left the VPC — the private network. The open model was weaker on long writing and cheaper on privacy. The API stayed for a drafting tool that used synthetic examples only.",
      "The Monday crisis became a procurement conversation instead of an outage. The lesson they wrote down: if you cannot run a backup you own, you do not have a vendor. You have a single point of policy.",
    ],
    moral:
      "Open weights are not automatically better answers. They are a control you can keep: where the bytes live, who sees the prompt, and whether Monday still works when a terms email arrives.",
  },

  stages: [
    {
      id: "api-versus-weights",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Let us start from zero. Most people meet AI through an API. An API is a web address your program calls. You send text, a company runs a model on their computers, they send text back. You pay per use. You do not receive the model itself.",
        "That is like renting a kitchen. You can cook tonight. You cannot take the stove home. If the landlord changes the hours or the rules, your restaurant changes. For many products that is a good trade. Someone else runs the hardware. You ship.",
        "Sometimes the trade is not good. The data cannot leave the building. The law says a copy must live in a certain country. The bill is unpredictable. The vendor can retire the exact model you tested. Then you want a copy you can run.",
        "What happens if you never plan for that copy? The story. A terms email becomes a product freeze, and a customer question about 'our network only' has no honest yes.",
        "At this point you should understand the problem: control of where the model runs, not a holier brand of intelligence.",
      ],
      diagrams: [
        {
          title: "Where does the prompt go?",
          caption:
            "An API sends your text to someone else's computers. Weights you run send it to machines you named.",
          chart: chart(
            `flowchart TD
    App([Your app]) --> Api[Vendor API]
    Api --> Theirs[(Their GPUs and logs)]
    App --> Local[Your server]
    Local --> Yours[(Your GPUs)]
    Theirs --> Out1([Tokens back])
    Yours --> Out2([Tokens back])`,
            `class App,Out1,Out2 hub
    class Api,Theirs grp3
    class Local,Yours grp1`
          ),
        },
      ],
    },
    {
      id: "what-open-weights-mean",
      level: "beginner",
      title: "What open weights and sovereign models mean",
      body: [
        "Weights are the billions of numbers that make a model itself. Open weights means the seller lets you download those numbers and run them. Open is a spectrum: some licenses let you use them commercially, some do not, some add rules about acceptable use. Read the license. 'Open' on a blog post is not a lawyer.",
        "This is different from open source as software engineers usually mean it. They look similar because both say open. The important difference is what you received. Open source usually includes the recipe to rebuild. Open weights often means you got the baked cake, not the full kitchen that baked it. You can still run the cake.",
        "Sovereign, in this sitting, means you can keep the work inside a boundary you chose: a country, a company network, a hospital. Sovereignty is a deployment and legal property. It is not a model family. You can serve Llama in a locked room and still leak prompts through a log you sent to a vendor. You can also use a hosted API in a region contract that meets the rule. Ask where the bytes go.",
        "Families you will hear: Llama, Mistral, Qwen, DeepSeek. They are different recipes, sizes, and licenses. None of them is 'the open model'. They are options you can download if the license fits, then evaluate.",
        "At this point you should be able to say: open weights are a file you can run; sovereign is a promise about where that file lives and who sees the prompt.",
      ],
      diagrams: [
        {
          title: "Rent the kitchen, or keep a stove",
          caption:
            "Control is the point of this sitting. Quality is a later measurement on your tasks.",
          chart: chart(
            `flowchart LR
    Need([Need a model]) --> Rent[Call an API]
    Need --> Keep[Download weights]
    Rent --> Vendor[Vendor policy and price]
    Keep --> You[Your machines and license]`,
            `class Need hub
    class Rent,Vendor grp3
    class Keep,You grp1`
          ),
        },
      ],
    },
    {
      id: "smallest-local-run",
      level: "beginner",
      title: "The simplest version: run a small model locally",
      body: [
        "What are we trying to do? Load a small open-weight model on a machine you control, send a string, get a string back. No product yet. You should feel that the prompt never left the process.",
        "Here is the smallest version in spirit. A library loads the weight file. You call generate. You print the text. Hardware is the catch: a tiny model may run on a laptop; a large one needs GPUs you will have to buy or rent in a place you still control.",
        "Let's understand what just happened. You are now the host. If the process dies, the model dies. If the disk is the wrong file, you served the wrong brain. Pin the file with a hash — a fingerprint — so you do not silently swap weights after a download.",
        "This is not yet production. Production is a server that several apps can call, with limits, logs that do not leak notes, and a GPU that stays warm. We will get there. First you needed to see: string in, string out, your process.",
        "At this point you should understand the simplest run: a file, a process, a prompt that did not go to a public API.",
      ],
      codes: [
        {
          title: "local_generate.py — string in, string out, your process",
          language: "python",
          code: `def generate(prompt: str, model) -> str:
    """Stand-in: your library loads weights from disk you control."""
    return model.complete(prompt, max_tokens=128)


def pin(path: str, expected_hash: str, sha256) -> None:
    digest = sha256(path)
    if digest != expected_hash:
        raise ValueError("weights file does not match the pin")`,
        },
      ],
    },
    {
      id: "serving-is-the-job",
      level: "intermediate",
      title: "How we implement it: serving is the job",
      body: [
        "An app should not load a 30-billion-parameter file on every HTTP request. Serving means: one long-lived process holds the weights in GPU memory and answers many short requests. Your product talks to a URL you own, the same way it used to talk to a vendor URL.",
        "What are we trying to do? Put an OpenAI-shaped gateway in front of local weights so the app can switch paths with a base URL and a model name. The gateway is where you put auth, rate limits, and 'this request must not log the body'.",
        "Here is the smallest production picture. App → your gateway → GPU box running vLLM or an equivalent server. vLLM is software people use to serve large models efficiently. You do not need its flags yet. You need: the weights stay in your process; the app stays boring.",
        "Let's understand batching. The server may wait a few milliseconds to run several prompts on the GPU together. That is good for cost. It is a latency trade. Set limits so a noisy neighbor cannot stall a hospital note.",
        "Connect this back to the story. The hospital path is this URL, on this network, with logs that store metadata not note text. The drafting path can still be a vendor API on synthetic data.",
      ],
      codes: [
        {
          title: "client.py — your app talks to a URL you own",
          language: "python",
          code: `import os
import urllib.request
import json


def complete(prompt: str) -> str:
    url = os.environ["MODEL_URL"]  # http://llm.internal/v1/completions
    body = json.dumps({"model": os.environ["MODEL_NAME"], "prompt": prompt}).encode()
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())["text"]`,
        },
      ],
      diagrams: [
        {
          title: "App, gateway, weights",
          caption:
            "The product should not care which GPU box holds the file. It cares that the URL is yours.",
          chart: chart(
            `flowchart LR
    App([Product]) --> Gw[Gateway you own]
    Gw --> Gpu[GPU server]
    Gpu --> File[Pinned weight file]
    Gw --> Logs[Metadata logs]`,
            `class App hub
    class Gw,Gpu,File grp1
    class Logs grp2`
          ),
        },
      ],
    },
    {
      id: "how-to-pick",
      level: "intermediate",
      title: "When the first download is not enough: how to pick",
      body: [
        "Pick on four axes: license, size, quality on your tasks, and how you will serve it. A 70B model that you cannot run is a poster. An 8B model that refuses your medical-entity eval is a fast wrong answer.",
        "Llama, Mistral, Qwen, and DeepSeek differ by language coverage, license terms, reasoning-flavored variants, and tool-calling maturity. Read current cards. Do not memorize a ranking from a social post. Rankings are someone else's tasks.",
        "Quantization means storing weights with fewer bits so they fit on smaller GPUs. It is a quality-versus-hardware trade. Measure it. A quantized model that drops your refusal test is not 'the same model, cheaper'.",
        "Here is the key idea. The family name is a starting shortlist. The pick is a row on your scoreboard plus a license your counsel will sign plus hardware you can operate. That is procurement, not fandom.",
        "You might avoid self-hosting when your data is allowed to leave, the vendor contract is enough, and you have no one to run GPUs. Sovereignty you cannot operate is a weekend outage with extra steps.",
      ],
    },
    {
      id: "eval-you-own",
      level: "intermediate",
      title: "How the pieces connect: evaluate a model you keep",
      body: [
        "Put one harness in front of two URLs: the vendor API and your local server. Same questions. Score the tasks you care about: entities, refusals, latency, cost, and a privacy check — did this path send a note outside the network?",
        "What are we trying to do? Make switching a measured decision. The hospital asked a yes/no about bytes. The product team asked whether writing quality is good enough. Both belong on the same sheet.",
        "Let's understand drift. Open-weight names get new versions. Pin the file hash. When you change hashes, rerun the harness. A silent wget of 'latest' is how Monday's helper starts diagnosing again.",
        "Connect this back to RAG and tools. A weaker local model plus your files and tools can beat a stronger API that never sees the record. Evaluate the system, not the model in a vacuum.",
        "At this point you should be able to say which jobs stay on the API and which jobs run on weights you keep, with numbers.",
      ],
      diagrams: [
        {
          title: "One harness, two URLs",
          caption:
            "The scoreboard decides the mix. A terms email cannot delete the row you already measured.",
          chart: chart(
            `flowchart TD
    Cases[Your eval cases] --> A[Vendor URL]
    Cases --> B[Local URL]
    A --> Board[Same metrics]
    B --> Board
    Board --> Mix[Which job uses which path]`,
            `class Cases,Mix hub
    class A grp3
    class B grp1
    class Board grp2`
          ),
        },
      ],
      codes: [
        {
          title: "harness.py — the same questions, two URLs",
          language: "python",
          code: `def run(cases: list[dict], complete) -> dict:
    ok = 0
    for case in cases:
        text = complete(case["prompt"])
        if case["must_refuse"] and case["refuse_mark"] in text.lower():
            ok += 1
        elif not case["must_refuse"] and case["need"] in text.lower():
            ok += 1
    return {"n": len(cases), "ok": ok}`,
        },
      ],
    },
    {
      id: "how-this-fails",
      level: "advanced",
      title: "How open and sovereign setups fail",
      body: [
        "Now that you understand the simple path, look at failures. The first is a license you did not read. A weight file on disk is not permission. Counsel sees the license before the GPU sees the file.",
        "The second is a privacy leak through logs, crash dumps, or a 'temporary' vendor fallback that still sends the real note. Sovereignty is every hop. Draw the hops. If a hop leaves the network, it is not the hospital path.",
        "The third is an unpinned download. The file changed. Quality shifted. You cannot rebuild last week's answers. Hash-pin and store the pin next to the model name.",
        "The fourth is serving like a laptop demo. One process, no queue limits, no GPU memory headroom. The first traffic spike knocks it over. Treat it as a database you would not run on a laptop.",
        "The fifth is assuming open weights are safer because you can 'see inside'. You can see numbers. You cannot read alignment off a tensor. You still test refusals, prompt injection on your tools, and data leakage on your eval. Defensive tests only: canary secrets should not come back, tools should not fire on untrusted text without policy. You do not probe for exploits. You prove your doors stay closed.",
      ],
      codes: [
        {
          title: "pin.py — the file you serve has a hash",
          language: "python",
          code: `import hashlib
from pathlib import Path


def sha256_file(path: str) -> str:
    h = hashlib.sha256()
    h.update(Path(path).read_bytes())
    return h.hexdigest()


def assert_pin(path: str, expected: str) -> None:
    if sha256_file(path) != expected:
        raise SystemExit("refuse to serve unpinned weights")`,
        },
      ],
    },
    {
      id: "production-sovereignty",
      level: "advanced",
      title: "Production: a path you can keep",
      body: [
        "This approach is useful when data residency, contract risk, or cost at volume matters, and you can operate GPUs. You might avoid it when a hosted contract already meets the rule and your eval says the API is enough. Two paths are extra work. They are worth it when Monday must survive a terms email.",
        "Trade-offs: quality, latency, and features such as tool calling are often stronger on frontier APIs today. Control, price predictability, and residency are stronger on weights you keep. Mix by job. Do not mix by slogan.",
        "Production looks like pinned weights, a gateway, network boundaries, metadata-only logs, a harness in CI, and a documented fallback that does not send restricted notes to a vendor. Capacity planning is part of the product. A sovereign path that OOMs is not sovereign. It is down.",
        "The reason we do this is so a hospital can hear an honest yes, and so a Friday email is a procurement issue, not an outage.",
        "The learner who can teach this now says: open weights are a file I can run; sovereign is a boundary I can draw; I pick Llama, Mistral, Qwen, or DeepSeek with a license, a hash, and a scoreboard — not with a thread.",
      ],
      diagrams: [
        {
          title: "The path a terms email cannot delete",
          caption:
            "Restricted notes stay on the local URL. Synthetic drafting may still use a vendor.",
          chart: chart(
            `flowchart TD
    Job([Incoming request]) --> Kind{Restricted notes?}
    Kind -->|yes| Local[Pinned local model]
    Kind -->|no| Vendor[Vendor API allowed]
    Local --> Stay[Bytes stay in VPC]
    Vendor --> Out([Draft on synthetic or public text])`,
            `class Job,Out hub
    class Kind grp2
    class Local,Stay grp1
    class Vendor grp3`
          ),
        },
      ],
    },
  ],

  workedExample: {
    title: "Answer the hospital: can notes stay in our network?",
    setup:
      "A note helper is on a frontier API. A hospital asks for a path with no notes leaving their VPC. Legal will not accept vendor logs of real notes. Writing quality still matters for a separate marketing draft tool.",
    walkthrough: [
      "Step 1 — Understand the problem. Today's architecture has no honest yes. Control is missing, not adjectives.",
      "Step 2 — Identify the relevant concept. Open weights served inside the VPC, plus an eval harness shared with the API path.",
      "Step 3 — Build the simplest solution. Download a licensed 8B-class model, pin the hash, serve it on a GPU box, point a gateway at it.",
      "Step 4 — Improve it. Run the harness: entities, diagnosis refusal, latency, privacy hop check. Keep the API for synthetic drafting only.",
      "Step 5 — Handle a failure. If the local model fails refusal, try another family or a larger size before you weaken the privacy rule. Do not 'temporarily' send real notes to the vendor.",
      "Step 6 — Production version. Metadata logs, rate limits, capacity headroom, CI on the pin, a runbook for GPU loss. The mix is documented so Friday's email cannot scramble it.",
    ],
    result:
      "The hospital hears yes for notes. Marketing still uses a hosted path on synthetic text. Quality is a measured mix, not a single logo.",
  },

  practice: {
    title: "Add a path you can keep",
    task:
      "Your product is 100% on a hosted API. A customer in a regulated industry asks for an in-network option in six months. Design the smallest second path. Say what you pin, what you measure, and what you refuse to send to the vendor on that path.",
    hint:
      "Name weights versus API. Ask where logs go. Ask how you would switch the app with a URL.",
    solution:
      "Expected reasoning: control is a second URL plus a boundary, not a new personality for the model.\n\nSolution: pick a licensed open-weight model, hash-pin it, serve behind an internal gateway, metadata-only logs, harness versus the API on your tasks. Restricted payloads never use the vendor fallback. The app switches on MODEL_URL.\n\nWhy it works: Monday no longer depends on one terms page.\n\nCommon wrong approach: wait for the vendor's 'private region' slide and skip the harness, or download 'latest' weights without a pin.",
  },

  takeaways: [
    "An API rents a model. Open weights are a file you can run. Control is the difference.",
    "Sovereign means you can keep prompts and outputs inside a boundary you chose. It is not a brand of weights.",
    "Open weights are not always open source. Read the license before the GPU reads the file.",
    "Serving is the job: a long-lived server, a URL you own, limits, and logs that do not leak the body.",
    "Pick Llama, Mistral, Qwen, DeepSeek — or others — with license, size, your eval, and hardware you can operate.",
    "Pin the file hash and run one harness against both URLs. A silent latest download is a surprise brain.",
  ],

  mistakes: [
    "Mistake: treat 'open' as permission. Why people make it: the file downloaded. What actually happens: a license block after you built the path. Better approach: counsel reads the license first.",
    "Mistake: send real notes through a vendor fallback 'just this week'. Why people make it: the GPU is down. What actually happens: the hospital path is a lie. Better approach: a fallback that stays in-network, or an honest outage.",
    "Mistake: skip pinning. Why people make it: ops wants latest. What actually happens: quality and refusals drift. Better approach: hash next to the model name, harness on change.",
    "Mistake: evaluate the model without your tools and files. Why people make it: public leaderboards are easy. What actually happens: you pick a writer and ship a worse system. Better approach: evaluate the path.",
    "Mistake: run production on a laptop-shaped process. Why people make it: the demo worked. What actually happens: the first spike OOMs. Better approach: serve it like a database with limits.",
    "Mistake: assume weights are safer because you can inspect numbers. Why people make it: 'open' sounds transparent. What actually happens: you skip refusal and leak tests. Better approach: defensive eval on your doors.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "What is the difference between calling an API and running open weights?",
      answer:
        "What they are testing: control, not slogans.\n\nGood answer: an API sends the prompt to someone else's computers. Open weights are a file you can load on machines you control. Quality is separate. The license is separate from the download.\n\nWhy that is good: it names where the bytes go.\n\nFollow-up: what does sovereign add to that picture?",
    },
    {
      difficulty: "medium",
      question: "A hospital asks if notes can stay in their network. What do you need to say yes?",
      answer:
        "What they are testing: hops, not a model name.\n\nGood answer: a served local model on their VPC, a gateway, logs that do not store note bodies, no vendor fallback for those requests, and an eval that includes a privacy hop check. I would not say yes on a hosted API with retention I cannot control.\n\nWhy that is good: it treats sovereignty as a path.\n\nFollow-up: how do you pin the weights so next week is the same model?",
    },
    {
      difficulty: "hard",
      question: "How do you choose among Llama, Mistral, Qwen, and DeepSeek for a product you must keep?",
      answer:
        "What they are testing: procurement judgment.\n\nGood answer: license first, then whether we can serve that size, then our harness on the real jobs, then operations. I mix with a hosted API for jobs that are allowed to leave. I refuse a ranking post as the decision. I pin hashes and rerun on change.\n\nWhy that is good: it is a scoreboard plus a boundary.\n\nFollow-up: when would you not self-host at all?",
    },
  ],

  glossary: [
    {
      term: "Weights",
      meaning:
        "The numbers that are the model. Why it matters: owning a copy of the weights is what lets you run it yourself.",
    },
    {
      term: "Open weights",
      meaning:
        "A model file you are allowed to download and run, under a specific license. Why it matters: it is control of the file, not automatically a better answer.",
    },
    {
      term: "Sovereign model",
      meaning:
        "A deployment where you can keep the work inside a chosen legal and network boundary. Why it matters: the boundary is the product requirement, not the family name.",
    },
    {
      term: "Serving",
      meaning:
        "Keeping weights loaded in a long-lived server that many requests share. Why it matters: apps should call a URL, not load a giant file per request.",
    },
    {
      term: "Quantization",
      meaning:
        "Storing weights with fewer bits so they fit smaller hardware. Why it matters: it can change quality; you must measure your tasks.",
    },
    {
      term: "Pin",
      meaning:
        "Recording a hash of the exact weight file you serve. Why it matters: without it, 'the model' is a moving file.",
    },
  ],
};
