import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStudyCard, notes } from "@/data/notes";
import { StudyCardView } from "@/components/study-card-view";

interface Props {
  params: Promise<{ slug: string; card: string }>;
}

export function generateStaticParams() {
  return notes.flatMap((note) =>
    (note.cards ?? []).map((card) => ({
      slug: note.slug,
      card: card.slug,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, card: cardSlug } = await params;
  const found = getStudyCard(slug, cardSlug);
  if (!found) return { title: "Not Found" };
  return { title: found.card.title, description: found.card.lead };
}

export default async function StudyCardPage({ params }: Props) {
  const { slug, card: cardSlug } = await params;
  const found = getStudyCard(slug, cardSlug);
  if (!found) notFound();
  return (
    <StudyCardView
      note={found.note}
      card={found.card}
      index={found.index}
      total={found.total}
      prev={found.prev}
      next={found.next}
    />
  );
}
