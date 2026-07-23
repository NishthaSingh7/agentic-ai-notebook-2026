import type { LessonContent } from "@/data/lesson-types";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  HelpCircle,
  Layers,
  BookOpen,
  AlertTriangle,
  Terminal,
  Code,
} from "lucide-react";
import type { Phase, Module } from "@/data/roadmap";
import { LessonNav, LessonSection, RevisionCard, CommandsCard } from "@/components/lesson";
import { LessonCodeBlock } from "@/components/lesson-code-block";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { buildConceptBullets } from "@/lib/lesson-concept-bullets";

interface CurriculumLessonViewProps {
  phase: Phase;
  mod: Module;
  content: LessonContent;
  readTime: number | null;
  prevMod: Module | null;
  nextMod: Module | null;
  slug: string;
  includeCode?: boolean;
}

function buildSections(includeCode: boolean) {
  const sections = [
    { id: "concept", title: "Concept & How It Works" },
    { id: "why", title: "Why It Exists" },
    { id: "analogy", title: "Real-World Analogy" },
    { id: "diagram", title: "Visual Diagram" },
  ];
  if (includeCode) sections.push({ id: "code", title: "Code Walkthrough" });
  sections.push(
    { id: "commands", title: "Commands to Remember" },
    { id: "mistakes", title: "Common Mistakes" },
    { id: "revision", title: "Cheat Sheet" }
  );
  return sections;
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
}: CurriculumLessonViewProps) {
  const conceptBullets = buildConceptBullets(content.concept, content.technicalExplanation);

  const cheatSheet = content.revisionNotes.cheatSheet.slice(0, 8);
  const sectionDefs = buildSections(includeCode);

  const activeSections = sectionDefs.filter((s) => {
    if (s.id === "diagram") return !!content.diagram;
    if (s.id === "code") return includeCode && !!content.code;
    if (s.id === "commands") return !!content.commandsToRemember?.length;
    if (s.id === "mistakes") return !!content.commonMistakes;
    return true;
  });

  return (
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
            <span className="text-xs font-mono text-accent">{phase.subtitle}</span>
            <h1 className="text-3xl font-bold mt-1 mb-2">{mod.title}</h1>
            {readTime ? (
              <p className="text-sm text-text-muted">~{readTime} min read</p>
            ) : null}
          </header>

          <LessonSection
            id="concept"
            title="Concept & How It Works"
            icon={<BookOpen className="h-5 w-5 text-accent" />}
          >
            <ul>
              {conceptBullets.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </LessonSection>

          <LessonSection id="why" title="Why Does It Exist?" icon={<HelpCircle className="h-5 w-5 text-accent" />}>
            <p>{content.whyItExists}</p>
          </LessonSection>

          <LessonSection id="analogy" title="Real-World Analogy" icon={<Lightbulb className="h-5 w-5 text-accent" />}>
            <blockquote className="mb-0">{content.analogy}</blockquote>
            {content.analogyDiagram && (
              <MermaidDiagram chart={content.analogyDiagram} compact sketch />
            )}
          </LessonSection>

          {content.diagram && (
            <LessonSection id="diagram" title="Visual Diagram" icon={<Layers className="h-5 w-5 text-accent" />}>
              <MermaidDiagram chart={content.diagram} title={`What is ${mod.title}?`} sketch />
            </LessonSection>
          )}

          {includeCode && content.code && (
            <LessonSection id="code" title="Code Walkthrough" icon={<Code className="h-5 w-5 text-accent" />}>
              <p className="text-sm text-text-muted mb-3 not-prose">
                Highlighted lines show where <strong className="text-amber-400/90">{mod.title}</strong> happens in
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
              title="Commands to Remember"
              icon={<Terminal className="h-5 w-5 text-accent" />}
            >
              <CommandsCard commands={content.commandsToRemember} />
            </LessonSection>
          )}

          {content.commonMistakes && (
            <LessonSection id="mistakes" title="Common Mistakes" icon={<AlertTriangle className="h-5 w-5 text-amber-400" />}>
              <ul>
                {content.commonMistakes.map((mistake, i) => (
                  <li key={i}>{mistake}</li>
                ))}
              </ul>
            </LessonSection>
          )}

          <LessonSection id="revision" title="Cheat Sheet" icon={<BookOpen className="h-5 w-5 text-accent" />}>
            <p className="text-sm text-text-muted mb-4 not-prose">
              Quick recap — the most important points from this module.
            </p>
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

        <aside className="hidden lg:block">
          <LessonNav sections={activeSections} />
        </aside>
      </div>
    </div>
  );
}

/** @deprecated Use CurriculumLessonView with includeCode={false} */
export function Phase0LessonView(
  props: Omit<CurriculumLessonViewProps, "includeCode">
) {
  return <CurriculumLessonView {...props} includeCode={false} />;
}
