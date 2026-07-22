import type { Metadata } from "next";
import { phases } from "@/data/roadmap";
import { siteStats } from "@/data/site-stats";
import { PhaseCard } from "@/components/phase-card";
import { PhaseIndex } from "@/components/phase-index";
import { RoadmapVisualization } from "@/components/roadmap-visualization";

export const metadata: Metadata = {
  title: "Roadmap",
  description: `Agentic AI hybrid roadmap — ${siteStats.phases} phases from programming foundations to interview system design.`,
};

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Agentic AI Master Roadmap</h1>
        <p className="text-text-secondary max-w-2xl leading-relaxed">
          Programming → GenAI → RAG → Agents → Production → Specialization.
          All {siteStats.phases} phases and {siteStats.modules} modules below — scroll or use the quick jump.
        </p>
      </div>

      <div className="mb-10">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-3">
          Quick jump — all {siteStats.phases} phases
        </p>
        <PhaseIndex />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {phases.map((phase, i) => (
          <PhaseCard key={phase.slug} phase={phase} index={i} />
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 max-w-xl mx-auto">
        <h3 className="text-sm font-semibold mb-4 text-center">Learning path overview</h3>
        <RoadmapVisualization />
      </div>
    </div>
  );
}
