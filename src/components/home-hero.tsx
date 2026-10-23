import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export function HomeHero() {
  return (
    <section className="border-b border-border bg-surface-elevated/80">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-sm text-accent">{siteConfig.hero.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
          Learn AI the way a friend would explain it.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-text-secondary">
          The roadmap is the order that works if you want to understand a topic and use it in a project.
          You can still open any card. Notes is where topics that have already been studied get written up.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/roadmap/meet-ai"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-on-accent"
          >
            Start at the beginning <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/roadmap" className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm text-text-secondary">
            I already know some of this
          </Link>
        </div>
      </div>
    </section>
  );
}
