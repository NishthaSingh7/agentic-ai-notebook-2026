import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { interviewTopics, categoryLabels, categoryColors } from "@/data/interview";
import { getInterviewQuestions } from "@/data/interview-questions";
import { InterviewQ } from "@/components/lesson";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return interviewTopics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = interviewTopics.find((t) => t.slug === slug);
  if (!topic) return { title: "Not Found" };
  return { title: `${topic.title} — Interview Questions` };
}

export default async function InterviewTopicPage({ params }: Props) {
  const { slug } = await params;
  const topic = interviewTopics.find((t) => t.slug === slug);
  if (!topic) notFound();

  const questions = getInterviewQuestions(slug);
  const questionCount = questions.length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/interview"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary mb-6 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Interview Prep
      </Link>

      <header className="mb-8">
        <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-medium mb-3", categoryColors[topic.category])}>
          {categoryLabels[topic.category]}
        </span>
        <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
        <p className="text-text-secondary">
          {questionCount} interview questions with detailed answers.
        </p>
      </header>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <InterviewQ key={i} question={q.question} answer={q.answer} difficulty={q.difficulty} />
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-surface p-5">
        <h3 className="font-semibold mb-2">Common Mistakes</h3>
        <ul className="space-y-1.5 text-sm text-text-secondary">
          <li>• Giving surface-level answers without discussing tradeoffs</li>
          <li>• Not connecting theory to real production experience</li>
          <li>• Ignoring cost, latency, and scalability considerations</li>
          <li>• Forgetting to mention evaluation and monitoring</li>
        </ul>
      </div>
    </div>
  );
}
