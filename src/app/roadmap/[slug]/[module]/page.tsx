import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { phases, getPhaseBySlug, getModule } from "@/data/roadmap";
import { getLessonContent, getDefaultLesson, hasLessonContent, getLessonReadTime, isPhaseComplete } from "@/data/lessons";
import { LessonNav, LessonSection, RevisionCard, InterviewQ } from "@/components/lesson";
import { ContentStatusBanner } from "@/components/content-status-banner";
import { MermaidDiagram } from "@/components/mermaid-diagram";

interface Props {
  params: Promise<{ slug: string; module: string }>;
}

export async function generateStaticParams() {
  return phases.flatMap((phase) =>
    phase.modules.map((mod) => ({
      slug: phase.slug,
      module: mod.slug,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, module: moduleSlug } = await params;
  const mod = getModule(slug, moduleSlug);
  if (!mod) return { title: "Not Found" };
  return { title: mod.title, description: `Learn ${mod.title} — lesson, code, interview questions, and revision notes.` };
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

export default async function ModulePage({ params }: Props) {
  const { slug, module: moduleSlug } = await params;
  const phase = getPhaseBySlug(slug);
  const mod = getModule(slug, moduleSlug);
  if (!phase || !mod) notFound();

  const content = getLessonContent(slug, moduleSlug) ?? getDefaultLesson(mod.title, phase.title);
  const isComplete = hasLessonContent(slug, moduleSlug);
  const readTime = getLessonReadTime(slug, moduleSlug);

  const moduleIndex = phase.modules.findIndex((m) => m.slug === moduleSlug);
  const prevMod = moduleIndex > 0 ? phase.modules[moduleIndex - 1] : null;
  const nextMod = moduleIndex < phase.modules.length - 1 ? phase.modules[moduleIndex + 1] : null;

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
            {isComplete && readTime ? (
              <p className="text-sm text-text-muted">
                ~{readTime} min read
              </p>
            ) : (
              <p className="text-sm text-amber-400/80">Draft — full lesson content coming soon</p>
            )}
          </header>

          {!isComplete && !isPhaseComplete(slug) && <ContentStatusBanner />}

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
              <pre><code>{content.code}</code></pre>
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
                Browse <Link href="/interview" className="text-accent hover:underline">Interview Prep</Link> for related topics.
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
            ) : <div />}
            {nextMod ? (
              <Link
                href={`/roadmap/${slug}/${nextMod.slug}`}
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
              >
                {nextMod.title} <ArrowRight className="h-4 w-4" />
              </Link>
            ) : <div />}
          </nav>
        </div>

        <aside className="hidden lg:block">
          <LessonNav sections={activeSections} />
        </aside>
      </div>
    </div>
  );
}
