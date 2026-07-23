/**
 * Converts concept + technical explanation prose into clean, readable bullet points.
 */

const MIN_BULLET_LENGTH = 30;
const MAX_BULLETS = 7;
const TARGET_BULLETS = 6;

const PROTECTED_PERIOD = /(\be\.g\.|\bi\.e\.|\bvs\.|\betc\.|\bDr\.|\bMr\.|\bMs\.|\bSt\.|\bU\.S\.|\bNo\.|\d+\.\d+)/gi;

function protectAbbreviations(text: string): { text: string; restore: (s: string) => string } {
  const placeholders: string[] = [];
  const protectedText = text.replace(PROTECTED_PERIOD, (match) => {
    const key = `__PROT${placeholders.length}__`;
    placeholders.push(match);
    return key;
  });
  return {
    text: protectedText,
    restore: (s: string) =>
      placeholders.reduce((acc, val, i) => acc.replace(`__PROT${i}__`, val), s),
  };
}

function splitSentences(text: string): string[] {
  const { text: protectedText, restore } = protectAbbreviations(text.trim());
  const raw = protectedText.split(/(?<=[.!?])\s+(?=[A-Z"(])/);
  return raw
    .map((s) => restore(s.trim()))
    .filter((s) => s.length >= 15);
}

function normalizeBullet(text: string): string {
  let t = text.trim();
  if (!/[.!?:)]$/.test(t)) {
    t += ".";
  }
  return t;
}

function groupSentences(sentences: string[]): string[] {
  if (sentences.length === 0) return [];
  if (sentences.length <= TARGET_BULLETS) {
    return sentences.map(normalizeBullet);
  }

  const perGroup = Math.max(1, Math.ceil(sentences.length / TARGET_BULLETS));
  const bullets: string[] = [];

  for (let i = 0; i < sentences.length; i += perGroup) {
    const group = sentences.slice(i, i + perGroup).join(" ");
    if (group.length >= MIN_BULLET_LENGTH) {
      bullets.push(normalizeBullet(group));
    }
  }

  return bullets;
}

function parseTextBlock(text: string): string[] {
  if (!text?.trim()) return [];

  if (/^[-*•]\s/m.test(text)) {
    return text
      .split("\n")
      .map((l) => l.replace(/^[-*•]\s+/, "").trim())
      .filter((l) => l.length >= MIN_BULLET_LENGTH)
      .map(normalizeBullet);
  }

  return splitSentences(text);
}

/**
 * Build readable bullet points for the "Concept & How It Works" section.
 */
export function buildConceptBullets(
  concept: string,
  technicalExplanation?: string
): string[] {
  const conceptSentences = parseTextBlock(concept);
  const techSentences = parseTextBlock(technicalExplanation ?? "");
  const allSentences = [...conceptSentences, ...techSentences];

  if (allSentences.length === 0 && concept.trim()) {
    return [normalizeBullet(concept.trim())];
  }

  return groupSentences(allSentences).slice(0, MAX_BULLETS);
}
