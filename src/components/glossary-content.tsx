"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { GlossaryEntry } from "@/data/glossary";
import { cn } from "@/lib/utils";

interface GlossaryContentProps {
  entries: GlossaryEntry[];
  byLetter: Record<string, GlossaryEntry[]>;
}

function GlossaryCard({ entry }: { entry: GlossaryEntry }) {
  return (
    <article
      id={entry.slug}
      className="rounded-xl border border-border bg-surface p-6 scroll-mt-24"
    >
      <h3 className="text-lg font-semibold mb-3">{entry.term}</h3>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
            Simple Definition
          </h4>
          <p className="text-sm text-text-secondary">{entry.simpleDefinition}</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
            Technical Definition
          </h4>
          <p className="text-sm text-text-secondary">{entry.technicalDefinition}</p>
        </div>
      </div>

      <div className="rounded-lg border-l-2 border-accent bg-surface-elevated px-4 py-3 mb-4">
        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
          Analogy
        </h4>
        <p className="text-sm text-text-secondary italic">{entry.analogy}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
            Where It&apos;s Used
          </h4>
          <p className="text-sm text-text-secondary">{entry.whereUsed}</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
            Related Concepts
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {entry.relatedConcepts.map((concept) => (
              <span
                key={concept}
                className="rounded-full bg-surface-elevated border border-border px-2.5 py-0.5 text-xs text-text-secondary"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-accent/5 border border-accent/10 px-4 py-3">
        <h4 className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">
          Interview Tip
        </h4>
        <p className="text-sm text-text-secondary">{entry.interviewTip}</p>
      </div>
    </article>
  );
}

function matchesQuery(entry: GlossaryEntry, query: string): boolean {
  const q = query.toLowerCase();
  const haystack = [
    entry.term,
    entry.slug,
    entry.simpleDefinition,
    entry.technicalDefinition,
    entry.analogy,
    entry.whereUsed,
    entry.interviewTip,
    ...entry.relatedConcepts,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

export function GlossaryContent({ entries, byLetter }: GlossaryContentProps) {
  const [query, setQuery] = useState("");
  const letters = Object.keys(byLetter).sort();

  const filtered = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return null;
    return entries.filter((entry) => matchesQuery(entry, trimmed));
  }, [query, entries]);

  const isSearching = query.trim().length > 0;

  return (
    <>
      <div className="mb-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms, definitions, topics..."
            className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-10 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent/40 transition-colors"
            aria-label="Search glossary"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-text-muted hover:text-text-secondary transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {isSearching && (
          <p className="mt-2 text-sm text-text-muted">
            {filtered!.length === 0
              ? `No results for "${query.trim()}"`
              : `${filtered!.length} result${filtered!.length === 1 ? "" : "s"} for "${query.trim()}"`}
          </p>
        )}
      </div>

      {!isSearching && (
        <div className="flex flex-wrap gap-2 mb-10">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-sm font-medium hover:border-accent/30 hover:text-accent transition-colors"
            >
              {letter}
            </a>
          ))}
        </div>
      )}

      {isSearching ? (
        <div className="space-y-4">
          {filtered!.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
              <p className="text-text-secondary mb-1">No glossary entries found.</p>
              <p className="text-sm text-text-muted">Try a different keyword — e.g. RAG, agent, embedding, LoRA</p>
            </div>
          ) : (
            filtered!.map((entry) => <GlossaryCard key={entry.slug} entry={entry} />)
          )}
        </div>
      ) : (
        <div className="space-y-12">
          {letters.map((letter) => (
            <section key={letter} id={`letter-${letter}`}>
              <h2 className="text-2xl font-bold mb-6 text-accent">{letter}</h2>
              <div className="space-y-4">
                {byLetter[letter].map((entry) => (
                  <GlossaryCard key={entry.slug} entry={entry} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
