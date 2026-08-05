"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { KeyRound, Sparkles, X, ArrowRight, Zap } from "lucide-react";

export function ApiKeysWelcomePopup() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !visible) return null;

  return createPortal(
    <aside
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] w-[min(calc(100vw-2rem),22rem)]"
      role="dialog"
      aria-labelledby="api-keys-popup-title"
    >
      <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-surface shadow-2xl glow ring-1 ring-black/5 dark:ring-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(194,65,12,0.12),transparent)] pointer-events-none" />

        <button
          type="button"
          onClick={() => setVisible(false)}
          className="absolute right-2 top-2 z-10 rounded-lg p-1.5 text-text-muted hover:bg-surface-elevated hover:text-text-primary transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative p-5">
          <div className="flex items-center gap-2 mb-3 pr-6">
            <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
              <Sparkles className="h-3 w-3" />
              Start here
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-royal/30 bg-royal/10 px-2 py-0.5 text-[10px] font-medium text-royal">
              <Zap className="h-3 w-3" />
              Free
            </span>
          </div>

          <div className="flex gap-3 mb-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-royal text-on-accent shadow-md">
              <KeyRound className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 id="api-keys-popup-title" className="text-base font-bold leading-snug mb-1">
                Get API keys <span className="gradient-text">first</span>
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                Free keys for Gemini, OpenAI &amp; Grok — needed before you run any code in Phase
                1.
              </p>
            </div>
          </div>

          <ul className="space-y-1.5 mb-4 text-xs text-text-secondary">
            {[
              "Gemini recommended — step-by-step guide",
              "Free & paid options on one page",
            ].map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-accent font-bold shrink-0">✓</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2">
            <Link
              href="/get-api-keys"
              onClick={() => setVisible(false)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent hover:bg-accent/90 transition-colors"
            >
              Get free API keys
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="text-xs font-medium text-text-muted hover:text-text-secondary transition-colors py-1"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </aside>,
    document.body
  );
}
