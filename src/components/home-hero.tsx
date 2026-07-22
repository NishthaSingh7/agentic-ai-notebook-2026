import Link from "next/link";
import { ArrowRight, Github, BookOpen, Code, MessageSquare, Layers } from "lucide-react";
import { siteConfig } from "@/config/site";
import { siteStats } from "@/data/site-stats";

const topics = ["LLMs", "RAG", "Agents", "LangGraph", "MCP", "Production"];

const includes = [
  { icon: BookOpen, label: "Structured lessons" },
  { icon: Code, label: "Code & projects" },
  { icon: MessageSquare, label: "Interview prep" },
  { icon: Layers, label: "11-phase roadmap" },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(74,222,128,0.12),transparent)]" />
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-20 items-center">
          {/* Left — message */}
          <div className="max-w-xl">
            <p className="text-sm font-medium text-accent mb-5">
              {siteConfig.hero.eyebrow}
            </p>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.12] mb-6">
              Learn to build{" "}
              <span className="gradient-text">autonomous AI agents</span>
            </h1>

            <p className="text-xl text-text-primary leading-snug mb-4">
              {siteConfig.tagline}
            </p>

            <p className="text-base text-text-secondary leading-relaxed mb-8">
              A structured notebook for software engineers — not a hype list.
              Pick a phase, read the lesson, ship the project.
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-border bg-surface/80 px-3 py-1 text-xs text-text-secondary"
                >
                  {topic}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-background hover:bg-accent/90 transition-colors"
              >
                Start the roadmap
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/roadmap/agentic-ai"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-sm font-medium text-text-primary hover:bg-surface-elevated transition-colors"
              >
                Jump to Agentic AI
              </Link>
            </div>

            <a
              href={siteConfig.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm text-text-muted hover:text-text-secondary transition-colors"
            >
              <Github className="h-4 w-4" />
              Follow @{siteConfig.github.username}
            </a>
          </div>

          {/* Right — what's inside */}
          <div className="lg:pl-4">
            <div className="rounded-2xl border border-border bg-surface/60 backdrop-blur-sm p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-6">
                What you get
              </p>

              <ul className="space-y-5 mb-8">
                {includes.map((item) => (
                  <li key={item.label} className="flex items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                      <item.icon className="h-4 w-4 text-accent" />
                    </span>
                    <span className="text-sm font-medium text-text-primary">{item.label}</span>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-2 gap-px rounded-xl border border-border bg-border overflow-hidden">
                {[
                  { value: siteStats.phases, label: "Phases" },
                  { value: siteStats.modules, label: "Modules" },
                  { value: siteStats.interviewQuestions, label: "Questions" },
                  { value: siteStats.projects, label: "Projects" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-surface px-4 py-4 text-center">
                    <div className="text-2xl font-bold tabular-nums">{stat.value}</div>
                    <div className="text-xs text-text-muted mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
