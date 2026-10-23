import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Phase, Module } from "@/data/roadmap";
import type { NextCard } from "@/data/spoken-lessons";
import type { SpokenLesson, ToolLink } from "@/data/spoken-types";
import { DiagramPeek } from "@/components/diagram-peek";
import { ModuleCompleteButton } from "@/components/module-complete-button";
import { LessonCodeBlock } from "@/components/lesson-code-block";

const CHAT_URLS = new Set([
  "https://chatgpt.com",
  "https://claude.ai",
  "https://gemini.google.com",
]);

interface ToolCard {
  key: string;
  links: { name: string; url: string }[];
  line: string;
  detail: string | null;
  stop: string;
  lastChecked: string;
}

function toolCards(tools: ToolLink[]): ToolCard[] {
  const chats = tools.filter((item) => CHAT_URLS.has(item.url));
  const rest = tools.filter((item) => !CHAT_URLS.has(item.url));
  const cards: ToolCard[] = [];

  if (chats.length > 1) {
    cards.push({
      key: "everyday-chats",
      links: chats.map((item) => ({ name: item.name, url: item.url })),
      line: "One of these is enough. They do the same job for this module.",
      detail: null,
      stop: "Do the try on this page once, then come back. You do not need to repeat it in the other apps.",
      lastChecked: chats[0].lastChecked,
    });
  } else if (chats[0]) {
    cards.push(toCard(chats[0]));
  }

  for (const item of rest) cards.push(toCard(item));
  return cards;
}

function toCard(item: ToolLink): ToolCard {
  const open = item.open.trim();
  const genericOpen = /^open a new chat\b/i.test(open);
  return {
    key: `${item.url}-${item.name}`,
    links: [{ name: item.name, url: item.url }],
    line: item.line,
    detail: genericOpen ? null : open,
    stop: item.stop,
    lastChecked: item.lastChecked,
  };
}

interface SpokenLessonViewProps {
  phase: Phase;
  mod: Module;
  lesson: SpokenLesson;
  minutes: number;
  nextCard: NextCard | null;
  prevHref: string | null;
  prevTitle: string | null;
}

export function SpokenLessonView({
  phase,
  mod,
  lesson,
  minutes,
  nextCard,
  prevHref,
  prevTitle,
}: SpokenLessonViewProps) {
  const cards = toolCards(lesson.tools);

  return (
    <article className="mx-auto w-full min-w-0 max-w-7xl px-4 py-10 sm:px-6">
      <Link
        href={`/roadmap/${phase.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> {phase.title}
      </Link>

      <header className="mb-8">
        <p className="text-xs text-text-muted">{phase.subtitle}</p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">{mod.title}</h1>
          <ModuleCompleteButton phaseSlug={phase.slug} moduleSlug={mod.slug} moduleTitle={mod.title} />
        </div>
        <p className="mt-2 text-sm text-text-muted">About {minutes} min. You can leave whenever.</p>
      </header>

      <section className={`w-1/2 min-w-0 rounded-2xl p-5 sm:p-6 ${phase.color}`}>
        <h2 className="text-sm font-semibold text-text-primary">A picture to keep</h2>
        <DiagramPeek chart={lesson.picture} />
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">{lesson.pictureCaption}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-text-primary">Story</h2>
        <p className="mt-2 text-base leading-relaxed text-text-secondary">{lesson.story}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-text-primary">In plain words</h2>
        <p className="mt-2 text-base leading-relaxed text-text-secondary">{lesson.plain}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-text-primary">Example</h2>
        <p className="mt-2 text-base leading-relaxed text-text-secondary">{lesson.example}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-text-primary">Try this</h2>
        <p className="mt-2 text-base leading-relaxed text-text-secondary">{lesson.tryThis}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-text-primary">Tools and websites</h2>
        <ul className={`mt-3 grid gap-3 ${cards.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {cards.map((item) => (
            <li key={item.key} className="rounded-xl border border-border bg-surface p-4">
              <p className="font-medium">
                {item.links.map((link, index) => (
                  <span key={link.url}>
                    {index > 0 ? <span className="text-text-muted"> · </span> : null}
                    <a href={link.url} className="text-accent hover:underline" target="_blank" rel="noreferrer">
                      {link.name}
                    </a>
                  </span>
                ))}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">{item.line}</p>
              {item.detail ? <p className="mt-2 text-sm text-text-primary">{item.detail}</p> : null}
              <p className="mt-1 text-sm text-text-primary">{item.stop}</p>
              <p className="mt-2 text-xs text-text-muted">Last checked {item.lastChecked}</p>
            </li>
          ))}
        </ul>
      </section>

      {lesson.oneFunction ? (
        <section className="mt-8">
          <h2 className="text-sm font-semibold text-text-primary">{lesson.oneFunction.title}</h2>
          <p className="mt-2 text-base leading-relaxed text-text-secondary">{lesson.oneFunction.why}</p>
          <div className="mt-3">
            <LessonCodeBlock code={lesson.oneFunction.code} language={lesson.oneFunction.language} title={lesson.oneFunction.title} />
          </div>
        </section>
      ) : null}

      <p className={`mt-8 rounded-2xl px-5 py-4 text-base leading-relaxed text-text-primary ${phase.color}`}>
        {lesson.remember}
      </p>

      <nav className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-stretch sm:justify-between">
        {prevHref ? (
          <Link href={prevHref} className="text-sm text-text-secondary hover:text-accent">
            <ArrowLeft className="mr-1 inline h-3.5 w-3.5" />
            {prevTitle}
          </Link>
        ) : (
          <span />
        )}
        {nextCard ? (
          <Link
            href={nextCard.href}
            className="rounded-2xl border border-border bg-surface p-4 transition-colors hover:bg-surface-elevated sm:max-w-sm sm:text-right"
          >
            <p className="text-xs text-text-muted">{nextCard.kicker}</p>
            <p className="mt-1 font-semibold text-text-primary">{nextCard.title}</p>
            <p className="mt-1 text-sm text-text-secondary">{nextCard.question}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-sm text-accent">
              Open it <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
