import readingTime from "reading-time";
import type { LessonContent } from "@/data/lesson-types";

/** Text shown on the lesson page (excludes revision notes — those have their own durations). */
function getLessonReadableText(lesson: LessonContent): string {
  return [
    lesson.concept,
    lesson.whyItExists,
    lesson.analogy,
    lesson.technicalExplanation,
    lesson.architecture,
    lesson.example,
    lesson.code,
    lesson.project,
    ...(lesson.commonMistakes ?? []),
    ...lesson.interviewQuestions.flatMap((q) => [q.question, q.answer]),
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** Estimated read time in minutes, based on actual lesson content length. */
export function calculateLessonReadMinutes(lesson: LessonContent): number {
  const text = getLessonReadableText(lesson);
  const stats = readingTime(text, { wordsPerMinute: 200 });

  let minutes = Math.ceil(stats.minutes);
  if (lesson.diagram) minutes += 1;

  return Math.max(1, minutes);
}
