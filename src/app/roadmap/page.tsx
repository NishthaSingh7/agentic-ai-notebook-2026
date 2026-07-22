import type { Metadata } from "next";
import { phases } from "@/data/roadmap";
import { siteStats } from "@/data/site-stats";
import { PhaseCard } from "@/components/phase-card";
import { RoadmapVisualization } from "@/components/roadmap-visualization";

export const metadata: Metadata = {
  title: "Roadmap",
  description: `Agentic AI Master Roadmap v2 — ${siteStats.phases} phases from GenAI foundations to interview system design.`,
};

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-3">Agentic AI Master Roadmap v2</h1>
        <p className="text-text-secondary max-w-2xl leading-relaxed">
          Foundations → implementation → frameworks → production → specialization.
          {siteStats.phases} phases, {siteStats.modules} modules, and hands-on projects
          at every stage.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-4">
            {phases.map((phase, i) => (
              <PhaseCard key={phase.slug} phase={phase} index={i} />
            ))}
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-border bg-surface p-6">
            <h3 className="text-sm font-semibold mb-4">Learning Path</h3>
            <RoadmapVisualization />
          </div>
        </div>
      </div>
    </div>
  );
}
