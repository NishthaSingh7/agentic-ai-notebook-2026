import type { Phase } from "@/data/roadmap";

export function getMotivation(progressPercent: number) {
  if (progressPercent === 0) {
    return { headline: "Ready to begin?", sub: "One module today is all it takes to start." };
  }
  if (progressPercent < 15) {
    return { headline: "Momentum started", sub: "You're on the board — keep going." };
  }
  if (progressPercent < 40) {
    return { headline: "Building foundations", sub: "Every module compounds into real skill." };
  }
  if (progressPercent < 70) {
    return { headline: "Solid progress", sub: "You're past the hardest part — the start." };
  }
  if (progressPercent < 100) {
    return { headline: "Closing in", sub: "The finish line is in sight. Don't stop now." };
  }
  return { headline: "Roadmap complete", sub: "You checked every module. Legend." };
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
