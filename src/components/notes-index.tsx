import Link from "next/link";
import { notes } from "@/data/notes";

export function NotesIndex() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold">Notes</h1>
      <p className="mt-3 text-base leading-relaxed text-text-secondary">
        Topics that have already been studied, written up as short study cards. Open any card.
        This is not the roadmap, and it is not a record of what you have finished.
      </p>
      <ul className="mt-10 space-y-4">
        {notes.map((note) => {
          const count = note.cards?.length ?? 0;
          return (
            <li key={note.slug}>
              <Link
                href={`/notes/${note.slug}`}
                className="card-press group block rounded-3xl border border-border bg-surface px-6 py-6 hover:border-accent/40 sm:px-8 sm:py-7"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-accent">{note.topic}</p>
                  {count > 0 ? (
                    <p className="text-xs text-text-muted">{count} study cards</p>
                  ) : null}
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight">{note.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {note.placeholder ? "A dummy card. The real note is not in yet." : note.summary}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
