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
import { pushLocalHighlightsToRemote } from "@/lib/highlight-remote";
import {
  applyLessonHighlights,
  createHighlightId,
  DEFAULT_HIGHLIGHT_COLOR,
  HIGHLIGHT_COLORS,
  HIGHLIGHTS_UPDATED_EVENT,
  highlightKey,
  normalizeHighlightText,
  persistModuleHighlights,
  readHighlightsMeta,
  readLocalHighlights,
  unwrapLessonHighlights,
  writeHighlightsMeta,
  writeLocalHighlights,
  type HighlightColor,
  type ModuleHighlight,
} from "@/lib/lesson-highlights";

const COLOR_SWATCHES: Record<HighlightColor, string> = {
  yellow: "bg-[#fde68a] border-[#f59e0b]",
  green: "bg-[#bbf7d0] border-[#4ade80]",
  orange: "bg-[#fed7aa] border-[#fb923c]",
  blue: "bg-[#bfdbfe] border-[#60a5fa]",
  red: "bg-[#fecaca] border-[#f87171]",
};

interface HighlightContextValue {
  enabled: boolean;
  editing: boolean;
  highlights: ModuleHighlight[];
  selectedColor: HighlightColor;
  isSaving: boolean;
  justSaved: boolean;
  savedToAccount: boolean;
  isAuthenticated: boolean;
  setEditing: (value: boolean) => void;
  setSelectedColor: (color: HighlightColor) => void;
  save: () => Promise<void>;
  cancel: () => void;
}

const HighlightContext = createContext<HighlightContextValue | null>(null);

function useHighlightContext() {
  return useContext(HighlightContext);
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
  const [savedToAccount, setSavedToAccount] = useState(false);
  const [selectedColor, setSelectedColor] = useState<HighlightColor>(DEFAULT_HIGHLIGHT_COLOR);
  const editingRef = useRef(false);
  const metaBeforeEditRef = useRef(readHighlightsMeta());

  const loadLocal = useCallback(() => {
    const local = readLocalHighlights()[key] ?? [];
    setHighlights(local);
    setBaseline(local);
  }, [key]);

  useEffect(() => {
    editingRef.current = editing;
  }, [editing]);

  useEffect(() => {
    if (!enabled) return;
    loadLocal();
    const onUpdated = () => {
      if (editingRef.current) return;
      loadLocal();
    };
    window.addEventListener(HIGHLIGHTS_UPDATED_EVENT, onUpdated);
    return () => window.removeEventListener(HIGHLIGHTS_UPDATED_EVENT, onUpdated);
  }, [enabled, loadLocal]);

  const persistLocal = useCallback(
    (next: ModuleHighlight[]) => {
      persistModuleHighlights(phaseSlug, moduleSlug, next);
    },
    [moduleSlug, phaseSlug]
  );

  const beginEdit = useCallback(() => {
    metaBeforeEditRef.current = readHighlightsMeta();
    setBaseline(highlights);
    setEditing(true);
  }, [highlights]);

  const save = useCallback(async () => {
    persistLocal(highlights);
    setIsSaving(true);
    try {
      let uploaded = false;
      if (status === "authenticated") {
        uploaded = await pushLocalHighlightsToRemote();
      }
      setBaseline(highlights);
      setEditing(false);
      setSavedToAccount(uploaded);
      setJustSaved(true);
    } finally {
      setIsSaving(false);
    }
  }, [highlights, persistLocal, status]);

  const cancel = useCallback(() => {
    setHighlights(baseline);
    writeLocalHighlights({ ...readLocalHighlights(), [key]: baseline });
    writeHighlightsMeta(metaBeforeEditRef.current);
    setEditing(false);
  }, [baseline, key]);

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
      selectedColor,
      isSaving,
      justSaved,
      savedToAccount,
      isAuthenticated: status === "authenticated",
      setEditing: (value: boolean) => {
        if (value) beginEdit();
        else setEditing(false);
      },
      setSelectedColor,
      save,
      cancel,
    }),
    [
      beginEdit,
      cancel,
      editing,
      enabled,
      highlights,
      isSaving,
      justSaved,
      save,
      savedToAccount,
      selectedColor,
      status,
    ]
  );

  const addHighlight = useCallback(
    (text: string, color: HighlightColor) => {
      const normalized = normalizeHighlightText(text);
      if (normalized.length < 3) return;
      setHighlights((prev) => {
        const next = prev.some((item) => item.text === normalized)
          ? prev.map((item) => (item.text === normalized ? { ...item, color } : item))
          : [...prev, { id: createHighlightId(), text: normalized, color }];
        persistLocal(next);
        return next;
      });
    },
    [persistLocal]
  );

  const removeHighlight = useCallback(
    (id: string) => {
      setHighlights((prev) => {
        const next = prev.filter((item) => item.id !== id);
        persistLocal(next);
        return next;
      });
    },
    [persistLocal]
  );

  return (
    <HighlightContext.Provider value={value}>
      <HighlightActionsContext.Provider value={{ addHighlight, removeHighlight, selectedColor }}>
        {children}
      </HighlightActionsContext.Provider>
    </HighlightContext.Provider>
  );
}

const HighlightActionsContext = createContext<{
  addHighlight: (text: string, color: HighlightColor) => void;
  removeHighlight: (id: string) => void;
  selectedColor: HighlightColor;
} | null>(null);

function ColorPicker({
  value,
  onChange,
  size = "md",
}: {
  value: HighlightColor;
  onChange: (color: HighlightColor) => void;
  size?: "md" | "lg";
}) {
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Highlight color">
      {HIGHLIGHT_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          role="radio"
          aria-checked={value === color}
          aria-label={color}
          title={color}
          onClick={() => onChange(color)}
          className={cn(
            "rounded-full border-2 transition-transform",
            size === "lg" ? "h-8 w-8" : "h-6 w-6",
            COLOR_SWATCHES[color],
            value === color ? "scale-110 ring-2 ring-offset-2 ring-text-primary/40" : "opacity-80 hover:opacity-100"
          )}
        />
      ))}
    </div>
  );
}

export function HighlightToolbar() {
  const ctx = useHighlightContext();
  const pathname = usePathname();
  if (!ctx?.enabled) return null;

  const {
    editing,
    highlights,
    isSaving,
    justSaved,
    savedToAccount,
    isAuthenticated,
    setEditing,
    save,
    cancel,
  } = ctx;

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
          {savedToAccount
            ? "Saved to your account"
            : isAuthenticated
              ? "Saved on this device · will sync at night"
              : "Saved on this device"}
        </span>
      )}

      {(editing || justSaved) && !isAuthenticated && (
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
          className="text-xs text-text-muted hover:text-accent"
        >
          Sign in to sync highlights at night
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

  const captureSelection = useCallback(() => {
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
    actions.addHighlight(text, actions.selectedColor);
    selection.removeAllRanges();
  }, [actions, editing]);

  const handlePointerUp = useCallback(() => {
    captureSelection();
  }, [captureSelection]);

  const handleTouchEnd = useCallback(() => {
    window.setTimeout(captureSelection, 80);
  }, [captureSelection]);

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
    <div className={cn("space-y-6", editing && "pb-20")}>
      {editing && (
        <div className="not-prose flex items-start gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-text-secondary">
          <Highlighter className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" />
          <p>
            Pick a color from the bar at the bottom, then select text. Click a highlight to remove it.
            Tap Save to store them on your account. If you skip Save, they stay on this device and sync at night.
          </p>
        </div>
      )}
      <div
        ref={rootRef}
        onPointerUp={handlePointerUp}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        className={cn(editing && "highlight-canvas-editing")}
      >
        {children}
      </div>
      {editing && ctx && (
        <div
          data-no-highlight
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 not-prose flex items-center gap-3 rounded-full border border-border bg-surface/95 px-4 py-2.5 shadow-lg backdrop-blur-sm"
        >
          <span className="hidden text-xs font-medium text-text-muted sm:inline">Color</span>
          <ColorPicker size="lg" value={ctx.selectedColor} onChange={ctx.setSelectedColor} />
        </div>
      )}
    </div>
  );
}
