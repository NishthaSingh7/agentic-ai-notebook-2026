import type { LessonContent } from "@/data/lesson-types";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  HelpCircle,
  Layers,
  Code,
  FolderKanban,
  MessageSquare,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import type { Phase, Module } from "@/data/roadmap";
import { LessonNav, LessonSection, RevisionCard, InterviewQ } from "@/components/lesson";
import { LessonCodeBlock } from "@/components/lesson-code-block";
import { MermaidDiagram } from "@/components/mermaid-diagram";

interface LegacyLessonViewProps {
  phase: Phase;
  mod: Module;
  content: LessonContent;
  readTime: number | null;
  prevMod: Module | null;
  nextMod: Module | null;
  slug: string;
}

const lessonSections = [
  { id: "concept", title: "Concept" },
  { id: "why", title: "Why It Exists" },
  { id: "analogy", title: "Real-World Analogy" },
  { id: "technical", title: "Technical Explanation" },
  { id: "architecture", title: "Architecture" },
  { id: "diagram", title: "Diagram" },
  { id: "example", title: "Example" },
  { id: "code", title: "Code" },
  { id: "project", title: "Project" },
  { id: "mistakes", title: "Common Mistakes" },
  { id: "interview", title: "Interview Questions" },
  { id: "revision", title: "Revision Notes" },
];

export function LegacyLessonView({
  phase,
  mod,
  content,
  readTime,
  prevMod,
  nextMod,
  slug,
}: LegacyLessonViewProps) {
  const activeSections = lessonSections.filter((s) => {
    if (s.id === "architecture") return !!content.architecture;
    if (s.id === "diagram") return !!content.diagram;
    if (s.id === "code") return !!content.code;
    if (s.id === "project") return !!content.project;
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
        <div className="lg:col-span-3 space-y-10">
          <header>
            <span className="text-xs font-mono text-accent">{phase.subtitle}</span>
            <h1 className="text-3xl font-bold mt-1 mb-2">{mod.title}</h1>
            {readTime ? (
              <p className="text-sm text-text-muted">~{readTime} min read</p>
            ) : null}
          </header>

          <LessonSection id="concept" title="Concept" icon={<BookOpen className="h-5 w-5 text-accent" />}>
            <p>{content.concept}</p>
          </LessonSection>

          <LessonSection id="why" title="Why Does It Exist?" icon={<HelpCircle className="h-5 w-5 text-accent" />}>
            <p>{content.whyItExists}</p>
          </LessonSection>

          <LessonSection id="analogy" title="Real-World Analogy" icon={<Lightbulb className="h-5 w-5 text-accent" />}>
            <blockquote>{content.analogy}</blockquote>
          </LessonSection>

          <LessonSection id="technical" title="Technical Explanation" icon={<Layers className="h-5 w-5 text-accent" />}>
            <p>{content.technicalExplanation}</p>
          </LessonSection>

          {content.architecture && (
            <LessonSection id="architecture" title="Architecture" icon={<Layers className="h-5 w-5 text-accent" />}>
              <p>{content.architecture}</p>
            </LessonSection>
          )}

          {content.diagram && (
            <LessonSection id="diagram" title="Visual Diagram" icon={<Layers className="h-5 w-5 text-accent" />}>
              <MermaidDiagram chart={content.diagram} title="Architecture Flow" />
            </LessonSection>
          )}

          <LessonSection id="example" title="Example">
            <p>{content.example}</p>
          </LessonSection>

          {content.code && (
            <LessonSection id="code" title="Code" icon={<Code className="h-5 w-5 text-accent" />}>
              <LessonCodeBlock code={content.code} language={content.codeLanguage} title={mod.title} />
            </LessonSection>
          )}

          {content.project && (
            <LessonSection id="project" title="Mini Project" icon={<FolderKanban className="h-5 w-5 text-accent" />}>
              <p>{content.project}</p>
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

          <LessonSection id="interview" title="Interview Questions" icon={<MessageSquare className="h-5 w-5 text-accent" />}>
            {content.interviewQuestions.length > 0 ? (
              <div className="space-y-3 not-prose">
                {content.interviewQuestions.map((q, i) => (
                  <InterviewQ key={i} question={q.question} answer={q.answer} difficulty={q.difficulty} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-secondary">
                Interview questions for this module will be added when the lesson is complete.
              </p>
            )}
          </LessonSection>

          <LessonSection id="revision" title="Revision Notes" icon={<BookOpen className="h-5 w-5 text-accent" />}>
            <div className="grid sm:grid-cols-2 gap-4 not-prose">
              <RevisionCard title="5-Minute Revision" duration="5 min" items={content.revisionNotes.fiveMin} />
              <RevisionCard title="15-Minute Revision" duration="15 min" items={content.revisionNotes.fifteenMin} />
              <RevisionCard title="1-Hour Deep Dive" duration="1 hour" items={content.revisionNotes.oneHour} />
              <RevisionCard title="Cheat Sheet" duration="quick ref" items={content.revisionNotes.cheatSheet} />
            </div>
          </LessonSection>

          {content.furtherReading && content.furtherReading.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Further Reading</h2>
              <ul className="space-y-2">
                {content.furtherReading.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:underline"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

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
