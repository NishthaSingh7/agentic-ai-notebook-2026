import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNote, notes } from "@/data/notes";
import { NoteView } from "@/components/note-view";
import { NoteTopic } from "@/components/note-topic";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return { title: "Not Found" };
  return { title: note.title, description: note.summary || note.topic };
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();
  if (note.cards?.length) return <NoteTopic note={note} />;
  return <NoteView note={note} />;
}
