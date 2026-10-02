import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "tool-contracts",
  instructor:
    "I am a senior engineer who has watched more agents fail at the tool boundary than inside the model. I teach contracts the way I teach APIs: names, shapes, and what happens twice.",
  promise:
    "You will go from thinking a tool is 'a function the model calls' to writing a small contract: a clear name, a tight schema, a safe error, and a rule for retries.",

  story: {
    title: "The tool that cancelled the wrong subscription",
    body: [
      "A billing team added a helper that could look up a customer and cancel a subscription. The tool was named cancel. Its description said 'cancels things'. The only argument was a free-text query. In the demo, someone typed a customer email, the model guessed the right id, and the subscription vanished on cue.",
      "In the second week the helper cancelled eleven subscriptions that nobody had asked to cancel. The traces were almost funny if they had not been real. A user said 'cancel my extra seat'. The model called cancel with query 'extra'. The backend's search returned the first subscription that matched the word extra in a plan name. That plan belonged to a different person in the same tenant.",
      "A second failure hid behind the first. When the backend timed out, the model called cancel again. The first call had actually succeeded. The second call found the next search hit. Two cancellations, one human sentence.",
      "The fix was a contract, not a warmer prompt. The tool was renamed cancel_subscription. It required a real subscription_id with a strict pattern. Search became its own read-only tool. Errors said 'not found' or 'already cancelled' instead of a stack trace. A one-time key meant the same cancel could not fire twice for the same ticket. The model got less freedom. The customers got their subscriptions back.",
    ],
    moral:
      "A tool is an API whose client is a guesser. The contract has to be tight enough that a guess cannot cancel the wrong thing.",
  },

  stages: [
    {
      id: "what-a-tool-is",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "When an AI helper 'does something', it is not doing magic. It is asking your code to run a function. That function is a tool. lookup_order is a tool. cancel_subscription is a tool. send_email is a tool.",
        "The problem is who the caller is. A normal API is called by a program you wrote, or by a person clicking a button. A tool is called by a model that is sampling the next token. It will invent ids. It will omit fields. It will call the same function twice because it is not sure the first time worked.",
        "Here is the simplest example. You expose add(a, b). The model wants 3 + 4. If the tool accepts any string, you will get a='three', b='4'. Your function throws. The model retries with different junk. Nobody added 7.",
        "So we need a contract: a written agreement about the name, the inputs, the outputs, and the errors. We write that agreement for a caller who is talented and unreliable. That is a different design than an API for a careful human.",
        "A contract is not a legal document. It is the schema, the description, the side-effect rules, and the error list. If any of those are sloppy, the model will find the hole. The story's cancel tool had a hole the size of a search box.",
        "At this point you should understand the problem: tools fail at the boundary, not in the poetry of the prompt. We will tighten that boundary one piece at a time.",
      ],
      diagrams: [
        {
          title: "Four surfaces, all part of the contract",
          caption:
            "The model sees the name, description, and input shape. Your code owns the output and the side effect.",
          chart: chart(
            `flowchart TD
    Model([Model]) --> Name[Name and description]
    Name --> Args[Input shape]
    Args --> Code[Your function]
    Code --> Out[Output shape]
    Code --> World[Side effect]`,
            `class Model,World hub
    class Name,Args grp1
    class Code,Out grp2`
          ),
        },
      ],
    },
    {
      id: "name-and-description",
      level: "beginner",
      title: "The name is the first prompt",
      body: [
        "The model picks a tool mostly from the name, then the description, then the argument names. That is why cancel was a disaster. It matched every sentence with the word cancel. cancel_subscription only matches a subscription.",
        "Write the name like a careful verb_noun. refund_order. search_handbook. send_receipt_email. Include the object. If two tools could share a verb, the noun is doing the real work.",
        "Write the description for a new teammate with thirty seconds. What it does. What it does not do. What it returns. 'Searches things' will be called for everything. 'Full-text search over the company handbook; returns up to five passages; does not cover customer data' will be skipped when the user asks about an invoice.",
        "Do not put orders to the model in the description. 'Always call this before answering' is a tool author trying to hijack your system prompt. Describe capability, not behaviour. If you need a step to always happen, put it in your code so it is not optional.",
        "Here is a tiny comparison. Bad: name search, description 'search'. Good: name search_handbook, description as above. Same backend. Different model behaviour. The contract started working before you wrote a smarter loop.",
        "Connect this back to MCP. A poisoned description is this same surface used as an attack. Even when you trust the author, a vague description is an accidental attack on your own accuracy.",
      ],
    },
    {
      id: "schema-shape",
      level: "beginner",
      title: "How the simplest schema works",
      body: [
        "A schema is a description of allowed inputs. Think of a form: these fields exist, this one is required, this one must be a number, this one must be one of three words. When you use native tool calling, the model is steered toward filling that form.",
        "Required fields should be truly required. Optional fields should have a default in your code, not in the model's imagination. If the model must invent a value to proceed, it will invent a confident one.",
        "Use a closed list when the values are known. An enum of open, closed, pending is a hard fence. A sentence that says 'one of: open, closed, pending' is a suggestion. Models wander off suggestions.",
        "Name fields so the unit is obvious. amount_cents is better than amount. subscription_id is better than id. query is almost always too wide; it is how 'extra' cancelled a stranger's plan.",
        "What are we trying to do? Replace a search box with a real id. Here is the smallest version.",
        "Let's understand what just happened. The bad tool invited a sentence. The good tool invited an id that looks like sub_... and a reason from a short list. Wrong customers become hard to name by accident. Sense checks still belong in the function: the id can be well-shaped and still belong to someone else.",
      ],
      codes: [
        {
          title: "The same tool, loose then tight",
          language: "python",
          code: `# Loose — the story
# cancel(query: str)

# Tight — the fix
from typing import Literal

def cancel_subscription(
    subscription_id: str,          # pattern: ^sub_[a-z0-9]+$
    reason: Literal["user_request", "duplicate", "fraud"],
) -> dict:
    if not subscription_id.startswith("sub_"):
        return {"ok": False, "code": "bad_id", "retryable": False}
    return {"ok": True, "subscription_id": subscription_id, "status": "cancelled"}`,
        },
      ],
      diagrams: [
        {
          title: "Narrow the form on purpose",
          caption:
            "Every extra free-text field is a place the model can be creatively wrong.",
          chart: chart(
            `flowchart TD
    Wide[query: any string] --> Guess[Model guesses an id]
    Guess --> Wrong[Wrong row cancelled]
    Narrow[subscription_id plus reason] --> Check[Shape check]
    Check --> Fn[Function runs]
    Fn --> Right[Named subscription only]`,
            `class Wide,Wrong hub
    class Guess,Check,Fn grp1
    class Narrow,Right grp2`
          ),
        },
      ],
    },
    {
      id: "side-effects",
      level: "intermediate",
      title: "Reads and writes are different tools",
      body: [
        "Before you design a tool, ask: does this change the world? If no, it is a read. You can retry it. You can cache it. If yes, it is a write. Retries can double a charge, a cancel, or an email.",
        "A useful middle class is idempotent write: doing it twice is the same as doing it once. Setting a status to cancelled is often like this, if the backend agrees. Issuing a new refund is usually not, unless you send a one-time key.",
        "They look similar because both are functions. The important difference is the cost of a duplicate. Classify each tool in a registry your runtime can read: read, idempotent write, or one-shot write. The loop from the ReAct lesson should treat those classes differently.",
        "Search and cancel must be two tools. Combining them — 'process this return' that looks up and refunds — hides a write inside a fuzzy read. The model cannot tell which part failed. You cannot cache the read without risking the write. Split them.",
        "What are we trying to do? Mark the class on the tool so the loop can enforce it. Here is the smallest version.",
      ],
      codes: [
        {
          title: "A registry that knows which tools write",
          language: "python",
          code: `TOOLS = {
    "lookup_subscription": {"fn": lookup, "class": "read"},
    "cancel_subscription": {"fn": cancel, "class": "write_once"},
}

def may_run(name: str, args: dict, cache: dict, policy) -> str | None:
    spec = TOOLS[name]
    if spec["class"] != "read" and not policy.allows(name, args):
        return "denied"
    key = (name, tuple(sorted(args.items())))
    if spec["class"] == "write_once" and key in cache:
        return "already_ran"
    return None`,
        },
      ],
    },
    {
      id: "idempotency-and-errors",
      level: "intermediate",
      title: "Doing it twice, and talking about failure",
      body: [
        "Idempotency is a long word for a simple deal: the same request cannot have twice the effect. You send a key that means 'this ticket, this cancel'. The backend stores the key. A second call with the same key returns the first result.",
        "Derive the key from things the user already has — ticket id, subscription id, action name — not from a random value the model invents each turn. A random key on every retry is no key at all.",
        "Errors are the other half of the contract. 'It blew up' is not an error the model can use. Give a small code, a short message, and whether retrying is allowed. not_found, already_cancelled, timed_out, denied. The model can change arguments on not_found. It must stop on already_cancelled. It may retry timed_out once.",
        "Never return a stack trace. It is huge, it leaks paths and table names, and it teaches the model nothing. Your error string is a prompt. Write it as one.",
        "Let's understand the story again. Timeout plus a vague error plus no key produced a second cancel on a different row. A structured timeout, a key on the first row, and a search tool that cannot write would have stopped all three parts.",
      ],
      diagrams: [
        {
          title: "Error to next move",
          caption:
            "The code on the error is what the model uses. If you omit it, the model guesses the optimistic way.",
          chart: chart(
            `flowchart TD
    Fail[Tool fails] --> Code{Error code}
    Code -->|not_found| Change[Change arguments or ask the user]
    Code -->|already_done| Stop[Finish, do not retry]
    Code -->|timed_out| Once[Retry once]
    Code -->|denied| Halt([Halt: policy])
    Once --> StopWait{Worked?}
    StopWait -->|no| HaltTime([Halt: give up])`,
            `class Fail,Halt,HaltTime hub
    class Code,StopWait grp1
    class Change,Stop,Once grp2`
          ),
        },
      ],
      codes: [
        {
          title: "A key you can derive twice",
          language: "python",
          code: `import hashlib

def derive_key(ticket_id: str, action: str, subscription_id: str) -> str:
    material = f"{ticket_id}:{action}:{subscription_id}"
    return hashlib.sha256(material.encode()).hexdigest()[:24]

def cancel_once(ticket_id: str, subscription_id: str, reason: str) -> dict:
    key = derive_key(ticket_id, "cancel", subscription_id)
    return billing.cancel(subscription_id, reason=reason, idempotency_key=key)`,
        },
      ],
    },
    {
      id: "gateway",
      level: "intermediate",
      title: "How the pieces connect: one door in",
      body: [
        "In a real app the model should not call your functions directly. It talks to a gateway: one function that checks the name is allowed, the arguments match the schema, the policy agrees, the cache, then runs the tool and shapes the result. The agent being wrong is not sufficient to cancel a seat.",
        "Put tenant identity in the session, not in the schema. If tenant_id is an argument, a prompt can ask for another tenant. You saw this in the MCP lesson. The same rule applies to a plain Python tool.",
        "Keep the tool list short. Ten sharp tools beat thirty overlapping ones. Models pick worse as the menu grows. If two tools do the same job with different names, the model flip-flops and your traces become noise.",
        "Validate sense inside the function after shape is valid. The id looks right but is not in this tenant. The amount is an integer but ten times too large. Shape is the provider's job. Sense is yours.",
        "At this point you should be able to review a tool by reading four things: name, schema, side-effect class, error list. If any is missing, the contract is unfinished.",
      ],
      diagrams: [
        {
          title: "One path, ordered checks",
          caption:
            "Unknown name, bad shape, denied policy, and duplicate writes never reach the backend.",
          chart: chart(
            `flowchart TD
    Call([Model call]) --> Known{Known tool?}
    Known -->|no| ErrName[unknown_tool]
    Known -->|yes| Shape{Schema ok?}
    Shape -->|no| ErrShape[bad_arguments]
    Shape -->|yes| Policy{Policy ok?}
    Policy -->|no| ErrPol[denied]
    Policy -->|yes| Dup{Write already done?}
    Dup -->|yes| Cached[Return first result]
    Dup -->|no| Run[Run function]`,
            `class Call,Run hub
    class Known,Shape,Policy,Dup grp1
    class ErrName,ErrShape,ErrPol,Cached grp2`
          ),
        },
      ],
    },
    {
      id: "fewer-tools",
      level: "advanced",
      title: "Fewer, sharper tools",
      body: [
        "The simple version is one tool per backend endpoint. That maps your org chart onto the model. The model does not share your org chart. It shares the user's intent.",
        "Consolidate along intent, not along services. The user wants 'cancel this extra seat'. They do not want 'call customers-service then subscriptions-service then audit-service'. A single cancel_subscription that does the internal hops, with a tight schema, beats three tools the model must sequence.",
        "Do not consolidate a read and a write. That is the 'process this return' trap. The sharp tool still does one kind of side effect.",
        "Measure selection. If traces show the wrong tool more than a few percent of the time, the names overlap or the menu is too long. Splitting a mega-tool that takes a command string is usually the fix in the other direction: you hid a second menu inside a string, and schemas cannot help you.",
        "Trade-off: fewer tools means more logic inside each function. That is fine. Logic in your code is testable. Logic in a command string the model writes is not.",
      ],
    },
    {
      id: "evolve-and-gateway",
      level: "advanced",
      title: "Changing a contract without breaking the helper",
      body: [
        "Once a model has learned a name and a field, changing them is a breaking change for a non-human client. Add optional fields with defaults. Do not rename a required field in place. Do not remove an enum value that traces still show.",
        "Version if you must break: cancel_subscription_v2, run both, watch which one is called, then remove v1. A prompt that says 'the old field is deprecated' is not a migration.",
        "Approval must not be an argument. If the schema has approved_by, the model can fill it. Approval is a token your gateway holds, bound to a fingerprint of these exact arguments, after a human said yes. That idea returns in the human-in-the-loop lesson.",
        "When not to add a tool: if the model should never choose it. Logging, metrics, and 'always fetch the user' belong in your code. Tools are for choices. Hidden mandatory work is not a choice.",
        "The person who can teach this now says: a tool contract is a small API for a guesser. Tight names, tight forms, honest errors, write classes, keys for duplicates, one gateway. The prompt is the least interesting part.",
      ],
      diagrams: [
        {
          title: "Safe change versus a break",
          caption:
            "Add optional fields. Do not rename a required one in place. A prompt is not a migration.",
          chart: chart(
            `flowchart TD
    Old[cancel_subscription v1] --> Add[Add optional note] 
    Add --> Same([Same name, still works])
    Old --> Rename[Rename subscription_id]
    Rename --> Break([Old traces and prompts miss])
    Old --> V2[Add cancel_subscription_v2]
    V2 --> Watch[Run both, then remove v1]`,
            `class Old,Same,Break hub
    class Add,V2,Watch grp1
    class Rename grp3`
          ),
        },
      ],
      codes: [
        {
          title: "Approval is not a field the model may type",
          language: "python",
          code: `def gateway_write(name, args, session, approval_token=None):
    spec = TOOLS[name]
    if spec["class"] == "write_once" and needs_approval(name, args):
        if not token_matches(approval_token, name, args):
            return {"ok": False, "code": "needs_approval", "retryable": False}
    return spec["fn"](**args)`,
        },
      ],
    },
  ],

  workedExample: {
    title: "Redesign a 'process this return' tool that fails often",
    setup:
      "One tool named process_return takes a free-text order_ref and a string action. Thirty percent of calls cancel the wrong line or double-refund. You may split tools.",
    walkthrough: [
      "Step 1 — Understand the problem. One tool mixes search, decide, and write. Errors are raw. Retries repeat the write.",
      "Step 2 — Identify the relevant concept. A contract per side-effect class: a read to find the order, a write to refund, tight schemas, structured errors, a key.",
      "Step 3 — Build the simplest split. lookup_order(order_id) and refund_order(order_id, amount_cents, reason). Reject free text.",
      "Step 4 — Improve it. Enum for reason. amount_cents with a ceiling. Pattern on order_id. lookup is cacheable. refund is write_once.",
      "Step 5 — Handle a failure. Timeout on refund returns retryable true once, same derived key. already_refunded is not retryable. Wrong tenant is denied, not 'try another id'.",
      "Step 6 — Production. Gateway validates schema and policy. Tenant from session. Approval token for amounts over a limit. Traces store the tool class and the key.",
    ],
    result:
      "The model can look up, then refund a named order once. The thirty percent 'wrong line' class becomes a bad id error instead of a silent cancel.",
  },

  practice: {
    title: "Design a credit tool that cannot leak or double-charge",
    task:
      "You need issue_account_credit. It must take enough for the model to act, and not enough to steal. Problem: list the fields you accept, the field you refuse, the side-effect class, and the output. Think about: tenant, amount units, approval, and retries.",
    hint:
      "Units in the name. Closed reason list. No tenant_id argument. No approver name the model can type. Expected reasoning: write_once plus a key from ticket id.",
    solution:
      "Accept account_id (pattern), amount_cents (bounded integer), reason (enum), ticket_id (pattern). Refuse tenant_id and approver. Class write_once. Output: credit_id, account_id, amount_cents, status. Why this works: identity and approval arrive from the session and the gateway, not from tokens the model invented. Common wrong approach: a single note: str field 'so the model can explain'. That field becomes a command channel.",
  },

  takeaways: [
    "A tool is an API called by a guesser. Design the form for a guesser, not for a careful human.",
    "The name and description are the first prompt. Verb plus object, and say what the tool does not do.",
    "A tight schema — required fields, enums, units in names — prevents more failures than a cleverer model.",
    "Reads may retry. Writes need a class, a policy check, and often a one-time key.",
    "Errors need a code, a short message, and a retryable flag. Stack traces are not part of the contract.",
    "One gateway should validate name, shape, policy, and duplicates before your backend runs.",
  ],

  mistakes: [
    "Mistake: one free-text query that searches and writes. Why people make it: fewer tools feels simpler. What actually happens: the wrong row is changed. Better approach: a read tool and a write tool with real ids.",
    "Mistake: name a tool cancel or process. Why people make it: short names look clean. What actually happens: the model calls it for every vague verb. Better approach: verb_noun that names the object.",
    "Mistake: put 'always call this' in the description. Why people make it: it works in a demo. What actually happens: it fights your real instructions. Better approach: mandatory work in code.",
    "Mistake: retry every error. Why people make it: retries fix timeouts. What actually happens: already-cancelled becomes a second cancel on another row. Better approach: retryable on the error, keys on the write.",
    "Mistake: tenant_id as an argument. Why people make it: explicit is good. What actually happens: injection picks another tenant. Better approach: session identity.",
    "Mistake: thirty overlapping tools. Why people make it: one per microservice. What actually happens: the model picks the wrong sibling. Better approach: fewer tools along user intent, still one side-effect class each.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "Why is cancel a bad tool name?",
      answer:
        "What they are testing: naming as a prompt. Good answer: it matches too many user sentences; cancel_subscription says the object. Why that is good: it is concrete. Follow-up: what would you write in the description's 'does not' sentence?",
    },
    {
      difficulty: "medium",
      question: "A write tool times out. The model wants to call it again. What does the contract need?",
      answer:
        "What they are testing: idempotency and error shape. Good answer: a retryable flag, a key derived from the ticket, and a backend that treats the second call as the first. Why that is good: it covers loop and ledger. Follow-up: who invents the key — model or your code?",
    },
    {
      difficulty: "hard",
      question: "Should approval be a field on the tool schema?",
      answer:
        "What they are testing: unforgeable control. Good answer: no. The model can fill approved_by. Approval is a gateway-held token bound to a hash of the exact arguments. Why that is good: it separates saying yes from typing yes. Follow-up: how does that change if the human approves overnight? (Preview of HITL.)",
    },
  ],

  glossary: [
    {
      term: "Tool contract",
      meaning:
        "The name, description, input shape, output shape, errors, and side-effect rules for one tool. Why it matters: this is what the model and your gateway both have to obey.",
    },
    {
      term: "Schema",
      meaning:
        "The form of allowed arguments: types, required fields, enums, patterns. Why it matters: it makes many wrong calls unrepresentable.",
    },
    {
      term: "Side-effect class",
      meaning:
        "Whether a tool only reads, can be safely repeated, or must run once. Why it matters: retries are safe or dangerous depending on this.",
    },
    {
      term: "Idempotency key",
      meaning:
        "A string that means this action should have one effect even if called twice. Why it matters: models retry; money should not.",
    },
    {
      term: "Structured error",
      meaning:
        "A small result with a code, a message, and whether to retry. Why it matters: the model cannot use a stack trace.",
    },
    {
      term: "Gateway",
      meaning:
        "The single door that validates and runs tools. Why it matters: the model never gets a raw pointer to your backend.",
    },
  ],
};
