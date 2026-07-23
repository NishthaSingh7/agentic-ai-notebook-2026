import { highlightCodeToLines } from "@/lib/highlight-code";

interface LessonCodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  /** Highlight lines marked with >>> prefix (curriculum phases) */
  showFocusHighlights?: boolean;
}

export function LessonCodeBlock({
  code,
  language,
  title,
  showFocusHighlights,
}: LessonCodeBlockProps) {
  const lines = highlightCodeToLines(code, language);

  return (
    <div className="not-prose rounded-xl border border-border overflow-hidden">
      {title && (
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-elevated border-b border-border">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 text-xs text-text-muted font-mono">{title}</span>
        </div>
      )}
      <pre className="lesson-code overflow-x-auto p-4 text-sm leading-relaxed font-mono bg-[#0d1117] text-slate-300">
        <code>
          {lines.map((line, i) => (
            <span
              key={i}
              className={
                showFocusHighlights && line.focused
                  ? "block bg-amber-500/15 border-l-2 border-amber-400/80 -mx-4 px-4"
                  : "block"
              }
            >
              <span className="inline-block w-8 mr-3 text-right text-slate-600 select-none text-xs">
                {i + 1}
              </span>
              {line.tokens.length > 0 ? line.tokens : "\n"}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
