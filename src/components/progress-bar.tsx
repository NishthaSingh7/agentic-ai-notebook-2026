"use client";

import { useProgress } from "@/hooks/use-progress";

export function ProgressBar() {
  const { progressPercent, completedCount, totalModules, remainingHours } = useProgress();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex-1 w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Your Progress</span>
          <span className="text-sm text-text-muted">
            {completedCount}/{totalModules} modules · ~{remainingHours}h remaining
          </span>
        </div>
        <div className="h-2 rounded-full bg-surface-elevated overflow-hidden">
          <div
            className="h-full rounded-full brand-gradient transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      <div className="text-2xl font-bold text-accent tabular-nums">{progressPercent}%</div>
    </div>
  );
}
