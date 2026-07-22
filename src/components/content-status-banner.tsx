"use client";

import { AlertCircle } from "lucide-react";

export function ContentStatusBanner() {
  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 mb-8">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-sm text-amber-200 mb-1">Lesson publishing in progress</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Phases 0–1 were taught live — module pages are being published to match the v2
            curriculum. Explore the roadmap structure and use Glossary / Interview Prep while
            lessons are added.
          </p>
        </div>
      </div>
    </div>
  );
}
