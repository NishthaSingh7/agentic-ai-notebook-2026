import { getChapterBuilds, totalModules, totalPhases } from "@/data/roadmap";
import { interviewTopics } from "@/data/interview";
import { getInterviewQuestions } from "@/data/interview-questions";
import { glossary } from "@/data/glossary";

export const siteStats = {
  phases: totalPhases,
  modules: totalModules,
  interviewQuestions: interviewTopics.reduce(
    (total, topic) => total + getInterviewQuestions(topic.slug).length,
    0
  ),
  projects: getChapterBuilds().length,
  glossaryTerms: glossary.length,
} as const;
