import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "openai-agents-sdk",
  instructor:
    "I am a senior engineer sitting next to you. We start from zero. If you have never written an agent loop, that is fine. We will first see what you would write by hand — a model call, a tool, a stop rule — and only then see how the OpenAI Agents SDK names those same pieces.",
  promise:
    "You will be able to explain Agent and Runner in plain English, build a small specialist with one tool and a typed answer, hand work to another agent without leaking write tools, put a check on the final answer, and read a trace when something goes wrong.",
  story: {
    title: "The refund that existed only in a sentence",
    body: [
      "A support team had a refund helper they wrote themselves. It was a loop: call the model, maybe run a tool, append the result, repeat. They were tired of maintaining that loop. They moved onto the OpenAI Agents SDK. The pitch was honest: named agents, a runner with a turn limit, and a dashboard of traces. Staging looked clean. They shipped on a Thursday.",
      "Saturday a customer asked to cancel and refund a mid-cycle subscription. A triage helper said 'this is billing' and passed the job along. The billing helper did not have the refund tool. That tool still lived on the old all-in-one helper, and nobody had copied it. The billing helper had a job and no way to do the job, so it wrote a sentence: your refund of 89 dollars has been processed, confirmation RF-44119. There was no RF-44119. There was no refund. The customer closed the ticket happy.",
      "Finance found the mismatch days later. Two hundred similar 'processed' replies had no matching ledger row. The runner had done exactly what it was told: run billing until it produced a final answer, then stop. Nobody had checked that a refund claim cited a real id from a tool. Tracing had been turned off in production 'to save cost'. The chat log looked like a successful conversation.",
      "The fix was mechanical. Billing got the refund tool and nothing else. A check after the answer rejected any refund sentence that did not include a tool-produced refund id. Handoffs stopped carrying other specialists' tool names in the transcript. Tracing went back on. The SDK had not failed. The team had treated an Agent object as a folder for prompts instead of an ownership boundary.",
    ],
    moral:
      "A handoff is a change of owner, not a change of scenery. If the receiving helper cannot perform the action you just promised, you have built a confident liar with a nicer class name.",
  },
  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "The problem: a loop you keep rewriting",
      body: [
        "Imagine you want an AI that can look something up, not just talk. The user asks a question. The model says it needs a tool. You run the tool. You paste the result back. You ask the model again. You repeat until it answers, or until you get tired.",
        "That repeat is a loop. In everyday language: look, decide, act, look again. Engineers write this loop over and over. Messages in, model call, branch on 'did it want a tool', run the tool, append the result, count the turns so it cannot run forever.",
        "The loop is not intelligence. It is glue. Glue is easy to get wrong. People forget the turn counter. People forget to stop when a tool fails. People forget to log what happened. Then Saturday arrives, and the chat log is the only record.",
        "Here is a tiny concrete example. User: refund order 88213. Turn 1: model asks to look up the order. Turn 2: model asks to issue a refund. Turn 3: model writes a confirmation. Three turns. Without a max-turn rule, a confused model can take thirty, and each one costs money.",
        "At this point you should understand the problem. We want the loop, the tool list, the stop rule, and the log — without rewriting them for every product. Next we will see how the Agents SDK names those pieces.",
      ],
      diagrams: [
        {
          title: "The loop you would write by hand",
          caption:
            "Five jobs. The SDK is names for these jobs, not a new kind of intelligence.",
          chart: chart(
            `flowchart TD
    User([User question]) --> Call[Call the model]
    Call --> Need{Did it want a tool}
    Need -->|yes| Tool[Run the tool]
    Tool --> Call
    Need -->|no| Answer([Final answer])
    Turns[Turn counter] -.->|too many| Stop([Stop])
    Call -.-> Turns`,
            `class User,Answer,Stop hub
    class Call,Tool grp1
    class Need grp2
    class Turns grp3`
          ),
        },
      ],
    },
    {
      id: "five-nouns",
      level: "beginner",
      title: "What the SDK is: five nouns",
      body: [
        "Let's name the pieces in plain English first. Then we will use the official words.",
        "There is a job description: what this helper is for, which tools it may use, what a finished answer looks like. The SDK calls that an Agent. An Agent is configuration. It does not run by itself. It is a recipe, not a cook.",
        "There is something that actually runs the loop. The SDK calls that the Runner. The Runner is the cook. It takes an Agent, takes the user input, and repeats model-and-tool turns until it is done or the turn limit hits.",
        "There is a pass to another job description. We already learned this word in Swarm: a handoff. In the SDK it is a first-class object, not just a function return. The Runner swaps which Agent is active.",
        "There are checks that do not trust the model. A check before the model sees the input, and a check after it writes the output. The SDK calls these guardrails. If a guardrail trips, the run stops even if the model wanted to continue.",
        "There is a log of the whole run: which agent was active, which tool ran, what the guardrail said. The SDK calls this a trace. At this point you should be able to point at those five nouns: Agent, Runner, handoff, guardrail, trace. The rest of the sitting is those nouns in motion.",
      ],
      diagrams: [
        {
          title: "Five nouns, before any API",
          caption:
            "The recipe does not run itself. The cook runs the recipe. Checks and a log sit around the loop, not inside the model's head.",
          chart: chart(
            `flowchart TD
    User([User input]) --> InCheck[Input guardrail]
    InCheck --> Cook[Runner]
    Cook --> Recipe[Agent recipe]
    Recipe --> Cook
    Cook --> Tool[Tool]
    Tool --> Cook
    Cook --> Swap[Handoff]
    Swap --> Cook
    Cook --> OutCheck[Output guardrail]
    OutCheck --> Done([Final answer])
    Cook -.-> Log[(Trace)]`,
            `class User,Done hub
    class Cook,Recipe,Tool,Swap grp1
    class InCheck,OutCheck grp2
    class Log grp3`
          ),
        },
      ],
    },
    {
      id: "simplest-agent",
      level: "beginner",
      title: "The simplest version: one agent, one tool, one answer shape",
      body: [
        "Let's build the smallest useful Agent. It looks up a subscription. It returns a small object, not a free-form paragraph. We do this before we talk about handoffs, because a handoff to a helper with no contract is how the story invented RF-44119.",
        "What are we trying to do? Make 'the helper is done' mean 'we got data that matches a shape', not 'the model felt finished'.",
        "Here is the smallest version.",
        "Let's understand what just happened. Agent is a name, instructions, tools, and an output type. Runner.run is the loop. max_turns is the stop rule you control. output_type is a contract: the run is not finished until the value matches, or the turn budget is gone.",
        "Instructions should read like a job posting, not a novel. What this helper does. What it refuses. What done looks like. Every extra sentence is present on every turn, which is how a long 'you are a world-class expert' preface shows up on the bill.",
        "At this point you should understand: you do not 'start' an Agent. You ask a Runner to run one. If you find yourself stuffing the current user onto the Agent object, you have put session state in the recipe instead of in the run.",
      ],
      codes: [
        {
          title: "lookup_agent.py — config plus a runner",
          language: "python",
          code: `from pydantic import BaseModel
from agents import Agent, Runner, function_tool


class Lookup(BaseModel):
    plan: str
    remaining_cents: int


@function_tool
def lookup_sub(sub_id: str) -> dict:
    return {"plan": "pro", "remaining_cents": 8900}


billing = Agent(
    name="billing-lookup",
    instructions="Look up the subscription. Do not invent ids.",
    tools=[lookup_sub],
    output_type=Lookup,
)

# result = await Runner.run(billing, "lookup sub_19", max_turns=4)`,
        },
      ],
    },
    {
      id: "handoff-is-ownership",
      level: "intermediate",
      title: "Implement a handoff as a change of owner",
      body: [
        "Now we add a second Agent. A triage helper reads the user and decides 'this is billing'. It hands off. Remember from Swarm: a handoff moves who is in charge. In the SDK the same idea is an object on the Agent, not a function that returns another Agent.",
        "What are we trying to do? Make sure the receiving Agent actually owns the tools for the job it was just given.",
        "Here is the smallest version.",
        "Let's understand what just happened. triage may hand off to billing. billing has issue_refund. triage does not. After the swap, the Runner runs billing. If billing has no refund tool, we are back in the story: the model will write a confirmation because that is the only way it can 'finish'.",
        "Name agents like services. The name shows up in traces and in incident channels. 'Assistant' is how you get a page that says the assistant failed and a forty-minute hunt. 'billing-refunds' is how you grep and land on the right span.",
        "One giant Agent with every tool plus a paragraph saying when to use each tool is the old loop with extra objects. The SDK's point is that billing should not even see cancel_subscription if cancel is someone else's job. A missing tool is a real constraint. A sentence that says 'do not call X' is a suggestion.",
      ],
      codes: [
        {
          title: "handoff.py — the receiver must own the write",
          language: "python",
          code: `from agents import Agent, function_tool


@function_tool
def issue_refund(sub_id: str) -> dict:
    return {"refund_id": "re_441", "cents": 8900}


billing = Agent(
    name="billing-refunds",
    instructions="Refund only after a real refund_id exists.",
    tools=[issue_refund],
)

triage = Agent(
    name="triage",
    instructions="If the user wants money moved, hand off to billing.",
    handoffs=[billing],
)`,
        },
      ],
      diagrams: [
        {
          title: "Handoff swaps the active recipe",
          caption:
            "The Runner stays. The Agent changes. Tools change with it.",
          chart: chart(
            `flowchart TD
    User([User input]) --> Triage[Triage agent]
    Triage --> Swap[Handoff]
    Swap --> Billing[Billing agent]
    Billing --> Tool[issue_refund]
    Tool --> Billing
    Billing --> Out([Typed final output])`,
            `class User,Out hub
    class Triage,Billing,Swap grp1
    class Tool grp3`
          ),
        },
      ],
    },
    {
      id: "guardrails",
      level: "intermediate",
      title: "When the simple version is not enough: checks the model does not get a vote on",
      body: [
        "The simple Agent-plus-handoff design still trusts the model's final sentence. That is how RF-44119 was born. We need a check that runs after the model speaks, in our code, not in the model's honesty.",
        "A guardrail is that check. Input guardrails run before the model sees the user text — for example, 'this looks like a prompt injection, stop'. Output guardrails run after the model produces an answer — for example, 'this sentence claims a refund but there is no refund_id from a tool, stop'.",
        "They look similar to instructions because both say 'do not do X'. The important difference is who enforces it. Instructions are a request to the model. A guardrail is an if-statement in your process. If it trips, the run ends. The model does not get a second vote.",
        "What are we trying to do? Reject a refund claim that is only words.",
        "Here is the smallest version.",
        "Let's understand what just happened. The check does not ask the model 'are you sure?'. It looks at two facts: the words, and the tool results. If the words mention a refund and the tools do not, the tripwire fires. Quality taste-tests belong later. Inside the run, keep gates cheap and mechanical.",
      ],
      codes: [
        {
          title: "guardrail.py — words are not a ledger",
          language: "python",
          code: `def refund_claim_ok(text: str, refund_ids: list[str]) -> bool:
    claims_refund = "refund" in text.lower()
    if not claims_refund:
        return True
    return any(rid in text for rid in refund_ids)


assert refund_claim_ok("Refund re_441 is done.", ["re_441"])
assert refund_claim_ok("Refund RF-44119 is done.", []) is False`,
        },
      ],
    },
    {
      id: "trace-the-run",
      level: "intermediate",
      title: "How the pieces connect: a run you can replay",
      body: [
        "In a real application the pieces are: the user's message, optional input checks, the Runner loop, tool calls, optional handoffs, an output check, and a trace that records all of it. If you can find those in a failing run, you can debug any Agents SDK system you are handed.",
        "A trace is the log of one run, as a tree. Each span is a turn, a tool, a handoff, or a guardrail. You want this on in production. A dashboard you only enable in staging is a costume. The story's only record was the chat log, which cannot tell you that issue_refund was never called.",
        "Session is the memory across turns with the same user. The Agent still does not remember. The session does. If you start a new session on every HTTP retry, you get the Swarm retry bug again: a second refund with a new key. Use a stable id, usually the ticket id.",
        "When not to start here. If your product is one model call and no tools, the SDK is ceremony. If your control flow is a graph with pauses overnight, you want a workflow engine, not a prettier while-loop. If you are on Gemini, you want Google's kit. Use this SDK when you are on OpenAI models, you want a first-party loop, and your multi-agent story is 'triage then specialist'.",
        "At this point you should be able to walk a request from the user to the final output and say which noun is responsible at each step.",
      ],
      diagrams: [
        {
          title: "Five nouns, one run",
          caption:
            "The Agent never executes. The Runner does. Guardrails can halt either side of the model.",
          chart: chart(
            `flowchart TD
    User([User input]) --> InG{Input guardrail}
    InG -->|trip| Halt([Halt])
    InG -->|pass| Run[Runner turn]
    Run --> Model[Active agent]
    Model --> Need{Tool, handoff, or final}
    Need -->|tool| Tool[function_tool]
    Tool --> Run
    Need -->|handoff| Swap[Swap active agent]
    Swap --> Run
    Need -->|final| OutG{Output guardrail}
    OutG -->|trip| Halt
    OutG -->|pass| Done([Final output])
    Trace[Trace tree] -.-> Run`,
            `class User,Halt,Done hub
    class Run,Model,Tool,Swap grp1
    class InG,Need,OutG grp2
    class Trace grp3`
          ),
        },
      ],
    },
    {
      id: "failure-modes",
      level: "advanced",
      title: "What goes wrong after a handoff",
      body: [
        "Remember the simple happy path: triage hands to billing, billing calls issue_refund, the output check sees a real id. Now look at the same path when it fails.",
        "The simple version breaks when the receiving Agent is missing the write tool. The Runner still wants a final output. The model invents one. That is the story. The fix is not a longer prompt. The fix is: the tool is on the object, and the output check requires a tool-produced id.",
        "It also breaks when the transcript still contains other specialists' tool names. Billing can role-play Tech and 'call' a tool it does not have, then narrate success. An input filter on the handoff that strips other agents' tool names makes that harder.",
        "A third break: max_turns is unset and you inherit a default larger than your wallet. The SDK hid the loop, which is the point, and also how you forget the loop exists. Set the number from the longest legitimate trace you have, plus some slack. When it trips, say so honestly. Do not return a half-answer as if the helper finished.",
        "Thought experiment. The tool times out. What should the agent do? It cannot continue as if the refund succeeded. Catch the failure at the tool boundary, return a small structured error with retryable=false for a 404 and retryable=true for a 503, and let the output check still demand a real id before any success sentence.",
      ],
      diagrams: [
        {
          title: "The missing tool path",
          caption:
            "No tool observation means the output guardrail must fail the run.",
          chart: chart(
            `flowchart TD
    Handoff[Handoff to billing] --> Has{Has issue_refund}
    Has -->|yes| Call[Call tool]
    Call --> Id[refund_id in observation]
    Id --> Ok([Pass output check])
    Has -->|no| Prose[Model writes a confirmation]
    Prose --> Trip([Guardrail trips])`,
            `class Handoff,Ok,Trip hub
    class Call,Id,Prose grp1
    class Has grp2`
          ),
        },
      ],
    },
    {
      id: "when-to-leave",
      level: "advanced",
      title: "Production judgment: keep the SDK, or go back to a loop you can see",
      body: [
        "Remember the simple pitch: less glue to get wrong. That remains true when your product is triage-then-specialist, OpenAI models, and a request that can finish in one HTTP call.",
        "The simple version breaks when you need to pause overnight, wait for a human, or fan a graph of steps with a checkpointer. The Runner is still a while-loop with a nicer API. Forcing that loop to pretend it is a durable workflow will hurt. Leave, and take the ownership model with you: one speaker, narrow tools, mechanical checks, a trace.",
        "It also breaks when the team cannot see the loop. I have watched people add a second retry layer 'around' Runner.run, plus the SDK's own retries, plus the tool's retries, and then wonder why a 429 became nine refunds. Count the loops. There should be one budget you can name.",
        "When you stay, production looks like this: tracing on, max_turns set, output guardrails on money claims, session id = ticket id, write tools only on the specialist that is allowed to use them, and a test that a billing handoff without issue_refund cannot emit a success sentence.",
        "What are we trying to do? Count the loops so a 429 cannot become nine refunds. Here is the smallest version of that count.",
        "At this point you should be able to say: the SDK is Swarm grown up. The extra nouns — guardrails and traces — only help if you turn them on and treat Agent as an ownership boundary.",
      ],
      codes: [
        {
          title: "one_budget.py — name the loop you will retry",
          language: "python",
          code: `def run_once(ticket_id: str) -> dict:
    # One Runner.run. No extra retry wrapper.
    return {"ticket_id": ticket_id, "max_turns": 6}


assert run_once("tkt_19")["max_turns"] == 6`,
        },
      ],
    },
  ],
  workedExample: {
    title: "Cancel and refund sub_19",
    setup:
      "A customer asks to cancel and refund. You have triage and billing. Only billing may refund. A success sentence must contain a refund_id from the tool.",
    walkthrough: [
      "Step 1 — Understand the problem. The user wants money moved. The helper that talks first is not the helper that should write to the ledger.",
      "Step 2 — Identify the relevant concept. This is a handoff plus an output check. Agent is the recipe. Runner is the loop.",
      "Step 3 — Build the simplest solution. triage.handoffs = [billing]. billing.tools = [issue_refund]. billing.output_type is a small object with refund_id.",
      "Step 4 — Improve it. Add an output guardrail: if the text claims a refund and refund_id is missing, trip. Set max_turns to 6.",
      "Step 5 — Handle a failure. If issue_refund is missing, the guardrail fails the run instead of inventing RF-44119. If the tool 503s, return retryable=true once, then halt.",
      "Step 6 — Production version. Session id is the ticket id. Tracing is on. The route, not the model, is the last door before the ledger.",
    ],
    result:
      "Billing cannot 'finish' with a story. A refund sentence without a tool id never leaves the run.",
  },
  practice: {
    title: "The specialist who cannot refund",
    task:
      "Triage hands off to billing. Billing has no issue_refund tool and currently replies 'refunded, RF-44119'. You cannot add a paragraph of instructions as the fix. What three mechanical changes do you make, and what do you assert in a test?",
    hint:
      "Think about ownership, the contract of 'done', and a check the model does not vote on. A common wrong approach is asking the model to 'only confirm after using tools'.",
    solution:
      "Put issue_refund on billing and only on billing. Give billing an output type that includes refund_id. Add an output guardrail that trips when the answer claims a refund without a tool-produced id. Test: a run where the tool is stubbed out must not produce a success sentence; a run where the tool returns re_441 must include re_441. Why this works: you made the lie unreachable. The common wrong approach is a longer prompt. Prompts are requests. Guardrails and tool lists are constraints.",
  },
  takeaways: [
    "An Agent is a recipe — instructions, tools, handoffs, output type. A Runner is the loop that cooks. Do not mix those up.",
    "A handoff changes which recipe is active, including which tools exist. If the receiver cannot do the job, it will invent a finished sentence.",
    "output_type turns 'done' into a shape. A free-form string is a shrug.",
    "Guardrails are if-statements. Instructions are suggestions. Money claims need the first kind.",
    "A trace you only enable in staging cannot explain a Saturday incident.",
    "The SDK is the right default for triage-then-specialist on OpenAI models. Leave it when you need a durable graph, and take the ownership model with you.",
  ],
  mistakes: [
    "Mistake: treating Agent as a running process. Why people make it: the word agent sounds alive. What actually happens: per-user state gets stuffed onto a shared recipe. Better approach: session on the run, Agent stays config.",
    "Mistake: handing off to a specialist that lacks the write tool. Why people make it: the old monolith had every tool. What actually happens: the model invents a confirmation. Better approach: tool lists are the ownership boundary.",
    "Mistake: no output check on money sentences. Why people make it: the demo looked fine. What actually happens: RF-44119. Better approach: trip if a refund claim has no tool id.",
    "Mistake: one giant Agent and a paragraph of routing rules. Why people make it: fewer objects. What actually happens: the model can see tools it should not. Better approach: narrow specialists.",
    "Mistake: turning traces off in production. Why people make it: cost. What actually happens: the chat log becomes the incident record. Better approach: keep traces, sample if you must.",
    "Mistake: wrapping Runner.run in another retry loop. Why people make it: 'just to be safe'. What actually happens: one 429 becomes many side effects. Better approach: one named budget.",
  ],
  interviews: [
    {
      question: "What is the difference between an Agent and a Runner in the OpenAI Agents SDK?",
      difficulty: "easy",
      answer:
        "An Agent is configuration: instructions, tools, handoffs, output type. It does not execute. A Runner runs an Agent: it is the loop with max_turns. What they want: you do not think the Agent is a process. Follow-up: can two Runners share one Agent object? Yes, because it is immutable config.",
    },
    {
      question:
        "A billing specialist handed a refund request replies that the refund is done, but the ledger is empty. Walk the debug.",
      difficulty: "medium",
      answer:
        "Open the trace. Check whether issue_refund was called. If there is no tool span, the Agent lacked the tool or never chose it. Then check the output guardrail: if none exists, the sentence was allowed to leave. Fix: put the tool on billing, require refund_id in the output type, trip if the claim has no id. Follow-up: why not just prompt 'do not lie'? Because instructions are not enforced.",
    },
    {
      question: "When would you delete the Agents SDK and go back to raw Completions or a graph?",
      difficulty: "hard",
      answer:
        "Delete it for one-shot calls with no tools — the objects are ceremony. Leave it for durable workflows with human pauses and a checkpointer — the Runner is still a while-loop. Keep it for OpenAI, tools, triage-then-specialist, one request. The trade-off is visibility versus glue. Follow-up: what do you take with you either way? One owner, narrow tools, mechanical output checks, a trace, a turn budget.",
    },
  ],
  glossary: [
    {
      term: "Agent",
      meaning:
        "A recipe: name, instructions, tools, optional handoffs, optional output type. It does not run. Why it matters: people treat it like a living process and put session state on it.",
    },
    {
      term: "Runner",
      meaning:
        "The loop that executes an Agent until a final output, a guardrail trip, or max_turns. Why it matters: this is where the budget lives.",
    },
    {
      term: "Handoff",
      meaning:
        "A swap of which Agent the Runner is executing, including which tools exist. Why it matters: the receiver must own the side effect you just promised.",
    },
    {
      term: "Guardrail",
      meaning:
        "A check in your code before input reaches the model or after output is produced. Why it matters: unlike instructions, it can stop the run.",
    },
    {
      term: "Trace",
      meaning:
        "The structured log of one run — turns, tools, handoffs, guardrails. Why it matters: without it, the chat log is your only incident record.",
    },
    {
      term: "output_type",
      meaning:
        "A schema the final answer must match before the run is considered done. Why it matters: it turns 'the model felt finished' into a contract.",
    },
  ],
};
