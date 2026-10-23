import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAdjacentPhase, getPhaseBySlug, legacyPhaseRedirects, phases } from "@/data/roadmap";
import { ModuleList } from "@/components/module-list";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return phases.map((phase) => ({ slug: phase.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const phase = getPhaseBySlug(slug);
  if (!phase) return { title: "Not Found" };
  return { title: phase.title, description: phase.description };
}

export default async function PhasePage({ params }: Props) {
  const { slug } = await params;
  const legacy = legacyPhaseRedirects[slug];
  if (legacy) redirect(legacy);

  const phase = getPhaseBySlug(slug);
  if (!phase) notFound();

  const prevPhase = getAdjacentPhase(slug, "prev");
  const nextPhase = getAdjacentPhase(slug, "next");

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-12 sm:px-6">
      <Link
        href="/roadmap"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to the roadmap
      </Link>

      <div className={`rounded-3xl p-6 sm:p-8 ${phase.color}`}>
        <p className="text-xs text-text-muted">{phase.subtitle}</p>
        <h1 className="mt-1 text-3xl font-semibold text-text-primary">{phase.title}</h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-text-secondary">{phase.description}</p>
        {phase.optional ? (
          <p className="mt-3 text-sm text-text-muted">This shelf is optional. The main path does not wait on it.</p>
        ) : null}
      </div>

      <h2 className="mt-10 text-lg font-semibold">What is inside</h2>
      <p className="mt-1 text-sm text-text-secondary">Open any of these. The order is a good way through, not a lock.</p>
      <div className="mt-4">
        <ModuleList phaseSlug={phase.slug} modules={phase.modules} />
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
        {prevPhase ? (
          <Link href={`/roadmap/${prevPhase.slug}`} className="text-sm text-text-secondary hover:text-accent">
            <ArrowLeft className="mr-1 inline h-3.5 w-3.5" />
            {prevPhase.title}
          </Link>
        ) : (
          <span />
        )}
        {nextPhase ? (
          <Link href={`/roadmap/${nextPhase.slug}`} className="text-sm text-accent">
            {nextPhase.title}
            <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
