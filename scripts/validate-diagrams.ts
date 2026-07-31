/**
 * Validates Mermaid charts for visual-first phases (handDrawn theme).
 * Run: npx tsx scripts/validate-diagrams.ts
 */
import mermaid from "mermaid";
import { phases } from "../src/data/roadmap";
import { getLessonContent } from "../src/data/lessons";

// Minimal DOM for mermaid in Node
const el = {
  innerHTML: "",
  setAttribute() {},
  getAttribute() { return null; },
  appendChild() {},
  removeChild() {},
  style: {},
};
const doc = {
  createElementNS: () => ({ ...el, style: {} }),
  createElement: () => ({ ...el, style: {} }),
  body: el,
  documentElement: el,
};
(globalThis as unknown as { document: typeof doc; window: { document: typeof doc } }).document = doc;
(globalThis as unknown as { document: typeof doc; window: { document: typeof doc } }).window = { document: doc };

mermaid.initialize({
  startOnLoad: false,
  look: "handDrawn",
  theme: "base",
});

const visualPhases = new Set([
  "programming-foundations",
  "genai-foundations",
  "transformer-foundations",
  "llm-engineering",
  "rag-engineering",
]);

const failures: { path: string; label: string; error: string }[] = [];

async function testChart(phaseSlug: string, modSlug: string, label: string, chart: string) {
  try {
    const id = `t${Math.random().toString(36).slice(2)}`;
    await mermaid.render(id, chart);
    return true;
  } catch (e) {
    failures.push({
      path: `${phaseSlug}/${modSlug}`,
      label,
      error: String((e as Error).message || e).slice(0, 200),
    });
    return false;
  }
}

async function main() {
  let total = 0;
  let ok = 0;

  for (const phase of phases.filter((p) => visualPhases.has(p.slug))) {
    for (const mod of phase.modules) {
      const content = getLessonContent(phase.slug, mod.slug);
      if (!content) {
        failures.push({ path: `${phase.slug}/${mod.slug}`, label: "content", error: "NO CONTENT" });
        continue;
      }
      const charts: { label: string; chart: string }[] = [];
      if (content.diagram) charts.push({ label: "diagram", chart: content.diagram });
      if (content.analogyDiagram) charts.push({ label: "analogy", chart: content.analogyDiagram });
      content.workflowDiagrams?.forEach((wf, i) =>
        charts.push({ label: `workflow-${i}:${wf.title}`, chart: wf.chart })
      );

      for (const { label, chart } of charts) {
        total++;
        if (await testChart(phase.slug, mod.slug, label, chart)) ok++;
      }
    }
  }

  console.log(`Tested ${total} charts: ${ok} ok, ${failures.length} failed\n`);
  for (const f of failures) {
    console.log(`${f.path} [${f.label}]`);
    console.log(`  ${f.error}\n`);
  }

  process.exit(failures.length > 0 ? 1 : 0);
}

void main();
