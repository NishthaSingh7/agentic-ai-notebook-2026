import { earlyLessons } from "./spoken/early";
import { middleLessons } from "./spoken/middle";
import { laterLessons } from "./spoken/later";
import { restLessons } from "./spoken/rest";
import type { SpokenLesson } from "./spoken-types";
import { getModule, getPhaseBySlug, phases, type Phase } from "./roadmap";

const lessons: Record<string, SpokenLesson> = {
  ...earlyLessons,
  ...middleLessons,
  ...laterLessons,
  ...restLessons,
};

export function lessonKey(phaseSlug: string, moduleSlug: string) {
  return `${phaseSlug}/${moduleSlug}`;
}

export function getSpokenLesson(phaseSlug: string, moduleSlug: string): SpokenLesson | null {
  return lessons[lessonKey(phaseSlug, moduleSlug)] ?? null;
}

export function estimateSpokenMinutes(lesson: SpokenLesson): number {
  const text = [
    lesson.story,
    lesson.plain,
    lesson.example,
    lesson.tryThis,
    lesson.remember,
    lesson.pictureCaption,
    ...lesson.tools.map((item) => `${item.line} ${item.open} ${item.stop}`),
    lesson.oneFunction?.why ?? "",
  ].join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 180));
}

export interface NextCard {
  href: string;
  title: string;
  question: string;
  kicker: string;
}

export function getNextCard(phase: Phase, moduleSlug: string): NextCard | null {
  const index = phase.modules.findIndex((mod) => mod.slug === moduleSlug);
  if (index === -1) return null;
  const nextModule = phase.modules[index + 1];
  if (nextModule) {
    return {
      href: `/roadmap/${phase.slug}/${nextModule.slug}`,
      title: nextModule.title,
      question: nextModule.question,
      kicker: "Next",
    };
  }
  const phaseIndex = phases.findIndex((item) => item.slug === phase.slug);
  const nextPhase = phases[phaseIndex + 1];
  if (!nextPhase) return null;
  const first = nextPhase.modules[0];
  return {
    href: `/roadmap/${nextPhase.slug}/${first.slug}`,
    title: nextPhase.title,
    question: first.question,
    kicker: nextPhase.optional ? "If you want it" : "Next chapter",
  };
}

export function listMissingLessons(): string[] {
  const missing: string[] = [];
  for (const phase of phases) {
    for (const mod of phase.modules) {
      if (!getSpokenLesson(phase.slug, mod.slug)) {
        missing.push(lessonKey(phase.slug, mod.slug));
      }
    }
  }
  return missing;
}

export function getModuleOrNull(phaseSlug: string, moduleSlug: string) {
  return getModule(phaseSlug, moduleSlug) && getPhaseBySlug(phaseSlug)
    ? { phase: getPhaseBySlug(phaseSlug)!, module: getModule(phaseSlug, moduleSlug)! }
    : null;
}
