import type { LessonContent } from "../lesson-types";
import { createLesson, iq } from "./builder";

export const phase0Lessons: Record<string, LessonContent> = {
  python: createLesson({
    concept:
      "Python is the primary programming language for AI Engineering — used for building LLM applications, RAG pipelines, agents, data processing, and API backends.",
    whyItExists:
      "AI's ecosystem (PyTorch, LangChain, Hugging Face, FastAPI) is Python-first. As an AI engineer, you'll write Python daily — calling APIs, processing documents, building agents, and deploying services.",
    analogy:
      "Python is the English of AI engineering — not the only language, but the one everyone speaks. Learning it unlocks every tool, library, and tutorial in the field.",
    technicalExplanation:
      "Python is a high-level, interpreted language known for readable syntax and a massive ecosystem. For AI engineering specifically, you'll use: list/dict comprehensions for data transforms, async/await for concurrent API calls, type hints for maintainability, virtual environments (venv) for dependency isolation, and packages like openai, langchain, fastapi, pandas, and pydantic. Python's dynamic typing speeds prototyping, while type hints and Pydantic models add safety at API boundaries.",
    architecture:
      "Typical AI Python project structure: src/ (application code), tests/, requirements.txt or pyproject.toml, .env for secrets, Dockerfile for deployment. Use FastAPI for APIs, Pydantic for data validation, and pytest for testing.",
    diagram: `flowchart TD
    A[Developer writes Python] --> B[Virtual env isolates deps]
    B --> C[FastAPI / CLI app]
    C --> D[LLM SDK calls]
    C --> E[Vector DB client]
    C --> F[Data processing]
    D --> G[Deployed via Docker]`,
    example:
      "You're building a PDF chat app. Python loads the PDF with pypdf, chunks text, calls OpenAI embeddings API, stores vectors in ChromaDB, and serves a FastAPI endpoint that retrieves context and calls GPT-4.",
    code: `# Core Python patterns for AI Engineering
import os
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def ask_llm(prompt: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )
    return response.choices[0].message.content or ""

class ChatRequest(BaseModel):
    message: str
    user_id: str

documents = ["doc1 text", "doc2 text"]
summaries = [ask_llm(f"Summarize: {doc}") for doc in documents]`,
    project:
      "Build a CLI tool that takes a text file, sends it to an LLM for summarization, and saves the result. Use argparse, python-dotenv, and the OpenAI SDK.",
    interviewQuestions: [
      iq("Why is Python dominant in AI engineering?", "Ecosystem maturity (PyTorch, LangChain, Hugging Face), readability, rapid prototyping, strong async support for API-heavy apps, and industry adoption by every major AI company.", "easy"),
      iq("How do you manage Python dependencies in AI projects?", "Use virtual environments (venv/conda), pin versions in requirements.txt or pyproject.toml, use Docker for reproducible deployments, and never commit .env files with API keys.", "medium"),
      iq("When should you use async vs sync in Python AI apps?", "Sync is simpler for scripts. Async (asyncio + httpx) is essential when making many concurrent API calls — agents calling multiple tools, batch embedding, parallel retrieval.", "medium"),
    ],
    revisionNotes: {
      fiveMin: [
        "Python is the default language for AI engineering",
        "Key packages: openai, langchain, fastapi, pydantic, pytest",
        "Always use venv + requirements.txt for dependency management",
        "Never hardcode API keys — use .env files",
      ],
      fifteenMin: [
        "List comprehensions and dict operations for data processing",
        "Type hints improve code maintainability in team projects",
        "Pydantic models for request/response validation in APIs",
        "async/await for concurrent LLM API calls",
        "Project structure: src/, tests/, .env, Dockerfile",
        "FastAPI for building production AI API endpoints",
      ],
      oneHour: [
        "Set up a full Python AI project from scratch",
        "Virtual env, dependencies, .env, OpenAI SDK integration",
        "Build a FastAPI endpoint that calls an LLM",
        "Add Pydantic models for input/output validation",
        "Write pytest tests with mocked LLM responses",
        "Dockerize the application for deployment",
      ],
      cheatSheet: [
        "venv: python -m venv .venv",
        "Install: pip install -r requirements.txt",
        "Run API: uvicorn main:app --reload",
        "Env vars: os.getenv() + python-dotenv",
        "Type hints: def fn(x: str) -> dict:",
        "Async: async def + await + httpx.AsyncClient",
      ],
    },
    glossary: ["CLI", "REST APIs", "JSON"],
    commonMistakes: [
      "Not using virtual environments — dependency conflicts across projects",
      "Hardcoding API keys in source code instead of environment variables",
      "Ignoring type hints — leads to bugs in large AI codebases",
      "Using sync code for I/O-heavy agent systems — kills performance",
    ],
  }),

  git: createLesson({
    concept:
      "Git is a version control system that tracks code changes, enables collaboration, and is essential for every software and AI engineering workflow.",
    whyItExists:
      "AI projects iterate fast — prompt changes, model swaps, pipeline tweaks. Git lets you track every change, collaborate with teams, roll back mistakes, and maintain separate branches for experiments vs production.",
    analogy:
      "Git is like Google Docs version history for code — you can see who changed what, when, and revert to any previous version. Branches let you experiment without breaking the main project.",
    technicalExplanation:
      "Git stores snapshots of your project in a repository. Key concepts: commits (saved snapshots), branches (parallel development lines), merges (combining branches), remotes (GitHub/GitLab hosting), and pull requests (code review workflow). For AI projects, version-control your prompts, configs, and evaluation datasets alongside code. Use .gitignore to exclude secrets, model weights, and large data files.",
    architecture:
      "Local repo (working directory → staging → commits) syncs with remote (origin on GitHub). Feature branches fork from main, changes merge via pull request after review. CI runs on each push/PR.",
    diagram: `flowchart LR
    A[Working Directory] -->|git add| B[Staging Area]
    B -->|git commit| C[Local Repo]
    C -->|git push| D[Remote Repo]
    D -->|git pull| C
    E[feature branch] -->|PR + review| F[main branch]`,
    example:
      "You're experimenting with 3 different RAG chunking strategies. Create branch experiment/chunking-v2, test it, compare eval scores, then merge the winner into main via pull request.",
    code: `# Essential Git workflow for AI projects
git init
git add .
git commit -m "feat: initial RAG pipeline setup"

git checkout -b experiment/hybrid-search
git add src/retriever.py
git commit -m "feat: add BM25 + vector hybrid search"
git push -u origin experiment/hybrid-search

# Commit message format: feat | fix | docs | refactor | eval`,
    project:
      "Set up a GitHub repo for your AI project. Practice branching, committing prompt changes, opening a PR, and writing a meaningful README with setup instructions.",
    interviewQuestions: [
      iq("Explain a git branching strategy for AI teams.", "main (production), develop (integration), feature/* (experiments). Tag releases. Never commit API keys — use .gitignore for .env files.", "medium"),
      iq("What should you version-control in an AI project?", "Code, prompts (as files), configs, evaluation datasets, Dockerfile, requirements.txt. NOT: model weights (use model registry), large datasets (use DVC), secrets.", "medium"),
      iq("What is the difference between merge and rebase?", "Merge preserves branch history with a merge commit. Rebase replays commits on top of another branch for linear history. Use merge for shared branches; rebase cautiously on local feature branches.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["git add → git commit → git push", "Branches for experiments", "Never commit .env or API keys", ".gitignore is essential"],
      fifteenMin: ["Commit messages: feat/fix/docs format", "Pull requests for code review", "git stash for temporary saves", "git log and git diff for history", "Merge vs rebase basics", "Version-control prompt files as .md or .yaml"],
      oneHour: ["Full branching workflow practice", "Resolve a merge conflict", "GitHub PR with review", "Version-control prompt files", "Set up .gitignore for AI projects", "Tag a release after eval improvements"],
      cheatSheet: ["git status — see changes", "git checkout -b name — new branch", "git pull — get remote changes", "git merge branch — combine branches", ".gitignore — exclude .env, __pycache__"],
    },
    glossary: ["CLI", "CI/CD"],
    commonMistakes: [
      "Committing API keys or .env files",
      "Giant commits with unrelated changes",
      "Not pulling before pushing (merge conflicts)",
      "Working directly on main branch",
    ],
  }),

  linux: createLesson({
    concept:
      "Linux is the operating system that powers most cloud servers, containers, and AI infrastructure — knowing its shell and file system is essential for deployment and debugging.",
    whyItExists:
      "When you deploy AI apps, they run on Linux VMs or containers. You need to navigate file systems, manage processes, inspect logs, set permissions, and troubleshoot production issues from a terminal.",
    analogy:
      "Linux is the backstage of a theater — users see the web app (the stage), but engineers work behind the scenes managing servers, logs, and processes.",
    technicalExplanation:
      "Linux is a Unix-like OS built around a kernel, shell (bash/zsh), and file hierarchy starting at /. Key skills: navigating with cd/ls, viewing files with cat/less, searching with grep/find, process management with ps/kill, permissions with chmod/chown, and piping commands. Most AI deployments use Ubuntu or Debian-based images. Environment variables are set in shell profiles or systemd units.",
    architecture:
      "User runs shell commands → shell interprets → kernel handles I/O, processes, networking. Services run as systemd units or inside containers. Logs go to /var/log or stdout captured by Docker.",
    diagram: `flowchart TD
    A[Engineer SSH into VM] --> B[Shell bash/zsh]
    B --> C[Navigate filesystem]
    B --> D[Manage processes]
    B --> E[View logs]
    C --> F[Deploy AI app]
    D --> F
    E --> F`,
    example:
      "Your RAG API is crashing in production. SSH into the EC2 instance, run docker logs api-container, grep for ERROR, check disk space with df -h, and restart the service with systemctl restart myapp.",
    code: `# Essential Linux commands for AI engineers
ls -la                    # list files with permissions
cd /var/log && tail -f app.log   # follow live logs
ps aux | grep uvicorn     # find running API process
df -h                     # check disk space
chmod 600 .env            # restrict env file permissions
export OPENAI_API_KEY=sk-...  # set env var for session
grep -r "timeout" logs/   # search logs for errors`,
    project:
      "Spin up a free-tier Linux VM (or use WSL). Install Python, clone a repo, run a FastAPI app with nohup or systemd, and practice reading logs when it fails.",
    interviewQuestions: [
      iq("How do you debug a crashed process on a Linux server?", "Check logs (journalctl, docker logs, /var/log), inspect process status (ps, systemctl status), verify disk/memory (df, free), check port binding (ss -tlnp), and review recent deployments.", "medium"),
      iq("What does chmod 600 do?", "Sets file permissions so only the owner can read and write. Critical for .env files containing API keys on shared servers.", "easy"),
      iq("Explain pipes and redirection in bash.", "Pipe (|) sends stdout of one command as stdin to another. > redirects output to a file. 2>&1 combines stderr with stdout. Essential for log filtering and scripting.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["Most cloud servers run Linux", "SSH to access remote machines", "Logs live in /var/log or docker logs", "Never run production as root"],
      fifteenMin: ["File permissions: rwx for owner/group/other", "grep, find, tail for log analysis", "ps/kill for process management", "Environment variables in shell vs .env", "df/du for disk usage", "systemctl for service management"],
      oneHour: ["SSH into a VM and deploy a Python app", "Set up a systemd service", "Configure log rotation", "Debug a permission error", "Write a bash deploy script", "Use htop to monitor resources during inference"],
      cheatSheet: ["ls -la, cd, pwd", "tail -f file.log", "ps aux | grep name", "chmod 600 .env", "df -h, free -m", "grep -r pattern dir/"],
    },
    glossary: ["CLI", "Docker", "CI/CD"],
    commonMistakes: [
      "Running everything as root — security risk",
      "Not checking disk space before indexing large document sets",
      "Forgetting to make scripts executable (chmod +x)",
      "Leaving API keys in shell history instead of .env files",
    ],
  }),

  networking: createLesson({
    concept:
      "Networking fundamentals — IP addresses, DNS, ports, TCP/UDP, and firewalls — explain how your AI services communicate over the internet and inside cloud infrastructure.",
    whyItExists:
      "AI apps are distributed systems: browsers call APIs, APIs call LLM providers, agents call tools across networks. Understanding networking helps you debug timeouts, configure security groups, and design reliable architectures.",
    analogy:
      "Networking is the postal system for computers — IP addresses are street addresses, ports are apartment numbers, DNS is the phone book that translates domain names to addresses, and firewalls are security guards at the door.",
    technicalExplanation:
      "Devices communicate via IP (IPv4/IPv6) and ports. TCP provides reliable ordered delivery (HTTP, database connections). UDP is faster but unreliable (some streaming). DNS resolves hostnames to IPs. TLS encrypts traffic (HTTPS). In cloud AI deployments, you configure VPCs, subnets, security groups (allow port 443 inbound), load balancers, and NAT gateways. Latency to LLM APIs directly affects user experience.",
    architecture:
      "Client → DNS lookup → Load Balancer (port 443) → API server (port 8000) → outbound HTTPS to OpenAI API. Internal services communicate via private subnets; only the load balancer is public.",
    diagram: `flowchart LR
    A[Browser] -->|HTTPS 443| B[Load Balancer]
    B --> C[FastAPI :8000]
    C -->|HTTPS 443| D[OpenAI API]
    C --> E[Vector DB :5432]
    F[DNS] -.->|resolves| B`,
    example:
      "Your agent can't reach the vector database. You discover the DB is in a private subnet with no route from the API container. You add a security group rule allowing port 5432 from the API subnet only.",
    code: `# Quick network debugging commands
ping api.openai.com          # check reachability
nslookup api.openai.com      # DNS resolution
curl -v https://api.openai.com/v1/models  # test HTTPS endpoint
nc -zv db.internal 5432      # test if port is open
traceroute api.openai.com    # trace network path

# Security group rule (conceptual AWS)
# Inbound: TCP 443 from 0.0.0.0/0 (public API)
# Inbound: TCP 5432 from sg-api-only (database)`,
    project:
      "Deploy a FastAPI app behind nginx as a reverse proxy. Configure HTTPS with Let's Encrypt. Document which ports are open and why.",
    interviewQuestions: [
      iq("What is the difference between TCP and UDP?", "TCP is connection-oriented, reliable, and ordered — used by HTTP and databases. UDP is connectionless and faster but may lose packets — used for DNS queries and some real-time streaming.", "medium"),
      iq("Why do AI APIs use HTTPS?", "TLS encrypts data in transit, protecting API keys and user prompts from interception. Certificate validation prevents man-in-the-middle attacks.", "easy"),
      iq("How do security groups affect AI microservices?", "They act as virtual firewalls controlling inbound/outbound traffic. Principle of least privilege: only open ports needed (e.g., 8000 for API, 5432 for Postgres from API subnet only).", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["IP + port identifies a service", "DNS maps domains to IPs", "HTTPS = HTTP + TLS encryption", "Firewalls control allowed traffic"],
      fifteenMin: ["TCP vs UDP trade-offs", "Common ports: 80 HTTP, 443 HTTPS, 5432 Postgres", "Public vs private subnets in VPC", "Load balancers distribute traffic", "Latency impacts streaming UX", "curl and ping for debugging"],
      oneHour: ["Draw network diagram for a RAG app", "Configure nginx reverse proxy", "Set up security groups in cloud", "Debug a connection refused error", "Measure latency to LLM API", "Understand NAT and outbound-only access"],
      cheatSheet: ["DNS: domain → IP", "TCP: reliable, UDP: fast", "Port 443 = HTTPS", "curl -v for HTTP debug", "Security groups = firewall rules", "Private subnet = no direct internet"],
    },
    glossary: ["HTTP", "REST APIs", "Docker"],
    commonMistakes: [
      "Exposing database ports to the public internet",
      "Ignoring latency to LLM providers when choosing regions",
      "Not setting timeouts on outbound HTTP calls",
      "Confusing security groups with IAM permissions",
    ],
  }),

  http: createLesson({
    concept:
      "HTTP (Hypertext Transfer Protocol) is the request-response protocol that powers web APIs, including every LLM provider endpoint you'll integrate with.",
    whyItExists:
      "LLM providers, vector databases, and your own services all communicate via HTTP. Understanding methods, headers, status codes, and bodies is non-negotiable for building and debugging AI applications.",
    analogy:
      "HTTP is like ordering at a restaurant — you make a request (method + order details), the kitchen processes it, and returns a response (your food or an error if they're out of stock).",
    technicalExplanation:
      "HTTP is stateless: each request is independent. Methods: GET (read), POST (create/action), PUT/PATCH (update), DELETE (remove). Headers carry metadata (Authorization, Content-Type). Body holds payload (JSON for AI APIs). Status codes: 2xx success, 4xx client error, 5xx server error. HTTP/2 enables multiplexing; HTTP/3 uses QUIC. LLM APIs use POST with JSON bodies and stream responses via chunked transfer encoding.",
    architecture:
      "Client sends HTTP request (method, URL, headers, body) → server processes → returns response (status, headers, body). TLS wraps HTTP as HTTPS. Reverse proxies (nginx) terminate TLS and forward to app servers.",
    diagram: `flowchart TD
    A[Client POST /v1/chat/completions] --> B[Headers: Authorization, Content-Type]
    A --> C[Body: JSON messages]
    B --> D[Server processes]
    C --> D
    D --> E[Response 200 + JSON]
    D --> F[Response 429 rate limited]`,
    example:
      "Your chat app returns 401 Unauthorized. You check the Authorization header — the Bearer token is missing. After adding it, you get 200 with the LLM response in the JSON body.",
    code: `# HTTP request to an LLM API (conceptual)
import httpx

response = httpx.post(
    "https://api.openai.com/v1/chat/completions",
    headers={
        "Authorization": "Bearer sk-...",
        "Content-Type": "application/json",
    },
    json={
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": "Hello"}],
    },
    timeout=30.0,
)
print(response.status_code)  # 200
print(response.json())`,
    project:
      "Use curl and httpx to call three different APIs (OpenAI, a public REST API, your own FastAPI endpoint). Log status codes, headers, and response times.",
    interviewQuestions: [
      iq("What HTTP method do LLM chat APIs typically use and why?", "POST — because sending a prompt creates a computation/action on the server and the request body carries the message payload, which can be large.", "easy"),
      iq("Explain common HTTP status codes for AI APIs.", "200 OK (success), 400 Bad Request (invalid JSON/payload), 401 Unauthorized (bad API key), 429 Too Many Requests (rate limit), 500 Internal Server Error (provider outage).", "medium"),
      iq("How does HTTP streaming work for LLM responses?", "Server uses Transfer-Encoding: chunked to send partial response bodies as tokens are generated. Client reads the stream incrementally instead of waiting for the full response.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["GET read, POST create/action", "Headers carry auth and content type", "Status codes: 2xx ok, 4xx client, 5xx server", "LLM APIs use POST + JSON"],
      fifteenMin: ["HTTP is stateless — each request independent", "Authorization: Bearer token header", "Content-Type: application/json", "Timeouts prevent hung requests", "curl -v shows full request/response", "Streaming uses chunked encoding"],
      oneHour: ["Call LLM API with httpx", "Handle 401, 429, 500 errors gracefully", "Implement request timeouts and retries", "Compare sync vs streaming responses", "Inspect traffic with browser dev tools", "Write middleware to log HTTP metrics"],
      cheatSheet: ["GET / POST / PUT / DELETE", "Authorization: Bearer KEY", "Content-Type: application/json", "200 OK, 401, 429, 500", "httpx.post(url, headers, json)", "timeout=30.0 always"],
    },
    glossary: ["REST APIs", "JSON", "CLI"],
    commonMistakes: [
      "No timeout on HTTP calls — app hangs when provider is slow",
      "Sending API keys in URL query params instead of headers",
      "Ignoring 429 rate limits instead of implementing backoff",
      "Not checking status code before parsing JSON body",
    ],
  }),

  "rest-apis": createLesson({
    concept:
      "REST (Representational State Transfer) is an architectural style for designing web APIs using HTTP resources, standard methods, and JSON payloads — the pattern behind most AI service integrations.",
    whyItExists:
      "REST provides a predictable, language-agnostic way to expose and consume services. LLM providers, embedding APIs, vector DBs, and your own backends all follow REST conventions, making integration straightforward.",
    analogy:
      "REST is like a library catalog system — each book (resource) has a unique URL, you can browse (GET), add (POST), update (PUT), or remove (DELETE) books using standard procedures everyone understands.",
    technicalExplanation:
      "REST organizes APIs around resources identified by URLs (/users/123, /documents). HTTP methods map to CRUD operations. Responses use standard status codes and JSON bodies. Stateless: each request contains all needed info (auth headers). Versioning via URL (/v1/) or headers. HATEOAS is optional. For AI engineering, you'll build REST APIs with FastAPI and consume provider REST endpoints. Pagination, filtering, and idempotency matter at scale.",
    architecture:
      "Client → API Gateway → REST endpoints → business logic → database/LLM. Resources are nouns (documents, chats), methods are verbs (GET, POST). Authentication via API keys or OAuth Bearer tokens.",
    diagram: `flowchart TD
    A[Client App] -->|GET /documents| B[API Server]
    A -->|POST /chat| B
    B --> C[Business Logic]
    C --> D[(PostgreSQL)]
    C --> E[LLM Provider API]
    C --> F[(Vector DB)]`,
    example:
      "You build a document Q&A REST API: POST /documents uploads and indexes a file, GET /documents/{id} retrieves metadata, POST /chat sends a question and returns an answer with source citations.",
    code: `# FastAPI REST endpoints for an AI service
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class ChatRequest(BaseModel):
    question: str
    document_id: str

class ChatResponse(BaseModel):
    answer: str
    sources: list[str]

@app.get("/documents/{doc_id}")
def get_document(doc_id: str):
    doc = db.find(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    return doc

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    context = retriever.search(req.question, req.document_id)
    answer = llm.generate(req.question, context)
    return ChatResponse(answer=answer, sources=context.sources)`,
    project:
      "Build a minimal REST API with FastAPI that has CRUD endpoints for 'prompts' and a POST /run endpoint that sends the prompt to an LLM and returns the result.",
    interviewQuestions: [
      iq("What makes an API RESTful?", "Resources identified by URLs, standard HTTP methods for CRUD, stateless requests, JSON representations, and standard HTTP status codes. No server-side session state required.", "medium"),
      iq("How do you version a REST API?", "URL path versioning (/v1/chat) is most common and explicit. Header versioning (Accept: application/vnd.api+json;version=1) is alternative. Never break existing clients without a version bump.", "medium"),
      iq("What is idempotency and why does it matter for AI APIs?", "Repeating the same request produces the same result. GET, PUT, DELETE should be idempotent. POST to /chat is not — retries may duplicate charges. Use idempotency keys for paid LLM calls.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["Resources = nouns in URLs", "HTTP methods = CRUD operations", "JSON request/response bodies", "Stateless — auth in every request"],
      fifteenMin: ["FastAPI for Python REST APIs", "Pydantic for request validation", "404 for not found, 400 for bad input", "API versioning with /v1/", "Pagination with limit/offset or cursor", "OpenAPI docs auto-generated by FastAPI"],
      oneHour: ["Build CRUD API with FastAPI", "Add authentication middleware", "Implement error handling with proper status codes", "Write API integration tests", "Generate OpenAPI spec", "Deploy behind nginx with HTTPS"],
      cheatSheet: ["GET read, POST create", "PUT update, DELETE remove", "/v1/resource/{id}", "FastAPI + Pydantic", "HTTPException(status_code=404)", "OpenAPI at /docs"],
    },
    glossary: ["HTTP", "JSON", "CLI"],
    commonMistakes: [
      "Using GET for operations that modify data",
      "Inconsistent URL naming (verbs in paths like /getUser)",
      "Returning 200 with error messages in body instead of proper status codes",
      "No API versioning — breaking changes affect all clients",
    ],
  }),

  json: createLesson({
    concept:
      "JSON (JavaScript Object Notation) is the universal data format for AI APIs — every LLM request, response, tool schema, and config file uses it.",
    whyItExists:
      "AI systems exchange structured data constantly: chat messages, embedding vectors, tool definitions, evaluation results. JSON is human-readable, language-agnostic, and natively supported by every HTTP library and LLM SDK.",
    analogy:
      "JSON is the standardized form every department in a company uses — whether you're in Python, JavaScript, or Go, everyone fills out the same fields in the same format.",
    technicalExplanation:
      "JSON supports objects ({key: value}), arrays ([1,2,3]), strings, numbers, booleans, and null. Keys must be double-quoted strings. LLM APIs use nested JSON: messages array with role/content objects, tool schemas as JSON Schema, streaming responses as JSON lines. Python uses json module or Pydantic for serialization. Watch for: trailing commas (invalid), single quotes (invalid), large payloads affecting latency, and Unicode handling.",
    architecture:
      "Application objects → serialize to JSON string → HTTP body → deserialize on receiver → validate with schema (Pydantic/JSON Schema) → use in business logic.",
    diagram: `flowchart LR
    A[Python dict/Pydantic model] -->|json.dumps| B[JSON string]
    B -->|HTTP POST body| C[LLM API]
    C -->|JSON response| D[json.loads]
    D --> E[Python object]`,
    example:
      "You define a function-calling tool schema in JSON, send it with the chat request, and the LLM returns a JSON object with the function name and arguments to execute.",
    code: `import json
from pydantic import BaseModel

# Python dict to JSON
payload = {
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello"}],
    "temperature": 0.7,
}
json_str = json.dumps(payload)

# JSON Schema for tool definition
tool_schema = {
    "type": "function",
    "function": {
        "name": "get_weather",
        "parameters": {
            "type": "object",
            "properties": {"city": {"type": "string"}},
            "required": ["city"],
        },
    },
}

class ChatMessage(BaseModel):
    role: str
    content: str`,
    project:
      "Create a config.json for your AI app (model name, temperature, max_tokens). Load it at startup, validate with Pydantic, and override values via environment variables.",
    interviewQuestions: [
      iq("Why is JSON the standard for LLM APIs?", "Human-readable, lightweight, natively parsed by all languages, maps naturally to HTTP bodies, and supports nested structures needed for messages, tools, and metadata.", "easy"),
      iq("How do you validate JSON from an LLM response?", "Use Pydantic models or JSON Schema validation. Parse with json.loads, catch JSONDecodeError, and retry or ask the model to fix malformed output.", "medium"),
      iq("What are common JSON pitfalls in AI applications?", "LLMs generating invalid JSON (trailing commas, markdown fences), large payloads increasing latency, not handling Unicode in multilingual apps, and not validating before use.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["JSON: objects, arrays, strings, numbers", "Double quotes required for keys", "Standard format for all AI APIs", "json.dumps / json.loads in Python"],
      fifteenMin: ["Pydantic for validation and serialization", "JSON Schema for tool definitions", "Nested structures for chat messages", "Handle JSONDecodeError gracefully", "LLMs may wrap JSON in markdown code blocks", "Config files as JSON or JSON-compatible YAML"],
      oneHour: ["Serialize/deserialize LLM request/response", "Define tool schemas in JSON", "Validate LLM output with Pydantic", "Build config loader with env overrides", "Handle malformed JSON from LLMs", "Compare JSON vs MessagePack for performance"],
      cheatSheet: ["json.dumps(obj)", "json.loads(str)", "Pydantic BaseModel", "JSON Schema for tools", 'Double quotes only', "Catch JSONDecodeError"],
    },
    glossary: ["HTTP", "REST APIs", "Structured Outputs"],
    commonMistakes: [
      "Not validating JSON from LLM outputs before using",
      "Assuming LLM always returns valid JSON",
      "Using single quotes in JSON (invalid)",
      "Forgetting to strip markdown code fences from LLM JSON responses",
    ],
  }),

  cli: createLesson({
    concept:
      "The Command Line Interface (CLI) lets you interact with your computer and tools through text commands — essential for development, deployment, and building AI agent tools.",
    whyItExists:
      "Servers don't have GUIs. You deploy, debug, and automate via CLI. Many AI tools (git, docker, kubectl, aws, openai CLI) are command-line first. Agents themselves often execute CLI commands as tools.",
    analogy:
      "The CLI is like texting your computer precise instructions instead of pointing and clicking — faster for experts, scriptable, and works over remote connections.",
    technicalExplanation:
      "Shell (bash/zsh) interprets commands. Structure: command [options] [arguments]. Flags modify behavior (-v verbose, -f force). Pipes chain commands. Scripts (.sh files) automate workflows. For AI: build CLIs with Python argparse/typer/click, use CLIs as agent tools, and manage projects via git/docker/npm/pip commands. Exit codes: 0 = success, non-zero = error.",
    architecture:
      "User types command → shell parses → executes binary or script → stdout/stderr output → exit code. Scripts chain commands with && and ||. Environment variables configure behavior.",
    diagram: `flowchart TD
    A[Engineer types command] --> B[Shell parses]
    B --> C[Executes program]
    C --> D[stdout output]
    C --> E[stderr errors]
    C --> F[exit code 0 or 1]
    D --> G[Pipe to next command]`,
    example:
      "You build a CLI tool `rag-cli ingest ./docs` that chunks PDFs, embeds them, and stores in ChromaDB. Your agent later calls this same CLI as a tool to refresh the knowledge base.",
    code: `# Build a CLI with Python typer
import typer
from pathlib import Path

app = typer.Typer()

@app.command()
def summarize(file: Path, output: Path = None):
    """Summarize a text file using an LLM."""
    text = file.read_text()
    summary = ask_llm(f"Summarize: {text}")
    out = output or file.with_suffix(".summary.txt")
    out.write_text(summary)
    typer.echo(f"Saved to {out}")

@app.command()
def chat(question: str):
    """Ask a question against the knowledge base."""
    answer = rag_pipeline.query(question)
    typer.echo(answer)

if __name__ == "__main__":
    app()`,
    project:
      "Build a typer CLI with subcommands: `setup` (init project), `ask` (query LLM), `eval` (run evaluation suite). Add --verbose flag and proper exit codes.",
    interviewQuestions: [
      iq("Why do AI engineers need CLI skills?", "Servers are headless, deployment is CLI-driven, tools like docker/git/kubectl are CLI-based, and agents execute shell commands as tools in production.", "easy"),
      iq("How would you expose a CLI command as an agent tool?", "Wrap the CLI in a function that constructs the command, captures stdout/stderr, handles exit codes, and returns structured output to the agent. Validate inputs to prevent injection.", "medium"),
      iq("What are exit codes and why do they matter?", "0 means success, non-zero means failure. Scripts and CI pipelines check exit codes. Agents should verify exit codes after running shell commands, not just read stdout.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["CLI = text-based computer control", "command --flag argument", "Pipe with | chains commands", "Exit code 0 = success"],
      fifteenMin: ["argparse, typer, click for Python CLIs", "Environment variables configure CLI tools", "Scripts automate with bash", "Agents can call CLI as tools", "Redirect output with > and 2>", "Tab completion improves UX"],
      oneHour: ["Build a typer CLI for your AI project", "Add subcommands and options", "Handle errors with exit codes", "Write a bash deploy script", "Expose CLI as an agent tool safely", "Add input validation against injection"],
      cheatSheet: ["typer / click / argparse", "cmd --flag value", "echo $VAR", "cmd1 | cmd2", "exit code: echo $?", "chmod +x script.sh"],
    },
    glossary: ["Linux", "Git", "Docker"],
    commonMistakes: [
      "Not validating user input before passing to shell commands (injection risk)",
      "Ignoring exit codes — assuming success from stdout alone",
      "Hardcoding paths instead of using relative paths or config",
      "No --help documentation on custom CLI tools",
    ],
  }),

  docker: createLesson({
    concept:
      "Docker packages your application and all its dependencies into a portable container — ensuring it runs identically on your laptop, staging, and production.",
    whyItExists:
      "AI apps have complex dependencies (Python packages, system libraries, model files). 'It works on my machine' is a real problem. Docker solves this by creating reproducible, isolated environments for development and deployment.",
    analogy:
      "A shipping container — regardless of what's inside or which ship carries it, the container standard means it loads and unloads the same way everywhere.",
    technicalExplanation:
      "Docker uses images (blueprints) and containers (running instances). A Dockerfile defines how to build the image: base image (python:3.12-slim), install dependencies, copy code, set entrypoint. Docker Compose orchestrates multiple containers (app + database + vector DB). Volumes persist data. Networks connect containers. Multi-stage builds reduce image size.",
    architecture:
      "Dockerfile → docker build → Image → docker run → Container. Compose file defines multi-service stack. Registry (Docker Hub, ECR) stores images. CI builds and pushes images on merge.",
    diagram: `flowchart TD
    A[Dockerfile] -->|docker build| B[Image]
    B -->|docker run| C[Container: API]
    B -->|docker run| D[Container: ChromaDB]
    E[docker-compose.yml] --> C
    E --> D
    C <-->|network| D`,
    example:
      "Your FastAPI RAG app runs in one container, ChromaDB in another, connected via Docker Compose. Deploy the same compose file to any cloud VM.",
    code: `# Dockerfile for a Python AI API
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# docker build -t my-rag-app .
# docker run -p 8000:8000 --env-file .env my-rag-app`,
    project:
      "Dockerize your PDF chat application. Create a Dockerfile and docker-compose.yml with your API and ChromaDB. Verify it runs with a single docker-compose up command.",
    interviewQuestions: [
      iq("Why use Docker for AI applications?", "Reproducible environments, easy deployment, isolation between services, consistent dev/staging/prod, and simplified CI/CD pipelines.", "easy"),
      iq("Docker vs virtual machines?", "Containers share the host OS kernel — lighter, faster startup. VMs include full OS — heavier but stronger isolation. Containers are standard for AI app deployment.", "medium"),
      iq("How do you handle secrets in Docker?", "Never put secrets in Dockerfile or image layers. Use --env-file, Docker secrets, or cloud secret managers. Mount .env at runtime, not build time.", "medium"),
    ],
    revisionNotes: {
      fiveMin: ["Image = blueprint, Container = running instance", "Dockerfile defines how to build", "docker build + docker run", "Never put secrets in Dockerfile"],
      fifteenMin: ["Multi-stage builds for smaller images", "docker-compose for multi-service apps", ".dockerignore to exclude unnecessary files", "Volume mounts for persistent data", "Environment variables via --env-file", "Container networking for service communication"],
      oneHour: ["Write Dockerfile for FastAPI app", "Set up docker-compose with API + DB", "Deploy container to cloud VM", "Debug container with docker logs/exec", "Optimize image size with slim base", "Add health checks to containers"],
      cheatSheet: ["docker build -t name .", "docker run -p 8000:8000 name", "docker-compose up -d", "docker logs container_id", "docker exec -it container bash", ".dockerignore"],
    },
    glossary: ["CLI", "CI/CD", "REST APIs"],
    commonMistakes: [
      "Putting API keys in Dockerfile",
      "Not using .dockerignore (large images)",
      "Running as root in production",
      "Not pinning base image versions",
    ],
  }),

  sql: createLesson({
    concept:
      "SQL (Structured Query Language) is the standard language for relational databases — used to store user data, chat history, application state, and metadata in AI applications.",
    whyItExists:
      "AI apps need persistent storage: user accounts, conversation history, document metadata, audit logs, and evaluation results. Relational databases provide ACID transactions, structured schemas, and powerful querying with SQL.",
    analogy:
      "SQL is like Excel for databases — tables with rows and columns, but with powerful queries that can join, filter, and aggregate millions of rows instantly.",
    technicalExplanation:
      "Relational databases (PostgreSQL, MySQL, SQLite) store data in tables with defined schemas. SQL operations: SELECT (read), INSERT (create), UPDATE (modify), DELETE (remove). JOIN combines tables. Indexes speed lookups. PostgreSQL is the go-to for AI apps — it supports JSON columns, full-text search, and the pgvector extension for embeddings. ORMs like SQLAlchemy map Python objects to tables.",
    architecture:
      "Application → ORM (SQLAlchemy) → connection pool → PostgreSQL. Migrations (Alembic) version the schema. Read replicas handle query load. Transactions ensure data consistency.",
    diagram: `flowchart TD
    A[FastAPI App] --> B[SQLAlchemy ORM]
    B --> C[Connection Pool]
    C --> D[(PostgreSQL)]
    D --> E[users table]
    D --> F[chats table]
    D --> G[documents table]`,
    example:
      "Your chat app stores conversations in PostgreSQL. Each message has user_id, role, content, timestamp, and tokens_used. You query the last 10 messages for context window management.",
    code: `# SQLAlchemy models for an AI chat app
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, create_engine
from sqlalchemy.orm import declarative_base, Session

Base = declarative_base()

class Chat(Base):
    __tablename__ = "chats"
    id = Column(Integer, primary_key=True)
    user_id = Column(String, nullable=False)
    title = Column(String)

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey("chats.id"))
    role = Column(String)  # user, assistant, system
    content = Column(String)
    tokens_used = Column(Integer)

# Query recent messages
# SELECT * FROM messages WHERE chat_id = 1 ORDER BY id DESC LIMIT 10`,
    project:
      "Add PostgreSQL to your AI app with SQLAlchemy. Store chat history, implement GET /chats and GET /chats/{id}/messages endpoints, and use Alembic for migrations.",
    interviewQuestions: [
      iq("When would you use SQL vs a vector database?", "SQL for structured data: users, metadata, chat history, billing. Vector DB for semantic similarity search on embeddings. Most AI apps use both.", "medium"),
      iq("What is pgvector and why is it useful?", "PostgreSQL extension for storing and querying vector embeddings. Lets you combine relational data and vector search in one database — simpler architecture for small-to-medium apps.", "medium"),
      iq("Explain database indexes in the context of AI apps.", "Indexes speed up lookups on frequently queried columns (user_id, created_at). Without indexes, finding a user's chat history in millions of rows requires full table scans.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["SQL queries relational databases", "Tables: rows and columns", "SELECT, INSERT, UPDATE, DELETE", "PostgreSQL is the AI app default"],
      fifteenMin: ["SQLAlchemy ORM maps Python to tables", "JOINs combine related tables", "Indexes speed up queries", "Migrations with Alembic", "pgvector for embeddings in Postgres", "Connection pooling for performance"],
      oneHour: ["Set up PostgreSQL with Docker", "Define SQLAlchemy models", "Write CRUD queries", "Add Alembic migrations", "Store and retrieve chat history", "Query with filters and pagination"],
      cheatSheet: ["SELECT * FROM table WHERE...", "INSERT INTO table VALUES...", "SQLAlchemy + Alembic", "PostgreSQL + pgvector", "Index on foreign keys", "Connection pool in FastAPI"],
    },
    glossary: ["NoSQL", "REST APIs", "Docker"],
    commonMistakes: [
      "Storing large text/embeddings in SQL without considering size limits",
      "No database migrations — schema drift between environments",
      "SQL injection from raw string queries (use parameterized queries)",
      "Not indexing columns used in WHERE clauses",
    ],
  }),

  nosql: createLesson({
    concept:
      "NoSQL databases store data in flexible, non-tabular formats — document stores, key-value caches, and vector databases are all critical for AI application architecture.",
    whyItExists:
      "AI apps handle diverse data: JSON documents, session caches, real-time metrics, and high-dimensional embedding vectors. NoSQL databases optimize for these patterns where relational models are awkward or too slow.",
    analogy:
      "If SQL is a filing cabinet with strict folders, NoSQL is a warehouse with different storage zones — shelves for documents, bins for key-value pairs, and specialized racks for vector embeddings.",
    technicalExplanation:
      "NoSQL categories: document stores (MongoDB — flexible JSON documents), key-value (Redis — fast caching, session storage), wide-column (Cassandra — massive scale), and vector databases (Pinecone, ChromaDB, Weaviate — embedding storage and similarity search). AI apps commonly use Redis for caching LLM responses, MongoDB for flexible document storage, and dedicated vector DBs for RAG retrieval.",
    architecture:
      "API layer queries multiple stores: PostgreSQL for users/metadata, Redis for cache/sessions, Vector DB for semantic search. Each store optimized for its access pattern.",
    diagram: `flowchart TD
    A[AI Application] --> B[(PostgreSQL metadata)]
    A --> C[(Redis cache)]
    A --> D[(Vector DB embeddings)]
    A --> E[(MongoDB documents)]
    C -->|cache miss| A
    D -->|similarity search| A`,
    example:
      "Your RAG app caches frequent queries in Redis (1-hour TTL), stores document metadata in PostgreSQL, full document content in MongoDB, and chunk embeddings in Pinecone for retrieval.",
    code: `# Redis caching for LLM responses
import redis
import json
import hashlib

r = redis.Redis(host="localhost", port=6379)

def cached_llm_call(prompt: str) -> str:
    key = f"llm:{hashlib.md5(prompt.encode()).hexdigest()}"
    cached = r.get(key)
    if cached:
        return json.loads(cached)
    response = call_llm(prompt)
    r.setex(key, 3600, json.dumps(response))  # 1 hour TTL
    return response`,
    project:
      "Add Redis caching to your LLM API. Cache responses by prompt hash with TTL. Add a /cache/stats endpoint showing hit rate. Compare latency with and without cache.",
    interviewQuestions: [
      iq("When should you choose NoSQL over SQL?", "When you need flexible schemas (documents), extreme read speed (caching), horizontal scaling (sharding), or specialized search (vector similarity). Use SQL when relationships and transactions matter.", "medium"),
      iq("How is a vector database different from a regular NoSQL store?", "Vector DBs are optimized for approximate nearest neighbor search on high-dimensional embeddings. They use specialized indexes (HNSW, IVF) for fast similarity queries that general databases can't match at scale.", "medium"),
      iq("What are trade-offs of using Redis for LLM response caching?", "Pros: massive latency reduction, cost savings on API calls. Cons: stale responses if underlying data changes, memory limits, cache invalidation complexity, and cached wrong answers persist until TTL expires.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["NoSQL = flexible non-tabular storage", "Redis for caching, MongoDB for documents", "Vector DBs for embedding search", "AI apps often use multiple databases"],
      fifteenMin: ["Document stores: schema-flexible JSON", "Key-value: Redis for speed", "Vector DBs: Pinecone, ChromaDB, Weaviate", "Cache LLM responses with TTL", "Choose the right store per data type", "Eventual consistency in some NoSQL systems"],
      oneHour: ["Set up Redis with Docker", "Implement LLM response caching", "Store documents in MongoDB", "Compare query patterns across SQL/NoSQL/Vector", "Design multi-database architecture", "Monitor cache hit rates"],
      cheatSheet: ["Redis: r.setex(key, ttl, value)", "MongoDB: flexible documents", "Vector DB: similarity search", "Cache key = hash of input", "TTL prevents stale data", "Right tool for right data"],
    },
    glossary: ["SQL", "Vector Databases", "Embeddings"],
    commonMistakes: [
      "Using one database for everything instead of right tool for the job",
      "No cache invalidation strategy — serving stale answers",
      "Ignoring memory limits on Redis",
      "Storing vectors in a regular database without proper indexing",
    ],
  }),

  testing: createLesson({
    concept:
      "Testing ensures your AI application works correctly — unit tests for logic, integration tests for APIs, and evaluation suites for LLM output quality.",
    whyItExists:
      "AI apps are non-deterministic and complex. Testing catches bugs in retrieval logic, API contracts, data pipelines, and regressions in prompt quality. Without tests, every deploy is a gamble.",
    analogy:
      "Testing is a safety net under a trapeze artist — you hope you don't need it, but it catches you when something goes wrong. For AI, you need both structural nets (unit tests) and quality checks (evals).",
    technicalExplanation:
      "Testing pyramid: unit tests (fast, isolated — test functions with mocked LLM), integration tests (API endpoints with test database), end-to-end tests (full user flows). For AI specifically: mock LLM responses in tests (don't call real APIs), use pytest fixtures, test retrieval logic independently from generation, and build evaluation datasets for output quality. Snapshot testing captures expected LLM outputs for regression detection.",
    architecture:
      "tests/ directory mirrors src/. pytest runs unit and integration tests. CI runs tests on every PR. Eval suite runs separately with real LLM calls on a schedule. Mocks replace external services in unit tests.",
    diagram: `flowchart TD
    A[Code Change] --> B[Unit Tests mocked LLM]
    B --> C[Integration Tests test DB]
    C --> D[CI Pipeline]
    D -->|pass| E[Deploy]
    D -->|fail| F[Block merge]
    G[Eval Suite] -->|scheduled| H[Quality metrics]`,
    example:
      "You write a unit test for your chunking function (deterministic), an integration test for POST /chat (mocked LLM response), and an eval that checks answer accuracy against 50 golden questions.",
    code: `# Testing an AI application with pytest
import pytest
from unittest.mock import patch, MagicMock

def test_chunk_text():
    text = "Hello world. " * 100
    chunks = chunk_text(text, chunk_size=50)
    assert len(chunks) > 1
    assert all(len(c) <= 60 for c in chunks)

@patch("app.llm_client.chat.completions.create")
def test_chat_endpoint(mock_llm, client):
    mock_llm.return_value = MagicMock(
        choices=[MagicMock(message=MagicMock(content="Paris"))]
    )
    response = client.post("/chat", json={"question": "Capital of France?"})
    assert response.status_code == 200
    assert "Paris" in response.json()["answer"]`,
    project:
      "Add pytest to your AI project. Write 5 unit tests (chunking, parsing, validation), 2 integration tests (API endpoints with mocked LLM), and 1 eval script with 10 golden Q&A pairs.",
    interviewQuestions: [
      iq("How do you test code that calls LLM APIs?", "Mock the LLM client in unit/integration tests. Use deterministic fixtures for expected responses. Reserve real LLM calls for evaluation suites run on schedule, not in CI.", "medium"),
      iq("What is the difference between tests and evals?", "Tests verify deterministic behavior (code logic, API contracts). Evals measure non-deterministic output quality (accuracy, relevance, safety) against golden datasets.", "medium"),
      iq("How do you prevent flaky AI tests?", "Mock external APIs, don't assert exact LLM output text, use semantic similarity thresholds for evals, pin model versions, and separate fast tests (CI) from slow evals (scheduled).", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["Unit tests: fast, isolated, mocked", "Integration tests: API + test DB", "Evals: measure LLM output quality", "Never call real LLM APIs in CI unit tests"],
      fifteenMin: ["pytest fixtures and parametrize", "unittest.mock.patch for LLM mocking", "Test retrieval logic separately from generation", "Golden datasets for evaluation", "Snapshot testing for regression", "Test coverage for critical paths"],
      oneHour: ["Set up pytest in AI project", "Write unit tests with mocks", "Write API integration tests", "Build eval script with metrics", "Add tests to CI pipeline", "Measure and improve test coverage"],
      cheatSheet: ["pytest test_file.py", "@patch for mocking", "assert response.status_code == 200", "fixtures for test data", "mock LLM, test logic", "evals != unit tests"],
    },
    glossary: ["CI/CD", "Evaluation", "Python"],
    commonMistakes: [
      "Calling real LLM APIs in unit tests — slow, expensive, flaky",
      "Testing LLM output verbatim instead of structure/semantics",
      "No tests for retrieval/chunking logic (the deterministic parts)",
      "Skipping integration tests — only testing in production",
    ],
  }),

  "ci-cd": createLesson({
    concept:
      "CI/CD (Continuous Integration / Continuous Deployment) automates testing, building, and deploying your AI application — ensuring every change is validated before reaching production.",
    whyItExists:
      "AI projects change frequently — new prompts, model updates, pipeline tweaks. Manual deployment is error-prone. CI/CD runs tests automatically, builds Docker images, and deploys to staging/production with confidence.",
    analogy:
      "CI/CD is an assembly line quality checkpoint — every product (code change) is inspected (tested), packaged (built), and shipped (deployed) automatically, with defective items rejected before they reach customers.",
    technicalExplanation:
      "CI: on every push/PR, run linting, unit tests, integration tests, and build Docker image. CD: on merge to main, deploy to staging, run smoke tests, then promote to production. Tools: GitHub Actions, GitLab CI, CircleCI. Pipeline stages: checkout → install deps → test → build → push image → deploy. For AI: also run eval suites on schedule, version prompts in CI artifacts, and use feature flags for model swaps.",
    architecture:
      "Developer pushes code → GitHub Actions triggered → run tests → build Docker image → push to registry → deploy to staging → smoke test → deploy to production. Secrets managed via CI environment variables.",
    diagram: `flowchart LR
    A[git push] --> B[CI: lint + test]
    B --> C[Build Docker image]
    C --> D[Push to registry]
    D --> E[Deploy staging]
    E --> F[Smoke tests]
    F --> G[Deploy production]`,
    example:
      "You push a new RAG retriever to a feature branch. GitHub Actions runs pytest, builds the Docker image, deploys to staging, runs a smoke test asking 'What is our refund policy?', and auto-deploys to production if accuracy passes.",
    code: `# GitHub Actions CI/CD for AI app
# .github/workflows/deploy.yml
name: CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest tests/ -v

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: docker build -t my-rag-app .
      - run: docker push my-rag-app:latest
      # deploy to cloud...`,
    project:
      "Set up GitHub Actions for your AI project: run pytest on PRs, build Docker image on merge to main, and add a manual workflow_dispatch for running evals.",
    interviewQuestions: [
      iq("What should an AI project's CI pipeline include?", "Linting, unit tests (mocked LLM), integration tests, Docker build, and optionally eval suite on schedule. Never run expensive LLM evals on every PR.", "medium"),
      iq("How do you manage secrets in CI/CD?", "Use CI platform secret stores (GitHub Secrets, GitLab CI variables). Never hardcode in workflow files. Inject as environment variables at runtime. Rotate keys regularly.", "medium"),
      iq("What is the difference between continuous delivery and continuous deployment?", "Continuous delivery: every change is deployable but requires manual approval for production. Continuous deployment: every passing build auto-deploys to production. AI teams often use delivery with manual approval for model changes.", "hard"),
    ],
    revisionNotes: {
      fiveMin: ["CI runs tests on every push", "CD automates deployment", "GitHub Actions is common", "Never put secrets in workflow files"],
      fifteenMin: ["Pipeline: test → build → deploy", "Docker image built in CI", "Staging before production", "Smoke tests after deploy", "Eval suites on schedule, not every PR", "Feature flags for safe rollouts"],
      oneHour: ["Create GitHub Actions workflow", "Run pytest in CI", "Build and push Docker image", "Set up staging deployment", "Add smoke test step", "Configure secrets in GitHub"],
      cheatSheet: ["on: push / pull_request", "pytest in CI", "Docker build in pipeline", "GitHub Secrets for API keys", "needs: test before deploy", "workflow_dispatch for manual runs"],
    },
    glossary: ["Git", "Docker", "Testing"],
    commonMistakes: [
      "Committing secrets in workflow YAML files",
      "Running expensive LLM evals on every PR — slow and costly",
      "No staging environment — deploying directly to production",
      "Skipping tests in CI to speed up deploys",
    ],
  }),
};
