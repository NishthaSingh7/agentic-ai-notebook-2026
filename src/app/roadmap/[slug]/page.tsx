import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, FolderKanban } from "lucide-react";
import { getPhaseBySlug, phases } from "@/data/roadmap";
import { hasLessonContent, getLessonReadTime } from "@/data/lessons";
import { ModuleList } from "@/components/module-list";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return phases.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const phase = getPhaseBySlug(slug);
  if (!phase) return { title: "Not Found" };
  return {
    title: `${phase.title} — ${phase.subtitle}`,
    description: phase.description,
  };
}

export default async function PhasePage({ params }: Props) {
  const { slug } = await params;
  const phase = getPhaseBySlug(slug);
  if (!phase) notFound();

  const prevPhase = phases.find((p) => p.id === phase.id - 1);
  const nextPhase = phases.find((p) => p.id === phase.id + 1);

  const modules = phase.modules.map((mod) => ({
    slug: mod.slug,
    title: mod.title,
    hasContent: hasLessonContent(phase.slug, mod.slug),
    readTime: getLessonReadTime(phase.slug, mod.slug),
    status: mod.status,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Link
        href="/roadmap"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary mb-6 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Roadmap
      </Link>

      <div className="mb-8">
        <span className="text-xs font-mono text-accent">{phase.subtitle}</span>
        <h1 className="text-3xl font-bold mt-1 mb-3">{phase.title}</h1>
        <p className="text-text-secondary max-w-2xl leading-relaxed">{phase.description}</p>

        <div className="flex flex-wrap gap-4 mt-4 text-sm text-text-muted">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" /> {phase.modules.length} modules
          </span>
        </div>
        <p className="text-xs text-text-muted mt-2">
          Study time is shown per module only when full lesson content is available.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Modules</h2>
          <ModuleList phaseSlug={phase.slug} modules={modules} />
        </div>

        <div className="space-y-6">
          {phase.projects && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
                <FolderKanban className="h-4 w-4 text-accent" />
                Projects
              </h3>
              <ul className="space-y-2">
                {phase.projects.map((project) => (
                  <li key={project} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-accent mt-0.5">→</span>
                    {project}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-sm font-semibold mb-3">Navigation</h3>
            <div className="space-y-2">
              {prevPhase && (
                <Link
                  href={`/roadmap/${prevPhase.slug}`}
                  className="block text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  ← {prevPhase.title}
                </Link>
              )}
              {nextPhase && (
                <Link
                  href={`/roadmap/${nextPhase.slug}`}
                  className="block text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  {nextPhase.title} →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
