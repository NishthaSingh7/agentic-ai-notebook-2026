import type { BuildStep } from "@/data/lesson-types";
import { CopyButton } from "@/components/copy-button";
import { LessonCodeBlock } from "@/components/lesson-code-block";

export function LessonBuildSteps({ steps }: { steps: BuildStep[] }) {
  return (
    <ol className="not-prose space-y-8 mb-0 pl-0 list-none">
      {steps.map((step, i) => (
        <li
          key={`${i}-${step.title}`}
          className="rounded-xl border border-border bg-background/60 p-4 sm:p-5"
        >
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2">
            <span className="text-xs font-mono font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
              Step {i + 1}
            </span>
            <span className="text-base font-semibold text-text-primary">{step.title}</span>
          </p>
          {step.where && (
            <p className="text-xs text-text-muted mb-2">
              <span className="font-semibold uppercase tracking-wider text-text-muted">Where · </span>
              {step.where}
            </p>
          )}
          <p className="text-sm text-text-secondary leading-relaxed mb-0">{step.body}</p>
          {step.command && (
            <div className="mt-3" data-no-highlight>
              <LessonCodeBlock code={step.command} language="bash" title="Terminal" />
            </div>
          )}
          {step.prompts && step.prompts.length > 0 && (
            <ol className="mt-3 space-y-2 pl-0 list-none">
              {step.prompts.map((prompt) => (
                <li
                  key={prompt.ask}
                  className="rounded-lg border border-border bg-surface-elevated/80 p-3"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                    When it asks
                  </p>
                  <p className="text-sm text-text-primary mb-2">{prompt.ask}</p>
                  <div className="flex items-start gap-2" data-no-highlight>
                    <code className="block min-w-0 flex-1 text-sm font-mono bg-background border border-border rounded-md px-3 py-2 leading-relaxed text-text-primary whitespace-pre-wrap">
                      {prompt.type}
                    </code>
                    <CopyButton text={prompt.type} label="Copy answer" className="mt-0.5 shrink-0" />
                  </div>
                </li>
              ))}
            </ol>
          )}
          {step.code && (
            <div className="mt-3" data-no-highlight>
              <LessonCodeBlock
                code={step.code}
                language={step.codeLanguage}
                title={step.file ?? "File"}
              />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
