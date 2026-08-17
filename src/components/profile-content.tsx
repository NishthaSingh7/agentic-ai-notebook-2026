"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  BookOpen,
  Flame,
  Layers,
  LogIn,
  Sparkles,
  Trophy,
} from "lucide-react";
import { phases } from "@/data/roadmap";
import { useProgress } from "@/hooks/use-progress";
import { ProfilePhaseGrid } from "@/components/profile-phase-grid";
import { ProfileCompletedModules } from "@/components/profile-completed-modules";
import {
  getCompletedPhaseCount,
  getFocusPhase,
  getMilestones,
  getMotivation,
  getNextModule,
} from "@/lib/profile-mermaid";
import { cn } from "@/lib/utils";

function ProgressRing({ percent }: { percent: number }) {
  const r = 48;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-surface-elevated"
        />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c2410c" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums tracking-tight">{percent}%</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          complete
        </span>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/80 bg-background/50 px-4 py-3">
      <div className="flex items-center gap-1.5 text-text-muted mb-1">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-lg font-bold tabular-nums">{value}</p>
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
  const milestones = useMemo(
    () => getMilestones(completedCount, progressPercent),
    [completedCount, progressPercent]
  );

  const focusPhase = useMemo(
    () => getFocusPhase(phases, getPhaseProgress),
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
        <h1 className="text-2xl font-bold mb-2">Your learning profile</h1>
        <p className="text-text-secondary mb-8">
          Sign in with Google to save progress, celebrate completed modules, and pick up on any
          device.
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
  const focusDone = focusPhase.modules.filter((m) =>
    completed.has(`${focusPhase.slug}/${m.slug}`)
  ).length;
  const firstName = displayName.split(" ")[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="mb-6 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent/12 via-surface to-royal/12 p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={displayName}
                width={64}
                height={64}
                className="rounded-full border-2 border-accent/30 shadow-sm"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-xl font-bold text-accent">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="sm:hidden">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                Keep going, {firstName}
              </p>
              <h1 className="font-bold text-lg leading-tight">{displayName}</h1>
            </div>
          </div>

          <ProgressRing percent={progressPercent} />

          <div className="flex-1 text-center sm:text-left min-w-0">
            <p className="hidden sm:block text-xs font-semibold uppercase tracking-wider text-accent mb-1">
              Keep going, {firstName}
            </p>
            <h1 className="hidden sm:block text-2xl font-bold mb-1 tracking-tight">{displayName}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-2">
              <Sparkles className="h-4 w-4 text-royal" />
              <p className="font-semibold text-text-primary">{motivation.headline}</p>
            </div>
            <p className="text-sm text-text-secondary mb-2 max-w-lg">{motivation.sub}</p>
            <p className="text-xs text-text-muted">
              {isAuthenticated && (isSyncing ? "Syncing progress…" : "Progress saved to your account")}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={<BookOpen className="h-3.5 w-3.5" />}
            label="Modules"
            value={`${completedCount}/${totalModules}`}
          />
          <StatCard
            icon={<Layers className="h-3.5 w-3.5" />}
            label="Phases cleared"
            value={`${phasesCleared}/${corePhaseCount}`}
          />
          <StatCard
            icon={<Flame className="h-3.5 w-3.5" />}
            label="Focus"
            value={focusPhase.subtitle}
          />
          <StatCard
            icon={<Trophy className="h-3.5 w-3.5" />}
            label="Roadmap hours left"
            value={`~${remainingHours}h`}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
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

        {nextModule ? (
          <Link
            href={`/roadmap/${focusPhase.slug}/${nextModule.slug}`}
            className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-accent/25 bg-background/70 px-5 py-4 transition-colors hover:bg-accent/10 group"
          >
            <div className="min-w-0 text-left">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-0.5">
                Continue · {focusPhase.subtitle} · {focusDone}/{focusPhase.modules.length} in this
                phase
              </p>
              <p className="text-lg font-semibold truncate">{nextModule.title}</p>
              <p className="text-xs text-text-muted mt-0.5">{focusPhase.title}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 shrink-0 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-on-accent">
              Open
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ) : completedCount === 0 ? (
          <Link
            href="/roadmap/programming-foundations"
            className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-accent/25 bg-background/70 px-5 py-4 transition-colors hover:bg-accent/10 group"
          >
            <div className="min-w-0 text-left">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-0.5">
                Start here
              </p>
              <p className="text-lg font-semibold">Programming Foundations</p>
              <p className="text-xs text-text-muted mt-0.5">
                Mark a module done and hear the win
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 shrink-0 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-on-accent">
              Begin
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ) : null}
      </section>

      <div className="mb-6 rounded-2xl border border-border bg-surface p-5">
        <ProfilePhaseGrid completed={completed} />
      </div>

      {completedCount > 0 ? (
        <ProfileCompletedModules completed={completed} />
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-10 text-center">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-text-muted" />
          <p className="text-sm font-medium text-text-primary mb-1">Your first win is one tap away</p>
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
