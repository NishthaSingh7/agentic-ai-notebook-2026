"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Minus, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface MermaidDiagramProps {
  chart: string;
  title?: string;
  compact?: boolean;
  /** Excalidraw-style hand-drawn flowcharts on a light canvas */
  sketch?: boolean;
  /** Fit inside a viewport at 50% with zoom controls */
  zoomable?: boolean;
  /** Initial zoom level (1 = 100%) */
  defaultZoom?: number;
}

const SKETCH_FONT = "Excalifont, Segoe UI, cursive";

const SKETCH_THEME = {
  look: "handDrawn" as const,
  theme: "base" as const,
  themeVariables: {
    darkMode: false,
    fontFamily: SKETCH_FONT,
    fontSize: "14px",
    background: "#faf8f5",
    mainBkg: "#fef9c3",
    nodeBorder: "#78716c",
    clusterBkg: "#f5f5f4",
    clusterBorder: "#a8a29e",
    titleColor: "#0f0f0f",
    edgeLabelBackground: "#ffffff",
    edgeLabelText: "#0f0f0f",
    primaryColor: "#dbeafe",
    primaryTextColor: "#1e40af",
    primaryBorderColor: "#60a5fa",
    secondaryColor: "#ede9fe",
    secondaryTextColor: "#5b21b6",
    secondaryBorderColor: "#a78bfa",
    tertiaryColor: "#dcfce7",
    tertiaryTextColor: "#166534",
    tertiaryBorderColor: "#c2410c",
    lineColor: "#57534e",
    textColor: "#0f0f0f",
    nodeTextColor: "#0f0f0f",
    labelTextColor: "#0f0f0f",
    actorTextColor: "#0f0f0f",
    signalTextColor: "#0f0f0f",
    noteTextColor: "#0f0f0f",
    attributeBackgroundColorEven: "#e0f2fe",
    attributeBackgroundColorOdd: "#fce7f3",
  },
};

const DEFAULT_THEME = {
  theme: "base" as const,
  themeVariables: {
    primaryColor: "#fff7ed",
    primaryTextColor: "#1c1917",
    primaryBorderColor: "#c2410c",
    lineColor: "#7c3aed",
    secondaryColor: "#f5f3ff",
    tertiaryColor: "#faf8f5",
    background: "#faf8f5",
    mainBkg: "#ffffff",
    nodeBorder: "#d6d3d1",
    clusterBkg: "#f5f5f4",
    titleColor: "#1c1917",
    edgeLabelBackground: "#ffffff",
  },
};

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

export function MermaidDiagram({
  chart,
  title,
  compact,
  sketch,
  zoomable = false,
  defaultZoom = 1,
}: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(defaultZoom);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!svg || !ref.current) return;

    const measure = () => {
      const svgEl = ref.current?.querySelector("svg");
      if (!svgEl) return;

      const attrW = parseFloat(svgEl.getAttribute("width") || "");
      const attrH = parseFloat(svgEl.getAttribute("height") || "");
      if (attrW > 0 && attrH > 0) {
        setNaturalSize({ width: attrW, height: attrH });
        return;
      }

      try {
        const box = svgEl.getBBox();
        if (box.width > 0 && box.height > 0) {
          setNaturalSize({ width: box.width, height: box.height });
          return;
        }
      } catch {
        // getBBox can throw before SVG is painted
      }

      const rect = svgEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setNaturalSize({ width: rect.width, height: rect.height });
      }
    };

    const raf = requestAnimationFrame(measure);
    const svgEl = ref.current.querySelector("svg");
    if (!svgEl) return () => cancelAnimationFrame(raf);

    const observer = new ResizeObserver(() => measure());
    observer.observe(svgEl);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [svg]);

  useEffect(() => {
    let cancelled = false;

    async function tryRender(useSketch: boolean) {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        ...(useSketch ? SKETCH_THEME : DEFAULT_THEME),
      });
      const id = `mermaid-${Math.random().toString(36).slice(2)}`;
      const { svg: rendered } = await mermaid.render(id, chart);
      if (!cancelled) {
        setSvg(rendered);
        setError(false);
      }
    }

    async function render() {
      if (sketch && typeof document !== "undefined") {
        try {
          await Promise.race([
            document.fonts.load("14px Excalifont"),
            new Promise((resolve) => setTimeout(resolve, 1500)),
          ]);
        } catch {
          // Font load is optional — never block diagram rendering
        }
      }

      try {
        await tryRender(!!sketch);
      } catch {
        if (sketch) {
          try {
            await tryRender(false);
            return;
          } catch {
            // fall through to error state
          }
        }
        if (!cancelled) setError(true);
      }
    }

    setSvg("");
    setError(false);
    void render();
    return () => {
      cancelled = true;
    };
  }, [chart, sketch]);

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(MAX_ZOOM, Math.round((z + ZOOM_STEP) * 100) / 100));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(MIN_ZOOM, Math.round((z - ZOOM_STEP) * 100) / 100));
  }, []);

  const resetZoom = useCallback(() => setZoom(defaultZoom), [defaultZoom]);

  const containerClass = cn(
    zoomable ? "not-prose" : "overflow-x-auto",
    !zoomable && (compact ? "p-3 my-3 max-w-lg" : "p-5 my-4"),
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
        <p className="text-sm text-amber-700 dark:text-amber-400/90 px-4 py-3 not-prose">
          Diagram could not be rendered. Refresh the page or report this module if it persists.
        </p>
      </div>
    );
  }

  const diagramContent = svg ? (
    <div
      ref={ref}
      dangerouslySetInnerHTML={{ __html: svg }}
      className={cn(
        "inline-block min-w-full [&_svg]:max-w-none [&_svg]:h-auto",
        sketch && "mermaid-sketch",
        !zoomable && compact && "scale-[0.92] origin-center"
      )}
    />
  ) : (
    <div
      className={cn(
        "flex items-center justify-center",
        zoomable ? "h-40" : compact ? "h-20 text-xs" : "h-32 text-sm",
        sketch ? "text-stone-500" : "text-text-muted"
      )}
    >
      Loading diagram...
    </div>
  );

  if (zoomable) {
    const scaledWidth = naturalSize.width > 0 ? naturalSize.width * zoom : undefined;
    const scaledHeight = naturalSize.height > 0 ? naturalSize.height * zoom : undefined;

    return (
      <div className={containerClass}>
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-stone-300/60 bg-white/60">
          <div className="min-w-0">
            {title && (
              <p className="text-xs font-semibold text-stone-700 uppercase tracking-wide truncate">
                {title}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={zoomOut}
              disabled={zoom <= MIN_ZOOM}
              className="p-1.5 rounded-md hover:bg-stone-200/80 text-stone-700 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Zoom out"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="text-xs font-mono text-stone-600 w-12 text-center tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={zoomIn}
              disabled={zoom >= MAX_ZOOM}
              className="p-1.5 rounded-md hover:bg-stone-200/80 text-stone-700 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Zoom in"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={resetZoom}
              className="p-1.5 rounded-md hover:bg-stone-200/80 text-stone-700 transition-colors"
              aria-label="Reset zoom"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="p-1.5 rounded-md hover:bg-stone-200/80 text-stone-700 transition-colors"
              aria-label="Zoom to 100%"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="overflow-auto overscroll-contain p-3 bg-[#faf8f5] min-h-[min(50vh,360px)] max-h-[min(80vh,720px)]"
        >
          <div
            className="inline-block"
            style={{
              width: scaledWidth,
              height: scaledHeight,
            }}
          >
            <div
              className="origin-top-left"
              style={{
                transform: `scale(${zoom})`,
                width: naturalSize.width > 0 ? naturalSize.width : undefined,
                height: naturalSize.height > 0 ? naturalSize.height : undefined,
              }}
            >
              <div className="flex justify-start">{diagramContent}</div>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-stone-500 px-3 py-1.5 border-t border-stone-300/40 text-center">
          Scroll inside the frame to explore · use + / − to zoom up to 200%
        </p>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {title && !compact && (
        <p
          className={cn(
            "text-xs font-semibold mb-3 uppercase tracking-wider px-5 pt-5",
            sketch ? "text-stone-600" : "text-text-muted"
          )}
        >
          {title}
        </p>
      )}
      <div className={cn(!title || compact ? "" : "px-5 pb-5", "flex justify-center")}>
        {diagramContent}
      </div>
    </div>
  );
}
