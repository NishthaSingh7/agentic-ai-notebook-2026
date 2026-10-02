import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "small-language-models",
  instructor:
    "I am a senior engineer sitting next to you. We will start from zero. You do not need to know what '7B' means yet. I will build the idea from a simple sorting job, then we will get to routing, distillation, and why a tiny model should never be given a refund tool.",
  promise:
    "By the end you will know what a small language model is, which jobs it can do well, how a simple router works, what distillation means in plain language, and how to keep writes on a larger model while the cheap model sorts and extracts.",
  story: {
    title: "The support fleet that used a flagship model for 'is this a refund?'",
    body: [
      "A support org ran every ticket through their most expensive hosted model. The first step was almost always the same: is this a refund, a password reset, or something else. The expensive model was excellent at that. It was also excellent at writing a careful refund. Those are not the same job, but they were the same bill.",
      "Finance noticed first. Token spend on 'classify the ticket' was most of the body of the invoice. The hard tickets — two policies in conflict, an angry write — were a thin tail. The team was paying flagship prices to hear 'this is a refund' eighty times an hour.",
      "Someone proposed 'just use a smaller model for everything'. A weekend prototype put a 7-billion-parameter open model on classify, extract, and issue_refund. Classify looked fine. Extract of an order id looked fine. Then the small model, faced with a messy ticket, invented a tidy order id and called the refund tool. The number was the right length. It was the wrong order.",
      "They split the jobs. A small model now answers only closed questions: which queue, which order-id field, yes or no. If it is unsure, it abstains — it says it does not know — and a larger model takes the turn. The refund tool is not on the small model's keychain. Cost fell on the body of the traffic. The invented order id stopped, because the tiny model was no longer allowed to write money.",
    ],
    moral:
      "Most agent steps are sorting and filling boxes. A small model can do those. A small model should not be handed the tool that moves money just because it is already in the loop.",
  },
  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "The problem: a huge model for a tiny question",
      body: [
        "A language model is software that reads text and writes text. Bigger models, the frontier ones from the last sitting, are strong at messy judgement. They are also slow, costly, and often hosted far away. Many steps in a real app are not messy judgement. They are 'which bucket is this?' and 'copy the order id'.",
        "Think of a hospital. You do not send a surgeon to ask every incoming person whether they are here for a broken arm or a prescription refill. A receptionist does that. The surgeon still exists. They take the hard cases.",
        "If you send the surgeon to the door, two things happen. You wait longer. You pay more. And the door still only needed a label. That is the cost problem small models exist to fix.",
        "If you fire the surgeon and let the receptionist perform surgery, a different disaster happens. The receptionist is fine at labels and bad at rare, high-stakes work. That is the quality problem this lesson also exists to prevent.",
        "At this point you should understand the problem: we are overpaying a huge model for simple steps, and we must not 'fix' that by giving a tiny model dangerous tools.",
      ],
      diagrams: [
        {
          title: "The body of the work is simple",
          caption:
            "Most turns are classify or extract. A few turns are messy judgement or a write. Price the mix, not the logo.",
          chart: chart(
            `flowchart LR
    Ticket([Ticket]) --> Mix{What kind of turn}
    Mix -->|many| Sort[Classify or extract]
    Mix -->|few| Hard[Messy judgement]
    Mix -->|few| Write[Money or email]
    Sort --> Cheap([Small model])
    Hard --> Big([Larger model])
    Write --> Big`,
            `class Ticket,Cheap,Big hub
    class Mix grp2
    class Sort,Hard,Write grp1`
          ),
        },
      ],
    },
    {
      id: "what-small-means",
      level: "beginner",
      title: "What 'small' means, without the mystique",
      body: [
        "People say small language model, or SLM, for a model that is cheap enough and small enough to run often — on a laptop, on one GPU, or as a low-cost API. Names you will hear include Phi and Gemma. The exact name matters less than the job you give it.",
        "You will also hear a number like 7B. That means about seven billion parameters. A parameter is a number inside the model that was learned during training. More parameters often means more general skill and more hardware. It is a size label, not a quality score for your job.",
        "Small does not mean 'worse flagship'. It means specialised labour. A 7B model trained or prompted to pick one label from a list of five can beat a giant model that is bored, expensive, and slightly creative with the label set.",
        "Small also does not mean 'safe to trust with writes'. Size is not a permission system. Your code is the permission system. The story's invented order id was a small-model failure that became a money failure because the tool was attached.",
        "At this point you should be able to say: an SLM is a small, cheap language model we use on purpose for narrow jobs, not a broken GPT.",
      ],
      diagrams: [
        {
          title: "Size is a label, not a permission",
          caption:
            "A small model can sort. Your code decides whether a write tool exists. Size does not decide that.",
          chart: chart(
            `flowchart TD
    Slm([Small model]) --> Jobs[Classify extract route]
    Slm -.-> NoWrite[No write key]
    Big([Larger model]) --> Hard[Messy judgement]
    Big --> Writes[Refund or mail]
    Jobs --> App([Your app])
    Hard --> App
    Writes --> App`,
            `class Slm,Big,App hub
    class Jobs,Hard,Writes grp1
    class NoWrite grp3`
          ),
        },
      ],
    },
    {
      id: "three-jobs",
      level: "beginner",
      title: "The simplest jobs: route, extract, classify",
      body: [
        "Three jobs show up constantly. Classify: pick one label from a closed list. Extract: copy a field that is already in the text, like an order id. Route: send this ticket to this queue or this next model. They look similar because they all return a small object. The important difference is what happens if the answer is wrong.",
        "A wrong classify sends a ticket to the wrong human. Annoying. A wrong extract can feed a wrong id into a lookup. Worse. A wrong route that includes a write tool is the story.",
        "What are we trying to do? Classify a ticket into a tiny label set, and abstain if the model is not sure. Abstain means 'I do not know' — a first-class answer, not a failure of nerve.",
        "Here is the smallest version.",
        "Let's understand what just happened. We gave three labels plus unsure. We only accept a label from the list. Anything else becomes unsure. That single habit — fail closed to unsure — is how a small model stays useful.",
        "Pause and check. If the ticket mentions both a refund and a password, a forced label is a lie. Unsure is the correct output. A larger model or a human can take it from there.",
      ],
      codes: [
        {
          title: "classify.py — closed labels, then abstain",
          language: "python",
          code: `LABELS = {"refund", "password", "other", "unsure"}


def parse_label(raw: str) -> str:
    label = raw.strip().lower()
    if label not in LABELS:
        return "unsure"
    return label


print(parse_label("refund"))
print(parse_label("maybe a refund but also a hack"))`,
        },
      ],
    },
    {
      id: "implement-router",
      level: "intermediate",
      title: "How we implement a cheap router",
      body: [
        "A router is a first step that decides who does the real work. Rules can go first: if the ticket already has a queue field, do not ask a model. Then the small model. Then a larger model. Then a human. The path should not loop. Looping routers spend forever handing the same ticket back and forth.",
        "What are we trying to do? Send only cheap jobs to the SLM, and escalate once.",
        "Here is the smallest version.",
        "Let's understand what just happened. Rules win if they already know. The SLM may return a label or unsure. Unsure goes to the large model. Writes are not a label the SLM can pick as a destination for itself. They stay on the large path by construction.",
        "Connect this back to the hospital. The receptionist can label. They cannot wheel someone into surgery because the waiting room is full.",
      ],
      codes: [
        {
          title: "slm_router.py — rules, then SLM, then large, never a write",
          language: "python",
          code: `def route(ticket: dict, slm_label: str) -> str:
    if ticket.get("queue"):
        return "rules"
    if slm_label in {"refund", "password", "other"}:
        return "slm"
    return "large"


print(route({"queue": "vip"}, "unsure"))
print(route({}, "refund"))
print(route({}, "unsure"))`,
        },
      ],
      diagrams: [
        {
          title: "One way forward, no loop",
          caption:
            "Rules, small model, large model, human. Each step can stop. None send the ticket backwards.",
          chart: chart(
            `flowchart TD
    In([Ticket]) --> Rules{Rule already knows}
    Rules -->|yes| Done([Use the rule])
    Rules -->|no| Slm{SLM label}
    Slm -->|known label| Done
    Slm -->|unsure| Large[Larger model]
    Large --> Human{Still unsure}
    Human -->|yes| Desk([Human])
    Human -->|no| Done`,
            `class In,Done,Desk hub
    class Rules,Slm,Human grp2
    class Large grp1`
          ),
        },
      ],
    },
    {
      id: "when-simple-fails",
      level: "intermediate",
      title: "When the small model is not enough",
      body: [
        "Small models fail in three boring ways. They invent a field that looks well-typed. They drift off the label list and write a sentence. They are fine on the common tickets and lost on the tail — the rare, messy ones.",
        "The fix is not 'pick a bigger SLM and hope'. The fix is output shape plus abstain plus a forbidden-job list. If the job is a write, the SLM is not a candidate. If the job is extract and the id does not match a simple pattern, you abstain. If the job is classify and the model wrote a paragraph, you abstain.",
        "What are we trying to do? Repair once, then abstain, never invent a label.",
        "Here is the smallest version.",
        "Let's understand what just happened. We accept a clean label. We try one repair prompt if the first output is messy. Then we stop guessing. Inventing a fourth label is worse than asking the large model.",
        "Distillation is the next idea, and we will name it properly in the next stage. For now: you can teach a small model from the large model's past answers, but only on jobs the small model is allowed to own.",
      ],
      codes: [
        {
          title: "closed_output.py — repair once, then abstain",
          language: "python",
          code: `LABELS = {"refund", "password", "other"}


def accept(raw: str, attempt: int) -> str:
    label = raw.strip().lower()
    if label in LABELS:
        return label
    if attempt == 0:
        return "retry"
    return "unsure"


print(accept("refund", 0))
print(accept("I think refund?", 0))
print(accept("I think refund?", 1))`,
        },
      ],
    },
    {
      id: "distill-and-connect",
      level: "intermediate",
      title: "Distillation, and how the pieces connect",
      body: [
        "Distillation means a larger teacher model answers many real examples, and you train a smaller student to copy those answers. The student is not 'learning the internet'. It is learning your labels on your tickets.",
        "What are we trying to do? Turn traces — recorded turns from production — into rows a student can learn: input text, allowed label.",
        "Here is the smallest version.",
        "Let's understand what just happened. We only keep rows whose teacher label is in the closed set. We drop writes. We drop unsure. The student dataset is narrower than the traffic on purpose. A blog's general dataset will teach a general chatter. Your traces teach your queues.",
        "In a real app the pieces are: a router, an SLM on closed jobs, a larger model on the tail, a gateway that never gives the SLM a write tool, and an eval that scores the body and the tail separately.",
        "At this point you should see the system, not a single 'we use Phi' slide.",
      ],
      codes: [
        {
          title: "distill_rows.py — teacher turns into closed student rows",
          language: "python",
          code: `ALLOWED = {"refund", "password", "other"}


def student_row(text: str, teacher_label: str, job: str) -> dict | None:
    if job == "write":
        return None
    if teacher_label not in ALLOWED:
        return None
    return {"text": text, "label": teacher_label}


print(student_row("order 12 refund", "refund", "classify"))
print(student_row("please pay them", "issue_refund", "write"))`,
        },
      ],
      diagrams: [
        {
          title: "Teacher traces become a narrow student",
          caption:
            "Writes never enter the student set. Unsure never enters. The student learns your labels, not a blog's chat.",
          chart: chart(
            `flowchart LR
    Trace[(Production traces)] --> Filter{Closed job and label}
    Filter -->|no| Drop([Drop])
    Filter -->|yes| Rows[(Student rows)]
    Rows --> Student([Small model])
    Student --> Router[Live router]`,
            `class Trace,Student,Drop hub
    class Filter grp2
    class Rows,Router grp1`
          ),
        },
      ],
    },
    {
      id: "failures-eval",
      level: "advanced",
      title: "Failure modes, eval, and the cut as an experiment",
      body: [
        "Remember the simple classifier. In production, a silent format change — the model starts writing 'Label: refund' — can look like a quality cliff. It is often just parse drift. Keep the parser strict and the repair count at one.",
        "Shadow traffic means the SLM answers in parallel while the large model still serves users. You compare labels. You do not cut over because a notebook looked good on twenty rows.",
        "What are we trying to do? Score three slices: the common body, the abstain tail, and the forbidden write jobs that must never go to the SLM.",
        "Here is the smallest version.",
        "Let's understand what just happened. Body accuracy can be high while the tail is a mess. Forbidden jobs must score as 'not assigned'. If you only report one accuracy number, you will ship the story's weekend prototype.",
        "When not to cut: if abstain is rare and errors are silent inventions. A model that always picks a label is confident, not good.",
      ],
      codes: [
        {
          title: "eval_slm.py — body, tail, and forbidden jobs",
          language: "python",
          code: `def slice_score(rows: list[dict]) -> dict[str, float]:
    body = [r for r in rows if r["slice"] == "body"]
    tail = [r for r in rows if r["slice"] == "tail"]
    forbidden = [r for r in rows if r["slice"] == "forbidden"]
    def acc(part: list[dict]) -> float:
        if not part:
            return 0.0
        return sum(int(r["got"] == r["want"]) for r in part) / len(part)
    return {
        "body": acc(body),
        "tail_ok_or_unsure": acc(tail),
        "forbidden_blocked": acc(forbidden),
    }


print(slice_score([
    {"slice": "body", "got": "refund", "want": "refund"},
    {"slice": "tail", "got": "unsure", "want": "unsure"},
    {"slice": "forbidden", "got": "blocked", "want": "blocked"},
]))`,
        },
      ],
    },
    {
      id: "serving-slms",
      level: "advanced",
      title: "Production: where the small model lives",
      body: [
        "You can call a hosted small model, or you can run one yourself. Running it yourself is local inference — we will do a whole sitting on that. The reason it comes up here is privacy and latency. A classify step that must stay in your building should not ride a flagship API across the ocean.",
        "Edge means close to the user or the device: a phone, a store computer, a laptop on a plane. The model that fits is the one whose file and memory budget you can name. A 70B 'small compared to a frontier API' does not fit on a phone. Be honest about the box.",
        "Batch classify — many tickets at night — is a different placement than a 50-millisecond router on a live request. Same model family, different serving. Do not copy flags from a chat demo onto a router path.",
        "The professional posture: use SLMs as labour, not as a cheaper personality. Measure the body and the tail. Keep writes off the keychain. Distill from your traces when the prompt is no longer enough.",
        "When you should not bother: fifty tickets a day and no bill pain. A second model is a second outage. Earn it.",
      ],
      diagrams: [
        {
          title: "Placement follows the job",
          caption:
            "Live router, night batch, and a device. Same idea, three homes. Fit is a memory number, not a brand.",
          chart: chart(
            `flowchart TD
    Job([Closed job]) --> Where{Where it must run}
    Where -->|live request| Api[Cheap hosted or one GPU]
    Where -->|night batch| Batch[Throughput box]
    Where -->|device| Edge[File that fits]
    Api --> Same[Same closed labels]
    Batch --> Same
    Edge --> Same`,
            `class Job,Same hub
    class Where grp2
    class Api,Batch,Edge grp1`
          ),
        },
      ],
    },
  ],
  workedExample: {
    title: "Cut classify and extract, keep the flagship on writes and conflict",
    setup:
      "A support agent today sends every turn to a flagship model. About 80 percent of turns are 'which queue' or 'copy the order id'. The rest are policy conflict or issue_refund.",
    walkthrough: [
      "Step 1 — Understand the problem. You are paying flagship prices for labels. The bill's body is classify, not genius.",
      "Step 2 — Identify the relevant concept. SLM for closed jobs, abstain on the tail, no write tools on the SLM.",
      "Step 3 — Build the simplest solution. A classifier with four labels including unsure. A regex check on order ids. Everything else stays on the flagship.",
      "Step 4 — Improve it. Shadow the SLM on live tickets for a week. Distill student rows from teacher traces that already have clean labels.",
      "Step 5 — Handle a failure. If extract fails the id pattern, abstain. If a ticket is both refund and fraud, unsure. Never silently fill a field.",
      "Step 6 — Explain the production version. Router is acyclic. Eval reports body, tail, and forbidden. issue_refund is not importable from the SLM path.",
    ],
    result:
      "Cost falls on the body. The invented order id cannot reach a refund tool. The flagship still owns conflict and money.",
  },
  practice: {
    title: "Take triage off the flagship without giving a 7B a refund tool",
    task:
      "You may add one small model. Tickets need a queue label, an order-id extract, and sometimes issue_refund. Draw the route, the output contract, and the eval slices. Think about abstain, shadow traffic, and what must never be a student row. No live model needed.",
    hint:
      "Closed labels plus unsure. Writes are a different path, not a label. Expected reasoning: rules, SLM, large, human — and a forbidden slice in eval.",
    solution:
      "Rules first if the queue is already set. SLM returns a label from a closed set or unsure, and an order id only if it matches a simple pattern. Unsure and all writes go to the flagship. Distill only classify and extract rows. Eval body accuracy, tail abstain, and forbidden blocked. Why this works: the cheap model never holds the write key. Common wrong approach: one 7B agent with every tool attached 'to save money'.",
  },
  takeaways: [
    "A small language model is specialised cheap labour, not a broken flagship.",
    "The jobs it should own are closed: classify, extract, route.",
    "Abstain is a first-class answer. Inventing a tidy field is the real failure.",
    "Distillation copies your teacher's labels on your traces, not a blog's chat set.",
    "Never attach a write tool to the SLM path just because the model is already running.",
    "Eval the body, the tail, and the forbidden jobs as three numbers.",
  ],
  mistakes: [
    "Sending every turn to a flagship. Why people make it: one model feels simpler. What actually happens: you pay surgeon rates for receptionist work. Better approach: split job classes.",
    "Replacing the flagship with one 7B for everything. Why people make it: the demo classified well. What actually happens: the small model invents an id and writes money. Better approach: closed jobs only.",
    "Forcing a label when the model is unsure. Why people make it: abstain looks like failure. What actually happens: a mixed ticket goes to the wrong queue. Better approach: unsure then escalate.",
    "Distilling from a public chat dataset. Why people make it: it is easy to download. What actually happens: the student learns generic chatter. Better approach: your traces, closed labels.",
    "Reporting one accuracy number. Why people make it: dashboards like a single score. What actually happens: a good body hides a bad tail. Better approach: body, tail, forbidden.",
    "Letting the router loop. Why people make it: 'ask the other model again'. What actually happens: the ticket ping-pongs and the bill returns. Better approach: one escalate, then a human.",
  ],
  interviews: [
    {
      question: "What is a small language model for, in a production agent?",
      difficulty: "easy",
      answer:
        "What they are testing: job, not brand. Good answer: closed, high-volume steps — classify, extract, route — where a wrong answer is recoverable and a write tool is not attached. Why that is good: it names labour, not size worship. Follow-up: why is 7B not a safety property?",
    },
    {
      question: "How would you cut classify cost without changing refund behaviour?",
      difficulty: "medium",
      answer:
        "What they are testing: path split and abstain. Good answer: SLM on a closed label set with unsure, shadow for a week, keep issue_refund on the flagship path only. Distill from traces that already have clean labels. Why that is good: cost moves on the body, writes stay put. Follow-up: what three eval slices do you show finance and safety?",
    },
    {
      question: "Your 7B extract invents well-typed order ids on the tail. What do you do?",
      difficulty: "hard",
      answer:
        "What they are testing: fail closed versus 'a better small model'. Good answer: pattern-check the id, abstain on miss, escalate. Do not attach a write. If distill, drop tail rows that were teacher-unsure. A larger SLM that still invents is still a parser plus a gateway problem. Why that is good: it treats invention as a contract bug. Follow-up: when would you actually train, versus tighten the parser?",
    },
  ],
  glossary: [
    {
      term: "Small language model",
      meaning:
        "A compact, cheap language model used on purpose for narrow jobs. Why it matters: most agent steps do not need a frontier model.",
    },
    {
      term: "Parameter",
      meaning:
        "A learned number inside the model. A '7B' model has about seven billion of them. Why it matters: size is a hardware and skill hint, not a permission.",
    },
    {
      term: "Classify",
      meaning:
        "Pick one label from a closed list. Why it matters: this is the receptionist job SLMs are good at.",
    },
    {
      term: "Abstain",
      meaning:
        "The model is allowed to say it does not know. Why it matters: a forced label is often a silent lie.",
    },
    {
      term: "Distillation",
      meaning:
        "Training a smaller student to copy a teacher's answers on your examples. Why it matters: the student learns your labels, not the internet.",
    },
    {
      term: "Shadow traffic",
      meaning:
        "The new model answers in parallel while the old path still serves users. Why it matters: a cut should be an experiment, not a weekend hope.",
    },
  ],
};
