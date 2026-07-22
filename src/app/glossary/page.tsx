import type { Metadata } from "next";
import { glossary, getGlossaryByLetter } from "@/data/glossary";
import { GlossaryContent } from "@/components/glossary-content";

export const metadata: Metadata = {
  title: "Glossary",
  description: "AI Engineering glossary — definitions, analogies, and interview tips for every key concept.",
};

export default function GlossaryPage() {
  const byLetter = getGlossaryByLetter();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Glossary</h1>
        <p className="text-text-secondary max-w-2xl">
          Engineering-focused definitions with analogies, use cases, and interview tips.
          {" "}{glossary.length} terms covering AI Engineering, GenAI, RAG, and Agentic AI.
        </p>
      </div>

      <GlossaryContent entries={glossary} byLetter={byLetter} />
    </div>
  );
}
