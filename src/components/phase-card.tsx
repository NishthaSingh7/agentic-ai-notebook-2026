"use client";

import Link from "next/link";
import type { Phase } from "@/data/roadmap";
import { useProgress } from "@/hooks/use-progress";

interface PhaseCardProps {
  phase: Phase;
  index: number;
}

export function PhaseCard({ phase }: PhaseCardProps) {
  const { isCompleted } = useProgress();
  const read = phase.modules.filter((mod) => isCompleted(phase.slug, mod.slug)).length;

  return (
    <article
      className={`card-press group relative flex h-full flex-col rounded-3xl border border-border p-5 hover:border-accent/40 ${phase.color}`}
    >
      <Link
        href={`/roadmap/${phase.slug}`}
        aria-label={phase.title}
        className="absolute inset-0 z-0 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />
      <div className="pointer-events-none relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-text-muted">{phase.subtitle}</p>
          <p className="mt-1 text-xl font-semibold text-text-primary">{phase.title}</p>
        </div>
        <span className="rounded-full bg-surface/80 px-2 py-1 text-xs text-text-secondary">{phase.id}</span>
      </div>
      <p className="pointer-events-none relative z-10 mt-3 text-sm leading-relaxed text-text-secondary">
        {phase.description}
      </p>
      <div className="pointer-events-none relative z-10 mt-4 flex flex-wrap gap-2">
        {phase.modules.map((mod) => (
          <Link
            key={mod.slug}
            href={`/roadmap/${phase.slug}/${mod.slug}`}
            className="pointer-events-auto rounded-full bg-surface/80 px-2.5 py-1 text-xs text-text-primary hover:bg-surface"
          >
            {mod.title}
          </Link>
        ))}
      </div>
      <p className="pointer-events-none relative z-10 mt-4 text-xs text-text-muted">
        {read > 0 ? `${read} read` : "Open any card"}
      </p>
    </article>
  );
}
