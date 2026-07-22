/**
 * Topic-specific lesson content for Phases 13–16.
 * Consumed by scripts/generate-v2-lessons.mjs (or similar).
 */
export const topics = {
  // ─── Phase 13: Enterprise AI ───────────────────────────────────────────────

  "enterprise-rag": {
    concept:
      "Enterprise RAG extends retrieval-augmented generation with multi-tenant isolation, document-level permissions, freshness SLAs, and governance controls so LLM answers are grounded in authorized corporate knowledge at scale.",
    why:
      "Demo RAG works on a single PDF; enterprise RAG must serve thousands of users across HR, legal, and engineering docs without leaking data, serving stale policies, or hallucinating when retrieval fails.",
    analogy:
      "A corporate librarian who checks your badge before handing you folders, stamps documents with revision dates, and refuses to guess when the shelf is empty.",
    technical:
      "Architecture layers: ingestion pipelines (connectors for SharePoint, Confluence, S3, tickets), chunking strategies tuned per doc type, embedding + vector store with metadata filters (dept, classification, effective_date), hybrid search (BM25 + dense), rerankers, and query-time ACL enforcement before context reaches the LLM. Add citation requirements, confidence thresholds, and fallback responses when retrieval score is low. Monitor recall@k, answer faithfulness, and p95 latency per tenant.",
    example:
      "A sales rep asks 'What's our discount policy for renewals over $500K?' The agent retrieves only deal-desk docs their role can access, cites the Q3 policy PDF page 4, and refuses to answer if no authorized chunk exceeds the relevance threshold.",
    code: `async function enterpriseRagQuery(user, question) {
  const allowedSources = await acl.resolveSources(user.id, user.roles);
  const chunks = await hybridSearch(question, {
    filter: { tenant_id: user.tenant_id, source_id: { $in: allowedSources } },
    k: 12,
  });
  const reranked = await reranker.rank(question, chunks).slice(0, 5);
  if (reranked[0].score < 0.72) return { answer: null, reason: "insufficient_grounding" };
  return llm.generate({ question, context: reranked, requireCitations: true });
}`,
    glossary: ["Hybrid Search", "ACL Filtering", "Citation Grounding", "Reranking"],
  },

  "knowledge-bases": {
    concept:
      "Enterprise knowledge bases are curated, versioned repositories of structured and unstructured information — policies, runbooks, FAQs, product specs — designed for both human browse and machine retrieval by AI agents.",
    why:
      "Agents are only as good as the knowledge they can access. Without a governed KB, teams duplicate content, index stale wikis, and agents mix conflicting answers from random Slack threads.",
    analogy:
      "Wikipedia with an editorial board, access badges, and a 'last verified' sticker on every article — not a pile of sticky notes in everyone's desk drawer.",
    technical:
      "Model KB entities: documents, sections, owners, tags, lifecycle state (draft → published → archived), and sync provenance. Support incremental sync from source systems, deduplication, canonical URLs, and embedding refresh on publish. Expose APIs for agents (semantic search, get-by-id, related docs) and humans (browse UI). Define SLAs for freshness — e.g., security runbooks re-indexed within 15 minutes of edit. Pair with evaluation sets per domain.",
    example:
      "Engineering publishes a new incident runbook. The KB webhook triggers re-chunking and re-embedding; within 10 minutes the on-call agent retrieves the updated steps instead of last quarter's playbook.",
    code: `// KB publish webhook handler
app.post("/kb/publish", async (req) => {
  const doc = await kb.upsert({
    id: req.body.id,
    title: req.body.title,
    body: req.body.markdown,
    owner: req.body.owner,
    classification: req.body.classification,
    version: req.body.version,
    published_at: new Date(),
  });
  await ingestionQueue.enqueue({ docId: doc.id, action: "reindex" });
  await audit.log({ event: "kb.publish", docId: doc.id, actor: req.user.id });
});`,
    glossary: ["Canonical Document", "Incremental Sync", "Lifecycle State", "Provenance"],
  },

  rbac: {
    concept:
      "Role-Based Access Control (RBAC) assigns permissions to roles (e.g., analyst, manager, admin) rather than individuals, and enforces those permissions on every agent action — retrieval, tool calls, and data exports.",
    why:
      "An agent with broad API keys becomes a privilege escalation vector. RBAC ensures the AI can only do what the authenticated user (or service account) is allowed to do — no more.",
    analogy:
      "Hotel key cards: your card opens your floor and the gym, not the executive suite or the server room — regardless of how politely you ask the concierge.",
    technical:
      "Implement RBAC at three layers: (1) identity → roles mapping via IdP groups, (2) resource-level policies (document ACL, tool allowlists per role), (3) runtime enforcement in middleware before retrieval or tool execution. Use policy engines (OPA, Cedar) for complex rules. Agent service accounts get minimal scopes; user-delegated tokens carry the user's roles. Log denied actions. Test with matrix tests across roles.",
    example:
      "A junior support agent's chatbot can search public KB articles and create tickets, but cannot query revenue data or trigger refunds — the refund tool returns 403 unless the user has the 'billing-approver' role.",
    code: `function enforceToolAccess(user, toolName, payload) {
  const policy = rbac.getPolicy(user.roles);
  const decision = policy.evaluate("tool:" + toolName, { user, payload });
  if (!decision.allow) {
    audit.log({ event: "rbac.denied", user: user.id, tool: toolName });
    throw new ForbiddenError(decision.reason);
  }
  return decision;
}`,
    glossary: ["Role Mapping", "Policy Engine", "Least Privilege", "Delegated Identity"],
  },

  compliance: {
    concept:
      "Compliance in enterprise AI means designing agents to meet regulatory and contractual obligations — GDPR, HIPAA, SOC 2, industry-specific rules — across data handling, retention, explainability, and human oversight.",
    why:
      "A single agent logging PII to an unapproved region or making binding legal statements without audit trails can trigger fines, contract breaches, and loss of customer trust.",
    analogy:
      "Airline safety checklists: every flight follows the same inspected procedures whether the pilot is tired or the weather is clear — compliance isn't optional polish.",
    technical:
      "Map data flows: what PII enters prompts, where embeddings are stored, which subprocessors process data. Implement data residency controls, retention TTLs, right-to-erasure for user data in vector stores, and DPA-aligned vendor choices. Add guardrails for regulated content (medical, legal, financial advice disclaimers). Document model cards, risk assessments, and change management. Automate compliance checks in CI — e.g., block deployments that send EU data to non-EU endpoints.",
    example:
      "A healthcare agent detects PHI in a user message, redacts it before the LLM call, routes inference through a BAA-covered endpoint, and stores only hashed session IDs with a 30-day retention policy.",
    glossary: ["Data Residency", "PII Redaction", "Retention Policy", "DPA"],
  },

  identity: {
    concept:
      "Identity management ties every agent session to a verified principal — human user, service account, or delegated app — using standards like OAuth 2.0, OIDC, and SAML so actions are attributable and scoped.",
    why:
      "Without strong identity, agents run as anonymous super-users or share one API key. You cannot enforce RBAC, audit who did what, or revoke access when someone leaves the company.",
    analogy:
      "A corporate ID badge that also limits which doors open — not a shared master key taped under the reception desk.",
    technical:
      "Flow: user authenticates via IdP (Okta, Azure AD) → app receives JWT with sub, groups, tenant → agent runtime exchanges for short-lived tokens per downstream service. Support SSO, MFA at IdP, token refresh, and session revocation. For agent-to-agent calls, use workload identity (SPIFFE, managed identities). Never pass long-lived secrets in prompts. Propagate identity context in trace headers for end-to-end attribution.",
    example:
      "An employee opens the internal copilot; OIDC login yields a JWT with `groups: ['engineering']`. The agent uses that token to call GitHub as the user (not as a bot with org-wide admin) and only sees repos the user already has access to.",
    code: `// OIDC middleware — attach identity to agent context
app.use(async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const claims = await oidc.verify(token);
  req.agentContext = {
    userId: claims.sub,
    tenantId: claims.tid,
    roles: claims.groups ?? [],
    sessionId: crypto.randomUUID(),
  };
  next();
});`,
    glossary: ["OIDC", "JWT Claims", "Workload Identity", "Token Delegation"],
  },

  "audit-logs": {
    concept:
      "Audit logs are immutable, searchable records of who did what, when, and with what outcome — covering prompts, retrievals, tool calls, policy decisions, and human approvals in agent systems.",
    why:
      "When legal asks 'who accessed customer X's data?' or security investigates a bad output, you need tamper-evident logs — not scattered application debug prints.",
    analogy:
      "Security camera footage with timestamps and badge IDs — not a colleague's memory of what happened last Tuesday.",
    technical:
      "Log schema: timestamp, trace_id, actor_id, tenant_id, action, resource, input_hash, output_hash, policy_result, model_id, token_count, latency_ms. Ship to SIEM (Splunk, Datadog). Make logs append-only with WORM storage or hash chains. Avoid logging raw secrets/PII — use redaction or field-level encryption. Retain per compliance tier (e.g., 7 years finance). Build dashboards for anomalous tool usage and bulk exports.",
    example:
      "After a customer complains about an incorrect account closure, compliance searches audit logs by customer_id and finds the agent trace: user_id, retrieved policy version, tool `close_account` invocation, and missing human approval — root cause identified in minutes.",
    code: `function audit(event) {
  const entry = {
    ts: new Date().toISOString(),
    trace_id: event.traceId,
    actor_id: event.actorId,
    action: event.action,
    resource: event.resource,
    outcome: event.outcome,
    metadata: redactPII(event.metadata),
  };
  auditSink.append(entry); // append-only stream → SIEM
}`,
    glossary: ["Immutable Logs", "Trace ID", "SIEM", "PII Redaction"],
  },

  "enterprise-human-approval": {
    concept:
      "Human-in-the-loop approval gates high-impact agent actions — refunds, contract sends, production deploys, data deletion — behind explicit reviewer queues with SLA tracking and full audit trails.",
    why:
      "Autonomy scales until it doesn't. Enterprises need a circuit breaker where consequential decisions require a qualified human to approve, reject, or edit before execution.",
    analogy:
      "A surgeon must sign off before the robotic arm makes the incision — automation assists, but accountability stays human for irreversible steps.",
    technical:
      "Design approval workflows: detect action risk tier → pause execution → create approval ticket with context bundle (diff, citations, user request) → notify approvers via Slack/email → on approve, resume agent with signed token; on reject, return explanation. Support delegation, escalation, batch approvals, and timeout policies. Integrate with ITSM (Jira Service Management). Measure approval latency and override rates to tune automation boundaries.",
    example:
      "An agent drafts a $50K credit memo. Instead of posting to ERP, it opens an approval request with customer history and policy citation. A finance manager approves in Slack; only then does the agent call `create_credit_memo`.",
    code: `async function executeWithApproval(action, context) {
  if (action.riskTier >= RISK_HIGH) {
    const ticket = await approvals.create({
      action: action.name,
      payload: context.payload,
      requester: context.userId,
      expiresIn: "4h",
    });
    const decision = await approvals.waitForDecision(ticket.id);
    if (decision.status !== "approved") throw new ApprovalRejected(decision.reason);
  }
  return action.handler(context);
}`,
    glossary: ["Risk Tiering", "Approval Queue", "Circuit Breaker", "Override Rate"],
  },

  // ─── Phase 14: Coding Agents ───────────────────────────────────────────────

  "github-agent": {
    concept:
      "A GitHub agent uses the GitHub API and git operations to automate repository workflows — creating branches, opening PRs, commenting on issues, triaging bugs, and syncing project boards on behalf of a user or bot account.",
    why:
      "Developers lose hours on repetitive GitHub chores. A well-scoped agent turns natural-language intent into safe, reviewable git actions while respecting branch protections and CODEOWNERS.",
    analogy:
      "An experienced open-source maintainer who knows your repo conventions and opens clean PRs — but still waits for CI and human review before merging.",
    technical:
      "Tools: GitHub REST/GraphQL (issues, PRs, checks, releases), git CLI in sandboxed workspace, file read/write with diff preview. Authenticate via GitHub App (installation tokens) or fine-grained PAT with least scope. Enforce: no direct push to main, PR template compliance, link issues. Handle rate limits with conditional requests and exponential backoff. Surface plan to user before mutating remote state.",
    example:
      "User says 'fix the typo in README and open a PR.' The agent creates branch `fix/readme-typo`, commits the change, pushes, opens PR with description referencing the issue, and requests review from CODEOWNERS.",
    code: `// GitHub App — create PR tool
async function createPullRequest({ owner, repo, branch, title, body }) {
  const octokit = await getInstallationClient(owner, repo);
  const { data: pr } = await octokit.pulls.create({
    owner, repo,
    title,
    body,
    head: branch,
    base: "main",
  });
  return { url: pr.html_url, number: pr.number };
}`,
    glossary: ["GitHub App", "Fine-Grained PAT", "Branch Protection", "CODEOWNERS"],
  },

  "pr-review-agent": {
    concept:
      "A PR review agent analyzes pull request diffs, commit history, and CI status to produce structured feedback — bugs, security issues, style violations, missing tests, and architectural concerns — like a tireless first-pass reviewer.",
    why:
      "Human reviewers are bottlenecked and inconsistent. An agent catches obvious issues before humans spend time, letting reviewers focus on design and product tradeoffs.",
    analogy:
      "Spell-check and lint for code review — it won't replace your tech lead, but it catches the embarrassing mistakes before the meeting.",
    technical:
      "Pipeline: fetch PR diff + file context → chunk large diffs by file/hunk → run static analysis tools in parallel → LLM review with rubric (correctness, security, tests, performance) → dedupe and rank comments → post via GitHub review API with severity labels. Avoid noise: suppress nits below threshold, don't comment on generated files. Calibrate with human feedback loop (accepted vs dismissed comments).",
    example:
      "On a 400-line PR, the agent flags an SQL injection in a new endpoint, notes missing unit tests for the payment module, and suggests extracting duplicated validation — posting three inline comments with 'request changes' summary.",
    code: `async function reviewPullRequest(prNumber) {
  const diff = await github.getPRDiff(prNumber);
  const staticFindings = await runSemgrep(diff);
  const llmReview = await reviewerLLM.analyze({
    diff,
    staticFindings,
    rubric: ["security", "correctness", "tests", "maintainability"],
  });
  const comments = rankAndDedupe(llmReview.comments).filter(c => c.confidence > 0.7);
  await github.createReview(prNumber, { comments, event: comments.some(c => c.blocking) ? "REQUEST_CHANGES" : "COMMENT" });
}`,
    glossary: ["Inline Review", "Static Analysis", "Review Rubric", "Signal-to-Noise"],
  },

  "bug-fix-agent": {
    concept:
      "A bug fix agent takes a failure signal — stack trace, failing test, Sentry alert, user report — reproduces the issue, localizes root cause, proposes a patch, and validates with tests before opening a PR.",
    why:
      "Triage-to-fix is slow and context-heavy. Agents shrink mean-time-to-resolution by systematically exploring the codebase and running the test loop that engineers repeat manually.",
    analogy:
      "A detective with a lab: gathers evidence (logs, tests), forms a hypothesis, runs experiments (repro, patch), and presents a case file (PR) — not a guess on the first clue.",
    technical:
      "Loop: ingest error → search codebase for relevant symbols → read files → generate repro test (if missing) → bisect recent commits if regression → propose minimal fix → run test suite in sandbox → iterate on failures. Cap iterations and file scope. Use structured outputs for file edits. Never merge automatically without CI green and human approval for production paths.",
    example:
      "Sentry reports `NullPointerException` in checkout. The agent traces to `CartService.applyCoupon`, adds a null guard test, fixes the bug, runs `npm test`, and opens PR #842 with linked Sentry issue.",
    code: `async function bugFixLoop(errorReport) {
  const context = await gatherContext(errorReport); // stack, files, recent commits
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const hypothesis = await planner.diagnose(context);
    const patch = await coder.proposePatch(hypothesis);
    const result = await sandbox.runTests(patch);
    if (result.passed) return { patch, testsAdded: result.newTests };
    context.failures.push(result.output);
  }
  return { status: "needs_human", context };
}`,
    glossary: ["Repro Test", "Root Cause Analysis", "Sandbox", "Minimal Patch"],
  },

  "documentation-agent": {
    concept:
      "A documentation agent keeps technical docs accurate by reading code changes, API schemas, and README files — generating or updating docs, changelogs, and inline comments in the team's style guide.",
    why:
      "Docs drift from code within weeks. Agents can diff code against docs on every PR and propose updates, turning documentation from a quarterly chore into a continuous process.",
    analogy:
      "A technical writer who pair-programs with every PR — not someone rewriting the manual from memory once a year.",
    technical:
      "Triggers: on PR merge, nightly scan, or on-demand. Extract public APIs (OpenAPI, docstrings, exports), compare to markdown docs, flag stale sections. Generate updates with templates (API reference, migration guides). Respect style linting (Vale, alex). Post doc PRs separately from code PRs. Include code snippets that are tested/extracted from real examples where possible.",
    example:
      "After a PR adds `POST /v2/refunds`, the doc agent updates the API reference with request/response schemas, adds a changelog entry, and flags the old `/v1/refunds` page as deprecated.",
    code: `async function syncDocsFromPR(prDiff) {
  const apiChanges = extractAPIChanges(prDiff);
  if (apiChanges.length === 0) return;
  const updates = await docWriter.generate({
    changes: apiChanges,
    styleGuide: await loadStyleGuide(),
    templates: ["api-reference", "changelog"],
  });
  await github.createPR({
    branch: "docs/sync-" + prDiff.number,
    title: "docs: update API reference for PR #" + prDiff.number,
    files: updates,
  });
}`,
    glossary: ["Docs-as-Code", "API Extraction", "Changelog", "Style Linting"],
  },

  "cicd-agent": {
    concept:
      "A CI/CD agent monitors pipelines, diagnoses failures, suggests fixes, manages flaky tests, and can trigger reruns or config changes — acting as an on-call assistant for build and deploy systems.",
    why:
      "Broken CI blocks entire teams. Agents parse cryptic logs faster than humans scrolling GitHub Actions, and can propose targeted fixes instead of blind reruns.",
    analogy:
      "The senior engineer who actually reads the CI log instead of clicking 'Re-run all jobs' and hoping.",
    technical:
      "Integrate with GitHub Actions, GitLab CI, CircleCI via APIs and webhook events. On failure: fetch logs, identify failing step, correlate with recent diffs and dependency changes, classify (flake vs real break vs infra). Tools: rerun job, open issue, suggest Dockerfile fix, pin dependency. For deploy agents: promote artifacts, run smoke tests, rollback on SLO breach — always behind approval for production. Store runbooks in vector DB for similar failure retrieval.",
    example:
      "CI fails on `npm ci` with ERESOLVE. The agent identifies a peer dependency conflict introduced in the last commit, suggests pinning `react` version, opens a PR, and re-triggers the workflow after merge.",
    code: `async function onCIFailure(event) {
  const logs = await ci.fetchJobLogs(event.jobId);
  const diagnosis = await agent.analyze({ logs, commit: event.sha, workflow: event.workflow });
  if (diagnosis.type === "flake" && diagnosis.confidence > 0.85) {
    await ci.rerunJob(event.jobId);
    return;
  }
  await github.createIssue({
    title: "CI failure: " + diagnosis.summary,
    body: diagnosis.details + "\\n\\nSuggested fix:\\n" + diagnosis.fix,
  });
}`,
    glossary: ["Webhook Events", "Flaky Test", "Artifact Promotion", "Rollback"],
  },

  "terminal-agent": {
    concept:
      "A terminal agent executes shell commands in a controlled environment — installing deps, running builds, grepping logs, managing git — translating high-level developer intent into safe CLI operations.",
    why:
      "Much of engineering still happens in the terminal. Agents that can run commands accelerate exploration and automation, but require strict sandboxing to prevent destructive mistakes.",
    analogy:
      "An intern with a supervised shell — they can run commands you approve, in a disposable VM, with command blocklists for `rm -rf /`.",
    technical:
      "Run in ephemeral containers or firejail with network policies. Allowlist/denylist commands; require confirmation for destructive ops. Capture stdout/stderr for LLM context; cap output size. Timeout long-running processes. Support working directory context, env vars, and multi-step scripts. Log every command for audit. Prefer read-only exploration before write operations.",
    example:
      "User asks 'why is port 3000 in use?' The agent runs `lsof -i :3000`, identifies a stale node process, asks permission, then kills it and verifies the port is free.",
    code: `async function runTerminalCommand(cmd, opts) {
  if (DENYLIST.some(d => cmd.includes(d))) throw new SecurityError("command blocked");
  if (REQUIRES_APPROVAL.some(p => cmd.startsWith(p)) && !opts.approved) {
    return { status: "pending_approval", command: cmd };
  }
  const proc = spawn("bash", ["-c", cmd], { cwd: opts.cwd, timeout: 60_000 });
  const { stdout, stderr, exitCode } = await collectOutput(proc);
  audit.log({ event: "terminal.exec", cmd, exitCode });
  return { stdout: truncate(stdout, 50_000), stderr, exitCode };
}`,
    glossary: ["Sandbox", "Command Allowlist", "Ephemeral Container", "Output Truncation"],
  },

  // ─── Phase 15: Capstone Projects ─────────────────────────────────────────────

  "ai-software-engineer": {
    concept:
      "An AI software engineer is a multi-tool coding agent that plans features, writes code across files, runs tests, debugs failures, and opens PRs — mimicking an end-to-end junior-to-mid engineer workflow with human oversight.",
    why:
      "Portfolio capstone that proves you can orchestrate planning, editing, execution, and review loops — the same primitives used by Cursor, Devin-style agents, and internal codegen bots.",
    analogy:
      "A pair programmer who also runs the terminal and opens the PR — you stay the tech lead who reviews the plan and merge.",
    technical:
      "Stack: planner (task decomposition), coder (file edits via apply_patch), terminal sandbox (test/lint/build), git/GitHub integration, memory (repo map, conventions). Use LangGraph or similar for cyclic plan→act→observe. Guardrails: max files touched, test gate before PR, no secrets in prompts. Eval on SWE-bench-style tasks. Document architecture diagram and failure modes.",
    example:
      "Given 'add rate limiting to the login endpoint,' the agent reads existing middleware, implements a token bucket, adds integration tests, runs pytest, and opens a PR with benchmark notes.",
    glossary: ["Plan-Act-Observe", "Apply Patch", "Repo Map", "SWE-bench"],
  },

  "ai-research-assistant": {
    concept:
      "An AI research assistant ingests papers, web sources, and internal notes — summarizing findings, comparing methods, extracting citations, and synthesizing literature reviews with verifiable references.",
    why:
      "Researchers drown in PDFs and preprints. A grounded assistant accelerates survey writing while reducing citation hallucination through mandatory source linking.",
    analogy:
      "A grad student who's read everything in the folder and gives you annotated bibliographies — with page numbers, not made-up authors.",
    technical:
      "Pipeline: PDF parse (GROBID, Unstructured), chunk + embed, citation graph optional, query with hybrid search. Outputs: structured summaries, comparison tables, gap analysis. Enforce citation-backed sentences; reject unsupported claims. Tools: arXiv search, Semantic Scholar API, Zotero export. Track source freshness and preprint vs peer-reviewed labels.",
    example:
      "User asks 'Compare RAG evaluation metrics from 2024–2025.' The agent retrieves 12 papers, builds a table of metrics (faithfulness, recall, human eval), and exports a BibTeX file with linked PDFs.",
    glossary: ["Citation Grounding", "Literature Review", "Semantic Scholar", "Gap Analysis"],
  },

  "ai-customer-support": {
    concept:
      "An AI customer support agent resolves tickets via grounded answers, order lookups, and policy-compliant actions — escalating to humans when sentiment, complexity, or authorization thresholds are exceeded.",
    why:
      "Support scales poorly with headcount. A production-grade support agent demonstrates RAG, tool use, guardrails, and escalation — the bread and butter of enterprise AI jobs.",
    analogy:
      "Tier-1 support that never forgets the handbook and instantly pulls up your order — but knows when to get the manager.",
    technical:
      "Integrate: ticket system (Zendesk, Intercom), CRM, order API, KB RAG with ACL. Tools: lookup_order, create_refund (approval gated), escalate. Sentiment and intent classifiers route flows. Log every action; measure CSAT, resolution rate, hallucination rate on eval set of real tickets (redacted).",
    example:
      "Customer: 'Where's my order #8821?' Agent authenticates user, calls order API, explains delay with tracking link. Customer asks for refund — agent checks policy, opens approval for amounts over $100, otherwise processes automatically.",
    glossary: ["Intent Classification", "Ticket Escalation", "CSAT", "Order Lookup Tool"],
  },

  "ai-resume-reviewer": {
    concept:
      "An AI resume reviewer analyzes CVs against job descriptions — scoring fit, suggesting improvements, flagging gaps, and explaining reasoning with rubric-based feedback suitable for candidates or recruiters.",
    why:
      "Shows structured output, rubric evaluation, and bias awareness — skills applicable to any document-scoring agent in hiring, lending, or compliance review.",
    analogy:
      "A career coach with a checklist — not a black-box 'you're rejected' button.",
    technical:
      "Inputs: resume PDF/DOCX, JD text, optional company values. Pipeline: parse sections, extract skills/experience, align to JD requirements, score dimensions (skills match, impact verbs, formatting). Output: scores, bullet rewrites, gap list. Mitigate bias: avoid scoring on protected attributes, audit disparate impact on test sets, disclose AI assistance.",
    example:
      "Candidate uploads resume for a 'Senior ML Engineer' role. Agent notes missing MLOps keywords, suggests quantifying the recommendation system impact ('increased CTR 12%'), and scores technical fit 7/10 with specific gaps.",
    glossary: ["Rubric Scoring", "Skill Extraction", "Bias Mitigation", "Structured Feedback"],
  },

  "ai-travel-planner": {
    concept:
      "An AI travel planner combines search tools, maps, calendars, and user preferences to build itineraries — flights, hotels, activities — with live pricing and constraint satisfaction (budget, dates, accessibility).",
    why:
      "Classic multi-tool agent capstone: search, compare, reason over constraints, and present plans users can book — demonstrates real-world tool orchestration beyond chat.",
    analogy:
      "A travel agent who checks six websites at once and remembers you hate early morning flights.",
    technical:
      "Tools: flight/hotel APIs (Amadeus, Google Places), weather, calendar read (optional). State: preferences, budget, constraints. Loop: gather options → score by user prefs → assemble day-by-day itinerary → revise on feedback. Handle API failures gracefully; show prices with as-of timestamps. Don't invent confirmation numbers — link to booking URLs.",
    example:
      "User wants '5 days in Tokyo under $3K in April, vegetarian-friendly.' Agent searches flights, finds hotels near metro, schedules temples and food tours, outputs daily plan with transit times and total cost estimate.",
    glossary: ["Constraint Satisfaction", "Tool Orchestration", "Itinerary State", "Live Pricing"],
  },

  "ai-meeting-assistant": {
    concept:
      "An AI meeting assistant joins or processes recordings — transcribing, summarizing decisions, extracting action items with owners, and syncing outcomes to Slack, Jira, or Notion.",
    why:
      "Meetings generate unstructured commitments that get lost. This capstone combines STT, summarization, entity extraction, and integrations — a common enterprise productivity pattern.",
    analogy:
      "The person who takes perfect notes and actually emails the follow-ups — except they also timestamp who said what.",
    technical:
      "Pipeline: audio → STT (Whisper, Deepgram) → diarization → LLM summary with template (decisions, actions, parking lot). NER for owners/dates. Tools: create Jira tasks, post Slack summary. Privacy: consent banner, retention limits, redact sensitive segments. Eval summary faithfulness against human notes.",
    example:
      "After a 45-minute sprint planning call, the agent posts to Slack: three decisions, five action items with assignees and due dates, and a link to the full transcript with timestamps.",
    glossary: ["Diarization", "Action Item Extraction", "STT", "Meeting Summarization"],
  },

  "autonomous-browser-agent": {
    concept:
      "An autonomous browser agent controls a web browser — navigating pages, clicking, typing, scraping, and completing multi-step web workflows using vision and DOM understanding with human checkpoints for sensitive actions.",
    why:
      "Many workflows live only in web UIs without APIs. Browser agents demonstrate computer-use patterns critical for ops automation, testing, and legacy system integration.",
    analogy:
      "A remote operator at the browser — clicking through the same screens you would, with a screen-recording receipt.",
    technical:
      "Stack: Playwright/Puppeteer, accessibility tree + optional screenshot vision, action schema (click, type, scroll, wait). Loop: observe → plan next action → execute → verify. Anti-bot handling: rate limits, CAPTCHA escalation to human. Sandbox credentials in vault; never log passwords. Cap steps and domains allowlist.",
    example:
      "Agent logs into a vendor portal (credentials from vault), downloads last month's invoices, uploads them to Google Drive, and emails finance a summary spreadsheet.",
    code: `async function browserAgent(goal, page) {
  for (let step = 0; step < MAX_STEPS; step++) {
    const snapshot = await page.accessibility.snapshot();
    const action = await planner.nextAction({ goal, snapshot });
    if (action.type === "done") return action.result;
    await execute(page, action);
    await page.waitForLoadState("networkidle");
  }
  throw new Error("max steps exceeded");
}`,
    glossary: ["Playwright", "Accessibility Tree", "Computer Use", "Domain Allowlist"],
  },

  "multi-agent-coding-assistant": {
    concept:
      "A multi-agent coding assistant coordinates specialized agents — planner, coder, reviewer, tester — that hand off work with shared context, reducing single-agent context overload and improving quality on large tasks.",
    why:
      "One monolithic coding agent hits context limits and role confusion. Multi-agent splits concerns the way real engineering teams do — design, implement, review, test.",
    analogy:
      "A mini dev team in one chat: architect sketches, developer codes, QA breaks it, reviewer comments — you merge when green.",
    technical:
      "Orchestrator (LangGraph supervisor) routes tasks. Agents: Planner (spec), Implementer (edits), Reviewer (critique), Tester (run suite). Shared state: repo snapshot, task list, conversation summary. Handoff via structured messages. Prevent infinite loops with max rounds and disagreement escalation to human.",
    example:
      "User requests OAuth login. Planner writes spec; Implementer adds routes and tests; Tester finds callback bug; Implementer fixes; Reviewer approves; orchestrator opens PR.",
    glossary: ["Supervisor Pattern", "Agent Handoff", "Shared State", "Role Specialization"],
  },

  "enterprise-knowledge-assistant": {
    concept:
      "An enterprise knowledge assistant is the capstone integration of enterprise RAG, RBAC, audit logs, and human approval — a production copilot over company knowledge with governance baked in.",
    why:
      "Ties Phase 13 concepts into one deployable portfolio piece that mirrors real internal copilots at Fortune 500 companies.",
    analogy:
      "Company-wide Siri that knows HR policy, eng runbooks, and sales playbooks — and won't tell interns what executives earn.",
    technical:
      "Ingest from SharePoint/Confluence/Google Drive with ACL sync. Hybrid search + rerank + citations. Identity from SSO; RBAC on collections. Audit every query and tool call. High-risk actions (export bulk data, send external email) require approval. Admin dashboard: usage, denied access, stale docs. Eval suite per department.",
    example:
      "Engineer asks 'How do we rotate KMS keys?' Assistant retrieves platform runbook (authorized), cites steps, offers to open a change ticket. Intern asking for executive compensation gets policy explanation and no retrieved chunks.",
    glossary: ["Enterprise Copilot", "ACL Sync", "Governed RAG", "Admin Dashboard"],
  },

  // ─── Phase 16: Interview & System Design ───────────────────────────────────

  "agent-system-design": {
    concept:
      "Agent system design is the interview discipline of architecting LLM-powered autonomous systems — defining goals, tool interfaces, control flow, memory, guardrails, observability, and scaling strategies under clear constraints.",
    why:
      "Companies hire agent engineers who can whiteboard production architectures, not just call APIs. This module prepares you for 45-minute design rounds focused on reliability and tradeoffs.",
    analogy:
      "Designing a restaurant kitchen: menu (capabilities), stations (agents/tools), order tickets (state), health inspector rules (guardrails), and rush-hour staffing (scaling).",
    technical:
      "Framework for interviews: clarify requirements (latency, cost, autonomy level) → draw components (LLM, planner, tools, memory, vector DB, queue) → define data flows and failure modes → discuss eval, monitoring, cost caps. Common patterns: ReAct loop, supervisor multi-agent, RAG sidecar, human approval gate. Always state tradeoffs: autonomy vs safety, single vs multi-agent complexity.",
    example:
      "Prompt: 'Design a customer support agent for 1M users.' You scope: tier-1 automation with KB RAG, CRM tools, escalation to human, p95 < 5s, $0.02/ticket target — diagram ingestion, router, agent runtime, observability, and fallback when LLM is down.",
    glossary: ["Requirements Scoping", "Control Flow", "Failure Modes", "Tradeoff Analysis"],
  },

  "langgraph-coding": {
    concept:
      "LangGraph coding interviews test your ability to implement stateful agent graphs in Python — nodes, edges, conditional routing, checkpoints, and human-in-the-loop interrupts using LangGraph's StateGraph API.",
    why:
      "LangGraph is a common interview and production choice for explicit agent control flow. Live coding rounds ask you to model loops, branching, and persistence without hiding logic in prompt magic.",
    analogy:
      "Building a flowchart where each box is a function and the arrows are 'if tests fail, go back to fix' — code, not a whiteboard-only diagram.",
    technical:
      "Know: `StateGraph`, typed state (TypedDict), nodes as functions, `add_conditional_edges`, `END`, `MemorySaver` checkpoints, `interrupt_before` for human approval. Patterns: ReAct as graph, supervisor routing, parallel tool nodes. Debug with `graph.get_graph().draw_mermaid()`. Discuss compilation, async nodes, and streaming `astream_events`.",
    example:
      "Implement a graph: user message → router (needs_tool?) → tool node or direct answer → checker (valid JSON?) → retry or END. Add checkpoint so conversation resumes after server restart.",
    code: `from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from operator import add

class State(TypedDict):
    messages: Annotated[list, add]

def agent(state: State): ...
def should_continue(state: State) -> str:
    return "tools" if needs_tool(state) else END

graph = StateGraph(State)
graph.add_node("agent", agent)
graph.add_node("tools", run_tools)
graph.add_conditional_edges("agent", should_continue)
graph.add_edge("tools", "agent")
app = graph.compile(checkpointer=MemorySaver())`,
    glossary: ["StateGraph", "Conditional Edges", "Checkpointing", "interrupt_before"],
  },

  "mcp-design": {
    concept:
      "MCP (Model Context Protocol) design covers how to expose tools, resources, and prompts to AI clients through a standardized server interface — enabling portable, secure integrations across Cursor, Claude Desktop, and custom agents.",
    why:
      "MCP is becoming the USB-C of agent tools. Interviewers ask how you'd design MCP servers for internal APIs, auth, and schema versioning.",
    analogy:
      "MCP is a universal adapter: build one server, and any MCP-compatible client can plug in your tools without custom SDK per IDE.",
    technical:
      "Server exposes: tools (callable functions with JSON schema), resources (readable URIs), prompts (templates). Transport: stdio or SSE. Design: least-privilege scopes, input validation, rate limits, structured errors. Version tools (`search_v2`). Auth: OAuth for remote servers. Discuss discovery, caching, and latency vs local stdio.",
    example:
      "Design MCP server for Jira: tools `create_issue`, `search_issues`; resource `jira://project/KEY`; OAuth to Atlassian; validate project key; return markdown-formatted results for LLM consumption.",
    glossary: ["Tool Schema", "stdio Transport", "Resource URI", "OAuth for MCP"],
  },

  "multi-agent-design": {
    concept:
      "Multi-agent design is the practice of decomposing complex workflows into cooperating agents with defined roles, communication protocols, and orchestration — balancing parallelism, context isolation, and coordination overhead.",
    why:
      "Interviewers probe when to use one agent vs many, how agents share state, and how you prevent infinite debate or duplicated work.",
    analogy:
      "An orchestra: each musician (agent) has a part; the conductor (supervisor) coordinates timing — not everyone playing the same note.",
    technical:
      "Patterns: supervisor (central router), hierarchical (manager → workers), peer-to-peer debate, pipeline (sequential specialists). State: blackboard, message bus, shared doc. Challenges: context sync, termination conditions, cost multiplication, debugging distributed traces. Choose multi-agent when tasks decompose cleanly; avoid for simple linear flows.",
    example:
      "Design research report system: Researcher agent gathers sources, Analyst compares findings, Writer drafts, Critic reviews — supervisor routes until Critic approves or max rounds hit.",
    glossary: ["Supervisor Pattern", "Blackboard Architecture", "Termination Condition", "Agent Debate"],
  },

  "memory-design": {
    concept:
      "Memory design for agents covers what to remember, where to store it, and how to retrieve it — spanning short-term conversation buffer, summarization, episodic logs, and long-term vector or structured memory.",
    why:
      "Agents without memory feel forgetful; agents with bad memory leak stale facts and blow token budgets. Interviews test your tiered memory architecture.",
    analogy:
      "Human memory: sticky note on desk (short-term), journal summary (compressed), filing cabinet (long-term search) — not one infinite notebook.",
    technical:
      "Tiers: (1) sliding window + summarization for chat, (2) session state in Redis, (3) long-term user profile in DB, (4) semantic memory in vector store with metadata. Write policies: when to commit facts, conflict resolution, TTL, privacy deletion. Retrieval: inject only relevant memories per turn. Measure memory precision on eval dialogs.",
    example:
      "Support agent remembers user prefers email contact (profile DB), summarizes last three tickets (session), retrieves similar resolved cases (vector) — without sending entire history every turn.",
    glossary: ["Episodic Memory", "Summarization Buffer", "Memory TTL", "Retrieval Injection"],
  },

  "production-debugging": {
    concept:
      "Production debugging for agent systems means tracing failures across prompts, retrievals, tool calls, and model outputs — using logs, traces, replay, and eval diffs to find root cause without guessing.",
    why:
      "Agents fail opaquely: wrong answer could be bad retrieval, tool timeout, or prompt drift. Interviewers want a systematic debugging playbook.",
    analogy:
      "Flight recorder analysis: reconstruct the whole flight path, not just 'we crashed near the lake.'",
    technical:
      "Instrument: trace_id per request, span per LLM/tool/retrieval step, log prompts (redacted), retrieved chunk IDs, tool I/O hashes. Tools: LangSmith, Arize, Honeycomb, custom replay CLI. Workflow: reproduce → bisect (disable retrieval? swap model?) → compare to golden trace → fix + regression eval. Watch for: prompt version changes, embedding model swaps, rate limit retries altering behavior.",
    example:
      "Users report wrong refund policy answers after deploy. Trace shows retrieval returning archived 2023 doc — root cause: missing `effective_date` filter in new indexer config.",
    glossary: ["Distributed Tracing", "Trace Replay", "Golden Trace", "Regression Eval"],
  },

  "cost-optimization-interview": {
    concept:
      "Cost optimization interviews ask you to reduce LLM spend while preserving quality — via model routing, caching, prompt compression, retrieval tuning, batching, and architectural changes with measurable ROI.",
    why:
      "Production agents can burn thousands per day. Engineers who optimize cost without killing UX are highly valued — and this is a frequent system design follow-up.",
    analogy:
      "Airline yield management: same destination, but coach vs business class depending on urgency and budget — not everyone gets the flagship model.",
    technical:
      "Levers: route simple queries to small models (classifier → haiku/mini), cache frequent Q&A (semantic cache), reduce context (better chunking, summarization), fewer agent steps, batch embeddings, prompt caching (Anthropic/OpenAI), tool result compression. Measure: cost per successful task, not per token alone. A/B quality on eval set when downgrading models.",
    example:
      "Support bot costs $8K/month. You add intent router (80% to mini model), semantic cache for top 200 FAQs, and reranker-only on low-confidence retrieval — 55% cost drop with <2% CSAT dip.",
    glossary: ["Model Routing", "Semantic Cache", "Prompt Caching", "Cost per Task"],
  },

  "mock-interviews": {
    concept:
      "Mock interviews simulate real agent engineering loops — system design, LangGraph live coding, behavioral questions, and tradeoff discussions — with structured feedback rubrics to close gaps before onsite rounds.",
    why:
      "Passive reading doesn't build interview performance. Timed mocks reveal where you ramble, skip requirements, or freeze on coding — fix those under low stakes.",
    analogy:
      "Scrimmage games before playoffs — same rules, lower stakes, coach feedback after the whistle.",
    technical:
      "Format: 5-min intro, 35-min design or coding, 5-min questions. Rubric score: requirements clarity, architecture depth, failure handling, communication, code correctness. Rotate prompts: RAG system, coding agent, multi-agent research, MCP integration. Record yourself; compare to exemplar answers. Maintain a personal 'mistakes log' (forgot eval, no cost estimate, etc.).",
    example:
      "Saturday mock: design 'PR review agent.' You miss human feedback loop — interviewer flags it; you add learning from dismissed comments before Tuesday's real onsite.",
    glossary: ["Timed Mock", "Feedback Rubric", "Exemplar Answer", "Mistakes Log"],
  },
};
