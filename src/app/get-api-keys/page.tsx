import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  KeyRound,
  Shield,
  Sparkles,
  CheckCircle2,
  CreditCard,
  Gift,
} from "lucide-react";
import { LessonCodeBlock } from "@/components/lesson-code-block";
import {
  apiKeysIntro,
  apiProviders,
  apiKeysSecurity,
} from "@/data/api-keys-guide";

export const metadata: Metadata = {
  title: "Get Free API Keys",
  description:
    "Step-by-step guide to create free API keys for Google Gemini, OpenAI, and Grok — the first step before building AI apps, RAG, or agents.",
};

export default function GetApiKeysPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,rgba(194,65,12,0.1),transparent)]" />
        <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent mb-6">
            <KeyRound className="h-3.5 w-3.5" />
            Step zero for every AI builder
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {apiKeysIntro.title}
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            {apiKeysIntro.subtitle}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-16">
        {/* Why it matters */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Why API keys come first
          </h2>
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <ul className="space-y-3">
              {apiKeysIntro.whyItMatters.map((line) => (
                <li key={line} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Providers */}
        <section className="space-y-10">
          <div>
            <h2 className="text-2xl font-bold mb-2">Choose your provider</h2>
            <p className="text-text-secondary text-sm">
              Start with <strong className="text-text-primary">Gemini</strong> — it&apos;s free, fast,
              and what we use most in this notebook. Add OpenAI or Grok when you want to compare
              models.
            </p>
          </div>

          {apiProviders.map((provider, index) => (
            <article
              key={provider.id}
              id={provider.id}
              className="scroll-mt-28 rounded-2xl border border-border bg-surface overflow-hidden shadow-sm"
            >
              <div
                className={`px-6 py-5 sm:px-8 border-b border-border ${
                  provider.recommended
                    ? "bg-gradient-to-r from-accent/10 via-royal/5 to-transparent"
                    : "bg-surface-elevated/50"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {provider.recommended && (
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-on-accent">
                      Recommended
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-1">{provider.name}</h3>
                <p className="text-sm text-text-secondary">{provider.tagline}</p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <a
                    href={provider.consoleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:bg-accent/90 transition-colors"
                  >
                    Open console
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={provider.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-elevated transition-colors"
                  >
                    Read docs
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-8">
                {/* Steps */}
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
                    Step-by-step
                  </h4>
                  <ol className="space-y-4">
                    {provider.steps.map((step, i) => (
                      <li key={step.title} className="flex gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-medium text-text-primary">{step.title}</p>
                          <p className="text-sm text-text-secondary mt-0.5 leading-relaxed">
                            {step.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Free vs Paid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-success/30 bg-success/5 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Gift className="h-4 w-4 text-success" />
                      <h4 className="font-semibold text-sm">{provider.freeTier.headline}</h4>
                    </div>
                    <ul className="space-y-2">
                      {provider.freeTier.bullets.map((b) => (
                        <li key={b} className="text-xs text-text-secondary leading-relaxed flex gap-2">
                          <span className="text-success">•</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-border bg-surface-elevated/40 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className="h-4 w-4 text-text-muted" />
                      <h4 className="font-semibold text-sm">{provider.paidTier.headline}</h4>
                    </div>
                    <ul className="space-y-2">
                      {provider.paidTier.bullets.map((b) => (
                        <li key={b} className="text-xs text-text-secondary leading-relaxed flex gap-2">
                          <span className="text-text-muted">•</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Env var */}
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs text-text-muted mb-2">Environment variable</p>
                  <code className="text-sm font-mono text-accent">{provider.envVar}</code>
                </div>

                {/* Quick test */}
                {provider.quickTest && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Quick test (Python)</h4>
                    <LessonCodeBlock
                      code={provider.quickTest}
                      language="python"
                      title={`test_${provider.id}.py`}
                    />
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>

        {/* Security */}
        <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            {apiKeysSecurity.title}
          </h2>
          <ul className="space-y-2">
            {apiKeysSecurity.rules.map((rule) => (
              <li key={rule} className="text-sm text-text-secondary flex gap-2">
                <span className="text-amber-600 dark:text-amber-400">⚠</span>
                {rule}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="text-center pb-8">
          <h2 className="text-2xl font-bold mb-3">Keys ready? Start building.</h2>
          <p className="text-text-secondary mb-6 max-w-lg mx-auto text-sm">
            Head to Phase 1 — Generative AI Foundations and run the code in each module with your new
            API key.
          </p>
          <Link
              href="/roadmap/genai-foundations"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-on-accent hover:bg-accent/90 transition-colors"
            >
              Start Phase 1 — GenAI
              <ArrowRight className="h-4 w-4" />
            </Link>
        </section>
      </div>
    </div>
  );
}
