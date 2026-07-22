"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";
import { useProgress } from "@/hooks/use-progress";
import { ModuleBookToggle } from "@/components/module-book-toggle";

interface ModuleListProps {
  phaseSlug: string;
  modules: {
    slug: string;
    title: string;
    readTime: number | null;
  }[];
}

export function ModuleList({ phaseSlug, modules }: ModuleListProps) {
  const { isCompleted, toggleModule } = useProgress();

  return (
    <div className="space-y-1">
      {modules.map((mod, i) => {
        const done = isCompleted(phaseSlug, mod.slug);
        const { readTime } = mod;

        return (
          <div
            key={mod.slug}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
              done ? "bg-success/5" : "hover:bg-surface-elevated"
            )}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleModule(phaseSlug, mod.slug);
              }}
              className="shrink-0 rounded-md p-0.5 transition-colors"
              aria-label={done ? `Mark ${mod.title} as not read` : `Mark ${mod.title} as read`}
              title={done ? "Mark as not read" : "Mark as read"}
            >
              <ModuleBookToggle done={done} />
            </button>

            <Link
              href={`/roadmap/${phaseSlug}/${mod.slug}`}
              className="flex-1 flex items-center justify-between min-w-0 gap-2"
            >
              <span className={cn("text-sm", done ? "text-text-secondary line-through" : "text-text-primary")}>
                <span className="text-text-muted font-mono text-xs mr-2">{i + 1}.</span>
                {mod.title}
              </span>
              {readTime ? (
                <span
                  className="flex items-center gap-1 text-xs text-text-muted shrink-0"
                  title="Estimated read time based on lesson content length"
                >
                  <Clock className="h-3 w-3" />
                  ~{formatDuration(readTime)} read
                </span>
              ) : null}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
