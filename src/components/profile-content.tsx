"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { ArrowRight, BookOpen, LogIn, Sparkles, Trophy } from "lucide-react";
import { phases } from "@/data/roadmap";
import { useProgress } from "@/hooks/use-progress";
import { ProfilePhaseGrid } from "@/components/profile-phase-grid";
import { ProfileCompletedModules } from "@/components/profile-completed-modules";
import {
  getCompletedPhaseCount,
  getFocusPhase,
  getLatestClearedPhase,
  getMilestones,
  getNextModule,
  getProfileStory,
} from "@/lib/profile-mermaid";
import { cn } from "@/lib/utils";

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

  const milestones = useMemo(
    () => getMilestones(completedCount, progressPercent),
    [completedCount, progressPercent]
  );

  const focusPhase = useMemo(
    () => getFocusPhase(phases, getPhaseProgress),
    [getPhaseProgress]
  );

  const latestWin = useMemo(
    () => getLatestClearedPhase(phases, getPhaseProgress),
    [getPhaseProgress]
  );

  const nextModule = useMemo(
    () => getNextModule(focusPhase, completed),
    [focusPhase, completed]
  );

  const phasesCleared = useMemo(
    () => getCompletedPhaseCount(phases, getPhaseProgress),
    [getPhaseProgress]
  );

  const corePhaseCount = phases.filter((phase) => !phase.optional).length;

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
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <Trophy className="h-7 w-7" />
        </div>
        <h1 className="font-sketch text-3xl mb-2">Your medal wall starts here</h1>
        <p className="text-text-secondary mb-8">
          Sign in with Google. Every chapter you finish — CrewAI, RAG, LangGraph — lands on your
          profile with its real name, not a number.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-on-accent hover:bg-accent/90"
        >
          <LogIn className="h-4 w-4" />
          Sign in with Google
        </Link>
      </div>
    );
  }

  const displayName = session.user.name ?? session.user.email ?? "Learner";
  const firstName = displayName.split(" ")[0];
  const focusDone = focusPhase.modules.filter((m) =>
    completed.has(`${focusPhase.slug}/${m.slug}`)
  ).length;
  const focusTotal = focusPhase.modules.length;
  const focusRemaining = Math.max(0, focusTotal - focusDone);
  const focusPercent = focusTotal > 0 ? Math.round((focusDone / focusTotal) * 100) : 0;
  const latestWinIndex = latestWin ? phases.findIndex((p) => p.slug === latestWin.slug) : -1;
  const focusIndex = phases.findIndex((p) => p.slug === focusPhase.slug);
  const winIsAheadOfFocus = latestWinIndex >= 0 && focusIndex >= 0 && focusIndex < latestWinIndex;

  const story = getProfileStory({
    firstName,
    progressPercent,
    latestWin,
    focusPhase,
    focusDone,
    focusTotal,
    clearedCount: phasesCleared,
    winIsAheadOfFocus,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="mb-6 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent/12 via-surface to-royal/12 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={displayName}
              width={56}
              height={56}
              className="rounded-full border-2 border-accent/30 shadow-sm"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 text-lg font-bold text-accent">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-sketch text-2xl leading-tight">{firstName}</p>
            <p className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
              <Sparkles className="h-3 w-3" />
              {story.rank}
            </p>
          </div>
          <div className="hidden sm:block shrink-0 text-right">
            <p className="text-2xl font-bold tabular-nums tracking-tight">{progressPercent}%</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              of the map
            </p>
          </div>
        </div>

        <h1 className="font-sketch mt-6 text-3xl sm:text-4xl leading-tight text-text-primary">
          {story.headline}
        </h1>
        <p className="mt-2 max-w-xl text-sm sm:text-base text-text-secondary">{story.sub}</p>
        <p className="mt-2 text-xs text-text-muted">
          {isAuthenticated && (isSyncing ? "Syncing progress…" : "Progress saved to your account")}
        </p>

        {nextModule ? (
          <Link
            href={`/roadmap/${focusPhase.slug}/${nextModule.slug}`}
            className="mt-6 block rounded-2xl border-2 border-accent/30 bg-background/80 p-5 transition-colors hover:bg-accent/10 group"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent mb-1">
              You&apos;re here
            </p>
            <p className="font-sketch text-2xl sm:text-3xl leading-tight">{focusPhase.title}</p>
            <p className="mt-1 text-xs text-text-muted">
              {focusPhase.subtitle}
              {focusPhase.optional ? " · Optional" : ""} · {focusDone} of {focusTotal} ·{" "}
              {focusRemaining === 0
                ? "this chapter is yours"
                : `${focusRemaining} until this chapter is a medal`}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-elevated">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-royal transition-all"
                style={{ width: `${Math.max(focusPercent, focusDone > 0 ? 6 : 0)}%` }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Next module
                </p>
                <p className="text-sm font-semibold truncate">{nextModule.title}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 shrink-0 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-on-accent">
                Keep going
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ) : completedCount === 0 ? (
          <Link
            href="/roadmap/programming-foundations"
            className="mt-6 block rounded-2xl border-2 border-accent/30 bg-background/80 p-5 transition-colors hover:bg-accent/10 group"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent mb-1">
              Start here
            </p>
            <p className="font-sketch text-2xl sm:text-3xl leading-tight">
              Programming Foundations
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Mark a module done and the first spark lands on this page.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-on-accent">
              Begin
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ) : null}

        <p className="mt-5 text-xs text-text-muted">
          {completedCount} module{completedCount === 1 ? "" : "s"} · {phasesCleared} of{" "}
          {corePhaseCount} core chapters cleared
          {remainingHours > 0 ? ` · ~${remainingHours}h of lessons left` : ""}
          <span className="sm:hidden"> · {progressPercent}% of the map</span>
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {milestones.map((milestone) => (
            <span
              key={milestone.id}
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium",
                milestone.unlocked
                  ? "border-success/40 bg-success/10 text-success"
                  : "border-border bg-background/40 text-text-muted"
              )}
            >
              {milestone.unlocked ? "✓ " : ""}
              {milestone.label}
            </span>
          ))}
        </div>
      </section>

      <div className="mb-6 rounded-2xl border border-border bg-surface p-5">
        <ProfilePhaseGrid completed={completed} focusSlug={focusPhase.slug} />
      </div>

      {completedCount > 0 ? (
        <ProfileCompletedModules completed={completed} />
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-10 text-center">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-text-muted" />
          <p className="font-sketch text-xl text-text-primary mb-1">Your first win is one tap away</p>
          <p className="text-xs text-text-muted mb-4">
            Open a lesson and tap Mark as done — you&apos;ll get a quote, a chime, and this page
            starts filling in.
          </p>
          <Link href="/roadmap" className="text-sm text-accent hover:underline">
            Browse roadmap →
          </Link>
        </div>
      )}
    </div>
  );
}
