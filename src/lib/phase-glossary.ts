import {
  agentFoundationsGlossary,
  agentGlossaryCategories,
  getAgentFoundationsGlossaryByCategory,
  type PhaseGlossaryTerm,
} from "@/data/agent-foundations-glossary";
import { glossary } from "@/data/glossary";
import { getLessonContent } from "@/data/lessons";
import {
  getLlmEngineeringGlossaryByCategory,
  llmEngineeringGlossary,
  llmGlossaryCategories,
  llmGlossaryPopularTerms,
} from "@/data/llm-engineering-glossary";
import {
  getMcpGlossaryByCategory,
  mcpGlossary,
  mcpGlossaryCategories,
  mcpGlossaryPopularTerms,
} from "@/data/mcp-glossary";
import {
  getMemoryGlossaryByCategory,
  memoryGlossary,
  memoryGlossaryCategories,
  memoryGlossaryPopularTerms,
} from "@/data/memory-glossary";
import {
  getToolGlossaryByCategory,
  toolGlossary,
  toolGlossaryCategories,
  toolGlossaryPopularTerms,
} from "@/data/tool-glossary";
import { getPhaseBySlug } from "@/data/roadmap";

export interface PhaseGlossaryBundle {
  title: string;
  searchPlaceholder: string;
  terms: PhaseGlossaryTerm[];
  categories: string[];
  byCategory: Record<string, PhaseGlossaryTerm[]>;
  popularTerms: string[];
}

const AGENT_POPULAR_TERMS = [
  "ReAct",
  "HITL",
  "MCP",
  "Playwright",
  "Snowflake",
  "Red Teaming",
  "OpenTelemetry",
  "Context Overflow",
];

function normalizeTermKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function firstSentence(text: string, max = 220): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return "";
  const match = trimmed.match(/^[^.!?]+[.!?]/);
  const sentence = (match ? match[0] : trimmed).trim();
  if (sentence.length <= max) return sentence;
  return `${sentence.slice(0, max - 1).trimEnd()}…`;
}

const siteGlossaryByKey = (() => {
  const map = new Map<string, (typeof glossary)[number]>();
  for (const entry of glossary) {
    map.set(normalizeTermKey(entry.term), entry);
    map.set(normalizeTermKey(entry.slug.replace(/-/g, " ")), entry);
  }
  return map;
})();

function findSiteEntry(term: string) {
  const key = normalizeTermKey(term);
  const direct = siteGlossaryByKey.get(key);
  if (direct) return direct;
  if (key.endsWith("s")) return siteGlossaryByKey.get(key.slice(0, -1));
  return siteGlossaryByKey.get(`${key}s`);
}

function groupByCategory(terms: PhaseGlossaryTerm[], categories: string[]) {
  const grouped: Record<string, PhaseGlossaryTerm[]> = {};
  for (const category of categories) grouped[category] = [];
  for (const term of terms) {
    grouped[term.category] ??= [];
    grouped[term.category].push(term);
  }
  for (const category of categories) {
    grouped[category].sort((a, b) => a.term.localeCompare(b.term));
  }
  return grouped;
}

function pickPopularTerms(terms: PhaseGlossaryTerm[], preferred: string[] = []): string[] {
  const available = new Set(terms.map((term) => term.term));
  const picked: string[] = [];
  for (const name of preferred) {
    if (available.has(name) && !picked.includes(name)) picked.push(name);
    if (picked.length >= 8) return picked;
  }
  for (const term of terms) {
    if (!picked.includes(term.term)) picked.push(term.term);
    if (picked.length >= 8) break;
  }
  return picked;
}

function buildGeneratedGlossary(phaseSlug: string): PhaseGlossaryBundle | null {
  const phase = getPhaseBySlug(phaseSlug);
  if (!phase) return null;

  const seen = new Set<string>();
  const terms: PhaseGlossaryTerm[] = [];

  for (const mod of phase.modules) {
    const lesson = getLessonContent(phase.slug, mod.slug);
    const moduleKey = normalizeTermKey(mod.title);
    if (moduleKey && !seen.has(moduleKey)) {
      seen.add(moduleKey);
      const site = findSiteEntry(mod.title);
      terms.push({
        term: mod.title,
        category: "Modules",
        meaning:
          site?.simpleDefinition ||
          firstSentence(lesson?.whyItExists || lesson?.concept || "") ||
          `${mod.title} is a core topic in ${phase.title}.`,
        aliases: lesson?.glossary?.filter((item) => normalizeTermKey(item) !== moduleKey),
      });
    }

    for (const raw of lesson?.glossary ?? []) {
      const key = normalizeTermKey(raw);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      const site = findSiteEntry(raw);
      terms.push({
        term: raw,
        category: "Key Terms",
        meaning:
          site?.simpleDefinition ||
          firstSentence(lesson?.concept || lesson?.whyItExists || "") ||
          `${raw} is a key idea in ${mod.title}.`,
        aliases: site?.relatedConcepts,
      });
    }
  }

  const categories = ["Modules", "Key Terms"].filter((category) =>
    terms.some((term) => term.category === category)
  );
  const popularTerms = pickPopularTerms(
    terms.filter((term) => term.category === "Key Terms").concat(terms)
  );

  return {
    title: `${phase.subtitle} Glossary`,
    searchPlaceholder: popularTerms.slice(0, 3).join(", ") + "...",
    terms,
    categories,
    byCategory: groupByCategory(terms, categories),
    popularTerms,
  };
}

export function getPhaseGlossaryBundle(phaseSlug: string): PhaseGlossaryBundle | null {
  if (phaseSlug === "agent-foundations") {
    return {
      title: "Agent Glossary",
      searchPlaceholder: "ReAct, HITL, trajectory...",
      terms: agentFoundationsGlossary,
      categories: [...agentGlossaryCategories],
      byCategory: { ...getAgentFoundationsGlossaryByCategory() },
      popularTerms: AGENT_POPULAR_TERMS,
    };
  }

  if (phaseSlug === "llm-engineering") {
    return {
      title: "LLM Glossary",
      searchPlaceholder: "Token, Ollama, streaming...",
      terms: llmEngineeringGlossary,
      categories: [...llmGlossaryCategories],
      byCategory: { ...getLlmEngineeringGlossaryByCategory() },
      popularTerms: llmGlossaryPopularTerms,
    };
  }

  if (phaseSlug === "mcp") {
    return {
      title: "MCP Glossary",
      searchPlaceholder: "stdio, tools, OAuth...",
      terms: mcpGlossary,
      categories: [...mcpGlossaryCategories],
      byCategory: { ...getMcpGlossaryByCategory() },
      popularTerms: mcpGlossaryPopularTerms,
    };
  }

  if (phaseSlug === "agent-memory") {
    return {
      title: "Memory Glossary",
      searchPlaceholder: "working, episodic, retrieve...",
      terms: memoryGlossary,
      categories: [...memoryGlossaryCategories],
      byCategory: { ...getMemoryGlossaryByCategory() },
      popularTerms: memoryGlossaryPopularTerms,
    };
  }

  if (phaseSlug === "tool-calling") {
    return {
      title: "Tools Glossary",
      searchPlaceholder: "schema, registry, HITL...",
      terms: toolGlossary,
      categories: [...toolGlossaryCategories],
      byCategory: { ...getToolGlossaryByCategory() },
      popularTerms: toolGlossaryPopularTerms,
    };
  }

  return buildGeneratedGlossary(phaseSlug);
}
