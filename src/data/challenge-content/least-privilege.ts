import { pastelChart } from "@/lib/mermaid-pastel";
import type { ChallengeLesson } from "../challenge-types";

function chart(body: string, classes: string) {
  return pastelChart(body, classes);
}

export const lesson: ChallengeLesson = {
  slug: "least-privilege",
  instructor:
    "I am a senior engineer who builds AI products. I still start this topic from zero every time I teach it, because the idea is simple and the failures are not.",
  promise:
    "You will go from never having heard of least privilege to being able to shrink a toolbox, split reading from writing, and say what still happens if someone tricks the model.",

  story: {
    title: "The invoice that mailed the customer list",
    body: [
      "A finance team built a helper that read invoices from email, checked them against purchase orders, and emailed the vendor if something did not match. It had three abilities: read the inbox, query the company database, and send email. In the demo that felt small and tidy.",
      "The database ability was not small. It accepted any question written in SQL — the language databases use to ask for rows — and it used a login that could see every table, including customers. Nobody worried, because it was 'only a read'. Reads do not delete data. They can still copy it.",
      "One Tuesday an invoice arrived with pale text in the footer. The text told the helper to run a customer query and paste the result into the reply. The helper read the invoice. It ran the query. It sent a polite mismatch email. At the bottom it attached five hundred customer records, addressed to the vendor on the invoice.",
      "Every piece did the job it was given. A sentence in the system prompt said 'never share customer data'. The model followed the invoice instead. The fix was not a stronger prompt. The team deleted the all-purpose query, gave the helper two named lookups, and turned send-email into a draft a human clicks.",
    ],
    moral:
      "Assume the trick works. Least privilege means the worst allowed action is still boring — because the model will eventually obey the document.",
  },

  stages: [
    {
      id: "the-problem",
      level: "beginner",
      title: "What problem are we solving?",
      body: [
        "Imagine you hire a new intern to match invoices. You would not hand them the master key to every filing cabinet, the company credit card, and a stamp that sends mail to anyone in the world. You would give them the two folders they need and a stack of draft letters for you to sign.",
        "An AI helper is in the same situation. It is software that can call other software. Those calls are how it reads a database, sends an email, or restarts a server. If you give it a powerful call, it can use that call on every run — including runs where the input was written by a stranger.",
        "The input is often untrusted. An invoice PDF, a support ticket, a web page, a log line — these can contain sentences that look like instructions. A language model is very good at following instructions. It is not reliably good at telling 'our instructions' apart from 'text inside a document'.",
        "That mix is the problem this lesson solves. We are not trying to make the model smarter or more obedient. We are trying to make the allowed actions so small that even a fully tricked model cannot do much harm.",
        "Pause and check. If the invoice says 'please share the customer list', and the helper has a tool that can do that, should we rely on a sentence that says 'never share customer data'? No. The document will often win.",
        "At this point you should understand the fear in one sentence: the danger is not that the AI is evil. The danger is that it is helpful with a key that is too big.",
      ],
      diagrams: [
        {
          title: "A helper with a key that is too big",
          caption: "The model sits in the middle. The key decides what a successful trick can touch.",
          chart: chart(
            `flowchart TD
    Doc([Invoice or ticket]) --> Model[Language model]
    Prompt[Our instructions] --> Model
    Model --> Key[Tools we granted]
    Key --> Mail[Send email]
    Key --> Db[Query any table]
    Key --> Inbox[Read inbox]`,
            `class Doc,Prompt hub
    class Model grp1
    class Key grp2
    class Mail,Db,Inbox grp3`
          ),
        },
      ],
    },
    {
      id: "what-a-tool-is",
      level: "beginner",
      title: "What a tool is, and what privilege means",
      body: [
        "A tool is a function the model is allowed to ask for. You register a name, a short description, and the arguments it accepts. On each turn the model may pick a name and fill in arguments. Your code then runs that function and hands the result back.",
        "Think of a restaurant menu. The diner — the model — can only order what is printed. If the menu says 'soup' and 'salad', they cannot order the contents of the walk-in freezer. If the menu says 'anything in the kitchen, describe it in a sentence', they can order the freezer.",
        "That second menu is what engineers call a god tool. It is one item on the list, but the argument is a whole language: SQL, a shell command, a URL, or a Python script. Nobody can list every sentence that language can express, so nobody can review what you actually granted.",
        "Privilege is a word from security. It means 'what this identity is allowed to do'. Least privilege means 'give the smallest permission that still finishes the job'. For an agent, the permission is the tool list plus the credentials those tools use plus the arguments those tools will accept.",
        "Connect this back to the intern. The intern's badge is the credential. The list of rooms they can enter is the tool list. The form they must fill to request a file is the argument schema. Least privilege works on all three, not only on the list of names.",
      ],
      codes: [
        {
          title: "A menu item is a name plus a form, not a language",
          language: "python",
          code: `TOOLS = {
    "get_purchase_order": {"po_number": str},
    "get_vendor": {"vendor_id": str},
    "draft_email": {"to_vendor_id": str, "body": str},
}
# Not on the menu: query_db(sql), run_shell(cmd), fetch(url)`,
        },
      ],
    },
    {
      id: "smallest-toolbox",
      level: "beginner",
      title: "How the simplest version works",
      body: [
        "The first instinct on a demo is generosity. More tools look more capable. Each extra tool is a permanent grant. It is reachable on every run, by every input, including the ones an attacker wrote.",
        "Shrink on three axes. Fewer tools: do not register a lookup the job never needs. Narrower tools: a function that fetches one purchase order by number, not a function that runs any SQL. Smaller arguments: a recipient chosen from a vendor id your code already knows, not a free-text email address.",
        "Here is the smallest version of the invoice helper. It needs to read one inbox. It needs to fetch a purchase order. It needs to fetch a vendor. It needs to draft a note. That is four named functions. It does not need 'talk to the database'. It does not need 'send to any address'.",
        "Pause and check. If someone asks you to add 'just a generic query for next quarter', what are they really asking? They are asking you to put a language back on the menu. Adding a seventh named function later is a small, reviewable change. Leaving a god tool 'for later' is a permanent open door.",
        "Right-size per role, not per product. The triage helper, the matching helper, and the billing helper should not share one union toolbox. A shared toolbox means every helper inherits the most dangerous ability any of them needed.",
        "At this point you should understand the simplest version: list the five actions the job needs, delete any action that is a language, and keep a separate toolbox per role.",
      ],
      diagrams: [
        {
          title: "Three ways to shrink",
          caption: "Fewer names, narrower functions, tighter arguments. A god tool fails the middle test.",
          chart: chart(
            `flowchart LR
    Wide([Any SQL]) --> Fewer[Fewer tools]
    Fewer --> Still[Still one god tool]
    Still --> Narrow[Named lookups]
    Narrow --> Po[get purchase order]
    Narrow --> Vend[get vendor]
    Po --> Tight[Tighter arguments]
    Vend --> Tight
    Tight --> Done([Bounded blast radius])`,
            `class Wide,Done hub
    class Fewer,Narrow,Tight grp2
    class Still grp1
    class Po,Vend grp3`
          ),
        },
      ],
      codes: [
        {
          title: "What are we trying to do? Replace one language with two lookups.",
          language: "python",
          code: `def get_purchase_order(po_number: str) -> dict:
    # One id in. A fixed set of columns out. No free SQL.
    return db.fetch_one(
        "SELECT po_number, vendor_id, total FROM purchase_orders WHERE po_number = %s",
        po_number,
    )


def get_vendor(vendor_id: str) -> dict:
    return db.fetch_one(
        "SELECT vendor_id, name, email FROM vendors WHERE vendor_id = %s",
        vendor_id,
    )`,
        },
      ],
    },
    {
      id: "split-read-write",
      level: "intermediate",
      title: "Split reading from writing",
      body: [
        "A read tool copies information into the model's context. A write tool changes the world: it sends mail, moves money, deletes a row. They fail in different ways, so they should be different objects with different credentials.",
        "People say 'it is only a read, so it is safe'. That is half true. A read cannot corrupt the database. It can still leak private data. The invoice incident was a read plus a send. Nothing was deleted. Five hundred emails left the building.",
        "So group data by how sensitive it is: public, internal, customer-identifying, financial, credentials. Grant per group, per role. The invoice helper needs purchase orders and vendor emails. It does not need the customers table. 'Read-only SQL' is not that grant. 'These two tables, these columns' is.",
        "Then split writes by how reversible they are. Updating an internal ticket field is easy to undo. Issuing a refund is undoable with work. Sending an external email is not undoable. Irreversible writes should become drafts a human confirms.",
        "Remember this: draft-then-confirm is not a failure of autonomy. It is two seconds of human time on the one action you cannot unsend. The helper still does the matching. A person still clicks send.",
      ],
      codes: [
        {
          title: "Here is the smallest version. Send becomes a draft.",
          language: "python",
          code: `def draft_email(to_vendor_id: str, body: str) -> str:
    vendor = get_vendor(to_vendor_id)
    # Code picks the address. The model never types an email.
    draft_id = queue.put(
        {"to": vendor["email"], "body": body[:4000], "needs": "human"}
    )
    return f"drafted {draft_id} — waiting for a click"`,
        },
      ],
    },
    {
      id: "god-tools-and-args",
      level: "intermediate",
      title: "When the simple toolbox is still too wide",
      body: [
        "Even after you split read and write, a tool can still be too wide in its arguments. get_logs(service, since) looks named and safe. If since can be '1970' and service can be any string, you have granted a firehose of private lines.",
        "An argument cap is a limit you enforce in code, not in the prompt. Row limits. Amount ceilings. Time windows. Destination allowlists. Character caps. If the model asks for 50,000 rows, the function returns 50 and a note that it capped.",
        "The same idea applies to who the tool thinks it is acting for. The model is not a person. If a tool accepts tenant_id or user_id as an argument from the model, a tricked model can read another customer's data. That failure has a name: confused deputy. The helper has a powerful badge, and the visitor steers it.",
        "What are we trying to do? Inject the real caller from the session, below the model. The tool never asks the model which tenant to use. Let's understand what happens: the gateway already knows who logged in. It stamps that id on the call. The model can only fill the fields that are about the task, not about identity.",
        "At this point you should understand why prompts cannot be the permission system. A prompt is a suggestion. A parameterised function with an injected tenant id is a lock.",
      ],
      diagrams: [
        {
          title: "Identity comes from the session, not the model",
          caption: "The model fills task fields. Code fills who and where.",
          chart: chart(
            `flowchart TD
    User([Logged-in user]) --> Gw[Gateway]
    Gw --> Call[Tool call]
    Model[Model args: po_number] --> Call
    Call --> Tool[get_purchase_order]
    Tool --> Db[(Two tables only)]
    Call -.->|blocked| Other[Other tenant]`,
            `class User,Other hub
    class Gw,Call,Tool grp1
    class Model grp2
    class Db grp3`
          ),
        },
      ],
      codes: [
        {
          title: "Smallest version: stamp the tenant in code.",
          language: "python",
          code: `def get_purchase_order(po_number: str, *, tenant_id: str) -> dict:
    # tenant_id is passed by the gateway, not by the model.
    return db.fetch_one(
        """
        SELECT po_number, vendor_id, total
        FROM purchase_orders
        WHERE po_number = %s AND tenant_id = %s
        """,
        po_number,
        tenant_id,
    )`,
        },
      ],
    },
    {
      id: "pieces-in-an-app",
      level: "intermediate",
      title: "How the pieces connect in a real app",
      body: [
        "In a real application the model never talks to the database by itself. There is a loop, a gateway, tools, and credentials. The loop asks the model what to do next. The gateway checks the name, the arguments, and the caller. Only then does a tool run.",
        "Three ingredients turn a trick into a leak. Private data the helper can read. Untrusted text the helper will ingest. An outbound channel that leaves the building. Any two can be survived. All three together means a successful injection is exfiltration — a word that just means 'data leaving without permission'.",
        "The invoice helper had all three: a warehouse login, PDFs from vendors, and send-email. The team cut two edges. They shrank the data to two tables. They turned the channel into a human-reviewed draft. The next similar PDF became a denied lookup and a normal mismatch note.",
        "Watch for channels that are not send tools. A URL fetch that puts data in the query string. A ticket comment on an external system. Your own UI, if it auto-loads images from markdown — the browser will request a remote URL as soon as the text is shown, and no tool call is required.",
        "Why an engineer should care: you can write a perfect prompt and still ship all three ingredients. The review question is not 'did we tell the model to be careful?'. It is 'can any attacker-controlled string reach a network request, and what data is already in context when it does?'",
      ],
      diagrams: [
        {
          title: "Three ingredients of a leak",
          caption: "Remove at least one edge. Two cuts is better.",
          chart: chart(
            `flowchart TD
    Data[Private data] --> Mix{All three?}
    Untrust[Untrusted document] --> Mix
    Out[Outbound channel] --> Mix
    Mix -->|yes| Leak([Data leaves])
    Mix -->|no| Boring([Trick is boring])`,
            `class Leak,Boring hub
    class Data,Untrust,Out grp1
    class Mix grp2`
          ),
        },
      ],
    },
    {
      id: "when-tricks-succeed",
      level: "advanced",
      title: "What normal looks like, and how this fails",
      body: [
        "Now that you understand the simple system, look at what breaks it. Normal behaviour: the helper calls two named lookups, drafts a short note, and stops. A human sends the note. The audit log shows a known tool, a known tenant, and a draft id.",
        "Imagine the document contains instructions. The model asks for a tool you did not grant. If your gateway returns a vague error, the model retries ten times and you pay for ten completions. If it returns a specific denial — 'tool_not_allowed: query_db' — the model usually continues with the tools it has.",
        "Another break: you granted the named tools, but the database role behind them is still the warehouse admin. The function text says SELECT on purchase_orders. The live grant says SELECT on everything. The live grant wins. Always compute permissions from the running system, not from the comment in the pull request.",
        "A third break: the same toolbox is shared across helpers. The support helper inherited send-email from the finance helper 'just in case'. On a quiet Tuesday the support helper mailed a log excerpt to an address found in a ticket. Permission creep is how last quarter's convenience becomes this quarter's incident.",
        "The advanced technique is a stolen-prompt table. Pretend the attacker owns the instructions completely. For each tool, write the worst call and the worst outcome. If that outcome is 'a wrong draft a human rejects', you are done. If it is 'customer rows in an email', the prompt cannot save you. The table is the review artefact. Keep it in the repo. Widening a grant means editing the table.",
      ],
    },
    {
      id: "production-controls",
      level: "advanced",
      title: "Production: caps, credentials, and a monthly audit",
      body: [
        "Remind yourself of the simple version: four named functions and a draft queue. Real traffic adds volume, retries, and forgotten side doors. That is why production adds mechanical limits you could write as if-statements.",
        "Time-box credentials. The helper should not hold a long-lived warehouse password. At call time, exchange the helper's identity for a short token scoped to one operation. A token that leaks into a log should be useless ten minutes later.",
        "Cap the blast radius in arguments: per-run call budget, row caps, one recipient resolved in code, no attachments unless a human attached them. Return machine-readable denials. Your error messages are prompts. 'invalid' does not help. 'row_cap 50, asked 500' does.",
        "Audit surprising allows, not only denials. A tool used for the first time in sixty days. A column no test case ever touches. An outbound action in the same run as untrusted ingest. Those signals are cheap if every call writes a small audit row: actor, tenant, tool, decision, redacted args.",
        "Rehearse. Inject a harmless canary through the real inbox — white text that asks for a customers query — and confirm the gateway denies it and an alert fires. A permission model you have never attacked is a document, not a control.",
      ],
      diagrams: [
        {
          title: "Intent versus live grants",
          caption: "The finding is the gap. Config is what you meant. Live grants are what you shipped.",
          chart: chart(
            `flowchart LR
    Intent[Config: 4 tools] --> Gap{Diff}
    Live[Live grants] --> Gap
    Gap --> Report[Permission report]
    Report --> First[First-use tool]
    Report --> Col[Unexpected column]
    Report --> Pair[Outbound after ingest]
    First --> Act{Still needed}
    Col --> Act
    Pair --> Act
    Act -->|no| Revoke([Revoke])
    Act -->|yes| Docu([Update worst-call table])`,
            `class Gap,Revoke,Docu hub
    class Intent,Live grp1
    class Report,First,Col,Pair grp3
    class Act grp2`
          ),
        },
      ],
    },
    {
      id: "when-not-to-shrink",
      level: "advanced",
      title: "Judgement: when to shrink, when a human should just do it",
      body: [
        "Least privilege is useful when the helper must touch real systems on every run. It is the wrong investment when the helper only drafts text a person will paste by hand. In that case the toolbox is empty on purpose.",
        "Do not shrink so far that the job is impossible. If matching invoices truly requires a join across three tables, write a named function that does that join and returns a fixed column set. That is still a capability, not a language. The model never sees SQL.",
        "Do not put the permission check in the model. 'Please do not call issue_refund twice' is not a cap. A ledger the tool consults before it moves money is a cap. The model is one more untrusted input to that ledger.",
        "When two helpers must cooperate, pass a typed summary, not raw documents plus a shared god tool. The reader helper sees untrusted PDFs and may only emit a schema. The matcher helper sees purchase orders and never sees the raw PDF. That cut is an architecture, not a prompt sentence.",
        "You should now be able to teach this: start from the job, list the five actions it needs, delete any action that is a language, inject identity in code, draft the irreversible writes, and assume the next PDF will try to steal the keys.",
      ],
    },
  ],

  workedExample: {
    title: "Shrink the invoice helper without losing the job",
    setup:
      "You own the helper from the story. Tools today: read_inbox, query_db, send_email. query_db uses the warehouse admin login. send_email takes any address. The job is still: catch purchase-order mismatches and contact the vendor.",
    walkthrough: [
      "Step 1 — Understand the problem. Pretend the attacker owns the prompt. Worst call for query_db is 'read the customers table'. Worst call for send_email is 'mail anything in context to any address'. Two of three tools are unacceptable. This is a toolbox problem.",
      "Step 2 — Identify the relevant concept. Three leak ingredients are present: private data, untrusted PDFs, and an outbound channel. Least privilege here means cutting at least one edge, preferably two, while keeping the mismatch job.",
      "Step 3 — Build the simplest solution. Delete query_db. Add get_purchase_order(po_number) and get_vendor(vendor_id). Keep read_inbox. Replace send_email with draft_email(to_vendor_id, body).",
      "Step 4 — Improve it. Create a database role that can SELECT only the columns those two functions need. Resolve the vendor address in code. Cap the draft body at 4000 characters. Forbid attachments in the schema.",
      "Step 5 — Handle a failure. When the model asks for query_db, return tool_not_allowed with that name. Do not return a stack trace. Confirm a canary PDF that asks for customers is denied and still produces a useful draft.",
      "Step 6 — Production version. Inject tenant_id from the session. Write an audit row per call. Alert if an outbound draft is created in the same run as raw PDF ingest. Rehearse the canary on a schedule.",
    ],
    result:
      "The next injected invoice is boring. The model proposes a customers lookup, the gateway denies it, the helper fetches the purchase order and vendor, and a human sends a short mismatch note. Even if the gateway is misconfigured, the database role cannot see customers. The prompt is not one of the locks.",
  },

  practice: {
    title: "Scope an on-call assistant",
    task:
      "An on-call helper is asked to triage alerts. Proposed tools: run_promql(query), kubectl(command), search_runbooks(text), read_logs(service, since), post_slack(channel, message), create_incident(title, severity), page_oncall(rotation). It reads alert payloads and log lines — text you do not control. Think about: which tools are languages, which writes are irreversible, and which leak ingredients are present. Name the one tool you delete outright, and say what you replace it with.",
    hint:
      "Two tools accept a language rather than a capability. One of them is 'read-only'. Log lines can carry attacker text, because anyone who can hit your service can write a log line. Expected reasoning: delete the god tool, draft or cap the irreversible writes, treat logs as untrusted.",
    solution:
      "Delete kubectl(command). It is a god tool: delete, exec, and edit all hide in one string. Replace it with named functions such as restart_deployment(name, namespace) and get_pod_status(name, namespace). Narrow run_promql with a time-range cap. Restrict post_slack to a hardcoded internal channel. Make page_oncall a confirm or a rate-capped action, because you cannot unpage a human. Why this works: the menu no longer contains a language, irreversible actions have a human or a cap, and logs are treated as untrusted input. Common wrong approach: keep kubectl 'for emergencies' and ask the prompt not to use it.",
  },

  takeaways: [
    "Least privilege means the smallest toolbox that can finish the job — tools, credentials, and arguments, not a stern sentence in the prompt.",
    "A god tool accepts a language (SQL, shell, URL, code). Replace it with named functions that return a fixed shape.",
    "Read-only is not the same as safe. A broad read plus any outbound channel is a leak waiting for a document.",
    "The model is not a person. Identity and tenant must be stamped by your gateway, never accepted as model arguments.",
    "Injection becomes exfiltration when private data, untrusted content, and an outbound channel sit in the same helper. Cut at least one edge.",
    "Draft irreversible writes, cap arguments in code, and audit live grants — including first-use tools you did not expect.",
  ],

  mistakes: [
    "Mistake: calling a toolbox minimal because it has three names. Why people make it: demos reward a short list. What actually happens: one name still accepts any SQL. Better approach: count capabilities and languages, not entries.",
    "Mistake: trusting 'never share customer data' as a control. Why people make it: prompts are cheap. What actually happens: the next PDF is followed instead. Better approach: assume the trick works and shrink the grant.",
    "Mistake: letting the model supply tenant_id. Why people make it: it is an easy function argument. What actually happens: a confused deputy reads another customer. Better approach: inject identity from the session.",
    "Mistake: keeping shell or code execution 'just for debugging' in production. Why people make it: it is convenient. What actually happens: every input can reach it. Better approach: delete it from the production menu.",
    "Mistake: treating your own UI as safe. Why people make it: there is no send tool. What actually happens: markdown images fetch a remote URL. Better approach: ask whether any attacker string can cause a network request.",
    "Mistake: reviewing the config file instead of live grants. Why people make it: config is nearby. What actually happens: the warehouse admin login is still on the helper. Better approach: query the real role and rehearse a canary.",
  ],

  interviews: [
    {
      difficulty: "easy",
      question: "What does least privilege mean for an AI helper, and why is read-only not the same as safe?",
      answer:
        "What they are testing: can you define the idea without jargon, then separate integrity from confidentiality. Good answer: the helper gets the smallest tools, credentials, and arguments that still finish the job. Read-only only means you cannot corrupt data. A wide read plus a send is still a leak. Why that is good: it starts from the job, not from a slogan, and it uses the invoice shape. Follow-up: give one god tool and the named functions you would replace it with.",
    },
    {
      difficulty: "medium",
      question: "Walk through a stolen-prompt exercise on a three-tool helper.",
      answer:
        "What they are testing: whether you review the grant, not the prompt. Good answer: assume the attacker owns the instructions. For each tool write the worst call and outcome. If the outcome is a rejected draft, stop. If it is customer rows in an email, change the toolbox. Keep the table in the repo so a wider grant must edit it. Why that is good: it turns a vibe into a review artefact. Follow-up: which of the three leak ingredients would you cut first, and why?",
    },
    {
      difficulty: "hard",
      question: "A helper needs private data, reads vendor PDFs, and can send email. How do you make the next injection boring?",
      answer:
        "What they are testing: layered controls and missed channels. Good answer: shrink data to named lookups on a column-scoped role; turn send into a draft whose address is resolved in code; optionally split into two helpers so the matcher never sees raw PDF text. Mention UI image loads as a silent channel. Why that is good: it removes edges instead of adding prompt rules, and it names a channel people forget. Follow-up: what would you alert on after this ships?",
    },
  ],

  glossary: [
    {
      term: "Tool",
      meaning:
        "A function the model is allowed to request by name. Why it matters: the tool list is the real menu of actions, not the chat text.",
    },
    {
      term: "Least privilege",
      meaning:
        "Give the smallest permission that still finishes the job. Why it matters: a tricked model can only do what you already allowed.",
    },
    {
      term: "God tool",
      meaning:
        "One tool that accepts a whole language, such as SQL or a shell command. Why it matters: you cannot review what you granted.",
    },
    {
      term: "Confused deputy",
      meaning:
        "A helper uses its own powerful badge, steered by someone else's input. Why it matters: this is how one tenant's data is read as another.",
    },
    {
      term: "Exfiltration",
      meaning:
        "Private data leaving without permission. Why it matters: it is the usual successful-injection outcome when a send channel exists.",
    },
    {
      term: "Draft-then-confirm",
      meaning:
        "The helper writes a reviewable artifact; a human clicks the irreversible action. Why it matters: it is the cheapest lock for email, publish, and paging.",
    },
  ],
};
