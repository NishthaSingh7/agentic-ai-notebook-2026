import Link from "next/link";
import { CheckCircle2, Dices } from "lucide-react";
import { challengeTopics, getCompletedChallengeTopics } from "@/data/challenges";

interface ProfileChallengeProgressProps {
  completed: Set<string>;
}

export function ProfileChallengeProgress({ completed }: ProfileChallengeProgressProps) {
  const done = getCompletedChallengeTopics(completed);
  const total = challengeTopics.length;
  const percent = total > 0 ? Math.round((done.length / total) * 100) : 0;

  return (
    <div className="mb-6 rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-semibold">Challenge for a day</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Separate from the roadmap — topics you covered in a one-day sitting.
          </p>
        </div>
        <Link
          href="/challenge"
          className="inline-flex items-center gap-1.5 shrink-0 text-xs text-royal hover:underline"
        >
          <Dices className="h-3.5 w-3.5" />
          Draw
        </Link>
      </div>

      <p className="text-sm tabular-nums mb-2">
        <span className="font-semibold">{done.length}</span>
        <span className="text-text-muted"> / {total} challenges</span>
        <span className="text-text-muted"> · {percent}%</span>
      </p>
      <div className="h-2 overflow-hidden rounded-full bg-background mb-4">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-royal"
          style={{ width: `${Math.max(percent, done.length > 0 ? 6 : 0)}%` }}
        />
      </div>

      {done.length === 0 ? (
        <p className="text-sm text-text-secondary">
          No challenge topics yet. Draw one for today and mark it done when you finish.
        </p>
      ) : (
        <ul className="space-y-1">
          {done.map((topic) => (
            <li key={topic.slug}>
              <Link
                href={`/challenge/${topic.slug}`}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
              >
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                <span className="truncate">{topic.title}</span>
                <span className="ml-auto text-[11px] text-text-muted">{topic.category}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
