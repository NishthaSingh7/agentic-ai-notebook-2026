import type { LessonContent } from "../lesson-types";
import { createLesson } from "./builder";
import { pastelChart } from "@/lib/mermaid-pastel";

export const phase0Lessons: Record<string, LessonContent> = {
  "start-here": createLesson({
    concept:
      "Phase 0 is the engineering foundation every AI builder needs before touching LLMs, RAG, or agents — it teaches the tools and concepts behind every production AI system.",
    technicalExplanation:
      "You will not master every topic here on day one. The goal is familiarity: know what each tool does, when to use it, and where to look when something breaks. Each module follows the same format — concept bullets, why it matters, analogy, visual diagram, example, practice task, commands, and cheat sheet. Study in order when you are new; skip modules you already know and return to the cheat sheets when needed.",
    whyItExists:
      "Most AI courses jump straight to prompting and agents. Production AI engineering requires Python, Git, Linux, HTTP, databases, Docker, and CI/CD. Phase 0 fills that gap so Phase 1+ makes sense instead of feeling like magic.",
    analogy:
      "Phase 0 is learning to drive before entering a highway — you need steering, brakes, and mirrors before merging into fast AI traffic.",
    analogyDiagram: `flowchart LR
    A[Phase 0 - foundations] --> B[Phase 1 - GenAI]
    B --> C[Phase 4 - RAG]
    C --> D[Phase 5+ - Agents]
    A --> E[You can debug when things break]`,
    diagram: `flowchart TD
    P0([Phase 0 - Programming Foundations])

    subgraph Why["Why Each Module Exists"]
        W1[Python - write AI apps and call APIs]
        W2[Git - version control prompts and code]
        W3[Linux - debug servers and read logs]
        W4[Networking - understand connections and timeouts]
        W5[HTTP - every LLM API speaks HTTP]
        W6[REST APIs - design and consume backends]
        W7[JSON - data format for all AI systems]
        W8[CLI - run tools on servers and in agents]
        W9[Docker - ship reproducible environments]
        W10[SQL - store users and chat history]
        W11[NoSQL - cache and vector search]
        W12[Testing - catch bugs before users do]
        W13[CI/CD - automate deploy with confidence]
    end

    subgraph Study["How to Study Each Module"]
        S1[1. Read Concept bullets - what and how]
        S2[2. Read Why It Exists - motivation]
        S3[3. Skim Analogy - mental model]
        S4[4. Study Visual Diagram - full topic map]
        S5[5. Read Example - real scenario]
        S6[6. Complete Practice Task - hands-on]
        S7[7. Run Commands in terminal]
        S8[8. Review Cheat Sheet - quick recap]
    end

    subgraph Done["You Are Ready to Move On When"]
        D1[You can explain the topic in one sentence]
        D2[You recognize it when you see it in a project]
        D3[You know which commands to look up]
        D4[You do not need to memorize everything]
    end

    subgraph Path["Recommended Study Path"]
        P1[Week 1 - Python Git Linux CLI]
        P2[Week 2 - Networking HTTP REST JSON]
        P3[Week 3 - Docker SQL NoSQL]
        P4[Week 4 - Testing CI/CD plus mini project]
    end

    P0 --> Why
    P0 --> Study
    P0 --> Done
    P0 --> Path`,
    example:
      "You are new to programming and want to build an AI chatbot eventually.",
    exampleSolution:
      "Start with Python and Git, then HTTP and JSON (because every LLM API uses them), then Docker and SQL when you deploy. Skip deep mastery of Linux networking until you hit a real bug — but read the cheat sheets so you know where to look.",
    practiceTask:
      "Open the Python module next. Skim its diagram and cheat sheet, then come back here after finishing all 14 modules to confirm you can explain why each one exists in one sentence.",
    commandsToRemember: [
      "Open one module per study session  # do not rush through all 14 at once",
      "Run every command in Commands to Remember  # typing beats reading",
      "Bookmark cheat sheets  # revisit when building real projects",
      "git checkout -b phase-0-practice  # practice in a safe branch",
      "python -m venv .venv && source .venv/bin/activate  # set up practice environment",
    ],
    interviewQuestions: [],
    revisionNotes: {
      fiveMin: [],
      fifteenMin: [],
      oneHour: [],
      cheatSheet: [
        "Phase 0 = engineering base before AI — not optional for production work",
        "Goal is familiarity, not mastery — revisit cheat sheets when building",
        "Study order: Python → Git → Linux → CLI → Networking → HTTP → REST → JSON → Docker → SQL → NoSQL → Testing → CI/CD",
        "Per module: bullets → why → diagram → example → practice task → commands → cheat sheet",
        "Skip modules you know; never skip HTTP, JSON, and Git",
        "Phase 1 (GenAI) assumes you understand HTTP requests and JSON responses",
        "Build the Phase 0 projects (REST API, Docker, Git workflow) to connect everything",
        "~3 hours per module if new · ~30 min skim if experienced",
      ],
    },
    glossary: ["Python", "Git", "HTTP", "Docker", "CI/CD"],
    commonMistakes: [
      "Skipping Phase 0 and jumping to agents — then not understanding API errors or deployment",
      "Trying to memorize every command instead of knowing where to look",
      "Reading without running commands in the terminal",
      "Expecting Phase 0 to teach Python from zero — use external practice for deep coding skill",
    ],
  }),

  python: createLesson({
    visualFirst: true,
    concept:
      "Python orchestrates every AI app — user input → LLM → tools → response.",
    technicalExplanation:
      "Roles: data handling, model APIs, orchestration, tool calling, memory, evaluation. Libraries: OpenAI, FastAPI, Pydantic, LangChain, ChromaDB, tiktoken.",
    learnElsewhere: [
      "Variables, strings, numbers, and booleans",
      "if/else conditions and for/while loops",
      "Functions with def, parameters, and return",
      "Lists, dicts, and reading files with open()",
      "try/except error handling",
      "Recommended: python.org tutorial, Automate the Boring Stuff, or CS50 Python",
    ],
    whyItExists:
      "Nearly every AI tool, tutorial, and job listing expects Python. It is simple to read, fast to prototype, integrates every API, and scales from notebook to production.",
    analogy:
      "Python is the conductor of an orchestra — it does not play every instrument (LLM, database, API) but coordinates them into one performance.",
    analogyDiagram: pastelChart(
      `flowchart LR
    User["User - Input / Prompt"] --> Py["Python Application - orchestrates everything"]
    Py --> LLM["AI / LLM - Brain"]
    LLM --> Tools["Tools / APIs - Action"]
    Tools --> Resp["Response to User"]
    Resp -.->|next request| User`,
      `class User grp1
    class Py grp2
    class LLM grp3
    class Tools grp4
    class Resp grp5`
    ),
    diagram: pastelChart(
      `flowchart TD
    PY([Python in the AI Stack])

    subgraph Roles["Python's Role"]
        R1[Data Handling - pandas, numpy]
        R2[Model Interaction - LLM, embeddings, vision]
        R3[Orchestration - chain steps and logic]
        R4[Tool Calling - APIs, DB, search, browser]
        R5[Memory and State - sessions, cache]
        R6[Evaluation - test, score, improve]
    end

    subgraph Libs["Common AI Libraries"]
        L1[NumPy - arrays]
        L2[Pandas - DataFrames]
        L3[Requests / httpx - API calls]
        L4[Pydantic - validation]
        L5[LangChain / LangGraph - workflows]
        L6[CrewAI / Microsoft AF - agents]
        L7[Chroma / FAISS - vector DB]
        L8[OpenAI / Anthropic / Gemini APIs]
        L9[Tiktoken - tokens]
        L10[python-dotenv - configs]
        L11[FastAPI - backend API]
    end

    PY --> Roles
    PY --> Libs`,
      `class PY hub
    class R1,R2,R3,R4,R5,R6 grp1
    class L1,L2,L3,L4,L5,L6,L7,L8,L9,L10,L11 grp2
    style Roles fill:#fff7ed,stroke:#fdba74,color:#9a3412
    style Libs fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6`
    ),
    workflowDiagrams: [
      {
        title: "Why Python for AI?",
        caption: "Seven reasons Python is the default language for AI engineering.",
        chart: pastelChart(
          `flowchart TD
    WP([Why Python for AI?])

    subgraph Reasons["Key Advantages"]
        W1[Simple and readable syntax]
        W2[Huge ecosystem and libraries]
        W3[Great for prototyping]
        W4[Strong community support]
        W5[Easy integration with APIs]
        W6[Ideal for automation and agents]
        W7[Scalable from prototype to production]
    end

    WP --> Reasons`,
          `class WP hub
    class W1,W2,W3,W4,W5,W6,W7 grp1
    style Reasons fill:#f0fdf4,stroke:#86efac,color:#166534`
        ),
      },
      {
        title: "End-to-End AI Application Flow",
        caption: "How Python sits in the middle of every real AI product.",
        chart: pastelChart(
          `flowchart LR
    U[User gives input] --> P[Python Application]
    P --> B[LLM processes input]
    B --> T[Python calls tools and APIs]
    T --> O[Final response to user]
    O -.-> U`,
          `class U grp1
    class P,T grp2
    class B grp3
    class O grp4`
        ),
      },
    ],
    example:
      "You need to summarize 50 customer support tickets overnight.",
    exampleSolution:
      "Write a Python script that reads each file, calls the OpenAI API, and saves summaries — done in under 30 lines.",
    practiceTask: "",
    commandsToRemember: [
      "python -m venv .venv  # create virtual environment",
      "source .venv/bin/activate  # activate venv on Mac/Linux",
      "pip install -r requirements.txt  # install project dependencies",
      "python script.py  # run a Python script",
      "uvicorn main:app --reload  # start FastAPI dev server with auto-reload",
    ],
    interviewQuestions: [],
    revisionNotes: {
      fiveMin: [],
      fifteenMin: [],
      oneHour: [],
      cheatSheet: [
        "Python orchestrates: User → Python → LLM → Tools → Response",
        "Roles: data, models, orchestration, tools, memory, evaluation",
        "Libraries: openai, fastapi, pydantic, langchain, chromadb, tiktoken",
        "Simple syntax · huge ecosystem · fast prototyping",
        "Always use venv + requirements.txt for dependencies",
        "Store API keys in .env — never hardcode in source",
        "async/await for concurrent LLM API calls",
        "Scales from notebook prototype to production API",
      ],
    },
    glossary: ["CLI", "REST APIs", "JSON"],
    commonMistakes: [
      "Skipping virtual environments",
      "Hardcoding API keys in source code",
      "Using sync code for I/O-heavy agent systems",
    ],
  }),

  git: createLesson({
    visualFirst: true,
    concept:
      "Git tracks code from your laptop to GitHub — branches, PRs, merges, and releases.",
    technicalExplanation:
      "Flow: Working Directory → git add → Staging → git commit → Local Repo → git push → GitHub. Feature branches isolate work. git pull = fetch + merge.",
    whyItExists:
      "AI projects change constantly — new prompts, models, pipelines. Git keeps you organized, enables team collaboration, and lets you roll back mistakes.",
    analogy:
      "Git is a time machine for code — save snapshots, branch into parallel timelines, and merge the best timeline back to main.",
    analogyDiagram: pastelChart(
      `flowchart LR
    A[Working Directory] -->|git add| B[Staging Area]
    B -->|git commit| C[Local Repo]
    C -->|git push| D[GitHub origin]`,
      `class A,B,C grp1
    class D grp2`
    ),
    diagram: pastelChart(
      `flowchart TD
    GIT([Git and GitHub - Full Map])

    subgraph Core["Core Concepts"]
        C1[HEAD - points to current branch and commit]
        C2[main - long-lived production branch]
        C3[Every developer has their own HEAD]
        C4[Feature branches - short-lived isolation]
    end

    subgraph Local["Git Internals - Local"]
        L1[Working Directory - edit files]
        L2[git add - stage changes]
        L3[Staging Area - temp holding zone]
        L4[git commit - save snapshot]
        L5[Local Repo .git - branches and history]
    end

    subgraph Remote["Remote Repository"]
        R1[git push - upload commits]
        R2[GitHub origin - remote repo]
        R3[origin/feature branches]
        R4[git fetch - download without merge]
        R5[git pull = fetch + merge]
        R6[origin/hotfix - urgent fixes]
    end

    subgraph Collab["Collaboration"]
        CO1[Pull Request - code review]
        CO2[Merge conflict - manual resolve]
        CO3[Merge / Squash / Rebase strategies]
        CO4[Cherry-pick - copy specific commits]
    end

    GIT --> Core
    GIT --> Local
    Local --> L1 --> L2 --> L3 --> L4 --> L5
    L5 --> Remote
    GIT --> Collab`,
      `class GIT hub
    class C1,C2,C3,C4 grp1
    class L1,L2,L3,L4,L5 grp2
    class R1,R2,R3,R4,R5,R6 grp3
    class CO1,CO2,CO3,CO4 grp4
    style Core fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6
    style Local fill:#ecfdf5,stroke:#6ee7b7,color:#065f46
    style Remote fill:#eff6ff,stroke:#93c5fd,color:#1e40af
    style Collab fill:#fdf2f8,stroke:#f9a8d4,color:#9d174d`
    ),
    workflowDiagrams: [
      {
        title: "Branching and Feature Development",
        caption: "How feature branches stay isolated from main until ready to merge.",
        chart: pastelChart(
          `flowchart TD
    MAIN[origin/main - long-lived branch]
    HEAD[HEAD - your current branch pointer]

    subgraph Features["Local Feature Branches"]
        F1[feature/login]
        F2[feature/payment]
        F3[feature/profile]
    end

    F1 -->|git push| RF1[origin/feature-login]
    F2 -->|git push| RF2[origin/feature-payment]
    RF1 -->|Pull Request| MAIN
    HEAD --> Features
    MAIN -->|git pull| Features`,
          `class MAIN grp1
    class HEAD hub
    class F1,F2,F3 grp2
    class RF1,RF2 grp3
    style Features fill:#f5f3ff,stroke:#c4b5fd,color:#5b21b6`
        ),
      },
      {
        title: "Pull Request and Merge Strategies",
        caption: "From PR to merged code — including conflict resolution.",
        chart: pastelChart(
          `flowchart TD
    PR[Pull Request opened]
    PR --> Conflict{Merge conflict?}
    Conflict -->|Yes| Resolve[Resolve conflict manually]
    Resolve --> Merge
    Conflict -->|No| Merge[Merge into target branch]
    Merge --> MC[Merge Commit]
    Merge --> SM[Squash and Merge]
    Merge --> RM[Rebase and Merge]
    CP[Cherry-pick] -.->|copy commit| MAIN[main branch]`,
          `class PR,Conflict,Resolve,Merge,MC,SM,RM,CP grp1
    class MAIN grp2`
        ),
      },
      {
        title: "Release Workflow",
        caption: "How tested code moves from development to live users.",
        chart: pastelChart(
          `flowchart TD
    DEV[Development] --> TEST[Testing Branch]
    TEST --> QA[QA Testing]
    QA --> DEPLOY[Deploy to Production]
    DEPLOY --> INT[Internal Testers - v1]
    INT --> BETA[Internal Beta]
    BETA --> LIVE[Live Users - v2.0 tagged release]`,
          `class DEV,TEST,QA,DEPLOY,INT,BETA,LIVE grp1`
        ),
      },
      {
        title: "Open Source — Fork and Clone",
        caption: "Contributing to or copying someone else's repository.",
        chart: pastelChart(
          `flowchart LR
    UP[Random Person GitHub] -->|Fork| YOUR[Your GitHub copy]
    UP -->|Clone| THEIR[Their local system]
    YOUR -->|Clone| YOU[Your local laptop]
    YOU -->|git push| YOUR`,
          `class UP,YOUR grp1
    class THEIR,YOU grp2`
        ),
      },
    ],
    example:
      "You want to test a new RAG chunking strategy without breaking the working version.",
    exampleSolution:
      "Create branch experiment/chunking, test it, compare results, then merge the winner into main via pull request.",
    practiceTask:
      "Run git init in an empty folder. Create README.md, commit it, create branch feature/test, make a second commit, switch back to main, and merge the branch. Run git log --oneline to see your history.",
    commandsToRemember: [
      "git init  # initialize Git in a new project",
      "git clone <url>  # copy a remote repository locally",
      "git status  # show current repository state",
      "git checkout -b <branch>  # create and switch to a new branch",
      "git add .  # stage all modified files",
      "git commit -m \"message\"  # save staged changes as a commit",
      "git push origin <branch>  # upload local branch to GitHub",
      "git fetch  # download remote changes without merging",
      "git pull  # fetch and merge latest remote changes",
      "git merge <branch>  # merge another branch into current",
      "git rebase <branch>  # replay commits on top of another branch",
      "git cherry-pick <commit>  # copy a specific commit",
      "git log --oneline  # view concise commit history",
      "git stash  # temporarily save uncommitted changes",
      "git stash pop  # restore latest stashed changes",
    ],
    interviewQuestions: [],
    revisionNotes: {
      fiveMin: [],
      fifteenMin: [],
      oneHour: [],
      cheatSheet: [
        "HEAD → current branch → latest commit",
        "Flow: Working Dir → git add → Staging → git commit → Local Repo",
        "git push uploads · git fetch downloads · git pull = fetch + merge",
        "Feature branches isolate work · PR before merging to main",
        "Merge strategies: merge commit · squash · rebase",
        "Cherry-pick copies a specific commit to another branch",
        "Fork = your copy of someone's repo · Clone = download locally",
        "Release: dev → QA → internal beta → production tag v2.0",
      ],
    },
    glossary: ["CLI", "CI/CD"],
    commonMistakes: [
      "Committing API keys or .env files",
      "Working directly on main branch",
      "Not pulling before pushing",
      "Ignoring merge conflicts instead of resolving them",
    ],
  }),

  linux: createLesson({
    concept:
      "Linux is the operating system behind most cloud servers and containers — you use its terminal to deploy, debug, and manage AI apps.",
    technicalExplanation:
      "Key skills: navigate files (cd, ls), read logs (tail, grep), manage processes (ps, kill), and set permissions (chmod).",
    whyItExists:
      "Your AI app runs on a Linux server in production. You need the terminal to fix crashes, read logs, and restart services.",
    analogy:
      "Linux is the backstage of a theater — users see the app on stage, engineers work behind the scenes.",
    analogyDiagram: `flowchart LR
    A[Audience sees app] --> B[Stage]
    C[Engineer] --> D[Backstage servers and logs]`,
    diagram: `flowchart TD
    LX([Linux])

    subgraph Access["Remote Access"]
        A1[SSH into cloud server]
        A2[Terminal shell - bash/zsh]
    end

    subgraph Files["File Commands"]
        F1[ls - list files]
        F2[cd - change directory]
        F3[pwd - current path]
        F4[cat / tail - read files]
        F5[grep - search in files]
    end

    subgraph Process["Process Management"]
        P1[ps - list processes]
        P2[kill - stop process]
        P3[systemctl - manage services]
    end

    subgraph System["System Checks"]
        S1[df -h - disk space]
        S2[chmod - file permissions]
        S3[Environment variables / .env]
    end

    LX --> Access
    Access --> Files
    Access --> Process
    Access --> System
    Files --> Deploy[Deploy or fix AI app]`,
    example:
      "Your RAG API crashes in production and users see a 500 error.",
    exampleSolution:
      "SSH into the server, run docker logs to find the ERROR, check disk space with df -h, and restart the service.",
    practiceTask:
      "In your terminal: run pwd, ls, and cd into a project folder. Create a test.log file with a few lines, then grep a word in it. Run ps to list running processes.",
    commandsToRemember: [
      "ls -la  # list files with permissions and hidden files",
      "cd /path && pwd  # navigate to a folder and show current path",
      "tail -f app.log  # follow live log output in real time",
      "ps aux | grep name  # find a running process by name",
      "chmod 600 .env  # restrict file access to owner only",
      "df -h  # check available disk space",
      "grep -r \"pattern\" dir/  # search for text inside files",
    ],
    interviewQuestions: [],
    revisionNotes: {
      fiveMin: [],
      fifteenMin: [],
      oneHour: [],
      cheatSheet: [
        "Most cloud servers run Linux — access via SSH",
        "Navigate: ls, cd, pwd · Read logs: tail -f, grep",
        "Manage processes: ps, kill, systemctl",
        "chmod 600 .env — protect API keys on server",
        "df -h — check disk space (common crash cause)",
        "Never run production services as root",
      ],
    },
    glossary: ["CLI", "Docker", "CI/CD"],
    commonMistakes: [
      "Running everything as root",
      "Not checking disk space before large indexing jobs",
      "Leaving API keys in shell history",
    ],
  }),

  networking: createLesson({
    concept:
      "Networking is how computers communicate — IP addresses, ports, DNS, and firewalls control every connection in your AI stack.",
    technicalExplanation:
      "TCP is reliable (HTTP, databases). DNS maps domain names to IPs. HTTPS adds TLS encryption. Security groups act as firewalls in the cloud.",
    whyItExists:
      "Your browser calls your API, your API calls OpenAI, agents call tools — all over the network. You need this to debug timeouts and secure services.",
    analogy:
      "IP = street address, port = apartment number, DNS = phone book, firewall = security guard.",
    analogyDiagram: `flowchart LR
    A[Street Address] --> B[Building]
    B --> C[Apartment Number]
    C --> D[Security Guard]`,
    diagram: `flowchart TD
    NET([Networking])

    subgraph Address["Addressing"]
        AD1[IP Address - device location]
        AD2[Port - service door number]
        AD3[DNS - domain name to IP]
    end

    subgraph Protocols["Protocols"]
        PR1[TCP - reliable ordered delivery]
        PR2[UDP - fast may drop packets]
        PR3[HTTP / HTTPS - web traffic]
    end

    subgraph Ports["Common Ports"]
        PO1[80 - HTTP]
        PO2[443 - HTTPS]
        PO3[5432 - PostgreSQL]
        PO4[8000 - FastAPI]
    end

    subgraph Security["Security"]
        SE1[TLS - encrypts HTTPS traffic]
        SE2[Firewall / Security Groups]
        SE3[Public vs Private Subnets]
        SE4[Load Balancer]
    end

    NET --> Address
    NET --> Protocols
    NET --> Ports
    NET --> Security
    Browser[Client] --> DNS[DNS lookup] --> IP[IP + Port] --> Server[AI Server]`,
    example:
      "Your agent can't connect to the vector database — connection times out every time.",
    exampleSolution:
      "The DB is in a private subnet. Add a security group rule allowing port 5432 from the API subnet only.",
    practiceTask:
      "Run ping google.com and nslookup google.com. Then run curl -v https://api.openai.com/v1/models (you will get 401 — that is expected; study the status code and headers in the output).",
    commandsToRemember: [
      "ping hostname  # test if a host is reachable",
      "nslookup hostname  # resolve domain name to IP address",
      "curl -v https://url  # test an HTTP endpoint with full details",
      "nc -zv host port  # check if a specific port is open",
      "traceroute hostname  # trace the network path hop by hop",
    ],
    interviewQuestions: [],
    revisionNotes: {
      fiveMin: [],
      fifteenMin: [],
      oneHour: [],
      cheatSheet: [
        "IP + port identifies every service on the network",
        "DNS translates domain names to IP addresses",
        "TCP = reliable · UDP = fast but may drop packets",
        "HTTPS = HTTP encrypted with TLS",
        "Common ports: 80 HTTP, 443 HTTPS, 5432 Postgres",
        "Security groups / firewalls control allowed traffic",
      ],
    },
    glossary: ["HTTP", "REST APIs", "Docker"],
    commonMistakes: [
      "Exposing database ports to the internet",
      "No timeouts on outbound HTTP calls",
      "Ignoring latency when choosing cloud regions",
    ],
  }),

  http: createLesson({
    concept:
      "HTTP is the request-response protocol behind every web API — including every LLM provider you'll ever integrate with.",
    technicalExplanation:
      "A client sends a method (GET/POST), URL, headers, and optional body. The server returns a status code and response body. LLM APIs use POST with JSON.",
    whyItExists:
      "Every AI service speaks HTTP. You need to understand methods, headers, status codes, and bodies to build and debug integrations.",
    analogy:
      "HTTP is ordering at a restaurant — you place an order (request), the kitchen works on it, and brings food or an error back (response).",
    analogyDiagram: `flowchart LR
    A[You order] --> B[Kitchen cooks]
    B --> C[Food delivered]`,
    diagram: `flowchart TD
    HTTP([HTTP Protocol])

    subgraph Methods["HTTP Methods"]
        M1[GET - Read data]
        M2[POST - Create or run action]
        M3[PUT - Replace entire resource]
        M4[PATCH - Partial update]
        M5[DELETE - Remove resource]
    end

    subgraph Request["Every Request Has"]
        R1[URL - endpoint address]
        R2[Headers - metadata and auth]
        R3[Body - JSON payload optional]
    end

    subgraph KeyHeaders["Key Headers"]
        H1[Authorization: Bearer token]
        H2[Content-Type: application/json]
    end

    subgraph Status["Status Codes"]
        S1[2xx Success - 200 OK]
        S2[4xx Client Error - 401 Unauthorized]
        S3[4xx Client Error - 429 Rate Limited]
        S4[5xx Server Error - 500 Internal Error]
    end

    subgraph Concepts["Key Concepts"]
        C1[Stateless - each request is independent]
        C2[HTTPS - HTTP + TLS encryption]
        C3[LLM APIs use POST + JSON body]
        C4[Streaming - chunked token delivery]
        C5[Always set request timeouts]
    end

    HTTP --> Methods
    HTTP --> Request
    Request --> KeyHeaders
    HTTP --> Status
    HTTP --> Concepts
    Client[Client] --> Request
    Request --> Server[Server]
    Server --> Status
    Status --> Response[Response Body - JSON]`,
    example:
      "Your chat app returns 401 Unauthorized when a user sends a message.",
    exampleSolution:
      "The Authorization header with the Bearer token was missing. Adding it returns 200 with the LLM response.",
    practiceTask:
      "Send a GET request with curl -v https://httpbin.org/get. Then send a POST with curl -X POST -H \"Content-Type: application/json\" -d '{\"name\":\"test\"}' https://httpbin.org/post. Write down the status code and response body for each.",
    commandsToRemember: [
      "curl -X GET https://api.example.com/data  # send a GET request to read data",
      "curl -X POST -H \"Content-Type: application/json\" -d '{\"key\":\"val\"}' URL  # send POST with JSON body",
      "curl -v URL  # verbose mode — see headers, status code, and response",
    ],
    interviewQuestions: [],
    revisionNotes: {
      fiveMin: [],
      fifteenMin: [],
      oneHour: [],
      cheatSheet: [
        "Methods: GET read · POST action · PUT replace · PATCH update · DELETE remove",
        "Every request has: URL, Headers, Body (optional)",
        "Key headers: Authorization Bearer token, Content-Type application/json",
        "Status codes: 200 OK · 401 Unauthorized · 429 Rate Limited · 500 Server Error",
        "Stateless — each request is independent",
        "LLM APIs use POST + JSON · always set timeouts",
        "HTTPS = HTTP + TLS encryption",
      ],
    },
    glossary: ["REST APIs", "JSON", "CLI"],
    commonMistakes: [
      "No timeout on HTTP calls",
      "API keys in URL instead of headers",
      "Ignoring 429 rate limits",
    ],
  }),

  "rest-apis": createLesson({
    concept:
      "REST is a design pattern for web APIs — resources at URLs, standard HTTP methods, and JSON payloads.",
    technicalExplanation:
      "Resources are nouns (/documents, /chats). Methods are verbs (GET read, POST create). Each request is stateless with auth in headers. This builds directly on the HTTP module — same methods, headers, status codes, and JSON bodies.",
    whyItExists:
      "REST is predictable and universal. Every LLM provider, vector DB, and backend you build follows these conventions.",
    analogy:
      "REST is a library catalog — each book has a unique ID, and everyone uses the same rules to browse, add, or remove.",
    analogyDiagram: `flowchart LR
    A[Browse shelf] --> B[Pick book by ID]
    B --> C[Return or add book]`,
    diagram: `flowchart TD
    REST([REST API])

    subgraph Design["Design Rules"]
        D1[Resources = nouns in URLs]
        D2["/documents /chats /users"]
        D3[Stateless - no server sessions]
        D4[Version with /v1/ in URL]
    end

    subgraph CRUD["HTTP Methods = CRUD"]
        C1[GET - Read resource]
        C2[POST - Create resource or action]
        C3[PUT - Replace resource]
        C4[PATCH - Partial update]
        C5[DELETE - Remove resource]
    end

    subgraph Data["Request and Response"]
        DA1[JSON request body]
        DA2[JSON response body]
        DA3[Proper status codes - 200 404 400]
        DA4[Auth in every request header]
    end

    subgraph Tools["Tools"]
        T1[FastAPI - build APIs in Python]
        T2[Pydantic - validate input/output]
        T3[OpenAPI docs at /docs]
    end

    REST --> Design
    REST --> CRUD
    REST --> Data
    REST --> Tools
    Client[Client App] --> API[API Server] --> DB[(Database / LLM)]`,
    example:
      "You need an API where users upload documents and ask questions about them.",
    exampleSolution:
      "POST /documents uploads a file, GET /documents/{id} returns metadata, POST /chat returns an answer with source citations.",
    practiceTask:
      "On paper or in a note, design 4 REST endpoints for a simple notes app: list notes, get one note, create a note, delete a note. For each, write the HTTP method, URL path, and what JSON it sends or returns.",
    commandsToRemember: [
      "curl http://localhost:8000/docs  # open auto-generated API documentation",
      "curl http://localhost:8000/documents/1  # GET a resource by ID",
      "curl -X POST -H \"Content-Type: application/json\" -d '{...}' URL  # POST JSON to an endpoint",
    ],
    interviewQuestions: [],
    revisionNotes: {
      fiveMin: [],
      fifteenMin: [],
      oneHour: [],
      cheatSheet: [
        "Resources = nouns in URLs (/documents, /chats)",
        "HTTP methods map to CRUD: GET read · POST create · PUT/PATCH update · DELETE remove",
        "Stateless — auth token in every request header",
        "JSON request and response bodies with proper status codes",
        "Version APIs with /v1/ in the URL path",
        "Build with FastAPI + Pydantic · docs at /docs",
      ],
    },
    glossary: ["HTTP", "JSON", "CLI"],
    commonMistakes: [
      "Using GET to modify data",
      "Verbs in URLs like /getUser",
      "Returning 200 with errors in body",
    ],
  }),

  json: createLesson({
    concept:
      "JSON is the universal data format for AI — every LLM request, response, tool schema, and config file uses it.",
    technicalExplanation:
      "Objects {key: value}, arrays, strings, numbers, booleans, null. Keys need double quotes. Python uses json.dumps and json.loads.",
    whyItExists:
      "AI systems constantly exchange structured data. JSON is readable, lightweight, and works in every programming language.",
    analogy:
      "JSON is a standardized form every department fills out the same way — whether you're in Python, JavaScript, or Go.",
    analogyDiagram: `flowchart LR
    A[Python team] --> F[JSON form]
    B[JS team] --> F
    C[Go team] --> F
    F --> D[Same data everywhere]`,
    diagram: `flowchart TD
    JSON([JSON])

    subgraph Types["Data Types"]
        T1[Object - key: value pairs]
        T2[Array - list of values]
        T3[String - double quotes only]
        T4[Number / Boolean / null]
    end

    subgraph Rules["Rules"]
        R1[Double quotes for all keys]
        R2[No trailing commas]
        R3[No single quotes]
    end

    subgraph AIUses["Used in AI For"]
        A1[LLM request and response bodies]
        A2[Chat messages array]
        A3[Tool / function schemas]
        A4[Config files]
    end

    subgraph Python["Python Tools"]
        P1[json.dumps - object to string]
        P2[json.loads - string to object]
        P3[Pydantic - validate structure]
        P4[JSON Schema for tool definitions]
    end

    JSON --> Types
    JSON --> Rules
    JSON --> AIUses
    JSON --> Python
    Dict[Python Dict] --> Dumps[json.dumps] --> String[JSON String] --> API[HTTP / LLM API]`,
    example:
      "You need the LLM to call a weather function with a city name.",
    exampleSolution:
      "Define the tool schema in JSON, send it with the chat request, and the LLM returns JSON with the function name and arguments.",
    practiceTask:
      "Run: python -c \"import json; d={'role':'user','content':'hi'}; print(json.dumps(d))\" then parse it back with json.loads. Confirm the output uses double quotes on keys.",
    commandsToRemember: [
      "python -c \"import json; print(json.dumps({'a':1}))\"  # convert Python dict to JSON string",
      "python -c \"import json; print(json.loads('{\\\"a\\\":1}'))\"  # parse JSON string to Python dict",
    ],
    interviewQuestions: [],
    revisionNotes: {
      fiveMin: [],
      fifteenMin: [],
      oneHour: [],
      cheatSheet: [
        "Universal format for all AI APIs — objects, arrays, strings, numbers",
        "Keys must use double quotes — no trailing commas or single quotes",
        "Used for LLM requests, chat messages, tool schemas, and configs",
        "Python: json.dumps (object → string) · json.loads (string → object)",
        "Validate structure with Pydantic or JSON Schema",
        "LLMs may wrap JSON in markdown fences — strip before parsing",
      ],
    },
    glossary: ["HTTP", "REST APIs", "Structured Outputs"],
    commonMistakes: [
      "Not validating JSON from LLM outputs",
      "Single quotes in JSON (invalid)",
      "Forgetting to strip markdown fences",
    ],
  }),

  cli: createLesson({
    concept:
      "The CLI lets you control your computer through text commands — essential for servers, deployment, and AI agent tools.",
    technicalExplanation:
      "Format: command [options] [arguments]. Pipes (|) chain commands. Exit code 0 = success. Build Python CLIs with typer or click.",
    whyItExists:
      "Servers have no GUI. Git, Docker, kubectl, and cloud tools are all CLI-first. Agents execute shell commands as tools.",
    analogy:
      "CLI is texting your computer precise instructions — faster than clicking, works over remote connections.",
    analogyDiagram: `flowchart LR
    A[Type command] --> B[Computer runs it]
    B --> C[Text output]`,
    diagram: `flowchart TD
    CLI([Command Line Interface])

    subgraph Structure["Command Structure"]
        S1[command - what to run]
        S2[flags --verbose - options]
        S3[arguments - inputs]
    end

    subgraph Chaining["Chaining and Scripts"]
        C1[Pipe - cmd1 | cmd2]
        C2[Redirect - output to file]
        C3[Bash .sh scripts]
        C4[chmod +x to make executable]
    end

    subgraph Output["Output"]
        O1[stdout - normal output]
        O2[stderr - error output]
        O3[Exit code 0 = success]
        O4[Exit code non-zero = failure]
    end

    subgraph PythonCLI["Build CLIs in Python"]
        P1[typer]
        P2[click]
        P3[argparse]
    end

    subgraph Agents["AI Agent Use"]
        A1[Agents execute shell commands as tools]
        A2[Always validate inputs - prevent injection]
        A3[Check exit codes not just stdout]
    end

    CLI --> Structure
    CLI --> Chaining
    CLI --> Output
    CLI --> PythonCLI
    CLI --> Agents`,
    example:
      "You need a command to ingest new documents into your RAG knowledge base.",
    exampleSolution:
      "Build `rag-cli ingest ./docs` — it chunks PDFs, embeds them, and stores in the vector DB. Your agent calls this same CLI as a tool.",
    practiceTask:
      "Run echo \"hello world\" | wc -w to pipe output between commands. Then run ls | head -3 to list only the first 3 files. Check the exit code with echo $?.",
    commandsToRemember: [
      "command --help  # show available options for a command",
      "cmd1 | cmd2  # pipe output of cmd1 into cmd2",
      "echo $?  # print exit code of the last command",
      "chmod +x script.sh  # make a script file executable",
      "./script.sh  # run the script",
    ],
    interviewQuestions: [],
    revisionNotes: {
      fiveMin: [],
      fifteenMin: [],
      oneHour: [],
      cheatSheet: [
        "Format: command [flags] [arguments]",
        "Pipe (|) chains commands — output of one feeds the next",
        "Exit code 0 = success · non-zero = failure",
        "Build Python CLIs with typer, click, or argparse",
        "Agents can run shell commands as tools — validate inputs against injection",
        "Servers have no GUI — git, docker, kubectl are all CLI-first",
      ],
    },
    glossary: ["Linux", "Git", "Docker"],
    commonMistakes: [
      "Not validating input before shell commands",
      "Ignoring exit codes",
      "No --help on custom tools",
    ],
  }),

  docker: createLesson({
    concept:
      "Docker packages your app and dependencies into a portable container — runs identically on your laptop and in production.",
    technicalExplanation:
      "Images are blueprints, containers are running instances. Dockerfile defines the build. Docker Compose runs multiple services together.",
    whyItExists:
      "AI apps have complex dependencies. Docker solves 'it works on my machine' with reproducible environments.",
    analogy:
      "A shipping container — loads and unloads the same way everywhere, no matter what's inside.",
    analogyDiagram: `flowchart LR
    A[Pack goods] --> B[Container]
    B --> C[Ship anywhere]
    C --> D[Unload same way]`,
    diagram: `flowchart TD
    DOCK([Docker])

    subgraph Concepts["Core Concepts"]
        C1[Dockerfile - build instructions]
        C2[Image - packaged blueprint]
        C3[Container - running instance]
    end

    subgraph Commands["Key Commands"]
        CMD1[docker build -t name .]
        CMD2[docker run -p 8000:8000 name]
        CMD3[docker-compose up -d]
        CMD4[docker logs / docker exec]
        CMD5[docker ps - list containers]
    end

    subgraph Multi["Multi-Service"]
        M1[docker-compose.yml]
        M2[API container + DB container]
        M3[Container networking]
        M4[Volume mounts - persist data]
    end

    subgraph Best["Best Practices"]
        B1[.dockerignore - smaller images]
        B2[--env-file for secrets at runtime]
        B3[Never put API keys in Dockerfile]
        B4[Pin base image versions]
    end

    DOCK --> Concepts
    Concepts --> C1 --> C2 --> C3
    DOCK --> Commands
    DOCK --> Multi
    DOCK --> Best`,
    example:
      "Your FastAPI app works locally but crashes on the production server due to missing dependencies.",
    exampleSolution:
      "Dockerize it — Dockerfile installs exact deps, docker-compose runs API + ChromaDB together. Same result everywhere.",
    practiceTask:
      "Run docker run hello-world. Then run docker ps -a to see the container. If Docker is not installed, read the Docker diagram and write down the 4 key commands you will use later.",
    commandsToRemember: [
      "docker build -t name .  # build an image from Dockerfile",
      "docker run -p 8000:8000 name  # run container and map port 8000",
      "docker run --env-file .env name  # pass secrets via env file at runtime",
      "docker-compose up -d  # start all services in the background",
      "docker logs container_id  # view logs from a container",
      "docker ps  # list currently running containers",
    ],
    interviewQuestions: [],
    revisionNotes: {
      fiveMin: [],
      fifteenMin: [],
      oneHour: [],
      cheatSheet: [
        "Image = blueprint · Container = running instance",
        "Dockerfile defines build steps · docker build creates image",
        "docker run starts a container · docker-compose runs multiple services",
        "Pass secrets via --env-file at runtime — never in Dockerfile",
        "Use .dockerignore to keep images small",
        "docker logs and docker exec for debugging",
      ],
    },
    glossary: ["CLI", "CI/CD", "REST APIs"],
    commonMistakes: [
      "API keys in Dockerfile",
      "No .dockerignore — huge images",
      "Running as root in production",
    ],
  }),

  sql: createLesson({
    concept:
      "SQL is the language for relational databases — store users, chat history, and app metadata in structured tables.",
    technicalExplanation:
      "Tables have rows and columns. SELECT reads, INSERT creates, UPDATE modifies, DELETE removes. PostgreSQL is the go-to for AI apps.",
    whyItExists:
      "AI apps need persistent storage for users, conversations, and metadata. SQL databases provide reliable, queryable storage.",
    analogy:
      "SQL is Excel for databases — rows and columns, but queries scale to millions of records instantly.",
    analogyDiagram: `flowchart LR
    A[Spreadsheet rows] --> B[Millions of rows]
    B --> C[Instant queries]`,
    diagram: `flowchart TD
    SQL([SQL])

    subgraph Ops["SQL Operations"]
        O1[SELECT - read rows]
        O2[INSERT - add rows]
        O3[UPDATE - modify rows]
        O4[DELETE - remove rows]
    end

    subgraph Structure["Database Structure"]
        S1[Tables - rows and columns]
        S2[Schema - column definitions]
        S3[JOIN - combine related tables]
        S4[Indexes - speed up queries]
    end

    subgraph AIUses["AI App Storage"]
        A1[User accounts]
        A2[Chat history and messages]
        A3[Document metadata]
        A4[Audit logs and billing]
    end

    subgraph Tools["Tools"]
        T1[PostgreSQL - default for AI apps]
        T2[SQLAlchemy - Python ORM]
        T3[Alembic - schema migrations]
        T4[pgvector - embeddings in Postgres]
    end

    SQL --> Ops
    SQL --> Structure
    SQL --> AIUses
    SQL --> Tools
    App[FastAPI App] --> Query[SQL Query] --> DB[(PostgreSQL)]`,
    example:
      "Your chat app needs to remember the last 10 messages for context window management.",
    exampleSolution:
      "Store messages in a PostgreSQL table with chat_id, role, and content. Query: SELECT * FROM messages WHERE chat_id = 1 ORDER BY id DESC LIMIT 10.",
    practiceTask:
      "Open sqlite3 (or any SQL client) and run: CREATE TABLE notes (id INTEGER, text TEXT); INSERT INTO notes VALUES (1, 'hello'); SELECT * FROM notes; UPDATE notes SET text='world' WHERE id=1; DELETE FROM notes WHERE id=1;",
    commandsToRemember: [
      "SELECT * FROM table WHERE condition;  # read rows matching a condition",
      "INSERT INTO table (col) VALUES ('val');  # add a new row",
      "UPDATE table SET col = 'val' WHERE id = 1;  # modify an existing row",
      "DELETE FROM table WHERE id = 1;  # remove a row",
      "psql -U user -d dbname  # connect to a PostgreSQL database",
    ],
    interviewQuestions: [],
    revisionNotes: {
      fiveMin: [],
      fifteenMin: [],
      oneHour: [],
      cheatSheet: [
        "SELECT read · INSERT create · UPDATE modify · DELETE remove",
        "Data stored in tables — rows and columns with defined schema",
        "PostgreSQL is the default for AI apps",
        "JOIN combines related tables · indexes speed up queries",
        "SQLAlchemy maps Python to tables · Alembic handles migrations",
        "pgvector adds embedding search inside Postgres",
      ],
    },
    glossary: ["NoSQL", "REST APIs", "Docker"],
    commonMistakes: [
      "No database migrations — schema drift",
      "SQL injection from raw string queries",
      "Not indexing frequently queried columns",
    ],
  }),

  nosql: createLesson({
    concept:
      "NoSQL databases handle flexible, non-tabular data — caches, documents, and vector stores power AI architectures.",
    technicalExplanation:
      "Redis for fast caching, MongoDB for flexible documents, vector DBs (Pinecone, ChromaDB) for embedding search. Pick the right store per data type.",
    whyItExists:
      "AI apps handle diverse data — JSON docs, session caches, and high-dimensional embeddings. NoSQL optimizes for these patterns.",
    analogy:
      "SQL is a strict filing cabinet. NoSQL is a warehouse with different zones — documents, caches, and vector racks.",
    analogyDiagram: `flowchart LR
    A[Filing cabinet] --> B[Strict folders]
    C[Warehouse] --> D[Flexible zones]`,
    diagram: `flowchart TD
    NS([NoSQL])

    subgraph Types["Database Types"]
        T1[Document Store - MongoDB flexible JSON]
        T2[Key-Value - Redis fast cache]
        T3[Vector DB - embedding similarity search]
    end

    subgraph Redis["Redis Uses"]
        R1[Cache LLM responses]
        R2[TTL - auto-expire stale data]
        R3[Session storage]
        R4[Cache key = hash of prompt]
    end

    subgraph Vector["Vector Databases"]
        V1[Pinecone]
        V2[ChromaDB]
        V3[Weaviate]
        V4[RAG retrieval and similarity search]
    end

    subgraph When["When to Use"]
        W1[SQL - structured relational data]
        W2[Redis - speed and caching]
        W3[MongoDB - flexible documents]
        W4[Vector DB - semantic search on embeddings]
    end

    NS --> Types
    NS --> Redis
    NS --> Vector
    NS --> When
    App[AI Application] --> RedisDB[(Redis)]
    App --> Mongo[(MongoDB)]
    App --> VectorDB[(Vector DB)]`,
    example:
      "Users keep asking the same questions and you're paying for duplicate LLM API calls.",
    exampleSolution:
      "Cache responses in Redis with a 1-hour TTL. Cache hit = instant answer, no API cost. Miss = call LLM and store result.",
    practiceTask:
      "If Redis is installed: run redis-cli SET greeting \"hello\" then redis-cli GET greeting. If not, write down which database you would use for: user accounts, LLM response cache, and embedding search.",
    commandsToRemember: [
      "redis-cli  # open the Redis command-line interface",
      "redis-cli GET key  # read a cached value by key",
      "redis-cli SET key value EX 3600  # store a value with 1-hour expiry",
      "mongosh  # open the MongoDB shell",
    ],
    interviewQuestions: [],
    revisionNotes: {
      fiveMin: [],
      fifteenMin: [],
      oneHour: [],
      cheatSheet: [
        "Redis — fast key-value cache with TTL for LLM responses",
        "MongoDB — flexible JSON document storage",
        "Vector DBs (Pinecone, ChromaDB) — embedding similarity search",
        "SQL for structured data · NoSQL for flexible / cached / vector data",
        "Cache key = hash of input · TTL prevents stale answers",
        "Pick the right database per data type — don't use one for everything",
      ],
    },
    glossary: ["SQL", "Vector Databases", "Embeddings"],
    commonMistakes: [
      "One database for everything",
      "No cache invalidation — stale answers",
      "Ignoring Redis memory limits",
    ],
  }),

  testing: createLesson({
    concept:
      "Testing catches bugs before users do — unit tests for logic, integration tests for APIs, evals for LLM quality.",
    technicalExplanation:
      "Unit tests are fast and mock the LLM. Integration tests check API endpoints. Evals measure output quality on golden datasets. Never call real LLM APIs in CI unit tests.",
    whyItExists:
      "AI apps are complex and non-deterministic. Without tests, every deploy is a gamble.",
    analogy:
      "Testing is a safety net — unit tests catch code bugs, evals catch quality drops.",
    analogyDiagram: `flowchart LR
    A[Trapeze artist] --> B[Safety net]
    B --> C[Catches falls]`,
    diagram: `flowchart TD
    TEST([Testing])

    subgraph Pyramid["Testing Pyramid"]
        P1[Unit Tests - fast isolated logic]
        P2[Integration Tests - API + test DB]
        P3[Evals - LLM output quality]
    end

    subgraph Unit["Unit Tests"]
        U1[Mock LLM responses]
        U2[Test chunking and retrieval logic]
        U3[Never call real LLM APIs in CI]
    end

    subgraph Integration["Integration Tests"]
        I1[Test API endpoints]
        I2[Mock external services]
        I3[Check status codes and response shape]
    end

    subgraph Evals["Evals"]
        E1[Golden Q&A datasets]
        E2[Measure accuracy and relevance]
        E3[Run on schedule not every PR]
    end

    subgraph Tools["Tools"]
        TO1[pytest]
        TO2[unittest.mock.patch]
        TO3[Fixtures and parametrize]
        TO4[Coverage reports]
    end

    TEST --> Pyramid
    TEST --> Unit
    TEST --> Integration
    TEST --> Evals
    TEST --> Tools
    Change[Code Change] --> Unit --> Integration --> CI[CI Pipeline] --> Deploy[Deploy]`,
    example:
      "You changed the chunking logic and need to verify nothing broke before deploying.",
    exampleSolution:
      "Run unit tests on chunking (deterministic), integration test on POST /chat (mocked LLM), and check eval scores against golden Q&A pairs.",
    practiceTask:
      "Create test_math.py with a function add(a, b) and a pytest test_add() that asserts add(2, 3) == 5. Run pytest -v. Then add a test that mocks an API call using unittest.mock.patch.",
    commandsToRemember: [
      "pytest  # run all tests in the project",
      "pytest tests/test_file.py -v  # run one test file with verbose output",
      "pytest -k \"test_name\"  # run only tests matching a name",
      "pytest --cov=src  # run tests and show code coverage",
    ],
    interviewQuestions: [],
    revisionNotes: {
      fiveMin: [],
      fifteenMin: [],
      oneHour: [],
      cheatSheet: [
        "Unit tests — fast, isolated, mock the LLM",
        "Integration tests — API endpoints with test database",
        "Evals — measure LLM output quality on golden datasets",
        "Never call real LLM APIs in CI unit tests",
        "Test retrieval and chunking logic separately from generation",
        "pytest + unittest.mock.patch for mocking",
      ],
    },
    glossary: ["CI/CD", "Evaluation", "Python"],
    commonMistakes: [
      "Real LLM APIs in unit tests",
      "Testing LLM output verbatim",
      "No tests for retrieval/chunking logic",
    ],
  }),

  "ci-cd": createLesson({
    concept:
      "CI/CD automates testing, building, and deploying your app — every code change is validated before reaching production.",
    technicalExplanation:
      "CI runs tests on every push/PR. CD deploys on merge to main. GitHub Actions is the most common tool. Secrets go in GitHub Secrets, never in workflow files.",
    whyItExists:
      "AI projects change frequently. Manual deployment is error-prone. CI/CD ships with confidence.",
    analogy:
      "An assembly line checkpoint — every product is inspected and packaged automatically. Defects never reach customers.",
    analogyDiagram: `flowchart LR
    A[Product on line] --> B[Quality check]
    B -->|pass| C[Ship to customer]
    B -->|fail| D[Rejected]`,
    diagram: `flowchart TD
    CICD([CI/CD])

    subgraph CI["Continuous Integration - on every push/PR"]
        CI1[Lint code]
        CI2[Run unit tests - mocked LLM]
        CI3[Run integration tests]
        CI4[Build Docker image]
    end

    subgraph CD["Continuous Deployment - on merge to main"]
        CD1[Push image to registry]
        CD2[Deploy to staging]
        CD3[Run smoke tests]
        CD4[Deploy to production]
    end

    subgraph Triggers["Triggers"]
        TR1[git push]
        TR2[Pull request opened]
        TR3[workflow_dispatch - manual run]
    end

    subgraph Secrets["Secrets Management"]
        SE1[GitHub Secrets - never in YAML]
        SE2[Inject as env vars at runtime]
        SE3[Rotate API keys regularly]
    end

    subgraph Evals["AI-Specific"]
        EV1[Run LLM evals on schedule only]
        EV2[Not on every PR - too slow and costly]
    end

    CICD --> Triggers
    Triggers --> CI
    CI --> CD
    CICD --> Secrets
    CICD --> Evals`,
    example:
      "You push a new RAG retriever to a feature branch and want it tested before production.",
    exampleSolution:
      "GitHub Actions runs pytest on the PR, builds the Docker image on merge to main, deploys to staging, runs a smoke test, then promotes to production.",
    practiceTask:
      "Create .github/workflows/ci.yml that runs on push and executes pytest (or echo \"CI would run here\" if you have no tests yet). Push to GitHub and check the Actions tab for the run result.",
    commandsToRemember: [
      "git push  # trigger the CI pipeline on remote",
      "gh workflow run deploy.yml  # manually trigger a GitHub Actions workflow",
      "gh run list  # view recent CI/CD runs",
      "gh run view <id> --log  # see full logs for a specific run",
    ],
    interviewQuestions: [],
    revisionNotes: {
      fiveMin: [],
      fifteenMin: [],
      oneHour: [],
      cheatSheet: [
        "CI runs on every push/PR — lint, test, build Docker image",
        "CD deploys on merge to main — staging then production",
        "GitHub Actions is the most common CI/CD tool",
        "Never put API keys in workflow YAML — use GitHub Secrets",
        "Run expensive LLM evals on schedule, not every PR",
        "Pipeline: test → build → deploy · smoke test before production",
      ],
    },
    glossary: ["Git", "Docker", "Testing"],
    commonMistakes: [
      "Secrets in workflow YAML",
      "Expensive LLM evals on every PR",
      "No staging environment",
    ],
  }),
};
