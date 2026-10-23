import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { StudyCard, TopicNote } from "@/data/notes";
import { DiagramPeek } from "@/components/diagram-peek";
import { LessonCodeBlock } from "@/components/lesson-code-block";
import { ModuleCompleteButton } from "@/components/module-complete-button";

interface StudyCardViewProps {
  note: TopicNote;
  card: StudyCard;
  index: number;
  total: number;
  prev: StudyCard | null;
  next: StudyCard | null;
}

export function StudyCardView({ note, card, index, total, prev, next }: StudyCardViewProps) {
  return (
    <article className="mx-auto w-full min-w-0 max-w-7xl px-4 py-10 sm:px-6">
      <Link
        href={`/notes/${note.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> {note.title}
      </Link>

      <header className="mb-8">
        <p className="text-xs text-text-muted">
          {card.part} · {index + 1} of {total}
        </p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">{card.title}</h1>
          <ModuleCompleteButton phaseSlug={`notes/${note.slug}`} moduleSlug={card.slug} moduleTitle={card.title} />
        </div>
        <p className="mt-2 text-sm text-text-muted">A short card. You can leave whenever.</p>
      </header>

      <section className="w-[45%] min-w-0 rounded-2xl bg-surface-elevated p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-text-primary">A picture to keep</h2>
        <DiagramPeek chart={card.picture} />
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">{card.pictureCaption}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-text-primary">Story</h2>
        <p className="mt-2 text-base leading-relaxed text-text-secondary">{card.story}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-text-primary">In plain words</h2>
        <p className="mt-2 text-base leading-relaxed text-text-secondary">{card.plain}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-text-primary">Example</h2>
        <p className="mt-2 text-base leading-relaxed text-text-secondary">{card.example}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-text-primary">Try this</h2>
        <p className="mt-2 text-base leading-relaxed text-text-secondary">{card.tryThis}</p>
      </section>

      {card.functions?.map((fn) => (
        <section key={fn.title} className="mt-8">
          <h2 className="text-sm font-semibold text-text-primary">{fn.title}</h2>
          <p className="mt-2 text-base leading-relaxed text-text-secondary">{fn.why}</p>
          <div className="mt-3 min-w-0">
            <LessonCodeBlock code={fn.code} language={fn.language} title={fn.title} />
          </div>
        </section>
      ))}

      <p className="mt-8 rounded-2xl bg-surface-elevated px-5 py-4 text-base leading-relaxed text-text-primary">
        {card.remember}
      </p>

      <nav className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-stretch sm:justify-between">
        {prev ? (
          <Link href={`/notes/${note.slug}/${prev.slug}`} className="text-sm text-text-secondary hover:text-accent">
            <ArrowLeft className="mr-1 inline h-3.5 w-3.5" />
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/notes/${note.slug}/${next.slug}`}
            className="card-press block rounded-2xl border border-border bg-surface p-4 sm:max-w-sm sm:text-right"
          >
            <p className="text-xs text-text-muted">Next</p>
            <p className="mt-1 font-semibold text-text-primary">{next.title}</p>
            <p className="mt-1 text-sm text-text-secondary">{next.lead}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-sm text-accent">
              Open it <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
