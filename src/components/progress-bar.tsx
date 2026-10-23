"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/use-progress";

export function ProgressBar() {
  const { completedCount, totalModules, isAuthenticated, isSyncing } = useProgress();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-text-secondary">
        {completedCount === 0
          ? "You have not marked a card on the path yet. That is fine."
          : `You have marked ${completedCount} of ${totalModules} cards on the path.`}
      </p>
      {isAuthenticated ? (
        <Link href="/profile" className="text-sm text-accent hover:underline">
          {isSyncing ? "Syncing..." : "Your path"}
        </Link>
      ) : null}
    </div>
  );
}
