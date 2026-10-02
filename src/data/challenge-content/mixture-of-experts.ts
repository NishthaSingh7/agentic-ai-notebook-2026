import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "mixture-of-experts",
  instructor:
    "I am a senior engineer sitting next to you. We will start from zero. You do not need to know what a transformer layer is yet. I will build the idea from a receptionist and a row of specialists, then we will get to why a 'cheaper per token' MoE box can still queue under real traffic.",
  promise:
    "By the end you will know what an expert is, what a router does, why sparse activation can be cheaper per token, what still has to sit in memory, and what breaks at serving time when a few experts get almost all the work.",
  story: {
    title: "The Mixtral box that was cheaper per token until it was not",
    body: [
      "A platform team wanted a cheaper hosted model. A card advertised a large mixture-of-experts model: many parameters in total, fewer parameters used on each word, a lower token price. Internally they wanted the same win on their own GPUs. Someone did the arithmetic 'so it is like a smaller dense model' and copied the serving flags from their old 32-billion-parameter box. They expected headroom. They got a queue.",
      "The first incident was slowness, not wrong answers. One request at a time looked fine. Eight support agents at once made the slow ones twice as slow. Support tickets are not a balanced mix of the whole internet. Two of the eight specialist parts of the model were doing almost all the work. Those two sat hot. The others waited. Cheap on paper, contended in practice.",
      "The second incident was quieter. After a restart, a setting changed how many specialists each word was allowed to use, from two down to one. Tokens per second jumped. The night eval was a chat score and looked fine. The morning check on tool fields dropped. Some words were no longer getting the second specialist the card had promised. Nobody had a metric named 'words that got fewer specialists than planned'. They had a metric named 'tokens per second', which was thrilled.",
      "They treated the model as a serving design after that. They counted work per specialist, not only how busy the GPU looked overall. They pinned the 'how many specialists per word' setting. They split traffic: the large sparse model kept long writing jobs; a small dense model took classify. The hosted 'cheap token' remained something they could buy. It was not a flag they could paste.",
    ],
    moral:
      "Mixture of experts can make each token cheaper to compute. It does not automatically make the box easier to run. The router — the part that picks specialists — is the architecture you have to operate.",
  },
  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "The problem: a bigger brain costs more on every word",
      body: [
        "A language model writes one small chunk of text at a time. People call that chunk a token. For every token, the model does a large pile of math. If you make the model bigger so it knows more, you usually make that pile of math bigger too. Every word gets more expensive.",
        "That is painful when you serve many users. You want a model that has lots of knowledge, but you do not want to wake the entire model for every 'the' and 'and'.",
        "Think of a hospital again, slightly differently than in the small-model sitting. This time the 'specialists' live inside one model. A receptionist reads the incoming word and rings two specialists, not all of them. The building still contains every specialist. Only a few stand up for this word.",
        "Without some version of this idea, the path to a smarter model is 'make every layer thicker' and your bill follows. With it, you can grow total knowledge faster than you grow the math per token. That is the problem mixture of experts exists to solve.",
        "At this point you should understand the pain: we want more capacity without paying the full dense price on every token.",
      ],
      diagrams: [
        {
          title: "Wake a few specialists, not the whole building",
          caption:
            "Every token still goes through shared work. Only a few experts run. The others stay seated for this token.",
          chart: chart(
            `flowchart TD
    Tok([One token]) --> Shared[Shared attention]
    Shared --> Rec[Router]
    Rec --> E1[Expert A]
    Rec --> E2[Expert B]
    Rec -.-> E3[Expert C sits]
    Rec -.-> E4[Expert D sits]
    E1 --> Mix[Combine]
    E2 --> Mix
    Mix --> Next([Next layer])`,
            `class Tok,Next hub
    class Shared,Rec,Mix grp1
    class E1,E2 grp2
    class E3,E4 grp3`
          ),
        },
      ],
    },
    {
      id: "expert-and-router",
      level: "beginner",
      title: "What an expert is, and what the router is",
      body: [
        "An expert, in this design, is not a person and not a separate product. It is a specialist block of math inside the model — usually the feed-forward piece of a layer, the part that looks at one token and transforms it. Several of those blocks sit side by side. Each has its own weights.",
        "The router is a tiny extra network that looks at the current token and scores the experts. The top few winners run. The rest do not. That choice happens again on the next token. The receptionist can ring a different pair for the next word.",
        "They look similar to 'we have many models' because there are many blocks. The important difference is that this is one trained system. The router and the experts learned together. You cannot delete expert 5 on a Friday and expect the others to shrug. You also cannot treat eight experts as eight microservices you independently scale like web apps without thinking about how tokens arrive.",
        "Mixture of experts, or MoE, is the name for this pattern: a mix of specialist blocks, plus a router that picks a sparse subset per token. Sparse here means 'most experts are off for this token'.",
        "At this point you should be able to say: expert equals specialist block, router equals the picker, MoE equals both.",
      ],
      diagrams: [
        {
          title: "Three numbers, not one headline",
          caption:
            "Marketing quotes total size. Your token price hopes for active size. Your GPU bills serve size.",
          chart: chart(
            `flowchart LR
    Total[Total parameters trained] --> Card([Launch card])
    Active[Active parameters per token] --> Price([Token math])
    Serve[Weights loaded in RAM] --> Box([The box you buy])`,
            `class Card,Price,Box hub
    class Total grp1
    class Active grp2
    class Serve grp3`
          ),
        },
      ],
    },
    {
      id: "sparse-vs-dense",
      level: "beginner",
      title: "How the simplest version works: sparse versus dense",
      body: [
        "A dense model runs the same full block for every token. Simple to reason about. Every token costs about the same math. Memory and math grow together.",
        "An MoE model still has shared pieces — often the attention part, the piece that lets tokens look at each other — and then a routed expert part. Total parameters can be huge. Active parameters, the ones that run for this token, are smaller. Serve size, what you must keep in memory, is closer to the total, because the seated experts still occupy RAM.",
        "Hold three numbers in your head, not one. Total size is how much was trained. Active size is how much math you do per token. Serve size is how much you must load. Marketing will quote the first. Your GPU will bill the third. Your token price hopes for the second.",
        "What are we trying to do? Count how many experts actually run, given a router score.",
        "Here is the smallest version.",
        "Let's understand what just happened. We scored four experts, we kept the top two, we ignored the rest. That is sparse activation in a toy. No GPU yet. Just the idea: pick K, run K.",
      ],
      codes: [
        {
          title: "pick_experts.py — top two winners run",
          language: "python",
          code: `SCORES = {"A": 0.51, "B": 0.09, "C": 0.30, "D": 0.10}


def pick(scores: dict[str, float], k: int) -> list[str]:
    ranked = sorted(scores, key=scores.get, reverse=True)
    return ranked[:k]


print("active:", pick(SCORES, 2))
print("seated:", [name for name in SCORES if name not in pick(SCORES, 2)])`,
        },
      ],
    },
    {
      id: "serving-shape",
      level: "intermediate",
      title: "How engineers serve this: experts on ranks",
      body: [
        "Serving means running the trained model so other programs can call it. In a dense model you often split layers or split the big matrices across GPUs. In an MoE model you also face a new split: which GPU owns which expert.",
        "Expert parallelism means different GPUs, sometimes called ranks, hold different experts. A token arrives, the router picks expert C, and the numbers for that token have to travel to the GPU that holds C. Then the result travels back and combines. That travel is the extra tax sparse models pay at serve time.",
        "What are we trying to do? Count tokens per expert so we can see a hot specialist.",
        "Here is the smallest version.",
        "Let's understand what just happened. We tallied which expert won. If one name owns most tokens, that rank will saturate while others idle. GPU-busy-percent can still look 'fine' if you only average the box. The hot rank is the queue from the story.",
        "Connect this back to support tickets. They cluster. A router trained on the open internet may still send your dialect to two experts. Sparse on the card, dense on your traffic.",
      ],
      codes: [
        {
          title: "expert_load.py — count tokens per expert",
          language: "python",
          code: `from collections import Counter


def load(picks: list[list[str]]) -> dict[str, int]:
    counts: Counter[str] = Counter()
    for pair in picks:
        counts.update(pair)
    return dict(counts)


print(load([["A", "C"], ["A", "C"], ["A", "B"], ["A", "C"]]))`,
        },
      ],
      diagrams: [
        {
          title: "Dispatch to ranks, then combine",
          caption:
            "The token does not stay put. It visits the GPUs that hold the winners, then comes home.",
          chart: chart(
            `flowchart LR
    Tok([Token]) --> Rtr[Router]
    Rtr --> R1[Rank with expert A]
    Rtr --> R2[Rank with expert C]
    R1 --> Comb[Combine]
    R2 --> Comb
    Comb --> Out([Next token])`,
            `class Tok,Out hub
    class Rtr,Comb grp1
    class R1,R2 grp2`
          ),
        },
      ],
    },
    {
      id: "what-breaks",
      level: "intermediate",
      title: "When the simple picture is not enough",
      body: [
        "Load imbalance means a few experts get most tokens. Capacity overflow means an expert's queue is full and a token is dropped down to fewer experts than the card promised, or delayed. Router collapse means the picker keeps choosing the same two names, so your 'eight-expert' model behaves like a two-expert model plus wasted RAM.",
        "These failures look like 'the GPU is slow' or 'quality dipped after a restart'. They are often config. Top-k — how many experts per token — is a pin, not a tuning knob you flip for throughput. If you cut k to raise tokens per second, you changed the model.",
        "What are we trying to do? Refuse a batch that would overflow a hot expert, instead of silently dropping the second expert.",
        "Here is the smallest version.",
        "Let's understand what just happened. Each expert has a seat limit. If the next batch would overflow, we do not take that batch. Degrade is visible. The story's quiet quality cliff was an invisible degrade.",
      ],
      codes: [
        {
          title: "moe_admit.py — refuse work that will overflow experts",
          language: "python",
          code: `CAP = {"A": 4, "B": 4, "C": 4, "D": 4}


def admit(load: dict[str, int], incoming: list[str]) -> bool:
    trial = dict(load)
    for name in incoming:
        trial[name] = trial.get(name, 0) + 1
        if trial[name] > CAP.get(name, 0):
            return False
    return True


print(admit({"A": 3}, ["A", "C"]))
print(admit({"A": 4}, ["A", "C"]))`,
        },
      ],
    },
    {
      id: "in-an-app",
      level: "intermediate",
      title: "How this shows up in an application you already run",
      body: [
        "If you only call a hosted API, you still meet MoE as a product fact. A 'huge' parameter count with a mid-range price is often sparse under the hood. You cannot see the router. You can still notice uneven latency when your traffic is one dialect, and you can still pin the snapshot so top-k cannot drift.",
        "If you serve the weights yourself, the router is now your on-call problem. Keep the hot agent loop — the tight classify-and-tool path — off a contended MoE box when a dense small model will do. Use the MoE where extra total parameters pay: long generate, messy language, broad knowledge.",
        "What are we trying to do? Route the job around the sparse box when the job is a short, bursty loop.",
        "Here is the smallest version.",
        "Let's understand what just happened. Short classify goes dense. Long write may go MoE. That is the same job-class habit as the frontier and SLM sittings. Architecture inside the model does not replace architecture around the model.",
        "At this point you should see where MoE fits: a serving and costing choice, not a reason to change your agent tools.",
      ],
      codes: [
        {
          title: "moe_route.py — keep the hot loop off a contended MoE",
          language: "python",
          code: `def backend(job: str, moe_hot: bool) -> str:
    if job in {"classify", "extract"}:
        return "dense_slm"
    if moe_hot and job == "lookup":
        return "dense_slm"
    return "moe"


print(backend("classify", True))
print(backend("long_write", False))
print(backend("lookup", True))`,
        },
      ],
      diagrams: [
        {
          title: "Job first, sparse box second",
          caption:
            "A contended router is a reason to move classify, not a reason to buy more of the same traffic.",
          chart: chart(
            `flowchart TD
    Job([Job class]) --> Kind{Short closed job}
    Kind -->|yes| Dense[Dense small model]
    Kind -->|no| Health{MoE experts balanced}
    Health -->|yes| Moe[MoE box]
    Health -->|no| Wait([Queue or dense fallback])`,
            `class Job,Dense,Moe,Wait hub
    class Kind,Health grp2`
          ),
        },
      ],
    },
    {
      id: "dense-or-moe",
      level: "advanced",
      title: "Trade-offs: when to serve MoE, when to stay dense",
      body: [
        "Stay dense when the dialect is narrow and the box is small. A classify model that only sees your tickets does not need eight specialists and a router. The router will collapse, and you will pay RAM for experts you do not use.",
        "Serve MoE when total knowledge matters and you can afford the serving complexity: extra collectives, load metrics, a pinned top-k, and a plan for overflow. Hosted MoE is often the rational buy. Self-hosted MoE is a platform project.",
        "Quality cliffs after a restart are a config diff until proven otherwise. Compare top-k, expert count, capacity, and the exact checkpoint. Then look at expert-load histograms. Then look at the eval.",
        "Do not say MoE is the best architecture. Say it is useful when you want more total parameters than you want active math, and you are willing to operate a router. Avoid it when your traffic is one cluster and your team is two people.",
        "The professional posture: three numbers on the whiteboard — total, active, serve — and a graph of tokens per expert next to GPU util.",
      ],
    },
    {
      id: "eval-and-pins",
      level: "advanced",
      title: "Production: pins and the counters that prove sparsity is healthy",
      body: [
        "Pin the checkpoint and the serve settings that change which experts run. A throughput win that changed k is a model change. Put it through the same job eval you use for a frontier swap: tool fields, not only chat.",
        "What are we trying to do? Score the job and the health of the router on the same page.",
        "Here is the smallest version.",
        "Let's understand what just happened. We kept a job pass rate and a simple imbalance number: the hottest expert's share. If one expert takes half the tokens in an eight-expert model, sparsity is a story you tell finance, not a property you have.",
        "When the hosted API is the product, you cannot plot experts. You can still plot p95 latency by job class and refuse to pile a bursty agent loop onto a pin that already wobbles.",
      ],
      codes: [
        {
          title: "eval_moe.py — job score plus a health counter",
          language: "python",
          code: `def imbalance(load: dict[str, int]) -> float:
    total = sum(load.values()) or 1
    return max(load.values()) / total


def report(job_hits: int, job_n: int, load: dict[str, int]) -> dict[str, float]:
    return {"pass_rate": job_hits / max(job_n, 1), "hottest_share": imbalance(load)}


print(report(90, 100, {"A": 80, "B": 10, "C": 5, "D": 5}))`,
        },
      ],
      diagrams: [
        {
          title: "Health sits next to quality",
          caption:
            "A good chat score with a collapsed router is the restart incident waiting a week.",
          chart: chart(
            `flowchart LR
    Pin([Pinned checkpoint]) --> JobEval[Job eval]
    Pin --> Load[Expert load]
    JobEval --> Ship{Both ok}
    Load --> Ship
    Ship -->|yes| Live([Serve])
    Ship -->|no| Hold([Do not raise k for speed])`,
            `class Pin,Live,Hold hub
    class JobEval,Load grp1
    class Ship grp2`
          ),
        },
      ],
    },
  ],
  workedExample: {
    title: "Move a decode-heavy agent off a contended eight-expert box",
    setup:
      "You serve an 8-expert, top-2 model on four GPUs. Classify and a long-write agent share it. Under eight concurrent agents, p95 doubles. Two experts own most support tokens.",
    walkthrough: [
      "Step 1 — Understand the problem. Average tokens per second looks fine. Tail latency does not. The traffic is one dialect.",
      "Step 2 — Identify the relevant concept. Load imbalance on a routed expert, not 'GPUs are too small' as the first guess.",
      "Step 3 — Build the simplest solution. Log tokens per expert. Confirm the hot pair. Do not change k to chase throughput.",
      "Step 4 — Improve it. Move classify to a dense small model. Keep long write on the MoE if the job eval still passes.",
      "Step 5 — Handle a failure. If capacity overflows, refuse or queue the batch. Do not silently drop the second expert.",
      "Step 6 — Explain the production version. Pin top-k and the checkpoint. Page on hottest-share and on overflow count. Hosted MoE remains an option if self-serve cost is the platform team.",
    ],
    result:
      "The cheap token becomes real on the jobs that stay, because the router is no longer a hidden queue. Classify stops paying expert-travel tax.",
  },
  practice: {
    title: "Make overflow visible and illegal",
    task:
      "A restart made tokens per second jump and tool-field match fall. List the settings you compare, the counter you add, and the admit rule. Think about top-k, hot experts, and why GPU util can lie. No kernels to write.",
    hint:
      "Silent drop of the second expert is the quality cliff. Expected reasoning: pin k, measure load, fail closed on overflow.",
    solution:
      "Diff top-k, expert count, capacity, and checkpoint. Add tokens-per-expert and overflow count. Admit a batch only if every winner has a seat. Keep k pinned while you hunt throughput elsewhere — usually by moving short jobs off the box. Why this works: quality and health become the same review. Common wrong approach: raise concurrency and cut k because the speed graph got happy.",
  },
  takeaways: [
    "An expert is a specialist block inside one model, not a separate product.",
    "The router picks a few experts per token. That picker is the architecture.",
    "Sparse activation can lower math per token. Seated experts still occupy memory.",
    "Hold three numbers: total size, active size, serve size.",
    "Imbalance, overflow, and router collapse show up as latency and quiet quality cliffs.",
    "Job routing around a contended MoE box is part of operating MoE.",
  ],
  mistakes: [
    "Treating an MoE like a smaller dense model and copying flags. Why people make it: active size looks like the whole story. What actually happens: hot experts queue. Better approach: measure load per expert.",
    "Cutting top-k to win tokens per second. Why people make it: the speed graph is loud. What actually happens: you shipped a different model. Better approach: pin k; move jobs.",
    "Watching only average GPU util. Why people make it: one number is easy. What actually happens: one rank burns while others idle. Better approach: hottest-share next to util.",
    "Silently dropping overflowed experts. Why people make it: the request still finishes. What actually happens: tool quality dips after a restart. Better approach: visible degrade or admit control.",
    "Putting a bursty classify loop on a wide MoE. Why people make it: one box feels simpler. What actually happens: the router taxes a job that needed a dense SLM. Better approach: job-class backends.",
    "Quoting only total parameters to finance. Why people make it: the big number is impressive. What actually happens: they expect a 671B bill or a 671B serve. Better approach: three numbers on one slide.",
  ],
  interviews: [
    {
      question: "In one minute, what is mixture of experts?",
      difficulty: "easy",
      answer:
        "What they are testing: expert plus router, no mystique. Good answer: several specialist feed-forward blocks sit in a layer. A router picks a few per token. The others stay off for that token. Why that is good: it is the whole idea. Follow-up: why is this not the same as calling three different APIs?",
    },
    {
      question: "Why can an MoE be cheaper per token and still harder to serve?",
      difficulty: "medium",
      answer:
        "What they are testing: active versus serve, plus travel. Good answer: you run fewer parameters per token, but you still load most experts, and tokens must travel to the ranks that hold the winners. Imbalanced traffic makes a few ranks the bottleneck. Why that is good: it names RAM and collectives. Follow-up: what three size numbers do you put on the whiteboard?",
    },
    {
      question:
        "p95 doubled after you onboarded eight support agents onto an 8-expert box. Walk the debug.",
      difficulty: "hard",
      answer:
        "What they are testing: dialect imbalance before 'buy GPUs'. Good answer: histogram tokens per expert, check k and overflow, see if two experts own the dialect. Move short jobs off. Do not cut k. Only then talk about more ranks or a hosted API. Why that is good: it treats the router as the suspect. Follow-up: what alert would have paged you before the agents complained?",
    },
  ],
  glossary: [
    {
      term: "Expert",
      meaning:
        "A specialist block of weights inside one model, usually a feed-forward piece. Why it matters: several exist; only a few run per token.",
    },
    {
      term: "Router",
      meaning:
        "The tiny network that scores experts and picks the winners for this token. Why it matters: the picker is what you operate.",
    },
    {
      term: "Sparse activation",
      meaning:
        "Most experts stay off for a given token. Why it matters: this is where the per-token savings come from.",
    },
    {
      term: "Active parameters",
      meaning:
        "How much of the model actually runs for this token. Why it matters: it is not the same as total size or RAM.",
    },
    {
      term: "Expert parallelism",
      meaning:
        "Different GPUs hold different experts, so tokens must be dispatched. Why it matters: travel and imbalance become serving bugs.",
    },
    {
      term: "Top-k",
      meaning:
        "How many experts each token is allowed to use. Why it matters: changing k changes the model, not only the speed.",
    },
  ],
};
