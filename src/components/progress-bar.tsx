"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/use-progress";

export function ProgressBar() {
  const { progressPercent, completedCount, totalModules, remainingHours, isAuthenticated, isSyncing } =
    useProgress();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex-1 w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Your Progress</span>
            {isAuthenticated && (
              <Link href="/profile" className="text-xs text-accent hover:underline">
                {isSyncing ? "Syncing..." : "View profile"}
              </Link>
            )}
          </div>
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
