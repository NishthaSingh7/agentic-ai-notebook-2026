import { phases } from "@/data/roadmap";

/** Phase slugs with code walkthroughs. */
export const CODE_WALKTHROUGH_PHASE_SLUGS = new Set([
  "genai-foundations",
  "transformer-foundations",
  "llm-engineering",
  "rag-engineering",
  "agent-foundations",
  "agent-frameworks",
  "langgraph",
  "openai-agents",
  "claude-agent-sdk",
  "pydantic-ai",
  "autogen",
  "google-adk",
  "agent-design-patterns",
  "multi-agent-systems",
  "agent-evaluation",
  "security-guardrails",
  "production-agents",
  "browser-agents",
  "multimodal-agents",
  "advanced-ai",
  "enterprise-ai",
  "coding-agents",
  "capstone-projects",
  "interview-system-design",
]);

/** @deprecated Use isCodeWalkthroughPhase */
export const CURRICULUM_PHASE_SLUGS = CODE_WALKTHROUGH_PHASE_SLUGS;

export function isCodeWalkthroughPhase(phaseSlug: string): boolean {
  return CODE_WALKTHROUGH_PHASE_SLUGS.has(phaseSlug);
}

export function isCurriculumPhase(phaseSlug: string): boolean {
  return isCodeWalkthroughPhase(phaseSlug);
}

export function isFoundationPhase(phaseSlug: string): boolean {
  return phaseSlug === "programming-foundations";
}

/** Visual-first layout: diagrams primary, minimal reading (Phases 0–4 + optional 1.1). */
export const VISUAL_FIRST_PHASE_SLUGS = new Set([
  "programming-foundations",
  "genai-foundations",
  "transformer-foundations",
  "llm-engineering",
  "rag-engineering",
  "agent-foundations",
  "mcp",
  "agent-memory",
  "context-engineering",
  "tool-calling",
  "crewai",
  "ag-ui",
]);

export function isVisualFirstPhase(phaseSlug: string): boolean {
  return VISUAL_FIRST_PHASE_SLUGS.has(phaseSlug);
}

/** Every roadmap phase supports local highlighting (synced to Mongo at night). */
export const HIGHLIGHT_PHASE_SLUGS = new Set(phases.map((phase) => phase.slug));

export function isHighlightPhase(phaseSlug: string): boolean {
  return HIGHLIGHT_PHASE_SLUGS.has(phaseSlug);
}

/** All roadmap phases use the unified curriculum lesson layout. */
export function usesCurriculumLayout(_phaseSlug: string): boolean {
  return true;
}
