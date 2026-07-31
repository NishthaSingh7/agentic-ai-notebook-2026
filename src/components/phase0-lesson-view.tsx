import type { ReactNode } from "react";
import type { LessonContent } from "@/data/lesson-types";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Code,
  Layers,
  Lightbulb,
  ListChecks,
  PenLine,
  Terminal,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import type { Phase, Module } from "@/data/roadmap";
import { LessonNav, RevisionCard, CommandsCard } from "@/components/lesson";
import { LessonCodeBlock } from "@/components/lesson-code-block";
import { buildConceptBullets } from "@/lib/lesson-concept-bullets";
import { buildLessonSections, VisualWorkflows } from "@/components/lesson-visual-blocks";
import { ModuleCompleteButton } from "@/components/module-complete-button";
import { cn } from "@/lib/utils";

interface Phase0LessonViewProps {
  phase: Phase;
  mod: Module;
  content: LessonContent;
  prevMod: Module | null;
  nextMod: Module | null;
  slug: string;
  includeCode?: boolean;
}

function Phase0ModuleStrip({
  phase,
  currentSlug,
  slug,
}: {
  phase: Phase;
  currentSlug: string;
  slug: string;
}) {
  return (
    <div className="not-prose overflow-x-auto pb-1 -mx-1 px-1">
      <div className="flex gap-1.5 min-w-max">
        {phase.modules.map((m, i) => {
          const active = m.slug === currentSlug;
          return (
            <Link
              key={m.slug}
              href={`/roadmap/${slug}/${m.slug}`}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
                active
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-surface text-text-muted hover:border-accent/30 hover:text-text-secondary"
              )}
            >
              <span className="font-mono opacity-70">{i}</span>
              {m.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SectionCard({
  id,
  title,
  icon,
  children,
  className,
}: {
  id: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28 rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-sm",
        className
      )}
    >
      <h2 className="flex items-center gap-2 text-base font-semibold mb-4 text-text-primary">
        {icon}
        {title}
      </h2>
      <div className="prose-lesson">{children}</div>
    </section>
  );
}

export function Phase0LessonView({
  phase,
  mod,
  content,
  prevMod,
  nextMod,
  slug,
  includeCode = false,
}: Phase0LessonViewProps) {
  const moduleIndex = phase.modules.findIndex((m) => m.slug === mod.slug);
  const conceptBullets = buildConceptBullets(content.concept, content.technicalExplanation).slice(0, 5);
  const cheatSheet = content.revisionNotes.cheatSheet.slice(0, 8);
  const sectionDefs = buildLessonSections(includeCode, content, true, true);

  const activeSections = sectionDefs.filter((s) => {
    if (s.id === "diagram") {
      return !!content.diagram || !!content.workflowDiagrams?.length || !!content.analogyDiagram;
    }
    if (s.id.startsWith("workflow-")) {
      const idx = Number(s.id.replace("workflow-", ""));
      return !!content.workflowDiagrams?.[idx];
    }
    if (s.id === "code") return includeCode && !!content.code;
    if (s.id === "practice") return !!content.practiceTask;
    if (s.id === "commands") return !!content.commandsToRemember?.length;
    if (s.id === "mistakes") return !!content.commonMistakes?.length;
    return true;
  });

  const hasDiagrams =
    content.diagram || content.workflowDiagrams?.length || content.analogyDiagram;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <Phase0ModuleStrip phase={phase} currentSlug={mod.slug} slug={slug} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          href={`/roadmap/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {phase.title}
        </Link>

        <div className="grid xl:grid-cols-[1fr_240px] gap-8 items-start">
          <div className="space-y-6 min-w-0">
            {/* Hero */}
            <header className="rounded-2xl border border-border bg-gradient-to-br from-surface via-surface to-accent/5 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                    {phase.subtitle}
                  </span>
                  {phase.optional && (
                    <span className="text-xs font-medium text-text-muted bg-surface-elevated border border-border px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  )}
                  <span className="text-xs text-text-muted">
                    Module {moduleIndex + 1} of {phase.modules.length}
                  </span>
                </div>
                <ModuleCompleteButton
                  phaseSlug={slug}
                  moduleSlug={mod.slug}
                  moduleTitle={mod.title}
                />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">{mod.title}</h1>
              <p className="text-base text-text-secondary max-w-2xl leading-relaxed">
                {content.whyItExists}
              </p>
              <p className="mt-4 text-sm text-text-muted italic border-l-2 border-royal/40 pl-3 max-w-2xl">
                <Lightbulb className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5 text-royal" />
                {content.analogy}
              </p>
            </header>

            {/* Visual workflows — primary focus */}
            {hasDiagrams && (
              <SectionCard
                id="diagram"
                title="Visual Workflows"
                icon={<Layers className="h-5 w-5 text-accent shrink-0" />}
              >
                <p className="text-sm text-text-muted mb-5 not-prose">
                  Start here — study each diagram, then use <strong>+</strong> / <strong>−</strong> to
                  zoom if needed.
                </p>
                <VisualWorkflows content={content} mod={mod} visualFirst />
              </SectionCard>
            )}

            {/* Takeaways + Example side by side */}
            <div className="grid md:grid-cols-2 gap-6">
              <SectionCard
                id="concept"
                title="Key Takeaways"
                icon={<BookOpen className="h-5 w-5 text-accent shrink-0" />}
              >
                <ul className="text-sm space-y-2 not-prose list-none pl-0 mb-0">
                  {conceptBullets.map((point, i) => (
                    <li key={i} className="flex gap-2 text-text-secondary">
                      <span className="text-accent font-bold shrink-0">{i + 1}.</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                {content.learnElsewhere && content.learnElsewhere.length > 0 && (
                  <div className="mt-4 not-prose rounded-xl border border-accent/20 bg-accent/5 p-3">
                    <p className="flex items-center gap-2 text-xs font-semibold text-accent mb-2">
                      <ListChecks className="h-3.5 w-3.5" />
                      Learn elsewhere
                    </p>
                    <ul className="space-y-1 text-xs text-text-secondary">
                      {content.learnElsewhere.map((item, i) => (
                        <li key={i} className="flex gap-1.5">
                          <span className="text-accent/70">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </SectionCard>

              {content.example && (
                <SectionCard
                  id="example"
                  title="Real Example"
                  icon={<Sparkles className="h-5 w-5 text-royal shrink-0" />}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 not-prose">
                    Scenario
                  </p>
                  <p className="text-sm mb-4">{content.example}</p>
                  {content.exampleSolution && (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 not-prose">
                        What you would do
                      </p>
                      <p className="text-sm mb-0">{content.exampleSolution}</p>
                    </>
                  )}
                </SectionCard>
              )}
            </div>

            {content.practiceTask && (
              <SectionCard
                id="practice"
                title="Practice Task"
                icon={<PenLine className="h-5 w-5 text-accent shrink-0" />}
              >
                <p className="text-sm mb-0">{content.practiceTask}</p>
              </SectionCard>
            )}

            {includeCode && content.code && (
              <SectionCard
                id="code"
                title="Code Walkthrough"
                icon={<Code className="h-5 w-5 text-accent shrink-0" />}
              >
                <p className="text-sm text-text-muted mb-4 not-prose">
                  Highlighted lines show where{" "}
                  <strong className="text-amber-600 dark:text-amber-400/90">{mod.title}</strong>{" "}
                  happens in the code.
                </p>
                <LessonCodeBlock
                  code={content.code}
                  language={content.codeLanguage}
                  title={mod.title}
                  showFocusHighlights
                />
              </SectionCard>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              {content.commandsToRemember && content.commandsToRemember.length > 0 && (
                <SectionCard
                  id="commands"
                  title="Commands"
                  icon={<Terminal className="h-5 w-5 text-accent shrink-0" />}
                  className="lg:col-span-1"
                >
                  <CommandsCard commands={content.commandsToRemember} />
                </SectionCard>
              )}

              <SectionCard
                id="revision"
                title="Cheat Sheet"
                icon={<BookOpen className="h-5 w-5 text-accent shrink-0" />}
                className={content.commandsToRemember?.length ? "lg:col-span-1" : "lg:col-span-2"}
              >
                <RevisionCard
                  title="Quick recap"
                  duration="quick ref"
                  variant="cheatSheet"
                  items={cheatSheet}
                />
              </SectionCard>
            </div>

            {content.commonMistakes && content.commonMistakes.length > 0 && (
              <SectionCard
                id="mistakes"
                title="Common Mistakes"
                icon={<AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />}
              >
                <ul className="text-sm space-y-2 mb-0">
                  {content.commonMistakes.map((mistake, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-amber-500 shrink-0">✕</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}

            {/* Prev / Next */}
            <nav className="grid sm:grid-cols-2 gap-4 pt-2">
              {prevMod ? (
                <Link
                  href={`/roadmap/${slug}/${prevMod.slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-surface p-5 hover:border-accent/40 hover:bg-surface-elevated transition-colors"
                >
                  <span className="text-xs text-text-muted mb-1 flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" /> Previous
                  </span>
                  <span className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {prevMod.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {nextMod ? (
                <Link
                  href={`/roadmap/${slug}/${nextMod.slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-surface p-5 hover:border-accent/40 hover:bg-surface-elevated transition-colors sm:text-right"
                >
                  <span className="text-xs text-text-muted mb-1 flex items-center gap-1 sm:justify-end">
                    Next <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {nextMod.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          </div>

          {/* Sidebar */}
          <aside className="hidden xl:block space-y-6 sticky top-36">
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                {phase.subtitle} modules
              </p>
              <nav className="space-y-0.5 max-h-[40vh] overflow-y-auto">
                {phase.modules.map((m, i) => (
                  <Link
                    key={m.slug}
                    href={`/roadmap/${slug}/${m.slug}`}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
                      m.slug === mod.slug
                        ? "bg-accent/10 text-accent font-medium"
                        : "text-text-muted hover:text-text-secondary hover:bg-surface-elevated"
                    )}
                  >
                    <span className="font-mono text-[10px] w-4">{i}</span>
                    {m.title}
                  </Link>
                ))}
              </nav>
            </div>
            <LessonNav sections={activeSections} />
          </aside>
        </div>
      </div>
    </div>
  );
}
