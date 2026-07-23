"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { phases } from "@/data/roadmap";

interface ProfileCompletedModulesProps {
  completed: Set<string>;
}

export function ProfileCompletedModules({ completed }: ProfileCompletedModulesProps) {
  const phasesWithProgress = phases
    .map((phase) => {
      const doneModules = phase.modules.filter((m) =>
        completed.has(`${phase.slug}/${m.slug}`)
      );
      return { phase, doneModules };
    })
    .filter(({ doneModules }) => doneModules.length > 0);

  if (phasesWithProgress.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Modules you&apos;ve checked</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Tap any module to revisit the lesson
          </p>
        </div>
        <Link
          href="/roadmap"
          className="text-xs text-royal hover:underline flex items-center gap-1"
        >
          Full roadmap <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {phasesWithProgress.map(({ phase, doneModules }) => (
          <div key={phase.slug}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <Link
                href={`/roadmap/${phase.slug}`}
                className="text-sm font-medium hover:text-royal transition-colors"
              >
                {phase.subtitle} · {phase.title}
              </Link>
              <span className="text-xs text-text-muted tabular-nums shrink-0">
                {doneModules.length}/{phase.modules.length}
              </span>
            </div>
            <ul className="space-y-1">
              {doneModules.map((mod) => (
                <li key={mod.slug}>
                  <Link
                    href={`/roadmap/${phase.slug}/${mod.slug}`}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                    {mod.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
