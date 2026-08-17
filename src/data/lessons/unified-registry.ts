import type { LessonContent } from "../lesson-types";
import { phase0Lessons } from "./phase-0";
import { phase1Lessons } from "./phase-1";
import { phase2Lessons } from "./phase-2";
import { phase3Lessons } from "./phase-3";
import { phase4Lessons } from "./phase-4";
import { phase5Lessons } from "./phase-5";
import { phase6Lessons } from "./phase-6";
import { agentFoundationsLessons } from "./agent-foundations";
import { capstoneProjectsLessons } from "./capstone-projects";
import { mcpLessons } from "./mcp";
import { agentMemoryLessons } from "./agent-memory";
import { toolCallingLessons } from "./tool-calling";
import { contextEngineeringLessons } from "./context-engineering";
import { claudeAgentSdkLessons } from "./claude-agent-sdk";
import { agUiLessons } from "./ag-ui";
import { frameworkPhaseLessons } from "./framework-phases";
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
  "agent-foundations": agentFoundationsLessons,
  mcp: mcpLessons,
  "agent-memory": agentMemoryLessons,
  "context-engineering": contextEngineeringLessons,
  "tool-calling": toolCallingLessons,
  "agent-frameworks": {
    "why-frameworks": frameworkPhaseLessons["why-frameworks"],
    "choosing-a-framework": frameworkPhaseLessons["choosing-a-framework"],
    "semantic-kernel": phase6Lessons["semantic-kernel"],
  },
  langgraph: {
    langgraph: phase6Lessons.langgraph,
    "langgraph-subgraphs": frameworkPhaseLessons["langgraph-subgraphs"],
    "build-langgraph-agent": frameworkPhaseLessons["build-langgraph-agent"],
  },
  "openai-agents": {
    "openai-agents-sdk": phase6Lessons["openai-agents-sdk"],
    "build-openai-agent": frameworkPhaseLessons["build-openai-agent"],
  },
  "claude-agent-sdk": claudeAgentSdkLessons,
  crewai: {
    "crewai-agents-roles": frameworkPhaseLessons["crewai-agents-roles"],
    "crewai-tasks-process": frameworkPhaseLessons["crewai-tasks-process"],
    "crewai-flows": frameworkPhaseLessons["crewai-flows"],
    "build-crewai-crew": frameworkPhaseLessons["build-crewai-crew"],
  },
  "pydantic-ai": {
    "pydantic-ai": phase6Lessons["pydantic-ai"],
    "pydantic-ai-tools": frameworkPhaseLessons["pydantic-ai-tools"],
    "pydantic-ai-deps": frameworkPhaseLessons["pydantic-ai-deps"],
    "pydantic-ai-results": frameworkPhaseLessons["pydantic-ai-results"],
    "build-pydantic-ai-agent": frameworkPhaseLessons["build-pydantic-ai-agent"],
  },
  autogen: {
    autogen: phase6Lessons.autogen,
    "autogen-group-chat": frameworkPhaseLessons["autogen-group-chat"],
    "build-autogen-team": frameworkPhaseLessons["build-autogen-team"],
  },
  "google-adk": {
    "google-adk": phase6Lessons["google-adk"],
    "build-google-adk-agent": frameworkPhaseLessons["build-google-adk-agent"],
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
  "ag-ui": agUiLessons,
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
