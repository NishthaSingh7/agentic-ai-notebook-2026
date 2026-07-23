"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { CheckCircle2, Circle, LogIn, BookOpen, Clock, Layers } from "lucide-react";
import { phases } from "@/data/roadmap";
import { useProgress } from "@/hooks/use-progress";
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
          Sign in with Google to save progress across devices and view detailed stats.
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
  const phasesStarted = phases.filter((phase) => getPhaseProgress(phase.slug) > 0).length;
  const phasesCompleted = phases.filter((phase) => getPhaseProgress(phase.slug) === 100).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={displayName}
            width={80}
            height={80}
            className="rounded-full border-2 border-border"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/20 text-2xl font-bold text-accent">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          {session.user.email && (
            <p className="text-sm text-text-muted">{session.user.email}</p>
          )}
          {isAuthenticated && (
            <p className="mt-1 text-xs text-text-muted">
              {isSyncing ? "Syncing progress with cloud..." : "Progress saved to your account"}
            </p>
          )}
        </div>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Overall progress", value: `${progressPercent}%`, icon: Layers },
          { label: "Modules completed", value: `${completedCount}/${totalModules}`, icon: BookOpen },
          { label: "Phases started", value: String(phasesStarted), icon: CheckCircle2 },
          { label: "Hours remaining", value: `~${remainingHours}h`, icon: Clock },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-surface p-4"
          >
            <stat.icon className="mb-2 h-4 w-4 text-accent" />
            <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
            <p className="text-xs text-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Progress by phase</h2>
        <span className="text-sm text-text-muted">{phasesCompleted} phases complete</span>
      </div>

      <div className="space-y-4">
        {phases.map((phase) => {
          const phaseProgress = getPhaseProgress(phase.slug);
          const completedModules = phase.modules.filter((mod) =>
            completed.has(`${phase.slug}/${mod.slug}`)
          );

          if (completedModules.length === 0) return null;

          return (
            <div
              key={phase.slug}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-mono text-text-muted">{phase.subtitle}</p>
                  <h3 className="font-semibold">{phase.title}</h3>
                </div>
                <span className="shrink-0 text-sm font-medium text-accent tabular-nums">
                  {phaseProgress}%
                </span>
              </div>

              <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-surface-elevated">
                <div
                  className="h-full rounded-full brand-gradient transition-all"
                  style={{ width: `${phaseProgress}%` }}
                />
              </div>

              <ul className="space-y-1.5">
                {completedModules.map((mod) => (
                  <li key={mod.slug}>
                    <Link
                      href={`/roadmap/${phase.slug}/${mod.slug}`}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                      {mod.title}
                    </Link>
                  </li>
                ))}
              </ul>

              {phaseProgress < 100 && (
                <p className="mt-3 text-xs text-text-muted">
                  {phase.modules.length - completedModules.length} modules remaining in this phase
                </p>
              )}
            </div>
          );
        })}
      </div>

      {completedCount === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-surface/50 px-6 py-12 text-center">
          <Circle className="mx-auto mb-3 h-8 w-8 text-text-muted" />
          <p className="text-text-secondary mb-4">
            No modules checked yet. Start learning and mark modules as read on any phase page.
          </p>
          <Link
            href="/roadmap"
            className={cn(
              "inline-flex items-center gap-2 text-sm text-accent hover:underline"
            )}
          >
            Browse roadmap
          </Link>
        </div>
      )}
    </div>
  );
}
