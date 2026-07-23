/** Phase slugs using the Phase 0-style curriculum layout (phases 1–10). */
export const CURRICULUM_PHASE_SLUGS = new Set([
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
]);

export function isCurriculumPhase(phaseSlug: string): boolean {
  return CURRICULUM_PHASE_SLUGS.has(phaseSlug);
}

export function isFoundationPhase(phaseSlug: string): boolean {
  return phaseSlug === "programming-foundations";
}
