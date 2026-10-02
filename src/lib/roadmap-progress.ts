import { phases } from "@/data/roadmap";

export type RoadmapStatus = "Cleared" | "In progress" | "Queued" | "Optional";

export type PhaseProgressRow = {
  order: number;
  slug: string;
  title: string;
  done: number;
  total: number;
  progress: string;
  status: RoadmapStatus;
  optional: boolean;
};

export function getPhaseStatus(
  optional: boolean | undefined,
  done: number,
  total: number
): RoadmapStatus {
  if (optional && done === 0) return "Optional";
  if (total > 0 && done >= total) return "Cleared";
  if (done > 0) return "In progress";
  return "Queued";
}

export function getRoadmapProgressRows(completed: string[]): PhaseProgressRow[] {
  const set = new Set(completed);
  return phases.map((phase, index) => {
    const done = phase.modules.filter((module) =>
      set.has(`${phase.slug}/${module.slug}`)
    ).length;
    const total = phase.modules.length;
    return {
      order: index + 1,
      slug: phase.slug,
      title: phase.title,
      done,
      total,
      progress: `${done} / ${total}`,
      status: getPhaseStatus(phase.optional, done, total),
      optional: Boolean(phase.optional),
    };
  });
}

export function getRequiredProgress(completed: string[]) {
  const rows = getRoadmapProgressRows(completed);
  const required = rows.filter((row) => !row.optional);
  return {
    done: required.reduce((sum, row) => sum + row.done, 0),
    total: required.reduce((sum, row) => sum + row.total, 0),
    rows,
  };
}
