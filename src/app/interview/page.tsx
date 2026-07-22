import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { interviewTopics, categoryLabels, categoryColors } from "@/data/interview";
import { getInterviewQuestions } from "@/data/interview-questions";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Interview Preparation",
  description: "Top AI Engineering interview questions — theory, coding, system design, and architecture.",
};

export default function InterviewPage() {
  const categories = ["theory", "coding", "system-design", "architecture"] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Interview Preparation</h1>
        <p className="text-text-secondary max-w-2xl">
          Top 20 questions per topic covering theory, coding, system design, and architecture.
          Each topic includes common mistakes and detailed answers.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {categories.map((cat) => {
          const count = interviewTopics.filter((t) => t.category === cat).length;
          return (
            <div key={cat} className="rounded-xl border border-border bg-surface p-5">
              <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-medium mb-2", categoryColors[cat])}>
                {categoryLabels[cat]}
              </span>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs text-text-muted">topics</div>
            </div>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {interviewTopics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/interview/${topic.slug}`}
            className="group rounded-xl border border-border bg-surface p-5 transition-all hover:bg-surface-elevated"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold group-hover:text-accent transition-colors">
                {topic.title}
              </h3>
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", categoryColors[topic.category])}>
                {categoryLabels[topic.category]}
              </span>
            </div>
            <p className="text-sm text-text-muted mb-3">
              {getInterviewQuestions(topic.slug).length} questions
            </p>
            <span className="flex items-center gap-1 text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">
              Start practicing <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
