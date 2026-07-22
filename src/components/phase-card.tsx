"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import type { Phase } from "@/data/roadmap";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/use-progress";

interface PhaseCardProps {
  phase: Phase;
  index: number;
}

export function PhaseCard({ phase, index }: PhaseCardProps) {
  const { getPhaseProgress } = useProgress();
  const progress = getPhaseProgress(phase.slug);

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
            <h3 className="text-lg font-semibold mt-1 group-hover:text-accent transition-colors">
              {phase.title}
            </h3>
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
