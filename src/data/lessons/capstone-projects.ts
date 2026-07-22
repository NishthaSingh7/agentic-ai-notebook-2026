import type { LessonContent } from "../lesson-types";
import { createLesson, iq } from "./builder";

export const capstoneProjectsLessons: Record<string, LessonContent> = {
  "ai-software-engineer": createLesson({
    concept:
      "An AI Software Engineer is an autonomous coding agent that receives a GitHub issue or natural-language feature request, explores the repo, plans file-level changes, writes patches, runs tests in a sandbox, and opens a pull request — with human approval before merge.",
    whyItExists:
      "This capstone proves you can build the same plan→code→test→review loop used by Cursor, Devin, and internal codegen bots — not a chatbot that pastes code snippets.",
    analogy:
      "A junior engineer with terminal access and a PR template — you remain the tech lead who approves the plan and merges.",
    technicalExplanation:
      "Core loop: ingest task → build repo map (tree + key files) → planner decomposes into steps → coder applies unified diffs → sandbox runs lint/test → on failure, debugger agent reads stderr and retries (max N). State persisted in LangGraph checkpoints. Tools: read_file, search_repo, apply_patch, run_terminal, create_pr. Guardrails: file allowlist, no .env reads, max 20 files touched, tests must pass before PR.",
    architecture:
      "FastAPI gateway receives tasks from GitHub webhooks or CLI. Orchestrator (LangGraph) owns AgentState: {task, repo_map, plan, patches, test_output, pr_url}. Planner node calls GPT-4o with repo context. Coder node uses structured apply_patch. Sandbox worker (Docker) clones repo, applies diff, runs pytest/ruff. Reviewer node summarizes diff for human. Redis stores job queue; Postgres logs traces.",
    diagram: `flowchart TD
    subgraph Input
      A[GitHub Issue / CLI Task] --> B[Repo Clone + Index]
    end
    B --> C[Planner Agent]
    C --> D{Plan Approved?}
    D -->|Human| E[Coder Agent]
    D -->|Reject| C
    E --> F[Apply Patch to Files]
    F --> G[Sandbox: lint + pytest]
    G -->|Fail| H[Debugger Agent reads stderr]
    H --> E
    G -->|Pass| I[Reviewer summarizes diff]
    I --> J[Open Pull Request]
    J --> K[Human Merge]`,
    example:
      "Issue: 'Add rate limiting to POST /login.' Planner identifies auth middleware and tests. Coder adds token-bucket decorator. Sandbox runs 47 tests — 1 fails. Debugger fixes off-by-one in window size. Reviewer opens PR #142 with benchmark table showing 429 responses after 10 req/min.",
    code: `# LangGraph-style state (simplified)
class AgentState(TypedDict):
    task: str
    plan: list[str]
    patches: list[str]
    test_log: str
    attempts: int

def coder_node(state):
  patch = llm.invoke(f"Task: {state['task']}\\nPlan step: {state['plan'][0]}")
  result = sandbox.apply_and_test(patch)
  return {"patches": [patch], "test_log": result.log, "attempts": state["attempts"] + 1}`,
    project:
      "Week 1: Repo indexer + read/search tools. Week 2: Planner + apply_patch coder. Week 3: Docker sandbox with pytest gate. Week 4: GitHub PR integration + LangSmith traces. Eval on 10 small bugs from SWE-bench-lite.",
    interviewQuestions: [
      iq("How do you prevent an AI software engineer from editing the wrong files?", "Repo map + path allowlist, max files per task, require planner to cite target paths, diff review before apply, and human approval on large changes.", "hard"),
      iq("What happens when tests fail after a patch?", "Route to debugger node with stderr + failed test names; retry with capped attempts; escalate to human if still failing after 3 loops.", "medium"),
      iq("Why sandbox tests instead of trusting the LLM?", "LLMs hallucinate success; only executed tests prove correctness. Sandbox also isolates rm -rf and network risks.", "easy"),
    ],
    revisionNotes: {
      fiveMin: ["Plan → Code → Test → PR loop", "Sandbox is mandatory", "Human approves plan + merge"],
      fifteenMin: ["LangGraph state: task, plan, patches, test_log", "Tools: read, search, patch, terminal", "Guardrails: file limits, no secrets"],
      oneHour: ["Build repo indexer", "Add sandbox pytest gate", "Open PR on green tests"],
      cheatSheet: ["Planner → Coder → Sandbox → PR", "apply_patch not full file rewrite", "Max retry on test fail"],
    },
    glossary: ["Repo Map", "Apply Patch", "Sandbox", "SWE-bench"],
    commonMistakes: [
      "Letting the agent edit files without running tests",
      "Sending entire repo in every prompt instead of retrieval",
      "No human gate before merge to main",
    ],
  }),

  "ai-research-assistant": createLesson({
    concept:
      "An AI Research Assistant ingests PDFs, arXiv papers, and bookmarks — then answers research questions with citation-backed summaries, comparison tables, and gap analysis, never citing a paper it did not retrieve.",
    whyItExists:
      "Researchers need synthesis across dozens of sources. This capstone demonstrates grounded generation, citation enforcement, and academic tool integration.",
    analogy:
      "A PhD student who highlights every claim with a page number — if they can't find the source, they say 'I don't know.'",
    technicalExplanation:
      "Ingestion: GROBID/Unstructured parse PDFs → chunk by section → embed with metadata (title, authors, year, DOI). Query path: hybrid search (BM25 + vectors) → rerank top 20 → LLM answers with mandatory [doc_id:chunk] citations. Tools: arXiv_search, semantic_scholar_lookup, export_bibtex. Validator rejects sentences without citation anchors. Optional citation graph for 'papers that cite X'.",
    architecture:
      "Upload API → S3 storage → async ingestion worker → Pinecone/Chroma collections per project. FastAPI chat endpoint with user project scope. Citation validator post-processes LLM output. Frontend shows clickable citations jumping to PDF highlights.",
    diagram: `flowchart TD
    subgraph Ingestion
      A[PDF / arXiv URL] --> B[Parser GROBID]
      B --> C[Chunk by Section]
      C --> D[Embed + Metadata]
      D --> E[(Vector DB per Project)]
    end
    subgraph Query
      F[Research Question] --> G[Hybrid Search]
      G --> H[Reranker]
      H --> I[LLM Synthesis]
      I --> J{Citation Validator}
      J -->|Missing cite| I
      J -->|OK| K[Answer + BibTeX]
    end
    E --> G
    L[arXiv API] --> G`,
    example:
      "Question: 'Compare RAG eval metrics 2024–2025.' Agent retrieves 14 chunks from 9 papers, outputs table (RAGAS faithfulness, DeepEval, human eval cost) each row linked to DOI, exports references.bib.",
    project:
      "Build PDF upload, ingestion pipeline, chat with citations, and eval set of 20 questions where answers must match gold citations. Add arXiv search tool for live papers.",
    interviewQuestions: [
      iq("How do you reduce citation hallucination?", "Mandatory citation tokens in prompt, post-validation rejecting uncited claims, retrieve-before-generate only, low temperature.", "hard"),
      iq("Why chunk by section not fixed size for papers?", "Sections preserve argument structure; fixed chunks split theorems from proofs.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["Retrieve → Cite → Answer", "Reject uncited claims", "Metadata: DOI, year, authors"],
      fifteenMin: ["GROBID parsing", "Hybrid search + rerank", "Citation validator loop"],
      oneHour: ["Ingest 5 PDFs", "Chat with clickable cites", "Export BibTeX"],
      cheatSheet: ["No cite = no claim", "Chunk by section", "arXiv + vector hybrid"],
    },
    glossary: ["Citation Grounding", "GROBID", "Hybrid Search", "Gap Analysis"],
    commonMistakes: ["Letting LLM cite from training memory", "Fixed-size chunks on academic PDFs", "No reranker on retrieval"],
  }),

  "ai-customer-support": createLesson({
    concept:
      "An AI Customer Support Agent handles tier-1 tickets: authenticates users, answers from policy KB, looks up orders, processes refunds within policy, and escalates to humans on anger, legal threats, or high-value actions.",
    whyItExists:
      "Enterprise AI's most common production pattern — RAG + tools + guardrails + escalation. This capstone mirrors Zendesk/Intercom AI deployments.",
    analogy:
      "The best support rep who memorized the handbook and can pull up your order in two seconds — but calls a supervisor for refunds over $100.",
    technicalExplanation:
      "Router classifies intent (order_status, refund, product_question, angry). RAG over KB with tenant ACL. Tools: lookup_order(user_id), create_refund(order_id) gated by policy engine, escalate(ticket_id). Sentiment score > threshold → human. Every tool call logged with trace_id. Eval on 500 redacted historical tickets.",
    architecture:
      "Zendesk webhook → queue → agent worker. Identity from session JWT. Vector DB per brand. Policy engine (rules JSON) approves refunds. Human inbox for escalations. Datadog dashboards: resolution rate, escalation rate, hallucination eval.",
    diagram: `flowchart TD
    A[Customer Message] --> B[Intent + Sentiment Router]
    B -->|Angry / Legal| H[Human Agent Inbox]
    B -->|FAQ| C[KB RAG Retrieval]
    B -->|Order| D[lookup_order Tool]
    B -->|Refund| E[Policy Engine]
    C --> F[LLM Response]
    D --> F
    E -->|Under limit| G[create_refund Tool]
    E -->|Over limit| H
    G --> F
    F --> I[Send Reply + Log Trace]`,
    example:
      "Customer: 'Where is order #8821?' Agent verifies session, calls order API, replies with tracking link. Follow-up: 'Refund it' — policy allows <$50 auto; order is $120 → creates escalation ticket with full context for human.",
    project:
      "Mock Zendesk webhook, fake order API, KB with 30 articles, policy rules for refunds, escalation UI, and eval harness measuring resolution without hallucinated policies.",
    interviewQuestions: [
      iq("When must you escalate instead of auto-replying?", "High negative sentiment, legal keywords, refund over threshold, low retrieval confidence, repeated failed resolution.", "medium"),
      iq("How do you eval a support agent?", "Resolution rate, CSAT proxy, citation match to KB, tool call correctness, escalation appropriateness on labeled set.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["Router → RAG or Tools", "Policy gate on refunds", "Escalate on anger"],
      fifteenMin: ["Intent + sentiment classifier", "ACL on KB chunks", "Trace every tool call"],
      oneHour: ["Build order lookup tool", "Add refund policy engine", "Eval 50 tickets"],
      cheatSheet: ["Never invent policy", "Auth before order lookup", "Escalation thresholds"],
    },
    glossary: ["Intent Router", "Policy Engine", "CSAT", "Escalation"],
    commonMistakes: ["Refunds without policy check", "KB without ACL per customer tier", "No sentiment-based escalation"],
  }),

  "ai-resume-reviewer": createLesson({
    concept:
      "An AI Resume Reviewer parses a CV and job description, scores fit across rubric dimensions (skills, impact, clarity), suggests bullet rewrites, and flags gaps — with bias guardrails and explainable scores.",
    whyItExists:
      "Document scoring with structured outputs applies to hiring, lending, and compliance. Shows rubric eval, PII handling, and bias mitigation.",
    analogy:
      "A career coach with a scoring rubric on a clipboard — every point links to a specific resume line.",
    technicalExplanation:
      "Pipeline: PDF/DOCX parse → section detection (experience, skills, education) → extract entities → align to JD requirements via embedding similarity + keyword rules → score 5 dimensions → generate structured JSON feedback. No scoring on name, gender, age proxies. Audit log for recruiter review.",
    architecture:
      "Upload endpoint → parser worker → scoring service → results stored per session. JD pasted or uploaded separately. Frontend shows heatmap of skill match and suggested bullet diffs.",
    diagram: `flowchart TD
    A[Resume PDF] --> B[Parser: sections + bullets]
    C[Job Description] --> D[Requirement Extractor]
    B --> E[Skill + Impact Extractor]
    D --> F[Alignment Engine]
    E --> F
    F --> G[Rubric Scorer]
    G --> H[5 Dimensions JSON]
    H --> I[LLM: Rewrite Suggestions]
    I --> J[Bias Filter]
    J --> K[Report UI]`,
    example:
      "Senior ML Engineer JD uploaded. Resume scores 7/10 technical fit — missing MLOps and Kubernetes. Suggests rewriting 'Built recommendation model' → 'Built rec sys serving 2M users, +12% CTR, deployed on K8s'.",
    project:
      "Build parser, rubric scorer, structured output schema, bias filter stripping protected attributes, and 20 resume/JD pairs with human-labeled scores for calibration.",
    interviewQuestions: [
      iq("How do you mitigate hiring bias in resume AI?", "Exclude protected-attribute features, audit score distribution across demographics on synthetic tests, human-in-loop for final decisions, transparent rubric.", "hard"),
      iq("Why structured JSON output vs free text?", "Consistent UI, downstream ATS integration, easier eval against gold rubric scores.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["Parse → Align → Score → Suggest", "Rubric dimensions explicit", "Bias filter mandatory"],
      fifteenMin: ["Section-aware parsing", "JD requirement extraction", "Structured JSON output"],
      oneHour: ["Score 10 resume/JD pairs", "Add bullet rewrite suggestions", "Calibrate vs human labels"],
      cheatSheet: ["No demographic scoring", "Cite resume lines in feedback", "Quantify impact in rewrites"],
    },
    glossary: ["Rubric Scoring", "Skill Alignment", "Bias Mitigation", "Structured Output"],
    commonMistakes: ["Scoring on university name prestige as proxy", "Free-text scores without rubric", "No explainability per dimension"],
  }),

  "ai-travel-planner": createLesson({
    concept:
      "An AI Travel Planner is a multi-tool agent that searches flights and hotels, respects budget/date constraints, builds day-by-day itineraries with transit times, and revises plans based on user feedback — with live prices and booking links, never fake confirmations.",
    whyItExists:
      "Classic constraint-satisfaction + tool orchestration capstone. Proves you can coordinate APIs, maintain itinerary state, and handle user iteration.",
    analogy:
      "A travel agent juggling six browser tabs who remembers you hate 6am flights and need vegetarian restaurants.",
    technicalExplanation:
      "State: ItineraryState {destination, dates, budget, prefs, days[]}. Tools: search_flights, search_hotels, get_weather, places_nearby, estimate_transit. Loop: gather options → score by prefs → assemble schedule → present → revise. Price timestamps on every quote. Fallback when API fails partial results.",
    architecture:
      "Streamlit or Next.js UI. LangGraph agent with itinerary state checkpointed. Amadeus/Google Places APIs (or mocks). Validator ensures budget not exceeded before finalizing.",
    diagram: `flowchart TD
    A[User: Tokyo 5d under $3K] --> B[Parse Constraints]
    B --> C[search_flights Tool]
    B --> D[search_hotels Tool]
    C --> E[Option Scorer]
    D --> E
    E --> F[Day Planner Agent]
    F --> G[places_nearby + transit]
    G --> H{Draft Itinerary}
    H -->|User revises| F
    H -->|Approved| I[Export PDF + Booking Links]`,
    example:
      "Tokyo April, $3K, vegetarian. Agent finds HND flights $680, hotel Shinjuku $900, schedules Fushimi Inari day with metro times, highlights vegan ramen spots, total $2,840 with booking URLs.",
    project:
      "Mock flight/hotel APIs, itinerary state machine, budget validator, revision loop in chat, export markdown itinerary with price breakdown.",
    interviewQuestions: [
      iq("How do you handle stale flight prices?", "Timestamp every quote, re-fetch before booking step, warn user if price changed >5%.", "medium"),
      iq("Why separate planner state from chat history?", "Itinerary is structured data flights/hotels/days — easier to validate constraints than parsing free text.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["Tools: flights, hotels, places", "ItineraryState object", "Budget validator"],
      fifteenMin: ["Score options by prefs", "Revision loop on user feedback", "Never invent booking IDs"],
      oneHour: ["Mock APIs", "Build 3-day itinerary", "Add budget check"],
      cheatSheet: ["Live prices + timestamp", "Constraint satisfaction", "Booking links not fake confirms"],
    },
    glossary: ["Itinerary State", "Constraint Satisfaction", "Tool Orchestration", "Price Staleness"],
    commonMistakes: ["Hallucinated confirmation numbers", "Ignoring transit time between activities", "No budget sum validation"],
  }),

  "ai-meeting-assistant": createLesson({
    concept:
      "An AI Meeting Assistant transcribes calls, identifies speakers, extracts decisions and action items with owners/dates, and posts structured summaries to Slack/Jira — with consent, retention limits, and faithful summarization evals.",
    whyItExists:
      "Combines STT, diarization, NER, and integrations — a pattern every enterprise productivity team builds.",
    analogy:
      "The colleague who sends the 'here's what we decided' email within 5 minutes of hang-up — with timestamps.",
    technicalExplanation:
      "Audio → Whisper/Deepgram STT → diarization (pyannote) → chunk by speaker turn → LLM extract {decisions[], actions[], parking_lot[]} with schema → NER links names to directory → tools: post_slack, create_jira_task. Redact SSN/credit patterns. Eval: ROUGE + human faithfulness on 30 meetings.",
    architecture:
      "Zoom/Meet bot or upload endpoint → async pipeline → webhook to Slack. Postgres stores transcripts with TTL. OAuth to Jira. Admin sets retention 90 days.",
    diagram: `flowchart TD
    A[Meeting Audio / Recording] --> B[STT Whisper]
    B --> C[Speaker Diarization]
    C --> D[Transcript Chunks by Speaker]
    D --> E[LLM Structured Extract]
    E --> F[Decisions]
    E --> G[Action Items + Owners]
    E --> H[Parking Lot]
    G --> I[create_jira_task Tool]
    F --> J[post_slack_summary Tool]
    H --> J
    K[PII Redactor] --> D`,
    example:
      "45-min sprint planning. Output: 3 decisions (scope cut X), 5 Jira tasks with assignees, Slack message with link to timestamped transcript at decision moments.",
    project:
      "Upload WAV, run pipeline, structured JSON output, Slack webhook mock, faithfulness eval comparing to human notes.",
    interviewQuestions: [
      iq("How do you eval meeting summary quality?", "Human rating on faithfulness, action item recall/precision, decision completeness; automated schema validation.", "medium"),
      iq("What privacy controls are required?", "Consent banner, retention TTL, PII redaction, access control on transcripts, opt-out per meeting.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["STT → Diarize → Extract → Integrate", "Structured output schema", "PII redaction"],
      fifteenMin: ["Whisper + pyannote", "Jira + Slack tools", "Faithfulness eval"],
      oneHour: ["Process sample recording", "Post Slack summary", "Create Jira from actions"],
      cheatSheet: ["Timestamp decisions", "Owner NER from directory", "Retention policy"],
    },
    glossary: ["Diarization", "Action Item Extraction", "Faithfulness Eval", "Retention TTL"],
    commonMistakes: ["Summaries without speaker attribution", "Missing consent for recording", "Inventing action items not in transcript"],
  }),

  "autonomous-browser-agent": createLesson({
    concept:
      "An Autonomous Browser Agent uses Playwright to observe web pages (DOM + optional vision), plan click/type/navigate actions, and complete multi-step workflows like invoice downloads or form submissions — with domain allowlists and human approval on login/payment.",
    whyItExists:
      "Many enterprise workflows have no API. Browser agents prove computer-use, safety, and verification loops.",
    analogy:
      "A remote desktop operator who screen-records every click — and stops to ask you before paying or deleting anything.",
    technicalExplanation:
      "Observe: accessibility tree + optional screenshot to vision LLM. Plan: next action from enum {click, type, scroll, wait, done}. Execute via Playwright. Verify: URL changed, element appeared, download started. Credentials from vault injection, never in prompts. MAX_STEPS=30, domain allowlist.",
    architecture:
      "Agent API spawns browser container per job. Vault sidecar injects secrets. Screenshot audit trail to S3. Human approval webhook pauses on sensitive selectors (password, pay, delete).",
    diagram: `flowchart TD
    A[Goal: Download invoices] --> B[Playwright Browser]
    B --> C[Snapshot: AX Tree + Screenshot]
    C --> D[Planner LLM]
    D --> E{Action Type}
    E -->|click/type| F[Execute on Page]
    E -->|sensitive| G[Human Approval Gate]
    G --> F
    E -->|done| H[Verify Result]
    F --> I{Success?}
    I -->|No| C
    I -->|Yes| D
    H --> J[Upload to Drive + Notify]`,
    example:
      "Goal: download last month's invoices from vendor portal. Agent logs in (vault creds), navigates Reports → Invoices → Download, verifies PDF count, uploads to Google Drive, emails finance spreadsheet summary.",
    code: `async def step(page, goal, history):
    snapshot = await page.accessibility.snapshot()
    action = await planner.next(goal, snapshot, history)
    if action.type == "click_login" and not action.approved:
        await request_human_approval(action)
    await execute(page, action)
    return await verify(page, action)`,
    project:
      "Playwright agent on mock vendor site, domain allowlist, step cap, screenshot log, human approval on login button, success eval on file download.",
    interviewQuestions: [
      iq("How do you prevent prompt injection from malicious web pages?", "Domain allowlist, ignore instructions in page text, separate system prompt, human gate on unexpected actions.", "hard"),
      iq("AX tree vs screenshot vision?", "AX tree faster and precise for forms; vision needed for canvas/maps. Hybrid is production default.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["Observe → Plan → Act → Verify loop", "Domain allowlist", "Human gate on sensitive actions"],
      fifteenMin: ["Playwright accessibility snapshot", "MAX_STEPS cap", "Vault for credentials"],
      oneHour: ["Automate login + download on test site", "Add screenshot audit", "Approval on payment buttons"],
      cheatSheet: ["Never creds in prompt", "Verify after each action", "CAPTCHA → human"],
    },
    glossary: ["Playwright", "Accessibility Tree", "Domain Allowlist", "Human-in-the-Loop"],
    commonMistakes: ["Unbounded step loops", "Credentials in LLM context", "No verification after click"],
  }),

  "multi-agent-coding-assistant": createLesson({
    concept:
      "A Multi-Agent Coding Assistant uses a supervisor orchestrating Planner, Implementer, Tester, and Reviewer agents — each with narrow tools and context — to deliver large features with less hallucination than a single monolithic coding agent.",
    whyItExists:
      "Shows supervisor pattern, role specialization, and shared state — how real 'AI dev teams' are architected at scale.",
    analogy:
      "Sprint team in one repo: architect writes spec, dev codes, QA breaks it, senior dev reviews — you merge when green.",
    technicalExplanation:
      "Supervisor (LangGraph) routes based on state.phase. Planner outputs spec.md only. Implementer has edit tools only. Tester runs pytest only, returns failures. Reviewer checks style/security, no edit rights. Shared blackboard: spec, diff, test_log. Max 5 review rounds then human.",
    architecture:
      "Single repo clone in shared volume. Each agent has system prompt + tool subset. Message bus via LangGraph state. Traces show handoffs. Git branch per feature.",
    diagram: `flowchart TD
    A[User: Add OAuth login] --> S[Supervisor Agent]
    S --> P[Planner Agent]
    P -->|spec.md| S
    S --> I[Implementer Agent]
    I -->|code diff| S
    S --> T[Tester Agent]
    T -->|pass| S
    T -->|fail + logs| I
    S --> R[Reviewer Agent]
    R -->|approve| S
    R -->|changes requested| I
    S --> PR[Open Pull Request]`,
    example:
      "OAuth feature: Planner writes 8-step spec. Implementer adds routes + tests. Tester fails on callback URL. Implementer fixes. Reviewer flags missing state param. Implementer patches. Tester passes. PR opened.",
    project:
      "LangGraph supervisor with 4 role agents, shared repo volume, handoff messages, max round limit, trace UI showing agent transitions.",
    interviewQuestions: [
      iq("When is multi-agent better than single agent for coding?", "Large features needing spec+test+review separation; context too big for one window; when roles reduce tool confusion.", "hard"),
      iq("How do you prevent infinite reviewer-implementer loops?", "Max rounds counter, escalate to human, require explicit 'approved' signal from reviewer.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["Supervisor routes phases", "Separate tool sets per role", "Max review rounds"],
      fifteenMin: ["Planner: spec only", "Tester: pytest only", "Shared blackboard state"],
      oneHour: ["Build 4-agent graph", "OAuth sample feature", "Trace handoffs in LangSmith"],
      cheatSheet: ["Role separation reduces errors", "Tester never writes code", "Human after max rounds"],
    },
    glossary: ["Supervisor Pattern", "Blackboard State", "Role Specialization", "Handoff"],
    commonMistakes: ["All agents with all tools", "No test gate before review", "Unbounded implementer-reviewer loops"],
  }),

  "enterprise-knowledge-assistant": createLesson({
    concept:
      "An Enterprise Knowledge Assistant is a governed RAG copilot over SharePoint/Confluence/Drive — with SSO identity, document-level ACL sync, citation-backed answers, audit logs, and human approval on bulk export or external email.",
    whyItExists:
      "The portfolio piece that combines enterprise RAG, RBAC, compliance, and observability — what Fortune 500 internal copilots actually look like.",
    analogy:
      "Company Wikipedia that knows what you're allowed to see — interns don't get the salary spreadsheet even if they ask nicely.",
    technicalExplanation:
      "Ingestion worker syncs docs + ACL bitmap per chunk. Query: SSO identity → filter vector search by allowed doc IDs → hybrid retrieve → rerank → LLM with citations. High-risk tools (bulk_export, send_external_email) need approval queue. Admin dashboard: queries, denials, stale docs.",
    architecture:
      "Identity from Okta/SAML. Ingestion: connector per source, ACL metadata on every chunk. API gateway logs query+chunks+user. Approval service for risky actions. Redis cache for frequent queries per role.",
    diagram: `flowchart TD
    subgraph Ingestion
      A[SharePoint / Confluence / Drive] --> B[Connector Sync]
      B --> C[Chunk + ACL Metadata]
      C --> D[(Vector DB + ACL Index)]
    end
    subgraph Query
      E[Employee SSO Login] --> F[Identity + Roles]
      F --> G[Filtered Hybrid Search]
      D --> G
      G --> H[Rerank + LLM Answer]
      H --> I{Citations Valid?}
      I --> J[Response to User]
    end
    subgraph Governance
      K[Audit Log] --> L[Admin Dashboard]
      H --> K
      M[High-Risk Action] --> N[Human Approval Queue]
    end`,
    example:
      "Engineer asks 'KMS rotation runbook.' ACL allows platform-docs collection → retrieves runbook → cites steps → offers Jira change ticket. Intern asks executive comp → ACL denies retrieval → policy message, no chunks leaked.",
    project:
      "Mock SSO, two role types with different doc access, ingestion with ACL tags, audit log table, approval flow for export tool, eval per role on same questions.",
    interviewQuestions: [
      iq("How does ACL sync work with RAG?", "Store allowed_group_ids per chunk at ingest; at query filter by user's groups before vector search; never rely on post-hoc LLM filtering.", "hard"),
      iq("What must be in audit logs for compliance?", "User, timestamp, query, retrieved doc IDs, response hash, tool calls, approval decisions.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["ACL on chunks at ingest", "Filter retrieval by identity", "Audit every query"],
      fifteenMin: ["SSO + role mapping", "Approval queue for risky tools", "Admin stale-doc dashboard"],
      oneHour: ["Ingest docs with ACL tags", "Two-role eval suite", "Block unauthorized retrieval"],
      cheatSheet: ["Pre-filter vectors by ACL", "Citations mandatory", "Approval on export/email"],
    },
    glossary: ["ACL Sync", "Governed RAG", "Audit Trail", "SSO"],
    commonMistakes: ["Filtering sensitive docs only in prompt", "No audit log", "Skipping approval on bulk export"],
  }),
};
