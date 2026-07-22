"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, Map, FolderKanban, BookMarked, MessageSquare } from "lucide-react";
import { phases } from "@/data/roadmap";
import { glossary } from "@/data/glossary";
import { projects } from "@/data/projects";
import { interviewTopics } from "@/data/interview";
import { cn } from "@/lib/utils";

interface SearchResult {
  title: string;
  description: string;
  href: string;
  type: "module" | "glossary" | "project" | "interview" | "phase";
  icon: typeof BookOpen;
}

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const allResults = useMemo<SearchResult[]>(() => {
    const results: SearchResult[] = [];

    phases.forEach((phase) => {
      results.push({
        title: phase.title,
        description: phase.description,
        href: `/roadmap/${phase.slug}`,
        type: "phase",
        icon: Map,
      });
      phase.modules.forEach((mod) => {
        results.push({
          title: mod.title,
          description: `${phase.title} — ${phase.subtitle}`,
          href: `/roadmap/${phase.slug}/${mod.slug}`,
          type: "module",
          icon: BookOpen,
        });
      });
    });

    glossary.forEach((entry) => {
      results.push({
        title: entry.term,
        description: entry.simpleDefinition,
        href: `/glossary#${entry.slug}`,
        type: "glossary",
        icon: BookMarked,
      });
    });

    projects.forEach((project) => {
      results.push({
        title: project.title,
        description: project.description,
        href: `/projects/${project.slug}`,
        type: "project",
        icon: FolderKanban,
      });
    });

    interviewTopics.forEach((topic) => {
      results.push({
        title: topic.title,
        description: `${topic.questionCount} interview questions`,
        href: `/interview/${topic.slug}`,
        type: "interview",
        icon: MessageSquare,
      });
    });

    return results;
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allResults.slice(0, 8);
    const q = query.toLowerCase();
    return allResults
      .filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [query, allResults]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && filtered[selectedIndex]) {
        router.push(filtered[selectedIndex].href);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, filtered, selectedIndex, router, onClose]);

  if (!open) return null;

  const typeLabels: Record<SearchResult["type"], string> = {
    module: "Module",
    glossary: "Glossary",
    project: "Project",
    interview: "Interview",
    phase: "Phase",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 rounded-xl border border-border bg-surface-elevated shadow-2xl glow overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 text-text-muted shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules, glossary, projects..."
            className="flex-1 bg-transparent py-3.5 text-sm text-text-primary placeholder:text-text-muted outline-none"
          />
          <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono text-text-muted">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-text-muted">No results found.</p>
          ) : (
            filtered.map((result, i) => (
              <button
                key={result.href + result.title}
                onClick={() => {
                  router.push(result.href);
                  onClose();
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  i === selectedIndex ? "bg-surface text-text-primary" : "text-text-secondary hover:bg-surface"
                )}
              >
                <result.icon className="h-4 w-4 shrink-0 text-text-muted" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{result.title}</div>
                  <div className="text-xs text-text-muted truncate">{result.description}</div>
                </div>
                <span className="shrink-0 rounded bg-surface px-2 py-0.5 text-[10px] text-text-muted">
                  {typeLabels[result.type]}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
