"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getDateKey, pickRandomChallenge } from "@/data/challenges";

const DRAW_KEY = "agentic-ai-daily-challenge";

export function ChallengeHub() {
  const router = useRouter();
  const dateKey = useMemo(() => getDateKey(), []);
  const [opening, setOpening] = useState(false);

  function draw() {
    if (opening) return;
    setOpening(true);
    const next = pickRandomChallenge();
    localStorage.setItem(DRAW_KEY, JSON.stringify({ date: dateKey, slug: next.slug }));
    window.setTimeout(() => {
      router.push(`/challenge/${next.slug}`);
    }, 1450);
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 pb-16 pt-10 text-center sm:pt-14">
      <p className="ch-kicker mb-4">One sitting</p>
      <h1 className="ch-display text-4xl leading-[1.05] text-[#f6ebd4] sm:text-5xl">
        Challenge
        <span className="block italic text-[#e8c9a0]">for a day</span>
      </h1>
      <p className="ch-serif mt-4 max-w-md text-[1.05rem] leading-relaxed text-[#d7cbb6]">
        A sealed letter. Break the wax. One topic lands — beginner to production.
        The name stays inside until it opens.
      </p>

      <button
        type="button"
        onClick={draw}
        disabled={opening}
        aria-label={opening ? "Opening today's challenge" : "Draw today's challenge"}
        className="mt-8 w-full max-w-md border-0 bg-transparent p-0"
      >
        <div className="ch-table">
          <div className="ch-mail" data-open={opening}>
            <div className="ch-mail-sheet">
              <p className="ch-chip text-[#9f1239]">Today&apos;s sitting</p>
              <p className="ch-serif px-6 text-sm leading-relaxed text-[#5c5348]">
                {opening ? "Opening the letter…" : "The name stays sealed."}
              </p>
            </div>
            <div className="ch-mail-body" />
            <div className="ch-mail-flap" />
            <div className="ch-wax" aria-hidden />
          </div>
        </div>
      </button>

      <button type="button" onClick={draw} disabled={opening} className="ch-draw-btn">
        {opening ? "Opening…" : "Break the seal"}
      </button>
    </div>
  );
}
