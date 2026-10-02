import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "react-loop",
  instructor:
    "I am a senior engineer who builds AI products. I still start this topic from zero every time I teach it, because the idea is simple and the failures are not.",
  promise:
    "You will go from never having heard of a ReAct loop to being able to explain it, write a small one, stop it safely, and say when a different pattern is better.",

  story: {
    title: "The refund bot that tried the same refund nine times",
    body: [
      "A payments team built a helper that could look up an order, issue a refund, and email the customer. In demos it worked. A person asked for a refund. The helper looked up the order, issued the refund, sent the email, and stopped. Three steps. Everyone was happy.",
      "Then a real customer asked for a refund on an order that had already been partly refunded. The refund tool said no: the remaining amount was too small. The helper read that message, decided the refund might not have gone through, and tried again with the same numbers. It kept trying. After a while, some of those retries started to land as real refunds.",
      "Nine refunds went out before someone stopped the process. The model was not being clever. It was being optimistic. The program around it had only one way to stop: the model saying it was done. Nobody had given the loop a maximum number of steps, a memory of 'I already tried this', or a clear signal that this error should not be retried.",
      "The fix was small. A hard stop after eight steps. A note that the same tool with the same arguments had already been tried. An error that said 'do not retry'. And a unique key so the same refund could only move money once, even if the loop got confused again.",
    ],
    moral:
      "A loop that can change the world needs more than one way to stop. The model saying 'I am finished' is not enough.",
  },

  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "A normal chat with an AI is one round trip. You ask a question. The model writes an answer. That is it. The world outside the chat does not change. No database is read. No refund is issued. No email is sent.",
        "That one-shot answer is enough when the model already knows the fact. 'What is a refund?' is that kind of question. 'Has order 88213 been refunded?' is not. The model does not have your order book inside its head. If you force it to answer anyway, it will guess. A confident guess about money is how incidents start.",
        "So we need a different shape. The AI should be allowed to look something up, read the result, and then decide what to do next. Maybe it looks again. Maybe it takes an action. Maybe it stops and answers you. That is the whole problem this lesson solves: how do we let a model take several turns, using tools, until the job is done?",
        "Here is the simplest picture. You ask: 'What is the status of order 88213?' The model cannot know. It asks a lookup tool. The tool returns: paid, shipped, not refunded. Now the model can answer from a fact, not from a guess.",
        "Pause and check. If the lookup tool is down, should the model invent a status? No. It should say it could not check. That already tells you something important: the program around the model has to handle failure, not just success.",
        "At this point you should understand the problem: one answer is not enough when the truth lives outside the model. We need a cycle that can look, act, and look again.",
      ],
      diagrams: [
        {
          title: "One shot versus a cycle",
          caption:
            "A chatbot answers once. A helper that can use tools may take several turns before it answers you.",
          chart: chart(
            `flowchart TD
    Ask([You ask a question]) --> Once[One model reply]
    Once --> DoneChat([You get an answer])
    Ask --> Look[Model asks a tool]
    Look --> Result[Tool returns a fact]
    Result --> Decide[Model decides next step]
    Decide -->|need more| Look
    Decide -->|enough| DoneHelp([You get an answer])`,
            `class Ask,DoneChat,DoneHelp hub
    class Once grp1
    class Look,Result,Decide grp2`
          ),
        },
      ],
    },
    {
      id: "the-cycle",
      level: "beginner",
      title: "The cycle: think, do, look",
      body: [
        "Imagine a person at a help desk with a notebook. They read your request. They write a short note: 'I need the order first.' They look up the order. They write down what they saw. Then they decide the next note. That notebook is the only memory they have for this ticket.",
        "An AI helper can work the same way. Each turn it writes a short reason, chooses an action or a final answer, and if it chose an action it gets a result back. The reason, the action, and the result are all written into a growing list. The next turn, the model reads that whole list and chooses again.",
        "We give this cycle a name. Reason and Act — ReAct — means: write a thought, take an action, see the result, repeat. The 2022 paper that named it was pointing at this simple rhythm, not at a special model or a fancy framework.",
        "The thought matters because it is text the model has already committed to. That text shapes the next tokens. If the model writes 'I should look up the order before refunding', it is less likely to refund into the dark. The thought is not magic thinking. It is a constraint on what comes next.",
        "Four roles stay separate. The transcript — we will call it the scratchpad — is the notebook. The model is a function from notebook to next move. Tools are the only things that touch the outside world. The loop is a dumb manager whose job is to run the next step and decide when to stop.",
        "Connect this back to the last stage. We needed a way to get facts from outside the model. The scratchpad is how those facts stay in view. If a fact is not in the scratchpad, the model does not know it, even if a tool returned it two minutes ago in a different run.",
      ],
      diagrams: [
        {
          title: "Think, act, observe",
          caption:
            "The scratchpad grows every turn. The model only sees what is written there.",
          chart: chart(
            `flowchart TD
    Goal([User goal]) --> Think[Write a thought]
    Think --> Need{Need a tool?}
    Need -->|no| Final([Final answer])
    Need -->|yes| Act[Call a tool]
    Act --> Obs[Write the result]
    Obs --> Think`,
            `class Goal,Final hub
    class Think,Act,Obs grp1
    class Need grp2`
          ),
        },
      ],
    },
    {
      id: "simplest-version",
      level: "beginner",
      title: "How the simplest version works",
      body: [
        "The simplest ReAct program is a while-loop. While we are not done, ask the model for the next move. If the move is a final answer, stop. If the move is a tool name and some arguments, run that tool, write the result into the scratchpad, and go around again.",
        "That already works for a lookup. It fails the moment the model never says it is done. Models are optimistic. They retry. They rephrase. They try the same tool again. If the only stop button is 'the model volunteers to finish', you have built the refund incident from the story.",
        "So we add stops you control. A step budget is a maximum number of turns. Eight is plenty for a lookup-and-refund helper. When the count hits the limit, you stop and tell the user the request could not be finished. You do not invent a polite success.",
        "A second stop is policy. Before a tool that changes the world — refund, email, delete — your code asks: is this allowed? If not, you stop. The model does not get a vote. A third stop is no progress: the same tool with the same arguments already ran, and the result did not change. Trying it again is not work. It is spinning.",
        "Here is the key idea. The model controls one door: 'I have an answer.' You control the other doors: budget, policy, no progress. An agent without those doors is not autonomous. It is a loop with no exit.",
        "At this point you should understand the simplest version: a loop, a scratchpad, tools, and at least three ways to stop. Next we will write it in a few lines of Python.",
      ],
      codes: [
        {
          title: "The smallest loop",
          language: "python",
          code: `def run(goal: str, ask_model, tools: dict, max_steps: int = 8) -> str:
    notes = [goal]
    for _ in range(max_steps):
        move = ask_model(notes)  # {"thought", "tool", "args", "final"}
        if move.get("final"):
            return move["final"]
        name = move.get("tool")
        if name not in tools:
            notes.append(f"unknown tool {name}")
            continue
        result = tools[name](**move.get("args", {}))
        notes.append(f"{name} -> {result}")
    return "stopped: too many steps"`,
        },
      ],
    },
    {
      id: "write-the-loop",
      level: "intermediate",
      title: "Write the loop so you can see every part",
      body: [
        "What are we trying to do? Make the four roles from Stage 2 visible in code: scratchpad, model, tools, loop. Once you can see them, every agent framework you meet is the same four roles with different names.",
        "Here is the smallest version that is still honest. The model must return one JSON object: a thought, an optional tool name, arguments, and an optional final answer. Exactly one of tool or final is set. We do not parse English sentences looking for the word 'Action:'. That style from the original paper breaks as soon as the model changes formatting.",
        "Let's understand what just happened. The loop never decides the next tool. It asks the model. The loop never talks to the database. A tool function does. The loop never 'figures out' that it should stop. It checks a final field, a step count, and later a policy function. Keep the loop this boring on purpose.",
        "If the JSON is broken, feed the error back once, in plain language: 'args.order_id is required, got null.' That message is a prompt. A vague 'invalid output' does not help. If the second try is still broken, stop. Do not invent a parser that guesses what the model meant.",
        "Tool failures need the same honesty. Never dump a raw exception into the scratchpad. It is huge, it leaks internals, and it gives the model nothing useful. Return a short result: did it work, a one-line message, and whether retrying is allowed. That last field is the one that would have stopped the nine refunds.",
      ],
      codes: [
        {
          title: "A structured tool result",
          language: "python",
          code: `from dataclasses import dataclass

@dataclass
class ToolResult:
    ok: bool
    body: str
    retryable: bool = False

    def render(self) -> str:
        flag = "ok" if self.ok else f"error retryable={self.retryable}"
        return f"{flag}: {self.body}"


def issue_refund(order_id: str, amount_cents: int) -> ToolResult:
    if amount_cents > 2700:
        return ToolResult(False, "exceeds remaining amount", retryable=False)
    return ToolResult(True, f"refunded {amount_cents} on {order_id}")`,
        },
      ],
    },
    {
      id: "when-simple-breaks",
      level: "intermediate",
      title: "When the simple loop is not enough",
      body: [
        "The simple loop retries the same call because it has no memory of signatures. A signature is just a fingerprint of the tool name plus its arguments. If that fingerprint already exists on the scratchpad, do not run the tool again. Hand back the old result and say so. This is a cache, not cleverness.",
        "Remember this: identical arguments mean identical intent. If the first refund failed as not-retryable, the second one with the same numbers must not become a new attempt. If you need a second attempt, the arguments must change — a different amount, a different order — or a human must take over.",
        "The original ReAct paper let the model write free prose. Production systems should not. Use the model's native tool-calling interface when you have one. You describe each tool with a name, a short description, and a schema for its arguments. The provider then constrains the output so you get the right shape without regex.",
        "They look similar because both 'call a function'. The important difference is who enforces the shape. Prose parsing hopes the model stays tidy. A schema makes illegal arguments hard to emit. Shape is still not sense: a valid order_id can belong to the wrong customer. Sense checks live inside the tool, every time.",
        "Parallel tool calls are a later convenience. Several lookups in one turn can be faster. Several writes in one turn are several chances to be wrong at once. Run reads together if you want. Run writes one at a time, and check policy on each.",
      ],
      diagrams: [
        {
          title: "Same call, already tried",
          caption:
            "A cache keyed on tool plus arguments turns a retry storm into one observation.",
          chart: chart(
            `flowchart TD
    Call[Model wants a tool] --> Key[Hash name and arguments]
    Key --> Seen{Seen this key?}
    Seen -->|yes| Reuse[Return the old result]
    Seen -->|no| Run[Run the tool]
    Run --> Save[Store result under the key]
    Save --> Notes[Append to scratchpad]
    Reuse --> Notes`,
            `class Call,Notes hub
    class Key,Run,Save grp1
    class Seen,Reuse grp2`
          ),
        },
      ],
      codes: [
        {
          title: "Dedupe before you run",
          language: "python",
          code: `import hashlib, json

def signature(name: str, args: dict) -> str:
    blob = json.dumps({"t": name, "a": args}, sort_keys=True)
    return hashlib.sha256(blob.encode()).hexdigest()[:16]

def call_tool(name, args, tools, cache):
    key = signature(name, args)
    if key in cache:
        return cache[key], True  # already tried
    result = tools[name](**args)
    cache[key] = result
    return result, False`,
        },
      ],
    },
    {
      id: "real-application",
      level: "intermediate",
      title: "How the pieces connect in a real helper",
      body: [
        "Put the pieces on one path. A user sends a ticket. Your server starts a run with a goal string and an empty scratchpad. Each turn: check budgets, ask the model, validate the move, maybe run a tool, append the observation. When a door opens, you return a final answer or an honest halt.",
        "In a real refund helper the tools are not equal. lookup_order is a read. It can be retried. issue_refund and send_email change the world. They need a policy check before they run, and they need an idempotency key — a unique string that means 'this exact refund, this ticket, once'. If the loop calls issue_refund twice with the same key, the payment system should no-op the second time.",
        "The scratchpad you show the model is not the same as the log you keep for yourself. Thoughts can be wrong about what actually happened. Users should see the final answer. Your traces should see every tool, argument, result, error, and halt reason. Shipping raw thoughts to customers leaks tool names and invents explanations.",
        "Context size is a design problem, not a memory product. If a run needs forty steps, a tool is probably returning a novel when it should return six fields. Keep runs short. If you must compact, keep every tool name and status, and replace huge bodies with a short extract plus a handle the model can fetch again. Never drop the fact that a call happened.",
        "At this point you should be able to point at any agent SDK and find these same parts: a transcript, a model call, a tool registry, and stop rules. The brand name on the package does not change the loop.",
      ],
      diagrams: [
        {
          title: "A refund helper, end to end",
          caption:
            "Reads can retry. Writes go through policy and a one-time key. Every path ends in an answer or a named halt.",
          chart: chart(
            `flowchart TD
    Ticket([Support ticket]) --> Loop[ReAct loop]
    Loop --> Read[lookup_order]
    Loop --> Write{Write tool?}
    Write -->|no| Loop
    Write -->|yes| Policy{Policy allows?}
    Policy -->|no| Halt([Halt: denied])
    Policy -->|yes| Money[issue_refund with one-time key]
    Money --> Loop
    Loop --> Answer([Final answer or budget halt])`,
            `class Ticket,Halt,Answer hub
    class Loop,Read grp1
    class Write,Policy grp2
    class Money grp3`
          ),
        },
      ],
    },
    {
      id: "how-it-fails",
      level: "advanced",
      title: "How the loop fails, and how you debug it",
      body: [
        "Now that you understand the simple system, look at what breaks it. The common failure is not 'the model is dumb'. It is 'the loop had no information, or no door'. Read the last four turns of the scratchpad out loud. That is the debug method. The bug is almost always sitting there in plain text.",
        "Imagine the tool fails here. What should the agent do? It cannot continue as if the tool succeeded. If the error is not retryable, the next thought should be 'I cannot do this' and the next move should be a final answer or a halt. If the error is retryable — a timeout, a 429 — one retry with backoff is reasonable. A storm of retries is the story again.",
        "A loop can stay inside the step budget and still be useless. It alternates between two tools and learns nothing. Detect that with the signatures you already have. If the last three observations are ones you have already seen, stop. Nudging the model with 'please try something different' usually burns two more steps proving it will not.",
        "Another failure: you trimmed the scratchpad to save tokens and deleted the observation from step two. From the model's point of view the lookup never happened, so it looks up again. Compaction that drops evidence creates loops that look like model bugs.",
        "When you debug, ask four questions. What was the goal? What did the model think it was doing? What did the tool actually return? Which door should have opened and did not? Those four answers are the post-mortem. The model version is rarely the interesting one.",
      ],
      diagrams: [
        {
          title: "Four doors, one run",
          caption:
            "Any door can end the run. Report which one opened. A silent stop that looks like a normal answer is worse than no stop.",
          chart: chart(
            `flowchart TD
    Turn[Start of turn] --> Steps{Steps left?}
    Steps -->|no| HaltBudget([Halt: budget])
    Steps -->|yes| Clock{Time left?}
    Clock -->|no| HaltBudget
    Clock -->|yes| Progress{New information?}
    Progress -->|no| HaltStuck([Halt: no progress])
    Progress -->|yes| Policy{Write allowed?}
    Policy -->|no| HaltPolicy([Halt: policy])
    Policy -->|yes| Work[Think or act]
    Work --> Turn`,
            `class Turn,Work hub
    class Steps,Clock grp1
    class Progress,Policy grp2
    class HaltBudget,HaltStuck,HaltPolicy grp3`
          ),
        },
      ],
    },
    {
      id: "production-and-tradeoffs",
      level: "advanced",
      title: "Production choices, and when not to use ReAct",
      body: [
        "The simple loop becomes a production loop when you count more than steps. Count tokens, wall-clock time, and how many write tools have fired. One step that pulls a huge document can cost more than ten cheap lookups. A hung tool with no time limit holds the user's request open while they refresh and start a second run.",
        "Idempotency is the word for 'doing it twice does not double the effect'. For money, email, and deletes, derive a key from the ticket id plus the action, and send that key to the downstream system. Your loop will have bugs. The payment system should still only move money once.",
        "ReAct is useful when the next step depends on the last observation. Lookup, then decide whether to refund. Search, then decide whether to search again. You might avoid it when the plan is known up front: classify, retrieve, answer. That is a workflow — a fixed sequence — and a workflow is easier to test, cheaper to run, and simpler to pause.",
        "They look similar because both call tools. The important difference is who chooses the next step. In ReAct, the model chooses every turn. In plan-and-execute, the model (or you) writes a plan once, then a more rigid runner walks the steps. ReAct is flexible and spendy. A plan is rigid and inspectable. Pick the one that matches how much the path can change.",
        "Do not put a second model inside the hot loop to ask 'is this answer good enough?' on every turn. It doubles cost and the judge is as fallible as the actor. Quality checks belong after the loop, or in an offline eval. Inside the loop, keep gates cheap: counters, signatures, and if-statements.",
        "The learner who can teach this now says: ReAct is a loop over a scratchpad. Tools change the world. You own the stops. Use it when the path is unknown. Do not use it as a substitute for a workflow you can already write down.",
      ],
      codes: [
        {
          title: "A one-time key the loop cannot invent differently each retry",
          language: "python",
          code: `def refund_key(ticket_id: str, order_id: str) -> str:
    return f"{ticket_id}:issue_refund:{order_id}"

def maybe_workflow(goal: str) -> str:
    # Known path: do not spend a ReAct loop on it.
    if goal.startswith("classify:"):
        return classify_then_answer(goal)
    return run(goal, ask_model, TOOLS)`,
        },
      ],
    },
  ],

  workedExample: {
    title: "Refund order 88213, from a blank notebook to a safe loop",
    setup:
      "A customer asks: refund order 88213. The order was captured for 42.00 and already refunded 15.00. The remaining amount is 27.00. The customer asked for 42.00 again.",
    walkthrough: [
      "Step 1 — Understand the problem. The model does not know the order. A one-shot answer would guess. We need a loop that can look up, then decide.",
      "Step 2 — Identify the relevant concept. This is ReAct: thought, tool, observation, repeat, with stops you control.",
      "Step 3 — Build the simplest solution. Scratchpad starts with the goal. Turn 1: thought 'look up the order', tool lookup_order, args {order_id: 88213}. Observation: captured 4200 cents, refunded 1500. Turn 2: the model wants issue_refund of 4200. The tool returns not-retryable: exceeds remaining amount.",
      "Step 4 — Improve it. Add a step budget of 8, a signature cache, and a retryable flag. The next turn cannot call issue_refund with the same arguments. The model must either refund 2700 or tell the user the full amount is not available.",
      "Step 5 — Handle a failure. If the model retries 4200 anyway, the cache returns the old error and says so. If it still will not finish, the budget door opens. The user sees 'could not complete', not a fake success.",
      "Step 6 — Production version. issue_refund requires an idempotency key derived from the ticket id. Policy denies refunds over a configured ceiling. Writes are logged. Thoughts stay internal.",
    ],
    result:
      "The customer is told the remaining refundable amount is 27.00. Money moves at most once. The trace shows lookup, one denied refund, and a final answer — not nine retries.",
  },

  practice: {
    title: "Give a weather helper three doors",
    task:
      "You have a helper with two tools: get_weather(city) and send_alert(city, message). A user says 'alert me if Paris is rainy'. The first get_weather times out. The model retries it forever. Problem: design the loop rules so this cannot run all night. Think about: which tools are reads, which change the world, what 'already tried' means, and what the user should see if you stop.",
    hint:
      "Budget the turns. Mark a timeout as retryable once, not forever. Cache get_weather(Paris). send_alert needs policy and a one-time key. Do not let the model send an alert if weather never succeeded. Expected reasoning: three doors (final, budget, policy), plus no-progress on the same signature.",
    solution:
      "max_steps = 6. get_weather timeout: retryable true for one retry, then retryable false. Cache key is get_weather + {city: Paris}. If weather never returns ok, send_alert is not allowed. If budget opens, reply 'could not check Paris weather' — never send a guessed alert. Why this works: the loop can look again once, then it must stop or ask a human. Common wrong approach: only adding a nicer prompt that says 'please do not retry'. Prompts are not doors.",
  },

  takeaways: [
    "A chatbot answers once. A ReAct loop lets a model think, use a tool, see the result, and decide the next step.",
    "The scratchpad is the only memory for one run. If a fact is not written there, the model does not know it.",
    "The model controls one stop: a final answer. You must add others: a step budget, a policy check before writes, and a no-progress stop.",
    "Give tools a small structured result — worked, message, retryable — instead of raw exceptions or free prose.",
    "A cache keyed on tool name plus arguments stops the 'try the same refund again' failure.",
    "Use ReAct when the next step depends on the last observation. Use a fixed workflow when you already know the steps.",
  ],

  mistakes: [
    "Mistake: only stop when the model says it is done. Why people make it: demos finish in three steps. What actually happens: a confused model retries until money or tokens run out. Better approach: a hard step budget and an honest halt message.",
    "Mistake: parse the model's English for 'Action:' and 'Observation:'. Why people make it: that is how the original paper looked. What actually happens: formatting drifts and the loop misses the call. Better approach: JSON or native tool calling with a schema.",
    "Mistake: dump a stack trace into the scratchpad. Why people make it: it is the default in a catch block. What actually happens: the model retries blindly and you leak internals. Better approach: ok, short body, retryable flag.",
    "Mistake: treat every tool like a read. Why people make it: the API looks the same. What actually happens: emails and refunds fire on retries. Better approach: policy before writes, plus an idempotency key.",
    "Mistake: trim old observations to save tokens. Why people make it: context is expensive. What actually happens: the model forgets it already looked it up and loops. Better approach: compact bodies, never delete the fact that a call happened.",
    "Mistake: use ReAct for a fixed three-step pipeline. Why people make it: 'agent' sounds more capable. What actually happens: extra cost, extra failure modes, harder tests. Better approach: write the workflow as a workflow.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "In one or two sentences, what is a ReAct loop?",
      answer:
        "What they are testing: can you explain the idea without framework names. Good answer: the model writes a thought, may call a tool, sees the result, and repeats until it answers or a stop rule fires. Why that is good: it names the cycle and the need to stop. Follow-up: what belongs in the scratchpad after one tool call?",
    },
    {
      difficulty: "medium",
      question: "A refund tool returns an error. The agent calls it again with the same arguments. How do you stop that?",
      answer:
        "What they are testing: cache, retryable errors, and write safety. Good answer: fingerprint the tool plus arguments and reuse the old result; mark this error not retryable; require an idempotency key so the payment system cannot double-charge. Why that is good: it fixes the loop and the side effect. Follow-up: when would you allow a second refund call?",
    },
    {
      difficulty: "hard",
      question: "When would you refuse to use ReAct and use a fixed plan instead?",
      answer:
        "What they are testing: trade-offs, not trivia. Good answer: when the path is known — classify, retrieve, answer — a workflow is cheaper, easier to test, and easier to pause. ReAct is for when the next tool depends on the last observation. Why that is good: it shows judgment. Follow-up: how would you mix both, a short plan with a ReAct step inside one node?",
    },
  ],

  glossary: [
    {
      term: "ReAct",
      meaning:
        "Reason and Act: a cycle where the model writes a thought, takes an action, sees the result, and repeats. Why it matters: it is the pattern under most agent SDKs.",
    },
    {
      term: "Scratchpad",
      meaning:
        "The growing notebook for one run: the goal, thoughts, tool calls, and results. Why it matters: if it is not written here, the model does not know it.",
    },
    {
      term: "Tool",
      meaning:
        "A function the model can call to read or change the outside world. Why it matters: tools are the only side effects; the model itself only writes text.",
    },
    {
      term: "Step budget",
      meaning:
        "A maximum number of turns before your code stops the loop. Why it matters: the model will not always volunteer to finish.",
    },
    {
      term: "Retryable error",
      meaning:
        "A structured flag that says whether calling the same tool again might work. Why it matters: a 409 on a refund is not a timeout; treating them the same causes double charges.",
    },
    {
      term: "Idempotency key",
      meaning:
        "A unique string that means 'this action, once'. Why it matters: a buggy loop can retry; the payment system should still only move money once.",
    },
  ],
};
