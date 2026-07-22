import Link from "next/link";
import { phases } from "@/data/roadmap";

export function PhaseIndex() {
  return (
    <nav
      aria-label="All roadmap phases"
      className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin"
    >
      {phases.map((phase) => (
        <Link
          key={phase.slug}
          href={`/roadmap/${phase.slug}`}
          className="shrink-0 rounded-lg border border-border bg-surface px-3 py-2 text-xs hover:border-accent/40 hover:bg-surface-elevated transition-colors"
        >
          <span className="font-mono text-accent mr-1.5">{phase.id}</span>
          <span className="text-text-secondary">{phase.title}</span>
        </Link>
      ))}
    </nav>
  );
}
