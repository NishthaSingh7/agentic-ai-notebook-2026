import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { resources } from "@/data/resources";

export const metadata: Metadata = {
  title: "Resources",
  description: "Curated books, papers, courses, tools, and APIs for AI Engineering.",
};

const typeIcons: Record<string, string> = {
  book: "📚",
  paper: "📄",
  blog: "✍️",
  course: "🎓",
  github: "💻",
  youtube: "▶️",
  tool: "🔧",
  api: "🔌",
  dataset: "📊",
};

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Resources</h1>
        <p className="text-text-secondary max-w-2xl">
          Curated, not exhaustive. The best books, papers, courses, tools, and APIs
          for AI Engineering — hand-picked for practical learning.
        </p>
      </div>

      <div className="space-y-12">
        {Object.entries(resources).map(([category, items]) => (
          <section key={category}>
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((resource) => (
                <a
                  key={resource.url}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-border bg-surface p-5 transition-all hover:bg-surface-elevated hover:border-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-lg">{typeIcons[resource.type] ?? "📌"}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-medium text-sm mb-1 group-hover:text-accent transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {resource.description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
