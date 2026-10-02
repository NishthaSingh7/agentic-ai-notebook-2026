import type { Metadata } from "next";
import { ChallengeHub } from "@/components/challenge-hub";

export const metadata: Metadata = {
  title: "Challenge for a Day",
  description:
    "Draw a random 2026 agentic AI topic and learn it beginner to advanced — theory, diagrams, and code — in one sitting.",
};

export default function ChallengePage() {
  return <ChallengeHub />;
}
