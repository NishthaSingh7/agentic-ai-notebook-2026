import type { LessonContent } from "@/data/lesson-types";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  HelpCircle,
  BookOpen,
  AlertTriangle,
  Terminal,
  Code,
  PenLine,
  ListChecks,
  Layers,
} from "lucide-react";
import type { Phase, Module } from "@/data/roadmap";
import { LessonNav, LessonSection, RevisionCard, CommandsCard } from "@/components/lesson";
import { LessonCodeBlock } from "@/components/lesson-code-block";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { buildConceptBullets } from "@/lib/lesson-concept-bullets";
import { buildLessonSections, VisualWorkflows } from "@/components/lesson-visual-blocks";
import {
  HighlightCanvas,
  HighlightToolbar,
  LessonHighlightShell,
} from "@/components/lesson-highlights";
import { ModuleCompleteButton } from "@/components/module-complete-button";

interface CurriculumLessonViewProps {
  phase: Phase;
  mod: Module;
  content: LessonContent;
  readTime: number | null;
  prevMod: Module | null;
  nextMod: Module | null;
  slug: string;
  includeCode?: boolean;
  showOrientationExtras?: boolean;
}

export function CurriculumLessonView({
  phase,
  mod,
  content,
  readTime,
  prevMod,
  nextMod,
  slug,
  includeCode = false,
  showOrientationExtras = false,
}: CurriculumLessonViewProps) {
  const visualFirst = content.visualFirst ?? false;
  const conceptBullets = buildConceptBullets(content.concept, content.technicalExplanation).slice(
    visualFirst ? 4 : 8
  );
  const cheatSheet = content.revisionNotes.cheatSheet.slice(0, 8);
  const sectionDefs = buildLessonSections(includeCode, content, showOrientationExtras, visualFirst);

  const activeSections = sectionDefs.filter((s) => {
    if (s.id === "diagram") {
      return !!content.diagram || !!content.workflowDiagrams?.length || (visualFirst && !!content.analogyDiagram);
    }
    if (s.id.startsWith("workflow-")) {
      const idx = Number(s.id.replace("workflow-", ""));
      return !!content.workflowDiagrams?.[idx];
    }
    if (s.id === "example") return showOrientationExtras && !!content.example && !visualFirst;
    if (s.id === "practice") return showOrientationExtras && !!content.practiceTask;
    if (s.id === "code") return includeCode && !!content.code;
    if (s.id === "commands") return !!content.commandsToRemember?.length;
    if (s.id === "mistakes") return !!content.commonMistakes && !visualFirst;
    return true;
  });

  const visualWorkflowsBlock =
    content.diagram || content.workflowDiagrams?.length || (visualFirst && content.analogyDiagram) ? (
      <LessonSection id="diagram" title="Visual Workflows" icon={<Layers className="h-5 w-5 text-accent" />}>
        {visualFirst && (
          <p className="text-sm text-text-muted mb-4 not-prose">
            Study the diagrams first — <strong>scroll</strong> inside each frame to pan, then zoom with{" "}
            <strong>+</strong> / <strong>−</strong> (up to 200%).
          </p>
        )}
        <VisualWorkflows content={content} mod={mod} visualFirst={visualFirst} />
      </LessonSection>
    ) : null;

  const conceptBlock = (
    <LessonSection
      id="concept"
      title={visualFirst ? "Key Takeaways" : "Concept & How It Works"}
      icon={<BookOpen className="h-5 w-5 text-accent" />}
    >
      {visualFirst && (
        <p className="text-sm text-text-secondary mb-3 not-prose italic border-l-2 border-accent/40 pl-3">
          {content.analogy}
        </p>
      )}
      <ul
        className={
          visualFirst
            ? "not-prose text-sm space-y-2 text-text-secondary list-none pl-0"
            : "not-prose text-sm space-y-2 text-text-secondary list-disc pl-5"
        }
      >
        {conceptBullets.length > 0 ? (
          conceptBullets.map((point, i) => (
            <li key={i} className={visualFirst ? "flex gap-2" : undefined}>
              {visualFirst && <span className="text-accent font-bold shrink-0">{i + 1}.</span>}
              <span>{point}</span>
            </li>
          ))
        ) : (
          <li className="text-text-muted italic">Key points are in the visual diagram above.</li>
        )}
      </ul>
      {!visualFirst && content.learnElsewhere && content.learnElsewhere.length > 0 && (
        <div className="mt-6 not-prose rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400/90 mb-2">
            <ListChecks className="h-4 w-4" />
            Learn these elsewhere (not covered in depth here)
          </p>
          <ul className="space-y-1 text-sm text-text-secondary">
            {content.learnElsewhere.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-amber-600/70 dark:text-amber-400/70">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {visualFirst && content.learnElsewhere && content.learnElsewhere.length > 0 && (
        <div className="mt-4 not-prose rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400/90 mb-2">
            <ListChecks className="h-3.5 w-3.5" />
            Learn elsewhere (not covered here)
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-text-secondary">
            {content.learnElsewhere.map((item, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="text-amber-600/70 dark:text-amber-400/70 shrink-0">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </LessonSection>
  );

  return (
    <LessonHighlightShell enabled phaseSlug={slug} moduleSlug={mod.slug}>
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <Link
          href={`/roadmap/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {phase.title}
        </Link>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <header>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-accent">{phase.subtitle}</span>
                <h1 className="text-3xl font-bold mt-1 mb-2">{mod.title}</h1>
                {visualFirst ? (
                  <p className="text-sm text-text-secondary max-w-2xl">{content.whyItExists}</p>
                ) : readTime ? (
                  <p className="text-sm text-text-muted">~{readTime} min read</p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0" data-no-highlight>
                <HighlightToolbar />
                <ModuleCompleteButton
                  phaseSlug={slug}
                  moduleSlug={mod.slug}
                  moduleTitle={mod.title}
                />
              </div>
            </div>
          </header>

          <HighlightCanvas>
          <div className="space-y-8">
          {visualFirst ? (
            <>
              {visualWorkflowsBlock}
              {conceptBlock}
            </>
          ) : (
            <>
              {conceptBlock}
              <LessonSection id="why" title="Why Does It Exist?" icon={<HelpCircle className="h-5 w-5 text-accent" />}>
                <p>{content.whyItExists}</p>
              </LessonSection>
              <LessonSection id="analogy" title="Real-World Analogy" icon={<Lightbulb className="h-5 w-5 text-accent" />}>
                <blockquote className="mb-0">{content.analogy}</blockquote>
                {content.analogyDiagram && (
                  <MermaidDiagram chart={content.analogyDiagram} compact sketch />
                )}
              </LessonSection>
              {visualWorkflowsBlock}
            </>
          )}

          {showOrientationExtras && content.example && !visualFirst && (
            <LessonSection id="example" title="Example" icon={<BookOpen className="h-5 w-5 text-accent" />}>
              <p className="font-medium text-text-primary mb-2">Scenario</p>
              <p className="mb-4">{content.example}</p>
              {content.exampleSolution && (
                <>
                  <p className="font-medium text-text-primary mb-2">Solution</p>
                  <p>{content.exampleSolution}</p>
                </>
              )}
            </LessonSection>
          )}

          {showOrientationExtras && content.practiceTask && (
            <LessonSection id="practice" title="Practice Task" icon={<PenLine className="h-5 w-5 text-accent" />}>
              {!visualFirst && (
                <p className="text-sm text-text-muted mb-3 not-prose">
                  Do this before moving to the next module — reading alone is not enough.
                </p>
              )}
              <p className={visualFirst ? "text-sm" : undefined}>{content.practiceTask}</p>
            </LessonSection>
          )}

          {includeCode && content.code && (
            <LessonSection id="code" title="Code Walkthrough" icon={<Code className="h-5 w-5 text-accent" />}>
              <p className="text-sm text-text-muted mb-3 not-prose">
                Highlighted lines show where <strong className="text-amber-600 dark:text-amber-400/90">{mod.title}</strong> happens in
                the code.
              </p>
              <LessonCodeBlock
                code={content.code}
                language={content.codeLanguage}
                title={mod.title}
                showFocusHighlights
              />
            </LessonSection>
          )}

          {content.commandsToRemember && content.commandsToRemember.length > 0 && (
            <LessonSection
              id="commands"
              title={visualFirst ? "Commands" : "Commands to Remember"}
              icon={<Terminal className="h-5 w-5 text-accent" />}
            >
              <CommandsCard commands={content.commandsToRemember} />
            </LessonSection>
          )}

          {content.commonMistakes && !visualFirst && (
            <LessonSection id="mistakes" title="Common Mistakes" icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}>
              <ul>
                {content.commonMistakes.map((mistake, i) => (
                  <li key={i}>{mistake}</li>
                ))}
              </ul>
            </LessonSection>
          )}

          <LessonSection id="revision" title="Cheat Sheet" icon={<BookOpen className="h-5 w-5 text-accent" />}>
            {!visualFirst && (
              <p className="text-sm text-text-muted mb-4 not-prose">
                Quick recap — the most important points from this module.
              </p>
            )}
            <RevisionCard
              title="Cheat Sheet"
              duration="quick ref"
              variant="cheatSheet"
              items={cheatSheet}
            />
          </LessonSection>

          <nav className="flex items-center justify-between border-t border-border pt-6">
            {prevMod ? (
              <Link
                href={`/roadmap/${slug}/${prevMod.slug}`}
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> {prevMod.title}
              </Link>
            ) : (
              <div />
            )}
            {nextMod ? (
              <Link
                href={`/roadmap/${slug}/${nextMod.slug}`}
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
              >
                {nextMod.title} <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <div />
            )}
          </nav>
          </div>
          </HighlightCanvas>
        </div>

        <aside className="hidden lg:block">
          <LessonNav sections={activeSections} />
        </aside>
      </div>
    </div>
    </LessonHighlightShell>
  );
}

/** @deprecated Use CurriculumLessonView with includeCode={false} */
export function Phase0LessonView(
  props: Omit<CurriculumLessonViewProps, "includeCode">
) {
  return <CurriculumLessonView {...props} includeCode={false} />;
}
