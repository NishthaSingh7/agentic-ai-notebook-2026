import type { Phase } from "@/data/roadmap";

/** Short rank earned from the furthest chapter the learner has fully cleared. */
const RANK_BY_SLUG: Record<string, string> = {
  "programming-foundations": "Foundation locked in",
  "genai-foundations": "GenAI fluent",
  "transformer-foundations": "Transformer-literate",
  "llm-engineering": "LLM engineer",
  "rag-engineering": "RAG engineer",
  "agent-foundations": "Agent apprentice",
  "agent-memory": "Memory architect",
  "context-engineering": "Context engineer",
  "tool-calling": "Tool-caller",
  "mcp": "MCP fluent",
  "agent-frameworks": "Framework scout",
  "langgraph": "LangGraph builder",
  "openai-agents": "OpenAI Agents builder",
  "claude-agent-sdk": "Claude operator",
  "crewai": "CrewAI engineer",
  "pydantic-ai": "PydanticAI builder",
  autogen: "MAS builder",
  "google-adk": "ADK builder",
  "agent-design-patterns": "Pattern fluent",
  "multi-agent-systems": "Multi-agent architect",
  "agent-evaluation": "Eval-minded",
  "security-guardrails": "Security-minded",
  "production-agents": "Production builder",
  "ag-ui": "Agent UX builder",
  "browser-agents": "Computer-use operator",
  "multimodal-agents": "Multimodal builder",
  "enterprise-ai": "Enterprise AI builder",
  "coding-agents": "Coding-agent operator",
  "advanced-ai": "Model-aware",
  "capstone-projects": "Capstone closer",
  "interview-system-design": "Interview-ready",
};

export type ProfileStory = {
  rank: string;
  headline: string;
  sub: string;
};

export function getLatestClearedPhase(
  phases: Phase[],
  getPhaseProgress: (slug: string) => number
): Phase | null {
  const cleared = phases.filter((phase) => getPhaseProgress(phase.slug) === 100);
  return cleared.length ? cleared[cleared.length - 1] : null;
}

export function getLearnerRank(
  progressPercent: number,
  latestWin: Phase | null,
  clearedCount: number
) {
  if (progressPercent >= 100) return "Roadmap closer";
  if (latestWin) {
    return RANK_BY_SLUG[latestWin.slug] ?? `${latestWin.title} — cleared`;
  }
  if (clearedCount === 0 && progressPercent > 0) return "In motion";
  return "Day one";
}

export function getProfileStory({
  firstName,
  progressPercent,
  latestWin,
  focusPhase,
  focusDone,
  focusTotal,
  clearedCount,
  winIsAheadOfFocus,
}: {
  firstName: string;
  progressPercent: number;
  latestWin: Phase | null;
  focusPhase: Phase;
  focusDone: number;
  focusTotal: number;
  clearedCount: number;
  winIsAheadOfFocus: boolean;
}): ProfileStory {
  const rank = getLearnerRank(progressPercent, latestWin, clearedCount);
  const remaining = Math.max(0, focusTotal - focusDone);

  if (progressPercent >= 100) {
    return {
      rank,
      headline: "The whole map is yours.",
      sub: "Every core chapter is on your record. Go build something that ships.",
    };
  }

  if (progressPercent === 0) {
    return {
      rank,
      headline: `${firstName}, chapter one is waiting.`,
      sub: `${focusPhase.title} is the door. One module today is enough — the first medal is closer than it looks.`,
    };
  }

  if (latestWin) {
    const headline = `You cleared ${latestWin.title}.`;
    if (winIsAheadOfFocus) {
      return {
        rank,
        headline,
        sub: `There's an open chapter behind you: ${focusPhase.title}. Close it when you're ready — ${remaining} module${remaining === 1 ? "" : "s"} left.`,
      };
    }
    return {
      rank,
      headline,
      sub:
        remaining === 0
          ? `On to ${focusPhase.title}. Keep the streak.`
          : `Now you're in ${focusPhase.title} — ${remaining} module${remaining === 1 ? "" : "s"} until this chapter is a medal too.`,
    };
  }

  return {
    rank,
    headline: `You're in ${focusPhase.title}.`,
    sub:
      remaining === 0
        ? "This chapter is almost yours."
        : `${focusDone} of ${focusTotal} done. Finish the rest and the first medal is yours.`,
  };
}

export function getCompletedPhaseCount(
  phases: Phase[],
  getPhaseProgress: (slug: string) => number
) {
  return phases.filter((phase) => !phase.optional && getPhaseProgress(phase.slug) === 100).length;
}

export function getMilestones(completedCount: number, progressPercent: number) {
  return [
    { id: "first", label: "First spark", unlocked: completedCount >= 1 },
    { id: "ten", label: "Ten in the bag", unlocked: completedCount >= 10 },
    { id: "quarter", label: "Quarter of the map", unlocked: progressPercent >= 25 },
    { id: "half", label: "Halfway hero", unlocked: progressPercent >= 50 },
    { id: "stretch", label: "Deep in it", unlocked: progressPercent >= 75 },
    { id: "done", label: "Roadmap closer", unlocked: progressPercent >= 100 },
  ];
}

/** First phase that isn't 100% complete — where "Up next" points */
export function getFocusPhase(
  phases: Phase[],
  getPhaseProgress: (slug: string) => number
) {
  const incomplete = phases.find((p) => getPhaseProgress(p.slug) < 100);
  return incomplete ?? phases[phases.length - 1];
}

export function getNextModule(phase: Phase, completed: Set<string>) {
  return phase.modules.find((m) => !completed.has(`${phase.slug}/${m.slug}`)) ?? null;
}
