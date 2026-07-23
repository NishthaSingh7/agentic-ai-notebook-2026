"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { phases, totalModules } from "@/data/roadmap";

const STORAGE_KEY = "agentic-ai-progress";

type ProgressContextValue = {
  completed: Set<string>;
  toggleModule: (phaseSlug: string, moduleSlug: string) => void;
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
    if (stored) return new Set(JSON.parse(stored) as string[]);
  } catch {
    // ignore
  }
  return new Set();
}

function writeLocalProgress(completed: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
}

async function fetchRemoteProgress(): Promise<string[]> {
  const response = await fetch("/api/progress");
  if (!response.ok) return [];
  const data = await response.json();
  return Array.isArray(data.completed) ? data.completed : [];
}

async function saveRemoteProgress(completed: string[]) {
  await fetch("/api/progress", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [synced, setSynced] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setCompleted(readLocalProgress());
  }, []);

  useEffect(() => {
    if (status !== "authenticated" || synced) return;

    let cancelled = false;

    async function syncProgress() {
      setIsSyncing(true);
      const local = readLocalProgress();
      const remote = await fetchRemoteProgress();
      const merged = new Set([...local, ...remote]);

      if (cancelled) return;

      setCompleted(merged);
      writeLocalProgress(merged);

      if (merged.size !== remote.length || [...local].some((item) => !remote.includes(item))) {
        await saveRemoteProgress([...merged]);
      }

      if (!cancelled) {
        setSynced(true);
        setIsSyncing(false);
      }
    }

    void syncProgress();

    return () => {
      cancelled = true;
    };
  }, [status, synced]);

  useEffect(() => {
    if (status === "unauthenticated") {
      setSynced(false);
    }
  }, [status]);

  const toggleModule = useCallback(
    (phaseSlug: string, moduleSlug: string) => {
      const key = `${phaseSlug}/${moduleSlug}`;
      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);

        writeLocalProgress(next);

        if (status === "authenticated") {
          void saveRemoteProgress([...next]);
        }

        return next;
      });
    },
    [status]
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
          const done = phase.modules.filter((m) =>
            completed.has(`${phase.slug}/${m.slug}`)
          ).length;
          const remaining = phase.modules.length - done;
          const hoursPerModule = phase.estimatedHours / phase.modules.length;
          return acc + remaining * hoursPerModule;
        }, 0)
      ),
    [completed]
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      completed,
      toggleModule,
      isCompleted,
      progressPercent: Math.round((completed.size / totalModules) * 100),
      getPhaseProgress,
      completedCount: completed.size,
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
      remainingHours,
      status,
      isSyncing,
    ]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return context;
}
