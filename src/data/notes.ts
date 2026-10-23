import { langgraphCards } from "@/data/notes/langgraph";

export interface StudyCard {
  slug: string;
  part: string;
  title: string;
  lead: string;
  picture: string;
  pictureCaption: string;
  story: string;
  plain: string;
  example: string;
  tryThis: string;
  functions?: {
    title: string;
    why: string;
    language: string;
    code: string;
  }[];
  remember: string;
}

export interface TopicNote {
  slug: string;
  title: string;
  topic: string;
  summary: string;
  /** Holding the spot until a real topic note is written. */
  placeholder?: boolean;
  confused?: string;
  story?: string;
  link?: { name: string; url: string; open: string };
  use?: string;
  cards?: StudyCard[];
}

/**
 * Topics already studied, published as notes.
 * A short note can use the four fields. A bigger topic is a list of study cards.
 * Do not add a roadmap chapter for it.
 */
export const notes: TopicNote[] = [
  {
    slug: "langgraph",
    title: "LangGraph",
    topic: "Agents",
    summary: "The full LangGraph notes, told the same way as the roadmap. Every section is in here. Open any card.",
    link: {
      name: "LangGraph docs",
      url: "https://docs.langchain.com/oss/python/langgraph/overview",
      open: "Read the overview, then come back to the first card.",
    },
    cards: langgraphCards,
  },
];

export function getNote(slug: string) {
  return notes.find((note) => note.slug === slug);
}

export function getStudyCard(noteSlug: string, cardSlug: string) {
  const note = getNote(noteSlug);
  const cards = note?.cards ?? [];
  const index = cards.findIndex((card) => card.slug === cardSlug);
  if (!note || index < 0) return null;
  return {
    note,
    card: cards[index],
    index,
    total: cards.length,
    prev: index > 0 ? cards[index - 1] : null,
    next: index < cards.length - 1 ? cards[index + 1] : null,
  };
}
