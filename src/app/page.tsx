import Link from "next/link";
import { ArrowRight, BookOpen, Code, MessageSquare, BookMarked, Heart, PenLine } from "lucide-react";
import { phases } from "@/data/roadmap";
import { siteStats } from "@/data/site-stats";
import { PhaseCard } from "@/components/phase-card";
import { RoadmapVisualization } from "@/components/roadmap-visualization";
import { ProgressBar } from "@/components/progress-bar";
import { HomeHero } from "@/components/home-hero";

export default function HomePage() {
  return (
    <>
      <HomeHero />

      {/* Progress */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <ProgressBar />
        </div>
      </section>

      {/* What makes this different */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-2xl font-bold mb-2">Not just a roadmap</h2>
        <p className="text-text-secondary mb-10 max-w-2xl">
          Every module follows the same structure — concept, architecture, code, project,
          interview questions, and revision notes.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, title: "Structured Lessons", desc: "Consistent format across every topic — concept to production." },
            { icon: Code, title: "Real Code", desc: "Working examples and projects you can build and deploy." },
            { icon: MessageSquare, title: "Interview Ready", desc: "Top questions, system design, and architecture prep." },
            { icon: BookMarked, title: "Glossary", desc: `${siteStats.glossaryTerms} AI engineering terms with definitions, analogies, and interview tips.`, href: "/glossary" },
          ].map((item) => {
            const Card = (
              <>
                <item.icon className="h-5 w-5 text-accent mb-3" />
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </>
            );
            return "href" in item && item.href ? (
              <Link key={item.title} href={item.href} className="rounded-xl border border-border bg-surface p-5 hover:bg-surface-elevated transition-colors">
                {Card}
              </Link>
            ) : (
              <div key={item.title} className="rounded-xl border border-border bg-surface p-5">
                {Card}
              </div>
            );
          })}
        </div>
      </section>

      {/* Roadmap Flow */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-bold mb-2">Your learning path</h2>
            <p className="text-text-secondary mb-4">
              {siteStats.phases} phases from programming foundations to interview projects.
              Each phase builds on the previous — no gaps, no guesswork.
            </p>
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
            >
              View full roadmap <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <RoadmapVisualization />
        </div>
      </section>

      {/* Phases */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-2xl font-bold mb-2">All Phases</h2>
        <p className="text-text-secondary mb-10">
          Click any phase to explore modules, projects, and revision notes.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {phases.map((phase, i) => (
            <PhaseCard key={phase.slug} phase={phase} index={i} />
          ))}
        </div>
      </section>

      {/* Contribute */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 mb-5">
              <Heart className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Learn together, build together</h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Agentic AI Notebook is an open curriculum — and we&apos;d be happy if you contribute
              while learning. Spot something unclear? Have a better example? Want to add revision
              notes from your own study? Every improvement helps the next engineer on this path.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-text-muted">
              {[
                { icon: PenLine, text: "Fix typos & improve explanations" },
                { icon: BookOpen, text: "Add notes from your learning" },
                { icon: Code, text: "Share better code examples" },
              ].map((item) => (
                <span
                  key={item.text}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2"
                >
                  <item.icon className="h-3.5 w-3.5 text-accent" />
                  {item.text}
                </span>
              ))}
            </div>
            <Link
              href="/about#contribute"
              className="inline-flex items-center gap-2 mt-8 text-sm text-accent hover:underline"
            >
              How to contribute <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to build <span className="gradient-text">Agentic AI</span> systems?
          </h2>
          <p className="text-text-secondary mb-8 max-w-xl mx-auto">
            Start with Phase 0 (Programming Foundations), or jump to any phase on the full roadmap.
          </p>
          <Link
            href="/roadmap/programming-foundations"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-background hover:bg-accent/90 transition-colors"
          >
            Begin Phase 0 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
