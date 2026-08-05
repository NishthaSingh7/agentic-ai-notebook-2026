import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Wrench,
  Target,
  ListChecks,
  MessageSquare,
} from "lucide-react";
import {
  projects,
  getProjectBySlug,
  difficultyColors,
  difficultyLabels,
} from "@/data/projects";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { ProjectSlideshow } from "@/components/project-slideshow";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Not Found" };
  return { title: project.title, description: project.description };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const totalHours = project.timeBreakdown.reduce((s, p) => s + p.hours, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary mb-6 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
      </Link>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase",
              difficultyColors[project.difficulty]
            )}
          >
            {difficultyLabels[project.difficulty]}
          </span>
          <span className="text-sm text-text-muted">Phase {project.phase}</span>
          <span className="flex items-center gap-1 text-sm text-text-muted">
            <Clock className="h-3.5 w-3.5" /> {project.estimatedHours} hours
            {totalHours === project.estimatedHours && (
              <span className="text-success text-xs">(broken down below)</span>
            )}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{project.title}</h1>
        <p className="text-text-secondary leading-relaxed text-lg">{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-mono text-text-muted"
            >
              {tech}
            </span>
          ))}
        </div>
      </header>

      {/* Slide walkthrough — primary learning surface */}
      <section className="mb-12">
        <ProjectSlideshow slides={project.slides} projectTitle={project.title} />
      </section>

      {/* Time breakdown */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-accent" />
          Time breakdown ({project.estimatedHours}h)
        </h2>
        <p className="text-sm text-text-muted mb-4">
          Each phase maps to the estimated hours — follow in order for a realistic build schedule.
        </p>
        <div className="space-y-4">
          {project.timeBreakdown.map((phase) => (
            <div
              key={phase.phase}
              className="rounded-xl border border-border bg-surface overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border bg-surface-elevated/50">
                <h3 className="font-medium text-sm">{phase.phase}</h3>
                <span className="text-sm font-mono text-accent tabular-nums shrink-0">
                  {phase.hours}h
                </span>
              </div>
              <div className="h-1.5 bg-surface-elevated">
                <div
                  className="h-full brand-gradient"
                  style={{ width: `${(phase.hours / project.estimatedHours) * 100}%` }}
                />
              </div>
              <ul className="px-5 py-4 space-y-2">
                {phase.tasks.map((task) => (
                  <li key={task} className="flex gap-2 text-sm text-text-secondary">
                    <span className="text-accent shrink-0">•</span>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <Target className="h-5 w-5 text-accent" />
          Architecture
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-5">
          {project.architectureExplanation}
        </p>
        <MermaidDiagram chart={project.architectureDiagram} sketch zoomable />
      </section>

      {/* Setup & prerequisites */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-accent" />
            Prerequisites
          </h2>
          <ul className="space-y-2">
            {project.prerequisites.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-text-secondary">
                <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-accent" />
            Setup steps
          </h2>
          <ol className="space-y-2 list-decimal list-inside">
            {project.setupSteps.map((step) => (
              <li key={step} className="text-sm text-text-secondary leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Features & outcome */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3">Features to build</h2>
        <ul className="grid sm:grid-cols-2 gap-2 mb-6">
          {project.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-sm text-text-secondary rounded-lg border border-border bg-surface px-3 py-2"
            >
              <CheckCircle className="h-4 w-4 text-accent shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
          <h3 className="font-semibold text-sm mb-2 text-text-primary">Expected result</h3>
          <p className="text-sm text-text-secondary leading-relaxed">{project.expectedOutcome}</p>
        </div>
      </section>

      {/* Resume */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3">Resume bullet points</h2>
        <ul className="space-y-2">
          {project.resumePoints.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2 text-sm text-text-secondary rounded-lg border border-border bg-surface px-4 py-3"
            >
              <span className="text-accent font-bold shrink-0">→</span>
              {point}
            </li>
          ))}
        </ul>
      </section>

      {/* Interview */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-accent" />
          Interview questions
        </h2>
        <div className="space-y-3">
          {project.interviewQuestions.map((iq) => (
            <details
              key={iq.question}
              className="rounded-xl border border-border bg-surface overflow-hidden group"
            >
              <summary className="cursor-pointer px-5 py-4 text-sm font-medium hover:bg-surface-elevated transition-colors">
                {iq.question}
              </summary>
              <div className="px-5 pb-4 text-sm text-text-secondary border-t border-border pt-3 leading-relaxed">
                {iq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
