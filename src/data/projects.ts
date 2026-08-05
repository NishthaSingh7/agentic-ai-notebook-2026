import type { ProjectDifficulty } from "./project-types";
import { projectCatalog } from "./project-catalog";

export type { Project, ProjectDifficulty, ProjectSlide, ProjectTimePhase } from "./project-types";
export { projectCatalog };

export const projects = projectCatalog;

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const difficultyColors: Record<ProjectDifficulty, string> = {
  beginner: "bg-accent/10 text-accent border-accent/20",
  intermediate: "bg-royal/10 text-royal border-royal/20",
  advanced: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  production: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
};

export const difficultyLabels: Record<ProjectDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  production: "Production",
};

export function countByDifficulty(difficulty: ProjectDifficulty) {
  return projects.filter((p) => p.difficulty === difficulty).length;
}
