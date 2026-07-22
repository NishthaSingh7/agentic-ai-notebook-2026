import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { projects, difficultyColors } from "@/data/projects";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
  description: "Hands-on AI Engineering projects from beginner to production — with architecture, resume points, and interview questions.",
};

export default function ProjectsPage() {
  const difficulties = ["beginner", "intermediate", "advanced", "production"] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Projects</h1>
        <p className="text-text-secondary max-w-2xl">
          Build your AI engineering portfolio. Every project includes architecture,
          tech stack, resume bullet points, and interview questions.
        </p>
      </div>

      {difficulties.map((difficulty) => {
        const filtered = projects.filter((p) => p.difficulty === difficulty);
        if (filtered.length === 0) return null;

        return (
          <section key={difficulty} className="mb-12">
            <h2 className="text-lg font-semibold mb-4 capitalize">{difficulty}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {filtered.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group rounded-xl border border-border bg-surface p-6 transition-all hover:border-border hover:bg-surface-elevated"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase", difficultyColors[project.difficulty])}>
                      {project.difficulty}
                    </span>
                  </div>

                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-surface-elevated px-2 py-0.5 text-[10px] text-text-muted font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> ~{project.estimatedHours}h
                    </span>
                    <span className="flex items-center gap-1 text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      View project <ArrowRight className="h-3 w-3" />
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
