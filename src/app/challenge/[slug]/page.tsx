import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { challengeTopics, getChallengeBySlug } from "@/data/challenges";
import { getChallengeLesson } from "@/data/challenge-lessons";
import { ChallengeLessonView } from "@/components/challenge-lesson-view";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return challengeTopics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = getChallengeBySlug(slug);
  if (!topic) return { title: "Not Found" };
  return {
    title: `${topic.title} — Challenge`,
    description: topic.tagline,
  };
}

export default async function ChallengeLessonPage({ params }: Props) {
  const { slug } = await params;
  const topic = getChallengeBySlug(slug);
  const lesson = getChallengeLesson(slug);
  if (!topic || !lesson) notFound();

  return <ChallengeLessonView topic={topic} lesson={lesson} />;
}
