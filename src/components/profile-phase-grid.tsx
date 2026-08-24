"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDashed, Sparkles } from "lucide-react";
import { phases, type Phase } from "@/data/roadmap";
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
    const doneMods = phase.modules.filter((m) => completed.has(`${phase.slug}/${m.slug}`));
    const remaining = phase.modules.filter((m) => !completed.has(`${phase.slug}/${m.slug}`));
    const done = doneMods.length;
    const total = phase.modules.length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    const status: PhaseStatus = done === 0 ? "todo" : done >= total ? "done" : "active";
    return { phase, status, done, total, percent, remaining };
  });
}

interface ProfilePhaseGridProps {
  completed: Set<string>;
}

export function ProfilePhaseGrid({ completed }: ProfilePhaseGridProps) {
  const rows = buildRows(completed);
  const cleared = rows.filter((row) => row.status === "done");
  const active = rows.filter((row) => row.status === "active");
  const waiting = rows.filter((row) => row.status === "todo");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-semibold">Your phases</h2>
        <p className="text-xs text-text-muted mt-0.5">
          {cleared.length === 0 && active.length === 0
            ? "Names, not numbers — your cleared and in-progress phases will land here."
            : `${cleared.length} cleared · ${active.length} in progress · ${waiting.length} waiting`}
        </p>
      </div>

      {cleared.length > 0 ? (
        <section>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-success">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Cleared
          </p>
          <div className="max-h-56 overflow-y-auto overscroll-contain space-y-2 pr-1">
            {cleared.map(({ phase, total }) => (
              <Link
                key={phase.slug}
                href={`/roadmap/${phase.slug}`}
                className="flex items-center gap-3 rounded-xl border border-success/35 bg-success/8 px-3 py-3 hover:bg-success/12 transition-colors"
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white text-xs font-bold",
                    phase.color
                  )}
                >
                  {phase.id}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary truncate">{phase.title}</p>
                  <p className="text-[11px] text-text-muted">
                    {phase.subtitle}
                    {phase.optional ? " · Optional" : ""} · every module done
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-success">
                  Complete
                </span>
                <span className="hidden sm:block text-[11px] tabular-nums text-text-muted">
                  {total}/{total}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {active.length > 0 ? (
        <section>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-royal">
            <Sparkles className="h-3.5 w-3.5" />
            In progress
          </p>
          <div className="max-h-[28rem] space-y-3 overflow-y-auto overscroll-contain pr-0.5">
            {active.map(({ phase, done, total, percent, remaining }) => {
              const next = remaining[0];
              return (
                <div
                  key={phase.slug}
                  className="rounded-xl border border-royal/30 bg-royal/6 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white text-xs font-bold",
                        phase.color
                      )}
                    >
                      {phase.id}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold">{phase.title}</h3>
                        <span className="rounded-full bg-royal/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-royal">
                          In progress
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {phase.subtitle}
                        {phase.optional ? " · Optional" : ""} · {done} of {total} modules finished ·{" "}
                        {remaining.length} still open
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-background/80">
                    <div
                      className="h-full rounded-full bg-royal transition-all"
                      style={{ width: `${Math.max(percent, 6)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-right text-[11px] tabular-nums text-royal font-medium">
                    {percent}%
                  </p>

                  {next ? (
                    <Link
                      href={`/roadmap/${phase.slug}/${next.slug}`}
                      className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-royal/20 bg-background/70 px-3 py-2.5 hover:bg-royal/10 transition-colors group"
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-royal">
                          Next in {phase.title}
                        </p>
                        <p className="text-sm font-medium truncate">{next.title}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 shrink-0 text-xs font-semibold text-royal">
                        Continue
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
          <CircleDashed className="h-3.5 w-3.5" />
          Full roadmap
        </p>
        <div className="max-h-72 overflow-y-auto overscroll-contain rounded-xl border border-border divide-y divide-border/80">
          {rows.map(({ phase, status, done, total, percent }) => (
            <Link
              key={phase.slug}
              href={`/roadmap/${phase.slug}`}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-surface-elevated transition-colors"
            >
              <span
                className={cn(
                  "h-2 w-2 shrink-0 rounded-full",
                  status === "done" && "bg-success",
                  status === "active" && "bg-royal",
                  status === "todo" && "bg-border"
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{phase.title}</p>
                <p className="text-[11px] text-text-muted">
                  {phase.subtitle}
                  {phase.optional ? " · Optional" : ""}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  status === "done" && "bg-success/10 text-success",
                  status === "active" && "bg-royal/10 text-royal",
                  status === "todo" && "bg-surface-elevated text-text-muted"
                )}
              >
                {status === "done" ? "Complete" : status === "active" ? "In progress" : "Not started"}
              </span>
              <span className="w-12 shrink-0 text-right text-[11px] tabular-nums text-text-muted">
                {status === "todo" ? "—" : `${done}/${total}`}
              </span>
              {status !== "todo" ? (
                <span className="hidden sm:block h-1.5 w-12 overflow-hidden rounded-full bg-surface-elevated">
                  <span
                    className={cn(
                      "block h-full rounded-full",
                      status === "done" ? "bg-success" : "bg-royal"
                    )}
                    style={{ width: `${percent}%` }}
                  />
                </span>
              ) : (
                <span className="hidden sm:block w-12" />
              )}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
