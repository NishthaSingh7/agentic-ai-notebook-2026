"use client";

import { useMemo, useState } from "react";
import { BookMarked, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import type { PhaseGlossaryTerm } from "@/data/agent-foundations-glossary";
import { cn } from "@/lib/utils";

interface PhaseGlossarySearchProps {
  title?: string;
  description?: string;
  terms: PhaseGlossaryTerm[];
  byCategory: Record<string, PhaseGlossaryTerm[]>;
  categories: string[];
  popularTerms?: string[];
  searchPlaceholder?: string;
  /** Compact sidebar layout — search-first, collapsed browse by default */
  variant?: "sidebar" | "inline";
}

const DEFAULT_POPULAR_TERMS = [
  "ReAct",
  "HITL",
  "MCP",
  "Playwright",
  "Snowflake",
  "Red Teaming",
  "OpenTelemetry",
  "Context Overflow",
];

function matchesQuery(term: PhaseGlossaryTerm, query: string): boolean {
  const q = query.toLowerCase();
  const haystack = [term.term, term.meaning, term.category, ...(term.aliases ?? [])]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function TermRow({
  term,
  compact,
}: {
  term: PhaseGlossaryTerm;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="rounded-md border border-border/80 bg-background/60 px-3 py-2">
        <p className="text-sm font-medium text-text-primary leading-snug">{term.term}</p>
        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed line-clamp-3">
          {term.meaning}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface-elevated/50 px-3 py-2.5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5">
        <h4 className="font-semibold text-sm text-text-primary">{term.term}</h4>
        <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
          {term.category}
        </span>
      </div>
      <p className="text-xs text-text-secondary leading-relaxed">{term.meaning}</p>
    </div>
  );
}

export function PhaseGlossarySearch({
  title = "Glossary",
  description,
  terms,
  byCategory,
  categories,
  popularTerms = DEFAULT_POPULAR_TERMS,
  searchPlaceholder = "ReAct, HITL, trajectory...",
  variant = "sidebar",
}: PhaseGlossarySearchProps) {
  const [query, setQuery] = useState("");
  const [browseOpen, setBrowseOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const isSidebar = variant === "sidebar";

  const filtered = useMemo(() => {
    const trimmed = query.trim();
    let list = terms;
    if (browseOpen && activeCategory !== "all") {
      list = list.filter((t) => t.category === activeCategory);
    }
    if (trimmed) {
      list = list.filter((t) => matchesQuery(t, trimmed));
    }
    return list;
  }, [query, terms, activeCategory, browseOpen]);

  const isSearching = query.trim().length > 0;
  const showResults = isSearching || browseOpen;

  const handlePopularClick = (termName: string) => {
    setQuery(termName);
    setBrowseOpen(false);
  };

  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-surface",
        isSidebar ? "p-4" : "p-5 sm:p-6"
      )}
    >
      <div className={cn("flex items-center gap-2", isSidebar ? "mb-3" : "mb-4")}>
        <div className="rounded-md bg-accent/10 p-1.5 shrink-0">
          <BookMarked className="h-4 w-4 text-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className={cn("font-semibold", isSidebar ? "text-sm" : "text-lg")}>{title}</h2>
          {!isSidebar && description && (
            <p className="text-sm text-text-secondary mt-0.5">{description}</p>
          )}
          <p className="text-[11px] text-text-muted mt-0.5">{terms.length} terms · search to look up</p>
        </div>
      </div>

      <div className="relative mb-2">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim()) setBrowseOpen(false);
          }}
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-border bg-background py-2 pl-8 pr-8 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent/40 transition-colors"
          aria-label="Search phase glossary"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-text-muted hover:text-text-secondary"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {!isSearching && (
        <div className="flex flex-wrap gap-1 mb-2">
          {popularTerms.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => handlePopularClick(name)}
              className="rounded-full bg-surface-elevated border border-border px-2 py-0.5 text-[10px] font-medium text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setBrowseOpen((o) => !o);
          if (!browseOpen) setQuery("");
        }}
        className="flex w-full items-center justify-between rounded-lg border border-border/80 bg-surface-elevated/40 px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-accent/25 transition-colors"
      >
        <span>{browseOpen ? "Hide full glossary" : "Browse all terms by category"}</span>
        {browseOpen ? (
          <ChevronUp className="h-3.5 w-3.5 shrink-0" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 shrink-0" />
        )}
      </button>

      {browseOpen && !isSearching && (
        <div className="flex flex-wrap gap-1 mt-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-medium border transition-colors",
              activeCategory === "all"
                ? "bg-accent/15 border-accent/30 text-accent"
                : "border-border text-text-muted hover:text-text-secondary"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium border transition-colors",
                activeCategory === cat
                  ? "bg-accent/15 border-accent/30 text-accent"
                  : "border-border text-text-muted hover:text-text-secondary"
              )}
            >
              {cat.replace(" & ", " ")}
            </button>
          ))}
        </div>
      )}

      {showResults && (
        <div className="mt-2">
          {filtered.length === 0 ? (
            <p className="text-xs text-text-muted py-3 text-center">No terms match.</p>
          ) : (
            <>
              <p className="text-[10px] text-text-muted mb-1.5">
                {filtered.length} result{filtered.length === 1 ? "" : "s"}
              </p>
              <div
                className={cn(
                  "space-y-1.5 overflow-y-auto pr-0.5",
                  isSidebar ? "max-h-52" : "max-h-64",
                  browseOpen && !isSearching && "max-h-72"
                )}
              >
                {isSearching || !browseOpen ? (
                  filtered.slice(0, isSidebar ? 12 : 20).map((term) => (
                    <TermRow key={term.term} term={term} compact={isSidebar} />
                  ))
                ) : (
                  categories.map((cat) => {
                    const catTerms =
                      activeCategory === "all"
                        ? byCategory[cat]
                        : activeCategory === cat
                          ? byCategory[cat]
                          : [];
                    if (catTerms.length === 0) return null;
                    return (
                      <div key={cat} className="mb-3 last:mb-0">
                        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-1">
                          {cat}
                        </h3>
                        <div className="space-y-1.5">
                          {catTerms.map((term) => (
                            <TermRow key={term.term} term={term} compact />
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {isSearching && filtered.length > (isSidebar ? 12 : 20) && (
                <p className="text-[10px] text-text-muted mt-1.5 text-center">
                  Refine search to narrow results
                </p>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
