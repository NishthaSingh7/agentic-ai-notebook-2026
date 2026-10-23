"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { MermaidDiagram } from "@/components/mermaid-diagram";

export function DiagramPeek({ chart }: { chart: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="diagram-thumb mt-3 block w-full cursor-zoom-in overflow-hidden rounded-xl bg-surface p-2 text-left"
        aria-label="Open the picture"
      >
        <MermaidDiagram chart={chart} compact sketch hideCopy />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-label="Picture"
            className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl bg-surface p-4 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm text-text-primary hover:bg-surface-elevated"
              >
                <X className="h-3.5 w-3.5" /> Close
              </button>
            </div>
            <MermaidDiagram chart={chart} sketch zoomable defaultZoom={1} title="Picture" />
          </div>
        </div>
      ) : null}
    </>
  );
}
