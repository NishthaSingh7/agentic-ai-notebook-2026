"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Layers,
  Rocket,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import {
  projects,
  difficultyColors,
  difficultyLabels,
  countByDifficulty,
  type Project,
  type ProjectDifficulty,
} from "@/data/projects";
import { cn } from "@/lib/utils";

const difficulties: ProjectDifficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
  "production",
];

const difficultyDescriptions: Record<ProjectDifficulty, string> = {
  beginner: "Ship your first AI apps — RAG, APIs, and a UI you can demo.",
  intermediate: "Wire search, protocols, and real integrations.",
  advanced: "Agents, voice, and multi-agent systems that plan and act.",
  production: "Observability, gateways, Kubernetes, multi-tenant SaaS.",
};

const difficultyAccent: Record<ProjectDifficulty, string> = {
  beginner: "from-accent to-accent/70",
  intermediate: "from-royal to-royal/70",
  advanced: "from-amber-500 to-amber-600",
  production: "from-rose-500 to-rose-600",
};

const difficultyIcon: Record<ProjectDifficulty, typeof Sparkles> = {
  beginner: Sparkles,
  intermediate: Zap,
  advanced: Target,
  production: Rocket,
};

function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: Project;
  index: number;
  featured?: boolean;
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.28 }}
      className={featured ? "sm:col-span-2 lg:col-span-3" : undefined}
    >
      <Link
        href={`/projects/${project.slug}`}
        className={cn(
          "group relative flex h-full overflow-hidden rounded-2xl border border-border bg-surface transition-all",
          "hover:border-accent/40 hover:shadow-lg hover:-translate-y-0.5",
          featured && "bg-gradient-to-br from-accent/10 via-surface to-royal/10"
        )}
      >
        <div
          className={cn(
            "w-1.5 shrink-0 bg-gradient-to-b",
            difficultyAccent[project.difficulty]
          )}
        />

        <div
          className={cn(
            "flex flex-1 flex-col p-5",
            featured && "sm:flex-row sm:items-stretch sm:gap-8 sm:p-7"
          )}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono text-xs text-text-muted tabular-nums">
                  {number}
                </span>
                {featured && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-on-accent">
                    Start here
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase",
                  difficultyColors[project.difficulty]
                )}
              >
                {difficultyLabels[project.difficulty]}
              </span>
            </div>

            <h3
              className={cn(
                "font-semibold leading-snug group-hover:text-accent transition-colors",
                featured ? "text-2xl sm:text-3xl mb-2" : "mb-2"
              )}
            >
              {project.title}
            </h3>
            <p
              className={cn(
                "text-sm text-text-secondary",
                featured ? "max-w-xl mb-4" : "line-clamp-2 mb-4"
              )}
            >
              {project.description}
            </p>

            {featured && (
              <ul className="hidden sm:grid grid-cols-2 gap-x-4 gap-y-1.5 mb-5 max-w-lg">
                {project.features.slice(0, 4).map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-xs text-text-secondary"
                  >
                    <span className="h-1 w-1 rounded-full bg-accent shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.techStack.slice(0, featured ? 6 : 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-background/80 border border-border/80 px-2 py-0.5 text-[10px] text-text-muted font-mono"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > (featured ? 6 : 4) && (
                <span className="text-[10px] text-text-muted self-center">
                  +{project.techStack.length - (featured ? 6 : 4)}
                </span>
              )}
            </div>
          </div>

          <div
            className={cn(
              "flex items-center justify-between gap-3 pt-3 border-t border-border mt-auto",
              featured &&
                "sm:flex-col sm:items-end sm:justify-between sm:border-t-0 sm:border-l sm:pl-8 sm:pt-0 sm:min-w-[180px]"
            )}
          >
            <div className={cn("flex gap-3 text-xs text-text-muted", featured && "sm:flex-col sm:items-end sm:gap-2")}>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {project.estimatedHours}h build
              </span>
              <span className="flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" />
                Phase {project.phase}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
              Open blueprint
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProjectsIndex() {
  const totalHours = projects.reduce((sum, project) => sum + project.estimatedHours, 0);
  const startProject = projects.find((project) => project.difficulty === "beginner") ?? projects[0];
  const startIndex = projects.findIndex((project) => project.slug === startProject.slug);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(194,65,12,0.10),transparent)]" />
        <div className="absolute inset-0 grid-bg opacity-40" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
            Build · Demo · Get hired
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.12] mb-4 max-w-3xl">
            Projects you can{" "}
            <span className="gradient-text">actually ship</span>
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mb-8">
            {projects.length} blueprints with architecture, hour-by-hour plans, and interview
            talking points. Pick a level. Open a build. Leave with something that belongs on a
            resume.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <div className="rounded-2xl border border-border bg-background/70 px-5 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Builds
              </p>
              <p className="text-2xl font-bold tabular-nums">{projects.length}</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/70 px-5 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Guided hours
              </p>
              <p className="text-2xl font-bold tabular-nums">~{totalHours}h</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/70 px-5 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Levels
              </p>
              <p className="text-2xl font-bold tabular-nums">{difficulties.length}</p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2" aria-label="Project levels">
            {difficulties.map((difficulty, i) => {
              const Icon = difficultyIcon[difficulty];
              return (
                <a
                  key={difficulty}
                  href={`#${difficulty}`}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors hover:bg-surface-elevated",
                    difficultyColors[difficulty]
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {difficultyLabels[difficulty]}
                  <span className="tabular-nums opacity-70">{countByDifficulty(difficulty)}</span>
                  {i < difficulties.length - 1 && (
                    <ArrowRight className="h-3 w-3 opacity-40 -mr-1 hidden sm:block" />
                  )}
                </a>
              );
            })}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <section className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
            First win
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProjectCard project={startProject} index={startIndex} featured />
          </div>
        </section>

        {difficulties.map((difficulty) => {
          const filtered = projects.filter(
            (p) => p.difficulty === difficulty && p.slug !== startProject.slug
          );
          if (filtered.length === 0) return null;
          const Icon = difficultyIcon[difficulty];

          return (
            <section key={difficulty} id={difficulty} className="mb-16 scroll-mt-24">
              <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br text-white",
                        difficultyAccent[difficulty]
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    {difficultyLabels[difficulty]}
                  </h2>
                  <p className="text-sm text-text-muted mt-1.5 ml-10">
                    {difficultyDescriptions[difficulty]}
                  </p>
                </div>
                <span className="text-xs text-text-muted tabular-nums">
                  {countByDifficulty(difficulty)} project
                  {countByDifficulty(difficulty) !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((project) => {
                  const index = projects.findIndex((p) => p.slug === project.slug);
                  return (
                    <ProjectCard key={project.slug} project={project} index={index} />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
