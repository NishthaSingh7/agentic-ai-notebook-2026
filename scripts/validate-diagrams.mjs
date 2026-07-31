/**
 * Validates Mermaid charts for visual-first phases (handDrawn theme).
 * Run: node scripts/validate-diagrams.mjs
 */
import { createRequire } from "module";
import { pathToFileURL } from "url";
import { JSDOM } from "jsdom";

const require = createRequire(import.meta.url);
const root = new URL("../", import.meta.url);

// Register ts paths via dynamic import of compiled-lesson pipeline
const { phases } = await import(pathToFileURL(new URL("src/data/roadmap.ts", root)));
const { getLessonContent } = await import(pathToFileURL(new URL("src/data/lessons.ts", root)));
const mermaid = (await import("mermaid")).default;

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
global.document = dom.window.document;
global.window = dom.window;

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

const failures = [];

async function testChart(phaseSlug, modSlug, label, chart) {
  try {
    const id = `t${Math.random().toString(36).slice(2)}`;
    await mermaid.render(id, chart);
    return true;
  } catch (e) {
    failures.push({
      path: `${phaseSlug}/${modSlug}`,
      label,
      error: String(e.message || e).slice(0, 200),
    });
    return false;
  }
}

let total = 0;
let ok = 0;

for (const phase of phases.filter((p) => visualPhases.has(p.slug))) {
  for (const mod of phase.modules) {
    const content = getLessonContent(phase.slug, mod.slug);
    if (!content) {
      failures.push({ path: `${phase.slug}/${mod.slug}`, label: "content", error: "NO CONTENT" });
      continue;
    }
    const charts = [];
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
