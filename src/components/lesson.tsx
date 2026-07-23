import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LessonSectionProps {
  id: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function LessonSection({ id, title, icon, children, className }: LessonSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 pb-2 border-b border-border">
        {icon}
        {title}
      </h2>
      <div className="prose-lesson">{children}</div>
    </section>
  );
}

interface LessonNavProps {
  sections: { id: string; title: string }[];
}

export function LessonNav({ sections }: LessonNavProps) {
  return (
    <nav className="sticky top-20 space-y-1 text-sm">
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
        On this page
      </p>
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="block py-1 text-text-muted hover:text-text-secondary transition-colors border-l-2 border-transparent hover:border-accent pl-3"
        >
          {s.title}
        </a>
      ))}
    </nav>
  );
}

type RevisionVariant = "fiveMin" | "fifteenMin" | "oneHour" | "cheatSheet";

interface RevisionCardProps {
  title: string;
  duration: string;
  items: string[];
  variant?: RevisionVariant;
}

const revisionVariants: Record<RevisionVariant, string> = {
  fiveMin:
    "border-emerald-500/30 bg-emerald-500/5 shadow-[inset_0_1px_0_0_rgba(52,211,153,0.15)]",
  fifteenMin:
    "border-sky-500/30 bg-sky-500/5 shadow-[inset_0_1px_0_0_rgba(56,189,248,0.15)]",
  oneHour:
    "border-violet-500/30 bg-violet-500/5 shadow-[inset_0_1px_0_0_rgba(167,139,250,0.15)]",
  cheatSheet:
    "border-amber-500/30 bg-amber-500/5 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.15)]",
};

const revisionBadgeVariants: Record<RevisionVariant, string> = {
  fiveMin: "bg-emerald-500/15 text-emerald-400",
  fifteenMin: "bg-sky-500/15 text-sky-400",
  oneHour: "bg-violet-500/15 text-violet-400",
  cheatSheet: "bg-amber-500/15 text-amber-400",
};

export function RevisionCard({ title, duration, items, variant }: RevisionCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-colors",
        variant ? revisionVariants[variant] : "border-border bg-surface"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-sm">{title}</h4>
        <span
          className={cn(
            "text-xs font-mono rounded-full px-2 py-0.5",
            variant ? revisionBadgeVariants[variant] : "text-text-muted"
          )}
        >
          {duration}
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-accent mt-1 shrink-0">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface CommandsCardProps {
  commands: string[];
}

function parseCommandEntry(cmd: string): { command: string; comment: string | null } {
  const hashIndex = cmd.indexOf(" # ");
  if (hashIndex === -1) return { command: cmd, comment: null };
  return {
    command: cmd.slice(0, hashIndex),
    comment: cmd.slice(hashIndex + 3),
  };
}

export function CommandsCard({ commands }: CommandsCardProps) {
  return (
    <div className="not-prose rounded-xl border border-royal/30 bg-royal/5 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-royal mb-3">
        Commands to Remember
      </p>
      <ul className="space-y-2">
        {commands.map((cmd, i) => {
          const { command, comment } = parseCommandEntry(cmd);
          return (
            <li key={i}>
              <code className="block text-sm font-mono bg-surface-elevated border border-border rounded-lg px-3 py-2 leading-relaxed">
                <span className="text-text-primary">{command}</span>
                {comment ? (
                  <span className="text-emerald-400/90 ml-2"># {comment}</span>
                ) : null}
              </code>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface InterviewQProps {
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
}

const difficultyColors = {
  easy: "bg-emerald-500/10 text-emerald-400",
  medium: "bg-amber-500/10 text-amber-400",
  hard: "bg-rose-500/10 text-rose-400",
};

export function InterviewQ({ question, answer, difficulty }: InterviewQProps) {
  return (
    <details className="group rounded-xl border border-border bg-surface overflow-hidden">
      <summary className="flex items-center gap-3 cursor-pointer px-5 py-4 hover:bg-surface-elevated transition-colors">
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium uppercase", difficultyColors[difficulty])}>
          {difficulty}
        </span>
        <span className="text-sm font-medium flex-1">{question}</span>
      </summary>
      <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed border-t border-border pt-3">
        {answer}
      </div>
    </details>
  );
}
