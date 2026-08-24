"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { phases, type Phase } from "@/data/roadmap";
import { GhostMedal, ProfileMedal } from "@/components/profile-medal";
import { cn } from "@/lib/utils";

type PhaseStatus = "done" | "active" | "todo";

interface PhaseRow {
  phase: Phase;
  status: PhaseStatus;
  done: number;
  total: number;
  percent: number;
  remaining: { slug: string; title: string }[];
}

function buildRows(completed: Set<string>): PhaseRow[] {
  return phases.map((phase) => {
    const remaining = phase.modules.filter((m) => !completed.has(`${phase.slug}/${m.slug}`));
    const done = phase.modules.length - remaining.length;
    const total = phase.modules.length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    const status: PhaseStatus = done === 0 ? "todo" : done >= total ? "done" : "active";
    return { phase, status, done, total, percent, remaining };
  });
}

interface ProfilePhaseGridProps {
  completed: Set<string>;
  focusSlug: string;
}

export function ProfilePhaseGrid({ completed, focusSlug }: ProfilePhaseGridProps) {
  const rows = buildRows(completed);
  const cleared = rows.filter((row) => row.status === "done");
  const alsoCooking = rows.filter(
    (row) => row.status === "active" && row.phase.slug !== focusSlug
  );

  return (
    <div className="space-y-6">
      {cleared.length > 0 ? (
        <section>
          <div className="mb-3">
            <h2 className="font-semibold">Medal wall</h2>
            <p className="text-xs text-text-muted mt-0.5">
              {cleared.length} chapter{cleared.length === 1 ? "" : "s"} with every module done.
              These names are yours.
            </p>
          </div>
          <div className="max-h-80 overflow-y-auto overscroll-contain px-1 py-2">
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-5 sm:justify-start">
              {cleared.map(({ phase, total }) => (
                <ProfileMedal key={phase.slug} phase={phase} total={total} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="flex flex-col items-center px-2 py-4 text-center">
          <GhostMedal />
          <p className="font-sketch mt-1 text-lg text-text-primary">No medals yet</p>
          <p className="mt-1 max-w-sm text-xs text-text-muted">
            Clear every module in a chapter and a medal hangs here with its real name — CrewAI, RAG
            Engineering, the whole stack.
          </p>
        </section>
      )}

      {alsoCooking.length > 0 ? (
        <section>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-royal">
            <Sparkles className="h-3.5 w-3.5" />
            Also in motion
          </p>
          <div className="space-y-2">
            {alsoCooking.map(({ phase, done, total, remaining }) => {
              const next = remaining[0];
              return (
                <div
                  key={phase.slug}
                  className="rounded-xl border border-royal/25 bg-royal/5 px-3 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{phase.title}</p>
                      <p className="text-[11px] text-text-muted">
                        {done} of {total} · {remaining.length} to go
                      </p>
                    </div>
                    {next ? (
                      <Link
                        href={`/roadmap/${phase.slug}/${next.slug}`}
                        className="inline-flex items-center gap-1 shrink-0 text-xs font-semibold text-royal hover:underline"
                      >
                        Continue
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="font-semibold">The path</h2>
        <p className="text-xs text-text-muted mt-0.5 mb-3">
          Named chapters, in order. Green is yours. Purple is live. The rest is still ahead.
        </p>
        <div className="max-h-40 overflow-y-auto overscroll-contain rounded-xl border border-border bg-background/40 p-3">
          <div className="flex flex-wrap gap-1.5">
            {rows.map(({ phase, status }) => (
              <Link
                key={phase.slug}
                href={`/roadmap/${phase.slug}`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                  status === "done" &&
                    "border-success/30 bg-success/10 text-success hover:bg-success/15",
                  status === "active" &&
                    "border-royal/40 bg-royal/10 text-royal hover:bg-royal/15",
                  status === "todo" &&
                    "border-border bg-surface text-text-muted hover:bg-surface-elevated hover:text-text-secondary"
                )}
              >
                {status === "done" ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : status === "active" ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-royal" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-border" />
                )}
                {phase.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
