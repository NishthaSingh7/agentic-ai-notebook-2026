"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import type { Phase, PhaseStatus } from "@/data/roadmap";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/use-progress";

const statusLabels: Record<PhaseStatus, { label: string; className: string }> = {
  completed: { label: "Completed", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  "in-progress": { label: "In Progress", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  upcoming: { label: "Upcoming", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
};

interface PhaseCardProps {
  phase: Phase;
  index: number;
}

export function PhaseCard({ phase, index }: PhaseCardProps) {
  const { getPhaseProgress } = useProgress();
  const progress = getPhaseProgress(phase.slug);
  const status = statusLabels[phase.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/roadmap/${phase.slug}`}
        className="group block rounded-xl border border-border bg-surface p-6 transition-all hover:border-border hover:bg-surface-elevated hover:shadow-lg"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-mono text-text-muted">{phase.subtitle}</span>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                {phase.title}
              </h3>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                  status.className
                )}
              >
                {status.label}
              </span>
            </div>
          </div>
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white text-sm font-bold",
              phase.color
            )}
          >
            {phase.id}
          </div>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">
          {phase.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-text-muted mb-4">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {phase.modules.length} modules
          </span>
          {progress > 0 && (
            <span className="flex items-center gap-1 text-accent">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {progress}%
            </span>
          )}
        </div>

        {progress > 0 && (
          <div className="h-1 rounded-full bg-surface-elevated mb-4 overflow-hidden">
            <div
              className="h-full rounded-full brand-gradient transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="flex items-center gap-1 text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity">
          Start learning <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </Link>
    </motion.div>
  );
}
