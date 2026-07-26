/**
 * Auto-generates practice tasks and example solutions for curriculum lessons.
 */

export function generateExampleSolution(
  moduleTitle: string,
  example: string,
  phaseTitle: string
): string {
  const scenario = example.split(".")[0]?.trim() || example;
  return `In ${phaseTitle}, apply ${moduleTitle} to this scenario: ${scenario}. Identify the inputs, run the technique, validate the output, and note one thing you would monitor in production.`;
}

export function generatePracticeTask(
  moduleTitle: string,
  moduleSlug: string,
  phaseTitle: string,
  example: string,
  hasCode: boolean
): string {
  const topic = moduleSlug.replace(/-/g, " ");

  if (hasCode) {
    return `Open the Code Walkthrough below and run it locally. Change one parameter related to ${moduleTitle} (e.g. model, temperature, top_k, or tool name), observe the difference in output, and write 2–3 sentences explaining what changed.`;
  }

  return `Spend 15 minutes on ${moduleTitle}: read the visual diagram and cheat sheet, then apply the concept to this scenario — ${example.split(".")[0]}. Write down the steps you would take in a real ${phaseTitle} project.`;
}
