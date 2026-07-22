"use client";

import { AlertCircle } from "lucide-react";

export function ContentStatusBanner() {
  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 mb-8">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-sm text-amber-200 mb-1">Coming in a future update</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Phases 7–10 are being developed incrementally. Phases 0–6 have full lessons with diagrams,
            code, and revision notes — start there while we finish this content.
          </p>
        </div>
      </div>
    </div>
  );
}
