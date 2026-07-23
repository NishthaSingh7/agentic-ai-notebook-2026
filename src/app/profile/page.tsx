import type { Metadata } from "next";
import { ProfileContent } from "@/components/profile-content";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your learning progress across all roadmap phases and modules.",
};

export default function ProfilePage() {
  return <ProfileContent />;
}
