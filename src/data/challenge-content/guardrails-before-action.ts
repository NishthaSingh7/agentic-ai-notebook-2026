import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "guardrails-before-action",
  instructor:
    "I teach this from zero. If you have never built an agent, we start with a simple split: talking versus doing. We name each idea only after you can see why it exists.",
  promise:
    "You will go from never having heard of a guardrail to being able to put a yes-or-no check in front of a tool, keep stranger text from giving orders, lock dangerous fields to the logged-in ticket, and say when a simple check is not enough.",

  story: {
    title: "The invoice footer that moved a bank account",
    body: [
      "A finance team built a helper that read supplier emails. It could look up invoices. It could also update a vendor's bank details, because that was the dull part of the job. Safety, they thought, was a filter on the helper's final paragraph. The filter asked whether the reply looked rude or dangerous. Most replies were calm summaries. The filter almost always said yes.",
      "One Monday an email arrived that looked like a normal invoice. In a footer a human would skim, it said the supplier had a new bank account and the system should update it. The helper treated that sentence as an instruction. It called the update tool. Then it wrote a tidy summary: fourteen invoices processed, two flagged. The filter read the summary and found nothing wrong. The money left on the next payment run.",
      "Nobody had typed an attack into a chat box. The user had asked a normal question. The dangerous sentence lived inside a document the helper was supposed to read. The filter never saw the tool call. It only saw the paragraph after the damage was done.",
      "The rebuild was not a sterner sentence in the prompt. The update tool stopped being available when the helper had just read an email. Bank details stopped being a field the helper could type. The vendor id had to come from the purchase order already in the company's system. The helper kept its useful job. It lost the one power that was never safe to give it.",
    ],
    moral:
      "A filter on the paragraph cannot stop an action that already happened. The check has to sit in front of the tool.",
  },

  stages: [
    {
      id: "talk-versus-act",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Let's start from zero. You already know a chatbot. You type a question. The model writes an answer. The world outside the chat does not change. No email is sent. No row in a database is edited. That is a conversation.",
        "Now imagine the same model is allowed to press buttons in your product. It can search a database. It can send an email. It can change a bank account. Those buttons are called tools. A tool is just a function your code will run if the model asks for it.",
        "The moment you add tools, a new problem appears. A wrong sentence in a chat is embarrassing. A wrong tool call can move money or leak a file. The danger is not the wording of the reply. The danger is the action.",
        "Here is a tiny picture. A user says, 'Please process today's invoices.' The model reads an email. The email contains a sentence that looks like an extra instruction. The model then asks your code to run update_vendor. If your code says yes, the world changes. The later summary can still look polite and correct.",
        "Pause and check. If the model is already convinced, what should stop the update? A nicer prompt will not. A filter on the summary will not. Something in your code has to say no before the tool runs. That something is the idea of this whole sitting. We will give it a name in the next stage.",
        "At this point you should understand one thing: talking and acting are two different paths. Safety for talking is not safety for acting.",
      ],
      diagrams: [
        {
          title: "Talking path versus acting path",
          caption:
            "The filter sits on the talking path. Harm, when it happens, sits on the acting path.",
          chart: chart(
            `flowchart TD
    Userq([User asks]) --> Modelg[Model]
    Modelg --> Talk[Write a reply]
    Modelg --> Act[Ask to run a tool]
    Talk --> Filt[Filter the paragraph]
    Filt --> Screen([User reads it])
    Act --> World([World changes])`,
            `class Userq,Screen,World hub
    class Modelg,Talk,Act grp1
    class Filt grp2`
          ),
        },
      ],
    },
    {
      id: "what-a-guardrail-is",
      level: "beginner",
      title: "What a guardrail is, in plain language",
      body: [
        "Think of a factory machine with a physical bar in front of the blade. The bar is not a sign that says 'please be careful'. The bar stops the hand. That is the everyday picture.",
        "In software, a guardrail is a check your code runs before something risky happens. It is not a request to the model. It is not a hope. It is an if-statement you can test.",
        "Why does this exist? Because the model is a text predictor. It reads all the text in front of it and guesses the next useful action. Some of that text was written by you. Some of it was written by a stranger in an email or a PDF. The model does not have a reliable 'this is only data' switch. So your code has to hold the switch.",
        "What happens without it? The model proposes a tool call. Your code runs the tool. Later you read the reply and wonder why the vendor record changed. The story at the start of this sitting is that failure, written as an incident.",
        "The simplest example is a list of allowed tools. Support staff may search. Only a lead may refund. A visitor may do neither. The model can still ask. Your code can still say no.",
        "Connect this back. Stage 1 said talking and acting are different paths. A guardrail is the fence on the acting path. At this point you should be able to say: a guardrail is a check in code, before the tool, not a sentence in the prompt.",
      ],
    },
    {
      id: "simplest-yes-no",
      level: "beginner",
      title: "How the simplest version works",
      body: [
        "What are we trying to do? We want one function that sees the proposed tool and says allow or deny. Nothing fancy. If this function does not exist, every later idea in this lesson has nowhere to sit.",
        "Here is the smallest version. You keep a list of tools each role may use. You look up the role of the person who started this run. If the tool is not on the list, you return no and you do not call the tool.",
        "Let's understand what just happened. The model still gets to propose. Proposal is not permission. Your function is the permission. That split is the whole beginner mental model.",
        "A second tiny rule belongs next to the list: amounts and destinations. 'Refund' may be allowed, but not for 50,000 dollars. 'Browse' may be allowed, but not to any website on the internet. Those are still yes-or-no checks. They do not need a second model.",
        "If the check says no, tell the loop in a structured way: denied, and a short reason. Do not return a poetic paragraph. The model can recover from 'role_denied'. It cannot recover from a vague scolding.",
        "At this point you should understand: the first guardrail is a deny-by-default list plus a few argument limits. Default is no. You add yes on purpose.",
      ],
      codes: [
        {
          title: "The smallest yes-or-no check",
          language: "python",
          code: `ALLOWED = {
    "visitor": {"search"},
    "support": {"search", "retrieve"},
    "lead": {"search", "retrieve", "refund"},
}

def allow(role: str, tool: str, args: dict) -> tuple[bool, str]:
    if tool not in ALLOWED.get(role, set()):
        return False, "role_denied"
    if tool == "refund" and args.get("amount_cents", 0) > 20_000:
        return False, "amount_too_high"
    return True, "ok"`,
        },
      ],
      diagrams: [
        {
          title: "The model proposes. Code decides.",
          caption:
            "If allow() says no, the tool never runs. The reply filter is not in this picture on purpose.",
          chart: chart(
            `flowchart LR
    Prop[Proposed tool] --> Ask{allow}
    Ask -->|no| Stop([Deny and log])
    Ask -->|yes| Run[Run the tool]
    Run --> World([World])`,
            `class Prop,World hub
    class Ask grp2
    class Stop,Run grp1`
          ),
        },
      ],
    },
    {
      id: "tool-gateway",
      level: "intermediate",
      title: "Give the check a home: the tool gateway",
      body: [
        "The simple function from the last stage needs a home. If every feature calls tools in its own file, someone will add a new tool and forget the check. The home is a gateway: one door every tool call must walk through.",
        "A gateway is just a function that receives the caller, the tool name, the arguments, and a little context about the run. It looks up a policy. It either runs the tool or returns a structured refusal. There is no second path that 'just this once' skips the door.",
        "Why before a framework API? Because an SDK, a graph library, or a tool plug will happily call whatever you wired up. Those libraries are not your policy. They are pipes. The gateway is the policy.",
        "Policy should be data you can read, not a paragraph inside a prompt. A table of role → tools → limits can be reviewed in a pull request. A sentence that says 'never update bank details' cannot be unit-tested.",
        "Log every decision: who, which tool, allow or deny, which rule fired. Next month, when someone asks 'did the helper ever try to change a vendor', you will want that log. A silent deny is almost as bad as a silent allow.",
        "At this point you should understand: the gateway is the one door. The model is a proposer. The gateway is the decider.",
      ],
      codes: [
        {
          title: "One door, deny by default",
          language: "python",
          code: `def run_tool(role: str, tool: str, args: dict, tools: dict) -> dict:
    ok, reason = allow(role, tool, args)
    print({"tool": tool, "role": role, "ok": ok, "reason": reason})
    if not ok:
        return {"error": "denied", "reason": reason}
    return tools[tool](args)`,
        },
      ],
    },
    {
      id: "trusted-vs-untrusted",
      level: "intermediate",
      title: "Trusted instructions versus untrusted data",
      body: [
        "We need a new word, so we will earn it. Trusted text is text you wrote, or text the logged-in user just typed as their request. Untrusted text is everything else the model reads: emails, PDFs, web pages, ticket comments, search results.",
        "They look similar because they are both sentences in the same prompt. The important difference is who is allowed to give orders. Only the trusted channel may say 'do this'. Untrusted text may inform. It may not command.",
        "The model does not keep this line for you. A context window is one long sequence of tokens — pieces of text the model reads. A sentence in a PDF is the same kind of token as a sentence in your standing instructions. If you paste them together and hope, you have asked a probability to be a type system.",
        "So you label text when it enters your app. 'This blob came from an email' is a fact your code knows. You keep that label when you store it, when you retrieve it, and when you summarise it. If a summary of an email loses the label, you have washed a stranger's words into 'our knowledge'.",
        "Pause and check. Imagine the invoice email from the story. Should that email be allowed to pick the tool? No. Should it be allowed to supply the new bank number? No. It may supply invoice numbers you then check against your own records.",
        "At this point you should understand: data is not instructions. The label is how your code remembers that.",
      ],
      diagrams: [
        {
          title: "One instruction channel, many data channels",
          caption:
            "Only the authenticated user's request may issue orders. Everything else is labelled data.",
          chart: chart(
            `flowchart TD
    Userq([Logged-in user]) --> Inst[Instruction channel]
    Email[Email or PDF] --> Data[Data channel]
    Wiki[Your own handbook] --> Data
    Inst --> Asb[Prompt assembler]
    Data --> Asb
    Asb --> Modelg[Model]
    Modelg --> Gate{Gateway reads labels}
    Gate -->|untrusted plus risky tool| Deny([Deny])
    Gate -->|ok| Tool[Tool]`,
            `class Userq,Deny hub
    class Inst,Data,Asb grp1
    class Email,Wiki,Modelg grp2
    class Gate,Tool grp3`
          ),
        },
      ],
    },
    {
      id: "bind-risky-args",
      level: "intermediate",
      title: "Do not let the model choose the dangerous fields",
      body: [
        "A tool name is only half the risk. send_email looks fine until the 'to' field is an address the model copied from a PDF. refund looks fine until the amount or the order id came from the document, not from the ticket.",
        "The rule is simple once you see it. Fields that say whose money, whose email, or whose record get filled from the logged-in session or from a row you already trust. The model does not get to type those fields. We call this binding the argument to identity.",
        "They look similar because both are JSON the model produced. The important difference is who is allowed to author the value. A search query can come from the model. A bank account number cannot.",
        "What are we trying to do? Take a proposed call, ignore the model-supplied destination, and write the destination from the ticket sitting in your database.",
        "If the model still tries to pass a different vendor id, that is not a helpful correction. That is a security event. Log it. Refuse it. Do not 'prefer the model's value because it looks more complete'.",
        "At this point you should understand: allowlisting the tool is not enough if the arguments are a free form. Lock the fields that name the target.",
      ],
      codes: [
        {
          title: "Fill the risky field from the ticket, not the model",
          language: "python",
          code: `def bind_refund(args: dict, ticket: dict) -> dict:
    proposed = args.get("order_id")
    trusted = ticket["order_id"]
    if proposed and proposed != trusted:
        return {"error": "arg_override", "field": "order_id"}
    return {
        "order_id": trusted,
        "amount_cents": ticket["remaining_cents"],
    }`,
        },
      ],
      diagrams: [
        {
          title: "Resolve the target. Do not accept it.",
          caption:
            "The model may propose. The gateway overwrites whose record is touched.",
          chart: chart(
            `flowchart LR
    Modelg[Model args] --> Cmp{Matches ticket}
    Tick[Ticket row] --> Cmp
    Cmp -->|no| Flag([Log and deny])
    Cmp -->|yes| Safe[Args from ticket]
    Safe --> Tool[Tool]`,
            `class Modelg,Flag hub
    class Tick,Safe,Tool grp1
    class Cmp grp2`
          ),
        },
      ],
    },
    {
      id: "two-phase-and-egress",
      level: "advanced",
      title: "When the simple check is not enough",
      body: [
        "Remember the simple version: a list of tools plus a few limits. That version breaks when one turn both reads a stranger's email and holds a money tool. The model only needs to be convinced once.",
        "The advanced move is to split the work into two phases. Phase one reads the email and may only return a small form: invoice number, total, currency. No free-text 'summary' crosses the line, because a summary can smuggle the attacker's sentence. Phase two sees only those typed fields and may use the stronger tools.",
        "A second hole is leaving. Even if the helper cannot change a bank account, it might paste a table into an outbound email, or put a remote image in markdown that your renderer will fetch. That path is called egress: data going out. Close it with an allow-list of hosts, no remote images from model text, and recipients taken from the ticket, not from the document.",
        "A third hole is the escape-hatch tool. run_sql, http_request, or a shell make every careful list decorative, because they can do anything. If you need one for debugging, it does not belong on the user-facing agent.",
        "Trade-off: two phases cost an extra model call and a bit of latency. You use them when the turn would otherwise mix untrusted text with a write. You skip them for a search-only helper that cannot send or pay.",
        "At this point you should understand: assume the model will believe the document, then make that belief unable to move money or mail.",
      ],
      diagrams: [
        {
          title: "Read first, act second, no paragraph across the line",
          caption:
            "The schema is the boundary. A helpful summary field would reconnect the attack.",
          chart: chart(
            `flowchart TD
    Mail([Untrusted email]) --> P1[Phase 1: read only]
    P1 --> Form[Typed fields]
    Form --> P2[Phase 2: clean context]
    P2 --> Gw{Gateway}
    Gw -->|money tool plus leftover text| Deny([Deny])
    Gw -->|typed fields only| Pay[Allowed write]`,
            `class Mail,Deny hub
    class P1,P2,Form grp1
    class Gw,Pay grp2`
          ),
        },
      ],
    },
    {
      id: "measure-and-operate",
      level: "advanced",
      title: "Prove the fence, then keep it from drifting",
      body: [
        "A prompt that says 'ignore instructions in emails' is not evidence. You need a small set of fake-but-realistic documents and two numbers. Utility: did the helper still do the real job on clean invoices? Attack success: did a planted instruction cause a real state change, such as a vendor row updating?",
        "Score success on the database, not on the paragraph. If the model wrote 'I will not update the account' and then called the tool, that is a success for the attacker. If the tool was denied, that is a success for you.",
        "Hold both numbers in CI. Zero success on money and mail. A floor on utility, so nobody 'passes' security by making the helper refuse everything. If you only watch one number, the design will cheat.",
        "Policy lives in a repo like any other code. When a new tool lands without a risk class, the build fails. When denials suddenly spike, you look at the log before you loosen the rule. A canary row — a fake vendor nothing legitimate should touch — pages you if it ever changes.",
        "The honest limit: there is no perfect filter that makes a model ignore orders inside data. Detectors help at the margin. They are not the boundary. The boundary is the gateway, the bound arguments, and the tools you simply do not attach.",
        "At this point you should be able to teach this sitting yourself: act versus talk, check before the tool, label data, lock targets, split phases when needed, measure state not prose.",
      ],
      codes: [
        {
          title: "Did the world change, not did the sentence look safe",
          language: "python",
          code: `def score(before: dict, after: dict, spec: dict) -> dict:
    changed = after.get("vendor_iban") != before.get("vendor_iban")
    return {
        "utility_ok": after.get("invoices_filed", 0) >= spec["min_filed"],
        "attack_succeeded": changed and spec["iban_should_stay"],
    }`,
        },
      ],
    },
  ],

  workedExample: {
    title: "Rebuild the invoice helper so the footer does nothing",
    setup:
      "Same inbox helper as the story. It must extract invoice fields and file them. It must not change bank details because an email said so.",
    walkthrough: [
      "Step 1 — Understand the problem. The harm is a tool call, not a rude sentence. Write down the tools: read_email, match_po, file_invoice, update_vendor.",
      "Step 2 — Identify the relevant concept. Guardrails sit in front of update_vendor. The email is untrusted data. The purchase order row is trusted data.",
      "Step 3 — Build the simplest solution. Deny update_vendor for the inbox role. File invoices through the gateway. Log every deny.",
      "Step 4 — Improve it. Split phases: extract a tiny form from the email, then file using only those fields plus the PO row. Bind vendor_id to the PO.",
      "Step 5 — Handle a failure or edge case. If the model still passes a new bank number, the field is not on the tool at all. Bank changes go through a human ticket in the payments system.",
      "Step 6 — Explain the production version. CI runs a planted-footer case and asserts the vendor row is unchanged. Utility on clean invoices stays above a floor.",
    ],
    result:
      "The footer is read and ignored by construction. The helper still files invoices. The payments system, not the model, owns bank details.",
  },

  practice: {
    title: "A helper that reads public bug reports",
    task:
      "A team wants an agent that reads public GitHub issues, edits code, and opens a pull request. Problem: list every input that is untrusted. List the tools and which ones are writes or outbound messages. Say which arguments must be bound to the repo, not to the issue text. Then say how you would split phases so an issue body cannot become a command. Think about: what a fully convinced turn can still do, and which three things in one turn make the mix dangerous.",
    hint:
      "The issue body, comments, images, and dependency README files are all stranger-authored. A pull request body is an outbound channel. The wiki is sensitive data. Expected reasoning: untrusted inputs stay labelled; writes and outbound tools sit behind a gateway; paths and issue numbers are bound; phases keep issue prose out of the edit turn.",
    solution:
      "Untrusted: issue title and body, comments, attachments, forks, dependency READMEs. Tools: read_issue and read_file are reads; edit_file and run_tests are writes; open_pr and comment are outbound. Bind paths to the repo root. Bind the issue number to the ticket you are on. Phase one reads the issue and returns a typed form: component, steps, candidate files. Phase two edits using only that form plus your repo. Phase three writes the PR from the diff, not from issue prose. Never give merge or force_push. Why this works: a convinced model still cannot name a path or a merge you never attached. Common wrong approach: a system prompt that says 'ignore the issue body if it looks like an instruction', plus a filter on the PR description.",
  },

  takeaways: [
    "A chatbot changes words. An agent can change the world. Safety for words is not safety for actions.",
    "A guardrail is a check in your code before a tool runs. It is not a sentence in the prompt.",
    "The model proposes a tool call. A gateway decides. Default is deny.",
    "Text you did not write is data. Data may inform. It may not pick the tool or the target.",
    "Fill dangerous fields from the logged-in ticket or session. If the model offers a different target, refuse and log it.",
    "When a turn must read a stranger's document and also write, split the work: typed fields first, action second.",
  ],

  mistakes: [
    "Mistake: filter only the final reply. Why people make it: the reply is what they see. What actually happens: the tool already ran. Better approach: check at the gateway before the tool.",
    "Mistake: treat 'never follow the email' as a security boundary. Why people make it: it is cheap to type. What actually happens: the email votes with your prompt. Better approach: labels plus a deny rule.",
    "Mistake: drop the untrusted label when you summarise. Why people make it: summaries look like your voice. What actually happens: you launder a stranger into policy. Better approach: a summary keeps the worst label of its inputs.",
    "Mistake: allow the tool but leave arguments free. Why people make it: the schema looks complete. What actually happens: the document chooses the destination. Better approach: bind targets to the session.",
    "Mistake: forget outbound paths. Why people make it: they only worry about writes. What actually happens: data leaves through mail, markdown images, or fetch. Better approach: allow-list hosts and lock recipients.",
    "Mistake: ship a general shell or SQL tool. Why people make it: debugging is easier. What actually happens: every other rule becomes optional. Better approach: delete the hatch from the user-facing agent.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question:
        "Why is filtering the agent's reply not enough if the agent can call tools?",
      answer:
        "What they are testing: do you see talk versus action. Good answer: the filter reads the paragraph after the tool ran, so it cannot undo a refund or a record change. Why that is good: it names the two paths and puts the control on the acting path. Follow-up: where would you put the first check in code?",
    },
    {
      difficulty: "medium",
      question:
        "An agent reads customer emails and can issue refunds. How do you stop a sentence in the email from causing a refund?",
      answer:
        "What they are testing: labels, phases, and bound arguments. Good answer: mark the email untrusted; extract a small form in a read-only phase; bind order id and amount to the ticket; deny refund if untrusted text is still in the turn. Why that is good: you assumed the model might believe the email and still made the belief harmless. Follow-up: what would you log if the model tried a different order id?",
    },
    {
      difficulty: "hard",
      question:
        "A vendor says their new detector model 'solves prompt injection'. What do you still build, and how do you evaluate the claim?",
      answer:
        "What they are testing: detectors versus boundaries, and measurement. Good answer: treat the detector as a helper signal; still build a deny-by-default gateway, bound arguments, a phase split, and egress limits; evaluate with planted documents scored on real state changes, plus a utility floor. Why that is good: you did not accept a classifier as a lock. Follow-up: which number would make you block a release?",
    },
  ],

  glossary: [
    {
      term: "Tool",
      meaning:
        "A function your code will run if the model asks. Why it matters: tools are how an AI changes the world instead of only writing text.",
    },
    {
      term: "Guardrail",
      meaning:
        "A check in code that can stop a risky action before it happens. Why it matters: a request in the prompt has no enforcement.",
    },
    {
      term: "Tool gateway",
      meaning:
        "The one door every tool call must pass. Why it matters: if any path skips the door, the policy is optional.",
    },
    {
      term: "Untrusted data",
      meaning:
        "Text you did not write as an instruction — emails, PDFs, pages, comments. Why it matters: the model may treat it as an order unless your code keeps the label.",
    },
    {
      term: "Identity-bound argument",
      meaning:
        "A field filled from the logged-in session or a trusted row, not from the model. Why it matters: the document cannot choose whose money or mail is touched.",
    },
    {
      term: "Attack success rate",
      meaning:
        "How often a planted instruction causes a real state change. Why it matters: scoring the paragraph lets a failed tool call look like a safe reply.",
    },
  ],
};
