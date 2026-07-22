import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle } from "lucide-react";
import { projects, getProjectBySlug, difficultyColors } from "@/data/projects";
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

  const sections = [
    { title: "Overview", content: project.description },
    {
      title: "Architecture",
      content: `A ${project.difficulty}-level project using ${project.techStack.join(", ")}. The architecture follows a modular design with clear separation between data ingestion, AI processing, and user interface layers.`,
    },
    {
      title: "Tech Stack",
      content: project.techStack.join(" · "),
    },
    {
      title: "Features",
      items: project.features,
    },
    {
      title: "Resume Points",
      items: project.resumePoints,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary mb-6 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase", difficultyColors[project.difficulty])}>
            {project.difficulty}
          </span>
          <span className="flex items-center gap-1 text-sm text-text-muted">
            <Clock className="h-3.5 w-3.5" /> ~{project.estimatedHours} hours
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-3">{project.title}</h1>
        <p className="text-text-secondary leading-relaxed">{project.description}</p>
      </header>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-border">
              {section.title}
            </h2>
            {"items" in section && section.items ? (
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-secondary leading-relaxed">{section.content}</p>
            )}
          </section>
        ))}

        <section>
          <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-border">
            Interview Questions
          </h2>
          <div className="space-y-3">
            <details className="rounded-xl border border-border bg-surface overflow-hidden">
              <summary className="cursor-pointer px-5 py-4 text-sm font-medium hover:bg-surface-elevated">
                How would you architect this project for production?
              </summary>
              <div className="px-5 pb-4 text-sm text-text-secondary border-t border-border pt-3">
                Discuss: API design, error handling, observability (tracing, logging), cost optimization
                (caching, model routing), security (input validation, rate limiting), and deployment
                strategy (Docker, CI/CD, auto-scaling).
              </div>
            </details>
            <details className="rounded-xl border border-border bg-surface overflow-hidden">
              <summary className="cursor-pointer px-5 py-4 text-sm font-medium hover:bg-surface-elevated">
                What were the biggest challenges building this?
              </summary>
              <div className="px-5 pb-4 text-sm text-text-secondary border-t border-border pt-3">
                Focus on AI-specific challenges: prompt reliability, hallucination handling, latency
                optimization, cost management, and evaluation of AI output quality.
              </div>
            </details>
          </div>
        </section>
      </div>
    </div>
  );
}
