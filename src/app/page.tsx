import Link from "next/link";
import { mainPhases, sidePhases } from "@/data/roadmap";
import { PhaseCard } from "@/components/phase-card";
import { HomeHero } from "@/components/home-hero";
import { ProgressBar } from "@/components/progress-bar";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <ProgressBar />
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-semibold">The path</h2>
        <p className="mt-2 max-w-2xl text-text-secondary">
          This is how to learn it properly. Each card shows what is inside. Open any of them.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {mainPhases.map((phase, index) => (
            <PhaseCard key={phase.slug} phase={phase} index={index} />
          ))}
        </div>
        <h2 className="mt-14 text-2xl font-semibold">If you want them</h2>
        <p className="mt-2 max-w-2xl text-text-secondary">
          Coding basics, and how models are built. The path does not wait on these.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {sidePhases.map((phase, index) => (
            <PhaseCard key={phase.slug} phase={phase} index={index} />
          ))}
        </div>
        <p className="mt-10 text-sm text-text-secondary">
          Topics that have already been studied get written up in{" "}
          <Link href="/notes" className="text-accent hover:underline">
            Notes
          </Link>
          . That is not the path, and it is not a list of what you have finished.
        </p>
      </section>
    </>
  );
}
