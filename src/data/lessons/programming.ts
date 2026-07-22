import type { LessonContent } from "../lesson-types";

export const programmingLessons: Record<string, LessonContent> = {
  python: {
    concept:
      "Python is the primary programming language for AI Engineering — used for building LLM applications, RAG pipelines, agents, data processing, and API backends.",
    whyItExists:
      "AI's ecosystem (PyTorch, LangChain, Hugging Face, FastAPI) is Python-first. As an AI engineer, you'll write Python daily — calling APIs, processing documents, building agents, and deploying services.",
    analogy:
      "Python is the English of AI engineering — not the only language, but the one everyone speaks. Learning it unlocks every tool, library, and tutorial in the field.",
    technicalExplanation:
      "Python is a high-level, interpreted language known for readable syntax and a massive ecosystem. For AI engineering specifically, you'll use: list/dict comprehensions for data transforms, async/await for concurrent API calls, type hints for maintainability, virtual environments (venv) for dependency isolation, and packages like openai, langchain, fastapi, pandas, and pydantic.",
    architecture:
      "Typical AI Python project structure: src/ (application code), tests/, requirements.txt or pyproject.toml, .env for secrets, Dockerfile for deployment. Use FastAPI for APIs, Pydantic for data validation, and pytest for testing.",
    example:
      "You're building a PDF chat app. Python loads the PDF with pypdf, chunks text, calls OpenAI embeddings API, stores vectors in ChromaDB, and serves a FastAPI endpoint that retrieves context and calls GPT-4.",
    code: `# Core Python patterns for AI Engineering

# 1. Environment setup
# python -m venv .venv && source .venv/bin/activate
# pip install openai fastapi uvicorn python-dotenv

import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 2. Calling an LLM
def ask_llm(prompt: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )
    return response.choices[0].message.content or ""

# 3. Processing a list of documents
documents = ["doc1 text", "doc2 text", "doc3 text"]
summaries = [ask_llm(f"Summarize: {doc}") for doc in documents]

# 4. Type hints + Pydantic for structured data
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    user_id: str

class ChatResponse(BaseModel):
    reply: str
    tokens_used: int

print(summaries)`,
    project:
      "Build a CLI tool that takes a text file, sends it to an LLM for summarization, and saves the result. Use argparse, python-dotenv, and the OpenAI SDK.",
    interviewQuestions: [
      {
        question: "Why is Python dominant in AI engineering?",
        answer: "Ecosystem maturity (PyTorch, LangChain, Hugging Face), readability, rapid prototyping, strong async support for API-heavy apps, and industry adoption by every major AI company.",
        difficulty: "easy",
      },
      {
        question: "How do you manage Python dependencies in AI projects?",
        answer: "Use virtual environments (venv/conda), pin versions in requirements.txt or pyproject.toml, use Docker for reproducible deployments, and never commit .env files with API keys.",
        difficulty: "medium",
      },
      {
        question: "sync vs async in Python AI apps?",
        answer: "Sync is simpler for scripts. Async (asyncio + httpx/aiohttp) is essential when making many concurrent API calls — agents calling multiple tools, batch embedding, parallel retrieval.",
        difficulty: "medium",
      },
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
  },

  git: {
    concept:
      "Git is a version control system that tracks code changes, enables collaboration, and is essential for every software and AI engineering workflow.",
    whyItExists:
      "AI projects iterate fast — prompt changes, model swaps, pipeline tweaks. Git lets you track every change, collaborate with teams, roll back mistakes, and maintain separate branches for experiments vs production.",
    analogy:
      "Git is like Google Docs version history for code — you can see who changed what, when, and revert to any previous version. Branches let you experiment without breaking the main project.",
    technicalExplanation:
      "Git stores snapshots of your project in a repository. Key concepts: commits (saved snapshots), branches (parallel development lines), merges (combining branches), remotes (GitHub/GitLab hosting), and pull requests (code review workflow). For AI projects, version-control your prompts, configs, and evaluation datasets alongside code.",
    example:
      "You're experimenting with 3 different RAG chunking strategies. Create branch `experiment/chunking-v2`, test it, compare eval scores, then merge the winner into `main` via pull request.",
    code: `# Essential Git workflow for AI projects

# Initialize and first commit
git init
git add .
git commit -m "feat: initial RAG pipeline setup"

# Create feature branch for experiment
git checkout -b experiment/hybrid-search

# Work, commit frequently with clear messages
git add src/retriever.py
git commit -m "feat: add BM25 + vector hybrid search"

# Push and create pull request
git push -u origin experiment/hybrid-search

# After review, merge to main
git checkout main
git merge experiment/hybrid-search

# Good commit message format
# feat: add new feature
# fix: bug fix
# docs: documentation
# refactor: code restructure
# eval: evaluation results update`,
    project:
      "Set up a GitHub repo for your AI project. Practice: branching, committing prompt changes, opening a PR, and writing a meaningful README.",
    interviewQuestions: [
      {
        question: "Explain git branching strategy for AI teams.",
        answer: "main (production), develop (integration), feature/* (experiments). Tag releases. Never commit API keys — use .gitignore for .env files.",
        difficulty: "medium",
      },
      {
        question: "What should you version-control in an AI project?",
        answer: "Code, prompts (as files), configs, evaluation datasets, Dockerfile, requirements.txt. NOT: model weights (use model registry), large datasets (use DVC), secrets.",
        difficulty: "medium",
      },
    ],
    revisionNotes: {
      fiveMin: ["git add → git commit → git push", "Branches for experiments", "Never commit .env or API keys", ".gitignore is essential"],
      fifteenMin: ["Commit messages: feat/fix/docs format", "Pull requests for code review", "git stash for temporary saves", "git log and git diff for history", "Merge vs rebase basics"],
      oneHour: ["Full branching workflow practice", "Resolve a merge conflict", "GitHub PR with review", "Version-control prompt files", "Set up .gitignore for AI projects"],
      cheatSheet: ["git status — see changes", "git checkout -b name — new branch", "git pull — get remote changes", "git merge branch — combine branches", ".gitignore — exclude .env, __pycache__"],
    },
    glossary: ["CLI", "CI/CD"],
    commonMistakes: ["Committing API keys or .env files", "Giant commits with unrelated changes", "Not pulling before pushing (merge conflicts)", "Working directly on main branch"],
  },

  docker: {
    concept:
      "Docker packages your application and all its dependencies into a portable container — ensuring it runs identically on your laptop, staging, and production.",
    whyItExists:
      "AI apps have complex dependencies (Python packages, system libraries, model files). 'It works on my machine' is a real problem. Docker solves this by creating reproducible, isolated environments for development and deployment.",
    analogy:
      "A shipping container — regardless of what's inside or which ship carries it, the container standard means it loads and unloads the same way everywhere.",
    technicalExplanation:
      "Docker uses images (blueprints) and containers (running instances). A Dockerfile defines how to build the image: base image (python:3.12-slim), install dependencies, copy code, set entrypoint. Docker Compose orchestrates multiple containers (app + database + vector DB).",
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

# Build and run
# docker build -t my-rag-app .
# docker run -p 8000:8000 --env-file .env my-rag-app

# docker-compose.yml
# services:
#   api:
#     build: .
#     ports: ["8000:8000"]
#     env_file: .env
#   chroma:
#     image: chromadb/chroma
#     ports: ["8001:8000"]`,
    project: "Dockerize your PDF chat application. Create a Dockerfile and docker-compose.yml with your API and ChromaDB.",
    interviewQuestions: [
      {
        question: "Why use Docker for AI applications?",
        answer: "Reproducible environments, easy deployment, isolation between services, consistent dev/staging/prod, and simplified CI/CD pipelines.",
        difficulty: "easy",
      },
      {
        question: "Docker vs virtual machines?",
        answer: "Containers share the host OS kernel — lighter, faster startup. VMs include full OS — heavier but stronger isolation. Containers are standard for AI app deployment.",
        difficulty: "medium",
      },
    ],
    revisionNotes: {
      fiveMin: ["Image = blueprint, Container = running instance", "Dockerfile defines how to build", "docker build + docker run", "Never put secrets in Dockerfile"],
      fifteenMin: ["Multi-stage builds for smaller images", "docker-compose for multi-service apps", ".dockerignore to exclude unnecessary files", "Volume mounts for persistent data", "Environment variables via --env-file"],
      oneHour: ["Write Dockerfile for FastAPI app", "Set up docker-compose with API + DB", "Deploy container to cloud VM", "Debug container with docker logs/exec", "Optimize image size with slim base"],
      cheatSheet: ["docker build -t name .", "docker run -p 8000:8000 name", "docker-compose up -d", "docker logs container_id", "docker exec -it container bash"],
    },
    glossary: ["CLI", "CI/CD", "REST APIs"],
    commonMistakes: ["Putting API keys in Dockerfile", "Not using .dockerignore (large images)", "Running as root in production", "Not pinning base image versions"],
  },
};
