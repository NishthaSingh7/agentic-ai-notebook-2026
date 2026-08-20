import type { LessonContent } from "@/data/lesson-types";
import type { Module } from "@/data/roadmap";
import { MermaidDiagram } from "@/components/mermaid-diagram";

export function VisualWorkflows({
  content,
  mod,
  visualFirst,
}: {
  content: LessonContent;
  mod: Module;
  visualFirst: boolean;
}) {
  const diagramProps = visualFirst
    ? { sketch: true as const, zoomable: true, defaultZoom: 1 }
    : { sketch: true as const };

  return (
    <>
      {content.analogyDiagram && visualFirst && (
        <div className="mb-6">
          <MermaidDiagram chart={content.analogyDiagram} title="Overview" {...diagramProps} />
        </div>
      )}
      {content.diagram && (
        <div className={visualFirst ? "mb-6" : ""}>
          <MermaidDiagram
            chart={content.diagram}
            title={visualFirst ? undefined : `What is ${mod.title}?`}
            {...diagramProps}
          />
        </div>
      )}
      {content.workflowDiagrams?.map((wf, i) => (
        <div
          key={wf.title}
          id={`workflow-${i}`}
          className={
            i > 0 || content.diagram || content.analogyDiagram ? "mt-6 scroll-mt-28" : ""
          }
        >
          {!visualFirst && (
            <>
              <h3 className="text-lg font-semibold mb-1 text-text-primary">{wf.title}</h3>
              {wf.caption && (
                <p className="text-sm text-text-muted mb-3 not-prose">{wf.caption}</p>
              )}
            </>
          )}
          <MermaidDiagram
            chart={wf.chart}
            title={visualFirst ? wf.title : undefined}
            {...diagramProps}
          />
          {visualFirst && wf.caption && (
            <p className="text-xs text-text-muted mt-2 text-center not-prose">{wf.caption}</p>
          )}
        </div>
      ))}
    </>
  );
}

export function buildLessonSections(
  includeCode: boolean,
  content: LessonContent,
  showOrientationExtras: boolean,
  visualFirst: boolean
) {
  if (visualFirst) {
    const sections = [{ id: "diagram", title: "Visual Workflows" }];
    content.workflowDiagrams?.forEach((wf, i) => {
      sections.push({ id: `workflow-${i}`, title: wf.title });
    });
    sections.push({ id: "concept", title: "Key Takeaways" });
    if (content.example) sections.push({ id: "example", title: "Real Example" });
    if (content.buildSteps?.length) {
      sections.push({ id: "build-steps", title: "Build step by step" });
    }
    if (showOrientationExtras && content.practiceTask) {
      sections.push({ id: "practice", title: "Practice Task" });
    }
    if (includeCode) sections.push({ id: "code", title: "Code Walkthrough" });
    sections.push(
      { id: "commands", title: "Commands" },
      { id: "mistakes", title: "Common Mistakes" },
      { id: "revision", title: "Cheat Sheet" }
    );
    return sections;
  }

  const sections = [
    { id: "concept", title: "Concept & How It Works" },
    { id: "why", title: "Why It Exists" },
    { id: "analogy", title: "Real-World Analogy" },
    { id: "diagram", title: "Visual Diagram" },
  ];
  if (content.workflowDiagrams?.length) {
    content.workflowDiagrams.forEach((wf, i) => {
      sections.push({ id: `workflow-${i}`, title: wf.title });
    });
  }
  if (content.buildSteps?.length) {
    sections.push({ id: "build-steps", title: "Build step by step" });
  }
  if (showOrientationExtras) {
    if (content.example) sections.push({ id: "example", title: "Example" });
    if (content.practiceTask) sections.push({ id: "practice", title: "Practice Task" });
  }
  if (includeCode) sections.push({ id: "code", title: "Code Walkthrough" });
  sections.push(
    { id: "commands", title: "Commands to Remember" },
    { id: "mistakes", title: "Common Mistakes" },
    { id: "revision", title: "Cheat Sheet" }
  );
  return sections;
}
