/** Phase slugs with code walkthroughs (phases 1–20). */
export const CODE_WALKTHROUGH_PHASE_SLUGS = new Set([
  "genai-foundations",
  "transformer-foundations",
  "llm-engineering",
  "rag-engineering",
  "agent-foundations",
  "agent-memory",
  "tool-calling",
  "mcp",
  "agent-frameworks",
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

/** Visual-first layout: diagrams primary, minimal reading (Phases 0–3 + optional 1.1). */
export const VISUAL_FIRST_PHASE_SLUGS = new Set([
  "programming-foundations",
  "genai-foundations",
  "transformer-foundations",
  "llm-engineering",
  "rag-engineering",
]);

export function isVisualFirstPhase(phaseSlug: string): boolean {
  return VISUAL_FIRST_PHASE_SLUGS.has(phaseSlug);
}

/** All roadmap phases use the unified curriculum lesson layout. */
export function usesCurriculumLayout(_phaseSlug: string): boolean {
  return true;
}
