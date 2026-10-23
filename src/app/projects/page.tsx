import type { Metadata } from "next";
import Link from "next/link";
import { getChapterBuilds } from "@/data/roadmap";

export const metadata: Metadata = {
  title: "Projects",
  description: "The small build at the end of each chapter. Same work as the roadmap, not a second course.",
};

export default function ProjectsPage() {
  const builds = getChapterBuilds();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold">Projects</h1>
      <p className="mt-3 text-base leading-relaxed text-text-secondary">
        Each chapter ends with one small build. This is that list. Chapter 9 is the bigger one. You are not starting a second course.
      </p>
      <ul className="mt-8 space-y-3">
        {builds.map(({ phase, module, href }) => (
          <li key={href}>
            <Link href={href} className={`block rounded-2xl p-4 text-text-primary ${phase.color}`}>
              <p className="text-xs">{phase.subtitle}</p>
              <p className="mt-1 font-medium">{module.title}</p>
              <p className="mt-1 text-sm">{module.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
