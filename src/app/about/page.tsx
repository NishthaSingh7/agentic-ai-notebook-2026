import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Code,
  Github,
  Heart,
  MessageSquare,
  PenLine,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { siteStats } from "@/data/site-stats";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Agentic AI Notebook 2026 — the complete AI Engineering curriculum for software engineers.",
};

const lessonFlow = [
  "Concept",
  "Why",
  "Analogy",
  "Technical",
  "Architecture",
  "Example",
  "Code",
  "Project",
  "Interview",
  "Revision",
];

const audience = [
  {
    icon: Users,
    title: "Software engineers",
    desc: "Full stack, backend, frontend — you already ship code. This is the AI layer.",
  },
  {
    icon: Target,
    title: "Career switchers",
    desc: "Experienced developers entering AI engineering without starting from a textbook.",
  },
  {
    icon: BookOpen,
    title: "Self-learners",
    desc: "A structured path. No bootcamp price tag. Progress that actually saves.",
  },
  {
    icon: MessageSquare,
    title: "Interview prep",
    desc: "Theory, coding, and system design for agent and AI platform roles.",
  },
];

const contributions = [
  { icon: PenLine, text: "Fix typos or unclear explanations in any module" },
  { icon: BookOpen, text: "Add revision notes from your own study sessions" },
  { icon: Code, text: "Suggest better code examples or real-world analogies" },
  { icon: Sparkles, text: "Propose glossary terms or interview questions" },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(194,65,12,0.10),transparent)]" />
        <div className="absolute inset-0 grid-bg opacity-40" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
            {siteConfig.hero.eyebrow}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.12] mb-5 max-w-3xl">
            The notebook that should have existed{" "}
            <span className="gradient-text">the day you decided to learn agents</span>
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mb-10">
            {siteConfig.name} is not another box-and-arrow roadmap. It is a full curriculum for
            software engineers — lessons, diagrams, code, projects, and interview prep in one
            place.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl border border-border bg-border overflow-hidden max-w-3xl">
            {[
              { value: siteStats.phases, label: "Phases" },
              { value: siteStats.modules, label: "Modules" },
              { value: siteStats.projects, label: "Projects" },
              { value: siteStats.glossaryTerms, label: "Glossary terms" },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface px-4 py-5 text-center">
                <div className="text-2xl font-bold tabular-nums">{stat.value}</div>
                <div className="text-xs text-text-muted mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
          Why this exists
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 max-w-2xl">
          Hundreds of AI roadmaps. Almost none teach you how to actually learn.
        </h2>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
              Typical roadmap sites
            </p>
            <ul className="space-y-3 text-sm text-text-secondary">
              {[
                "Boxes and arrows — what to learn, never how",
                "No notes to revise the night before an interview",
                "No architecture, no code, no hour-by-hour build",
                "You still have to Google the rest",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <X className="h-4 w-4 shrink-0 text-text-muted mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-surface to-royal/10 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
              This notebook
            </p>
            <ul className="space-y-3 text-sm text-text-secondary">
              {[
                "Every module is a lesson — concept through production",
                "Diagrams first, then the why, then working code",
                "Projects with blueprints, not a title and a prayer",
                "Interview questions sitting next to the topic they test",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <Sparkles className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
            The approach
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 max-w-2xl">
            Roadmap.sh energy. Course-level depth. Interview handbook included.
          </h2>
          <p className="text-text-secondary max-w-2xl mb-8">
            Think a learning path, a lab, and a revision notebook fused together. Every topic
            follows the same spine so you never wonder what to do next.
          </p>

          <div className="flex flex-wrap gap-2">
            {lessonFlow.map((step, i) => (
              <span key={step} className="inline-flex items-center gap-2">
                <span className="rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium">
                  {step}
                </span>
                {i < lessonFlow.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-text-muted hidden sm:block" />
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_0.9fr] gap-10 items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
              Built for
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Engineers, by engineers</h2>
            <p className="text-text-secondary leading-relaxed mb-8">
              If you can ship software, you can learn this stack. Intuition over proofs. Production
              over papers. Enough depth to pass interviews and keep systems up.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {audience.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-surface p-5"
                >
                  <item.icon className="h-5 w-5 text-accent mb-3" />
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              Not built for
            </p>
            <h3 className="text-xl font-bold mb-3">Researchers and proof-first paths</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              AI researchers, PhD students, or anyone who wants heavy mathematical derivations.
              This curriculum is engineering-focused — interviews and production, with intuition
              over equations.
            </p>
          </div>
        </div>
      </section>

      <section
        id="contribute"
        className="scroll-mt-24 border-y border-border bg-gradient-to-br from-accent/8 via-surface to-royal/8"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 border border-accent/20">
              <Heart className="h-5 w-5 text-accent" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Open curriculum
            </p>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Contribute while you learn</h2>
          <p className="text-text-secondary max-w-2xl mb-8">
            The notebook is meant to grow with the people using it. Spot something unclear? Have a
            better example? Leave it better than you found it — that is how this project is supposed
            to work.
          </p>

          <ul className="grid sm:grid-cols-2 gap-3 mb-8 max-w-3xl">
            {contributions.map((item) => (
              <li
                key={item.text}
                className="flex items-start gap-3 rounded-xl border border-border bg-background/70 px-4 py-3 text-sm text-text-secondary"
              >
                <item.icon className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                {item.text}
              </li>
            ))}
          </ul>

          <a
            href={siteConfig.copyright.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-surface-elevated transition-colors"
          >
            <Github className="h-4 w-4" />
            Open on GitHub
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">Start where you are</h2>
        <p className="text-text-secondary max-w-xl mb-8">
          New to the stack? Begin with programming foundations. Already shipping backends? Jump to
          GenAI and keep moving.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-on-accent hover:bg-accent/90 transition-colors"
          >
            View the roadmap
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/roadmap/programming-foundations"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-sm font-medium hover:bg-surface-elevated transition-colors"
          >
            Start with Programming
          </Link>
        </div>
      </section>
    </div>
  );
}
