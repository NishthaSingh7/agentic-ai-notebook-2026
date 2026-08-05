import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight, Layers, Rocket } from "lucide-react";
import {
  projects,
  difficultyColors,
  difficultyLabels,
  countByDifficulty,
  type ProjectDifficulty,
} from "@/data/projects";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Hands-on AI Engineering projects from beginner to production — with architecture diagrams, walkthrough slides, time breakdowns, and resume points.",
};

const difficulties: ProjectDifficulty[] = ["beginner", "intermediate", "advanced", "production"];

const difficultyDescriptions: Record<ProjectDifficulty, string> = {
  beginner: "First AI apps — RAG basics, single API calls, simple UIs",
  intermediate: "Multi-component systems — search, APIs, integrations",
  advanced: "Agents, voice, multi-agent orchestration",
  production: "Observability, gateways, K8s, multi-tenant SaaS",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-medium text-accent mb-2">Portfolio builders</p>
        <h1 className="text-3xl font-bold mb-3">Projects</h1>
        <p className="text-text-secondary leading-relaxed">
          {projects.length} hands-on builds with architecture diagrams, slide walkthroughs, hour-by-hour
          build plans, and interview prep. Open any project for the full blueprint.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
        {difficulties.map((d) => (
          <div
            key={d}
            className={cn(
              "rounded-xl border p-4 text-center",
              difficultyColors[d]
            )}
          >
            <div className="text-2xl font-bold tabular-nums">{countByDifficulty(d)}</div>
            <div className="text-xs font-semibold uppercase tracking-wide mt-0.5">
              {difficultyLabels[d]}
            </div>
          </div>
        ))}
      </div>

      {difficulties.map((difficulty) => {
        const filtered = projects.filter((p) => p.difficulty === difficulty);
        if (filtered.length === 0) return null;

        return (
          <section key={difficulty} id={difficulty} className="mb-14 scroll-mt-20">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-bold capitalize flex items-center gap-2">
                  {difficulty === "production" && <Rocket className="h-5 w-5 text-rose-600" />}
                  {difficultyLabels[difficulty]}
                </h2>
                <p className="text-sm text-text-muted mt-1">{difficultyDescriptions[difficulty]}</p>
              </div>
              <span className="text-xs text-text-muted tabular-nums">
                {filtered.length} project{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-surface p-5 transition-all hover:border-accent/30 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-semibold leading-snug group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <span
                      className={cn(
                        "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase",
                        difficultyColors[project.difficulty]
                      )}
                    >
                      {project.difficulty}
                    </span>
                  </div>

                  <p className="text-sm text-text-secondary mb-4 line-clamp-2 flex-1">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-surface-elevated px-2 py-0.5 text-[10px] text-text-muted font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="text-[10px] text-text-muted self-center">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-border">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {project.estimatedHours}h total
                    </span>
                    <span className="flex items-center gap-1 text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      <Layers className="h-3 w-3" />
                      Walkthrough
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
