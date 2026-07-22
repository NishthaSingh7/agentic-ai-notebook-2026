import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles, tutorials, and insights on AI Engineering.",
};

const posts = [
  {
    slug: "why-ai-engineering-not-ml-research",
    title: "Why AI Engineering, Not ML Research",
    excerpt:
      "The path for software engineers entering AI is fundamentally different from the PhD research track. Here's why that matters.",
    date: "2026-01-15",
    readTime: "5 min",
  },
  {
    slug: "rag-vs-fine-tuning-decision-framework",
    title: "RAG vs Fine-Tuning: A Decision Framework",
    excerpt:
      "Stop guessing. Use this framework to decide when to retrieve, when to fine-tune, and when to just prompt.",
    date: "2026-01-22",
    readTime: "8 min",
  },
  {
    slug: "building-your-first-agent",
    title: "Building Your First AI Agent",
    excerpt:
      "A step-by-step guide to going from zero to a working ReAct agent with tool calling in under an hour.",
    date: "2026-02-01",
    readTime: "12 min",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Blog</h1>
        <p className="text-text-secondary">
          Articles, tutorials, and insights on AI Engineering.
        </p>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group rounded-xl border border-border bg-surface p-6 transition-all hover:bg-surface-elevated"
          >
            <div className="flex items-center gap-3 text-xs text-text-muted mb-2">
              <time>{post.date}</time>
              <span>·</span>
              <span>{post.readTime} read</span>
            </div>
            <h2 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
              {post.title}
            </h2>
            <p className="text-sm text-text-secondary mb-3">{post.excerpt}</p>
            <span className="flex items-center gap-1 text-xs text-accent">
              Coming soon <ArrowRight className="h-3 w-3" />
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
