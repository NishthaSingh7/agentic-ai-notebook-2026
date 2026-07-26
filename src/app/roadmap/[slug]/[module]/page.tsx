import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { phases, getPhaseBySlug, getModule } from "@/data/roadmap";
import { getLessonContent, getLessonReadTime } from "@/data/lessons";
import { CurriculumLessonView } from "@/components/curriculum-lesson-view";
import { isCodeWalkthroughPhase } from "@/lib/curriculum-phases";

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
  return { title: mod.title, description: `Learn ${mod.title} — lesson, code, and revision notes.` };
}

export default async function ModulePage({ params }: Props) {
  const { slug, module: moduleSlug } = await params;
  const phase = getPhaseBySlug(slug);
  const mod = getModule(slug, moduleSlug);
  if (!phase || !mod) notFound();

  const content = getLessonContent(slug, moduleSlug);
  if (!content) notFound();
  const readTime = getLessonReadTime(slug, moduleSlug);

  const moduleIndex = phase.modules.findIndex((m) => m.slug === moduleSlug);
  const prevMod = moduleIndex > 0 ? phase.modules[moduleIndex - 1] : null;
  const nextMod = moduleIndex < phase.modules.length - 1 ? phase.modules[moduleIndex + 1] : null;

  return (
    <CurriculumLessonView
      phase={phase}
      mod={mod}
      content={content}
      readTime={readTime}
      prevMod={prevMod}
      nextMod={nextMod}
      slug={slug}
      includeCode={isCodeWalkthroughPhase(slug)}
      showOrientationExtras
    />
  );
}
