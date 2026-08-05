"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";

export function NavProgress({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { progressPercent, completedCount, totalModules } = useProgress();

  if (compact) {
    return (
      <Link
        href="/profile"
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-surface-elevated",
          className
        )}
        title={`${completedCount} of ${totalModules} modules · ${progressPercent}%`}
      >
        <svg viewBox="0 0 36 36" className="h-7 w-7 -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-surface-elevated"
          />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="url(#navProgressGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${(progressPercent / 100) * 94.25} 94.25`}
            className="transition-all duration-500"
          />
          <defs>
            <linearGradient id="navProgressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--royal)" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold tabular-nums text-text-primary">
          {progressPercent}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/profile"
      className={cn(
        "group flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3 py-2 transition-colors hover:border-accent/30 hover:bg-surface-elevated",
        className
      )}
      title={`${completedCount} of ${totalModules} modules complete`}
    >
      <div className="relative h-8 w-8 shrink-0">
        <svg viewBox="0 0 36 36" className="h-8 w-8 -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-surface-elevated"
          />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="url(#navProgressGradFull)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${(progressPercent / 100) * 94.25} 94.25`}
            className="transition-all duration-500"
          />
          <defs>
            <linearGradient id="navProgressGradFull" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--royal)" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold tabular-nums text-text-primary">
          {progressPercent}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-text-primary tabular-nums">
          {completedCount}/{totalModules}
        </p>
        <p className="text-[10px] text-text-muted">modules done</p>
      </div>
    </Link>
  );
}
