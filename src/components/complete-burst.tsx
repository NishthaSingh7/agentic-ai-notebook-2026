"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const LINES = [
  "You can leave this card behind.",
  "One less thing waiting on you.",
  "You did the work. It counts.",
  "Put it down. The next one can wait.",
  "This one is yours now.",
];

const COLORS = ["var(--accent)", "var(--royal)", "var(--success)", "var(--accent-dim)"];

const PIECES = Array.from({ length: 18 }, (_, index) => ({
  x: `${(index * 37) % 100}%`,
  width: index % 3 === 0 ? 8 : 9,
  height: index % 3 === 0 ? 8 : 14,
  radius: index % 3 === 0 ? 99 : 2,
  color: COLORS[index % COLORS.length],
  delay: `${(index % 6) * 45}ms`,
  duration: `${1.2 + (index % 5) * 0.12}s`,
  spin: `${140 + index * 26}deg`,
  drift: `${(index % 2 === 0 ? -1 : 1) * (16 + (index % 4) * 12)}px`,
}));

export function CompleteBurst({
  title,
  detail,
  seed,
  onDismiss,
}: {
  title: string;
  detail: string;
  seed: number;
  onDismiss: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const line = LINES[Math.abs(seed) % LINES.length];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);
    const timer = window.setTimeout(onDismiss, 4600);
    buttonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [onDismiss]);

  return createPortal(
    <div className="complete-veil" onClick={onDismiss}>
      <div className="complete-confetti" aria-hidden>
        {PIECES.map((piece, index) => (
          <span
            key={index}
            className="complete-piece"
            style={{
              left: piece.x,
              width: piece.width,
              height: piece.height,
              borderRadius: piece.radius,
              background: piece.color,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              ["--spin" as string]: piece.spin,
              ["--drift" as string]: piece.drift,
            }}
          />
        ))}
      </div>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="complete-moment-title"
        className="complete-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="complete-seal" aria-hidden>
          <span className="complete-seal-ring" />
          <svg viewBox="0 0 24 24" className="complete-check">
            <path d="M4 12.5 L10 18.5 L20 6.5" />
          </svg>
        </div>
        <p className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-accent">You finished it</p>
        <h2 id="complete-moment-title" className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">
          {title}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-text-secondary">{line}</p>
        <p className="mt-2 text-sm text-text-muted">{detail}</p>
        <button
          ref={buttonRef}
          type="button"
          onClick={onDismiss}
          className="mt-6 w-full rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-on-accent hover:bg-accent-dim"
        >
          Keep going
        </button>
      </div>
    </div>,
    document.body
  );
}
