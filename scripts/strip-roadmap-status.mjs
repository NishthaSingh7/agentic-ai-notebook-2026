#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let s = readFileSync(join(root, "src/data/roadmap.ts"), "utf8");

s = s.replace(/export type PhaseStatus = [^\n]+\n\n/, "");
s = s.replace(/\s*status\?: "completed" \| "next" \| "upcoming";\n/, "\n");
s = s.replace(/\s*status: PhaseStatus;\n/, "\n");
s = s.replace(
  /function mod\(slug: string, title: string, status\?: Module\["status"\]\): Module \{\n  return status \? \{ slug, title, status \} : \{ slug, title \};\n\}/,
  "function mod(slug: string, title: string): Module {\n  return { slug, title };\n}"
);
s = s.replace(/,\s*status: "(completed|in-progress|upcoming)"/g, "");
s = s.replace(
  /mod\("([^"]+)",\s*"([^"]+)",\s*"(completed|next|upcoming)"\)/g,
  'mod("$1", "$2")'
);

writeFileSync(join(root, "src/data/roadmap.ts"), s);
console.log("Stripped status from roadmap.ts");
