"use client";

import { useEffect, useState } from "react";
import { phases, totalModules } from "@/data/roadmap";

const STORAGE_KEY = "agentic-ai-progress";

export function useProgress() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCompleted(new Set(JSON.parse(stored)));
    } catch {
      // ignore
    }
  }, []);

  const toggleModule = (phaseSlug: string, moduleSlug: string) => {
    const key = `${phaseSlug}/${moduleSlug}`;
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const isCompleted = (phaseSlug: string, moduleSlug: string) =>
    completed.has(`${phaseSlug}/${moduleSlug}`);

  const progressPercent = Math.round((completed.size / totalModules) * 100);

  const getPhaseProgress = (phaseSlug: string) => {
    const phase = phases.find((p) => p.slug === phaseSlug);
    if (!phase) return 0;
    const done = phase.modules.filter((m) => completed.has(`${phaseSlug}/${m.slug}`)).length;
    return Math.round((done / phase.modules.length) * 100);
  };

  const remainingHours = phases.reduce((acc, phase) => {
    const done = phase.modules.filter((m) => completed.has(`${phase.slug}/${m.slug}`)).length;
    const remaining = phase.modules.length - done;
    const hoursPerModule = phase.estimatedHours / phase.modules.length;
    return acc + remaining * hoursPerModule;
  }, 0);

  return {
    completed,
    toggleModule,
    isCompleted,
    progressPercent,
    getPhaseProgress,
    completedCount: completed.size,
    totalModules,
    remainingHours: Math.round(remainingHours),
  };
}
