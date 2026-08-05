"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Presentation } from "lucide-react";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import type { ProjectSlide } from "@/data/project-types";
import { cn } from "@/lib/utils";

interface ProjectSlideshowProps {
  slides: ProjectSlide[];
  projectTitle: string;
}

export function ProjectSlideshow({ slides, projectTitle }: ProjectSlideshowProps) {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const slide = slides[index];

  const go = useCallback(
    (next: number) => {
      setIndex(Math.max(0, Math.min(total - 1, next)));
    },
    [total]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  if (!slide) return null;

  return (
    <div className="not-prose rounded-2xl border-2 border-stone-300/80 bg-[#faf8f5] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-stone-300/60 bg-white/70">
        <div className="flex items-center gap-2 min-w-0">
          <Presentation className="h-4 w-4 text-accent shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-600 truncate">
              Project walkthrough
            </p>
            <p className="text-[10px] text-stone-500 truncate">{projectTitle}</p>
          </div>
        </div>
        <span className="text-xs font-mono text-stone-600 tabular-nums shrink-0">
          {index + 1} / {total}
        </span>
      </div>

      <div className="min-h-[320px] sm:min-h-[380px] p-5 sm:p-8 flex flex-col">
        <div className="flex-1">
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-1">{slide.title}</h3>
          {slide.subtitle && (
            <p className="text-sm text-stone-600 mb-4 leading-relaxed">{slide.subtitle}</p>
          )}

          {slide.bullets && slide.bullets.length > 0 && (
            <ul className="space-y-2 mb-4">
              {slide.bullets.map((line) => (
                <li key={line} className="flex gap-2 text-sm text-stone-700 leading-relaxed">
                  <span className="text-accent font-bold shrink-0">→</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          )}

          {slide.diagram && (
            <div className="mt-2">
              <MermaidDiagram chart={slide.diagram} sketch zoomable />
              {slide.caption && (
                <p className="text-xs text-stone-500 text-center mt-2">{slide.caption}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-stone-300/60 bg-white/60">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            index === 0
              ? "text-stone-400 cursor-not-allowed"
              : "text-stone-700 hover:bg-stone-200/80"
          )}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>

        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index ? "w-6 bg-accent" : "w-2 bg-stone-300 hover:bg-stone-400"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === total - 1}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            index === total - 1
              ? "text-stone-400 cursor-not-allowed"
              : "text-stone-700 hover:bg-stone-200/80"
          )}
          aria-label="Next slide"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-[10px] text-stone-500 text-center py-2 border-t border-stone-300/40">
        Use ← → arrow keys or buttons to navigate the walkthrough
      </p>
    </div>
  );
}
