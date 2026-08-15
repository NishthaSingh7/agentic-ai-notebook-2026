"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check, Highlighter, Loader2, Pencil, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  applyLessonHighlights,
  createHighlightId,
  highlightKey,
  mergeHighlights,
  normalizeHighlightText,
  readLocalHighlights,
  unwrapLessonHighlights,
  writeLocalHighlights,
  type ModuleHighlight,
} from "@/lib/lesson-highlights";

interface HighlightContextValue {
  enabled: boolean;
  editing: boolean;
  highlights: ModuleHighlight[];
  isSaving: boolean;
  justSaved: boolean;
  isAuthenticated: boolean;
  setEditing: (value: boolean) => void;
  save: () => Promise<void>;
  cancel: () => void;
}

const HighlightContext = createContext<HighlightContextValue | null>(null);

function useHighlightContext() {
  return useContext(HighlightContext);
}

async function fetchRemoteHighlights(
  phaseSlug: string,
  moduleSlug: string
): Promise<ModuleHighlight[] | null> {
  const params = new URLSearchParams({ phaseSlug, moduleSlug });
  const response = await fetch(`/api/highlights?${params.toString()}`);
  if (response.status === 401) return null;
  if (!response.ok) return [];
  const data = (await response.json()) as { highlights?: unknown };
  return Array.isArray(data.highlights) ? (data.highlights as ModuleHighlight[]) : [];
}

async function saveRemoteHighlights(
  phaseSlug: string,
  moduleSlug: string,
  highlights: ModuleHighlight[]
): Promise<boolean> {
  const response = await fetch("/api/highlights", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phaseSlug, moduleSlug, highlights }),
  });
  return response.ok;
}

export function LessonHighlightShell({
  enabled,
  phaseSlug,
  moduleSlug,
  children,
}: {
  enabled: boolean;
  phaseSlug: string;
  moduleSlug: string;
  children: ReactNode;
}) {
  const { status } = useSession();
  const key = highlightKey(phaseSlug, moduleSlug);
  const [highlights, setHighlights] = useState<ModuleHighlight[]>([]);
  const [baseline, setBaseline] = useState<ModuleHighlight[]>([]);
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    async function load() {
      const localMap = readLocalHighlights();
      const local = localMap[key] ?? [];
      if (!cancelled) {
        setHighlights(local);
        setBaseline(local);
      }

      if (status !== "authenticated") return;

      const remote = await fetchRemoteHighlights(phaseSlug, moduleSlug);
      if (cancelled || remote === null) return;

      const merged = mergeHighlights(remote, local);
      setHighlights(merged);
      setBaseline(merged);
      writeLocalHighlights({ ...readLocalHighlights(), [key]: merged });

      if (merged.length !== remote.length) {
        await saveRemoteHighlights(phaseSlug, moduleSlug, merged);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [enabled, key, moduleSlug, phaseSlug, status]);

  const persistLocal = useCallback(
    (next: ModuleHighlight[]) => {
      writeLocalHighlights({ ...readLocalHighlights(), [key]: next });
    },
    [key]
  );

  const save = useCallback(async () => {
    persistLocal(highlights);
    setIsSaving(true);
    try {
      if (status === "authenticated") {
        await saveRemoteHighlights(phaseSlug, moduleSlug, highlights);
      }
      setBaseline(highlights);
      setEditing(false);
      setJustSaved(true);
    } finally {
      setIsSaving(false);
    }
  }, [highlights, moduleSlug, persistLocal, phaseSlug, status]);

  const cancel = useCallback(() => {
    setHighlights(baseline);
    setEditing(false);
  }, [baseline]);

  useEffect(() => {
    if (!justSaved) return;
    const timer = window.setTimeout(() => setJustSaved(false), 2500);
    return () => window.clearTimeout(timer);
  }, [justSaved]);

  const value = useMemo<HighlightContextValue>(
    () => ({
      enabled,
      editing,
      highlights,
      isSaving,
      justSaved,
      isAuthenticated: status === "authenticated",
      setEditing,
      save,
      cancel,
    }),
    [cancel, editing, enabled, highlights, isSaving, justSaved, save, status]
  );

  const addHighlight = useCallback(
    (text: string) => {
      const normalized = normalizeHighlightText(text);
      if (normalized.length < 3) return;
      setHighlights((prev) => {
        if (prev.some((item) => item.text === normalized)) return prev;
        return [...prev, { id: createHighlightId(), text: normalized }];
      });
    },
    []
  );

  const removeHighlight = useCallback((id: string) => {
    setHighlights((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <HighlightContext.Provider value={value}>
      <HighlightActionsContext.Provider value={{ addHighlight, removeHighlight }}>
        {children}
      </HighlightActionsContext.Provider>
    </HighlightContext.Provider>
  );
}

const HighlightActionsContext = createContext<{
  addHighlight: (text: string) => void;
  removeHighlight: (id: string) => void;
} | null>(null);

export function HighlightToolbar() {
  const ctx = useHighlightContext();
  const pathname = usePathname();
  if (!ctx?.enabled) return null;

  const { editing, highlights, isSaving, justSaved, isAuthenticated, setEditing, save, cancel } =
    ctx;

  return (
    <div className="flex flex-wrap items-center gap-2" data-no-highlight>
      <button
        type="button"
        onClick={() => setEditing(true)}
        disabled={editing}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          editing
            ? "border-amber-400/50 bg-amber-400/15 text-amber-800 dark:text-amber-200"
            : "border-border bg-surface text-text-secondary hover:border-accent/40 hover:text-accent"
        )}
      >
        <Pencil className="h-4 w-4" />
        Edit
        {highlights.length > 0 && (
          <span className="rounded-full bg-amber-400/20 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
            {highlights.length}
          </span>
        )}
      </button>
      <button
        type="button"
        onClick={() => void save()}
        disabled={isSaving}
        className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/15 disabled:opacity-60"
      >
        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save
      </button>
      {editing && (
        <button
          type="button"
          onClick={cancel}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary hover:border-accent/40 hover:text-accent disabled:opacity-60"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
      )}

      {justSaved && (
        <span className="inline-flex items-center gap-1 text-xs text-success">
          <Check className="h-3.5 w-3.5" />
          {isAuthenticated ? "Saved" : "Saved on this device"}
        </span>
      )}

      {(editing || justSaved) && !isAuthenticated && (
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
          className="text-xs text-text-muted hover:text-accent"
        >
          Sign in to sync highlights
        </Link>
      )}
    </div>
  );
}

export function HighlightCanvas({ children }: { children: ReactNode }) {
  const ctx = useHighlightContext();
  const actions = useContext(HighlightActionsContext);
  const rootRef = useRef<HTMLDivElement>(null);
  const editing = ctx?.editing ?? false;
  const highlights = ctx?.highlights ?? [];

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !ctx?.enabled) return;
    applyLessonHighlights(root, highlights);
    return () => unwrapLessonHighlights(root);
  }, [ctx?.enabled, highlights]);

  const handleMouseUp = useCallback(() => {
    if (!editing || !actions) return;
    const root = rootRef.current;
    const selection = window.getSelection();
    if (!root || !selection || selection.isCollapsed) return;
    if (!selection.anchorNode || !root.contains(selection.anchorNode)) return;
    const anchorEl =
      selection.anchorNode instanceof Element
        ? selection.anchorNode
        : selection.anchorNode.parentElement;
    if (anchorEl?.closest("button, a, nav, pre, code, svg, [data-no-highlight]")) return;
    const text = normalizeHighlightText(selection.toString());
    if (text.length < 3) return;
    actions.addHighlight(text);
    selection.removeAllRanges();
  }, [actions, editing]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!editing || !actions) return;
      const target = (event.target as HTMLElement | null)?.closest("mark.lesson-highlight");
      if (!target) return;
      const id = target.getAttribute("data-highlight-id");
      if (!id) return;
      event.preventDefault();
      actions.removeHighlight(id);
    },
    [actions, editing]
  );

  if (!ctx?.enabled) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-6">
      {editing && (
        <div className="not-prose flex items-start gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-text-secondary">
          <Highlighter className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" />
          <p>
            Select any sentence to highlight it. Click a highlight to remove it, then press{" "}
            <strong>Save</strong> so it stays on this module next time.
          </p>
        </div>
      )}
      <div
        ref={rootRef}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        className={cn(editing && "highlight-canvas-editing")}
      >
        {children}
      </div>
    </div>
  );
}
