"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { LogIn } from "lucide-react";
import { mainPhases, sidePhases } from "@/data/roadmap";
import { notes } from "@/data/notes";
import { useProgress } from "@/hooks/use-progress";

export function ProfileContent() {
  const { data: session, status } = useSession();
  const { completed, completedCount, totalModules, isSyncing, isAuthenticated } = useProgress();

  if (status === "loading") {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-text-muted">Loading...</div>;
  }

  const left = Math.max(0, totalModules - completedCount);
  const displayName = session?.user?.name?.split(" ")[0] ?? "Your path";

  let nextPath: { href: string; title: string; where: string } | null = null;
  for (const phase of mainPhases) {
    for (const mod of phase.modules) {
      if (!completed.has(`${phase.slug}/${mod.slug}`)) {
        nextPath = {
          href: `/roadmap/${phase.slug}/${mod.slug}`,
          title: mod.title,
          where: phase.title,
        };
        break;
      }
    }
    if (nextPath) break;
  }

  const noteCards = notes.flatMap((note) =>
    (note.cards?.length ? note.cards : [{ slug: "note", title: note.title }]).map((card) => ({
      note,
      card,
      key: `notes/${note.slug}/${card.slug}`,
    }))
  );
  const notesDone = noteCards.filter((item) => completed.has(item.key)).length;
  const nextNote = noteCards.find((item) => !completed.has(item.key));

  const sideTotal = sidePhases.reduce((sum, phase) => sum + phase.modules.length, 0);
  const sideDone = sidePhases.reduce(
    (sum, phase) => sum + phase.modules.filter((mod) => completed.has(`${phase.slug}/${mod.slug}`)).length,
    0
  );

  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {session?.user?.image ? (
            <Image src={session.user.image} alt="" width={40} height={40} className="rounded-full" />
          ) : null}
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold">{displayName}</h1>
            <p className="text-xs text-text-muted">
              {isAuthenticated
                ? isSyncing
                  ? "Saving to your account..."
                  : "Saved on this browser. Your account catches up at noon."
                : "Saved on this browser"}
            </p>
          </div>
        </div>
        {!session?.user ? (
          <Link
            href="/login"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-on-accent"
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </Link>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-3xl border border-border bg-surface px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Completed</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">{completedCount}</p>
          <p className="text-sm text-text-secondary">of {totalModules} on the path</p>
        </div>
        <div className="rounded-3xl border border-border bg-surface px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Left</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">{left}</p>
          <p className="text-sm text-text-secondary">{left === 0 ? "The path is marked" : "still open on the path"}</p>
        </div>
        {nextPath ? (
          <Link href={nextPath.href} className="card-press rounded-3xl border border-accent/40 bg-surface-elevated px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-accent">Next</p>
            <p className="mt-1 truncate text-xl font-semibold">{nextPath.title}</p>
            <p className="truncate text-sm text-text-secondary">{nextPath.where}</p>
          </Link>
        ) : (
          <div className="rounded-3xl border border-border bg-surface-elevated px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-accent">Next</p>
            <p className="mt-1 text-xl font-semibold">You are through the path</p>
            <p className="text-sm text-text-secondary">Every main card is marked</p>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {mainPhases.map((phase) => {
          const done = phase.modules.filter((mod) => completed.has(`${phase.slug}/${mod.slug}`)).length;
          const width = phase.modules.length === 0 ? 0 : (done / phase.modules.length) * 100;
          const current = nextPath?.where === phase.title;
          return (
            <Link
              key={phase.slug}
              href={`/roadmap/${phase.slug}`}
              className={`rounded-2xl border bg-surface px-3 py-2 ${current ? "border-accent" : "border-border"}`}
            >
              <p className="truncate text-xs font-medium">{phase.title}</p>
              <p className="text-[11px] tabular-nums text-text-muted">
                {done}/{phase.modules.length}
              </p>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-elevated">
                <div className="h-full rounded-full bg-accent" style={{ width: `${width}%` }} />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link href="/notes" className="rounded-2xl border border-border bg-surface px-4 py-3">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-medium">Notes</p>
            <p className="text-xs tabular-nums text-text-muted">
              {notesDone}/{noteCards.length}
            </p>
          </div>
          <p className="mt-1 truncate text-sm text-text-secondary">
            {nextNote ? `Next: ${nextNote.card.title}` : "Every note card is marked"}
          </p>
        </Link>
        <div className="rounded-2xl border border-border bg-surface px-4 py-3">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-medium">Side shelf</p>
            <p className="text-xs tabular-nums text-text-muted">
              {sideDone}/{sideTotal}
            </p>
          </div>
          <p className="mt-1 text-sm text-text-secondary">Off the main count. Open a chapter when you want it.</p>
        </div>
      </div>
    </div>
  );
}
