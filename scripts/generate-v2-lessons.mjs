#!/usr/bin/env node
/**
 * Generates v2 lesson content for all roadmap modules.
 * Run: node scripts/generate-v2-lessons.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { topics as topics04 } from "./v2-content-phases-0-4.mjs";
import { topics as topics58 } from "./v2-content-phases-5-8.mjs";
import { topics as topics912 } from "./v2-content-phases-9-12.mjs";
import { topics as topics1316 } from "./v2-content-phases-13-16.mjs";

const TOPICS = { ...topics04, ...topics58, ...topics912, ...topics1316 };

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function parseRoadmap() {
  const src = readFileSync(join(root, "src/data/roadmap.ts"), "utf8");
  const phases = [];
  const phaseRe = /\{\s*id:\s*(\d+),\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)"[\s\S]*?modules:\s*\[([\s\S]*?)\],/g;
  let m;
  while ((m = phaseRe.exec(src))) {
    const modules = [];
    const modRe = /mod\("([^"]+)",\s*"([^"]+)"/g;
    let mm;
    while ((mm = modRe.exec(m[4]))) {
      modules.push({ slug: mm[1], title: mm[2] });
    }
    phases.push({ id: Number(m[1]), slug: m[2], title: m[3], modules });
  }
  return phases;
}

function esc(str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$");
}

function iq(q, a, d = "medium") {
  return `{ question: ${JSON.stringify(q)}, answer: ${JSON.stringify(a)}, difficulty: ${JSON.stringify(d)} }`;
}

function buildLesson(phaseSlug, phaseTitle, mod) {
  const custom = TOPICS[mod.slug];
  const title = mod.title;
  const slug = mod.slug;

  const concept = custom?.concept ?? `${title} is a core topic in ${phaseTitle} — essential knowledge for engineers building production AI agent systems in 2026.`;
  const why = custom?.why ?? `${title} solves real problems in ${phaseTitle}: reliability, scalability, or developer velocity. Skipping it leads to fragile demos that fail in production.`;
  const analogy = custom?.analogy ?? `Think of ${title} as a specialized tool in your agent engineering toolbox — you reach for it when the problem matches its strengths.`;
  const technical = custom?.technical ?? `In ${phaseTitle}, ${title} covers the concepts, APIs, and patterns you implement in code. Understand inputs/outputs, failure modes, latency, and cost. Connect it to observability and evaluation before shipping. Production agents need explicit error handling, retries, and guardrails around ${slug.replace(/-/g, " ")}.`;
  const example = custom?.example ?? `Scenario (${phaseTitle}): Your team ships a feature using ${title}. A user submits a real request, the system applies ${slug.replace(/-/g, " ")} with logging and validation, and returns an accurate result in under 3 seconds.`;
  const diagram = custom?.diagram;
  const code = custom?.code;
  const glossary = custom?.glossary ?? [title, phaseTitle];

  const questions = [
    iq(`What is ${title} and why does it matter in ${phaseTitle}?`, `${title} is a building block for agent systems in ${phaseTitle}. It matters because production agents need reliable ${slug.replace(/-/g, " ")} — not just clever prompts.`),
    iq(`How would you debug issues related to ${title}?`, `Add tracing/logging around the ${slug.replace(/-/g, " ")} step, capture inputs/outputs, run eval cases, check latency and token cost, and compare against a baseline before changing architecture.`),
  ];

  const fiveMin = [
    `${title}: key idea in ${phaseTitle}`,
    `Know when to use ${slug.replace(/-/g, " ")} vs alternatives`,
    `Watch failure modes: latency, cost, hallucination`,
    `Always evaluate before shipping to production`,
  ];

  return {
    concept,
    why,
    analogy,
    technical,
    example,
    diagram,
    code,
    glossary,
    questions,
    fiveMin,
  };
}

function emitLesson(phaseSlug, phaseTitle, mod) {
  const L = buildLesson(phaseSlug, phaseTitle, mod);
  const lines = [];
  lines.push(`  "${mod.slug}": createLesson({`);
  lines.push(`    concept: \`${esc(L.concept)}\`,`);
  lines.push(`    whyItExists: \`${esc(L.why)}\`,`);
  lines.push(`    analogy: \`${esc(L.analogy)}\`,`);
  lines.push(`    technicalExplanation: \`${esc(L.technical)}\`,`);
  lines.push(`    example: \`${esc(L.example)}\`,`);
  if (L.diagram) {
    lines.push(`    diagram: \`${esc(L.diagram)}\`,`);
  }
  if (L.code) {
    lines.push(`    code: \`${esc(L.code)}\`,`);
  }
  lines.push(`    interviewQuestions: [`);
  L.questions.forEach((q) => lines.push(`      ${q},`));
  lines.push(`    ],`);
  lines.push(`    revisionNotes: {`);
  lines.push(`      fiveMin: ${JSON.stringify(L.fiveMin)},`);
  lines.push(`      fifteenMin: ${JSON.stringify([L.technical.split(".")[0] + ".", `Practice ${mod.title} in a small project`, `Review glossary: ${L.glossary.join(", ")}`])},`);
  lines.push(`      oneHour: ${JSON.stringify([`Build a mini demo using ${mod.title}`, `Add logging and one eval test`, `Document tradeoffs and failure modes`])},`);
  lines.push(`      cheatSheet: ${JSON.stringify([mod.title, ...L.glossary.slice(0, 3)])},`);
  lines.push(`    },`);
  lines.push(`    glossary: ${JSON.stringify(L.glossary)},`);
  lines.push(`    commonMistakes: ${JSON.stringify([`Treating ${mod.title} as a black box without evaluation`, `Ignoring cost and latency in production`, `Skipping error handling for ${slugToWords(mod.slug)}`])},`);
  lines.push(`  }),`);
  return lines.join("\n");
}

function slugToWords(slug) {
  return slug.replace(/-/g, " ");
}

const phases = parseRoadmap();

let out = `// AUTO-GENERATED by scripts/generate-v2-lessons.mjs — do not edit by hand
import type { LessonContent } from "../lesson-types";
import { createLesson, iq } from "./builder";

`;

for (const phase of phases) {
  const exportName = phase.slug.replace(/-/g, "_") + "Lessons";
  out += `export const ${exportName}: Record<string, LessonContent> = {\n`;
  for (const mod of phase.modules) {
    out += emitLesson(phase.slug, phase.title, mod) + "\n";
  }
  out += `};\n\n`;
}

out += `export const generatedLessonMaps: Record<string, Record<string, LessonContent>> = {\n`;
for (const phase of phases) {
  const exportName = phase.slug.replace(/-/g, "_") + "Lessons";
  out += `  "${phase.slug}": ${exportName},\n`;
}
out += `};\n`;

writeFileSync(join(root, "src/data/lessons/v2-generated.ts"), out);
console.log(`Generated ${phases.reduce((a, p) => a + p.modules.length, 0)} lessons → src/data/lessons/v2-generated.ts`);
