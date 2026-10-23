import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getModule, getPhaseBySlug, legacyPhaseRedirects, phases } from "@/data/roadmap";
import { estimateSpokenMinutes, getNextCard, getSpokenLesson } from "@/data/spoken-lessons";
import { SpokenLessonView } from "@/components/spoken-lesson-view";

interface Props {
  params: Promise<{ slug: string; module: string }>;
}

export async function generateStaticParams() {
  return phases.flatMap((phase) =>
    phase.modules.map((mod) => ({
      slug: phase.slug,
      module: mod.slug,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, module: moduleSlug } = await params;
  const mod = getModule(slug, moduleSlug);
  if (!mod) return { title: "Not Found" };
  return { title: mod.title, description: mod.question };
}

export default async function ModulePage({ params }: Props) {
  const { slug, module: moduleSlug } = await params;
  const legacy = legacyPhaseRedirects[slug];
  if (legacy) redirect(legacy);

  const phase = getPhaseBySlug(slug);
  const mod = getModule(slug, moduleSlug);
  if (!phase || !mod) notFound();

  const lesson = getSpokenLesson(slug, moduleSlug);
  if (!lesson) notFound();

  const moduleIndex = phase.modules.findIndex((item) => item.slug === moduleSlug);
  const prev = moduleIndex > 0 ? phase.modules[moduleIndex - 1] : null;

  return (
    <SpokenLessonView
      phase={phase}
      mod={mod}
      lesson={lesson}
      minutes={estimateSpokenMinutes(lesson)}
      nextCard={getNextCard(phase, moduleSlug)}
      prevHref={prev ? `/roadmap/${phase.slug}/${prev.slug}` : null}
      prevTitle={prev?.title ?? null}
    />
  );
}
