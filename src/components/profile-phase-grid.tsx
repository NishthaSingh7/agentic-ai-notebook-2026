"use client";

import Link from "next/link";
import { phases } from "@/data/roadmap";
import { cn } from "@/lib/utils";

type PhaseStatus = "done" | "active" | "todo";

function getPhaseStatus(
  phase: (typeof phases)[number],
  completed: Set<string>
): { status: PhaseStatus; done: number; total: number } {
  const done = phase.modules.filter((m) =>
    completed.has(`${phase.slug}/${m.slug}`)
  ).length;
  const total = phase.modules.length;
  if (done === 0) return { status: "todo", done, total };
  if (done >= total) return { status: "done", done, total };
  return { status: "active", done, total };
}

interface ProfilePhaseGridProps {
  completed: Set<string>;
}

export function ProfilePhaseGrid({ completed }: ProfilePhaseGridProps) {
  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Roadmap at a glance — all {phases.length} phases
        </p>
        <div className="flex flex-wrap items-center gap-3 text-[10px] text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-success border border-success/60" />
            All modules done
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-royal/80 border border-royal/60" />
            In progress
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-surface-elevated border border-border" />
            Not started
          </span>
        </div>
      </div>

      <div className="grid grid-cols-11 gap-1.5 sm:gap-2">
        {phases.map((phase) => {
          const { status, done, total } = getPhaseStatus(phase, completed);
          const percent = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <Link
              key={phase.slug}
              href={`/roadmap/${phase.slug}`}
              title={`${phase.title} — ${done}/${total} modules (${percent}%)`}
              className={cn(
                "group relative flex aspect-square items-center justify-center rounded-md text-[10px] font-mono font-medium transition-all hover:scale-110 hover:z-10 sm:text-xs",
                status === "done" &&
                  "bg-success/20 border border-success/50 text-success",
                status === "active" &&
                  "bg-royal/20 border border-royal/50 text-royal",
                status === "todo" &&
                  "bg-surface border border-border text-text-muted hover:border-text-muted"
              )}
            >
              {phase.id}
              {status === "active" && (
                <span
                  className="absolute bottom-0.5 left-1/2 h-0.5 max-w-[80%] -translate-x-1/2 rounded-full bg-royal"
                  style={{ width: `${Math.max(percent, 20)}%` }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] text-text-muted leading-relaxed">
        Tap any phase to open it. Blue means you&apos;ve checked some modules but not all.
        Green only appears when every module in that phase is complete.
      </p>
    </div>
  );
}
