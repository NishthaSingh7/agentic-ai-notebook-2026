import Link from "next/link";
import type { TopicNote } from "@/data/notes";
import { ModuleCompleteButton } from "@/components/module-complete-button";

export function NoteView({ note }: { note: TopicNote }) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link href="/notes" className="text-sm text-text-muted hover:text-text-secondary">
        Notes
      </Link>
      <p className="mt-6 text-xs text-text-muted">{note.topic}</p>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-3xl font-semibold">{note.title}</h1>
        <ModuleCompleteButton phaseSlug={`notes/${note.slug}`} moduleSlug="note" moduleTitle={note.title} />
      </div>
      {note.placeholder ? (
        <p className="mt-6 rounded-2xl bg-surface-elevated p-5 leading-relaxed text-text-primary">
          This card is only holding the spot. A real topic note will replace it. The roadmap is still where you learn a topic in order.
        </p>
      ) : (
        <>
          <p className="mt-4 rounded-2xl bg-surface-elevated p-4 text-sm leading-relaxed text-text-primary">
            A note from a topic already studied. The roadmap is where that topic is taught in order.
          </p>
          {note.confused ? (
            <section className="mt-8">
              <h2 className="text-sm font-semibold">What was confusing</h2>
              <p className="mt-2 leading-relaxed text-text-secondary">{note.confused}</p>
            </section>
          ) : null}
          {note.story ? (
            <section className="mt-8">
              <h2 className="text-sm font-semibold">The story</h2>
              <p className="mt-2 leading-relaxed text-text-secondary">{note.story}</p>
            </section>
          ) : null}
          {note.link ? (
            <section className="mt-8">
              <h2 className="text-sm font-semibold">The link</h2>
              <a href={note.link.url} className="mt-2 inline-block text-accent hover:underline" target="_blank" rel="noreferrer">
                {note.link.name}
              </a>
              <p className="mt-1 text-sm text-text-secondary">Open: {note.link.open}</p>
            </section>
          ) : null}
          {note.use ? (
            <section className="mt-8">
              <h2 className="text-sm font-semibold">How to use it</h2>
              <p className="mt-2 leading-relaxed text-text-secondary">{note.use}</p>
            </section>
          ) : null}
        </>
      )}
    </article>
  );
}
