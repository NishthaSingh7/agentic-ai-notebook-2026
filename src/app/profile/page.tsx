import type { Metadata } from "next";
import { ProfileContent } from "@/components/profile-content";

export const metadata: Metadata = {
  title: "Profile",
  description: "See how far you've come — modules, phases, and what's next on the roadmap.",
};

export default function ProfilePage() {
  return <ProfileContent />;
}
