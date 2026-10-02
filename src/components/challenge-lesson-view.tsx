"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Lightbulb,
  ListChecks,
  PenLine,
  TriangleAlert,
} from "lucide-react";
import type { ChallengeTopic } from "@/data/challenges";
import type { ChallengeLesson, ChallengeLevel } from "@/data/challenge-types";
import { LessonCodeBlock } from "@/components/lesson-code-block";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { ModuleCompleteButton } from "@/components/module-complete-button";
import { cn } from "@/lib/utils";

const levelTheme: Record<
  ChallengeLevel,
  { label: string; ink: string; wash: string; bar: string }
> = {
  beginner: {
    label: "Beginner",
    ink: "text-emerald-800",
    wash: "bg-emerald-50 border-emerald-200",
    bar: "from-emerald-700 to-emerald-400",
  },
  intermediate: {
    label: "Intermediate",
    ink: "text-stone-800",
    wash: "bg-stone-100 border-stone-300",
    bar: "from-stone-700 to-stone-400",
  },
  advanced: {
    label: "Advanced",
    ink: "text-rose-900",
    wash: "bg-rose-50 border-rose-200",
    bar: "from-rose-800 to-rose-400",
  },
};

interface ChallengeLessonViewProps {
  topic: ChallengeTopic;
  lesson: ChallengeLesson;
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="ch-prose">
      {paragraphs.map((paragraph, index) => (
        <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
      ))}
    </div>
  );
}

export function ChallengeLessonView({ topic, lesson }: ChallengeLessonViewProps) {
  const nav = useMemo(
    () => [
      { id: "briefing", label: "Start here" },
      { id: "story", label: "The incident" },
      ...lesson.stages.map((stage, index) => ({
        id: stage.id,
        label: `${String(index + 1).padStart(2, "0")}  ${stage.title}`,
      })),
      { id: "worked-example", label: "Worked example" },
      { id: "practice", label: "Try it" },
      { id: "takeaways", label: "Keep these" },
      { id: "mistakes", label: "Avoid these" },
      { id: "interviews", label: "Interview" },
      { id: "glossary", label: "Words we used" },
    ],
    [lesson.stages]
  );

  const [active, setActive] = useState(nav[0]?.id ?? "briefing");
  const pinUntil = useRef(0);

  const sectionFromScroll = useCallback(() => {
    const header = document.querySelector("header");
    const offset = Math.round((header?.getBoundingClientRect().bottom ?? 56) + 48);
    let current = nav[0]?.id ?? "briefing";
    for (const item of nav) {
      const node = document.getElementById(item.id);
      if (!node) continue;
      if (node.getBoundingClientRect().top <= offset) current = item.id;
    }
    return current;
  }, [nav]);

  useEffect(() => {
    const sync = () => {
      if (Date.now() < pinUntil.current) return;
      const next = sectionFromScroll();
      setActive((prev) => (prev === next ? prev : next));
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sectionFromScroll]);

  const jumpTo = (id: string) => {
    setActive(id);
    pinUntil.current = Date.now() + 1600;
  };

  const stageIndex = Math.max(
    0,
    lesson.stages.findIndex((stage) => stage.id === active)
  );
  const progress =
    active === "briefing" || active === "story"
      ? 8
      : Math.round(((stageIndex + 1) / (lesson.stages.length + 4)) * 100);

  return (
    <div className="min-h-[calc(100dvh-5.5rem)]">
      <section className="ch-hero px-4 pb-10 pt-6 sm:px-8">
        <div className="relative mx-auto max-w-[90rem]">
          <Link
            href="/challenge"
            className="ch-ui mb-6 inline-flex items-center gap-1.5 text-sm text-[#d7cbb6] hover:text-[#f6ebd4]"
          >
            <ArrowLeft className="h-4 w-4" />
            Draw another
          </Link>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <p className="ch-kicker">{topic.category}</p>
            <span className="ch-chip rounded-full border border-[#c4a574]/25 bg-white/5 px-2.5 py-1 text-[#d7cbb6]">
              {topic.minutes} min
            </span>
            <span className="ch-chip rounded-full border border-[#c4a574]/25 bg-white/5 px-2.5 py-1 text-[#d7cbb6]">
              {lesson.stages.length} stages
            </span>
          </div>
          <h1 className="ch-display max-w-4xl text-4xl leading-[1.05] text-[#f6ebd4] sm:text-6xl">
            {topic.title}
          </h1>
          <p className="ch-serif mt-4 max-w-2xl text-lg leading-relaxed text-[#d7cbb6]">
            {topic.tagline}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {(["beginner", "intermediate", "advanced"] as ChallengeLevel[]).map((level, i) => (
              <span
                key={level}
                className="ch-chip inline-flex items-center gap-2 rounded-full border border-[#c4a574]/20 bg-white/5 px-3 py-1 text-[#f6ebd4]"
              >
                {i + 1}. {levelTheme[level].label}
              </span>
            ))}
            <div className="ml-auto">
              <ModuleCompleteButton
                phaseSlug="challenge"
                moduleSlug={topic.slug}
                moduleTitle={topic.title}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="ch-letter rounded-t-[1.6rem]">
        <div className="h-1 bg-[#e4d6be]">
          <div
            className="h-full bg-[#9f1239] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mx-auto max-w-[90rem] px-4 pt-4 sm:px-8 lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-active={active === item.id}
                className="ch-path-chip"
                onClick={() => jumpTo(item.id)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="relative mx-auto grid max-w-[90rem] gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[16.5rem_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="ch-rail sticky top-6 rounded-2xl p-4">
              <p className="ch-chip mb-2 text-[#e8c9a0]">Contents</p>
              <p className="ch-ui mb-4 text-sm leading-relaxed text-[#c4b8a6]">{topic.whyToday}</p>
              <nav className="max-h-[68vh] space-y-0.5 overflow-auto pr-1">
                {nav.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    data-active={active === item.id}
                    className="ch-rail-link"
                    onClick={() => jumpTo(item.id)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="min-w-0 space-y-8 pb-16">
            <section id="briefing" className="ch-anchor grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-[var(--ch-rule)] bg-[var(--ch-card)] p-6">
                <p className="ch-chip mb-3 inline-flex items-center gap-2 text-[#9f1239]">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Who is teaching
                </p>
                <p className="ch-serif text-[1.08rem] leading-relaxed text-[var(--ch-body)]">
                  {lesson.instructor}
                </p>
              </div>
              <div className="rounded-2xl bg-[#1d1712] p-6 text-[#f6ebd4]">
                <p className="ch-chip mb-3 text-[#e8c9a0]">By the end</p>
                <p className="ch-serif text-[1.08rem] leading-relaxed text-[#f6ebd4]">
                  {lesson.promise}
                </p>
              </div>
            </section>

            <section id="story" className="ch-case ch-anchor rounded-2xl">
              <div className="flex items-center justify-between gap-3 border-b border-[#e8c9a0] px-6 py-3">
                <p className="ch-chip text-[#9a5b1f]">The incident</p>
                <span className="ch-ui text-xs text-[#9a5b1f]/80">Why this sitting exists</span>
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="ch-display mb-4 max-w-3xl text-3xl leading-tight text-[var(--ch-ink)]">
                  {lesson.story.title}
                </h2>
                <Prose paragraphs={lesson.story.body} />
                <p className="mt-6 rounded-xl border border-[#e8c9a0] bg-white/70 px-4 py-3 ch-serif text-[1.05rem] leading-relaxed text-[var(--ch-ink)]">
                  <span className="ch-chip mr-2 text-[#9a5b1f]">Moral</span>
                  {lesson.story.moral}
                </p>
              </div>
            </section>

            <div className="space-y-8">
              {lesson.stages.map((stage, index) => {
                const showLevel = index === 0 || lesson.stages[index - 1]?.level !== stage.level;
                const theme = levelTheme[stage.level];
                return (
                  <section key={stage.id} id={stage.id} className="ch-anchor">
                    {showLevel ? (
                      <div className={cn("mb-4 inline-flex rounded-full border px-3 py-1", theme.wash)}>
                        <span className={cn("ch-chip", theme.ink)}>{theme.label} stretch</span>
                      </div>
                    ) : null}
                    <article className="ch-stage-card rounded-2xl">
                      <div className={cn("h-1 bg-gradient-to-r", theme.bar)} />
                      <div className="p-5 sm:p-8">
                        <p className="ch-ui mb-2 text-xs text-[var(--ch-muted)]">
                          Stage {index + 1} of {lesson.stages.length}
                        </p>
                        <h2 className="ch-display mb-5 text-[1.85rem] leading-tight sm:text-[2.15rem]">
                          <span className="mr-3 text-[#9f1239]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {stage.title}
                        </h2>
                        <Prose paragraphs={stage.body} />
                        {stage.diagrams?.map((diagram) => (
                          <figure key={diagram.title} className="ch-diagram-board p-3">
                            <MermaidDiagram
                              chart={diagram.chart}
                              title={diagram.title}
                              editorial
                              zoomable
                            />
                            {diagram.caption ? (
                              <figcaption>{diagram.caption}</figcaption>
                            ) : null}
                          </figure>
                        ))}
                        {stage.codes?.map((block) => (
                          <div key={block.title} className="mt-6 overflow-hidden rounded-xl">
                            <LessonCodeBlock
                              code={block.code}
                              language={block.language}
                              title={block.title}
                            />
                          </div>
                        ))}
                      </div>
                    </article>
                  </section>
                );
              })}
            </div>

            <section
              id="worked-example"
              className="ch-anchor rounded-2xl border border-[var(--ch-rule)] bg-[var(--ch-card)] p-6 sm:p-8"
            >
              <h2 className="ch-display mb-3 flex items-center gap-2 text-2xl">
                <BookOpen className="h-5 w-5 text-[#9f1239]" />
                {lesson.workedExample.title}
              </h2>
              <p className="ch-serif text-[1.08rem] leading-relaxed text-[var(--ch-body)]">
                {lesson.workedExample.setup}
              </p>
              <ol className="mt-6 space-y-4">
                {lesson.workedExample.walkthrough.map((step, index) => (
                  <li key={step} className="flex gap-4">
                    <span className="ch-display w-8 shrink-0 text-[#9f1239]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="ch-serif text-[1.06rem] leading-relaxed text-[var(--ch-body)]">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
              <p className="mt-6 rounded-xl bg-[#fff1f2] px-4 py-3 ch-serif text-[1.06rem] leading-relaxed text-[#4c0519]">
                {lesson.workedExample.result}
              </p>
            </section>

            <section
              id="practice"
              className="ch-anchor rounded-2xl bg-[#1d1712] p-6 text-[#f6ebd4] sm:p-8"
            >
              <p className="ch-chip mb-2 text-[#e8c9a0]">Your turn</p>
              <h2 className="ch-display mb-3 flex items-center gap-2 text-2xl">
                <PenLine className="h-5 w-5 text-[#e8c9a0]" />
                {lesson.practice.title}
              </h2>
              <p className="ch-serif text-[1.08rem] leading-relaxed text-[#f6ebd4]">
                {lesson.practice.task}
              </p>
              <p className="ch-ui mt-4 rounded-xl bg-white/5 px-4 py-3 text-sm leading-relaxed text-[#d7cbb6]">
                Hint: {lesson.practice.hint}
              </p>
              <details className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <summary className="cursor-pointer text-sm font-medium text-[#e8c9a0]">
                  Show a solid answer
                </summary>
                <p className="mt-3 ch-serif text-[1.06rem] leading-relaxed text-[#f6ebd4]">
                  {lesson.practice.solution}
                </p>
              </details>
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
              <section
                id="takeaways"
                className="ch-anchor rounded-2xl border border-[var(--ch-rule)] bg-[var(--ch-card)] p-6"
              >
                <h2 className="ch-display mb-4 flex items-center gap-2 text-2xl">
                  <Lightbulb className="h-5 w-5 text-[#9f1239]" />
                  Keep these
                </h2>
                <ol className="space-y-3">
                  {lesson.takeaways.map((item, index) => (
                    <li key={item} className="flex gap-3">
                      <span className="ch-display text-[#9f1239]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="ch-serif text-[1.02rem] leading-relaxed text-[var(--ch-body)]">
                        {item}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
              <section
                id="mistakes"
                className="ch-anchor rounded-2xl border border-[#e8c9a0] bg-[#fff4e4] p-6"
              >
                <h2 className="ch-display mb-4 flex items-center gap-2 text-2xl">
                  <TriangleAlert className="h-5 w-5 text-[#9a5b1f]" />
                  Avoid these
                </h2>
                <ol className="space-y-3">
                  {lesson.mistakes.map((item, index) => (
                    <li key={item} className="flex gap-3">
                      <span className="ch-display text-[#9a5b1f]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="ch-serif text-[1.02rem] leading-relaxed text-[var(--ch-body)]">
                        {item}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <section id="interviews" className="ch-anchor space-y-3">
              {lesson.interviews.map((item) => (
                <details
                  key={item.question}
                  className="rounded-2xl border border-[var(--ch-rule)] bg-[var(--ch-card)] px-6 py-5"
                >
                  <summary className="cursor-pointer">
                    <p className="ch-chip mb-2 text-[#9f1239]">Interview · {item.difficulty}</p>
                    <p className="ch-display text-xl leading-snug">{item.question}</p>
                    <p className="ch-ui mt-2 text-xs text-[var(--ch-muted)]">Open for a solid answer</p>
                  </summary>
                  <p className="mt-4 border-t border-[var(--ch-rule)] pt-4 ch-serif text-[1.06rem] leading-relaxed text-[var(--ch-body)]">
                    {item.answer}
                  </p>
                </details>
              ))}
            </section>

            <section
              id="glossary"
              className="ch-anchor rounded-2xl border border-[var(--ch-rule)] bg-[var(--ch-card)] p-6"
            >
              <h2 className="ch-display mb-4 flex items-center gap-2 text-2xl">
                <ListChecks className="h-5 w-5 text-[#9f1239]" />
                Words we used
              </h2>
              <dl className="grid gap-3 sm:grid-cols-2">
                {lesson.glossary.map((item) => (
                  <div
                    key={item.term}
                    className="rounded-xl border-l-4 border-[#9f1239] bg-[var(--ch-paper)] p-4"
                  >
                    <dt className="ch-display text-lg">{item.term}</dt>
                    <dd className="mt-1 ch-serif text-[1.02rem] leading-relaxed text-[var(--ch-body)]">
                      {item.meaning}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <ModuleCompleteButton
                phaseSlug="challenge"
                moduleSlug={topic.slug}
                moduleTitle={topic.title}
              />
              <Link href="/challenge" className="ch-ui text-sm font-medium text-[#9f1239] hover:underline">
                Draw another challenge →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
