"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { phases } from "@/data/roadmap";
import { cn } from "@/lib/utils";

const MODULES_PER_PAGE = 8;

interface ProfileCompletedModulesProps {
  completed: Set<string>;
}

export function ProfileCompletedModules({ completed }: ProfileCompletedModulesProps) {
  const phasesWithProgress = useMemo(
    () =>
      phases
        .map((phase) => {
          const doneModules = phase.modules.filter((m) =>
            completed.has(`${phase.slug}/${m.slug}`)
          );
          return { phase, doneModules };
        })
        .filter(({ doneModules }) => doneModules.length > 0),
    [completed]
  );

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [modulePage, setModulePage] = useState(0);

  useEffect(() => {
    // Land on the furthest chapter with wins, not Phase 0.
    setPhaseIndex(Math.max(0, phasesWithProgress.length - 1));
  }, [phasesWithProgress.length]);

  const current = phasesWithProgress[Math.min(phaseIndex, Math.max(0, phasesWithProgress.length - 1))];
  const doneCount = phasesWithProgress.reduce((sum, entry) => sum + entry.doneModules.length, 0);
  const modulePageCount = current
    ? Math.max(1, Math.ceil(current.doneModules.length / MODULES_PER_PAGE))
    : 1;

  useEffect(() => {
    setModulePage(0);
  }, [phaseIndex, current?.phase.slug]);

  useEffect(() => {
    setModulePage((page) => Math.min(page, modulePageCount - 1));
  }, [modulePageCount]);

  if (phasesWithProgress.length === 0 || !current) return null;

  const safeModulePage = Math.min(modulePage, modulePageCount - 1);
  const pageStart = safeModulePage * MODULES_PER_PAGE;
  const visibleModules = current.doneModules.slice(pageStart, pageStart + MODULES_PER_PAGE);
  const showPhasePager = phasesWithProgress.length > 1;
  const showModulePager = current.doneModules.length > MODULES_PER_PAGE;

  function goPhase(next: number) {
    setPhaseIndex(Math.max(0, Math.min(phasesWithProgress.length - 1, next)));
  }

  function goModulePage(next: number) {
    setModulePage(Math.max(0, Math.min(modulePageCount - 1, next)));
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Relive your wins</h2>
          <p className="text-xs text-text-muted mt-0.5">
            {doneCount} module{doneCount === 1 ? "" : "s"} you actually finished — flip through
            chapters by name.
          </p>
        </div>
        <Link
          href="/roadmap"
          className="text-xs text-royal hover:underline flex items-center gap-1 shrink-0"
        >
          Full roadmap <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mb-3 flex items-center gap-2">
        {showPhasePager ? (
          <button
            type="button"
            onClick={() => goPhase(phaseIndex - 1)}
            disabled={phaseIndex === 0}
            aria-label="Previous phase"
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border shrink-0",
              phaseIndex === 0
                ? "text-text-muted/40 cursor-not-allowed"
                : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        ) : null}

        <div className="min-w-0 flex-1 rounded-xl border border-border bg-background/60 px-3 py-2.5">
          <Link
            href={`/roadmap/${current.phase.slug}`}
            className="block font-sketch text-lg leading-tight truncate hover:text-royal transition-colors"
          >
            {current.phase.title}
          </Link>
          <p className="text-[11px] text-text-muted tabular-nums mt-0.5">
            {current.phase.subtitle}
            {current.phase.optional ? " · Optional" : ""} · {current.doneModules.length}/
            {current.phase.modules.length} finished
            {showPhasePager
              ? ` · ${phaseIndex + 1} of ${phasesWithProgress.length} chapters`
              : ""}
          </p>
        </div>

        {showPhasePager ? (
          <button
            type="button"
            onClick={() => goPhase(phaseIndex + 1)}
            disabled={phaseIndex === phasesWithProgress.length - 1}
            aria-label="Next phase"
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border shrink-0",
              phaseIndex === phasesWithProgress.length - 1
                ? "text-text-muted/40 cursor-not-allowed"
                : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {showPhasePager ? (
        <div className="mb-3 flex flex-wrap gap-1">
          {phasesWithProgress.map((entry, i) => (
            <button
              key={entry.phase.slug}
              type="button"
              onClick={() => goPhase(i)}
              aria-label={`${entry.phase.title}, ${entry.doneModules.length} done`}
              aria-current={i === phaseIndex ? "true" : undefined}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === phaseIndex ? "w-5 bg-accent" : "w-1.5 bg-border hover:bg-text-muted"
              )}
            />
          ))}
        </div>
      ) : null}

      <div className="max-h-72 overflow-y-auto overscroll-contain rounded-xl border border-border/80 bg-background/40 pr-1">
        <ul className="p-1">
          {visibleModules.map((mod) => (
            <li key={mod.slug}>
              <Link
                href={`/roadmap/${current.phase.slug}/${mod.slug}`}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors"
              >
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                {mod.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {showModulePager ? (
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goModulePage(safeModulePage - 1)}
            disabled={safeModulePage === 0}
            className={cn(
              "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium",
              safeModulePage === 0
                ? "text-text-muted/40 cursor-not-allowed"
                : "text-text-secondary hover:bg-surface-elevated"
            )}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Prev
          </button>
          <p className="text-[11px] text-text-muted tabular-nums">
            {pageStart + 1}–{pageStart + visibleModules.length} of {current.doneModules.length}
          </p>
          <button
            type="button"
            onClick={() => goModulePage(safeModulePage + 1)}
            disabled={safeModulePage === modulePageCount - 1}
            className={cn(
              "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium",
              safeModulePage === modulePageCount - 1
                ? "text-text-muted/40 cursor-not-allowed"
                : "text-text-secondary hover:bg-surface-elevated"
            )}
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-text-muted">
          Showing all {current.doneModules.length} finished module
          {current.doneModules.length === 1 ? "" : "s"} in this phase.
        </p>
      )}
    </div>
  );
}
