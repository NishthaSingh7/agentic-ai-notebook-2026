"use client";

import { BookOpen, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleBookToggleProps {
  done: boolean;
  className?: string;
}

export function ModuleBookToggle({ done, className }: ModuleBookToggleProps) {
  return (
    <span className={cn("relative inline-flex h-5 w-5 items-center justify-center", className)}>
      <BookOpen
        className="h-5 w-5 text-text-muted transition-colors group-hover:text-text-secondary"
        strokeWidth={1.75}
      />
      {done && (
        <Check
          className="absolute inset-0 m-auto h-3 w-3 text-success"
          strokeWidth={3}
          aria-hidden
        />
      )}
    </span>
  );
}
