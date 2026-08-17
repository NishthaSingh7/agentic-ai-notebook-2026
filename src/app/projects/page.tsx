import type { Metadata } from "next";
import { ProjectsIndex } from "@/components/projects-index";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Hands-on AI Engineering projects from beginner to production — with architecture diagrams, walkthrough slides, time breakdowns, and resume points.",
};

export default function ProjectsPage() {
  return <ProjectsIndex />;
}
