"use client";

import Link from "next/link";
import type { Module } from "@/data/roadmap";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/use-progress";

interface ModuleListProps {
  phaseSlug: string;
  modules: Module[];
}

export function ModuleList({ phaseSlug, modules }: ModuleListProps) {
  const { isCompleted, toggleModule } = useProgress();

  return (
    <div className="space-y-2">
      {modules.map((mod, index) => {
        const done = isCompleted(phaseSlug, mod.slug);
        return (
          <div
            key={mod.slug}
            className={cn(
              "flex items-start gap-3 rounded-2xl border border-border bg-surface px-4 py-3",
              done && "bg-accent/10"
            )}
          >
            <button
              type="button"
              onClick={() => toggleModule(phaseSlug, mod.slug, mod.title)}
              className={cn(
                "mt-0.5 h-5 w-5 shrink-0 rounded-full border text-[10px]",
                done ? "border-success bg-success text-on-accent" : "border-border text-transparent"
              )}
              aria-label={done ? `Mark ${mod.title} as not complete` : `Mark ${mod.title} complete`}
            >
              ✓
            </button>
            <Link href={`/roadmap/${phaseSlug}/${mod.slug}`} className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary">
                <span className="mr-2 text-xs text-text-muted">{index + 1}</span>
                {mod.title}
                {mod.build ? <span className="ml-2 text-xs font-normal text-text-muted">Small build</span> : null}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">{mod.description}</p>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
