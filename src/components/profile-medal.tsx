"use client";

import Link from "next/link";
import type { Phase } from "@/data/roadmap";
import { cn } from "@/lib/utils";

function scallopPath(cx: number, cy: number, outer: number, inner: number, tips = 16) {
  const pts: string[] = [];
  const total = tips * 2;
  for (let i = 0; i < total; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / tips - Math.PI / 2;
    const x = (cx + r * Math.cos(a)).toFixed(2);
    const y = (cy + r * Math.sin(a)).toFixed(2);
    pts.push(`${i === 0 ? "M" : "L"}${x} ${y}`);
  }
  return `${pts.join(" ")} Z`;
}

interface ProfileMedalProps {
  phase: Phase;
  total: number;
}

export function ProfileMedal({ phase, total }: ProfileMedalProps) {
  const metalId = `medal-metal-${phase.slug}`;
  const rimId = `medal-rim-${phase.slug}`;
  const edge = scallopPath(44, 48, 40, 34.5, 18);

  return (
    <Link
      href={`/roadmap/${phase.slug}`}
      title={`${phase.title} · ${phase.subtitle} · all ${total} modules cleared`}
      className="group flex w-[6.75rem] flex-col items-center text-center"
    >
      <span className="relative block h-[7.4rem] w-[5.85rem] transition-transform duration-200 group-hover:-translate-y-1 group-hover:rotate-[-5deg]">
        <span className="absolute left-1/2 top-[2px] z-0 flex -translate-x-1/2">
          <span
            className={cn(
              "block h-11 w-3.5 origin-top -rotate-[18deg] bg-gradient-to-b shadow-sm",
              phase.color
            )}
            style={{ clipPath: "polygon(10% 0, 100% 0, 82% 100%, 0 100%)" }}
          />
          <span
            className={cn(
              "block h-11 w-3.5 origin-top rotate-[18deg] -ml-[3px] bg-gradient-to-b shadow-sm",
              phase.color
            )}
            style={{ clipPath: "polygon(0 0, 90% 0, 100% 100%, 18% 100%)" }}
          />
        </span>

        <svg
          viewBox="0 0 88 92"
          className="absolute bottom-0 left-1/2 h-[5.85rem] w-[5.6rem] -translate-x-1/2 drop-shadow-[0_10px_14px_rgba(120,53,15,0.4)]"
          aria-hidden
        >
          <defs>
            <radialGradient id={metalId} cx="34%" cy="28%" r="72%">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="32%" stopColor="#facc15" />
              <stop offset="68%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>
            <linearGradient id={rimId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="45%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
          </defs>
          <path d={edge} fill={`url(#${rimId})`} />
          <circle cx="44" cy="48" r="31" fill={`url(#${metalId})`} />
          <circle cx="44" cy="48" r="27.5" fill="none" stroke="#fde68a" strokeWidth="1.6" />
          <circle cx="44" cy="48" r="24.5" fill="none" stroke="#92400e" strokeWidth="0.9" opacity="0.4" />
          <circle cx="44" cy="10" r="4.4" fill={`url(#${metalId})`} stroke="#fde68a" strokeWidth="1.5" />
          <rect x="41.6" y="12.5" width="4.8" height="9" rx="1" fill="#eab308" />
        </svg>

        <span
          className={cn(
            "absolute bottom-[0.72rem] left-1/2 z-10 flex h-[3.15rem] w-[3.15rem] -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-7px_12px_rgba(0,0,0,0.3)]",
            phase.color
          )}
        >
          <span className="font-sketch text-[1.3rem] leading-none drop-shadow-sm">{phase.id}</span>
        </span>
      </span>

      <span className="font-sketch mt-1 line-clamp-2 text-[13px] leading-tight text-text-primary group-hover:text-accent">
        {phase.title}
      </span>
      <span className="mt-0.5 text-[10px] text-text-muted">
        {phase.subtitle}
        {phase.optional ? " · Optional" : ""}
      </span>
    </Link>
  );
}

export function GhostMedal() {
  const edge = scallopPath(44, 48, 40, 34.5, 18);

  return (
    <div className="flex w-[6.75rem] flex-col items-center text-center">
      <span className="relative block h-[7.4rem] w-[5.85rem] opacity-40">
        <span className="absolute left-1/2 top-[2px] z-0 flex -translate-x-1/2">
          <span className="block h-11 w-3.5 origin-top -rotate-[18deg] bg-border" />
          <span className="block h-11 w-3.5 origin-top rotate-[18deg] -ml-[3px] bg-border" />
        </span>
        <svg
          viewBox="0 0 88 92"
          className="absolute bottom-0 left-1/2 h-[5.85rem] w-[5.6rem] -translate-x-1/2"
          aria-hidden
        >
          <path d={edge} fill="none" stroke="currentColor" strokeWidth="1.8" strokeDasharray="4 3" className="text-border" />
        </svg>
      </span>
      <span className="font-sketch mt-1 text-[13px] text-text-muted">Waiting</span>
    </div>
  );
}
