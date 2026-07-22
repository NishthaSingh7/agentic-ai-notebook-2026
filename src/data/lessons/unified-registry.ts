import type { LessonContent } from "../lesson-types";
import { phase0Lessons } from "./phase-0";
import { phase1Lessons } from "./phase-1";
import { phase2Lessons } from "./phase-2";
import { phase3Lessons } from "./phase-3";
import { phase4Lessons } from "./phase-4";
import { phase5Lessons } from "./phase-5";
import { phase6Lessons } from "./phase-6";
import { capstoneProjectsLessons } from "./capstone-projects";
import { generatedLessonMaps } from "./v2-generated";

/**
 * Maps renamed module slugs to canonical lesson slug.
 * One topic = one lesson, no duplicates across v1/v2.
 */
export const topicAliases: Record<string, string> = {
  "llm-basics": "llms",
  "rag-basics": "rag",
  "google-gemini": "gemini",
  "basic-tool-calling": "function-calling",
  "evolution-of-ai": "what-is-ai",
  "what-is-an-ai-agent": "what-are-agents",
  "anatomy-of-an-agent": "agent-loop",
  "agent-lifecycle": "agent-loop",
  "types-of-agents": "autonomy",
  "agent-architectures": "reasoning",
  "memory-fundamentals": "memory",
  "vector-db": "vector-databases",
};

/** All v1 lessons in one lookup */
const allV1Lessons: Record<string, LessonContent> = {
  ...phase0Lessons,
  ...phase1Lessons,
  ...phase2Lessons,
  ...phase3Lessons,
  ...phase4Lessons,
  ...phase5Lessons,
  ...phase6Lessons,
};

/** v1 lessons scoped to hybrid phase slugs */
const v1ByPhase: Record<string, Record<string, LessonContent>> = {
  "programming-foundations": phase0Lessons,
  "genai-foundations": phase1Lessons,
  "transformer-foundations": phase2Lessons,
  "llm-engineering": phase3Lessons,
  "rag-engineering": {
    ...phase4Lessons,
    rag: phase1Lessons.rag,
    "vector-databases": phase1Lessons["vector-databases"],
    retrievers: phase1Lessons.retrievers,
    evaluation: phase4Lessons.evaluation,
  },
  "agent-foundations": {
    "what-is-an-ai-agent": phase5Lessons["what-are-agents"],
    "why-llms-need-agents": phase5Lessons.reasoning,
    "anatomy-of-an-agent": phase5Lessons["agent-loop"],
    "agent-lifecycle": phase5Lessons["agent-loop"],
    "core-concepts": phase5Lessons["what-are-agents"],
    "agent-capabilities": phase5Lessons["tool-calling"],
    "types-of-agents": phase5Lessons.autonomy,
    "agent-architectures": phase5Lessons.reasoning,
    "agent-terminology": phase5Lessons["what-are-agents"],
    "current-agent-landscape": phase5Lessons.autonomy,
    planning: phase5Lessons.planning,
    reflection: phase5Lessons.reflection,
    "multi-tool": phase5Lessons["multi-tool"],
    "self-correction": phase5Lessons["self-correction"],
    "build-first-ai-agent": phase5Lessons["agent-loop"],
  },
  "agent-frameworks": {
    ...phase6Lessons,
    autogen: phase6Lessons.autogen,
    "semantic-kernel": phase6Lessons["semantic-kernel"],
  },
  "agent-design-patterns": {
    react: phase5Lessons.react,
    "plan-execute": phase5Lessons["plan-execute"],
    reflexion: phase5Lessons.reflexion,
    "tree-of-thoughts": phase5Lessons["tree-of-thoughts"],
    "reflection-loop": phase5Lessons.reflection,
  },
  "security-guardrails": {
    guardrails: phase1Lessons.guardrails,
    "prompt-injection": phase1Lessons["prompt-injection"],
  },
  "production-agents": {
    docker: phase0Lessons.docker,
    streaming: phase1Lessons.streaming,
    fastapi: phase0Lessons["rest-apis"],
  },
  "advanced-ai": {
    "fine-tuning": phase1Lessons["fine-tuning"],
    multimodal: phase3Lessons.multimodal,
    "video-models": phase3Lessons.multimodal,
  },
  "capstone-projects": capstoneProjectsLessons,
};

function resolveSlug(moduleSlug: string): string {
  return topicAliases[moduleSlug] ?? moduleSlug;
}

function lookupLesson(moduleSlug: string): LessonContent | null {
  const canonical = resolveSlug(moduleSlug);
  return allV1Lessons[canonical] ?? allV1Lessons[moduleSlug] ?? null;
}

/** Build lesson maps for hybrid roadmap phases */
export function buildUnifiedLessonMaps(
  phaseSlugs: string[]
): Record<string, Record<string, LessonContent>> {
  const maps: Record<string, Record<string, LessonContent>> = {};

  for (const phaseSlug of phaseSlugs) {
    const merged: Record<string, LessonContent> = {
      ...(generatedLessonMaps[phaseSlug] ?? {}),
      ...(v1ByPhase[phaseSlug] ?? {}),
    };
    // Capstone hand-crafted lessons always win over generated
    if (phaseSlug === "capstone-projects") {
      Object.assign(merged, capstoneProjectsLessons);
    }
    maps[phaseSlug] = merged;
  }

  return maps;
}

export function getUnifiedLesson(
  phaseSlug: string,
  moduleSlug: string,
  phaseLessonMaps: Record<string, Record<string, LessonContent>>
): LessonContent | null {
  const direct = phaseLessonMaps[phaseSlug]?.[moduleSlug];
  if (direct) return direct;

  const v1 = lookupLesson(moduleSlug);
  if (v1) return v1;

  const generated = generatedLessonMaps[phaseSlug]?.[moduleSlug];
  if (generated) return generated;

  // Cross-phase generated lookup
  for (const genPhase of Object.values(generatedLessonMaps)) {
    if (genPhase[moduleSlug]) return genPhase[moduleSlug];
    const canonical = resolveSlug(moduleSlug);
    if (genPhase[canonical]) return genPhase[canonical];
  }

  return null;
}
