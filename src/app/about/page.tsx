import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Target, Users, BookOpen, Code } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "About Agentic AI Notebook 2026 — the complete AI Engineering curriculum for software engineers.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">About</h1>
        <p className="text-lg text-text-secondary leading-relaxed">
          Agentic AI Notebook 2026 is the curriculum every software engineer wishes existed when
          transitioning into AI Engineering.
        </p>
      </div>

      <div className="prose-lesson space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">The Problem</h2>
          <p>
            There are hundreds of AI roadmap websites. Most are just boxes and arrows.
            They tell you <em>what</em> to learn but not <em>how</em> to learn it,
            <em>what notes to revise</em>, or <em>what projects to build</em>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Our Approach</h2>
          <p>
            This is not another roadmap. It&apos;s a complete curriculum — think roadmap.sh
            meets DeepLearning.ai meets Full Stack Open meets an interview handbook,
            all in one place. Every topic follows the same structure:
          </p>
          <div className="rounded-xl border border-border bg-surface p-5 my-4 font-mono text-sm text-text-secondary">
            Concept → Why → Analogy → Technical → Architecture → Example → Code → Project → Interview → Revision
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Who This Is For</h2>
          <div className="grid sm:grid-cols-2 gap-4 not-prose">
            {[
              { icon: Users, title: "Software Engineers", desc: "Full stack, backend, frontend — transitioning to AI." },
              { icon: Target, title: "Career Switchers", desc: "Experienced developers entering AI Engineering." },
              { icon: BookOpen, title: "Self-Learners", desc: "Structured path without a bootcamp price tag." },
              { icon: Code, title: "Interview Prep", desc: "Theory, coding, and system design for AI roles." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-surface p-5">
                <item.icon className="h-5 w-5 text-accent mb-2" />
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Who This Is NOT For</h2>
          <p>
            AI researchers, PhD students, or people who want heavy mathematical proofs.
            This curriculum is engineering-focused — enough depth for interviews and
            production, with intuition over equations.
          </p>
        </section>

        <section id="contribute" className="scroll-mt-24">
          <h2 className="text-xl font-semibold mb-3">Contribute While You Learn</h2>
          <p>
            This notebook is built to grow with its community. If you&apos;re learning from it,
            we&apos;d love for you to give back — even small contributions make a difference.
          </p>
          <ul className="mt-4 space-y-2 text-text-secondary">
            <li>• Fix typos or unclear explanations in any module</li>
            <li>• Add revision notes from your own study sessions</li>
            <li>• Suggest better code examples or real-world analogies</li>
            <li>• Propose new glossary terms or interview questions</li>
          </ul>
          <p className="mt-4 text-sm text-text-muted">
            No contribution is too small. Learning and improving the curriculum at the same time
            is exactly how this project is meant to work.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Start Learning</h2>
          <p className="mb-4">
            Whether you&apos;re starting from scratch or jumping to GenAI foundations,
            there&apos;s a clear path for you.
          </p>
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-background hover:bg-accent/90 transition-colors"
          >
            View the Roadmap <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
