import type { Metadata } from "next";
import { ProfileContent } from "@/components/profile-content";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your medals, the chapter you're in, and what's next on the roadmap.",
};

export default function ProfilePage() {
  return <ProfileContent />;
}
