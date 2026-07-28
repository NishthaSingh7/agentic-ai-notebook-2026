"use client";

import { Check, Circle } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";

interface ModuleCompleteButtonProps {
  phaseSlug: string;
  moduleSlug: string;
  moduleTitle: string;
  className?: string;
}

export function ModuleCompleteButton({
  phaseSlug,
  moduleSlug,
  moduleTitle,
  className,
}: ModuleCompleteButtonProps) {
  const { isCompleted, toggleModule } = useProgress();
  const done = isCompleted(phaseSlug, moduleSlug);

  return (
    <button
      type="button"
      onClick={() => toggleModule(phaseSlug, moduleSlug, moduleTitle)}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
        done
          ? "border-success/40 bg-success/10 text-success hover:bg-success/15"
          : "border-border bg-surface text-text-secondary hover:border-accent/40 hover:text-accent",
        className
      )}
    >
      {done ? (
        <>
          <Check className="h-4 w-4" />
          Completed
        </>
      ) : (
        <>
          <Circle className="h-4 w-4" />
          Mark as done
        </>
      )}
    </button>
  );
}
