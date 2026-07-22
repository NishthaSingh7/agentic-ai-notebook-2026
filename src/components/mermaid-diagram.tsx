"use client";

import { useEffect, useRef, useState } from "react";

interface MermaidDiagramProps {
  chart: string;
  title?: string;
}

export function MermaidDiagram({ chart, title }: MermaidDiagramProps) {
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
          theme: "dark",
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
  }, [chart]);

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4 overflow-x-auto">
        {title && <p className="text-xs font-semibold text-text-muted mb-2 uppercase">{title}</p>}
        <pre className="text-xs text-text-secondary font-mono whitespace-pre">{chart}</pre>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4 overflow-x-auto my-4">
      {title && <p className="text-xs font-semibold text-text-muted mb-3 uppercase tracking-wider">{title}</p>}
      {svg ? (
        <div ref={ref} dangerouslySetInnerHTML={{ __html: svg }} className="flex justify-center" />
      ) : (
        <div className="h-32 flex items-center justify-center text-sm text-text-muted">Loading diagram...</div>
      )}
    </div>
  );
}
