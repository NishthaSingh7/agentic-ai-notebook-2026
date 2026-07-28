/** Random motivational lines shown when a module is marked complete. */
export const COMPLETION_QUOTES = [
  "Every module you finish is a skill you'll use in production.",
  "Consistency beats intensity. You showed up — that's what matters.",
  "You're not just reading. You're building the engineer you want to become.",
  "Small steps compound. This one just made the next one easier.",
  "The best AI engineers never stop learning. You're one of them.",
  "Done is better than perfect. Keep moving forward.",
  "One more brick in the foundation. Your future self thanks you.",
  "Learning in public starts with learning in private. Nice work.",
  "Ship the knowledge, not just the code. You just shipped another module.",
  "Momentum is a superpower. You just added more.",
  "Every expert was once a beginner who didn't quit.",
  "You're closer to building real AI systems than you were yesterday.",
  "Discipline is choosing what you want most over what you want now.",
  "The roadmap is long. Your progress is real.",
  "Curiosity + action = growth. You took action today.",
  "Agents don't build themselves. Engineers like you do.",
  "Another concept locked in. The stack is getting stronger.",
  "Progress isn't luck — it's showing up repeatedly. You did.",
  "From notebook to production starts with fundamentals. You're laying them.",
  "Keep going. The interesting problems are ahead — and you're ready for them.",
];

export function getRandomCompletionQuote(): string {
  const index = Math.floor(Math.random() * COMPLETION_QUOTES.length);
  return COMPLETION_QUOTES[index];
}
