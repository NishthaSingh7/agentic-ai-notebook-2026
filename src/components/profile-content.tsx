"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { ArrowRight, LogIn, Sparkles, BookOpen } from "lucide-react";
import { phases } from "@/data/roadmap";
import { useProgress } from "@/hooks/use-progress";
import { ProfilePhaseGrid } from "@/components/profile-phase-grid";
import { ProfileCompletedModules } from "@/components/profile-completed-modules";
import { getFocusPhase, getMotivation, getNextModule } from "@/lib/profile-mermaid";

function ProgressRing({ percent }: { percent: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-surface-elevated" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#4169e1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums">{percent}%</span>
        <span className="text-[10px] text-text-muted uppercase tracking-wide">done</span>
      </div>
    </div>
  );
}

export function ProfileContent() {
  const { data: session, status } = useSession();
  const {
    completed,
    progressPercent,
    completedCount,
    totalModules,
    remainingHours,
    getPhaseProgress,
    isSyncing,
    isAuthenticated,
  } = useProgress();

  const motivation = useMemo(() => getMotivation(progressPercent), [progressPercent]);

  const focusPhase = useMemo(
    () => getFocusPhase(phases, getPhaseProgress),
    [getPhaseProgress]
  );

  const nextModule = useMemo(
    () => getNextModule(focusPhase, completed),
    [focusPhase, completed]
  );

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-text-muted">
        Loading profile...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Your learning profile</h1>
        <p className="text-text-secondary mb-8">
          Sign in with Google to save progress across devices.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-background hover:bg-accent/90"
        >
          <LogIn className="h-4 w-4" />
          Sign in with Google
        </Link>
      </div>
    );
  }

  const displayName = session.user.name ?? session.user.email ?? "Learner";
  const focusProgress = getPhaseProgress(focusPhase.slug);
  const focusDone = focusPhase.modules.filter((m) =>
    completed.has(`${focusPhase.slug}/${m.slug}`)
  ).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="flex items-center gap-4">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={displayName}
                width={56}
                height={56}
                className="rounded-full border-2 border-border"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 text-lg font-bold text-accent">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="sm:hidden">
              <h1 className="font-bold">{displayName}</h1>
              <p className="text-xs text-text-muted">
                {completedCount}/{totalModules} modules · ~{remainingHours}h left
              </p>
            </div>
          </div>

          <ProgressRing percent={progressPercent} />

          <div className="flex-1 text-center sm:text-left">
            <h1 className="hidden sm:block text-xl font-bold mb-0.5">{displayName}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <p className="font-semibold text-accent">{motivation.headline}</p>
            </div>
            <p className="text-sm text-text-secondary mb-3">{motivation.sub}</p>
            <p className="text-xs text-text-muted">
              {completedCount} modules done · ~{remainingHours}h remaining
              {isAuthenticated && (isSyncing ? " · syncing…" : " · saved to cloud")}
            </p>
          </div>
        </div>

        {nextModule ? (
          <Link
            href={`/roadmap/${focusPhase.slug}/${nextModule.slug}`}
            className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-royal/25 bg-royal/5 px-4 py-3.5 transition-colors hover:bg-royal/10 group"
          >
            <div className="min-w-0 text-left">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-royal mb-0.5">
                Up next · {focusPhase.subtitle}
              </p>
              <p className="font-medium truncate">{nextModule.title}</p>
              <p className="text-xs text-text-muted mt-0.5">
                {focusPhase.title} — {focusDone}/{focusPhase.modules.length} modules done
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-royal transition-transform group-hover:translate-x-1" />
          </Link>
        ) : completedCount === 0 ? (
          <Link
            href="/roadmap/programming-foundations"
            className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-royal/25 bg-royal/5 px-4 py-3.5 transition-colors hover:bg-royal/10 group"
          >
            <div className="min-w-0 text-left">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-royal mb-0.5">
                Get started
              </p>
              <p className="font-medium">Begin with Programming Foundations</p>
              <p className="text-xs text-text-muted mt-0.5">
                Check off modules as you read them
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-royal transition-transform group-hover:translate-x-1" />
          </Link>
        ) : null}
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-surface p-5">
        <ProfilePhaseGrid completed={completed} />
      </div>

      {completedCount > 0 ? (
        <ProfileCompletedModules completed={completed} />
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-10 text-center">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-text-muted" />
          <p className="text-sm text-text-secondary mb-1">No modules checked yet</p>
          <p className="text-xs text-text-muted mb-4">
            Open any lesson and tap the book icon to mark it as read
          </p>
          <Link href="/roadmap" className="text-sm text-royal hover:underline">
            Browse roadmap →
          </Link>
        </div>
      )}
    </div>
  );
}
