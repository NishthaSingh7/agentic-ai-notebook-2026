import { phases, totalModules } from "@/data/roadmap";
import { interviewTopics } from "@/data/interview";
import { getInterviewQuestions } from "@/data/interview-questions";
import { projects } from "@/data/projects";
import { glossary } from "@/data/glossary";

export const siteStats = {
  phases: phases.length,
  modules: totalModules,
  interviewQuestions: interviewTopics.reduce(
    (total, topic) => total + getInterviewQuestions(topic.slug).length,
    0
  ),
  projects: projects.length,
  glossaryTerms: glossary.length,
} as const;
