"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MermaidDiagramProps {
  chart: string;
  title?: string;
  compact?: boolean;
  /** Excalidraw-style hand-drawn flowcharts on a light canvas */
  sketch?: boolean;
}

const SKETCH_THEME = {
  look: "handDrawn" as const,
  theme: "base" as const,
  themeVariables: {
    darkMode: false,
    fontFamily: "Segoe UI, system-ui, sans-serif",
    fontSize: "15px",
    background: "#faf8f5",
    mainBkg: "#ffffff",
    nodeBorder: "#1c1917",
    clusterBkg: "#f5f5f4",
    clusterBorder: "#1c1917",
    titleColor: "#0f0f0f",
    edgeLabelBackground: "#ffffff",
    edgeLabelText: "#0f0f0f",
    primaryColor: "#ffffff",
    primaryTextColor: "#0f0f0f",
    primaryBorderColor: "#1c1917",
    secondaryColor: "#e8f4fc",
    secondaryTextColor: "#0f0f0f",
    secondaryBorderColor: "#1c1917",
    tertiaryColor: "#fff8e6",
    tertiaryTextColor: "#0f0f0f",
    tertiaryBorderColor: "#1c1917",
    lineColor: "#292524",
    textColor: "#0f0f0f",
    nodeTextColor: "#0f0f0f",
    labelTextColor: "#0f0f0f",
    actorTextColor: "#0f0f0f",
    signalTextColor: "#0f0f0f",
    noteTextColor: "#0f0f0f",
    attributeBackgroundColorEven: "#ffffff",
    attributeBackgroundColorOdd: "#f5f5f4",
  },
};

const DEFAULT_THEME = {
  theme: "dark" as const,
  themeVariables: {
    primaryColor: "#4ade80",
    primaryTextColor: "#fafafa",
    primaryBorderColor: "#262626",
    lineColor: "#4169e1",
    secondaryColor: "#141414",
    tertiaryColor: "#0c0c0c",
    background: "#141414",
    mainBkg: "#141414",
    nodeBorder: "#262626",
    clusterBkg: "#141414",
    titleColor: "#fafafa",
    edgeLabelBackground: "#141414",
  },
};

export function MermaidDiagram({ chart, title, compact, sketch }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          ...(sketch ? SKETCH_THEME : DEFAULT_THEME),
        });
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg: rendered } = await mermaid.render(id, chart);
        if (!cancelled) setSvg(rendered);
      } catch {
        if (!cancelled) setError(true);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart, sketch]);

  const containerClass = cn(
    "overflow-x-auto",
    compact ? "p-3 my-3 max-w-lg" : "p-5 my-4",
    sketch
      ? "rounded-xl border-2 border-stone-300/80 bg-[#faf8f5] shadow-sm"
      : compact
        ? "rounded-lg border border-border/60 bg-surface-elevated/40"
        : "rounded-xl border border-border bg-surface"
  );

  if (error) {
    return (
      <div className={containerClass}>
        {title && !compact && (
          <p className="text-xs font-semibold text-stone-600 mb-2 uppercase">{title}</p>
        )}
        <pre className="text-xs text-stone-600 font-mono whitespace-pre">{chart}</pre>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {title && !compact && (
        <p
          className={cn(
            "text-xs font-semibold mb-3 uppercase tracking-wider",
            sketch ? "text-stone-600" : "text-text-muted"
          )}
        >
          {title}
        </p>
      )}
      {svg ? (
        <div
          ref={ref}
          dangerouslySetInnerHTML={{ __html: svg }}
          className={cn(
            "flex justify-center [&_svg]:max-w-full",
            sketch && "mermaid-sketch",
            compact && "scale-[0.92] origin-center"
          )}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center",
            compact ? "h-20 text-xs" : "h-32 text-sm",
            sketch ? "text-stone-500" : "text-text-muted"
          )}
        >
          Loading diagram...
        </div>
      )}
    </div>
  );
}
