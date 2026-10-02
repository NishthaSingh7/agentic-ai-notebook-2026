import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "hitl-interrupts",
  instructor:
    "I am a senior engineer who has seen money move because nobody could pause overnight. I teach human-in-the-loop as a siding on the track, not as a checkbox on a form the model fills.",
  promise:
    "You will go from 'we will just ask the model to confirm' to pausing before an irreversible act, waking up hours later, and binding a human yes to the exact action they saw.",

  story: {
    title: "The refund that went out twice at 2:07am",
    body: [
      "A support helper could draft refunds. The team added a 'human check': the model was told to ask the user 'please type APPROVE' before calling issue_refund. In daytime demos a person sat at the keyboard and typed it. It felt like control.",
      "At 2:07am a ticket arrived for 1,840 dollars. The helper drafted the refund, wrote 'please type APPROVE', and then — because the next comment in the ticket already contained the word approve from an earlier human note — treated that as consent and called the tool. The payment system took a minute to respond. The helper timed out and called it again. Two refunds.",
      "The morning review looked for a model failure. The model had followed a prompt. The program had never actually paused. There was no saved state, no one-time token, no person looking at a packet that said amount, order, and reason. 'Type APPROVE' lived in the same text stream as the ticket. The ticket was untrusted, like any other document.",
      "The rebuild put a real siding on the track. The graph (or the loop) stopped before issue_refund, saved its place, and sent a human a short card: order, amount, reason, who asked. Approve issued a one-use token bound to that exact card. Resume without the token did nothing. The tool used a key so even a double resume could not pay twice.",
    ],
    moral:
      "If you cannot pause until tomorrow, through a deploy, and resume the same work, you do not have human-in-the-loop. You have a prompt that says please.",
  },

  stages: [
    {
      id: "before-not-after",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Some actions you cannot comfortably undo. A refund leaves the account. An email reaches a customer. A deploy changes production. A delete removes a row. After those, saying sorry is not a rollback.",
        "A language model will sometimes be wrong about whether those actions should happen. You already know it guesses ids and retries. So for the dangerous step, a person should look first. That is the whole problem: stop before the irreversible act, show a human what will happen, continue only if they say yes.",
        "Here is a small picture. A train is heading toward a bridge that is out. You need a siding — a place to pull off and wait — not a sign on the train that says 'please stop if the bridge is out'. The sign is the prompt. The siding is an interrupt.",
        "HITL means human-in-the-loop: a person is part of the running process, not only a writer of the original prompt. The person is not 'in the loop' if they are asked in the same chat the model can also forge or misread.",
        "Without a real pause, you get the 2:07am story. The word approve already existed in the ticket. The model was optimistic. Money moved twice.",
        "At this point you should understand the problem: dangerous steps need a siding. Next we will decide which steps are dangerous enough to deserve one.",
      ],
      diagrams: [
        {
          title: "The gate sits before the act",
          caption:
            "Filtering the final sentence is too late if the refund already ran.",
          chart: chart(
            `flowchart TD
    Draft[Draft the refund] --> Gate{Human said yes?}
    Gate -->|no| Wait[Stay paused]
    Gate -->|yes| Pay[issue_refund]
    Pay --> Done([Money moved])
    Late[Check the chat after] -.->|too late| Done`,
            `class Draft,Done hub
    class Gate,Wait grp2
    class Pay grp1
    class Late grp3`
          ),
        },
      ],
    },
    {
      id: "what-needs-a-person",
      level: "beginner",
      title: "Which actions need a human",
      body: [
        "Not every tool needs a person. Looking up an order does not. Searching a handbook does not. If you pause on every read, your product is a very slow search box and people will bypass it.",
        "Ask two questions. Can we undo this easily? How large is the blast? A 4-dollar store credit you can reverse might auto-run. An 1,840-dollar refund to a new account should pause. A public status post should pause. Deleting a tenant should pause even if the amount is zero.",
        "Reversibility is a useful word: how hard it is to undo. Easy to undo, small blast: automate. Hard to undo, large blast: always pause. Mixed cases get a threshold — pause above 500 dollars, auto below — written as data, not as a vibe in a prompt.",
        "The person who approves should be the right person. A support agent may approve 200 dollars. A lead may approve 2,000. The model does not pick the approver by filling a field. Your policy does, from the session.",
        "They look similar: 'the user said yes in the chat' and 'an approver clicked yes on a card'. The important difference is who could have written the yes, and whether the yes is tied to this amount. Chat is forgeable. A card with a token is not.",
        "Pause and check. If the user is the attacker — a prompt that says APPROVE — should the refund still run? Only if your policy says the user may self-approve that amount. Many refunds should not.",
      ],
      diagrams: [
        {
          title: "Undo difficulty versus blast size",
          caption:
            "The top-right box is always a siding. The bottom-left box is usually automatic.",
          chart: chart(
            `flowchart TD
    SmallEasy[Small and easy to undo] --> Auto[Run automatically]
    SmallHard[Small but hard to undo] --> Maybe[Threshold or sample]
    BigEasy[Large but easy to undo] --> Maybe
    BigHard[Large and hard to undo] --> Pause[Always pause]`,
            `class Auto,Pause hub
    class SmallEasy,BigEasy grp1
    class SmallHard,BigHard grp2
    class Maybe grp3`
          ),
        },
      ],
    },
    {
      id: "the-card",
      level: "beginner",
      title: "What the human needs to see",
      body: [
        "A human will give you twenty seconds. The card must be a decision, not a transcript. Order id. Amount. Reason. Who asked. What will run, in one line. A yes and a no.",
        "If you show a 4,000-token scratchpad, people click yes to clear the queue. That is rubber-stamping. You have added latency without adding judgement.",
        "The card is bound to the action. If the amount changes after they looked, their yes is dead. They must see the new amount. This is the same idea as a tool contract: the human approves a form, not a mood.",
        "What are we trying to do? Build the smallest approval card. Here is the version.",
        "Let's understand what just happened. The human never sees thoughts. They see the write that is about to happen. A hash of those fields — a digest — will later make sure resume cannot swap in a different amount.",
        "At this point you should know what HITL looks like to a person: a short card, a wait, a yes that applies to that card only.",
      ],
      codes: [
        {
          title: "A card a human can decide in twenty seconds",
          language: "python",
          code: `from dataclasses import dataclass

@dataclass(frozen=True)
class ApprovalCard:
    run_id: str
    tool: str
    order_id: str
    amount_cents: int
    reason: str
    asked_by: str

    def digest(self) -> str:
        return f"{self.tool}:{self.order_id}:{self.amount_cents}:{self.reason}"`,
        },
      ],
    },
    {
      id: "durable-pause",
      level: "intermediate",
      title: "Pausing overnight, through a deploy",
      body: [
        "A real interrupt saves state and lets the process die. The web request does not stay open until 2am. You send the card. You store the run. You go to sleep. This is the LangGraph checkpointer idea, even if you write it yourself: a row in a database named by a business id.",
        "Resume loads that row and continues from the next step. The thread id is the ticket id or the refund draft id, not a random id per page load. You met that bug in the graph lesson.",
        "While you wait, deploys happen. New code must still load old cards. Keep the card schema stable. Add optional fields, do not rename amount_cents under a sleeping run.",
        "What are we trying to do? Stop before the write, save, come back. Here is the smallest pair of functions.",
        "Let's understand what just happened. interrupt writes the card and returns control. resume checks a token and only then calls the tool. There is no APPROVE string in the model stream.",
      ],
      codes: [
        {
          title: "Save the card, resume with a token",
          language: "python",
          code: `def interrupt(run_id: str, card: ApprovalCard) -> None:
    db.save(run_id, {"status": "waiting", "card": card, "token": None})
    notify_human(card)

def resume(run_id: str, token: str, card_seen: ApprovalCard) -> str:
    row = db.load(run_id)
    if row["status"] != "waiting":
        return "not_waiting"
    if token != row["issued_token"] or card_seen.digest() != row["card"].digest():
        return "rejected"
    row["issued_token"] = None  # one use
    return issue_refund(card_seen, idempotency_key=run_id)`,
        },
      ],
      diagrams: [
        {
          title: "The process may die. The card may not.",
          caption:
            "A pause that lives only in memory is a daytime feature.",
          chart: chart(
            `flowchart TD
    Act[About to write] --> Save[(Save card and state)]
    Save --> Sleep([Process may exit])
    Human([Approver]) --> Click[Yes or no]
    Click --> Load[Load the same run]
    Load --> Match{Token and digest match?}
    Match -->|no| Stop[Refuse]
    Match -->|yes| Write[Run the tool once]`,
            `class Act,Sleep,Human hub
    class Save,Load,Write grp1
    class Click,Match,Stop grp2`
          ),
        },
      ],
    },
    {
      id: "bind-the-yes",
      level: "intermediate",
      title: "A yes is for this action, once",
      body: [
        "If resume only checks 'someone clicked', an attacker who can call your resume API can submit a different amount. Bind the token to the digest of the card. If amount_cents changed, the token does not fit.",
        "Single-use matters. After a successful resume, burn the token. A retry of the HTTP click should not be a second refund. Combine this with the idempotency key you already know. Two belts: the token cannot be reused, and the ledger will not double-pay the same run id.",
        "Default deny on timeout. If nobody answers in 24 hours, the run expires to 'denied', not to 'sure, go ahead'. Silent auto-approve on expiry is how weekends become incidents. Escalate instead: page a lead, then expire.",
        "Re-check policy at resume time. The agent who was allowed at 16:00 may not be allowed at 00:10. Limits change. People leave. The card is old. The identity check is new.",
        "Remember this: interrupt is a pause. Binding is what makes the pause a control. Without a digest and a burned token, you built a speed bump.",
      ],
      diagrams: [
        {
          title: "Timeouts do not become yes",
          caption:
            "Expiry is deny or escalate. Auto-approve on silence is a hidden product decision.",
          chart: chart(
            `flowchart TD
    Wait[Waiting] --> Clock{SLA passed?}
    Clock -->|no| Wait
    Clock -->|yes| Page[Page a lead]
    Page --> Still{Still waiting?}
    Still -->|yes| Expire([Denied expired])
    Still -->|approved| Bind{Digest matches?}
    Bind -->|no| Expire
    Bind -->|yes| Run[Act once]`,
            `class Wait,Expire,Run hub
    class Clock,Still,Bind grp1
    class Page grp2`
          ),
        },
      ],
    },
    {
      id: "risk-table",
      level: "intermediate",
      title: "How the pieces connect: a policy table",
      body: [
        "Write the gates as data you can review. A table: tool, max amount without a human, who may approve, how long to wait. Engineers and risk people can argue over a row. They cannot argue over a paragraph in a system prompt.",
        "An autonomy budget is a cap on how many writes this run may perform even after approvals. A confused loop with ten approved refunds is still a confused loop. One ticket, one refund, unless a person raises the cap.",
        "Reads never go in the table as pauses. If you find yourself pausing lookup_order, you are delaying the card, not protecting money.",
        "Connect this to tool contracts. The tool still has a schema and a key. HITL is an extra door in the gateway: if the class is write and the amount is over the row, interrupt instead of run.",
        "At this point you should be able to add HITL to a helper without changing the model's personality. The model asks for issue_refund. The gateway decides to pause. The model is not the gate.",
      ],
      codes: [
        {
          title: "Policy as data the gateway reads",
          language: "python",
          code: `POLICY = {
    "issue_refund": {"auto_cents": 500, "approver": "support_lead", "hours": 24},
    "send_email_customer": {"auto_cents": 0, "approver": "support", "hours": 8},
    "lookup_order": {"auto_cents": None},  # None = always auto
}

def needs_human(tool: str, amount_cents: int) -> bool:
    row = POLICY[tool]
    if row["auto_cents"] is None:
        return False
    return amount_cents > row["auto_cents"]`,
        },
      ],
    },
    {
      id: "audit-the-human",
      level: "advanced",
      title: "Humans get tired too",
      body: [
        "The simple version assumes a careful approver. Real queues produce rubber stamps: yes in under three seconds, yes on every card, yes at 2am from a phone with no amount visible because the mobile view truncated the card.",
        "Audit the human path. Measure time-to-decision, rate of yes, and disagreements with a later review. If one person is at 99% yes and three seconds, you do not have HITL. You have a delay.",
        "Show the fields that matter on every device. If amount does not fit on the phone view, that view cannot approve. This is a product rule, not a nice-to-have.",
        "Feed audits back. Cards that were later reversed should become eval cases — the next lesson is about scoring paths. A gate that nobody ever uses should be removed or the threshold is wrong.",
        "Imagine the approver clicks yes here on the wrong order because two cards look alike. What should happen? Unique order ids, one card per screen, digest binding. If they still err, the audit trail names a person, not 'the agent'. That is uncomfortable and correct.",
      ],
    },
    {
      id: "earn-autonomy",
      level: "advanced",
      title: "Taking gates away with evidence",
      body: [
        "You should not pause forever on 4-dollar credits if a thousand of them were right. Raise autonomy with evidence: a measured error rate below a threshold, for a tool and a band of amounts, for a period of time. Then move the row in the policy table. Do not 'just trust the new model'.",
        "The ratchet goes both ways. A spike in reversals lowers the auto ceiling. Shipping a model change resets the evidence for that tool. New model, old trust, is how 2:07am happens again.",
        "Trade-off: more HITL means fewer incidents and slower tickets. Less HITL means the opposite. The table is how you choose in public. A prompt that says 'be careful' is how you choose in private and lose.",
        "When not to use HITL: reads; tiny reversible writes you will not staff; and actions that need millisecond automation (you need a different design, not a sleeping approver).",
        "The person who can teach this now says: pause before the act, show a short card, save the run, bind a one-use token to the digest, expire to deny, audit the yeses, and move thresholds with data.",
      ],
      diagrams: [
        {
          title: "Autonomy moves with evidence",
          caption:
            "A new model resets the count. A spike in reversals lowers the ceiling.",
          chart: chart(
            `flowchart TD
    Data[Error rate in this amount band] --> Raise{Below threshold?}
    Raise -->|yes| Row[Move policy row up]
    Raise -->|no| Hold[Keep the pause]
    Spike[Reversals spike] --> Down[Move policy row down]
    NewModel[New model ships] --> Reset[Reset the evidence]`,
            `class Row,Hold,Down hub
    class Data,Raise,Spike,NewModel,Reset grp1`
          ),
        },
      ],
      codes: [
        {
          title: "A yes-rate that means the gate is fake",
          language: "python",
          code: `def rubber_stamp(decisions: list[dict]) -> bool:
    if len(decisions) < 20:
        return False
    yes = sum(1 for d in decisions if d["yes"]) / len(decisions)
    fast = sum(1 for d in decisions if d["seconds"] < 3) / len(decisions)
    return yes > 0.95 and fast > 0.8`,
        },
      ],
    },
  ],

  workedExample: {
    title: "The 1,840 dollar refund, done as a siding",
    setup:
      "A ticket asks for 1,840 dollars on order 99101 at 2:07am. Policy auto-approves only up to 500 dollars. The word APPROVE appears in an older comment.",
    walkthrough: [
      "Step 1 — Understand the problem. A prompt that looks for the word APPROVE will fire. A real pause will not.",
      "Step 2 — Identify the relevant concept. HITL interrupt: save a card, notify a lead, bind a token to the digest.",
      "Step 3 — Build the simplest pause. Gateway sees issue_refund 184000 cents, writes waiting, returns 'needs approval' to the mouth.",
      "Step 4 — Improve it. Card shows order 99101, 1840.00, reason, ticket id. Token issued to the on-call lead, not to the customer chat.",
      "Step 5 — Handle a failure. A resume arrives with a different amount. Digest mismatch, reject. A double click: token burned, idempotency key = draft id, ledger pays once.",
      "Step 6 — Production. 24-hour expiry to denied if nobody acts. Resume re-checks the lead's role. The APPROVE string in the ticket is never read.",
    ],
    result:
      "No money moves at 2:07am. In the morning a person sees one card and pays once, or expires the run. The ticket's leftover word does nothing.",
  },

  practice: {
    title: "HITL for deploy and rollback",
    task:
      "An agent can deploy a service and roll it back. Deploys are hard to undo if traffic is live. Rollbacks are usually safer. Problem: where are the sidings, what is on the card, and what expires to deny. Think about: who may approve a prod deploy at midnight.",
    hint:
      "Deploy to prod always pauses. Rollback may auto if it targets the last known good and the same service. Expected reasoning: card shows service, version, environment; token bound to that triple.",
    solution:
      "POLICY: deploy_prod always interrupt, approver=release_manager, 4-hour expiry to deny (no auto-deploy). rollback_prod auto if version==last_good else interrupt. Card digest is service+version+env. Why this works: a model cannot ship friday-night main. Common wrong approach: 'ask the user to type DEPLOY in Slack' — Slack history already has the word.",
  },

  takeaways: [
    "Human-in-the-loop means the program actually stops before an irreversible act, not that the prompt says please confirm.",
    "Pause on hard-to-undo, large-blast writes. Do not pause ordinary reads.",
    "The human sees a short card: what will run, how much, why. A transcript is not a decision.",
    "The pause must survive process death. Save the run under a business id.",
    "A yes is a one-use token bound to a digest of that card. Expiry is deny, not approve.",
    "Re-check who the person is at resume time, and audit rubber-stamps, or you only added delay.",
  ],

  mistakes: [
    "Mistake: look for the word APPROVE in the chat. Why people make it: zero infra. What actually happens: the word already exists in the ticket. Better approach: a card and a token outside the model stream.",
    "Mistake: hold the HTTP request open until a human arrives. Why people make it: simpler than a store. What actually happens: timeouts, double submits, deploys kill the wait. Better approach: durable interrupt.",
    "Mistake: resume without binding the amount. Why people make it: a boolean approved feels enough. What actually happens: a different payload rides the same yes. Better approach: digest-scoped token.",
    "Mistake: expire to approve. Why people make it: tickets should not stall. What actually happens: weekend silence ships money. Better approach: expire to deny, with an escalation page.",
    "Mistake: pause every tool. Why people make it: safety feels like more clicks. What actually happens: people bypass the product. Better approach: a policy table with thresholds.",
    "Mistake: never look at yes-rates. Why people make it: the human is trusted by role. What actually happens: three-second 99% yes. Better approach: audit the human path and fix the card.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "Why is 'ask the model to confirm' not HITL?",
      answer:
        "What they are testing: pause versus prompt. Good answer: the model can read a forged yes from the same text it is told to obey, and the process never actually stops. Why that is good: it is the story. Follow-up: what does the human look at instead?",
    },
    {
      difficulty: "medium",
      question: "An approver clicks yes after a deploy that restarted all pods. What had to be true?",
      answer:
        "What they are testing: durable state and stable ids. Good answer: the card and run lived in a shared store under a business id; any pod can load them; the token still matches the digest. Why that is good: it connects to the graph lesson. Follow-up: what if amount_cents changed in the new code's default?",
    },
    {
      difficulty: "hard",
      question: "How do you raise the auto-refund ceiling from 500 to 2000 dollars?",
      answer:
        "What they are testing: evidence, not vibes. Good answer: measure error and reversal rates in that band, for a period, after the current model; change the policy table row; reset evidence when the model or tool changes. Why that is good: autonomy is earned. Follow-up: what metric would make you lower it again?",
    },
  ],

  glossary: [
    {
      term: "Human-in-the-loop (HITL)",
      meaning:
        "A person is a required step in a running process, usually before a dangerous act. Why it matters: it is a pause you can operate, not a sentence in a prompt.",
    },
    {
      term: "Interrupt",
      meaning:
        "A planned stop that saves state and returns later. Why it matters: this is the siding on the track.",
    },
    {
      term: "Approval card",
      meaning:
        "The short, structured view a human decides on. Why it matters: twenty seconds of attention is all you will get.",
    },
    {
      term: "Digest",
      meaning:
        "A fingerprint of the exact action being approved. Why it matters: a yes cannot be reused on a different amount.",
    },
    {
      term: "Default deny",
      meaning:
        "If time runs out, the action does not run. Why it matters: silence is not consent.",
    },
    {
      term: "Autonomy budget",
      meaning:
        "A cap on how many writes a run may perform even with approvals. Why it matters: a loop of approved refunds is still a loop.",
    },
  ],
};
