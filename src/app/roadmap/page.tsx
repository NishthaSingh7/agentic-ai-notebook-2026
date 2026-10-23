import type { Metadata } from "next";
import { mainPhases, sidePhases } from "@/data/roadmap";
import { PhaseCard } from "@/components/phase-card";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "The order for learning AI properly, with every card open.",
};

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold">The roadmap</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-secondary">
        This is the order that works if you want to learn a topic properly and use it in a project.
        You can still open any card. Nothing locks the next chapter.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {mainPhases.map((phase, index) => (
          <PhaseCard key={phase.slug} phase={phase} index={index} />
        ))}
      </div>
      <h2 className="mt-14 text-2xl font-semibold">Side shelf</h2>
      <p className="mt-2 max-w-2xl text-text-secondary">Open these if you need them. They are not gates.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {sidePhases.map((phase, index) => (
          <PhaseCard key={phase.slug} phase={phase} index={index} />
        ))}
      </div>
    </div>
  );
}
