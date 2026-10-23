"use client";

import Link from "next/link";
import type { TopicNote } from "@/data/notes";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";

export function NoteTopic({ note }: { note: TopicNote }) {
  const cards = note.cards ?? [];
  const { isCompleted, toggleModule } = useProgress();
  const parts: { name: string; cards: { slug: string; title: string; lead: string; number: number }[] }[] = [];

  cards.forEach((card, index) => {
    const item = { slug: card.slug, title: card.title, lead: card.lead, number: index + 1 };
    const last = parts[parts.length - 1];
    if (!last || last.name !== card.part) parts.push({ name: card.part, cards: [item] });
    else last.cards.push(item);
  });

  return (
    <div className="mx-auto w-full min-w-0 max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/notes" className="text-sm text-text-muted hover:text-text-secondary">
        Notes
      </Link>
      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-accent">{note.topic}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{note.title}</h1>
      <p className="mt-3 text-base leading-relaxed text-text-secondary">{note.summary}</p>
      {note.link ? (
        <p className="mt-4 text-sm text-text-muted">
          <a href={note.link.url} className="text-accent hover:underline" target="_blank" rel="noreferrer">
            {note.link.name}
          </a>
          <span> · {note.link.open}</span>
        </p>
      ) : null}

      <div className="mt-12 space-y-12">
        {parts.map((part) => (
          <section key={part.name}>
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <h2 className="text-base font-semibold">{part.name}</h2>
              <p className="text-xs text-text-muted">{part.cards.length}</p>
            </div>
            <ol className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface">
              {part.cards.map((card) => {
                const done = isCompleted(`notes/${note.slug}`, card.slug);
                return (
                  <li key={card.slug} className="flex items-start gap-2 px-3 py-3 sm:px-4">
                    <button
                      type="button"
                      onClick={() => toggleModule(`notes/${note.slug}`, card.slug, card.title)}
                      className={cn(
                        "mt-1 h-5 w-5 shrink-0 rounded-full border text-[10px]",
                        done ? "border-success bg-success text-on-accent" : "border-border text-transparent"
                      )}
                      aria-label={done ? `Mark ${card.title} as not complete` : `Mark ${card.title} complete`}
                    >
                      ✓
                    </button>
                    <Link href={`/notes/${note.slug}/${card.slug}`} className="row-press flex min-w-0 flex-1 gap-4">
                      <span className="w-8 shrink-0 pt-0.5 text-sm tabular-nums text-accent">
                        {String(card.number).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium text-text-primary">{card.title}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-text-secondary">{card.lead}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
