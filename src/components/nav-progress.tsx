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
  const { completedCount, totalModules } = useProgress();
  const label = `${completedCount} of ${totalModules} cards`;
  const detail = `${completedCount} of ${totalModules} cards on the main path`;

  return (
    <Link
      href="/profile"
      className={cn(
        "rounded-full px-3 py-1.5 text-xs text-text-muted hover:bg-surface-elevated hover:text-text-secondary",
        compact && "px-2",
        className
      )}
      title={detail}
      aria-label={detail}
    >
      {label}
    </Link>
  );
}
