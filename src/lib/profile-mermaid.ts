import type { Phase } from "@/data/roadmap";

export function getMotivation(progressPercent: number) {
  if (progressPercent === 0) {
    return {
      headline: "Your engineering journey starts here",
      sub: "One module today is enough. Open a lesson, learn it, mark it done.",
    };
  }
  if (progressPercent < 15) {
    return {
      headline: "You're moving. That's the hard part.",
      sub: "Momentum is on. Keep stacking modules — they compound.",
    };
  }
  if (progressPercent < 40) {
    return {
      headline: "Foundations are forming",
      sub: "This is how production engineers are built — one concept at a time.",
    };
  }
  if (progressPercent < 70) {
    return {
      headline: "You're past the hardest part: starting",
      sub: "The stack is getting real. Stay consistent and the rest follows.",
    };
  }
  if (progressPercent < 100) {
    return {
      headline: "The finish line is in sight",
      sub: "Don't stop now. The interesting problems are just ahead.",
    };
  }
  return {
    headline: "Roadmap complete. Legend.",
    sub: "You checked every core module. Now go build something that ships.",
  };
}

export function getCompletedPhaseCount(
  phases: Phase[],
  getPhaseProgress: (slug: string) => number
) {
  return phases.filter((phase) => !phase.optional && getPhaseProgress(phase.slug) === 100).length;
}

export function getMilestones(completedCount: number, progressPercent: number) {
  return [
    { id: "first", label: "First module", unlocked: completedCount >= 1 },
    { id: "ten", label: "10 modules", unlocked: completedCount >= 10 },
    { id: "quarter", label: "25% of the roadmap", unlocked: progressPercent >= 25 },
    { id: "half", label: "Halfway", unlocked: progressPercent >= 50 },
    { id: "stretch", label: "75% there", unlocked: progressPercent >= 75 },
    { id: "done", label: "Roadmap complete", unlocked: progressPercent >= 100 },
  ];
}

/** First phase that isn't 100% complete — where "Up next" points */
export function getFocusPhase(
  phases: Phase[],
  getPhaseProgress: (slug: string) => number
) {
  const incomplete = phases.find((p) => getPhaseProgress(p.slug) < 100);
  return incomplete ?? phases[phases.length - 1];
}

export function getNextModule(phase: Phase, completed: Set<string>) {
  return phase.modules.find((m) => !completed.has(`${phase.slug}/${m.slug}`)) ?? null;
}
