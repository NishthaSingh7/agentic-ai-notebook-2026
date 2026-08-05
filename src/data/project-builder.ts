import { pastelChart } from "@/lib/mermaid-pastel";
import type { Project, ProjectSlide, ProjectTimePhase } from "./project-types";

export function createProject(
  base: Omit<Project, "timeBreakdown"> & { timeBreakdown: ProjectTimePhase[] }
): Project {
  return base;
}

export function archDiagram(body: string, classes = ""): string {
  return pastelChart(body, classes);
}

export function slide(
  title: string,
  opts: Omit<ProjectSlide, "title"> = {}
): ProjectSlide {
  return { title, ...opts };
}

/** Reusable slide diagram snippets */
export const diag = {
  threeTier: (title: string) =>
    archDiagram(
      `flowchart LR
    U[User] --> API[API Layer]
    API --> AI[AI Layer]
    AI --> DATA[Data Layer]
    DATA --> API
    API --> U`,
      `class U grp1
    class API grp2
    class AI grp3
    class DATA grp4`
    ),
};
