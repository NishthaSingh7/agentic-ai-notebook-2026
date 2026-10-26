import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Code,
  Github,
  Heart,
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
    "About Hello, human — a plain-English path for learning AI and using it in a project.",
};

const lessonFlow = ["A picture", "Story", "Plain words", "Example", "Try this", "Remember"];

const audience = [
  {
    icon: Users,
    title: "People who build things",
    desc: "You write software, or you are learning to. This is the AI layer, told like a friend would tell it.",
  },
  {
    icon: Target,
    title: "Career switchers",
    desc: "You already ship code. You want agents and models without starting from a textbook.",
  },
  {
    icon: BookOpen,
    title: "Self-learners",
    desc: "A short path. No bootcamp price. Open any card when you want it.",
  },
  {
    icon: Sparkles,
    title: "Curious builders",
    desc: "You want one helper you can actually finish, not nine unfinished apps.",
  },
];

const contributions = [
  { icon: PenLine, text: "Fix a line that is unclear, or a typo you spotted" },
  { icon: BookOpen, text: "Add a note from something you already studied" },
  { icon: Code, text: "Suggest a clearer example or a better try-this" },
  { icon: Sparkles, text: "Propose a glossary term that would have helped you" },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(184,94,64,0.10),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
            {siteConfig.hero.eyebrow}
          </p>
          <h1 className="mb-5 max-w-3xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl">
            A friend explaining AI, with a path you can actually finish
          </h1>
          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-text-secondary">
            {siteConfig.name} is a free path for anyone who wants to understand AI and use it in a
            project. The roadmap stays short. Notes is where studied topics get written up. You can
            open any card.
          </p>

          <div className="grid max-w-3xl grid-cols-2 overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4 gap-px">
            {[
              { value: siteStats.phases, label: "Chapters" },
              { value: siteStats.modules, label: "Cards" },
              { value: siteStats.projects, label: "Small builds" },
              { value: siteStats.glossaryTerms, label: "Glossary terms" },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface px-4 py-5 text-center">
                <div className="text-2xl font-bold tabular-nums">{stat.value}</div>
                <div className="mt-0.5 text-xs text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">Why this exists</p>
        <h2 className="mb-8 max-w-2xl text-2xl font-bold sm:text-3xl">
          Hundreds of AI roadmaps. Almost none teach you how to actually learn.
        </h2>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Typical roadmap sites
            </p>
            <ul className="space-y-3 text-sm text-text-secondary">
              {[
                "Boxes and arrows — what to learn, never how",
                "No short card you can finish in one sitting",
                "No picture, no story, no try-this",
                "You still have to Google the rest",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-accent/30 bg-surface-elevated p-6 sm:p-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-accent">
              This path
            </p>
            <ul className="space-y-3 text-sm text-text-secondary">
              {[
                "Every card is a short lesson you can leave whenever",
                "A picture, a story, plain words, an example, then a try",
                "One small build at the end of each chapter",
                "Notes for topics already studied, not a second course",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">The approach</p>
          <h2 className="mb-3 max-w-2xl text-2xl font-bold sm:text-3xl">
            Spoken English. One spine. Open any card.
          </h2>
          <p className="mb-8 max-w-2xl text-text-secondary">
            Every module on the path uses the same shape, so you never wonder what comes next on the
            page.
          </p>

          <div className="flex flex-wrap gap-2">
            {lessonFlow.map((step, i) => (
              <span key={step} className="inline-flex items-center gap-2">
                <span className="rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium">
                  {step}
                </span>
                {i < lessonFlow.length - 1 ? (
                  <ArrowRight className="hidden h-3.5 w-3.5 text-text-muted sm:block" />
                ) : null}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">Built for</p>
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">People who want to use AI, not only name it</h2>
            <p className="mb-8 leading-relaxed text-text-secondary">
              If you can follow a short story and try one thing, you can walk this path. Intuition
              first. A project you can finish.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {audience.map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-surface p-5">
                  <item.icon className="mb-3 h-5 w-5 text-accent" />
                  <h3 className="mb-1 text-sm font-semibold">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-text-secondary">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Not built for
            </p>
            <h3 className="mb-3 text-xl font-bold">Researchers and proof-first paths</h3>
            <p className="text-sm leading-relaxed text-text-secondary">
              AI researchers, PhD students, or anyone who wants heavy mathematical derivations. This
              path is for understanding and using AI in a project, with plain words over equations.
            </p>
          </div>
        </div>
      </section>

      <section
        id="contribute"
        className="scroll-mt-24 border-y border-border bg-surface-elevated"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
              <Heart className="h-5 w-5 text-accent" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">Open path</p>
          </div>
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">Contribute while you learn</h2>
          <p className="mb-8 max-w-2xl text-text-secondary">
            This site is meant to grow with the people using it. Spot something unclear? Have a
            better example? Leave it better than you found it.
          </p>

          <ul className="mb-8 grid max-w-3xl gap-3 sm:grid-cols-2">
            {contributions.map((item) => (
              <li
                key={item.text}
                className="flex items-start gap-3 rounded-xl border border-border bg-background/70 px-4 py-3 text-sm text-text-secondary"
              >
                <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {item.text}
              </li>
            ))}
          </ul>

          <a
            href={siteConfig.copyright.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-surface transition-colors"
          >
            <Github className="h-4 w-4" />
            Open on GitHub
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="mb-3 text-2xl font-bold sm:text-3xl">Start where you are</h2>
        <p className="mb-8 max-w-xl text-text-secondary">
          New to this? Start at Meet AI. Already comfortable? Open any chapter. The order is there if
          you want it.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/roadmap/meet-ai"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-on-accent hover:bg-accent-dim transition-colors"
          >
            Start at the beginning
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-sm font-medium hover:bg-surface-elevated transition-colors"
          >
            I already know some of this
          </Link>
        </div>
      </section>
    </div>
  );
}
