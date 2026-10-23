"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import {
  phases,
  totalModules,
  isOptionalModuleKey,
  getPhaseLessonHours,
} from "@/data/roadmap";
import { isChallengeKey } from "@/data/challenges";
import { playPop } from "@/lib/pop-sound";
import { CompleteBurst } from "@/components/complete-burst";
import {
  PROGRESS_MIGRATION_KEY,
  PROGRESS_NOON_SYNC_KEY,
  PROGRESS_STORAGE_KEY,
  isNoonSyncDue,
  localDateKey,
  msUntilFollowingNoon,
  sanitizeProgressKeys,
} from "@/lib/progress-keys";

const STORAGE_KEY = PROGRESS_STORAGE_KEY;

type ProgressContextValue = {
  completed: Set<string>;
  toggleModule: (phaseSlug: string, moduleSlug: string, moduleTitle?: string) => void;
  isCompleted: (phaseSlug: string, moduleSlug: string) => boolean;
  progressPercent: number;
  getPhaseProgress: (phaseSlug: string) => number;
  completedCount: number;
  totalModules: number;
  remainingHours: number;
  isAuthenticated: boolean;
  isSyncing: boolean;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function readLocalProgress(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();
    const parsed = JSON.parse(stored) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((item): item is string => typeof item === "string"));
  } catch {
    return new Set();
  }
}

function writeLocalProgress(completed: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
}

function readCleanLocalProgress(): string[] {
  const cleaned = sanitizeProgressKeys(readLocalProgress());
  writeLocalProgress(new Set(cleaned));
  return cleaned;
}

async function saveRemoteProgress(completed: string[]) {
  const response = await fetch("/api/progress", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  if (!response.ok) {
    throw new Error("Could not save progress");
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [isSyncing, setIsSyncing] = useState(false);
  const [burst, setBurst] = useState<{ id: number; title: string; detail: string } | null>(null);
  const dismissBurst = useCallback(() => setBurst(null), []);
  const syncingRef = useRef(false);

  useEffect(() => {
    setCompleted(new Set(readCleanLocalProgress()));
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;

    let cancelled = false;
    let timer = 0;

    async function pushLocalProgress() {
      if (cancelled || syncingRef.current) return;

      const needsMigration = localStorage.getItem(PROGRESS_MIGRATION_KEY) !== "1";
      const needsNoon = isNoonSyncDue(localStorage.getItem(PROGRESS_NOON_SYNC_KEY));
      if (!needsMigration && !needsNoon) return;

      const local = sanitizeProgressKeys(readLocalProgress());
      syncingRef.current = true;
      setIsSyncing(true);
      try {
        await saveRemoteProgress(local);
        if (needsMigration) localStorage.setItem(PROGRESS_MIGRATION_KEY, "1");
        if (needsNoon || isNoonSyncDue(localStorage.getItem(PROGRESS_NOON_SYNC_KEY))) {
          localStorage.setItem(PROGRESS_NOON_SYNC_KEY, localDateKey());
        }
      } catch {
        // Leave the flags unset so the next visit can try the same replace again.
      } finally {
        syncingRef.current = false;
        if (!cancelled) setIsSyncing(false);
      }
    }

    function scheduleNextNoon() {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        void pushLocalProgress().finally(() => {
          if (!cancelled) scheduleNextNoon();
        });
      }, msUntilFollowingNoon() + 1000);
    }

    function onVisible() {
      if (document.visibilityState === "visible") void pushLocalProgress();
    }

    void pushLocalProgress();
    scheduleNextNoon();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [status]);

  const countedCompleted = useMemo(
    () =>
      [...completed].filter((key) => !isOptionalModuleKey(key) && !isChallengeKey(key)).length,
    [completed]
  );

  const toggleModule = useCallback(
    (phaseSlug: string, moduleSlug: string, moduleTitle?: string) => {
      const key = `${phaseSlug}/${moduleSlug}`;
      const adding = !completed.has(key);

      if (adding) {
        playPop();
        const counted = !isOptionalModuleKey(key) && !isChallengeKey(key);
        setBurst({
          id: Date.now(),
          title: moduleTitle?.trim() || "This card",
          detail: key.startsWith("notes/")
            ? "Your notes will remember this one."
            : counted
              ? `${countedCompleted + 1} of ${totalModules} on the path.`
              : "This one sits off the main path. It is still yours.",
        });
      }

      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        writeLocalProgress(next);
        return next;
      });
    },
    [completed, countedCompleted]
  );

  const isCompleted = useCallback(
    (phaseSlug: string, moduleSlug: string) => completed.has(`${phaseSlug}/${moduleSlug}`),
    [completed]
  );

  const getPhaseProgress = useCallback(
    (phaseSlug: string) => {
      const phase = phases.find((p) => p.slug === phaseSlug);
      if (!phase) return 0;
      const done = phase.modules.filter((m) => completed.has(`${phaseSlug}/${m.slug}`)).length;
      return Math.round((done / phase.modules.length) * 100);
    },
    [completed]
  );

  const remainingHours = useMemo(
    () =>
      Math.round(
        phases.reduce((acc, phase) => {
          const lessonHours = getPhaseLessonHours(phase);
          if (lessonHours === 0 || phase.modules.length === 0) return acc;
          const done = phase.modules.filter((m) =>
            completed.has(`${phase.slug}/${m.slug}`)
          ).length;
          const remaining = phase.modules.length - done;
          return acc + remaining * (lessonHours / phase.modules.length);
        }, 0)
      ),
    [completed]
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      completed,
      toggleModule,
      isCompleted,
      progressPercent: Math.round((countedCompleted / totalModules) * 100),
      getPhaseProgress,
      completedCount: countedCompleted,
      totalModules,
      remainingHours,
      isAuthenticated: status === "authenticated",
      isSyncing,
    }),
    [
      completed,
      toggleModule,
      isCompleted,
      getPhaseProgress,
      countedCompleted,
      remainingHours,
      status,
      isSyncing,
    ]
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
      {burst ? (
        <CompleteBurst
          key={burst.id}
          title={burst.title}
          detail={burst.detail}
          seed={burst.id}
          onDismiss={dismissBurst}
        />
      ) : null}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return context;
}
