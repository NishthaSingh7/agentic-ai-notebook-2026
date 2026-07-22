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

interface RevisionCardProps {
  title: string;
  duration: string;
  items: string[];
}

export function RevisionCard({ title, duration, items }: RevisionCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-sm">{title}</h4>
        <span className="text-xs text-text-muted font-mono">{duration}</span>
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
