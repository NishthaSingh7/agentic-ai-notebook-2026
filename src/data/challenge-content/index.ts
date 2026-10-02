import type { ChallengeLesson } from "../challenge-types";
import { lesson as a2aInterop } from "./a2a-interop";
import { lesson as agentHarness } from "./agent-harness";
import { lesson as agenticRag } from "./agentic-rag";
import { lesson as autogenAg2 } from "./autogen-ag2";
import { lesson as braintrust } from "./braintrust";
import { lesson as codeExecutingAgents } from "./code-executing-agents";
import { lesson as computerUse } from "./computer-use";
import { lesson as contextEngineering } from "./context-engineering";
import { lesson as copilotkit } from "./copilotkit";
import { lesson as crewaiRoles } from "./crewai-roles";
import { lesson as deepAgents } from "./deep-agents";
import { lesson as dspy } from "./dspy";
import { lesson as durableExecution } from "./durable-execution";
import { lesson as frontierModels } from "./frontier-models";
import { lesson as googleAdk } from "./google-adk";
import { lesson as graphrag } from "./graphrag";
import { lesson as guardrailsBeforeAction } from "./guardrails-before-action";
import { lesson as hitlInterrupts } from "./hitl-interrupts";
import { lesson as hybridSearch } from "./hybrid-search";
import { lesson as langchain } from "./langchain";
import { lesson as langgraphControl } from "./langgraph-control";
import { lesson as leastPrivilege } from "./least-privilege";
import { lesson as llamaindexWorkflows } from "./llamaindex-workflows";
import { lesson as llmRedTeaming } from "./llm-red-teaming";
import { lesson as localInference } from "./local-inference";
import { lesson as longContextWindowing } from "./long-context-windowing";
import { lesson as mastra } from "./mastra";
import { lesson as mcpBoundary } from "./mcp-boundary";
import { lesson as memoryTiers } from "./memory-tiers";
import { lesson as microsoftAgentFramework } from "./microsoft-agent-framework";
import { lesson as mixtureOfExperts } from "./mixture-of-experts";
import { lesson as modelAlignment } from "./model-alignment";
import { lesson as multiAgentPatterns } from "./multi-agent-patterns";
import { lesson as multimodalVla } from "./multimodal-vla";
import { lesson as observabilityCost } from "./observability-cost";
import { lesson as openaiAgentsSdk } from "./openai-agents-sdk";
import { lesson as openaiSwarm } from "./openai-swarm";
import { lesson as openSovereignModels } from "./open-sovereign-models";
import { lesson as planAndExecute } from "./plan-and-execute";
import { lesson as promptInjection } from "./prompt-injection";
import { lesson as pydanticAi } from "./pydantic-ai";
import { lesson as ragFoundations } from "./rag-foundations";
import { lesson as reactLoop } from "./react-loop";
import { lesson as reasoningModels } from "./reasoning-models";
import { lesson as selfImproving } from "./self-improving";
import { lesson as smallLanguageModels } from "./small-language-models";
import { lesson as smolagents } from "./smolagents";
import { lesson as stateMachinesCheckpointing } from "./state-machines-checkpointing";
import { lesson as toolContracts } from "./tool-contracts";
import { lesson as trajectoryEvals } from "./trajectory-evals";
import { lesson as treeOfThoughts } from "./tree-of-thoughts";
import { lesson as vectorDatabases } from "./vector-databases";
import { lesson as vercelAiSdk } from "./vercel-ai-sdk";
import { lesson as workflowsVsAgents } from "./workflows-vs-agents";

export const deepChallengeLessons: Record<string, ChallengeLesson> = {
  "a2a-interop": a2aInterop,
  "agent-harness": agentHarness,
  "agentic-rag": agenticRag,
  "autogen-ag2": autogenAg2,
  "braintrust": braintrust,
  "code-executing-agents": codeExecutingAgents,
  "computer-use": computerUse,
  "context-engineering": contextEngineering,
  "copilotkit": copilotkit,
  "crewai-roles": crewaiRoles,
  "deep-agents": deepAgents,
  "dspy": dspy,
  "durable-execution": durableExecution,
  "frontier-models": frontierModels,
  "google-adk": googleAdk,
  "graphrag": graphrag,
  "guardrails-before-action": guardrailsBeforeAction,
  "hitl-interrupts": hitlInterrupts,
  "hybrid-search": hybridSearch,
  "langchain": langchain,
  "langgraph-control": langgraphControl,
  "least-privilege": leastPrivilege,
  "llamaindex-workflows": llamaindexWorkflows,
  "llm-red-teaming": llmRedTeaming,
  "local-inference": localInference,
  "long-context-windowing": longContextWindowing,
  "mastra": mastra,
  "mcp-boundary": mcpBoundary,
  "memory-tiers": memoryTiers,
  "microsoft-agent-framework": microsoftAgentFramework,
  "mixture-of-experts": mixtureOfExperts,
  "model-alignment": modelAlignment,
  "multi-agent-patterns": multiAgentPatterns,
  "multimodal-vla": multimodalVla,
  "observability-cost": observabilityCost,
  "openai-agents-sdk": openaiAgentsSdk,
  "openai-swarm": openaiSwarm,
  "open-sovereign-models": openSovereignModels,
  "plan-and-execute": planAndExecute,
  "prompt-injection": promptInjection,
  "pydantic-ai": pydanticAi,
  "rag-foundations": ragFoundations,
  "react-loop": reactLoop,
  "reasoning-models": reasoningModels,
  "self-improving": selfImproving,
  "small-language-models": smallLanguageModels,
  "smolagents": smolagents,
  "state-machines-checkpointing": stateMachinesCheckpointing,
  "tool-contracts": toolContracts,
  "trajectory-evals": trajectoryEvals,
  "tree-of-thoughts": treeOfThoughts,
  "vector-databases": vectorDatabases,
  "vercel-ai-sdk": vercelAiSdk,
  "workflows-vs-agents": workflowsVsAgents,
};

export function registerChallengeLesson(lesson: ChallengeLesson) {
  deepChallengeLessons[lesson.slug] = lesson;
}
