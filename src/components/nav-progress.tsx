"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";

export function NavProgress({ className }: { className?: string }) {
  const { progressPercent, completedCount, totalModules } = useProgress();

  return (
    <Link
      href="/profile"
      className={cn(
        "group flex items-center gap-2.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 transition-colors hover:border-accent/30 hover:bg-surface-elevated",
        className
      )}
      title={`${completedCount} of ${totalModules} modules complete`}
    >
      <div className="hidden sm:block w-16 lg:w-24 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
        <div
          className="h-full rounded-full brand-gradient transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="relative h-7 w-7 shrink-0">
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
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold tabular-nums text-text-primary">
          {progressPercent}
        </span>
      </div>
      <span className="hidden md:inline text-xs text-text-muted group-hover:text-text-secondary transition-colors tabular-nums">
        {completedCount}/{totalModules}
      </span>
    </Link>
  );
}
